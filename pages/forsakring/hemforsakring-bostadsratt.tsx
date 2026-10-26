import IntentGuide from '../../components/IntentGuide';
import CondoInsuranceCheck from '../../components/CondoInsuranceCheck';

export default function Page() {
  return (
    <IntentGuide
      title='Hemförsäkring bostadsrätt 2026 – pris, skydd och självrisk'
      description='Hemförsäkring bostadsrätt 2026: se vad som påverkar priset och jämför självrisk, bostadsrättstillägg, lösöre, allrisk och andra viktiga villkor.'
      kicker='HEMFÖRSÄKRING BOSTADSRÄTT'
      canonical='https://sankkostnaden.se/forsakring/hemforsakring-bostadsratt/'
      category='forsakring' intent='home'
      bullets={['Kontrollera om föreningen har kollektivt bostadsrättstillägg', 'Jämför personlig premie för hela hemförsäkringen, inte bara tillägget', 'Jämför premie, självrisk och åldersavdrag tillsammans', 'Kontrollera lösöre, allrisk, reseskydd och andra tillägg']}
      sections={[
        { heading: 'Vad kostar hela hemförsäkringen för en bostadsrätt?', body: 'Det finns inget standardpris som visar vad just ditt hushåll ska betala. Begär personliga prisuppgifter för hela hemförsäkringen och kontrollera om bostadsrättstillägget ingår, kostar extra eller finns kollektivt genom föreningen. Enligt Konsumenternas Försäkringsbyrå påverkas premien bland annat av bostadens storlek, område och antal personer i hushållet. En nykundsrabatt kan gälla första året men inte därefter. Ett pris för enbart tillägget är därför inte ett svar på vad hela hemförsäkringen kostar.' },
        { heading: 'Så jämför du två egna offerter på samma villkor', body: 'Be om två offerter för samma bostad, hushåll och önskade skydd. Jämför samma tolvmånadersperiod: använd angiven årspremie, eller summera de månadsbelopp som faktiskt gäller under perioden. Lägg bara till obligatoriska avgifter och valda tillägg som inte redan ingår. Skriv upp priset efter eventuell rabatt separat; ett förstaårspris säger inte vad nästa år kostar. Anteckna sedan självrisk, åldersavdrag och ersättningsgränser bredvid priset. Lägg inte till dessa som säkra årskostnader: de påverkar eventuell ersättning vid en skada och kan skilja sig mellan skadefall. Lägre premie betyder därför inte automatiskt likvärdigt skydd. Metoden är vår jämförelsechecklista, inte en offert eller besparingsprognos. Konsumenternas jämförelse av hemförsäkringar, länkad under Läs vidare, förklarar varför personliga prisuppgifter och försäkringens innehåll behöver jämföras tillsammans.' },
        { heading: 'Behöver jag bostadsrättstillägg?', body: 'Som bostadsrättshavare behöver du kontrollera att det finns ett försäkringsskydd för delar av lägenheten som du har underhållsansvar för, till exempel ytskikt och fast inredning. Det kan lösas genom ett eget bostadsrättstillägg eller genom ett kollektivt upplägg som föreningen har tecknat.' },
        { heading: 'Har föreningen kollektivt bostadsrättstillägg?', body: 'Fråga styrelsen eller förvaltaren innan du lägger till ett eget tillägg. Kontrollera vilket bolag och vilka villkor som gäller, vad som omfattas och hur en skada ska anmälas. Ett kollektivt upplägg kan göra ett separat tillägg onödigt, men din vanliga hemförsäkring behövs fortfarande för bland annat lösöre och andra delar av hemförsäkringsskyddet.' },
        { heading: 'Vad kostar bostadsrättstillägg?', body: 'Kostnaden går inte att bedöma fristående från övriga villkor. Tillägget kan ligga i din egen försäkringspremie eller vara kollektivt via föreningen. Jämför därför total premie för ett likvärdigt skydd och undvik att betala dubbelt för samma bostadsrättsskydd.' },
        { heading: 'Jämför självrisk och åldersavdrag – inte bara premie', body: 'Två försäkringar med liknande pris kan ge olika ersättning vid exempelvis vatten- eller brandskada. Kontrollera självrisk, åldersavdrag, ersättningsgränser och viktiga undantag innan du avgör vilket alternativ som är mest prisvärt.' },
        { heading: 'Hemförsäkringen behöver fortfarande passa hushållet', body: 'Bostadsrättsskyddet är bara en del av helheten. Kontrollera också vem som omfattas av hemförsäkringen samt skydd för lösöre, ansvar, rättsskydd, resor och eventuella allrisktillägg.' }
      ]}
      extraUtility={<CondoInsuranceCheck/>}
      utility={{href:'/forsakring/hemforsakring-skyddskoll/',eyebrow:'VERKTYG · SKYDDSKOLL',title:'Kontrollera skyddet innan du jämför pris',body:'Tre korta frågor hjälper dig se vilka villkor som förtjänar extra kontroll utifrån boende och hushåll.',cta:'Gör skyddskollen'}}
      related={[{ href: '/forsakring/jamfor-hemforsakring/', label: 'Jämför hemförsäkring' }, { href: '/forsakring/vad-kostar-hemforsakring/', label: 'Vad kostar hemförsäkring?' }, { href: '/forsakring/hemforsakring-hyresratt/', label: 'Hemförsäkring för hyresrätt' }, { href: '/forsakring/hemforsakring-skyddskoll/', label: 'Gör skyddskollen för hemförsäkring' }, { href: 'https://www.konsumenternas.se/konsumentstod/jamforelser/boendeforsakringar/jamfor-hemforsakringar/jamfor-villkor/', label: 'Källa: Konsumenternas jämförelse av hemförsäkringar – innehåll och pris' }]}
    />
  );
}
