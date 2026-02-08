import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import { formatNumber } from '/assets/js/core/format.js';
import { calculateFutureValue, resolveCompounding } from '/assets/js/core/time-value-utils.js';

const presentValueInput = document.querySelector('#fv-present-value');
const interestRateInput = document.querySelector('#fv-interest-rate');
const timePeriodInput = document.querySelector('#fv-time-period');
const regularContributionInput = document.querySelector('#fv-regular-contribution');
const calculateButton = document.querySelector('#fv-calc');
const resultOutput = document.querySelector('#fv-result');
const resultDetail = document.querySelector('#fv-result-detail');
const optionalToggle = document.querySelector('#fv-optional-toggle');
const optionalSection = document.querySelector('#fv-optional-section');

const periodGroup = document.querySelector('[data-button-group="fv-period-type"]');
const compoundingGroup = document.querySelector('[data-button-group="fv-compounding"]');

const explanationRoot = document.querySelector('#fv-explanation');
const valueTargets = explanationRoot
  ? {
      presentValue: explanationRoot.querySelectorAll('[data-fv="present-value"]'),
      interestRate: explanationRoot.querySelectorAll('[data-fv="interest-rate"]'),
      timePeriod: explanationRoot.querySelectorAll('[data-fv="time-period"]'),
      compoundingFrequency: explanationRoot.querySelectorAll('[data-fv="compounding-frequency"]'),
      futureValue: explanationRoot.querySelectorAll('[data-fv="future-value"]'),
      totalContributions: explanationRoot.querySelectorAll('[data-fv="total-contributions"]'),
      totalGrowth: explanationRoot.querySelectorAll('[data-fv="total-growth"]'),
      totalPeriods: explanationRoot.querySelectorAll('[data-fv="total-periods"]'),
      regularContribution: explanationRoot.querySelectorAll('[data-fv="regular-contribution"]'),
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
      name: 'What is future value (FV)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Future value is the amount your money will be worth at a future date after earning interest or growth.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is future value different from present value?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Present value is today’s worth of money, while future value shows what it grows into over time.',
      },
    },
    {
      '@type': 'Question',
      name: 'What interest rate should I use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use an expected return rate based on savings, investments, or inflation assumptions.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does compounding affect future value?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'More frequent compounding increases growth by earning interest on interest.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does time period matter for future value?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, longer time periods significantly increase future value due to compounding.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are regular contributions?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Regular contributions are additional amounts added periodically to increase total savings.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is future value useful for retirement planning?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, it helps estimate how current savings may grow by retirement.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can future value decrease over time?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'With a positive interest rate, future value increases; negative rates reduce growth.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if the interest rate is zero?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The future value equals the present value plus any contributions.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this calculator suitable for savings and investments?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, it can be used for savings goals, investments, education funds, and retirement planning.',
      },
    },
  ],
};

const metadata = {
  title: 'Future Value (FV) Calculator – CalcHowMuch',
  description:
    'Calculate how much your money could grow in the future using interest rate and time period. Simple FV calculator.',
  canonical: 'https://calchowmuch.com/finance/future-value/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Future Value (FV) Calculator',
        url: 'https://calchowmuch.com/finance/future-value/',
        description: 'Estimate the future value of money using growth rate, time period, and compounding.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Future Value (FV) Calculator',
        applicationCategory: 'FinanceApplication',
        applicationSubCategory: 'Time Value of Money Calculator',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/finance/future-value/',
        description:
          'Calculate future value using present value, growth rate, time period, compounding frequency, and optional regular contributions.',
        browserRequirements: 'Requires JavaScript enabled',
        softwareVersion: '1.0',
        creator: {
          '@type': 'Organization',
          name: 'CalcHowMuch',
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://calchowmuch.com/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Finance',
            item: 'https://calchowmuch.com/finance/',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Future Value (FV)',
            item: 'https://calchowmuch.com/finance/future-value/',
          },
        ],
      },
    ],
  },
};

setPageMetadata(metadata);

const periodButtons = setupButtonGroup(periodGroup, {
  defaultValue: 'years',
  onChange: () => {
    if (liveUpdatesEnabled && hasCalculated) {
      calculate();
    }
  },
});

