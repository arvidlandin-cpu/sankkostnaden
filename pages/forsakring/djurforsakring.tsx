import IntentGuide from '../../components/IntentGuide';

export default function Page() {
  return <IntentGuide
    title='Jämför djurförsäkring 2026 – pris, självrisk och skydd'
    description='Jämför djurförsäkring 2026 för hund eller katt. Kontrollera premie, självrisk, veterinärvårdsbelopp, ersättningstak, karens och viktiga undantag.'
    kicker='JÄMFÖR DJURFÖRSÄKRING'
    canonical='https://sankkostnaden.se/forsakring/djurforsakring/'
    category='forsakring'
    intent='pet'
    bullets={[
      'Jämför årspremie och både fast och rörlig självrisk',
      'Kontrollera veterinärvårdsbelopp och viktiga ersättningstak',
      'Läs undantag, karenstid och villkor för tidigare besvär',
      'Jämför likvärdigt skydd innan du bedömer vilket alternativ som är billigare',
    ]}
    sections={[
      { heading: 'Vad kostar djurförsäkring?', body: 'Premien sätts individuellt och påverkas bland annat av djurslag, ras, ålder, bostadsort, vald självrisk och veterinärvårdsbelopp. Hämta därför pris för just ditt djur och jämför likvärdig omfattning.' },{ heading: 'Billigast premie är inte alltid lägst kostnad', body: 'En låg premie kan kombineras med högre självrisk eller lägre ersättningstak. Jämför därför den löpande kostnaden tillsammans med den ekonomiska risk du själv tar om djuret behöver vård.' },
      { heading: 'Jämför samma typ av djur och skydd', body: 'Pris och villkor påverkas bland annat av djurslag, ras, ålder och vald omfattning. Det går därför inte att utse ett enda billigast alternativ för alla. Ta in pris för ditt eget djur och jämför motsvarande skydd.' },
      { heading: 'Hundförsäkring och kattförsäkring behöver jämföras var för sig', body: 'Premie, ersättningsnivåer och villkor kan skilja mellan hund och katt och även mellan raser och åldrar. Jämför därför erbjudanden för just ditt djur i stället för att utgå från generella prisexempel.' },
      { heading: 'Kontrollera villkoren före byte', body: 'Läs särskilt regler om karens, reservationer och tidigare sjukdomar eller skador. Säg inte upp ett befintligt skydd innan du har kontrollerat att det nya försäkringsskyddet gäller på det sätt du behöver.' },
    ]}
    related={[
      { href: '/forsakring/jamfor-forsakring/', label: 'Så jämför du försäkring' },{ href: '/forsakring/', label: 'Försäkringsguider 2026' },
      { href: '/forsakring/vad-kostar-hemforsakring/', label: 'Vad kostar hemförsäkring?' },
    ]}
  />;
}
