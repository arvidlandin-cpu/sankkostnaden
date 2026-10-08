import Head from 'next/head';
import Link from 'next/link';
import { ArrowRight, Check, PiggyBank, ShieldCheck, Zap } from 'lucide-react';
import ElectricityMarketGateway from '../components/ElectricityMarketGateway';

const guides=[
 {href:'/elavtal/billigaste-elavtalet/',title:'Vad avgör vilket elavtal som är billigast?',text:'Förstå pris per kWh, månadsavgift och rabatter.'},
 {href:'/elavtal/vilket-elavtal-passar-mig/',title:'Vilken avtalsform passar mig?',text:'Jämför fast, rörligt och kvartspris utifrån din vardag.'},
 {href:'/elavtal/sa-laser-du-elfakturan/',title:'Så läser du elfakturan',text:'Hitta uppgifter du faktiskt kan jämföra.'},
 {href:'/elavtal/byta-elavtal/',title:'Så byter du elavtal',text:'Kontrollera datum och villkor innan bytet.'},
];

export default function Elavtal(){
 const title='Jämför elavtal 2026 – pris, påslag & avtalsform';
 const description='Jämför elavtal 2026 efter pris, påslag, fasta avgifter, avtalsform och villkor. Se vad som passar ditt hushåll.';
 const canonical='https://sankkostnaden.se/elavtal/';
 return <>
  <Head>
   <title>{title} | Sänk Kostnaden</title>
   <meta name='description' content={description}/>
   <meta name='robots' content='index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'/>
   <meta property='og:type' content='website'/><meta property='og:locale' content='sv_SE'/>
   <meta property='og:title' content={title}/><meta property='og:description' content={description}/><meta property='og:url' content={canonical}/>
   <link rel='canonical' href={canonical}/>
   <script type='application/ld+json' dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@graph':[{'@type':'WebPage',name:title,description,url:canonical,isPartOf:{'@type':'WebSite',name:'Sänk Kostnaden',url:'https://sankkostnaden.se/'}},{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Sänk Kostnaden',item:'https://sankkostnaden.se/'},{'@type':'ListItem',position:2,name:'Elavtal',item:canonical}]}]})}}/>
  </Head>
  <header className='topbar'>
   <Link className='brand' href='/'><span className='brandMark'><PiggyBank size={22}/></span>Sänk Kostnaden</Link>
   <nav><Link href='/bredband/'>Bredband</Link><Link href='/elavtal/'>El</Link><Link href='/mobil/'>Mobil</Link><Link href='/forsakring/'>Försäkring</Link><Link href='/ekonomi/'>Ekonomi</Link></nav>
   <a className='topbarCta' href='#jamfor-elavtal'>Se elalternativen →</a>
  </header>
  <main>
   <section className='guideHero categoryHero guideHero-el'>
    <div className='guideWrap'>
     <nav className='breadcrumbs' aria-label='Brödsmulor'><Link href='/'>Start</Link><span>›</span><span aria-current='page'>Elavtal</span></nav>
     <div className='categoryHeroIcon'><Zap size={25}/></div>
     <p className='kicker'>ELAVTAL · ENKLARE BESLUT</p>
     <h1>Jämför elavtal utan att gissa vilket som är billigast.</h1>
     <p className='lead'>Välj om du vill jämföra flera bolag, se våra aktiva elhandlare direkt eller börja med att förstå hela årskostnaden. Inga kontaktuppgifter behövs här.</p>
     <div className='categoryHeroActions'>
      <a className='primary' href='#jamfor-elavtal'>Se aktiva elalternativ <ArrowRight size={17}/></a>
      <Link className='secondaryLight' href='/elavtal/vilket-elavtal-passar-mig/'>Hjälp mig välja avtalsform <ArrowRight size={17}/></Link>
     </div>
     <p className='fine'><ShieldCheck size={13}/> Gratis att använda · tydligt märkta partnerlänkar · ingen påstådd liveprisranking</p>
    </div>
   </section>
   <article className='article guideWrap categoryArticle'>
    <ElectricityMarketGateway/>
    <section className='categoryIntro'>
     <p className='kicker'>KONTROLLERA INNAN DU TECKNAR</p>
     <h2>Jämför på samma grund, oavsett elbolag</h2>
     <p>Nätavgiften går normalt inte att välja bort. Fokusera på elhandelsavtalets jämförbara kostnader och din egen årsförbrukning.</p>
     <div className='checkList compactChecks'>
      {['Samma årsförbrukning och samma prisgrund för alla erbjudanden','KWh-pris eller påslag tillsammans med fasta avgifter','Kampanjpris, rabattens längd och ordinarie villkor','Avtalsform, bindningstid och uppsägningstid'].map(item=><p key={item}><Check size={17}/>{item}</p>)}
     </div>
    </section>
    <section className='categoryGuideSection'>
     <div className='categoryGuideHead'><div><p className='kicker'>VERKTYG & GUIDER</p><h2>Vill du förstå mer innan du väljer?</h2></div><p>Välj den hjälp som motsvarar din fråga. Du behöver inte läsa alla guider för att jämföra.</p></div>
     <div className='categoryGuideGrid'>
      {guides.map(item=><Link href={item.href} key={item.href}><strong>{item.title}</strong><span>{item.text}</span><b>Läs guiden <ArrowRight size={15}/></b></Link>)}
     </div>
     <details className='categoryMore'><summary>Fler guider om elavtal <ArrowRight size={15}/></summary><div>
      {[
       ['/elavtal/kvartspris/','Vad är kvartspris?'],
       ['/elavtal/rorligt-elpris/','Rörligt elpris'],
       ['/elavtal/rorligt-fast-kvartspris/','Rörligt, fast eller kvartspris'],
       ['/elavtal/elavtal-utan-bindningstid/','Elavtal utan bindningstid'],
       ['/elavtal/hur-mycket-el-drar-mitt-hus/','Hur mycket el drar mitt hus?'],
      ].map(([href,label])=><Link href={href} key={href}><span><strong>{label}</strong></span><ArrowRight size={14}/></Link>)}
     </div></details>
    </section>
   </article>
  </main>
 </>;
}
