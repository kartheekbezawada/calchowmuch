import { formatNumber } from '/assets/js/core/format.js';
import { setupButtonGroup } from '/assets/js/core/ui.js';
import { hasMaxDigits } from '/assets/js/core/validate.js';
import { calculateBorrow } from '/assets/js/core/loan-utils.js';
import { buildPolyline, getPaddedMinMax } from '/assets/js/core/graph-utils.js';

const grossIncomeInput = document.querySelector('#bor-gross-income');
const netIncomeInput = document.querySelector('#bor-net-income');
const expensesInput = document.querySelector('#bor-expenses');
const debtsInput = document.querySelector('#bor-debts');
const rateInput = document.querySelector('#bor-rate');
const termInput = document.querySelector('#bor-term');
const multipleInput = document.querySelector('#bor-multiple');
const depositInput = document.querySelector('#bor-deposit');
const calculateButton = document.querySelector('#bor-calculate');
const resultDiv = document.querySelector('#bor-result');
const summaryDiv = document.querySelector('#bor-summary');
const formatBorrowCurrency = (value) => formatNumber(value, 'GBP');

const incomeBasisGroup = document.querySelector('[data-button-group="bor-income-basis"]');
const methodGroup = document.querySelector('[data-button-group="bor-method"]');


const sliderPalette = {
  rate: { start: '#3b82f6', end: '#06b6d4' },
  term: { start: '#10b981', end: '#059669' },
  multiple: { start: '#f97316', end: '#dc2626' },
  deposit: { start: '#8b5cf6', end: '#6366f1' },
};

const sliderConfigs = [
  {
    element: rateInput,
    displaySelector: '[data-slider-display="bor-rate"]',
    format: (value) =>
      `${formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`,
    gradient: sliderPalette.rate,
  },
  {
    element: termInput,
    displaySelector: '[data-slider-display="bor-term"]',
    format: (value) => `${formatNumber(value, { maximumFractionDigits: 0 })} yr`,
    gradient: sliderPalette.term,
  },
  {
    element: multipleInput,
    displaySelector: '[data-slider-display="bor-multiple"]',
    format: (value) =>
      `${formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}x`,
    gradient: sliderPalette.multiple,
  },
  {
    element: depositInput,
    displaySelector: '[data-slider-display="bor-deposit"]',
    format: (value) => formatBorrowCurrency(value),
    gradient: sliderPalette.deposit,
  },
];

function applySliderGradient(slider, colors) {
  if (!slider || !colors) {
    return;
  }
  const min = Number(slider.min ?? 0);
  const max = Number(slider.max ?? 100);
  const value = Number(slider.value ?? 0);
  const percent =
    Number.isFinite(min) &&
    Number.isFinite(max) &&
    max > min
      ? Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
      : 0;

  slider.style.background = `linear-gradient(90deg, ${colors.start} 0%, ${colors.end} ${percent}%, #1e293b ${percent}%, #1e293b 100%)`;
}

function bindSlider({ element, displaySelector, format, gradient }) {
  if (!element) {
    return;
  }
  const display = document.querySelector(displaySelector);
  const update = () => {
    const numericValue = Number(element.value);
    if (display) {
      display.textContent = format(Number.isFinite(numericValue) ? numericValue : 0);
    }
    applySliderGradient(element, gradient);
  };

  element.addEventListener('input', update);
  element.addEventListener('change', update);
  update();
}

sliderConfigs.forEach(bindSlider);


function resolveExplanationRoot() {
  return (
    document.querySelector('.center-column .panel:last-child #loan-borrow-explanation') ||
    document.querySelector('#loan-borrow-explanation')
  );
}

let explanationRoot = null;
let basisValue = null;
let incomeValue = null;
let rateValue = null;
let termValue = null;
let maxPaymentValue = null;
let maxBorrowValue = null;
let incomeExampleValue = null;
let outgoingsValue = null;
let tableBody = null;
let graphLine = null;
let graphYMax = null;
let graphYMid = null;
let graphYMin = null;
let graphXStart = null;
let graphXEnd = null;
let graphNote = null;

