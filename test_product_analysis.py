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
