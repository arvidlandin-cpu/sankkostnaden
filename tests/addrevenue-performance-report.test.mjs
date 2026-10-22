import test from 'node:test';
import assert from 'node:assert/strict';
import {
  aggregatePerformance,
  aggregateTotals,
  attributionCoverage,
  dateRange,
  normalizeStats,
  normalizeTransaction,
  toMarkdown,
} from '../scripts/lib/addrevenuePerformance.mjs';

test('normalizes transaction status and local click reference',()=>{
  const approved=normalizeTransaction({
    advertiserId:10,advertiserName:'Hedvig',programId:20,programName:'Hemförsäkring',
    status:'approved',commission:500,currency:'SEK',clickRef:'clk_abc123',date:'2026-10-07T10:00:00Z'
  });
  assert.equal(approved.status,'approved');
  assert.equal(approved.commission,500);
  assert.equal(approved.hasLocalClickFormat,true);

  const delayed=normalizeTransaction({
    advertiserId:10,advertiserName:'Hedvig',programId:20,programName:'Hemförsäkring',
    status:'delayed',commission:500,currency:'SEK',subids:{r:'clk_fromsubid'},date:'2026-10-07T10:00:00Z'
  });
  assert.equal(delayed.status,'pending');
  assert.equal(delayed.hasLocalClickFormat,true);
});

test('combines Addrevenue stats with transaction status detail',()=>{
  const stats=[normalizeStats({
    advertiserId:10,advertiserName:'Hedvig',programId:20,programName:'Hemförsäkring',
    clicks:100,impressions:200,transactions:3,totalTransactions:4,commission:1500,currency:'SEK'
  })];
  const transactions=[
    normalizeTransaction({advertiserId:10,advertiserName:'Hedvig',programId:20,programName:'Hemförsäkring',status:'approved',commission:500,currency:'SEK',clickRef:'clk_a',date:'2026-10-07T10:00:00Z'}),
    normalizeTransaction({advertiserId:10,advertiserName:'Hedvig',programId:20,programName:'Hemförsäkring',status:'approved',commission:500,currency:'SEK',clickRef:'clk_b',date:'2026-10-07T10:05:00Z'}),
    normalizeTransaction({advertiserId:10,advertiserName:'Hedvig',programId:20,programName:'Hemförsäkring',status:'delayed',commission:500,currency:'SEK',clickRef:'legacy',date:'2026-10-07T10:10:00Z'}),
    normalizeTransaction({advertiserId:10,advertiserName:'Hedvig',programId:20,programName:'Hemförsäkring',status:'denied',commission:0,currency:'SEK',clickRef:'legacy2',date:'2026-10-07T10:15:00Z'}),
  ];
  const rows=aggregatePerformance(stats,transactions);
  assert.equal(rows.length,1);
  assert.equal(rows[0].clicks,100);
  assert.equal(rows[0].approvedTransactions,2);
  assert.equal(rows[0].pendingTransactions,1);
  assert.equal(rows[0].deniedTransactions,1);
  assert.equal(rows[0].approvedCommission,1000);
  assert.equal(rows[0].formatTaggedTransactions,2);
  assert.equal(rows[0].approvedRevenuePerClick,10);

  const totals=aggregateTotals(rows);
  assert.equal(totals.clicks,100);
  assert.equal(totals.approvedCommission,1000);
});

test('post-rollout coverage stays no_signal on fewer than three transactions',()=>{
  const transactions=[
    normalizeTransaction({advertiserId:1,programId:1,status:'approved',commission:100,currency:'SEK',clickRef:'clk_new',date:'2026-10-06T15:00:00Z'}),
    normalizeTransaction({advertiserId:1,programId:1,status:'approved',commission:100,currency:'SEK',clickRef:'legacy',date:'2026-10-06T13:00:00Z'}),
  ];
  const coverage=attributionCoverage(transactions,'2026-10-06T14:37:00Z');
  assert.equal(coverage.transactions,1);
  assert.equal(coverage.formatTaggedTransactions,1);
  assert.equal(coverage.status,'no_signal');
});

