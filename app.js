const sourceNotes = {
  purchase: "采购单口径：确认已采购的产品款式；不把下单数量当作产品参数。",
  amazonTemplate: "Amazon SKU 口径：按当前子 SKU 标题优先提取款式、数量与明确 item 字段。",
  alibaba: "1688 事实口径：详情图、页面属性、本地 OCR 与豆包确认结果优先；缺失字段留空。",
  amazon: "参考链接口径：提取图组结构、构图任务与卖点分配，不补写未确认参数。",
};

let bundleStateBySku = {};
let supplierSourceFileNames = [];

const productGroups = {};

const skus = [
  {
    id: "EMPTY-SOURCE",
    label: "请先解析当前产品资料",
    productName: "",
    shape: "",
    pack: "",
    sizeCode: "",
    dims: {},
    fit: "",
  },
];
const imageTypes = [
  { id: "1", name: "1. 单款参数 + 场景主图", promptName: "1. Single Specification Hero Image" },
  { id: "2", name: "2. 生活场景图 1", promptName: "2. Lifestyle Image" },
  { id: "3A", name: "3A. 多场景使用图", promptName: "3A. Multi-Scene Usage Image" },
  { id: "3B", name: "3B. 产品使用方法场景图", promptName: "3B. Step-by-Step Usage Image" },
  { id: "4", name: "4. 适用尺寸参数图", promptName: "4. Size Reference Image" },
  { id: "5", name: "5. 多规格可选图", promptName: "5. Multiple Specification Options Image" },
  { id: "6", name: "6. 功能 / 卖点图", promptName: "6. Feature Image" },
  { id: "7", name: "7. 细节放大图", promptName: "7. Close-Up Detail Image" },
  { id: "8", name: "8. 总卖点图", promptName: "8. Summary Infographic" },
];

const templates = [
  {
    id: "plantTie",
    name: "植物绑带模型",
    description: "通用 5 张图结构：主场景、白底、多场景、卖点、尺寸材质产品信息详情。",
    imageTypes: [
      { id: "1", name: "1. 主图场景图", promptName: "1. Main Scene Image" },
      { id: "2", name: "2. 白底图", promptName: "2. White Background Product Image" },
      { id: "3", name: "3. 多场景使用图", promptName: "3. Multi-Scene Usage Image" },
      { id: "4", name: "4. 卖点图", promptName: "4. Selling Point Image" },
      { id: "5", name: "5. 尺寸材质产品信息详情图", promptName: "5. Product Detail Information Image" },
    ],
  },
  {
    id: "scene",
    name: "场景展示模板",
    description: "围绕 A/B 主场景、多场景、多角度展示、产品说明、两个卖点和收口生成 8 张图。",
    imageTypes: [
      { id: "1A", name: "1A. 主图 / 产品主体场景图", promptName: "1A. Product-First Main Scene Image" },
      { id: "1B", name: "1B. 主图 / 人物使用场景图", promptName: "1B. Human-Use Main Scene Image" },
      { id: "2", name: "2. 多场景 / 多用途图", promptName: "2. Multi-Scene Usage Image" },
      { id: "3", name: "3. 多角度图", promptName: "3. Multi-Angle Product Image" },
      { id: "4", name: "4. 产品说明图", promptName: "4. Product Explanation Image" },
      { id: "5", name: "5. 卖点图 5", promptName: "5. Selling Point Image 5" },
      { id: "6", name: "6. 卖点图 6", promptName: "6. Selling Point Image 6" },
      { id: "7", name: "7. 卖点总览图", promptName: "7. Feature Summary Image" },
    ],
  },
  {
    id: "spec",
    name: "参数规格模板",
    description: "围绕规格、产品自身数量/套装、适配、范围和已确认尺寸生成 8 张图。",
    imageTypes,
  },
  {
    id: "feature",
    name: "功能展示模板",
    description: "按产品信息字段展示白底、场景、用途、外观、选项、核心功能和卖点总结，生成 8 张图。",
    imageTypes: [
      { id: "1", name: "1. 产品白底主图", promptName: "1. White Background Product Hero" },
      { id: "2", name: "2. 核心使用场景图", promptName: "2. Core Usage Scene Image" },
      { id: "3", name: "3. 多用途 / 多场景展示", promptName: "3. Multi-Use Scenario Image" },
      { id: "4", name: "4. 产品信息展示图", promptName: "4. Product Information Display Image" },
      { id: "5", name: "5. 规格 / 选项展示图", promptName: "5. Specification and Option Image" },
      { id: "6", name: "6. 核心功能展示图", promptName: "6. Core Function Demonstration Image" },
      { id: "7", name: "7. 细节 / 材质卖点图", promptName: "7. Detail and Material Feature Image" },
      { id: "8", name: "8. 功能卖点总结图", promptName: "8. Feature Summary Image" },
    ],
  },
  {
    id: "reference",
    name: "参考链接模板",
    description: "参考链接静态图组的图片顺序、构图任务和卖点分配，代入当前产品信息生成 6 张图。",
    imageTypes: [
      { id: "1", name: "1. 参考图 1 / 主图路线", promptName: "1. Reference Blueprint Image 1" },
      { id: "2", name: "2. 参考图 2 / 结构路线", promptName: "2. Reference Blueprint Image 2" },
      { id: "3", name: "3. 参考图 3 / 细节路线", promptName: "3. Reference Blueprint Image 3" },
      { id: "4", name: "4. 参考图 4 / 功能路线", promptName: "4. Reference Blueprint Image 4" },
      { id: "5", name: "5. 参考图 5 / 场景路线", promptName: "5. Reference Blueprint Image 5" },
      { id: "6", name: "6. 参考图 6 / 收口路线", promptName: "6. Reference Blueprint Image 6" },
    ],
  },
];

const DEFAULT_TEMPLATE_ID = "scene";

const fields = [
  ["productName", "Product Name", "[PRODUCT_NAME]"],
  ["category", "Category", ""],
  ["material", "Material", ""],
  ["color", "Color", ""],
  ["structure", "Structure / Craft", ""],
  ["productStyle", "Product Style", ""],
  ["packaging", "Supplier Packaging", ""],
  ["detailParameter", "Detail Features", ""],
  ["scene", "Use Scene", ""],
  ["feature1", "Selling Point 1", ""],
  ["feature2", "Selling Point 2", ""],
];

const manualFields = [
  ["pack", "Product Count / Set", ""],
  ["cupRange", "Size / Range", ""],
  ["surfaceFinish", "Technology / Finish", ""],
  ["topWidth", "Dimension 1", ""],
  ["sideLength", "Dimension 2", ""],
  ["bottomWidth", "Dimension 3", ""],
  ["weight", "Weight / Quantity", ""],
];

const allFields = [...fields, ...manualFields];
const manualFieldKeys = new Set(manualFields.map(([key]) => key));
const extractedManualFieldKeys = new Set(["topWidth", "sideLength", "bottomWidth", "weight"]);
const supplierStructuredFieldKeys = new Set(["category", "material", "productStyle", "packaging"]);
const multilineFieldKeys = new Set(["scene", "feature1", "feature2"]);
const sellingPointFieldKeys = new Set(["feature1", "feature2"]);
const NO_REFERENCE_SCENE_MESSAGE = "没有参考场景信息";
const NO_REFERENCE_SELLING_POINT_MESSAGE = "没有参考卖点信息";

let promptStore = [];
let imageGenerationByCard = {};
let lastReferenceSelectionCardKey = "";
let activePromptCardKey = "";
let activeWorkflowPage = "source";
let bulkImageGenerationRunning = false;
let bulkImageGenerationMode = "";
let generatedSetSaving = false;
const IMAGE_HISTORY_STORAGE_KEY = "prompt-tool-image-history-v1";
const WORKSPACE_STORAGE_KEY = "prompt-tool-workspace-v1";

function readTabStorage(key) {
  try {
    const tabValue = sessionStorage.getItem(key);
    if (tabValue !== null) return tabValue;

    // Migrate the previous shared-browser workspace into the first tab opened
    // after this upgrade. Removing the legacy copy keeps later tabs independent.
    const legacyValue = localStorage.getItem(key);
    if (legacyValue !== null) {
      sessionStorage.setItem(key, legacyValue);
      localStorage.removeItem(key);
      return legacyValue;
    }
  } catch (error) {
    console.warn("无法读取当前标签页工作记录", error);
  }
  return null;
}

function writeTabStorage(key, value) {
  try {
    sessionStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn("无法保存当前标签页工作记录", error);
    return false;
  }
}

function removeTabStorage(key) {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // The in-memory reset still applies when browser storage is unavailable.
  }
}

let persistedImageHistory = loadPersistedImageHistory();
let availableReferenceImageUrls = [];
let referenceImagesBySku = {};
let referenceImageMetaBySku = {};
let promptLanguageByCard = {};
let extractedProducts = [];
let hasUserSourceAttempt = false;
const emptyExtractedProduct = {
  id: "EXTRACTED-NONE",
  label: "请先解析资料",
  productName: "",
  shape: "",
  pack: "",
  sizeCode: "",
  groupKey: "",
  dims: {},
  fit: "",
};
let sourcePayload = {
  purchase: "",
  amazonTemplate: "",
  supplier: "",
  competitor: "",
};
let fieldOverrides = {};
let fieldOverridesBySku = {};
let appliedSellingPointOverridesBySku = {};
let fieldSnapshot = "";
let sellingPointDraftDirty = false;
let sellingPointInputRevision = 0;
let sellingPointResearchAttemptedBySku = new Set();
let sceneInputRevision = 0;
let selectedExtractionRoute = "vision";
let selectedProductStructureRoute = "single";
let productStructureRouteManuallySelected = false;
let extractionGeneration = 0;
const OCR_IMAGE_LIMIT = 32;
const OCR_FALLBACK_IMAGE_LIMIT = 6;
const COLLECTOR_MAIN_LATE_LIMIT = 10;
const COLLECTOR_MAIN_MIDDLE_LIMIT = 10;
const COLLECTOR_DETAIL_TAIL_LIMIT = 12;
const MAX_REFERENCE_CANDIDATES = 20;
const MAX_REFERENCE_CLASSIFIER_CANDIDATES = 40;
const MAX_COMPETITOR_REFERENCE_IMAGES = 5;
const MAX_SELECTED_REFERENCES = 6;
const REFERENCE_CLASSIFIER_BATCH_SIZE = 12;
const OCR_SCRIPT_URL = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
const PDFJS_SCRIPT_URL = "./vendor/pdfjs/pdf.min.js";
const PDFJS_WORKER_URL = "./vendor/pdfjs/pdf.worker.min.js";
const XLSX_SCRIPT_URL = "./vendor/xlsx.full.min.js";
const DETAIL_FETCH_TIMEOUT_MS = 15000;
const IMAGE_LOAD_TIMEOUT_MS = 15000;
const OCR_RECOGNIZE_TIMEOUT_MS = 45000;
const PURCHASE_IMAGE_OCR_TIMEOUT_MS = 45000;
const GENERIC_SUPPLIER_SKU_MODEL = "SUPPLIER-SKU";
const scriptLoadPromises = {};

function byId(id) {
  return document.getElementById(id);
}

function showWorkflowPage(pageName) {
  const available = new Set(["source", "parameters", "studio"]);
  activeWorkflowPage = available.has(pageName) ? pageName : "source";
  document.querySelectorAll("[data-workflow-page]").forEach((button) => {
    const selected = button.dataset.workflowPage === activeWorkflowPage;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-selected", String(selected));
  });
  document.querySelectorAll("[data-workflow-panel]").forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.workflowPanel === activeWorkflowPage);
  });
  persistWorkspaceSnapshot();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function initWorkflowNavigation() {
  document.querySelectorAll("[data-workflow-page]").forEach((button) => button.addEventListener("click", () => showWorkflowPage(button.dataset.workflowPage)));
  document.querySelectorAll("[data-workflow-next]").forEach((button) => button.addEventListener("click", () => showWorkflowPage(button.dataset.workflowNext)));
  showWorkflowPage(activeWorkflowPage);
}

function loadScriptOnce(src, globalName) {
  if (globalName && window[globalName]) return Promise.resolve(window[globalName]);
  if (scriptLoadPromises[src]) return scriptLoadPromises[src];

  scriptLoadPromises[src] = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(globalName ? window[globalName] : true));
      existing.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)));
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve(globalName ? window[globalName] : true);
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });

  return scriptLoadPromises[src];
}

async function loadPdfJs() {
  const existing = window.pdfjsLib || window["pdfjs-dist/build/pdf"];
  if (existing) return existing;
  await loadScriptOnce(PDFJS_SCRIPT_URL);
  return window.pdfjsLib || window["pdfjs-dist/build/pdf"];
}

async function loadXlsx() {
  return window.XLSX || await loadScriptOnce(XLSX_SCRIPT_URL, "XLSX");
}

function selectedSku() {
  const allProducts = currentProducts();
  return allProducts.find((sku) => sku.id === byId("skuSelect").value) || allProducts[0];
}

function populateSupplierSkuBinding(products = []) {
  const select = byId("supplierSkuBinding");
  if (!select) return;
  const previous = select.value;
  select.innerHTML = `<option value="">自动识别（未指定 SKU）</option>${products.map((sku) => (
    `<option value="${escapeHtml(sku.id)}">${escapeHtml(sku.label || sku.displayLabel || sku.model || sku.id)}</option>`
  )).join("")}`;
  if (products.some((sku) => sku.id === previous)) select.value = previous;
  syncProductStructureRouteFromBinding();
}

function boundSupplierSku(products = []) {
  const bindingId = byId("supplierSkuBinding")?.value || "";
  return bindingId ? products.find((sku) => sku.id === bindingId) || null : null;
}

function currentProducts() {
  if (extractedProducts.length) {
    return extractedProducts;
  }
  return [emptyExtractedProduct];
}

function hasExtractedProducts() {
  return extractedProducts.length > 0;
}

function selectedTemplate() {
  const defaultTemplate = templates.find((item) => item.id === DEFAULT_TEMPLATE_ID) || templates[0];
  const selected = templates.find((item) => item.id === byId("templateSelect").value) || defaultTemplate;
  return selected.disabled ? defaultTemplate : selected;
}

function defaultProductName(sku) {
  return promptValue(sku.onlineProductKeyword, "")
    || promptValue(sku.productName, "")
    || promptValue(sku.shape, "")
    || promptValue(sku.sourceName, "")
    || "[PRODUCT_NAME]";
}

function dimensionListForSku(sku, group = {}) {
  const existing = sku.dimensionList || ((group.dimensions || []).length ? `[VERIFIED_DIMENSIONS: ${group.dimensions.join("; ")}]` : "");
  if (existing) return existing;
  const fallbackText = [
    defaultProductName(sku),
    sku.shape,
    sku.specList,
    sku.singleSpec,
    sku.detailParameter,
    sku.structure,
    sku.fit,
    group.promptName,
    ...(group.promptSpecs || []),
    sourcePayload.supplier,
  ].filter(Boolean).join("\n");
  const dimensions = semanticDimensionItems(extractDimensions(fallbackText), fallbackText);
  return dimensions.length ? `[VERIFIED_DIMENSIONS: ${dimensions.join("; ")}]` : "";
}

function dimensionFieldsFromDimensionList(dimensionList, context = "") {
  const source = cleanTokenValue(dimensionList);
  if (!source) return {};
  const semanticItems = dimensionListItems(source, context);
  const valueFor = (key, legacyLabels) => {
    const candidates = dimensionLabelCandidatesByKey[key] || [];
    const semanticItem = semanticItems.find((item) => candidates.includes(canonicalDimensionKey(item)));
    if (semanticItem) {
      return cleanFieldDisplayValue(semanticItem.split(":").slice(1).join(":").trim());
    }
    return dimensionValueByLabels(source, legacyLabels);
  };
  return {
    topWidth: valueFor("topWidth", ["SKU Dimension 1", "Base Diameter", "Diameter", "Top Width", "Length", "Folded Size", "Expanded Width"]),
    sideLength: valueFor("sideLength", ["SKU Dimension 2", "Front Diameter", "Knob Diameter", "Side Length", "Width", "Open Diameter", "Expanded Length"]),
    bottomWidth: valueFor("bottomWidth", ["Projection Depth", "Depth", "Overall Projection", "Bottom Width", "Thickness", "Height", "Open Height"]),
    weight: valueFor("weight", ["Weight", "Weight / Capacity", "Capacity", "Volume", "Quantity"]),
  }
}

function validSizeRangeValue(value) {
  const clean = cleanFieldDisplayValue(value);
  if (!clean || /^(?:均码|one size|free size)$/i.test(clean)) return "";
  if (/(?:pcs|pieces?|片|pack|包|set|套|qty|quantity|数量)/i.test(clean)) return "";
  if (/(?:ml|mL|l\b|升|毫升|oz|g|kg|克|千克)/i.test(clean)) return "";
  if (/^(?:black|white|gray|grey|blue|green|purple|pink|red|yellow|orange|brown|khaki|silver)$/i.test(clean)) return "";
  return clean;
}

function looksLikeSizeRangeValue(value) {
  const clean = validSizeRangeValue(value);
  if (!clean) return false;
  return /(?:US\s*Size|尺码|鞋码|size|码|号|inch|in\b|cm|mm|厘米|毫米|cups?|人份|#?\d{1,3}|V\d{2}|U\d{2}|[0-9]+\s*-\s*[0-9]+|\b(?:XXL|XL|XS|S|M|L)\b)/i.test(clean);
}

function extractSizeRangeFromOptionText(value) {
  const clean = cleanFieldDisplayValue(value);
  if (!clean) return "";
  const parts = clean
    .split(/\s*(?:\/|\||;|,|，)\s*/)
    .map((part) => validSizeRangeValue(part))
    .filter(Boolean);
  return parts.find((part) => looksLikeSizeRangeValue(part)) || (looksLikeSizeRangeValue(clean) ? clean : "");
}

function sizeRangeValueForSku(sku = {}, values = {}) {
  const direct = validSizeRangeValue(sku.dims?.cupRange || sku.cupRange || values.cupRange || sku.size || "");
  if (direct) return direct;
  return extractSizeRangeFromOptionText(sku.outputSizeCode || sku.sizeCode || "")
    || extractFirstMatch(values.specList || "", [/([0-9]+\s*-\s*[0-9]+\s*(?:cups|cup|人份))/i]);
}

function weightOrCapacityValueForSku(sku = {}, values = {}, dimensionFields = {}) {
  return cleanFieldDisplayValue(
    sku.dims?.weight
    || values.weight
    || dimensionFields.weight
    || sku.capacity
    || values.capacity
    || ""
  );
}

function isFootwearSceneLeakText(value) {
  const source = String(value || "").toLowerCase();
  if (!source) return false;
  if (/slipper|flip\s*-?\s*flops?|sandal|footwear|shoe|shoes|拖鞋|凉拖|一字拖|人字拖|沙滩鞋/.test(source)) return true;
  return /beach,\s*hotel,\s*spa,\s*shower,\s*travel,\s*bathroom/.test(source);
}

function identityFactsFromData(data = {}) {
  return {
    productName: data.productName || defaultProductName(data),
    titleSpec: data.titleSpec,
    selectedSpec: data.selectedSpec || data.singleSpec || data.sizeCode || data.shape,
    cupType: data.cupType,
    material: data.material,
    structure: data.structure,
    variants: data.variantList,
    detailParameter: data.detailParameter,
    bundleComponents: data.bundleComponents,
  };
}

function sanitizeUseContextFields(data = {}) {
  return {
    fit: cleanFieldDisplayValue(data.fit || ""),
    scene: cleanFieldDisplayValue(data.scene || ""),
  };
}

function valueMap(sku) {
  const group = productGroups[sku.groupKey] || sku.group || {};
  const isDifferentDesignSet = sku.productStructureRoute === "assortment";
  const materialFallback = "";
  const colorFallback = "";
  const structureFallback = "";
  const feature1Fallback = "";
  const feature2Fallback = "";
  const variantFallback = "";
  const dimensionList = isDifferentDesignSet ? "" : dimensionListForSku(sku, group);
  const dimensionFields = dimensionFieldsFromDimensionList(dimensionList, [
    defaultProductName(sku),
    sku.shape,
    sku.fit,
    sku.structure,
    sku.detailParameter,
  ].filter(Boolean).join(" "));
  const useContext = sanitizeUseContextFields(sku);
  return {
    productName: cleanFieldDisplayValue(defaultProductName(sku)),
    category: cleanFieldDisplayValue(sku.category || ""),
    pack: cleanFieldDisplayValue(sku.pack || ""),
    packComposition: cleanFieldDisplayValue(sku.packComposition || ""),
    material: cleanFieldDisplayValue(sku.material || materialFallback),
    color: cleanFieldDisplayValue(sku.color || colorFallback),
    structure: cleanFieldDisplayValue(sku.structure || structureFallback),
    productStyle: cleanFieldDisplayValue(sku.productStyle || ""),
    packaging: cleanFieldDisplayValue(sku.packaging || ""),
    cupRange: cleanFieldDisplayValue(sizeRangeValueForSku(sku, {})),
    topWidth: isDifferentDesignSet ? "" : sku.dims?.topWidth || dimensionFields.topWidth || "",
    sideLength: isDifferentDesignSet ? "" : sku.dims?.sideLength || dimensionFields.sideLength || "",
    bottomWidth: isDifferentDesignSet ? "" : sku.dims?.bottomWidth || dimensionFields.bottomWidth || "",
    weight: isDifferentDesignSet ? "" : weightOrCapacityValueForSku(sku, {}, dimensionFields),
    fit: useContext.fit,
    scene: useContext.scene,
    feature1: cleanFieldDisplayValue(sku.feature1 || feature1Fallback),
    feature2: cleanFieldDisplayValue(sku.feature2 || feature2Fallback),
    surfaceFinish: cleanFieldDisplayValue(sku.surfaceFinish || ""),
    detailParameter: cleanFieldDisplayValue(sku.detailParameter || ""),
    bundleComponents: cleanFieldDisplayValue(sku.bundleComponents || ""),
    packagingCount: ensureParameterToken("PRODUCT_COUNT_OR_SET", sku.pack || ""),
    singleSpec: sku.singleSpec || `[CURRENT_PRODUCT_OPTION: ${group.promptName || "[PRODUCT_SPEC]"}, ${sku.pack || "[PRODUCT_COUNT_OR_SET]"}]`,
    specList: sku.specList || `[SPEC_LIST: ${(group.promptSpecs || ["[SPECIFICATION_LIST]"]).join(" / ")}]`,
    variantList: sku.variantList || variantFallback,
    dimensionList,
  };
}

function fillSelects() {
  renderProductSelect();
  byId("templateSelect").innerHTML = templates
    .filter((template) => !template.disabled)
    .map((template) => `<option value="${template.id}">${template.name}</option>`)
    .join("");
  byId("templateSelect").value = DEFAULT_TEMPLATE_ID;
}

function renderProductSelect(selectedId = byId("skuSelect")?.value) {
  const products = currentProducts();
  if (!hasExtractedProducts()) {
    byId("skuSelect").innerHTML = `<option value="${emptyExtractedProduct.id}">${escapeHtml(emptyExtractedProduct.label)}</option>`;
    return;
  }
  byId("skuSelect").innerHTML = products.map((sku) => `<option value="${sku.id}">${escapeHtml(skuDisplayLabel(sku))}</option>`).join("");
  if (selectedId && products.some((sku) => sku.id === selectedId)) {
    byId("skuSelect").value = selectedId;
  }
}

function hasBundleIdentityMarker(value = "") {
  const text = String(value || "");
  return /套装|组合|礼盒/.test(text)
    || /\b(?:set|kit|bundle)\b/i.test(text)
    || /(?:Set|Kit|Bundle)(?:$|[\s|/_-])/.test(text);
}
function isLikelyBundleSku(sku = {}) { return hasBundleIdentityMarker([sku.label, sku.displayLabel, sku.model, sku.parentSku].filter(Boolean).join(" ")); }
function bundleStateForSku(sku = selectedSku()) { const id = sku?.id || ""; if (!id) return { enabled: false, components: [], confirmed: false }; if (!bundleStateBySku[id]) bundleStateBySku[id] = { enabled: isLikelyBundleSku(sku), components: (sku.bundleComponentSeeds || []).map((item) => ({ ...item, sourceFile: bundleSourceFor(item.name) })), confirmed: false }; return bundleStateBySku[id]; }
function bundleSourceFor(name = "") { if (supplierSourceFileNames.length === 1) return supplierSourceFileNames[0]; if (/(?:dispenser|holder)/i.test(name)) return supplierSourceFileNames.find((file) => /分配器|外壳|收纳包|挂钩/.test(file)) || ""; return supplierSourceFileNames.find((file) => /便便袋|拾便袋|垃圾袋/.test(file) && !/分配器|外壳|收纳包/.test(file)) || supplierSourceFileNames[0] || ""; }
function bundleComponentPromptText(state = {}) { return state.enabled && state.confirmed ? state.components.map((item) => `${cleanFieldDisplayValue(item.name)} × ${Number(item.quantity) || 0}`).filter((item) => !/× 0$/.test(item)).join("; ") : ""; }
function renderBundleEditor() {
  const editor = byId("bundleEditor"); if (!editor) return; const sku = selectedSku();
  if (!hasExtractedProducts() || !sku) {
    const emptyMessage = selectedProductStructureRoute === "bundle"
      ? "已选择套装路线。解析资料后，在这里确认套装主体、配件、数量及其 1688 来源。"
      : selectedProductStructureRoute === "assortment"
        ? "已选择不同款组合套装路线。解析资料后，产品身份直接以选中的完整组合参考图为准。"
        : "如当前 SKU 是套装，请先在第 1 页选择对应的商品组合路线。";
    editor.innerHTML = `<h2 id="bundle-title">组合资料确认</h2><p class="empty-state">${emptyMessage}</p>`;
    return;
  }
  if (selectedProductStructureRoute === "assortment") {
    const count = Number(sku.skuUnitQuantity || 0);
    const countText = count > 1 ? `当前标题识别为 ${count} 件；` : "";
    editor.innerHTML = `<h2 id="bundle-title">不同款组合套装确认</h2><p class="bundle-note">${countText}各款外观与结构不在文字参数中展开描述，直接以第 3 页选中的完整组合参考图为产品身份依据。未按成员分别取证的共享尺寸会保持为空，避免把某一款的长宽厚套到另外两款。</p><p class="bundle-confirmed">✓ 展示规则：完整套装图呈现所有不同款；使用图按参考图选择真实成员；禁止复制同一款、融合不同款、遗漏成员或凭文字重画结构。</p>`;
    return;
  }
  const state = bundleStateForSku(sku); const options = (value) => (supplierSourceFileNames.length ? supplierSourceFileNames : ["未关联 1688 资料"]).map((file) => `<option value="${escapeHtml(file)}"${file === value ? " selected" : ""}>${escapeHtml(file)}</option>`).join("");
  const rows = state.components.map((item, index) => `<article class="bundle-component-card"><div class="bundle-component-top"><div><label>组件名称</label><input data-bundle-index="${index}" data-bundle-field="name" value="${escapeHtml(item.name || "")}"></div><div><label>数量</label><input data-bundle-index="${index}" data-bundle-field="quantity" type="number" min="1" value="${escapeHtml(String(item.quantity || 1))}"></div></div><div class="bundle-component-bottom"><div><label>该组件的 1688 来源</label><select data-bundle-index="${index}" data-bundle-field="sourceFile">${options(item.sourceFile)}</select></div><button type="button" class="bundle-remove" data-bundle-remove="${index}">×</button></div></article>`).join("");
  editor.innerHTML = `<h2 id="bundle-title">套装资料确认</h2><p class="bundle-note">只对当前 SKU 生效。确认后右侧全部图组严格使用这份组件、数量与来源。</p><label class="bundle-editor-toggle"><input id="bundleEnabled" type="checkbox"${state.enabled ? " checked" : ""}>当前 SKU 是套装（主体 + 配套产品）</label>${state.enabled ? `${rows}<button id="addBundleComponent" type="button" class="secondary bundle-add">+ 添加套装组件</button><button id="confirmBundleComponents" type="button">确认套装构成并更新提示词</button>${state.confirmed ? `<p class="bundle-confirmed">✓ 已确认：${escapeHtml(bundleComponentPromptText(state))}</p>` : ""}` : ""}`;
  byId("bundleEnabled")?.addEventListener("change", (e) => { state.enabled = e.currentTarget.checked; state.confirmed = false; if (state.enabled && !state.components.length) state.components.push({ name: cleanFieldDisplayValue(sku.productName), quantity: 1, sourceFile: supplierSourceFileNames[0] || "" }); renderAll(); });
  document.querySelectorAll("[data-bundle-field]").forEach((input) => input.addEventListener("change", (e) => { const item = state.components[Number(e.currentTarget.dataset.bundleIndex)]; item[e.currentTarget.dataset.bundleField] = e.currentTarget.value; state.confirmed = false; }));
  document.querySelectorAll("[data-bundle-remove]").forEach((button) => button.addEventListener("click", () => { state.components.splice(Number(button.dataset.bundleRemove), 1); state.confirmed = false; renderAll(); }));
  byId("addBundleComponent")?.addEventListener("click", () => { state.components.push({ name: "Included accessory", quantity: 1, sourceFile: supplierSourceFileNames[0] || "" }); state.confirmed = false; renderAll(); });
  byId("confirmBundleComponents")?.addEventListener("click", () => { state.confirmed = Boolean(bundleComponentPromptText({ ...state, confirmed: true })); renderAll(); });
}

const productStructureRoutePreviews = {
  single: {
    kicker: "SKU Structure 01 · Single",
    title: "单品路线",
    summary: "当前 SKU 只代表一种独立商品或同一商品的单一规格，不要求每张图同时展示配套组件。",
    flow: "当前 SKU + 对应 1688 资料 → 单品参数 → 单品图组",
    note: "适用于普通单款、单色、单规格或同类多件装。",
  },
  bundle: {
    kicker: "SKU Structure 02 · Bundle",
    title: "套装路线",
    summary: "当前 SKU 是主体与配套产品组成的一套商品；解析后必须确认每个组件、数量及其 1688 来源。",
    flow: "当前套装 SKU + 各组件资料 → 套装构成确认 → 全套组件共同进入提示词与图片",
    note: "套装确认后，每张生成图都会锁定完整套装，避免漏掉组件、把组件融合或误当成可选款式。",
  },
  assortment: {
    kicker: "SKU Structure 03 · Mixed Designs",
    title: "不同款组合套装",
    summary: "当前 SKU 由多个外观或结构不同、可独立使用的商品组成固定组合；产品身份由完整组合参考图直接控制。",
    flow: "当前组合 SKU + 完整组合参考图 → 按图位分配不同款 → 组合套装图组",
    note: "提示词只规定各款如何呈现，不用文字重述产品几何；禁止复制、融合、遗漏或新增参考图中不存在的款式。",
  },
};

function renderProductStructureRoute(routeId = selectedProductStructureRoute) {
  const preview = byId("productStructureRoutePreview");
  const route = productStructureRoutePreviews[routeId] || productStructureRoutePreviews.single;
  selectedProductStructureRoute = productStructureRoutePreviews[routeId] ? routeId : "single";
  document.querySelectorAll("[data-product-structure-route]").forEach((button) => {
    const active = button.dataset.productStructureRoute === selectedProductStructureRoute;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  if (!preview) return;
  preview.innerHTML = `
    <p class="route-preview-kicker">${escapeHtml(route.kicker)}</p>
    <h3 class="route-preview-title">${escapeHtml(route.title)}</h3>
    <p class="route-preview-summary">${escapeHtml(route.summary)}</p>
    <div class="route-flow">${escapeHtml(route.flow)}</div>
    <p class="route-preview-note">${escapeHtml(route.note)} 已选择此路线；点击解析按钮后生效。</p>
  `;
  renderBundleEditor();
}

function supplierBindingLooksLikeBundle() {
  const select = byId("supplierSkuBinding");
  const option = select?.selectedOptions?.[0];
  return hasBundleIdentityMarker([select?.value, option?.textContent].filter(Boolean).join(" "));
}

function syncProductStructureRouteFromBinding(force = false) {
  if (productStructureRouteManuallySelected && !force) {
    renderProductStructureRoute(selectedProductStructureRoute);
    return;
  }
  renderProductStructureRoute(supplierBindingLooksLikeBundle() ? "bundle" : "single");
}

function initProductStructureRoute() {
  renderProductStructureRoute(selectedProductStructureRoute);
  document.querySelectorAll("[data-product-structure-route]").forEach((button) => {
    button.addEventListener("click", () => {
      productStructureRouteManuallySelected = true;
      renderProductStructureRoute(button.dataset.productStructureRoute);
      if (hasExtractedProducts()) {
        applyProductStructureRoute(extractedProducts);
        imageGenerationByCard = {};
        renderAll();
      }
    });
  });
}

function applyProductStructureRoute(products = []) {
  const target = boundSupplierSku(products) || (products.length === 1 ? products[0] : null);
  if (!target) return;
  const existing = bundleStateBySku[target.id];
  const components = existing?.components?.length
    ? existing.components
    : (target.bundleComponentSeeds || []).map((item) => ({ ...item, sourceFile: bundleSourceFor(item.name) }));
  if (selectedProductStructureRoute === "bundle" && !components.length) {
    components.push({ name: cleanFieldDisplayValue(target.productName) || "Main product", quantity: 1, sourceFile: supplierSourceFileNames[0] || "" });
  }
  bundleStateBySku[target.id] = {
    enabled: selectedProductStructureRoute === "bundle",
    components,
    confirmed: false,
  };
  target.productStructureRoute = selectedProductStructureRoute;
}

const extractionRoutePreviews = {
  local: {
    kicker: "Route 01 · Local",
    title: "本地分析",
    summary: "不调用豆包。优先解析当前 1688 页面文字、结构化属性和本地 OCR 识别结果。",
    flow: "1688 HTML + 详情图 → 本地规则 / OCR → 左侧参数栏",
    fills: "商品名、款式、页面明确材质、尺寸、工艺、数量与卖点",
    boundary: "未识别到的内容保持为空；不联网、不推测、不使用包装尺寸",
    note: "适合需要快速核对本地规则结果、且明确不调用豆包的情况。",
  },
  vision: {
    kicker: "Route 02 · Doubao Vision",
    title: "豆包识图整理",
    summary: "把筛选后的 1688 参数图、功能图和材质图交给豆包，整理当前商品的可见信息。",
    flow: "筛选详情图 + 页面属性 → 豆包视觉识别 → 证据校验 → 左侧参数栏",
    fills: "材质、展开尺寸、工艺、结构、图片明确卖点与适用对象",
    boundary: "只允许读取当前商品资料；没有图片证据就留空，不联网补事实参数",
    note: "适合关键信息藏在详情图片里的商品；每项结果保留图片来源。",
  },
  web: {
    kicker: "Route 03 · Web Research",
    title: "豆包联网补充",
    summary: "先让豆包分析筛选后的 1688 图片并整理当前商品事实，再联网补充仍为空的参考信息。",
    flow: "筛选详情图 → 豆包视觉识别 → 已确认商品事实 → 英文跨境关键词 → 联网检索补缺",
    fills: "图片可确认的名称、材质、展开尺寸、工艺与卖点，以及缺失的英文商品名、通用卖点、使用场景和跨境表达",
    boundary: "视觉阶段只接收当前图片证据；联网阶段禁止猜测精确尺寸、重量、数量、具体材质和当前商品独有配置",
    note: "图片识别事实与联网参考分开保存；联网内容不会覆盖1688图片已经确认的事实。",
  },
};

function renderExtractionRoutePreview(routeId = "vision") {
  const route = extractionRoutePreviews[routeId] || extractionRoutePreviews.vision;
  const nextRoute = extractionRoutePreviews[routeId] ? routeId : "vision";
  if (selectedExtractionRoute !== nextRoute) extractionGeneration += 1;
  selectedExtractionRoute = nextRoute;
  const preview = byId("extractionRoutePreview");
  if (!preview) return;
  document.querySelectorAll("[data-extraction-route]").forEach((button) => {
    const active = button.dataset.extractionRoute === routeId;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  preview.innerHTML = `
    <p class="route-preview-kicker">${escapeHtml(route.kicker)}</p>
    <h3 class="route-preview-title">${escapeHtml(route.title)}</h3>
    <p class="route-preview-summary">${escapeHtml(route.summary)}</p>
    <div class="route-flow">${escapeHtml(route.flow)}</div>
    <div class="route-preview-grid">
      <div class="route-preview-block">
        <strong>可以填写</strong>
        <p>${escapeHtml(route.fills)}</p>
      </div>
      <div class="route-preview-block">
        <strong>使用边界</strong>
        <p>${escapeHtml(route.boundary)}</p>
      </div>
    </div>
    <p class="route-preview-note">${escapeHtml(route.note)} 已选择此路线；点击上方解析按钮后生效。</p>
  `;
}

function initExtractionRoutePreview() {
  renderExtractionRoutePreview(selectedExtractionRoute);
  document.querySelectorAll("[data-extraction-route]").forEach((button) => {
    button.addEventListener("click", () => renderExtractionRoutePreview(button.dataset.extractionRoute));
  });
}

function renderFields(reset = false) {
  const sku = selectedSku();
  const values = valueMap(sku);
  const fieldList = byId("fieldList");
  const manualFieldList = byId("manualFieldList");
  if (reset) {
    fieldOverrides = { ...(fieldOverridesBySku[sku?.id] || {}) };
    sellingPointDraftDirty = false;
  }
  ensureAppliedSellingPointValues(sku);
  if (!hasExtractedProducts()) {
    fieldList.innerHTML = `<p class="empty-state">解析资料后显示可替换参数。</p>`;
    if (manualFieldList) manualFieldList.innerHTML = `<p class="empty-state">解析资料后可手动补充数量、尺寸、重量等参数。</p>`;
    return;
  }
  const renderFieldControls = (fieldDefs, useExtractedDefaults) => fieldDefs.map(([key, label, fallback]) => {
    const suppressSharedAssortmentDimension = sku.productStructureRoute === "assortment"
      && extractedManualFieldKeys.has(key);
    const shouldUseExtractedDefault = typeof useExtractedDefaults === "function"
      ? useExtractedDefaults(key)
      : useExtractedDefaults;
    const parameterData = { ...sku, ...values };
    const displayLabel = label;
    const hasSavedOverride = !suppressSharedAssortmentDimension
      && Object.prototype.hasOwnProperty.call(fieldOverrides, key);
    const currentValue = reset ? fieldOverrides[key] ?? "" : byId(`field-${key}`)?.value ?? fieldOverrides[key] ?? "";
    const value = reset
      ? (hasSavedOverride ? cleanFieldDisplayValue(currentValue) : shouldUseExtractedDefault ? values[key] || fallback : cleanFieldDisplayValue(currentValue))
      : (cleanFieldDisplayValue(currentValue) || (shouldUseExtractedDefault ? values[key] : "") || fallback);
    const cleanValue = suppressSharedAssortmentDimension
      ? ""
      : ["fit", "scene"].includes(key)
      ? sanitizeUseContextFields({ ...values, [key]: cleanFieldDisplayValue(value) })[key]
      : cleanFieldDisplayValue(value);
    const baseDisplayValue = key === "scene"
      ? formatUseSceneDisplayValue(cleanValue)
      : multilineFieldKeys.has(key)
        ? formatMultilineSellingPoints(cleanValue)
        : cleanValue;
    const displayValue = ["topWidth", "sideLength", "bottomWidth", "weight"].includes(key) && baseDisplayValue
      ? editableParameterValue(baseDisplayValue, semanticParameterLabel(parameterData, key))
      : baseDisplayValue;
    const fieldControl = key === "scene"
      ? `<textarea id="field-${key}" class="use-scene-input" data-key="${key}" rows="6" placeholder="${NO_REFERENCE_SCENE_MESSAGE}">${escapeHtml(displayValue)}</textarea>
        <button id="enrichUseScenes" type="button" class="secondary scene-enrich-button">联网补全 3–5 个英文场景</button>
        <p id="sceneEnrichStatus" class="scene-enrich-status" role="status" aria-live="polite">通过本地服务联网查找；查不到时不使用兜底场景。</p>`
      : multilineFieldKeys.has(key)
        ? `<textarea id="field-${key}" class="selling-point-input" data-key="${key}" rows="4">${escapeHtml(displayValue)}</textarea>`
        : `<input id="field-${key}" data-key="${key}" value="${escapeHtml(displayValue)}"${suppressSharedAssortmentDimension ? " disabled placeholder=\"不同款需按成员分别取证\"" : ""}>`;
    const sourceText = !suppressSharedAssortmentDimension && (extractedManualFieldKeys.has(key) || supplierStructuredFieldKeys.has(key)) && displayValue
      ? parameterSourceForData(parameterData, key)
      : "";
    return `
      <div>
        <label for="field-${key}">${displayLabel}</label>
        ${fieldControl}
        ${sourceText ? `<p class="parameter-source">来源：${escapeHtml(sourceText)}</p>` : ""}
      </div>
    `;
  }).join("");
  const fieldControls = renderFieldControls(fields, true);
  const manualFieldControls = renderFieldControls(manualFields, (key) => extractedManualFieldKeys.has(key));
  fieldList.innerHTML = `${fieldControls}
    <div id="sellingPointApplyWrap" class="selling-point-apply-wrap${sellingPointDraftDirty ? "" : " is-hidden"}">
      <button id="applySellingPoints" type="button" class="ghost selling-point-apply">确认生成卖点图提示词</button>
      <p class="selling-point-apply-note">卖点已修改，点击后更新右侧卖点图场景和提示词。</p>
    </div>
  `;
  if (manualFieldList) manualFieldList.innerHTML = manualFieldControls;
  document.querySelectorAll("#fieldList input, #fieldList textarea, #manualFieldList input, #manualFieldList textarea").forEach((input) => {
    ["input", "change"].forEach((eventName) => input.addEventListener(eventName, handleFieldInput));
  });
  byId("applySellingPoints")?.addEventListener("click", applySellingPointChanges);
  byId("enrichUseScenes")?.addEventListener("click", enrichUseScenesOnline);
  updateSellingPointApplyState();
}

function splitUseSceneText(value) {
  return String(value || "")
    .replace(/\r\n?/g, "\n")
    .split(/\n+|\s+\/\s+|[;；]+/)
    .map((item) => item.replace(/^[\s,，.。-]+|[\s,，.。-]+$/g, "").trim())
    .filter(Boolean);
}

function formatUseSceneDisplayValue(value) {
  return splitUseSceneText(value).join("\n");
}

function formatMultilineSellingPoints(value) {
  return splitSellingPointText(value).join("\n");
}

function splitSellingPointText(value) {
  return String(value || "")
    .replace(/\r\n?/g, "\n")
    .split(/\n+|[;；]\s*|\s+\+\s+|\s+\/\s+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function cleanTokenValue(value) {
  return String(value || "")
    .replace(/^\[[A-Z0-9_ ]+:?\s*/i, "")
    .replace(/\]$/g, "")
    .trim();
}

function cleanFieldDisplayValue(value) {
  const raw = String(value || "").trim();
  if (raw === NO_REFERENCE_SCENE_MESSAGE) return "";
  if (/^\[[A-Z0-9_ ]+\]$/i.test(raw)) return "";
  const clean = cleanTokenValue(raw);
  return isCodeLikeValue(clean) || isInvalidParameterValue(clean) ? "" : clean;
}

function isCodeLikeValue(value) {
  return /<\s*\/?\s*(?:script|style|html|body)|\b(?:body|html)\s*\{|display\s*:|window\.|traceId|polyfill|RegeneratorRuntime|<\/script|src\s*=|PRODUCT_ATTRIBUTE|SKU_OPTION|PRODUCT_TITLE|Source HTML file|Purchase order image OCR|model\s*=|colorEnglish\s*=|[{}]{2,}/i.test(String(value || ""));
}

function isMachineProductText(value) {
  const clean = String(value || "").trim();
  if (!clean) return true;
  if (/^(?:temu|tmall|taobao|1688|alibaba|amazon|source html file)$/i.test(clean)) return true;
  return /SKU_OPTION|PRODUCT_ATTRIBUTE|PRODUCT_TITLE|SUPPLIER-SKU|model\s*=|colorEnglish\s*=|rawSpec\s*=|variantStyle\s*=|traceId|window\.|<\/?[a-z]/i.test(clean);
}

function readableNameFromRawSpec(value) {
  const raw = String(value || "").match(/rawSpec\s*=\s*([^;\n|]+)/i)?.[1] || String(value || "");
  const clean = decodeHtmlEntities(raw)
    .replace(/SKU_OPTION\s*[:;]+/gi, " ")
    .replace(/\bmodel\s*=\s*[^;\n|]+/gi, " ")
    .replace(/\bcolor(?:English)?\s*=\s*[^;\n|]+/gi, " ")
    .replace(/\bvariantStyle\s*=\s*[^;\n|]+/gi, " ")
    .replace(/\bsize\s*=\s*[^;\n|]+/gi, " ")
    .replace(/不送工具|不含工具|送工具|白色|黑色|透明色|透明|颜色\s*[:：]?/gi, " ")
    .replace(/[;|]+/g, " ")
    .replace(/\s*-\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!clean || isMachineProductText(clean)) return "";
  const match = clean.match(/([\u4e00-\u9fff]{2,}(?:\s*[0-9]+(?:\.[0-9]+)?\s*(?:ml|mL|g|kg|cm|mm|L|升|克|毫升))?)/);
  return (match?.[1] || clean).replace(/\s+/g, " ").trim();
}

function cleanProductDisplayName(value, fallback = "Product") {
  const rawSpecName = readableNameFromRawSpec(value);
  const source = rawSpecName || stripSupplierModelCodes(cleanFieldDisplayValue(value));
  if (!source || isMachineProductText(source)) return fallback;
  return source.length > 60 ? source.slice(0, 60).trim() : source;
}

function isInvalidParameterValue(value) {
  const clean = String(value || "").trim();
  if (!clean) return true;
  if (!/[0-9A-Za-z\u4e00-\u9fff]/.test(clean)) return true;
  if (/^\.\s*g$/i.test(clean)) return true;
  return false;
}

function ensureParameterToken(name, value) {
  const raw = String(value || "").trim();
  const clean = cleanTokenValue(raw);
  if (!clean || /^\[[A-Z0-9_ ]+\]$/i.test(raw)) return `[${name}]`;
  return `[${name}: ${clean}]`;
}

function hasTokenContent(value) {
  return /^\[[A-Z0-9_ ]+:\s*[^\]]+\]$/i.test(String(value || "").trim());
}

function productParameterRows() {
  const groups = new Map();
  const selectedId = selectedSku()?.id;
  // This panel sits below the current SKU selector, so it must never mix
  // sibling/parent products into the selected product's parameter view.
  currentProducts().filter((sku) => sku.id === selectedId).forEach((sku) => {
    const isSelected = sku.id === selectedId;
    const values = sku.id === selectedId ? { ...valueMap(sku), ...currentFields() } : valueMap(sku);
    const groupKey = sku.groupKey || sku.sizeCode || sku.shape || sku.id;
    const existing = groups.get(groupKey) || {
      title: sku.sizeCode || sku.shape || "Product Specification",
      productName: cleanFieldDisplayValue(values.productName || defaultProductName(sku)),
      shape: sku.shape || cleanTokenValue(values.singleSpec),
      cupRange: "",
      material: cleanTokenValue(values.material),
      structure: cleanTokenValue(values.structure),
      category: cleanTokenValue(values.category),
      productStyle: cleanTokenValue(values.productStyle),
      packaging: cleanTokenValue(values.packaging),
      detailParameter: cleanTokenValue(values.detailParameter),
    };

    if (isSelected || !existing.cupRange) {
      existing.cupRange = validSizeRangeValue(sizeRangeValueForSku(sku, values));
    }
    if (isSelected || !existing.material) existing.material = cleanTokenValue(values.material);
    if (isSelected || !existing.structure) existing.structure = cleanTokenValue(values.structure);
    if (isSelected || !existing.category) existing.category = cleanTokenValue(values.category);
    if (isSelected || !existing.productStyle) existing.productStyle = cleanTokenValue(values.productStyle);
    if (isSelected || !existing.packaging) existing.packaging = cleanTokenValue(values.packaging);
    if (isSelected || !existing.detailParameter) existing.detailParameter = cleanTokenValue(values.detailParameter);
    if (isSelected || !existing.productName) existing.productName = cleanFieldDisplayValue(values.productName || defaultProductName(sku));
    groups.set(groupKey, existing);
  });

  return Array.from(groups.values());
}

function validRangeValue(value) {
  const clean = cleanFieldDisplayValue(value);
  if (!clean) return "";
  if (isCodeLikeValue(clean)) return "";
  return clean;
}

function renderProductParameters() {
  const list = byId("productParamList");
  if (!list) return;

  const rows = productParameterRows();
  if (!hasExtractedProducts()) {
    list.innerHTML = `<p class="empty-state">解析 Amazon 模板或 1688 资料后显示产品主参数。</p>`;
    return;
  }
  list.innerHTML = rows.map((row) => {
    const params = [
      ["Product / Option", row.productName || row.title],
      ["Use Scene", row.scene],
      ["Category", row.category],
      ["Material", row.material],
      ["Structure / Craft", row.structure],
      ["Product Style", row.productStyle],
      ["Supplier Packaging", row.packaging],
      ["Detail Features", row.detailParameter],
    ].filter(([, value]) => value && !/^\[[A-Z0-9_ ]+\]$/i.test(value));

    return `
      <article class="product-param-card">
        <h3>${escapeHtml(row.shape || row.title)}</h3>
        <dl>
          ${params.map(([label, value]) => `
            <div>
              <dt>${escapeHtml(label)}</dt>
              <dd>${escapeHtml(value)}</dd>
            </div>
          `).join("")}
        </dl>
      </article>
    `;
  }).join("");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char]));
}

function highlightPromptVariables(text, facts, typeId = "") {
  const escapedText = escapeHtml(text);
  const sectionPattern = "PRIORITY|VISUAL|TEXT|AVOID|优先级|视觉画面|文字规则|避免事项";
  const subsectionPattern = "PRODUCT FACTS|SCENE &amp; COMPOSITION|SCENE DIRECTION|COMPOSITION \\/ LAYOUT|TEXT \\/ CALLOUTS|ACCURACY GUARDRAILS|OTHER STYLE|产品事实|场景构图|场景方向|构图布局|文字标注|准确性约束|其他风格";
  return escapedText
    .replace(new RegExp(`^(${sectionPattern}):$`, "gm"), '<span class="prompt-section-title">$1</span>')
    .replace(new RegExp(`^(${subsectionPattern}):(.*)$`, "gm"), (_, label, body) => (
      `<span class="prompt-subsection-line"><span class="prompt-subsection-title">${label}</span><span class="prompt-subsection-body">${body.trim()}</span></span>`
    ))
    .replace(/(【[^】\n]{3,600}】)/g, '<span class="variable-token">$1</span>');
}

function promptVariableValues(facts) {
  return uniquePromptItems([
    facts.productName,
    facts.cupType,
    facts.selectedSpec,
    facts.skuOption,
    facts.titleSpec,
    facts.pack,
    facts.cupRange,
    facts.material,
    facts.color,
    facts.scene,
    facts.feature1,
    facts.feature2,
    facts.feature3,
    facts.bundleComponents,
    facts.variants,
    facts.specs,
    facts.dimensions,
    facts.dimension1,
    facts.dimension2,
    facts.dimension3,
    facts.weightOrCapacity,
    facts.structure,
    facts.surfaceFinish,
    facts.detailParameter,
    ...splitSellingPointText(facts.feature1),
    ...splitSellingPointText(facts.feature2),
  ].map((value) => cleanTokenValue(value)).filter(Boolean));
}

function bracketValue(value) {
  const clean = String(value || "").trim();
  return clean ? `【${clean}】` : "";
}

function bracketPromptVariables(text, facts, typeId = "") {
  const values = promptVariableValues(facts)
    .filter(Boolean)
    .map((value) => String(value).trim())
    .filter((value) => value.length >= 3 && !isGenericPromptFallback(value))
    .sort((a, b) => b.length - a.length);
  const seen = new Set();
  const uniqueValues = values.filter((value) => {
    const key = comparablePromptItem(value);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  if (!uniqueValues.length) return text;
  const pattern = new RegExp(uniqueValues
    .map((value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|"), "g");

  return String(text || "")
    .split(/(【[^】]+】)/g)
    .map((segment) => {
      if (/^【[^】]+】$/.test(segment)) return segment;
      return segment.replace(pattern, (match) => bracketValue(match));
    })
    .join("");
}

function readFieldValue(key) {
  const input = byId(`field-${key}`);
  const skuId = selectedSku()?.id || "";
  const scopedOverrides = fieldOverridesBySku[skuId] || fieldOverrides;
  return cleanFieldDisplayValue(input ? input.value : scopedOverrides[key] ?? "");
}

function hasFieldOverride(key) {
  return Object.prototype.hasOwnProperty.call(fieldOverrides, key);
}

function captureFieldOverrides() {
  const skuId = selectedSku()?.id || "";
  const nextOverrides = { ...(fieldOverridesBySku[skuId] || {}) };
  allFields.forEach(([key]) => {
    const input = byId(`field-${key}`);
    if (input) nextOverrides[key] = cleanFieldDisplayValue(input.value);
  });
  if (skuId) fieldOverridesBySku[skuId] = nextOverrides;
  fieldOverrides = nextOverrides;
}

function currentFields() {
  captureFieldOverrides();
  const sku = selectedSku();
  const values = valueMap(sku);
  const data = {};
  allFields.forEach(([key]) => {
    const value = fieldOverrides[key] ?? readFieldValue(key);
    data[key] = hasFieldOverride(key)
      ? cleanFieldDisplayValue(value)
      : cleanFieldDisplayValue(value) || (manualFieldKeys.has(key) ? "" : values[key]) || "";
  });
  const sanitizedUseContext = sanitizeUseContextFields(data);
  data.fit = "";
  data.scene = splitUseSceneText(sanitizedUseContext.scene).join(" / ");
  return data;
}

function hydrateEmptyFieldInputsFromValues() {
  if (!hasExtractedProducts()) return;
  const sku = selectedSku();
  const values = valueMap(sku);
  const skuId = sku?.id || "";
  let changed = false;
  fields.forEach(([key]) => {
    const input = byId(`field-${key}`);
    const value = cleanFieldDisplayValue(values[key]);
    if (!input || !value || cleanFieldDisplayValue(input.value)) return;
    input.value = value;
    fieldOverrides[key] = value;
    if (skuId) {
      fieldOverridesBySku[skuId] = {
        ...(fieldOverridesBySku[skuId] || {}),
        [key]: value,
      };
    }
    changed = true;
  });
  if (changed) fieldSnapshot = currentFieldSignature();
}

function currentFieldSignature() {
  return allFields.map(([key]) => `${key}:${readFieldValue(key)}`).join("|");
}

function ensureAppliedSellingPointValues(sku = selectedSku()) {
  const skuId = sku?.id || "";
  if (!skuId || appliedSellingPointOverridesBySku[skuId]) return;
  const values = valueMap(sku);
  appliedSellingPointOverridesBySku[skuId] = {
    feature1: cleanFieldDisplayValue(values.feature1),
    feature2: cleanFieldDisplayValue(values.feature2),
  };
}

function appliedSellingPointValues(sku = selectedSku()) {
  ensureAppliedSellingPointValues(sku);
  const skuId = sku?.id || "";
  return appliedSellingPointOverridesBySku[skuId] || {};
}

function updateSellingPointApplyState() {
  const wrap = byId("sellingPointApplyWrap");
  if (!wrap) return;
  wrap.classList.toggle("is-hidden", !sellingPointDraftDirty);
}

function applySellingPointChanges() {
  captureFieldOverrides();
  const skuId = selectedSku()?.id || "";
  if (skuId) {
    appliedSellingPointOverridesBySku[skuId] = {
      feature1: readFieldValue("feature1"),
      feature2: readFieldValue("feature2"),
    };
  }
  fieldSnapshot = currentFieldSignature();
  sellingPointDraftDirty = false;
  updateSellingPointApplyState();
  renderAll();
}

function handleFieldInput(event) {
  const key = event.currentTarget?.dataset?.key;
  const isSellingPointField = sellingPointFieldKeys.has(key);
  if (key === "scene") sceneInputRevision += 1;
  if (isSellingPointField) sellingPointInputRevision += 1;
  if (key) {
    fieldOverrides[key] = event.currentTarget.value;
    const skuId = selectedSku()?.id || "";
    if (skuId) {
      fieldOverridesBySku[skuId] = {
        ...(fieldOverridesBySku[skuId] || {}),
        [key]: event.currentTarget.value,
      };
      if (isSellingPointField) {
        appliedSellingPointOverridesBySku[skuId] = {
          ...(appliedSellingPointOverridesBySku[skuId] || {}),
          [key]: cleanFieldDisplayValue(event.currentTarget.value),
        };
      }
    }
  }
  fieldSnapshot = currentFieldSignature();
  if (isSellingPointField) {
    sellingPointDraftDirty = false;
    updateSellingPointApplyState();
  }
  captureFieldOverrides();
  renderAll();
}

function syncFieldChanges() {
  const nextSnapshot = currentFieldSignature();
  if (nextSnapshot === fieldSnapshot) return;
  captureFieldOverrides();
  fieldSnapshot = nextSnapshot;
  renderAll();
}

function startFieldWatcher() {
  fieldSnapshot = currentFieldSignature();
  window.setInterval(syncFieldChanges, 300);
}

function compactSourceStatus(text) {
  const length = String(text || "").trim().length;
  if (!length) return "待输入";
  if (length >= 1200) return "已读取";
  return "少量文本";
}

function sourceSummaryRows(sku, template) {
  const products = currentProducts();
  const selectedGroup = productGroups[sku.groupKey] || sku.group || {};
  const dimensionStatus = sku.dims?.source || selectedGroup.evidenceNote || "按当前字段生成";
  const hasCompetitorEvidence = Boolean(sourcePayload.competitor) || Object.values(referenceImageMetaBySku)
    .flat()
    .some((item) => item?.image_type === "amazon_competitor_reference");
  if (!hasExtractedProducts()) {
    return [
      ["Amazon 模板", sourcePayload.amazonTemplate ? compactSourceStatus(sourcePayload.amazonTemplate) : "未输入", sourceNotes.amazonTemplate],
      ["供应商", sourcePayload.supplier ? compactSourceStatus(sourcePayload.supplier) : "待输入", sourceNotes.alibaba],
      ["参考链接", hasCompetitorEvidence ? "已读取" : "未输入", sourceNotes.amazon],
      ["当前输出", `待解析，${template.imageTypes.length} 张图模板`, "解析资料后生成当前产品图组。"],
    ];
  }
  return [
    ["Amazon 模板", sourcePayload.amazonTemplate ? compactSourceStatus(sourcePayload.amazonTemplate) : "未输入", sourceNotes.amazonTemplate],
    ["供应商", sourcePayload.supplier ? compactSourceStatus(sourcePayload.supplier) : "待输入", sourceNotes.alibaba],
    ["参考链接", hasCompetitorEvidence ? "已读取" : "未输入", sourceNotes.amazon],
    ["当前输出", `${products.length} 个产品 / 款式，${template.imageTypes.length} 张图`, dimensionStatus],
  ];
}

function renderSourceSummary() {
  const summary = byId("sourceSummary");
  if (!summary) return;

  const sku = selectedSku();
  const template = selectedTemplate();
  summary.innerHTML = sourceSummaryRows(sku, template).map(([label, status, note]) => `
    <article class="source-summary-item">
      <div>
        <strong>${escapeHtml(label)}</strong>
        <span>${escapeHtml(note)}</span>
      </div>
      <mark>${escapeHtml(status)}</mark>
    </article>
  `).join("");
}

const dimensionFieldKeyByIndex = { 1: "topWidth", 2: "sideLength", 3: "bottomWidth" };
const dimensionLabelCandidatesByKey = {
  topWidth: ["length", "base_diameter", "diameter", "top_width", "folded_size", "expanded_width", "sku_dimension_1"],
  sideLength: ["width", "front_diameter", "knob_diameter", "side_length", "open_diameter", "expanded_length", "sku_dimension_2"],
  bottomWidth: ["height", "thickness", "projection_depth", "depth", "overall_projection", "bottom_width", "open_height", "sku_dimension_3"],
  weight: ["weight", "item_weight", "weight_capacity"],
};

function dimensionListItemForField(data, key) {
  const items = dimensionListItems(data?.dimensionList || "", [data?.productName, data?.structure].filter(Boolean).join(" "));
  const candidates = dimensionLabelCandidatesByKey[key] || [];
  return items.find((item) => candidates.includes(canonicalDimensionKey(item))) || null;
}

function dimensionItemLabel(item, fallback) {
  const label = cleanFieldDisplayValue(String(item || "").split(":")[0]);
  return label || fallback;
}

function dimensionLabelForData(data, index) {
  const key = dimensionFieldKeyByIndex[index];
  return dimensionItemLabel(dimensionListItemForField(data, key), `Dimension ${index}`);
}

function dimensionWeightLabelForData(data) {
  return dimensionItemLabel(dimensionListItemForField(data, "weight"), "Weight / Quantity");
}

function semanticParameterLabel(data, key) {
  if (key === "weight") return dimensionWeightLabelForData(data).replace(/\s*\/\s*Quantity$/i, "") || "Weight";
  const index = { topWidth: 1, sideLength: 2, bottomWidth: 3 }[key];
  return index ? dimensionLabelForData(data, index) : "";
}

function editableParameterParts(value, fallbackLabel = "") {
  const clean = cleanFieldDisplayValue(value);
  if (!clean) return { label: fallbackLabel, value: "" };
  const prefixed = clean.match(/^([A-Za-z][A-Za-z0-9 /_-]{0,40}?)\s*[:：]?\s*((?:\d|\.)[\s\S]*)$/);
  if (prefixed) return { label: cleanFieldDisplayValue(prefixed[1]) || fallbackLabel, value: cleanFieldDisplayValue(prefixed[2]) };
  return { label: fallbackLabel, value: clean };
}

function editableParameterValue(value, fallbackLabel) {
  const parts = editableParameterParts(value, fallbackLabel);
  return [parts.label, parts.value].filter(Boolean).join(" ");
}

function parameterSourceForData(data, key) {
  if (supplierStructuredFieldKeys.has(key)) {
    return cleanFieldDisplayValue(data?.structuredAttributesSource || "");
  }
  const direct = cleanFieldDisplayValue(data?.dimensionSources?.[key] || "");
  if (direct) return direct;
  return String(data?.dims?.source || "")
    .split(/\s*\+\s*/)
    .map((item) => cleanFieldDisplayValue(item))
    .filter((item) => item && !/No verified dimensions extracted/i.test(item))
    .join(" + ");
}

function buildDimensionListFromFields(data) {
  const entry = (key, fallbackLabel) => {
    const parts = editableParameterParts(data[key], fallbackLabel);
    return parts.value ? `${parts.label}: ${parts.value}` : "";
  };
  const dimensions = [
    entry("topWidth", dimensionLabelForData(data, 1)),
    entry("sideLength", dimensionLabelForData(data, 2)),
    entry("bottomWidth", dimensionLabelForData(data, 3)),
    entry("weight", semanticParameterLabel(data, "weight")),
  ].filter(Boolean);
  return dimensions.length ? `[VERIFIED_DIMENSIONS: ${dimensions.join("; ")}]` : "";
}

function mergeDimensionListsKeepingFieldEdits(fieldList, sourceList, context = "") {
  const primary = dimensionListItems(fieldList, context);
  const secondary = dimensionListItems(sourceList, context);
  const primaryKeys = new Set(primary.map((item) => canonicalDimensionKey(item, context)));
  const merged = [
    ...primary,
    ...secondary.filter((item) => !primaryKeys.has(canonicalDimensionKey(item, context))),
  ];
  return merged.length ? `[VERIFIED_DIMENSIONS: ${uniquePromptItems(merged).join("; ")}]` : "";
}

function currentPromptData(sku) {
  const base = valueMap(sku);
  const fieldsData = currentFields();
  const data = {
    ...base,
    ...fieldsData,
    pack: fieldsData.pack || "",
    cupRange: fieldsData.cupRange || "",
    surfaceFinish: fieldsData.surfaceFinish || "",
    topWidth: fieldsData.topWidth || "",
    sideLength: fieldsData.sideLength || "",
    bottomWidth: fieldsData.bottomWidth || "",
    weight: fieldsData.weight || "",
    detailParameter: fieldsData.detailParameter || "",
    feature3: "",
  };
  if (sellingPointDraftDirty) {
    const appliedSellingPoints = appliedSellingPointValues(sku);
    data.feature1 = appliedSellingPoints.feature1 ?? base.feature1 ?? "";
    data.feature2 = appliedSellingPoints.feature2 ?? base.feature2 ?? "";
  }
  const group = productGroups[sku.groupKey] || sku.group || {};
  const productName = promptValue(data.productName, defaultProductName(sku));
  const isDifferentDesignSet = sku.productStructureRoute === "assortment";
  data.fit = "";
  const liveColor = promptValue(data.color, "");
  const skuColor = promptValue(sku.color || sku.colorEnglish || sku.displayColor, "");
  const baseSpec = promptValue(sku.outputSizeCode || sku.sizeCode || sku.shape || group.promptName, "");
  const optionSpec = liveColor && skuColor
    ? liveColor
    : baseSpec
    || promptValue(sku.shape, "")
    || group.promptName
    || productName
    || "[PRODUCT_SPEC]";
  const productSpec = productName || optionSpec || "[PRODUCT_SPEC]";
  const pack = fieldsData.pack || "";
  const cupRange = validSizeRangeValue(fieldsData.cupRange || "");
  data.productName = productName;
  data.packagingCount = ensureParameterToken("PRODUCT_COUNT_OR_SET", pack);
  data.singleSpec = `[CURRENT_PRODUCT_OPTION: ${[productSpec, pack].filter(Boolean).join(", ")}]`;
  data.bundleComponents = bundleComponentPromptText(bundleStateForSku(sku)) || base.bundleComponents || sku.bundleComponents || "";
  // A mixed-design set cannot safely reuse one global length/width/thickness
  // triplet: those measurements may describe only one member. Keep dimensions
  // empty until the UI supports evidence mapped to each individual member.
  if (isDifferentDesignSet) {
    data.topWidth = "";
    data.sideLength = "";
    data.bottomWidth = "";
    data.weight = "";
  }
  data.dimensionList = isDifferentDesignSet
    ? ""
    : mergeDimensionListsKeepingFieldEdits(
      buildDimensionListFromFields(data),
      base.dimensionList || sku.dimensionList || "",
      [data.productName, data.structure, data.detailParameter].filter(Boolean).join(" "),
    );
  data.specList = `[SPEC_LIST: ${[productSpec, optionSpec !== productSpec ? optionSpec : "", cupRange, pack, data.material, data.dimensionList].filter(Boolean).join(" / ")}]`;
  return data;
}

function cleanHtmlText(html) {
  const strippedHtml = String(html || "")
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, " ");
  const doc = new DOMParser().parseFromString(strippedHtml, "text/html");
  doc.querySelectorAll("script, style, noscript, svg").forEach((node) => node.remove());
  const title = doc.querySelector("title")?.textContent || "";
  const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute("content") || "";
  const headings = Array.from(doc.querySelectorAll("h1,h2,h3")).map((node) => node.textContent).join(" ");
  const body = doc.body?.innerText || "";
  return [title, metaDescription, headings, body].join("\n").replace(/\s+/g, " ").trim();
}

function normalizeImageUrl(value) {
  const raw = String(value || "")
    .replace(/\\u002F/gi, "/")
    .replace(/\\\//g, "/")
    .replace(/&amp;/g, "&")
    .trim();
  if (!raw || /^data:|^blob:/i.test(raw)) return "";
  if (raw.startsWith("//")) return `https:${raw}`;
  if (/^https?:\/\//i.test(raw)) return raw;
  return "";
}

function imageInfoKeywordScore(text) {
  const source = String(text || "");
  const keywordMatches = source.match(/产品参数|产品信息|产品详情|产品说明|详细资料|说明|品名|克重|尺码|尺寸|长|宽|高|直径|半径|收纳|折叠|展开|面料|材质|材料|工艺|特殊工艺|厚薄|弹力|拉力|阻力|抗拉|防断|不断裂|不惧断裂|不变形|耐用|全身|针数|柔软|规格|型号|重量|容量|PRODUCT\s*NAME|GRAM\s*WEIGHT|SIZE|MATERIAL|TECHNOLOGY|DETAIL|PARAMETER|description|specification|diameter|folded|compact|portable|umbrella|stretch|resistance|fracture|tear|durable/gi);
  const largeDetailMatches = source.match(/详情|描述|detail|desc|offer-detail|product-description|商品介绍|产品介绍/gi);
  return (keywordMatches ? keywordMatches.length * 8 : 0) + (largeDetailMatches ? largeDetailMatches.length * 5 : 0);
}

function productDetailLabelScore(text) {
  const source = String(text || "");
  const labels = source.match(/品\s*名|PRODUCT\s*NAME|克\s*重|GRAM\s*WEIGHT|尺\s*码|SIZE|尺\s*寸|规\s*格|重\s*量|直\s*径|收\s*纳|折\s*叠|展\s*开|伞\s*面|面\s*料|MATERIAL|工\s*艺|TECHNOLOGY|特\s*殊\s*工\s*艺|厚\s*薄|弹\s*力|拉\s*力|阻\s*力|抗\s*拉|防\s*断|不\s*断\s*裂|不\s*变\s*形|耐\s*用|针\s*数|柔\s*软|产品参数|产品信息|产品说明|详细资料|规格参数|description|specification|diameter|folded|compact|portable|stretch|resistance|durable/gi);
  return labels ? labels.length : 0;
}

function isFactoryOrServiceImageText(text) {
  return /源头厂家|品质保障|为什么选择|工厂面积|厂房面积|生产设备|日发量|日产量|发货员|包装工|仓库面积|仓储能力|行业经验|实力认证|分销代理|代理加盟|网络代销|资质齐全|发货支持|产品支持|运营支持|客服支持|售前咨询|售后指导|来图来样|定制logo|提供精美图片包|48H|48小时|常备库存|快速打样|设计团队|质量保证|厂房|工厂|仓库|物流|发货|退货|开票|服务规则|买家保障|跨境服务|factory|warehouse|production\s+capacity|daily\s+output|shipping|return\s+policy|customer\s+service|distribution\s+agent/i.test(String(text || ""));
}

function isCommerceOrRecommendationText(text) {
  return /店铺推荐|爆款推荐|热卖|严选|¥|￥|价格|起批|拿货|下单|包邮|现货|只做精品|包装可定制|支持混批|一件代发|跨境货源|货源|厂家直销|批发|供应商|seller|price|wholesale|dropshipping/i.test(String(text || ""));
}

function productFeatureTextScore(text) {
  const matches = String(text || "").match(/防滑|硅胶|点胶|抓地|弹力|拉力|阻力|训练|拉伸|抗拉|防断|断裂|不断裂|不惧断裂|不变形|变形|耐用|全身|需求|高弹|柔软|透气|棉|聚酯|氨纶|尺码|克重|重量|尺寸|直径|收纳|折叠|展开|小巧|轻便|便携|防晒|遮阳|防雨|防风|伞骨|晴雨|材质|面料|工艺|厚薄|针数|袜|鞋|服装|衣服|裤|裙|箱包|背包|手提包|杯|滤纸|包装纸|包花纸|花束|鲜花包装|花艺|礼品包装|伞|胶带|手胶|吸汗带|龙骨胶|防滑带|羽毛球拍|网球拍|网拍|鱼竿|cotton|spandex|polyester|silicone|tpe|resistance|exercise\s+band|workout\s+band|stretch|fracture|tear|durable|grip|overgrip|handle\s+wrap|anti.?slip|non.?slip|size|material|weight|texture|umbrella|compact|portable|uv|windproof|waterproof|wrapping\s+paper|flower\s+wrapping|bouquet|floral\s+wrap|gift\s+wrap/gi);
  return matches ? matches.length : 0;
}

function isProductInfoImageText(text) {
  return imageInfoKeywordScore(text) > 0 || productFeatureTextScore(text) > 0;
}

function isProductParameterImageCandidate(candidate) {
  const context = typeof candidate === "string" ? "" : candidate?.context || "";
  if (!context || /开票|发票|invoice|receipt|推荐|热卖|掌柜|店铺|价格|起批/i.test(context)) return false;
  return /(?:产品|商品|手胶|胶带|吸汗带|龙骨胶|防滑带|grip|tape|overgrip|handle\s+wrap)[\s\S]{0,16}(?:说明|参数|规格|尺寸|详情|info|detail|specification|size)|(?:说明|参数|规格|尺寸|详情|info|detail|specification|size)[\s\S]{0,16}(?:产品|商品|手胶|胶带|吸汗带|龙骨胶|防滑带|grip|tape|overgrip|handle\s+wrap)/i.test(context);
}

function ocrCompactText(text) {
  return String(text || "").replace(/\s+/g, "");
}

function isProductSellingPointText(text) {
  const source = String(text || "");
  return /DOUBAO_VISION_SELLING_POINT\s*:|(?:卖点|产品特点|核心功能|产品优势|Selling Point|Product Benefit)\s*[:：]/i.test(source);
}

function urlImageSizeHint(url) {
  const source = String(url || "");
  const candidates = [];
  for (const match of source.matchAll(/(?:^|[._-])([1-9]\d{1,4})x([1-9]\d{1,4})(?:[._-]|$)/gi)) {
    candidates.push({ width: Number(match[1]), height: Number(match[2]) });
  }
  for (const match of source.matchAll(/(?:tps|size)[_-]([1-9]\d{1,4})[_-]([1-9]\d{1,4})/gi)) {
    candidates.push({ width: Number(match[1]), height: Number(match[2]) });
  }
  for (const match of source.matchAll(/[-_]([1-9]\d{1,4})[-_]([1-9]\d{1,4})(?=\.(?:jpe?g|png|webp|gif)(?:[?#]|$))/gi)) {
    candidates.push({ width: Number(match[1]), height: Number(match[2]) });
  }
  const query = source.match(/[?&](?:w|width)=([1-9]\d{1,4})(?:&|$).*?[?&](?:h|height)=([1-9]\d{1,4})(?:&|$)/i)
    || source.match(/[?&](?:h|height)=([1-9]\d{1,4})(?:&|$).*?[?&](?:w|width)=([1-9]\d{1,4})(?:&|$)/i);
  if (query) candidates.push({ width: Number(query[1]), height: Number(query[2]) });
  return candidates.find((size) => Number.isFinite(size.width) && Number.isFinite(size.height)) || null;
}

function isSmallOrThumbnailImageUrl(url) {
  const source = String(url || "");
  if (/alicdn\.com\/cms\/upload\//i.test(source)) return true;
  if (/\.(?:summ|search|icon|small|thumb|avatar|logo)\.(?:jpe?g|png|webp|gif)(?:[?#]|$)/i.test(source)) return true;
  if (/\.(?:jpe?g|png|webp|gif)_(?:[1-9]\d{1,3}x[1-9]\d{1,3}|q\d+)(?:[?#]|$)/i.test(source)) return true;
  if (/(?:^|[._-])(?:16|24|32|40|48|50|58|60|64|80|88|100|120|150|160|180|200|220|240|260|300|310)x(?:16|24|32|40|48|50|58|60|64|80|88|100|120|150|160|180|200|220|240|260|300|310)(?:[._-]|$)/i.test(source)) return true;
  const size = urlImageSizeHint(source);
  if (size && (Math.min(size.width, size.height) < 480 || size.width * size.height < 450000)) return true;
  if (/[?&](?:w|width|h|height)=(?:[1-9]|[1-9]\d|[12]\d\d|3[01]\d)(?:&|$)/i.test(source)) return true;
  return false;
}

function isDetailSource(meta) {
  return String(meta?.source || "").toLowerCase() === "detail";
}

function isDetailDescriptionGifUrl(url, meta = {}) {
  const source = String(url || "");
  return isDetailSource(meta)
    && /\.gif(?:[?#]|$)/i.test(source)
    && /cbu01\.alicdn\.com\/img\/ibank\//i.test(source)
    && !/cms\/upload|(?:logo|icon|avatar|sprite|loading|blank|placeholder|qrcode|qr-code)/i.test(source);
}

function isSupportedProductImageUrl(url, meta = {}) {
  const source = String(url || "");
  if (/\.(?:jpe?g|png|webp)(?:[?#]|$)/i.test(source)) return true;
  return isDetailDescriptionGifUrl(source, meta);
}

function isLikelyProductDetailImageCandidate(candidate) {
  const url = imageCandidateUrl(candidate);
  const context = typeof candidate === "string" ? "" : candidate?.context || "";
  if (!url || isSmallOrThumbnailImageUrl(url)) return false;
  if (isFactoryOrServiceImageText(context) && !isProductInfoImageText(context)) return false;
  if (isCommerceOrRecommendationText(context) && productDetailLabelScore(context) < 2) return false;
  return true;
}

function addImageUrl(urls, seen, value, meta = {}) {
  const normalized = normalizeImageUrl(value);
  if (!normalized || seen.has(normalized)) return;
  if (!isSupportedProductImageUrl(normalized, meta)) return;
  if (!/alicdn|cbu01|itemcdn|taobao|tmall/i.test(normalized)) return;
  if (/\.(?:svg)(?:[?#]|$)/i.test(normalized)) return;
  if (/(?:logo|icon|avatar|sprite|loading|blank|placeholder|qrcode|qr-code)/i.test(normalized)) return;
  if (isSmallOrThumbnailImageUrl(normalized)) return;
  if (isFactoryOrServiceImageText(meta.context || "") && !isProductInfoImageText(meta.context || "")) return;
  seen.add(normalized);
  urls.push({
    url: normalized,
    source: meta.source || "html",
    context: meta.context || "",
    index: Number.isFinite(meta.index) ? meta.index : urls.length,
    score: (meta.score || 0) + imageInfoKeywordScore(meta.context || ""),
  });
}

function extractSrcsetUrls(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim().split(/\s+/)[0])
    .filter(Boolean);
}

function nearbyImageContext(html, index, radius = 500) {
  const source = String(html || "");
  const start = Math.max(0, index - radius);
  const end = Math.min(source.length, index + radius);
  return cleanHtmlText(source.slice(start, end)).slice(0, 600);
}

function extractImageUrlsFromHtml(html, sourceName = "html") {
  const urls = [];
  const seen = new Set();
  const doc = new DOMParser().parseFromString(html, "text/html");
  const imageAttrs = ["src", "data-src", "data-original", "data-lazy-src", "data-img", "original", "imageurl", "imageUrl"];
  const srcsetAttrs = ["srcset", "data-srcset"];

  doc.querySelectorAll("img, source").forEach((node, index) => {
    const context = [node.getAttribute("alt"), node.getAttribute("title"), node.getAttribute("data-title")].filter(Boolean).join(" ");
    imageAttrs.forEach((attr) => addImageUrl(urls, seen, node.getAttribute(attr), { source: sourceName, context, index }));
    srcsetAttrs.forEach((attr) => {
      extractSrcsetUrls(node.getAttribute(attr)).forEach((url) => addImageUrl(urls, seen, url, { source: sourceName, context, index }));
    });
  });

  const urlPattern = /(?:https?:\\?\/\\?\/|\/\/)[^"'<>\s\\]+?\.(?:jpe?g|png|webp|gif)(?:\?[^"'<>\s\\]*)?/gi;
  for (const match of html.matchAll(urlPattern)) {
    addImageUrl(urls, seen, match[0], {
      source: sourceName,
      context: nearbyImageContext(html, match.index || 0),
      index: match.index || urls.length,
    });
  }

  return urls;
}

function normalizeAmazonProductImageUrl(value) {
  const url = normalizeImageUrl(value).replace(/\\u002F/gi, "/");
  if (!/^https?:\/\//i.test(url)) return "";
  if (!/m\.media-amazon\.com\/images\/I\//i.test(url)) return "";
  if (/(?:sprite|transparent|grey-pixel|favicon|nav-|logo|beacon|uedata|avatar|loading|captcha|icon_zoom|thumbnail-icon)/i.test(url)) return "";
  return url
    .replace(/\._[^./]+_\.(jpg|jpeg|png|webp)(\?.*)?$/i, ".$1$2")
    .replace(/[?#].*$/, "");
}

function extractAmazonCompetitorImageCandidates(html) {
  const source = String(html || "");
  const candidates = [];
  const seen = new Set();
  const add = (value, context = "", index = candidates.length) => {
    const url = normalizeAmazonProductImageUrl(value);
    if (!url || seen.has(url)) return;
    seen.add(url);
    candidates.push({
      url,
      source: "competitor",
      context,
      index,
      score: 200 - Math.min(index, 100),
    });
  };

  const mediaIdPattern = /data-csa-c-content-id=["']([A-Za-z0-9+-]{8,})["'][\s\S]{0,240}?data-csa-c-media-type=["']IMAGE["']/gi;
  for (const match of source.matchAll(mediaIdPattern)) {
    add(`https://m.media-amazon.com/images/I/${match[1]}.jpg`, nearbyImageContext(source, match.index || 0), match.index || candidates.length);
  }

  const doc = new DOMParser().parseFromString(source, "text/html");
  doc.querySelectorAll("img, source").forEach((node, index) => {
    const context = [node.getAttribute("alt"), node.getAttribute("title"), node.getAttribute("data-title")].filter(Boolean).join(" ");
    ["src", "data-src", "data-old-hires", "data-a-hires", "data-thumb", "data-large-image"].forEach((attr) => {
      add(node.getAttribute(attr), context, index);
    });
    ["srcset", "data-srcset"].forEach((attr) => {
      extractSrcsetUrls(node.getAttribute(attr)).forEach((url) => add(url, context, index));
    });
  });

  const objectImagePattern = /"(?:hiRes|large|main|variant|landingImage|thumb)"\s*:\s*"([^"]+)"/gi;
  for (const match of source.matchAll(objectImagePattern)) {
    add(match[1], nearbyImageContext(source, match.index || 0), match.index || candidates.length);
  }
  const urlPattern = /https?:\\?\/\\?\/[^"'<>\s]+?\.(?:jpe?g|png|webp)(?:\?[^"'<>\s]*)?/gi;
  for (const match of source.matchAll(urlPattern)) {
    add(match[0], nearbyImageContext(source, match.index || 0), match.index || candidates.length);
  }

  return uniqueByUrl(candidates).slice(0, MAX_COMPETITOR_REFERENCE_IMAGES);
}

function extractCollectedImageCandidates(text) {
  const source = String(text || "");
  const occurrenceMap = new Map();
  const urlPattern = /https?:\/\/[^"'<>\s]+/gi;
  let occurrenceIndex = 0;
  for (const match of source.matchAll(urlPattern)) {
    const rawUrl = String(match[0] || "").replace(/[)\]}>.,;]+$/g, "");
    const normalizedUrl = normalizeImageUrl(rawUrl);
    let url = normalizedUrl;
    try {
      const parsedUrl = new URL(normalizedUrl);
      parsedUrl.searchParams.delete("__r__");
      url = parsedUrl.toString();
    } catch {
      // Keep the normalized URL when URL parsing is unavailable.
    }
    if (!url || !isSupportedProductImageUrl(url, { source: "collector" })) continue;
    if (isSmallOrThumbnailImageUrl(url)) continue;
    if (/(?:logo|icon|avatar|sprite|loading|blank|placeholder|qrcode|qr-code)/i.test(url)) continue;
    const existing = occurrenceMap.get(url);
    if (existing) {
      existing.occurrenceCount += 1;
      existing.lastOccurrenceIndex = occurrenceIndex;
    } else {
      occurrenceMap.set(url, {
        url,
        source: "collector",
        context: "",
        index: occurrenceIndex,
        firstOccurrenceIndex: occurrenceIndex,
        lastOccurrenceIndex: occurrenceIndex,
        occurrenceCount: 1,
        score: 0,
      });
    }
    occurrenceIndex += 1;
  }
  return Array.from(occurrenceMap.values());
}

function centeredCandidateWindow(candidates, centerRatio, limit) {
  if (!candidates.length || limit <= 0) return [];
  const size = Math.min(limit, candidates.length);
  const center = Math.round((candidates.length - 1) * centerRatio);
  const start = Math.max(0, Math.min(candidates.length - size, center - Math.floor(size / 2)));
  return candidates.slice(start, start + size);
}

function evenlySpacedImageCandidates(candidates, limit = MAX_REFERENCE_CANDIDATES) {
  const values = uniqueByUrl(candidates);
  if (values.length <= limit) return values;
  const selected = [];
  const selectedIndexes = new Set();
  for (let slot = 0; slot < limit; slot += 1) {
    const index = Math.round(slot * (values.length - 1) / Math.max(limit - 1, 1));
    if (selectedIndexes.has(index)) continue;
    selectedIndexes.add(index);
    selected.push(values[index]);
  }
  // Rounding can theoretically collide; fill any gap from source order.
  values.forEach((candidate, index) => {
    if (selected.length >= limit || selectedIndexes.has(index)) return;
    selectedIndexes.add(index);
    selected.push(candidate);
  });
  return selected;
}

function referencePickerImageCandidates(collectedCandidates, fallbackCandidates, limit = MAX_REFERENCE_CANDIDATES) {
  const collected = uniqueByUrl(collectedCandidates)
    .filter(isLikelyProductDetailImageCandidate)
    .sort((left, right) => (left.firstOccurrenceIndex || 0) - (right.firstOccurrenceIndex || 0));
  const sourcePool = collected.length ? collected : uniqueByUrl(fallbackCandidates);
  return evenlySpacedImageCandidates(sourcePool, limit);
}

function collectedImageCandidatesForLocalOcr(collectedCandidates, ...fallbackGroups) {
  const collected = uniqueByUrl(collectedCandidates)
    .filter(isLikelyProductDetailImageCandidate)
    .sort((left, right) => (left.firstOccurrenceIndex || 0) - (right.firstOccurrenceIndex || 0));
  if (!collected.length) return uniqueImageCandidates(...fallbackGroups);

  const repeatedMain = collected.filter((candidate) => (candidate.occurrenceCount || 1) > 1);
  const lastMainFirstIndex = repeatedMain.reduce(
    (maximum, candidate) => Math.max(maximum, candidate.firstOccurrenceIndex || 0),
    -1,
  );
  const detailPool = collected
    .filter((candidate) => (candidate.occurrenceCount || 1) === 1 && (candidate.firstOccurrenceIndex || 0) > lastMainFirstIndex);
  const detailTail = detailPool.slice(-COLLECTOR_DETAIL_TAIL_LIMIT);
  const mainPool = repeatedMain.length >= 12 ? repeatedMain : collected.slice(0, Math.ceil(collected.length * 0.65));
  const mainLate = mainPool.slice(-COLLECTOR_MAIN_LATE_LIMIT);
  const mainMiddle = centeredCandidateWindow(mainPool, 0.58, COLLECTOR_MAIN_MIDDLE_LIMIT);
  const fallback = uniqueImageCandidates(...fallbackGroups);

  return uniqueByUrl([
    ...mainLate.map((candidate, index) => ({ ...candidate, collectorSection: "main-late", collectorSectionIndex: index })),
    ...mainMiddle.map((candidate, index) => ({ ...candidate, collectorSection: "main-middle", collectorSectionIndex: index })),
    ...detailTail.map((candidate, index) => ({ ...candidate, collectorSection: "detail-tail", collectorSectionIndex: index })),
    ...fallback,
    ...collected,
  ]).slice(0, OCR_IMAGE_LIMIT);
}

function balancedVisionImageCandidates(candidates) {
  const values = uniqueByUrl(candidates);
  const mainLate = values.filter((candidate) => candidate?.collectorSection === "main-late").slice(0, 3);
  const mainMiddlePool = values.filter((candidate) => candidate?.collectorSection === "main-middle");
  const mainMiddle = mainMiddlePool.slice(Math.min(1, Math.max(0, mainMiddlePool.length - 3)), 4);
  const detailTail = values.filter((candidate) => candidate?.collectorSection === "detail-tail").slice(0, 6);
  const parameterImages = values.filter(isProductParameterImageCandidate);
  const detailImages = values.filter((candidate) => candidate?.source === "detail");
  return uniqueByUrl([
    ...mainLate,
    ...mainMiddle,
    ...detailTail,
    ...parameterImages,
    ...detailImages,
    ...values,
  ]).slice(0, 12);
}

function extractDetailUrlsFromHtml(html) {
  const urls = [];
  const seen = new Set();
  const patterns = [
    /"detailUrl"\s*:\s*"([^"]+)"/gi,
    /detailUrl['"]?\s*[:=]\s*['"]([^'"]+)['"]/gi,
  ];

  patterns.forEach((pattern) => {
    for (const match of html.matchAll(pattern)) {
      const url = normalizeImageUrl(match[1]);
      if (url && isProductDetailFragmentUrl(url) && !seen.has(url)) {
        seen.add(url);
        urls.push(url);
      }
    }
  });

  return urls.slice(0, 2);
}

function isProductDetailFragmentUrl(url) {
  return /(?:itemcdn\.tmall\.com\/1688offer|desc\.alicdn\.com|cbu01\.alicdn\.com|detail\.1688\.com)/i.test(String(url || ""))
    && !/finance|credit|quota|rule|service|agreement/i.test(String(url || ""));
}

async function fetchDetailHtml(detailUrls, onProgress) {
  const fragments = [];
  for (let index = 0; index < detailUrls.length; index += 1) {
    const url = detailUrls[index];
    const fetchStartedAt = performance.now();
    onProgress?.(`正在读取 1688 详情描述片段... ${index + 1}/${detailUrls.length}`);
    try {
      const response = await withTimeout(fetch(sourceProxyUrl(url), { credentials: "omit" }), DETAIL_FETCH_TIMEOUT_MS, "Detail fetch timed out");
      if (!response.ok) {
        onProgress?.(`1688 详情描述片段 ${index + 1}/${detailUrls.length} 读取失败：HTTP ${response.status}，耗时 ${elapsedText(fetchStartedAt)}。`);
        continue;
      }
      fragments.push(await response.text());
      onProgress?.(`1688 详情描述片段 ${index + 1}/${detailUrls.length} 读取完成：${elapsedText(fetchStartedAt)}。`);
    } catch {
      onProgress?.(`1688 详情描述片段 ${index + 1}/${detailUrls.length} 读取超时或失败：${elapsedText(fetchStartedAt)}。`);
      // Detail fragments are optional; OCR can still run against images in the saved HTML.
    }
  }
  return fragments.join("\n");
}

function imageCandidateUrl(candidate) {
  return typeof candidate === "string" ? normalizeImageUrl(candidate) : normalizeImageUrl(candidate?.url);
}

function imageCandidateScore(candidate, fallbackIndex = 0) {
  if (typeof candidate === "string") return fallbackIndex;
  const sourceScore = candidate.source === "detail" ? 100 : candidate.source === "collector" ? 25 : candidate.source === "html" ? 10 : 0;
  const context = candidate.context || "";
  const productInfoBoost = productDetailLabelScore(context) * 20 + (isProductInfoImageText(context) ? 12 : 0);
  const factoryPenalty = isFactoryOrServiceImageText(context) ? 80 : 0;
  return sourceScore + (candidate.score || 0) + productInfoBoost - factoryPenalty - Math.min(candidate.index || fallbackIndex, 10000) / 10000;
}

function uniqueImageCandidates(...groups) {
  const candidates = [];
  const seen = new Set();
  groups.flat().forEach((candidate, index) => {
    const normalized = imageCandidateUrl(candidate);
    if (!normalized || seen.has(normalized)) return;
    const normalizedCandidate = typeof candidate === "string"
      ? { url: normalized, source: "html", context: "", index, score: imageCandidateScore(candidate, index) }
      : { ...candidate, url: normalized };
    if (!isLikelyProductDetailImageCandidate(normalizedCandidate)) return;
    seen.add(normalized);
    candidates.push({ ...normalizedCandidate, score: imageCandidateScore(normalizedCandidate, index) });
  });
  const parameterCandidates = candidates
    .filter(isProductParameterImageCandidate)
    .sort((left, right) => right.score - left.score);
  const detailCandidates = candidates
    .filter((candidate) => candidate.source === "detail")
    .sort((left, right) => right.score - left.score);
  const keywordCandidates = candidates
    .filter((candidate) => candidate.source !== "detail" && isProductInfoImageText(candidate.context))
    .sort((left, right) => right.score - left.score);
  const fallbackCandidates = candidates
    .filter((candidate) => candidate.source !== "detail" && !isProductInfoImageText(candidate.context))
    .sort((left, right) => right.score - left.score)
    .slice(0, OCR_FALLBACK_IMAGE_LIMIT);
  return uniqueByUrl([
    ...parameterCandidates,
    ...detailCandidates.slice(0, 4),
    ...keywordCandidates,
    ...fallbackCandidates,
    ...detailCandidates.slice(4),
  ]).slice(0, OCR_IMAGE_LIMIT);
}

function uniqueByUrl(candidates) {
  const seen = new Set();
  return candidates.filter((candidate) => {
    const url = imageCandidateUrl(candidate);
    if (!url || seen.has(url)) return false;
    seen.add(url);
    return true;
  });
}

function loadOcrEngine() {
  if (window.Tesseract) return Promise.resolve(window.Tesseract);
  return loadScriptOnce(OCR_SCRIPT_URL, "Tesseract");
}

function cleanOcrText(text) {
  return String(text || "")
    .replace(/[|_~]+/g, " ")
    .split(/\n+/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n")
    .trim();
}

function hasReadableOcrContent(text, minChars = 12) {
  const clean = cleanOcrText(text);
  const meaningfulChars = (clean.match(/[A-Za-z0-9\u4e00-\u9fff]/g) || []).length;
  return meaningfulChars >= minChars && meaningfulChars / Math.max(clean.length, 1) >= 0.25;
}

function isUsefulOcrText(text, meta = {}) {
  const clean = cleanOcrText(text);
  if (clean.length < 8) return false;
  if (Object.keys(extractProductDetailAttributes(clean)).length) return true;
  if (isProductSellingPointText(clean)) return true;
  if (isDetailSource(meta) && hasReadableOcrContent(clean, 10)) return true;
  if (isFactoryOrServiceImageText(clean) && productDetailLabelScore(clean) < 2) return false;
  if (isCommerceOrRecommendationText(clean) && productDetailLabelScore(clean) < 2) return false;
  if (imageInfoKeywordScore(clean) > 0) return true;
  if (!isProductInfoImageText(clean)) return false;
  return hasReadableOcrContent(clean, 12);
}

function hasEnoughProductDetail(text) {
  const attrs = extractProductDetailAttributes(text);
  return productDetailLabelScore(text) >= 3 || Boolean(attrs.Material && (attrs.Size || attrs.Weight || attrs.Technology || attrs.SpecialCraft));
}

function hasExplicitProductDimensionEvidence(text) {
  const source = String(text || "");
  return /(?:产\s*品\s*规\s*格|规\s*格|产\s*品\s*尺\s*寸|尺\s*寸|product\s*(?:size|dimensions?)|dimensions?)\s*[:：]?[^\n]{0,24}\d+(?:\.\d+)?\s*[x×*]\s*\d+(?:\.\d+)?(?:\s*[x×*]\s*\d+(?:\.\d+)?)?\s*[（(]?\s*(?:mm|cm|in|毫米|厘米|英寸)\s*[）)]?/i.test(source);
}

function compactOcrKeyText(text) {
  return String(text || "")
    .replace(/[·•"“”'‘’()[\]{}|_~:：,，.。;；/\\-]+/g, " ")
    .replace(/\s+/g, "")
    .trim();
}

function normalizeDetailValue(value) {
  return cleanFieldDisplayValue(String(value || "")
    .replace(/[-—]{2,}/g, " ")
    .replace(/\s+/g, " ")
    .replace(/^[\s:：,，.。;；/\\-]+|[\s:：,，.。;；/\\-]+$/g, "")
    .trim());
}

function usefulDetailValue(value) {
  const clean = normalizeDetailValue(value);
  if (!clean || !/[0-9A-Za-z\u4e00-\u9fff]/.test(clean)) return "";
  if (isCodeLikeValue(clean)) return "";
  const compact = compactOcrKeyText(clean).toLowerCase();
  const labelOnlyValues = new Set([
    "productname",
    "gramweight",
    "size",
    "material",
    "technology",
    "品名",
    "克重",
    "尺码",
    "面料",
    "工艺",
    "特殊工艺",
  ]);
  return labelOnlyValues.has(compact) ? "" : clean;
}

function isOverlongDetailValue(value) {
  const clean = String(value || "").trim();
  return clean.length > 120 || clean.split(/\s+/).length > 18;
}

function normalizeMaterialPercent(value) {
  const clean = String(value || "").replace(/[^\d.]/g, "");
  if (!clean) return "";
  const numeric = Number(clean);
  if (!Number.isFinite(numeric)) return "";
  if (numeric <= 100) return clean.replace(/\.0+$/, "");
  if (/^\d{3}$/.test(clean) && clean.endsWith("3")) return clean.slice(0, 2);
  if (/^\d{3}$/.test(clean) && Number(clean.slice(0, 2)) <= 100) return clean.slice(0, 2);
  return "";
}

function extractPercentAfterLabel(text, labelPattern) {
  const match = String(text || "").match(new RegExp(`(?:${labelPattern})\\s*([0-9.]+)\\s*%`, "i"));
  return normalizeMaterialPercent(match?.[1] || "");
}

function materialPercentValue(text, labelPattern) {
  const source = String(text || "");
  const beforeMatches = [...source.matchAll(new RegExp(`([0-9.]+)\\s*%\\s*(?:${labelPattern})`, "gi"))]
    .map((match) => normalizeMaterialPercent(match[1]))
    .filter(Boolean);
  return beforeMatches[beforeMatches.length - 1] || extractPercentAfterLabel(source, labelPattern);
}

function translateProductDetailValue(key, value) {
  const clean = usefulDetailValue(value);
  if (!clean) return "";
  const normalized = compactOcrKeyText(clean).toLowerCase();
  if (key === "Material") {
    const hasCombedCotton = /精\s*梳\s*棉|combed\s+cotton/i.test(clean);
    const cotton = materialPercentValue(clean, "精\\s*梳\\s*棉|棉|cotton");
    const spandex = materialPercentValue(clean, "氨\\s*纶|氨\\s*给|各\\s*纶|胺\\s*纶|spandex");
    const polyester = materialPercentValue(clean, "聚\\s*[酯酷醒酮]\\s*纤\\s*维|聚\\s*[酯酷醒酮]|polyester");
    const parts = [
      cotton && `${cotton}% ${hasCombedCotton ? "premium combed cotton" : "cotton"}`,
      spandex && `${spandex}% spandex`,
      polyester && `${polyester}% polyester fiber`,
    ].filter(Boolean);
    if (!parts.length && hasCombedCotton) return "premium combed cotton";
    return parts.length ? parts.join(", ") : "";
  }
  if (key === "Weight") {
    if (!/(?:重量|净重|约重|克重|GRAM\s*WEIGHT|weight|net weight)/i.test(clean)) return "";
    const weight = clean.match(/([0-9]+(?:\.[0-9]+)?)\s*(?:g|克)/i)?.[1];
    return weight ? `${weight} g` : "";
  }
  if (key === "Capacity") {
    const capacity = clean.match(/([0-9]+(?:\.[0-9]+)?)\s*(ml|mL|l|L|oz|毫升|升)/i);
    return capacity ? normalizeDimensionUnit(`${capacity[1]} ${capacity[2]}`) : "";
  }
  if (key === "Size") {
    const explicitSize = clean.match(/(?:尺码|鞋码|SIZE|size)?\s*(US\s*Size\s*[0-9]+(?:\.[0-9]+)?|[0-9]+(?:\.[0-9]+)?\s*(?:码|号)|XXL|XL|L|M|S|XS)(?=\s|$|[;；,，/])/i)?.[1];
    if (explicitSize) return explicitSize.replace(/\s+/g, " ").trim();
    const womenSize = clean.match(/(?:WOMAN|WOMEN|女士|女)\s*[\(（]?\s*([0-9]+\s*[-~]\s*[0-9]+)\s*[\)）]?/i)?.[1];
    if (womenSize) return `women's ${womenSize.replace(/\s+/g, "")}`;
    if (/均码|one\s*size|free\s*size/i.test(clean) && !isOverlongDetailValue(clean)) return "one size";
    return "";
  }
  if (key === "Technology") {
    const values = [];
    if (/灵活|flex/.test(clean)) values.push("flexible fit");
    if (/防滑|anti.?slip|non[-\s]?slip|grip|硅胶|点胶|胶印|printed?|print/i.test(clean)) values.push("anti-slip grip sole");
    return values.length ? values.join(", ") : "";
  }
  if (key === "SpecialCraft") {
    const values = [];
    if (hasCrossStrapDesign(clean)) values.push("3D cross-strap design");
    if (hasFiveToeDesign(clean)) values.push("five-toe separated design");
    if (/厚薄|适中|medium/i.test(clean)) values.push("medium thickness");
    if (/柔软|细腻|soft/i.test(clean)) values.push("soft and delicate texture");
    if (/高弹|橡筋|elastic/i.test(clean)) values.push("high-elastic cuff");
    if (/针数|密|dense|knit/i.test(clean)) values.push("dense knit count");
    if (/阻菌|抗菌|防臭|antibacterial|deodor/i.test(clean)) values.push("antibacterial deodorizing");
    if (/受力|均匀|pressure/i.test(clean)) values.push("even pressure distribution");
    return values.length ? values.join(", ") : "";
  }
  if (key === "Product Detail Name") {
    const compact = clean.replace(/\s+/g, "");
    if (/五[指趾].*袜/.test(compact)) {
      const height = /中[筒商]|mid/i.test(compact) ? "mid-calf " : "";
      const antiSlip = /防[滑涓]|anti.?slip|grip/i.test(compact) ? "anti-slip " : "";
      return `solid color five-toe ${height}${antiSlip}socks`.replace(/\s+/g, " ").trim();
    }
    return clean;
  }
  return normalized || clean;
}

function translateAttributeValue(key, value) {
  const clean = cleanFieldDisplayValue(value);
  if (!clean) return "";
  if (/^Material$/i.test(key)) {
    const detailMaterial = translateProductDetailValue("Material", clean);
    if (detailMaterial) return detailMaterial;
    if (/^棉$/i.test(clean)) return "cotton";
    if (/尼龙|锦纶|nylon/i.test(clean)) return "nylon";
    if (/氨纶/.test(clean)) return "spandex";
    if (/聚酯|涤纶/.test(clean)) return "polyester";
  }
  if (/^Size$/i.test(key)) return translateProductDetailValue("Size", clean);
  if (/^Weight$/i.test(key)) return translateProductDetailValue("Weight", clean);
  if (/^Capacity$/i.test(key)) return translateProductDetailValue("Capacity", clean);
  if (/^Technology$/i.test(key)) return translateProductDetailValue("Technology", clean);
  if (/^SpecialCraft$/i.test(key)) return translateProductDetailValue("SpecialCraft", clean);
  if (/^Category$/i.test(key)) {
    if (/吊坠/.test(clean)) return "pendant";
    if (/挂饰|挂件/.test(clean)) return "hanging ornament";
  }
  if (/^Packaging$/i.test(key)) {
    if (/PP\s*袋.*独立|独立.*PP\s*袋/i.test(clean)) return "individually packed in PP bag";
    if (/独立包装/.test(clean)) return "individually packaged";
  }
  if (/^Style$/i.test(key)) {
    if (/现代.*简约|简约.*现代/.test(clean)) return "modern minimalist style";
  }
  if (/^Sock Height$/i.test(key)) {
    if (/中筒|mid/i.test(clean)) return "mid-calf coverage";
    if (/长筒|高筒|over[-\s]?the[-\s]?calf|knee/i.test(clean)) return "long sock coverage";
    if (/短筒|船袜|低帮|no[-\s]?show|low/i.test(clean)) return "low-cut sock profile";
  }
  if (/^Seam$/i.test(key)) {
    if (/无骨|手工|seamless|hand/i.test(clean)) return "seamless hand-linked toe comfort";
  }
  if (/^Weaving$/i.test(key)) {
    if (/单针|single/i.test(clean)) return "single-needle knit texture";
  }
  return clean;
}

function mergeDetailFeatureValues(...values) {
  const seen = new Set();
  return values
    .filter(Boolean)
    .flatMap((value) => String(value).split(/\s*,\s*/))
    .map((value) => value.trim())
    .filter((value) => {
      const key = value.toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .join(", ");
}

function extractTextureScaleDetails(text) {
  const source = String(text || "");
  const values = [];
  const thickness = extractFirstMatch(source, [
    /(?:厚\s*薄|Thickness)\s*[:：]\s*(薄|适中|厚|thin|medium|thick)/i,
  ]);
  const elasticity = extractFirstMatch(source, [
    /(?:弹\s*力|Elasticity)\s*[:：]\s*(无|微弹|高弹|高|none|low|medium|high)/i,
  ]);
  const knitCount = extractFirstMatch(source, [
    /(?:针\s*数|Knit\s*Count|Needle\s*Count)\s*[:：]\s*(粗|密|coarse|dense)/i,
  ]);
  const softness = extractFirstMatch(source, [
    /(?:柔\s*软|Softness)\s*[:：]\s*(硬|适中|软|hard|medium|soft)/i,
  ]);
  if (/适中|medium/i.test(thickness)) values.push("medium thickness");
  if (/薄|thin/i.test(thickness)) values.push("thin fabric thickness");
  if (/厚|thick/i.test(thickness)) values.push("thick fabric feel");
  if (/高弹|高|high/i.test(elasticity)) values.push("high elasticity");
  if (/微弹|medium|low/i.test(elasticity)) values.push("slight elasticity");
  if (/无|none/i.test(elasticity)) values.push("no stretch");
  if (/密|dense/i.test(knitCount)) {
    values.push("dense knit count");
  }
  if (/粗|coarse/i.test(knitCount)) {
    values.push("coarse knit count");
  }
  if (/软|soft/i.test(softness)) {
    values.push("soft hand feel");
  }
  if (/适中|medium/i.test(softness)) {
    values.push("medium-soft hand feel");
  }
  if (/硬|hard/i.test(softness)) {
    values.push("firm hand feel");
  }
  return values.join(", ");
}

function decodeHtmlEntities(value) {
  return String(value || "")
    .replace(/&gt;/gi, ">")
    .replace(/&lt;/gi, "<")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'");
}

function isSockFamilyText(text) {
  return /瑜伽袜|普拉提袜|五指袜|五趾袜|分趾袜|船袜|短袜|隐形袜|浅口袜|袜子|袜|toe socks|grip socks|no[-\s]?show socks?|liner socks?|ankle socks?|socks/i.test(text);
}

function isYogaSockText(text) {
  return isSockFamilyText(text) && /瑜伽|普拉提|防滑|点胶|硅胶|yoga|pilates|barre|grip|non[-\s]?slip|silicone/i.test(text);
}

function hasFiveToeDesign(text) {
  return /五\s*[指趾]|分\s*[指趾]|toe[-\s]?separated|five[-\s]?toe/i.test(String(text || ""));
}

function hasCrossStrapDesign(text) {
  const clean = String(text || "");
  return /立体|3d|交叉|交织|cross/i.test(clean) && /绑带|带子|strap|strappy/i.test(clean)
    || /cross[-\s]?strap|crossed\s+strap|strappy/i.test(clean);
}

function colorName(rawColor) {
  const clean = String(rawColor || "").replace(/[()（）百人复购\s]/g, "").trim();
  const colorMap = {
    白: "white",
    白色: "white",
    本白: "white",
    本色: "white",
    本全: "white",
    米白: "off white",
    米白色: "off white",
    乳白: "off white",
    奶白: "off white",
    象牙白: "ivory white",
    草绿: "grass green",
    绿: "green",
    绿色: "green",
    蓝: "blue",
    蓝色: "blue",
    水蓝: "light blue",
    淡蓝: "light blue",
    紫: "purple",
    紫色: "purple",
    浅紫: "light purple",
    黑: "black",
    黑色: "black",
    粉: "pink",
    粉色: "pink",
    浅粉: "light pink",
    粉红: "pink",
    红: "red",
    红色: "red",
    灰: "gray",
    灰色: "gray",
    银: "silver",
    银色: "silver",
    银灰: "silver gray",
    深灰: "dark gray",
    灰黑色: "gray black",
    灰绿色: "gray green",
    黄绿色: "yellow green",
    豆绿: "bean green",
    苹果绿: "apple green",
    苹果绿色: "apple green",
    浅卡: "light khaki",
    卡其: "khaki",
    肉粉: "nude pink",
    白红: "white red",
    白紫: "white purple",
    黑紫: "black purple",
    黄: "yellow",
    黄色: "yellow",
    橙: "orange",
    橙色: "orange",
    天蓝: "sky blue",
    天蓝色: "sky blue",
    深蓝: "deep blue",
    深蓝色: "deep blue",
    湖蓝: "lake blue",
    湖蓝色: "lake blue",
    深棕: "dark brown",
    深棕色: "dark brown",
    棕: "brown",
    棕色: "brown",
    咖色: "coffee brown",
    咖啡色: "coffee brown",
    肤色: "nude",
    珊瑚红: "coral red",
    浆果色: "berry",
    蜜桃粉: "peach pink",
    森林绿: "forest green",
    番茄紫: "tomato purple",
    开心果绿: "pistachio green",
    摩卡棕: "mocha brown",
    酒红: "wine red",
    酒红色: "wine red",
    抹茶色: "matcha green",
    薄荷绿: "mint green",
    云彩蓝: "cloud blue",
    云彩粉: "cloud pink",
    云彩紫: "cloud purple",
  };
  return colorMap[clean] || clean;
}

function outputColorName(rawColor) {
  const clean = String(rawColor || "").replace(/[()（）百人复购\s]/g, "").trim();
  if (/^(?:本色|本全|原色|natural)$/i.test(clean)) return "natural";
  return colorName(rawColor);
}

function simpleColorName(rawColor) {
  const colorKey = canonicalColorKey(rawColor);
  const simpleMap = {
    white: "white",
    black: "black",
    gray: "gray",
    blue: "blue",
    green: "green",
    purple: "purple",
    pink: "pink",
    red: "red",
    yellow: "yellow",
    orange: "orange",
    brown: "brown",
    nude: "nude",
    khaki: "khaki",
  };
  return simpleMap[colorKey] || outputColorName(rawColor);
}

function displayColorName(rawColor, fallback = "") {
  const source = String(rawColor || fallback || "")
    .replace(/（[^）]*）|\([^)]*\)/g, "")
    .replace(/[()（）百人复购]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!source) return "";
  const directChinese = colorFromTextSegment(source, []);
  if (directChinese) return directChinese;
  const normalized = source.toLowerCase().replace(/[\s_-]+/g, "");
  const englishMap = {
    white: "白色",
    offwhite: "米白",
    ivorywhite: "象牙白",
    ivory: "象牙白",
    black: "黑色",
    gray: "灰色",
    grey: "灰色",
    silver: "银色",
    silvergray: "银灰",
    darkgray: "深灰",
    blue: "蓝色",
    lightblue: "淡蓝",
    green: "绿色",
    grassgreen: "草绿",
    beangreen: "豆绿",
    purple: "紫色",
    lightpurple: "浅紫",
    pink: "粉色",
    lightpink: "浅粉",
    nudepink: "肉粉",
    red: "红色",
    yellow: "黄色",
    orange: "橙色",
    skyblue: "天蓝",
    deepblue: "深蓝",
    lakeblue: "湖蓝",
    darkbrown: "深棕",
    brown: "棕色",
    coffeebrown: "咖色",
    nude: "肤色",
    coralred: "珊瑚红",
    berry: "浆果色",
    peachpink: "蜜桃粉",
    forestgreen: "森林绿",
    tomatopurple: "番茄紫",
    pistachiogreen: "开心果绿",
    mochabrown: "摩卡棕",
    winered: "酒红色",
    matchagreen: "抹茶色",
    mintgreen: "薄荷绿",
    cloudblue: "云彩蓝",
    cloudpink: "云彩粉",
    cloudpurple: "云彩紫",
    khaki: "卡其",
    lightkhaki: "浅卡",
  };
  return englishMap[normalized] || source;
}

function canonicalColorKey(value) {
  const raw = String(value || "")
    .toLowerCase()
    .replace(/[()（）百人复购\s_-]+/g, "")
    .trim();
  const named = colorName(value).toLowerCase().replace(/\s+/g, "");
  const groups = {
    white: ["白", "白色", "本白", "本色", "本全", "米白", "乳白", "奶白", "象牙白", "white", "offwhite", "ivorywhite", "ivory", "cream"],
    black: ["黑", "黑色", "black"],
    gray: ["灰", "灰色", "银", "银色", "银灰", "深灰", "gray", "grey", "silver", "silvergray", "darkgray"],
    blue: ["蓝", "蓝色", "水蓝", "淡蓝", "天蓝", "天蓝色", "深蓝", "深蓝色", "湖蓝", "湖蓝色", "blue", "lightblue", "skyblue", "deepblue", "lakeblue"],
    green: ["绿", "绿色", "草绿", "豆绿", "苹果绿", "苹果绿色", "green", "grassgreen", "beangreen", "applegreen"],
    purple: ["紫", "紫色", "浅紫", "purple", "lightpurple"],
    pink: ["粉", "粉色", "浅粉", "粉红", "肉粉", "pink", "lightpink", "nudepink"],
    red: ["红", "红色", "red"],
    yellow: ["黄", "黄色", "yellow"],
    orange: ["橙", "橙色", "orange"],
    brown: ["棕", "棕色", "深棕", "深棕色", "咖色", "咖啡色", "摩卡棕", "brown", "darkbrown", "coffeebrown", "mochabrown"],
    nude: ["肤色", "nude"],
    khaki: ["浅卡", "卡其", "khaki", "lightkhaki"],
  };
  const matched = Object.entries(groups).find(([, aliases]) => aliases.includes(raw) || aliases.includes(named));
  return matched ? matched[0] : named || raw;
}

function colorAliasValues(value) {
  const canonical = canonicalColorKey(value);
  const aliases = {
    white: ["白", "白色", "本白", "本色", "本全", "米白", "乳白", "奶白", "象牙白", "white", "off white", "ivory", "cream"],
    black: ["黑", "黑色", "black"],
    gray: ["灰", "灰色", "银", "银色", "银灰", "深灰", "gray", "grey", "silver", "silver gray", "dark gray"],
    blue: ["蓝", "蓝色", "水蓝", "淡蓝", "天蓝", "天蓝色", "深蓝", "深蓝色", "湖蓝", "湖蓝色", "blue", "light blue", "sky blue", "deep blue", "lake blue"],
    green: ["绿", "绿色", "草绿", "豆绿", "苹果绿", "苹果绿色", "green", "grass green", "bean green", "apple green"],
    purple: ["紫", "紫色", "浅紫", "purple", "light purple"],
    pink: ["粉", "粉色", "浅粉", "粉红", "肉粉", "pink", "light pink", "nude pink"],
    red: ["红", "红色", "red"],
    yellow: ["黄", "黄色", "yellow"],
    orange: ["橙", "橙色", "orange"],
    brown: ["棕", "棕色", "深棕", "深棕色", "咖色", "咖啡色", "摩卡棕", "brown", "dark brown", "coffee brown", "mocha brown"],
    nude: ["肤色", "nude"],
    khaki: ["浅卡", "卡其", "khaki", "light khaki"],
  };
  return Array.from(new Set([
    String(value || "").replace(/\s+/g, ""),
    colorName(value),
    ...(aliases[canonical] || []),
  ].filter(Boolean)));
}

function productColorCandidates() {
  return [
    "珊瑚红", "浆果色", "苹果绿", "开心果绿", "蜜桃粉", "森林绿", "番茄紫", "摩卡棕", "酒红色", "酒红", "抹茶色", "薄荷绿",
    "云彩蓝", "云彩粉", "云彩紫", "深蓝色", "深蓝", "天蓝色", "天蓝", "湖蓝色", "湖蓝", "深棕色", "深棕", "米白色", "米白",
    "咖啡色", "咖色", "肤色", "白色", "黑色", "粉色", "蓝色", "绿色", "紫色", "红色", "黄色", "橙色", "银色", "棕色",
    "灰黑色", "灰绿色", "黄绿色", "本白", "本色", "本全", "草绿", "水蓝", "淡蓝", "浅紫", "浅粉", "粉红", "肉粉", "银灰", "深灰", "豆绿", "浅卡", "卡其",
    "白", "黑", "粉", "蓝", "绿", "紫", "红", "黄", "橙", "银", "棕",
  ];
}

function isKnownColorValue(value) {
  const clean = cleanFieldDisplayValue(value);
  if (!clean) return false;
  return Boolean(colorAliasValues(clean).length && [
    "white", "black", "gray", "blue", "green", "purple", "pink", "red", "yellow", "orange", "brown", "nude", "khaki",
  ].includes(canonicalColorKey(clean)));
}

function colorsFromPurchaseText(value) {
  const source = compactChineseText(value);
  const matches = [];
  productColorCandidates().forEach((candidate) => {
    const index = source.indexOf(candidate);
    if (index > -1) matches.push({ candidate, index });
  });
  matches.sort((left, right) => left.index - right.index || right.candidate.length - left.candidate.length);
  const seen = new Set();
  return matches
    .map(({ candidate }) => candidate)
    .filter((candidate) => {
      const key = canonicalColorKey(candidate);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function normalizePurchaseText(value) {
  const glyphMap = {
    "⾊": "色",
    "⽩": "白",
    "⿊": "黑",
    "⻩": "黄",
    "⻣": "骨",
    "⻢": "马",
    "⼨": "寸",
    "⾹": "香",
    "⽤": "用",
    "⽣": "生",
    "⼝": "口",
    "⽔": "水",
    "⼤": "大",
    "⼩": "小",
    "⽊": "木",
    "⾍": "虫",
    "⻥": "鱼",
    "⽛": "牙",
    "⼥": "女",
    "⼿": "手",
    "⾦": "金",
    "⼊": "入",
    "⼉": "儿",
    "⼼": "心",
    "⽂": "文",
    "⾃": "自",
    "⾝": "身",
    "⽆": "无",
    "⽑": "毛",
    "⽪": "皮",
    "⾐": "衣",
    "⾜": "足",
    "⽇": "日",
    "⽉": "月",
    "⽅": "方",
    "⻓": "长",
    "⾬": "雨",
    "⼱": "巾",
    "⼼": "心",
  };
  return String(value || "")
    .normalize("NFKC")
    .replace(/[⾊⽩⿊⻩⻣⻢⼨⾹⽤⽣⼝⽔⼤⼩⽊⾍⻥⽛⼥⼿⾦⼊⼉⼼⽂⾃⾝⽆⽑⽪⾐⾜⽇⽉⽅⻓⾬⼱]/g, (char) => glyphMap[char] || char)
    .replace(/亚\s*马\s*逊/g, "亚马逊")
    .replace(/颜\s*色/g, "颜色")
    .replace(/尺\s*寸/g, "尺寸")
    .replace(/尺\s*码/g, "尺码")
    .replace(/规\s*格/g, "规格");
}

function normalizeModelText(text) {
  return normalizePurchaseText(decodeHtmlEntities(text))
    .replace(/(阿里)\s+([A-Z]{1,4}\d{2,5})/gi, "$1$2")
    .replace(/\b([1-9]\d?)\s*[。.,，]\s*(?=(?:阿里\s*)?[A-Z]{1,4}\s*\d{2,5})/g, "$1 ")
    .replace(/\b([A-Z]{1,4})\s+(\d{2,5})\b/gi, "$1$2")
    .replace(/([A-Z]{1,4}\d{2})\s+(\d)(?=[\u4e00-\u9fff])/g, "$1$2")
    .replace(/\b([A-Z]{1,4}\d{2,4})\s+(\d)(?=\s*(?:黑|白|本白|本色|本全|米白|乳白|奶白|粉|蓝|绿|草绿|紫|灰|红|浅卡|卡其|颜色|尺码|均码))/gi, "$1$2")
    .replace(/\s+/g, " ")
    .trim();
}

function splitModelColor(value) {
  const clean = normalizeModelText(value)
    .replace(/（[^）]*）|\([^)]*\)/g, "")
    .replace(/>/g, " ")
    .trim();
  const match = clean.match(/([A-Z]{1,4}\d{3,5})(?:-[A-Z]{1,4}\d{3,5})?\s*([\u4e00-\u9fff]{1,4})?/i);
  if (!match) return {};
  return {
    model: match[1].toUpperCase(),
    color: match[2] || "",
    colorEnglish: colorName(match[2] || ""),
  };
}

function skuModelFromText(value) {
  return extractFirstMatch(value, [/\b([A-Z]{1,4}\d{2,5})\b/i]);
}

function supplierSkuColor(value) {
  const compact = compactChineseText(value);
  const found = productColorCandidates().find((candidate) => compact.includes(candidate));
  return found || extractEnglishColorName(value);
}

function supplierSkuSize(value) {
  const source = normalizePurchaseText(value);
  const dimension = extractFirstMatch(source, [
    /([1-9]\d{2,4}\s*[*x×]\s*[1-9]\d{1,3}\s*[*x×]\s*[0-9.]+\s*mm)/i,
    /([1-9]\d{2,4}\s*[*x×]\s*[1-9]\d{1,3}\s*[*x×]\s*[0-9.]+\s*毫米)/i,
    /([1-9]\d{2,4}\s*[*x×]\s*[1-9]\d{1,3}\s*cm)/i,
  ]);
  if (dimension) return dimension.replace(/\s+/g, "");
  const explicitSize = extractFirstMatch(source, [
    /(?:尺码|鞋码|size)\s*[:：]?\s*(US\s*Size\s*[0-9]+(?:\.[0-9]+)?|[0-9]+(?:\.[0-9]+)?\s*(?:码|号)?|XXL|XL|L|M|S|XS)(?=\s|$|[;；,，/])/i,
    /(?:^|[\s;；,，/])([0-9]+(?:\.[0-9]+)?\s*(?:码|号))(?=\s|$|[;；,，/])/i,
  ]);
  return explicitSize ? explicitSize.replace(/\s+/g, " ").trim() : "";
}

function dimensionsFromSkuSize(size) {
  const match = cleanFieldDisplayValue(size).match(/([0-9.]+)\s*[*x×]\s*([0-9.]+)\s*[*x×]\s*([0-9.]+)\s*(mm|毫米|cm|厘米|公分)?/i);
  if (!match) return {};
  const unit = /cm|厘米|公分/i.test(match[4] || "") ? "cm" : "mm";
  return {
    topWidth: `${match[1]} ${unit}`,
    sideLength: `${match[2]} ${unit}`,
    bottomWidth: `${match[3]} ${unit}`,
    source: "1688 SKU option size",
  };
}

function supplierSkuStyle(value) {
  const compact = compactChineseText(value);
  const styles = [];
  if (/加长/.test(compact)) styles.push("加长款");
  if (/加厚/.test(compact)) styles.push("加厚款");
  if (!styles.length && /常规/.test(compact)) styles.push("常规款");
  return styles.join("");
}

function parseSupplierSkuText(value) {
  const text = normalizePurchaseText(value);
  const model = skuModelFromText(text);
  const parsedModelColor = model ? splitModelColor(text) : {};
  const color = parsedModelColor.color || supplierSkuColor(text);
  const size = supplierSkuSize(text);
  const style = supplierSkuStyle(text);
  if (!model && !color && !size && !style) return {};
  const sizeDims = dimensionsFromSkuSize(size);
  return {
    model: (parsedModelColor.model || model || GENERIC_SUPPLIER_SKU_MODEL).toUpperCase(),
    color,
    colorEnglish: colorName(color),
    size,
    variantStyle: style,
    rawSpec: text,
    dims: sizeDims,
  };
}

function supplierOptionIdentity(option) {
  return [
    option.model,
    canonicalColorKey(option.color || ""),
    cleanFieldDisplayValue(option.variantStyle || "").toLowerCase(),
    cleanFieldDisplayValue(option.size || "").toLowerCase(),
    cleanFieldDisplayValue(option.rawSpec || "").toLowerCase(),
  ].filter(Boolean).join("-");
}

function sameSupplierRawSpec(left, right) {
  const leftSpec = cleanFieldDisplayValue(left?.rawSpec || "").toLowerCase();
  const rightSpec = cleanFieldDisplayValue(right?.rawSpec || "").toLowerCase();
  return Boolean(leftSpec && rightSpec && leftSpec === rightSpec);
}

function moreSpecificSupplierColor(current, next) {
  const cleanCurrent = cleanFieldDisplayValue(current);
  const cleanNext = cleanFieldDisplayValue(next);
  if (!cleanNext) return cleanCurrent;
  if (!cleanCurrent) return cleanNext;
  return cleanNext.length > cleanCurrent.length && cleanNext.includes(cleanCurrent) ? cleanNext : cleanCurrent;
}

function mergeSupplierSkuOption(target, next) {
  target.color = moreSpecificSupplierColor(target.color, next.color);
  target.colorEnglish = colorName(target.color) || target.colorEnglish || next.colorEnglish || "";
  target.size = target.size || next.size || "";
  target.material = target.material || next.material || "";
  target.variantStyle = target.variantStyle || next.variantStyle || "";
  target.rawSpec = target.rawSpec || next.rawSpec || "";
  target.dims = {
    topWidth: target.dims?.topWidth || next.dims?.topWidth || "",
    sideLength: target.dims?.sideLength || next.dims?.sideLength || "",
    bottomWidth: target.dims?.bottomWidth || next.dims?.bottomWidth || "",
    weight: target.dims?.weight || next.dims?.weight || "",
    source: target.dims?.source || next.dims?.source || "",
  };
  return target;
}

function addSupplierSkuOption(options, seen, option) {
  if (!option.model) return;
  const existing = options.find((candidate) => (
    candidate.model === option.model
    && (
      sameSupplierRawSpec(candidate, option)
      || (
        candidate.color && option.color && isSameColorName(candidate.color, option.color)
        && cleanFieldDisplayValue(candidate.variantStyle || "") === cleanFieldDisplayValue(option.variantStyle || "")
        && (!candidate.size || !option.size || cleanFieldDisplayValue(candidate.size) === cleanFieldDisplayValue(option.size))
      )
    )
  ));
  if (existing) {
    mergeSupplierSkuOption(existing, option);
    seen.add(supplierOptionIdentity(existing));
    return;
  }
  const key = supplierOptionIdentity(option);
  if (seen.has(key)) return;
  seen.add(key);
  options.push(option);
}

function extractSupplierTitles(html) {
  const titles = [];
  const seen = new Set();
  for (const match of String(html || "").matchAll(/<title[^>]*>([\s\S]*?)<\/title>/gi)) {
    const title = decodeHtmlEntities(match[1]).replace(/\s+/g, " ").trim();
    if (!title || seen.has(title)) continue;
    seen.add(title);
    titles.push(title.replace(/\s*-\s*阿里巴巴\s*$/i, ""));
  }
  return titles;
}

function normalizedSupplierPropValue(value, unit = "") {
  const clean = cleanFieldDisplayValue(value);
  if (!clean) return "";
  const cleanUnit = cleanFieldDisplayValue(unit);
  if (!cleanUnit || new RegExp(`${cleanUnit}$`, "i").test(clean)) return clean;
  return `${clean} ${cleanUnit}`;
}

function supplierPropsMap(propsText) {
  const props = {};
  for (const match of String(propsText || "").matchAll(/\{[^{}]*"unit"\s*:\s*"([^"]*)"[^{}]*"name"\s*:\s*"([^"]+)"[^{}]*"value"\s*:\s*"([^"]*)"[^{}]*\}/gi)) {
    props[match[2]] = normalizedSupplierPropValue(match[3], match[1]);
  }
  return props;
}

function detailValueBetween(source, startPattern, endPatterns) {
  const match = source.match(startPattern);
  if (!match) return "";
  const start = (match.index || 0) + match[0].length;
  const tail = source.slice(start, start + 260);
  const endIndexes = endPatterns
    .map((pattern) => {
      const endMatch = tail.match(pattern);
      return endMatch ? endMatch.index : -1;
    })
    .filter((index) => index > 0);
  const end = endIndexes.length ? Math.min(...endIndexes) : tail.length;
  return normalizeDetailValue(tail.slice(0, end));
}

function firstUsefulDetailValue(source, startPatterns, endPatterns) {
  for (const pattern of startPatterns) {
    const value = usefulDetailValue(detailValueBetween(source, pattern, endPatterns));
    if (value) return value;
  }
  return "";
}

function extractProductDetailAttributes(text) {
  const source = decodeHtmlEntities(text || "")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!source) return {};
  const endLabels = [
    /品\s*名\s*(?:[\(（]\s*PRODUCT\s*NAME\s*[\)）])?|PRODUCT\s*NAME/i,
    /克\s*重\s*(?:[\(（]\s*GRAM\s*WEIGHT\s*[\)）])?|GRAM\s*WEIGHT/i,
    /尺\s*码\s*(?:[\(（]\s*SIZE\s*[\)）])?|SIZE/i,
    /面\s*料\s*(?:[\(（]\s*MATERIAL\s*[\)）])?|MATERIAL/i,
    /工\s*艺\s*(?:[\(（]\s*TECHNOLOGY\s*[\)）])?|TECHNOLOGY/i,
    /特\s*殊\s*工\s*艺/i,
    /容\s*量|容量\s*\/\s*容积|CAPACITY|VOLUME/i,
    /厚\s*薄|弹\s*力|针\s*数|柔\s*软/i,
  ];
  const attrs = {};
  const entries = [
    ["Product Detail Name", [
      /品\s*名\s*[\(（]\s*PRODUCT\s*NAME\s*[\)）]\s*[:：]?\s*/i,
      /(?:品\s*名|PRODUCT\s*NAME)\s*[:：]?\s*/i,
    ]],
    ["Weight", [
      /克\s*重\s*[\(（]\s*GRAM\s*WEIGHT\s*[\)）]\s*[:：]?\s*/i,
      /(?:克\s*重|GRAM\s*WEIGHT)\s*[:：]?\s*/i,
    ]],
    ["Size", [
      /尺\s*码\s*[\(（]\s*SIZE\s*[\)）]\s*[:：]?\s*/i,
      /(?:尺\s*码|SIZE)\s*[:：]?\s*/i,
    ]],
    ["Material", [
      /面\s*料\s*[\(（]\s*MATERIAL\s*[\)）]\s*[:：]?\s*/i,
      /(?:面\s*料|MATERIAL)\s*[:：]?\s*/i,
    ]],
    ["Technology", [
      /工\s*艺\s*[\(（]\s*TECHNOLOGY\s*[\)）]\s*[:：]?\s*/i,
      /(?:工\s*艺|TECHNOLOGY)\s*[:：]?\s*/i,
    ]],
    ["SpecialCraft", [
      /特\s*殊\s*工\s*艺\s*[:：]?\s*/i,
    ]],
    ["Capacity", [
      /(?:容\s*量|容积|CAPACITY|VOLUME)\s*[:：]?\s*/i,
    ]],
  ];
  entries.forEach(([key, startPatterns]) => {
    const rawValue = firstUsefulDetailValue(source, startPatterns, endLabels);
    const value = translateProductDetailValue(key, rawValue);
    if (value) attrs[key] = value;
  });

  if (!attrs.Material) {
    const material = translateProductDetailValue("Material", source);
    if (material) attrs.Material = material;
  }
  if (!attrs.Weight) {
    const weight = extractFirstMatch(source, [
      /(?:重量|净重|约重|克\s*重|GRAM\s*WEIGHT|weight|net weight)[^\d]{0,12}([0-9]+(?:\.[0-9]+)?)\s*[gG克]/i,
    ]);
    if (weight) attrs.Weight = `${weight} g`;
  }
  if (!attrs.Capacity) {
    const capacity = extractFirstMatch(source, [
      /(?:容量|容积|capacity|volume)[^\d]{0,12}([0-9]+(?:\.[0-9]+)?)\s*(ml|mL|l|L|oz|毫升|升)/i,
      /([0-9]+(?:\.[0-9]+)?)\s*(ml|mL|l|L|oz|毫升|升)(?=\s|$|[;；,，。])/i,
    ]);
    if (capacity) {
      const unit = source.match(new RegExp(`${capacity.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*(ml|mL|l|L|oz|毫升|升)`, "i"))?.[1] || "";
      attrs.Capacity = normalizeDimensionUnit(`${capacity} ${unit}`);
    }
  }
  if (!attrs.Size) {
    const size = extractFirstMatch(source, [
      /(?:尺码|鞋码|SIZE|size)[^\dA-Z]{0,12}(US\s*Size\s*[0-9]+(?:\.[0-9]+)?|[0-9]+(?:\.[0-9]+)?\s*(?:码|号)?|XXL|XL|L|M|S|XS)/i,
      /(?:WOMAN|WOMEN|女士|女)\s*[\(（]?\s*([0-9]+\s*[-~]\s*[0-9]+)\s*[\)）]?/i,
    ]);
    if (size) attrs.Size = /^US/i.test(size) || /码|号|[A-Z]/i.test(size) ? size.replace(/\s+/g, " ").trim() : `women's ${size.replace(/\s+/g, "")}`;
  }
  if (!attrs.Technology && /灵活|防滑|胶印/i.test(source)) {
    attrs.Technology = translateProductDetailValue("Technology", source);
  }
  if (!attrs.SpecialCraft && /厚薄|弹力|针数|柔软|细腻|高弹|橡筋|阻菌|抗菌|防臭|受力|均匀|立体|交叉|绑带|五指|五趾|分趾|strap|toe/i.test(source)) {
    attrs.SpecialCraft = translateProductDetailValue("SpecialCraft", source);
  }
  const textureScaleDetails = extractTextureScaleDetails(source);
  if (textureScaleDetails) {
    attrs.SpecialCraft = mergeDetailFeatureValues(attrs.SpecialCraft, textureScaleDetails);
  }
  return attrs;
}

function normalizeSourceProductTitle(value) {
  return normalizePurchaseText(decodeHtmlEntities(value || ""))
    .replace(/\s*-\s*阿里巴巴\s*$/i, " ")
    .replace(/厂家|工厂|源头|现货|批发|一件代发|跨境|亚马逊|外贸|爆款|新款|热卖|供应|定制|专用|男女款|女款|男款|女士|女|男士|男/g, " ")
    .replace(/颜色\s*[:：][^,，;；\n]+/gi, " ")
    .replace(/尺码\s*[:：][^,，;；\n]+/gi, " ")
    .replace(/\b[A-Z]{1,4}\d{2,5}\b/gi, " ")
    .replace(/[|_~·•"“”'‘’()[\]{}:：,，.。;；/\\]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function descriptiveYogaSockProductName(value, context = "") {
  const source = [value, context].filter(Boolean).join(" ");
  if (!isYogaSockText(source)) return "";
  const gender = /女|女士|women|woman|female/i.test(source) ? "women's" : "";
  const nonSlip = /防滑|止滑|点胶|硅胶|anti[-\s]?slip|non[-\s]?slip|grip|silicone/i.test(source) ? "non-slip" : "";
  const toeDesign = hasFiveToeDesign(source) ? "five-toe" : "";
  const use = /瑜伽|yoga/i.test(source) && /普拉提|pilates/i.test(source)
    ? "yoga pilates"
    : /普拉提|pilates/i.test(source)
      ? "pilates"
      : "yoga";
  const name = [gender, nonSlip, toeDesign, use, "socks"].filter(Boolean).join(" ");
  return name.replace(/\s+/g, " ").trim();
}

function translateProductTitleWords(value, context = "") {
  let text = normalizeSourceProductTitle(value);
  if (!text) return "";
  const phraseMap = [
    [/双色打孔龙骨手胶|打孔龙骨手胶|龙骨手胶|龙骨胶/gi, " perforated ribbed racket overgrip "],
    [/羽毛球拍手胶|网球拍手胶|羽毛球手胶|网球手胶|吸汗带|手胶/gi, " racket overgrip "],
    [/滴漏式手冲咖啡挂耳|手冲咖啡滤纸|咖啡滤纸|滤纸/gi, " coffee filter "],
    [/接粉环|磁吸接粉环/gi, " dosing funnel "],
    [/粉碗/gi, " filter basket "],
    [/生日口水巾|宠物围兜|口水巾|围兜/gi, " pet bandana "],
    [/铃铛项圈|猫咪项圈|宠物猫脖圈|项圈/gi, " cat collar "],
    [/木天蓼猫玩具|木天蓼|猫玩具/gi, " cat toy "],
    [/拉力带|拉力绳|弹力带/gi, " resistance band "],
    [/园艺手套|花园手套/gi, " garden gloves "],
    [/防护手套|手套/gi, " protective gloves "],
    [/瑜伽球|普拉提小球/gi, " yoga ball "],
    [/六折伞|折叠伞|雨伞|伞/gi, " folding umbrella "],
    [/线香|香薰/gi, " incense sticks "],
    [/瑜伽袜|普拉提袜/gi, " yoga socks "],
    [/船袜|隐形袜|浅口袜|短袜/gi, " no-show socks "],
    [/五指袜|五趾袜|分趾袜/gi, " toe socks "],
    [/袜子|袜/gi, " socks "],
    [/瑜伽/gi, " yoga "],
    [/普拉提/gi, " pilates "],
    [/防滑|止滑|点胶|硅胶/gi, " grip "],
    [/五指|五趾|分趾/gi, " toe "],
    [/圆形/gi, " round "],
    [/扇形/gi, " fan shaped "],
    [/原木浆|本色|原色/gi, " natural "],
    [/棉/gi, " cotton "],
  ];
  phraseMap.forEach(([pattern, replacement]) => {
    text = text.replace(pattern, replacement);
  });
  return compactEnglishWords(text, 6);
}

function simplifySupplierTitle(title, context = "") {
  return translateProductTitleWords(title)
    || translateProductTitleWords(context)
    || compactEnglishWords(title, 6);
}

function extractSupplierSkuOptions(text) {
  const decoded = decodeHtmlEntities(text);
  const options = [];
  const seen = new Set();

  const structuredPattern = /SKU_OPTION\s*[:;]+\s*([\s\S]*?)(?=\s+SKU_OPTION\s*[:;]+|\s+PRODUCT_(?:TITLE|ATTRIBUTE)\s*:|\n|$)/gi;
  for (const match of decoded.matchAll(structuredPattern)) {
    const optionText = match[1].replace(/\s+(?=(?:model|color|colorEnglish|variantStyle|size|material|rawSpec|length|width|height|weight)=)/gi, "; ");
    const parts = Object.fromEntries(optionText
      .split(";")
      .map((part) => part.trim())
      .map((part) => {
        const index = part.indexOf("=");
        return index > -1 ? [part.slice(0, index).trim(), part.slice(index + 1).trim()] : ["", ""];
      })
      .filter(([key]) => key));
    addSupplierSkuOption(options, seen, {
      model: parts.model,
      color: parts.color,
      colorEnglish: parts.colorEnglish || colorName(parts.color),
      size: parts.size,
      material: parts.material || "",
      variantStyle: parts.variantStyle || "",
      rawSpec: parts.rawSpec || "",
      dims: {
        topWidth: parts.length || "",
        sideLength: parts.width || "",
        bottomWidth: parts.height || "",
        weight: parts.weight || "",
        source: parts.length || parts.width || parts.height || parts.weight ? "1688 SKU package information" : "",
      },
    });
  }

  for (const match of decoded.matchAll(/"specAttrs"\s*:\s*"([^"]+)"/gi)) {
    const [skuRaw, sizeRaw] = match[1].split(">");
    const parsed = parseSupplierSkuText(skuRaw);
    addSupplierSkuOption(options, seen, {
      ...parsed,
      size: sizeRaw || parsed.size || "",
    });
  }

  const modelSelectionPattern = /"specId"\s*:\s*"[^"]+"[\s\S]{0,500}?"name"\s*:\s*"([^"]+)"[\s\S]{0,500}?"skuId"\s*:\s*\d+\s*,\s*"props"\s*:\s*\[([\s\S]*?)\]\s*\}/gi;
  for (const match of decoded.matchAll(modelSelectionPattern)) {
    const skuRaw = match[1];
    const props = supplierPropsMap(match[2]);
    const parsed = parseSupplierSkuText(skuRaw);
    const color = props["颜色"] || parsed.color || supplierSkuColor(skuRaw);
    const size = props["尺码"] || parsed.size || "";
    const length = props["长度"] || "";
    const material = props["材质"] || "";
    addSupplierSkuOption(options, seen, {
      ...parsed,
      color,
      colorEnglish: colorName(color),
      size,
      rawSpec: parsed.rawSpec || skuRaw,
      material,
      dims: {
        topWidth: parsed.dims?.topWidth || length,
        sideLength: parsed.dims?.sideLength || "",
        bottomWidth: parsed.dims?.bottomWidth || "",
        weight: parsed.dims?.weight || "",
        source: parsed.dims?.source || (length ? "1688 SKU structured properties" : ""),
      },
    });
  }

  const packInfoPattern = /\{[^{}]*(?:"sku2"\s*:\s*"([^"]*)"[^{}]*)?"sku1"\s*:\s*"([^"]*)"[^{}]*"length"\s*:\s*([0-9.]+)[^{}]*"width"\s*:\s*([0-9.]+)[^{}]*"weight"\s*:\s*([0-9.]+)[^{}]*"height"\s*:\s*([0-9.]+)/gi;
  for (const match of decoded.matchAll(packInfoPattern)) {
    const parsed = parseSupplierSkuText(match[2]);
    addSupplierSkuOption(options, seen, {
      ...parsed,
      size: match[1] || parsed.size || "",
      dims: parsed.dims || {},
    });
  }

  return options;
}

function extractSupplierStructuredText(html) {
  if (!html) return "";
  const decoded = decodeHtmlEntities(html);
  const titleLines = extractSupplierTitles(decoded).map((title) => `PRODUCT_TITLE: ${simplifySupplierTitle(title, decoded)}`);
  const skuOptions = extractSupplierSkuOptions(decoded);
  const skuLines = skuOptions.map((option) => [
    "SKU_OPTION:",
    `model=${option.model}`,
    option.color && `color=${option.color}`,
    option.colorEnglish && `colorEnglish=${option.colorEnglish}`,
    option.variantStyle && `variantStyle=${option.variantStyle}`,
    option.size && `size=${option.size}`,
    option.material && `material=${option.material}`,
    option.rawSpec && `rawSpec=${option.rawSpec}`,
    option.dims?.topWidth && `length=${option.dims.topWidth}`,
    option.dims?.sideLength && `width=${option.dims.sideLength}`,
    option.dims?.bottomWidth && `height=${option.dims.bottomWidth}`,
    option.dims?.weight && `weight=${option.dims.weight}`,
  ].filter(Boolean).join("; "));

  const attrPairs = [
    ["功能", "Function"],
    ["材质", "Material"],
    ["主面料成分", "Material"],
    ["类别", "Category"],
    ["包装", "Packaging"],
    ["适用性别", "Gender"],
    ["包装形式", "Packaging"],
    ["风格", "Style"],
    ["工艺", "Technology"],
    ["特殊工艺", "SpecialCraft"],
    ["颜色", "Color"],
    ["尺寸", "Size"],
    ["重量", "Weight"],
    ["筒高", "Sock Height"],
    ["图案", "Pattern"],
    ["织造方法", "Weaving"],
    ["无骨缝制", "Seam"],
  ];
  const attrLines = attrPairs.map(([sourceLabel, targetLabel]) => {
    const escapedLabel = sourceLabel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const directValue = extractFirstMatch(decoded, [new RegExp(`"${escapedLabel}"\\s*:\\s*"([^"]+)"`, "i")]);
    const namedValue = extractFirstMatch(decoded, [
      new RegExp(`"name"\\s*:\\s*"${escapedLabel}"[^{}]{0,500}?"value"\\s*:\\s*"([^"]+)"`, "i"),
    ]);
    const valuesBlock = extractFirstMatch(decoded, [
      new RegExp(`"name"\\s*:\\s*"${escapedLabel}"[^{}]{0,500}?"values"\\s*:\\s*\\[([^\\]]+)\\]`, "i"),
    ]);
    const arrayValues = Array.from(String(valuesBlock || "").matchAll(/"([^"]+)"/g)).map((match) => match[1]);
    const value = directValue || namedValue || uniquePromptItems(arrayValues).join(", ");
    return value ? `PRODUCT_ATTRIBUTE: ${targetLabel}=${value}` : "";
  }).filter(Boolean);
  const skuMaterial = skuOptions.find((option) => option.material)?.material || "";
  if (skuMaterial && !attrLines.some((line) => /^PRODUCT_ATTRIBUTE:\s*Material=/i.test(line))) {
    attrLines.push(`PRODUCT_ATTRIBUTE: Material=${skuMaterial}`);
  }
  return [...titleLines, ...attrLines, ...skuLines].join("\n");
}

function imageHasEnoughReadableSize(size) {
  if (!size) return false;
  return Math.min(size.width, size.height) >= 480 && size.width * size.height >= 450000;
}

function loadImageMeta(url) {
  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve({
      ok: true,
      width: image.naturalWidth || image.width || 0,
      height: image.naturalHeight || image.height || 0,
    });
    image.onerror = () => resolve({ ok: false, width: 0, height: 0 });
    image.src = url;
  });
}

function sourceProxyUrl(url) {
  const source = String(url || "").trim();
  // Amazon gallery images are public CDN assets and can render directly in an
  // <img>. Bypass the supplier proxy so competitor thumbnails still appear if
  // an already-running backend has not yet reloaded the expanded allowlist.
  if (/^https?:\/\/[^/]*(?:media-amazon|images-amazon)\.com\/images\/I\//i.test(source)) return source;
  return /^https?:\/\//i.test(source)
    ? `/api/source-proxy?url=${encodeURIComponent(source)}`
    : source;
}

function loadImageForCanvas(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Image failed to load"));
    image.src = url;
  });
}

async function imageUrlToOcrInput(url) {
  const readableUrl = sourceProxyUrl(url);
  try {
    const image = await loadImageForCanvas(readableUrl);
    const width = image.naturalWidth || image.width || 0;
    const height = image.naturalHeight || image.height || 0;
    if (!imageHasEnoughReadableSize({ width, height })) return { input: readableUrl, size: { ok: false, width, height } };
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return { input: readableUrl, size: { ok: true, width, height } };
    context.drawImage(image, 0, 0, width, height);
    return {
      input: canvas.toDataURL("image/png"),
      size: { ok: true, width, height },
    };
  } catch {
    const size = await loadImageMeta(readableUrl);
    return { input: readableUrl, size };
  }
}

function withTimeout(promise, timeoutMs, message) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      window.setTimeout(() => reject(new Error(message)), timeoutMs);
    }),
  ]);
}

function elapsedText(startTime) {
  const elapsedSeconds = (performance.now() - startTime) / 1000;
  return `${elapsedSeconds.toFixed(elapsedSeconds >= 10 ? 0 : 1)}s`;
}

async function ocrImageUrls(imageUrls, onProgress) {
  if (!imageUrls.length) {
    return { text: "", scannedCount: 0, failedCount: 0, acceptedCount: 0, available: false };
  }

  let Tesseract;
  try {
    onProgress?.(`正在加载 OCR 引擎，准备识别 ${imageUrls.length} 张 1688 图片...`);
    Tesseract = await loadOcrEngine();
  } catch {
    return { text: "", scannedCount: 0, failedCount: imageUrls.length, acceptedCount: 0, available: false };
  }

  const texts = [];
  let failedCount = 0;
  let attemptedCount = 0;
  let sellingPointCount = 0;
  for (let index = 0; index < imageUrls.length; index += 1) {
    const candidate = typeof imageUrls[index] === "string" ? { url: imageUrls[index], source: "html" } : imageUrls[index];
    const url = imageCandidateUrl(candidate);
    if (!url) continue;
    attemptedCount += 1;
    const sourceLabel = candidate.source === "detail" ? "详情描述图" : candidate.source === "collector" ? "采集清单图片" : "页面图片";
    const progressPrefix = `正在识别 1688 ${sourceLabel}文字... ${index + 1}/${imageUrls.length}`;
    let loadStartedAt = performance.now();
    let loadElapsed = "";
    onProgress?.(`${progressPrefix}，正在加载图片...`);
    try {
      const ocrInput = await withTimeout(imageUrlToOcrInput(url), IMAGE_LOAD_TIMEOUT_MS, "Image load timed out");
      loadElapsed = elapsedText(loadStartedAt);
      const imageMeta = ocrInput.size;
      if (!imageMeta.ok || !imageHasEnoughReadableSize(imageMeta)) {
        failedCount += 1;
        onProgress?.(`${progressPrefix}，图片加载 ${loadElapsed}，跳过：图片过小或不可读取。`);
        continue;
      }
      const ocrStartedAt = performance.now();
      onProgress?.(`${progressPrefix}，图片加载 ${loadElapsed}，正在 OCR...`);
      const result = await withTimeout(
        Tesseract.recognize(ocrInput.input, "chi_sim+eng"),
        OCR_RECOGNIZE_TIMEOUT_MS,
        "OCR timed out",
      );
      const ocrElapsed = elapsedText(ocrStartedAt);
      const text = cleanOcrText(result?.data?.text || "");
      if (isUsefulOcrText(text, candidate)) {
        texts.push(text);
        if (isProductSellingPointText(text)) sellingPointCount += 1;
        onProgress?.(`${progressPrefix}，图片加载 ${loadElapsed} / OCR ${ocrElapsed}，已提取有效文字。`);
        const combinedOcrText = texts.join("\n");
        const collectorDetailCovered = candidate.source !== "collector"
          || (candidate.collectorSection === "detail-tail" && (candidate.collectorSectionIndex || 0) >= 5);
        if (collectorDetailCovered && hasExplicitProductDimensionEvidence(combinedOcrText) && sellingPointCount >= 2) break;
        if (collectorDetailCovered && texts.length >= 8 && hasEnoughProductDetail(combinedOcrText)) break;
      } else {
        onProgress?.(`${progressPrefix}，图片加载 ${loadElapsed} / OCR ${ocrElapsed}，未提取到有效产品文字。`);
      }
    } catch (error) {
      failedCount += 1;
      const stageText = loadElapsed
        ? `图片加载 ${loadElapsed} 后失败：${error.message || "OCR 失败"}`
        : `图片加载失败或超时：${elapsedText(loadStartedAt)}`;
      onProgress?.(`${progressPrefix}，${stageText}`);
    }
  }

  return {
    text: texts.join("\n"),
    scannedCount: attemptedCount - failedCount,
    failedCount,
    acceptedCount: texts.length,
    sellingPointCount,
    available: true,
  };
}

async function ocrLocalImageFile(file, onProgress) {
  if (!file) {
    return { text: "", scannedCount: 0, failedCount: 0, available: false };
  }

  let Tesseract;
  try {
    onProgress?.(`正在加载 OCR 引擎，准备识别采购单图片：${file.name}...`);
    Tesseract = await loadOcrEngine();
  } catch {
    return { text: "", scannedCount: 0, failedCount: 1, available: false };
  }

  const ocrStartedAt = performance.now();
  onProgress?.(`正在识别采购单图片文字：${file.name}...`);
  try {
    const result = await withTimeout(
      Tesseract.recognize(file, "chi_sim+eng"),
      PURCHASE_IMAGE_OCR_TIMEOUT_MS,
      "Purchase image OCR timed out",
    );
    const ocrElapsed = elapsedText(ocrStartedAt);
    const text = cleanOcrText(result?.data?.text || "");
    const structuredRows = structuredPurchaseRowsFromOcrResult(result, text);
    onProgress?.(`采购单图片 OCR 完成：${ocrElapsed}。`);
    return {
      text: [text, structuredRows].filter(Boolean).join("\n"),
      scannedCount: text ? 1 : 0,
      failedCount: text ? 0 : 1,
      available: true,
    };
  } catch {
    onProgress?.(`采购单图片 OCR 失败或超时：${elapsedText(ocrStartedAt)}。`);
    return { text: "", scannedCount: 0, failedCount: 1, available: true };
  }
}

function productAttributeLinesFromSource(attributeSource) {
  return Object.entries(extractProductDetailAttributes(attributeSource)).map(([key, value]) => (
    `PRODUCT_ATTRIBUTE: ${key}=${value}`
  ));
}

function productTitleFromSupplierHtml(html, fallbackText = "") {
  const title = cleanHtmlText((String(html || "").match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1] || "");
  return title || extractFirstMatch(fallbackText, [/PRODUCT_TITLE:\s*([^\n]+)/i]) || "";
}

async function fetchLocalProductDimensionsProxy(facts, imageCandidates, onProgress, timeoutMs = 55000) {
  const imageUrls = uniqueByUrl(imageCandidates)
    .map(imageCandidateUrl)
    .filter(Boolean)
    .slice(0, 8);
  if (!imageUrls.length) return null;
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
  onProgress?.("OCR 未读到明确商品尺寸，正在用本地豆包视觉代理读取参数图...");
  try {
    const response = await fetch("/api/product-dimensions", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productName: facts.productName || "",
        selectedSpec: facts.selectedSpec || "",
        material: facts.material || "",
        structure: facts.structure || "",
        detailParameter: facts.detailParameter || "",
        imageUrls,
      }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch {
    onProgress?.("本地豆包视觉代理未返回可用商品尺寸，尺寸字段保持为空。");
    return null;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function fetchLocalProductAnalysisProxy(facts, imageCandidates, onProgress, timeoutMs = 120000) {
  const imageUrls = uniqueByUrl(imageCandidates)
    .map(imageCandidateUrl)
    .filter(Boolean)
    .slice(0, 12);
  if (!imageUrls.length) return null;
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
  onProgress?.("正在用豆包识图整理当前商品的材质、展开尺寸、工艺和卖点...");
  try {
    const response = await fetch("/api/product-analysis", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productName: facts.productName || "",
        selectedSpec: facts.selectedSpec || "",
        material: facts.material || "",
        structure: facts.structure || "",
        detailParameter: facts.detailParameter || "",
        localEvidence: facts.localEvidence || "",
        imageUrls,
      }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    const evidenceCount = (result?.product_name?.value ? 1 : 0)
      + (Array.isArray(result?.attributes) ? result.attributes.length : 0)
      + (Array.isArray(result?.dimensions) ? result.dimensions.length : 0)
      + (Array.isArray(result?.selling_points) ? result.selling_points.length : 0)
      + (Array.isArray(result?.use_scenes) ? result.use_scenes.length : 0);
    onProgress?.(evidenceCount
      ? `豆包识图完成：整理出 ${evidenceCount} 项有图片证据的商品信息。`
      : (result?.message || "豆包没有从当前详情图中读到可确认的补充信息，未填写空缺字段。"));
    return result;
  } catch (error) {
    onProgress?.(`豆包识图未返回可用结果：${error.message || "请求失败"}。已保留本地分析结果。`);
    return null;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function referenceMetaGroup(imageType = "") {
  const value = String(imageType || "").toLowerCase().replace(/[-\s]+/g, "_");
  if (/caliper|ruler|measurement_tool/.test(value)) return "measurement_tool";
  if (/parameter|measurement|dimension|size|spec/.test(value)) return "parameter";
  if (/detail|close|macro|material|texture|construction|structure|exploded|assembly/.test(value)) return "detail";
  if (/feature|benefit|demo|function|proof|load|strength|holding/.test(value)) return "feature";
  if (/life|scene|use|application|environment/.test(value)) return "lifestyle";
  if (/angle|multi|side|front|back|top/.test(value)) return "angle";
  if (/comparison|variant|option|color/.test(value)) return "option";
  if (/hero|overview|product|white|main/.test(value)) return "hero";
  return "other";
}

function isAlternateColorReference(item = {}) {
  return /same[_\s-]*product[_\s-]*alternate[_\s-]*color|alternate[_\s-]*color|color[_\s-]*variant|different[_\s-]*color|同款异色/i.test(
    [item.sku_match, item.reason].filter(Boolean).join(" "),
  );
}

function referenceMetaPriority(item = {}) {
  const exact = /exact/i.test(String(item.sku_match || "")) ? 100 : 0;
  const value = /high/i.test(String(item.reference_value || "")) ? 20 : 10;
  const confidence = /high/i.test(String(item.confidence || "")) ? 5 : 0;
  const information = /parameter|spec|dimension|feature|detail|structure|exploded|option|comparison|承重|参数|结构|拆解/i.test(
    [item.image_type, item.reason].filter(Boolean).join(" "),
  ) ? 3 : 0;
  return exact + value + confidence + information;
}

function diversifiedReferenceUrlsFromMeta(metaItems, fallbackUrls, limit = MAX_REFERENCE_CANDIDATES) {
  const quotas = { hero: 4, detail: 4, feature: 3, lifestyle: 3, angle: 3, option: 2, parameter: 3, other: 2 };
  const order = ["parameter", "detail", "feature", "hero", "lifestyle", "angle", "option", "other"];
  const seenMetaUrls = new Set();
  const indexed = (Array.isArray(metaItems) ? metaItems : [])
    .map((item, index) => ({ ...item, url: item?.url || "", group: referenceMetaGroup(item?.image_type), index }))
    .filter((item) => item.url && !seenMetaUrls.has(item.url) && seenMetaUrls.add(item.url))
    .sort((a, b) => referenceMetaPriority(b) - referenceMetaPriority(a) || a.index - b.index);
  const selected = [];
  const selectedSet = new Set();
  const add = (item) => {
    if (item?.url && !selectedSet.has(item.url) && selected.length < limit) {
      selected.push(item.url);
      selectedSet.add(item.url);
    }
  };
  const primary = indexed.filter((item) => item.group !== "measurement_tool" && !isAlternateColorReference(item));
  order.forEach((group) => primary.filter((item) => item.group === group).slice(0, 1).forEach(add));
  order.forEach((group) => primary.filter((item) => item.group === group).slice(1, quotas[group] || 2).forEach(add));
  primary.forEach(add);

  indexed
    .filter((item) => isAlternateColorReference(item) && !["hero", "lifestyle", "measurement_tool"].includes(item.group))
    .slice(0, 2)
    .forEach(add);

  const knownMetaUrls = new Set(indexed.map((item) => item.url));
  (Array.isArray(fallbackUrls) ? fallbackUrls : [])
    .filter((url) => url && !knownMetaUrls.has(url))
    .forEach((url) => add({ url }));
  return selected;
}

async function fetchSkuReferenceImageMapping(products, imageUrls, onProgress, timeoutMs = 300000) {
  const urls = Array.from(new Set((imageUrls || []).filter((url) => /^https?:\/\//i.test(url)))).slice(0, MAX_REFERENCE_CLASSIFIER_CANDIDATES);
  if (!products.length || !urls.length) return { mappings: {}, unmatched: urls, errors: ["No SKU or image candidates"] };
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
  const skuPayload = products.map((sku) => ({
    id: sku.id,
    productName: sku.productName || sku.baseProductName || sku.label || "",
    option: sku.outputSizeCode || sku.sizeCode || sku.shape || sku.label || "",
    color: sku.colorEnglish || sku.color || sku.displayColor || "",
    pack: sku.packComposition || sku.pack || sku.productUnitCount || "",
    structure: sku.structure || "",
  }));
  const batches = [];
  for (let index = 0; index < urls.length; index += REFERENCE_CLASSIFIER_BATCH_SIZE) {
    batches.push(urls.slice(index, index + REFERENCE_CLASSIFIER_BATCH_SIZE));
  }
  onProgress?.(`正在让豆包按商品身份筛选 ${urls.length} 张参考图（${batches.length} 批）...`);
  try {
    const mappings = Object.fromEntries(products.map((sku) => [sku.id, []]));
    const referenceMeta = Object.fromEntries(products.map((sku) => [sku.id, []]));
    const unmatched = [];
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex += 1) {
      onProgress?.(`正在按商品身份筛选参考图... ${batchIndex + 1}/${batches.length}`);
      const response = await fetch("/api/reference-image-map", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ skus: skuPayload, imageUrls: batches[batchIndex] }),
        signal: controller.signal,
      });
      const result = await response.json();
      const batchMatchedCount = Object.values(result?.mappings || {}).reduce(
        (sum, values) => sum + (Array.isArray(values) ? values.length : 0),
        0,
      );
      if (!response.ok || (result?.errors?.length && !batchMatchedCount)) {
        throw new Error((result?.errors || []).join("；") || `HTTP ${response.status}`);
      }
      products.forEach((sku) => {
        const mapped = Array.isArray(result?.mappings?.[sku.id]) ? result.mappings[sku.id] : [];
        mappings[sku.id].push(...mapped);
        const meta = Array.isArray(result?.referenceMeta?.[sku.id]) ? result.referenceMeta[sku.id] : [];
        referenceMeta[sku.id].push(...meta);
      });
      if (Array.isArray(result?.unmatched)) unmatched.push(...result.unmatched);
    }
    Object.keys(mappings).forEach((skuId) => {
      const fallbackUrls = Array.from(new Set(mappings[skuId]));
      mappings[skuId] = diversifiedReferenceUrlsFromMeta(
        referenceMeta[skuId],
        fallbackUrls,
        MAX_REFERENCE_CANDIDATES,
      );
      const allowedUrls = new Set(mappings[skuId]);
      const seenMetaUrls = new Set();
      referenceMeta[skuId] = referenceMeta[skuId].filter((item) => {
        const url = item?.url || "";
        if (!allowedUrls.has(url) || seenMetaUrls.has(url)) return false;
        seenMetaUrls.add(url);
        return true;
      });
    });
    const matchedCount = Object.values(mappings).reduce((sum, values) => sum + (Array.isArray(values) ? values.length : 0), 0);
    onProgress?.(`SKU 参考图筛选完成：保留 ${matchedCount} 个同款/同类匹配，${unmatched.length} 张明显无关图片已排除。`);
    return { mappings, referenceMeta, unmatched: Array.from(new Set(unmatched)), errors: [] };
  } catch (error) {
    onProgress?.(`SKU 参考图匹配失败：${error?.message || "请求失败"}。为防止错配，本次不自动分配参考图。`);
    return { mappings: {}, unmatched: urls, errors: [error?.message || "Reference image mapping failed"] };
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function productDimensionEvidenceText(result, context = "") {
  const dimensions = Array.isArray(result?.dimensions)
    ? result.dimensions.map((item) => cleanTokenValue(item)).filter(Boolean)
    : [];
  const semantic = semanticDimensionItems(dimensions, context);
  return semantic.length ? `[VERIFIED_DIMENSIONS: ${semantic.join("; ")}]` : "";
}

function productAnalysisEvidenceText(result, context = "") {
  if (!result) return "";
  const productName = cleanTokenValue(result?.product_name?.value);
  const attributeLines = (Array.isArray(result.attributes) ? result.attributes : [])
    .map((item) => {
      const field = cleanTokenValue(item?.field);
      const value = cleanTokenValue(item?.value);
      return field && value ? `PRODUCT_ATTRIBUTE: ${field}=${value}` : "";
    })
    .filter(Boolean);
  const visionAttributeLines = (Array.isArray(result.attributes) ? result.attributes : [])
    .map((item) => {
      const field = cleanTokenValue(item?.field);
      const value = cleanTokenValue(item?.value);
      return field && value ? `DOUBAO_VISION_ATTRIBUTE: ${field}=${value}` : "";
    })
    .filter(Boolean);
  const visionDimensionLines = (Array.isArray(result.dimensions) ? result.dimensions : [])
    .map((item) => cleanTokenValue(item))
    .filter(Boolean)
    .map((dimension) => `DOUBAO_VISION_DIMENSION: ${dimension}`);
  const sellingPointLines = (Array.isArray(result.selling_points) ? result.selling_points : [])
    .map((item) => cleanTokenValue(typeof item === "string" ? item : item?.claim))
    .filter(Boolean)
    .map((claim) => `DOUBAO_VISION_SELLING_POINT: ${claim}`);
  const sceneLines = (Array.isArray(result.use_scenes) ? result.use_scenes : [])
    .map((item) => cleanTokenValue(typeof item === "string" ? item : item?.scene))
    .filter(Boolean)
    .map((scene) => `DOUBAO_VISION_USE_SCENE: ${scene}`);
  const hasEvidence = Boolean(productName || attributeLines.length || sellingPointLines.length || sceneLines.length || result.dimensions?.length);
  return [
    hasEvidence ? "DOUBAO_VISION_VERIFIED: true" : "",
    productName ? `DOUBAO_VISION_PRODUCT_NAME: ${productName}` : "",
    ...attributeLines,
    ...visionAttributeLines,
    productDimensionEvidenceText(result, context),
    ...visionDimensionLines,
    ...sellingPointLines,
    ...sceneLines,
  ].filter(Boolean).join("\n");
}

function productAnalysisSellingPointVisualEvidence(result) {
  const points = Array.isArray(result?.selling_points) ? result.selling_points : [];
  return points.map((item) => ({
    claim: cleanFieldDisplayValue(item?.claim || ""),
    evidence: cleanFieldDisplayValue(item?.evidence || ""),
    imageUrl: cleanFieldDisplayValue(item?.image_url || ""),
  })).filter((item) => item.claim && item.evidence && /^https?:\/\//i.test(item.imageUrl));
}

function sellingPointEvidenceSubject(value) {
  const text = String(value || "").toLowerCase();
  if (/(?:dispenser|holder|container|case|lid|cap|twist|lock|loop|carabiner|挂钩|旋转|开合|顶盖|防松|分配器|外壳)/i.test(text)) return "dispenser";
  if (/(?:poop\s*bags?|pet\s*waste\s*bags?|refill|roll|leak|tear|thick|bag\s*film|垃圾袋|拾便袋|袋卷|加厚|不漏|不破|易撕)/i.test(text)) return "bags";
  return "";
}

function amazonSkuEvidenceSubject(sku = {}) {
  const text = [sku.amazonTitle, sku.productName, sku.baseProductName, sku.shape, sku.label, sku.model]
    .filter(Boolean).join(" ");
  if (/(?:set|bundle|kit|套装|组合)/i.test(text)) return "bundle";
  return sellingPointEvidenceSubject(text);
}

function applyVisualEvidenceToMatchingAmazonSkus(products, evidenceItems) {
  const evidence = Array.isArray(evidenceItems) ? evidenceItems : [];
  if (!evidence.length) return products;
  return products.map((product) => {
    const subject = amazonSkuEvidenceSubject(product);
    // Unknown is intentionally left empty: source facts must not leak into a
    // SKU merely because it lives in the same supplier page.
    const matches = subject === "bundle"
      ? evidence
      : subject
        ? evidence.filter((item) => sellingPointEvidenceSubject(`${item.claim} ${item.evidence}`) === subject)
        : [];
    if (!matches.length) return product;
    const claims = uniqueSellingPoints(matches.map((item) => item.claim), 4);
    const groups = distributedSellingPointGroups(claims, 0, 2, 4);
    return {
      ...product,
      sellingPointVisualEvidence: matches,
      feature1: product.feature1 || sellingPointGroupText(groups),
      feature2: product.feature2 || sellingPointGroupText(distributedSellingPointGroups(claims, 1, 2, 4)),
    };
  });
}

function applyVisualEvidenceToBoundSku(products, evidenceItems, boundSkuId) {
  const evidence = Array.isArray(evidenceItems) ? evidenceItems : [];
  const claims = uniqueSellingPoints(evidence.map((item) => item.claim), 4);
  return products.map((product) => {
    if (product.id !== boundSkuId) return { ...product, sellingPointVisualEvidence: [] };
    return {
      ...product,
      sellingPointVisualEvidence: evidence,
      feature1: product.feature1 || sellingPointGroupText(distributedSellingPointGroups(claims, 0, 2, 4)),
      feature2: product.feature2 || sellingPointGroupText(distributedSellingPointGroups(claims, 1, 2, 4)),
    };
  });
}

async function extractSupplierSourceText(html, onProgress, routeId = selectedExtractionRoute, collectedImageText = "", identityHint = {}) {
  if (!html && !collectedImageText) {
    return { text: "", imageCount: 0, candidateCount: 0, scannedCount: 0, failedCount: 0, ocrAvailable: false };
  }

  const baseText = cleanHtmlText(html);
  const structuredText = extractSupplierStructuredText(html);
  const detailUrls = extractDetailUrlsFromHtml(html);
  const detailHtml = detailUrls.length ? await fetchDetailHtml(detailUrls, onProgress) : "";
  const htmlImageCandidates = extractImageUrlsFromHtml(html, "html");
  const detailImageCandidates = detailHtml ? extractImageUrlsFromHtml(detailHtml, "detail") : [];
  const collectedImageCandidates = extractCollectedImageCandidates(collectedImageText);
  const allImageCandidates = [...collectedImageCandidates, ...htmlImageCandidates, ...detailImageCandidates];
  const imageUrls = collectedImageCandidates.length
    ? collectedImageCandidatesForLocalOcr(collectedImageCandidates, detailImageCandidates, htmlImageCandidates)
    : uniqueImageCandidates(detailImageCandidates, htmlImageCandidates);
  if (!imageUrls.length) {
    const attributeSource = productAttributeSourceText(structuredText);
    const detailAttrLines = productAttributeLinesFromSource(attributeSource);
    return { text: [baseText, structuredText, ...detailAttrLines].filter(Boolean).join("\n"), imageCount: 0, candidateCount: allImageCandidates.length, scannedCount: 0, failedCount: 0, ocrAvailable: false };
  }

  const collectorStatus = collectedImageCandidates.length ? `采集清单去重后 ${collectedImageCandidates.length} 张，` : "";
  onProgress?.(`已找到 ${allImageCandidates.length} 条 1688 图片候选，${collectorStatus}直接筛选后识别 ${imageUrls.length} 张参数/卖点重点图...`);
  const ocr = await ocrImageUrls(imageUrls, onProgress);
  const attributeSource = productAttributeSourceText(structuredText, ocr.text);
  const detailAttrLines = productAttributeLinesFromSource(attributeSource);
  const combinedBeforeVision = [baseText, structuredText, ...detailAttrLines, attributeSource].filter(Boolean).join("\n");
  const visionImageCandidates = balancedVisionImageCandidates(imageUrls);
  const pickerImageCandidates = referencePickerImageCandidates(collectedImageCandidates, imageUrls, MAX_REFERENCE_CLASSIFIER_CANDIDATES);
  const hintedProductName = cleanFieldDisplayValue(
    identityHint.productName || identityHint.baseProductName || identityHint.label || "",
  );
  const hintedSpec = cleanFieldDisplayValue(
    identityHint.outputSizeCode || identityHint.sizeCode || identityHint.shape || identityHint.model || "",
  );
  const analysisResult = routeId === "vision" || routeId === "web"
    ? await fetchLocalProductAnalysisProxy({
      productName: productTitleFromSupplierHtml(html, baseText) || hintedProductName,
      selectedSpec: hintedSpec,
      material: extractProductDetailAttributes(attributeSource).Material || identityHint.material || "",
      structure: extractProductDetailAttributes(attributeSource).Structure || identityHint.structure || "",
      detailParameter: extractProductDetailAttributes(attributeSource).DetailFeatures || identityHint.detailParameter || "",
      localEvidence: [detailAttrLines.join("\n"), attributeSource].filter(Boolean).join("\n").slice(0, 12000),
    }, visionImageCandidates, onProgress)
    : null;
  const analysisEvidence = productAnalysisEvidenceText(analysisResult, combinedBeforeVision);
  return {
    text: [baseText, structuredText, ...detailAttrLines, analysisEvidence, attributeSource && `1688 image OCR text: ${attributeSource}`].filter(Boolean).join("\n"),
    imageCount: imageUrls.length,
    candidateCount: allImageCandidates.length,
    collectorCandidateCount: collectedImageCandidates.length,
    scannedCount: ocr.scannedCount,
    failedCount: ocr.failedCount,
    acceptedCount: ocr.acceptedCount,
    sellingPointCount: ocr.sellingPointCount,
    visionEvidenceCount: (analysisResult?.product_name?.value ? 1 : 0)
      + (Array.isArray(analysisResult?.attributes) ? analysisResult.attributes.length : 0)
      + (Array.isArray(analysisResult?.dimensions) ? analysisResult.dimensions.length : 0)
      + (Array.isArray(analysisResult?.selling_points) ? analysisResult.selling_points.length : 0)
      + (Array.isArray(analysisResult?.use_scenes) ? analysisResult.use_scenes.length : 0),
    visionMessage: cleanFieldDisplayValue(analysisResult?.message || ""),
    visionErrors: Array.isArray(analysisResult?.errors) ? analysisResult.errors.map((error) => cleanFieldDisplayValue(error)).filter(Boolean) : [],
    sellingPointVisualEvidence: productAnalysisSellingPointVisualEvidence(analysisResult),
    // Vision deliberately inspects a balanced sample of at most 12 images,
    // but the human reference picker must retain the full validated source
    // pool. Otherwise late/early variant photos can disappear merely because
    // they were not selected for model analysis.
    referenceImageUrls: pickerImageCandidates.map(imageCandidateUrl).filter(Boolean).slice(0, MAX_REFERENCE_CLASSIFIER_CANDIDATES),
    ocrAvailable: ocr.available,
  };
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

async function readWorkbook(file) {
  if (!file) return null;
  const xlsx = await loadXlsx();
  if (!xlsx) {
    throw new Error("Excel 解析库未加载，请刷新页面后重试，或先只用 PDF/HTML 资料测试。");
  }
  const buffer = await file.arrayBuffer();
  return xlsx.read(buffer, { type: "array", cellDates: false });
}

async function readTextFiles(files, onProgress) {
  const fileList = Array.from(files || []);
  const texts = [];
  for (let index = 0; index < fileList.length; index += 1) {
    const file = fileList[index];
    onProgress?.(`正在读取 HTML 文件... ${index + 1}/${fileList.length}：${file.name}`);
    const text = await readFileAsText(file);
    if (text) texts.push(`Source HTML file: ${file.name}\n${text}`);
  }
  return texts.join("\n");
}

async function readNamedTextFiles(files, onProgress, kindLabel = "HTML 文件") {
  const fileList = Array.from(files || []);
  const entries = [];
  for (let index = 0; index < fileList.length; index += 1) {
    const file = fileList[index];
    onProgress?.(`正在读取${kindLabel}... ${index + 1}/${fileList.length}：${file.name}`);
    const text = await readFileAsText(file);
    if (text) entries.push({ name: file.name, text });
  }
  return entries;
}

function namedHtmlEntryText(entry) {
  return entry?.text ? `Source HTML file: ${entry.name}\n${entry.text}` : "";
}

function combinedNamedHtmlEntries(entries) {
  return entries.map(namedHtmlEntryText).filter(Boolean).join("\n");
}

function mergeSupplierSourceResults(results) {
  const values = results.filter(Boolean);
  return {
    text: values.map((item) => item.text).filter(Boolean).join("\n"),
    imageCount: values.reduce((sum, item) => sum + (item.imageCount || 0), 0),
    candidateCount: values.reduce((sum, item) => sum + (item.candidateCount || 0), 0),
    scannedCount: values.reduce((sum, item) => sum + (item.scannedCount || 0), 0),
    failedCount: values.reduce((sum, item) => sum + (item.failedCount || 0), 0),
    acceptedCount: values.reduce((sum, item) => sum + (item.acceptedCount || 0), 0),
    sellingPointCount: values.reduce((sum, item) => sum + (item.sellingPointCount || 0), 0),
    collectorCandidateCount: values.reduce((sum, item) => sum + (item.collectorCandidateCount || 0), 0),
    visionEvidenceCount: values.reduce((sum, item) => sum + (item.visionEvidenceCount || 0), 0),
    visionMessage: values.map((item) => cleanFieldDisplayValue(item.visionMessage || "")).filter(Boolean).join("；"),
    visionErrors: values.flatMap((item) => Array.isArray(item.visionErrors) ? item.visionErrors : []).filter(Boolean),
    sellingPointVisualEvidence: values.flatMap((item) => Array.isArray(item.sellingPointVisualEvidence) ? item.sellingPointVisualEvidence : []),
    referenceImageUrls: Array.from(new Set(values.flatMap((item) => Array.isArray(item.referenceImageUrls) ? item.referenceImageUrls : []))).slice(0, MAX_REFERENCE_CANDIDATES),
    ocrAvailable: values.some((item) => item.ocrAvailable),
  };
}

async function extractSupplierSourcesByFile(entries, onProgress, routeId = selectedExtractionRoute, imageListEntries = []) {
  const results = [];
  for (let index = 0; index < entries.length; index += 1) {
    const entry = entries[index];
    const matchingImageList = imageListEntries.length === entries.length ? imageListEntries[index]?.text || "" : "";
    onProgress?.(`正在解析第 ${index + 1}/${entries.length} 个 1688 文件：${entry.name}`);
    const source = await extractSupplierSourceText(namedHtmlEntryText(entry), onProgress, routeId, matchingImageList);
    results.push({
      name: entry.name,
      ...source,
      text: [`Source HTML file: ${entry.name}`, source.text].filter(Boolean).join("\n"),
    });
  }
  return {
    fileSources: results,
    merged: mergeSupplierSourceResults(results),
  };
}

function productsFromSupplierFileSources(fileSources) {
  return fileSources.map((source, index) => {
    const products = inferProductsFromSources("", source.text, "");
    const product = products[0];
    if (!product) return null;
    const rawSpecName = readableNameFromRawSpec([
      product.supplierOption?.rawSpec,
      product.outputSpec,
      product.spec,
      product.label,
      source.text,
    ].filter(Boolean).join(" "));
    const displayName = cleanProductDisplayName(product.productName || product.outputProductName || product.label, rawSpecName || `Product ${index + 1}`);
    const productName = displayName || rawSpecName || `Product ${index + 1}`;
    if (!rawSpecName && /^Product\s+\d+$/i.test(productName)) return null;
    return {
      ...product,
      id: `EXTRACTED-SUPPLIER-FILE-${index + 1}`,
      label: productName,
      displayLabel: productName,
      productName,
      outputProductName: product.outputProductName && !isMachineProductText(product.outputProductName) ? product.outputProductName : productName,
      baseProductName: product.baseProductName && !isMachineProductText(product.baseProductName) ? product.baseProductName : productName,
      shape: cleanProductDisplayName(product.shape || product.outputSpec || product.spec, productName),
      rawSpec: product.supplierOption?.rawSpec || rawSpecName,
      sourceFile: source.name,
      sellingPointVisualEvidence: Array.isArray(source.sellingPointVisualEvidence) ? source.sellingPointVisualEvidence : [],
    };
  }).filter(Boolean);
}

function pdfTextLines(items) {
  const lines = [];
  const tolerance = 4;
  (items || []).forEach((item) => {
    const text = normalizePurchaseText(item?.str || "").trim();
    if (!text) return;
    const transform = item?.transform || [];
    const x = Number(transform[4]) || 0;
    const y = Number(transform[5]) || 0;
    let line = lines.find((candidate) => Math.abs(candidate.y - y) <= tolerance);
    if (!line) {
      line = { y, items: [] };
      lines.push(line);
    }
    line.items.push({ x, text });
  });
  return lines
    .map((line) => ({
      ...line,
      items: line.items.sort((left, right) => left.x - right.x),
    }))
    .sort((left, right) => right.y - left.y);
}

function ocrWordsToPdfLikeItems(words) {
  return (words || []).map((word) => {
    const bbox = word?.bbox || {};
    const x0 = Number(bbox.x0 ?? word.x0 ?? word.left ?? word.x) || 0;
    const y0 = Number(bbox.y0 ?? word.y0 ?? word.top ?? word.y) || 0;
    const y1 = Number(bbox.y1 ?? word.y1 ?? (y0 + (word.height || 0))) || y0;
    return {
      str: word.text || word.str || "",
      transform: [1, 0, 0, 1, x0, -y1],
    };
  }).filter((item) => String(item.str || "").trim());
}

function pdfLineText(line) {
  return (line?.items || []).map((item) => item.text).join(" ").replace(/\s+/g, " ").trim();
}

function isPurchaseTableHeaderLine(line) {
  const compact = compactChineseText(pdfLineText(line));
  return /序号货号货品名称规格数量/.test(compact)
    || /序号/.test(compact) && /货号|商品编码|货品编号/.test(compact) && /货品名称|商品名称/.test(compact) && /规格/.test(compact) && /数量/.test(compact);
}

function isPurchaseFooterLine(line) {
  return /货品合计|实付款|货品总量|买家留言|https?:|订单详情预览|订单详情单/.test(pdfLineText(line));
}

function purchaseLineRowNumber(line) {
  const first = (line?.items || []).find((item) => item.x < 70 && /^[1-9]\d{0,2}$/.test(item.text));
  if (!first) return "";
  const hasRowContent = (line.items || []).some((item) => item.x > 70 && item.x < 540 && /[0-9A-Za-z\u4e00-\u9fff]/.test(item.text));
  return hasRowContent ? first.text : "";
}

function purchaseLineRowNumberByRatio(line, pageWidth) {
  const firstLimit = Math.max(70, pageWidth * 0.14);
  const contentLimit = Math.max(140, pageWidth * 0.22);
  const first = (line?.items || []).find((item) => item.x < firstLimit && /^[1-9]\d{0,2}$/.test(item.text));
  if (!first) return "";
  const hasRowContent = (line.items || []).some((item) => item.x > firstLimit && item.x < pageWidth * 0.96 && /[0-9A-Za-z\u4e00-\u9fff]/.test(item.text));
  return hasRowContent ? first.text : "";
}

function purchasePdfCellText(lines, minX, maxX) {
  return lines
    .flatMap((line) => line.items || [])
    .filter((item) => item.x >= minX && item.x < maxX)
    .map((item) => item.text)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function purchaseOcrCellText(lines, startRatio, endRatio, pageWidth) {
  return purchasePdfCellText(lines, pageWidth * startRatio, pageWidth * endRatio);
}

function purchaseHeaderLabelX(line, labels) {
  const items = (line?.items || []).map((item) => ({
    x: item.x,
    text: compactChineseText(item.text).replace(/[()（）]/g, ""),
  })).filter((item) => item.text);
  for (const label of labels) {
    const direct = items.find((item) => item.text.includes(label) || label.includes(item.text) && item.text.length >= 2);
    if (direct) return direct.x;
    for (let index = 0; index < items.length; index += 1) {
      for (let span = 2; span <= 4 && index + span <= items.length; span += 1) {
        const group = items.slice(index, index + span);
        const joined = group.map((item) => item.text).join("");
        if (joined.includes(label)) return Math.min(...group.map((item) => item.x));
      }
    }
  }
  return null;
}

function purchaseHeaderScore(line) {
  const compact = compactChineseText(pdfLineText(line));
  return [
    /序号/.test(compact),
    /货号|商品编码|货品编号/.test(compact),
    /货品名称|商品名称|品名/.test(compact),
    /规格/.test(compact),
    /数量/.test(compact),
    /单价/.test(compact),
    /金额/.test(compact),
  ].filter(Boolean).length;
}

function purchaseColumnBoundsFromLines(lines, pageWidth) {
  const headerLine = (lines || [])
    .map((line) => ({ line, score: purchaseHeaderScore(line) }))
    .filter((entry) => entry.score >= 4)
    .sort((left, right) => right.score - left.score)[0]?.line;
  if (!headerLine) return null;

  const x = {
    index: purchaseHeaderLabelX(headerLine, ["序号"]),
    code: purchaseHeaderLabelX(headerLine, ["货号", "商品编码", "货品编号"]),
    name: purchaseHeaderLabelX(headerLine, ["货品名称", "商品名称", "品名"]),
    spec: purchaseHeaderLabelX(headerLine, ["规格"]),
    quantity: purchaseHeaderLabelX(headerLine, ["数量"]),
    price: purchaseHeaderLabelX(headerLine, ["单价"]),
    discount: purchaseHeaderLabelX(headerLine, ["优惠"]),
    amount: purchaseHeaderLabelX(headerLine, ["金额"]),
  };
  if (![x.code, x.name, x.spec, x.quantity].every((value) => Number.isFinite(value))) return null;

  const midpoint = (left, right) => (Number(left) + Number(right)) / 2;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const indexCode = Number.isFinite(x.index) ? midpoint(x.index, x.code) : pageWidth * 0.07;
  const codeName = midpoint(x.code, x.name);
  const nameSpec = midpoint(x.name, x.spec);
  const specQuantity = midpoint(x.spec, x.quantity);
  const quantityPrice = Number.isFinite(x.price) ? midpoint(x.quantity, x.price) : pageWidth * 0.62;
  const priceEnd = Number.isFinite(x.price) && Number.isFinite(x.discount)
    ? midpoint(x.price, x.discount)
    : Number.isFinite(x.price) && Number.isFinite(x.amount)
      ? midpoint(x.price, x.amount)
      : pageWidth * 0.85;
  const amountStart = Number.isFinite(x.discount) && Number.isFinite(x.amount)
    ? midpoint(x.discount, x.amount)
    : Number.isFinite(x.amount)
      ? Math.max(priceEnd, x.amount - pageWidth * 0.04)
      : pageWidth * 0.9;

  return {
    code: [clamp(indexCode, 0, pageWidth), clamp(codeName, 0, pageWidth)],
    name: [clamp(codeName, 0, pageWidth), clamp(nameSpec, 0, pageWidth)],
    spec: [clamp(nameSpec, 0, pageWidth), clamp(specQuantity, 0, pageWidth)],
    quantity: [clamp(specQuantity, 0, pageWidth), clamp(quantityPrice, 0, pageWidth)],
    price: [clamp(quantityPrice, 0, pageWidth), clamp(priceEnd, 0, pageWidth + 60)],
    amount: [clamp(amountStart, 0, pageWidth + 60), pageWidth + 80],
  };
}

function purchaseOcrBoundedCellText(lines, bounds, field, pageWidth, startRatio, endRatio) {
  const range = bounds?.[field];
  if (range) return purchasePdfCellText(lines, range[0], range[1]);
  return purchaseOcrCellText(lines, startRatio, endRatio, pageWidth);
}

function sanitizePurchaseRowField(value) {
  return normalizePurchaseText(value)
    .replace(/\s+\d+\s+\d+(?:\.\d+)?\s*元\s*\/?\s*(?:双|件|个|盒|把|条|只)?(?:\s+[-+]?\d+(?:\.\d+)?){0,2}\s*$/i, " ")
    .replace(/\s+\d+(?:\.\d+)?\s*元\s*\/?\s*(?:双|件|个|盒|把|条|只)?(?:\s+[-+]?\d+(?:\.\d+)?){0,2}\s*$/i, " ")
    .replace(/[;\n\r]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function purchaseRowFromTextLine(lineText, fallbackIndex = 1) {
  const source = normalizePurchaseText(lineText)
    .replace(/[|｜]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!source || isPurchaseFooterLine({ items: [{ text: source }] }) || /序号\s*货号\s*货品名称/.test(source)) return null;
  const match = source.match(/^\s*([1-9]\d{0,2})\s+(.+)$/);
  if (!match) return null;
  const index = match[1];
  const rest = match[2].trim();
  if (!/(?:颜色|尺码|尺寸|规格|[1-9]\d*\s*(?:元|\/|件|个|盒|把|条)|[A-Za-z]{1,8}\d{1,6})/i.test(rest)) return null;

  const quantityPricePattern = /\s+([1-9]\d*)\s+([0-9]+(?:\.[0-9]+)?\s*(?:元\s*\/\s*)?(?:件|个|盒|把|条|双|只|\/)?)\s+([-+]?[0-9]+(?:\.[0-9]+)?)?\s+([0-9]+(?:\.[0-9]+)?)\s*$/i;
  const quantityMatch = rest.match(quantityPricePattern);
  const beforeQuantity = quantityMatch ? rest.slice(0, quantityMatch.index).trim() : rest;
  const nonSettlementText = beforeQuantity
    .replace(/[-+]?\d+(?:\.\d+)?/g, " ")
    .replace(/元|双|件|个|盒|把|条|只|单价|数量|优惠|金额|\/|[-—]/g, " ")
    .replace(/\s+/g, "")
    .trim();
  const hasProductSignal = /[A-Za-z]{1,8}\d{1,6}/i.test(beforeQuantity)
    || /颜色|尺码|尺寸|规格/.test(beforeQuantity)
    || /[\u4e00-\u9fff]{2,}/.test(nonSettlementText);
  if (!hasProductSignal) return null;
  const quantity = quantityMatch?.[1] || "";
  const price = quantityMatch?.[2] || "";
  const amount = quantityMatch?.[4] || "";

  const specMatch = beforeQuantity.match(/(?:颜色|尺码|尺寸|规格)\s*[:：]\s*.+$/i);
  const spec = specMatch ? specMatch[0].trim() : "";
  const beforeSpec = specMatch ? beforeQuantity.slice(0, specMatch.index).trim() : beforeQuantity;
  const codeMatch = beforeSpec.match(/^(\S{2,40})(?:\s+|$)([\s\S]*)$/);
  const code = sanitizePurchaseRowField(codeMatch?.[1] || "");
  const name = sanitizePurchaseRowField(codeMatch?.[2] || beforeSpec || `OCR row ${fallbackIndex}`);
  if (!code && !name && !spec) return null;
  return {
    index,
    code,
    name,
    spec: sanitizePurchaseRowField(spec || beforeQuantity),
    quantity: sanitizePurchaseRowField(quantity),
    price: sanitizePurchaseRowField(price),
    amount: sanitizePurchaseRowField(amount),
  };
}

function purchaseRowsFromOcrText(text) {
  const rows = [];
  String(text || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line, index) => {
      const row = purchaseRowFromTextLine(line, index + 1);
      if (row) rows.push(row);
    });
  return rows;
}

function purchaseRowsFromOcrWords(words) {
  const items = ocrWordsToPdfLikeItems(words);
  if (!items.length) return [];
  const lines = pdfTextLines(items);
  const allItems = lines.flatMap((line) => line.items || []);
  const maxX = Math.max(...allItems.map((item) => item.x), 0);
  const pageWidth = maxX > 0 ? maxX + 30 : 1000;
  const columnBounds = purchaseColumnBoundsFromLines(lines, pageWidth);
  const rowStarts = lines
    .map((line, index) => ({ line, index, rowNumber: purchaseLineRowNumberByRatio(line, pageWidth) }))
    .filter((entry) => entry.rowNumber);
  const rows = [];

  rowStarts.forEach((entry, rowStartIndex) => {
    const nextStart = rowStarts[rowStartIndex + 1]?.index ?? lines.length;
    const start = entry.index;
    let end = nextStart;
    while (end > start && isPurchaseFooterLine(lines[end - 1])) end -= 1;
    const rowLines = lines.slice(start, Math.max(start + 1, end));
    const row = {
      index: entry.rowNumber,
      code: sanitizePurchaseRowField(purchaseOcrBoundedCellText(rowLines, columnBounds, "code", pageWidth, 0.07, 0.21)),
      name: sanitizePurchaseRowField(purchaseOcrBoundedCellText(rowLines, columnBounds, "name", pageWidth, 0.21, 0.43)),
      spec: sanitizePurchaseRowField(purchaseOcrBoundedCellText(rowLines, columnBounds, "spec", pageWidth, 0.43, 0.58)),
      quantity: sanitizePurchaseRowField(purchaseOcrBoundedCellText(rowLines, columnBounds, "quantity", pageWidth, 0.58, 0.66).match(/[1-9]\d*/)?.[0] || ""),
      price: sanitizePurchaseRowField(purchaseOcrBoundedCellText(rowLines, columnBounds, "price", pageWidth, 0.66, 0.78)),
      amount: sanitizePurchaseRowField(purchaseOcrBoundedCellText(rowLines, columnBounds, "amount", pageWidth, 0.88, 1.02)),
    };
    if (!row.code && !row.name && !row.spec) {
      const fromText = purchaseRowFromTextLine(rowLines.map(pdfLineText).join(" "), rows.length + 1);
      if (fromText) rows.push(fromText);
      return;
    }
    rows.push(row);
  });
  return rows;
}

function structuredPurchaseRowsFromOcrResult(result, text) {
  const wordRows = purchaseRowsFromOcrWords(result?.data?.words || result?.words || []);
  if (wordRows.length) return serializePurchaseRows(wordRows);
  return serializePurchaseRows(purchaseRowsFromOcrText(text));
}

function purchaseRowsFromPdfItems(items) {
  const lines = pdfTextLines(items);
  const rowStarts = lines
    .map((line, index) => ({ line, index, rowNumber: purchaseLineRowNumber(line) }))
    .filter((entry) => entry.rowNumber);
  const rows = [];

  rowStarts.forEach((entry, rowStartIndex) => {
    const nextStart = rowStarts[rowStartIndex + 1]?.index ?? lines.length;
    let start = entry.index;
    if (start > 0) {
      const previous = lines[start - 1];
      if (!purchaseLineRowNumber(previous) && !isPurchaseTableHeaderLine(previous) && !isPurchaseFooterLine(previous)) {
        start -= 1;
      }
    }
    let end = nextStart;
    if (nextStart < lines.length) {
      const previousToNext = lines[nextStart - 1];
      if (previousToNext && !purchaseLineRowNumber(previousToNext) && !isPurchaseTableHeaderLine(previousToNext) && !isPurchaseFooterLine(previousToNext)) {
        end = nextStart - 1;
      }
    }
    while (end > start && isPurchaseFooterLine(lines[end - 1])) end -= 1;
    const rowLines = lines.slice(start, Math.max(start + 1, end));
    const index = entry.rowNumber;
    const code = purchasePdfCellText(rowLines, 70, 140);
    const name = purchasePdfCellText(rowLines, 140, 255);
    const spec = purchasePdfCellText(rowLines, 255, 335);
    const quantity = purchasePdfCellText(rowLines, 335, 370).match(/[1-9]\d*/)?.[0] || "";
    const price = purchasePdfCellText(rowLines, 370, 440);
    const amount = purchasePdfCellText(rowLines, 490, 570);
    if (!index || (!code && !name && !spec)) return;
    rows.push({
      index,
      code: sanitizePurchaseRowField(code),
      name: sanitizePurchaseRowField(name),
      spec: sanitizePurchaseRowField(spec),
      quantity: sanitizePurchaseRowField(quantity),
      price: sanitizePurchaseRowField(price),
      amount: sanitizePurchaseRowField(amount),
    });
  });

  return rows;
}

function serializePurchaseRows(rows) {
  return (rows || []).map((row) => [
    "PURCHASE_ROW:",
    `index=${row.index}`,
    `code=${row.code}`,
    `name=${row.name}`,
    `spec=${row.spec}`,
    `quantity=${row.quantity}`,
    row.price && `price=${row.price}`,
    row.amount && `amount=${row.amount}`,
  ].filter(Boolean).join("; ")).join("\n");
}

async function readPdfText(file) {
  if (!file) return "";
  const pdfLib = await loadPdfJs();
  if (!pdfLib) {
    return `Uploaded purchase PDF: ${file.name}`;
  }
  pdfLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
  const buffer = await file.arrayBuffer();
  const pdf = await pdfLib.getDocument({ data: buffer }).promise;
  const pages = [];
  const purchaseRows = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(content.items.map((item) => item.str).join(" "));
    purchaseRows.push(...purchaseRowsFromPdfItems(content.items));
  }
  const structuredRows = serializePurchaseRows(purchaseRows);
  return [pages.join("\n"), structuredRows].filter(Boolean).join("\n");
}

function extractFirstMatch(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1].trim();
  }
  return "";
}

function isPackagingDimensionContext(text, index = 0) {
  const source = String(text || "");
  const nearby = source.slice(Math.max(0, index - 80), Math.min(source.length, index + 40));
  return /productPackInfo|pieceWeightScale|商品件重尺|包装(?:尺寸|规格|长|宽|高|重量)|外箱|箱规|物流|package(?:d|\s+dimensions?|\s+length|\s+width|\s+height|\s+weight)|shipping\s+(?:size|dimensions?|weight)|carton/i.test(nearby);
}

function extractFirstNonPackagingMatch(text, patterns) {
  const source = String(text || "");
  for (const pattern of patterns) {
    const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
    const matcher = new RegExp(pattern.source, flags);
    for (const match of source.matchAll(matcher)) {
      if (!match?.[1] || isPackagingDimensionContext(source, match.index || 0)) continue;
      return match[1].trim();
    }
  }
  return "";
}

function explicitProductSpecificationDimensions(text) {
  const source = String(text || "");
  const pattern = /(?:产\s*品\s*规\s*格|规\s*格|产\s*品\s*尺\s*寸|尺\s*寸|product\s*(?:size|dimensions?)|dimensions?)\s*[:：]?\s*([0-9]+(?:\.[0-9]+)?)\s*[x×*]\s*([0-9]+(?:\.[0-9]+)?)(?:\s*[x×*]\s*([0-9]+(?:\.[0-9]+)?))?\s*[（(]?\s*(mm|cm|in|m|ft|yd|毫米|厘米|公分|英寸|米)\s*[）)]?/gi;
  for (const match of source.matchAll(pattern)) {
    if (isPackagingDimensionContext(source, match.index || 0)) continue;
    const unit = normalizeDimensionUnit(match[4]);
    const values = [match[1], match[2], match[3]].filter(Boolean);
    if (values.length < 2 || !unit) continue;
    return [
      `Length: ${normalizeDimensionUnit(`${values[0]} ${unit}`)}`,
      `Width: ${normalizeDimensionUnit(`${values[1]} ${unit}`)}`,
      values[2] ? `Thickness: ${normalizeDimensionUnit(`${values[2]} ${unit}`)}` : "",
    ].filter(Boolean);
  }
  return [];
}

function extractDimensions(text) {
  const explicitDimensions = explicitProductSpecificationDimensions(text);
  const wallMountedDimensions = extractWallMountedDimensions(text);
  const dimensions = [...explicitDimensions, ...wallMountedDimensions];
  const sizePatterns = [
    /(?:Expanded Length|Top Width|top width|顶部宽度|上宽|Length|length|长(?:度)?|直径|Diameter|diameter)[:：]?\s*([0-9.]+\s*(?:cm|mm|in|m|ft|feet|foot|yd|厘米|公分|毫米|米|英寸|英尺|码)(?:\s*\/\s*[0-9.]+\s*(?:cm|mm|in|m|ft|feet|foot|yd|厘米|公分|毫米|米|英寸|英尺|码))?)/i,
    /(?:Expanded Width|Side Length|side length|Width|width|宽(?:度)?|高度|侧边)[:：]?\s*([0-9.]+\s*(?:cm|mm|in|m|ft|feet|foot|yd|厘米|公分|毫米|米|英寸|英尺|码)(?:\s*\/\s*[0-9.]+\s*(?:cm|mm|in|m|ft|feet|foot|yd|厘米|公分|毫米|米|英寸|英尺|码))?)/i,
    /(?:Thickness|thickness|厚(?:度)?|Bottom Width|bottom width|Height|height|高(?:度)?|底部宽度|底宽)[:：]?\s*([0-9.]+\s*(?:cm|mm|in|m|ft|feet|foot|yd|um|μm|厘米|公分|毫米|米|英寸|英尺|码|微米))/i,
    /(?:Weight|weight|单片重量|克重|重量|净重|约重)[:：]?\s*([0-9.]+\s*(?:g\/sheet|g|kg|lb|lbs|oz|克\/片|克|千克|磅))/i,
    /(?:Capacity|capacity|Volume|volume|容量|容积)[:：]?\s*([0-9.]+\s*(?:ml|mL|l|L|oz|毫升|升))/i,
  ];
  const labels = ["Length", "Width", "Thickness", "Weight", "Capacity"];
  sizePatterns.forEach((pattern, index) => {
    if (index < 3 && explicitDimensions.length) return;
    if (index < 3 && wallMountedDimensions.length) return;
    const value = normalizeDimensionUnit(extractFirstNonPackagingMatch(text, [pattern]));
    if (value && !dimensions.some((item) => item.toLowerCase().startsWith(`${labels[index].toLowerCase()}:`))) {
      dimensions.push(`${labels[index]}: ${value}`);
    }
  });
  const directionalWidthLength = String(text || "").match(
    /([0-9.]+\s*(?:cm|mm|in|m|ft|feet|foot|yd|厘米|公分|毫米|米|英寸|英尺|码))\s*(?:宽|width)\s*[x×*]?\s*([0-9.]+\s*(?:cm|mm|in|m|ft|feet|foot|yd|厘米|公分|毫米|米|英寸|英尺|码))\s*(?:长|length)/i
  );
  if (directionalWidthLength) {
    const width = normalizeDimensionUnit(directionalWidthLength[1]);
    const length = normalizeDimensionUnit(directionalWidthLength[2]);
    if (width) dimensions.push(`Width: ${width}`);
    if (length) dimensions.push(`Length: ${length}`);
  }
  const composite = normalizeDimensionUnit(extractFirstNonPackagingMatch(text, [
    /(?:尺\s*寸|规\s*格|size|dimensions?|product size)[^\d]{0,12}([0-9.]+\s*(?:cm|mm|in|m|ft|feet|foot|yd|厘米|公分|毫米|米|英寸|英尺|码)?\s*[x×*]\s*[0-9.]+\s*(?:cm|mm|in|m|ft|feet|foot|yd|厘米|公分|毫米|米|英寸|英尺|码)?(?:\s*[x×*]\s*[0-9.]+\s*(?:cm|mm|in|m|ft|feet|foot|yd|厘米|公分|毫米|米|英寸|英尺|码)?)?)/i,
  ]));
  if (composite) {
    const unit = composite.match(/\b(cm|mm|in|m|ft|feet|foot|yd)\b/i)?.[1] || "";
    const parts = composite.match(/[0-9.]+/g) || [];
    if (unit && parts[0] && !dimensions.some((item) => /^Length:/i.test(item))) dimensions.push(`Length: ${parts[0]} ${unit}`);
    if (unit && parts[1] && !dimensions.some((item) => /^Width:/i.test(item))) dimensions.push(`Width: ${parts[1]} ${unit}`);
    if (unit && parts[2] && !dimensions.some((item) => /^(?:Thickness|Height):/i.test(item))) dimensions.push(`Thickness: ${parts[2]} ${unit}`);
  }
  return uniquePromptItems(dimensions);
}

function isWallMountedProjectionContext(value) {
  return /wall[\s-]*(?:mounted\s*)?(?:hook|hanger)|suction[\s-]*(?:cup\s*)?(?:hook|hanger)|挂钩|衣钩|粘钩|吸盘钩|吸盘挂|免打孔/i.test(String(value || ""));
}

function extractWallMountedDimensions(text) {
  const source = String(text || "");
  if (!isWallMountedProjectionContext(source)) return [];
  const candidates = [
    ["Base Diameter", [
      /(?:底座|底盘|吸盘|背板|大圆)(?:外)?直径[^\d]{0,12}([0-9.]+\s*(?:cm|mm|in|厘米|公分|毫米|英寸))/i,
      /(?:base|suction\s*cup|backplate)\s*diameter[^\d]{0,12}([0-9.]+\s*(?:cm|mm|in))/i,
    ]],
    ["Front Diameter", [
      /(?:前端|旋钮|挂钩|小圆)(?:外)?直径[^\d]{0,12}([0-9.]+\s*(?:cm|mm|in|厘米|公分|毫米|英寸))/i,
      /(?:front|knob|hook)\s*diameter[^\d]{0,12}([0-9.]+\s*(?:cm|mm|in))/i,
    ]],
    ["Projection Depth", [
      /(?:总\s*出\s*墙(?:高\s*度)?|出\s*墙(?:高\s*度|深\s*度|距\s*离)?|离\s*墙(?:距\s*离)?|安\s*装\s*后(?:总)?高\s*度)[^\d]{0,12}([0-9.]+\s*(?:cm|mm|in|厘米|公分|毫米|英寸))/i,
      /(?:overall\s*)?(?:wall\s*)?(?:projection|projection\s*depth|distance\s*from\s*wall)[^\d]{0,12}([0-9.]+\s*(?:cm|mm|in))/i,
    ]],
  ];
  return candidates.flatMap(([label, patterns]) => {
    const value = normalizeDimensionUnit(extractFirstNonPackagingMatch(source, patterns));
    return value ? [`${label}: ${value}`] : [];
  });
}

function isRollDimensionContext(value) {
  return /adhesive[\s-]*tapes?|warning tape|caution tape|glow tape|grip tape|overgrip|handle wrap|胶带|手胶|吸汗带|龙骨胶|防滑带|roll form|tape roll/i.test(String(value || ""));
}

function semanticDimensionItems(items, context = "") {
  return uniquePromptItems(items || []);
}

function normalizeDimensionUnit(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/\b(inches?|inch)\b/gi, " in")
    .replace(/\b(pounds?|pound)\b/gi, " lb")
    .replace(/\b(feet|foot)\b/gi, " ft")
    .replace(/厘米|公分/gi, " cm")
    .replace(/毫米/gi, " mm")
    .replace(/英寸/gi, " in")
    .replace(/英尺/gi, " ft")
    .replace(/微米|μm/gi, " um")
    .replace(/米/gi, " m")
    .replace(/码/gi, " yd")
    .replace(/千克/gi, " kg")
    .replace(/克/gi, " g")
    .replace(/毫升/gi, " ml")
    .replace(/升/gi, " L")
    .replace(/磅/gi, " lb")
    .replace(/\s*(cm|mm|in|m|ft|feet|foot|yd|um|g|kg|lb|lbs|ml|mL|L|oz)\b/gi, " $1")
    .trim();
}

function inferProductName(text) {
  const visionName = extractFirstMatch(text, [/DOUBAO_VISION_PRODUCT_NAME:\s*([^\n]+)/i]);
  if (visionName && !isMachineProductText(visionName)) return cleanFieldDisplayValue(visionName);
  const supplierTitle = extractFirstMatch(text, [/PRODUCT_TITLE:\s*([^\n]+)/i]);
  if (supplierTitle && !isMachineProductText(supplierTitle)) return translateProductTitleWords(supplierTitle) || supplierTitle;
  const rawSpecName = readableNameFromRawSpec(extractFirstMatch(text, [/rawSpec\s*=\s*([^;\n|]+)/i, /SKU_OPTION\s*[:;]+([^\n]+)/i]));
  if (rawSpecName) return rawSpecName;
  const explicit = extractFirstMatch(text, [
    /(?:Product Name|产品名称|品名|商品名称)[:：]\s*([^。；;.\n|]{2,80})/i,
  ]);
  const translatedExplicit = translateProductTitleWords(explicit);
  if (translatedExplicit) return translatedExplicit;
  const purchaseRowName = purchaseRowFieldValue(String(text || "").match(/PURCHASE_ROW\s*:\s*([^\n]+)/i)?.[1] || "", "name");
  const translatedPurchaseName = translateProductTitleWords(purchaseRowName);
  if (translatedPurchaseName) return translatedPurchaseName;
  return "";
}

function inferUseScene(text) {
  const source = String(text || "");
  const explicit = [];
  [
    /DOUBAO_VISION_USE_SCENE:\s*([^\n]+)/gi,
    /(?:Use Scene|Usage Scenario|Use Occasion|Occasion|Recommended Uses? For Product|Scene|场景|使用场景|适用场景|用途场景)[:：]\s*([^\n。；;|]{2,120})/gi,
    /(?:适用于|适合用于|可用于)\s*([^\n。；;|]{2,80})/gi,
  ].forEach((pattern) => {
    Array.from(source.matchAll(pattern)).forEach((match) => {
      const clean = cleanFieldDisplayValue(match[1])
        .replace(/\s*DOUBAO_VISION_[A-Z_]+\s*:.*$/i, "")
        .replace(/\s*PRODUCT_ATTRIBUTE\s*:.*$/i, "")
        .trim();
      if (clean && !/^\d+$/.test(clean)) explicit.push(clean);
    });
  });
  return uniquePromptItems(explicit).slice(0, 4).join(" / ");
}

function inferInstallationSteps(text) {
  const source = String(text || "");
  const explicit = cleanFieldDisplayValue(extractFirstMatch(source, [
    /(?:DOUBAO_VISION_ATTRIBUTE|PRODUCT_ATTRIBUTE):\s*InstallationSteps\s*=\s*([^\n]+)/i,
  ]));
  if (explicit) return explicit;
  const hasInstructionEvidence = /安装(?:步骤|方法|完成)|简单\s*4\s*步|擦拭干净|撕开?吸盘背膜|顺时针旋转|installation steps?|how to install/i.test(source);
  if (!hasInstructionEvidence) return "";
  const steps = [];
  if (/擦拭(?:墙面)?干净|清洁(?:并擦干)?墙面|clean(?: and dry)? (?:the )?(?:wall|surface)/i.test(source)) steps.push("Clean and dry the wall");
  if (/(?:撕开?吸盘背膜|撕掉?背膜|揭开?保护膜)/i.test(source) || /(?:remove|peel)[^\n]{0,30}(?:film|backing)/i.test(source)) steps.push("Peel off the suction backing film");
  if (/顺时针旋转|旋转吸附|旋转锁紧|clockwise|twist[-\s]?(?:to[-\s]?)?lock|rotate/i.test(source)) steps.push("Press flat and twist clockwise to lock");
  if (/安装完成|完成安装|installation complete|ready to use/i.test(source)) steps.push("Confirm the hook is securely installed");
  return steps.length >= 2 ? steps.slice(0, 4).join(" > ") : "";
}

function verifiedVisionSellingPointCandidates(text) {
  return uniqueSellingPoints(
    Array.from(String(text || "").matchAll(/DOUBAO_VISION_SELLING_POINT:\s*([^\n]+)/gi))
      .map((match) => cleanFieldDisplayValue(match[1]))
      .filter(Boolean),
    6,
  );
}

function verifiedSellingPointsFromSource(text, limit = 2) {
  const points = uniqueSellingPoints(
    verifiedVisionSellingPointCandidates(text),
    Math.max(limit, 8),
  ).slice(0, limit);
  return {
    feature1: points[0] || "",
    feature2: points[1] || "",
    points,
  };
}

function normalizeSkuText(text) {
  return String(text)
    .replace(/亚马逊定制/g, " ")
    .replace(/盒装/g, " box ")
    .replace(/片\/盒|片每包|片包|片/g, " pcs ")
    .replace(/扇形\s*U?\s*02/gi, " fan 02 ")
    .replace(/扇形\s*04/gi, " fan 04 ")
    .replace(/V形\s*02|V02|V 02/gi, " V02 ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizePackageCount(value) {
  const count = String(value).match(/100|200/)?.[0];
  return count ? `${count} pcs box` : "";
}

function productSpecForToken(token) {
  const normalized = token.toLowerCase();
  if (normalized.includes("v02")) {
    return {
      key: "v02",
      spec: "V02 cone coffee filter",
      sizeCode: "V02",
      cupRange: "1-4 cup pour-over brewing",
      fit: "V60-02 style cone dripper",
    };
  }
  if (normalized.includes("fan 04") || normalized.includes("#04")) {
    return {
      key: "u04",
      spec: "fan-shaped 04 coffee filter",
      sizeCode: "Fan 04",
      cupRange: "8-12 cup drip coffee maker",
      fit: "#4 cone or fan-shaped drip coffee maker",
    };
  }
  return {
    key: "u02",
    spec: "fan-shaped 02 / U02 coffee filter",
    sizeCode: "Fan 02 / U02",
    cupRange: "2-6 cup drip or pour-over brewing",
    fit: "#2 fan-shaped dripper or small drip coffee maker",
  };
}

function normalizeCupRange(value) {
  const match = String(value || "").match(/([0-9]+\s*-\s*[0-9]+)\s*(cups?|人份)/i);
  if (!match) return "";
  return `${match[1].replace(/\s+/g, "")} cups`;
}

function inferCupRangeForSpec(text, item) {
  const normalized = normalizeSkuText(text);
  const candidateTokens = {
    v02: ["V02", "V 02", "V60", "V-shaped 02"],
    u02: ["fan 02", "U02", "U102", "#02"],
    u04: ["fan 04", "#04"],
  }[item.key] || [];

  for (const token of candidateTokens) {
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const patterns = [
      new RegExp(`${escaped}[\\s\\S]{0,120}?([0-9]+\\s*-\\s*[0-9]+\\s*(?:cups?|人份))`, "i"),
      new RegExp(`([0-9]+\\s*-\\s*[0-9]+\\s*(?:cups?|人份))[\\s\\S]{0,120}?${escaped}`, "i"),
    ];
    const value = normalizeCupRange(extractFirstMatch(normalized, patterns));
    if (value) return value;
  }

  return item.cupRange || "";
}

function dimensionValueByLabels(dimensionsText, labels) {
  const source = String(dimensionsText || "");
  for (const label of labels) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const value = extractFirstMatch(source, [new RegExp(`${escaped}:\\s*([^;]+)`, "i")]);
    if (value) return value;
  }
  return "";
}

function thirdDimensionLabel(context) {
  return /thickness|厚|0\.[0-9]+\s*mm|片状|sheet|band|strap|拉力带|弹力带|阻力带/i.test(String(context || "")) ? "Thickness" : "Height";
}

function supplierSkuMap(text) {
  const map = new Map();
  extractSupplierSkuOptions(text).forEach((option) => {
    if (!option.model) return;
    const modelKey = option.model.toUpperCase();
    if (!map.has(modelKey)) map.set(modelKey, []);
    map.get(modelKey).push(option);
  });
  return map;
}

function supplierAttributeMap(text) {
  const attrs = {};
  const source = String(text || "");
  for (const match of source.matchAll(/PRODUCT_ATTRIBUTE:\s*([^=\n]+)=([^\n]+)/gi)) {
    const key = match[1].trim();
    const value = translateAttributeValue(key, match[2].trim());
    if (!value) continue;
    if (!attrs[key] || shouldReplaceAttributeValue(key, attrs[key], value)) attrs[key] = value;
  }
  const productDetailText = productAttributeSourceText(
    ...Array.from(source.matchAll(/1688 image OCR text:\s*([\s\S]*?)(?=\n(?:PRODUCT_TITLE|PRODUCT_ATTRIBUTE|SKU_OPTION|Source HTML file|Purchase order image OCR text|1688 image OCR text|DOUBAO_VISION_[A-Z_]+)\s*:|$)/gi)).map((match) => match[1]),
  );
  Object.entries(extractProductDetailAttributes(productDetailText)).forEach(([key, value]) => {
    if (value && (!attrs[key] || shouldReplaceAttributeValue(key, attrs[key], value))) attrs[key] = value;
  });
  if (!productDetailText) {
    Object.entries(extractProductDetailAttributes(productAttributeSourceText(source))).forEach(([key, value]) => {
      if (value && (!attrs[key] || shouldReplaceAttributeValue(key, attrs[key], value))) attrs[key] = value;
    });
  }
  return attrs;
}

function stripInternalExtractionLines(text) {
  return String(text || "")
    .split(/\n+/)
    .filter((line) => !/^\s*(?:PRODUCT_ATTRIBUTE|SKU_OPTION|PRODUCT_TITLE|DOUBAO_VISION_[A-Z_]+|Source HTML file|Purchase order image OCR text)\s*:/i.test(line))
    .join("\n");
}

function doubaoVisionEvidenceProfile(text) {
  const source = String(text || "");
  const attributes = new Set();
  const attributeValues = {};
  for (const match of source.matchAll(/DOUBAO_VISION_ATTRIBUTE:\s*([^=\n]+)=([^\n]+)/gi)) {
    const rawField = cleanFieldDisplayValue(match[1]);
    const field = rawField.toLowerCase().replace(/[^a-z]+/g, "");
    const canonicalField = {
      detailfeatures: "DetailFeatures",
      productcount: "ProductCount",
      material: "Material",
      color: "Color",
      technology: "Technology",
      structure: "Structure",
      fit: "Fit",
      installationsteps: "InstallationSteps",
    }[field] || rawField;
    const value = cleanFieldDisplayValue(match[2]);
    if (field) attributes.add(field);
    if (canonicalField && value) attributeValues[canonicalField] = value;
  }
  const dimensions = Array.from(source.matchAll(/DOUBAO_VISION_DIMENSION:\s*([^\n]+)/gi))
    .map((match) => cleanTokenValue(match[1]))
    .filter(Boolean);
  return {
    verified: /DOUBAO_VISION_VERIFIED:\s*true/i.test(source),
    productName: /DOUBAO_VISION_PRODUCT_NAME:\s*[^\n]+/i.test(source),
    attributes: Array.from(attributes),
    attributeValues,
    dimensions,
    sellingPoints: /DOUBAO_VISION_SELLING_POINT:\s*[^\n]+/i.test(source),
    useScenes: /DOUBAO_VISION_USE_SCENE:\s*[^\n]+/i.test(source),
  };
}

function stripImageOcrBlocks(text) {
  return String(text || "")
    .replace(/\n?1688 image OCR text:\s*[\s\S]*?(?=\n(?:PRODUCT_TITLE|PRODUCT_ATTRIBUTE|SKU_OPTION|Source HTML file|Purchase order image OCR text|1688 image OCR text|DOUBAO_VISION_[A-Z_]+)\s*:|$)/gi, "\n")
    .trim();
}

function productIdentitySourceText(purchaseText, supplierText) {
  return [
    purchaseText,
    stripImageOcrBlocks(supplierText),
  ].filter(Boolean).join(" ");
}

function currentSourceFingerprint() {
  const source = [
    sourcePayload.purchase,
    sourcePayload.amazonTemplate,
    sourcePayload.supplier,
    sourcePayload.competitor,
  ].filter(Boolean).join("\n");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `source-${(hash >>> 0).toString(16)}-${source.length}`;
}

function productAttributeSourceText(...parts) {
  return parts
    .filter(Boolean)
    .join("\n")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => {
      if (!line) return false;
      if (/^\s*PRODUCT_ATTRIBUTE\s*:/i.test(line)) return true;
      if (isProductSellingPointText(line)) return true;
      if (productDetailLabelScore(line) >= 2) return true;
      if (isFactoryOrServiceImageText(line) && productDetailLabelScore(line) < 2) return false;
      if (isCommerceOrRecommendationText(line) && productDetailLabelScore(line) < 2 && productFeatureTextScore(line) < 3) return false;
      return isProductInfoImageText(line) && productFeatureTextScore(line) >= 2;
    })
    .join("\n");
}

function shouldReplaceAttributeValue(key, current, next) {
  const currentClean = cleanFieldDisplayValue(current);
  const nextClean = cleanFieldDisplayValue(next);
  if (!nextClean) return false;
  if (!currentClean) return true;
  if (/^Material$/i.test(key)) {
    const currentHasPercent = /%/.test(currentClean);
    const nextHasPercent = /%/.test(nextClean);
    if (nextHasPercent && !currentHasPercent) return true;
  }
  if (/^Weight$/i.test(key)) {
    return /^\.\s*g$/i.test(currentClean) || /[0-9]/.test(nextClean) && !/[0-9]/.test(currentClean);
  }
  return nextClean.length > currentClean.length && !currentClean.includes(nextClean);
}

function genericProductSpecForModel(model, combinedText) {
  return `${model} product`;
}

function extractProductUnitCount(text) {
  const source = String(text || "");
  const value = extractFirstMatch(source, [
    /(?:套装|组合|set|pack)[^\n。；;]{0,24}?([1-9]\d*|[一二两三四五六七八九十])\s*(?:双|pairs?|件|pcs|片|只|个)/i,
    /([1-9]\d*|[一二两三四五六七八九十])\s*(?:双|pairs?|件|pcs|片|只|个)\s*(?:装|套装|组合|set|pack)/i,
    /(?:contains?|includes?|内含|包含)[^\n。；;]{0,24}?([1-9]\d*|[一二两三四五六七八九十])\s*(?:双|pairs?|件|pcs|片|只|个)/i,
  ]);
  if (!value) return "";
  const normalizedValue = chineseCountToNumber(value) || value;
  const unit = extractFirstMatch(source, [
    new RegExp(`${value}\\s*(双|pairs?|件|pcs|片|只|个)`, "i"),
  ]) || "pcs";
  const normalizedUnit = /双|pair/i.test(unit) ? "pairs" : /片/.test(unit) ? "pcs" : /件|只|个|pcs/i.test(unit) ? "pcs" : unit;
  return `${normalizedValue} ${normalizedUnit}`;
}

function chineseCountToNumber(value) {
  const clean = String(value || "").trim();
  if (/^\d+$/.test(clean)) return "";
  const map = {
    一: 1,
    二: 2,
    两: 2,
    三: 3,
    四: 4,
    五: 5,
    六: 6,
    七: 7,
    八: 8,
    九: 9,
    十: 10,
  };
  return map[clean] ? String(map[clean]) : "";
}

function isSameColorName(left, right) {
  const leftRaw = String(left || "").trim();
  const rightRaw = String(right || "").trim();
  if (!leftRaw || !rightRaw) return false;
  return leftRaw === rightRaw || canonicalColorKey(leftRaw) === canonicalColorKey(rightRaw);
}

function selectSupplierOption(options, color, usedOptionKeys) {
  if (!options.length) return {};
  if (color) {
    const exact = options.find((option) => option.color && isSameColorName(option.color, color));
    if (exact) return exact;
  }
  const unused = options.find((option) => {
    const key = `${option.model}-${option.color || ""}-${option.size || ""}`;
    return !usedOptionKeys.has(key);
  });
  return unused || options[0] || {};
}

function addGenericPurchaseItem(items, seen, usedSupplierOptions, suppliers, combinedText, {
  model,
  color = "",
  quantity = "",
  size = "",
  price = "",
  rowKey = "",
  unitCount = "",
  allowSupplierColorFallback = false,
}) {
  if (!model) return;
  const normalizedModel = model.toUpperCase();
  const supplierOptions = suppliers.get(normalizedModel) || [];
  const exactOption = color
    ? supplierOptions.find((option) => option.color && isSameColorName(option.color, color))
    : null;
  const fallbackOption = exactOption || selectSupplierOption(supplierOptions, color, usedSupplierOptions);
  const supplierColorIsSafe = allowSupplierColorFallback || supplierOptions.length === 1;
  const finalColor = color || (supplierColorIsSafe ? fallbackOption.color : "") || "";
  const matchedOption = finalColor && fallbackOption.color && isSameColorName(fallbackOption.color, finalColor)
    ? fallbackOption
    : {};
  const finalSize = size || matchedOption.size || "";
  const optionKey = `${matchedOption.model || normalizedModel}-${matchedOption.color || ""}-${matchedOption.size || ""}`;
  const key = rowKey || (finalColor ? `${normalizedModel}-${canonicalColorKey(finalColor)}` : `${normalizedModel}-${items.length}-${quantity || ""}`);
  if (seen.has(key)) return;
  seen.add(key);
  if (matchedOption.model) usedSupplierOptions.add(optionKey);
  const rowLabel = !finalColor && /^row-\d+$/i.test(rowKey) ? `purchase ${rowKey.replace("row-", "row ")}` : "";
  const displayColor = displayColorName(finalColor, matchedOption.colorEnglish);
  const specParts = [displayColor || colorName(finalColor) || finalColor, cleanFieldDisplayValue(finalSize), rowLabel].filter(Boolean);
  items.push({
    key: normalizedModel.toLowerCase(),
    purchaseRowKey: rowKey,
    model: normalizedModel,
    color: finalColor,
    displayColor,
    colorEnglish: finalColor ? colorName(finalColor) || matchedOption.colorEnglish || "" : "",
    spec: specParts.join(" / "),
    sizeCode: specParts.join(" / "),
    pack: unitCount || "",
    productUnitCount: unitCount || "",
    quantity,
    price,
    fit: "",
    dims: matchedOption.dims || {},
    supplierOption: matchedOption,
    inferredColorFromSupplier: !color && Boolean(finalColor),
  });
}

function extractIndexedPurchaseRows(source) {
  const items = [];
  const seenRows = new Set();
  let lastModel = "";
  purchaseOptionRowSegments(source).forEach((segment) => {
    const rowNumber = extractFirstMatch(segment, [/^\s*([1-9]\d?)\s+/]);
    if (!rowNumber || seenRows.has(rowNumber)) return;
    const purchaseOption = purchaseOptionFromSegment(segment);
    const modelMatch = segment.match(/(?:^|\s)(?:[1-9]\d?\s+)?(?:阿里)?\s*([A-Z]{1,4}\d{2,5})(?:-[A-Z]{1,4}\d{2,5})?(?:\s+([A-Z]{1,4}\d{2,5}))?/i);
    const model = (modelMatch?.[2] || modelMatch?.[1] || purchaseOption.model || lastModel || "").toUpperCase();
    if (!model) return;
    lastModel = model;
    seenRows.add(rowNumber);
    items.push({
      rowKey: `row-${rowNumber}`,
      model,
      quantity: extractFirstMatch(segment, [
        /(?:^|\s)([1-9]\d*)\s+[0-9]+(?:\.[0-9]+)?\s*\/\s*[-+]?[0-9]+(?:\.[0-9]+)?/i,
        /(?:数量|Qty|Quantity)\s*[:：]?\s*([1-9]\d*)/i,
      ]),
      unitCount: extractProductUnitCount(segment),
      color: purchaseOption.color,
      size: extractPurchaseSize(segment),
      segment,
    });
  });
  return items;
}

function looseSequencePattern(value) {
  return String(value || "")
    .replace(/\s+/g, "")
    .split("")
    .map((char) => char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("\\s*");
}

function colorAliasPatterns(value) {
  return colorAliasValues(value)
    .map((alias) => String(alias).replace(/\s+/g, ""))
    .filter(Boolean)
    .map((alias) => looseSequencePattern(alias));
}

function purchaseSegmentQuantity(segment, matchedText) {
  const index = String(segment || "").indexOf(matchedText || "");
  const tail = index > -1 ? String(segment).slice(index + String(matchedText || "").length) : String(segment || "");
  return tail.match(/^\s*([1-9]\d*)\s+[0-9]+(?:\.[0-9]+)?/)?.[1] || "";
}

function extractPurchaseSize(segment) {
  return cleanFieldDisplayValue(extractFirstMatch(segment, [
    /尺码\s*[:：]\s*(one\s+size|free\s+size)(?=\s|$)/i,
    /尺码\s*[:：]\s*([^\s,，;；。]{1,16})/i,
  ]));
}

function purchaseColorWindow(segment) {
  const source = normalizeModelText(segment || "");
  const priceIndex = source.search(/\s[1-9]\d*\s+[0-9]+(?:\.[0-9]+)?\s*(?:元|\/|双|pcs|件|只|个)/i);
  const beforePrice = priceIndex > -1 ? source.slice(0, priceIndex) : source;
  const colorIndex = beforePrice.search(/颜色\s*[:：]/i);
  if (colorIndex > -1) {
    return beforePrice.slice(colorIndex, colorIndex + 180);
  }
  const rowModel = beforePrice.match(/(?:^|\s)[1-9]\d?\s+(?:阿里)?\s*[A-Z]{1,4}\d{2,5}\b/i);
  if (rowModel) {
    return beforePrice.slice(rowModel.index || 0, (rowModel.index || 0) + 220);
  }
  return beforePrice.slice(0, 220);
}

function purchaseOptionFromSegment(segment) {
  const source = purchaseColorWindow(segment || "");
  const colorText = extractFirstMatch(source, [
    /颜色\s*[:：]\s*(?:阿里)?\s*(?:[A-Z]{1,4}\d{2,5})?\s*([\u4e00-\u9fff]{1,8})/i,
    /(?:阿里)?\s*[A-Z]{1,4}\d{2,5}\s*([\u4e00-\u9fff]{1,8})/i,
  ]);
  const fallbackColor = colorFromTextSegment(source, []);
  const model = extractFirstMatch(source, [
    /颜色\s*[:：]\s*(?:阿里)?\s*([A-Z]{1,4}\d{2,5})/i,
    /(?:^|\s)(?:[1-9]\d?\s+)?(?:阿里)?\s*([A-Z]{1,4}\d{2,5})/i,
  ]);
  return {
    model,
    color: colorFromTextSegment(colorText || "", []) || fallbackColor,
  };
}

function colorFromTextSegment(segment, supplierOptions = []) {
  const aliases = [
    "白色", "本白", "本色", "本全", "米白", "乳白", "奶白", "象牙白", "白",
    "黑色", "黑",
    "粉色", "浅粉", "粉红", "肉粉", "粉",
    "蓝色", "水蓝", "淡蓝", "蓝",
    "绿色", "草绿", "豆绿", "绿",
    "紫色", "浅紫", "紫",
    "灰色", "银灰", "深灰", "灰",
    "红色", "红",
    "浅卡", "卡其",
  ];
  const direct = aliases.find((alias) => new RegExp(`(?:^|\\s|颜色\\s*[:：]|[A-Z]{1,4}\\d{2,5})${looseSequencePattern(alias)}(?:\\s|$|尺码|均码|数量|Qty|Quantity|（|\\()`, "i").test(String(segment || "")));
  if (direct) return direct;
  const matchedSupplierColor = supplierOptions.find((option) => (
    option.color && purchaseMentionsColorText(segment, option.color)
  ));
  return matchedSupplierColor?.color || "";
}

function purchaseMentionsColorText(source, color) {
  const patterns = colorAliasPatterns(color);
  if (!patterns.length) return false;
  return patterns.some((pattern) => new RegExp(pattern, "i").test(String(source || "")));
}

function bestSupplierOptionInPurchaseSegment(segment, supplierOptions) {
  const matches = [];
  supplierOptions.forEach((option) => {
    if (!option.model || !option.color) return;
    const model = String(option.model).toUpperCase();
    const prefix = model.slice(0, -1);
    const suffix = model.slice(-1);
    const modelPatterns = [
      looseSequencePattern(model),
      `${looseSequencePattern(prefix)}[\\s\\S]{0,120}${looseSequencePattern(suffix)}`,
    ];
    const pattern = new RegExp(modelPatterns.flatMap((modelPattern) => (
      colorAliasPatterns(option.color).map((colorPattern) => (
        `(?:${modelPattern}[\\s\\S]{0,180}${colorPattern}|${colorPattern}[\\s\\S]{0,180}${modelPattern})`
      ))
    )).join("|"), "i");
    const match = String(segment || "").match(pattern);
    if (match) {
      matches.push({
        option,
        text: match[0],
        index: match.index || 0,
        length: match[0].length,
      });
    }
  });
  matches.sort((left, right) => left.length - right.length || left.index - right.index);
  return matches[0] || null;
}

function purchaseOptionRowSegments(source) {
  const normalized = normalizeModelText(source || "");
  const rowPatterns = [
    /(?:^|\s)([1-9]\d?)\s+(?=(?:阿里\s*)?[A-Z]{1,4}\d{2,5}\b)/gi,
    /(?:^|\s)([1-9]\d?)\D{0,80}(?=(?:阿里\s*)?[A-Z]{1,4}\d{2,5}\s*-\s*[A-Z]{1,4}\d{2,5})/gi,
    /(?:^|\s)([1-9]\d?)\D{0,120}(?=颜色\s*[:：]\s*(?:阿里\s*)?[A-Z]{1,4}\d{2,5})/gi,
  ];
  const rowMatches = uniquePurchaseRowMatches(rowPatterns.flatMap((pattern) => Array.from(normalized.matchAll(pattern))));
  if (!rowMatches.length) return [normalized];
  return rowMatches.map((match, index) => {
    const start = match.index || 0;
    const end = rowMatches[index + 1]?.index ?? normalized.length;
    return normalized.slice(start, end);
  });
}

function uniquePurchaseRowMatches(matches) {
  return matches
    .filter((match) => match?.[1])
    .sort((left, right) => (left.index || 0) - (right.index || 0))
    .filter((match, index, sorted) => {
      const currentIndex = match.index || 0;
      const previous = sorted[index - 1];
      if (!previous) return true;
      const previousIndex = previous.index || 0;
      return match[1] !== previous[1] || Math.abs(currentIndex - previousIndex) > 12;
    });
}

function extractKnownSupplierOptionHints(source, supplierOptions) {
  const hints = [];
  const seen = new Set();
  purchaseOptionRowSegments(source).forEach((segment) => {
    const matched = bestSupplierOptionInPurchaseSegment(segment, supplierOptions);
    if (!matched?.option) return;
    const key = `${matched.option.model}-${matched.option.color}-${matched.index}`;
    if (seen.has(key)) return;
    seen.add(key);
    hints.push({
      model: matched.option.model,
      color: matched.option.color,
      size: extractFirstMatch(segment, [/尺码\s*[:：]\s*([\u4e00-\u9fffA-Za-z0-9 -]{1,20})/i]) || matched.option.size || "",
      quantity: purchaseSegmentQuantity(segment, matched.text),
      unitCount: extractProductUnitCount(segment),
      sourceIndex: matched.index || 0,
    });
  });
  return hints;
}

function purchaseSegmentForIndexedRow(source, row) {
  const rowNumber = String(row.rowKey || "").match(/\d+/)?.[0];
  if (!rowNumber) return "";
  const model = String(row.model || "").toUpperCase();
  const rowPattern = new RegExp(`(?:^|\\s)${rowNumber}\\D{0,160}${looseSequencePattern(model)}`, "i");
  const match = String(source || "").match(rowPattern);
  if (!match) return "";
  const start = Math.max(0, (match.index || 0) - 50);
  return String(source || "").slice(start, start + 280);
}

function extractIndexedRowColorHints(source, indexedRows, suppliers) {
  const hints = [];
  indexedRows.forEach((row) => {
    const supplierOptions = suppliers.get(String(row.model || "").toUpperCase()) || [];
    const segment = purchaseSegmentForIndexedRow(source, row);
    const matched = bestSupplierOptionInPurchaseSegment(segment, supplierOptions);
    if (!matched?.option) return;
    hints.push({
      rowKey: row.rowKey,
      model: matched.option.model,
      color: matched.option.color,
      size: extractPurchaseSize(segment) || matched.option.size || "",
      quantity: row.quantity || purchaseSegmentQuantity(segment, matched.text),
      unitCount: extractProductUnitCount(segment),
      sourceIndex: matched.index || 0,
    });
  });
  return hints;
}

function purchaseOcrSource(source) {
  const parts = String(source || "").split(/Purchase order image OCR text\s*:\s*/i);
  return parts.length > 1 ? parts.slice(1).join(" ") : source;
}

function extractPurchaseColorHints(source, suppliers) {
  const hints = [];
  const supplierOptions = Array.from(suppliers.values()).flat();

  const specPattern = /颜色\s*[:：]\s*([A-Z]{1,4}\d{3,5})\s*([\u4e00-\u9fff]{1,6})(?:（[^）]*）|\([^)]*\))?[\s\S]{0,50}?尺码\s*[:：]\s*([\u4e00-\u9fffA-Za-z0-9 -]{1,20}?)(?=\s|数量|$)[\s\S]{0,50}?(?:数量|Qty|Quantity)\s*[:：]?\s*([1-9]\d*)/gi;
  for (const match of source.matchAll(specPattern)) {
    hints.push({
      model: match[1],
      color: match[2],
      size: extractPurchaseSize(match[0]) || match[3],
      quantity: match[4],
      unitCount: extractProductUnitCount(match[0]),
      sourceIndex: match.index || 0,
    });
  }

  const colorSegments = String(source || "").split(/颜色\s*[:：]/i).slice(1);
  let runningIndex = 0;
  colorSegments.forEach((rawSegment) => {
    const segment = rawSegment.split(/颜色\s*[:：]/i)[0].slice(0, 240);
    const matched = bestSupplierOptionInPurchaseSegment(segment, supplierOptions);
    runningIndex += rawSegment.length;
    const fallbackColor = colorFromTextSegment(segment, supplierOptions);
    const fallbackModel = extractFirstMatch(segment, [/(?:阿里)?\s*([A-Z]{1,4}\d{2,5})/i]);
    const model = matched?.option?.model || fallbackModel;
    const color = matched?.option?.color || fallbackColor;
    if (!color) return;
    if (hints.some((hint) => Math.abs((hint.sourceIndex || 0) - runningIndex) < 3)) return;
    hints.push({
      model,
      color,
      size: extractPurchaseSize(segment) || matched?.option?.size || "",
      quantity: purchaseSegmentQuantity(segment, matched?.text || ""),
      unitCount: extractProductUnitCount(segment),
      sourceIndex: runningIndex,
    });
  });

  if (!hints.length) {
    hints.push(...extractKnownSupplierOptionHints(source, supplierOptions));
  }

  return dedupePurchaseColorHints(hints).sort((left, right) => left.sourceIndex - right.sourceIndex);
}

function dedupePurchaseColorHints(hints) {
  const seen = new Set();
  return hints.filter((hint) => {
    const key = [
      String(hint.model || "").toUpperCase(),
      canonicalColorKey(hint.color || ""),
      cleanFieldDisplayValue(hint.size || "").toLowerCase(),
    ].filter(Boolean).join("|");
    if (!key) return true;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function extractGenericPurchaseItems(purchaseText, combinedText, options = {}) {
  const source = normalizeModelText(purchaseText || "");
  if (!source) return [];
  const strictPurchaseRowsOnly = Boolean(options.strictPurchaseRowsOnly);

  const suppliers = supplierSkuMap(combinedText);
  const items = [];
  const seen = new Set();
  const usedSupplierOptions = new Set();
  const addItem = (item) => addGenericPurchaseItem(items, seen, usedSupplierOptions, suppliers, combinedText, item);
  if (!/[A-Z]{1,4}\d{3,5}/i.test(source)) {
    if (strictPurchaseRowsOnly) return [];
    addSupplierColorPurchaseItems(source, suppliers, addItem);
    return items;
  }
  const indexedRows = extractIndexedPurchaseRows(source);
  const ocrSource = purchaseOcrSource(source);
  const colorHints = extractPurchaseColorHints(ocrSource, suppliers);
  const rowHints = extractIndexedRowColorHints(ocrSource, indexedRows, suppliers);
  const usedHintIndexes = new Set();
  const hintedRows = indexedRows.map((row) => {
    let hintIndex = colorHints.findIndex((hint, index) => !usedHintIndexes.has(index) && hint.rowKey === row.rowKey);
    if (hintIndex < 0) hintIndex = colorHints.findIndex((hint, index) => !usedHintIndexes.has(index));
    const sequenceHint = hintIndex > -1 ? colorHints[hintIndex] : null;
    if (hintIndex > -1) usedHintIndexes.add(hintIndex);
    const rowHint = rowHints.find((candidate) => candidate.rowKey === row.rowKey);
    const supplierOptions = suppliers.get(String(row.model || "").toUpperCase()) || [];
    const rowColor = purchaseOptionFromSegment(row.segment).color
      || colorFromTextSegment(purchaseColorWindow(row.segment), supplierOptions);
    return {
      ...row,
      color: rowColor || sequenceHint?.color || rowHint?.color || row.color || "",
      size: sequenceHint?.size || rowHint?.size || row.size || "",
      quantity: row.quantity || sequenceHint?.quantity || rowHint?.quantity || "",
      unitCount: sequenceHint?.unitCount || rowHint?.unitCount || row.unitCount || "",
      allowSupplierColorFallback: Boolean(rowColor || sequenceHint?.color || rowHint?.color),
    };
  });
  if (hintedRows.length) {
    const usedColorKeysByModel = new Map();
    hintedRows.forEach((row) => {
      if (!row.color) return;
      const modelKey = String(row.model || "").toUpperCase();
      if (!usedColorKeysByModel.has(modelKey)) usedColorKeysByModel.set(modelKey, new Set());
      usedColorKeysByModel.get(modelKey).add(canonicalColorKey(row.color));
    });
    hintedRows.forEach((row) => {
      if (row.color) return;
      const modelKey = String(row.model || "").toUpperCase();
      const usedColors = usedColorKeysByModel.get(modelKey) || new Set();
      const unusedOptions = (suppliers.get(modelKey) || []).filter((option) => (
        option.color && !usedColors.has(canonicalColorKey(option.color))
      ));
      if (unusedOptions.length !== 1) return;
      row.color = unusedOptions[0].color;
      row.size = row.size || unusedOptions[0].size || "";
      row.allowSupplierColorFallback = true;
      usedColors.add(canonicalColorKey(row.color));
      usedColorKeysByModel.set(modelKey, usedColors);
    });
  }

  if (!strictPurchaseRowsOnly && colorHints.length > indexedRows.length) {
    colorHints.forEach((hint, index) => addItem({
      ...hint,
      model: hint.model || indexedRows[index]?.model || indexedRows[0]?.model || "",
      rowKey: hint.rowKey || `color-${index + 1}`,
      allowSupplierColorFallback: Boolean(hint.color),
    }));
    if (items.length) return items;
  }

  if (hintedRows.length && (colorHints.length || rowHints.length || hintedRows.some((row) => row.color))) {
    hintedRows.forEach((row) => addItem(row));
    if (items.length) return items;
  }

  if (indexedRows.length && /Purchase order image OCR text\s*:/i.test(source)) {
    rowHints.forEach((hint, index) => addItem({
      ...indexedRows[index],
      ...hint,
      rowKey: hint.rowKey || indexedRows[index]?.rowKey || `rowhint-${index}`,
      allowSupplierColorFallback: Boolean(hint.color),
    }));
    if (items.length) return items;
  }

  if (strictPurchaseRowsOnly) return [];

  colorHints.forEach((hint, index) => addItem({ ...hint, rowKey: `color-${index}`, allowSupplierColorFallback: true }));
  if (items.length) return items;

  addSupplierColorPurchaseItems(source, suppliers, addItem);
  if (items.length) return items;

  indexedRows.forEach((row) => {
    const supplierOptions = suppliers.get(String(row.model || "").toUpperCase()) || [];
    const rowColor = purchaseOptionFromSegment(row.segment).color
      || colorFromTextSegment(purchaseColorWindow(row.segment), supplierOptions);
    addItem({
      ...row,
      color: rowColor || row.color || "",
      allowSupplierColorFallback: Boolean(rowColor),
    });
  });
  if (items.length) return items;

  const loosePattern = /(?:^|\s)([1-9]\d?)\s+([A-Z]{1,4}\d{3,5})(?:-[A-Z]{1,4}\d{3,5})?(?:\s+([A-Z]{1,4}\d{3,5}))?(?:\s+([1-9]\d*))?/gi;
  for (const match of source.matchAll(loosePattern)) {
    addItem({
      model: match[3] || match[2],
      quantity: match[4] || "",
      unitCount: extractProductUnitCount(match[0]),
      rowKey: `loose-${match[1]}`,
    });
  }

  return items;
}

function addSupplierColorPurchaseItems(source, suppliers, addItem) {
  const supplierOptions = Array.from(suppliers.values()).flat();
  const seenColors = new Set();
  supplierOptions
    .map((option) => ({
      option,
      index: purchaseColorMentionIndex(source, option.color),
    }))
    .filter(({ option, index }) => option.model && option.color && index > -1)
    .sort((left, right) => left.index - right.index)
    .forEach(({ option }, index) => {
      const colorKey = `${option.model}-${canonicalColorKey(option.color)}-${cleanFieldDisplayValue(option.size || "").toLowerCase()}`;
      if (seenColors.has(colorKey)) return;
      seenColors.add(colorKey);
      addItem({
        model: option.model,
        color: option.color,
        size: option.size || "",
        rowKey: `supplier-color-${index + 1}`,
        allowSupplierColorFallback: true,
      });
    });
}

function purchaseColorMentionIndex(source, color) {
  const patterns = colorAliasPatterns(color);
  if (!patterns.length) return -1;
  const indexes = patterns
    .map((pattern) => String(source || "").search(new RegExp(pattern, "i")))
    .filter((index) => index > -1);
  return indexes.length ? Math.min(...indexes) : -1;
}

function purchaseRowFieldValue(rowText, field) {
  const pattern = new RegExp(`(?:^|;)\\s*${field}\\s*=\\s*([\\s\\S]*?)(?=;\\s*(?:index|code|name|spec|quantity|price|amount)\\s*=|$)`, "i");
  return cleanFieldDisplayValue(normalizePurchaseText(decodeHtmlEntities(rowText).match(pattern)?.[1] || ""));
}

function parseStructuredPurchaseRows(purchaseText) {
  const rows = [];
  const source = String(purchaseText || "");
  const pattern = /PURCHASE_ROW\s*:\s*([^\n]+)/gi;
  for (const match of source.matchAll(pattern)) {
    const rowText = match[1];
    const index = purchaseRowFieldValue(rowText, "index") || String(rows.length + 1);
    const name = purchaseRowFieldValue(rowText, "name");
    const spec = purchaseRowFieldValue(rowText, "spec");
    const code = purchaseRowFieldValue(rowText, "code");
    if (!name && !spec && !code) continue;
    rows.push({
      index,
      rowKey: `row-${index}`,
      code,
      name,
      spec,
      quantity: purchaseRowFieldValue(rowText, "quantity"),
      price: purchaseRowFieldValue(rowText, "price"),
      amount: purchaseRowFieldValue(rowText, "amount"),
      segment: [index, code, name, spec].filter(Boolean).join(" "),
      sourceIndex: match.index || rows.length,
    });
  }
  return contiguousPurchaseRows(rows);
}

function contiguousPurchaseRows(rows) {
  const numericRows = (rows || []).filter((row) => /^[1-9]\d{0,2}$/.test(String(row.index || "")));
  if (!numericRows.length) return rows;
  const kept = [];
  for (const row of rows) {
    const index = Number(row.index);
    if (!Number.isFinite(index)) {
      kept.push(row);
      continue;
    }
    if (index !== kept.filter((item) => /^[1-9]\d{0,2}$/.test(String(item.index || ""))).length + 1) {
      continue;
    }
    kept.push(row);
  }
  return kept.length ? kept : rows;
}

function stripPurchaseTotalsFromOption(value) {
  return normalizePurchaseText(value)
    .replace(/\s+\d+\s+\d+(?:\.\d+)?\s*元\s*\/?\s*(?:双|件|个|盒|把|条|只)?(?:\s+[-+]?\d+(?:\.\d+)?){0,2}\s*$/i, " ")
    .replace(/\s+\d+(?:\.\d+)?\s*元\s*\/?\s*(?:双|件|个|盒|把|条|只)?(?:\s+[-+]?\d+(?:\.\d+)?){0,2}\s*$/i, " ")
    .replace(/\s+(?:数量|单价|优惠|金额)\s*[:：]?\s*[-+]?\d+(?:\.\d+)?[\s\S]*$/i, " ")
    .replace(/\s+(?:元\s*\/?\s*(?:双|件|个|盒|把|条|只)?|¥|￥)\s*[-+]?\d*(?:\.\d+)?[\s\S]*$/i, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripModelPrefixFromOption(value) {
  return normalizePurchaseText(value)
    .replace(/\b(?!V02\b|U02\b|V60\b)[A-Z]{1,4}\d{2,5}\b/gi, " ")
    .replace(/\b[A-Z]{1,4}\d{2,5}\s+(?=[\u4e00-\u9fff])/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanPurchaseOptionText(value) {
  return stripPurchaseTotalsFromOption(value)
    .replace(/([A-Za-z])\s+([A-Za-z0-9])/g, "$1$2")
    .replace(/([0-9])\s+([A-Za-z])/g, "$1$2")
    .replace(/([0-9])\s+([0-9]{2})(?=\s*(?:片|pcs|mm|cm|克|g|寸|骨|杯|人份))/gi, "$1$2")
    .replace(/([0-9]{2})\s+([0-9])(?=\s*(?:片|pcs|mm|cm|克|g|寸|骨|杯|人份))/gi, "$1$2")
    .replace(/([0-9])\s+([0-9])(?=片|pcs|mm|cm|克|g|寸|骨|杯|人份)/gi, "$1$2")
    .replace(/颜色\s*[:：]/gi, " ")
    .replace(/尺寸\s*[:：]/gi, " ")
    .replace(/尺码\s*[:：]/gi, " ")
    .replace(/规格\s*[:：]/gi, " ")
    .replace(/亚马逊\s*定制/gi, " ")
    .replace(/货品合计[\s\S]*$/g, " ")
    .replace(/实付款[\s\S]*$/g, " ")
    .replace(/\s+\d+(?:\.\d+)?\s*元\s*运[\s\S]*$/g, " ")
    .replace(/\s+运\s*费[\s\S]*$/g, " ")
    .replace(/\s+优惠[\s\S]*$/g, " ")
    .replace(/[\[\]【】]/g, " ")
    .replace(/[：:]+/g, " ")
    .replace(/\b(?:OPP|opp)\b/g, " ")
    .replace(/\b(?:SKU|sku)\b/g, " ")
    .replace(/\b(?!V02\b|U02\b|V60\b)[A-Z]{1,4}\d{2,5}\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function compactChineseText(value) {
  return normalizePurchaseText(value).replace(/\s+/g, "").trim();
}

function normalizePurchaseSpecSpacing(value) {
  return normalizePurchaseText(value)
    .replace(/([\u4e00-\u9fff])\s+(?=[\u4e00-\u9fff])/g, "$1")
    .replace(/([A-Za-z])\s+([A-Za-z0-9])/g, "$1$2")
    .replace(/([0-9])\s+([A-Za-z])/g, "$1$2")
    .replace(/([0-9])\s+([0-9]{2})(?=\s*(?:片|pcs|mm|cm|克|g|寸|骨|杯|人份))/gi, "$1$2")
    .replace(/([0-9]{2})\s+([0-9])(?=\s*(?:片|pcs|mm|cm|克|g|寸|骨|杯|人份))/gi, "$1$2")
    .replace(/([0-9])\s+([0-9])(?=片|pcs|mm|cm|克|g|寸|骨|杯|人份)/gi, "$1$2")
    .replace(/\s+/g, " ")
    .trim();
}

function purchaseRowOptionSource(row) {
  return normalizePurchaseSpecSpacing([
    row.spec,
    row.code,
    row.name,
  ].filter(Boolean).join(" "));
}

function coffeeFilterItemFromPurchaseRow(row) {
  const optionSource = normalizeSkuText(normalizePurchaseSpecSpacing([row.spec, row.code].filter(Boolean).join(" ")));
  const source = normalizeSkuText(purchaseRowOptionSource(row));
  const compact = compactChineseText(source);
  const compactOption = compactChineseText(optionSource);
  if (/粉碗|接粉环|粉槽|portafilter|basket|dosing/i.test(source)) return null;
  const hasFilterSignal = /咖啡|滤纸|圆形|V02|V形|扇形|U02|#?0[24]/i.test(source) || /^600711\b/i.test(String(row.code || "").trim());
  if (!hasFilterSignal) return null;

  const roundSize = extractFirstMatch(optionSource, [
    /(?:^|[^0-9])([1-9]\d)\s*mm/i,
    /(?:^|[^0-9])(5[1368]|60|64|68)(?=\s*(?:10|100|片|pcs|$))/i,
  ]);
  if (/圆形|round/i.test(source) || roundSize && !/V02|V形|扇形|U02|#?0[24]/i.test(optionSource)) {
    const color = extractPurchaseRowColor(row) || "";
    return {
      key: roundSize ? `round-${roundSize}` : `round-${row.index}`,
      spec: `${color ? `${displayColorName(color)} ` : ""}round coffee filter${roundSize ? ` ${roundSize}mm` : ""}`.trim(),
      outputSpec: `${color ? `${colorName(color)} ` : ""}round coffee filter paper${roundSize ? ` ${roundSize}mm` : ""}`.trim(),
      sizeCode: [color ? displayColorName(color) : "", roundSize ? `${roundSize}mm` : ""].filter(Boolean).join(" / "),
      productName: "圆形咖啡滤纸",
      outputProductName: "round coffee filter paper",
      color,
      colorEnglish: colorName(color),
      size: roundSize ? `${roundSize}mm` : "",
      quantity: row.quantity,
      rowKey: row.rowKey,
      purchaseRowKey: row.rowKey,
      model: row.code,
      pack: extractProductUnitCount(source),
    };
  }

  const token = /V02|V形02|V\s*02/i.test(compactOption)
    ? "V02"
    : /扇形04|fan04|#04|04盒/i.test(compactOption)
      ? "fan 04"
      : /扇形U?02|fan02|U02|#02|02盒/i.test(compactOption)
        ? "fan 02"
        : "";
  if (!token) return null;
  const pack = normalizePackageCount(optionSource) || extractProductUnitCount(optionSource);
  const specInfo = productSpecForToken(token);
  return {
    ...specInfo,
    productName: "咖啡滤纸",
    outputProductName: "coffee filter paper",
    variantStyle: specInfo.sizeCode,
    outputSpec: [specInfo.spec, pack].filter(Boolean).join(" - "),
    pack,
    quantity: row.quantity,
    rowKey: row.rowKey,
    purchaseRowKey: row.rowKey,
    model: row.code,
  };
}

function extractPurchaseRowColor(row) {
  const compactSpec = compactChineseText(row.spec);
  const explicitColor = extractFirstMatch(compactSpec, [
    /颜色[:：]?(.+?)(?=尺码|尺寸|规格|数量|$)/i,
  ]);
  const englishColor = extractEnglishColorName([row.spec, row.code, row.name].filter(Boolean).join(" "));
  const sources = [
    explicitColor,
    compactSpec,
    compactChineseText(row.code),
    compactChineseText(row.name),
  ].filter(Boolean);
  const colorCandidates = productColorCandidates();
  for (const source of sources) {
    const found = colorCandidates.find((candidate) => source.includes(candidate));
    if (found) return found;
  }
  return englishColor;
}

function extractEnglishColorName(value) {
  const source = String(value || "").toLowerCase();
  const colors = [
    "black", "white", "gray", "grey", "blue", "green", "purple", "pink", "red", "yellow", "orange", "brown", "khaki", "silver",
  ];
  return colors.find((color) => new RegExp(`(?:^|[^a-z])${color}(?:[^a-z]|$)`, "i").test(source)) || "";
}

function extractPurchaseRowSize(row) {
  const source = normalizePurchaseSpecSpacing([row.spec, row.code].filter(Boolean).join(" "));
  const compactRowText = compactChineseText(`${row.name} ${row.spec}`);
  if (/伞/.test(compactRowText)) {
    const umbrellaSize = extractFirstMatch(source, [
      /([1-9]\d?)\s*(?:寸|inch|in\b)/i,
    ]);
    return umbrellaSize ? `${umbrellaSize} inch` : "";
  }
  if (/粉碗|接粉环|粉槽/.test(compactRowText)) {
    const coffeeSize = extractFirstMatch(source, [/([1-9]\d\s*mm)/i]);
    return coffeeSize ? coffeeSize.replace(/\s+/g, "") : "";
  }
  const size = extractFirstMatch(source, [
    /尺码\s*[:：]?\s*(US\s*Size\s*[0-9]+(?:\.[0-9]+)?|[0-9]+(?:\.[0-9]+)?\s*(?:码|号)?|XXL|XL|L|M|S|XS)(?=\s|$|[;；,，/])/i,
    /鞋码\s*[:：]?\s*(US\s*Size\s*[0-9]+(?:\.[0-9]+)?|[0-9]+(?:\.[0-9]+)?\s*(?:码|号)?)(?=\s|$|[;；,，/])/i,
    /(?:^|[\s;；,，/])([0-9]+(?:\.[0-9]+)?\s*(?:码|号))(?=\s|$|[;；,，/])/i,
    /尺码\s*[:：]?\s*(XXL|XL|L|M|S|XS|均码|one\s*size|free\s*size)(?=\s|$|[;；,，])/i,
    /(?:^|[-\s])((?:XXL|XL|L|M|S|XS))(?=\s|$)/i,
    /尺寸\s*[:：]?\s*([^;；,，]+?)(?=\s*(?:数量|单价|$))/i,
    /规格\s*[:：]?\s*([^;；,，]+?)(?=\s*(?:数量|单价|$))/i,
  ]);
  return cleanFieldDisplayValue(size.replace(/常\s*规\s*款/gi, "regular"));
}

function extractPurchaseRowStyle(row) {
  const source = normalizePurchaseSpecSpacing(row.spec || row.code || "");
  const compact = compactChineseText(source);
  const compactRowText = compactChineseText(`${row.name} ${row.spec}`);
  if (/粉碗|接粉环|粉槽/.test(compactRowText)) {
    const clean = cleanPurchaseOptionText(source)
      .replace(/[1-9]\d\s*mm/ig, " ")
      .replace(/银色/g, " ")
      .replace(/带\s*磁\s*吸\s*接\s*粉\s*环/g, " ")
      .replace(/磁\s*吸\s*接\s*粉\s*环/g, " ")
      .replace(/\s*[-—]?\s*\d+(?:\.\d+)?\s*元\s*运[\s\S]*$/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (/接粉环/.test(compactRowText)) return "";
    return clean || "粉碗";
  }
  const bracket = extractFirstMatch(source, [/【([^】]{1,30})】/]);
  const afterColor = cleanPurchaseOptionText(extractFirstMatch(source, [
    /颜色\s*[:：]\s*([^;；,，]+?)(?=\s*(?:尺码|尺寸|规格|数量|单价|$))/i,
  ]));
  const hasExplicitColorOrSize = /颜色\s*[:：]|尺码\s*[:：]|尺寸\s*[:：]/i.test(source);
  const cleaned = stripModelPrefixFromOption(cleanPurchaseOptionText(bracket || afterColor || source));
  const withoutColor = extractPurchaseRowColor(row)
    ? cleaned.replace(new RegExp(looseSequencePattern(extractPurchaseRowColor(row)), "i"), " ").replace(/\s+/g, " ").trim()
    : cleaned;
  const withoutGenericSize = withoutColor
    .replace(/^[;；,，\s/-]+|[;；,，\s/-]+$/g, "")
    .replace(/^(?:均码|one size|free size)$/i, "")
    .trim();
  if (withoutGenericSize !== withoutColor && !withoutGenericSize) return "";
  if (hasExplicitColorOrSize && !withoutColor) return "";
  if (hasExplicitColorOrSize && !/[\u4e00-\u9fff]/.test(withoutColor) && /^[A-Za-z0-9+/=_-]{2,24}$/i.test(withoutColor)) return "";
  if (!/[\u4e00-\u9fff]/.test(withoutColor) && /=/.test(withoutColor)) return "";
  if (/^\d+(?:\.\d+)?(?:\s*元\s*\/?\s*(?:双|件|个|盒|把|条|只)?)?$/i.test(withoutColor)) return "";
  if (/^(?:双|件|个|盒|把|条|只)$/.test(withoutColor)) return "";
  if (/^(?:均码|one size|free size)$/i.test(withoutColor)) return "";
  if (/^[SMLX]{1,3}$/i.test(withoutColor)) return "";
  if (/^[0-9]+(?:mm|cm|克|g|寸|骨)$/i.test(withoutColor)) return "";
  if (/^[-—]+$/.test(withoutColor)) return "";
  if (/生日口水巾/.test(compact)) return "生日口水巾";
  if (/扫帚/.test(compact)) return "扫帚木天蓼";
  if (/羽毛/.test(compact)) return "木天蓼羽毛款";
  if (/鱼骨/.test(compact) && /薄荷/.test(compact) && /虫瘿果/.test(compact)) return "鱼骨木天蓼 薄荷+虫瘿果";
  if (/鱼骨/.test(compact) && /薄荷/.test(compact)) return "鱼骨木天蓼 薄荷味";
  if (/鱼骨/.test(compact) && /虫瘿果/.test(compact)) return "鱼骨木天蓼 虫瘿果味";
  if (/玫瑰|薰衣草|茉莉|藏红花|乌龙茶|秘鲁圣木|桂花/.test(compact)) {
    return extractFirstMatch(compact, [/(玫瑰|薰衣草|茉莉|藏红花|乌龙茶|秘鲁圣木|桂花)/]);
  }
  return withoutColor;
}

function umbrellaStyleFromPurchaseRow(row) {
  const source = normalizePurchaseSpecSpacing([row.name, row.spec, row.code].filter(Boolean).join(" "));
  const compact = compactChineseText(source);
  const parts = [];
  const fold = extractFirstMatch(compact, [/([1-9]\d?)折伞?/]);
  const rib = extractFirstMatch(compact, [/([1-9]\d?)骨/]);
  if (/扁/.test(compact)) parts.push("flat");
  if (fold) parts.push(`${fold}-fold`);
  if (rib) parts.push(`${rib}-rib`);
  return parts.join(" ");
}

function productNameFromPurchaseRow(row) {
  const name = cleanFieldDisplayValue(normalizePurchaseText(row.name || ""));
  const compact = compactChineseText(`${row.name || ""} ${row.spec || ""} ${row.code || ""}`);
  if (/瑜伽袜|普拉提袜|五指袜|五趾袜|分趾袜/.test(compact)) return "五指瑜伽袜";
  if (/船袜|短袜|隐形袜|浅口袜/.test(compact)) return "船袜";
  if (/袜子|袜/.test(compact)) return "袜子";
  if (/口水巾|围兜|围巾/.test(compact)) return "宠物生日围兜";
  if (/铃铛项圈|猫咪项圈|宠物猫脖圈/.test(compact)) return "猫咪铃铛项圈";
  if (/木天蓼|猫玩具|鱼骨/.test(compact)) return "木天蓼猫玩具";
  if (/粉碗/.test(compact)) return "咖啡粉碗";
  if (/接粉环/.test(compact)) return "磁吸接粉环";
  if (/圆形.*滤纸|滤纸.*圆形/.test(compact)) return "圆形咖啡滤纸";
  if (/咖啡.*滤纸|滤纸/.test(compact)) return "咖啡滤纸";
  if (/瑜伽球|普拉提小球/.test(compact)) return "瑜伽球";
  if (/拉力带|拉力绳|弹力带/.test(compact)) return "弹力带";
  if (/伞/.test(compact)) return "六折伞";
  if (/线香/.test(compact)) return "线香";
  return stripSupplierModelCodes(name);
}

function crossBorderNameFromChinese(value) {
  const compact = compactChineseText(value);
  if (/五指瑜伽袜|五趾瑜伽袜|瑜伽袜|普拉提袜/.test(compact)) {
    return descriptiveYogaSockProductName(value)
      || "women's non-slip five-toe yoga pilates socks";
  }
  if (/船袜|短袜|隐形袜|浅口袜/.test(compact)) return "no-show grip socks";
  if (/袜子|袜/.test(compact)) return "socks";
  if (/宠物生日围兜/.test(compact)) return "pet birthday bandana bib";
  if (/猫咪铃铛项圈/.test(compact)) return "cat collar with bell";
  if (/木天蓼猫玩具|猫玩具/.test(compact)) return "matatabi cat toy";
  if (/咖啡粉碗/.test(compact)) return "espresso filter basket";
  if (/磁吸接粉环|接粉环/.test(compact)) return "magnetic dosing funnel";
  if (/圆形咖啡滤纸/.test(compact)) return "round coffee filter paper";
  if (/咖啡滤纸/.test(compact)) return "coffee filter paper";
  if (/瑜伽球/.test(compact)) return "pilates yoga ball";
  if (/弹力带/.test(compact)) return "resistance band";
  if (/六折伞|伞/.test(compact)) return "compact folding umbrella";
  if (/线香/.test(compact)) return "incense sticks";
  return "";
}

function genericItemFromPurchaseRow(row) {
  const productName = productNameFromPurchaseRow(row);
  const color = extractPurchaseRowColor(row);
  const size = extractPurchaseRowSize(row);
  const style = extractPurchaseRowStyle(row);
  const outputProductName = crossBorderNameFromChinese(productName);
  const outputSpec = outputVariantNameFromParts(outputProductName || productName, {
    color,
    size,
    style,
  });
  const optionParts = [
    style,
    color ? displayColorName(color) : "",
    /^(?:均码|one size|free size)$/i.test(size) ? "" : size,
  ].filter(Boolean);
  const optionText = optionParts.join(" / ");
  return {
    key: cleanFieldDisplayValue(row.code || productName || `row-${row.index}`).toLowerCase(),
    purchaseRowKey: row.rowKey,
    rowKey: row.rowKey,
    model: row.code,
    productName,
    outputProductName,
    color,
    displayColor: color ? displayColorName(color) : "",
    colorEnglish: colorName(color),
    size,
    variantStyle: style,
    spec: [productName, optionText].filter(Boolean).join(" - "),
    outputSpec,
    sizeCode: optionText,
    quantity: row.quantity,
    price: row.price,
    pack: "",
    productUnitCount: "",
    fit: "",
    };
  }

function supplierRequestFromPurchaseRow(row) {
  const context = [row.spec, row.code, row.name].filter(Boolean).join(" ");
  const color = extractPurchaseRowColor(row) || supplierSkuColor(context);
  if (!color) return null;
  return {
    color,
    style: supplierSkuStyle(context),
    size: supplierSkuSize(context) || extractPurchaseRowSize(row),
  };
}

function enrichStructuredItemsWithSupplierSkus(items, rows, supplierText) {
  if (!items.length || !/拉力带|拉力片|弹力带|阻力带|resistance\s+band|exercise\s+band/i.test(supplierText || "")) return items;
  const supplierOptions = extractSupplierSkuOptions(supplierText).filter((option) => option.model === GENERIC_SUPPLIER_SKU_MODEL);
  if (!supplierOptions.length) return items;
  return items.map((item) => {
    const row = (rows || []).find((candidate) => candidate.rowKey === item.purchaseRowKey || candidate.rowKey === item.rowKey);
    const request = supplierRequestFromPurchaseRow(row || item);
    const option = supplierOptions.find((candidate) => supplierOptionMatchesPurchaseRequest(candidate, request))
      || supplierOptions.find((candidate) => candidate.color && isSameColorName(candidate.color, item.color || request?.color));
    if (!option) return item;
    const style = option.variantStyle || request?.style || item.variantStyle || "";
    const size = option.size || request?.size || item.size || "";
    return {
      ...item,
      model: option.model,
      color: option.color || item.color,
      displayColor: displayColorName(option.color || item.color),
      colorEnglish: colorName(option.color || item.color),
      size,
      variantStyle: style,
      spec: ["弹力带", style, displayColorName(option.color || item.color), size].filter(Boolean).join(" - "),
      outputProductName: item.outputProductName || "resistance band",
      outputSpec: outputVariantNameFromParts("resistance band", {
        color: option.color || item.color,
        size,
        style: translateSupplierSkuStyle(style),
      }),
      sizeCode: [style, displayColorName(option.color || item.color), size].filter(Boolean).join(" / "),
      dims: option.dims || item.dims,
      supplierOption: option,
      fit: item.fit || "",
    };
  });
}

function outputVariantNameFromParts(baseName, { color = "", size = "", style = "" } = {}) {
  const cleanSize = /^(?:均码|one size|free size)$/i.test(size) ? "" : cleanFieldDisplayValue(size);
  const styleParts = cleanFieldDisplayValue(style)
    .split(/\s+/)
    .filter(Boolean);
  return displayVariantText([
    color ? colorName(color) : "",
    cleanSize,
    ...styleParts,
    baseName,
  ].filter(Boolean).join(" "));
}

function assignMissingRoundFilterColors(items, rows) {
  const roundItems = items.filter((item) => item && /^round-/.test(String(item.key || "")) && !item.color);
  if (roundItems.length < 2) return;
  const duplicateGroups = new Map();
  roundItems.forEach((item) => {
    const size = cleanFieldDisplayValue(item.size || "");
    if (!duplicateGroups.has(size)) duplicateGroups.set(size, []);
    duplicateGroups.get(size).push(item);
  });
  const hasLikelyNaturalAndWhiteSet = Array.from(duplicateGroups.values()).some((group) => group.length >= 2)
    || /白色|原色|本色/.test(normalizePurchaseText(rows.map((row) => `${row.name} ${row.spec}`).join(" ")));
  if (!hasLikelyNaturalAndWhiteSet) return;
  const colorCycle = ["白色", "本色"];
  const counters = new Map();
  roundItems.forEach((item) => {
    const size = cleanFieldDisplayValue(item.size || "");
    const index = counters.get(size) || 0;
    counters.set(size, index + 1);
    const color = colorCycle[index % colorCycle.length];
    item.color = color;
    item.displayColor = displayColorName(color);
    item.colorEnglish = outputColorName(color);
    item.spec = `${item.displayColor} round coffee filter ${size}`.trim();
    item.outputSpec = [item.colorEnglish, "round coffee filter paper", size].filter(Boolean).join(" ");
    item.sizeCode = [item.displayColor, size].filter(Boolean).join(" / ");
  });
}

function extractStructuredPurchaseItems(purchaseText, supplierText = "") {
  const rows = parseStructuredPurchaseRows(purchaseText);
  if (!rows.length) return [];
  const items = rows
    .map((row) => {
      const coffeeItem = coffeeFilterItemFromPurchaseRow(row);
      if (coffeeItem) return coffeeItem;
      return isLikelyStructuredPurchaseRow(row) ? genericItemFromPurchaseRow(row) : null;
    });
  assignMissingRoundFilterColors(items, rows);
  return enrichStructuredItemsWithSupplierSkus(
    items.filter((item) => item && (item.spec || item.sizeCode || item.color || item.key)),
    rows,
    supplierText,
  );
}

function isLikelyStructuredPurchaseRow(row) {
  const source = normalizePurchaseText([row.code, row.name, row.spec].filter(Boolean).join(" "));
  const withoutSettlement = stripPurchaseTotalsFromOption(source);
  if (!withoutSettlement) return false;
  if (/[A-Z]{1,4}\d{2,5}/i.test(withoutSettlement)) return true;
  if (extractPurchaseRowColor(row)) return true;
  if (/咖啡|滤纸|粉碗|接粉环|包装纸|包花纸|花束|鲜花包装|花艺|礼品包装|口水巾|围兜|项圈|木天蓼|猫玩具|瑜伽|普拉提|五指|五趾|分趾|袜|拉力|弹力|伞|线香|球/.test(withoutSettlement)) return true;
  return /[\u4e00-\u9fff]{2,}/.test(row.name || "") && !/^[A-Za-z0-9+/=_-]{2,40}$/i.test(withoutSettlement);
}

function extractPurchaseItems(purchaseText, combinedText) {
  const structuredItems = extractStructuredPurchaseItems(purchaseText, combinedText);
  if (structuredItems.length) return structuredItems;
  const supplierSkuItems = extractSupplierSkuPurchaseItems(purchaseText, combinedText);
  if (supplierSkuItems.length) return supplierSkuItems;
  const strictPurchaseRowsOnly = /Purchase order image OCR text\s*:/i.test(purchaseText || "");

  const normalized = normalizeSkuText(purchaseText || combinedText);
  const items = [];
  const seen = new Set();
  const patterns = [
    /(V02|fan 02|fan 04|#02|#04)[^\n,;，；]{0,30}?(100|200)\s*pcs/gi,
    /(100|200)\s*pcs[^\n,;，；]{0,30}?(V02|fan 02|fan 04|#02|#04)/gi,
  ];

  patterns.forEach((pattern) => {
    for (const match of normalized.matchAll(pattern)) {
      const first = match[1];
      const second = match[2];
      const token = /100|200/.test(first) ? second : first;
      const pack = normalizePackageCount(/100|200/.test(first) ? first : second);
      const specInfo = productSpecForToken(token);
      const key = `${specInfo.key}-${pack}`;
      if (!pack || seen.has(key)) continue;
      seen.add(key);
      items.push({ ...specInfo, pack });
    }
  });

  const coffeeSignals = {
    v02: /V02|V 02|V形/i.test(normalized),
    u02: /fan 02|U02|U102|#02|扇形02/i.test(normalized),
    u04: /fan 04|#04|扇形04/i.test(normalized),
  };

  const has100 = /100\s*(pcs|片)/i.test(normalized);
  const has200 = /200\s*(pcs|片)/i.test(normalized);
  const availablePacks = [has100 && "100 pcs box", has200 && "200 pcs box"].filter(Boolean);

  const appendVariant = (token, enabled) => {
    if (!enabled) return;
    const specInfo = productSpecForToken(token);
    availablePacks.forEach((pack) => {
      const key = `${specInfo.key}-${pack}`;
      if (!seen.has(key)) {
        seen.add(key);
        items.push({ ...specInfo, pack });
      }
    });
  };

  appendVariant("V02", coffeeSignals.v02);
  appendVariant("fan 02", coffeeSignals.u02);
  appendVariant("fan 04", coffeeSignals.u04);

  if (!items.length) {
    return extractGenericPurchaseItems(purchaseText, combinedText, { strictPurchaseRowsOnly });
  }

  return items;
}

function productUnitCountForItem(item, supplierText) {
  if (item.productUnitCount || item.pack) {
    return item.productUnitCount || item.pack;
  }
  if (item.purchaseRowKey && !item.pack && !item.productUnitCount) {
    return "";
  }
  const optionText = [
    item.productUnitCount,
    item.pack,
    item.spec,
    item.size,
    item.color,
    item.supplierOption?.size,
    item.supplierOption?.color,
  ].filter(Boolean).join(" ");
  return extractProductUnitCount(optionText);
}

function purchaseSupplierSkuRequests(purchaseText) {
  const source = normalizePurchaseText(purchaseText || "");
  const requests = [];
  const pattern = /颜色\s*[:：]\s*([\u4e00-\u9fffA-Za-z ]{1,20})([\s\S]*?)(?=颜色\s*[:：]|PURCHASE_ROW\s*:|$)/gi;
  for (const match of source.matchAll(pattern)) {
    const color = supplierSkuColor(match[1]);
    const context = `${match[1]} ${match[2] || ""}`;
    const style = supplierSkuStyle(context);
    const size = supplierSkuSize(context);
    if (!color) continue;
    requests.push({ color, style, size, sourceIndex: match.index || requests.length });
  }
  if (requests.length) return dedupePurchaseSupplierSkuRequests(requests);
  return dedupePurchaseSupplierSkuRequests(purchaseSupplierSkuRequestsFromColorMentions(source));
}

function purchaseSupplierSkuRequestsFromColorMentions(source) {
  const requests = [];
  const seenRanges = [];
  productColorCandidates().forEach((candidate) => {
    const pattern = new RegExp(looseSequencePattern(candidate), "gi");
    for (const match of String(source || "").matchAll(pattern)) {
      const index = match.index || 0;
      if (seenRanges.some(([start, end]) => index >= start && index <= end)) continue;
      const start = Math.max(0, index - 60);
      const end = Math.min(String(source || "").length, index + 180);
      const context = String(source || "").slice(start, end);
      const color = supplierSkuColor(candidate);
      if (!color) continue;
      requests.push({
        color,
        style: supplierSkuStyle(context),
        size: supplierSkuSize(context),
        sourceIndex: index,
      });
      seenRanges.push([index, index + match[0].length]);
    }
  });
  return requests.sort((left, right) => left.sourceIndex - right.sourceIndex);
}

function dedupePurchaseSupplierSkuRequests(requests) {
  const seen = new Set();
  return (requests || []).filter((request) => {
    const key = [
      canonicalColorKey(request.color || ""),
      cleanFieldDisplayValue(request.style || "").toLowerCase(),
      cleanFieldDisplayValue(request.size || "").toLowerCase(),
    ].join("|");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function supplierOptionMatchesPurchaseRequest(option, request) {
  if (!option?.color || !request?.color || !isSameColorName(option.color, request.color)) return false;
  const optionStyle = cleanFieldDisplayValue(option.variantStyle || option.rawSpec || "");
  const optionSize = cleanFieldDisplayValue(option.size || option.rawSpec || "").replace(/\s+/g, "");
  if (request.style && !compactChineseText(optionStyle).includes(compactChineseText(request.style))) return false;
  if (request.size && !optionSize.includes(cleanFieldDisplayValue(request.size).replace(/\s+/g, ""))) return false;
  return true;
}

function extractSupplierSkuPurchaseItems(purchaseText, combinedText) {
  const requests = purchaseSupplierSkuRequests(purchaseText);
  if (!requests.length || !/拉力带|拉力片|弹力带|阻力带|resistance\s+band|exercise\s+band/i.test(combinedText || "")) return [];
  const supplierOptions = extractSupplierSkuOptions(combinedText).filter((option) => option.model === GENERIC_SUPPLIER_SKU_MODEL);
  if (!supplierOptions.length) return [];
  return requests.map((request, index) => {
    const option = supplierOptions.find((candidate) => supplierOptionMatchesPurchaseRequest(candidate, request))
      || supplierOptions.find((candidate) => candidate.color && isSameColorName(candidate.color, request.color));
    if (!option) return null;
    return {
      key: supplierOptionIdentity(option) || `supplier-sku-${index + 1}`,
      purchaseRowKey: `supplier-request-${index + 1}`,
      rowKey: `supplier-request-${index + 1}`,
      model: option.model,
      productName: "弹力带",
      outputProductName: "resistance band",
      color: option.color,
      displayColor: displayColorName(option.color),
      colorEnglish: colorName(option.color),
      size: option.size || request.size || "",
      variantStyle: option.variantStyle || request.style || "",
      spec: ["弹力带", option.variantStyle || request.style, displayColorName(option.color), option.size || request.size].filter(Boolean).join(" - "),
      outputSpec: outputVariantNameFromParts("resistance band", {
        color: option.color,
        size: option.size || request.size || "",
        style: translateSupplierSkuStyle(option.variantStyle || request.style || ""),
      }),
      sizeCode: [option.variantStyle || request.style, displayColorName(option.color), option.size || request.size].filter(Boolean).join(" / "),
      quantity: "",
      price: "",
      pack: "",
      productUnitCount: "",
      dims: option.dims || {},
      supplierOption: option,
      fit: "",
    };
  }).filter(Boolean);
}

function translateSupplierSkuStyle(value) {
  const compact = compactChineseText(value);
  const parts = [];
  if (/常规/.test(compact)) parts.push("regular");
  if (/加长/.test(compact)) parts.push("long");
  if (/加厚/.test(compact)) parts.push("thick");
  return parts.join(" ");
}

function skuRelevantPackValue(value) {
  const clean = cleanFieldDisplayValue(value);
  if (!clean || /^[1-9]\d*$/.test(clean)) return "";
  if (!/(?:pcs|pieces?|片|pack|包|pairs?|双|件|只|个|set|套|盒|装)/i.test(clean)) return "";
  return clean;
}

function toCrossBorderProductName(productName, fallbackSpec) {
  if (!productName || productName.startsWith("[")) {
    return fallbackSpec || "";
  }
  if (/咖啡滤纸|Coffee Filters?|filter paper/i.test(productName)) {
    return fallbackSpec || "coffee paper filters";
  }
  const normalized = productName
    .replace(/[^\x00-\x7F\u4e00-\u9fff#/-]+/g, " ")
    .replace(/咖啡滤纸|滤纸|滴漏式手冲咖啡挂耳|冲咖啡挂耳/gi, "coffee filters")
    .replace(/原木浆|本色|原色/gi, "natural unbleached")
    .replace(/扇形/gi, "fan-shaped")
    .replace(/V形/gi, "cone")
    .replace(/盒装/gi, "box")
    .replace(/阿里巴巴|Amazon|Amazo/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return normalized;
}

function displayProductName(productName, context = "") {
  const combined = [productName, context].filter(Boolean).join(" ");
  const rawSpecName = readableNameFromRawSpec(combined);
  if (rawSpecName) return rawSpecName;
  return cleanProductDisplayName(productName, "");
}

function crossBorderProductName(productName, context = "") {
  const rawSpecName = readableNameFromRawSpec([productName, context].filter(Boolean).join(" "));
  if (rawSpecName) {
    const translatedRawSpecName = translateProductTitleWords(rawSpecName, context);
    if (translatedRawSpecName) return translatedRawSpecName;
    if (!/[\u3400-\u9fff]/.test(rawSpecName)) return rawSpecName;
  }
  const translated = translateProductTitleWords(productName, context);
  const translatedFromContext = translateProductTitleWords(extractFirstMatch(context, [/PRODUCT_TITLE:\s*([^\n]+)/i]), context);
  const coreTitle = compactCoreProductTitle(translated || productName, translatedFromContext || context);
  if (coreTitle) return coreTitle;
  if (translated) return translated;
  if (translatedFromContext) return translatedFromContext;
  return toCrossBorderProductName(productName, "") || stripSupplierModelCodes(cleanFieldDisplayValue(productName));
}

function englishOnlyProductName(productName, context = "") {
  const translated = cleanFieldDisplayValue(crossBorderProductName(productName, context));
  if (!translated || /[\u3400-\u9fff]/.test(translated) || !/^[\x00-\x7F]+$/.test(translated)) return "";
  return (translated.match(/[A-Za-z]+/g) || []).length >= 2 ? translated : "";
}

function crossBorderColorName(item) {
  return cleanFieldDisplayValue(item?.colorEnglish || outputColorName(item?.color || item?.displayColor || ""));
}

function compactEnglishWords(value, maxWords = 6) {
  return cleanFieldDisplayValue(value)
    .toLowerCase()
    .replace(/[^a-z0-9#/+ -]+/g, " ")
    .replace(/\b(?:women'?s|men'?s|for|and|with|the|a|an|professional|special|dedicated)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, maxWords)
    .join(" ");
}

function compactCoreProductTitle(value, source = "") {
  const text = compactEnglishWords(value, 12);
  if (!text) return "";
  const featureWords = new Set(["grip", "non", "slip", "cotton", "soft", "professional", "special", "dedicated", "solid", "color"]);
  const words = text.split(/\s+/).filter((word) => word && !featureWords.has(word));
  return uniquePromptItems(words).slice(0, 6).join(" ") || text;
}

function shortCrossBorderBaseName(productName, context = "") {
  const coreTitle = compactCoreProductTitle(productName, "");
  if (coreTitle) return coreTitle;
  return compactEnglishWords(crossBorderProductName(productName, "") || productName || "product", 6);
}

function shortCrossBorderOptionLabel(baseName, item, fallback = "product option") {
  const size = optionSizeForSkuLabel(item);
  const style = optionStyleForSkuLabel(item);
  const color = simpleColorName(item?.color || item?.displayColor || item?.colorEnglish || "");
  const pack = skuRelevantPackValue(item?.productUnitCount || item?.pack || "");
  const attributes = uniquePromptItems([
    style && !/^(?:regular|standard)$/i.test(style) ? style : "",
    color,
    /^(?:均码|one size|free size)$/i.test(size) ? "" : size,
    pack,
  ]).filter(Boolean);
  const label = [compactEnglishWords(baseName, 6), ...attributes].filter(Boolean).join("-");
  return displayVariantText(label || fallback);
}

function comparisonOptionLabel(item, fallback = "product option") {
  const size = optionSizeForSkuLabel(item);
  const style = optionStyleForSkuLabel(item);
  const color = simpleColorName(item?.color || item?.displayColor || item?.colorEnglish || "");
  const pack = skuRelevantPackValue(item?.productUnitCount || item?.pack || "");
  const parts = uniquePromptItems([
    color,
    /^(?:均码|one size|free size)$/i.test(size) ? "" : size,
    style && !/^(?:regular|standard)$/i.test(style) ? style : "",
    pack,
  ]).filter(Boolean);
  return displayVariantText(parts.join(" / ") || fallback);
}

function skuCurrentOptionText(item, fallback = "selected product option") {
  const cleanFallback = cleanOptionFallbackText(item?.outputSpec || item?.spec || item?.label, item);
  if (cleanFallback && cleanFallback !== displayVariantText(item?.outputProductName || item?.productName || "")) return cleanFallback;
  const color = crossBorderColorName(item);
  if (color) return color;
  const size = optionSizeForSkuLabel(item);
  const pack = skuRelevantPackValue(item?.productUnitCount || item?.pack || "");
  const style = optionStyleForSkuLabel(item);
  return displayVariantText([style, /^(?:均码|one size|free size)$/i.test(size) ? "" : size, pack].filter(Boolean).join(" / "))
    || cleanFallback
    || displayVariantText(fallback);
}

function cleanOptionFallbackText(value, item = {}) {
  const productName = displayVariantText(item?.outputProductName || item?.productName || "");
  let clean = displayVariantText(value);
  if (!clean || isCodeLikeValue(clean)) return "";
  clean = stripRepeatedValue(clean, productName);
  clean = stripRepeatedValue(clean, item?.productName || "");
  clean = stripRepeatedValue(clean, item?.outputProductName || "");
  clean = displayVariantText(clean);
  if (!clean) return productName;
  if (/[\u4e00-\u9fff]/.test(clean)) return productName;
  if (/(?:PURCHASE_ROW|Source HTML file|PRODUCT_ATTRIBUTE|SKU_OPTION|颜色|尺码|规格|数量|单价|金额|实付款|货品合计)/i.test(clean)) return productName;
  if (/\b\d+(?:\.\d+)?\s*(?:元|¥|￥)\b/i.test(clean)) return productName;
  if (clean.length > 48 || clean.split(/\s+/).filter(Boolean).length > 7) return productName;
  return clean;
}

function optionStyleForSkuLabel(item) {
  const style = compactEnglishWords(item?.variantStyle || "", 2);
  if (!style) return "";
  const quantity = cleanFieldDisplayValue(item?.quantity || "");
  if (/^[1-9]\d?$/.test(style) && quantity && style === quantity) return "";
  return style;
}

function optionSizeForSkuLabel(item) {
  const size = cleanFieldDisplayValue(item?.size || "");
  if (!size) return "";
  const quantity = cleanFieldDisplayValue(item?.quantity || "");
  if (/^[1-9]\d*$/.test(size) && quantity && size === quantity) return "";
  return size;
}

function crossBorderVariantName(productName, item, fallback = "Product") {
  const baseName = promptValue(productName, fallback) || fallback;
  const size = optionSizeForSkuLabel(item);
  const parts = [
    crossBorderColorName(item),
    /^(?:均码|one size)$/i.test(size) ? "" : size,
    item.productUnitCount || "",
  ].filter(Boolean);
  return displayVariantText([baseName, ...parts].filter(Boolean).join(" - "));
}

function variantAttributeParts(item, productUnitCount = "") {
  const size = optionSizeForSkuLabel(item);
  return [
    optionStyleForSkuLabel(item),
    item.displayColor || displayColorName(item.color, item.colorEnglish) || item.colorEnglish || colorName(item.color),
    /^(?:均码|one size)$/i.test(size) ? "" : size,
    productUnitCount,
  ].filter(Boolean);
}

function stripSupplierModelCodes(value) {
  return String(value || "")
    .replace(/\b(?!V02\b|U02\b|V60\b)[A-Z]{1,4}\d{2,5}\b/gi, " ")
    .replace(/\b[A-Z]{1,4}\d{2,4}\s+\d\b/gi, " ")
    .replace(/\s*-\s*-\s*/g, " - ")
    .replace(/\s+/g, " ")
    .replace(/^[\s,/-]+|[\s,/-]+$/g, "")
    .trim();
}

function displayVariantText(value) {
  const rawSpecName = readableNameFromRawSpec(value);
  if (rawSpecName) return rawSpecName;
  const source = stripSupplierModelCodes(value)
    .replace(/(?:^|[-\s/])(?:quantity|qty)\s*[:：]?\s*[1-9]\d*(?=$|[-\s/])/gi, " ")
    .replace(/(?:^|[-\s/])数量\s*[:：]?\s*[1-9]\d*(?=$|[-\s/])/gi, " ")
    .replace(/\b(?:model|colorEnglish|color|rawSpec|variantStyle|size)\s*=\s*[^;\n|/]+/gi, " ")
    .replace(/SKU_OPTION\s*[:;]+/gi, " ")
    .replace(/\s*-\s*(?=[-\s/]|$)/g, " ")
    .replace(/\s+/g, " ")
    .replace(/^[\s,/-]+|[\s,/-]+$/g, "")
    .trim();
  return isMachineProductText(source) ? "" : source;
}

function productVariantName(productName, item, fallback = "Product") {
  const baseName = promptValue(productName, fallback) || fallback;
  const parts = variantAttributeParts(item, item.productUnitCount || "");
  return displayVariantText([baseName, ...parts].filter(Boolean).join(" - "));
}

function productVariantLabel(productName, item, fallback = "Product") {
  return productVariantName(productName, item, fallback);
}

function disambiguateDuplicateLabels(items) {
  const counts = new Map();
  items.forEach((item) => {
    const key = String(item.label || "").trim().toLowerCase();
    if (!key) return;
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  const seen = new Map();
  return items.map((item) => {
    const key = String(item.label || "").trim().toLowerCase();
    if (!key || (counts.get(key) || 0) < 2) return item;
    const index = (seen.get(key) || 0) + 1;
    seen.set(key, index);
    const suffix = `style ${index}`;
    return {
      ...item,
      label: `${item.label} - ${suffix}`,
      spec: item.spec ? `${item.spec} - ${suffix}` : item.spec,
      sizeCode: [item.sizeCode, suffix].filter(Boolean).join(" / "),
    };
  });
}

function dedupeExtractedVariants(items) {
  const seen = new Set();
  return items.filter((item) => {
    const colorKey = canonicalColorKey(item.colorEnglish || item.color || item.spec || item.label || "");
    const size = cleanFieldDisplayValue(item.size || item.sizeCode || "");
    const pack = cleanFieldDisplayValue(item.pack || item.productUnitCount || "");
    const style = cleanFieldDisplayValue(item.variantStyle || item.outputSpec || item.spec || item.label || "").toLowerCase();
    const model = String(item.model || item.key || "").toUpperCase();
    const rowKey = String(item.purchaseRowKey || item.rowKey || "").trim();
    const key = [model, colorKey, size, pack, style].filter(Boolean).join("|") || rowKey;
    if (!key) return true;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizedColorVariantItems(items, purchaseText, combinedText) {
  return items;
}

function normalizeAmazonHeader(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function amazonCellText(value) {
  if (value == null) return "";
  return String(value).replace(/\s+/g, " ").trim();
}

function amazonColumnLookup(rows) {
  const labels = rows[3] || [];
  const attrs = rows[4] || [];
  const byLabel = new Map();
  const byAttr = new Map();
  labels.forEach((label, index) => {
    const key = normalizeAmazonHeader(label);
    if (key && !byLabel.has(key)) byLabel.set(key, index);
  });
  attrs.forEach((attr, index) => {
    const key = String(attr || "").trim();
    if (key && !byAttr.has(key)) byAttr.set(key, index);
  });

  const find = (...candidates) => {
    for (const candidate of candidates) {
      const labelKey = normalizeAmazonHeader(candidate);
      if (byLabel.has(labelKey)) return byLabel.get(labelKey);
      const attrMatch = Array.from(byAttr.keys()).find((attr) => attr === candidate || attr.includes(candidate));
      if (attrMatch) return byAttr.get(attrMatch);
    }
    return -1;
  };

  return { find };
}

function amazonRowValue(row, columns, ...candidates) {
  const index = columns.find(...candidates);
  return index >= 0 ? amazonCellText(row[index]) : "";
}

function workbookRows(workbook, sheetName) {
  if (!sheetName || !workbook.Sheets[sheetName]) return [];
  return window.XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1, defval: "" });
}

function amazonTemplateRowsLookValid(rows) {
  const labelRow = (rows[3] || []).map(amazonCellText);
  const attributeRow = (rows[4] || []).map(amazonCellText);
  return attributeRow.some((value) => /contribution_sku/i.test(value))
    && (labelRow.some((value) => /^SKU$/i.test(value)) || attributeRow.some((value) => /product_type|item_name/i.test(value)));
}

function findWorkbookSheetName(workbook, preferredNames, rowPredicate) {
  const sheetNames = workbook.SheetNames || [];
  const exactName = preferredNames.find((name) => sheetNames.includes(name));
  if (exactName && (!rowPredicate || rowPredicate(workbookRows(workbook, exactName)))) return exactName;
  return sheetNames.find((name) => rowPredicate?.(workbookRows(workbook, name))) || exactName || sheetNames[0];
}

function amazonTemplateSheetName(workbook) {
  return findWorkbookSheetName(workbook, ["Template", "模板"], amazonTemplateRowsLookValid);
}

function amazonBrowseSheetName(workbook) {
  return findWorkbookSheetName(workbook, ["Browse Data", "浏览数据"], (rows) => {
    const firstRows = rows.slice(0, 6).map((row) => row.map(amazonCellText).join(" ")).join(" ");
    return /Browse\s+Node/i.test(firstRows) && /Browse\s+Path/i.test(firstRows);
  });
}

function parseAmazonSkuFilter(value) {
  const source = String(value || "").trim();
  if (!source) return null;
  const rowNumbers = new Set();
  const skuValues = new Set();
  source
    .split(/[\s,，;；]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .forEach((item) => {
      const range = item.match(/^([1-9]\d*)\s*[-~]\s*([1-9]\d*)$/);
      if (range) {
        const start = Number(range[1]);
        const end = Number(range[2]);
        const min = Math.min(start, end);
        const max = Math.max(start, end);
        for (let rowNumber = min; rowNumber <= max; rowNumber += 1) rowNumbers.add(rowNumber);
        return;
      }
      if (/^[1-9]\d*$/.test(item)) {
        rowNumbers.add(Number(item));
        return;
      }
      skuValues.add(item.toLowerCase());
    });
  return {
    raw: source,
    rowNumbers,
    skuValues,
    hasFilter: rowNumbers.size > 0 || skuValues.size > 0,
  };
}

function amazonRowMatchesFilter(rowInfo, columns, filter) {
  if (!filter?.hasFilter) return true;
  const sku = amazonRowValue(rowInfo.row, columns, "SKU", "contribution_sku").toLowerCase();
  return filter.rowNumbers.has(rowInfo.excelRowNumber) || filter.skuValues.has(sku);
}

function amazonBulletPoints(row, columns) {
  const points = [];
  for (let index = 1; index <= 5; index += 1) {
    const attrValue = amazonRowValue(row, columns, `bullet_point[marketplace_id=ATVPDKIKX0DER][language_tag=en_US]#${index}.value`);
    if (attrValue && !points.includes(attrValue)) points.push(attrValue);
  }
  if (!points.length) {
    const fallback = amazonRowValue(row, columns, "Bullet Point", "bullet_point");
    if (fallback) points.push(fallback);
  }
  return points;
}

function amazonRepeatedRowValues(row, columns, attributeBase, fallbackLabel, limit = 5) {
  const values = [];
  for (let index = 1; index <= limit; index += 1) {
    const attrValue = amazonRowValue(row, columns, `${attributeBase}#${index}.value`);
    if (attrValue && !values.includes(attrValue)) values.push(attrValue);
  }
  if (!values.length && fallbackLabel) {
    const fallback = amazonRowValue(row, columns, fallbackLabel, attributeBase);
    if (fallback) values.push(fallback);
  }
  return values;
}

function amazonListingUseSceneText({ title = "", description = "", bullets = [], keywords = [], occasions = [], compatibleUses = [], category = "" } = {}) {
  return uniquePromptItems([
    ...occasions,
    ...compatibleUses,
    inferUseScene([title, description, bullets.join(" "), keywords.join(" "), category].filter(Boolean).join(" ")),
  ].map((value) => cleanFieldDisplayValue(value))).slice(0, 4).join(" / ");
}

function amazonListingCompatibleUseText({ title = "", description = "", bullets = [], keywords = [], occasions = [], compatibleUses = [], category = "" } = {}) {
  return uniquePromptItems([
    ...compatibleUses,
    extractFirstMatch([title, description, bullets.join(" "), keywords.join(" "), category].filter(Boolean).join(" "), [
      /(?:compatible with|fits?|for use with|适配|适用于)[:：]?\s*([^\n。；;|]{2,100})/i,
    ]),
  ].map((value) => cleanFieldDisplayValue(value))).slice(0, 3).join(" / ");
}

function amazonListingStructureText({ text = "", material = "", style = "", itemShape = "", itemForm = "", paperFinish = "", designName = "", height = "", heelType = "" } = {}) {
  const isThong = isThongFlipFlopText(text);
  return compactPromptItems([
    isThong ? "thong flip-flop construction with one Y-shaped strap, central toe post, visible front slit/open hole, exposed footbed texture, open heel with no back strap" : "",
    !isThong && /backstrap/i.test(text) ? "backstrap closure" : "",
    itemShape && `${itemShape} shape`,
    itemForm && `${itemForm} form`,
    style && `${style} style`,
    designName && `${designName} design`,
    paperFinish && `${paperFinish} finish`,
    material && `${material} material`,
    height && `${height} profile`,
    heelType && `${heelType} heel`,
  ], "", 6);
}

function amazonListingPackText(text, row, columns) {
  const count = extractFirstMatch(text, [
    /\b([1-9]\d*\s*(?:sheets?|pcs|pieces?|count|counts|rolls?|packs?|sets?))\b/i,
    /\b(pack\s+of\s+[1-9]\d*)\b/i,
  ]);
  if (count) return count;
  const itemPackageQuantity = amazonRowValue(row, columns, "Item Package Quantity", "item_package_quantity[marketplace_id=ATVPDKIKX0DER]#1.value");
  const numberOfItems = amazonRowValue(row, columns, "Number of Items", "number_of_items[marketplace_id=ATVPDKIKX0DER]#1.value");
  return [itemPackageQuantity, numberOfItems]
    .map((value) => cleanFieldDisplayValue(value))
    .find((value) => value && !/^1$/.test(value)) || "";
}

function amazonTitleUnitQuantity(title) {
  const source = String(title || "");
  const direct = source.match(/(?:^|[^a-z0-9])([2-9]\d*)\s*[-_x×]?\s*(packs?|sets?|pieces?|pcs?|counts?|units?)(?=$|[^a-z])/i);
  const reverse = source.match(/(?:^|[^a-z0-9])(pack|set)\s+of\s+([2-9]\d*)(?=$|[^a-z0-9])/i);
  const count = Number(direct?.[1] || reverse?.[2] || 0);
  const rawUnit = String(direct?.[2] || reverse?.[1] || "").toLowerCase();
  if (!Number.isInteger(count) || count < 2 || count > 999 || !rawUnit) return null;
  const unit = rawUnit.replace(/s$/, "");
  const label = unit === "pack"
    ? `${count}-Pack`
    : unit === "set"
      ? `${count}-Set`
      : unit === "count"
        ? `${count}-Count`
        : `${count} Pieces`;
  return { count, label };
}

// A listing can truthfully say "60 Count" while selling four refill rolls
// containing 15 bags each.  These are different physical levels: 60 bags is
// not 60 rolls or 60 separate sale units.  Keep this composition as a
// structured fact instead of letting the generic title-count parser flatten it.
function amazonRefillRollComposition(...values) {
  const source = values.flat().filter(Boolean).join(" ");
  if (!/(?:poop\s*bags?|pet\s*waste\s*bags?|bag\s*refills?)/i.test(source)) return "";
  const rolls = Number.parseInt(extractFirstMatch(source, [
    /(?:includes?|with|contains?)?\s*(\d+)\s+(?:scented\s+)?(?:poop\s*bag\s*)?refill\s*rolls?/i,
    /(?:^|[^a-z0-9])(\d+)\s+(?:bag\s*)?rolls?(?=$|[^a-z])/i,
  ]), 10);
  const bagsPerRoll = Number.parseInt(extractFirstMatch(source, [
    /(\d+)\s+(?:poop\s*)?bags?\s+per\s+roll/i,
  ]), 10);
  const statedTotal = Number.parseInt(extractFirstMatch(source, [
    /(?:for|=|total(?:ing)?|includes?)\s*(\d+)\s*(?:count|bags?)(?:\s+total)?/i,
    /(\d+)\s*(?:count|bags?)\s+total/i,
  ]), 10);
  if (!Number.isInteger(rolls) || rolls < 2 || !Number.isInteger(bagsPerRoll) || bagsPerRoll < 1) return "";
  const total = Number.isInteger(statedTotal) && statedTotal > 0 ? statedTotal : rolls * bagsPerRoll;
  if (total !== rolls * bagsPerRoll) return "";
  return `${rolls} separate refill rolls, ${bagsPerRoll} bags per roll, ${total} bags total`;
}

function amazonMeasurementText(row, columns, valueCandidates, unitCandidates) {
  const value = amazonRowValue(row, columns, ...valueCandidates);
  if (!value) return "";
  const unit = amazonRowValue(row, columns, ...unitCandidates);
  return normalizeDimensionUnit(`${value}${unit ? ` ${unit}` : ""}`);
}

// The child SKU title is the product-specific Amazon record. When it gives an
// explicit size (for example "13 by 8.66 in"), that current-SKU value wins
// over generic spreadsheet Item Length/Width cells, which can be parcel
// defaults copied across child rows.
function amazonTitleDimensionList(text = "") {
  const source = String(text || "");
  const match = source.match(/\b([0-9]+(?:\.[0-9]+)?)\s*(?:by|x|×)\s*([0-9]+(?:\.[0-9]+)?)\s*(?:in|inch|inches)\b/i);
  if (!match) return "";
  return `[VERIFIED_DIMENSIONS: SKU Dimension 1: ${match[1]} in; SKU Dimension 2: ${match[2]} in]`;
}

function amazonListingDimensionListText(row, columns, context = "", title = "") {
  const titleDimensions = amazonTitleDimensionList(title);
  if (titleDimensions) return titleDimensions;
  // Spreadsheet item dimensions are often parcel/package values in Amazon
  // flat files. Product measurement fields are filled later from supplier
  // detail images/OCR/Doubao vision evidence instead.
  return "";
}

function amazonFactsWithFallback(primary, fallback) {
  const merged = { ...fallback };
  Object.entries(primary || {}).forEach(([key, value]) => {
    const hasValue = Array.isArray(value)
      ? value.length
      : typeof value === "number"
        ? value > 0
        : cleanFieldDisplayValue(value);
    if (hasValue) merged[key] = value;
  });
  return merged;
}

function amazonVariantAttributes(row, columns, theme) {
  const themeParts = String(theme || "")
    .split("/")
    .map((item) => item.trim().toUpperCase())
    .filter(Boolean);
  const attrs = {
    // Color is a product-truth attribute even when the variation theme is
    // NUMBER_OF_ITEMS, SIZE, or another non-color dimension.
    color: amazonRowValue(row, columns, "Color", "color[marketplace_id=ATVPDKIKX0DER][language_tag=en_US]#1.value"),
    colorMap: amazonRowValue(row, columns, "Color Map", "color[marketplace_id=ATVPDKIKX0DER][language_tag=en_US]#1.standardized_values#1"),
  };
  if (!themeParts.length || themeParts.includes("SIZE")) {
    attrs.size = amazonRowValue(
      row,
      columns,
      "Size",
      "Size Name",
      "尺码",
      "尺寸",
      "size[marketplace_id=ATVPDKIKX0DER][language_tag=en_US]#1.value",
      "size_name[marketplace_id=ATVPDKIKX0DER][language_tag=en_US]#1.value",
      "size_name",
    ) || amazonRowValue(
      row,
      columns,
      "Footwear Size",
      "鞋码",
      "footwear_size[marketplace_id=ATVPDKIKX0DER]#1.size",
      "footwear_size",
    );
  }
  if (themeParts.includes("NUMBER_OF_ITEMS")) {
    attrs.numberOfItems = amazonRowValue(row, columns, "Number Of Items", "number_of_items");
  }
  if (themeParts.includes("TEAM_NAME")) {
    attrs.teamName = amazonRowValue(row, columns, "Team Name", "team_name");
  }
  return attrs;
}

function extractAmazonVariantSizeFromText(...values) {
  const text = values.map(amazonCellText).filter(Boolean).join(" ");
  return extractFirstMatch(text, [
    /\b(US\s*Size\s*[0-9]+(?:\.[0-9]+)?(?:\s*(?:-|–|~|to)\s*[0-9]+(?:\.[0-9]+)?)?)\b/i,
    /\b(?:Size|Sz)\s*[:#-]?\s*([0-9]+(?:\.[0-9]+)?(?:\s*(?:-|–|~|to)\s*[0-9]+(?:\.[0-9]+)?)?)\b/i,
    /(?:^|[-_\s])([0-9]{1,2}(?:\.[0-9]+)?)(?:[-_\s]?[A-Z])?$/i,
  ]).replace(/^US\s*Size/i, "US Size").replace(/^([0-9])/, "US Size $1");
}

function compactAmazonTitle(value) {
  const clean = cleanFieldDisplayValue(value);
  if (!clean) return "";
  const firstClause = clean.split(/\s*,\s*/)[0] || clean;
  return compactEnglishWords(firstClause, 8) || clean;
}

function amazonTitleContainsFieldMetadata(value) {
  return /\b(?:product\s+attribute|attribute\s+function|product\s+function)\b/i.test(String(value || ""));
}

function amazonListingBaseProductName(listing = {}) {
  const titleName = compactAmazonTitle(listing.title || "");
  if (titleName && !amazonTitleContainsFieldMetadata(titleName)) return titleName;

  const productTypeName = compactEnglishWords(
    String(listing.readableProductType || listing.productType || "").replace(/[_-]+/g, " "),
    6,
  );
  if (productTypeName) return productTypeName;

  const itemTypeName = compactEnglishWords(
    String(listing.englishCategory || "").replace(/[_-]+/g, " "),
    6,
  );
  if (itemTypeName) return itemTypeName;

  return compactEnglishWords(
    titleName.replace(/\b(?:product\s+attribute|attribute\s+function|product\s+function)\b[\s\S]*$/i, " "),
    6,
  );
}

function englishAmazonValue(value) {
  const clean = cleanFieldDisplayValue(value);
  if (!clean || /[\u4e00-\u9fff]/.test(clean)) return "";
  return clean;
}

function isThongFlipFlopText(value) {
  return /thong|toe\s*post|y[-\s]?strap|y\s*shaped|人字拖|夹脚|夹趾/i.test(String(value || ""));
}

function thongFlipFlopStructureLockText() {
  return "Thong flip-flop anatomy lock: exactly one Y-shaped thong strap splitting from one central toe post into two side anchors; visible front toe-post slit/open hole and negative space around the post; footbed texture visible between/inside the Y straps; open heel; no sealed triangular vamp, no closed/filled front, no heel/back/ankle strap, no second parallel strap, no wide slide band.";
}

function thongFlipFlopShortLockText() {
  return "Keep thong anatomy: Y strap, central toe post, visible front slit/open hole, exposed footbed, open heel.";
}

function amazonSharedFacts(row, columns, browsePath = "") {
  const bullets = amazonBulletPoints(row, columns);
  const title = amazonRowValue(row, columns, "Item Name", "item_name");
  const description = amazonRowValue(row, columns, "Product Description", "product_description");
  const keywords = amazonRepeatedRowValues(row, columns, "generic_keyword[marketplace_id=ATVPDKIKX0DER][language_tag=en_US]", "Generic Keyword");
  const occasionTypes = amazonRepeatedRowValues(row, columns, "occasion_type[marketplace_id=ATVPDKIKX0DER][language_tag=en_US]", "Occasion");
  const occasions = uniquePromptItems([
    ...occasionTypes,
    ...amazonRepeatedRowValues(row, columns, "occasion[marketplace_id=ATVPDKIKX0DER][language_tag=en_US]", "Occasion"),
  ]);
  const compatibleUses = amazonRepeatedRowValues(row, columns, "recommended_uses_for_product[marketplace_id=ATVPDKIKX0DER][language_tag=en_US]", "Recommended Uses For Product");
  const style = amazonRowValue(row, columns, "Product Style", "Style", "style[marketplace_id=ATVPDKIKX0DER][language_tag=en_US]#1.value", "style");
  const itemShape = amazonRowValue(row, columns, "Item Shape", "item_shape[marketplace_id=ATVPDKIKX0DER][language_tag=en_US]#1.value");
  const itemForm = amazonRowValue(row, columns, "Item Form", "item_form[marketplace_id=ATVPDKIKX0DER][language_tag=en_US]#1.value");
  const paperFinish = amazonRowValue(row, columns, "Paper Finish", "paper_finish[marketplace_id=ATVPDKIKX0DER]#1.value");
  const designName = amazonRowValue(row, columns, "Design Name", "design_name[marketplace_id=ATVPDKIKX0DER][language_tag=en_US]#1.value");
  const material = uniquePromptItems([
    ...amazonRepeatedRowValues(row, columns, "material[marketplace_id=ATVPDKIKX0DER][language_tag=en_US]", "Material"),
    amazonRowValue(row, columns, "Material", "material")
    || amazonRowValue(row, columns, "Sole Material", "sole_material")
    || amazonRowValue(row, columns, "Outer Material", "outer")
    || amazonRowValue(row, columns, "Compliance - Upper Material", "compliance_upper_material"),
  ]).join(", ");
  const height = amazonRowValue(row, columns, "Height Map", "height_map");
  const heelType = amazonRowValue(row, columns, "Heel Type", "heel[marketplace_id");
  const targetGender = amazonRowValue(row, columns, "Target Gender", "target_gender");
  const ageRange = amazonRowValue(row, columns, "Age Range Description", "age_range_description");
  const productType = amazonRowValue(row, columns, "Product Type", "product_type");
  const category = amazonRowValue(row, columns, "Item Type Keyword", "item_type_keyword") || browsePath;
  const productText = `${title} ${description} ${bullets.join(" ")} ${keywords.join(" ")} ${occasions.join(" ")}`;
  const englishCategory = englishAmazonValue(category);
  const readableProductType = productType ? productType.toLowerCase().replace(/_/g, " ") : "";
  const scenes = amazonListingUseSceneText({ title, description, bullets, keywords, occasions, compatibleUses, category });
  const fit = amazonListingCompatibleUseText({ title, description, bullets, keywords, occasions, compatibleUses, category });
  const structure = amazonListingStructureText({
    text: productText,
    material,
    style,
    itemShape,
    itemForm,
    paperFinish,
    designName,
    height,
    heelType,
  });
  const titleUnitQuantity = amazonTitleUnitQuantity(title);
  const pack = titleUnitQuantity?.label || amazonListingPackText(productText, row, columns);
  const packComposition = amazonRefillRollComposition(title, description, bullets, keywords);
  const dimensionList = amazonListingDimensionListText(row, columns, productText, title);

  return {
    title,
    shortTitle: compactAmazonTitle(title),
    description,
    bullets,
    productType,
    readableProductType,
    category,
    englishCategory,
    material,
    structure,
    scene: scenes,
    fit,
    pack,
    packComposition,
    skuUnitQuantity: titleUnitQuantity?.count || 0,
    skuUnitQuantityLabel: titleUnitQuantity?.label || "",
    feature1: bullets[0] || style || "",
    feature2: bullets[1] || bullets[2] || "",
    surfaceFinish: paperFinish,
    dimensionList,
    detailParameter: compactPromptItems([
      style,
      itemShape,
      itemForm,
      designName,
      paperFinish,
      targetGender,
      ageRange,
      occasions.join(", "),
      englishCategory,
    ], "", 8),
  };
}

function amazonBundleComponentSeeds(listing = {}, color = "") {
  const text = [listing.title, listing.description, ...(listing.bullets || [])].filter(Boolean).join(" ");
  if (!/(?:poop\s*bag\s*(?:holder|dispenser)|pet\s*waste\s*dispenser)/i.test(text) || !/refill\s*rolls?/i.test(text)) return [];
  const rolls = Number.parseInt(extractFirstMatch(text, [/(?:and|plus|with)\s+(\d+)\s+(?:scented\s+)?(?:poop\s*bag\s*)?refill\s*rolls?/i, /(\d+)\s+(?:scented\s+)?refill\s*rolls?/i]), 10) || 0;
  return rolls ? [{ name: `${cleanFieldDisplayValue(color) || "Color-matched"} poop bag dispenser`, quantity: 1 }, { name: `${cleanFieldDisplayValue(color) || "Color-matched"} scented poop bag refill rolls`, quantity: rolls }] : [];
}

function amazonRowsToProducts(rows, browsePath = "", skuFilter = "") {
  if (!rows.length) return [];
  const columns = amazonColumnLookup(rows);
  const filter = parseAmazonSkuFilter(skuFilter);
  const dataRowInfos = rows
    .slice(6)
    .map((row, index) => ({ row, excelRowNumber: index + 7 }))
    .filter((rowInfo) => amazonRowValue(rowInfo.row, columns, "SKU", "contribution_sku"));
  if (!dataRowInfos.length) return [];

  const rowsBySku = new Map();
  dataRowInfos.forEach((rowInfo) => {
    rowsBySku.set(amazonRowValue(rowInfo.row, columns, "SKU", "contribution_sku"), rowInfo.row);
  });
  const filteredRowInfos = filter?.hasFilter
    ? dataRowInfos.filter((rowInfo) => amazonRowMatchesFilter(rowInfo, columns, filter))
    : dataRowInfos;
  const childRowInfos = filteredRowInfos.filter((rowInfo) => /child/i.test(amazonRowValue(rowInfo.row, columns, "Parentage Level", "parentage_level")));
  const sourceRowInfos = childRowInfos.length ? childRowInfos : filteredRowInfos;
  if (!sourceRowInfos.length) {
    throw new Error(`Amazon 模板中没有匹配“${filter.raw}”的子 SKU，请检查行号范围或 SKU。`);
  }
  const parentRow = dataRowInfos.find((rowInfo) => /parent/i.test(amazonRowValue(rowInfo.row, columns, "Parentage Level", "parentage_level")))?.row || dataRowInfos[0].row;
  const shared = amazonSharedFacts(parentRow, columns, browsePath);
  const variantLabels = [];

  const products = sourceRowInfos.map((rowInfo, index) => {
    const row = rowInfo.row;
    const sku = amazonRowValue(row, columns, "SKU", "contribution_sku");
    const parentSku = amazonRowValue(row, columns, "Parent SKU", "parent_sku");
    const theme = amazonRowValue(row, columns, "Variation Theme Name", "variation_theme") || amazonRowValue(parentRow, columns, "Variation Theme Name", "variation_theme");
    const listing = amazonFactsWithFallback(amazonSharedFacts(row, columns, browsePath), shared);
    const attrs = amazonVariantAttributes(row, columns, theme);
    const rowTitle = amazonRowValue(row, columns, "Item Name", "item_name");
    if (/SIZE/i.test(theme || "") && !attrs.size) {
      attrs.size = extractAmazonVariantSizeFromText(rowTitle, sku);
    }
    const optionParts = [
      attrs.color,
      attrs.size && !/^(?:one size|free size)$/i.test(attrs.size) ? attrs.size : "",
      attrs.numberOfItems,
      attrs.teamName,
    ].filter(Boolean);
    const optionLabel = optionParts.join(" / ") || sku;
    variantLabels.push(optionLabel);
    const listingBaseName = amazonListingBaseProductName(listing) || "Amazon template product";
    const productName = listingBaseName;
    const sizeCode = displayVariantText(optionParts.join(" / "));
    const extractedDimensionFields = dimensionFieldsFromDimensionList(listing.dimensionList, [productName, listing.structure].filter(Boolean).join(" "));
    return {
      id: `EXTRACTED-AMAZON-${index + 1}-${sku.replace(/[^A-Z0-9]+/gi, "-")}`,
      label: `${sku} | ${optionLabel}`,
      displayLabel: `${sku} | ${optionLabel}`,
      productName,
      baseProductName: listingBaseName,
      shape: productName,
      model: sku,
      parentSku,
      amazonTitle: listing.title || "",
      amazonRowNumber: rowInfo.excelRowNumber,
      color: attrs.color || attrs.colorMap || "",
      displayColor: attrs.color || attrs.colorMap || "",
      colorEnglish: attrs.color || attrs.colorMap || "",
      size: attrs.size || "",
      variantStyle: "",
      sizeCode,
      outputSizeCode: sizeCode,
      pack: listing.pack || "",
      packComposition: listing.packComposition || "",
      skuUnitQuantity: listing.skuUnitQuantity || 0,
      skuUnitQuantityLabel: listing.skuUnitQuantityLabel || "",
      material: listing.material,
      structure: listing.structure,
      scene: listing.scene,
      feature1: "",
      feature2: "",
      amazonFeature1: listing.feature1,
      amazonFeature2: listing.feature2,
      surfaceFinish: listing.surfaceFinish || "",
      fit: listing.fit,
      detailParameter: listing.detailParameter,
      bundleComponentSeeds: isLikelyBundleSku({ model: sku, parentSku }) ? amazonBundleComponentSeeds(listing, attrs.color || attrs.colorMap || "") : [],
      groupKey: parentSku || amazonRowValue(parentRow, columns, "SKU", "contribution_sku") || "amazon-template",
      group: {
        promptName: listingBaseName,
        promptSpecs: [listing.readableProductType, listing.englishCategory, theme, listing.pack, listing.material, listing.structure, listing.scene].filter(Boolean),
        dimensions: listing.dimensionList ? extractDimensions(listing.dimensionList) : [],
        evidenceNote: `Amazon 模板：按 Child SKU 提取 ${sourceRowInfos.length} 个采购款式；变体主题 ${theme || "未填写"}。${filter?.hasFilter ? `筛选：${filter.raw}。` : ""}`,
      },
      dims: {
        ...extractedDimensionFields,
        cupRange: "",
        source: listing.dimensionList
          ? `Amazon 模板第 ${rowInfo.excelRowNumber} 行：产品展开尺寸属性。`
          : `Amazon 模板：Child SKU = 款式数量；${theme || "变体"} = 款式属性。`,
      },
      singleSpec: `[CURRENT_PRODUCT_OPTION: ${optionLabel}]`,
      specList: `[SPEC_LIST: ${[listing.shortTitle, optionLabel, listing.pack, listing.material, listing.structure, listing.scene].filter(Boolean).join(" / ")}]`,
      variantList: "",
      dimensionList: listing.dimensionList || "",
    };
  });

  const variantList = `[VARIANT_LIST: ${uniquePromptItems(variantLabels).join(" | ")}]`;
  return products.map((product) => ({ ...product, variantList }));
}

async function extractAmazonTemplateProducts(file, skuFilter = "") {
  if (!file) return { products: [], sourceText: "" };
  const workbook = await readWorkbook(file);
  const sheetName = amazonTemplateSheetName(workbook);
  const templateRows = workbookRows(workbook, sheetName);
  const browseName = amazonBrowseSheetName(workbook);
  const browseRows = browseName
    ? workbookRows(workbook, browseName)
    : [];
  const browsePath = browseRows.slice(1).map((row) => row.filter(Boolean).join(" > ")).filter(Boolean)[0] || "";
  const products = amazonRowsToProducts(templateRows, browsePath, skuFilter);
  const parentSkus = uniquePromptItems(products.map((product) => product.parentSku).filter(Boolean));
  const sourceText = products.length
    ? [
      `Amazon template file: ${file.name}`,
      `AMAZON_TEMPLATE_SHEET: ${sheetName || "not found"}`,
      `AMAZON_TEMPLATE_RULE: Child SKU count = ${products.length}; variant theme fields define style attributes.`,
      skuFilter ? `AMAZON_TEMPLATE_FILTER: ${skuFilter}` : "",
      parentSkus.length ? `PARENT_SKU: ${parentSkus.join(", ")}` : "",
      `VARIANTS: ${products.map((product) => product.label).join(" | ")}`,
    ].filter(Boolean).join("\n")
    : "";
  return { products, sourceText };
}

function dimensionListItems(value, context = "") {
  const source = cleanTokenValue(value);
  if (!source) return [];
  return semanticDimensionItems(source.split(/\s*;\s*/).map((item) => item.trim()).filter(Boolean), context);
}

function canonicalDimensionKey(item, context = "") {
  const label = String(item || "").split(":")[0].trim().toLowerCase();
  return label.replace(/[^a-z]+/g, "_").replace(/^_|_$/g, "");
}

function comparableDimensionMeasurement(item) {
  const match = String(item || "").match(/:\s*([0-9.]+)\s*(mm|cm|m|in|ft|feet|foot|yd|um|g|kg|lb|lbs|oz|ml|l)\b/i);
  if (!match) return null;
  const value = Number(match[1]);
  const unit = match[2].toLowerCase();
  const lengthFactors = { um: 0.001, mm: 1, cm: 10, m: 1000, in: 25.4, ft: 304.8, feet: 304.8, foot: 304.8, yd: 914.4 };
  const weightFactors = { g: 1, kg: 1000, lb: 453.59237, lbs: 453.59237, oz: 28.349523125 };
  const capacityFactors = { ml: 1, l: 1000 };
  if (lengthFactors[unit]) return { family: "length", value: value * lengthFactors[unit] };
  if (weightFactors[unit]) return { family: "weight", value: value * weightFactors[unit] };
  if (capacityFactors[unit]) return { family: "capacity", value: value * capacityFactors[unit] };
  return null;
}

function dimensionMeasurementsAgree(first, second) {
  const a = comparableDimensionMeasurement(first);
  const b = comparableDimensionMeasurement(second);
  if (!a || !b || a.family !== b.family) return comparablePromptItem(first) === comparablePromptItem(second);
  const scale = Math.max(Math.abs(a.value), Math.abs(b.value), 0.0001);
  return Math.abs(a.value - b.value) / scale <= 0.2;
}

function mergeVerifiedDimensionLists(primaryList, secondaryList, context = "") {
  const primary = dimensionListItems(primaryList, context);
  const secondary = dimensionListItems(secondaryList, context);
  const conflicts = [];
  const conflictKeys = new Set();
  const primaryByKey = new Map(primary.map((item) => [canonicalDimensionKey(item, context), item]));
  secondary.forEach((item) => {
    const key = canonicalDimensionKey(item, context);
    const existing = primaryByKey.get(key);
    if (existing && !dimensionMeasurementsAgree(existing, item)) {
      conflictKeys.add(key);
      conflicts.push(`${existing} vs ${item}`);
    }
  });
  const confirmed = primary.filter((item) => !conflictKeys.has(canonicalDimensionKey(item, context)));
  secondary.forEach((item) => {
    const key = canonicalDimensionKey(item, context);
    if (conflictKeys.has(key) || primaryByKey.has(key)) return;
    confirmed.push(item);
  });
  return {
    dimensionList: confirmed.length ? `[VERIFIED_DIMENSIONS: ${uniquePromptItems(confirmed).join("; ")}]` : "",
    dimensions: uniquePromptItems(confirmed),
    conflicts,
  };
}

function mergedAmazonProductWithSupplierFacts(amazonProduct, supplierProduct, supplierBaseName) {
  const visionVerified = Boolean(supplierProduct.visionVerified);
  const visionEvidence = supplierProduct.visionEvidence || {};
  const rawSupplierName = cleanFieldDisplayValue(
    supplierProduct.outputProductName
      || supplierProduct.baseProductName
      || supplierProduct.productName
      || supplierBaseName
      || defaultProductName(supplierProduct)
  );
  const amazonOption = displayVariantText(amazonProduct.sizeCode || amazonProduct.outputSizeCode || cleanTokenValue(amazonProduct.singleSpec) || "");
  const rawAmazonBaseName = cleanFieldDisplayValue(
    amazonProduct.baseProductName
      || amazonProduct.productName
      || defaultProductName(amazonProduct)
  );
  const productNameContext = [
    supplierProduct.structure,
    supplierProduct.detailParameter,
    supplierProduct.scene,
    rawSupplierName,
  ].filter(Boolean).join(" ");
  const supplierName = englishOnlyProductName(rawSupplierName, productNameContext);
  const amazonBaseName = englishOnlyProductName(rawAmazonBaseName, productNameContext);
  const baseName = visionEvidence.productName ? supplierName || amazonBaseName : amazonBaseName || supplierName;
  const productName = baseName || amazonProduct.baseProductName || supplierName || amazonProduct.productName;
  const supplierGroup = supplierProduct.group || {};
  const amazonGroup = amazonProduct.group || {};
  const visionDimensionItems = semanticDimensionItems(visionEvidence.dimensions || [], [supplierName, supplierProduct.structure].filter(Boolean).join(" "));
  const visionDimensionList = visionDimensionItems.length
    ? `[VERIFIED_DIMENSIONS: ${visionDimensionItems.join("; ")}]`
    : "";
  // A dimension read from the current SKU's supplier detail/OCR is stronger
  // evidence than an Amazon title or generic spreadsheet cells. Do not mix
  // conflicting source levels into one product-size chart.
  const supplierDimensionList = visionDimensionList || supplierProduct.dimensionList || "";
  const dimensionMerge = mergeVerifiedDimensionLists(
    supplierDimensionList,
    "",
    [productName, supplierProduct.structure, amazonProduct.structure].filter(Boolean).join(" ")
  );
  const dimensions = dimensionMerge.dimensions.length
    ? dimensionMerge.dimensions
    : (amazonGroup.dimensions || []).length ? amazonGroup.dimensions : (supplierGroup.dimensions || []);
  const hasDimensionEvidence = Boolean(visionDimensionList || supplierProduct.dimensionList);
  const dimensionList = hasDimensionEvidence
    ? dimensionMerge.dimensionList
    : (dimensions.length ? `[VERIFIED_DIMENSIONS: ${dimensions.join("; ")}]` : "");
  const mergedDimensionFields = dimensionFieldsFromDimensionList(dimensionList, [productName, amazonProduct.structure].filter(Boolean).join(" "));
  const material = supplierProduct.material || amazonProduct.material || "";
  const category = supplierProduct.category || amazonProduct.category || "";
  const packaging = supplierProduct.packaging || amazonProduct.packaging || "";
  const productStyle = supplierProduct.productStyle || amazonProduct.productStyle || "";
  // The selected Amazon child SKU is authoritative for variant color.
  // Supplier/Doubao color is only a fallback when the child SKU has no color.
  const color = amazonProduct.color || supplierProduct.color || "";
  const structure = supplierProduct.structure || amazonProduct.structure || "";
  const scene = supplierProduct.scene || amazonProduct.scene || "";
  const supplierSellingPoints = uniqueSellingPoints([
    ...splitSellingPointText(supplierProduct.feature1),
    ...splitSellingPointText(supplierProduct.feature2),
  ], 6).filter((point) => !isOrdinaryMaterialSellingPoint(point) && sellingPointKey(point) !== "material");
  const feature1 = sellingPointGroupText(distributedSellingPointGroups(supplierSellingPoints, 0, 2, 4));
  const feature2 = sellingPointGroupText(distributedSellingPointGroups(supplierSellingPoints, 1, 2, 4));
  const hasSupplierPropertyEvidence = Boolean(feature1 || feature2);
  const fit = supplierProduct.fit || amazonProduct.fit || "";
  const detailParameter = supplierProduct.detailParameter || amazonProduct.detailParameter || "";
  const titleQuantity = amazonSkuTitleQuantityFacts(amazonProduct);
  const promptSpecs = uniquePromptItems([
    productName,
    amazonOption,
    amazonProduct.pack || supplierProduct.pack,
    material,
    structure,
    scene,
  ]).filter(Boolean);
  const evidenceNote = compactPromptItems([
    visionVerified ? "豆包识图：已用1688图片与本地OCR交叉整理，并以带图片证据的供应商事实为准。" : amazonProduct.group?.evidenceNote || "Amazon listing：优先采用模板中的 listing 字段和 Child SKU 款式结构。",
    visionVerified ? "豆包只覆盖其逐项确认的字段；未确认字段继续采用本地解析或 Amazon item 商品字段。" : "1688 / 采购单：补充材质、结构、场景、卖点、尺寸等参数。",
    hasSupplierPropertyEvidence ? "卖点采用1688标题、属性或详情图中可核验的产品属性。" : "1688未提取到有效卖点，等待豆包联网查证；Amazon 通用 Bullet Point 不作兜底。",
    dimensionMerge.conflicts.length ? `尺寸冲突，已从提示词排除：${dimensionMerge.conflicts.join("；")}` : "尺寸已按产品语义合并，并保留产品尺寸与包装尺寸边界。",
  ], visionVerified ? "1688图片证据优先，Amazon模板保留变体。" : "Amazon listing 优先，1688 补缺。", 4);

  return {
    ...amazonProduct,
    productName,
    baseProductName: visionEvidence.productName ? supplierName || amazonBaseName || productName : amazonBaseName || supplierName || productName,
    shape: productName || amazonProduct.shape || supplierProduct.shape,
    amazonTitle: amazonProduct.amazonTitle || "",
    pack: titleQuantity?.label || supplierProduct.pack || amazonProduct.pack || "",
    packComposition: amazonProduct.packComposition || supplierProduct.packComposition || "",
    skuUnitQuantity: titleQuantity?.count || 0,
    skuUnitQuantityLabel: titleQuantity?.label || "",
    material,
    category,
    color,
    structure,
    productStyle,
    packaging,
    structuredAttributesSource: supplierProduct.structuredAttributesSource || amazonProduct.structuredAttributesSource || "",
    scene,
    installationSteps: supplierProduct.installationSteps || amazonProduct.installationSteps || "",
    feature1,
    feature2,
    feature3: "",
    surfaceFinish: supplierProduct.surfaceFinish || amazonProduct.surfaceFinish || "",
    fit,
    detailParameter,
    bundleComponents: amazonProduct.bundleComponents || supplierProduct.bundleComponents || "",
    dims: {
      ...(!visionDimensionList ? { ...(supplierProduct.dims || {}), ...(amazonProduct.dims || {}) } : (supplierProduct.dims || {})),
      ...mergedDimensionFields,
      source: dimensionMerge.conflicts.length
        ? `尺寸来源存在冲突：${dimensionMerge.conflicts.join("；")}`
        : [amazonProduct.dims?.source, supplierProduct.dims?.source].filter(Boolean).join(" + ") || "Verified product dimensions",
    },
    dimensionConflicts: dimensionMerge.conflicts,
    dimensionList,
    cupRange: amazonProduct.cupRange || amazonProduct.dims?.cupRange || supplierProduct.cupRange || supplierProduct.dims?.cupRange || "",
    group: {
      promptName: productName || amazonGroup.promptName || supplierName || supplierGroup.promptName || "",
      promptSpecs,
      dimensions,
      evidenceNote,
    },
    singleSpec: `[CURRENT_PRODUCT_OPTION: ${[productName, amazonOption].filter(Boolean).join(", ")}]`,
    specList: `[SPEC_LIST: ${promptSpecs.join(" / ")}]`,
    variantList: amazonProduct.variantList || supplierProduct.variantList || "",
  };
}

function supplierProductForAmazonVariant(supplierProducts, amazonProduct, index) {
  if (!supplierProducts.length) return {};
  if (supplierProducts.length === 1) return supplierProducts[0];
  const amazonText = [
    amazonProduct.color,
    amazonProduct.displayColor,
    amazonProduct.colorEnglish,
    amazonProduct.size,
    amazonProduct.sizeCode,
    amazonProduct.outputSizeCode,
    amazonProduct.label,
  ].filter(Boolean).join(" ").toLowerCase();
  const matched = supplierProducts.find((product) => {
    const supplierText = [
      product.color,
      product.displayColor,
      product.colorEnglish,
      product.size,
      product.sizeCode,
      product.outputSizeCode,
      product.label,
    ].filter(Boolean).join(" ").toLowerCase();
    return supplierText && amazonText && (promptItemsOverlap(supplierText, amazonText) || promptItemsOverlap(amazonText, supplierText));
  });
  return matched || supplierProducts[index % supplierProducts.length] || supplierProducts[0];
}

function mergeAmazonProductsWithSupplierFacts(amazonProducts, supplierProducts) {
  if (!amazonProducts.length || !supplierProducts.length) return amazonProducts;
  const supplierBaseName = cleanFieldDisplayValue(
    supplierProducts[0].outputProductName
      || supplierProducts[0].baseProductName
      || supplierProducts[0].productName
      || defaultProductName(supplierProducts[0])
  );
  return amazonProducts.map((amazonProduct, index) => mergedAmazonProductWithSupplierFacts(
    amazonProduct,
    supplierProductForAmazonVariant(supplierProducts, amazonProduct, index),
    supplierBaseName
  ));
}

function amazonSkuTitleQuantityFacts(product) {
  // A verified refill-roll composition owns the count semantics.  Do not
  // restore a generic "60 Count" rule later in the Amazon/supplier merge.
  if (cleanFieldDisplayValue(product?.packComposition || "")) return null;
  const parsed = amazonTitleUnitQuantity([
    product?.amazonTitle,
    product?.skuUnitQuantityLabel,
    product?.pack,
    product?.size,
    product?.sizeCode,
    product?.singleSpec,
  ].filter(Boolean).join(" "));
  const explicitCount = Number(product?.skuUnitQuantity || 0);
  const count = Number(parsed?.count || (explicitCount >= 2 ? explicitCount : 0));
  if (count < 2) return null;
  return {
    count,
    label: parsed?.label || cleanFieldDisplayValue(product?.skuUnitQuantityLabel) || `${count}-Pack`,
  };
}

function amazonVariantForSupplierQuantity(supplierProduct, amazonProducts, index, supplierCount) {
  if (!amazonProducts.length) return null;
  if (amazonProducts.length === 1) return amazonProducts[0];
  const supplierText = [
    supplierProduct?.model,
    supplierProduct?.color,
    supplierProduct?.displayColor,
    supplierProduct?.size,
    supplierProduct?.sizeCode,
    supplierProduct?.label,
  ].filter(Boolean).join(" ");
  const matched = amazonProducts.find((product) => {
    const amazonText = [
      product?.model,
      product?.color,
      product?.displayColor,
      product?.size,
      product?.sizeCode,
      product?.label,
    ].filter(Boolean).join(" ");
    return supplierText && amazonText && promptItemsOverlap(supplierText, amazonText);
  });
  return matched || (supplierCount === amazonProducts.length ? amazonProducts[index] : null);
}

function applyAmazonSkuTitleQuantities(supplierProducts, amazonProducts) {
  return (supplierProducts || []).map((product, index) => {
    const amazonProduct = amazonVariantForSupplierQuantity(product, amazonProducts || [], index, supplierProducts.length);
    const packComposition = cleanFieldDisplayValue(amazonProduct?.packComposition || product?.packComposition || "");
    const quantity = amazonSkuTitleQuantityFacts(amazonProduct);
    if (!quantity && !packComposition) return product;
    return {
      ...product,
      amazonTitle: amazonProduct?.amazonTitle || "",
      pack: quantity?.label || product.pack || amazonProduct?.pack || "",
      packComposition,
      skuUnitQuantity: quantity?.count || 0,
      skuUnitQuantityLabel: quantity?.label || "",
      singleSpec: `[CURRENT_PRODUCT_OPTION: ${[
        cleanTokenValue(product.singleSpec) || product.productName || product.label,
        quantity?.label || product.pack || amazonProduct?.pack || "",
      ].filter(Boolean).join(", ")}]`,
    };
  });
}

function inferProductsFromSources(purchaseText, supplierText, competitorText) {
  const visionEvidence = doubaoVisionEvidenceProfile(supplierText);
  const visionVerified = visionEvidence.verified;
  const primaryText = productIdentitySourceText(purchaseText, supplierText);
  const attributeText = [primaryText, supplierText].filter(Boolean).join(" ");
  const combined = [attributeText, competitorText].join(" ");
  const identityAttrs = supplierAttributeMap(primaryText);
  const productName = inferProductName(primaryText);
  const detailAttributes = {
    ...supplierAttributeMap(supplierText),
    ...visionEvidence.attributeValues,
  };
  const material = cleanFieldDisplayValue(detailAttributes.Material || "");
  const category = cleanFieldDisplayValue(detailAttributes.Category || "");
  const packaging = cleanFieldDisplayValue(detailAttributes.Packaging || "");
  const productStyle = cleanFieldDisplayValue(detailAttributes.Style || "");
  const color = cleanFieldDisplayValue(detailAttributes.Color || "");
  const detailTechnology = identityAttrs.Technology || detailAttributes.Technology || "";
  const detailSpecialCraft = identityAttrs.SpecialCraft || detailAttributes.SpecialCraft || "";
  const structure = cleanFieldDisplayValue(detailAttributes.Structure || "");
  const scene = inferUseScene(attributeText || primaryText || combined);
  const installationSteps = detailAttributes.InstallationSteps || inferInstallationSteps(attributeText || primaryText);
  // Local OCR and raw HTML never manufacture selling points. Only evidence-backed
  // markers returned by the product-specific vision analysis are accepted here.
  const sellingPoints = verifiedSellingPointsFromSource(supplierText, 6);
  const extractedSellingPointSet = uniqueSellingPoints(sellingPoints.points || [], 6);
  const globalSellingPoint1 = sellingPointGroupText(distributedSellingPointGroups(extractedSellingPointSet, 0, 2, 4));
  const globalSellingPoint2 = sellingPointGroupText(distributedSellingPointGroups(extractedSellingPointSet, 1, 2, 4));
  const dimensions = semanticDimensionItems(extractDimensions(attributeText), attributeText);
  const sizeOrRange = cleanFieldDisplayValue(detailAttributes.Size || "");
  const capacityOrWeight = detailAttributes.Capacity || detailAttributes.Weight || "";
  const productUnitCount = skuRelevantPackValue(extractProductUnitCount(supplierText));
  const cleanProductName = toCrossBorderProductName(productName, "");
  const displayName = displayProductName(cleanProductName || productName, combined) || cleanProductName;
  const outputName = crossBorderProductName(cleanProductName || productName, combined) || cleanProductName || displayName;
  const batchBaseName = shortCrossBorderBaseName(outputName || productName || displayName, combined) || "product";
  const purchaseItems = extractPurchaseItems(purchaseText, combined);
  const supplierOnlyOptions = extractSupplierSkuOptions(supplierText)
    .filter((option) => option.model && (option.rawSpec || option.color || option.size || option.dims?.topWidth || option.dims?.weight));
  const variants = [];

  if (purchaseItems.length) {
    variants.push(...purchaseItems.map((item, index) => {
      const itemUnitCount = skuRelevantPackValue(productUnitCountForItem(item, supplierText));
      const itemDisplayColor = displayColorName(item.displayColor || item.color, item.colorEnglish);
      const itemForOutput = { ...item, productUnitCount: itemUnitCount };
      const itemDisplayName = displayProductName(item.productName || displayName, combined) || item.productName || displayName;
      const itemOutputBaseName = item.outputProductName || crossBorderProductName(item.productName || outputName, combined) || outputName;
      const shortBaseName = batchBaseName || shortCrossBorderBaseName(itemOutputBaseName || itemDisplayName || outputName, combined);
      const shortOptionLabel = comparisonOptionLabel(itemForOutput, shortCrossBorderOptionLabel(shortBaseName, itemForOutput, `product ${index + 1}`));
      return {
        id: `EXTRACTED-${index + 1}-${[item.colorEnglish || item.color, item.size, itemUnitCount].filter(Boolean).join("-").replace(/[^A-Z0-9]+/gi, "-") || "ITEM"}`,
        label: productVariantLabel(itemDisplayName, { ...item, displayColor: itemDisplayColor, productUnitCount: itemUnitCount }, `Product ${index + 1}`),
        outputLabel: shortOptionLabel,
        key: item.key,
        purchaseRowKey: item.purchaseRowKey || item.rowKey,
        model: item.model,
        productName: itemDisplayName,
        outputProductName: itemOutputBaseName,
        color: item.color,
        displayColor: itemDisplayColor,
        colorEnglish: item.colorEnglish,
        size: item.size,
        variantStyle: item.variantStyle,
        productUnitCount: itemUnitCount,
        spec: item.spec || productVariantName(itemDisplayName, { ...item, displayColor: itemDisplayColor, productUnitCount: itemUnitCount }, `Product ${index + 1}`),
        outputSpec: item.outputSpec || crossBorderVariantName(itemOutputBaseName, itemForOutput, `Product ${index + 1}`),
        sizeCode: item.sizeCode || variantAttributeParts(item, itemUnitCount).join(" / "),
        outputSizeCode: [crossBorderColorName(itemForOutput), /^(?:均码|one size)$/i.test(cleanFieldDisplayValue(item.size || "")) ? "" : cleanFieldDisplayValue(item.size || "")].filter(Boolean).join(" / "),
        cupRange: item.cupRange,
        pack: itemUnitCount,
        quantity: item.quantity,
        dims: item.dims,
        fit: item.fit,
        supplierOption: item.supplierOption,
      };
    }));
  } else {
    const supplierOnlyVariants = supplierOnlyOptions.map((option, index) => {
      const itemDisplayColor = displayColorName(option.color, option.colorEnglish);
      const itemForOutput = {
        ...option,
        displayColor: itemDisplayColor,
        productUnitCount: "",
        pack: "",
      };
      const optionBaseName = displayName || productName || `Product ${index + 1}`;
      const optionOutputName = outputName || crossBorderProductName(optionBaseName, combined) || optionBaseName;
      return {
        id: `EXTRACTED-SUPPLIER-${index + 1}-${[option.colorEnglish || option.color, option.size].filter(Boolean).join("-").replace(/[^A-Z0-9]+/gi, "-") || "SKU"}`,
        label: productVariantLabel(optionBaseName, itemForOutput, `Product ${index + 1}`),
        outputLabel: shortCrossBorderOptionLabel(batchBaseName, itemForOutput, `product ${index + 1}`),
        key: supplierOptionIdentity(option) || `supplier-sku-${index + 1}`,
        model: option.model,
        productName: optionBaseName,
        outputProductName: optionOutputName,
        color: option.color,
        displayColor: itemDisplayColor,
        colorEnglish: option.colorEnglish || colorName(option.color),
        size: option.size,
        material: option.material,
        variantStyle: option.variantStyle,
        spec: [optionBaseName, itemDisplayColor, option.size].filter(Boolean).join(" - "),
        outputSpec: crossBorderVariantName(optionOutputName, itemForOutput, `Product ${index + 1}`),
        sizeCode: variantAttributeParts(itemForOutput).join(" / "),
        outputSizeCode: [crossBorderColorName(itemForOutput), /^(?:均码|one size)$/i.test(cleanFieldDisplayValue(option.size || "")) ? "" : cleanFieldDisplayValue(option.size || "")].filter(Boolean).join(" / "),
        pack: "",
        productUnitCount: "",
        dims: option.dims,
        fit: "",
        supplierOption: option,
      };
    });
    variants.push(...supplierOnlyVariants);
    if (/V02|V形|V60/i.test(combined)) variants.push({ ...productSpecForToken("V02"), id: "EXTRACTED-V02", label: "Extracted | V02" });
    if (/#02|U02|U102|扇形02|fan-shaped 02/i.test(combined)) variants.push({ ...productSpecForToken("fan 02"), id: "EXTRACTED-U02", label: "Extracted | Fan 02 / U02" });
    if (/#04|扇形04|fan-shaped 04/i.test(combined)) variants.push({ ...productSpecForToken("fan 04"), id: "EXTRACTED-U04", label: "Extracted | Fan 04" });
  }

  const colorScopedVariants = normalizedColorVariantItems(variants, purchaseText, combined);
  const normalizedVariants = colorScopedVariants.length ? disambiguateDuplicateLabels(dedupeExtractedVariants(colorScopedVariants)) : [{
    id: "EXTRACTED-PRODUCT-1",
    label: displayName || "Product 1",
    outputLabel: outputName || "Product 1",
    spec: "",
    outputSpec: "",
    sizeCode: "",
    outputSizeCode: "",
    pack: productUnitCount || "",
    fit: "",
  }];

  return normalizedVariants.map((item) => {
    const itemCupRange = validSizeRangeValue(sizeOrRange || item.cupRange || item.size || item.outputSizeCode || item.sizeCode || "");
    const itemDimensions = [
      item.dims?.topWidth && `Length: ${item.dims.topWidth}`,
      item.dims?.sideLength && `Width: ${item.dims.sideLength}`,
      item.dims?.bottomWidth && `${thirdDimensionLabel([combined, item.spec, item.sizeCode].filter(Boolean).join(" "))}: ${item.dims.bottomWidth}`,
      capacityOrWeight && `${detailAttributes.Capacity ? "Capacity" : "Weight"}: ${capacityOrWeight}`,
      (!capacityOrWeight && item.dims?.weight) && `Weight: ${item.dims.weight}`,
    ].filter(Boolean);
    const dimensionList = dimensions.length
      ? `[VERIFIED_DIMENSIONS: ${dimensions.join("; ")}]`
      : itemDimensions.length
        ? `[VERIFIED_DIMENSIONS: ${itemDimensions.join("; ")}]`
        : "";
    const itemDisplayColor = displayColorName(item.displayColor || item.color, item.colorEnglish);
    const itemColor = item.colorEnglish || colorName(item.color) || color;
    const itemMaterial = translateAttributeValue("Material", item.material || "") || material;
    const itemStructure = structure;
    const itemProductName = item.productName || displayProductName(cleanProductName || productName, combined) || toCrossBorderProductName(productName, item.spec);
    const itemOutputName = item.outputProductName || crossBorderProductName(cleanProductName || productName, combined) || toCrossBorderProductName(productName, item.outputSpec || item.spec);
    const variantProductName = displayVariantText(item.outputSpec || outputVariantNameFromParts(itemOutputName, item)) || itemOutputName;
    const itemShortBaseName = batchBaseName || shortCrossBorderBaseName(itemOutputName || itemProductName, combined);
    const safePack = skuRelevantPackValue(item.productUnitCount || item.pack || productUnitCount);
    const itemForDisplay = { ...item, displayColor: itemDisplayColor, productUnitCount: safePack, pack: safePack };
    const itemForOutput = { ...item, productUnitCount: safePack, pack: safePack };
    const displaySpec = displayVariantText(item.spec || productVariantName(itemProductName, itemForDisplay, itemProductName || "selected product"));
    const outputSpec = skuCurrentOptionText(
      { ...itemForOutput, outputSpec: item.outputLabel || shortCrossBorderOptionLabel(itemShortBaseName, itemForOutput, itemOutputName || "selected product") },
      itemOutputName || "selected product"
    );
    const variantList = normalizedVariants
      .map((variant) => displayVariantText(comparisonOptionLabel({ ...variant, productUnitCount: skuRelevantPackValue(variant.productUnitCount || variant.pack || productUnitCount), pack: skuRelevantPackValue(variant.productUnitCount || variant.pack || productUnitCount) }, variant.outputLabel || itemOutputName || "product option")))
      .filter(Boolean)
      .join(" | ");
    const displaySizeCode = displayVariantText(item.outputSizeCode || outputSpec || item.sizeCode || item.spec || displaySpec);
    return {
    visionVerified,
    visionEvidence,
    id: item.id,
    label: variantProductName || itemOutputName || outputSpec || displayVariantText(item.outputLabel || item.label),
    displayLabel: variantProductName || itemOutputName || outputSpec || displayVariantText(item.outputLabel || item.label),
    productName: itemOutputName || outputName || variantProductName,
    baseProductName: itemOutputName,
    shape: variantProductName || outputSpec || displaySpec || item.spec,
    pack: safePack,
    sizeCode: displaySizeCode,
    groupKey: "",
    group: {
      promptName: variantProductName || outputSpec || displaySpec || displayVariantText(item.spec),
      promptSpecs: [variantProductName || outputSpec || displaySpec || displayVariantText(item.spec), itemCupRange, safePack, itemMaterial, itemStructure].filter(Boolean),
      dimensions: dimensions.length ? dimensions : itemDimensions,
    },
    dims: {
      topWidth: dimensionValueByLabels(dimensions.join("; "), ["Base Diameter", "Diameter", "Folded Size", "Top Width", "Length"]) || item.dims?.topWidth || "",
      sideLength: dimensionValueByLabels(dimensions.join("; "), ["Front Diameter", "Knob Diameter", "Open Diameter", "Side Length", "Width"]) || item.dims?.sideLength || "",
      bottomWidth: dimensionValueByLabels(dimensions.join("; "), ["Projection Depth", "Depth", "Overall Projection", "Open Height", "Bottom Width", "Thickness", "Height"]) || item.dims?.bottomWidth || "",
      weight: dimensionValueByLabels(dimensions.join("; "), ["Weight", "Capacity", "Volume", "Weight / Capacity"]) || capacityOrWeight || item.dims?.weight || "",
      cupRange: itemCupRange,
      source: dimensions.length ? "Extracted from uploaded source files" : item.dims?.source || "No verified dimensions extracted",
    },
    quantity: item.quantity,
    material: itemMaterial,
    category,
    color: itemColor,
    structure: itemStructure,
    productStyle,
    packaging,
    structuredAttributesSource: "1688 HTML 结构化商品属性（当前商品）",
    scene,
    installationSteps,
    feature1: globalSellingPoint1 || sellingPoints.feature1,
    feature2: globalSellingPoint2 || sellingPoints.feature2,
    surfaceFinish: detailTechnology,
    fit: item.fit || "",
    // Selling-point copy must never become a product parameter. Parameters stay
    // empty unless the current source explicitly provides a parameter/detail.
    detailParameter: compactPromptItems([detailAttributes.DetailFeatures, detailSpecialCraft], "", 6),
    singleSpec: `[CURRENT_PRODUCT_OPTION: ${[variantProductName || outputSpec, safePack].filter(Boolean).join(", ")}]`,
    specList: `[SPEC_LIST: ${[variantProductName || outputSpec, itemCupRange, safePack, itemMaterial, itemStructure].filter(Boolean).join(" / ")}]`,
    variantList: variantList ? `[VARIANT_LIST: ${variantList}]` : "",
    dimensionList,
  };
  });
}

async function extractSources() {
  hasUserSourceAttempt = true;
  extractionGeneration += 1;
  const requestedGeneration = extractionGeneration;
  const routeId = selectedExtractionRoute;
  const routeName = extractionRoutePreviews[routeId]?.title || extractionRoutePreviews.local.title;
  const structureRouteName = productStructureRoutePreviews[selectedProductStructureRoute]?.title || productStructureRoutePreviews.single.title;
  const amazonTemplateFile = byId("amazonTemplateFile").files[0];
  const amazonSkuFilter = byId("amazonSkuFilter")?.value || "";
  const supplierFiles = Array.from(byId("supplierFile").files || []);
  const supplierImageListFiles = Array.from(byId("supplierImageListFile").files || []);
  const pastedSupplierImageListText = byId("supplierImageListText")?.value.trim() || "";
  const competitorFiles = Array.from(byId("competitorFile").files || []);
  const extractButton = byId("extractSources");
  extractButton.disabled = true;
  extractButton.setAttribute("aria-busy", "true");
  document.querySelectorAll("[data-extraction-route]").forEach((button) => { button.disabled = true; });
  document.querySelectorAll("[data-product-structure-route]").forEach((button) => { button.disabled = true; });
  byId("extractStatus").textContent = `正在按“${structureRouteName} / ${routeName}”解析资料...`;

  try {
    supplierSourceFileNames = supplierFiles.map((file) => file.name).filter(Boolean);
    const amazonTemplate = await extractAmazonTemplateProducts(amazonTemplateFile, amazonSkuFilter);
    populateSupplierSkuBinding(amazonTemplate.products);
    const supplierEntries = await readNamedTextFiles(supplierFiles, (message) => {
      byId("extractStatus").textContent = message;
    });
    const supplierImageListEntries = await readNamedTextFiles(supplierImageListFiles, (message) => {
      byId("extractStatus").textContent = message;
    }, "采集助手图片清单");
    const supplierImageListText = [
      ...supplierImageListEntries.map((entry) => entry.text),
      pastedSupplierImageListText,
    ].filter(Boolean).join("\n");
    const supplierHtml = combinedNamedHtmlEntries(supplierEntries);
    const competitorHtml = await readTextFiles(competitorFiles, (message) => {
      byId("extractStatus").textContent = message;
    });
    const competitorReferenceImageCandidates = extractAmazonCompetitorImageCandidates(competitorHtml);
    const competitorReferenceImageUrls = competitorReferenceImageCandidates.map(imageCandidateUrl).filter(Boolean);
    const competitorReferenceMeta = competitorReferenceImageUrls.map((url) => ({
      url,
      image_type: "amazon_competitor_reference",
      reference_value: "high",
      confidence: "high",
      sku_match: "visual_reference",
      best_for: ["main_product", "human_use", "multi_scene", "multi_angle", "selling_point", "summary"],
      reason: "Amazon competitor image used only as composition/style reference; current SKU facts stay from Amazon flat file and 1688 supplier evidence.",
    }));
    const supplierFileExtraction = supplierEntries.length > 1
      ? await extractSupplierSourcesByFile(supplierEntries, (message) => {
        byId("extractStatus").textContent = message;
      }, routeId, supplierImageListEntries)
      : null;
    const supplierIdentityHint = boundSupplierSku(amazonTemplate.products)
      || (amazonTemplate.products.length === 1 ? amazonTemplate.products[0] : {});
    const supplierSource = supplierFileExtraction?.merged || await extractSupplierSourceText(supplierHtml, (message) => {
      byId("extractStatus").textContent = message;
    }, routeId, supplierImageListText, supplierIdentityHint);
    // A file/input change invalidates the entire extraction run. Never let a
    // late result from the previous product commit into the new product state.
    if (extractionGeneration !== requestedGeneration) return;
    const supplierFileProducts = supplierFileExtraction?.fileSources?.length > 1
      ? productsFromSupplierFileSources(supplierFileExtraction.fileSources)
      : [];
    const useSupplierFileProducts = supplierFileProducts.length > 1 && !amazonTemplate.products.length;
    sourcePayload = {
      purchase: "",
      amazonTemplate: useSupplierFileProducts ? "" : amazonTemplate.sourceText,
      supplier: supplierSource.text,
      // Keep a compact presence marker instead of the raw competitor HTML so
      // reference material cannot leak product facts into current-SKU fields.
      competitor: competitorFiles.length
        ? `COMPETITOR_REFERENCE_FILES: ${competitorFiles.map((file) => file.name).join(" | ")}\nCOMPETITOR_REFERENCE_IMAGES: ${competitorReferenceImageUrls.length}`
        : "",
    };
    fieldOverrides = {};
    fieldOverridesBySku = {};
    appliedSellingPointOverridesBySku = {};
    sellingPointResearchAttemptedBySku = new Set();
    sellingPointDraftDirty = false;
    const inferredSourceProducts = inferProductsFromSources(sourcePayload.purchase, sourcePayload.supplier, sourcePayload.competitor);
    // Amazon child SKUs are independent products/options. A supplier page may
    // supplement an Amazon SKU only when there is exactly one SKU and exactly
    // one supplier product in this run. Never use a color/keyword/index
    // fallback to broadcast one supplier page's facts or selling points to
    // other Amazon SKUs (for example, from a dispenser to refill bags).
    const hasUnambiguousSingleSkuSource = amazonTemplate.products.length === 1 && inferredSourceProducts.length === 1;
    const mergedAmazonSupplierProducts = hasUnambiguousSingleSkuSource
      ? mergeAmazonProductsWithSupplierFacts(amazonTemplate.products, inferredSourceProducts)
      : [];
    if (useSupplierFileProducts) {
      extractedProducts = applyAmazonSkuTitleQuantities(supplierFileProducts, amazonTemplate.products);
    } else if (mergedAmazonSupplierProducts.length) {
      extractedProducts = mergedAmazonSupplierProducts;
    } else if (amazonTemplate.products.length) {
      extractedProducts = amazonTemplate.products;
    } else {
      extractedProducts = inferredSourceProducts;
    }
    // A mixed 1688 page can contain both a dispenser and refill bags. Keep
    // visual selling-point evidence, but distribute it only to Amazon SKUs
    // whose own title/identity names the same subject; never broadcast it.
    const explicitSupplierSku = boundSupplierSku(extractedProducts);
    if (explicitSupplierSku) {
      extractedProducts = applyVisualEvidenceToBoundSku(
        extractedProducts,
        supplierSource.sellingPointVisualEvidence,
        explicitSupplierSku.id,
      );
    } else if (amazonTemplate.products.length > 1) {
      extractedProducts = applyVisualEvidenceToMatchingAmazonSkus(
        extractedProducts,
        supplierSource.sellingPointVisualEvidence,
      );
    }
    // A single uploaded 1688 page is the current product's explicit source.
    // Preserve its Doubao-confirmed selling-point image links on that SKU so
    // downstream selling-point prompts can cite the exact evidence image.
    // With multiple pages we intentionally do not broadcast evidence across
    // SKUs; those mappings must remain component/source-specific.
    if (hasUnambiguousSingleSkuSource && supplierEntries.length === 1 && Array.isArray(supplierSource.sellingPointVisualEvidence)) {
      extractedProducts = extractedProducts.map((product) => ({
        ...product,
        sellingPointVisualEvidence: supplierSource.sellingPointVisualEvidence,
      }));
    }
    if (!extractedProducts.length) {
      throw new Error("没有从当前资料中提取到产品 / 款式，请确认 Amazon 模板或 1688 HTML 是否已选择。");
    }
    applyProductStructureRoute(extractedProducts);
    const supplierReferenceImageUrls = Array.from(new Set([
      ...(Array.isArray(supplierSource.referenceImageUrls) ? supplierSource.referenceImageUrls : []),
      ...(Array.isArray(supplierSource.sellingPointVisualEvidence)
        ? supplierSource.sellingPointVisualEvidence.map((item) => item?.imageUrl || item?.image_url).filter(Boolean)
        : []),
    ])).filter((url) => /^https?:\/\//i.test(url)).slice(0, MAX_REFERENCE_CLASSIFIER_CANDIDATES);
    availableReferenceImageUrls = Array.from(new Set([
      ...competitorReferenceImageUrls,
      ...supplierReferenceImageUrls,
    ])).filter((url) => /^https?:\/\//i.test(url)).slice(0, MAX_REFERENCE_CLASSIFIER_CANDIDATES);
    let referenceMappingStatus = "";
    if (explicitSupplierSku) {
      const shouldVisionFilterReferences = routeId === "vision" || routeId === "web";
      const mappingResult = shouldVisionFilterReferences
        ? await fetchSkuReferenceImageMapping([explicitSupplierSku], supplierReferenceImageUrls, (message) => {
          byId("extractStatus").textContent = message;
        })
        : { mappings: { [explicitSupplierSku.id]: supplierReferenceImageUrls }, unmatched: [], errors: [] };
      if (extractionGeneration !== requestedGeneration) return;
      const allowedUrls = new Set(supplierReferenceImageUrls);
      const intelligentlyMappedUrls = Array.from(new Set(Array.isArray(mappingResult?.mappings?.[explicitSupplierSku.id])
        ? mappingResult.mappings[explicitSupplierSku.id]
        : []))
        .filter((url) => allowedUrls.has(url))
        .slice(0, MAX_REFERENCE_CANDIDATES);
      const mappedUrls = mappingResult?.errors?.length
        ? supplierReferenceImageUrls.slice(0, MAX_REFERENCE_CANDIDATES)
        : intelligentlyMappedUrls;
      const finalUrls = Array.from(new Set([...competitorReferenceImageUrls, ...mappedUrls])).slice(0, MAX_REFERENCE_CANDIDATES);
      referenceImagesBySku = Object.fromEntries(extractedProducts.map((sku) => [
        sku.id,
        sku.id === explicitSupplierSku.id ? finalUrls : [],
      ]));
      referenceImageMetaBySku = Object.fromEntries(extractedProducts.map((sku) => [
        sku.id,
        sku.id === explicitSupplierSku.id
          ? [
            ...competitorReferenceMeta,
            ...(Array.isArray(mappingResult?.referenceMeta?.[explicitSupplierSku.id]) ? mappingResult.referenceMeta[explicitSupplierSku.id] : []),
          ]
          : [],
      ]));
      const rejectedCount = Array.isArray(mappingResult?.unmatched) ? mappingResult.unmatched.length : 0;
      referenceMappingStatus = mappingResult?.errors?.length
        ? `1688资料已绑定到 ${explicitSupplierSku.label || explicitSupplierSku.model || explicitSupplierSku.id}；竞品图前置 ${competitorReferenceImageUrls.length} 张，1688 智能候选筛选失败，已保留 ${mappedUrls.length} 张均衡抽样图供人工选择：${mappingResult.errors.slice(0, 1).join("；")}`
        : `1688资料已绑定到 ${explicitSupplierSku.label || explicitSupplierSku.model || explicitSupplierSku.id}：竞品图前置 ${competitorReferenceImageUrls.length} 张，1688 链接候选保留 ${mappedUrls.length} 张按用途去重的参考图，排除 ${rejectedCount} 张明显无关图片；同款异色最多补充 2 张。`;
    } else if (routeId === "vision" || routeId === "web") {
      const mappingResult = await fetchSkuReferenceImageMapping(extractedProducts, supplierReferenceImageUrls, (message) => {
        byId("extractStatus").textContent = message;
      });
      if (extractionGeneration !== requestedGeneration) return;
      const allowedUrls = new Set(supplierReferenceImageUrls);
      referenceImagesBySku = Object.fromEntries(extractedProducts.map((sku) => [
        sku.id,
        Array.from(new Set([
          ...competitorReferenceImageUrls,
          ...(Array.isArray(mappingResult?.mappings?.[sku.id]) ? mappingResult.mappings[sku.id] : [])
            .filter((url) => allowedUrls.has(url)),
        ])).slice(0, MAX_REFERENCE_CANDIDATES),
      ]));
      referenceImageMetaBySku = Object.fromEntries(extractedProducts.map((sku) => [
        sku.id,
        [
          ...competitorReferenceMeta,
          ...(Array.isArray(mappingResult?.referenceMeta?.[sku.id]) ? mappingResult.referenceMeta[sku.id] : []),
        ],
      ]));
      const assignmentCount = Object.values(referenceImagesBySku).reduce((sum, urls) => sum + urls.length, 0);
      const supplierAssignmentCount = Object.values(mappingResult?.mappings || {}).reduce((sum, urls) => sum + (Array.isArray(urls) ? urls.length : 0), 0);
      const unmatchedCount = Array.isArray(mappingResult?.unmatched) ? mappingResult.unmatched.length : 0;
      referenceMappingStatus = mappingResult?.errors?.length
        ? `SKU 参考图严格匹配未完成，已停止自动分配：${mappingResult.errors.slice(0, 1).join("；")}`
        : `SKU 参考图：竞品图前置 ${competitorReferenceImageUrls.length} 张，1688 建立 ${supplierAssignmentCount} 个严格匹配，候选合计 ${assignmentCount} 张，排除 ${unmatchedCount} 张无法确认或存在冲突的图片。`;
    } else if (extractedProducts.length === 1) {
      referenceImagesBySku = { [extractedProducts[0].id]: availableReferenceImageUrls.slice(0, MAX_REFERENCE_CANDIDATES) };
      referenceImageMetaBySku = { [extractedProducts[0].id]: competitorReferenceMeta };
      referenceMappingStatus = `单 SKU 资料：保留 ${referenceImagesBySku[extractedProducts[0].id].length} 张当前商品参考图。`;
    } else {
      referenceImagesBySku = Object.fromEntries(extractedProducts.map((sku) => [sku.id, competitorReferenceImageUrls.slice(0, MAX_REFERENCE_CANDIDATES)]));
      referenceImageMetaBySku = Object.fromEntries(extractedProducts.map((sku) => [sku.id, competitorReferenceMeta]));
      referenceMappingStatus = competitorReferenceImageUrls.length
        ? `本地分析路线不调用豆包进行 SKU 图片匹配；已将 ${competitorReferenceImageUrls.length} 张竞品图放入候选图前面。`
        : "本地分析路线不调用豆包进行 SKU 图片匹配；多 SKU 参考图保持为空，可手动拖入。";
    }
    renderProductSelect(explicitSupplierSku?.id || extractedProducts[0]?.id);
    renderFields(true);
    renderAll();
    const ocrStatus = supplierSource.imageCount
      ? `1688 图片 OCR：共发现 ${supplierSource.candidateCount || supplierSource.imageCount} 张图片，全局筛选后优先识别 ${supplierSource.imageCount} 张疑似产品详情/参数图，实际成功 ${supplierSource.scannedCount} 张，采纳 ${supplierSource.acceptedCount || 0} 张，其中命中卖点文本 ${supplierSource.sellingPointCount || 0} 张，跳过/失败 ${supplierSource.failedCount} 张。远程图片可能因跨域、防盗链、尺寸过小或内容过滤而跳过。`
      : "未找到可识别的 1688 图片。";
    const ocrAvailability = supplierSource.imageCount && !supplierSource.ocrAvailable
      ? "OCR 引擎未加载成功，已跳过图片文字识别。"
      : "";
    const amazonTemplateStatus = amazonTemplateFile
      ? `Amazon 模板：${useSupplierFileProducts
        ? "多 1688 文件模式已改按文件输出产品，未使用模板款式"
        : mergedAmazonSupplierProducts.length
            ? `${amazonTemplate.products.length} 个子 SKU 款式；常规 listing 参数优先，卖点以1688证据优先、无证据时豆包联网补全${amazonSkuFilter ? `，筛选 ${amazonSkuFilter}` : ""}`
            : `${amazonTemplate.products.length} 个子 SKU 款式${amazonSkuFilter ? `，筛选 ${amazonSkuFilter}` : ""}`}。`
      : "";
    const pastedListStatus = pastedSupplierImageListText ? "、已粘贴链接清单" : "";
    const htmlFileStatus = `1688 HTML：${supplierFiles.length} 个；采集助手图片清单：${supplierImageListFiles.length} 个文件${pastedListStatus}${supplierSource.collectorCandidateCount ? `、过滤去重后 ${supplierSource.collectorCandidateCount} 张` : ""}；参考链接 HTML：${competitorFiles.length} 个${competitorReferenceImageUrls.length ? `，已抽取竞品候选图 ${competitorReferenceImageUrls.length} 张` : ""}。`;
    const supplierFileStatus = useSupplierFileProducts
      ? `多 1688 文件：已按 ${supplierFileProducts.length} 个文件生成 ${supplierFileProducts.length} 个独立产品选项；旧参考链接内容未参与本次提示词。`
      : amazonTemplate.products.length > 1
        ? "多个 Amazon 子 SKU：已保留各 SKU 原始参数与卖点；不会把任一 1688 页面模糊补给其他 SKU。请为每个单品上传其对应 1688 资料；套装组件仍在套装资料确认中指定来源。"
        : "";
    const visionEvidenceCount = supplierSource.visionEvidenceCount || 0;
    const visionErrorText = (supplierSource.visionErrors || []).slice(0, 2).join("；");
    const visionStatus = routeId === "vision" || routeId === "web"
      ? visionEvidenceCount
        ? `豆包识图：已整理 ${visionEvidenceCount} 项带图片证据的信息。`
        : `豆包识图：未整理出可确认信息。${supplierSource.visionMessage || ""}${visionErrorText ? ` 原因：${visionErrorText}` : ""}`
      : "";
    const webStatus = routeId === "web" ? "正在根据已确认的图片事实，继续联网补充仍为空的英文名称、卖点和使用场景。" : "";
    byId("extractStatus").textContent = `已按“${structureRouteName} / ${routeName}”提取 ${extractedProducts.length} 个产品 / 款式。${supplierFileStatus}${amazonTemplateStatus}多网页 HTML 与详情图 OCR 已尝试读取。${htmlFileStatus}${ocrStatus}${ocrAvailability}${visionStatus}${referenceMappingStatus}${webStatus}`;
    if (routeId === "web") {
      autoEnrichSellingPointsIfNeeded();
      autoEnrichUseScenesIfNeeded();
    }
  } finally {
    extractButton.disabled = false;
    extractButton.removeAttribute("aria-busy");
    document.querySelectorAll("[data-extraction-route]").forEach((button) => { button.disabled = false; });
    document.querySelectorAll("[data-product-structure-route]").forEach((button) => { button.disabled = false; });
  }
}

function negativePrompt(facts = null) {
  return compactPromptItems([
    "No wrong product, invented specs, unsupported claims, extra logos, Chinese/source text, dense copy, long labels, bullets, text stacking, blur",
    facts?.bundleComponents ? "No missing bundle component, fused hybrid product, swapped component parameters, or treating bundle components as optional variants" : "",
    "Keep authentic non-Chinese product markings only",
  ], "", 5);
}

function isPlaceholderName(value) {
  const clean = String(value || "").trim();
  const knownPlaceholders = new Set([
    "PRODUCT_NAME",
    "PRODUCT_SPEC",
    "PACKAGING_COUNT",
    "PRODUCT_COUNT_OR_SET",
    "CURRENT_PRODUCT_OPTION",
    "MATERIAL",
    "COLOR",
    "STRUCTURE",
    "COMPATIBLE_USE",
    "USE_SCENE",
    "SELLING_POINT_1",
    "SELLING_POINT_2",
    "VARIANT_LIST",
    "SPEC_LIST",
    "VERIFIED_DIMENSIONS",
    "SIZE_CODE",
    "CUP_RANGE",
  ]);
  return knownPlaceholders.has(clean) || /^[A-Z0-9_ ]+$/.test(clean) && clean.includes("_");
}

function promptValue(value, fallback = "") {
  const clean = cleanTokenValue(value);
  if (!clean || isPlaceholderName(clean)) return fallback;
  return clean;
}

function packagingValue(data) {
  const candidates = [
    cleanTokenValue(data.pack),
    cleanTokenValue(data.packagingCount),
  ].filter(Boolean);
  return candidates.find((value) => /(?:pcs|pieces?|片|pack|包|pairs?|双|件|只|个|set|套)/i.test(value) && !/cups?|人份/i.test(value)) || "";
}

// A supplier/Amazon title can call a mixed bundle "5 Pcs" even when the
// actual contents are, for example, one dispenser plus four refill rolls.
// That is title shorthand, not a homogeneous SKU quantity and must never
// become an on-image count instruction.
function removeGenericPieceCount(value) {
  return cleanFieldDisplayValue(value)
    .replace(/(?:^|[\s/,(])\d+\s*(?:pcs?\.?|pieces?)(?=$|[\s/),])/gi, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/\s*\/\s*$/g, "")
    .trim();
}

function bundleQuantityMeaningRule(facts) {
  if (!facts?.bundleComponents) return "";
  return "Mixed-component bundle quantity rule: the listed components and their individual quantities are the only count meaning. Treat this as one mixed set, never as a multi-pack of identical units. Do not write, label, or imply a generic “N Pieces” count, five refill rolls, or five identical products.";
}

function bundleFullSetDisplayRule(facts) {
  if (!facts?.bundleComponents) return "";
  return `HIGHEST-PRIORITY BUNDLE VISUAL REQUIREMENT: every generated image must visibly show the complete current set together as separate physical items: ${facts.bundleComponents}. The main dispenser/container is not a standalone product; never show it alone or omit the refill/component items. Keep the listed quantities visibly distinct and source-accurate; do not fuse components or substitute them.`;
}

function differentDesignSetPresentationRule(facts, templateId, typeId) {
  if (!facts?.isDifferentDesignSet) return "";
  const count = Number(facts.differentDesignSetCount || 0);
  const setMembers = count > 1 ? `all ${count} different included products` : "all different included products";
  const taskKey = `${templateId}:${typeId}`;
  const isHumanUse = taskKey === "scene:1B";
  const isMultiScene = new Set(["scene:2", "feature:3", "spec:3A", "plantTie:3"]).has(taskKey);
  const isStepSequence = taskKey === "spec:3B";
  const isSetInformation = new Set([
    "scene:3", "scene:4", "scene:7",
    "feature:4", "feature:5", "feature:8",
    "spec:4", "spec:5", "spec:8",
    "plantTie:5",
  ]).has(taskKey);
  const identity = `HIGHEST-PRIORITY DIFFERENT-DESIGN SET IDENTITY: this SKU is one fixed set containing ${setMembers}. Use the selected reference image that clearly shows the complete set as the sole authority for product identity, set membership, and each member's visible form. Reproduce the products directly from that reference; do not infer or reconstruct their form from written descriptions. Other references may guide use, pose, or layout only and must never change the products.`;
  let presentation = `Set presentation: treat the complete group as the hero product and show ${setMembers} as separate, complete, equally important products. The group as a whole satisfies product-size and prominence instructions; no single member may stand in for the set or dominate the other members.`;
  if (isHumanUse) {
    presentation = "Human-use presentation: use one actual referenced set member for the main action, and keep every other different included member together in a clear secondary set view. The action product must remain the same referenced design.";
  } else if (isMultiScene) {
    presentation = "Multi-scene presentation: assign each panel to an actual set member shown in the complete-set reference. Distribute scenes across the different members before reusing any member, and keep the chosen member unchanged in every panel.";
  } else if (isStepSequence) {
    presentation = "Instruction-sequence presentation: choose one actual referenced set member that supports the verified steps and keep that exact member unchanged through every panel. Do not switch, merge, or redesign members during the sequence; the other set members need not appear in this instruction image.";
  } else if (isSetInformation) {
    presentation = `Set-information presentation: give ${setMembers} their own readable view, inset, or information area and keep the full-set relationship obvious. Apply each callout only to the referenced member it actually describes.`;
  } else if (!isMainImageType(typeId)) {
    presentation = "Feature presentation: demonstrate the relevant claim with an actual referenced set member. If multiple members appear, keep each one separate and unchanged; never imply that one member represents the entire mixed-design set.";
  }
  return `${identity} ${presentation}`;
}

function differentDesignSetAvoidRule(facts) {
  if (!facts?.isDifferentDesignSet) return "";
  return "No duplicated member replacing a different design, no hybrid made by merging set members, no missing included design when the complete set is required, no extra design, and no text-invented product form. Do not let a use-scene or layout reference override the complete-set identity reference.";
}

function standaloneAccessoryExclusionRule(facts) {
  if (facts?.bundleComponents) return "";
  const identity = [facts?.productName, facts?.titleSpec, facts?.selectedSpec, facts?.skuOption].filter(Boolean).join(" ");
  const isPetWasteBag = /(?:poop\s*bags?|pet\s*waste\s*bags?|waste\s*bag\s*refills?)/i.test(identity);
  const isDispenserSku = /(?:dispenser|holder|container|case)/i.test(identity);
  if (!isPetWasteBag || isDispenserSku) return "";
  return "HIGHEST-PRIORITY STANDALONE-SKU IDENTITY: this selected SKU sells refill poop bags only. Show only the current bag roll(s), bag pack, or individual bags that are actually included. No dispenser, holder, container, carrying case, lid, clip, loop, leash attachment, or other accessory is included or may appear anywhere in the image.";
}

function refillBagPackCompositionRule(facts) {
  const composition = cleanFieldDisplayValue(facts?.packComposition || "");
  if (!composition) return "";
  return `HIGHEST-PRIORITY VERIFIED PACK COMPOSITION: ${composition}. “${facts.pack || "Total bag count"}” means individual bags only, not rolls or separate product units. If the image shows package quantity, visibly show exactly the listed refill-roll count; never show a wall, stack, or arrangement of ${facts.skuUnitQuantity || "the total bag count"} rolls.`;
}

function cupTypeValue(value) {
  return cleanTokenValue(value)
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part && !/(?:pcs|片|pack|包|cups?|人份)/i.test(part))
    .join(", ");
}

function promptFacts(sku, data) {
  const group = productGroups[sku.groupKey] || sku.group || {};
  const bundleComponents = promptValue(data.bundleComponents || sku.bundleComponents, "");
  const isMixedBundle = Boolean(bundleComponents);
  const productStructureRoute = productStructureRoutePreviews[sku.productStructureRoute]
    ? sku.productStructureRoute
    : (productStructureRoutePreviews[selectedProductStructureRoute] ? selectedProductStructureRoute : "single");
  const isDifferentDesignSet = productStructureRoute === "assortment";
  const differentDesignSetCount = isDifferentDesignSet ? Number(sku.skuUnitQuantity || 0) : 0;
  const rawProductName = promptValue(data.productName, sku.shape || "the product");
  const rawSelectedSpec = promptValue(data.singleSpec, sku.shape || "");
  const productName = isMixedBundle ? removeGenericPieceCount(rawProductName) || rawProductName : rawProductName;
  const selectedSpec = isMixedBundle ? removeGenericPieceCount(rawSelectedSpec) || rawSelectedSpec : rawSelectedSpec;
  const cupType = promptValue(cupTypeValue(group.promptName || sku.shape || selectedSpec), "");
  const rawPack = packagingValue(data);
  const pack = isMixedBundle ? removeGenericPieceCount(rawPack) : rawPack;
  const packComposition = cleanFieldDisplayValue(sku.packComposition || data.packComposition || "");
  // Generic title counts (e.g. 5 Pcs) are disabled for confirmed bundles;
  // their component list is the authoritative quantity source. The same is
  // true for a sourced refill-roll composition: total bags must not turn into
  // a count of physical rolls in an image.
  const hasStructuredPackComposition = Boolean(packComposition);
  const skuUnitQuantity = isMixedBundle || isDifferentDesignSet || hasStructuredPackComposition ? 0 : Number(sku.skuUnitQuantity || 0);
  const skuUnitQuantityLabel = isMixedBundle || isDifferentDesignSet || hasStructuredPackComposition ? "" : cleanFieldDisplayValue(sku.skuUnitQuantityLabel || "");
  const material = promptValue(data.material, "");
  const category = promptValue(data.category, "");
  const color = promptValue(data.color, "");
  const fit = "";
  const scene = promptValue(data.scene, "");
  const feature1 = promptValue(data.feature1, "");
  const feature2 = promptValue(data.feature2, "");
  const feature3 = promptValue(data.feature3, "");
  const variants = promptValue(data.variantList, "");
  const dimensions = promptValue(data.dimensionList, "");
  const cupRange = promptValue(data.cupRange, "");
  const dimension1 = editableParameterParts(data.topWidth, dimensionLabelForData(data, 1)).value;
  const dimension2 = editableParameterParts(data.sideLength, dimensionLabelForData(data, 2)).value;
  const dimension3 = editableParameterParts(data.bottomWidth, dimensionLabelForData(data, 3)).value;
  const weightOrCapacity = editableParameterParts(data.weight, semanticParameterLabel(data, "weight")).value;
  const structure = promptValue(data.structure, sku.structure || "");
  const productStyle = promptValue(data.productStyle, "");
  const packaging = promptValue(data.packaging, "");
  const surfaceFinish = promptValue(data.surfaceFinish, "");
  const detailParameter = promptValue(data.detailParameter, "");
  const installationSteps = cleanFieldDisplayValue(sku.installationSteps || data.installationSteps || "");
  const sellingPointVisualEvidence = Array.isArray(sku.sellingPointVisualEvidence)
    ? sku.sellingPointVisualEvidence
      .map((item) => ({
        claim: cleanFieldDisplayValue(item?.claim || ""),
        evidence: cleanFieldDisplayValue(item?.evidence || ""),
        imageUrl: cleanFieldDisplayValue(item?.imageUrl || item?.image_url || ""),
      }))
      .filter((item) => item.claim && item.evidence && /^https?:\/\//i.test(item.imageUrl))
    : [];
  const titleSpec = stripRepeatedValue(selectedSpec, pack) || productName || selectedSpec;
  const rawSkuOptionSource = sku.sizeCode && !promptItemsOverlap(productName, sku.sizeCode)
    ? sku.sizeCode
    : titleSpec || selectedSpec || sku.sizeCode;
  const extractedSkuColor = promptValue(sku.color || sku.colorEnglish || sku.displayColor, "");
  const skuOptionSource = !color && extractedSkuColor
    ? cleanTokenValue(rawSkuOptionSource)
      .replace(new RegExp(`\\b${extractedSkuColor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "ig"), "")
      .replace(/\s*[/|,;]\s*(?=[/|,;]|$)|^\s*[/|,;]\s*/g, "")
      .replace(/\s{2,}/g, " ")
      .trim()
    : rawSkuOptionSource;
  const skuOption = compactSkuOptionText(skuOptionSource, {
    productName,
    pack,
    skuUnitQuantity,
    skuUnitQuantityLabel,
    material,
    category,
    structure,
    productStyle,
    packaging,
    fit,
    cupRange,
  });
  const specs = [
    selectedSpec,
    pack,
    material,
    structure,
    fit,
    dimensions,
  ].filter(Boolean).join(" / ");

  return {
    productName,
    titleSpec,
    skuOption,
    cupType,
    selectedSpec,
    pack,
    packComposition,
    skuUnitQuantity,
    skuUnitQuantityLabel,
    material,
    category,
    color,
    fit,
    scene,
    feature1,
    feature2,
    feature3,
    bundleComponents,
    productStructureRoute,
    isDifferentDesignSet,
    differentDesignSetCount,
    variants,
    specs,
    dimensions,
    dimension1,
    dimension2,
    dimension3,
    weightOrCapacity,
    structure,
    productStyle,
    packaging,
    surfaceFinish,
    detailParameter,
    installationSteps,
    sellingPointVisualEvidence,
    cupRange,
  };
}

function stripRepeatedValue(value, repeatedValue) {
  const clean = String(value || "").trim();
  const repeated = String(repeatedValue || "").trim();
  if (!clean || !repeated) return clean;
  return clean
    .replace(new RegExp(repeated.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), "")
    .replace(/\s*,\s*,/g, ",")
    .replace(/^[\s,/-]+|[\s,/-]+$/g, "")
    .trim();
}

function stripPromptFragments(value, fragments = []) {
  return fragments.reduce((current, fragment) => {
    const cleanFragment = cleanTokenValue(fragment);
    return cleanFragment ? stripRepeatedValue(current, cleanFragment) : current;
  }, cleanTokenValue(value))
    .replace(/\s*,\s*,/g, ",")
    .replace(/\s*\/\s*\/\s*/g, " / ")
    .replace(/^[\s,/-]+|[\s,/-]+$/g, "")
    .trim();
}

function compactSkuOptionText(value, context = {}) {
  const clean = stripPromptFragments(value, [
    context.productName,
    context.pack,
    context.material,
    context.structure,
    context.fit,
    context.cupRange,
  ]);
  if (!clean) return "";

  const parts = clean
    .split(/\s*(?:\/|\||;|\s+-\s+)\s*/)
    .map((part) => part.replace(/^[\s,/-]+|[\s,/-]+$/g, "").trim())
    .filter(Boolean);
  return uniquePromptItems(parts.length ? parts : [clean]).slice(0, 3).join(" / ");
}

function compactProductName(value) {
  return cleanTokenValue(value)
    .replace(/\s*,\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function compactDisplayTitle(facts, options = {}) {
  const includePack = options.includePack !== false;
  const productName = compactProductName(facts.productName) || "Product";
  const option = compactSkuOptionText(facts.skuOption || shortOptionText(facts), facts);
  const details = uniquePromptItems([
    option,
    includePack ? facts.pack : "",
  ], [productName]).slice(0, includePack ? 2 : 1).join(" / ");
  return displayVariantText([productName, details].filter(Boolean).join(" - ")) || productName;
}

function skuDisplayLabel(sku, data = null) {
  if (!hasExtractedProducts() && sku?.id === emptyExtractedProduct.id) return emptyExtractedProduct.label;
  if (sku.displayLabel) return sku.displayLabel;
  const facts = promptFacts(sku, data || valueMap(sku));
  return compactDisplayTitle(facts, { includePack: true }) || sku.label || sku.id;
}

function promptContextText(facts) {
  return [
    facts.productName,
    facts.titleSpec,
    facts.selectedSpec,
    facts.cupType,
    facts.material,
    facts.structure,
    facts.scene,
    facts.feature1,
    facts.feature2,
    facts.feature3,
    facts.variants,
    facts.detailParameter,
  ].filter(Boolean).join(" ").toLowerCase();
}

function promptIdentityText(facts) {
  return [
    facts.productName,
    facts.titleSpec,
    facts.selectedSpec,
    facts.cupType,
    facts.material,
    facts.structure,
    facts.variants,
    facts.detailParameter,
    facts.bundleComponents,
  ].filter(Boolean).join(" ").toLowerCase();
}

function mainImageRule() {
  return "HIGHEST-PRIORITY MAIN-IMAGE TEXT BAN: create a clean photographic image only. Add absolutely no title, words, letters, numbers, captions, labels, badges, icons, arrows, guide lines, rulers, dimensions, measurements, units, specification panels, or infographic elements anywhere in the image. Do not copy text or parameter graphics from reference images. Preserve only markings physically printed on the real product when they are inseparable from the source-accurate product itself. Product occupies about 85% of the frame.";
}

function mainImageNoAnnotationRule() {
  return "MAIN IMAGE MUST CONTAIN ZERO ADDED TEXT AND ZERO PARAMETER ANNOTATIONS: no title, words, letters, numbers, dimensions, units, measurement arrows, ruler lines, callouts, labels, badges, icons, tables, or specification graphics. Treat any text, dimensions, arrows, or parameter layout visible in an attached reference as forbidden content, not as a layout reference.";
}

function isProductInformationImage(typeId) {
  return String(typeId || "") === "4";
}

function sceneMainProductScaleRule() {
  return "Scene main image scale: the selected product itself must occupy at least 30% of the image area; crop close enough that the product is easy to inspect; scene, props, model, hands, and environment stay secondary.";
}

function multiSceneProductScaleRule() {
  return "Multi-scene scale: in every equal-size panel, the selected product should usually occupy about 12-15% of that panel and never feel tiny; product color, silhouette, and key decoration/structure must stay readable while leaving room for natural action and environment.";
}

function multiSceneEqualPanelRule() {
  return "Multi-scene layout: exactly four equal-size panels in a clean 2x2 grid; no oversized hero panel, no side strip, no stacked sidebar, no masonry collage, and no mixed large-small panel layout.";
}

function scenePhraseInterpretationRule() {
  return "Scene phrases are context labels, not literal actions: use only the scenes provided on the left, reinterpret each phrase as a physically plausible environment for the current product, and do not add example scenes or unrelated lifestyle contexts.";
}

function isMainImageType(typeId) {
  return typeId === "1" || typeId === "1A" || typeId === "1B";
}

function shortTextRule() {
  return "English labels only: selling-point image titles must match the left selling-point count, 1 title group for 1 selling point or 2 title groups for 2 selling points. Use one complete 2-4 word benefit label per selling point, preferring 2-3 words and using the fourth only when needed to preserve a defining mechanism or qualifier such as twist-lock, no-drill, waterproof, load-bearing, removable, or multi-surface. No vague one-word abbreviations, chopped words, full sentence captions, explanations, paragraphs, or secondary subtitles. Parameter labels stay 2-4 words max; summary feature labels stay 1-3 words max; no badges, repeated claims, or text stacking.";
}

function humanSceneRule(facts) {
  return "People optional; product remains the focus.";
}
function sharedVisualRules(facts, typeId = "") {
  return [
    "4K clarity and sharp realistic detail.",
    isMainImageType(typeId) ? mainImageRule() : shortTextRule(),
    humanSceneRule(facts),
  ].filter(Boolean).join(" ");
}

function neutralProductSceneFallback() {
  return "";
}

function neutralProductSceneListFallback() {
  return "";
}

function normalizedScenePhrase(value) {
  return String(value || "")
    .replace(/^(?:scene category|use scenes?|usage scenarios?)\s*:\s*/i, "")
    .replace(/\s+/g, " ")
    .replace(/[.。]+$/g, "")
    .trim();
}

function isUsableEnglishScene(value) {
  const clean = normalizedScenePhrase(value);
  return clean.length >= 6
    && clean.length <= 70
    && !/[\u3400-\u9fff]/.test(clean)
    && /^[\x00-\x7F]+$/.test(clean)
    && (clean.match(/[a-z]+/gi) || []).length >= 2
    && !/^(?:scene selection task|do not|because use scene)/i.test(clean);
}

function currentSceneResearchFacts() {
  const sku = selectedSku();
  const values = valueMap(sku || {});
  const overrides = fieldOverridesBySku[sku?.id || ""] || fieldOverrides;
  return {
    ...values,
    ...Object.fromEntries(Object.entries(overrides).map(([key, value]) => [key, cleanFieldDisplayValue(value)])),
    selectedSpec: values.singleSpec || sku?.selectedSpec || sku?.size || "",
  };
}

function applyOnlineProductKeyword(skuId, keyword) {
  const clean = String(keyword || "").replace(/\s+/g, " ").trim();
  if (!skuId || !/^[\x00-\x7F]{4,120}$/.test(clean) || (clean.match(/[A-Za-z]+/g) || []).length < 2) return false;
  const existingOverrides = fieldOverridesBySku[skuId] || {};
  if (cleanFieldDisplayValue(existingOverrides.productName)) return false;
  const sku = currentProducts().find((item) => item.id === skuId);
  if (!sku) return false;
  sku.onlineProductKeyword = clean;
  fieldOverrides.productName = clean;
  fieldOverridesBySku[skuId] = { ...existingOverrides, productName: clean };
  const input = byId("field-productName");
  if ((selectedSku()?.id || "") === skuId && input) input.value = clean;
  renderProductSelect(skuId);
  return true;
}

function useSceneSearchQuery(facts) {
  const identity = compactPromptItems([
    facts.productName,
    facts.selectedSpec,
    facts.structure,
  ], "product", 3);
  return `${identity} common uses occasions where used`;
}

function isUsableEnglishSellingPoint(value) {
  const clean = String(value || "").replace(/\s+/g, " ").trim();
  const wordCount = (clean.match(/[A-Za-z]+/g) || []).length;
  return clean.length >= 6
    && clean.length <= 120
    && /^[\x00-\x7F]+$/.test(clean)
    && wordCount >= 3
    && wordCount <= 12;
}

async function fetchLocalSellingPointProxy(facts, timeoutMs = 55000) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch("/api/selling-points", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productName: facts.productName || "",
        selectedSpec: facts.selectedSpec || "",
        material: facts.material || "",
        structure: facts.structure || "",
        detailParameter: facts.detailParameter || "",
        sourceFingerprint: currentSourceFingerprint(),
      }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function enrichSellingPointsOnline() {
  const sku = selectedSku();
  const skuId = sku?.id || "";
  const feature1Input = byId("field-feature1");
  const feature2Input = byId("field-feature2");
  if (!skuId || !feature1Input || !feature2Input || !hasExtractedProducts()) return;
  const requestedRevision = sellingPointInputRevision;
  const requestedGeneration = extractionGeneration;
  const status = byId("extractStatus");
  const statusPrefix = status?.textContent || "";
  if (status) status.textContent = `${statusPrefix} 1688未提取到有效卖点，正在由豆包联网查证…`;
  try {
    const facts = currentSceneResearchFacts();
    const data = await fetchLocalSellingPointProxy(facts);
    if (extractionGeneration !== requestedGeneration || (selectedSku()?.id || "") !== skuId || sellingPointInputRevision !== requestedRevision) return;
    applyOnlineProductKeyword(skuId, data?.english_product_keyword);
    const points = uniqueSellingPoints((Array.isArray(data?.selling_points) ? data.selling_points : [])
      .map((point) => String(point || "").replace(/\s+/g, " ").trim())
      .filter(isUsableEnglishSellingPoint), 4);
    const feature1 = sellingPointGroupText(distributedSellingPointGroups(points, 0, 2, 4));
    const feature2 = sellingPointGroupText(distributedSellingPointGroups(points, 1, 2, 4));
    feature1Input.value = feature1;
    feature2Input.value = feature2;
    fieldOverrides.feature1 = feature1;
    fieldOverrides.feature2 = feature2;
    fieldOverridesBySku[skuId] = {
      ...(fieldOverridesBySku[skuId] || {}),
      feature1,
      feature2,
    };
    appliedSellingPointOverridesBySku[skuId] = { feature1, feature2 };
    sku.sellingPointSource = points.length ? "Doubao Web Search" : NO_REFERENCE_SELLING_POINT_MESSAGE;
    sellingPointDraftDirty = false;
    captureFieldOverrides();
    fieldSnapshot = currentFieldSignature();
    renderAll();
    if (status) {
      status.textContent = points.length && Array.isArray(data?.sources) && data.sources.length
        ? `${statusPrefix} 1688未提取到有效卖点；豆包已基于网络证据补全 ${points.length} 个英文卖点。`
        : `${statusPrefix} ${NO_REFERENCE_SELLING_POINT_MESSAGE}`;
    }
  } catch {
    if (extractionGeneration !== requestedGeneration || (selectedSku()?.id || "") !== skuId || sellingPointInputRevision !== requestedRevision) return;
    feature1Input.value = "";
    feature2Input.value = "";
    sku.sellingPointSource = NO_REFERENCE_SELLING_POINT_MESSAGE;
    if (status) status.textContent = `${statusPrefix} ${NO_REFERENCE_SELLING_POINT_MESSAGE}`;
  }
}

function autoEnrichSellingPointsIfNeeded() {
  const skuId = selectedSku()?.id || "";
  if (!skuId || sellingPointResearchAttemptedBySku.has(skuId)) return;
  const points = uniqueSellingPoints([
    ...splitSellingPointText(byId("field-feature1")?.value || ""),
    ...splitSellingPointText(byId("field-feature2")?.value || ""),
  ], 4).filter((point) => !isOrdinaryMaterialSellingPoint(point) && sellingPointKey(point) !== "material");
  if (points.length) {
    selectedSku().sellingPointSource = "1688 source evidence";
    return;
  }
  sellingPointResearchAttemptedBySku.add(skuId);
  enrichSellingPointsOnline();
}

async function fetchLocalUseSceneProxy(facts, timeoutMs = 55000) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch("/api/use-scenes", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productName: facts.productName || "",
        selectedSpec: facts.selectedSpec || "",
        material: facts.material || "",
        structure: facts.structure || "",
        detailParameter: facts.detailParameter || "",
        feature1: facts.feature1 || "",
        feature2: facts.feature2 || "",
        feature3: facts.feature3 || "",
        sourceFingerprint: currentSourceFingerprint(),
      }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function fetchOnlineUseSceneResearch(facts) {
  const data = await fetchLocalUseSceneProxy(facts);
  return {
    query: String(data?.query || useSceneSearchQuery(facts)),
    englishProductKeyword: String(data?.english_product_keyword || ""),
    searchQueries: Array.isArray(data?.search_queries) ? data.search_queries : [],
    sources: Array.isArray(data?.sources) ? data.sources : [],
    scenes: Array.isArray(data?.scenes) ? data.scenes : [],
  };
}

function suggestedUseSceneItems(facts, research = {}, limit = 5) {
  const researched = (research.scenes || [])
    .map(normalizedScenePhrase)
    .filter(isUsableEnglishScene);
  const seen = new Set();
  return researched.filter((item) => {
    const key = comparablePromptItem(item);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, Math.max(3, Math.min(limit, 5)));
}

async function enrichUseScenesOnline() {
  const button = byId("enrichUseScenes");
  const status = byId("sceneEnrichStatus");
  const input = byId("field-scene");
  if (!button || !status || !input || !hasExtractedProducts()) return;
  const requestedSkuId = selectedSku()?.id || "";
  const requestedSceneRevision = sceneInputRevision;
  const requestedGeneration = extractionGeneration;
  button.disabled = true;
  button.setAttribute("aria-busy", "true");
  status.textContent = "正在联网查阅适合当前产品的使用场景…";
  try {
    const facts = currentSceneResearchFacts();
    const research = await fetchOnlineUseSceneResearch(facts);
    if (extractionGeneration !== requestedGeneration || (selectedSku()?.id || "") !== requestedSkuId) return;
    if (sceneInputRevision !== requestedSceneRevision) {
      status.textContent = "场景已手动修改，已保留当前输入，未覆盖。";
      return;
    }
    applyOnlineProductKeyword(requestedSkuId, research.englishProductKeyword);
    const scenes = suggestedUseSceneItems({ ...facts, scene: input.value }, research, 5);
    input.value = scenes.join("\n");
    fieldOverrides.scene = input.value;
    if (requestedSkuId) {
      fieldOverridesBySku[requestedSkuId] = {
        ...(fieldOverridesBySku[requestedSkuId] || {}),
        scene: input.value,
      };
    }
    captureFieldOverrides();
    fieldSnapshot = currentFieldSignature();
    renderAll();
    status.textContent = scenes.length && research.sources.length
      ? `已用跨境关键词“${research.englishProductKeyword}”联网补全 ${scenes.length} 个英文场景，可继续手动修改。`
      : NO_REFERENCE_SCENE_MESSAGE;
  } catch (error) {
    if (extractionGeneration !== requestedGeneration || (selectedSku()?.id || "") !== requestedSkuId) return;
    if (sceneInputRevision !== requestedSceneRevision) {
      status.textContent = "场景已手动修改，已保留当前输入，未覆盖。";
      return;
    }
    input.value = "";
    captureFieldOverrides();
    renderAll();
    status.textContent = NO_REFERENCE_SCENE_MESSAGE;
  } finally {
    button.disabled = false;
    button.removeAttribute("aria-busy");
  }
}

function autoEnrichUseScenesIfNeeded() {
  const sceneItems = splitUseSceneText(byId("field-scene")?.value || "")
    .flatMap((item) => item.split(/[,，]+/))
    .filter(Boolean);
  if (hasExtractedProducts() && sceneItems.length < 3) enrichUseScenesOnline();
}

function hasVerifiedUseContext(facts) {
  return Boolean(cleanFieldDisplayValue(facts?.scene || ""));
}

function recommendedUseSceneItems(facts, limit = 4) {
  return [];
}

function recommendedUseSceneText(facts, fallback = neutralProductSceneFallback(), limit = 4) {
  return "";
}

function useSceneText(facts, fallback = neutralProductSceneFallback(), limit = 4) {
  const sceneText = cleanFieldDisplayValue(facts?.scene || "");
  return sceneText ? splitUseSceneText(sceneText).join(" / ") : "";
}

function verifiedProductDetailFallback() {
  return "";
}

function evidenceSceneStyleRule(facts) {
  const sceneText = cleanFieldDisplayValue(facts?.scene || "");
  return sceneText
    ? `Verified source scene/background: ${sceneText}.`
    : "No reference scene information. Do not invent, infer, or add a usage scene.";
}

function useSceneAuthorityRule(facts) {
  const scene = cleanFieldDisplayValue(facts?.scene || "");
  const nonSceneFacts = [facts?.productName, facts?.titleSpec, facts?.detailParameter, facts?.structure]
    .map((value) => cleanFieldDisplayValue(value))
    .filter(Boolean)
    .join(" ");
  const excludedContexts = [
    { source: /\b(?:christmas|xmas|holiday)\b/i, allowed: /\b(?:christmas|xmas|holiday)\b/i, label: "Christmas or holiday setting, Christmas tree, ornaments, gifts, seasonal decorations, or festive background" },
    { source: /\b(?:halloween)\b/i, allowed: /\b(?:halloween)\b/i, label: "Halloween setting or decorations" },
    { source: /\b(?:wedding|bridal)\b/i, allowed: /\b(?:wedding|bridal)\b/i, label: "wedding or bridal setting" },
  ]
    .filter((item) => item.source.test(nonSceneFacts) && !item.allowed.test(scene))
    .map((item) => item.label);
  return compactPromptItems([
    "HIGHEST-PRIORITY USE-SCENE LOCK: the editable Use Scene field is the only authority for environment, occasion, season, room, background, props, and lifestyle context. Product-name keywords, Detail Features, supplier titles, and attached reference backgrounds describe identity/evidence only and must never add a scene that is absent from the current Use Scene field.",
    excludedContexts.length && `Explicitly excluded because the user removed it from Use Scene: ${excludedContexts.join("; ")}.`,
  ], "", 2);
}

function basicImageRequirements(templateId, typeId, extra = "") {
  const parts = ["1:1 Amazon listing image", "4K clarity", "sharp realistic detail"];
  if (isMainImageType(typeId)) {
    parts.push("no added overlay text", "preserve authentic non-Chinese product/packaging markings only");
    if (templateId === "feature") {
      parts.push("pure white background", "product occupies about 85% of the frame");
    } else {
      parts.push(sceneMainProductScaleRule());
      parts.push("when no verified scene exists, use a plain neutral studio background only; do not invent a usage scene");
    }
  } else {
    parts.push("verified overlay text only when useful");
  }
  if (extra) parts.push(extra);
  return compactPromptItems(parts, "", 8);
}

function noChineseTextRule() {
  return "No Chinese text; keep authentic non-Chinese product markings only.";
}

function visualProofFirstRule() {
  return "Visual proof first: use action, close-ups, icons, arrows, or measurements; text is only a short locator.";
}

function imageMeasurementUnitRule() {
  return "On-image length labels use inches (in); convert source cm/mm.";
}

function amazonImageFileSizeRule() {
  return "Final image file <= 5 MB.";
}

function formatInches(value) {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2).replace(/0+$/g, "").replace(/\.$/, "");
}

function convertLengthNumberToInches(numberText, unit) {
  const value = Number.parseFloat(numberText);
  if (!Number.isFinite(value)) return `${numberText} ${unit}`;
  const normalizedUnit = String(unit || "").toLowerCase();
  const inches = normalizedUnit === "mm" ? value / 25.4 : normalizedUnit === "cm" ? value / 2.54 : value;
  return `${formatInches(inches)} in`;
}

function convertLengthUnitsToInches(value) {
  return String(value || "")
    .replace(/([0-9]+(?:\.[0-9]+)?)\s*(cm|mm)\b/gi, (_, numberText, unit) => convertLengthNumberToInches(numberText, unit))
    .replace(/([0-9]+(?:\.[0-9]+)?)\s*(?:厘米|公分)/gi, (_, numberText) => convertLengthNumberToInches(numberText, "cm"))
    .replace(/([0-9]+(?:\.[0-9]+)?)\s*毫米/gi, (_, numberText) => convertLengthNumberToInches(numberText, "mm"));
}

function dimensionText(facts) {
  const weightLabel = /(?:\bkg\b|\bg\b|\blb\b|pounds?|千克|克|磅)/i.test(facts.weightOrCapacity || "")
    ? "Weight"
    : "Weight / Capacity";
  const editableItems = [
    facts.dimension1 && `${dimensionLabelForFacts(facts, 1)}: ${convertLengthUnitsToInches(facts.dimension1)}`,
    facts.dimension2 && `${dimensionLabelForFacts(facts, 2)}: ${convertLengthUnitsToInches(facts.dimension2)}`,
    facts.dimension3 && `${dimensionLabelForFacts(facts, 3)}: ${convertLengthUnitsToInches(facts.dimension3)}`,
    facts.weightOrCapacity && `${weightLabel}: ${facts.weightOrCapacity}`,
  ].filter(Boolean);
  if (editableItems.length) return editableItems.join(" / ");

  const evidenceItems = dimensionListItems(facts.dimensions, promptContextText(facts));
  return evidenceItems
    .map((item) => convertLengthUnitsToInches(item))
    .join(" / ");
}

function referenceImageDimensionRule() {
  return "Editable-parameter lock: the current Dimension 1/2/3 and Weight fields are the authoritative measurement list. Reproduce only the non-empty values currently present in those fields, with their current semantic prefixes. Never restore a value that the user cleared, and never copy an omitted, stale, or conflicting measurement from a reference image. Reference images may guide product shape and measurement-arrow placement only. Convert cm/mm to inches for on-image text; do not merge measurements or invent values.";
}

function dimensionLabelForFacts(facts, index) {
  return dimensionLabelForData({
    dimensionList: facts?.dimensions || "",
    productName: facts?.productName || "",
    structure: facts?.structure || "",
  }, index);
}

function productDetailText(facts, extraItems = [], limit = 8) {
  const option = compactSkuOptionText(facts.skuOption || shortOptionText(facts), facts);
  const structureIncludesTechnology = facts.structure && facts.surfaceFinish
    && comparablePromptItem(facts.structure).includes(comparablePromptItem(facts.surfaceFinish));
  const extraText = comparablePromptItem(extraItems.join(" "));
  const extraIncludesMaterial = facts.material && promptItemsOverlap(extraText, facts.material);
  const extraIncludesStructure = facts.structure && promptItemsOverlap(extraText, facts.structure);
  const extraIncludesColor = facts.color && promptItemsOverlap(extraText, facts.color);
  const extraIncludesSurfaceFinish = facts.surfaceFinish && promptItemsOverlap(extraText, facts.surfaceFinish);
  const detailValue = visibleDetailParameter(facts.detailParameter);
  const extraIncludesDetail = detailValue && promptItemsOverlap(extraText, detailValue);
  const extraIncludesPack = facts.pack && promptItemsOverlap(extraText, facts.pack);
  const color = specificPromptValue(facts.color, "");
  return compactSpecificPromptItems([
    `Product: ${facts.productName}`,
    facts.category && `Category: ${facts.category}`,
    !facts.isDifferentDesignSet && option && `Current option: ${option}`,
    facts.bundleComponents && `Included components: ${facts.bundleComponents}`,
    facts.packComposition && `Verified pack composition: ${facts.packComposition}`,
    color && !extraIncludesColor && `Color: ${color}`,
    referenceColorLockText(facts),
    ...extraItems,
    specificPromptValue(facts.material, "") && !extraIncludesMaterial && `Material: ${facts.material}`,
    facts.cupRange && `Size / range: ${facts.cupRange}`,
    facts.pack && !extraIncludesPack && `Count / set: ${facts.pack}`,
    !facts.isDifferentDesignSet && specificPromptValue(facts.structure, "") && !extraIncludesStructure && `Structure: ${facts.structure}`,
    facts.productStyle && `Product style: ${facts.productStyle}`,
    specificPromptValue(facts.surfaceFinish, "") && !structureIncludesTechnology && !extraIncludesSurfaceFinish && `Technology: ${facts.surfaceFinish}`,
    detailValue && !extraIncludesDetail && `Texture detail: ${detailValue}`,
  ], "", limit);
}

function referenceColorLockText(facts) {
  return specificPromptValue(facts?.color, "")
    ? "Match source color exactly; no hue/brightness shift."
    : "";
}

function productIdentityLockText(facts) {
  return compactPromptItems([
    facts.isDifferentDesignSet
      ? "Identity lock: reproduce the fixed mixed-design set directly from the complete-set reference; written product fields do not define product form."
      : "Identity lock: exact source product; no substitute, redesign, or invented detail.",
    facts.bundleComponents && "Bundle identity lock: show every included component as separate physical items in one set; no fused hybrid product, no missing component, no component substitution.",
    facts.bundleComponents && `Included bundle components: ${facts.bundleComponents}`,
    bundleQuantityMeaningRule(facts),
    facts.productName && `Exact product type/name: ${facts.productName}`,
    !facts.isDifferentDesignSet && facts.selectedSpec && `Exact option/spec: ${shortOptionText(facts) || facts.selectedSpec}`,
    facts.color && `Exact color: ${facts.color}`,
    facts.material && `Exact material: ${facts.material}`,
    !facts.isDifferentDesignSet && facts.structure && `Exact visible structure: ${facts.structure}`,
    facts.pack && `Pack count if shown: ${facts.pack}`,
    "Keep authentic markings.",
  ], "", 8);
}

function productIdentityBasicRule(facts) {
  if (!facts) return "";
  const option = compactSkuOptionText(facts.skuOption || shortOptionText(facts), facts);
  return compactPromptItems([
    facts.isDifferentDesignSet ? "" : "Product identity lock comes first: exact selected current product only; no category substitution, no redesign, no invented parts.",
    facts.bundleComponents && "Bundle rule: this is one bundled listing; show all included components together as separate items, not alternative options.",
    facts.bundleComponents && `Included components: ${facts.bundleComponents}`,
    bundleQuantityMeaningRule(facts),
    facts.productName && `Product: ${facts.productName}`,
    !facts.isDifferentDesignSet && option && `Option: ${option}`,
    facts.color && `Color: ${facts.color}`,
    facts.material && `Material: ${facts.material}`,
    !facts.isDifferentDesignSet && facts.structure && `Structure: ${facts.structure}`,
  ], "", 7);
}

function sceneProductDetailText(facts, extraItems = [], limit = 8) {
  return productDetailText(facts, extraItems, limit);
}

function sceneContextProductDetailText(facts, extraItems = [], limit = 5) {
  const option = compactSkuOptionText(facts.skuOption || shortOptionText(facts), facts);
  return compactSpecificPromptItems([
    `Product: ${facts.productName}`,
    option && `Current option: ${option}`,
    referenceColorLockText(facts),
    "Product accuracy: product must stay recognizable and match the source product, but the complete use environment is the main visual priority.",
    ...extraItems,
  ], "", limit);
}

function overallStyleText(facts, typeId, extra = "", options = {}) {
  const isReferenceControlledSellingPoint = /Selling-point reference priority/i.test(extra);
  return compactPromptItems([
    isReferenceControlledSellingPoint ? "" : evidenceSceneStyleRule(facts),
    extra,
  ], "", 3);
}

function isSkuQuantityExplanationImage(templateId, typeId) {
  const roles = {
    scene: new Set(["4"]),
    spec: new Set(["4", "7", "8"]),
    feature: new Set(["4", "7", "8"]),
    plantTie: new Set(["5"]),
    reference: new Set(["3", "6"]),
  };
  return Boolean(roles[templateId]?.has(String(typeId || "")));
}

function skuQuantityExplanationRule(facts, templateId, typeId) {
  const count = Number(facts?.skuUnitQuantity || 0);
  if (count < 2 || !isSkuQuantityExplanationImage(templateId, typeId)) return "";
  const label = cleanFieldDisplayValue(facts.skuUnitQuantityLabel) || `${count}-Pack`;
  return `SUPPORTING SKU QUANTITY FACT FROM THE CURRENT AMAZON TITLE: ${label}, exactly ${count} individual complete product units in this selected SKU. Keep the product's form, material, construction, dimensions, function, and use information as the main visual hierarchy. Show the quantity only once as a compact secondary pack-contents area occupying no more than about 20-25% of the frame, with one clear English label “${label}” or “${count} Pieces”. Do not turn the image into a repeated-unit wall, dominant full-pack grid, or large quantity poster. Do not show, label, or imply any other quantity.`;
}

function skuQuantityMainImageRule(facts, typeId) {
  const count = Number(facts?.skuUnitQuantity || 0);
  if (count < 2 || !isMainImageType(typeId)) return "";
  const label = cleanFieldDisplayValue(facts.skuUnitQuantityLabel) || `${count}-Pack`;
  return `MULTI-PACK SUPPORTING INFORMATION RULE: this SKU is ${label}. Keep one or a few representative units large and clearly inspectable so product shape, material, construction, finish, and use remain the primary visual information. The complete included quantity may appear only as a compact secondary grouped arrangement occupying no more than about 20-25% of the frame; it must never become the largest subject, a repeated-unit wall, or a dominant full-pack grid. When the complete set is visible, keep exactly ${count} separate units without fusion, extras, or an incorrect count. For a human-use main image, the action and representative product units remain primary while the remaining included units stay compact and secondary. Because this is a main image, do not add a “${label}” badge, number, caption, or other overlay text.`;
}

function buildPromptSections({ facts, templateId, typeId, basic = "", details = "", style = "", negative = "", includeNegative = true }) {
  const skuQuantityRule = skuQuantityExplanationRule(facts, templateId, typeId);
  const skuQuantityMainRule = skuQuantityMainImageRule(facts, typeId);
  const differentDesignSetRule = differentDesignSetPresentationRule(facts, templateId, typeId);
  const sceneAuthorityRule = templateId === "scene" ? useSceneAuthorityRule(facts) : "";
  const referenceControlledSellingPoint = /Selling-point reference priority/i.test([details, style].filter(Boolean).join(" "));
  const referenceMode = referenceControlledSellingPoint ? "selling-point" : "";
  const priorityText = compactPromptItems([
    isMainImageType(typeId) ? mainImageNoAnnotationRule() : "",
    sceneAuthorityRule,
    differentDesignSetRule,
    skuQuantityMainRule,
    skuQuantityRule,
    bundleFullSetDisplayRule(facts),
    standaloneAccessoryExclusionRule(facts),
    refillBagPackCompositionRule(facts),
    productIdentityBasicRule(facts),
    basic || basicImageRequirements(templateId, typeId),
  ], "", 10);
  const visualText = promptVisualSubsections(
    [details || productDetailText(facts), skuQuantityMainRule, skuQuantityRule].filter(Boolean).join(" / "),
    style || overallStyleText(facts, typeId)
  );
  const textRules = compactPromptItems([
    isMainImageType(typeId) ? mainImageNoAnnotationRule() : noChineseTextRule(),
    isMainImageType(typeId) ? "" : typeId === "3B"
      ? "Installation-step text only: title 2-3 English words; exactly one numbered 2-5 word English action caption per panel; no selling-point labels, paragraphs, badges, or extra copy."
      : shortTextRule(),
    isMainImageType(typeId) || referenceControlledSellingPoint ? "" : visualProofFirstRule(),
    skuQuantityRule ? `Mandatory SKU quantity text: show “${facts.skuUnitQuantityLabel || `${facts.skuUnitQuantity}-Pack`}” clearly once; the visible complete-unit count must equal ${facts.skuUnitQuantity}.` : "",
    humanSceneRule(facts),
    isProductInformationImage(typeId) ? imageMeasurementUnitRule() : "",
    amazonImageFileSizeRule(),
    referenceRuleText(referenceMode),
  ], "", 6);
  const sections = [
    promptSection("PRIORITY", priorityText),
    promptSection("VISUAL", visualText),
    promptSection("TEXT", textRules),
  ];
  if (includeNegative) {
    sections.push(promptSection("AVOID", compactPromptItems([
      isMainImageType(typeId) ? "No added text of any kind; no numbers, dimensions, measurement units, arrows, ruler lines, callouts, labels, badges, icons, tables, parameter cards, or infographic layout, even when a reference image contains them." : "",
      sceneAuthorityRule && "No environment, occasion, seasonal styling, background, or props absent from the current editable Use Scene field; reference-image backgrounds cannot override this exclusion.",
      negative || negativePrompt(facts),
      differentDesignSetAvoidRule(facts),
      standaloneAccessoryExclusionRule(facts) && "No poop-bag dispenser, holder, container, carrying case, lid, clip, loop, leash attachment, or bundled accessory; do not turn refill bags into a dispenser set.",
      facts.packComposition && "No depiction, label, or implication that the total bag count is a count of refill rolls; no 60-roll stack, grid, wall, or quantity display. Show only the verified refill-roll composition when a count is visible.",
      referenceControlledSellingPoint ? sellingPointEvidenceAvoidRule() : "",
      skuQuantityMainRule ? `No dominant full-pack lineup, repeated-unit wall, large quantity grid, or pack arrangement occupying more than about 20-25% of the frame; no wrong count, fused products, or extra units in the compact secondary pack view.` : "",
      skuQuantityRule ? `No dominant full-pack lineup, repeated-unit wall, or large quantity poster; keep the labeled pack-contents proof secondary and within about 20-25% of the frame; no wrong count, fused products, or extra units.` : "",
    ], "", 10)));
  }
  return sections.join("\n\n");
}

function promptSection(label, value) {
  const clean = normalizePromptLines(value);
  const lines = clean.split("\n").filter(Boolean);
  const formatted = lines.length > 1
    ? lines.map((line) => ensurePromptPeriod(line)).join("\n")
    : ensurePromptPeriod(clean);
  return `${label}:\n${formatted}`;
}

function promptVisualSubsections(details, style) {
  const productFacts = normalizePromptLines(details).replace(/\n+/g, " / ");
  const styleGroups = sceneCompositionGroups(style);
  return [
    productFacts && `PRODUCT FACTS: ${productFacts}`,
    "SCENE & COMPOSITION:",
    ...styleGroups.map(([label, value]) => value ? `${label}: ${value}` : ""),
  ].filter(Boolean).join("\n");
}

function sceneCompositionGroups(style) {
  const clauses = splitPromptClauses(style);
  const groups = {
    scene: [],
    composition: [],
    text: [],
    guardrails: [],
    other: [],
  };
  clauses.forEach((clause) => {
    const lower = clause.toLowerCase();
    if (/\b(?:no|do not|don't|never|avoid|must not|unless verified|unsupported|unverified|wrong|invented|preserve|authentic|source-accurate|exact|lock|stay accurate|remains clear|distinct from)\b/.test(lower)) {
      groups.guardrails.push(clause);
    } else if (/\b(?:text|label|labels|title|headline|caption|callout|typography|wordart|sticker|badge|slogan|claim block)\b/.test(lower)) {
      groups.text.push(clause);
    } else if (/\b(?:composition|layout|grid|panel|poster|inset|close-up|macro|angle|centered|dominant|occupies|frame|hierarchy|padding|line break|ruler|arrow|measured|main subject)\b/.test(lower)) {
      groups.composition.push(clause);
    } else if (/\b(?:scene|background|lifestyle|hero|use|environment|product-theme|category|premium|studio|human|model|props|action|proof|demo|show)\b/.test(lower)) {
      groups.scene.push(clause);
    } else {
      groups.other.push(clause);
    }
  });
  return [
    ["SCENE DIRECTION", compactPromptItems(groups.scene, "", 4)],
    ["COMPOSITION / LAYOUT", compactPromptItems(groups.composition, "", 5)],
    ["TEXT / CALLOUTS", compactPromptItems(groups.text, "", 4)],
    ["ACCURACY GUARDRAILS", compactPromptItems(groups.guardrails, "", 4)],
    ["OTHER STYLE", compactPromptItems(groups.other, "", 3)],
  ];
}

function splitPromptClauses(value) {
  return String(value || "")
    .split(/\s+\/\s+|[.!?]\s+/)
    .map((item) => item
      .replace(/\s+/g, " ")
      .replace(/[.。]+$/g, "")
      .trim())
    .filter(Boolean);
}

function normalizePromptLines(value) {
  return String(value || "")
    .split(/\n+/)
    .map((line) => line
      .replace(/\s+/g, " ")
      .replace(/[.。]+$/g, "")
      .trim())
    .filter(Boolean)
    .join("\n");
}

function ensurePromptPeriod(value) {
  const clean = String(value || "")
    .replace(/\s+/g, " ")
    .trim();
  if (!clean) return "";
  if (/:$/.test(clean)) return clean;
  return /[.!?。]$/.test(clean) ? clean : `${clean}.`;
}

function promptCardKey(sku, template, type) {
  return [sku?.id || "sku", template?.id || "template", type?.id || "type"].join("::");
}

function promptTextForLanguage(englishPrompt, language) {
  return language === "zh" ? translatePromptToChinese(englishPrompt) : englishPrompt;
}

function translatePromptToChinese(prompt) {
  return translatePromptSegment(prompt);
}

function translatePromptSegment(segment) {
  const replacements = [
    [/^PRIORITY:$/gm, "优先级:"],
    [/^VISUAL:$/gm, "视觉画面:"],
    [/^TEXT:$/gm, "文字规则:"],
    [/^AVOID:$/gm, "避免事项:"],
    [/^PRODUCT FACTS:/gm, "产品事实:"],
    [/^SCENE & COMPOSITION:/gm, "场景构图:"],
    [/^SCENE DIRECTION:/gm, "场景方向:"],
    [/^COMPOSITION \/ LAYOUT:/gm, "构图布局:"],
    [/^TEXT \/ CALLOUTS:/gm, "文字标注:"],
    [/^ACCURACY GUARDRAILS:/gm, "准确性约束:"],
    [/^OTHER STYLE:/gm, "其他风格:"],
    [/"Size Reference"/g, "“尺寸参考”"],
    [/"Product Details"/g, "“产品详情”"],
    [/"Product Information"/g, "“产品信息”"],
    [/"Choose Your Color"/g, "“选择颜色”"],
    [/"Choose Your Style"/g, "“选择款式”"],
    [/"What You Get"/g, "“套装内容”"],
    [/"Complete Set"/g, "“完整套装”"],
    [/\bSize Reference\b/g, "尺寸参考"],
    [/\bProduct Details\b/g, "产品详情"],
    [/\bProduct Information\b/g, "产品信息"],
    [/\bChoose Your Color\b/g, "选择颜色"],
    [/\bChoose Your Style\b/g, "选择款式"],
    [/\bWhat You Get\b/g, "套装内容"],
    [/\bComplete Set\b/g, "完整套装"],
    [/\bProduct-first proof scene\b/g, "产品优先的证明场景"],
    [/\bPremium product-theme hero scene\b/g, "高级产品主题主视觉场景"],
    [/\bRealistic lifestyle use scene\b/g, "真实生活方式使用场景"],
    [/\bPure white Amazon main image\b/g, "亚马逊纯白底主图"],
    [/\bSize-reference parameter infographic\b/g, "尺寸参考参数信息图"],
    [/\bPremium option showcase\b/g, "高级选项展示"],
    [/\bBundle included-components showcase\b/g, "套装内含组件展示"],
    [/\bMatch source color exactly\b/gi, "严格匹配来源颜色"],
    [/\bno hue\/brightness shift\b/gi, "不要色相/亮度偏移"],
    [/\bproduct hero\b/gi, "产品主体"],
    [/\bany human presence stays secondary\b/gi, "人物存在也保持次要"],
    [/\btemplate Image\b/gi, "模板图"],
    [/\bScene template Image\b/gi, "场景模板图"],
    [/\bSpec template Image\b/gi, "规格模板图"],
    [/\bFeature template Image\b/gi, "功能模板图"],
    [/\bReference template Image\b/gi, "参考模板图"],
    [/\bKeep authentic non-Chinese product markings only\b/gi, "只保留真实的非中文产品标识"],
    [/\bKeep authentic non-Chinese product\/packaging markings only\b/gi, "只保留真实的非中文产品/包装标识"],
    [/\bKeep authentic product markings\b/gi, "保留真实产品标识"],
    [/\bReference blueprint slot\b/g, "参考蓝图图位"],
    [/\bReference-derived composition\b/g, "参考提取构图"],
    [/\bReference-derived proof method\b/g, "参考提取证明方式"],
    [/\bReference text density\b/g, "参考文字密度"],
    [/\bReference layout cues\b/g, "参考布局线索"],
    [/\bReference proof-slot cues\b/g, "参考证明图位线索"],
    [/\bExecute this exact reference slot with the current product\b/g, "用当前产品执行这个准确的参考图位"],
    [/\bExecute slot composition exactly\b/g, "严格执行该图位构图"],
    [/\bCurrent product identity is the top priority\b/g, "当前产品身份是最高优先级"],
    [/\bCurrent product fields always override the reference product\b/g, "当前产品字段始终优先于参考产品"],
    [/\bProduct stays prominent and source-accurate\b/g, "产品保持突出且来源准确"],
    [/\bProduct geometry stays unchanged\b/g, "产品几何形态保持不变"],
    [/\bProduct must be in active use\b/g, "产品必须处于实际使用状态"],
    [/\bnot just placed as a prop\b/g, "不要只是当作道具摆放"],
    [/\bcomposition should feel aspirational, high-end, and category-matched\b/g, "构图应有高级向往感，并匹配品类"],
    [/\bshow only the product itself\b/g, "只展示产品本身"],
    [/\bproduct itself\b/g, "产品本身"],
    [/\bno hands\b/g, "不要手"],
    [/\bno people\b/g, "不要人物"],
    [/\bno body parts\b/g, "不要身体部位"],
    [/\bno props\b/g, "不要道具"],
    [/\bno furniture\b/g, "不要家具"],
    [/\bno room\b/g, "不要室内房间"],
    [/\bno outdoor scene\b/g, "不要户外场景"],
    [/\bno lifestyle background\b/g, "不要生活方式背景"],
    [/\bno added title\b/g, "不要添加标题"],
    [/\bno added labels\b/g, "不要添加标签"],
    [/\bno added overlay text\b/g, "不要添加覆盖文字"],
    [/\bUse the reference slot layout\b/g, "使用参考图位布局"],
    [/\blabels\/arrows\/insets must explain only verified current-product facts\b/g, "标签/箭头/小窗只能解释已验证的当前产品事实"],
    [/\bMacro close-ups or insets must come from the current product\b/g, "微距特写或小窗必须来自当前产品"],
    [/\bIf a referenced detail is not verified for the current product\b/g, "如果某个参考细节未被当前产品验证"],
    [/\breplace it with a verified current-product detail\b/g, "用已验证的当前产品细节替换"],
    [/\bDo not copy the reference person, floor, exact pose, text style, or product shape\b/g, "不要复制参考图的人物、地面、准确姿势、文字样式或产品形状"],
    [/\bDo not invent folding, detachable parts, straps, openings, holes, hinges, or steps\b/g, "不要虚构折叠、可拆部件、带子、开口、孔洞、铰链或步骤"],
    [/\bdo not add extra views, scenes, claims, or callouts unless the current reference slot calls for them\b/g, "除非当前参考图位需要，否则不要添加额外视角、场景、宣称或标注"],
    [/\bProduct identity lock comes first\b/g, "产品身份锁定优先"],
    [/\bexact selected current product only\b/g, "只生成当前选中的准确产品"],
    [/\bno category substitution\b/g, "不要替换成其他品类"],
    [/\bno redesign\b/g, "不要重新设计产品"],
    [/\bno invented parts\b/g, "不要虚构部件"],
    [/\bIdentity lock\b/g, "产品身份锁定"],
    [/\bExact source product\b/g, "准确来源产品"],
    [/\bExact product type\/name\b/g, "准确产品类型/名称"],
    [/\bExact option\/spec\b/g, "准确选项/规格"],
    [/\bExact color\b/g, "准确颜色"],
    [/\bExact material\b/g, "准确材质"],
    [/\bExact visible structure\b/g, "准确可见结构"],
    [/\bPack count if shown\b/g, "如展示包装数量需准确"],
    [/\bKeep authentic markings\b/g, "保留真实产品标识"],
    [/\bCurrent selected option\b/g, "当前选中选项"],
    [/\bCurrent option\b/g, "当前选项"],
    [/\bDetail fields\b/g, "细节字段"],
    [/\bSummary points\b/g, "总结卖点"],
    [/\bDetail inset subjects\b/g, "细节小窗主题"],
    [/\bMacro focus\b/g, "微距重点"],
    [/\bScene\b/g, "场景"],
    [/\bReference\b/g, "参考"],
    [/\bcomposition only\b/g, "只参考构图"],
    [/\bcopy no claims, text, brand, or people\b/g, "不要复制对方宣称、文字、品牌或人物"],
    [/\b1:1 Amazon listing image\b/g, "1:1 亚马逊 listing 图片"],
    [/\b1:1 Amazon image\b/g, "1:1 亚马逊图片"],
    [/\b4K clarity\b/g, "4K 清晰度"],
    [/\bsharp realistic detail\b/g, "清晰真实细节"],
    [/\bpremium scene-based hero background\b/g, "高级场景化主图背景"],
    [/\bproduct occupies most of the frame\b/g, "产品占据画面主体"],
    [/\bwhite background\b/g, "白底"],
    [/\bclean studio lighting\b/g, "干净棚拍光线"],
    [/\bverified overlay text only when useful\b/g, "只在有用时添加已验证的覆盖文字"],
    [/\bNo Chinese text\b/g, "图片内不要出现中文文字"],
    [/\bkeep authentic non-Chinese product markings only\b/g, "只保留真实的非中文产品标识"],
    [/\bEnglish labels only\b/g, "图片内标签只用英文"],
    [/\bno full sentence captions\b/g, "不要完整句说明文字"],
    [/\bexplanatory phrases\b/g, "不要解释性短语"],
    [/\bdescriptive caption\b/g, "描述性说明文字"],
    [/\bvisual proof target only\b/g, "仅作为视觉证明目标"],
    [/\bnot on-image text\b/g, "不要写到图上"],
    [/\blabels 3-5 words\b/g, "标签 3-5 个英文词"],
    [/\bmax 2 on selling-point images\b/g, "卖点图最多 2 个标签"],
    [/\bmax 3 on parameter\/summary images\b/g, "参数/总结图最多 3 个标签"],
    [/\bno paragraphs\b/g, "不要段落文字"],
    [/\bno badges\b/g, "不要徽章式贴纸"],
    [/\bno repeated claims\b/g, "不要重复宣称"],
    [/\bno text stacking\b/g, "不要堆叠文字"],
    [/\bVisual proof first\b/g, "视觉证明优先"],
    [/\buse action, close-ups, icons, arrows, or measurements\b/g, "用动作、特写、图标、箭头或尺寸证明"],
    [/\btext is only a short locator\b/g, "文字只作为短标签定位"],
    [/\bPeople optional\b/g, "人物可选"],
    [/\bproduct remains the focus\b/g, "产品始终是主体"],
    [/\buse European\/American model only when it proves fit\/use\b/g, "仅在证明穿戴/使用时使用欧美模特"],
    [/\bOn-image length labels use inches \(in\)\b/g, "图片内长度标签使用英寸 (in)"],
    [/\bconvert source cm\/mm\b/g, "将来源 cm/mm 转换为英寸"],
    [/\bFinal image file <= 5 MB\b/g, "最终图片文件不超过 5 MB"],
    [/\bNo wrong product\b/g, "不要错误产品"],
    [/\binvented specs\b/g, "不要虚构规格"],
    [/\bunsupported claims\b/g, "不要无依据宣称"],
    [/\bextra logos\b/g, "不要额外 logo"],
    [/\bChinese\/source text\b/g, "不要中文/来源文字"],
    [/\bdense copy\b/g, "不要密集文案"],
    [/\blong labels\b/g, "不要长标签"],
    [/\bbullets\b/g, "不要项目符号"],
    [/\bblur\b/g, "不要模糊"],
    [/\bfocus\b/g, "聚焦"],
    [/\bheadline\b/g, "标题"],
    [/\buses polished Amazon editorial typography integrated with the scene\b/g, "使用自然融入场景的精致亚马逊编辑风标题排版"],
    [/\bprove\b/g, "证明"],
    [/\bthrough\b/g, "通过"],
    [/\bElegant hierarchy\b/g, "层级优雅"],
    [/\bgenerous padding\b/g, "留白充足"],
    [/\bnatural line breaks\b/g, "自然换行"],
    [/\bno oversized hard-sell banner\b/g, "不要夸张硬广横幅"],
    [/\bsticker look\b/g, "不要贴纸感"],
    [/\bdense claim block\b/g, "不要密集宣称块"],
    [/\brepeated benefit\b/g, "不要重复卖点"],
    [/\bDistinct from Image\b/g, "需区别于第"],
    [/\bProduct remains clear and accurate\b/g, "产品保持清晰准确"],
    [/\bno unsupported claims\b/g, "不要无依据宣称"],
    [/\bUse the reference blueprint proof method\b/g, "使用参考蓝图的证明方式"],
    [/\bdo not force\b/g, "不要强行加入"],
    [/\bunless verified\b/g, "除非资料已验证"],
    [/\bExecute slot composition exactly\b/g, "严格执行该图位构图"],
    [/\bBlueprint proof method\b/g, "蓝图证明方式"],
    [/\bProduct\b/g, "产品"],
    [/\bOption\b/g, "选项"],
    [/\bColor\b/g, "颜色"],
    [/\bMaterial\b/g, "材质"],
    [/\bStructure\b/g, "结构"],
  ];
  const translated = replacements.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), segment);
  return translatePromptVocabulary(translated);
}

function translatePromptVocabulary(text) {
  const vocabulary = {
    a: "一个",
    about: "约",
    accurate: "准确",
    accurately: "准确地",
    accuracy: "准确性",
    action: "动作",
    adapt: "适配",
    add: "添加",
    added: "添加的",
    aligned: "对齐的",
    allowed: "允许",
    alternative: "替代",
    amazon: "亚马逊",
    angle: "角度",
    annotations: "标注",
    arrows: "箭头",
    aspirational: "有高级向往感的",
    authentic: "真实",
    avoid: "避免",
    background: "背景",
    balanced: "平衡",
    based: "基于",
    benefit: "卖点",
    benefits: "卖点",
    block: "块",
    bold: "醒目",
    borrow: "借用",
    brightness: "亮度",
    callout: "标注",
    callouts: "标注",
    caption: "说明文字",
    captions: "说明文字",
    category: "品类",
    centered: "居中",
    certification: "认证",
    chart: "图表",
    clarity: "清晰度",
    clean: "干净",
    clear: "清晰",
    claims: "宣称",
    close: "特写",
    closeup: "特写",
    collage: "拼图",
    color: "颜色",
    colors: "颜色",
    comparison: "对比",
    complete: "完整",
    composition: "构图",
    concise: "简洁",
    consistent: "一致",
    constraints: "约束",
    context: "语境",
    copy: "复制",
    core: "核心",
    count: "数量",
    crop: "裁切",
    current: "当前",
    capacity: "容量",
    compatible: "适配",
    density: "密度",
    depth: "层次",
    desirable: "有吸引力",
    detail: "细节",
    details: "细节",
    diagram: "示意图",
    different: "不同",
    dimensions: "尺寸",
    display: "展示",
    distance: "距离",
    dominate: "占主导",
    dominant: "主体",
    drawn: "绘制",
    each: "每个",
    easy: "易于",
    edge: "边缘",
    effects: "效果",
    english: "英文",
    environment: "环境",
    exact: "准确",
    exactly: "严格",
    extra: "额外",
    facts: "事实",
    feature: "功能",
    features: "功能",
    feel: "感觉",
    filler: "填充",
    file: "文件",
    final: "最终",
    fit: "适配",
    finish: "工艺",
    first: "优先",
    floating: "悬浮",
    focus: "重点",
    folded: "折叠",
    foreground: "前景",
    form: "形态",
    frame: "画面",
    furniture: "家具",
    generous: "充足",
    geometry: "几何形态",
    grid: "网格",
    guardrails: "约束",
    guide: "引导",
    cues: "线索",
    hands: "手",
    harsh: "生硬",
    headline: "标题",
    hierarchy: "层级",
    high: "高",
    end: "端",
    hide: "遮挡",
    highlight: "突出",
    human: "人物",
    icons: "图标",
    image: "图片",
    in: "在",
    inches: "英寸",
    included: "包含",
    information: "信息",
    infographic: "信息图",
    insets: "小窗",
    integrated: "融合",
    invented: "虚构",
    item: "物品",
    items: "物品",
    label: "标签",
    labels: "标签",
    large: "大",
    largest: "最大",
    layout: "布局",
    length: "长度",
    light: "光线",
    lighting: "光线",
    line: "线条",
    listing: "listing",
    locator: "定位标签",
    lock: "锁定",
    logos: "logo",
    long: "长",
    macro: "微距",
    main: "主要",
    markings: "标识",
    material: "材质",
    measurement: "测量",
    measurements: "尺寸",
    method: "方式",
    mini: "小型",
    model: "模特",
    mood: "氛围",
    natural: "自然",
    name: "名称",
    needed: "需要时",
    negative: "留白",
    numeric: "数字",
    object: "对象",
    occupies: "占据",
    optional: "可选",
    option: "选项",
    options: "选项",
    order: "顺序",
    outdoor: "户外",
    overlay: "覆盖",
    package: "包装",
    packaging: "包装",
    panel: "面板",
    panels: "面板",
    parameter: "参数",
    quantity: "数量",
    paragraphs: "段落",
    parts: "部件",
    people: "人物",
    photo: "照片",
    physical: "实体",
    placed: "放置",
    polished: "精致",
    poster: "海报",
    premium: "高级",
    present: "呈现",
    priority: "优先级",
    product: "产品",
    props: "道具",
    proof: "证明",
    prove: "证明",
    realistic: "真实",
    recognizable: "可识别",
    refined: "精致",
    reference: "参考",
    render: "渲染",
    rendering: "渲染",
    replace: "替换",
    repeated: "重复",
    required: "必需",
    restrained: "克制",
    rhythm: "节奏",
    role: "角色",
    room: "房间",
    ruler: "尺规",
    range: "范围",
    scene: "场景",
    scenes: "场景",
    secondary: "次要",
    selected: "选中",
    separate: "分开",
    set: "套装",
    shadow: "阴影",
    shadows: "阴影",
    shape: "形状",
    sharp: "清晰",
    shot: "镜头",
    show: "展示",
    shown: "展示",
    simple: "简单",
    size: "尺寸",
    slogans: "口号",
    soft: "柔和",
    source: "来源",
    space: "留白",
    spacing: "间距",
    specification: "规格",
    specs: "规格",
    stacking: "堆叠",
    stays: "保持",
    sticker: "贴纸",
    studio: "棚拍",
    style: "风格",
    subject: "主体",
    subtle: "细微",
    surface: "表面",
    summary: "总结",
    support: "支撑",
    table: "表格",
    tags: "标签",
    technology: "工艺",
    text: "文字",
    texture: "纹理",
    theme: "主题",
    through: "通过",
    tiny: "很小",
    title: "标题",
    typography: "字体排版",
    unverified: "未验证",
    unsupported: "无依据",
    use: "使用",
    useful: "有用",
    verified: "已验证",
    view: "视图",
    visible: "可见",
    visual: "视觉",
    width: "宽度",
    matched: "匹配",
    matching: "匹配",
    multi: "多",
    panel: "面板",
    first: "优先",
    derived: "提取",
    accurate: "准确",
    waterproofing: "防水",
    weight: "重量",
    white: "白色",
    wordart: "艺术字",
    wrong: "错误",
    and: "和",
    or: "或",
    with: "带有",
    without: "不带",
    only: "仅",
    when: "当",
    where: "在",
    while: "同时",
    as: "作为",
    from: "从",
    for: "用于",
    into: "成",
    not: "不",
    no: "不要",
    must: "必须",
    should: "应",
  };
  const translated = String(text || "").replace(/\b[A-Za-z][A-Za-z0-9/-]*\b/g, (word) => {
    if (/^[A-Z0-9/-]{2,}$/.test(word)) return word;
    return translatePromptWord(word, vocabulary);
  });
  return cleanChinesePromptTranslation(markResidualEnglishTerms(translated));
}

function translatePromptWord(word, vocabulary) {
  const lower = String(word || "").toLowerCase();
  if (vocabulary[lower]) return vocabulary[lower];
  if (/[-/]/.test(lower)) {
    const translatedParts = lower.split(/[-/]+/).map((part) => vocabulary[part] || part);
    if (translatedParts.some((part, index) => part !== lower.split(/[-/]+/)[index])) {
      return translatedParts.join("");
    }
  }
  return word;
}

function markResidualEnglishTerms(text) {
  return String(text || "").replace(/\b[A-Za-z][A-Za-z0-9-]*(?:[\/\s]+[A-Za-z][A-Za-z0-9-]*)*\b/g, (match) => {
    const clean = match.trim();
    if (!clean) return match;
    if (/^[A-Z0-9/-]{2,}$/.test(clean)) return match;
    if (/^(cm|mm|in|mb|kg|g|ml|oz|pcs|pc|set|sets|pack|packs|x)$/i.test(clean)) return match;
    return `原始词「${clean}」`;
  });
}

function cleanChinesePromptTranslation(text) {
  return String(text || "")
    .replace(/([一-龥])\s+(?=[一-龥])/g, "$1")
    .replace(/([一-龥])\s*\/\s*(?=[一-龥])/g, "$1/")
    .replace(/([一-龥])\s*,\s*/g, "$1，")
    .replace(/\s*,\s*([一-龥])/g, "，$1")
    .replace(/([一-龥])\s*;\s*/g, "$1；")
    .replace(/\s*;\s*([一-龥])/g, "；$1")
    .replace(/([一-龥])\s*:\s*/g, "$1：")
    .replace(/\s*:\s*([一-龥])/g, "：$1")
    .replace(/\s+\./g, ".")
    .replace(/。+/g, "。")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function compactPromptItems(items, fallback = "", limit = 5) {
  const cleanItems = uniquePromptItems(items)
    .map((item) => cleanTokenValue(item))
    .filter(Boolean);
  const selected = [];
  cleanItems.forEach((item) => {
    const lower = comparablePromptItem(item);
    const keywordSet = promptKeywordSet(item);
    const existingIndex = selected.findIndex((existing) => {
      const existingLower = comparablePromptItem(existing);
      const existingKeywordSet = promptKeywordSet(existing);
      return lower.includes(existingLower)
        || existingLower.includes(lower)
        || Boolean(keywordSet && existingKeywordSet && (
          keywordSet === existingKeywordSet
          || promptKeywordSetContains(keywordSet, existingKeywordSet)
          || promptKeywordSetContains(existingKeywordSet, keywordSet)
        ));
    });
    if (existingIndex > -1) {
      if (item.length > selected[existingIndex].length) selected[existingIndex] = item;
      return;
    }
    selected.push(item);
  });
  return selected.length ? selected.slice(0, limit).join(" / ") : fallback;
}

function promptItemsOverlap(left, right) {
  const leftClean = comparablePromptItem(left);
  const rightClean = comparablePromptItem(right);
  if (!leftClean || !rightClean) return false;
  if (leftClean.includes(rightClean) || rightClean.includes(leftClean)) return true;

  const stopWords = new Set([
    "accurate",
    "available",
    "compatible",
    "current",
    "option",
    "product",
    "realistic",
    "selected",
    "true",
    "verified",
    "visible",
  ]);
  const leftWords = new Set(leftClean.split(" ").filter((word) => word.length > 2 && !stopWords.has(word)));
  const rightWords = rightClean.split(" ").filter((word) => word.length > 2 && !stopWords.has(word));
  const smallerCount = Math.min(leftWords.size, rightWords.length);
  if (smallerCount < 2) return false;

  const overlapCount = rightWords.filter((word) => leftWords.has(word)).length;
  return overlapCount >= Math.min(3, smallerCount) || overlapCount / smallerCount >= 0.7;
}

function promptKeywordSet(value) {
  return comparablePromptItem(value)
    .split(" ")
    .filter((word) => word.length > 2)
    .sort()
    .join(" ");
}

function promptKeywordSetContains(left, right) {
  const leftSet = new Set(String(left || "").split(" ").filter(Boolean));
  const rightWords = String(right || "").split(" ").filter(Boolean);
  return rightWords.length >= 3 && rightWords.every((word) => leftSet.has(word));
}

function isGenericPromptFallback(value) {
  const clean = comparablePromptItem(cleanTokenValue(value));
  if (!clean) return true;
  return [
    "verified product material",
    "accurate product color",
    "compatible use",
    "realistic product use scene",
    "verified product benefit",
    "verified secondary benefit",
    "available verified product options",
    "selected product specification",
    "the product",
  ].some((generic) => clean === generic);
}

function specificPromptValue(value, fallback = "") {
  const clean = cleanTokenValue(value);
  return isGenericPromptFallback(clean) ? fallback : clean;
}

function compactSpecificPromptItems(items, fallback = "", limit = 5) {
  return compactPromptItems(
    items.map((item) => specificPromptValue(item, "")).filter(Boolean),
    fallback,
    limit,
  );
}

function sellingPointKey(value) {
  const clean = comparablePromptItem(value);
  if (!clean) return "";
  if (/(?:compact|portable|folded|pocket|travel|small|小巧|便携|收纳|折叠|迷你|随身)/i.test(value)) return "compact";
  if (/(?:lightweight|light weight|轻量|轻便|轻巧)/i.test(value)) return "lightweight";
  if (/(?:break resistant|without breaking|fracture|tear|防断|抗拉|不断裂|不惧断裂)/i.test(value)) return "break-resistant";
  if (/(?:deformation|不变形|均匀拉伸)/i.test(value)) return "deformation-resistant";
  if (/(?:3x|3 x|three times|3倍)/i.test(value)) return "stretch-range";
  if (/(?:full body|全身)/i.test(value)) return "full-body";
  if (/(?:durable|耐用|安全)/i.test(value)) return "durable";
  if (/(?:multi use|versatility|多用途|多场景|不同需求)/i.test(value)) return "multi-use";
  if (/(?:easy clean|washable|易清洁|可水洗)/i.test(value)) return "easy-clean";
  if (/(?:stable|sturdy|support|承重|稳固|牢固|省力)/i.test(value)) return "stable";
  if (/(?:vacuum|suction|twist.?lock|rotary.?lock|真空|吸附|吸力|旋转锁紧|旋转固定)/i.test(value)) return "suction";
  if (/(?:no.?drill|drill.?free|quick install|easy install|seconds? to install|免打孔|无需打孔|秒安装|快速安装|轻松安装)/i.test(value)) return "installation";
  if (/(?:removable|reusable|reposition|可拆卸|自由拆卸|重复使用|反复使用|更换墙面)/i.test(value)) return "reusable";
  if (/(?:multi.?surface|various surfaces|各种墙面|多种墙面|多墙面|大理石|木板|玻璃|瓷砖|金属)/i.test(value)) return "surface-fit";
  if (/(?:uv|upf|sun|shade|防晒|遮阳|防紫外|紫外线|隔热|黑胶)/i.test(value)) return "uv";
  if (/(?:rain|waterproof|water.?resistant|防雨|晴雨|拒水|防水)/i.test(value)) return "rain";
  if (/(?:glow[\s-]*in[\s-]*the[\s-]*dark|photoluminescen(?:t|ce)|after dark|stores? daylight|daylight.?charged|self.?luminous|夜光|自发光|蓄光|光致发光)/i.test(value)) return "glow";
  if (/(?:halloween warning decoration|decorative warning|decorative caution|万圣节.*装饰|装饰.*警示)/i.test(value)) return "decorative";
  if (/(?:windproof|wind resistant|reinforced|ribs?|防风|抗风|加固|伞骨|骨架)/i.test(value)) return "windproof";
  if (/(?:non slip|anti slip|grip|silicone|printed grip|防滑|点胶|硅胶|胶印|抓地)/i.test(value)) return "grip";
  if (/(?:cross strap|strappy|3d cross|绑带|交叉|立体)/i.test(value)) return "cross-strap";
  if (/(?:five toe|toe separated|五指|五趾|分趾)/i.test(value)) return "five-toe";
  if (/(?:mid calf|long sock|coverage|中筒|长筒|高筒)/i.test(value)) return "coverage";
  if (/(?:seamless|hand linked|无骨|手工缝头)/i.test(value)) return "seam";
  if (/(?:sweat|moisture|吸汗)/i.test(value)) return "sweat";
  if (/(?:friction|防摩擦)/i.test(value)) return "friction";
  if (/(?:single needle|knit texture|单针)/i.test(value)) return "knit";
  if (/(?:combed cotton|cotton|精梳棉|棉)/i.test(value)) return "cotton";
  if (/(?:elastic|cuff|高弹|橡筋|袜口)/i.test(value)) return "elastic";
  if (/(?:soft|delicate|柔软|细腻)/i.test(value)) return "soft";
  if (/(?:deodor|antibacterial|抗菌|阻菌|防臭)/i.test(value)) return "hygiene";
  if (/(?:filter|filtration|flow|过滤|萃取)/i.test(value)) return "filtration";
  if (/(?:unbleached|wood pulp|木浆|未漂白|原色)/i.test(value)) return "material";
  return promptKeywordSet(clean) || clean;
}

function uniqueSellingPoints(items, limit = 6) {
  const selected = [];
  const seenKeys = new Set();
  items
    .map((item) => specificPromptValue(item, ""))
    .filter(Boolean)
    .forEach((item) => {
      const key = sellingPointKey(item);
      if (!key || seenKeys.has(key)) return;
      if (selected.some((existing) => promptItemsOverlap(existing, item))) return;
      selected.push(item);
      seenKeys.add(key);
    });
  return selected.slice(0, limit);
}

function sellingPointCandidates(facts, limit = 6) {
  // Selling-point slots are an exact reflection of the two editable
  // Selling Point fields. Product structure, material and parameter details
  // remain usable as visual facts elsewhere, but must never be promoted into
  // a made-up extra benefit merely to fill a selling-point image slot.
  return uniqueSellingPoints([
    ...splitSellingPointText(facts.feature1),
    ...splitSellingPointText(facts.feature2),
    ...splitSellingPointText(facts.feature3),
  ].filter((point) => !isOrdinaryMaterialSellingPoint(point)), limit);
}

function isOrdinaryMaterialSellingPoint(value) {
  const clean = comparablePromptItem(value);
  return clean === "cotton" || clean === "breathable cotton comfort";
}

function remainingSellingPointText(points, used = 2, limit = 4) {
  return uniqueSellingPoints(points, used + limit + 3)
    .filter((point) => !isOrdinaryMaterialSellingPoint(point))
    .slice(used, used + limit)
    .join(", ");
}

function preferredSecondarySellingPoint(points, usedPoints = []) {
  const used = usedPoints.filter(Boolean);
  const available = uniqueSellingPoints(points, 6).filter((point) => (
    !used.some((usedPoint) => promptItemsOverlap(usedPoint, point))
    && !["cotton", "material"].includes(sellingPointKey(point))
    && !isOrdinaryMaterialSellingPoint(point)
  ));
  const preferredKeys = ["break-resistant", "deformation-resistant", "durable", "multi-use", "compact", "lightweight", "grip", "rain", "uv", "windproof", "stable", "easy-clean", "seam", "sweat", "friction", "coverage", "elastic", "soft", "knit"];
  for (const key of preferredKeys) {
    const matched = available.find((point) => sellingPointKey(point) === key);
    if (matched) return matched;
  }
  return available[0] || "";
}

function sellingPointGroupText(points) {
  return limitedSellingPoints(points, 2).join(" + ");
}

function sellingPointGroupFromText(value) {
  return String(value || "")
    .split(/\s*\+\s*/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function limitedSellingPoints(points, limit = 2, exclusions = []) {
  const sourcePoints = Array.isArray(points) ? points : [points];
  const excluded = uniqueSellingPoints(Array.isArray(exclusions) ? exclusions : [exclusions], 8);
  const excludedKeys = new Set(excluded.map((point) => sellingPointKey(point)).filter(Boolean));
  return uniqueSellingPoints(sourcePoints, limit + excluded.length + 6)
    .filter((point) => {
      const key = sellingPointKey(point);
      if (key && excludedKeys.has(key)) return false;
      return !excluded.some((usedPoint) => promptItemsOverlap(usedPoint, point));
    })
    .slice(0, limit);
}

function distributedSellingPointGroups(points, groupIndex = 0, groupSize = 2, maxPoints = 4) {
  const cleanPoints = uniqueSellingPoints(Array.isArray(points) ? points : [points], maxPoints);
  const size = cleanPoints.length >= 3 ? groupSize : 1;
  const start = groupIndex * size;
  const group = cleanPoints.slice(start, start + size);
  if (group.length) return group;
  return cleanPoints.slice(groupIndex, groupIndex + 1);
}

function sellingPointGroups(facts, groupIndex = 0, groupSize = 2) {
  return distributedSellingPointGroups(sellingPointCandidates(facts, 6), groupIndex, groupSize, 4);
}

function clampSellingPointTitle(value, fallback = "Info") {
  const clean = String(value || "")
    .replace(/[^a-z0-9\s&-]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  const fallbackClean = String(fallback || "Info").replace(/[^a-z0-9\s&-]/gi, " ").replace(/\s+/g, " ").trim() || "Info";
  const source = clean || fallbackClean;
  return source.split(/\s+/).slice(0, 4).join(" ");
}

function canonicalSellingPointLabel(point) {
  const text = comparablePromptItem(point);
  if (!text) return "";
  if (/(?:vacuum|suction)/.test(text) && /(?:twist|rotat|lock)/.test(text)) return "Vacuum Twist Lock";
  if (/(?:quick|fast|easy)/.test(text) && /no drill/.test(text)) return "Quick No-Drill Install";
  if (/(?:waterproof|water resistant|moisture)/.test(text) && /(?:load|bearing|strong|stable|hold)/.test(text)) return "Strong Waterproof Hold";
  if (/(?:remov|reuse|reusable)/.test(text) && /(?:multi surface|various surface|wall)/.test(text)) return "Removable Multi-Surface";
  if (/(?:load bearing|strong hold|stable hold)/.test(text)) return "Strong Load Hold";
  if (/(?:waterproof|water resistant|moisture)/.test(text)) return "Waterproof Hold";
  if (/(?:remov|reuse|reusable)/.test(text)) return "Remove & Reuse";
  if (/(?:multi surface|various surface)/.test(text)) return "Multi-Surface Mount";
  return "";
}

function sellingPointWords(point) {
  return String(point || "")
    .replace(/\[[^\]]+\]/g, " ")
    .replace(/[^a-z0-9\s-]/gi, " ")
    .replace(/[-_/]+/g, " ")
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => /^[a-z0-9]+$/i.test(word) && !/^(?:and|with|for|the|product|design|feature|benefit|verified)$/i.test(word));
}

function sellingPointLabelParts(point, fallback = "Info") {
  // Selling-point image titles must be a concise, faithful form of the
  // left-side confirmed claim. Do not substitute an old category shorthand
  // (for example “Vac Lock” or “Firm Hold”), which can change the meaning.
  const direct = String(point || "").replace(/\s+/g, " ").trim();
  if (/(?:rotary|rotation|twist)[\s-]*(?:lock|lid)|(?:twist|rotary)[\s-]*(?:lock|lid)/i.test(direct)) return ["Rotary", "Twist Lock"];
  if (/(?:easy|quick)[\s-]*(?:hang|carry)|hang.*carry/i.test(direct)) return ["Easy", "Hang Carry"];
  if (/(?:leakproof|leak resistant|leak proof)/i.test(direct) && /(?:tear|tear resistant|tear-resistant)/i.test(direct)) return ["Leakproof", "Tear Resistant"];
  if (/(?:zero|no)[\s-]*(?:direct\s*)?contact/i.test(direct)) return ["Zero", "Direct Contact"];
  const labelByKey = {
    compact: ["Pack", "Flat"],
    lightweight: ["Light", "Carry"],
    "break-resistant": ["Tear", "Resistant"],
    "deformation-resistant": ["Shape", "Keep"],
    "stretch-range": ["Range", "Pull"],
    "full-body": ["Body", "Train"],
    durable: ["Daily", "Use"],
    "multi-use": ["Multi", "Use"],
    "easy-clean": ["Clean", "Wash"],
    stable: ["Firm", "Base"],
    suction: ["Twist", "Lock"],
    installation: ["Fast", "Mount"],
    reusable: ["Move", "Reuse"],
    "surface-fit": ["Multi", "Wall"],
    uv: ["UV", "Shade"],
    rain: ["Dry", "Water"],
    windproof: ["Wind", "Hold"],
    grip: ["Grip", "Sole"],
    "cross-strap": ["Strap", "Hold"],
    "five-toe": ["Toes", "Fit"],
    coverage: ["Cover", "Fit"],
    seam: ["Seam", "Soft"],
    sweat: ["Dry", "Sweat"],
    friction: ["Glide", "Soft"],
    knit: ["Knit", "Feel"],
    cotton: ["Soft", "Touch"],
    elastic: ["Flex", "Fit"],
    soft: ["Soft", "Feel"],
    hygiene: ["Fresh", "Wear"],
    filtration: ["Flow", "Brew"],
    material: ["Feel", "Touch"],
  };
  const key = sellingPointKey(point);
  if (labelByKey[key]) {
    return labelByKey[key].map((part) => clampSellingPointTitle(part, fallback)).filter(Boolean).slice(0, 2);
  }

  const words = sellingPointWords(point);
  const preferred = words.filter((word) => word.length >= 3 && word.length <= 5);
  const title = preferred[0] || words[0] || fallback;
  const explanation = preferred.find((word) => !promptItemsOverlap(word, title)) || words.find((word) => !promptItemsOverlap(word, title));
  return [title, explanation]
    .filter(Boolean)
    .map((part) => clampSellingPointTitle(part, fallback))
    .filter(Boolean)
    .slice(0, 2);
}

function conciseSellingPointLabel(point, fallback = "Info") {
  return canonicalSellingPointLabel(point)
    || sellingPointLabelParts(point, fallback).join(" ")
    || clampSellingPointTitle(fallback, "Info");
}

function sellingPointLabels(points, fallback = "Info") {
  const labels = limitedSellingPoints(points, 2)
    .map((point) => conciseSellingPointLabel(point, fallback))
    .filter(Boolean);
  return uniquePromptItems(labels).slice(0, 2);
}

function sellingPointFocusText(points, fallback = "verified product detail") {
  return limitedSellingPoints(points, 2).join(" + ") || fallback;
}

function sellingPointDisplayText(points, fallback = "Info") {
  return sellingPointLabels(points, conciseSellingPointLabel(fallback)).join(" + ") || conciseSellingPointLabel(fallback);
}

function sellingPointHeadlineRule(points) {
  const labels = sellingPointLabels(points);
  if (!labels.length) return "Use one complete 2-4 word benefit label for each verified visible product fact, preferring 2-3 words.";
  return `Required on-image benefit labels: ${labels.join(" + ")}. Show exactly ${labels.length} separate label groups, one for every left-side selling point; keep each complete label at 2-4 English words, prefer 2-3, and do not abbreviate or omit its defining qualifier. No subtitle or explanation line.`;
}

function sellingPointEvidenceMatchesClaim(point, evidence) {
  const claim = cleanFieldDisplayValue(point || "");
  const evidenceClaim = cleanFieldDisplayValue(evidence?.claim || "");
  if (!claim || !evidenceClaim) return false;
  if (promptItemsOverlap(claim, evidenceClaim)) return true;
  const pointKey = sellingPointKey(claim);
  const evidenceKey = sellingPointKey(evidenceClaim);
  return Boolean(pointKey && evidenceKey && pointKey === evidenceKey);
}

function matchedSellingPointVisualEvidence(points, facts = {}) {
  const evidenceItems = Array.isArray(facts.sellingPointVisualEvidence) ? facts.sellingPointVisualEvidence : [];
  const usedUrls = new Set();
  return limitedSellingPoints(points, 2).flatMap((point) => {
    const match = evidenceItems.find((item) => !usedUrls.has(item.imageUrl) && sellingPointEvidenceMatchesClaim(point, item));
    if (!match) return [];
    usedUrls.add(match.imageUrl);
    return [{ point, ...match }];
  });
}

function sellingPointMatchedEvidenceText(points, facts = {}) {
  const matches = matchedSellingPointVisualEvidence(points, facts);
  if (!matches.length) return "";
  const details = matches.map((item, index) => (
    `Point ${index + 1} “${item.point}”: source evidence “${item.evidence}”; reference image URL: ${item.imageUrl}`
  )).join(" / ");
  return `MATCHED 1688 SELLING-POINT VISUAL EVIDENCE — these exact reference images must be supplied to the image generator as visual inputs, not treated as text-only links: ${details}. Reuse the matched image's demonstrated product state, action, and composition only for its matched point; retain the current SKU's verified color and included components.`;
}

function sellingPointReferenceSceneRule(points, facts = {}) {
  const labels = sellingPointLabels(points);
  const labelText = labels.length ? labels.join(" + ") : "the verified selling-point title";
  const matchedEvidence = sellingPointMatchedEvidenceText(points, facts);
  return [
    "HIGHEST-PRIORITY SELLING-POINT EVIDENCE GATE / Selling-point reference priority: inspect all attached/current-product reference images before designing the image, but use a reference as evidence only when it visibly proves the entire exact current selling point, not merely one related action or keyword.",
    matchedEvidence,
    "A process, installation, instruction, unboxing, packing, or step-by-step reference image may be used when one of its individual steps visibly proves the complete exact current selling point. Do not reject a usable source scene because of its image type. However, never extract a merely related step (for example opening, twisting, inserting, pulling, holding, or hanging) and present it as proof of a different benefit.",
    "For each selling point, a usable reference must show the same complete claimed mechanism and result. A partial action is insufficient: opening a cap does not prove anti-loose locking; pulling a bag does not prove zero contact with pet waste. Keep the current SKU accurate and never replace missing evidence with a newly imagined demonstration.",
    `When no usable reference image directly proves a selling point, do not invent a proof scene, symbolic scenario, test action, person/hand interaction, water/load stunt, comparison, mechanism diagram, or imagined result. Use the clearest available current-product display view on a clean simple background and add only its short verified title (${labelText}).`,
    "For a two-selling-point group, apply this decision independently to each point: a referenced point may use its reference scene, while an unreferenced point remains a title plus accurate product display; do not force two staged proof zones.",
    "Reference images control only supported scene/action evidence; never copy Chinese text, supplier branding, watermarks, or an incorrect product variant.",
  ].join(" ");
}

function sellingPointEvidenceAvoidRule() {
  return "No invented visual proof: no isolated process/instruction/unboxing step unless that exact step visibly proves the complete current selling point; no action that merely suggests a claim; and no hand/action/test/scene unless the source visibly proves the complete exact current selling point. Do not treat opening as anti-loose locking, or pulling a bag as zero-contact waste pickup.";
}

function sellingPointSceneDescription(points, facts = {}, fallback = "verified product detail") {
  if (!limitedSellingPoints(points, 2).length) {
    return "No verified selling-point evidence is available. Use an accurate current-product display on a plain neutral background; do not add a benefit claim, proof scene, substitute claim, or explanatory caption.";
  }
  return sellingPointReferenceSceneRule(points, facts);
}

function sellingPointProofDominanceRule(points = [], facts = {}) {
  return [
    "SELLING-POINT COMPOSITION PRIORITY: the main visual must be the source-supported action, use result, comparison, material/structure close-up, or other visible evidence that proves the current selling point. Give this proof area about 65-75% of the frame and make it the first thing noticed.",
    "Use the matched current-product reference image's demonstrated action and composition as the primary visual blueprint when it proves the claim. Product-only renders, repeated units, decorative cutouts, icons, and labels are supporting elements only.",
    "Show only the representative product unit or the few units naturally required to prove the current selling point. Do not include pack-count text, quantity badges, pack-contents diagrams, exact-count arrays, or full-pack presentation in a selling-point image.",
    "Do not use a large product lineup, repeated-unit wall, centered product array, or quantity-led composition. Do not reduce the actual proof to a tiny corner inset.",
  ].join(" ");
}

function sellingPointImageTemplateRule(points, facts = {}, imageName = "this selling-point image") {
  if (!limitedSellingPoints(points, 2).length) {
    return [
      `${imageName}: accurate Amazon product-display layout using the current product only.`,
      sellingPointSceneDescription(points, facts),
      "On-image text may only be short label groups; no full sentence, no paragraph, no descriptive caption, no explanatory phrase.",
      "Elegant hierarchy, generous padding, natural line breaks; no oversized hard-sell banner, sticker look, dense claim block, repeated benefit, or unsupported feature claim.",
    ].join(" ");
  }
  const sceneDescription = sellingPointSceneDescription(points, facts);
  return [
    `${imageName}: ${sellingPointHeadlineRule(points)} On-image text may only be these headline groups; no full sentence, no paragraph, no descriptive caption, no explanatory phrase.`,
    sceneDescription,
    sellingPointProofDominanceRule(points, facts),
    `Title coverage lock: show one short title group for each verified selling point in this group (${limitedSellingPoints(points, 2).length} total). Visual demonstration is required only when a matching reference image provides it; title plus accurate product display is valid when it does not.`,
    "Elegant hierarchy, generous padding, natural line breaks; no oversized hard-sell banner, sticker look, dense claim block, or repeated benefit.",
  ].join(" ");
}

function comparablePromptItem(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function compactVariantText(facts) {
  const productName = String(facts.productName || "").trim();
  const variantSource = cleanTokenValue(facts.variants);
  const variants = (variantSource.includes("|")
    ? variantSource.split(/\s+\|\s+/)
    : variantSource.split(/\s+\/\s+/))
    .map((item) => {
      const clean = item
        .replace(productName, "")
        .replace(/^[\s/-]+/, "")
        .trim();
      return clean || item.trim();
    })
    .filter(Boolean);
  return uniquePromptItems(variants).join(" / ") || variantSource || facts.variants;
}

function shortOptionText(facts) {
  const productName = String(facts.productName || "").trim();
  const option = cleanTokenValue(facts.titleSpec || facts.selectedSpec || "");
  if (!option) return "";
  if (productName && option.toLowerCase().startsWith(productName.toLowerCase())) {
    return option.slice(productName.length).replace(/^[\s,/-]+/, "").trim();
  }
  return option;
}

function visibleDetailParameter(value) {
  return convertLengthUnitsToInches(cleanTokenValue(value))
    .split(/\s*,\s*|\s*\/\s*/)
    .map((item) => item.trim())
    .filter((item) => item && !/antibacterial|deodorizing|阻菌|抗菌|防臭/i.test(item))
    .slice(0, 2)
    .join(", ");
}

function detailTextureText(facts, fallback = "") {
  return compactSpecificPromptItems([
    facts.material,
    facts.structure,
    facts.surfaceFinish,
    visibleDetailParameter(facts.detailParameter),
  ], fallback, 3);
}

function visibleTextureDetails(facts) {
  return compactSpecificPromptItems([detailTextureText(facts), facts.color], "", 4);
}

function referenceRuleText(mode = "") {
  if (mode === "first-scene-hero") {
    return "Reference rule for Scene Image 1A: preserve product identity only; deliberately avoid recreating any attached reference background, room, surface, prop arrangement, camera angle, lighting, or scene composition.";
  }
  if (mode === "selling-point") {
    return "Reference rule for selling-point images: use the demonstrated reference scene/action when a current-product reference visibly supports that exact selling point; otherwise use product display plus title only and invent no proof scene.";
  }
  return sourcePayload.competitor
    ? "Reference: composition only; copy no claims, text, brand, or people."
    : "Reference: clean Amazon listing style.";
}

function textFingerprint(value) {
  const source = String(value || "").slice(0, 20000);
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36).slice(0, 6).toUpperCase();
}

function referenceSourceLabel(text) {
  const listedFiles = String(text || "").match(/REFERENCE_SOURCE_FILES:\s*([^\n]+)/i)?.[1];
  if (listedFiles) return listedFiles.trim().slice(0, 80);
  const fileName = String(text || "").match(/Source HTML file:\s*([^\n<]+)/i)?.[1];
  if (fileName) return fileName.trim().slice(0, 80);
  const title = extractFirstMatch(String(text || ""), [
    /(?:Amazon\.com\s*:\s*)?([^|]{12,120})(?:\s*\||\s*Amazon\.com|$)/i,
  ]);
  return title ? title.trim().slice(0, 80) : `uploaded reference ${textFingerprint(text)}`;
}

function referenceLayoutCues(text) {
  const source = String(text || "");
  const cues = [];
  const add = (value) => {
    if (value && !cues.includes(value)) cues.push(value);
  };
  if (/main image|hero image|white background|纯白|主图|首图/i.test(source)) add("main hero framing");
  if (/lifestyle|scene|model|wearing|beach|pool|shower|bathroom|hotel|travel|户外|场景|真人|穿着|沙滩|浴室|泳池|酒店|旅行/i.test(source)) add("lifestyle scene slot");
  if (/infographic|callout|label|icon|badge|diagram|参数|卖点图|说明图|图标|标注|箭头/i.test(source)) add("infographic callout layout");
  if (/size chart|measurement|dimension|尺码|尺寸|测量|规格/i.test(source)) add("size or measurement chart");
  if (/close.?up|detail|texture|material|sole|tread|macro|细节|特写|材质|鞋底|纹理/i.test(source)) add("detail close-up slot");
  if (/multi.?angle|front|side|back|top view|底视|侧面|正面|背面|多角度/i.test(source)) add("multi-angle product view");
  if (/collage|grid|panel|四宫格|拼图|组合/i.test(source)) add("multi-panel collage rhythm");
  if (/step|how to|fold|foldable|storage|pack|收纳|折叠|步骤|使用方法/i.test(source)) add("process or storage demonstration");
  return cues.slice(0, 5);
}

function referenceProofCues(text) {
  const source = String(text || "");
  const cues = [];
  const add = (value) => {
    if (value && !cues.includes(value)) cues.push(value);
  };
  if (/non.?slip|anti.?slip|grip|traction|防滑|止滑|抓地/i.test(source)) add("grip-proof slot");
  if (/lightweight|light weight|轻便|轻量|轻巧/i.test(source)) add("lightweight proof slot");
  if (/quick.?dry|water|shower|pool|beach|dry|防水|速干|浴室|泳池|沙滩/i.test(source)) add("wet-use or quick-dry proof slot");
  if (/compact|portable|travel|fold|pack|storage|便携|旅行|折叠|收纳/i.test(source)) add("portable storage proof slot");
  if (/soft|comfort|cushion|flexible|柔软|舒适|缓震|弹性/i.test(source)) add("comfort or flexibility proof slot");
  if (/durable|wear.?resistant|thick|reinforced|耐用|耐磨|加厚|加固/i.test(source)) add("durability detail slot");
  if (/material|eva|rubber|silicone|foam|材质|材料|橡胶|硅胶/i.test(source)) add("material texture proof slot");
  return cues.slice(0, 5);
}

function firstPatternIndex(source, patterns) {
  let best = -1;
  patterns.forEach((pattern) => {
    const match = String(source || "").match(pattern);
    if (!match) return;
    const index = match.index ?? -1;
    if (index < 0) return;
    if (best < 0 || index < best) best = index;
  });
  return best;
}

function referenceBlueprintCandidates(text) {
  const source = String(text || "");
  const definitions = [
    {
      key: "hero",
      patterns: [/main image|hero image|white background|纯白|主图|首图/i],
      role: "Product-only hero image",
      composition: "dominant centered product, clean white or very light studio background, reference shot distance and view count",
      proof: "prove product form, color, silhouette, material surface, and selected option without props or people",
      text: "no added text",
    },
    {
      key: "structure",
      patterns: [/infographic|callout|label|diagram|structure|结构|说明图|标注|箭头|拆卸|折叠/i],
      role: "Structure explanation image",
      composition: "clean instructional layout with sparse callouts, arrows, or 2-3 inset details following the reference rhythm",
      proof: "explain only verified visible structure from the current product data",
      text: "short English labels allowed",
    },
    {
      key: "measurement",
      patterns: [/size chart|measurement|dimension|尺码|尺寸|测量|规格|参数/i],
      role: "Size or parameter infographic",
      composition: "measurement-first layout, ruler arrows or size table only when verified values exist, clean Amazon chart spacing",
      proof: "show current product option and verified size/spec fields; omit unverified competitor numbers",
      text: "concise English measurement labels only",
    },
    {
      key: "detail",
      patterns: [/close.?up|detail|texture|material|sole|tread|macro|细节|特写|材质|鞋底|纹理/i],
      role: "Material and detail proof image",
      composition: "one accurate product view plus macro close-up insets following the reference crop/spacing",
      proof: "prove current product material, surface texture, edge, sole, stitching, or construction details",
      text: "2-4 word labels max",
    },
    {
      key: "feature",
      patterns: [/feature|benefit|selling point|badge|icon|卖点|功能|图标/i],
      role: "Functional benefit image",
      composition: "single benefit-led product visual with restrained icons/callouts matching the reference hierarchy",
      proof: "prove one verified current-product benefit through realistic visual evidence",
      text: "short benefit label, no slogans",
    },
    {
      key: "lifestyle",
      patterns: [/lifestyle|scene|model|wearing|beach|pool|shower|bathroom|hotel|travel|户外|场景|真人|穿着|沙滩|浴室|泳池|酒店|旅行/i],
      role: "Lifestyle use scene",
      composition: "real use environment with reference crop, prop density, lighting mood, and product visibility",
      proof: "show current product only in source-verified use context; if none exists, keep a neutral product-first environment without copying the reference scene",
      text: "no text or one tiny scene label",
    },
    {
      key: "multi-angle",
      patterns: [/multi.?angle|front|side|back|top view|底视|侧面|正面|背面|多角度/i],
      role: "Multi-angle product view",
      composition: "several clean product angles arranged with reference spacing, product-only or minimal props",
      proof: "show current product shape from multiple views while preserving selected color and structure",
      text: "no text",
    },
    {
      key: "collage",
      patterns: [/collage|grid|panel|四宫格|拼图|组合/i],
      role: "Multi-panel usage collage",
      composition: "exactly four equal-size panels in a clean 2x2 grid; no oversized hero panel, no sidebar stack, no masonry collage; selected product stays readable in every panel, usually about 12-15% of each panel rather than tiny or cramped",
      proof: "each panel proves a distinct verified use scene for the current product; no product-only detail, storage, flat-lay, or display panel",
      text: "no text labels, captions, badges, arrows, or callouts",
    },
    {
      key: "process",
      patterns: [/step|how to|fold|foldable|storage|pack|收纳|折叠|步骤|使用方法/i],
      role: "Process or storage demonstration",
      composition: "step sequence or storage scene following the reference order and spacing",
      proof: "show only verified folding, packing, storage, or use method from current product facts",
      text: "numbered labels allowed only for verified steps",
    },
  ];
  return definitions
    .map((definition) => ({ ...definition, index: firstPatternIndex(source, definition.patterns) }))
    .filter((definition) => definition.index >= 0)
    .sort((left, right) => left.index - right.index);
}

function defaultReferenceBlueprint() {
  return [
    {
      key: "hero",
      role: "Product-only hero image",
      composition: "dominant current product on pure white or very light studio background",
      proof: "show exact product form, selected option, color, material, and silhouette",
      text: "no added text",
    },
    {
      key: "structure",
      role: "Structure explanation image",
      composition: "clean callout layout with sparse arrows or detail insets",
      proof: "explain verified visible structure only",
      text: "short English labels allowed",
    },
    {
      key: "detail",
      role: "Material and detail proof image",
      composition: "full product plus 1-2 macro detail close-ups",
      proof: "prove material, edge, sole, texture, or construction details",
      text: "2-4 word labels max",
    },
    {
      key: "feature",
      role: "Functional benefit image",
      composition: "one clear visual proof around the strongest verified benefit",
      proof: "prove one verified benefit without borrowing competitor claims",
      text: "short benefit label only",
    },
    {
      key: "lifestyle",
      role: "Lifestyle use scene",
      composition: "source-verified use environment if available; otherwise neutral product-first environment; selected product occupies at least 30% of the image area",
      proof: "show only extracted scene/use facts; if none exist, show product placement without inferred lifestyle claims",
      text: "no text or one tiny scene label",
    },
    {
      key: "summary",
      role: "Summary or closing image",
      composition: "clean Amazon final image with product hero and 2-3 non-repeated proof points",
      proof: "summarize only current verified product benefits",
      text: "short labels, no long copy",
    },
  ];
}

function referenceBlueprintSlots(text) {
  const candidates = referenceBlueprintCandidates(text);
  const defaults = defaultReferenceBlueprint();
  const used = new Set();
  const pick = (preferredKeys, fallbackIndex) => {
    const candidate = candidates.find((item) => preferredKeys.includes(item.key) && !used.has(item.key))
      || candidates.find((item) => !used.has(item.key))
      || defaults[fallbackIndex];
    if (candidate?.key) used.add(candidate.key);
    return candidate;
  };
  return [
    pick(["hero", "multi-angle"], 0),
    pick(["structure", "process", "measurement"], 1),
    pick(["detail", "measurement"], 2),
    pick(["feature", "detail"], 3),
    pick(["lifestyle", "process", "collage"], 4),
    pick(["collage", "lifestyle", "multi-angle"], 5),
  ].map((slot, index) => ({
    ...defaults[index],
    ...slot,
    slotNumber: index + 1,
  }));
}

function referenceBlueprintSlot(typeId = "") {
  const index = Math.max(0, Math.min(5, Number.parseInt(typeId, 10) - 1 || 0));
  return referenceBlueprintSlots(sourcePayload.competitor || "")[index] || defaultReferenceBlueprint()[index];
}

function referenceBlueprintText(typeId = "") {
  const slot = referenceBlueprintSlot(typeId);
  return compactPromptItems([
    `Reference blueprint slot ${slot.slotNumber}: ${slot.role}`,
    `Reference-derived composition: ${slot.composition}`,
    `Reference-derived proof method: ${slot.proof}`,
    `Reference text density: ${slot.text}`,
  ], "", 4);
}

function referenceLinkInsightText(typeId = "") {
  const source = sourcePayload.competitor || "";
  if (!source) return "";
  const blueprint = referenceBlueprintSlot(typeId);
  const layout = referenceLayoutCues(source);
  const proof = referenceProofCues(source);
  const typeFocus = {
    "1": "apply reference hero framing only",
    "2": "apply reference structure/callout rhythm only",
    "3": "apply reference detail-proof rhythm only",
    "4": "apply reference feature-proof rhythm only",
    "5": "apply reference lifestyle/storage scene role only",
    "6": "apply reference human-use or environment framing only",
  }[typeId] || "apply reference image order and composition rhythm only";
  return compactPromptItems([
    `Current uploaded reference: ${referenceSourceLabel(source)} (${textFingerprint(source)})`,
    referenceBlueprintText(typeId),
    `Reference layout cues: ${layout.length ? layout.join(", ") : "use visible image order, shot distance, and composition rhythm from current uploaded reference"}`,
    proof.length ? `Reference proof-slot cues: ${proof.join(", ")}; rewrite using only current product verified benefits` : "",
    `Blueprint role for this image: ${blueprint.role}; ${typeFocus}`,
  ], "", 4);
}

function specModulePrompt(typeId, facts) {
  const dimensionLine = dimensionText(facts);
  const summarySideLabels = uniquePromptItems([
    facts.material,
    facts.structure,
    facts.feature1,
  ]).slice(0, 3);
  const summaryBottomLabels = uniquePromptItems([
    facts.feature2,
    facts.color,
    visibleDetailParameter(facts.detailParameter),
  ], [
    ...summarySideLabels,
    facts.titleSpec,
    facts.selectedSpec,
    facts.pack,
    facts.cupRange,
  ]).slice(0, 4);
  const option = facts.titleSpec || facts.selectedSpec;
  const optionCount = facts.pack ? `Product count/set: ${facts.pack}.` : "";
  const dimensions = dimensionLine ? `Verified dimensions: ${dimensionLine}.` : "No unverified dimensions.";
  const featureLabels = compactPromptItems(sellingPointCandidates(facts, 4), "verified benefits", 4);
  const sceneUse = useSceneText(facts, neutralProductSceneFallback(), 4);
  const sellingPointGroup1 = sellingPointGroups(facts, 0);
  const installationSteps = String(facts.installationSteps || "")
    .split(/\s*>\s*|\n+/)
    .map((step) => step.trim())
    .filter(Boolean)
    .slice(0, 4);
  const installationStepList = installationSteps.map((step, index) => `Step ${index + 1}: ${step}`).join("; ");

  const modules = {
    "1": {
      basic: basicImageRequirements("spec", "1"),
      details: productDetailText(facts, [option, facts.color], 6),
      style: overallStyleText(facts, "1", `Premium product-first hero scene; ${sceneMainProductScaleRule()} product is the primary visual subject; no added title, no added labels, no added overlay text; keep authentic product markings.`),
    },
    "2": {
      basic: basicImageRequirements("spec", "2"),
      details: productDetailText(facts, [sceneUse], 6),
      style: overallStyleText(facts, "2", sceneUse
        ? `Realistic lifestyle use scene: ${sceneUse}; ${sceneMainProductScaleRule()} Product stays clear and accurate.`
        : `${premiumStudioRenderRule()} No reference scene information; product only, with no invented usage context.`),
    },
    "3A": {
      basic: basicImageRequirements("spec", "3A"),
      details: productDetailText(facts, [sceneUse], 6),
      style: overallStyleText(facts, "3A", sceneUse
        ? `3-4 clean panels showing different verified use scenes: ${sceneUse}.`
        : `${premiumStudioRenderRule()} No reference scene information; use product-only multi-angle panels and do not invent use scenes.`),
    },
    "3B": {
      basic: "1:1 Amazon step-by-step installation instruction infographic, 4K clarity, exactly one clean 2x2 grid with four equal sequential panels.",
      details: productDetailText(facts, [
        installationStepList ? `Verified installation sequence: ${installationStepList}` : "No verified installation sequence was extracted; do not invent steps or replace them with use scenes.",
      ], 7),
      style: [
        "Instruction-only composition, not a lifestyle or multi-use collage.",
        installationStepList ? `Show these exact actions in reading order, left-to-right then top-to-bottom: ${installationStepList}.` : "Use a product-only neutral instruction layout without numbered actions when verified steps are unavailable.",
        "Every panel shows the same single current product, same color, same geometry, same neutral wall and consistent camera direction as it progresses through installation.",
        "Use a clear top title such as Easy Installation; number panels 1-4; one short 2-5 word English action caption per panel.",
        "Hands appear only where required to perform the stated action; keep product mechanics large and easy to inspect.",
        "No kitchen, bathroom, jewelry, headphones, utensils, hanging-load demonstration, decorative props, different rooms, different use cases, or installed-product gallery.",
        "Do not turn the four panels into four applications. Do not show unrelated objects hanging from the product. Do not invent a disassembly, accessory, adhesive layer, hole, screw, or installation action absent from the verified sequence.",
      ].filter(Boolean).join(" "),
      negative: "No multi-scene usage collage, lifestyle gallery, different rooms, kitchen scene, bathroom scene, jewelry display, headphones, utensils, hanging objects, load-test scene, unrelated props, repeated finished hooks, wrong product, changed geometry, invented parts, screws, drilling, adhesive pads, Chinese text, dense copy, or reordered steps.",
    },
    "4": {
      basic: "Size/range infographic, 1:1 Amazon image, 4K, clean layout with concise verified text.",
      details: productDetailText(facts, [
        shortOptionText(facts) || option,
        optionCount,
        facts.cupRange ? `Range: ${facts.cupRange}` : "",
        dimensions,
      ], 8),
      style: overallStyleText(facts, "4", "Clean size reference layout; added title can be \"Size Reference\"; no unverified measurements; preserve authentic product markings.", { includeHumanRule: false }),
    },
    "5": {
      basic: basicImageRequirements("spec", "5"),
      details: productDetailText(facts, [
        facts.bundleComponents ? `Included bundle components: ${facts.bundleComponents}` : `Verified options: ${compactVariantText(facts)}`,
      ], 7),
      style: overallStyleText(
        facts,
        "5",
        facts.bundleComponents
          ? bundleComponentsShowcaseRule(facts)
          : "Product option comparison grid; show only verified options; small added option tags only; preserve authentic product markings.",
        { includeHumanRule: false }
      ),
    },
    "6": {
      basic: basicImageRequirements("spec", "6"),
      details: productDetailText(facts, [], 5),
      style: overallStyleText(facts, "6", sellingPointImageTemplateRule(sellingPointGroup1, facts, "Spec template Image 6")),
    },
    "7": {
      basic: basicImageRequirements("spec", "7"),
      details: productDetailText(facts, [detailTextureText(facts, "") && `Macro focus: ${detailTextureText(facts, "")}`], 7),
      style: overallStyleText(facts, "7", "Macro close-up detail; sharp texture, clean edges, optional small magnifier inset.", { includeHumanRule: false }),
    },
    "8": {
      basic: basicImageRequirements("spec", "8"),
      details: productDetailText(facts, [`Summary points: ${compactPromptItems(sellingPointCandidates(facts, 5), featureLabels, 5)}`], 8),
      style: overallStyleText(facts, "8", "Summary layout with product centered and 3-4 visual proof insets/icons; labels are optional 3-5 word locators only; no dense added specification table; preserve authentic product markings."),
    },
  };
  const selected = modules[typeId] || modules["1"];

  return buildPromptSections({
    facts,
    templateId: "spec",
    typeId,
    basic: selected.basic,
    details: selected.details,
    style: selected.style,
    negative: selected.negative || negativePrompt(facts),
  });
}

function uniquePromptItems(items, exclusions = []) {
  const excluded = exclusions
    .filter(Boolean)
    .map((item) => comparablePromptItem(item));
  const seen = new Set();
  return items
    .filter(Boolean)
    .map((item) => String(item).trim())
    .filter((item) => {
      const lower = comparablePromptItem(item);
      if (!lower) return false;
      if (excluded.some((excludedItem) => excludedItem && (lower.includes(excludedItem) || excludedItem.includes(lower)))) return false;
      if (seen.has(lower)) return false;
      seen.add(lower);
      return true;
    });
}

function specTemplatePrompt(typeId, sku, data) {
  const facts = promptFacts(sku, data);
  return specModulePrompt(typeId, facts);
}

function sceneQualityRule() {
  return "Premium realistic scene lighting; product details crisp, scale readable, naturally integrated with the environment.";
}

function sceneTextureLine(facts) {
  const texture = visibleTextureDetails(facts);
  return `Texture: ${texture}; realistic surface detail, clean edges, natural shadows.`;
}

function sceneCategoryStyleRule(facts) {
  const sceneText = cleanFieldDisplayValue(facts?.scene || "");
  return sceneText
    ? `Verified source scene: ${sceneText}.`
    : "No reference scene information. Do not invent, infer, or add a usage scene; use a plain neutral studio background if an image still requires a background.";
}

function sceneOverallStyleText(facts, typeId, extra = "") {
  const isReferenceControlledSellingPoint = /Selling-point reference priority/i.test(extra);
  return compactPromptItems([
    isReferenceControlledSellingPoint ? "" : sceneCategoryStyleRule(facts),
    sceneQualityRule(),
    extra,
  ], "", 4);
}

function multiSceneLifestyleStyleText(facts, sceneList) {
  const hasVerifiedSceneList = hasVerifiedUseContext(facts);
  const globalSceneLines = [
    `Exactly 4 distinct complete real-life use scenes for ${sceneList}; each scene is one equal quadrant in a clean 2x2 grid.`,
    multiSceneEqualPanelRule(),
    scenePhraseInterpretationRule(),
    multiSceneProductScaleRule(),
    "Each panel should leave enough room for the current product's natural use posture, placement, handling, scale, and surrounding environment; do not crop so tight that the action becomes awkward.",
    "Every panel must be a complete human-scale lifestyle use scene, not a product display, detail, storage, or decor panel.",
    "No product-only close-up, top-down display shot, flat lay, studio shot, macro detail, option grid, storage display, basket display, or cropped cutout.",
    "Product clear and recognizable in every panel, and each panel still reads as a complete lifestyle scene.",
  ];
  return [
    sceneCategoryStyleRule(facts),
    "Four complete lifestyle scenes only; not an infographic or product grid.",
    ...globalSceneLines,
    hasVerifiedSceneList
      ? "Use only the Use Scene field currently shown on the left; do not add other scenes."
      : "No reference scene information; do not create a multi-scene lifestyle composition or invent scene content.",
    "No added selling-point text, no scene title labels, no captions, no callout labels, no badges, no arrows, no feature icons, no product-spec explanation, no inset close-up panels.",
  ].filter(Boolean).join(" / ");
}

function sceneMultiSceneDetails(facts, sceneList) {
  return sceneContextProductDetailText(facts, [sceneList], 5);
}
function sceneMultiSceneStyleText(facts, sceneList) {
  return multiSceneLifestyleStyleText(facts, sceneList);
}
function sceneMultiSceneModule(facts, sceneList) {
  if (!sceneList) {
    return {
      basic: "No reference scene information; do not generate or invent lifestyle scenes. Use a clean 2x2 product-only multi-angle layout on a plain neutral studio background.",
      details: sceneProductDetailText(facts, ["Four source-accurate product angles only; no people, actions, locations, or environmental props."], 7),
      style: `${premiumStudioRenderRule()} No use-scene content.`,
    };
  }
  return {
    basic: `1:1 Amazon listing image, 4K clarity, sharp realistic detail, equal 2x2 multi-panel complete-use-scene collage. ${multiSceneEqualPanelRule()} ${multiSceneProductScaleRule()}`,
    details: sceneMultiSceneDetails(facts, sceneList),
    style: sceneMultiSceneStyleText(facts, sceneList),
  };
}

function userProvidedSceneList(facts) {
  return useSceneText(facts, "", 4);
}

function sceneMultiAngleDetails(facts, physicalDetails) {
  return sceneProductDetailText(facts, [facts.isDifferentDesignSet ? "" : physicalDetails, visibleTextureDetails(facts)], 7);
}
function sceneMultiAngleStyleText(facts) {
  if (facts.isDifferentDesignSet) {
    return "Product-only complete-set display on a clean light studio background: give each different referenced set member one clear primary view at consistent scale, with separation between members and no text/annotations. Do not fill the layout with alternate-angle copies of one member.";
  }
  return "Product-only multi-angle display: front, side, back/top, and one detail view on clean light studio background; no text/annotations.";
}
function sceneExplanationDetails(facts, physicalDetails) {
  const dimensionLine = dimensionText(facts);
  const infoText = [
    "Main title required: Product Information.",
    dimensionLine && `Verified dimensions: ${dimensionLine}.`,
    facts.productStyle && `Verified product style: ${facts.productStyle}.`,
    facts.packaging && `Verified supplier packaging: ${facts.packaging}. Show it only in a clearly labeled packaging detail, never as the product itself or as a quantity claim.`,
    "Use 2-3 short English info labels for verified material, structure, texture, size/range, or visible detail only.",
    "Premium text hierarchy: large title plus 2-3 short 3-5 word labels, aligned rows, crisp typography, spacing, no dense paragraphs.",
  ].filter(Boolean);
  return sceneProductDetailText(facts, [...infoText, physicalDetails, visibleTextureDetails(facts)], 9);
}
function sceneExplanationStyleText(facts) {
  if (facts.isDifferentDesignSet) {
    return [
      "Premium complete-set information infographic with a large high-contrast title \"Product Information\" or \"Product Details\".",
      "Arrange every different referenced set member in its own clear product area at consistent scale; keep the three-member set relationship immediately understandable.",
      "Place shared verified material or set-level facts outside the individual areas. Apply member-specific callouts only beside the exact referenced member they describe.",
      "Use a clean light studio background, short English labels, generous spacing, and no paragraphs, dense table, unverified specification, or copied reference-image layout text.",
    ].join(" ");
  }
  return [
    "Premium product information infographic with large high-contrast title \"Product Information\" or \"Product Details\".",
    "Product centered; 2-3 verified 3-5 word callouts for material, structure, texture, size/range, or visible details.",
    "Polished typography, aligned label blocks, subtle dividers/icons, generous white space, soft shadows, restrained premium accents.",
    "No dense paragraphs, long claims, cluttered tables, or unsupported specs.",
    "No human model, hands, body parts, wearing model, lifestyle action, or use-scene composition.",
  ].join(" ");
}
function productFirstOptionalHumanRule() {
  return "Product-first proof scene; any human presence stays secondary.";
}

function premiumStudioRenderRule() {
  return "Premium commercial studio rendering: refined softbox lighting, subtle gradient shadow on white, crisp edges, realistic material highlights, tasteful negative space, and polished Amazon hero-image finish.";
}

function premiumLifestyleHeroRule(sceneText) {
  if (!sceneText) return "No reference scene information; do not invent a lifestyle environment. Use a plain neutral studio background with the product only.";
  return `Premium lifestyle hero photography: show the product actively being used in ${sceneText}; cinematic natural light, realistic depth of field, upscale props and environment, clear product silhouette, emotional but uncluttered composition, editorial-quality color grading.`;
}

function sceneFirstHeroReferenceDivergenceRule() {
  return [
    "First-main-image scene divergence: attached supplier/reference images are product-identity references, not a scene blueprint for Scene template Image 1A.",
    "Whenever possible, create a clearly different environment from every reference image while staying inside the verified Use Scene field: change the room/location, wall or surface treatment, surrounding props, camera position, crop, lighting direction, depth, and product placement.",
    "If only one functional use context is available, preserve that use context but redesign the setting and composition so the result is not a recreation of the reference photo.",
    "Do not copy the reference background, exact wall/countertop, prop arrangement, installation position, lighting, viewing angle, or scene composition; copy only the exact current-product identity, color, structure, count, and verified use facts.",
  ].join(" ");
}

function sceneHeroBasicRequirements(facts, heroVariant = "product") {
  if (!hasVerifiedUseContext(facts)) {
    return compactPromptItems([
      "1:1 Amazon product image",
      "4K clarity",
      "sharp realistic detail",
      "plain neutral studio background",
      "no person, use action, environmental props, or invented usage context",
      "no added overlay text",
      sceneMainProductScaleRule(),
    ], "", 8);
  }
  const variantRule = heroVariant === "human"
    ? "person/model may demonstrate use, but the selected product remains the primary visual subject and must not become a small accessory"
    : "product itself is the primary hero subject, with matching scene support";
  return compactPromptItems([
    "1:1 Amazon lifestyle hero image",
    "4K clarity",
    "sharp realistic detail",
    "no added overlay text",
    "preserve authentic non-Chinese product/packaging markings only",
    variantRule,
    sceneMainProductScaleRule(),
    `verified source scene/background: ${useSceneText(facts, neutralProductSceneFallback(), 2)}`,
  ], "", 8);
}
function sceneHeroProductDetails(facts, mainScene, heroVariant = "product") {
  if (!mainScene) {
    return sceneProductDetailText(facts, [
      "No reference scene information; product-only presentation with no person, use action, or environmental props.",
      visibleTextureDetails(facts),
    ], 8);
  }
  const variantDetail = heroVariant === "human"
    ? "Main template B: show the selected product being used or worn by a natural person in the matched scene; product remains the main visual subject, while human action/posture only explains scale and use."
    : "Main template A: product itself is the dominant subject; use the matched scene as context, props, depth, and atmosphere around the product.";
  return sceneProductDetailText(facts, [variantDetail, mainScene, visibleTextureDetails(facts)], 8);
}
function sceneHeroStyleText(facts, mainScene, heroVariant = "product") {
  if (!mainScene) {
    return sceneOverallStyleText(facts, "1", `${premiumStudioRenderRule()} Product only; do not invent a use scene.`);
  }
  const productFirstRule = [
    `Main template A: product-first hero in ${mainScene}.`,
    sceneMainProductScaleRule(),
    "Product is the largest visual subject and the first thing noticed; scene, props, natural light, foreground/background, and negative space support the product.",
    "Show product clearly with premium lifestyle atmosphere; avoid turning it into a plain product-only close-up or isolated studio shot.",
  ].join(" ");
  const humanUseRule = [
    `Main template B: human-use hero in ${mainScene}.`,
    sceneMainProductScaleRule(),
    "A natural person may use, wear, hold, or interact with the product, but the product remains the hero subject.",
    "Use close or medium-close framing so the product is clearly inspectable; human posture, scene context, props, light, and environment explain use without overpowering the product.",
  ].join(" ");
  return sceneOverallStyleText(facts, "1", heroVariant === "human" ? humanUseRule : productFirstRule);
}
function parameterIllustrationRule() {
  return `Size-reference parameter infographic like a premium Amazon measurement chart: include a clear 2-4 word top title such as "Size Reference" or "Product Details"; the main product must dominate the center, with verified dimensions drawn directly on or beside the fully expanded/open product using clear ruler arrows, dashed guide lines, and bold numeric labels. All measurement labels must describe the product itself in its fully expanded/open state. Never use package, shipping, carton, rolled storage, folded storage, bag, or box dimensions. ${referenceImageDimensionRule()} Use premium studio rendering with realistic material highlights, soft shadows, clean depth, polished typography, and only source-verified props; otherwise use a neutral background. Do not replace core measurements with floating feature cards. Optional small benefit icons may appear only after the core dimensions are clearly shown; each icon label must be 3-5 words max. Mini illustrations or close-up crops are secondary and must support the measured parameter, not replace the measurement diagram.`;
}

function summaryPosterStyleRule(facts = {}) {
  const supportingCutout = facts.isDifferentDesignSet
    ? "Use the large hero area for the complete referenced set or a source-supported scene featuring an actual set member. Use the right-side insets to give the other referenced members and their verified proof points distinct readable areas; do not use one member as a visual substitute for the set."
    : "An optional circular or softly rounded product cutout may overlap the lower-left area of the hero photo, showing one representative current product unit clearly on a clean light background. Keep it compact and do not use it for pack-count, quantity, or full-pack presentation.";
  return [
    `${productFirstOptionalHumanRule()} Polished feature summary poster in a premium Amazon lifestyle style.`,
    "Use the approved layout: left side is one large warm lifestyle hero photo occupying about 60-65% width; right side is a vertical column occupying about 35-40% width with 3-4 rounded rectangular product-detail or use-detail inset windows.",
    supportingCutout,
    "Top headline may be a large elegant 2-4 word seasonal/product mood phrase; feature labels sit on small warm rounded tabs inside or near each right-side inset, 1-3 English words max.",
    "Each right inset must show a real visual proof subject from the current product: use scene, decoration, material/texture, lightweight/comfort, or style match; keep product clear and source-accurate.",
    "Summary inset reference rule: when a matching current-product reference image exists for a feature, use that reference image's demonstrated scene/action logic. When no matching reference exists, use an accurate product display/detail view plus the short feature title only; do not invent a demonstration scene, test, action, mechanism, or result.",
    "Keep the poster airy and editorial, with soft sunlight, rounded windows, cream/white dividers, warm neutral label color, and no dense table, bullets, long captions, arrows, hard-sell badges, or text stacking.",
  ].join(" ");
}

function optionShowcaseRule() {
  return "Premium option showcase: add an English title such as \"Choose Your Color\" or \"Choose Your Style\"; use a refined comparison layout with one realistic product render per option, tasteful swatches, soft studio shadows, subtle background depth, consistent scale, elegant typography, and a clear current-option highlight.";
}

function bundleComponentsShowcaseRule(facts) {
  if (!facts.bundleComponents) return "";
  return "Bundle included-components showcase: add an English title such as \"What You Get\" or \"Complete Set\"; show every included component as a separate source-accurate physical item in one coordinated layout, with short component labels only. Do not present components as alternative options, do not merge them into one redesigned item, and do not add unverified accessories.";
}

function sceneSellingPointItems(facts, points, fallback) {
  const sellingPoints = limitedSellingPoints(points, 2);
  // With no confirmed left-side point, this image is a clean product display,
  // not a vacant selling-point slot to be filled with a generic claim.
  if (!sellingPoints.length) return [];
  const sellingPointText = sellingPoints.join(" + ");
  const support = compactSpecificPromptItems([
    facts.structure && !promptItemsOverlap(sellingPointText, facts.structure) ? facts.structure : "",
    facts.material && !promptItemsOverlap(sellingPointText, facts.material) ? facts.material : "",
    facts.color && !promptItemsOverlap(sellingPointText, facts.color) ? facts.color : "",
  ], "", 2);
  // The labels are deliberately short, but the generated image still needs the
  // complete current left-side claim as its visual target. Otherwise an old
  // shorthand label can replace the actual selling point.
  return [
    `Exact current left-side selling points to represent: ${sellingPointText}`,
    support,
  ].filter(Boolean);
}

function summaryInsetGuide(facts, points) {
  const guideItems = uniqueSellingPoints(points, 4).map((point) => {
    const key = sellingPointKey(point);
    if (key === "filtration") return "working-performance close-up";
    if (key === "material") return "material texture close-up";
    return `${point} source-verified detail close-up`;
  });
  return compactPromptItems([
    ...guideItems,
    facts.color && "reference color swatch or product color detail",
  ], "3-4 verified product detail close-ups", 4);
}

function sceneModulePrompt(typeId, facts) {
  const physicalDetails = compactSpecificPromptItems([
    facts.structure,
    facts.material,
    facts.color,
  ], "visible product structure, material texture, and true color", 3);
  const sceneList = userProvidedSceneList(facts);
  const mainScene = useSceneText(facts, neutralProductSceneFallback(), 3);
  const sellingPointSet = sellingPointCandidates(facts, 6);
  const sellingPointGroup1 = sellingPointGroups(facts, 0);
  const sellingPointGroup2 = sellingPointGroups(facts, 1);
  const summaryPoints = compactSpecificPromptItems([
    useSceneText(facts, "", 2),
    ...sellingPointSet,
  ], "main scene / multi-use / key selling points", 4);
  const summaryInsetText = summaryInsetGuide(facts, sellingPointSet);
  const modules = {
    "1A": {
      basic: sceneHeroBasicRequirements(facts, "product"),
      details: sceneHeroProductDetails(facts, mainScene, "product"),
      style: sceneHeroStyleText(facts, mainScene, "product"),
    },
    "1B": {
      basic: sceneHeroBasicRequirements(facts, "human"),
      details: sceneHeroProductDetails(facts, mainScene, "human"),
      style: sceneHeroStyleText(facts, mainScene, "human"),
    },
    "2": {
      ...sceneMultiSceneModule(facts, sceneList),
    },
    "3": {
      basic: "1:1 Amazon multi-angle product image, 4K clarity, sharp realistic detail, product-only layout, no added text, labels, callouts, badges, captions, or arrows.",
      details: sceneMultiAngleDetails(facts, physicalDetails),
      style: sceneMultiAngleStyleText(facts),
    },
    "4": {
      basic: "1:1 Amazon product explanation image, 4K clarity, sharp realistic detail, product-only layout, clean light studio background.",
      details: sceneExplanationDetails(facts, physicalDetails),
      style: sceneExplanationStyleText(facts),
    },
    "5": {
      basic: basicImageRequirements("scene", "5"),
      details: sceneProductDetailText(facts, sceneSellingPointItems(facts, sellingPointGroup1, "the primary verified benefit"), 7),
      style: sceneOverallStyleText(facts, "5", sellingPointImageTemplateRule(sellingPointGroup1, facts, "Scene template Image 5")),
    },
    "6": {
      basic: basicImageRequirements("scene", "6"),
      details: sceneProductDetailText(facts, sceneSellingPointItems(facts, sellingPointGroup2, "the secondary verified benefit"), 6),
      style: sceneOverallStyleText(facts, "6", `${sellingPointImageTemplateRule(sellingPointGroup2, facts, "Scene template Image 6")} Distinct from Image 5.`),
    },
    "7": {
      basic: basicImageRequirements("scene", "7"),
      details: sceneProductDetailText(facts, [
        `Summary points: ${summaryPoints}`,
        `Detail inset subjects: ${summaryInsetText}`,
      ], 8),
      style: sceneOverallStyleText(facts, "7", summaryPosterStyleRule(facts)),
    },
  };
  const selected = modules[typeId] || modules["1A"];

  return buildPromptSections({
    facts,
    templateId: "scene",
    typeId,
    basic: selected.basic,
    details: selected.details,
    style: selected.style,
    negative: negativePrompt(facts),
  });
}

function sceneTemplatePrompt(typeId, sku, data) {
  const facts = promptFacts(sku, data);
  return sceneModulePrompt(typeId, facts);
}

function featureModulePrompt(typeId, facts) {
  const sceneUse = useSceneText(facts, neutralProductSceneFallback(), 4);
  const sceneList = userProvidedSceneList(facts);
  const mainScene = useSceneText(facts, neutralProductSceneFallback(), 3);
  const optionText = compactSkuOptionText(facts.skuOption || shortOptionText(facts), facts);
  const dimensionLine = dimensionText(facts);
  const optionCount = facts.pack ? `Product count/set: ${facts.pack}.` : "";
  const dimensions = dimensionLine ? `Verified dimensions: ${dimensionLine}.` : "No unverified dimensions.";
  const productInfo = compactSpecificPromptItems([
    facts.productName && `Product: ${facts.productName}`,
    (optionText || facts.titleSpec || facts.selectedSpec) && `Current option: ${optionText || facts.titleSpec || facts.selectedSpec}`,
    optionCount,
    facts.cupRange && `Size / range: ${facts.cupRange}`,
    dimensions,
    specificPromptValue(facts.material, "") && `Material: ${facts.material}`,
    specificPromptValue(facts.structure, "") && `Structure: ${facts.structure}`,
  ], "", 8);
  const detailInfo = compactSpecificPromptItems([
    detailTextureText(facts, ""),
    visibleDetailParameter(facts.detailParameter),
    facts.color && `True color: ${facts.color}`,
  ], "", 4);
  const sellingPointGroup1 = sellingPointGroups(facts, 0);
  const sellingPointGroup2 = sellingPointGroups(facts, 1);
  const sellingPointSet = sellingPointCandidates(facts, 6);
  const summaryPoints = compactSpecificPromptItems([
    useSceneText(facts, "", 2),
    ...sellingPointSet,
    facts.material,
    facts.structure,
    facts.surfaceFinish,
  ], verifiedProductDetailFallback(), 6);
  const sceneSummaryPoints = compactSpecificPromptItems([
    useSceneText(facts, "", 2),
    ...sellingPointSet,
  ], verifiedProductDetailFallback(), 4);
  const summaryInsetText = summaryInsetGuide(facts, sellingPointSet);
  const modules = {
    "1": {
      basic: "1:1 Amazon listing image, 4K clarity, sharp realistic detail, pure white background, no added overlay text, product occupies about 85% of the frame.",
      details: sceneProductDetailText(facts, [visibleTextureDetails(facts)], 7),
      style: `Pure white Amazon main image: show only the product itself, centered, no hands, no people, no body parts, no props, no furniture, no room, no outdoor scene, no lifestyle background, no added title, no added labels. ${premiumStudioRenderRule()}`,
    },
    "2": {
      basic: mainScene
        ? `1:1 Amazon lifestyle hero image, 4K clarity, sharp realistic detail, premium real-use scene, no added overlay text, ${sceneMainProductScaleRule()} product clearly visible and actively used.`
        : `1:1 Amazon product image, 4K clarity, plain neutral studio background, no people or usage context, ${sceneMainProductScaleRule()}.`,
      details: sceneProductDetailText(facts, [mainScene, visibleTextureDetails(facts)], 7),
      style: sceneOverallStyleText(facts, "1", hasVerifiedUseContext(facts)
        ? `${premiumLifestyleHeroRule(mainScene)} ${sceneMainProductScaleRule()} Product must be in active use, not just placed as a prop; composition uses only source-verified context.`
        : `${premiumLifestyleHeroRule("")} Do not claim or depict an unverified use context.`),
    },
    "3": {
      basic: sceneList
        ? `1:1 Amazon listing image, 4K clarity, sharp realistic detail, premium equal 2x2 multi-scene lifestyle collage. ${multiSceneEqualPanelRule()} ${multiSceneProductScaleRule()}`
        : "No reference scene information; do not generate lifestyle scenes. Use a clean 2x2 product-only multi-angle layout on a plain neutral studio background.",
      details: sceneContextProductDetailText(facts, [
        sceneList && `Use scenes: ${sceneList}`,
        `Scene-implied benefits only: ${compactSpecificPromptItems(sellingPointSet, verifiedProductDetailFallback(), 4)}`,
      ], 6),
      style: multiSceneLifestyleStyleText(facts, sceneList),
    },
    "4": {
      basic: "Size-reference product parameter infographic, 1:1 Amazon image, 4K, clear measurement-first layout with concise verified English text.",
      details: productDetailText(facts, [
        productInfo,
        dimensionLine && `Mandatory measurement labels on image: ${dimensionLine}`,
      ], 8),
      style: overallStyleText(facts, "4", `${parameterIllustrationRule()} Show the product in the same expanded/open state documented by the source reference and visibly label only extracted measurements and verified option facts; no dense table, no filler fields, no unverified measurements.`, { includeHumanRule: false }),
    },
    "5": {
      basic: basicImageRequirements("spec", "5"),
      details: compactSpecificPromptItems([
        `Product: ${facts.productName}`,
        referenceColorLockText(facts),
        `Current selected option: ${facts.productName || optionText || facts.selectedSpec}`,
        facts.bundleComponents ? `Included bundle components: ${facts.bundleComponents}` : `Verified options: ${compactVariantText(facts)}`,
        facts.pack && `Count / set label: ${facts.pack}`,
      ], "", 8),
      style: overallStyleText(
        facts,
        "5",
        facts.bundleComponents
          ? bundleComponentsShowcaseRule(facts)
          : `${optionShowcaseRule()} Show only verified options and short English option tags; do not create unavailable colors, sizes, counts, bundles, or raw purchase-spec fragments.`,
        { includeHumanRule: false }
      ),
    },
    "6": {
      basic: basicImageRequirements("feature", "6"),
      details: productDetailText(facts, [], 5),
      style: overallStyleText(facts, "6", `Selling-point product presentation. ${sellingPointImageTemplateRule(sellingPointGroup1, facts, "Feature template Image 6")} Product remains clear and accurate.`),
    },
    "7": {
      basic: basicImageRequirements("feature", "7"),
      details: productDetailText(facts, [
        `Detail fields: ${detailInfo}`,
      ], 8),
      style: overallStyleText(facts, "7", `Accurate product detail/material presentation. ${sellingPointImageTemplateRule(sellingPointGroup2, facts, "Feature template Image 7")} Distinct from Image 6; no unsupported claims.`, { includeHumanRule: false }),
    },
    "8": {
      basic: basicImageRequirements("scene", "7"),
      details: productDetailText(facts, [
        `Summary points: ${sceneSummaryPoints || summaryPoints}`,
        `Detail inset subjects: ${summaryInsetText}`,
      ], 8),
      style: sceneOverallStyleText(facts, "7", summaryPosterStyleRule(facts)),
    },
  };
  const selected = modules[typeId] || modules["1"];
  return buildPromptSections({
    facts,
    templateId: "feature",
    typeId,
    basic: selected.basic,
    details: selected.details,
    style: selected.style,
    negative: negativePrompt(facts),
  });
}

function featureTemplatePrompt(typeId, sku, data) {
  const facts = promptFacts(sku, data);
  return featureModulePrompt(typeId, facts);
}

function genericFiveImageUseSceneText(facts) {
  return userProvidedSceneList(facts);
}

function genericFiveImageIdentityRule(facts) {
  return compactPromptItems([
    "Generic template: product must remain the exact current product from the selected source fields.",
    "Do not change product category, structure, material, color, count/set, dimensions, or verified option facts.",
    "Do not invent category-specific use scenes, props, benefits, labels, or accessories unless they are present in current product fields.",
    facts.material && `Verified material: ${facts.material}`,
    facts.structure && `Verified structure: ${facts.structure}`,
    facts.color && `Verified color: ${facts.color}`,
  ], "", 6);
}

function genericFiveImageDetailInfo(facts) {
  const dimensionLine = dimensionText(facts);
  const optionText = compactSkuOptionText(facts.skuOption || shortOptionText(facts), facts);
  return compactSpecificPromptItems([
    facts.productName && `Product: ${facts.productName}`,
    optionText && `Current option: ${optionText}`,
    facts.pack && `Count / set: ${facts.pack}`,
    facts.cupRange && `Size / range: ${facts.cupRange}`,
    dimensionLine && `Mandatory measurement labels on image: ${dimensionLine}`,
    facts.material && `Material: ${facts.material}`,
    facts.structure && `Structure: ${facts.structure}`,
    facts.surfaceFinish && `Technology: ${facts.surfaceFinish}`,
    visibleDetailParameter(facts.detailParameter) && `Detail: ${visibleDetailParameter(facts.detailParameter)}`,
  ], "", 8);
}

function genericFiveImageMainSceneStyle(facts, sceneText) {
  if (!sceneText) {
    return `${genericFiveImageIdentityRule(facts)} ${premiumStudioRenderRule()} No reference scene information; product only, with no people, actions, locations, or environmental props.`;
  }
  return sceneOverallStyleText(facts, "1", [
    genericFiveImageIdentityRule(facts),
    `Main scene: product-first realistic use scene in ${sceneText}.`,
    sceneMainProductScaleRule(),
    "Use only props, backgrounds, actions, and people that fit the current product and the verified Use Scene field.",
    "A person/model appears only if actual product use needs a human action; if present, the product remains the hero subject.",
    "No added overlay text; product use must look natural, clean, and Amazon-ready.",
  ].join(" "));
}

function genericFiveImageWhiteBackgroundStyle(facts) {
  return [
    "Pure white Amazon main image: show only the current product itself, centered and source-accurate.",
    "No scene props, hand, person, tool, added title, added labels, or category-specific background.",
    "Product occupies about 85% of the frame; preserve true color, material texture, packaging, and authentic non-Chinese markings only.",
    premiumStudioRenderRule(),
    genericFiveImageIdentityRule(facts),
  ].join(" ");
}

function genericFiveImageModulePrompt(typeId, facts) {
  const sceneText = genericFiveImageUseSceneText(facts);
  const sellingPointGroup = sellingPointGroups(facts, 0);
  const productInfo = genericFiveImageDetailInfo(facts);
  const sharedMultiScene = sceneMultiSceneModule(facts, sceneText);
  const modules = {
    "1": {
      basic: sceneText
        ? `1:1 Amazon main scene image, 4K clarity, sharp realistic detail, no added overlay text, ${sceneMainProductScaleRule()} product-first use scene, person/model optional only when product use requires it.`
        : `1:1 Amazon product image, 4K clarity, plain neutral studio background, no people or usage context, ${sceneMainProductScaleRule()}.`,
      details: sceneProductDetailText(facts, [
        genericFiveImageIdentityRule(facts),
        sceneText && `Use scene: ${sceneText}`,
        visibleTextureDetails(facts),
      ], 8),
      style: genericFiveImageMainSceneStyle(facts, sceneText),
    },
    "2": {
      basic: "1:1 Amazon white-background product image, 4K clarity, sharp realistic detail, pure white background, no added overlay text, product occupies about 85% of the frame.",
      details: sceneProductDetailText(facts, [
        genericFiveImageIdentityRule(facts),
        visibleTextureDetails(facts),
      ], 7),
      style: genericFiveImageWhiteBackgroundStyle(facts),
    },
    "3": {
      ...sharedMultiScene,
      details: [
        sharedMultiScene.details,
        genericFiveImageIdentityRule(facts),
      ].filter(Boolean).join(" / "),
      style: [
        sharedMultiScene.style,
        genericFiveImageIdentityRule(facts),
        "For this generic template image, each panel should keep the exact current product visibly involved in the natural use action.",
      ].filter(Boolean).join(" / "),
    },
    "4": {
      basic: basicImageRequirements("plantTie", "4"),
      details: productDetailText(facts, [
        genericFiveImageIdentityRule(facts),
      ], 7),
      style: sceneOverallStyleText(facts, "4", [
        genericFiveImageIdentityRule(facts),
        sellingPointImageTemplateRule(sellingPointGroup, facts, "Generic 5-image template Image 4"),
      ].join(" ")),
    },
    "5": {
      basic: "1:1 Amazon product detail information image, 4K clarity, sharp realistic detail, verified dimensions/material/structure/specification details only.",
      details: productDetailText(facts, [
        genericFiveImageIdentityRule(facts),
        productInfo,
      ], 9),
      style: overallStyleText(facts, "5", [
        parameterIllustrationRule(),
        sceneExplanationStyleText(facts),
        "Product detail image: reuse existing product detail / product information rules; focus on verified size, material, structure, count/set, texture, and specification information.",
        "Use 2-3 concise English information labels plus visible ruler arrows or detail callouts only when verified; no dense table or invented specs.",
      ].join(" "), { includeHumanRule: false }),
    },
  };
  const selected = modules[typeId] || modules["1"];

  return buildPromptSections({
    facts,
    templateId: "plantTie",
    typeId,
    basic: selected.basic,
    details: selected.details,
    style: selected.style,
    negative: negativePrompt(facts),
  });
}

function plantTieTemplatePrompt(typeId, sku, data) {
  const facts = promptFacts(sku, data);
  return genericFiveImageModulePrompt(typeId, facts);
}

function referenceLinkGlobalRule(facts, typeId = "") {
  return compactPromptItems([
    "Current product identity is the top priority; reference layout must adapt to the current product, never the reverse.",
    "Reference-link template: borrow only the image order, layout role, shot distance, composition rhythm, and visual proof method from the uploaded reference.",
    referenceLinkInsightText(typeId),
    "Current product fields always override the reference product: product type, color, material, structure, dimensions, scene, and verified benefits.",
    "If the reference product shape conflicts with the current product, keep the current product structure and adapt only the layout.",
    "Do not copy the reference brand, exact text, typography, people, image assets, product markings, or unsupported claims.",
    productIdentityBasicRule(facts),
  ], "", 7);
}
function referenceLinkModulePrompt(typeId, facts) {
  const blueprint = referenceBlueprintSlot(typeId);
  const blueprintRoute = referenceBlueprintText(typeId);
  const dimensionLine = dimensionText(facts);
  const mainProduct = compactSpecificPromptItems([
    facts.productName,
    facts.color,
    facts.material,
    facts.structure,
  ], "current verified product appearance", 5);
  const structureText = compactSpecificPromptItems([
    facts.structure,
    facts.detailParameter,
    facts.material,
  ], "verified visible product structure", 4);
  const sceneUse = useSceneText(facts, neutralProductSceneFallback(), 4);
  const materialDetail = compactSpecificPromptItems([
    facts.material,
    facts.surfaceFinish,
    facts.detailParameter,
    facts.structure,
  ], "verified material or structure detail", 4);
  const featurePoint = compactSpecificPromptItems([
    ...sellingPointCandidates(facts, 4),
  ], verifiedProductDetailFallback(), 4);
  const referenceInsight = referenceLinkInsightText(typeId);
  const referenceRule = referenceLinkGlobalRule(facts, typeId);
  const blueprintBasic = `1:1 Amazon reference-blueprint image ${typeId}, 4K clarity, sharp realistic detail, route: ${blueprint.role}.`;
  const blueprintMainScale = /hero|multi-angle|product-only/i.test(blueprint.key)
    ? "Product-only reference hero scale: current product remains the main visual subject and should occupy most of the frame."
    : sceneMainProductScaleRule();
  const blueprintPanelScale = /collage|grid|panel/i.test(`${blueprint.key} ${blueprint.composition}`)
    ? multiSceneProductScaleRule()
    : "";
  const modules = {
    "1": {
      basic: blueprintBasic,
      details: productDetailText(facts, [
        blueprintRoute,
        `Product form: ${mainProduct}`,
        referenceInsight,
        "Execute this exact reference slot with the current product; do not add extra views, scenes, claims, or callouts unless the current reference slot calls for them.",
      ], 7),
      style: overallStyleText(facts, "1", `${referenceRule} Execute slot composition exactly: ${blueprint.composition}. ${blueprintMainScale} Current product shape, color, material, and structure must stay exact.`, { includeHumanRule: !/hero|multi-angle|product-only/i.test(blueprint.key) }),
    },
    "2": {
      basic: blueprintBasic,
      details: productDetailText(facts, [
        blueprintRoute,
        dimensionLine && `Verified dimensions: ${dimensionLine}.`,
        `Structure focus: ${structureText}`,
        referenceInsight,
        "If this slot is not a structure slot, use the structure facts only as product-accuracy constraints, not as the main composition.",
        "Use the reference slot layout; labels/arrows/insets must explain only verified current-product facts.",
        "Do not invent folding, detachable parts, straps, openings, holes, hinges, or steps that are not in current product data.",
      ], 7),
      style: overallStyleText(facts, "2", `${referenceRule} Execute slot composition exactly: ${blueprint.composition}. Keep text density as: ${blueprint.text}. Product geometry stays unchanged.`),
    },
    "3": {
      basic: blueprintBasic,
      details: productDetailText(facts, [
        blueprintRoute,
        `Detail proof: ${materialDetail}`,
        referenceInsight,
        "If this slot is not a detail slot, use material/detail facts as supporting constraints while following the reference blueprint role.",
        "Macro close-ups or insets must come from the current product's verified material, surface, edge, texture, or construction.",
        "If a referenced detail is not verified for the current product, replace it with a verified current-product detail.",
      ], 7),
      style: overallStyleText(facts, "3", `${referenceRule} Execute slot composition exactly: ${blueprint.composition}. Visual proof first; no certification badges or unverified claims.`),
    },
    "4": {
      basic: blueprintBasic,
      details: productDetailText(facts, [
        blueprintRoute,
        referenceInsight,
        "Use the reference blueprint proof method; do not force bending, stretching, waterproofing, non-slip, portability, or other claims unless verified.",
      ], 7),
      style: overallStyleText(facts, "4", `${referenceRule} Execute slot composition exactly: ${blueprint.composition}. ${sellingPointImageTemplateRule(sellingPointGroups(facts, 0), facts, "Reference template Image 4")} Blueprint proof method: ${blueprint.proof}.`),
    },
    "5": {
      basic: blueprintBasic,
      details: sceneProductDetailText(facts, [
        blueprintRoute,
        `Scene proof: ${sceneUse}`,
        `Benefit focus: ${featurePoint}`,
        referenceInsight,
        "Use the reference blueprint scene role, crop, prop density, and lighting mood; adapt environment to current product category and verified use.",
      ], 7),
      style: sceneOverallStyleText(facts, "5", `${referenceRule} Execute slot composition exactly: ${blueprint.composition}. ${sceneMainProductScaleRule()} ${blueprintPanelScale} Product stays prominent and source-accurate; no forced travel/folding/packing scene unless verified.`),
    },
    "6": {
      basic: blueprintBasic,
      details: sceneProductDetailText(facts, [
        blueprintRoute,
        `Use-scene proof: ${sceneUse}`,
        `Lifestyle benefit: ${featurePoint}`,
        referenceInsight,
        "Use the reference blueprint closing role; human/model use is optional and must not hide, shrink, or alter the current product structure.",
      ], 7),
      style: sceneOverallStyleText(facts, "6", `${referenceRule} Execute slot composition exactly: ${blueprint.composition}. ${sceneMainProductScaleRule()} ${blueprintPanelScale} Do not copy the reference person, floor, exact pose, text style, or product shape.`),
    },
  };
  const selected = modules[typeId] || modules["1"];

  return buildPromptSections({
    facts,
    templateId: "reference",
    typeId,
    basic: selected.basic,
    details: selected.details,
    style: selected.style,
    negative: negativePrompt(facts),
  });
}

function referenceLinkTemplatePrompt(typeId, sku, data) {
  const facts = promptFacts(sku, data);
  return referenceLinkModulePrompt(typeId, facts);
}

function promptFor(templateId, typeId, sku, data) {
  const facts = promptFacts(sku, data);

  // Scene slot 6 is reserved for the second confirmed selling-point group.
  // Do not repurpose it as a product display or manufacture a generic claim.
  if (templateId === "scene" && typeId === "6" && !sellingPointGroups(facts, 1).length) {
    return "";
  }

  let prompt;
  if (templateId === "spec") prompt = specTemplatePrompt(typeId, sku, data);
  else if (templateId === "scene") prompt = sceneTemplatePrompt(typeId, sku, data);
  else if (templateId === "reference") prompt = referenceLinkTemplatePrompt(typeId, sku, data);
  else if (templateId === "plantTie") prompt = plantTieTemplatePrompt(typeId, sku, data);
  else prompt = featureTemplatePrompt(typeId, sku, data);
  return prompt;
}

function sellingPointGroupForImageTitle(templateId, typeId, facts) {
  if (templateId === "spec" && typeId === "6") return sellingPointGroups(facts, 0);
  if (templateId === "scene" && typeId === "5") return sellingPointGroups(facts, 0);
  if (templateId === "scene" && typeId === "6") return sellingPointGroups(facts, 1);
  if (templateId === "feature" && typeId === "6") return sellingPointGroups(facts, 0);
  if (templateId === "feature" && typeId === "7") return sellingPointGroups(facts, 1);
  if (templateId === "plantTie" && typeId === "4") return sellingPointGroups(facts, 0);
  return [];
}

function promptImageDisplayTitle(template, type, facts) {
  const points = sellingPointGroupForImageTitle(template.id, type.id, facts);
  if (!points.length) return "";
  const prefix = String(type.name || "").match(/^\s*([0-9]+[A-Z]?\.\s*)/)?.[1] || "";
  const label = sellingPointDisplayText(points);
  return `${prefix}${label}`;
}

function renderFacts() {
  const sku = selectedSku();
  const template = selectedTemplate();
  byId("currentTitle").textContent = hasExtractedProducts() ? `${skuDisplayLabel(sku)} · ${template.name}` : `待解析 · ${template.name}`;
  byId("badges").innerHTML = [
    "只写已确认规格",
    "不借鉴参数",
    "模板决定图组",
    "一次性输出",
  ].map((label) => `<span class="badge">${label}</span>`).join("");
  renderProductPromptGrid();
  renderParameterPromptGrid();
}

function imageGenerationState(cardKey) {
  if (!imageGenerationByCard[cardKey]) {
    const history = Array.isArray(persistedImageHistory[cardKey])
      ? persistedImageHistory[cardKey].map(normalizeGenerationHistoryRecord).filter(Boolean)
      : [];
    const latest = history[history.length - 1] || null;
    imageGenerationByCard[cardKey] = {
      model: latest?.model || "gpt-image-2",
      size: latest?.size || "1024x1024",
      status: "idle",
      message: "",
      images: latest?.images || [],
      history,
      selectedHistoryIds: [],
      availableReferences: latest?.referenceSnapshot || [],
      selectedReferences: latest?.referenceSnapshot?.slice(0, MAX_SELECTED_REFERENCES) || [],
      referenceSelectionInitialized: Boolean(latest),
      referencesExpanded: false,
      generatedPromptSnapshot: latest?.promptSnapshot || "",
      generatedReferenceSnapshot: latest?.referenceSnapshot || [],
    };
  }
  return imageGenerationByCard[cardKey];
}

function normalizeGenerationHistoryRecord(record) {
  if (!record || typeof record !== "object") return null;
  const images = Array.isArray(record.images) ? record.images.filter((url) => typeof url === "string" && url.trim()) : [];
  if (!images.length) return null;
  return {
    id: String(record.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
    createdAt: String(record.createdAt || new Date().toISOString()),
    images,
    model: String(record.model || "gpt-image-2"),
    size: String(record.size || "1024x1024"),
    promptSnapshot: String(record.promptSnapshot || ""),
    referenceSnapshot: Array.isArray(record.referenceSnapshot)
      ? record.referenceSnapshot.filter((url) => typeof url === "string" && /^https?:\/\//i.test(url))
      : [],
    referenceCount: Math.max(0, Number(record.referenceCount) || record.referenceSnapshot?.length || 0),
  };
}

function loadPersistedImageHistory() {
  try {
    const parsed = JSON.parse(readTabStorage(IMAGE_HISTORY_STORAGE_KEY) || "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function persistImageHistory(cardKey, history) {
  persistedImageHistory[cardKey] = [...history];
  writeTabStorage(IMAGE_HISTORY_STORAGE_KEY, JSON.stringify(persistedImageHistory));
}

function recordGeneratedImages(cardKey, images) {
  const state = imageGenerationState(cardKey);
  const item = promptStore.find((entry) => entry.key === cardKey);
  const record = normalizeGenerationHistoryRecord({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    images,
    model: state.model,
    size: state.size,
    promptSnapshot: item?.promptEn || "",
    referenceSnapshot: [...state.selectedReferences],
    referenceCount: state.selectedReferences.length,
  });
  if (!record) return;
  state.history = [...(state.history || []), record];
  state.images = [...record.images];
  state.generatedPromptSnapshot = record.promptSnapshot;
  state.generatedReferenceSnapshot = [...record.referenceSnapshot];
  persistImageHistory(cardKey, state.history);
}

function generationInputsChanged(cardKey, promptEn) {
  const state = imageGenerationState(cardKey);
  if (!state.images.length || !state.generatedPromptSnapshot) return false;
  return state.generatedPromptSnapshot !== promptEn
    || JSON.stringify(state.generatedReferenceSnapshot) !== JSON.stringify(state.selectedReferences);
}

function imageSizeOptions(model, selectedSize) {
  const sizes = model === "gpt-image-2-vip"
    ? ["1024x1024", "2048x2048", "2880x2880"]
    : ["1024x1024"];
  return sizes.map((size) => `<option value="${size}" ${size === selectedSize ? "selected" : ""}>${size}</option>`).join("");
}

function referencePurposeForPromptType(typeId = "") {
  const id = String(typeId || "");
  if (id === "1A" || id === "1") return ["main_product", "multi_angle", "product_explanation"];
  if (id === "1B") return ["human_use", "multi_scene", "main_product"];
  if (id === "2") return ["multi_scene", "human_use", "selling_point"];
  if (id === "3") return ["multi_angle", "main_product", "product_explanation"];
  if (id === "4") return ["product_explanation", "summary", "multi_angle", "main_product"];
  if (id === "5" || id === "6") return ["selling_point", "product_explanation", "summary", "detail"];
  if (id === "7" || id === "8") return ["summary", "product_explanation", "selling_point", "main_product"];
  return ["main_product", "product_explanation", "selling_point"];
}

function referencePurposeFromImageType(imageType = "") {
  const type = String(imageType || "").toLowerCase().replace(/[-\s]+/g, "_");
  if (/parameter|measurement|dimension|size|spec/.test(type)) return ["product_explanation", "summary"];
  if (/detail|close|macro|material|texture|construction|structure/.test(type)) return ["product_explanation", "selling_point", "summary"];
  if (/feature|benefit|demo|demonstration|function|proof/.test(type)) return ["selling_point", "product_explanation"];
  if (/life|scene|use|application|environment/.test(type)) return ["human_use", "multi_scene"];
  if (/angle|multi|side|front|back|top/.test(type)) return ["multi_angle", "main_product"];
  if (/comparison|variant|option|color/.test(type)) return ["main_product", "multi_angle"];
  if (/hero|overview|product|white|main/.test(type)) return ["main_product", "multi_angle"];
  return [];
}

function referenceMetaItemsForSku(skuId) {
  const values = Array.isArray(referenceImageMetaBySku[skuId]) ? referenceImageMetaBySku[skuId] : [];
  return values.filter((item) => item && /^https?:\/\//i.test(item.url || ""));
}

function taskMatchedReferenceUrls(type, skuId, fallbackUrls) {
  const desired = new Set(referencePurposeForPromptType(type?.id));
  const meta = referenceMetaItemsForSku(skuId);
  const exactOrUseful = (item) => {
    const bestFor = [
      ...(Array.isArray(item.best_for) ? item.best_for : []),
      ...referencePurposeFromImageType(item.image_type),
    ];
    return bestFor.some((value) => desired.has(String(value || "").toLowerCase()));
  };
  const preferred = meta.filter(exactOrUseful).map((item) => item.url);
  const exactSku = meta
    .filter((item) => /exact|high/i.test([item.sku_match, item.confidence, item.reference_value].filter(Boolean).join(" ")))
    .map((item) => item.url);
  return Array.from(new Set([...preferred, ...exactSku, ...fallbackUrls])).filter((url) => /^https?:\/\//i.test(url));
}

function referenceImageCandidatesForCard(type, facts, sku) {
  const points = sellingPointGroupForImageTitle(selectedTemplate().id, type.id, facts);
  const mapped = Array.isArray(referenceImagesBySku[sku?.id]) ? referenceImagesBySku[sku.id] : [];
  const mappedSet = new Set(mapped);
  const matched = matchedSellingPointVisualEvidence(points, facts).map((item) => item.imageUrl).filter((url) => mappedSet.has(url));
  const evidence = (facts.sellingPointVisualEvidence || []).map((item) => item.imageUrl).filter((url) => mappedSet.has(url));
  const taskMatched = taskMatchedReferenceUrls(type, sku?.id, Array.from(new Set([...matched, ...evidence, ...mapped])));
  const meta = referenceMetaItemsForSku(sku?.id);
  const assortmentIdentity = facts.isDifferentDesignSet
    ? meta.filter((item) => {
      const description = [item.image_type, ...(Array.isArray(item.best_for) ? item.best_for : [])].join(" ");
      const confidence = [item.sku_match, item.confidence, item.reference_value].filter(Boolean).join(" ");
      return /hero|overview|main|white|product|multi.?angle/i.test(description) && /exact|high/i.test(confidence);
    }).map((item) => item.url)
    : [];
  const identityFirst = facts.isDifferentDesignSet
    ? Array.from(new Set([...assortmentIdentity, mapped[0]].filter(Boolean)))
    : [];
  return {
    matched: Array.from(new Set([...identityFirst, ...matched, ...taskMatched].filter(Boolean))).slice(0, MAX_SELECTED_REFERENCES),
    all: Array.from(new Set([...identityFirst, ...taskMatched, ...matched, ...evidence, ...mapped].filter((url) => /^https?:\/\//i.test(url)))).slice(0, MAX_REFERENCE_CANDIDATES),
  };
}

function renderReferenceImages(state) {
  if (!state.availableReferences.length) {
    return `<p class="reference-empty">暂无匹配参考图，可在下方拖入本地图片。</p>`;
  }
  const canExpand = state.availableReferences.length > 8;
  return `
    <div class="reference-picker-summary">
      <span>候选图 ${state.availableReferences.length} 张</span>
      ${canExpand ? `<button type="button" class="reference-expand-toggle">${state.referencesExpanded ? "收起候选图" : `展开全部 ${state.availableReferences.length} 张`}</button>` : ""}
    </div>
    <div class="reference-image-grid ${state.referencesExpanded ? "is-expanded" : ""}">${state.availableReferences.map((reference, index) => {
    const checked = state.selectedReferences.includes(reference);
    const previewUrl = /^data:image\//i.test(reference) ? reference : sourceProxyUrl(reference);
    return `
      <div class="reference-image-option ${checked ? "is-selected" : ""}" title="参考图 ${index + 1}">
        <label>
          <input type="checkbox" class="reference-image-checkbox" data-reference-index="${index}" ${checked ? "checked" : ""}>
          <img src="${escapeHtml(previewUrl)}" alt="参考图 ${index + 1}" loading="lazy">
          <span>${checked ? "已选择" : "选择"}</span>
        </label>
        <button type="button" class="preview-reference-image" data-reference-index="${index}" aria-label="放大查看参考图 ${index + 1}" title="放大查看">⌕</button>
        <button type="button" class="delete-reference-image" data-reference-index="${index}" aria-label="删除参考图 ${index + 1}" title="删除参考图">×</button>
      </div>
    `;
  }).join("")}</div>`;
}

function renderImageGenerator(cardKey) {
  const state = imageGenerationState(cardKey);
  const isBusy = state.status === "submitting" || state.status === "processing";
  const history = Array.isArray(state.history) ? state.history : [];
  const selectedHistoryIds = new Set(state.selectedHistoryIds || []);
  const historyRecordHtml = (record, round, isLatest = false) => {
    const images = record.images.map((url, index) => `
      <figure class="generated-image-item">
        <a class="generated-image-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" aria-label="打开${isLatest ? "最新" : `第 ${round} 轮`}生成原图 ${index + 1}">
          <img src="${escapeHtml(url)}" alt="${isLatest ? "最新" : `第 ${round} 轮`}生成结果 ${index + 1}" loading="lazy">
        </a>
      </figure>
    `).join("");
    return `
      <section class="generation-history-record ${isLatest ? "is-latest" : "is-previous"}" data-history-id="${escapeHtml(record.id)}">
        <label class="generation-history-select" title="选择${isLatest ? "最新图片" : `第 ${round} 轮图片`}"><input type="checkbox" class="generation-history-checkbox" data-history-id="${escapeHtml(record.id)}" aria-label="选择${isLatest ? "最新图片" : `第 ${round} 轮图片`}" ${selectedHistoryIds.has(record.id) ? "checked" : ""}></label>
        <div class="generated-image-grid">${images}</div>
      </section>
    `;
  };
  const latestRecord = history[history.length - 1] || null;
  const previousRecords = history.slice(0, -1).map((record, index) => ({ record, round: index + 1 })).reverse();
  const latestHtml = latestRecord ? historyRecordHtml(latestRecord, history.length, true) : "";
  const previousHtml = previousRecords.map(({ record, round }) => historyRecordHtml(record, round)).join("");
  const assortmentReferenceNote = selectedProductStructureRoute === "assortment"
    ? `<p class="bundle-note">结构母图要求：至少选择一张清晰展示完整不同款组合的参考图；其他参考图只用于场景、动作或版式，不能改变产品身份。</p>`
    : "";
  const historyHtml = history.length ? `
    <div class="generation-history-heading">
      <strong>生成记录</strong>
      <span>共 ${history.length} 轮</span>
    </div>
    ${latestHtml}
    ${previousHtml ? `<div class="generation-history-archive"><div class="generation-history-toolbar"><span>已选择 ${selectedHistoryIds.size} 张</span><div><button type="button" class="select-all-generation-history">全选</button><button type="button" class="clear-generation-history-selection" ${selectedHistoryIds.size ? "" : "disabled"}>取消</button><button type="button" class="download-generation-history" ${selectedHistoryIds.size ? "" : "disabled"}>下载</button><button type="button" class="delete-generation-history" ${selectedHistoryIds.size ? "" : "disabled"}>删除</button></div></div><div class="generation-history-archive-grid">${previousHtml}</div></div>` : ""}
  ` : "";
  return `
    <section class="image-generator" data-card-key="${escapeHtml(cardKey)}">
      <div class="image-generator-heading">
        <div>
          <strong>出图工作区</strong>
          <span>参考图最多选择 ${MAX_SELECTED_REFERENCES} 张</span>
        </div>
        <span class="reference-count">${state.selectedReferences.length}/${MAX_SELECTED_REFERENCES}</span>
      </div>
      <div class="reference-image-picker">
        ${assortmentReferenceNote}
        ${renderReferenceImages(state)}
        <input class="reference-file-input" type="file" accept="image/jpeg,image/png,image/webp" multiple hidden ${isBusy ? "disabled" : ""}>
        <button type="button" class="reference-drop-zone" ${isBusy ? "disabled" : ""}>
          <strong>拖拽参考图到这里</strong>
          <span>或点击选择 JPG、PNG、WebP</span>
        </button>
      </div>
      <div class="image-generator-controls">
        <select class="image-model-select" aria-label="生图模型" ${isBusy ? "disabled" : ""}>
          <option value="gpt-image-2" ${state.model === "gpt-image-2" ? "selected" : ""}>GPT Image 2</option>
          <option value="gpt-image-2-vip" ${state.model === "gpt-image-2-vip" ? "selected" : ""}>GPT Image 2 VIP</option>
        </select>
        <select class="image-size-select" aria-label="图片尺寸" ${isBusy ? "disabled" : ""}>${imageSizeOptions(state.model, state.size)}</select>
        <button type="button" class="generate-image" ${isBusy ? "disabled" : ""}>${isBusy ? "生成中…" : "生成图片"}</button>
      </div>
      <p class="image-generation-status" role="status" aria-live="polite">${escapeHtml(state.message)}</p>
      ${historyHtml ? `<div class="generation-history">${historyHtml}</div>` : ""}
    </section>
  `;
}

function readImageFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("图片读取失败"));
    reader.readAsDataURL(file);
  });
}

async function referenceFileDataUrl(file) {
  if (!file?.type?.startsWith("image/")) throw new Error("仅支持图片文件");
  if (file.size > 12 * 1024 * 1024) throw new Error(`${file.name} 超过 12 MB`);
  const original = await readImageFileAsDataUrl(file);
  const image = await loadImageForCanvas(original);
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  const scale = Math.min(1, 1800 / Math.max(sourceWidth, sourceHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(sourceWidth * scale));
  canvas.height = Math.max(1, Math.round(sourceHeight * scale));
  const context = canvas.getContext("2d");
  if (!context) return original;
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.88);
}

async function addReferenceFiles(cardKey, fileList) {
  const state = imageGenerationState(cardKey);
  const remaining = Math.max(0, MAX_SELECTED_REFERENCES - state.selectedReferences.length);
  const files = Array.from(fileList || []).slice(0, remaining);
  if (!files.length) {
    state.message = remaining ? "没有可添加的图片。" : `参考图最多选择 ${MAX_SELECTED_REFERENCES} 张。`;
    updateImageGenerator(cardKey);
    return;
  }
  state.message = `正在读取 ${files.length} 张本地参考图…`;
  updateImageGenerator(cardKey);
  const added = [];
  const errors = [];
  for (const file of files) {
    try {
      added.push(await referenceFileDataUrl(file));
    } catch (error) {
      errors.push(error?.message || `${file.name} 读取失败`);
    }
  }
  state.availableReferences = Array.from(new Set([...added, ...state.availableReferences])).slice(0, MAX_REFERENCE_CANDIDATES);
  state.selectedReferences = Array.from(new Set([...state.selectedReferences, ...added])).slice(0, MAX_SELECTED_REFERENCES);
  if (added.length) lastReferenceSelectionCardKey = cardKey;
  state.message = errors.length
    ? `已添加 ${added.length} 张；${errors.slice(0, 2).join("；")}`
    : `已添加并选择 ${added.length} 张本地参考图。`;
  updateImageGenerator(cardKey);
}

function normalizeGeneratedImages(payload) {
  const candidates = [
    payload?.urls,
    payload?.images,
    payload?.results,
    payload?.data?.urls,
    payload?.data?.images,
    payload?.data?.results,
    payload?.result?.urls,
    payload?.result?.images,
  ];
  for (const candidate of candidates) {
    if (!Array.isArray(candidate)) continue;
    const urls = candidate.map((item) => typeof item === "string" ? item : item?.url || item?.imageUrl || item?.image_url).filter(Boolean);
    if (urls.length) return urls;
  }
  const single = payload?.url || payload?.imageUrl || payload?.image_url || payload?.data?.url || payload?.result?.url;
  return single ? [single] : [];
}

function imageTaskId(payload) {
  return String(payload?.id || payload?.taskId || payload?.task_id || payload?.data?.id || payload?.data?.taskId || payload?.data?.task_id || "").trim();
}

async function imageApiJson(url, options) {
  const response = await fetch(url, options);
  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new Error(`服务返回了无法解析的结果（HTTP ${response.status}）`);
  }
  if (!response.ok) throw new Error(payload?.error || payload?.message || `请求失败（HTTP ${response.status}）`);
  return payload;
}

function updateImageGenerator(cardKey) {
  const taskButtons = Array.from(document.querySelectorAll(".prompt-task-item")).filter((button) => button.dataset.promptCardKey === cardKey);
  const taskState = imageGenerationState(cardKey);
  const taskStatus = imageTaskStatusLabel(taskState);
  taskButtons.forEach((button) => { if (button.querySelector("small")) button.querySelector("small").textContent = taskStatus; });
  const section = Array.from(document.querySelectorAll(".image-generator")).find((node) => node.dataset.cardKey === cardKey);
  if (!section) {
    setSaveGeneratedSetUi(byId("saveGeneratedSetStatus")?.textContent || "");
    return;
  }
  const wrapper = document.createElement("div");
  wrapper.innerHTML = renderImageGenerator(cardKey).trim();
  const replacement = wrapper.firstElementChild;
  section.replaceWith(replacement);
  bindImageGeneratorSection(replacement);
  if (cardKey === activePromptCardKey) {
    const item = promptStore.find((entry) => entry.key === cardKey);
    const referenceNode = document.querySelector(".studio-dependency-strip > div:nth-child(2) span");
    const outputNode = document.querySelector(".studio-dependency-strip > div:last-child");
    const changed = generationInputsChanged(cardKey, item?.promptEn || "");
    if (referenceNode) referenceNode.textContent = `当前选择 ${taskState.selectedReferences.length} 张`;
    if (outputNode) {
      outputNode.classList.toggle("is-dirty", changed);
      const label = taskState.status === "queued"
        ? "等待本轮生成"
        : taskState.status === "failed"
          ? "本轮生成失败"
          : changed
            ? "输入已变化，需重新生成"
            : taskState.images.length ? `已生成 ${taskState.images.length} 张` : "等待生成";
      if (outputNode.querySelector("span")) outputNode.querySelector("span").textContent = label;
    }
  }
  setSaveGeneratedSetUi(byId("saveGeneratedSetStatus")?.textContent || "");
}

function openReferenceLightbox(reference, label = "参考图") {
  document.querySelector(".reference-lightbox")?.remove();
  const previewUrl = /^data:image\//i.test(reference) ? reference : sourceProxyUrl(reference);
  const overlay = document.createElement("div");
  overlay.className = "reference-lightbox";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", `${label}放大预览`);
  overlay.innerHTML = `
    <button type="button" class="reference-lightbox-close" aria-label="关闭大图" title="关闭">×</button>
    <figure>
      <img src="${escapeHtml(previewUrl)}" alt="${escapeHtml(label)}大图">
      <figcaption>${escapeHtml(label)}</figcaption>
    </figure>
  `;
  const close = () => {
    overlay.remove();
    document.removeEventListener("keydown", onKeydown);
  };
  const onKeydown = (event) => {
    if (event.key === "Escape") close();
  };
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) close();
  });
  overlay.querySelector(".reference-lightbox-close")?.addEventListener("click", close);
  document.addEventListener("keydown", onKeydown);
  document.body.appendChild(overlay);
  overlay.querySelector(".reference-lightbox-close")?.focus();
}

async function pollImageGeneration(cardKey, taskId) {
  const state = imageGenerationState(cardKey);
  for (let attempt = 0; attempt < 120; attempt += 1) {
    await new Promise((resolve) => window.setTimeout(resolve, 2500));
    const payload = await imageApiJson(`/api/image-task?id=${encodeURIComponent(taskId)}`);
    const images = normalizeGeneratedImages(payload);
    const status = String(payload?.status || payload?.data?.status || "").toLowerCase();
    if (images.length) {
      state.status = "success";
      state.message = `生成完成，共 ${images.length} 张。`;
      recordGeneratedImages(cardKey, images);
      updateImageGenerator(cardKey);
      return;
    }
    if (["failed", "error", "cancelled", "canceled"].includes(status)) {
      throw new Error(payload?.error || payload?.message || payload?.data?.message || "生图任务失败");
    }
    state.status = "processing";
    state.message = `Grsai 正在生成图片${attempt ? `（已等待约 ${Math.round((attempt + 1) * 2.5)} 秒）` : ""}…`;
    updateImageGenerator(cardKey);
  }
  throw new Error("生图等待超时，请稍后重试");
}

async function generateImageForCard(cardKey) {
  const item = promptStore.find((entry) => entry.key === cardKey);
  if (!item?.promptEn) return;
  const state = imageGenerationState(cardKey);
  state.status = "submitting";
  state.message = "正在提交生图任务…";
  updateImageGenerator(cardKey);
  try {
    const payload = await imageApiJson("/api/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: state.model, prompt: item.promptEn, aspectRatio: state.size, images: state.selectedReferences }),
    });
    const images = normalizeGeneratedImages(payload);
    if (images.length) {
      state.status = "success";
      state.message = `生成完成，共 ${images.length} 张。`;
      recordGeneratedImages(cardKey, images);
      updateImageGenerator(cardKey);
      return;
    }
    const taskId = imageTaskId(payload);
    if (!taskId) throw new Error(payload?.error || payload?.message || "Grsai 未返回任务 ID");
    state.status = "processing";
    state.message = "任务已提交，正在等待图片…";
    updateImageGenerator(cardKey);
    await pollImageGeneration(cardKey, taskId);
  } catch (error) {
    state.status = "failed";
    state.message = error?.message || "图片生成失败";
    updateImageGenerator(cardKey);
  } finally {
    refreshCurrentGenerationSummary();
  }
}

function refreshCurrentGenerationSummary() {
  if (bulkImageGenerationRunning) return;
  const items = promptStore.filter((item) => !item.empty && item.promptEn?.trim());
  if (!items.length) return;
  const successCount = items.filter((item) => imageGenerationState(item.key).status === "success").length;
  const failedCount = items.filter((item) => imageGenerationState(item.key).status === "failed").length;
  const pendingCount = Math.max(0, items.length - successCount - failedCount);
  if (successCount === items.length) {
    setBulkGenerationUi(`当前图组 ${successCount} 张图片全部成功。`);
  } else if (failedCount) {
    setBulkGenerationUi(`当前图组：成功 ${successCount} 张，失败 ${failedCount} 张，待生成 ${pendingCount} 张。`);
  } else if (successCount) {
    setBulkGenerationUi(`当前图组已生成 ${successCount}/${items.length} 张。`);
  }
}

function setBulkGenerationUi(message = "", completed = 0, total = 0) {
  const autoButton = byId("generateAllImagesAuto");
  const manualButton = byId("generateAllImagesManual");
  const status = byId("bulkGenerationStatus");
  [autoButton, manualButton].forEach((button) => {
    if (button) button.disabled = bulkImageGenerationRunning || !hasExtractedProducts();
  });
  if (autoButton) autoButton.textContent = bulkImageGenerationRunning && bulkImageGenerationMode === "auto"
    ? `自动生成中 ${completed}/${total}`
    : "自动选参考图生成";
  if (manualButton) manualButton.textContent = bulkImageGenerationRunning && bulkImageGenerationMode === "manual"
    ? `人工选图生成中 ${completed}/${total}`
    : "按人工选图生成";
  if (status) status.textContent = message;
}

function automaticReferencesForPromptItem(item) {
  const sku = selectedSku();
  const data = currentPromptData(sku);
  const facts = promptFacts(sku, data);
  const candidates = referenceImageCandidatesForCard(item.type, facts, sku);
  const preferred = candidates.matched.length ? candidates.matched : candidates.all;
  return Array.from(new Set(preferred)).slice(0, MAX_SELECTED_REFERENCES);
}

function imageTaskStatusLabel(state) {
  if (state.status === "queued") return "待生成";
  if (["submitting", "processing"].includes(state.status)) return "生成中";
  if (state.status === "failed") return "生成失败";
  if (state.status === "success") return "已生成";
  return state.images.length ? "已生成" : "待生成";
}

async function generateAllImagesForCurrentOutput(referenceMode = "auto") {
  if (bulkImageGenerationRunning) return;
  const items = promptStore.filter((item) => !item.empty && item.promptEn?.trim());
  if (!items.length) {
    setBulkGenerationUi("当前产品没有可生成的提示词。");
    return;
  }
  if (items.some((item) => ["submitting", "processing"].includes(imageGenerationState(item.key).status))) {
    setBulkGenerationUi("当前仍有图片任务正在生成，请等待完成后再批量提交。");
    return;
  }
  if (referenceMode === "manual") {
    const missingItems = items.filter((item) => !imageGenerationState(item.key).selectedReferences.length);
    if (missingItems.length) {
      setBulkGenerationUi(`人工选图路线尚缺 ${missingItems.length} 个任务：${missingItems.map((item) => item.id).join("、")}。请逐项勾选参考图后再生成。`);
      return;
    }
  } else {
    const missingItems = [];
    items.forEach((item) => {
      const state = imageGenerationState(item.key);
      const selectedReferences = automaticReferencesForPromptItem(item);
      state.availableReferences = Array.from(new Set([...selectedReferences, ...state.availableReferences])).slice(0, MAX_REFERENCE_CANDIDATES);
      state.selectedReferences = selectedReferences;
      state.referenceSelectionInitialized = true;
      if (!selectedReferences.length) missingItems.push(item);
      updateImageGenerator(item.key);
    });
    if (missingItems.length) {
      setBulkGenerationUi(`自动选图路线找不到 ${missingItems.map((item) => item.id).join("、")} 的当前 SKU 参考图，请检查资料或改用人工选图路线。`);
      return;
    }
  }

  bulkImageGenerationRunning = true;
  bulkImageGenerationMode = referenceMode;
  let completed = 0;
  let nextIndex = 0;
  items.forEach((item) => {
    const state = imageGenerationState(item.key);
    state.status = "queued";
    state.message = referenceMode === "manual" ? "已加入人工选图批量队列，等待生成…" : "已加入自动选图批量队列，等待生成…";
    updateImageGenerator(item.key);
  });
  setBulkGenerationUi(
    referenceMode === "manual"
      ? `人工选图路线：保留每个任务各自勾选的参考图，开始生成 ${items.length} 张。`
      : `自动选图路线：已按每个任务独立匹配当前 SKU 参考图，开始生成 ${items.length} 张。`,
    completed,
    items.length,
  );
  const worker = async () => {
    while (nextIndex < items.length) {
      const item = items[nextIndex];
      nextIndex += 1;
      await generateImageForCard(item.key);
      completed += 1;
      const successCount = items.filter((entry) => imageGenerationState(entry.key).status === "success").length;
      setBulkGenerationUi(`批量生成进度 ${completed}/${items.length}，已成功 ${successCount} 张。`, completed, items.length);
    }
  };
  try {
    await Promise.all(Array.from({ length: Math.min(2, items.length) }, () => worker()));
  } finally {
    bulkImageGenerationRunning = false;
    bulkImageGenerationMode = "";
    const successCount = items.filter((item) => imageGenerationState(item.key).status === "success").length;
    const failedCount = items.length - successCount;
    setBulkGenerationUi(
      failedCount
        ? `批量生成完成：成功 ${successCount} 张，失败 ${failedCount} 张；可查看各卡片错误并单独重试。`
        : `批量生成完成：${successCount} 张图片全部成功。`,
      items.length,
      items.length,
    );
  }
}

function chineseProductFilenameBase() {
  const sku = selectedSku() || {};
  const data = currentPromptData(sku);
  const candidates = [
    sku.chineseProductName,
    sku.originalProductName,
    sku.sourceProductName,
    sku.productName,
    sku.sourceName,
    sku.label,
    sku.displayLabel,
    data.productName,
  ].map((value) => cleanFieldDisplayValue(value)).filter(Boolean);
  let name = candidates.find((value) => /[\u3400-\u9fff]/.test(value)) || "";
  if (!name) {
    const identity = candidates.join(" ").toLowerCase();
    const localized = [
      [/dog\s*(?:poop|waste)\s*bags?|pet\s*waste\s*bags?/, "宠物垃圾袋"],
      [/coffee\s*filters?|filter\s*paper/, "咖啡滤纸"],
      [/plant\s*(?:ties?|straps?)/, "植物绑带"],
      [/resistance\s*bands?|exercise\s*bands?/, "弹力带"],
      [/(?:sun\s*catcher|suncatcher|crystal\s*(?:pendant|ornament))/, "水晶太阳捕手挂饰"],
    ].find(([pattern]) => pattern.test(identity));
    name = localized?.[1] || "产品套图";
  }
  return name
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, "-")
    .replace(/\s+/g, " ")
    .replace(/[-.\s]+$/g, "")
    .slice(0, 48) || "产品套图";
}

function selectedGeneratedImageItemsForCurrentSet() {
  return promptStore.flatMap((item) => {
    const state = imageGenerationState(item.key);
    const selectedIds = new Set(state.selectedHistoryIds || []);
    return state.history
      .filter((record) => selectedIds.has(record.id))
      .flatMap((record) => record.images.map((url) => ({ cardKey: item.key, url })));
  });
}

function crc32(bytes) {
  if (!crc32.table) {
    crc32.table = Array.from({ length: 256 }, (_, index) => {
      let value = index;
      for (let bit = 0; bit < 8; bit += 1) value = (value & 1) ? (0xedb88320 ^ (value >>> 1)) : (value >>> 1);
      return value >>> 0;
    });
  }
  let value = 0xffffffff;
  bytes.forEach((byte) => { value = crc32.table[(value ^ byte) & 0xff] ^ (value >>> 8); });
  return (value ^ 0xffffffff) >>> 0;
}

function zipDateTime(date = new Date()) {
  return {
    time: (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2),
    date: ((Math.max(1980, date.getFullYear()) - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate(),
  };
}

function buildStoredZip(entries) {
  const encoder = new TextEncoder();
  const localParts = [];
  const centralParts = [];
  let offset = 0;
  const stamp = zipDateTime();
  entries.forEach((entry) => {
    const filename = encoder.encode(entry.name);
    const bytes = entry.bytes;
    const checksum = crc32(bytes);
    const local = new Uint8Array(30 + filename.length);
    const localView = new DataView(local.buffer);
    localView.setUint32(0, 0x04034b50, true);
    localView.setUint16(4, 20, true);
    localView.setUint16(6, 0x0800, true);
    localView.setUint16(8, 0, true);
    localView.setUint16(10, stamp.time, true);
    localView.setUint16(12, stamp.date, true);
    localView.setUint32(14, checksum, true);
    localView.setUint32(18, bytes.length, true);
    localView.setUint32(22, bytes.length, true);
    localView.setUint16(26, filename.length, true);
    local.set(filename, 30);
    localParts.push(local, bytes);

    const central = new Uint8Array(46 + filename.length);
    const centralView = new DataView(central.buffer);
    centralView.setUint32(0, 0x02014b50, true);
    centralView.setUint16(4, 20, true);
    centralView.setUint16(6, 20, true);
    centralView.setUint16(8, 0x0800, true);
    centralView.setUint16(10, 0, true);
    centralView.setUint16(12, stamp.time, true);
    centralView.setUint16(14, stamp.date, true);
    centralView.setUint32(16, checksum, true);
    centralView.setUint32(20, bytes.length, true);
    centralView.setUint32(24, bytes.length, true);
    centralView.setUint16(28, filename.length, true);
    centralView.setUint32(42, offset, true);
    central.set(filename, 46);
    centralParts.push(central);
    offset += local.length + bytes.length;
  });
  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(8, entries.length, true);
  endView.setUint16(10, entries.length, true);
  endView.setUint32(12, centralSize, true);
  endView.setUint32(16, offset, true);
  return new Blob([...localParts, ...centralParts, end], { type: "application/zip" });
}

function imageExtension(contentType, url) {
  if (/webp/i.test(contentType)) return "webp";
  if (/jpe?g/i.test(contentType)) return "jpg";
  if (/png/i.test(contentType)) return "png";
  const match = String(url || "").match(/\.(png|jpe?g|webp)(?:[?#]|$)/i);
  return match ? match[1].replace(/jpeg/i, "jpg").toLowerCase() : "png";
}

function setSaveGeneratedSetUi(message = "") {
  const button = byId("saveGeneratedSet");
  const selectedCount = selectedGeneratedImageItemsForCurrentSet().length;
  if (button) {
    button.disabled = generatedSetSaving || !selectedCount;
    button.textContent = generatedSetSaving ? "正在整理选中图片…" : `一键保存选中图片图组${selectedCount ? `（${selectedCount}）` : ""}`;
  }
  if (byId("saveGeneratedSetStatus")) byId("saveGeneratedSetStatus").textContent = message;
}

async function saveGeneratedSet() {
  if (generatedSetSaving) return;
  const items = selectedGeneratedImageItemsForCurrentSet();
  if (!items.length) {
    setSaveGeneratedSetUi("请先在各任务的生成记录左上角勾选要保存的图片。");
    return;
  }
  generatedSetSaving = true;
  setSaveGeneratedSetUi(`正在读取 0/${items.length} 张图片…`);
  const baseName = chineseProductFilenameBase();
  const entries = [];
  try {
    for (let index = 0; index < items.length; index += 1) {
      const item = items[index];
      const requestUrl = /^data:image\//i.test(item.url) ? item.url : `/api/download-image?url=${encodeURIComponent(item.url)}`;
      const response = await fetch(requestUrl);
      if (!response.ok) throw new Error(`第 ${index + 1} 张图片读取失败（HTTP ${response.status}）`);
      const blob = await response.blob();
      const extension = imageExtension(blob.type, item.url);
      entries.push({ name: `${baseName}-${String(index + 1).padStart(2, "0")}.${extension}`, bytes: new Uint8Array(await blob.arrayBuffer()) });
      setSaveGeneratedSetUi(`正在读取 ${index + 1}/${items.length} 张图片…`);
    }
    const zip = buildStoredZip(entries);
    const objectUrl = URL.createObjectURL(zip);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = `${baseName}-选中图组.zip`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 2000);
    setSaveGeneratedSetUi(`已保存 ${entries.length} 张选中图片；文件名为“${baseName}-01”起顺序编号。`);
  } catch (error) {
    setSaveGeneratedSetUi(error?.message || "选中图片图组保存失败");
  } finally {
    generatedSetSaving = false;
    setSaveGeneratedSetUi(byId("saveGeneratedSetStatus")?.textContent || "");
  }
}

async function downloadSelectedGenerationHistory(cardKey) {
  const state = imageGenerationState(cardKey);
  const selectedIds = new Set(state.selectedHistoryIds || []);
  const selectedRecords = state.history
    .map((record, index) => ({ record, round: index + 1 }))
    .filter(({ record }) => selectedIds.has(record.id));
  if (!selectedRecords.length) return;
  const baseName = chineseProductFilenameBase();
  const entries = [];
  state.message = `正在整理已选择的 ${selectedRecords.length} 轮图片…`;
  updateImageGenerator(cardKey);
  try {
    for (const { record, round } of selectedRecords) {
      for (let imageIndex = 0; imageIndex < record.images.length; imageIndex += 1) {
        const url = record.images[imageIndex];
        const requestUrl = /^data:image\//i.test(url) ? url : `/api/download-image?url=${encodeURIComponent(url)}`;
        const response = await fetch(requestUrl);
        if (!response.ok) throw new Error(`第 ${round} 轮图片读取失败（HTTP ${response.status}）`);
        const blob = await response.blob();
        const extension = imageExtension(blob.type, url);
        entries.push({
          name: `${baseName}-第${String(round).padStart(2, "0")}轮-${String(imageIndex + 1).padStart(2, "0")}.${extension}`,
          bytes: new Uint8Array(await blob.arrayBuffer()),
        });
      }
    }
    const objectUrl = URL.createObjectURL(buildStoredZip(entries));
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = `${baseName}-历史记录.zip`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 2000);
    state.message = `已下载 ${selectedRecords.length} 轮、共 ${entries.length} 张历史图片。`;
  } catch (error) {
    state.message = error?.message || "历史图片下载失败";
  }
  updateImageGenerator(cardKey);
}

function bindImageGeneratorSection(section) {
  const cardKey = section.dataset.cardKey;
  const state = imageGenerationState(cardKey);
  section.querySelector(".reference-expand-toggle")?.addEventListener("click", () => {
    state.referencesExpanded = !state.referencesExpanded;
    updateImageGenerator(cardKey);
  });
  section.querySelector(".image-model-select")?.addEventListener("change", (event) => {
    state.model = event.target.value;
    state.size = "1024x1024";
    updateImageGenerator(cardKey);
  });
  section.querySelector(".image-size-select")?.addEventListener("change", (event) => {
    state.size = event.target.value;
  });
  section.querySelectorAll(".reference-image-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const reference = state.availableReferences[Number(checkbox.dataset.referenceIndex)];
      if (!reference) return;
      if (checkbox.checked && state.selectedReferences.length >= MAX_SELECTED_REFERENCES) {
        checkbox.checked = false;
        state.message = `参考图最多选择 ${MAX_SELECTED_REFERENCES} 张。`;
      } else if (checkbox.checked) {
        state.selectedReferences = Array.from(new Set([...state.selectedReferences, reference]));
        lastReferenceSelectionCardKey = cardKey;
        state.message = `已选择 ${state.selectedReferences.length} 张参考图。`;
      } else {
        state.selectedReferences = state.selectedReferences.filter((item) => item !== reference);
        lastReferenceSelectionCardKey = cardKey;
        state.message = state.selectedReferences.length ? `已选择 ${state.selectedReferences.length} 张参考图。` : "未选择参考图。";
      }
      updateImageGenerator(cardKey);
    });
  });
  section.querySelectorAll(".delete-reference-image").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const reference = state.availableReferences[Number(button.dataset.referenceIndex)];
      if (!reference) return;
      state.availableReferences = state.availableReferences.filter((item) => item !== reference);
      state.selectedReferences = state.selectedReferences.filter((item) => item !== reference);
      state.message = "已删除该参考图。";
      updateImageGenerator(cardKey);
    });
  });
  section.querySelectorAll(".preview-reference-image").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const index = Number(button.dataset.referenceIndex);
      const reference = state.availableReferences[index];
      if (reference) openReferenceLightbox(reference, `参考图 ${index + 1}`);
    });
  });
  const fileInput = section.querySelector(".reference-file-input");
  const dropZone = section.querySelector(".reference-drop-zone");
  dropZone?.addEventListener("click", () => fileInput?.click());
  fileInput?.addEventListener("change", () => addReferenceFiles(cardKey, fileInput.files));
  ["dragenter", "dragover"].forEach((eventName) => dropZone?.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.add("is-dragging");
  }));
  ["dragleave", "drop"].forEach((eventName) => dropZone?.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropZone.classList.remove("is-dragging");
  }));
  dropZone?.addEventListener("drop", (event) => addReferenceFiles(cardKey, event.dataTransfer?.files));
  section.querySelectorAll(".generation-history-checkbox").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const historyId = checkbox.dataset.historyId;
      state.selectedHistoryIds = checkbox.checked
        ? Array.from(new Set([...(state.selectedHistoryIds || []), historyId]))
        : (state.selectedHistoryIds || []).filter((id) => id !== historyId);
      updateImageGenerator(cardKey);
    });
  });
  section.querySelector(".select-all-generation-history")?.addEventListener("click", () => {
    state.selectedHistoryIds = state.history.map((record) => record.id);
    updateImageGenerator(cardKey);
  });
  section.querySelector(".clear-generation-history-selection")?.addEventListener("click", () => {
    state.selectedHistoryIds = [];
    updateImageGenerator(cardKey);
  });
  section.querySelector(".download-generation-history")?.addEventListener("click", () => downloadSelectedGenerationHistory(cardKey));
  section.querySelector(".delete-generation-history")?.addEventListener("click", () => {
    const selectedIds = new Set(state.selectedHistoryIds || []);
    if (!selectedIds.size || !window.confirm(`确定删除选中的 ${selectedIds.size} 轮生成记录吗？删除后无法在工具中恢复。`)) return;
    state.history = state.history.filter((record) => !selectedIds.has(record.id));
    state.selectedHistoryIds = [];
    const latest = state.history[state.history.length - 1] || null;
    state.images = latest?.images || [];
    state.generatedPromptSnapshot = latest?.promptSnapshot || "";
    state.generatedReferenceSnapshot = latest?.referenceSnapshot || [];
    persistImageHistory(cardKey, state.history);
    state.message = latest ? "已删除所选记录，当前显示最新保留结果。" : "已删除所选记录。";
    updateImageGenerator(cardKey);
  });
  section.querySelector(".generate-image")?.addEventListener("click", () => generateImageForCard(cardKey));
}

function bindImageGeneratorEvents() {
  document.querySelectorAll(".image-generator").forEach(bindImageGeneratorSection);
}

function taskManualParameterLabel(key, fallback, data) {
  return ({
    pack: "产品数量 / 套组",
    cupRange: "尺寸 / 适用范围",
    surfaceFinish: "工艺 / 表面处理",
    topWidth: "Dimension 1",
    sideLength: "Dimension 2",
    bottomWidth: "Dimension 3",
    weight: "Weight / Quantity",
  })[key] || fallback;
}

function renderTaskParameterPanel(data, facts) {
  const primaryFacts = [
    ["中文产品 / 当前款式", skuDisplayLabel(selectedSku(), data)],
    ["颜色", facts.color || "待补充"],
    ["结构 / 工艺", facts.structure || "待补充"],
  ];
  return `
    <section class="task-parameter-panel">
      <div class="task-input-heading">
        <div><strong>产品参数</strong><span>修改后会重新计算当前套组提示词</span></div>
        <span class="task-sync-state">自动同步</span>
      </div>
      <div class="task-primary-facts">${primaryFacts.map(([label, value]) => `
        <div><small>${escapeHtml(label)}</small><strong>${escapeHtml(value)}</strong></div>
      `).join("")}</div>
      <div class="task-input-heading task-manual-heading">
        <div><strong>人工补充参数</strong><span>保存到当前 SKU，并进入全部对应提示词</span></div>
      </div>
      <div class="task-manual-fields">${manualFields.map(([key, label]) => {
        const suppressSharedAssortmentDimension = facts.isDifferentDesignSet
          && extractedManualFieldKeys.has(key);
        const sourceText = !suppressSharedAssortmentDimension && extractedManualFieldKeys.has(key) && data[key]
          ? parameterSourceForData({ ...selectedSku(), ...data }, key)
          : "";
        const fieldValue = suppressSharedAssortmentDimension
          ? ""
          : ["topWidth", "sideLength", "bottomWidth", "weight"].includes(key) && data[key]
          ? editableParameterValue(data[key], semanticParameterLabel({ ...selectedSku(), ...data }, key))
          : data[key] || "";
        return `
        <label>
          <span>${escapeHtml(taskManualParameterLabel(key, label, data))}</span>
          <input class="task-manual-input" data-key="${escapeHtml(key)}" value="${escapeHtml(fieldValue)}" placeholder="${suppressSharedAssortmentDimension ? "不同款需按成员分别取证" : "人工补充"}"${suppressSharedAssortmentDimension ? " disabled" : ""}>
          ${sourceText ? `<small class="parameter-source">来源：${escapeHtml(sourceText)}</small>` : ""}
        </label>
      `;}).join("")}</div>
    </section>
  `;
}

function bindTaskParameterInputs(grid) {
  grid.querySelectorAll(".task-manual-input").forEach((input) => {
    const commit = () => {
      const key = input.dataset.key;
      const skuId = selectedSku()?.id || "";
      if (!key || !skuId) return;
      const value = cleanFieldDisplayValue(input.value);
      if (cleanFieldDisplayValue(fieldOverridesBySku[skuId]?.[key]) === value) return;
      fieldOverrides[key] = value;
      fieldOverridesBySku[skuId] = { ...(fieldOverridesBySku[skuId] || {}), [key]: value };
      const sidebarInput = byId(`field-${key}`);
      if (sidebarInput) sidebarInput.value = value;
      fieldSnapshot = currentFieldSignature();
      renderAll();
      byId("copyStatus").textContent = "人工参数已保存，并已更新整套提示词。";
    };
    input.addEventListener("change", commit);
    input.addEventListener("blur", commit);
  });
}

function promptTaskListHtml(items, activeItem, ariaLabel) {
  return `<nav class="prompt-task-list" aria-label="${escapeHtml(ariaLabel)}">
    <div class="prompt-task-list-head"><strong>图组任务</strong><span>${items.length} 张</span></div>
    ${items.map((item) => {
      const state = imageGenerationState(item.key);
      const status = imageTaskStatusLabel(state);
      return `<button type="button" class="prompt-task-item ${item.key === activeItem.key ? "is-active" : ""}" data-prompt-card-key="${escapeHtml(item.key)}">
        <b>${escapeHtml(item.id)}</b><span><strong>${escapeHtml(item.type.name.replace(/^\s*[0-9]+[A-Z]?\.\s*/, ""))}</strong><small>${status}</small></span>
      </button>`;
    }).join("")}
  </nav>`;
}

function refreshPromptSurfaces() {
  renderProductPromptGrid();
  renderParameterPromptGrid();
}

function bindPromptTaskSelection(container) {
  container.querySelectorAll(".prompt-task-item").forEach((button) => {
    button.addEventListener("click", () => {
      activePromptCardKey = button.dataset.promptCardKey || "";
      refreshPromptSurfaces();
    });
  });
}

function bindPromptTextControls(container) {
  container.querySelectorAll(".copy-prompt").forEach((button) => {
    button.addEventListener("click", () => copyText(promptStore.find((item) => item.key === button.dataset.promptKey)?.prompt || "", "已复制该图提示词。", button));
  });
  container.querySelectorAll(".language-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const item = promptStore.find((entry) => entry.key === button.dataset.promptKey);
      if (!item) return;
      promptLanguageByCard[item.key] = item.language === "zh" ? "en" : "zh";
      refreshPromptSurfaces();
      byId("copyStatus").textContent = `已切换为${promptLanguageByCard[item.key] === "zh" ? "中文" : "英文"}提示词。`;
    });
  });
}

function renderProductPromptGrid() {
  const grid = byId("productPromptGrid");
  if (!grid) return;

  const sku = selectedSku();
  const template = selectedTemplate();
  if (!hasExtractedProducts()) {
    promptStore = [];
    grid.innerHTML = `<p class="empty-state">请选择 Amazon 模板、1688 HTML 或参考链接资料后点击解析。</p>`;
    return;
  }
  const data = currentPromptData(sku);
  const facts = promptFacts(sku, data);
  const displayLabel = skuDisplayLabel(sku, data);
  promptStore = template.imageTypes.map((type, index) => {
    const key = promptCardKey(sku, template, type);
    const language = promptLanguageByCard[key] || "en";
    const promptEn = bracketPromptVariables(promptFor(template.id, type.id, sku, data), facts, type.id);
    const prompt = promptTextForLanguage(promptEn, language);
    return { id: type.id, key, index, type, language, promptEn, prompt, empty: !promptEn.trim() };
  });

  promptStore.forEach((item) => {
    const type = item.type;
    const state = imageGenerationState(item.key);
    const referenceCandidates = referenceImageCandidatesForCard(type, facts, sku);
    state.availableReferences = Array.from(new Set([...referenceCandidates.all, ...state.availableReferences])).slice(0, MAX_REFERENCE_CANDIDATES);
    if (!state.referenceSelectionInitialized) {
      state.selectedReferences = referenceCandidates.matched.slice(0, MAX_SELECTED_REFERENCES);
      state.referenceSelectionInitialized = true;
    }
  });

  const visibleItems = promptStore.filter((item) => !item.empty);
  if (!visibleItems.some((item) => item.key === activePromptCardKey)) activePromptCardKey = visibleItems[0]?.key || "";
  const activeItem = visibleItems.find((item) => item.key === activePromptCardKey);
  if (!activeItem) {
    grid.innerHTML = `<p class="empty-state">当前模板没有可用提示词。</p>`;
    return;
  }
  const activeState = imageGenerationState(activeItem.key);
  const inputsChanged = generationInputsChanged(activeItem.key, activeItem.promptEn);
  const referenceCount = activeState.selectedReferences.length;
  const outputState = inputsChanged ? "输入已变化，需重新生成" : activeState.images.length ? `已生成 ${activeState.images.length} 张` : "等待生成";
  grid.innerHTML = `
    <div class="prompt-workbench">
      ${promptTaskListHtml(visibleItems, activeItem, "提示词与图片任务")}
      <section class="prompt-task-stage">
        <div class="prompt-dependency-strip studio-dependency-strip" aria-label="当前图片依赖关系">
          <div><b>① 当前提示词</b><span>${escapeHtml(activeItem.id)} · 已从参数页同步</span></div>
          <div><b>② 参考图</b><span>当前选择 ${referenceCount} 张</span></div>
          <div class="${inputsChanged ? "is-dirty" : ""}"><b>③ 对应生成结果</b><span>${escapeHtml(outputState)}</span></div>
        </div>
        <article class="prompt-card active-prompt-card">
        <div class="prompt-card-head">
          <div>
            <span>${escapeHtml(displayLabel)}</span>
            <h3>${escapeHtml(activeItem.type.name)}</h3>
          </div>
          <div class="prompt-actions">
            <button type="button" class="copy-prompt" data-prompt-key="${escapeHtml(activeItem.key)}">复制</button>
            <button type="button" class="language-toggle" data-prompt-key="${escapeHtml(activeItem.key)}">${activeItem.language === "zh" ? "切英文" : "切中文"}</button>
          </div>
        </div>
        <div class="prompt-card-body">
          <div class="prompt-input-column">
            <section class="task-prompt-panel studio-task-prompt-panel">
              <div class="task-input-heading"><div><strong>当前提示词</strong><span>与右侧参考图共同决定当前生成结果</span></div></div>
              <pre class="prompt-preview">${highlightPromptVariables(activeItem.prompt, facts, activeItem.type.id)}</pre>
            </section>
          </div>
          ${renderImageGenerator(activeItem.key)}
        </div>
      </article>
      </section>
    </div>
  `;
  bindPromptTaskSelection(grid);
  bindPromptTextControls(grid);
  bindImageGeneratorEvents();
  setBulkGenerationUi(byId("bulkGenerationStatus")?.textContent || "");
  setSaveGeneratedSetUi(byId("saveGeneratedSetStatus")?.textContent || "");
}

function renderParameterPromptGrid() {
  const grid = byId("parameterPromptGrid");
  if (!grid) return;
  if (!hasExtractedProducts() || !promptStore.length) {
    grid.innerHTML = `<p class="empty-state">第 1 页解析出产品后，这里显示参数对应的整套提示词。</p>`;
    return;
  }
  const sku = selectedSku();
  const data = currentPromptData(sku);
  const facts = promptFacts(sku, data);
  const displayLabel = skuDisplayLabel(sku, data);
  const visibleItems = promptStore.filter((item) => !item.empty);
  const activeItem = visibleItems.find((item) => item.key === activePromptCardKey) || visibleItems[0];
  if (!activeItem) {
    grid.innerHTML = `<p class="empty-state">当前模板没有可用提示词。</p>`;
    return;
  }
  grid.innerHTML = `
    <div class="parameter-prompt-workbench">
      ${promptTaskListHtml(visibleItems, activeItem, "参数对应提示词任务")}
      <article class="prompt-card parameter-prompt-detail">
        <div class="prompt-card-head"><div><span>${escapeHtml(displayLabel)}</span><h3>${escapeHtml(activeItem.type.name)}</h3></div><div class="prompt-actions"><button type="button" class="copy-prompt" data-prompt-key="${escapeHtml(activeItem.key)}">复制</button><button type="button" class="language-toggle" data-prompt-key="${escapeHtml(activeItem.key)}">${activeItem.language === "zh" ? "切英文" : "切中文"}</button></div></div>
        <div class="parameter-prompt-link"><span>左侧当前 SKU 参数</span><b>→</b><span>${escapeHtml(activeItem.id)} 对应提示词</span></div>
        <section class="task-prompt-panel"><div class="task-input-heading"><div><strong>完整提示词</strong><span>左侧任何参数修改都会重新计算此处内容</span></div></div><pre class="prompt-preview">${highlightPromptVariables(activeItem.prompt, facts, activeItem.type.id)}</pre></section>
      </article>
    </div>
  `;
  bindPromptTaskSelection(grid);
  bindPromptTextControls(grid);
}

function renderPrompt() {
  refreshPromptSurfaces();
}

function renderAll() {
  renderBundleEditor();
  renderProductParameters();
  renderSourceSummary();
  renderFacts();
  const productLabel = hasExtractedProducts() ? skuDisplayLabel(selectedSku()) : "新产品";
  document.title = `${productLabel} · 提示词工具`;
  fieldSnapshot = currentFieldSignature();
  persistWorkspaceSnapshot();
}

function persistWorkspaceSnapshot() {
  if (!hasExtractedProducts()) return;
  const snapshot = {
    savedAt: new Date().toISOString(),
    extractedProducts,
    fieldOverridesBySku,
    appliedSellingPointOverridesBySku,
    referenceImagesBySku,
    referenceImageMetaBySku,
    availableReferenceImageUrls,
    bundleStateBySku,
    supplierSourceFileNames,
    selectedExtractionRoute,
    selectedProductStructureRoute,
    selectedSkuId: byId("skuSelect")?.value || extractedProducts[0]?.id || "",
    supplierSkuBinding: byId("supplierSkuBinding")?.value || "",
    templateId: byId("templateSelect")?.value || DEFAULT_TEMPLATE_ID,
    activeWorkflowPage,
  };
  writeTabStorage(WORKSPACE_STORAGE_KEY, JSON.stringify(snapshot));
}

function restoreWorkspaceSnapshot() {
  try {
    const snapshot = JSON.parse(readTabStorage(WORKSPACE_STORAGE_KEY) || "null");
    if (!snapshot || !Array.isArray(snapshot.extractedProducts) || !snapshot.extractedProducts.length) return null;
    extractedProducts = snapshot.extractedProducts;
    fieldOverridesBySku = snapshot.fieldOverridesBySku && typeof snapshot.fieldOverridesBySku === "object" ? snapshot.fieldOverridesBySku : {};
    appliedSellingPointOverridesBySku = snapshot.appliedSellingPointOverridesBySku && typeof snapshot.appliedSellingPointOverridesBySku === "object"
      ? snapshot.appliedSellingPointOverridesBySku
      : {};
    referenceImagesBySku = snapshot.referenceImagesBySku && typeof snapshot.referenceImagesBySku === "object" ? snapshot.referenceImagesBySku : {};
    referenceImageMetaBySku = snapshot.referenceImageMetaBySku && typeof snapshot.referenceImageMetaBySku === "object" ? snapshot.referenceImageMetaBySku : {};
    availableReferenceImageUrls = Array.isArray(snapshot.availableReferenceImageUrls) ? snapshot.availableReferenceImageUrls : [];
    bundleStateBySku = snapshot.bundleStateBySku && typeof snapshot.bundleStateBySku === "object" ? snapshot.bundleStateBySku : {};
    supplierSourceFileNames = Array.isArray(snapshot.supplierSourceFileNames) ? snapshot.supplierSourceFileNames : [];
    selectedExtractionRoute = extractionRoutePreviews[snapshot.selectedExtractionRoute] ? snapshot.selectedExtractionRoute : "local";
    selectedProductStructureRoute = productStructureRoutePreviews[snapshot.selectedProductStructureRoute] ? snapshot.selectedProductStructureRoute : "single";
    productStructureRouteManuallySelected = Boolean(productStructureRoutePreviews[snapshot.selectedProductStructureRoute]);
    hasUserSourceAttempt = true;
    sourcePayload = {
      purchase: "",
      amazonTemplate: "已从浏览器本地工作记录恢复",
      supplier: availableReferenceImageUrls.length ? "已恢复当前 SKU 的供应商参考图" : "",
      competitor: "",
    };
    renderProductSelect(snapshot.selectedSkuId);
    const restoredSku = extractedProducts.find((sku) => sku.id === (snapshot.selectedSkuId || extractedProducts[0]?.id));
    if (productStructureRoutePreviews[restoredSku?.productStructureRoute]) {
      selectedProductStructureRoute = restoredSku.productStructureRoute;
    }
    populateSupplierSkuBinding(extractedProducts);
    if (snapshot.supplierSkuBinding && extractedProducts.some((sku) => sku.id === snapshot.supplierSkuBinding)) {
      byId("supplierSkuBinding").value = snapshot.supplierSkuBinding;
    }
    if (templates.some((template) => template.id === snapshot.templateId && !template.disabled)) {
      byId("templateSelect").value = snapshot.templateId;
    }
    return snapshot;
  } catch (error) {
    console.warn("无法恢复当前工作台", error);
    return null;
  }
}

function clearPersistedWorkspace() {
  removeTabStorage(WORKSPACE_STORAGE_KEY);
}

function allPromptsForSku() {
  if (!hasExtractedProducts()) return "";
  const sku = selectedSku();
  const template = selectedTemplate();
  const data = currentPromptData(sku);
  const facts = promptFacts(sku, data);
  return template.imageTypes.map((type) => {
    const title = promptImageDisplayTitle(template, type, facts) || type.promptName || type.name;
    const key = promptCardKey(sku, template, type);
    const promptEn = bracketPromptVariables(promptFor(template.id, type.id, sku, data), facts, type.id);
    const prompt = promptTextForLanguage(promptEn, promptLanguageByCard[key] || "en");
    return prompt ? `## ${title}\n\n${prompt}` : "";
  }).filter(Boolean).join("\n\n---\n\n");
}

function clearExtractedSourceState({ render = true } = {}) {
  extractionGeneration += 1;
  sourcePayload = {
    purchase: "",
    amazonTemplate: "",
    supplier: "",
    competitor: "",
  };
  extractedProducts = [];
  fieldOverrides = {};
  fieldOverridesBySku = {};
  appliedSellingPointOverridesBySku = {};
  sellingPointResearchAttemptedBySku = new Set();
  promptLanguageByCard = {};
  sellingPointDraftDirty = false;
  promptStore = [];
  imageGenerationByCard = {};
  lastReferenceSelectionCardKey = "";
  bulkImageGenerationRunning = false;
  availableReferenceImageUrls = [];
  referenceImagesBySku = {};
  referenceImageMetaBySku = {};
  bundleStateBySku = {};
  supplierSourceFileNames = [];
  clearPersistedWorkspace();
  if (!render) return;
  renderProductSelect();
  renderFields(true);
  renderAll();
}

function showCopyFeedback(button, state, label) {
  if (!button) return;

  const originalText = button.dataset.defaultText || button.textContent;
  button.dataset.defaultText = originalText;
  button.classList.remove("copy-success", "copy-failed");
  button.classList.add(state === "success" ? "copy-success" : "copy-failed");
  button.textContent = label || (state === "success" ? "Copied" : "Failed");
  button.setAttribute("aria-live", "polite");

  const card = button.closest(".prompt-card");
  if (card && state === "success") {
    card.classList.add("just-copied");
  }

  window.setTimeout(() => {
    button.classList.remove("copy-success", "copy-failed");
    button.textContent = originalText;
    card?.classList.remove("just-copied");
  }, 2400);
}

async function copyText(text, message, button) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      throw new Error("Clipboard API unavailable");
    }
    byId("copyStatus").textContent = message;
    showCopyFeedback(button, "success");
  } catch {
    const fallbackOk = fallbackCopyText(text);
    if (fallbackOk) {
      byId("copyStatus").textContent = message;
      showCopyFeedback(button, "success");
    } else {
      selectPromptTextForManualCopy(button);
      byId("copyStatus").textContent = button?.closest(".prompt-card")
        ? "复制失败，已选中该图提示词，可按 Cmd+C 手动复制。"
        : "复制失败，请手动选中文本复制。";
      showCopyFeedback(button, "failed", "Selected");
    }
  }
}

function selectPromptTextForManualCopy(button) {
  const preview = button?.closest(".prompt-card")?.querySelector(".prompt-preview");
  if (!preview) return;
  const range = document.createRange();
  range.selectNodeContents(preview);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

function fallbackCopyText(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  textarea.remove();
  return ok;
}

const THEME_STORAGE_KEY = "prompt-tool-theme";

function applyTheme(theme, persist = false) {
  const nextTheme = theme === "light" ? "light" : "dark";
  document.documentElement.dataset.theme = nextTheme;
  const toggle = byId("themeToggle");
  if (toggle) {
    const isDark = nextTheme === "dark";
    toggle.setAttribute("aria-pressed", String(isDark));
    toggle.setAttribute("aria-label", isDark ? "切换到浅色主题" : "切换到深色主题");
    const icon = toggle.querySelector(".theme-toggle-icon");
    const label = toggle.querySelector(".theme-toggle-label");
    if (icon) icon.textContent = isDark ? "☾" : "☀";
    if (label) label.textContent = isDark ? "深色模式" : "浅色模式";
  }
  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // Theme switching remains available when storage is blocked.
    }
  }
}

function initThemeToggle() {
  const currentTheme = document.documentElement.dataset.theme === "light" ? "light" : "dark";
  applyTheme(currentTheme);
  byId("themeToggle")?.addEventListener("click", () => {
    applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark", true);
  });
}

function init() {
  window.renderAll = renderAll;
  window.promptForSku = promptFor;
  initThemeToggle();
  initWorkflowNavigation();
  fillSelects();
  const restoredWorkspace = restoreWorkspaceSnapshot();
  initProductStructureRoute();
  initExtractionRoutePreview();
  renderFields(true);
  renderAll();
  if (restoredWorkspace) {
    showWorkflowPage(restoredWorkspace.activeWorkflowPage || "studio");
    byId("extractStatus").textContent = `已恢复 ${extractedProducts.length} 个产品 / 款式及其生图记录。`;
  }
  startFieldWatcher();

  byId("skuSelect").addEventListener("change", () => {
    renderFields(true);
    renderAll();
    if (selectedExtractionRoute === "web") {
      autoEnrichSellingPointsIfNeeded();
      autoEnrichUseScenesIfNeeded();
    }
  });
  byId("templateSelect").addEventListener("change", renderAll);
  byId("extractSources").addEventListener("click", () => {
    extractSources().catch((error) => {
      extractedProducts = [];
      appliedSellingPointOverridesBySku = {};
      sellingPointDraftDirty = false;
      renderProductSelect();
      renderFields(true);
      renderAll();
      byId("extractStatus").textContent = `解析失败：${error.message || "请检查文件格式"}`;
    });
  });
  ["amazonTemplateFile", "amazonSkuFilter", "supplierFile", "supplierImageListFile", "supplierImageListText", "competitorFile"].forEach((id) => {
    const input = byId(id);
    const updateStatus = () => {
      clearExtractedSourceState({ render: false });
      byId("extractStatus").textContent = "文件或筛选条件已更新，点击解析资料并提取产品信息。";
    };
    input.addEventListener("change", updateStatus);
    if (input.type === "text" || input.tagName === "TEXTAREA") input.addEventListener("input", updateStatus);
  });
  const refreshSupplierBindingOptions = async () => {
    const file = byId("amazonTemplateFile")?.files?.[0];
    if (!file) {
      populateSupplierSkuBinding([]);
      return;
    }
    try {
      const result = await extractAmazonTemplateProducts(file, byId("amazonSkuFilter")?.value || "");
      populateSupplierSkuBinding(result.products);
    } catch {
      populateSupplierSkuBinding([]);
    }
  };
  byId("amazonTemplateFile")?.addEventListener("change", refreshSupplierBindingOptions);
  byId("amazonSkuFilter")?.addEventListener("change", refreshSupplierBindingOptions);
  byId("supplierSkuBinding")?.addEventListener("change", () => {
    referenceImagesBySku = {};
    referenceImageMetaBySku = {};
    imageGenerationByCard = {};
    productStructureRouteManuallySelected = false;
    syncProductStructureRouteFromBinding(true);
    renderAll();
    byId("extractStatus").textContent = "1688资料的 SKU 归属已更新，请重新解析资料。";
  });
  byId("resetFields").addEventListener("click", () => {
    const skuId = selectedSku()?.id || "";
    if (skuId) delete appliedSellingPointOverridesBySku[skuId];
    if (skuId) delete fieldOverridesBySku[skuId];
    fieldOverrides = {};
    sellingPointDraftDirty = false;
    renderFields(true);
    renderAll();
  });
  byId("copyCurrent").addEventListener("click", () => {
    const text = allPromptsForSku();
    if (!text) {
      byId("copyStatus").textContent = "请先解析资料并选择产品。";
      return;
    }
    copyText(text, "已复制当前产品全部图组。", byId("copyCurrent"));
  });
  byId("generateAllImagesAuto")?.addEventListener("click", () => generateAllImagesForCurrentOutput("auto"));
  byId("generateAllImagesManual")?.addEventListener("click", () => generateAllImagesForCurrentOutput("manual"));
  byId("saveGeneratedSet")?.addEventListener("click", saveGeneratedSet);
}

init();
