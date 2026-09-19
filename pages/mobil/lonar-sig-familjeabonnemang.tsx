import Head from 'next/head';
import { useMemo, useState } from 'react';
import { ArrowRight, Smartphone, Users } from 'lucide-react';
import styles from '../../styles/TrafficTools.module.css';

export default function FamilyMobileTool() {
  const [people, setPeople] = useState(4);
  const [current, setCurrent] = useState(109);
  const [mainPrice, setMainPrice] = useState(299);
  const [extraPrice, setExtraPrice] = useState(99);

  const totals = useMemo(() => {
    const separate = people * current;
    const family = mainPrice + Math.max(0, people - 1) * extraPrice;
    return { separate, family, difference: separate - family };
  }, [people, current, mainPrice, extraPrice]);

  const breakEvenExtra = people > 1 ? Math.max(0, Math.floor((totals.separate - mainPrice) / (people - 1))) : 0;

  return <>
    <Head>
      <title>Lönar sig familjeabonnemang? Kalkyl 2026 | Sänk Kostnaden</title>
      <meta name='description' content='Räkna om familjeabonnemang blir billigare än separata mobilabonnemang. Jämför total månadskostnad, årskostnad och brytpunkt per extra användare.' />
      <link rel='canonical' href='https://sankkostnaden.se/mobil/lonar-sig-familjeabonnemang/' /><script type='application/ld+json' dangerouslySetInnerHTML={{__html: JSON.stringify({'@context':'https://schema.org','@type':'WebPage',name:"Lönar sig familjeabonnemang? Kalkyl 2026",description:"Räkna om familjeabonnemang blir billigare än separata mobilabonnemang. Jämför total månadskostnad, årskostnad och brytpunkt per extra användare.",url:"https://sankkostnaden.se/mobil/lonar-sig-familjeabonnemang/",isPartOf:{'@type':'WebSite',name:'Sänk Kostnaden',url:'https://sankkostnaden.se/'}})}} />
      <meta name='robots' content='index,follow' />
    </Head>
    <main className={styles.shell}>
      <a className={styles.back} href='/mobil/'>← Mobil</a>
      <section className={styles.hero}>
        <span><Users size={15} /> FAMILJEKOLL</span>
        <h1>Lönar sig familjeabonnemang för er?</h1>
        <p>Räkna på hela familjen i stället för reklampriset på huvudabonnemanget. Verktyget visar totalsumman och vilket pris per extra användare ett familjeupplägg måste slå.</p>
      </section>
      <section className={styles.toolGrid}>
        <div className={styles.panel}>
          <label>Antal personer <b>{people}</b></label>
          <input type='range' min='2' max='7' value={people} onChange={e => setPeople(Number(e.target.value))} />
          <label>Nuvarande pris per person / mån</label>
          <div className={styles.money}><input type='number' min='0' value={current} onChange={e => setCurrent(Number(e.target.value))}/><span>kr</span></div>
          <label>Familjens huvudabonnemang / mån</label>
          <div className={styles.money}><input type='number' min='0' value={mainPrice} onChange={e => setMainPrice(Number(e.target.value))}/><span>kr</span></div>
          <label>Pris per extra användare / mån</label>
          <div className={styles.money}><input type='number' min='0' value={extraPrice} onChange={e => setExtraPrice(Number(e.target.value))}/><span>kr</span></div>
        </div>
        <aside className={styles.result}>
          <span>FAMILJENS KOSTNADSKOLL</span>
          <div className={styles.compare}><div><small>Separata</small><b>{totals.separate.toLocaleString('sv-SE')} kr/mån</b></div><div><small>Familj</small><b>{totals.family.toLocaleString('sv-SE')} kr/mån</b></div></div>
          <strong>{Math.abs(totals.difference * 12).toLocaleString('sv-SE')} kr/år</strong>
          <h2>{totals.difference > 0 ? 'Familjeupplägget är billigare i din kalkyl' : totals.difference < 0 ? 'Separata abonnemang är billigare i din kalkyl' : 'Samma kostnad i din kalkyl'}</h2>
          <p>Med de här siffrorna behöver varje extra användare kosta högst cirka <b>{breakEvenExtra} kr/mån</b> för att familjealternativet ska slå dagens totalpris.</p>
          <div className={styles.reference}><Smartphone size={18}/><p>Kontrollera även surf per person, nät, 5G, EU-surf, bindningstid och eventuella avgifter innan byte.</p></div>
          <a href='/mobil/familjeabonnemang/'>Jämför familjeabonnemang rätt <ArrowRight size={17}/></a>
        </aside>
      </section>
      <section className={styles.seoCopy}>
        <h2>När blir familjeabonnemang billigare?</h2>
        <p>Det avgörs av hela paketet: priset för huvudabonnemanget plus varje extra användare. Jämför den summan med vad samtliga separata abonnemang faktiskt kostar idag – helst över tolv månader.</p>
        <h2>Billigare är inte automatiskt bättre</h2>
        <p>Kontrollera att surfmängden och täckningen fungerar för alla. Ett familjepris kan se lågt ut men bli sämre om någon behöver köpa extra surf eller om villkoren inte motsvarar de gamla abonnemangen.</p>
      </section>
    </main>
  </>;
}
