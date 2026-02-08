import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import { formatCurrency, formatNumber, formatPercent } from '/assets/js/core/format.js';
import { calculateSavingsGoal } from '/assets/js/core/time-value-utils.js';

const modeGroup = document.querySelector('[data-button-group="sg-mode"]');
const timeUnitGroup = document.querySelector('[data-button-group="sg-time-unit"]');
const compoundingGroup = document.querySelector('[data-button-group="sg-compounding"]');
const timingGroup = document.querySelector('[data-button-group="sg-timing"]');

const goalInput = document.querySelector('#sg-goal');
const currentInput = document.querySelector('#sg-current');
const monthlyInput = document.querySelector('#sg-monthly');
const targetTimeInput = document.querySelector('#sg-target-time');
const rateInput = document.querySelector('#sg-rate');
const calculateButton = document.querySelector('#sg-calc');
const resultOutput = document.querySelector('#sg-result');
const resultDetail = document.querySelector('#sg-result-detail');
const optionalToggle = document.querySelector('#sg-optional-toggle');
const optionalSection = document.querySelector('#sg-optional-section');
const modeRows = Array.from(document.querySelectorAll('[data-mode-row]'));

const explanationRoot = document.querySelector('#sg-explanation');
const valueTargets = explanationRoot
  ? {
      goal: explanationRoot.querySelectorAll('[data-sg="goal"]'),
      current: explanationRoot.querySelectorAll('[data-sg="current"]'),
      mode: explanationRoot.querySelectorAll('[data-sg="mode"]'),
      monthly: explanationRoot.querySelectorAll('[data-sg="monthly"]'),
      targetTime: explanationRoot.querySelectorAll('[data-sg="target-time"]'),
      rate: explanationRoot.querySelectorAll('[data-sg="rate"]'),
      frequency: explanationRoot.querySelectorAll('[data-sg="frequency"]'),
      primary: explanationRoot.querySelectorAll('[data-sg="primary"]'),
      timeToGoal: explanationRoot.querySelectorAll('[data-sg="time-to-goal"]'),
      requiredMonthly: explanationRoot.querySelectorAll('[data-sg="required-monthly"]'),
      finalBalance: explanationRoot.querySelectorAll('[data-sg="final-balance"]'),
      totalContributions: explanationRoot.querySelectorAll('[data-sg="total-contributions"]'),
      totalInterest: explanationRoot.querySelectorAll('[data-sg="total-interest"]'),
    }
  : null;

export const pageSchema = {
  calculatorFAQ: true,
  globalFAQ: false,
};

const CALCULATOR_FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a savings goal calculator?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A savings goal calculator estimates how long it will take to reach a target amount or how much you need to save each month to reach it.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I calculate how much to save per month?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can divide the remaining amount needed by the number of months, and optionally include interest to account for compounding growth.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I calculate how long it will take to reach my savings goal?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use your goal amount, current savings, and monthly contribution to estimate the number of months needed, optionally including interest.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does interest make it easier to reach a savings goal?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Interest can increase your balance over time, reducing the monthly amount needed or shortening the time to goal.',
      },
    },
    {
      '@type': 'Question',
      name: 'What compounding frequency should I use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use the frequency that matches your account, such as monthly, quarterly, or annually.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if my current savings is already higher than my goal?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Then your time to goal is zero because you have already reached the target.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if my monthly contribution is zero?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'If your goal is higher than your current savings, you will not reach it without contributions or interest growth.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this a savings goal calculator with interest?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You can add an annual interest rate and compounding frequency to include interest growth.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can this help me plan for a house deposit or emergency fund?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You can use it for any target amount, including an emergency fund, house deposit, or holiday budget.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why do results change when I choose beginning vs end of month contributions?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Contributing at the beginning gives money more time to earn interest, which can slightly reduce the time to goal or the required monthly savings.',
      },
    },
  ],
};

const metadata = {
  title: 'Savings Goal Calculator – CalcHowMuch',
  description:
    'Plan your savings goal. Calculate how long it will take to reach a target amount or how much you need to save per month. Optional interest and compounding.',
  canonical: 'https://calchowmuch.com/finance/savings-goal/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Savings Goal Calculator',
        url: 'https://calchowmuch.com/finance/savings-goal/',
        description:
          'Savings goal calculator to estimate time to goal or required monthly savings with optional interest and compounding.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Savings Goal Calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/finance/savings-goal/',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        creator: {
          '@type': 'Organization',
          name: 'CalcHowMuch',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://calchowmuch.com/' },
          { '@type': 'ListItem', position: 2, name: 'Finance', item: 'https://calchowmuch.com/finance/' },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Savings Goal',
            item: 'https://calchowmuch.com/finance/savings-goal/',
          },
        ],
      },
    ],
  },
};

