import IntentGuide from '../../components/IntentGuide';

export default function Page() {
  return (
    <IntentGuide
      title='Rörligt elpris 2026 – så fungerar rörligt elavtal'
      description='Förstå rörligt elpris och jämför rörliga elavtal efter påslag, fast avgift, uppsägningstid och total kostnad för din förbrukning.'
      kicker='RÖRLIGT ELPRIS'
      canonical='https://sankkostnaden.se/elavtal/rorligt-elpris/'
      category='el'
      intent='electricity'
      bullets={['Priset varierar med marknaden över tid', 'Påslag och fasta avgifter skiljer mellan avtal', 'Jämför med din egen årsförbrukning', 'Kontrollera uppsägningstid och kampanjvillkor']}
      sections={[{ heading: 'Vad betyder rörligt elpris?', body: 'Ett rörligt avtal följer marknadsutvecklingen i stället för att låsa energipriset under en längre period. Din faktiska kostnad påverkas dessutom av elhandlarens påslag och fasta avgifter.' }, { heading: 'När blir påslaget viktigt?', body: 'Ju större årsförbrukning, desto större effekt får varje öre per kilowattimme. Vid lägre förbrukning kan en fast månadsavgift väga relativt tyngre.' }, { heading: 'Rörligt är inte samma sak som kvartspris', body: 'Med kvartspris kopplas kostnaden närmare tidpunkten för förbrukningen. Ett traditionellt rörligt avtal fungerar annorlunda, så kontrollera avtalsformen innan du jämför priser.' }]}
      related={[{ href: '/elavtal/rorligt-fast-kvartspris/', label: 'Rörligt, fast eller kvartspris?' }, { href: '/elavtal/billigaste-elavtalet/', label: 'Billigaste elavtalet' }, { href: '/elavtal/sa-laser-du-elfakturan/', label: 'Så läser du elfakturan' }]}
    />
  );
}
