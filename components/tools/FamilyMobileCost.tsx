import { useMemo, useRef, useState } from 'react';
import { ArrowRight, Check, Smartphone, Users } from 'lucide-react';
import PartnerDirectory from '../PartnerDirectory';
import { calculateFamilyMobileCost } from '../../lib/familyMobileCost';
import styles from '../../styles/FamilyMobileCost.module.css';

const money = new Intl.NumberFormat('sv-SE',{style:'currency',currency:'SEK',maximumFractionDigits:0});

function emitGa4(eventName:string,params:Record<string,string|number|boolean>={}){
  if(typeof window==='undefined') return;
  const w=window as Window & { gtag?:(...args:unknown[])=>void; dataLayer?:Record<string,unknown>[] };
  if(typeof w.gtag==='function') w.gtag('event',eventName,params);
  else if(Array.isArray(w.dataLayer)) w.dataLayer.push({event:eventName,...params});
}

function NumberField({label,value,onChange,suffix='kr/mån'}:{label:string;value:number;onChange:(value:number)=>void;suffix?:string}){
  return <label className={styles.field}>
    <span>{label}</span>
    <div><input type='number' min='0' inputMode='decimal' value={value||''} onChange={event=>onChange(Math.max(0,Number(event.target.value)||0))}/><b>{suffix}</b></div>
  </label>;
}

