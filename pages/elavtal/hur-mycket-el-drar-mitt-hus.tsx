import Head from 'next/head';
import { useMemo, useState } from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import styles from '../../styles/TrafficTools.module.css';

const heatFactors: Record<string, number> = { electric: 105, heatpump: 42, district: 0, other: 18 };

export default function HouseElectricityTool() {
  const [area, setArea] = useState(140);
  const [people, setPeople] = useState(3);
  const [heating, setHeating] = useState('heatpump');
  const [ev, setEv] = useState(false);
  const [spa, setSpa] = useState(false);

  const calculation = useMemo(() => {
    const household = 1800 + Math.max(0, people - 1) * 650 + area * 12;
    const heatingUse = area * heatFactors[heating];
    const extras = (ev ? 2800 : 0) + (spa ? 2200 : 0);
    const total = household + heatingUse + extras;
    return { household, heatingUse, extras, total, rounded: Math.round(total / 100) * 100 };
  }, [area, people, heating, ev, spa]);
  const kwh = (value: number) => value.toLocaleString('sv-SE');

  return <>
    <Head>
      <title>Hur mycket el drar ett hus? Räkna kWh per år 2026</title>
      <meta name='description' content='Hur mycket el drar ett hus? Räkna uppskattad årsförbrukning i kWh utifrån boyta, uppvärmning, hushåll, elbil och spa. Se uppskattad kWh per år och vad som driver elanvändningen.' />
      <link rel='canonical' href='https://sankkostnaden.se/elavtal/hur-mycket-el-drar-mitt-hus/' /><script type='application/ld+json' dangerouslySetInnerHTML={{__html: JSON.stringify({'@context':'https://schema.org','@type':'WebPage',name:"Hur mycket el drar ett hus? Räkna kWh per år 2026",description:"Hur mycket el drar ett hus? Räkna uppskattad årsförbrukning i kWh utifrån boyta, uppvärmning, hushåll, elbil och spa. Se uppskattad kWh per år och vad som driver elanvändningen.",url:"https://sankkostnaden.se/elavtal/hur-mycket-el-drar-mitt-hus/",isPartOf:{'@type':'WebSite',name:'Sänk Kostnaden',url:'https://sankkostnaden.se/'}})}} />
      <meta name='robots' content='index,follow' />
    </Head>
    <main className={`${styles.shell} ${styles.housePage}`}>
      <a className={styles.back} href='/elavtal/'>← Elavtal</a>
      <section className={styles.hero}>
        <span><Zap size={15} /> ELKOLL 2026</span>
        <h1>Hur mycket el drar ditt hus?</h1>
        <p>Börja med husets uppmätta förbrukning för 12 månader från elnätsbolaget eller fakturorna. Saknar du den kan du utforska ett förenklat räkneexempel här. Exemplet är ingen prognos för ditt hus.</p>
      </section>
      <section className={styles.measuredFirst} aria-labelledby='measured-first'>
        <h2 id='measured-first'>Har du redan din årsförbrukning?</h2>
        <p>Använd uppmätta kWh för en sammanhängande tolvmånadersperiod. En enstaka vinter- eller sommarmånad räcker inte som årsunderlag. Kontrollera vad elmätaren omfattar, till exempel laddning eller separat uppvärmning.</p>
        <a href='/verktyg/elavtalskostnad/'>Räkna avtalskostnad med dina egna kWh <ArrowRight size={17} aria-hidden='true' /></a>
      </section>
      <section className={styles.toolGrid} aria-label='Förenklat räkneexempel'>
        <div className={styles.panel}>
          <label htmlFor='house-area'>Boyta <b>{area} m²</b></label>
          <input id='house-area' aria-valuetext={`${area} kvadratmeter`} type='range' min='40' max='300' step='10' value={area} onChange={e => setArea(Number(e.target.value))} />
          <label htmlFor='house-people'>Personer i hushållet <b>{people}</b></label>
          <input id='house-people' type='range' min='1' max='7' value={people} onChange={e => setPeople(Number(e.target.value))} />
          <span id='house-heating-label'>Hur värms huset?</span>
          <div className={styles.choices} role='group' aria-labelledby='house-heating-label'>
            {[['electric','Direkt/elvärme'],['heatpump','Värmepump'],['district','Fjärrvärme/ej el'],['other','Annat']].map(([value,label]) => <button type='button' aria-pressed={heating === value} key={value} className={heating === value ? styles.active : ''} onClick={() => setHeating(value)}>{label}</button>)}
          </div>
          <div className={styles.toggles}>
            <button type='button' aria-pressed={ev} className={ev ? styles.active : ''} onClick={() => setEv(!ev)}>Elbil hemma</button>
            <button type='button' aria-pressed={spa} className={spa ? styles.active : ''} onClick={() => setSpa(!spa)}>Spa/pool</button>
          </div>
        </div>
        <aside className={styles.result}>
          <span>FÖRENKLAT RÄKNEEXEMPEL</span>
          <strong data-testid='house-example-total'>{kwh(calculation.rounded)} kWh/år</strong>
          <h2>Exempel med dina val</h2>
          <p>Sänk Kostnadens egna schablonantaganden saknar verifierat källstöd. De visar hur räkneexemplet fungerar, inte hur mycket ditt hus faktiskt använder eller om din förbrukning är hög eller låg.</p>
          <details className={styles.houseMethod}>
            <summary>Se alla antaganden och uträkningen</summary>
            <p>Alla tal nedan är våra egna antaganden, inte myndighetsvärden eller en validerad energimodell.</p>
            <ul>
              <li>Hushållsel: 1 800 kWh/år i grundtal + 650 kWh per person utöver den första + 12 kWh per m² och år.</li>
              <li>Uppvärmning: boytan × 105 kWh/m² för direkt/elvärme, 42 för värmepump, 0 för fjärrvärme/ej el och 18 för annat, per år.</li>
              <li>Elbil hemma: +2 800 kWh/år när vald. Spa/pool: +2 200 kWh/år när vald.</li>
            </ul>
            <p>Noll för fjärrvärme betyder bara att exemplet inte lägger till el för uppvärmning. Det betyder inte att värmen är gratis eller att hela energianvändningen är noll.</p>
            <dl data-testid='house-example-breakdown'>
              <dt>Hushållsel ({area} m², {people} personer)</dt><dd>{kwh(calculation.household)} kWh/år</dd>
              <dt>El för uppvärmning ({area} × {heatFactors[heating]})</dt><dd>{kwh(calculation.heatingUse)} kWh/år</dd>
              <dt>Elbil och spa/pool</dt><dd>{kwh(calculation.extras)} kWh/år</dd>
              <dt>Summa före avrundning</dt><dd>{kwh(calculation.total)} kWh/år</dd>
            </dl>
            <p>Resultatet avrundas till närmaste 100 kWh. Klimat, isolering, husets skick, varmvatten, körsträcka och faktisk användning modelleras inte. Använd uppmätt årsförbrukning för avtalsjämförelser; vi anger inget statistiskt osäkerhetsintervall.</p>
          </details>
          <a href='/verktyg/elavtalskostnad/'>Räkna avtalskostnad med egna uppgifter <ArrowRight size={17} aria-hidden='true'/></a>
          <p>Du fyller själv i uppmätta kWh i kostnadskalkylen. Räkneexemplet förs inte över.</p>
        </aside>
      </section>
      <section className={styles.seoCopy}>
        <h2>Vad är normal elförbrukning för en villa?</h2>
        <p>Det finns inget enda normalvärde som passar alla hus. Boyta, uppvärmning, antal boende, varmvatten och större laster påverkar. Därför är husets egen årsförbrukning från elnätsbolaget den bästa utgångspunkten när du jämför elavtal.</p>
        <h2>Vad kan du påverka?</h2>
        <p>Om förbrukningen är hög är nästa fråga när elen används och hur mycket som går att styra. Har du värmepump, elbil eller andra större laster kan även avtalsform och tidpunkten för användningen spela roll.</p>
      </section>
    </main>
  </>;
}
