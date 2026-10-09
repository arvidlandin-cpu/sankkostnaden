/**
 * Educational comparison of the CHEAPEST vs MOST EXPENSIVE *continuous*
 * two-hour periods in one validated Swedish day-ahead spot-price day.
 * The scenario is not a bill, consumption forecast or achievable savings guarantee.
 */
export type ShiftQuarter = { start: string; end: string; sekPerKwh: number };
export type PriceWindow = { start: string; end: string; averageSekPerKwh: number; firstIndex: number };
export type SpotShiftScenario = {
  movedKwh: number;
  expensiveAverageSek: number;
  cheapAverageSek: number;
  spreadSekPerKwh: number;
  spotDifferenceSek: number;
  slotsPerGroup: number;
  cheapWindow: PriceWindow;
  expensiveWindow: PriceWindow;
};

const SLOTS=8; // Eight contiguous 15-minute intervals = two consecutive hours.

export function validQuarterDay(quarters: ShiftQuarter[]): boolean {
  if (!Array.isArray(quarters) || ![92,96,100].includes(quarters.length)) return false;
  for(let i=0;i<quarters.length;i++){
    const q=quarters[i];
    if(!q || typeof q.start!=='string'||typeof q.end!=='string' ||
       !Number.isFinite(q.sekPerKwh) || q.sekPerKwh < -100 || q.sekPerKwh > 100) return false;
    const start=Date.parse(q.start),end=Date.parse(q.end);
    if(!Number.isFinite(start)||!Number.isFinite(end)||end-start!==900000) return false;
    if(i>0 && Date.parse(quarters[i-1].end)!==start) return false;
  }
  return true;
}

export function twoHourWindows(quarters: ShiftQuarter[]): PriceWindow[] {
  if(!validQuarterDay(quarters)) return [];
  const results:PriceWindow[]=[];
  for(let i=0;i<=quarters.length-SLOTS;i++){
    const sum=quarters.slice(i,i+SLOTS).reduce((acc,q)=>acc+q.sekPerKwh,0);
    results.push({firstIndex:i,start:quarters[i].start,end:quarters[i+SLOTS-1].end,averageSekPerKwh:sum/SLOTS});
  }
  return results;
}

export function bestUpcomingWindow(quarters: ShiftQuarter[], now:number): PriceWindow|null {
  // Only future, complete, uninterrupted windows within the displayed Swedish day.
  if(!Number.isFinite(now)) return null;
  const windows=twoHourWindows(quarters).filter(w=>Date.parse(w.start)>=now);
  return windows.length ? windows.reduce((best,w)=>w.averageSekPerKwh<best.averageSekPerKwh?w:best) : null;
}

export function calculateSpotShiftScenario(quarters: ShiftQuarter[],movedKwh:number):SpotShiftScenario|null {
  if(!Number.isFinite(movedKwh)||movedKwh<0||movedKwh>10) return null;
  const windows=twoHourWindows(quarters);
  if(!windows.length)return null;
  const low=windows.reduce((best,w)=>w.averageSekPerKwh<best.averageSekPerKwh?w:best);
  const high=windows.reduce((best,w)=>w.averageSekPerKwh>best.averageSekPerKwh?w:best);
  const spread=Math.max(0,high.averageSekPerKwh-low.averageSekPerKwh);
  return {
    movedKwh,
    expensiveAverageSek:high.averageSekPerKwh,
    cheapAverageSek:low.averageSekPerKwh,
    spreadSekPerKwh:spread,
    spotDifferenceSek:Math.max(0,movedKwh*spread),
    slotsPerGroup:SLOTS,
    cheapWindow:low,
    expensiveWindow:high,
  };
}
