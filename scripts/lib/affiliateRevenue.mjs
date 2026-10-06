const LOCAL_CLICK=/^clk_[a-z0-9]+$/i;

export function dateRange(days=30, now=new Date()){
  const safe=Math.min(365,Math.max(1,Math.round(Number(days)||30)));
  const to=new Date(now);
  const from=new Date(now);
  from.setUTCDate(from.getUTCDate()-(safe-1));
  return {from:from.toISOString().slice(0,10),to:to.toISOString().slice(0,10),days:safe};
}

export function normalizeAdtraction(transaction){
  const statusNumber=Number(transaction?.transactionStatus);
  const status=statusNumber===1?'approved'
    :statusNumber===2?'pending'
    :statusNumber===4?'claim'
    :statusNumber===5?'denied'
    :'other';
  const clickRef=String(transaction?.click?.epi||transaction?.epi||'');
  return {
    network:'adtraction',
    partner:String(transaction?.click?.programName||transaction?.programName||'Okänt program'),
    status,
    commission:Number(transaction?.commission)||0,
    currency:String(transaction?.currency||'SEK'),
    matchedLocalClick:LOCAL_CLICK.test(clickRef),
  };
}

export function normalizeAddrevenue(transaction){
  const raw=String(transaction?.status||'').toLowerCase();
  const status=raw==='approved'||raw==='paidout'?'approved'
    :raw==='new'||raw==='delayed'?'pending'
    :raw==='denied'?'denied'
    :'other';
  const clickRef=String(transaction?.clickRef||'');
  const commission=Number(transaction?.commission ?? transaction?.commissionAmount ?? 0)||0;
  return {
    network:'addrevenue',
    partner:String(transaction?.advertiserName||transaction?.programName||'Okänd partner'),
    status,
    commission,
    currency:String(transaction?.currency||'SEK'),
    matchedLocalClick:LOCAL_CLICK.test(clickRef),
  };
}

export function aggregateTransactions(items){
  const grouped=new Map();
  for(const item of items){
    const key=[item.network,item.partner,item.currency].join('|');
    const row=grouped.get(key)||{
      network:item.network,
      partner:item.partner,
      currency:item.currency,
      approvedTransactions:0,
      pendingTransactions:0,
      deniedTransactions:0,
      claims:0,
      otherTransactions:0,
      approvedCommission:0,
      pendingCommission:0,
      matchedTransactions:0,
      totalTransactions:0,
    };
    row.totalTransactions+=1;
    if(item.matchedLocalClick) row.matchedTransactions+=1;
    if(item.status==='approved'){
      row.approvedTransactions+=1;
      row.approvedCommission+=item.commission;
    }else if(item.status==='pending'){
      row.pendingTransactions+=1;
      row.pendingCommission+=item.commission;
    }else if(item.status==='denied'){
      row.deniedTransactions+=1;
    }else if(item.status==='claim'){
      row.claims+=1;
    }else{
      row.otherTransactions+=1;
    }
    grouped.set(key,row);
  }
  return [...grouped.values()].sort((a,b)=>
    b.approvedCommission-a.approvedCommission||
    b.approvedTransactions-a.approvedTransactions||
    a.partner.localeCompare(b.partner,'sv')
  );
}

export function networkTotals(rows){
  const byNetwork=new Map();
  for(const row of rows){
    const key=[row.network,row.currency].join('|');
    const total=byNetwork.get(key)||{
      network:row.network,
      currency:row.currency,
      approvedTransactions:0,
      pendingTransactions:0,
      deniedTransactions:0,
      claims:0,
      approvedCommission:0,
      pendingCommission:0,
      matchedTransactions:0,
      totalTransactions:0,
    };
    for(const field of ['approvedTransactions','pendingTransactions','deniedTransactions','claims','approvedCommission','pendingCommission','matchedTransactions','totalTransactions']){
      total[field]+=row[field]||0;
    }
    byNetwork.set(key,total);
  }
  return [...byNetwork.values()].sort((a,b)=>a.network.localeCompare(b.network));
}

export function toMarkdown(report){
  const money=(value,currency)=>new Intl.NumberFormat('sv-SE',{style:'currency',currency,maximumFractionDigits:2}).format(value||0);
  const lines=[
    '# Affiliateintäktsrapport',
    '',
    `Period: ${report.period.from} – ${report.period.to} (${report.period.days} dagar)`,
    '',
  ];

  for(const network of report.networks){
    lines.push(`## ${network.network}`,'');
    if(network.configured===false){
      lines.push('Inte konfigurerad – ingen API-token tillgänglig i rapportkörningen.','');
      continue;
    }
    if(network.error){
      lines.push(`Fel vid hämtning: ${network.error}`,'');
      continue;
    }
    const totals=report.totals.filter(row=>row.network===network.network);
    if(!totals.length){
      lines.push('Inga transaktioner i perioden.','');
      continue;
    }
    for(const total of totals){
      lines.push(
        `- Godkända: **${total.approvedTransactions}** · ${money(total.approvedCommission,total.currency)}`,
        `- Väntande: **${total.pendingTransactions}** · ${money(total.pendingCommission,total.currency)}`,
        `- Matchade till Sänk Kostnadens klick-ID: **${total.matchedTransactions}/${total.totalTransactions}**`,
        ''
      );
    }
  }

  if(report.rows.length){
    lines.push('## Partner/program','',
      '| Nätverk | Partner/program | Godkända | Väntande | Godkänd provision | Matchade klick |',
      '| --- | --- | ---: | ---: | ---: | ---: |');
    for(const row of report.rows){
      lines.push(`| ${row.network} | ${row.partner.replace(/\|/g,'/')} | ${row.approvedTransactions} | ${row.pendingTransactions} | ${money(row.approvedCommission,row.currency)} | ${row.matchedTransactions}/${row.totalTransactions} |`);
    }
    lines.push('');
  }

  lines.push('Rapporten innehåller endast aggregerade värden. Order-ID, fullständiga klickreferenser och andra råa transaktionsidentifierare sparas inte i artefakten.','');
  return lines.join('\n');
}
