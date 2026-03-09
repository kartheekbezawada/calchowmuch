import { formatNumber } from '/assets/js/core/format.js';
import { setPageMetadata, setupButtonGroup } from '/assets/js/core/ui.js';
import { calculateBorrow, computeMonthlyPayment } from '/assets/js/core/loan-utils.js';

const metadata = {
  title: 'How Much Can I Borrow | Mortgage Affordability | CalcHowMuch',
  description:
    'Estimate your maximum mortgage borrowing using income multiples or payment-to-income checks, then compare monthly payments and total property budget.',
  canonical: 'https://calchowmuch.com/loan-calculators/how-much-can-i-borrow/',
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
const multipleDisplay = document.querySelector('#bor-multiple-display');
const depositDisplay = document.querySelector('#bor-deposit-display');

const multipleRow = document.querySelector('#bor-multiple-row');
const paymentNoteRow = document.querySelector('#bor-payment-note-row');
const calculateButton = document.querySelector('#bor-calculate');

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
[grossIncomeInput, expensesInput, debtsInput, rateInput, termInput, multipleInput, depositInput]
  .filter(Boolean)
  .forEach((input) => {
    input.addEventListener('input', () => {
      updateSliderDisplays();
      calculate();
    });
  });

updateSliderDisplays();

let selectedMethod = 'income';
function updateMethodUi(method) {
  selectedMethod = method === 'payment' ? 'payment' : 'income';
  if (multipleRow) {
    multipleRow.classList.toggle('is-hidden', selectedMethod !== 'income');
    multipleRow.hidden = selectedMethod !== 'income';
    multipleRow.style.display = selectedMethod === 'income' ? '' : 'none';
  }
  if (paymentNoteRow) {
    paymentNoteRow.classList.toggle('is-hidden', selectedMethod !== 'payment');
    paymentNoteRow.hidden = selectedMethod !== 'payment';
    paymentNoteRow.style.display = selectedMethod === 'payment' ? '' : 'none';
  }
}

if (methodGroup) {
  setupButtonGroup(methodGroup, {
    defaultValue: 'income',
    onChange: (value) => {
      updateMethodUi(value);
      calculate();
    },
  });
} else {
  updateMethodUi('income');
}

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
    const response = await fetch('/calculators/loan-calculators/how-much-can-i-borrow/explanation.html');
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

  const stack = root.querySelector('[data-bor="cap-stack"]');
  const hoverLabel = root.querySelector('[data-bor="cap-hover-label"]');
  const hoverValue = root.querySelector('[data-bor="cap-hover-value"]');
  const segExpenses = root.querySelector('[data-bor="seg-expenses"]');
  const segDebts = root.querySelector('[data-bor="seg-debts"]');
  const segMortgage = root.querySelector('[data-bor="seg-mortgage"]');
  const segBuffer = root.querySelector('[data-bor="seg-buffer"]');

  const income = Number(data.monthlyIncome) || 0;
  const expenses = Math.max(0, Number(data.expensesMonthly) || 0);
  const debts = Math.max(0, Number(data.debtMonthly) || 0);
  const mortgage = Math.max(0, Number(data.monthlyPayment) || 0);
  const buffer = Math.max(0, income - expenses - debts - mortgage);
  const totalChartValue = expenses + debts + mortgage + buffer;

  const setLeg = (key, val) => {
    const el = root.querySelector(`[data-bor="legend-${key}"]`);
    if (el) el.textContent = fmt(Math.round(val));
  };

  setLeg('expenses', expenses);
  setLeg('debts', debts);
  setLeg('mortgage', mortgage);
  setLeg('buffer', buffer);

  const setHoverText = (label, pct) => {
    if (hoverLabel) hoverLabel.textContent = label;
    if (hoverValue) hoverValue.textContent = `${pct.toFixed(1)}%`;
  };

  const resetHoverText = () => {
    if (hoverLabel) hoverLabel.textContent = 'Tap or hover';
    if (hoverValue) hoverValue.textContent = '--%';
  };

  if (income <= 0 || totalChartValue <= 0) {
    if (stack) {
      stack.setAttribute('aria-label', 'Monthly income capacity breakdown unavailable');
    }
    if (hoverLabel) hoverLabel.textContent = 'No data';
    if (hoverValue) hoverValue.textContent = '--%';
    [segExpenses, segDebts, segMortgage, segBuffer].forEach((segment) => {
      if (!segment) return;
      segment.style.flexBasis = '0%';
      segment.style.opacity = '0';
      segment.style.pointerEvents = 'none';
      segment.classList.remove('is-active');
    });
    return;
  }

  const capPercent = (value) => Math.max(0, (value / totalChartValue) * 100);
  const expensesPct = capPercent(expenses);
  const debtsPct = capPercent(debts);
  const mortgagePct = capPercent(mortgage);
  const bufferPct = Math.max(0, 100 - expensesPct - debtsPct - mortgagePct);

  const segments = [
    { el: segExpenses, label: 'Expenses', pct: expensesPct },
    { el: segDebts, label: 'Debts', pct: debtsPct },
    { el: segMortgage, label: 'Mortgage', pct: mortgagePct },
    { el: segBuffer, label: 'Buffer', pct: bufferPct },
  ];

  const setActiveSegment = (segment) => {
    segments.forEach((entry) => entry.el?.classList.remove('is-active'));
    if (!segment || !segment.el || segment.pct <= 0.01) {
      resetHoverText();
      return;
    }
    segment.el.classList.add('is-active');
    setHoverText(segment.label, segment.pct);
  };

  let pinnedSegment = null;

  segments.forEach((segment) => {
    if (!segment.el) {
      return;
    }

    segment.el.style.flexBasis = `${segment.pct.toFixed(1)}%`;
    segment.el.style.opacity = segment.pct > 0.01 ? '1' : '0';
    segment.el.style.pointerEvents = segment.pct > 0.01 ? 'auto' : 'none';
    segment.el.dataset.label = segment.label;
    segment.el.dataset.pct = segment.pct.toFixed(1);
    segment.el.setAttribute('tabindex', segment.pct > 0.01 ? '0' : '-1');
    segment.el.setAttribute('title', `${segment.label}: ${segment.pct.toFixed(1)}%`);
    segment.el.setAttribute('aria-label', `${segment.label} ${segment.pct.toFixed(1)} percent`);

    segment.el.onmouseenter = () => setActiveSegment(segment);
    segment.el.onfocus = segment.el.onmouseenter;
    segment.el.onmouseleave = () => setActiveSegment(pinnedSegment);
    segment.el.onblur = segment.el.onmouseleave;
    segment.el.onclick = () => {
      if (segment.pct <= 0.01) return;
      pinnedSegment = segment;
      setActiveSegment(segment);
    };
    segment.el.onkeydown = (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      pinnedSegment = segment;
      setActiveSegment(segment);
    };
  });

  pinnedSegment = segments.reduce(
    (best, current) => (!best || current.pct > best.pct ? current : best),
    null
  );
  setActiveSegment(pinnedSegment);

  if (stack) {
    stack.setAttribute(
      'aria-label',
      `Monthly income capacity breakdown: Expenses ${expensesPct.toFixed(1)} percent, Debts ${debtsPct.toFixed(1)} percent, Mortgage ${mortgagePct.toFixed(1)} percent, Buffer ${bufferPct.toFixed(1)} percent`
    );
  }
}

