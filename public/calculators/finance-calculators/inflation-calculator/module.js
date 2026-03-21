import { setPageMetadata } from '/assets/js/core/ui.js';
import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import {
  calculateInflationAdjustment,
  formatCpiMonth,
  getAvailableCpiMonthRange,
  getLatestAvailableCpiMonth,
} from '/assets/js/core/inflation-utils.js';
import {
  createStaleResultController,
  revealResultPanel,
  wireRangeWithField,
} from '/calculators/finance-calculators/shared/cluster-ux.js';

const amountInput = document.querySelector('#inf-amount');
const amountField = document.querySelector('#inf-amount-field');
const amountDisplay = document.querySelector('#inf-amount-display');
const fromMonthInput = document.querySelector('#inf-from-month');
const toMonthInput = document.querySelector('#inf-to-month');
const calculateButton = document.querySelector('#inf-calc');
const resultOutput = document.querySelector('#inf-result');
const detailPanel = document.querySelector('#inf-result-detail');
const previewPanel = document.querySelector('#inf-preview');
const staleNote = document.querySelector('#inf-stale-note');

const metricChange = document.querySelector('[data-inf="metric-change"]');
const metricCumulative = document.querySelector('[data-inf="metric-cumulative"]');
const metricAnnualized = document.querySelector('[data-inf="metric-annualized"]');
const metricFactor = document.querySelector('[data-inf="metric-factor"]');

const snapshotAmount = document.querySelector('[data-inf="snap-amount"]');
const snapshotFrom = document.querySelector('[data-inf="snap-from"]');
const snapshotTo = document.querySelector('[data-inf="snap-to"]');
const snapshotStartCpi = document.querySelector('[data-inf="snap-start-cpi"]');
const snapshotEndCpi = document.querySelector('[data-inf="snap-end-cpi"]');
const snapshotMonths = document.querySelector('[data-inf="snap-months"]');
const snapshotEquivalent = document.querySelector('[data-inf="snap-equivalent"]');

const explanationRoot = document.querySelector('#inflation-explanation');
const valueTargets = explanationRoot
  ? {
      amount: explanationRoot.querySelectorAll('[data-inf="amount"]'),
      equivalent: explanationRoot.querySelectorAll('[data-inf="equivalent"]'),
      fromLabel: explanationRoot.querySelectorAll('[data-inf="from-label"]'),
      toLabel: explanationRoot.querySelectorAll('[data-inf="to-label"]'),
      startCpi: explanationRoot.querySelectorAll('[data-inf="start-cpi"]'),
      endCpi: explanationRoot.querySelectorAll('[data-inf="end-cpi"]'),
      absoluteChange: explanationRoot.querySelectorAll('[data-inf="absolute-change"]'),
      cumulativeRate: explanationRoot.querySelectorAll('[data-inf="cumulative-rate"]'),
      annualizedRate: explanationRoot.querySelectorAll('[data-inf="annualized-rate"]'),
      monthSpan: explanationRoot.querySelectorAll('[data-inf="month-span"]'),
    }
  : null;

