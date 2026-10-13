import Head from 'next/head';
import Link from 'next/link';
import {useMemo,useState} from 'react';
import {ArrowLeft,ArrowRight,Check,RotateCcw,PiggyBank,Wifi,Zap,Smartphone,ShieldCheck,BarChart3,Wallet} from 'lucide-react';
import s from '../../styles/V6Variants.module.css';
type K='bredband'|'el'|'mobil'|'forsakring';
type Amounts=Record<K,number|null>;
const areas:{key:K;label:string;short:string;max:number;step:number;href:string;hint:string}[]=[
 {key:'el',label:'El',short:'Elavtal',max:5000,step:50,href:'/elavtal/',hint:'Kontrollera både rörliga och fasta avgifter.'},
 {key:'bredband',label:'Bredband',short:'Uppkoppling',max:1500,step:10,href:'/bredband/',hint:'Jämför samma hastighet på din adress.'},
 {key:'mobil',label:'Mobil',short:'Abonnemang',max:3000,step:10,href:'/mobil/',hint:'Jämför surf, täckning och ordinarie pris.'},
 {key:'forsakring',label:'Försäkring',short:'Skydd',max:5000,step:25,href:'/forsakring/',hint:'Jämför samma omfattning och självrisk.'}
];
const initial:Amounts={bredband:null,el:null,mobil:null,forsakring:null};
const icons={bredband:Wifi,el:Zap,mobil:Smartphone,forsakring:ShieldCheck};
const colors:Record<K,string>={el:'#b18643',bredband:'#397969',mobil:'#627bd2',forsakring:'#bf758b'};
const sek=(n:number)=>n.toLocaleString('sv-SE')+' kr';
export default function CostMapV6(){
 const [values,setValues]=useState<Amounts>(initial);
 const [selected,setSelected]=useState<K|null>(null);
 const [annual,setAnnual]=useState(false);
 const known=areas.filter(x=>values[x.key]!==null);
 const total=known.reduce((n,a)=>n+(values[a.key]||0),0);
 const sorted=known.filter(x=>(values[x.key]||0)>0).sort((a,b)=>(values[b.key]||0)-(values[a.key]||0));
 const biggest=sorted[0];
 const knownCount=known.length;
 const style=useMemo(()=>{
  let pos=0;let parts:string[]=[];
  for(const a of sorted){let share=(values[a.key]||0)/total*100;parts.push(colors[a.key]+' '+pos+'% '+(pos+share)+'%');pos+=share;}
  return {background:total?('conic-gradient('+parts.join(',')+')'):'#e3eae4'};
 },[values,total,sorted]);
 const chosen=selected?areas.find(a=>a.key===selected):undefined;
 return <><Head><title>V6 koncept B – kostnadskarta | Sänk Kostnaden</title><meta name='description' content='Testa en visuell kostnadskarta med egna månadskostnader. En avgränsad noindex-prototyp.'/><meta name='robots' content='noindex,nofollow,noarchive'/></Head>
 <main className={s.shell} data-testid='v6-map'>
  <header className={s.header}><Link href='/' className={s.brand}><PiggyBank size={20}/> Sänk Kostnaden</Link><Link href='/experiments/v6-koncept/' className={s.hubBack}><ArrowLeft size={16}/> Alla koncept</Link></header>
  <div className={s.mapWrap}>
   <p className={s.eyebrow}><BarChart3 size={16}/> KONCEPT B · KOSTNADSKARTA</p>
   <h1>Vad går pengarna till?</h1>
   <p className={s.lead}>Fyll bara i det du känner till. Kartan växer fram medan du klickar – utan att du måste göra en komplett budget.</p>
   <div className={s.mapLayout}>
    <section className={s.mapChoices} aria-label='Välj månadskostnad'>
     <div className={s.mapSectionHead}><h2>Välj en kostnad</h2><button type='button' className={s.plainButton} onClick={()=>{setValues(initial);setSelected(null);setAnnual(false)}}><RotateCcw size={15}/> Rensa</button></div>
     <div className={s.mapCards}>{areas.map(a=>{const I=icons[a.key];return <button type='button' key={a.key} className={selected===a.key?s.mapCardActive:s.mapCard} onClick={()=>{setSelected(a.key);if(values[a.key]===null)setValues(prev=>({...prev,[a.key]:0}));}} aria-pressed={selected===a.key} data-testid={'v6-map-pick-'+a.key}>
      <span className={s.mapIcon} style={{color:colors[a.key]}}><I size={23}/></span><span className={s.mapCardText}><strong>{a.label}</strong><small>{values[a.key]===null?'Inte angivet':sek(values[a.key]!)+' / mån'}</small></span><ArrowRight size={17}/></button>})}</div>
     {chosen&&<div className={s.mapEditor} data-testid='v6-map-editor'>
      <p className={s.editorTag}>DIN UPPGIFT · {chosen.label.toUpperCase()}</p>
      <label htmlFor='v6-monthly'>Vad betalar du ungefär per månad?</label>
      <div className={s.editorAmount}><input id='v6-monthly' type='number' min={0} max={chosen.max} step={chosen.step} inputMode='numeric' value={values[chosen.key]??0} onChange={e=>{const v=Number(e.currentTarget.value);setValues(prev=>({...prev,[chosen.key]:Math.min(chosen.max,Math.max(0,Number.isFinite(v)?v:0))}))}} aria-label={'Månadskostnad '+chosen.label}/><span>kr / mån</span></div>
      <input className={s.costSlider} type='range' min={0} max={chosen.max} step={chosen.step} value={values[chosen.key]??0} aria-label={'Justera '+chosen.label} onChange={e=>setValues(prev=>({...prev,[chosen.key]:Number(e.currentTarget.value)}))}/>
      <div className={s.sliderRange}><span>0 kr</span><span>{sek(chosen.max)}</span></div>
      <p className={s.editorHint}>{chosen.hint}</p>
      <button type='button' className={s.plainButton} onClick={()=>{setValues(prev=>({...prev,[chosen.key]:null}));setSelected(null)}}>Ta bort den här kostnaden</button>
     </div>}
    </section>
    <section className={s.mapInsights} aria-label='Visualisering av angivna kostnader'>
      <div className={s.mapSummaryTop}><span>DIN KOSTNADSBILD</span><span>{knownCount} av 4 angivna</span></div>
      <div className={s.donut} style={style} data-testid='v6-map-ring'><div className={s.donutCenter}><small>{annual?'Per år':'Per månad'}</small><strong data-testid='v6-map-total'>{knownCount?sek(total*(annual?12:1)):'–'}</strong><span>{knownCount?'Kända kostnader':'Ange ett belopp'}</span></div></div>
      <div className={s.periodSwitch} role='group' aria-label='Tidsperiod'><button type='button' aria-pressed={!annual} onClick={()=>setAnnual(false)}>Månad</button><button type='button' aria-pressed={annual} onClick={()=>setAnnual(true)}>År</button></div>
      <p className={s.mapDisclaimer}>{knownCount===0?'Börja med en av kostnaderna till vänster.':'Summan innehåller bara kostnader du själv angivit – inte alla hushållets utgifter.'}</p>
      {biggest?<div className={s.highest}><small>STÖRSTA ANGIVNA KOSTNAD</small><strong>{biggest.label} · {sek((values[biggest.key]||0)*(annual?12:1))}</strong><p>Högst belopp betyder inte säkert störst besparingsmöjlighet. Kontrollera villkoren innan du byter.</p><Link href={biggest.href} data-testid='v6-map-next'>Se hur du jämför {biggest.label.toLowerCase()} <ArrowRight size={16}/></Link></div>:
       <div className={s.highest}><small>VAD HÄNDER NU?</small><strong>Du bestämmer var du börjar.</strong><p>Välj ett område och ange belopp – kartan uppdateras direkt.</p></div>}
     </section>
   </div>
   <p className={s.footNote}><Wallet size={17}/> Inga belopp skickas vidare eller sparas i prototypen. Detta är en översikt, inte en beräkning av möjliga besparingar eller leverantörspriser.</p>
  </div>
 </main></>;
}