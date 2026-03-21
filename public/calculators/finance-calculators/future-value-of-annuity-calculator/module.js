import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import {
  calculateFutureValueOfAnnuity,
  resolveCompounding,
} from '/assets/js/core/time-value-utils.js';
import {
  createStaleResultController,
  revealResultPanel,
  updateRangeFill,
  wireRangeWithField,
} from '/calculators/finance-calculators/shared/cluster-ux.js';

const paymentInput = document.querySelector('#fva-payment');
const rateInput = document.querySelector('#fva-interest-rate');
const periodsInput = document.querySelector('#fva-periods');

const paymentField = document.querySelector('#fva-payment-field');
const rateField = document.querySelector('#fva-interest-rate-field');
const periodsField = document.querySelector('#fva-periods-field');

const calculateButton = document.querySelector('#fva-calc');
const previewPanel = document.querySelector('#fva-preview');
const staleNote = document.querySelector('#fva-stale-note');
const resultDiv = document.querySelector('#fva-result');

const paymentDisplay = document.querySelector('#fva-pmt-display');
const rateDisplay = document.querySelector('#fva-rate-display');
const periodsDisplay = document.querySelector('#fva-periods-display');

const snapPayment = document.querySelector('[data-fva="snap-payment"]');
const snapRate = document.querySelector('[data-fva="snap-rate"]');
const snapPeriods = document.querySelector('[data-fva="snap-periods"]');
const snapAnnuityType = document.querySelector('[data-fva="snap-annuity-type"]');
const snapCompounding = document.querySelector('[data-fva="snap-compounding"]');
const snapEffectivePeriods = document.querySelector('[data-fva="snap-effective-periods"]');
const snapPeriodicRate = document.querySelector('[data-fva="snap-periodic-rate"]');

const metricAnnuityType = document.querySelector('[data-fva="metric-annuity-type"]');
const metricTotalPayments = document.querySelector('[data-fva="metric-total-payments"]');
const metricEffectivePeriods = document.querySelector('[data-fva="metric-effective-periods"]');
const metricTotalInterest = document.querySelector('[data-fva="metric-total-interest"]');

const explanationRoot = document.querySelector('#fva-explanation');
const valueTargets = explanationRoot
  ? {
      paymentAmount: explanationRoot.querySelectorAll('[data-fva="payment-amount"]'),
      interestRate: explanationRoot.querySelectorAll('[data-fva="interest-rate"]'),
      periodCount: explanationRoot.querySelectorAll('[data-fva="period-count"]'),
      annuityType: explanationRoot.querySelectorAll('[data-fva="annuity-type"]'),
      compoundingFrequency: explanationRoot.querySelectorAll('[data-fva="compounding-frequency"]'),
      futureValue: explanationRoot.querySelectorAll('[data-fva="future-value"]'),
      totalPayments: explanationRoot.querySelectorAll('[data-fva="total-payments"]'),
      totalInterest: explanationRoot.querySelectorAll('[data-fva="total-interest"]'),
      effectivePeriods: explanationRoot.querySelectorAll('[data-fva="effective-periods"]'),
      appliedRate: explanationRoot.querySelectorAll('[data-fva="applied-rate"]'),
      appliedRateDecimal: explanationRoot.querySelectorAll('[data-fva="applied-rate-decimal"]'),
      formulaAnnuityFactor: explanationRoot.querySelectorAll('[data-fva="formula-annuity-factor"]'),
      periodsPerYear: explanationRoot.querySelectorAll('[data-fva="periods-per-year"]'),
    }
  : null;

const periodGroup = document.querySelector('[data-button-group="fva-period-type"]');
const annuityGroup = document.querySelector('[data-button-group="fva-annuity-type"]');
const compoundingGroup = document.querySelector('[data-button-group="fva-compounding"]');

const periodButtons = setupButtonGroup(periodGroup, {
  defaultValue: 'years',
  onChange: () => {
    updateSliderDisplays();
    staleController.sync();
  },
});

const annuityButtons = setupButtonGroup(annuityGroup, {
  defaultValue: 'ordinary',
  onChange: () => {
    staleController.sync();
  },
});

