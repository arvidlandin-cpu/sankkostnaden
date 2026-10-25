const num=value=>Number(value)||0;

function ageHours(iso,now){
  const at=Date.parse(iso||'');
  if(!Number.isFinite(at)) return Infinity;
  return Math.max(0,(now.getTime()-at)/3600000);
}

function eventTotals(rows,channel){
  const out={};
  for(const row of rows||[]){
    if(channel && row.channel!==channel) continue;
    const key=String(row.eventName||'');
    out[key]=(out[key]||0)+num(row.eventCount);
  }
  return out;
}

function sum(rows,field){
  return (rows||[]).reduce((total,row)=>total+num(row?.[field]),0);
}

function activeExperiments(state){
  // New multi-scope state takes precedence. Legacy state remains readable during migration.
  const stored=Array.isArray(state?.activeExperiments)
    ? state.activeExperiments
    : state?.activeExperiment?[state.activeExperiment]:[];
  return stored.filter(item=>item?.status==='running');
}

function pathScope(value){
  if(!value) return null;
  try{
    const pathname=new URL(String(value),'https://sankkostnaden.se').pathname;
    return pathname.split('/').filter(Boolean)[0]||'sitewide';
  }catch{return null;}
}

function conflictsWithActive(page,experiments){
  const scope=pathScope(page);
  if(!scope) return true; // Unknown target may overlap: fail closed.
  return experiments.some(item=>{
    const activeScope=pathScope(item.target);
    return !activeScope || activeScope==='sitewide' || scope==='sitewide' || activeScope===scope;
  });
}

function action(type,priority,reason,details={}){
  return {type,priority,reason,details};
}

function sourceHealth({google,affiliate,addrevenue,adtraction,partnerHealth,policy,now}){
  const maxAge=num(policy?.thresholds?.freshnessHours)||36;
  const sources=[];
  const requiredGoogle=Boolean(google?.configured);
  const googleAge=ageHours(google?.generatedAt,now);
  sources.push({
    source:'google',
    status:requiredGoogle&&googleAge<=maxAge?'healthy':requiredGoogle?'stale':'missing',
    ageHours:Number.isFinite(googleAge)?Math.round(googleAge*10)/10:null,
    required:true,
  });

  for(const [name,report] of [['affiliate',affiliate],['addrevenue',addrevenue],['adtraction',adtraction],['partnerHealth',partnerHealth]]){
    const age=ageHours(report?.generatedAt,now);
    sources.push({
      source:name,
      status:report?(age<=maxAge*2?'healthy':'stale'):'missing',
      ageHours:Number.isFinite(age)?Math.round(age*10)/10:null,
      required:false,
    });
  }

  if(num(partnerHealth?.networkCounts?.tradedoubler)>0){
    sources.push({
      source:'tradedoubler_revenue',
      status:'missing',
      ageHours:null,
      required:false,
    });
  }
  return {
    status:sources.some(row=>row.required&&row.status!=='healthy')?'blocked'
      :sources.some(row=>row.status!=='healthy')?'degraded'
      :'healthy',
    sources,
  };
}

function affiliateNorthStar({google,affiliate,addrevenue,adtraction,partnerHealth}){
  const organicSessions=num(google?.ga4?.organic?.sessions);
  // An API that did not respond must never be interpreted as SEK 0.
  // Importantly, Tradedoubler is active in the partner registry but has no
  // authoritative transaction report from the current collectors.
  const expected=Object.entries(partnerHealth?.networkCounts||{})
    .filter(([,count])=>num(count)>0)
    .map(([name])=>name)
    .sort();
  const reports=Array.isArray(affiliate?.networks)?affiliate.networks:[];
  const reportedNetworks=reports
    .filter(row=>row.configured===true&&!row.error)
    .map(row=>row.network)
    .sort();
  const missingNetworks=expected.length
    ?expected.filter(network=>!reportedNetworks.includes(network))
    :['UNKNOWN_ACTIVE_NETWORK_INVENTORY'];
  const complete=expected.length>0&&missingNetworks.length===0;
  const knownApprovedCommission=reportedNetworks.length?sum(affiliate?.totals,'approvedCommission'):null;
  const knownApprovedTransactions=reportedNetworks.length?sum(affiliate?.totals,'approvedTransactions'):null;
  const networkClicks=num(addrevenue?.totals?.clicks)+num(adtraction?.totals?.totalClicks);
  return {
    organicSessions,
    // This is a subset, explicitly named as such, not the north-star total.
    reportedNetworkApprovedCommission:knownApprovedCommission,
    reportedNetworkApprovedTransactions:knownApprovedTransactions,
    approvedRevenue:complete?knownApprovedCommission:null,
    approvedTransactions:complete?knownApprovedTransactions:null,
    pendingRevenue:complete?sum(affiliate?.totals,'pendingCommission'):null,
    networkClicks,
    // Aggregate network revenue is not attributable to Organic Search until
    // an actual network-side click/session join exists. Never divide it by GA4
    // Organic Search visits or by all network clicks as a conversion claim.
    approvedRevenuePerRelevantVisitor:null,
    approvedRevenuePerNetworkClick:null,
    revenueCoverage:{
      status:complete?'complete':'partial_or_unknown',
      reportedNetworks,
      missingNetworks,
    },
  };
}

