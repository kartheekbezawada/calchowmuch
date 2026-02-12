import { formatNumber } from '/assets/js/core/format.js';
import { setPageMetadata, setupButtonGroup } from '/assets/js/core/ui.js';
import { calculateBorrow, computeMonthlyPayment } from '/assets/js/core/loan-utils.js';

const metadata = {
  title: 'How Much Can I Borrow | Mortgage Affordability | CalcHowMuch',
  description:
    'Estimate your maximum mortgage borrowing using income multiples or payment-to-income checks, then compare monthly payments and total property budget.',
  canonical: 'https://calchowmuch.com/loans/how-much-can-i-borrow/',
};

setPageMetadata(metadata);

/* --- DOM references: calculator inputs --- */

const grossIncomeInput = document.querySelector('#bor-gross-income');
const netIncomeInput = document.querySelector('#bor-net-income');
const expensesInput = document.querySelector('#bor-expenses');
const debtsInput = document.querySelector('#bor-debts');
const rateInput = document.querySelector('#bor-rate');
const termInput = document.querySelector('#bor-term');
const multipleInput = document.querySelector('#bor-multiple');
const depositInput = document.querySelector('#bor-deposit');

const grossIncomeDisplay = document.querySelector('#bor-gross-income-display');
const netIncomeDisplay = document.querySelector('#bor-net-income-display');
const expensesDisplay = document.querySelector('#bor-expenses-display');
const debtsDisplay = document.querySelector('#bor-debts-display');
const rateDisplay = document.querySelector('#bor-rate-display');
const termDisplay = document.querySelector('#bor-term-display');
const multipleDisplay = document.querySelector('#bor-multiple-display');
const depositDisplay = document.querySelector('#bor-deposit-display');

const multipleRow = document.querySelector('#bor-multiple-row');
const paymentNoteRow = document.querySelector('#bor-payment-note-row');
const calculateButton = document.querySelector('#bor-calculate');

const incomeBasisGroup = document.querySelector('[data-button-group="bor-income-basis"]');
const methodGroup = document.querySelector('[data-button-group="bor-method"]');

/* --- DOM references: result dashboard --- */

const metricBorrow = document.querySelector('#bor-metric-borrow');
const metricProperty = document.querySelector('#bor-metric-property');
const metricPayment = document.querySelector('#bor-metric-payment');
const metricDisposable = document.querySelector('#bor-metric-disposable');
const constraintTag = document.querySelector('#bor-constraint');
const errorDiv = document.querySelector('#bor-error');

/* --- Format helpers (no currency symbols) --- */

function fmt(value) {
  return formatNumber(value, { maximumFractionDigits: 0 });
}

