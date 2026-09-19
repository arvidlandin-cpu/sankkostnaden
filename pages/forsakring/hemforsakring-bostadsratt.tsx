import IntentGuide from '../../components/IntentGuide';

export default function Page() {
  return (
    <IntentGuide
      title='Hemförsäkring bostadsrätt 2026 – pris, självrisk och skydd'
      description='Jämför hemförsäkring för bostadsrätt: pris, självrisk, bostadsrättstillägg, lösöre, allrisk och andra viktiga villkor.'
      kicker='HEMFÖRSÄKRING BOSTADSRÄTT'
      canonical='https://sankkostnaden.se/forsakring/hemforsakring-bostadsratt/'
      category='forsakring' intent='home'
      bullets={['Kontrollera hur bostadsrättsskyddet är ordnat', 'Jämför premie och självrisk tillsammans', 'Se ersättningsgränser och undantag', 'Kontrollera allrisk, reseskydd och andra tillägg']}
      sections={[{ heading: 'Bostadsrätten kräver en extra kontrollpunkt', body: 'Utöver vanligt hemförsäkringsskydd behöver den som bor i bostadsrätt kontrollera hur skyddet för själva bostadsrätten är löst och om föreningen har ett kollektivt upplägg. Förutsättningarna kan skilja.' }, { heading: 'Jämför likvärdigt innehåll', body: 'Premien blir meningsfull först när försäkringarna har jämförbar omfattning. Kontrollera självrisk, ersättningsgränser och de viktigaste undantagen.' }, { heading: 'Undvik dubbla eller onödiga tillägg', body: 'Ta reda på vad som redan ingår innan du betalar extra för tillägg. Samtidigt bör du inte ta bort ett skydd som hushållet faktiskt behöver enbart för att pressa premien.' }]}
      related={[{ href: '/forsakring/jamfor-hemforsakring/', label: 'Jämför hemförsäkring' }, { href: '/forsakring/vad-kostar-hemforsakring/', label: 'Vad kostar hemförsäkring?' }, { href: '/forsakring/hemforsakring-hyresratt/', label: 'Hemförsäkring för hyresrätt' }]}
    />
  );
}
