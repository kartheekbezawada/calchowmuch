import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import { formatNumber } from '/assets/js/core/format.js';
import {
  calculateFutureValueOfAnnuity,
  resolveCompounding,
} from '/assets/js/core/time-value-utils.js';

const paymentInput = document.querySelector('#fva-payment');
const interestRateInput = document.querySelector('#fva-interest-rate');
const periodsInput = document.querySelector('#fva-periods');
const calculateButton = document.querySelector('#fva-calc');
const resultOutput = document.querySelector('#fva-result');
const resultDetail = document.querySelector('#fva-result-detail');
const optionalToggle = document.querySelector('#fva-optional-toggle');
const optionalSection = document.querySelector('#fva-optional-section');

const periodGroup = document.querySelector('[data-button-group="fva-period-type"]');
const annuityGroup = document.querySelector('[data-button-group="fva-annuity-type"]');
const compoundingGroup = document.querySelector('[data-button-group="fva-compounding"]');

const explanationRoot = document.querySelector('#fva-explanation');
const valueTargets = explanationRoot
  ? {
      paymentAmount: explanationRoot.querySelectorAll('[data-fva="payment-amount"]'),
      interestRate: explanationRoot.querySelectorAll('[data-fva="interest-rate"]'),
      periodCount: explanationRoot.querySelectorAll('[data-fva="period-count"]'),
      annuityType: explanationRoot.querySelectorAll('[data-fva="annuity-type"]'),
      futureValue: explanationRoot.querySelectorAll('[data-fva="future-value"]'),
      totalPayments: explanationRoot.querySelectorAll('[data-fva="total-payments"]'),
      totalInterest: explanationRoot.querySelectorAll('[data-fva="total-interest"]'),
      effectivePeriods: explanationRoot.querySelectorAll('[data-fva="effective-periods"]'),
      appliedRate: explanationRoot.querySelectorAll('[data-fva="applied-rate"]'),
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
      name: 'What is the future value of an annuity?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The future value of an annuity is the total value of a series of regular payments at a future date after earning interest over time.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between an ordinary annuity and an annuity due?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'In an ordinary annuity, payments are made at the end of each period, while in an annuity due, payments are made at the beginning of each period.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why is the future value of an annuity due higher?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'An annuity due has a higher future value because payments are invested earlier and earn interest for a longer time.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you calculate the future value of an ordinary annuity?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The future value of an ordinary annuity is calculated by compounding each payment made at the end of each period using the interest rate.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you calculate the future value of an annuity due?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The future value of an annuity due is calculated by adjusting the ordinary annuity future value to account for payments made at the beginning of each period.',
      },
    },
    {
      '@type': 'Question',
      name: 'What interest rate should be used in future value calculations?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The interest rate should reflect expected investment returns, savings rates, or long-term growth assumptions.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is the future value of annuity useful for retirement planning?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, it is commonly used to estimate how regular retirement contributions will grow over time.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can this calculator be used for monthly contributions?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, the calculator supports monthly, quarterly, and annual contribution periods.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if the interest rate is zero?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'If the interest rate is zero, the future value of the annuity equals the total amount of all contributions.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is future value of annuity used for investment planning?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, it is widely used to evaluate savings plans, investment strategies, and long-term financial goals.',
      },
    },
  ],
};

const metadata = {
  title: 'Future Value of Annuity Calculator (Ordinary & Due) – CalcHowMuch',
  description:
    'Calculate the future value of an annuity. Compare ordinary annuity vs annuity due using payment amount, interest rate, and periods.',
  canonical: 'https://calchowmuch.com/finance/future-value-of-annuity/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Future Value of Annuity Calculator',
        url: 'https://calchowmuch.com/finance/future-value-of-annuity/',
        description:
          'Calculate the future value of an annuity. Compare ordinary annuity and annuity due using payment amount, interest rate, and number of periods.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Future Value of Annuity Calculator',
        applicationCategory: 'FinanceApplication',
        applicationSubCategory: 'Time Value of Money Calculator',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/finance/future-value-of-annuity/',
        description:
          'Free future value of annuity calculator for ordinary annuity and annuity due. Calculates FV using payment amount, rate, and timing.',
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
            name: 'Future Value of Annuity',
            item: 'https://calchowmuch.com/finance/future-value-of-annuity/',
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
    if (hasCalculated) {
      calculate();
    }
  },
});

const annuityButtons = setupButtonGroup(annuityGroup, {
  defaultValue: 'ordinary',
  onChange: () => {
    if (hasCalculated) {
      calculate();
    }
  },
});

