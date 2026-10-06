import Head from 'next/head';
import PartnerDirectory from '../../components/PartnerDirectory';
import FirstYearCostCalculator from '../../components/experiments/FirstYearCostCalculator';

export default function BroadbandFirstYearCostPage(){
  return <>
    <Head>
      <title>Räkna förstaårskostnad för bredband | Sänk Kostnaden</title>
      <meta name='description' content='Jämför två bredband över samma 12 månader. Räkna kampanjpris, ordinarie pris, router och engångsavgifter innan du väljer.'/>
      <meta name='robots' content='noindex,nofollow,noarchive'/>
      <link rel='canonical' href='https://sankkostnaden.se/verktyg/forstaarskostnad-bredband/'/>
    </Head>
    <FirstYearCostCalculator
      commercial
      category='bredband'
      source='broadband_first_year_cost'
      commercialHref='#commercial-broadband-options'
      commercialLabel='Se aktiva bredbandsalternativ'
      after={<div id='commercial-broadband-options'><PartnerDirectory category='bredband' intent='compare' heading='Aktiva bredbandsalternativ att jämföra'/></div>}
    />
  </>;
}
