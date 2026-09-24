import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Gauge, PiggyBank, RotateCcw, Sparkles, Target, Zap } from 'lucide-react';
import styles from '../styles/App.module.css';
import { getActivePartners, PARTNER_LINK_CHECKED_LABEL, type PartnerIntent } from '../lib/partners';

type CostKey = 'el' | 'bredband' | 'mobil' | 'forsakring';
type Answers = Record<CostKey, { monthly: number; reviewed: number; fit: number }>;

type Category = {
  key: CostKey;
  label: string;
  short: string;
  href: string;
  reviewQuestion: string;
  fitQuestion: string;
  fitOptions: Array<{ label: string; value: number }>;
};

const categories: Category[] = [
  {
    key: 'el',
    label: 'Elavtal',
    short: 'El',
    href: '/elavtal/jamfor-elavtal/',
    reviewQuestion: 'När jämförde du elavtalet senast?',
    fitQuestion: 'Vad stämmer bäst om ditt elavtal?',
    fitOptions: [{ label: 'Jag har koll på pris och avgifter', value: 0 }, { label: 'Osäker på avgifter eller villkor', value: 1 }, { label: 'Pris eller kampanj kan ha ändrats', value: 2 }],
  },
  {
    key: 'bredband',
    label: 'Bredband',
    short: 'Bredband',
    href: '/bredband/bredband-pa-min-adress/',
    reviewQuestion: 'När jämförde du bredbandet senast?',
    fitQuestion: 'Vad stämmer bäst om bredbandet?',
    fitOptions: [{ label: 'Fart och pris känns rätt', value: 0 }, { label: 'Osäker på om nivån är rätt', value: 1 }, { label: 'Priset har höjts eller känns högt', value: 2 }],
  },
  {
    key: 'mobil',
    label: 'Mobilabonnemang',
    short: 'Mobil',
    href: '/mobil/billigaste-mobilabonnemanget/',
    reviewQuestion: 'När jämförde du mobilabonnemangen senast?',
    fitQuestion: 'Vad stämmer bäst om mobilabonnemanget?',
    fitOptions: [{ label: 'Surf och pris passar bra', value: 0 }, { label: 'Surfmängden passar dåligt', value: 1 }, { label: 'Upplägget är gammalt eller splittrat', value: 2 }],
  },
  {
    key: 'forsakring',
    label: 'Försäkring',
    short: 'Försäkring',
    href: '/forsakring/jamfor-forsakring/',
    reviewQuestion: 'När jämförde du försäkringarna senast?',
    fitQuestion: 'Hur bra koll har du på skyddet?',
    fitOptions: [{ label: 'Bra koll på skydd och självrisk', value: 0 }, { label: 'Delvis osäker', value: 1 }, { label: 'Vet inte vad som faktiskt ingår', value: 2 }],
  },
];

const initialAnswers: Answers = {
  el: { monthly: 0, reviewed: -1, fit: -1 },
  bredband: { monthly: 0, reviewed: -1, fit: -1 },
  mobil: { monthly: 0, reviewed: -1, fit: -1 },
  forsakring: { monthly: 0, reviewed: -1, fit: -1 },
};

const reviewOptions = [
  { label: '< 6 mån', value: 0 },
  { label: '6–12 mån', value: 1 },
  { label: '1–2 år', value: 2 },
  { label: '2+ år / aldrig', value: 3 },
];

const storageKey='sankkostnaden-cost-check-v3';
const partnerIntent:Record<CostKey,PartnerIntent>={el:'electricity',bredband:'compare',mobil:'compare',forsakring:'home'};

function track(event:string,params:Record<string,string|number>){
  if(typeof window==='undefined') return;
  const w=window as any;
  if(typeof w.gtag==='function') w.gtag('event',event,params);
  else if(Array.isArray(w.dataLayer)) w.dataLayer.push({event,...params});
}

const rankLabels=['KONTROLLERA FÖRST','DÄREFTER','SEDAN','SIST'];

