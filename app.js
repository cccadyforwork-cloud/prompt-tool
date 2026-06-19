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
const OCR_IMAGE_LIMIT = 12;
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
  byId("skuSelect").innerHTML = products.map((sku) => `<option value="${sku.id}">${escapeHtml(sku.label)}</option>`).join("");
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
  return cleanTokenValue(raw);
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
      topWidth: sku.dims?.topWidth || values.topWidth || "",
      sideLength: sku.dims?.sideLength || values.sideLength || "",
      bottomWidth: sku.dims?.bottomWidth || values.bottomWidth || "",
      weight: sku.dims?.weight || values.weight || "",
    };

    if (isSelected || !existing.cupRange) {
      existing.cupRange = sku.dims?.cupRange || extractFirstMatch((values.specList || sku.fit || ""), [/([0-9]+\s*-\s*[0-9]+\s*(?:cups|cup|人份))/i]);
    }
    if (isSelected || !existing.fit) existing.fit = cleanTokenValue(values.fit);
    if (isSelected || !existing.material) existing.material = cleanTokenValue(values.material);
    if (isSelected || !existing.topWidth) existing.topWidth = values.topWidth || sku.dims?.topWidth || "";
    if (isSelected || !existing.sideLength) existing.sideLength = values.sideLength || sku.dims?.sideLength || "";
    if (isSelected || !existing.bottomWidth) existing.bottomWidth = values.bottomWidth || sku.dims?.bottomWidth || "";
    if (isSelected || !existing.weight) existing.weight = values.weight || sku.dims?.weight || "";
    groups.set(groupKey, existing);
  });

  return Array.from(groups.values());
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
      ["Capacity / Range", row.cupRange],
      ["Compatible Use / Scene", row.fit],
      ["Material", row.material],
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
  const doc = new DOMParser().parseFromString(html, "text/html");
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

