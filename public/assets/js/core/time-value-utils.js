const COMPOUNDING_MAP = {
  annual: { periodsPerYear: 1, label: 'Annual' },
  semiannual: { periodsPerYear: 2, label: 'Semi-Annual' },
  quarterly: { periodsPerYear: 4, label: 'Quarterly' },
  monthly: { periodsPerYear: 12, label: 'Monthly' },
  daily: { periodsPerYear: 365, label: 'Daily' },
};

export function resolveCompounding(option) {
  return COMPOUNDING_MAP[option] ?? COMPOUNDING_MAP.annual;
}

export function calculatePresentValue({
  futureValue,
  discountRate,
  timePeriod,
  periodType = 'years',
  compounding = 'annual',
}) {
  const fv = Number(futureValue);
  const rate = Number(discountRate);
  const period = Number(timePeriod);

  if (!Number.isFinite(fv) || !Number.isFinite(rate) || !Number.isFinite(period)) {
    return null;
  }

  if (fv < 0 || rate < 0 || period < 0) {
    return null;
  }

  const { periodsPerYear } = resolveCompounding(compounding);
  const years = periodType === 'months' ? period / 12 : period;
  const totalPeriods = years * periodsPerYear;
  const periodicRate = rate / 100 / periodsPerYear;

  if (!Number.isFinite(totalPeriods) || !Number.isFinite(periodicRate)) {
    return null;
  }

  if (1 + periodicRate <= 0) {
    return null;
  }

  const presentValue = totalPeriods === 0 ? fv : fv / Math.pow(1 + periodicRate, totalPeriods);

  return {
    presentValue,
    totalPeriods,
    periodicRate,
    periodsPerYear,
  };
}

export function calculatePresentValueOfAnnuity({
  payment,
  discountRate,
  periods,
  periodType = 'years',
  compounding = null,
  annuityType = 'ordinary',
}) {
  const pmt = Number(payment);
  const rate = Number(discountRate);
  const periodCount = Number(periods);

  if (!Number.isFinite(pmt) || !Number.isFinite(rate) || !Number.isFinite(periodCount)) {
    return null;
  }

  if (pmt < 0 || rate < 0 || periodCount < 0) {
    return null;
  }

  const hasCompounding = Boolean(compounding);
  let totalPeriods = 0;
  let periodicRate = 0;
  let periodsPerYear = 1;

  if (hasCompounding) {
    const compoundingInfo = resolveCompounding(compounding);
    periodsPerYear = compoundingInfo.periodsPerYear;
    const years = periodType === 'months' ? periodCount / 12 : periodCount;
    totalPeriods = years * periodsPerYear;
    periodicRate = rate / 100 / periodsPerYear;
  } else {
    totalPeriods = periodCount;
    periodicRate = rate / 100;
    periodsPerYear = periodType === 'months' ? 12 : 1;
  }

  if (!Number.isFinite(totalPeriods) || !Number.isFinite(periodicRate)) {
    return null;
  }

  if (1 + periodicRate <= 0) {
    return null;
  }

  let presentValue = 0;

  if (totalPeriods > 0) {
    if (periodicRate === 0) {
      presentValue = pmt * totalPeriods;
    } else {
      presentValue = (pmt * (1 - Math.pow(1 + periodicRate, -totalPeriods))) / periodicRate;
    }
  }

  if (annuityType === 'due') {
    presentValue *= 1 + periodicRate;
  }

  const totalPayments = pmt * totalPeriods;

  return {
    presentValue,
    totalPayments,
    totalPeriods,
    periodicRate,
    periodsPerYear,
  };
}

export function calculateFutureValue({
  presentValue,
  interestRate,
  timePeriod,
  periodType = 'years',
  compounding = 'annual',
  regularContribution = 0,
}) {
  const pv = Number(presentValue);
  const rate = Number(interestRate);
  const period = Number(timePeriod);
  const contribution = Number(regularContribution);

  if (
    !Number.isFinite(pv) ||
    !Number.isFinite(rate) ||
    !Number.isFinite(period) ||
    !Number.isFinite(contribution)
  ) {
    return null;
  }

  if (pv < 0 || rate < 0 || period < 0 || contribution < 0) {
    return null;
  }

  const { periodsPerYear } = resolveCompounding(compounding);
  const years = periodType === 'months' ? period / 12 : period;
  const totalPeriods = years * periodsPerYear;
  const periodicRate = rate / 100 / periodsPerYear;

  if (!Number.isFinite(totalPeriods) || !Number.isFinite(periodicRate)) {
    return null;
  }

  if (1 + periodicRate <= 0) {
    return null;
  }

  const initialFutureValue = pv * Math.pow(1 + periodicRate, totalPeriods);
  let contributionFutureValue = 0;

  if (totalPeriods > 0 && contribution > 0) {
    if (periodicRate === 0) {
      contributionFutureValue = contribution * totalPeriods;
    } else {
      contributionFutureValue =
        contribution * ((Math.pow(1 + periodicRate, totalPeriods) - 1) / periodicRate);
    }
  }

  const futureValue = initialFutureValue + contributionFutureValue;
  const totalContributions = contribution * totalPeriods;
  const totalGrowth = futureValue - pv - totalContributions;

  return {
    futureValue,
    totalContributions,
    totalGrowth,
    totalPeriods,
    periodicRate,
    periodsPerYear,
  };
}

