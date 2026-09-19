import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Compass, Gauge, Sparkles } from 'lucide-react';
import { getActivePartners, type PartnerCategory, type PartnerIntent } from '../lib/partners';

type Props = { category: PartnerCategory; compact?: boolean; intent?: PartnerIntent; };

const config = {
  bredband:{title:'Hur vill du gå vidare med bredbandet?',intro:'Se vad du kan beställa, välj rätt hastighet eller gå direkt till jämförelsen.',direct:'Jämför bredband på min adress',help:'Hjälp mig välja hastighet',helpHref:'/bredband/vilken-hastighet-behover-jag/',read:'Läs bredbandsguiden',readHref:'/bredband/'},
  mobil:{title:'Hur vill du hitta rätt mobilabonnemang?',intro:'Gå direkt till Telia eller Vimla, eller ringa in surf och behov först.',direct:'Se aktuella mobilalternativ',help:'Hjälp mig välja surf',helpHref:'/mobil/hur-mycket-surf-behover-jag/',read:'Jämför billiga abonnemang',readHref:'/mobil/billigaste-mobilabonnemanget/'},
  forsakring:{title:'Jämför djurförsäkring direkt',intro:'Hämta pris hos Lassie och Sveland eller läs vad som påverkar skydd och självrisk.',direct:'Hämta pris på djurförsäkring',help:'Jämför djurförsäkring',helpHref:'/forsakring/djurforsakring/',read:'Läs försäkringsguiden',readHref:'/forsakring/'},
  el:{title:'Hitta rätt väg till ett billigare elavtal',intro:'Elpartners aktiveras först när samarbetena är godkända. Under tiden hjälper vi dig jämföra rätt.',direct:'Jämför elavtal',help:'Hjälp mig välja avtalsform',helpHref:'/elavtal/vilket-elavtal-passar-mig/',read:'Se billigaste elavtalet',readHref:'/elavtal/billigaste-elavtalet/'}
} as const;

const partnerClass=(name:string)=>name==='Telia'?'brandTelia':name==='Vimla'?'brandVimla':name==='Bredbandsval.se'?'brandBredbandsval':name==='Lassie'?'brandLassie':name.startsWith('Sveland')?'brandSveland':'';

export default function DecisionGateway({category,compact=false,intent}:Props){
 const cfg=config[category], active=getActivePartners(category,intent);
 return <section className={`decisionGateway ${compact?'decisionGatewayCompact':''}`}>
  <div className='gatewayHead'><span><Sparkles size={14}/> HITTA DIN SNABBASTE VÄG</span><h2>{cfg.title}</h2><p>{cfg.intro}</p></div>
  {active.length>0 && <div className='partnerExpress'><div className='partnerExpressLabel'>AKTIVA PARTNERS · GÅ DIREKT TILL PRIS</div><div className='partnerExpressGrid'>{active.map(p=><a className={`partnerExpressCard ${partnerClass(p.name)}`} key={p.name} href={p.trackingUrl!} target='_blank' rel='sponsored nofollow noopener'><span className='expressBrand'>{p.name.replace(' Djurförsäkring','')}</span><span className='expressAction'>{category==='bredband'?'Se vad du kan få':category==='mobil'?'Se abonnemang':'Hämta ditt pris'} <ArrowUpRight size={16}/></span></a>)}</div></div>}
  <div className='gatewayPaths'>
   {active.length ? <a className='gatewayPath gatewayDirect' href={active[0].trackingUrl!} target='_blank' rel='sponsored nofollow noopener'><span className='gatewayIcon'><Gauge size={20}/></span><div><small>SNABBASTE VÄGEN</small><strong>{cfg.direct}</strong><p>{active.length>1?'Välj en aktiv partner ovan eller börja med första alternativet.':`Fortsätt hos ${active[0].name} för aktuellt pris och villkor.`}</p></div><ArrowUpRight size={20}/></a>:
   <Link className='gatewayPath gatewayDirect' href='/elavtal/jamfor-elavtal/'><span className='gatewayIcon'><Gauge size={20}/></span><div><small>JÄMFÖR RÄTT</small><strong>{cfg.direct}</strong><p>Förbered jämförelsen nu. Partnerlänkar aktiveras först när samarbetet är godkänt.</p></div><ArrowRight size={20}/></Link>}
   <Link className='gatewayPath' href={cfg.helpHref}><span className='gatewayIcon'><Compass size={20}/></span><div><small>HJÄLP MIG VÄLJA</small><strong>{cfg.help}</strong><p>Några snabba val hjälper dig hitta rätt nivå innan du går vidare.</p></div><ArrowRight size={20}/></Link>
   <Link className='gatewayPath gatewayRead' href={cfg.readHref}><div><small>JAG VILL LÄSA FÖRST</small><strong>{cfg.read}</strong></div><ArrowRight size={18}/></Link>
  </div>
  <p className='gatewayFine'>Partnerlänkar är kommersiella. Vi kan få provision om du blir kund; urvalet omfattar inte hela marknaden.</p>
 </section>;
}