function cacheExplanationElements() {
  explanationRoot = resolveExplanationRoot();
  basisValue = explanationRoot?.querySelector('[data-bor="basis"]') ?? null;
  incomeValue = explanationRoot?.querySelector('[data-bor="income"]') ?? null;
  rateValue = explanationRoot?.querySelector('[data-bor="rate"]') ?? null;
  termValue = explanationRoot?.querySelector('[data-bor="term"]') ?? null;
  maxPaymentValue = explanationRoot?.querySelector('[data-bor="max-payment"]') ?? null;
  maxBorrowValue = explanationRoot?.querySelector('[data-bor="max-borrow"]') ?? null;
  incomeExampleValue = explanationRoot?.querySelector('[data-bor="income-example"]') ?? null;
  outgoingsValue = explanationRoot?.querySelector('[data-bor="outgoings"]') ?? null;
  tableBody = explanationRoot?.querySelector('#bor-table-body') ?? null;
  graphLine = explanationRoot?.querySelector('#bor-graph-line polyline') ?? null;
  graphYMax = explanationRoot?.querySelector('#bor-y-max') ?? null;
  graphYMid = explanationRoot?.querySelector('#bor-y-mid') ?? null;
  graphYMin = explanationRoot?.querySelector('#bor-y-min') ?? null;
  graphXStart = explanationRoot?.querySelector('#bor-x-start') ?? null;
  graphXEnd = explanationRoot?.querySelector('#bor-x-end') ?? null;
  graphNote = explanationRoot?.querySelector('#bor-graph-note') ?? null;
}

cacheExplanationElements();

async function ensureExplanation() {
  if (resolveExplanationRoot()) {
    cacheExplanationElements();
    return;
  }

  const container = document.querySelector('#calc-how-much-can-borrow');
  if (!container) {
    return;
  }

  try {
    const response = await fetch('/calculators/loans/how-much-can-borrow/explanation.html');
    if (!response.ok) {
      return;
    }
    const explanationHTML = await response.text();
    container.insertAdjacentHTML('beforeend', explanationHTML);
    cacheExplanationElements();
  } catch {
    return;
  }
}

function enforceMaxLength(input) {
  if (!input) {
    return;
  }
  input.addEventListener('input', () => {
    const { value } = input;
    if (value.length > 10) {
      input.value = value.slice(0, 10);
    }
  });
}

[grossIncomeInput, netIncomeInput, expensesInput, debtsInput].forEach(enforceMaxLength);

const incomeBasisButtons = setupButtonGroup(incomeBasisGroup, {
  defaultValue: 'gross',
  onChange: () => calculate(),
});

const methodButtons = setupButtonGroup(methodGroup, {
  defaultValue: 'income',
  onChange: () => calculate(),
});

function formatTableNumber(value, options = {}) {
  return formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2, ...options });
}

function clearOutputs() {
  if (tableBody) {
    tableBody.innerHTML = '';
  }
  graphLine?.setAttribute('points', '');
}

function setError(message) {
  if (resultDiv) {
    resultDiv.textContent = message;
  }
  if (summaryDiv) {
    summaryDiv.textContent = '';
  }
  clearOutputs();
}

function updateExplanation(data) {
  if (!explanationRoot) {
    return;
  }

  const basisLabel = data.incomeBasis === 'net' ? 'net' : 'gross';

  if (basisValue) {
    basisValue.textContent = basisLabel;
  }
  if (incomeValue) {
    incomeValue.textContent = formatBorrowCurrency(data.monthlyIncome);
  }
  if (rateValue) {
    rateValue.textContent = formatNumber(data.interestRate, { maximumFractionDigits: 2 });
  }
  if (termValue) {
    termValue.textContent = formatNumber(data.termYears, { maximumFractionDigits: 0 });
  }
  if (maxPaymentValue) {
    maxPaymentValue.textContent = formatBorrowCurrency(data.maxPayment);
  }
  if (maxBorrowValue) {
    maxBorrowValue.textContent = formatBorrowCurrency(data.maxBorrow);
  }
  if (incomeExampleValue) {
    incomeExampleValue.textContent = formatBorrowCurrency(data.monthlyIncome);
  }
  if (outgoingsValue) {
    outgoingsValue.textContent = formatBorrowCurrency(data.totalOutgoings);
  }
}