function funnelSnapshot(google){
  const all=eventTotals(google?.ga4?.appFunnel);
  const organic=eventTotals(google?.ga4?.appFunnelByChannel,'Organic Search');
  const starts=num(organic.cost_check_start);
  const completes=num(organic.cost_check_complete);
  const partnerImpressions=num(organic.partner_impression);
  const affiliateClicks=num(organic.affiliate_click);
  return {
    organic:{
      starts,
      answers:num(organic.cost_check_answer),
      completes,
      partnerImpressions,
      affiliateClicks,
      // Event counts cannot identify a visitor/session cohort; 2 complete
      // events and 1 start event are NOT a 200% conversion rate.
      completionRate:null,
      partnerUsers:Math.max(0,...(google?.ga4?.appFunnelByChannel||[])
        .filter(row=>row.channel==='Organic Search'&&row.eventName==='partner_impression')
        .map(row=>num(row.totalUsers))),
      affiliateClickRate:partnerImpressions&&affiliateClicks<=partnerImpressions
        ?affiliateClicks/partnerImpressions:null,
    },
    all:{
      starts:num(all.cost_check_start),
      completes:num(all.cost_check_complete),
      partnerImpressions:num(all.partner_impression),
      affiliateClicks:num(all.affiliate_click),
    },
  };
}

function attributionActions({addrevenue,adtraction,policy}){
  const minSample=num(policy?.thresholds?.attribution?.minSample)||3;
  const repairBelow=num(policy?.thresholds?.attribution?.repairBelowCoverage)||0.5;
  const actions=[];

  const a=adtraction?.attributionCoverage;
  if(a && num(a.clicks)>=minSample && num(a.tagCoverage)<repairBelow){
    actions.push(action(
      'ATTRIBUTION_REPAIR',
      100,
      'Adtraction EPI-täckning är för låg för att lita på kommersiell attribution.',
      {network:'adtraction',sample:num(a.clicks),coverage:num(a.tagCoverage)}
    ));
  }

  const r=addrevenue?.attributionCoverage;
  if(r && num(r.transactions)>=minSample && num(r.coverage)<repairBelow){
    actions.push(action(
      'ATTRIBUTION_REPAIR',
      100,
      'Addrevenue clickRef-täckning är för låg för att lita på kommersiell attribution.',
      {network:'addrevenue',sample:num(r.transactions),coverage:num(r.coverage)}
    ));
  }
  return actions;
}

function partnerHealthActions(partnerHealth){
  const errors=(partnerHealth?.findings||[]).filter(item=>item.severity==='error');
  if(!errors.length) return [];
  return [action(
    'TECHNICAL_FIX',
    105,
    'En eller flera aktiva partnerlänkar har ett verifierbart tekniskt fel.',
    {findings:errors.slice(0,10)}
  )];
}

