import Head from 'next/head';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Gauge, PiggyBank, RotateCcw, Sparkles, Target, Zap } from 'lucide-react';
import styles from '../styles/App.module.css';

type CostKey = 'el' | 'bredband' | 'mobil' | 'forsakring';
type Answers = Record<CostKey, { monthly: number; reviewed: number; friction: number; fit: number }>;

type Category = {
  key: CostKey;
  label: string;
  short: string;
  href: string;
  reviewQuestion: string;
  frictionQuestion: string;
  fitQuestion: string;
  frictionOptions: Array<{ label: string; value: number }>;
  fitOptions: Array<{ label: string; value: number }>;
};

const categories: Category[] = [
  {
    key: 'el',
    label: 'Elavtal',
    short: 'El',
    href: '/elavtal/jamfor-elavtal/',
    reviewQuestion: 'När jämförde du elavtalet senast?',
    frictionQuestion: 'Hur ser avtalet ut idag?',
    fitQuestion: 'Hur aktiv vill du vara med elpriset?',
    frictionOptions: [{ label: 'Ingen bindning', value: 0 }, { label: 'Osäker', value: 1 }, { label: 'Bundet', value: 2 }],
    fitOptions: [{ label: 'Vill ha enkelt', value: 0 }, { label: 'Kan styra lite', value: 1 }, { label: 'Kan flytta förbrukning', value: 2 }],
  },
  {
    key: 'bredband',
    label: 'Bredband',
    short: 'Bredband',
    href: '/bredband/bredband-pa-min-adress/',
    reviewQuestion: 'När jämförde du bredbandet senast?',
    frictionQuestion: 'Hur säker är du på bindningstiden?',
    fitQuestion: 'Hur används uppkopplingen?',
    frictionOptions: [{ label: 'Ingen bindning', value: 0 }, { label: 'Osäker', value: 2 }, { label: 'Bundet', value: 1 }],
    fitOptions: [{ label: 'Lätt användning', value: 0 }, { label: 'Streaming / familj', value: 1 }, { label: 'Gaming / tungt', value: 2 }],
  },
  {
    key: 'mobil',
    label: 'Mobilabonnemang',
    short: 'Mobil',
    href: '/mobil/billigaste-mobilabonnemanget/',
    reviewQuestion: 'När jämförde du mobilabonnemangen senast?',
    frictionQuestion: 'Hur köper hushållet mobil idag?',
    fitQuestion: 'Hur mycket av surfen brukar faktiskt användas?',
    frictionOptions: [{ label: 'Familjelösning', value: 0 }, { label: 'Separata abonnemang', value: 2 }, { label: 'Blandat / osäker', value: 1 }],
    fitOptions: [{ label: 'Nästan allt', value: 0 }, { label: 'Ungefär hälften', value: 1 }, { label: 'Mycket blir över', value: 2 }],
  },
  {
    key: 'forsakring',
    label: 'Försäkring',
    short: 'Försäkring',
    href: '/forsakring/jamfor-forsakring/',
    reviewQuestion: 'När jämförde du försäkringarna senast?',
    frictionQuestion: 'Hur är försäkringarna samlade?',
    fitQuestion: 'Har du koll på självrisk och omfattning?',
    frictionOptions: [{ label: 'Samlade', value: 0 }, { label: 'Flera bolag', value: 1 }, { label: 'Ingen koll', value: 2 }],
    fitOptions: [{ label: 'Ja', value: 0 }, { label: 'Delvis', value: 1 }, { label: 'Nej', value: 2 }],
  },
];

const initialAnswers: Answers = {
  el: { monthly: 0, reviewed: 0, friction: 0, fit: 0 },
  bredband: { monthly: 0, reviewed: 0, friction: 0, fit: 0 },
  mobil: { monthly: 0, reviewed: 0, friction: 0, fit: 0 },
  forsakring: { monthly: 0, reviewed: 0, friction: 0, fit: 0 },
};

