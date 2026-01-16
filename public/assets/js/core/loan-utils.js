export function computeMonthlyPayment(principal, annualRate, months) {
  if (!Number.isFinite(principal) || !Number.isFinite(months) || months <= 0) {
    return 0;
  }
  const monthlyRate = annualRate / 100 / 12;
  if (!Number.isFinite(monthlyRate)) {
    return 0;
  }
  if (monthlyRate === 0) {
    return principal / months;
  }
  const factor = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * factor) / (factor - 1);
}

export function computePrincipalFromPayment(payment, annualRate, months) {
  if (!Number.isFinite(payment) || payment <= 0 || !Number.isFinite(months) || months <= 0) {
    return 0;
  }
  const monthlyRate = annualRate / 100 / 12;
  if (!Number.isFinite(monthlyRate)) {
    return 0;
  }
  if (monthlyRate === 0) {
    return payment * months;
  }
  const factor = Math.pow(1 + monthlyRate, months);
  return payment * ((factor - 1) / (monthlyRate * factor));
}

function buildSchedule({
  principal,
  annualRate,
  months,
  payment,
  extraMonthly = 0,
  interestBalanceFn,
}) {
  const schedule = [];
  const monthlyRate = annualRate / 100 / 12;
  const basePayment =
    Number.isFinite(payment) && payment > 0
      ? payment
      : computeMonthlyPayment(principal, annualRate, months);

  let balance = principal;
  let month = 0;
  let totalPayment = 0;
  let totalInterest = 0;
  let totalPrincipal = 0;
  let totalExtra = 0;
  const maxMonths = months + 1200;

  while (balance > 0 && month < maxMonths) {
    month += 1;
    const interestBase = interestBalanceFn ? interestBalanceFn(balance, month) : balance;
    const interest = interestBase * monthlyRate;
    let principalPayment = basePayment - interest;
    if (principalPayment < 0) {
      principalPayment = 0;
    }

    let extraPayment = extraMonthly > 0 ? extraMonthly : 0;
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

export function buildAmortizationSchedule({
  principal,
  annualRate,
  months,
  payment,
  extraMonthly = 0,
}) {
  return buildSchedule({ principal, annualRate, months, payment, extraMonthly });
}

function buildRateChangeSchedule({
  principal,
  annualRate,
  newAnnualRate,
  months,
  changeAfterMonths,
}) {
  const initialMonths = Math.min(Math.max(0, Math.round(changeAfterMonths || 0)), months);
  const initialPayment = computeMonthlyPayment(principal, annualRate, months);
  const firstSegment =
    initialMonths > 0
      ? buildSchedule({
          principal,
          annualRate,
          months: initialMonths,
          payment: initialPayment,
        })
      : {
          schedule: [],
          totalPayment: 0,
          totalInterest: 0,
          totalPrincipal: 0,
          totalExtra: 0,
          months: 0,
        };

  const remainingMonths = Math.max(0, months - initialMonths);
  const remainingBalance = firstSegment.schedule.length
    ? firstSegment.schedule[firstSegment.schedule.length - 1].balance
    : principal;

  let newPayment = initialPayment;
  let secondSegment = {
    schedule: [],
    totalPayment: 0,
    totalInterest: 0,
    totalPrincipal: 0,
    totalExtra: 0,
    months: 0,
  };

  if (remainingMonths > 0 && remainingBalance > 0) {
    newPayment = computeMonthlyPayment(remainingBalance, newAnnualRate, remainingMonths);
    secondSegment = buildSchedule({
      principal: remainingBalance,
      annualRate: newAnnualRate,
      months: remainingMonths,
      payment: newPayment,
    });
  }

  const schedule = [
    ...firstSegment.schedule,
    ...secondSegment.schedule.map((entry) => ({
      ...entry,
      month: entry.month + initialMonths,
    })),
  ];

  return {
    schedule,
    paymentBefore: initialPayment,
    paymentAfter: newPayment,
    changeMonth: initialMonths,
    totalPayment: firstSegment.totalPayment + secondSegment.totalPayment,
    totalInterest: firstSegment.totalInterest + secondSegment.totalInterest,
    totalPrincipal: firstSegment.totalPrincipal + secondSegment.totalPrincipal,
    months: schedule.length,
  };
}

function aggregateYearly(schedule, totalMonths) {
  const yearly = [];
  schedule.forEach((entry) => {
    const yearIndex = Math.ceil(entry.month / 12) - 1;
    if (!yearly[yearIndex]) {
      yearly[yearIndex] = {
        year: yearIndex + 1,
        payment: 0,
        principal: 0,
        interest: 0,
        extra: 0,
        balance: entry.balance,
      };
    }
    const record = yearly[yearIndex];
    record.payment += entry.payment;
    record.principal += entry.principal;
    record.interest += entry.interest;
    record.extra += entry.extra;
    record.balance = entry.balance;
  });

  if (Number.isFinite(totalMonths)) {
    const totalYears = Math.ceil(totalMonths / 12);
    for (let yearIndex = yearly.length; yearIndex < totalYears; yearIndex += 1) {
      yearly[yearIndex] = {
        year: yearIndex + 1,
        payment: 0,
        principal: 0,
        interest: 0,
        extra: 0,
        balance: 0,
      };
    }
  }

  return yearly.filter(Boolean);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function calculateBuyToLet({
  propertyPrice,
  depositType,
  depositAmount,
  depositPercent,
  annualRate,
  termYears,
  mortgageType,
  monthlyRent,
  vacancyType,
  vacancyPercent,
  vacancyMonths,
  agentFeePercent,
  maintenanceMonthly,
  otherCostsMonthly,
}) {
  const price = propertyPrice;
  let depositValue = depositAmount;
  let depositPct = depositPercent;

  if (depositType === 'percent') {
    depositPct = clamp(depositPct, 0, 99.99);
    depositValue = (price * depositPct) / 100;
  } else {
    depositValue = clamp(depositValue, 0, price);
    depositPct = price > 0 ? (depositValue / price) * 100 : 0;
  }

  const loanAmount = Math.max(0, price - depositValue);
  const monthlyRate = annualRate / 100 / 12;
  const months = Math.round(termYears * 12);

  const monthlyMortgage =
    mortgageType === 'repayment'
      ? computeMonthlyPayment(loanAmount, annualRate, months)
      : loanAmount * monthlyRate;

  const vacancyPct =
    vacancyType === 'months'
      ? clamp((vacancyMonths / 12) * 100, 0, 100)
      : clamp(vacancyPercent, 0, 100);

  const effectiveRent = monthlyRent * (1 - vacancyPct / 100);
  const agentFee = effectiveRent * (agentFeePercent / 100);
  const monthlyCosts = maintenanceMonthly + otherCostsMonthly + agentFee;
  const netMonthlyCashflow = effectiveRent - monthlyCosts - monthlyMortgage;
  const annualCashflow = netMonthlyCashflow * 12;
  const grossYield = price > 0 ? ((monthlyRent * 12) / price) * 100 : 0;
  const netYield = price > 0 ? (annualCashflow / price) * 100 : 0;
  const interestOnlyPayment = loanAmount * monthlyRate;
  const stressCoverage = interestOnlyPayment > 0 ? effectiveRent / interestOnlyPayment : 0;

  let cumulative = 0;
  const projection = Array.from({ length: Math.max(1, Math.round(termYears)) }, (_, index) => {
    const year = index + 1;
    const rentIncome = effectiveRent * 12;
    const costs = monthlyCosts * 12;
    const mortgageCost = monthlyMortgage * 12;
    const netCashflow = netMonthlyCashflow * 12;
    cumulative += netCashflow;
    return {
      year,
      rentIncome,
      costs,
      mortgageCost,
      netCashflow,
      cumulativeCashflow: cumulative,
    };
  });

  const cashflowSeries = projection.map((entry) => ({
    year: entry.year,
    value: entry.netCashflow,
  }));

  const minRate = Math.max(0, annualRate - 2);
  const maxRate = annualRate + 2;
  const sensitivityRates = [];
  for (let rate = minRate; rate <= maxRate + 0.001; rate += 0.5) {
    sensitivityRates.push(Number(rate.toFixed(2)));
  }

  const sensitivitySeries = sensitivityRates.map((rate) => {
    const rateMonthly = rate / 100 / 12;
    const payment =
      mortgageType === 'repayment'
        ? computeMonthlyPayment(loanAmount, rate, months)
        : loanAmount * rateMonthly;
    const netMonthly = effectiveRent - monthlyCosts - payment;
    return { rate, value: netMonthly };
  });

  return {
    price,
    depositAmount: depositValue,
    depositPercent: depositPct,
    loanAmount,
    annualRate,
    termYears,
    mortgageType,
    monthlyRent,
    vacancyPercent: vacancyPct,
    agentFeePercent,
    maintenanceMonthly,
    otherCostsMonthly,
    monthlyMortgage,
    effectiveRent,
    monthlyCosts,
    netMonthlyCashflow,
    annualCashflow,
    grossYield,
    netYield,
    stressCoverage,
    projection,
    cashflowSeries,
    sensitivitySeries,
  };
}

export function calculateInterestRateChange({
  balance,
  currentRate,
  newRate,
  termYears,
  changeTiming,
  changeAfterMonths,
}) {
  const months = Math.round(termYears * 12);
  const baseline = buildAmortizationSchedule({
    principal: balance,
    annualRate: currentRate,
    months,
  });

  const changeMonths = changeTiming === 'after' ? Math.max(0, Math.round(changeAfterMonths)) : 0;
  const changed = buildRateChangeSchedule({
    principal: balance,
    annualRate: currentRate,
    newAnnualRate: newRate,
    months,
    changeAfterMonths: changeMonths,
  });

  const yearlyBaseline = aggregateYearly(baseline.schedule, months);
  const yearlyNew = aggregateYearly(changed.schedule, months);

  const paymentTimelineBaseline = Array.from({ length: months }, () => baseline.monthlyPayment);
  const paymentTimelineNew = Array.from({ length: months }, (_, index) =>
    index < changed.changeMonth ? changed.paymentBefore : changed.paymentAfter
  );

  const monthlyDifference = changed.paymentAfter - baseline.monthlyPayment;
  const annualDifference = monthlyDifference * 12;

  return {
    balance,
    currentRate,
    newRate,
    termYears,
    months,
    changeMonths: changed.changeMonth,
    baselinePayment: baseline.monthlyPayment,
    newPayment: changed.paymentAfter,
    monthlyDifference,
    annualDifference,
    totalInterestBaseline: baseline.totalInterest,
    totalInterestNew: changed.totalInterest,
    yearlyBaseline,
    yearlyNew,
    paymentTimelineBaseline,
    paymentTimelineNew,
  };
}

export function calculateLtv({
  propertyValue,
  mode,
  loanAmount,
  depositType,
  depositAmount,
  depositPercent,
}) {
  const value = propertyValue;
  let loan = loanAmount;
  let depositValue = depositAmount;
  let depositPct = depositPercent;

  if (mode === 'deposit') {
    if (depositType === 'percent') {
      depositPct = clamp(depositPct, 0, 99.99);
      depositValue = (value * depositPct) / 100;
    } else {
      depositValue = clamp(depositValue, 0, value);
      depositPct = value > 0 ? (depositValue / value) * 100 : 0;
    }
    loan = Math.max(0, value - depositValue);
  } else {
    loan = clamp(loan, 0, value);
    depositValue = Math.max(0, value - loan);
    depositPct = value > 0 ? (depositValue / value) * 100 : 0;
  }

  const ltv = value > 0 ? (loan / value) * 100 : 0;
  const bucket =
    ltv <= 60
      ? '60% or lower'
      : ltv <= 75
        ? 'Up to 75%'
        : ltv <= 80
          ? 'Up to 80%'
          : ltv <= 85
            ? 'Up to 85%'
            : ltv <= 90
              ? 'Up to 90%'
              : ltv <= 95
                ? 'Up to 95%'
                : 'Above 95%';

  const highRisk = ltv > 95;

  return {
    propertyValue: value,
    loanAmount: loan,
    depositAmount: depositValue,
    depositPercent: depositPct,
    ltv,
    bucket,
    highRisk,
  };
}

export function calculateRemortgage({
  balance,
  currentRate,
  remainingYears,
  currentPayment,
  newRate,
  newTermYears,
  newFees,
  exitFees,
  legalFees,
  horizonYears,
}) {
  const remainingMonths = Math.round(remainingYears * 12);
  const calculatedPayment = computeMonthlyPayment(balance, currentRate, remainingMonths);
  const baselinePayment = currentPayment > 0 ? currentPayment : calculatedPayment;

  const targetTermYears = newTermYears > 0 ? newTermYears : remainingYears;
  const newMonths = Math.round(targetTermYears * 12);
  const newPayment = computeMonthlyPayment(balance, newRate, newMonths);

  const fees = newFees + exitFees + legalFees;
  const horizonMonths = Math.round(horizonYears * 12);

  const costSeries = Array.from({ length: horizonMonths }, (_, index) => {
    const month = index + 1;
    const currentCost = baselinePayment * month;
    const newCost = newPayment * month + fees;
    return {
      month,
      currentCost,
      newCost,
      savings: currentCost - newCost,
    };
  });

  const totalCurrent = baselinePayment * horizonMonths;
  const totalNew = newPayment * horizonMonths + fees;
  const totalSavings = totalCurrent - totalNew;

  let breakEvenMonth = null;
  for (const row of costSeries) {
    if (row.savings >= 0) {
      breakEvenMonth = row.month;
      break;
    }
  }

  return {
    balance,
    currentRate,
    remainingYears,
    currentPayment,
    calculatedPayment,
    baselinePayment,
    newRate,
    newTermYears: targetTermYears,
    newPayment,
    fees,
    horizonYears,
    horizonMonths,
    monthlyDifference: baselinePayment - newPayment,
    annualDifference: (baselinePayment - newPayment) * 12,
    totalCurrent,
    totalNew,
    totalSavings,
    breakEvenMonth,
    costSeries,
  };
}

function buildOffsetScheduleWithSavings({
  principal,
  annualRate,
  months,
  payment,
  offsetBalance,
  offsetContribution,
  offsetMode,
}) {
  const schedule = [];
  const monthlyRate = annualRate / 100 / 12;
  const multiplier = offsetMode === 'partial' ? 0.5 : 1;
  let balance = principal;
  let savingsBalance = offsetBalance;
  let month = 0;
  let totalPayment = 0;
  let totalInterest = 0;
  let totalPrincipal = 0;
  const maxMonths = months + 1200;

  while (balance > 0 && month < maxMonths) {
    month += 1;
    const interestBase = Math.max(0, balance - savingsBalance * multiplier);
    const interest = interestBase * monthlyRate;
    let principalPayment = payment - interest;
    if (principalPayment < 0) {
      principalPayment = 0;
    }
    if (principalPayment > balance) {
      principalPayment = balance;
    }
    const paymentTotal = interest + principalPayment;
    balance -= principalPayment;

    totalPayment += paymentTotal;
    totalInterest += interest;
    totalPrincipal += principalPayment;

    schedule.push({
      month,
      payment: paymentTotal,
      principal: principalPayment,
      interest,
      extra: 0,
      balance: Math.max(0, balance),
      offsetBalance: savingsBalance,
    });

    savingsBalance += offsetContribution;
  }

  return {
    schedule,
    totalPayment,
    totalInterest,
    totalPrincipal,
    totalExtra: 0,
    months: schedule.length,
    monthlyPayment: payment,
  };
}

export function calculateOffset({
  balance,
  annualRate,
  termYears,
  offsetBalance,
  offsetContribution,
  offsetMode,
}) {
  const months = Math.round(termYears * 12);
  const baseline = buildAmortizationSchedule({
    principal: balance,
    annualRate,
    months,
  });

  const offset = buildOffsetScheduleWithSavings({
    principal: balance,
    annualRate,
    months,
    payment: baseline.monthlyPayment,
    offsetBalance,
    offsetContribution,
    offsetMode,
  });

  const interestSaved = baseline.totalInterest - offset.totalInterest;
  const timeSaved = baseline.months - offset.months;
  const multiplier = offsetMode === 'partial' ? 0.5 : 1;
  const effectiveBalance = Math.max(0, balance - offsetBalance * multiplier);

  const totalYears = Math.ceil(months / 12);
  const yearlyRows = [];
  const baselineYearly = aggregateYearly(baseline.schedule, months);
  const offsetYearly = aggregateYearly(offset.schedule, months);

  for (let year = 1; year <= totalYears; year += 1) {
    const baseYear = baselineYearly[year - 1] || { interest: 0 };
    const offsetYear = offsetYearly[year - 1] || { interest: 0, balance: 0 };
    const startMonth = (year - 1) * 12 + 1;
    const endMonth = Math.min(year * 12, months);
    const startSavings = offsetBalance + offsetContribution * (startMonth - 1);
    const endSavings = offsetBalance + offsetContribution * endMonth;

    yearlyRows.push({
      year,
      savingsStart: startSavings,
      savingsEnd: endSavings,
      interestBaseline: baseYear.interest,
      interestOffset: offsetYear.interest,
      interestSaved: baseYear.interest - offsetYear.interest,
      endingBalance: offsetYear.balance,
    });
  }

  const baselineInterestSeries = baselineYearly.map((entry) => entry.interest);
  const offsetInterestSeries = offsetYearly.map((entry) => entry.interest);

  return {
    balance,
    annualRate,
    termYears,
    offsetBalance,
    offsetContribution,
    offsetMode,
    payment: baseline.monthlyPayment,
    baseline,
    offset,
    interestSaved,
    timeSaved,
    effectiveBalance,
    yearlyRows,
    baselineInterestSeries,
    offsetInterestSeries,
  };
}

export function calculateBorrow({
  grossIncomeAnnual,
  netIncomeMonthly,
  incomeBasis,
  expensesMonthly,
  debtMonthly,
  interestRate,
  termYears,
  method,
  incomeMultiple,
  paymentCapPercent,
  deposit,
}) {
  const months = Math.round(termYears * 12);
  const monthlyIncome = incomeBasis === 'net' ? netIncomeMonthly : grossIncomeAnnual / 12;

  const totalOutgoings = expensesMonthly + debtMonthly;
  const hasAffordabilityGap = monthlyIncome - totalOutgoings <= 0;

  let maxBorrow = 0;
  let monthlyPayment = 0;
  let maxPayment = 0;

  const annualIncomeForMultiple = incomeBasis === 'net' ? netIncomeMonthly * 12 : grossIncomeAnnual;

  if (method === 'payment') {
    maxPayment = monthlyIncome * (paymentCapPercent / 100) - totalOutgoings;
    if (maxPayment > 0) {
      maxBorrow = computePrincipalFromPayment(maxPayment, interestRate, months);
      monthlyPayment = computeMonthlyPayment(maxBorrow, interestRate, months);
    }
  } else {
    maxBorrow = annualIncomeForMultiple * incomeMultiple;
    monthlyPayment = computeMonthlyPayment(maxBorrow, interestRate, months);
    maxPayment = monthlyPayment;
  }

  const maxPropertyPrice = deposit > 0 ? maxBorrow + deposit : null;

  const basePaymentForGraph = monthlyPayment;
  const minRate = Math.max(0, interestRate - 2);
  const maxRate = interestRate + 2;
  const rateSeries = [];
  for (let rate = minRate; rate <= maxRate + 0.001; rate += 0.5) {
    const borrowAtRate =
      basePaymentForGraph > 0 ? computePrincipalFromPayment(basePaymentForGraph, rate, months) : 0;
    rateSeries.push({ rate: Number(rate.toFixed(2)), value: borrowAtRate });
  }

  return {
    grossIncomeAnnual,
    netIncomeMonthly,
    incomeBasis,
    expensesMonthly,
    debtMonthly,
    interestRate,
    termYears,
    method,
    incomeMultiple,
    paymentCapPercent,
    deposit,
    monthlyIncome,
    totalOutgoings,
    hasAffordabilityGap,
    maxPayment,
    maxBorrow,
    monthlyPayment,
    maxPropertyPrice,
    rateSeries,
  };
}
