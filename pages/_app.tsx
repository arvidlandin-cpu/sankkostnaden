import Head from 'next/head';
import Script from 'next/script';
import type { AppProps } from 'next/app';
import '../styles/global.css';

export default function App({ Component, pageProps }: AppProps) {

  return (
    <>
      <Script src='https://www.googletagmanager.com/gtag/js?id=G-E2XTJVY5EX' strategy='afterInteractive' />
      <Script id='google-analytics' strategy='afterInteractive'>{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-E2XTJVY5EX');
      `}</Script>
      <Head>
        <link rel='manifest' href='/manifest.webmanifest' />
        <meta name='theme-color' content='#17201b' />
        <meta name='robots' content='index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' />
        <meta property='og:site_name' content='Sänk Kostnaden' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content='Sänk Kostnaden' />
        <link rel='apple-touch-icon' href='/app-icon.svg' />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
