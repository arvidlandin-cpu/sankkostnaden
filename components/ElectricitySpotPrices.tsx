import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown, Clock3, Info, TrendingDown, TrendingUp, Zap } from 'lucide-react';
import styles from '../styles/ElectricitySpotPrices.module.css';

type Area = 'SE1' | 'SE2' | 'SE3' | 'SE4';
type Quarter = { start: string; end: string; sekPerKwh: number };
type PriceFeed = {
  source: string;
  days: Record<string, Partial<Record<Area, Quarter[]>>>;
};

const areaNames: Record<Area, string> = {
  SE1: 'SE1 · Norra Sverige',
  SE2: 'SE2 · Norra Mellansverige',
  SE3: 'SE3 · Stockholm / Gotland',
  SE4: 'SE4 · Södra Sverige',
};

function stockDate(at: Date) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Stockholm', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(at).filter(p => p.type !== 'literal').map(p => [p.type, p.value]));
  return parts.year + '-' + parts.month + '-' + parts.day;
}

function tomorrowDate(today: string) {
  const date = new Date(today + 'T12:00:00Z');
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

function stockHour(at: Date) {
  return Number(new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Stockholm', hour: '2-digit', hourCycle: 'h23',
  }).format(at));
}

function timeLabel(iso: string) {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Stockholm', hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso));
}

function ore(value: number) {
  return new Intl.NumberFormat('sv-SE', { maximumFractionDigits: 1 }).format(value * 100);
}

function isValidDay(rows: unknown): rows is Quarter[] {
  if (!Array.isArray(rows) || ![92, 96, 100].includes(rows.length)) return false;
  return rows.every(row => row && typeof row.start === 'string' &&
    typeof row.end === 'string' && typeof row.sekPerKwh === 'number' &&
    Number.isFinite(row.sekPerKwh) && row.sekPerKwh >= -100 && row.sekPerKwh <= 100 &&
    Number.isFinite(Date.parse(row.start)) && Number.isFinite(Date.parse(row.end)));
}

function hourlyPoints(rows: Quarter[]) {
  const groups: number[][] = Array.from({ length: 24 }, () => []);
  for (const row of rows) groups[stockHour(new Date(row.start))].push(row.sekPerKwh);
  return groups.map(prices => prices.length
    ? prices.reduce((sum, p) => sum + p, 0) / prices.length
    : null);
}

