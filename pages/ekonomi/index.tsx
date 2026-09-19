import Head from 'next/head';
import { PiggyBank, ArrowRight, BadgeCheck } from 'lucide-react';
import styles from '../../styles/Home.module.css';
import PartnerOffers from '../../components/PartnerOffers';

export default function Ekonomi(){
 const schema={'@context':'https://schema.org','@graph':[{'@type':'WebPage',name:'Jämför privatlån och samlingslån',url:'https://sankkostnaden.se/ekonomi/',description:'Jämför privatlån och samlingslån. Se effektiv ränta, avgifter, löptid och total kostnad innan du väljer.'},{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Sänk Kostnaden',item:'https://sankkostnaden.se/'},{'@type':'ListItem',position:2,name:'Lån & ekonomi',item:'https://sankkostnaden.se/ekonomi/'}]}]};
 return <><Head>
  <title>Jämför privatlån & samlingslån 2026 | Sänk Kostnaden</title>
  <meta name='description' content='Jämför privatlån och samlingslån. Kontrollera effektiv ränta, avgifter, löptid och total kostnad innan du väljer.' />
  <link rel='canonical' href='https://sankkostnaden.se/ekonomi/' />
  <meta name='robots' content='index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' />
  <script type='application/ld+json' dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}} />
 </Head>
 <header className={styles.nav}><a className={styles.brand} href='/'><span className={styles.brandMark}><PiggyBank size={21}/></span><span>Sänk Kostnaden</span></a><nav><a href='/bredband/'>Bredband</a><a href='/elavtal/'>El</a><a href='/mobil/'>Mobil</a><a href='/forsakring/'>Försäkring</a><a href='/ekonomi/'>Ekonomi</a></nav></header>
 <main>
  <section className={styles.hero}><div className={styles.heroGrid}><div><div className={styles.eyebrow}><BadgeCheck size={16}/> PRIVATEKONOMI · 2026</div><h1>Jämför privatlån.<br/><span>Sänk lånekostnaden.</span></h1><p className={styles.lead}>Har du redan lån eller behöver finansiering? Jämför inte bara månadsbeloppet. Effektiv ränta, avgifter och löptid avgör vad lånet faktiskt kostar.</p></div></div></section>
  <section className={styles.section}><div className={styles.sectionHead}><div><p>JÄMFÖR PRIVATLÅN</p><h2>Kontrollera total kostnad innan du ansöker</h2></div><p>En lägre månadskostnad kan bero på längre återbetalningstid och därmed högre total kostnad. Jämför erbjudanden på samma lånebelopp och löptid.</p></div>
   <PartnerOffers category='ekonomi' intent='loan' limit={6} heading='Aktiva lånealternativ att jämföra'/>
   <div className={styles.trafficMagnets}>
    <a href='#jamfor-lan'><span>CHECKLISTA</span><strong>Fyra saker att jämföra</strong><p>Effektiv ränta, uppläggnings- och aviavgifter, löptid och total återbetalning.</p><b>Jämför på samma villkor <ArrowRight size={16}/></b></a>
    <a href='#samlingslan'><span>VIKTIGT</span><strong>Samlingslån är inte automatiskt billigare</strong><p>Räkna på den nya totalkostnaden och undvik att förlängd löptid äter upp en lägre ränta.</p><b>Se hela kostnaden <ArrowRight size={16}/></b></a>
   </div>
  </section>
  <section className={styles.section} id='jamfor-lan'><div className={styles.sectionHead}><div><p>SÅ JÄMFÖR DU</p><h2>Fyra siffror som avgör vad lånet kostar</h2></div><p>Utgå från samma lånebelopp och samma återbetalningstid när du jämför. Då blir skillnader mellan erbjudandena lättare att se.</p></div><div className={styles.trafficMagnets}><div><span>1</span><strong>Effektiv ränta</strong><p>Inkluderar ränta och obligatoriska avgifter och är därför bättre för jämförelser än nominell ränta.</p></div><div><span>2</span><strong>Total återbetalning</strong><p>Visar hur mycket du sammanlagt betalar tillbaka under hela löptiden.</p></div><div><span>3</span><strong>Löptid</strong><p>Längre löptid kan sänka månadsbeloppet men samtidigt höja den sammanlagda kostnaden.</p></div><div><span>4</span><strong>Avgifter</strong><p>Kontrollera bland annat uppläggningsavgift och aviavgift innan du jämför erbjudanden.</p></div></div></section><section className={styles.section} id='samlingslan'><div className={styles.sectionHead}><div><p>SAMLINGSLÅN</p><h2>När kan det sänka kostnaden?</h2></div><p>Att samla lån kan minska kostnaden om den nya effektiva räntan och den totala återbetalningen faktiskt blir lägre. Jämför inte enbart den nya månadskostnaden och ta hänsyn till eventuell längre löptid.</p></div></section><section className={styles.section}><div className={styles.sectionHead}><div><p>PRIVATEKONOMI</p><h2>Få bättre kontroll innan du ändrar något</h2></div><p>Ett budget- eller översiktsverktyg kan hjälpa dig se helheten innan du tar ett nytt lån eller flyttar befintliga kostnader.</p></div><PartnerOffers category='ekonomi' intent='saving' limit={2} heading='Verktyg för privatekonomi'/></section><section className={styles.section}><div className={styles.principle}><div><p>PRIVATEKONOMI</p><h2>Betala mindre.<br/>Inte bara per månad.</h2></div><div><p>Sänk Kostnaden visar kommersiella alternativ, men ett nytt lån är inte en besparing i sig. Jämför alltid den effektiva räntan och den totala återbetalningen.</p><p>Partnerlänkar märks tydligt och alla aktörer på marknaden behöver inte finnas med.</p></div></div></section>
 </main></>;
}