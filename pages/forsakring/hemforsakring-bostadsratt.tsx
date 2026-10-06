import IntentGuide from '../../components/IntentGuide';

export default function Page() {
  return (
    <IntentGuide
      title='Hemförsäkring bostadsrätt 2026 – pris, skydd och självrisk'
      description='Hemförsäkring bostadsrätt 2026: se vad som påverkar priset och jämför självrisk, bostadsrättstillägg, lösöre, allrisk och andra viktiga villkor.'
      kicker='HEMFÖRSÄKRING BOSTADSRÄTT'
      canonical='https://sankkostnaden.se/forsakring/hemforsakring-bostadsratt/'
      category='forsakring' intent='home'
      bullets={['Kontrollera hur bostadsrättsskyddet är ordnat', 'Jämför premie och självrisk tillsammans', 'Se ersättningsgränser och undantag', 'Kontrollera allrisk, reseskydd och andra tillägg']}
      utility={{href:'/forsakring/hemforsakring-skyddskoll/',eyebrow:'VERKTYG · SKYDDSKOLL',title:'Kontrollera vad du behöver jämföra innan priset',body:'Boendeform, hushåll och egendom påverkar vilka villkor som förtjänar extra kontroll. Gör skyddskollen innan du väljer på premie.',cta:'Gör skyddskollen'}}
      sections={[
        { heading: 'Bostadsrätten kräver en extra kontrollpunkt', body: 'Utöver vanligt hemförsäkringsskydd behöver den som bor i bostadsrätt kontrollera hur skyddet för själva bostadsrätten är löst och om föreningen har ett kollektivt upplägg. Förutsättningarna kan skilja.' },
        { heading: 'Behöver du bostadsrättstillägg?', body: 'Kontrollera först om bostadsrättsföreningen redan har ett kollektivt bostadsrättstillägg och vad det faktiskt omfattar. Om ett sådant skydd saknas eller är begränsat kan du behöva ett individuellt tillägg. Utgå från föreningens och försäkringsbolagets aktuella villkor innan du väljer bort eller lägger till skydd.' },
        { heading: 'Kollektivt tillägg kan ändra vad du behöver köpa själv', body: 'Ett kollektivt bostadsrättstillägg innebär inte automatiskt att alla villkor är identiska med ett individuellt tillägg. Kontrollera självrisk, omfattning, undantag och hur en skada hanteras innan du jämför premie mellan bolag.' },
        { heading: 'Vad kostar bostadsrättstillägg?', body: 'Priset går inte att bedöma rätt utan att först veta om tillägget redan finns via föreningen och vilket skydd du jämför. Jämför därför kostnaden först efter att du säkerställt samma omfattning och självrisk.' },
        { heading: 'Jämför likvärdigt innehåll', body: 'Premien blir meningsfull först när försäkringarna har jämförbar omfattning. Kontrollera självrisk, ersättningsgränser och de viktigaste undantagen.' },
        { heading: 'Undvik dubbla eller onödiga tillägg', body: 'Ta reda på vad som redan ingår innan du betalar extra för tillägg. Samtidigt bör du inte ta bort ett skydd som hushållet faktiskt behöver enbart för att pressa premien.' }
      ]}
      related={[
        { href: '/forsakring/jamfor-hemforsakring/', label: 'Jämför hemförsäkring' },
        { href: '/forsakring/vad-kostar-hemforsakring/', label: 'Vad kostar hemförsäkring?' },
        { href: '/forsakring/hemforsakring-hyresratt/', label: 'Hemförsäkring för hyresrätt' },
        { href: '/forsakring/hemforsakring-skyddskoll/', label: 'Gör skyddskollen för hemförsäkring' }
      ]}
    />
  );
}
