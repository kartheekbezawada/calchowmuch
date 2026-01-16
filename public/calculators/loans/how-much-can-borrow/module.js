import { formatCurrency, formatNumber } from '/assets/js/core/format.js';
import { setupButtonGroup } from '/assets/js/core/ui.js';
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

const incomeBasisGroup = document.querySelector('[data-button-group="bor-income-basis"]');
const methodGroup = document.querySelector('[data-button-group="bor-method"]');

const multipleRow = document.querySelector('#bor-multiple-row');
const capRow = document.querySelector('#bor-cap-row');

const explanationRoot = document.querySelector('#loan-borrow-explanation');
const basisValue = explanationRoot?.querySelector('[data-bor="basis"]');
const incomeValue = explanationRoot?.querySelector('[data-bor="income"]');
const rateValue = explanationRoot?.querySelector('[data-bor="rate"]');
const termValue = explanationRoot?.querySelector('[data-bor="term"]');
const maxPaymentValue = explanationRoot?.querySelector('[data-bor="max-payment"]');
const maxBorrowValue = explanationRoot?.querySelector('[data-bor="max-borrow"]');
const incomeExampleValue = explanationRoot?.querySelector('[data-bor="income-example"]');
const outgoingsValue = explanationRoot?.querySelector('[data-bor="outgoings"]');

const tableBody = document.querySelector('#bor-table-body');

const graphLine = document.querySelector('#bor-graph-line polyline');
const graphYMax = document.querySelector('#bor-y-max');
const graphYMid = document.querySelector('#bor-y-mid');
const graphYMin = document.querySelector('#bor-y-min');
const graphXStart = document.querySelector('#bor-x-start');
const graphXEnd = document.querySelector('#bor-x-end');
const graphNote = document.querySelector('#bor-graph-note');

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

  basisValue.textContent = basisLabel;
  incomeValue.textContent = formatCurrency(data.monthlyIncome);
  rateValue.textContent = formatNumber(data.interestRate, { maximumFractionDigits: 2 });
  termValue.textContent = formatNumber(data.termYears, { maximumFractionDigits: 0 });
  maxPaymentValue.textContent = formatCurrency(data.maxPayment);
  maxBorrowValue.textContent = formatCurrency(data.maxBorrow);
  incomeExampleValue.textContent = formatCurrency(data.monthlyIncome);
  outgoingsValue.textContent = formatCurrency(data.totalOutgoings);
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
  graphYMax.textContent = formatAxisValue(max);
  graphYMid.textContent = formatAxisValue(mid);
  graphYMin.textContent = formatAxisValue(min);
  graphXStart.textContent = formatNumber(data.rateSeries[0]?.rate ?? 0, {
    maximumFractionDigits: 1,
  });
  graphXEnd.textContent = formatNumber(data.rateSeries[data.rateSeries.length - 1]?.rate ?? 0, {
    maximumFractionDigits: 1,
  });
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

  resultDiv.innerHTML = `<strong>Maximum Borrow:</strong> ${formatCurrency(data.maxBorrow)}`;

  const propertyLine = data.maxPropertyPrice
    ? `<p><strong>Max property price:</strong> ${formatCurrency(data.maxPropertyPrice)}</p>`
    : '';

  summaryDiv.innerHTML =
    `<p><strong>Estimated payment:</strong> ${formatCurrency(data.monthlyPayment)}</p>` +
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

toggleMethodFields(methodButtons?.getValue() ?? 'income');

calculateButton?.addEventListener('click', calculate);

calculate();
