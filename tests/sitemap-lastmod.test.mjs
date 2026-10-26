import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { validateSitemapLastmod } from '../scripts/check-sitemap-lastmod.mjs';

const baseline = JSON.parse(fs.readFileSync(new URL('./fixtures/seo-continuity-baseline.json', import.meta.url), 'utf8'));
const manifest = JSON.parse(fs.readFileSync(new URL('../autopilot/search-content-changes.json', import.meta.url), 'utf8'));
const clone = value => structuredClone(value);
const xmlFor = changes => '<urlset>' + baseline.pages.map(page => {
  const date = changes.find(change => change.url === page.canonical)?.lastmod || '2026-09-20';
  return `<url><loc>${page.canonical}</loc><lastmod>${date}</lastmod></url>`;
}).join('') + '</urlset>';
const sitemap = xmlFor(manifest.changes);
const check = changes => validateSitemapLastmod({ sitemap, manifest, baseline, today: '2026-10-26', ...changes });

test('reviewed content dates retain the real 63-canonical baseline and explicit protected page', () => {
  assert.equal(baseline.pages.length, 63);
  assert.ok(manifest.changes.length > 0 && manifest.changes.length < baseline.pages.length);
  assert.deepEqual(check({}), []);
  assert.ok(manifest.changes.some(change => change.evidence === 'current-reviewed-content'));
  assert.ok(manifest.changes.some(change => change.evidenceCommit));
});

test('rejects impossible dates rather than allowing Date.parse rollover', () => {
  const modified = clone(manifest); modified.changes[0].lastmod = '2026-02-30';
  assert.ok(check({ manifest: modified }).some(error => error.includes('Invalid or future manifest date')));
});

test('rejects a future content date and future sitemap date', () => {
  const modified = clone(manifest); modified.changes[0].lastmod = '2026-10-27';
  const errors = check({ manifest: modified, sitemap: xmlFor(modified.changes) });
  assert.ok(errors.some(error => error.includes('future manifest')));
  assert.ok(errors.some(error => error.includes('future sitemap')));
});

test('rejects duplicate manifest entries and duplicate sitemap URLs', () => {
  const modified = clone(manifest); modified.changes.push(modified.changes[0]);
  assert.ok(check({ manifest: modified }).some(error => error.includes('Duplicate manifest')));
  const duplicated = sitemap.replace('</urlset>', sitemap.match(/<url>.*?<\/url>/)[0] + '</urlset>');
  assert.ok(check({ sitemap: duplicated }).some(error => error.includes('63 unique')));
});

test('forbids quarter-price in the review manifest even with an unchanged date', () => {
  const modified = clone(manifest);
  modified.changes.push({ ...modified.changes[0], url: 'https://sankkostnaden.se/elavtal/kvartspris/', lastmod: '2026-09-20' });
  assert.ok(check({ manifest: modified }).some(error => error.includes('Quarter-price changes are forbidden')));
});

test('preserves the quarter-price lastmod and requires explicit exclusion', () => {
  const changed = sitemap.replace('<loc>https://sankkostnaden.se/elavtal/kvartspris/</loc><lastmod>2026-09-20', '<loc>https://sankkostnaden.se/elavtal/kvartspris/</loc><lastmod>2026-10-26');
  assert.ok(check({ sitemap: changed }).some(error => error.includes('must remain 2026-09-20')));
  assert.ok(check({ manifest: { ...manifest, protectedPaths: [] } }).some(error => error.includes('explicitly exclude')));
});

test('rejects nonindexable tool routes and external or noncanonical locs', () => {
  for (const invalid of ['https://sankkostnaden.se/verktyg/forstaarskostnad/', 'https://example.com/app/', 'http://sankkostnaden.se/app/', 'https://sankkostnaden.se/app/?qa=1']) {
    const changed = sitemap.replace('https://sankkostnaden.se/app/', invalid);
    assert.ok(check({ sitemap: changed }).some(error => error.includes('Non-baseline/non-indexable')));
    const modified = clone(manifest); modified.changes[1].url = invalid;
    assert.ok(check({ manifest: modified }).some(error => error.includes('indexable baseline canonical')));
  }
});

test('a missing canonical cannot be hidden by retaining a total of 63 entries', () => {
  const changed = sitemap.replace('https://sankkostnaden.se/app/', 'https://sankkostnaden.se/new-page/');
  assert.ok(check({ sitemap: changed }).some(error => error.includes('Missing baseline canonical')));
  assert.ok(check({ baseline: { pages: baseline.pages.slice(1) } }).some(error => error.includes('unchanged 63-canonical')));
});

test('requires the reviewed date to match XML and carry evidence and source paths', () => {
  assert.ok(check({ sitemap: sitemap.replace('<lastmod>2026-10-15</lastmod>', '<lastmod>2026-10-14</lastmod>') }).some(error => error.includes('lastmod mismatch')));
  for (const change of [{ evidenceCommit: '' }, { sourcePaths: ['styles/global.css'] }, { reason: '' }]) {
    const modified = clone(manifest); Object.assign(modified.changes[0], change);
    assert.ok(check({ manifest: modified }).length > 0);
  }
});
