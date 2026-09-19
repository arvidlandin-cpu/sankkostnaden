import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Compass, Gauge, Sparkles } from 'lucide-react';
import { getActivePartners, type PartnerCategory, type PartnerIntent } from '../lib/partners';

type Props = { category: PartnerCategory; compact?: boolean; intent?: PartnerIntent; };

const config = {
  bredband:{title:'Hur vill du gå vidare med bredbandet?',intro:'Se vad du kan beställa, välj rätt hastighet eller gå direkt till jämförelsen.',direct:'Jämför bredband på min adress',help:'Hjälp mig välja hastighet',helpHref:'/bredband/vilken-hastighet-behover-jag/',read:'Läs bredbandsguiden',readHref:'/bredband/'},
  mobil:{title:'Hur vill du hitta rätt mobilabonnemang?',intro:'Gå direkt till en aktiv partner eller ringa in surf och behov först.',direct:'Jämför mobilabonnemang',help:'Hjälp mig välja surf',helpHref:'/mobil/hur-mycket-surf-behover-jag/',read:'Jämför billiga abonnemang',readHref:'/mobil/billigaste-mobilabonnemanget/'},
  forsakring:{title:'Jämför försäkring på rätt nivå',intro:'Välj rätt skydd först och gå sedan vidare till pris när en relevant partner finns.',direct:'Jämför försäkring',help:'Jämför djurförsäkring',helpHref:'/forsakring/djurforsakring/',read:'Läs försäkringsguiden',readHref:'/forsakring/'},
  el:{title:'Hitta rätt väg till ett billigare elavtal',intro:'Jämför aktuella elpartners och kontrollera hela kostnaden – pris/påslag, fasta avgifter, avtalsform och villkor.',direct:'Jämför elavtal',help:'Hjälp mig välja avtalsform',helpHref:'/elavtal/vilket-elavtal-passar-mig/',read:'Se billigaste elavtalet',readHref:'/elavtal/billigaste-elavtalet/'},
  ekonomi:{title:'Jämför lånekostnaden på rätt sätt',intro:'Jämför effektiv ränta, avgifter, löptid och total återbetalning innan du ansöker.',direct:'Jämför privatlån',help:'Så jämför du lånekostnad',helpHref:'/ekonomi/#jamfor-lan',read:'Läs om samlingslån',readHref:'/ekonomi/#samlingslan'}
} as const;

const partnerClass=(name:string)=>name==='Telia'?'brandTelia':name==='Vimla'?'brandVimla':name==='Bredbandsval.se'?'brandBredbandsval':name==='Lassie'?'brandLassie':name.startsWith('Sveland')?'brandSveland':'';

export default function DecisionGateway({category,compact=false,intent}:Props){
 const cfg=config[category], active=getActivePartners(category,intent);
 const helpLabel=category==='forsakring'&&intent==='home'?'Gör skyddskollen':cfg.help;
 const helpHref=category==='forsakring'&&intent==='home'?'/forsakring/hemforsakring-skyddskoll/':cfg.helpHref;
 const readLabel=category==='forsakring'&&intent==='pet'?'Jämför försäkring steg för steg':cfg.read;
 const readHref=category==='forsakring'&&intent==='pet'?'/forsakring/jamfor-forsakring/':cfg.readHref;
 const directPartner=active.length===1?active[0]:null;
 const directLabel=category==='forsakring'&&intent==='pet'?'Jämför djurförsäkring':category==='forsakring'&&intent==='home'?'Jämför hemförsäkring':cfg.direct;
 const fallbackHref=category==='ekonomi'?'/ekonomi/#jamfor-lan':category==='el'?'/elavtal/jamfor-elavtal/':category==='forsakring'?(intent==='pet'?'/forsakring/djurforsakring/':intent==='home'?'/forsakring/jamfor-hemforsakring/':'/forsakring/jamfor-forsakring/'):category==='mobil'?'/mobil/billigaste-mobilabonnemanget/':'/bredband/bredband-pa-min-adress/';
 const noPartnerText=category==='forsakring'&&intent==='home'?'Vi har ingen aktiv hemförsäkringspartner ännu. Använd checklistan för att jämföra likvärdigt skydd.':category==='forsakring'?'Börja med vår försäkringsguide och välj sedan rätt typ av skydd.':category==='el'?'Partnerlänkar aktiveras först när samarbetet är godkänt. Förbered jämförelsen nu.':'Börja med vår jämförelseguide.';
 return <section className={`decisionGateway ${compact?'decisionGatewayCompact':''}`}>
  <div className='gatewayHead'><span><Sparkles size={14}/> HITTA DIN SNABBASTE VÄG</span><h2>{cfg.title}</h2><p>{cfg.intro}</p></div>
  {active.length>0 && <div className='partnerExpress'><div className='partnerExpressLabel'>AKTIVA PARTNERS · GÅ DIREKT TILL PRIS</div><div className='partnerExpressGrid'>{active.map(p=><a className={`partnerExpressCard ${partnerClass(p.name)}`} key={p.name} href={p.trackingUrl!} target='_blank' rel='sponsored nofollow noopener'><span className='expressBrand'>{p.name.replace(' Djurförsäkring','')}</span><span className='expressAction'>{category==='bredband'?'Se vad du kan få':category==='mobil'?'Se abonnemang':category==='el'?'Se elavtal':category==='ekonomi'?'Jämför lån':'Hämta ditt pris'} <ArrowUpRight size={16}/></span></a>)}</div></div>}
  <div className='gatewayPaths'>
   {directPartner ? <a className='gatewayPath gatewayDirect' href={directPartner.trackingUrl!} target='_blank' rel='sponsored nofollow noopener'><span className='gatewayIcon'><Gauge size={20}/></span><div><small>SNABBASTE VÄGEN</small><strong>{directLabel}</strong><p>{`Fortsätt hos ${directPartner.name} för pris och villkor.`}</p></div><ArrowUpRight size={20}/></a>:
   <Link className='gatewayPath gatewayDirect' href={fallbackHref}><span className='gatewayIcon'><Gauge size={20}/></span><div><small>{active.length>1?'JÄMFÖR ALTERNATIVEN':'JÄMFÖR RÄTT'}</small><strong>{cfg.direct}</strong><p>{active.length>1?'Flera relevanta partners finns. Jämför alternativen i stället för att automatiskt skickas till den första.':noPartnerText}</p></div><ArrowRight size={20}/></Link>}
   <Link className='gatewayPath' href={helpHref}><span className='gatewayIcon'><Compass size={20}/></span><div><small>HJÄLP MIG VÄLJA</small><strong>{helpLabel}</strong><p>Några snabba val hjälper dig hitta rätt nivå innan du går vidare.</p></div><ArrowRight size={20}/></Link>
   <Link className='gatewayPath gatewayRead' href={readHref}><div><small>JAG VILL LÄSA FÖRST</small><strong>{readLabel}</strong></div><ArrowRight size={18}/></Link>
  </div>
  <p className='gatewayFine'>Partnerlänkar är kommersiella. Vi kan få provision om du blir kund; urvalet omfattar inte hela marknaden.</p>
 </section>;
}