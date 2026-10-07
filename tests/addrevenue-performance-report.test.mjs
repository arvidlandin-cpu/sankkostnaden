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
  assert.equal(approved.matchedLocalClick,true);

  const delayed=normalizeTransaction({
    advertiserId:10,advertiserName:'Hedvig',programId:20,programName:'Hemförsäkring',
    status:'delayed',commission:500,currency:'SEK',subids:{r:'clk_fromsubid'},date:'2026-10-07T10:00:00Z'
  });
  assert.equal(delayed.status,'pending');
  assert.equal(delayed.matchedLocalClick,true);
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
  assert.equal(rows[0].matchedTransactions,2);
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
  assert.equal(coverage.matchedTransactions,1);
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
