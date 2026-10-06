import Head from 'next/head';
import FirstYearCostCalculator from '../../components/experiments/FirstYearCostCalculator';

export default function FirstYearCostPrototypePage() {
  return (
    <>
      <Head>
        <title>Förstaårskostnad – prototyp | Sänk Kostnaden</title>
        <meta name='description' content='Prototyp för att jämföra verklig kostnad under de första tolv månaderna.' />
        <meta name='robots' content='noindex,nofollow,noarchive' />
      </Head>
      <FirstYearCostCalculator />
      <style jsx global>{`
        .mobileQuickBar { display: none !important; }
      `}</style>
    </>
  );
}
