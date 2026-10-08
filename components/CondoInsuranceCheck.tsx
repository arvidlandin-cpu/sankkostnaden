import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, CircleHelp, FileCheck2, ShieldCheck } from 'lucide-react';
import { emitAnalyticsEvent } from '../lib/clientAttribution';
import styles from '../styles/CondoInsuranceCheck.module.css';

type Answer='yes'|'no'|'unknown';
type Result={heading:string;details:string;steps:string[]};

function resultFor(collective:Answer,personal:Answer|null):Result{
 const collectiveMessages:Record<Answer,Result>={
  yes:{
   heading:'Kontrollera vad föreningens tillägg faktiskt omfattar',
   details:'Ett kollektivt bostadsrättstillägg kan göra ett eget tillägg överflödigt, men det beror på omfattning och villkor.',
   steps:['Be föreningens styrelse eller förvaltare om försäkringsbolag och aktuella villkor.','Jämför självrisk, åldersavdrag, ersättningsgränser och eventuella undantag med ditt eget skydd.','Avsluta inte ett befintligt tillägg förrän du har verifierat att du är tillräckligt försäkrad.']
  },
  no:{
   heading:'Kontrollera att du har ett eget bostadsrättstillägg',
   details:'Om föreningen saknar kollektivt tillägg behöver du normalt se till att ett bostadsrättstillägg finns via din egen försäkring.',
   steps:['Kontrollera på försäkringsbrevet om bostadsrättstillägg ingår eller måste läggas till.','Jämför vad tillägget ersätter, självrisk och åldersavdrag.','Jämför sedan total premie för ett likvärdigt skydd, inte bara ett introduktionspris.']
  },
  unknown:{
   heading:'Börja med att fråga föreningen',
   details:'Utan besked från föreningen går det inte att avgöra om ditt eget bostadsrättstillägg är nödvändigt eller om skyddet överlappar.',
   steps:['Fråga styrelsen eller förvaltaren om ett kollektivt bostadsrättstillägg ingår.','Be om försäkringsbolag, aktuell omfattning, självrisk och vem som anmäler en skada.','Jämför föreningens besked med ditt befintliga försäkringsbrev innan något sägs upp.']
  }
 };
 const data=collectiveMessages[collective];
 if(personal==='no')return {...data,steps:['Se först till att du har en vanlig hemförsäkring för ditt hushåll. Föreningens bostadsrättstillägg ersätter inte den.',...data.steps]};
 if(personal==='unknown')return {...data,steps:['Ta fram försäkringsbrevet eller kontakta försäkringsbolaget och kontrollera att vanlig hemförsäkring gäller.',...data.steps]};
 return data;
}

export default function CondoInsuranceCheck(){
 const [collective,setCollective]=useState<Answer|null>(null);
 const [personal,setPersonal]=useState<Answer|null>(null);
 const result=collective?resultFor(collective,personal):null;
 const choose=(field:'collective'|'personal',answer:Answer)=>{
  if(field==='collective')setCollective(answer);else setPersonal(answer);
  emitAnalyticsEvent('condo_protection_answer',{source:'condo_insurance_guide',question:field,answer});
 };
 const reset=()=>{setCollective(null);setPersonal(null);};
 return <section className={styles.root} aria-labelledby='condo-insurance-check-title' data-testid='condo-insurance-check'>
  <div className={styles.head}>
   <div className={styles.icon}><ShieldCheck size={24}/></div>
   <div><p className={styles.eyebrow}>2 FRÅGOR · BOSTADSRÄTTSFÖRSÄKRING</p>
    <h2 id='condo-insurance-check-title'>Betalar du för ett tillägg som redan finns?</h2>
    <p>Få en trygg kontrollista innan du jämför premie eller ändrar försäkring. Du behöver inte uppge namn, adress eller försäkringsnummer.</p>
   </div>
  </div>
  <fieldset className={styles.question}>
   <legend>1. Har din bostadsrättsförening kollektivt bostadsrättstillägg?</legend>
   <div className={styles.options}>
    {[{label:'Ja',value:'yes'},{label:'Nej',value:'no'},{label:'Vet inte',value:'unknown'}].map(option=><button key={option.value} type='button' aria-pressed={collective===option.value} onClick={()=>choose('collective',option.value as Answer)}>{option.label}</button>)}
   </div>
  </fieldset>
  {collective&&<fieldset className={styles.question}>
   <legend>2. Har du själv en vanlig hemförsäkring?</legend>
   <div className={styles.options}>
    {[{label:'Ja',value:'yes'},{label:'Nej',value:'no'},{label:'Vet inte',value:'unknown'}].map(option=><button key={option.value} type='button' aria-pressed={personal===option.value} onClick={()=>choose('personal',option.value as Answer)}>{option.label}</button>)}
   </div>
  </fieldset>}
  {result&&<div className={styles.result} aria-live='polite'>
    <div className={styles.resultHead}><CheckCircle2 size={22}/><div><span>DIN NÄSTA KONTROLL · INGET FÖRSÄKRINGSBESLUT</span><h3>{result.heading}</h3><p>{result.details}</p></div></div>
    <ol>{result.steps.map(step=><li key={step}>{step}</li>)}</ol>
    <div className={styles.actions}>
     <Link href='/forsakring/jamfor-hemforsakring/'>Se relevanta hemförsäkringsalternativ <ArrowRight size={17}/></Link>
     <button type='button' onClick={reset}>Börja om</button>
    </div>
   </div>}
  <div className={styles.sources}>
   <FileCheck2 size={18}/>
   <p><strong>Kontrollera alltid villkoren.</strong> Vägledningen bygger på <a href='https://www.konsumenternas.se/forsakringar/boendeforsakringar/bostadsrattsforsakringar/' target='_blank' rel='noopener noreferrer'>Konsumenternas information om bostadsrättsförsäkring</a>. Föreningens och ditt försäkringsbolags faktiska villkor avgör ditt skydd.</p>
  </div>
 </section>;
}
