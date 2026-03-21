import { setPageMetadata, setupButtonGroup } from '../../../assets/js/core/ui.js';
import { formatNumber, formatPercent } from '../../../assets/js/core/format.js';
import {
  calculateInflationAdjustment,
  getAvailableCpiMonthRange,
  getLatestAvailableCpiMonth,
} from '../../../assets/js/core/inflation-utils.js';
import {
  createStaleResultController,
  revealResultPanel,
  wireRangeWithField,
} from '../shared/cluster-ux.js';

const CALCULATOR_FAQ_ENTRIES = [
  {
    question: 'What does this inflation calculator do?',
    answer:
      'It converts an amount from one U.S. CPI month into the equivalent value in another month so you can compare purchasing power directly.',
  },
  {
    question: 'What CPI series does it use?',
    answer: 'It uses the U.S. Bureau of Labor Statistics CPI-U series CUUR0000SA0.',
  },
  {
    question: 'What is a good inflation rate?',
    answer:
      'Many people view low and steady inflation as healthier than sharp price swings, but the exact target depends on the economy and policy goals.',
  },
  {
    question: 'Is inflation always bad?',
    answer:
      'Not always. Mild inflation can be normal in a growing economy, but high or unstable inflation makes budgeting and planning much harder.',
  },
  {
    question: 'How does inflation affect savings?',
    answer:
      'If your savings grow more slowly than prices rise, your money may buy less later even when the account balance looks higher.',
  },
  {
    question: 'Why does money lose value over time?',
    answer:
      'Money loses real value when the price of everyday goods and services rises faster than the return you earn or the income you receive.',
  },
  {
    question: 'What causes inflation?',
    answer:
      'Inflation can be driven by stronger demand, higher business costs, supply shortages, or more money circulating through the economy.',
  },
  {
    question: 'How is inflation measured?',
    answer:
      'It is commonly tracked using CPI, which follows the cost of a basket of everyday goods and services over time.',
  },
  {
    question: 'Why compare low, medium, and high inflation scenarios?',
    answer:
      'Scenario comparisons help you see how quickly a small pricing difference can turn into a much larger budget gap over several years.',
  },
  {
    question: 'Can inflation be controlled?',
    answer:
      'Central banks and governments try to influence inflation, but it can still be affected by shocks, supply problems, and wider economic conditions.',
  },
];

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
          'Educational inflation scenario analysis',
          'Value of money projection charts',
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
        mainEntity: CALCULATOR_FAQ_ENTRIES.map((entry) => ({
          '@type': 'Question',
          name: entry.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: entry.answer,
          },
        })),
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

export const INFLATION_EDU_PRESETS = [
  {
    id: 'low',
    label: 'Low inflation',
    shortLabel: 'Low 2%',
    rate: 0.02,
    tone: 'A calmer environment where prices rise gradually.',
    color: '#2f7d57',
  },
  {
    id: 'medium',
    label: 'Medium inflation',
    shortLabel: 'Medium 5%',
    rate: 0.05,
    tone: 'A noticeable squeeze that steadily changes everyday budgets.',
    color: '#c27b12',
  },
  {
    id: 'high',
    label: 'High inflation',
    shortLabel: 'High 8%',
    rate: 0.08,
    tone: 'A fast-rising price environment where cash loses ground quickly.',
    color: '#b74a4a',
  },
];

export function normalizeScenarioHorizonYears(monthSpan) {
  const parsedMonthSpan = Number(monthSpan);
  if (!Number.isFinite(parsedMonthSpan) || parsedMonthSpan <= 0) {
    return 1;
  }
  return Math.max(1, parsedMonthSpan / 12);
}

export function buildProjectionTimeline({ amount, years, rate }) {
  const safeAmount = Number(amount);
  const safeYears = normalizeScenarioHorizonYears(years * 12);
  const safeRate = Number(rate);

  if (!Number.isFinite(safeAmount) || safeAmount <= 0 || !Number.isFinite(safeRate)) {
    return [];
  }

  const checkpoints = new Set([0, safeYears]);
  const wholeYears = Math.floor(safeYears);

  for (let year = 1; year <= wholeYears; year += 1) {
    checkpoints.add(year);
  }

  return Array.from(checkpoints)
    .sort((left, right) => left - right)
    .map((year) => {
      const requiredValue = safeAmount * Math.pow(1 + safeRate, year);
      const lossAmount = requiredValue - safeAmount;
      const impactRate = requiredValue > 0 ? lossAmount / requiredValue : 0;

      return {
        year,
        requiredValue,
        lossAmount,
        impactRate,
      };
    });
}

