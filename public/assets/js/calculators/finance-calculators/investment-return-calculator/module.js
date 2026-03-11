import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import { formatNumber } from '/assets/js/core/format.js';
import { calculateInvestmentReturn } from '/assets/js/core/time-value-utils.js';
import { getPaddedMinMax, sampleValues } from '/assets/js/core/graph-utils.js';

const initialInput = document.querySelector('#ir-initial');
const returnInput = document.querySelector('#ir-return');
const yearsInput = document.querySelector('#ir-years');
const contributionInput = document.querySelector('#ir-contribution');
const inflationInput = document.querySelector('#ir-inflation');
const taxInput = document.querySelector('#ir-tax');
const crashYearInput = document.querySelector('#ir-crash-year');
const crashDropInput = document.querySelector('#ir-crash-drop');

const resultOutput = document.querySelector('#ir-result');
const resultDetail = document.querySelector('#ir-result-detail');
const calculateButton = document.querySelector('#ir-calc');

const advancedToggleButton = document.querySelector('#ir-advanced-toggle');
const advancedSection = document.querySelector('#ir-advanced-section');
const variableRowsRoot = document.querySelector('#ir-variable-returns');
const eventsRowsRoot = document.querySelector('#ir-events-rows');
const addEventButton = document.querySelector('#ir-add-event');

const breakdownHead = document.querySelector('#ir-breakdown-head');
const breakdownBody = document.querySelector('#ir-breakdown-body');

const graphTitle = document.querySelector('#ir-graph-title');
const graphMain = document.querySelector('#ir-graph-main');
const graphSecondary = document.querySelector('#ir-graph-secondary');
const graphMainArea = document.querySelector('#ir-graph-main-area');
const graphSecondaryArea = document.querySelector('#ir-graph-secondary-area');
const graphBars = document.querySelector('#ir-graph-bars');
const graphGrid = document.querySelector('#ir-graph-grid');
const graphXTicks = document.querySelector('#ir-graph-x-ticks');
const graphYTicks = document.querySelector('#ir-graph-y-ticks');
const secondaryLegend = document.querySelector('#ir-secondary-legend');
const hasGraph = Boolean(graphTitle && graphMain && graphSecondary && graphBars && secondaryLegend);

const PLOT_BOUNDS = Object.freeze({
  minX: 10,
  maxX: 96,
  minY: 8,
  maxY: 84,
});

const snapNodes = {
  contributions: document.querySelector('[data-ir-snap="contributions"]'),
  profit: document.querySelector('[data-ir-snap="profit"]'),
  cagr: document.querySelector('[data-ir-snap="cagr"]'),
  'real-cagr': document.querySelector('[data-ir-snap="real-cagr"]'),
  tax: document.querySelector('[data-ir-snap="tax"]'),
  ear: document.querySelector('[data-ir-snap="ear"]'),
};

const explanationNodes = {
  'exp-initial': document.querySelector('[data-ir="exp-initial"]'),
  'exp-rate': document.querySelector('[data-ir="exp-rate"]'),
  'exp-years': document.querySelector('[data-ir="exp-years"]'),
  'exp-compounding': document.querySelector('[data-ir="exp-compounding"]'),
  'exp-contribution': document.querySelector('[data-ir="exp-contribution"]'),
  'exp-contrib-frequency': document.querySelector('[data-ir="exp-contrib-frequency"]'),
  'exp-contrib-timing': document.querySelector('[data-ir="exp-contrib-timing"]'),
  'exp-inflation': document.querySelector('[data-ir="exp-inflation"]'),
  'exp-tax-rate': document.querySelector('[data-ir="exp-tax-rate"]'),
  'exp-final-value': document.querySelector('[data-ir="exp-final-value"]'),
  'exp-total-contributions': document.querySelector('[data-ir="exp-total-contributions"]'),
  'exp-total-profit': document.querySelector('[data-ir="exp-total-profit"]'),
  'exp-total-tax': document.querySelector('[data-ir="exp-total-tax"]'),
  'exp-cagr': document.querySelector('[data-ir="exp-cagr"]'),
  'exp-real-cagr': document.querySelector('[data-ir="exp-real-cagr"]'),
  'exp-real-final': document.querySelector('[data-ir="exp-real-final"]'),
  'exp-ear': document.querySelector('[data-ir="exp-ear"]'),
  'exp-carryforward': document.querySelector('[data-ir="exp-carryforward"]'),
};

