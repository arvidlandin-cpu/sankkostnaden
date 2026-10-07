const LOCAL_CLICK=/^clk_[a-z0-9]+$/i;
const LOCAL_SESSION=/^fs_[a-z0-9]+$/i;

export function dateRange(days=30,now=new Date()){
  const safe=Math.min(365,Math.max(1,Math.round(Number(days)||30)));
  const to=new Date(now);
  const from=new Date(now);
  from.setUTCDate(from.getUTCDate()-(safe-1));
  return {from:from.toISOString().slice(0,10),to:to.toISOString().slice(0,10),days:safe};
}

export function normalizeAdtractionTransaction(transaction){
  const statusNumber=Number(transaction?.transactionStatus);
  const status=statusNumber===1?'approved'
    :statusNumber===2?'pending'
    :statusNumber===4?'claim'
    :statusNumber===5?'denied'
    :'other';
  const epi=String(transaction?.click?.epi||transaction?.epi||'');
  return {
    partner:String(transaction?.click?.programName||transaction?.programName||'Okänt program'),
    currency:String(transaction?.currency||'SEK'),
    status,
    commission:Number(transaction?.commission)||0,
    matchedLocalClick:LOCAL_CLICK.test(epi),
  };
}

export function normalizeAdtractionClick(click){
  const epi=String(click?.epi||'');
  const epi2=String(click?.epi2||'');
  return {
    partner:String(click?.programName||'Okänt program'),
    currency:String(click?.currency||'SEK'),
    localClickId:LOCAL_CLICK.test(epi)?epi:'',
    localSessionId:LOCAL_SESSION.test(epi2)?epi2:'',
  };
}

export function aggregatePerformance(transactions,clicks){
  const grouped=new Map();

  function getRow(partner,currency){
    const key=[partner,currency].join('|');
    if(!grouped.has(key)){
      grouped.set(key,{
        partner,
        currency,
        totalClicks:0,
        taggedClicks:0,
        distinctTaggedClicks:0,
        distinctFunnelSessions:0,
        totalTransactions:0,
        approvedTransactions:0,
        pendingTransactions:0,
        deniedTransactions:0,
        claims:0,
        otherTransactions:0,
        matchedTransactions:0,
        matchedApprovedTransactions:0,
        approvedCommission:0,
        pendingCommission:0,
        approvedRevenuePerClick:0,
        approvedRevenuePerTaggedClick:0,
        approvedConversionRate:0,
        taggedApprovedConversionRate:0,
        tagCoverage:0,
        _clickIds:new Set(),
        _sessionIds:new Set(),
      });
    }
    return grouped.get(key);
  }

  for(const click of clicks){
    const row=getRow(click.partner,click.currency);
    row.totalClicks+=1;
    if(click.localClickId){
      row.taggedClicks+=1;
      row._clickIds.add(click.localClickId);
    }
    if(click.localSessionId) row._sessionIds.add(click.localSessionId);
  }

  for(const transaction of transactions){
    const row=getRow(transaction.partner,transaction.currency);
    row.totalTransactions+=1;
    if(transaction.matchedLocalClick) row.matchedTransactions+=1;
    if(transaction.status==='approved'){
      row.approvedTransactions+=1;
      row.approvedCommission+=transaction.commission;
      if(transaction.matchedLocalClick) row.matchedApprovedTransactions+=1;
    }else if(transaction.status==='pending'){
      row.pendingTransactions+=1;
      row.pendingCommission+=transaction.commission;
    }else if(transaction.status==='denied'){
      row.deniedTransactions+=1;
    }else if(transaction.status==='claim'){
      row.claims+=1;
    }else{
      row.otherTransactions+=1;
    }
  }

  return [...grouped.values()].map(row=>{
    row.distinctTaggedClicks=row._clickIds.size;
    row.distinctFunnelSessions=row._sessionIds.size;
    row.tagCoverage=row.totalClicks?row.taggedClicks/row.totalClicks:0;
    row.approvedRevenuePerClick=row.totalClicks?row.approvedCommission/row.totalClicks:0;
    row.approvedRevenuePerTaggedClick=row.taggedClicks?row.approvedCommission/row.taggedClicks:0;
    row.approvedConversionRate=row.totalClicks?row.approvedTransactions/row.totalClicks:0;
    row.taggedApprovedConversionRate=row.taggedClicks?row.matchedApprovedTransactions/row.taggedClicks:0;
    delete row._clickIds;
    delete row._sessionIds;
    return row;
  }).sort((a,b)=>
    b.approvedCommission-a.approvedCommission||
    b.totalClicks-a.totalClicks||
    a.partner.localeCompare(b.partner,'sv')
  );
}

