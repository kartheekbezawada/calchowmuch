import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import { formatCurrency, formatPercent } from '/assets/js/core/format.js';
import { calculateInvestmentGrowth } from '/assets/js/core/time-value-utils.js';

const initialInput = document.querySelector('#ig-initial');
const returnInput = document.querySelector('#ig-return');
const timeInput = document.querySelector('#ig-time');
const contributionInput = document.querySelector('#ig-contribution');
const inflationInput = document.querySelector('#ig-inflation');
const calculateButton = document.querySelector('#ig-calc');
const resultOutput = document.querySelector('#ig-result');
const resultDetail = document.querySelector('#ig-result-detail');
const optionalToggle = document.querySelector('#ig-optional-toggle');
const optionalSection = document.querySelector('#ig-optional-section');

const periodTypeGroup = document.querySelector('[data-button-group="ig-period-type"]');
const compoundingGroup = document.querySelector('[data-button-group="ig-compounding"]');

const explanationRoot = document.querySelector('#ig-explanation');
const inflationRow = explanationRoot ? explanationRoot.querySelector('#ig-inflation-row') : null;
const valueTargets = explanationRoot
  ? {
      initial: explanationRoot.querySelectorAll('[data-ig="initial"]'),
      returnRate: explanationRoot.querySelectorAll('[data-ig="return-rate"]'),
      frequency: explanationRoot.querySelectorAll('[data-ig="frequency"]'),
      time: explanationRoot.querySelectorAll('[data-ig="time"]'),
      futureValue: explanationRoot.querySelectorAll('[data-ig="future-value"]'),
      totalGains: explanationRoot.querySelectorAll('[data-ig="total-gains"]'),
      totalContributions: explanationRoot.querySelectorAll('[data-ig="total-contributions"]'),
      inflationAdjusted: explanationRoot.querySelectorAll('[data-ig="inflation-adjusted"]'),
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
      name: 'What is an investment growth calculator?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'An investment growth calculator estimates the future value of an investment based on expected return, time, and contributions.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you calculate investment growth over time?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You apply compound growth assumptions using an expected annual return and the investment period, and add contributions if applicable.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is future value in investing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Future value is the estimated amount your investment could grow to after a set time period.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do monthly contributions affect investment growth?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Monthly contributions can increase the final balance because added deposits may also earn returns over time.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does expected annual return mean?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It is the assumed average yearly growth rate used for forecasting.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does compounding frequency matter for investment growth?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. More frequent compounding can slightly increase estimated growth under the same annual return assumption.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can this calculator estimate investment returns?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. It estimates future value and total growth based on the return rate you enter.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is inflation-adjusted future value?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It estimates your ending balance in today\'s purchasing power after accounting for inflation.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if the return rate is 0%?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Future value equals the initial investment plus total contributions.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this investment growth estimate guaranteed?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It is a projection based on assumptions and actual market returns can vary.',
      },
    },
  ],
};

const metadata = {
  title: 'Investment Growth Calculator \u2013 CalcHowMuch',
  description:
    'Estimate investment growth over time. Calculate future value, total contributions, and total gains using an expected annual return. Optional inflation adjustment.',
  canonical: 'https://calchowmuch.com/finance/investment-growth/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Investment Growth Calculator',
        url: 'https://calchowmuch.com/finance/investment-growth/',
        description:
          'Estimate investment growth over time. Calculate future value, total contributions, and total gains using an expected annual return.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Investment Growth Calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/finance/investment-growth/',
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
            name: 'Investment Growth',
            item: 'https://calchowmuch.com/finance/investment-growth/',
          },
        ],
      },
    ],
  },
};

setPageMetadata(metadata);

