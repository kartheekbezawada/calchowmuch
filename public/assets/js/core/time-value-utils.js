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

const INVESTMENT_RETURN_COMPOUNDING_PERIODS = {
  ANNUAL: 1,
  QUARTERLY: 4,
  MONTHLY: 12,
  DAILY: 365,
  annual: 1,
  quarterly: 4,
  monthly: 12,
  daily: 365,
};

const INVESTMENT_RETURN_CONTRIBUTION_PERIODS = {
  ANNUAL: 1,
  QUARTERLY: 4,
  MONTHLY: 12,
  annual: 1,
  quarterly: 4,
  monthly: 12,
};

const INVESTMENT_RETURN_TIMING = {
  END_OF_PERIOD: 'end',
  BEGINNING_OF_PERIOD: 'beginning',
  end: 'end',
  beginning: 'beginning',
  END: 'end',
  BEGINNING: 'beginning',
};

const INVESTMENT_RETURN_EVENT_TIMING = {
  START_OF_YEAR: 'start',
  END_OF_YEAR: 'end',
  start: 'start',
  end: 'end',
};

function roundHalfAwayFromZero(value, precision = 2) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return parsed;
  }
  const factor = 10 ** precision;
  if (!Number.isFinite(factor) || factor <= 0) {
    return parsed;
  }
  if (parsed === 0) {
    return 0;
  }
  const scaledAbs = Math.abs(parsed) * factor;
  const roundedAbs = Math.round(scaledAbs + Number.EPSILON);
  const rounded = roundedAbs / factor;
  return parsed < 0 ? -rounded : rounded;
}

function normalizeOptionalNumber(value, fallback = 0) {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
}

function normalizeCompoundingPeriods(compoundingFrequency) {
  const key = compoundingFrequency ?? 'ANNUAL';
  return INVESTMENT_RETURN_COMPOUNDING_PERIODS[key] ?? null;
}

function normalizeContributionPeriods(contributionFrequency) {
  const key = contributionFrequency ?? 'MONTHLY';
  return INVESTMENT_RETURN_CONTRIBUTION_PERIODS[key] ?? null;
}

function normalizeContributionTiming(contributionTiming) {
  const key = contributionTiming ?? 'END_OF_PERIOD';
  return INVESTMENT_RETURN_TIMING[key] ?? null;
}

function normalizeEventTiming(eventTiming) {
  const key = eventTiming ?? 'END_OF_YEAR';
  return INVESTMENT_RETURN_EVENT_TIMING[key] ?? null;
}

function annualNominalToMonthlyRate(annualRatePercent, compoundsPerYear) {
  const annualRateDecimal = Number(annualRatePercent) / 100;
  const periods = Number(compoundsPerYear);
  if (!Number.isFinite(annualRateDecimal) || !Number.isFinite(periods) || periods <= 0) {
    return NaN;
  }
  const base = 1 + annualRateDecimal / periods;
  if (base < 0) {
    return NaN;
  }
  const monthlyFactor = Math.pow(base, periods / 12);
  if (!Number.isFinite(monthlyFactor) || monthlyFactor < 0) {
    return NaN;
  }
  return monthlyFactor - 1;
}

function normalizeVariableReturns(durationYears, baseAnnualRate, variableAnnualReturns, crash) {
  const perYear = new Array(durationYears).fill(baseAnnualRate);
  if (Array.isArray(variableAnnualReturns) && variableAnnualReturns.length > 0) {
    for (let index = 0; index < durationYears; index += 1) {
      const candidate = variableAnnualReturns[index];
      if (candidate === null || candidate === undefined || candidate === '') {
        continue;
      }
      const parsed = Number(candidate);
      if (Number.isFinite(parsed)) {
        perYear[index] = parsed;
      }
    }
  }
  if (crash?.enabled && Number.isInteger(crash.year) && crash.year >= 1 && crash.year <= durationYears) {
    perYear[crash.year - 1] -= Math.abs(crash.dropPercent);
  }
  return perYear;
}

function indexEventsByYear(oneTimeEvents = []) {
  const byYear = new Map();
  oneTimeEvents.forEach((event) => {
    const year = Number(event?.year);
    const amount = Number(event?.amount);
    const timing = normalizeEventTiming(event?.timing);
    if (!Number.isInteger(year) || !Number.isFinite(amount) || !timing) {
      return;
    }
    if (!byYear.has(year)) {
      byYear.set(year, { start: [], end: [] });
    }
    byYear.get(year)[timing].push(amount);
  });
  return byYear;
}

