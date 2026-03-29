import { formatCurrency, formatNumber, formatPercent } from '/assets/js/core/format.js';
import { calculateInvestmentPlan } from '/assets/js/core/time-value-utils.js';
import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import {
  createStaleResultController,
  revealResultPanel,
} from '/calculators/finance-calculators/shared/cluster-ux.js';

const defaults = Object.freeze({
  initialInvestment: 15000,
  annualReturnRate: 7,
  years: 20,
  recurringContribution: 300,
  inflationRate: 2.5,
  compounding: 'monthly',
  comparisonContributionMode: 'include-recurring-contributions',
  precision: 2,
});

const inputNodes = {
  initialInvestment: document.querySelector('#inv-initial'),
  annualReturnRate: document.querySelector('#inv-return'),
  years: document.querySelector('#inv-years'),
  recurringContribution: document.querySelector('#inv-recurring'),
  inflationRate: document.querySelector('#inv-inflation'),
};

const rangeNodes = {
  initialInvestment: document.querySelector('#inv-initial-range'),
  annualReturnRate: document.querySelector('#inv-return-range'),
  years: document.querySelector('#inv-years-range'),
  recurringContribution: document.querySelector('#inv-recurring-range'),
  inflationRate: document.querySelector('#inv-inflation-range'),
};

const liveValueNodes = {
  initialInvestment: document.querySelector('[data-inv-live-value="initialInvestment"]'),
  annualReturnRate: document.querySelector('[data-inv-live-value="annualReturnRate"]'),
  years: document.querySelector('[data-inv-live-value="years"]'),
  recurringContribution: document.querySelector('[data-inv-live-value="recurringContribution"]'),
  inflationRate: document.querySelector('[data-inv-live-value="inflationRate"]'),
};

const metricNodes = {
  contributions: document.querySelector('[data-inv-metric="contributions"]'),
  gains: document.querySelector('[data-inv-metric="gains"]'),
  simple: document.querySelector('[data-inv-metric="simple"]'),
  compound: document.querySelector('[data-inv-metric="compound"]'),
  uplift: document.querySelector('[data-inv-metric="uplift"]'),
  real: document.querySelector('[data-inv-metric="real"]'),
};

const snapshotNodes = {
  initial: document.querySelector('[data-inv-snap="initial"]'),
  return: document.querySelector('[data-inv-snap="return"]'),
  years: document.querySelector('[data-inv-snap="years"]'),
  recurring: document.querySelector('[data-inv-snap="recurring"]'),
  compounding: document.querySelector('[data-inv-snap="compounding"]'),
  mode: document.querySelector('[data-inv-snap="mode"]'),
};

const donutNodes = {
  root: document.querySelector('#inv-donut'),
  value: document.querySelector('#inv-donut-value'),
  contributions: document.querySelector('[data-inv-donut="contributions"]'),
  growth: document.querySelector('[data-inv-donut="growth"]'),
  note: document.querySelector('#inv-donut-note'),
};

const explanationNodes = {
  ending: document.querySelector('[data-inv-exp="ending"]'),
  contributions: document.querySelector('[data-inv-exp="contributions"]'),
  real: document.querySelector('[data-inv-exp="real"]'),
  initial: document.querySelector('[data-inv-exp="initial"]'),
  years: document.querySelector('[data-inv-exp="years"]'),
  return: document.querySelector('[data-inv-exp="return"]'),
  compounding: document.querySelector('[data-inv-exp="compounding"]'),
  simple: document.querySelector('[data-inv-exp="simple"]'),
  compound: document.querySelector('[data-inv-exp="compound"]'),
  uplift: document.querySelector('[data-inv-exp="uplift"]'),
  recurring: document.querySelector('[data-inv-exp="recurring"]'),
};

const resultValueNode = document.querySelector('#inv-result-value');
const assumptionNode = document.querySelector('[data-inv="assumption-line"]');
const modeBadgeNode = document.querySelector('#inv-mode-badge');
const tableNoteNode = document.querySelector('#inv-table-note');
const tableBodyNode = document.querySelector('#inv-table-body');
const lineChartNode = document.querySelector('#inv-line-chart');
const previewPanel = document.querySelector('#inv-preview');
const staleNote = document.querySelector('#inv-stale-note');
const calculateButton = document.querySelector('#inv-calc');
const resetButton = document.querySelector('#inv-reset');
const advancedToggle = document.querySelector('#inv-advanced-toggle');
const advancedSection = document.querySelector('#inv-advanced-section');

