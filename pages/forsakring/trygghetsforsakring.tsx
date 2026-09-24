import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Check, PiggyBank, ShieldCheck } from 'lucide-react';
import { getActivePartners } from '../../lib/partners';

export default function Trygghetsforsakring(){
  const hedvig=getActivePartners('forsakring','income-protection',1)[0];
  return <>
    <Head>
      <title>Trygghetsförsäkring 2026 – skydd för fasta kostnader | Sänk Kostnaden</title>
      <meta name='description' content='Så fungerar Hedvigs Trygghetsförsäkring för fasta kostnader vid arbetslöshet eller sjukskrivning. Kontrollera ersättning, kvalificering, karens, premie och villkor innan du tecknar.'/>
      <link rel='canonical' href='https://sankkostnaden.se/forsakring/trygghetsforsakring/'/>
      <meta name='robots' content='index,follow,max-image-preview:large,max-snippet:-1'/>
      <script type='application/ld+json' dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'WebPage',name:'Trygghetsförsäkring 2026 – skydd för fasta kostnader',description:'Guide till trygghetsförsäkring för fasta kostnader vid arbetslöshet eller sjukskrivning.',url:'https://sankkostnaden.se/forsakring/trygghetsforsakring/',isPartOf:{'@type':'WebSite',name:'Sänk Kostnaden',url:'https://sankkostnaden.se/'}})}}/>
    </Head>
    <header className='topbar'>
      <Link className='brand' href='/'><span className='brandMark'><PiggyBank size={22}/></span><span>Sänk Kostnaden</span></Link>
      <nav><Link href='/bredband/'>Bredband</Link><Link href='/elavtal/'>El</Link><Link href='/mobil/'>Mobil</Link><Link href='/forsakring/'>Försäkring</Link><Link href='/ekonomi/'>Ekonomi</Link></nav>
      {hedvig?<a className='topbarCta' href='#hedvig-trygghet'>Se villkor →</a>:<Link className='topbarCta' href='/forsakring/'>Försäkring →</Link>}
    </header>
    <main>
      <section className='guideHero guideHero-forsakring'>
        <div className='guideWrap'>
          <Link className='back' href='/forsakring/'><ArrowLeft size={16}/> Försäkring</Link>
          <div className='guideIcon'><ShieldCheck size={25}/></div>
          <p className='kicker'>TRYGGHETSFÖRSÄKRING</p>
          <h1>Skydd för fasta kostnader om inkomsten försvinner</h1>
          <p className='lead'>Hedvigs Trygghetsförsäkring är tänkt som ett komplement när arbetslöshet eller sjukskrivning påverkar hushållets ekonomi. Jämför inte bara ersättningsbeloppet – kontrollera också vem som kan teckna, karens, kvalificering, premie och viktiga undantag.</p>
        </div>
      </section>

      <article className='article guideWrap'>
        <h2>Vad kan försäkringen täcka?</h2>
        <p>Enligt Hedvigs produktinformation kan ersättningen användas för fasta kostnader som exempelvis hyra eller månadsavgift, bolåneränta, el, bredband, telefoni, försäkringar och streamingtjänster.</p>
        <div className='checkList'>
          {[
            'Försäkrat belopp: 6 000 eller 12 000 kr per månad',
            'Skattefri ersättning i upp till 12 månader',
            'Avsedd för bland annat tillsvidareanställda, kontraktsanställda och egenföretagare',
            'Kan vara ett komplement till a-kassa eller annan inkomsttrygghet',
          ].map(item=><p key={item}><Check size={18}/>{item}</p>)}
        </div>

        <h2>Kontrollera detta före du tecknar</h2>
        <div className='checkList'>
          {[
            'Vilka kvalificeringskrav som gäller för din anställningsform',
            'Karens- och kvalificeringstid innan ersättning kan betalas',
            'Vilka orsaker till arbetslöshet eller sjukskrivning som omfattas',
            'Premie, högsta ersättningstid och eventuella undantag',
            'Om du redan har motsvarande skydd genom arbetsgivare, fack eller annan försäkring',
          ].map(item=><p key={item}><Check size={18}/>{item}</p>)}
        </div>

        {hedvig&&<section id='hedvig-trygghet' className='claimsSpotlight' aria-label='Hedvig Trygghetsförsäkring'>
          <div>
            <p className='kicker'>PARTNER · HEDVIG</p>
            <h2>Se aktuella villkor hos Hedvig</h2>
            <p>Enligt Hedvigs partnerinformation den 24 september 2026 är provisionen 500 kr per tecknad Trygghetsförsäkring. Det påverkar inte priset för dig. Kontrollera alltid aktuella kvalificeringskrav, premie, karens, ersättningsnivåer och undantag hos Hedvig innan du tecknar.</p>
            <div className='claimsSpotlightActions'>
              <a href={hedvig.trackingUrl} data-partner={hedvig.name} data-category='forsakring' data-intent='income-protection' data-placement='income_protection_guide' data-partner-position='1' target='_blank' rel='sponsored nofollow noopener'>Gå till Hedvig och välj Trygghetsförsäkring <ArrowUpRight size={16}/></a>
              <a href='https://www.hedvig.com/se/forsakringar/trygghetsforsakring' target='_blank' rel='noopener'>Läs produktinfo hos Hedvig <ArrowUpRight size={16}/></a>
              <Link href='/forsakring/'>Jämför andra försäkringsbehov</Link>
            </div>
            <small>Partnerlänk · länken går till Hedvig. Välj Trygghetsförsäkring där och kontrollera aktuella villkor före köp.</small>
          </div>
          <div className='claimsSpotlightBrand'>
            <img src='https://www.google.com/s2/favicons?domain=hedvig.com&sz=128' alt='' loading='lazy'/>
            <strong>Hedvig</strong>
            <span>Trygghetsförsäkring</span>
          </div>
        </section>}

        <h2>När kan den vara relevant?</h2>
        <p>Den här typen av skydd kan vara relevant om en stor del av hushållets budget går till fasta kostnader och ett längre inkomstbortfall skulle vara svårt att bära med sparande och befintliga trygghetssystem. Det betyder inte att försäkringen är rätt för alla – jämför kostnaden för premien mot den risk du faktiskt vill försäkra.</p>

        <p className='disclosure'>Kommersiell information: Sänk Kostnaden kan få ersättning från Hedvig om du tecknar via partnerlänken. Produkt- och provisionsuppgifterna ovan bygger på Hedvig/Addrevenue-information mottagen 24 september 2026. Kontrollera alltid aktuella fullständiga villkor hos Hedvig före köp.</p>
      </article>
    </main>
  </>;
}