function isRecurringContributionDue(monthInYear, contributionsPerYear) {
  if (contributionsPerYear === 12) {
    return true;
  }
  if (contributionsPerYear === 4) {
    return monthInYear % 3 === 0;
  }
  if (contributionsPerYear === 1) {
    return monthInYear === 12;
  }
  return false;
}

function createValidationResult(errors) {
  return {
    isValid: errors.length === 0,
    errors,
  };
}

function validateInvestmentReturnInput(input) {
  const errors = [];
  const initialInvestment = normalizeOptionalNumber(input?.initialInvestment, 0);
  const annualReturnRate = normalizeOptionalNumber(input?.annualReturnRate, 0);
  const durationYears = normalizeOptionalNumber(input?.durationYears, NaN);
  const regularContribution = normalizeOptionalNumber(input?.regularContribution, 0);
  const inflationRate = normalizeOptionalNumber(input?.inflationRate, 0);
  const taxRate = normalizeOptionalNumber(input?.taxRate, 0);
  const precision = normalizeOptionalNumber(input?.precision, 2);

  if (!Number.isFinite(initialInvestment) || initialInvestment < 0) {
    errors.push('initialInvestment must be a finite number >= 0.');
  }
  if (!Number.isFinite(annualReturnRate) || annualReturnRate < -100 || annualReturnRate > 100) {
    errors.push('annualReturnRate must be between -100 and 100.');
  }
  if (!Number.isFinite(durationYears) || !Number.isInteger(durationYears) || durationYears < 1) {
    errors.push('durationYears must be an integer >= 1.');
  }
  if (!Number.isFinite(regularContribution) || regularContribution < 0) {
    errors.push('regularContribution must be a finite number >= 0.');
  }
  if (!Number.isFinite(inflationRate) || inflationRate < -100 || inflationRate > 100) {
    errors.push('inflationRate must be between -100 and 100.');
  }
  if (!Number.isFinite(taxRate) || taxRate < 0 || taxRate > 100) {
    errors.push('taxRate must be between 0 and 100.');
  }
  if (!Number.isFinite(precision) || !Number.isInteger(precision) || precision < 0 || precision > 8) {
    errors.push('precision must be an integer between 0 and 8.');
  }

  const compoundsPerYear = normalizeCompoundingPeriods(input?.compoundingFrequency);
  if (!compoundsPerYear) {
    errors.push('compoundingFrequency must be one of ANNUAL, QUARTERLY, MONTHLY, DAILY.');
  }

  const contributionsPerYear = normalizeContributionPeriods(input?.contributionFrequency ?? 'MONTHLY');
  if (!contributionsPerYear) {
    errors.push('contributionFrequency must be one of MONTHLY, QUARTERLY, ANNUAL.');
  }

  const contributionTiming = normalizeContributionTiming(input?.contributionTiming ?? 'END_OF_PERIOD');
  if (!contributionTiming) {
    errors.push('contributionTiming must be END_OF_PERIOD or BEGINNING_OF_PERIOD.');
  }

  if (Array.isArray(input?.variableAnnualReturns)) {
    input.variableAnnualReturns.forEach((value, index) => {
      if (value === null || value === undefined || value === '') {
        return;
      }
      const parsed = Number(value);
      if (!Number.isFinite(parsed) || parsed < -100 || parsed > 100) {
        errors.push(`variableAnnualReturns[${index}] must be between -100 and 100.`);
      }
    });
  }

  if (Array.isArray(input?.oneTimeEvents)) {
    input.oneTimeEvents.forEach((event, index) => {
      const year = Number(event?.year);
      const amount = Number(event?.amount);
      const timing = normalizeEventTiming(event?.timing);
      if (!Number.isInteger(year) || year < 1 || year > durationYears) {
        errors.push(`oneTimeEvents[${index}].year must be an integer between 1 and durationYears.`);
      }
      if (!Number.isFinite(amount)) {
        errors.push(`oneTimeEvents[${index}].amount must be a finite number.`);
      }
      if (!timing) {
        errors.push(`oneTimeEvents[${index}].timing must be START_OF_YEAR or END_OF_YEAR.`);
      }
    });
  }

  const crashEnabled = Boolean(input?.crashSimulation?.enabled);
  const crashYear = normalizeOptionalNumber(input?.crashSimulation?.year, NaN);
  const crashDropPercent = normalizeOptionalNumber(input?.crashSimulation?.dropPercent, 20);
  if (crashEnabled) {
    if (!Number.isFinite(crashDropPercent) || crashDropPercent < 0 || crashDropPercent > 100) {
      errors.push('crashSimulation.dropPercent must be between 0 and 100.');
    }
    if (!Number.isInteger(crashYear) || crashYear < 1 || crashYear > durationYears) {
      errors.push('crashSimulation.year must be an integer between 1 and durationYears.');
    }
  }

  return createValidationResult(errors);
}

