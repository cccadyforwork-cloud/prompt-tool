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
    @mock.patch.object(server, "fetch_ark_image_selling_points", return_value=([], []))
    @mock.patch.object(server, "vision_content_for_images", return_value=([], []))
    @mock.patch.object(server.urllib.request, "urlopen")
    def test_competitor_uses_separate_vision_instructions(self, urlopen, _vision, _focused):
        urlopen.return_value = _Response(_ark_response({"image_selection": [
            {"image_ref": "Image 1", "keep": True, "image_type": "feature", "reason": "Relevant"},
        ]}))
        url = "https://m.media-amazon.com/images/I/example.jpg"
        result = server.fetch_ark_product_analysis("Amazon Child title", "", [url], "ark-test", "doubao-test", "competitor")
        request_body = json.loads(urlopen.call_args.args[0].data)
        self.assertEqual({"type": "disabled"}, request_body["thinking"])
        instruction = request_body["input"][0]["content"][0]["text"]
        self.assertIn("competitor images", instruction)
        self.assertIn("NOT verified photos of the current SKU", instruction)
        self.assertNotIn("1688 supplier images", instruction)
        self.assertEqual(url, result["selected_images"][0]["url"])

    @mock.patch.object(server, "fetch_ark_product_analysis_batches")
    def test_competitor_handler_uses_separate_cache_and_source(self, analyze):
        url = "https://m.media-amazon.com/images/I/example.jpg"
        analyze.return_value = {"product_name": {"value": "Competitor name"}, "attributes": [],
                                "dimensions": [], "selling_points": [{"claim": "Visible benefit"}],
                                "use_scenes": [], "use_behavior": {}, "selected_images": [{"url": url}], "errors": []}
        handler = object.__new__(server.PromptToolHandler)
        responses = []
        handler._send_json = lambda payload, status=200: responses.append((payload, status))
        with mock.patch.dict(server.os.environ, {"ARK_API_KEY": "ark-test"}):
            handler._handle_competitor_analysis({"amazonChildTitle": "Amazon Child title", "imageUrls": [url]})
        self.assertEqual("competitor", analyze.call_args.args[-1])
        self.assertEqual({}, responses[0][0]["product_name"])
        self.assertTrue(responses[0][0]["requires_human_confirmation"])
        self.assertEqual(["Doubao Competitor Vision"], responses[0][0]["sources"])
        self.assertFalse(server.PRODUCT_ANALYSIS_CACHE)

    @mock.patch.object(server, "vision_content_for_images", return_value=([], []))
    @mock.patch.object(server.urllib.request, "urlopen")
    def test_use_behavior_requires_supplier_image_and_keeps_it(self, urlopen, _vision):
        urls = [f"https://cbu01.alicdn.com/img/ibank/{index}.jpg" for index in range(2)]
        urlopen.return_value = _Response(_ark_response({
            "image_selection": [
                {"image_ref": "Image 1", "keep": True, "image_type": "hero", "reason": "Product"},
                {"image_ref": "Image 2", "keep": False, "image_type": "lifestyle", "reason": "Unclear"},
            ],
            "use_behavior": {
                "mode": "active", "action": "Press the top button to spray oil",
                "trigger": "top button", "output_origin": "bottom nozzle",
                "output_direction": "downward toward the pan",
                "operation_clarity": 3,
                "evidence": "Visible hand and bottom spray cone", "image_ref": "Image 2",
            },
        }))
        result = server.fetch_ark_product_analysis("Oil Sprayer", "", urls, "ark-test", "doubao-test")
        self.assertEqual(urls[1], result["use_behavior"]["image_url"])
        self.assertEqual("bottom nozzle", result["use_behavior"]["output_origin"])
        self.assertEqual(3, result["use_behavior"]["operation_clarity"])
        self.assertEqual(urls, [item["url"] for item in result["selected_images"]])
        self.assertEqual(2, len(urlopen.call_args_list))
        for call in urlopen.call_args_list:
            self.assertEqual({"type": "disabled"}, json.loads(call.args[0].data)["thinking"])

    @mock.patch.object(server, "fetch_ark_product_analysis")
    def test_clearest_operation_image_wins_across_batches(self, analyze):
        urls = [f"https://cbu01.alicdn.com/img/ibank/{index}.jpg" for index in range(13)]
        def result(_identity, _evidence, batch, _key, _model):
            clarity = 2 if batch[0] == urls[0] else 3
            return {
                "product_name": {}, "attributes": [], "dimensions": [], "selling_points": [],
                "use_scenes": [], "evidence_urls": [], "errors": [],
                "use_behavior": {"mode": "active", "action": "Press to spray", "image_url": batch[0],
                                 "trigger": "top button", "output_origin": "bottom nozzle",
                                 "operation_clarity": clarity},
            }
        analyze.side_effect = result
        merged = server.fetch_ark_product_analysis_batches("oil sprayer", "", urls, "ark-test", "doubao-test")
        self.assertEqual(urls[12], merged["use_behavior"]["image_url"])

    @mock.patch.object(server, "vision_content_for_images", return_value=([], []))
    @mock.patch.object(server.urllib.request, "urlopen")
    def test_unreferenced_use_behavior_is_ignored(self, urlopen, _vision):
        urlopen.return_value = _Response(_ark_response({
            "use_behavior": {"mode": "active", "action": "Spray oil", "evidence": "Visible", "image_ref": "Image 9"},
        }))
        result = server.fetch_ark_product_analysis(
            "Oil Sprayer", "", ["https://cbu01.alicdn.com/img/ibank/1.jpg"], "ark-test", "doubao-test",
        )
        self.assertEqual({}, result["use_behavior"])

    @mock.patch.object(server, "vision_content_for_images", return_value=([], []))
    @mock.patch.object(server.urllib.request, "urlopen")
    def test_detail_image_measurements_are_returned_with_evidence(self, urlopen, _vision):
        url = "https://cbu01.alicdn.com/img/ibank/size.jpg"
        urlopen.return_value = _Response(_ark_response({
            "attributes": [
                {"field": "Capacity", "value": "100 ml", "evidence": "容量100ml", "image_ref": "Image 1"},
                {"field": "ProductWeight", "value": "90", "evidence": "重量90", "image_ref": "Image 1"},
            ],
            "dimensions": [{"label": "Height", "value": "18 cm", "evidence": "高度18cm", "image_ref": "Image 1"}],
            "selling_points": [{"claim": "Even oil mist", "evidence": "均匀雾化", "image_ref": "Image 1"}],
        }))
        result = server.fetch_ark_product_analysis("Oil Sprayer", "", [url], "ark-test", "doubao-test")
        self.assertEqual(["Capacity"], [item["field"] for item in result["attributes"]])
        self.assertEqual(["Height: 18 cm"], result["dimensions"])
        self.assertEqual(url, result["dimension_evidence"][0]["image_url"])
        self.assertIn(url, result["evidence_urls"])

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

    @mock.patch.object(server, "fetch_ark_product_analysis")
    def test_later_batch_explicit_range_survives_four_point_limit(self, analyze):
        urls = [f"https://cbu01.alicdn.com/img/ibank/{index}.jpg" for index in range(13)]
        first_claims = [
            "Precise oil portion control", "Uniform atomized oil spray",
            "No dripping or residual oil", "Easy oil refilling",
        ]
        def result(_identity, _evidence, batch, _key, _model):
            claims = first_claims if batch[0] == urls[0] else ["Wide 60 degree spray range"]
            return {
                "product_name": {}, "attributes": [], "dimensions": [], "use_scenes": [],
                "selling_points": [{"claim": claim, "evidence": claim, "image_url": batch[0]} for claim in claims],
                "evidence_urls": [batch[0]], "errors": [],
            }
        analyze.side_effect = result
        merged = server.fetch_ark_product_analysis_batches("oil sprayer", "", urls, "ark-test", "doubao-test")
        self.assertEqual(4, len(merged["selling_points"]))
        self.assertEqual("Wide 60 degree spray range", merged["selling_points"][-1]["claim"])
        self.assertIn(urls[-1], [item["url"] for item in merged["selected_images"]])

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
    def test_focused_pass_keeps_independent_feature_claims_over_broad_summary(self, urlopen, _vision):
        urlopen.side_effect = [_Response(_ark_response({
            "product_name": {},
            "attributes": [],
            "dimensions": [],
            "selling_points": [{
                "claim": "Precise control with even mist and no dripping",
                "evidence": "定量控油 均匀雾化 不滴油",
                "image_ref": "Image 1",
            }],
            "use_scenes": [],
        })), _Response(_ark_response({"selling_points": [
            {"claim": "Precise oil portion control", "evidence": "定量控油", "image_ref": "Image 1"},
            {"claim": "Uniform atomized oil spray", "evidence": "均匀雾化", "image_ref": "Image 1"},
            {"claim": "No dripping or residual oil", "evidence": "不滴油不挂油", "image_ref": "Image 1"},
            {"claim": "Wide 60 degree spray range", "evidence": "60度雾化范围", "image_ref": "Image 1"},
        ]}))]

        result = server.fetch_ark_product_analysis(
            "Product name: Oil Sprayer",
            "",
            ["https://cbu01.alicdn.com/img/ibank/example.jpg"],
            "ark-test",
            "doubao-test",
        )

        self.assertEqual([
            "Precise oil portion control", "Uniform atomized oil spray",
            "No dripping or residual oil", "Wide 60 degree spray range",
        ], [item["claim"] for item in result["selling_points"]])
        self.assertEqual(2, urlopen.call_count)
        self.assertIn(result["selling_points"][3]["image_url"], result["evidence_urls"])


if __name__ == "__main__":
    unittest.main()
