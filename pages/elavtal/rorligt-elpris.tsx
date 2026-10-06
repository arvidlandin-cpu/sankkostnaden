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
      bullets={['Energimarknadsinspektionen använder nu termen månadspris för den här avtalsformen', 'Priset ändras månadsvis och sätts i efterhand', 'Påslag och fasta avgifter skiljer mellan avtal', 'Jämför med din egen årsförbrukning']}
      sections={[{ heading: 'Rörligt elpris kallas numera månadspris av Ei', body: 'Energimarknadsinspektionen använder sedan 2026 benämningen månadspris för den avtalsform som ofta kallats rörligt elpris. Priset per kilowattimme ändras en gång per månad och sätts i efterhand. Det är därför inte samma sak som kvartspris, där tidpunkten för din egen elanvändning påverkar elhandelskostnaden.' }, { heading: 'Vad betyder rörligt elpris?', body: 'Ett månadsprisavtal, tidigare ofta kallat rörligt elavtal, följer marknadsutvecklingen utan att låsa energipriset under en längre period. Din faktiska kostnad påverkas dessutom av elhandlarens påslag och fasta avgifter.' }, { heading: 'Vad ingår i kostnaden för ett rörligt elavtal?', body: 'Utöver själva energipriset kan elhandlaren ta ett påslag per kilowattimme och en fast månads- eller årsavgift. Jämför dessa delar separat och använd samma årsförbrukning när du räknar på alternativen.' }, { heading: 'När blir påslaget viktigt?', body: 'Ju större årsförbrukning, desto större effekt får varje öre per kilowattimme. Vid lägre förbrukning kan en fast månadsavgift väga relativt tyngre.' }, { heading: 'Rörligt är inte samma sak som kvartspris', body: 'Med kvartspris kopplas kostnaden närmare tidpunkten för förbrukningen. Ett traditionellt rörligt avtal fungerar annorlunda, så kontrollera avtalsformen innan du jämför priser.' }]}
      utility={{href:'/verktyg/elavtalskostnad/?src=rorligt_elpris',eyebrow:'VERKTYG · ELAVTALSKOSTNAD',title:'Jämför avgift och pris på samma förbrukning',body:'För rörligt pris blir resultatet en ögonblicksbild på den prisgrund du matar in – inte en prognos för framtida marknadspris.',cta:'Öppna elkalkylen'}}
      related={[{ href: '/elavtal/rorligt-fast-kvartspris/', label: 'Rörligt, fast eller kvartspris?' }, { href: '/elavtal/billigaste-elavtalet/', label: 'Billigaste elavtalet' }, { href: '/elavtal/sa-laser-du-elfakturan/', label: 'Så läser du elfakturan' }]}
    />
  );
}
