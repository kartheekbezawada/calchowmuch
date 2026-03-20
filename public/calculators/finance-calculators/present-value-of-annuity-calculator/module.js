import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import {
  calculatePresentValueOfAnnuity,
  resolveCompounding,
} from '/assets/js/core/time-value-utils.js';
import {
  createStaleResultController,
  revealResultPanel,
  updateRangeFill,
  wireRangeWithField,
} from '/calculators/finance-calculators/shared/cluster-ux.js';

const paymentInput = document.querySelector('#pva-payment');
const rateInput = document.querySelector('#pva-discount-rate');
const periodsInput = document.querySelector('#pva-periods');

const paymentField = document.querySelector('#pva-payment-field');
const rateField = document.querySelector('#pva-discount-rate-field');
const periodsField = document.querySelector('#pva-periods-field');

const calculateButton = document.querySelector('#pva-calc');
const previewPanel = document.querySelector('#pva-preview');
const staleNote = document.querySelector('#pva-stale-note');
const resultDiv = document.querySelector('#pva-result');

const paymentDisplay = document.querySelector('#pva-pmt-display');
const rateDisplay = document.querySelector('#pva-rate-display');
const periodsDisplay = document.querySelector('#pva-periods-display');

const snapPayment = document.querySelector('[data-pva="snap-payment"]');
const snapRate = document.querySelector('[data-pva="snap-rate"]');
const snapPeriods = document.querySelector('[data-pva="snap-periods"]');
const snapAnnuityType = document.querySelector('[data-pva="snap-annuity-type"]');
const snapCompounding = document.querySelector('[data-pva="snap-compounding"]');
const snapEffectivePeriods = document.querySelector('[data-pva="snap-effective-periods"]');
const snapPeriodicRate = document.querySelector('[data-pva="snap-periodic-rate"]');

const metricAnnuityType = document.querySelector('[data-pva="metric-annuity-type"]');
const metricTotalPayments = document.querySelector('[data-pva="metric-total-payments"]');
const metricEffectivePeriods = document.querySelector('[data-pva="metric-effective-periods"]');
const metricDiscountSaved = document.querySelector('[data-pva="metric-discount-saved"]');

const explanationRoot = document.querySelector('#pva-explanation');
const valueTargets = explanationRoot
  ? {
      paymentAmount: explanationRoot.querySelectorAll('[data-pva="payment-amount"]'),
      discountRate: explanationRoot.querySelectorAll('[data-pva="discount-rate"]'),
      periodCount: explanationRoot.querySelectorAll('[data-pva="period-count"]'),
      annuityType: explanationRoot.querySelectorAll('[data-pva="annuity-type"]'),
      compoundingFrequency: explanationRoot.querySelectorAll('[data-pva="compounding-frequency"]'),
      presentValue: explanationRoot.querySelectorAll('[data-pva="present-value"]'),
      totalPayments: explanationRoot.querySelectorAll('[data-pva="total-payments"]'),
      effectivePeriods: explanationRoot.querySelectorAll('[data-pva="effective-periods"]'),
      appliedRate: explanationRoot.querySelectorAll('[data-pva="applied-rate"]'),
      appliedRateDecimal: explanationRoot.querySelectorAll('[data-pva="applied-rate-decimal"]'),
      formulaAnnuityFactor: explanationRoot.querySelectorAll('[data-pva="formula-annuity-factor"]'),
      formulaDiscountSaved: explanationRoot.querySelectorAll('[data-pva="formula-discount-saved"]'),
      periodsPerYear: explanationRoot.querySelectorAll('[data-pva="periods-per-year"]'),
    }
  : null;

const periodGroup = document.querySelector('[data-button-group="pva-period-type"]');
const annuityGroup = document.querySelector('[data-button-group="pva-annuity-type"]');
const compoundingGroup = document.querySelector('[data-button-group="pva-compounding"]');

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
      name: 'What is the present value of an annuity?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "It is today's value of a series of equal future payments, discounted using a specific interest or discount rate.",
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between ordinary annuity and annuity due?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ordinary annuities pay at the end of each period. Annuity due pays at the beginning, resulting in a higher present value.',
      },
    },
    {
      '@type': 'Question',
      name: 'What discount rate should I use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use a rate reflecting interest rates, investment returns, inflation, or borrowing costs relevant to the cash flow.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is PV of annuity useful for loans and mortgages?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, PV of annuity calculations are commonly used to value loan repayments, mortgages, and lease payments.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if the discount rate is zero?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'If the rate is zero, the present value equals the total of all payments because no discounting is applied.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this useful for retirement planning?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, it helps estimate the value of pensions, retirement income streams, and long-term annuity payments.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I switch between years and months?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, use the period toggle to model either annual or monthly cash-flow timelines.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does compounding frequency affect PVA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'More frequent compounding changes per-period rates and periods, which changes the annuity factor and present value.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does annuity due always have a higher PV?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Usually yes, because each payment is discounted for one less period compared with ordinary annuity.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this calculator suitable for lease and pension valuation?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, it is suitable for valuing fixed periodic payment streams under a chosen discount rate.',
      },
    },
  ],
};

