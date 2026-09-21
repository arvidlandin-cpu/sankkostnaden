import IntentGuide from '../../components/IntentGuide';

export default function Samlingslan(){
  return <IntentGuide
    title='Samlingslån 2026 – när kan det sänka kostnaden?'
    description='Se när ett samlingslån kan sänka den totala kostnaden. Jämför effektiv ränta, avgifter, löptid och total återbetalning före och efter.'
    kicker='SAMLINGSLÅN'
    canonical='https://sankkostnaden.se/ekonomi/samlingslan/'
    category='ekonomi'
    intent='loan'
    bullets={[
      'Summera kostnaden för lånen som ska ersättas',
      'Jämför ny effektiv ränta och alla avgifter',
      'Kontrollera om löptiden blir längre',
      'Jämför total återbetalning – inte bara månadsbeloppet',
      'Undvik att låna mer än skulderna du faktiskt vill samla',
    ]}
    sections={[
      {heading:'Lägre månadsbelopp betyder inte automatiskt lägre kostnad',body:'Ett samlingslån kan sänka månadsbetalningen genom lägre ränta, men också genom längre löptid. Det är därför total återbetalning före och efter som visar om kostnaden faktiskt sjunker.'},
      {heading:'Räkna på de gamla lånen först',body:'Notera återstående skuld, ränta, avgifter och återstående löptid för varje lån. Då har du en rimlig jämförelsepunkt för ett nytt erbjudande.'},
      {heading:'Jämför det faktiska erbjudandet',body:'Räntan på privatlån sätts individuellt. Bedöm därför ett samlingslån utifrån den effektiva ränta, löptid och totalkostnad du faktiskt erbjuds.'},
    ]}
    related={[
      {href:'/ekonomi/jamfor-privatlan/',label:'Så jämför du privatlån'},
      {href:'/ekonomi/',label:'Till Lån & ekonomi'},
      {href:'/verktyg/hushallskostnadskollen/',label:'Se hushållets återkommande kostnader'},
    ]}
  />;
}
