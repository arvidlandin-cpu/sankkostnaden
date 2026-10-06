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

export function rememberAffiliateClick(data:{localClickId:string;partner:string;category:string;intent:string;placement:string;pagePath:string}){
  if(typeof window==='undefined') return;
  try{
    window.sessionStorage.setItem(lastClickKey,JSON.stringify({
      local_click_id:data.localClickId,
      partner:data.partner,
      category:data.category,
      intent:data.intent,
      placement:data.placement,
      page_path:data.pagePath,
      clicked_at:Date.now(),
    }));
  }catch{}
}