const reviewOptions = [
  { label: '< 6 mån', value: 0 },
  { label: '6–12 mån', value: 1 },
  { label: '1–2 år', value: 2 },
  { label: '2+ år / aldrig', value: 3 },
];

function level(score: number) {
  if (score >= 72) return 'Hög';
  if (score >= 42) return 'Medel';
  return 'Låg';
}

export default function SavingsApp() {
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [active, setActive] = useState<CostKey>('el');
  const [household, setHousehold] = useState(2);

  const results = useMemo(() => categories.map(category => {
    const answer = answers[category.key];
    const ageScore = answer.reviewed * 18;
    const frictionScore = answer.friction * 13;
    const fitScore = answer.fit * 10;
    const spendSignal = answer.monthly >= 1000 ? 12 : answer.monthly >= 500 ? 8 : answer.monthly > 0 ? 4 : 0;
    const householdSignal = category.key === 'mobil' && household >= 3 ? 8 : 0;
    const score = Math.min(100, ageScore + frictionScore + fitScore + spendSignal + householdSignal);
    const reasons: string[] = [];
    if (answer.reviewed >= 2) reasons.push('Avtalet har inte jämförts på länge');
    if (answer.friction >= 1) reasons.push(category.key === 'mobil' ? 'Upplägget kan vara värt att samla eller förenkla' : 'Villkor eller bindning bör kontrolleras');
    if (answer.fit >= 1) reasons.push(category.key === 'bredband' ? 'Behov och hastighet bör matchas bättre' : category.key === 'el' ? 'Din prisstrategi kan matchas bättre mot hur aktiv du vill vara' : 'Innehåll och faktisk användning bör matchas bättre');
    if (answer.monthly > 0) reasons.push(`Du betalar cirka ${answer.monthly.toLocaleString('sv-SE')} kr/mån här`);
    if (!reasons.length) reasons.push('Inga tydliga varningssignaler i dina svar');
    return { ...category, score, reasons, potential: level(score) };
  }).sort((a, b) => b.score - a.score), [answers, household]);

  const top = results[0];
  const completed = Object.values(answers).filter(answer => answer.monthly > 0 || answer.reviewed > 0 || answer.friction > 0 || answer.fit > 0).length;
  const totalMonthly = Object.values(answers).reduce((sum, answer) => sum + answer.monthly, 0);

  const update = (key: CostKey, field: keyof Answers[CostKey], value: number) => {
    setAnswers(previous => ({ ...previous, [key]: { ...previous[key], [field]: value } }));
  };

  const reset = () => {
    setAnswers(initialAnswers);
    setHousehold(2);
    setActive('el');
  };

  const activeCategory = categories.find(category => category.key === active)!;
  const activeAnswer = answers[active];

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
      </Head>
      <header className='topbar'>
        <Link className='brand' href='/'><span className='brandMark'><PiggyBank size={22} /></span><span>Sänk Kostnaden</span></Link>
      </header>

      <main className={styles.appShell}>
        <section className={styles.hero}>
          <Link className='back' href='/'><ArrowLeft size={16} /> Startsidan</Link>
          <div className={styles.badge}><Sparkles size={17} /> Kostnadskollen 2026</div>
          <h1>Var läcker ditt hushåll pengar?</h1>
          <p>Svara på några snabba frågor om dina avtal. I stället för att be dig räkna själv analyserar Kostnadskollen ålder, villkor, användning och hushållets upplägg – och bygger en personlig åtgärdsordning.</p>
          <div className={styles.heroStats}>
            <div><strong>{completed}/4</strong><span>områden analyserade</span></div>
            <div><strong>{totalMonthly ? `${totalMonthly.toLocaleString('sv-SE')} kr` : '—'}</strong><span>angiven kostnad / mån</span></div>
            <div><strong>{completed ? top.potential : '—'}</strong><span>högsta förbättringspotential</span></div>
          </div>
        </section>

        <section className={styles.diagnostic}>
          <div className={styles.progressRail}>
            {categories.map(category => {
              const result = results.find(item => item.key === category.key)!;
              return (
                <button key={category.key} className={active === category.key ? styles.activeTab : ''} onClick={() => setActive(category.key)}>
                  <span>{category.short}</span><b>{result.score}</b>
                </button>
              );
            })}
          </div>

          <div className={styles.questionCard}>
            <div className={styles.questionTop}>
              <div><span>ANALYS {categories.findIndex(category => category.key === active) + 1} / 4</span><h2>{activeCategory.label}</h2></div>
              <div className={styles.scoreOrb}><strong>{results.find(item => item.key === active)!.score}</strong><small>/100</small></div>
            </div>

            <div className={styles.householdRow}>
              <div><strong>Hushåll</strong><span>Påverkar främst hur vi bedömer mobilupplägg.</span></div>
              <div className={styles.stepper}><button onClick={() => setHousehold(Math.max(1, household - 1))}>−</button><strong>{household} pers</strong><button onClick={() => setHousehold(Math.min(8, household + 1))}>+</button></div>
            </div>

            <div className={styles.question}>
              <label>Ungefärlig kostnad per månad <small>frivilligt</small></label>
              <div className={styles.moneyInput}><input type='number' min='0' inputMode='numeric' value={activeAnswer.monthly || ''} onChange={event => update(active, 'monthly', Math.max(0, Number(event.target.value) || 0))} placeholder='t.ex. 499' /><span>kr/mån</span></div>
            </div>

            <ChoiceQuestion title={activeCategory.reviewQuestion} value={activeAnswer.reviewed} options={reviewOptions} onChange={value => update(active, 'reviewed', value)} />
            <ChoiceQuestion title={activeCategory.frictionQuestion} value={activeAnswer.friction} options={activeCategory.frictionOptions} onChange={value => update(active, 'friction', value)} />
            <ChoiceQuestion title={activeCategory.fitQuestion} value={activeAnswer.fit} options={activeCategory.fitOptions} onChange={value => update(active, 'fit', value)} />

            <div className={styles.cardActions}>
              <button className={styles.reset} onClick={reset}><RotateCcw size={15} /> Börja om</button>
              {active !== 'forsakring' ? <button className={styles.next} onClick={() => setActive(categories[categories.findIndex(category => category.key === active) + 1].key)}>Nästa område <ArrowRight size={17} /></button> : <a className={styles.next} href='#resultat'>Se min prioritering <Target size={17} /></a>}
            </div>
          </div>
        </section>

        <section id='resultat' className={styles.results}>
          <div className={styles.resultIntro}>
            <div><span>DIN PERSONLIGA KOSTNADSKARTA</span><h2>{completed ? `${top.label} bör kontrolleras först` : 'Din prioritering byggs medan du svarar'}</h2></div>
            <p>Poängen är en prioriteringssignal – inte ett löfte om en viss besparing. Den väger ihop dina egna svar så att du slipper gissa vilket avtal som är mest värt att börja med.</p>
          </div>

          <div className={styles.ranking}>
            {results.map((result, index) => (
              <article key={result.key} className={index === 0 && completed ? styles.topResult : ''}>
                <div className={styles.rank}><span>#{index + 1}</span><div className={styles.meter}><i style={{ width: `${Math.max(4, result.score)}%` }} /></div></div>
                <div className={styles.resultBody}>
                  <div><h3>{result.label}</h3><span className={styles.potential}>{result.potential} potential</span></div>
                  <ul>{result.reasons.slice(0, 3).map(reason => <li key={reason}><Check size={14} /> {reason}</li>)}</ul>
                </div>
                <div className={styles.resultScore}><strong>{result.score}</strong><small>/100</small><Link href={result.href}>Kontrollera nu <ArrowRight size={15} /></Link></div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.explain}>
          <Gauge size={25} />
          <div><strong>Vad betyder poängen?</strong><p>Den jämför inte ditt pris mot en dold eller påhittad marknadsdatabas. Högre poäng betyder att dina svar visar fler skäl att granska avtalet: lång tid sedan senaste jämförelsen, osäkra villkor, dålig matchning mot användningen eller ett upplägg som kan förenklas.</p></div>
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
