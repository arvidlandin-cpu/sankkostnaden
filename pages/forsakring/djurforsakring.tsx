import IntentGuide from '../../components/IntentGuide';

export default function Page() {
  return <IntentGuide
    title='Billig djurförsäkring 2026 – jämför pris, självrisk och skydd'
    description='Så jämför du djurförsäkring utan att stirra dig blind på premien. Kontrollera självrisk, veterinärvårdsbelopp, undantag och total årskostnad.'
    kicker='JÄMFÖR DJURFÖRSÄKRING'
    canonical='https://sankkostnaden.se/forsakring/djurforsakring/'
    category='forsakring'
    bullets={[
      'Jämför årspremie och både fast och rörlig självrisk',
      'Kontrollera veterinärvårdsbelopp och viktiga ersättningstak',
      'Läs undantag, karenstid och villkor för tidigare besvär',
      'Jämför likvärdigt skydd innan du bedömer vilket alternativ som är billigare',
    ]}
    sections={[
      { heading: 'Billigast premie är inte alltid lägst kostnad', body: 'En låg premie kan kombineras med högre självrisk eller lägre ersättningstak. Jämför därför den löpande kostnaden tillsammans med den ekonomiska risk du själv tar om djuret behöver vård.' },
      { heading: 'Jämför samma typ av djur och skydd', body: 'Pris och villkor påverkas bland annat av djurslag, ras, ålder och vald omfattning. Det går därför inte att utse ett enda billigast alternativ för alla. Ta in pris för ditt eget djur och jämför motsvarande skydd.' },
      { heading: 'Kontrollera villkoren före byte', body: 'Läs särskilt regler om karens, reservationer och tidigare sjukdomar eller skador. Säg inte upp ett befintligt skydd innan du har kontrollerat att det nya försäkringsskyddet gäller på det sätt du behöver.' },
    ]}
    related={[
      { href: '/forsakring/jamfor-forsakring/', label: 'Så jämför du försäkring' },
      { href: '/forsakring/vad-kostar-hemforsakring/', label: 'Vad kostar hemförsäkring?' },
      { href: '/forsakring/', label: 'Alla försäkringsguider' },
    ]}
  />;
}
