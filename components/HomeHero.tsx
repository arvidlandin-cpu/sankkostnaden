import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CircleDollarSign,
  ShieldCheck,
  Smartphone,
  Wifi,
  Zap,
} from 'lucide-react';
import styles from '../styles/HomeHero.module.css';

type AreaKey='bredband'|'el'|'mobil'|'forsakring'|'ekonomi';
type Choice={label:string;sub:string;href:string};
type Area={label:string;icon:any;choices:Choice[]};

const areas:Record<AreaKey,Area>={
  bredband:{label:'Bredband',icon:Wifi,choices:[
    {label:'Se vad som finns på adressen',sub:'Börja med tillgänglighet och pris',href:'/bredband/bredband-pa-min-adress/'},
    {label:'Hitta rätt hastighet',sub:'3 frågor om hushållets behov',href:'/bredband/vilken-hastighet-behover-jag/'},
      ]},
  el:{label:'El',icon:Zap,choices:[
    {label:'Jämför elavtal',sub:'Pris, påslag, avgifter och villkor',href:'/elavtal/jamfor-elavtal/'},
    {label:'Välj rätt avtalsform',sub:'Fast, rörligt eller kvartspris',href:'/elavtal/vilket-elavtal-passar-mig/'},
      ]},
  mobil:{label:'Mobil',icon:Smartphone,choices:[
    {label:'Jämför billigare abonnemang',sub:'Pris, surf, nät och bindningstid',href:'/mobil/billigaste-mobilabonnemanget/'},
    {label:'Hitta rätt mängd surf',sub:'3 frågor om din användning',href:'/mobil/hur-mycket-surf-behover-jag/'},
      ]},
  forsakring:{label:'Försäkring',icon:ShieldCheck,choices:[
    {label:'Jämför hemförsäkring',sub:'Premie, självrisk och omfattning',href:'/forsakring/jamfor-hemforsakring/'},
    {label:'Jämför djurförsäkring',sub:'Pris, självrisk och skydd',href:'/forsakring/djurforsakring/'},
    {label:'Kontrollera ditt skydd',sub:'3 frågor innan du jämför pris',href:'/forsakring/hemforsakring-skyddskoll/'},
  ]},
  ekonomi:{label:'Lån & ekonomi',icon:CircleDollarSign,choices:[
    {label:'Jämför privatlån',sub:'Effektiv ränta och total kostnad',href:'/ekonomi/jamfor-privatlan/'},
    {label:'Se om samlingslån passar',sub:'Jämför total kostnad, inte bara månad',href:'/ekonomi/samlingslan/'},
      ]},
};
const order:AreaKey[]=['bredband','el','mobil','forsakring','ekonomi'];

export default function HomeHero(){
  const [area,setArea]=useState<AreaKey|null>(null);
  const selected=area?areas[area]:null;
  return <section id='jamfor' className={styles.shell} aria-label='Hitta rätt jämförelse'>
    <div className={styles.photo} aria-hidden='true'>
      <img
        src='https://images.pexels.com/photos/5998829/pexels-photo-5998829.jpeg?auto=compress&cs=tinysrgb&w=3200'
        alt=''
        fetchPriority='high'
        decoding='async'
      />
    </div>
    <div className={styles.overlay}/>
    <div className={styles.inner}>
      <div className={styles.copy}>
        <div className={styles.badge}><span/> Gratis · ingen inloggning · tydliga partnerlänkar</div>
        <h1>Sänk din<br/>månadskostnad.<br/><em>Inte din vardag.</em></h1>
        <p>Välj kostnaden du vill sänka. Två snabba val leder dig vidare.</p>
      </div>

      <div className={styles.card}>
        <div className={styles.progress}><i className={area?styles.progressTwo:''}/><small>{area?'2 av 2':'1 av 2'}</small></div>
        {!area ? <>
          <h2>Vad vill du betala mindre för?</h2>
          <div className={styles.areaList}>
            {order.map(key=>{
              const item=areas[key],Icon=item.icon;
              return <button key={key} type='button' onClick={()=>setArea(key)}>
                <span><Icon size={20}/></span><strong>{item.label}</strong><ArrowRight size={17}/>
              </button>;
            })}
          </div>
          <p className={styles.cardHint}>Välj ett område.</p>
        </> : <>
          <button className={styles.back} type='button' onClick={()=>setArea(null)}><ArrowLeft size={14}/> Byt område</button>
          <div className={styles.areaChip}>{(()=>{const Icon=selected!.icon;return <Icon size={18}/>})()} {selected!.label}</div>
          <h2>Vad vill du ha hjälp med?</h2>
          <div className={styles.choiceList}>
            {selected!.choices.map(choice=><a key={choice.href} href={choice.href}>
              <div><strong>{choice.label}</strong><small>{choice.sub}</small></div><ArrowRight size={17}/>
            </a>)}
          </div>
          <p className={styles.cardHint}>Ingen inloggning eller formulär.</p>
        </>}
      </div>
    </div>
  </section>;
}
