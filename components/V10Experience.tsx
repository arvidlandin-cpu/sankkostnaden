import {useMemo,useRef,useState} from 'react';
import Link from 'next/link';
import {ArrowRight,ArrowUpRight,Check,ChevronDown,ChevronRight,Compass,Info,PiggyBank,ShieldCheck,Sparkles,SlidersHorizontal,Wifi,Zap,Smartphone,HeartHandshake,WalletCards,RotateCcw} from 'lucide-react';
import {getActivePartners,type PartnerCategory,type PartnerIntent,type ActivePartner} from '../lib/partners';
import {emitAnalyticsEvent} from '../lib/clientAttribution';
import PartnerIdentity from './PartnerIdentity';
import {getCategoryArtwork} from '../lib/categoryArtwork';
import s from '../styles/V10Experience.module.css';

export type JourneyCategory=PartnerCategory;
type Choice={id:string;label:string;intent:PartnerIntent;why:string};
type Track={id:JourneyCategory;name:string;question:string;subtitle:string;hint:string;href:string;guideHref:string;guideText:string;toolHref:string;toolText:string;icon:typeof Wifi;filters:Choice[];accent:string};
const tracks:Track[]=[
 {id:'el',name:'El',question:'Vill du se över elavtalet?',subtitle:'Förbrukning, påslag och avgifter',hint:'Jämför samma årsförbrukning, avtalsform och fasta avgifter.',href:'/elavtal/',guideHref:'/elavtal/vilket-elavtal-passar-mig/',guideText:'Hjälp att välja avtalsform',toolHref:'/verktyg/elavtalskostnad/',toolText:'Räkna på två verkliga elerbjudanden',icon:Zap,accent:'gold',filters:[
  {id:'all',label:'Jämför flera',intent:'compare',why:'Jämförelsetjänster och elpartners är en startpunkt; aktuella prisuppgifter kontrolleras hos dem.'},
  {id:'direct',label:'Se elbolag',intent:'electricity',why:'Visar aktiva elhandelspartners, inte en ranking av lägsta elpris.'}
 ]},
 {id:'bredband',name:'Bredband',question:'Vad finns på din adress?',subtitle:'Hastighet, adress och totalpris',hint:'Bredband kan bara jämföras rättvist där leverans är möjlig.',href:'/bredband/',guideHref:'/bredband/vilken-hastighet-behover-jag/',guideText:'Vilken hastighet behöver jag?',toolHref:'/verktyg/forstaarskostnad-bredband/',toolText:'Räkna första årets totalkostnad',icon:Wifi,accent:'blue',filters:[
  {id:'all',label:'Jämför flera',intent:'compare',why:'Utbud och priser är adressberoende; kontrollera dem hos partnern.'},
  {id:'fiber',label:'Fiber',intent:'fiber',why:'Kontrollera om fiber erbjuds på din specifika adress.'},
  {id:'mobile',label:'Mobilt / 5G',intent:'mobile-broadband',why:'Kontrollera täckning, databegränsningar och hastighet på platsen.'}
 ]},
 {id:'mobil',name:'Mobil',question:'Hur använder du mobilen?',subtitle:'Surf, nät och familjeabonnemang',hint:'Kontrollera täckning, surfmängd och priset efter kampanjen.',href:'/mobil/',guideHref:'/mobil/hur-mycket-surf-behover-jag/',guideText:'Hur mycket surf behöver jag?',toolHref:'/verktyg/forstaarskostnad/',toolText:'Räkna första årets abonnemangskostnad',icon:Smartphone,accent:'lavender',filters:[
  {id:'all',label:'Se operatörer',intent:'compare',why:'Utvalda mobilpartners. Jämför likvärdig surf, nät och bindningstid.'},
  {id:'family',label:'Familj',intent:'family',why:'Jämför totalpriset för alla abonnemang, inte bara huvudnumret.'},
  {id:'data',label:'Mer surf',intent:'data',why:'Välj efter hur mycket mobildata du faktiskt använder.'},
  {id:'flex',label:'Utan bindningstid',intent:'no-binding',why:'Kontrollera bindningstid och uppsägningsvillkor innan du byter.'}
 ]},
 {id:'forsakring',name:'Försäkring',question:'Vad vill du försäkra?',subtitle:'Skydd, självrisk och villkor',hint:'Jämför lika omfattning och självrisk – inte bara premie.',href:'/forsakring/',guideHref:'/forsakring/jamfor-hemforsakring/',guideText:'Så jämför du skydd och självrisk',toolHref:'/forsakring/hemforsakring-skyddskoll/',toolText:'Gör skyddskollen för ditt hem',icon:HeartHandshake,accent:'rose',filters:[
  {id:'home',label:'Hem',intent:'home',why:'Välj hemförsäkring efter boendeform och rätt skyddsnivå.'},
  {id:'pet',label:'Djur',intent:'pet',why:'Jämför ersättningstak, självrisken och undantag.'},
  {id:'travel',label:'Resa',intent:'travel',why:'Kontrollera reseskydd, självrisk och vilka situationer som omfattas.'}
 ]},
 {id:'ekonomi',name:'Lån & ekonomi',question:'Vill du jämföra lånekostnad?',subtitle:'Effektiv ränta och total kostnad',hint:'Att samla eller ta lån är inte alltid billigare. Jämför effektiv ränta, avgifter och total återbetalning.',href:'/ekonomi/',guideHref:'/ekonomi/kostnadskontroll-och-sparande/',guideText:'Börja med dina fasta utgifter',toolHref:'/verktyg/hushallskostnadskollen/',toolText:'Räkna på kända hushållskostnader',icon:WalletCards,accent:'sage',filters:[
  {id:'loan',label:'Jämför privatlån',intent:'loan',why:'Ett lägre månadsbelopp kan bero på längre återbetalningstid och bli dyrare totalt.'}
 ]}
];
const findTrack=(category:JourneyCategory)=>tracks.find(t=>t.id===category)!;
function PartnerLink({p,category,intent,index,compact=false,placement}: {p:ActivePartner;category:JourneyCategory;intent:PartnerIntent;index:number;compact?:boolean;placement:string}){
 const comparison=['Bredbandsval.se','Elskling','Compricer'].includes(p.name)||p.category==='ekonomi';
 const role=p.name==='Insurello'?'Hjälp med försäkringsersättning':comparison?'Jämförelsetjänst':'Direkt hos leverantören';
 return <a className={compact?s.partnerMini:s.partnerCard} href={p.trackingUrl}
   data-partner-type={comparison?'comparison':'provider'}
   data-partner-layout={comparison&&category!=='ekonomi'?'feature':'row'}
  data-partner={p.name} data-category={category} data-intent={intent} data-placement={placement} data-partner-position={index+1}
  target='_blank' rel='sponsored nofollow noopener' data-testid='v10-partner-card'
  onClick={()=>emitAnalyticsEvent('v10_partner_selected',{category,partner:p.name,intent,placement})}>
   <span className={s.cardTop}><span className={s.partnerName}><PartnerIdentity partner={p}/></span><span className={s.sponsored}>ANNONSLÄNK</span></span>
   <span className={s.partnerDescription}><span className={s.partnerRole}>{role}</span>{p.note}</span>
   {compact&&comparison&&p.category!=='ekonomi'&&<span className={s.partnerArtwork} aria-hidden='true'><img src={getCategoryArtwork(category).src} width={1280} height={853} alt='' loading='lazy'/></span>}
   <span className={s.partnerAction}>{p.cta||'Se aktuella erbjudanden & villkor'} <ArrowUpRight size={20} aria-hidden='true'/></span>
 </a>;
}
function useMatches(category:JourneyCategory|null,choiceIndex:number){
 return useMemo(()=>{
  if(!category)return {track:null as Track|null,choice:null as Choice|null,matches:[] as ActivePartner[]};
  const track=findTrack(category);
  const choice=track.filters[Math.min(choiceIndex,track.filters.length-1)];
  const matches=getActivePartners(category,choice.intent,4);
  return {track,choice,matches};
 },[category,choiceIndex]);
}
export function V10Experience(){
 const [category,setCategory]=useState<JourneyCategory|null>(null);
 const [choiceIndex,setChoiceIndex]=useState(0);
 const [showReason,setShowReason]=useState(false);
 const result=useRef<HTMLDivElement>(null);
 const {track,choice,matches}=useMatches(category,choiceIndex);
 const first=matches[0];
 function select(id:JourneyCategory){
  setCategory(id);setChoiceIndex(0);setShowReason(false);
  emitAnalyticsEvent('v10_category_selected',{category:id,placement:'v10_home'});
  if(typeof window!=='undefined'&&window.matchMedia('(max-width: 760px)').matches)
   window.requestAnimationFrame(()=>result.current?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'}));
 }
 function filter(index:number){setChoiceIndex(index);setShowReason(false);if(category)emitAnalyticsEvent('v10_filter_selected',{category,filter:findTrack(category).filters[index].id});}
 return <section className={s.home} aria-label='Hitta rätt jämförelse' data-testid='v10-journey'>
  <div className={s.lightOrb} aria-hidden='true'/>
  <div className={s.wrapper}>
   <div className={s.intro}>
    <div className={s.eyebrow}><Sparkles size={16}/> DET SKA VARA LÄTT ATT VÄLJA SMARTARE</div>
    <h1>Sänk kostnaden.<br/><em>Få mer kvar till livet.</em></h1>
    <p>Välj en kostnad. Se relevanta jämförelsevägar direkt, eller räkna på dina egna siffror när du vill. Utan inloggning.</p>
    <div className={s.introProof}><span><Check size={15}/> Gratis</span><span><Check size={15}/> Ingen inloggning</span><span><ShieldCheck size={15}/> Tydliga annonslänkar</span></div>
   </div>
   <div className={s.playground} data-testid='v10-playground'>
    <div className={s.pickSide}>
     <div className={s.sectionEyebrow}><span className={s.pulse}/> BÖRJA HÄR <span>01 / 02</span></div>
     <h2>Var vill du börja?</h2>
     <p>Välj ett område – nästa steg visas direkt till höger.</p>
     <div className={s.categoryGrid} role='group' aria-label='Välj kostnadsområde'>
      {tracks.map((t)=>{const Icon=t.icon;return <button type='button' key={t.id} aria-pressed={category===t.id}
       className={[s.categoryTile,s[t.accent],category===t.id?s.categoryActive:''].join(' ')}
       onClick={()=>select(t.id)} data-testid={'v10-category-'+t.id}>
        <span className={s.categoryIcon}><Icon size={26} strokeWidth={1.85}/></span>
        <span className={s.categoryText}><strong>{t.name}</strong><small>{t.subtitle}</small></span>
        <span className={s.categoryArrow}><ChevronRight size={20}/></span>
       </button>})}
     </div>
     <div className={s.pickFooter}><Compass size={17}/> Du kan börja utan att veta ditt nuvarande pris.</div>
    </div>
    <div className={s.resultSide} ref={result} data-testid='v10-result'>
     {track&&choice?<div className={s.resultLoaded} key={category}>
      <div className={s.resultEyebrow}><span className={s.pulse}/> DINA ALTERNATIV <span>02 / 02</span></div>
      <h2>{track.question}</h2><p className={s.resultHint}>{track.hint}</p>
      <div className={s.filters} aria-label='Förfina alternativen'>
       {track.filters.map((f,i)=><button type='button' key={f.id} className={i===choiceIndex?s.chipActive:s.chip} aria-pressed={i===choiceIndex} onClick={()=>filter(i)} data-testid={'v10-filter-'+f.id}>{i===choiceIndex&&<Check size={13}/>} {f.label}</button>)}
      </div>
      <div className={s.matchesHead}><span>{matches.length?'JÄMFÖR HOS AKTIVA PARTNERS':'INGA AKTIVA PARTNERALTERNATIV'}</span><span>{Math.min(matches.length,3)} av {matches.length} visas · ingen prisranking</span></div>
      {matches.length?<div className={s.partnerList}>{matches.slice(0,3).map((p,i)=><PartnerLink key={p.name} p={p} category={category!} intent={choice.intent} index={i} placement='v10_home_results'/>)}</div>:
       <div className={s.noMatches}>Vi har inga aktiva partnerlänkar för detta val. <Link href={track.href}>Se våra guider i stället <ArrowRight size={15}/></Link></div>}
      <div className={s.resultRoutes} aria-label='Fördjupa din jämförelse' data-testid='v11-result-routes'>
       <div><span className={s.routesEyebrow}>MER PRECISION NÄR DU VILL</span><strong>Vill du förstå eller räkna först?</strong></div>
       <div className={s.routeLinks}>
        <Link data-testid='v11-route-guide' href={track.guideHref}><Compass size={18}/><span>{track.guideText}<small>Hjälp utan prisuppgifter</small></span><ArrowRight size={17}/></Link>
        <Link data-testid='v11-route-tool' href={track.toolHref}><SlidersHorizontal size={18}/><span>{track.toolText}<small>Frivilligt verktyg eller beräkning</small></span><ArrowRight size={17}/></Link>
       </div>
      </div>
      <div className={s.whyBlock}><button type='button' aria-expanded={showReason} onClick={()=>setShowReason(v=>!v)}><Info size={16}/> Varför visas dessa alternativ? <ChevronDown size={16}/></button>{showReason&&<p>{choice.why} Urvalet omfattar bara våra aktiva partners, inte hela marknaden. Det är inte en prisranking.</p>}</div>
      <div className={s.nextLine}><Link href={track.href}>Fler alternativ och guider inom {track.name} <ArrowRight size={15}/></Link><button type='button' onClick={()=>{setCategory(null);setChoiceIndex(0)}}><RotateCcw size={14}/> Välj annat</button></div>
     </div>:<div className={s.blank} data-testid='v11-empty-state'>
       <div className={s.blankEyebrow}><Sparkles size={17}/> ETT BRA BESLUT BÖRJAR HÄR</div>
       <h2>Du väljer vad som spelar roll.<br/><em>Vi visar vad du kan göra.</em></h2>
       <p>Du behöver inte leta efter rätt guide först. Välj exempelvis el eller bredband och få verkliga nästa steg utan formulär.</p>
       <div className={s.blankPreview} aria-label='Så fungerar jämförelsen'>
        <span><Check size={17}/> Välj ett område</span>
        <span><ArrowRight size={17}/> Se utvalda jämförelsevägar</span>
        <span><SlidersHorizontal size={17}/> Räkna exakt om du har uppgifterna</span>
       </div>
       <Link className={s.blankHelper} href='/verktyg/hushallskostnadskollen/'>Har du redan koll på dina kostnader? Räkna här <ArrowRight size={18}/></Link>
     </div>}
    </div>
   </div>
   <div className={s.disclosure}><ShieldCheck size={17}/><span>Vi är en kostnadsnavigator, inte en fullständig prisdatabas. Utvalda partnerlänkar är kommersiella. Vi lovar inga besparingar och du ser aktuella priser hos partnern.</span></div>
   <div className={s.nextSection}><div><span className={s.nextKicker}>UTFORSKA MER</span><h2>Nyfiken på hela hushållet?</h2><p>Räkna på kostnader du känner till eller ta hjälp av våra guider. Det är frivilligt – en partner finns redan ett klick bort ovanför.</p></div><Link href='/verktyg/hushallskostnadskollen/'>Prova kostnadskollen <ArrowRight size={17}/></Link></div>
  </div>
  {track&&first&&<a className={s.mobileDock} href={first.trackingUrl} target='_blank' rel='sponsored nofollow noopener'
   data-partner={first.name} data-category={category!} data-intent={choice?.intent||'compare'} data-placement='v10_mobile_dock' data-partner-position='1' data-testid='v10-bottom-cta'>
   <span><small>JÄMFÖR DIREKT</small><strong>{first.name}</strong></span><span className={s.dockButton}>Se alternativ <ArrowUpRight size={17}/></span>
  </a>}
 </section>;
}
export function V10CategoryFastLane({category}:{category:JourneyCategory}){
 const track=findTrack(category);
 const [choiceIndex,setChoiceIndex]=useState(0);
 const [reason,setReason]=useState(false);
 const {choice,matches}=useMatches(category,choiceIndex);
 return <section className={s.lane} aria-label={'Snabbjämför '+track.name} data-testid='v10-category-lane'>
  <div className={s.lanePanel}>
   <div className={s.lanePanelHeading}><span>AKTIVA ALTERNATIV</span><strong>Utvalda partnerlänkar – inte hela marknaden</strong></div>
   <div className={s.laneFilters} aria-label='Välj jämförelsebehov'>{track.filters.map((f,i)=><button type='button' aria-pressed={i===choiceIndex} key={f.id} onClick={()=>{setChoiceIndex(i);setReason(false)}} className={i===choiceIndex?s.chipActive:s.chip}>{f.label}{i===choiceIndex&&<Check size={15}/>}</button>)}</div>
   <div className={s.laneGrid}>{matches.length?matches.slice(0,3).map((p,i)=><PartnerLink key={p.name} p={p} category={category} intent={choice!.intent} index={i} placement='v10_category_lane' compact/>):
    <div className={s.laneEmpty}>Inga aktiva partneralternativ för valet. <Link href={track.guideHref}>Få hjälp i guiden <ArrowRight size={15}/></Link></div>}</div>
   <div className={s.laneTrust}><span><ShieldCheck size={17}/> Kontrollera aktuellt pris, villkor och tillgänglighet hos partnern.</span><button type='button' aria-expanded={reason} onClick={()=>setReason(v=>!v)}><Info size={17}/> Så väljs alternativen</button></div>
   {reason&&<p className={s.laneWhy}>{choice?.why} Vi visar bara partners som är markerade som aktiva i vår partnerförteckning, inte en prisranking. En jämförelsetjänst skiljer sig från en enskild leverantör.</p>}
  </div>
  <div className={s.laneIntro}>
   <div className={s.laneHeader}>
    <span className={s.laneKicker}><Sparkles size={17}/> DIN VÄG VIDARE</span>
    <h2>Vill du jämföra redan nu?</h2>
    <p>Här börjar du utan en enda uppgift. Se aktiva samarbetspartner, läs på i lugn och ro eller prova ett relevant verktyg.</p>
   </div>
   <div className={s.laneDecision}>
    <span><Check size={17}/> Inga påhittade offerter</span>
    <span><Check size={17}/> Egen beräkning är frivillig</span>
    <span><Check size={17}/> Annonslänkar är markerade</span>
   </div>
   <div className={s.laneExplore} aria-label='Välj hjälp eller egna beräkningar'>
    <Link data-testid='v11-lane-tool' href={track.toolHref}><SlidersHorizontal size={20}/><span><strong>{track.toolText}</strong><small>Jag vill prova ett verktyg</small></span><ArrowRight size={18}/></Link>
    <Link data-testid='v11-lane-guide' href={track.guideHref}><Compass size={20}/><span><strong>{track.guideText}</strong><small>Jag vill förstå först</small></span><ArrowRight size={18}/></Link>
   </div>
  </div>
 </section>;
}
