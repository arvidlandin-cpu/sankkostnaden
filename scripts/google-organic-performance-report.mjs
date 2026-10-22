import fs from 'node:fs/promises';
import path from 'node:path';
import { getGoogleAccessToken, googleJson, parseServiceAccount } from './lib/googleServiceAccount.mjs';
import {
  dateRange,
  normalizeGa4Channels,
  normalizeGa4Pages,
  normalizeGa4Sources,
  normalizeGa4Events,
  normalizeGa4LandingChannels,
  normalizeGa4ContentLandingChannels,
  normalizeGa4CampaignSources,
  normalizeGa4EventTotals,
  normalizeGa4EventChannels,
  normalizeGa4CommercialPageChannels,
  normalizeGa4Totals,
  normalizeGscRows,
  normalizeGscPairs,
  normalizeGscDateQueryRows,
  normalizeGscTotals,
  summarizeGscCompleteWindows,
  gscObservationPeriod,
  summarizeGscObservation,
  toMarkdown,
} from './lib/googleOrganicPerformance.mjs';

const days=Number(process.env.REPORT_DAYS||process.argv[2]||30);
const period=dateRange(days,new Date(),1);
const outDir=process.env.REPORT_OUT_DIR||'google-organic-performance-report';
const rawServiceAccount=process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
const measurementId=process.env.GA4_MEASUREMENT_ID||'G-E2XTJVY5EX';
const targetHostname=(process.env.TARGET_HOSTNAME||'sankkostnaden.se').toLowerCase();

async function postJson(url,accessToken,body){
  return googleJson(url,accessToken,{method:'POST',body:JSON.stringify(body)});
}

