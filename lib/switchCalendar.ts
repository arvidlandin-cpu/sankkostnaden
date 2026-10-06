export type SwitchCategory = 'el' | 'bredband';
export type ContractMode = 'fixed' | 'rolling';
export type NoticeUnit = 'days' | 'months';

export type SwitchPlanInput = {
  category: SwitchCategory;
  mode: ContractMode;
  referenceDate: string;
  noticeValue: number;
  noticeUnit: NoticeUnit;
};

export type SwitchPlanResult = {
  actionDate: string;
  plannedEndDate: string;
  nextStartDate: string;
};

function parseIsoDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) throw new Error('Ogiltigt datum');
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  if (
    date.getUTCFullYear() !== Number(match[1]) ||
    date.getUTCMonth() !== Number(match[2]) - 1 ||
    date.getUTCDate() !== Number(match[3])
  ) throw new Error('Ogiltigt datum');
  return date;
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function shiftDays(date: Date, days: number) {
  const next = new Date(date.getTime());
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function shiftMonthsClamped(date: Date, months: number) {
  const day = date.getUTCDate();
  const target = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + months, 1));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(day, lastDay));
  return target;
}

function shiftNotice(date: Date, value: number, unit: NoticeUnit, direction: 1 | -1) {
  const safe = Math.max(0, Math.round(Number.isFinite(value) ? value : 0));
  return unit === 'months'
    ? shiftMonthsClamped(date, safe * direction)
    : shiftDays(date, safe * direction);
}

export function calculateSwitchPlan(input: SwitchPlanInput): SwitchPlanResult {
  const reference = parseIsoDate(input.referenceDate);

  if (input.mode === 'fixed') {
    const actionDate = shiftNotice(reference, input.noticeValue, input.noticeUnit, -1);
    return {
      actionDate: toIsoDate(actionDate),
      plannedEndDate: toIsoDate(reference),
      nextStartDate: toIsoDate(shiftDays(reference, 1)),
    };
  }

  const plannedEndDate = shiftNotice(reference, input.noticeValue, input.noticeUnit, 1);
  return {
    actionDate: toIsoDate(reference),
    plannedEndDate: toIsoDate(plannedEndDate),
    nextStartDate: toIsoDate(shiftDays(plannedEndDate, 1)),
  };
}

export function daysBetween(fromIso: string, toIso: string) {
  const from = parseIsoDate(fromIso);
  const to = parseIsoDate(toIso);
  return Math.round((to.getTime() - from.getTime()) / 86400000);
}
