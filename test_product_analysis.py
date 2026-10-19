import json
import unittest
from unittest import mock

import server


class _Response:
    def __init__(self, payload):
        self.payload = payload

    def __enter__(self):
        return self

    def __exit__(self, *_args):
        return False

    def read(self, _limit):
        return json.dumps(self.payload).encode("utf-8")


def _ark_response(value):
    return {
        "output": [{
            "type": "message",
            "content": [{"type": "output_text", "text": json.dumps(value)}],
        }],
    }


class ProductAnalysisTests(unittest.TestCase):
    @mock.patch.object(server, "vision_content_for_images", return_value=([], []))
    @mock.patch.object(server.urllib.request, "urlopen")
    def test_doubao_selects_one_shared_image_list_and_evidence_is_kept(self, urlopen, _vision):
        urls = [f"https://cbu01.alicdn.com/img/ibank/{index}.jpg" for index in range(3)]
        urlopen.return_value = _Response(_ark_response({
            "image_selection": [
                {"image_ref": "Image 1", "keep": False, "image_type": "feature", "reason": "Difficult to read"},
                {"image_ref": "Image 2", "keep": False, "image_type": "other", "reason": "Shop service"},
                {"image_ref": "Image 3", "keep": True, "image_type": "hero", "reason": "Product photo"},
            ],
            "selling_points": [{"claim": "Even oil mist", "evidence": "均匀雾化", "image_ref": "Image 1"}],
        }))
        result = server.fetch_ark_product_analysis("Oil Sprayer", "", urls, "ark-test", "doubao-test")
        self.assertEqual([urls[0], urls[2]], [item["url"] for item in result["selected_images"]])
        self.assertEqual([urls[1]], [item["url"] for item in result["rejected_images"]])
        self.assertEqual(urls[0], result["selling_points"][0]["image_url"])

    @mock.patch.object(server, "fetch_ark_product_analysis")
    def test_every_source_image_is_sent_in_batches(self, analyze):
        urls = [f"https://cbu01.alicdn.com/img/ibank/{index}.jpg" for index in range(25)]
        def result(_identity, _evidence, batch, _key, _model):
            return {
                "product_name": {}, "attributes": [], "dimensions": [], "use_scenes": [],
                "selling_points": [{"claim": "Even oil mist", "evidence": "均匀雾化", "image_url": batch[-1]}]
                if batch[-1] == urls[-1] else [],
                "evidence_urls": [batch[-1]], "errors": [],
            }
        analyze.side_effect = result
        merged = server.fetch_ark_product_analysis_batches("oil sprayer", "", urls, "ark-test", "doubao-test")
        self.assertEqual([12, 12, 1], [len(call.args[2]) for call in analyze.call_args_list])
        self.assertEqual(urls, [url for call in analyze.call_args_list for url in call.args[2]])
        self.assertEqual(urls[-1], merged["selling_points"][0]["image_url"])

    @mock.patch.object(server, "vision_content_for_images", return_value=([], []))
    @mock.patch.object(server.urllib.request, "urlopen")
    def test_malformed_general_json_still_runs_focused_pass(self, urlopen, _vision):
        urlopen.side_effect = [
            _Response({"output": [{"type": "message", "content": [{"type": "output_text", "text": "not json"}]}]}),
            _Response(_ark_response({"selling_points": [{
                "claim": "Even oil mist", "evidence": "均匀雾化", "image_ref": "Image 1",
            }]})),
        ]
        result = server.fetch_ark_product_analysis("Oil Sprayer", "", ["https://cbu01.alicdn.com/img/ibank/example.jpg"], "ark-test", "doubao-test")
        self.assertEqual("Even oil mist", result["selling_points"][0]["claim"])

    @mock.patch.object(server, "vision_content_for_images", return_value=([], []))
    @mock.patch.object(server.urllib.request, "urlopen")
    def test_missing_general_selling_points_get_focused_image_pass(self, urlopen, _vision):
        urlopen.side_effect = [
            _Response(_ark_response({
                "product_name": {"value": "Oil Sprayer", "evidence": "喷雾油瓶", "image_ref": "Image 1"},
                "attributes": [],
                "dimensions": [],
                "selling_points": [],
                "use_scenes": [],
            })),
            _Response(_ark_response({
                "selling_points": [{
                    "claim": "Even fan-shaped mist",
                    "evidence": "扇形广角喷嘴 让油雾细腻均匀",
                    "image_ref": "Image 1",
                }],
            })),
        ]

        result = server.fetch_ark_product_analysis(
            "Product name: Oil Sprayer",
            "",
            ["https://cbu01.alicdn.com/img/ibank/example.jpg"],
            "ark-test",
            "doubao-test",
        )

        self.assertEqual(["Even fan-shaped mist"], [item["claim"] for item in result["selling_points"]])
        self.assertEqual(2, urlopen.call_count)

    @mock.patch.object(server, "vision_content_for_images", return_value=([], []))
    @mock.patch.object(server.urllib.request, "urlopen")
    def test_existing_image_selling_points_do_not_trigger_focused_pass(self, urlopen, _vision):
        urlopen.return_value = _Response(_ark_response({
            "product_name": {},
            "attributes": [],
            "dimensions": [],
            "selling_points": [{
                "claim": "Precise 0.3 ml spray",
                "evidence": "一次喷雾约0.3ml",
                "image_ref": "Image 1",
            }],
            "use_scenes": [],
        }))

        result = server.fetch_ark_product_analysis(
            "Product name: Oil Sprayer",
            "",
            ["https://cbu01.alicdn.com/img/ibank/example.jpg"],
            "ark-test",
            "doubao-test",
        )

        self.assertEqual(["Precise 0.3 ml spray"], [item["claim"] for item in result["selling_points"]])
        self.assertEqual(1, urlopen.call_count)


if __name__ == "__main__":
    unittest.main()
