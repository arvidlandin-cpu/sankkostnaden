import IntentGuide from '../../components/IntentGuide';
import CondoInsuranceCheck from '../../components/CondoInsuranceCheck';
import type { CSSProperties } from 'react';

const exampleCell: CSSProperties = { padding: '12px 6px', borderBottom: '1px solid var(--guide-line)', textAlign: 'left', verticalAlign: 'top', overflowWrap: 'break-word' };

function PriceExample() {
  return <section className='note' aria-labelledby='bostadsratt-price-answer' data-testid='bostadsratt-price-example' style={{ marginTop: 0 }}>
    <h2 id='bostadsratt-price-answer' style={{ lineHeight: 1.2, margin: '0 0 16px' }}>Vad kostar hemförsäkring för en bostadsrätt?</h2>
    <p>Det finns inget standardpris som gäller alla. Din premie beror bland annat på bostadens storlek, område, hushåll och valt skydd. Be om personliga prisuppgifter för samma bostad och omfattning. Kontrollera om bostadsrättstillägget ingår i premien eller finns genom föreningen, och jämför hela det första året.</p>
    <details>
      <summary style={{ cursor: 'pointer', minHeight: 48, padding: '12px 0', fontWeight: 750 }}>Se räkneexemplet: lågt startpris eller jämn månadspremie?</summary>
      <p><strong>Räkneexempel med antagna belopp.</strong> Detta är inga offerter eller aktuella priser från våra partners. Vi antar samma hushåll och likvärdigt skydd, inklusive det bostadsrättsskydd som behövs, utan ytterligare avgifter eller tillägg.</p>
      <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', fontSize: 14 }}>
        <caption style={{ textAlign: 'left', fontWeight: 750, padding: '10px 0' }}>Premie för samma tolv månader – illustrativ jämförelse</caption>
        <thead><tr><th scope='col' style={{ ...exampleCell, width: '40%' }}>Period</th><th scope='col' style={exampleCell}>Alternativ A</th><th scope='col' style={exampleCell}>Alternativ B</th></tr></thead>
        <tbody>
          <tr><th scope='row' style={exampleCell}>Månad 1–6</th><td style={exampleCell}>180 kr/mån</td><td style={exampleCell}>230 kr/mån</td></tr>
          <tr><th scope='row' style={exampleCell}>Månad 7–12</th><td style={exampleCell}>260 kr/mån</td><td style={exampleCell}>230 kr/mån</td></tr>
          <tr><th scope='row' style={exampleCell}>Summa första året</th><td style={exampleCell}><strong>2 640 kr</strong></td><td style={exampleCell}><strong>2 760 kr</strong></td></tr>
          <tr><th scope='row' style={exampleCell}>Månadspris efter rabatten</th><td style={exampleCell}>260 kr</td><td style={exampleCell}>230 kr</td></tr>
        </tbody>
      </table>
      <p>Uträkning A: 6 × 180 + 6 × 260 = 2 640 kr. Uträkning B: 12 × 230 = 2 760 kr. A kostar alltså 120 kr mindre första året, men månadspriset efter rabatten är 30 kr högre. Framtida premier kan ändras.</p>
      <p><strong>Jämför självrisk och åldersavdrag separat.</strong> De kan påverka din kostnad vid en skada och ingår inte i tabellens premie. Byt ut exempelbeloppen mot dina egna offerter och kontrollera omfattningen innan du jämför slutsummorna.</p>
    </details>
    <p><strong>Ett kollektivt bostadsrättstillägg genom föreningen ersätter inte din vanliga hemförsäkring.</strong> Läs mer om skillnaden och kontrollera ditt skydd i guiden nedan.</p>
    <p style={{ fontSize: 13 }}>Av Sänk Kostnaden. Källor kontrollerade 10 november 2026: <a href='https://www.konsumenternas.se/konsumentstod/jamforelser/boendeforsakringar/jamfor-hemforsakringar/jamfor-villkor/'>Konsumenternas om pris och villkor</a> och <a href='https://www.konsumenternas.se/forsakringar/boendeforsakringar/bostadsrattsforsakringar/'>bostadsrättsförsäkring</a>. Räkneexemplet är vårt eget.</p>
  </section>;
}