const compoundingButtons = setupButtonGroup(compoundingGroup, {
  defaultValue: '',
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
  paymentAmount,
  interestRate,
  periodCount,
  annuityType,
  futureValue,
  totalPayments,
  totalInterest,
  effectivePeriods,
  appliedRate,
}) {
  if (!valueTargets) {
    return;
  }

  updateTargets(valueTargets.paymentAmount, paymentAmount);
  updateTargets(valueTargets.interestRate, interestRate);
  updateTargets(valueTargets.periodCount, periodCount);
  updateTargets(valueTargets.annuityType, annuityType);
  updateTargets(valueTargets.futureValue, futureValue);
  updateTargets(valueTargets.totalPayments, totalPayments);
  updateTargets(valueTargets.totalInterest, totalInterest);
  updateTargets(valueTargets.effectivePeriods, effectivePeriods);
  updateTargets(valueTargets.appliedRate, appliedRate);
}

function showError(message) {
  if (resultOutput) {
    resultOutput.textContent = message;
  }
  if (resultDetail) {
    resultDetail.textContent = '';
  }
  updateExplanation({
    paymentAmount: 'N/A',
    interestRate: 'N/A',
    periodCount: 'N/A',
    annuityType: 'N/A',
    futureValue: 'N/A',
    totalPayments: 'N/A',
    totalInterest: 'N/A',
    effectivePeriods: 'N/A',
    appliedRate: 'N/A',
  });
}

function calculate() {
  const payment = readInputValue(paymentInput);
  const rate = readInputValue(interestRateInput);
  const periods = readInputValue(periodsInput);
  const periodType = periodButtons?.getValue() ?? 'years';
  const annuityType = annuityButtons?.getValue() ?? 'ordinary';
  const compoundingValue = compoundingButtons?.getValue() ?? '';
  const compounding = compoundingValue ? compoundingValue : null;
  const compoundingInfo = compounding ? resolveCompounding(compounding) : null;

  if (!Number.isFinite(payment) || !Number.isFinite(rate) || !Number.isFinite(periods)) {
    showError('Enter valid numbers for payment amount, interest rate, and periods.');
    return;
  }

  if (payment < 0 || rate < 0 || periods < 0) {
    showError('Values must be zero or greater.');
    return;
  }

  const result = calculateFutureValueOfAnnuity({
    payment,
    interestRate: rate,
    periods,
    periodType,
    compounding,
    annuityType,
  });

  if (!result) {
    showError('Check your inputs. Interest rate must be above -100%.');
    return;
  }

  hasCalculated = true;

  const paymentDisplay = formatCurrencyValue(payment);
  const interestRateDisplay = formatPercentValue(rate, 2);
  const periodDisplay = `${formatNumber(periods, { maximumFractionDigits: 2 })} ${
    periodType === 'months' ? 'months' : 'years'
  }`;
  const annuityTypeDisplay = annuityType === 'due' ? 'Annuity Due' : 'Ordinary Annuity';
  const compoundingDisplay = compoundingInfo
    ? compoundingInfo.label
    : periodType === 'months'
      ? 'Per month'
      : 'Per year';
  const futureValueDisplay = formatCurrencyValue(result.futureValue);
  const totalPaymentsDisplay = formatCurrencyValue(result.totalPayments);
  const totalInterestDisplay = formatCurrencyValue(result.totalInterest);
  const effectivePeriodsDisplay = formatNumber(result.totalPeriods, { maximumFractionDigits: 2 });
  const appliedRateDisplay = formatNumber(result.periodicRate * 100, { maximumFractionDigits: 4 });

  if (resultOutput) {
    resultOutput.textContent = `Future Value of Annuity: ${futureValueDisplay}`;
  }

  if (resultDetail) {
    resultDetail.innerHTML =
      `<p><strong>Annuity type:</strong> ${annuityTypeDisplay}</p>` +
      `<p><strong>Total payments:</strong> ${totalPaymentsDisplay}</p>` +
      `<p><strong>Total interest earned:</strong> ${totalInterestDisplay}</p>` +
      `<p><strong>Effective periods:</strong> ${effectivePeriodsDisplay}</p>` +
      `<p><strong>Applied rate per period:</strong> ${appliedRateDisplay}%</p>` +
      `<p><strong>Compounding frequency:</strong> ${compoundingDisplay}</p>`;
  }

  updateExplanation({
    paymentAmount: paymentDisplay,
    interestRate: interestRateDisplay,
    periodCount: periodDisplay,
    annuityType: annuityTypeDisplay,
    futureValue: futureValueDisplay,
    totalPayments: totalPaymentsDisplay,
    totalInterest: totalInterestDisplay,
    effectivePeriods: effectivePeriodsDisplay,
    appliedRate: appliedRateDisplay,
  });
}

if (calculateButton) {
  calculateButton.addEventListener('click', calculate);
}

[paymentInput, interestRateInput, periodsInput].forEach((input) => {
  if (!input) {
    return;
  }
  input.addEventListener('input', () => {
    if (hasCalculated) {
      calculate();
    }
  });
});

if (paymentInput && interestRateInput && periodsInput) {
  calculate();
}