const metadata = {
  title: 'Inflation Calculator – CPI-Based Value & Purchasing Power Over Time | CalcHowMuch',
  description:
    'Compare how much an amount from one month and year is worth in another using U.S. CPI data. See equivalent value, cumulative inflation, and annualized inflation.',
  canonical: 'https://calchowmuch.com/finance-calculators/inflation-calculator/',
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://calchowmuch.com/#website',
        url: 'https://calchowmuch.com/',
        name: 'CalcHowMuch',
        inLanguage: 'en',
      },
      {
        '@type': 'Organization',
        '@id': 'https://calchowmuch.com/#organization',
        name: 'CalcHowMuch',
        url: 'https://calchowmuch.com/',
        logo: {
          '@type': 'ImageObject',
          url: 'https://calchowmuch.com/assets/images/og-default.png',
        },
      },
      {
        '@type': 'WebPage',
        '@id': 'https://calchowmuch.com/finance-calculators/inflation-calculator/#webpage',
        url: 'https://calchowmuch.com/finance-calculators/inflation-calculator/',
        name: 'Inflation Calculator',
        description:
          'Compare how much an amount from one month and year is worth in another using U.S. CPI data. See equivalent value, cumulative inflation, and annualized inflation.',
        inLanguage: 'en',
        isPartOf: {
          '@id': 'https://calchowmuch.com/#website',
        },
        publisher: {
          '@id': 'https://calchowmuch.com/#organization',
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: 'https://calchowmuch.com/assets/images/og-default.png',
        },
        about: {
          '@id': 'https://calchowmuch.com/finance-calculators/inflation-calculator/#softwareapplication',
        },
        mainEntity: {
          '@id': 'https://calchowmuch.com/finance-calculators/inflation-calculator/#softwareapplication',
        },
        breadcrumb: {
          '@id': 'https://calchowmuch.com/finance-calculators/inflation-calculator/#breadcrumbs',
        },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://calchowmuch.com/finance-calculators/inflation-calculator/#softwareapplication',
        name: 'Inflation Calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/finance-calculators/inflation-calculator/',
        description:
          'Calculate inflation-adjusted value using U.S. CPI data. Compare purchasing power across months and years, and view equivalent value, cumulative inflation, and annualized inflation.',
        inLanguage: 'en',
        provider: {
          '@id': 'https://calchowmuch.com/#organization',
        },
        featureList: [
          'Inflation-adjusted value comparison',
          'Equivalent value in target month',
          'Cumulative inflation rate',
          'Annualized inflation rate',
          'Purchasing power comparison',
        ],
        keywords:
          'inflation calculator, CPI calculator, purchasing power calculator, inflation-adjusted value, value of money over time',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://calchowmuch.com/finance-calculators/inflation-calculator/#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What does this inflation calculator do?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'It converts an amount from one U.S. CPI month into the equivalent value in another month so you can compare purchasing power directly.',
            },
          },
          {
            '@type': 'Question',
            name: 'What CPI series does it use?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'It uses the U.S. Bureau of Labor Statistics CPI-U series CUUR0000SA0.',
            },
          },
          {
            '@type': 'Question',
            name: 'Why is the end amount usually higher than the start amount?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: "Because inflation usually increases the CPI level over time, so more dollars are needed in the later month to match the earlier month's purchasing power.",
            },
          },
          {
            '@type': 'Question',
            name: 'What is cumulative inflation?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Cumulative inflation is the total percentage change in CPI between the selected start month and end month.',
            },
          },
          {
            '@type': 'Question',
            name: 'What is annualized inflation?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Annualized inflation is the average yearly inflation rate implied by the CPI change across the selected period.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I compare a month to itself?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. If the same month is selected for both inputs, the equivalent amount remains the same and inflation is zero.',
            },
          },
          {
            '@type': 'Question',
            name: "Why can't I choose a later start month than end month?",
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'This calculator is designed for earlier-to-later historical comparisons so the inflation direction and results remain clear.',
            },
          },
          {
            '@type': 'Question',
            name: 'Why might a month be unavailable?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'If the official BLS series does not publish a value for a month, the calculator does not use an estimate for that month.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is this the same as my personal inflation rate?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. CPI-U measures overall consumer prices, while your personal inflation rate depends on your own spending patterns.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I use this for contracts, salaries, or budgets?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. It can help restate older dollar amounts into later-dollar terms for quick CPI-based purchasing power comparisons.',
            },
          },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://calchowmuch.com/finance-calculators/inflation-calculator/#breadcrumbs',
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
            name: 'Finance Calculators',
            item: 'https://calchowmuch.com/finance-calculators/',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Inflation Calculator',
            item: 'https://calchowmuch.com/finance-calculators/inflation-calculator/',
          },
        ],
      },
    ],
  },
};

setPageMetadata(metadata);

function setTargets(targets, value) {
  if (!targets) {
    return;
  }

  targets.forEach((node) => {
    if (node.textContent !== value) {
      node.textContent = value;
    }
  });
}

function formatMoney(value, options = {}) {
  return formatNumber(value, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  });
}

function formatSignedMoney(value) {
  const prefix = value > 0 ? '+' : value < 0 ? '-' : '';
  return `${prefix}${formatMoney(Math.abs(value))}`;
}

function formatSignedPercent(value, options = {}) {
  const prefix = value > 0 ? '+' : value < 0 ? '-' : '';
  return `${prefix}${formatPercent(Math.abs(value) * 100, options)}`;
}

function formatFactor(value) {
  return `${formatNumber(value, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}x`;
}

function formatMonthSpan(monthSpan) {
  if (!Number.isFinite(monthSpan) || monthSpan <= 0) {
    return '0 months';
  }

  const years = Math.floor(monthSpan / 12);
  const months = monthSpan % 12;
  const parts = [];

  if (years > 0) {
    parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
  }
  if (months > 0) {
    parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
  }

  return `${parts.join(', ')} (${monthSpan} months)`;
}

function parseNumericFieldValue(value) {
  return Number(
    String(value || '')
      .replace(/,/g, '')
      .trim()
  );
}

function clearDetailTargets() {
  [
    metricChange,
    metricCumulative,
    metricAnnualized,
    metricFactor,
    snapshotAmount,
    snapshotFrom,
    snapshotTo,
    snapshotStartCpi,
    snapshotEndCpi,
    snapshotMonths,
    snapshotEquivalent,
  ]
    .filter(Boolean)
    .forEach((node) => {
      node.textContent = '—';
    });
}

function setError(message) {
  if (resultOutput) {
    resultOutput.innerHTML = `<span class="mtg-result-value inf-error">${message}</span>`;
  }
  clearDetailTargets();
}

