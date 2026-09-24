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
    if (/reseforsakring/i.test(pathname)) return 'travel';
    if (/vardforsakring/i.test(pathname)) return 'health';
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
    const byUrl = new Map<string, (typeof partners)[number]>();
    activePartners.forEach(partner => {
      [partner.trackingUrl, ...Object.values(partner.intentTrackingUrls || {})].forEach(url => {
        if (url) byUrl.set(normalizeUrl(url), partner);
      });
    });

    const resolve = (anchor: HTMLAnchorElement) => {
      const partner = byUrl.get(normalizeUrl(anchor.href));
      const isSponsored = anchor.rel.split(/\s+/).includes('sponsored');
      if (!partner && !isSponsored) return null;
      const category = anchor.dataset.affiliateCategory || partner?.category || anchor.dataset.category || 'unknown';
      const partnerName = anchor.dataset.affiliatePartner || partner?.name || anchor.dataset.partner || 'unknown';
      const intent = anchor.dataset.affiliateIntent || anchor.dataset.intent || inferIntent(window.location.pathname, partner?.category, partner?.intents || []);
      const placement = anchor.dataset.affiliatePlacement || anchor.dataset.placement || inferPlacement(anchor);
      return {
        partner: partnerName,
        merchant_domain: partner?.domain || '',
        category,
        intent,
        placement,
        partner_position: anchor.dataset.partnerPosition || '',
        result_rank: anchor.dataset.resultRank || '',
        cta_text: (anchor.textContent || '').replace(/\s+/g,' ').trim().slice(0,120),
        page_path: window.location.pathname,
        page_title: document.title,
        link_url: anchor.href,
        link_domain: (() => { try { return new URL(anchor.href).hostname; } catch { return ''; } })(),
      };
    };

    const emit = (eventName: string, params: Record<string, unknown>) => {
      if (typeof window.gtag === 'function') window.gtag('event', eventName, params);
      else if (Array.isArray(window.dataLayer)) window.dataLayer.push({ event: eventName, ...params });
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const params = resolve(anchor);
      if (params) emit('affiliate_click', params);
    };

    const observed = new WeakSet<HTMLAnchorElement>();
    const seen = new WeakSet<HTMLAnchorElement>();
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.35) return;
        const anchor = entry.target as HTMLAnchorElement;
        if (seen.has(anchor)) return;
        const params = resolve(anchor);
        if (!params) return;
        seen.add(anchor);
        emit('partner_impression', params);
        observer?.unobserve(anchor);
      });
    }, { threshold: [0.35] }) : null;

    const scan = () => {
      if (!observer) return;
      document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(anchor => {
        if (observed.has(anchor) || !resolve(anchor)) return;
        observed.add(anchor);
        observer.observe(anchor);
      });
    };

    document.addEventListener('click', handleClick, true);
    scan();
    const mutation = new MutationObserver(scan);
    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('click', handleClick, true);
      mutation.disconnect();
      observer?.disconnect();
    };
  }, []);

  return null;
}
