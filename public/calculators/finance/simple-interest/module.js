import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import { formatNumber } from '/assets/js/core/format.js';
import { calculateSimpleInterest } from '/assets/js/core/time-value-utils.js';

const principalInput = document.querySelector('#si-principal');
const rateInput = document.querySelector('#si-rate');
const timeInput = document.querySelector('#si-time');
const calculateButton = document.querySelector('#si-calc');
const resultOutput = document.querySelector('#si-result');
const resultDetail = document.querySelector('#si-result-detail');
const optionalToggle = document.querySelector('#si-optional-toggle');
const optionalSection = document.querySelector('#si-optional-section');

const timeUnitGroup = document.querySelector('[data-button-group="si-time-unit"]');
const basisGroup = document.querySelector('[data-button-group="si-basis"]');

const explanationRoot = document.querySelector('#si-explanation');
const valueTargets = explanationRoot
  ? {
      principal: explanationRoot.querySelectorAll('[data-si="principal"]'),
      rate: explanationRoot.querySelectorAll('[data-si="rate"]'),
      time: explanationRoot.querySelectorAll('[data-si="time"]'),
      timeUnit: explanationRoot.querySelectorAll('[data-si="time-unit"]'),
      basis: explanationRoot.querySelectorAll('[data-si="basis"]'),
      totalInterest: explanationRoot.querySelectorAll('[data-si="total-interest"]'),
      endingAmount: explanationRoot.querySelectorAll('[data-si="ending-amount"]'),
      years: explanationRoot.querySelectorAll('[data-si="years"]'),
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
      name: 'What is simple interest?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Simple interest is interest calculated only on the original principal amount.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the simple interest formula?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A common formula is I = P × r × t, where P is principal, r is rate, and t is time.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you calculate simple interest?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Multiply the principal by the rate and the time period to get total interest.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the ending amount with simple interest?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The ending amount is A = P + I, which is principal plus total interest.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between simple and compound interest?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Simple interest applies only to principal, while compound interest applies to principal plus accumulated interest.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use this for a simple interest loan calculation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. It can estimate interest owed on loans that use simple interest.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does simple interest grow linearly?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. With a fixed rate, simple interest increases at a constant amount over time.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I calculate simple interest for months?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Convert months to years by dividing by 12, then apply the same formula.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if the interest rate is 0%?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Total interest is zero and the ending amount equals the principal.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is simple interest common for long-term investing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Generally no. Long-term investing more often involves compounding, but simple interest is useful for quick comparisons.',
      },
    },
  ],
};

const metadata = {
  title: 'Simple Interest Calculator – CalcHowMuch',
  description:
    'Calculate simple interest to find total interest and ending amount using principal, rate, and time. Compare simple vs compound interest quickly.',
  canonical: 'https://calchowmuch.com/finance/simple-interest/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Simple Interest Calculator',
        url: 'https://calchowmuch.com/finance/simple-interest/',
        description:
          'Calculate simple interest to estimate total interest and ending amount based on principal, rate, and time.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Simple Interest Calculator',
        applicationCategory: 'FinanceApplication',
        applicationSubCategory: 'Interest & Growth Calculator',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/finance/simple-interest/',
        description:
          'Free simple interest calculator to compute total interest and ending amount using principal, rate, and time.',
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
            name: 'Simple Interest',
            item: 'https://calchowmuch.com/finance/simple-interest/',
          },
        ],
      },
    ],
  },
};

setPageMetadata(metadata);

const timeUnitButtons = setupButtonGroup(timeUnitGroup, {
  defaultValue: 'years',
  onChange: () => {
    if (hasCalculated) {
      calculate();
    }
  },
});

const basisButtons = setupButtonGroup(basisGroup, {
  defaultValue: 'per-year',
  onChange: () => {
    if (hasCalculated) {
      calculate();
    }
  },
});

let hasCalculated = false;

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

function formatCurrency(value) {
  return `$${formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatPercent(value) {
  return `${formatNumber(value, { maximumFractionDigits: 4 })}%`;
}

function updateExplanation(values) {
  if (!valueTargets) {
    return;
  }

  updateTargets(valueTargets.principal, values.principal);
  updateTargets(valueTargets.rate, values.rate);
  updateTargets(valueTargets.time, values.time);
  updateTargets(valueTargets.timeUnit, values.timeUnit);
  updateTargets(valueTargets.basis, values.basis);
  updateTargets(valueTargets.totalInterest, values.totalInterest);
  updateTargets(valueTargets.endingAmount, values.endingAmount);
  updateTargets(valueTargets.years, values.years);
}

function showError(message) {
  if (resultOutput) {
    resultOutput.textContent = message;
  }
  if (resultDetail) {
    resultDetail.textContent = '';
  }
  updateExplanation({
    principal: 'N/A',
    rate: 'N/A',
    time: 'N/A',
    timeUnit: 'N/A',
    basis: 'N/A',
    totalInterest: 'N/A',
    endingAmount: 'N/A',
    years: 'N/A',
  });
}

function calculate() {
  const principal = Number.parseFloat(principalInput?.value ?? '');
  const rate = Number.parseFloat(rateInput?.value ?? '');
  const timePeriod = Number.parseFloat(timeInput?.value ?? '');
  const timeUnit = timeUnitButtons?.getValue() ?? 'years';
  const interestBasis = basisButtons?.getValue() ?? 'per-year';

  if (!Number.isFinite(principal) || !Number.isFinite(rate) || !Number.isFinite(timePeriod)) {
    showError('Enter valid principal, rate, and time values.');
    return;
  }

  const result = calculateSimpleInterest({
    principal,
    rate,
    timePeriod,
    timeUnit,
    interestBasis,
  });

  if (!result) {
    showError('Principal, rate, and time must be zero or greater.');
    return;
  }

  if (resultOutput) {
    resultOutput.textContent = `Total interest: ${formatCurrency(result.totalInterest)}`;
  }
  if (resultDetail) {
    resultDetail.textContent = `Ending amount: ${formatCurrency(result.endingAmount)}`;
  }

  updateExplanation({
    principal: formatCurrency(result.principal),
    rate: formatPercent(result.rate),
    time: formatNumber(result.timePeriod, { maximumFractionDigits: 4 }),
    timeUnit: result.timeUnit === 'months' ? 'Months' : 'Years',
    basis: result.interestBasis === 'per-month' ? 'Per Month' : 'Per Year',
    totalInterest: formatCurrency(result.totalInterest),
    endingAmount: formatCurrency(result.endingAmount),
    years: formatNumber(result.years, { maximumFractionDigits: 6 }),
  });

  hasCalculated = true;
}

calculateButton?.addEventListener('click', calculate);

updateExplanation({
  principal: '$10,000.00',
  rate: '6%',
  time: '3',
  timeUnit: 'Years',
  basis: 'Per Year',
  totalInterest: '$1,800.00',
  endingAmount: '$11,800.00',
  years: '3',
});
