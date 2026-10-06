export type CostKey = 'el' | 'bredband' | 'mobil' | 'forsakring';
export type CostAnswer = { monthly: number; fit: number };
export type CostAnswers = Record<CostKey, CostAnswer>;

export const costCheckStorageKey='sankkostnaden-cost-check-v5';

export const emptyCostAnswers:CostAnswers={
  el:{monthly:0,fit:-1},
  bredband:{monthly:0,fit:-1},
  mobil:{monthly:0,fit:-1},
  forsakring:{monthly:0,fit:-1},
};

const safe=(value:number)=>Number.isFinite(value)?Math.max(0,value):0;

export function normalizeCostAnswers(input:Partial<Record<CostKey,Partial<CostAnswer>>>|undefined):CostAnswers{
  return {
    el:{monthly:safe(input?.el?.monthly||0),fit:typeof input?.el?.fit==='number'?input.el.fit:-1},
    bredband:{monthly:safe(input?.bredband?.monthly||0),fit:typeof input?.bredband?.fit==='number'?input.bredband.fit:-1},
    mobil:{monthly:safe(input?.mobil?.monthly||0),fit:typeof input?.mobil?.fit==='number'?input.mobil.fit:-1},
    forsakring:{monthly:safe(input?.forsakring?.monthly||0),fit:typeof input?.forsakring?.fit==='number'?input.forsakring.fit:-1},
  };
}

export function scenarioAnnualSaving(monthly:number,scenarioPercent:number){
  const pct=Math.min(100,Math.max(0,safe(scenarioPercent)));
  return safe(monthly)*12*(pct/100);
}

export function prioritySortValue(answer:CostAnswer){
  const fit=Math.max(0,answer.fit);
  return fit*100000+safe(answer.monthly);
}
