const sourceNotes = {
  purchase: "采购单主口径：确认 6 个采购项 / SKU；合并相同形状和规格后，为 3 款基础产品规格。",
  alibaba: "1688 辅助口径：补充材质、形状、适配对象、盒装信息、单片结构和可视化卖点。",
  amazon: "竞品参考口径：只参考作图逻辑和卖点优先级，不反向新增采购单未确认的产品款式。",
};

const productGroups = {
  v02: {
    name: "V02 V形滤纸",
    purchaseVariants: "V02 100片/盒、V02 200片/盒",
    productCountNote: "采购单计 2 个 SKU；基础产品计 1 款",
    alibabaPack: "1688 示例：V02，100片/盒，约 138g/盒，外盒约 130 x 200 x 17 mm，1-4人份",
    evidenceNote: "100/200 是包装数量，不是单片尺寸；单片尺寸需实测或保留占位。",
  },
  u02: {
    name: "扇形02 / U02 滤纸",
    purchaseVariants: "扇形02 100片/盒、扇形U02 200片/盒",
    productCountNote: "采购单计 2 个 SKU；基础产品计 1 款",
    alibabaPack: "1688 示例：#02 / U102，100片/盒，约 142g/盒，外盒约 170 x 200 x 17 mm，2-6人份",
    evidenceNote: "采购单中的“扇形02”和“扇形U02”按同一基础规格处理，包装数量分开。",
  },
  u04: {
    name: "扇形04 滤纸",
    purchaseVariants: "扇形04 100片/盒、扇形04 200片/盒",
    productCountNote: "采购单计 2 个 SKU；基础产品计 1 款",
    alibabaPack: "1688 示例：盒面显示 #04 / 8-12 cups，100片/盒，约 185g/盒，外盒约 230 x 200 x 17 mm",
    evidenceNote: "1688 局部文案出现 #03 / #04 不一致，产品命名以采购单“扇形04”为主。",
  },
};

const borrowedDimensions = {
  v02: {
    topWidth: "【V02单片顶部宽度】（借鉴：5.2 in / 13 cm）",
    sideLength: "【V02单片侧边长度】（借鉴：4.8 in / 12 cm）",
    bottomWidth: "【V02底部折边宽度】（请实测替换）",
    cupRange: "1-4 cup pour-over brewing",
    source: "借鉴 V60-02 相似滤纸参数，待实测替换",
  },
  u02: {
    topWidth: "【扇形02单片顶部宽度】（借鉴：5 in / 12.7 cm）",
    sideLength: "【扇形02单片侧边高度】（借鉴：4 in / 10 cm）",
    bottomWidth: "【扇形02底部宽度】（借鉴：1.75-2 in / 4.5-5 cm）",
    cupRange: "2-6 cup drip or pour-over brewing",
    source: "借鉴 #2 扇形/梯形咖啡滤纸参数，待实测替换",
  },
  u04: {
    topWidth: "7.56 in / 19.2 cm（借鉴 Amazon #4 相似品单片尺寸）",
    sideLength: "4.53 in / 11.5 cm（借鉴 Amazon #4 相似品单片尺寸）",
    bottomWidth: "1.97 in / 5.0 cm（借鉴 Amazon #4 相似品单片尺寸）",
    height: "4.84 in / 12.3 cm（借鉴 Amazon #4 相似品单片尺寸）",
    cupRange: "8-12 cup drip coffee maker",
    source: "借鉴 Amazon #4 相似品尺寸图，待实测替换",
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
    dims: borrowedDimensions.v02,
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
    dims: borrowedDimensions.u02,
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
    dims: borrowedDimensions.v02,
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
    dims: borrowedDimensions.u04,
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
    dims: borrowedDimensions.u04,
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
    dims: borrowedDimensions.u02,
    fit: "#2 fan-shaped dripper, trapezoid filter cup, small drip coffee maker",
  },
];