export const pageSchema = {
  calculatorFAQ: true,
  globalFAQ: false,
};

const CALCULATOR_FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How is investment return calculated here?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The model combines compound growth, recurring contributions, and optional tax and inflation adjustments.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I model both lump sum and regular deposits?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You can enter an initial amount and recurring contributions with monthly, quarterly, or annual frequency.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does CAGR mean?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'CAGR is the annualized growth rate implied by your starting amount and projected ending value.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does inflation affect results?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Inflation reduces purchasing power. Real output values show what the ending balance may be worth in today's terms.",
      },
    },
    {
      '@type': 'Question',
      name: 'How is tax applied?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Tax is applied at year end to net positive gains after any carryforward losses from prior negative years.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does carryforward loss mean?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Negative annual gains are stored as losses and used to offset taxable gains in later years.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I input year-by-year return assumptions?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Advanced mode lets you set a specific return percentage for each year in the plan.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I simulate a market crash?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. You can apply a one-year percentage drop in a selected year to stress-test the projection.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why do monthly and annual views differ in shape?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Both show the same model outputs at different granularity, so month-level tables reveal intra-year movement.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are these projections guaranteed?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. This tool is for education and planning. Real market returns vary and can differ materially from assumptions.',
      },
    },
  ],
};

const metadata = {
  title: 'Investment Return Calculator | CAGR, Profit & Growth',
  description:
    'Estimate investment return, portfolio growth, profit, and CAGR using lump sums, contributions, inflation, and tax settings.',
  canonical: 'https://calchowmuch.com/finance-calculators/investment-return-calculator/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Investment Return Calculator | CAGR, Profit & Growth',
        url: 'https://calchowmuch.com/finance-calculators/investment-return-calculator/',
        description:
          'Estimate investment return, portfolio growth, profit, and CAGR using lump sums, contributions, inflation, and tax settings.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Investment Return Calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/finance-calculators/investment-return-calculator/',
        description:
          'Free investment return calculator with CAGR, tax, inflation, and contribution settings.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
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
            item: 'https://calchowmuch.com/finance-calculators/',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Investment Return Calculator',
            item: 'https://calchowmuch.com/finance-calculators/investment-return-calculator/',
          },
        ],
      },
    ],
  },
};

setPageMetadata(metadata);

const compoundingButtons = setupButtonGroup(document.querySelector('[data-button-group="ir-compounding"]'), {
  defaultValue: 'MONTHLY',
});
const contributionFrequencyButtons = setupButtonGroup(
  document.querySelector('[data-button-group="ir-contrib-frequency"]'),
  {
    defaultValue: 'MONTHLY',
  }
);
const contributionTimingButtons = setupButtonGroup(
  document.querySelector('[data-button-group="ir-contrib-timing"]'),
  {
    defaultValue: 'END_OF_PERIOD',
  }
);
const breakdownButtons = setupButtonGroup(document.querySelector('[data-button-group="ir-breakdown-mode"]'), {
  defaultValue: 'annual',
  onChange: () => {
    if (lastOutput) {
      renderBreakdown(lastOutput);
    }
  },
});
const graphModeGroup = document.querySelector('[data-button-group="ir-graph-mode"]');
const graphButtons = graphModeGroup
  ? setupButtonGroup(graphModeGroup, {
      defaultValue: 'growth',
      onChange: () => {
        if (lastOutput) {
          renderGraph(lastOutput);
        }
      },
    })
  : null;
const crashButtons = setupButtonGroup(document.querySelector('[data-button-group="ir-crash-enabled"]'), {
  defaultValue: 'off',
  onChange: () => {
    toggleCrashInputs();
  },
});

