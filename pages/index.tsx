import Head from 'next/head';
import { useEffect, useState } from 'react';
import { ArrowRight, PiggyBank } from 'lucide-react';
import styles from '../styles/Home.module.css';
import HomeHero from '../components/HomeHero';

const categories=[
  {title:'Bredband',subtitle:'Pris, fart & adress',href:'/bredband/bredband-pa-min-adress/',image:'/design/card-bredband.webp'},
  {title:'El',subtitle:'Avtal & elpriser',href:'/elavtal/jamfor-elavtal/',image:'/design/card-el.webp'},
  {title:'Mobil',subtitle:'Surf & abonnemang',href:'/mobil/billigaste-mobilabonnemanget/',image:'/design/card-mobil.webp'},
  {title:'Försäkring',subtitle:'Djur, hem & person',href:'/forsakring/jamfor-forsakring/',image:'/design/card-forsakring.webp'},
  {title:'Lån & ekonomi',subtitle:'Ränta & totalkostnad',href:'/ekonomi/',image:'/design/card-ekonomi.webp'},
];

const guideGroups=[
  {title:'Snabbhjälp',links:[
    ['/bredband/vilken-hastighet-behover-jag/','Vilken bredbandsfart behöver du?'],
    ['/mobil/hur-mycket-surf-behover-jag/','Hur mycket surf behöver du?'],
    ['/elavtal/vilket-elavtal-passar-mig/','Vilket elavtal passar dig?'],
    ['/forsakring/hemforsakring-skyddskoll/','Vilket försäkringsskydd behöver du?'],
  ]},
  {title:'Bredband',links:[
    ['/bredband/billigaste-bredbandet/','Billigaste bredbandet 2026'],
    ['/bredband/utan-bindningstid/','Bredband utan bindningstid'],
    ['/bredband/fiber-eller-mobilt-bredband/','Fiber eller mobilt bredband?'],
    ['/bredband/5g-bredband/','5G-bredband 2026'],
  ]},
  {title:'Mobil',links:[
    ['/mobil/billigaste-mobilabonnemanget/','Billigaste mobilabonnemanget 2026'],
    ['/mobil/familjeabonnemang/','Familjeabonnemang'],
    ['/mobil/fri-surf/','Mobil med fri surf'],
    ['/mobil/utan-bindningstid/','Mobil utan bindningstid'],
  ]},
  {title:'El & försäkring',links:[
    ['/elavtal/billigaste-elavtalet/','Billigaste elavtalet 2026'],
    ['/elavtal/byta-elavtal/','Byta elavtal'],
    ['/elavtal/kvartspris/','Kvartspris på el'],
    ['/forsakring/jamfor-hemforsakring/','Jämför hemförsäkring'],
  ]},
  {title:'Ekonomi',links:[
    ['/ekonomi/','Jämför privatlån & samlingslån'],
    ['/guide/hushallets-fasta-kostnader-2026/','Hushållets fasta kostnader'],
    ['/guide/arskoll-fasta-kostnader/','Årskoll av fasta kostnader'],
    ['/verktyg/hushallskostnadskollen/','Hushållskostnadskollen'],
  ]},
];

const schema={
  '@context':'https://schema.org','@type':'WebSite',name:'Sänk Kostnaden',url:'https://sankkostnaden.se/',
  description:'En samlad startpunkt för att sänka hushållets återkommande kostnader. Jämför el, bredband, mobil, försäkring och privatekonomi på samma ställe.',
};

function ProtectedEmailLink(){
  const [href,setHref]=useState<string|undefined>();
  useEffect(()=>{setHref(`mailto:${window.atob('a29udGFrdEBzYW5ra29zdG5hZGVuLnNl')}`)},[]);
  if(!href) return <span>Kontakta oss</span>;
  return <a href={href}>Kontakta oss</a>;
}

export default function Home(){
  return <>
    <Head>
      <title>Sänk din månadskostnad – jämför el, bredband, mobil, försäkring & lån | Sänk Kostnaden</title>
      <meta name='description' content='Sänk din månadskostnad genom att se över fasta kostnader. Jämför bredband, elavtal, mobilabonnemang, försäkring och lånekostnader med guider och gratis verktyg.'/>
      <link rel='canonical' href='https://sankkostnaden.se/'/>
      <link rel='preconnect' href='https://images.pexels.com' crossOrigin=''/>
      <meta property='og:title' content='Sänk Kostnaden – hitta onödiga fasta utgifter'/>
      <meta property='og:description' content='Gratis guider och verktyg för att jämföra hushållets återkommande kostnader.'/>
      <meta property='og:type' content='website'/><meta property='og:url' content='https://sankkostnaden.se/'/>
      <meta name='robots' content='index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'/>
      <meta name='twitter:card' content='summary'/>
      <script type='application/ld+json' dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/>
    </Head>

    <header className={styles.nav}>
      <a className={styles.brand} href='/'><span className={styles.brandMark}><PiggyBank size={21}/></span><span>Sänk Kostnaden</span></a>
      <nav><a href='/bredband/'>Bredband</a><a href='/elavtal/'>El</a><a href='/mobil/'>Mobil</a><a href='/forsakring/'>Försäkring</a><a href='/ekonomi/'>Ekonomi</a></nav>
      <a className={styles.navCta} href='#jamfor'>Jämför priser <ArrowRight size={15}/></a>
    </header>

    <main>
      <HomeHero/>

      <section className={`${styles.section} ${styles.popularSection}`} id='jamfor'>
        <div className={styles.popularHeader}>
          <div><p>POPULÄRA JÄMFÖRELSER</p><h2>Börja med en kostnad.</h2><span>Välj området du vill se över först. Du kan alltid byta senare.</span></div>
        </div>
        <div className={styles.popularGrid}>
          {categories.map(({title,subtitle,href,image})=><a className={styles.popularCard} href={href} key={title}>
            <img className={styles.popularImageExact} src={image} alt='' loading='lazy'/>
            <div className={styles.popularBody}><small>{subtitle}</small><ArrowRight size={17}/></div>
          </a>)}
        </div>
      </section>

      <section className={styles.guideLibrarySection}>
        <details className={styles.guideLibrary}>
          <summary>Behöver du hjälp eller vill läsa mer? <ArrowRight size={16}/></summary>
          <div className={styles.guideGroups}>
            {guideGroups.map(group=><div key={group.title}><strong>{group.title}</strong>{group.links.map(([href,label])=><a href={href} key={href}>{label}<ArrowRight size={14}/></a>)}</div>)}
          </div>
        </details>
      </section>

      <section className={styles.trustBand}>
        <div><strong>Oberoende vägledning före partnerlänkar.</strong><span>Kommersiella länkar märks tydligt och urvalet omfattar inte hela marknaden.</span></div>
        <a href='/sa-jamfor-vi/'>Så jämför vi <ArrowRight size={15}/></a>
      </section>
    </main>

    <footer className={styles.footer}>
      <div><a className={styles.brand} href='/'><span className={styles.brandMark}><PiggyBank size={19}/></span><span>Sänk Kostnaden</span></a><p>Praktiska guider för lägre hushållskostnader.</p></div>
      <div><a href='/sa-jamfor-vi/'>Så jämför vi</a><a href='/affiliate/'>Affiliateinformation</a><a href='/cookies/'>Cookiepolicy</a><a href='/integritet/'>Integritet</a><a href='/om/'>Om oss</a><ProtectedEmailLink/></div>
      <p>© 2026 Sänk Kostnaden. Informationen är generell och utgör inte individuell finansiell rådgivning.</p>
    </footer>
  </>;
}