test('report never persists raw click references or subids',()=>{
  const transaction=normalizeTransaction({
    advertiserId:10,advertiserName:'Hedvig',programId:20,programName:'Hemförsäkring',
    status:'approved',commission:500,currency:'SEK',clickRef:'clk_secret123',subids:{r:'clk_secret123'},date:'2026-10-07T10:00:00Z'
  });
  const rows=aggregatePerformance([], [transaction]);
  const report={
    period:{from:'2026-10-07',to:'2026-10-07',days:1},
    configured:true,
    totals:aggregateTotals(rows),
    attributionCoverage:attributionCoverage([transaction],'2026-10-06T14:37:00Z'),
    rows,
  };
  const json=JSON.stringify(report);
  const markdown=toMarkdown(report);
  assert.doesNotMatch(json,/clk_secret123/);
  assert.doesNotMatch(markdown,/clk_secret123/);
});

test('date range is inclusive and bounded',()=>{
  assert.deepEqual(dateRange(3,new Date('2026-10-07T12:00:00Z')),{from:'2026-10-05',to:'2026-10-07',days:3});
  assert.equal(dateRange(999,new Date('2026-10-07T12:00:00Z')).days,365);
});

test('format-valid clickRef and subids are not verified first-party joins',()=>{
  const transactions=[normalizeTransaction({advertiserId:1,programId:1,status:'approved',commission:100,currency:'SEK',clickRef:'clk_unseen',date:'2026-10-07T12:00:00Z'})];
  assert.equal(transactions[0].hasLocalClickFormat,true);
  assert.equal(Object.hasOwn(transactions[0],'matchedLocalClick'),false);
  const rows=aggregatePerformance([],transactions);
  const total=aggregateTotals(rows);
  for(const value of [rows[0],total]){
    assert.equal(value.formatTaggedTransactions,1);
    assert.equal(value.formatTaggedApprovedTransactions,1);
    assert.equal(value.matchedTransactions,null);
    assert.equal(value.matchedApprovedTransactions,null);
    assert.equal(value.matchedApprovedConversionRate,null);
    assert.equal(value.attributionBasis,'reference_format_only');
    assert.equal(value.firstPartyMatchStatus,'UNKNOWN');
    assert.equal(value.approvedCommission,100);
    assert.equal(value.approvedRevenuePerClick,null);
    assert.equal(value.approvedConversionRate,null);
  }
  const coverage=attributionCoverage(transactions,'2026-10-06T14:37:00Z');
  assert.equal(coverage.coverage,1);
  assert.equal(coverage.formatTaggedTransactions,1);
  assert.equal(coverage.matchedTransactions,null);
  assert.equal(coverage.firstPartyMatchStatus,'UNKNOWN');
  assert.equal(coverage.attributionBasis,'reference_format_only');
});

test('zero clicks mean UNKNOWN while a positive denominator preserves genuine zero',()=>{
  const empty=aggregateTotals([]);
  const coverage=attributionCoverage([],'2026-10-06T14:37:00Z');
  assert.equal(empty.approvedRevenuePerClick,null);
  assert.equal(empty.approvedConversionRate,null);
  assert.equal(coverage.coverage,null);
  assert.equal(coverage.status,'no_signal');
  const rows=aggregatePerformance([normalizeStats({advertiserId:1,programId:1,clicks:10,currency:'SEK'})],[]);
  for(const value of [rows[0],aggregateTotals(rows)]){
    assert.equal(value.approvedRevenuePerClick,0);
    assert.equal(value.approvedConversionRate,0);
    assert.equal(value.matchedApprovedConversionRate,null);
  }
  const report={configured:true,period:{from:'2026-10-01',to:'2026-10-07',days:7},totals:empty,attributionCoverage:coverage,rows:[]};
  const markdown=toMarkdown(report);
  assert.match(markdown,/Godkänd provision per Addrevenue-klick: \*\*UNKNOWN\*\*/);
  assert.match(markdown,/Godkända transaktioner per Addrevenue-klick: \*\*UNKNOWN\*\*/);
  assert.match(markdown,/Verifierad förstapartsmatchning: \*\*UNKNOWN\*\*/);
  assert.match(markdown,/Referenser i lokalt klick-ID-format: \*\*0\/0\*\* \(UNKNOWN\)/);
  assert.match(markdown,/inte en klickkohorts eller sajtbesökares konverteringsgrad/);
  delete empty.approvedRevenuePerClick;
  assert.match(toMarkdown(report),/Godkänd provision per Addrevenue-klick: \*\*UNKNOWN\*\*/);
  const nonempty=toMarkdown({...report,totals:aggregateTotals(rows),rows});
  assert.match(nonempty,/Godkända transaktioner per Addrevenue-klick: \*\*0\s?%\*\*/);
});