const controlMeta = {
  initialInvestment: { min: 0, max: 100000000, defaultValue: defaults.initialInvestment },
  annualReturnRate: { min: 0, max: 100, defaultValue: defaults.annualReturnRate },
  years: { min: 0, max: 80, defaultValue: defaults.years },
  recurringContribution: { min: 0, max: 1000000, defaultValue: defaults.recurringContribution },
  inflationRate: { min: 0, max: 100, defaultValue: defaults.inflationRate },
};

const compoundingButtons = setupButtonGroup(document.querySelector('[data-button-group="inv-compounding"]'), {
  defaultValue: defaults.compounding,
  onChange: () => staleResultController?.sync(),
});

const comparisonModeButtons = setupButtonGroup(
  document.querySelector('[data-button-group="inv-comparison-mode"]'),
  {
    defaultValue: defaults.comparisonContributionMode,
    onChange: () => staleResultController?.sync(),
  }
);

export const pageSchema = {
  calculatorFAQ: true,
  globalFAQ: false,
};

const CALCULATOR_FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is an investment calculator used for?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It estimates how a lump sum and recurring deposits may grow over time and separates contributions, growth, and inflation-adjusted value.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between simple and compound investment growth?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Simple growth adds return only on principal, while compound growth also earns return on earlier gains.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why does compounding matter more over long periods?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Later periods begin from a larger base, so each additional period can create more growth than earlier periods.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do recurring contributions change the result?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Recurring deposits add capital directly and give later contributions time to earn returns too.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does compounding frequency make a big difference?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Usually the impact is smaller than time, contributions, and the return assumption, but more frequent compounding can still lift the ending value.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why show an inflation-adjusted value?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It converts the nominal ending balance into today’s purchasing power so long-term results are easier to interpret.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can this calculator be used for retirement planning?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. It works well for long-horizon planning that combines a starting balance, ongoing deposits, and inflation context.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if the expected return is 0%?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The ending value becomes the total amount contributed and the simple and compound paths converge.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is the result guaranteed?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. The result is a projection based on assumptions and actual market returns can vary materially.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which related calculator should I use next?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use investment growth for a lighter projection page or investment return when you need CAGR and advanced return analysis.',
      },
    },
  ],
};

setPageMetadata({
  title: 'Investment Calculator | Growth, Contributions & Returns',
  description:
    'Estimate ending value, total contributions, simple vs compound growth, and inflation-adjusted purchasing power with one broad investment calculator.',
  canonical: 'https://calchowmuch.com/finance-calculators/investment-calculator/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Investment Calculator | Growth, Contributions & Returns',
        url: 'https://calchowmuch.com/finance-calculators/investment-calculator/',
        description:
          'Estimate ending value, total contributions, simple vs compound growth, and inflation-adjusted purchasing power with one broad investment calculator.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Investment Calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/finance-calculators/investment-calculator/',
        description:
          'Broad investment planning calculator for growth, recurring contributions, compounding uplift, and inflation-adjusted interpretation.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
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
            name: 'Investment Calculator',
            item: 'https://calchowmuch.com/finance-calculators/investment-calculator/',
          },
        ],
      },
    ],
  },
});

let staleResultController = null;

