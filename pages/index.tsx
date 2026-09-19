import Head from 'next/head';
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronRight,
  PiggyBank,
  CircleDollarSign,
  ShieldCheck,
  Smartphone,
  Wifi,
  Zap,
} from 'lucide-react';
import styles from '../styles/Home.module.css';
import SavingsNavigator from '../components/SavingsNavigator';

const categories = [
  { icon: Wifi, title: 'Bredband', text: 'Börja med vad som finns på adressen och jämför sedan pris, hastighet och bindningstid.', label: 'Börja med adressen', href: '/bredband/bredband-pa-min-adress/' },
  { icon: Zap, title: 'Elavtal', text: 'Jämför avtalsform, påslag och fasta avgifter i stället för att bara titta på ett lockpris.', label: 'Jämför villkoren', href: '/elavtal/jamfor-elavtal/' },
  { icon: Smartphone, title: 'Mobil', text: 'Jämför surf, nät, familjeupplägg och vad abonnemanget faktiskt kostar över tid.', label: 'Se billigare alternativ', href: '/mobil/billigaste-mobilabonnemanget/' },
  { icon: ShieldCheck, title: 'Försäkring', text: 'Jämför premie, självrisk och omfattning på samma nivå innan du väljer bolag.', label: 'Jämför samma skydd', href: '/forsakring/jamfor-forsakring/' },
  { icon: CircleDollarSign, title: 'Lån & ekonomi', text: 'Jämför effektiv ränta, avgifter och total kostnad – inte bara månadsbeloppet.', label: 'Jämför kostnaden', href: '/ekonomi/' },
];

const intentLinks = [
  ['/bredband/billigaste-bredbandet/', 'Billigaste bredbandet 2026', 'Se förbi kampanjpriset'],
  ['/bredband/bredband-pa-min-adress/', 'Bredband på min adress', 'Börja med vad som faktiskt går att beställa'],
  ['/bredband/utan-bindningstid/', 'Bredband utan bindningstid', 'Flexibilitet utan onödig låsning'],
  ['/mobil/billigaste-mobilabonnemanget/', 'Billigaste mobilabonnemanget 2026', 'Jämför verklig förstaårskostnad'],
  ['/mobil/familjeabonnemang/', 'Familjeabonnemang mobil', 'Räkna hela familjens kostnad'],
  ['/elavtal/billigaste-elavtalet/', 'Billigaste elavtalet 2026', 'Jämför pris, påslag och avgifter'],
  ['/elavtal/byta-elavtal/', 'Byta elavtal 2026', 'Checklista före bytet'],
  ['/mobil/utan-bindningstid/', 'Mobil utan bindningstid', 'Jämför flexibilitet och årskostnad'],
  ['/forsakring/vad-kostar-hemforsakring/', 'Vad kostar hemförsäkring?', 'Jämför pris och skydd'],
  ['/bredband/100-100/', 'Bredband 100/100', 'Se om 100 Mbit/s räcker'],
  ['/mobil/fri-surf/', 'Mobil med fri surf', 'När obegränsad data är värd priset'],
  ['/bredband/mobilt-bredband/', 'Mobilt bredband 2026', 'Jämför 5G, data och täckning'],
  ['/elavtal/kvartspris/', 'Kvartspris på el', 'Se om styrbar förbrukning passar dig'],
  ['/elavtal/jamfor-elavtal/', 'Jämför elavtal 2026', 'Pris, påslag och avtalsform'],
  ['/bredband/5g-bredband/', '5G-bredband 2026', 'När kan det ersätta fiber?'],
  ['/mobil/5g-abonnemang/', '5G-abonnemang 2026', 'Jämför nät, fart och kostnad'],
  ['/forsakring/hemforsakring-bostadsratt/', 'Hemförsäkring bostadsrätt', 'Jämför rätt skydd och självrisk'],
];

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Sänk Kostnaden',
  url: 'https://sankkostnaden.se/',
  description: 'En samlad startpunkt för att sänka hushållets återkommande kostnader. Jämför el, bredband, mobil, försäkring och privatekonomi på samma ställe.',
};

