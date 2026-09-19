import IntentGuide from '../../components/IntentGuide';

export default function Page() {
  return (
    <IntentGuide
      title='Jämför elavtal 2026 – pris, påslag och avtalsform'
      description='Jämför elavtal på ett sätt som tar hänsyn till påslag, fasta avgifter, avtalsform, uppsägningstid och din egen årsförbrukning.'
      kicker='JÄMFÖR ELAVTAL'
      canonical='https://sankkostnaden.se/elavtal/jamfor-elavtal/'
      category='el'
      bullets={['Utgå från din årsförbrukning', 'Jämför påslag och fasta avgifter', 'Kontrollera avtalsform och uppsägningstid', 'Räkna kampanj och ordinarie villkor tillsammans']}
      sections={[{ heading: 'Jämför samma sak med samma sak', body: 'Ett lågt påslag kan kombineras med en hög fast avgift och tvärtom. Därför bör du räkna fram en ungefärlig årskostnad för varje alternativ med samma förbrukning.' }, { heading: 'Förbrukningen påverkar vilket avtal som ser billigast ut', body: 'Vid hög förbrukning får varje öre per kilowattimme större betydelse. Vid låg förbrukning kan den fasta månadsavgiften väga relativt tyngre.' }, { heading: 'Avtalsformen påverkar hur kostnaden varierar', body: 'Rörligt, fast och kvartspris har olika egenskaper. Välj inte avtalsform enbart efter dagens pris utan efter hur hushållet använder el och hur mycket prisvariation du accepterar.' }, { heading: 'Kontrollera villkoren före bytet', body: 'Se efter bindningstid, uppsägningstid, rabattens längd och vad som händer efter kampanjperioden. Då minskar risken att ett billigt introduktionspris blir dyrt över tid.' }]}
      related={[{ href: '/elavtal/billigaste-elavtalet/', label: 'Billigaste elavtalet 2026' }, { href: '/elavtal/byta-elavtal/', label: 'Byta elavtal' }, { href: '/elavtal/rorligt-fast-kvartspris/', label: 'Rörligt, fast eller kvartspris?' }]}
    />
  );
}
