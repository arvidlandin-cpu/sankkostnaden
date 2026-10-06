import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calculator, Check, PiggyBank, Zap } from 'lucide-react';
import PartnerDirectory from '../PartnerDirectory';
import { calculateElectricityOffer, consumptionBand, differenceBand, type ElectricityOfferInput } from '../../lib/electricityCost';
import styles from '../../styles/ElectricityCostCalculator.module.css';

type Offer = ElectricityOfferInput & { name:string };

const money=new Intl.NumberFormat('sv-SE',{style:'currency',currency:'SEK',maximumFractionDigits:0});
const decimal=new Intl.NumberFormat('sv-SE',{maximumFractionDigits:1});

const emptyOffer=(name:string):Offer=>({name,unitPriceOre:0,monthlyFee:0,annualDiscount:0});

function emitGa4(eventName:string,params:Record<string,string|number|boolean>={}){
  if(typeof window==='undefined') return;
  const w=window as Window & { gtag?:(...args:unknown[])=>void; dataLayer?:Record<string,unknown>[] };
  if(typeof w.gtag==='function') w.gtag('event',eventName,params);
  else if(Array.isArray(w.dataLayer)) w.dataLayer.push({event:eventName,...params});
}

function Field({label,value,onChange,suffix}:{label:string;value:number;onChange:(value:number)=>void;suffix:string}){
  return <label className={styles.field}>
    <span>{label}</span>
    <div><input type='number' min='0' step='0.1' inputMode='decimal' value={value||''} onChange={event=>onChange(Math.max(0,Number(event.target.value.replace(',','.'))||0))}/><b>{suffix}</b></div>
  </label>;
}

function OfferCard({offer,setOffer,testId}:{offer:Offer;setOffer:(offer:Offer)=>void;testId:string}){
  return <section className={styles.offer} data-testid={testId}>
    <label className={styles.nameField}><span>Namn på alternativet</span><input value={offer.name} maxLength={40} onChange={event=>setOffer({...offer,name:event.target.value})}/></label>
    <div className={styles.grid}>
      <Field label='Elhandelspris att jämföra' value={offer.unitPriceOre} suffix='öre/kWh' onChange={value=>setOffer({...offer,unitPriceOre:value})}/>
      <Field label='Fast avgift' value={offer.monthlyFee} suffix='kr/mån' onChange={value=>setOffer({...offer,monthlyFee:value})}/>
      <Field label='Rabatt totalt under 12 mån' value={offer.annualDiscount} suffix='kr' onChange={value=>setOffer({...offer,annualDiscount:value})}/>
    </div>
  </section>;
}

