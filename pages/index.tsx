import Head from 'next/head';
import { useEffect, useState } from 'react';
import { ArrowRight, PiggyBank } from 'lucide-react';
import styles from '../styles/Home.module.css';
import HomeHero from '../components/HomeHero';
import HomeDecisionExplorer from '../components/HomeDecisionExplorer';

const categories=[
  {title:'Bredband',subtitle:'Pris, fart & adress',href:'/bredband/',image:'/design/card-bredband.webp'},
  {title:'El',subtitle:'Avtal & elpriser',href:'/elavtal/',image:'/design/card-el.webp'},
  {title:'Mobil',subtitle:'Surf & abonnemang',href:'/mobil/',image:'/design/card-mobil.webp'},
  {title:'Försäkring',subtitle:'Hem, djur & resa',href:'/forsakring/',image:'/design/card-forsakring.webp'},
  {title:'Lån & ekonomi',subtitle:'Ränta & totalkostnad',href:'/ekonomi/',image:'/design/card-ekonomi.webp'},
];

const guideGroups=[
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
    ['/elavtal/byta-elavtal/','Byta elavtal'],
    ['/forsakring/vad-kostar-hemforsakring/','Vad kostar hemförsäkring?'],
    ['/forsakring/hemforsakring-bostadsratt/','Hemförsäkring bostadsrätt – pris & skydd'],
    ['/forsakring/hemforsakring-hyresratt/','Hemförsäkring hyresrätt – pris & skydd'],
  ]},
  {title:'Ekonomi',links:[
    ['/ekonomi/','Jämför privatlån & samlingslån'],
    ['/guide/hushallets-fasta-kostnader-2026/','Hushållets fasta kostnader'],
    ['/guide/arskoll-fasta-kostnader/','Årskoll av fasta kostnader'],
    ['/verktyg/hushallskostnadskollen/','Hushållskostnadskollen'],
  ]},
];

