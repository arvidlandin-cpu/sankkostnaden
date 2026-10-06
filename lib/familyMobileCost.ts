export type FamilyMobileCostInput = {
  people: number;
  separateMonthly: number[];
  campaignMonths: number;
  familyCampaignMain: number;
  familyCampaignExtra: number;
  familyRegularMain: number;
  familyRegularExtra: number;
  oneTimeFees: number;
};

export type FamilyMobileCostResult = {
  people: number;
  separateMonthlyTotal: number;
  separateAnnual: number;
  familyCampaignMonthly: number;
  familyRegularMonthly: number;
  familyAnnual: number;
  annualDifference: number;
  effectiveFamilyMonthly: number;
  winner: 'family' | 'separate' | 'same';
};

const safe = (value:number) => Number.isFinite(value) ? Math.max(0,value) : 0;

export function calculateFamilyMobileCost(input: FamilyMobileCostInput): FamilyMobileCostResult {
  const people=Math.min(5,Math.max(2,Math.round(safe(input.people) || 2)));
  const separateMonthlyTotal=input.separateMonthly.slice(0,people).reduce((sum,value)=>sum+safe(value),0);
  const separateAnnual=separateMonthlyTotal*12;
  const campaignMonths=Math.min(12,Math.max(0,Math.round(safe(input.campaignMonths))));
  const regularMonths=12-campaignMonths;
  const extraCount=Math.max(0,people-1);
  const familyCampaignMonthly=safe(input.familyCampaignMain)+(extraCount*safe(input.familyCampaignExtra));
  const familyRegularMonthly=safe(input.familyRegularMain)+(extraCount*safe(input.familyRegularExtra));
  const familyAnnual=(familyCampaignMonthly*campaignMonths)+(familyRegularMonthly*regularMonths)+safe(input.oneTimeFees);
  const annualDifference=separateAnnual-familyAnnual;
  return {
    people,
    separateMonthlyTotal,
    separateAnnual,
    familyCampaignMonthly,
    familyRegularMonthly,
    familyAnnual,
    annualDifference,
    effectiveFamilyMonthly: familyAnnual/12,
    winner: annualDifference>0?'family':annualDifference<0?'separate':'same',
  };
}
