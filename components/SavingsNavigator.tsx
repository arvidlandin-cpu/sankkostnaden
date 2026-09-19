import { useState } from 'react';
import { ArrowRight, ArrowUpRight, RotateCcw, Wifi, Smartphone, ShieldCheck, Zap } from 'lucide-react';
import { getActivePartners, type PartnerCategory, type PartnerIntent } from '../lib/partners';

const areas:{id:PartnerCategory;label:string;sub:string;icon:any}[]=[
 {id:'bredband',label:'Bredband',sub:'Pris, fart & adress',icon:Wifi},
 {id:'mobil',label:'Mobil',sub:'Surf & abonnemang',icon:Smartphone},
 {id:'forsakring',label:'Försäkring',sub:'Djur & skydd',icon:ShieldCheck},
 {id:'el',label:'El',sub:'Avtal & avgifter',icon:Zap},
];
type Choice={label:string;href:string;intent?:PartnerIntent};
const questions:Record<PartnerCategory,{q:string;opts:Choice[]}>={
 bredband:{q:'Vad är viktigast för dig?',opts:[{label:'Lägsta pris',href:'/bredband/billigaste-bredbandet/',intent:'compare'},{label:'Rätt fart',href:'/bredband/vilken-hastighet-behover-jag/',intent:'compare'},{label:'Vad finns på adressen?',href:'/bredband/bredband-pa-min-adress/',intent:'compare'}]},
 mobil:{q:'Vad vill du förbättra?',opts:[{label:'Lägre månadskostnad',href:'/mobil/billigaste-mobilabonnemanget/',intent:'compare'},{label:'Rätt mängd surf',href:'/mobil/hur-mycket-surf-behover-jag/',intent:'data'},{label:'Ingen bindningstid',href:'/mobil/utan-bindningstid/',intent:'no-binding'}]},
 forsakring:{q:'Vad vill du jämföra?',opts:[{label:'Djurförsäkring',href:'/forsakring/djurforsakring/',intent:'pet'},{label:'Hemförsäkring',href:'/forsakring/jamfor-hemforsakring/',intent:'home'},{label:'Förstå mitt skydd',href:'/forsakring/hemforsakring-skyddskoll/',intent:'home'}]},
 el:{q:'Vad vill du få hjälp med?',opts:[{label:'Billigare elavtal',href:'/elavtal/billigaste-elavtalet/',intent:'electricity'},{label:'Välja avtalsform',href:'/elavtal/vilket-elavtal-passar-mig/',intent:'electricity'},{label:'Byta elavtal',href:'/elavtal/byta-elavtal/',intent:'electricity'}]}
};
export default function SavingsNavigator(){
 const [area,setArea]=useState<PartnerCategory|null>(null); const [choice,setChoice]=useState<Choice|null>(null);
 const partners=area?getActivePartners(area,choice?.intent):[];
 const reset=()=>{setArea(null);setChoice(null)};
 return <section className='savingsNav'>
  <div className='savingsNavTop'><div><span>SNABBSTART · 2 KLICK</span><h2>Sänk en kostnad nu.</h2><p>Välj vad du vill betala mindre för. Vi leder dig till rätt nästa steg utan formulär eller inloggning.</p></div><div className='stepDots'><b className='on'>1</b><i/><b className={area?'on':''}>2</b><i/><b className={choice?'on':''}>3</b></div></div>
  {!area&&<div className='savingsAreaGrid'>{areas.map(({id,label,sub,icon:Icon})=><button key={id} onClick={()=>setArea(id)}><span><Icon size={22}/></span><strong>{label}</strong><small>{sub}</small><ArrowRight size={17}/></button>)}</div>}
  {area&&!choice&&<div className='savingsQuestion'><div><small>STEG 2</small><h3>{questions[area].q}</h3></div><div>{questions[area].opts.map(o=><button key={o.label} onClick={()=>setChoice(o)}>{o.label}<ArrowRight size={16}/></button>)}</div><button className='navReset' onClick={reset}><RotateCcw size={14}/> Börja om</button></div>}
  {area&&choice&&<div className='savingsResult'><div><small>DIN SNABBA VÄG</small><h3>{choice.label}</h3><p>Du kan gå vidare till vår korta jämförelseguide eller hoppa direkt till en aktiv partner när det finns en relevant.</p><a className='resultGuide' href={choice.href}>Visa min väg <ArrowRight size={17}/></a></div>{partners.length>0&&<div className='resultPartners'><span>ELLER GÅ DIREKT TILL PARTNER</span>{partners.map(p=><a href={p.trackingUrl!} target='_blank' rel='sponsored nofollow noopener' key={p.name}><b>{p.name.replace(' Djurförsäkring','')}</b><small>Se aktuellt erbjudande <ArrowUpRight size={14}/></small></a>)}</div>}<button className='navReset' onClick={reset}><RotateCcw size={14}/> Ny kostnad</button></div>}
 </section>
}