const imageTypes = [
  { id: "1", name: "1. 单款主图（无文字）" },
  { id: "2", name: "2. 生活场景图" },
  { id: "3A", name: "3A. 多场景使用图" },
  { id: "3B", name: "3B. 使用步骤图" },
  { id: "4", name: "4. 单片尺寸参数图" },
  { id: "5", name: "5. 多规格可选图" },
  { id: "6", name: "6. 功能 / 卖点图" },
  { id: "7", name: "7. 细节放大图" },
  { id: "8", name: "8. 总卖点图" },
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
  ["fit", "适配对象", ""],
  ["scene", "使用场景", "home pour-over coffee brewing / drip coffee maker setup"],
  ["feature", "主卖点", "smooth filtration, stable fit, natural unbleached paper texture"],
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

function selectedImageType() {
  return imageTypes.find((item) => item.id === byId("imageSelect").value) || imageTypes[0];
}

function valueMap(sku) {
  return {
    productName: "unbleached natural coffee paper filters",
    material: "natural wood pulp paper / unbleached brown paper",
    color: "natural brown",
    structure: "disposable paper filter with pressed side seam and bottom fold",
    topWidth: sku.dims.topWidth || "【单片顶部宽度】",
    sideLength: sku.dims.sideLength || sku.dims.height || "【单片侧边高度】",
    bottomWidth: sku.dims.bottomWidth || "【单片底部宽度】",
    fit: sku.fit,
    scene: "home pour-over coffee brewing / drip coffee maker setup",
    feature: "smooth filtration, stable fit, natural unbleached paper texture",
  };
}

function fillSelects() {
  byId("skuSelect").innerHTML = skus.map((sku) => `<option value="${sku.id}">${sku.label}</option>`).join("");
  byId("imageSelect").innerHTML = imageTypes.map((type) => `<option value="${type.id}">${type.name}</option>`).join("");
}

function renderFields(reset = false) {
  const sku = selectedSku();
  const values = valueMap(sku);
  const fieldList = byId("fieldList");
  fieldList.innerHTML = fields.map(([key, label, fallback]) => {
    const value = reset ? (values[key] || fallback) : (byId(`field-${key}`)?.value || values[key] || fallback);
    const note = ["topWidth", "sideLength", "bottomWidth"].includes(key) ? `<p class="field-note">${sku.dims.source}</p>` : "";
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
    ["1688 盒装参考", group.alibabaPack],
    ["口径备注", group.evidenceNote],
    ["尺寸来源", sku.dims.source],
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

function promptFor(typeId, sku, data) {
  const common = `Product: ${data.productName}. Selected SKU: ${sku.id}. Selected specification: ${sku.shape}. Packaging count: ${sku.pack}, but use packaging count only when the image topic is package quantity; do not use it as a single-filter dimension. Single-filter parameters: top width ${data.topWidth}, side / height ${data.sideLength}, bottom width ${data.bottomWidth}. Material: ${data.material}. Color: ${data.color}. Structure: ${data.structure}. Compatible use: ${data.fit}.`;

  const negative = "Keep the product realistic, sharp, proportionally accurate, and faithful to the reference image. Do not invent unsupported dimensions, brand logos, certification marks, exaggerated effects, or unrelated accessories.";

  const templates = {
    "1": `Generate a premium Amazon main image for one ${data.productName} based on the provided reference image. Show the coffee filter as the dominant subject on a pure white background, either one clearly opened filter or a neat stack with one filter standing up to show the shape. Preserve the natural brown paper color, fine fiber texture, pressed side seam, bottom fold, and true proportions.\n\nImportant compliance rule: the first main image must contain no text, no labels, no icons, no badges, no packaging quantity, no props, and no lifestyle background. ${negative}\n\n${common}`,
    "2": `Generate a realistic Amazon lifestyle image for ${data.productName} based on the provided reference image. Show the selected ${sku.shape} being used in a clean ${data.scene}. The filter should be clearly visible inside the matching dripper, with hot water pouring over coffee grounds and brewed coffee dripping into a glass server.\n\nUse warm natural lighting, a premium home coffee bar atmosphere, and accurate scale. Add only one short verified headline if needed, such as "Smooth Pour Over Filtration"; avoid dense text. ${negative}\n\n${common}`,
    "3A": `Generate a premium Amazon multi-scene lifestyle infographic for ${data.productName}. Create 3 to 4 clean panels showing realistic use contexts: preparing the filter, placing it into the dripper, brewing coffee, and disposing after use. Keep the selected ${sku.shape} visible in every panel with consistent natural brown paper texture.\n\nUse short labels only if needed. Do not add a large parameter table. Focus on showing fit, scale, and everyday coffee use. ${negative}\n\n${common}`,
    "3B": `Generate a premium Amazon step-by-step usage image for ${data.productName}. Use a clean 6-step grid: 1 fold the side seam, 2 fold the bottom edge, 3 open the paper filter, 4 place it into the matching dripper, 5 add coffee grounds, 6 pour hot water and brew. Keep the filter shape accurate for ${sku.shape}.\n\nUse minimal step numbers and short labels. Do not include unverified brewing claims. ${negative}\n\n${common}`,
    "4": `Generate a premium Amazon size reference infographic for a single sheet of ${data.productName}. Show one flat single coffee filter centered on a bright clean background, with simple measurement arrows for top width, side / height, and bottom width.\n\nUse these exact editable dimension texts: Top Width: ${data.topWidth}; Side / Height: ${data.sideLength}; Bottom Width: ${data.bottomWidth}. Do not include ${sku.pack} as a dimension. Do not show box size. ${negative}\n\n${common}`,
    "5": `Generate a premium Amazon multiple-specification options image for ${data.productName}. Present the available product options in a clean comparison layout: V02, fan-shaped 02 / U02, and fan-shaped 04. Show the filters with realistic relative scale, natural brown paper texture, pressed seams, and bottom folds.\n\nUse concise labels only: "V02", "Fan 02 / U02", "Fan 04", and optional package labels "100 PCS / 200 PCS" in a separate small row. Do not mix package count with single-filter dimensions. ${negative}\n\n${common}`,
    "6": `Generate a premium Amazon feature image for ${data.productName}. Highlight one verified specification-based selling point: ${data.feature}. Use a clean close-up of the natural paper texture and brewed coffee flow through the filter, with a bright premium e-commerce style.\n\nUse minimal supporting text, such as "Natural Wood Pulp Paper" or "Smooth Filtration". Do not claim medical, certified, or absolute performance benefits. ${negative}\n\n${common}`,
    "7": `Generate a premium Amazon close-up detail image for ${data.productName}. Show macro details of the paper fiber texture, pressed side seam, bottom fold, and layered edge of the selected ${sku.shape}. Use tasteful zoom-in callouts with very short labels.\n\nKeep the paper natural brown and realistic, showing the thin disposable paper structure without making it look like fabric, plastic, or wood board. ${negative}\n\n${common}`,
    "8": `Generate a premium Amazon summary infographic for ${data.productName}. Use one central realistic product image and a clean specification recap around it: ${sku.sizeCode}, ${data.material}, ${data.structure}, compatible with ${data.fit}, and single-filter dimensions ${data.topWidth}, ${data.sideLength}, ${data.bottomWidth}.\n\nKeep the layout organized and readable, with short labels and enough spacing. Do not overcrowd the image. Do not include unverified claims or box dimensions. ${negative}\n\n${common}`,
  };

  return templates[typeId];
}

function renderFacts() {
  const sku = selectedSku();
  byId("currentTitle").textContent = `${sku.id} 资料提炼`;
  byId("badges").innerHTML = [
    "采购单为主",
    "1688 为辅助",
    "竞品只筛卖点",
    "2 个主卖点展示",
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
  byId("sourceConfidence").textContent = sku.dims.source.includes("借鉴") ? "含借鉴尺寸" : "资料确认";
  renderProductPromptGrid();
}

function compactPromptFor(typeId, sku) {
  const data = valueMap(sku);
  const prompt = promptFor(typeId, sku, data);
  return prompt.split("\n\n").slice(0, 2).join("\n\n");
}

function renderProductPromptGrid() {
  const grid = byId("productPromptGrid");
  if (!grid) return;

  grid.innerHTML = productOutputOrder.map((groupKey, index) => {
    const group = productGroups[groupKey];
    const sku = representativeSku(groupKey);
    return `
      <article class="product-output-card">
        <div class="product-output-head">
          <span>产品 ${index + 1}</span>
          <h3>${group.name}</h3>
          <p>${group.purchaseVariants}</p>
        </div>
        <div class="mini-prompt-list">
          <div class="mini-prompt">
            <strong>图 1：主图</strong>
            <textarea readonly spellcheck="false">${escapeHtml(compactPromptFor("1", sku))}</textarea>
          </div>
          <div class="mini-prompt">
            <strong>图 2：卖点图</strong>
            <textarea readonly spellcheck="false">${escapeHtml(compactPromptFor("6", sku))}</textarea>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function renderPrompt() {
  const sku = selectedSku();
  const type = selectedImageType();
  const data = currentFields();
  let prompt = promptFor(type.id, sku, data);
  if (byId("languageSelect").value === "zh") {
    prompt = `中文备注：当前选择 ${sku.label}；第 1 张主图必须无文字；尺寸只写单片滤纸参数；含“借鉴”的尺寸请后续用实测值替换。\n\n${prompt}`;
  }
  byId("promptTitle").textContent = type.name;
  byId("promptOutput").value = prompt;
}

function renderAll() {
  renderFacts();
  renderPrompt();
}

function allPromptsForSku() {
  const sku = selectedSku();
  const data = currentFields();
  return imageTypes.map((type) => `## ${type.name}\n\n${promptFor(type.id, sku, data)}`).join("\n\n---\n\n");
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
  byId("imageSelect").addEventListener("change", renderAll);
  byId("languageSelect").addEventListener("change", renderAll);
  byId("resetFields").addEventListener("click", () => {
    renderFields(true);
    renderAll();
  });
  byId("copyCurrent").addEventListener("click", () => copyText(byId("promptOutput").value, "已复制当前提示词。"));
  byId("copyAll").addEventListener("click", () => copyText(allPromptsForSku(), "已复制该 SKU 全部 8 张提示词。"));
}

init();
