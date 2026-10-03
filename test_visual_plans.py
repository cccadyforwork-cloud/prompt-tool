import io
import json
import unittest
from unittest.mock import patch

import server


class VisualPlanTests(unittest.TestCase):
    def plan(self, index=0, **changes):
        return dict(dict(groupIndex=index, status="ready", label="Useful Detail", goal="目标",
                         subject="主体", action="具体动作", composition="构图", basis="依据",
                         difference="区别", reason="", visual_prompt=f"Demonstration {index}", evidenceUrls=[]), **changes)

    def run_planner(self, plans, reviews=None, evidence=None):
        reviews = reviews if reviews is not None else [dict(groupIndex=i, approved=True, reason="有依据") for i in range(len(plans))]
        def response(value):
            return io.BytesIO(json.dumps({"output": [{"type": "message", "content": [
                {"type": "output_text", "text": json.dumps(value)}]}]}).encode())
        with patch.dict(server.os.environ, {"ARK_API_KEY": "ark-test"}), patch.object(
            server.urllib.request, "urlopen", side_effect=[response({"plans": plans}), response({"reviews": reviews})]
        ):
            return server.create_visual_plans({"groups": [[f"claim {i}"] for i in range(len(plans))], "evidence": evidence or []})

    def test_review_blocks_unsupported_implication(self):
        result, status = self.run_planner([self.plan()], [dict(groupIndex=0, approved=False, reason="没有各款性能排序的依据")])
        self.assertEqual(status, 200)
        self.assertEqual(result["plans"][0]["status"], "blocked")
        self.assertIn("性能排序", result["plans"][0]["reason"])

    def test_only_supplied_evidence_urls_survive(self):
        result, status = self.run_planner([self.plan(evidenceUrls=["https://source.example/image", "https://invented.example/image"])], evidence=[{"imageUrl": "https://source.example/image"}])
        self.assertEqual(status, 200)
        self.assertEqual(result["plans"][0]["evidenceUrls"], ["https://source.example/image"])

    def test_review_repair_is_used(self):
        repaired = self.plan(action="确认动作占主要画面", visual_prompt="Concrete supported action fills the frame")
        result, status = self.run_planner([self.plan()], [dict(groupIndex=0, approved=True, reason="修订构图", revisedPlan=repaired)])
        self.assertEqual(status, 200)
        self.assertEqual(result["plans"][0]["action"], repaired["action"])

    def test_invalid_repaired_status_rejected(self):
        self.assertEqual(self.run_planner([self.plan()], [dict(groupIndex=0, approved=True, revisedPlan=self.plan(status="unknown"))])[1], 502)

    def test_duplicate_demonstrations_rejected(self):
        self.assertEqual(self.run_planner([self.plan(), self.plan(1, visual_prompt="Demonstration 0")])[1], 502)

    def test_incomplete_review_rejected(self):
        self.assertEqual(self.run_planner([self.plan()], [])[1], 502)

    def test_wrong_group_rejected(self):
        self.assertEqual(self.run_planner([self.plan(1)])[1], 502)

    def test_missing_action_rejected(self):
        self.assertEqual(self.run_planner([self.plan(action="")])[1], 502)

    def test_long_title_rejected(self):
        self.assertEqual(self.run_planner([self.plan(label="This title has too many words")])[1], 502)

    def test_invalid_groups_rejected_without_api(self):
        self.assertEqual(server.create_visual_plans({"groups": []})[1], 400)


if __name__ == "__main__":
    unittest.main()
