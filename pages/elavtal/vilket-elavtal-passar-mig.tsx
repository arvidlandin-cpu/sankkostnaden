import Head from 'next/head';
import SmartSelector, { SelectorQuestion, SelectorResult } from '../../components/SmartSelector';

const questions: SelectorQuestion[] = [
  {
    title: 'Hur viktigt är ett förutsägbart elpris?',
    help: 'Fast pris köper mer förutsägbarhet. Rörligt och kvartspris innebär större prisvariation.',
    options: [
      { label: 'Mycket viktigt', points: -6 },
      { label: 'Ganska viktigt', points: -3 },
      { label: 'Viss variation är okej', points: 1 },
      { label: 'Variation stör mig inte', points: 3 },
    ],
  },
  {
    title: 'Kan du flytta större elanvändning i tid?',
    help: 'Exempel är elbilsladdning, varmvatten, värmepump, golvvärme, tvätt och disk.',
    options: [
      { label: 'Nej, nästan inget', points: 0 },
      { label: 'Lite grann', points: 1 },
      { label: 'Ja, flera större laster', points: 4 },
      { label: 'Ja, mycket går att styra', points: 6 },
    ],
  },
  {
    title: 'Hur sker styrningen?',
    help: 'Kvartspris blir mer relevant när större laster faktiskt kan flyttas till billigare perioder.',
    options: [
      { label: 'Jag vill inte styra', points: -2 },
      { label: 'Jag kan ändra vanor manuellt', points: 1 },
      { label: 'Jag använder scheman/appar', points: 3 },
      { label: 'Automatik styr större laster', points: 5 },
    ],
  },
  {
    title: 'När använder hushållet mest el?',
    help: 'Om mycket måste användas när behovet uppstår har du mindre möjlighet att dra nytta av korta prisvariationer.',
    options: [
      { label: 'Främst morgon och kväll', points: 0 },
      { label: 'Ganska jämnt över dygnet', points: 1 },
      { label: 'Mycket kan flyttas till natt/dag', points: 3 },
      { label: 'Jag kan aktivt välja billiga perioder', points: 5 },
    ],
  },
  {
    title: 'Hur aktiv vill du vara efter att avtalet är tecknat?',
    help: 'Ett mer dynamiskt avtal ger större anledning att följa både förbrukning och kostnad över tid.',
    options: [
      { label: 'Inte alls', points: -3 },
      { label: 'Kolla någon gång ibland', points: 0 },
      { label: 'Följa utvecklingen regelbundet', points: 2 },
      { label: 'Optimera aktivt eller automatiskt', points: 4 },
    ],
  },
];

const results: SelectorResult[] = [
  {
    min: -20,
    label: 'AVTALSPROFIL · FÖRUTSÄGBARHET',
    title: 'Fastare pris är värt att jämföra först',
    text: 'Dina svar visar att förutsägbarhet väger tungt och att aktiv styrning har mindre värde för dig. Jämför vad stabiliteten kostar och läs bindningsvillkoren noga.',
    bullets: ['Jämför fast pris mot rörligt med samma årsförbrukning', 'Kontrollera bindningstid och villkor vid flytt', 'Räkna fasta avgifter tillsammans med energipriset'],
    cta: 'Jämför elavtal',
    href: '/elavtal/jamfor-elavtal/',
  },
  {
    min: 3,
    label: 'AVTALSPROFIL · RÖRLIG',
    title: 'Rörligt månadspris passar din profil bättre',
    text: 'Du accepterar prisvariation men har inte tillräckligt stark kombination av styrbarhet och aktivitet för att kvartspris självklart ska vara första spåret.',
    bullets: ['Jämför påslag och fasta avgifter', 'Kontrollera uppsägningstid', 'Kom ihåg att vanlig rörlig månadsprissättning inte belönar nattförbrukning på samma sätt som kvartspris'],
    cta: 'Jämför rörligt elpris',
    href: '/elavtal/rorligt-elpris/',
  },
  {
    min: 14,
    label: 'AVTALSPROFIL · KVARTSPRIS',
    title: 'Du har förutsättningar för kvartspris',
    text: 'Du kan flytta större laster och accepterar att priset varierar. Det är just den typen av användningsprofil där kvartspris är värt att utvärdera närmare.',
    bullets: ['Styr större laster till billigare perioder', 'Följ faktisk förbrukning och kostnad efter bytet', 'Jämför påslag, fasta avgifter och övriga villkor'],
    cta: 'Fördjupa dig i kvartspris',
    href: '/elavtal/kvartspris/',
  },
];

export default function ElectricityTool() {
  return (
    <>
      <Head>
        <title>Fast, rörligt eller kvartspris 2026? Testa vilket elavtal som passar</title>
        <meta name='description' content='Fast, rörligt eller kvartspris? Svara på fem frågor om förutsägbarhet, elanvändning och styrning och se vilken avtalsform som passar din profil.' />
        <link rel='canonical' href='https://sankkostnaden.se/elavtal/vilket-elavtal-passar-mig/' />
        <meta name='robots' content='index,follow' />
      </Head>
      <SmartSelector eyebrow='SMARTVAL · ELAVTAL' title='Fast, rörligt eller kvartspris – vad passar dig?' intro='Vi försöker inte gissa nästa elpris. I stället väger testet det som faktiskt skiljer avtalsformerna åt för dig: behovet av förutsägbarhet, styrbar förbrukning och hur aktiv du vill vara.' questions={questions} results={results} disclaimer='Resultatet är generell beslutshjälp, inte en prognos. Konsumenternas Energimarknadsbyrå betonar att kvartspris främst kan gynna den som faktiskt kan flytta elanvändning till billigare perioder.' />
    </>
  );
}
