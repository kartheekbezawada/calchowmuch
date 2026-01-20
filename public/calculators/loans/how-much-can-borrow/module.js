import { formatCurrency, formatNumber } from '/assets/js/core/format.js';
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
const capInput = document.querySelector('#bor-cap');
const depositInput = document.querySelector('#bor-deposit');
const calculateButton = document.querySelector('#bor-calculate');
const resultDiv = document.querySelector('#bor-result');
const summaryDiv = document.querySelector('#bor-summary');
const formatBorrowCurrency = (value) => formatCurrency(value, 'GBP');

const incomeBasisGroup = document.querySelector('[data-button-group="bor-income-basis"]');
const methodGroup = document.querySelector('[data-button-group="bor-method"]');

const multipleRow = document.querySelector('#bor-multiple-row');
const capRow = document.querySelector('#bor-cap-row');

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

const MAX_INPUT_LENGTH = 10;

function resolveExplanationRoot() {
  return (
    document.querySelector('.center-column .panel:last-child #loan-borrow-explanation') ||
    document.querySelector('#loan-borrow-explanation')
  );
}

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
    if (value.length > MAX_INPUT_LENGTH) {
      input.value = value.slice(0, MAX_INPUT_LENGTH);
    }
  });
}

const incomeBasisButtons = setupButtonGroup(incomeBasisGroup, {
  defaultValue: 'gross',
  onChange: () => calculate(),
});

const methodButtons = setupButtonGroup(methodGroup, {
  defaultValue: 'income',
  onChange: (value) => {
    toggleMethodFields(value);
    calculate();
  },
});

[
  grossIncomeInput,
  netIncomeInput,
  expensesInput,
  debtsInput,
  rateInput,
  termInput,
  multipleInput,
  capInput,
  depositInput,
].forEach(enforceMaxLength);

function toggleMethodFields(method) {
  multipleRow?.classList.toggle('is-hidden', method !== 'income');
  capRow?.classList.toggle('is-hidden', method !== 'payment');
}

function formatTableNumber(value) {
  return formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatAxisValue(value) {
  return formatNumber(value, { maximumFractionDigits: 0 });
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
    { label: 'Interest rate', value: formatTableNumber(data.interestRate) },
    { label: 'Loan term (years)', value: formatTableNumber(data.termYears) },
    data.method === 'income'
      ? { label: 'Income multiple', value: formatTableNumber(data.incomeMultiple) }
      : { label: 'Payment cap (%)', value: formatTableNumber(data.paymentCapPercent) },
    { label: 'Max monthly payment', value: formatTableNumber(data.maxPayment) },
    { label: 'Max borrow', value: formatTableNumber(data.maxBorrow) },
  ];

  if (data.deposit > 0 && data.maxPropertyPrice) {
    rows.push({ label: 'Max property price', value: formatTableNumber(data.maxPropertyPrice) });
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
    graphYMax.textContent = formatAxisValue(max);
  }
  if (graphYMid) {
    graphYMid.textContent = formatAxisValue(mid);
  }
  if (graphYMin) {
    graphYMin.textContent = formatAxisValue(min);
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

function calculate() {
  if (!resultDiv || !summaryDiv) {
    return;
  }

  resultDiv.textContent = '';
  summaryDiv.textContent = '';
  clearOutputs();

  // Validate input maxlength per universal requirements
  const inputsToValidate = [
    grossIncomeInput,
    netIncomeInput,
    expensesInput,
    debtsInput,
    rateInput,
    termInput,
    multipleInput,
    capInput,
    depositInput,
  ].filter(Boolean);

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
  const paymentCapPercent = Number(capInput?.value);
  const deposit = Number(depositInput?.value);

  if (method === 'income' && (!Number.isFinite(incomeMultiple) || incomeMultiple <= 0)) {
    setError('Income multiple must be greater than 0.');
    return;
  }

  if (
    method === 'payment' &&
    (!Number.isFinite(paymentCapPercent) || paymentCapPercent <= 0 || paymentCapPercent > 100)
  ) {
    setError('Payment cap must be between 0 and 100.');
    return;
  }

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
    paymentCapPercent,
    deposit,
  });

  if (data.hasAffordabilityGap) {
    setError('Not affordable: expenses and debts exceed income.');
    return;
  }

  if (data.maxBorrow <= 0 || data.maxPayment <= 0) {
    setError('Not affordable with the current payment cap.');
    return;
  }

  resultDiv.innerHTML = `<strong>Maximum Borrow:</strong> ${formatBorrowCurrency(data.maxBorrow)}`;

  const propertyLine = data.maxPropertyPrice
    ? `<p><strong>Max property price:</strong> ${formatBorrowCurrency(data.maxPropertyPrice)}</p>`
    : '';

  summaryDiv.innerHTML =
    `<p><strong>Estimated payment:</strong> ${formatBorrowCurrency(data.monthlyPayment)}</p>` +
    `<p><strong>Constraint:</strong> ` +
    `${
      method === 'income'
        ? `Income multiple ${formatNumber(data.incomeMultiple, { maximumFractionDigits: 2 })}x`
        : `Payment cap ${formatNumber(data.paymentCapPercent, { maximumFractionDigits: 1 })}%`
    }</p>` +
    propertyLine;

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
  toggleMethodFields(methodButtons?.getValue() ?? 'income');
  calculate();
}

initialize();