function addImageUrl(urls, seen, value) {
  const normalized = normalizeImageUrl(value);
  if (!normalized || seen.has(normalized)) return;
  if (!/\.(?:jpe?g|png|webp)(?:[?#]|$)/i.test(normalized)) return;
  if (!/alicdn|cbu01|itemcdn|taobao|tmall/i.test(normalized)) return;
  if (/\.(?:gif|svg)(?:[?#]|$)/i.test(normalized)) return;
  if (/(?:logo|icon|avatar|sprite|loading|blank|placeholder|qrcode|qr-code)/i.test(normalized)) return;
  if (/(?:^|[_-])(?:20|30|40|50|60|70|80)x(?:20|30|40|50|60|70|80)(?:[_\-.]|$)/i.test(normalized)) return;
  if (/[?&](?:w|width|h|height)=(?:[1-9]|[1-9]\d)(?:&|$)/i.test(normalized)) return;
  seen.add(normalized);
  urls.push(normalized);
}

function extractSrcsetUrls(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim().split(/\s+/)[0])
    .filter(Boolean);
}

function extractImageUrlsFromHtml(html) {
  const urls = [];
  const seen = new Set();
  const doc = new DOMParser().parseFromString(html, "text/html");
  const imageAttrs = ["src", "data-src", "data-original", "data-lazy-src", "data-img", "original", "imageurl", "imageUrl"];
  const srcsetAttrs = ["srcset", "data-srcset"];

  doc.querySelectorAll("img, source").forEach((node) => {
    imageAttrs.forEach((attr) => addImageUrl(urls, seen, node.getAttribute(attr)));
    srcsetAttrs.forEach((attr) => {
      extractSrcsetUrls(node.getAttribute(attr)).forEach((url) => addImageUrl(urls, seen, url));
    });
  });

  const urlPattern = /(?:https?:\\?\/\\?\/|\/\/)[^"'<>\s\\]+?\.(?:jpe?g|png|webp)(?:\?[^"'<>\s\\]*)?/gi;
  for (const match of html.matchAll(urlPattern)) {
    addImageUrl(urls, seen, match[0]);
  }

  return urls.slice(0, OCR_IMAGE_LIMIT);
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
      if (url && !seen.has(url)) {
        seen.add(url);
        urls.push(url);
      }
    }
  });

  return urls.slice(0, 2);
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

function uniqueImageUrls(...groups) {
  const urls = [];
  const seen = new Set();
  groups.flat().forEach((url) => {
    const normalized = normalizeImageUrl(url);
    if (!normalized || seen.has(normalized)) return;
    seen.add(normalized);
    urls.push(normalized);
  });
  return urls.slice(0, OCR_IMAGE_LIMIT);
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

function decodeHtmlEntities(value) {
  return String(value || "")
    .replace(/&gt;/gi, ">")
    .replace(/&lt;/gi, "<")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'");
}

function colorName(rawColor) {
  const clean = String(rawColor || "").replace(/[()（）百人复购\s]/g, "").trim();
  const colorMap = {
    白色: "white",
    草绿: "grass green",
    绿色: "green",
    蓝色: "blue",
    水蓝: "light blue",
    淡蓝: "light blue",
    紫色: "purple",
    浅紫: "light purple",
    黑色: "black",
    粉色: "pink",
    浅粉: "light pink",
    粉红: "pink",
    红色: "red",
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

function normalizeModelText(text) {
  return decodeHtmlEntities(text)
    .replace(/([A-Z]{1,4}\d{2})\s+(\d)(?=[\u4e00-\u9fff])/g, "$1$2")
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

function simplifySupplierTitle(title, context = "") {
  const combined = `${title} ${context}`;
  if (/瑜伽袜|普拉提|五指袜|五趾袜|分趾袜|toe socks|grip socks|pilates|yoga/i.test(combined)) {
    return "women's non-slip five-toe yoga pilates socks";
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

function canLoadImage(url) {
  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = url;
  });
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
    return { text: "", scannedCount: 0, failedCount: 0, available: false };
  }

  let Tesseract;
  try {
    Tesseract = await loadOcrEngine();
  } catch {
    return { text: "", scannedCount: 0, failedCount: imageUrls.length, available: false };
  }

  const texts = [];
  let failedCount = 0;
  for (let index = 0; index < imageUrls.length; index += 1) {
    const url = imageUrls[index];
    onProgress?.(`正在识别 1688 详情图文字... ${index + 1}/${imageUrls.length}`);
    try {
      const canLoad = await withTimeout(canLoadImage(url), 10000, "Image load timed out");
      if (!canLoad) {
        failedCount += 1;
        continue;
      }
      const result = await withTimeout(
        Tesseract.recognize(url, "chi_sim+eng"),
        30000,
        "OCR timed out",
      );
      const text = cleanOcrText(result?.data?.text || "");
      if (text) texts.push(text);
    } catch {
      failedCount += 1;
    }
  }

  return {
    text: texts.join("\n"),
    scannedCount: imageUrls.length - failedCount,
    failedCount,
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
    return { text: "", imageCount: 0, scannedCount: 0, failedCount: 0, ocrAvailable: false };
  }

  const baseText = cleanHtmlText(html);
  const structuredText = extractSupplierStructuredText(html);
  const detailUrls = extractDetailUrlsFromHtml(html);
  const detailHtml = detailUrls.length ? await fetchDetailHtml(detailUrls, onProgress) : "";
  const imageUrls = uniqueImageUrls(
    extractImageUrlsFromHtml(html),
    detailHtml ? extractImageUrlsFromHtml(detailHtml) : [],
  );
  if (!imageUrls.length) {
    return { text: [baseText, structuredText].filter(Boolean).join("\n"), imageCount: 0, scannedCount: 0, failedCount: 0, ocrAvailable: false };
  }

  onProgress?.(`已找到 ${imageUrls.length} 张 1688 图片，正在尝试 OCR 识别详情图文字...`);
  const ocr = await ocrImageUrls(imageUrls, onProgress);
  return {
    text: [baseText, structuredText, cleanHtmlText(detailHtml), ocr.text && `1688 image OCR text: ${ocr.text}`].filter(Boolean).join("\n"),
    imageCount: imageUrls.length,
    scannedCount: ocr.scannedCount,
    failedCount: ocr.failedCount,
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
  if (/瑜伽袜|普拉提|五指袜|分趾袜|yoga|pilates|toe socks|grip socks/i.test(text)) {
    return "non-slip five-toe yoga socks";
  }
  return "";
}

function inferUseScene(text) {
  if (/V60|dripper|pour over|手冲|挂耳|滤杯/i.test(text)) {
    return "pour-over coffee brewing / drip coffee maker setup";
  }
  if (/瑜伽|普拉提|pilates|yoga|barre|dance|workout|hospital|barefoot/i.test(text)) {
    return "yoga / pilates / barre / home workout";
  }
  if (/kitchen|home & kitchen|厨房/i.test(text)) {
    return "home kitchen use";
  }
  return "";
}

function inferSellingPoints(text, material) {
  if (/瑜伽袜|普拉提|五指袜|分趾袜|toe socks|grip socks|防滑|硅胶|silicone|pilates|yoga/i.test(text)) {
    return {
      feature1: /防滑|硅胶|non[-\s]?slip|grip|点胶/i.test(text)
        ? "non-slip grip sole"
        : "stable grip for yoga and pilates",
      feature2: /五指|五趾|分趾|toe/i.test(text)
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
  for (const match of String(text || "").matchAll(/PRODUCT_ATTRIBUTE:\s*([^=\n]+)=([^\n]+)/gi)) {
    attrs[match[1].trim()] = match[2].trim();
  }
  return attrs;
}

function genericProductSpecForModel(model, combinedText) {
  const isYogaSock = /瑜伽袜|普拉提|五指袜|分趾袜|toe socks|grip socks|pilates|yoga/i.test(combinedText);
  return isYogaSock ? `${model} five-toe yoga grip socks` : `${model} product`;
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
  return leftRaw === rightRaw || colorName(leftRaw).toLowerCase() === colorName(rightRaw).toLowerCase();
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
  const fallbackOption = selectSupplierOption(supplierOptions, color, usedSupplierOptions);
  const supplierColorIsSafe = allowSupplierColorFallback || supplierOptions.length === 1;
  const finalColor = color || (supplierColorIsSafe ? fallbackOption.color : "") || "";
  const finalSize = size || fallbackOption.size || "";
  const optionKey = `${fallbackOption.model || normalizedModel}-${fallbackOption.color || ""}-${fallbackOption.size || ""}`;
  const key = rowKey || `${normalizedModel}-${finalColor || items.length}-${quantity || ""}`;
  if (seen.has(key)) return;
  seen.add(key);
  if (fallbackOption.model) usedSupplierOptions.add(optionKey);
  const rowLabel = !finalColor && /^row-\d+$/i.test(rowKey) ? `purchase ${rowKey.replace("row-", "row ")}` : "";
  items.push({
    key: normalizedModel.toLowerCase(),
    model: normalizedModel,
    color: finalColor,
    colorEnglish: finalColor ? colorName(finalColor) || fallbackOption.colorEnglish || "" : "",
    spec: [colorName(finalColor) || finalColor, cleanFieldDisplayValue(finalSize), rowLabel].filter(Boolean).join(" / "),
    sizeCode: [colorName(finalColor) || finalColor, cleanFieldDisplayValue(finalSize), rowLabel].filter(Boolean).join(" / "),
    pack: unitCount || "",
    productUnitCount: unitCount || "",
    quantity,
    price,
    fit: /瑜伽袜|普拉提|五指袜|分趾袜|toe socks|grip socks|pilates|yoga/i.test(combinedText)
      ? "yoga, pilates, barre, dance, home workout"
      : "",
    dims: fallbackOption.dims || {},
    supplierOption: fallbackOption,
    inferredColorFromSupplier: !color && Boolean(finalColor),
  });
}

function extractIndexedPurchaseRows(source) {
  const items = [];
  const seenRows = new Set();
  const rowPattern = /(?:^|\s)([1-9]\d?)\s+([A-Z]{1,4}\d{3,5})(?:-[A-Z]{1,4}\d{3,5})?(?:\s+([A-Z]{1,4}\d{3,5}))?[\s\S]{0,90}?([1-9]\d*)\s+[0-9]+(?:\.[0-9]+)?\s*\/\s*[-+]?[0-9]+(?:\.[0-9]+)?\s+[0-9]+(?:\.[0-9]+)?/gi;
  for (const match of source.matchAll(rowPattern)) {
    const rowNumber = match[1];
    if (seenRows.has(rowNumber)) continue;
    seenRows.add(rowNumber);
    items.push({
      rowKey: `row-${rowNumber}`,
      model: match[3] || match[2],
      quantity: match[4],
      unitCount: extractProductUnitCount(match[0]),
    });
  }
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
  const clean = String(value || "").replace(/\s+/g, "");
  const aliases = {
    白色: ["白色", "本全", "本色"],
    蓝色: ["蓝色", "蓝"],
    紫色: ["紫色", "紫"],
    草绿: ["草绿"],
    绿色: ["绿色", "绿"],
    黑色: ["黑色", "黑"],
    粉色: ["粉色", "粉"],
    深灰: ["深灰"],
    灰色: ["灰色", "灰"],
  };
  return Array.from(new Set([clean, ...(aliases[clean] || [])]))
    .filter(Boolean)
    .map((alias) => looseSequencePattern(alias));
}

function purchaseSegmentQuantity(segment, matchedText) {
  const index = String(segment || "").indexOf(matchedText || "");
  const tail = index > -1 ? String(segment).slice(index + String(matchedText || "").length) : String(segment || "");
  return tail.match(/^\s*([1-9]\d*)\s+[0-9]+(?:\.[0-9]+)?/)?.[1] || "";
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
  const rowMatches = Array.from(normalized.matchAll(/(?:^|\s)([1-9]\d?)\s+(?=(?:阿里)?[A-Z]{1,4}\d{2,5}|[^\s]{0,24}颜色\s*[:：])/gi));
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
      size: matched.option.size || "",
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
      size: match[3],
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
    if (!matched?.option) return;
    if (hints.some((hint) => hint.model === matched.option.model && isSameColorName(hint.color, matched.option.color))) return;
    hints.push({
      model: matched.option.model,
      color: matched.option.color,
      size: extractFirstMatch(segment, [/尺码\s*[:：]\s*([\u4e00-\u9fffA-Za-z0-9 -]{1,20})/i]) || matched.option.size || "",
      quantity: purchaseSegmentQuantity(segment, matched.text),
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

  if (indexedRows.length && colorHints.length) {
    const usedHints = new Set();
    indexedRows.forEach((row) => {
      let hintIndex = colorHints.findIndex((hint, index) => !usedHints.has(index) && hint.rowKey === row.rowKey);
      if (hintIndex < 0) hintIndex = colorHints.findIndex((hint, index) => !usedHints.has(index));
      const sequenceHint = hintIndex > -1 ? colorHints[hintIndex] : null;
      const hint = sequenceHint || rowHints.find((candidate) => candidate.rowKey === row.rowKey);
      if (hintIndex > -1) usedHints.add(hintIndex);
      addItem({
        ...row,
        color: hint?.color || "",
        size: hint?.size || row.size || "",
        quantity: row.quantity || hint?.quantity || "",
        unitCount: hint?.unitCount || row.unitCount || "",
        allowSupplierColorFallback: Boolean(hint?.color),
      });
    });
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

  indexedRows.forEach((row) => addItem(row));
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

function variantAttributeParts(item, productUnitCount = "") {
  const size = cleanFieldDisplayValue(item.size || "");
  return [
    item.colorEnglish || colorName(item.color),
    /^(?:均码|one size)$/i.test(size) ? "" : size,
    productUnitCount,
  ].filter(Boolean);
}

function productVariantName(productName, item, fallback = "Product") {
  const baseName = promptValue(productName, fallback) || fallback;
  const parts = variantAttributeParts(item, item.productUnitCount || "");
  return [baseName, ...parts].filter(Boolean).join(" - ");
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

function inferProductsFromSources(purchaseText, supplierText, competitorText) {
  const combined = [purchaseText, supplierText, competitorText].join(" ");
  const supplierAttrs = supplierAttributeMap(supplierText);
  const productName = inferProductName(combined);
  const isYogaSockFamily = /瑜伽袜|普拉提|五指袜|分趾袜|toe socks|grip socks|pilates|yoga/i.test(combined);
  const material = /wood pulp|原木浆|木浆|unbleached/i.test(combined)
    ? "natural wood pulp paper / unbleached brown paper"
    : /主面料成分["：:]*棉|棉|cotton/i.test(combined) || /棉|cotton/i.test(supplierAttrs.Material || "")
      ? "cotton blend fabric"
    : "";
  const color = isYogaSockFamily ? "" : /brown|本色|原色|natural/i.test(combined) ? "natural brown" : "";
  const isCoffeeFilterFamily = /coffee filters|咖啡滤纸|V02|扇形02|扇形04|U02|#04/i.test(combined);
  const structure = isYogaSockFamily
      ? "five-toe separated design with non-slip grip sole"
    : /pressed|压边|压纹|fold|折边/i.test(combined) || isCoffeeFilterFamily
      ? "pressed side seam and bottom fold"
    : "";
  const scene = inferUseScene(combined);
  const sellingPoints = inferSellingPoints(combined, material);
  const dimensions = extractDimensions(combined);
  const cupRange = extractFirstMatch(combined, [/([0-9]+\s*-\s*[0-9]+\s*(?:cups|人份))/i]);
  const productUnitCount = extractProductUnitCount(supplierText);
  const cleanProductName = toCrossBorderProductName(productName, "");
  const purchaseItems = extractPurchaseItems(purchaseText, combined);
  const variants = [];

  if (purchaseItems.length) {
    variants.push(...purchaseItems.map((item, index) => {
      const itemUnitCount = productUnitCountForItem(item, supplierText);
      return {
        id: `EXTRACTED-${index + 1}-${[item.colorEnglish || item.color, item.size, itemUnitCount].filter(Boolean).join("-").replace(/[^A-Z0-9]+/gi, "-") || "ITEM"}`,
        label: productVariantLabel(cleanProductName, { ...item, productUnitCount: itemUnitCount }, `Product ${index + 1}`),
        key: item.key,
        model: item.model,
        color: item.color,
        colorEnglish: item.colorEnglish,
        size: item.size,
        productUnitCount: itemUnitCount,
        spec: productVariantName(cleanProductName, { ...item, productUnitCount: itemUnitCount }, `Product ${index + 1}`),
        sizeCode: variantAttributeParts(item, itemUnitCount).join(" / "),
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

  const normalizedVariants = variants.length ? disambiguateDuplicateLabels(variants) : [{
    id: "EXTRACTED-PRODUCT-1",
    label: cleanProductName || "Product 1",
    spec: "",
    sizeCode: "",
    pack: productUnitCount || "",
    fit: "",
  }];

  return normalizedVariants.map((item) => {
    const itemCupRange = inferCupRangeForSpec(combined, item) || item.cupRange || cupRange || "";
    const fallbackDimensions = fallbackDimensionsForSpec(item, combined);
    const itemDimensions = [
      item.dims?.topWidth && `Length: ${item.dims.topWidth}`,
      item.dims?.sideLength && `Width: ${item.dims.sideLength}`,
      item.dims?.bottomWidth && `Height: ${item.dims.bottomWidth}`,
      item.dims?.weight && `Weight: ${item.dims.weight}`,
    ].filter(Boolean);
    const dimensionList = dimensions.length
      ? `[VERIFIED_DIMENSIONS: ${dimensions.join("; ")}]`
      : itemDimensions.length
        ? `[VERIFIED_DIMENSIONS: ${itemDimensions.join("; ")}]`
        : fallbackDimensions.dimensionList || "";
    const itemColor = item.colorEnglish || colorName(item.color) || color;
    const itemMaterial = material;
    const itemStructure = structure;
    const itemProductName = cleanProductName || toCrossBorderProductName(productName, item.spec);
    const displaySpec = item.spec || productVariantName(itemProductName, { ...item, colorEnglish: itemColor, productUnitCount }, itemProductName || "selected product");
    const variantList = normalizedVariants
      .map((variant) => variant.spec || productVariantName(itemProductName, { ...variant, productUnitCount }, itemProductName || "product option"))
      .filter(Boolean)
      .join(" / ");
    return {
    id: item.id,
    label: item.label,
    productName: itemProductName,
    shape: displaySpec || item.spec,
    pack: item.pack || productUnitCount || "",
    sizeCode: item.sizeCode || item.spec,
    groupKey: "",
    group: {
      promptName: displaySpec || item.spec,
      promptSpecs: [displaySpec || item.spec, itemCupRange, item.pack || productUnitCount, itemMaterial, itemStructure].filter(Boolean),
      dimensions: dimensions.length ? dimensions : itemDimensions,
    },
    dims: {
      topWidth: extractFirstMatch(dimensions.join("; "), [/Top Width:\s*([^;]+)/i]) || item.dims?.topWidth || fallbackDimensions.topWidth || "",
      sideLength: extractFirstMatch(dimensions.join("; "), [/Side Length:\s*([^;]+)/i]) || item.dims?.sideLength || fallbackDimensions.sideLength || "",
      bottomWidth: extractFirstMatch(dimensions.join("; "), [/Bottom Width:\s*([^;]+)/i]) || item.dims?.bottomWidth || fallbackDimensions.bottomWidth || "",
      weight: extractFirstMatch(dimensions.join("; "), [/Weight:\s*([^;]+)/i]) || item.dims?.weight || fallbackDimensions.weight || "",
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
    singleSpec: `[CURRENT_PRODUCT_OPTION: ${[displaySpec || item.spec, item.pack || productUnitCount].filter(Boolean).join(", ")}]`,
    specList: `[SPEC_LIST: ${[displaySpec || item.spec, itemCupRange, item.pack || productUnitCount, itemMaterial, itemStructure].filter(Boolean).join(" / ")}]`,
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
      ? `1688 图片 OCR：找到 ${supplierSource.imageCount} 张，成功 ${supplierSource.scannedCount} 张，跳过/失败 ${supplierSource.failedCount} 张。远程图片可能因跨域、防盗链或超时无法在浏览器内识别。`
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
  return "No invented specs, wrong product, logos, watermark, clutter, blur.";
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

function categoryStyleRule(facts) {
  const combined = [
    facts.productName,
    facts.titleSpec,
    facts.cupType,
    facts.material,
    facts.fit,
    facts.scene,
  ].join(" ").toLowerCase();

  if (/filter|滤纸|paper|pulp|wood pulp|dripper|pour-over|pour over/.test(combined)) {
    return "Category background: coffee filter paper category, use a bright coffee brewing counter or light studio coffee setup with dripper/cup hints; paper texture and warm beige-white lighting; do not copy the metal basket scene.";
  }
  if (/basket|portafilter|espresso|stainless|steel|metal|304/.test(combined)) {
    return "Category background: espresso metal accessory category, use a clean marble coffee bar with soft espresso-machine and cup props, matching the reference mood without copying its exact product.";
  }
  if (/kitchen|cup|mug|bottle|jar|container/.test(combined)) {
    return "Category background: kitchenware category, use a bright kitchen or studio countertop with subtle matching props, realistic light, uncluttered composition.";
  }
  return "Category background: choose surface, props, and color mood from the product category; keep it realistic, light, uncluttered, and suitable for Amazon listing images.";
}

function sizeReferenceRule(facts) {
  return `${specModulePrompt("4", facts)}\n${specGlobalRules()}`;
}

function hardRules(extra = "") {
  return `Rules: 1:1 Amazon image; match reference; verified info only.${extra ? ` ${extra}` : ""}`;
}

function promptLine(style, params, rules = "") {
  return [`Image: ${style}`, `Product: ${params}`, hardRules(rules)].join("\n");
}

function compactPromptItems(items, fallback = "", limit = 5) {
  const cleanItems = uniquePromptItems(items)
    .map((item) => cleanTokenValue(item))
    .filter(Boolean);
  const selected = [];
  cleanItems.forEach((item) => {
    const lower = comparablePromptItem(item);
    const existingIndex = selected.findIndex((existing) => {
      const existingLower = comparablePromptItem(existing);
      return lower.includes(existingLower) || existingLower.includes(lower);
    });
    if (existingIndex > -1) {
      if (item.length > selected[existingIndex].length) selected[existingIndex] = item;
      return;
    }
    selected.push(item);
  });
  return selected.length ? selected.slice(0, limit).join(" / ") : fallback;
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

function productPromptLine(facts) {
  const option = shortOptionText(facts);
  return `Product: ${facts.productName}${option ? ` (${option})` : ""}.`;
}

function verifiedPromptLine(facts, extraItems = []) {
  const verified = compactPromptItems([
    facts.pack,
    facts.cupRange,
    facts.color,
    facts.material,
    facts.structure,
    facts.fit,
    ...extraItems,
  ], "match the uploaded reference only", 5);
  return `Info: ${verified}.`;
}

function joinPromptParts(parts) {
  return parts
    .map((part) => String(part || "").replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join(" ");
}

function referenceRuleText() {
  return sourcePayload.competitor
    ? "Reference: use competitor composition only; do not copy claims/text/brand."
    : "Reference: clean Amazon listing style.";
}

function specGlobalRules() {
  return "Rules: 1:1 Amazon image; match reference; verified text only.";
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
    facts.detailParameter,
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
    "1": "Image 1 Hero: large clean product hero on white/light neutral background. Text: none.",
    "2": `Image 2 Lifestyle: realistic product use scene: ${sceneUse}. Product stays clear and accurate.`,
    "3A": `Image 3A Multi-scene: 3-4 clean panels showing different verified use scenes: ${sceneUse}. Short labels only.`,
    "3B": `Image 3B How-to: simple 3-4 step usage infographic for ${facts.productName}. Short captions only.`,
    "4": joinPromptParts([
      `Image 4 Size/Range: clean infographic. Title "Size Reference"; subtitle "${shortOptionText(facts) || option}".`,
      optionCount,
      facts.cupRange ? `Range: ${facts.cupRange}.` : "",
      dimensions,
    ]),
    "5": `Image 5 Options: product option comparison grid. Show only verified options: ${compactVariantText(facts)}.`,
    "6": `Image 6 Feature: one focused selling point: ${facts.feature1}. Use product close-up or proof scene.`,
    "7": `Image 7 Detail: macro detail of ${compactPromptItems([facts.material, facts.structure, facts.detailParameter], "material or structure")}.`,
    "8": `Image 8 Summary: product centered with 3-4 points: ${compactPromptItems([...summarySideLabels, ...summaryBottomLabels], featureLabels, 4)}.`,
  };

  return [
    modules[typeId] || modules["1"],
    productPromptLine(facts),
    verifiedPromptLine(facts, [dimensionLine]),
  ].filter(Boolean).join("\n");
}

function uniquePromptItems(items, exclusions = []) {
  const excluded = exclusions
    .filter(Boolean)
    .map((item) => String(item).toLowerCase());
  const seen = new Set();
  return items
    .filter(Boolean)
    .map((item) => String(item).trim())
    .filter((item) => {
      const lower = item.toLowerCase();
      if (!lower) return false;
      if (excluded.some((excludedItem) => excludedItem && (lower.includes(excludedItem) || excludedItem.includes(lower)))) return false;
      if (seen.has(lower)) return false;
      seen.add(lower);
      return true;
    });
}

function specTemplatePrompt(typeId, sku, data) {
  const facts = promptFacts(sku, data);
  return [
    specModulePrompt(typeId, facts),
    `${specGlobalRules()} ${referenceRuleText()}`,
    `Negative: ${negativePrompt()}`,
  ].join("\n");
}

function sceneGlobalRules() {
  return "Rules: 1:1 Amazon image; match reference; one clear message; short text only.";
}

function sceneNegativePrompt() {
  return "No wrong product, fake packaging, unsupported claims, dense text, logos, watermark, blur.";
}

function sceneModulePrompt(typeId, facts) {
  const physicalDetails = uniquePromptItems([
    facts.structure,
    facts.material,
    facts.color,
  ]).join(" / ") || "visible product structure, material texture, and true color";
  const sceneList = uniquePromptItems([
    facts.scene,
    facts.fit,
  ]).join(" / ") || "verified realistic use scenes";
  const summaryPoints = compactPromptItems([
    facts.fit || facts.scene,
    facts.feature1,
    facts.feature2,
    facts.material,
    facts.structure,
  ], "main scene / multi-use / key selling points", 4);

  const modules = {
    "1": `Image 1 Main Scene: large product hero in ${facts.scene}. Text none or one short headline.`,
    "2": `Image 2 Multi-Scene: 4-6 panels for ${sceneList}. Short labels only.`,
    "3": `Image 3 Multi-Angle: front, side, back/top, and one detail view on light studio background.`,
    "4": `Image 4 Product Explanation: product centered with 2-3 labels for ${compactPromptItems([facts.fit, physicalDetails], "", 3)}.`,
    "5": `Image 5 Selling Point 5: focused visual for ${facts.feature1}.`,
    "6": `Image 6 Selling Point 6: focused visual for ${facts.feature2}; make it distinct from Image 5.`,
    "7": `Image 7 Summary: product centered with 3-4 verified points: ${summaryPoints}.`,
  };

  return [
    modules[typeId] || modules["1"],
    productPromptLine(facts),
    verifiedPromptLine(facts),
  ].join("\n");
}

function sceneTemplatePrompt(typeId, sku, data) {
  const facts = promptFacts(sku, data);
  return [
    sceneModulePrompt(typeId, facts),
    `${sceneGlobalRules()} ${referenceRuleText()}`,
    `Negative: ${sceneNegativePrompt()}`,
  ].join("\n");
}

function promptFor(templateId, typeId, sku, data) {
  const facts = promptFacts(sku, data);
  const visualReference = referenceRuleText();

  if (templateId === "spec") {
    return specTemplatePrompt(typeId, sku, data);
  }

  if (templateId === "scene") {
    return sceneTemplatePrompt(typeId, sku, data);
  }

  const specPrompts = {
    "1": promptLine(
      "premium Amazon hero photo, product large, clean light background",
      `${facts.productName}; option ${facts.titleSpec}; color ${facts.color}`,
      "No text.",
    ),
    "2": promptLine(
      "realistic lifestyle use scene, product clear and accurate",
      `${facts.productName}; scene ${facts.scene}; use ${facts.fit}`,
      "Short text only if needed.",
    ),
    "3A": promptLine(
      "3-4 panel lifestyle collage, tidy grid, consistent lighting",
      `${facts.productName}; scenes ${facts.scene}; use ${facts.fit}`,
      "Short scene labels only if needed.",
    ),
    "3B": promptLine(
      "simple 3-4 step usage infographic",
      `${facts.productName}; use ${facts.fit}`,
      "Number markers allowed; short captions only.",
    ),
    "4": sizeReferenceRule(facts),
    "5": promptLine(
      "multi-spec option infographic, clean grid, realistic product options, small option tags",
      `${facts.productName}; variants ${facts.variants}`,
      "Do not add unavailable variants.",
    ),
    "6": promptLine(
      "single feature proof image, bright clean background, product close-up or use proof",
      `${facts.productName}; one message ${facts.feature1}`,
      "One short headline maximum.",
    ),
    "7": promptLine(
      "macro close-up detail, sharp texture, visible edges, optional small magnifier inset",
      `${facts.productName}; material ${facts.material}`,
      "Very short labels only if needed.",
    ),
    "8": promptLine(
      "summary infographic, central product, airy layout, up to 4 short callouts",
      `${facts.productName}; confirmed specs ${facts.specs}`,
      "No dense text wall.",
    ),
  };

  const featurePrompts = {
    "1": promptLine("pure white Amazon main image, centered product only", `${facts.productName}; color ${facts.color}`, "No text, props, logos, or packaging."),
    "2": promptLine("single realistic lifestyle scene, product-first composition", `${facts.productName}; scene ${facts.scene}; use ${facts.fit}`, "One short headline only if needed."),
    "3": promptLine("4-6 panel multi-scene collage, clean grid", `${facts.productName}; scenes ${facts.scene}; use ${facts.fit}`, "Short labels only."),
    "4": promptLine("catalog product display: multiple views plus detail", `${facts.productName}; material ${facts.material}; color ${facts.color}`, "Minimal text."),
    "5": promptLine("product option selection grid", `options ${compactVariantText(facts)}`, "No unavailable variants."),
    "6": promptLine("single selling-point proof image", `${facts.productName}; message ${facts.feature1}`, "One short headline maximum."),
    "7": promptLine("second selling-point proof image", `${facts.productName}; message ${facts.feature2}`, "No unsupported claims."),
    "8": promptLine("summary image, central product, 3-4 callouts", `${facts.productName}; ${compactPromptItems([facts.feature1, facts.feature2, facts.material, facts.structure, facts.fit])}`, "No specification table."),
  };

  const prompt = ({ spec: specPrompts, feature: featurePrompts }[templateId] || specPrompts)[typeId];
  return `${prompt}\n${visualReference}\nNegative: ${negativePrompt()}`;
}

function renderFacts() {
  const sku = selectedSku();
  const template = selectedTemplate();
  byId("currentTitle").textContent = hasExtractedProducts() ? `${sku.label} · ${template.name}` : `待解析 · ${template.name}`;
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
            <span>${escapeHtml(sku.label || sku.id)}</span>
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
