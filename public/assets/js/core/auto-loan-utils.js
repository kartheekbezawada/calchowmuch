import { buildAmortizationSchedule, computeMonthlyPayment } from './loan-utils.js';

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
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

export function calculateCarLoan({
  price,
  downPaymentType,
  downPaymentAmount,
  downPaymentPercent,
  tradeIn,
  fees,
  taxRate,
  apr,
  termYears,
}) {
  const vehiclePrice = Math.max(0, price);
  const tradeValue = Math.max(0, tradeIn);
  const feeTotal = Math.max(0, fees);
  const taxBase = Math.max(0, vehiclePrice - tradeValue);
  const taxAmount = (taxBase * Math.max(0, taxRate)) / 100;

  let downPayment = downPaymentAmount;
  let downPercent = downPaymentPercent;
  if (downPaymentType === 'percent') {
    downPercent = clamp(downPercent, 0, 99.99);
    downPayment = (vehiclePrice * downPercent) / 100;
  } else {
    downPayment = clamp(downPayment, 0, vehiclePrice);
    downPercent = vehiclePrice > 0 ? (downPayment / vehiclePrice) * 100 : 0;
  }

  const amountFinanced = Math.max(
    0,
    vehiclePrice - downPayment - tradeValue + feeTotal + taxAmount
  );
  const months = Math.max(1, Math.round(termYears * 12));
  const monthlyPayment = computeMonthlyPayment(amountFinanced, apr, months);
  const schedule = buildAmortizationSchedule({
    principal: amountFinanced,
    annualRate: apr,
    months,
  });

  return {
    price: vehiclePrice,
    downPayment,
    downPaymentPercent: downPercent,
    tradeIn: tradeValue,
    fees: feeTotal,
    taxRate: Math.max(0, taxRate),
    taxAmount,
    amountFinanced,
    monthlyPayment,
    totalInterest: schedule.totalInterest,
    totalPayment: schedule.totalPayment,
    totalCost: schedule.totalPayment + downPayment,
    schedule: schedule.schedule,
    yearly: summarizeYearly(schedule.schedule),
    months: schedule.months,
    termYears,
  };
}

export function calculateMultipleCarLoan({ loanA, loanB }) {
  const buildLoan = (loan) => {
    const amount = Math.max(0, loan.amount);
    const rate = Math.max(0, loan.apr);
    const months = Math.max(1, Math.round(loan.termYears * 12));
    const monthlyPayment = computeMonthlyPayment(amount, rate, months);
    const schedule = buildAmortizationSchedule({ principal: amount, annualRate: rate, months });
    return {
      ...loan,
      amount,
      rate,
      months,
      monthlyPayment,
      totalInterest: schedule.totalInterest,
      totalPayment: schedule.totalPayment,
      schedule: schedule.schedule,
    };
  };

  const loanOne = buildLoan(loanA);
  const loanTwo = buildLoan(loanB);

  return {
    loanA: loanOne,
    loanB: loanTwo,
    combined: {
      monthlyPayment: loanOne.monthlyPayment + loanTwo.monthlyPayment,
      totalInterest: loanOne.totalInterest + loanTwo.totalInterest,
      totalPayment: loanOne.totalPayment + loanTwo.totalPayment,
    },
  };
}

export function computeBalloonPayment(principal, apr, months, balloon = 0) {
  const rate = apr / 100 / 12;
  if (!Number.isFinite(principal) || !Number.isFinite(months) || months <= 0) {
    return 0;
  }
  const cappedBalloon = Math.min(Math.max(0, balloon), principal);
  if (rate === 0) {
    return (principal - cappedBalloon) / months;
  }
  const discount = Math.pow(1 + rate, -months);
  return (principal - cappedBalloon * discount) * (rate / (1 - discount));
}

export function buildBalloonSchedule({ principal, apr, months, balloon }) {
  const payment = computeBalloonPayment(principal, apr, months, balloon);
  const rate = apr / 100 / 12;
  const schedule = [];
  let balance = principal;
  let totalInterest = 0;
  let totalPayment = 0;

  for (let month = 1; month <= months; month += 1) {
    const interest = balance * rate;
    let principalPayment = payment - interest;
    if (principalPayment < 0) {
      principalPayment = 0;
    }
    balance = Math.max(0, balance - principalPayment);
    totalInterest += interest;
    totalPayment += payment;

    schedule.push({
      month,
      payment,
      interest,
      principal: principalPayment,
      balance,
    });
  }

  return {
    schedule,
    monthlyPayment: payment,
    totalInterest,
    totalPayment,
    endingBalance: balance,
  };
}

export function calculateHirePurchase({ price, deposit, apr, termMonths, balloon = 0 }) {
  const vehiclePrice = Math.max(0, price);
  const depositValue = Math.max(0, deposit);
  const financed = Math.max(0, vehiclePrice - depositValue);
  const months = Math.max(1, Math.round(termMonths));
  const balloonValue = Math.min(Math.max(0, balloon), financed);

  const schedule = buildBalloonSchedule({
    principal: financed,
    apr,
    months,
    balloon: balloonValue,
  });

  return {
    price: vehiclePrice,
    deposit: depositValue,
    financed,
    apr,
    termMonths: months,
    balloon: balloonValue,
    monthlyPayment: schedule.monthlyPayment,
    totalInterest: schedule.totalInterest,
    totalPayable: schedule.totalPayment + balloon + depositValue,
    schedule: schedule.schedule,
    yearly: summarizeYearly(schedule.schedule),
  };
}

export function calculatePcp({ price, deposit, apr, termMonths, balloon, optionFee }) {
  const finalPayment = Math.max(0, balloon) + Math.max(0, optionFee);
  const result = calculateHirePurchase({
    price,
    deposit,
    apr,
    termMonths,
    balloon: finalPayment,
  });

  return {
    ...result,
    balloon: result.balloon,
    optionFee: Math.max(0, optionFee),
  };
}

export function calculateLease({
  price,
  residualType,
  residualValue,
  residualPercent,
  termMonths,
  moneyFactor,
  upfrontPayment,
}) {
  const vehiclePrice = Math.max(0, price);
  const upfront = Math.max(0, upfrontPayment);
  const months = Math.max(1, Math.round(termMonths));

  const residual =
    residualType === 'percent'
      ? (vehiclePrice * clamp(residualPercent, 0, 99.99)) / 100
      : Math.max(0, residualValue);

  const capCost = Math.max(0, vehiclePrice - upfront);
  const depreciationFee = (capCost - residual) / months;
  const financeFee = (capCost + residual) * Math.max(0, moneyFactor);
  const monthlyPayment = depreciationFee + financeFee;
  const totalLeaseCost = upfront + monthlyPayment * months;

  const schedule = [];
  let cumulative = upfront;
  for (let month = 1; month <= months; month += 1) {
    cumulative += monthlyPayment;
    schedule.push({
      month,
      payment: monthlyPayment,
      interest: financeFee,
      balance: Math.max(0, residual),
      cumulative,
    });
  }

  return {
    price: vehiclePrice,
    residual,
    residualType,
    termMonths: months,
    moneyFactor: Math.max(0, moneyFactor),
    upfrontPayment: upfront,
    monthlyPayment,
    totalLeaseCost,
    schedule,
    yearly: summarizeYearly(schedule),
  };
}
