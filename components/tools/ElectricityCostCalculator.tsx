import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calculator, Check, PiggyBank, Zap } from 'lucide-react';
import PartnerDirectory from '../PartnerDirectory';
import { getActivePartners } from '../../lib/partners';
import { calculateElectricityOffer, consumptionBand, differenceBand, type ElectricityOfferInput } from '../../lib/electricityCost';
import { emitAnalyticsEvent } from '../../lib/clientAttribution';
import styles from '../../styles/ElectricityCostCalculator.module.css';

type Offer = ElectricityOfferInput & { name:string };

const money=new Intl.NumberFormat('sv-SE',{style:'currency',currency:'SEK',maximumFractionDigits:0});
const decimal=new Intl.NumberFormat('sv-SE',{maximumFractionDigits:1});

const emptyOffer=(name:string):Offer=>({name,unitPriceOre:0,monthlyFee:0,annualDiscount:0});

function Field({label,value,onChange,suffix,forceZero=false}:{label:string;value:number;onChange:(value:number)=>void;suffix:string;forceZero?:boolean}){
  return <label className={styles.field}>
    <span>{label}</span>
    <div><input type='number' min='0' step='0.1' inputMode='decimal' value={forceZero?value:(value||'')} onChange={event=>onChange(Math.max(0,Number(event.target.value.replace(',','.'))||0))}/><b>{suffix}</b></div>
  </label>;
}

function OfferCard({offer,setOffer,testId,feesKnown,onFeeEntered}:{offer:Offer;setOffer:(offer:Offer)=>void;testId:string;feesKnown:boolean;onFeeEntered:(known:boolean)=>void}){
  return <section className={styles.offer} data-testid={testId}>
    <h3 className={styles.offerTitle}>{testId==='electricity-offer-a'?'Alternativ A':'Alternativ B'}</h3>
    <div className={styles.grid}>
      <Field label='Elhandelspris att jämföra' value={offer.unitPriceOre} suffix='öre/kWh' onChange={value=>setOffer({...offer,unitPriceOre:value})}/>
      <label className={styles.field}><span>Fast avgift (skriv 0 om ingen)</span>
        <div><input type='number' min='0' step='1' inputMode='decimal' aria-label='Fast avgift (skriv 0 om ingen)' value={feesKnown?offer.monthlyFee:''} onChange={event=>{onFeeEntered(event.target.value.trim()!=='');setOffer({...offer,monthlyFee:Math.max(0,Number(event.target.value)||0)});}}/><b>kr/mån</b></div>
      </label>
    </div>
    <details className={styles.extraDetails}>
      <summary>Rabatt och namn (valfritt)</summary>
      <div className={styles.extraBody}>
        <label className={styles.nameField}><span>Namn på alternativet</span><input value={offer.name} maxLength={40} onChange={event=>setOffer({...offer,name:event.target.value})}/></label>
        <Field label='Rabatt totalt under 12 mån' value={offer.annualDiscount} suffix='kr' onChange={value=>setOffer({...offer,annualDiscount:value})}/>
      </div>
    </details>
  </section>;
}

