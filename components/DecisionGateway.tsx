import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Compass, Gauge, Sparkles } from 'lucide-react';
import { getActivePartners, type PartnerCategory, type PartnerIntent } from '../lib/partners';

type Props={category:PartnerCategory;compact?:boolean;intent?:PartnerIntent;currentPath?:string};

const config={
  bredband:{title:'Vad vill du göra nu?',intro:'Få en relevant startpunkt utifrån adress och teknik eller välj rätt hastighet först.',direct:'Hitta relevanta bredbandsalternativ',help:'Hjälp mig välja hastighet',helpHref:'/bredband/vilken-hastighet-behover-jag/',fallback:'/bredband/billigaste-bredbandet/'},
  mobil:{title:'Vad vill du göra nu?',intro:'Få en kortlista på två frågor eller ringa in rätt surfmängd först.',direct:'Hitta relevanta abonnemang',help:'Hjälp mig välja surf',helpHref:'/mobil/hur-mycket-surf-behover-jag/',fallback:'/mobil/billigaste-mobilabonnemanget/'},
  forsakring:{title:'Vad vill du göra nu?',intro:'Visa bara relevanta försäkringspartners eller kontrollera skyddet först.',direct:'Hitta relevanta försäkringsalternativ',help:'Kontrollera mitt skydd',helpHref:'/forsakring/hemforsakring-skyddskoll/',fallback:'/forsakring/jamfor-forsakring/'},
  el:{title:'Vad vill du göra nu?',intro:'Få en kortlista utifrån förbrukning och hur du vill jämföra – eller välj avtalsform först.',direct:'Hitta relevanta elavtal',help:'Hjälp mig välja avtalsform',helpHref:'/elavtal/vilket-elavtal-passar-mig/',fallback:'/elavtal/jamfor-elavtal/'},
  ekonomi:{title:'Vad vill du göra nu?',intro:'Få en relevant väg till lånejämförelser eller börja med hushållets helhet.',direct:'Hitta relevanta lånejämförelser',help:'Se hushållets kostnader',helpHref:'/verktyg/hushallskostnadskollen/',fallback:'/ekonomi/jamfor-privatlan/'},
} as const;

export default function DecisionGateway({category,compact=false,intent,currentPath}:Props){
  const cfg=config[category];
  const active=getActivePartners(category,intent,3);
  const onePartner=active.length===1?active[0]:null;
  const directLabel=category==='forsakring'&&intent==='pet'?'Hitta relevanta djurförsäkringar':category==='forsakring'&&intent==='home'?'Hitta relevant hemförsäkring':cfg.direct;
  const helpLabel=category==='forsakring'&&intent==='pet'?'Så jämför du djurskyddet':cfg.help;
  const helpHref=category==='forsakring'&&intent==='pet'?'/forsakring/jamfor-forsakring/':cfg.helpHref;
  const helpText=category==='forsakring'&&intent==='pet'?'Se vilka delar av skyddet du bör jämföra innan du tar in pris för ditt djur.':'Några snabba frågor hjälper dig att välja rätt nivå innan du jämför pris.';
  const resolvedFallback=category==='forsakring'&&intent==='home'?'/forsakring/jamfor-hemforsakring/':category==='forsakring'&&intent==='pet'?'/forsakring/djurforsakring/':cfg.fallback;
  const fallbackPath=resolvedFallback.split('#')[0];
  const samePage=Boolean(currentPath&&fallbackPath===currentPath.split('#')[0]);
  const directHref=onePartner?onePartner.trackingUrl:(active.length>1&&samePage?`${currentPath}#partners`:resolvedFallback);

  return <section className={`decisionGateway decisionGatewaySimple ${compact?'decisionGatewayCompact':''}`}>
    <div className='gatewayHead'><span><Sparkles size={14}/> NÄSTA STEG</span><h2>{cfg.title}</h2><p>{cfg.intro}</p></div>
    <div className='gatewayPaths gatewayPathsSimple'>
      {onePartner?
        <a className='gatewayPath gatewayDirect' href={directHref} data-partner={onePartner.name} data-category={category} data-intent={intent||'unspecified'} data-placement='gateway_primary' target='_blank' rel='sponsored nofollow noopener'>
          <span className='gatewayIcon'><Gauge size={20}/></span><div><small>JÄMFÖR NU</small><strong>{directLabel}</strong><p>Fortsätt hos {onePartner.name} för aktuella villkor.</p></div><ArrowUpRight size={20}/>
        </a>:
        <a className='gatewayPath gatewayDirect' href={directHref}>
          <span className='gatewayIcon'><Gauge size={20}/></span><div><small>JÄMFÖR NU</small><strong>{directLabel}</strong><p>{active.length>1?(samePage?(category==='mobil'?'Svara på två frågor och få tre relevanta partneralternativ.':category==='bredband'?'Svara på två frågor om adress och teknik och få en bättre startpunkt.':category==='el'?'Svara på två frågor och få en relevant kortlista.':category==='ekonomi'?'Svara på två frågor och få en relevant kortlista av jämförelsetjänster.':'Se bara partners som matchar rätt typ av skydd.'):'Gå vidare till jämförelsesidan där de relevanta alternativen samlas tydligt.'):'Gå vidare till jämförelsen och se vad som är relevant för ditt behov.'}</p></div><ArrowRight size={20}/>
        </a>}
      <Link className='gatewayPath' href={helpHref}><span className='gatewayIcon'><Compass size={20}/></span><div><small>HJÄLP MIG VÄLJA</small><strong>{helpLabel}</strong><p>{helpText}</p></div><ArrowRight size={20}/></Link>
    </div>
    <p className='gatewayFine'>Kommersiella länkar märks tydligt. Urvalet omfattar inte hela marknaden.</p>
  </section>;
}