export default function SavingsApp() {
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [active, setActive] = useState<CostKey>('el');
  const [hydrated,setHydrated] = useState(false);
  const completedTracked = useRef(false);
  const questionCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved=window.localStorage.getItem(storageKey);
      if(saved){
        const parsed=JSON.parse(saved);
        if(parsed?.answers) setAnswers({
          el:{...initialAnswers.el,...parsed.answers.el},
          bredband:{...initialAnswers.bredband,...parsed.answers.bredband},
          mobil:{...initialAnswers.mobil,...parsed.answers.mobil},
          forsakring:{...initialAnswers.forsakring,...parsed.answers.forsakring},
        });
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if(!hydrated) return;
    try { window.localStorage.setItem(storageKey,JSON.stringify({answers,updatedAt:Date.now()})); } catch {}
  }, [answers,hydrated]);

  const results = useMemo(() => categories.map(category => {
    const answer = answers[category.key];
    const reviewSignal = Math.max(0, answer.reviewed) * 12;
    const problemSignal = Math.max(0, answer.fit) * 25;
    const score = reviewSignal + problemSignal;
    const reasons: string[] = [];
    if (answer.reviewed >= 2) reasons.push('Det var länge sedan avtalet jämfördes');
    if (answer.fit >= 1) {
      if(category.key==='el') reasons.push(answer.fit===2?'Pris eller kampanj kan ha ändrats':'Avgifter eller villkor är inte helt tydliga');
      if(category.key==='bredband') reasons.push(answer.fit===2?'Priset har höjts eller känns högt':'Du är osäker på om hastighet och nivå passar behovet');
      if(category.key==='mobil') reasons.push(answer.fit===2?'Abonnemangsupplägget kan vara värt att samla eller uppdatera':'Surfmängden matchar inte användningen särskilt bra');
      if(category.key==='forsakring') reasons.push(answer.fit===2?'Du saknar koll på vad skyddet faktiskt omfattar':'Självrisk eller omfattning är inte helt tydlig');
    }
    if (answer.monthly > 0) reasons.push(`Angiven kostnad: cirka ${answer.monthly.toLocaleString('sv-SE')} kr/mån`);
    if (!reasons.length) reasons.push('Dina svar visar ingen tydlig brist just nu');
    return { ...category, score, monthly:answer.monthly, reasons };
  }).sort((a, b) => b.score-a.score || b.monthly-a.monthly), [answers]);

  const isComplete=(key:CostKey)=>{ const a=answers[key]; return a.reviewed >= 0 && a.fit >= 0; };
  const evaluatedResults=results.filter(result=>isComplete(result.key));
  const top = evaluatedResults[0] || results[0];
  const completed = evaluatedResults.length;
  const totalMonthly = Object.values(answers).reduce((sum, answer) => sum + answer.monthly, 0);

  useEffect(() => {
    if(completed===4&&!completedTracked.current){
      completedTracked.current=true;
      track('cost_check_complete',{top_category:top.key,monthly_total:totalMonthly});
    }
  },[completed,top.key,totalMonthly]);

  const resultPartners=(key:CostKey)=>key==='forsakring'?[]:getActivePartners(key,partnerIntent[key],2);

  const update = (key: CostKey, field: keyof Answers[CostKey], value: number) => {
    setAnswers(previous => ({ ...previous, [key]: { ...previous[key], [field]: value } }));
    track('cost_check_answer',{category:key,field,value});
  };

  const reset = () => {
    setAnswers(initialAnswers);
    setActive('el');
    completedTracked.current=false;
    try { window.localStorage.removeItem(storageKey); } catch {}
    track('cost_check_reset',{source:'app'});
  };

  const activeCategory = categories.find(category => category.key === active)!;
  const activeAnswer = answers[active];
  const activeIndex=categories.findIndex(category=>category.key===active);
  const activeComplete=isComplete(active);
  const remainingQuestions=(activeAnswer.reviewed<0?1:0)+(activeAnswer.fit<0?1:0);
  const topTied=completed===4&&evaluatedResults.length>1&&evaluatedResults[0].score===evaluatedResults[1].score&&evaluatedResults[0].monthly===evaluatedResults[1].monthly;
  const goNext=()=>{
    if(!activeComplete||activeIndex>=categories.length-1) return;
    setActive(categories[activeIndex+1].key);
    window.requestAnimationFrame(()=>questionCardRef.current?.scrollIntoView({behavior:'smooth',block:'start'}));
  };

  return (
    <>
      <Head>
        <title>Kostnadskollen – se vilka avtal du bör jämföra först | Sänk Kostnaden</title>
        <meta name='description' content='Använd Kostnadskollen för att se vilka fasta kostnader som är mest värda att granska först: el, bredband, mobil eller försäkring.' />
        <meta property='og:title' content='Kostnadskollen – se vilka avtal du bör jämföra först | Sänk Kostnaden' />
        <meta property='og:description' content='Se vilka fasta kostnader som är mest värda att granska först och gå vidare till rätt jämförelse.' />
        <meta property='og:url' content='https://sankkostnaden.se/app/' />
        <link rel='canonical' href='https://sankkostnaden.se/app/' />
        <meta name='robots' content='index,follow,max-image-preview:large,max-snippet:-1' />
        <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify({'@context':'https://schema.org','@type':'WebApplication',name:'Kostnadskollen',description:'Ett gratis verktyg som hjälper hushåll prioritera vilka återkommande avtal som är mest värda att granska först.',url:'https://sankkostnaden.se/app/',applicationCategory:'FinanceApplication',operatingSystem:'Web',isAccessibleForFree:true}) }} />
      </Head>
      <header className='topbar'>
        <Link className='brand' href='/'><span className='brandMark'><PiggyBank size={22} /></span><span>Sänk Kostnaden</span></Link>
        <nav><Link href='/bredband/'>Bredband</Link><Link href='/elavtal/'>El</Link><Link href='/mobil/'>Mobil</Link><Link href='/forsakring/'>Försäkring</Link><Link href='/ekonomi/'>Ekonomi</Link></nav>
        <a className='topbarCta' href={completed===4?'#resultat':'#fragor'}>{completed===4?'Se min prioritering →':'Starta kollen →'}</a>
      </header>

      <main className={styles.appShell}>
        <section className={styles.hero}>
          <Link className='back' href='/'><ArrowLeft size={16} /> Startsidan</Link>
          <div className={styles.badge}><Sparkles size={17} /> Kostnadskollen 2026</div>
          <h1>Var läcker ditt hushåll pengar?</h1>
          <p>Svara på två frågor per område. Kostnadskollen använder svaren för att visa vilket avtal som är mest värt att kontrollera först – utan ett svårtolkat poängbetyg.</p>
          <div className={styles.heroStats}>
            <div><strong>{completed}/4</strong><span>områden analyserade</span></div>
            <div><strong>{totalMonthly ? `${totalMonthly.toLocaleString('sv-SE')} kr` : '—'}</strong><span>angiven kostnad / mån</span></div>
            <div><strong>{completed===4?top.short:`${4-completed} kvar`}</strong><span>{completed===4?'bör kontrolleras först':'tills prioriteringen är klar'}</span></div>
          </div>
        </section>

        <section id='fragor' className={styles.diagnostic}>
          <div className={styles.progressRail}>
            {categories.map(category => {
              const result = results.find(item => item.key === category.key)!;
              return (
                <button key={category.key} className={active === category.key ? styles.activeTab : ''} onClick={() => {setActive(category.key);window.requestAnimationFrame(()=>questionCardRef.current?.scrollIntoView({behavior:'smooth',block:'start'}));}} aria-current={active===category.key?'step':undefined}>
                  <span>{category.short}</span><b>{isComplete(category.key)?'✓':'—'}</b>
                </button>
              );
            })}
          </div>

          <div ref={questionCardRef} className={styles.questionCard}>
            <div className={styles.questionTop}>
              <div><span>ANALYS {categories.findIndex(category => category.key === active) + 1} / 4</span><h2>{activeCategory.label}</h2></div>
              <div className={styles.scoreOrb}><strong>{activeComplete?'Klar':remainingQuestions}</strong><small>{activeComplete?'område klart':remainingQuestions===1?'fråga kvar':'frågor kvar'}</small></div>
            </div>

            <ChoiceQuestion title={activeCategory.reviewQuestion} value={activeAnswer.reviewed} options={reviewOptions} onChange={value => update(active, 'reviewed', value)} />
            <ChoiceQuestion title={activeCategory.fitQuestion} value={activeAnswer.fit} options={activeCategory.fitOptions} onChange={value => update(active, 'fit', value)} />

            <details className={styles.optionalCost} open={activeAnswer.monthly>0}>
              <summary>{activeAnswer.monthly>0?`${activeAnswer.monthly.toLocaleString('sv-SE')} kr/mån angivet`:'Lägg till månadskostnad (valfritt)'}</summary>
              <div className={styles.optionalCostBody}>
                <p>Beloppet kan hjälpa oss skilja två annars likvärdiga områden åt. Det behövs inte för att slutföra kollen.</p>
                <div className={styles.moneyInput}><input type='number' min='0' inputMode='numeric' value={activeAnswer.monthly || ''} onChange={event => update(active, 'monthly', Math.max(0, Number(event.target.value) || 0))} placeholder='t.ex. 499' /><span>kr/mån</span></div>
              </div>
            </details>

            <div className={styles.cardActions}>
              <button className={styles.reset} onClick={reset}><RotateCcw size={15} /> Börja om</button>
              {activeIndex<categories.length-1 ? <button className={styles.next} disabled={!activeComplete} onClick={goNext}>{activeComplete?`Klart – till ${categories[activeIndex+1].short}`:'Svara på båda frågorna'} <ArrowRight size={17} /></button> : activeComplete ? <a className={styles.next} href='#resultat'>Visa min prioritering <Target size={17} /></a> : <button className={styles.next} disabled>Svara på båda frågorna <Target size={17} /></button>}
            </div>
          </div>
        </section>

        <section id='resultat' className={styles.results}>
          <div className={styles.resultIntro}>
            <div><span>DIN PERSONLIGA KOSTNADSKARTA</span><h2>{completed===4 ? (topTied?'Flera områden är likvärdiga att kontrollera':`${top.label} bör kontrolleras först`) : `Slutför ${4-completed} område${4-completed===1?'':'n'} till`}</h2></div>
            <p>När alla fyra områden är klara får du en ordning baserad på faktiska varningssignaler i dina svar. Angiven månadskostnad används bara för att skilja annars likvärdiga områden. Partnerlänkarna är relevanta startpunkter, inte personligt prisrankade.</p>
          </div>

          {completed<4 ? <div className={styles.ranking}><article className={styles.incompleteResult}><div className={styles.resultBody}><div><h3>{completed}/4 områden klara</h3></div><p>Slutför alla fyra områden innan vi prioriterar eller visar partnerförslag. Då riskerar inte ett tidigt delresultat att styra dig fel.</p></div></article></div> :
          <div className={styles.ranking}>
            {evaluatedResults.map((result, index) => {
              const partners=resultPartners(result.key).slice(0,2);
              const nextResult=evaluatedResults[index+1];
              return <article id={`result-${result.key}`} key={result.key} className={index === 0 ? styles.topResult : ''}>
                <div className={styles.rank}><span>{evaluatedResults.some((other,j)=>j!==index&&other.score===result.score&&other.monthly===result.monthly)?'LIKVÄRDIG ATT KONTROLLERA':rankLabels[index]}</span></div>
                <div className={styles.resultBody}>
                  <div><h3>{result.label}</h3></div>
                  <ul>{result.reasons.slice(0, 2).map(reason => <li key={reason}><Check size={14} /> {reason}</li>)}</ul>
                </div>
                <div className={styles.resultActions}>
                  {partners.length>0&&<small className={styles.verifiedLine}>Partnerlänkar kontrollerade {PARTNER_LINK_CHECKED_LABEL}</small>}
                  {partners.map((partner,partnerIndex)=><a key={partner.name} href={partner.trackingUrl} data-partner={partner.name} data-category={partner.category} data-intent={partnerIntent[result.key]} data-placement='cost_check_result' data-partner-position={partnerIndex+1} data-result-rank={index+1} target='_blank' rel='sponsored nofollow noopener'>{partnerIndex===0?'Jämför hos ':'Alternativ: '}{partner.name} <ArrowUpRight size={14}/></a>)}
                  <Link href={result.href}>{result.key==='forsakring'?'Välj försäkringstyp':'Jämför fler i guiden'} <ArrowRight size={14}/></Link>
                  {nextResult&&<a className={styles.nextCategory} href={`#result-${nextResult.key}`} onClick={()=>track('cost_check_next_category',{from:result.key,to:nextResult.key,rank:index+1})}>När du är klar: {nextResult.short} <ArrowRight size={14}/></a>}
                </div>
              </article>;
            })}
          </div>}
        </section>

        <section className={styles.explain}>
          <Gauge size={25} />
          <div><strong>Hur prioriteras områdena?</strong><p>Det är inget betyg och ingen prisranking. Vi använder bara dina svar för att sortera vilken kostnad som verkar mest rimlig att kontrollera först.</p></div>
          <Zap size={25} />
          <div><strong>Vad händer sedan?</strong><p>Du kan gå direkt till en relevant partner eller öppna guiden för området. För försäkring väljer du först vilken typ av skydd du vill jämföra.</p></div>
        </section>
      </main>
    </>
  );
}

function ChoiceQuestion({ title, value, options, onChange }: { title: string; value: number; options: Array<{ label: string; value: number }>; onChange: (value: number) => void }) {
  return (
    <div className={styles.question}>
      <label>{title}</label>
      <div className={styles.choices}>{options.map(option => <button key={option.label} className={value === option.value ? styles.selected : ''} onClick={() => onChange(option.value)}>{option.label}</button>)}</div>
    </div>
  );
}