let lastOutput = null;
let advancedOpen = false;
let variableRowsTouched = false;
const DEFAULT_FORM_STATE = Object.freeze({
  initialInvestment: '10000',
  annualReturnRate: '6',
  durationYears: '20',
  regularContribution: '300',
  inflationRate: '2.5',
  taxRate: '10',
  compoundingFrequency: 'MONTHLY',
  contributionFrequency: 'MONTHLY',
  contributionTiming: 'END_OF_PERIOD',
  breakdownMode: 'annual',
  graphMode: 'growth',
  crashEnabled: 'off',
  crashYear: '5',
  crashDropPercent: '20',
});

function formatMoney(value) {
  if (!Number.isFinite(value)) {
    return '-';
  }
  return formatNumber(value, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatPercent(value) {
  if (!Number.isFinite(value)) {
    return '-';
  }
  return `${formatNumber(value, { maximumFractionDigits: 2 })}%`;
}

function formatCompactNumber(value) {
  if (!Number.isFinite(value)) {
    return '-';
  }
  const absolute = Math.abs(value);
  if (absolute >= 1_000_000) {
    return `${formatNumber(value / 1_000_000, { maximumFractionDigits: 1 })}M`;
  }
  if (absolute >= 1_000) {
    return `${formatNumber(value / 1_000, { maximumFractionDigits: 1 })}K`;
  }
  return formatNumber(value, { maximumFractionDigits: 0 });
}

function clampInteger(value, min, max) {
  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isFinite(parsed)) {
    return min;
  }
  return Math.min(max, Math.max(min, parsed));
}

function buildVariableRows() {
  if (!variableRowsRoot) {
    return;
  }

  const years = clampInteger(yearsInput?.value ?? 1, 1, 80);
  const baseRate = Number(returnInput?.value ?? 0);
  const current = Array.from(variableRowsRoot.querySelectorAll('input')).map((input) => Number(input.value));

  const fragment = document.createDocumentFragment();
  for (let index = 0; index < years; index += 1) {
    const row = document.createElement('div');
    row.className = 'ir-var-row';

    const label = document.createElement('label');
    label.textContent = `Year ${index + 1}`;
    label.setAttribute('for', `ir-var-rate-${index + 1}`);

    const input = document.createElement('input');
    input.type = 'number';
    input.id = `ir-var-rate-${index + 1}`;
    input.dataset.year = String(index + 1);
    input.step = '0.1';
    input.min = '-100';
    input.max = '100';
    input.inputMode = 'decimal';
    input.value = variableRowsTouched && Number.isFinite(current[index]) ? String(current[index]) : String(baseRate);
    input.addEventListener('input', () => {
      variableRowsTouched = true;
    });

    row.append(label, input);
    fragment.appendChild(row);
  }

  variableRowsRoot.replaceChildren(fragment);
}

function getEventTimingFromRow(row) {
  const active = row.querySelector('.ir-event-timing button.is-active');
  return active?.dataset.value ?? 'end';
}

function wireTimingButtons(group) {
  const buttons = Array.from(group.querySelectorAll('button[data-value]'));
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((entry) => {
        const isActive = entry === button;
        entry.classList.toggle('is-active', isActive);
        entry.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
    });
  });
}

function createEventRow(seed = {}) {
  const row = document.createElement('div');
  row.className = 'ir-event-row';
  row.innerHTML = `
    <input type="number" min="1" max="80" step="1" inputmode="numeric" placeholder="Year" value="${seed.year ?? ''}" data-ir-event-year />
    <input type="number" step="0.01" inputmode="decimal" placeholder="Amount (+/-)" value="${seed.amount ?? ''}" data-ir-event-amount />
    <div class="ir-event-timing" role="group" aria-label="Event timing">
      <button class="calculator-button secondary ${seed.timing === 'start' ? 'is-active' : ''}" type="button" data-value="start" aria-pressed="${seed.timing === 'start' ? 'true' : 'false'}">Start</button>
      <button class="calculator-button secondary ${seed.timing !== 'start' ? 'is-active' : ''}" type="button" data-value="end" aria-pressed="${seed.timing === 'start' ? 'false' : 'true'}">End</button>
    </div>
    <button class="calculator-button secondary" type="button" data-ir-remove-event>Remove</button>
  `;

  const timingGroup = row.querySelector('.ir-event-timing');
  if (timingGroup) {
    wireTimingButtons(timingGroup);
  }

  const removeButton = row.querySelector('[data-ir-remove-event]');
  removeButton?.addEventListener('click', () => {
    row.remove();
  });

  return row;
}