setPageMetadata({
  title: 'Present Value of Annuity Calculator | Ordinary or Due',
  description:
    'Estimate the present value of an annuity using payment amount, discount rate, periods, and annuity timing.',
  canonical: 'https://calchowmuch.com/finance-calculators/present-value-of-annuity-calculator/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Present Value of Annuity Calculator | Ordinary or Due',
        url: 'https://calchowmuch.com/finance-calculators/present-value-of-annuity-calculator/',
        description:
          'Estimate the present value of an annuity using payment amount, discount rate, periods, and annuity timing.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Present Value of Annuity Calculator',
        applicationCategory: 'FinanceApplication',
        applicationSubCategory: 'Time Value of Money Calculator',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/finance-calculators/present-value-of-annuity-calculator/',
        description:
          'Free present value of annuity calculator for ordinary annuity and annuity due. Calculates present value using payment amount, rate, and timing.',
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
            name: 'Present Value of Annuity',
            item: 'https://calchowmuch.com/finance-calculators/present-value-of-annuity-calculator/',
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
    discountRate: rateInput?.value ?? '',
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
  setText(metricDiscountSaved, '0');
  staleController.markFresh();
}

function calculate({ reveal = false } = {}) {
  if (!resultDiv) {
    return;
  }

  const payment = Number(paymentInput?.value);
  const discountRate = Number(rateInput?.value);
  const periods = Number(periodsInput?.value);
  const periodType = periodButtons?.getValue() ?? 'years';
  const annuityType = annuityButtons?.getValue() ?? 'ordinary';
  const compounding = compoundingButtons?.getValue() ?? 'annual';
  const compoundingInfo = resolveCompounding(compounding);

  if (!Number.isFinite(payment) || payment < 0) {
    setError('Payment must be 0 or more.');
    return;
  }
  if (!Number.isFinite(discountRate) || discountRate < 0) {
    setError('Discount rate must be 0 or more.');
    return;
  }
  if (!Number.isFinite(periods) || periods < 0) {
    setError('Periods must be 0 or more.');
    return;
  }

  const result = calculatePresentValueOfAnnuity({
    payment,
    discountRate,
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
  const discountSaved = result.totalPayments - result.presentValue;

  let annuityFactor = 0;
  if (result.totalPeriods > 0) {
    if (appliedRateDecimal === 0) {
      annuityFactor = result.totalPeriods;
    } else {
      annuityFactor =
        (1 - Math.pow(1 + appliedRateDecimal, -result.totalPeriods)) / appliedRateDecimal;
    }
  }
  if (annuityType === 'due') {
    annuityFactor *= 1 + appliedRateDecimal;
  }

  const paymentStr = fmt(payment);
  const discountRateStr = formatPercent(discountRate);
  const periodsStr = `${fmt(periods, { maximumFractionDigits: 2 })} ${
    periodType === 'months' ? 'months' : 'years'
  }`;
  const compoundingStr = compoundingInfo.label;
  const presentValueStr = fmt(result.presentValue);
  const totalPaymentsStr = fmt(result.totalPayments);
  const effectivePeriodsStr = fmt(result.totalPeriods, { maximumFractionDigits: 2 });
  const appliedRateStr = fmt(appliedRatePct, { maximumFractionDigits: 4 });
  const discountSavedStr = fmt(discountSaved);
  const annuityFactorStr = fmt(annuityFactor, { maximumFractionDigits: 6 });
  const appliedRateDecimalStr = fmt(appliedRateDecimal, { maximumFractionDigits: 6 });

  resultDiv.innerHTML = `<span class="mtg-result-value is-updated">${presentValueStr}</span>`;
  const valueEl = resultDiv.querySelector('.mtg-result-value');
  if (valueEl) {
    window.setTimeout(() => valueEl.classList.remove('is-updated'), 420);
  }

  setText(metricAnnuityType, annuityType === 'due' ? 'Due' : 'Ordinary');
  setText(metricTotalPayments, totalPaymentsStr);
  setText(metricEffectivePeriods, effectivePeriodsStr);
  setText(metricDiscountSaved, discountSavedStr);

  setText(snapPayment, paymentStr);
  setText(snapRate, discountRateStr);
  setText(snapPeriods, periodsStr);
  setText(snapAnnuityType, annuityTypeStr);
  setText(snapCompounding, compoundingStr);
  setText(snapEffectivePeriods, effectivePeriodsStr);
  setText(snapPeriodicRate, `${appliedRateStr}%`);

  updateTargets(valueTargets?.paymentAmount, paymentStr);
  updateTargets(valueTargets?.discountRate, discountRateStr);
  updateTargets(valueTargets?.periodCount, periodsStr);
  updateTargets(valueTargets?.annuityType, annuityTypeStr);
  updateTargets(valueTargets?.compoundingFrequency, compoundingStr);
  updateTargets(valueTargets?.presentValue, presentValueStr);
  updateTargets(valueTargets?.totalPayments, totalPaymentsStr);
  updateTargets(valueTargets?.effectivePeriods, effectivePeriodsStr);
  updateTargets(valueTargets?.appliedRate, appliedRateStr);
  updateTargets(valueTargets?.appliedRateDecimal, appliedRateDecimalStr);
  updateTargets(valueTargets?.formulaAnnuityFactor, annuityFactorStr);
  updateTargets(valueTargets?.formulaDiscountSaved, discountSavedStr);
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
