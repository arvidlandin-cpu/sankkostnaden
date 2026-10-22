// Assemble existing aggregate reports only. This module performs no API requests.
const number=value=>typeof value==='number'&&Number.isFinite(value)?value:null;
const safeText=value=>typeof value==='string'?value.replace(/[\r\n|]/g,' ').slice(0,600):null;
const publicLabel=value=>{
  const text=safeText(value);
  return text&&!/@|\b\d[\d\s+()-]{5,}\d\b|(?:token|password|secret|email)=/i.test(text)?text:null;
};
function landingPath(value){
  if(value==='(not set)')return value;
  if(typeof value!=='string'||(!value.startsWith('/')&&!value.startsWith('https://sankkostnaden.se/')))return null;
  try{
    const url=new URL(value,'https://sankkostnaden.se');
    return url.origin==='https://sankkostnaden.se'&&publicLabel(decodeURIComponent(url.pathname))?url.pathname:null;
  }catch{return null;}
}
const failed=source=>!source||source.configured===false||source.failed===true||Boolean(source.error)||['failed','error','missing','not_configured'].includes(String(source.status||'').toLowerCase());
function periodOf(source){
  const value=source?.period;
  const from=value?.from||value?.startDate;
  const to=value?.to||value?.endDate;
  if(!/^\d{4}-\d{2}-\d{2}$/.test(from||'')||!/^\d{4}-\d{2}-\d{2}$/.test(to||'')||from>to)return null;
  const start=Date.parse(from+'T00:00:00Z'),end=Date.parse(to+'T00:00:00Z');
  if(!Number.isFinite(start)||!Number.isFinite(end)||new Date(start).toISOString().slice(0,10)!==from||new Date(end).toISOString().slice(0,10)!==to)return null;
  return {from,to,days:Math.round((end-start)/86400000)+1};
}
const comparable=(a,b)=>Boolean(a&&b&&a.from===b.from&&a.to===b.to);
const sum=(rows,field)=>rows.every(row=>number(row[field])!==null)?rows.reduce((total,row)=>total+row[field],0):null;
const fields=['approvedTransactions','pendingTransactions','deniedTransactions','claims','otherTransactions','approvedCommission','pendingCommission','matchedTransactions','totalTransactions'];

export function affiliateFromPerformance({addrevenue,adtraction}={}){
  const rows=[],networks=[];
  for(const [network,source] of Object.entries({addrevenue,adtraction})){
    const ok=!failed(source)&&Array.isArray(source.rows);
    const entry={network,configured:ok,generatedAt:source?.generatedAt||null,period:periodOf(source)};
    if(!ok)entry.error='Källan saknas, är inte konfigurerad eller rapportkörningen misslyckades.';
    networks.push(entry);
    if(!ok)continue;
    // Explicit successful zero totals establish both outcome and currency even
    // when there are no per-partner rows. Nonzero or incomplete totals cannot.
    if(source.rows.length===0){
      const zeroFields=['approvedCommission','pendingCommission','approvedTransactions','pendingTransactions'];
      if(/^[A-Z]{3}$/.test(source.totals?.currency||'')&&zeroFields.every(field=>source.totals?.[field]===0)){
        rows.push({network,partner:'Inga godkända eller väntande transaktioner',currency:source.totals.currency,...Object.fromEntries(fields.map(field=>[field,number(source.totals[field])]))});
      }
    }
    for(const row of source.rows){
      const normalized={network,partner:safeText(row.partner||row.advertiserName||row.programName)||'Okänd partner',currency:/^[A-Z]{3}$/.test(row.currency||'')?row.currency:null};
      for(const field of fields)normalized[field]=number(row[field]);
      // Both collectors publish transaction-state counters, but only Adtraction
      // publishes totalTransactions. Never use Addrevenue's aggregate stats count
      // as a substitute for transaction records or approved transactions.
      if(network==='addrevenue'){
        normalized.claims=number(row.claims)??0;
        if(normalized.totalTransactions===null){
          const counts=['approvedTransactions','pendingTransactions','deniedTransactions','otherTransactions'];
          normalized.totalTransactions=counts.every(key=>number(row[key])!==null)?counts.reduce((n,key)=>n+row[key],0):null;
        }
      }
      rows.push(normalized);
    }
  }
  const grouped=new Map();
  for(const row of rows){
    const key=row.network+'|'+row.currency;
    if(!grouped.has(key))grouped.set(key,[]);
    grouped.get(key).push(row);
  }
  const totals=[...grouped.values()].map(items=>({network:items[0].network,currency:items[0].currency,...Object.fromEntries(fields.map(field=>[field,sum(items,field)]))}));
  const periods=networks.map(item=>item.period);
  return {generatedAt:new Date().toISOString(),period:networks.every(item=>item.configured)&&comparable(periods[0],periods[1])?periods[0]:null,networks,rows,totals};
}

