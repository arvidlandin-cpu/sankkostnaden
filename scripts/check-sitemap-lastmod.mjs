import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const origin = 'https://sankkostnaden.se';
const quarter = origin + '/elavtal/kvartspris/';
const validDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
  && Number.isFinite(Date.parse(value + 'T00:00:00Z'))
  && new Date(value + 'T00:00:00Z').toISOString().slice(0, 10) === value;
const canonicalUrl = value => {
  try {
    const url = new URL(value);
    return url.origin === origin && !url.search && !url.hash && !url.username && !url.password
      && url.pathname.endsWith('/') && url.href === value;
  } catch { return false; }
};

/** A read-only evidence check, never a date generator or git/CSS heuristic. */
export function validateSitemapLastmod({ sitemap, manifest, baseline, today = new Date().toISOString().slice(0, 10) }) {
  const errors = [];
  const expected = Array.isArray(baseline?.pages) ? baseline.pages.map(page => page.canonical) : [];
  const canonicalSet = new Set(expected);
  if (expected.length !== 63 || canonicalSet.size !== 63 || expected.some(url => !canonicalUrl(url))) errors.push('Expected the unchanged 63-canonical SEO baseline.');
  if (!validDate(today)) errors.push('Invalid validation date.');
  const entries = [...String(sitemap).matchAll(/<url\b[^>]*>([\s\S]*?)<\/url>/g)].map(match => {
    const locs = [...match[1].matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)];
    const dates = [...match[1].matchAll(/<lastmod>\s*([^<]+?)\s*<\/lastmod>/g)];
    if (locs.length !== 1 || dates.length !== 1) errors.push('Each sitemap URL requires one loc and one lastmod.');
    return { url: locs[0]?.[1], lastmod: dates[0]?.[1] };
  });
  const sitemapSet = new Set(entries.map(entry => entry.url));
  if (entries.length !== 63 || sitemapSet.size !== 63) errors.push('Sitemap must contain 63 unique canonical URLs.');
  for (const entry of entries) {
    if (!canonicalUrl(entry.url) || !canonicalSet.has(entry.url)) errors.push('Non-baseline/non-indexable sitemap URL: ' + entry.url);
    if (!validDate(entry.lastmod) || entry.lastmod > today) errors.push('Invalid or future sitemap lastmod: ' + entry.url);
  }
  for (const url of canonicalSet) if (!sitemapSet.has(url)) errors.push('Missing baseline canonical: ' + url);
  if (entries.find(entry => entry.url === quarter)?.lastmod !== '2026-09-20') errors.push('Protected quarter-price lastmod must remain 2026-09-20.');
  if (manifest?.schemaVersion !== 1 || !Array.isArray(manifest.changes) || !manifest.changes.length) errors.push('Expected a nonempty reviewed content-change manifest.');
  if (!manifest?.protectedPaths?.includes('/elavtal/kvartspris/')) errors.push('Manifest must explicitly exclude the quarter-price observation.');
  const seen = new Set();
  for (const change of Array.isArray(manifest?.changes) ? manifest.changes : []) {
    if (!change || typeof change !== 'object') { errors.push('Invalid manifest entry.'); continue; }
    if (seen.has(change.url)) errors.push('Duplicate manifest URL: ' + change.url);
    seen.add(change.url);
    if (!canonicalUrl(change.url) || !canonicalSet.has(change.url)) errors.push('Manifest URL must be an indexable baseline canonical: ' + change.url);
    if (change.url === quarter) errors.push('Quarter-price changes are forbidden in this manifest.');
    if (!validDate(change.lastmod) || change.lastmod > today) errors.push('Invalid or future manifest date: ' + change.url);
    if (typeof change.reason !== 'string' || !change.reason.trim() || !Array.isArray(change.sourcePaths) || !change.sourcePaths.length
      || change.sourcePaths.some(source => typeof source !== 'string' || !/^(pages|components)\/[\w/-]+\.(tsx|ts)$/.test(source))) errors.push('Missing substantive reason/source paths: ' + change.url);
    const historical = /^[a-f\d]{40}$/.test(change.evidenceCommit || '');
    const reviewed = change.evidence === 'current-reviewed-content' && !change.evidenceCommit;
    if (!historical && !reviewed) errors.push('Missing historical commit or explicit current review evidence: ' + change.url);
    if (entries.find(entry => entry.url === change.url)?.lastmod !== change.lastmod) errors.push('Manifest/sitemap lastmod mismatch: ' + change.url);
  }
  return errors;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'autopilot/search-content-changes.json'), 'utf8'));
  const errors = validateSitemapLastmod({
    sitemap: fs.readFileSync(path.join(root, 'public/sitemap.xml'), 'utf8'), manifest,
    baseline: JSON.parse(fs.readFileSync(path.join(root, 'tests/fixtures/seo-continuity-baseline.json'), 'utf8')),
  });
  for (const change of manifest.changes) for (const source of change.sourcePaths) {
    if (!fs.existsSync(path.join(root, source))) errors.push('Evidence source does not exist: ' + source);
  }
  if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
  else console.log(`Sitemap lastmod evidence passed: 63 preserved canonicals; ${manifest.changes.length} reviewed dates; quarter-price unchanged.`);
}
