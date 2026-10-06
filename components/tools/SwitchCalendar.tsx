import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CalendarDays, Check, PiggyBank, RotateCcw } from 'lucide-react';
import PartnerDirectory from '../PartnerDirectory';
import { calculateSwitchPlan, daysBetween, type ContractMode, type NoticeUnit, type SwitchCategory } from '../../lib/switchCalendar';
import styles from '../../styles/SwitchCalendar.module.css';

type ResultState = ReturnType<typeof calculateSwitchPlan> & { daysUntilAction: number; state: 'passed' | 'soon' | 'open' };

const swedishDate = new Intl.DateTimeFormat('sv-SE', {
  dateStyle: 'long',
  timeZone: 'UTC',
});

function formatDate(value: string) {
  const parts = value.split('-').map(Number);
  return swedishDate.format(new Date(Date.UTC(parts[0], parts[1] - 1, parts[2])));
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function emitGa4(eventName: string, params: Record<string, string | number | boolean> = {}) {
  if (typeof window === 'undefined') return;
  const w = window as Window & { gtag?: (...args: unknown[]) => void; dataLayer?: Record<string, unknown>[] };
  if (typeof w.gtag === 'function') w.gtag('event', eventName, params);
  else if (Array.isArray(w.dataLayer)) w.dataLayer.push({ event: eventName, ...params });
}

export default function SwitchCalendar() {
  const [category, setCategory] = useState<SwitchCategory>('el');
  const [mode, setMode] = useState<ContractMode>('fixed');
  const [referenceDate, setReferenceDate] = useState('');
  const [noticeValue, setNoticeValue] = useState(1);
  const [noticeUnit, setNoticeUnit] = useState<NoticeUnit>('months');
  const [result, setResult] = useState<ResultState | null>(null);
  const [source, setSource] = useState('direct');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedCategory = params.get('kategori');
    if (requestedCategory === 'bredband' || requestedCategory === 'el') setCategory(requestedCategory);
    const src = (params.get('src') || 'direct').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 40) || 'direct';
    setSource(src);
  }, []);

  const unitLabel = noticeUnit === 'months'
    ? (noticeValue === 1 ? 'månad' : 'månader')
    : (noticeValue === 1 ? 'dag' : 'dagar');

  const resetResult = () => setResult(null);

  const calculate = () => {
    if (!referenceDate) return;
    const plan = calculateSwitchPlan({ category, mode, referenceDate, noticeValue, noticeUnit });
    const daysUntilAction = daysBetween(todayIso(), plan.actionDate);
    const state: ResultState['state'] = daysUntilAction < 0 ? 'passed' : daysUntilAction <= 14 ? 'soon' : 'open';
    const next = { ...plan, daysUntilAction, state };
    setResult(next);
    emitGa4('switch_calendar_ready', {
      source,
      category,
      contract_mode: mode,
      notice_value: noticeValue,
      notice_unit: noticeUnit,
      days_until_action: daysUntilAction,
      deadline_state: state,
    });
  };

  const continueToPartners = () => {
    if (!result) return;
    emitGa4('switch_calendar_continue', {
      source,
      category,
      contract_mode: mode,
      deadline_state: result.state,
    });
  };

  const resultHeading = useMemo(() => {
    if (!result) return '';
    if (result.state === 'passed') return 'Planeringsdatumet har redan passerat.';
    if (result.state === 'soon') return 'Du är nära det beräknade planeringsdatumet.';
    return 'Du har tid kvar enligt uppgifterna du fyllde i.';
  }, [result]);

  return (
    <>
      <header className={styles.topbar}>
        <Link href='/' className={styles.brand}><PiggyBank size={20}/><strong>Sänk Kostnaden</strong></Link>
        <span>Byteskalender</span>
      </header>

      <main className={styles.shell}>
        <Link href={category === 'el' ? '/elavtal/byta-elavtal/' : '/bredband/'} className={styles.back}>
          <ArrowLeft size={16}/> Till {category === 'el' ? 'byta elavtal' : 'bredband'}
        </Link>

        <section className={styles.hero}>
          <div className={styles.icon}><CalendarDays size={24}/></div>
          <p className={styles.kicker}>PLANERA BYTET</p>
          <h1>När behöver du agera för att kunna byta?</h1>
          <p>Fyll i datumen från ditt nuvarande avtal. Vi räknar en enkel planeringslinje utifrån den uppsägningstid du själv anger.</p>
        </section>

        <section className={styles.card}>
          <div className={styles.segment} aria-label='Kategori'>
            <button type='button' className={category === 'el' ? styles.selected : ''} onClick={() => { setCategory('el'); resetResult(); }}>Elavtal</button>
            <button type='button' className={category === 'bredband' ? styles.selected : ''} onClick={() => { setCategory('bredband'); resetResult(); }}>Bredband</button>
          </div>

          <div className={styles.question}>
            <span>1. Hur ser avtalet ut?</span>
            <div className={styles.options}>
              <button type='button' className={mode === 'fixed' ? styles.selected : ''} onClick={() => { setMode('fixed'); setReferenceDate(''); resetResult(); }}>
                Det har ett slutdatum
              </button>
              <button type='button' className={mode === 'rolling' ? styles.selected : ''} onClick={() => { setMode('rolling'); setReferenceDate(''); resetResult(); }}>
                Det löper tills jag säger upp
              </button>
            </div>
          </div>

          <label className={styles.dateField}>
            <span>{mode === 'fixed' ? '2. När slutar avtalet enligt villkoren?' : '2. Vilket datum tänker du säga upp avtalet?'}</span>
            <input type='date' value={referenceDate} onChange={event => { setReferenceDate(event.target.value); resetResult(); }} />
          </label>

          <div className={styles.question}>
            <span>3. Vilken uppsägningstid står i avtalet?</span>
            <div className={styles.noticeRow}>
              <input
                aria-label='Antal för uppsägningstid'
                type='number'
                inputMode='numeric'
                min='0'
                max={noticeUnit === 'months' ? 24 : 730}
                value={noticeValue}
                onChange={event => { setNoticeValue(Math.max(0, Number(event.target.value) || 0)); resetResult(); }}
              />
              <select aria-label='Enhet för uppsägningstid' value={noticeUnit} onChange={event => { setNoticeUnit(event.target.value as NoticeUnit); resetResult(); }}>
                <option value='months'>månader</option>
                <option value='days'>dagar</option>
              </select>
            </div>
          </div>

          <button type='button' className={styles.calculate} disabled={!referenceDate} onClick={calculate}>
            Räkna min bytesplan <ArrowRight size={18}/>
          </button>
        </section>

        {result && (
          <section className={styles.result} data-testid='switch-calendar-result' aria-live='polite'>
            <div className={styles.status + ' ' + styles[result.state]}>
              <span>{result.state === 'passed' ? 'KONTROLLERA AVTALET NU' : result.state === 'soon' ? 'NÄRA DATUMET' : 'PLANERINGSLÄGE'}</span>
              <h2>{resultHeading}</h2>
              <p>{mode === 'fixed'
                ? 'Beräkningen utgår från att avtalet slutar ' + formatDate(result.plannedEndDate) + ' och att uppsägningstiden är ' + noticeValue + ' ' + unitLabel + '.'
                : 'Beräkningen utgår från att du säger upp avtalet ' + formatDate(result.actionDate) + ' och att uppsägningstiden är ' + noticeValue + ' ' + unitLabel + '.'}
              </p>
            </div>

            <div className={styles.timeline}>
              <article>
                <small>{mode === 'fixed' ? 'BERÄKNAD SISTA DAG ATT AGERA' : 'UPPSÄGNINGSDAG DU ANGAV'}</small>
                <strong data-testid='switch-action-date'>{formatDate(result.actionDate)}</strong>
                <p>{mode === 'fixed' ? 'Utifrån den uppsägningstid du själv fyllde i.' : 'Det datum du planerar att lämna uppsägningen.'}</p>
              </article>
              <article>
                <small>BERÄKNAD SISTA AVTALSDAG</small>
                <strong data-testid='switch-end-date'>{formatDate(result.plannedEndDate)}</strong>
                <p>Kontrollera att leverantören räknar uppsägningstiden på samma sätt.</p>
              </article>
              <article>
                <small>PLANERAD NY START</small>
                <strong data-testid='switch-next-date'>{formatDate(result.nextStartDate)}</strong>
                <p>En enkel planeringspunkt dagen efter. Faktiskt startdatum måste bekräftas med leverantören.</p>
              </article>
            </div>

            <div className={styles.checks}>
              <p><Check size={16}/> Kontrollera bindningstid och eventuell avgift vid förtida avslut.</p>
              <p><Check size={16}/> Bekräfta hur leverantören räknar uppsägningstiden och när avtalet faktiskt slutar.</p>
              <p><Check size={16}/> Beställ inte nytt avtal med överlappande villkor utan att kontrollera startdatum.</p>
              {category === 'bredband' && <p><Check size={16}/> Kontrollera även eventuell retur av router eller annan utrustning.</p>}
            </div>

            <a className={styles.continue} href='#commercial-options' onClick={continueToPartners} data-testid='switch-calendar-commercial-cta'>
              {category === 'el' ? 'Se aktiva elalternativ' : 'Se aktiva bredbandsalternativ'} <ArrowRight size={18}/>
            </a>

            <button type='button' className={styles.reset} onClick={() => { setReferenceDate(''); setResult(null); }}>
              <RotateCcw size={15}/> Börja om
            </button>
          </section>
        )}

        <aside className={styles.note}>
          <strong>Det här är en planeringskalkyl – inte en tolkning av ditt avtal.</strong>
          <p>Uppsägningstid kan räknas på olika sätt och villkor kan innehålla bindningstid, förlängning eller särskilda bytesregler. Kontrollera därför alltid datumet mot ditt faktiska avtal eller leverantören innan du beställer ett nytt avtal.</p>
        </aside>

        {result && (
          <section id='commercial-options' className={styles.partners}>
            <PartnerDirectory
              category={category}
              intent='compare'
              heading={category === 'el' ? 'Aktiva elalternativ att jämföra' : 'Aktiva bredbandsalternativ att jämföra'}
            />
          </section>
        )}
      </main>
    </>
  );
}
