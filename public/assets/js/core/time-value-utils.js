const COMPOUNDING_MAP = {
  annual: { periodsPerYear: 1, label: 'Annual' },
  semiannual: { periodsPerYear: 2, label: 'Semi-Annual' },
  quarterly: { periodsPerYear: 4, label: 'Quarterly' },
  monthly: { periodsPerYear: 12, label: 'Monthly' },
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
