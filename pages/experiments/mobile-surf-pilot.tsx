import Head from 'next/head';
import MobileSurfPilot from '../../components/experiments/MobileSurfPilot';

export default function MobileSurfPilotPage() {
  return (
    <>
      <Head>
        <title>Din surfprofil – mobil | Sänk Kostnaden</title>
        <meta name='description' content='Svara på tre korta frågor och hitta en surfprofil med ett relevant nästa steg.' />
        <meta name='robots' content='noindex,nofollow,noarchive' />
      </Head>
      <MobileSurfPilot />
      <style jsx global>{`
        .mobileQuickBar { display: none !important; }
      `}</style>
    </>
  );
}
