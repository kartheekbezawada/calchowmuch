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
