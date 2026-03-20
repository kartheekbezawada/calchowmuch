import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import { calculateSavingsGoal } from '/assets/js/core/time-value-utils.js';

/* ── DOM refs: calculator inputs ── */
const goalInput = document.querySelector('#tsg-goal');
const currentInput = document.querySelector('#tsg-current');
const contributionInput = document.querySelector('#tsg-contribution');
const rateInput = document.querySelector('#tsg-rate');
const calculateButton = document.querySelector('#tsg-calc');
const resultDiv = document.querySelector('#tsg-result');
const summaryDiv = document.querySelector('#tsg-result-detail');
const metricContributions = document.querySelector('[data-tsg="metric-contributions"]');
const metricInterest = document.querySelector('[data-tsg="metric-interest"]');
const metricBalance = document.querySelector('[data-tsg="metric-balance"]');

/* ── DOM refs: slider value displays ── */
const goalDisplay = document.querySelector('#tsg-goal-display');
const currentDisplay = document.querySelector('#tsg-current-display');
const contribDisplay = document.querySelector('#tsg-contribution-display');
const rateDisplay = document.querySelector('#tsg-rate-display');

/* ── DOM refs: snapshot rows ── */
const snapGoal = document.querySelector('[data-tsg="snap-goal"]');
const snapCurrent = document.querySelector('[data-tsg="snap-current"]');
const snapContribution = document.querySelector('[data-tsg="snap-contribution"]');
const snapRate = document.querySelector('[data-tsg="snap-rate"]');
const snapCompounding = document.querySelector('[data-tsg="snap-compounding"]');
const snapTiming = document.querySelector('[data-tsg="snap-timing"]');
const snapContributions = document.querySelector('[data-tsg="snap-contributions"]');
const snapInterest = document.querySelector('[data-tsg="snap-interest"]');

/* ── DOM refs: explanation targets ── */
const explanationRoot = document.querySelector('#tsg-explanation');
const valueTargets = explanationRoot
  ? {
      goal: explanationRoot.querySelectorAll('[data-tsg="goal"]'),
      current: explanationRoot.querySelectorAll('[data-tsg="current"]'),
      contribution: explanationRoot.querySelectorAll('[data-tsg="contribution"]'),
      rate: explanationRoot.querySelectorAll('[data-tsg="rate"]'),
      compounding: explanationRoot.querySelectorAll('[data-tsg="compounding"]'),
      timing: explanationRoot.querySelectorAll('[data-tsg="timing"]'),
      monthsRequired: explanationRoot.querySelectorAll('[data-tsg="months-required"]'),
      yearsDecimal: explanationRoot.querySelectorAll('[data-tsg="years-decimal"]'),
      totalContributions: explanationRoot.querySelectorAll('[data-tsg="total-contributions"]'),
      totalInterest: explanationRoot.querySelectorAll('[data-tsg="total-interest"]'),
      finalBalance: explanationRoot.querySelectorAll('[data-tsg="final-balance"]'),
      periodsPerYear: explanationRoot.querySelectorAll('[data-tsg="periods-per-year"]'),
      gap: explanationRoot.querySelectorAll('[data-tsg="gap"]'),
      timeResult: explanationRoot.querySelectorAll('[data-tsg="time-result"]'),
    }
  : null;

/* ── Button groups ── */
const compoundingGroup = document.querySelector('[data-button-group="tsg-compounding"]');
const timingGroup = document.querySelector('[data-button-group="tsg-timing"]');

const compoundingButtons = setupButtonGroup(compoundingGroup, {
  defaultValue: 'annual',
  onChange() {
    calculate();
  },
});

const timingButtons = setupButtonGroup(timingGroup, {
  defaultValue: 'end',
  onChange() {
    calculate();
  },
});

