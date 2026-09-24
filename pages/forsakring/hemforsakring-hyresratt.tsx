import IntentGuide from '../../components/IntentGuide';

export default function Page() {
  return (
    <IntentGuide
      title='Vad kostar hemförsäkring hyresrätt 2026? Pris per månad & skydd'
      description='Vad kostar hemförsäkring för hyresrätt 2026? Se vad som påverkar pris per månad och jämför självrisk, lösöre, reseskydd och allrisk.'
      kicker='HEMFÖRSÄKRING HYRESRÄTT'
      canonical='https://sankkostnaden.se/forsakring/hemforsakring-hyresratt/'
      category='forsakring' intent='home'
      bullets={['Jämför likvärdig omfattning – inte bara premie', 'Kontrollera självrisker och ersättningsgränser', 'Se om allrisk ingår eller är tillval', 'Kontrollera reseskydd och viktiga undantag']}
      sections={[{ heading: 'Vad kostar hemförsäkring för hyresrätt per månad?', body: 'Priset varierar mellan hushåll och försäkringsbolag. Bostadsort, antal personer, valt skydd, självrisk och tillägg påverkar premien. Jämför därför ditt faktiska månadspris hos flera alternativ i stället för att utgå från ett generellt snitt.' }, { heading: 'Vad är relevant i en hyresrätt?', body: 'Hemförsäkringen handlar bland annat om dina saker och flera personliga skydd. Exakt omfattning och undantag skiljer mellan försäkringar, så läs villkoren för de delar som är viktiga för hushållet.' }, { heading: 'Billigast premie behöver inte ge lägst riskkostnad', body: 'En lägre premie kan kombineras med högre självrisk eller snävare ersättningsgränser. Jämför därför pris och skydd sida vid sida.' }, { heading: 'Kontrollera hushållet som ska omfattas', body: 'Se vilka personer försäkringen gäller för och vilka krav som ställs. Det minskar risken för att jämföra två produkter med olika förutsättningar.' }]}
      related={[{ href: '/forsakring/jamfor-hemforsakring/', label: 'Jämför hemförsäkring' }, { href: '/forsakring/vad-kostar-hemforsakring/', label: 'Vad kostar hemförsäkring?' }, { href: '/forsakring/hemforsakring-bostadsratt/', label: 'Hemförsäkring för bostadsrätt' }, { href: '/forsakring/hemforsakring-skyddskoll/', label: 'Gör skyddskollen för hemförsäkring' }]}
    />
  );
}
