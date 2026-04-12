import { setPageMetadata } from '/assets/js/core/ui.js';
import {
  buildDebtPayoffViewModel,
  DEFAULT_DEBTS,
  normalizeDebts,
} from './engine.js';

const FAQ_ENTITIES = [
  [
    'What does debt-free date mean on this page?',
    'It is the month when every debt in the current plan reaches zero using the chosen strategy, minimum payments, and extra amount.',
  ],
  [
    'Should I choose snowball or avalanche?',
    'Choose snowball when closing a balance quickly helps you stay motivated. Choose avalanche when lowering total interest matters most.',
  ],
  [
    'What if I only make minimum payments?',
    'Use the minimum payment calculator to isolate that scenario. This planner is built for routing one extra payment pool across multiple debts.',
  ],
  [
    'Can I use this if I only have one balance?',
    'Yes, but the single-card payoff calculator is usually cleaner when only one balance is involved.',
  ],
  [
    'Does debt type change the math?',
    'No in this version. Debt type is a label for readability only. The payoff engine uses balance, APR, minimum payment, and strategy order.',
  ],
  [
    'What does the goal-date option do?',
    'It estimates the monthly payment needed to finish by your chosen month using the selected strategy order.',
  ],
  [
    'Does the calculator include new spending?',
    'No. The model assumes you do not add new debt after the plan starts.',
  ],
  [
    'Can I compare debt payoff with consolidation?',
    'Yes. Use this page as the direct-payoff benchmark, then compare that result with a consolidation scenario.',
  ],
  [
    'Can a balance transfer beat avalanche?',
    'Sometimes. This calculator gives you the direct-payoff baseline so you can compare it with a lower-rate transfer option.',
  ],
  [
    'Why are there charts and a schedule table?',
    'The charts show the path and tradeoffs at a glance, while the table shows the full monthly or yearly mechanics behind the answer.',
  ],
];

export const pageSchema = {
  calculatorFAQ: true,
  globalFAQ: false,
};

setPageMetadata({
  title: 'Debt Payoff Calculator | Snowball, Avalanche, Payoff Date and Interest',
  description:
    'Build a multi-debt payoff plan with debt snowball or avalanche, compare interest and payoff date, and estimate the payment needed for a goal date.',
  canonical: 'https://calchowmuch.com/credit-card-calculators/debt-payoff-calculator/',
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Debt Payoff Calculator | Snowball, Avalanche, Payoff Date and Interest',
        url: 'https://calchowmuch.com/credit-card-calculators/debt-payoff-calculator/',
        description:
          'Build a multi-debt payoff plan with debt snowball or avalanche, compare interest and payoff date, and estimate the payment needed for a goal date.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Debt Payoff Calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
        url: 'https://calchowmuch.com/credit-card-calculators/debt-payoff-calculator/',
        description:
          'Multi-debt payoff planner with snowball and avalanche strategy comparison, payoff date, interest totals, charts, and goal-date mode.',
        browserRequirements: 'Requires JavaScript enabled',
        softwareVersion: '1.0',
        creator: {
          '@type': 'Organization',
          name: 'CalcHowMuch',
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
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
            name: 'Credit Card Calculators',
            item: 'https://calchowmuch.com/credit-card-calculators/',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Debt Payoff Calculator',
            item: 'https://calchowmuch.com/credit-card-calculators/debt-payoff-calculator/',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ_ENTITIES.map(([name, text]) => ({
          '@type': 'Question',
          name,
          acceptedAnswer: {
            '@type': 'Answer',
            text,
          },
        })),
      },
    ],
  },
  pageSchema,
});

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const compactCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
  notation: 'compact',
});

const numberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const modeButtons = Array.from(document.querySelectorAll('[data-mode]'));
const strategyButtons = Array.from(document.querySelectorAll('[data-strategy]'));
const chartButtons = Array.from(document.querySelectorAll('[data-series]'));
const tableButtons = Array.from(document.querySelectorAll('[data-table-view]'));
const modeFields = Array.from(document.querySelectorAll('[data-field-mode]'));