/* ── SEO / Schema ── */
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
  title: 'Time to Savings Goal Calculator | Reach Your Target',
  description:
    'Estimate how long it could take to reach a savings goal using current balance, contributions, interest rate, and compounding.',
  canonical: 'https://calchowmuch.com/finance-calculators/time-to-savings-goal-calculator/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Time to Savings Goal Calculator | Reach Your Target',
        url: 'https://calchowmuch.com/finance-calculators/time-to-savings-goal-calculator/',
        description:
          'Estimate how long it could take to reach a savings goal using current balance, contributions, interest rate, and compounding.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Time to Savings Goal Calculator',
        applicationCategory: 'FinanceApplication',
        applicationSubCategory: 'Savings & Wealth Calculator',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/finance-calculators/time-to-savings-goal-calculator/',
        description:
          'Free savings timeline calculator. See when your goal could be reached with contributions and compound growth.',
        browserRequirements: 'Requires JavaScript enabled',
        softwareVersion: '1.0',
        creator: { '@type': 'Organization', name: 'CalcHowMuch' },
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://calchowmuch.com/' },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Finance',
            item: 'https://calchowmuch.com/finance-calculators/',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Time to Savings Goal',
            item: 'https://calchowmuch.com/finance-calculators/time-to-savings-goal-calculator/',
          },
        ],
      },
    ],
  },
};

setPageMetadata(metadata);

/* ── Helpers ── */

function fmt(value, opts = {}) {
  return formatNumber(value, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...opts,
  });
}

function setSliderFill(input) {
  if (!input) {return;}
  const min = Number(input.min || 0);
  const max = Number(input.max || 100);
  const value = Number(input.value);
  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0;
  input.style.setProperty('--fill', `${Math.min(100, Math.max(0, pct))}%`);
}

function updateSliderDisplays() {
  if (goalInput && goalDisplay) {
    setSliderFill(goalInput);
    goalDisplay.textContent = fmt(Number(goalInput.value), { maximumFractionDigits: 0 });
  }
  if (currentInput && currentDisplay) {
    setSliderFill(currentInput);
    currentDisplay.textContent = fmt(Number(currentInput.value), { maximumFractionDigits: 0 });
  }
  if (contributionInput && contribDisplay) {
    setSliderFill(contributionInput);
    contribDisplay.textContent = fmt(Number(contributionInput.value), { maximumFractionDigits: 0 });
  }
  if (rateInput && rateDisplay) {
    setSliderFill(rateInput);
    rateDisplay.textContent = `${Number(rateInput.value)}%`;
  }
}

function updateTargets(targets, value) {
  if (!targets) {return;}
  targets.forEach((node) => {
    node.textContent = value;
  });
}

function setError(message) {
  if (resultDiv) {resultDiv.textContent = message;}
  if (metricContributions) {metricContributions.textContent = '-';}
  if (metricInterest) {metricInterest.textContent = '-';}
  if (metricBalance) {metricBalance.textContent = '-';}
}

function timingLabel(value) {
  return value === 'beginning' ? 'Beginning of Month' : 'End of Month';
}

/* ── Core calculate ── */