function collectVariableRates() {
  if (!advancedOpen || !variableRowsRoot) {
    return undefined;
  }
  return Array.from(variableRowsRoot.querySelectorAll('input')).map((input) => Number(input.value));
}

function collectEvents() {
  if (!advancedOpen || !eventsRowsRoot) {
    return [];
  }
  return Array.from(eventsRowsRoot.querySelectorAll('.ir-event-row'))
    .map((row) => {
      const year = Number(row.querySelector('[data-ir-event-year]')?.value);
      const amount = Number(row.querySelector('[data-ir-event-amount]')?.value);
      const timing = getEventTimingFromRow(row);
      return {
        year,
        amount,
        timing: timing === 'start' ? 'START_OF_YEAR' : 'END_OF_YEAR',
      };
    })
    .filter((event) => Number.isFinite(event.year) && Number.isFinite(event.amount));
}

function collectInput() {
  return {
    initialInvestment: Number(initialInput?.value),
    annualReturnRate: Number(returnInput?.value),
    durationYears: clampInteger(yearsInput?.value ?? 1, 1, 80),
    compoundingFrequency: compoundingButtons?.getValue() ?? 'MONTHLY',
    regularContribution: Number(contributionInput?.value ?? 0),
    contributionFrequency: contributionFrequencyButtons?.getValue() ?? 'MONTHLY',
    contributionTiming: contributionTimingButtons?.getValue() ?? 'END_OF_PERIOD',
    inflationRate: Number(inflationInput?.value ?? 0),
    taxRate: Number(taxInput?.value ?? 0),
    precision: 2,
    variableAnnualReturns: collectVariableRates(),
    oneTimeEvents: collectEvents(),
    crashSimulation: {
      enabled: (crashButtons?.getValue() ?? 'off') === 'on' && advancedOpen,
      year: Number(crashYearInput?.value ?? 1),
      dropPercent: Number(crashDropInput?.value ?? 20),
    },
  };
}

function setText(node, value) {
  if (!node) {
    return;
  }
  node.textContent = value;
}

function renderBreakdown(output) {
  if (!breakdownHead || !breakdownBody) {
    return;
  }

  const mode = breakdownButtons?.getValue() ?? 'annual';
  if (mode === 'monthly') {
    breakdownHead.innerHTML = '<th>Month</th><th>Start</th><th>Contributions</th><th>Interest</th><th>Tax</th><th>End</th>';
    breakdownBody.innerHTML = output.monthlyBreakdown
      .map(
        (row) => `<tr>
          <td>${row.month}</td>
          <td>${formatMoney(row.startingBalance)}</td>
          <td>${formatMoney(row.contributions)}</td>
          <td>${formatMoney(row.interestEarned)}</td>
          <td>${formatMoney(row.taxPaid)}</td>
          <td>${formatMoney(row.endingBalance)}</td>
        </tr>`
      )
      .join('');
    return;
  }

  breakdownHead.innerHTML = '<th>Year</th><th>Start</th><th>Contributions</th><th>Interest</th><th>Tax</th><th>End</th>';
  breakdownBody.innerHTML = output.yearlyBreakdown
    .map(
      (row) => `<tr>
        <td>${row.year}</td>
        <td>${formatMoney(row.startingBalance)}</td>
        <td>${formatMoney(row.contributions)}</td>
        <td>${formatMoney(row.interestEarned)}</td>
        <td>${formatMoney(row.taxPaid)}</td>
        <td>${formatMoney(row.endingBalance)}</td>
      </tr>`
    )
    .join('');
}

