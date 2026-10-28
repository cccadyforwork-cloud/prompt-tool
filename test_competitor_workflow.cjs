const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const source = fs.readFileSync(`${__dirname}/app.js`, "utf8");
const section = (start, end) => source.slice(source.indexOf(start), source.indexOf(end, source.indexOf(start)));
const field = (value = "") => ({ value, textContent: "", disabled: false, setAttribute() {}, removeAttribute() {} });
const controls = { extractSources: field(), extractStatus: field(), "field-scene": field("Pour-over coffee"), enrichUseScenes: field(), sceneEnrichStatus: field() };
const url = "https://m.media-amazon.com/images/I/fixture.jpg";
const proof = { evidence: "Visible text", image_url: url };
const titleSize = "[VERIFIED_DIMENSIONS: SKU Dimension 1: 13 in; SKU Dimension 2: 8.66 in]";
const amazon = [
  { id: "A", model: "A", amazonTitle: "Coffee filter 13 by 8.66 in", productName: "Coffee filter", material: "Paper", color: "Brown", pack: "100 Count", dimensionList: titleSize, fieldSources: { material: "Amazon Child SKU标题", productDimensions: "Amazon Child SKU标题明确尺寸" } },
  { id: "B", model: "B", amazonTitle: "Coffee filter", productName: "Coffee filter", material: "", dimensionList: "", fieldSources: {} },
];
const result = {
  attributes: [{ field: "Material", value: "Cotton", ...proof }, { field: "Structure", value: "Cone shape", ...proof }],
  dimension_evidence: [{ dimension: "Width: 99 cm", ...proof }],
  selling_points: [{ claim: "Easy to use", ...proof }],
  use_scenes: [{ scene: "Pour-over coffee", ...proof }],
  selected_images: [{ url }], evidence_urls: [url],
};
const reviews = {};
const auto = [];
const context = vm.createContext({
  selectedExtractionRoute: "competitor", extractionGeneration: 0, hasUserSourceAttempt: false,
  extractedProducts: [], sourcePayload: {}, fieldOverrides: {}, fieldOverridesBySku: {},
  sellingPointInputRevision: 0, sceneInputRevision: 0,
  sellingPointResearchAttemptedBySku: new Set(),
  sellingPointOnlineStateBySku: new Map(),
  MAX_PRODUCT_ANALYSIS_IMAGE_URLS: 200,
  SELLING_POINT_SOURCE_UNKNOWN: "unknown", SELLING_POINT_SOURCE_MANUAL: "manual",
  SELLING_POINT_SOURCE_TRANSLATED: "translated", NO_REFERENCE_SCENE_MESSAGE: "No scenes",
  byId: (id) => controls[id], document: { querySelectorAll: () => [] },
  cleanFieldDisplayValue: (value) => String(value || "").trim(),
  semanticDimensionItems: (items) => items.filter(Boolean),
  dimensionListItems: (value) => value ? [value] : [], dimensionFieldsFromDimensionList: () => ({}),
  explicitSurfaceFinishValues: (value) => value, skuRelevantPackValue: (value) => value,
  validProductWeightValue: (value) => value, validCapacityValue: (value) => value,
  validApplicableRangeValue: (value) => value,
  uniquePromptItems: (items) => [...new Set(items.filter(Boolean))],
  splitSellingPointText: (value) => String(value || "").split("\n").filter(Boolean),
  sourceInputFiles: (id) => [{ name: id === "amazonTemplateFile" ? "Amazon.xlsx" : "competitor.html" }],
  extractAmazonTemplateProducts: async () => ({ products: amazon, sourceText: "Amazon fixture" }),
  populateCompetitorSkuBinding() {}, competitorAnalysisScope: () => ({ kind: "child", targets: [amazon[0]] }),
  readNamedTextFiles: async () => [{ name: "competitor.html", text: "fixture" }],
  extractAmazonCompetitorImageCandidates: () => [{ url }], uniqueByUrl: (items) => items,
  imageCandidateUrl: (item) => item.url,
  fetch: async () => ({ ok: true, json: async () => result }),
  sellingPointReviewForSku: (sku) => reviews[sku.id] ||= { locked: false, candidateEntries: [], history: [] },
  addSellingPointCandidates: (sku, entries) => { reviews[sku.id].candidateEntries = entries; },
  applyLockedSellingPointReview: (sku) => { sku.sellingPoints = "Locked manual claim"; },
  persistSellingPointReviews() {}, renderProductSelect() {}, renderFields() {}, renderAll() {},
  autoEnrichSellingPointsIfNeeded: () => auto.push("points"),
  autoEnrichUseScenesIfNeeded: () => auto.push("scenes"),
  escapeHtml: (value) => String(value), displaySourceCategory: (value) => value,
  selectedSku: () => context.extractedProducts[0], hasExtractedProducts: () => true,
  currentProducts: () => context.extractedProducts,
  splitUseSceneText: (text) => text.split("\n").filter(Boolean),
  comparablePromptItem: (text) => text.toLowerCase(),
  currentSceneResearchFacts: () => ({}), applyOnlineProductKeyword() {},
  suggestedUseSceneItems: (_facts, research) => research.scenes,
  captureFieldOverrides() {}, currentFieldSignature: () => controls["field-scene"].value,
});
vm.runInContext([
  section("function normalizeSellingPointEntries(", "function loadSellingPointReviews("),
  section("function competitorVisionSupplement(", "function extractCollectedImageCandidates("),
  section("function competitorImageFacts(", "async function extractSources("),
  section("function sellingPointReviewHtml(", "async function addManualSellingPointCandidate("),
].join("\n"), context);

