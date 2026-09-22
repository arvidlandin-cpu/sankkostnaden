import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, Check, PiggyBank, Smartphone } from 'lucide-react';
import PartnerOffers from '../../components/PartnerOffers';

export default function RefurbishedMobil(){
  const canonical='https://sankkostnaden.se/mobil/refurbished-mobil/';
  return <>
    <Head>
      <title>Refurbished mobil 2026 – spara pengar på begagnad iPhone | Sänk Kostnaden</title>
      <meta name='description' content='Refurbished mobil kan sänka kostnaden jämfört med att köpa nytt. Jämför skick, batteri, garanti, lagring och totalpris innan du köper.'/>
      <link rel='canonical' href={canonical}/>
      <meta name='robots' content='index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'/>
      <meta property='og:type' content='article'/><meta property='og:locale' content='sv_SE'/>
      <meta property='og:title' content='Refurbished mobil 2026 – spara pengar på begagnad iPhone'/>
      <meta property='og:description' content='Så jämför du refurbished mobil på skick, batteri, garanti och totalpris.'/>
      <meta property='og:url' content={canonical}/>
      <script type='application/ld+json' dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@graph':[
        {'@type':'Article',url:canonical,headline:'Refurbished mobil 2026 – spara pengar på begagnad iPhone',description:'Så jämför du refurbished mobil på skick, batteri, garanti och totalpris.',author:{'@type':'Organization',name:'Sänk Kostnaden',url:'https://sankkostnaden.se/'},publisher:{'@type':'Organization',name:'Sänk Kostnaden',url:'https://sankkostnaden.se/'},inLanguage:'sv-SE'},
        {'@type':'BreadcrumbList',itemListElement:[
          {'@type':'ListItem',position:1,name:'Sänk Kostnaden',item:'https://sankkostnaden.se/'},
          {'@type':'ListItem',position:2,name:'Mobil',item:'https://sankkostnaden.se/mobil/'},
          {'@type':'ListItem',position:3,name:'Refurbished mobil',item:canonical},
        ]}
      ]})}}/>
    </Head>
    <header className='topbar'>
      <Link className='brand' href='/'><span className='brandMark'><PiggyBank size={22}/></span><span>Sänk Kostnaden</span></Link>
      <nav><Link href='/bredband/'>Bredband</Link><Link href='/elavtal/'>El</Link><Link href='/mobil/'>Mobil</Link><Link href='/forsakring/'>Försäkring</Link><Link href='/ekonomi/'>Ekonomi</Link></nav>
      <Link className='topbarCta' href='/#jamfor'>Börja jämföra →</Link>
    </header>
    <main>
      <section className='guideHero guideHero-mobil'>
        <div className='guideWrap'>
          <Link className='back' href='/mobil/'><ArrowLeft size={16}/> Mobil</Link>
          <div className='guideIcon'><Smartphone size={25}/></div>
          <p className='kicker'>MOBILTELEFON · REFURBISHED</p>
          <h1>Sänk mobilkostnaden genom att köpa refurbished</h1>
          <p className='lead'>En rekonditionerad mobil kan vara ett billigare alternativ till nytt – men jämför skick, batteri, garanti, lagring och totalpris innan du köper.</p>
        </div>
      </section>
      <article className='article guideWrap'>
        <div className='checkList'>
          {[
            'Jämför samma modell, lagring och kosmetiska skick',
            'Kontrollera batterihälsa eller batterigaranti',
            'Se hur lång garanti och returperiod som ingår',
            'Jämför totalpris mot nytt och andra refurbished-alternativ',
          ].map(x=><p key={x}><Check size={17}/>{x}</p>)}
        </div>

        <section><h2>När kan refurbished vara smart?</h2><p>Om du inte behöver den senaste modellen kan en refurbished telefon ge stor del av funktionaliteten till lägre inköpspris. Besparingen är mest relevant när prisskillnaden mot nytt är tydlig och garanti samt batterivillkor är tillräckligt bra.</p></section>
        <section><h2>Vad ska du kontrollera före köp?</h2><p>Jämför inte bara modellnamnet. Titta på lagringsstorlek, kosmetiskt skick, batteri, garanti, returvillkor och om laddare eller andra tillbehör ingår. Då blir totalpriset mer jämförbart.</p></section>
        <section><h2>Abonnemang och telefon är två olika kostnader</h2><p>Ett billigt abonnemang kan kombineras med en dyr telefon och tvärtom. Se därför telefonköpet som en separat kostnad och jämför mobilabonnemanget utifrån surf, nät och bindningstid.</p></section>

        <PartnerOffers category='mobil' intent='refurbished' heading='Aktuella refurbished-alternativ'/>

        <div className='relatedGuides'>
          <h2>Läs vidare</h2>
          <Link href='/mobil/'>Jämför mobilabonnemang →</Link>
          <Link href='/mobil/billigaste-mobilabonnemanget/'>Billigaste mobilabonnemanget →</Link>
          <Link href='/mobil/hur-mycket-surf-behover-jag/'>Hur mycket surf behöver jag? →</Link>
        </div>
        <p className='disclosure'>Kommersiella länkar markeras tydligt. Urvalet omfattar inte hela marknaden.</p>
      </article>
    </main>
  </>;
}