const compoundingButtons = setupButtonGroup(compoundingGroup, {
  defaultValue: 'annual',
  onChange: () => {
    staleController.sync();
  },
});

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
        text: 'It is the total accumulated value of a series of regular payments at a future date after earning compound interest over time.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between ordinary annuity and annuity due?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ordinary annuities pay at the end of each period. Annuity due pays at the beginning, resulting in a higher future value because payments compound longer.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why is the FV of annuity due higher?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Because each payment is invested one period earlier, it earns compound interest for a longer time than an ordinary annuity.',
      },
    },
    {
      '@type': 'Question',
      name: 'What interest rate should I use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use a rate reflecting expected investment returns, savings rates, or long-term growth assumptions relevant to your financial plan.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is the future value of annuity useful for retirement planning?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, it is commonly used to estimate how regular 401(k), IRA, or pension contributions will grow over your working years.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use this for monthly contributions?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, the calculator supports monthly, quarterly, semi-annual, and annual payment and compounding periods.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if the interest rate is zero?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'If the rate is zero, the future value equals the total of all payments because no interest is earned and the annuity factor equals the number of periods.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does compounding frequency affect results?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'More frequent compounding (e.g. monthly vs annual) increases the future value because interest is reinvested more often within each year.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this the same as a simple savings calculator?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It is similar but specifically models equal periodic payments. A savings calculator may include an initial lump sum as well.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use FVA for investment planning?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, it is widely used to evaluate savings plans, SIP investments, education funds, and long-term financial goals.',
      },
    },
  ],
};

setPageMetadata({
  title: 'Future Value of Annuity Calculator | Ordinary or Due',
  description:
    'Estimate the future value of an annuity using payment amount, growth rate, periods, and annuity timing.',
  canonical: 'https://calchowmuch.com/finance-calculators/future-value-of-annuity-calculator/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Future Value of Annuity Calculator | Ordinary or Due',
        url: 'https://calchowmuch.com/finance-calculators/future-value-of-annuity-calculator/',
        description:
          'Estimate the future value of an annuity using payment amount, growth rate, periods, and annuity timing.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Future Value of Annuity Calculator',
        applicationCategory: 'FinanceApplication',
        applicationSubCategory: 'Time Value of Money Calculator',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/finance-calculators/future-value-of-annuity-calculator/',
        description:
          'Free future value of annuity calculator for ordinary annuity and annuity due. Calculates future value using payment amount, rate, and timing.',
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
            name: 'Future Value of Annuity',
            item: 'https://calchowmuch.com/finance-calculators/future-value-of-annuity-calculator/',
          },
        ],
      },
    ],
  },
});

function fmt(value, options = {}) {
  return formatNumber(value, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  });
}

