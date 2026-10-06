export type ElectricityOfferInput = {
  unitPriceOre: number;
  monthlyFee: number;
  annualDiscount: number;
};

export type ElectricityOfferResult = {
  variableCost: number;
  fixedCost: number;
  discount: number;
  annualCost: number;
  effectiveOrePerKwh: number;
};

const safe=(value:number)=>Number.isFinite(value)?Math.max(0,value):0;

export function calculateElectricityOffer(annualKwh:number,input:ElectricityOfferInput):ElectricityOfferResult{
  const kwh=safe(annualKwh);
  const variableCost=kwh*safe(input.unitPriceOre)/100;
  const fixedCost=safe(input.monthlyFee)*12;
  const beforeDiscount=variableCost+fixedCost;
  const discount=Math.min(beforeDiscount,safe(input.annualDiscount));
  const annualCost=Math.max(0,beforeDiscount-discount);
  return {
    variableCost,
    fixedCost,
    discount,
    annualCost,
    effectiveOrePerKwh:kwh>0?(annualCost/kwh)*100:0,
  };
}

export function consumptionBand(annualKwh:number){
  const value=safe(annualKwh);
  if(value<5000) return 'under_5000';
  if(value<15000) return '5000_14999';
  if(value<25000) return '15000_24999';
  return '25000_plus';
}

export function differenceBand(difference:number){
  const value=safe(difference);
  if(value<500) return 'under_500';
  if(value<2000) return '500_1999';
  if(value<5000) return '2000_4999';
  return '5000_plus';
}
