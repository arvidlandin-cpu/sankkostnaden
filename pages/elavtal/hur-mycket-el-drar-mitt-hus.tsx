import Head from 'next/head';
import { useMemo, useState } from 'react';
import { ArrowRight, Home, Zap } from 'lucide-react';
import styles from '../../styles/TrafficTools.module.css';

const heatFactors: Record<string, number> = { electric: 105, heatpump: 42, district: 0, other: 18 };

export default function HouseElectricityTool() {
  const [area, setArea] = useState(140);
  const [people, setPeople] = useState(3);
  const [heating, setHeating] = useState('heatpump');
  const [ev, setEv] = useState(false);
  const [spa, setSpa] = useState(false);

  const estimate = useMemo(() => {
    const household = 1800 + Math.max(0, people - 1) * 650 + area * 12;
    const heatingUse = area * heatFactors[heating];
    const extras = (ev ? 2800 : 0) + (spa ? 2200 : 0);
    return Math.round((household + heatingUse + extras) / 100) * 100;
  }, [area, people, heating, ev, spa]);

  const band = estimate < 7000 ? 'Låg till måttlig' : estimate < 14000 ? 'Mellan' : 'Hög';

  return <>
    <Head>
      <title>Hur mycket el drar mitt hus? Kalkyl 2026 | Sänk Kostnaden</title>
      <meta name='description' content='Räkna ut en grov årsförbrukning för villa utifrån boyta, uppvärmning, hushåll, elbil och spa. Se uppskattad kWh per år och vad som driver elanvändningen.' />
      <link rel='canonical' href='https://sankkostnaden.se/elavtal/hur-mycket-el-drar-mitt-hus/' />
      <meta name='robots' content='index,follow' />
    </Head>
    <main className={styles.shell}>
      <a className={styles.back} href='/elavtal/'>← Elavtal</a>
      <section className={styles.hero}>
        <span><Zap size={15} /> ELKOLL 2026</span>
        <h1>Hur mycket el drar ditt hus?</h1>
        <p>Bygg en snabb profil av huset och få ett riktvärde för årsförbrukningen. Resultatet är en uppskattning – din faktiska historik är alltid bättre när den finns.</p>
      </section>
      <section className={styles.toolGrid}>
        <div className={styles.panel}>
          <label>Boyta <b>{area} m²</b></label>
          <input type='range' min='40' max='300' step='10' value={area} onChange={e => setArea(Number(e.target.value))} />
          <label>Personer i hushållet <b>{people}</b></label>
          <input type='range' min='1' max='7' value={people} onChange={e => setPeople(Number(e.target.value))} />
          <label>Hur värms huset?</label>
          <div className={styles.choices}>
            {[['electric','Direkt/elvärme'],['heatpump','Värmepump'],['district','Fjärrvärme/ej el'],['other','Annat']].map(([value,label]) => <button key={value} className={heating === value ? styles.active : ''} onClick={() => setHeating(value)}>{label}</button>)}
          </div>
          <div className={styles.toggles}>
            <button className={ev ? styles.active : ''} onClick={() => setEv(!ev)}>Elbil hemma</button>
            <button className={spa ? styles.active : ''} onClick={() => setSpa(!spa)}>Spa/pool</button>
          </div>
        </div>
        <aside className={styles.result}>
          <span>UPPSKATTAD ÅRSFÖRBRUKNING</span>
          <strong>{estimate.toLocaleString('sv-SE')} kWh</strong>
          <h2>{band} elanvändning för profilen</h2>
          <p>Uppvärmningssättet påverkar resultatet mest. Elbil och spa kan därefter flytta totalen tydligt.</p>
          <div className={styles.reference}><Home size={18}/><p>Energimyndigheten anger som grova exempel omkring 20 000 kWh/år för villa med elvärme och omkring 5 000 kWh/år för villa utan elvärme, men variationen är stor.</p></div>
          <a href='/elavtal/jamfor-elavtal/'>Jämför elavtal för din förbrukning <ArrowRight size={17}/></a>
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
