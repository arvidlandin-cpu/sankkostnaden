import {
  ArrowRight,
  CircleDollarSign,
  Grid2X2,
  Info,
  Lock,
  ShieldCheck,
  Smartphone,
  TrendingDown,
  Wifi,
  Zap,
} from 'lucide-react';
import styles from '../styles/HomeHero.module.css';

type AreaKey='bredband'|'el'|'mobil'|'forsakring'|'ekonomi';
type Area={label:string;icon:any;href:string;sub:string};

const areas:Record<AreaKey,Area>={
  bredband:{label:'Bredband',icon:Wifi,href:'/bredband/',sub:'Pris, fart & adress'},
  el:{label:'El',icon:Zap,href:'/elavtal/',sub:'Avtal & elpriser'},
  mobil:{label:'Mobil',icon:Smartphone,href:'/mobil/',sub:'Surf & abonnemang'},
  forsakring:{label:'Försäkring',icon:ShieldCheck,href:'/forsakring/',sub:'Hem & djur'},
  ekonomi:{label:'Lån & ekonomi',icon:CircleDollarSign,href:'/ekonomi/',sub:'Ränta & totalkostnad'},
};
const order:AreaKey[]=['bredband','el','mobil','forsakring','ekonomi'];

export default function HomeHero(){
  return <section className={styles.shell} aria-label='Hitta rätt jämförelse'>
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
        <p>Bredband, el, mobil, försäkring och lån.<br/>Välj ett område och gå direkt till jämförelsen.</p>
        <div className={styles.trust}><span>Enkelt att börja</span><span>Du väljer själv</span><span>Gratis att använda</span></div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardEyebrow}>BÖRJA HÄR</div>
        <h2>Vilket avtal bör du kontrollera först?</h2>
        <div className={styles.choiceList}>
          <a href='/app/'><div><strong>Starta Kostnadskollen</strong><small>Fyra områden · personlig prioritering · gratis</small></div><ArrowRight size={17}/></a>
        </div>
        <div className={styles.cardDivider}><span>eller välj område direkt</span></div>
        <div className={styles.areaList}>
          {order.map(key=>{
            const item=areas[key],Icon=item.icon;
            return <a key={key} href={item.href}>
              <span><Icon size={20}/></span><div><strong>{item.label}</strong><small>{item.sub}</small></div><ArrowRight size={17}/>
            </a>;
          })}
        </div>
        <p className={styles.cardHint}>Vet du redan vad du vill jämföra? Välj område direkt. Annars hjälper Kostnadskollen dig att prioritera vad som är mest rimligt att kontrollera först.</p>
      </div>
    </div>
    <div className={styles.proof}>
      <div className={styles.proofInner}>
        <div><span><Grid2X2 size={21}/></span><p><strong>5 kostnadsområden</strong><small>Allt på ett ställe</small></p></div>
        <div><span><TrendingDown size={21}/></span><p><strong>Direkt till rätt område</strong><small>Partner eller hjälp direkt</small></p></div>
        <div><span><Lock size={21}/></span><p><strong>Ingen inloggning</strong><small>Helt kostnadsfritt</small></p></div>
        <div><span><Info size={21}/></span><p><strong>Tydlig affiliateinformation</strong><small>Kommersiella länkar märks tydligt</small></p></div>
      </div>
    </div>
  </section>;
}
