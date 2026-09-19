import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Compass, Gauge, Sparkles } from 'lucide-react';
import { getActivePartners, type PartnerCategory, type PartnerIntent } from '../lib/partners';

type Props = { category: PartnerCategory; compact?: boolean; intent?: PartnerIntent; };

const config = {
  bredband:{title:'Hur vill du gå vidare med bredbandet?',intro:'Se vad du kan beställa, välj rätt hastighet eller gå direkt till jämförelsen.',direct:'Jämför bredband på min adress',help:'Hjälp mig välja hastighet',helpHref:'/bredband/vilken-hastighet-behover-jag/',read:'Läs bredbandsguiden',readHref:'/bredband/'},
  mobil:{title:'Hur vill du hitta rätt mobilabonnemang?',intro:'Gå direkt till en aktiv partner eller ringa in surf och behov först.',direct:'Jämför mobilabonnemang',help:'Hjälp mig välja surf',helpHref:'/mobil/hur-mycket-surf-behover-jag/',read:'Jämför billiga abonnemang',readHref:'/mobil/billigaste-mobilabonnemanget/'},
  forsakring:{title:'Jämför försäkring på rätt nivå',intro:'Välj rätt skydd först och gå sedan vidare till pris när en relevant partner finns.',direct:'Jämför försäkring',help:'Jämför djurförsäkring',helpHref:'/forsakring/djurforsakring/',read:'Läs försäkringsguiden',readHref:'/forsakring/'},
  el:{title:'Hitta rätt väg till ett billigare elavtal',intro:'Elpartners aktiveras först när samarbetena är godkända. Under tiden hjälper vi dig jämföra rätt.',direct:'Jämför elavtal',help:'Hjälp mig välja avtalsform',helpHref:'/elavtal/vilket-elavtal-passar-mig/',read:'Se billigaste elavtalet',readHref:'/elavtal/billigaste-elavtalet/'}
} as const;

const partnerClass=(name:string)=>name==='Telia'?'brandTelia':name==='Vimla'?'brandVimla':name==='Bredbandsval.se'?'brandBredbandsval':name==='Lassie'?'brandLassie':name.startsWith('Sveland')?'brandSveland':'';

export default function DecisionGateway({category,compact=false,intent}:Props){
 const cfg=config[category], active=getActivePartners(category,intent);
 const directPartner=active.length===1?active[0]:null;
 const fallbackHref=category==='el'?'/elavtal/jamfor-elavtal/':category==='forsakring'?'/forsakring/jamfor-hemforsakring/':category==='mobil'?'/mobil/billigaste-mobilabonnemanget/':'/bredband/bredband-pa-min-adress/';
 const noPartnerText=category==='forsakring'&&intent==='home'?'Vi har ingen aktiv hemförsäkringspartner ännu. Använd checklistan för att jämföra likvärdigt skydd.':category==='el'?'Partnerlänkar aktiveras först när samarbetet är godkänt. Förbered jämförelsen nu.':'Börja med vår jämförelseguide.';
 return <section className={`decisionGateway ${compact?'decisionGatewayCompact':''}`}>
  <div className='gatewayHead'><span><Sparkles size={14}/> HITTA DIN SNABBASTE VÄG</span><h2>{cfg.title}</h2><p>{cfg.intro}</p></div>
  {active.length>0 && <div className='partnerExpress'><div className='partnerExpressLabel'>AKTIVA PARTNERS · GÅ DIREKT TILL PRIS</div><div className='partnerExpressGrid'>{active.map(p=><a className={`partnerExpressCard ${partnerClass(p.name)}`} key={p.name} href={p.trackingUrl!} target='_blank' rel='sponsored nofollow noopener'><span className='expressBrand'>{p.name.replace(' Djurförsäkring','')}</span><span className='expressAction'>{category==='bredband'?'Se vad du kan få':category==='mobil'?'Se abonnemang':'Hämta ditt pris'} <ArrowUpRight size={16}/></span></a>)}</div></div>}
  <div className='gatewayPaths'>
   {directPartner ? <a className='gatewayPath gatewayDirect' href={directPartner.trackingUrl!} target='_blank' rel='sponsored nofollow noopener'><span className='gatewayIcon'><Gauge size={20}/></span><div><small>SNABBASTE VÄGEN</small><strong>{cfg.direct}</strong><p>{`Fortsätt hos ${directPartner.name} för pris och villkor.`}</p></div><ArrowUpRight size={20}/></a>:
   <Link className='gatewayPath gatewayDirect' href={fallbackHref}><span className='gatewayIcon'><Gauge size={20}/></span><div><small>{active.length>1?'JÄMFÖR ALTERNATIVEN':'JÄMFÖR RÄTT'}</small><strong>{cfg.direct}</strong><p>{active.length>1?'Flera relevanta partners finns. Jämför alternativen i stället för att automatiskt skickas till den första.':noPartnerText}</p></div><ArrowRight size={20}/></Link>}
   <Link className='gatewayPath' href={cfg.helpHref}><span className='gatewayIcon'><Compass size={20}/></span><div><small>HJÄLP MIG VÄLJA</small><strong>{cfg.help}</strong><p>Några snabba val hjälper dig hitta rätt nivå innan du går vidare.</p></div><ArrowRight size={20}/></Link>
   <Link className='gatewayPath gatewayRead' href={cfg.readHref}><div><small>JAG VILL LÄSA FÖRST</small><strong>{cfg.read}</strong></div><ArrowRight size={18}/></Link>
  </div>
  <p className='gatewayFine'>Partnerlänkar är kommersiella. Vi kan få provision om du blir kund; urvalet omfattar inte hela marknaden.</p>
 </section>;
}