import Head from 'next/head';
import ElectricityCostCalculator from '../../components/tools/ElectricityCostCalculator';

export default function ElectricityCostPage(){
  return <>
    <Head>
      <title>Räkna elavtalets årskostnad | Sänk Kostnaden</title>
      <meta name='description' content='Jämför två elavtal på samma årsförbrukning. Räkna kWh-kostnad, fast avgift och rabatt över tolv månader.'/>
      <meta name='robots' content='noindex,nofollow,noarchive'/>
      <link rel='canonical' href='https://sankkostnaden.se/verktyg/elavtalskostnad/'/>
    </Head>
    <ElectricityCostCalculator/>
  </>;
}