export default function FamilyMobileCost(){
  const [people,setPeople]=useState(4);
  const [separate,setSeparate]=useState<number[]>([0,0,0,0,0]);
  const [campaignMonths,setCampaignMonths]=useState(0);
  const [familyCampaignMain,setFamilyCampaignMain]=useState(0);
  const [familyCampaignExtra,setFamilyCampaignExtra]=useState(0);
  const [familyRegularMain,setFamilyRegularMain]=useState(0);
  const [familyRegularExtra,setFamilyRegularExtra]=useState(0);
  const [oneTimeFees,setOneTimeFees]=useState(0);
  const [showResult,setShowResult]=useState(false);
  const tracked=useRef(false);

  const result=useMemo(()=>calculateFamilyMobileCost({
    people,
    separateMonthly:separate,
    campaignMonths,
    familyCampaignMain,
    familyCampaignExtra,
    familyRegularMain,
    familyRegularExtra,
    oneTimeFees,
  }),[people,separate,campaignMonths,familyCampaignMain,familyCampaignExtra,familyRegularMain,familyRegularExtra,oneTimeFees]);

  const hasSeparate=separate.slice(0,people).every(value=>value>0);
  const hasFamily=familyRegularMain>0 || familyCampaignMain>0;
  const ready=hasSeparate&&hasFamily;

  const updateSeparate=(index:number,value:number)=>{
    setSeparate(current=>current.map((item,i)=>i===index?value:item));
    setShowResult(false);
    tracked.current=false;
  };

  const calculate=()=>{
    if(!ready) return;
    setShowResult(true);
    if(!tracked.current){
      tracked.current=true;
      emitGa4('family_mobile_cost_ready',{
        people,
        winner:result.winner,
        annual_difference:Math.round(Math.abs(result.annualDifference)),
        campaign_months:campaignMonths,
      });
    }
  };

  const continueToPartners=()=>{
    emitGa4('family_mobile_cost_continue',{
      people,
      winner:result.winner,
      annual_difference:Math.round(Math.abs(result.annualDifference)),
    });
  };

  return <>
    <section className={styles.tool} aria-label='Familjens mobilkostnad'>
      <div className={styles.people}>
        <div><small>1. FAMILJEN</small><h2>Hur många mobilabonnemang jämför ni?</h2></div>
        <div className={styles.peopleButtons}>{[2,3,4,5].map(n=><button key={n} type='button' className={people===n?styles.selected:''} onClick={()=>{setPeople(n);setShowResult(false);tracked.current=false}}>{n} personer</button>)}</div>
      </div>

      <div className={styles.columns}>
        <section className={styles.card}>
          <p className={styles.eyebrow}>SEPARATA ABONNEMANG</p>
          <h3>Vad kostar era nuvarande eller jämförda abonnemang?</h3>
          <p className={styles.help}>Fyll i månadskostnaden för varje person. Vi räknar samma kostnad över tolv månader.</p>
          <div className={styles.personGrid}>
            {Array.from({length:people},(_,index)=><NumberField key={index} label={'Person '+(index+1)} value={separate[index]||0} onChange={value=>updateSeparate(index,value)}/>)}
          </div>
          <div className={styles.subtotal}><span>Separat total idag</span><strong>{money.format(result.separateMonthlyTotal)}/mån</strong></div>
        </section>

        <section className={styles.card}>
          <p className={styles.eyebrow}>FAMILJEUPPLÄGG</p>
          <h3>Vad kostar huvudabonnemang och extra användare?</h3>
          <div className={styles.familyGrid}>
            <NumberField label='Ordinarie huvudabonnemang' value={familyRegularMain} onChange={value=>{setFamilyRegularMain(value);setShowResult(false);tracked.current=false}}/>
            <NumberField label='Ordinarie pris per extra användare' value={familyRegularExtra} onChange={value=>{setFamilyRegularExtra(value);setShowResult(false);tracked.current=false}}/>
            <NumberField label='Kampanjpris huvudabonnemang' value={familyCampaignMain} onChange={value=>{setFamilyCampaignMain(value);setShowResult(false);tracked.current=false}}/>
            <NumberField label='Kampanjpris per extra användare' value={familyCampaignExtra} onChange={value=>{setFamilyCampaignExtra(value);setShowResult(false);tracked.current=false}}/>
            <NumberField label='Kampanjmånader' value={campaignMonths} suffix='mån' onChange={value=>{setCampaignMonths(Math.min(12,Math.round(value)));setShowResult(false);tracked.current=false}}/>
            <NumberField label='Engångsavgifter totalt' value={oneTimeFees} suffix='kr' onChange={value=>{setOneTimeFees(value);setShowResult(false);tracked.current=false}}/>
          </div>
          <div className={styles.subtotal}><span>Ordinarie familjetotal</span><strong>{money.format(result.familyRegularMonthly)}/mån</strong></div>
        </section>
      </div>

      <button type='button' className={styles.calculate} disabled={!ready} onClick={calculate}>
        Räkna hela första året <ArrowRight size={18}/>
      </button>
      {!ready&&<p className={styles.prompt}>Fyll i kostnad för alla personer och minst ett familjepris för att jämföra.</p>}
    </section>

    {showResult&&ready&&<section className={styles.result} data-testid='family-mobile-result' aria-live='polite'>
      <div>
        <span>FAMILJENS ÅRSJÄMFÖRELSE</span>
        <h2>{result.winner==='family'?'Familjeupplägget är billigare i din kalkyl.':result.winner==='separate'?'Separata abonnemang är billigare i din kalkyl.':'Alternativen kostar lika mycket i din kalkyl.'}</h2>
        <p>Jämförelsen gäller de priser du själv fyllt i och säger inget om surf, täckning eller andra villkor.</p>
      </div>

      <div className={styles.resultGrid}>
        <article><small>SEPARATA · 12 MÅN</small><strong data-testid='separate-annual'>{money.format(result.separateAnnual)}</strong><p>{money.format(result.separateMonthlyTotal)}/mån × 12.</p></article>
        <article><small>FAMILJ · 12 MÅN</small><strong data-testid='family-annual'>{money.format(result.familyAnnual)}</strong><p>Effektivt {money.format(result.effectiveFamilyMonthly)}/mån inklusive kampanj och avgifter.</p></article>
        <article><small>SKILLNAD</small><strong data-testid='family-difference'>{money.format(Math.abs(result.annualDifference))}/år</strong><p>{result.winner==='same'?'Ingen prisskillnad i din kalkyl.':result.winner==='family'?'Till familjeuppläggets fördel.':'Till separata abonnemangs fördel.'}</p></article>
      </div>

      <div className={styles.checks}>
        <p><Check size={16}/> Kontrollera surf per person eller gemensam surfpott.</p>
        <p><Check size={16}/> Kontrollera nät och täckning där varje familjemedlem vistas.</p>
        <p><Check size={16}/> Kontrollera bindningstid, EU-surf och pris efter kampanj.</p>
      </div>

      <a href='#family-commercial-options' className={styles.continue} onClick={continueToPartners} data-testid='family-mobile-commercial-cta'>
        Se aktiva familjealternativ <ArrowRight size={18}/>
      </a>
    </section>}

    {showResult&&ready&&<section id='family-commercial-options' className={styles.partners}>
      <PartnerDirectory category='mobil' intent='family' heading='Aktiva mobilpartners med familjerelevans'/>
    </section>}
  </>;
}