function recentSeoQueries(learningLedger,policy,now){
  const cooldownDays=num(policy?.limits?.seoCooldownDays)||14;
  const cutoff=now.getTime()-(cooldownDays*86400000);
  return new Set([
    ...(learningLedger?.completedExperiments||[]),
    ...(learningLedger?.cancelledExperiments||[]),
  ]
    .filter(item=>item?.type==='SEO_SNIPPET_TEST')
    .filter(item=>{
      const at=Date.parse(item.completedAt||item.cancelledAt||item.endedAt||item.reviewedAt||'');
      return Number.isFinite(at)&&at>=cutoff;
    })
    .map(item=>String(item.query||'').toLowerCase())
    .filter(Boolean));
}

function seoCandidate(google,policy,learningLedger,now,experiments=[]){
  const cfg=policy?.thresholds?.seo||{};
  const recent=recentSeoQueries(learningLedger,policy,now);
  const daily=google?.gsc?.focusQueryDaily||[];
  const daysByQuery=new Map();
  for(const row of daily){
    const key=String(row.query||'').toLowerCase();
    if(!key) continue;
    if(!daysByQuery.has(key)) daysByQuery.set(key,new Set());
    if(row.date) daysByQuery.get(key).add(String(row.date));
  }

  const standard=(google?.gsc?.queryPages||[])
    .filter(row=>!recent.has(String(row.query||'').toLowerCase()))
    .filter(row=>!conflictsWithActive(row.page,experiments))
    .filter(row=>num(row.impressions)>=num(cfg.minImpressions||80))
    .filter(row=>num(row.position)>=num(cfg.minPosition||3)&&num(row.position)<=num(cfg.maxPosition||15))
    .filter(row=>num(row.ctr)<=num(cfg.maxCtr||0.015))
    .map(row=>({
      mode:'standard',
      query:String(row.query||''),
      page:String(row.page||''),
      impressions:num(row.impressions),
      clicks:num(row.clicks),
      ctr:num(row.ctr),
      position:num(row.position),
      distinctDays:daysByQuery.get(String(row.query||'').toLowerCase())?.size||0,
      score:num(row.impressions)*(1-Math.min(1,num(row.ctr)))*(16-Math.min(15,num(row.position))),
    }));

  const earlyCfg=cfg.earlyStage||{};
  const early=(google?.gsc?.queryPages||[])
    .filter(row=>!recent.has(String(row.query||'').toLowerCase()))
    .filter(row=>!conflictsWithActive(row.page,experiments))
    .filter(row=>num(row.impressions)>=num(earlyCfg.minImpressions||25))
    .filter(row=>num(row.position)>0&&num(row.position)<=num(earlyCfg.maxPosition||10))
    .filter(row=>num(row.ctr)<=num(earlyCfg.maxCtr??0.005))
    .filter(row=>(daysByQuery.get(String(row.query||'').toLowerCase())?.size||0)>=num(earlyCfg.minDistinctDays||4))
    .map(row=>({
      mode:'early_stage',
      query:String(row.query||''),
      page:String(row.page||''),
      impressions:num(row.impressions),
      clicks:num(row.clicks),
      ctr:num(row.ctr),
      position:num(row.position),
      distinctDays:daysByQuery.get(String(row.query||'').toLowerCase())?.size||0,
      score:(num(row.impressions)*2)*(11-Math.min(10,num(row.position))),
    }));

  return [...standard,...early].sort((a,b)=>b.score-a.score)[0]||null;
}

function contentUtilityCandidate(google,policy,experiments=[],state={}){
  const cfg=policy?.thresholds?.contentUtility||{};
  const reviewed=state?.reviewedExistingUtilities||[];
  return (google?.gsc?.pages||[])
    .filter(row=>!conflictsWithActive(row.page,experiments))
    .filter(row=>!reviewed.some(review=>{
      // A live utility is not a new content gap. New evidence can explicitly
      // change status to 'needs_new_utility'; no arbitrary insurance date lock.
      return review?.status==='already_served'
        && new URL(String(review.target),'https://sankkostnaden.se').pathname
          ===new URL(String(row.page),'https://sankkostnaden.se').pathname;
    }))
    .filter(row=>num(row.impressions)>=num(cfg.minImpressions||100))
    .filter(row=>num(row.position)>=num(cfg.minPosition||16)&&num(row.position)<=num(cfg.maxPosition||40))
    .filter(row=>num(row.clicks)<=num(cfg.maxClicks??1))
    .filter(row=>!['https://sankkostnaden.se/','https://sankkostnaden.se/app/'].includes(String(row.page||'')))
    .map(row=>({
      page:String(row.page||''),
      impressions:num(row.impressions),
      clicks:num(row.clicks),
      ctr:num(row.ctr),
      position:num(row.position),
      score:num(row.impressions)*(41-Math.min(40,num(row.position))),
    }))
    .sort((a,b)=>b.score-a.score)[0]||null;
}

