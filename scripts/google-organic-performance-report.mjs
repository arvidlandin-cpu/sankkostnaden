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
  normalizeGa4Totals,
  normalizeGscRows,
  normalizeGscPairs,
  normalizeGscTotals,
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

async function runGsc(accessToken,siteUrl,dimensions=[]){
  const body={
    startDate:period.startDate,
    endDate:period.endDate,
    type:'web',
    rowLimit:dimensions.length?25000:1,
    dataState:'all',
  };
  if(dimensions.length) body.dimensions=dimensions;
  return postJson(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    accessToken,
    body
  );
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

  const [gaTotalsRaw,gaChannelsRaw,gaPagesRaw,gaSourcesRaw,gaEventsRaw,gaLandingChannelsRaw,gscTotalsRaw,gscQueriesRaw,gscPagesRaw,gscQueryPagesRaw]=await Promise.all([
    runGa4(accessToken,propertyId,{
      metrics:[{name:'sessions'},{name:'activeUsers'},{name:'totalUsers'},{name:'screenPageViews'}],
    }),
    runGa4(accessToken,propertyId,{
      dimensions:[{name:'sessionDefaultChannelGroup'}],
      metrics:[{name:'sessions'},{name:'activeUsers'}],
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
      metrics:[{name:'sessions'},{name:'activeUsers'}],
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
      dimensions:[{name:'landingPagePlusQueryString'},{name:'sessionDefaultChannelGroup'}],
      metrics:[{name:'sessions'},{name:'activeUsers'}],
      dimensionFilter:{filter:{fieldName:'landingPagePlusQueryString',stringFilter:{matchType:'EXACT',value:'/app/',caseSensitive:false}}},
      orderBys:[{metric:{metricName:'sessions'},desc:true}],
      limit:50,
    }),
    runGsc(accessToken,siteUrl,[]),
    runGsc(accessToken,siteUrl,['query']),
    runGsc(accessToken,siteUrl,['page']),
    runGsc(accessToken,siteUrl,['query','page']),
  ]);

  const channels=normalizeGa4Channels(gaChannelsRaw);
  const organic=channels.find(row=>row.channel==='Organic Search')||{channel:'Organic Search',sessions:0,activeUsers:0};

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
      appFunnel:normalizeGa4Events(gaEventsRaw).filter(row=>['cost_check_answer','cost_check_complete','partner_impression','affiliate_click','cost_check_next_category','cost_check_scenario','cost_check_cost_added'].includes(row.eventName)),
      appLandingChannels:normalizeGa4LandingChannels(gaLandingChannelsRaw),
    },
    gsc:{
      siteUrl,
      period,
      totals:normalizeGscTotals(gscTotalsRaw),
      queries:normalizeGscRows(gscQueriesRaw,'query'),
      pages:normalizeGscRows(gscPagesRaw,'page'),
      queryPages:normalizeGscPairs(gscQueryPagesRaw),
    },
  };
}

await fs.mkdir(outDir,{recursive:true});
await fs.writeFile(path.join(outDir,'google-organic-performance.json'),JSON.stringify(report,null,2)+'\n','utf8');
await fs.writeFile(path.join(outDir,'google-organic-performance.md'),toMarkdown(report),'utf8');
console.log(toMarkdown(report));
