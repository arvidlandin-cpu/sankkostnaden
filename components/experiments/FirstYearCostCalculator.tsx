import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calculator, PiggyBank } from 'lucide-react';
import { calculateFirstYearCost, type FirstYearCostInput } from '../../lib/firstYearCost';
import { emitAnalyticsEvent } from '../../lib/clientAttribution';
import styles from '../../styles/FirstYearCostCalculator.module.css';

type Offer = FirstYearCostInput & { name: string };

type Props = {
  commercial?: boolean;
  commercialHref?: string;
  commercialLabel?: string;
  source?: string;
  after?: ReactNode;
  category?: 'mobil' | 'bredband';
  backHref?: string;
  backLabel?: string;
};

const emptyOffer = (name: string): Offer => ({
  name,
  campaignPrice: 0,
  campaignMonths: 0,
  regularPrice: 0,
  monthlyExtras: 0,
  oneTimeFees: 0,
});

const money = new Intl.NumberFormat('sv-SE', {
  style: 'currency',
  currency: 'SEK',
  maximumFractionDigits: 0,
});

function toNumber(value: string) {
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
}

function hasOfferData(offer: Offer) {
  return offer.campaignPrice > 0 || offer.regularPrice > 0 || offer.monthlyExtras > 0 || offer.oneTimeFees > 0;
}

function Field({
  label,
  value,
  onChange,
  suffix = 'kr',
  max,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  max?: number;
}) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <div>
        <input
          type='number'
          min='0'
          max={max}
          step='1'
          inputMode='decimal'
          value={value || ''}
          onChange={event => onChange(toNumber(event.target.value))}
        />
        <b>{suffix}</b>
      </div>
    </label>
  );
}

function OfferCard({
  offer,
  setOffer,
  testId,
}: {
  offer: Offer;
  setOffer: (offer: Offer) => void;
  testId: string;
}) {
  const result = useMemo(() => calculateFirstYearCost(offer), [offer]);

  const update = (key: keyof FirstYearCostInput, value: number) => {
    setOffer({ ...offer, [key]: value });
  };

  return (
    <section className={styles.offer} data-testid={testId}>
      <label className={styles.nameField}>
        <span>Namn på alternativet</span>
        <input
          value={offer.name}
          onChange={event => setOffer({ ...offer, name: event.target.value })}
          maxLength={40}
        />
      </label>

      <div className={styles.grid}>
        <Field label='Kampanjpris / mån' value={offer.campaignPrice} onChange={value => update('campaignPrice', value)} />
        <Field label='Kampanjmånader' value={offer.campaignMonths} onChange={value => update('campaignMonths', value)} suffix='mån' max={12} />
        <Field label='Ordinarie pris / mån' value={offer.regularPrice} onChange={value => update('regularPrice', value)} />
        <Field label='Övrigt per månad' value={offer.monthlyExtras} onChange={value => update('monthlyExtras', value)} />
        <Field label='Engångsavgifter totalt' value={offer.oneTimeFees} onChange={value => update('oneTimeFees', value)} />
      </div>

      <div className={styles.result}>
        <div>
          <span>Första året</span>
          <strong data-testid={`${testId}-total`}>{money.format(result.total)}</strong>
        </div>
        <div>
          <span>Effektiv kostnad / mån</span>
          <strong data-testid={`${testId}-monthly`}>{money.format(result.effectiveMonthly)}</strong>
        </div>
      </div>

      <details className={styles.breakdown}>
        <summary>Visa beräkningen</summary>
        <p>{result.campaignMonths} kampanjmån × {money.format(offer.campaignPrice)} = {money.format(result.campaignCost)}</p>
        <p>{result.regularMonths} ordinarie mån × {money.format(offer.regularPrice)} = {money.format(result.regularCost)}</p>
        <p>Övrigt per månad × 12 = {money.format(result.extrasCost)}</p>
        <p>Engångsavgifter = {money.format(result.oneTimeFees)}</p>
      </details>
    </section>
  );
}