function renderScenarioTable(data) {
  const root = document.querySelector('#loan-borrow-explanation');
  const tbody = root?.querySelector('#bor-scenario-body');
  if (!tbody || !data.rateSeries) return;

  const rows = data.rateSeries.map((item) => {
    const isCurrent = Math.abs(item.rate - data.interestRate) < 0.01;
    // Show rate sensitivity for current borrowing target.
    const payment = computeMonthlyPayment(data.maxBorrow, item.rate, data.termYears * 12);
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

    const method = selectedMethod;

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

    console.log('Calculating Borrow Power:', {
      grossIncomeAnnual,
      netIncomeMonthly,
      expensesMonthly,
      debtMonthly,
      interestRate,
      termYears,
      incomeMultiple,
      deposit,
    });

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
      setError(
        'Not affordable: expenses and debts exceed income, or remaining disposable income is too low.'
      );
      return;
    }

    // Populate 4 metric cards
    if (metricBorrow) {
      metricBorrow.textContent = fmt(Math.round(data.maxBorrow));
      animateMetric(metricBorrow);
    }
    if (metricProperty) {
      const propertyValue = Number.isFinite(data.maxPropertyPrice)
        ? data.maxPropertyPrice
        : data.maxBorrow + deposit;
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
      if (method === 'payment') {
        constraintTag.textContent = 'Payment-to-income cap';
      } else {
        constraintTag.textContent = `Income multiple (${incomeMultiple}x)`;
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
