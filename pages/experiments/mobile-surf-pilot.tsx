import Head from 'next/head';
import MobileSurfPilot from '../../components/experiments/MobileSurfPilot';

export default function MobileSurfPilotPage() {
  return (
    <>
      <Head>
        <title>Privat pilot – mobil surfprofil | Sänk Kostnaden</title>
        <meta name='description' content='Privat noindex-pilot för verifiering av mobilens surfprofil och partneröverlämning.' />
        <meta name='robots' content='noindex,nofollow,noarchive' />
      </Head>
      <MobileSurfPilot />
      <style jsx global>{`
        .mobileQuickBar { display: none !important; }
      `}</style>
    </>
  );
}