const extraPaymentInput = document.querySelector('#debt-payoff-extra-payment');
const targetDateInput = document.querySelector('#debt-payoff-target-date');
const modeNote = document.querySelector('#debt-payoff-mode-note');
const debtRows = document.querySelector('#debt-payoff-rows');
const addRowButton = document.querySelector('#debt-payoff-add-row');
const calculateButton = document.querySelector('#debt-payoff-calculate');
const resetButton = document.querySelector('#debt-payoff-reset');
const errorMessage = document.querySelector('#debt-payoff-error');

const kicker = document.querySelector('#debt-payoff-kicker');
const headline = document.querySelector('#debt-payoff-headline');
const summary = document.querySelector('#debt-payoff-summary');
const copyButton = document.querySelector('#debt-payoff-copy-summary');
const copyFeedback = document.querySelector('#debt-payoff-copy-feedback');
const kpiGrid = document.querySelector('#debt-payoff-kpis');
const goalBanner = document.querySelector('#debt-payoff-goal-banner');
const goalCopy = document.querySelector('#debt-payoff-goal-copy');
const deltas = document.querySelector('#debt-payoff-deltas');
const orderList = document.querySelector('#debt-payoff-order');
const lineChart = document.querySelector('#debt-payoff-line-chart');
const lineCaption = document.querySelector('#debt-payoff-line-caption');
const pieChart = document.querySelector('#debt-payoff-pie-chart');
const pieLegend = document.querySelector('#debt-payoff-pie-legend');
const pieCaption = document.querySelector('#debt-payoff-pie-caption');
const tableContext = document.querySelector('#debt-payoff-table-context');
const tableHead = document.querySelector('#debt-payoff-table-head');
const tableBody = document.querySelector('#debt-payoff-table-body');
const nextSteps = document.querySelector('#debt-payoff-next-steps');

const state = {
  mode: 'standard',
  strategy: 'snowball',
  chartSeries: 'chosen',
  tableView: 'monthly',
  debts: [],
  extraPayment: '120',
  targetDate: '',
  lastViewModel: null,
  lastCopySummary: '',
  copyTimer: null,
  rowSeed: 1,
};

function ensureTitle() {
  const title = document.querySelector('#calculator-title');
  if (title) {
    title.textContent = 'Debt Payoff Calculator';
  }
}

function formatCurrency(value) {
  return currencyFormatter.format(Number(value) || 0);
}

function formatNumber(value) {
  return numberFormatter.format(Number(value) || 0);
}