function buildPlotPoints(values, minValue, maxValue) {
  const safe = Array.isArray(values) && values.length ? values : [0, 0];
  const range = Math.max(1e-9, maxValue - minValue);
  const width = PLOT_BOUNDS.maxX - PLOT_BOUNDS.minX;
  const height = PLOT_BOUNDS.maxY - PLOT_BOUNDS.minY;
  const denominator = Math.max(1, safe.length - 1);

  return safe.map((value, index) => {
    const ratioX = index / denominator;
    const normalizedY = (value - minValue) / range;
    return {
      x: PLOT_BOUNDS.minX + ratioX * width,
      y: PLOT_BOUNDS.maxY - normalizedY * height,
    };
  });
}

function pointsToString(points) {
  return points.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(' ');
}

function areaPolygonString(points) {
  if (!points.length) {
    return '';
  }
  const first = points[0];
  const last = points[points.length - 1];
  const areaPoints = [
    { x: first.x, y: PLOT_BOUNDS.maxY },
    ...points,
    { x: last.x, y: PLOT_BOUNDS.maxY },
  ];
  return pointsToString(areaPoints);
}

function renderGraphAxes(minValue, maxValue, pointsCount) {
  if (!graphGrid || !graphXTicks || !graphYTicks) {
    return;
  }

  const ns = 'http://www.w3.org/2000/svg';
  const ySteps = 4;
  const xSteps = Math.max(2, Math.min(6, (pointsCount || 2) - 1));
  const yRange = Math.max(1, maxValue - minValue);

  const gridFragment = document.createDocumentFragment();
  const xTickFragment = document.createDocumentFragment();
  const yTickFragment = document.createDocumentFragment();

  for (let i = 0; i <= ySteps; i += 1) {
    const ratio = i / ySteps;
    const y = PLOT_BOUNDS.minY + ratio * (PLOT_BOUNDS.maxY - PLOT_BOUNDS.minY);

    const line = document.createElementNS(ns, 'line');
    line.setAttribute('x1', String(PLOT_BOUNDS.minX));
    line.setAttribute('x2', String(PLOT_BOUNDS.maxX));
    line.setAttribute('y1', String(y));
    line.setAttribute('y2', String(y));
    line.setAttribute('stroke', i === ySteps ? 'rgba(148, 163, 184, 0.6)' : 'rgba(148, 163, 184, 0.26)');
    line.setAttribute('stroke-width', i === ySteps ? '0.55' : '0.35');
    gridFragment.appendChild(line);

    const label = document.createElementNS(ns, 'text');
    label.setAttribute('x', '2');
    label.setAttribute('y', String(y + 1.25));
    label.setAttribute('font-size', '3');
    label.setAttribute('fill', 'rgba(219, 234, 254, 0.98)');
    label.textContent = formatCompactNumber(maxValue - ratio * yRange);
    yTickFragment.appendChild(label);
  }

  const xLabelMax = Math.max(1, pointsCount - 1);
  for (let i = 0; i <= xSteps; i += 1) {
    const ratio = xSteps === 0 ? 0 : i / xSteps;
    const x = PLOT_BOUNDS.minX + ratio * (PLOT_BOUNDS.maxX - PLOT_BOUNDS.minX);

    const tick = document.createElementNS(ns, 'line');
    tick.setAttribute('x1', String(x));
    tick.setAttribute('x2', String(x));
    tick.setAttribute('y1', String(PLOT_BOUNDS.maxY));
    tick.setAttribute('y2', String(PLOT_BOUNDS.maxY + 1.4));
    tick.setAttribute('stroke', 'rgba(148, 163, 184, 0.65)');
    tick.setAttribute('stroke-width', '0.42');
    xTickFragment.appendChild(tick);

    const label = document.createElementNS(ns, 'text');
    label.setAttribute('x', String(x - 1.3));
    label.setAttribute('y', '98');
    label.setAttribute('font-size', '2.9');
    label.setAttribute('fill', 'rgba(219, 234, 254, 0.98)');
    label.textContent = String(Math.round(xLabelMax * ratio));
    xTickFragment.appendChild(label);
  }

  const yAxis = document.createElementNS(ns, 'line');
  yAxis.setAttribute('x1', String(PLOT_BOUNDS.minX));
  yAxis.setAttribute('x2', String(PLOT_BOUNDS.minX));
  yAxis.setAttribute('y1', String(PLOT_BOUNDS.minY));
  yAxis.setAttribute('y2', String(PLOT_BOUNDS.maxY));
  yAxis.setAttribute('stroke', 'rgba(191, 219, 254, 0.7)');
  yAxis.setAttribute('stroke-width', '0.45');
  gridFragment.appendChild(yAxis);

  graphGrid.replaceChildren(gridFragment);
  graphXTicks.replaceChildren(xTickFragment);
  graphYTicks.replaceChildren(yTickFragment);
}

