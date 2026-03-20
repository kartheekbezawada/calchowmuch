import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import { calculatePresentValue, resolveCompounding } from '/assets/js/core/time-value-utils.js';
import {
  createStaleResultController,
  revealResultPanel,
  updateRangeFill,
  wireRangeWithField,
} from '/calculators/finance-calculators/shared/cluster-ux.js';

const fvInput = document.querySelector('#pv-future-value');
const rateInput = document.querySelector('#pv-discount-rate');
const timeInput = document.querySelector('#pv-time-period');

const fvField = document.querySelector('#pv-future-value-field');
const rateField = document.querySelector('#pv-discount-rate-field');
const timeField = document.querySelector('#pv-time-period-field');

const calculateButton = document.querySelector('#pv-calc');
const previewPanel = document.querySelector('#pv-preview');
const staleNote = document.querySelector('#pv-stale-note');
const resultDiv = document.querySelector('#pv-result');

const fvDisplay = document.querySelector('#pv-fv-display');
const rateDisplay = document.querySelector('#pv-rate-display');
const timeDisplay = document.querySelector('#pv-time-display');

const snapFv = document.querySelector('[data-pv="snap-fv"]');
const snapRate = document.querySelector('[data-pv="snap-rate"]');
const snapTime = document.querySelector('[data-pv="snap-time"]');
const snapCompounding = document.querySelector('[data-pv="snap-compounding"]');
const snapPeriods = document.querySelector('[data-pv="snap-periods"]');

const metricDiscountLost = document.querySelector('[data-pv="metric-discount-lost"]');
const metricCompounding = document.querySelector('[data-pv="metric-compounding"]');
const metricPeriods = document.querySelector('[data-pv="metric-periods"]');
const metricPeriodicRate = document.querySelector('[data-pv="metric-periodic-rate"]');

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
      formulaDenominator: explanationRoot.querySelectorAll('[data-pv="formula-denominator"]'),
      formulaDiscountLost: explanationRoot.querySelectorAll('[data-pv="formula-discount-lost"]'),
      appliedRateDecimal: explanationRoot.querySelectorAll('[data-pv="applied-rate-decimal"]'),
      effectivePeriodsPerYear: explanationRoot.querySelectorAll(
        '[data-pv="effective-periods-per-year"]'
      ),
    }
  : null;

const periodGroup = document.querySelector('[data-button-group="pv-period-type"]');
const compoundingGroup = document.querySelector('[data-button-group="pv-compounding"]');

const periodButtons = setupButtonGroup(periodGroup, {
  defaultValue: 'years',
  onChange: () => {
    updateSliderDisplays();
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
      name: 'What is present value?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Present value is the amount a future cash sum is worth in today's money.",
      },
    },
    {
      '@type': 'Question',
      name: 'Why is present value lower than future value?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Because money available today can be invested, saved, or otherwise put to work immediately.',
      },
    },
    {
      '@type': 'Question',
      name: 'What discount rate should I use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use a rate that reflects your real opportunity cost, required return, or planning assumption.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does a longer time period always reduce present value?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, assuming the discount rate is positive and the future amount stays constant.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does compounding change here?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It changes the per-period rate and the number of periods used in the discounting process.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use months instead of years?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Use months when the timing is short and you want the answer to reflect that precision.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if the discount rate is 0%?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The present value equals the future value because no discounting is applied.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this calculator for recurring payments?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Use an annuity calculator when you need to value a series of recurring cash flows.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why can spreadsheet results differ slightly?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Display rounding can differ even when the underlying formula logic matches.',
      },
    },
    {
      '@type': 'Question',
      name: 'When is present value most useful?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It is useful when comparing future payouts, settlements, bonuses, or deferred cash offers.',
      },
    },
  ],
};

