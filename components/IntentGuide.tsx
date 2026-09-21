import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, Check, PiggyBank } from 'lucide-react';
import PartnerOffers from './PartnerOffers';
import PartnerDirectory from './PartnerDirectory';
import DecisionGateway from './DecisionGateway';
import type { PartnerCategory, PartnerIntent } from '../lib/partners';

type Section = { heading: string; body: string };
type Props = {
  title: string;
  description: string;
  kicker: string;
  canonical: string;
  category: PartnerCategory;
  intent?: PartnerIntent;
  bullets: string[];
  sections: Section[];
  related: { href: string; label: string }[];
};

export default function IntentGuide({ title, description, kicker, canonical, category, intent, bullets, sections, related }: Props) {
  const categoryLabels: Record<PartnerCategory, string> = { el: 'Elavtal', bredband: 'Bredband', mobil: 'Mobil', forsakring: 'Försäkring', ekonomi: 'Lån & ekonomi' };
  const categoryPaths: Record<PartnerCategory, string> = { el: '/elavtal/', bredband: '/bredband/', mobil: '/mobil/', forsakring: '/forsakring/', ekonomi: '/ekonomi/' };
  const categoryLabel = categoryLabels[category];
  const compareHeadings: Record<PartnerCategory, string> = { el: 'Aktiva elalternativ att jämföra', bredband: 'Aktiva bredbandsalternativ att jämföra', mobil: 'Aktiva mobilalternativ att jämföra', forsakring: 'Aktiva försäkringsalternativ att jämföra', ekonomi: 'Tjänster för att jämföra privatlån' };
  const categoryPath = categoryPaths[category];
  const offerHeading = category === 'forsakring' ? (intent === 'pet' ? 'Jämför djurförsäkring hos våra partners' : intent === 'home' ? 'Se aktuella hemförsäkringsalternativ' : 'Se aktuella försäkringsalternativ') : category === 'bredband' ? (intent === 'mobile-broadband' ? 'Se aktuella alternativ för mobilt bredband' : intent === 'fiber' ? 'Se aktuella fiberalternativ' : intent === 'no-binding' ? 'Se bredband utan bindningstid' : 'Se aktuella bredbandsalternativ') : category === 'mobil' ? (intent === 'family' ? 'Se aktuella familjeabonnemang' : intent === 'no-binding' ? 'Se abonnemang utan bindningstid' : 'Se aktuella mobilabonnemang') : category === 'el' ? 'Se aktuella elavtal' : intent === 'saving' ? 'Verktyg för bättre ekonomisk överblick' : 'Tjänster för att jämföra privatlån';
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        url: canonical,
        headline: title,
        description,
        author: { '@type': 'Organization', name: 'Sänk Kostnaden', url: 'https://sankkostnaden.se/' },
        publisher: { '@type': 'Organization', name: 'Sänk Kostnaden', url: 'https://sankkostnaden.se/' },
        mainEntityOfPage: canonical,
        inLanguage: 'sv-SE',
        isPartOf: { '@type': 'WebSite', name: 'Sänk Kostnaden', url: 'https://sankkostnaden.se/' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Sänk Kostnaden', item: 'https://sankkostnaden.se/' },
          { '@type': 'ListItem', position: 2, name: categoryLabel, item: `https://sankkostnaden.se${categoryPath}` },
          { '@type': 'ListItem', position: 3, name: title, item: canonical },
        ],
      },
    ],
  };
  return (
    <>
      <Head>
        <title>{title} | Sänk Kostnaden</title>
        <meta name='description' content={description} />
        <meta name='robots' content='index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' />
        <meta name='author' content='Sänk Kostnaden' />
        <meta property='og:type' content='article' />
        <meta property='og:locale' content='sv_SE' />
        <meta property='og:title' content={title} />
        <meta property='og:description' content={description} />
        <meta property='og:url' content={canonical} />
        <meta name='twitter:card' content='summary' />
        <link rel='canonical' href={canonical} />
        <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>
      <header className='topbar'>
        <Link className='brand' href='/'><span className='brandMark'><PiggyBank size={20} /></span><span>Sänk Kostnaden</span></Link>
        <nav><Link href='/bredband/'>Bredband</Link><Link href='/elavtal/'>El</Link><Link href='/mobil/'>Mobil</Link><Link href='/forsakring/'>Försäkring</Link><Link href='/ekonomi/'>Ekonomi</Link></nav>
        <Link className='topbarCta' href='/#jamfor'>Jämför priser →</Link>
      </header>
      <main>
        <section className={`guideHero guideHero-${category}`}>
          <div className='guideWrap'>
            <nav className='breadcrumbs' aria-label='Brödsmulor'><Link href='/'>Start</Link><span>›</span><Link href={categoryPath}>{categoryLabel}</Link><span>›</span><span aria-current='page'>{kicker}</span></nav>
            <Link className='back' href={categoryPath}><ArrowLeft size={16} /> Till {categoryLabel.toLowerCase()}</Link>
            <p className='kicker' style={{ marginTop: 32 }}>{kicker}</p>
            <h1>{title}</h1>
            <p className='lead'>{description}</p>
            <p className='fine'>Du kan läsa först och jämföra när du är redo.</p>
          </div>
        </section>
        <article className='article guideWrap'>
          <DecisionGateway category={category} intent={intent} currentPath={new URL(canonical).pathname} />
          <div className='checkList'>
            {bullets.map(item => <p key={item}><Check size={17} /> {item}</p>)}
          </div>
          {category === 'el' && <aside className='decisionPanel decisionPanelLower' aria-label='Sänk Kostnaden-kontrollen'><div><p className='partnerEyebrow'>SÄNK KOSTNADEN-KONTROLLEN</p><h2>Jämför hela kostnaden – inte bara öre/kWh</h2><p>Kontrollera pris/påslag, fast avgift, rabattens längd, ordinarie villkor samt bindnings- och uppsägningstid. Använd samma årsförbrukning för alla alternativ.</p></div><div className='decisionMetrics'><span><b>1</b> Årsförbrukning</span><span><b>2</b> Rörlig kostnad</span><span><b>3</b> Fasta avgifter</span><span><b>4</b> Villkor efter rabatt</span></div></aside>}
          {category === 'mobil' && <aside className='decisionPanel decisionPanelLower' aria-label='Sänk Kostnaden-kontrollen för mobil'><div><p className='partnerEyebrow'>SÄNK KOSTNADEN-KONTROLLEN</p><h2>Jämför abonnemanget du faktiskt kommer använda</h2><p>Utgå från rätt surfmängd och nät. Räkna sedan kampanjperiod och ordinarie pris tillsammans så att ett lågt introduktionspris inte döljer den verkliga kostnaden.</p></div><div className='decisionMetrics'><span><b>1</b> Surfmängd</span><span><b>2</b> Mobilnät</span><span><b>3</b> Första året</span><span><b>4</b> Bindning & villkor</span></div></aside>}
          {sections.map(section => <section key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}
          {(intent === 'compare' || (category === 'forsakring' && (intent === 'home' || intent === 'pet')) || (category === 'ekonomi' && intent === 'loan')) ? <PartnerDirectory category={category} intent={intent} heading={compareHeadings[category]} /> : <PartnerOffers category={category} intent={intent} heading={offerHeading} />}
          <div className='relatedGuides'>
            <h2>Läs vidare</h2>
            {related.map(item => <Link href={item.href} key={item.href}>{item.label} →</Link>)}
          </div>
          <p className='disclosure'>Informationen är generell. Kommersiella länkar markeras tydligt och urvalet behöver inte omfatta hela marknaden.</p>
        </article>
      </main>
    </>
  );
}
