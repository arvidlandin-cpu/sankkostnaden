import { useMemo, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, Smartphone, Users } from 'lucide-react';
import PartnerDirectory from '../PartnerDirectory';
import { getActivePartners } from '../../lib/partners';
import { calculateFamilyMobileCost } from '../../lib/familyMobileCost';
import { emitAnalyticsEvent } from '../../lib/clientAttribution';
import styles from '../../styles/FamilyMobileCost.module.css';

const money = new Intl.NumberFormat('sv-SE',{style:'currency',currency:'SEK',maximumFractionDigits:0});

function NumberField({label,value,onChange,suffix='kr/mån',showZero=false}:{label:string;value:number;onChange:(value:number,entered:boolean)=>void;suffix?:string;showZero?:boolean}){
  return <label className={styles.field}>
    <span>{label}</span>
    <div><input type='number' min='0' inputMode='decimal' value={showZero?value:(value||'')} onChange={event=>onChange(Math.max(0,Number(event.target.value)||0),event.target.value.trim()!=='')}/><b>{suffix}</b></div>
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
  const [startMode,setStartMode]=useState<'choose'|'have_prices'|'no_prices'>('choose');
  const [calcMode,setCalcMode]=useState<'quick'|'exact'>('quick');
  const [quickSeparateTotal,setQuickSeparateTotal]=useState(0);
  const [extraConfirmed,setExtraConfirmed]=useState(false);
  const familyPartners=getActivePartners('mobil','family',20).sort((a,b)=>a.name.localeCompare(b.name,'sv'));
  const tracked=useRef(false);

  const result=useMemo(()=>calculateFamilyMobileCost({
    people,
    separateMonthly:calcMode==='quick'?[quickSeparateTotal]:separate,
    campaignMonths:calcMode==='quick'?0:campaignMonths,
    familyCampaignMain:calcMode==='quick'?0:familyCampaignMain,
    familyCampaignExtra:calcMode==='quick'?0:familyCampaignExtra,
    familyRegularMain,
    familyRegularExtra,
    oneTimeFees:calcMode==='quick'?0:oneTimeFees,
  }),[people,separate,campaignMonths,familyCampaignMain,familyCampaignExtra,familyRegularMain,familyRegularExtra,oneTimeFees,calcMode,quickSeparateTotal]);

  const hasSeparate=calcMode==='quick'?quickSeparateTotal>0:separate.slice(0,people).every(value=>value>0);
  const hasFamily=calcMode==='quick'?familyRegularMain>0&&extraConfirmed:(familyRegularMain>0||familyCampaignMain>0);
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
      emitAnalyticsEvent('family_mobile_cost_ready',{
        people,
        winner:result.winner,
        mode:calcMode,
        difference_band:Math.abs(result.annualDifference)<1000?'under_1000':Math.abs(result.annualDifference)<5000?'1000_4999':'5000_plus',
      });
    }
  };

  const continueToPartners=()=>{
    emitAnalyticsEvent('family_mobile_cost_continue',{
      people,
      winner:result.winner,
      mode:calcMode,
    });
  };

  const chooseStart=(mode:'have_prices'|'no_prices')=>{
    setStartMode(mode);
    setShowResult(false);
    tracked.current=false;
    emitAnalyticsEvent('family_mobile_start_path',{source:'family_mobile_tool',path:mode,people});
  };
  const selectCalcMode=(mode:'quick'|'exact')=>{
    setCalcMode(mode);
    setShowResult(false);
    tracked.current=false;
  };

  return <>
    <section className={styles.tool} aria-label='Familjens mobilkostnad' data-testid='family-mobile-tool'>
      <div className={styles.people}>
        <div><small>1 · FAMILJEN</small><h2>Hur många mobilabonnemang gäller det?</h2></div>
        <div className={styles.peopleButtons}>{[2,3,4,5].map(n=><button key={n} type='button' aria-pressed={people===n} className={people===n?styles.selected:''} onClick={()=>{setPeople(n);setShowResult(false);tracked.current=false}}>{n} personer</button>)}</div>
      </div>
      <section className={styles.startCard} aria-labelledby='family-start-heading' data-testid='family-start-choice'>
        <span className={styles.stepLabel}>2 · HUR VILL DU BÖRJA?</span>
        <h2 id='family-start-heading'>Har du priser att jämföra?</h2>
        <p>Du kan se familjealternativ direkt. Vill du räkna använder vi bara priser som du själv anger.</p>
        <div className={styles.startChoices}>
          <button type='button' aria-pressed={startMode==='no_prices'} onClick={()=>chooseStart('no_prices')}>Nej, visa familjeabonnemang <ArrowRight size={19}/></button>
          <button type='button' aria-pressed={startMode==='have_prices'} onClick={()=>chooseStart('have_prices')}>Ja, räkna på våra priser <ArrowRight size={19}/></button>
        </div>
      </section>
      {startMode==='no_prices'&&<section className={styles.quickPartners} data-testid='family-mobile-no-prices'>
        <h2>Här är våra aktiva familjerelevanta mobilpartners</h2>
        <p>Kontrollera familjepriset, hur surfen fördelas, nät och eventuella bindningstider. Vi har ingen egen liveprislista och kan inte säga vilket abonnemang som är billigast för er.</p>
        <div className={styles.familyPartnerGrid}>
          {familyPartners.map((partner,index)=><a href={partner.trackingUrl} key={partner.name}
            data-partner={partner.name} data-category='mobil' data-intent='family'
            data-placement='family_calculator_no_prices' data-partner-position={index+1}
            rel='sponsored nofollow noopener' target='_blank'
            onClick={()=>emitAnalyticsEvent('family_mobile_early_partner',{source:'family_mobile_tool',path:'no_prices',people})}>
            <span>{partner.name}</span><ArrowUpRight size={17}/>
          </a>)}
        </div>
        <small>Partnerlänkar · vi kan få provision om du blir kund. Urvalet är inte hela marknaden och ordningen är alfabetisk, inte baserad på pris eller provision.</small>
      </section>}

      {startMode==='have_prices'&&<>
        <div className={styles.modePicker} role='group' aria-label='Välj jämförelseläge'>
          <button type='button' aria-pressed={calcMode==='quick'} onClick={()=>selectCalcMode('quick')}>Snabb jämförelse</button>
          <button type='button' aria-pressed={calcMode==='exact'} onClick={()=>selectCalcMode('exact')}>Exakt – med kampanjer och avgifter</button>
        </div>
        {calcMode==='quick'?
          <section className={styles.quickMath} data-testid='family-quick-calculator'>
            <h3>Tre priser räcker för att börja</h3>
            <p>Räkna med era verkliga vanliga månadspriser. Har ni kampanjpriser eller avgifter väljer du exakt jämförelse.</p>
            <NumberField label='Vad betalar ni tillsammans idag?' value={quickSeparateTotal} onChange={value=>{setQuickSeparateTotal(value);setShowResult(false);tracked.current=false;}}/>
            <div className={styles.quickMathGrid}>
              <NumberField label='Pris för familjens huvudabonnemang' value={familyRegularMain} onChange={value=>{setFamilyRegularMain(value);setShowResult(false);tracked.current=false;}}/>
              <NumberField label='Pris per extra person (skriv 0 om gratis)' value={familyRegularExtra} showZero={extraConfirmed}
                onChange={(value,entered)=>{setFamilyRegularExtra(value);setExtraConfirmed(entered);setShowResult(false);tracked.current=false;}}/>
            </div>
            <p className={styles.assumption}>Förenklad 12-månadersjämförelse med samma månadskostnad varje månad. Kampanjer och engångsavgifter är inte medräknade.</p>
          </section>
        :<div className={styles.columns} data-testid='family-exact-calculator'>
          <section className={styles.card}>
            <p className={styles.eyebrow}>SEPARATA ABONNEMANG</p>
            <h3>Vad betalar ni var och en?</h3>
            <p className={styles.help}>Ange priset för varje person. Vi räknar med samma månadskostnad under tolv månader.</p>
            <div className={styles.personGrid}>
              {Array.from({length:people},(_,index)=><NumberField key={index} label={'Person '+(index+1)} value={separate[index]||0} onChange={value=>updateSeparate(index,value)}/>)}
            </div>
            <div className={styles.subtotal}><span>Separat total</span><strong>{money.format(result.separateMonthlyTotal)}/mån</strong></div>
          </section>
          <section className={styles.card}>
            <p className={styles.eyebrow}>FAMILJEUPPLÄGG</p>
            <h3>Vilka priser gäller för familjeabonnemanget?</h3>
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
        </div>}
        <button type='button' className={styles.calculate} disabled={!ready} onClick={calculate}>
          {calcMode==='quick'?'Jämför era månadskostnader':'Räkna hela första året'} <ArrowRight size={18}/>
        </button>
        {!ready&&<p className={styles.prompt}>{calcMode==='quick'?'Fyll i hushållets månadskostnad, huvudabonnemangets pris och pris per extra person (även 0 om gratis).':'Ange pris för alla personer och familjeupplägget. Välj snabb jämförelse om du bara har månadssummorna.'}</p>}
        <button type='button' className={styles.switchPath} onClick={()=>chooseStart('no_prices')}>Vet du inte priserna? Se familjealternativ direkt <ArrowRight size={16}/></button>
      </>}
    </section>

    {showResult&&ready&&<section className={styles.result} data-testid='family-mobile-result' aria-live='polite'>
      <div>
        <span>FAMILJENS ÅRSJÄMFÖRELSE</span>
        <h2>{result.winner==='family'?'Familjeupplägget är billigare i din kalkyl.':result.winner==='separate'?'Separata abonnemang är billigare i din kalkyl.':'Alternativen kostar lika mycket i din kalkyl.'}</h2>
        <p>{calcMode==='quick'?'Förenklad jämförelse: samma månadskostnader över tolv månader, utan kampanj och engångsavgifter. Resultatet är inte en offert eller garanti om besparing.':'Jämförelsen gäller de priser du själv fyllt i och säger inget om surf, täckning eller andra villkor.'}</p>
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