export default function Page() {
  return (
    <IntentGuide
      title='Hemförsäkring bostadsrätt 2026 – pris, skydd och självrisk'
      description='Hemförsäkring bostadsrätt 2026: se vad som påverkar priset och jämför självrisk, bostadsrättstillägg, lösöre, allrisk och andra viktiga villkor.'
      kicker='HEMFÖRSÄKRING BOSTADSRÄTT'
      canonical='https://sankkostnaden.se/forsakring/hemforsakring-bostadsratt/'
      category='forsakring' intent='home'
      intro={<PriceExample/>}
      bullets={['Kontrollera om föreningen har kollektivt bostadsrättstillägg', 'Jämför personlig premie för hela hemförsäkringen, inte bara tillägget', 'Jämför premie, självrisk och åldersavdrag tillsammans', 'Kontrollera lösöre, allrisk, reseskydd och andra tillägg']}
      sections={[
        { heading: 'Så jämför du två egna offerter på samma villkor', body: 'Be om två offerter för samma bostad, hushåll och önskade skydd. Jämför samma tolvmånadersperiod: använd angiven årspremie, eller summera de månadsbelopp som faktiskt gäller under perioden. Lägg bara till obligatoriska avgifter och valda tillägg som inte redan ingår. Skriv upp priset efter eventuell rabatt separat; ett förstaårspris säger inte vad nästa år kostar. Anteckna sedan självrisk, åldersavdrag och ersättningsgränser bredvid priset. Lägg inte till dessa som säkra årskostnader: de påverkar eventuell ersättning vid en skada och kan skilja sig mellan skadefall. Lägre premie betyder därför inte automatiskt likvärdigt skydd. Metoden är vår jämförelsechecklista, inte en offert eller besparingsprognos. Konsumenternas jämförelse av hemförsäkringar, länkad under Läs vidare, förklarar varför personliga prisuppgifter och försäkringens innehåll behöver jämföras tillsammans.' },
        { heading: 'Behöver jag bostadsrättstillägg?', body: 'Som bostadsrättshavare behöver du kontrollera att det finns ett försäkringsskydd för delar av lägenheten som du har underhållsansvar för, till exempel ytskikt och fast inredning. Det kan lösas genom ett eget bostadsrättstillägg eller genom ett kollektivt upplägg som föreningen har tecknat.' },
        { heading: 'Har föreningen kollektivt bostadsrättstillägg?', body: 'Fråga styrelsen eller förvaltaren innan du lägger till ett eget tillägg. Kontrollera vilket bolag och vilka villkor som gäller, vad som omfattas och hur en skada ska anmälas. Ett kollektivt upplägg kan göra ett separat tillägg onödigt, men din vanliga hemförsäkring behövs fortfarande för bland annat lösöre och andra delar av hemförsäkringsskyddet.' },
        { heading: 'Vad kostar bostadsrättstillägg?', body: 'Kostnaden går inte att bedöma fristående från övriga villkor. Tillägget kan ligga i din egen försäkringspremie eller vara kollektivt via föreningen. Kontrollera om skydden överlappar. Säg inte upp ett eget tillägg innan du har jämfört föreningens omfattning, självrisk, åldersavdrag och skadehantering. Jämför total premie för ett likvärdigt skydd.' },
        { heading: 'Jämför självrisk och åldersavdrag – inte bara premie', body: 'Två försäkringar med liknande pris kan ge olika ersättning vid exempelvis vatten- eller brandskada. Kontrollera självrisk, åldersavdrag, ersättningsgränser och viktiga undantag innan du avgör vilket alternativ som är mest prisvärt.' },
        { heading: 'Hemförsäkringen behöver fortfarande passa hushållet', body: 'Bostadsrättsskyddet är bara en del av helheten. Kontrollera också vem som omfattas av hemförsäkringen samt skydd för lösöre, ansvar, rättsskydd, resor och eventuella allrisktillägg.' }
      ]}
      extraUtility={<CondoInsuranceCheck/>}
      utility={{href:'/forsakring/hemforsakring-skyddskoll/',eyebrow:'VERKTYG · SKYDDSKOLL',title:'Kontrollera skyddet innan du jämför pris',body:'Tre korta frågor hjälper dig se vilka villkor som förtjänar extra kontroll utifrån boende och hushåll.',cta:'Gör skyddskollen'}}
      related={[{ href: '/forsakring/jamfor-hemforsakring/', label: 'Jämför hemförsäkring' }, { href: '/forsakring/vad-kostar-hemforsakring/', label: 'Vad kostar hemförsäkring?' }, { href: '/forsakring/hemforsakring-hyresratt/', label: 'Hemförsäkring för hyresrätt' }, { href: '/forsakring/hemforsakring-skyddskoll/', label: 'Gör skyddskollen för hemförsäkring' }, { href: 'https://www.konsumenternas.se/konsumentstod/jamforelser/boendeforsakringar/jamfor-hemforsakringar/jamfor-villkor/', label: 'Källa: Konsumenternas jämförelse av hemförsäkringar – innehåll och pris' }]}
    />
  );
}
