import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calculator, TrendingDown, TrendingUp } from 'lucide-react';
import { electricitySensitivity } from '../lib/electricitySensitivity';
import { consumptionBand } from '../lib/electricityCost';
import { emitAnalyticsEvent } from '../lib/clientAttribution';
import styles from '../styles/ElectricitySensitivity.module.css';

const money=new Intl.NumberFormat('sv-SE',{style:'currency',currency:'SEK',maximumFractionDigits:0});
const number=new Intl.NumberFormat('sv-SE',{maximumFractionDigits:0});
const samples=[2000,5000,20000];

function nonNegative(value:string){
  const n=Number(value.replace(',','.'));
  return Number.isFinite(n)?Math.max(0,n):0;
}

export default function ElectricitySensitivity(){
  const [annualKwh,setAnnualKwh]=useState(5000);
  const [lowerPriceOrePerKwh,setLowerPriceOrePerKwh]=useState(5);
  const [higherMonthlyFee,setHigherMonthlyFee]=useState(30);
  const tracked=useRef(false);
  const result=useMemo(()=>electricitySensitivity({annualKwh,lowerPriceOrePerKwh,higherMonthlyFee}),[annualKwh,lowerPriceOrePerKwh,higherMonthlyFee]);

  const trackStart=(kwh:number)=>{
    if(tracked.current)return;
    tracked.current=true;
    emitAnalyticsEvent('electricity_sensitivity_used',{
      source:'billigaste_elavtalet',
      consumption_band:consumptionBand(kwh),
      // No raw consumption, prices or fee values are sent.
    });
  };

  return <section className={styles.shell} aria-labelledby='electricity-sensitivity-title' data-testid='electricity-sensitivity'>
    <div className={styles.heading}>
      <p className={styles.kicker}><Calculator size={16}/> SNABBKOLL · ELAVTAL</p>
      <h2 id='electricity-sensitivity-title'>Är ett lägre kWh-pris alltid billigare?</h2>
      <p>Testa hur ett lägre elhandelspris kan ätas upp av en högre månadsavgift. Vi börjar med <strong>räkneexempel</strong> – inga personuppgifter eller aktuella elpriser behövs.</p>
    </div>

    <div className={styles.inputs}>
      <div className={styles.consumption}>
        <label htmlFor='electricity-sensitivity-kwh'>Årsförbrukning</label>
        <div className={styles.numberField}><input id='electricity-sensitivity-kwh' aria-label='Årsförbrukning' type='number' min='0' step='100' inputMode='numeric' value={annualKwh} onChange={e=>{const n=nonNegative(e.target.value);setAnnualKwh(n);trackStart(n);}}/><span>kWh/år</span></div>
        <div className={styles.samples} aria-label='Exempelförbrukningar'>
          {samples.map(n=><button type='button' key={n} aria-pressed={annualKwh===n} onClick={()=>{setAnnualKwh(n);trackStart(n);}}>{number.format(n)} kWh</button>)}
        </div>
      </div>

      <div className={styles.difference}>
        <label htmlFor='electricity-sensitivity-ore'>Lägre elhandelspris med</label>
        <div className={styles.numberField}><input id='electricity-sensitivity-ore' type='number' min='0' step='0.1' inputMode='decimal' value={lowerPriceOrePerKwh} onChange={e=>{setLowerPriceOrePerKwh(nonNegative(e.target.value));trackStart(annualKwh);}}/><span>öre/kWh</span></div>
      </div>

      <div className={styles.difference}>
        <label htmlFor='electricity-sensitivity-fee'>Men högre fast avgift med</label>
        <div className={styles.numberField}><input id='electricity-sensitivity-fee' type='number' min='0' step='1' inputMode='decimal' value={higherMonthlyFee} onChange={e=>{setHigherMonthlyFee(nonNegative(e.target.value));trackStart(annualKwh);}}/><span>kr/mån</span></div>
      </div>
    </div>

    <div className={styles.result} aria-live='polite'>
      <div className={styles.breakdown}>
        <div><span>Skillnad i kWh-kostnad / år</span><strong>{money.format(result.variableSavings)} lägre</strong></div>
        <div><span>Skillnad i fast avgift / år</span><strong>{money.format(result.additionalAnnualFee)} högre</strong></div>
      </div>
      <div className={styles.net}>
        {result.netSaving>0?<TrendingDown size={24}/>:result.netSaving<0?<TrendingUp size={24}/>:<Calculator size={24}/>}
        <div><small>NETTO I RÄKNEEXEMPLET</small><strong data-testid='electricity-sensitivity-outcome'>{result.netSaving>0
          ?`${money.format(result.netSaving)} lägre årskostnad`
          :result.netSaving<0
            ?`${money.format(Math.abs(result.netSaving))} högre årskostnad`
            :'Samma årskostnad'}</strong></div>
      </div>
      {result.breakEvenAnnualKwh!==null&&higherMonthlyFee>0&&<p className={styles.breakEven}>Vid cirka <b>{number.format(result.breakEvenAnnualKwh)} kWh/år</b> tar skillnaden i kWh-pris ut den högre fasta avgiften.</p>}
    </div>

    <div className={styles.next}>
      <div><strong>Vill du jämföra riktiga erbjudanden?</strong><p>Här har vi bara räknat på två skillnader. Hela kostnaden kan också påverkas av rabatter, avtalsform och villkor. Elnät och energiskatt ingår inte.</p></div>
      <Link href='/verktyg/elavtalskostnad/?src=billigaste_elavtalet' onClick={()=>emitAnalyticsEvent('electricity_sensitivity_to_calculator',{source:'billigaste_elavtalet'})}>Räkna årskostnaden för två erbjudanden <ArrowRight size={17}/></Link>
    </div>
    <p className={styles.disclosure}>Illustrativ beräkning, inte livepriser, en prisranking eller en prognos. Använd samma prisgrund inklusive eller exklusive moms för båda avtalen.</p>
  </section>;
}
