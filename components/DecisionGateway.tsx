import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Compass, Gauge, Sparkles } from 'lucide-react';
import { getActivePartners, type PartnerCategory, type PartnerIntent } from '../lib/partners';

type Props = { category: PartnerCategory; compact?: boolean; intent?: PartnerIntent; };

const config = {
  bredband:{title:'Hur vill du gå vidare med bredbandet?',intro:'Se vad du kan beställa, välj rätt hastighet eller gå direkt till jämförelsen.',direct:'Jämför bredband på min adress',help:'Hjälp mig välja hastighet',helpHref:'/bredband/vilken-hastighet-behover-jag/',read:'Läs bredbandsguiden',readHref:'/bredband/'},
  mobil:{title:'Hur vill du hitta rätt mobilabonnemang?',intro:'Gå direkt till en aktiv partner eller ringa in surf och behov först.',direct:'Jämför mobilabonnemang',help:'Hjälp mig välja surf',helpHref:'/mobil/hur-mycket-surf-behover-jag/',read:'Jämför billiga abonnemang',readHref:'/mobil/billigaste-mobilabonnemanget/'},
  forsakring:{title:'Jämför försäkring på rätt nivå',intro:'Välj rätt skydd först och jämför sedan premie och villkor.',direct:'Jämför försäkring',help:'Jämför djurförsäkring',helpHref:'/forsakring/djurforsakring/',read:'Läs försäkringsguiden',readHref:'/forsakring/'},
  el:{title:'Hitta rätt väg till ett billigare elavtal',intro:'Jämför pris, påslag, fasta avgifter, avtalsform och villkor utifrån samma förbrukning.',direct:'Jämför elavtal',help:'Hjälp mig välja avtalsform',helpHref:'/elavtal/vilket-elavtal-passar-mig/',read:'Se billigaste elavtalet',readHref:'/elavtal/billigaste-elavtalet/'},
  ekonomi:{title:'Jämför lånekostnaden på rätt sätt',intro:'Räntan är individuell. Jämför effektiv ränta, avgifter, löptid och total återbetalning i de erbjudanden du får.',direct:'Jämför privatlån',help:'Så jämför du lånekostnaden',helpHref:'/ekonomi/#jamfor-lan',read:'Läs om samlingslån',readHref:'/ekonomi/#samlingslan'}
} as const;

const partnerClass=(name:string)=>name==='Telia'?'brandTelia':name==='Vimla'?'brandVimla':name==='Bredbandsval.se'?'brandBredbandsval':name==='Lassie'?'brandLassie':name.startsWith('Sveland')?'brandSveland':'';

const expressLabel=(category:PartnerCategory,intent?:PartnerIntent)=>category==='ekonomi'?(intent==='saving'?'PRIVATEKONOMI · ÖPPNAS I NY FLIK':'LÅNETJÄNSTER · ÖPPNAS I NY FLIK'):category==='forsakring'?'AKTIVA PARTNERS · SE PREMIE & VILLKOR':'AKTIVA PARTNERS · GÅ DIREKT TILL JÄMFÖRELSE';
const expressAction=(category:PartnerCategory,intent?:PartnerIntent)=>category==='bredband'?'Kontrollera adress':category==='mobil'?'Se abonnemang':category==='el'?'Se elavtal':category==='ekonomi'?(intent==='saving'?'Se tjänsten':'Jämför lån'):'Se premie & villkor';