function sourceStatus(name,source,now){
  const generatedAt=typeof source?.generatedAt==='string'?source.generatedAt:null;
  const at=Date.parse(generatedAt||'');
  const ageHours=Number.isFinite(at)?Math.max(0,(now.getTime()-at)/3600000):null;
  return {name,status:failed(source)?'UNKNOWN':ageHours===null?'UNKNOWN':ageHours>36?'stale':'ok',generatedAt,ageHours,period:periodOf(source)};
}
function clicks(rows,channel){
  if(!Array.isArray(rows))return null;
  const relevant=rows.filter(row=>row.eventName==='affiliate_click'&&(!channel||row.channel===channel));
  return sum(relevant,'eventCount');
}
const ctr=value=>number(value)!==null&&value>=0&&value<=1?value:null;
const position=value=>number(value)!==null&&value>=0?value:null;
function topSearchRows(rows,key){
  if(!Array.isArray(rows))return null;
  return rows.flatMap(row=>{
    let label=safeText(row[key]);
    if(!label)return [];
    if(key==='query'){
      // Search terms are aggregate data, but can still contain an email,
      // phone/account number or credentials. Do not reproduce those terms.
      if(/@|\b\d[\d\s+()-]{5,}\d\b|(?:token|password|secret|email)=/i.test(label))return [];
    }else{
      try{const url=new URL(label);if(url.origin!=='https://sankkostnaden.se')return [];label=url.pathname;}catch{return [];}
    }
    return [{[key]:label,clicks:number(row.clicks),impressions:number(row.impressions),ctr:ctr(row.ctr),position:position(row.position)}];
  }).sort((a,b)=>(b.clicks??-1)-(a.clicks??-1)||(b.impressions??-1)-(a.impressions??-1)).slice(0,5);
}
function releaseStatus(release){
  if(!release)return {status:'UNKNOWN'};
  const valid=release.passed===true&&!failed(release)&&release.mode==='production'&&/^[a-f\d]{7,40}$/i.test(release.expectedCommit||'')&&Number.isFinite(Date.parse(release.verifiedAt||''))&&Array.isArray(release.checks)&&release.checks.length>0&&release.checks.every(check=>String(check.kind||'').startsWith('readiness-')||!check.errors?.length)&&Array.isArray(release.assets)&&release.assets.length>0&&release.assets.every(asset=>!asset.errors?.length)&&Array.isArray(release.errors)&&release.errors.length===0;
  let referenceUrl=null;
  try{const url=new URL(release.referenceUrl);if(url.protocol==='https:'&&!url.username&&!url.password){url.search='';url.hash='';referenceUrl=url.toString();}}catch{}
  // Raw checker errors may contain response bodies or URLs with identifiers.
  // Preserve the error signal and count, not untrusted payload text.
  return {status:valid?'verified':'UNKNOWN',passed:typeof release.passed==='boolean'?release.passed:null,mode:safeText(release.mode),expectedCommit:/^[a-f\d]{7,40}$/i.test(release.expectedCommit||'')?release.expectedCommit:null,referenceUrl,verifiedAt:safeText(release.verifiedAt),checkCount:Array.isArray(release.checks)?release.checks.length:null,assetCount:Array.isArray(release.assets)?release.assets.length:null,errors:Array.isArray(release.errors)?release.errors.map((_,index)=>'Verifieringsfel '+(index+1)+'; se separat verifieringsartifact.'):[],physicalIphoneVerified:null,ownerDesignApproved:null};
}

