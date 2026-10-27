import Head from 'next/head';
import Link from 'next/link';
import {useState} from 'react';
import {ArrowLeft,ArrowRight,ArrowUpRight,CheckCircle2,ChevronRight,PiggyBank,Wifi,Zap,Smartphone,ShieldCheck,Sparkles} from 'lucide-react';
import {getActivePartners,type PartnerCategory,type PartnerIntent} from '../../lib/partners';
import s from '../../styles/V6Variants.module.css';
type Area='bredband'|'el'|'mobil'|'forsakring';
type Filter={key:string;label:string;intent:PartnerIntent;explain:string};
const categories:{key:Area;label:string;description:string;defaultIntent:PartnerIntent;url:string;help:string;filters:Filter[]}[]=[
 {key:'bredband',label:'Bredband',description:'Utbud och hastighet där du bor',defaultIntent:'compare',url:'/bredband/',help:'Kontrollera adressen och jämför samma hastighet, ordinarie pris och bindningstid.',filters:[
  {key:'compare',label:'Jämför flera',intent:'compare',explain:'Starta med en jämförelseväg och kontrollera tillgänglighet på adressen.'},
  {key:'fiber',label:'Fiber',intent:'fiber',explain:'Visar partners med fiberalternativ; adressen avgör tillgängligheten.'},
  {key:'mobile',label:'Mobilt / 5G',intent:'mobile-broadband',explain:'Visar partneralternativ för mobilt bredband. Kontrollera täckning och datavillkor.'}
 ]},
 {key:'el',label:'El',description:'Pris, avgifter och avtalsform',defaultIntent:'compare',url:'/elavtal/',help:'Jämför samma årsförbrukning och räkna med både påslag och fasta avgifter.',filters:[
  {key:'compare',label:'Jämför avtal',intent:'compare',explain:'Se våra aktiva elpartners. Kontrollera elområde, förbrukning och aktuella villkor.'},
  {key:'direct',label:'Se elbolag',intent:'electricity',explain:'Se aktiva partners för elhandel. Ordningen är inte en prisranking.'}
 ]},
 {key:'mobil',label:'Mobil',description:'Surf, täckning och månadskostnad',defaultIntent:'compare',url:'/mobil/',help:'Jämför surfbehov, nät och ordinarie pris efter eventuella kampanjer.',filters:[
  {key:'compare',label:'Alla behov',intent:'compare',explain:'Utvalda aktiva mobilpartners. Kontrollera faktiskt surfbehov och täckning.'},
  {key:'family',label:'Familj',intent:'family',explain:'Partners med relevanta familjealternativ. Jämför kostnaden för samtliga abonnemang.'},
  {key:'data',label:'Surf',intent:'data',explain:'Partners med surfalternativ. Rätt surfmängd och nät avgör värdet.'},
  {key:'free',label:'Utan bindningstid',intent:'no-binding',explain:'Partners med alternativ att jämföra utan lång bindningstid.'}
 ]},
 {key:'forsakring',label:'Försäkring',description:'Skydd, självrisk och premie',defaultIntent:'home',url:'/forsakring/',help:'Jämför alltid lika omfattning och självrisk – inte bara månadspremien.',filters:[
  {key:'home',label:'Hem',intent:'home',explain:'Aktiva partners inom hemförsäkring. Kontrollera skyddsnivå och undantag.'},
  {key:'pet',label:'Djur',intent:'pet',explain:'Aktiva partners inom djurförsäkring. Jämför självrisk, ersättningstak och villkor.'}
 ]}
];
const icons={bredband:Wifi,el:Zap,mobil:Smartphone,forsakring:ShieldCheck};
export default function V6FastCompare(){
 const [area,setArea]=useState<Area|null>(null);
 const [filterKey,setFilterKey]=useState<string|null>(null);
 const cfg=categories.find(x=>x.key===area);
 const filter=cfg?.filters.find(f=>f.key===filterKey)||cfg?.filters[0];
 const intent=filter?.intent||cfg?.defaultIntent;
 const partners=cfg?getActivePartners(cfg.key as PartnerCategory,intent,3):[];
 function pickArea(x:Area){setArea(x);setFilterKey(null)}
 return <><Head><title>V6 koncept C – direktjämförelse | Sänk Kostnaden</title><meta name='robots' content='noindex,nofollow,noarchive'/></Head>
 <main className={s.shell} data-testid='v6-fast'>
  <header className={s.header}><Link href='/' className={s.brand}><PiggyBank size={20}/> Sänk Kostnaden</Link><Link href='/experiments/v6-koncept/' className={s.hubBack}><ArrowLeft size={16}/> Alla koncept</Link></header>
  <div className={s.fastWrap}>
    <p className={s.eyebrow}><Sparkles size={16}/> KONCEPT C · DIREKTVÄGEN</p>
    <h1>Välj. Jämför. Gå vidare.</h1>
    <p className={s.lead}>Inga långa frågor. Välj vad du vill jämföra och se relevanta aktiva partneralternativ direkt. Finjustera bara om du vill.</p>
    <div className={s.fastLayout}>
      <aside className={s.fastMenu} aria-label='Kategorier'>
       <span className={s.fastKicker}>VAD VILL DU JÄMFÖRA?</span>
       <div className={s.fastCategories}>{categories.map(c=>{const Icon=icons[c.key];return <button type='button' className={area===c.key?s.fastActive:s.fastCategory} onClick={()=>pickArea(c.key)} aria-pressed={area===c.key} data-testid={'v6-fast-pick-'+c.key} key={c.key}>
        <Icon size={22}/><span><strong>{c.label}</strong><small>{c.description}</small></span><ChevronRight size={18}/>
       </button>})}</div>
      </aside>
      <section className={s.fastResults} aria-label='Aktiva alternativ'>
       {!cfg?<div className={s.fastEmpty} data-testid='v6-fast-empty'><div><CheckCircle2 size={35}/></div><h2>Första valet tar en sekund.</h2><p>Välj ett kostnadsområde så visas jämförelsealternativen direkt, utan att du måste fylla i ett formulär.</p><span>Välj kategori till vänster <ArrowRight size={17}/></span></div>:
       <div data-testid='v6-fast-result'>
        <div className={s.fastResultHeading}><span>AKTIVA ALTERNATIV</span><h2>Jämför {cfg.label.toLowerCase()}</h2><p>{cfg.help}</p></div>
        <div className={s.fastFilters} role='group' aria-label={'Avgränsa '+cfg.label}>{cfg.filters.map(f=><button type='button' className={filter?.key===f.key?s.filterActive:s.filter} onClick={()=>setFilterKey(f.key)} aria-pressed={filter?.key===f.key} data-testid={'v6-fast-filter-'+f.key} key={f.key}>{f.label}</button>)}</div>
        <p className={s.filterExplain}>{filter?.explain}</p>
        {partners.length?<div className={s.partnerCards}>{partners.map((p,i)=><article className={s.partnerCard} key={p.name} data-testid='v6-fast-partner'>
         <div className={s.partnerTop}><span className={s.commercial}>PARTNERLÄNK</span><span>{i+1} / {partners.length}</span></div>
         <h3>{p.name}</h3><p>{p.note}</p>
         <a href={p.trackingUrl} rel='sponsored nofollow noopener' target='_blank' data-partner={p.name} data-category={p.category} data-intent={intent||'compare'} data-placement='v6_fast_prototype' data-partner-position={i+1}>Se villkor hos {p.name}<ArrowUpRight size={16}/></a>
         </article>)}</div>:<div className={s.fastNoResults}>Inga aktiva partners i den här avgränsningen. <Link href={cfg.url}>Se översikten istället <ArrowRight size={15}/></Link></div>}
        <p className={s.fastDisclaimer}>Detta är ett urval av aktiva partners, inte hela marknaden. Vi kan få provision om du blir kund. Listan är inte en ranking och vi visar inga obekräftade priser.</p>
        <Link className={s.fastGuide} href={cfg.url}>Jag vill förstå mer innan jag väljer <ArrowRight size={16}/></Link>
       </div>}
      </section>
    </div>
    <p className={s.footNote}><ShieldCheck size={17}/> Här testas om direktval är enklare än en frågeguide. Aktiva partnerlänkar leder ut till leverantörens aktuella villkor. Varken lägsta pris eller möjlig besparing påstås.</p>
  </div>
 </main></>;
}