export function buildInflationScenarioRows({
  amount,
  monthSpan,
  presets = INFLATION_EDU_PRESETS,
} = {}) {
  const normalizedAmount = Number(amount);
  const horizonYears = normalizeScenarioHorizonYears(monthSpan);

  return presets.map((preset) => {
    const timeline = buildProjectionTimeline({
      amount: normalizedAmount,
      years: horizonYears,
      rate: preset.rate,
    });
    const finalPoint = timeline[timeline.length - 1] ?? {
      requiredValue: normalizedAmount,
      lossAmount: 0,
      impactRate: 0,
    };

    return {
      ...preset,
      horizonYears,
      timeline,
      futureValue: finalPoint.requiredValue,
      purchasingPowerLoss: finalPoint.lossAmount,
      impactRate: finalPoint.requiredValue > 0 ? finalPoint.lossAmount / finalPoint.requiredValue : 0,
    };
  });
}

export function buildInflationChartModel({
  amount,
  monthSpan,
  activePresetId = 'medium',
} = {}) {
  const scenarioRows = buildInflationScenarioRows({ amount, monthSpan });
  const activePreset =
    scenarioRows.find((row) => row.id === activePresetId) ??
    scenarioRows.find((row) => row.id === 'medium') ??
    scenarioRows[0] ??
    null;

  return {
    horizonYears: normalizeScenarioHorizonYears(monthSpan),
    scenarioRows,
    activePreset,
    valueLines: scenarioRows.map((row) => ({
      id: row.id,
      label: row.label,
      color: row.color,
      points: row.timeline.map((point) => ({
        x: point.year,
        y: point.requiredValue,
        label: `${row.label}, year ${formatYearValue(point.year)}: ${formatMoney(point.requiredValue)}`,
      })),
    })),
    impactPoints: activePreset
      ? activePreset.timeline.map((point) => ({
          x: point.year,
          y: point.lossAmount,
          label: `${activePreset.label}, year ${formatYearValue(point.year)}: ${formatMoney(point.lossAmount)} of purchasing power lost`,
        }))
      : [],
  };
}

const doc = typeof document !== 'undefined' ? document : null;

const amountInput = doc?.querySelector('#inf-amount') ?? null;
const amountField = doc?.querySelector('#inf-amount-field') ?? null;
const amountDisplay = doc?.querySelector('#inf-amount-display') ?? null;
const fromMonthInput = doc?.querySelector('#inf-from-month') ?? null;
const toMonthInput = doc?.querySelector('#inf-to-month') ?? null;
const calculateButton = doc?.querySelector('#inf-calc') ?? null;
const resultOutput = doc?.querySelector('#inf-result') ?? null;
const previewPanel = doc?.querySelector('#inf-preview') ?? null;
const staleNote = doc?.querySelector('#inf-stale-note') ?? null;

const metricChange = doc?.querySelector('[data-inf="metric-change"]') ?? null;
const metricCumulative = doc?.querySelector('[data-inf="metric-cumulative"]') ?? null;
const metricAnnualized = doc?.querySelector('[data-inf="metric-annualized"]') ?? null;
const metricFactor = doc?.querySelector('[data-inf="metric-factor"]') ?? null;

const snapshotAmount = doc?.querySelector('[data-inf="snap-amount"]') ?? null;
const snapshotFrom = doc?.querySelector('[data-inf="snap-from"]') ?? null;
const snapshotTo = doc?.querySelector('[data-inf="snap-to"]') ?? null;
const snapshotStartCpi = doc?.querySelector('[data-inf="snap-start-cpi"]') ?? null;
const snapshotEndCpi = doc?.querySelector('[data-inf="snap-end-cpi"]') ?? null;
const snapshotMonths = doc?.querySelector('[data-inf="snap-months"]') ?? null;
const snapshotEquivalent = doc?.querySelector('[data-inf="snap-equivalent"]') ?? null;

const resultPlainTargets = doc?.querySelectorAll('[data-inf="result-plain"]') ?? null;
const resultBudgetTargets = doc?.querySelectorAll('[data-inf="result-budget"]') ?? null;
const resultGapTargets = doc?.querySelectorAll('[data-inf="result-gap"]') ?? null;
const resultSpanTargets = doc?.querySelectorAll('[data-inf="result-span"]') ?? null;
const scenarioHorizonTargets = doc?.querySelectorAll('[data-inf="scenario-horizon"]') ?? null;

