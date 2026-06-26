const sourceNotes = {
  purchase: "采购单主口径：确认已采购的产品款式；不把下单数量当作产品参数。",
  alibaba: "1688 主资料口径：只补产品标题、材质、结构、适配和卖点；不新增采购单外的款式。",
  amazon: "竞品参考口径：只用于图组逻辑与卖点筛选，不补写未确认参数。",
};

const productGroups = {
  v02: {
    name: "V02 V形滤纸",
    promptName: "V02 cone coffee filter",
    purchaseVariants: "V02 100片/盒、V02 200片/盒",
    productCountNote: "采购单计 2 个 SKU；基础产品计 1 款",
    alibabaPack: "V02，100片/盒，约 138g/盒，外盒约 130 x 200 x 17 mm，1-4人份",
    specs: ["V02", "1-4人份", "100片/盒 / 200片/盒", "自然棕色原色木浆纸", "侧边压纹与底部折边"],
    promptSpecs: ["V02", "1-4 cups", "100 pcs box / 200 pcs box", "natural unbleached wood pulp paper", "pressed side seam and bottom fold"],
    dimensions: ["Top Width: 16 cm", "Side Length: 12 cm / 11.6 cm", "Weight: 1.12 g/sheet"],
    evidenceNote: "只使用 1688 图中可见规格；100/200 仅作为包装数量。",
  },
  u02: {
    name: "扇形02 / U02 滤纸",
    promptName: "fan-shaped 02 / U02 coffee filter",
    purchaseVariants: "扇形02 100片/盒、扇形U02 200片/盒",
    productCountNote: "采购单计 2 个 SKU；基础产品计 1 款",
    alibabaPack: "#02 / U102，100片/盒，约 142g/盒，外盒约 170 x 200 x 17 mm，2-6人份",
    specs: ["#02 / U102", "2-6人份", "100片/盒 / 200片/盒", "自然棕色原色木浆纸", "侧边压纹与底部折边"],
    promptSpecs: ["#02 / U102", "2-6 cups", "100 pcs box / 200 pcs box", "natural unbleached wood pulp paper", "pressed side seam and bottom fold"],
    dimensions: ["Top Width: 16.5 cm", "Side Length: 9 cm / 9.5 cm", "Bottom Width: 5 cm", "Weight: 1.15 g/sheet"],
    evidenceNote: "采购单中的“扇形02”和“扇形U02”按同一基础规格处理，包装数量分开。",
  },
  u04: {
    name: "扇形04 滤纸",
    promptName: "fan-shaped 04 coffee filter",
    purchaseVariants: "扇形04 100片/盒、扇形04 200片/盒",
    productCountNote: "采购单计 2 个 SKU；基础产品计 1 款",
    alibabaPack: "#04，100片/盒，约 185g/盒，外盒约 230 x 200 x 17 mm，8-12 cups",
    specs: ["#04", "8-12 cups", "100片/盒 / 200片/盒", "自然棕色原色木浆纸", "侧边压纹与底部折边"],
    promptSpecs: ["#04", "8-12 cups", "100 pcs box / 200 pcs box", "natural unbleached wood pulp paper", "pressed side seam and bottom fold"],
    dimensions: [],
    evidenceNote: "资料未明确单片尺寸，不借鉴、不补写；只展示已提取到的规格与包装信息。",
  },
};

const verifiedDimensions = {
  v02: {
    topWidth: "16 cm",
    sideLength: "12 cm / 11.6 cm",
    bottomWidth: "",
    weight: "1.12 g/sheet",
    cupRange: "1-4 cup pour-over brewing",
    source: "1688 详情图可见单片规格",
  },
  u02: {
    topWidth: "16.5 cm",
    sideLength: "9 cm / 9.5 cm",
    bottomWidth: "5 cm",
    weight: "1.15 g/sheet",
    cupRange: "2-6 cup drip or pour-over brewing",
    source: "1688 详情图可见单片规格",
  },
  u04: {
    topWidth: "",
    sideLength: "",
    bottomWidth: "",
    weight: "",
    cupRange: "8-12 cup drip coffee maker",
    source: "资料未明确单片尺寸",
  },
};

const skus = [
  {
    id: "KFLZ-SV02-200",
    label: "KFLZ-SV02-200 | V02 盒装 200 片",
    sourceName: "亚马逊定制V形02盒装200片",
    shape: "V-shaped cone coffee filter, size 02",
    pack: "200 pcs box",
    sizeCode: "V02",
    groupKey: "v02",
    dims: verifiedDimensions.v02,
    fit: "V60-02 style cone dripper and 1-4 cup pour-over brewer",
  },
  {
    id: "KFLZ-SU02-200",
    label: "KFLZ-SU02-200 | 扇形 U02 盒装 200 片",
    sourceName: "亚马逊定制扇形U02盒装200片",
    shape: "fan-shaped trapezoid coffee filter, size 02",
    pack: "200 pcs box",
    sizeCode: "U02 / 02",
    groupKey: "u02",
    dims: verifiedDimensions.u02,
    fit: "#2 fan-shaped dripper, trapezoid filter cup, small drip coffee maker",
  },
  {
    id: "KFLZ-SV02-100",
    label: "KFLZ-SV02-100 | V02 盒装 100 片",
    sourceName: "亚马逊定制V02盒装100片",
    shape: "V-shaped cone coffee filter, size 02",
    pack: "100 pcs box",
    sizeCode: "V02",
    groupKey: "v02",
    dims: verifiedDimensions.v02,
    fit: "V60-02 style cone dripper and 1-4 cup pour-over brewer",
  },
  {
    id: "KFLZ-SU04-100",
    label: "KFLZ-SU04-100 | 扇形 04 盒装 100 片",
    sourceName: "亚马逊定制扇形04盒装100片",
    shape: "fan-shaped trapezoid coffee filter, size 04",
    pack: "100 pcs box",
    sizeCode: "#4 / 04",
    groupKey: "u04",
    dims: verifiedDimensions.u04,
    fit: "#4 cone or fan-shaped drip coffee maker, 8-12 cup brewer",
  },
  {
    id: "KFLZ-SU04-200",
    label: "KFLZ-SU04-200 | 扇形 04 盒装 200 片",
    sourceName: "亚马逊定制扇形04盒装200片",
    shape: "fan-shaped trapezoid coffee filter, size 04",
    pack: "200 pcs box",
    sizeCode: "#4 / 04",
    groupKey: "u04",
    dims: verifiedDimensions.u04,
    fit: "#4 cone or fan-shaped drip coffee maker, 8-12 cup brewer",
  },
  {
    id: "KFLZ-SU02-100",
    label: "KFLZ-SU02-100 | 扇形 02 盒装 100 片",
    sourceName: "亚马逊定制扇形02盒装100片",
    shape: "fan-shaped trapezoid coffee filter, size 02",
    pack: "100 pcs box",
    sizeCode: "#2 / 02",
    groupKey: "u02",
    dims: verifiedDimensions.u02,
    fit: "#2 fan-shaped dripper, trapezoid filter cup, small drip coffee maker",
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
    id: "scene",
    name: "场景展示模板",
    description: "围绕主场景、多场景、多角度展示、产品说明、两个卖点和收口生成 7 张图。",
    imageTypes: [
      { id: "1", name: "1. 主图 / 主场景图", promptName: "1. Main Scene Image" },
      { id: "2", name: "2. 多场景 / 多用途图", promptName: "2. Multi-Scene Usage Image" },
      { id: "3", name: "3. 多角度图", promptName: "3. Multi-Angle Product Image" },
      { id: "4", name: "4. 产品说明图", promptName: "4. Product Explanation Image" },
      { id: "5", name: "5. 卖点图 5", promptName: "5. Selling Point Image 5" },
      { id: "6", name: "6. 卖点图 6", promptName: "6. Selling Point Image 6" },
      { id: "7", name: "7. 卖点总览图", promptName: "7. Feature Summary Image" },
    ],
  },
];

const fields = [
  ["productName", "Product Name", "[PRODUCT_NAME]"],
  ["pack", "Product Count / Set", ""],
  ["cupRange", "Size / Range", ""],
  ["material", "Material", ""],
  ["color", "Color", ""],
  ["structure", "Structure / Craft", ""],
  ["surfaceFinish", "Technology / Finish", ""],
  ["detailParameter", "Detail Features", ""],
  ["topWidth", "Dimension 1", ""],
  ["sideLength", "Dimension 2", ""],
  ["bottomWidth", "Dimension 3", ""],
  ["weight", "Weight / Quantity", ""],
  ["fit", "Compatible Object / Use", ""],
  ["scene", "Use Scene", ""],
  ["feature1", "Selling Point 1", ""],
  ["feature2", "Selling Point 2", ""],
  ["feature3", "Selling Point 3", ""],
];

let promptStore = [];
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
  supplier: "",
  competitor: "",
};
let fieldOverrides = {};
let fieldOverridesBySku = {};
let fieldSnapshot = "";
const OCR_IMAGE_LIMIT = 32;
const OCR_FALLBACK_IMAGE_LIMIT = 6;
const OCR_SCRIPT_URL = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";

function byId(id) {
  return document.getElementById(id);
}

function selectedSku() {
  const allProducts = currentProducts();
  return allProducts.find((sku) => sku.id === byId("skuSelect").value) || allProducts[0];
}

function currentProducts() {
  if (extractedProducts.length) return extractedProducts;
  return [emptyExtractedProduct];
}

function hasExtractedProducts() {
  return extractedProducts.length > 0;
}

function selectedTemplate() {
  const selected = templates.find((item) => item.id === byId("templateSelect").value) || templates[0];
  return selected.disabled ? templates[0] : selected;
}

function defaultProductName(sku) {
  return promptValue(sku.productName, "")
    || promptValue(sku.shape, "")
    || promptValue(sku.sourceName, "")
    || "[PRODUCT_NAME]";
}

function valueMap(sku) {
  const isExtractedSku = String(sku.id || "").startsWith("EXTRACTED-");
  const group = productGroups[sku.groupKey] || sku.group || (isExtractedSku ? {} : productGroups.v02);
  const materialFallback = isExtractedSku ? "" : "[MATERIAL: natural wood pulp paper / unbleached brown paper]";
  const colorFallback = isExtractedSku ? "" : "[COLOR: natural brown]";
  const structureFallback = isExtractedSku ? "" : "[STRUCTURE: pressed side seam and bottom fold]";
  const feature1Fallback = isExtractedSku ? "" : "[SELLING_POINT_1: natural unbleached wood pulp paper]";
  const feature2Fallback = isExtractedSku ? "" : "[SELLING_POINT_2: reinforced smooth filtration]";
  const variantFallback = isExtractedSku ? "" : "[VARIANT_LIST: V02 100/200 pcs, fan-shaped 02 or U02 100/200 pcs, fan-shaped 04 100/200 pcs]";
  return {
    productName: cleanFieldDisplayValue(defaultProductName(sku)),
    pack: cleanFieldDisplayValue(sku.pack || ""),
    material: cleanFieldDisplayValue(sku.material || materialFallback),
    color: cleanFieldDisplayValue(sku.color || colorFallback),
    structure: cleanFieldDisplayValue(sku.structure || structureFallback),
    cupRange: cleanFieldDisplayValue(sku.dims?.cupRange || ""),
    topWidth: sku.dims?.topWidth || "",
    sideLength: sku.dims?.sideLength || "",
    bottomWidth: sku.dims?.bottomWidth || "",
    weight: sku.dims?.weight || "",
    fit: cleanFieldDisplayValue(sku.fit || "[COMPATIBLE_USE]"),
    scene: cleanFieldDisplayValue(sku.scene || "[USE_SCENE]"),
    feature1: cleanFieldDisplayValue(sku.feature1 || feature1Fallback),
    feature2: cleanFieldDisplayValue(sku.feature2 || feature2Fallback),
    surfaceFinish: cleanFieldDisplayValue(sku.surfaceFinish || ""),
    detailParameter: cleanFieldDisplayValue(sku.detailParameter || ""),
    packagingCount: ensureParameterToken("PRODUCT_COUNT_OR_SET", sku.pack || ""),
    singleSpec: sku.singleSpec || `[CURRENT_PRODUCT_OPTION: ${group.promptName || "[PRODUCT_SPEC]"}, ${sku.pack || "[PRODUCT_COUNT_OR_SET]"}]`,
    specList: sku.specList || `[SPEC_LIST: ${(group.promptSpecs || ["[SPECIFICATION_LIST]"]).join(" / ")}]`,
    variantList: sku.variantList || variantFallback,
    dimensionList: sku.dimensionList || ((group.dimensions || []).length ? `[VERIFIED_DIMENSIONS: ${group.dimensions.join("; ")}]` : ""),
  };
}

function fillSelects() {
  renderProductSelect();
  byId("templateSelect").innerHTML = templates
    .filter((template) => !template.disabled)
    .map((template) => `<option value="${template.id}">${template.name}</option>`)
    .join("");
}

function renderProductSelect(selectedId = byId("skuSelect")?.value) {
  const products = currentProducts();
  byId("skuSelect").innerHTML = products.map((sku) => `<option value="${sku.id}">${escapeHtml(skuDisplayLabel(sku))}</option>`).join("");
  if (selectedId && products.some((sku) => sku.id === selectedId)) {
    byId("skuSelect").value = selectedId;
  }
}

