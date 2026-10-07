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

export function normalizeGa4Events(result){
  return (result?.rows||[]).map(row=>({
    eventName:dimension(row,0)||'(not set)',
    pagePath:dimension(row,1)||'(not set)',
    eventCount:metric(row,0),
    totalUsers:metric(row,1),
  })).sort((a,b)=>b.eventCount-a.eventCount);
}

export function normalizeGa4LandingChannels(result){
  return (result?.rows||[]).map(row=>({
    landingPage:dimension(row,0)||'(not set)',
    channel:dimension(row,1)||'Unassigned',
    sessions:metric(row,0),
    activeUsers:metric(row,1),
    engagedSessions:metric(row,2),
    engagementRate:metric(row,3),
    averageSessionDuration:metric(row,4),
  })).sort((a,b)=>b.sessions-a.sessions);
}

export function normalizeGa4EventChannels(result){
  return (result?.rows||[]).map(row=>({
    eventName:dimension(row,0)||'(not set)',
    channel:dimension(row,1)||'Unassigned',
    eventCount:metric(row,0),
    totalUsers:metric(row,1),
  })).sort((a,b)=>b.eventCount-a.eventCount);
}

export function normalizeGa4CommercialPageChannels(result){
  return (result?.rows||[]).map(row=>({
    eventName:dimension(row,0)||'(not set)',
    pagePath:dimension(row,1)||'(not set)',
    channel:dimension(row,2)||'Unassigned',
    eventCount:metric(row,0),
    totalUsers:metric(row,1),
  })).sort((a,b)=>b.eventCount-a.eventCount);
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

export function normalizeGscPairs(result){
  return (result?.rows||[]).map(row=>({
    query:String(row?.keys?.[0]||''),
    page:String(row?.keys?.[1]||''),
    clicks:Number(row.clicks)||0,
    impressions:Number(row.impressions)||0,
    ctr:Number(row.ctr)||0,
    position:Number(row.position)||0,
  })).sort((a,b)=>b.clicks-a.clicks||b.impressions-a.impressions);
}

export function normalizeGscDateQueryRows(result){
  return (result?.rows||[]).map(row=>({
    date:String(row?.keys?.[0]||''),
    query:String(row?.keys?.[1]||''),
    clicks:Number(row.clicks)||0,
    impressions:Number(row.impressions)||0,
    ctr:Number(row.ctr)||0,
    position:Number(row.position)||0,
  })).sort((a,b)=>a.date.localeCompare(b.date)||b.impressions-a.impressions);
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
  const nonHubPages=(gsc.pages||[]).filter(row=>!['https://sankkostnaden.se/','https://sankkostnaden.se/app/'].includes(row.page));
  const nonHubClicks=nonHubPages.reduce((sum,row)=>sum+(Number(row.clicks)||0),0);
  const nonHubImpressions=nonHubPages.reduce((sum,row)=>sum+(Number(row.impressions)||0),0);
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
    `- Klick till innehållssidor exkl. startsidan och /app/: **${int(nonHubClicks)}** av ${int(nonHubImpressions)} visningar`,
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

  if(gsc.daily?.length){
    lines.push(
      '### Google – daglig utveckling',
      '',
      '| Datum | Klick | Visningar | CTR | Position |',
      '| --- | ---: | ---: | ---: | ---: |'
    );
    for(const row of gsc.daily.slice(-14)){
      lines.push(`| ${row.date} | ${int(row.clicks)} | ${int(row.impressions)} | ${pct(row.ctr)} | ${dec(row.position)} |`);
    }
    lines.push('');
  }

  if(gsc.appDaily?.length){
    lines.push(
      '### /app/ i Google – daglig utveckling',
      '',
      '| Datum | Klick | Visningar | CTR | Position |',
      '| --- | ---: | ---: | ---: | ---: |'
    );
    for(const row of gsc.appDaily.slice(-14)){
      lines.push(`| ${row.date} | ${int(row.clicks)} | ${int(row.impressions)} | ${pct(row.ctr)} | ${dec(row.position)} |`);
    }
    lines.push('');
  }

  if(gsc.appQueries?.length){
    lines.push(
      '### /app/ – synliga Google-sökfrågor',
      '',
      '| Sökfråga | Klick | Visningar | CTR | Position |',
      '| --- | ---: | ---: | ---: | ---: |'
    );
    for(const row of gsc.appQueries.slice(0,20)){
      lines.push(`| ${row.query.replace(/\|/g,'/')} | ${int(row.clicks)} | ${int(row.impressions)} | ${pct(row.ctr)} | ${dec(row.position)} |`);
    }
    lines.push('');
  }

  if(gsc.focusQueryDaily?.length){
    lines.push(
      '### Prioriterade sökfrågor – daglig signal',
      '',
      '| Datum | Sökfråga | Klick | Visningar | CTR | Position |',
      '| --- | --- | ---: | ---: | ---: | ---: |'
    );
    for(const row of gsc.focusQueryDaily.slice(-60)){
      lines.push(`| ${row.date} | ${row.query.replace(/\|/g,'/')} | ${int(row.clicks)} | ${int(row.impressions)} | ${pct(row.ctr)} | ${dec(row.position)} |`);
    }
    lines.push('');
  }

  if(gsc.queryPages?.length){
    lines.push(
      '### Sökfråga → landningssida',
      '',
      '| Sökfråga | Landningssida | Klick | Visningar | CTR | Position |',
      '| --- | --- | ---: | ---: | ---: | ---: |'
    );
    for(const row of gsc.queryPages.slice(0,30)){
      lines.push(`| ${row.query.replace(/\|/g,'/')} | ${row.page.replace(/\|/g,'/')} | ${int(row.clicks)} | ${int(row.impressions)} | ${pct(row.ctr)} | ${dec(row.position)} |`);
    }
    lines.push('');
  }

  if(ga.appFunnel?.length){
    lines.push(
      '### Kostnadskollen /app/ – funnel-events',
      '',
      '| Event | Antal | Användare |',
      '| --- | ---: | ---: |'
    );
    for(const row of ga.appFunnel){
      lines.push(`| ${row.eventName.replace(/\|/g,'/')} | ${int(row.eventCount)} | ${int(row.totalUsers)} |`);
    }
    lines.push('');
  }

  if(ga.appFunnelByChannel?.length){
    lines.push(
      '### Kostnadskollen /app/ – funnel per kanal',
      '',
      '| Kanal | Event | Antal | Användare |',
      '| --- | --- | ---: | ---: |'
    );
    for(const row of ga.appFunnelByChannel){
      lines.push(`| ${row.channel.replace(/\|/g,'/')} | ${row.eventName.replace(/\|/g,'/')} | ${int(row.eventCount)} | ${int(row.totalUsers)} |`);
    }
    lines.push('');
  }

  if(ga.commercialByPageChannel?.length){
    const organicCommercial=ga.commercialByPageChannel.filter(row=>row.channel==='Organic Search');
    if(organicCommercial.length){
      const pages=new Map();
      for(const row of organicCommercial){
        if(!pages.has(row.pagePath)) pages.set(row.pagePath,{partnerImpressions:0,affiliateClicks:0,users:0});
        const item=pages.get(row.pagePath);
        if(row.eventName==='partner_impression') item.partnerImpressions+=row.eventCount;
        if(row.eventName==='affiliate_click') item.affiliateClicks+=row.eventCount;
        item.users=Math.max(item.users,row.totalUsers);
      }
      lines.push(
        '### Kommersiella events per sida – Organic Search',
        '',
        '| Sida | Partnerexponeringar | Affiliateklick | Klickgrad |',
        '| --- | ---: | ---: | ---: |'
      );
      for(const [pagePath,item] of [...pages.entries()].sort((a,b)=>b[1].partnerImpressions-a[1].partnerImpressions).slice(0,20)){
        const rate=item.partnerImpressions?item.affiliateClicks/item.partnerImpressions:0;
        lines.push(`| ${pagePath.replace(/\|/g,'/')} | ${int(item.partnerImpressions)} | ${int(item.affiliateClicks)} | ${pct(rate)} |`);
      }
      lines.push('');
    }
  }

  if(ga.appLandingChannels?.length){
    lines.push(
      '### /app/ som landningssida',
      '',
      '| Kanal | Sessioner | Aktiva användare | Engagerade sessioner | Engagemang | Snittid |',
      '| --- | ---: | ---: | ---: | ---: | ---: |'
    );
    for(const row of ga.appLandingChannels){
      lines.push(`| ${row.channel.replace(/\|/g,'/')} | ${int(row.sessions)} | ${int(row.activeUsers)} | ${int(row.engagedSessions)} | ${pct(row.engagementRate)} | ${dec(row.averageSessionDuration)} s |`);
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
