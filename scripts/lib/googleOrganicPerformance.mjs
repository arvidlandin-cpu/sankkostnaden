export function dateRange(days=30,now=new Date(),lagDays=1){
  const safe=Math.min(365,Math.max(1,Math.round(Number(days)||30)));
  const lag=Math.max(0,Math.round(Number(lagDays)||0));
  const end=new Date(now);
  end.setUTCDate(end.getUTCDate()-lag);
  const start=new Date(end);
  start.setUTCDate(start.getUTCDate()-(safe-1));
  return {
    startDate:start.toISOString().slice(0,10),
    endDate:end.toISOString().slice(0,10),
    days:safe,
  };
}

function metric(row,index){
  return Number(row?.metricValues?.[index]?.value)||0;
}
function dimension(row,index){
  return String(row?.dimensionValues?.[index]?.value||'');
}

export function normalizeGa4Totals(result){
  const row=result?.rows?.[0]||{};
  return {
    sessions:metric(row,0),
    activeUsers:metric(row,1),
    totalUsers:metric(row,2),
    pageViews:metric(row,3),
  };
}

export function normalizeGa4Channels(result){
  return (result?.rows||[]).map(row=>({
    channel:dimension(row,0)||'Unassigned',
    sessions:metric(row,0),
    activeUsers:metric(row,1),
  })).sort((a,b)=>b.sessions-a.sessions);
}

export function normalizeGa4Pages(result){
  return (result?.rows||[]).map(row=>({
    path:dimension(row,0)||'/',
    pageViews:metric(row,0),
    activeUsers:metric(row,1),
  })).sort((a,b)=>b.pageViews-a.pageViews);
}

export function normalizeGa4Sources(result){
  return (result?.rows||[]).map(row=>({
    sourceMedium:dimension(row,0)||'(not set)',
    sessions:metric(row,0),
    activeUsers:metric(row,1),
  })).sort((a,b)=>b.sessions-a.sessions);
}

export function normalizeGscTotals(result){
  const row=result?.rows?.[0]||{};
  return {
    clicks:Number(row.clicks)||0,
    impressions:Number(row.impressions)||0,
    ctr:Number(row.ctr)||0,
    position:Number(row.position)||0,
  };
}

export function normalizeGscRows(result,label='key'){
  return (result?.rows||[]).map(row=>({
    [label]:String(row?.keys?.[0]||''),
    clicks:Number(row.clicks)||0,
    impressions:Number(row.impressions)||0,
    ctr:Number(row.ctr)||0,
    position:Number(row.position)||0,
  })).sort((a,b)=>b.clicks-a.clicks||b.impressions-a.impressions);
}

export function toMarkdown(report){
  const int=value=>new Intl.NumberFormat('sv-SE',{maximumFractionDigits:0}).format(value||0);
  const pct=value=>new Intl.NumberFormat('sv-SE',{style:'percent',maximumFractionDigits:1}).format(value||0);
  const dec=value=>new Intl.NumberFormat('sv-SE',{maximumFractionDigits:1}).format(value||0);
  const lines=['# Organisk trafikrapport','',`Genererad: ${report.generatedAt}`,''];

  if(!report.configured){
    lines.push(
      'Inte konfigurerad – GOOGLE_SERVICE_ACCOUNT_JSON saknas i GitHub Actions.',
      'Rapportkoden är installerad men behöver ett Google-servicekonto med läsbehörighet till GA4 och Search Console.',
      ''
    );
    return lines.join('\n');
  }

  const ga=report.ga4;
  const gsc=report.gsc;
  lines.push(
    '## GA4',
    '',
    `Period: **${ga.period.startDate} – ${ga.period.endDate}**`,
    `- Sessioner: **${int(ga.totals.sessions)}**`,
    `- Aktiva användare: **${int(ga.totals.activeUsers)}**`,
    `- Sidvisningar: **${int(ga.totals.pageViews)}**`,
    `- Organisk Google/söktrafik: **${int(ga.organic.sessions)} sessioner** · **${int(ga.organic.activeUsers)} aktiva användare**`,
    '',
    '## Google Search Console',
    '',
    `Egendom: **${gsc.siteUrl}** · Period: **${gsc.period.startDate} – ${gsc.period.endDate}**`,
    `- Klick från Google: **${int(gsc.totals.clicks)}**`,
    `- Visningar i Google: **${int(gsc.totals.impressions)}**`,
    `- CTR: **${pct(gsc.totals.ctr)}**`,
    `- Genomsnittlig position: **${dec(gsc.totals.position)}**`,
    ''
  );

  if(gsc.queries.length){
    lines.push(
      '### Sökfrågor',
      '',
      '| Sökfråga | Klick | Visningar | CTR | Position |',
      '| --- | ---: | ---: | ---: | ---: |'
    );
    for(const row of gsc.queries.slice(0,20)){
      lines.push(`| ${row.query.replace(/\|/g,'/')} | ${int(row.clicks)} | ${int(row.impressions)} | ${pct(row.ctr)} | ${dec(row.position)} |`);
    }
    lines.push('');
  }

  if(gsc.pages.length){
    lines.push(
      '### Landningssidor i Google',
      '',
      '| Sida | Klick | Visningar | CTR | Position |',
      '| --- | ---: | ---: | ---: | ---: |'
    );
    for(const row of gsc.pages.slice(0,20)){
      lines.push(`| ${row.page.replace(/\|/g,'/')} | ${int(row.clicks)} | ${int(row.impressions)} | ${pct(row.ctr)} | ${dec(row.position)} |`);
    }
    lines.push('');
  }

  if(ga.sources.length){
    lines.push(
      '### Trafikkällor i GA4',
      '',
      '| Källa / medium | Sessioner | Aktiva användare |',
      '| --- | ---: | ---: |'
    );
    for(const row of ga.sources.slice(0,12)){
      lines.push(`| ${row.sourceMedium.replace(/\|/g,'/')} | ${int(row.sessions)} | ${int(row.activeUsers)} |`);
    }
    lines.push('');
  }

  lines.push('Rapporten lagrar endast aggregerad webbstatistik och innehåller inga användar-ID:n eller Google-credentials.','');
  return lines.join('\n');
}
