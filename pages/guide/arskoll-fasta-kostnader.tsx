import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, PiggyBank } from 'lucide-react';

const checklist = [
  'Hämta de senaste fakturorna – använd verkligt betalt pris, inte listpris.',
  'Skriv upp ordinarie pris och när eventuell rabatt eller kampanj tar slut.',
  'Notera bindningstid och uppsägningstid innan du ändrar något.',
  'Ta bort tillägg, extra surf, hastighet eller skydd som du inte behöver.',
  'Jämför likvärdiga alternativ och räkna hela kostnaden över tolv månader.',
  'Kontrollera nästa stora avtal när det första är klart.',
];

export default function ArskollFastaKostnader() {
  return (
    <>
      <Head>
        <title>Årskoll av fasta kostnader – checklista för hushållet 2026</title>
        <meta name='description' content='Gratis årskoll för hushållets fasta kostnader. Gå igenom el, bredband, mobil och försäkring steg för steg och hitta avtal som är värda att jämföra.'/>
        <link rel='canonical' href='https://sankkostnaden.se/guide/arskoll-fasta-kostnader/'/><script type='application/ld+json' dangerouslySetInnerHTML={{__html: JSON.stringify({'@context':'https://schema.org','@type':'Article',headline:"Årskoll av fasta kostnader – checklista för hushållet 2026",description:"Gratis årskoll för hushållets fasta kostnader. Gå igenom el, bredband, mobil och försäkring steg för steg och hitta avtal som är värda att jämföra.",url:"https://sankkostnaden.se/guide/arskoll-fasta-kostnader/",dateModified:'2026-09-19',publisher:{'@type':'Organization',name:'Sänk Kostnaden',url:'https://sankkostnaden.se/'}})}} />
      </Head>
      <header className='topbar'><Link className='brand' href='/'><span className='brandMark'><PiggyBank size={22}/></span><span>Sänk Kostnaden</span></Link></header>
      <main>
        <section className='guideHero'><div className='guideWrap'><Link className='back' href='/'><ArrowLeft size={16}/> Startsidan</Link><div className='guideIcon'><Check size={25}/></div><p className='kicker'>GRATIS CHECKLISTA • UPPDATERAD SEPTEMBER 2026</p><h1>Årskoll av hushållets fasta kostnader</h1><p className='lead'>En enkel kontroll en gång om året kan fånga kampanjpriser som löpt ut, onödiga tillägg och avtal som inte längre passar hushållet. Börja med de största posterna och gå vidare därifrån.</p></div></section>
        <article className='article guideWrap'>
          <div className='intentActions'><Link className='primary' href='/verktyg/hushallskostnadskollen/'>Räkna hushållets kostnader <ArrowRight size={16}/></Link><Link className='secondary' href='/app/'>Prioritera vilka avtal du bör granska</Link></div>
          <div className='decisionPanel'><div><p className='partnerEyebrow'>6 STEG</p><h2>Gör kontrollen på under en timme</h2><p>Du behöver inte byta allt. Målet är att identifiera vilka avtal som faktiskt är värda att jämföra.</p></div><div className='decisionMetrics'><span><b>1</b> Fakturor</span><span><b>2</b> Villkor</span><span><b>3</b> Behov</span><span><b>4</b> Årskostnad</span></div></div>
          <div className='checkList'>{checklist.map(item => <p key={item}><Check size={18}/>{item}</p>)}</div>
          <h2>1. Bredband: kontrollera adressen först</h2><p>Utbudet kan skilja mellan adresser. Börja därför med vad som faktiskt går att beställa och jämför sedan totalpris, hastighet och bindningstid.</p><div className='intentActions'><Link className='primary' href='/bredband/bredband-pa-min-adress/'>Kontrollera bredband <ArrowRight size={16}/></Link><Link className='secondary' href='/bredband/vilken-hastighet-behover-jag/'>Hur snabbt behöver du?</Link></div>
          <h2>2. El: jämför mer än öre per kWh</h2><p>Påslag, fasta avgifter, avtalsform och villkor påverkar vad du faktiskt betalar. Använd din egen årsförbrukning när du jämför.</p><div className='intentActions'><Link className='primary' href='/elavtal/jamfor-elavtal/'>Jämför elavtal <ArrowRight size={16}/></Link><Link className='secondary' href='/elavtal/sa-laser-du-elfakturan/'>Läs elfakturan</Link></div>
          <h2>3. Mobil: räkna hela familjen</h2><p>Kontrollera hur mycket surf som faktiskt används och vad priset blir efter kampanjperioden. För familjer är totalen för alla abonnemang viktigare än priset på en enskild rad.</p><div className='intentActions'><Link className='primary' href='/mobil/billigaste-mobilabonnemanget/'>Jämför mobil <ArrowRight size={16}/></Link><Link className='secondary' href='/mobil/familjeabonnemang/'>Familjeabonnemang</Link></div>
          <h2>4. Försäkring: jämför samma skydd</h2><p>Kontrollera premie, självrisk och omfattning tillsammans. Att sänka premien genom att ta bort ett skydd du behöver är inte samma sak som att sänka kostnaden.</p><div className='intentActions'><Link className='primary' href='/forsakring/jamfor-forsakring/'>Jämför försäkring <ArrowRight size={16}/></Link><Link className='secondary' href='/forsakring/vad-kostar-hemforsakring/'>Vad kostar hemförsäkring?</Link></div><h2>5. Lån: jämför total kostnad, inte bara månadsbelopp</h2><p>Om du har privatlån eller funderar på att samla lån ska du jämföra effektiv ränta, avgifter, löptid och total återbetalning. En lägre månadskostnad kan annars bero på längre återbetalningstid.</p><div className='intentActions'><Link className='primary' href='/ekonomi/'>Jämför lånekostnader <ArrowRight size={16}/></Link></div>
          <p>Vill du först kartlägga vilka poster som är störst kan du läsa <Link href='/guide/hushallets-fasta-kostnader-2026/'>guiden till hushållets fasta kostnader 2026</Link> och därefter använda checklistan här.</p><div className='note'><strong>Spara sidan till nästa år.</strong> Gör samma kontroll när ett större avtal löper ut eller när ett kampanjpris går över till ordinarie pris.</div>
          <p className='disclosure'>Sänk Kostnaden kan finansieras genom affiliatelänkar som markeras tydligt. Vi rekommenderar att du alltid kontrollerar pris, innehåll och kostnader för att ändra eller avsluta ett avtal innan du byter.</p>
        </article>
      </main>
    </>
  );
}
