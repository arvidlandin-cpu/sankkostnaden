import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Compass, Gauge, Sparkles } from 'lucide-react';
import { getPartners, type PartnerCategory } from '../lib/partners';

type Props = { category: PartnerCategory; compact?: boolean; };

const config = {
  bredband: {
    title: 'Hur vill du gå vidare med bredbandet?',
    intro: 'Välj snabbaste vägen, få hjälp att välja nivå eller läs vidare först.',
    direct: 'Se bredband på min adress',
    help: 'Hjälp mig välja hastighet',
    helpHref: '/bredband/vilken-hastighet-behover-jag/',
    read: 'Läs bredbandsguiden',
    readHref: '/bredband/',
  },
  mobil: {
    title: 'Hur vill du hitta rätt mobilabonnemang?',
    intro: 'Jämför direkt eller låt oss först ringa in surf och behov.',
    direct: 'Se aktuella mobilalternativ',
    help: 'Hjälp mig välja surf',
    helpHref: '/mobil/hur-mycket-surf-behover-jag/',
    read: 'Jämför billiga abonnemang',
    readHref: '/mobil/billigaste-mobilabonnemanget/',
  },
  forsakring: {
    title: 'Vill du jämföra nu eller förstå skyddet först?',
    intro: 'För djurförsäkring kan du gå direkt till pris eller läsa vad som påverkar skydd och självrisk.',
    direct: 'Se aktuella alternativ',
    help: 'Jämför djurförsäkring',
    helpHref: '/forsakring/djurforsakring/',
    read: 'Läs försäkringsguiden',
    readHref: '/forsakring/',
  },
  el: {
    title: 'Hitta rätt väg till ett billigare elavtal',
    intro: 'Våra elpartners är inte aktiverade ännu. Under tiden hjälper vi dig välja avtalsform och jämföra rätt kostnader.',
    direct: 'Jämför elavtal',
    help: 'Hjälp mig välja avtalsform',
    helpHref: '/elavtal/vilket-elavtal-passar-mig/',
    read: 'Se billigaste elavtalet',
    readHref: '/elavtal/billigaste-elavtalet/',
  },
} as const;

export default function DecisionGateway({ category, compact = false }: Props) {
  const cfg = config[category];
  const active = getPartners(category).filter(p => p.trackingUrl);
  const primary = active[0];

  return <section className={`decisionGateway ${compact ? 'decisionGatewayCompact' : ''}`}>
    <div className='gatewayHead'><span><Sparkles size={14}/> SÄNK KOSTNADEN</span><h2>{cfg.title}</h2><p>{cfg.intro}</p></div>
    <div className='gatewayPaths'>
      {primary ? <a className='gatewayPath gatewayDirect' href={primary.trackingUrl!} target='_blank' rel='sponsored nofollow noopener'>
        <span className='gatewayIcon'><Gauge size={20}/></span><div><small>SNABBASTE VÄGEN</small><strong>{cfg.direct}</strong><p>{active.length > 1 ? `Gå vidare till våra aktiva partners: ${active.map(p=>p.name).join(' och ')}.` : `Fortsätt hos ${primary.name} för aktuellt pris och villkor.`}</p></div><ArrowUpRight size={20}/>
      </a> : <Link className='gatewayPath gatewayDirect' href='/elavtal/jamfor-elavtal/'><span className='gatewayIcon'><Gauge size={20}/></span><div><small>JÄMFÖR RÄTT</small><strong>{cfg.direct}</strong><p>Förbered jämförelsen nu. Partnerlänkar aktiveras först när samarbetet är godkänt.</p></div><ArrowRight size={20}/></Link>}
      <Link className='gatewayPath' href={cfg.helpHref}><span className='gatewayIcon'><Compass size={20}/></span><div><small>PERSONLIGARE VÄG</small><strong>{cfg.help}</strong><p>Några snabba val ger dig rätt nivå innan du går vidare.</p></div><ArrowRight size={20}/></Link>
      <Link className='gatewayPath gatewayRead' href={cfg.readHref}><div><small>JAG VILL LÄSA FÖRST</small><strong>{cfg.read}</strong></div><ArrowRight size={18}/></Link>
    </div>
    {active.length > 1 && <div className='gatewayPartners'><span>Vill du välja partner direkt?</span>{active.map(p=><a key={p.name} href={p.trackingUrl!} target='_blank' rel='sponsored nofollow noopener'>{p.name} <ArrowUpRight size={14}/></a>)}</div>}
    <p className='gatewayFine'>Partnerlänkar är kommersiella. Vi visar bara aktiva samarbeten och urvalet omfattar inte hela marknaden.</p>
  </section>;
}