function calculate() {
  if (!resultDiv || !summaryDiv) {return;}
  try {
    const goalAmount = Number(goalInput?.value);
    const currentSavings = Number(currentInput?.value);
    const monthlyContribution = Number(contributionInput?.value);
    const annualRate = Number(rateInput?.value);
    const compounding = compoundingButtons?.getValue() ?? 'annual';
    const contributionTiming = timingButtons?.getValue() ?? 'end';

    if (!Number.isFinite(goalAmount) || goalAmount <= 0) {
      setError('Goal must be greater than 0.');
      return;
    }
    if (!Number.isFinite(currentSavings) || currentSavings < 0) {
      setError('Current savings cannot be negative.');
      return;
    }
    if (!Number.isFinite(monthlyContribution) || monthlyContribution < 0) {
      setError('Contribution must be 0 or more.');
      return;
    }
    if (!Number.isFinite(annualRate) || annualRate < 0) {
      setError('Rate must be 0 or more.');
      return;
    }

    if (currentSavings >= goalAmount) {
      resultDiv.innerHTML = '<span class="mtg-result-value is-updated">Already reached!</span>';
      const el = resultDiv.querySelector('.mtg-result-value');
      if (el) {setTimeout(() => el.classList.remove('is-updated'), 420);}
      if (metricContributions) {metricContributions.textContent = '0.00';}
      if (metricInterest) {metricInterest.textContent = '0.00';}
      if (metricBalance) {metricBalance.textContent = fmt(currentSavings);}
      return;
    }

    const result = calculateSavingsGoal({
      mode: 'time-to-goal',
      goalAmount,
      currentSavings,
      monthlyContribution,
      annualRate,
      compounding,
      contributionTiming,
    });

    if (!result) {
      setError(
        'Cannot reach this goal with these inputs. Try increasing contributions or interest rate.'
      );
      return;
    }

    /* Derived values */
    const gap = goalAmount - currentSavings;
    const yearsDecimal = (result.monthsToGoal / 12).toFixed(1);
    const timeStr =
      result.yearsPart > 0
        ? `${result.yearsPart} Year${result.yearsPart !== 1 ? 's' : ''} and ${result.remainingMonthsPart} Month${result.remainingMonthsPart !== 1 ? 's' : ''}`
        : `${result.remainingMonthsPart} Month${result.remainingMonthsPart !== 1 ? 's' : ''}`;
    const timingStr = timingLabel(contributionTiming);

    /* Formatted strings */
    const goalStr = fmt(goalAmount, { maximumFractionDigits: 0 });
    const currentStr = fmt(currentSavings, { maximumFractionDigits: 0 });
    const contribStr = fmt(monthlyContribution, { maximumFractionDigits: 0 });
    const rateStr = formatPercent(annualRate);
    const compoundingStr = result.compoundingLabel;
    const monthsStr = String(result.monthsToGoal);
    const totalContribStr = fmt(result.totalContributions);
    const totalInterestStr = fmt(result.totalInterestEarned);
    const finalBalanceStr = fmt(result.finalBalance);
    const gapStr = fmt(gap, { maximumFractionDigits: 0 });
    const periodsPerYearStr = String(result.periodsPerYear);

    /* Preview panel */
    resultDiv.innerHTML = `<span class="mtg-result-value is-updated">${timeStr}</span>`;
    const valueEl = resultDiv.querySelector('.mtg-result-value');
    if (valueEl) {setTimeout(() => valueEl.classList.remove('is-updated'), 420);}

    if (metricContributions) {metricContributions.textContent = totalContribStr;}
    if (metricInterest) {metricInterest.textContent = totalInterestStr;}
    if (metricBalance) {metricBalance.textContent = finalBalanceStr;}

    /* Snapshot rows */
    if (snapGoal) {snapGoal.textContent = goalStr;}
    if (snapCurrent) {snapCurrent.textContent = currentStr;}
    if (snapContribution) {snapContribution.textContent = contribStr;}
    if (snapRate) {snapRate.textContent = rateStr;}
    if (snapCompounding) {snapCompounding.textContent = compoundingStr;}
    if (snapTiming) {snapTiming.textContent = timingStr;}
    if (snapContributions) {snapContributions.textContent = totalContribStr;}
    if (snapInterest) {snapInterest.textContent = totalInterestStr;}

    /* Explanation targets */
    if (valueTargets) {
      updateTargets(valueTargets.goal, goalStr);
      updateTargets(valueTargets.current, currentStr);
      updateTargets(valueTargets.contribution, contribStr);
      updateTargets(valueTargets.rate, rateStr);
      updateTargets(valueTargets.compounding, compoundingStr);
      updateTargets(valueTargets.timing, timingStr);
      updateTargets(valueTargets.monthsRequired, monthsStr);
      updateTargets(valueTargets.yearsDecimal, yearsDecimal);
      updateTargets(valueTargets.totalContributions, totalContribStr);
      updateTargets(valueTargets.totalInterest, totalInterestStr);
      updateTargets(valueTargets.finalBalance, finalBalanceStr);
      updateTargets(valueTargets.periodsPerYear, periodsPerYearStr);
      updateTargets(valueTargets.gap, gapStr);
      updateTargets(valueTargets.timeResult, timeStr);
    }
  } catch (err) {
    console.error('[TSG Calculator] calculate():', err);
  }
}

/* ── Event wiring ── */

[goalInput, currentInput, contributionInput, rateInput].forEach((input) => {
  input?.addEventListener('input', () => {
    updateSliderDisplays();
    calculate();
  });
});

calculateButton?.addEventListener('click', calculate);

/* ── Init ── */
updateSliderDisplays();
calculate();
