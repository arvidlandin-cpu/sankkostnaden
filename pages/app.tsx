import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Gauge, PiggyBank, RotateCcw, Target, Zap } from 'lucide-react';
import styles from '../styles/App.module.css';
import { getActivePartners, partnerGroupCheckedLabel, type PartnerIntent } from '../lib/partners';
import { costCheckStorageKey, emptyCostAnswers, normalizeCostAnswers, prioritySortValue, scenarioAnnualSaving, type CostAnswers, type CostKey } from '../lib/costPrioritizer';
import { emitAnalyticsEvent } from '../lib/clientAttribution';

type Category = {
  key: CostKey;
  label: string;
  short: string;
  href: string;
  fitQuestion: string;
  fitOptions: Array<{ label: string; value: number }>;
};

const categories: Category[] = [
  {key:'el',label:'Elavtal',short:'El',href:'/elavtal/jamfor-elavtal/',fitQuestion:'Vad stämmer bäst om ditt elavtal?',fitOptions:[{label:'Nyligen jämfört – jag har koll på pris och avgifter',value:0},{label:'Osäker på avgifter/villkor eller länge sedan jag jämförde',value:1},{label:'Priset har ändrats eller avtalet känns dyrt',value:2}]},
  {key:'bredband',label:'Bredband',short:'Bredband',href:'/bredband/bredband-pa-min-adress/',fitQuestion:'Vad stämmer bäst om bredbandet?',fitOptions:[{label:'Nyligen jämfört – fart och pris känns rätt',value:0},{label:'Osäker på nivå/pris eller länge sedan jag jämförde',value:1},{label:'Priset har höjts eller känns högt',value:2}]},
  {key:'mobil',label:'Mobilabonnemang',short:'Mobil',href:'/mobil/billigaste-mobilabonnemanget/',fitQuestion:'Vad stämmer bäst om mobilabonnemanget?',fitOptions:[{label:'Nyligen jämfört – surf och pris passar bra',value:0},{label:'Osäker på surf/pris eller länge sedan jag jämförde',value:1},{label:'Priset har höjts eller upplägget känns gammalt',value:2}]},
  {key:'forsakring',label:'Försäkring',short:'Försäkring',href:'/forsakring/jamfor-forsakring/',fitQuestion:'Hur bra koll har du på försäkringarna?',fitOptions:[{label:'Nyligen jämfört – bra koll på skydd och självrisk',value:0},{label:'Delvis osäker eller länge sedan jag jämförde',value:1},{label:'Vet inte vad som ingår eller vad jag betalar för',value:2}]},
];

const legacyStorageKey='sankkostnaden-cost-check-v4';
const partnerIntent:Record<CostKey,PartnerIntent>={el:'electricity',bredband:'compare',mobil:'compare',forsakring:'home'};
const rankLabels=['KONTROLLERA FÖRST','DÄREFTER','SEDAN','SIST'];

