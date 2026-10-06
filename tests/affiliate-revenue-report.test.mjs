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
  assert.equal(approved.matchedLocalClick,true);

  const rejected=normalizeAdtraction({
    transactionStatus:5,
    commission:0,
    currency:'SEK',
    click:{programName:'E.ON',epi:'legacy-ref'},
  });
  assert.equal(rejected.status,'denied');
  assert.equal(rejected.matchedLocalClick,false);
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
  assert.equal(approved.matchedLocalClick,true);

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
    {network:'adtraction',partner:'E.ON',status:'approved',commission:900,currency:'SEK',matchedLocalClick:true},
    {network:'adtraction',partner:'E.ON',status:'pending',commission:900,currency:'SEK',matchedLocalClick:true},
    {network:'addrevenue',partner:'Hedvig',status:'approved',commission:500,currency:'SEK',matchedLocalClick:true},
    {network:'addrevenue',partner:'Hedvig',status:'denied',commission:500,currency:'SEK',matchedLocalClick:false},
  ]);

  const eon=rows.find(row=>row.partner==='E.ON');
  assert.equal(eon.approvedTransactions,1);
  assert.equal(eon.pendingTransactions,1);
  assert.equal(eon.approvedCommission,900);
  assert.equal(eon.matchedTransactions,2);

  const totals=networkTotals(rows);
  assert.equal(totals.find(row=>row.network==='addrevenue').approvedCommission,500);

  const markdown=toMarkdown({
    period:{from:'2026-10-01',to:'2026-10-06',days:6},
    networks:[{network:'adtraction',configured:true},{network:'addrevenue',configured:true}],
    totals,
    rows,
  });
  assert.match(markdown,/Godkänd provision/);
  assert.doesNotMatch(markdown,/clk_/);
});

test('date range is inclusive and bounded',()=>{
  assert.deepEqual(dateRange(3,new Date('2026-10-06T12:00:00Z')),{from:'2026-10-04',to:'2026-10-06',days:3});
  assert.equal(dateRange(999,new Date('2026-10-06T12:00:00Z')).days,365);
  assert.equal(dateRange(0,new Date('2026-10-06T12:00:00Z')).days,30);
});
