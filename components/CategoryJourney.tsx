import { useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BadgeHelp, BookOpenText, CircleCheck, Compass, Sparkles } from 'lucide-react';
import { emitAnalyticsEvent } from '../lib/clientAttribution';
import type { PartnerCategory } from '../lib/partners';
import s from '../styles/CategoryJourney.module.css';

type Mode='help'|'compare'|'understand';
type Props={category:PartnerCategory;compareHref:string;helpHref:string;understandHref:string};

const config:Record<PartnerCategory,{
 label:string;
 help:string;compare:string;understand:string;
 helpDescription:string;compareDescription:string;understandDescription:string;
 helpAction:string;compareAction:string;understandAction:string;
}>={
 bredband:{label:'bredband',help:'Hitta rätt hastighet',compare:'Jämför alternativen',understand:'Förstå vad som finns',helpDescription:'Få hjälp att ringa in en rimlig hastighet innan du väljer operatör.',compareDescription:'Se relevanta alternativ och kontrollera utbudet på din adress hos leverantören.',understandDescription:'Läs varför tillgänglighet, teknik och pris kan skilja sig mellan adresser.',helpAction:'Hjälp mig välja hastighet',compareAction:'Se bredbandsalternativ',understandAction:'Förstå bredband på min adress'},
 el:{label:'elavtal',help:'Välj rätt avtalsform',compare:'Jämför elavtal',understand:'Förstå min elfaktura',helpDescription:'Ett kort val hjälper dig förstå skillnaden mellan fast, rörligt och kvartspris.',compareDescription:'Se jämförelsevägar och relevanta partners. Kontrollera slutligt pris och villkor hos dem.',understandDescription:'Se vilka rader på elfakturan du faktiskt kan påverka och jämföra.',helpAction:'Hjälp mig välja avtalsform',compareAction:'Se våra elalternativ',understandAction:'Så läser du elfakturan'},
 mobil:{label:'mobil',help:'Hitta min surfmängd',compare:'Jämför mobilabonnemang',understand:'Förstå familjepris',helpDescription:'Välj utifrån hur du använder mobilen i vardagen, utan att ange ditt nuvarande pris.',compareDescription:'Hitta relevanta operatörer och kontrollera täckning, avgifter och kampanjpris.',understandDescription:'Se hur familjeabonnemang och separata abonnemang skiljer sig åt.',helpAction:'Hitta rätt surfmängd',compareAction:'Se mobilalternativ',understandAction:'Förstå familjeabonnemang'},
 forsakring:{label:'försäkring',help:'Kontrollera mitt skydd',compare:'Se försäkringsalternativ',understand:'Förstå bostadsrättstillägg',helpDescription:'Börja med att förstå vilket skydd som behövs – du kan jämföra pris senare.',compareDescription:'Se våra försäkringsalternativ. Den faktiska premien bestäms hos bolaget.',understandDescription:'Undvik dubbelt skydd: se vad föreningens försäkring kan omfatta.',helpAction:'Kontrollera hemskydd',compareAction:'Se försäkringsalternativ',understandAction:'Förstå bostadsrättstillägg'},
 ekonomi:{label:'ekonomi',help:'Få koll på mina kostnader',compare:'Jämför lånealternativ',understand:'Förstå lånekostnaden',helpDescription:'Få överblick över de utgifter du känner till innan du tar nya beslut.',compareDescription:'Jämför totalkostnad och effektiv ränta, inte bara månadsbetalning.',understandDescription:'Lär dig varför lägre månadskostnad inte alltid betyder billigare lån.',helpAction:'Räkna hushållets kostnader',compareAction:'Se lånejämförelser',understandAction:'Förstå samlingslån'}
};

const options: Array<{key:Mode;label:string;icon:typeof Compass;small:string}>= [
 {key:'help',label:'Jag vill få hjälp',icon:Compass,small:'Enkel väg'},
 {key:'compare',label:'Jag vill jämföra',icon:CircleCheck,small:'Direkt vidare'},
 {key:'understand',label:'Jag vill förstå',icon:BookOpenText,small:'Lär mig först'},
];

export default function CategoryJourney({category,compareHref,helpHref,understandHref}:Props){
 const [mode,setMode]=useState<Mode>('help');
 const outcomeRef=useRef<HTMLDivElement>(null);
 const cfg=config[category];
 const active={
  help:{title:cfg.help,body:cfg.helpDescription,label:cfg.helpAction,href:helpHref},
  compare:{title:cfg.compare,body:cfg.compareDescription,label:cfg.compareAction,href:compareHref},
  understand:{title:cfg.understand,body:cfg.understandDescription,label:cfg.understandAction,href:understandHref},
 }[mode];
 const choose=(next:Mode)=>{
   setMode(next);
   emitAnalyticsEvent('category_journey_mode_selected',{category,mode:next});
   // On a narrow phone the fixed bottom category dock may cover the newly
   // changed result. Only scroll when the result is actually obscured; never
   // hijack an already visible choice or animate reduced-motion visitors.
   if(typeof window!=='undefined'&&window.matchMedia('(max-width: 650px)').matches){
     window.requestAnimationFrame(()=>{
       const panel=outcomeRef.current;
       if(!panel)return;
       const bottomDock=document.querySelector<HTMLElement>('nav[aria-label="Snabbnavigering"]');
       const navY=bottomDock?.getBoundingClientRect().top??window.innerHeight;
       const usableBottom=Math.min(navY,window.innerHeight)-12;
       const hiddenBy=panel.getBoundingClientRect().bottom-usableBottom;
       if(hiddenBy>2){
         const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
         window.scrollBy({top:hiddenBy,behavior:reduceMotion?'instant':'smooth'});
       }
     });
   }
 };
 return <section className={s.root} aria-label={'Snabbstart för '+cfg.label} data-testid={'category-journey-'+category}>
  <div className={s.top}><div className={s.heading}><span className={s.spark}><Sparkles size={17}/></span><div><p>DIN SNABBSTART</p><h2>Vad vill du göra?</h2></div></div><span className={s.noLogin}>Ingen inloggning. Inga långa formulär.</span></div>
  <div className={s.choices} role='group' aria-label='Välj hur du vill gå vidare'>
   {options.map(item=>{
    const Icon=item.icon;
    return <button type='button' key={item.key} className={[s.choice,mode===item.key?s.chosen:''].join(' ')}
       aria-pressed={mode===item.key} aria-controls={'category-journey-next-'+category}
       onClick={()=>choose(item.key)}>
     <span className={s.choiceIcon}><Icon size={22}/></span>
     <span><strong>{item.label}</strong><small>{item.small}</small></span>
     <span className={s.selector} aria-hidden='true'/>
    </button>;
   })}
  </div>
  <div ref={outcomeRef} className={s.outcome} id={'category-journey-next-'+category} aria-live='polite' data-testid='category-journey-result'>
   <div className={s.outcomeContent}>
    <span className={s.outcomeCaption}><BadgeHelp size={14}/> NÄSTA STEG FÖR DIG</span>
    <h3>{active.title}</h3><p>{active.body}</p>
   </div>
   {active.href.startsWith('#')?
    <a className={s.next} href={active.href} onClick={()=>emitAnalyticsEvent('category_journey_continue',{category,mode})}>{active.label}<ArrowRight size={19}/></a>:
    <Link className={s.next} href={active.href} onClick={()=>emitAnalyticsEvent('category_journey_continue',{category,mode})}>{active.label}<ArrowRight size={19}/></Link>}
  </div>
  <p className={s.note}>Vägledningen är gratis. Jämförelser och aktuella priser kontrolleras hos respektive leverantör.</p>
 </section>;
}