export default function DecisionGateway({category,compact=false,intent}:Props){
 const cfg=config[category], active=category==='forsakring'&&!intent?[]:getActivePartners(category,intent);
 const helpLabel=category==='forsakring'&&intent==='home'?'Gör skyddskollen':cfg.help;
 const helpHref=category==='forsakring'&&intent==='home'?'/forsakring/hemforsakring-skyddskoll/':category==='forsakring'&&intent==='pet'?'/forsakring/jamfor-forsakring/':cfg.helpHref;
 const readLabel=category==='forsakring'&&intent==='pet'?'Jämför försäkring steg för steg':cfg.read;
 const readHref=category==='forsakring'&&intent==='pet'?'/forsakring/':cfg.readHref;
 const directPartner=active.length===1?active[0]:null;
 const directLabel=category==='forsakring'&&intent==='pet'?'Jämför djurförsäkring':category==='forsakring'&&intent==='home'?'Jämför hemförsäkring':cfg.direct;
 const fallbackHref=category==='ekonomi'?'/ekonomi/#jamfor-lan':category==='el'?'/elavtal/jamfor-elavtal/':category==='forsakring'?(intent==='pet'?'/forsakring/jamfor-forsakring/':intent==='home'?'/forsakring/jamfor-hemforsakring/':'/forsakring/jamfor-forsakring/'):category==='mobil'?'/mobil/billigaste-mobilabonnemanget/':'/bredband/bredband-pa-min-adress/';
 const noPartnerText=category==='forsakring'&&intent==='home'?'Vi har ingen aktiv hemförsäkringspartner ännu. Använd checklistan för att jämföra likvärdigt skydd.':category==='forsakring'?'Välj först vilken typ av försäkring du vill jämföra. Då kan premie, självrisk och skydd jämföras på rätt nivå.':category==='el'?'Partnerlänkar aktiveras först när samarbetet är godkänt. Förbered jämförelsen nu.':'Börja med vår jämförelseguide.';
 return <section className={`decisionGateway ${compact?'decisionGatewayCompact':''}`}>
  <div className='gatewayHead'><span><Sparkles size={14}/> HITTA DIN SNABBASTE VÄG</span><h2>{cfg.title}</h2><p>{cfg.intro}</p></div>
  {active.length>0 && <div className='partnerExpress'><div className='partnerExpressLabel'>{expressLabel(category,intent)}</div><div className='partnerExpressGrid'>{active.map(p=><a className={`partnerExpressCard ${partnerClass(p.name)}`} key={p.name} href={p.trackingUrl} data-partner={p.name} data-category={category} data-intent={intent || 'unspecified'} data-placement='gateway_express' target='_blank' rel='sponsored nofollow noopener'><span className='expressBrand'>{p.name.replace(' Djurförsäkring','')}</span><span className='expressAction'>{expressAction(category,intent)} <ArrowUpRight size={16}/></span></a>)}</div></div>}
  <div className='gatewayPaths'>
   {directPartner ? <a className='gatewayPath gatewayDirect' href={directPartner.trackingUrl} data-partner={directPartner.name} data-category={category} data-intent={intent || 'unspecified'} data-placement='gateway_primary' target='_blank' rel='sponsored nofollow noopener'><span className='gatewayIcon'><Gauge size={20}/></span><div><small>SNABBASTE VÄGEN</small><strong>{directLabel}</strong><p>{category==='bredband'?`Fortsätt hos ${directPartner.name} för att kontrollera tillgänglighet och pris på din adress.`:category==='mobil'?`Fortsätt hos ${directPartner.name} för abonnemang och aktuella villkor.`:category==='el'?`Fortsätt hos ${directPartner.name} för aktuellt elavtal och villkor.`:category==='forsakring'?`Fortsätt hos ${directPartner.name} för premie och villkor utifrån dina uppgifter.`:intent==='saving'?`Fortsätt hos ${directPartner.name} för att läsa om tjänstens funktioner och villkor.`:`Fortsätt hos ${directPartner.name} för att jämföra lån och se vilka villkor du kan erbjudas.`}</p></div><ArrowUpRight size={20}/></a>:
   <Link className='gatewayPath gatewayDirect' href={fallbackHref}><span className='gatewayIcon'><Gauge size={20}/></span><div><small>{active.length>1?'JÄMFÖR ALTERNATIVEN':'JÄMFÖR RÄTT'}</small><strong>{cfg.direct}</strong><p>{active.length>1?'Flera relevanta partners finns. Jämför dem på samma villkor innan du väljer.':noPartnerText}</p></div><ArrowRight size={20}/></Link>}
   <Link className='gatewayPath' href={helpHref}><span className='gatewayIcon'><Compass size={20}/></span><div><small>HJÄLP MIG VÄLJA</small><strong>{helpLabel}</strong><p>Några snabba val hjälper dig att jämföra rätt sak innan du går vidare.</p></div><ArrowRight size={20}/></Link>
   <Link className='gatewayPath gatewayRead' href={readHref}><div><small>JAG VILL LÄSA FÖRST</small><strong>{readLabel}</strong></div><ArrowRight size={18}/></Link>
  </div>
  <p className='gatewayFine'>Partnerlänkar är kommersiella. Vi kan få provision om du blir kund; urvalet omfattar inte hela marknaden.</p>
 </section>;
}