async function discoverGa4Property(accessToken){
  if(process.env.GA4_PROPERTY_ID){
    return {propertyId:String(process.env.GA4_PROPERTY_ID).replace(/^properties\//,''),displayName:'Configured property'};
  }

  const summaries=await googleJson('https://analyticsadmin.googleapis.com/v1beta/accountSummaries?pageSize=200',accessToken);
  const properties=[];
  for(const account of summaries?.accountSummaries||[]){
    for(const property of account?.propertySummaries||[]){
      const propertyId=String(property?.property||'').replace(/^properties\//,'');
      if(propertyId) properties.push({propertyId,displayName:String(property?.displayName||propertyId)});
    }
  }

  for(const property of properties){
    const streams=await googleJson(`https://analyticsadmin.googleapis.com/v1beta/properties/${property.propertyId}/dataStreams?pageSize=200`,accessToken);
    const match=(streams?.dataStreams||[]).find(stream=>String(stream?.webStreamData?.measurementId||'')===measurementId);
    if(match) return property;
  }

  if(properties.length===1) return properties[0];
  throw new Error(`Could not identify the GA4 property for measurement ID ${measurementId}. Set GA4_PROPERTY_ID explicitly if the service account can access multiple properties.`);
}

async function discoverSearchConsoleSite(accessToken){
  if(process.env.GSC_SITE_URL) return process.env.GSC_SITE_URL;
  const data=await googleJson('https://www.googleapis.com/webmasters/v3/sites',accessToken);
  const sites=(data?.siteEntry||[]).map(item=>String(item?.siteUrl||'')).filter(Boolean);
  const domain=`sc-domain:${targetHostname.replace(/^www\./,'')}`;
  const exact=sites.find(site=>site===domain)
    ||sites.find(site=>site===`https://${targetHostname}/`)
    ||sites.find(site=>site===`https://www.${targetHostname.replace(/^www\./,'')}/`);
  if(exact) return exact;
  if(sites.length===1) return sites[0];
  throw new Error(`Could not identify Search Console property for ${targetHostname}. Set GSC_SITE_URL explicitly if needed.`);
}

async function runGa4(accessToken,propertyId,body){
  return postJson(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,accessToken,{
    dateRanges:[{startDate:period.startDate,endDate:period.endDate}],
    ...body,
  });
}

async function runGsc(accessToken,siteUrl,dimensions=[],dimensionFilters=[],dataState='all',queryPeriod=period){
  const body={
    startDate:queryPeriod.startDate,
    endDate:queryPeriod.endDate,
    type:'web',
    rowLimit:dimensions.length?25000:1,
    dataState,
  };
  if(dimensions.length) body.dimensions=dimensions;
  if(dimensionFilters.length) body.dimensionFilterGroups=[{filters:dimensionFilters}];
  return postJson(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    accessToken,
    body
  );
}

async function collectQuarterObservation(accessToken,siteUrl,finalThroughDate){
  try{
    const state=JSON.parse(await fs.readFile('autopilot/state.json','utf8'));
    const experiment=state.activeExperiments?.find(item=>item.target==='/elavtal/kvartspris/'&&item.status==='running');
    if(!experiment)return null;
    const observationPeriod=gscObservationPeriod(experiment.startedAt,finalThroughDate);
    if(!observationPeriod)return {status:'UNKNOWN',reason:'No complete post-change Search Console period available.'};
    const page=`https://${targetHostname}/elavtal/kvartspris/`;
    const raw=await runGsc(accessToken,siteUrl,['date'],[{dimension:'page',operator:'equals',expression:page}],'final',observationPeriod);
    if((raw.rows?.length||0)>=25000)return {status:'UNKNOWN',reason:'Observation rows may be truncated.'};
    const daily=normalizeGscRows(raw,'date').sort((a,b)=>a.date.localeCompare(b.date));
    const observation=summarizeGscObservation(daily,observationPeriod,{
      minCompleteDays:experiment.measurement?.gscMinCompletePostDays??7,
      minImpressions:experiment.measurement?.minPostPageImpressions??30,
    });
    if(!observation)return {status:'UNKNOWN',reason:'Observation counts or date coverage could not be validated.'};
    return {status:'ok',experimentId:experiment.id,page,dataState:'final',reportTimezone:'America/Los_Angeles',
      ...observation,daily};
  }catch{
    return {status:'UNKNOWN',reason:'The page-filtered final observation could not be verified.'};
  }
}

async function inspectPriorityUrls(accessToken,siteUrl){
  const urls=[
    'https://sankkostnaden.se/forsakring/hemforsakring-bostadsratt/',
    'https://sankkostnaden.se/elavtal/jamfor-elavtal/',
    'https://sankkostnaden.se/elavtal/kvartspris/',
  ];
  return Promise.all(urls.map(async url=>{
    try{
      const raw=await postJson('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect',accessToken,{inspectionUrl:url,siteUrl,languageCode:'sv-SE'});
      const result=raw?.inspectionResult?.indexStatusResult||{};
      return {
        url,
        status:'ok',
        verdict:String(result.verdict||'UNKNOWN'),
        coverageState:String(result.coverageState||'UNKNOWN'),
        indexingState:String(result.indexingState||'UNKNOWN'),
        robotsTxtState:String(result.robotsTxtState||'UNKNOWN'),
        pageFetchState:String(result.pageFetchState||'UNKNOWN'),
        lastCrawlTime:String(result.lastCrawlTime||'UNKNOWN'),
        userCanonical:String(result.userCanonical||'UNKNOWN'),
        googleCanonical:String(result.googleCanonical||'UNKNOWN'),
      };
    }catch{
      return {url,status:'UNKNOWN',verdict:'UNKNOWN',coverageState:'UNKNOWN',indexingState:'UNKNOWN',robotsTxtState:'UNKNOWN',pageFetchState:'UNKNOWN',lastCrawlTime:'UNKNOWN',userCanonical:'UNKNOWN',googleCanonical:'UNKNOWN'};
    }
  }));
}

let report;
if(!rawServiceAccount){
  report={
    generatedAt:new Date().toISOString(),
    configured:false,
    ga4:null,
    gsc:null,
  };
}else{
  const serviceAccount=parseServiceAccount(rawServiceAccount);
  const accessToken=await getGoogleAccessToken(serviceAccount,[
    'https://www.googleapis.com/auth/analytics.readonly',
    'https://www.googleapis.com/auth/webmasters.readonly',
  ]);

  const [{propertyId,displayName},siteUrl]=await Promise.all([
    discoverGa4Property(accessToken),
    discoverSearchConsoleSite(accessToken),
  ]);

  const [gaTotalsRaw,gaChannelsRaw,gaPagesRaw,gaSourcesRaw,gaEventsRaw,gaEventChannelsRaw,gaLandingChannelsRaw,gaCommercialPageChannelsRaw,gaContentLandingChannelsRaw,gaCampaignSourcesRaw,gaAffiliateClickTotalsRaw,gaAffiliateClicksByChannelRaw,gscTotalsRaw,gscQueriesRaw,gscPagesRaw,gscQueryPagesRaw,gscDailyRaw,gscFinalDailyRaw,gscAppDailyRaw,gscAppQueriesRaw,gscDateQueriesRaw]=await Promise.all([
    runGa4(accessToken,propertyId,{
      metrics:[{name:'sessions'},{name:'activeUsers'},{name:'totalUsers'},{name:'screenPageViews'}],
    }),
    runGa4(accessToken,propertyId,{
      dimensions:[{name:'sessionDefaultChannelGroup'}],
      metrics:[{name:'sessions'},{name:'activeUsers'},{name:'newUsers'}],
      orderBys:[{metric:{metricName:'sessions'},desc:true}],
      limit:50,
    }),
    runGa4(accessToken,propertyId,{
      dimensions:[{name:'pagePath'}],
      metrics:[{name:'screenPageViews'},{name:'activeUsers'}],
      orderBys:[{metric:{metricName:'screenPageViews'},desc:true}],
      limit:50,
    }),
    runGa4(accessToken,propertyId,{
      dimensions:[{name:'sessionSourceMedium'}],
      metrics:[{name:'sessions'},{name:'activeUsers'},{name:'newUsers'}],
      orderBys:[{metric:{metricName:'sessions'},desc:true}],
      limit:50,
    }),
    runGa4(accessToken,propertyId,{
      dimensions:[{name:'eventName'},{name:'pagePath'}],
      metrics:[{name:'eventCount'},{name:'totalUsers'}],
      dimensionFilter:{filter:{fieldName:'pagePath',stringFilter:{matchType:'EXACT',value:'/app/',caseSensitive:false}}},
      orderBys:[{metric:{metricName:'eventCount'},desc:true}],
      limit:100,
    }),
    runGa4(accessToken,propertyId,{
      dimensions:[{name:'eventName'},{name:'sessionDefaultChannelGroup'}],
      metrics:[{name:'eventCount'},{name:'totalUsers'}],
      dimensionFilter:{filter:{fieldName:'pagePath',stringFilter:{matchType:'EXACT',value:'/app/',caseSensitive:false}}},
      orderBys:[{metric:{metricName:'eventCount'},desc:true}],
      limit:100,
    }),
    runGa4(accessToken,propertyId,{
      dimensions:[{name:'landingPagePlusQueryString'},{name:'sessionDefaultChannelGroup'}],
      metrics:[{name:'sessions'},{name:'activeUsers'},{name:'engagedSessions'},{name:'engagementRate'},{name:'averageSessionDuration'},{name:'newUsers'}],
      dimensionFilter:{filter:{fieldName:'landingPagePlusQueryString',stringFilter:{matchType:'EXACT',value:'/app/',caseSensitive:false}}},
      orderBys:[{metric:{metricName:'sessions'},desc:true}],
      limit:50,
    }),
    runGa4(accessToken,propertyId,{
      dimensions:[{name:'eventName'},{name:'pagePath'},{name:'sessionDefaultChannelGroup'}],
      metrics:[{name:'eventCount'},{name:'totalUsers'}],
      dimensionFilter:{filter:{fieldName:'eventName',inListFilter:{values:['partner_impression','affiliate_click'],caseSensitive:true}}},
      orderBys:[{metric:{metricName:'eventCount'},desc:true}],
      limit:500,
    }),
    runGa4(accessToken,propertyId,{
      dimensions:[{name:'landingPage'},{name:'sessionDefaultChannelGroup'}],
      metrics:[{name:'sessions'},{name:'activeUsers'},{name:'newUsers'}],
      dimensionFilter:{filter:{fieldName:'sessionDefaultChannelGroup',stringFilter:{matchType:'EXACT',value:'Organic Search',caseSensitive:true}}},
      orderBys:[{metric:{metricName:'sessions'},desc:true}],
      limit:250,
    }),
    runGa4(accessToken,propertyId,{
      dimensions:[{name:'sessionManualSource'},{name:'sessionManualMedium'},{name:'sessionManualCampaignName'}],
      metrics:[{name:'sessions'},{name:'activeUsers'},{name:'newUsers'}],
      dimensionFilter:{filter:{fieldName:'sessionManualCampaignName',stringFilter:{matchType:'CONTAINS',value:'brf_',caseSensitive:false}}},
      orderBys:[{metric:{metricName:'sessions'},desc:true}],
      limit:100,
    }),
    runGa4(accessToken,propertyId,{
      metrics:[{name:'eventCount'},{name:'totalUsers'}],
      dimensionFilter:{filter:{fieldName:'eventName',stringFilter:{matchType:'EXACT',value:'affiliate_click',caseSensitive:true}}},
    }),
    runGa4(accessToken,propertyId,{
      dimensions:[{name:'eventName'},{name:'sessionDefaultChannelGroup'}],
      metrics:[{name:'eventCount'},{name:'totalUsers'}],
      dimensionFilter:{filter:{fieldName:'eventName',stringFilter:{matchType:'EXACT',value:'affiliate_click',caseSensitive:true}}},
      orderBys:[{metric:{metricName:'eventCount'},desc:true}],
      limit:50,
    }),
    runGsc(accessToken,siteUrl,[]),
    runGsc(accessToken,siteUrl,['query']),
    runGsc(accessToken,siteUrl,['page']),
    runGsc(accessToken,siteUrl,['query','page']),
    runGsc(accessToken,siteUrl,['date']),
    runGsc(accessToken,siteUrl,['date'],[],'final'),
    runGsc(accessToken,siteUrl,['date'],[{dimension:'page',operator:'equals',expression:'https://sankkostnaden.se/app/'}]),
    runGsc(accessToken,siteUrl,['query'],[{dimension:'page',operator:'equals',expression:'https://sankkostnaden.se/app/'}]),
    runGsc(accessToken,siteUrl,['date','query']),
  ]);

  const channels=normalizeGa4Channels(gaChannelsRaw);
  const organic=channels.find(row=>row.channel==='Organic Search')||{channel:'Organic Search',sessions:0,activeUsers:0};
  const focusQueries=new Set([
    'jämför försäkring',
    'vad menas med kvartspris på el',
    'hur mycket kwh drar ett hus',
    'hemförsäkring bostadsrätt',
    'jämför elavtal',
    'billigaste elavtalet',
    'billigt elavtal',
  ]);
  const focusQueryDaily=normalizeGscDateQueryRows(gscDateQueriesRaw)
    .filter(row=>focusQueries.has(row.query.toLowerCase()));
  const finalDaily=normalizeGscRows(gscFinalDailyRaw,'date').sort((a,b)=>a.date.localeCompare(b.date));
  const [urlInspection,quarterPriceObservation]=await Promise.all([
    inspectPriorityUrls(accessToken,siteUrl),
    collectQuarterObservation(accessToken,siteUrl,finalDaily.at(-1)?.date),
  ]);

  report={
    generatedAt:new Date().toISOString(),
    configured:true,
    ga4:{
      measurementId,
      propertyId,
      displayName,
      period,
      totals:normalizeGa4Totals(gaTotalsRaw),
      organic,
      channels,
      pages:normalizeGa4Pages(gaPagesRaw),
      sources:normalizeGa4Sources(gaSourcesRaw),
      organicLandingPages:normalizeGa4ContentLandingChannels(gaContentLandingChannelsRaw)
        .filter(row=>!['/','/app/'].includes(row.landingPage.split('?')[0])),
      brfReferralTraffic:normalizeGa4CampaignSources(gaCampaignSourcesRaw),
      affiliateClickUsers:{
        sitewide:normalizeGa4EventTotals(gaAffiliateClickTotalsRaw),
        byChannel:normalizeGa4EventChannels(gaAffiliateClicksByChannelRaw),
      },
      appFunnel:normalizeGa4Events(gaEventsRaw).filter(row=>['cost_check_start','cost_check_answer','cost_check_complete','cost_check_quick_path_shown','partner_impression','affiliate_click','cost_check_quick_guide_click','cost_check_next_category','cost_check_scenario','cost_check_cost_added'].includes(row.eventName)),
      appFunnelByChannel:normalizeGa4EventChannels(gaEventChannelsRaw).filter(row=>['cost_check_start','cost_check_answer','cost_check_complete','cost_check_quick_path_shown','partner_impression','affiliate_click','cost_check_quick_guide_click','cost_check_next_category','cost_check_scenario','cost_check_cost_added'].includes(row.eventName)),
      appLandingChannels:normalizeGa4LandingChannels(gaLandingChannelsRaw),
      commercialByPageChannel:normalizeGa4CommercialPageChannels(gaCommercialPageChannelsRaw),
    },
    gsc:{
      siteUrl,
      period,
      totals:normalizeGscTotals(gscTotalsRaw),
      queries:normalizeGscRows(gscQueriesRaw,'query'),
      pages:normalizeGscRows(gscPagesRaw,'page'),
      queryPages:normalizeGscPairs(gscQueryPagesRaw),
      daily:normalizeGscRows(gscDailyRaw,'date').sort((a,b)=>a.date.localeCompare(b.date)),
      dataState:'all',
      firstIncompleteDate:gscDailyRaw?.metadata?.first_incomplete_date||null,
      finalDaily,
      completeSevenDayComparison:summarizeGscCompleteWindows(finalDaily,7,period),
      quarterPriceObservation,
      urlInspection,
      appDaily:normalizeGscRows(gscAppDailyRaw,'date').sort((a,b)=>a.date.localeCompare(b.date)),
      appQueries:normalizeGscRows(gscAppQueriesRaw,'query'),
      focusQueryDaily,
    },
  };
}

await fs.mkdir(outDir,{recursive:true});
await fs.writeFile(path.join(outDir,'google-organic-performance.json'),JSON.stringify(report,null,2)+'\n','utf8');
await fs.writeFile(path.join(outDir,'google-organic-performance.md'),toMarkdown(report),'utf8');
console.log(toMarkdown(report));
