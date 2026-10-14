import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronRight, PiggyBank, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';
import { getActivePartners, type PartnerCategory, type PartnerIntent } from '../lib/partners';
import styles from '../styles/SmartSelector.module.css';

export type SelectorOption = { label: string; points: number };
export type SelectorQuestion = { title: string; help: string; options: SelectorOption[] };
export type SelectorResult = { min: number; label: string; title: string; text: string; bullets: string[]; cta: string; href: string };

type Props = {
  eyebrow: string;
  title: string;
  intro: string;
  questions: SelectorQuestion[];
  results: SelectorResult[];
  disclaimer: string;
  backHref?: string;
  backLabel?: string;
  partnerCategory?: PartnerCategory;
  partnerIntent?: PartnerIntent;
};

/* Well-established, correctly attributed partner destinations are kept unchanged.
 * The form is only a preliminary need profile, never an actual supplier price quote.
 */
const categoryHome:Partial<Record<PartnerCategory,string>>={
 bredband:'/bredband/',el:'/elavtal/',mobil:'/mobil/',forsakring:'/forsakring/',ekonomi:'/ekonomi/'
};
const introCopy:Partial<Record<PartnerCategory,string>>={
 bredband:'Hela hemmets uppkoppling börjar med rätt behov.',
 mobil:'Betala för surf du använder, inte en större siffra.',
 el:'Välj avtalsform med koll på hur ditt hem fungerar.'
};

