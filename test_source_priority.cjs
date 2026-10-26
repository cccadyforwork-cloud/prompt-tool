const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const source = fs.readFileSync(`${__dirname}/app.js`, "utf8");
const supplement = source.slice(
  source.indexOf("function competitorVisionSupplement("),
  source.indexOf("function extractCollectedImageCandidates(")
);
const pendingFacts = source.slice(
  source.indexOf("function competitorImageFacts("),
  source.indexOf("async function extractCompetitorSources(")
);
const context = {
  cleanFieldDisplayValue: (value) => String(value || "").trim(),
  semanticDimensionItems: (items) => items.filter(Boolean),
  uniquePromptItems: (items) => [...new Set(items.filter(Boolean))],
  normalizeSellingPointEntries: (items) => items,
  explicitSurfaceFinishValues: (value) => value,
  validProductWeightValue: (value) => value,
  validCapacityValue: (value) => value,
  validApplicableRangeValue: (value) => value,
  skuRelevantPackValue: (value) => value,
  dimensionListItems: (value) => value ? [value] : [],
  dimensionFieldsFromDimensionList: () => ({}),
  splitSellingPointText: (value) => String(value || "").split("\n").filter(Boolean),
};
vm.createContext(context);
vm.runInContext(`${pendingFacts}\n${supplement}`, context);

const evidence = { evidence: "Shown on competitor image", image_url: "https://example.com/image.jpg" };
const result = {
  attributes: [
    { field: "Material", value: "paper", ...evidence },
    { field: "Structure", value: "cone", ...evidence },
    { field: "Capacity", value: "500 ml", ...evidence },
    { field: "Technology", value: "printed", evidence: "", image_url: evidence.image_url },
  ],
  dimension_evidence: [{ dimension: "Width: 16 cm", ...evidence }],
  use_scenes: [{ scene: "Pour-over coffee", ...evidence }],
  selling_points: [{ claim: "Easy to use", ...evidence }],
};
const products = [
  { id: "A", material: "cotton", structure: "", capacity: "", dimensionList: "", sellingPoints: "", fieldSources: { material: "Amazon Child SKU标题" } },
  { id: "B", material: "", structure: "", capacity: "", dimensionList: "", sellingPoints: "", fieldSources: {} },
];
const merged = context.applyCompetitorVisionSupplement(products, result, new Set(["A"]));
assert.equal(merged[0].material, "cotton", "competitor evidence must not overwrite a higher-priority fact");
assert.equal(merged[0].fieldSources.material, "Amazon Child SKU标题");
assert.equal(merged[0].structure, "cone");
assert.equal(merged[0].capacity, "500 ml");
assert.equal(merged[0].fieldSources.capacity, "竞品图组 · 豆包识别");
assert.equal(merged[0].surfaceFinish, undefined, "claims without image evidence must be ignored");
assert.match(merged[0].dimensionList, /Width: 16 cm/);
assert.equal(merged[0].sellingPoints, "Easy to use");
assert.equal(merged[0].scene, "Pour-over coffee");
assert.equal(merged[1], products[1], "unbound SKUs must remain unchanged");

const competitorResult = {
  ...result,
  attributes: [...result.attributes,
    { field: "Color", value: "Black", ...evidence },
    { field: "ProductCount", value: "200 Pcs", ...evidence }],
};
const titleDimensions = "[VERIFIED_DIMENSIONS: SKU Dimension 1: 13 in; SKU Dimension 2: 8.66 in]";
const routeTwoProducts = [
  { id: "A", color: "White", pack: "100 Pcs", material: "Cotton", capacity: "250 ml", structure: "Manual structure", dimensionList: titleDimensions,
    fieldSources: { color: "Amazon Child SKU标题", pack: "Amazon Child SKU标题", material: "Amazon Child SKU标题", capacity: "Amazon Child SKU标题", productDimensions: "Amazon Child SKU标题明确尺寸", structure: "人工修改" } },
  { id: "B", color: "", pack: "", material: "", dimensionList: "", fieldSources: {} },
];
const defaults = context.applyCompetitorVisionSupplement(routeTwoProducts, competitorResult, new Set(["A", "B"]), { includeVariantFields: true });
assert.equal(defaults[0].dimensionList, titleDimensions, "Amazon dimensions win as a complete field; conflicting competitor dimensions are not appended");
assert.equal(defaults[0].fieldSources.productDimensions, "Amazon Child SKU标题明确尺寸");
assert.equal(defaults[0].color, "White");
assert.equal(defaults[0].pack, "100 Pcs");
assert.equal(defaults[0].material, "Cotton");
assert.equal(defaults[0].capacity, "250 ml");
assert.equal(defaults[0].structure, "Manual structure");
assert.equal(defaults[0].fieldSources.structure, "人工修改");
assert.equal(defaults[1].color, "Black");
assert.equal(defaults[1].pack, "200 Pcs");
assert.equal(defaults[1].material, "paper");
assert.equal(defaults[1].fieldSources.material, "竞品图组 · 豆包识别");
assert.match(defaults[1].dimensionList, /Width: 16 cm/);
assert.equal(defaults[1].scene, "Pour-over coffee");
assert.equal(defaults[1].sellingPoints, "Easy to use");

