const sessionKey='sankkostnaden-funnel-session-v1';
const lastClickKey='sankkostnaden-last-affiliate-click-v1';

function randomId(prefix:string){
  const raw=typeof crypto!=='undefined'&&typeof crypto.randomUUID==='function'
    ? crypto.randomUUID().replace(/-/g,'')
    : Math.random().toString(36).slice(2)+Date.now().toString(36);
  return prefix+'_'+raw.slice(0,24);
}

export function getFunnelSessionId(){
  if(typeof window==='undefined') return 'server';
  try{
    const existing=window.sessionStorage.getItem(sessionKey);
    if(existing) return existing;
    const id=randomId('fs');
    window.sessionStorage.setItem(sessionKey,id);
    return id;
  }catch{
    return randomId('fs');
  }
}

export function createLocalClickId(){
  return randomId('clk');
}

export function emitAnalyticsEvent(eventName:string,params:Record<string,unknown>={}){
  if(typeof window==='undefined') return;
  const enriched={funnel_session_id:getFunnelSessionId(),...params};
  const w=window as Window & { gtag?:(...args:unknown[])=>void; dataLayer?:Record<string,unknown>[] };
  if(typeof w.gtag==='function') w.gtag('event',eventName,enriched);
  else if(Array.isArray(w.dataLayer)) w.dataLayer.push({event:eventName,...enriched});
}

export function rememberAffiliateClick(data:{localClickId:string;partner:string;category:string;intent:string;placement:string;pagePath:string;network?:string}){
  if(typeof window==='undefined') return;
  try{
    window.sessionStorage.setItem(lastClickKey,JSON.stringify({
      local_click_id:data.localClickId,
      partner:data.partner,
      category:data.category,
      intent:data.intent,
      placement:data.placement,
      page_path:data.pagePath,
      network:data.network||'unknown',
      clicked_at:Date.now(),
    }));
  }catch{}
}

export type NetworkDecoration={
  url:string;
  network:'adtraction'|'addrevenue'|'unknown';
  tagged:boolean;
  reason:'tagged'|'existing_epi'|'existing_clickref'|'unsupported';
};

export function decorateAdtractionTrackingUrl(value:string,localClickId:string,funnelSessionId:string):NetworkDecoration{
  try{
    const url=new URL(value);
    const isAdtraction=url.pathname==='/t/t'
      && url.searchParams.has('a')
      && url.searchParams.has('as')
      && url.searchParams.get('t')==='2'
      && url.searchParams.get('tk')==='1';

    if(!isAdtraction) return {url:value,network:'unknown',tagged:false,reason:'unsupported'};
    if(url.searchParams.has('epi')) return {url:value,network:'adtraction',tagged:false,reason:'existing_epi'};

    const deeplink=url.searchParams.get('url');
    if(deeplink!==null) url.searchParams.delete('url');

    url.searchParams.set('epi',localClickId);
    url.searchParams.set('epi2',funnelSessionId);

    // Adtraction documents that the deeplink URL parameter must be last.
    if(deeplink!==null) url.searchParams.set('url',deeplink);

    return {url:url.toString(),network:'adtraction',tagged:true,reason:'tagged'};
  }catch{
    return {url:value,network:'unknown',tagged:false,reason:'unsupported'};
  }
}


export function decorateAddrevenueTrackingUrl(value:string,localClickId:string):NetworkDecoration{
  try{
    const url=new URL(value);
    const isAddrevenue=url.hostname.toLowerCase()==='addrevenue.io'
      && url.pathname==='/t'
      && url.searchParams.has('a')
      && url.searchParams.has('c');

    if(!isAddrevenue) return {url:value,network:'unknown',tagged:false,reason:'unsupported'};
    if(url.searchParams.has('r')) return {url:value,network:'addrevenue',tagged:false,reason:'existing_clickref'};

    url.searchParams.set('r',localClickId);
    return {url:url.toString(),network:'addrevenue',tagged:true,reason:'tagged'};
  }catch{
    return {url:value,network:'unknown',tagged:false,reason:'unsupported'};
  }
}

export function decorateAffiliateTrackingUrl(value:string,localClickId:string,funnelSessionId:string):NetworkDecoration{
  const adtraction=decorateAdtractionTrackingUrl(value,localClickId,funnelSessionId);
  if(adtraction.network!=='unknown') return adtraction;

  const addrevenue=decorateAddrevenueTrackingUrl(value,localClickId);
  if(addrevenue.network!=='unknown') return addrevenue;

  return {url:value,network:'unknown',tagged:false,reason:'unsupported'};
}