export function calculateFutureValueOfAnnuity({
  payment,
  interestRate,
  periods,
  periodType = 'years',
  compounding = null,
  annuityType = 'ordinary',
}) {
  const pmt = Number(payment);
  const rate = Number(interestRate);
  const periodCount = Number(periods);

  if (!Number.isFinite(pmt) || !Number.isFinite(rate) || !Number.isFinite(periodCount)) {
    return null;
  }

  if (pmt < 0 || rate < 0 || periodCount < 0) {
    return null;
  }

  const hasCompounding = Boolean(compounding);
  let totalPeriods = 0;
  let periodicRate = 0;
  let periodsPerYear = 1;

  if (hasCompounding) {
    const compoundingInfo = resolveCompounding(compounding);
    periodsPerYear = compoundingInfo.periodsPerYear;
    const years = periodType === 'months' ? periodCount / 12 : periodCount;
    totalPeriods = years * periodsPerYear;
    periodicRate = rate / 100 / periodsPerYear;
  } else {
    totalPeriods = periodCount;
    periodicRate = rate / 100;
    periodsPerYear = periodType === 'months' ? 12 : 1;
  }

  if (!Number.isFinite(totalPeriods) || !Number.isFinite(periodicRate)) {
    return null;
  }

  if (1 + periodicRate <= 0) {
    return null;
  }

  let futureValue = 0;

  if (totalPeriods > 0) {
    if (periodicRate === 0) {
      futureValue = pmt * totalPeriods;
    } else {
      futureValue = pmt * ((Math.pow(1 + periodicRate, totalPeriods) - 1) / periodicRate);
    }
  }

  if (annuityType === 'due') {
    futureValue *= 1 + periodicRate;
  }

  const totalPayments = pmt * totalPeriods;
  const totalInterest = futureValue - totalPayments;

  return {
    futureValue,
    totalPayments,
    totalInterest,
    totalPeriods,
    periodicRate,
    periodsPerYear,
  };
}

export function calculateSimpleInterest({
  principal,
  rate,
  timePeriod,
  timeUnit = 'years',
  interestBasis = 'per-year',
}) {
  const principalValue = Number(principal);
  const rateValue = Number(rate);
  const timeValue = Number(timePeriod);

  if (
    !Number.isFinite(principalValue) ||
    !Number.isFinite(rateValue) ||
    !Number.isFinite(timeValue)
  ) {
    return null;
  }

  if (principalValue < 0 || rateValue < 0 || timeValue < 0) {
    return null;
  }

  const rateDecimal = rateValue / 100;
  const months = timeUnit === 'months' ? timeValue : timeValue * 12;
  const years = timeUnit === 'months' ? timeValue / 12 : timeValue;
  const totalInterest =
    interestBasis === 'per-month'
      ? principalValue * rateDecimal * months
      : principalValue * rateDecimal * years;

  if (!Number.isFinite(totalInterest)) {
    return null;
  }

  return {
    principal: principalValue,
    rate: rateValue,
    timePeriod: timeValue,
    timeUnit,
    interestBasis,
    years,
    months,
    totalInterest,
    endingAmount: principalValue + totalInterest,
  };
}

