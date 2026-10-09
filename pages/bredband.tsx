import Head from 'next/head';
import premium from '../styles/CategoryPremium.module.css';
import Link from 'next/link';
import { ArrowRight, Check, PiggyBank, ShieldCheck, Wifi } from 'lucide-react';
import BroadbandMarketGateway from '../components/BroadbandMarketGateway';
import { getActivePartners } from '../lib/partners';
import { emitAnalyticsEvent } from '../lib/clientAttribution';

const guides=[
 {href:'/bredband/bredband-pa-min-adress/',title:'Bredband på min adress',text:'Varför utbud och priser skiljer sig mellan adresser.'},
 {href:'/bredband/billigaste-bredbandet/',title:'Vad avgör billigaste bredbandet?',text:'Kampanj, ordinarie pris och avgifter över ett år.'},
 {href:'/bredband/utan-bindningstid/',title:'Bredband utan bindningstid',text:'Räkna på flexibilitet och uppsägningstid.'},
 {href:'/bredband/100-100/',title:'Räcker 100/100 Mbit/s?',text:'Rätt hastighet för de flesta vardagsbehov.'},
];

export default function Bredband(){
 const addressComparison=getActivePartners('bredband','compare',20).find(partner=>partner.name==='Bredbandsval.se');
 const title='Jämför bredband 2026 – pris & hastighet';
 const description='Jämför bredband 2026 efter pris, hastighet och bindningstid. Se vilken fart du behöver och kontrollera vad som finns på din adress.';
 const canonical='https://sankkostnaden.se/bredband/';
 return <>
  <Head>
   <title>{title} | Sänk Kostnaden</title>
   <meta name='description' content={description}/>
   <meta name='robots' content='index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'/>
   <meta property='og:type' content='website'/><meta property='og:locale' content='sv_SE'/>
   <meta property='og:title' content={title}/><meta property='og:description' content={description}/><meta property='og:url' content={canonical}/>
   <link rel='canonical' href={canonical}/>
   <script type='application/ld+json' dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@graph':[{'@type':'WebPage',name:title,description,url:canonical,isPartOf:{'@type':'WebSite',name:'Sänk Kostnaden',url:'https://sankkostnaden.se/'}},{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Sänk Kostnaden',item:'https://sankkostnaden.se/'},{'@type':'ListItem',position:2,name:'Bredband',item:canonical}]}]})}}/>
  </Head>
  <header className={`topbar ${premium.topbar}`}>
   <Link className='brand' href='/'><span className='brandMark'><PiggyBank size={22}/></span><span>Sänk Kostnaden</span></Link>
   <nav><Link href='/bredband/'>Bredband</Link><Link href='/elavtal/'>El</Link><Link href='/mobil/'>Mobil</Link><Link href='/forsakring/'>Försäkring</Link><Link href='/ekonomi/'>Ekonomi</Link></nav>
   <a className='topbarCta' href='#category-partners'>Jämför bredband →</a>
  </header>
  <main className={premium.main}>
   <section className={`guideHero categoryHero guideHero-bredband ${premium.hero}`}>
    <div className={premium.heroArtwork} aria-hidden='true'/>
    <div className={`guideWrap ${premium.heroInner}`}>
     <nav className='breadcrumbs' aria-label='Brödsmulor'><Link href='/'>Start</Link><span>›</span><span aria-current='page'>Bredband</span></nav>
     <div className='categoryHeroIcon'><Wifi size={25}/></div>
     <p className='kicker'>BREDBAND · ENKLARE VAL</p>
     <h1>Hitta bredband som passar ditt hem – inte bara ett lockpris.</h1>
     <p className='lead'>Börja med att kontrollera vilka operatörer som finns på din adress. Välj sedan en lämplig hastighet och jämför hela kostnaden, även efter kampanjen.</p>
     <div className='categoryHeroActions'>
      {addressComparison?<a className='primary' href={addressComparison.trackingUrl} data-partner={addressComparison.name} data-category='bredband' data-intent='compare' data-placement='broadband_hero_comparison' data-partner-position='1' onClick={()=>emitAnalyticsEvent('broadband_hub_path',{source:'broadband_hero',path:'address_compare'})} target='_blank' rel='sponsored nofollow noopener'>Kontrollera utbud på min adress <ArrowRight size={17}/></a>:<a className='primary' href='#category-partners'>Se våra bredbandsalternativ <ArrowRight size={17}/></a>}
      <Link className='secondaryLight' href='/bredband/vilken-hastighet-behover-jag/'>Hjälp mig välja hastighet <ArrowRight size={17}/></Link>
     </div>
     <p className='fine'><ShieldCheck size={13}/> {addressComparison?'Partnerlänk · kontroll och adressuppgifter hos Bredbandsval · vi får eventuell provision':'Gratis vägledning · adresser och priser kontrolleras hos operatören'}</p>
    </div>
   </section>
   <article className={`article guideWrap categoryArticle ${premium.article}`}>
    <div id='category-partners' style={{scrollMarginTop:90}}><BroadbandMarketGateway/></div>
    <section className={`categoryIntro ${premium.intro}`}>
     <p className='kicker'>JÄMFÖR PÅ LIKA VILLKOR</p>
     <h2>Så undviker du att lockpriset styr valet</h2>
     <p>Kontrollera först att anslutningen verkligen finns på adressen. Jämför sedan samma hastighet och en rimlig kostnad över minst första året.</p>
     <div className='checkList compactChecks'>
      {['Utbud på din adress – fiber, koax eller mobil uppkoppling','Samma hastighet och villkor i båda alternativen','Kampanjens längd, ordinarie pris och startavgifter','Bindnings- och uppsägningstid samt eventuell utrustning'].map(item=><p key={item}><Check size={17}/>{item}</p>)}
     </div>
    </section>
    <section className={`categoryGuideSection ${premium.guides}`}>
     <div className='categoryGuideHead'><div><p className='kicker'>HJÄLP & GUIDER</p><h2>Vill du förstå mer innan du väljer?</h2></div><p>Från hastighet och teknik till verklig årskostnad, utan att du behöver jämföra allt samtidigt.</p></div>
     <div className='categoryGuideGrid'>
      {guides.map(item=><Link href={item.href} key={item.href}><strong>{item.title}</strong><span>{item.text}</span><b>Läs guiden <ArrowRight size={15}/></b></Link>)}
     </div>
     <details className='categoryMore'><summary>Fler bredbandsguider <ArrowRight size={15}/></summary><div>
      {[
       ['/bredband/250-250/','Bredband 250/250'],
       ['/bredband/500-500/','Bredband 500/500'],
       ['/bredband/1000-1000/','Bredband 1000/1000'],
       ['/bredband/5g-bredband/','5G-bredband'],
      ].map(([href,label])=><Link href={href} key={href}><span><strong>{label}</strong></span><ArrowRight size={14}/></Link>)}
     </div></details>
    </section>
   </article>
  </main>
 </>;
}
