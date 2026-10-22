const LOCAL_CLICK=/^clk_[a-z0-9]+$/i;

export function dateRange(days=30,now=new Date()){
  const safe=Math.min(365,Math.max(1,Math.round(Number(days)||30)));
  const to=new Date(now);
  const from=new Date(now);
  from.setUTCDate(from.getUTCDate()-(safe-1));
  return {from:from.toISOString().slice(0,10),to:to.toISOString().slice(0,10),days:safe};
}

function containsLocalClick(value){
  if(value==null) return false;
  if(typeof value==='string'||typeof value==='number') return LOCAL_CLICK.test(String(value));
  if(Array.isArray(value)) return value.some(containsLocalClick);
  if(typeof value==='object') return Object.values(value).some(containsLocalClick);
  return false;
}

export function normalizeTransaction(transaction){
  const raw=String(transaction?.status||'').toLowerCase();
  const status=raw==='approved'||raw==='paidout'?'approved'
    :raw==='new'||raw==='delayed'?'pending'
    :raw==='denied'?'denied'
    :'other';
  return {
    advertiserId:String(transaction?.advertiserId??''),
    advertiserName:String(transaction?.advertiserName||'Okänd annonsör'),
    programId:String(transaction?.programId??''),
    programName:String(transaction?.programName||'Okänt program'),
    status,
    commission:Number(transaction?.commission ?? 0)||0,
    currency:String(transaction?.currency||'SEK'),
    hasLocalClickFormat:containsLocalClick(transaction?.clickRef)||containsLocalClick(transaction?.subids),
    date:String(transaction?.date||transaction?.created||''),
  };
}

export function normalizeStats(row){
  return {
    advertiserId:String(row?.advertiserId??''),
    advertiserName:String(row?.advertiserName||'Okänd annonsör'),
    programId:String(row?.programId??''),
    programName:String(row?.programName||'Okänt program'),
    clicks:Number(row?.clicks)||0,
    impressions:Number(row?.impressions)||0,
    transactions:Number(row?.transactions)||0,
    totalTransactions:Number(row?.totalTransactions)||0,
    deniedTransactions:Number(row?.deniedTransactions)||0,
    commission:Number(row?.commission)||0,
    deniedCommission:Number(row?.deniedCommission)||0,
    epc:Number(row?.epc)||0,
    cr:Number(row?.cr)||0,
    currency:String(row?.currency||'SEK'),
  };
}

function keyOf(item){
  return [item.advertiserId,item.programId,item.currency].join('|');
}

export function aggregatePerformance(statsRows,transactions){
  const grouped=new Map();

  function rowFor(item){
    const key=keyOf(item);
    if(!grouped.has(key)){
      grouped.set(key,{
        advertiserId:item.advertiserId,
        advertiserName:item.advertiserName,
        programId:item.programId,
        programName:item.programName,
        currency:item.currency||'SEK',
        clicks:0,
        impressions:0,
        networkTransactions:0,
        approvedTransactions:0,
        pendingTransactions:0,
        deniedTransactions:0,
        otherTransactions:0,
        matchedTransactions:null,
        formatTaggedTransactions:0,
        matchedApprovedTransactions:null,
        formatTaggedApprovedTransactions:0,
        attributionBasis:'reference_format_only',
        firstPartyMatchStatus:'UNKNOWN',
        approvedCommission:0,
        pendingCommission:0,
        networkCommission:0,
        approvedRevenuePerClick:0,
        approvedConversionRate:0,
        matchedApprovedConversionRate:null,
      });
    }
    const row=grouped.get(key);
    if(row.advertiserName==='Okänd annonsör'&&item.advertiserName) row.advertiserName=item.advertiserName;
    if(row.programName==='Okänt program'&&item.programName) row.programName=item.programName;
    return row;
  }

  for(const stat of statsRows){
    const row=rowFor(stat);
    row.clicks+=stat.clicks;
    row.impressions+=stat.impressions;
    row.networkTransactions+=stat.totalTransactions||stat.transactions;
    row.networkCommission+=stat.commission;
  }

  for(const transaction of transactions){
    const row=rowFor(transaction);
    if(transaction.hasLocalClickFormat) row.formatTaggedTransactions+=1;
    if(transaction.status==='approved'){
      row.approvedTransactions+=1;
      row.approvedCommission+=transaction.commission;
      if(transaction.hasLocalClickFormat) row.formatTaggedApprovedTransactions+=1;
    }else if(transaction.status==='pending'){
      row.pendingTransactions+=1;
      row.pendingCommission+=transaction.commission;
    }else if(transaction.status==='denied'){
      row.deniedTransactions+=1;
    }else{
      row.otherTransactions+=1;
    }
  }

  return [...grouped.values()].map(row=>{
    row.approvedRevenuePerClick=row.clicks?row.approvedCommission/row.clicks:null;
    row.approvedConversionRate=row.clicks?row.approvedTransactions/row.clicks:null;
    row.matchedApprovedConversionRate=null;
    return row;
  }).sort((a,b)=>
    b.approvedCommission-a.approvedCommission||
    b.clicks-a.clicks||
    a.advertiserName.localeCompare(b.advertiserName,'sv')
  );
}