setPageMetadata(metadata);

const modeButtons = setupButtonGroup(modeGroup, {
  defaultValue: 'time-to-goal',
  onChange: (value) => {
    updateModeRows(value);
    if (liveUpdatesEnabled && hasCalculated) {
      calculate();
    }
  },
});

const timeUnitButtons = setupButtonGroup(timeUnitGroup, {
  defaultValue: 'months',
  onChange: () => {
    if (liveUpdatesEnabled && hasCalculated) {
      calculate();
    }
  },
});

const compoundingButtons = setupButtonGroup(compoundingGroup, {
  defaultValue: 'monthly',
  onChange: () => {
    if (liveUpdatesEnabled && hasCalculated) {
      calculate();
    }
  },
});

const timingButtons = setupButtonGroup(timingGroup, {
  defaultValue: 'end',
  onChange: () => {
    if (liveUpdatesEnabled && hasCalculated) {
      calculate();
    }
  },
});

let hasCalculated = false;
const liveUpdatesEnabled = false;

function setOptionalVisibility(expanded) {
  if (!optionalSection || !optionalToggle) {
    return;
  }
  optionalSection.classList.toggle('is-hidden', !expanded);
  optionalSection.hidden = !expanded;
  optionalSection.setAttribute('aria-hidden', String(!expanded));
  optionalToggle.setAttribute('aria-expanded', String(expanded));
  optionalToggle.textContent = expanded ? 'Hide Optional Inputs' : 'Show Optional Inputs';
}

setOptionalVisibility(false);

if (optionalToggle) {
  optionalToggle.addEventListener('click', () => {
    const expanded = optionalToggle.getAttribute('aria-expanded') === 'true';
    setOptionalVisibility(!expanded);
  });
}

function updateModeRows(mode) {
  modeRows.forEach((row) => {
    const shouldShow = row.dataset.modeRow === mode;
    row.classList.toggle('is-hidden', !shouldShow);
    row.setAttribute('aria-hidden', String(!shouldShow));
  });
}

updateModeRows(modeButtons?.getValue() ?? 'time-to-goal');

function updateTargets(targets, value) {
  if (!targets) {
    return;
  }
  targets.forEach((node) => {
    node.textContent = value;
  });
}

function updateExplanation(values) {
  if (!valueTargets) {
    return;
  }
  updateTargets(valueTargets.goal, values.goal);
  updateTargets(valueTargets.current, values.current);
  updateTargets(valueTargets.mode, values.mode);
  updateTargets(valueTargets.monthly, values.monthly);
  updateTargets(valueTargets.targetTime, values.targetTime);
  updateTargets(valueTargets.rate, values.rate);
  updateTargets(valueTargets.frequency, values.frequency);
  updateTargets(valueTargets.primary, values.primary);
  updateTargets(valueTargets.timeToGoal, values.timeToGoal);
  updateTargets(valueTargets.requiredMonthly, values.requiredMonthly);
  updateTargets(valueTargets.finalBalance, values.finalBalance);
  updateTargets(valueTargets.totalContributions, values.totalContributions);
  updateTargets(valueTargets.totalInterest, values.totalInterest);
}

function showError(message) {
  if (resultOutput) {
    resultOutput.textContent = message;
  }
  if (resultDetail) {
    resultDetail.textContent = '';
  }

  updateExplanation({
    goal: 'N/A',
    current: 'N/A',
    mode: 'N/A',
    monthly: 'N/A',
    targetTime: 'N/A',
    rate: 'N/A',
    frequency: 'N/A',
    primary: 'N/A',
    timeToGoal: 'N/A',
    requiredMonthly: 'N/A',
    finalBalance: 'N/A',
    totalContributions: 'N/A',
    totalInterest: 'N/A',
  });
}

function formatTime(months) {
  const rounded = Math.max(0, Math.round(months));
  const yearsPart = Math.floor(rounded / 12);
  const monthsPart = rounded % 12;
  return `${yearsPart} years ${monthsPart} months (${rounded} months)`;
}