export function aggregateTotals(transactions,clicks){
  const clickIds=new Set();
  const sessionIds=new Set();
  const total={
    currency:'SEK',
    totalClicks:0,
    taggedClicks:0,
    distinctTaggedClicks:0,
    distinctFunnelSessions:0,
    totalTransactions:0,
    approvedTransactions:0,
    pendingTransactions:0,
    deniedTransactions:0,
    claims:0,
    otherTransactions:0,
    matchedTransactions:0,
    matchedApprovedTransactions:0,
    approvedCommission:0,
    pendingCommission:0,
    tagCoverage:0,
    approvedRevenuePerClick:0,
    approvedRevenuePerTaggedClick:0,
    approvedConversionRate:0,
    taggedApprovedConversionRate:0,
  };

  for(const click of clicks){
    total.totalClicks+=1;
    if(click.localClickId){
      total.taggedClicks+=1;
      clickIds.add(click.localClickId);
    }
    if(click.localSessionId) sessionIds.add(click.localSessionId);
  }
  for(const transaction of transactions){
    total.totalTransactions+=1;
    if(transaction.matchedLocalClick) total.matchedTransactions+=1;
    if(transaction.status==='approved'){
      total.approvedTransactions+=1;
      total.approvedCommission+=transaction.commission;
      if(transaction.matchedLocalClick) total.matchedApprovedTransactions+=1;
    }else if(transaction.status==='pending'){
      total.pendingTransactions+=1;
      total.pendingCommission+=transaction.commission;
    }else if(transaction.status==='denied') total.deniedTransactions+=1;
    else if(transaction.status==='claim') total.claims+=1;
    else total.otherTransactions+=1;
  }
  total.distinctTaggedClicks=clickIds.size;
  total.distinctFunnelSessions=sessionIds.size;
  total.tagCoverage=total.totalClicks?total.taggedClicks/total.totalClicks:0;
  total.approvedRevenuePerClick=total.totalClicks?total.approvedCommission/total.totalClicks:0;
  total.approvedRevenuePerTaggedClick=total.taggedClicks?total.approvedCommission/total.taggedClicks:0;
  total.approvedConversionRate=total.totalClicks?total.approvedTransactions/total.totalClicks:0;
  total.taggedApprovedConversionRate=total.taggedClicks?total.matchedApprovedTransactions/total.taggedClicks:0;
  return total;
}

export function toMarkdown(report){
  const money=value=>new Intl.NumberFormat('sv-SE',{style:'currency',currency:'SEK',maximumFractionDigits:2}).format(value||0);
  const pct=value=>new Intl.NumberFormat('sv-SE',{style:'percent',maximumFractionDigits:1}).format(value||0);
  const t=report.totals;
  const lines=[
    '# Adtraction performance',
    '',
    `Period: ${report.period.from} – ${report.period.to} (${report.period.days} dagar)`,
    '',
    `- Klick hos Adtraction: **${t.totalClicks}**`,
    `- Klick med Sänk Kostnadens epi: **${t.taggedClicks}/${t.totalClicks}** (${pct(t.tagCoverage)})`,
    `- Distinkta lokala klick-ID: **${t.distinctTaggedClicks}**`,
    `- Distinkta funnel-sessioner via epi2: **${t.distinctFunnelSessions}**`,
    `- Godkända transaktioner: **${t.approvedTransactions}** · ${money(t.approvedCommission)}`,
    `- Väntande transaktioner: **${t.pendingTransactions}** · ${money(t.pendingCommission)}`,
    `- Nekade transaktioner: **${t.deniedTransactions}**`,
    `- Transaktioner matchade till lokalt klick-ID: **${t.matchedTransactions}/${t.totalTransactions}**`,
    `- Godkänd intäkt per Adtraction-klick: **${money(t.approvedRevenuePerClick)}**`,
    `- Godkänd konverteringsgrad per Adtraction-klick: **${pct(t.approvedConversionRate)}**`,
    '',
  ];

  if(report.rows.length){
    lines.push(
      '## Partner/program',
      '',
      '| Partner | Klick | Taggade | Godkända | Väntande | Nekade | Godkänd provision | Intäkt/klick |',
      '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |'
    );
    for(const row of report.rows){
      lines.push(`| ${row.partner.replace(/\\|/g,'/')} | ${row.totalClicks} | ${row.taggedClicks} | ${row.approvedTransactions} | ${row.pendingTransactions} | ${row.deniedTransactions} | ${money(row.approvedCommission)} | ${money(row.approvedRevenuePerClick)} |`);
    }
    lines.push('');
  }

  lines.push('Råa order-ID, klick-ID, EPI/EPI2-värden och andra person- eller transaktionsidentifierare sparas inte i artefakten. Endast aggregerade mätvärden lagras.','');
  return lines.join('\n');
}