function readNumber(input, fallback = 0) {
  const value = Number(input?.value ?? fallback);
  return Number.isFinite(value) ? value : fallback;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function formatControlValue(key, value) {
  switch (key) {
    case 'initialInvestment':
    case 'recurringContribution':
      return formatCurrency(value);
    case 'annualReturnRate':
    case 'inflationRate':
      return formatPercent(value, {
        minimumFractionDigits: value % 1 === 0 ? 0 : 1,
        maximumFractionDigits: 1,
      });
    case 'years':
      return `${formatNumber(value)} ${value === 1 ? 'year' : 'years'}`;
    default:
      return String(value);
  }
}

function updateSliderVisual(key, value) {
  const meta = controlMeta[key];
  const rangeNode = rangeNodes[key];
  if (!meta || !rangeNode) {
    return;
  }
  const clampedValue = clamp(value, meta.min, meta.max);
  const percent = ((clampedValue - meta.min) / Math.max(meta.max - meta.min, 1)) * 100;
  rangeNode.style.setProperty('--inv-slider-fill', `${percent}%`);
}

function syncControlValue(key, source = 'number') {
  const inputNode = inputNodes[key];
  const rangeNode = rangeNodes[key];
  const meta = controlMeta[key];
  if (!inputNode || !meta) {
    return;
  }

  const fallbackValue = meta.defaultValue;
  const sourceNode = source === 'range' ? rangeNode : inputNode;
  const nextValue = readNumber(sourceNode, fallbackValue);
  const clampedValue = clamp(nextValue, meta.min, meta.max);

  if (rangeNode && source !== 'range') {
    rangeNode.value = String(clampedValue);
  }

  if (source === 'range') {
    inputNode.value = String(nextValue);
  }

  updateText(liveValueNodes[key], formatControlValue(key, nextValue));
  updateSliderVisual(key, clampedValue);
}

function getInputState() {
  return {
    initialInvestment: readNumber(inputNodes.initialInvestment, defaults.initialInvestment),
    annualReturnRate: readNumber(inputNodes.annualReturnRate, defaults.annualReturnRate),
    years: readNumber(inputNodes.years, defaults.years),
    recurringContribution: readNumber(
      inputNodes.recurringContribution,
      defaults.recurringContribution
    ),
    inflationRate: readNumber(inputNodes.inflationRate, defaults.inflationRate),
    compounding: compoundingButtons?.getValue() ?? defaults.compounding,
    comparisonContributionMode:
      comparisonModeButtons?.getValue() ?? defaults.comparisonContributionMode,
    precision: defaults.precision,
  };
}

function getCalculationSignature() {
  const state = getInputState();
  return [
    state.initialInvestment,
    state.annualReturnRate,
    state.years,
    state.recurringContribution,
    state.inflationRate,
    state.compounding,
    state.comparisonContributionMode,
  ].join('|');
}

function formatAxisCurrency(value) {
  if (!Number.isFinite(value)) {
    return '—';
  }
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (abs >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (abs >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }
  return formatCurrency(value);
}

function buildLinePath(values, xForIndex, yForValue) {
  return values
    .map((value, index) => `${index === 0 ? 'M' : 'L'} ${xForIndex(index)} ${yForValue(value)}`)
    .join(' ');
}

function renderLineChart(result) {
  if (!lineChartNode || !result) {
    return;
  }

  const width = 720;
  const height = 320;
  const padding = { top: 22, right: 18, bottom: 42, left: 76 };
  const values = result.chart.nominalValues.map((value, index) => ({
    nominal: value,
    real: result.chart.realValues[index] ?? value,
  }));
  const maxValue = Math.max(
    ...values.flatMap((entry) => [entry.nominal, entry.real].filter(Number.isFinite)),
    1
  );
  const xSpan = width - padding.left - padding.right;
  const ySpan = height - padding.top - padding.bottom;
  const xForIndex = (index) =>
    padding.left + (xSpan * index) / Math.max(values.length - 1, 1);
  const yForValue = (value) => padding.top + ySpan - (Math.max(value, 0) / maxValue) * ySpan;
  const tickValues = [0, 0.25, 0.5, 0.75, 1].map((ratio) => maxValue * ratio);
  const tickIndexes = Array.from(
    new Set([0, Math.floor((values.length - 1) / 2), values.length - 1])
  );

  const nominalPath = buildLinePath(
    values.map((entry) => entry.nominal),
    xForIndex,
    yForValue
  );
  const realPath = buildLinePath(
    values.map((entry) => entry.real),
    xForIndex,
    yForValue
  );

  lineChartNode.innerHTML = `
    <desc>Nominal and inflation-adjusted investment value from year 0 to year ${result.input.years}.</desc>
    ${tickValues
      .map(
        (tick) => `
      <line class="inv-chart-grid" x1="${padding.left}" y1="${yForValue(tick)}" x2="${width - padding.right}" y2="${yForValue(tick)}"></line>
      <text class="inv-chart-axis-text" x="${padding.left - 10}" y="${yForValue(tick) + 4}" text-anchor="end">${formatAxisCurrency(tick)}</text>
    `
      )
      .join('')}
    ${tickIndexes
      .map(
        (index) => `
      <text class="inv-chart-axis-text" x="${xForIndex(index)}" y="${height - 12}" text-anchor="middle">${result.chart.labels[index]}</text>
    `
      )
      .join('')}
    <text class="inv-chart-label" x="${padding.left}" y="16">Value</text>
    <text class="inv-chart-label" x="${width - padding.right}" y="${height - 12}" text-anchor="end">Years</text>
    <path class="inv-chart-path--nominal" d="${nominalPath}"></path>
    <path class="inv-chart-path--real" d="${realPath}"></path>
    ${values
      .map(
        (entry, index) => `
      <circle class="inv-chart-dot--nominal" cx="${xForIndex(index)}" cy="${yForValue(entry.nominal)}" r="4">
        <title>${result.chart.labels[index]} nominal ${formatCurrency(entry.nominal)}</title>
      </circle>
      <circle class="inv-chart-dot--real" cx="${xForIndex(index)}" cy="${yForValue(entry.real)}" r="4">
        <title>${result.chart.labels[index]} real ${formatCurrency(entry.real)}</title>
      </circle>
    `
      )
      .join('')}
  `;
}

function renderDonut(result) {
  if (!donutNodes.root || !result) {
    return;
  }

  const contributions = Math.max(result.main.totalContributions, 0);
  const growth = Math.max(result.main.totalGains, 0);
  const total = Math.max(contributions + growth, 1);
  const contributionShare = (contributions / total) * 100;
  const growthShare = (growth / total) * 100;

  donutNodes.root.style.setProperty('--inv-contribution-angle', `${contributionShare}%`);
  donutNodes.root.setAttribute(
    'aria-label',
    `Donut chart showing ${formatPercent(contributionShare, {
      maximumFractionDigits: 1,
    })} contributions and ${formatPercent(growthShare, {
      maximumFractionDigits: 1,
    })} growth`
  );
  donutNodes.value.textContent = formatPercent(growthShare, { maximumFractionDigits: 1 });
  donutNodes.contributions.textContent = formatCurrency(contributions);
  donutNodes.growth.textContent = formatCurrency(growth);
  donutNodes.note.textContent =
    growth > contributions
      ? 'Growth is doing more work than new cash in this projection.'
      : 'Deposits still provide most of the ending balance in this projection.';
}

function renderTable(result) {
  if (!tableBodyNode || !result) {
    return;
  }

  tableBodyNode.innerHTML = result.table
    .map(
      (row) => `
      <tr>
        <td>${row.year === 0 ? 'Start' : `Year ${row.year}`}</td>
        <td>${formatCurrency(row.cumulativeContributions)}</td>
        <td>${formatCurrency(row.simpleEndingValue)}</td>
        <td>${formatCurrency(row.compoundEndingValue)}</td>
        <td>${formatCurrency(row.realCompoundEndingValue)}</td>
        <td>${formatCurrency(row.compoundingUplift)}</td>
      </tr>
    `
    )
    .join('');
}

function updateText(node, value) {
  if (node) {
    node.textContent = value;
  }
}

function renderResult(result) {
  if (!result?.isValid) {
    updateText(resultValueNode, '—');
    updateText(assumptionNode, result?.errors?.join(' ') || 'Unable to calculate.');
    return;
  }

  updateText(resultValueNode, formatCurrency(result.main.endingValue));
  updateText(metricNodes.contributions, formatCurrency(result.main.totalContributions));
  updateText(metricNodes.gains, formatCurrency(result.main.totalGains));
  updateText(metricNodes.simple, formatCurrency(result.comparison.simpleEndingValue));
  updateText(metricNodes.compound, formatCurrency(result.comparison.compoundEndingValue));
  updateText(metricNodes.uplift, formatCurrency(result.comparison.compoundingUplift));
  updateText(metricNodes.real, formatCurrency(result.main.realValue));

  updateText(
    assumptionNode,
    `Assumes ${formatPercent(result.input.annualReturnRate)} annual growth with ${result.input.compoundingLabel.toLowerCase()} compounding over ${formatNumber(result.input.years)} years. Real value uses ${formatPercent(result.input.inflationRate)} inflation.`
  );

  updateText(snapshotNodes.initial, formatCurrency(result.input.initialInvestment));
  updateText(snapshotNodes.return, formatPercent(result.input.annualReturnRate));
  updateText(snapshotNodes.years, `${formatNumber(result.input.years)} years`);
  updateText(snapshotNodes.recurring, formatCurrency(result.input.recurringContribution));
  updateText(snapshotNodes.compounding, result.input.compoundingLabel);
  updateText(
    snapshotNodes.mode,
    result.comparison.activeMode === 'lump-sum-only'
      ? 'Lump sum only'
      : 'Include contributions'
  );

  updateText(
    modeBadgeNode,
    result.comparison.activeMode === 'lump-sum-only'
      ? 'Lump sum only'
      : 'Include contributions'
  );
  updateText(
    tableNoteNode,
    result.comparison.activeMode === 'lump-sum-only'
      ? 'This table compares the simple and compound paths using the same initial amount, rate, and years with no recurring deposits.'
      : 'This table compares the simple and compound paths using the same initial amount, rate, years, and recurring contributions.'
  );

  const explanationValues = {
    ending: formatCurrency(result.main.endingValue),
    contributions: formatCurrency(result.main.totalContributions),
    real: formatCurrency(result.main.realValue),
    initial: formatCurrency(result.input.initialInvestment),
    years: `${formatNumber(result.input.years)}`,
    return: formatPercent(result.input.annualReturnRate),
    compounding: result.input.compoundingLabel.toLowerCase(),
    simple: formatCurrency(result.comparison.simpleEndingValue),
    compound: formatCurrency(result.comparison.compoundEndingValue),
    uplift: formatCurrency(result.comparison.compoundingUplift),
    recurring: formatCurrency(result.input.recurringContribution),
  };

  Object.entries(explanationNodes).forEach(([key, node]) => {
    updateText(node, explanationValues[key]);
  });

  renderLineChart(result);
  renderDonut(result);
  renderTable(result);
}

function calculateAndRender() {
  const result = calculateInvestmentPlan(getInputState());
  renderResult(result);
  staleResultController?.markFresh();
  revealResultPanel({ resultPanel: previewPanel, focusTarget: resultValueNode });
}

function applyDefaults() {
  inputNodes.initialInvestment.value = String(defaults.initialInvestment);
  inputNodes.annualReturnRate.value = String(defaults.annualReturnRate);
  inputNodes.years.value = String(defaults.years);
  inputNodes.recurringContribution.value = String(defaults.recurringContribution);
  inputNodes.inflationRate.value = String(defaults.inflationRate);
  Object.keys(controlMeta).forEach((key) => {
    if (rangeNodes[key]) {
      rangeNodes[key].value = String(defaults[key]);
    }
    syncControlValue(key);
  });
  compoundingButtons?.setValue(defaults.compounding);
  comparisonModeButtons?.setValue(defaults.comparisonContributionMode);
}

function toggleAdvanced() {
  const isOpen = advancedToggle.getAttribute('aria-expanded') === 'true';
  advancedToggle.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
  advancedSection.classList.toggle('is-hidden', isOpen);
  advancedSection.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
}

staleResultController = createStaleResultController({
  resultPanel: previewPanel,
  staleTargets: [staleNote],
  getSignature: getCalculationSignature,
});

staleResultController.watchElements([
  ...Object.values(inputNodes),
  ...Object.values(rangeNodes).filter(Boolean),
]);

Object.keys(controlMeta).forEach((key) => {
  inputNodes[key]?.addEventListener('input', () => syncControlValue(key));
  rangeNodes[key]?.addEventListener('input', () => syncControlValue(key, 'range'));
});

calculateButton?.addEventListener('click', calculateAndRender);
resetButton?.addEventListener('click', () => {
  applyDefaults();
  calculateAndRender();
});
advancedToggle?.addEventListener('click', toggleAdvanced);

applyDefaults();
calculateAndRender();
