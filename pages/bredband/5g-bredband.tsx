import IntentGuide from '../../components/IntentGuide';

export default function Page() {
  return (
    <IntentGuide
      title='5G-bredband 2026 – när kan det ersätta fiber?'
      description='Guide till 5G-bredband: jämför täckning, normal hastighet, datavillkor, router, stabilitet och kostnad mot fiber.'
      kicker='5G-BREDBAND'
      canonical='https://sankkostnaden.se/bredband/5g-bredband/'
      category='bredband'
      intent='mobile-broadband'
      bullets={['Kontrollera 5G-täckningen på den faktiska adressen', 'Jämför normal hastighet – inte bara maxhastighet', 'Läs villkor för data, router och bindningstid', 'Jämför totalpris och stabilitet med fiber']}
      sections={[{ heading: '5G kan vara ett riktigt hemabonnemang', body: 'Ett väl fungerande 5G-nät kan ge tillräcklig kapacitet för streaming, arbete och flera användare. Resultatet beror samtidigt mer på plats och nätbelastning än för en fast fiberanslutning.' }, { heading: 'Placeringen av routern spelar stor roll', body: 'Signalstyrka och radiomiljö påverkar den faktiska hastigheten. Testa därför där routern ska stå och jämför vid flera tidpunkter innan du bedömer om anslutningen kan ersätta fiber.' }, { heading: 'Räkna hela paketet', body: 'Ta med router, eventuell startkostnad, kampanjperiod, ordinarie månadspris och bindningstid. Ett lägre introduktionspris behöver inte innebära lägre årskostnad.' }, { heading: 'Fiber vinner ofta på förutsägbarhet', body: 'Fiber är vanligtvis mindre känsligt för mobilnätets belastning. Om stabilitet och låg fördröjning är viktigare än flexibilitet kan det motivera en högre kostnad.' }]}
      related={[{ href: '/bredband/mobilt-bredband/', label: 'Mobilt bredband 2026' }, { href: '/bredband/fiber-eller-mobilt-bredband/', label: 'Fiber eller mobilt bredband?' }, { href: '/bredband/bredband-pa-min-adress/', label: 'Bredband på min adress' }]}
    />
  );
}
