import Head from 'next/head';
import PartnerDirectory from '../../components/PartnerDirectory';
import FirstYearCostCalculator from '../../components/experiments/FirstYearCostCalculator';

export default function FirstYearCostCommercialPage() {
  return (
    <>
      <Head>
        <title>Räkna förstaårskostnad för mobilabonnemang | Sänk Kostnaden</title>
        <meta name='description' content='Jämför två mobilabonnemang över samma 12 månader. Räkna kampanjpris, ordinarie pris och avgifter innan du väljer.' />
        <meta name='robots' content='noindex,nofollow,noarchive' />
        <link rel='canonical' href='https://sankkostnaden.se/verktyg/forstaarskostnad/' />
      </Head>
      <FirstYearCostCalculator
        commercial
        source='mobile_first_year_cost'
        commercialHref='#commercial-mobile-options'
        commercialLabel='Se aktiva mobilalternativ'
        after={<div id='commercial-mobile-options'><PartnerDirectory category='mobil' intent='compare' heading='Aktiva mobilalternativ att jämföra' /></div>}
      />
    </>
  );
}
