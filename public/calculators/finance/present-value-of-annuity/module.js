import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import { formatNumber } from '/assets/js/core/format.js';
import {
  calculatePresentValueOfAnnuity,
  resolveCompounding,
} from '/assets/js/core/time-value-utils.js';

const paymentInput = document.querySelector('#pva-payment');
const discountRateInput = document.querySelector('#pva-discount-rate');
const periodsInput = document.querySelector('#pva-periods');
const calculateButton = document.querySelector('#pva-calc');
const resultOutput = document.querySelector('#pva-result');
const resultDetail = document.querySelector('#pva-result-detail');
const optionalToggle = document.querySelector('#pva-optional-toggle');
const optionalSection = document.querySelector('#pva-optional-section');

const periodGroup = document.querySelector('[data-button-group="pva-period-type"]');
const annuityGroup = document.querySelector('[data-button-group="pva-annuity-type"]');
const compoundingGroup = document.querySelector('[data-button-group="pva-compounding"]');

const explanationRoot = document.querySelector('#pva-explanation');
const valueTargets = explanationRoot
  ? {
      paymentAmount: explanationRoot.querySelectorAll('[data-pva="payment-amount"]'),
      discountRate: explanationRoot.querySelectorAll('[data-pva="discount-rate"]'),
      periodCount: explanationRoot.querySelectorAll('[data-pva="period-count"]'),
      annuityType: explanationRoot.querySelectorAll('[data-pva="annuity-type"]'),
      presentValue: explanationRoot.querySelectorAll('[data-pva="present-value"]'),
      totalPayments: explanationRoot.querySelectorAll('[data-pva="total-payments"]'),
      effectivePeriods: explanationRoot.querySelectorAll('[data-pva="effective-periods"]'),
      appliedRate: explanationRoot.querySelectorAll('[data-pva="applied-rate"]'),
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
      name: 'What is the present value of an annuity?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The present value of an annuity (PV of annuity) is the value today of a series of regular future payments, discounted using a specific interest or discount rate.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between an ordinary annuity and an annuity due?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'In an ordinary annuity, payments occur at the end of each period, while in an annuity due, payments occur at the beginning of each period, and this annuity due calculator compares both.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why is the present value of an annuity due higher than an ordinary annuity?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'An annuity due has a higher present value because payments are received earlier and are discounted for fewer periods.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you calculate the present value of an ordinary annuity?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The present value of ordinary annuity is calculated by discounting each payment made at the end of each period back to today; the PV ordinary annuity calculator applies that discount each period.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you calculate the present value of an annuity due?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The present value of annuity due is calculated by adjusting the ordinary annuity present value to account for payments made at the beginning of each period.',
      },
    },
    {
      '@type': 'Question',
      name: 'What discount rate should be used for annuity calculations?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The discount rate should reflect interest rates, investment returns, inflation expectations, or borrowing costs relevant to the cash flow.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is the present value of annuity used for loans and mortgages?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, present value of annuity calculations are commonly used to value loan repayments, mortgages, and lease payments.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can this calculator be used for monthly annuity payments?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, the calculator supports monthly, quarterly, and annual payment periods depending on the selected settings, so you can estimate PV of annuity with monthly payments.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if the discount rate is zero?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'If the discount rate is zero, the present value of the annuity equals the total amount of all payments.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is the present value of annuity useful for retirement planning?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, it is widely used to estimate the value of pensions, retirement income streams, and long-term annuity payments.',
      },
    },
  ],
};

const metadata = {
  title: 'Present Value of Annuity Calculator Ordinary & Due – CalcHowMuch',
  description:
    'Calculate the present value of an annuity. Compare ordinary annuity vs annuity due using payment amount, rate, and periods with our free calculator.',
  canonical: 'https://calchowmuch.com/finance/present-value-of-annuity/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Present Value of Annuity Calculator',
        url: 'https://calchowmuch.com/finance/present-value-of-annuity/',
        description:
          'Calculate the present value of an annuity. Compare ordinary annuity and annuity due using payment amount, discount rate, and number of periods.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Present Value of Annuity Calculator',
        applicationCategory: 'FinanceApplication',
        applicationSubCategory: 'Time Value of Money Calculator',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/finance/present-value-of-annuity/',
        description:
          'Free present value of annuity calculator for ordinary annuity and annuity due. Calculates PV using payment amount, rate, and timing.',
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
            name: 'Present Value of Annuity',
            item: 'https://calchowmuch.com/finance/present-value-of-annuity/',
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

const annuityButtons = setupButtonGroup(annuityGroup, {
  defaultValue: 'ordinary',
  onChange: () => {
    if (liveUpdatesEnabled && hasCalculated) {
      calculate();
    }
  },
});

const compoundingButtons = setupButtonGroup(compoundingGroup, {
  defaultValue: '',
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
  paymentAmount,
  discountRate,
  periodCount,
  annuityType,
  presentValue,
  totalPayments,
  effectivePeriods,
  appliedRate,
}) {
  if (!valueTargets) {
    return;
  }

  updateTargets(valueTargets.paymentAmount, paymentAmount);
  updateTargets(valueTargets.discountRate, discountRate);
  updateTargets(valueTargets.periodCount, periodCount);
  updateTargets(valueTargets.annuityType, annuityType);
  updateTargets(valueTargets.presentValue, presentValue);
  updateTargets(valueTargets.totalPayments, totalPayments);
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
    discountRate: 'N/A',
    periodCount: 'N/A',
    annuityType: 'N/A',
    presentValue: 'N/A',
    totalPayments: 'N/A',
    effectivePeriods: 'N/A',
    appliedRate: 'N/A',
  });
}

