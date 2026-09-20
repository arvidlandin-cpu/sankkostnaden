import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, ArrowUpRight, RotateCcw, Wifi, Smartphone, ShieldCheck, Zap, CircleDollarSign } from 'lucide-react';
import { getActivePartners, type PartnerCategory, type PartnerIntent } from '../lib/partners';

const areas:{id:PartnerCategory;label:string;sub:string;icon:any}[]=[
 {id:'bredband',label:'Bredband',sub:'Pris, fart & adress',icon:Wifi},
 {id:'mobil',label:'Mobil',sub:'Surf & abonnemang',icon:Smartphone},
 {id:'forsakring',label:'Försäkring',sub:'Djur & skydd',icon:ShieldCheck},
 {id:'el',label:'El',sub:'Avtal & avgifter',icon:Zap},
 {id:'ekonomi',label:'Lån & ekonomi',sub:'Ränta & totalkostnad',icon:CircleDollarSign},
];
type Choice={label:string;href:string;intent?:PartnerIntent};
const questions:Record<PartnerCategory,{q:string;opts:Choice[]}>={
 bredband:{q:'Vad är viktigast för dig?',opts:[{label:'Lägsta pris',href:'/bredband/billigaste-bredbandet/',intent:'compare'},{label:'Rätt fart',href:'/bredband/vilken-hastighet-behover-jag/',intent:'compare'},{label:'Vad finns på adressen?',href:'/bredband/bredband-pa-min-adress/',intent:'compare'}]},
 mobil:{q:'Vad vill du förbättra?',opts:[{label:'Lägre månadskostnad',href:'/mobil/billigaste-mobilabonnemanget/',intent:'compare'},{label:'Rätt mängd surf',href:'/mobil/hur-mycket-surf-behover-jag/',intent:'data'},{label:'Ingen bindningstid',href:'/mobil/utan-bindningstid/',intent:'no-binding'}]},
 forsakring:{q:'Vad vill du jämföra?',opts:[{label:'Djurförsäkring',href:'/forsakring/djurforsakring/',intent:'pet'},{label:'Hemförsäkring',href:'/forsakring/jamfor-hemforsakring/',intent:'home'},{label:'Förstå mitt skydd',href:'/forsakring/hemforsakring-skyddskoll/',intent:'home'}]},
 el:{q:'Vad vill du få hjälp med?',opts:[{label:'Billigare elavtal',href:'/elavtal/billigaste-elavtalet/',intent:'electricity'},{label:'Välja avtalsform',href:'/elavtal/vilket-elavtal-passar-mig/',intent:'electricity'},{label:'Byta elavtal',href:'/elavtal/byta-elavtal/',intent:'electricity'}]},
 ekonomi:{q:'Vad vill du göra?',opts:[{label:'Jämföra privatlån',href:'/ekonomi/#jamfor-lan',intent:'loan'},{label:'Se om samlingslån kan löna sig',href:'/ekonomi/#samlingslan',intent:'loan'},{label:'Få bättre koll på ekonomin',href:'/ekonomi/',intent:'saving'}]}
};

const resultText=(area:PartnerCategory,intent?:PartnerIntent)=>area==='ekonomi'&&intent==='loan'?'Läs först vad som påverkar lånets totalkostnad. Gå sedan vidare till en partner om du vill se vilka räntor och villkor du kan erbjudas.':area==='ekonomi'&&intent==='saving'?'Börja med överblicken och gå vidare till ett privatekonomiskt verktyg om du vill samla fler delar på ett ställe.':area==='forsakring'?'Börja med rätt skyddsnivå och jämför därefter premie, självrisk och villkor.':'Börja med vår korta jämförelseguide eller gå direkt till en relevant partner.';
const partnerAction=(area:PartnerCategory,intent?:PartnerIntent)=>area==='bredband'?'Kontrollera pris':area==='mobil'?'Se abonnemang':area==='el'?'Se elavtal':area==='forsakring'?'Se premie & villkor':intent==='saving'?'Se tjänsten':'Jämför lån';

export default function SavingsNavigator(){
 const [area,setArea]=useState<PartnerCategory|null>(null); const [choice,setChoice]=useState<Choice|null>(null);
 const partners=area?getActivePartners(area,choice?.intent):[];
 const reset=()=>{setArea(null);setChoice(null)};
 return <section className='savingsNav'>
  <div className='savingsNavTop'><div><span>SNABBSTART · 2 VAL</span><h2>Sänk en kostnad nu.</h2><p>Välj kostnaden du vill sänka. Efter två snabba val får du en tydlig väg vidare – utan formulär eller inloggning.</p></div><div className='stepDots'><b className='on'>1</b><i/><b className={area?'on':''}>2</b><i/><b className={choice?'on':''}>3</b></div></div>
  {!area&&<div className='savingsAreaGrid'>{areas.map(({id,label,sub,icon:Icon})=><button key={id} onClick={()=>setArea(id)}><span><Icon size={22}/></span><strong>{label}</strong><small>{sub}</small><ArrowRight size={17}/></button>)}</div>}
  {area&&!choice&&<div className='savingsQuestion'><div><small>STEG 2</small><h3>{questions[area].q}</h3></div><div>{questions[area].opts.map(o=><button key={o.label} onClick={()=>setChoice(o)}>{o.label}<ArrowRight size={16}/></button>)}</div><button className='navReset' onClick={reset}><RotateCcw size={14}/> Börja om</button></div>}
  {area&&choice&&<div className='savingsResult'><div><small>DIN SNABBA VÄG</small><h3>{choice.label}</h3><p>{resultText(area,choice.intent)}</p><Link className='resultGuide' href={choice.href}>Se nästa steg <ArrowRight size={17}/></Link></div>{partners.length>0&&<div className='resultPartners'><span>RELEVANTA PARTNERS</span>{partners.slice(0,4).map(p=><a href={p.trackingUrl} data-affiliate-partner={p.name} data-affiliate-category={area || 'unknown'} data-affiliate-intent={choice.intent || 'unspecified'} data-affiliate-placement='savings_navigator' target='_blank' rel='sponsored nofollow noopener' key={p.name}><b>{p.name.replace(' Djurförsäkring','')}</b><small>{partnerAction(area,choice.intent)} <ArrowUpRight size={14}/></small></a>)}</div>}<button className='navReset' onClick={reset}><RotateCcw size={14}/> Välj en annan kostnad</button></div>}
 </section>
}