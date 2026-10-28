import Head from 'next/head';
import { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Home as HomeIcon, ShieldCheck } from 'lucide-react';
import styles from '../styles/CostMapExperience.module.css';
import { CostMapExperience } from '../components/CostMapExperience';

const guideGroups=[
  {title:'Bredband',links:[
    ['/bredband/billigaste-bredbandet/','Billigaste bredbandet 2026'],
    ['/bredband/utan-bindningstid/','Bredband utan bindningstid'],
    ['/bredband/fiber/','Fiber – vad behöver du jämföra?'],
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
    ['/elavtal/jamfor-elavtal/','Jämför elavtal – pris, påslag och villkor'],
    ['/forsakring/jamfor-hemforsakring/','Jämför hemförsäkring – pris och skydd'],
    ['/elavtal/byta-elavtal/','Byta elavtal'],
    ['/forsakring/vad-kostar-hemforsakring/','Vad kostar hemförsäkring?'],
    ['/forsakring/hemforsakring-bostadsratt/','Hemförsäkring bostadsrätt – pris & skydd'],
    ['/forsakring/hemforsakring-hyresratt/','Hemförsäkring hyresrätt – pris & skydd'],
  ]},
  {title:'Ekonomi',links:[
    ['/ekonomi/','Jämför privatlån & samlingslån'],
    ['/guide/hushallets-fasta-kostnader-2026/','Hushållets fasta kostnader'],
    ['/guide/arskoll-fasta-kostnader/','Årskoll av fasta kostnader'],
    ['/guide/sank-fasta-kostnader/','Sänk fasta kostnader steg för steg'],
    ['/guide/sank-kostnader-automatiskt/','Se över abonnemang och avtal'],
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
      <link rel='preload' as='image' href='/design/cost-map-home.webp' media='(min-width: 761px)'/>
      <meta property='og:title' content='Sänk dina fasta kostnader – jämför avtal | Sänk Kostnaden'/>
      <meta property='og:description' content='Gratis guider och verktyg för att jämföra hushållets återkommande kostnader.'/>
      <meta property='og:type' content='website'/><meta property='og:url' content='https://sankkostnaden.se/'/>
      <meta name='robots' content='index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'/>
      <meta name='twitter:card' content='summary'/>
      <script type='application/ld+json' dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/>
    </Head>

    <div className={styles.page}>
      <header className={styles.nav}>
        <a className={styles.brand} href='/' aria-label='Sänk Kostnaden – startsida'>
          <span className={styles.brandMark}><HomeIcon size={24} strokeWidth={2.4}/></span><span>Sänk Kostnaden</span>
        </a>
        <nav className={styles.navLinks} aria-label='Huvudmeny'>
          <a href='/elavtal/'>El</a><a href='/bredband/'>Bredband</a><a href='/mobil/'>Mobil</a><a href='/forsakring/'>Försäkring</a><a href='/ekonomi/'>Ekonomi</a>
        </nav>
        <a className={styles.navCta} href='#guider'>Guider & verktyg <ArrowRight size={16}/></a>
      </header>

      <main>
        <div id='jamfor'><div id='kostnadskartan'><CostMapExperience/></div></div>
        <section className={styles.contentSection} id='guider'>
          <div className={styles.sectionHeading}><div><p className={styles.kicker}>ETT KLOKARE NÄSTA STEG</p><h2>Lite mer koll.<br/>Ett enklare val.</h2></div><p>Förstå det som faktiskt påverkar ditt avtal. Våra guider hjälper dig att ställa rätt frågor.</p></div>
          <div className={styles.guideGrid}>
            {[
              {href:'/bredband/vilken-hastighet-behover-jag/',title:'Hur snabbt behöver ditt bredband vara?',text:'Utgå från hur ni använder nätet hemma. Mer hastighet är inte alltid det du behöver.',label:'Hitta rätt hastighet'},
              {href:'/elavtal/sa-laser-du-elfakturan/',title:'Vad betalar du för på elfakturan?',text:'Skilj elhandel från elnät. Få koll på påslag, fasta avgifter och vad du kan jämföra.',label:'Förstå elfakturan'},
              {href:'/forsakring/hemforsakring-skyddskoll/',title:'Vilket skydd behöver ditt hem?',text:'Börja med boendeformen och dina behov. Jämför skydd och självrisk tillsammans med priset.',label:'Prova skyddskollen'},
            ].map((guide,index)=><a className={styles.guideCard} key={guide.href} href={guide.href}><span className={styles.guideIndex}>0{index+1}</span><div className={styles.guideCardBody}><BookOpen size={24} aria-hidden='true'/><h3>{guide.title}</h3><p>{guide.text}</p><span className={styles.guideLink}>{guide.label} <ArrowRight size={17}/></span></div></a>)}
          </div>
        </section>

        <section className={styles.toolSection} aria-labelledby='household-title' data-testid='home-household-tools'>
          <div className={styles.toolCopy}><p className={styles.kicker}>HELA HUSHÅLLET, NÄR DU VILL</p><h2 id='household-title'>Börja där du är.<br/>Räkna på det du vet.</h2><p>Samla kända kostnader eller få hjälp att välja vad du vill undersöka först. Egna siffror är alltid frivilliga.</p><span><ShieldCheck size={17}/> Dina verktygssvar används inte som personliga offerter.</span></div>
          <div className={styles.toolActions}>
            <a className={styles.toolLink} href='/verktyg/hushallskostnadskollen/'><span><strong>Vad kostar ditt hushåll?</strong><small>Se summan av de kostnader du känner till.</small></span><ArrowRight size={21}/></a>
            <a className={styles.toolLink} href='/app/'><span><strong>Var ska jag börja?</strong><small>Ta ett steg i taget med Kostnadskollen.</small></span><ArrowRight size={21}/></a>
            <a className={styles.toolLink} href='/guide/arskoll-fasta-kostnader/'><span><strong>Ge avtalen en årskoll.</strong><small>En checklista att gå igenom i din egen takt.</small></span><ArrowRight size={21}/></a>
          </div>
        </section>

        <section className={styles.contentSection}>
          <details className={styles.library}><summary>Fler guider och jämförelser <ArrowRight size={19}/></summary><div className={styles.libraryGroups}>{guideGroups.map(group=><div key={group.title}><h3>{group.title}</h3>{group.links.map(([href,label])=><a href={href} key={href}>{label}<ArrowRight size={14}/></a>)}</div>)}</div></details>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerMain}><div className={styles.footerBrand}><a className={styles.brand} href='/'><span className={styles.brandMark}><HomeIcon size={22}/></span><span>Sänk Kostnaden</span></a><p>Praktisk vägledning för hushållets återkommande kostnader.</p><a href='/sa-jamfor-vi/'>Så fungerar våra jämförelser <ArrowRight size={15}/></a></div>
          <nav className={styles.footerLinks} aria-label='Om Sänk Kostnaden'><a href='/affiliate/'>Affiliateinformation</a><a href='/cookies/'>Cookiepolicy</a><a href='/integritet/'>Integritet</a><a href='/om/'>Om oss</a><ProtectedEmailLink/></nav></div>
        <p className={styles.footerLegal}>© 2026 Sänk Kostnaden. Informationen är generell och utgör inte individuell finansiell rådgivning. Vi kan få ersättning via annonslänkar och visar ett urval av partners, inte hela marknaden.</p>
      </footer>
    </div>
  </>;
}
