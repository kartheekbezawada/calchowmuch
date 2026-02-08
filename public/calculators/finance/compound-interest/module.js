import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import { formatCurrency, formatPercent } from '/assets/js/core/format.js';
import { calculateCompoundInterest } from '/assets/js/core/time-value-utils.js';

const principalInput = document.querySelector('#ci-principal');
const rateInput = document.querySelector('#ci-rate');
const timeInput = document.querySelector('#ci-time');
const contributionInput = document.querySelector('#ci-contribution');
const calculateButton = document.querySelector('#ci-calc');
const resultOutput = document.querySelector('#ci-result');
const resultDetail = document.querySelector('#ci-result-detail');
const optionalToggle = document.querySelector('#ci-optional-toggle');
const optionalSection = document.querySelector('#ci-optional-section');

const periodTypeGroup = document.querySelector('[data-button-group="ci-period-type"]');
const compoundingGroup = document.querySelector('[data-button-group="ci-compounding"]');

const explanationRoot = document.querySelector('#ci-explanation');
const valueTargets = explanationRoot
  ? {
      principal: explanationRoot.querySelectorAll('[data-ci="principal"]'),
      rate: explanationRoot.querySelectorAll('[data-ci="rate"]'),
      frequency: explanationRoot.querySelectorAll('[data-ci="frequency"]'),
      time: explanationRoot.querySelectorAll('[data-ci="time"]'),
      endingBalance: explanationRoot.querySelectorAll('[data-ci="ending-balance"]'),
      totalInterest: explanationRoot.querySelectorAll('[data-ci="total-interest"]'),
      totalContributions: explanationRoot.querySelectorAll('[data-ci="total-contributions"]'),
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
      name: 'What is compound interest?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Compound interest is interest calculated on the initial principal and on previously accumulated interest.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the compound interest formula?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A common compound interest formula is A = P x (1 + r/n)^(n x t).',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you calculate compound interest?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You calculate compound interest by applying the compound interest formula using your principal, rate, compounding frequency, and time.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between simple and compound interest?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Simple interest is calculated only on the principal, while compound interest is calculated on principal plus accumulated interest.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does compounding monthly increase returns?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Monthly compounding generally produces a higher ending balance than annual compounding at the same nominal rate.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does compounding frequency mean?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Compounding frequency is how often interest is added to the balance each year.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use this as a savings compound interest calculator?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You can estimate savings growth using an initial balance, interest rate, time, and optional contributions.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do contributions affect compound interest?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Contributions increase the balance and can also earn interest, raising the final amount over time.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if the interest rate is 0%?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'If the interest rate is 0%, the ending balance equals the principal plus any contributions.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is compound interest useful for investing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Compound interest helps estimate long-term growth for investments, savings, and retirement planning.',
      },
    },
  ],
};

const metadata = {
  title: 'Compound Interest Calculator – CalcHowMuch',
  description:
    'Calculate compound interest to estimate your ending balance, total interest earned, and growth over time. Supports monthly, daily, and contributions.',
  canonical: 'https://calchowmuch.com/finance/compound-interest/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Compound Interest Calculator',
        url: 'https://calchowmuch.com/finance/compound-interest/',
        description:
          'Calculate compound interest to estimate your ending balance, total interest earned, and growth over time.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Compound Interest Calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/finance/compound-interest/',
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
            name: 'Compound Interest',
            item: 'https://calchowmuch.com/finance/compound-interest/',
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

function updateExplanation({ principal, rate, frequency, time, endingBalance, totalInterest, totalContributions }) {
  if (!valueTargets) {
    return;
  }
  updateTargets(valueTargets.principal, principal);
  updateTargets(valueTargets.rate, rate);
  updateTargets(valueTargets.frequency, frequency);
  updateTargets(valueTargets.time, time);
  updateTargets(valueTargets.endingBalance, endingBalance);
  updateTargets(valueTargets.totalInterest, totalInterest);
  updateTargets(valueTargets.totalContributions, totalContributions);
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
    frequency: 'N/A',
    time: 'N/A',
    endingBalance: 'N/A',
    totalInterest: 'N/A',
    totalContributions: 'N/A',
  });
}

function calculate() {
  const principal = Number.parseFloat(principalInput?.value ?? '');
  const annualRate = Number.parseFloat(rateInput?.value ?? '');
  const timePeriod = Number.parseFloat(timeInput?.value ?? '');
  const contribution = Number.parseFloat(contributionInput?.value ?? '0');
  const periodType = periodTypeButtons?.getValue() ?? 'years';
  const compounding = compoundingButtons?.getValue() ?? 'monthly';

  if (!Number.isFinite(principal)) {
    showError('Enter a valid principal amount.');
    return;
  }

  if (principal < 0) {
    showError('Principal must be zero or greater.');
    return;
  }

  if (!Number.isFinite(annualRate)) {
    showError('Enter a valid annual interest rate.');
    return;
  }

  if (annualRate < 0) {
    showError('Interest rate must be zero or greater.');
    return;
  }

  if (!Number.isFinite(timePeriod) || timePeriod < 0) {
    showError('Enter a valid time period.');
    return;
  }

  if (!Number.isFinite(contribution) || contribution < 0) {
    showError('Contribution must be zero or greater.');
    return;
  }

  const result = calculateCompoundInterest({
    principal,
    annualRate,
    timePeriod,
    periodType,
    compounding,
    contribution,
  });

  if (!result) {
    showError('Check your values and try again.');
    return;
  }

  hasCalculated = true;

  const periodLabel = periodType === 'months' ? 'months' : 'years';
  const timeDisplay = `${timePeriod} ${periodLabel}`;

  if (resultOutput) {
    resultOutput.textContent = `Ending Balance: ${formatCurrency(result.endingBalance)}`;
  }

  if (resultDetail) {
    resultDetail.innerHTML =
      `<p><strong>Total Interest Earned:</strong> ${formatCurrency(result.totalInterestEarned)}</p>` +
      `<p><strong>Total Contributions:</strong> ${formatCurrency(result.totalContributions)}</p>` +
      `<p><strong>Compounding:</strong> ${result.compoundingLabel}</p>`;
  }

  updateExplanation({
    principal: formatCurrency(principal),
    rate: formatPercent(annualRate),
    frequency: result.compoundingLabel,
    time: timeDisplay,
    endingBalance: formatCurrency(result.endingBalance),
    totalInterest: formatCurrency(result.totalInterestEarned),
    totalContributions: formatCurrency(result.totalContributions),
  });
}

if (calculateButton) {
  calculateButton.addEventListener('click', calculate);
}

[principalInput, rateInput, timeInput, contributionInput].forEach((input) => {
  if (input) {
    input.addEventListener('input', () => {
      if (liveUpdatesEnabled && hasCalculated) {
        calculate();
      }
    });
  }
});

if (principalInput) {
  calculate();
}
