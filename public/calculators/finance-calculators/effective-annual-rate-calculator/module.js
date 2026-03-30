import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import { calculateEffectiveAnnualRate } from '/assets/js/core/time-value-utils.js';
import {
  createStaleResultController,
  revealResultPanel,
  updateRangeFill,
  wireRangeWithField,
} from '/calculators/finance-calculators/shared/cluster-ux.js';

const nominalRateInput = document.querySelector('#ear-nominal-rate');
const nominalRateField = document.querySelector('#ear-nominal-rate-field');

const calculateButton = document.querySelector('#ear-calc');
const previewPanel = document.querySelector('#ear-preview');
const staleNote = document.querySelector('#ear-stale-note');
const resultDiv = document.querySelector('#ear-result');

const rateDisplay = document.querySelector('#ear-rate-display');

const snapNominal = document.querySelector('[data-ear="snap-nominal"]');
const snapCompounding = document.querySelector('[data-ear="snap-compounding"]');
const snapPeriods = document.querySelector('[data-ear="snap-periods"]');
const snapPeriodicRate = document.querySelector('[data-ear="snap-periodic-rate"]');
const snapGrowthFactor = document.querySelector('[data-ear="snap-growth-factor"]');

const metricDifference = document.querySelector('[data-ear="metric-difference"]');
const metricCompounding = document.querySelector('[data-ear="metric-compounding"]');
const metricPeriods = document.querySelector('[data-ear="metric-periods"]');
const metricPeriodicRate = document.querySelector('[data-ear="metric-periodic-rate"]');

const explanationRoot = document.querySelector('#ear-explanation');
const valueTargets = explanationRoot
  ? {
      nominalRate: explanationRoot.querySelectorAll('[data-ear="nominal-rate"]'),
      frequency: explanationRoot.querySelectorAll('[data-ear="frequency"]'),
      periods: explanationRoot.querySelectorAll('[data-ear="periods"]'),
      earRate: explanationRoot.querySelectorAll('[data-ear="ear-rate"]'),
      periodicRate: explanationRoot.querySelectorAll('[data-ear="periodic-rate"]'),
      periodicRateDecimal: explanationRoot.querySelectorAll('[data-ear="periodic-rate-decimal"]'),
      nominalDecimal: explanationRoot.querySelectorAll('[data-ear="nominal-decimal"]'),
      onePlusRate: explanationRoot.querySelectorAll('[data-ear="one-plus-rate"]'),
      growthFactor: explanationRoot.querySelectorAll('[data-ear="growth-factor"]'),
      earDecimal: explanationRoot.querySelectorAll('[data-ear="ear-decimal"]'),
      difference: explanationRoot.querySelectorAll('[data-ear="difference"]'),
    }
  : null;

const frequencyGroup = document.querySelector('[data-button-group="ear-frequency"]');

const frequencyButtons = setupButtonGroup(frequencyGroup, {
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
      name: 'What is the Effective Annual Rate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'EAR is the true annual interest rate after accounting for compounding. It shows the real cost of borrowing or real return on savings.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is EAR different from a nominal rate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A nominal rate is the stated headline percentage. EAR includes the effect of compounding, making it higher or equal if compounded annually.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the EAR formula?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'EAR = (1 + r / n)^n - 1, where r is the nominal rate as a decimal and n is the number of compounding periods per year.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why does compounding frequency matter?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'More frequent compounding means interest is reinvested sooner, producing a higher effective rate from the same nominal rate.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is EAR the same as APR?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. APR typically does not include compounding effects, while EAR always does.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I compare loans using EAR?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Converting all loan rates to EAR lets you compare them on equal footing.',
      },
    },
    {
      '@type': 'Question',
      name: 'When does EAR equal the nominal rate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'When interest compounds only once per year (annually). With annual compounding there is no additional compounding effect.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does quarterly vs annual compounding compare?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Quarterly compounding produces a slightly higher EAR than annual because interest is reinvested four times instead of once.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is EAR useful for savings accounts?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. EAR tells you the true annual return on savings, helping you compare stated rates more accurately.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if the nominal rate is 0%?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'If the nominal rate is 0%, the EAR is also 0% because no interest means no compounding effect.',
      },
    },
  ],
};

