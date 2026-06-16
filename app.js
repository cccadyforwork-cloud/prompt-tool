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
    description: "围绕规格、包装数量、材质、结构、适配和已确认尺寸生成 8 张图。",
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
    id: "summary",
    name: "综合卖点模板",
    description: "在参数与功能之间取平衡，突出 2 个主卖点并保留规格识别。",
    imageTypes: [
      { id: "1", name: "1. 白底主图", promptName: "1. White Background Main Image" },
      { id: "2", name: "2. 主卖点 1 图", promptName: "2. Main Selling Point Image 1" },
      { id: "3", name: "3. 主卖点 2 图", promptName: "3. Main Selling Point Image 2" },
      { id: "4", name: "4. 规格参数图", promptName: "4. Specification Reference Image" },
      { id: "5", name: "5. 多规格可选图", promptName: "5. Multiple Specification Options Image" },
      { id: "6", name: "6. 使用步骤图", promptName: "6. Step-by-Step Usage Image" },
      { id: "7", name: "7. 细节证明图", promptName: "7. Detail Proof Image" },
      { id: "8", name: "8. 总卖点图", promptName: "8. Summary Infographic" },
    ],
  },
  {
    id: "scene",
    name: "场景展示模板（后期补入）",
    description: "后续补入，暂不生成。",
    imageTypes: [],
    disabled: true,
  },
];

