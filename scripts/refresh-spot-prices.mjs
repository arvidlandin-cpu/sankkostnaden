import fs from 'node:fs/promises';
import path from 'node:path';
import { PRICE_AREAS, followingDate, parseSpotDay, preservePrevious, spotApiUrl, swedishDate } from './lib/spotPriceFeed.mjs';

const today = swedishDate();
const tomorrow = followingDate(today);
const outputFile = path.join('public', 'spot-prices', 'latest.json');
let previous = null;
try { previous = JSON.parse(await fs.readFile(outputFile, 'utf8')); } catch { /* First run. */ }

const days = {};
for (const date of [today, tomorrow]) {
  days[date] = {};
  for (const area of PRICE_AREAS) {
    try {
      const response = await fetch(spotApiUrl(date, area), {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      days[date][area] = parseSpotDay(await response.json(), date);
      console.log('OK ' + date + ' ' + area + ': ' + days[date][area].length + ' quarter-hour prices');
    } catch (error) {
      const cached = preservePrevious(previous, date, area);
      if (cached) days[date][area] = cached;
      console.warn('Unavailable ' + date + ' ' + area + ': ' + String(error) +
        (cached ? ' (validated cache retained)' : ' (will not be displayed)'));
    }
  }
  if (!Object.keys(days[date]).length) delete days[date];
}

const currentCoverage = PRICE_AREAS.filter(area => days[today]?.[area]);
if (!currentCoverage.length) throw new Error('No valid prices for today: refusing to publish stale data.');

const document = {
  source: 'Elpriset just nu.se',
  sourceUrl: 'https://www.elprisetjustnu.se/elpris-api',
  unit: 'SEK/kWh',
  priceType: 'spot',
  includesVat: false,
  includesElectricityTax: false,
  includesGridFee: false,
  includesSupplierFees: false,
  zone: 'Europe/Stockholm',
  days,
};
const serialized = JSON.stringify(document, null, 2) + '\n';
const previousText = await fs.readFile(outputFile, 'utf8').catch(() => '');
if (serialized !== previousText) {
  await fs.mkdir(path.dirname(outputFile), { recursive: true });
  await fs.writeFile(outputFile, serialized, 'utf8');
  console.log('Updated ' + outputFile + ' for ' + Object.keys(days).join(', '));
} else {
  console.log('No price changes; avoiding unnecessary Cloudflare builds.');
}
