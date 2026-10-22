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
  assert.equal(rows[0].formatTaggedTransactions,2);
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

test('an unseen format-valid EPI never establishes a first-party transaction match',()=>{
  const transaction=normalizeAdtractionTransaction({transactionStatus:1,commission:100,currency:'SEK',click:{programName:'Example',epi:'clk_neverseen'}});
  assert.equal(transaction.hasLocalClickFormat,true);
  assert.equal(Object.hasOwn(transaction,'matchedLocalClick'),false);
  const rows=aggregatePerformance([transaction],[]);
  const totals=aggregateTotals([transaction],[]);
  for(const value of [rows[0],totals]){
    assert.equal(value.formatTaggedTransactions,1);
    assert.equal(value.formatTaggedApprovedTransactions,1);
    assert.equal(value.matchedTransactions,null);
    assert.equal(value.matchedApprovedTransactions,null);
    assert.equal(value.firstPartyMatchStatus,'UNKNOWN');
    assert.equal(value.attributionBasis,'reference_format_only');
    assert.equal(value.approvedCommission,100);
    assert.equal(value.approvedRevenuePerClick,null);
    assert.equal(value.approvedConversionRate,null);
    assert.equal(value.approvedRevenuePerTaggedClick,null);
    assert.equal(value.taggedApprovedConversionRate,null);
  }
});

test('network clicks and matching network EPI do not prove first-party attribution',()=>{
  const click=normalizeAdtractionClick({programName:'Example',currency:'SEK',epi:'clk_same',epi2:'fs_same'});
  const tx=normalizeAdtractionTransaction({transactionStatus:1,commission:200,currency:'SEK',click:{programName:'Example',epi:'clk_same'}});
  for(const value of [aggregatePerformance([tx],[click])[0],aggregateTotals([tx],[click])]){
    assert.equal(value.approvedRevenuePerClick,200);
    assert.equal(value.approvedConversionRate,1);
    assert.equal(value.matchedTransactions,null);
    assert.equal(value.approvedRevenuePerTaggedClick,null);
    assert.equal(value.taggedApprovedConversionRate,null);
  }
  const zero=aggregateTotals([],[click]);
  assert.equal(zero.approvedRevenuePerClick,0);
  assert.equal(zero.approvedConversionRate,0);
});

test('empty Adtraction denominators remain UNKNOWN in JSON and Markdown',()=>{
  const totals=aggregateTotals([],[]);
  const coverage=attributionCoverage([],'2026-10-06T14:24:38Z');
  assert.equal(totals.tagCoverage,null);
  assert.equal(totals.approvedRevenuePerClick,null);
  assert.equal(totals.approvedConversionRate,null);
  assert.equal(coverage.tagCoverage,null);
  assert.equal(coverage.status,'no_signal');
  assert.equal(coverage.attributionBasis,'reference_format_only');
  assert.equal(coverage.firstPartyMatchStatus,'UNKNOWN');
  const report={period:{from:'2026-10-01',to:'2026-10-07',days:7},totals,attributionCoverage:coverage,rows:[]};
  const markdown=toMarkdown(report);
  assert.match(markdown,/Godkänd provision per Adtraction-klick: \*\*UNKNOWN\*\*/);
  assert.match(markdown,/Godkända transaktioner per Adtraction-klick: \*\*UNKNOWN\*\*/);
  assert.match(markdown,/Verifierad förstapartsmatchning: \*\*UNKNOWN\*\*/);
  assert.match(markdown,/inte en klickkohorts eller sajtbesökares konverteringsgrad/);
  assert.match(markdown,/Godkända transaktioner: \*\*0\*\*/);
  delete totals.approvedRevenuePerClick;
  assert.match(toMarkdown(report),/Godkänd provision per Adtraction-klick: \*\*UNKNOWN\*\*/);
});

test('untagged approved commission is never attributed to tagged clicks',()=>{
  const clicks=['clk_one','clk_two'].map(epi=>normalizeAdtractionClick({programName:'Example',currency:'SEK',epi}));
  const transaction=normalizeAdtractionTransaction({transactionStatus:1,commission:100,currency:'SEK',click:{programName:'Example',epi:'legacy'}});
  assert.equal(transaction.hasLocalClickFormat,false);
  for(const value of [aggregatePerformance([transaction],clicks)[0],aggregateTotals([transaction],clicks)]){
    assert.equal(value.taggedClicks,2);
    assert.equal(value.approvedCommission,100);
    assert.equal(value.approvedRevenuePerClick,50);
    assert.equal(value.formatTaggedApprovedTransactions,0);
    assert.equal(value.approvedRevenuePerTaggedClick,null);
    assert.equal(value.taggedApprovedConversionRate,null);
    assert.equal(value.matchedApprovedTransactions,null);
  }
});