setPageMetadata({
  title: 'Present Value Calculator | Discount Future Money',
  description:
    'Estimate the present value of future money using discount rate, time period, and compounding frequency.',
  canonical: 'https://calchowmuch.com/finance-calculators/present-value-calculator/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Present Value Calculator | Discount Future Money',
        url: 'https://calchowmuch.com/finance-calculators/present-value-calculator/',
        description:
          'Estimate the present value of future money using discount rate, time period, and compounding frequency.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Present Value Calculator',
        applicationCategory: 'FinanceApplication',
        applicationSubCategory: 'Time Value of Money Calculator',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/finance-calculators/present-value-calculator/',
        description:
          'Calculate the present value of a future amount using discount rate, time period, and compounding frequency.',
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
            name: 'Present Value (PV)',
            item: 'https://calchowmuch.com/finance-calculators/present-value-calculator/',
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
    futureValue: fvInput?.value ?? '',
    discountRate: rateInput?.value ?? '',
    timePeriod: timeInput?.value ?? '',
    periodType: periodButtons?.getValue() ?? 'years',
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

  updateRangeFill(fvInput);
  updateRangeFill(rateInput);
  updateRangeFill(timeInput);

  setText(fvDisplay, fmt(Number(fvInput?.value), { maximumFractionDigits: 0 }));
  setText(rateDisplay, formatPercent(Number(rateInput?.value)));
  setText(
    timeDisplay,
    `${fmt(Number(timeInput?.value), { maximumFractionDigits: 0 })} ${
      periodType === 'months' ? 'mo' : 'yrs'
    }`
  );
}

wireRangeWithField({
  rangeInput: fvInput,
  textInput: fvField,
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
  rangeInput: timeInput,
  textInput: timeField,
  formatFieldValue: (value) => formatFieldValue(value, 0),
  parseFieldValue: parseLooseNumber,
  onVisualUpdate: () => {
    updateSliderDisplays();
    staleController.sync();
  },
});

staleController.watchElements([periodGroup, compoundingGroup], ['click']);

function setError(message) {
  if (resultDiv) {
    resultDiv.textContent = message;
  }
  setText(metricDiscountLost, '0');
  setText(metricCompounding, 'Check inputs');
  setText(metricPeriods, '0');
  setText(metricPeriodicRate, '0%');
  staleController.markFresh();
}

function calculate({ reveal = false } = {}) {
  if (!resultDiv) {
    return;
  }

  const futureValue = Number(fvInput?.value);
  const discountRate = Number(rateInput?.value);
  const timePeriod = Number(timeInput?.value);
  const periodType = periodButtons?.getValue() ?? 'years';
  const compounding = compoundingButtons?.getValue() ?? 'annual';
  const compoundingInfo = resolveCompounding(compounding);

  if (!Number.isFinite(futureValue) || futureValue < 0) {
    setError('Future value must be 0 or more.');
    return;
  }
  if (!Number.isFinite(discountRate) || discountRate < 0) {
    setError('Discount rate must be 0 or more.');
    return;
  }
  if (!Number.isFinite(timePeriod) || timePeriod < 0) {
    setError('Time period must be 0 or more.');
    return;
  }

  const result = calculatePresentValue({
    futureValue,
    discountRate,
    timePeriod,
    periodType,
    compounding,
  });

  if (!result) {
    setError('Check your inputs.');
    return;
  }

  const appliedRatePct = result.periodicRate * 100;
  const denominator = Math.pow(1 + result.periodicRate, result.totalPeriods);
  const discountLost = futureValue - result.presentValue;

  const fvStr = fmt(futureValue);
  const rateStr = formatPercent(discountRate);
  const timeStr = `${fmt(timePeriod, { maximumFractionDigits: 2 })} ${
    periodType === 'months' ? 'months' : 'years'
  }`;
  const compoundingStr = compoundingInfo.label;
  const pvStr = fmt(result.presentValue);
  const discountLostStr = fmt(discountLost);
  const totalPeriodsStr = fmt(result.totalPeriods, { maximumFractionDigits: 2 });
  const appliedRateStr = fmt(appliedRatePct, { maximumFractionDigits: 4 });
  const denominatorStr = fmt(denominator, { maximumFractionDigits: 6 });
  const appliedRateDecimalStr = fmt(result.periodicRate, { maximumFractionDigits: 6 });

  resultDiv.innerHTML = `<span class="mtg-result-value is-updated">${pvStr}</span>`;
  const valueEl = resultDiv.querySelector('.mtg-result-value');
  if (valueEl) {
    window.setTimeout(() => valueEl.classList.remove('is-updated'), 420);
  }

  setText(metricDiscountLost, discountLostStr);
  setText(metricCompounding, compoundingStr);
  setText(metricPeriods, totalPeriodsStr);
  setText(metricPeriodicRate, `${appliedRateStr}%`);

  setText(snapFv, fvStr);
  setText(snapRate, rateStr);
  setText(snapTime, timeStr);
  setText(snapCompounding, compoundingStr);
  setText(snapPeriods, totalPeriodsStr);

  updateTargets(valueTargets?.futureValue, fvStr);
  updateTargets(valueTargets?.discountRate, rateStr);
  updateTargets(valueTargets?.timePeriod, timeStr);
  updateTargets(valueTargets?.compoundingFrequency, compoundingStr);
  updateTargets(valueTargets?.presentValue, pvStr);
  updateTargets(valueTargets?.effectivePeriods, totalPeriodsStr);
  updateTargets(valueTargets?.appliedRate, appliedRateStr);
  updateTargets(valueTargets?.formulaDenominator, denominatorStr);
  updateTargets(valueTargets?.formulaDiscountLost, discountLostStr);
  updateTargets(valueTargets?.appliedRateDecimal, appliedRateDecimalStr);
  updateTargets(
    valueTargets?.effectivePeriodsPerYear,
    String(compoundingInfo.periodsPerYear)
  );

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
