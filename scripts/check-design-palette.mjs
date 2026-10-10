import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';

/*
 * P0D visual brand guard. Only inspect fully migrated, neutral UI modules.
 * Deliberately DO NOT ban green sitewide: providers such as Sveland/Vimla have
 * brand-owned greens, and truthful measured cost status may use semantic green.
 * This guard catches accidental restoration of the pre-2026-10-10 forest/lime
 * palette on the completed blue/white product surfaces.
 */
const migrated=[
  'styles/design-tokens.css',
  'styles/CondoInsuranceCheck.module.css',
  'styles/FamilyMobileCost.module.css',
  'styles/FirstYearCostCalculator.module.css',
  'styles/ElectricityCostCalculator.module.css',
  'styles/QuotedLoanTotals.module.css',
  'styles/ElectricitySensitivity.module.css',
  'styles/TrafficTools.module.css',
  'styles/QuarterPriceDecision.module.css',
];
const forbidden=[
  '#17201b', // original green-black background and brand
  '#18211c', '#18231d', '#213029', '#202e26',
  '#dff46a', '#c7eb44', '#eff9a7', '#eef5dc',
  '#718246', '#839c55', '#3f6739', '#52631f',
];
let failures=[];
for(const path of migrated){
  const css=readFileSync(path,'utf8');
  const tokens=(css.match(/#[\da-fA-F]{6}\b/g)||[]).map(x=>x.toLowerCase());
  const found=[...new Set(tokens.filter(value=>forbidden.includes(value)))];
  if(found.length)failures.push({path,values:found});
}
assert.deepEqual(failures,[], 'P0D: legacy forest/lime colors must not return to migrated UI modules');
console.log('P0D design palette guard passed for '+migrated.length+' completed component styles; intentionally excludes valid provider branding and legacy CSS awaiting source audit.');