function renderGrowthGraph(output) {
  if (!hasGraph) {
    return;
  }
  const nominal = sampleValues(output.graph.nominalBalance, 60);
  const hasReal = output.graph.realBalance.some((value) => Number.isFinite(value));
  const real = hasReal
    ? sampleValues(output.graph.realBalance.map((value, index) => (Number.isFinite(value) ? value : output.graph.nominalBalance[index])), 60)
    : sampleValues(output.graph.principal, 60);
  const range = getPaddedMinMax([...nominal, ...real]);
  renderGraphAxes(range.min, range.max, nominal.length);

  const nominalPoints = buildPlotPoints(nominal, range.min, range.max);
  const realPoints = buildPlotPoints(real, range.min, range.max);

  graphMain.setAttribute('points', pointsToString(nominalPoints));
  graphSecondary.setAttribute('points', pointsToString(realPoints));
  graphMainArea?.setAttribute('points', areaPolygonString(nominalPoints));
  graphSecondaryArea?.setAttribute('points', areaPolygonString(realPoints));
  graphBars.replaceChildren();
  graphTitle.textContent = 'Portfolio Growth Curve';
  secondaryLegend.textContent = hasReal ? 'Inflation-Adjusted' : 'Cumulative Contributions';
}

function renderStackedGraph(output) {
  if (!hasGraph) {
    return;
  }
  const principal = sampleValues(output.graph.principal, 50);
  const returns = sampleValues(output.graph.returns, 50);
  const maxTotal = Math.max(
    1,
    ...principal.map((value, index) => Math.max(0, value) + Math.max(0, returns[index] ?? 0))
  );
  renderGraphAxes(0, maxTotal, principal.length);
  const step = (PLOT_BOUNDS.maxX - PLOT_BOUNDS.minX) / principal.length;
  const plotHeight = PLOT_BOUNDS.maxY - PLOT_BOUNDS.minY;
  const ns = 'http://www.w3.org/2000/svg';
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < principal.length; index += 1) {
    const x = PLOT_BOUNDS.minX + index * step + 0.1;
    const width = Math.max(0.65, step - 0.3);
    const p = Math.max(0, principal[index]);
    const r = Math.max(0, returns[index] ?? 0);

    const principalHeight = (p / maxTotal) * plotHeight;
    const returnsHeight = (r / maxTotal) * plotHeight;

    const principalBar = document.createElementNS(ns, 'rect');
    principalBar.setAttribute('x', String(x));
    principalBar.setAttribute('y', String(PLOT_BOUNDS.maxY - principalHeight));
    principalBar.setAttribute('width', String(width));
    principalBar.setAttribute('height', String(principalHeight));
    principalBar.setAttribute('fill', 'rgba(34, 211, 238, 0.78)');
    fragment.appendChild(principalBar);

    const returnsBar = document.createElementNS(ns, 'rect');
    returnsBar.setAttribute('x', String(x));
    returnsBar.setAttribute('y', String(PLOT_BOUNDS.maxY - principalHeight - returnsHeight));
    returnsBar.setAttribute('width', String(width));
    returnsBar.setAttribute('height', String(returnsHeight));
    returnsBar.setAttribute('fill', 'rgba(251, 191, 36, 0.88)');
    fragment.appendChild(returnsBar);
  }

  graphBars.replaceChildren(fragment);
  graphMain.setAttribute('points', '');
  graphSecondary.setAttribute('points', '');
  graphMainArea?.setAttribute('points', '');
  graphSecondaryArea?.setAttribute('points', '');
  graphTitle.textContent = 'Principal vs Returns (Stacked)';
  secondaryLegend.textContent = 'Returns (Profit Component)';
}