function calculate() {
  const payment = readInputValue(paymentInput);
  const rate = readInputValue(discountRateInput);
  const periods = readInputValue(periodsInput);
  const periodType = periodButtons?.getValue() ?? 'years';
  const annuityType = annuityButtons?.getValue() ?? 'ordinary';
  const compoundingValue = compoundingButtons?.getValue() ?? '';
  const compounding = compoundingValue ? compoundingValue : null;
  const compoundingInfo = compounding ? resolveCompounding(compounding) : null;

  if (!Number.isFinite(payment) || !Number.isFinite(rate) || !Number.isFinite(periods)) {
    showError('Enter valid numbers for payment amount, discount rate, and periods.');
    return;
  }

  if (payment < 0 || rate < 0 || periods < 0) {
    showError('Values must be zero or greater.');
    return;
  }

  const result = calculatePresentValueOfAnnuity({
    payment,
    discountRate: rate,
    periods,
    periodType,
    compounding,
    annuityType,
  });

  if (!result) {
    showError('Check your inputs. Discount rate must be above -100%.');
    return;
  }

  hasCalculated = true;

  const paymentDisplay = formatCurrencyValue(payment);
  const discountRateDisplay = formatPercentValue(rate, 2);
  const periodDisplay = `${formatNumber(periods, { maximumFractionDigits: 2 })} ${
    periodType === 'months' ? 'months' : 'years'
  }`;
  const annuityTypeDisplay = annuityType === 'due' ? 'Annuity Due' : 'Ordinary Annuity';
  const compoundingDisplay = compoundingInfo
    ? compoundingInfo.label
    : periodType === 'months'
      ? 'Per month'
      : 'Per year';
  const presentValueDisplay = formatCurrencyValue(result.presentValue);
  const totalPaymentsDisplay = formatCurrencyValue(result.totalPayments);
  const effectivePeriodsDisplay = formatNumber(result.totalPeriods, { maximumFractionDigits: 2 });
  const appliedRateDisplay = formatNumber(result.periodicRate * 100, { maximumFractionDigits: 4 });

  if (resultOutput) {
    resultOutput.textContent = `Present Value of Annuity: ${presentValueDisplay}`;
  }

  if (resultDetail) {
    resultDetail.innerHTML =
      `<p><strong>Annuity type:</strong> ${annuityTypeDisplay}</p>` +
      `<p><strong>Total payments:</strong> ${totalPaymentsDisplay}</p>` +
      `<p><strong>Effective periods:</strong> ${effectivePeriodsDisplay}</p>` +
      `<p><strong>Applied rate per period:</strong> ${appliedRateDisplay}%</p>` +
      `<p><strong>Compounding frequency:</strong> ${compoundingDisplay}</p>`;
  }

  updateExplanation({
    paymentAmount: paymentDisplay,
    discountRate: discountRateDisplay,
    periodCount: periodDisplay,
    annuityType: annuityTypeDisplay,
    presentValue: presentValueDisplay,
    totalPayments: totalPaymentsDisplay,
    effectivePeriods: effectivePeriodsDisplay,
    appliedRate: appliedRateDisplay,
  });
}

if (calculateButton) {
  calculateButton.addEventListener('click', calculate);
}

[paymentInput, discountRateInput, periodsInput].forEach((input) => {
  if (!input) {
    return;
  }
  input.addEventListener('input', () => {
    if (liveUpdatesEnabled && hasCalculated) {
      calculate();
    }
  });
});

if (paymentInput && discountRateInput && periodsInput) {
  calculate();
}
