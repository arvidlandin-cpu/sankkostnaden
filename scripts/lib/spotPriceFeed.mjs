export const PRICE_AREAS = ['SE1', 'SE2', 'SE3', 'SE4'];
const STOCKHOLM = 'Europe/Stockholm';

export function swedishDate(now = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
    timeZone: STOCKHOLM, year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now).filter(p => p.type !== 'literal').map(p => [p.type, p.value]));
  return parts.year + '-' + parts.month + '-' + parts.day;
}

export function followingDate(isoDate) {
  const day = new Date(isoDate + 'T12:00:00Z');
  if (Number.isNaN(day.getTime())) throw new Error('Invalid ISO date');
  day.setUTCDate(day.getUTCDate() + 1);
  return day.toISOString().slice(0, 10);
}

export function spotApiUrl(date, area) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !PRICE_AREAS.includes(area)) {
    throw new Error('Invalid area/date');
  }
  return 'https://www.elprisetjustnu.se/api/v1/prices/' +
    date.slice(0, 4) + '/' + date.slice(5, 7) + '-' + date.slice(8, 10) + '_' + area + '.json';
}

export function parseSpotDay(raw, date) {
  // For Sweden 15-minute day-ahead data: 92 / 96 / 100 quarters (DST).
  if (!Array.isArray(raw) || ![92, 96, 100].includes(raw.length)) {
    throw new Error('Incomplete or non-quarter-hour day');
  }
  const rows = raw.map(row => {
    if (!row || typeof row !== 'object') throw new Error('Invalid price record');
    const price = row.SEK_per_kWh;
    const start = row.time_start;
    const end = row.time_end;
    if (typeof price !== 'number' || !Number.isFinite(price) ||
        price < -100 || price > 100 ||
        typeof start !== 'string' || typeof end !== 'string' ||
        !start.startsWith(date + 'T')) throw new Error('Invalid spot price record');
    const msStart = Date.parse(start);
    const msEnd = Date.parse(end);
    if (!Number.isFinite(msStart) || !Number.isFinite(msEnd) ||
        msEnd - msStart !== 15 * 60 * 1000) throw new Error('Invalid quarter-hour interval');
    return { start, end, sekPerKwh: Math.round(price * 1_000_000) / 1_000_000 };
  }).sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
  for (let i = 1; i < rows.length; i++) {
    if (Date.parse(rows[i - 1].end) !== Date.parse(rows[i].start)) {
      throw new Error('Spot price intervals contain a gap or overlap');
    }
  }
  return rows;
}

export function preservePrevious(previous, date, area) {
  const rows = previous?.days?.[date]?.[area];
  if (!Array.isArray(rows) || ![92, 96, 100].includes(rows.length)) return null;
  try {
    // Validate cached data by reusing the provider schema's strict checks.
    return parseSpotDay(rows.map(row => ({
      time_start: row.start, time_end: row.end, SEK_per_kWh: row.sekPerKwh,
    })), date);
  } catch { return null; }
}
