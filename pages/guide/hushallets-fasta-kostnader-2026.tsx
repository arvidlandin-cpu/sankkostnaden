import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, PiggyBank } from 'lucide-react';

const areas = [
  ['Boende och lån', 'Ofta hushållets största återkommande post. Börja med ränta, amorteringsvillkor och boenderelaterade avgifter.'],
  ['Transport', 'Bil, finansiering, försäkring, bränsle eller laddning och service kan tillsammans bli en mycket stor månadskostnad.'],
  ['El', 'Jämför hela avtalet: energipris, påslag, fasta avgifter, avtalsform och villkor efter eventuell kampanj.'],
  ['Bredband', 'Kontrollera först vad som går att beställa på adressen och betala sedan inte för mer hastighet än hushållet behöver.'],
  ['Mobil', 'Titta på hela familjens surfbehov, nät och total kostnad över tid – inte bara kampanjpriset.'],
  ['Försäkring', 'Jämför samma skyddsnivå, självrisk och omfattning. Ett lägre pris är inte en besparing om skyddet samtidigt försämras.'],
  ['Media och abonnemang', 'Streaming, musik, spel och andra små abonnemang är lätta att glömma eftersom varje enskilt belopp är relativt litet.'],
];

export default function HushalletsFastaKostnader() {
  return (
    <>
      <Head>
        <title>Hushållets fasta kostnader 2026 – vad ska du kontrollera?</title>
        <meta name='description' content='Checklista över hushållets stora återkommande kostnader 2026. Se vilka avtal som är värda att kontrollera först och gå vidare till rätt jämförelse.'/>
        <link rel='canonical' href='https://sankkostnaden.se/guide/hushallets-fasta-kostnader-2026/'/>
      </Head>
      <header className='topbar'><Link className='brand' href='/'><span className='brandMark'><PiggyBank size={22}/></span><span>Sänk Kostnaden</span></Link></header>
      <main>
        <section className='guideHero'><div className='guideWrap'><Link className='back' href='/'><ArrowLeft size={16}/> Startsidan</Link><div className='guideIcon'><PiggyBank size={25}/></div><p className='kicker'>HUSHÅLLSEKONOMI • UPPDATERAD SEPTEMBER 2026</p><h1>Hushållets fasta kostnader 2026</h1><p className='lead'>Vilka återkommande utgifter är värda att kontrollera först? Här får du en praktisk karta över hushållets kostnader – utan påhittade snittpriser eller löften om besparingar som inte går att belägga.</p></div></section>
        <article className='article guideWrap'>
          <div className='decisionPanel'><div><p className='partnerEyebrow'>BÖRJA DÄR DET GÖR SKILLNAD</p><h2>Fyra avtal du kan kontrollera direkt</h2><p>Vi har redan beslutsstöd för el, bredband, mobil och försäkring. Välj den post du vill börja med.</p></div><div className='decisionMetrics'><span><b>1</b> El</span><span><b>2</b> Bredband</span><span><b>3</b> Mobil</span><span><b>4</b> Försäkring</span></div></div>
          <div className='intentActions'><Link className='primary' href='/bredband/bredband-pa-min-adress/'>Bredband på min adress <ArrowRight size={16}/></Link><Link className='secondary' href='/elavtal/jamfor-elavtal/'>Jämför elavtal</Link><Link className='secondary' href='/mobil/billigaste-mobilabonnemanget/'>Jämför mobil</Link><Link className='secondary' href='/forsakring/jamfor-forsakring/'>Jämför försäkring</Link></div>
          <h2>De stora återkommande posterna</h2>
          <p>Alla hushåll ser olika ut. Därför är det mer användbart att kartlägga dina faktiska avtal än att utgå från ett generellt genomsnitt. Skriv upp verklig månadskostnad, bindningstid och nästa möjliga bytesdatum för varje post.</p>
          <div className='checkList'>{areas.map(([title, text]) => <p key={title}><Check size={18}/><span><strong>{title}:</strong> {text}</span></p>)}</div>
          <h2>Så prioriterar du på 15 minuter</h2>
          <p>Sortera posterna efter årskostnad. Markera sedan sådant som går att påverka utan att hushållets nytta försämras. Ett avtal som kostar 500 kronor mer per månad än ett likvärdigt alternativ är normalt viktigare att kontrollera än fem små tjänster på 49 kronor.</p>
          <div className='note'><strong>Räkna på år, inte bara månad.</strong> Multiplicera den verkliga månadskostnaden med tolv och lägg till startavgifter, hårdvara och andra obligatoriska kostnader. Då blir små prisskillnader lättare att värdera.</div>
          <h2>Gör en årlig kontroll av kostnaderna</h2><p>Vill du gå systematiskt igenom hushållet kan du använda vår <Link href='/guide/arskoll-fasta-kostnader/'>årskoll av fasta kostnader</Link>. Den samlar kontroll av fakturor, villkor, behov och årskostnad i en checklista.</p><h2>Kontrollera nästa kostnad direkt</h2>
          <div className='trafficLinks'><Link href='/elavtal/billigaste-elavtalet/'><strong>Elavtal</strong><span>Pris, påslag, fasta avgifter och villkor →</span></Link><Link href='/bredband/billigaste-bredbandet/'><strong>Bredband</strong><span>Tillgänglighet, hastighet och totalpris →</span></Link><Link href='/mobil/billigaste-mobilabonnemanget/'><strong>Mobil</strong><span>Surf, nät och förstaårskostnad →</span></Link></div>
          <p className='disclosure'>Sänk Kostnaden kan finansieras genom affiliatelänkar som markeras tydligt. Ersättning kan påverka vilka kommersiella alternativ som visas. Informationen här är generell och ersätter inte individuell ekonomisk rådgivning.</p>
        </article>
      </main>
    </>
  );
}