export default function Home() {
  return (
    <>
      <Head>
        <title>Sänk din månadskostnad – jämför el, bredband, mobil och försäkring | Sänk Kostnaden</title>
        <meta name='description' content='Sänk din månadskostnad genom att se över fasta kostnader. Jämför bredband, elavtal, mobilabonnemang och försäkring med guider och gratis verktyg.' />
        <link rel='canonical' href='https://sankkostnaden.se/' />
        <meta property='og:title' content='Sänk Kostnaden – hitta onödiga fasta utgifter' />
        <meta property='og:description' content='Gratis guider och verktyg för att jämföra hushållets återkommande kostnader.' />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://sankkostnaden.se/' />
        <meta name='robots' content='index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' />
        <meta name='twitter:card' content='summary' />
        <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>

      <header className={styles.nav}>
        <a className={styles.brand} href='/'>
          <span className={styles.brandMark}><PiggyBank size={21} /></span>
          <span>Sänk Kostnaden</span>
        </a>
        <nav>
          <a href='/bredband/'>Bredband</a>
          <a href='/elavtal/'>El</a>
          <a href='/mobil/'>Mobil</a>
          <a href='/forsakring/'>Försäkring</a>
          <a href='/ekonomi/'>Ekonomi</a>
        </nav>
        <a className={styles.navCta} href='#partners'>Jämför priser</a>
      </header>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroGlow} />
          <div className={styles.heroGrid}>
            <div>
              <div className={styles.eyebrow}><BadgeCheck size={16} /> Gratis guider · tydliga partnerlänkar · jämför fasta kostnader</div>
              <h1>Sänk din<br /><span>månadskostnad.</span></h1>
              <p className={styles.lead}>Se över hushållets fasta kostnader och välj vad du vill betala mindre för. Vi tar dig direkt till rätt jämförelse.</p>
              <div className={styles.quickChoices}>
                <a href='/elavtal/jamfor-elavtal/'><Zap size={20} /><span><strong>El</strong><small>Jämför elavtal</small></span><ArrowRight size={17} /></a>
                <a href='/bredband/bredband-pa-min-adress/'><Wifi size={20} /><span><strong>Bredband</strong><small>Se vad som finns på adressen</small></span><ArrowRight size={17} /></a>
                <a href='/mobil/billigaste-mobilabonnemanget/'><Smartphone size={20} /><span><strong>Mobil</strong><small>Hitta billigare abonnemang</small></span><ArrowRight size={17} /></a>
                <a href='/forsakring/jamfor-forsakring/'><ShieldCheck size={20} /><span><strong>Försäkring</strong><small>Jämför pris och skydd</small></span><ArrowRight size={17} /></a>
                <a href='/ekonomi/'><CircleDollarSign size={20} /><span><strong>Lån & ekonomi</strong><small>Jämför total lånekostnad</small></span><ArrowRight size={17} /></a>
              </div>
              <div className={styles.trust}>
                <span><Check size={15} /> Ingen inloggning</span>
                <span><Check size={15} /> Kommersiella länkar märks tydligt</span>
              </div>
            </div>


          </div>
        </section>

        <section className={styles.section} style={{paddingTop:54,paddingBottom:46}}><SavingsNavigator /></section>

        <section className={styles.section} id='jamfor'>
          <div className={styles.sectionHead}>
              <div><p>ETT STÄLLE FÖR HUSHÅLLET</p><h2>Börja med kostnaden som stör dig mest</h2></div>
              <p>Du behöver inte leta upp en ny jämförelsesajt för varje avtal. Sänk Kostnaden är startpunkten och varje område leder vidare till rätt beslutsunderlag.</p>
          </div>
          <div className={styles.categoryGrid}>
            {categories.map(({ icon: Icon, title, text, label, href }) => (
              <a className={styles.categoryCard} href={href} key={title}>
                <div className={styles.icon}><Icon size={23} /></div>
                <span>{label}</span>
                <h3>{title}</h3>
                <p>{text}</p>
                <b>Jämför nu <ChevronRight size={16} /></b>
              </a>
            ))}
          </div>
        </section>

        <section className={styles.hubBand}><div><p>NÄSTA KOSTNAD?</p><h2>Fortsätt sänka hushållets utgifter.</h2><span>Bytt bredband? Ta elen, mobilen, försäkringen eller ekonomin härnäst. Du ska inte behöva leta upp en ny jämförelsesajt för varje avtal.</span></div><div className={styles.crossLinks}><a href='/elavtal/jamfor-elavtal/'>El <ArrowRight size={15} /></a><a href='/mobil/billigaste-mobilabonnemanget/'>Mobil <ArrowRight size={15} /></a><a href='/forsakring/jamfor-forsakring/'>Försäkring <ArrowRight size={15} /></a><a href='/ekonomi/'>Ekonomi <ArrowRight size={15} /></a></div></section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <div><p>SMARTA SNABBTESTER</p><h2>Sluta betala för mer än du behöver</h2></div>
            <p>Tre frågor ger dig en behovsprofil och leder direkt till rätt jämförelse. Inga påhittade marknadspriser – bara ett smartare sätt att välja nivå.</p>
          </div>
          <div className={styles.categoryGrid}>
            <a className={styles.categoryCard} href='/bredband/vilken-hastighet-behover-jag/'><div className={styles.icon}><Wifi size={23} /></div><span>3 FRÅGOR</span><h3>Bredbandsfart</h3><p>100, 250, 500 eller 1000 Mbit/s? Se vilken nivå som matchar hushållet.</p><b>Gör testet <ChevronRight size={16} /></b></a>
            <a className={styles.categoryCard} href='/mobil/hur-mycket-surf-behover-jag/'><div className={styles.icon}><Smartphone size={23} /></div><span>3 FRÅGOR</span><h3>Surfmängd</h3><p>Se om du behöver liten datapott, normal surf eller om fri surf faktiskt är motiverad.</p><b>Gör testet <ChevronRight size={16} /></b></a>
            <a className={styles.categoryCard} href='/elavtal/vilket-elavtal-passar-mig/'><div className={styles.icon}><Zap size={23} /></div><span>3 FRÅGOR</span><h3>Elavtalstyp</h3><p>Matcha riskvilja och styrbar förbrukning mot fast, rörligt eller kvartspris.</p><b>Gör testet <ChevronRight size={16} /></b></a>
            <a className={styles.categoryCard} href='/forsakring/hemforsakring-skyddskoll/'><div className={styles.icon}><ShieldCheck size={23} /></div><span>3 FRÅGOR</span><h3>Skyddskoll</h3><p>Se vilka villkor du bör kontrollera innan du jämför pris på hemförsäkring.</p><b>Gör testet <ChevronRight size={16} /></b></a>
          </div>
          <div className={styles.trafficMagnets}>
            <a href='/elavtal/hur-mycket-el-drar-mitt-hus/'><span>ELKOLL</span><strong>Hur mycket el drar mitt hus?</strong><p>Bygg en husprofil och få ett riktvärde i kWh utifrån boyta, uppvärmning, hushåll, elbil och spa.</p><b>Räkna på huset <ArrowRight size={16} /></b></a>
            <a href='/mobil/lonar-sig-familjeabonnemang/'><span>FAMILJEKOLL</span><strong>Lönar sig familjeabonnemang?</strong><p>Jämför familjens verkliga totalsumma och se vilket pris per extra användare som måste slås.</p><b>Räkna på familjen <ArrowRight size={16} /></b></a>
            <a href='/mobil/fri-surf/'><span>NY · FRI SURF</span><strong>Är fri surf värt det?</strong><p>Fem frågor väger data, streaming, hotspot och wifi mot nyttan av obegränsad surf.</p><b>Gör fri-surf-testet <ArrowRight size={16} /></b></a>
            <a href='/bredband/fiber-eller-mobilt-bredband/'><span>NY · FIBER ELLER 5G</span><strong>Vad passar ditt hem?</strong><p>Väg stabilitet, samtidighet, användning och mobil signal och få en uppkopplingsprofil.</p><b>Gör bredbandstestet <ArrowRight size={16} /></b></a>
            <a href='/elavtal/vilket-elavtal-passar-mig/'><span>UPPGRADERAD · ELAVTAL</span><strong>Fast, rörligt eller kvartspris?</strong><p>Fem frågor om risk, styrbarhet och vanor ger en tydligare avtalsprofil.</p><b>Gör elavtalstestet <ArrowRight size={16} /></b></a>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <div><p>GRATIS VERKTYG & CHECKLISTOR</p><h2>Börja med helheten – gå sedan direkt till rätt avtal</h2></div>
            <p>Räkna först om du vill se din egen skillnad, eller använd guiderna för att hitta vilken kostnad som är värd att ta först.</p>
          </div>
          <div className={styles.trafficMagnets}>
            <a href='/verktyg/hushallskostnadskollen/'><span>NY · HUSHÅLLSKOLL</span><strong>Vad kostar ditt hushåll?</strong><p>Fyll i dina verkliga återkommande kostnader och se månad, år och vilken jämförbar post som är störst.</p><b>Starta kostnadskollen <ArrowRight size={16} /></b></a>
            <a href='/app/'><span>GRATIS KALKYL</span><strong>Vad kan du spara?</strong><p>Räkna på dina egna priser för el, bredband, mobil och försäkring och se skillnaden per år.</p><b>Starta kalkylen <ArrowRight size={16} /></b></a>
            <a href='/guide/hushallets-fasta-kostnader-2026/'><span>2026-GUIDE</span><strong>Hushållets fasta kostnader</strong><p>Karta över de stora återkommande posterna och hur du prioriterar dem.</p><b>Öppna guiden <ArrowRight size={16} /></b></a>
            <a href='/guide/arskoll-fasta-kostnader/'><span>CHECKLISTA</span><strong>Årskoll av fasta kostnader</strong><p>Gå igenom el, bredband, mobil och försäkring steg för steg.</p><b>Starta årskollen <ArrowRight size={16} /></b></a>
          </div>
        </section>

        <section className={styles.intentSection}>
          <div className={styles.section}>
            <div className={styles.sectionHead}>
              <div><p>HÖG KÖPINTENTION</p><h2>Populära jämförelser när du faktiskt är redo att byta</h2></div>
              <p>Vill du läsa mer först finns guiderna här. Varje guide leder samtidigt vidare till en relevant jämförelse när du är redo.</p>
            </div>
            <div className={styles.intentGrid}>
              {intentLinks.map(([href, title, text], index) => (
                <a href={href} key={href}><em>0{index + 1}</em><div><strong>{title}</strong><span>{text}</span></div><ArrowRight size={18} /></a>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.dark}>
          <div className={styles.darkGrid}>
            <div>
              <p className={styles.darkKicker}>KORTASTE VÄGEN TILL ETT BESLUT</p>
              <h2>Jämför först. Läs detaljerna när de behövs.</h2>
              <p>På en bra jämförelsesida ska nästa steg vara uppenbart. Börja med ditt område och använd guiderna för det som faktiskt kan ändra beslutet.</p>
              <a href='/bredband/billigaste-bredbandet/'>Jämför bredband <ArrowRight size={18} /></a>
            </div>
            <div className={styles.metricCard}>
              <span>Snabbkontroll</span>
              <strong>3 saker</strong>
              <b>Tillgänglighet · totalpris · bindningstid</b>
              <small>Det räcker ofta för att sålla bort fel alternativ innan du läser detaljerna.</small>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.principle}>
            <div><p>VÅR PRINCIP</p><h2>Besparing först.<br />Provision sedan.</h2></div>
            <div><p>Sänk Kostnaden ska vara användbar även när du aldrig klickar på en partnerlänk. Vi jämför total kostnad, behov och villkor innan ett kommersiellt alternativ visas.</p><p>När en länk är kommersiell märks den tydligt. Alla aktörer på marknaden behöver inte finnas med.</p><a href='/sa-jamfor-vi/'>Läs hur vi jämför →</a></div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div><a className={styles.brand} href='/'><span className={styles.brandMark}><PiggyBank size={19} /></span><span>Sänk Kostnaden</span></a><p>Praktiska guider för lägre hushållskostnader.</p></div>
        <div><a href='/sa-jamfor-vi/'>Så jämför vi</a><a href='/affiliate/'>Affiliateinformation</a><a href='/cookies/'>Cookiepolicy</a><a href='/integritet/'>Integritet</a><a href='/om/'>Om oss</a><a href='mailto:kontakt@sankkostnaden.se'>kontakt@sankkostnaden.se</a></div>
        <p>© 2026 Sänk Kostnaden. Informationen är generell och utgör inte individuell finansiell rådgivning.</p>
      </footer>
    </>
  );
}