async function main() {
  await context.extractCompetitorSources();
  assert.equal(context.extractedProducts[0].dimensionList, titleSize);
  assert.equal(context.extractedProducts[0].material, "Paper");
  assert.equal(context.extractedProducts[0].structure, "Cone shape");
  assert.equal(context.extractedProducts[0].sellingPoints, "Easy to use");
  assert.equal(context.extractedProducts[1].material, "", "explicit child scope cannot leak into another SKU");
  assert.deepEqual(auto, ["points", "scenes"]);
  const html = context.sellingPointReviewHtml(context.extractedProducts[0]);
  assert.match(html, /id="supplementSellingPointChoices">联网补充/);
  assert.doesNotMatch(html, /逐字段|确认采用|待人工确认/);
  assert.match(controls.extractStatus.textContent, /统一确认/);
  reviews.A.locked = true;
  await context.extractCompetitorSources();
  assert.equal(context.extractedProducts[0].sellingPoints, "Locked manual claim", "ordinary reparsing must preserve locked claims");

  // A parallel selling-point result replaces the DOM while scene research is
  // in flight. The scene result must update the current input, preserving vision.
  vm.runInContext(section("function missingOnlineUseScenes(", "function hasVerifiedUseContext("), context);
  let resolveScenes;
  context.fetchOnlineUseSceneResearch = () => new Promise((resolve) => { resolveScenes = resolve; });
  const oldInput = controls["field-scene"];
  const request = context.enrichUseScenesOnline();
  controls["field-scene"] = field("Pour-over coffee");
  resolveScenes({ scenes: ["Pour-over coffee", "Home brewing", "Morning coffee"] });
  await request;
  assert.equal(oldInput.value, "Pour-over coffee");
  assert.equal(controls["field-scene"].value, "Pour-over coffee\nHome brewing\nMorning coffee");
  assert.match(context.extractedProducts[0].fieldSources.scene, /竞品图组.*联网补充/);
  assert.equal(context.extractedProducts[0].dimensionList, titleSize);

  controls["field-scene"] = field("Pour-over coffee");
  const manualRequest = context.enrichUseScenesOnline();
  controls["field-scene"].value = "Manual scene";
  context.sceneInputRevision += 1;
  resolveScenes({ scenes: ["Online scene"] });
  await manualRequest;
  assert.equal(controls["field-scene"].value, "Manual scene");

  const confirmationRequest = context.enrichUseScenesOnline();
  context.extractedProducts[0].confirmedSellingPointPlanInput = "confirmed now";
  resolveScenes({ scenes: ["Online scene"] });
  await confirmationRequest;
  assert.equal(controls["field-scene"].value, "Manual scene", "late web research must not change a newly confirmed set");

  vm.runInContext(section("function autoEnrichSellingPointsIfNeeded(", "async function fetchLocalUseSceneProxy("), context);
  reviews.A.locked = false;
  controls["field-sellingPoints"] = field();
  let researchCalls = 0;
  context.enrichSellingPointsOnline = () => { researchCalls += 1; };
  context.selectedExtractionRoute = "web";
  context.autoEnrichSellingPointsIfNeeded();
  assert.equal(researchCalls, 0, "existing image candidates do not trigger needless web research");
  reviews.A.candidateEntries = [];
  context.autoEnrichSellingPointsIfNeeded();
  context.selectedExtractionRoute = "competitor";
  context.autoEnrichSellingPointsIfNeeded();
  assert.equal(researchCalls, 2, "the same Amazon SKU has independent web attempts in routes 01 and 02");
  controls["field-sellingPoints"].value = "Image-backed claim";
  context.sellingPointResearchAttemptedBySku = new Set();
  context.autoEnrichSellingPointsIfNeeded();
  assert.equal(researchCalls, 2);

  vm.runInContext(section("function setSellingPointOnlineState(", "async function fetchLocalSellingPointProxy(")
    + section("async function enrichSellingPointsOnline(", "function autoEnrichSellingPointsIfNeeded("), context);
  let resolvePoints;
  context.fetchLocalSellingPointProxy = () => new Promise((resolve) => { resolvePoints = resolve; });
  controls["field-sellingPoints"].value = "";
  const pointsRequest = context.enrichSellingPointsOnline();
  controls["field-sellingPoints"].value = "Image result arrived first";
  resolvePoints({ selling_points: ["Lower priority web claim"] });
  await pointsRequest;
  assert.equal(controls["field-sellingPoints"].value, "Image result arrived first");

  controls["field-sellingPoints"].value = "";
  const lockedRequest = context.enrichSellingPointsOnline();
  reviews.A.locked = true;
  resolvePoints({ selling_points: ["Lower priority web claim"] });
  await lockedRequest;
  assert.equal(controls["field-sellingPoints"].value, "");
  console.log("Competitor defaults, whole-form review and web supplementation passed.");
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
