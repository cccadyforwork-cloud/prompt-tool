const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('app.js', 'utf8');
const storageCode = source.slice(
  source.indexOf('const IMAGE_HISTORY_STORAGE_KEY ='),
  source.indexOf('function storeWorkflowEndpoint('),
);
const sourceCode = source.slice(
  source.indexOf('const storePrefilledSourceFiles ='),
  source.indexOf('async function prefillStoreSourceInputs('),
);
const snapshotCode = source.slice(
  source.indexOf('function persistWorkspaceSnapshot()'),
  source.indexOf('function restoreWorkspaceSnapshot()'),
);
const manualReferenceCode = source.slice(
  source.indexOf('function persistManualReferences('),
  source.indexOf('function recordGeneratedImages('),
);

class TestFile {
  constructor(name) { this.name = name; }
}

function storage() {
  const values = new Map();
  return {
    getItem: (key) => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
}

function indexedDb() {
  const values = new Map();
  const db = {
    createObjectStore() {},
    transaction() {
      return {
        objectStore() {
          return {
            get(key) {
              const request = {};
              queueMicrotask(() => {
                request.result = values.get(key);
                request.onsuccess?.();
              });
              return request;
            },
            put(value, key) { values.set(key, value); },
            delete(key) { values.delete(key); },
          };
        },
      };
    },
  };
  return {
    open() {
      const request = {result: db};
      queueMicrotask(() => {
        request.onupgradeneeded?.();
        request.onsuccess?.();
      });
      return request;
    },
  };
}

function context(query, browserStorage) {
  const inputs = {
    amazonTemplateFile: {files: []},
    supplierFile: {files: []},
    competitorFile: {files: []},
    supplierImageListText: {value: ''},
    amazonTemplatePrefill: {hidden: true, classList: {remove() {}}, textContent: ''},
    supplierFilePrefill: {hidden: true, classList: {remove() {}}, textContent: ''},
  };
  class TestDataTransfer {
    constructor() {
      this.files = [];
      this.items = {add: (file) => this.files.push(file)};
    }
  }
  const sandbox = vm.createContext({
    window: {location: {search: query, origin: 'https://company.example', pathname: '/prompt-tool/'}, indexedDB: browserStorage.db},
    indexedDB: browserStorage.db,
    localStorage: browserStorage.local,
    sessionStorage: browserStorage.session,
    URL,
    URLSearchParams,
    crypto: {randomUUID: () => 'tab-1'},
    console,
    File: TestFile,
    DataTransfer: TestDataTransfer,
    byId: (id) => inputs[id],
    setTimeout,
    clearTimeout,
  });
  vm.runInContext(storageCode + sourceCode, sandbox);
  return {sandbox, inputs, TestFile};
}

async function main() {
  const browserStorage = {db: indexedDb(), local: storage(), session: storage()};
  const query = '?store_project_id=PROJECT-1&store_sku=SKU-A';
  const first = context(query, browserStorage);
  await vm.runInContext('initializeDurableStorage()', first.sandbox);
  vm.runInContext(snapshotCode, first.sandbox);
  Object.assign(first.sandbox, {
    hasExtractedProducts: () => true,
    extractedProducts: [{id: 'EXTRACTED-PRODUCT-1', productName: 'test',
      sellingPointVisualPlan: {plans: [{groupIndex: 0, humanDecision: 'show', status: 'ready'}]}}],
    fieldOverridesBySku: {}, appliedSellingPointOverridesBySku: {},
    referenceImagesBySku: {}, referenceImageMetaBySku: {}, availableReferenceImageUrls: [],
    supplierImageSourcePresent: true, latestReferenceMappingStatus: '',
    savedReferenceSelectionByCard: {}, imageGenerationByCard: {}, bundleStateBySku: {},
    supplierSourceFileNames: [], amazonTemplateSourceFileName: '', competitorSellingPointCandidates: [],
    competitorSellingPointSourceNames: [], competitorDimensionList: '', competitorDimensionSourceNames: [], competitorProductWeight: '',
    competitorCapacity: '', selectedExtractionRoute: 'local', selectedProductStructureRoute: 'single',
    selectedSupplierBindingMode: 'auto', activeWorkflowPage: 'studio', DEFAULT_TEMPLATE_ID: 'scene',
    MAX_SELECTED_REFERENCES: 6,
  });
  vm.runInContext('persistWorkspaceSnapshot()', first.sandbox);
  vm.runInContext(manualReferenceCode, first.sandbox);
  first.sandbox.imageGenerationByCard.card = {
    availableReferences: ['data:image/png;base64,AAAA', 'https://example.invalid/source.jpg'],
    selectedReferences: ['data:image/png;base64,AAAA'],
  };
  vm.runInContext('persistManualReferences("card")', first.sandbox);
  const supplier = new first.TestFile('1688.html');
  first.inputs.supplierFile.files = [supplier];
  first.inputs.supplierImageListText.value = 'https://example.invalid/product.jpg';
  vm.runInContext('persistSourceInputs()', first.sandbox);
  vm.runInContext('writeTabStorage(IMAGE_HISTORY_STORAGE_KEY, JSON.stringify({card:[{images:["https://example.invalid/generated.png"]}]}))', first.sandbox);

  const refreshed = context(query, browserStorage);
  await vm.runInContext('initializeDurableStorage()', refreshed.sandbox);
  vm.runInContext('restoreSourceInputs()', refreshed.sandbox);
  const snapshot = JSON.parse(vm.runInContext('readTabStorage(WORKSPACE_STORAGE_KEY)', refreshed.sandbox));
  assert.equal(snapshot.extractedProducts[0].id, 'EXTRACTED-PRODUCT-1');
  assert.equal(snapshot.extractedProducts[0].sellingPointVisualPlan.plans[0].humanDecision, 'show');
  assert.equal(snapshot.workspaceBinding.sku, 'SKU-A');
  assert.equal(snapshot.supplierImageSourcePresent, true);
  assert.equal(vm.runInContext('snapshotMatchesWorkspace(JSON.parse(readTabStorage(WORKSPACE_STORAGE_KEY)))', refreshed.sandbox), true);
  assert.equal(refreshed.inputs.supplierFile.files[0].name, '1688.html');
  assert.equal(refreshed.inputs.supplierImageListText.value, 'https://example.invalid/product.jpg');
  assert.match(vm.runInContext('readTabStorage(IMAGE_HISTORY_STORAGE_KEY)', refreshed.sandbox), /generated\.png/);
  assert.equal(vm.runInContext('durableStorageCache.get(MANUAL_REFERENCES_STORAGE_KEY).card.selected[0]', refreshed.sandbox), 'data:image/png;base64,AAAA');

  const otherSku = context('?store_project_id=PROJECT-1&store_sku=SKU-B', browserStorage);
  await vm.runInContext('initializeDurableStorage()', otherSku.sandbox);
  assert.equal(vm.runInContext('readTabStorage(WORKSPACE_STORAGE_KEY)', otherSku.sandbox), null);
  assert.equal(otherSku.inputs.supplierFile.files.length, 0);
  console.log('Refresh restores sources, parameters and generated image records within one project/SKU.');
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