const fields = [
  ["productName", "Product Name", "[PRODUCT_NAME]"],
  ["material", "Material", ""],
  ["color", "Color", ""],
  ["structure", "Structure", ""],
  ["fit", "Compatible Use", ""],
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

function valueMap(sku) {
  const group = productGroups[sku.groupKey] || sku.group || productGroups.v02;
  return {
    productName: sku.productName || "[PRODUCT_NAME]",
    material: sku.material || "[MATERIAL: natural wood pulp paper / unbleached brown paper]",
    color: sku.color || "[COLOR: natural brown]",
    structure: sku.structure || "[STRUCTURE: pressed side seam and bottom fold]",
    topWidth: sku.dims?.topWidth || "",
    sideLength: sku.dims?.sideLength || "",
    bottomWidth: sku.dims?.bottomWidth || "",
    weight: sku.dims?.weight || "",
    fit: sku.fit || "[COMPATIBLE_USE]",
    scene: sku.scene || "[USE_SCENE]",
    feature1: "[SELLING_POINT_1: natural unbleached wood pulp paper]",
    feature2: "[SELLING_POINT_2: reinforced smooth filtration]",
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
  fieldList.innerHTML = fields.map(([key, label, fallback]) => {
    const value = reset ? (values[key] || fallback) : (byId(`field-${key}`)?.value || values[key] || fallback);
    return `
      <div>
        <label for="field-${key}">${label}</label>
        <input id="field-${key}" data-key="${key}" value="${escapeHtml(value)}">
      </div>
    `;
  }).join("");
  fieldList.querySelectorAll("input").forEach((input) => input.addEventListener("input", renderAll));
}

function cleanTokenValue(value) {
  return String(value || "")
    .replace(/^\[[A-Z0-9_ ]+:?\s*/i, "")
    .replace(/\]$/g, "")
    .trim();
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
  currentProducts().forEach((sku) => {
    const values = valueMap(sku);
    const groupKey = sku.groupKey || sku.sizeCode || sku.shape || sku.id;
    const existing = groups.get(groupKey) || {
      title: sku.sizeCode || sku.shape || "Product Specification",
      shape: sku.shape || cleanTokenValue(values.singleSpec),
      packs: new Set(),
      cupRange: "",
      fit: cleanTokenValue(values.fit),
      material: cleanTokenValue(values.material),
      structure: cleanTokenValue(values.structure),
      topWidth: sku.dims?.topWidth || values.topWidth || "",
      sideLength: sku.dims?.sideLength || values.sideLength || "",
      bottomWidth: sku.dims?.bottomWidth || values.bottomWidth || "",
      weight: sku.dims?.weight || values.weight || "",
    };

    if (sku.pack) existing.packs.add(cleanTokenValue(sku.pack));
    if (!existing.cupRange) {
      existing.cupRange = sku.dims?.cupRange || extractFirstMatch((values.specList || sku.fit || ""), [/([0-9]+\s*-\s*[0-9]+\s*(?:cups|cup|人份))/i]);
    }
    if (!existing.fit) existing.fit = cleanTokenValue(values.fit);
    if (!existing.material) existing.material = cleanTokenValue(values.material);
    if (!existing.structure) existing.structure = cleanTokenValue(values.structure);
    if (!existing.topWidth) existing.topWidth = sku.dims?.topWidth || values.topWidth || "";
    if (!existing.sideLength) existing.sideLength = sku.dims?.sideLength || values.sideLength || "";
    if (!existing.bottomWidth) existing.bottomWidth = sku.dims?.bottomWidth || values.bottomWidth || "";
    if (!existing.weight) existing.weight = sku.dims?.weight || values.weight || "";
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
      ["Cup Range", row.cupRange],
      ["Packaging", Array.from(row.packs).join(" / ")],
      ["Compatible Use", row.fit],
      ["Material", row.material],
      ["Structure", row.structure],
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

function highlightPlaceholders(text) {
  return escapeHtml(text).replace(/(\[[^\]\n]+\])/g, '<span class="placeholder-token">$1</span>');
}

function currentFields() {
  const data = {};
  fields.forEach(([key]) => {
    data[key] = byId(`field-${key}`)?.value || "";
  });
  return data;
}

function currentPromptData(sku) {
  return {
    ...valueMap(sku),
    ...currentFields(),
  };
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
  if (/咖啡滤纸|Coffee Filters?|filter paper/i.test(text)) {
    return "unbleached coffee paper filters";
  }
  return "[PRODUCT_NAME]";
}

function inferUseScene(text) {
  if (/V60|dripper|pour over|手冲|挂耳|滤杯/i.test(text)) {
    return "[USE_SCENE: pour-over coffee brewing / drip coffee maker setup]";
  }
  if (/kitchen|home & kitchen|厨房/i.test(text)) {
    return "[USE_SCENE: home kitchen use]";
  }
  return "[USE_SCENE]";
}

function inferSellingPoints(text, material, structure) {
  const feature1 = /wood pulp|原木浆|unbleached|未漂白|natural/i.test(text)
    ? "[SELLING_POINT_1: natural unbleached material]"
    : `[SELLING_POINT_1: ${material.replace(/^\[MATERIAL:?\s*|\]$/g, "") || "primary product benefit"}]`;
  const feature2 = /pressed|压边|压纹|fold|折边|filter|过滤/i.test(text)
    ? "[SELLING_POINT_2: stable structure and smooth performance]"
    : `[SELLING_POINT_2: ${structure.replace(/^\[STRUCTURE:?\s*|\]$/g, "") || "secondary product benefit"}]`;
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
      fit: "[COMPATIBLE_USE: V60-02 style cone dripper]",
    };
  }
  if (normalized.includes("fan 04") || normalized.includes("#04")) {
    return {
      key: "u04",
      spec: "fan-shaped 04 coffee filter",
      sizeCode: "Fan 04",
      fit: "[COMPATIBLE_USE: #4 cone or fan-shaped drip coffee maker]",
    };
  }
  return {
    key: "u02",
    spec: "fan-shaped 02 / U02 coffee filter",
    sizeCode: "Fan 02 / U02",
    fit: "[COMPATIBLE_USE: #2 fan-shaped dripper or small drip coffee maker]",
  };
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
    return `[PRODUCT_NAME: ${fallbackSpec}]`;
  }
  if (/咖啡滤纸|Coffee Filters?|filter paper/i.test(productName)) {
    return "[PRODUCT_NAME: unbleached coffee paper filters]";
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
  return `[PRODUCT_NAME: ${normalized}]`;
}

function inferProductsFromSources(purchaseText, supplierText, competitorText) {
  const combined = [purchaseText, supplierText, competitorText].join(" ");
  const productName = inferProductName(combined);
  const material = /wood pulp|原木浆|木浆|unbleached/i.test(combined)
    ? "[MATERIAL: natural wood pulp paper / unbleached brown paper]"
    : "[MATERIAL]";
  const color = /brown|本色|原色|natural/i.test(combined) ? "[COLOR: natural brown]" : "[COLOR]";
  const isCoffeeFilterFamily = /coffee filters|咖啡滤纸|V02|扇形02|扇形04|U02|#04/i.test(combined);
  const structure = /pressed|压边|压纹|fold|折边/i.test(combined) || isCoffeeFilterFamily
    ? "[STRUCTURE: pressed side seam and bottom fold]"
    : "[STRUCTURE]";
  const scene = inferUseScene(combined);
  const sellingPoints = inferSellingPoints(combined, material, structure);
  const dimensions = extractDimensions(combined);
  const cupRange = extractFirstMatch(combined, [/([0-9]+\s*-\s*[0-9]+\s*(?:cups|人份))/i]);
  const packageCounts = Array.from(new Set(Array.from(combined.matchAll(/(?:100|200)\s*(?:pcs|片\/盒|片|PCS)/gi)).map((match) => match[0].replace(/\s+/g, " ")))).join(" / ");
  const purchaseItems = extractPurchaseItems(purchaseText, combined);
  const variants = [];

  if (purchaseItems.length) {
    variants.push(...purchaseItems.map((item) => ({
      id: `EXTRACTED-${item.key.toUpperCase()}-${item.pack.replace(/\D/g, "")}`,
      label: `Extracted | ${item.sizeCode} | ${item.pack}`,
      spec: item.spec,
      sizeCode: item.sizeCode,
      pack: item.pack,
      fit: item.fit,
    })));
  } else {
    if (/V02|V形|V60/i.test(combined)) variants.push({ id: "EXTRACTED-V02", label: "Extracted | V02", spec: "V02 cone coffee filter", sizeCode: "V02", fit: "[COMPATIBLE_USE: V60-02 style cone dripper]" });
    if (/#02|U02|U102|扇形02|fan-shaped 02/i.test(combined)) variants.push({ id: "EXTRACTED-U02", label: "Extracted | Fan 02 / U02", spec: "fan-shaped 02 / U02 coffee filter", sizeCode: "Fan 02 / U02", fit: "[COMPATIBLE_USE: #2 fan-shaped dripper or small drip coffee maker]" });
    if (/#04|扇形04|fan-shaped 04/i.test(combined)) variants.push({ id: "EXTRACTED-U04", label: "Extracted | Fan 04", spec: "fan-shaped 04 coffee filter", sizeCode: "Fan 04", fit: "[COMPATIBLE_USE: #4 cone or fan-shaped drip coffee maker]" });
  }

  const normalizedVariants = variants.length ? variants : [{
    id: "EXTRACTED-PRODUCT-1",
    label: "Extracted | Product 1",
    spec: "[PRODUCT_SPEC]",
    sizeCode: "[SIZE_CODE]",
    pack: packageCounts ? `[PACKAGING_COUNT: ${packageCounts}]` : "[PACKAGING_COUNT]",
    fit: "[COMPATIBLE_USE]",
  }];

  return normalizedVariants.map((item) => ({
    id: item.id,
    label: item.label,
    productName: toCrossBorderProductName(productName, item.spec),
    shape: item.spec,
    pack: item.pack || (packageCounts ? `[PACKAGING_COUNT: ${packageCounts}]` : "[PACKAGING_COUNT]"),
    sizeCode: item.sizeCode || item.spec,
    groupKey: "",
    group: {
      promptName: item.spec,
      promptSpecs: [item.spec, cupRange || "[CUP_RANGE]", item.pack || packageCounts || "[PACKAGING_COUNT]", material, structure],
      dimensions,
    },
    dims: {
      topWidth: extractFirstMatch(dimensions.join("; "), [/Top Width:\s*([^;]+)/i]),
      sideLength: extractFirstMatch(dimensions.join("; "), [/Side Length:\s*([^;]+)/i]),
      bottomWidth: extractFirstMatch(dimensions.join("; "), [/Bottom Width:\s*([^;]+)/i]),
      weight: extractFirstMatch(dimensions.join("; "), [/Weight:\s*([^;]+)/i]),
      source: dimensions.length ? "Extracted from uploaded source files" : "No verified dimensions extracted",
    },
    fit: item.fit,
    material,
    color,
    structure,
    scene,
    feature1: sellingPoints.feature1,
    feature2: sellingPoints.feature2,
    singleSpec: `[CURRENT_SKU_SPEC: ${item.spec}${item.pack ? `, ${item.pack}` : packageCounts ? `, ${packageCounts}` : ""}]`,
    specList: `[SPEC_LIST: ${[item.spec, cupRange, item.pack || packageCounts, material, structure].filter(Boolean).join(" / ")}]`,
    variantList: `[VARIANT_LIST: ${normalizedVariants.map((variant) => `${variant.spec}${variant.pack ? ` ${variant.pack}` : ""}`).join(" / ")}]`,
    dimensionList: dimensions.length ? `[VERIFIED_DIMENSIONS: ${dimensions.join("; ")}]` : "",
  }));
}

async function extractSources() {
  const purchaseFile = byId("purchaseFile").files[0];
  const supplierFile = byId("supplierFile").files[0];
  const competitorFile = byId("competitorFile").files[0];
  byId("extractStatus").textContent = "正在解析资料...";

  const purchaseText = await readPdfText(purchaseFile);
  const supplierHtml = await readFileAsText(supplierFile);
  const competitorHtml = await readFileAsText(competitorFile);
  sourcePayload = {
    purchase: purchaseText,
    supplier: supplierHtml ? cleanHtmlText(supplierHtml) : "",
    competitor: competitorHtml ? cleanHtmlText(competitorHtml) : "",
  };
  extractedProducts = inferProductsFromSources(sourcePayload.purchase, sourcePayload.supplier, sourcePayload.competitor);
  renderProductSelect(extractedProducts[0]?.id);
  renderFields(true);
  renderAll();
  byId("extractStatus").textContent = `已提取 ${extractedProducts.length} 个产品 / SKU。PDF 与 HTML 已尝试读取文本。`;
}

function negativePrompt() {
  return "Avoid invented details, wrong materials, distorted proportions, extra accessories, logos, watermark, cluttered text, and unrealistic rendering.";
}

function sizeInstruction(data) {
  if (data.dimensionList) {
    return `Use only these verified dimension texts: ${data.dimensionList}.`;
  }

  const verifiedParams = [
    ensureParameterToken("CURRENT_SKU_SPEC", data.singleSpec),
    ensureParameterToken("PACKAGING_COUNT", data.packagingCount),
    ensureParameterToken("MATERIAL", data.material),
    ensureParameterToken("STRUCTURE", data.structure),
    ensureParameterToken("COMPATIBLE_USE", data.fit),
  ].filter(hasTokenContent);

  return `No verified single-filter dimensions are provided. Do not add measurement arrows, size numbers, or placeholder dimensions. Show only these verified product parameter texts: ${verifiedParams.join(", ")}. Do not display bare placeholder names without values.`;
}

function promptFor(templateId, typeId, sku, data) {
  const negative = negativePrompt();
  const shortCopyRule = "Each feature description, benefit caption, headline, or summary phrase must be an English phrase of 3 to 5 words maximum, not a full sentence.";
  const commonRule = `Use only the placeholder product information already included in this prompt. If a parameter is blank or not provided, omit it completely. Do not borrow, infer, or invent any numbers. ${shortCopyRule}\n\nNegative prompt: ${negative}`;

  const specPrompts = {
    "1": `Generate a premium Amazon hero image for one ${data.productName} based on the provided reference image. Combine a clean real-life ${data.scene} with a strong product focus. Show one large product as the dominant subject, preserving the true appearance, ${data.color}, ${data.structure}, and proportions from the reference image.\n\nThis image should clearly represent the selected specification: ${data.singleSpec}. Allow only a small amount of clean text for 2-3 verified key parameters, such as [SIZE_CODE], ${data.material}, and ${data.structure}. ${commonRule}`,
    "2": `Generate a realistic Amazon lifestyle image for ${data.productName} based on the provided reference image. Show the selected ${sku.shape} being used in a natural ${data.scene}, with the product clearly visible and accurately scaled. The scene should help customers understand the real size, fit, and usage context of ${data.singleSpec}.\n\nUse soft natural lighting, a clean coffee environment, realistic paper texture, and premium e-commerce photography style. Add no text or only one very small verified specification label if needed. ${commonRule}`,
    "3A": `Generate a premium Amazon multi-scene lifestyle infographic for ${data.productName} based on the provided reference image. Show 3 to 4 realistic usage scenes in one clean collage layout: product preparation, placement or setup, active use, and after-use storage or disposal. Keep the product visible in every scene, with accurate scale, material texture, color, and proportions.\n\nIf specification labels are needed, use only short verified labels such as [SIZE_CODE], ${data.singleSpec}, or ${data.fit}. ${commonRule}`,
    "3B": `Generate a premium Amazon step-by-step usage scene image for ${data.productName} based on the provided reference image. Show the real product in a practical workflow using 3 to 4 simple steps: prepare the product, set it up with the compatible object if applicable, use it in the intended scene, and show the final result.\n\nThe image should feel instructional but still premium and visually clean. Use realistic material texture, consistent lighting, and a clean e-commerce layout. Add only short step labels and verified specification text if needed. ${commonRule}`,
    "4": `Generate a premium Amazon size reference infographic for ${data.productName} based on the provided reference image. Use a top-view focused composition with a bright, clean, premium e-commerce style. Show one product large and centered.\n\n${sizeInstruction(data)} Keep the product realistic, sharp, and proportionally accurate, with accurate natural paper texture. ${commonRule}`,
    "5": `Generate a premium Amazon infographic showing multiple specification options for ${data.productName} based on the provided reference images or verified product data. Present the available product options in a clean, visually organized layout: ${data.variantList}, with package quantity options shown separately.\n\nShow realistic product options with accurate shape, material texture, pressed seams, and consistent scale relationship. Do not invent unavailable sizes or variants. ${commonRule}`,
    "6": `Generate a premium Amazon product feature image for ${data.productName} based on the provided reference image. Highlight only one verified specification-based selling point: ${data.feature1}.\n\nUse a clean bright background, realistic close-up paper texture, and minimal supporting text. Do not mix multiple major selling points in one image. ${commonRule}`,
    "7": `Generate a premium Amazon close-up detail image for ${data.productName} based on the provided reference image. Show macro-level detail of the natural paper fiber texture, pressed side seam, bottom fold, layered edge, and disposable paper structure.\n\nUse tasteful zoom-in composition, sharp realistic detail, and a clean premium layout. Add only very short verified labels if needed. ${commonRule}`,
    "8": `Generate a premium Amazon summary infographic for ${data.productName} based on the provided reference image. Use one clean central product image with a simple layout that visually recaps the main confirmed specifications: ${data.specList}, ${data.material}, ${data.structure}, and ${data.fit}.\n\nKeep the image minimal, organized, and easy to read at a glance. Do not include unverified specifications or unsupported compatibility claims. ${commonRule}`,
  };

  const featurePrompts = {
    "1": `Generate a professional Amazon main image for ${data.productName} based on the provided reference image. Preserve the exact product shape, material appearance, color, texture, structure, and proportions from the reference image. Show only the selected product clearly and prominently, centered in the frame, against a pure white background.\n\nNo props, packaging, text, logos, icons, extra accessories, or decorative elements. Focus on clean product identity. ${commonRule}`,
    "2": `Generate a realistic Amazon single-scene lifestyle image for ${data.productName} based on the provided reference image. Show one clear realistic scene only: ${data.scene}, where the product is being used through [REAL_USE_ACTION].\n\nKeep the product large, sharp, and easy to recognize. If any text is added, use only one short headline of 2 to 4 words. ${commonRule}`,
    "3": `Generate a premium Amazon multi-scene lifestyle infographic for ${data.productName} based on the provided reference image. Show 4 to 6 realistic usage scenes in one clean grid or collage layout: preparation, setup, real use, close interaction, after-use placement, and storage if applicable.\n\nIn every panel, the product must remain clearly visible and recognizable, with accurate shape, material texture, color, and proportions. ${commonRule}`,
    "4": `Generate a clean Amazon product display image showing accurate views of ${data.productName}: flat view, opened view, side seam close-up, bottom fold close-up, and stack view. Preserve the real paper texture, color, structure, and visible details from the reference image.\n\nUse a white or very light neutral background, professional lighting, realistic rendering, and clear spacing. ${commonRule}`,
    "5": `Generate a clean Amazon SKU selection image for the product line based on verified product data. Show the available options in a neat horizontal or grid layout: ${data.variantList}.\n\nEach option should be clearly separated and easy to compare. Do not add unavailable variants. ${commonRule}`,
    "6": `Generate a realistic Amazon lifestyle selling-point image for ${data.productName} based on the provided reference image. Focus on one clear message only: ${data.feature1}. Show a realistic scene or close-up that visually proves this point.\n\nKeep the product large and clearly visible. If any text is added, use only one short headline: [SHORT_HEADLINE_1]. ${commonRule}`,
    "7": `Generate a clean Amazon selling-point image for ${data.productName} based on the provided reference image. Focus on one clear message only: ${data.feature2}. Use a realistic close-up, simple use scene, or proof-focused composition to highlight the verified material, structure, or use benefit.\n\nAvoid busy infographic structures, dense text, extra icons, or unsupported claims. If any text is added, use only one short headline: [SHORT_HEADLINE_2]. ${commonRule}`,
    "8": `Generate a clean Amazon summary image for ${data.productName} based on the provided reference image. Place the product in the center and summarize the product with only 4 short feature words around it: [SUMMARY_WORD_1] / [SUMMARY_WORD_2] / [SUMMARY_WORD_3] / [SUMMARY_WORD_4].\n\nKeep the layout very simple, airy, and easy to scan. ${commonRule}`,
  };

  const summaryPrompts = {
    "1": featurePrompts["1"],
    "2": featurePrompts["6"],
    "3": featurePrompts["7"],
    "4": specPrompts["4"],
    "5": specPrompts["5"],
    "6": specPrompts["3B"],
    "7": specPrompts["7"],
    "8": specPrompts["8"],
  };

  return ({ spec: specPrompts, feature: featurePrompts, summary: summaryPrompts }[templateId] || specPrompts)[typeId];
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
        <pre class="prompt-preview">${highlightPlaceholders(prompt)}</pre>
      </article>
    `;
  }).join("");

  grid.querySelectorAll(".copy-prompt").forEach((button) => {
    button.addEventListener("click", () => copyText(promptStore[Number(button.dataset.promptIndex)]?.prompt || "", "已复制该图提示词。"));
  });
}

function renderPrompt() {
  renderProductPromptGrid();
}

function renderAll() {
  renderProductParameters();
  renderFacts();
  renderPrompt();
}

function allPromptsForSku() {
  const sku = selectedSku();
  const template = selectedTemplate();
  const data = currentPromptData(sku);
  return template.imageTypes.map((type) => `## ${type.promptName || type.name}\n\n${promptFor(template.id, type.id, sku, data)}`).join("\n\n---\n\n");
}

async function copyText(text, message) {
  try {
    await navigator.clipboard.writeText(text);
    byId("copyStatus").textContent = message;
  } catch {
    byId("copyStatus").textContent = "复制失败，请手动选中文本复制。";
  }
}

function init() {
  fillSelects();
  renderFields(true);
  renderAll();

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
  byId("copyCurrent").addEventListener("click", () => copyText(allPromptsForSku(), "已复制当前 SKU 全部图组。"));
}

init();
