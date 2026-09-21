import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Compass, Gauge, Sparkles } from 'lucide-react';
import { getActivePartners, type PartnerCategory, type PartnerIntent } from '../lib/partners';

type Props={category:PartnerCategory;compact?:boolean;intent?:PartnerIntent};

const config={
  bredband:{title:'Vad vill du göra nu?',intro:'Gå direkt till jämförelsen eller få hjälp att välja rätt hastighet först.',direct:'Jämför bredband',help:'Hjälp mig välja hastighet',helpHref:'/bredband/vilken-hastighet-behover-jag/',fallback:'/bredband/bredband-pa-min-adress/'},
  mobil:{title:'Vad vill du göra nu?',intro:'Jämför abonnemang direkt eller ringa in rätt surfmängd först.',direct:'Jämför mobilabonnemang',help:'Hjälp mig välja surf',helpHref:'/mobil/hur-mycket-surf-behover-jag/',fallback:'/mobil/billigaste-mobilabonnemanget/'},
  forsakring:{title:'Vad vill du göra nu?',intro:'Jämför rätt typ av försäkring eller kontrollera skyddet först.',direct:'Jämför försäkring',help:'Kontrollera mitt skydd',helpHref:'/forsakring/hemforsakring-skyddskoll/',fallback:'/forsakring/jamfor-forsakring/'},
  el:{title:'Vad vill du göra nu?',intro:'Jämför elalternativ direkt eller välj avtalsform först.',direct:'Jämför elavtal',help:'Hjälp mig välja avtalsform',helpHref:'/elavtal/vilket-elavtal-passar-mig/',fallback:'/elavtal/jamfor-elavtal/'},
  ekonomi:{title:'Vad vill du göra nu?',intro:'Jämför låneerbjudanden eller börja med att se hushållets helhet.',direct:'Jämför privatlån',help:'Se hushållets kostnader',helpHref:'/verktyg/hushallskostnadskollen/',fallback:'/ekonomi/#jamfor-lan'},
} as const;

export default function DecisionGateway({category,compact=false,intent}:Props){
  const cfg=config[category];
  const active=getActivePartners(category,intent,3);
  const onePartner=active.length===1?active[0]:null;
  const directLabel=category==='forsakring'&&intent==='pet'?'Jämför djurförsäkring':category==='forsakring'&&intent==='home'?'Jämför hemförsäkring':cfg.direct;
  const directHref=onePartner?onePartner.trackingUrl:active.length>1?'#partners':cfg.fallback;

  return <section className={`decisionGateway decisionGatewaySimple ${compact?'decisionGatewayCompact':''}`}>
    <div className='gatewayHead'><span><Sparkles size={14}/> NÄSTA STEG</span><h2>{cfg.title}</h2><p>{cfg.intro}</p></div>
    <div className='gatewayPaths gatewayPathsSimple'>
      {onePartner?
        <a className='gatewayPath gatewayDirect' href={directHref} data-partner={onePartner.name} data-category={category} data-intent={intent||'unspecified'} data-placement='gateway_primary' target='_blank' rel='sponsored nofollow noopener'>
          <span className='gatewayIcon'><Gauge size={20}/></span><div><small>JÄMFÖR NU</small><strong>{directLabel}</strong><p>Fortsätt hos {onePartner.name} för aktuella villkor.</p></div><ArrowUpRight size={20}/>
        </a>:
        <a className='gatewayPath gatewayDirect' href={directHref}>
          <span className='gatewayIcon'><Gauge size={20}/></span><div><small>JÄMFÖR NU</small><strong>{directLabel}</strong><p>{active.length>1?`${active.length} relevanta partneralternativ visas längre ned på sidan.`:'Gå vidare till jämförelsen och se vad som är relevant för ditt behov.'}</p></div><ArrowRight size={20}/>
        </a>}
      <Link className='gatewayPath' href={cfg.helpHref}><span className='gatewayIcon'><Compass size={20}/></span><div><small>HJÄLP MIG VÄLJA</small><strong>{cfg.help}</strong><p>Några snabba frågor hjälper dig att välja rätt nivå innan du jämför pris.</p></div><ArrowRight size={20}/></Link>
    </div>
    <p className='gatewayFine'>Kommersiella länkar märks tydligt. Urvalet omfattar inte hela marknaden.</p>
  </section>;
}
