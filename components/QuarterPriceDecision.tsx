import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Gauge, Info } from 'lucide-react';
import { emitAnalyticsEvent } from '../lib/clientAttribution';
import styles from '../styles/QuarterPriceDecision.module.css';

type Shift='large'|'limited'|'unknown';
type Risk='okay'|'prefer-stable';
type Outcome={heading:string;explanation:string;action:string;destination:string};

const options:{value:Shift;label:string;detail:string}[]=[
  {value:'large',label:'Ja, större delar',detail:'Till exempel elbilsladdning, värme eller varmvatten'},
  {value:'limited',label:'Lite grann',detail:'Främst tvätt, disk eller mindre saker'},
  {value:'unknown',label:'Nej eller vet inte',detail:'Jag kan inte flytta så mycket, eller är osäker'},
];

function nextStep(shift:Shift,risk:Risk|null):Outcome{
  if(shift==='unknown'){
    return {
      heading:'Börja med att se vad du kan styra',
      explanation:'Utan större flyttbar förbrukning är det osäkert om kvartspris ger dig lägre kostnad. Jämför månadskostnad och avtalsvillkor först. Du behöver inte byta avtalsform för att sänka din förbrukning.',
      action:'Jämför hela elavtalet',
      destination:'/elavtal/jamfor-elavtal/',
    };
  }
  if(shift==='limited'){
    return {
      heading:'Jämför avgifter och avtalsform först',
      explanation:'Att flytta disk och tvätt kan hjälpa något, men mindre flyttbar förbrukning räcker inte för att avgöra vad som blir billigast. Kontrollera påslag, fast avgift och hur varierande priser påverkar dig.',
      action:'Jämför elavtal och villkor',
      destination:'/elavtal/jamfor-elavtal/',
    };
  }
  if(risk==='prefer-stable'){
    return {
      heading:'Väg styrbarheten mot prisvariationerna',
      explanation:'Du har större förbrukning som kan styras, men vill också ha mer förutsägbar kostnad. Jämför kvartspris med månadspris eller fast pris innan du väljer. Faktisk kostnad beror på när du använder elen.',
      action:'Jämför avtalsformer',
      destination:'/elavtal/rorligt-fast-kvartspris/',
    };
  }
  return {
    heading:'Kvartspris kan vara värt att undersöka',
    explanation:'Större förbrukning som går att flytta är en viktig förutsättning. Se vad som verkligen går att styra, jämför påslag och fasta avgifter och kontrollera hur priset varierar. Det är ingen garanti för lägre elräkning.',
    action:'Jämför elavtal och villkor',
    destination:'/elavtal/jamfor-elavtal/',
  };
}

export default function QuarterPriceDecision(){
  const [shift,setShift]=useState<Shift|null>(null);
  const [risk,setRisk]=useState<Risk|null>(null);
  const result=shift?nextStep(shift,risk):null;

  function selectShift(value:Shift){
    if(shift===value)return;
    setShift(value);
    setRisk(null);
    emitAnalyticsEvent('quarter_price_decision_answer',{source:'kvartspris_guide',question:'shift',answer:value});
  }
  function selectRisk(value:Risk){
    if(risk===value)return;
    setRisk(value);
    emitAnalyticsEvent('quarter_price_decision_answer',{source:'kvartspris_guide',question:'price_variation',answer:value});
  }

  return <section data-testid='quarter-price-decision' className={styles.root} aria-labelledby='quarter-price-decision-title'>
    <div className={styles.heading}>
      <div className={styles.icon} aria-hidden='true'><Gauge size={22}/></div>
      <div>
        <p className={styles.eyebrow}>SNABBKOLL · KVARTSPRIS</p>
        <h2 id='quarter-price-decision-title'>Kan kvartspris passa dig?</h2>
        <p className={styles.intro}>Börja med en enkel fråga. Du får ett nästa steg direkt, utan att fylla i elförbrukning eller personuppgifter.</p>
      </div>
    </div>

    <fieldset className={styles.question}>
      <legend>Kan du flytta större elanvändning till tider med lägre elpris?</legend>
      <div className={styles.options}>
        {options.map(option=><button key={option.value} type='button'
          className={styles.option} aria-pressed={shift===option.value}
          onClick={()=>selectShift(option.value)}>
          <strong>{option.label}</strong><span>{option.detail}</span>
        </button>)}
      </div>
    </fieldset>

    {result&&<div className={styles.result} aria-live='polite' data-testid='quarter-price-result'>
      <div className={styles.resultHeader}><CheckCircle2 aria-hidden='true' size={21}/>
        <div><p className={styles.resultEyebrow}>DIN NÄSTA KONTROLL – INTE EN PRISPROGNOS</p>
          <h3>{result.heading}</h3><p>{result.explanation}</p>
        </div>
      </div>
      <div className={styles.actions}>
        <Link href={result.destination}>{result.action}<ArrowRight aria-hidden='true' size={17}/></Link>
      </div>
    </div>}

    {shift==='large'&&<fieldset className={styles.question}>
      <legend>Vill du väga in hur priset kan variera? <span className={styles.optional}>(valfritt)</span></legend>
      <div className={styles.options} data-testid='quarter-price-risk'>
        <button type='button' className={styles.option} aria-pressed={risk==='okay'} onClick={()=>selectRisk('okay')}>
          <strong>Variation är okej</strong><span>Jag kan följa priset och anpassa mig</span>
        </button>
        <button type='button' className={styles.option} aria-pressed={risk==='prefer-stable'} onClick={()=>selectRisk('prefer-stable')}>
          <strong>Jag vill ha jämnare kostnad</strong><span>Förutsägbarhet är viktig för mig</span>
        </button>
      </div>
    </fieldset>}

    <p className={styles.source}><Info aria-hidden='true' size={17}/>
      <span>Vägledningen gäller bara avtalsform – inte vilket bolag som är billigast. Spotpris är inte hela elräkningen; elhandlarens påslag och moms tillkommer, och elnätskostnaden faktureras separat. Läs även <a href='https://ei.se/konsument/el/elavtal/olika-avtalstyper/kan-kvartsprisavtal-vara-bra-for-dig' target='_blank' rel='noopener noreferrer'>Energimarknadsinspektionens vägledning</a>.</span>
    </p>
  </section>;
}