function runSavingsPeriods({
  startingBalance,
  periods,
  periodicRate,
  contributionPerPeriod,
  contributionTiming,
}) {
  let balance = Number(startingBalance);
  let totalContributions = 0;

  if (!Number.isFinite(balance) || !Number.isFinite(periods) || periods < 0) {
    return null;
  }

  const wholePeriods = Math.floor(periods);
  const fractionalPeriod = periods - wholePeriods;

  for (let index = 0; index < wholePeriods; index += 1) {
    if (contributionTiming === 'beginning' && contributionPerPeriod > 0) {
      balance += contributionPerPeriod;
      totalContributions += contributionPerPeriod;
    }

    balance *= 1 + periodicRate;

    if (contributionTiming === 'end' && contributionPerPeriod > 0) {
      balance += contributionPerPeriod;
      totalContributions += contributionPerPeriod;
    }
  }

  if (fractionalPeriod > 0) {
    const partialContribution = contributionPerPeriod * fractionalPeriod;
    if (contributionTiming === 'beginning' && partialContribution > 0) {
      balance += partialContribution;
      totalContributions += partialContribution;
    }

    balance *= 1 + periodicRate * fractionalPeriod;

    if (contributionTiming === 'end' && partialContribution > 0) {
      balance += partialContribution;
      totalContributions += partialContribution;
    }
  }

  if (!Number.isFinite(balance) || !Number.isFinite(totalContributions)) {
    return null;
  }

  return {
    balance,
    totalContributions,
  };
}

