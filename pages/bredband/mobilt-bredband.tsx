import IntentGuide from '../../components/IntentGuide';

export default function Page() {
  return (
    <IntentGuide
      title='Mobilt bredband 2026 – så jämför du pris, 5G och surf'
      description='Jämför mobilt bredband efter täckning, 4G/5G, datamängd, router, bindningstid och verklig månadskostnad.'
      kicker='MOBILT BREDBAND'
      canonical='https://sankkostnaden.se/bredband/mobilt-bredband/'
      category='bredband'
      intent='mobile-broadband'
      bullets={['Kontrollera täckningen där routern ska stå', 'Jämför fri data med begränsad datamängd', 'Ta med routerkostnad och bindningstid', 'Bedöm normal hastighet – inte bara teoretisk maxfart']}
      sections={[{ heading: 'Täckningen avgör mer än reklamhastigheten', body: 'Mobilt bredband delar kapacitet med mobilnätet och prestandan påverkas av plats, signal och belastning. Kontrollera därför hur nätet fungerar där tjänsten faktiskt ska användas.' }, { heading: 'Fri data kan vara viktig för ett helt hushåll', body: 'Streaming, uppdateringar och flera användare kan snabbt öka datamängden. Jämför därför inte bara månadspriset utan även eventuell datagräns och vad extra data kostar.' }, { heading: 'Jämför med fiber på samma behov', body: 'Mobilt bredband kan vara prisvärt där fast bredband är dyrt eller saknas. Där fiber finns bör du jämföra totalpris, stabilitet och hastighet för den nivå hushållet faktiskt behöver.' }]}
      related={[{ href: '/bredband/fiber-eller-mobilt-bredband/', label: 'Fiber eller mobilt bredband?' }, { href: '/bredband/bredband-pa-min-adress/', label: 'Bredband på min adress' }, { href: '/bredband/billigaste-bredbandet/', label: 'Billigaste bredbandet' }]}
    />
  );
}
