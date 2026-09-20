import IntentGuide from '../../components/IntentGuide';

export default function Page() {
  return (
    <IntentGuide
      title='Kvartspris på el 2026 – när kan det löna sig?'
      description='Guide till kvartspris på el: hur avtalsformen fungerar, vem som kan dra nytta av att styra förbrukningen och vad du bör jämföra.'
      kicker='KVARTSPRIS EL'
      canonical='https://sankkostnaden.se/elavtal/kvartspris/'
      category='el'
      intent='electricity'
      bullets={['Tidpunkten för förbrukningen får större betydelse', 'Styrbar elbil och uppvärmning kan vara en fördel', 'Påslag och fasta avgifter behöver fortfarande jämföras', 'Prisvariation kräver större tolerans för svängningar']}
      sections={[{ heading: 'Kvartspris gör tidpunkten viktig', body: 'När priset följer kortare marknadsintervall kan hushåll som flyttar större laster till billigare perioder påverka sin elhandelskostnad mer aktivt.' }, { heading: 'Styrbar förbrukning är nyckeln', body: 'Elbilsladdning, varmvatten och uppvärmning är exempel på större laster som i vissa hushåll kan schemaläggas. Om nästan all förbrukning måste ske när behovet uppstår är handlingsutrymmet mindre.' }, { heading: 'Jämför fortfarande hela avtalet', body: 'Även ett kvartsprisavtal kan ha påslag, fasta avgifter och andra villkor. Avtalsformen ersätter därför inte en vanlig kostnadsjämförelse.' }]}
      related={[{ href: '/elavtal/rorligt-fast-kvartspris/', label: 'Jämför avtalsformer' }, { href: '/elavtal/rorligt-elpris/', label: 'Rörligt elpris' }, { href: '/elavtal/byta-elavtal/', label: 'Byta elavtal' }]}
    />
  );
}
