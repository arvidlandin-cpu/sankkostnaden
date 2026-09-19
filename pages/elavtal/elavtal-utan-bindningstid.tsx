import IntentGuide from '../../components/IntentGuide';

export default function Page() {
  return (
    <IntentGuide
      title='Elavtal utan bindningstid 2026 – vad ska du jämföra?'
      description='Så jämför du elavtal utan bindningstid utifrån uppsägningstid, påslag, fasta avgifter, kampanjvillkor och din årsförbrukning.'
      kicker='EL UTAN BINDNINGSTID'
      canonical='https://sankkostnaden.se/elavtal/elavtal-utan-bindningstid/'
      category='el'
      intent='compare'
      bullets={['Skilj på bindningstid och uppsägningstid', 'Jämför påslag och fast avgift', 'Räkna med din egen årsförbrukning', 'Kontrollera vad som händer när en rabatt upphör']}
      sections={[{ heading: 'Flexibilitet är en del av värdet', body: 'Ett avtal utan lång bindning kan göra det enklare att byta när villkor eller marknadsläge förändras. Kontrollera ändå uppsägningstiden och andra avtalsvillkor.' }, { heading: 'Jämför inte bara energipriset', body: 'Påslag per kWh och fasta avgifter påverkar totalen olika beroende på hur mycket el hushållet använder. Räkna därför med din ungefärliga årsförbrukning.' }, { heading: 'Kampanjen är bara en del av året', body: 'Om en rabatt gäller en begränsad period behöver även kostnaden efter rabatten räknas med. Jämför ett helt år när det är möjligt.' }]}
      related={[{ href: '/elavtal/billigaste-elavtalet/', label: 'Billigaste elavtalet 2026' }, { href: '/elavtal/byta-elavtal/', label: 'Byta elavtal' }, { href: '/elavtal/rorligt-fast-kvartspris/', label: 'Rörligt, fast eller kvartspris?' }]}
    />
  );
}