export default function FirstYearCostCalculator({
  commercial = false,
  commercialHref,
  commercialLabel = 'Se aktuella alternativ',
  source = commercial ? 'commercial' : 'prototype',
  after,
  category = 'mobil',
  backHref,
  backLabel,
}: Props) {
  const categoryLabel = category === 'bredband' ? 'BREDBAND' : 'MOBIL';
  const defaultBackHref = category === 'bredband' ? '/bredband/billigaste-bredbandet/' : '/mobil/billigaste-mobilabonnemanget/';
  const defaultBackLabel = category === 'bredband' ? 'Till bredbandsjämförelsen' : 'Till mobiljämförelsen';
  const qualityText = category === 'bredband'
    ? 'Jämför därefter hastighet, adress, router, bindningstid och övriga villkor.'
    : 'Jämför därefter bindningstid, nät, surfmängd och övriga villkor.';
  const noteText = category === 'bredband'
    ? 'Kampanjperiod, ordinarie månadspris, återkommande tillägg och engångsavgifter. Hastighet, tillgänglighet på adressen, router och bindningstid måste fortfarande jämföras separat.'
    : 'Kampanjperiod, ordinarie månadspris, återkommande tillägg och engångsavgifter. Bindningstid, nät, surfmängd och andra kvalitetsfaktorer måste fortfarande jämföras separat.';

  const [a, setA] = useState<Offer>(emptyOffer('Alternativ A'));
  const [b, setB] = useState<Offer>(emptyOffer('Alternativ B'));
  const readyTracked = useRef(false);

  const resultA = useMemo(() => calculateFirstYearCost(a), [a]);
  const resultB = useMemo(() => calculateFirstYearCost(b), [b]);
  const hasA = hasOfferData(a);
  const hasB = hasOfferData(b);
  const readyToCompare = hasA && hasB;
  const difference = readyToCompare ? Math.abs(resultA.total - resultB.total) : 0;
  const cheaper = readyToCompare && resultA.total !== resultB.total ? (resultA.total < resultB.total ? a.name : b.name) : null;

  useEffect(() => {
    if (!readyToCompare || readyTracked.current) return;
    readyTracked.current = true;
    emitAnalyticsEvent('first_year_cost_ready', {
      source,
      category,
      first_year_cost_a: Math.round(resultA.total),
      first_year_cost_b: Math.round(resultB.total),
      first_year_difference: Math.round(difference),
    });
  }, [category, difference, readyToCompare, resultA.total, resultB.total, source]);

  const continueToCommercial = () => {
    emitAnalyticsEvent('first_year_cost_continue', {
      source,
      category,
      first_year_cost_a: Math.round(resultA.total),
      first_year_cost_b: Math.round(resultB.total),
      first_year_difference: Math.round(difference),
    });
  };

  return (
    <>
      <header className={styles.topbar}>
        <Link href='/' className={styles.brand}><PiggyBank size={20} /><strong>Sänk Kostnaden</strong></Link>
        <span>{commercial ? 'Förstaårskostnad' : 'Förstaårskostnad · prototyp'}</span>
      </header>

      <main className={styles.shell}>
        <Link href={commercial ? (backHref || defaultBackHref) : '/'} className={styles.back}><ArrowLeft size={16} /> {commercial ? (backLabel || defaultBackLabel) : 'Till startsidan'}</Link>

        <section className={styles.hero}>
          <div className={styles.icon}><Calculator size={24} /></div>
          <p className={styles.kicker}>{commercial ? 'KOSTNADSKALKYL · ' + categoryLabel : 'PROTOTYP · ABONNEMANG'}</p>
          <h1>Jämför vad två erbjudanden faktiskt kostar första året</h1>
          <p>Fyll i kampanjpris, ordinarie pris och avgifter. Kalkylen räknar om båda alternativen till samma 12-månadersperiod.</p>
        </section>

        <section className={styles.offers} aria-label='Jämför två alternativ'>
          <OfferCard offer={a} setOffer={setA} testId='offer-a' />
          <OfferCard offer={b} setOffer={setB} testId='offer-b' />
        </section>

        <section className={styles.comparison} aria-live='polite' data-testid='comparison-result'>
          {!hasA && !hasB ? (
            <>
              <span>JÄMFÖRELSE</span>
              <h2>Fyll i två erbjudanden för att jämföra.</h2>
              <p>Kalkylatorn hämtar inga livepriser och rekommenderar ingen leverantör. Du fyller själv i prisuppgifterna du vill jämföra.</p>
            </>
          ) : !readyToCompare ? (
            <>
              <span>NÄSTA STEG</span>
              <h2>Fyll i det andra alternativet också.</h2>
              <p>Då kan vi jämföra båda erbjudandena över exakt samma tolv månader.</p>
            </>
          ) : difference === 0 ? (
            <>
              <span>JÄMFÖRELSE</span>
              <h2>Alternativen kostar lika mycket första året.</h2>
              <p>{qualityText}</p>
            </>
          ) : (
            <>
              <span>SKILLNAD FÖRSTA ÅRET</span>
              <h2><strong>{cheaper}</strong> är {money.format(difference)} billigare första året.</h2>
              <p>Det motsvarar ungefär {money.format(difference / 12)} per månad när båda alternativen räknas över tolv månader.</p>
            </>
          )}

          {commercial && commercialHref && readyToCompare && (
            <a className={styles.commercialAction} href={commercialHref} onClick={continueToCommercial} data-testid='first-year-commercial-cta'>
              {commercialLabel}<ArrowRight size={18}/>
            </a>
          )}
        </section>

        <aside className={styles.note}>
          <strong>Vad räknas med?</strong>
          <p>{noteText}</p>
        </aside>

        {after && <section className={styles.after}>{after}</section>}
      </main>
    </>
  );
}
