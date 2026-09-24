import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, PiggyBank, RotateCcw, Sparkles } from 'lucide-react';
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

export default function SmartSelector({ eyebrow, title, intro, questions, results, disclaimer, backHref='/', backLabel='Sänk Kostnaden', partnerCategory, partnerIntent }: Props) {
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const answered = answers.filter(value => value >= 0).length;
  const score = answers.reduce((sum, answer, index) => sum + (answer >= 0 ? questions[index].options[answer].points : 0), 0);
  const result = useMemo(() => [...results].reverse().find(item => score >= item.min) || results[0], [results, score]);
  const complete = answered === questions.length;
  const directPartner = partnerCategory ? getActivePartners(partnerCategory,partnerIntent,1)[0] : undefined;

  const choose = (questionIndex: number, optionIndex: number) => {
    setAnswers(current => current.map((value, index) => index === questionIndex ? optionIndex : value));
  };

  const reset = () => setAnswers(Array(questions.length).fill(-1));

  return (
    <>
      <header className={styles.topbar}>
        <Link className={styles.brand} href='/'><span><PiggyBank size={20} /></span><strong>Sänk Kostnaden</strong></Link>
        <nav><Link href='/bredband/'>Bredband</Link><Link href='/elavtal/'>El</Link><Link href='/mobil/'>Mobil</Link><Link href='/forsakring/'>Försäkring</Link><Link href='/ekonomi/'>Ekonomi</Link></nav>
        <Link className={styles.topbarCta} href='/#jamfor'>Jämför priser →</Link>
      </header>
      <main className={styles.shell}>
      <Link className={styles.back} href={backHref}>← {backLabel}</Link>
      <section className={styles.hero}>
        <span><Sparkles size={15} /> {eyebrow}</span>
        <h1>{title}</h1>
        <p>{intro}</p>
        <div className={styles.progress} role='progressbar' aria-label='Framsteg' aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={answered}><i style={{ width: `${(answered / questions.length) * 100}%` }} /></div>
        <small>{answered} av {questions.length} svar klara</small>
      </section>

      <section className={styles.layout}>
        <div className={styles.questions}>
          {questions.map((question, questionIndex) => (
            <article className={styles.question} key={question.title}>
              <div className={styles.questionHead}><b>0{questionIndex + 1}</b><div><h2>{question.title}</h2><p>{question.help}</p></div></div>
              <div className={styles.options}>
                {question.options.map((option, optionIndex) => (
                  <button className={answers[questionIndex] === optionIndex ? styles.selected : ''} key={option.label} onClick={() => choose(questionIndex, optionIndex)}>
                    <span>{answers[questionIndex] === optionIndex && <Check size={15} />}{option.label}</span>
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>

        <aside className={`${styles.result} ${complete ? styles.complete : ''}`}>
          <span className={styles.resultLabel}>{complete ? result.label : 'DIN PROFIL BYGGS'}</span>
          <h2>{complete ? result.title : 'Svara på frågorna så gör vi jobbet.'}</h2>
          <p>{complete ? result.text : 'Du får en konkret behovsprofil och ett tydligt nästa steg – utan att behöva kunna marknaden själv.'}</p>
          {complete && <ul>{result.bullets.map(item => <li key={item}><Check size={15} />{item}</li>)}</ul>}
          {complete && directPartner && <a href={directPartner.trackingUrl} data-partner={directPartner.name} data-category={directPartner.category} data-intent={partnerIntent||'compare'} data-placement='smart_selector_result' target='_blank' rel='sponsored nofollow noopener'>Jämför nu hos {directPartner.name} <ArrowUpRight size={17} /></a>}
          {complete && <Link href={result.href}>{directPartner?'Se jämförelseguiden först':result.cta} <ArrowRight size={17} /></Link>}
          <button className={styles.reset} onClick={reset}><RotateCcw size={14} /> Börja om</button>
          <small>{disclaimer}</small>
        </aside>
      </section>
      </main>
    </>
  );
}
