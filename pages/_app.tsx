import Head from 'next/head';
import Script from 'next/script';
import type { AppProps } from 'next/app';
import '../styles/global.css';
import MobileQuickBar from '../components/MobileQuickBar';
import AffiliateTracking from '../components/AffiliateTracking';
import SiteFooter from '../components/SiteFooter';

export default function App({ Component, pageProps }: AppProps) {

  return (
    <>
      <Script src='https://www.googletagmanager.com/gtag/js?id=G-E2XTJVY5EX' strategy='afterInteractive' />
      <Script id='google-analytics' strategy='afterInteractive'>{`
        const analyticsHost = window.location.hostname;
        const analyticsEnabled = (analyticsHost === 'sankkostnaden.se' || analyticsHost === 'www.sankkostnaden.se') && !new URLSearchParams(window.location.search).has('qa');
        if (analyticsEnabled) {
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', 'G-E2XTJVY5EX');
        } else {
          window['ga-disable-G-E2XTJVY5EX'] = true;
        }
      `}</Script>
      <Head>
        <link rel='manifest' href='/manifest.webmanifest' />
        <link rel='preconnect' href='https://images.pexels.com' crossOrigin='' />
        <link rel='dns-prefetch' href='https://images.pexels.com' />
        <link rel='icon' href='/app-icon.svg?v=2' type='image/svg+xml' />
        <link rel='shortcut icon' href='/app-icon.svg?v=2' />
        <meta name='theme-color' content='#17201b' />
        <meta property='og:site_name' content='Sänk Kostnaden' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content='Sänk Kostnaden' />
      </Head>
      <Component {...pageProps} />
      <SiteFooter />
      <AffiliateTracking />
      <MobileQuickBar />
    </>
  );
}
