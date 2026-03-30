import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import { calculateFutureValue, resolveCompounding } from '/assets/js/core/time-value-utils.js';
import {
  createStaleResultController,
  revealResultPanel,
  updateRangeFill,
  wireRangeWithField,
} from '/calculators/finance-calculators/shared/cluster-ux.js';

const pvInput = document.querySelector('#fv-present-value');
const rateInput = document.querySelector('#fv-interest-rate');
const timeInput = document.querySelector('#fv-time-period');
const contributionInput = document.querySelector('#fv-regular-contribution');

const pvField = document.querySelector('#fv-present-value-field');
const rateField = document.querySelector('#fv-interest-rate-field');
const timeField = document.querySelector('#fv-time-period-field');
const contributionField = document.querySelector('#fv-regular-contribution-field');

const calculateButton = document.querySelector('#fv-calc');
const previewPanel = document.querySelector('#fv-preview');
const staleNote = document.querySelector('#fv-stale-note');
const resultDiv = document.querySelector('#fv-result');

const pvDisplay = document.querySelector('#fv-pv-display');
const rateDisplay = document.querySelector('#fv-rate-display');
const timeDisplay = document.querySelector('#fv-time-display');
const contributionDisplay = document.querySelector('#fv-contrib-display');

const snapPv = document.querySelector('[data-fv="snap-pv"]');
const snapRate = document.querySelector('[data-fv="snap-rate"]');
const snapTime = document.querySelector('[data-fv="snap-time"]');
const snapCompounding = document.querySelector('[data-fv="snap-compounding"]');
const snapContribution = document.querySelector('[data-fv="snap-contribution"]');
const snapPeriods = document.querySelector('[data-fv="snap-periods"]');

const metricGrowth = document.querySelector('[data-fv="metric-growth"]');
const metricContributions = document.querySelector('[data-fv="metric-contributions"]');
const metricPeriods = document.querySelector('[data-fv="metric-periods"]');
const metricPeriodicRate = document.querySelector('[data-fv="metric-periodic-rate"]');

const explanationRoot = document.querySelector('#fv-explanation');
const valueTargets = explanationRoot
  ? {
      presentValue: explanationRoot.querySelectorAll('[data-fv="present-value"]'),
      interestRate: explanationRoot.querySelectorAll('[data-fv="interest-rate"]'),
      timePeriod: explanationRoot.querySelectorAll('[data-fv="time-period"]'),
      compoundingFrequency: explanationRoot.querySelectorAll('[data-fv="compounding-frequency"]'),
      futureValue: explanationRoot.querySelectorAll('[data-fv="future-value"]'),
      totalContributions: explanationRoot.querySelectorAll('[data-fv="total-contributions"]'),
      totalGrowth: explanationRoot.querySelectorAll('[data-fv="total-growth"]'),
      totalPeriods: explanationRoot.querySelectorAll('[data-fv="total-periods"]'),
      regularContribution: explanationRoot.querySelectorAll('[data-fv="regular-contribution"]'),
      appliedRate: explanationRoot.querySelectorAll('[data-fv="applied-rate"]'),
      appliedRateDecimal: explanationRoot.querySelectorAll('[data-fv="applied-rate-decimal"]'),
      formulaGrowthFactor: explanationRoot.querySelectorAll('[data-fv="formula-growth-factor"]'),
      periodsPerYear: explanationRoot.querySelectorAll('[data-fv="periods-per-year"]'),
    }
  : null;