export function buildDailyReport({google,affiliate,addrevenue,adtraction,partnerHealth,decision,release,now=new Date()}={}){
  now=new Date(now);
  const sources=Object.entries({google,affiliate,addrevenue,adtraction,partnerHealth}).map(([name,source])=>sourceStatus(name,source,now));
  const googleOK=!failed(google);
  const ga=googleOK&&!failed(google.ga4)?google.ga4:null;
  const gsc=googleOK&&!failed(google.gsc)?google.gsc:null;
  // These are sitewide commercial page events, not the app-only funnel.
  const commercial=ga?.commercialByPageChannel;
  const traffic={organicSessions:number(ga?.organic?.sessions),allChannelSessions:number(ga?.totals?.sessions),gscInboundClicks:number(gsc?.totals?.clicks),gscImpressions:number(gsc?.totals?.impressions),organicOutgoingPartnerClicks:clicks(commercial,'Organic Search'),allChannelOutgoingPartnerClicks:clicks(commercial),ga4Period:periodOf(ga),gscPeriod:periodOf(gsc),latestGscDailyDate:Array.isArray(gsc?.daily)?gsc.daily.map(row=>row.date).filter(value=>/^\d{4}-\d{2}-\d{2}$/.test(value||'')).sort().at(-1)||null:null,dataNotice:'Perioderna nedan är faktiska källperioder. Senaste dagarnas GA4/GSC-data och ännu ej godkända nätverkstransaktioner kan vara preliminära.'};
  traffic.organicNewUsers=number(ga?.organic?.newUsers);
  traffic.newUsersByChannel=Array.isArray(ga?.channels)?ga.channels.map(row=>({channel:safeText(row.channel)||'Unassigned',sessions:number(row.sessions),activeUsers:number(row.activeUsers),newUsers:number(row.newUsers)})):null;
  traffic.organicContentLandings=Array.isArray(ga?.organicLandingPages)?ga.organicLandingPages.flatMap(row=>{const path=landingPath(row.landingPage);return path?[{landingPage:path,sessions:number(row.sessions),activeUsers:number(row.activeUsers),newUsers:number(row.newUsers)}]:[];}):null;
  traffic.affiliateClickUsers=ga?.affiliateClickUsers?.sitewide?{eventCount:number(ga.affiliateClickUsers.sitewide.eventCount),totalUsers:number(ga.affiliateClickUsers.sitewide.totalUsers),byChannel:Array.isArray(ga.affiliateClickUsers.byChannel)?ga.affiliateClickUsers.byChannel.map(row=>({channel:safeText(row.channel)||'Unassigned',eventCount:number(row.eventCount),totalUsers:number(row.totalUsers)})):null}:null;
  traffic.brfReferralTraffic=Array.isArray(ga?.brfReferralTraffic)?ga.brfReferralTraffic.map(row=>({source:publicLabel(row.source),medium:publicLabel(row.medium),campaign:publicLabel(row.campaign),sessions:number(row.sessions),activeUsers:number(row.activeUsers),newUsers:number(row.newUsers)})):null;
  traffic.firstIncompleteGscDate=/^\d{4}-\d{2}-\d{2}$/.test(gsc?.firstIncompleteDate||'')?gsc.firstIncompleteDate:null;
  traffic.completeSevenDayComparison=gsc?.completeSevenDayComparison||null;
  const quarter=gsc?.quarterPriceObservation;
  traffic.quarterPriceObservation=quarter?{
    status:quarter.status==='ok'&&quarter.dataState==='final'&&quarter.scope==='page_post_observation'?'ok':'UNKNOWN',
    period:periodOf(quarter),completeDays:number(quarter.completeDays),clicks:number(quarter.clicks),impressions:number(quarter.impressions),
    ctr:ctr(quarter.ctr),position:position(quarter.position),eligibleForReview:typeof quarter.eligibleForReview==='boolean'?quarter.eligibleForReview:null,
    minCompleteDays:number(quarter.minCompleteDays),minImpressions:number(quarter.minImpressions),
  }:null;
  traffic.urlInspection=Array.isArray(gsc?.urlInspection)?gsc.urlInspection.map(row=>({url:safeText(row.url),status:safeText(row.status),verdict:safeText(row.verdict),coverageState:safeText(row.coverageState),lastCrawlTime:safeText(row.lastCrawlTime),googleCanonical:safeText(row.googleCanonical)})):null;
  traffic.gscCtr=ctr(gsc?.totals?.ctr);
  traffic.gscPosition=position(gsc?.totals?.position);
  traffic.topGscQueries=topSearchRows(gsc?.queries,'query');
  traffic.topGscLandingPages=topSearchRows(gsc?.pages,'page');
  traffic.topGa4LandingPages=traffic.organicContentLandings;
  traffic.ga4LandingPagesNotice=traffic.organicContentLandings===null?'UNKNOWN – Google-källan saknar sajtövergripande GA4-landningssidor. appLandingChannels omfattar endast /app/; pages visar sidvisningar och används inte som landningssidor.':'Organiska GA4-landningar redovisas separat från startsidan och /app/.';
  const networkReports=Array.isArray(affiliate?.networks)?affiliate.networks:[];
  const counts=partnerHealth?.networkCounts;
  const activeNetworks=!failed(partnerHealth)&&counts&&typeof counts==='object'&&Object.values(counts).every(count=>number(count)!==null&&count>=0)?Object.entries(counts).filter(([,count])=>count>0).map(([name])=>name):null;
  const revenueRows=[];
  const reasons=[];
  if(failed(affiliate))reasons.push('Affiliateunderlaget saknas eller har källfel.');
  if(!activeNetworks?.length)reasons.push('Aktiva nätverk kunde inte verifieras.');
  const successful=new Set();
  for(const network of new Set([...(activeNetworks||[]),...networkReports.map(item=>item.network)])){
    const entry=networkReports.find(item=>item.network===network);
    const original=network==='addrevenue'?addrevenue:network==='adtraction'?adtraction:undefined;
    const requiresOriginal=network==='addrevenue'||network==='adtraction';
    const ok=!failed(affiliate)&&entry&&!failed(entry)&&(!requiresOriginal||!failed(original));
    const period=periodOf(entry)||(!requiresOriginal?periodOf(affiliate):periodOf(original));
    const totals=ok&&Array.isArray(affiliate.totals)?affiliate.totals.filter(row=>row.network===network):[];
    if(!ok||!period){reasons.push(network+': nätverksgodkända uppgifter eller giltig period saknas.');revenueRows.push({network,status:'UNKNOWN',currency:null,approvedCommission:null,pendingCommission:null,approvedTransactions:null,pendingTransactions:null,period});continue;}
    let valid=true;
    for(const row of totals){
      const currency=/^[A-Z]{3}$/.test(row.currency||'')?row.currency:null;
      const approvedCommission=number(row.approvedCommission),pendingCommission=number(row.pendingCommission);
      const approvedTransactions=number(row.approvedTransactions),pendingTransactions=number(row.pendingTransactions);
      if(!currency||[approvedCommission,pendingCommission,approvedTransactions,pendingTransactions].some(value=>value===null))valid=false;
      revenueRows.push({network,status:currency&&approvedCommission!==null&&pendingCommission!==null&&approvedTransactions!==null&&pendingTransactions!==null?'ok':'UNKNOWN',currency,approvedCommission,pendingCommission,approvedTransactions,pendingTransactions,period});
    }
    // An empty successful response has no currency evidence. Do not manufacture SEK.
    if(!totals.length){valid=false;revenueRows.push({network,status:'UNKNOWN',currency:null,approvedCommission:null,pendingCommission:null,approvedTransactions:null,pendingTransactions:null,period});}
    if(valid)successful.add(network);else reasons.push(network+': valutauppgift eller transaktionssummering saknas.');
  }
  for(const network of activeNetworks||[])if(!successful.has(network)&&!reasons.some(reason=>reason.startsWith(network+':')))reasons.push(network+': saknar komplett verifierad rapport.');
  const validRows=revenueRows.filter(row=>row.status==='ok');
  const currencies=new Set(validRows.map(row=>row.currency));
  const periods=validRows.map(row=>row.period);
  if(currencies.size!==1)reasons.push('En gemensam verifierad valuta saknas; valutor summeras inte.');
  if(!periods.length||!periods.every(period=>comparable(period,periods[0])))reasons.push('Nätverkens rapportperioder är inte jämförbara.');
  const complete=reasons.length===0;
  const revenue={status:complete?'complete':'UNKNOWN',grandTotal:complete?sum(validRows,'approvedCommission'):null,currency:complete?[...currencies][0]:null,pendingTotal:complete?sum(validRows,'pendingCommission'):null,period:complete?periods[0]:null,byNetwork:revenueRows,activeNetworks,unknownReasons:[...new Set(reasons)]};
  const technicalAlerts=sources.filter(source=>source.status!=='ok').map(source=>source.name+': '+source.status);
  for(const finding of !failed(partnerHealth)&&Array.isArray(partnerHealth.findings)?partnerHealth.findings:[]){
    technicalAlerts.push((safeText(finding.severity)||'warning')+': '+(safeText(finding.partner)||'partner')+' – '+(safeText(finding.issue)||'kontroll krävs'));
  }
  technicalAlerts.push(...revenue.unknownReasons);
  const candidate=decision?.recommendedAction;
  const recommendedAction=candidate?{type:safeText(candidate.type),priority:typeof candidate.priority==='number'?candidate.priority:safeText(candidate.priority),reason:safeText(candidate.reason),status:'Rekommendation från beslutsmotorn; inte en utförd åtgärd.'}:null;
  const releaseResult=releaseStatus(release);
  if(releaseResult.status!=='verified')technicalAlerts.push('Release: aktuell produktionsverifiering UNKNOWN.');
  const agentBriefings=[
    {area:'SEO / trafik',status:'Planerat uppdrag – inte exekverad AI',task:traffic.organicSessions===null?'Återställ läsbar GA4/GSC-rapportering och verifiera huvuddomänens åtkomst.':'Granska sökfrågor och landningssidor i GSC mot organiska sessioner. Föreslå en förbättring med faktisk efterfrågan och bevara canonical/indexering.'},
    {area:'Konvertering',status:'Planerat uppdrag – inte exekverad AI',task:traffic.organicOutgoingPartnerClicks===null?'Verifiera sitewide affiliate_click uppdelat per kanal; använd inte app-funneln som sajtens total.':'Granska en organisk landningssidas väg till relevant partner utifrån sidans impressions och affiliate_click. Bevara sponsormärkning och klickreferenser.'},
    {area:'Teknik',status:'Planerat uppdrag – inte exekverad AI',task:technicalAlerts.length?'Utred den första datakvalitetsvarningen: '+technicalAlerts[0]:'Verifiera aktuella deploybevis, exporterad metadata och mobil användarresa utan verkliga partnerklick.'},
    {area:'Partner',status:'Planerat uppdrag – inte exekverad AI',task:revenue.status==='UNKNOWN'?'Verifiera saknad nätverkstäckning och godkänd provision: '+revenue.unknownReasons[0]:'Granska godkända respektive väntande affärer per partner och valuta; prioritera behovsrelevans före provision.'},
  ];
  return {generatedAt:now.toISOString(),executiveSummary:revenue.status==='UNKNOWN'?'Affiliatetotal UNKNOWN. Trafik, utgående klick och nätverksgodkänd provision redovisas separat.':'Nätverksgodkänd provision finns för alla verifierade aktiva nätverk. Trafik och utgående klick är separata mått.',sources,traffic,revenue,release:releaseResult,technicalAlerts:[...new Set(technicalAlerts)],recommendedAction,agentBriefings};
}