export function calculateSavingsGoal({
  mode = 'time-to-goal',
  goalAmount,
  currentSavings,
  monthlyContribution = 0,
  targetTime = null,
  targetTimeUnit = 'months',
  annualRate = 0,
  compounding = 'monthly',
  contributionTiming = 'end',
  maxPeriods = 12000,
  maxBinaryIterations = 80,
  tolerance = 0.01,
}) {
  const goal = Number(goalAmount);
  const current = Number(currentSavings);
  const monthly = Number(monthlyContribution);
  const rate = Number(annualRate);
  const parsedTargetTime =
    targetTime === null || targetTime === undefined || targetTime === ''
      ? null
      : Number(targetTime);

  if (
    !Number.isFinite(goal) ||
    !Number.isFinite(current) ||
    !Number.isFinite(monthly) ||
    !Number.isFinite(rate)
  ) {
    return null;
  }

  if (goal <= 0 || current < 0 || monthly < 0 || rate < 0) {
    return null;
  }

  const { periodsPerYear, label: compoundingLabel } = resolveCompounding(compounding);
  const periodicRate = rate / 100 / periodsPerYear;

  if (!Number.isFinite(periodicRate) || periodsPerYear <= 0) {
    return null;
  }

  if (contributionTiming !== 'beginning' && contributionTiming !== 'end') {
    return null;
  }

  const contributionPerPeriod = monthly * (12 / periodsPerYear);

  if (mode === 'time-to-goal') {
    if (goal <= current) {
      return {
        mode,
        goalAmount: goal,
        currentSavings: current,
        monthlyContribution: monthly,
        requiredMonthlySavings: 0,
        annualRate: rate,
        compounding,
        compoundingLabel,
        contributionTiming,
        periodsPerYear,
        periodicRate,
        periodsToGoal: 0,
        monthsToGoal: 0,
        yearsPart: 0,
        remainingMonthsPart: 0,
        finalBalance: current,
        totalContributions: 0,
        totalInterestEarned: 0,
      };
    }

    if (monthly <= 0 && (rate <= 0 || current <= 0)) {
      return null;
    }

    let periods = 0;
    let balance = current;
    let totalContributions = 0;

    while (balance + tolerance < goal && periods < maxPeriods) {
      const step = runSavingsPeriods({
        startingBalance: balance,
        periods: 1,
        periodicRate,
        contributionPerPeriod,
        contributionTiming,
      });

      if (!step) {
        return null;
      }

      periods += 1;
      balance = step.balance;
      totalContributions += step.totalContributions;
    }

    if (balance + tolerance < goal) {
      return null;
    }

    const monthsToGoal = Math.ceil((periods * 12) / periodsPerYear);
    const yearsPart = Math.floor(monthsToGoal / 12);
    const remainingMonthsPart = monthsToGoal % 12;
    const totalInterestEarned = balance - current - totalContributions;

    return {
      mode,
      goalAmount: goal,
      currentSavings: current,
      monthlyContribution: monthly,
      requiredMonthlySavings: null,
      annualRate: rate,
      compounding,
      compoundingLabel,
      contributionTiming,
      periodsPerYear,
      periodicRate,
      periodsToGoal: periods,
      monthsToGoal,
      yearsPart,
      remainingMonthsPart,
      finalBalance: balance,
      totalContributions,
      totalInterestEarned,
    };
  }

  if (mode !== 'monthly-needed') {
    return null;
  }

  if (!Number.isFinite(parsedTargetTime) || parsedTargetTime <= 0) {
    return null;
  }

  const targetMonths = targetTimeUnit === 'years' ? parsedTargetTime * 12 : parsedTargetTime;
  const targetPeriods = (targetMonths / 12) * periodsPerYear;

  if (!Number.isFinite(targetPeriods) || targetPeriods <= 0) {
    return null;
  }

  if (goal <= current) {
    const projection = runSavingsPeriods({
      startingBalance: current,
      periods: targetPeriods,
      periodicRate,
      contributionPerPeriod: 0,
      contributionTiming,
    });

    if (!projection) {
      return null;
    }

    return {
      mode,
      goalAmount: goal,
      currentSavings: current,
      monthlyContribution: 0,
      requiredMonthlySavings: 0,
      annualRate: rate,
      compounding,
      compoundingLabel,
      contributionTiming,
      periodsPerYear,
      periodicRate,
      targetMonths,
      targetPeriods,
      finalBalance: projection.balance,
      totalContributions: 0,
      totalInterestEarned: projection.balance - current,
    };
  }

  if (rate === 0) {
    const needed = (goal - current) / targetMonths;
    const totalContributions = needed * targetMonths;
    const finalBalance = current + totalContributions;
    return {
      mode,
      goalAmount: goal,
      currentSavings: current,
      monthlyContribution: needed,
      requiredMonthlySavings: needed,
      annualRate: rate,
      compounding,
      compoundingLabel,
      contributionTiming,
      periodsPerYear,
      periodicRate,
      targetMonths,
      targetPeriods,
      finalBalance,
      totalContributions,
      totalInterestEarned: 0,
    };
  }

  const evaluateMonthlyContribution = (monthlyCandidate) => {
    const perPeriodCandidate = monthlyCandidate * (12 / periodsPerYear);
    const projection = runSavingsPeriods({
      startingBalance: current,
      periods: targetPeriods,
      periodicRate,
      contributionPerPeriod: perPeriodCandidate,
      contributionTiming,
    });
    if (!projection) {
      return null;
    }

    return {
      ...projection,
      monthlyCandidate,
    };
  };

  let low = 0;
  let high = Math.max((goal - current) / targetMonths, 1);
  let highProjection = evaluateMonthlyContribution(high);
  if (!highProjection) {
    return null;
  }

  let attempts = 0;
  while (highProjection.balance + tolerance < goal && attempts < 40) {
    high *= 2;
    highProjection = evaluateMonthlyContribution(high);
    if (!highProjection) {
      return null;
    }
    attempts += 1;
  }

  if (highProjection.balance + tolerance < goal) {
    return null;
  }

  for (let iteration = 0; iteration < maxBinaryIterations; iteration += 1) {
    const mid = (low + high) / 2;
    const midProjection = evaluateMonthlyContribution(mid);
    if (!midProjection) {
      return null;
    }

    if (midProjection.balance + tolerance >= goal) {
      high = mid;
      highProjection = midProjection;
    } else {
      low = mid;
    }
  }

  const requiredMonthlySavings = Math.max(0, Math.ceil(high * 100) / 100);
  const finalProjection = evaluateMonthlyContribution(requiredMonthlySavings);
  if (!finalProjection) {
    return null;
  }

  return {
    mode,
    goalAmount: goal,
    currentSavings: current,
    monthlyContribution: requiredMonthlySavings,
    requiredMonthlySavings,
    annualRate: rate,
    compounding,
    compoundingLabel,
    contributionTiming,
    periodsPerYear,
    periodicRate,
    targetMonths,
    targetPeriods,
    finalBalance: finalProjection.balance,
    totalContributions: finalProjection.totalContributions,
    totalInterestEarned: finalProjection.balance - current - finalProjection.totalContributions,
  };
}

