import test from 'node:test';
import assert from 'node:assert/strict';
import {
  aggregatePerformance,
  aggregateTotals,
  attributionCoverage,
  dateRange,
  normalizeAdtractionClick,
  normalizeAdtractionTransaction,
  toMarkdown,
} from '../scripts/lib/adtractionPerformance.mjs';

test('normalizes Adtraction clicks and local EPI markers',()=>{
  const tagged=normalizeAdtractionClick({
    programName:'Vattenfall SE',
    currency:'SEK',
    epi:'clk_abc123',
    epi2:'fs_session123',
  });
  assert.equal(tagged.partner,'Vattenfall SE');
  assert.equal(tagged.localClickId,'clk_abc123');
  assert.equal(tagged.localSessionId,'fs_session123');

  const legacy=normalizeAdtractionClick({programName:'Lassie SE',currency:'SEK',epi:'legacy'});
  assert.equal(legacy.localClickId,'');
  assert.equal(legacy.localSessionId,'');
});

test('aggregates clicks, sessions, transactions and approved revenue',()=>{
  const clicks=[
    normalizeAdtractionClick({programName:'Vattenfall SE',currency:'SEK',epi:'clk_a1',epi2:'fs_s1'}),
    normalizeAdtractionClick({programName:'Vattenfall SE',currency:'SEK',epi:'clk_a2',epi2:'fs_s1'}),
    normalizeAdtractionClick({programName:'Vattenfall SE',currency:'SEK',epi:'legacy'}),
  ];
  const transactions=[
    normalizeAdtractionTransaction({transactionStatus:1,commission:700,currency:'SEK',click:{programName:'Vattenfall SE',epi:'clk_a1'}}),
    normalizeAdtractionTransaction({transactionStatus:2,commission:700,currency:'SEK',click:{programName:'Vattenfall SE',epi:'clk_a2'}}),
    normalizeAdtractionTransaction({transactionStatus:5,commission:0,currency:'SEK',click:{programName:'Vattenfall SE',epi:'legacy'}}),
  ];

  const rows=aggregatePerformance(transactions,clicks);
  assert.equal(rows.length,1);
  assert.equal(rows[0].totalClicks,3);
  assert.equal(rows[0].taggedClicks,2);
  assert.equal(rows[0].distinctTaggedClicks,2);
  assert.equal(rows[0].distinctFunnelSessions,1);
  assert.equal(rows[0].approvedTransactions,1);
  assert.equal(rows[0].pendingTransactions,1);
  assert.equal(rows[0].deniedTransactions,1);
  assert.equal(rows[0].matchedTransactions,2);
  assert.equal(rows[0].approvedCommission,700);
  assert.equal(rows[0].approvedRevenuePerClick,700/3);

  const totals=aggregateTotals(transactions,clicks);
  assert.equal(totals.taggedClicks,2);
  assert.equal(totals.distinctFunnelSessions,1);
  assert.equal(totals.approvedTransactions,1);
});

test('separates post-rollout EPI coverage from legacy clicks',()=>{
  const clicks=[
    normalizeAdtractionClick({programName:'Hallon',currency:'SEK',clickDate:'2026-10-06T13:00:00+0000',epi:''}),
    normalizeAdtractionClick({programName:'Hallon',currency:'SEK',clickDate:'2026-10-06T15:00:00+0000',epi:'clk_new1',epi2:'fs_one'}),
    normalizeAdtractionClick({programName:'Tele2',currency:'SEK',clickDate:'2026-10-07T07:00:00+0000',epi:'clk_new2',epi2:'fs_two'}),
  ];
  const coverage=attributionCoverage(clicks,'2026-10-06T14:24:38Z');
  assert.equal(coverage.clicks,2);
  assert.equal(coverage.taggedClicks,2);
  assert.equal(coverage.distinctFunnelSessions,2);
  assert.equal(coverage.tagCoverage,1);
  assert.equal(coverage.status,'no_signal');
});

test('report output never persists raw click or session IDs',()=>{
  const clicks=[
    normalizeAdtractionClick({programName:'Fello',currency:'SEK',epi:'clk_secret123',epi2:'fs_secret456'}),
  ];
  const transactions=[
    normalizeAdtractionTransaction({transactionStatus:1,commission:260,currency:'SEK',click:{programName:'Fello',epi:'clk_secret123'}}),
  ];
  const report={
    period:{from:'2026-10-01',to:'2026-10-07',days:7},
    totals:aggregateTotals(transactions,clicks),
    attributionCoverage:attributionCoverage(clicks,'2026-10-06T14:24:38Z'),
    rows:aggregatePerformance(transactions,clicks),
  };
  const json=JSON.stringify(report);
  const markdown=toMarkdown(report);
  assert.doesNotMatch(json,/clk_secret123/);
  assert.doesNotMatch(json,/fs_secret456/);
  assert.doesNotMatch(markdown,/clk_secret123/);
  assert.doesNotMatch(markdown,/fs_secret456/);
});

test('date range is inclusive and bounded',()=>{
  assert.deepEqual(dateRange(3,new Date('2026-10-07T12:00:00Z')),{from:'2026-10-05',to:'2026-10-07',days:3});
  assert.equal(dateRange(999,new Date('2026-10-07T12:00:00Z')).days,365);
});
