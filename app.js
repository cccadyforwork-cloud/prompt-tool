const sourceNotes = {
  purchase: "采购单主口径：确认已采购的产品款式；不把下单数量当作产品参数。",
  alibaba: "1688 主资料口径：提取产品标题、款式选项、材质、结构、适配和已确认规格。",
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
    description: "围绕真实使用动作和两个核心卖点生成 8 张图。",
    imageTypes: [
      { id: "1", name: "1. 白底图", promptName: "1. White Background Main Image" },
      { id: "2", name: "2. 单一场景图", promptName: "2. Single-Scene Lifestyle Image" },
      { id: "3", name: "3. 多场景图 / 多用途展示", promptName: "3. Multi-Scene Usage Image" },
      { id: "4", name: "4. 产品展示图 / 多视角图", promptName: "4. Product Display Image" },
      { id: "5", name: "5. 多规格 / 多选品搭配图", promptName: "5. Product Option Selection Image" },
      { id: "6", name: "6. 卖点图 1", promptName: "6. Selling Point Image 1" },
      { id: "7", name: "7. 卖点图 2", promptName: "7. Selling Point Image 2" },
      { id: "8", name: "8. 卖点总结图", promptName: "8. Selling Point Summary Image" },
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
  ["topWidth", "Dimension 1", ""],
  ["sideLength", "Dimension 2", ""],
  ["bottomWidth", "Dimension 3", ""],
  ["weight", "Weight / Quantity", ""],
  ["fit", "Compatible Object / Use", ""],
  ["scene", "Use Scene", ""],
  ["feature1", "Selling Point 1", ""],
  ["feature2", "Selling Point 2", ""],
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
    fieldOverrides = {};
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
  return cleanFieldDisplayValue(input ? input.value : fieldOverrides[key] ?? "");
}

function captureFieldOverrides() {
  fields.forEach(([key]) => {
    const input = byId(`field-${key}`);
    if (input) fieldOverrides[key] = cleanFieldDisplayValue(input.value);
  });
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
  };
  const group = productGroups[sku.groupKey] || sku.group || {};
  const productName = promptValue(data.productName, defaultProductName(sku));
  const productSpec = promptValue(cleanTokenValue(base.singleSpec), "")
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

function translateProductDetailValue(key, value) {
  const clean = usefulDetailValue(value);
  if (!clean) return "";
  const normalized = compactOcrKeyText(clean).toLowerCase();
  if (key === "Material") {
    const cotton = extractPercentAfterLabel(clean, "棉|cotton");
    const spandex = extractPercentAfterLabel(clean, "氨\\s*纶|氨\\s*给|各\\s*纶|胺\\s*纶|spandex");
    const polyester = extractPercentAfterLabel(clean, "聚\\s*[酯酷醒酮]\\s*纤\\s*维|聚\\s*[酯酷醒酮]|polyester");
    const parts = [
      cotton && `${cotton}% cotton`,
      spandex && `${spandex}% spandex`,
      polyester && `${polyester}% polyester fiber`,
    ].filter(Boolean);
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
    if (/防滑|anti.?slip|grip/i.test(clean)) values.push("anti-slip grip");
    if (/胶印|printed?|print/i.test(clean)) values.push("printed grip pattern");
    return values.length ? values.join(", ") : "";
  }
  if (key === "SpecialCraft") {
    const values = [];
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

function colorName(rawColor) {
  const clean = String(rawColor || "").replace(/[()（）百人复购\s]/g, "").trim();
  const colorMap = {
    白: "white",
    白色: "white",
    本白: "white",
    本色: "white",
    本全: "white",
    米白: "off white",
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
    银灰: "silver gray",
    深灰: "dark gray",
    豆绿: "bean green",
    浅卡: "light khaki",
    卡其: "khaki",
    肉粉: "nude pink",
    白红: "white red",
    白紫: "white purple",
    黑紫: "black purple",
  };
  return colorMap[clean] || clean;
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
    gray: ["灰", "灰色", "银灰", "深灰", "gray", "grey", "silvergray", "darkgray"],
    blue: ["蓝", "蓝色", "水蓝", "淡蓝", "blue", "lightblue"],
    green: ["绿", "绿色", "草绿", "豆绿", "green", "grassgreen", "beangreen"],
    purple: ["紫", "紫色", "浅紫", "purple", "lightpurple"],
    pink: ["粉", "粉色", "浅粉", "粉红", "肉粉", "pink", "lightpink", "nudepink"],
    red: ["红", "红色", "red"],
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
    gray: ["灰", "灰色", "银灰", "深灰", "gray", "grey", "silver gray", "dark gray"],
    blue: ["蓝", "蓝色", "水蓝", "淡蓝", "blue", "light blue"],
    green: ["绿", "绿色", "草绿", "豆绿", "green", "grass green", "bean green"],
    purple: ["紫", "紫色", "浅紫", "purple", "light purple"],
    pink: ["粉", "粉色", "浅粉", "粉红", "肉粉", "pink", "light pink", "nude pink"],
    red: ["红", "红色", "red"],
    khaki: ["浅卡", "卡其", "khaki", "light khaki"],
  };
  return Array.from(new Set([
    String(value || "").replace(/\s+/g, ""),
    colorName(value),
    ...(aliases[canonical] || []),
  ].filter(Boolean)));
}

function normalizeModelText(text) {
  return decodeHtmlEntities(text)
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
  if (!attrs.SpecialCraft && /厚薄|弹力|针数|柔软|细腻|高弹|橡筋|阻菌|抗菌|防臭|受力|均匀/i.test(source)) {
    attrs.SpecialCraft = translateProductDetailValue("SpecialCraft", source);
  }
  const textureScaleDetails = extractTextureScaleDetails(source);
  if (textureScaleDetails) {
    attrs.SpecialCraft = mergeDetailFeatureValues(attrs.SpecialCraft, textureScaleDetails);
  }
  return attrs;
}

function simplifySupplierTitle(title, context = "") {
  const combined = `${title} ${context}`;
  if (isYogaSockText(combined)) {
    return "women's non-slip five-toe yoga pilates socks";
  }
  if (isSockFamilyText(combined)) {
    return "women's no-show grip socks";
  }
  if (/咖啡滤纸|filter paper|coffee filter/i.test(combined)) {
    return "natural unbleached coffee paper filters";
  }
  return String(title || "")
    .replace(/\s*-\s*阿里巴巴\s*$/i, "")
    .replace(/批发|厂家|跨境|专用|女款|女/g, "")
    .replace(/瑜伽/g, "yoga ")
    .replace(/普拉提/g, "pilates ")
    .replace(/防滑/g, "non-slip ")
    .replace(/五指|五趾|分趾/g, "five-toe ")
    .replace(/袜子|袜/g, "socks ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractSupplierSkuOptions(text) {
  const decoded = decodeHtmlEntities(text);
  const options = [];
  const seen = new Set();

  const structuredPattern = /SKU_OPTION:\s*([^\n]+)/gi;
  for (const match of decoded.matchAll(structuredPattern)) {
    const parts = Object.fromEntries(match[1]
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
    return {
      text,
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
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(content.items.map((item) => item.str).join(" "));
  }
  return pages.join("\n");
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
  if (supplierTitle) return supplierTitle;
  const explicit = extractFirstMatch(text, [
    /(?:Product Name|产品名称|品名|商品名称)[:：]\s*([^。；;.\n|]{2,80})/i,
    /(?:Coffee Filters?|coffee filter paper|filter paper)/i,
  ]);
  if (explicit && /coffee|filter/i.test(explicit)) {
    return explicit.replace(/^[:：\s]+/, "");
  }
  if (isYogaSockText(text)) {
    return "non-slip five-toe yoga socks";
  }
  if (isSockFamilyText(text)) {
    return "women's no-show socks";
  }
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

function inferSellingPoints(text, material) {
  const attrs = supplierAttributeMap(text);
  if (isSockFamilyText(text)) {
    const specialCraft = attrs.SpecialCraft || "";
    const technology = attrs.Technology || "";
    return {
      feature1: /防滑|硅胶|non[-\s]?slip|grip|点胶/i.test(text)
        ? "non-slip grip sole"
        : "stable grip for yoga and pilates",
      feature2: /antibacterial|deodorizing|阻菌|抗菌|防臭/i.test(specialCraft)
        ? "antibacterial deodorizing comfort"
        : /elastic|高弹|橡筋/i.test(specialCraft)
          ? "high-elastic comfortable cuff"
          : /soft|柔软|细腻/i.test(specialCraft)
            ? "soft and delicate fabric texture"
            : /printed grip|胶印/i.test(technology)
              ? "printed anti-slip grip pattern"
              : /五指|五趾|分趾|toe/i.test(text)
        ? "five-toe separated design"
        : "breathable cotton comfort",
    };
  }
  const feature1 = /wood pulp|原木浆|unbleached|未漂白|natural/i.test(text)
    ? "natural unbleached material"
    : cleanFieldDisplayValue(material) || "primary product benefit";
  const feature2 = /filter|过滤|smooth|均匀|flow|brewing|萃取/i.test(text)
    ? "smooth filtration performance"
    : "reliable everyday brewing";
  return { feature1, feature2 };
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
  return attrs;
}

function stripInternalExtractionLines(text) {
  return String(text || "")
    .split(/\n+/)
    .filter((line) => !/^\s*(?:PRODUCT_ATTRIBUTE|SKU_OPTION|PRODUCT_TITLE|Source HTML file|Purchase order image OCR text)\s*:/i.test(line))
    .join("\n");
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
  if (isSock) return `${model} no-show socks`;
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
  const rowPattern = /(?:^|\s)([1-9]\d?)\s+(?=(?:阿里\s*)?[A-Z]{1,4}\d{2,5}\b)/gi;
  const rowMatches = Array.from(normalized.matchAll(rowPattern));
  if (!rowMatches.length) return [normalized];
  return rowMatches.map((match, index) => {
    const start = match.index || 0;
    const end = rowMatches[index + 1]?.index ?? normalized.length;
    return normalized.slice(start, end);
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

  return hints.sort((left, right) => left.sourceIndex - right.sourceIndex);
}

function extractGenericPurchaseItems(purchaseText, combinedText) {
  const source = normalizeModelText(purchaseText || "");
  if (!source || !/[A-Z]{1,4}\d{3,5}/i.test(source)) return [];

  const suppliers = supplierSkuMap(combinedText);
  const items = [];
  const seen = new Set();
  const usedSupplierOptions = new Set();
  const addItem = (item) => addGenericPurchaseItem(items, seen, usedSupplierOptions, suppliers, combinedText, item);
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

  if (colorHints.length > indexedRows.length) {
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

  colorHints.forEach((hint, index) => addItem({ ...hint, rowKey: `color-${index}`, allowSupplierColorFallback: true }));
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

function extractPurchaseItems(purchaseText, combinedText) {
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

  // Coffee filter purchase-order fallback:
  // when the uploaded sources clearly match this known product family,
  // force the six purchase specs that the user has already confirmed.
  if (items.length < 6 && /coffee filters|咖啡滤纸|V02|扇形02|扇形04|U02|#04/i.test(normalized)) {
    [
      { token: "V02", pack: "100 pcs box" },
      { token: "V02", pack: "200 pcs box" },
      { token: "fan 02", pack: "100 pcs box" },
      { token: "fan 02", pack: "200 pcs box" },
      { token: "fan 04", pack: "100 pcs box" },
      { token: "fan 04", pack: "200 pcs box" },
    ].forEach(({ token, pack }) => {
      const specInfo = productSpecForToken(token);
      const key = `${specInfo.key}-${pack}`;
      if (!seen.has(key)) {
        seen.add(key);
        items.push({ ...specInfo, pack });
      }
    });
  }

  if (!items.length) {
    return extractGenericPurchaseItems(purchaseText, combinedText);
  }

  return items;
}

function productUnitCountForItem(item, supplierText) {
  const optionText = [
    item.productUnitCount,
    item.pack,
    item.spec,
    item.size,
    item.color,
    item.supplierOption?.size,
    item.supplierOption?.color,
  ].filter(Boolean).join(" ");
  return extractProductUnitCount(optionText) || extractProductUnitCount(supplierText);
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
  if (isSockFamilyText(combined)) return "船袜";
  return stripSupplierModelCodes(cleanFieldDisplayValue(productName));
}

function crossBorderProductName(productName, context = "") {
  const combined = [productName, context].filter(Boolean).join(" ");
  if (isYogaSockText(combined)) return "five-toe yoga grip socks";
  if (isSockFamilyText(combined)) return "no-show grip socks";
  return toCrossBorderProductName(productName, "") || stripSupplierModelCodes(cleanFieldDisplayValue(productName));
}

function crossBorderColorName(item) {
  return cleanFieldDisplayValue(item?.colorEnglish || colorName(item?.color || item?.displayColor || ""));
}

function crossBorderVariantName(productName, item, fallback = "Product") {
  const baseName = promptValue(productName, fallback) || fallback;
  const size = cleanFieldDisplayValue(item.size || "");
  const parts = [
    crossBorderColorName(item),
    /^(?:均码|one size)$/i.test(size) ? "" : size,
    item.productUnitCount || "",
  ].filter(Boolean);
  return displayVariantText([baseName, ...parts].filter(Boolean).join(" - "));
}

function variantAttributeParts(item, productUnitCount = "") {
  const size = cleanFieldDisplayValue(item.size || "");
  return [
    item.displayColor || displayColorName(item.color, item.colorEnglish) || item.colorEnglish || colorName(item.color),
    /^(?:均码|one size)$/i.test(size) ? "" : size,
    productUnitCount,
  ].filter(Boolean);
}

function stripSupplierModelCodes(value) {
  return String(value || "")
    .replace(/\b[A-Z]{1,4}\d{2,5}\b/gi, " ")
    .replace(/\b[A-Z]{1,4}\d{2,4}\s+\d\b/gi, " ")
    .replace(/\s*-\s*-\s*/g, " - ")
    .replace(/\s+/g, " ")
    .replace(/^[\s,/-]+|[\s,/-]+$/g, "")
    .trim();
}

function displayVariantText(value) {
  return stripSupplierModelCodes(value);
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
    const rowKey = String(item.purchaseRowKey || item.rowKey || "").trim();
    if (rowKey) {
      if (seen.has(rowKey)) return false;
      seen.add(rowKey);
      return true;
    }
    const colorKey = canonicalColorKey(item.colorEnglish || item.color || item.spec || item.label || "");
    const size = cleanFieldDisplayValue(item.size || item.sizeCode || "");
    const pack = cleanFieldDisplayValue(item.pack || item.productUnitCount || "");
    const model = String(item.model || item.key || "").toUpperCase();
    const key = [model, colorKey, size, pack].filter(Boolean).join("|");
    if (!key) return true;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function inferProductsFromSources(purchaseText, supplierText, competitorText) {
  const combined = [purchaseText, supplierText, competitorText].join(" ");
  const supplierAttrs = supplierAttributeMap(supplierText);
  const productName = inferProductName(combined);
  const isYogaSockFamily = isYogaSockText(combined);
  const isSockFamily = isSockFamilyText(combined);
  const detailAttributes = supplierAttributeMap(supplierText);
  const material = detailAttributes.Material
    || (/wood pulp|原木浆|木浆|unbleached/i.test(combined)
    ? "natural wood pulp paper / unbleached brown paper"
    : /主面料成分["：:]*棉|棉|cotton/i.test(combined) || /棉|cotton/i.test(supplierAttrs.Material || "")
      ? translateAttributeValue("Material", supplierAttrs.Material) || "cotton blend fabric"
    : "");
  const color = isSockFamily ? "" : /brown|本色|原色|natural/i.test(combined) ? "natural brown" : "";
  const isCoffeeFilterFamily = /coffee filters|咖啡滤纸|V02|扇形02|扇形04|U02|#04/i.test(combined);
  const detailTechnology = detailAttributes.Technology || "";
  const detailSpecialCraft = detailAttributes.SpecialCraft || "";
  const structure = isSockFamily
      ? ["five-toe separated design", detailTechnology || "non-slip grip sole"].filter(Boolean).join(" with ")
    : /pressed|压边|压纹|fold|折边/i.test(combined) || isCoffeeFilterFamily
      ? "pressed side seam and bottom fold"
    : "";
  const scene = inferUseScene(combined);
  const sellingPoints = inferSellingPoints(combined, material);
  const dimensions = isSockFamily ? [] : extractDimensions(combined);
  const sizeOrRange = detailAttributes.Size
    || (isCoffeeFilterFamily ? extractFirstMatch(combined, [/([0-9]+\s*-\s*[0-9]+\s*(?:cups|人份))/i]) : "");
  const productUnitCount = extractProductUnitCount(supplierText);
  const cleanProductName = toCrossBorderProductName(productName, "");
  const displayName = displayProductName(cleanProductName || productName, combined) || cleanProductName;
  const outputName = crossBorderProductName(cleanProductName || productName, combined) || cleanProductName || displayName;
  const purchaseItems = extractPurchaseItems(purchaseText, combined);
  const variants = [];

  if (purchaseItems.length) {
    variants.push(...purchaseItems.map((item, index) => {
      const itemUnitCount = productUnitCountForItem(item, supplierText);
      const itemDisplayColor = displayColorName(item.displayColor || item.color, item.colorEnglish);
      const itemForOutput = { ...item, productUnitCount: itemUnitCount };
      return {
        id: `EXTRACTED-${index + 1}-${[item.colorEnglish || item.color, item.size, itemUnitCount].filter(Boolean).join("-").replace(/[^A-Z0-9]+/gi, "-") || "ITEM"}`,
        label: productVariantLabel(displayName, { ...item, displayColor: itemDisplayColor, productUnitCount: itemUnitCount }, `Product ${index + 1}`),
        outputLabel: crossBorderVariantName(outputName, itemForOutput, `Product ${index + 1}`),
        key: item.key,
        purchaseRowKey: item.purchaseRowKey || item.rowKey,
        model: item.model,
        color: item.color,
        displayColor: itemDisplayColor,
        colorEnglish: item.colorEnglish,
        size: item.size,
        productUnitCount: itemUnitCount,
        spec: productVariantName(displayName, { ...item, displayColor: itemDisplayColor, productUnitCount: itemUnitCount }, `Product ${index + 1}`),
        outputSpec: crossBorderVariantName(outputName, itemForOutput, `Product ${index + 1}`),
        sizeCode: variantAttributeParts(item, itemUnitCount).join(" / "),
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

  const normalizedVariants = variants.length ? disambiguateDuplicateLabels(dedupeExtractedVariants(variants)) : [{
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
    const itemProductName = displayProductName(cleanProductName || productName, combined) || toCrossBorderProductName(productName, item.spec);
    const itemOutputName = crossBorderProductName(cleanProductName || productName, combined) || toCrossBorderProductName(productName, item.outputSpec || item.spec);
    const itemForDisplay = { ...item, displayColor: itemDisplayColor, productUnitCount: item.productUnitCount || item.pack || productUnitCount };
    const itemForOutput = { ...item, productUnitCount: item.productUnitCount || item.pack || productUnitCount };
    const displaySpec = displayVariantText(item.spec || productVariantName(itemProductName, itemForDisplay, itemProductName || "selected product"));
    const outputSpec = displayVariantText(item.outputSpec || crossBorderVariantName(itemOutputName, itemForOutput, itemOutputName || "selected product"));
    const variantList = normalizedVariants
      .map((variant) => displayVariantText(variant.outputSpec || crossBorderVariantName(itemOutputName, { ...variant, productUnitCount }, itemOutputName || "product option")))
      .filter(Boolean)
      .join(" / ");
    const displaySizeCode = displayVariantText(item.outputSizeCode || outputSpec || item.sizeCode || item.spec || displaySpec);
    return {
    id: item.id,
    label: displayVariantText(item.outputLabel || outputSpec || item.label),
    displayLabel: displayVariantText(item.label),
    productName: itemOutputName,
    shape: outputSpec || displaySpec || item.spec,
    pack: item.pack || productUnitCount || "",
    sizeCode: displaySizeCode,
    groupKey: "",
    group: {
      promptName: outputSpec || displaySpec || displayVariantText(item.spec),
      promptSpecs: [outputSpec || displaySpec || displayVariantText(item.spec), itemCupRange, item.pack || productUnitCount, itemMaterial, itemStructure].filter(Boolean),
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
    material: itemMaterial,
    color: itemColor,
    structure: itemStructure,
    scene,
    feature1: sellingPoints.feature1,
    feature2: sellingPoints.feature2,
    surfaceFinish: detailTechnology,
    detailParameter: detailSpecialCraft,
    singleSpec: `[CURRENT_PRODUCT_OPTION: ${[outputSpec || displaySpec || displayVariantText(item.spec), item.pack || productUnitCount].filter(Boolean).join(", ")}]`,
    specList: `[SPEC_LIST: ${[outputSpec || displaySpec || displayVariantText(item.spec), itemCupRange, item.pack || productUnitCount, itemMaterial, itemStructure].filter(Boolean).join(" / ")}]`,
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
  if (sku.displayLabel && !data) return sku.displayLabel;
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
  return "Main image: do not add overlay text, titles, badges, labels, or captions; preserve authentic text or letters printed on the product/packaging; product occupies about 85% of the frame.";
}

function shortTextRule() {
  return "Added on-image text: use only short phrases of 3-5 words max; no dense added text, long sentences, or paragraph copy; preserve authentic product/packaging text.";
}

function humanSceneRule(facts) {
  const apparelRule = isApparelCategory(facts)
    ? "For apparel or wearable categories, use European/American Instagram-style lifestyle photography, clean premium styling, natural poses, and modern activewear/fashion mood."
    : "";
  return [
    "If any body, hands, feet, or wearing/usage model appears, use European/American models with natural realistic anatomy.",
    apparelRule,
  ].filter(Boolean).join(" ");
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
    return "Category background: coffee filter paper category, use a bright coffee brewing counter or light studio coffee setup with dripper/cup hints; paper texture and warm beige-white lighting; do not copy the metal basket scene.";
  }
  if (/basket|portafilter|espresso|stainless|steel|metal|304/.test(combined)) {
    return "Category background: espresso metal accessory category, use a clean marble coffee bar with soft espresso-machine and cup props, matching the reference mood without copying its exact product.";
  }
  if (/kitchen|cup|mug|bottle|jar|container/.test(combined)) {
    return "Category background: kitchenware category, use a bright kitchen or studio countertop with subtle matching props, realistic light, uncluttered composition.";
  }
  if (/sock|socks|toe|grip|pilates|yoga|barre|瑜伽|普拉提|袜/.test(combined)) {
    return "Category background: premium yoga and pilates lifestyle setting, bright studio floor or calm home workout space, soft natural light, refined wellness props, clean high-end activewear mood.";
  }
  return "Category background: choose surface, props, and color mood from the product category; keep it realistic, light, uncluttered, and suitable for Amazon listing images.";
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
  const extraIncludesMaterial = facts.material && extraText.includes(comparablePromptItem(facts.material));
  const extraIncludesStructure = facts.structure && extraText.includes(comparablePromptItem(facts.structure));
  const extraIncludesColor = facts.color && extraText.includes(comparablePromptItem(facts.color));
  return compactSpecificPromptItems([
    `Product: ${facts.productName}`,
    option && `Current option: ${option}`,
    facts.color && !extraIncludesColor && `Color: ${facts.color}`,
    ...extraItems,
    facts.material && !extraIncludesMaterial && `Material: ${facts.material}`,
    facts.cupRange && `Size / range: ${facts.cupRange}`,
    facts.pack && `Count / set: ${facts.pack}`,
    facts.structure && !extraIncludesStructure && `Structure: ${facts.structure}`,
    facts.surfaceFinish && !structureIncludesTechnology && `Technology: ${facts.surfaceFinish}`,
    visibleDetailParameter(facts.detailParameter) && `Texture detail: ${visibleDetailParameter(facts.detailParameter)}`,
  ], "", limit);
}

function overallStyleText(facts, typeId, extra = "") {
  return compactPromptItems([
    categoryStyleRule(facts),
    humanSceneRule(facts),
    typeId === "1" ? "" : shortTextRule(),
    referenceRuleText(),
    extra,
  ], "", 6);
}

function buildPromptSections({ facts, templateId, typeId, basic = "", details = "", style = "", negative = "" }) {
  return [
    promptSection("Basic Image Requirements", basic || basicImageRequirements(templateId, typeId)),
    promptSection("Product Details", details || productDetailText(facts)),
    promptSection("Overall Style", style || overallStyleText(facts, typeId)),
    promptSection("Negative Prompt", negative || negativePrompt()),
  ].join("\n");
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
  const featureLabels = compactPromptItems([facts.feature1, facts.feature2, facts.material, facts.structure], "verified benefits", 4);
  const sceneUse = compactPromptItems([facts.scene, facts.fit], "realistic use scene", 3);

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
      style: overallStyleText(facts, "4", "Clean size reference layout; added title can be \"Size Reference\"; no unverified measurements; preserve authentic product markings."),
    },
    "5": {
      basic: basicImageRequirements("spec", "5"),
      details: productDetailText(facts, [`Verified options: ${compactVariantText(facts)}`], 7),
      style: overallStyleText(facts, "5", "Product option comparison grid; show only verified options; small added option tags only; preserve authentic product markings."),
    },
    "6": {
      basic: basicImageRequirements("spec", "6"),
      details: productDetailText(facts, [`Selling point: ${facts.feature1}`], 6),
      style: overallStyleText(facts, "6", "Focused proof image using product close-up or realistic use evidence; one short added headline maximum."),
    },
    "7": {
      basic: basicImageRequirements("spec", "7"),
      details: productDetailText(facts, [`Macro focus: ${detailTextureText(facts, "material or structure")}`], 7),
      style: overallStyleText(facts, "7", "Macro close-up detail; sharp texture, clean edges, optional small magnifier inset."),
    },
    "8": {
      basic: basicImageRequirements("spec", "8"),
      details: productDetailText(facts, [`Summary points: ${compactPromptItems([...summarySideLabels, ...summaryBottomLabels], featureLabels, 4)}`], 8),
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

function sceneNegativePrompt() {
  return "No wrong product, fake packaging, unsupported claims, unrelated overlay info, dense added text, added logos, added watermark, blur, low-resolution output, cluttered background, hidden product, tiny product, distant shot, forced display pose, floating product, extreme macro crop, scene context cropped out, background blurred into abstract shapes, distorted product shape, incorrect product details, or props/model/environment competing with the product; preserve authentic product markings, printed letters, woven labels, and packaging text.";
}

function sceneQualityRule() {
  return "Product-first premium lifestyle image. The product is the clearest main subject, shown in a natural real-use moment and integrated with the environment rather than isolated as a forced display. Use close-up or medium-close 3/4 lifestyle composition, with accurate material, color, structure, surface texture, functional details, scale, and use context clearly visible. Product edges must be crisp, with soft natural light, realistic contact shadows, and moderate shallow depth of field: the background is softly blurred but still recognizable as a clean category-matched scene. Keep props, people, and environment secondary.";
}

function sceneTextureLine(facts) {
  const texture = visibleTextureDetails(facts);
  return `Texture: ${texture}; realistic surface detail, clean edges, natural shadows.`;
}

function sceneModulePrompt(typeId, facts) {
  const physicalDetails = compactSpecificPromptItems([
    facts.structure,
    facts.material,
    facts.color,
  ], "visible product structure, material texture, and true color", 3);
  const sceneList = compactSpecificPromptItems([
    facts.scene,
    facts.fit,
  ], "verified realistic use scenes", 3);
  const mainScene = compactSpecificPromptItems([facts.scene, facts.fit], "a realistic premium category scene", 2);
  const feature1 = specificPromptValue(facts.feature1, "the primary verified benefit");
  const feature2 = specificPromptValue(facts.feature2, "the secondary verified benefit");
  const summaryPoints = compactSpecificPromptItems([
    facts.fit || facts.scene,
    facts.feature1,
    facts.feature2,
    facts.material,
    facts.structure,
  ], "main scene / multi-use / key selling points", 4);
  const themeBackground = categoryStyleRule(facts);

  const modules = {
    "1": {
      basic: basicImageRequirements("scene", "1"),
      details: productDetailText(facts, [mainScene, visibleTextureDetails(facts)], 7),
      style: overallStyleText(facts, "1", `Premium scene-based hero in ${mainScene}; refined theme-matched background, natural depth; no added overlay text; keep authentic product markings.`),
    },
    "2": {
      basic: basicImageRequirements("scene", "2"),
      details: productDetailText(facts, [sceneList], 6),
      style: overallStyleText(facts, "2", `3-4 elegant panels for ${sceneList}; each panel shows a different realistic use moment.`),
    },
    "3": {
      basic: basicImageRequirements("scene", "3"),
      details: productDetailText(facts, [physicalDetails, visibleTextureDetails(facts)], 7),
      style: overallStyleText(facts, "3", "Front, side, back/top, and one macro detail view on a premium light studio background; product remains the focus."),
    },
    "4": {
      basic: basicImageRequirements("scene", "4"),
      details: productDetailText(facts, [compactSpecificPromptItems([facts.fit, physicalDetails], "core use and product detail", 3)], 7),
      style: overallStyleText(facts, "4", "Product centered with 2-3 concise added callout labels; keep explanation visual and easy to scan; preserve authentic product markings."),
    },
    "5": {
      basic: basicImageRequirements("scene", "5"),
      details: productDetailText(facts, [`Selling point: ${feature1}`, visibleTextureDetails(facts)], 7),
      style: overallStyleText(facts, "5", "Focused premium proof scene using product close-up or in-use evidence; one short added headline maximum."),
    },
    "6": {
      basic: basicImageRequirements("scene", "6"),
      details: productDetailText(facts, [`Selling point: ${feature2}`], 6),
      style: overallStyleText(facts, "6", "Distinct premium proof scene; composition must differ from Image 5; one short added headline maximum."),
    },
    "7": {
      basic: basicImageRequirements("scene", "7"),
      details: productDetailText(facts, [`Summary points: ${summaryPoints}`], 8),
      style: overallStyleText(facts, "7", "Premium scene-based overview with product centered and 3-4 verified added points; no added specification table; preserve authentic product markings."),
    },
  };
  const selected = modules[typeId] || modules["1"];

  return buildPromptSections({
    facts,
    templateId: "scene",
    typeId,
    basic: selected.basic,
    details: selected.details,
    style: compactPromptItems([themeBackground, sceneQualityRule(), selected.style], "", 8),
    negative: sceneNegativePrompt(),
  });
}

function sceneTemplatePrompt(typeId, sku, data) {
  const facts = promptFacts(sku, data);
  return sceneModulePrompt(typeId, facts);
}

function featureModulePrompt(typeId, facts) {
  const sceneUse = compactPromptItems([facts.scene, facts.fit], "realistic use scene", 3);
  const optionText = compactSkuOptionText(facts.skuOption || shortOptionText(facts), facts);
  const modules = {
    "1": {
      basic: basicImageRequirements("feature", "1"),
      details: productDetailText(facts, [optionText, facts.color], 6),
      style: overallStyleText(facts, "1", "Pure white Amazon main image; product only; no props, no added title, no added labels; preserve authentic product markings."),
    },
    "2": {
      basic: basicImageRequirements("feature", "2"),
      details: productDetailText(facts, [sceneUse], 6),
      style: overallStyleText(facts, "2", "Single realistic lifestyle scene; product-first composition; one short added headline only if needed."),
    },
    "3": {
      basic: basicImageRequirements("feature", "3"),
      details: productDetailText(facts, [sceneUse], 6),
      style: overallStyleText(facts, "3", "4-6 panel multi-scene collage; clean grid; short added labels only; preserve authentic product markings."),
    },
    "4": {
      basic: basicImageRequirements("feature", "4"),
      details: productDetailText(facts, [detailTextureText(facts), facts.color], 7),
      style: overallStyleText(facts, "4", "Catalog product display with multiple views plus one detail close-up; minimal added overlay text; preserve authentic product markings."),
    },
    "5": {
      basic: basicImageRequirements("feature", "5"),
      details: productDetailText(facts, [`Verified options: ${compactVariantText(facts)}`], 7),
      style: overallStyleText(facts, "5", "Product option selection grid; show only available verified variants; no unavailable colors or sizes."),
    },
    "6": {
      basic: basicImageRequirements("feature", "6"),
      details: productDetailText(facts, [`Selling point: ${facts.feature1}`], 6),
      style: overallStyleText(facts, "6", "Single selling-point proof image; product close-up or realistic use evidence; one short added headline maximum."),
    },
    "7": {
      basic: basicImageRequirements("feature", "7"),
      details: productDetailText(facts, [`Selling point: ${facts.feature2}`], 6),
      style: overallStyleText(facts, "7", "Second selling-point proof image; composition must differ from Image 6; no unsupported claims."),
    },
    "8": {
      basic: basicImageRequirements("feature", "8"),
      details: productDetailText(facts, [`Summary points: ${compactPromptItems([facts.feature1, facts.feature2, facts.fit], "verified benefits", 4)}`], 8),
      style: overallStyleText(facts, "8", "Summary image with product centered and 3-4 verified added callouts; no added specification table; preserve authentic product markings."),
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
