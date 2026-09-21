import IntentGuide from '../../components/IntentGuide';

export default function JamforPrivatlan(){
  return <IntentGuide
    title='Jämför privatlån 2026 – effektiv ränta och total kostnad'
    description='Jämför privatlån på samma grund. Kontrollera effektiv ränta, avgifter, löptid och total återbetalning i de erbjudanden du faktiskt får.'
    kicker='JÄMFÖR PRIVATLÅN'
    canonical='https://sankkostnaden.se/ekonomi/jamfor-privatlan/'
    category='ekonomi'
    intent='loan'
    bullets={[
      'Jämför samma lånebelopp mellan alternativen',
      'Utgå från effektiv ränta – inte bara nominell ränta',
      'Kontrollera uppläggnings- och aviavgifter',
      'Jämför så lik löptid som möjligt',
      'Se total återbetalning innan du väljer',
    ]}
    sections={[
      {heading:'Effektiv ränta gör erbjudanden mer jämförbara',body:'Effektiv ränta inkluderar ränta och obligatoriska avgifter och är därför bättre för jämförelser än nominell ränta ensam. Den ränta du erbjuds är individuell, så utgå från de faktiska erbjudandena.'},
      {heading:'Längre löptid kan göra månadskostnaden missvisande',body:'En lägre månadsbetalning kan bero på att lånet betalas tillbaka under längre tid. Kontrollera därför både löptiden och den totala återbetalningen.'},
      {heading:'Jämför på samma grund',body:'Använd samma lånebelopp och så lik löptid som möjligt. Då blir skillnader i ränta och avgifter lättare att se och du minskar risken att jämföra olika upplägg.'},
    ]}
    related={[
      {href:'/ekonomi/samlingslan/',label:'När kan samlingslån sänka kostnaden?'},
      {href:'/ekonomi/',label:'Till Lån & ekonomi'},
      {href:'/verktyg/hushallskostnadskollen/',label:'Se hushållets återkommande kostnader'},
    ]}
  />;
}
