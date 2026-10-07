import IntentGuide from '../../components/IntentGuide';

export default function Page() {
  return (
    <IntentGuide
      title='Hemförsäkring bostadsrätt 2026 – pris, skydd och självrisk'
      description='Hemförsäkring bostadsrätt 2026: se vad som påverkar priset och jämför självrisk, bostadsrättstillägg, lösöre, allrisk och andra viktiga villkor.'
      kicker='HEMFÖRSÄKRING BOSTADSRÄTT'
      canonical='https://sankkostnaden.se/forsakring/hemforsakring-bostadsratt/'
      category='forsakring' intent='home'
      bullets={['Kontrollera om föreningen har kollektivt bostadsrättstillägg', 'Säkerställ att själva bostadsrätten har rätt skydd', 'Jämför premie, självrisk och åldersavdrag tillsammans', 'Kontrollera lösöre, allrisk, reseskydd och andra tillägg']}
      sections={[
        { heading: 'Behöver jag bostadsrättstillägg?', body: 'Som bostadsrättshavare behöver du kontrollera att det finns ett försäkringsskydd för delar av lägenheten som du har underhållsansvar för, till exempel ytskikt och fast inredning. Det kan lösas genom ett eget bostadsrättstillägg eller genom ett kollektivt upplägg som föreningen har tecknat.' },
        { heading: 'Har föreningen kollektivt bostadsrättstillägg?', body: 'Fråga styrelsen eller förvaltaren innan du lägger till ett eget tillägg. Kontrollera vilket bolag och vilka villkor som gäller, vad som omfattas och hur en skada ska anmälas. Ett kollektivt upplägg kan göra ett separat tillägg onödigt, men din vanliga hemförsäkring behövs fortfarande för bland annat lösöre och andra delar av hemförsäkringsskyddet.' },
        { heading: 'Vad kostar bostadsrättstillägg?', body: 'Kostnaden går inte att bedöma fristående från övriga villkor. Tillägget kan ligga i din egen försäkringspremie eller vara kollektivt via föreningen. Jämför därför total premie för ett likvärdigt skydd och undvik att betala dubbelt för samma bostadsrättsskydd.' },
        { heading: 'Jämför självrisk och åldersavdrag – inte bara premie', body: 'Två försäkringar med liknande pris kan ge olika ersättning vid exempelvis vatten- eller brandskada. Kontrollera självrisk, åldersavdrag, ersättningsgränser och viktiga undantag innan du avgör vilket alternativ som är mest prisvärt.' },
        { heading: 'Hemförsäkringen behöver fortfarande passa hushållet', body: 'Bostadsrättsskyddet är bara en del av helheten. Kontrollera också vem som omfattas av hemförsäkringen samt skydd för lösöre, ansvar, rättsskydd, resor och eventuella allrisktillägg.' }
      ]}
      utility={{href:'/forsakring/hemforsakring-skyddskoll/',eyebrow:'VERKTYG · SKYDDSKOLL',title:'Kontrollera skyddet innan du jämför pris',body:'Tre korta frågor hjälper dig se vilka villkor som förtjänar extra kontroll utifrån boende och hushåll.',cta:'Gör skyddskollen'}}
      related={[{ href: '/forsakring/jamfor-hemforsakring/', label: 'Jämför hemförsäkring' }, { href: '/forsakring/vad-kostar-hemforsakring/', label: 'Vad kostar hemförsäkring?' }, { href: '/forsakring/hemforsakring-hyresratt/', label: 'Hemförsäkring för hyresrätt' }, { href: '/forsakring/hemforsakring-skyddskoll/', label: 'Gör skyddskollen för hemförsäkring' }]}
    />
  );
}
