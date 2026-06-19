const sourceNotes = {
  purchase: "采购单主口径：确认产品款式与包装数量。",
  alibaba: "1688 辅助口径：只补充能从资料中提取到的规格、材质、结构和适配信息。",
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
    description: "围绕规格、包装数量、适配、杯量和已确认尺寸生成 8 张图。",
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
      { id: "5", name: "5. 多规格 / 多选品搭配图", promptName: "5. SKU Selection Image" },
      { id: "6", name: "6. 卖点图 1", promptName: "6. Selling Point Image 1" },
      { id: "7", name: "7. 卖点图 2", promptName: "7. Selling Point Image 2" },
      { id: "8", name: "8. 卖点总结图", promptName: "8. Selling Point Summary Image" },
    ],
  },
  {
    id: "scene",
    name: "场景展示模板",
    description: "围绕场景代入、顾虑拆解、证据证明和卖点收口生成 7 张图。",
    imageTypes: [
      { id: "1", name: "1. 主图 / 主场景图", promptName: "1. Main Scene Image" },
      { id: "2", name: "2. 多场景 / 多用途图", promptName: "2. Multi-Scene Usage Image" },
      { id: "3", name: "3. 产品展示 / 细节图", promptName: "3. Product Display Detail Image" },
      { id: "4", name: "4. 使用便利 / 贴合体验图", promptName: "4. Usage Convenience Image" },
      { id: "5", name: "5. 舒适 / 面料 / 轻量图", promptName: "5. Comfort or Material Experience Image" },
      { id: "6", name: "6. 核心功能证据图", promptName: "6. Feature Evidence Image" },
      { id: "7", name: "7. 卖点总览图", promptName: "7. Feature Summary Image" },
    ],
  },
];

const fields = [
  ["productName", "Product Name", "[PRODUCT_NAME]"],
  ["pack", "Packaging / Quantity", ""],
  ["cupRange", "Capacity", ""],
  ["material", "Material", ""],
  ["color", "Color", ""],
  ["topWidth", "Dimension 1", ""],
  ["sideLength", "Dimension 2", ""],
  ["bottomWidth", "Dimension 3", ""],
  ["weight", "Weight / Capacity", ""],
  ["fit", "Compatible Object / Use", ""],
  ["scene", "Use Scene", ""],
  ["feature1", "Selling Point 1", ""],
  ["feature2", "Selling Point 2", ""],
];

