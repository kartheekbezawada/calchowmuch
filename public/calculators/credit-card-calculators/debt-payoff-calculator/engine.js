const MAX_MONTHS = 1200;
const EPSILON = 0.01;
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const DEFAULT_DEBTS = [
  {
    id: 'travel-card',
    name: 'Travel rewards card',
    type: 'Credit card',
    balance: 4800,
    apr: 24.9,
    minimumPayment: 145,
  },
  {
    id: 'store-card',
    name: 'Store card',
    type: 'Credit card',
    balance: 2100,
    apr: 29.9,
    minimumPayment: 70,
  },
  {
    id: 'medical-plan',
    name: 'Medical plan',
    type: 'Personal loan',
    balance: 3600,
    apr: 11.2,
    minimumPayment: 115,
  },
];

function roundCurrency(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function formatCurrency(value) {
  return currencyFormatter.format(roundCurrency(value));
}

function parseCurrency(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? roundCurrency(parsed) : 0;
}

export function normalizeDebts(debts) {
  if (!Array.isArray(debts)) {
    return [];
  }
  return debts
    .map((debt, index) => ({
      id: debt.id || `debt-${index + 1}`,
      name: String(debt.name || `Debt ${index + 1}`).trim() || `Debt ${index + 1}`,
      type: String(debt.type || 'Debt').trim() || 'Debt',
      balance: Math.max(0, parseCurrency(debt.balance)),
      apr: Math.max(0, Number(debt.apr) || 0),
      minimumPayment: Math.max(0, parseCurrency(debt.minimumPayment)),
    }))
    .filter((debt) => debt.balance > 0);
}

function buildSortComparator(strategy) {
  if (strategy === 'avalanche') {
    return (left, right) => {
      if (right.balanceApr !== left.balanceApr) {
        return right.balanceApr - left.balanceApr;
      }
      if (left.balance !== right.balance) {
        return left.balance - right.balance;
      }
      return left.name.localeCompare(right.name);
    };
  }
  return (left, right) => {
    if (left.balance !== right.balance) {
      return left.balance - right.balance;
    }
    if (right.balanceApr !== left.balanceApr) {
      return right.balanceApr - left.balanceApr;
    }
    return left.name.localeCompare(right.name);
  };
}

function addMonths(date, months) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function monthLabel(date) {
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function strategyLabel(strategy) {
  return strategy === 'snowball' ? 'Snowball' : 'Avalanche';
}

function debtCountLabel(count) {
  return `${count} ${count === 1 ? 'debt' : 'debts'}`;
}

function yearLabel(date) {
  return date.toLocaleDateString('en-US', { year: 'numeric' });
}

function positiveDebtComparator(strategy) {
  const compare = buildSortComparator(strategy);
  return (left, right) =>
    compare(
      { ...left, balanceApr: left.apr },
      { ...right, balanceApr: right.apr }
    );
}

export function simulateDebtPayoff({
  debts,
  extraPayment = 0,
  strategy = 'snowball',
  baseDate = new Date(),
}) {
  const normalizedDebts = normalizeDebts(debts);
  if (!normalizedDebts.length) {
    return null;
  }

  const workingDebts = normalizedDebts.map((debt) => ({
    ...debt,
    originalBalance: debt.balance,
  }));
  const totalPrincipal = roundCurrency(
    workingDebts.reduce((sum, debt) => sum + debt.balance, 0)
  );
  const minimumBudget = roundCurrency(
    workingDebts.reduce((sum, debt) => sum + debt.minimumPayment, 0)
  );
  const extraBudget = Math.max(0, parseCurrency(extraPayment));
  const series = [{ month: 0, balance: totalPrincipal }];
  const schedule = [];
  const yearly = [];
  let totalInterest = 0;
  let totalPaid = 0;

  for (let month = 1; month <= MAX_MONTHS; month += 1) {
    const active = workingDebts.filter((debt) => debt.balance > EPSILON);
    if (!active.length) {
      break;
    }

    const currentDate = addMonths(baseDate, month - 1);
    const startBalance = roundCurrency(
      active.reduce((sum, debt) => sum + debt.balance, 0)
    );

    let monthInterest = 0;
    for (const debt of active) {
      const interest = roundCurrency((debt.balance * debt.apr) / 1200);
      debt.balance = roundCurrency(debt.balance + interest);
      monthInterest += interest;
    }

    let monthPayment = 0;
    let freedMinimum = 0;
    for (const debt of active) {
      const scheduledMinimum = debt.minimumPayment;
      const actualMinimum = Math.min(debt.balance, scheduledMinimum);
      debt.balance = roundCurrency(debt.balance - actualMinimum);
      monthPayment += actualMinimum;
      freedMinimum += roundCurrency(scheduledMinimum - actualMinimum);
    }

    let extraRemaining = roundCurrency(extraBudget + freedMinimum);
    const sortedTargets = workingDebts
      .filter((debt) => debt.balance > EPSILON)
      .sort(positiveDebtComparator(strategy));
    let targetName = sortedTargets[0]?.name || 'All debts cleared';

    for (const debt of sortedTargets) {
      if (extraRemaining <= EPSILON) {
        break;
      }
      const payment = Math.min(debt.balance, extraRemaining);
      debt.balance = roundCurrency(debt.balance - payment);
      extraRemaining = roundCurrency(extraRemaining - payment);
      monthPayment += payment;
      targetName = debt.name;
    }

    const endBalance = roundCurrency(
      workingDebts.reduce((sum, debt) => sum + Math.max(debt.balance, 0), 0)
    );
    const monthPrincipal = roundCurrency(monthPayment - monthInterest);

    totalInterest = roundCurrency(totalInterest + monthInterest);
    totalPaid = roundCurrency(totalPaid + monthPayment);
    series.push({ month, balance: endBalance });

    schedule.push({
      month,
      label: monthLabel(currentDate),
      payment: roundCurrency(monthPayment),
      principal: roundCurrency(monthPrincipal),
      interest: roundCurrency(monthInterest),
      endingBalance: endBalance,
      targetDebt: targetName,
      startBalance: roundCurrency(startBalance),
    });

    const currentYear = yearLabel(currentDate);
    let bucket = yearly.find((entry) => entry.year === currentYear);
    if (!bucket) {
      bucket = {
        year: currentYear,
        payment: 0,
        principal: 0,
        interest: 0,
        endingBalance: endBalance,
      };
      yearly.push(bucket);
    }
    bucket.payment = roundCurrency(bucket.payment + monthPayment);
    bucket.principal = roundCurrency(bucket.principal + monthPrincipal);
    bucket.interest = roundCurrency(bucket.interest + monthInterest);
    bucket.endingBalance = endBalance;

    if (endBalance <= EPSILON) {
      const payoffDate = addMonths(baseDate, month - 1);
      return {
        strategy,
        baseDate,
        debts: normalizedDebts,
        months: month,
        minimumBudget,
        extraBudget,
        totalPrincipal,
        totalInterest: roundCurrency(totalInterest),
        totalPaid: roundCurrency(totalPaid),
        debtFreeDate: payoffDate,
        debtFreeLabel: monthLabel(payoffDate),
        schedule,
        yearly,
        series,
        pie: {
          principal: totalPrincipal,
          interest: roundCurrency(totalInterest),
        },
      };
    }
  }

  return {
    strategy,
    baseDate,
    debts: normalizedDebts,
    months: MAX_MONTHS,
    minimumBudget,
    extraBudget,
    totalPrincipal,
    totalInterest: roundCurrency(totalInterest),
    totalPaid: roundCurrency(totalPaid),
    debtFreeDate: null,
    debtFreeLabel: 'More than 100 years',
    schedule,
    yearly,
    series,
    pie: {
      principal: totalPrincipal,
      interest: roundCurrency(totalInterest),
    },
    warning: 'Current payment levels do not clear the balances inside the supported simulation window.',
  };
}

function monthsUntilTarget(baseDate, targetDate) {
  const startMonth = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
  const endMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
  return (endMonth.getFullYear() - startMonth.getFullYear()) * 12 + (endMonth.getMonth() - startMonth.getMonth()) + 1;
}

export function solveGoalPayment({
  debts,
  strategy,
  targetDate,
  baseDate = new Date(),
}) {
  if (!(targetDate instanceof Date) || Number.isNaN(targetDate.getTime())) {
    return null;
  }

  const monthsAvailable = monthsUntilTarget(baseDate, targetDate);
  if (monthsAvailable <= 0) {
    return null;
  }

  const baseline = simulateDebtPayoff({ debts, extraPayment: 0, strategy, baseDate });
  if (!baseline) {
    return null;
  }

  if (baseline.debtFreeDate && baseline.months <= monthsAvailable) {
    return {
      monthsAvailable,
      extraPayment: 0,
      totalMonthlyPayment: baseline.minimumBudget,
      targetDate,
    };
  }

  let low = 0;
  let high = 20000;
  let candidate = null;
  for (let attempt = 0; attempt < 22; attempt += 1) {
    const mid = roundCurrency((low + high) / 2);
    const simulation = simulateDebtPayoff({ debts, extraPayment: mid, strategy, baseDate });
    if (simulation?.debtFreeDate && simulation.months <= monthsAvailable) {
      candidate = {
        monthsAvailable,
        extraPayment: mid,
        totalMonthlyPayment: roundCurrency(simulation.minimumBudget + mid),
        targetDate,
      };
      high = mid;
    } else {
      low = mid;
    }
  }

  if (!candidate) {
    return null;
  }
  return candidate;
}

function formatDifference(value, unit) {
  if (!value) {
    return `No ${unit} change`;
  }
  const absolute = Math.abs(value);
  const direction = value > 0 ? 'more' : 'less';
  return `${absolute} ${unit} ${direction}`;
}

function buildPlanOrder(chosen) {
  const seen = new Set();
  const order = [];

  chosen.schedule.forEach((row) => {
    if (row.targetDebt && row.targetDebt !== 'All debts cleared' && !seen.has(row.targetDebt)) {
      seen.add(row.targetDebt);
      order.push(row.targetDebt);
    }
  });

  chosen.debts.forEach((debt) => {
    if (!seen.has(debt.name)) {
      order.push(debt.name);
    }
  });

  return order;
}

export function buildDebtPayoffViewModel({
  debts,
  extraPayment = 0,
  strategy = 'snowball',
  mode = 'standard',
  targetDate = null,
  baseDate = new Date(),
}) {
  const chosen = simulateDebtPayoff({ debts, extraPayment, strategy, baseDate });
  if (!chosen) {
    return null;
  }
  const alternateStrategy = strategy === 'snowball' ? 'avalanche' : 'snowball';
  const alternate = simulateDebtPayoff({
    debts,
    extraPayment,
    strategy: alternateStrategy,
    baseDate,
  });
  const goal = mode === 'goal-date' ? solveGoalPayment({ debts, strategy, targetDate, baseDate }) : null;

  const deltaMonths = alternate ? alternate.months - chosen.months : 0;
  const deltaInterest = alternate ? roundCurrency(alternate.totalInterest - chosen.totalInterest) : 0;
  const monthlyBudget = roundCurrency(chosen.minimumBudget + chosen.extraBudget);
  const chosenStrategyLabel = strategyLabel(strategy);
  const alternateStrategyLabel = strategyLabel(alternateStrategy);
  const planOrder = buildPlanOrder(chosen);

  const hero =
    mode === 'goal-date' && goal
      ? {
          kicker: `Target: ${monthLabel(targetDate)}`,
          headline: `Be debt-free by ${monthLabel(targetDate)}`,
          summary: `You would need about ${formatCurrency(goal.totalMonthlyPayment)} a month, which is ${formatCurrency(goal.extraPayment)} above your current minimums.`,
        }
      : {
          kicker: 'Current plan',
          headline: `You could be debt-free by ${chosen.debtFreeLabel}`,
          summary: `${chosenStrategyLabel} clears ${debtCountLabel(chosen.debts.length)} in ${chosen.months} months at about ${formatCurrency(monthlyBudget)} a month.`,
        };

  const comparison = alternate
    ? {
        alternateStrategy,
        alternateStrategyLabel,
        timeDeltaMonths: deltaMonths,
        interestDelta: deltaInterest,
      }
    : null;

  return {
    mode,
    strategy,
    chosen,
    alternate,
    goal,
    hero,
    comparison,
    planOrder,
    kpis:
      mode === 'goal-date' && goal
        ? [
            { label: 'Current payoff date', value: chosen.debtFreeLabel, kind: 'text', helper: `With your current ${chosenStrategyLabel.toLowerCase()} plan` },
            { label: 'Needed monthly payment', value: goal.totalMonthlyPayment, kind: 'money', helper: `To finish by ${monthLabel(targetDate)}` },
            { label: 'Needed extra above minimums', value: goal.extraPayment, kind: 'money', helper: 'Compared with your current minimum budget' },
          ]
        : [
            { label: 'Payoff months', value: chosen.months, kind: 'text', helper: `${chosenStrategyLabel} strategy` },
            { label: 'Total interest', value: chosen.totalInterest, kind: 'money', helper: 'Across every debt in the plan' },
            { label: 'Monthly budget', value: monthlyBudget, kind: 'money', helper: `Minimums ${formatCurrency(chosen.minimumBudget)} + extra ${formatCurrency(chosen.extraBudget)}` },
          ],
    deltaCards: alternate
      ? [
          {
            label: `${alternateStrategyLabel} time delta`,
            value: formatDifference(deltaMonths, 'months'),
            helper: `Compared with the chosen ${strategy} plan`,
          },
          {
            label: `${alternateStrategyLabel} interest delta`,
            value: formatDifference(deltaInterest, 'interest'),
            helper: 'Positive means the alternate plan costs more',
          },
        ]
      : [],
    headline: hero.headline,
    summary: hero.summary,
    copySummary:
      mode === 'goal-date' && goal
        ? `To be debt-free by ${monthLabel(targetDate)}, you need about ${formatCurrency(goal.totalMonthlyPayment)} a month. That is ${formatCurrency(goal.extraPayment)} above your current minimums.`
        : `You could be debt-free by ${chosen.debtFreeLabel}. ${chosenStrategyLabel} clears ${debtCountLabel(chosen.debts.length)} in ${chosen.months} months at about ${formatCurrency(monthlyBudget)} a month.`,
    nextSteps: [
      {
        label: 'See what minimum-only payments cost',
        href: '/credit-card-calculators/credit-card-minimum-payment-calculator/',
      },
      {
        label: 'Compare with a single-card payoff calculator',
        href: '/credit-card-calculators/credit-card-payment-calculator/',
      },
      {
        label: 'Test whether debt consolidation helps',
        href: '/credit-card-calculators/credit-card-consolidation-calculator/',
      },
      {
        label: 'Check a lower-APR balance transfer option',
        href: '/credit-card-calculators/balance-transfer-credit-card-calculator/',
      },
    ],
  };
}