const valueTargets = doc
  ? {
      amount: doc.querySelectorAll('[data-inf="amount"]'),
      equivalent: doc.querySelectorAll('[data-inf="equivalent"]'),
      fromLabel: doc.querySelectorAll('[data-inf="from-label"]'),
      toLabel: doc.querySelectorAll('[data-inf="to-label"]'),
      startCpi: doc.querySelectorAll('[data-inf="start-cpi"]'),
      endCpi: doc.querySelectorAll('[data-inf="end-cpi"]'),
      absoluteChange: doc.querySelectorAll('[data-inf="absolute-change"]'),
      cumulativeRate: doc.querySelectorAll('[data-inf="cumulative-rate"]'),
      annualizedRate: doc.querySelectorAll('[data-inf="annualized-rate"]'),
      monthSpan: doc.querySelectorAll('[data-inf="month-span"]'),
    }
  : null;

const scenarioSummary = doc?.querySelector('#inf-scenario-summary') ?? null;
const scenarioBody = doc?.querySelector('#inf-scenario-body') ?? null;
const valueChart = doc?.querySelector('#inf-value-chart') ?? null;
const impactChart = doc?.querySelector('#inf-impact-chart') ?? null;
const chartLegend = doc?.querySelector('#inf-chart-legend') ?? null;
const chartSummary = doc?.querySelector('#inf-chart-summary') ?? null;
const impactSummary = doc?.querySelector('#inf-impact-summary') ?? null;
const chartPresetGroup = doc?.querySelector('[data-button-group="inf-chart-preset"]') ?? null;

let lastSuccessfulOutput = null;
let activeChartPreset = 'medium';

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