export function calculateInvestmentReturn(input = {}) {
  const validation = validateInvestmentReturnInput(input);
  if (!validation.isValid) {
    return validation;
  }

  const initialInvestment = Number(input.initialInvestment ?? 0);
  const annualReturnRate = Number(input.annualReturnRate ?? 0);
  const durationYears = Number(input.durationYears);
  const regularContribution = Number(input.regularContribution ?? 0);
  const inflationRate = Number(input.inflationRate ?? 0);
  const taxRate = Number(input.taxRate ?? 0);
  const precision = Number(input.precision ?? 2);
  const compoundsPerYear = normalizeCompoundingPeriods(input.compoundingFrequency);
  const contributionsPerYear = normalizeContributionPeriods(input.contributionFrequency ?? 'MONTHLY');
  const contributionTiming = normalizeContributionTiming(input.contributionTiming ?? 'END_OF_PERIOD');
  const oneTimeEvents = Array.isArray(input.oneTimeEvents) ? input.oneTimeEvents : [];
  const crash = {
    enabled: Boolean(input?.crashSimulation?.enabled),
    year: Number(input?.crashSimulation?.year ?? NaN),
    dropPercent: Number(input?.crashSimulation?.dropPercent ?? 20),
  };

  const variableAnnualReturns = normalizeVariableReturns(
    durationYears,
    annualReturnRate,
    input?.variableAnnualReturns,
    crash
  );
  const eventIndex = indexEventsByYear(oneTimeEvents);

  let balance = initialInvestment;
  let totalContributions = initialInvestment;
  let cumulativeContributions = initialInvestment;
  let totalTaxPaid = 0;
  let carryforwardLoss = 0;

  const yearlyBreakdown = [];
  const monthlyBreakdown = [];
  const graph = {
    labels: [],
    nominalBalance: [],
    principal: [],
    returns: [],
    realBalance: [],
  };

  const taxRateDecimal = taxRate / 100;
  const inflationRateDecimal = inflationRate / 100;

  for (let year = 1; year <= durationYears; year += 1) {
    const annualRateThisYear = variableAnnualReturns[year - 1];
    const monthlyRate = annualNominalToMonthlyRate(annualRateThisYear, compoundsPerYear);
    if (!Number.isFinite(monthlyRate)) {
      return createValidationResult([
        `Unable to compute monthly growth rate for year ${year}. Check return/compounding values.`,
      ]);
    }

    const yearlyStart = balance;
    let yearlyContributions = 0;
    let yearlyInterest = 0;
    let yearlyTax = 0;

    for (let monthInYear = 1; monthInYear <= 12; monthInYear += 1) {
      const monthIndex = (year - 1) * 12 + monthInYear;
      const monthStart = balance;
      let monthContributions = 0;

      const dueRecurring = regularContribution > 0 && isRecurringContributionDue(monthInYear, contributionsPerYear);
      const yearlyEvents = eventIndex.get(year) ?? { start: [], end: [] };

      if (dueRecurring && contributionTiming === 'beginning') {
        balance += regularContribution;
        monthContributions += regularContribution;
      }

      if (monthInYear === 1 && yearlyEvents.start.length) {
        yearlyEvents.start.forEach((amount) => {
          balance += amount;
          monthContributions += amount;
        });
      }

      const monthInterest = balance * monthlyRate;
      balance += monthInterest;

      if (dueRecurring && contributionTiming === 'end') {
        balance += regularContribution;
        monthContributions += regularContribution;
      }

      if (monthInYear === 12 && yearlyEvents.end.length) {
        yearlyEvents.end.forEach((amount) => {
          balance += amount;
          monthContributions += amount;
        });
      }

      yearlyContributions += monthContributions;
      yearlyInterest += monthInterest;
      totalContributions += monthContributions;
      cumulativeContributions += monthContributions;

      monthlyBreakdown.push({
        year,
        month: monthIndex,
        startingBalance: roundHalfAwayFromZero(monthStart, precision),
        contributions: roundHalfAwayFromZero(monthContributions, precision),
        interestEarned: roundHalfAwayFromZero(monthInterest, precision),
        taxPaid: 0,
        endingBalance: roundHalfAwayFromZero(balance, precision),
      });
    }

    if (taxRateDecimal > 0) {
      const annualGainBeforeTax = balance - yearlyStart - yearlyContributions;
      if (annualGainBeforeTax > 0) {
        const adjustedGain = annualGainBeforeTax + carryforwardLoss;
        const taxableGain = Math.max(0, adjustedGain);
        carryforwardLoss = Math.min(0, adjustedGain);
        yearlyTax = taxableGain * taxRateDecimal;
      } else if (annualGainBeforeTax < 0) {
        carryforwardLoss += annualGainBeforeTax;
      }

      if (yearlyTax > 0) {
        balance -= yearlyTax;
        totalTaxPaid += yearlyTax;
        const lastMonth = monthlyBreakdown[monthlyBreakdown.length - 1];
        if (lastMonth) {
          lastMonth.taxPaid = roundHalfAwayFromZero(yearlyTax, precision);
          lastMonth.endingBalance = roundHalfAwayFromZero(balance, precision);
        }
      }
    }

    const realEnding =
      inflationRate !== 0 ? balance / Math.pow(1 + inflationRateDecimal, year) : null;

    yearlyBreakdown.push({
      year,
      startingBalance: roundHalfAwayFromZero(yearlyStart, precision),
      contributions: roundHalfAwayFromZero(yearlyContributions, precision),
      interestEarned: roundHalfAwayFromZero(yearlyInterest, precision),
      taxPaid: roundHalfAwayFromZero(yearlyTax, precision),
      endingBalance: roundHalfAwayFromZero(balance, precision),
      inflationAdjustedEndingBalance:
        realEnding === null ? null : roundHalfAwayFromZero(realEnding, precision),
      annualReturnRate: roundHalfAwayFromZero(annualRateThisYear, precision),
    });

    graph.labels.push(`Year ${year}`);
    graph.nominalBalance.push(roundHalfAwayFromZero(balance, precision));
    graph.principal.push(roundHalfAwayFromZero(cumulativeContributions, precision));
    graph.returns.push(roundHalfAwayFromZero(balance - cumulativeContributions, precision));
    graph.realBalance.push(
      realEnding === null ? null : roundHalfAwayFromZero(realEnding, precision)
    );
  }

  const finalValue = balance;
  const realFinalValue =
    inflationRate !== 0 ? finalValue / Math.pow(1 + inflationRateDecimal, durationYears) : null;
  const totalGain = finalValue - totalContributions;

  const effectiveAnnualRateDecimal =
    Math.pow(1 + annualReturnRate / 100 / compoundsPerYear, compoundsPerYear) - 1;
  const nominalCagr =
    initialInvestment > 0 && finalValue > 0
      ? Math.pow(finalValue / initialInvestment, 1 / durationYears) - 1
      : null;
  const realCagr =
    initialInvestment > 0 && Number.isFinite(realFinalValue) && realFinalValue > 0
      ? Math.pow(realFinalValue / initialInvestment, 1 / durationYears) - 1
      : null;

  return {
    isValid: true,
    errors: [],
    input: {
      ...input,
      initialInvestment,
      annualReturnRate,
      durationYears,
      compoundingFrequency: input.compoundingFrequency ?? 'ANNUAL',
      regularContribution,
      contributionFrequency: input.contributionFrequency ?? 'MONTHLY',
      contributionTiming: input.contributionTiming ?? 'END_OF_PERIOD',
      inflationRate,
      taxRate,
      precision,
    },
    summary: {
      finalValue: roundHalfAwayFromZero(finalValue, precision),
      totalContributions: roundHalfAwayFromZero(totalContributions, precision),
      totalGain: roundHalfAwayFromZero(totalGain, precision),
      totalTaxPaid: roundHalfAwayFromZero(totalTaxPaid, precision),
      nominalCAGR: nominalCagr === null ? null : roundHalfAwayFromZero(nominalCagr * 100, precision),
      realCAGR: realCagr === null ? null : roundHalfAwayFromZero(realCagr * 100, precision),
      realFinalValue:
        realFinalValue === null ? null : roundHalfAwayFromZero(realFinalValue, precision),
      effectiveAnnualRate: roundHalfAwayFromZero(effectiveAnnualRateDecimal * 100, precision),
    },
    yearlyBreakdown,
    monthlyBreakdown,
    graph,
    metadata: {
      calculatedAt: new Date().toISOString(),
      assumptions: {
        constantAnnualReturn: !Array.isArray(input.variableAnnualReturns),
        constantContribution: true,
        taxModel: 'year_end_with_carryforward',
        contributionTiming,
      },
      carryforwardLoss: roundHalfAwayFromZero(carryforwardLoss, precision),
    },
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
