const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const source = fs.readFileSync(`${__dirname}/app.js`, "utf8");
const start = source.indexOf("async function readBackgroundVisionResult(");
const end = source.indexOf("function setSellingPointOnlineState(", start);
assert.ok(start >= 0 && end > start);
async function testSellingPointResearchPollAndDedup() {
  const helperStart = source.indexOf('async function fetchLocalSellingPointProxy(');
  const helperEnd = source.indexOf('async function supplementSellingPointCandidatesOnline(', helperStart);
  assert.ok(helperStart >= 0 && helperEnd > helperStart);
  const calls = [];
  let replies = [
    {status: 202, body: {job_id: 'selling-task'}},
    {status: 202, body: {status: 'pending'}},
    {status: 200, body: {selling_points: ['Machine washable chenille mop pad'], errors: []}},
  ];
  const context = vm.createContext({
    AbortController, DOMException, encodeURIComponent,
    window: {setTimeout: () => 1, clearTimeout: () => {}},
    setTimeout: callback => callback(),

    currentSourceFingerprint: () => 'synthetic-source',
    sellingPointResearchRequests: new Map(),
    fetch: async (url, options = {}) => {
      calls.push({url, options});
      const reply = replies.shift();
      assert.ok(reply, 'unexpected selling-point request');
      return {ok: reply.status >= 200 && reply.status < 300, status: reply.status,
        json: async () => reply.body};
    },
  });
  vm.runInContext(source.slice(start, end) + source.slice(helperStart, helperEnd), context);
  const facts = {productName: 'Chenille mop pad', selectedSpec: 'White 2 Pieces'};
  const [first, second] = await Promise.all([
    context.fetchLocalSellingPointProxy(facts), context.fetchLocalSellingPointProxy(facts),
  ]);
  assert.equal(first.selling_points[0], 'Machine washable chenille mop pad');
  assert.equal(second.selling_points[0], first.selling_points[0]);
  assert.equal(calls.filter(call => call.options.method === 'POST').length, 1);
  assert.equal(JSON.parse(calls[0].options.body).async, true);
  assert.ok(calls.every(call => call.url.startsWith('/api/')));
  replies = [{status: 200, body: {selling_points: [], errors: ['Doubao API HTTP 503']}}];
  await assert.rejects(context.fetchLocalSellingPointProxy(facts), /Doubao API HTTP 503/);
  assert.match(source, /id="sellingPointOnlineStatus"[^>]*role="status"/);
  console.log('selling-point web research polls asynchronously, deduplicates requests and shows provider errors');
}
testSellingPointResearchPollAndDedup().catch(error => {console.error(error); process.exitCode = 1;});

function testWorkspaceSkuIsOnlyTheInitialDefault() {
  const products = [
    { id: "DEMO-Cup-Blue", label: "Blue" },
    { id: "DEMO-Cup-Pink", label: "Pink" },
  ];
  const select = { value: "DEMO-Cup-Pink", disabled: true, title: "", innerHTML: "" };
  const boundWorkspace = { sku: "DEMO-Cup-Blue" };
  const productMatchesBoundSku = (product, sku = boundWorkspace.sku) => product.id === sku;
  const helpers = {
    currentProducts: () => products,
    hasExtractedProducts: () => true,
    byId: () => select,
    boundWorkspace,
    productMatchesBoundSku,
    escapeHtml: (value) => value,
    skuDisplayLabel: (sku) => sku.label,
  };
  const selectedStart = source.indexOf("function selectedSku(");
  const selectedEnd = source.indexOf("function supplierParentGroups(", selectedStart);
  const renderStart = source.indexOf("function renderProductSelect(");
  const renderEnd = source.indexOf("function hasBundleIdentityMarker(", renderStart);
  assert.ok(selectedStart >= 0 && selectedEnd > selectedStart && renderStart >= 0 && renderEnd > renderStart);
  const api = vm.runInNewContext(
    source.slice(selectedStart, selectedEnd) + source.slice(renderStart, renderEnd)
      + "\n({ selectedSku, renderProductSelect })",
    helpers,
  );

  assert.equal(api.selectedSku().id, "DEMO-Cup-Pink");
  api.renderProductSelect("DEMO-Cup-Pink");
  assert.equal(select.value, "DEMO-Cup-Pink");
  assert.equal(select.disabled, false);
  assert.match(select.title, /默认子体 SKU/);
  assert.match(select.title, /可按当前资料人工切换/);

  select.value = "missing";
  api.renderProductSelect("missing");
  assert.equal(select.value, "DEMO-Cup-Blue");
  assert.match(source, /const visionReviewKey = sellingPointReviewKey\(identityHint\)/);
  assert.doesNotMatch(source, /sellingPointReviewsBySku\[boundWorkspace\.sku\]\?\.locked/);
  console.log("workflow SKU is a default; manual product and supplier bindings drive the active analysis target");
}

testWorkspaceSkuIsOnlyTheInitialDefault();
