export type QuotedRepayment={
  monthlyInstallment:number;
  monthlyFee:number;
  setupFee:number;
  numberOfMonths:number;
};

export type LoanTotals={
  monthlyOutlay:number;
  totalPaid:number;
  loanCost:number;
  numberOfMonths:number;
};

const clean=(value:number)=>Number.isFinite(value)?Math.max(0,value):0;

/**
 * Uses the payment amounts actually written in a consumer offer, NOT a
 * calculated APR, offer quote or a forecast for adjustable-rate contracts.
 * Monthly installment must exclude any separately entered monthly fee.
 */
export function repaymentTotals(principal:number,offer:QuotedRepayment):LoanTotals|null{
  const amount=clean(principal);
  const months=Math.round(clean(offer.numberOfMonths));
  if(amount<=0||months<1||months>600||clean(offer.monthlyInstallment)<=0)return null;
  const monthlyOutlay=clean(offer.monthlyInstallment)+clean(offer.monthlyFee);
  const totalPaid=(monthlyOutlay*months)+clean(offer.setupFee);
  // If total paid is below the debt, a residual payment, missing item or
  // inconsistent quote may exist. Do not show it as a cheap loan.
  if(!Number.isFinite(totalPaid)||totalPaid<amount)return null;
  return {
    monthlyOutlay,
    totalPaid,
    loanCost:totalPaid-amount,
    numberOfMonths:months,
  };
}

export function compareQuotedRepayments(principal:number,offerA:QuotedRepayment,offerB:QuotedRepayment){
  const a=repaymentTotals(principal,offerA);
  const b=repaymentTotals(principal,offerB);
  if(!a||!b)return null;
  return {
    a,b,
    cheaperTotal:a.totalPaid===b.totalPaid?'same':a.totalPaid<b.totalPaid?'A':'B',
    totalDifference:Math.abs(a.totalPaid-b.totalPaid),
    lowerMonthly:a.monthlyOutlay===b.monthlyOutlay?'same':a.monthlyOutlay<b.monthlyOutlay?'A':'B',
    monthlyDifference:Math.abs(a.monthlyOutlay-b.monthlyOutlay),
  } as const;
}