function fmtDecimal(value) {
  return formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* --- Slider fill management --- */

function updateSliderFill(input) {
  if (!input || input.type !== 'range') return;
  const min = parseFloat(input.min) || 0;
  const max = parseFloat(input.max) || 100;
  const val = parseFloat(input.value) || 0;
  const pct = ((val - min) / (max - min)) * 100;
  input.style.setProperty('--fill', `${pct}%`);
}

function updateSliderDisplays() {
  if (grossIncomeInput && grossIncomeDisplay) {
    grossIncomeDisplay.textContent = fmt(Number(grossIncomeInput.value));
    updateSliderFill(grossIncomeInput);
  }
  if (netIncomeInput && netIncomeDisplay) {
    netIncomeDisplay.textContent = fmt(Number(netIncomeInput.value));
    updateSliderFill(netIncomeInput);
  }
  if (expensesInput && expensesDisplay) {
    expensesDisplay.textContent = fmt(Number(expensesInput.value));
    updateSliderFill(expensesInput);
  }
  if (debtsInput && debtsDisplay) {
    debtsDisplay.textContent = fmt(Number(debtsInput.value));
    updateSliderFill(debtsInput);
  }
  if (rateInput && rateDisplay) {
    rateDisplay.textContent = `${fmtDecimal(Number(rateInput.value))}%`;
    updateSliderFill(rateInput);
  }
  if (termInput && termDisplay) {
    termDisplay.textContent = `${termInput.value} yrs`;
    updateSliderFill(termInput);
  }
  if (multipleInput && multipleDisplay) {
    multipleDisplay.textContent = `${fmtDecimal(Number(multipleInput.value))}x`;
    updateSliderFill(multipleInput);
  }
  if (depositInput && depositDisplay) {
    depositDisplay.textContent = fmt(Number(depositInput.value));
    updateSliderFill(depositInput);
  }
}

/* Bind slider input events */
[grossIncomeInput, netIncomeInput, expensesInput, debtsInput, rateInput, termInput, multipleInput, depositInput]
  .filter(Boolean)
  .forEach((input) => {
    input.addEventListener('input', updateSliderDisplays);
  });

updateSliderDisplays();

/* --- Toggle groups --- */

const incomeBasisButtons = setupButtonGroup(incomeBasisGroup, {
  defaultValue: 'gross',
  onChange: () => calculate(),
});

const methodButtons = setupButtonGroup(methodGroup, {
  defaultValue: 'income',
  onChange: (value) => {
    syncMethodRows(value);
    calculate();
  },
});

function syncMethodRows(method = methodButtons?.getValue() ?? 'income') {
  const isIncomeMode = method === 'income';
  multipleRow?.classList.toggle('is-hidden', !isIncomeMode);
  paymentNoteRow?.classList.toggle('is-hidden', isIncomeMode);
}

/* --- Lazy-load explanation panel --- */

function resolveExplanationRoot() {
  return (
    document.querySelector('.center-column .panel:last-child #loan-borrow-explanation') ||
    document.querySelector('#loan-borrow-explanation')
  );
}

let explanationRoot = null;
let scenarioBody = null;

function cacheExplanationElements() {
  explanationRoot = resolveExplanationRoot();
  scenarioBody = explanationRoot?.querySelector('#bor-scenario-body') ?? null;
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
    const response = await fetch('/calculators/loans/how-much-can-i-borrow/explanation.html');
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

/* --- Capacity bar update --- */

function setSegment(dataKey, pct, amount) {
  const segment = explanationRoot?.querySelector(`[data-bor="${dataKey}"]`);
  const text = explanationRoot?.querySelector(`[data-bor="${dataKey}-text"]`);
  if (segment) {
    segment.style.setProperty('--seg-width', `${Math.max(0, pct).toFixed(1)}%`);
  }
  if (text) {
    text.textContent = pct >= 8 ? fmt(Math.round(amount)) : '';
  }
}

function updateCapacityBar(data) {
  if (!explanationRoot) return;

  const income = data.monthlyIncome;
  if (income <= 0) return;

  const expPct = (data.expensesMonthly / income) * 100;
  const debtPct = (data.debtMonthly / income) * 100;
  const mortPct = (data.monthlyPayment / income) * 100;
  const bufferPct = Math.max(0, 100 - expPct - debtPct - mortPct);

  setSegment('cap-expenses', expPct, data.expensesMonthly);
  setSegment('cap-debts', debtPct, data.debtMonthly);
  setSegment('cap-mortgage', mortPct, data.monthlyPayment);
  setSegment('cap-buffer', bufferPct, income - data.expensesMonthly - data.debtMonthly - data.monthlyPayment);

  /* Legend values */
  const setLegend = (key, value) => {
    const el = explanationRoot?.querySelector(`[data-bor="legend-${key}"]`);
    if (el) el.textContent = fmt(Math.round(value));
  };
  setLegend('expenses', data.expensesMonthly);
  setLegend('debts', data.debtMonthly);
  setLegend('mortgage', data.monthlyPayment);
  setLegend('buffer', income - data.expensesMonthly - data.debtMonthly - data.monthlyPayment);
}

/* --- Scenario table --- */

function renderScenarioTable(data) {
  if (!scenarioBody) return;

  const rows = (data.rateSeries || []).map((item) => {
    const isCurrentRate = Math.abs(item.rate - data.interestRate) < 0.01;
    const months = data.termYears * 12;
    const payment = computeMonthlyPayment(data.maxBorrow, item.rate, months);
    const property = item.value + Math.max(0, Number(data.deposit) || 0);

    return `<tr${isCurrentRate ? ' class="bor-scenario-highlight"' : ''}>
      <td>${fmtDecimal(item.rate)}%</td>
      <td>${fmt(Math.round(item.value))}</td>
      <td>${fmt(Math.round(payment))}</td>
      <td>${fmt(Math.round(property))}</td>
    </tr>`;
  });

  scenarioBody.innerHTML = rows.join('');
}

/* --- Result pop animation --- */

function animateMetric(el) {
  if (!el) return;
  el.classList.remove('is-updated');
  void el.offsetWidth;
  el.classList.add('is-updated');
}

/* --- Clear / Error --- */

function clearOutputs() {
  if (scenarioBody) scenarioBody.innerHTML = '';
}

function clearError() {
  if (errorDiv) errorDiv.textContent = '';
}

function setError(message) {
  if (errorDiv) errorDiv.textContent = message;
  if (metricBorrow) metricBorrow.textContent = '\u2014';
  if (metricProperty) metricProperty.textContent = '\u2014';
  if (metricPayment) metricPayment.textContent = '\u2014';
  if (metricDisposable) metricDisposable.textContent = '\u2014';
  if (constraintTag) constraintTag.textContent = '';
  clearOutputs();
}

/* --- Main calculate --- */

function calculate() {
  clearError();

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

  /* Populate 4 metric cards */
  if (metricBorrow) {
    metricBorrow.textContent = fmt(Math.round(data.maxBorrow));
    animateMetric(metricBorrow);
  }
  if (metricProperty) {
    const fallbackProperty = data.maxBorrow + Math.max(0, Number(deposit) || 0);
    const propertyValue = Number.isFinite(data.maxPropertyPrice) ? data.maxPropertyPrice : fallbackProperty;
    metricProperty.textContent = fmt(Math.round(propertyValue));
    animateMetric(metricProperty);
  }
  if (metricPayment) {
    metricPayment.textContent = fmt(Math.round(data.monthlyPayment));
    animateMetric(metricPayment);
  }
  if (metricDisposable) {
    metricDisposable.textContent = fmt(Math.round(data.monthlyDisposable));
    animateMetric(metricDisposable);
  }

  /* Constraint tag */
  if (constraintTag) {
    if (method === 'income') {
      constraintTag.textContent = `Income multiple ${fmtDecimal(data.incomeMultiple)}x`;
    } else {
      constraintTag.textContent = `Payment-to-income cap ${fmt(Math.round(data.maxPayment))}`;
    }
  }

  /* Explanation: capacity bar + scenario table */
  updateCapacityBar(data);
  renderScenarioTable(data);
}

/* --- Button & init --- */

calculateButton?.addEventListener('click', async () => {
  await ensureExplanation();
  calculate();
});

async function initialize() {
  await ensureExplanation();
  syncMethodRows();
  calculate();
}

initialize();