export default function SavingsApp(){
  const [answers,setAnswers]=useState<CostAnswers>(emptyCostAnswers);
  const [active,setActive]=useState<CostKey>('el');
  const [scenarioPct,setScenarioPct]=useState(10);
  const [hydrated,setHydrated]=useState(false);
  const [areaPickerOpen,setAreaPickerOpen]=useState(false);
  const completedTracked=useRef(false);
  const startedTracked=useRef(false);
  const earlyResultTracked=useRef(false);
  const quickPathShownTracked=useRef<Set<CostKey>>(new Set());
  const questionCardRef=useRef<HTMLDivElement>(null);

  useEffect(()=>{
    try{
      const saved=window.localStorage.getItem(costCheckStorageKey)||window.localStorage.getItem(legacyStorageKey);
      if(saved){
        const parsed=JSON.parse(saved);
        if(parsed?.answers) setAnswers(normalizeCostAnswers(parsed.answers));
        if(typeof parsed?.scenarioPct==='number') setScenarioPct(Math.min(50,Math.max(1,parsed.scenarioPct)));
      }
    }catch{}
    setHydrated(true);
  },[]);

  useEffect(()=>{
    if(!hydrated) return;
    try{window.localStorage.setItem(costCheckStorageKey,JSON.stringify({answers,scenarioPct,updatedAt:Date.now()}));}catch{}
  },[answers,scenarioPct,hydrated]);

  const results=useMemo(()=>categories.map(category=>{
    const answer=answers[category.key];
    const reasons:string[]=[];
    if(answer.fit>=1){
      if(category.key==='el') reasons.push(answer.fit===2?'Pris eller kampanj kan ha ändrats':'Avgifter eller villkor är inte helt tydliga');
      if(category.key==='bredband') reasons.push(answer.fit===2?'Priset har höjts eller känns högt':'Du är osäker på pris, nivå eller när avtalet senast jämfördes');
      if(category.key==='mobil') reasons.push(answer.fit===2?'Priset har höjts eller upplägget känns gammalt':'Du är osäker på surf, pris eller när abonnemanget senast jämfördes');
      if(category.key==='forsakring') reasons.push(answer.fit===2?'Du saknar koll på vad skyddet faktiskt omfattar':'Du är osäker på skydd, självrisk eller när försäkringen senast jämfördes');
    }
    if(answer.monthly>0) reasons.push('Du har lagt in en faktisk månadskostnad för området');
    if(!reasons.length) reasons.push('Dina svar visar ingen tydlig brist just nu');
    return {
      ...category,
      fit:answer.fit,
      monthly:answer.monthly,
      priorityValue:prioritySortValue(answer),
      scenarioSaving:scenarioAnnualSaving(answer.monthly,scenarioPct),
      reasons,
    };
  }).sort((a,b)=>b.priorityValue-a.priorityValue),[answers,scenarioPct]);

  const isComplete=(key:CostKey)=>answers[key].fit>=0;
  const evaluatedResults=results.filter(result=>isComplete(result.key));
  const completed=evaluatedResults.length;
  const top=evaluatedResults[0]||results[0];
  const totalMonthly=Object.values(answers).reduce((sum,answer)=>sum+answer.monthly,0);
  const noClearIssue=completed===4&&evaluatedResults.every(result=>result.fit===0);
  const topTied=completed===4&&!noClearIssue&&evaluatedResults.length>1&&evaluatedResults[0].priorityValue===evaluatedResults[1].priorityValue;
  const earlyTop=evaluatedResults[0];
  const earlyHasSignal=Boolean(earlyTop&&earlyTop.fit>=1);
  const nextUnanswered=categories.find(category=>!isComplete(category.key));

  useEffect(()=>{
    if(completed<1||completed>=4||earlyResultTracked.current)return;
    earlyResultTracked.current=true;
    emitAnalyticsEvent('cost_check_early_result_available',{
      source:'app',questions_answered:completed,
      category:earlyTop?.key||'none',has_signal:earlyHasSignal?1:0,
    });
  },[completed,earlyHasSignal,earlyTop?.key]);

  useEffect(()=>{
    if(completed===4&&!completedTracked.current){
      completedTracked.current=true;
      emitAnalyticsEvent('cost_check_complete',{top_category:noClearIssue?'none':top.key,has_costs:totalMonthly>0?1:0});
    }
  },[completed,noClearIssue,top.key,totalMonthly]);

  const resultPartners=(key:CostKey)=>key==='forsakring'?[]:getActivePartners(key,partnerIntent[key],2);

  const update=(key:CostKey,field:'monthly'|'fit',value:number)=>{
    setAnswers(previous=>({...previous,[key]:{...previous[key],[field]:value}}));
    if(field==='fit'){
      if(!startedTracked.current){
        startedTracked.current=true;
        emitAnalyticsEvent('cost_check_start',{category:key});
      }
      emitAnalyticsEvent('cost_check_answer',{category:key,field:'fit',value});
    }else emitAnalyticsEvent('cost_check_cost_added',{category:key,has_value:value>0?1:0});
  };

  const reset=()=>{
    setAnswers(emptyCostAnswers);
    setActive('el');
    setAreaPickerOpen(false);
    setScenarioPct(10);
    completedTracked.current=false;
    startedTracked.current=false;
    earlyResultTracked.current=false;
    quickPathShownTracked.current.clear();
    try{window.localStorage.removeItem(costCheckStorageKey);window.localStorage.removeItem(legacyStorageKey);}catch{}
    emitAnalyticsEvent('cost_check_reset',{source:'app'});
  };

  const activeCategory=categories.find(category=>category.key===active)!;
  const activeAnswer=answers[active];
  const activeIndex=categories.findIndex(category=>category.key===active);
  const activeComplete=isComplete(active);
  const activeQuickPartner=activeAnswer.fit===2?resultPartners(active)[0]:undefined;

  useEffect(()=>{
    if(activeAnswer.fit!==2||quickPathShownTracked.current.has(active)) return;
    quickPathShownTracked.current.add(active);
    emitAnalyticsEvent('cost_check_quick_path_shown',{category:active,has_partner:activeQuickPartner?1:0});
  },[active,activeAnswer.fit,activeQuickPartner]);

  const goNext=()=>{
    if(!activeComplete||activeIndex>=categories.length-1) return;
    setActive(categories[activeIndex+1].key);
    window.requestAnimationFrame(()=>questionCardRef.current?.scrollIntoView({behavior:'smooth',block:'start'}));
  };

  return <>
    <Head>
      <title>Kostnadskollen – se vilka avtal du bör jämföra först | Sänk Kostnaden</title>
      <meta name='description' content='Använd Kostnadskollen för att se vilka fasta kostnader som är mest rimliga att kontrollera först: el, bredband, mobil eller försäkring.' />
      <meta property='og:title' content='Kostnadskollen – se vilka avtal du bör jämföra först | Sänk Kostnaden' />
      <meta property='og:description' content='Se vilka fasta kostnader som är mest rimliga att kontrollera först och gå vidare till rätt jämförelse.' />
      <meta property='og:url' content='https://sankkostnaden.se/app/' />
      <link rel='canonical' href='https://sankkostnaden.se/app/' />
      <meta name='robots' content='index,follow,max-image-preview:large,max-snippet:-1' />
      <script type='application/ld+json' dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'WebApplication',name:'Kostnadskollen',description:'Ett gratis verktyg som hjälper hushåll prioritera vilka återkommande avtal som är mest värda att granska först.',url:'https://sankkostnaden.se/app/',applicationCategory:'FinanceApplication',operatingSystem:'Web',isAccessibleForFree:true})}}/>
    </Head>

    <header className='topbar'>
      <Link className='brand' href='/'><span className='brandMark'><PiggyBank size={22}/></span><span>Sänk Kostnaden</span></Link>
      <nav><Link href='/bredband/'>Bredband</Link><Link href='/elavtal/'>El</Link><Link href='/mobil/'>Mobil</Link><Link href='/forsakring/'>Försäkring</Link><Link href='/ekonomi/'>Ekonomi</Link></nav>
    </header>

    <main className={styles.appShell}>
      <section className={styles.hero}>
        <div className={styles.heroEyebrow}><Link className={styles.back} href='/'><ArrowLeft size={15}/> Startsidan</Link><span>KOSTNADSKOLLEN · GRATIS</span></div>
        <h1>Vilket avtal bör du kontrollera först?</h1>
        <p>Välj det som stämmer bäst. Du får en första väg vidare direkt – utan att behöva veta vad du betalar.</p>
      </section>

      <section id='fragor' className={styles.diagnostic}>
        <div className={styles.stageToolbar}>
          <span>{completed===0?'En fråga räcker för att börja':completed===4?'Alla fyra områden kontrollerade':`${completed} av 4 områden klara`}</span>
          {totalMonthly>0&&<span className={styles.importedCost}>Inlästa kostnader: {totalMonthly.toLocaleString('sv-SE')} kr/mån</span>}
          <button type='button' aria-expanded={areaPickerOpen} aria-controls='cost-check-area-picker' onClick={()=>setAreaPickerOpen(open=>!open)}>
            Byt område <ChevronDown size={15}/>
          </button>
        </div>
        {areaPickerOpen&&<div id='cost-check-area-picker' className={styles.progressRail} aria-label='Välj kostnadsområde'>
          {categories.map(category=><button type='button' key={category.key} className={active===category.key?styles.activeTab:''} onClick={()=>{setActive(category.key);setAreaPickerOpen(false);window.requestAnimationFrame(()=>questionCardRef.current?.scrollIntoView({behavior:'smooth',block:'start'}));}} aria-current={active===category.key?'step':undefined}>
            <span>{category.short}</span><b>{isComplete(category.key)?'✓':'–'}</b>
          </button>)}
        </div>}

        <div ref={questionCardRef} className={styles.questionCard}>
          <div className={styles.questionTop}>
            <div><span>OMRÅDE {activeIndex+1} AV 4</span><h2>{activeCategory.label}</h2></div>
          </div>

          <ChoiceQuestion title={activeCategory.fitQuestion} value={activeAnswer.fit} options={activeCategory.fitOptions} onChange={value=>update(active,'fit',value)}/>

          <details className={styles.optionalCost} open={activeAnswer.monthly>0}>
            <summary>{activeAnswer.monthly>0?activeAnswer.monthly.toLocaleString('sv-SE')+' kr/mån angivet':'Lägg till månadskostnad (valfritt)'}</summary>
            <div className={styles.optionalCostBody}>
              <p>Beloppet används lokalt för att skilja annars likvärdiga områden och för ditt eget besparingsscenario. Exakta belopp skickas inte till vår analysmätning.</p>
              <div className={styles.moneyInput}><input type='number' min='0' inputMode='numeric' value={activeAnswer.monthly||''} onChange={event=>update(active,'monthly',Math.max(0,Number(event.target.value)||0))} placeholder='t.ex. 499'/><span>kr/mån</span></div>
            </div>
          </details>

          {activeAnswer.fit===2&&<aside className={styles.quickPath}>
            <div>
              <span>SNABB VÄG</span>
              <strong>{activeCategory.label} verkar värt att kontrollera direkt.</strong>
              <p>Se aktuella alternativ direkt eller fortsätt med nästa område.</p>
            </div>
            <div className={styles.quickPathActions}>
              {activeQuickPartner?<a href={activeQuickPartner.trackingUrl} data-partner={activeQuickPartner.name} data-category={activeQuickPartner.category} data-intent={partnerIntent[active]} data-placement='cost_check_quick_path' data-partner-position='1' target='_blank' rel='sponsored nofollow noopener'>Se alternativ hos {activeQuickPartner.name} <ArrowUpRight size={14}/></a>:<Link href={activeCategory.href} onClick={()=>emitAnalyticsEvent('cost_check_quick_guide_click',{category:active})}>Jämför {activeCategory.short.toLowerCase()} nu <ArrowRight size={14}/></Link>}
            </div>
          </aside>}

          <div className={styles.cardActions}>
            {completed>0&&<button className={styles.reset} onClick={reset}><RotateCcw size={15}/> Börja om</button>}
            {completed>0&&completed<4&&<a className={styles.previewAction} href='#resultat' onClick={()=>emitAnalyticsEvent('cost_check_early_result_opened',{source:'app',questions_answered:completed})}>Se din första startpunkt <Target size={15}/></a>}
            {activeComplete&&(activeIndex<categories.length-1?<button className={styles.next} onClick={goNext}>Klart – till {categories[activeIndex+1].short} <ArrowRight size={17}/></button>:<a className={styles.next} href='#resultat'>Visa min prioritering <Target size={17}/></a>)}
          </div>
        </div>
      </section>

      {completed>0&&<section id='resultat' className={styles.results}>
        <div className={styles.resultIntro}>
          <div><span>{completed===4?'DIN KOSTNADSKOLL':'FÖRSTA VÄGEN VIDARE'}</span><h2>{completed===4?(noClearIssue?'Ingen tydlig brist identifierad':topTied?'Flera områden är likvärdiga att kontrollera':top.label+' bör kontrolleras först'):'Här kan du börja'}</h2></div>
          <p>{completed===4?'Dina svar hjälper oss prioritera områden att kontrollera. Partnerlänkarna är inte personliga prisrankningar.':'Detta är en preliminär vägledning utifrån dina svar – inte ett beräknat sparbelopp.'}</p>
        </div>

        {completed===4&&totalMonthly>0&&<div className={styles.scenarioBox}>
          <div><span>BESPARINGSSCENARIO · INTE EN PROGNOS</span><h3>Vad skulle en lägre kostnad motsvara på ett år?</h3><p>Välj ett rent räkneexempel. Vi påstår inte att just denna procent går att spara.</p></div>
          <div className={styles.scenarioButtons}>{[5,10,20].map(pct=><button key={pct} className={scenarioPct===pct?styles.scenarioSelected:''} onClick={()=>{setScenarioPct(pct);emitAnalyticsEvent('cost_check_scenario',{scenario_pct:pct})}}>{pct}%</button>)}</div>
        </div>}

        {completed<4?<div className={styles.ranking}>
          {completed===0
            ?<article className={styles.incompleteResult}><div className={styles.resultBody}><div><h3>Välj ett svar för att få en första startpunkt.</h3></div><p>Du behöver inte kunna ditt pris eller svara om alla områden för att börja.</p></div></article>
            :<article className={`${styles.incompleteResult} ${styles.earlyResult}`} data-testid='cost-check-early-result'>
              <div className={styles.resultBody}>
                <span className={styles.earlyEyebrow}>FÖRSTA STARTPUNKTEN · {completed} AV 4 OMRÅDEN KONTROLLERADE</span>
                <h3>{earlyHasSignal?`${earlyTop.label} kan vara värt att kontrollera nu`:'Ingen tydlig brist i de områden du kontrollerat hittills'}</h3>
                <p>{earlyHasSignal
                  ?'Ditt svar visar en anledning att se över det här området. Det är en preliminär väg vidare – inte en ranking av marknadens avtal eller ett påstående om möjlig besparing.'
                  :'Dina svar visar ännu ingen tydlig anledning till ett byte. Du kan fortsätta till nästa område eller kontrollera aktuella villkor om du vill.'}</p>
                {earlyHasSignal&&<ul>{earlyTop.reasons.slice(0,2).map(reason=><li key={reason}><Check size={14}/>{reason}</li>)}</ul>}
                <p className={styles.earlyQualification}>Du kan få en bredare prioritering genom att kontrollera fler områden. Någon individuell besparing har inte beräknats.</p>
              </div>
              <div className={styles.earlyActions}>
                {earlyHasSignal&&<Link className={styles.earlyPrimary} href={earlyTop.href} onClick={()=>emitAnalyticsEvent('cost_check_early_result_continue',{source:'app',category:earlyTop.key,questions_answered:completed})}>Kontrollera {earlyTop.short.toLowerCase()} nu <ArrowRight size={17}/></Link>}
                {nextUnanswered&&<button type='button' onClick={()=>{setActive(nextUnanswered.key);window.requestAnimationFrame(()=>questionCardRef.current?.scrollIntoView({behavior:'smooth',block:'start'}))}}>Kontrollera även {nextUnanswered.short.toLowerCase()} <ArrowRight size={16}/></button>}
              </div>
            </article>}
        </div>:
        <div className={styles.ranking}>
          {evaluatedResults.map((result,index)=>{
            const partners=resultPartners(result.key).slice(0,2);
            const nextResult=evaluatedResults[index+1];
            const tied=evaluatedResults.some((other,j)=>j!==index&&other.priorityValue===result.priorityValue);
            return <article id={'result-'+result.key} key={result.key} className={index===0?styles.topResult:''}>
              <div className={styles.rank}><span>{noClearIssue?'INGEN TYDLIG BRIST':tied?'LIKVÄRDIG ATT KONTROLLERA':rankLabels[index]}</span></div>
              <div className={styles.resultBody}>
                <div><h3>{result.label}</h3>{result.monthly>0&&<span className={styles.potential}>{result.monthly.toLocaleString('sv-SE')} kr/mån</span>}</div>
                <ul>{result.reasons.slice(0,2).map(reason=><li key={reason}><Check size={14}/> {reason}</li>)}</ul>
                {result.monthly>0&&<p className={styles.scenarioLine}>Om kostnaden i ett räkneexempel minskar {scenarioPct}% motsvarar det cirka <strong>{Math.round(result.scenarioSaving).toLocaleString('sv-SE')} kr/år</strong>.</p>}
              </div>
              <div className={styles.resultActions}>
                {partners.length>0&&<small className={styles.verifiedLine}>Partnerlänkar kontrollerade {partnerGroupCheckedLabel(partners)}</small>}
                {partners.map((partner,partnerIndex)=><a key={partner.name} href={partner.trackingUrl} data-partner={partner.name} data-category={partner.category} data-intent={partnerIntent[result.key]} data-placement='cost_check_result' data-partner-position={partnerIndex+1} data-result-rank={index+1} target='_blank' rel='sponsored nofollow noopener'>{partnerIndex===0?'Jämför hos ':'Alternativ: '}{partner.name} <ArrowUpRight size={14}/></a>)}
                <Link href={result.href}>{result.key==='forsakring'?'Välj försäkringstyp':'Jämför fler i guiden'} <ArrowRight size={14}/></Link>
                {nextResult&&<a className={styles.nextCategory} href={`#result-${nextResult.key}`} onClick={()=>emitAnalyticsEvent('cost_check_next_category',{from:result.key,to:nextResult.key,rank:index+1})}>När du är klar: {nextResult.short} <ArrowRight size={14}/></a>}
              </div>
            </article>;
          })}
        </div>}
      </section>}

      <details className={styles.methodology}>
        <summary>Så fungerar Kostnadskollen <ChevronDown size={16}/></summary>
        <div className={styles.explain}>
          <Gauge size={25}/><div><strong>Hur prioriteras områdena?</strong><p>Det är inget betyg och ingen prisranking. Dina svar väger först; månadskostnaden används bara för att skilja annars likvärdiga områden.</p></div>
          <Zap size={25}/><div><strong>Vad betyder procentscenariot?</strong><p>Det är bara matematik på dina egna belopp. Det är inte ett löfte om att marknaden kan sänka kostnaden med 5, 10 eller 20 procent.</p></div>
        </div>
      </details>
    </main>
  </>;
}

function ChoiceQuestion({title,value,options,onChange}:{title:string;value:number;options:Array<{label:string;value:number}>;onChange:(value:number)=>void}){
  return <div className={styles.question}><p className={styles.questionLabel}>{title}</p><div className={styles.choices} role='group' aria-label={title}>{options.map(option=><button type='button' key={option.label} aria-pressed={value===option.value} className={value===option.value?styles.selected:''} onClick={()=>onChange(option.value)}>{option.label}</button>)}</div></div>;
}
