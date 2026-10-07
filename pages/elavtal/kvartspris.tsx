import IntentGuide from '../../components/IntentGuide';

export default function Page() {
  return (
    <IntentGuide
      title='Kvartspris på el 2026 – vad är det och när passar det?'
      description='Kvartspris på el innebär att priset följer marknaden i kortare intervall. Se hur det fungerar, skillnaden mot rörligt pris och när avtalsformen kan passa.'
      kicker='KVARTSPRIS EL'
      canonical='https://sankkostnaden.se/elavtal/kvartspris/'
      category='el'
      intent='electricity'
      bullets={['Tidpunkten för förbrukningen får större betydelse', 'Styrbar elbil och uppvärmning kan vara en fördel', 'Påslag och fasta avgifter behöver fortfarande jämföras', 'Prisvariation kräver större tolerans för svängningar']}
      sections={[{ heading: 'Vad menas med kvartspris på el?', body: 'Med kvartspris varierar energipriset i korta tidsintervall och kostnaden påverkas därför mer av när elen används. För hushåll som kan flytta större förbrukning kan tidpunkten få större betydelse än med ett traditionellt rörligt månadspris.' }, { heading: 'Kvartspris eller rörligt elpris?', body: 'Rörligt elpris bygger normalt på ett genomsnitt över en längre period, medan kvartspris följer priset närmare den faktiska tidpunkten för förbrukningen. Vilket som passar beror bland annat på hur mycket av förbrukningen du kan styra.' }, { heading: 'Kvartspris gör tidpunkten viktig', body: 'När priset följer kortare marknadsintervall kan hushåll som flyttar större laster till billigare perioder påverka sin elhandelskostnad mer aktivt.' }, { heading: 'Styrbar förbrukning är nyckeln', body: 'Elbilsladdning, varmvatten och uppvärmning är exempel på större laster som i vissa hushåll kan schemaläggas. Om nästan all förbrukning måste ske när behovet uppstår är handlingsutrymmet mindre.' }, { heading: 'Jämför fortfarande hela avtalet', body: 'Även ett kvartsprisavtal kan ha påslag, fasta avgifter och andra villkor. Avtalsformen ersätter därför inte en vanlig kostnadsjämförelse.' }]}
      related={[{ href: '/elavtal/rorligt-fast-kvartspris/', label: 'Jämför avtalsformer' }, { href: '/elavtal/rorligt-elpris/', label: 'Rörligt elpris' }, { href: '/elavtal/byta-elavtal/', label: 'Byta elavtal' }]}
    />
  );
}