function commercialPageSnapshot(google){
  const pages=new Map();
  for(const row of google?.ga4?.commercialByPageChannel||[]){
    if(row.channel!=='Organic Search') continue;
    const pagePath=String(row.pagePath||'(not set)');
    if(!pages.has(pagePath)) pages.set(pagePath,{pagePath,partnerImpressions:0,affiliateClicks:0,partnerUsers:0,affiliateClickUsers:0});
    const item=pages.get(pagePath);
    if(row.eventName==='partner_impression'){
      item.partnerImpressions+=num(row.eventCount);
      item.partnerUsers=Math.max(item.partnerUsers,num(row.totalUsers));
    }
    if(row.eventName==='affiliate_click'){
      item.affiliateClicks+=num(row.eventCount);
      item.affiliateClickUsers=Math.max(item.affiliateClickUsers,num(row.totalUsers));
    }
  }
  return [...pages.values()].map(item=>({
    ...item,
    affiliateClickRate:item.partnerImpressions?item.affiliateClicks/item.partnerImpressions:0,
  })).sort((a,b)=>b.partnerImpressions-a.partnerImpressions);
}

function pageCommercialCandidate(google,policy,experiments=[]){
  const cfg=policy?.thresholds?.cro||{};
  return commercialPageSnapshot(google)
    .filter(row=>row.pagePath!=='/app/')
    .filter(row=>!conflictsWithActive(row.pagePath,experiments))
    .filter(row=>row.partnerImpressions>=num(cfg.minPagePartnerImpressions||30))
    .filter(row=>row.partnerUsers>=num(cfg.minPagePartnerUsers||8))
    .filter(row=>row.affiliateClickRate<num(cfg.maxPageAffiliateClickRate||0.08))
    .map(row=>({
      ...row,
      score:row.partnerUsers*(1-row.affiliateClickRate),
    }))
    .sort((a,b)=>b.score-a.score)[0]||null;
}

function croCandidate(google,policy){
  const cfg=policy?.thresholds?.cro||{};
  const funnel=funnelSnapshot(google).organic;
  if(funnel.starts>=num(cfg.minOrganicStarts||25) && funnel.completionRate!=null && funnel.completionRate<num(cfg.maxCompletionRate||0.45)){
    return {kind:'completion',...funnel};
  }
  if(funnel.partnerImpressions>=num(cfg.minOrganicPartnerImpressions||25) && funnel.partnerUsers>=num(cfg.minOrganicPartnerUsers||8) && funnel.affiliateClickRate!=null && funnel.affiliateClickRate<num(cfg.maxAffiliateClickRate||0.08)){
    return {kind:'affiliate_click',...funnel};
  }
  return null;
}

function evaluateSeoExperiment(experiment,google,policy){
  if(!experiment||experiment.type!=='SEO_SNIPPET_TEST'||!experiment.query) return null;
  const started=String(experiment.startedAt||'').slice(0,10);
  const rows=(google?.gsc?.focusQueryDaily||[])
    .filter(row=>String(row.query||'').toLowerCase()===String(experiment.query).toLowerCase())
    .filter(row=>String(row.date||'')>=started);
  const impressions=rows.reduce((total,row)=>total+num(row.impressions),0);
  const clicks=rows.reduce((total,row)=>total+num(row.clicks),0);
  const weightedPosition=impressions
    ? rows.reduce((total,row)=>total+(num(row.position)*num(row.impressions)),0)/impressions
    : 0;
  const ctr=impressions?clicks/impressions:0;
  const baseline=experiment.baseline||{};
  const cfg=policy?.thresholds?.experimentReview||{};
  const minPostImpressions=num(cfg.minPostImpressions)||30;
  const ctrLift=ctr-num(baseline.ctr);
  const positionDelta=impressions?weightedPosition-num(baseline.position):0;
  let verdict='INSUFFICIENT_DATA';
  if(impressions>=minPostImpressions){
    if(ctrLift>=num(cfg.minCtrLift||0.01) && positionDelta<=num(cfg.maxPositionLossToKeep||2.5)){
      verdict='KEEP';
    }else if(positionDelta>=num(cfg.materialPositionLoss||3) && ctrLift<=0){
      verdict='REASSESS';
    }else{
      verdict='KEEP_OBSERVING';
    }
  }
  return {
    verdict,
    query:experiment.query,
    post:{impressions,clicks,ctr,position:weightedPosition},
    baseline:{
      impressions:num(baseline.impressions),
      clicks:num(baseline.clicks),
      ctr:num(baseline.ctr),
      position:num(baseline.position),
    },
    deltas:{ctrLift,positionDelta},
    minPostImpressions,
    rows:rows.length,
  };
}

