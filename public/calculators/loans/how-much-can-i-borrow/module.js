import { formatNumber } from '/assets/js/core/format.js';
import { setPageMetadata } from '/assets/js/core/ui.js';
import { calculateBorrow, computeMonthlyPayment } from '/assets/js/core/loan-utils.js';

const metadata = {
  title: 'How Much Can I Borrow | Mortgage Affordability | CalcHowMuch',
  description:
    'Estimate your maximum mortgage borrowing using income multiples or payment-to-income checks, then compare monthly payments and total property budget.',
  canonical: 'https://calchowmuch.com/loans/how-much-can-i-borrow/',
};

try {
  setPageMetadata(metadata);
} catch (e) {
  console.error('Metadata error', e);
}

/* --- DOM references: calculator inputs --- */

const grossIncomeInput = document.querySelector('#bor-gross-income');
// const netIncomeInput = document.querySelector('#bor-net-income'); // Hidden/Unused in logic now
const expensesInput = document.querySelector('#bor-expenses');
const debtsInput = document.querySelector('#bor-debts');
const rateInput = document.querySelector('#bor-rate');
const termInput = document.querySelector('#bor-term');
const multipleInput = document.querySelector('#bor-multiple');
const depositInput = document.querySelector('#bor-deposit');

const grossIncomeDisplay = document.querySelector('#bor-gross-income-display');
// const netIncomeDisplay = document.querySelector('#bor-net-income-display'); // Hidden/Unused in logic now
const expensesDisplay = document.querySelector('#bor-expenses-display');
const debtsDisplay = document.querySelector('#bor-debts-display');
const rateDisplay = document.querySelector('#bor-rate-display');
const termDisplay = document.querySelector('#bor-term-display');
// const multipleDisplay = document.querySelector('#bor-multiple-display'); // Hidden/Unused in logic now
const depositDisplay = document.querySelector('#bor-deposit-display');

// const multipleRow = document.querySelector('#bor-multiple-row'); // Removed from DOM
// const paymentNoteRow = document.querySelector('#bor-payment-note-row'); // Removed from DOM
const calculateButton = document.querySelector('#bor-calculate');

// const incomeBasisGroup = null; // Removed from DOM
// const methodGroup = null; // Removed from DOM

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
  // Net Income (Hidden but simulated)
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
  if (depositInput && depositDisplay) {
    depositDisplay.textContent = fmt(Number(depositInput.value));
    updateSliderFill(depositInput);
  }
}

/* Bind slider input events */
[grossIncomeInput, expensesInput, debtsInput, rateInput, termInput, depositInput]
  .filter(Boolean)
  .forEach((input) => {
    input.addEventListener('input', () => {
      updateSliderDisplays();
      calculate();
    });
  });

updateSliderDisplays();

/* --- Helper: Estimate Net Income from Gross (Simple Tax Model) --- */
function estimateNetIncome(grossAnnual) {
  // Simple progressive tax estimate (UK-ish/Generic)
  // 0-12.5k: 0%, 12.5k-50k: 20%, 50k-125k: 40%, 125k+: 45% + NI
  // Simplified effective rate curve:
  if (grossAnnual <= 12570) return grossAnnual / 12;

  // Quick algorithm or effective rate map
  // Let's use a flat estimation curve for "Global/US/UK" average
  // 30k -> ~82% retention
  // 60k -> ~72% retention
  // 100k -> ~68% retention
  // 200k -> ~60% retention

  let retention = 0.75; // Default safe bet
  if (grossAnnual > 100000) retention = 0.62;
  else if (grossAnnual > 50000) retention = 0.68;
  else if (grossAnnual > 30000) retention = 0.76;
  else retention = 0.85;

  return (grossAnnual * retention) / 12;
}

/* --- Error Handling --- */
function clearError() {
  if (errorDiv) {
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
  }
}

function setError(msg) {
  if (errorDiv) {
    errorDiv.textContent = msg;
    errorDiv.style.display = 'block';
  }
  if (metricBorrow) metricBorrow.textContent = '\u2014';
  if (metricProperty) metricProperty.textContent = '\u2014';
  if (metricPayment) metricPayment.textContent = '\u2014';
  if (metricDisposable) metricDisposable.textContent = '\u2014';
  if (constraintTag) constraintTag.textContent = '';
  // Reset capacity bar to empty state
  updateCapacityBar({ monthlyIncome: 0, expensesMonthly: 0, debtMonthly: 0, monthlyPayment: 0 });
}

/* --- Explanation / Visualization --- */
async function ensureExplanation() {
  const container = document.querySelector('#calc-how-much-can-borrow');
  if (document.querySelector('#loan-borrow-explanation') || !container) return;
  try {
    const response = await fetch('/calculators/loans/how-much-can-i-borrow/explanation.html');
    if (response.ok) {
      container.insertAdjacentHTML('beforeend', await response.text());
    }
  } catch (e) {
    console.warn('Failed to load explanation HTML:', e);
  }
}

