import Head from 'next/head';
import Link from 'next/link';
import { ArrowRight, Check, PiggyBank, ShieldCheck } from 'lucide-react';
import InsuranceMarketGateway from '../components/InsuranceMarketGateway';

const guides=[
 {href:'/forsakring/jamfor-hemforsakring/',title:'Jämför hemförsäkring',text:'Jämför samma omfattning, självrisk och ersättningsgränser.'},
 {href:'/forsakring/djurforsakring/',title:'Jämför djurförsäkring',text:'Förstå veterinärvård, fasta och rörliga självrisker.'},
 {href:'/forsakring/hemforsakring-bostadsratt/',title:'Hemförsäkring för bostadsrätt',text:'Kontrollera om föreningen har kollektivt bostadsrättstillägg.'},
 {href:'/forsakring/reseforsakring/',title:'Behöver jag extra reseskydd?',text:'Börja med skyddet du redan har innan du betalar för mer.'}
];

export default function Forsakring(){
 const title='Försäkringsguider 2026 – hem, djur & jämförelse';
 const description='Jämför hemförsäkring och djurförsäkring efter premie, självrisk, omfattning och villkor.';
 const canonical='https://sankkostnaden.se/forsakring/';
 return <>
   <Head>
     <title>{title} | Sänk Kostnaden</title>
     <meta name='description' content={description}/>
     <meta name='robots' content='index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'/>
     <meta property='og:type' content='website'/><meta property='og:locale' content='sv_SE'/>
     <meta property='og:title' content={title}/><meta property='og:description' content={description}/><meta property='og:url' content={canonical}/>
     <link rel='canonical' href={canonical}/>
     <script type='application/ld+json' dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@graph':[{'@type':'WebPage',name:title,description,url:canonical,isPartOf:{'@type':'WebSite',name:'Sänk Kostnaden',url:'https://sankkostnaden.se/'}},{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Sänk Kostnaden',item:'https://sankkostnaden.se/'},{'@type':'ListItem',position:2,name:'Försäkring',item:canonical}]}]})}}/>
   </Head>
   <header className='topbar'>
     <Link className='brand' href='/'><span className='brandMark'><PiggyBank size={22}/></span><span>Sänk Kostnaden</span></Link>
     <nav><Link href='/bredband/'>Bredband</Link><Link href='/elavtal/'>El</Link><Link href='/mobil/'>Mobil</Link><Link href='/forsakring/'>Försäkring</Link><Link href='/ekonomi/'>Ekonomi</Link></nav>
     <a className='topbarCta' href='#category-partners'>Se försäkringsalternativ →</a>
   </header>
   <main>
     <section className='guideHero categoryHero guideHero-forsakring'>
       <div className='guideWrap'>
         <nav className='breadcrumbs' aria-label='Brödsmulor'><Link href='/'>Start</Link><span>›</span><span aria-current='page'>Försäkring</span></nav>
         <div className='categoryHeroIcon'><ShieldCheck size={25}/></div>
         <p className='kicker'>FÖRSÄKRING · RÄTT SKYDD FÖRST</p>
         <h1>Välj rätt försäkringsskydd innan du jämför priset.</h1>
         <p className='lead'>Hem, djur, resa och ersättningsärenden är olika behov. Vi hjälper dig hitta rätt väg och synliggör våra relevanta partners utan att låtsas ha dina personliga premier.</p>
         <div className='categoryHeroActions'>
           <a className='primary' href='#category-partners'>Se försäkringsalternativen <ArrowRight size={17}/></a>
           <Link className='secondaryLight' href='/forsakring/hemforsakring-skyddskoll/'>Kontrollera ditt hemskydd <ArrowRight size={17}/></Link>
         </div>
         <p className='fine'>Gratis vägledning · aktuella premier och villkor hos försäkringsbolagen · tydligt märkta partnerlänkar</p>
       </div>
     </section>
     <article className='article guideWrap categoryArticle'>
       <div id='category-partners' style={{scrollMarginTop:90}}><InsuranceMarketGateway/></div>
       <section className='categoryIntro'>
         <p className='kicker'>SAMMA SKYDD · SAMMA JÄMFÖRELSEGRUND</p>
         <h2>Billigare premie säger inte allt</h2>
         <p>En försäkring med lägre premie kan ha högre självrisk, mindre ersättning eller fler undantag. Kontrollera vad som faktiskt ingår innan du bestämmer dig.</p>
         <div className='checkList compactChecks'>
           {['Årspremie inklusive rabatter och villkor efter kampanjen','Självrisk samt särskilda självrisker vid olika skador','Omfattning, ersättningstak, undantag och åldersavdrag','Befintligt skydd via förening, hemförsäkring eller betalkort'].map(item=><p key={item}><Check size={17}/>{item}</p>)}
         </div>
       </section>
       <section className='categoryGuideSection'>
         <div className='categoryGuideHead'><div><p className='kicker'>MER KONSUMENTHJÄLP</p><h2>Vilken försäkringsfråga vill du lösa?</h2></div><p>Välj en guide för ditt behov. Inget köp krävs för att använda verktygen.</p></div>
         <div className='categoryGuideGrid'>
           {guides.map(item=><Link href={item.href} key={item.href}><strong>{item.title}</strong><span>{item.text}</span><b>Läs guiden <ArrowRight size={15}/></b></Link>)}
         </div>
         <details className='categoryMore'><summary>Fler försäkringsguider <ArrowRight size={15}/></summary><div>
           {[
             ['/forsakring/hemforsakring-hyresratt/','Hemförsäkring för hyresrätt'],
             ['/forsakring/vad-kostar-hemforsakring/','Vad kostar hemförsäkring?'],
             ['/forsakring/forsakringsersattning/','Hur söker man försäkringsersättning?'],
             ['/forsakring/trygghetsforsakring/','Vad är trygghetsförsäkring?']
           ].map(([href,label])=><Link href={href} key={href}><span><strong>{label}</strong></span><ArrowRight size={14}/></Link>)}
         </div></details>
       </section>
     </article>
   </main>
 </>;
}
