const MAX_EXTRA_MONTH_BUFFER = 1200;

export function computeMonthlyPayment(principal, annualRate, months) {
  if (!Number.isFinite(principal) || principal <= 0) {
    return 0;
  }
  if (!Number.isFinite(months) || months <= 0) {
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

export function getMaxExtraPaymentForFirstMonth({ principal, annualRate, months }) {
  const basePayment = computeMonthlyPayment(principal, annualRate, months);
  if (basePayment <= 0) {
    return 0;
  }

  const monthlyRate = annualRate / 100 / 12;
  const firstMonthInterest = principal * monthlyRate;
  const firstMonthPrincipal = Math.max(0, basePayment - firstMonthInterest);
  return Math.max(0, principal - firstMonthPrincipal);
}

function buildSchedule({ principal, annualRate, months, basePayment, extraMonthly = 0 }) {
  const monthlyRate = annualRate / 100 / 12;
  const schedule = [];

  let month = 0;
  let balance = principal;
  let totalPayment = 0;
  let totalInterest = 0;
  let totalPrincipal = 0;
  let totalExtra = 0;

  const maxMonths = months + MAX_EXTRA_MONTH_BUFFER;

  while (balance > 1e-8 && month < maxMonths) {
    month += 1;

    const interest = monthlyRate > 0 ? balance * monthlyRate : 0;
    const plannedPayment = basePayment + extraMonthly;
    let principalPart = plannedPayment - interest;

    if (principalPart <= 0) {
      break;
    }

    if (principalPart > balance) {
      principalPart = balance;
    }

    const actualPayment = interest + principalPart;
    const actualExtra = Math.max(0, principalPart - Math.max(0, basePayment - interest));

    balance -= principalPart;

    totalPayment += actualPayment;
    totalInterest += interest;
    totalPrincipal += principalPart;
    totalExtra += actualExtra;

    schedule.push({
      month,
      payment: actualPayment,
      principal: principalPart,
      interest,
      extra: actualExtra,
      balance: Math.max(0, balance),
    });
  }

  return {
    schedule,
    months: schedule.length,
    totalPayment,
    totalInterest,
    totalPrincipal,
    totalExtra,
  };
}

function buildBalancePoints(baseSchedule, acceleratedSchedule, fallbackMonths) {
  const baseMap = new Map(baseSchedule.map((row) => [row.month, row.balance]));
  const acceleratedMap = new Map(acceleratedSchedule.map((row) => [row.month, row.balance]));

  const maxMonth = Math.max(
    fallbackMonths,
    baseSchedule.length ? baseSchedule[baseSchedule.length - 1].month : 0,
    acceleratedSchedule.length ? acceleratedSchedule[acceleratedSchedule.length - 1].month : 0
  );

  let lastBase = baseSchedule.length ? baseSchedule[0].principal + baseSchedule[0].balance : 0;
  let lastExtra = acceleratedSchedule.length
    ? acceleratedSchedule[0].principal + acceleratedSchedule[0].balance
    : 0;

  const points = [{ month: 0, baselineBalance: lastBase, extraBalance: lastExtra }];

  for (let month = 1; month <= maxMonth; month += 1) {
    if (baseMap.has(month)) {
      lastBase = baseMap.get(month);
    }
    if (acceleratedMap.has(month)) {
      lastExtra = acceleratedMap.get(month);
    }

    if (!baseMap.has(month) && month > (baseSchedule[baseSchedule.length - 1]?.month || 0)) {
      lastBase = 0;
    }
    if (
      !acceleratedMap.has(month) &&
      month > (acceleratedSchedule[acceleratedSchedule.length - 1]?.month || 0)
    ) {
      lastExtra = 0;
    }

    points.push({
      month,
      baselineBalance: Math.max(0, lastBase),
      extraBalance: Math.max(0, lastExtra),
    });
  }

  return points;
}

export function calculatePersonalLoan({
  principal,
  annualRate,
  months,
  setupFee = 0,
  extraMonthly = 0,
}) {
  const basePayment = computeMonthlyPayment(principal, annualRate, months);
  const baseline = buildSchedule({
    principal,
    annualRate,
    months,
    basePayment,
    extraMonthly: 0,
  });

  const accelerated = buildSchedule({
    principal,
    annualRate,
    months,
    basePayment,
    extraMonthly,
  });

  const baselineTotalCostWithFee = baseline.totalPayment + setupFee;
  const acceleratedTotalCostWithFee = accelerated.totalPayment + setupFee;
  const interestSaved = Math.max(0, baseline.totalInterest - accelerated.totalInterest);
  const monthsSaved = Math.max(0, baseline.months - accelerated.months);

  return {
    inputs: {
      principal,
      annualRate,
      months,
      setupFee,
      extraMonthly,
      basePayment,
    },
    baseline: {
      ...baseline,
      totalCostWithFee: baselineTotalCostWithFee,
    },
    accelerated: {
      ...accelerated,
      monthlyPaymentWithExtra: basePayment + extraMonthly,
      totalCostWithFee: acceleratedTotalCostWithFee,
    },
    insight: {
      interestSaved,
      monthsSaved,
    },
    chartPoints: buildBalancePoints(baseline.schedule, accelerated.schedule, months),
  };
}

export function previewScheduleRows(schedule, limit = 12) {
  return schedule.slice(0, limit);
}

export function previewMonthlyRows(schedule, limit = 60) {
  return schedule.slice(0, limit).map((row) => ({
    period: row.month,
    payment: row.payment,
    principal: row.principal,
    interest: row.interest,
    extra: row.extra,
    balance: row.balance,
  }));
}

export function previewYearlyRows(schedule, yearsLimit = 5) {
  const grouped = new Map();
  for (const row of schedule) {
    const year = Math.ceil(row.month / 12);
    if (year > yearsLimit) {
      break;
    }
    if (!grouped.has(year)) {
      grouped.set(year, {
        period: year,
        payment: 0,
        principal: 0,
        interest: 0,
        extra: 0,
        balance: row.balance,
      });
    }
    const aggregate = grouped.get(year);
    aggregate.payment += row.payment;
    aggregate.principal += row.principal;
    aggregate.interest += row.interest;
    aggregate.extra += row.extra;
    aggregate.balance = row.balance;
  }
  return Array.from(grouped.values());
}