function evaluateContentUtilityExperiment(experiment,google){
  if(!experiment||experiment.type!=='CONTENT_UTILITY_UPGRADE') return null;
  const observation=google?.gsc?.quarterPriceObservation;
  if(!observation) return {verdict:'INSUFFICIENT_DATA',source:'missing_page_observation'};
  const sameExperiment=observation.experimentId&&observation.experimentId===experiment.id;
  let observationPath='';
  try{ observationPath=new URL(observation.page).pathname; }catch{}
  const sameTarget=observationPath&&observationPath===experiment.target;
  if(!sameExperiment&&!sameTarget) return {verdict:'INSUFFICIENT_DATA',source:'unmatched_page_observation'};

  const completeDays=num(observation.completeDays);
  const impressions=num(observation.impressions);
  const minCompleteDays=num(observation.minCompleteDays)||7;
  const minImpressions=num(observation.minImpressions)||30;
  const verified=observation.status==='ok'
    && observation.dataState==='final'
    && observation.scope==='page_post_observation';
  const eligible=verified
    && observation.eligibleForReview===true
    && completeDays>=minCompleteDays
    && impressions>=minImpressions;
  return {
    verdict:eligible?'READY_FOR_REVIEW':'INSUFFICIENT_DATA',
    source:'gsc_page_post_observation',
    verified,
    post:{
      completeDays,
      impressions,
      clicks:num(observation.clicks),
      ctr:num(observation.ctr),
      position:num(observation.position),
    },
    thresholds:{minCompleteDays,minImpressions},
  };
}

function commercialObservations({addrevenue,adtraction,policy}){
  const minClicks=num(policy?.thresholds?.commercial?.minPartnerClicks)||25;
  const observations=[];
  for(const row of addrevenue?.rows||[]){
    if(num(row.clicks)>=minClicks){
      observations.push({
        network:'addrevenue',
        partner:String(row.advertiserName||row.programName||'unknown'),
        clicks:num(row.clicks),
        approvedTransactions:num(row.approvedTransactions),
        approvedCommission:num(row.approvedCommission),
        approvedRevenuePerClick:num(row.approvedRevenuePerClick),
      });
    }
  }
  for(const row of adtraction?.rows||[]){
    if(num(row.totalClicks)>=minClicks){
      observations.push({
        network:'adtraction',
        partner:String(row.partner||'unknown'),
        clicks:num(row.totalClicks),
        approvedTransactions:num(row.approvedTransactions),
        approvedCommission:num(row.approvedCommission),
        approvedRevenuePerClick:num(row.approvedRevenuePerClick),
      });
    }
  }
  return observations.sort((a,b)=>b.approvedRevenuePerClick-a.approvedRevenuePerClick||b.clicks-a.clicks);
}