function formatYearValue(year) {
  const decimals = Number.isInteger(year) ? 0 : 1;
  return formatNumber(year, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function formatScenarioHorizon(years) {
  return `${formatYearValue(years)} ${years === 1 ? 'year' : 'years'}`;
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

function formatCompactMoney(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

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

function buildChartSvg({
  width = 680,
  height = 280,
  lines = [],
  activeId = null,
  yTickFormatter,
  emptyMessage,
  areaPoints = null,
  areaColor = 'rgba(31, 95, 135, 0.18)',
}) {
  const padding = {
    top: 18,
    right: 24,
    bottom: 42,
    left: 56,
  };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  if (!lines.length || !chartWidth || !chartHeight) {
    return `<text x="${width / 2}" y="${height / 2}" text-anchor="middle" fill="#6a8192" font-size="16">${emptyMessage}</text>`;
  }

  const allPoints = lines.flatMap((line) => line.points);
  const maxX = Math.max(...allPoints.map((point) => point.x), 1);
  const maxY = Math.max(...allPoints.map((point) => point.y), 1);
  const yTicks = 4;
  const xTicks = 4;

  const scaleX = (value) => padding.left + (value / maxX) * chartWidth;
  const scaleY = (value) => padding.top + chartHeight - (value / maxY) * chartHeight;

  const gridLines = [];
  const yLabels = [];
  for (let index = 0; index <= yTicks; index += 1) {
    const ratio = index / yTicks;
    const yValue = maxY * ratio;
    const y = scaleY(yValue);
    gridLines.push(
      `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="rgba(31, 95, 135, 0.12)" stroke-width="1" />`
    );
    yLabels.push(
      `<text x="${padding.left - 10}" y="${y + 4}" text-anchor="end" fill="#6b8090" font-size="11">${yTickFormatter(
        yValue
      )}</text>`
    );
  }

  const xLabels = [];
  for (let index = 0; index <= xTicks; index += 1) {
    const ratio = index / xTicks;
    const xValue = maxX * ratio;
    const x = scaleX(xValue);
    xLabels.push(
      `<text x="${x}" y="${height - 12}" text-anchor="middle" fill="#6b8090" font-size="11">${formatYearValue(
        xValue
      )}y</text>`
    );
  }

  const areaMarkup = areaPoints?.length
    ? (() => {
        const polygonPoints = [
          `${scaleX(areaPoints[0].x)},${scaleY(0)}`,
          ...areaPoints.map((point) => `${scaleX(point.x)},${scaleY(point.y)}`),
          `${scaleX(areaPoints[areaPoints.length - 1].x)},${scaleY(0)}`,
        ].join(' ');
        return `<polygon points="${polygonPoints}" fill="${areaColor}" />`;
      })()
    : '';

  const lineMarkup = lines
    .map((line) => {
      const strokeWidth = line.id === activeId ? 4 : 2.5;
      const opacity = activeId && line.id !== activeId ? 0.45 : 1;
      const polyline = line.points.map((point) => `${scaleX(point.x)},${scaleY(point.y)}`).join(' ');
      const circles = line.points
        .map((point) => {
          const radius = line.id === activeId ? 4 : 3;
          return `<circle cx="${scaleX(point.x)}" cy="${scaleY(point.y)}" r="${radius}" fill="${line.color}" opacity="${opacity}" tabindex="0"><title>${point.label}</title></circle>`;
        })
        .join('');

      return `<polyline points="${polyline}" fill="none" stroke="${line.color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}" />${circles}`;
    })
    .join('');

  return `${gridLines.join('')}${yLabels.join('')}${xLabels.join('')}${areaMarkup}${lineMarkup}`;
}

function renderScenarioSummary(model) {
  if (!scenarioSummary || !scenarioBody) {
    return;
  }

  scenarioSummary.innerHTML = model.scenarioRows
    .map(
      (row) => `
        <article class="inf-scenario-card${row.id === model.activePreset?.id ? ' is-active' : ''}">
          <div class="inf-scenario-card-head">
            <span class="inf-scenario-rate">${formatPercent(row.rate * 100, { maximumFractionDigits: 0 })}</span>
            <strong>${row.label}</strong>
          </div>
          <p class="inf-scenario-card-value">${formatMoney(row.futureValue)}</p>
          <p class="inf-scenario-card-copy">${row.tone}</p>
        </article>
      `
    )
    .join('');

  scenarioBody.innerHTML = model.scenarioRows
    .map(
      (row) => `
        <tr>
          <td>${row.label}</td>
          <td>${formatPercent(row.rate * 100, { maximumFractionDigits: 0 })}</td>
          <td>${formatMoney(row.futureValue)}</td>
          <td>${formatMoney(row.purchasingPowerLoss)}</td>
          <td>${formatPercent(row.impactRate * 100, { maximumFractionDigits: 1 })}</td>
        </tr>
      `
    )
    .join('');
}

function renderCharts(model) {
  if (!valueChart || !impactChart || !chartLegend || !chartSummary || !impactSummary) {
    return;
  }

  chartLegend.innerHTML = model.scenarioRows
    .map(
      (row) => `
        <span class="inf-chart-legend-item${row.id === model.activePreset?.id ? ' is-active' : ''}">
          <span class="inf-chart-legend-swatch" style="background:${row.color}"></span>
          ${row.shortLabel}
        </span>
      `
    )
    .join('');

  chartSummary.textContent = model.activePreset
    ? `Focused on ${model.activePreset.shortLabel}. Over ${formatScenarioHorizon(
        model.horizonYears
      )}, the same ${formatMoney(lastSuccessfulOutput?.amount ?? 0)} would need to become ${formatMoney(
        model.activePreset.futureValue
      )} to keep pace.`
    : 'Scenario summaries update after you calculate.';

  impactSummary.textContent = model.activePreset
    ? `${model.activePreset.shortLabel} creates a purchasing-power gap of ${formatMoney(
        model.activePreset.purchasingPowerLoss
      )} over ${formatScenarioHorizon(model.horizonYears)} if cash stays flat.`
    : 'Select a scenario to focus the chart.';

  valueChart.innerHTML = buildChartSvg({
    lines: model.valueLines,
    activeId: model.activePreset?.id ?? null,
    yTickFormatter: formatCompactMoney,
    emptyMessage: 'Run a valid calculation to render scenario projections.',
  });

  impactChart.innerHTML = buildChartSvg({
    lines: model.activePreset
      ? [
          {
            id: model.activePreset.id,
            color: model.activePreset.color,
            points: model.impactPoints,
          },
        ]
      : [],
    activeId: model.activePreset?.id ?? null,
    yTickFormatter: formatCompactMoney,
    emptyMessage: 'Run a valid calculation to render the impact curve.',
    areaPoints: model.impactPoints,
    areaColor: model.activePreset ? `${model.activePreset.color}26` : 'rgba(31, 95, 135, 0.18)',
  });
}

function updateEducation(output) {
  const scenarioModel = buildInflationChartModel({
    amount: output.amount,
    monthSpan: output.monthSpan,
    activePresetId: activeChartPreset,
  });

  setTargets(resultBudgetTargets, formatMoney(output.equivalentValue));
  setTargets(resultGapTargets, formatSignedMoney(output.absoluteChange));
  setTargets(resultSpanTargets, formatMonthSpan(output.monthSpan));
  setTargets(scenarioHorizonTargets, formatScenarioHorizon(scenarioModel.horizonYears));

  setTargets(
    resultPlainTargets,
    `Your ${formatMoney(output.amount)} from ${output.fromLabel} would need to be about ${formatMoney(
      output.equivalentValue
    )} in ${output.toLabel} to buy a similar basket of everyday goods.`
  );

  renderScenarioSummary(scenarioModel);
  renderCharts(scenarioModel);
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
  updateEducation(output);
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
    globalThis.setTimeout(() => valueNode.classList.remove('is-updated'), 420);
  }

  if (metricChange) {
    metricChange.textContent = absoluteChange;
  }
  if (metricCumulative) {
    metricCumulative.textContent = cumulativeRate;
  }
  if (metricAnnualized) {
    metricAnnualized.textContent = annualizedRate;
  }
  if (metricFactor) {
    metricFactor.textContent = factor;
  }

  if (snapshotAmount) {
    snapshotAmount.textContent = formatMoney(output.amount);
  }
  if (snapshotFrom) {
    snapshotFrom.textContent = output.fromLabel;
  }
  if (snapshotTo) {
    snapshotTo.textContent = output.toLabel;
  }
  if (snapshotStartCpi) {
    snapshotStartCpi.textContent = startCpi;
  }
  if (snapshotEndCpi) {
    snapshotEndCpi.textContent = endCpi;
  }
  if (snapshotMonths) {
    snapshotMonths.textContent = span;
  }
  if (snapshotEquivalent) {
    snapshotEquivalent.textContent = equivalent;
  }

  lastSuccessfulOutput = output;
  updateExplanation(output);
}

function setError(message) {
  if (resultOutput) {
    resultOutput.innerHTML = `<span class="mtg-result-value inf-error">${message}</span>`;
  }
  clearDetailTargets();
}

function getCalculationSignature() {
  return [
    amountInput?.value ?? '',
    amountField?.value ?? '',
    fromMonthInput?.value ?? '',
    toMonthInput?.value ?? '',
  ].join('|');
}

function calculate() {
  const output = calculateInflationAdjustment({
    amount: amountInput?.value,
    fromMonth: fromMonthInput?.value,
    toMonth: toMonthInput?.value,
  });

  if (output.error) {
    setError(output.error);
    staleResultController?.markFresh();
    return;
  }

  renderOutput(output);
  staleResultController?.markFresh();
  if (previewPanel && resultOutput) {
    revealResultPanel({
      resultPanel: previewPanel,
      focusTarget: resultOutput,
    });
  }
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

const amountBinding =
  amountInput && amountField
    ? wireRangeWithField({
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
      })
    : null;

const staleResultController =
  previewPanel && staleNote
    ? createStaleResultController({
        resultPanel: previewPanel,
        staleTargets: [staleNote],
        getSignature: getCalculationSignature,
      })
    : null;

const chartPresetButtons = chartPresetGroup
  ? setupButtonGroup(chartPresetGroup, {
      defaultValue: 'medium',
      onChange: (value) => {
        activeChartPreset = value;
        if (lastSuccessfulOutput) {
          updateEducation(lastSuccessfulOutput);
        }
      },
    })
  : null;

if (chartPresetButtons) {
  activeChartPreset = chartPresetButtons.getValue() ?? 'medium';
}

if (doc) {
  initializeMonthBounds();
  amountBinding?.syncFromRange();

  if (calculateButton) {
    calculateButton.addEventListener('click', calculate);
  }

  staleResultController?.watchElements(
    [amountInput, amountField, fromMonthInput, toMonthInput].filter(Boolean),
    ['input', 'change']
  );

  [fromMonthInput, toMonthInput].filter(Boolean).forEach((input) => {
    input.addEventListener('blur', () => {
      staleResultController?.sync();
    });
  });

  calculate();
}
