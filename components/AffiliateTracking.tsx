import { useEffect } from 'react';
import { partners, type PartnerCategory, type PartnerIntent } from '../lib/partners';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

function normalizeUrl(value: string) {
  try {
    const url = new URL(value);
    url.hash = '';
    return url.toString().replace(/\/$/, '');
  } catch {
    return value.replace(/\/$/, '');
  }
}

function inferIntent(pathname: string, category?: PartnerCategory, partnerIntents: PartnerIntent[] = []): PartnerIntent | 'unknown' {
  if (category === 'ekonomi') {
    if (partnerIntents.includes('saving') && !partnerIntents.includes('loan')) return 'saving';
    return 'loan';
  }
  if (category === 'forsakring') {
    if (/djur/i.test(pathname)) return 'pet';
    if (/hemforsakring/i.test(pathname)) return 'home';
    return partnerIntents.includes('home') ? 'home' : partnerIntents.includes('pet') ? 'pet' : 'compare';
  }
  if (category === 'bredband') {
    if (/mobilt|5g/i.test(pathname)) return 'mobile-broadband';
    if (/fiber/i.test(pathname)) return 'fiber';
    if (/utan-bindningstid/i.test(pathname)) return 'no-binding';
    return 'compare';
  }
  if (category === 'mobil') {
    if (/familj/i.test(pathname)) return 'family';
    if (/surf/i.test(pathname)) return 'data';
    if (/utan-bindningstid/i.test(pathname)) return 'no-binding';
    return 'compare';
  }
  if (category === 'el') return 'electricity';
  return partnerIntents.find(intent => intent !== 'compare') || partnerIntents[0] || 'unknown';
}

function inferPlacement(anchor: HTMLAnchorElement) {
  if (anchor.closest('.heroPartnerActions')) return 'hero';
  if (anchor.classList.contains('partnerButton')) return 'partner_card';
  if (anchor.classList.contains('partnerExpressCard')) return 'gateway_express';
  if (anchor.classList.contains('gatewayDirect')) return 'gateway_primary';
  if (anchor.closest('.resultPartners')) return 'quick_navigator';
  return 'affiliate_link';
}

export default function AffiliateTracking() {
  useEffect(() => {
    const activePartners = partners.filter(partner => partner.status === 'active' && partner.trackingUrl);
    const byUrl = new Map(activePartners.map(partner => [normalizeUrl(partner.trackingUrl as string), partner]));

    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const partner = byUrl.get(normalizeUrl(anchor.href));
      const isSponsored = anchor.rel.split(/\s+/).includes('sponsored');
      if (!partner && !isSponsored) return;

      const category = anchor.dataset.affiliateCategory || partner?.category || anchor.dataset.category || 'unknown';
      const partnerName = anchor.dataset.affiliatePartner || partner?.name || anchor.dataset.partner || 'unknown';
      const intent = anchor.dataset.affiliateIntent || anchor.dataset.intent || inferIntent(window.location.pathname, partner?.category, partner?.intents || []);
      const placement = anchor.dataset.affiliatePlacement || anchor.dataset.placement || inferPlacement(anchor);

      const params = {
        partner: partnerName,
        category,
        intent,
        placement,
        page_path: window.location.pathname,
        page_title: document.title,
        link_url: anchor.href,
        link_domain: (() => { try { return new URL(anchor.href).hostname; } catch { return ''; } })(),
      };

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'affiliate_click', params);
      } else if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push({ event: 'affiliate_click', ...params });
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  return null;
}
