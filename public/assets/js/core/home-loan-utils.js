import { computeMonthlyPayment } from './loan-utils.js';

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function parseStartDate(value) {
  if (!value) {
    return null;
  }
  const [yearPart, monthPart] = value.split('-');
  const year = Number(yearPart);
  const month = Number(monthPart);
  if (!Number.isFinite(year) || !Number.isFinite(month) || year < 1 || month < 1 || month > 12) {
    return null;
  }
  const date = new Date(year, month - 1, 1);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date;
}

export function addMonths(date, months) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

export function formatMonthYear(date) {
  return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatTerm(months) {
  const wholeMonths = Math.max(0, Math.round(months));
  const years = Math.floor(wholeMonths / 12);
  const remainingMonths = wholeMonths % 12;

  if (years === 0) {
    return `${remainingMonths} months`;
  }
  if (remainingMonths === 0) {
    return `${years} years`;
  }
  return `${years} years ${remainingMonths} months`;
}

export function buildHomeLoanSchedule({
  principal,
  annualRate,
  months,
  payment,
  extraMonthly = 0,
  lumpSum = 0,
  lumpSumMonth = null,
}) {
  const schedule = [];
  const monthlyRate = annualRate / 100 / 12;
  // Monthly payment formula: M = P[r(1+r)^n]/[(1+r)^n - 1]
  const basePayment =
    Number.isFinite(payment) && payment > 0
      ? payment
      : computeMonthlyPayment(principal, annualRate, months);

  let balance = principal;
  let totalPayment = 0;
  let totalInterest = 0;
  let totalPrincipal = 0;
  let totalExtra = 0;
  let month = 0;
  const maxMonths = months + 1200;

  while (balance > 0 && month < maxMonths) {
    month += 1;
    const interest = balance * monthlyRate;
    let principalPayment = basePayment - interest;
    if (principalPayment < 0) {
      principalPayment = 0;
    }

    let extraPayment = extraMonthly > 0 ? extraMonthly : 0;
    if (lumpSum > 0 && lumpSumMonth && month === lumpSumMonth) {
      extraPayment += lumpSum;
    }

    let totalPrincipalPayment = principalPayment + extraPayment;
    if (totalPrincipalPayment > balance) {
      totalPrincipalPayment = balance;
      extraPayment = Math.max(0, totalPrincipalPayment - principalPayment);
    }

    const paymentTotal = interest + totalPrincipalPayment;
    balance -= totalPrincipalPayment;

    totalPayment += paymentTotal;
    totalInterest += interest;
    totalPrincipal += totalPrincipalPayment;
    totalExtra += extraPayment;

    schedule.push({
      month,
      payment: paymentTotal,
      principal: totalPrincipalPayment,
      interest,
      extra: extraPayment,
      balance: Math.max(0, balance),
    });
  }

  return {
    schedule,
    totalPayment,
    totalInterest,
    totalPrincipal,
    totalExtra,
    months: schedule.length,
    monthlyPayment: basePayment,
  };
}

export function aggregateYearly(schedule, startDate) {
  const yearlyMap = new Map();
  const order = [];

  schedule.forEach((entry) => {
    const yearKey = startDate
      ? addMonths(startDate, entry.month - 1).getFullYear()
      : Math.ceil(entry.month / 12);
    if (!yearlyMap.has(yearKey)) {
      yearlyMap.set(yearKey, {
        year: yearKey,
        label: String(yearKey),
        payment: 0,
        principal: 0,
        interest: 0,
        extra: 0,
        balance: entry.balance,
      });
      order.push(yearKey);
    }
    const record = yearlyMap.get(yearKey);
    record.payment += entry.payment;
    record.principal += entry.principal;
    record.interest += entry.interest;
    record.extra += entry.extra;
    record.balance = entry.balance;
  });

  return order.map((yearKey, index) => {
    const record = yearlyMap.get(yearKey);
    const label = startDate ? String(yearKey) : String(index + 1);
    return { ...record, label, year: index + 1 };
  });
}

export function buildMonthlySeries(schedule, principal, totalMonths) {
  const series = new Array(totalMonths + 1).fill(0);
  series[0] = principal;
  schedule.forEach((entry) => {
    if (entry.month <= totalMonths) {
      series[entry.month] = entry.balance;
    }
  });
  return series;
}

export function buildYearlySeries(yearly, principal, totalYears) {
  const series = new Array(totalYears + 1).fill(0);
  series[0] = principal;
  yearly.forEach((entry) => {
    if (entry.year <= totalYears) {
      series[entry.year] = entry.balance;
    }
  });
  return series;
}
