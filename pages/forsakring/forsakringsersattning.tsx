import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, Check, PiggyBank, ShieldCheck } from 'lucide-react';
import PartnerOffers from '../../components/PartnerOffers';

export default function Forsakringsersattning(){
  const canonical='https://sankkostnaden.se/forsakring/forsakringsersattning/';
  return <>
    <Head>
      <title>Försäkringsersättning 2026 – har du pengar att hämta? | Sänk Kostnaden</title>
      <meta name='description' content='Har du missat försäkringsersättning efter en skada eller olycka? Se vad du bör kontrollera i dina försäkringar och hur en ersättningstjänst kan hjälpa.'/>
      <link rel='canonical' href={canonical}/>
      <meta name='robots' content='index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'/>
      <meta property='og:type' content='article'/><meta property='og:locale' content='sv_SE'/>
      <meta property='og:title' content='Försäkringsersättning 2026 – har du pengar att hämta?'/>
      <meta property='og:description' content='Kontrollera om en skada eller olycka kan ge ersättning från en eller flera försäkringar.'/>
      <meta property='og:url' content={canonical}/>
      <script type='application/ld+json' dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@graph':[
        {'@type':'Article',url:canonical,headline:'Försäkringsersättning 2026 – har du pengar att hämta?',description:'Kontrollera om en skada eller olycka kan ge ersättning från en eller flera försäkringar.',author:{'@type':'Organization',name:'Sänk Kostnaden',url:'https://sankkostnaden.se/'},publisher:{'@type':'Organization',name:'Sänk Kostnaden',url:'https://sankkostnaden.se/'},inLanguage:'sv-SE'},
        {'@type':'BreadcrumbList',itemListElement:[
          {'@type':'ListItem',position:1,name:'Sänk Kostnaden',item:'https://sankkostnaden.se/'},
          {'@type':'ListItem',position:2,name:'Försäkring',item:'https://sankkostnaden.se/forsakring/'},
          {'@type':'ListItem',position:3,name:'Försäkringsersättning',item:canonical}
        ]}
      ]})}}/>
    </Head>
    <header className='topbar'>
      <Link className='brand' href='/'><span className='brandMark'><PiggyBank size={22}/></span><span>Sänk Kostnaden</span></Link>
      <nav><Link href='/bredband/'>Bredband</Link><Link href='/elavtal/'>El</Link><Link href='/mobil/'>Mobil</Link><Link href='/forsakring/'>Försäkring</Link><Link href='/ekonomi/'>Ekonomi</Link></nav>
      <Link className='topbarCta' href='#ersattningsalternativ'>Gå till alternativ →</Link>
    </header>
    <main>
      <section className='guideHero guideHero-forsakring'>
        <div className='guideWrap'>
          <Link className='back' href='/forsakring/'><ArrowLeft size={16}/> Försäkring</Link>
          <div className='guideIcon'><ShieldCheck size={25}/></div>
          <p className='kicker'>FÖRSÄKRINGSERSÄTTNING</p>
          <h1>Har du pengar att hämta från en försäkring?</h1>
          <p className='lead'>Efter en skada eller olycka kan ersättning ibland finnas i fler än en försäkring. Börja med att kontrollera vad du redan har innan du ger någon fullmakt eller accepterar en avgiftsmodell.</p>
        </div>
      </section>
      <article className='article guideWrap'>
        <div className='checkList'>
          {[
            'Samla försäkringar som gällde när händelsen inträffade',
            'Kontrollera olycksfalls-, hem-, rese- och eventuella gruppförsäkringar',
            'Läs villkor om ersättning, tidsfrister och undantag',
            'Kontrollera avgift eller provision innan du anlitar hjälp',
          ].map(x=><p key={x}><Check size={17}/>{x}</p>)}
        </div>

        <section><h2>Börja med dina egna försäkringar</h2><p>Du kan ha skydd via privata försäkringar, arbetsgivare, fack, bankkort eller andra gruppavtal. Kontrollera därför vilka försäkringar som gällde vid händelsen och om samma skada kan omfattas av flera skydd.</p></section>
        <section><h2>När kan en ersättningstjänst vara relevant?</h2><p>Om du är osäker på vilka ersättningar som kan vara aktuella eller inte vill driva ärendet själv kan en extern tjänst hjälpa till att identifiera och hantera möjliga krav. Läs alltid hur tjänsten tar betalt och vilka fullmakter du lämnar.</p></section>
        <section><h2>Jämför hjälp mot att göra det själv</h2><p>En tjänst kan spara tid, men en procentuell avgift minskar ersättningen du själv behåller. Väg därför tidsbesparingen och hjälpen mot kostnaden innan du går vidare.</p></section>

        <div id='ersattningsalternativ'><PartnerOffers category='forsakring' intent='claims' heading='Hjälp med försäkringsersättning'/></div>

        <div className='relatedGuides'>
          <h2>Läs vidare</h2>
          <Link href='/forsakring/'>Försäkringsöversikt →</Link>
          <Link href='/forsakring/jamfor-hemforsakring/'>Jämför hemförsäkring →</Link>
          <Link href='/forsakring/hemforsakring-skyddskoll/'>Skyddskoll för hemförsäkring →</Link>
        </div>
        <p className='disclosure'>Informationen är generell. Kontrollera alltid aktuella villkor, avgifter och fullmakter innan du anlitar en tjänst. Kommersiella länkar markeras tydligt.</p>
      </article>
    </main>
  </>;
}