setPageMetadata({
  title: 'Effective Annual Rate Calculator | APR to EAR',
  description:
    'Convert a nominal rate or APR into effective annual rate so you can compare the true yearly borrowing cost or return.',
  canonical: 'https://calchowmuch.com/finance-calculators/effective-annual-rate-calculator/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Effective Annual Rate Calculator | APR to EAR',
        url: 'https://calchowmuch.com/finance-calculators/effective-annual-rate-calculator/',
        description:
          'Convert a nominal rate or APR into effective annual rate so you can compare the true yearly borrowing cost or return.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Effective Annual Rate Calculator',
        applicationCategory: 'FinanceApplication',
        applicationSubCategory: 'Interest and Growth Calculator',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/finance-calculators/effective-annual-rate-calculator/',
        description:
          'Convert a nominal rate or APR into effective annual rate using compounding frequency.',
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
            name: 'Effective Annual Rate',
            item: 'https://calchowmuch.com/finance-calculators/effective-annual-rate-calculator/',
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

function fmtPct(value, maximumFractionDigits = 4) {
  return formatPercent(value, { maximumFractionDigits });
}

function parseLooseNumber(value) {
  const parsed = Number(String(value).replace(/,/g, '').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : NaN;
}

function formatFieldValue(value, fractionDigits = 1) {
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
    nominalRate: nominalRateInput?.value ?? '',
    compounding: frequencyButtons?.getValue() ?? 'annual',
  });
}

const staleController = createStaleResultController({
  resultPanel: previewPanel,
  staleTargets: [staleNote],
  getSignature: buildStateSignature,
});

function updateSliderDisplays() {
  updateRangeFill(nominalRateInput);
  setText(rateDisplay, formatPercent(Number(nominalRateInput?.value)));
}

wireRangeWithField({
  rangeInput: nominalRateInput,
  textInput: nominalRateField,
  formatFieldValue: (value) => formatFieldValue(value, 1),
  parseFieldValue: parseLooseNumber,
  onVisualUpdate: () => {
    updateSliderDisplays();
    staleController.sync();
  },
});

staleController.watchElements([frequencyGroup], ['click']);

function setError(message) {
  if (resultDiv) {
    resultDiv.textContent = message;
  }
  setText(metricDifference, '0%');
  setText(metricCompounding, 'Check inputs');
  setText(metricPeriods, '0');
  setText(metricPeriodicRate, '0%');
  staleController.markFresh();
}

function calculate({ reveal = false } = {}) {
  if (!resultDiv) {
    return;
  }

  const nominalRate = Number(nominalRateInput?.value);
  const compounding = frequencyButtons?.getValue() ?? 'annual';

  if (!Number.isFinite(nominalRate) || nominalRate < 0) {
    setError('Rate must be 0 or more.');
    return;
  }

  const result = calculateEffectiveAnnualRate({
    nominalRate,
    compounding,
  });

  if (!result) {
    setError('Check your inputs.');
    return;
  }

  const earPct = result.effectiveAnnualRate * 100;
  const nominalDecimal = nominalRate / 100;
  const periodicRateDecimal = nominalDecimal / result.periodsPerYear;
  const periodicRatePct = periodicRateDecimal * 100;
  const onePlusRate = 1 + periodicRateDecimal;
  const growthFactor = Math.pow(onePlusRate, result.periodsPerYear);
  const differencePct = earPct - nominalRate;

  const nominalStr = fmtPct(nominalRate, 2);
  const earStr = fmtPct(earPct, 4);
  const compoundingStr = result.compoundingLabel;
  const periodsStr = String(result.periodsPerYear);
  const periodicRateStr = fmtPct(periodicRatePct, 4);
  const periodicRateDecimalStr = fmt(periodicRateDecimal, { maximumFractionDigits: 6 });
  const nominalDecimalStr = fmt(nominalDecimal, { maximumFractionDigits: 6 });
  const onePlusRateStr = fmt(onePlusRate, { maximumFractionDigits: 6 });
  const growthFactorStr = fmt(growthFactor, { maximumFractionDigits: 6 });
  const earDecimalStr = fmt(result.effectiveAnnualRate, { maximumFractionDigits: 6 });
  const differenceStr = fmtPct(differencePct, 4);

  resultDiv.innerHTML = `<span class="mtg-result-value is-updated">${earStr}</span>`;
  const valueEl = resultDiv.querySelector('.mtg-result-value');
  if (valueEl) {
    window.setTimeout(() => valueEl.classList.remove('is-updated'), 420);
  }

  setText(metricDifference, differenceStr);
  setText(metricCompounding, compoundingStr);
  setText(metricPeriods, periodsStr);
  setText(metricPeriodicRate, periodicRateStr);

  setText(snapNominal, nominalStr);
  setText(snapCompounding, compoundingStr);
  setText(snapPeriods, periodsStr);
  setText(snapPeriodicRate, periodicRateStr);
  setText(snapGrowthFactor, growthFactorStr);

  updateTargets(valueTargets?.nominalRate, nominalStr);
  updateTargets(valueTargets?.frequency, compoundingStr);
  updateTargets(valueTargets?.periods, periodsStr);
  updateTargets(valueTargets?.earRate, earStr);
  updateTargets(valueTargets?.periodicRate, periodicRateStr);
  updateTargets(valueTargets?.periodicRateDecimal, periodicRateDecimalStr);
  updateTargets(valueTargets?.nominalDecimal, nominalDecimalStr);
  updateTargets(valueTargets?.onePlusRate, onePlusRateStr);
  updateTargets(valueTargets?.growthFactor, growthFactorStr);
  updateTargets(valueTargets?.earDecimal, earDecimalStr);
  updateTargets(valueTargets?.difference, differenceStr);

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
