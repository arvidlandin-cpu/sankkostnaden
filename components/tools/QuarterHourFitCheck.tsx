import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { emitAnalyticsEvent } from '../../lib/clientAttribution';
import styles from './QuarterHourFitCheck.module.css';

type Flexibility = 'yes' | 'no' | 'unsure';
type Preference = 'flexibility' | 'simplicity' | 'unsure';

const shiftOptions: { value: Flexibility; label: string }[] = [
  { value: 'yes', label: 'Ja, t.ex. laddning eller värme' },
  { value: 'no', label: 'Nej, det mesta sker när det behövs' },
  { value: 'unsure', label: 'Jag vet inte' },
];

const preferenceOptions: { value: Preference; label: string }[] = [
  { value: 'flexibility', label: 'Kunna påverka kostnaden' },
  { value: 'simplicity', label: 'Slippa följa priserna ofta' },
  { value: 'unsure', label: 'Jag vet inte' },
];

function guidance(shift: Flexibility | null, preference: Preference | null) {
  if (!shift && !preference) {
    return {
      title: 'Börja med det du vet',
      text: 'Välj ett eller två svar. Du behöver inte kunna din förbrukning eller ange personuppgifter.',
      action: 'Svaren ger en första vägledning, inte ett prisbesked.',
    };
  }
  if (shift === 'no') {
    return {
      title: 'Jämför avtalsformer innan du väljer kvartspris',
      text: 'Om större delen av elen används när den behövs är nyttan av kvartspris mindre självklar. Månadspris eller fastpris kan vara enklare att hantera, men vilket som kostar minst går inte att avgöra här.',
      action: 'Jämför månadspris, fastpris och kvartspris med samma årsförbrukning.',
    };
  }
  if (shift === 'yes' && preference === 'flexibility') {
    return {
      title: 'Kvartspris kan vara värt att undersöka',
      text: 'Du har möjlighet att flytta större förbrukning och vill kunna styra den. Då kan kvartspris vara relevant, men det finns ingen garanterad besparing: prisvariationer, avgifter och din faktiska styrning avgör.',
      action: 'Kontrollera hur mycket el du verkligen kan flytta och jämför hela avtalet.',
    };
  }
  if (shift === 'yes' && preference === 'simplicity') {
    return {
      title: 'Väg styrmöjligheten mot enkelheten',
      text: 'Du kan flytta viss förbrukning men vill inte behöva bevaka priser ofta. Undersök om din utrustning kan styra automatiskt. Annars kan ett avtal med månadspris eller fastpris vara lättare att leva med.',
      action: 'Jämför hur mycket styrning som krävs innan du byter.',
    };
  }
  if (shift === 'yes') {
    return {
      title: 'Du har en möjlig fördel – kontrollera villkoren',
      text: 'Elbil, varmvatten eller värme som kan tidsstyras ger en möjlighet att dra nytta av billigare kvartar. Om det blir billigare totalt är fortfarande okänt.',
      action: 'Ta reda på om du kan schemalägga de största lasterna.',
    };
  }
  if (shift === 'unsure') {
    return {
      title: 'Ta reda på vad som går att flytta',
      text: 'Du behöver inte kunna din förbrukning i kWh för att börja. Se först om laddning, uppvärmning eller varmvatten kan styras till andra tider. Utan den uppgiften går det inte att bedöma kvartsprisets nytta.',
      action: 'Kolla i appar eller manualer om laddning och värme kan schemaläggas.',
    };
  }
  if (preference === 'simplicity') {
    return {
      title: 'Börja med en enklare avtalsjämförelse',
      text: 'Månadspris och fastpris kräver inte att du följer spotpriset varje kvart. De har ändå olika prisrisker och villkor, så kontrollera hela kostnaden.',
      action: 'Läs om skillnaden mellan avtalsformerna innan du väljer.',
    };
  }
  return {
    title: 'Undersök vad du kan styra först',
    text: 'Kvartspris följer elbörsens pris var femtonde minut. Om du kan flytta större förbrukning kan det vara intressant, men utan uppgifter om användning och villkor kan vi inte avgöra vad som blir billigast.',
    action: 'Börja med dina största förbrukare och jämför sedan hela avtalet.',
  };
}