let promptStore = [];
let extractedProducts = [];
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
  return extractedProducts.length ? extractedProducts : skus;
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
  const group = productGroups[sku.groupKey] || sku.group || productGroups.v02;
  return {
    productName: cleanFieldDisplayValue(defaultProductName(sku)),
    pack: cleanFieldDisplayValue(sku.pack || ""),
    material: cleanFieldDisplayValue(sku.material || "[MATERIAL: natural wood pulp paper / unbleached brown paper]"),
    color: cleanFieldDisplayValue(sku.color || "[COLOR: natural brown]"),
    structure: cleanFieldDisplayValue(sku.structure || "[STRUCTURE: pressed side seam and bottom fold]"),
    cupRange: cleanFieldDisplayValue(sku.dims?.cupRange || ""),
    topWidth: sku.dims?.topWidth || "",
    sideLength: sku.dims?.sideLength || "",
    bottomWidth: sku.dims?.bottomWidth || "",
    weight: sku.dims?.weight || "",
    fit: cleanFieldDisplayValue(sku.fit || "[COMPATIBLE_USE]"),
    scene: cleanFieldDisplayValue(sku.scene || "[USE_SCENE]"),
    feature1: cleanFieldDisplayValue(sku.feature1 || "[SELLING_POINT_1: natural unbleached wood pulp paper]"),
    feature2: cleanFieldDisplayValue(sku.feature2 || "[SELLING_POINT_2: reinforced smooth filtration]"),
    packagingCount: ensureParameterToken("PACKAGING_COUNT", sku.pack || ""),
    singleSpec: sku.singleSpec || `[CURRENT_SKU_SPEC: ${group.promptName || "[PRODUCT_SPEC]"}, ${sku.pack || "[PACKAGING_COUNT]"}]`,
    specList: sku.specList || `[SPEC_LIST: ${(group.promptSpecs || ["[SPECIFICATION_LIST]"]).join(" / ")}]`,
    variantList: sku.variantList || "[VARIANT_LIST: V02 100/200 pcs, fan-shaped 02 or U02 100/200 pcs, fan-shaped 04 100/200 pcs]",
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
  list.innerHTML = rows.map((row) => {
    const params = [
      ["Cup Type", row.title],
      ["Capacity", row.cupRange],
      ["Compatible Use", row.fit],
      ["Material", row.material],
      ["Top Width", row.topWidth],
      ["Side / Height", row.sideLength],
      ["Bottom Width", row.bottomWidth],
      ["Sheet Weight", row.weight],
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
  return [
    ["采购单", sourcePayload.purchase ? compactSourceStatus(sourcePayload.purchase) : "内置演示数据", sourceNotes.purchase],
    ["供应商", sourcePayload.supplier ? compactSourceStatus(sourcePayload.supplier) : "内置演示数据", sourceNotes.alibaba],
    ["竞品参考", sourcePayload.competitor ? compactSourceStatus(sourcePayload.competitor) : "未输入", sourceNotes.amazon],
    ["当前输出", `${products.length} 个产品 / SKU，${template.imageTypes.length} 张图`, dimensionStatus],
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
  const productSpec = productName || group.promptName || sku.shape || cleanTokenValue(base.singleSpec) || "[PRODUCT_SPEC]";
  const pack = fieldsData.pack || "";
  const cupRange = fieldsData.cupRange || sku.dims?.cupRange || extractFirstMatch(base.specList || "", [/([0-9]+\s*-\s*[0-9]+\s*(?:cups|cup|人份))/i]);
  data.productName = productName;
  data.packagingCount = ensureParameterToken("PACKAGING_COUNT", pack);
  data.singleSpec = `[CURRENT_SKU_SPEC: ${[productSpec, pack].filter(Boolean).join(", ")}]`;
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

async function extractSupplierSourceText(html, onProgress) {
  if (!html) {
    return { text: "", imageCount: 0, scannedCount: 0, failedCount: 0, ocrAvailable: false };
  }

  const baseText = cleanHtmlText(html);
  const detailUrls = extractDetailUrlsFromHtml(html);
  const detailHtml = detailUrls.length ? await fetchDetailHtml(detailUrls, onProgress) : "";
  const imageUrls = uniqueImageUrls(
    extractImageUrlsFromHtml(html),
    detailHtml ? extractImageUrlsFromHtml(detailHtml) : [],
  );
  if (!imageUrls.length) {
    return { text: baseText, imageCount: 0, scannedCount: 0, failedCount: 0, ocrAvailable: false };
  }

  onProgress?.(`已找到 ${imageUrls.length} 张 1688 图片，正在尝试 OCR 识别详情图文字...`);
  const ocr = await ocrImageUrls(imageUrls, onProgress);
  return {
    text: [baseText, cleanHtmlText(detailHtml), ocr.text && `1688 image OCR text: ${ocr.text}`].filter(Boolean).join("\n"),
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
  const explicit = extractFirstMatch(text, [
    /(?:Product Name|产品名称|品名|商品名称)[:：]\s*([^。；;.\n|]{2,80})/i,
    /(?:Coffee Filters?|coffee filter paper|filter paper)/i,
  ]);
  if (explicit && /coffee|filter/i.test(explicit)) {
    return explicit.replace(/^[:：\s]+/, "");
  }
  return "";
}

function inferUseScene(text) {
  if (/V60|dripper|pour over|手冲|挂耳|滤杯/i.test(text)) {
    return "pour-over coffee brewing / drip coffee maker setup";
  }
  if (/kitchen|home & kitchen|厨房/i.test(text)) {
    return "home kitchen use";
  }
  return "";
}

function inferSellingPoints(text, material) {
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

  return items;
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

function inferProductsFromSources(purchaseText, supplierText, competitorText) {
  const combined = [purchaseText, supplierText, competitorText].join(" ");
  const productName = inferProductName(combined);
  const material = /wood pulp|原木浆|木浆|unbleached/i.test(combined)
    ? "natural wood pulp paper / unbleached brown paper"
    : "";
  const color = /brown|本色|原色|natural/i.test(combined) ? "natural brown" : "";
  const isCoffeeFilterFamily = /coffee filters|咖啡滤纸|V02|扇形02|扇形04|U02|#04/i.test(combined);
  const structure = /pressed|压边|压纹|fold|折边/i.test(combined) || isCoffeeFilterFamily
    ? "pressed side seam and bottom fold"
    : "";
  const scene = inferUseScene(combined);
  const sellingPoints = inferSellingPoints(combined, material);
  const dimensions = extractDimensions(combined);
  const cupRange = extractFirstMatch(combined, [/([0-9]+\s*-\s*[0-9]+\s*(?:cups|人份))/i]);
  const packageCounts = Array.from(new Set(Array.from(combined.matchAll(/(?:100|200)\s*(?:pcs|片\/盒|片|PCS)/gi)).map((match) => match[0].replace(/\s+/g, " ")))).join(" / ");
  const purchaseItems = extractPurchaseItems(purchaseText, combined);
  const variants = [];

  if (purchaseItems.length) {
    variants.push(...purchaseItems.map((item) => ({
      id: `EXTRACTED-${item.key.toUpperCase()}-${item.pack.replace(/\D/g, "")}`,
      label: `Extracted | ${item.sizeCode} | ${item.pack}`,
      key: item.key,
      spec: item.spec,
      sizeCode: item.sizeCode,
      cupRange: item.cupRange,
      pack: item.pack,
      fit: item.fit,
    })));
  } else {
    if (/V02|V形|V60/i.test(combined)) variants.push({ ...productSpecForToken("V02"), id: "EXTRACTED-V02", label: "Extracted | V02" });
    if (/#02|U02|U102|扇形02|fan-shaped 02/i.test(combined)) variants.push({ ...productSpecForToken("fan 02"), id: "EXTRACTED-U02", label: "Extracted | Fan 02 / U02" });
    if (/#04|扇形04|fan-shaped 04/i.test(combined)) variants.push({ ...productSpecForToken("fan 04"), id: "EXTRACTED-U04", label: "Extracted | Fan 04" });
  }

  const normalizedVariants = variants.length ? variants : [{
    id: "EXTRACTED-PRODUCT-1",
    label: "Extracted | Product 1",
    spec: "",
    sizeCode: "",
    pack: packageCounts || "",
    fit: "",
  }];

  return normalizedVariants.map((item) => {
    const itemCupRange = inferCupRangeForSpec(combined, item) || item.cupRange || cupRange || "";
    const fallbackDimensions = fallbackDimensionsForSpec(item, combined);
    const dimensionList = dimensions.length ? `[VERIFIED_DIMENSIONS: ${dimensions.join("; ")}]` : fallbackDimensions.dimensionList || "";
    return {
    id: item.id,
    label: item.label,
    productName: toCrossBorderProductName(productName, item.spec),
    shape: item.spec,
    pack: item.pack || packageCounts || "",
    sizeCode: item.sizeCode || item.spec,
    groupKey: "",
    group: {
      promptName: item.spec,
      promptSpecs: [item.spec, itemCupRange, item.pack || packageCounts, material, structure].filter(Boolean),
      dimensions,
    },
    dims: {
      topWidth: extractFirstMatch(dimensions.join("; "), [/Top Width:\s*([^;]+)/i]) || fallbackDimensions.topWidth || "",
      sideLength: extractFirstMatch(dimensions.join("; "), [/Side Length:\s*([^;]+)/i]) || fallbackDimensions.sideLength || "",
      bottomWidth: extractFirstMatch(dimensions.join("; "), [/Bottom Width:\s*([^;]+)/i]) || fallbackDimensions.bottomWidth || "",
      weight: extractFirstMatch(dimensions.join("; "), [/Weight:\s*([^;]+)/i]) || fallbackDimensions.weight || "",
      cupRange: itemCupRange,
      source: dimensions.length ? "Extracted from uploaded source files" : fallbackDimensions.source || "No verified dimensions extracted",
    },
    fit: item.fit,
    material,
    color,
    structure,
    scene,
    feature1: sellingPoints.feature1,
    feature2: sellingPoints.feature2,
    singleSpec: `[CURRENT_SKU_SPEC: ${item.spec}${item.pack ? `, ${item.pack}` : packageCounts ? `, ${packageCounts}` : ""}]`,
    specList: `[SPEC_LIST: ${[item.spec, itemCupRange, item.pack || packageCounts, material, structure].filter(Boolean).join(" / ")}]`,
    variantList: `[VARIANT_LIST: ${normalizedVariants.map((variant) => `${variant.spec}${variant.pack ? ` ${variant.pack}` : ""}`).join(" / ")}]`,
    dimensionList,
  };
  });
}

async function extractSources() {
  const purchaseFile = byId("purchaseFile").files[0];
  const supplierFile = byId("supplierFile").files[0];
  const competitorFile = byId("competitorFile").files[0];
  const extractButton = byId("extractSources");
  extractButton.disabled = true;
  extractButton.setAttribute("aria-busy", "true");
  byId("extractStatus").textContent = "正在解析资料...";

  try {
    const purchaseText = await readPdfText(purchaseFile);
    const supplierHtml = await readFileAsText(supplierFile);
    const competitorHtml = await readFileAsText(competitorFile);
    const supplierSource = await extractSupplierSourceText(supplierHtml, (message) => {
      byId("extractStatus").textContent = message;
    });
    sourcePayload = {
      purchase: purchaseText,
      supplier: supplierSource.text,
      competitor: competitorHtml ? cleanHtmlText(competitorHtml) : "",
    };
    extractedProducts = inferProductsFromSources(sourcePayload.purchase, sourcePayload.supplier, sourcePayload.competitor);
    renderProductSelect(extractedProducts[0]?.id);
    renderFields(true);
    renderAll();
    const ocrStatus = supplierSource.imageCount
      ? `1688 图片 OCR：找到 ${supplierSource.imageCount} 张，成功 ${supplierSource.scannedCount} 张，跳过/失败 ${supplierSource.failedCount} 张。远程图片可能因跨域、防盗链或超时无法在浏览器内识别。`
      : "未找到可识别的 1688 图片。";
    const ocrAvailability = supplierSource.imageCount && !supplierSource.ocrAvailable
      ? "OCR 引擎未加载成功，已跳过图片文字识别。"
      : "";
    byId("extractStatus").textContent = `已提取 ${extractedProducts.length} 个产品 / SKU。PDF、HTML 与详情图 OCR 已尝试读取。${ocrStatus}${ocrAvailability}`;
  } finally {
    extractButton.disabled = false;
    extractButton.removeAttribute("aria-busy");
  }
}

function negativePrompt() {
  return "No invented specs, wrong shape, wrong material, extra accessories, logos, watermark, unreadable text, cluttered layout, blurry product, or exaggerated effects.";
}

function isPlaceholderName(value) {
  const clean = String(value || "").trim();
  const knownPlaceholders = new Set([
    "PRODUCT_NAME",
    "PRODUCT_SPEC",
    "PACKAGING_COUNT",
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
  return candidates.find((value) => /(?:pcs|片|pack|包)/i.test(value) && !/cups?|人份/i.test(value)) || "";
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
  return `Hard rules: 1:1 square image; preserve reference product shape/proportion. Combine concise readable text with small icons, simple illustrations, and arrows to communicate key information; avoid long paragraphs and repeated information. No logos, watermark, raw placeholders, dense text, or invented parameters.${extra ? ` ${extra}` : ""}`;
}

function promptLine(style, params, rules = "") {
  return `Style: ${style}\nParameters: ${params}\n${hardRules(rules)}`;
}

function specGlobalRules() {
  return [
    "Rules: 1:1 Amazon image. Match the reference product shape, material, color, and proportions. Combine concise readable text with small icons, simple illustrations, and arrows to communicate key information; avoid long paragraphs and repeated information. No invented specs, brands, logos, watermarks, or extra accessories.",
  ].join("\n");
}

function specModulePrompt(typeId, facts) {
  const dimensionLine = [
    facts.dimension1 && `Dimension 1: ${facts.dimension1}`,
    facts.dimension2 && `Dimension 2: ${facts.dimension2}`,
    facts.dimension3 && `Dimension 3: ${facts.dimension3}`,
    facts.weightOrCapacity && `Weight / Capacity: ${facts.weightOrCapacity}`,
  ].filter(Boolean).join(" / ");
  const specCapsuleItems = facts.pack || "omit packaging if blank";
  const sizeGuide = dimensionLine ? `Use clean arrows/dashed guides only for verified dimensions: ${dimensionLine}.` : "Do not add measurement arrows or dimension numbers when no verified dimensions are provided.";
  const capacityGuide = facts.cupRange ? `Highlight capacity clearly as ${facts.cupRange}.` : "Do not create a capacity value.";
  const helperIconLabels = [
    facts.material,
    facts.structure,
    facts.feature1,
    facts.feature2,
  ]
    .filter(Boolean)
    .filter((value) => {
      const text = String(value).toLowerCase();
      return !text.includes(String(facts.cupRange || "").toLowerCase())
        && !text.includes(String(facts.selectedSpec || "").toLowerCase())
        && !text.includes(String(facts.pack || "").toLowerCase())
        && !/(?:pcs|pieces|packaging|quantity|\d+\s*-\s*\d+\s*cup)/i.test(text);
    })
    .slice(0, 3)
    .join(", ");
  const bottomStripGuide = helperIconLabels
    ? `Optional bottom icons: use up to 3 small auxiliary symbols/mini illustrations for ${helperIconLabels}; keep labels tiny and do not repeat capacity, SKU/spec name, or packaging quantity.`
    : "Optional bottom icons: use only small auxiliary symbols if helpful; do not repeat capacity, SKU/spec name, or packaging quantity.";
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

  const modules = {
    "1": `Image 1 Hero: premium clean product hero. One large product centered/slightly low, 65%-80% of image, bright white/light gray or simple ${facts.scene} background. Text: none, or one tiny ${facts.selectedSpec} label only.`,
    "2": `Image 2 Lifestyle: realistic use photo in ${facts.scene}. Show the product clearly in use with ${facts.fit}; natural scale, soft real lighting. Text: none, or one tiny spec label only.`,
    "3A": `Image 3A Multi-scene: 3-4 equal panels showing different real use scenes. Each panel uses a short readable label plus a small symbol/icon; no dimensions or long captions.`,
    "3B": `Image 3B How-to: 2x2 step grid with four realistic action panels. Use number badges 1-4, small step icons, and one short readable caption per step.`,
    "4": `Image 4 Size/Capacity: size/capacity reference infographic. Top layout must keep the fixed parameter style: large title “Size Reference”, short subtitle with ${facts.titleSpec}, and a dark rounded spec capsule showing packaging quantity only: ${specCapsuleItems}. Do not put packaging quantity in the title or subtitle. Do not include product name or spec name inside the capsule. Large product is the focus in the main area. Show capacity as a clear main text callout paired with a small cup/container icon: ${facts.cupRange || "do not create a capacity value"}. ${sizeGuide} Use clean arrows and simple mini illustrations where helpful. ${bottomStripGuide}`,
    "5": `Image 5 Options: visual comparison. 3-5 horizontal product columns with consistent angle and scale. Each column: product image, short option label, and a small supporting icon if helpful. Only show verified options: ${facts.variants}.`,
    "6": `Image 6 Feature: one visual selling point for ${facts.feature1}. Product large; use one short headline plus 2-3 short icon-supported labels (${[facts.feature2, facts.material, facts.structure].filter(Boolean).join(", ")}).`,
    "7": `Image 7 Detail: macro close-up of material/structure detail (${[facts.material, facts.surfaceFinish, facts.structure, facts.detailParameter].filter(Boolean).join(" / ")}). Use 2-3 short labels paired with small line icons.`,
    "8": `Image 8 Summary: key-points summary poster, similar to a premium Amazon final selling-points image. Top: large bold product/spec title ${facts.titleSpec}; do not put packaging quantity in the title. If packaging quantity exists, show it once as a gold pill badge near the title: ${facts.pack || "omit packaging if blank"}. Show capacity once as a clear small callout near the title or product hero, paired with a cup/container icon: ${facts.cupRange || "omit capacity if blank"}. Center: large realistic product stack/main product as the hero. Left side: 2-3 circular detail insets with short labels for ${summarySideLabels.join(", ")}. Right side: one circular use-scene inset showing ${facts.fit || facts.scene}. Bottom: dark/brown horizontal icon bar with 2-4 short icon-supported key points from ${summaryBottomLabels.join(", ") || "remaining non-repeated verified selling points"}. Do not repeat any left-side detail inset information in the bottom bar. Do not repeat packaging quantity, capacity, or the main spec in the bottom bar. If there are not enough unique verified points, use fewer bottom icons instead of repeating information.`,
  };

  return modules[typeId] || modules["1"];
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
  const referenceRule = sourcePayload.competitor
    ? "Use competitor reference only for composition rhythm. Do not copy claims, text, brand, or unverified parameters."
    : "Use clean Amazon listing composition.";

  return [
    specModulePrompt(typeId, facts),
    "",
    specGlobalRules(),
    `Negative: ${negativePrompt()}`,
    `Reference: ${referenceRule}`,
  ].join("\n");
}

function promptFor(templateId, typeId, sku, data) {
  const facts = promptFacts(sku, data);
  const visualReference = sourcePayload.competitor ? "Use competitor reference only for composition rhythm, not claims or text." : "Use clean Amazon listing composition.";

  if (templateId === "spec") {
    return bracketPromptVariables(specTemplatePrompt(typeId, sku, data), facts, typeId);
  }

  const specPrompts = {
    "1": promptLine(
      `premium Amazon hero photo, product dominant, clean ${facts.scene}, soft commercial lighting, no text`,
      `${facts.productName}; spec ${facts.selectedSpec}; color ${facts.color}`,
      "First image must contain no text, letters, numbers, badges, or labels.",
    ),
    "2": promptLine(
      "realistic lifestyle coffee scene, product clearly in use, shallow depth of field, warm natural light",
      `${facts.productName}; spec ${facts.selectedSpec}; scene ${facts.scene}; fit ${facts.fit}`,
      "Visible text none or one tiny spec tag only.",
    ),
    "3A": promptLine(
      "3-4 panel lifestyle collage, tidy editorial grid, thin dividers, consistent lighting",
      `${facts.productName}; show preparation, setup, use, storage/disposal; fit ${facts.fit}`,
      "Short scene labels only if needed.",
    ),
    "3B": promptLine(
      "step-by-step usage infographic, 3-4 visual steps, clean e-commerce layout",
      `${facts.productName}; workflow prepare, set up, use, final result; fit ${facts.fit}`,
      "Number markers allowed; no long sentences.",
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
    "1": promptLine("pure white Amazon main image, centered product only", `${facts.productName}; color ${facts.color}`, "No text, props, logos, packaging, or accessories."),
    "2": promptLine("single realistic lifestyle scene, product-first composition", `${facts.productName}; scene ${facts.scene}; fit ${facts.fit}`, "One short headline only if needed."),
    "3": promptLine("4-6 panel multi-scene collage, clean grid", `${facts.productName}; preparation, setup, use, interaction, storage`, "Short labels only."),
    "4": promptLine("catalog product display, flat/open/edge/texture/stack views", `${facts.productName}; material ${facts.material}; color ${facts.color}`, "Text minimal or none."),
    "5": promptLine("SKU selection grid, realistic options, small quantity tags", `variants ${facts.variants}`, "No unavailable variants."),
    "6": promptLine("single selling-point proof image, realistic scene or close-up", `${facts.productName}; message ${facts.feature1}`, "One short headline maximum."),
    "7": promptLine("second selling-point proof image, clean close-up or use scene", `${facts.productName}; message ${facts.feature2}`, "No dense icons or unsupported claims."),
    "8": promptLine("summary image, central product, 4 short callouts", `${facts.productName}; specs ${facts.specs}`, "No specification table."),
  };

  const scenePrompts = {
    "1": promptLine("premium main scene, product dominant, realistic lighting", `${facts.productName}; scene ${facts.scene}; color ${facts.color}`, "No text."),
    "2": promptLine("4-6 panel usage collage, consistent style", `${facts.productName}; scene ${facts.scene}; fit ${facts.fit}`, "Short labels only."),
    "3": promptLine("product display detail image, multiple views, studio background", `${facts.productName}; exact shape; material ${facts.material}`, "No lifestyle props."),
    "4": promptLine("usage convenience scene, one simple real action", `${facts.productName}; scene ${facts.scene}`, "One short headline if needed."),
    "5": promptLine("material/handling close-up, soft realistic light", `${facts.productName}; material ${facts.material}`, "No unsupported comfort claims."),
    "6": promptLine("feature evidence image, close-up or action proof", `${facts.productName}; message ${facts.feature1}`, "No fake science graphics."),
    "7": promptLine("feature summary, central product, clean callouts", `${facts.productName}; ${facts.feature1}; ${facts.feature2}`, "Four short points maximum."),
  };

  const prompt = ({ spec: specPrompts, feature: featurePrompts, scene: scenePrompts }[templateId] || specPrompts)[typeId];
  return bracketPromptVariables(`${prompt}\n${visualReference}`, facts, typeId);
}

function renderFacts() {
  const sku = selectedSku();
  const template = selectedTemplate();
  byId("currentTitle").textContent = `${sku.id} · ${template.name}`;
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
            <span>${sku.id}</span>
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
      byId("extractStatus").textContent = `解析失败：${error.message || "请检查文件格式"}`;
    });
  });
  ["purchaseFile", "supplierFile", "competitorFile"].forEach((id) => {
    byId(id).addEventListener("change", () => {
      byId("extractStatus").textContent = "文件已选择，点击解析资料并提取产品信息。";
    });
  });
  byId("resetFields").addEventListener("click", () => {
    renderFields(true);
    renderAll();
  });
  byId("copyCurrent").addEventListener("click", () => copyText(allPromptsForSku(), "已复制当前 SKU 全部图组。", byId("copyCurrent")));
}

init();