function updateCapacityBar(data) {
  const root = document.querySelector('#loan-borrow-explanation');
  if (!root) return;

  // Safety check for data
  const income = data.monthlyIncome || 0;
  if (income <= 0) {
    // Clear segments if income is zero or invalid
    const segments = root.querySelectorAll('[data-bor^="cap-"]');
    segments.forEach(el => el.style.setProperty('--seg-width', '0%'));
    const texts = root.querySelectorAll('[data-bor$="-text"]');
    texts.forEach(el => el.textContent = '');
    return;
  }

  const setSeg = (key, val, max) => {
    const el = root.querySelector(`[data-bor="${key}"]`);
    const txt = root.querySelector(`[data-bor="${key}-text"]`);
    if (el) el.style.setProperty('--seg-width', `${Math.max(0, (val / max) * 100).toFixed(1)}%`);
    if (txt) txt.textContent = (val / max) * 100 >= 8 ? fmt(Math.round(val)) : '';
  };

  setSeg('cap-expenses', data.expensesMonthly, income);
  setSeg('cap-debts', data.debtMonthly, income);
  setSeg('cap-mortgage', data.monthlyPayment, income);

  const buffer = Math.max(0, income - data.expensesMonthly - data.debtMonthly - data.monthlyPayment);
  setSeg('cap-buffer', buffer, income);

  // Legend
  const setLeg = (key, val) => {
    const el = root.querySelector(`[data-bor="legend-${key}"]`);
    if (el) el.textContent = fmt(Math.round(val));
  };
  setLeg('expenses', data.expensesMonthly);
  setLeg('debts', data.debtMonthly);
  setLeg('mortgage', data.monthlyPayment);
  setLeg('buffer', buffer);
}

function renderScenarioTable(data) {
  const root = document.querySelector('#loan-borrow-explanation');
  const tbody = root?.querySelector('#bor-scenario-body');
  if (!tbody || !data.rateSeries) return;

  const rows = data.rateSeries.map(item => {
    const isCurrent = Math.abs(item.rate - data.interestRate) < 0.01;
    // recalculate for table consistency
    const payment = computeMonthlyPayment(item.value, item.rate, data.termYears * 12); // item.value is maxBorrow at that rate
    const prop = item.value + (data.deposit || 0);

    return `<tr${isCurrent ? ' class="bor-scenario-highlight"' : ''}>
            <td>${fmtDecimal(item.rate)}%</td>
            <td>${fmt(Math.round(item.value))}</td>
            <td>${fmt(Math.round(payment))}</td>
            <td>${fmt(Math.round(prop))}</td>
        </tr>`;
  });
  tbody.innerHTML = rows.join('');
}

function animateMetric(el) {
  if (!el) return;
  el.classList.remove('is-updated');
  void el.offsetWidth; // Trigger reflow
  el.classList.add('is-updated');
}

/* --- Main calculate --- */

function calculate() {
  clearError();

  try {
    const grossIncomeAnnual = Number(grossIncomeInput?.value) || 0;
    if (!Number.isFinite(grossIncomeAnnual) || grossIncomeAnnual <= 0) {
      setError('Gross annual income must be greater than 0.');
      return;
    }

    // Auto-calculate Net Income for affordability check
    const netIncomeMonthly = estimateNetIncome(grossIncomeAnnual);

    // FORCE 'net' basis so the utility uses our accurate Net Income for disposable calculation
    // instead of assuming Gross Income / 12 is available for spending.
    const incomeBasis = 'net';

    const expensesMonthly = Number(expensesInput?.value) || 0;
    const debtMonthly = Number(debtsInput?.value) || 0;
    const interestRate = Number(rateInput?.value) || 0;
    const termYears = Number(termInput?.value) || 0;
    const deposit = Number(depositInput?.value) || 0;

    // Use 'income' method (Multiple) which acts as a DUAL CAP:
    // 1. Caps at Income * Multiple (4.5x)
    // 2. Further reduces if Affordability (Net - Outgoings) is insufficient
    // This is the most realistic bank lending model.
    const method = 'income';

    // Standard lending multiple
    const incomeMultipleParam = multipleInput ? Number(multipleInput.value) : 4.5;
    const incomeMultiple = Number.isFinite(incomeMultipleParam) ? incomeMultipleParam : 4.5;

    // Validation
    if (interestRate <= 0) {
      setError('Interest rate must be positive.');
      return;
    }
    if (termYears <= 0) {
      setError('Loan term must be valid.');
      return;
    }

    console.log('Calculating Borrow Power:', { grossIncomeAnnual, netIncomeMonthly, expensesMonthly, debtMonthly, interestRate, termYears, incomeMultiple, deposit });

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

    if (!data || !Number.isFinite(data.maxBorrow)) {
      throw new Error('Calculation returned no data or invalid maxBorrow.');
    }

    if (data.hasAffordabilityGap) {
      setError('Not affordable: expenses and debts exceed income, or remaining disposable income is too low.');
      return;
    }

    // Populate 4 metric cards
    if (metricBorrow) {
      metricBorrow.textContent = fmt(Math.round(data.maxBorrow));
      animateMetric(metricBorrow);
    }
    if (metricProperty) {
      const propertyValue = Number.isFinite(data.maxPropertyPrice) ? data.maxPropertyPrice : (data.maxBorrow + deposit);
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
      // Show constraint based on what actually limited the loan?
      // Since we use method='income', it's limited by either 4.5x OR Affordability.
      // We can infer:
      const maxByMultiple = grossIncomeAnnual * incomeMultiple;
      // Check if maxBorrow is significantly less than what the multiple would allow
      const isAffordabilityConstrained = data.maxBorrow < (maxByMultiple * 0.99); // 1% buffer for floating point
      if (isAffordabilityConstrained) {
        constraintTag.textContent = `Limit determined by monthly budget (affordability)`;
      } else {
        constraintTag.textContent = `Limit determined by income multiple (${incomeMultiple}x)`;
      }
    }

    /* Explanation: capacity bar + scenario table */
    updateCapacityBar(data);
    renderScenarioTable(data);

  } catch (err) {
    console.error('Borrow Calc Error:', err);
    setError('An error occurred during calculation. Please check your inputs.');
  }
}

/* --- Init --- */

calculateButton?.addEventListener('click', () => {
  ensureExplanation().then(calculate);
});

async function initialize() {
  await ensureExplanation();
  calculate();
}

initialize();