function parseLooseNumber(value) {
  const parsed = Number(String(value).replace(/,/g, '').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : NaN;
}

function formatFieldValue(value, fractionDigits = 0) {
  return formatNumber(value, {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
    useGrouping: false,
  });
}

function setText(node, value) {
  if (node && node.textContent !== value) {
    node.textContent = value;
  }
}

function updateTargets(targets, value) {
  targets?.forEach((node) => setText(node, value));
}

function buildStateSignature() {
  return JSON.stringify({
    payment: paymentInput?.value ?? '',
    interestRate: rateInput?.value ?? '',
    periods: periodsInput?.value ?? '',
    periodType: periodButtons?.getValue() ?? 'years',
    annuityType: annuityButtons?.getValue() ?? 'ordinary',
    compounding: compoundingButtons?.getValue() ?? 'annual',
  });
}

const staleController = createStaleResultController({
  resultPanel: previewPanel,
  staleTargets: [staleNote],
  getSignature: buildStateSignature,
});

function updateSliderDisplays() {
  const periodType = periodButtons?.getValue() ?? 'years';

  updateRangeFill(paymentInput);
  updateRangeFill(rateInput);
  updateRangeFill(periodsInput);

  setText(paymentDisplay, fmt(Number(paymentInput?.value), { maximumFractionDigits: 0 }));
  setText(rateDisplay, formatPercent(Number(rateInput?.value)));
  setText(
    periodsDisplay,
    `${fmt(Number(periodsInput?.value), { maximumFractionDigits: 0 })} ${
      periodType === 'months' ? 'mo' : 'yrs'
    }`
  );
}

wireRangeWithField({
  rangeInput: paymentInput,
  textInput: paymentField,
  formatFieldValue: (value) => formatFieldValue(value, 0),
  parseFieldValue: parseLooseNumber,
  onVisualUpdate: () => {
    updateSliderDisplays();
    staleController.sync();
  },
});

wireRangeWithField({
  rangeInput: rateInput,
  textInput: rateField,
  formatFieldValue: (value) => formatFieldValue(value, 1),
  parseFieldValue: parseLooseNumber,
  onVisualUpdate: () => {
    updateSliderDisplays();
    staleController.sync();
  },
});

wireRangeWithField({
  rangeInput: periodsInput,
  textInput: periodsField,
  formatFieldValue: (value) => formatFieldValue(value, 0),
  parseFieldValue: parseLooseNumber,
  onVisualUpdate: () => {
    updateSliderDisplays();
    staleController.sync();
  },
});

staleController.watchElements([periodGroup, annuityGroup, compoundingGroup], ['click']);

function setError(message) {
  if (resultDiv) {
    resultDiv.textContent = message;
  }
  setText(metricAnnuityType, 'Check inputs');
  setText(metricTotalPayments, '0');
  setText(metricEffectivePeriods, '0');
  setText(metricTotalInterest, '0');
  staleController.markFresh();
}

function calculate({ reveal = false } = {}) {
  if (!resultDiv) {
    return;
  }

  const payment = Number(paymentInput?.value);
  const interestRate = Number(rateInput?.value);
  const periods = Number(periodsInput?.value);
  const periodType = periodButtons?.getValue() ?? 'years';
  const annuityType = annuityButtons?.getValue() ?? 'ordinary';
  const compounding = compoundingButtons?.getValue() ?? 'annual';
  const compoundingInfo = resolveCompounding(compounding);

  if (!Number.isFinite(payment) || payment < 0) {
    setError('Payment must be 0 or more.');
    return;
  }
  if (!Number.isFinite(interestRate) || interestRate < 0) {
    setError('Interest rate must be 0 or more.');
    return;
  }
  if (!Number.isFinite(periods) || periods < 0) {
    setError('Periods must be 0 or more.');
    return;
  }

  const result = calculateFutureValueOfAnnuity({
    payment,
    interestRate,
    periods,
    periodType,
    compounding,
    annuityType,
  });

  if (!result) {
    setError('Check your inputs.');
    return;
  }

  const appliedRatePct = result.periodicRate * 100;
  const appliedRateDecimal = result.periodicRate;
  const annuityTypeStr = annuityType === 'due' ? 'Annuity Due' : 'Ordinary Annuity';

  let annuityFactor = 0;
  if (result.totalPeriods > 0) {
    if (appliedRateDecimal === 0) {
      annuityFactor = result.totalPeriods;
    } else {
      annuityFactor =
        (Math.pow(1 + appliedRateDecimal, result.totalPeriods) - 1) / appliedRateDecimal;
    }
  }
  if (annuityType === 'due') {
    annuityFactor *= 1 + appliedRateDecimal;
  }

  const paymentStr = fmt(payment);
  const interestRateStr = formatPercent(interestRate);
  const periodsStr = `${fmt(periods, { maximumFractionDigits: 2 })} ${
    periodType === 'months' ? 'months' : 'years'
  }`;
  const compoundingStr = compoundingInfo.label;
  const futureValueStr = fmt(result.futureValue);
  const totalPaymentsStr = fmt(result.totalPayments);
  const totalInterestStr = fmt(result.totalInterest);
  const effectivePeriodsStr = fmt(result.totalPeriods, { maximumFractionDigits: 2 });
  const appliedRateStr = fmt(appliedRatePct, { maximumFractionDigits: 4 });
  const annuityFactorStr = fmt(annuityFactor, { maximumFractionDigits: 6 });
  const appliedRateDecimalStr = fmt(appliedRateDecimal, { maximumFractionDigits: 6 });

  resultDiv.innerHTML = `<span class="mtg-result-value is-updated">${futureValueStr}</span>`;
  const valueEl = resultDiv.querySelector('.mtg-result-value');
  if (valueEl) {
    window.setTimeout(() => valueEl.classList.remove('is-updated'), 420);
  }

  setText(metricAnnuityType, annuityType === 'due' ? 'Due' : 'Ordinary');
  setText(metricTotalPayments, totalPaymentsStr);
  setText(metricEffectivePeriods, effectivePeriodsStr);
  setText(metricTotalInterest, totalInterestStr);

  setText(snapPayment, paymentStr);
  setText(snapRate, interestRateStr);
  setText(snapPeriods, periodsStr);
  setText(snapAnnuityType, annuityTypeStr);
  setText(snapCompounding, compoundingStr);
  setText(snapEffectivePeriods, effectivePeriodsStr);
  setText(snapPeriodicRate, `${appliedRateStr}%`);

  updateTargets(valueTargets?.paymentAmount, paymentStr);
  updateTargets(valueTargets?.interestRate, interestRateStr);
  updateTargets(valueTargets?.periodCount, periodsStr);
  updateTargets(valueTargets?.annuityType, annuityTypeStr);
  updateTargets(valueTargets?.compoundingFrequency, compoundingStr);
  updateTargets(valueTargets?.futureValue, futureValueStr);
  updateTargets(valueTargets?.totalPayments, totalPaymentsStr);
  updateTargets(valueTargets?.totalInterest, totalInterestStr);
  updateTargets(valueTargets?.effectivePeriods, effectivePeriodsStr);
  updateTargets(valueTargets?.appliedRate, appliedRateStr);
  updateTargets(valueTargets?.appliedRateDecimal, appliedRateDecimalStr);
  updateTargets(valueTargets?.formulaAnnuityFactor, annuityFactorStr);
  updateTargets(valueTargets?.periodsPerYear, String(result.periodsPerYear));

  staleController.markFresh();

  if (reveal) {
    revealResultPanel({
      resultPanel: previewPanel,
      focusTarget: resultDiv,
    });
  }
}

calculateButton?.addEventListener('click', () => {
  calculate({ reveal: true });
});

updateSliderDisplays();
calculate();