// The explicitly selected Amazon SKU receives supplier facts even when a
// supplier's old color/model would have matched a different Amazon SKU.
Object.assign(context, {
  defaultProductName: (product) => product.productName || "",
  displayVariantText: (value) => value,
  cleanTokenValue: (value) => value,
  englishOnlyProductName: (value) => value,
  mergeVerifiedDimensionLists: () => ({ dimensions: [], dimensionList: "", conflicts: [] }),
  verifiedSupplierMeasurementValue: () => "",
  uniqueExtractedSellingPoints: (items) => items.filter(Boolean),
  isOrdinaryMaterialSellingPoint: () => false,
  sellingPointKey: (value) => value,
  SELLING_POINT_SOURCE_UNKNOWN: "unknown",
  amazonSkuTitleQuantityFacts: (product) => product.amazonTitle?.includes("100 Count")
    ? { count: 100, label: "100 Count" } : null,
  compactPromptItems: (items) => items.filter(Boolean).join("; "),
});
vm.runInContext(source.slice(
  source.indexOf("function mergedAmazonProductWithSupplierFacts("),
  source.indexOf("function resolveSupplierBindingScope(")
), context);
vm.runInContext(source.slice(
  source.indexOf("function scopeSupplierFieldSources("),
  source.indexOf("function amazonSkuTitleQuantityFacts(")
), context);
const amazonProducts = [
  { id: "Amazon-A", model: "Amazon-A", label: "White", sizeCode: "Small", color: "White", pack: "", productName: "Coffee filter", amazonTitle: "Coffee filter", fieldSources: { color: "Amazon Child SKU颜色字段" } },
  { id: "Amazon-B", model: "Amazon-B", label: "Black", sizeCode: "Large", color: "Black", pack: "100 Count", productName: "Coffee filter", amazonTitle: "Coffee filter 100 Count", fieldSources: { color: "Amazon Child SKU颜色字段" } },
];
const supplierFacts = { id: "1688-SKU", model: "supplier-model", color: "Black", pack: "500 Pcs", material: "Paper", productName: "Coffee filter", fieldSources: { material: "1688详情图 · 豆包识别" } };
const childResult = context.mergeAmazonProductsWithSupplierFacts(amazonProducts, supplierFacts,
  { kind: "child", targets: [amazonProducts[0]] });
assert.equal(childResult.products.length, 2);
assert.equal(childResult.products[0].id, "Amazon-A");
assert.equal(childResult.products[0].model, "Amazon-A");
assert.equal(childResult.products[0].sizeCode, "Small");
assert.equal(childResult.products[0].color, "White");
assert.equal(childResult.products[0].pack, "", "1688 quantity must not fill an empty Amazon count");
assert.equal(childResult.products[0].material, "Paper");
assert.equal(childResult.products[1], amazonProducts[1], "color similarity must not redirect the explicit binding");
const parentResult = context.mergeAmazonProductsWithSupplierFacts(amazonProducts, supplierFacts,
  { kind: "parent", parentSku: "Amazon-parent", targets: amazonProducts });
assert.equal(parentResult.products[1].color, "Black");
assert.equal(parentResult.products[1].pack, "100 Count");
assert.equal(parentResult.products[1].material, "Paper");
console.log("source priority regression passed");
