const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const path = process.argv[2] || 'app.js';
const source = fs.readFileSync(path, 'utf8');
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
  productAnalysisSellingPointVisualEvidence: (result) => result.selling_points.map((point) => ({
    claim: point.claim, evidence: point.evidence, imageUrl: point.image_url,
  })),
});
vm.runInContext(source.slice(start, end), sandbox);
vm.runInContext('extractSupplierSourceText("<html></html>", () => {}, "vision", "source links")', sandbox)
  .then((result) => {
    assert.deepEqual(visionInput, [...urls, collected.at(-1).url]);
    assert.deepEqual([...result.referenceImageUrls], urls);
    assert.equal(result.sellingPointVisualEvidence[0].imageUrl, urls[0]);
    assert.equal(result.imageCount, 9);
    const candidateStart = source.indexOf('function referenceImageCandidatesForCard(');
    const candidateEnd = source.indexOf('function scheduleReferenceVisualDeduplication(', candidateStart);
    assert.ok(candidateStart >= 0 && candidateEnd > candidateStart);
    const metadata = urls.map((url) => ({url, sku_match: 'manual_review', image_type: 'feature'}));
    const candidates = vm.createContext({
      selectedTemplate: () => ({id: 'scene'}), sellingPointGroupForImageTitle: () => [],
      referenceMetaItemsForSku: () => metadata,
      referenceImagesBySku: {green: urls, blue: urls}, availableReferenceImageUrls: urls,
      uniqueReferenceImageUrls: (items) => [...new Set(items)],
      matchedSellingPointVisualEvidence: () => [], taskMatchedReferenceUrls: () => [],
      MAX_SELECTED_REFERENCES: 6,
    });
    vm.runInContext(source.slice(candidateStart, candidateEnd), candidates);
    for (const id of ['green', 'blue']) {
      const available = vm.runInContext(`referenceImageCandidatesForCard({id:'main'}, {sellingPointVisualEvidence:[]}, {id:'${id}'}).all`, candidates);
      assert.deepEqual([...available], urls);
    }
    console.log('Every unique image reaches Doubao; only Doubao-selected images enter the shared candidate list.');
  }).catch((error) => {console.error(error); process.exitCode = 1;});
