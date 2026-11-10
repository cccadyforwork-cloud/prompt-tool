const byId = (id) => document.getElementById(id);

function normalizeKey(value) {
  let normalized = String(value || "").trim();
  normalized = normalized.replace(/^(?:export\s+)?GRSAI_API_KEY\s*=\s*/i, "").trim();
  if (normalized.length >= 2 && normalized[0] === normalized[normalized.length - 1] && ["\"", "'"].includes(normalized[0])) {
    normalized = normalized.slice(1, -1).trim();
  }
  return normalized.replace(/^Bearer\s+/i, "").trim();
}

async function refreshStatus() {
  const status = byId("keyCurrentStatus");
  try {
    const response = await fetch("/api/key-status", { cache: "no-store" });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "读取失败");
    status.textContent = result.grsaiConfigured
      ? `当前已配置 Grsai 生图 Key${result.grsaiKeyEnding ? `（尾号 ${result.grsaiKeyEnding}）` : ""}`
      : "当前未配置可用的 Grsai 生图 Key";
  } catch (error) {
    status.textContent = `配置状态读取失败：${error.message || "请确认本地服务正在运行"}`;
  }
}

const input = byId("grsaiKeyInput");
const saveStatus = byId("keySaveStatus");

input.addEventListener("input", () => {
  const key = normalizeKey(input.value);
  if (!input.value.trim()) saveStatus.textContent = "";
  else if (key.startsWith("sk-") && !/\s/.test(key)) saveStatus.textContent = `已识别到新 Key（尾号 ${key.slice(-4)}），可以保存。`;
  else saveStatus.textContent = "尚未识别到有效 Key，请确认内容中包含完整的 sk-… Key。";
});

byId("toggleKeyVisibility").addEventListener("click", (event) => {
  const visible = input.type === "text";
  input.type = visible ? "password" : "text";
  event.currentTarget.textContent = visible ? "显示" : "隐藏";
  event.currentTarget.setAttribute("aria-pressed", String(!visible));
  input.focus();
});

byId("grsaiKeyForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const key = normalizeKey(input.value);
  const button = byId("saveGrsaiKey");
  if (!key.startsWith("sk-") || /\s/.test(key)) {
    saveStatus.textContent = "没有识别到有效 Key。请粘贴以 sk- 开头的完整 Grsai Key。";
    return;
  }
  button.disabled = true;
  saveStatus.textContent = "正在安全保存…";
  try {
    const response = await fetch("/api/configure-key", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "GRSAI_API_KEY", key }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "保存失败");
    input.value = "";
    saveStatus.textContent = result.message || "新 Grsai 生图 Key 已保存并立即生效。";
    await refreshStatus();
  } catch (error) {
    saveStatus.textContent = `保存失败：${error.message || "请检查钥匙串权限"}`;
  } finally {
    button.disabled = false;
  }
});

void refreshStatus();
