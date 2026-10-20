const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const path = process.argv[2] || 'app.js';
const source = fs.readFileSync(path, 'utf8');
assert.match(source, /id="confirmAllSellingPointImages"/, 'selling-point plans expose one-click confirmation');
assert.match(source, /plans\.forEach\(\(plan\) => applyVisualPlanDecision\(sku, currentFacts, plan, "show"\)\)/,
  'one-click confirmation marks every selling-point plan for display');
assert.match(source, /!planIncluded && !humanConfirmed/,
  'explicit human confirmation overrides a missing visual-plan marker');
const start = source.indexOf('async function extractSupplierSourceText(');
const end = source.indexOf('function readFileAsText(', start);
assert.ok(start >= 0 && end > start, 'supplier extraction function is present');
const urls = Array.from({length: 8}, (_, index) => `https://cbu01.alicdn.com/img/ibank/feature-${index}.jpg`);
const collected = [
  ...urls.map((url) => ({url, source: 'collector', context: ''})),
  {url: urls[0], source: 'collector', context: ''},
  {url: 'https://cbu01.alicdn.com/img/ibank/service.jpg', source: 'collector', context: 'shop service'},
];
let visionInput = [];
const sandbox = vm.createContext({
  selectedExtractionRoute: 'vision', boundWorkspace: null,
  MAX_REFERENCE_CLASSIFIER_CANDIDATES: 80, OCR_IMAGE_LIMIT: 32,
  cleanHtmlText: () => '', extractSupplierStructuredText: () => '',
  extractDetailUrlsFromHtml: () => [], fetchDetailHtml: async () => '',
  extractImageUrlsFromHtml: () => [], extractCollectedImageCandidates: () => collected,
  isLikelyProductDetailImageCandidate: (candidate) => !candidate.context.includes('shop service'),
  uniqueImageCandidates: () => [], imageCandidateUrl: (candidate) => candidate.url,
  uniqueByUrl: (items) => [...new Map(items.map((item) => [item.url, item])).values()],
  productAttributeSourceText: () => '', productAttributeLinesFromSource: () => [],
  productTitleFromSupplierHtml: () => 'Oil Sprayer', cleanFieldDisplayValue: String,
  extractProductDetailAttributes: () => ({}),
  ocrImageUrls: () => {throw new Error('local OCR must not gate images');},
  fetchLocalProductAnalysisProxy: async (_facts, images) => {
    visionInput = images.map((item) => item.url);
    return {
      selected_images: urls.map((url) => ({url, image_type: 'feature', reason: 'Product image'})),
      rejected_images: [{url: collected.at(-1).url, reason: 'Shop service'}],
      selling_points: [{claim: 'Even oil mist', evidence: '均匀雾化', image_url: urls[0]}],
    };
  },
  productAnalysisEvidenceText: () => '',
  productAnalysisSellingPointVisualEvidence: (result) => (result?.selling_points || []).map((point) => ({
    claim: point.claim, evidence: point.evidence, imageUrl: point.image_url,
  })),
  productAnalysisFieldVisualEvidence: () => [],
  productAnalysisUseBehavior: (result) => result?.use_behavior || null,
});
vm.runInContext(source.slice(start, end), sandbox);
vm.runInContext('extractSupplierSourceText("<html></html>", () => {}, "web", "source links")', sandbox)
  .then(async (result) => {
    assert.deepEqual(visionInput, [...urls, collected.at(-1).url]);
    assert.deepEqual([...result.referenceImageUrls], urls);
    assert.equal(result.sellingPointVisualEvidence[0].imageUrl, urls[0]);
    assert.equal(result.imageCount, 9);
    sandbox.ocrImageUrls = async (images) => ({
      text: 'OCR local detail: Capacity 100 ml', scannedCount: images.length,
      failedCount: 0, acceptedCount: 1, sellingPointCount: 0, available: true,
    });
    const localResult = await vm.runInContext('extractSupplierSourceText("<html></html>", () => {}, "local", "source links")', sandbox);
    assert.match(localResult.text, /OCR local detail: Capacity 100 ml/);
    assert.equal(localResult.scannedCount, 9);
    assert.equal(visionInput.length, 9, 'local route does not make another Doubao request');
    const downloadStart = source.indexOf('async function fetchGeneratedImageBlob(');
    const downloadEnd = source.indexOf('async function saveGeneratedSet(', downloadStart);
    assert.ok(downloadStart >= 0 && downloadEnd > downloadStart);
    let downloadAttempts = 0;
    const downloads = vm.createContext({
      encodeURIComponent,
      window: {setTimeout: (resolve) => resolve()},
      fetch: async () => {
        downloadAttempts += 1;
        if (downloadAttempts < 3) return {ok:false,status:502};
        return {ok:true,status:200,blob:async () => ({type:'image/png',size:123})};
      },
    });
    vm.runInContext(source.slice(downloadStart, downloadEnd), downloads);
    const retriedBlob = await vm.runInContext(`fetchGeneratedImageBlob('https://file1.aitohumanize.com/file/test.png', '第 1 张图片')`, downloads);
    assert.equal(downloadAttempts, 3, 'generated-image downloads retry transient upstream failures');
    assert.equal(retriedBlob.type, 'image/png');
    const cacheStart = source.indexOf('async function cacheGeneratedImageUrls(');
    const cacheEnd = source.indexOf('async function recordGeneratedImages(', cacheStart);
    assert.ok(cacheStart >= 0 && cacheEnd > cacheStart);
    const imageCache = vm.createContext({
      fetchGeneratedImageBlob: async (url) => {
        if (url.includes('expired')) throw new Error('expired');
        return {type:'image/png'};
      },
      readImageFileAsDataUrl: async () => 'data:image/png;base64,CACHED',
    });
    vm.runInContext(source.slice(cacheStart, cacheEnd), imageCache);
    const cachedImages = await vm.runInContext(`cacheGeneratedImageUrls([
      'https://file1.aitohumanize.com/file/live.png',
      'https://file2.aitohumanize.com/file/expired.png'
    ])`, imageCache);
    assert.deepEqual([...cachedImages.images], [
      'data:image/png;base64,CACHED',
      'https://file2.aitohumanize.com/file/expired.png',
    ], 'generated images are copied into current-page storage while failed copies retain a retryable source URL');
    assert.equal(cachedImages.cachedCount, 1);
    assert.equal(cachedImages.failedCount, 1);
    const candidateStart = source.indexOf('function operationEvidenceUrlForCard(');
    const candidateEnd = source.indexOf('function scheduleReferenceVisualDeduplication(', candidateStart);
    assert.ok(candidateStart >= 0 && candidateEnd > candidateStart);
    const metadata = urls.map((url) => ({url, sku_match: 'manual_review', image_type: 'feature'}));
    const candidates = vm.createContext({
      selectedTemplate: () => ({id: 'scene'}), sellingPointGroupForImageTitle: () => [],
      visualPlanForPoints: () => null,
      visualPlanContext: () => ({routes: ['scene_use', 'product_proof']}),
      referenceMetaItemsForSku: () => metadata,
      referenceImagesBySku: {green: urls, blue: urls}, availableReferenceImageUrls: urls,
      uniqueReferenceImageUrls: (items) => [...new Set(items)],
      matchedSellingPointVisualEvidence: () => [], taskMatchedReferenceUrls: () => [],
      sellingPointActionDependency: () => 0,
      MAX_SELECTED_REFERENCES: 6,
      MAX_REQUIRED_REFERENCES: 2,
    });
    vm.runInContext(source.slice(candidateStart, candidateEnd), candidates);
    for (const id of ['green', 'blue']) {
      const available = vm.runInContext(`referenceImageCandidatesForCard({id:'main'}, {sellingPointVisualEvidence:[]}, {id:'${id}'}).all`, candidates);
      assert.deepEqual([...available], urls);
    }
    const operationReference = vm.runInContext(
      `referenceImageCandidatesForCard({id:'1B'}, {sellingPointVisualEvidence:[], useBehavior:{mode:'active',imageUrl:'${urls[1]}'}}, {id:'green'}).matched`,
      candidates,
    );
    assert.deepEqual([...operationReference], [urls[1]], 'operation evidence is auto-selected without an exact SKU tag');
    candidates.manualState = {availableReferences: urls, selectedReferences: [urls[0], urls[2]]};
    vm.runInContext(`prioritizeSelectedOperationEvidence(manualState, 'scene', {id:'1B'}, {sellingPointVisualEvidence:[],useBehavior:{mode:'active',imageUrl:'${urls[1]}'}} , {id:'green'})`, candidates);
    assert.deepEqual([...candidates.manualState.selectedReferences], [urls[1], urls[0], urls[2]], 'operation evidence is included alongside manually selected scene images');
    candidates.autoState = {availableReferences: urls, selectedReferences: [urls[0], urls[1], urls[2]]};
    vm.runInContext(`prioritizeSelectedOperationEvidence(autoState, 'scene', {id:'2'}, {sellingPointVisualEvidence:[],useBehavior:{mode:'active',imageUrl:'${urls[1]}'}} , {id:'green'})`, candidates);
    assert.deepEqual([...candidates.autoState.selectedReferences], [urls[1], urls[0], urls[2]], 'selected operation evidence is sent first, keeping other references');
    const sellingPointOperationReference = vm.runInContext(
      `referenceImageCandidatesForCard({id:'5'}, {sellingPointVisualEvidence:[], useBehavior:{mode:'active',imageUrl:'${urls[1]}'}}, {id:'green'}).matched`,
      candidates,
    );
    assert.deepEqual([...sellingPointOperationReference], [urls[1]], 'scene-use selling-point image receives the operation evidence');
    candidates.referenceMetaItemsForSku = () => urls.slice(0, 2).map((url, index) => ({
      url, sku_match: 'exact', confidence: 'high', image_type: index === 1 ? 'use_demonstration' : 'main_product',
    }));
    candidates.taskMatchedReferenceUrls = () => [urls[1], urls[0]];
    const productHeroReferences = vm.runInContext(
      `referenceImageCandidatesForCard({id:'1A'}, {sellingPointVisualEvidence:[], useBehavior:{mode:'active',imageUrl:'${urls[1]}'}}, {id:'green'}).matched`,
      candidates,
    );
    assert.deepEqual([...productHeroReferences], [urls[0]], 'product-first hero does not auto-select its operation photograph');
    const overviewReferences = vm.runInContext(
      `referenceImageCandidatesForCard({id:'7'}, {sellingPointVisualEvidence:[], useBehavior:{mode:'active',imageUrl:'${urls[1]}'}}, {id:'green'}).matched`,
      candidates,
    );
    assert.deepEqual([...overviewReferences], [urls[1], urls[0]], 'scene summary receives operation evidence for its large active-use hero');
    const generateStart = source.indexOf('async function generateImageForCard(');
    const generateEnd = source.indexOf('function refreshCurrentGenerationSummary(', generateStart);
    assert.ok(generateStart >= 0 && generateEnd > generateStart);
    const requestBodies = [];
    const manualGeneration = {selectedReferences:[urls[0], urls[2]],availableReferences:urls.slice(),model:'gpt-image-2',size:'1024x1024',status:'idle',message:''};
    Object.assign(candidates, {
      promptStore:[{key:'manual-use-card',promptEn:'SOURCE-VERIFIED USE',type:{id:'1B'}}],
      imageGenerationState:() => manualGeneration,
      selectedSku:() => ({id:'green'}), currentPromptData:() => ({}),
      promptFacts:() => ({sellingPointVisualEvidence:[],useBehavior:{mode:'active',imageUrl:urls[1]}}),
      updateImageGenerator:() => {},
      imageApiJson:async (_url, options) => {requestBodies.push(JSON.parse(options.body));return {images:['https://example.com/generated.png']};},
      normalizeGeneratedImages:(payload) => payload.images,
      recordGeneratedImages:() => {}, refreshCurrentGenerationSummary:() => {},
    });
    vm.runInContext(source.slice(generateStart, generateEnd), candidates);
    await vm.runInContext('generateImageForCard("manual-use-card")', candidates);
    assert.deepEqual([...requestBodies[0].images], [urls[1], urls[0], urls[2]],
      'manual generation sends required operation evidence first and preserves every human choice in click order');
    await vm.runInContext('generateImageForCard("manual-use-card", "auto")', candidates);
    assert.deepEqual([...requestBodies[1].images], [urls[1], urls[0]],
      'automatic generation keeps the existing automatic filtering and ordering behavior');
    candidates.sellingPointGroupForImageTitle = () => ['Verified feature'];
    candidates.visualPlanForPoints = () => ({
      route: 'scene_use',
      evidenceUrls: [urls[2], urls[3], urls[4]],
    });
    const cappedManual = vm.runInContext(
      `manualGenerationReferencesForCard({id:'5'}, {sellingPointVisualEvidence:[],useBehavior:{mode:'active',imageUrl:'${urls[1]}'}}, {id:'green'}, ['${urls[0]}','${urls[5]}','${urls[6]}'])`,
      candidates,
    );
    assert.deepEqual([...cappedManual.required], [urls[1], urls[2]],
      'manual route keeps at most two system-required operation or selling-point evidence images');
    assert.deepEqual([...cappedManual.combined], [urls[1], urls[2], urls[0], urls[5], urls[6]],
      'manual route appends the human choices after required evidence without reordering them');
    const overriddenManual = vm.runInContext(
      `manualGenerationReferencesForCard({id:'5'}, {sellingPointVisualEvidence:[],useBehavior:{mode:'active',imageUrl:'${urls[1]}'}}, {id:'green'}, ['${urls[0]}','${urls[1]}','${urls[5]}'], 'scene', ['${urls[1]}'])`,
      candidates,
    );
    assert.deepEqual([...overriddenManual.required], [urls[2]],
      'a human override removes the cancelled system-default operation image');
    assert.deepEqual([...overriddenManual.combined], [urls[2], urls[0], urls[5]],
      'a cancelled system-default image is not silently added back as a manual reference');
    assert.doesNotMatch(source, /return "待人工核对";/,
      'generic candidates do not repeat a bottom-corner manual-review label');
    candidates.referenceMetaItemsForSku = () => [
      {url: urls[0], image_type: 'detail', sku_match: 'exact'},
      {url: urls[1], image_type: 'lifestyle', sku_match: 'exact'},
      {url: urls[2], image_type: 'feature', sku_match: 'exact'},
      {url: urls[3], image_type: 'parameter', sku_match: 'exact'},
    ];
    candidates.sellingPointActionDependency = (claims) => /spray/i.test(claims.join(' ')) ? 4 : 0;
    candidates.sellingPointGroupForImageTitle = (_template, id) => [id === '5' ? 'Spray range' : 'Precise control'];
    candidates.visualPlanForPoints = (points) => ({route: points[0] === 'Spray range' ? 'scene_use' : 'product_proof'});
    const proofRefs = vm.runInContext(
      `generationReferencesForCard({id:'6'}, {sellingPointVisualEvidence:[{claim:'Spray range',imageUrl:'${urls[2]}'}],useBehavior:{mode:'active',imageUrl:'${urls[1]}'}}, {id:'green'}, ['${urls[1]}','${urls[2]}','${urls[0]}','${urls[3]}'])`,
      candidates,
    );
    assert.deepEqual([...proofRefs], [urls[0]], 'product-only feature excludes use posters and unrelated feature scenes');
    const sceneRefs = vm.runInContext(
      `generationReferencesForCard({id:'5'}, {sellingPointVisualEvidence:[{claim:'Spray range',imageUrl:'${urls[2]}'}],useBehavior:{mode:'active',imageUrl:'${urls[1]}'}}, {id:'green'}, ['${urls[1]}','${urls[2]}','${urls[0]}','${urls[3]}'])`,
      candidates,
    );
    assert.deepEqual([...sceneRefs], [urls[1], urls[0]], 'scene-use feature places the verified operation original before SKU identity');
    const ruleStart = source.indexOf('function sourceUseBehaviorRule(');
    const ruleEnd = source.indexOf('function buildPromptSections(', ruleStart);
    assert.ok(ruleStart >= 0 && ruleEnd > ruleStart);
    const promptRules = vm.createContext({compactPromptItems: (items) => items.filter(Boolean).join(' / ')});
    vm.runInContext(source.slice(ruleStart, ruleEnd), promptRules);
    const activeRule = vm.runInContext(
      `sourceUseBehaviorRule({useBehavior:{mode:'active',action:'Press top button',trigger:'top button',outputOrigin:'bottom nozzle',outputDirection:'downward',imageUrl:'${urls[1]}'}})`,
      promptRules,
    );
    assert.match(activeRule, /Effect must start at: bottom nozzle/);
    assert.match(activeRule, /Effect direction: downward/);
    assert.match(vm.runInContext('sourceUseBehaviorRule({})', promptRules), /Do not invent an active product action/);
    const routeStart = source.indexOf('function sellingPointActionDependency(');
    const routeEnd = source.indexOf('function sellingPointVisualRouteLabel(', routeStart);
    const routes = vm.createContext({});
    vm.runInContext(source.slice(routeStart, routeEnd), routes);
    const oilClaims = '[["Quantitative oil control supports low-fat healthy cooking"],["Wide 60 degree atomization spray range"]]';
    assert.equal(vm.runInContext(`sellingPointVisualRoute("scene", 0, 2, ${oilClaims}[1], {useBehavior:{imageUrl:"https://example.com/use.jpg"}}, ${oilClaims})`, routes), 'scene_use');
    assert.equal(vm.runInContext(`sellingPointVisualRoute("scene", 1, 2, ${oilClaims}[0], {useBehavior:{imageUrl:"https://example.com/use.jpg"}}, ${oilClaims})`, routes), 'product_proof');
    assert.equal(vm.runInContext('sellingPointVisualRoute("scene", 0, 2, ["Produces uniform atomized oil spray"], {}, [["Produces uniform atomized oil spray"],["BPA-free PP material"]])', routes), 'flexible');
    assert.equal(vm.runInContext('sellingPointVisualRoute("scene", 1, 2, ["BPA-free PP material"], {}, [["Produces uniform atomized oil spray"],["BPA-free PP material"]])', routes), 'product_proof');
    assert.equal(vm.runInContext('sellingPointVisualRoute("feature", 0, 2, ["Soft PP material"], {useBehavior:{imageUrl:"https://example.com/use.jpg"}}, [["Soft PP material"],["Easy folding for storage"]])', routes), 'product_proof');
    assert.equal(vm.runInContext('sellingPointVisualRoute("feature", 1, 2, ["Easy folding for storage"], {useBehavior:{imageUrl:"https://example.com/use.jpg"}}, [["Soft PP material"],["Easy folding for storage"]])', routes), 'scene_use');
    const selectionStart = source.indexOf('const sellingPointSlotIdsByTemplate =');
    const selectionEnd = source.indexOf('function clampSellingPointTitle(', selectionStart);
    assert.ok(selectionStart >= 0 && selectionEnd > selectionStart);
    const selectedClaims = ['Quantitative oil control', 'Wide 60 degree atomization spray range'];
    const selectedSku = {sellingPointImageChoices: {scene: selectedClaims.map((claim) => claim.toLowerCase())}};
    const selection = vm.createContext({
      selectedSku: () => selectedSku,
      selectedTemplate: () => ({id: 'scene', imageTypes: [{id: '5'}, {id: '6'}]}),
      sellingPointCandidates: () => selectedClaims,
      comparablePromptItem: (claim) => claim.toLowerCase(),
      sellingPointActionDependency: (claims) => /spray|atomization/i.test(claims.join(' ')) ? 4 : 1,
    });
    vm.runInContext(source.slice(selectionStart, selectionEnd), selection);
    assert.deepEqual([...vm.runInContext('sellingPointImageSelection().indices', selection)], [1, 0],
      'existing product-first selection moves the action claim to scene image 5');
    selectedSku.sceneSellingPointOrderV2 = true;
    assert.deepEqual([...vm.runInContext('sellingPointImageSelection().indices', selection)], [0, 1],
      'an explicit new-order selection remains in the chosen slots');
    const visualRuleStart = source.indexOf('function sellingPointClaimCopyRule(');
    const visualRuleEnd = source.indexOf('function conciseSceneModulePrompt(', visualRuleStart);
    assert.ok(visualRuleStart >= 0 && visualRuleEnd > visualRuleStart);
    const visualRules = vm.createContext({
      limitedSellingPoints: (items) => items.slice(0, 2),
      sellingPointHeadlineForClaim: () => 'Controlled Portion Output',
      sellingPointBodyCopy: () => 'Dispenses a controlled portion.',
      matchedSellingPointVisualEvidence: (_points, facts) => facts.sellingPointVisualEvidence || [],
      sellingPointActionDependency: (points) => /control|fold/i.test(points.join(' ')) ? 3 : 0,
    });
    vm.runInContext(source.slice(visualRuleStart, visualRuleEnd), visualRules);
    const proofFacts = {sellingPointVisualEvidence:[{claim:'Controlled output', imageUrl:urls[0]}],
      useBehavior:{mode:'active', imageUrl:urls[1], trigger:'top button', outputOrigin:'base outlet', outputDirection:'downward'}};
    visualRules.proofFacts = proofFacts;
    const quantityProof = vm.runInContext('sellingPointClaimVisualRule(["Controlled portion output"], proofFacts, "product_proof")', visualRules);
    assert.match(quantityProof, /small crop of the real outlet is optional/);
    assert.match(quantityProof, /real outlet\/contact point/);
    assert.match(quantityProof, /premium product texture and its verified control structure dominant/);
    assert.match(quantityProof, /Do not draw a detached part, duplicate product, unsupported output/);
    assert.match(quantityProof, /static photograph need not simulate the output/);
    assert.doesNotMatch(quantityProof, /simple press cue/);
    const materialProof = vm.runInContext('sellingPointProofInsetRule(["Soft PP material"], {})', visualRules);
    assert.match(materialProof, /Omit any diagram/);
    visualRules.waterproofFacts = {sellingPointVisualEvidence:[{claim:'Waterproof surface', imageUrl:urls[2]}]};
    const waterproofProof = vm.runInContext('sellingPointClaimVisualRule(["Waterproof surface"], waterproofFacts, "product_proof")', visualRules);
    assert.match(waterproofProof, /authentic material, finish and claim-relevant detail/);
    assert.match(waterproofProof, /source-backed passive surface effect may appear directly on the product/);
    assert.match(waterproofProof, /Use at most one line diagram/);
    const productRouteStart = source.indexOf('function sellingPointVisualRouteRule(');
    const productRouteEnd = source.indexOf('function visualPlanContext(', productRouteStart);
    const productRoute = vm.createContext({});
    vm.runInContext(source.slice(productRouteStart, productRouteEnd), productRoute);
    assert.match(vm.runInContext('sellingPointVisualRouteRule("product_proof")', productRoute), /low-saturation neutral gradient/);
    assert.match(vm.runInContext('sellingPointVisualRouteRule("product_proof")', productRoute), /without white glare/);
    const supplierTextStart = source.indexOf('function extractSupplierStructuredText(');
    const supplierTextEnd = source.indexOf('function imageHasEnoughReadableSize(', supplierTextStart);
    const supplierFacts = vm.createContext({
      decodeHtmlEntities: (text) => text.replaceAll('&gt;', '>'),
      extractSupplierTitles: () => [], extractSupplierSkuOptions: () => [],
      extractFirstMatch: (text, patterns) => patterns.map((pattern) => text.match(pattern)?.[1] || '').find(Boolean) || '',
      uniquePromptItems: (items) => [...new Set(items)],
    });
    vm.runInContext(source.slice(supplierTextStart, supplierTextEnd), supplierFacts);
    const sharedVolume = vm.runInContext('extractSupplierStructuredText(input)', vm.createContext({
      ...supplierFacts, input: '<script>{"specAttrs":"绿色&gt;100ml","specAttrs":"白色&gt;100ml","unit":"件"}</script>',
    }));
    assert.match(sharedVolume, /PRODUCT_ATTRIBUTE: Capacity=100 ml/);
    assert.match(sharedVolume, /PRODUCT_ATTRIBUTE: SaleUnit=piece/);
    const mixedVolumes = vm.runInContext('extractSupplierStructuredText(input)', vm.createContext({
      ...supplierFacts, input: '<script>{"specAttrs":"绿色&gt;100ml","specAttrs":"白色&gt;200ml"}</script>',
    }));
    assert.doesNotMatch(mixedVolumes, /PRODUCT_ATTRIBUTE: Capacity=/, 'different SKU volumes cannot be broadcast');
    const titleStart = source.indexOf('function amazonTitleCapacityValue(');
    const titleEnd = source.indexOf('function amazonTitleDimensionList(', titleStart);
    const titleFacts = vm.createContext({validCapacityValue: (value) => value});
    vm.runInContext(source.slice(titleStart, titleEnd), titleFacts);
    const oilTitle = 'Oil Sprayer Bottle for Cooking, 100 Milliliter Refillable Kitchen Oil Dispenser with Spray and Pour Spout, PP Plastic, Green';
    titleFacts.oilTitle = oilTitle;
    assert.equal(vm.runInContext('amazonTitleCapacityValue(oilTitle)', titleFacts), '100 ml');
    assert.equal(vm.runInContext('amazonTitleMaterialValue(oilTitle)', titleFacts), 'Polypropylene (PP)');
    assert.equal(vm.runInContext('amazonTitleColorValue(oilTitle)', titleFacts), 'Green');
    const reviewStart = source.indexOf('function currentSellingPointReviewEntries(');
    const reviewEnd = source.indexOf('function applyLockedSellingPointReview(', reviewStart);
    assert.ok(reviewStart >= 0 && reviewEnd > reviewStart);
    const oldClaims = Array.from({length: 12}, (_, index) => `Claim ${index + 1}`);
    const review = {locked: false, candidateEntries: oldClaims.map((claim) => ({claim, source: 'vision'})),
      latestEntries: oldClaims.slice(8).map((claim) => ({claim, source: 'vision'})),
      checkedClaims: oldClaims.slice(8), history: [{version: 1, entries: oldClaims.slice(0, 4)}]};
    const reviews = vm.createContext({
      fieldOverridesBySku: {}, SELLING_POINT_SOURCE_MANUAL: 'manual',
      normalizeSellingPointEntries: (entries) => [...new Map((entries || []).map((entry) => [entry.claim, entry])).values()].slice(0, 12),
      sellingPointEntriesForText: (_sku, text) => text.split('\n').map((claim) => ({claim, source: 'vision'})),
      sellingPointReviewForSku: () => review, cleanFieldDisplayValue: String,
      persistSellingPointReviews: () => {}, appendSellingPointReviewHistory: () => {},
    });
    vm.runInContext(source.slice(reviewStart, reviewEnd), reviews);
    const reviewSku = {id: 'oil', sellingPoints: oldClaims.slice(0, 4).join('\n')};
    reviews.reviewSku = reviewSku;
    vm.runInContext('alignSavedSellingPointReview(reviewSku)', reviews);
    assert.deepEqual(review.candidateEntries.map((entry) => entry.claim), oldClaims.slice(0, 4));
    assert.equal(review.history.length, 1, 'old candidates remain in history');
    vm.runInContext('addSellingPointCandidates(reviewSku, [{claim:"New point",source:"vision"}])', reviews);
    assert.deepEqual(review.candidateEntries.map((entry) => entry.claim), ['New point'], 'new analysis replaces old candidates');
    const circleStart = source.indexOf('function summaryPosterLowerLeftProductRule(');
    const circleEnd = source.indexOf('function summaryPosterStyleRule(', circleStart);
    const sceneStart = source.indexOf('function conciseSceneModulePrompt(');
    const sceneEnd = source.indexOf('function sceneTemplatePrompt(', sceneStart);
    assert.ok(circleStart >= 0 && circleEnd > circleStart && sceneStart >= 0 && sceneEnd > sceneStart);
    const summary = vm.createContext({
      cleanFieldDisplayValue: String,
      splitUseSceneText: (value) => String(value).split(';').filter(Boolean),
      sellingPointGroups: (_facts, index) => [index === 0 ? 'Claim A' : 'Claim B'],
      visualPlanForPoints: () => null,
      visualPlanContext: () => ({routes: ['scene_use', 'product_proof']}),
      sellingPointHeadlineForClaim: (claim) => claim,
      sellingPointBodyCopy: (claim) => `${claim} explained.`,
      sellingPointVisualRouteRule: (route) => route,
      sellingPointClaimVisualRule: (points) => points.join(', '),
      limitedSellingPoints: (points, limit) => points.slice(0, limit),
      shortOptionText: () => '',
      compactSkuOptionText: () => '', dimensionListItems: () => ['Height 4 in'],
      promptContextText: () => '', convertLengthUnitsToInches: (value) => value,
      sellingPointCandidates: () => ['Source-backed benefit'],
      sourceUseBehaviorRule: () => 'Follow source operation and outlet.',
      bundleFullSetDisplayRule: () => 'BUNDLE GUARD',
      differentDesignSetPresentationRule: () => 'MIXED-SET GUARD',
      skuQuantityMainImageRule: () => 'MAIN COUNT GUARD',
      skuQuantityExplanationRule: () => 'SECONDARY COUNT LABEL',
    });
    vm.runInContext(source.slice(circleStart, circleEnd), summary);
    vm.runInContext(source.slice(sceneStart, sceneEnd), summary);
    const overviewPrompt = vm.runInContext('conciseSceneModulePrompt("7", {productName:"Sample product",scene:"Cooking;Serving",skuUnitQuantity:3,skuUnitQuantityLabel:"3 Pcs",useBehavior:{mode:"active",imageUrl:"https://example.com/use.jpg",outputOrigin:"base outlet"}})', summary);
    assert.match(overviewPrompt, /LEFT LARGE HERO must capture the product actually operating/);
    assert.match(overviewPrompt, /COMPACT WHITE CIRCULAR product inset at the LOWER LEFT/);
    assert.match(overviewPrompt, /show exactly 3 separate, complete, identical current-product units/);
    assert.match(overviewPrompt, /Reserve emitted effects for the large left hero/);
    assert.match(overviewPrompt, /SECONDARY COUNT LABEL/);
    summary.regularFacts = {productName:'Sample product',scene:'Cooking;Serving',skuUnitQuantity:3,
      skuUnitQuantityLabel:'3 Pcs',useBehavior:{mode:'active',imageUrl:'https://example.com/use.jpg'}};
    const scenePrompts = Object.fromEntries(['1A','1B','2','3','4','5','6','7'].map((id) =>
      [id, vm.runInContext(`conciseSceneModulePrompt("${id}", regularFacts)`, summary)]));
    assert.match(scenePrompts['1A'], /large enough to inspect its true silhouette/);
    summary.visualPlanForPoints = () => ({status: 'ready', route: 'product_proof', label: 'Verified Product Detail',
      visual_prompt: 'Close product detail fills the frame with source-accurate material and construction.'});
    const plannedProductProof = vm.runInContext('conciseSceneModulePrompt("6", regularFacts)', summary);
    assert.match(plannedProductProof, /VISUAL PLAN: Close product detail fills the frame/,
      'confirmed product-proof plan is embedded in its generated prompt');
    assert.match(scenePrompts['1A'], /MAIN COUNT GUARD/);
    assert.match(scenePrompts['1B'], /OPERATION: Follow source operation and outlet/);
    assert.match(scenePrompts['2'], /Four equal 2x2 panels showing different real uses/);
    assert.match(scenePrompts['2'], /TWO panels visibly show the product being operated/);
    assert.match(scenePrompts['3'], /four-view studio study/);
    assert.match(scenePrompts['4'], /Height 4 in/);
    assert.match(scenePrompts['4'], /SECONDARY COUNT LABEL/);
    assert.match(scenePrompts['5'], /Claim A/);
    assert.match(scenePrompts['5'], /OPERATION: Follow source operation and outlet/);
    assert.match(scenePrompts['6'], /Claim B/);
    assert.match(scenePrompts['6'], /PRODUCT PROOF|product_proof/);
    assert.doesNotMatch(scenePrompts['6'], /Show the source-supported spray interaction/);
    assert.match(scenePrompts['7'], /COMPACT WHITE CIRCULAR product inset/);
    summary.assortmentFacts = {...summary.regularFacts,skuUnitQuantity:0,isDifferentDesignSet:true,differentDesignSetCount:3};
    assert.match(vm.runInContext('conciseSceneModulePrompt("3", assortmentFacts)', summary), /Product-only complete-set studio study/);
    assert.match(vm.runInContext('conciseSceneModulePrompt("7", assortmentFacts)', summary), /show exactly 3 distinct, complete current-SKU members/);
    summary.bundleFacts = {...summary.regularFacts,skuUnitQuantity:0,bundleComponents:'one container plus two parts'};
    assert.match(vm.runInContext('conciseSceneModulePrompt("5", bundleFacts)', summary), /BUNDLE GUARD/);
    const fallbackStart = source.indexOf('function missingOnlineUseScenes(');
    const fallbackEnd = source.indexOf('async function enrichUseScenesOnline(', fallbackStart);
    assert.ok(fallbackStart >= 0 && fallbackEnd > fallbackStart);
    const fallback = vm.createContext({
      splitUseSceneText: (value) => String(value).split(/\n+|\s+\/\s+/).filter(Boolean),
      comparablePromptItem: (value) => String(value).trim().toLowerCase(),
    });
    vm.runInContext(source.slice(fallbackStart, fallbackEnd), fallback);
    fallback.existingScenes = 'Salad preparation\nSteak cooking';
    fallback.researchedScenes = ['Salad preparation', 'Barbecue grilling', 'Outdoor picnic'];
    const supplemented = vm.runInContext('missingOnlineUseScenes(existingScenes, researchedScenes, 3)', fallback);
    assert.deepEqual([...supplemented.existing], ['Salad preparation', 'Steak cooking']);
    assert.deepEqual([...supplemented.additions], ['Barbecue grilling']);
    const fromEmpty = vm.runInContext('missingOnlineUseScenes("", researchedScenes, 5)', fallback);
    assert.deepEqual([...fromEmpty.additions], fallback.researchedScenes);
    const enrichmentStart = source.indexOf('async function enrichUseScenesOnline(');
    const enrichmentEnd = source.indexOf('function autoEnrichUseScenesIfNeeded(', enrichmentStart);
    assert.ok(enrichmentStart >= 0 && enrichmentEnd > enrichmentStart);
    const sceneInput = {value:'Salad preparation\nSteak cooking'};
    const sceneStatus = {textContent:''};
    const sceneButton = {disabled:false, setAttribute() {}, removeAttribute() {}};
    const sceneSku = {id:'oil', fieldSources:{scene:'1688详情图'}};
    const online = vm.createContext({
      ...fallback,
      selectedExtractionRoute:'web', sceneInputRevision:0, extractionGeneration:0,
      byId: (id) => ({enrichUseScenes:sceneButton,sceneEnrichStatus:sceneStatus,'field-scene':sceneInput})[id],
      hasExtractedProducts: () => true, selectedSku: () => sceneSku,
      currentSceneResearchFacts: () => ({}),
      fetchOnlineUseSceneResearch: async () => ({scenes:fallback.researchedScenes,englishProductKeyword:'oil sprayer'}),
      suggestedUseSceneItems: (_facts, research) => research.scenes,
      applyOnlineProductKeyword: () => {}, fieldOverrides:{}, fieldOverridesBySku:{},
      currentProducts: () => [sceneSku], cleanFieldDisplayValue: String,
      captureFieldOverrides: () => {}, currentFieldSignature: () => 'fields',
      renderAll: () => {}, NO_REFERENCE_SCENE_MESSAGE:'No scenes',
    });
    vm.runInContext(source.slice(enrichmentStart, enrichmentEnd), online);
    await vm.runInContext('enrichUseScenesOnline()', online);
    assert.equal(sceneInput.value, 'Salad preparation\nSteak cooking\nBarbecue grilling');
    assert.match(sceneSku.fieldSources.scene, /1688详情图 \+ 豆包联网补充 1 条/);
    sceneInput.value = 'Salad preparation\nSteak cooking';
    online.fetchOnlineUseSceneResearch = async () => {throw new Error('network unavailable');};
    await vm.runInContext('enrichUseScenesOnline()', online);
    assert.equal(sceneInput.value, 'Salad preparation\nSteak cooking', 'web failure retains source scenes');
    const extractedPointStart = source.indexOf('function uniqueExtractedSellingPoints(');
    const extractedPointEnd = source.indexOf('function sellingPointCandidates(', extractedPointStart);
    const verifiedPointStart = source.indexOf('function verifiedVisionSellingPointCandidates(');
    const verifiedPointEnd = source.indexOf('function dimensionValueByLabels(', verifiedPointStart);
    assert.ok(extractedPointStart >= 0 && extractedPointEnd > extractedPointStart);
    assert.ok(verifiedPointStart >= 0 && verifiedPointEnd > verifiedPointStart);
    const pointContext = vm.createContext({
      specificPromptValue: String,
      cleanFieldDisplayValue: String,
      isDefaultExcludedSellingPoint: () => false,
      comparablePromptItem: (value) => String(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(),
    });
    vm.runInContext(source.slice(extractedPointStart, extractedPointEnd), pointContext);
    vm.runInContext(source.slice(verifiedPointStart, verifiedPointEnd), pointContext);
    const evidenceLines = [
      'DOUBAO_VISION_SELLING_POINT: Quantitative oil control supports low-fat healthy cooking',
      'DOUBAO_VISION_SELLING_POINT: Produces uniform atomized oil spray',
      'DOUBAO_VISION_SELLING_POINT: No dripping or residual oil sticking to the bottle',
      'DOUBAO_VISION_SELLING_POINT: Wide 60 degree atomization spray range',
    ].join('\n');
    pointContext.evidenceLines = evidenceLines;
    const extracted = vm.runInContext('verifiedSellingPointsFromSource(evidenceLines, 4).points', pointContext);
    assert.equal(extracted.length, 4, 'separate evidenced selling points survive field extraction');
    const nearOverlap = vm.runInContext(`uniqueExtractedSellingPoints([
      'Quantitative oil control with even atomization, no dripping',
      'One-second fast atomization for precise oil control',
      'Wide 60 degree atomization spray range',
      'Wide 60 degree atomization spray range'
    ], 4)`, pointContext);
    assert.equal(nearOverlap.length, 3, 'only exact duplicate claims are removed');
    console.log('Every unique image reaches Doubao; only Doubao-selected images enter the shared candidate list.');
  }).catch((error) => {console.error(error); process.exitCode = 1;});
