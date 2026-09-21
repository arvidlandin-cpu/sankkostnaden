import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, PiggyBank } from 'lucide-react';
import PartnerDirectory from './PartnerDirectory';
import type { PartnerCategory, PartnerIntent } from '../lib/partners';

type Guide={href:string;title:string;text:string};
type Props={
  category:PartnerCategory;
  canonical:string;
  title:string;
  description:string;
  kicker:string;
  heading:string;
  lead:string;
  icon:any;
  compareHref:string;
  compareLabel:string;
  helpHref:string;
  helpLabel:string;
  partnerIntent?:PartnerIntent;
  partnerHeading:string;
  checks:string[];
  guides:Guide[];
  moreGuides?:Guide[];
  introTitle:string;
  introText:string;
  showPartners?:boolean;
};

const labels:Record<PartnerCategory,string>={bredband:'Bredband',el:'El',mobil:'Mobil',forsakring:'Försäkring',ekonomi:'Ekonomi'};

export default function CategoryLanding({
  category,canonical,title,description,kicker,heading,lead,icon:Icon,
  compareHref,compareLabel,helpHref,helpLabel,partnerIntent,partnerHeading,
  checks,guides,moreGuides=[],introTitle,introText,showPartners=true,
}:Props){
  const schema={'@context':'https://schema.org','@graph':[
    {'@type':'WebPage',name:title,description,url:canonical,isPartOf:{'@type':'WebSite',name:'Sänk Kostnaden',url:'https://sankkostnaden.se/'}},
    {'@type':'BreadcrumbList',itemListElement:[
      {'@type':'ListItem',position:1,name:'Sänk Kostnaden',item:'https://sankkostnaden.se/'},
      {'@type':'ListItem',position:2,name:labels[category],item:canonical},
    ]},
  ]};

  return <>
    <Head>
      <title>{title} | Sänk Kostnaden</title>
      <meta name='description' content={description}/>
      <meta name='robots' content='index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'/>
      <meta property='og:type' content='website'/><meta property='og:locale' content='sv_SE'/>
      <meta property='og:title' content={title}/><meta property='og:description' content={description}/><meta property='og:url' content={canonical}/>
      <link rel='canonical' href={canonical}/>
      <script type='application/ld+json' dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/>
    </Head>

    <header className='topbar'>
      <Link className='brand' href='/'><span className='brandMark'><PiggyBank size={22}/></span><span>Sänk Kostnaden</span></Link>
      <nav><Link href='/bredband/'>Bredband</Link><Link href='/elavtal/'>El</Link><Link href='/mobil/'>Mobil</Link><Link href='/forsakring/'>Försäkring</Link><Link href='/ekonomi/'>Ekonomi</Link></nav>
      <Link className='topbarCta' href='/#jamfor'>Jämför priser →</Link>
    </header>

    <main>
      <section className={`guideHero categoryHero guideHero-${category}`}>
        <div className='guideWrap'>
          <Link className='back' href='/'><ArrowLeft size={16}/> Till startsidan</Link>
          <div className='categoryHeroIcon'><Icon size={25}/></div>
          <p className='kicker'>{kicker}</p>
          <h1>{heading}</h1>
          <p className='lead'>{lead}</p>
          <div className='categoryHeroActions'>
            <Link className='primary' href={compareHref}>{compareLabel} <ArrowRight size={17}/></Link>
            <Link className='secondaryLight' href={helpHref}>{helpLabel} <ArrowRight size={17}/></Link>
          </div>
          <p className='fine'>Inga kontaktuppgifter behövs för att börja.</p>
        </div>
      </section>

      <article className='article guideWrap categoryArticle'>
        <section className='categoryIntro'>
          <p className='kicker'>BÖRJA HÄR</p>
          <h2>{introTitle}</h2>
          <p>{introText}</p>
          <div className='checkList compactChecks'>{checks.map(item=><p key={item}><Check size={17}/>{item}</p>)}</div>
        </section>

        {showPartners&&<PartnerDirectory category={category} intent={partnerIntent} heading={partnerHeading}/>} 

        <section className='categoryGuideSection categoryGuideCompact'>
          <details className='categoryMore categoryMorePrimary'>
            <summary>Guider och fördjupning <ArrowRight size={15}/></summary>
            <div>
              {[...guides,...moreGuides].map(item=><Link href={item.href} key={item.href}><span><strong>{item.title}</strong><small>{item.text}</small></span><ArrowRight size={14}/></Link>)}
            </div>
          </details>
        </section>

        <p className='disclosure'>Kommersiella länkar markeras tydligt. Urvalet behöver inte omfatta hela marknaden.</p>
      </article>
    </main>
  </>;
}