export default function ElectricitySpotPrices() {
  const [feed, setFeed] = useState<PriceFeed | null>(null);
  const [area, setArea] = useState<Area>('SE3');
  const [day, setDay] = useState<'today' | 'tomorrow'>('today');
  const [chosenHour, setChosenHour] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'unavailable'>('loading');
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setNow(Date.now());
    const tick = window.setInterval(() => setNow(Date.now()), 60_000);
    fetch('/spot-prices/latest.json', { cache: 'no-store', signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error('No spot-price data');
        return response.json();
      })
      .then((data: PriceFeed) => {
        if (!data || !data.days || data.source !== 'Elpriset just nu.se') {
          throw new Error('Invalid price feed');
        }
        setFeed(data);
        setStatus('ready');
      })
      .catch(() => { if (!controller.signal.aborted) setStatus('unavailable'); });
    return () => { controller.abort(); window.clearInterval(tick); };
  }, []);

  const today = now === null ? '' : stockDate(new Date(now));
  const tomorrow = today ? tomorrowDate(today) : '';
  const selectedDate = day === 'today' ? today : tomorrow;
  const recordsCandidate = selectedDate ? feed?.days?.[selectedDate]?.[area] : undefined;
  const records = isValidDay(recordsCandidate) ? recordsCandidate : [];
  const tomorrowAvailable = Boolean(tomorrow && isValidDay(feed?.days?.[tomorrow]?.[area]));
  const points = useMemo(() => hourlyPoints(records), [records]);
  const currentHour = now === null ? 12 : stockHour(new Date(now));
  const hour = chosenHour ?? (day === 'today' ? currentHour : 12);
  const selectedPrice = points[hour];

  const chart = useMemo(() => {
    const values = points.filter((p): p is number => p !== null);
    if (!values.length) return null;
    const bottom = Math.min(0, ...values);
    const top = Math.max(...values);
    const span = Math.max(0.01, top - bottom);
    const y = (p: number) => 118 - (p - bottom) / span * 100;
    const x = (i: number) => 16 + i * 29;
    const line = points.map((p, i) =>
      p === null ? '' : (i === 0 ? 'M ' : ' L ') + x(i) + ' ' + y(p).toFixed(2)
    ).join('');
    return { line, y, x, zeroY: y(0) };
  }, [points]);

  const currentQuarter = today && feed && isValidDay(feed.days?.[today]?.[area]) && now !== null
    ? feed.days[today][area]?.find(p => Date.parse(p.start) <= now && now < Date.parse(p.end))
    : undefined;
  const low = records.length ? records.reduce((a, b) => a.sekPerKwh <= b.sekPerKwh ? a : b) : null;
  const high = records.length ? records.reduce((a, b) => a.sekPerKwh >= b.sekPerKwh ? a : b) : null;

  return <section id='kvartspriser' data-testid='electricity-spot-prices' className={styles.root} aria-label='Aktuella spotpriser för el'>
    <div className={styles.heading}>
      <div>
        <p className={styles.eyebrow}><Zap size={15}/> ÖPPNA MARKNADSPRISER</p>
        <h2>Se när elen är billigare</h2>
        <p>Riktiga elbörspriser per kvart. Välj elområde och utforska dagen.</p>
      </div>
      <span className={styles.dataTag}>Automatisk uppdatering</span>
    </div>
    <div className={styles.toolbar}>
      <label>Elområde
        <select value={area} onChange={e => { setArea(e.target.value as Area); setChosenHour(null); }} aria-label='Välj elområde'>
          {Object.entries(areaNames).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
        </select>
      </label>
      <div className={styles.days} role='group' aria-label='Välj prisdag'>
        <button type='button' className={day === 'today' ? styles.activeDay : ''}
          aria-pressed={day === 'today'} onClick={() => { setDay('today'); setChosenHour(null); }}>I dag</button>
        <button type='button' className={day === 'tomorrow' ? styles.activeDay : ''}
          aria-pressed={day === 'tomorrow'} disabled={!tomorrowAvailable}
          title={!tomorrowAvailable ? 'Morgondagens priser finns ännu inte tillgängliga' : undefined}
          onClick={() => { setDay('tomorrow'); setChosenHour(null); }}>I morgon</button>
      </div>
    </div>
    {status === 'loading' && <p className={styles.fallback} role='status'>Läser in dagens elpriser …</p>}
    {status !== 'loading' && records.length === 0 && <div className={styles.fallback} role='status'>
      <strong>Priserna är inte tillgängliga just nu.</strong>
      <p>Vi visar inga gamla eller uppskattade värden som aktuella spotpriser. Försök igen lite senare.</p>
      <Link href='/elavtal/kvartspris/'>Så fungerar kvartspris <ArrowRight size={15}/></Link>
    </div>}
    {records.length > 0 && <>
      <div className={styles.metrics}>
        <div className={styles.metricNow}>
          <span><Clock3 size={15}/> {day === 'today' ? 'Spotpris just nu' : 'Vald timme i morgon'}</span>
          <strong>{day === 'today'
            ? currentQuarter ? ore(currentQuarter.sekPerKwh) : '–'
            : selectedPrice !== null ? ore(selectedPrice) : '–'} <small>öre/kWh</small></strong>
          <small>{day === 'today' && currentQuarter
            ? timeLabel(currentQuarter.start) + '–' + timeLabel(currentQuarter.end)
            : day === 'tomorrow' ? 'Genomsnitt för timmen · exkl. moms' : 'Aktuell kvart saknas'}</small>
        </div>
        <div className={styles.metricSmall}>
          <span><TrendingDown size={15}/> Billigaste kvart</span>
          <strong>{low ? ore(low.sekPerKwh) : '–'} <small>öre</small></strong>
          <small>{low ? timeLabel(low.start) : '–'}</small>
        </div>
        <div className={styles.metricSmall}>
          <span><TrendingUp size={15}/> Dyraste kvart</span>
          <strong>{high ? ore(high.sekPerKwh) : '–'} <small>öre</small></strong>
          <small>{high ? timeLabel(high.start) : '–'}</small>
        </div>
      </div>
      <div className={styles.graphBox}>
        <div className={styles.graphHeading}>
          <strong>Prisets variation under dagen</strong>
          <span>24 timmedelvärden av kvartspriser</span>
        </div>
        {chart && <svg viewBox='0 0 720 142' preserveAspectRatio='none' role='img'
          aria-label='Prisgraf över dygnets 24 timmedelvärden' className={styles.graph}>
          <line x1='8' y1='118' x2='700' y2='118' stroke='#b3c3df' strokeDasharray='3 6'/>
          <line x1='8' y1='68' x2='700' y2='68' stroke='#e7eaf3' strokeDasharray='3 6'/>
          <line x1='8' y1='18' x2='700' y2='18' stroke='#e7eaf3' strokeDasharray='3 6'/>
          {chart.zeroY >= 18 && chart.zeroY <= 118 && <line x1='8' y1={chart.zeroY} x2='700' y2={chart.zeroY} stroke='#98adc8' strokeDasharray='2 4'/>}
          <line x1={chart.x(hour)} y1='10' x2={chart.x(hour)} y2='120' stroke='#2450cb' opacity='.24' strokeDasharray='5 5'/>
          <path d={chart.line} fill='none' stroke='#2450cb' strokeWidth='4' strokeLinecap='round' strokeLinejoin='round' vectorEffect='non-scaling-stroke'/>
          {selectedPrice !== null && <circle cx={chart.x(hour)} cy={chart.y(selectedPrice)} r='6.5' fill='#2450cb' stroke='white' strokeWidth='3' vectorEffect='non-scaling-stroke'/>}
          {([0, 6, 12, 18, 23] as const).map(i =>
            <text key={i} x={chart.x(i)} y='139' fontSize='14' textAnchor='middle' fill='#56677d'>{String(i).padStart(2, '0')}</text>)}
        </svg>}
        <div className={styles.sliderHeading}>
          <label htmlFor='electricity-spot-hour'>Flytta reglaget för att välja timme</label>
          <strong>{String(hour).padStart(2, '0')}:00</strong>
        </div>
        <input id='electricity-spot-hour' type='range' min='0' max='23' step='1'
          value={hour} onChange={e => setChosenHour(Number(e.target.value))}
          aria-valuetext={'Kl ' + String(hour).padStart(2, '0') + ':00, ' +
            (selectedPrice !== null ? ore(selectedPrice) + ' öre per kWh i snitt' : 'pris saknas')}
        />
        <p className={styles.selectedHour} aria-live='polite'>
          {String(hour).padStart(2, '0')}:00–{String((hour + 1) % 24).padStart(2, '0')}:00:
          {' '}<strong>{selectedPrice !== null ? ore(selectedPrice) + ' öre/kWh' : 'pris saknas'}</strong>
          {' '}i timgenomsnitt.
        </p>
      </div>
      <button type='button' className={styles.more} aria-expanded={expanded} aria-controls='spot-price-details'
        onClick={() => setExpanded(value => !value)}>
        Hur räknas priserna? <ChevronDown size={17} className={expanded ? styles.turn : ''}/>
      </button>
      {expanded && <div id='spot-price-details' className={styles.explanation}>
        Priserna är spotpris från dagen-före-marknaden, med 15 minuters upplösning. Grafen visar genomsnitt per klocktimme.
        Spotpris är <strong>inte</strong> ditt slutliga elpris: moms, elskatt, nätavgift, påslag och fasta elhandelsavgifter tillkommer.
        Priserna styr inte automatiskt vad du betalar om du har ett annat avtalsupplägg.
        <Link href='/elavtal/kvartspris/'>Läs om kvartspris <ArrowRight size={14}/></Link>
      </div>}
    </>}
    <p className={styles.source}><Info size={15}/> Priser utan moms, skatter och avgifter.
      Källa: <a href='https://www.elprisetjustnu.se/elpris-api' target='_blank' rel='noopener noreferrer'>Elpriset just nu.se</a>.
      Morgondagens priser publiceras normalt på eftermiddagen.</p>
  </section>;
}
