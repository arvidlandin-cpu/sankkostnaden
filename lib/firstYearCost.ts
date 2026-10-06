export type FirstYearCostInput = {
  campaignPrice: number;
  campaignMonths: number;
  regularPrice: number;
  monthlyExtras: number;
  oneTimeFees: number;
};

export type FirstYearCostResult = {
  campaignMonths: number;
  regularMonths: number;
  campaignCost: number;
  regularCost: number;
  extrasCost: number;
  oneTimeFees: number;
  total: number;
  effectiveMonthly: number;
};

const nonNegative = (value: number) => Number.isFinite(value) ? Math.max(0, value) : 0;

export function calculateFirstYearCost(input: FirstYearCostInput): FirstYearCostResult {
  const campaignMonths = Math.min(12, Math.max(0, Math.round(nonNegative(input.campaignMonths))));
  const regularMonths = 12 - campaignMonths;
  const campaignPrice = nonNegative(input.campaignPrice);
  const regularPrice = nonNegative(input.regularPrice);
  const monthlyExtras = nonNegative(input.monthlyExtras);
  const oneTimeFees = nonNegative(input.oneTimeFees);

  const campaignCost = campaignPrice * campaignMonths;
  const regularCost = regularPrice * regularMonths;
  const extrasCost = monthlyExtras * 12;
  const total = campaignCost + regularCost + extrasCost + oneTimeFees;

  return {
    campaignMonths,
    regularMonths,
    campaignCost,
    regularCost,
    extrasCost,
    oneTimeFees,
    total,
    effectiveMonthly: total / 12,
  };
}
