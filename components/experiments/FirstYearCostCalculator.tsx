import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, PiggyBank } from 'lucide-react';
import { calculateFirstYearCost, type FirstYearCostInput } from '../../lib/firstYearCost';
import styles from '../../styles/FirstYearCostCalculator.module.css';

type Offer = FirstYearCostInput & { name: string };

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

export default function FirstYearCostCalculator() {
  const [a, setA] = useState<Offer>(emptyOffer('Alternativ A'));
  const [b, setB] = useState<Offer>(emptyOffer('Alternativ B'));

  const resultA = useMemo(() => calculateFirstYearCost(a), [a]);
  const resultB = useMemo(() => calculateFirstYearCost(b), [b]);
  const hasAnyValue = resultA.total > 0 || resultB.total > 0;
  const difference = Math.abs(resultA.total - resultB.total);
  const cheaper = resultA.total === resultB.total ? null : resultA.total < resultB.total ? a.name : b.name;

  return (
    <>
      <header className={styles.topbar}>
        <Link href='/' className={styles.brand}><PiggyBank size={20} /><strong>Sänk Kostnaden</strong></Link>
        <span>Förstaårskostnad · prototyp</span>
      </header>

      <main className={styles.shell}>
        <Link href='/' className={styles.back}><ArrowLeft size={16} /> Till startsidan</Link>

        <section className={styles.hero}>
          <div className={styles.icon}><Calculator size={24} /></div>
          <p className={styles.kicker}>PROTOTYP · ABONNEMANG</p>
          <h1>Jämför vad två erbjudanden faktiskt kostar första året</h1>
          <p>Fyll i kampanjpris, ordinarie pris och avgifter. Kalkylen räknar om båda alternativen till samma 12-månadersperiod.</p>
        </section>

        <section className={styles.offers} aria-label='Jämför två alternativ'>
          <OfferCard offer={a} setOffer={setA} testId='offer-a' />
          <OfferCard offer={b} setOffer={setB} testId='offer-b' />
        </section>

        <section className={styles.comparison} aria-live='polite' data-testid='comparison-result'>
          {!hasAnyValue ? (
            <>
              <span>JÄMFÖRELSE</span>
              <h2>Fyll i minst ett pris för att börja.</h2>
              <p>Alla värden är dina egna. Prototypen hämtar inga livepriser och rekommenderar ingen leverantör.</p>
            </>
          ) : difference === 0 ? (
            <>
              <span>JÄMFÖRELSE</span>
              <h2>Alternativen kostar lika mycket första året.</h2>
              <p>Jämför därefter sådant som bindningstid, nät, hastighet och övriga villkor.</p>
            </>
          ) : (
            <>
              <span>SKILLNAD FÖRSTA ÅRET</span>
              <h2><strong>{cheaper}</strong> är {money.format(difference)} billigare första året.</h2>
              <p>Det motsvarar ungefär {money.format(difference / 12)} per månad när båda alternativen räknas över tolv månader.</p>
            </>
          )}
        </section>

        <aside className={styles.note}>
          <strong>Vad räknas med?</strong>
          <p>Kampanjperiod, ordinarie månadspris, återkommande tillägg och engångsavgifter. Bindningstid, kvalitetsnivå och eventuella användningsbaserade kostnader måste fortfarande jämföras separat.</p>
        </aside>
      </main>
    </>
  );
}
