import http.client
import json
import threading
import time
import unittest
from email.message import Message
from functools import partial
from http.server import ThreadingHTTPServer
from unittest.mock import patch
from urllib.request import Request, urlopen

import server


class SellingPointResearchTests(unittest.TestCase):
    @staticmethod
    def response(searched=True):
        return {"output": ([{"type": "web_search_call", "status": "completed"}] if searched else []) + [
            {"type": "message", "content": [{"type": "output_text", "text": json.dumps({
                "english_product_keyword": "Chenille mop replacement pad",
                "search_queries": ["chenille mop replacement pad washable"],
                "selling_points": [{"claim": "Machine washable chenille mop pad",
                    "evidence_url": "https://example.invalid/mop",
                    "evidence_quote": "Machine washable chenille replacement pads"}],
            })}]}]}

    def test_custom_search_payload_and_grounded_result(self):
        with patch.object(server, "_read_ark_search_response", return_value=self.response()) as read:
            result = server.fetch_ark_selling_points("Chenille mop pad", "ark-test", "doubao-test")
        body = json.loads(read.call_args.args[0].data)
        self.assertEqual(body["tools"], [{"type": "web_search", "sources": ["doubao"]}])
        self.assertEqual(body["tool_choice"], "required")
        self.assertEqual(body["thinking"], {"type": "disabled"})
        self.assertTrue(body["stream"])
        self.assertEqual(result[0], ["Machine washable chenille mop pad"])
        self.assertFalse(result[2])

    def test_model_claim_without_search_is_rejected(self):
        with patch.object(server, "_read_ark_search_response", return_value=self.response(False)):
            result = server.fetch_ark_selling_points("Chenille mop pad", "ark-test", "doubao-test")
        self.assertFalse(result[0])
        self.assertIn("未实际执行", result[2][0])

    def test_failed_search_cannot_be_masked_by_usage_count(self):
        payload = {"output": [{"type": "web_search_call", "status": "failed"}],
                   "usage": {"tool_usage": {"web_search": 1}}}
        self.assertFalse(server._response_used_web_search(payload))

    def test_stream_returns_at_completion_without_waiting_for_socket_close(self):
        payload = self.response()
        class Reply:
            headers = Message()
            headers["Content-Type"] = "text/event-stream"
            def __enter__(self): return self
            def __exit__(self, *_): return False
            def __iter__(self):
                yield b'data: {"type":"response.created"}\n'
                yield ("data: " + json.dumps({"type": "response.completed", "response": payload}) + "\n").encode()
                raise http.client.RemoteDisconnected("socket closed after completion")
        with patch.object(server.urllib.request, "urlopen", return_value=Reply()):
            actual = server._read_ark_search_response(Request("https://example.invalid/search"))
        self.assertEqual(actual, payload)

    def test_transport_error_redacts_secret(self):
        with patch.object(server, "_read_ark_search_response",
                          side_effect=http.client.RemoteDisconnected("connection ended ark-test")):
            result = server.fetch_ark_selling_points("Chenille mop pad", "ark-test", "doubao-test")
        self.assertFalse(result[0])
        self.assertIn("RemoteDisconnected", result[2][0])
        self.assertNotIn("ark-test", result[2][0])


class LocalResearchHttpTests(unittest.TestCase):
    def setUp(self):
        server.SELLING_POINT_CACHE.clear()
        server.BACKGROUND_JOBS.clear()
        class QuietHandler(server.PromptToolHandler):
            def log_message(self, *_): pass
        self.http = ThreadingHTTPServer(("127.0.0.1", 0), partial(QuietHandler, directory=str(server.ROOT)))
        self.worker = threading.Thread(target=self.http.serve_forever, daemon=True)
        self.worker.start()
        self.base = "http://127.0.0.1:" + str(self.http.server_address[1])

    def tearDown(self):
        self.http.shutdown()
        self.http.server_close()
        self.worker.join()
        server.SELLING_POINT_CACHE.clear()
        server.BACKGROUND_JOBS.clear()

    def post(self, payload):
        req = Request(self.base + "/api/selling-points", data=json.dumps(payload).encode(),
                      headers={"Content-Type": "application/json"})
        with urlopen(req, timeout=2) as response:
            return response.status, json.load(response)

    def test_async_ack_then_poll_and_cache_with_new_model(self):
        release = threading.Event()
        def research(*_):
            release.wait(3)
            return ["Machine washable chenille mop pad"], ["https://example.invalid/mop"], [], "Chenille mop pad", []
        payload = {"productName": "Chenille mop pad", "async": True}
        with patch.dict(server.os.environ, {"ARK_API_KEY": "ark-test", "ARK_MODEL": "new-model"}), \
                patch.object(server, "fetch_ark_selling_points", side_effect=research) as fetch:
            try:
                started = time.monotonic()
                status, data = self.post(payload)
                self.assertLess(time.monotonic() - started, 2)
                self.assertEqual(status, 202)
                self.assertTrue(data["job_id"])
                with urlopen(self.base + "/api/background-jobs/" + data["job_id"], timeout=2) as response:
                    self.assertEqual(response.status, 202)
                release.set()
                deadline = time.monotonic() + 2
                while True:
                    with urlopen(self.base + "/api/background-jobs/" + data["job_id"], timeout=2) as response:
                        status, completed = response.status, json.load(response)
                    if status != 202 or time.monotonic() >= deadline: break
                    time.sleep(0.01)
                self.assertEqual(status, 200)
                self.assertEqual(completed["selling_points"], ["Machine washable chenille mop pad"])
                status, cached = self.post(payload)
                self.assertEqual(status, 200)
                self.assertEqual(cached, completed)
                self.assertEqual(fetch.call_count, 1)
                self.assertEqual(fetch.call_args.args[-1], "new-model")
                with patch.dict(server.os.environ, {"ARK_MODEL": "other-model"}):
                    status, _ = self.post({"productName": "Chenille mop pad"})
                    self.assertEqual(status, 200)
                    self.assertEqual(fetch.call_count, 2, "model changes invalidate old results")
            finally:
                release.set()

    def test_missing_key_does_not_start_a_job(self):
        with patch.dict(server.os.environ, {"ARK_API_KEY": ""}):
            status, result = self.post({"productName": "Chenille mop pad", "async": True})
        self.assertEqual(status, 200)
        self.assertTrue(result["errors"])
        self.assertFalse(server.BACKGROUND_JOBS)

    def test_unknown_job_explains_restart_and_worker_failure_is_safe(self):
        result, status = server.background_job_result("missing-job")
        self.assertEqual(status, 404)
        self.assertIn("重启", result["error"])
        def fail(): raise RuntimeError("ark-private-secret")
        result, _ = server.start_background_job(fail)
        future = server.BACKGROUND_JOBS[result["job_id"]][1]
        with self.assertRaises(RuntimeError): future.result(timeout=2)
        result, status = server.background_job_result(result["job_id"])
        self.assertEqual(status, 502)
        self.assertNotIn("ark-private-secret", json.dumps(result))


if __name__ == "__main__":
    unittest.main()
