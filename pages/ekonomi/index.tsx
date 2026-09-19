import Head from 'next/head';
import { PiggyBank, ArrowRight, BadgeCheck } from 'lucide-react';
import styles from '../../styles/Home.module.css';
import PartnerOffers from '../../components/PartnerOffers';

export default function Ekonomi(){
 const schema={'@context':'https://schema.org','@type':'WebPage',name:'Jämför lån och sänk dina finanskostnader',url:'https://sankkostnaden.se/ekonomi/',description:'Jämför privatlån och verktyg för privatekonomi. Se effektiv ränta, avgifter och villkor innan du väljer.'};
 return <><Head>
  <title>Jämför lån & privatekonomi 2026 | Sänk Kostnaden</title>
  <meta name='description' content='Jämför privatlån och tjänster för privatekonomi. Kontrollera effektiv ränta, avgifter, löptid och total kostnad innan du väljer.' />
  <link rel='canonical' href='https://sankkostnaden.se/ekonomi/' />
  <meta name='robots' content='index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' />
  <script type='application/ld+json' dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}} />
 </Head>
 <header className={styles.nav}><a className={styles.brand} href='/'><span className={styles.brandMark}><PiggyBank size={21}/></span><span>Sänk Kostnaden</span></a><nav><a href='/bredband/'>Bredband</a><a href='/elavtal/'>El</a><a href='/mobil/'>Mobil</a><a href='/forsakring/'>Försäkring</a></nav></header>
 <main>
  <section className={styles.hero}><div className={styles.heroGrid}><div><div className={styles.eyebrow}><BadgeCheck size={16}/> PRIVATEKONOMI · 2026</div><h1>Jämför lån.<br/><span>Sänk kostnaden.</span></h1><p className={styles.lead}>Har du redan lån eller behöver finansiering? Jämför inte bara månadsbeloppet. Effektiv ränta, avgifter och löptid avgör vad lånet faktiskt kostar.</p></div></div></section>
  <section className={styles.section}><div className={styles.sectionHead}><div><p>JÄMFÖR PRIVATLÅN</p><h2>Kontrollera total kostnad innan du ansöker</h2></div><p>En lägre månadskostnad kan bero på längre återbetalningstid och därmed högre total kostnad. Jämför erbjudanden på samma lånebelopp och löptid.</p></div>
   <PartnerOffers category='ekonomi' intent='loan' limit={4}/>
   <div className={styles.trafficMagnets}>
    <a href='/ekonomi/'><span>CHECKLISTA</span><strong>Fyra saker att jämföra</strong><p>Effektiv ränta, uppläggnings- och aviavgifter, löptid och total återbetalning.</p><b>Jämför på samma villkor <ArrowRight size={16}/></b></a>
    <a href='/ekonomi/'><span>VIKTIGT</span><strong>Samlingslån är inte automatiskt billigare</strong><p>Räkna på den nya totalkostnaden och undvik att förlängd löptid äter upp en lägre ränta.</p><b>Se hela kostnaden <ArrowRight size={16}/></b></a>
   </div>
  </section>
  <section className={styles.section}><div className={styles.principle}><div><p>PRIVATEKONOMI</p><h2>Betala mindre.<br/>Inte bara per månad.</h2></div><div><p>Sänk Kostnaden visar kommersiella alternativ, men ett nytt lån är inte en besparing i sig. Jämför alltid den effektiva räntan och den totala återbetalningen.</p><p>Partnerlänkar märks tydligt och alla aktörer på marknaden behöver inte finnas med.</p></div></div></section>
 </main></>;
}