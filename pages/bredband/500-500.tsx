import IntentGuide from '../../components/IntentGuide';

export default function Page() {
  return (
    <IntentGuide
      title='Bredband 500/500 – behöver du 500 Mbit/s?'
      description='Guide till bredband 500/500 Mbit/s: när hastigheten gör skillnad och hur du jämför 500 Mbit/s med billigare alternativ.'
      kicker='500/500 MBIT/S'
      canonical='https://sankkostnaden.se/bredband/500-500/'
      category='bredband'
      bullets={['Relevant vid många samtidiga användare och stora filer', 'Jämför mot 250/250 innan du väljer', 'Säkerställ att router och wifi klarar hastigheten', 'Räkna verklig kostnad efter kampanj']}
      sections={[{ heading: 'Vem har nytta av 500/500?', body: '500 Mbit/s ger gott om kapacitet för stora hushåll, många samtidiga aktiviteter och frekventa stora överföringar. Vanlig streaming och surf kräver däremot betydligt mindre.' }, { heading: 'Betala bara för en märkbar förbättring', body: 'Jämför priset med 250/250 och fundera på om hushållet faktiskt märker skillnaden. En högre siffra i avtalet är inte en besparing om kapaciteten står oanvänd.' }, { heading: 'Hela hemnätet måste hänga med', body: 'Äldre router, svag wifi-täckning eller långsamma klienter kan begränsa upplevd hastighet. Kontrollera detta innan du drar slutsatsen att abonnemanget är för långsamt.' }]}
      related={[{ href: '/bredband/250-250/', label: 'Bredband 250/250' }, { href: '/bredband/1000-1000/', label: 'Bredband 1000/1000' }, { href: '/bredband/bredband-pa-min-adress/', label: 'Bredband på min adress' }]}
    />
  );
}
