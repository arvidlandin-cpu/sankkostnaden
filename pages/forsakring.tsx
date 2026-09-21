import { ShieldCheck } from 'lucide-react';
import CategoryLanding from '../components/CategoryLanding';

export default function Forsakring(){
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
    showPartners={false}
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
    ]}
    moreGuides={[
      {href:'/forsakring/hemforsakring-hyresratt/',title:'Hemförsäkring hyresrätt',text:'Relevant skydd för hyresrätt.'},
      {href:'/forsakring/hemforsakring-bostadsratt/',title:'Hemförsäkring bostadsrätt',text:'Kontrollera bostadsrättsskyddet.'},
    ]}
  />;
}
