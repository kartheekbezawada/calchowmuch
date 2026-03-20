import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import { calculateSimpleInterest } from '/assets/js/core/time-value-utils.js';
import {
  createStaleResultController,
  revealResultPanel,
  updateRangeFill,
  wireRangeWithField,
} from '/calculators/finance-calculators/shared/cluster-ux.js';

const principalInput = document.querySelector('#si-principal');
const rateInput = document.querySelector('#si-rate');
const timeInput = document.querySelector('#si-time');

const principalField = document.querySelector('#si-principal-field');
const rateField = document.querySelector('#si-rate-field');
const timeField = document.querySelector('#si-time-field');

const calculateButton = document.querySelector('#si-calc');
const previewPanel = document.querySelector('#si-preview');
const staleNote = document.querySelector('#si-stale-note');
const resultDiv = document.querySelector('#si-result');

const principalDisplay = document.querySelector('#si-principal-display');
const rateDisplay = document.querySelector('#si-rate-display');
const timeDisplay = document.querySelector('#si-time-display');

const snapPrincipal = document.querySelector('[data-si="snap-principal"]');
const snapRate = document.querySelector('[data-si="snap-rate"]');
const snapTime = document.querySelector('[data-si="snap-time"]');
const snapBasis = document.querySelector('[data-si="snap-basis"]');
const snapYears = document.querySelector('[data-si="snap-years"]');
const snapInterest = document.querySelector('[data-si="snap-interest"]');

const metricEndingAmount = document.querySelector('[data-si="metric-ending-amount"]');
const metricBasis = document.querySelector('[data-si="metric-basis"]');
const metricYears = document.querySelector('[data-si="metric-years"]');
const metricTimeUnit = document.querySelector('[data-si="metric-time-unit"]');

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
      rateDecimal: explanationRoot.querySelectorAll('[data-si="rate-decimal"]'),
      normalizedTime: explanationRoot.querySelectorAll('[data-si="normalized-time"]'),
      normalizedTimeLabel: explanationRoot.querySelectorAll('[data-si="normalized-time-label"]'),
    }
  : null;

const timeUnitGroup = document.querySelector('[data-button-group="si-time-unit"]');
const basisGroup = document.querySelector('[data-button-group="si-basis"]');

const timeUnitButtons = setupButtonGroup(timeUnitGroup, {
  defaultValue: 'years',
  onChange: () => {
    updateSliderDisplays();
    staleController.sync();
  },
});

const basisButtons = setupButtonGroup(basisGroup, {
  defaultValue: 'per-year',
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
      name: 'What is simple interest?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Simple interest is interest calculated only on the original principal amount. It does not compound on previously earned interest.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the simple interest formula?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'I = P x r x t, where P is principal, r is the rate as a decimal, and t is time in years or months depending on the basis you choose.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between simple and compound interest?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Simple interest applies only to the principal and grows linearly. Compound interest earns interest on both principal and accumulated interest.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use this for loans?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Many short-term loans, auto loans, and personal loans use simple interest, and this calculator estimates the total interest owed.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does simple interest grow linearly?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. With a fixed rate, the interest earned each period stays constant, creating a straight-line pattern.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I calculate interest for months?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Set the time unit to months. The calculator converts the time appropriately and applies the selected yearly or monthly basis.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if the rate is 0%?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Total interest is zero and the ending amount equals the principal because there is no growth or borrowing cost.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is Interest Basis?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Per Year treats the rate as annual. Per Month treats the rate as monthly, which can materially increase the result over longer schedules.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is simple interest used for savings?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It is less common for long-term savings because most savings accounts compound, but it is still useful for short-term estimates and comparisons.',
      },
    },
    {
      '@type': 'Question',
      name: 'When should I use simple interest?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use it for short-term loans, quick estimates, certificates of deposit with simple interest, and educational comparisons.',
      },
    },
  ],
};

setPageMetadata({
  title: 'Simple Interest Calculator | Interest & Final Amount',
  description:
    'Estimate simple interest, total interest, and ending amount using principal, rate, and time period.',
  canonical: 'https://calchowmuch.com/finance-calculators/simple-interest-calculator/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Simple Interest Calculator | Interest & Final Amount',
        url: 'https://calchowmuch.com/finance-calculators/simple-interest-calculator/',
        description:
          'Estimate simple interest, total interest, and ending amount using principal, rate, and time period.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Simple Interest Calculator',
        applicationCategory: 'FinanceApplication',
        applicationSubCategory: 'Interest and Growth Calculator',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/finance-calculators/simple-interest-calculator/',
        description:
          'Free simple interest calculator to compute total interest and ending amount using principal, rate, and time.',
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
            name: 'Simple Interest',
            item: 'https://calchowmuch.com/finance-calculators/simple-interest-calculator/',
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
    principal: principalInput?.value ?? '',
    rate: rateInput?.value ?? '',
    time: timeInput?.value ?? '',
    timeUnit: timeUnitButtons?.getValue() ?? 'years',
    interestBasis: basisButtons?.getValue() ?? 'per-year',
  });
}

