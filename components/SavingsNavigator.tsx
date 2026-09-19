import { useState } from 'react';
import { ArrowRight, ArrowUpRight, RotateCcw, Wifi, Smartphone, ShieldCheck, Zap } from 'lucide-react';
import { getActivePartners, type PartnerCategory } from '../lib/partners';

const areas:{id:PartnerCategory;label:string;sub:string;icon:any}[]=[
 {id:'bredband',label:'Bredband',sub:'Pris, fart & adress',icon:Wifi},
 {id:'mobil',label:'Mobil',sub:'Surf & abonnemang',icon:Smartphone},
 {id:'forsakring',label:'Försäkring',sub:'Djur & skydd',icon:ShieldCheck},
 {id:'el',label:'El',sub:'Avtal & avgifter',icon:Zap},
];
const questions:any={
 bredband:{q:'Vad är viktigast för dig?',opts:[['Lägsta pris','/bredband/billigaste-bredbandet/'],['Rätt fart','/bredband/vilken-hastighet-behover-jag/'],['Vad finns på adressen?','/bredband/bredband-pa-min-adress/']]},
 mobil:{q:'Vad vill du förbättra?',opts:[['Lägre månadskostnad','/mobil/billigaste-mobilabonnemanget/'],['Rätt mängd surf','/mobil/hur-mycket-surf-behover-jag/'],['Ingen bindningstid','/mobil/utan-bindningstid/']]},
 forsakring:{q:'Vad vill du jämföra?',opts:[['Djurförsäkring','/forsakring/djurforsakring/'],['Hemförsäkring','/forsakring/jamfor-hemforsakring/'],['Förstå mitt skydd','/forsakring/hemforsakring-skyddskoll/']]},
 el:{q:'Vad vill du få hjälp med?',opts:[['Billigare elavtal','/elavtal/billigaste-elavtalet/'],['Välja avtalsform','/elavtal/vilket-elavtal-passar-mig/'],['Byta elavtal','/elavtal/byta-elavtal/']]}
};
export default function SavingsNavigator(){
 const [area,setArea]=useState<PartnerCategory|null>(null); const [choice,setChoice]=useState<any>(null);
 const partners=area?getActivePartners(area):[];
 const reset=()=>{setArea(null);setChoice(null)};
 return <section className='savingsNav'>
  <div className='savingsNavTop'><div><span>SNABBSTART · 2 KLICK</span><h2>Sänk en kostnad nu.</h2><p>Välj vad du vill betala mindre för. Vi leder dig till rätt nästa steg utan formulär eller inloggning.</p></div><div className='stepDots'><b className='on'>1</b><i/><b className={area?'on':''}>2</b><i/><b className={choice?'on':''}>3</b></div></div>
  {!area&&<div className='savingsAreaGrid'>{areas.map(({id,label,sub,icon:Icon})=><button key={id} onClick={()=>setArea(id)}><span><Icon size={22}/></span><strong>{label}</strong><small>{sub}</small><ArrowRight size={17}/></button>)}</div>}
  {area&&!choice&&<div className='savingsQuestion'><div><small>STEG 2</small><h3>{questions[area].q}</h3></div><div>{questions[area].opts.map((o:any)=><button key={o[0]} onClick={()=>setChoice(o)}>{o[0]}<ArrowRight size={16}/></button>)}</div><button className='navReset' onClick={reset}><RotateCcw size={14}/> Börja om</button></div>}
  {area&&choice&&<div className='savingsResult'><div><small>DIN SNABBA VÄG</small><h3>{choice[0]}</h3><p>Du kan gå vidare till vår korta jämförelseguide eller hoppa direkt till en aktiv partner när det finns en relevant.</p><a className='resultGuide' href={choice[1]}>Visa min väg <ArrowRight size={17}/></a></div>{partners.length>0&&<div className='resultPartners'><span>ELLER GÅ DIREKT TILL PARTNER</span>{partners.map(p=><a href={p.trackingUrl!} target='_blank' rel='sponsored nofollow noopener' key={p.name}><b>{p.name.replace(' Djurförsäkring','')}</b><small>Se aktuellt erbjudande <ArrowUpRight size={14}/></small></a>)}</div>}<button className='navReset' onClick={reset}><RotateCcw size={14}/> Ny kostnad</button></div>}
 </section>
}