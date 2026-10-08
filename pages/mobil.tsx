import Head from 'next/head';
import Link from 'next/link';
import { ArrowRight, Check, PiggyBank, ShieldCheck, Smartphone } from 'lucide-react';
import MobileMarketGateway from '../components/MobileMarketGateway';

const guides=[
  {href:'/mobil/billigaste-mobilabonnemanget/',title:'Vad gör ett mobilabonnemang billigast?',text:'Se vad som påverkar förstaårskostnaden och välj rätt jämförelsegrund.'},
  {href:'/mobil/familjeabonnemang/',title:'Välj familjeabonnemang',text:'Läs om separata avtal, familjepriser och hur surf fördelas.'},
  {href:'/mobil/utan-bindningstid/',title:'Mobil utan bindningstid',text:'Se vad flexibilitet innebär för pris och uppsägning.'},
  {href:'/mobil/refurbished-mobil/',title:'Spara även på telefonen',text:'Kontrollera batteri, skick och garanti innan du köper begagnat eller renoverat.'}
];

export default function Mobil(){
 const title='Jämför mobilabonnemang 2026 – pris & surf';
 const description='Jämför mobilabonnemang 2026 efter pris, surf, nät och bindningstid. Räkna på verklig årskostnad för en person eller familj.';
 const canonical='https://sankkostnaden.se/mobil/';
 return <>
  <Head>
   <title>{title} | Sänk Kostnaden</title>
   <meta name='description' content={description}/>
   <meta name='robots' content='index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'/>
   <meta property='og:type' content='website'/><meta property='og:locale' content='sv_SE'/>
   <meta property='og:title' content={title}/><meta property='og:description' content={description}/><meta property='og:url' content={canonical}/>
   <link rel='canonical' href={canonical}/>
   <script type='application/ld+json' dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@graph':[{'@type':'WebPage',name:title,description,url:canonical,isPartOf:{'@type':'WebSite',name:'Sänk Kostnaden',url:'https://sankkostnaden.se/'}},{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Sänk Kostnaden',item:'https://sankkostnaden.se/'},{'@type':'ListItem',position:2,name:'Mobil',item:canonical}]}]})}}/>
  </Head>
  <header className='topbar'>
   <Link className='brand' href='/'><span className='brandMark'><PiggyBank size={22}/></span><span>Sänk Kostnaden</span></Link>
   <nav><Link href='/bredband/'>Bredband</Link><Link href='/elavtal/'>El</Link><Link href='/mobil/'>Mobil</Link><Link href='/forsakring/'>Försäkring</Link><Link href='/ekonomi/'>Ekonomi</Link></nav>
   <a className='topbarCta' href='#category-partners'>Se mobilalternativ →</a>
  </header>
  <main>
   <section className='guideHero categoryHero guideHero-mobil'>
    <div className='guideWrap'>
     <nav className='breadcrumbs' aria-label='Brödsmulor'><Link href='/'>Start</Link><span>›</span><span aria-current='page'>Mobil</span></nav>
     <div className='categoryHeroIcon'><Smartphone size={25}/></div>
     <p className='kicker'>MOBIL · FÖRSTÅ VAD DU BETALAR FÖR</p>
     <h1>Jämför mobilabonnemang utan att betala för surf du inte behöver.</h1>
     <p className='lead'>Börja med dina surfvanor eller familjens totalkostnad. Se sedan alla våra mobiloperatörer och kontrollera aktuella erbjudanden hos dem.</p>
     <div className='categoryHeroActions'>
      <a className='primary' href='#category-partners'>Se mobilalternativ <ArrowRight size={17}/></a>
      <Link className='secondaryLight' href='/mobil/hur-mycket-surf-behover-jag/'>Hjälp mig välja surf <ArrowRight size={17}/></Link>
     </div>
     <p className='fine'><ShieldCheck size={13}/> Gratis vägledning · tydliga partnerlänkar · ingen påhittad prisranking</p>
    </div>
   </section>
   <article className='article guideWrap categoryArticle'>
    <div id='category-partners' style={{scrollMarginTop:90}}><MobileMarketGateway/></div>
    <section className='categoryIntro'>
     <p className='kicker'>SAMMA BEHOV · SAMMA JÄMFÖRELSEGRUND</p>
     <h2>Se hela kostnaden, inte bara introduktionspriset</h2>
     <p>Rätt mobilabonnemang börjar med surfbehov och fungerande täckning. Jämför sedan samma villkor över tolv månader innan du väljer.</p>
     <div className='checkList compactChecks'>
      {['Mängden surf du faktiskt använder varje månad','Täckning där du oftast använder mobilen','Kampanjperiod, ordinarie pris och eventuella avgifter','Bindningstid, roaming och andra begränsningar'].map(item=><p key={item}><Check size={17}/>{item}</p>)}
     </div>
    </section>
    <section className='categoryGuideSection'>
     <div className='categoryGuideHead'><div><p className='kicker'>GUIDER OCH VERKTYG</p><h2>Hitta svaret på din mobilfråga</h2></div><p>Alla guider kan användas utan inloggning eller krav på att klicka vidare till en partner.</p></div>
     <div className='categoryGuideGrid'>
      {guides.map(item=><Link href={item.href} key={item.href}><strong>{item.title}</strong><span>{item.text}</span><b>Läs guiden <ArrowRight size={15}/></b></Link>)}
     </div>
     <details className='categoryMore'><summary>Fler mobilguider <ArrowRight size={15}/></summary><div>
      {[
       ['/mobil/fri-surf/','När är fri surf värt priset?'],
       ['/mobil/5g-abonnemang/','Vad innebär 5G-abonnemang?'],
       ['/mobil/mobilabonnemang-55-plus/','Mobilabonnemang 55+'],
       ['/mobil/lonar-sig-familjeabonnemang/','Kalkylator: lönar sig familjeabonnemang?']
      ].map(([href,label])=><Link href={href} key={href}><span><strong>{label}</strong></span><ArrowRight size={14}/></Link>)}
     </div></details>
    </section>
   </article>
  </main>
 </>;
}
