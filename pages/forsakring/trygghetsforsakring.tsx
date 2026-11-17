import Head from 'next/head';
import PartnerIdentity from '../../components/PartnerIdentity';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Check, PiggyBank, ShieldCheck } from 'lucide-react';
import { getActivePartners } from '../../lib/partners';

export default function Trygghetsforsakring(){
  const hedvig=getActivePartners('forsakring','income-protection',1)[0];
  return <>
    <Head>
      <title>Vad är en trygghetsförsäkring? Skydd och villkor 2026 | Sänk Kostnaden</title>
      <meta name='description' content='Vad betyder trygghetsförsäkring? Jämför skydd för fasta kostnader med inkomstförsäkring, låneskydd och TFA. Se ett tydligt märkt exempel från Hedvig.'/>
      <link rel='canonical' href='https://sankkostnaden.se/forsakring/trygghetsforsakring/'/>
      <meta name='robots' content='index,follow,max-image-preview:large,max-snippet:-1'/>
      <script type='application/ld+json' dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'WebPage',name:'Vad är en trygghetsförsäkring? Skydd och villkor 2026',description:'Vad betyder trygghetsförsäkring? Jämför skydd för fasta kostnader med inkomstförsäkring, låneskydd och TFA. Se ett tydligt märkt exempel från Hedvig.',url:'https://sankkostnaden.se/forsakring/trygghetsforsakring/',isPartOf:{'@type':'WebSite',name:'Sänk Kostnaden',url:'https://sankkostnaden.se/'}})}}/>
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
          <h1>Vad är en trygghetsförsäkring?</h1>
          <p className='lead'>Trygghetsförsäkring är ett namn som används för olika försäkringar. En produkt kan skydda vissa fasta kostnader vid inkomstbortfall, medan Trygghetsförsäkring vid arbetsskada (TFA) handlar om arbetsskador. Börja med att kontrollera vilken typ av skydd du behöver.</p>
        </div>
      </section>

      <article className='article guideWrap'>
        <p className='fine' style={{fontSize:14,color:'var(--sk-ink-muted)'}} data-testid='trygghet-commercial-notice'>Vi visar ett partnerexempel från Hedvig och kan få ersättning via den markerade partnerlänken. Jämförelsen nedan gäller typer av försäkringsskydd.</p>

        <section aria-labelledby='trygghet-types-title' data-testid='trygghet-cover-types'>
          <h2 id='trygghet-types-title'>Skillnaden mot inkomstförsäkring, låneskydd och TFA</h2>
          <p>Försäkringar kan ersätta olika saker och gälla vid olika händelser. Jämför därför innehållet, inte bara produktnamnet.</p>
          <dl className='checkList'>
            <div data-cover-type='fixed-costs' style={{padding:'16px 0',borderBottom:'1px solid var(--sk-line)'}}>
              <dt style={{fontWeight:800,color:'var(--sk-ink)'}}>Skydd för fasta kostnader</dt>
              <dd style={{margin:'6px 0 0',fontSize:15,lineHeight:1.6}}>Kan ersätta vissa godkända utgifter vid inkomstbortfall. Kontrollera vilka kostnader och händelser som ingår. <a href='#hedvig-product-example'>Se Hedvig-exemplet nedan</a>.</dd>
            </div>
            <div data-cover-type='income' style={{padding:'16px 0',borderBottom:'1px solid var(--sk-line)'}}>
              <dt style={{fontWeight:800,color:'var(--sk-ink)'}}>Inkomstförsäkring</dt>
              <dd style={{margin:'6px 0 0',fontSize:15,lineHeight:1.6}}>Kan komplettera ersättning vid arbetslöshet eller sjukskrivning, beroende på produkt. Kontrollera vilket skydd du redan har genom exempelvis a-kassa, fack eller arbetsgivare. <a href='https://www.konsumenternas.se/forsakringar/personforsakringar/inkomstforsakringar/'>Konsumenternas om inkomstförsäkring</a>.</dd>
            </div>
            <div data-cover-type='loan' style={{padding:'16px 0',borderBottom:'1px solid var(--sk-line)'}}>
              <dt style={{fontWeight:800,color:'var(--sk-ink)'}}>Låneskydd och betalskydd</dt>
              <dd style={{margin:'6px 0 0',fontSize:15,lineHeight:1.6}}>Kan täcka lånebetalningar vid exempelvis arbetslöshet eller sjukdom. Kontrollera att just ditt lån och den aktuella händelsen omfattas. <a href='https://konsumenternasbankochfinansbyra.se/lan--betalningar/lan/laneskydd'>Konsumenternas om låneskydd</a>.</dd>
            </div>
            <div data-cover-type='work-injury' style={{padding:'16px 0'}}>
              <dt style={{fontWeight:800,color:'var(--sk-ink)'}}>Trygghetsförsäkring vid arbetsskada (TFA)</dt>
              <dd style={{margin:'6px 0 0',fontSize:15,lineHeight:1.6}}>Gäller arbetsskador och kan finnas genom jobbet. Kontrollera med arbetsgivaren vilket avtal och vilken arbetsskadeförsäkring som gäller. <a href='https://www.afaforsakring.se/forsakring/arbetsskadeforsakring'>Afa om arbetsskadeförsäkring</a>.</dd>
            </div>
          </dl>
          <p className='fine' style={{fontSize:13,color:'var(--sk-ink-muted)'}}>Begreppsjämförelsen är vår vägledning utifrån de länkade källorna, kontrollerade 17 november 2026. Respektive försäkrings villkor avgör ditt skydd.</p>
          <p><strong>Börja med ditt befintliga skydd.</strong> Kontrollera a-kassa, fack, arbetsgivare och andra försäkringar. Jämför sedan samma behov, ersättningsperiod och viktiga undantag innan du köper ett tillägg.</p>
        </section>

        <section id='hedvig-product-example' aria-labelledby='hedvig-example-title' data-testid='hedvig-income-example' style={{marginTop:32,paddingTop:24,borderTop:'1px solid var(--sk-line)'}}>
        <h2 id='hedvig-example-title'>Exempel: Hedvig Trygghetsförsäkring</h2>
        <p>Detta är ett partnerexempel på skydd för fasta kostnader. Beloppen och begränsningarna i den här delen gäller Hedvigs produkt, inte alla försäkringar som kallas trygghetsförsäkring.</p>
        <h3>Vad kan Hedvigs försäkring täcka?</h3>
        <p>Enligt Hedvigs produktinformation kan ersättningen användas för fasta kostnader som exempelvis hyra eller månadsavgift, bolåneränta, el, bredband, telefoni, försäkringar och streamingtjänster.</p>
        <div className='checkList'>
          {[
            'Försäkrat belopp: 6 000 eller 12 000 kr per månad',
            'Skattefri ersättning i upp till 12 månader',
            'Avsedd för bland annat tillsvidareanställda, kontraktsanställda och egenföretagare',
            'Kan vara ett komplement till a-kassa eller annan inkomsttrygghet',
          ].map(item=><p key={item}><Check size={18}/>{item}</p>)}
        </div>

        <p><strong>Försäkringsbeloppet är ett tak, inte en garanterad utbetalning.</strong> Ersättningen beror bland annat på dina faktiska fasta utgifter och eventuell sjukskrivningsgrad. Vid arbetslöshet eller arbetsoförmåga får den totala ersättningen högst motsvara 90 procent av den nettolön du förlorar, även när motsvarande försäkringar hos andra bolag räknas med. Kontrollera hur begränsningarna gäller i din situation i <a href='https://gateway.hedvig.com/external-insurance-documents/terms/SE_PAYMENT_PROTECTION-HEDVIG-null-1/13/docs/TERMS_AND_CONDITIONS/sv/SE_PAYMENT_PROTECTION_2026-09-15-HEDVIG-T&C.pdf' target='_blank' rel='noopener noreferrer'>Hedvigs fullständiga villkor för Trygghetsförsäkring (PDF)</a>.</p>

        <h3>Kontrollera Hedvigs villkor innan du tecknar</h3>
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
            <p>Kontrollera aktuella kvalificeringskrav, premie, karens, ersättningsnivåer och undantag hos Hedvig innan du tecknar.</p>
            <div className='claimsSpotlightActions'>
              <a href={hedvig.trackingUrl} data-partner={hedvig.name} data-category='forsakring' data-intent='income-protection' data-placement='income_protection_guide' data-partner-position='1' target='_blank' rel='sponsored nofollow noopener'>Gå till Hedvig och välj Trygghetsförsäkring <ArrowUpRight size={16}/></a>
              <a href='https://www.hedvig.com/se/forsakringar/trygghetsforsakring' target='_blank' rel='noopener'>Läs produktinfo hos Hedvig <ArrowUpRight size={16}/></a>
              <Link href='/forsakring/'>Jämför andra försäkringsbehov</Link>
            </div>
            <small>Partnerlänk · länken går till Hedvig. Välj Trygghetsförsäkring där och kontrollera aktuella villkor före köp.</small>
          </div>
          <div className='claimsSpotlightBrand'>
            <PartnerIdentity partner={hedvig} large appearance='on-dark'/>
            <span>Trygghetsförsäkring</span>
          </div>
        </section>}

        <h3>När kan Hedvigs försäkring vara relevant?</h3>
        <p>Den här typen av skydd kan vara relevant om en stor del av hushållets budget går till fasta kostnader och ett längre inkomstbortfall skulle vara svårt att bära med sparande och befintliga trygghetssystem. Det betyder inte att försäkringen är rätt för alla – jämför kostnaden för premien mot den risk du faktiskt vill försäkra.</p>

        </section>

        <p className='disclosure'>Kommersiell information: Sänk Kostnaden kan få ersättning från Hedvig om du tecknar via partnerlänken. Ersättningsbegränsningarna är kontrollerade mot Hedvigs fullständiga villkor den 11 november 2026. Kontrollera alltid aktuella fullständiga villkor hos Hedvig före köp.</p>
      </article>
    </main>
  </>;
}
