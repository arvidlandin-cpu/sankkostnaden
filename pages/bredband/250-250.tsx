import IntentGuide from '../../components/IntentGuide';

export default function Page() {
  return (
    <IntentGuide
      title='Bredband 250/250 – när är 250 Mbit/s värt priset?'
      description='Guide till bredband 250/250 Mbit/s: vilka hushåll som har nytta av hastigheten och hur du jämför pris, wifi och årskostnad.'
      kicker='250/250 MBIT/S'
      canonical='https://sankkostnaden.se/bredband/250-250/'
      category='bredband'
      bullets={['Passar ofta hushåll med flera samtidiga användare', 'Jämför merkostnaden mot 100/100', 'Kontrollera wifi innan du uppgraderar', 'Räkna kampanj och ordinarie pris över 12 månader']}
      sections={[{ heading: 'När kan 250/250 vara rimligt?', body: 'Flera samtidiga videoströmmar, distansarbete, spel och större nedladdningar kan göra 250 Mbit/s bekvämt. För ett mindre hushåll med normal användning kan 100/100 samtidigt vara fullt tillräckligt.' }, { heading: 'Jämför merkostnaden, inte bara hastigheten', body: 'Om 250/250 kostar 100 kronor mer per månad än en nivå som redan täcker behovet blir skillnaden 1 200 kronor per år. Värdera därför den praktiska nyttan mot årsbeloppet.' }, { heading: 'Wifi kan vara flaskhalsen', body: 'Om anslutningen bara känns långsam långt från routern hjälper inte alltid ett snabbare abonnemang. Testa nära routern eller med kabel innan du köper mer kapacitet.' }]}
      related={[{ href: '/bredband/100-100/', label: 'Bredband 100/100' }, { href: '/bredband/500-500/', label: 'Bredband 500/500' }, { href: '/bredband/billigaste-bredbandet/', label: 'Billigaste bredbandet 2026' }]}
    />
  );
}
