import type { GetStaticProps } from 'next';
import Head from 'next/head';
import MobileSurfPilot from '../../components/experiments/MobileSurfPilot';

type Props = { enabled: boolean };

export default function MobileSurfPilotPage({ enabled }: Props) {
  if (!enabled) return null;

  return (
    <>
      <Head>
        <title>Privat pilot – mobil surfprofil | Sänk Kostnaden</title>
        <meta name='description' content='Privat, icke-kommersiell prototyp för intern QA av mobilens surfprofil.' />
        <meta name='robots' content='noindex,nofollow,noarchive' />
      </Head>
      <MobileSurfPilot />
      <style jsx global>{`
        .mobileQuickBar { display: none !important; }
      `}</style>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const enabled = process.env.ENABLE_MOBILE_SURF_PILOT === 'true'
    || process.env.CF_PAGES_BRANCH === 'pilot/mobile-surf-prototype-2026-10-04';

  if (!enabled) return { notFound: true };
  return { props: { enabled: true } };
};