function calculate() {
  const mode = modeButtons?.getValue() ?? 'time-to-goal';
  const goalAmount = Number.parseFloat(goalInput?.value ?? '');
  const currentSavings = Number.parseFloat(currentInput?.value ?? '');
  const monthlyContribution = Number.parseFloat(monthlyInput?.value ?? '0');
  const targetTime = Number.parseFloat(targetTimeInput?.value ?? '');
  const targetTimeUnit = timeUnitButtons?.getValue() ?? 'months';
  const annualRate = Number.parseFloat(rateInput?.value ?? '0');
  const compounding = compoundingButtons?.getValue() ?? 'monthly';
  const contributionTiming = timingButtons?.getValue() ?? 'end';

  if (!Number.isFinite(goalAmount) || goalAmount <= 0) {
    showError('Savings goal amount must be greater than zero.');
    return;
  }
  if (!Number.isFinite(currentSavings) || currentSavings < 0) {
    showError('Current savings must be zero or greater.');
    return;
  }

  if (mode === 'time-to-goal' && (!Number.isFinite(monthlyContribution) || monthlyContribution < 0)) {
    showError('Monthly contribution must be zero or greater.');
    return;
  }

  if (mode === 'monthly-needed' && (!Number.isFinite(targetTime) || targetTime <= 0)) {
    showError('Target time must be greater than zero.');
    return;
  }

  if (!Number.isFinite(annualRate) || annualRate < 0) {
    showError('Annual interest rate must be zero or greater.');
    return;
  }

  const result = calculateSavingsGoal({
    mode,
    goalAmount,
    currentSavings,
    monthlyContribution: Number.isFinite(monthlyContribution) ? monthlyContribution : 0,
    targetTime: mode === 'monthly-needed' ? targetTime : null,
    targetTimeUnit,
    annualRate,
    compounding,
    contributionTiming,
  });

  if (!result) {
    showError('Unable to compute with these values. Increase contribution or adjust assumptions.');
    return;
  }

  hasCalculated = true;

  const isTimeMode = mode === 'time-to-goal';
  const modeLabel = isTimeMode ? 'Time to Goal' : 'Monthly Savings Needed';
  const targetLabel =
    mode === 'monthly-needed'
      ? `${formatNumber(targetTime, { maximumFractionDigits: 2 })} ${targetTimeUnit}`
      : 'N/A';
  const timeToGoalLabel =
    result.monthsToGoal !== undefined && result.monthsToGoal !== null
      ? formatTime(result.monthsToGoal)
      : 'N/A';
  const requiredMonthlyLabel =
    result.requiredMonthlySavings === null || result.requiredMonthlySavings === undefined
      ? 'N/A'
      : formatCurrency(result.requiredMonthlySavings);

  const primaryLabel = isTimeMode ? timeToGoalLabel : requiredMonthlyLabel;

  if (resultOutput) {
    resultOutput.textContent = isTimeMode
      ? `Estimated time to goal: ${timeToGoalLabel}`
      : `Required monthly savings: ${requiredMonthlyLabel}`;
  }

  if (resultDetail) {
    resultDetail.innerHTML =
      `<p><strong>Final Balance:</strong> ${formatCurrency(result.finalBalance)}</p>` +
      `<p><strong>Total Contributions:</strong> ${formatCurrency(result.totalContributions)}</p>` +
      `<p><strong>Total Interest Earned:</strong> ${formatCurrency(result.totalInterestEarned)}</p>`;
  }

  updateExplanation({
    goal: formatCurrency(goalAmount),
    current: formatCurrency(currentSavings),
    mode: modeLabel,
    monthly: formatCurrency(result.monthlyContribution ?? 0),
    targetTime: targetLabel,
    rate: formatPercent(annualRate),
    frequency: result.compoundingLabel,
    primary: primaryLabel,
    timeToGoal: timeToGoalLabel,
    requiredMonthly: requiredMonthlyLabel,
    finalBalance: formatCurrency(result.finalBalance),
    totalContributions: formatCurrency(result.totalContributions),
    totalInterest: formatCurrency(result.totalInterestEarned),
  });
}

if (calculateButton) {
  calculateButton.addEventListener('click', calculate);
}

[goalInput, currentInput, monthlyInput, targetTimeInput, rateInput].forEach((input) => {
  if (!input) {
    return;
  }
  input.addEventListener('input', () => {
    if (liveUpdatesEnabled && hasCalculated) {
      calculate();
    }
  });
});

calculate();
