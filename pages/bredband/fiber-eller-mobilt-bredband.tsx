import Head from 'next/head';
import SmartSelector, { SelectorQuestion, SelectorResult } from '../../components/SmartSelector';

const questions: SelectorQuestion[] = [
  {
    title: 'Hur många använder bredbandet samtidigt?',
    help: 'Fler samtidiga användare ökar värdet av en stabil anslutning med jämn kapacitet.',
    options: [
      { label: '1 person', points: 0 },
      { label: '2 personer', points: 1 },
      { label: '3–4 personer', points: 3 },
      { label: '5+ personer', points: 4 },
    ],
  },
  {
    title: 'Hur känslig är du för variation i anslutningen?',
    help: 'Mobil kapacitet kan variera mer med signal, plats och belastning än en fast fiberanslutning.',
    options: [
      { label: 'Variation gör inget', points: -2 },
      { label: 'Lite variation är okej', points: 0 },
      { label: 'Jag vill ha jämn anslutning', points: 3 },
      { label: 'Stabilitet är avgörande', points: 5 },
    ],
  },
  {
    title: 'Vad gör ni mest hemma?',
    help: 'Hemarbete, gaming och många samtidiga videoströmmar ställer större krav på stabilitet och kapacitet.',
    options: [
      { label: 'Surf och vanlig streaming', points: 0 },
      { label: 'Flera samtidiga streams', points: 2 },
      { label: 'Gaming / videosamtal', points: 3 },
      { label: 'Hemarbete + gaming + streaming', points: 5 },
    ],
  },
  {
    title: 'Hur bra mobil signal har du där routern ska stå?',
    help: 'För mobilt bredband är faktisk signal på adressen central. Testa helst på plats och vid olika tider.',
    options: [
      { label: 'Mycket bra 5G', points: -4 },
      { label: 'Bra 4G/5G', points: -2 },
      { label: 'Osäker / varierar', points: 2 },
      { label: 'Svag signal', points: 5 },
    ],
  },
  {
    title: 'Vad värderar du högst?',
    help: 'Mobilt kan ge flexibilitet. Fiber har ofta ett övertag när jämn prestanda är viktigare.',
    options: [
      { label: 'Flexibilitet och enkel installation', points: -3 },
      { label: 'Lägsta totalpris', points: -1 },
      { label: 'Balans', points: 1 },
      { label: 'Stabilitet och marginal', points: 4 },
    ],
  },
];

const results: SelectorResult[] = [
  {
    min: -20,
    label: 'UPPKOPPLINGSPROFIL · MOBIL KANDIDAT',
    title: '5G/mobilt bredband är värt att testa först',
    text: 'Dina svar pekar mot ett flexibelt hushåll med bra förutsättningar för mobil uppkoppling. Kontrollera faktisk signal, normal hastighet och datavillkor innan du bestämmer dig.',
    bullets: ['Testa på den faktiska routerplatsen', 'Mät vid både lugn och belastad tid', 'Jämför router, data och ordinarie pris'],
    cta: 'Läs om 5G-bredband',
    href: '/bredband/5g-bredband/',
  },
  {
    min: 5,
    label: 'UPPKOPPLINGSPROFIL · JÄMFÖR BÅDA',
    title: 'Du bör jämföra fiber och mobilt sida vid sida',
    text: 'Du har både behov som talar för stabilitet och faktorer som gör mobilt intressant. Adressens utbud och verklig mobilprestanda bör avgöra.',
    bullets: ['Kontrollera vilka fasta alternativ som finns på adressen', 'Testa mobil signal och faktisk hastighet', 'Räkna totalpris inklusive router och kampanjvillkor'],
    cta: 'Se bredband på adressen',
    href: '/bredband/bredband-pa-min-adress/',
  },
  {
    min: 12,
    label: 'UPPKOPPLINGSPROFIL · FIBER',
    title: 'Fiber passar din kravprofil bättre',
    text: 'Hög samtidighet, stabilitetskrav eller svag mobil signal gör att fiber har tydliga fördelar för din profil. Jämför ändå rätt hastighetsnivå så att du inte överköper kapacitet.',
    bullets: ['Börja med tillgängliga fiberalternativ på adressen', 'Välj hastighet efter faktisk samtidighet', 'Jämför ordinarie pris och bindningstid'],
    cta: 'Jämför fiber på adressen',
    href: '/bredband/bredband-pa-min-adress/',
  },
];

export default function FiberOrMobileTool() {
  return (
    <>
      <Head>
        <title>Fiber eller 5G/mobilt bredband? Test 2026 | Sänk Kostnaden</title>
        <meta name='description' content='Gör testet: fiber eller 5G/mobilt bredband? Jämför hushåll, stabilitetskrav, användning och mobil signal och få en personlig uppkopplingsprofil.' />
        <link rel='canonical' href='https://sankkostnaden.se/bredband/fiber-eller-mobilt-bredband/' /><script type='application/ld+json' dangerouslySetInnerHTML={{__html: JSON.stringify({'@context':'https://schema.org','@type':'WebPage',name:"Fiber eller 5G/mobilt bredband? Test 2026",description:"Gör testet: fiber eller 5G/mobilt bredband? Jämför hushåll, stabilitetskrav, användning och mobil signal och få en personlig uppkopplingsprofil.",url:"https://sankkostnaden.se/bredband/fiber-eller-mobilt-bredband/",isPartOf:{'@type':'WebSite',name:'Sänk Kostnaden',url:'https://sankkostnaden.se/'}})}} />
        <meta name='robots' content='index,follow' />
      </Head>
      <SmartSelector eyebrow='SMARTVAL · FIBER ELLER 5G' title='Fiber eller 5G – vad passar ditt hem?' intro='Det finns inget universellt rätt svar. Testet väger hushållets samtidighet, stabilitetskrav, användning och mobil signal och pekar ut vilket spår du bör undersöka först.' questions={questions} results={results} disclaimer='Resultatet är en behovsprofil. Mobil prestanda måste testas på den faktiska adressen och bredbandsutbud varierar mellan nät och fastigheter.' backHref='/bredband/' backLabel='Bredband' />
    </>
  );
}