export function buildDecisionPacket({
  google=null,
  affiliate=null,
  addrevenue=null,
  adtraction=null,
  partnerHealth=null,
  policy={},
  state={},
  learningLedger={},
  now=new Date(),
}={}){
  const health=sourceHealth({google,affiliate,addrevenue,adtraction,partnerHealth,policy,now});
  const northStar=affiliateNorthStar({google,affiliate,addrevenue,adtraction,partnerHealth});
  const funnel=funnelSnapshot(google);
  const experiments=activeExperiments(state);
  const maxSlots=Math.max(1,num(policy?.limits?.maxConcurrentExperiments)||1);
  const slotsAvailable=experiments.length<maxSlots;
  const maxSeo=Math.max(1,num(policy?.limits?.maxConcurrentSeoExperiments)||1);
  const seoSlotsAvailable=experiments.filter(item=>item.type==='SEO_SNIPPET_TEST').length<maxSeo;
  const candidates=[];

  candidates.push(...partnerHealthActions(partnerHealth));
  candidates.push(...attributionActions({addrevenue,adtraction,policy}));

  if(health.status==='blocked'){
    candidates.push(action(
      'TECHNICAL_FIX',
      110,
      'Google/GA4-källdatan saknas eller är för gammal. Autopiloten får inte optimera på osäker data.',
      {sourceHealth:health.sources}
    ));
  }

  const experimentGates=experiments.map(experiment=>{
    const reviewAt=Date.parse(experiment.earliestReviewAt||'');
    const due=Number.isFinite(reviewAt)&&now.getTime()>=reviewAt;
    return {
      id:experiment.id,
      type:experiment.type,
      target:experiment.target,
      query:experiment.query||null,
      startedAt:experiment.startedAt,
      earliestReviewAt:experiment.earliestReviewAt,
      reviewDue:due,
    };
  });
  for(let i=0;i<experiments.length;i++){
    const experiment=experiments[i];
    const experimentGate=experimentGates[i];
    if(experimentGate.reviewDue){
      const evaluation=experiment.type==='CONTENT_UTILITY_UPGRADE'
        ?evaluateContentUtilityExperiment(experiment,google)
        :evaluateSeoExperiment(experiment,google,policy);
      const waitingForContentSample=experiment.type==='CONTENT_UTILITY_UPGRADE'
        && evaluation?.verdict!=='READY_FOR_REVIEW';
      candidates.push(action(
        waitingForContentSample?'WAITING_FOR_EXPERIMENT':'REVIEW_ACTIVE_EXPERIMENT',
        95,
        evaluation?.verdict==='INSUFFICIENT_DATA'
          ?'Observationstid har passerat men stickprovet är för litet för ett säkert beslut.'
          :'Aktivt experiment har passerat minsta observationstid och kan bedömas.',
        {experiment:experimentGate,baseline:experiment.baseline||null,evaluation}
      ));
    }
  }

  if(slotsAvailable && health.status!=='blocked'){
    if(seoSlotsAvailable){
    const seo=seoCandidate(google,policy,learningLedger,now,experiments);
    if(seo){
      candidates.push(action(
        'SEO_SNIPPET_TEST',
        70,
        'En sökfråga rankar tillräckligt bra och har tillräcklig exponering men låg CTR.',
        seo
      ));
    }

    }
    const utility=contentUtilityCandidate(google,policy,experiments,state);
    if(utility){
      candidates.push(action(
        'CONTENT_UTILITY_UPGRADE',
        60,
        'En befintlig sida har tydlig efterfrågan men ligger i räckhållszonen utan klick. Förbättra den med en konkret originalnytta på samma URL i stället för att skapa fler SEO-sidor.',
        utility
      ));
    }

    const pageCommercial=pageCommercialCandidate(google,policy,experiments);
    if(pageCommercial){
      candidates.push(action(
        'PAGE_COMMERCIAL_CRO_TEST',
        66,
        'En organisk innehållssida visar tillräckligt många partneralternativ men för få besökare klickar vidare. Testa ett enda tydligare kommersiellt steg utan att ändra sidans sökintention.',
        pageCommercial
      ));
    }

    const cro=experiments.length===0?croCandidate(google,policy):null; // /app/ spans categories; avoid overlapping funnels.
    if(cro){
      candidates.push(action(
        'CRO_FRICTION_TEST',
        65,
        cro.kind==='completion'
          ?'Organiska användare startar Kostnadskollen men för få slutför den.'
          :'Tillräckligt många organiska användare ser partnerförslag men för få klickar vidare.',
        cro
      ));
    }
  }

  candidates.sort((a,b)=>b.priority-a.priority);
  let recommended=candidates[0]||null;

  if(!recommended){
    if(!slotsAvailable){
      recommended=action(
        'WAITING_FOR_EXPERIMENT',
        0,
        'Alla oberoende experimentslots används. Fortsätt samla data och förbereda icke-överlappande möjligheter.',
        {experiments:experimentGates}
      );
    }else{
      recommended=action(
        'WAITING_FOR_SIGNAL',
        0,
        'Ingen signal passerar minsta datatröskel. Ändra inte sajten bara för att skapa aktivitet.',
        {}
      );
    }
  }

  const auto=(policy?.autonomy?.auto||[]).includes(recommended.type);
  const commercial=commercialObservations({addrevenue,adtraction,policy});
  const commercialPages=commercialPageSnapshot(google);

  return {
    generatedAt:now.toISOString(),
    policyVersion:policy?.version||null,
    stateVersion:state?.version||null,
    systemStatus:health.status==='blocked'?'BLOCKED'
      :recommended.type==='WAITING_FOR_EXPERIMENT'?'EXPERIMENT_RUNNING'
      :recommended.type==='WAITING_FOR_SIGNAL'?'OBSERVE'
      :health.status==='degraded'?'DEGRADED_ACTIONABLE'
      :'ACTIONABLE',
    sourceHealth:health,
    northStar,
    traffic:{
      ga4Sessions:num(google?.ga4?.totals?.sessions),
      ga4ActiveUsers:num(google?.ga4?.totals?.activeUsers),
      organicSessions:num(google?.ga4?.organic?.sessions),
      gscClicks:num(google?.gsc?.totals?.clicks),
      gscImpressions:num(google?.gsc?.totals?.impressions),
      gscCtr:num(google?.gsc?.totals?.ctr),
      gscPosition:num(google?.gsc?.totals?.position),
    },
    funnel,
    attribution:{
      adtraction:adtraction?.attributionCoverage||null,
      addrevenue:addrevenue?.attributionCoverage||null,
    },
    activeExperiment:experimentGates[0]||null,
    activeExperiments:experimentGates,
    commercialObservations:commercial,
    commercialPages,
    recommendedAction:{
      ...recommended,
      autonomous:auto,
      ownerDecisionRequired:!auto && !['WAITING_FOR_EXPERIMENT','WAITING_FOR_SIGNAL'].includes(recommended.type),
    },
    candidateActions:candidates,
    guardrails:{
      oneExperimentAtATime:maxSlots===1,
      maxConcurrentExperiments:maxSlots,
      activeExperimentCount:experiments.length,
      activeExperimentBlocksGrowth:!slotsAvailable,
      noActionBelowThreshold:recommended.type==='WAITING_FOR_SIGNAL'||recommended.type==='WAITING_FOR_EXPERIMENT',
    },
  };
}