const periodTypeButtons = setupButtonGroup(periodTypeGroup, {
  defaultValue: 'years',
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

function updateTargets(targets, value) {
  if (!targets) {
    return;
  }
  targets.forEach((node) => {
    node.textContent = value;
  });
}

function updateExplanation({ initial, returnRate, frequency, time, futureValue, totalGains, totalContributions, inflationAdjusted }) {
  if (!valueTargets) {
    return;
  }
  updateTargets(valueTargets.initial, initial);
  updateTargets(valueTargets.returnRate, returnRate);
  updateTargets(valueTargets.frequency, frequency);
  updateTargets(valueTargets.time, time);
  updateTargets(valueTargets.futureValue, futureValue);
  updateTargets(valueTargets.totalGains, totalGains);
  updateTargets(valueTargets.totalContributions, totalContributions);
  updateTargets(valueTargets.inflationAdjusted, inflationAdjusted || 'N/A');

  if (inflationRow) {
    const show = inflationAdjusted && inflationAdjusted !== 'N/A';
    inflationRow.classList.toggle('is-hidden', !show);
  }
}

function showError(message) {
  if (resultOutput) {
    resultOutput.textContent = message;
  }
  if (resultDetail) {
    resultDetail.textContent = '';
  }

  updateExplanation({
    initial: 'N/A',
    returnRate: 'N/A',
    frequency: 'N/A',
    time: 'N/A',
    futureValue: 'N/A',
    totalGains: 'N/A',
    totalContributions: 'N/A',
    inflationAdjusted: 'N/A',
  });
}

function calculate() {
  const initialInvestment = Number.parseFloat(initialInput?.value ?? '');
  const expectedReturn = Number.parseFloat(returnInput?.value ?? '');
  const timePeriod = Number.parseFloat(timeInput?.value ?? '');
  const monthlyContribution = Number.parseFloat(contributionInput?.value ?? '0');
  const inflationRate = Number.parseFloat(inflationInput?.value ?? '0');
  const periodType = periodTypeButtons?.getValue() ?? 'years';
  const compounding = compoundingButtons?.getValue() ?? 'monthly';

  if (!Number.isFinite(initialInvestment)) {
    showError('Enter a valid initial investment amount.');
    return;
  }

  if (initialInvestment < 0) {
    showError('Initial investment must be zero or greater.');
    return;
  }

  if (!Number.isFinite(expectedReturn)) {
    showError('Enter a valid expected annual return.');
    return;
  }

  if (expectedReturn < 0) {
    showError('Expected return must be zero or greater.');
    return;
  }

  if (!Number.isFinite(timePeriod) || timePeriod < 0) {
    showError('Enter a valid time period.');
    return;
  }

  if (!Number.isFinite(monthlyContribution) || monthlyContribution < 0) {
    showError('Monthly contribution must be zero or greater.');
    return;
  }

  if (!Number.isFinite(inflationRate) || inflationRate < 0) {
    showError('Inflation rate must be zero or greater.');
    return;
  }

  const result = calculateInvestmentGrowth({
    initialInvestment,
    expectedReturn,
    timePeriod,
    periodType,
    compounding,
    monthlyContribution,
    inflationRate,
  });

  if (!result) {
    showError('Check your values and try again.');
    return;
  }

  hasCalculated = true;

  const periodLabel = periodType === 'months' ? 'months' : 'years';
  const timeDisplay = `${timePeriod} ${periodLabel}`;

  if (resultOutput) {
    resultOutput.textContent = `Future Value: ${formatCurrency(result.futureValue)}`;
  }

  let detailHtml =
    `<p><strong>Total Gains:</strong> ${formatCurrency(result.totalGains)}</p>` +
    `<p><strong>Total Contributions:</strong> ${formatCurrency(result.totalContributions)}</p>` +
    `<p><strong>Compounding:</strong> ${result.compoundingLabel}</p>`;

  if (result.inflationAdjustedFV !== null) {
    detailHtml += `<p><strong>Inflation-Adjusted Value:</strong> ${formatCurrency(result.inflationAdjustedFV)}</p>`;
  }

  if (resultDetail) {
    resultDetail.innerHTML = detailHtml;
  }

  const inflationAdjustedDisplay = result.inflationAdjustedFV !== null
    ? formatCurrency(result.inflationAdjustedFV)
    : null;

  updateExplanation({
    initial: formatCurrency(initialInvestment),
    returnRate: formatPercent(expectedReturn),
    frequency: result.compoundingLabel,
    time: timeDisplay,
    futureValue: formatCurrency(result.futureValue),
    totalGains: formatCurrency(result.totalGains),
    totalContributions: formatCurrency(result.totalContributions),
    inflationAdjusted: inflationAdjustedDisplay,
  });
}

if (calculateButton) {
  calculateButton.addEventListener('click', calculate);
}

[initialInput, returnInput, timeInput, contributionInput, inflationInput].forEach((input) => {
  if (input) {
    input.addEventListener('input', () => {
      if (liveUpdatesEnabled && hasCalculated) {
        calculate();
      }
    });
  }
});

if (initialInput) {
  calculate();
}
