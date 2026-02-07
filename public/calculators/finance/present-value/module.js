import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import { formatNumber } from '/assets/js/core/format.js';
import { calculatePresentValue, resolveCompounding } from '/assets/js/core/time-value-utils.js';

const futureValueInput = document.querySelector('#pv-future-value');
const discountRateInput = document.querySelector('#pv-discount-rate');
const timePeriodInput = document.querySelector('#pv-time-period');
const calculateButton = document.querySelector('#pv-calc');
const resultOutput = document.querySelector('#pv-result');
const resultDetail = document.querySelector('#pv-result-detail');
const optionalToggle = document.querySelector('#pv-optional-toggle');
const optionalSection = document.querySelector('#pv-optional-section');

const periodGroup = document.querySelector('[data-button-group="pv-period-type"]');
const compoundingGroup = document.querySelector('[data-button-group="pv-compounding"]');

const explanationRoot = document.querySelector('#pv-explanation');
const valueTargets = explanationRoot
  ? {
      futureValue: explanationRoot.querySelectorAll('[data-pv="future-value"]'),
      discountRate: explanationRoot.querySelectorAll('[data-pv="discount-rate"]'),
      timePeriod: explanationRoot.querySelectorAll('[data-pv="time-period"]'),
      compoundingFrequency: explanationRoot.querySelectorAll('[data-pv="compounding-frequency"]'),
      presentValue: explanationRoot.querySelectorAll('[data-pv="present-value"]'),
      effectivePeriods: explanationRoot.querySelectorAll('[data-pv="effective-periods"]'),
      appliedRate: explanationRoot.querySelectorAll('[data-pv="applied-rate"]'),
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
      name: 'What is present value (PV)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Present value is the current worth of a future amount of money after accounting for the time value of money.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why is present value lower than future value?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Because money today can earn returns, a future amount is discounted to reflect lost earning potential.',
      },
    },
    {
      '@type': 'Question',
      name: 'What discount rate should I use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use a rate that reflects inflation, investment returns, or the opportunity cost relevant to your decision.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the time period affect present value?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Longer time periods increase discounting, which lowers the present value of a future amount.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is compounding frequency?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Compounding frequency defines how often the discount rate is applied, such as annually, quarterly, or monthly.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is present value used in investment decisions?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, present value is widely used to evaluate investments, loans, pensions, and future cash flows.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can present value be higher than future value?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, with a positive discount rate, present value will always be lower than future value.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does inflation affect present value?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, higher inflation increases discounting and reduces present value.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if the discount rate is zero?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'If the discount rate is zero, the present value equals the future value because no discounting is applied.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this calculator suitable for loans and savings?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, the present value calculator can be used for loans, savings goals, investments, and any future cash amount.',
      },
    },
  ],
};

const metadata = {
  title: 'Present Value (PV) Calculator – CalcHowMuch',
  description:
    'Calculate the present value of future money using discount rate and time period. Simple, accurate PV calculator.',
  canonical: 'https://calchowmuch.com/finance/present-value/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Present Value (PV) Calculator',
        url: 'https://calchowmuch.com/finance/present-value/',
        description: 'Estimate the present value of future money using discount rate and time period.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Present Value (PV) Calculator',
        applicationCategory: 'FinanceApplication',
        applicationSubCategory: 'Time Value of Money Calculator',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/finance/present-value/',
        description:
          'Calculate the present value of a future amount using discount rate, time period, and compounding frequency.',
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
            name: 'Present Value (PV)',
            item: 'https://calchowmuch.com/finance/present-value/',
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

const compoundingButtons = setupButtonGroup(compoundingGroup, {
  defaultValue: 'annual',
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
  futureValue,
  discountRate,
  timePeriod,
  compoundingFrequency,
  presentValue,
  effectivePeriods,
  appliedRate,
}) {
  if (!valueTargets) {
    return;
  }

  updateTargets(valueTargets.futureValue, futureValue);
  updateTargets(valueTargets.discountRate, discountRate);
  updateTargets(valueTargets.timePeriod, timePeriod);
  updateTargets(valueTargets.compoundingFrequency, compoundingFrequency);
  updateTargets(valueTargets.presentValue, presentValue);
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
    futureValue: '—',
    discountRate: '—',
    timePeriod: '—',
    compoundingFrequency: '—',
    presentValue: '—',
    effectivePeriods: '—',
    appliedRate: '—',
  });
}

function calculate() {
  const fv = readInputValue(futureValueInput);
  const rate = readInputValue(discountRateInput);
  const period = readInputValue(timePeriodInput);
  const periodType = periodButtons?.getValue() ?? 'years';
  const compounding = compoundingButtons?.getValue() ?? 'annual';
  const compoundingInfo = resolveCompounding(compounding);

  if (!Number.isFinite(fv) || !Number.isFinite(rate) || !Number.isFinite(period)) {
    showError('Enter valid numbers for future value, discount rate, and time period.');
    return;
  }

  if (fv < 0 || rate < 0 || period < 0) {
    showError('Values must be zero or greater.');
    return;
  }

  const result = calculatePresentValue({
    futureValue: fv,
    discountRate: rate,
    timePeriod: period,
    periodType,
    compounding,
  });

  if (!result) {
    showError('Check your inputs. Discount rate must be above -100%.');
    return;
  }

  hasCalculated = true;

  const appliedRatePercent = result.periodicRate * 100;
  const totalPeriodsDisplay = formatNumber(result.totalPeriods, { maximumFractionDigits: 2 });
  const futureValueDisplay = formatCurrencyValue(fv);
  const discountRateDisplay = formatPercentValue(rate, 2);
  const timePeriodDisplay = `${formatNumber(period, { maximumFractionDigits: 2 })} ${
    periodType === 'months' ? 'months' : 'years'
  }`;
  const compoundingDisplay = compoundingInfo.label;
  const presentValueDisplay = formatCurrencyValue(result.presentValue);
  const appliedRateDisplay = formatNumber(appliedRatePercent, { maximumFractionDigits: 4 });

  if (resultOutput) {
    resultOutput.textContent = `Present Value: ${presentValueDisplay}`;
  }

  if (resultDetail) {
    resultDetail.innerHTML =
      `<p><strong>Effective periods:</strong> ${totalPeriodsDisplay}</p>` +
      `<p><strong>Applied rate per period:</strong> ${appliedRateDisplay}%</p>` +
      `<p><strong>Compounding frequency:</strong> ${compoundingDisplay}</p>`;
  }

  updateExplanation({
    futureValue: futureValueDisplay,
    discountRate: discountRateDisplay,
    timePeriod: timePeriodDisplay,
    compoundingFrequency: compoundingDisplay,
    presentValue: presentValueDisplay,
    effectivePeriods: totalPeriodsDisplay,
    appliedRate: formatNumber(appliedRatePercent, { maximumFractionDigits: 4 }),
  });
}

if (calculateButton) {
  calculateButton.addEventListener('click', calculate);
}

[futureValueInput, discountRateInput, timePeriodInput].forEach((input) => {
  if (!input) {
    return;
  }
  input.addEventListener('input', () => {
    if (hasCalculated) {
      calculate();
    }
  });
});

if (futureValueInput && discountRateInput && timePeriodInput) {
  calculate();
}