function updateExplanation(output) {
  setTargets(valueTargets?.amount, formatMoney(output.amount));
  setTargets(valueTargets?.equivalent, formatMoney(output.equivalentValue));
  setTargets(valueTargets?.fromLabel, output.fromLabel);
  setTargets(valueTargets?.toLabel, output.toLabel);
  setTargets(valueTargets?.startCpi, formatNumber(output.startCpi, { maximumFractionDigits: 3 }));
  setTargets(valueTargets?.endCpi, formatNumber(output.endCpi, { maximumFractionDigits: 3 }));
  setTargets(valueTargets?.absoluteChange, formatSignedMoney(output.absoluteChange));
  setTargets(valueTargets?.cumulativeRate, formatSignedPercent(output.cumulativeInflationRate));
  setTargets(valueTargets?.annualizedRate, formatSignedPercent(output.annualizedInflationRate));
  setTargets(valueTargets?.monthSpan, formatMonthSpan(output.monthSpan));
}

function renderOutput(output) {
  if (!resultOutput) {
    return;
  }

  const equivalent = formatMoney(output.equivalentValue);
  const absoluteChange = formatSignedMoney(output.absoluteChange);
  const cumulativeRate = formatSignedPercent(output.cumulativeInflationRate);
  const annualizedRate = formatSignedPercent(output.annualizedInflationRate);
  const factor = formatFactor(output.inflationFactor);
  const startCpi = formatNumber(output.startCpi, { maximumFractionDigits: 3 });
  const endCpi = formatNumber(output.endCpi, { maximumFractionDigits: 3 });
  const span = formatMonthSpan(output.monthSpan);

  resultOutput.innerHTML = `<span class="mtg-result-value is-updated">${equivalent}</span>`;
  const valueNode = resultOutput.querySelector('.mtg-result-value');
  if (valueNode) {
    window.setTimeout(() => valueNode.classList.remove('is-updated'), 420);
  }

  metricChange.textContent = absoluteChange;
  metricCumulative.textContent = cumulativeRate;
  metricAnnualized.textContent = annualizedRate;
  metricFactor.textContent = factor;

  snapshotAmount.textContent = formatMoney(output.amount);
  snapshotFrom.textContent = output.fromLabel;
  snapshotTo.textContent = output.toLabel;
  snapshotStartCpi.textContent = startCpi;
  snapshotEndCpi.textContent = endCpi;
  snapshotMonths.textContent = span;
  snapshotEquivalent.textContent = equivalent;

  updateExplanation(output);
}

function getCalculationSignature() {
  return [
    amountInput?.value ?? '',
    amountField?.value ?? '',
    fromMonthInput?.value ?? '',
    toMonthInput?.value ?? '',
  ].join('|');
}

const amountBinding = wireRangeWithField({
  rangeInput: amountInput,
  textInput: amountField,
  formatFieldValue: (value) => formatNumber(value, { maximumFractionDigits: 0 }),
  parseFieldValue: parseNumericFieldValue,
  onVisualUpdate: () => {
    if (!amountInput || !amountDisplay) {
      return;
    }
    amountDisplay.textContent = formatNumber(amountInput.value, { maximumFractionDigits: 0 });
  },
});

const staleResultController = createStaleResultController({
  resultPanel: previewPanel,
  staleTargets: [staleNote],
  getSignature: getCalculationSignature,
});

function calculate() {
  const output = calculateInflationAdjustment({
    amount: amountInput?.value,
    fromMonth: fromMonthInput?.value,
    toMonth: toMonthInput?.value,
  });

  if (output.error) {
    setError(output.error);
    staleResultController.markFresh();
    return;
  }

  renderOutput(output);
  staleResultController.markFresh();
  revealResultPanel({
    resultPanel: previewPanel,
    focusTarget: resultOutput,
  });
}

function initializeMonthBounds() {
  const { min, max } = getAvailableCpiMonthRange();
  const latestMonth = getLatestAvailableCpiMonth();

  if (fromMonthInput) {
    fromMonthInput.min = min;
    fromMonthInput.max = max;
    if (!fromMonthInput.value) {
      fromMonthInput.value = '2000-01';
    }
  }

  if (toMonthInput) {
    toMonthInput.min = min;
    toMonthInput.max = max;
    toMonthInput.value = latestMonth;
  }
}

initializeMonthBounds();
amountBinding.syncFromRange();

if (calculateButton) {
  calculateButton.addEventListener('click', calculate);
}

staleResultController.watchElements(
  [amountInput, amountField, fromMonthInput, toMonthInput],
  ['input', 'change']
);

[fromMonthInput, toMonthInput].filter(Boolean).forEach((input) => {
  input.addEventListener('blur', () => {
    staleResultController.sync();
  });
});

calculate();
