import IntentGuide from '../../components/IntentGuide';

export default function Page() {
  return (
    <IntentGuide
      title='Bredband 1000/1000 – behöver du 1 Gbit/s?'
      description='Guide till bredband 1000/1000 Mbit/s: när gigabitbredband är motiverat och när en billigare hastighet sannolikt räcker.'
      kicker='1000/1000 MBIT/S'
      canonical='https://sankkostnaden.se/bredband/1000-1000/'
      category='bredband'
      bullets={['Mycket hög kapacitet för stora överföringar', 'Kontrollera att utrustningen klarar gigabithastighet', 'Jämför priset med 500/500 och 250/250', 'Välj efter faktisk användning – inte maxsiffran']}
      sections={[{ heading: 'Gigabit är mycket kapacitet', body: '1000/1000 kan vara relevant för hushåll som ofta flyttar mycket stora filer eller har många krävande användare samtidigt. För vanlig surf, streaming och videosamtal är behovet normalt långt lägre.' }, { heading: 'Räkna vad toppnivån kostar extra', body: 'Skillnaden mellan gigabit och en lägre nivå bör räknas över ett helt år. Om användningen inte förändras kan nedgradering vara ett enkelt sätt att minska en återkommande kostnad.' }, { heading: 'Mät på rätt sätt', body: 'För att bedöma själva internetanslutningen bör du testa med lämplig utrustning och helst kabel. Ett wifi-test i ett avlägset rum säger mer om det trådlösa nätet än om gigabitanslutningen.' }]}
      related={[{ href: '/bredband/500-500/', label: 'Bredband 500/500' }, { href: '/bredband/hur-snabbt-bredband-behover-du/', label: 'Hur snabbt bredband behöver du?' }, { href: '/bredband/billigaste-bredbandet/', label: 'Billigaste bredbandet 2026' }]}
    />
  );
}
