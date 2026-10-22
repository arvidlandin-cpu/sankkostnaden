import test from 'node:test';
import assert from 'node:assert/strict';
import { aggregateTransactions, dateRange, networkTotals, normalizeAddrevenue, normalizeAdtraction, toMarkdown } from '../scripts/lib/affiliateRevenue.mjs';

test('normalizes Adtraction status, commission and EPI click reference',()=>{
  const approved=normalizeAdtraction({
    transactionStatus:1,
    commission:900,
    currency:'SEK',
    click:{programName:'E.ON',epi:'clk_abc123',epi2:'fs_xyz'},
  });
  assert.equal(approved.network,'adtraction');
  assert.equal(approved.partner,'E.ON');
  assert.equal(approved.status,'approved');
  assert.equal(approved.commission,900);
  assert.equal(approved.hasLocalClickFormat,true);

  const rejected=normalizeAdtraction({
    transactionStatus:5,
    commission:0,
    currency:'SEK',
    click:{programName:'E.ON',epi:'legacy-ref'},
  });
  assert.equal(rejected.status,'denied');
  assert.equal(rejected.hasLocalClickFormat,false);
});

test('normalizes Addrevenue approved, pending and paid-out statuses',()=>{
  const approved=normalizeAddrevenue({
    status:'approved',
    commission:500,
    currency:'SEK',
    advertiserName:'Hedvig',
    clickRef:'clk_abc123',
  });
  assert.equal(approved.status,'approved');
  assert.equal(approved.hasLocalClickFormat,true);

  const paid=normalizeAddrevenue({
    status:'paidOut',
    commissionAmount:240,
    currency:'SEK',
    programName:'Lägenhet',
    clickRef:'clk_paid123',
  });
  assert.equal(paid.status,'approved');
  assert.equal(paid.commission,240);

  const delayed=normalizeAddrevenue({
    status:'delayed',
    commission:100,
    currency:'SEK',
    advertiserName:'Test',
  });
  assert.equal(delayed.status,'pending');
});

test('aggregates approved revenue without exposing raw click references',()=>{
  const rows=aggregateTransactions([
    {network:'adtraction',partner:'E.ON',status:'approved',commission:900,currency:'SEK',hasLocalClickFormat:true},
    {network:'adtraction',partner:'E.ON',status:'pending',commission:900,currency:'SEK',hasLocalClickFormat:true},
    {network:'addrevenue',partner:'Hedvig',status:'approved',commission:500,currency:'SEK',hasLocalClickFormat:true},
    {network:'addrevenue',partner:'Hedvig',status:'denied',commission:500,currency:'SEK',hasLocalClickFormat:false},
  ]);

  const eon=rows.find(row=>row.partner==='E.ON');
  assert.equal(eon.approvedTransactions,1);
  assert.equal(eon.pendingTransactions,1);
  assert.equal(eon.approvedCommission,900);
  assert.equal(eon.formatTaggedTransactions,2);
  assert.equal(eon.matchedTransactions,null);
  assert.equal(eon.firstPartyMatchStatus,'UNKNOWN');

  const totals=networkTotals(rows);
  assert.equal(totals.find(row=>row.network==='addrevenue').approvedCommission,500);
  assert.equal(totals.find(row=>row.network==='adtraction').matchedTransactions,null);

  const markdown=toMarkdown({
    period:{from:'2026-10-01',to:'2026-10-06',days:6},
    networks:[{network:'adtraction',configured:true},{network:'addrevenue',configured:true}],
    totals,
    rows,
  });
  assert.match(markdown,/Godkänd provision/);
  assert.doesNotMatch(markdown,/clk_/);
});

test('a format-valid reference never proves a first-party click or traffic-source join',()=>{
  const transactions=[
    normalizeAdtraction({transactionStatus:1,commission:100,currency:'SEK',epi:'clk_neverseen'}),
    normalizeAddrevenue({status:'approved',commission:200,currency:'SEK',clickRef:'clk_otherunseen'}),
  ];
  for(const transaction of transactions){
    assert.equal(transaction.hasLocalClickFormat,true);
    assert.equal(transaction.matchedLocalClick,undefined);
  }
  const rows=aggregateTransactions(transactions);
  const totals=networkTotals(rows);
  for(const row of [...rows,...totals]){
    assert.equal(row.formatTaggedTransactions,1);
    assert.equal(row.matchedTransactions,null);
    assert.equal(row.attributionBasis,'reference_format_only');
    assert.equal(row.firstPartyMatchStatus,'UNKNOWN');
    assert.equal(row.approvedTransactions,1);
  }
  assert.equal(totals.reduce((sum,row)=>sum+row.approvedCommission,0),300);
  const report={period:dateRange(1,new Date('2026-10-22T12:00:00Z')),networks:[{network:'adtraction',configured:true},{network:'addrevenue',configured:true}],rows,totals};
  const markdown=toMarkdown(report);
  assert.match(markdown,/Verifierad förstapartsmatchning: \*\*UNKNOWN\*\*/);
  assert.match(markdown,/Formatgiltiga referenser/);
  assert.doesNotMatch(markdown,/Matchade till Sänk Kostnadens klick-ID|Matchade klick/);
  assert.doesNotMatch(JSON.stringify(report)+markdown,/clk_neverseen|clk_otherunseen/);
});

test('legacy regex-based matched flags cannot become verified matches',()=>{
  const rows=aggregateTransactions([{network:'adtraction',partner:'Test',currency:'SEK',status:'pending',commission:50,matchedLocalClick:true}]);
  assert.equal(rows[0].formatTaggedTransactions,0);
  assert.equal(rows[0].matchedTransactions,null);
  const totals=networkTotals(rows);
  assert.equal(totals[0].matchedTransactions,null);
  assert.equal(totals[0].pendingCommission,50);
});

test('missing commission is UNKNOWN in markdown while known zero remains zero',()=>{
  const rows=aggregateTransactions([normalizeAdtraction({transactionStatus:1,commission:0,currency:'SEK'})]);
  const totals=networkTotals(rows);
  const report={period:dateRange(1,new Date('2026-10-22T12:00:00Z')),networks:[{network:'adtraction',configured:true}],rows,totals};
  assert.doesNotMatch(toMarkdown(report),/Godkända: \*\*1\*\* · UNKNOWN/);
  totals[0].approvedCommission=null;
  assert.match(toMarkdown(report),/Godkända: \*\*1\*\* · UNKNOWN/);
});

test('date range is inclusive and bounded',()=>{
  assert.deepEqual(dateRange(3,new Date('2026-10-06T12:00:00Z')),{from:'2026-10-04',to:'2026-10-06',days:3});
  assert.equal(dateRange(999,new Date('2026-10-06T12:00:00Z')).days,365);
  assert.equal(dateRange(0,new Date('2026-10-06T12:00:00Z')).days,30);
});
