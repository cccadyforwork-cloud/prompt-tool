const sourceNotes = {
  purchase: "采购单主口径：确认产品款式与包装数量。",
  alibaba: "1688 辅助口径：只补充能从资料中提取到的规格、材质、结构和适配信息。",
  amazon: "竞品参考口径：只用于图组逻辑与卖点筛选，不补写未确认参数。",
};

const productGroups = {
  v02: {
    name: "V02 V形滤纸",
    purchaseVariants: "V02 100片/盒、V02 200片/盒",
    productCountNote: "采购单计 2 个 SKU；基础产品计 1 款",
    alibabaPack: "V02，100片/盒，约 138g/盒，外盒约 130 x 200 x 17 mm，1-4人份",
    specs: ["V02", "1-4人份", "100片/盒 / 200片/盒", "自然棕色原色木浆纸", "侧边压纹与底部折边"],
    dimensions: ["Top Width: 16 cm", "Side Length: 12 cm / 11.6 cm", "Weight: 1.12 g/sheet"],
    evidenceNote: "只使用 1688 图中可见规格；100/200 仅作为包装数量。",
  },
  u02: {
    name: "扇形02 / U02 滤纸",
    purchaseVariants: "扇形02 100片/盒、扇形U02 200片/盒",
    productCountNote: "采购单计 2 个 SKU；基础产品计 1 款",
    alibabaPack: "#02 / U102，100片/盒，约 142g/盒，外盒约 170 x 200 x 17 mm，2-6人份",
    specs: ["#02 / U102", "2-6人份", "100片/盒 / 200片/盒", "自然棕色原色木浆纸", "侧边压纹与底部折边"],
    dimensions: ["Top Width: 16.5 cm", "Side Length: 9 cm / 9.5 cm", "Bottom Width: 5 cm", "Weight: 1.15 g/sheet"],
    evidenceNote: "采购单中的“扇形02”和“扇形U02”按同一基础规格处理，包装数量分开。",
  },
  u04: {
    name: "扇形04 滤纸",
    purchaseVariants: "扇形04 100片/盒、扇形04 200片/盒",
    productCountNote: "采购单计 2 个 SKU；基础产品计 1 款",
    alibabaPack: "#04，100片/盒，约 185g/盒，外盒约 230 x 200 x 17 mm，8-12 cups",
    specs: ["#04", "8-12 cups", "100片/盒 / 200片/盒", "自然棕色原色木浆纸", "侧边压纹与底部折边"],
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
  { id: "1", name: "1. 单款参数 + 场景主图" },
  { id: "2", name: "2. 生活场景图 1" },
  { id: "3A", name: "3A. 多场景使用图" },
  { id: "3B", name: "3B. 产品使用方法场景图" },
  { id: "4", name: "4. 适用尺寸参数图" },
  { id: "5", name: "5. 多规格可选图" },
  { id: "6", name: "6. 功能 / 卖点图" },
  { id: "7", name: "7. 细节放大图" },
  { id: "8", name: "8. 总卖点图" },
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
      { id: "1", name: "1. 白底图" },
      { id: "2", name: "2. 单一场景图" },
      { id: "3", name: "3. 多场景图 / 多用途展示" },
      { id: "4", name: "4. 产品展示图 / 多视角图" },
      { id: "5", name: "5. 多规格 / 多选品搭配图" },
      { id: "6", name: "6. 卖点图 1" },
      { id: "7", name: "7. 卖点图 2" },
      { id: "8", name: "8. 卖点总结图" },
    ],
  },
  {
    id: "summary",
    name: "综合卖点模板",
    description: "在参数与功能之间取平衡，突出 2 个主卖点并保留规格识别。",
    imageTypes: [
      { id: "1", name: "1. 白底主图" },
      { id: "2", name: "2. 主卖点 1 图" },
      { id: "3", name: "3. 主卖点 2 图" },
      { id: "4", name: "4. 规格参数图" },
      { id: "5", name: "5. 多规格可选图" },
      { id: "6", name: "6. 使用步骤图" },
      { id: "7", name: "7. 细节证明图" },
      { id: "8", name: "8. 总卖点图" },
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

const productOutputOrder = ["v02", "u02", "u04"];

const fields = [
  ["productName", "产品名称", "unbleached natural coffee paper filters"],
  ["material", "材质说明", "natural wood pulp paper / unbleached brown paper"],
  ["color", "颜色说明", "natural brown"],
  ["structure", "结构说明", "disposable paper filter with pressed side seam and bottom fold"],
  ["topWidth", "单片顶部宽度", ""],
  ["sideLength", "单片侧边 / 高度", ""],
  ["bottomWidth", "单片底部宽度", ""],
  ["weight", "单片重量", ""],
  ["fit", "适配对象", ""],
  ["scene", "使用场景", "home pour-over coffee brewing / drip coffee maker setup"],
  ["feature1", "主卖点 1", "natural unbleached wood pulp paper"],
  ["feature2", "主卖点 2", "smooth filtration with reinforced pressed edges"],
];

const amazonLogic = [
  "主图：单片或叠放滤纸占画面主体，纯白背景，强调纸张纹理和压边结构。",
  "生活图：厨房、露营或手冲咖啡场景，展示注水、过滤、咖啡液下滴。",
  "参数图：单片平铺，用箭头标顶部宽度、侧边高度、底部宽度；避免把盒装数量当尺寸。",
  "适配图：展示陶瓷滤杯、玻璃滤杯、滴漏咖啡机等兼容对象，文字少。",
  "步骤图：折边、展开、放入滤杯、加粉、注水、完成过滤，网格布局。",
  "细节图：放大纸张纤维、压边封合、底部折线，证明不易破和减少咖啡渣。",
];

const extractedProductInfo = [
  "材质：原色木浆纸 / 未漂白自然纸感，颜色为自然棕色。",
  "形状：V形与扇形 / 梯形两类，覆盖 V02、扇形02 / U02、扇形04。",
  "结构：一次性纸滤，带侧边压纹、高温压边和底部折边。",
  "适配：V60滤杯、陶瓷平底滤杯、美式滴漏咖啡壶等对应场景。",
];

const candidateSellingPoints = [
  "原色木浆 / 未漂白纸感，适合自然、健康、咖啡馆风格视觉。",
  "平稳过滤，减少咖啡细粉进入杯中，呈现更干净的咖啡液。",
  "高温压边与底部折边，强调贴合滤杯、不易塌边、结构稳定。",
  "多规格覆盖不同杯量和器具，适合家庭、办公室和咖啡店备货。",
];

const primarySellingPoints = [
  "Natural Unbleached Wood Pulp Paper",
  "Smooth Filtration with Reinforced Pressed Edges",
];

function byId(id) {
  return document.getElementById(id);
}

function selectedSku() {
  return skus.find((sku) => sku.id === byId("skuSelect").value) || skus[0];
}

function selectedTemplate() {
  const selected = templates.find((item) => item.id === byId("templateSelect").value) || templates[0];
  return selected.disabled ? templates[0] : selected;
}

function valueMap(sku) {
  const group = productGroups[sku.groupKey];
  return {
    productName: "unbleached natural coffee paper filters",
    material: "natural wood pulp paper / unbleached brown paper",
    color: "natural brown",
    structure: "disposable paper filter with pressed side seam and bottom fold",
    topWidth: sku.dims.topWidth || "",
    sideLength: sku.dims.sideLength || "",
    bottomWidth: sku.dims.bottomWidth || "",
    weight: sku.dims.weight || "",
    fit: sku.fit,
    scene: "home pour-over coffee brewing / drip coffee maker setup",
    feature1: "natural unbleached wood pulp paper",
    feature2: "smooth filtration with reinforced pressed edges",
    singleSpec: `${group.name}, ${sku.pack}`,
    specList: group.specs.join(" / "),
    dimensionList: group.dimensions.length ? group.dimensions.join("; ") : "No verified single-filter dimensions provided",
  };
}

function fillSelects() {
  byId("skuSelect").innerHTML = skus.map((sku) => `<option value="${sku.id}">${sku.label}</option>`).join("");
  byId("templateSelect").innerHTML = templates
    .filter((template) => !template.disabled)
    .map((template) => `<option value="${template.id}">${template.name}</option>`)
    .join("");
}

function renderFields(reset = false) {
  const sku = selectedSku();
  const values = valueMap(sku);
  const fieldList = byId("fieldList");
  fieldList.innerHTML = fields.map(([key, label, fallback]) => {
    const value = reset ? (values[key] || fallback) : (byId(`field-${key}`)?.value || values[key] || fallback);
    const note = ["topWidth", "sideLength", "bottomWidth", "weight"].includes(key) ? `<p class="field-note">${sku.dims.source}</p>` : "";
    return `
      <div>
        <label for="field-${key}">${label}</label>
        <input id="field-${key}" data-key="${key}" value="${escapeHtml(value)}">
        ${note}
      </div>
    `;
  }).join("");
  fieldList.querySelectorAll("input").forEach((input) => input.addEventListener("input", renderAll));
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

function currentFields() {
  const data = {};
  fields.forEach(([key]) => {
    data[key] = byId(`field-${key}`)?.value || "";
  });
  return data;
}

function skuFacts(sku) {
  const group = productGroups[sku.groupKey];
  return [
    ["采购单产品数", "6 个采购项 / SKU；合并后 3 款基础产品规格"],
    ["当前基础款", group.name],
    ["采购单包装数量", group.purchaseVariants],
    ["当前 SKU", sku.sourceName],
    ["MSKU", sku.id],
    ["盒装数量", `${sku.pack}（仅包装信息，不作为单片尺寸）`],
    ["单片规格", `${sku.shape}, ${sku.dims.cupRange}`],
    ["提取规格", group.specs.join(" / ")],
    ["已确认单片参数", group.dimensions.length ? group.dimensions.join(" / ") : "资料未明确，不填写"],
    ["盒装参考", group.alibabaPack],
    ["口径备注", group.evidenceNote],
  ];
}

function representativeSku(groupKey) {
  return skus.find((sku) => sku.groupKey === groupKey && sku.pack.includes("100")) || skus.find((sku) => sku.groupKey === groupKey);
}

function alibabaInfo(sku) {
  return [
    ...extractedProductInfo,
    `${sku.sizeCode} 规格适配 ${sku.fit}，作图时只写已确认或可替换的适配对象。`,
  ];
}

function selectedSellingPoints() {
  return [
    "主卖点 1：原色木浆 / 未漂白自然纸感，用于材质、安全感、自然风格画面。",
    "主卖点 2：平稳过滤 + 高温压边结构，用于展示减少细粉、贴合稳定、不易塌边。",
    "候选但降级：一次性便捷、多规格适配，可放到副图或规格图，不抢主卖点位置。",
  ];
}

function verifiedSpecLines(sku, data) {
  const group = productGroups[sku.groupKey];
  return [
    `Product name: ${data.productName}`,
    `Selected SKU: ${sku.id}`,
    `Selected specification: ${data.singleSpec}`,
    `Available purchase variants: ${group.purchaseVariants}`,
    `Extracted specification list: ${data.specList}`,
    data.dimensionList === "No verified single-filter dimensions provided" ? "" : `Verified single-filter dimensions: ${data.dimensionList}`,
    `Material: ${data.material}`,
    `Color: ${data.color}`,
    `Structure: ${data.structure}`,
    `Compatible use: ${data.fit}`,
    `Packaging count: ${sku.pack}. Use packaging count only as package quantity, never as product dimensions.`,
  ].filter(Boolean).join("\n");
}

function negativePrompt() {
  return "Avoid invented dimensions, borrowed measurements, fake specifications, unsupported compatibility claims, wrong material, wrong color, distorted product shape, extra accessories, random brand logos, watermark, messy layout, crowded text, unreadable labels, exaggerated effects, blurry product, and inconsistent scale.";
}

function sizeInstruction(data) {
  return data.dimensionList === "No verified single-filter dimensions provided"
    ? "No verified single-filter dimensions are provided. Do not add measurement arrows, size numbers, or placeholder dimensions. Show only the extracted specification, packaging quantity, material, structure, and compatible use."
    : `Use only these verified dimension texts: ${data.dimensionList}.`;
}

function promptFor(templateId, typeId, sku, data) {
  const facts = verifiedSpecLines(sku, data);
  const negative = negativePrompt();
  const commonRule = `Use only the verified product data provided below. If a parameter is blank or not provided, omit it completely. Do not borrow, infer, or invent any numbers.\n\nVerified data:\n${facts}\n\nNegative prompt: ${negative}`;

  const specPrompts = {
    "1": `Generate a premium Amazon hero image for one ${data.productName} based on the provided reference image. Combine a clean real-life ${data.scene} with a strong product focus. Show one large product as the dominant subject, preserving the true appearance, natural brown paper color, pressed edge structure, bottom fold, and proportions from the reference image.\n\nThis image should clearly represent the selected specification: ${data.singleSpec}. Allow only a small amount of clean text for 2-3 verified key parameters, such as ${sku.sizeCode}, ${data.material}, and ${data.structure}. ${commonRule}`,
    "2": `Generate a realistic Amazon lifestyle image for ${data.productName} based on the provided reference image. Show the selected ${sku.shape} being used in a natural ${data.scene}, with the product clearly visible and accurately scaled. The scene should help customers understand the real size, fit, and usage context of ${data.singleSpec}.\n\nUse soft natural lighting, a clean coffee environment, realistic paper texture, and premium e-commerce photography style. Add no text or only one very small verified specification label if needed. ${commonRule}`,
    "3A": `Generate a premium Amazon multi-scene lifestyle infographic for ${data.productName} based on the provided reference image. Show 3 to 4 realistic usage scenes in one clean collage layout: preparing the filter, placing it into the matching dripper, brewing coffee, and after-use disposal. Keep the product visible in every scene, with accurate scale, paper texture, color, and proportions.\n\nIf specification labels are needed, use only short verified labels such as ${sku.sizeCode}, ${data.singleSpec}, or ${data.fit}. ${commonRule}`,
    "3B": `Generate a premium Amazon step-by-step usage scene image for ${data.productName} based on the provided reference image. Show the real product in a practical workflow using 3 to 4 simple steps: fold the pressed edge, open the filter, place it into the matching dripper, add coffee grounds and brew.\n\nThe image should feel instructional but still premium and visually clean. Use realistic paper texture, consistent lighting, and a clean e-commerce layout. Add only short step labels and verified specification text if needed. ${commonRule}`,
    "4": `Generate a premium Amazon size reference infographic for ${data.productName} based on the provided reference image. Use a top-view focused composition with a bright, clean, premium e-commerce style. Show one product large and centered.\n\n${sizeInstruction(data)} Keep the product realistic, sharp, and proportionally accurate, with accurate natural paper texture. ${commonRule}`,
    "5": `Generate a premium Amazon infographic showing multiple specification options for ${data.productName} based on the provided reference images or verified product data. Present the available product options in a clean, visually organized layout: V02 / Fan 02 or U02 / Fan 04, with 100 pcs and 200 pcs package quantity options shown separately.\n\nShow realistic coffee filters with accurate shape, natural brown paper texture, pressed seams, and consistent scale relationship. Do not invent unavailable sizes or variants. ${commonRule}`,
    "6": `Generate a premium Amazon product feature image for ${data.productName} based on the provided reference image. Highlight only one verified specification-based selling point: ${data.feature1}.\n\nUse a clean bright background, realistic close-up paper texture, and minimal supporting text. Do not mix multiple major selling points in one image. ${commonRule}`,
    "7": `Generate a premium Amazon close-up detail image for ${data.productName} based on the provided reference image. Show macro-level detail of the natural paper fiber texture, pressed side seam, bottom fold, layered edge, and disposable paper structure.\n\nUse tasteful zoom-in composition, sharp realistic detail, and a clean premium layout. Add only very short verified labels if needed. ${commonRule}`,
    "8": `Generate a premium Amazon summary infographic for ${data.productName} based on the provided reference image. Use one clean central product image with a simple layout that visually recaps the main confirmed specifications: ${data.specList}, ${data.material}, ${data.structure}, and ${data.fit}.\n\nKeep the image minimal, organized, and easy to read at a glance. Do not include unverified specifications or unsupported compatibility claims. ${commonRule}`,
  };

  const featurePrompts = {
    "1": `Generate a professional Amazon main image for ${data.productName} based on the provided reference image. Preserve the exact product shape, material appearance, color, texture, structure, and proportions from the reference image. Show only the selected product clearly and prominently, centered in the frame, against a pure white background.\n\nNo props, packaging, text, logos, icons, extra accessories, or decorative elements. Focus on clean product identity. ${commonRule}`,
    "2": `Generate a realistic Amazon single-scene lifestyle image for ${data.productName} based on the provided reference image. Show one clear realistic scene only: ${data.scene}, where the coffee filter is being used through folding, placing into the dripper, adding coffee grounds, or pouring water.\n\nKeep the product large, sharp, and easy to recognize. If any text is added, use only one short headline of 2 to 4 words. ${commonRule}`,
    "3": `Generate a premium Amazon multi-scene lifestyle infographic for ${data.productName} based on the provided reference image. Show 4 to 6 realistic usage scenes in one clean grid or collage layout: folding, opening, placing, brewing, coffee dripping, and after-use disposal.\n\nIn every panel, the product must remain clearly visible and recognizable, with accurate shape, material texture, color, and proportions. ${commonRule}`,
    "4": `Generate a clean Amazon product display image showing accurate views of ${data.productName}: flat view, opened view, side seam close-up, bottom fold close-up, and stack view. Preserve the real paper texture, color, structure, and visible details from the reference image.\n\nUse a white or very light neutral background, professional lighting, realistic rendering, and clear spacing. ${commonRule}`,
    "5": `Generate a clean Amazon SKU selection image for the coffee filter product line based on verified product data. Show the available options in a neat horizontal or grid layout: V02 100/200 pcs, Fan 02 or U02 100/200 pcs, Fan 04 100/200 pcs.\n\nEach option should be clearly separated and easy to compare. Do not add unavailable variants. ${commonRule}`,
    "6": `Generate a realistic Amazon lifestyle selling-point image for ${data.productName} based on the provided reference image. Focus on one clear message only: ${data.feature1}. Show the natural brown paper texture and clean coffee brewing scene as visual proof.\n\nKeep the product large and clearly visible. If any text is added, use only one short headline: Natural Paper. ${commonRule}`,
    "7": `Generate a clean Amazon selling-point image for ${data.productName} based on the provided reference image. Focus on one clear message only: ${data.feature2}. Use a realistic close-up or simple brewing composition to highlight smooth filtration, pressed edges, and stable fit.\n\nAvoid busy infographic structures, dense text, extra icons, or unsupported claims. If any text is added, use only one short headline: Smooth Filtration. ${commonRule}`,
    "8": `Generate a clean Amazon summary image for ${data.productName} based on the provided reference image. Place the product in the center and summarize the product with only 4 short feature words around it: Natural Paper / Smooth Filtration / Pressed Edge / Multiple Sizes.\n\nKeep the layout very simple, airy, and easy to scan. ${commonRule}`,
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
  byId("skuFacts").innerHTML = skuFacts(sku).map(([name, value]) => `
    <div class="fact-item">
      <strong>${name}</strong>
      <span>${value}</span>
    </div>
  `).join("");
  byId("alibabaInfo").innerHTML = alibabaInfo(sku).map((item) => `<li>${item}</li>`).join("");
  byId("candidateSellingPoints").innerHTML = candidateSellingPoints.map((item) => `<li>${item}</li>`).join("");
  byId("primarySellingPoints").innerHTML = selectedSellingPoints().map((item) => `<li>${item}</li>`).join("");
  byId("amazonLogic").innerHTML = amazonLogic.map((item) => `<li>${item}</li>`).join("");
  byId("sourceConfidence").textContent = template.name;
  renderProductPromptGrid();
}

function compactPromptFor(typeId, sku) {
  const data = valueMap(sku);
  const prompt = promptFor(selectedTemplate().id, typeId, sku, data);
  return prompt.split("\n\n").slice(0, 2).join("\n\n");
}

function renderProductPromptGrid() {
  const grid = byId("productPromptGrid");
  if (!grid) return;

  const template = selectedTemplate();
  grid.innerHTML = productOutputOrder.map((groupKey, index) => {
    const group = productGroups[groupKey];
    const sku = representativeSku(groupKey);
    const previewTypes = template.imageTypes;
    return `
      <article class="product-output-card">
        <div class="product-output-head">
          <span>产品 ${index + 1}</span>
          <h3>${group.name}</h3>
          <p>${group.purchaseVariants}</p>
        </div>
        <div class="mini-prompt-list">
          ${previewTypes.map((type) => `
            <div class="mini-prompt">
              <strong>${type.name}</strong>
              <textarea readonly spellcheck="false">${escapeHtml(compactPromptFor(type.id, sku))}</textarea>
            </div>
          `).join("")}
        </div>
      </article>
    `;
  }).join("");
}

function renderPrompt() {
  const sku = selectedSku();
  const template = selectedTemplate();
  const data = currentFields();
  let prompt = template.imageTypes.map((type) => `## ${type.name}\n\n${promptFor(template.id, type.id, sku, data)}`).join("\n\n---\n\n");
  if (byId("languageSelect").value === "zh") {
    prompt = `中文备注：当前选择 ${sku.label}；当前模板为 ${template.name}；图片类型由模板决定并一次性输出；资料没有明确的参数不借鉴、不补写。\n\n${prompt}`;
  }
  byId("promptTitle").textContent = `${template.name} · 完整图组`;
  byId("promptOutput").value = prompt;
}

function renderAll() {
  renderFacts();
  renderPrompt();
}

function allPromptsForSku() {
  const sku = selectedSku();
  const template = selectedTemplate();
  const data = currentFields();
  return template.imageTypes.map((type) => `## ${type.name}\n\n${promptFor(template.id, type.id, sku, data)}`).join("\n\n---\n\n");
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
  byId("languageSelect").addEventListener("change", renderAll);
  byId("resetFields").addEventListener("click", () => {
    renderFields(true);
    renderAll();
  });
  byId("copyCurrent").addEventListener("click", () => copyText(byId("promptOutput").value, "已复制当前模板完整图组。"));
  byId("copyAll").addEventListener("click", () => copyText(allPromptsForSku(), "已复制该 SKU 当前模板图组。"));
}

init();
