import Head from 'next/head';
import { Users } from 'lucide-react';
import FamilyMobileCost from '../../components/tools/FamilyMobileCost';
import styles from '../../styles/TrafficTools.module.css';

export default function FamilyMobileTool() {
  return <>
    <Head>
      <title>Lönar sig familjeabonnemang? Kalkyl 2026 | Sänk Kostnaden</title>
      <meta name='description' content='Räkna om familjeabonnemang blir billigare än separata mobilabonnemang. Jämför total månadskostnad, årskostnad och brytpunkt per extra användare.' />
      <link rel='canonical' href='https://sankkostnaden.se/mobil/lonar-sig-familjeabonnemang/' />
      <script type='application/ld+json' dangerouslySetInnerHTML={{__html: JSON.stringify({'@context':'https://schema.org','@type':'WebPage',name:'Lönar sig familjeabonnemang? Kalkyl 2026',description:'Räkna om familjeabonnemang blir billigare än separata mobilabonnemang. Jämför total månadskostnad, årskostnad och brytpunkt per extra användare.',url:'https://sankkostnaden.se/mobil/lonar-sig-familjeabonnemang/',isPartOf:{'@type':'WebSite',name:'Sänk Kostnaden',url:'https://sankkostnaden.se/'}})}} />
      <meta name='robots' content='index,follow' />
    </Head>
    <main className={`${styles.shell} ${styles.familyPage}`}>
      <a className={styles.back} href='/mobil/'>← Mobil</a>
      <section className={styles.hero}>
        <span><Users size={15} /> FAMILJEKOLL</span>
        <h1>Lönar sig familjeabonnemang för er?</h1>
        <p>Välj hur många ni är och få hjälp direkt. Du kan se familjeabonnemang utan att fylla i några priser, eller jämföra er totalkostnad.</p>
      </section>

      <FamilyMobileCost />

      <section className={styles.seoCopy}>
        <h2>När blir familjeabonnemang billigare?</h2>
        <p>Det avgörs av hela paketet: priset för huvudabonnemanget, kostnaden för extra användare, kampanjperioden och eventuella avgifter. Jämför den summan med vad samtliga separata abonnemang faktiskt kostar över samma tolv månader.</p>
        <h2>Billigare är inte automatiskt bättre</h2>
        <p>Kontrollera att surfmängden och täckningen fungerar för alla. Ett familjepris kan se lågt ut men bli sämre om någon behöver köpa extra surf eller om nät, EU-surf eller bindningstid inte motsvarar de separata abonnemangen.</p>
      </section>
    </main>
  </>;
}
