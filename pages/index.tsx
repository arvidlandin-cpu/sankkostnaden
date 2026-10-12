import Head from 'next/head';
import { useEffect, useState } from 'react';
import { ArrowRight, PiggyBank, Wifi, Zap, Smartphone, ShieldCheck, WalletCards } from 'lucide-react';
import styles from '../styles/Home.module.css';
import HomeHero from '../components/HomeHero';

/* Licensed Pexels originals in responsive 700/1200/1800px variants. 
   No pre-rendered text or logos in imagery; the overlay icons are vector UI. */
const categories=[
  {title:'Bredband',subtitle:'Pris, fart & adress',href:'/bredband/',icon:Wifi,image:'https://images.pexels.com/photos/8055076/pexels-photo-8055076.jpeg?auto=compress&cs=tinysrgb&fit=crop'},
  {title:'El',subtitle:'Avtal & elpriser',href:'/elavtal/',icon:Zap,image:'https://images.pexels.com/photos/8055828/pexels-photo-8055828.jpeg?auto=compress&cs=tinysrgb&fit=crop'},
  {title:'Mobil',subtitle:'Surf & abonnemang',href:'/mobil/',icon:Smartphone,image:'https://images.pexels.com/photos/8067709/pexels-photo-8067709.jpeg?auto=compress&cs=tinysrgb&fit=crop'},
  {title:'Försäkring',subtitle:'Hem, djur & resa',href:'/forsakring/',icon:ShieldCheck,image:'https://images.pexels.com/photos/28949489/pexels-photo-28949489.jpeg?auto=compress&cs=tinysrgb&fit=crop'},
  {title:'Lån & ekonomi',subtitle:'Ränta & totalkostnad',href:'/ekonomi/',icon:WalletCards,image:'https://images.pexels.com/photos/16098002/pexels-photo-16098002.jpeg?auto=compress&cs=tinysrgb&fit=crop'},
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
          <div><p>VÄLJ OMRÅDE</p><h2>Dina kostnader. Ditt liv. Dina val.</h2><span>Det är här du börjar. Välj det som spelar störst roll i din vardag.</span></div>
        </div>
        <div className={styles.popularGrid}>
          {categories.map(({title,subtitle,href,image,icon:Icon},index)=><a className={styles.popularCard} href={href} key={title}>
            <div className={styles.popularPhoto}>
              <img className={styles.popularImageExact}
                src={image+'&w=1200'}
                srcSet={image+'&w=700 700w, '+image+'&w=1200 1200w, '+image+'&w=1800 1800w'}
                sizes={index===4?'(max-width:760px) 95vw, (max-width:1100px) 32vw, 33vw':index<2?'(max-width:760px) 50vw, (max-width:1100px) 48vw, 50vw':'(max-width:760px) 50vw, (max-width:1100px) 32vw, 33vw'}
                alt='' loading='lazy' decoding='async'/>
              <span className={styles.popularBadge} aria-hidden='true'><Icon size={27} strokeWidth={2.1}/></span>
            </div>
            <div className={styles.popularBody}><div><strong>{title}</strong><small>{subtitle}</small></div><ArrowRight size={17}/></div>
          </a>)}
        </div>
      </section>

      <section className={`${styles.section} ${styles.toolsSection}`}>
        <details className={styles.progressiveTools} data-testid='home-household-tools'>
          <summary><span><small>FÖR DIG SOM VILL FÖRDJUPA DIG</small><strong>Vill du få koll på hela hushållet?</strong><em>Öppna våra kostnadsverktyg och checklistor.</em></span><ArrowRight size={20} aria-hidden='true'/></summary>
          <div className={styles.toolGrid}>
            <a href='/verktyg/hushallskostnadskollen/'><span>HUSHÅLLSKOLL</span><strong>Vad kostar ditt hushåll?</strong><p>Fyll i de kostnader du känner till och se summan per månad och år.</p><b>Räkna hushållets kostnader <ArrowRight size={16}/></b></a>
            <a href='/app/'><span>KOSTNADSKOLLEN</span><strong>Var ska jag börja?</strong><p>Få hjälp att välja vilken kostnad du vill undersöka först.</p><b>Starta Kostnadskollen <ArrowRight size={16}/></b></a>
            <a href='/guide/arskoll-fasta-kostnader/'><span>CHECKLISTA</span><strong>Årskoll av fasta kostnader</strong><p>Gå igenom återkommande avtal i din egen takt.</p><b>Se årskollen <ArrowRight size={16}/></b></a>
          </div>
        </details>
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
          <div><div className={styles.principleImage} aria-hidden='true'><img src='https://images.pexels.com/photos/4473625/pexels-photo-4473625.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600' alt='' loading='lazy'/></div><p>VARFÖR VI FINNS</p><h2>Besparing först.<br/>Enklare val sedan.</h2></div>
          <div><p>Vi vill att du ska ha mer kvar till det som gör vardagen bra. Vi hjälper dig förstå dina återkommande kostnader och hitta jämförelser som faktiskt passar ditt hem – utan att du behöver bli expert.</p><p>Guiderna är gratis. När vi länkar till en partner märker vi det tydligt. Vi jämför inte hela marknaden och lovar inga besparingar.</p><a href='/sa-jamfor-vi/'>Läs hur vi jämför →</a></div>
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