function updateTable(data) {
  if (!tableBody) {
    return;
  }

  const rows = [
    { label: 'Income basis', value: data.incomeBasis === 'net' ? 'Net' : 'Gross' },
    { label: 'Monthly income used', value: formatTableNumber(data.monthlyIncome) },
    { label: 'Total outgoings', value: formatTableNumber(data.totalOutgoings) },
    { label: 'Monthly disposable', value: formatTableNumber(data.monthlyDisposable) },
    { label: 'Interest rate', value: formatTableNumber(data.interestRate) },
    { label: 'Loan term (years)', value: formatTableNumber(data.termYears, { maximumFractionDigits: 0 }) },
    data.method === 'income'
      ? { label: 'Income multiple', value: `${formatTableNumber(data.incomeMultiple)}x` }
      : { label: 'Monthly payment cap', value: formatBorrowCurrency(data.maxPayment) },
    { label: 'Max borrow', value: formatBorrowCurrency(data.maxBorrow) },
  ];

  if (data.deposit > 0 && data.maxPropertyPrice) {
    rows.push({ label: 'Max property price', value: formatBorrowCurrency(data.maxPropertyPrice) });
  }

  tableBody.innerHTML = rows
    .map(
      (row) => `
        <tr>
          <td>${row.label}</td>
          <td>${row.value}</td>
        </tr>`
    )
    .join('');
}

function updateGraph(data) {
  if (!graphLine) {
    return;
  }

  const values = data.rateSeries.map((entry) => entry.value);
  const { min, max } = getPaddedMinMax(values, 0.1);
  const mid = (min + max) / 2;

  graphLine.setAttribute('points', buildPolyline(values, min, max));
  if (graphYMax) {
    graphYMax.textContent = formatNumber(max, { maximumFractionDigits: 0 });
  }
  if (graphYMid) {
    graphYMid.textContent = formatNumber(mid, { maximumFractionDigits: 0 });
  }
  if (graphYMin) {
    graphYMin.textContent = formatNumber(min, { maximumFractionDigits: 0 });
  }
  if (graphXStart) {
    graphXStart.textContent = formatNumber(data.rateSeries[0]?.rate ?? 0, {
      maximumFractionDigits: 1,
    });
  }
  if (graphXEnd) {
    graphXEnd.textContent = formatNumber(data.rateSeries[data.rateSeries.length - 1]?.rate ?? 0, {
      maximumFractionDigits: 1,
    });
  }
  if (graphNote) {
    graphNote.textContent = 'Payment held constant';
  }
}

function formatSummaryLine(label, value) {
  return `<p><strong>${label}</strong> ${value}</p>`;
}

function populateSummary(data, method) {
  if (!summaryDiv) {
    return;
  }

  const summaryLines = [];

  summaryLines.push(
    formatSummaryLine('Estimated payment:', formatBorrowCurrency(data.monthlyPayment))
  );

  if (method === 'income') {
    summaryLines.push(
      formatSummaryLine(
        'Constraint:',
        `Income multiple ${formatNumber(data.incomeMultiple, { maximumFractionDigits: 2 })}x`
      )
    );
  } else {
    summaryLines.push(
      formatSummaryLine('Constraint:', `Payment-to-income cap ${formatBorrowCurrency(data.maxPayment)}`)
    );
  }

  summaryLines.push(
    formatSummaryLine('Monthly disposable:', formatBorrowCurrency(data.monthlyDisposable))
  );

  if (data.maxPropertyPrice) {
    summaryLines.push(
      formatSummaryLine('Max property price:', formatBorrowCurrency(data.maxPropertyPrice))
    );
  }

  summaryDiv.innerHTML = summaryLines.join('');
}

