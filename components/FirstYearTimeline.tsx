import { useId } from 'react';
import type { FirstYearCostResult } from '../lib/firstYearCost';
import styles from '../styles/FirstYearTimeline.module.css';

type TimelineOffer = { name: string; result: FirstYearCostResult };
type Props = { offers: [TimelineOffer, TimelineOffer] };
const money = new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK', maximumFractionDigits: 0 });
const preciseMoney = new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK', minimumFractionDigits: 0, maximumFractionDigits: 2 });

/** Reconstruct monthly charges only from the calculator's normalized results.
 * One-time fees remain an annual line item: their payment month is unknown.
 */
function monthlyCharges(result: FirstYearCostResult) {
  const campaign = result.campaignMonths > 0 ? result.campaignCost / result.campaignMonths : 0;
  const regular = result.regularMonths > 0 ? result.regularCost / result.regularMonths : 0;
  const extras = result.extrasCost / 12;
  return Array.from({ length: 12 }, (_, index) => ({
    month: index + 1,
    campaign: index < result.campaignMonths,
    base: index < result.campaignMonths ? campaign : regular,
    extras,
  }));
}

export default function FirstYearTimeline({ offers }: Props) {
  const titleId = useId();
  const rows = offers.map(offer => ({ ...offer, months: monthlyCharges(offer.result) }));
  const maxMonthly = Math.max(...rows.flatMap(row => row.months.map(month => month.base + month.extras)));
  const scale = maxMonthly > 0 ? maxMonthly : 1;

  return <section className={styles.root} aria-labelledby={titleId} data-testid='first-year-timeline'>
    <div className={styles.heading}><p>KOSTNADEN ÖVER TOLV MÅNADER</p><h3 id={titleId}>Se när priset ändras.</h3></div>
    <p className={styles.explanation}>Dina angivna kostnader. Samma skala för båda, från första avtalsmånaden.</p>
    <ul className={styles.legend} aria-label='Förklaring till diagrammet'>
      <li><span className={styles.campaignKey} aria-hidden='true'/>Kampanj · K</li>
      <li><span className={styles.regularKey} aria-hidden='true'/>Ordinarie · O</li>
      <li><span className={styles.extrasKey} aria-hidden='true'/>Tillägg/mån · +</li>
    </ul>
    <p className={styles.scale}>Gemensam skala: 0–{preciseMoney.format(maxMonthly)}/mån</p>
    <div className={styles.rows}>
      {rows.map((offer, offerIndex) => <div className={styles.offer} key={offerIndex} data-testid={`timeline-offer-${offerIndex}`}>
        <div className={styles.offerHeading}><h4>{offer.name}</h4><p>Första året <strong data-testid={`timeline-total-${offerIndex}`}>{money.format(offer.result.total)}</strong></p></div>
        <div className={styles.chart} aria-hidden='true'>
          {offer.months.map(month => <div className={styles.month} key={month.month} data-testid={`timeline-month-${offerIndex}-${month.month}`} data-base={month.base} data-extras={month.extras} data-period={month.campaign ? 'campaign' : 'regular'}>
            <div className={styles.barTrack}>
              <div className={styles.extrasBar} style={{ height: `${month.extras / scale * 100}%` }}/>
              <div className={month.campaign ? styles.campaignBar : styles.regularBar} style={{ height: `${month.base / scale * 100}%` }}/>
            </div>
            <span className={styles.period}>{month.campaign ? 'K' : 'O'}{month.extras > 0 ? '+' : ''}</span>
            <span className={styles.monthNumber}>{month.month}</span>
          </div>)}
        </div>
        <p className={styles.monthLabel}>Månad 1–12</p>
        <p className={styles.fee} data-testid={`timeline-fee-${offerIndex}`}>Engångsavgifter utanför staplarna: {preciseMoney.format(offer.result.oneTimeFees)}</p>
      </div>)}
    </div>
    <details className={styles.details}>
      <summary>Visa beloppen månad för månad</summary>
      <p className={styles.explanation}>Månad 1 är den första avtalsmånaden, inte en viss kalendermånad. Engångsavgifter ingår i årstotalen men ligger utanför månadsstaplarna eftersom betalningsmånaden inte är angiven.</p>
      {rows.map((offer, index) => <table className={styles.table} key={index} data-testid={`timeline-table-${index}`}>
        <caption>{offer.name} · månadskostnader utan engångsavgifter</caption>
        <thead><tr><th scope='col'>Månad</th><th scope='col'>Grundpris</th><th scope='col'>Tillägg</th><th scope='col'>Summa</th></tr></thead>
        <tbody>{offer.months.map(month => <tr key={month.month}><th scope='row'>Månad {month.month}<small>{month.campaign ? 'Kampanj' : 'Ordinarie'}</small></th><td>{preciseMoney.format(month.base)}</td><td>{preciseMoney.format(month.extras)}</td><td>{preciseMoney.format(month.base + month.extras)}</td></tr>)}</tbody>
        <tfoot><tr><th scope='row' colSpan={3}>Grundpriser under året</th><td>{preciseMoney.format(offer.result.campaignCost + offer.result.regularCost)}</td></tr>
          <tr><th scope='row' colSpan={3}>Tillägg under året</th><td>{preciseMoney.format(offer.result.extrasCost)}</td></tr>
          <tr><th scope='row' colSpan={3}>Engångsavgifter för året</th><td>{preciseMoney.format(offer.result.oneTimeFees)}</td></tr>
          <tr><th scope='row' colSpan={3}>Första året totalt</th><td>{money.format(offer.result.total)}</td></tr></tfoot>
      </table>)}
      <p className={styles.explanation}>Månadsbelopp visas med upp till två decimaler. Årstotalerna avrundas till hela kronor på samma sätt som kalkylatorns resultat.</p>
    </details>
  </section>;
}