function formatCompactCurrency(value) {
  return compactCurrencyFormatter.format(Number(value) || 0);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function strategyLabel(strategy) {
  return strategy === 'snowball' ? 'Snowball' : 'Avalanche';
}

function debtCountText(count) {
  return `${count} ${count === 1 ? 'debt' : 'debts'}`;
}

function formatDateInputValue(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseDateInput(value) {
  if (!value) {
    return null;
  }
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) {
    return null;
  }
  const parsed = new Date(year, month - 1, day);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function buildDefaultTargetDate(baseDate = new Date()) {
  return new Date(baseDate.getFullYear() + 2, baseDate.getMonth() + 6, 1);
}

function cloneDefaultDebts() {
  return DEFAULT_DEBTS.map((debt, index) => ({
    ...debt,
    id: debt.id || `debt-${index + 1}`,
  }));
}

function createBlankDebt() {
  state.rowSeed += 1;
  return {
    id: `debt-${state.rowSeed}`,
    name: `Debt ${state.rowSeed}`,
    type: 'Debt',
    balance: '',
    apr: '',
    minimumPayment: '',
  };
}

function toggleHidden(node, hidden) {
  if (!node) {
    return;
  }
  node.classList.toggle('is-hidden', hidden);
  if (hidden) {
    node.setAttribute('hidden', '');
  } else {
    node.removeAttribute('hidden');
  }
}

function clearError() {
  errorMessage.textContent = '';
  toggleHidden(errorMessage, true);
}

function showError(message) {
  errorMessage.textContent = message;
  toggleHidden(errorMessage, false);
}

function showCopyFeedback() {
  toggleHidden(copyFeedback, false);
  window.clearTimeout(state.copyTimer);
  state.copyTimer = window.setTimeout(() => {
    toggleHidden(copyFeedback, true);
  }, 1600);
}

function updateModeNote() {
  modeNote.textContent =
    state.mode === 'goal-date'
      ? 'Use this when the real question is how much you would need to pay each month to finish by a deadline. Changes apply when you calculate again.'
      : 'Start with the extra amount you can add each month. Changes apply when you calculate again.';
}

function syncModeUi() {
  modeButtons.forEach((button) => {
    const active = button.dataset.mode === state.mode;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
  modeFields.forEach((field) => {
    const hidden = field.dataset.fieldMode !== state.mode;
    toggleHidden(field, hidden);
  });
  updateModeNote();
}

function syncStrategyUi() {
  strategyButtons.forEach((button) => {
    const active = button.dataset.strategy === state.strategy;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}

function syncChartUi() {
  chartButtons.forEach((button) => {
    const active = button.dataset.series === state.chartSeries;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}

function syncTableUi() {
  tableButtons.forEach((button) => {
    const active = button.dataset.tableView === state.tableView;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}

function syncInputs() {
  if (extraPaymentInput) {
    extraPaymentInput.value = state.extraPayment;
  }
  if (targetDateInput) {
    targetDateInput.value = state.targetDate;
  }
}

function renderDebtRows() {
  debtRows.innerHTML = '';

  if (!state.debts.length) {
    const empty = document.createElement('p');
    empty.className = 'dp-input-note';
    empty.textContent = 'Add at least one debt row before you calculate the plan.';
    debtRows.appendChild(empty);
    return;
  }

  const fieldConfigs = [
    { key: 'name', label: 'Debt name', type: 'text', maxLength: 48 },
    { key: 'balance', label: 'Balance', type: 'number', min: '0', step: '0.01', inputMode: 'decimal' },
    { key: 'minimumPayment', label: 'Minimum payment', type: 'number', min: '0', step: '0.01', inputMode: 'decimal' },
    { key: 'apr', label: 'APR (%)', type: 'number', min: '0', step: '0.01', inputMode: 'decimal' },
    { key: 'type', label: 'Debt type', type: 'text', maxLength: 28 },
  ];

  state.debts.forEach((debt, index) => {
    const row = document.createElement('article');
    row.className = 'dp-debt-row';

    const top = document.createElement('div');
    top.className = 'dp-debt-row-top';

    const title = document.createElement('p');
    title.className = 'dp-row-index';
    title.textContent = `Debt ${index + 1}`;
    top.appendChild(title);

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'dp-mini-btn';
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => {
      state.debts = state.debts.filter((entry) => entry.id !== debt.id);
      renderDebtRows();
    });
    top.appendChild(removeButton);
    row.appendChild(top);

    const grid = document.createElement('div');
    grid.className = 'dp-debt-grid';

    fieldConfigs.forEach((config) => {
      const label = document.createElement('label');
      label.className = 'dp-field-label';
      label.textContent = config.label;

      const input = document.createElement('input');
      input.className = 'dp-field';
      input.type = config.type;
      input.value = debt[config.key] ?? '';
      input.dataset.field = config.key;
      if (config.min) {
        input.min = config.min;
      }
      if (config.step) {
        input.step = config.step;
      }
      if (config.maxLength) {
        input.maxLength = config.maxLength;
      }
      if (config.inputMode) {
        input.inputMode = config.inputMode;
      }
      input.addEventListener('input', (event) => {
        debt[config.key] = event.currentTarget.value;
      });
      label.appendChild(input);
      grid.appendChild(label);
    });

    row.appendChild(grid);
    debtRows.appendChild(row);
  });
}

function readInputs() {
  const debts = normalizeDebts(state.debts);
  if (!debts.length) {
    showError('Add at least one debt with a balance before you calculate.');
    return null;
  }

  const baseDate = new Date();
  const extraPayment = Number(state.extraPayment || 0);
  const targetDate = parseDateInput(state.targetDate);

  if (state.mode === 'standard') {
    if (!Number.isFinite(extraPayment) || extraPayment < 0) {
      showError('Enter a valid extra monthly amount.');
      return null;
    }
  }

  if (state.mode === 'goal-date') {
    if (!targetDate) {
      showError('Choose the month when you want to be debt-free.');
      return null;
    }

    const targetMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    const currentMonth = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
    if (targetMonth < currentMonth) {
      showError('Choose a future month for the debt-free target.');
      return null;
    }
  }

  clearError();

  return {
    debts,
    extraPayment,
    strategy: state.strategy,
    mode: state.mode,
    targetDate,
    baseDate,
  };
}

function buildCopySummary(viewModel) {
  if (state.mode === 'goal-date' && viewModel.goal) {
    return `To be debt-free by ${viewModel.goal.targetDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}, you need about ${formatCurrency(viewModel.goal.totalMonthlyPayment)} a month. That is ${formatCurrency(viewModel.goal.extraPayment)} above your current minimum budget of ${formatCurrency(viewModel.chosen.minimumBudget)}.`;
  }

  const monthlyBudget = viewModel.chosen.minimumBudget + viewModel.chosen.extraBudget;
  return `You could be debt-free by ${viewModel.chosen.debtFreeLabel}. ${strategyLabel(state.strategy)} would clear ${debtCountText(viewModel.chosen.debts.length)} in ${viewModel.chosen.months} months at about ${formatCurrency(monthlyBudget)} a month.`;
}

function renderKpis(viewModel) {
  const cards =
    state.mode === 'goal-date' && viewModel.goal
      ? [
          {
            label: 'Current payoff',
            value: viewModel.chosen.debtFreeLabel,
            helper: `${strategyLabel(state.strategy)} plan`,
          },
          {
            label: 'Required payment',
            value: formatCurrency(viewModel.goal.totalMonthlyPayment),
            helper: `To finish by ${viewModel.goal.targetDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`,
          },
          {
            label: 'Extra needed',
            value: formatCurrency(viewModel.goal.extraPayment),
            helper: `Above ${formatCurrency(viewModel.chosen.minimumBudget)} minimums`,
          },
        ]
      : [
          {
            label: 'Payoff months',
            value: formatNumber(viewModel.chosen.months),
            helper: `${strategyLabel(state.strategy)} strategy`,
          },
          {
            label: 'Total interest',
            value: formatCurrency(viewModel.chosen.totalInterest),
            helper: 'All debts combined',
          },
          {
            label: 'Monthly budget',
            value: formatCurrency(viewModel.chosen.minimumBudget + viewModel.chosen.extraBudget),
            helper: `${formatCurrency(viewModel.chosen.minimumBudget)} min + ${formatCurrency(viewModel.chosen.extraBudget)} extra`,
          },
        ];

  kpiGrid.innerHTML = cards
    .map(
      (card) => `
        <article class="dp-kpi-card">
          <strong>${card.label}</strong>
          <div class="dp-kpi-value">${card.value}</div>
          <p>${card.helper}</p>
        </article>
      `
    )
    .join('');
}

function renderGoalBanner(viewModel) {
  if (state.mode !== 'goal-date' || !viewModel.goal) {
    toggleHidden(goalBanner, true);
    goalCopy.textContent = '';
    return;
  }

  toggleHidden(goalBanner, false);
  goalCopy.textContent = `With your current ${strategyLabel(state.strategy).toLowerCase()} plan you would finish in ${viewModel.chosen.debtFreeLabel}. To hit ${viewModel.goal.targetDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}, you need about ${formatCurrency(viewModel.goal.totalMonthlyPayment)} a month, which is ${formatCurrency(viewModel.goal.extraPayment)} above your current minimums.`;
}

function buildTimeDeltaCopy(comparison) {
  const label = `${comparison.alternateStrategyLabel} timeline`;
  if (comparison.timeDeltaMonths < 0) {
    return {
      label,
      value: `${Math.abs(comparison.timeDeltaMonths)} months sooner`,
      helper: `than your current ${strategyLabel(state.strategy).toLowerCase()} plan`,
    };
  }
  if (comparison.timeDeltaMonths > 0) {
    return {
      label,
      value: `${comparison.timeDeltaMonths} months longer`,
      helper: `than your current ${strategyLabel(state.strategy).toLowerCase()} plan`,
    };
  }
  return {
    label,
    value: 'About the same timeline',
    helper: `as your current ${strategyLabel(state.strategy).toLowerCase()} plan`,
  };
}

function buildInterestDeltaCopy(comparison) {
  const label = `${comparison.alternateStrategyLabel} interest`;
  if (comparison.interestDelta < 0) {
    return {
      label,
      value: `Saves about ${formatCurrency(Math.abs(comparison.interestDelta))}`,
      helper: 'in total interest',
    };
  }
  if (comparison.interestDelta > 0) {
    return {
      label,
      value: `Costs about ${formatCurrency(comparison.interestDelta)} more`,
      helper: 'in total interest',
    };
  }
  return {
    label,
    value: 'Costs about the same',
    helper: 'in total interest',
  };
}

function renderComparison(viewModel) {
  if (!viewModel.comparison) {
    deltas.innerHTML = '';
    return;
  }

  const cards = [buildTimeDeltaCopy(viewModel.comparison), buildInterestDeltaCopy(viewModel.comparison)];
  deltas.innerHTML = cards
    .map(
      (card) => `
        <article class="dp-delta-card">
          <strong>${card.label}</strong>
          <div class="dp-delta-value">${card.value}</div>
          <p>${card.helper}</p>
        </article>
      `
    )
    .join('');
}

function renderPayoffOrder(viewModel) {
  orderList.innerHTML = '';
  viewModel.planOrder.forEach((name) => {
    const item = document.createElement('li');
    item.textContent = name;
    orderList.appendChild(item);
  });
}

function renderNextSteps(viewModel) {
  nextSteps.innerHTML = viewModel.nextSteps
    .map((step) => `<a href="${step.href}">${step.label}</a>`)
    .join('');
}

function createSvgNode(name, attributes = {}) {
  const node = document.createElementNS('http://www.w3.org/2000/svg', name);
  Object.entries(attributes).forEach(([key, value]) => {
    node.setAttribute(key, String(value));
  });
  return node;
}

function buildUniqueTicks(values) {
  return Array.from(new Set(values)).sort((left, right) => left - right);
}

function renderLineChart(viewModel) {
  const seriesModel =
    state.chartSeries === 'alternate' && viewModel.alternate ? viewModel.alternate : viewModel.chosen;
  const width = 600;
  const height = 280;
  const padding = { top: 18, right: 18, bottom: 42, left: 60 };
  const maxBalance = Math.max(...seriesModel.series.map((point) => point.balance), 1);
  const yMax = maxBalance <= 1000 ? 1000 : Math.ceil(maxBalance / 1000) * 1000;
  const xMax = Math.max(seriesModel.series[seriesModel.series.length - 1]?.month || 0, 1);
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const x = (month) => padding.left + (month / xMax) * plotWidth;
  const y = (balance) => padding.top + plotHeight - (balance / yMax) * plotHeight;

  lineChart.innerHTML = '';
  lineChart.setAttribute(
    'aria-label',
    `${strategyLabel(seriesModel.strategy).toLowerCase()} debt balance line chart`
  );

  const yTicks = 5;
  for (let index = 0; index < yTicks; index += 1) {
    const value = (yMax / (yTicks - 1)) * index;
    const chartY = y(yMax - value);
    lineChart.appendChild(
      createSvgNode('line', {
        x1: padding.left,
        y1: chartY,
        x2: width - padding.right,
        y2: chartY,
        stroke: 'rgba(36, 45, 58, 0.12)',
        'stroke-width': 1,
      })
    );

    const label = createSvgNode('text', {
      x: padding.left - 10,
      y: chartY + 4,
      'text-anchor': 'end',
      fill: '#627282',
      'font-size': 12,
      'font-family': 'system-ui, sans-serif',
    });
    label.textContent = formatCompactCurrency(yMax - value);
    lineChart.appendChild(label);
  }

  const xTicks = buildUniqueTicks([0, Math.round(xMax / 3), Math.round((xMax * 2) / 3), xMax]);
  xTicks.forEach((tick) => {
    const chartX = x(tick);
    const label = createSvgNode('text', {
      x: chartX,
      y: height - 12,
      'text-anchor': tick === 0 ? 'start' : tick === xMax ? 'end' : 'middle',
      fill: '#627282',
      'font-size': 12,
      'font-family': 'system-ui, sans-serif',
    });
    label.textContent = tick === 0 ? 'Start' : `${tick} mo`;
    lineChart.appendChild(label);
  });

  const polyline = createSvgNode('polyline', {
    fill: 'none',
    stroke: seriesModel.strategy === 'snowball' ? '#1f5fbf' : '#146c54',
    'stroke-width': 4,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    points: seriesModel.series.map((point) => `${x(point.month)},${y(point.balance)}`).join(' '),
  });
  lineChart.appendChild(polyline);

  const ending = seriesModel.series[seriesModel.series.length - 1];
  lineChart.appendChild(
    createSvgNode('circle', {
      cx: x(ending.month),
      cy: y(ending.balance),
      r: 4,
      fill: seriesModel.strategy === 'snowball' ? '#1f5fbf' : '#146c54',
    })
  );

  if (state.chartSeries === 'alternate' && viewModel.alternate) {
    const timeCopy = buildTimeDeltaCopy(viewModel.comparison);
    lineCaption.textContent = `${strategyLabel(viewModel.alternate.strategy)} reaches a zero balance in ${viewModel.alternate.months} months. ${timeCopy.value}.`;
  } else {
    lineCaption.textContent = `${strategyLabel(viewModel.chosen.strategy)} takes the balance from ${formatCurrency(viewModel.chosen.totalPrincipal)} to zero in ${viewModel.chosen.months} months.`;
  }
}

function renderPieChart(viewModel) {
  const pie = viewModel.chosen.pie;
  const total = pie.principal + pie.interest || 1;
  const principalPct = Math.round((pie.principal / total) * 100);
  const interestPct = 100 - principalPct;

  // SVG donut
  const r = 80;
  const circumference = 2 * Math.PI * r;
  const principalLen = (principalPct / 100) * circumference;
  const interestLen = circumference - principalLen;

  const segments = [
    { label: 'Principal', pct: principalPct, value: formatCurrency(pie.principal), color: '#2563eb', len: principalLen, offset: 0 },
    { label: 'Interest', pct: interestPct, value: formatCurrency(pie.interest), color: '#bfdbfe', len: interestLen, offset: -principalLen },
  ];

  pieChart.innerHTML = segments
    .map(
      (s) => `<circle class="dp-donut-segment" cx="100" cy="100" r="${r}"
        stroke="${s.color}" stroke-dasharray="${s.len} ${circumference - s.len}"
        stroke-dashoffset="${s.offset}" data-label="${s.label}" data-pct="${s.pct}%" data-value="${s.value}" />`
    )
    .join('');

  // Center label
  pieCaption.innerHTML = `<span class="dp-donut-center-pct">${principalPct}%</span><span class="dp-donut-center-label">principal</span>`;

  // Hover interactions
  const tooltip = document.querySelector('#debt-payoff-pie-tooltip');
  pieChart.querySelectorAll('.dp-donut-segment').forEach((seg) => {
    seg.addEventListener('mouseenter', () => {
      tooltip.textContent = `${seg.dataset.label}: ${seg.dataset.value} (${seg.dataset.pct})`;
      tooltip.hidden = false;
      tooltip.classList.remove('is-hidden');
      seg.style.opacity = '0.8';
    });
    seg.addEventListener('mouseleave', () => {
      tooltip.hidden = true;
      tooltip.classList.add('is-hidden');
      seg.style.opacity = '';
    });
  });

  // Legend
  pieLegend.innerHTML = segments
    .map(
      (s) => `
        <div class="dp-pie-item">
          <span class="dp-pie-swatch" style="background:${s.color}"></span>
          <span>${s.label}</span>
          <strong>${s.pct}%</strong>
          <span class="dp-pie-value">${s.value}</span>
        </div>
      `
    )
    .join('');
}

function renderTable(viewModel) {
  if (state.tableView === 'yearly') {
    tableHead.innerHTML = `
      <tr>
        <th scope="col">Year</th>
        <th scope="col" class="num">Payment</th>
        <th scope="col" class="num">Principal</th>
        <th scope="col" class="num">Interest</th>
        <th scope="col" class="num">Ending balance</th>
      </tr>
    `;
    tableBody.innerHTML = viewModel.chosen.yearly
      .map(
        (row) => `
          <tr>
            <td>${row.year}</td>
            <td class="num">${formatCurrency(row.payment)}</td>
            <td class="num">${formatCurrency(row.principal)}</td>
            <td class="num">${formatCurrency(row.interest)}</td>
            <td class="num">${formatCurrency(row.endingBalance)}</td>
          </tr>
        `
      )
      .join('');
    tableContext.textContent = `Showing the full yearly roll-up across ${viewModel.chosen.yearly.length} ${viewModel.chosen.yearly.length === 1 ? 'year' : 'years'}.`;
    return;
  }

  tableHead.innerHTML = `
    <tr>
      <th scope="col">Month</th>
      <th scope="col" class="num">Starting balance</th>
      <th scope="col" class="num">Payment</th>
      <th scope="col" class="num">Principal</th>
      <th scope="col" class="num">Interest</th>
      <th scope="col" class="num">Ending balance</th>
      <th scope="col">Focus debt</th>
    </tr>
  `;
  tableBody.innerHTML = viewModel.chosen.schedule
    .map(
      (row) => `
          <tr>
            <td>${row.label}</td>
            <td class="num">${formatCurrency(row.startBalance)}</td>
            <td class="num">${formatCurrency(row.payment)}</td>
            <td class="num">${formatCurrency(row.principal)}</td>
            <td class="num">${formatCurrency(row.interest)}</td>
            <td class="num">${formatCurrency(row.endingBalance)}</td>
            <td>${escapeHtml(row.targetDebt)}</td>
          </tr>
        `
      )
    .join('');
  const firstLabel = viewModel.chosen.schedule[0]?.label || 'start';
  tableContext.textContent = `Showing the full monthly path from ${firstLabel} to ${viewModel.chosen.debtFreeLabel}.`;
}

function renderHero(viewModel) {
  if (state.mode === 'goal-date' && viewModel.goal) {
    kicker.textContent = 'Target month';
    headline.textContent = `To be debt-free by ${viewModel.goal.targetDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}, you need about ${formatCurrency(viewModel.goal.totalMonthlyPayment)}/month`;
    summary.textContent = `That is ${formatCurrency(viewModel.goal.extraPayment)} above your current minimum budget of ${formatCurrency(viewModel.chosen.minimumBudget)}/month using the ${strategyLabel(state.strategy).toLowerCase()} payoff order.`;
    return;
  }

  const monthlyBudget = viewModel.chosen.minimumBudget + viewModel.chosen.extraBudget;
  kicker.textContent = 'At your current plan';
  headline.textContent = `You could be debt-free by ${viewModel.chosen.debtFreeLabel}`;
  summary.textContent = `${strategyLabel(state.strategy)} would clear ${debtCountText(viewModel.chosen.debts.length)} in ${viewModel.chosen.months} months at about ${formatCurrency(monthlyBudget)}/month.`;
}

function render(viewModel) {
  state.lastViewModel = viewModel;
  state.lastCopySummary = buildCopySummary(viewModel);

  renderHero(viewModel);
  renderKpis(viewModel);
  renderGoalBanner(viewModel);
  renderComparison(viewModel);
  renderPayoffOrder(viewModel);
  renderNextSteps(viewModel);
  renderLineChart(viewModel);
  renderPieChart(viewModel);
  renderTable(viewModel);

  if (viewModel.chosen.warning) {
    showError(viewModel.chosen.warning);
  } else {
    clearError();
  }
}

function calculate() {
  const inputs = readInputs();
  if (!inputs) {
    return;
  }

  const viewModel = buildDebtPayoffViewModel(inputs);
  if (!viewModel) {
    showError('Unable to build a payoff plan from the current inputs.');
    return;
  }

  if (state.mode === 'goal-date' && !viewModel.goal) {
    showError('That target date is too aggressive for the current balances. Try a later month or reduce the balances first.');
    return;
  }

  render(viewModel);
}

function resetToDefault() {
  const baseDate = new Date();
  const defaultTargetDate = buildDefaultTargetDate(baseDate);
  state.mode = 'standard';
  state.strategy = 'snowball';
  state.chartSeries = 'chosen';
  state.tableView = 'monthly';
  state.debts = cloneDefaultDebts();
  state.rowSeed = state.debts.length;
  state.extraPayment = '120';
  state.targetDate = formatDateInputValue(defaultTargetDate);

  syncInputs();
  syncModeUi();
  syncStrategyUi();
  syncChartUi();
  syncTableUi();
  renderDebtRows();
  clearError();
  calculate();
}

modeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const nextMode = button.dataset.mode || 'standard';
    state.mode = nextMode;
    if (nextMode === 'goal-date' && !state.targetDate) {
      state.targetDate = formatDateInputValue(buildDefaultTargetDate());
      syncInputs();
    }
    syncModeUi();
  });
});

strategyButtons.forEach((button) => {
  button.addEventListener('click', () => {
    state.strategy = button.dataset.strategy || 'snowball';
    syncStrategyUi();
  });
});

chartButtons.forEach((button) => {
  button.addEventListener('click', () => {
    state.chartSeries = button.dataset.series || 'chosen';
    syncChartUi();
    if (state.lastViewModel) {
      renderLineChart(state.lastViewModel);
    }
  });
});

tableButtons.forEach((button) => {
  button.addEventListener('click', () => {
    state.tableView = button.dataset.tableView || 'monthly';
    syncTableUi();
    if (state.lastViewModel) {
      renderTable(state.lastViewModel);
    }
  });
});

extraPaymentInput?.addEventListener('input', (event) => {
  state.extraPayment = event.currentTarget.value;
});

targetDateInput?.addEventListener('input', (event) => {
  state.targetDate = event.currentTarget.value;
});

addRowButton?.addEventListener('click', () => {
  state.debts.push(createBlankDebt());
  renderDebtRows();
});

calculateButton?.addEventListener('click', calculate);
resetButton?.addEventListener('click', resetToDefault);
copyButton?.addEventListener('click', async () => {
  if (!state.lastCopySummary) {
    return;
  }
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(state.lastCopySummary);
  } else {
    const helper = document.createElement('textarea');
    helper.value = state.lastCopySummary;
    helper.setAttribute('readonly', '');
    helper.style.position = 'absolute';
    helper.style.left = '-9999px';
    document.body.appendChild(helper);
    helper.select();
    document.execCommand('copy');
    helper.remove();
  }
  showCopyFeedback();
});

ensureTitle();
resetToDefault();