function renderGraph(output) {
  if (!hasGraph) {
    return;
  }
  const mode = graphButtons?.getValue() ?? 'growth';
  if (mode === 'stacked') {
    renderStackedGraph(output);
    return;
  }
  renderGrowthGraph(output);
}

function renderSummary(output, input) {
  setText(resultOutput, formatMoney(output.summary.finalValue));
  if (resultDetail) {
    resultDetail.innerHTML =
      `<p><strong>Total Contributions:</strong> ${formatMoney(output.summary.totalContributions)}</p>` +
      `<p><strong>Total Profit:</strong> ${formatMoney(output.summary.totalGain)}</p>` +
      `<p><strong>Nominal CAGR:</strong> ${formatPercent(output.summary.nominalCAGR)}</p>`;
  }

  setText(snapNodes.contributions, formatMoney(output.summary.totalContributions));
  setText(snapNodes.profit, formatMoney(output.summary.totalGain));
  setText(snapNodes.cagr, formatPercent(output.summary.nominalCAGR));
  setText(snapNodes['real-cagr'], formatPercent(output.summary.realCAGR));
  setText(snapNodes.tax, formatMoney(output.summary.totalTaxPaid));
  setText(snapNodes.ear, formatPercent(output.summary.effectiveAnnualRate));

  setText(explanationNodes['exp-initial'], formatMoney(input.initialInvestment));
  setText(explanationNodes['exp-rate'], formatPercent(input.annualReturnRate));
  setText(explanationNodes['exp-years'], `${input.durationYears} years`);
  setText(explanationNodes['exp-compounding'], input.compoundingFrequency);
  setText(explanationNodes['exp-contribution'], formatMoney(input.regularContribution));
  setText(explanationNodes['exp-contrib-frequency'], input.contributionFrequency);
  setText(explanationNodes['exp-contrib-timing'], input.contributionTiming === 'BEGINNING_OF_PERIOD' ? 'Beginning' : 'End');
  setText(explanationNodes['exp-inflation'], formatPercent(input.inflationRate));
  setText(explanationNodes['exp-tax-rate'], formatPercent(input.taxRate));

  setText(explanationNodes['exp-final-value'], formatMoney(output.summary.finalValue));
  setText(explanationNodes['exp-total-contributions'], formatMoney(output.summary.totalContributions));
  setText(explanationNodes['exp-total-profit'], formatMoney(output.summary.totalGain));
  setText(explanationNodes['exp-total-tax'], formatMoney(output.summary.totalTaxPaid));
  setText(explanationNodes['exp-cagr'], formatPercent(output.summary.nominalCAGR));
  setText(explanationNodes['exp-real-cagr'], formatPercent(output.summary.realCAGR));
  setText(explanationNodes['exp-real-final'], formatMoney(output.summary.realFinalValue));
  setText(explanationNodes['exp-ear'], formatPercent(output.summary.effectiveAnnualRate));
  setText(explanationNodes['exp-carryforward'], formatMoney(output.metadata.carryforwardLoss));
}

function renderValidationErrors(errors) {
  setText(resultOutput, errors[0] ?? 'Invalid input');
  if (resultDetail) {
    resultDetail.innerHTML = '';
  }
}

