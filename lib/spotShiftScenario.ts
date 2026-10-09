/**
 * Illustration using genuine 15-minute spot prices, NOT a household load profile.
 * Compares the mean of the eight highest and eight lowest 15-minute slots
 * (two hours of slots in each group). The slots need not be consecutive.
 * The hypothetical moved kWh is assumed to be the same before and after.
 */
export type ShiftQuarter = { start: string; end: string; sekPerKwh: number };
export type SpotShiftScenario = {
  movedKwh: number;
  expensiveAverageSek: number;
  cheapAverageSek: number;
  spreadSekPerKwh: number;
  spotDifferenceSek: number;
  slotsPerGroup: number;
};

export function calculateSpotShiftScenario(
  quarters: ShiftQuarter[],
  movedKwh: number
): SpotShiftScenario | null {
  if (!Array.isArray(quarters) || ![92, 96, 100].includes(quarters.length)) return null;
  if (!Number.isFinite(movedKwh) || movedKwh < 0 || movedKwh > 10) return null;
  if (quarters.some(q => !q || !Number.isFinite(q.sekPerKwh) ||
      q.sekPerKwh < -100 || q.sekPerKwh > 100 ||
      !Number.isFinite(Date.parse(q.start)) || !Number.isFinite(Date.parse(q.end)) ||
      Date.parse(q.end) - Date.parse(q.start) !== 900000)) return null;
  const sorted = quarters.map(q => q.sekPerKwh).sort((a, b) => a - b);
  const slots = 8;
  const average = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;
  const low = average(sorted.slice(0, slots));
  const high = average(sorted.slice(-slots));
  const spread = Math.max(0, high - low);
  return {
    movedKwh,
    expensiveAverageSek: high,
    cheapAverageSek: low,
    spreadSekPerKwh: spread,
    spotDifferenceSek: Math.max(0, movedKwh * spread),
    slotsPerGroup: slots,
  };
}