export function aggregateTotals(rows){
  const total={
    currency:'SEK',
    clicks:0,
    impressions:0,
    networkTransactions:0,
    approvedTransactions:0,
    pendingTransactions:0,
    deniedTransactions:0,
    otherTransactions:0,
    matchedTransactions:null,
    formatTaggedTransactions:0,
    matchedApprovedTransactions:null,
    formatTaggedApprovedTransactions:0,
    attributionBasis:'reference_format_only',
    firstPartyMatchStatus:'UNKNOWN',
    approvedCommission:0,
    pendingCommission:0,
    networkCommission:0,
    approvedRevenuePerClick:0,
    approvedConversionRate:0,
    matchedApprovedConversionRate:null,
  };
  for(const row of rows){
    for(const field of ['clicks','impressions','networkTransactions','approvedTransactions','pendingTransactions','deniedTransactions','otherTransactions','formatTaggedTransactions','formatTaggedApprovedTransactions','approvedCommission','pendingCommission','networkCommission']){
      total[field]+=Number(row[field])||0;
    }
  }
  total.approvedRevenuePerClick=total.clicks?total.approvedCommission/total.clicks:null;
  total.approvedConversionRate=total.clicks?total.approvedTransactions/total.clicks:null;
  total.matchedApprovedConversionRate=null;
  return total;
}

export function attributionCoverage(transactions,since){
  const cutoff=Date.parse(since);
  const recent=Number.isFinite(cutoff)
    ? transactions.filter(item=>Date.parse(item.date)>=cutoff)
    : transactions;
  const matched=recent.filter(item=>item.hasLocalClickFormat);
  const ratio=recent.length?matched.length/recent.length:null;
  const status=recent.length<3?'no_signal':ratio>=0.9?'healthy':ratio>=0.5?'watch':'warning';
  return {
    since,
    attributionBasis:'reference_format_only',
    firstPartyMatchStatus:'UNKNOWN',
    transactions:recent.length,
    matchedTransactions:null,
    formatTaggedTransactions:matched.length,
    coverage:ratio,
    status,
  };
}

export function toMarkdown(report){
  const money=(value,currency='SEK')=>value==null||!Number.isFinite(value)?'UNKNOWN':new Intl.NumberFormat('sv-SE',{style:'currency',currency,maximumFractionDigits:2}).format(value);
  const pct=value=>value==null||!Number.isFinite(value)?'UNKNOWN':new Intl.NumberFormat('sv-SE',{style:'percent',maximumFractionDigits:1}).format(value);
  const lines=['# Addrevenue performance','',`Period: ${report.period.from} – ${report.period.to} (${report.period.days} dagar)`,''];

  if(!report.configured){
    lines.push('Inte konfigurerad – ADDREVENUE_API_TOKEN saknas i GitHub Actions.','');
    return lines.join('\n');
  }

  const t=report.totals;
  const a=report.attributionCoverage;
  lines.push(
    `- Klick hos Addrevenue: **${t.clicks}**`,
    `- Godkända transaktioner: **${t.approvedTransactions}** · ${money(t.approvedCommission,t.currency)}`,
    `- Väntande transaktioner: **${t.pendingTransactions}** · ${money(t.pendingCommission,t.currency)}`,
    `- Nekade transaktioner: **${t.deniedTransactions}**`,
    `- Transaktioner med referens i lokalt klick-ID-format: **${t.formatTaggedTransactions}/${t.approvedTransactions+t.pendingTransactions+t.deniedTransactions+t.otherTransactions}**`,
    '- Verifierad förstapartsmatchning: **UNKNOWN**',
    `- Godkänd provision per Addrevenue-klick: **${money(t.approvedRevenuePerClick,t.currency)}**`,
    `- Godkända transaktioner per Addrevenue-klick: **${pct(t.approvedConversionRate)}**`,
    '',
    '## ClickRef-formattäckning efter driftsättning',
    '',
    `- Start: **${a.since}**`,
    `- Transaktioner efter start: **${a.transactions}**`,
    `- Referenser i lokalt klick-ID-format: **${a.formatTaggedTransactions}/${a.transactions}** (${pct(a.coverage)})`,
    `- Signalstatus: **${a.status}**`,
    ''
  );

  if(report.rows.length){
    lines.push(
      '## Annonsör/program',
      '',
      '| Annonsör | Program | Klick | Godkända | Väntande | Nekade | Godkänd provision | Intäkt/klick | Lokalt ID-format |',
      '| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |'
    );
    for(const row of report.rows){
      const tx=row.approvedTransactions+row.pendingTransactions+row.deniedTransactions+row.otherTransactions;
      lines.push(`| ${row.advertiserName.replace(/\|/g,'/')} | ${row.programName.replace(/\|/g,'/')} | ${row.clicks} | ${row.approvedTransactions} | ${row.pendingTransactions} | ${row.deniedTransactions} | ${money(row.approvedCommission,row.currency)} | ${money(row.approvedRevenuePerClick,row.currency)} | ${row.formatTaggedTransactions}/${tx} |`);
    }
    lines.push('');
  }

  lines.push('Referenserna har endast formatkontrollerats; de har inte matchats mot verifierade förstapartsklick eller trafikursprung. Periodkvoterna använder nätverkets klick och affärer under rapportperioden. Klick och affärer kan härröra från olika tidpunkter; kvoterna är inte en klickkohorts eller sajtbesökares konverteringsgrad.','');
  lines.push('Råa order-ID, clickRef, sub-ID:n, klick-ID:n och andra transaktionsidentifierare sparas inte i artefakten. Endast aggregerade mätvärden lagras.','');
  return lines.join('\n');
}