export function toMarkdown(packet){
  const pct=value=>new Intl.NumberFormat('sv-SE',{style:'percent',maximumFractionDigits:1}).format(num(value));
  const money=value=>value==null?'UNKNOWN':new Intl.NumberFormat('sv-SE',{style:'currency',currency:'SEK',maximumFractionDigits:2}).format(num(value));
  const n=value=>new Intl.NumberFormat('sv-SE',{maximumFractionDigits:1}).format(num(value));
  const r=packet.recommendedAction;
  const lines=[
    '# Sänk Kostnaden – Autopilot',
    '',
    'Status: **'+packet.systemStatus+'**',
    'Beslut: **'+r.type+'**',
    'Autonomt tillåtet: **'+(r.autonomous?'ja':'nej')+'**',
    '',
    '## Varför',
    '',
    r.reason,
    '',
    '## North star',
    '',
    '- Organiska sessioner: **'+n(packet.northStar.organicSessions)+'**',
    '- Godkänd affiliateintäkt: **'+money(packet.northStar.approvedRevenue)+'**',
    '- Godkända transaktioner: **'+(packet.northStar.approvedTransactions==null?'UNKNOWN':n(packet.northStar.approvedTransactions))+'**',
    '- Intäkt per relevant besökare: **'+money(packet.northStar.approvedRevenuePerRelevantVisitor)+'**',
    '- Rapporterade godkända provisioner i avlästa nätverk: **'+money(packet.northStar.reportedNetworkApprovedCommission)+'**',
    '- Saknade intäktsnätverk: **'+(packet.northStar.revenueCoverage?.missingNetworks?.join(', ')||'UNKNOWN')+'**',
    '- Nätverksklick (inklusive historik/QA, ej nödvändigtvis riktiga organiska): **'+n(packet.northStar.networkClicks)+'**',
    '',
    '## Google',
    '',
    '- GSC: **'+n(packet.traffic.gscClicks)+' klick / '+n(packet.traffic.gscImpressions)+' visningar / '+pct(packet.traffic.gscCtr)+' CTR / position '+n(packet.traffic.gscPosition)+'**',
    '- GA4: **'+n(packet.traffic.ga4Sessions)+' sessioner / '+n(packet.traffic.organicSessions)+' organiska sessioner**',
    '',
    '## Organisk Kostnadskollen-funnel',
    '',
    '- Starter: **'+n(packet.funnel.organic.starts)+'**',
    '- Slutförda händelser: **'+n(packet.funnel.organic.completes)+'** (konverteringsgrad: **UNKNOWN**; saknar sessionskoppling)',
    '- Partnerexponeringar: **'+n(packet.funnel.organic.partnerImpressions)+'**',
    '- Affiliateklick: **'+n(packet.funnel.organic.affiliateClicks)+'** (händelseandel: '+(packet.funnel.organic.affiliateClickRate==null?'UNKNOWN':pct(packet.funnel.organic.affiliateClickRate))+', inte besökarkonvertering)',
    '',
    '## Datakvalitet',
    '',
  ];
  for(const source of packet.sourceHealth.sources){
    lines.push('- '+source.source+': **'+source.status+'**'+(source.ageHours==null?'':' · '+source.ageHours+' h'));
  }
  lines.push('');

  if(packet.projectContext){
    const ctx=packet.projectContext;
    lines.push(
      '## Aktuellt produktläge (releasejournal)',
      '',
      '- Senast dokumenterad release: **'+(ctx.updatedAt||'okänt datum')+'** · main '+(ctx.latestVerifiedMainCommit||'okänt'),
      '- Utcheckad revision för denna körning: **'+(ctx.checkoutSha||'saknas')+'**',
      '- Senaste samlade releaser: '+(Array.isArray(ctx.shipped)?ctx.shipped.map(x=>'#'+x.pr+' '+x.scope).join('; '):'saknas'),
      '- Produktbeslut: '+(ctx.decisionContext?.design||'kontrollera masterplan'),
      '- Pris-/jämförelsegräns: '+(ctx.decisionContext?.pricing||'verifiera priskälla'),
      '- Ej verifierat: '+(Array.isArray(ctx.unresolved)?ctx.unresolved.join(' | '):'kontrollera live QA'),
      '- Läs autopilot/release-context.json, aktuell GitHub-kod och autopilot/MASTERPLAN_EXECUTION_2026-10-08.md innan nya åtgärder. Denna lista är inte ett automatiskt bevis på live deploy.',
      ''
    );
  }

  if(packet.activeExperiments?.length){
    lines.push('## Pågående experiment ('+packet.activeExperiments.length+')','');
    for(const experiment of packet.activeExperiments){
      lines.push(
        '- **'+experiment.type+'** · '+experiment.target+' · '+experiment.id,
        '  Tidigaste granskning: '+(experiment.earliestReviewAt||'ej bestämt'),
        '  Klar för granskning: '+(experiment.reviewDue?'ja':'nej')
      );
    }
    lines.push('');
  }

  if(r.details&&Object.keys(r.details).length){
    lines.push('## Beslutsdata','',JSON.stringify(r.details,null,2),'');
  }

  lines.push(
    '## Autopilotregel',
    '',
    packet.guardrails.activeExperimentBlocksGrowth
      ?'Alla experimentslots är upptagna. Tekniska fel och attribution får repareras.'
      :'Oberoende förändringar är tillåtna inom '+packet.guardrails.maxConcurrentExperiments+' slots, aldrig för samma kategori/funnel.',
    '',
    'Ingen rå persondata, order-ID, klick-ID eller credential ingår i rapporten.',
    ''
  );
  return lines.join('\n');
}
