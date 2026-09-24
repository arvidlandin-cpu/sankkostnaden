import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Gauge, PiggyBank, RotateCcw, Sparkles, Target, Zap } from 'lucide-react';
import styles from '../styles/App.module.css';
import { getActivePartners, type PartnerIntent } from '../lib/partners';

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
    fitQuestion: 'Hur aktiv vill du vara med elpriset?',
    fitOptions: [{ label: 'Vill ha enkelt', value: 0 }, { label: 'Kan styra lite', value: 1 }, { label: 'Kan flytta förbrukning', value: 2 }],
  },
  {
    key: 'bredband',
    label: 'Bredband',
    short: 'Bredband',
    href: '/bredband/bredband-pa-min-adress/',
    reviewQuestion: 'När jämförde du bredbandet senast?',
    fitQuestion: 'Hur används uppkopplingen?',
    fitOptions: [{ label: 'Lätt användning', value: 0 }, { label: 'Streaming / familj', value: 1 }, { label: 'Gaming / tungt', value: 2 }],
  },
  {
    key: 'mobil',
    label: 'Mobilabonnemang',
    short: 'Mobil',
    href: '/mobil/billigaste-mobilabonnemanget/',
    reviewQuestion: 'När jämförde du mobilabonnemangen senast?',
    fitQuestion: 'Hur mycket av surfen brukar faktiskt användas?',
    fitOptions: [{ label: 'Nästan allt', value: 0 }, { label: 'Ungefär hälften', value: 1 }, { label: 'Mycket blir över', value: 2 }],
  },
  {
    key: 'forsakring',
    label: 'Försäkring',
    short: 'Försäkring',
    href: '/forsakring/jamfor-forsakring/',
    reviewQuestion: 'När jämförde du försäkringarna senast?',
    fitQuestion: 'Har du koll på självrisk och omfattning?',
    fitOptions: [{ label: 'Ja', value: 0 }, { label: 'Delvis', value: 1 }, { label: 'Nej', value: 2 }],
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

const storageKey='sankkostnaden-cost-check-v2';
const partnerIntent:Record<CostKey,PartnerIntent>={el:'electricity',bredband:'compare',mobil:'compare',forsakring:'home'};

function track(event:string,params:Record<string,string|number>){
  if(typeof window==='undefined') return;
  const w=window as any;
  if(typeof w.gtag==='function') w.gtag('event',event,params);
  else if(Array.isArray(w.dataLayer)) w.dataLayer.push({event,...params});
}

function level(score: number) {
  if (score >= 72) return 'Prioritera';
  if (score >= 42) return 'Kontrollera';
  return 'Lägre prioritet';
}

export default function SavingsApp() {
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [active, setActive] = useState<CostKey>('el');
  const [household, setHousehold] = useState(2);
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
        if(typeof parsed?.household==='number') setHousehold(Math.min(8,Math.max(1,parsed.household)));
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if(!hydrated) return;
    try { window.localStorage.setItem(storageKey,JSON.stringify({answers,household,updatedAt:Date.now()})); } catch {}
  }, [answers,household,hydrated]);

  const results = useMemo(() => categories.map(category => {
    const answer = answers[category.key];
    const ageScore = Math.max(0, answer.reviewed) * 18;
    const fitScore = Math.max(0, answer.fit) * 16;
    const spendSignal = answer.monthly >= 1000 ? 12 : answer.monthly >= 500 ? 8 : answer.monthly > 0 ? 4 : 0;
    const householdSignal = category.key === 'mobil' && household >= 3 ? 8 : 0;
    const score = Math.min(100, ageScore + fitScore + spendSignal + householdSignal);
    const reasons: string[] = [];
    if (answer.reviewed >= 2) reasons.push('Avtalet har inte jämförts på länge');
    if (answer.fit >= 1) reasons.push(category.key === 'bredband' ? 'Behov och hastighet bör matchas bättre' : category.key === 'el' ? 'Din prisstrategi kan matchas bättre mot hur aktiv du vill vara' : 'Innehåll och faktisk användning bör matchas bättre');
    if (answer.monthly > 0) reasons.push(`Du betalar cirka ${answer.monthly.toLocaleString('sv-SE')} kr/mån här`);
    if (!reasons.length) reasons.push('Inga tydliga varningssignaler i dina svar');
    return { ...category, score, reasons, potential: level(score) };
  }).sort((a, b) => b.score - a.score), [answers, household]);

  const isComplete=(key:CostKey)=>{ const a=answers[key]; return a.reviewed >= 0 && a.fit >= 0; };
  const evaluatedResults=results.filter(result=>isComplete(result.key));
  const top = evaluatedResults[0] || results[0];
  const completed = evaluatedResults.length;
  const totalMonthly = Object.values(answers).reduce((sum, answer) => sum + answer.monthly, 0);

  useEffect(() => {
    if(completed===4&&!completedTracked.current){
      completedTracked.current=true;
      track('cost_check_complete',{top_category:top.key,top_score:top.score,monthly_total:totalMonthly});
    }
  },[completed,top.key,top.score,totalMonthly]);

  const resultPartners=(key:CostKey)=>getActivePartners(key,partnerIntent[key],2);

  const update = (key: CostKey, field: keyof Answers[CostKey], value: number) => {
    setAnswers(previous => ({ ...previous, [key]: { ...previous[key], [field]: value } }));
    track('cost_check_answer',{category:key,field,value});
  };

  const reset = () => {
    setAnswers(initialAnswers);
    setHousehold(2);
    setActive('el');
    completedTracked.current=false;
    try { window.localStorage.removeItem(storageKey); } catch {}
    track('cost_check_reset',{source:'app'});
  };

  const activeCategory = categories.find(category => category.key === active)!;
  const activeAnswer = answers[active];
  const activeIndex=categories.findIndex(category=>category.key===active);
  const activeComplete=isComplete(active);
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
        <Link className='topbarCta' href='/#jamfor'>Jämför priser →</Link>
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
            <div><strong>{completed ? top.potential : '—'}</strong><span>högsta kontrollbehov</span></div>
          </div>
        </section>

        <section className={styles.diagnostic}>
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
              <div className={styles.scoreOrb}><strong>{activeComplete?'Klar':'2'}</strong><small>{activeComplete?'område klart':'frågor kvar'}</small></div>
            </div>

            {active==='mobil'&&<div className={styles.householdRow}>
              <div><strong>Hur många i hushållet?</strong><span>Används bara för att bedöma mobilupplägget.</span></div>
              <div className={styles.stepper}><button onClick={() => setHousehold(Math.max(1, household - 1))}>−</button><strong>{household} pers</strong><button onClick={() => setHousehold(Math.min(8, household + 1))}>+</button></div>
            </div>}

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
            <div><span>DIN PERSONLIGA KOSTNADSKARTA</span><h2>{completed ? `${top.label} bör kontrolleras först` : 'Din prioritering byggs medan du svarar'}</h2></div>
            <p>Prioriteringen bygger på dina egna svar: hur länge sedan du jämförde, hur väl avtalet verkar passa behovet och – om du fyller i den – ungefärlig månadskostnad.</p>
          </div>

          {completed===0 ? <div className={styles.ranking}><article><div className={styles.resultBody}><div><h3>Inget område bedömt ännu</h3></div><p>Svara klart på frågorna för ett område så visas det här. Vi rangordnar inget och visar inga partnerförslag innan det finns underlag.</p></div></article></div> :
          <div className={styles.ranking}>
            {evaluatedResults.map((result, index) => (
              <article key={result.key} className={index === 0 ? styles.topResult : ''}>
                <div className={styles.rank}><span>PRIORITET {index + 1}</span></div>
                <div className={styles.resultBody}>
                  <div><h3>{result.label}</h3><span className={styles.potential}>{result.potential}</span></div>
                  <ul>{result.reasons.slice(0, 2).map(reason => <li key={reason}><Check size={14} /> {reason}</li>)}</ul>
                </div>
                <div className={styles.resultActions}>
                  {resultPartners(result.key).slice(0,2).map((partner,partnerIndex)=><a key={partner.name} href={partner.trackingUrl} data-partner={partner.name} data-category={partner.category} data-intent={partnerIntent[result.key]} data-placement='cost_check_result' target='_blank' rel='sponsored nofollow noopener'>{partnerIndex===0?'Jämför hos ':'Alternativ: '}{partner.name} <ArrowUpRight size={14}/></a>)}
                  <Link href={result.href}>Jämför fler i guiden <ArrowRight size={14}/></Link>
                </div>
              </article>
            ))}
          </div>}
        </section>

        <section className={styles.explain}>
          <Gauge size={25} />
          <div><strong>Hur prioriteras områdena?</strong><p>Det är inget betyg och ingen prisranking. Vi använder bara dina svar för att sortera vilken kostnad som verkar mest rimlig att kontrollera först.</p></div>
          <Zap size={25} />
          <div><strong>Vad händer sedan?</strong><p>Du går direkt till rätt jämförelseguide. Där kontrollerar du pris, innehåll, bindningstid och avgifter innan du fattar ett beslut.</p></div>
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
