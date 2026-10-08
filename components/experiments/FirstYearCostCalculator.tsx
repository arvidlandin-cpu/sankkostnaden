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
  advanced,
}: {
  offer: Offer;
  setOffer: (offer: Offer) => void;
  testId: string;
  advanced: boolean;
}) {
  const result = useMemo(() => calculateFirstYearCost(offer), [offer]);

  const update = (key: keyof FirstYearCostInput, value: number) => {
    setOffer({ ...offer, [key]: value });
  };

  return (
    <section className={styles.offer} data-testid={testId}>
      {advanced && <label className={styles.nameField}>
        <span>Namn på alternativet</span>
        <input
          value={offer.name}
          onChange={event => setOffer({ ...offer, name: event.target.value })}
          maxLength={40}
        />
      </label>}

      {!advanced && <Field label='Ordinarie månadspris' value={offer.regularPrice} onChange={value => update('regularPrice', value)} suffix='kr/mån' />}
      {advanced && <div className={styles.grid}>
        <Field label='Kampanjpris / mån' value={offer.campaignPrice} onChange={value => update('campaignPrice', value)} />
        <Field label='Kampanjmånader' value={offer.campaignMonths} onChange={value => update('campaignMonths', value)} suffix='mån' max={12} />
        <Field label='Ordinarie pris / mån' value={offer.regularPrice} onChange={value => update('regularPrice', value)} />
        <Field label='Övrigt per månad' value={offer.monthlyExtras} onChange={value => update('monthlyExtras', value)} />
        <Field label='Engångsavgifter totalt' value={offer.oneTimeFees} onChange={value => update('oneTimeFees', value)} />
      </div>}

      {offer.regularPrice > 0 && <div className={styles.result}>
        <div>
          <span>Första året</span>
          <strong data-testid={`${testId}-total`}>{money.format(result.total)}</strong>
        </div>
        <div>
          <span>Effektiv kostnad / mån</span>
          <strong data-testid={`${testId}-monthly`}>{money.format(result.effectiveMonthly)}</strong>
        </div>
      </div>}

      {advanced && <details className={styles.breakdown}>
        <summary>Visa beräkningen</summary>
        <p>{result.campaignMonths} kampanjmån × {money.format(offer.campaignPrice)} = {money.format(result.campaignCost)}</p>
        <p>{result.regularMonths} ordinarie mån × {money.format(offer.regularPrice)} = {money.format(result.regularCost)}</p>
        <p>Övrigt per månad × 12 = {money.format(result.extrasCost)}</p>
        <p>Engångsavgifter = {money.format(result.oneTimeFees)}</p>
      </details>}
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
  const [journey, setJourney] = useState<'choose' | 'prices' | 'partners'>('choose');
  const [advanced, setAdvanced] = useState(false);
  const readyTracked = useRef(false);

  const resultA = useMemo(() => calculateFirstYearCost(a), [a]);
  const resultB = useMemo(() => calculateFirstYearCost(b), [b]);
  const hasA = hasOfferData(a);
  const hasB = hasOfferData(b);
  const readyToCompare = journey === 'prices' && (advanced ? (hasA && hasB) : (a.regularPrice > 0 && b.regularPrice > 0));
  const difference = readyToCompare ? Math.abs(resultA.total - resultB.total) : 0;
  const cheaper = readyToCompare && resultA.total !== resultB.total ? (resultA.total < resultB.total ? a.name : b.name) : null;

  useEffect(() => {
    if (!readyToCompare || readyTracked.current) return;
    readyTracked.current = true;
    emitAnalyticsEvent('first_year_cost_ready', {
      source,
      category,
      mode: advanced ? 'exact' : 'quick',
      difference_band: difference < 1000 ? 'under_1000' : difference < 5000 ? '1000_4999' : '5000_plus',
    });
  }, [advanced, category, difference, readyToCompare, source]);

  const continueToCommercial = () => {
    emitAnalyticsEvent('first_year_cost_continue', {
      source,
      category,
      mode: advanced ? 'exact' : 'quick',
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
          <p>Välj om du vill se relevanta operatörer direkt eller jämföra två priser. Kampanjer och avgifter går att lägga till vid behov.</p>
        </section>

        <section className={styles.start} data-testid='first-year-start'>
          <h2>Vad vill du göra?</h2>
          <div className={styles.startChoices}>
            <button type='button' aria-pressed={journey === 'partners'} onClick={() => {setJourney('partners');emitAnalyticsEvent('first_year_start_path',{source,category,path:'partners'});}}>Visa aktuella alternativ <ArrowRight size={18}/></button>
            <button type='button' aria-pressed={journey === 'prices'} onClick={() => {setJourney('prices');emitAnalyticsEvent('first_year_start_path',{source,category,path:'prices'});}}>Ja, jämför mina priser <ArrowRight size={18}/></button>
          </div>
        </section>
        {journey === 'partners' && <section className={styles.directPartners} data-testid='first-year-no-prices'>
          <h2>{category === 'bredband' ? 'Kontrollera utbudet på din adress' : 'Jämför nät, surf och aktuella mobilvillkor'}</h2>
          <p>{category === 'bredband' ? 'Bredbandsutbudet beror på adress. Kontrollera tillgänglighet och totalpris hos en faktisk jämförelsetjänst.' : 'Vi har ingen liveprislista här. Kontrollera vad varje operatör erbjuder och vad som ingår innan du väljer.'}</p>
          {commercialHref && <a className={styles.directAction} href={commercialHref} data-testid='first-year-early-partners' onClick={() => emitAnalyticsEvent('first_year_early_partner_options',{source,category})}>Se relevanta alternativ <ArrowRight size={18}/></a>}
          <p className={styles.smallPrint}>Partneralternativ är annonslänkar där det anges. Ett listat alternativ är inte automatiskt billigast.</p>
        </section>}
        {journey === 'prices' && <>
          <div className={styles.modeChoices} role='group' aria-label='Välj jämförelsens detaljnivå'>
            <button type='button' aria-pressed={!advanced} onClick={() => setAdvanced(false)}>Snabb jämförelse</button>
            <button type='button' aria-pressed={advanced} onClick={() => setAdvanced(true)}>Exakt med kampanjer och avgifter</button>
          </div>
          <p className={styles.calculationDisclaimer}>{advanced ? 'Ange kampanjperiod och alla kända avgifter för varje erbjudande. Resultatet bygger endast på dina angivna uppgifter.' : 'Förenklad beräkning: ordinarie månadskostnad × 12, utan kampanjer eller tillägg. Välj exakt läge om erbjudandena innehåller fler kostnader.'}</p>
          <section className={styles.offers} aria-label='Jämför två alternativ'>
            <OfferCard offer={a} setOffer={setA} testId='offer-a' advanced={advanced}/>
            <OfferCard offer={b} setOffer={setB} testId='offer-b' advanced={advanced}/>
          </section>
        </>}

        {journey === 'prices' && <section className={styles.comparison} aria-live='polite' data-testid='comparison-result'>
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
              <p>{qualityText} {advanced ? 'Gäller endast kostnader du angett.' : 'Detta är en förenklad jämförelse utan kampanjer och avgifter.'}</p>
            </>
          ) : (
            <>
              <span>SKILLNAD FÖRSTA ÅRET</span>
              <h2><strong>{cheaper}</strong> är {money.format(difference)} billigare första året.</h2>
              <p>Det motsvarar ungefär {money.format(difference / 12)} per månad när båda alternativen räknas över tolv månader. {advanced ? 'Kontrollera att alla avgifter ingår i dina uppgifter.' : 'Förenklad beräkning utan kampanjer, tillägg eller engångsavgifter.'}</p>
            </>
          )}

          {commercial && commercialHref && readyToCompare && (
            <a className={styles.commercialAction} href={commercialHref} onClick={continueToCommercial} data-testid='first-year-commercial-cta'>
              {commercialLabel}<ArrowRight size={18}/>
            </a>
          )}
        </section>}

        <aside className={styles.note}>
          <strong>Vad räknas med?</strong>
          <p>{noteText}</p>
        </aside>

        {after && <section className={styles.after}>{after}</section>}
      </main>
    </>
  );
}
