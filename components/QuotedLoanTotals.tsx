import { useMemo, useRef, useState } from 'react';
import { AlertCircle, ArrowRight, Calculator, RotateCcw } from 'lucide-react';
import { compareQuotedRepayments, type QuotedRepayment } from '../lib/quotedLoanTotals';
import { emitAnalyticsEvent } from '../lib/clientAttribution';
import styles from '../styles/QuotedLoanTotals.module.css';

const money=new Intl.NumberFormat('sv-SE',{style:'currency',currency:'SEK',maximumFractionDigits:0});
const sampleA:QuotedRepayment={monthlyInstallment:2300,monthlyFee:25,setupFee:200,numberOfMonths:60};
const sampleB:QuotedRepayment={monthlyInstallment:1650,monthlyFee:25,setupFee:200,numberOfMonths:96};
const samplePrincipal=100000;

export default function QuotedLoanTotals(){
  const [principal,setPrincipal]=useState(samplePrincipal);
  const [a,setA]=useState<QuotedRepayment>(sampleA);
  const [b,setB]=useState<QuotedRepayment>(sampleB);
  const [changed,setChanged]=useState(false);
  const tracked=useRef(false);
  const result=useMemo(()=>compareQuotedRepayments(principal,a,b),[principal,a,b]);

  const markChanged=()=>{
    if(!tracked.current){
      tracked.current=true;
      emitAnalyticsEvent('loan_total_comparison_used',{source:'private_loan_guide',mode:'user_edited'});
    }
    setChanged(true);
  };
  const update=(which:'A'|'B',key:keyof QuotedRepayment,value:string)=>{
    markChanged();
    const parsed=Number(value.replace(',','.'));
    const safe=Number.isFinite(parsed)?Math.max(0,parsed):0;
    if(which==='A')setA(previous=>({...previous,[key]:safe}));
    else setB(previous=>({...previous,[key]:safe}));
  };
  const reset=()=>{
    setPrincipal(samplePrincipal);setA({...sampleA});setB({...sampleB});setChanged(false);
  };
  return <section className={styles.root} data-testid='loan-total-tool' aria-labelledby='loan-total-heading'>
    <div className={styles.head}>
      <div className={styles.icon}><Calculator size={22}/></div>
      <div>
        <p className={styles.kicker}>RÄKNA PÅ HELA LÖPTIDEN</p>
        <h2 id='loan-total-heading'>Lägre månadsbetalning kan bli dyrare totalt</h2>
        <p>Jämför två återbetalningsupplägg med samma lånebelopp. Exemplet visar varför det är viktigt att titta på både månadskostnad och totalt att betala.</p>
      </div>
    </div>
    <div className={styles.explainer}>
      <span>{changed?'DINA INMATNINGAR · KONTROLLERA AVTALSVILLKOREN':'ILLUSTRATIVT RÄKNEEXEMPEL · INTE ETT LÅNEERBJUDANDE'}</span>
      <button type='button' onClick={reset}><RotateCcw size={14}/> Återställ exemplet</button>
    </div>
    <label className={styles.principal}>Samma lånebelopp för båda alternativen
      <div><input type='number' min='1' step='1000' inputMode='numeric' value={principal} onChange={event=>{markChanged();setPrincipal(Math.max(0,Number(event.target.value)||0));}} aria-label='Lånebelopp i kronor'/><span>kr</span></div>
    </label>
    <div className={styles.offers}>
      {([{code:'A',values:a},{code:'B',values:b}] as const).map(offer=><fieldset key={offer.code} className={styles.offer}>
        <legend>Alternativ {offer.code}</legend>
        <label>Månadsbetalning utan separat avgift
          <div><input type='number' min='0' step='1' inputMode='numeric' value={offer.values.monthlyInstallment} onChange={event=>update(offer.code,'monthlyInstallment',event.target.value)}/><span>kr/mån</span></div>
        </label>
        <label>Återstående återbetalningstid
          <div><input type='number' min='1' max='600' step='1' inputMode='numeric' value={offer.values.numberOfMonths} onChange={event=>update(offer.code,'numberOfMonths',event.target.value)}/><span>mån</span></div>
        </label>
        <label>Separat obligatorisk månadsavgift
          <div><input type='number' min='0' step='1' inputMode='numeric' value={offer.values.monthlyFee} onChange={event=>update(offer.code,'monthlyFee',event.target.value)}/><span>kr/mån</span></div>
        </label>
        <label>Engångsavgift
          <div><input type='number' min='0' step='1' inputMode='numeric' value={offer.values.setupFee} onChange={event=>update(offer.code,'setupFee',event.target.value)}/><span>kr</span></div>
        </label>
      </fieldset>)}
    </div>
    <div className={styles.result} aria-live='polite'>
      {result?<><div className={styles.breakdown}>
        <div><span>Totalt att betala · alternativ A</span><strong data-testid='loan-a-total'>{money.format(result.a.totalPaid)}</strong><small>Varav {money.format(result.a.loanCost)} över lånebeloppet</small></div>
        <div><span>Totalt att betala · alternativ B</span><strong data-testid='loan-b-total'>{money.format(result.b.totalPaid)}</strong><small>Varav {money.format(result.b.loanCost)} över lånebeloppet</small></div>
      </div>
      <div className={styles.conclusion}>
        <strong data-testid='loan-difference'>{result.cheaperTotal==='same'?'Samma beräknade totalsumma':`Alternativ ${result.cheaperTotal} kostar ${money.format(result.totalDifference)} mindre totalt`}</strong>
        {result.lowerMonthly!=='same'&&result.lowerMonthly!==result.cheaperTotal&&
          <p data-testid='loan-lower-monthly-warning'>Alternativ {result.lowerMonthly} har lägre månadsbetalning men högre total återbetalning. Längre löptid kan vara en orsak.</p>}
        <p>Beräkningen utgår från angivna betalningar under hela löptiden, inklusive separata avgifter. Den räknar inte fram effektiv ränta eller framtida ränteändringar.</p>
      </div></>:<div className={styles.invalid}><AlertCircle size={20}/><p>Kontrollera inmatningen. Den beräknade totalsumman måste minst täcka lånebeloppet. Eventuell restskuld, slutbetalning eller utelämnade avgifter måste räknas med innan du kan jämföra.</p></div>}
    </div>
    <div className={styles.footer}>
      <div><strong>Viktigt innan du fattar beslut</strong>
        <p>Jämför alltid effektiv ränta, återbetalningstid och totalbelopp i låneerbjudandets SEKKI-information. Detta är enkel summering av inskrivna belopp, inte en bankoffert, fullständig lånekalkyl eller råd att låna mer.</p>
        <a href='https://www.konsumenternas.se/lan--betalningar/lan/konsumtionslan/kostnader-for-konsumtionslan/' target='_blank' rel='noopener noreferrer'>Konsumenternas om lånekostnader <ArrowRight size={15}/></a>
      </div>
    </div>
  </section>;
}