const periodGroup = document.querySelector('[data-button-group="fv-period-type"]');
const compoundingGroup = document.querySelector('[data-button-group="fv-compounding"]');

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
      name: 'What is future value?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Future value is the projected amount your money could become after growth over time.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is future value different from present value?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Present value states what money is worth today, while future value projects what it may become later.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why does compounding matter?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Compounding lets growth build on earlier growth, which can accelerate outcomes over longer periods.',
      },
    },
    {
      '@type': 'Question',
      name: 'Should I include recurring contributions?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, when you expect to add a similar amount regularly and want the projection to reflect that habit.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use months instead of years?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Use months when you want a shorter planning horizon or more precise timing.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if the rate is 0%?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The ending balance is just the starting balance plus the total of all contributions.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why can small rate changes create big differences?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Because the rate compounds over every period, even small changes can compound meaningfully over time.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this a guarantee of performance?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It is a deterministic estimate based on the assumptions you enter.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use this for savings goals?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. It is useful for quick savings and investment planning under a fixed-rate assumption.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why can real-world balances differ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Real returns vary, contributions can change, and taxes, fees, or timing differences can alter results.',
      },
    },
  ],
};

setPageMetadata({
  title: 'Future Value Calculator | Savings & Investment Projection',
  description:
    'Project how a lump sum or recurring deposits could grow using return rate, time period, and compounding assumptions.',
  canonical: 'https://calchowmuch.com/finance-calculators/future-value-calculator/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Future Value Calculator | Savings & Investment Projection',
        url: 'https://calchowmuch.com/finance-calculators/future-value-calculator/',
        description:
          'Project how a lump sum or recurring deposits could grow using return rate, time period, and compounding assumptions.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Future Value Calculator',
        applicationCategory: 'FinanceApplication',
        applicationSubCategory: 'Time Value of Money Calculator',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/finance-calculators/future-value-calculator/',
        description:
          'Project future value using a starting balance, return rate, time period, compounding, and optional regular contributions.',
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
            name: 'Future Value (FV)',
            item: 'https://calchowmuch.com/finance-calculators/future-value-calculator/',
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
    presentValue: pvInput?.value ?? '',
    interestRate: rateInput?.value ?? '',
    timePeriod: timeInput?.value ?? '',
    contribution: contributionInput?.value ?? '',
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

  updateRangeFill(pvInput);
  updateRangeFill(rateInput);
  updateRangeFill(timeInput);
  updateRangeFill(contributionInput);

  setText(pvDisplay, fmt(Number(pvInput?.value), { maximumFractionDigits: 0 }));
  setText(rateDisplay, formatPercent(Number(rateInput?.value)));
  setText(
    timeDisplay,
    `${fmt(Number(timeInput?.value), { maximumFractionDigits: 0 })} ${
      periodType === 'months' ? 'mo' : 'yrs'
    }`
  );
  setText(contributionDisplay, fmt(Number(contributionInput?.value), { maximumFractionDigits: 0 }));
}

const bindVisualSync = () => {
  updateSliderDisplays();
  staleController.sync();
};

wireRangeWithField({
  rangeInput: pvInput,
  textInput: pvField,
  formatFieldValue: (value) => formatFieldValue(value, 0),
  parseFieldValue: parseLooseNumber,
  onVisualUpdate: bindVisualSync,
});

wireRangeWithField({
  rangeInput: rateInput,
  textInput: rateField,
  formatFieldValue: (value) => formatFieldValue(value, 1),
  parseFieldValue: parseLooseNumber,
  onVisualUpdate: bindVisualSync,
});

wireRangeWithField({
  rangeInput: timeInput,
  textInput: timeField,
  formatFieldValue: (value) => formatFieldValue(value, 0),
  parseFieldValue: parseLooseNumber,
  onVisualUpdate: bindVisualSync,
});

wireRangeWithField({
  rangeInput: contributionInput,
  textInput: contributionField,
  formatFieldValue: (value) => formatFieldValue(value, 0),
  parseFieldValue: parseLooseNumber,
  onVisualUpdate: bindVisualSync,
});

staleController.watchElements([periodGroup, compoundingGroup], ['click']);

function setError(message) {
  if (resultDiv) {
    resultDiv.textContent = message;
  }
  setText(metricGrowth, '0');
  setText(metricContributions, '0');
  setText(metricPeriods, '0');
  setText(metricPeriodicRate, '0%');
  staleController.markFresh();
}

function calculate({ reveal = false } = {}) {
  if (!resultDiv) {
    return;
  }

  const presentValue = Number(pvInput?.value);
  const interestRate = Number(rateInput?.value);
  const timePeriod = Number(timeInput?.value);
  const regularContribution = Number(contributionInput?.value) || 0;
  const periodType = periodButtons?.getValue() ?? 'years';
  const compounding = compoundingButtons?.getValue() ?? 'annual';
  const compoundingInfo = resolveCompounding(compounding);

  if (!Number.isFinite(presentValue) || presentValue < 0) {
    setError('Present value must be 0 or more.');
    return;
  }
  if (!Number.isFinite(interestRate) || interestRate < 0) {
    setError('Interest rate must be 0 or more.');
    return;
  }
  if (!Number.isFinite(timePeriod) || timePeriod < 0) {
    setError('Time period must be 0 or more.');
    return;
  }

  const result = calculateFutureValue({
    presentValue,
    interestRate,
    timePeriod,
    periodType,
    compounding,
    regularContribution,
  });

  if (!result) {
    setError('Check your inputs.');
    return;
  }

  const appliedRatePct = result.periodicRate * 100;
  const growthFactor = Math.pow(1 + result.periodicRate, result.totalPeriods);

  const pvStr = fmt(presentValue);
  const rateStr = formatPercent(interestRate);
  const timeStr = `${fmt(timePeriod, { maximumFractionDigits: 2 })} ${
    periodType === 'months' ? 'months' : 'years'
  }`;
  const contributionStr = fmt(regularContribution);
  const futureValueStr = fmt(result.futureValue);
  const growthStr = fmt(result.totalGrowth);
  const totalContributionsStr = fmt(result.totalContributions);
  const totalPeriodsStr = fmt(result.totalPeriods, { maximumFractionDigits: 2 });
  const appliedRateStr = fmt(appliedRatePct, { maximumFractionDigits: 4 });
  const appliedRateDecimalStr = fmt(result.periodicRate, { maximumFractionDigits: 6 });
  const growthFactorStr = fmt(growthFactor, { maximumFractionDigits: 6 });
  const compoundingStr = compoundingInfo.label;

  resultDiv.innerHTML = `<span class="mtg-result-value is-updated">${futureValueStr}</span>`;
  const valueEl = resultDiv.querySelector('.mtg-result-value');
  if (valueEl) {
    window.setTimeout(() => valueEl.classList.remove('is-updated'), 420);
  }

  setText(metricGrowth, growthStr);
  setText(metricContributions, totalContributionsStr);
  setText(metricPeriods, totalPeriodsStr);
  setText(metricPeriodicRate, `${appliedRateStr}%`);

  setText(snapPv, pvStr);
  setText(snapRate, rateStr);
  setText(snapTime, timeStr);
  setText(snapCompounding, compoundingStr);
  setText(snapContribution, contributionStr);
  setText(snapPeriods, totalPeriodsStr);

  updateTargets(valueTargets?.presentValue, pvStr);
  updateTargets(valueTargets?.interestRate, rateStr);
  updateTargets(valueTargets?.timePeriod, timeStr);
  updateTargets(valueTargets?.compoundingFrequency, compoundingStr);
  updateTargets(valueTargets?.futureValue, futureValueStr);
  updateTargets(valueTargets?.totalContributions, totalContributionsStr);
  updateTargets(valueTargets?.totalGrowth, growthStr);
  updateTargets(valueTargets?.totalPeriods, totalPeriodsStr);
  updateTargets(valueTargets?.regularContribution, contributionStr);
  updateTargets(valueTargets?.appliedRate, appliedRateStr);
  updateTargets(valueTargets?.appliedRateDecimal, appliedRateDecimalStr);
  updateTargets(valueTargets?.formulaGrowthFactor, growthFactorStr);
  updateTargets(valueTargets?.periodsPerYear, String(compoundingInfo.periodsPerYear));

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