const display=value=>value===null||value===undefined?'UNKNOWN':String(value);
const percent=value=>value===null||value===undefined?'UNKNOWN':new Intl.NumberFormat('sv-SE',{style:'percent',maximumFractionDigits:1}).format(value);
function periodText(period){return period?`${period.from} – ${period.to} (${period.days} dagar)`:'UNKNOWN';}
export function dailyReportMarkdown(report){
  const t=report.traffic,r=report.revenue;
  const lines=['# Daglig rapport – Sänk Kostnaden','',`Genererad: ${report.generatedAt}`,'',report.executiveSummary,'','## Trafik och partnerklick','',`- GA4-period: ${periodText(t.ga4Period)}`,`- Organiska sessioner (Organic Search): ${display(t.organicSessions)}`,`- Nya organiska användare: ${display(t.organicNewUsers)}`,`- Sessioner, alla kanaler: ${display(t.allChannelSessions)}`,`- Utgående partnerklick, Organic Search, hela sajten: ${display(t.organicOutgoingPartnerClicks)}`,`- Unika användare med affiliate_click, hela sajten: ${display(t.affiliateClickUsers?.totalUsers)} (${display(t.affiliateClickUsers?.eventCount)} events)`,`- Utgående partnerklick, alla kanaler, hela sajten: ${display(t.allChannelOutgoingPartnerClicks)}`,`- GSC-period: ${periodText(t.gscPeriod)}`,`- Inkommande Google-sökklick: ${display(t.gscInboundClicks)} · sökvisningar: ${display(t.gscImpressions)}`,`- Senaste GSC-datum med dagdata: ${display(t.latestGscDailyDate)}`,`- Första ofullständiga GSC-datum: ${display(t.firstIncompleteGscDate)}`,'',t.dataNotice,'','## Nätverksgodkänd provision','',`- TOTAL godkänd provision: ${display(r.grandTotal)}${r.currency?' '+r.currency:''}`,`- Gemensam nätverksperiod: ${periodText(r.period)}`,''];
  // Keep search diagnostics together with the traffic section, ahead of revenue.
  const revenueHeading=lines.indexOf('## Nätverksgodkänd provision');
  const searchLines=[`- GSC CTR: ${percent(t.gscCtr)} · genomsnittlig position: ${display(t.gscPosition)}`,'','### GSC: högst 5 sökfrågor och landningssidor',''];
  for(const [label,key,rows] of [['Sökfrågor','query',t.topGscQueries],['Landningssidor från Google-sök','page',t.topGscLandingPages]]){
    searchLines.push(`${label}:`);
    if(rows===null)searchLines.push('- UNKNOWN – underlag saknas.');
    else if(rows.length===0)searchLines.push('- Inga publicerbara rader i källunderlaget.');
    else for(const row of rows)searchLines.push(`- ${row[key]}: ${display(row.clicks)} klick · ${display(row.impressions)} visningar · CTR ${percent(row.ctr)} · position ${display(row.position)}`);
    searchLines.push('');
  }
  if(t.completeSevenDayComparison){
    const latest=t.completeSevenDayComparison.latest,previous=t.completeSevenDayComparison.previous;
    searchLines.push('### Färdigbehandlad GSC, hela sajten: 7 dagar mot föregående 7','',`- ${latest.startDate} – ${latest.endDate}: ${display(latest.clicks)} klick · ${display(latest.impressions)} visningar · CTR ${percent(latest.ctr)} · position ${display(latest.position)}`,`- ${previous.startDate} – ${previous.endDate}: ${display(previous.clicks)} klick · ${display(previous.impressions)} visningar · CTR ${percent(previous.ctr)} · position ${display(previous.position)}`,'','Detta är inte en sidfiltrerad experimentkohort eller ett bevis på orsak. Utelämnade dagsrader är inte i sig bevis på trafikbortfall.','');
  }
  if(t.quarterPriceObservation){
    const q=t.quarterPriceObservation;
    searchLines.push('### Kvartspris: sidfiltrerad observation efter ändringen','',`- Status: ${display(q.status)} · period: ${periodText(q.period)} (Search Console, America/Los_Angeles)`,`- Färdigbehandlade dagar: ${display(q.completeDays)} · visningar: ${display(q.impressions)} · klick: ${display(q.clicks)}`,`- Minimikrav: ${display(q.minCompleteDays)} dagar och ${display(q.minImpressions)} visningar · uppfyllda: ${q.eligibleForReview===null?'UNKNOWN':q.eligibleForReview?'ja':'nej'}`,'- Detta är läsunderlag för granskning, inte en vinnare, en kausal effekt eller nätverksgodkänd intäkt. Experimentets sida och state ändras inte.','');
  }
  searchLines.push('GA4 landningssidor: '+t.ga4LandingPagesNotice,'');
  if(Array.isArray(t.organicContentLandings)){
    searchLines.push('Organiska innehållslandningar (exkl. start och /app/):');
    if(!t.organicContentLandings.length)searchLines.push('- Inga publicerbara landningsrader.');
    else for(const row of t.organicContentLandings.slice(0,10))searchLines.push(`- ${display(row.landingPage)}: ${display(row.sessions)} sessioner · ${display(row.newUsers)} nya användare`);
    searchLines.push('');
  }
  searchLines.push('Källtaggad BRF/referraltrafik:');
  if(!Array.isArray(t.brfReferralTraffic))searchLines.push('- UNKNOWN – mätfält saknas.');
  else if(!t.brfReferralTraffic.length)searchLines.push('- 0 registrerade rader.');
  else for(const row of t.brfReferralTraffic)searchLines.push(`- ${display(row.source)} / ${display(row.medium)} / ${display(row.campaign)}: ${display(row.sessions)} sessioner · ${display(row.newUsers)} nya användare`);
  searchLines.push('');
  searchLines.push('Unika användare med partnerklick per kanal (grupperna får inte summeras):');
  if(!Array.isArray(t.affiliateClickUsers?.byChannel))searchLines.push('- UNKNOWN – kanalunderlag saknas.');
  else for(const row of t.affiliateClickUsers.byChannel)searchLines.push(`- ${display(row.channel)}: ${display(row.totalUsers)} användare · ${display(row.eventCount)} klickhändelser`);
  searchLines.push('');
  searchLines.push('Google URL Inspection:');
  if(!Array.isArray(t.urlInspection))searchLines.push('- UNKNOWN – inspektionsfält saknas.');
  else for(const row of t.urlInspection)searchLines.push(`- ${display(row.url)}: ${display(row.status)} · ${display(row.verdict)} · ${display(row.coverageState)} · senast crawlad ${display(row.lastCrawlTime)}`);
  searchLines.push('');
  lines.splice(revenueHeading,0,...searchLines);
  for(const row of r.byNetwork)lines.push(`- ${row.network}: ${row.status} · godkänt ${display(row.approvedCommission)} ${display(row.currency)} (${display(row.approvedTransactions)} affärer) · väntande ${display(row.pendingCommission)} ${display(row.currency)} (${display(row.pendingTransactions)} affärer) · ${periodText(row.period)}`);
  lines.push('','Väntande provision är inte godkänd intäkt. Partnerklick bevisar inte affärer. Ingen intäkt per organisk session beräknas.','','## Källstatus och aktualitet','');
  for(const source of report.sources)lines.push(`- ${source.name}: ${source.status} · genererad ${display(source.generatedAt)} · ${periodText(source.period)}`);
  lines.push('','## Releaseverifiering','',`- Status: ${display(report.release.status)} · revision: ${display(report.release.expectedCommit)} · verifierad: ${display(report.release.verifiedAt)}`,`- Läge: ${display(report.release.mode)} · kontroller: ${display(report.release.checkCount)} · assets: ${display(report.release.assetCount)}`,`- Referens: ${display(report.release.referenceUrl)}`);
  for(const key of ['physicalIphoneVerified','ownerDesignApproved'])lines.push(`- ${key}: ${display(report.release[key])}`);
  lines.push('','Releaseuppgifterna kommer från underlaget; merge är inte bevis för publicering, fysisk iPhone eller intäktsförbättring.','','## Tekniska varningar','',...(report.technicalAlerts.length?report.technicalAlerts.map(alert=>'- '+alert):['- Inga rapporterade varningar.']),'','## En rekommenderad åtgärd','');
  lines.push(report.recommendedAction?`${display(report.recommendedAction.type)}: ${display(report.recommendedAction.reason)} (${report.recommendedAction.status})`:'UNKNOWN – beslutsunderlag saknas.');
  lines.push('','## Planerade agentuppdrag','');
  for(const briefing of report.agentBriefings)lines.push(`- ${briefing.area}: ${briefing.task} (${briefing.status})`);
  return lines.join('\n')+'\n';
}
