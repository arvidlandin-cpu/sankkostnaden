import Head from 'next/head';
import type { AppProps } from 'next/app';
import '../styles/global.css';
import MobileQuickBar from '../components/MobileQuickBar';

export default function App({ Component, pageProps }: AppProps) {

  return (
    <>
      <Head>
        <link rel='manifest' href='/manifest.webmanifest' />
        <link rel='icon' href='/app-icon.svg?v=2' type='image/svg+xml' />
        <link rel='shortcut icon' href='/app-icon.svg?v=2' />
        <meta name='theme-color' content='#17201b' />
        <meta name='robots' content='index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' />
        <meta property='og:site_name' content='Sänk Kostnaden' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content='Sänk Kostnaden' />
        <link rel='apple-touch-icon' href='/app-icon.svg?v=2' />
      </Head>
      <Component {...pageProps} />
      <MobileQuickBar />
    </>
  );
}
