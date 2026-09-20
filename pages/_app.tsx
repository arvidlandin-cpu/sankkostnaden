import Head from 'next/head';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import '../styles/global.css';
import MobileQuickBar from '../components/MobileQuickBar';
import AffiliateTracking from '../components/AffiliateTracking';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const onAffiliateClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const link = target?.closest<HTMLAnchorElement>('a[data-affiliate-partner]');
      if (!link) return;

      const partner = link.dataset.affiliatePartner || 'unknown';
      const category = link.dataset.affiliateCategory || 'unknown';
      const intent = link.dataset.affiliateIntent || 'unknown';
      const placement = link.dataset.affiliatePlacement || 'unknown';
      let destinationHost = '';
      try { destinationHost = new URL(link.href).hostname; } catch {}

      const params = {
        partner,
        category,
        intent,
        placement,
        page_path: window.location.pathname,
        destination_host: destinationHost,
      };

      const analyticsWindow = window as typeof window & {
        gtag?: (...args: any[]) => void;
        dataLayer?: any[];
      };

      if (typeof analyticsWindow.gtag === 'function') {
        analyticsWindow.gtag('event', 'affiliate_click', params);
      } else if (Array.isArray(analyticsWindow.dataLayer)) {
        analyticsWindow.dataLayer.push({ event: 'affiliate_click', ...params });
      }
    };

    document.addEventListener('click', onAffiliateClick, true);
    return () => document.removeEventListener('click', onAffiliateClick, true);
  }, []);

  return (
    <>
      <Head>
        <link rel='manifest' href='/manifest.webmanifest' />
        <link rel='icon' href='/app-icon.svg?v=2' type='image/svg+xml' />
        <link rel='shortcut icon' href='/app-icon.svg?v=2' />
        <meta name='theme-color' content='#17201b' />
        <meta property='og:site_name' content='Sänk Kostnaden' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content='Sänk Kostnaden' />
      </Head>
      <Component {...pageProps} />
      <AffiliateTracking />
      <MobileQuickBar />
    </>
  );
}