export default function QuarterHourFitCheck() {
  const [shift, setShift] = useState<Flexibility | null>(null);
  const [preference, setPreference] = useState<Preference | null>(null);
  const completedTracked = useRef(false);
  const result = guidance(shift, preference);

  useEffect(() => {
    if (shift && preference && !completedTracked.current) {
      completedTracked.current = true;
      emitAnalyticsEvent('quarter_price_check_complete', { placement: 'kvartspris_guide' });
    }
  }, [shift, preference]);

  const selectShift = (value: Flexibility) => {
    setShift(value);
    emitAnalyticsEvent('quarter_price_check_answer', { question: 'shift', choice: value });
  };
  const selectPreference = (value: Preference) => {
    setPreference(value);
    emitAnalyticsEvent('quarter_price_check_answer', { question: 'preference', choice: value });
  };

  return (
    <section className={styles.root} aria-labelledby='quarter-check-title'>
      <div className={styles.intro}>
        <span className={styles.eyebrow}>TVÅ SNABBA FRÅGOR · INGA PERSONUPPGIFTER</span>
        <h2 id='quarter-check-title'>Passar kvartspris din vardag?</h2>
        <p>Priset ändras var 15:e minut. Svara utifrån hur du använder el – inte hur många kilowattimmar du kan utantill.</p>
      </div>

      <div className={styles.questions}>
        <fieldset className={styles.question}>
          <legend>1. Kan du flytta en större del av elanvändningen till andra tider?</legend>
          <p>Exempel: elbilsladdning, varmvatten eller uppvärmning.</p>
          <div className={styles.options}>
            {shiftOptions.map(option => (
              <button key={option.value} type='button' className={shift === option.value ? styles.selected : styles.option} aria-pressed={shift === option.value} onClick={() => selectShift(option.value)}>{option.label}</button>
            ))}
          </div>
        </fieldset>
        <fieldset className={styles.question}>
          <legend>2. Vad är viktigast för dig?</legend>
          <p>Du kan vara osäker – då visar vi vad du bör kontrollera först.</p>
          <div className={styles.options}>
            {preferenceOptions.map(option => (
              <button key={option.value} type='button' className={preference === option.value ? styles.selected : styles.option} aria-pressed={preference === option.value} onClick={() => selectPreference(option.value)}>{option.label}</button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className={styles.result} role='status' aria-live='polite' aria-atomic='true'>
        <span className={styles.resultLabel}>DIN VÄGLEDNING</span>
        <h3>{result.title}</h3>
        <p>{result.text}</p>
        <strong>{result.action}</strong>
        <div className={styles.actions}>
          <Link href='/elavtal/rorligt-fast-kvartspris/'>Förstå avtalsformerna →</Link>
          <a href='#guide-partners'>Se elalternativ att kontrollera →</a>
        </div>
      </div>

      <p className={styles.disclosure}>Det här är en första orientering, inte ett individuellt elpris eller en garanti om besparing. Jämför även påslag, månadsavgift, bindningstid och eventuella effektavgifter i ditt elnät. Våra partnerlänkar är kommersiella och omfattar inte hela marknaden.</p>
      <p className={styles.sources}>Faktaunderlag: <a href='https://ei.se/konsument/anvand-el-smartare/elhandelsavtal-med-kvartspris' target='_blank' rel='noopener noreferrer'>Energimarknadsinspektionen</a> och <a href='https://www.elskling.se/jamfor/elpriser/timpriser' target='_blank' rel='noopener noreferrer'>Elsklings guide</a>. Vägledningen använder inga livepriser.</p>
    </section>
  );
}
