const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(`${__dirname}/app.js`, 'utf8');
const section = (start, end) => source.slice(source.indexOf(start), source.indexOf(end, source.indexOf(start)));

async function check(route, firstRoute, paired, omitPlan = false) {
  const claims = ['Covers 12 full months of 2027 planning', 'US holidays are marked on the calendar grid', 'Features twin-wire spiral binding'];
  const groups = [paired ? claims.slice(0, 2) : claims.slice(0, 1), claims.slice(2)];
  const plans = groups.map((points, groupIndex) => ({groupIndex, status: 'ready', route: groupIndex ? 'product_proof' : firstRoute,
    label: groupIndex ? 'Twin Wire Binding' : '2027 Holiday Calendar',
    visual_prompt: groupIndex ? 'Close view of the confirmed binding.' : 'Calendar on a wall; readable month grid.'}));
  const facts = {productName: '2027 wacky dogs wall calendar', color: 'Multicolor', scene: 'Home wall display'};
  const sku = {id: 'calendar'};
  const template = {id: 'scene', imageTypes: ['5', '6'].map(id => ({id, name: `Image ${id}`}))};
  const button = {textContent: 'Confirm', disabled: false, isConnected: true};
  const status = {textContent: ''};
  const context = vm.createContext({
    selectedExtractionRoute: route, promptStore: [],
    byId: id => id === 'confirmParameterOutputs' ? button : status,
    document: {querySelector: () => status},
    hasExtractedProducts: () => true, captureFieldOverrides() {},
    selectedSku: () => sku, selectedTemplate: () => template,
    currentFieldSignature: () => 'unchanged', currentPromptData: () => facts, promptFacts: () => facts,
    visualPlanContext: () => ({groups, routes: [firstRoute, 'product_proof']}),
    visualPlanParametersConfirmed: () => true, currentVisualPlans: () => plans,
    visualPlanForPoints: points => plans[groups.findIndex(group => JSON.stringify(group) === JSON.stringify(points))],
    applyVisualPlanDecision: (_sku, _facts, plan, decision) => {plan.humanDecision = decision;},
    promptCardKey: (_sku, _template, type) => type.id,
    persistWorkspaceSnapshot() {}, showWorkflowPage: page => {context.entered = page;},
    splitUseSceneText: value => value ? value.split(';') : [],
    sellingPointGroups: (_facts, index) => groups[index], limitedSellingPoints: (points, limit) => points.slice(0, limit),
    sellingPointVisualRouteRule: value => value, sellingPointClaimVisualRule: points => points.join(' + '),
    sourceUseBehaviorRule: () => 'Use the confirmed passive display.',
    shortOptionText: () => '', compactSkuOptionText: () => '', dimensionListItems: () => [], promptContextText: () => '',
    sellingPointWords: claim => claim.split(' '),
    promptVariableValues: () => [facts.productName, facts.color, ...claims],
    comparablePromptItem: value => value.toLowerCase(), isGenericPromptFallback: () => false,
    bracketValue: value => ` 【${value}】 `,
  });
  vm.runInContext([
    section('function bracketPromptVariables(', 'function readFieldValue('),
    section('function sellingPointHeadlineForClaim(', 'function sellingPointClaimCopyRule('),
    section('function conciseSceneModulePrompt(', 'function featureModulePrompt('),
    section('function promptFor(', 'function promptImageDisplayTitle('),
    section('async function confirmParameterOutputs(', 'async function confirmParametersAndSellingPoints('),
  ].join('\n'), context);
  if (omitPlan) vm.runInContext(`const generateScene = conciseSceneModulePrompt;
    conciseSceneModulePrompt = (...args) => generateScene(...args).replace(/VISUAL PLAN:[^\\n]+/g, '');`, context);
  context.renderAll = () => {
    context.promptStore = template.imageTypes.map(type => ({key: type.id,
      promptEn: context.bracketPromptVariables(context.promptFor('scene', type.id, sku, facts), facts, type.id)}));
  };
  await context.confirmParameterOutputs();
  if (omitPlan) {
    assert.equal(context.entered, undefined, 'a plan that was actually omitted must still block progression');
    assert.match(status.textContent, /方案尚未进入提示词/);
  } else {
    assert.equal(context.entered, 'studio', `${route}/${firstRoute}/${paired}: ${status.textContent}`);
    assert.match(context.promptStore[0].promptEn, /【Covers 12 full months/);
    if (firstRoute !== 'scene_use') assert.ok(context.promptStore[0].promptEn.includes(plans[0].visual_prompt));
    if (paired) assert.ok(context.promptStore[0].promptEn.includes(claims[1]), 'both selected claims remain in the prompt');
    assert.ok(plans.every(plan => plan.humanDecision === 'show'));
  }
  assert.equal(button.disabled, false);
}

(async () => {
  for (const route of ['web', 'competitor']) {
    for (const visualRoute of ['flexible', 'scene_use', 'product_proof']) {
      for (const paired of [false, true]) await check(route, visualRoute, paired);
    }
  }
  await check('competitor', 'flexible', true, true);
  console.log('Plan confirmation: both analysis routes, all visual routes, single/paired claims and missing-plan guard passed.');
})().catch(error => {console.error(error); process.exitCode = 1;});