function renderFields(reset = false) {
  const sku = selectedSku();
  const values = valueMap(sku);
  const fieldList = byId("fieldList");
  if (reset) {
    fieldOverrides = { ...(fieldOverridesBySku[sku?.id] || {}) };
  }
  if (!hasExtractedProducts()) {
    fieldList.innerHTML = `<p class="empty-state">解析资料后显示可替换参数。</p>`;
    return;
  }
  fieldList.innerHTML = fields.map(([key, label, fallback]) => {
    const value = reset ? (values[key] || fallback) : (byId(`field-${key}`)?.value ?? fieldOverrides[key] ?? values[key] ?? fallback);
    const displayValue = cleanFieldDisplayValue(value);
    return `
      <div>
        <label for="field-${key}">${label}</label>
        <input id="field-${key}" data-key="${key}" value="${escapeHtml(displayValue)}">
      </div>
    `;
  }).join("");
  fieldList.querySelectorAll("input").forEach((input) => {
    ["input", "change"].forEach((eventName) => input.addEventListener(eventName, handleFieldInput));
  });
}

function cleanTokenValue(value) {
  return String(value || "")
    .replace(/^\[[A-Z0-9_ ]+:?\s*/i, "")
    .replace(/\]$/g, "")
    .trim();
}

function cleanFieldDisplayValue(value) {
  const raw = String(value || "").trim();
  if (/^\[[A-Z0-9_ ]+\]$/i.test(raw)) return "";
  const clean = cleanTokenValue(raw);
  return isCodeLikeValue(clean) || isInvalidParameterValue(clean) ? "" : clean;
}

