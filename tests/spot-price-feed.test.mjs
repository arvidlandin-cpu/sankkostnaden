import test from 'node:test';
import assert from 'node:assert/strict';
import { PRICE_AREAS, followingDate, parseSpotDay, preservePrevious, spotApiUrl, swedishDate } from '../scripts/lib/spotPriceFeed.mjs';

function quarterRows(date, count = 96, baseOffset = 2, change = null) {
  const ms0 = Date.parse(date + 'T00:00:00' + (baseOffset === 2 ? '+02:00' : '+01:00'));
  function iso(ms) {
    const offset = change && ms >= Date.parse(change.at) ? change.offset : baseOffset;
    return new Date(ms + offset * 3600000).toISOString().slice(0, 19) +
      (offset === 2 ? '+02:00' : '+01:00');
  }
  return Array.from({ length: count }, (_, i) => ({
    SEK_per_kWh: i % 6 === 0 ? -0.02 : 0.4 + i * 0.001,
    time_start: iso(ms0 + i * 15 * 60000),
    time_end: iso(ms0 + (i + 1) * 15 * 60000),
  }));
}

test('spot price URL only allows valid Swedish bidding zones', () => {
  assert.equal(spotApiUrl('2026-10-09', 'SE3'),
    'https://www.elprisetjustnu.se/api/v1/prices/2026/10-09_SE3.json');
  assert.deepEqual(PRICE_AREAS, ['SE1', 'SE2', 'SE3', 'SE4']);
  assert.throws(() => spotApiUrl('2026-10-09', 'SE5'));
});

test('calendar uses Sweden not runner UTC, including midnight rollover', () => {
  assert.equal(swedishDate(new Date('2026-10-08T22:35:00Z')), '2026-10-09');
  assert.equal(followingDate('2026-12-31'), '2027-01-01');
});

test('valid day has 96 quarters including negative spot prices', () => {
  const day = parseSpotDay(quarterRows('2026-10-09'), '2026-10-09');
  assert.equal(day.length, 96);
  assert.equal(day[0].sekPerKwh, -0.02);
  assert.equal(day[95].sekPerKwh, 0.495);
  assert.equal(Date.parse(day[95].end) - Date.parse(day[0].start), 86400000);
});

test('DST spring/fall changes accept 92/100 quarters rather than fake 96', () => {
  const spring = quarterRows('2026-03-29', 92, 1,
    { at: '2026-03-29T01:00:00Z', offset: 2 });
  const fall = quarterRows('2026-10-25', 100, 2,
    { at: '2026-10-25T01:00:00Z', offset: 1 });
  assert.equal(parseSpotDay(spring, '2026-03-29').length, 92);
  assert.equal(parseSpotDay(fall, '2026-10-25').length, 100);
});

test('rejects incomplete, impossible, noncontiguous, wrong-date feeds', () => {
  const full = quarterRows('2026-10-09');
  assert.throws(() => parseSpotDay(full.slice(0, -1), '2026-10-09'));
  assert.throws(() => parseSpotDay(full.map((row, i) => i === 6 ?
    { ...row, SEK_per_kWh: Number.NaN } : row), '2026-10-09'));
  assert.throws(() => parseSpotDay(full.map((row, i) => i === 3 ?
    { ...row, time_start: '2026-10-09T02:00:00+02:00' } : row), '2026-10-09'));
  assert.throws(() => parseSpotDay(full, '2026-10-10'));
});

test('only valid previously cached data survives source outage', () => {
  const date = '2026-10-09';
  const normalized = parseSpotDay(quarterRows(date), date);
  const feed = { days: { [date]: { SE3: normalized } } };
  assert.equal(preservePrevious(feed, date, 'SE3')?.length, 96);
  assert.equal(preservePrevious(feed, '2026-10-08', 'SE3'), null);
  assert.equal(preservePrevious({ days: { [date]: { SE3: [{ start: date }] } } }, date, 'SE3'), null);
});