const staleController = createStaleResultController({
  resultPanel: previewPanel,
  staleTargets: [staleNote],
  getSignature: buildStateSignature,
});

function updateSliderDisplays() {
  const timeUnit = timeUnitButtons?.getValue() ?? 'years';

  updateRangeFill(principalInput);
  updateRangeFill(rateInput);
  updateRangeFill(timeInput);

  setText(principalDisplay, fmt(Number(principalInput?.value), { maximumFractionDigits: 0 }));
  setText(rateDisplay, formatPercent(Number(rateInput?.value)));
  setText(
    timeDisplay,
    `${fmt(Number(timeInput?.value), { maximumFractionDigits: 0 })} ${
      timeUnit === 'months' ? 'mo' : 'yrs'
    }`
  );
}

wireRangeWithField({
  rangeInput: principalInput,
  textInput: principalField,
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

staleController.watchElements([timeUnitGroup, basisGroup], ['click']);

function setError(message) {
  if (resultDiv) {
    resultDiv.textContent = message;
  }
  setText(metricEndingAmount, '0');
  setText(metricBasis, 'Check inputs');
  setText(metricYears, '0');
  setText(metricTimeUnit, '0');
  staleController.markFresh();
}

function calculate({ reveal = false } = {}) {
  if (!resultDiv) {
    return;
  }

  const principal = Number(principalInput?.value);
  const rate = Number(rateInput?.value);
  const timePeriod = Number(timeInput?.value);
  const timeUnit = timeUnitButtons?.getValue() ?? 'years';
  const interestBasis = basisButtons?.getValue() ?? 'per-year';

  if (!Number.isFinite(principal) || principal < 0) {
    setError('Principal must be 0 or more.');
    return;
  }
  if (!Number.isFinite(rate) || rate < 0) {
    setError('Interest rate must be 0 or more.');
    return;
  }
  if (!Number.isFinite(timePeriod) || timePeriod < 0) {
    setError('Time must be 0 or more.');
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
    setError('Check your inputs.');
    return;
  }

  const principalStr = fmt(result.principal);
  const rateStr = formatPercent(result.rate);
  const timeStr = fmt(result.timePeriod, { maximumFractionDigits: 2 });
  const timeUnitStr = result.timeUnit === 'months' ? 'Months' : 'Years';
  const basisStr = result.interestBasis === 'per-month' ? 'Per Month' : 'Per Year';
  const yearsStr = fmt(result.years, { maximumFractionDigits: 4 });
  const normalizedTime = result.interestBasis === 'per-month' ? result.months : result.years;
  const normalizedTimeStr = fmt(normalizedTime, { maximumFractionDigits: 4 });
  const normalizedTimeLabel = result.interestBasis === 'per-month' ? 'months' : 'years';
  const rateDecimalStr = fmt(result.rate / 100, { maximumFractionDigits: 6 });
  const totalInterestStr = fmt(result.totalInterest);
  const endingAmountStr = fmt(result.endingAmount);

  resultDiv.innerHTML = `<span class="mtg-result-value is-updated">${totalInterestStr}</span>`;
  const valueEl = resultDiv.querySelector('.mtg-result-value');
  if (valueEl) {
    window.setTimeout(() => valueEl.classList.remove('is-updated'), 420);
  }

  setText(metricEndingAmount, endingAmountStr);
  setText(metricBasis, basisStr);
  setText(metricYears, yearsStr);
  setText(metricTimeUnit, timeUnitStr);

  setText(snapPrincipal, principalStr);
  setText(snapRate, rateStr);
  setText(snapTime, `${timeStr} ${timeUnitStr.toLowerCase()}`);
  setText(snapBasis, basisStr);
  setText(snapYears, yearsStr);
  setText(snapInterest, totalInterestStr);

  updateTargets(valueTargets?.principal, principalStr);
  updateTargets(valueTargets?.rate, rateStr);
  updateTargets(valueTargets?.time, timeStr);
  updateTargets(valueTargets?.timeUnit, timeUnitStr.toLowerCase());
  updateTargets(valueTargets?.basis, basisStr);
  updateTargets(valueTargets?.totalInterest, totalInterestStr);
  updateTargets(valueTargets?.endingAmount, endingAmountStr);
  updateTargets(valueTargets?.years, yearsStr);
  updateTargets(valueTargets?.rateDecimal, rateDecimalStr);
  updateTargets(valueTargets?.normalizedTime, normalizedTimeStr);
  updateTargets(valueTargets?.normalizedTimeLabel, normalizedTimeLabel);

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