export default function SmartSelector({ eyebrow, title, intro, questions, results, disclaimer, backHref='/', backLabel='Sänk Kostnaden', partnerCategory, partnerIntent }: Props) {
  // -1 unanswered, -2 consciously skipped. Skipping never fabricates a low-use profile.
  const [answers,setAnswers]=useState<number[]>(()=>Array(questions.length).fill(-1));
  const [step,setStep]=useState(0);
  const questionFocus=useRef<HTMLHeadingElement>(null);
  const resultFocus=useRef<HTMLHeadingElement>(null);
  const answered=answers.filter(v=>v>=0).length;
  const skipped=answers.filter(v=>v===-2).length;
  const reviewed=answered+skipped;
  const complete=step===questions.length;
  const hasProfile=complete&&answered>0;
  const score=answers.reduce((sum,answer,index)=>sum+(answer>=0?questions[index].options[answer].points:0),0);
  const result=useMemo(()=>[...results].reverse().find(item=>score>=item.min)||results[0],[results,score]);
  const firstPartner=partnerCategory?getActivePartners(partnerCategory,partnerIntent,1)[0]:undefined;
  const directPartner=partnerCategory==='bredband'||partnerCategory==='el'?firstPartner:undefined;
  const current=questions[step];
  const categoryTarget=partnerCategory?categoryHome[partnerCategory]||'/#kostnadskartan':'/#kostnadskartan';

  // Move keyboard focus to the new question/result once a person has made a choice.
  // Initial hydration keeps ordinary tab order; no forced focus on first load.
  useEffect(()=>{
    if(step===0)return;
    (complete?resultFocus:questionFocus).current?.focus();
  },[step,complete]);

  const choose=(optionIndex:number)=>{
    setAnswers(currentAnswers=>currentAnswers.map((value,index)=>index===step?optionIndex:value));
    setStep(currentStep=>Math.min(questions.length,currentStep+1));
  };
  const skip=()=>choose(-2);
  const previous=()=>setStep(value=>Math.max(0,value-1));
  const continueForward=()=>setStep(value=>Math.min(questions.length,value+1));
  const reset=()=>{setAnswers(Array(questions.length).fill(-1));setStep(0);};

  return <>
    <header className={styles.topbar}>
      <Link className={styles.brand} href='/'><span><PiggyBank size={20}/></span><strong>Sänk Kostnaden</strong></Link>
      <nav aria-label='Huvudmeny'><Link href='/bredband/'>Bredband</Link><Link href='/elavtal/'>El</Link><Link href='/mobil/'>Mobil</Link><Link href='/forsakring/'>Försäkring</Link><Link href='/ekonomi/'>Ekonomi</Link></nav>
      <Link className={styles.topbarCta} href={categoryTarget}>Jämför direkt <ArrowRight size={15}/></Link>
    </header>
    <main className={styles.shell} data-testid='smartselector-flow'>
      <section className={styles.hero} data-category={partnerCategory||'other'}>
        <div className={styles.heroPhoto} aria-hidden='true'>
          <img src='/design/cost-map-home.webp' width={1200} height={1200}
            alt='' decoding='async' data-testid='smartselector-hero-photo'/>
        </div>
        <div className={styles.heroInner}>
          <Link className={styles.back} href={backHref}><ArrowLeft size={15}/> {backLabel}</Link>
          <span className={styles.eyebrow}><Sparkles size={16} aria-hidden='true'/> {eyebrow}</span>
          <h1>{title.includes('bredbandshastighet')?<>
            {title.split('bredbandshastighet')[0]}bredbands<wbr/>hastighet{title.split('bredbandshastighet')[1]}
          </>:title}</h1>
          <p className={styles.intro}>{intro}</p>
          <p className={styles.valueLine}><ShieldCheck size={17} aria-hidden='true'/> {partnerCategory?introCopy[partnerCategory]||'Ett val i taget, helt utan konto.':'Ett val i taget, helt utan konto.'}</p>
        </div>
      </section>

      <section className={styles.experience} aria-label='Ditt smarta vägval'>
        <div className={styles.progressRow}>
          <div><span className={styles.progressEyebrow}>DIN SNABBKOLL</span>
            <p>{complete?'Klart – nu har du en väg vidare':`Steg ${step+1} av ${questions.length}`}</p></div>
          <span className={styles.progressCount}>{Math.round((Math.min(step,questions.length)/questions.length)*100)}%</span>
        </div>
        <div className={styles.progress} role='progressbar' aria-label='Framsteg' aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={Math.min(step,questions.length)}>
          <i style={{width:`${Math.min(step,questions.length)/questions.length*100}%`}}/>
        </div>

        <div className={styles.layout}>
          <div className={styles.interaction}>
            {!complete&&current ? <section className={styles.question} data-testid='smartselector-active-question'>
              <p className={styles.questionEyebrow}>ETT VAL I TAGET <span>{String(step+1).padStart(2,'0')} / {String(questions.length).padStart(2,'0')}</span></p>
              <h2 ref={questionFocus} tabIndex={-1}>{current.title}</h2>
              <p className={styles.questionHelp}>{current.help}</p>
              <div className={styles.options} role='group' aria-label={current.title}>
                {current.options.map((option,optionIndex)=><button type='button' key={option.label}
                  className={answers[step]===optionIndex?styles.selected:undefined}
                  aria-pressed={answers[step]===optionIndex}
                  onClick={()=>choose(optionIndex)}>
                  <span>{option.label}</span><span className={styles.optionIndicator}>{answers[step]===optionIndex?<Check size={18}/>:<ChevronRight size={18}/>}</span>
                </button>)}
              </div>
              <div className={styles.questionActions}>
                {step>0&&<button type='button' className={styles.backButton} onClick={previous}><ArrowLeft size={17}/> Föregående</button>}
                {answers[step]!==-1&&<button type='button' className={styles.nextButton} onClick={continueForward}>Fortsätt <ArrowRight size={17}/></button>}
                <button type='button' className={styles.skipButton} onClick={skip}>Vet inte – hoppa över</button>
              </div>
            </section> : <section className={styles.finish} data-testid='smartselector-finished'>
              <span className={styles.finishIcon}><Check size={25} aria-hidden='true'/></span>
              <p className={styles.finishEyebrow}>DU ÄR KLAR</p>
              <h2 ref={resultFocus} tabIndex={-1}>{answered?'Bra, nu har du en tydligare riktning.':'Börja med att jämföra dina faktiska villkor.'}</h2>
              <p>{answered?'Vi har vägt samman dina svar till en första behovsprofil. Kontrollera alltid pris och villkor hos leverantören.':'Inga problem om du är osäker. Jämför utbud och villkor direkt, eller prova frågorna igen.'}</p>
              <div className={styles.finishActions}>
                <button type='button' className={styles.backButton} onClick={previous}><ArrowLeft size={17}/> Ändra senaste svaret</button>
                <button type='button' className={styles.backButton} onClick={reset}><RotateCcw size={16}/> Gör om snabbkollen</button>
              </div>
            </section>}
            {!complete&&<p className={styles.smallNote}>Dina svar används enbart här för att visa en generell behovsprofil. Du kan när som helst gå tillbaka eller hoppa över.</p>}
          </div>

          <aside className={`${styles.result} ${complete?styles.complete:''}`} data-testid='smartselector-result'>
            <p className={styles.resultEyebrow}>{complete?(hasProfile?result.label:'INGA SVAR ANGIVNA'):'DIN VÄG VIDARE'}</p>
            <h2>{hasProfile?result.title:complete?'Jämför rätt nivå på dina villkor.':'Få en tydlig väg vidare.'}</h2>
            <p>{hasProfile?result.text:complete?'Du har inte lämnat tillräckligt många uppgifter för en personlig behovsprofil. Kontrollera aktuella alternativ direkt hos leverantören.':'Få ett konkret nästa steg med så få frågor som möjligt. Frågorna hjälper dig att välja vad du ska jämföra – inte att förutsäga ett pris.'}</p>
            {!complete&&<div className={styles.interim}><span>{reviewed} / {questions.length}</span> steg avklarade <span aria-hidden='true'>↗</span></div>}
            {hasProfile&&<ul>{result.bullets.map(item=><li key={item}><Check size={17}/>{item}</li>)}</ul>}
            {complete&&skipped>0&&<p className={styles.uncertain}>Du hoppade över {skipped} {skipped===1?'fråga':'frågor'}. Profilen är därför extra ungefärlig.</p>}
            {hasProfile&&directPartner&&<a className={styles.directPartner} href={directPartner.trackingUrl}
              data-partner={directPartner.name} data-category={directPartner.category}
              data-intent={partnerIntent||'compare'} data-placement='smart_selector_result'
              data-partner-position='1' target='_blank' rel='sponsored nofollow noopener'>
              Jämför nu hos {directPartner.name} <ArrowUpRight size={17}/></a>}
            {complete?<Link className={styles.resultLink} href={hasProfile?result.href:categoryTarget}>
              {hasProfile?result.cta:'Se jämförelsealternativ'} <ArrowRight size={18}/>
            </Link>:<Link className={styles.lightLink} href={categoryTarget}>Jag vill jämföra direkt <ArrowRight size={17}/></Link>}
            <small>{disclaimer}</small>
          </aside>
        </div>
      </section>
    </main>
  </>;
}