export function calculateCompoundInterest({
  principal,
  annualRate,
  timePeriod,
  periodType = 'years',
  compounding = 'monthly',
  contribution = 0,
}) {
  const p = Number(principal);
  const rate = Number(annualRate);
  const period = Number(timePeriod);
  const contrib = Number(contribution);

  if (
    !Number.isFinite(p) ||
    !Number.isFinite(rate) ||
    !Number.isFinite(period) ||
    !Number.isFinite(contrib)
  ) {
    return null;
  }

  if (p < 0 || rate < 0 || period < 0 || contrib < 0) {
    return null;
  }

  const { periodsPerYear, label: compoundingLabel } = resolveCompounding(compounding);
  const years = periodType === 'months' ? period / 12 : period;
  const totalPeriods = years * periodsPerYear;
  const periodicRate = rate / 100 / periodsPerYear;

  if (!Number.isFinite(totalPeriods) || !Number.isFinite(periodicRate)) {
    return null;
  }

  if (1 + periodicRate <= 0) {
    return null;
  }

  const principalGrowth = p * Math.pow(1 + periodicRate, totalPeriods);

  let contributionGrowth = 0;
  if (totalPeriods > 0 && contrib > 0) {
    if (periodicRate === 0) {
      contributionGrowth = contrib * totalPeriods;
    } else {
      contributionGrowth =
        contrib * ((Math.pow(1 + periodicRate, totalPeriods) - 1) / periodicRate);
    }
  }

  const endingBalance = principalGrowth + contributionGrowth;
  const totalContributions = contrib * totalPeriods;
  const totalInterestEarned = endingBalance - p - totalContributions;

  return {
    endingBalance,
    totalInterestEarned,
    totalContributions,
    principal: p,
    periodsPerYear,
    compoundingLabel,
    totalPeriods,
    periodicRate,
    years,
  };
}

export function calculateInvestmentGrowth({
  initialInvestment,
  expectedReturn,
  timePeriod,
  periodType = 'years',
  compounding = 'monthly',
  monthlyContribution = 0,
  inflationRate = 0,
}) {
  const initial = Number(initialInvestment);
  const returnRate = Number(expectedReturn);
  const period = Number(timePeriod);
  const contrib = Number(monthlyContribution);
  const inflation = Number(inflationRate);

  if (
    !Number.isFinite(initial) ||
    !Number.isFinite(returnRate) ||
    !Number.isFinite(period) ||
    !Number.isFinite(contrib) ||
    !Number.isFinite(inflation)
  ) {
    return null;
  }

  if (initial < 0 || returnRate < 0 || period < 0 || contrib < 0 || inflation < 0) {
    return null;
  }

  const { periodsPerYear, label: compoundingLabel } = resolveCompounding(compounding);
  const years = periodType === 'months' ? period / 12 : period;
  const totalPeriods = years * periodsPerYear;
  const periodicRate = returnRate / 100 / periodsPerYear;

  if (!Number.isFinite(totalPeriods) || !Number.isFinite(periodicRate)) {
    return null;
  }

  if (1 + periodicRate <= 0) {
    return null;
  }

  const initialGrowth = initial * Math.pow(1 + periodicRate, totalPeriods);

  const contributionPerPeriod = contrib * (12 / periodsPerYear);
  let contributionGrowth = 0;
  if (totalPeriods > 0 && contributionPerPeriod > 0) {
    if (periodicRate === 0) {
      contributionGrowth = contributionPerPeriod * totalPeriods;
    } else {
      contributionGrowth =
        contributionPerPeriod * ((Math.pow(1 + periodicRate, totalPeriods) - 1) / periodicRate);
    }
  }

  const futureValue = initialGrowth + contributionGrowth;
  const totalContributions = contributionPerPeriod * totalPeriods;
  const totalGains = futureValue - initial - totalContributions;

  let inflationAdjustedFV = null;
  if (inflation > 0 && years > 0) {
    inflationAdjustedFV = futureValue / Math.pow(1 + inflation / 100, years);
  }

  return {
    futureValue,
    totalContributions,
    totalGains,
    initialInvestment: initial,
    periodsPerYear,
    compoundingLabel,
    totalPeriods,
    periodicRate,
    years,
    inflationAdjustedFV,
    inflationRate: inflation,
  };
}

export function calculateEffectiveAnnualRate({
  nominalRate,
  compounding = 'annual',
  customPeriods = null,
}) {
  const nominal = Number(nominalRate);
  const parsedCustomPeriods =
    customPeriods === null || customPeriods === undefined || customPeriods === ''
      ? null
      : Number(customPeriods);

  if (!Number.isFinite(nominal) || nominal < 0) {
    return null;
  }

  const resolvedCompounding = resolveCompounding(compounding);
  const periodsPerYear = parsedCustomPeriods ?? resolvedCompounding.periodsPerYear;

  if (!Number.isFinite(periodsPerYear) || periodsPerYear <= 0) {
    return null;
  }

  const nominalRateDecimal = nominal / 100;
  const effectiveAnnualRate = Math.pow(1 + nominalRateDecimal / periodsPerYear, periodsPerYear) - 1;

  if (!Number.isFinite(effectiveAnnualRate)) {
    return null;
  }

  return {
    effectiveAnnualRate,
    nominalRate,
    periodsPerYear,
    compoundingLabel: resolvedCompounding.label,
  };
}