function calculateAndRender() {
  const input = collectInput();
  const output = calculateInvestmentReturn(input);
  if (!output?.isValid) {
    renderValidationErrors(output?.errors ?? ['Invalid input']);
    lastOutput = null;
    return;
  }

  lastOutput = output;
  renderSummary(output, input);
  renderBreakdown(output);
  renderGraph(output);
}

function toggleAdvancedMode() {
  advancedOpen = !advancedOpen;
  if (!advancedSection) {
    return;
  }
  advancedSection.classList.toggle('is-hidden', !advancedOpen);
  advancedToggleButton?.setAttribute('aria-expanded', advancedOpen ? 'true' : 'false');
  if (advancedToggleButton) {
    advancedToggleButton.textContent = advancedOpen ? 'Hide Advanced Mode' : 'Show Advanced Mode';
  }
  if (advancedOpen) {
    buildVariableRows();
    if (eventsRowsRoot && eventsRowsRoot.children.length === 0) {
      eventsRowsRoot.appendChild(createEventRow({ year: 5, amount: 1000, timing: 'end' }));
    }
  }
}

function toggleCrashInputs() {
  const enabled = (crashButtons?.getValue() ?? 'off') === 'on';
  if (crashYearInput) {
    crashYearInput.disabled = !enabled;
  }
  if (crashDropInput) {
    crashDropInput.disabled = !enabled;
  }
}

function applyDefaultFormState() {
  if (initialInput) {initialInput.value = DEFAULT_FORM_STATE.initialInvestment;}
  if (returnInput) {returnInput.value = DEFAULT_FORM_STATE.annualReturnRate;}
  if (yearsInput) {yearsInput.value = DEFAULT_FORM_STATE.durationYears;}
  if (contributionInput) {contributionInput.value = DEFAULT_FORM_STATE.regularContribution;}
  if (inflationInput) {inflationInput.value = DEFAULT_FORM_STATE.inflationRate;}
  if (taxInput) {taxInput.value = DEFAULT_FORM_STATE.taxRate;}
  if (crashYearInput) {crashYearInput.value = DEFAULT_FORM_STATE.crashYear;}
  if (crashDropInput) {crashDropInput.value = DEFAULT_FORM_STATE.crashDropPercent;}

  compoundingButtons?.setValue(DEFAULT_FORM_STATE.compoundingFrequency);
  contributionFrequencyButtons?.setValue(DEFAULT_FORM_STATE.contributionFrequency);
  contributionTimingButtons?.setValue(DEFAULT_FORM_STATE.contributionTiming);
  breakdownButtons?.setValue(DEFAULT_FORM_STATE.breakdownMode);
  graphButtons?.setValue(DEFAULT_FORM_STATE.graphMode);
  crashButtons?.setValue(DEFAULT_FORM_STATE.crashEnabled);

  advancedOpen = false;
  variableRowsTouched = false;
  advancedSection?.classList.add('is-hidden');
  advancedToggleButton?.setAttribute('aria-expanded', 'false');
  if (advancedToggleButton) {
    advancedToggleButton.textContent = 'Show Advanced Mode';
  }
  variableRowsRoot?.replaceChildren();
  eventsRowsRoot?.replaceChildren();
  toggleCrashInputs();
}

advancedToggleButton?.addEventListener('click', () => {
  toggleAdvancedMode();
});

addEventButton?.addEventListener('click', () => {
  if (!eventsRowsRoot) {
    return;
  }
  eventsRowsRoot.appendChild(createEventRow({ year: clampInteger(yearsInput?.value ?? 1, 1, 80), amount: 0 }));
});

[initialInput, returnInput, yearsInput, contributionInput, inflationInput, taxInput, crashYearInput, crashDropInput].forEach((input) => {
  input?.addEventListener('input', () => {
    if (input === yearsInput && !variableRowsTouched) {
      buildVariableRows();
    }
    if (input === returnInput && !variableRowsTouched) {
      buildVariableRows();
    }
  });
});

calculateButton?.addEventListener('click', () => {
  calculateAndRender();
});

applyDefaultFormState();
