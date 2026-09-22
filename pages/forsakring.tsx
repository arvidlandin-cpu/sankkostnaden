import Link from 'next/link';
import { ArrowRight, ArrowUpRight, ShieldCheck } from 'lucide-react';
import CategoryLanding from '../components/CategoryLanding';
import { getActivePartners } from '../lib/partners';

export default function Forsakring(){
  const claims=getActivePartners('forsakring','claims',1)[0];
  const claimsBlock=claims?<section className='claimsSpotlight' aria-label='Försäkringsersättning'>
    <div>
      <p className='kicker'>HAR DU REDAN RÅKAT UT FÖR NÅGOT?</p>
      <h2>Du kan ha försäkringsersättning att hämta.</h2>
      <p>Försäkring handlar inte bara om vad du ska teckna. Efter en skada eller olycka kan ersättning ibland finnas i flera försäkringar. Kontrollera först vad du redan har och ta hjälp om du vill slippa driva ärendet själv.</p>
      <div className='claimsSpotlightActions'>
        <a href={claims.trackingUrl} data-partner={claims.name} data-category='forsakring' data-intent='claims' data-placement='insurance_hub_claims' target='_blank' rel='sponsored nofollow noopener'>Se om Insurello kan hjälpa <ArrowUpRight size={16}/></a>
        <Link href='/forsakring/forsakringsersattning/'>Läs om försäkringsersättning <ArrowRight size={16}/></Link>
      </div>
      <small>Partnerlänk · kontrollera Insurellos aktuella avgiftsmodell och villkor innan du startar ett ärende.</small>
    </div>
    <div className='claimsSpotlightBrand'>
      <img src={`https://www.google.com/s2/favicons?domain=${claims.domain}&sz=128`} alt='' loading='lazy'/>
      <strong>{claims.name}</strong>
      <span>Hjälp med försäkringsersättning</span>
    </div>
  </section>:null;

  return <CategoryLanding
    category='forsakring'
    canonical='https://sankkostnaden.se/forsakring/'
    title='Försäkringsguider 2026 – hem, djur & jämförelse'
    description='Jämför hemförsäkring och djurförsäkring efter premie, självrisk, omfattning och villkor.'
    kicker='JÄMFÖR FÖRSÄKRING'
    heading='Jämför rätt skydd först. Priset kommer sedan.'
    lead='Två försäkringar med olika självrisk eller omfattning är inte direkt jämförbara. Börja därför med rätt skyddsnivå.'
    icon={ShieldCheck}
    compareHref='/forsakring/jamfor-hemforsakring/'
    compareLabel='Jämför hemförsäkring'
    helpHref='/forsakring/djurforsakring/'
    helpLabel='Jämför djurförsäkring'
    partnerHeading='Aktuella försäkringsalternativ'
    showPartners={true}
    afterPartners={claimsBlock}
    checks={[
      'Årspremie efter eventuella rabatter',
      'Grundsjälvrisk och särskilda självrisker',
      'Omfattning, ersättningstak och viktiga undantag',
      'Tillägg som ingår eller kostar extra',
    ]}
    introTitle='Jämför bara alternativ med likvärdigt skydd'
    introText='Billigast premie kan innebära högre självrisk eller smalare skydd. Börja med det skydd du faktiskt behöver och jämför sedan pris.'
    guides={[
      {href:'/forsakring/jamfor-hemforsakring/',title:'Jämför hemförsäkring',text:'Premie, självrisk och omfattning.'},
      {href:'/forsakring/djurforsakring/',title:'Jämför djurförsäkring',text:'Pris, självrisk och skydd.'},
      {href:'/forsakring/hemforsakring-skyddskoll/',title:'Skyddskoll',text:'Kontrollera vilket skydd du behöver.'},
      {href:'/forsakring/vad-kostar-hemforsakring/',title:'Vad kostar hemförsäkring?',text:'Se vad som påverkar premien.'},
      {href:'/forsakring/forsakringsersattning/',title:'Försäkringsersättning',text:'Kontrollera om en skada eller olycka kan ge ersättning.'},
    ]}
    moreGuides={[
      {href:'/forsakring/hemforsakring-hyresratt/',title:'Hemförsäkring hyresrätt',text:'Relevant skydd för hyresrätt.'},
      {href:'/forsakring/hemforsakring-bostadsratt/',title:'Hemförsäkring bostadsrätt',text:'Kontrollera bostadsrättsskyddet.'},
    ]}
  />;
}