const compoundingButtons = setupButtonGroup(compoundingGroup, {
  defaultValue: 'annual',
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

function readInputValue(input) {
  if (!input) {
    return NaN;
  }
  return Number.parseFloat(input.value);
}

function formatCurrencyValue(value) {
  return formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatPercentValue(value, maximumFractionDigits = 2) {
  return `${formatNumber(value, { maximumFractionDigits })}%`;
}

function updateTargets(targets, value) {
  if (!targets) {
    return;
  }
  targets.forEach((node) => {
    node.textContent = value;
  });
}

function updateExplanation({
  presentValue,
  interestRate,
  timePeriod,
  compoundingFrequency,
  futureValue,
  totalContributions,
  totalGrowth,
  totalPeriods,
  regularContribution,
}) {
  if (!valueTargets) {
    return;
  }

  updateTargets(valueTargets.presentValue, presentValue);
  updateTargets(valueTargets.interestRate, interestRate);
  updateTargets(valueTargets.timePeriod, timePeriod);
  updateTargets(valueTargets.compoundingFrequency, compoundingFrequency);
  updateTargets(valueTargets.futureValue, futureValue);
  updateTargets(valueTargets.totalContributions, totalContributions);
  updateTargets(valueTargets.totalGrowth, totalGrowth);
  updateTargets(valueTargets.totalPeriods, totalPeriods);
  updateTargets(valueTargets.regularContribution, regularContribution);
}

function showError(message) {
  if (resultOutput) {
    resultOutput.textContent = message;
  }
  if (resultDetail) {
    resultDetail.textContent = '';
  }
  updateExplanation({
    presentValue: '—',
    interestRate: '—',
    timePeriod: '—',
    compoundingFrequency: '—',
    futureValue: '—',
    totalContributions: '—',
    totalGrowth: '—',
    totalPeriods: '—',
    regularContribution: '—',
  });
}

function calculate() {
  const pv = readInputValue(presentValueInput);
  const rate = readInputValue(interestRateInput);
  const period = readInputValue(timePeriodInput);
  const contribution = readInputValue(regularContributionInput) || 0;
  const periodType = periodButtons?.getValue() ?? 'years';
  const compounding = compoundingButtons?.getValue() ?? 'annual';
  const compoundingInfo = resolveCompounding(compounding);

  if (!Number.isFinite(pv) || !Number.isFinite(rate) || !Number.isFinite(period)) {
    showError('Enter valid numbers for present value, interest rate, and time period.');
    return;
  }

  if (pv < 0 || rate < 0 || period < 0 || contribution < 0) {
    showError('Values must be zero or greater.');
    return;
  }

  const result = calculateFutureValue({
    presentValue: pv,
    interestRate: rate,
    timePeriod: period,
    periodType,
    compounding,
    regularContribution: contribution,
  });

  if (!result) {
    showError('Check your inputs. Interest rate must be above -100%.');
    return;
  }

  hasCalculated = true;

  const totalPeriodsDisplay = formatNumber(result.totalPeriods, { maximumFractionDigits: 2 });
  const presentValueDisplay = formatCurrencyValue(pv);
  const interestRateDisplay = formatPercentValue(rate, 2);
  const timePeriodDisplay = `${formatNumber(period, { maximumFractionDigits: 2 })} ${
    periodType === 'months' ? 'months' : 'years'
  }`;
  const compoundingDisplay = compoundingInfo.label;
  const futureValueDisplay = formatCurrencyValue(result.futureValue);
  const totalContributionsDisplay = formatCurrencyValue(result.totalContributions);
  const totalGrowthDisplay = formatCurrencyValue(result.totalGrowth);
  const regularContributionDisplay = formatCurrencyValue(contribution);

  if (resultOutput) {
    resultOutput.textContent = `Future Value: ${futureValueDisplay}`;
  }

  if (resultDetail) {
    resultDetail.innerHTML =
      `<p><strong>Total contributions:</strong> ${totalContributionsDisplay}</p>` +
      `<p><strong>Total growth:</strong> ${totalGrowthDisplay}</p>` +
      `<p><strong>Effective periods:</strong> ${totalPeriodsDisplay}</p>` +
      `<p><strong>Compounding frequency:</strong> ${compoundingDisplay}</p>`;
  }

  updateExplanation({
    presentValue: presentValueDisplay,
    interestRate: interestRateDisplay,
    timePeriod: timePeriodDisplay,
    compoundingFrequency: compoundingDisplay,
    futureValue: futureValueDisplay,
    totalContributions: totalContributionsDisplay,
    totalGrowth: totalGrowthDisplay,
    totalPeriods: totalPeriodsDisplay,
    regularContribution: regularContributionDisplay,
  });
}

if (calculateButton) {
  calculateButton.addEventListener('click', calculate);
}

[presentValueInput, interestRateInput, timePeriodInput, regularContributionInput].forEach((input) => {
  if (!input) {
    return;
  }
  input.addEventListener('input', () => {
    if (liveUpdatesEnabled && hasCalculated) {
      calculate();
    }
  });
});

if (presentValueInput && interestRateInput && timePeriodInput) {
  calculate();
}
