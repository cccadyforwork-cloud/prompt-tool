import contextlib
import io
import os
import unittest
from unittest.mock import patch

import server


class KeychainConfigTests(unittest.TestCase):
    def setUp(self):
        self.stack = contextlib.ExitStack()
        self.addCleanup(self.stack.close)
        self.stack.enter_context(patch.dict(os.environ, {}, clear=True))
        self.stack.enter_context(patch.object(server.sys, "platform", "darwin"))
        self.stack.enter_context(patch.object(server.sys.stdin, "isatty", return_value=True))
        self.output = self.stack.enter_context(contextlib.redirect_stdout(io.StringIO()))
        self.read = self.stack.enter_context(patch.object(server, "read_key", return_value=""))
        self.save = self.stack.enter_context(patch.object(server, "save_key"))
        self.prompt = self.stack.enter_context(patch.object(server.getpass, "getpass"))

    def configure(self, **kwargs):
        return server.configure_api_key("ARK_API_KEY", "ark-", "火山方舟", **kwargs)

    def test_restart_reads_saved_key_without_prompt(self):
        self.read.return_value = "ark-test-saved"
        self.assertEqual(self.configure(), "ark-test-saved")
        self.assertEqual(os.environ["ARK_API_KEY"], "ark-test-saved")
        self.prompt.assert_not_called()

    def test_environment_overrides_saved_key(self):
        os.environ["ARK_API_KEY"] = "ark-test-environment"
        self.assertEqual(self.configure(), "ark-test-environment")
        self.read.assert_not_called()
        self.save.assert_not_called()

    def test_first_input_saved_and_available_after_restart(self):
        self.prompt.return_value = "ark-test-new"
        self.configure()
        self.save.assert_called_once_with("ARK_API_KEY", "ark-test-new")
        os.environ.clear()
        self.read.return_value = self.save.call_args.args[1]
        self.prompt.reset_mock()
        self.assertEqual(self.configure(), "ark-test-new")
        self.prompt.assert_not_called()
        self.assertNotIn("ark-test-new", self.output.getvalue())

    def test_update_replaces_saved_key(self):
        os.environ["ARK_API_KEY"] = "ark-test-old"
        self.prompt.return_value = "ark-test-updated"
        self.configure(replace=True)
        self.save.assert_called_once_with("ARK_API_KEY", "ark-test-updated")

    def test_blank_update_preserves_key(self):
        os.environ["ARK_API_KEY"] = "ark-test-old"
        self.prompt.return_value = ""
        self.configure(replace=True)
        self.save.assert_not_called()
        self.assertEqual(os.environ["ARK_API_KEY"], "ark-test-old")

    def test_invalid_input_is_not_saved(self):
        self.prompt.side_effect = ["Bearer ark-invalid", "ark-", "ark-test-good"]
        self.configure()
        self.save.assert_called_once_with("ARK_API_KEY", "ark-test-good")

    def test_keychain_failure_keeps_current_session_usable(self):
        self.read.side_effect = OSError("locked")
        self.save.side_effect = OSError("denied")
        self.prompt.return_value = "ark-test-session"
        self.assertEqual(self.configure(), "ark-test-session")
        self.assertIn("仅本次进程可用", self.output.getvalue())

    def test_noninteractive_missing_key_does_not_prompt(self):
        with patch.object(server.sys.stdin, "isatty", return_value=False):
            self.assertEqual(self.configure(), "")
        self.prompt.assert_not_called()

    def test_grsai_uses_separate_keychain_account(self):
        self.read.return_value = "sk-test-grsai"
        self.assertEqual(server.configure_api_key("GRSAI_API_KEY", "sk-", "Grsai"), "sk-test-grsai")
        self.read.assert_called_once_with("GRSAI_API_KEY")


if __name__ == "__main__":
    unittest.main()
