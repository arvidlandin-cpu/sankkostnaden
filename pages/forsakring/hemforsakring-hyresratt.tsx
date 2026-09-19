import IntentGuide from '../../components/IntentGuide';

export default function Page() {
  return (
    <IntentGuide
      title='Hemförsäkring för hyresrätt 2026 – vad ska du jämföra?'
      description='Guide till hemförsäkring för hyresrätt: jämför premie, självrisk, lösöre, ansvarsskydd, rättsskydd, reseskydd och allrisk.'
      kicker='HEMFÖRSÄKRING HYRESRÄTT'
      canonical='https://sankkostnaden.se/forsakring/hemforsakring-hyresratt/'
      category='forsakring'
      bullets={['Jämför likvärdig omfattning – inte bara premie', 'Kontrollera självrisker och ersättningsgränser', 'Se om allrisk ingår eller är tillval', 'Kontrollera reseskydd och viktiga undantag']}
      sections={[{ heading: 'Vad är relevant i en hyresrätt?', body: 'Hemförsäkringen handlar bland annat om dina saker och flera personliga skydd. Exakt omfattning och undantag skiljer mellan försäkringar, så läs villkoren för de delar som är viktiga för hushållet.' }, { heading: 'Billigast premie behöver inte ge lägst riskkostnad', body: 'En lägre premie kan kombineras med högre självrisk eller snävare ersättningsgränser. Jämför därför pris och skydd sida vid sida.' }, { heading: 'Kontrollera hushållet som ska omfattas', body: 'Se vilka personer försäkringen gäller för och vilka krav som ställs. Det minskar risken för att jämföra två produkter med olika förutsättningar.' }]}
      related={[{ href: '/forsakring/jamfor-hemforsakring/', label: 'Jämför hemförsäkring' }, { href: '/forsakring/vad-kostar-hemforsakring/', label: 'Vad kostar hemförsäkring?' }, { href: '/forsakring/hemforsakring-bostadsratt/', label: 'Hemförsäkring för bostadsrätt' }]}
    />
  );
}
