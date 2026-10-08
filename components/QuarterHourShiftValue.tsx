import {useRef,useState} from 'react';
import Link from 'next/link';
import {emitAnalyticsEvent} from '../lib/clientAttribution';
import styles from '../styles/QuarterHourShiftValue.module.css';
const volumes=[300,1500,3000],gaps=[10,25,50];
const fmt=new Intl.NumberFormat('sv-SE');
export default function QuarterHourShiftValue(){
 const [v,setV]=useState(1),[g,setG]=useState(1),tracked=useRef(false);
 const value=Math.round(volumes[v]*gaps[g]/100);
 function choose(kind:'v'|'g',i:number){
  if(!tracked.current){tracked.current=true;emitAnalyticsEvent('quarter_hour_example_used',{source:'kvartspris_guide',shift_band:['small','medium','large'][kind==='v'?i:v],gap_band:['small','medium','large'][kind==='g'?i:g]});}
  if(kind==='v')setV(i);else setG(i);
 }
 return <section className={styles.shell} aria-labelledby='quarter-shift-title' data-testid='quarter-hour-shift-value'>
 <div className={styles.heading}><span className={styles.kicker}>EXEMPEL · KVARTSPRIS</span><h2 id='quarter-shift-title'>Vad spelar det för roll när du använder el?</h2><p>Se hur flyttad elanvändning kan påverka elhandelskostnaden. Välj två antaganden, utan elräkning eller personuppgifter.</p></div>
 <div className={styles.controls}>
 <fieldset className={styles.group}><legend>1. Hur mycket el skulle du kunna flytta per år?</legend><p>Välj en exempelvolym, inte en uppskattning av ditt hushåll.</p><div className={styles.choices}>{volumes.map((n,i)=><button type='button' key={n} aria-pressed={v===i} onClick={()=>choose('v',i)}><strong>{['Lite','En del','Mycket'][i]}</strong><span>{fmt.format(n)} kWh/år</span></button>)}</div></fieldset>
 <fieldset className={styles.group}><legend>2. Anta denna prisskillnad mellan två kvartar</legend><p>Hypotetiska värden, inte aktuella eller förväntade elpriser.</p><div className={styles.choices}>{gaps.map((n,i)=><button type='button' key={n} aria-pressed={g===i} onClick={()=>choose('g',i)}><strong>{n} öre</strong><span>per kWh</span></button>)}</div></fieldset>
 </div>
 <div className={styles.result} role='status' aria-live='polite'><div><span>Skillnad i detta räkneexempel</span><strong data-testid='quarter-hour-example-result'>{fmt.format(value)} kr/år</strong></div><p>{fmt.format(volumes[v])} kWh × {gaps[g]} öre/kWh. Gäller bara om mängden el faktiskt flyttas mellan dessa prisnivåer.</p></div>
 <div className={styles.next}><div><strong>Är kvartspris rätt för dig?</strong><p>Jämför också månadspris, påslag, fasta avgifter och din faktiska möjlighet att styra förbrukningen.</p></div><Link href='/elavtal/rorligt-fast-kvartspris/'>Jämför avtalsformerna →</Link></div>
 <p className={styles.disclaimer}>Illustration, inte prognos, garanterad besparing eller jämförelse med månadspris. Nätavgift, effektavgift, energiskatt och ändrad förbrukning ingår inte. Läs <a href='https://ei.se/konsument/anvand-el-smartare/elhandelsavtal-med-kvartspris' rel='noopener noreferrer' target='_blank'>Energimarknadsinspektionens förklaring</a>.</p>
 </section>;
}
