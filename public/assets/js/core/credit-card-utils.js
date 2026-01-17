import { buildAmortizationSchedule, computeMonthlyPayment } from './loan-utils.js';

function roundToTwo(value) {
  return Math.round(value * 100) / 100;
}

function summarizeYearly(schedule) {
  const yearly = [];
  schedule.forEach((entry) => {
    const yearIndex = Math.ceil(entry.month / 12) - 1;
    if (!yearly[yearIndex]) {
      yearly[yearIndex] = {
        year: yearIndex + 1,
        payment: 0,
        interest: 0,
        balance: entry.balance,
      };
    }
    yearly[yearIndex].payment += entry.payment;
    yearly[yearIndex].interest += entry.interest;
    yearly[yearIndex].balance = entry.balance;
  });
  return yearly.filter(Boolean);
}

export function buildCreditCardSchedule({ balance, apr, paymentFn, rateFn, maxMonths = 720 }) {
  const schedule = [];
  let remaining = balance;
  let totalPayment = 0;
  let totalInterest = 0;
  let totalPrincipal = 0;
  let month = 0;

  while (remaining > 0 && month < maxMonths) {
    month += 1;
    const activeApr = rateFn ? rateFn(month) : apr;
    const monthlyRate = activeApr / 100 / 12;
    const interest = remaining * monthlyRate;
    let payment = paymentFn(remaining, interest, month, activeApr);
    if (!Number.isFinite(payment) || payment <= 0) {
      break;
    }
    payment = Math.min(payment, remaining + interest);
    const principal = Math.max(0, payment - interest);
    remaining = Math.max(0, remaining - principal);

    totalPayment += payment;
    totalInterest += interest;
    totalPrincipal += principal;

    schedule.push({
      month,
      payment,
      principal,
      interest,
      balance: remaining,
      apr: activeApr,
    });
  }

  return {
    schedule,
    totalPayment,
    totalInterest,
    totalPrincipal,
    months: schedule.length,
    balance: remaining,
  };
}

export function calculateCreditCardPayoff({ balance, apr, monthlyPayment, extraPayment = 0 }) {
  const payment = monthlyPayment + extraPayment;
  if (!Number.isFinite(balance) || balance <= 0) {
    return { error: 'Balance must be greater than 0.' };
  }
  if (!Number.isFinite(apr) || apr < 0) {
    return { error: 'APR must be 0 or higher.' };
  }
  if (!Number.isFinite(payment) || payment <= 0) {
    return { error: 'Monthly payment must be greater than 0.' };
  }

  const firstInterest = balance * (apr / 100 / 12);
  if (apr > 0 && payment <= firstInterest) {
    return { error: 'Payment is too low to reduce the balance.' };
  }

  const result = buildCreditCardSchedule({
    balance,
    apr,
    paymentFn: () => payment,
  });

  return {
    ...result,
    monthlyPayment: payment,
    yearly: summarizeYearly(result.schedule),
  };
}

export function calculateMinimumPayment({ balance, apr, minRate, minPayment }) {
  if (!Number.isFinite(balance) || balance <= 0) {
    return { error: 'Balance must be greater than 0.' };
  }
  if (!Number.isFinite(apr) || apr < 0) {
    return { error: 'APR must be 0 or higher.' };
  }

  const rate = Math.max(0, minRate);
  const floor = Math.max(0, minPayment);
  const firstPayment = Math.max((balance * rate) / 100, floor);
  const firstInterest = balance * (apr / 100 / 12);

  if (apr > 0 && firstPayment <= firstInterest) {
    return { error: 'Minimum payment is too low to reduce the balance.' };
  }

  const result = buildCreditCardSchedule({
    balance,
    apr,
    paymentFn: (remaining) => Math.max((remaining * rate) / 100, floor),
  });

  return {
    ...result,
    firstPayment: roundToTwo(firstPayment),
    lastPayment: result.schedule.at(-1)?.payment ?? 0,
    yearly: summarizeYearly(result.schedule),
  };
}

export function calculateBalanceTransfer({
  balance,
  transferFeePercent,
  promoApr,
  promoMonths,
  postApr,
  monthlyPayment,
}) {
  if (!Number.isFinite(balance) || balance <= 0) {
    return { error: 'Balance must be greater than 0.' };
  }
  if (!Number.isFinite(promoApr) || promoApr < 0 || !Number.isFinite(postApr) || postApr < 0) {
    return { error: 'APR values must be 0 or higher.' };
  }
  if (!Number.isFinite(promoMonths) || promoMonths < 0) {
    return { error: 'Promo months must be 0 or higher.' };
  }

  const fee = (balance * Math.max(0, transferFeePercent)) / 100;
  const startingBalance = balance + fee;
  const maxApr = Math.max(promoApr, postApr);
  const firstInterest = startingBalance * (maxApr / 100 / 12);

  if (!Number.isFinite(monthlyPayment) || monthlyPayment <= 0) {
    return { error: 'Monthly payment must be greater than 0.' };
  }
  if (maxApr > 0 && monthlyPayment <= firstInterest) {
    return { error: 'Payment is too low to reduce the balance after promo ends.' };
  }

  const result = buildCreditCardSchedule({
    balance: startingBalance,
    apr: promoApr,
    rateFn: (month) => (month <= promoMonths ? promoApr : postApr),
    paymentFn: () => monthlyPayment,
  });

  return {
    ...result,
    fee,
    startingBalance,
    yearly: summarizeYearly(result.schedule),
  };
}

export function calculateConsolidation({
  balance,
  currentApr,
  currentPayment,
  consolidationApr,
  termMonths,
  fees = 0,
}) {
  if (!Number.isFinite(balance) || balance <= 0) {
    return { error: 'Balance must be greater than 0.' };
  }
  if (!Number.isFinite(currentApr) || currentApr < 0) {
    return { error: 'Current APR must be 0 or higher.' };
  }
  if (!Number.isFinite(consolidationApr) || consolidationApr < 0) {
    return { error: 'Consolidation APR must be 0 or higher.' };
  }
  if (!Number.isFinite(termMonths) || termMonths <= 0) {
    return { error: 'Consolidation term must be greater than 0.' };
  }
  if (!Number.isFinite(currentPayment) || currentPayment <= 0) {
    return { error: 'Current payment must be greater than 0.' };
  }

  const current = calculateCreditCardPayoff({
    balance,
    apr: currentApr,
    monthlyPayment: currentPayment,
    extraPayment: 0,
  });

  if (current.error) {
    return { error: current.error };
  }

  const newBalance = balance + Math.max(0, fees);
  const months = Math.max(1, Math.round(termMonths));
  const newMonthlyPayment = computeMonthlyPayment(newBalance, consolidationApr, months);
  const newSchedule = buildAmortizationSchedule({
    principal: newBalance,
    annualRate: consolidationApr,
    months,
  });

  return {
    current,
    consolidation: {
      balance: newBalance,
      monthlyPayment: newMonthlyPayment,
      totalInterest: newSchedule.totalInterest,
      totalPayment: newSchedule.totalPayment,
      months: newSchedule.months,
      schedule: newSchedule.schedule,
    },
    monthlyDifference: currentPayment - newMonthlyPayment,
    interestDifference: current.totalInterest - newSchedule.totalInterest,
    totalDifference: current.totalPayment - newSchedule.totalPayment,
  };
}
