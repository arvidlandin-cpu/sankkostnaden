import IntentGuide from '../../components/IntentGuide';

export default function Page() {
  return (
    <IntentGuide
      title='Fiberbredband 2026 – jämför hastighet och pris'
      description='Så jämför du fiberbredband efter tillgängliga operatörer, hastighet, kampanjpris, ordinarie pris, router och bindningstid.'
      kicker='FIBERBREDBAND'
      canonical='https://sankkostnaden.se/bredband/fiber/'
      category='bredband'
      intent='fiber'
      bullets={['Börja med vilka operatörer som finns på adressen', 'Välj hastighet efter faktisk användning', 'Jämför pris över minst 12 månader', 'Kontrollera router, startavgift och bindningstid']}
      sections={[{ heading: 'Adressen bestämmer utbudet', body: 'Fiberutbudet kan skilja mellan olika nät och fastigheter. Börja därför med vad som faktiskt går att beställa innan du jämför priser och hastigheter.' }, { heading: '100 Mbit/s kan räcka längre än många tror', body: 'Vanlig streaming, surf och videosamtal kräver ofta mindre kapacitet än de högsta abonnemangen erbjuder. Ett lägre hastighetssteg kan därför ge en återkommande besparing utan märkbar försämring.' }, { heading: 'Jämför ordinarie pris efter kampanjen', body: 'Räkna hela första året och gärna även kostnaden därefter. Lägg till eventuella startavgifter och routerkostnader för att få en rättvis jämförelse.' }, { heading: 'Wifi och fiber är inte samma sak', body: 'Om hastigheten är dålig i vissa rum kan problemet ligga i hemnätet snarare än fiberabonnemanget. Testa nära routern eller med kabel innan du uppgraderar hastigheten.' }]}
      related={[{ href: '/bredband/bredband-pa-min-adress/', label: 'Bredband på min adress' }, { href: '/bredband/vilken-hastighet-behover-jag/', label: 'Hur snabbt bredband behöver du?' }, { href: '/bredband/billigaste-bredbandet/', label: 'Billigaste bredbandet 2026' }]}
    />
  );
}