const schema={
  '@context':'https://schema.org',
  '@graph':[
    {
      '@type':'Organization',
      '@id':'https://sankkostnaden.se/#organization',
      name:'Sänk Kostnaden',
      alternateName:'sankkostnaden.se',
      url:'https://sankkostnaden.se/',
      logo:'https://sankkostnaden.se/app-icon.svg',
      description:'Svensk guidesajt för att jämföra och sänka hushållets återkommande kostnader inom bredband, el, mobil, försäkring och privatekonomi.',
    },
    {
      '@type':'WebSite',
      '@id':'https://sankkostnaden.se/#website',
      name:'Sänk Kostnaden',
      alternateName:'sankkostnaden.se',
      url:'https://sankkostnaden.se/',
      inLanguage:'sv-SE',
      publisher:{'@id':'https://sankkostnaden.se/#organization'},
      description:'En samlad startpunkt för att sänka hushållets återkommande kostnader. Jämför el, bredband, mobil, försäkring och privatekonomi på samma ställe.',
    },
  ],
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
      <title>Sänk dina fasta kostnader 2026 | Jämför avtal – Sänk Kostnaden</title>
      <meta name='description' content='Sänk dina fasta kostnader. Jämför bredband, el, mobil, försäkring och lån med gratis guider och verktyg som hjälper dig hitta kostnader att se över.'/>
      <meta name='application-name' content='Sänk Kostnaden'/>
      <meta name='publisher' content='Sänk Kostnaden'/>
      <meta name='author' content='Sänk Kostnaden'/>
      <link rel='canonical' href='https://sankkostnaden.se/'/>
      <link rel='preconnect' href='https://images.pexels.com' crossOrigin=''/>
      <meta property='og:title' content='Sänk dina fasta kostnader – jämför avtal | Sänk Kostnaden'/>
      <meta property='og:description' content='Gratis guider och verktyg för att jämföra hushållets återkommande kostnader.'/>
      <meta property='og:type' content='website'/><meta property='og:url' content='https://sankkostnaden.se/'/>
      <meta name='robots' content='index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'/>
      <meta name='twitter:card' content='summary'/>
      <script type='application/ld+json' dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/>
    </Head>

    <header className={styles.nav}>
      <a className={styles.brand} href='/'><span className={styles.brandMark}><PiggyBank size={21}/></span><span>Sänk Kostnaden</span></a>
      <nav><a href='/bredband/'>Bredband</a><a href='/elavtal/'>El</a><a href='/mobil/'>Mobil</a><a href='/forsakring/'>Försäkring</a><a href='/ekonomi/'>Ekonomi</a></nav>
      <a className={styles.navCta} href='#jamfor'>Börja jämföra <ArrowRight size={15}/></a>
    </header>

    <main>
      <HomeHero/>

      <section className={`${styles.section} ${styles.popularSection}`} id='jamfor'>
        <div className={styles.popularHeader}>
          <div><p>POPULÄRA JÄMFÖRELSER</p><h2>Vad vill du spara på?</h2><span>Välj ett område och se dina alternativ. Du behöver inte jämföra allt på en gång.</span></div>
        </div>
        <div className={styles.popularGrid}>
          {categories.map(({title,subtitle,href,image})=><a className={styles.popularCard} href={href} key={title}>
            <div className={styles.popularPhoto}><img className={styles.popularImageExact} src={image} alt='' loading='lazy'/></div>
            <div className={styles.popularBody}><div><strong>{title}</strong><small>{subtitle}</small></div><ArrowRight size={17}/></div>
          </a>)}
        </div>
      </section>

      <section className={`${styles.section} ${styles.helpSection}`}>
        <div className={styles.sectionHead}>
          <div><p>FÖR DIG SOM VILL HA VÄGLEDNING</p><h2>Vad behöver du hjälp med?</h2></div>
          <p>Hitta rätt nivå, jämför två erbjudanden eller få hjälp att välja vilken kostnad du ska börja med.</p>
        </div>
        <HomeDecisionExplorer/>
      </section>

      <section className={`${styles.section} ${styles.toolsSection}`}>
        <div className={styles.sectionHead}>
          <div><p>GRATIS VERKTYG</p><h2>Vill du börja med hela hushållet?</h2></div>
          <p>Räkna på dina egna kostnader och se vilken post som är mest värd att ta först.</p>
        </div>
        <div className={styles.toolGrid}>
          <a href='/verktyg/hushallskostnadskollen/'><span>HUSHÅLLSKOLL</span><strong>Vad kostar ditt hushåll?</strong><p>Se månad, år och vilken jämförbar kostnad som är störst.</p><b>Räkna hushållets kostnader <ArrowRight size={16}/></b></a>
          <a href='/app/'><span>KOSTNADSKOLLEN</span><strong>Vilket avtal bör du se över först?</strong><p>Svara på några frågor och få en prioritering mellan el, bredband, mobil och försäkring.</p><b>Prioritera dina avtal <ArrowRight size={16}/></b></a>
          <a href='/guide/arskoll-fasta-kostnader/'><span>CHECKLISTA</span><strong>Årskoll av fasta kostnader</strong><p>Gå igenom hushållets återkommande avtal steg för steg.</p><b>Starta årskollen <ArrowRight size={16}/></b></a>
        </div>
      </section>

      <section className={styles.guideLibrarySection}>
        <details className={styles.guideLibrary}>
          <summary>Fler guider och jämförelser <ArrowRight size={16}/></summary>
          <div className={styles.guideGroups}>
            {guideGroups.map(group=><div key={group.title}><strong>{group.title}</strong>{group.links.map(([href,label])=><a href={href} key={href}>{label}<ArrowRight size={14}/></a>)}</div>)}
          </div>
        </details>
      </section>

      <section className={styles.section}>
        <div className={styles.principle}>
          <div><p>VÅR PRINCIP</p><h2>Besparing först.<br/>Enklare val sedan.</h2></div>
          <div><p>Sänk Kostnaden hjälper dig förstå vad du betalar, vad som går att påverka och vilka alternativ som kan passa dig. Du ska få nytta av sajten även om du bara använder våra guider och verktyg.</p><p>När en länk är kommersiell märks den tydligt. Alla aktörer på marknaden behöver inte finnas med.</p><a href='/sa-jamfor-vi/'>Läs hur vi jämför →</a></div>
        </div>
      </section>
    </main>

    <footer className={styles.footer}>
      <div><a className={styles.brand} href='/'><span className={styles.brandMark}><PiggyBank size={19}/></span><span>Sänk Kostnaden</span></a><p><strong>sankkostnaden.se</strong> – praktiska guider för lägre hushållskostnader.</p></div>
      <div><a href='/sa-jamfor-vi/'>Så jämför vi</a><a href='/affiliate/'>Affiliateinformation</a><a href='/cookies/'>Cookiepolicy</a><a href='/integritet/'>Integritet</a><a href='/om/'>Om oss</a><ProtectedEmailLink/></div>
      <p>© 2026 Sänk Kostnaden. Informationen är generell och utgör inte individuell finansiell rådgivning.</p>
    </footer>
  </>;
}