export default function ElectricityCostCalculator(){
  const [annualKwh,setAnnualKwh]=useState(0);
  const [a,setA]=useState<Offer>(emptyOffer('Alternativ A'));
  const [b,setB]=useState<Offer>(emptyOffer('Alternativ B'));
  const [showResult,setShowResult]=useState(false);
  const [startMode,setStartMode]=useState<'none'|'have_offers'|'find_offers'>('none');
  const [consumptionExample,setConsumptionExample]=useState(false);
  const [feesKnown,setFeesKnown]=useState({a:false,b:false});
  const comparison=getActivePartners('el',undefined,40).find(partner=>partner.name==='Elskling');
  const [source,setSource]=useState('direct');
  const tracked=useRef(false);

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search);
    const src=(params.get('src')||'direct').toLowerCase().replace(/[^a-z0-9_-]/g,'').slice(0,40)||'direct';
    setSource(src);
  },[]);

  const resultA=useMemo(()=>calculateElectricityOffer(annualKwh,a),[annualKwh,a]);
  const resultB=useMemo(()=>calculateElectricityOffer(annualKwh,b),[annualKwh,b]);
  const ready=annualKwh>0&&a.unitPriceOre>0&&b.unitPriceOre>0&&feesKnown.a&&feesKnown.b;
  const difference=ready?Math.abs(resultA.annualCost-resultB.annualCost):0;
  const winner=ready&&resultA.annualCost!==resultB.annualCost?(resultA.annualCost<resultB.annualCost?'a':'b'):'same';
  const cheaperName=winner==='a'?a.name:winner==='b'?b.name:'';

  const chooseStart=(mode:'have_offers'|'find_offers')=>{
    setStartMode(mode);
    setShowResult(false);
    tracked.current=false;
    emitAnalyticsEvent('electricity_cost_start_path',{source,path:mode});
  };
  const calculate=()=>{
    if(!ready) return;
    setShowResult(true);
    if(!tracked.current){
      tracked.current=true;
      emitAnalyticsEvent('electricity_cost_ready',{
        source,
        consumption_band:consumptionBand(annualKwh),
        winner,
        difference_band:differenceBand(difference),
      });
    }
  };

  const continueToPartners=()=>{
    emitAnalyticsEvent('electricity_cost_continue',{
      source,
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
        <p>Har du två erbjudanden att jämföra? Börja med ett enkelt val. Du kan också kontrollera aktuella avtal direkt utan att fylla i något.</p>
      </section>

      <section className={styles.startChoice} aria-labelledby='electricity-start-choice-title' data-testid='electricity-start-choice'>
        <h2 id='electricity-start-choice-title'>Har du två erbjudanden med priser?</h2>
        <p>Välj det som passar – du behöver inte kunna din elförbrukning för att hitta aktuella alternativ.</p>
        <div className={styles.startChoices}>
          <button type='button' aria-pressed={startMode==='have_offers'} onClick={()=>chooseStart('have_offers')}>Ja, jämför mina erbjudanden <ArrowRight size={18}/></button>
          <button type='button' aria-pressed={startMode==='find_offers'} onClick={()=>chooseStart('find_offers')}>Nej, visa aktuella elavtal <ArrowRight size={18}/></button>
        </div>
      </section>

      {startMode==='find_offers'&&<section className={styles.quickPartners} aria-label='Kontrollera elavtal hos partner' data-testid='electricity-no-offer-path'>
        <h2>Jämför aktuella alternativ utan att fylla i något här</h2>
        <p>Hos en jämförelsetjänst kan du kontrollera erbjudanden utifrån dina uppgifter. Vi hämtar inte livepriser och kan inte utse Sveriges billigaste elbolag.</p>
        {comparison&&<a className={styles.compareExit} href={comparison.trackingUrl}
          data-partner={comparison.name} data-category='el' data-intent='compare'
          data-placement='electricity_calculator_no_offer' data-partner-position='1'
          rel='sponsored nofollow noopener' target='_blank'
          onClick={()=>emitAnalyticsEvent('electricity_cost_early_partner',{source,path:'no_offers',partner_role:'comparison_service'})}>
          Jämför elavtal hos Elskling <ArrowRight size={18}/></a>}
        <Link className={styles.allSuppliers} href='/elavtal/'>Se våra aktiva elbolag <ArrowRight size={16}/></Link>
        <p className={styles.commercialDisclosure}>Partnerlänk: vi kan få provision om du blir kund. Du behöver kontrollera aktuellt pris, avgifter och villkor hos tjänsten.</p>
      </section>}

      {startMode==='have_offers'&&<>
        <section className={styles.consumption}>
          <p className={styles.stepLabel}>1 · ÅRSFÖRBRUKNING</p>
          <h2>Hur mycket el använder du per år?</h2>
          <div className={styles.quickKwh} aria-label='Exempel på årsförbrukning'>
            {[2000,5000,20000].map(kwh=><button type='button' key={kwh} aria-pressed={annualKwh===kwh&&consumptionExample}
             onClick={()=>{setAnnualKwh(kwh);setConsumptionExample(true);setShowResult(false);tracked.current=false}}>{kwh.toLocaleString('sv-SE')} kWh</button>)}
          </div>
          <label><span>Din årsförbrukning</span><div><input aria-label='Årsförbrukning i kWh' type='number' min='0' step='100' inputMode='numeric' value={annualKwh||''} onChange={event=>{setAnnualKwh(Math.max(0,Number(event.target.value)||0));setConsumptionExample(false);setShowResult(false);tracked.current=false}}/><b>kWh/år</b></div></label>
          <p>{consumptionExample?'Du använder just nu ett räkneexempel. Välj din verkliga årsförbrukning för att jämföra dina erbjudanden.':'Använd helst faktisk årsförbrukning från din senaste elräkning eller elnätsbolaget.'}</p>
        </section>
        <div className={styles.offerIntro}>
          <p className={styles.stepLabel}>2 · DINA ERBJUDANDEN</p>
          <h2>Fyll i två elhandelspriser</h2>
          <p>För att jämföra hela elhandelskostnaden behöver vi också veta fast avgift. Skriv 0 kr om den saknas. Rabatt och namn är valfria.</p>
        </div>
        <section className={styles.offers} aria-label='Jämför två elavtal'>
          <OfferCard offer={a} setOffer={offer=>{setA(offer);setShowResult(false);tracked.current=false}} testId='electricity-offer-a'
            feesKnown={feesKnown.a} onFeeEntered={known=>setFeesKnown(prev=>({...prev,a:known}))}/>
          <OfferCard offer={b} setOffer={offer=>{setB(offer);setShowResult(false);tracked.current=false}} testId='electricity-offer-b'
            feesKnown={feesKnown.b} onFeeEntered={known=>setFeesKnown(prev=>({...prev,b:known}))}/>
        </section>
        <button type='button' className={styles.calculate} disabled={!ready} onClick={calculate}>Räkna årskostnaden <ArrowRight size={18}/></button>
        {!ready&&<p className={styles.prompt}>Fyll i årsförbrukning, pris och fast avgift (skriv 0 om ingen) för båda alternativen – eller välj att kontrollera aktuella elavtal direkt ovan.</p>}
        <div className={styles.earlyAlternative}><span>Har du inga fullständiga priser?</span><button type='button' onClick={()=>chooseStart('find_offers')}>Jämför aktuella avtal i stället <ArrowRight size={16}/></button></div>
      </>}

      {showResult&&ready&&<section className={styles.result} data-testid='electricity-cost-result' aria-live='polite'>
        <div className={styles.resultHead}>
          <span>JÄMFÖRELSE · ELHANDELSAVTALET</span>
          <h2>{winner==='same'?'Alternativen kostar lika mycket i kalkylen.':cheaperName+' är '+money.format(difference)+' billigare per år i kalkylen.'}</h2>
          <p>Detta är en kalkyl på de siffror du själv fyllt i – inte en prognos för framtida marknadspris. Om du valde ett förbrukningsexempel är resultatet också illustrativt, inte en personlig besparing.</p>
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

      {startMode==='have_offers'&&<aside className={styles.note}>
        <strong>Viktigt om rörliga och kvartsbaserade priser</strong>
        <p>Framtida marknadspris är okänt. För sådana avtal fungerar verktyget bäst som ett jämförelsesätt för två erbjudanden på samma prisgrund eller som en ögonblicksbild. Det kan inte förutsäga nästa års elpris.</p>
      </aside>}

      {showResult&&ready&&<section id='electricity-commercial-options' className={styles.partners}><PartnerDirectory category='el' intent='compare' heading='Aktiva elalternativ att jämföra'/></section>}
    </main>
  </>;
}