export default function ElectricityCostCalculator(){
  const [annualKwh,setAnnualKwh]=useState(0);
  const [a,setA]=useState<Offer>(emptyOffer('Alternativ A'));
  const [b,setB]=useState<Offer>(emptyOffer('Alternativ B'));
  const [showResult,setShowResult]=useState(false);
  const [source,setSource]=useState('direct');
  const tracked=useRef(false);

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    const src=(params.get('src')||'direct').toLowerCase().replace(/[^a-z0-9_-]/g,'').slice(0,40)||'direct';
    setSource(src);
  },[]);

  const resultA=useMemo(()=>calculateElectricityOffer(annualKwh,a),[annualKwh,a]);
  const resultB=useMemo(()=>calculateElectricityOffer(annualKwh,b),[annualKwh,b]);
  const ready=annualKwh>0&&(a.unitPriceOre>0||a.monthlyFee>0)&&(b.unitPriceOre>0||b.monthlyFee>0);
  const difference=ready?Math.abs(resultA.annualCost-resultB.annualCost):0;
  const winner=ready&&resultA.annualCost!==resultB.annualCost?(resultA.annualCost<resultB.annualCost?'a':'b'):'same';
  const cheaperName=winner==='a'?a.name:winner==='b'?b.name:'';

  const calculate=()=>{
    if(!ready) return;
    setShowResult(true);
    if(!tracked.current){
      tracked.current=true;
      emitGa4('electricity_cost_ready',{
        source,
        source,
      consumption_band:consumptionBand(annualKwh),
        winner,
        difference_band:differenceBand(difference),
      });
    }
  };

  const continueToPartners=()=>{
    emitGa4('electricity_cost_continue',{
      consumption_band:consumptionBand(annualKwh),
      winner,
      difference_band:differenceBand(difference),
    });
  };

  return <>
    <header className={styles.topbar}>
      <Link href='/' className={styles.brand}><PiggyBank size={20}/><strong>Sänk Kostnaden</strong></Link>
      <span>Elavtalskostnad</span>
    </header>

    <main className={styles.shell}>
      <Link href='/elavtal/jamfor-elavtal/' className={styles.back}><ArrowLeft size={16}/> Till eljämförelsen</Link>

      <section className={styles.hero}>
        <div className={styles.icon}><Zap size={24}/></div>
        <p className={styles.kicker}>KOSTNADSKALKYL · ELAVTAL</p>
        <h1>Jämför två elavtal på samma årsförbrukning</h1>
        <p>Ange din årsförbrukning och de jämförbara elhandelspriserna från två erbjudanden. Vi räknar kWh-kostnad, fast avgift och rabatt över tolv månader.</p>
      </section>

      <section className={styles.consumption}>
        <label><span>Din årsförbrukning</span><div><input aria-label='Årsförbrukning i kWh' type='number' min='0' step='100' inputMode='numeric' value={annualKwh||''} onChange={event=>{setAnnualKwh(Math.max(0,Number(event.target.value)||0));setShowResult(false);tracked.current=false}}/><b>kWh/år</b></div></label>
        <p>Hämta helst faktisk årsförbrukning från elnätsbolaget eller senaste 12 månaderna.</p>
      </section>

      <section className={styles.offers} aria-label='Jämför två elavtal'>
        <OfferCard offer={a} setOffer={offer=>{setA(offer);setShowResult(false);tracked.current=false}} testId='electricity-offer-a'/>
        <OfferCard offer={b} setOffer={offer=>{setB(offer);setShowResult(false);tracked.current=false}} testId='electricity-offer-b'/>
      </section>

      <button type='button' className={styles.calculate} disabled={!ready} onClick={calculate}>Räkna årskostnaden <ArrowRight size={18}/></button>
      {!ready&&<p className={styles.prompt}>Fyll i årsförbrukning och jämförbart pris eller fast avgift för båda alternativen.</p>}

      {showResult&&ready&&<section className={styles.result} data-testid='electricity-cost-result' aria-live='polite'>
        <div className={styles.resultHead}>
          <span>JÄMFÖRELSE · ELHANDELSAVTALET</span>
          <h2>{winner==='same'?'Alternativen kostar lika mycket i kalkylen.':cheaperName+' är '+money.format(difference)+' billigare per år i kalkylen.'}</h2>
          <p>Detta är en kalkyl på de siffror du själv fyllt i – inte en prognos för framtida marknadspris.</p>
        </div>

        <div className={styles.resultGrid}>
          <article><small>{a.name.toUpperCase()}</small><strong data-testid='electricity-total-a'>{money.format(resultA.annualCost)}</strong><p>{money.format(resultA.variableCost)} rörlig del + {money.format(resultA.fixedCost)} fast avgift − {money.format(resultA.discount)} rabatt.</p><b>{decimal.format(resultA.effectiveOrePerKwh)} öre/kWh effektivt i denna kalkyl</b></article>
          <article><small>{b.name.toUpperCase()}</small><strong data-testid='electricity-total-b'>{money.format(resultB.annualCost)}</strong><p>{money.format(resultB.variableCost)} rörlig del + {money.format(resultB.fixedCost)} fast avgift − {money.format(resultB.discount)} rabatt.</p><b>{decimal.format(resultB.effectiveOrePerKwh)} öre/kWh effektivt i denna kalkyl</b></article>
        </div>

        <div className={styles.checks}>
          <p><Check size={16}/> Använd samma prisgrund för båda alternativen, exempelvis båda inklusive moms om erbjudandena redovisas så.</p>
          <p><Check size={16}/> Kontrollera avtalsform, bindningstid, uppsägningstid och vad som händer efter rabatt.</p>
          <p><Check size={16}/> Elnät, energiskatt och andra kostnader utanför själva elhandelsavtalet ingår inte här.</p>
        </div>

        <a href='#electricity-commercial-options' className={styles.continue} onClick={continueToPartners} data-testid='electricity-cost-commercial-cta'>Se aktiva elalternativ <ArrowRight size={18}/></a>
      </section>}

      <aside className={styles.note}>
        <strong>Viktigt om rörliga och kvartsbaserade priser</strong>
        <p>Framtida marknadspris är okänt. För sådana avtal fungerar verktyget bäst som ett jämförelsesätt för två erbjudanden på samma prisgrund eller som en ögonblicksbild. Det kan inte förutsäga nästa års elpris.</p>
      </aside>

      {showResult&&ready&&<section id='electricity-commercial-options' className={styles.partners}><PartnerDirectory category='el' intent='compare' heading='Aktiva elalternativ att jämföra'/></section>}
    </main>
  </>;
}