function isCodeLikeValue(value) {
  return /<\s*\/?\s*(?:script|style|html|body)|\b(?:body|html)\s*\{|display\s*:|window\.|traceId|polyfill|RegeneratorRuntime|<\/script|src\s*=|PRODUCT_ATTRIBUTE|SKU_OPTION|PRODUCT_TITLE|Source HTML file|Purchase order image OCR|model\s*=|colorEnglish\s*=|[{}]{2,}/i.test(String(value || ""));
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
  currentProducts().forEach((sku) => {
    const isSelected = sku.id === selectedId;
    const values = sku.id === selectedId ? { ...valueMap(sku), ...currentFields() } : valueMap(sku);
    const groupKey = sku.groupKey || sku.sizeCode || sku.shape || sku.id;
    const existing = groups.get(groupKey) || {
      title: sku.sizeCode || sku.shape || "Product Specification",
      shape: sku.shape || cleanTokenValue(values.singleSpec),
      cupRange: "",
      fit: cleanTokenValue(values.fit),
      material: cleanTokenValue(values.material),
      structure: cleanTokenValue(values.structure),
      surfaceFinish: cleanTokenValue(values.surfaceFinish),
      detailParameter: cleanTokenValue(values.detailParameter),
      topWidth: sku.dims?.topWidth || values.topWidth || "",
      sideLength: sku.dims?.sideLength || values.sideLength || "",
      bottomWidth: sku.dims?.bottomWidth || values.bottomWidth || "",
      weight: sku.dims?.weight || values.weight || "",
    };

    if (isSelected || !existing.cupRange) {
      existing.cupRange = validRangeValue(sku.dims?.cupRange || values.cupRange || extractFirstMatch((values.specList || sku.fit || ""), [/([0-9]+\s*-\s*[0-9]+\s*(?:cups|cup|人份))/i]));
    }
    if (isSelected || !existing.fit) existing.fit = cleanTokenValue(values.fit);
    if (isSelected || !existing.material) existing.material = cleanTokenValue(values.material);
    if (isSelected || !existing.structure) existing.structure = cleanTokenValue(values.structure);
    if (isSelected || !existing.surfaceFinish) existing.surfaceFinish = cleanTokenValue(values.surfaceFinish);
    if (isSelected || !existing.detailParameter) existing.detailParameter = cleanTokenValue(values.detailParameter);
    if (isSelected || !existing.topWidth) existing.topWidth = values.topWidth || sku.dims?.topWidth || "";
    if (isSelected || !existing.sideLength) existing.sideLength = values.sideLength || sku.dims?.sideLength || "";
    if (isSelected || !existing.bottomWidth) existing.bottomWidth = values.bottomWidth || sku.dims?.bottomWidth || "";
    if (isSelected || !existing.weight) existing.weight = values.weight || sku.dims?.weight || "";
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
    list.innerHTML = `<p class="empty-state">解析采购单和 1688 资料后显示产品主参数。</p>`;
    return;
  }
  list.innerHTML = rows.map((row) => {
    const params = [
      ["Product / Option", row.title],
      ["Size / Range", row.cupRange],
      ["Compatible Use / Scene", row.fit],
      ["Material", row.material],
      ["Structure / Craft", row.structure],
      ["Technology", row.surfaceFinish],
      ["Detail Features", row.detailParameter],
      ["Length / Size 1", row.topWidth],
      ["Width / Size 2", row.sideLength],
      ["Height / Size 3", row.bottomWidth],
      ["Weight / Quantity", row.weight],
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
  const escapePattern = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const values = promptVariableValues(facts)
    .filter(Boolean)
    .map((value) => String(value).trim())
    .filter((value) => value.length >= 3)
    .sort((a, b) => b.length - a.length);

  const seen = new Set();
  const patterns = values.map((rawValue) => {
    const escapedValue = escapeHtml(rawValue);
    const escapedBracketValue = escapeHtml(bracketValue(rawValue));
    const key = escapedValue.toLowerCase();
    if (seen.has(key)) return "";
    seen.add(key);
    return `${escapePattern(escapedBracketValue)}|${escapePattern(escapedValue)}`;
  }).filter(Boolean);

  if (!patterns.length) return escapedText;

  return escapedText.replace(new RegExp(patterns.join("|"), "g"), (match) => `<span class="variable-token">◆ ${match}</span>`);
}

function promptVariableValues(facts) {
  return [
    facts.productName,
    facts.cupType,
    facts.selectedSpec,
    facts.pack,
    facts.cupRange,
    facts.material,
    facts.color,
    facts.fit,
    facts.scene,
    facts.feature1,
    facts.feature2,
    facts.feature3,
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
  ];
}

function bracketValue(value) {
  const clean = String(value || "").trim();
  return clean ? `[${clean}]` : "";
}

function bracketPromptVariables(text, facts, typeId = "") {
  const values = promptVariableValues(facts)
    .filter(Boolean)
    .map((value) => String(value).trim())
    .filter((value) => value.length >= 3)
    .sort((a, b) => b.length - a.length);
  const seen = new Set();
  let bracketed = text;
  values.forEach((value) => {
    const key = value.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    bracketed = bracketed.replace(new RegExp(`(^|[^\\[])${escaped}(?!\\])`, "g"), (_, prefix) => `${prefix}${bracketValue(value)}`);
  });
  return bracketed;
}

function readFieldValue(key) {
  const input = byId(`field-${key}`);
  const skuId = selectedSku()?.id || "";
  const scopedOverrides = fieldOverridesBySku[skuId] || fieldOverrides;
  return cleanFieldDisplayValue(input ? input.value : scopedOverrides[key] ?? "");
}

function captureFieldOverrides() {
  const skuId = selectedSku()?.id || "";
  const nextOverrides = { ...(fieldOverridesBySku[skuId] || {}) };
  fields.forEach(([key]) => {
    const input = byId(`field-${key}`);
    if (input) nextOverrides[key] = cleanFieldDisplayValue(input.value);
  });
  if (skuId) fieldOverridesBySku[skuId] = nextOverrides;
  fieldOverrides = nextOverrides;
}

function currentFields() {
  captureFieldOverrides();
  const data = {};
  fields.forEach(([key]) => {
    data[key] = fieldOverrides[key] ?? readFieldValue(key);
  });
  return data;
}

function currentFieldSignature() {
  return fields.map(([key]) => `${key}:${readFieldValue(key)}`).join("|");
}

function handleFieldInput(event) {
  const key = event.currentTarget?.dataset?.key;
  if (key) {
    fieldOverrides[key] = event.currentTarget.value;
    const skuId = selectedSku()?.id || "";
    if (skuId) {
      fieldOverridesBySku[skuId] = {
        ...(fieldOverridesBySku[skuId] || {}),
        [key]: event.currentTarget.value,
      };
    }
  }
  captureFieldOverrides();
  fieldSnapshot = currentFieldSignature();
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
  if (!hasExtractedProducts()) {
    return [
      ["采购单", sourcePayload.purchase ? compactSourceStatus(sourcePayload.purchase) : "待输入", sourceNotes.purchase],
      ["供应商", sourcePayload.supplier ? compactSourceStatus(sourcePayload.supplier) : "待输入", sourceNotes.alibaba],
      ["竞品参考", sourcePayload.competitor ? compactSourceStatus(sourcePayload.competitor) : "未输入", sourceNotes.amazon],
      ["当前输出", `待解析，${template.imageTypes.length} 张图模板`, "解析资料后生成当前产品图组。"],
    ];
  }
  return [
    ["采购单", sourcePayload.purchase ? compactSourceStatus(sourcePayload.purchase) : "待输入", sourceNotes.purchase],
    ["供应商", sourcePayload.supplier ? compactSourceStatus(sourcePayload.supplier) : "待输入", sourceNotes.alibaba],
    ["竞品参考", sourcePayload.competitor ? compactSourceStatus(sourcePayload.competitor) : "未输入", sourceNotes.amazon],
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

function buildDimensionListFromFields(data) {
  const dimensions = [
    data.topWidth && `Top Width: ${cleanTokenValue(data.topWidth)}`,
    data.sideLength && `Side Length: ${cleanTokenValue(data.sideLength)}`,
    data.bottomWidth && `Bottom Width: ${cleanTokenValue(data.bottomWidth)}`,
    data.weight && `Weight: ${cleanTokenValue(data.weight)}`,
  ].filter(Boolean);
  return dimensions.length ? `[VERIFIED_DIMENSIONS: ${dimensions.join("; ")}]` : "";
}

function currentPromptData(sku) {
  const base = valueMap(sku);
  const fieldsData = currentFields();
  const data = {
    ...base,
    ...fieldsData,
    surfaceFinish: fieldsData.surfaceFinish ?? base.surfaceFinish,
    detailParameter: fieldsData.detailParameter ?? base.detailParameter,
    feature3: fieldsData.feature3 ?? base.feature3 ?? sku.feature3 ?? "",
  };
  const group = productGroups[sku.groupKey] || sku.group || {};
  const productName = promptValue(data.productName, defaultProductName(sku));
  const liveColor = promptValue(data.color, "");
  const skuColor = promptValue(sku.color || sku.colorEnglish || sku.displayColor, "");
  const baseSpec = promptValue(cleanTokenValue(base.singleSpec), "");
  const productSpec = liveColor && skuColor
    ? liveColor
    : baseSpec
    || promptValue(sku.shape, "")
    || group.promptName
    || productName
    || "[PRODUCT_SPEC]";
  const pack = fieldsData.pack || "";
  const cupRange = fieldsData.cupRange || sku.dims?.cupRange || extractFirstMatch(base.specList || "", [/([0-9]+\s*-\s*[0-9]+\s*(?:cups|cup|人份))/i]);
  data.productName = productName;
  data.packagingCount = ensureParameterToken("PRODUCT_COUNT_OR_SET", pack);
  data.singleSpec = `[CURRENT_PRODUCT_OPTION: ${[productSpec, pack].filter(Boolean).join(", ")}]`;
  data.dimensionList = buildDimensionListFromFields(data);
  data.specList = `[SPEC_LIST: ${[productSpec, cupRange, pack, data.material, data.fit, data.dimensionList].filter(Boolean).join(" / ")}]`;
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
  const keywordMatches = source.match(/产品参数|产品信息|产品详情|详细资料|品名|克重|尺码|尺寸|面料|材质|材料|工艺|特殊工艺|厚薄|弹力|针数|柔软|规格|型号|重量|容量|PRODUCT\s*NAME|GRAM\s*WEIGHT|SIZE|MATERIAL|TECHNOLOGY|DETAIL|PARAMETER/gi);
  const largeDetailMatches = source.match(/详情|描述|detail|desc|offer-detail|product-description|商品介绍|产品介绍/gi);
  return (keywordMatches ? keywordMatches.length * 8 : 0) + (largeDetailMatches ? largeDetailMatches.length * 5 : 0);
}

function productDetailLabelScore(text) {
  const source = String(text || "");
  const labels = source.match(/品\s*名|PRODUCT\s*NAME|克\s*重|GRAM\s*WEIGHT|尺\s*码|SIZE|面\s*料|MATERIAL|工\s*艺|TECHNOLOGY|特\s*殊\s*工\s*艺|厚\s*薄|弹\s*力|针\s*数|柔\s*软|产品参数|产品信息|详细资料|规格参数/gi);
  return labels ? labels.length : 0;
}

function isFactoryOrServiceImageText(text) {
  return /源头厂家|品质保障|为什么选择|工厂面积|厂房面积|生产设备|日发量|日产量|发货员|包装工|仓库面积|仓储能力|行业经验|实力认证|分销代理|代理加盟|网络代销|资质齐全|发货支持|产品支持|运营支持|客服支持|售前咨询|售后指导|来图来样|定制logo|提供精美图片包|48H|48小时|常备库存|快速打样|设计团队|质量保证|厂房|工厂|仓库|物流|发货|退货|开票|服务规则|买家保障|跨境服务|factory|warehouse|production\s+capacity|daily\s+output|shipping|return\s+policy|customer\s+service|distribution\s+agent/i.test(String(text || ""));
}

function isCommerceOrRecommendationText(text) {
  return /店铺推荐|爆款推荐|热卖|严选|¥|￥|价格|起批|拿货|下单|包邮|现货|只做精品|包装可定制|支持混批|一件代发|跨境货源|货源|厂家直销|批发|供应商|seller|price|wholesale|dropshipping/i.test(String(text || ""));
}

function productFeatureTextScore(text) {
  const matches = String(text || "").match(/防滑|硅胶|点胶|抓地|弹力|高弹|柔软|透气|棉|聚酯|氨纶|尺码|克重|重量|尺寸|材质|面料|工艺|厚薄|针数|袜|鞋|服装|衣服|裤|裙|箱包|背包|手提包|杯|滤纸|cotton|spandex|polyester|silicone|grip|anti.?slip|non.?slip|size|material|weight|texture/gi);
  return matches ? matches.length : 0;
}

function isProductInfoImageText(text) {
  return imageInfoKeywordScore(text) > 0 || productFeatureTextScore(text) > 0;
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
    onProgress?.(`正在读取 1688 详情描述片段... ${index + 1}/${detailUrls.length}`);
    try {
      const response = await withTimeout(fetch(url, { credentials: "omit" }), 15000, "Detail fetch timed out");
      if (!response.ok) continue;
      fragments.push(await response.text());
    } catch {
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
  const sourceScore = candidate.source === "detail" ? 100 : candidate.source === "html" ? 10 : 0;
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
    ...detailCandidates,
    ...keywordCandidates,
    ...fallbackCandidates,
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
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${OCR_SCRIPT_URL}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(window.Tesseract));
      existing.addEventListener("error", () => reject(new Error("OCR engine failed to load")));
      return;
    }

    const script = document.createElement("script");
    script.src = OCR_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(window.Tesseract);
    script.onerror = () => reject(new Error("OCR engine failed to load"));
    document.head.appendChild(script);
  });
}

function cleanOcrText(text) {
  return String(text || "")
    .replace(/[|_~]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isUsefulOcrText(text) {
  const clean = cleanOcrText(text);
  if (clean.length < 8) return false;
  if (isFactoryOrServiceImageText(clean) && productDetailLabelScore(clean) < 2) return false;
  if (isCommerceOrRecommendationText(clean) && productDetailLabelScore(clean) < 2) return false;
  if (Object.keys(extractProductDetailAttributes(clean)).length) return true;
  if (imageInfoKeywordScore(clean) > 0) return true;
  if (!isProductInfoImageText(clean)) return false;
  const meaningfulChars = (clean.match(/[A-Za-z0-9\u4e00-\u9fff]/g) || []).length;
  return meaningfulChars >= 12 && meaningfulChars / clean.length >= 0.35;
}

function hasEnoughProductDetail(text) {
  const attrs = extractProductDetailAttributes(text);
  return productDetailLabelScore(text) >= 3 || Boolean(attrs.Material && (attrs.Size || attrs.Weight || attrs.Technology || attrs.SpecialCraft));
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
    const weight = clean.match(/([0-9]+(?:\.[0-9]+)?)\s*(?:g|克)/i)?.[1];
    return weight ? `${weight} g` : "";
  }
  if (key === "Size") {
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
    if (/氨纶/.test(clean)) return "spandex";
    if (/聚酯|涤纶/.test(clean)) return "polyester";
  }
  if (/^Size$/i.test(key)) return translateProductDetailValue("Size", clean);
  if (/^Weight$/i.test(key)) return translateProductDetailValue("Weight", clean);
  if (/^Technology$/i.test(key)) return translateProductDetailValue("Technology", clean);
  if (/^SpecialCraft$/i.test(key)) return translateProductDetailValue("SpecialCraft", clean);
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
    "本白", "本色", "本全", "草绿", "水蓝", "淡蓝", "浅紫", "浅粉", "粉红", "肉粉", "银灰", "深灰", "豆绿", "浅卡", "卡其",
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

function addSupplierSkuOption(options, seen, option) {
  if (!option.model) return;
  const key = `${option.model}-${option.color || ""}-${option.size || ""}`;
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
    const weight = extractFirstMatch(source, [/(?:克\s*重|GRAM\s*WEIGHT)?\s*([0-9]+(?:\.[0-9]+)?)\s*[gG克]/i]);
    if (weight) attrs.Weight = `${weight} g`;
  }
  if (!attrs.Size) {
    const size = extractFirstMatch(source, [/(?:WOMAN|WOMEN|女士|女)\s*[\(（]?\s*([0-9]+\s*[-~]\s*[0-9]+)\s*[\)）]?/i]);
    if (size) attrs.Size = `women's ${size.replace(/\s+/g, "")}`;
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
  const descriptiveName = descriptiveYogaSockProductName(value, context);
  if (descriptiveName) return descriptiveName;
  let text = normalizeSourceProductTitle(value);
  if (!text) return "";
  const phraseMap = [
    [/滴漏式手冲咖啡挂耳|手冲咖啡滤纸|咖啡滤纸|滤纸/gi, " coffee filter "],
    [/接粉环|磁吸接粉环/gi, " dosing funnel "],
    [/粉碗/gi, " filter basket "],
    [/生日口水巾|宠物围兜|口水巾|围兜/gi, " pet bandana "],
    [/铃铛项圈|猫咪项圈|宠物猫脖圈|项圈/gi, " cat collar "],
    [/木天蓼猫玩具|木天蓼|猫玩具/gi, " cat toy "],
    [/拉力带|拉力绳|弹力带/gi, " resistance band "],
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

  const structuredPattern = /SKU_OPTION:\s*([\s\S]*?)(?=\s+SKU_OPTION\s*:|\s+PRODUCT_(?:TITLE|ATTRIBUTE)\s*:|\n|$)/gi;
  for (const match of decoded.matchAll(structuredPattern)) {
    const optionText = match[1].replace(/\s+(?=(?:model|color|colorEnglish|size|length|width|height|weight)=)/gi, "; ");
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
    const parsed = splitModelColor(skuRaw);
    addSupplierSkuOption(options, seen, {
      ...parsed,
      size: sizeRaw || "",
    });
  }

  const packInfoPattern = /\{[^{}]*"sku2"\s*:\s*"([^"]*)"[^{}]*"sku1"\s*:\s*"([^"]*)"[^{}]*"length"\s*:\s*([0-9.]+)[^{}]*"width"\s*:\s*([0-9.]+)[^{}]*"weight"\s*:\s*([0-9.]+)[^{}]*"height"\s*:\s*([0-9.]+)/gi;
  for (const match of decoded.matchAll(packInfoPattern)) {
    const parsed = splitModelColor(match[2]);
    const length = Number(match[3]);
    const width = Number(match[4]);
    const weight = Number(match[5]);
    const height = Number(match[6]);
    addSupplierSkuOption(options, seen, {
      ...parsed,
      size: match[1] || "",
      dims: {
        topWidth: length ? `${length} cm` : "",
        sideLength: width ? `${width} cm` : "",
        bottomWidth: height ? `${height} cm` : "",
        weight: weight ? `${weight} g` : "",
        source: "1688 SKU package information",
      },
    });
  }

  return options;
}

function extractSupplierStructuredText(html) {
  if (!html) return "";
  const decoded = decodeHtmlEntities(html);
  const titleLines = extractSupplierTitles(decoded).map((title) => `PRODUCT_TITLE: ${simplifySupplierTitle(title, decoded)}`);
  const skuLines = extractSupplierSkuOptions(decoded).map((option) => [
    "SKU_OPTION:",
    `model=${option.model}`,
    option.color && `color=${option.color}`,
    option.colorEnglish && `colorEnglish=${option.colorEnglish}`,
    option.size && `size=${option.size}`,
    option.dims?.topWidth && `length=${option.dims.topWidth}`,
    option.dims?.sideLength && `width=${option.dims.sideLength}`,
    option.dims?.bottomWidth && `height=${option.dims.bottomWidth}`,
    option.dims?.weight && `weight=${option.dims.weight}`,
  ].filter(Boolean).join("; "));

  const attrPairs = [
    ["功能", "Function"],
    ["主面料成分", "Material"],
    ["适用性别", "Gender"],
    ["包装形式", "Packaging"],
    ["风格", "Style"],
    ["筒高", "Sock Height"],
    ["图案", "Pattern"],
    ["织造方法", "Weaving"],
    ["无骨缝制", "Seam"],
  ];
  const attrLines = attrPairs.map(([sourceLabel, targetLabel]) => {
    const value = extractFirstMatch(decoded, [new RegExp(`"${sourceLabel}"\\s*:\\s*"([^"]+)"`, "i")]);
    return value ? `PRODUCT_ATTRIBUTE: ${targetLabel}=${value}` : "";
  }).filter(Boolean);
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
  try {
    const image = await loadImageForCanvas(url);
    const width = image.naturalWidth || image.width || 0;
    const height = image.naturalHeight || image.height || 0;
    if (!imageHasEnoughReadableSize({ width, height })) return { input: url, size: { ok: false, width, height } };
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return { input: url, size: { ok: true, width, height } };
    context.drawImage(image, 0, 0, width, height);
    return {
      input: canvas.toDataURL("image/png"),
      size: { ok: true, width, height },
    };
  } catch {
    const size = await loadImageMeta(url);
    return { input: url, size };
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

async function ocrImageUrls(imageUrls, onProgress) {
  if (!imageUrls.length) {
    return { text: "", scannedCount: 0, failedCount: 0, acceptedCount: 0, available: false };
  }

  let Tesseract;
  try {
    Tesseract = await loadOcrEngine();
  } catch {
    return { text: "", scannedCount: 0, failedCount: imageUrls.length, acceptedCount: 0, available: false };
  }

  const texts = [];
  let failedCount = 0;
  let attemptedCount = 0;
  for (let index = 0; index < imageUrls.length; index += 1) {
    const candidate = typeof imageUrls[index] === "string" ? { url: imageUrls[index], source: "html" } : imageUrls[index];
    const url = imageCandidateUrl(candidate);
    if (!url) continue;
    attemptedCount += 1;
    const sourceLabel = candidate.source === "detail" ? "详情描述图" : "页面图片";
    onProgress?.(`正在识别 1688 ${sourceLabel}文字... ${index + 1}/${imageUrls.length}`);
    try {
      const ocrInput = await withTimeout(imageUrlToOcrInput(url), 15000, "Image load timed out");
      const imageMeta = ocrInput.size;
      if (!imageMeta.ok || !imageHasEnoughReadableSize(imageMeta)) {
        failedCount += 1;
        continue;
      }
      const result = await withTimeout(
        Tesseract.recognize(ocrInput.input, "chi_sim+eng"),
        45000,
        "OCR timed out",
      );
      const text = cleanOcrText(result?.data?.text || "");
      if (isUsefulOcrText(text)) {
        texts.push(text);
        if (candidate.source !== "detail" && hasEnoughProductDetail(texts.join("\n"))) break;
      }
    } catch {
      failedCount += 1;
    }
  }

  return {
    text: texts.join("\n"),
    scannedCount: attemptedCount - failedCount,
    failedCount,
    acceptedCount: texts.length,
    available: true,
  };
}

async function ocrLocalImageFile(file, onProgress) {
  if (!file) {
    return { text: "", scannedCount: 0, failedCount: 0, available: false };
  }

  let Tesseract;
  try {
    Tesseract = await loadOcrEngine();
  } catch {
    return { text: "", scannedCount: 0, failedCount: 1, available: false };
  }

  onProgress?.(`正在识别采购单图片文字：${file.name}...`);
  try {
    const result = await withTimeout(
      Tesseract.recognize(file, "chi_sim+eng"),
      45000,
      "Purchase image OCR timed out",
    );
    const text = cleanOcrText(result?.data?.text || "");
    const structuredRows = structuredPurchaseRowsFromOcrResult(result, text);
    return {
      text: [text, structuredRows].filter(Boolean).join("\n"),
      scannedCount: text ? 1 : 0,
      failedCount: text ? 0 : 1,
      available: true,
    };
  } catch {
    return { text: "", scannedCount: 0, failedCount: 1, available: true };
  }
}

async function extractSupplierSourceText(html, onProgress) {
  if (!html) {
    return { text: "", imageCount: 0, candidateCount: 0, scannedCount: 0, failedCount: 0, ocrAvailable: false };
  }

  const baseText = cleanHtmlText(html);
  const structuredText = extractSupplierStructuredText(html);
  const detailUrls = extractDetailUrlsFromHtml(html);
  const detailHtml = detailUrls.length ? await fetchDetailHtml(detailUrls, onProgress) : "";
  const htmlImageCandidates = extractImageUrlsFromHtml(html, "html");
  const detailImageCandidates = detailHtml ? extractImageUrlsFromHtml(detailHtml, "detail") : [];
  const allImageCandidates = [...htmlImageCandidates, ...detailImageCandidates];
  const imageUrls = uniqueImageCandidates(detailImageCandidates, htmlImageCandidates);
  if (!imageUrls.length) {
    const attributeSource = productAttributeSourceText(structuredText);
    const detailAttrLines = Object.entries(extractProductDetailAttributes(attributeSource)).map(([key, value]) => (
      `PRODUCT_ATTRIBUTE: ${key}=${value}`
    ));
    return { text: [baseText, structuredText, ...detailAttrLines].filter(Boolean).join("\n"), imageCount: 0, candidateCount: allImageCandidates.length, scannedCount: 0, failedCount: 0, ocrAvailable: false };
  }

  onProgress?.(`已找到 ${allImageCandidates.length} 张 1688 图片，全局筛选后优先识别 ${imageUrls.length} 张疑似产品详情/参数图...`);
  const ocr = await ocrImageUrls(imageUrls, onProgress);
  const attributeSource = productAttributeSourceText(structuredText, ocr.text);
  const detailAttrLines = Object.entries(extractProductDetailAttributes(attributeSource)).map(([key, value]) => (
    `PRODUCT_ATTRIBUTE: ${key}=${value}`
  ));
  return {
    text: [baseText, structuredText, ...detailAttrLines, attributeSource && `1688 image OCR text: ${attributeSource}`].filter(Boolean).join("\n"),
    imageCount: imageUrls.length,
    candidateCount: allImageCandidates.length,
    scannedCount: ocr.scannedCount,
    failedCount: ocr.failedCount,
    acceptedCount: ocr.acceptedCount,
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
  const pdfLib = window.pdfjsLib || window["pdfjs-dist/build/pdf"];
  if (!pdfLib) {
    return `Uploaded purchase PDF: ${file.name}`;
  }
  pdfLib.GlobalWorkerOptions.workerSrc = "./vendor/pdfjs/pdf.worker.min.js";
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

function extractDimensions(text) {
  const dimensions = [];
  const sizePatterns = [
    /(?:Top Width|top width|顶部宽度|上宽)[:：]?\s*([0-9.]+\s*(?:cm|mm|in))/i,
    /(?:Side Length|side length|高度|侧边)[:：]?\s*([0-9.]+\s*(?:cm|mm|in)(?:\s*\/\s*[0-9.]+\s*(?:cm|mm|in))?)/i,
    /(?:Bottom Width|bottom width|底部宽度|底宽)[:：]?\s*([0-9.]+\s*(?:cm|mm|in))/i,
    /(?:Weight|weight|单片重量|克重)[:：]?\s*([0-9.]+\s*(?:g\/sheet|g|克\/片))/i,
  ];
  const labels = ["Top Width", "Side Length", "Bottom Width", "Weight"];
  sizePatterns.forEach((pattern, index) => {
    const value = extractFirstMatch(text, [pattern]);
    if (value) dimensions.push(`${labels[index]}: ${value}`);
  });
  return dimensions;
}

function inferProductName(text) {
  const supplierTitle = extractFirstMatch(text, [/PRODUCT_TITLE:\s*([^\n]+)/i]);
  if (supplierTitle) return translateProductTitleWords(supplierTitle) || supplierTitle;
  const explicit = extractFirstMatch(text, [
    /(?:Product Name|产品名称|品名|商品名称)[:：]\s*([^。；;.\n|]{2,80})/i,
    /(?:Coffee Filters?|coffee filter paper|filter paper)/i,
  ]);
  const translatedExplicit = translateProductTitleWords(explicit);
  if (translatedExplicit) return translatedExplicit;
  const purchaseRowName = purchaseRowFieldValue(String(text || "").match(/PURCHASE_ROW\s*:\s*([^\n]+)/i)?.[1] || "", "name");
  const translatedPurchaseName = translateProductTitleWords(purchaseRowName);
  if (translatedPurchaseName) return translatedPurchaseName;
  return "";
}

function inferUseScene(text) {
  if (/V60|dripper|pour over|手冲|挂耳|滤杯/i.test(text)) {
    return "pour-over coffee brewing / drip coffee maker setup";
  }
  if (isYogaSockText(text) || /瑜伽|普拉提|pilates|yoga|barre|dance|workout|hospital|barefoot/i.test(text)) {
    return "yoga / pilates / barre / home workout";
  }
  if (/kitchen|home & kitchen|厨房/i.test(text)) {
    return "home kitchen use";
  }
  return "";
}

function sockSellingPointCandidates(text, material, attrs = {}) {
  const source = [
    text,
    material,
    attrs.Function,
    attrs.Material,
    attrs.Technology,
    attrs.SpecialCraft,
    attrs["Sock Height"],
    attrs.Seam,
    attrs.Weaving,
  ].filter(Boolean).join(" ");
  const candidates = [];
  const add = (key, value, priority) => {
    if (value) candidates.push({ key, value, priority });
  };

  if (hasCrossStrapDesign(source) && hasFiveToeDesign(source)) {
    add("design", "3D cross-strap and five-toe separated design", 10);
  } else {
    if (hasCrossStrapDesign(source)) add("cross-strap", "3D cross-strap design", 10);
    if (hasFiveToeDesign(source)) add("five-toe", "five-toe separated design", 9);
  }
  if (/精\s*梳\s*棉|combed\s+cotton/i.test(source)) {
    add("material", "premium combed cotton comfort", 8);
  } else if (/棉|cotton/i.test(source)) {
    add("material", "breathable cotton comfort", 5);
  }
  if (/防滑|硅胶|点胶|胶印|anti.?slip|non[-\s]?slip|grip|printed?\s+grip/i.test(source)) {
    add("grip", "anti-slip grip sole", 7);
  }
  if (/中筒|mid[-\s]?calf/i.test(source)) add("coverage", "mid-calf coverage", 6);
  if (/长筒|高筒|long sock|knee|over[-\s]?the[-\s]?calf/i.test(source)) add("coverage", "long sock coverage", 6);
  if (/无骨|手工无骨|seamless|hand[-\s]?linked/i.test(source)) add("seam", "seamless hand-linked toe comfort", 6);
  if (/吸汗|sweat|moisture/i.test(source)) add("sweat", "sweat-absorbing workout comfort", 4);
  if (/防摩擦|anti[-\s]?friction|friction/i.test(source)) add("friction", "anti-friction comfort", 4);
  if (/单针|single[-\s]?needle/i.test(source)) add("knit", "single-needle knit texture", 3);
  if (/elastic|高弹|橡筋/i.test(attrs.SpecialCraft || source)) add("elastic", "high-elastic comfortable cuff", 4);
  if (/soft|柔软|细腻/i.test(attrs.SpecialCraft || source)) add("soft", "soft and delicate fabric texture", 3);
  if (/antibacterial|deodorizing|阻菌|抗菌|防臭/i.test(attrs.SpecialCraft || source)) add("deodorizing", "antibacterial deodorizing comfort", 2);

  const selected = [];
  const usedKeys = new Set();
  candidates
    .sort((left, right) => right.priority - left.priority)
    .forEach((candidate) => {
      const key = sellingPointKey(candidate.value) || candidate.key;
      if (usedKeys.has(key)) return;
      if (selected.some((item) => promptItemsOverlap(item.value, candidate.value))) return;
      selected.push(candidate);
      usedKeys.add(key);
    });
  return selected.map((candidate) => candidate.value);
}

function inferSellingPoints(text, material, limit = 2) {
  const attrs = supplierAttributeMap(text);
  if (isSockFamilyText(text)) {
    const sockPoints = sockSellingPointCandidates(text, material, attrs);
    const fallbackFeature2 = sockPoints[0] && sockPoints[0] !== "anti-slip grip sole"
      ? "anti-slip grip sole"
      : "breathable cotton comfort";
    const points = uniqueSellingPoints([...sockPoints, fallbackFeature2], limit);
    return {
      feature1: points[0] || "stable grip for yoga and pilates",
      feature2: points[1] || fallbackFeature2,
      points,
    };
  }
  const feature1 = /wood pulp|原木浆|unbleached|未漂白|natural/i.test(text)
    ? "natural unbleached material"
    : cleanFieldDisplayValue(material) || "primary product benefit";
  const feature2 = /filter|过滤|smooth|均匀|flow|brewing|萃取/i.test(text)
    ? "smooth filtration performance"
    : "reliable everyday brewing";
  const points = uniqueSellingPoints([feature1, feature2, material], 2);
  return {
    feature1: points[0] || feature1,
    feature2: points[1] || feature2,
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

function fallbackDimensionsForSpec(item, combinedText) {
  if (!/coffee filters|咖啡滤纸|V02|扇形|U02|#04/i.test(combinedText)) {
    return {};
  }

  const normalizedKey = item.key || productSpecForToken(item.sizeCode || item.spec || "").key;
  if (normalizedKey === "v02") {
    return {
      topWidth: "16 cm",
      sideLength: "12 cm / 11.6 cm",
      bottomWidth: "",
      weight: "1.12 g/sheet",
      dimensionList: "[VERIFIED_DIMENSIONS: Top Width: 16 cm; Side Length: 12 cm / 11.6 cm; Weight: 1.12 g/sheet]",
      source: "1688 detail image confirmed single-filter dimensions",
    };
  }
  if (normalizedKey === "u02") {
    return {
      topWidth: "16.5 cm",
      sideLength: "9 cm / 9.5 cm",
      bottomWidth: "5 cm",
      weight: "1.15 g/sheet",
      dimensionList: "[VERIFIED_DIMENSIONS: Top Width: 16.5 cm; Side Length: 9 cm / 9.5 cm; Bottom Width: 5 cm; Weight: 1.15 g/sheet]",
      source: "1688 detail image confirmed single-filter dimensions",
    };
  }

  return {};
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
    ...Array.from(source.matchAll(/1688 image OCR text:\s*([\s\S]*?)(?=\n(?:PRODUCT_TITLE|PRODUCT_ATTRIBUTE|SKU_OPTION|Source HTML file|Purchase order image OCR text|1688 image OCR text)\s*:|$)/gi)).map((match) => match[1]),
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
    .filter((line) => !/^\s*(?:PRODUCT_ATTRIBUTE|SKU_OPTION|PRODUCT_TITLE|Source HTML file|Purchase order image OCR text)\s*:/i.test(line))
    .join("\n");
}

function stripImageOcrBlocks(text) {
  return String(text || "")
    .replace(/\n?1688 image OCR text:\s*[\s\S]*?(?=\n(?:PRODUCT_TITLE|PRODUCT_ATTRIBUTE|SKU_OPTION|Source HTML file|Purchase order image OCR text|1688 image OCR text)\s*:|$)/gi, "\n")
    .trim();
}

function productIdentitySourceText(purchaseText, supplierText) {
  return [
    purchaseText,
    stripImageOcrBlocks(supplierText),
  ].filter(Boolean).join(" ");
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
  const isYogaSock = isYogaSockText(combinedText);
  const isSock = isSockFamilyText(combinedText);
  if (isYogaSock) return `${model} five-toe yoga grip socks`;
  if (isSock) return `${model} socks`;
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
    fit: isSockFamilyText(combinedText)
      ? "yoga, pilates, barre, dance, home workout"
      : "",
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
  return "";
}

function extractPurchaseRowSize(row) {
  const source = normalizePurchaseSpecSpacing([row.spec, row.code].filter(Boolean).join(" "));
  const compactRowText = compactChineseText(`${row.name} ${row.spec}`);
  if (/粉碗|接粉环|粉槽/.test(compactRowText)) {
    const coffeeSize = extractFirstMatch(source, [/([1-9]\d\s*mm)/i]);
    return coffeeSize ? coffeeSize.replace(/\s+/g, "") : "";
  }
  const size = extractFirstMatch(source, [
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
  if (isSockFamilyText(compactRowText)) {
    const styleNumber = withoutColor.replace(/^[;；,，\s/-]+|[;；,，\s/-]+$/g, "").trim();
    if (/^[1-9]\d?$/.test(styleNumber) && (!row.quantity || styleNumber === cleanFieldDisplayValue(row.quantity))) return "";
  }
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
    outputProductName: crossBorderNameFromChinese(productName),
    color,
    displayColor: color ? displayColorName(color) : "",
    colorEnglish: colorName(color),
    size,
    variantStyle: style,
    spec: [productName, optionText].filter(Boolean).join(" - "),
    outputSpec: [
      crossBorderNameFromChinese(productName) || productName,
      color ? colorName(color) : "",
      /^(?:均码|one size|free size)$/i.test(size) ? "" : size,
      style && !colorName(style).match(/^[a-z ]+$/i) ? style : "",
    ].filter(Boolean).join(" - "),
    sizeCode: optionText,
    quantity: row.quantity,
    price: row.price,
    pack: "",
    productUnitCount: "",
    fit: isSockFamilyText(`${row.name} ${row.spec}`)
      ? "yoga, pilates, barre, dance, home workout"
      : "",
  };
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

function extractStructuredPurchaseItems(purchaseText) {
  const rows = parseStructuredPurchaseRows(purchaseText);
  if (!rows.length) return [];
  const items = rows
    .map((row) => {
      const coffeeItem = coffeeFilterItemFromPurchaseRow(row);
      if (coffeeItem) return coffeeItem;
      return isLikelyStructuredPurchaseRow(row) ? genericItemFromPurchaseRow(row) : null;
    });
  assignMissingRoundFilterColors(items, rows);
  return items.filter((item) => item && (item.spec || item.sizeCode || item.color || item.key));
}

function isLikelyStructuredPurchaseRow(row) {
  const source = normalizePurchaseText([row.code, row.name, row.spec].filter(Boolean).join(" "));
  const withoutSettlement = stripPurchaseTotalsFromOption(source);
  if (!withoutSettlement) return false;
  if (/[A-Z]{1,4}\d{2,5}/i.test(withoutSettlement)) return true;
  if (extractPurchaseRowColor(row)) return true;
  if (/咖啡|滤纸|粉碗|接粉环|口水巾|围兜|项圈|木天蓼|猫玩具|瑜伽|普拉提|五指|五趾|分趾|袜|拉力|弹力|伞|线香|球/.test(withoutSettlement)) return true;
  return /[\u4e00-\u9fff]{2,}/.test(row.name || "") && !/^[A-Za-z0-9+/=_-]{2,40}$/i.test(withoutSettlement);
}

function extractPurchaseItems(purchaseText, combinedText) {
  const structuredItems = extractStructuredPurchaseItems(purchaseText);
  if (structuredItems.length) return structuredItems;
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
  if (isYogaSockText(combined)) return "五指瑜伽袜";
  if (/船袜|短袜|隐形袜|浅口袜|no[-\s]?show/i.test(combined)) return "船袜";
  if (isSockFamilyText(combined)) return "袜子";
  return stripSupplierModelCodes(cleanFieldDisplayValue(productName));
}

function crossBorderProductName(productName, context = "") {
  const translated = translateProductTitleWords(productName, context);
  const translatedFromContext = translateProductTitleWords(extractFirstMatch(context, [/PRODUCT_TITLE:\s*([^\n]+)/i]), context);
  const coreTitle = compactCoreProductTitle(translated || productName, translatedFromContext || context);
  if (coreTitle) return coreTitle;
  if (translated) return translated;
  if (translatedFromContext) return translatedFromContext;
  return toCrossBorderProductName(productName, "") || stripSupplierModelCodes(cleanFieldDisplayValue(productName));
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
  const descriptiveName = descriptiveYogaSockProductName(value, source);
  if (descriptiveName) return descriptiveName;
  const text = compactEnglishWords(value, 12);
  const combined = `${text} ${compactEnglishWords(source, 12)}`;
  if (!text && !combined.trim()) return "";
  if (/round/.test(combined) && /coffee\s+filter/.test(combined)) return "round coffee filter";
  if (/coffee\s+filter/.test(combined)) return "coffee filter";
  if (/filter\s+basket/.test(combined)) return "filter basket";
  if (/dosing\s+funnel/.test(combined)) return "dosing funnel";
  if (/pet\s+bandana|bandana|bib/.test(combined)) return "pet bandana";
  if (/cat\s+collar|collar/.test(combined)) return "cat collar";
  if (/cat\s+toy|matatabi/.test(combined)) return "cat toy";
  if (/resistance\s+band/.test(combined)) return "resistance band";
  if (/yoga\s+ball|pilates\s+ball/.test(combined)) return "yoga ball";
  if (/folding\s+umbrella|umbrella/.test(combined)) return "folding umbrella";
  if (/incense\s+sticks|incense/.test(combined)) return "incense sticks";
  if (/\byoga\b/.test(combined) && /\bsocks?\b/.test(combined)) return "yoga socks";
  if (/no\s+show/.test(combined) && /\bsocks?\b/.test(combined)) return "no-show socks";
  if (/\btoe\b/.test(combined) && /\bsocks?\b/.test(combined)) return "toe socks";
  if (/\bgrip\b/.test(combined) && /\bsocks?\b/.test(combined)) return "grip socks";
  if (/\bsocks?\b/.test(combined)) return "socks";
  const featureWords = new Set(["grip", "non", "slip", "cotton", "soft", "professional", "special", "dedicated", "solid", "color"]);
  const words = text.split(/\s+/).filter((word) => word && !featureWords.has(word));
  return uniquePromptItems(words).slice(0, 6).join(" ") || text;
}

function shortCrossBorderBaseName(productName, context = "") {
  const combined = [productName, context].filter(Boolean).join(" ");
  const coreTitle = compactCoreProductTitle(productName, context);
  if (coreTitle) return coreTitle;
  if (/round coffee filter|圆形咖啡滤纸/i.test(combined)) return "round coffee filter";
  if (/coffee filters?|咖啡滤纸|filter paper/i.test(combined)) return "coffee filter";
  if (/espresso filter basket|咖啡粉碗|粉碗/i.test(combined)) return "filter basket";
  if (/magnetic dosing funnel|接粉环/i.test(combined)) return "dosing funnel";
  if (/bandana|bib|围兜|口水巾/i.test(combined)) return "pet bandana";
  if (/collar|项圈/i.test(combined)) return "cat collar";
  if (/matatabi|cat toy|猫玩具|木天蓼/i.test(combined)) return "cat toy";
  if (/resistance band|拉力|弹力/i.test(combined)) return "resistance band";
  if (/umbrella|伞/i.test(combined)) return "folding umbrella";
  if (/incense|线香/i.test(combined)) return "incense sticks";
  return compactEnglishWords(crossBorderProductName(productName, context) || productName || "product", 6);
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

function skuCurrentOptionText(item, fallback = "selected product option") {
  const color = crossBorderColorName(item);
  if (color) return color;
  const size = optionSizeForSkuLabel(item);
  const pack = skuRelevantPackValue(item?.productUnitCount || item?.pack || "");
  const style = optionStyleForSkuLabel(item);
  return displayVariantText([style, /^(?:均码|one size|free size)$/i.test(size) ? "" : size, pack].filter(Boolean).join(" / "))
    || displayVariantText(item?.outputSpec || item?.spec || item?.label || fallback);
}

function optionStyleForSkuLabel(item) {
  const style = compactEnglishWords(item?.variantStyle || "", 2);
  if (!style) return "";
  const quantity = cleanFieldDisplayValue(item?.quantity || "");
  const itemContext = [item?.productName, item?.outputProductName, item?.spec, item?.outputSpec, item?.label].filter(Boolean).join(" ");
  if (/^[1-9]\d?$/.test(style) && quantity && style === quantity) return "";
  if (/^[1-9]\d?$/.test(style) && isSockFamilyText(itemContext)) return "";
  return style;
}

function optionSizeForSkuLabel(item) {
  const size = cleanFieldDisplayValue(item?.size || "");
  if (!size) return "";
  const quantity = cleanFieldDisplayValue(item?.quantity || "");
  if (/^[1-9]\d*$/.test(size) && quantity && size === quantity) return "";
  const itemContext = [item?.productName, item?.outputProductName, item?.spec, item?.outputSpec, item?.label].filter(Boolean).join(" ");
  if (/^[1-9]\d?$/.test(size) && isSockFamilyText(itemContext)) return "";
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
  return stripSupplierModelCodes(value)
    .replace(/(?:^|[-\s/])(?:quantity|qty)\s*[:：]?\s*[1-9]\d*(?=$|[-\s/])/gi, " ")
    .replace(/(?:^|[-\s/])数量\s*[:：]?\s*[1-9]\d*(?=$|[-\s/])/gi, " ")
    .replace(/\s*-\s*(?=[-\s/]|$)/g, " ")
    .replace(/\s+/g, " ")
    .replace(/^[\s,/-]+|[\s,/-]+$/g, "")
    .trim();
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
  if (!isSockFamilyText(combinedText)) return items;
  const purchaseColors = colorsFromPurchaseText(purchaseText);
  const colorItems = (items || []).filter((item) => isKnownColorValue(item.color || item.colorEnglish || item.displayColor || item.label || item.outputLabel || ""));
  if (!purchaseColors.length && !colorItems.length) return items;

  const baseItem = colorItems[0] || (items || []).find((item) => item?.model) || (items || [])[0] || {};
  const byColor = new Map();
  colorItems.forEach((item) => {
    const color = item.color || item.colorEnglish || item.displayColor || item.label || item.outputLabel || "";
    const key = canonicalColorKey(color);
    if (key && !byColor.has(key)) byColor.set(key, item);
  });

  const orderedColors = purchaseColors.length
    ? purchaseColors
    : colorItems.map((item) => item.color || item.colorEnglish || item.displayColor || item.label || item.outputLabel || "");
  return orderedColors
    .map((color, index) => {
      const key = canonicalColorKey(color);
      const existing = byColor.get(key) || {};
      const colorEnglish = colorName(color);
      const displayColor = displayColorName(color, colorEnglish);
      return {
        ...baseItem,
        ...existing,
        id: existing.id || `EXTRACTED-${index + 1}-${colorEnglish.replace(/[^A-Z0-9]+/gi, "-") || key || "COLOR"}`,
        label: colorEnglish,
        outputLabel: colorEnglish,
        displayLabel: colorEnglish,
        color,
        displayColor,
        colorEnglish,
        shape: colorEnglish,
        spec: displayColor || color,
        outputSpec: colorEnglish,
        sizeCode: displayColor || color,
        outputSizeCode: colorEnglish,
        variantStyle: "",
        pack: "",
        productUnitCount: "",
      };
    })
    .filter((item) => isKnownColorValue(item.color || item.colorEnglish));
}

function inferProductsFromSources(purchaseText, supplierText, competitorText) {
  const primaryText = productIdentitySourceText(purchaseText, supplierText);
  const combined = [primaryText, competitorText].join(" ");
  const supplierAttrs = supplierAttributeMap(supplierText);
  const identityAttrs = supplierAttributeMap(primaryText);
  const productName = inferProductName(primaryText);
  const isYogaSockFamily = isYogaSockText(primaryText);
  const isSockFamily = isSockFamilyText(primaryText);
  const detailAttributes = supplierAttributeMap(supplierText);
  const material = detailAttributes.Material
    || (/wood pulp|原木浆|木浆|unbleached/i.test(primaryText)
    ? "natural wood pulp paper / unbleached brown paper"
    : /主面料成分["：:]*棉|棉|cotton/i.test(primaryText) || /棉|cotton/i.test(supplierAttrs.Material || "")
      ? translateAttributeValue("Material", supplierAttrs.Material) || "cotton blend fabric"
    : "");
  const color = isSockFamily ? "" : /brown|本色|原色|natural/i.test(primaryText) ? "natural brown" : "";
  const isCoffeeFilterFamily = /coffee filters|咖啡滤纸|V02|扇形02|扇形04|U02|#04/i.test(primaryText);
  const detailTechnology = identityAttrs.Technology || detailAttributes.Technology || "";
  const detailSpecialCraft = identityAttrs.SpecialCraft || "";
  const sockStructure = isSockFamily ? compactSpecificPromptItems([
    hasCrossStrapDesign(primaryText) ? "3D cross-strap design" : "",
    hasFiveToeDesign(primaryText) ? "five-toe separated design" : "",
    detailTechnology,
  ], "", 4) : "";
  const structure = isSockFamily
      ? sockStructure || "sock construction matched to source product"
    : /pressed|压边|压纹|fold|折边/i.test(primaryText) || isCoffeeFilterFamily
      ? "pressed side seam and bottom fold"
    : "";
  const scene = inferUseScene(primaryText || combined);
  const sellingPoints = inferSellingPoints(primaryText, material, 6);
  const extraSellingPointText = remainingSellingPointText(sellingPoints.points || [], 2, 4);
  const extractedSellingPointSet = uniqueSellingPoints(sellingPoints.points || [], 6);
  const primarySellingPoint = extractedSellingPointSet[0] || sellingPoints.feature1;
  const coreProofPoint = extractedSellingPointSet.find((point) => sellingPointKey(point) === "grip") || extractedSellingPointSet[1] || sellingPoints.feature2;
  const secondaryProofPoint = preferredSecondarySellingPoint(extractedSellingPointSet, [primarySellingPoint, coreProofPoint])
    || extractedSellingPointSet.find((point) => ![primarySellingPoint, coreProofPoint].some((used) => promptItemsOverlap(used, point)));
  const globalSellingPoint1 = sellingPointGroupText([primarySellingPoint, coreProofPoint]);
  const secondGroupExtra = preferredSecondarySellingPoint(extractedSellingPointSet, [primarySellingPoint, coreProofPoint, secondaryProofPoint])
    || extractedSellingPointSet.find((point) => ![primarySellingPoint, coreProofPoint, secondaryProofPoint].some((used) => promptItemsOverlap(used, point)));
  const globalSellingPoint2 = sellingPointGroupText([secondaryProofPoint, secondGroupExtra]);
  const dimensions = isSockFamily ? [] : extractDimensions(primaryText);
  const sizeOrRange = detailAttributes.Size
    || (isCoffeeFilterFamily ? extractFirstMatch(primaryText, [/([0-9]+\s*-\s*[0-9]+\s*(?:cups|人份))/i]) : "");
  const productUnitCount = isSockFamily ? "" : skuRelevantPackValue(extractProductUnitCount(supplierText));
  const cleanProductName = toCrossBorderProductName(productName, "");
  const displayName = displayProductName(cleanProductName || productName, combined) || cleanProductName;
  const outputName = crossBorderProductName(cleanProductName || productName, combined) || cleanProductName || displayName;
  const batchBaseName = shortCrossBorderBaseName(outputName || productName || displayName, combined) || "product";
  const purchaseItems = extractPurchaseItems(purchaseText, combined);
  const variants = [];

  if (purchaseItems.length) {
    variants.push(...purchaseItems.map((item, index) => {
      const itemUnitCount = skuRelevantPackValue(productUnitCountForItem(item, supplierText));
      const itemDisplayColor = displayColorName(item.displayColor || item.color, item.colorEnglish);
      const itemForOutput = { ...item, productUnitCount: itemUnitCount };
      const itemDisplayName = displayProductName(item.productName || displayName, combined) || item.productName || displayName;
      const itemOutputBaseName = isYogaSockFamily
        ? outputName
        : item.outputProductName || crossBorderProductName(item.productName || outputName, combined) || outputName;
      const shortBaseName = batchBaseName || shortCrossBorderBaseName(itemOutputBaseName || itemDisplayName || outputName, combined);
      const shortOptionLabel = skuCurrentOptionText(
        { ...itemForOutput, outputSpec: shortCrossBorderOptionLabel(shortBaseName, itemForOutput, `product ${index + 1}`) },
        `product ${index + 1}`
      );
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
    const itemCupRange = isCoffeeFilterFamily
      ? inferCupRangeForSpec(combined, item) || item.cupRange || sizeOrRange || ""
      : sizeOrRange || item.cupRange || "";
    const fallbackDimensions = fallbackDimensionsForSpec(item, combined);
    const itemDimensions = [
      item.dims?.topWidth && `Length: ${item.dims.topWidth}`,
      item.dims?.sideLength && `Width: ${item.dims.sideLength}`,
      item.dims?.bottomWidth && `Height: ${item.dims.bottomWidth}`,
      (detailAttributes.Weight || (!isSockFamily && item.dims?.weight)) && `Weight: ${detailAttributes.Weight || item.dims?.weight}`,
    ].filter(Boolean);
    const dimensionList = dimensions.length
      ? `[VERIFIED_DIMENSIONS: ${dimensions.join("; ")}]`
      : itemDimensions.length
        ? `[VERIFIED_DIMENSIONS: ${itemDimensions.join("; ")}]`
        : fallbackDimensions.dimensionList || "";
    const itemDisplayColor = displayColorName(item.displayColor || item.color, item.colorEnglish);
    const itemColor = item.colorEnglish || colorName(item.color) || color;
    const itemMaterial = material;
    const itemStructure = structure;
    const itemProductName = item.productName || displayProductName(cleanProductName || productName, combined) || toCrossBorderProductName(productName, item.spec);
    const itemOutputName = isYogaSockFamily
      ? outputName
      : item.outputProductName || crossBorderProductName(cleanProductName || productName, combined) || toCrossBorderProductName(productName, item.outputSpec || item.spec);
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
      .map((variant) => displayVariantText(variant.outputLabel || shortCrossBorderOptionLabel(itemShortBaseName, { ...variant, productUnitCount: skuRelevantPackValue(variant.productUnitCount || variant.pack || productUnitCount), pack: skuRelevantPackValue(variant.productUnitCount || variant.pack || productUnitCount) }, itemOutputName || "product option")))
      .filter(Boolean)
      .join(" / ");
    const displaySizeCode = displayVariantText(item.outputSizeCode || outputSpec || item.sizeCode || item.spec || displaySpec);
    return {
    id: item.id,
    label: outputSpec || displayVariantText(item.outputLabel || item.label),
    displayLabel: outputSpec || displayVariantText(item.outputLabel || item.label),
    productName: itemOutputName,
    shape: outputSpec || displaySpec || item.spec,
    pack: safePack,
    sizeCode: displaySizeCode,
    groupKey: "",
    group: {
      promptName: outputSpec || displaySpec || displayVariantText(item.spec),
      promptSpecs: [outputSpec || displaySpec || displayVariantText(item.spec), itemCupRange, safePack, itemMaterial, itemStructure].filter(Boolean),
      dimensions: dimensions.length ? dimensions : itemDimensions,
    },
    dims: {
      topWidth: extractFirstMatch(dimensions.join("; "), [/Top Width:\s*([^;]+)/i]) || item.dims?.topWidth || fallbackDimensions.topWidth || "",
      sideLength: extractFirstMatch(dimensions.join("; "), [/Side Length:\s*([^;]+)/i]) || item.dims?.sideLength || fallbackDimensions.sideLength || "",
      bottomWidth: extractFirstMatch(dimensions.join("; "), [/Bottom Width:\s*([^;]+)/i]) || item.dims?.bottomWidth || fallbackDimensions.bottomWidth || "",
      weight: detailAttributes.Weight || extractFirstMatch(dimensions.join("; "), [/Weight:\s*([^;]+)/i]) || (!isSockFamily ? item.dims?.weight : "") || fallbackDimensions.weight || "",
      cupRange: itemCupRange,
      source: dimensions.length ? "Extracted from uploaded source files" : item.dims?.source || fallbackDimensions.source || "No verified dimensions extracted",
    },
    fit: item.fit,
    quantity: item.quantity,
    material: itemMaterial,
    color: itemColor,
    structure: itemStructure,
    scene,
    feature1: globalSellingPoint1 || sellingPoints.feature1,
    feature2: globalSellingPoint2 || sellingPoints.feature2,
    surfaceFinish: detailTechnology,
    detailParameter: compactPromptItems([detailSpecialCraft, extraSellingPointText], "", 6),
    singleSpec: `[CURRENT_PRODUCT_OPTION: ${[outputSpec || displaySpec || displayVariantText(item.spec), safePack].filter(Boolean).join(", ")}]`,
    specList: `[SPEC_LIST: ${[outputSpec || displaySpec || displayVariantText(item.spec), itemCupRange, safePack, itemMaterial, itemStructure].filter(Boolean).join(" / ")}]`,
    variantList: variantList ? `[VARIANT_LIST: ${variantList}]` : "",
    dimensionList,
  };
  });
}

async function extractSources() {
  hasUserSourceAttempt = true;
  const purchaseFile = byId("purchaseFile").files[0];
  const purchaseImageFile = byId("purchaseImageFile").files[0];
  const supplierFiles = Array.from(byId("supplierFile").files || []);
  const competitorFiles = Array.from(byId("competitorFile").files || []);
  const extractButton = byId("extractSources");
  extractButton.disabled = true;
  extractButton.setAttribute("aria-busy", "true");
  byId("extractStatus").textContent = "正在解析资料...";

  try {
    const purchasePdfText = await readPdfText(purchaseFile);
    const purchaseImageOcr = await ocrLocalImageFile(purchaseImageFile, (message) => {
      byId("extractStatus").textContent = message;
    });
    const purchaseText = [
      purchasePdfText,
      purchaseImageOcr.text && `Purchase order image OCR text: ${purchaseImageOcr.text}`,
    ].filter(Boolean).join("\n");
    const supplierHtml = await readTextFiles(supplierFiles, (message) => {
      byId("extractStatus").textContent = message;
    });
    const competitorHtml = await readTextFiles(competitorFiles, (message) => {
      byId("extractStatus").textContent = message;
    });
    const supplierSource = await extractSupplierSourceText(supplierHtml, (message) => {
      byId("extractStatus").textContent = message;
    });
    sourcePayload = {
      purchase: purchaseText,
      supplier: supplierSource.text,
      competitor: competitorHtml ? cleanHtmlText(competitorHtml) : "",
    };
    fieldOverrides = {};
    fieldOverridesBySku = {};
    extractedProducts = inferProductsFromSources(sourcePayload.purchase, sourcePayload.supplier, sourcePayload.competitor);
    if (!extractedProducts.length) {
      throw new Error("没有从当前资料中提取到产品 / 款式，请确认采购单和 1688 HTML 是否已选择。");
    }
    renderProductSelect(extractedProducts[0]?.id);
    renderFields(true);
    renderAll();
    const ocrStatus = supplierSource.imageCount
      ? `1688 图片 OCR：共发现 ${supplierSource.candidateCount || supplierSource.imageCount} 张图片，全局筛选后优先识别 ${supplierSource.imageCount} 张疑似产品详情/参数图，实际成功 ${supplierSource.scannedCount} 张，采纳 ${supplierSource.acceptedCount || 0} 张，跳过/失败 ${supplierSource.failedCount} 张。远程图片可能因跨域、防盗链、尺寸过小或内容过滤而跳过。`
      : "未找到可识别的 1688 图片。";
    const ocrAvailability = supplierSource.imageCount && !supplierSource.ocrAvailable
      ? "OCR 引擎未加载成功，已跳过图片文字识别。"
      : "";
    const purchaseImageStatus = purchaseImageFile
      ? `采购单图片 OCR：${purchaseImageOcr.scannedCount ? "成功识别" : "未识别到文字或识别失败"}。`
      : "";
    const purchaseImageAvailability = purchaseImageFile && !purchaseImageOcr.available
      ? "OCR 引擎未加载成功，已跳过采购单图片识别。"
      : "";
    const htmlFileStatus = `1688 HTML：${supplierFiles.length} 个；竞品 HTML：${competitorFiles.length} 个。`;
    byId("extractStatus").textContent = `已提取 ${extractedProducts.length} 个产品 / 款式。PDF、采购单图片、多网页 HTML 与详情图 OCR 已尝试读取。${htmlFileStatus}${purchaseImageStatus}${ocrStatus}${purchaseImageAvailability}${ocrAvailability}`;
  } finally {
    extractButton.disabled = false;
    extractButton.removeAttribute("aria-busy");
  }
}

function negativePrompt() {
  return "No invented specs, wrong product, unsupported claims, unrelated overlay info, added logos, added watermark, dense added text, blur; preserve authentic product markings, printed letters, woven labels, and packaging text.";
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

function cupTypeValue(value) {
  return cleanTokenValue(value)
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part && !/(?:pcs|片|pack|包|cups?|人份)/i.test(part))
    .join(", ");
}

function promptFacts(sku, data) {
  const group = productGroups[sku.groupKey] || sku.group || {};
  const productName = promptValue(data.productName, sku.shape || "the product");
  const selectedSpec = promptValue(data.singleSpec, sku.shape || "selected product specification");
  const cupType = promptValue(cupTypeValue(group.promptName || sku.shape || selectedSpec), sku.shape || selectedSpec || "selected product specification");
  const pack = packagingValue(data);
  const material = promptValue(data.material, "verified product material");
  const color = promptValue(data.color, "accurate product color");
  const fit = promptValue(data.fit, sku.fit || "compatible use");
  const scene = promptValue(data.scene, "realistic product use scene");
  const feature1 = promptValue(data.feature1, "verified product benefit");
  const feature2 = promptValue(data.feature2, "verified secondary benefit");
  const feature3 = promptValue(data.feature3, "");
  const variants = promptValue(data.variantList, "available verified product options");
  const dimensions = promptValue(data.dimensionList, "");
  const cupRange = promptValue(data.cupRange || sku.dims?.cupRange || extractFirstMatch(data.specList || "", [/([0-9]+\s*-\s*[0-9]+\s*(?:cups|cup|人份))/i]), "");
  const dimension1 = data.topWidth ? cleanTokenValue(data.topWidth) : "";
  const dimension2 = data.sideLength ? cleanTokenValue(data.sideLength) : "";
  const dimension3 = data.bottomWidth ? cleanTokenValue(data.bottomWidth) : "";
  const weightOrCapacity = data.weight ? cleanTokenValue(data.weight) : "";
  const structure = promptValue(data.structure, sku.structure || "");
  const surfaceFinish = promptValue(data.surfaceFinish, "");
  const detailParameter = promptValue(data.detailParameter, "");
  const titleSpec = stripRepeatedValue(selectedSpec, pack) || productName || selectedSpec;
  const skuOption = compactSkuOptionText(sku.sizeCode || titleSpec || selectedSpec, {
    productName,
    pack,
    material,
    structure,
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
    material,
    color,
    fit,
    scene,
    feature1,
    feature2,
    feature3,
    variants,
    specs,
    dimensions,
    dimension1,
    dimension2,
    dimension3,
    weightOrCapacity,
    structure,
    surfaceFinish,
    detailParameter,
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
    facts.fit,
    facts.scene,
    facts.feature1,
    facts.feature2,
  ].filter(Boolean).join(" ").toLowerCase();
}

function isApparelCategory(facts) {
  return /sock|socks|toe|grip|apparel|clothing|garment|wear|activewear|sportswear|fashion|legging|shirt|dress|pants|shorts|bra|glove|hat|cap|shoe|shoes|服装|衣|裤|裙|袜|鞋|帽|瑜伽|普拉提/.test(promptContextText(facts));
}

function mainImageRule() {
  return "Main image: no overlay text; preserve authentic product/packaging text; product occupies about 85% of the frame.";
}

function shortTextRule() {
  return "Added text: short verified phrases only; no dense copy; preserve authentic product/packaging text.";
}

function humanSceneRule(facts) {
  return isApparelCategory(facts)
    ? "Models/hands/feet optional; if shown, use natural European/American lifestyle model, product-first fit/use context."
    : "People/hands optional; if shown, use natural European/American people and product-first use context.";
}

function sharedVisualRules(facts, typeId = "") {
  return [
    "4K clarity and sharp realistic detail.",
    typeId === "1" ? mainImageRule() : shortTextRule(),
    humanSceneRule(facts),
  ].filter(Boolean).join(" ");
}

function categoryStyleRule(facts) {
  const combined = promptContextText(facts);

  if (/filter|滤纸|paper|pulp|wood pulp|dripper|pour-over|pour over/.test(combined)) {
    return "Category background: bright coffee brewing counter or light studio setup with dripper/cup hints; do not copy competitor product scenes.";
  }
  if (/basket|portafilter|espresso|stainless|steel|metal|304/.test(combined)) {
    return "Category background: clean marble coffee bar with espresso-machine and cup props; do not copy competitor product scenes.";
  }
  if (/kitchen|cup|mug|bottle|jar|container/.test(combined)) {
    return "Category background: bright kitchen or studio countertop, subtle matching props, realistic light.";
  }
  if (/sock|socks|toe|grip|pilates|yoga|barre|瑜伽|普拉提|袜/.test(combined)) {
    return "Category background: premium yoga/pilates lifestyle setting, bright studio floor or calm home workout space.";
  }
  return "Category background: realistic light category-matched surface and props, uncluttered Amazon listing style.";
}

function basicImageRequirements(templateId, typeId, extra = "") {
  const parts = ["1:1 Amazon listing image", "4K clarity", "sharp realistic detail"];
  if (typeId === "1") {
    parts.push("no added overlay text", "preserve authentic product/packaging text", "product occupies about 85% of the frame");
    if (templateId === "feature") {
      parts.push("pure white background");
    } else {
      parts.push("premium scene-based hero background matched to the product theme");
    }
  } else {
    parts.push("verified added overlay text only when useful", "preserve authentic product/packaging text");
  }
  if (extra) parts.push(extra);
  return compactPromptItems(parts, "", 8);
}

function amazonImageFileSizeRule() {
  return "Amazon file rule: final exported image file size must be 5 MB or less.";
}

function dimensionText(facts) {
  return compactSpecificPromptItems([
    facts.dimension1 && `Dimension 1: ${facts.dimension1}`,
    facts.dimension2 && `Dimension 2: ${facts.dimension2}`,
    facts.dimension3 && `Dimension 3: ${facts.dimension3}`,
    facts.weightOrCapacity && `Weight / Capacity: ${facts.weightOrCapacity}`,
  ], "", 4);
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
    option && `Current option: ${option}`,
    color && !extraIncludesColor && `Color: ${color}`,
    referenceColorLockText(),
    ...extraItems,
    facts.material && !extraIncludesMaterial && `Material: ${facts.material}`,
    facts.cupRange && `Size / range: ${facts.cupRange}`,
    facts.pack && !extraIncludesPack && `Count / set: ${facts.pack}`,
    facts.structure && !extraIncludesStructure && `Structure: ${facts.structure}`,
    facts.surfaceFinish && !structureIncludesTechnology && !extraIncludesSurfaceFinish && `Technology: ${facts.surfaceFinish}`,
    detailValue && !extraIncludesDetail && `Texture detail: ${detailValue}`,
  ], "", limit);
}

function referenceColorLockText() {
  return "Reference color lock: match the product color in the source image exactly; no hue, saturation, brightness, warmth, lighting, prop, or background tint shift.";
}

function productIdentityLockText(facts) {
  return compactPromptItems([
    "Product identity lock: match the source product exactly; no generic substitute or invented shape/details.",
    facts.selectedSpec && `Exact option/spec: ${shortOptionText(facts) || facts.selectedSpec}`,
    facts.pack && `Pack count if shown: ${facts.pack}`,
    "Preserve authentic visible product/packaging markings.",
  ], "", 4);
}

function sceneProductDetailText(facts, extraItems = [], limit = 8) {
  return productDetailText(facts, [
    productIdentityLockText(facts),
    ...extraItems,
  ], limit);
}

function sceneContextProductDetailText(facts, extraItems = [], limit = 5) {
  const option = compactSkuOptionText(facts.skuOption || shortOptionText(facts), facts);
  return compactSpecificPromptItems([
    `Product: ${facts.productName}`,
    option && `Current option: ${option}`,
    referenceColorLockText(),
    "Product accuracy: product must stay recognizable and match the source product, but the complete use environment is the main visual priority.",
    ...extraItems,
  ], "", limit);
}

function overallStyleText(facts, typeId, extra = "", options = {}) {
  const includeHumanRule = options.includeHumanRule !== false;
  return compactPromptItems([
    categoryStyleRule(facts),
    includeHumanRule ? humanSceneRule(facts) : "",
    typeId === "1" ? "" : shortTextRule(),
    referenceRuleText(),
    extra,
  ], "", 6);
}

function buildPromptSections({ facts, templateId, typeId, basic = "", details = "", style = "", negative = "", includeNegative = true }) {
  const basicText = compactPromptItems([
    basic || basicImageRequirements(templateId, typeId),
    amazonImageFileSizeRule(),
  ], "", 10);
  const sections = [
    promptSection("Basic Image Requirements", basicText),
    promptSection("Product Details", details || productDetailText(facts)),
    promptSection("Overall Style", style || overallStyleText(facts, typeId)),
  ];
  if (includeNegative) {
    sections.push(promptSection("Negative Prompt", negative || negativePrompt()));
  }
  return sections.join("\n");
}

function promptSection(label, value) {
  const clean = String(value || "")
    .replace(/\s+/g, " ")
    .replace(/[.。]+$/g, "")
    .trim();
  return `${label}: ${clean}.`;
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
  const splitPointItems = (value) => String(value || "")
    .split(/\s*(?:,|，|\/|\+)\s*/)
    .map((item) => item.trim())
    .filter(Boolean);
  return uniqueSellingPoints([
    facts.feature1,
    facts.feature2,
    facts.feature3,
    facts.structure,
    facts.surfaceFinish,
    ...splitPointItems(visibleDetailParameter(facts.detailParameter)),
    facts.fit,
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
  const preferredKeys = ["seam", "sweat", "friction", "coverage", "elastic", "soft", "knit"];
  for (const key of preferredKeys) {
    const matched = available.find((point) => sellingPointKey(point) === key);
    if (matched) return matched;
  }
  return available[0] || "";
}

function sellingPointGroupText(points) {
  return uniqueSellingPoints(Array.isArray(points) ? points : [points], 4).join(" + ");
}

function sellingPointGroupFromText(value) {
  return String(value || "")
    .split(/\s*\+\s*/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function sellingPointGroups(facts, groupIndex = 0, groupSize = 2) {
  if (groupIndex === 0 && facts.feature1) return sellingPointGroupFromText(facts.feature1);
  if (groupIndex === 1 && facts.feature2) return sellingPointGroupFromText(facts.feature2);
  const points = sellingPointCandidates(facts, 6);
  const size = points.length >= 3 ? groupSize : 1;
  const start = groupIndex * size;
  const group = points.slice(start, start + size);
  if (group.length) return group;
  return points.slice(groupIndex, groupIndex + 1);
}

function sellingPointLine(points, fallback = "verified product benefit") {
  const cleanPoints = uniqueSellingPoints(Array.isArray(points) ? points : [points], 4);
  return `Selling point${cleanPoints.length > 1 ? "s" : ""}: ${cleanPoints.join(" + ") || fallback}`;
}

function sellingPointDisplayText(points, fallback = "verified product benefit") {
  return uniqueSellingPoints(Array.isArray(points) ? points : [points], 4).join(" + ") || fallback;
}

function sellingPointOnImageRule(points, fallback = "verified product benefit") {
  const labelText = sellingPointDisplayText(points, fallback);
  return `On-image selling-point labels required: display readable text/callout labels for "${labelText}" with matching simple icons, arrows, or detail markers; the scene/action must visually prove these exact selling point(s).`;
}

function sellingPointSceneGuide(points, facts = {}) {
  const cleanPoints = uniqueSellingPoints(Array.isArray(points) ? points : [points], 4);
  const guides = cleanPoints.map((point) => {
    const key = sellingPointKey(point);
    if (key === "grip") return "show real anti-slip grip under floor/mat/surface pressure";
    if (key === "cotton" || key === "soft") return "show relaxed comfort with fabric texture visible";
    if (key === "cross-strap" || key === "five-toe") return "show worn/angled view that reveals the structure";
    if (key === "elastic") return "show snug stretch in use without distortion";
    if (key === "filtration") return "show real filtration flow in the use setup";
    if (key === "material") return "show material texture in a realistic category scene";
    return `show realistic use evidence for ${point}`;
  });
  return compactPromptItems([
    ...guides,
    facts.scene && `Keep scene relevant to ${facts.scene}`,
  ], "", 4);
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
  const variants = cleanTokenValue(facts.variants)
    .split(/\s+\/\s+/)
    .map((item) => {
      const clean = item
        .replace(productName, "")
        .replace(/^[\s/-]+/, "")
        .trim();
      return clean || item.trim();
    })
    .filter(Boolean);
  return uniquePromptItems(variants).join(" / ") || facts.variants;
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
  return cleanTokenValue(value)
    .split(/\s*,\s*|\s*\/\s*/)
    .map((item) => item.trim())
    .filter((item) => item && !/antibacterial|deodorizing|阻菌|抗菌|防臭/i.test(item))
    .slice(0, 2)
    .join(", ");
}

function detailTextureText(facts, fallback = "accurate visible material texture from the reference") {
  return compactSpecificPromptItems([
    facts.material,
    facts.structure,
    facts.surfaceFinish,
    visibleDetailParameter(facts.detailParameter),
  ], fallback, 3);
}

function visibleTextureDetails(facts) {
  return compactSpecificPromptItems([detailTextureText(facts), facts.color], "visible material texture and true color", 4);
}

function referenceRuleText() {
  return sourcePayload.competitor
    ? "Reference: use competitor composition only; do not copy competitor claims, overlay text, or brand; preserve authentic markings from the source product itself."
    : "Reference: clean Amazon listing style.";
}

function specModulePrompt(typeId, facts) {
  const dimensionLine = [
    facts.dimension1 && `Dimension 1: ${facts.dimension1}`,
    facts.dimension2 && `Dimension 2: ${facts.dimension2}`,
    facts.dimension3 && `Dimension 3: ${facts.dimension3}`,
    facts.weightOrCapacity && `Weight / Capacity: ${facts.weightOrCapacity}`,
  ].filter(Boolean).join(" / ");
  const summarySideLabels = uniquePromptItems([
    facts.material,
    facts.structure,
    facts.feature1,
  ]).slice(0, 3);
  const summaryBottomLabels = uniquePromptItems([
    facts.fit,
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
  const sceneUse = compactPromptItems([facts.scene, facts.fit], "realistic use scene", 3);
  const sellingPointGroup1 = sellingPointGroups(facts, 0);

  const modules = {
    "1": {
      basic: basicImageRequirements("spec", "1"),
      details: productDetailText(facts, [option, facts.color], 6),
      style: overallStyleText(facts, "1", "Premium product-theme hero scene; product is the dominant subject; no added title, no added labels, no added overlay text; keep authentic product markings."),
    },
    "2": {
      basic: basicImageRequirements("spec", "2"),
      details: productDetailText(facts, [sceneUse], 6),
      style: overallStyleText(facts, "2", `Realistic lifestyle use scene: ${sceneUse}; product stays clear and accurate.`),
    },
    "3A": {
      basic: basicImageRequirements("spec", "3A"),
      details: productDetailText(facts, [sceneUse], 6),
      style: overallStyleText(facts, "3A", `3-4 clean panels showing different verified use scenes: ${sceneUse}.`),
    },
    "3B": {
      basic: basicImageRequirements("spec", "3B"),
      details: productDetailText(facts, [facts.fit], 6),
      style: overallStyleText(facts, "3B", `Simple 3-4 step usage infographic for ${facts.productName}; number markers and added captions allowed; added captions must stay short.`),
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
      details: productDetailText(facts, [`Verified options: ${compactVariantText(facts)}`], 7),
      style: overallStyleText(facts, "5", "Product option comparison grid; show only verified options; small added option tags only; preserve authentic product markings.", { includeHumanRule: false }),
    },
    "6": {
      basic: basicImageRequirements("spec", "6"),
      details: productDetailText(facts, [sellingPointLine(sellingPointGroup1), sellingPointOnImageRule(sellingPointGroup1)], 6),
      style: overallStyleText(facts, "6", `Build the scene around the listed selling point(s): ${sellingPointSceneGuide(sellingPointGroup1, facts)}; clear selling-point text/callouts must appear on image.`),
    },
    "7": {
      basic: basicImageRequirements("spec", "7"),
      details: productDetailText(facts, [`Macro focus: ${detailTextureText(facts, "material or structure")}`], 7),
      style: overallStyleText(facts, "7", "Macro close-up detail; sharp texture, clean edges, optional small magnifier inset.", { includeHumanRule: false }),
    },
    "8": {
      basic: basicImageRequirements("spec", "8"),
      details: productDetailText(facts, [`Summary points: ${compactPromptItems(sellingPointCandidates(facts, 5), featureLabels, 5)}`], 8),
      style: overallStyleText(facts, "8", "Summary layout with product centered and 3-4 verified added callouts; no dense added specification table; preserve authentic product markings."),
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
    negative: negativePrompt(),
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
  const combined = promptContextText(facts);

  if (/filter|滤纸|paper|pulp|wood pulp|dripper|pour-over|pour over/.test(combined)) {
    return "Scene category: bright coffee brewing counter or light studio setup with dripper/cup hints.";
  }
  if (/basket|portafilter|espresso|stainless|steel|metal|304/.test(combined)) {
    return "Scene category: clean marble coffee bar with espresso-machine and cup props.";
  }
  if (/kitchen|cup|mug|bottle|jar|container/.test(combined)) {
    return "Scene category: bright kitchen or studio countertop with subtle matching props.";
  }
  if (/sock|socks|toe|grip|pilates|yoga|barre|瑜伽|普拉提|袜/.test(combined)) {
    return "Scene category: premium yoga or pilates lifestyle setting with soft natural light.";
  }
  return "Scene category: realistic light category-matched surface, props, and color mood.";
}

function sceneOverallStyleText(facts, typeId, extra = "") {
  return compactPromptItems([
    sceneCategoryStyleRule(facts),
    sceneQualityRule(),
    typeId === "1" ? "" : "Use only short verified labels when useful.",
    humanSceneRule(facts),
    sourcePayload.competitor ? referenceRuleText() : "",
    extra,
  ], "", 7);
}

function multiSceneLifestyleStyleText(facts, sceneList) {
  return [
    sceneCategoryStyleRule(facts),
    "Lifestyle usage scenes only; this is not a selling-point infographic and not a product display grid.",
    `Create 3-4 large real-life use scenes for ${sceneList}; each panel shows full environment, medium/wide framing, props, room/context, and natural use action.`,
    "The product is a small natural part of each scene, about 15%-30% of each panel; do not crop into product close-ups, do not isolate the product, do not enlarge the product as the main subject.",
    "No added selling-point text, no callout labels, no badges, no arrows, no feature icons, no product-spec explanation.",
    humanSceneRule(facts),
  ].filter(Boolean).join(" / ");
}

function productFirstOptionalHumanRule() {
  return "Product-first proof scene; any human presence stays secondary.";
}

function sceneSellingPointItems(facts, points, fallback) {
  const sellingPoints = uniqueSellingPoints(Array.isArray(points) ? points : [points], 3);
  const sellingPointText = sellingPoints.join(" + ") || fallback;
  const support = compactSpecificPromptItems([
    facts.structure && !promptItemsOverlap(sellingPointText, facts.structure) ? facts.structure : "",
    facts.material && !promptItemsOverlap(sellingPointText, facts.material) ? facts.material : "",
    facts.color && !promptItemsOverlap(sellingPointText, facts.color) ? facts.color : "",
  ], "", 2);
  return [sellingPointLine(sellingPoints, fallback), sellingPointOnImageRule(sellingPoints, fallback), support].filter(Boolean);
}

function summaryInsetGuide(facts, points) {
  const guideItems = uniqueSellingPoints(points, 4).map((point) => {
    const key = sellingPointKey(point);
    if (key === "grip") return "anti-slip sole close-up";
    if (key === "cross-strap" || key === "five-toe") return "structure/detail close-up";
    if (key === "cotton" || key === "soft" || key === "elastic") return "fabric comfort close-up";
    if (key === "filtration") return "working-performance close-up";
    if (key === "material") return "material texture close-up";
    return `${point} visual proof close-up`;
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
  const sceneList = promptItemsOverlap(facts.scene, facts.fit)
    ? specificPromptValue(facts.scene || facts.fit, "verified realistic use scenes")
    : compactSpecificPromptItems([facts.scene, facts.fit], "verified realistic use scenes", 3);
  const mainScene = compactSpecificPromptItems([facts.scene, facts.fit], "a realistic premium category scene", 2);
  const sellingPointSet = sellingPointCandidates(facts, 6);
  const sellingPointGroup1 = sellingPointGroups(facts, 0);
  const sellingPointGroup2 = sellingPointGroups(facts, 1);
  const summaryPoints = compactSpecificPromptItems([
    facts.fit || facts.scene,
    ...sellingPointSet,
  ], "main scene / multi-use / key selling points", 4);
  const summaryInsetText = summaryInsetGuide(facts, sellingPointSet);
  const modules = {
    "1": {
      basic: basicImageRequirements("scene", "1"),
      details: sceneProductDetailText(facts, [mainScene, visibleTextureDetails(facts)], 7),
      style: sceneOverallStyleText(facts, "1", `Scene-based hero in ${mainScene}; refined theme-matched background and natural depth.`),
    },
    "2": {
      basic: "1:1 Amazon listing image, 4K clarity, sharp realistic detail, multi-panel complete-use-scene collage, environment-first composition.",
      details: sceneContextProductDetailText(facts, [sceneList], 5),
      style: multiSceneLifestyleStyleText(facts, sceneList),
    },
    "3": {
      basic: "1:1 Amazon multi-angle product image, 4K clarity, sharp realistic detail, product-only layout, no added text, labels, callouts, badges, captions, or arrows.",
      details: sceneProductDetailText(facts, [physicalDetails, visibleTextureDetails(facts)], 7),
      style: "Product-only multi-angle display; show front, side, back/top, and one detail view on a clean light studio background; no text explanation or added graphic annotations; keep all views focused on the product itself.",
    },
    "4": {
      basic: "1:1 Amazon product explanation image, 4K clarity, sharp realistic detail, product-only layout, clean light studio background.",
      details: sceneProductDetailText(facts, [physicalDetails, visibleTextureDetails(facts)], 7),
      style: "Product-only explanation image; show the product itself centered with 2-3 concise verified callout labels for material, structure, texture, or visible details; no human model, hands, body parts, wearing model, lifestyle action, or use-scene composition.",
    },
    "5": {
      basic: basicImageRequirements("scene", "5"),
      details: sceneProductDetailText(facts, sceneSellingPointItems(facts, sellingPointGroup1, "the primary verified benefit"), 7),
      style: sceneOverallStyleText(facts, "5", `${productFirstOptionalHumanRule()} Build the scene around the listed selling point(s): ${sellingPointSceneGuide(sellingPointGroup1, facts)}; include a short headline plus concise selling-point labels/callouts on image.`),
    },
    "6": {
      basic: basicImageRequirements("scene", "6"),
      details: sceneProductDetailText(facts, sceneSellingPointItems(facts, sellingPointGroup2, "the secondary verified benefit"), 6),
      style: sceneOverallStyleText(facts, "6", `${productFirstOptionalHumanRule()} Build a distinct scene around the listed selling point(s): ${sellingPointSceneGuide(sellingPointGroup2, facts)}; composition must differ from Image 5; include a short headline plus concise selling-point labels/callouts on image.`),
    },
    "7": {
      basic: basicImageRequirements("scene", "7"),
      details: sceneProductDetailText(facts, [
        `Summary points: ${summaryPoints}`,
        `Detail inset subjects: ${summaryInsetText}`,
      ], 8),
      style: sceneOverallStyleText(facts, "7", `${productFirstOptionalHumanRule()} Strong summary poster: one large central lifestyle use photo plus 3-4 real product-detail inset windows around it. Each inset must show an actual close-up visual proof, not only a line, icon, or text callout; short verified labels under insets are allowed. Add one concise top headline and optional 2-3 short summary bullets; no dense table or text-only diagram.`),
    },
  };
  const selected = modules[typeId] || modules["1"];

  return buildPromptSections({
    facts,
    templateId: "scene",
    typeId,
    basic: selected.basic,
    details: selected.details,
    style: selected.style,
    includeNegative: false,
  });
}

function sceneTemplatePrompt(typeId, sku, data) {
  const facts = promptFacts(sku, data);
  return sceneModulePrompt(typeId, facts);
}

function featureModulePrompt(typeId, facts) {
  const sceneUse = compactSpecificPromptItems([facts.scene, facts.fit], "realistic product use scene", 3);
  const optionText = compactSkuOptionText(facts.skuOption || shortOptionText(facts), facts);
  const productInfo = compactSpecificPromptItems([
    facts.productName,
    optionText,
    facts.pack && `Count / set: ${facts.pack}`,
    facts.color && `Color: ${facts.color}`,
    facts.material && `Material: ${facts.material}`,
    facts.structure && `Structure: ${facts.structure}`,
    facts.surfaceFinish && `Technology / finish: ${facts.surfaceFinish}`,
    facts.fit && `Compatible use: ${facts.fit}`,
  ], "verified product information", 8);
  const sizeInfo = compactSpecificPromptItems([
    facts.cupRange && `Size / range: ${facts.cupRange}`,
    dimensionText(facts),
    facts.weightOrCapacity && `Weight / quantity: ${facts.weightOrCapacity}`,
  ], "", 4);
  const detailInfo = compactSpecificPromptItems([
    detailTextureText(facts, ""),
    visibleDetailParameter(facts.detailParameter),
    facts.color && `True color: ${facts.color}`,
  ], "verified visible product details", 4);
  const sellingPointGroup1 = sellingPointGroups(facts, 0);
  const sellingPointGroup2 = sellingPointGroups(facts, 1);
  const summaryPoints = compactSpecificPromptItems([
    facts.fit || facts.scene,
    ...sellingPointCandidates(facts, 6),
    facts.material,
    facts.structure,
    facts.surfaceFinish,
  ], "verified product benefits", 6);
  const modules = {
    "1": {
      basic: basicImageRequirements("feature", "1"),
      details: productDetailText(facts, [optionText, facts.color], 6),
      style: overallStyleText(facts, "1", "Pure white Amazon main image for product information filling; product only, centered, clean shadow, no props, no added title, no added labels; preserve authentic product markings.", { includeHumanRule: false }),
    },
    "2": {
      basic: basicImageRequirements("feature", "2"),
      details: productDetailText(facts, [`Core use scene: ${sceneUse}`], 6),
      style: overallStyleText(facts, "2", "Single realistic core use scene based on the filled product scene/use fields; product-first composition; one short verified headline or label only if useful."),
    },
    "3": {
      basic: basicImageRequirements("feature", "3"),
      details: productDetailText(facts, [`Use scenarios: ${sceneUse}`, facts.fit && `Compatible object/use: ${facts.fit}`], 6),
      style: overallStyleText(facts, "3", "3-4 panel multi-use display; each panel shows a distinct real use scenario with one short readable label and a simple icon if helpful; no dimensions or long captions."),
    },
    "4": {
      basic: "1:1 Amazon product information display image, 4K clarity, sharp realistic detail, clean product-first infographic layout.",
      details: productDetailText(facts, [
        `Display fields: ${productInfo}`,
        sizeInfo && `Verified size fields: ${sizeInfo}`,
      ], 8),
      style: overallStyleText(facts, "4", "Product information template style: one large product image plus 3-5 concise field callouts for option, material, structure, compatible use, size/range, or count/set. Use small icons, clean arrows, or simple mini illustrations; no dense table and no unverified specs.", { includeHumanRule: false }),
    },
    "5": {
      basic: basicImageRequirements("feature", "5"),
      details: productDetailText(facts, [
        `Current selected option: ${optionText || facts.selectedSpec}`,
        `Verified options: ${compactVariantText(facts)}`,
        facts.pack && `Count / set label: ${facts.pack}`,
      ], 8),
      style: overallStyleText(facts, "5", "Specification and option display: show only verified options in a clean comparison grid or horizontal columns. Each option uses a short label and consistent product scale; mark the current option clearly; do not create unavailable colors, sizes, counts, or bundles.", { includeHumanRule: false }),
    },
    "6": {
      basic: basicImageRequirements("feature", "6"),
      details: productDetailText(facts, [sellingPointLine(sellingPointGroup1), sellingPointOnImageRule(sellingPointGroup1)], 6),
      style: overallStyleText(facts, "6", `Core function demonstration based on Selling Point 1. Build the visual proof around: ${sellingPointSceneGuide(sellingPointGroup1, facts)}. Product remains clear and accurate; include one short headline plus 2-3 concise icon/callout labels tied to the filled product fields.`),
    },
    "7": {
      basic: basicImageRequirements("feature", "7"),
      details: productDetailText(facts, [
        `Detail fields: ${detailInfo}`,
        sellingPointLine(sellingPointGroup2, "verified secondary benefit"),
        sellingPointOnImageRule(sellingPointGroup2, "verified secondary benefit"),
      ], 8),
      style: overallStyleText(facts, "7", `Detail and material feature display: show macro close-ups, texture/detail insets, or visible structure proof for the filled detail fields. Build a distinct composition from Image 6 around: ${sellingPointSceneGuide(sellingPointGroup2, facts)}; include short verified labels only; no unsupported claims.`, { includeHumanRule: false }),
    },
    "8": {
      basic: basicImageRequirements("feature", "8"),
      details: productDetailText(facts, [
        `Summary points: ${summaryPoints}`,
        optionText && `Top title option: ${optionText}`,
        facts.pack && `Show count/set once as a small badge: ${facts.pack}`,
      ], 8),
      style: overallStyleText(facts, "8", "Feature summary template: large central product hero, 3-5 verified callouts around it, optional small detail insets, and one concise title. Use only non-repeated product information and selling points; do not make a dense specification table; preserve authentic product markings."),
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
    negative: negativePrompt(),
  });
}

function featureTemplatePrompt(typeId, sku, data) {
  const facts = promptFacts(sku, data);
  return featureModulePrompt(typeId, facts);
}

function promptFor(templateId, typeId, sku, data) {
  const facts = promptFacts(sku, data);

  if (templateId === "spec") {
    return specTemplatePrompt(typeId, sku, data);
  }

  if (templateId === "scene") {
    return sceneTemplatePrompt(typeId, sku, data);
  }

  return featureTemplatePrompt(typeId, sku, data);
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
}

function renderProductPromptGrid() {
  const grid = byId("productPromptGrid");
  if (!grid) return;

  const sku = selectedSku();
  const template = selectedTemplate();
  if (!hasExtractedProducts()) {
    promptStore = [];
    grid.innerHTML = `<p class="empty-state">请选择采购单、1688 HTML 和竞品资料后点击解析。</p>`;
    return;
  }
  const data = currentPromptData(sku);
  const facts = promptFacts(sku, data);
  const displayLabel = skuDisplayLabel(sku, data);
  promptStore = template.imageTypes.map((type) => ({
    id: type.id,
    prompt: promptFor(template.id, type.id, sku, data),
  }));

  grid.innerHTML = template.imageTypes.map((type, index) => {
    const prompt = promptStore[index].prompt;
    return `
      <article class="prompt-card">
        <div class="prompt-card-head">
          <div>
            <span>${escapeHtml(displayLabel)}</span>
            <h3>${type.name}</h3>
          </div>
          <button type="button" class="copy-prompt" data-prompt-index="${index}">Copy</button>
        </div>
        <pre class="prompt-preview">${highlightPromptVariables(prompt, facts, type.id)}</pre>
      </article>
    `;
  }).join("");

  grid.querySelectorAll(".copy-prompt").forEach((button) => {
    button.addEventListener("click", () => {
      copyText(promptStore[Number(button.dataset.promptIndex)]?.prompt || "", "已复制该图提示词。", button);
    });
  });
}

function renderPrompt() {
  renderProductPromptGrid();
}

function renderAll() {
  renderProductParameters();
  renderSourceSummary();
  renderFacts();
  fieldSnapshot = currentFieldSignature();
}

function allPromptsForSku() {
  if (!hasExtractedProducts()) return "";
  const sku = selectedSku();
  const template = selectedTemplate();
  const data = currentPromptData(sku);
  return template.imageTypes.map((type) => `## ${type.promptName || type.name}\n\n${promptFor(template.id, type.id, sku, data)}`).join("\n\n---\n\n");
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

function init() {
  window.renderAll = renderAll;
  window.promptForSku = promptFor;
  fillSelects();
  renderFields(true);
  renderAll();
  startFieldWatcher();

  byId("skuSelect").addEventListener("change", () => {
    renderFields(true);
    renderAll();
  });
  byId("templateSelect").addEventListener("change", renderAll);
  byId("extractSources").addEventListener("click", () => {
    extractSources().catch((error) => {
      extractedProducts = [];
      renderProductSelect();
      renderFields(true);
      renderAll();
      byId("extractStatus").textContent = `解析失败：${error.message || "请检查文件格式"}`;
    });
  });
  ["purchaseFile", "purchaseImageFile", "supplierFile", "competitorFile"].forEach((id) => {
    byId(id).addEventListener("change", () => {
      byId("extractStatus").textContent = "文件已选择，点击解析资料并提取产品信息。";
    });
  });
  byId("resetFields").addEventListener("click", () => {
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
}

init();
