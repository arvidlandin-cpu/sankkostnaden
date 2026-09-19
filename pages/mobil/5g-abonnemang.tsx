import IntentGuide from '../../components/IntentGuide';

export default function Page() {
  return (
    <IntentGuide
      title='5G-abonnemang 2026 – behöver du betala extra för 5G?'
      description='Jämför mobilabonnemang med 5G efter nät, täckning, hastighetsvillkor, surfmängd och total månadskostnad.'
      kicker='5G-ABONNEMANG'
      canonical='https://sankkostnaden.se/mobil/5g-abonnemang/'
      category='mobil'
      intent='compare'
      bullets={['Kontrollera att både mobil och abonnemang stödjer 5G', 'Se täckningen där du faktiskt använder mobilen', 'Jämför eventuella hastighetsbegränsningar', 'Betala inte mer om 4G redan täcker behovet']}
      sections={[{ heading: '5G är inte en garanti för hög hastighet överallt', body: 'Den faktiska upplevelsen beror på nätets utbyggnad, signal, belastning och telefon. Jämför därför täckning och villkor i stället för att välja enbart efter 5G-symbolen.' }, { heading: 'De flesta vardagsappar kräver inte extrem fart', body: 'Surf, musik, sociala medier och vanlig videostreaming fungerar ofta bra även vid betydligt lägre hastigheter. 5G kan ge större marginal men behöver inte motivera ett dyrare abonnemang.' }, { heading: 'Kontrollera om hastigheten är begränsad', body: 'Två abonnemang kan båda använda 5G men ha olika villkor för maximal hastighet. Läs därför specifikationen när du jämför pris.' }]}
      related={[{ href: '/mobil/basta-mobilabonnemanget/', label: 'Bästa mobilabonnemanget 2026' }, { href: '/mobil/fri-surf/', label: 'Mobilabonnemang med fri surf' }, { href: '/mobil/billigaste-mobilabonnemanget/', label: 'Billigaste mobilabonnemanget' }]}
    />
  );
}