function calculate() {
  if (!resultDiv || !summaryDiv) {
    return;
  }

  resultDiv.textContent = '';
  summaryDiv.textContent = '';
  clearOutputs();

  const inputsToValidate = [grossIncomeInput, netIncomeInput, expensesInput, debtsInput].filter(
    Boolean
  );
  const invalidLength = inputsToValidate.find((input) => !hasMaxDigits(input.value, 10));
  if (invalidLength) {
    setError('Inputs must be 10 digits or fewer.');
    return;
  }

  const grossIncomeAnnual = Number(grossIncomeInput?.value);
  if (!Number.isFinite(grossIncomeAnnual) || grossIncomeAnnual <= 0) {
    setError('Gross annual income must be greater than 0.');
    return;
  }

  const netIncomeMonthly = Number(netIncomeInput?.value);
  const incomeBasis = incomeBasisButtons?.getValue() ?? 'gross';
  if (incomeBasis === 'net' && (!Number.isFinite(netIncomeMonthly) || netIncomeMonthly <= 0)) {
    setError('Net monthly income is required when using net basis.');
    return;
  }

  const expensesMonthly = Number(expensesInput?.value);
  if (!Number.isFinite(expensesMonthly) || expensesMonthly < 0) {
    setError('Monthly expenses must be 0 or more.');
    return;
  }

  const debtMonthly = Number(debtsInput?.value);
  if (!Number.isFinite(debtMonthly) || debtMonthly < 0) {
    setError('Monthly debt payments must be 0 or more.');
    return;
  }

  const interestRate = Number(rateInput?.value);
  if (!Number.isFinite(interestRate) || interestRate < 0) {
    setError('Interest rate must be 0 or more.');
    return;
  }

  const termYears = Number(termInput?.value);
  if (!Number.isFinite(termYears) || termYears < 1) {
    setError('Loan term must be at least 1 year.');
    return;
  }

  const method = methodButtons?.getValue() ?? 'income';
  const incomeMultiple = Number(multipleInput?.value);
  if (method === 'income' && (!Number.isFinite(incomeMultiple) || incomeMultiple <= 0)) {
    setError('Income multiple must be greater than 0.');
    return;
  }

  const deposit = Number(depositInput?.value);
  if (!Number.isFinite(deposit) || deposit < 0) {
    setError('Deposit must be 0 or more.');
    return;
  }

  const data = calculateBorrow({
    grossIncomeAnnual,
    netIncomeMonthly,
    incomeBasis,
    expensesMonthly,
    debtMonthly,
    interestRate,
    termYears,
    method,
    incomeMultiple,
    deposit,
  });

  if (data.hasAffordabilityGap) {
    setError('Not affordable: expenses and debts exceed income.');
    return;
  }

  if (data.maxBorrow <= 0 || data.maxPayment <= 0) {
    setError('Not affordable with the current inputs.');
    return;
  }

  resultDiv.innerHTML = `<strong>Maximum Borrow:</strong> ${formatBorrowCurrency(data.maxBorrow)}`;

  if (data.maxPropertyPrice) {
    resultDiv.insertAdjacentHTML(
      'beforeend',
      `<p><strong>Max property price:</strong> ${formatBorrowCurrency(data.maxPropertyPrice)}</p>`
    );
  }

  populateSummary(data, method);
  updateExplanation(data);
  updateTable(data);
  updateGraph(data);
}

calculateButton?.addEventListener('click', async () => {
  await ensureExplanation();
  calculate();
});

async function initialize() {
  await ensureExplanation();
  calculate();
}

initialize();
