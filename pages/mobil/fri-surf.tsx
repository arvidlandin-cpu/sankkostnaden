import Head from 'next/head';
import SmartSelector, { SelectorQuestion, SelectorResult } from '../../components/SmartSelector';

const questions: SelectorQuestion[] = [
  {
    title: 'Hur mycket mobildata använder du en vanlig månad?',
    help: 'Titta gärna på de senaste 3–6 månaderna i mobilen eller hos operatören.',
    options: [
      { label: 'Under 10 GB', points: 0 },
      { label: '10–30 GB', points: 1 },
      { label: '30–100 GB', points: 3 },
      { label: 'Över 100 GB / varierar kraftigt', points: 5 },
    ],
  },
  {
    title: 'Hur ofta streamar du video på mobildata?',
    help: 'Video är en av de tydligaste orsakerna till att en stor datapott kan bli relevant.',
    options: [
      { label: 'Nästan aldrig', points: 0 },
      { label: 'Någon gång i veckan', points: 1 },
      { label: 'Nästan varje dag', points: 3 },
      { label: 'Mycket varje dag', points: 4 },
    ],
  },
  {
    title: 'Delar du internet från mobilen?',
    help: 'Hotspot till dator, surfplatta eller andra enheter kan snabbt öka databehovet.',
    options: [
      { label: 'Aldrig', points: 0 },
      { label: 'I nödfall', points: 1 },
      { label: 'Regelbundet', points: 3 },
      { label: 'Mobilen ersätter ofta wifi', points: 5 },
    ],
  },
  {
    title: 'Hur mycket wifi har du i vardagen?',
    help: 'Bra wifi hemma och på jobbet minskar ofta värdet av att betala extra för obegränsad mobildata.',
    options: [
      { label: 'Wifi nästan överallt', points: -2 },
      { label: 'Wifi hemma', points: 0 },
      { label: 'Ganska lite wifi', points: 2 },
      { label: 'Jag förlitar mig på mobilnätet', points: 4 },
    ],
  },
  {
    title: 'Vad är viktigast för dig?',
    help: 'Fri surf köper främst marginal och enkelhet. Frågan är om det är värt merkostnaden för dig.',
    options: [
      { label: 'Lägsta möjliga kostnad', points: -2 },
      { label: 'Bra balans pris/surf', points: 0 },
      { label: 'Slippa tänka på surfpotten', points: 2 },
      { label: 'Maximal frihet', points: 3 },
    ],
  },
];

const results: SelectorResult[] = [
  {
    min: -10,
    label: 'FRI-SURF-PROFIL · LÅG NYTTA',
    title: 'Fri surf ser ut som överkapacitet för dig',
    text: 'Din användning ger få signaler om att obegränsad data skapar tillräcklig nytta. Börja med en mindre datapott och jämför ordinarie pris.',
    bullets: ['Kontrollera faktisk dataanvändning över flera månader', 'Lämna rimlig marginal för resor och toppmånader', 'Jämför priset mot nästa större surfnivå'],
    cta: 'Jämför billigare mobilabonnemang',
    href: '/mobil/billigaste-mobilabonnemanget/',
  },
  {
    min: 6,
    label: 'FRI-SURF-PROFIL · GRÄNSLAND',
    title: 'Stor datapott kan vara smartare än fri surf',
    text: 'Du använder en hel del data, men signalerna är inte entydiga. Jämför en stor begränsad datapott mot fri surf och räkna merkostnaden över tolv månader.',
    bullets: ['Jämför stor datapott och fri surf sida vid sida', 'Kontrollera pris efter kampanj', 'Se villkor för EU-surf och eventuell hastighetsbegränsning'],
    cta: 'Jämför mobilabonnemang',
    href: '/mobil/billigaste-mobilabonnemanget/',
  },
  {
    min: 13,
    label: 'FRI-SURF-PROFIL · HÖG NYTTA',
    title: 'Fri surf kan vara rationellt för dig',
    text: 'Hög användning, streaming eller hotspot gör att obegränsad data kan ha ett verkligt värde. Nästa steg är att jämföra pris, nät och villkor – inte bara ordet fri.',
    bullets: ['Kontrollera nät och täckning där du använder mest data', 'Läs hastighets- och roamingvillkor', 'Jämför merkostnaden mot en stor datapott'],
    cta: 'Jämför alternativ med mycket surf',
    href: '/mobil/billigaste-mobilabonnemanget/',
  },
];

export default function FreeDataTool() {
  return (
    <>
      <Head>
        <title>Är fri surf värt det? Test 2026 | Sänk Kostnaden</title>
        <meta name='description' content='Är fri surf värt priset? Svara på fem frågor om data, streaming, hotspot och wifi och få en personlig fri-surf-profil.' />
        <link rel='canonical' href='https://sankkostnaden.se/mobil/fri-surf/' /><script type='application/ld+json' dangerouslySetInnerHTML={{__html: JSON.stringify({'@context':'https://schema.org','@type':'WebPage',name:"Är fri surf värt det? Test 2026",description:"Är fri surf värt priset? Svara på fem frågor om data, streaming, hotspot och wifi och få en personlig fri-surf-profil.",url:"https://sankkostnaden.se/mobil/fri-surf/",isPartOf:{'@type':'WebSite',name:'Sänk Kostnaden',url:'https://sankkostnaden.se/'}})}} />
        <meta name='robots' content='index,follow' />
      </Head>
      <SmartSelector eyebrow='SMARTVAL · FRI SURF' title='Är fri surf faktiskt värt det för dig?' intro='Obegränsad data är bekvämt – men bara prisvärt om du använder friheten. Fem frågor väger din verkliga användning mot risken att betala för kapacitet du aldrig behöver.' questions={questions} results={results} disclaimer='Testet bedömer behov, inte aktuella operatörspriser. Kontrollera alltid ordinarie pris, nät, roaming och villkor före byte.' />
    </>
  );
}
