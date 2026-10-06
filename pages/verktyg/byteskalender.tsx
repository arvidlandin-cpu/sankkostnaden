import Head from 'next/head';
import SwitchCalendar from '../../components/tools/SwitchCalendar';

export default function SwitchCalendarPage() {
  return (
    <>
      <Head>
        <title>Byteskalender för elavtal och bredband | Sänk Kostnaden</title>
        <meta name='description' content='Räkna ett planeringsdatum för uppsägning, avtalslut och byte utifrån datumen och uppsägningstiden i ditt eget avtal.' />
        <meta name='robots' content='noindex,nofollow,noarchive' />
        <link rel='canonical' href='https://sankkostnaden.se/verktyg/byteskalender/' />
      </Head>
      <SwitchCalendar />
    </>
  );
}
