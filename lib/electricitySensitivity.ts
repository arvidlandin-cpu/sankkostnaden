export type ElectricitySensitivityInput = {
  annualKwh: number;
  lowerPriceOrePerKwh: number;
  higherMonthlyFee: number;
};

export type ElectricitySensitivityResult = {
  variableSavings: number;
  additionalAnnualFee: number;
  netSaving: number;
  breakEvenAnnualKwh: number | null;
};

function safe(value:number):number{
  return Number.isFinite(value)?Math.max(0,value):0;
}

/**
 * Illustrative arithmetic only. The price difference and fees come from
 * user-entered numbers, not live electricity supplier quotes.
 */
export function electricitySensitivity(input:ElectricitySensitivityInput):ElectricitySensitivityResult{
  const annualKwh=safe(input.annualKwh);
  const lowerPriceOrePerKwh=safe(input.lowerPriceOrePerKwh);
  const higherMonthlyFee=safe(input.higherMonthlyFee);
  const variableSavings=annualKwh*lowerPriceOrePerKwh/100;
  const additionalAnnualFee=higherMonthlyFee*12;
  const netSaving=variableSavings-additionalAnnualFee;
  const breakEvenAnnualKwh=lowerPriceOrePerKwh>0
    ? additionalAnnualFee*100/lowerPriceOrePerKwh
    : null;
  return {variableSavings,additionalAnnualFee,netSaving,breakEvenAnnualKwh};
}
