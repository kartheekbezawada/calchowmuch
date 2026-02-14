import { formatNumber } from '/assets/js/core/format.js';
import { setupButtonGroup } from '/assets/js/core/ui.js';
import { calculateRemortgage } from '/assets/js/core/loan-utils.js';

/* --- DOM Elements --- */
const balanceInput = document.querySelector('#remo-balance');
const currentRateInput = document.querySelector('#remo-current-rate');
const termInput = document.querySelector('#remo-term');
const newRateInput = document.querySelector('#remo-new-rate');
const newTermInput = document.querySelector('#remo-new-term');
const horizonInput = document.querySelector('#remo-horizon-years');

const balanceDisplay = document.querySelector('#remo-balance-display');
const currentRateDisplay = document.querySelector('#remo-current-rate-display');
const termDisplay = document.querySelector('#remo-term-display');
const newRateDisplay = document.querySelector('#remo-new-rate-display');
const newTermDisplay = document.querySelector('#remo-new-term-display');
const horizonDisplay = document.querySelector('#remo-horizon-display');

const calculateButton = document.querySelector('#remo-calculate');

const metricMonthly = document.querySelector('#remo-metric-monthly');
const metricAnnual = document.querySelector('#remo-metric-annual');
const metricBreakEven = document.querySelector('#remo-metric-break-even');
const metricTotal = document.querySelector('#remo-metric-total');
const resultNote = document.querySelector('#remo-result-note');
const errorDiv = document.querySelector('#remo-error');

/* --- Table Elements --- */
const monthlyWrap = document.querySelector('#remo-table-monthly-wrap');
const yearlyWrap = document.querySelector('#remo-table-yearly-wrap');
const monthlyTableBody = document.querySelector('#remo-table-monthly-body');
const yearlyTableBody = document.querySelector('#remo-table-yearly-body');
const tableViewGroup = document.querySelector('[data-button-group="remo-table-view"]');

/* --- Formatting --- */
function fmtCurrency(val) {
  return formatNumber(val, { maximumFractionDigits: 0 });
}
function fmtDecimal(val) {
  return formatNumber(val, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmt(val) {
  return formatNumber(val, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* --- Slider Logic --- */
function updateSliderFill(input) {
  if (!input || input.type !== 'range') return;
  const min = parseFloat(input.min) || 0;
  const max = parseFloat(input.max) || 100;
  const val = parseFloat(input.value) || 0;
  const pct = ((val - min) / (max - min)) * 100;
  input.style.setProperty('--fill', `${pct}%`);
}

function updateSliderDisplays() {
  if (balanceInput && balanceDisplay) {
    balanceDisplay.textContent = fmtCurrency(Number(balanceInput.value));
    updateSliderFill(balanceInput);
  }
  if (currentRateInput && currentRateDisplay) {
    currentRateDisplay.textContent = `${fmtDecimal(Number(currentRateInput.value))}%`;
    updateSliderFill(currentRateInput);
  }
  if (termInput && termDisplay) {
    termDisplay.textContent = `${termInput.value} yrs`;
    updateSliderFill(termInput);
  }
  if (newRateInput && newRateDisplay) {
    newRateDisplay.textContent = `${fmtDecimal(Number(newRateInput.value))}%`;
    updateSliderFill(newRateInput);
  }
  if (newTermInput && newTermDisplay) {
    newTermDisplay.textContent = `${newTermInput.value} yrs`;
    updateSliderFill(newTermInput);
  }
  if (horizonInput && horizonDisplay) {
    const val = Number(horizonInput.value);
    horizonDisplay.textContent = `${val} ${val === 1 ? 'year' : 'years'}`;
    updateSliderFill(horizonInput);
  }
}

/* --- Table Logic --- */
function toggleTableView(view) {
  const showMonthly = view !== 'yearly';
  monthlyWrap?.classList.toggle('is-hidden', !showMonthly);
  yearlyWrap?.classList.toggle('is-hidden', showMonthly);
}

if (tableViewGroup) {
  setupButtonGroup(tableViewGroup, {
    defaultValue: 'yearly',
    onChange: (value) => toggleTableView(value),
  });
}

function buildYearlyRows(costSeries) {
  const yearly = [];
  for (let i = 0; i < costSeries.length; i += 12) {
    const chunk = costSeries.slice(i, i + 12);
    const year = Math.floor(i / 12) + 1;
    const last = chunk[chunk.length - 1];

    yearly.push({
      year,
      currentCost: last.currentCost,
      newCost: last.newCost,
      savings: last.savings,
    });
  }
  return yearly;
}

function renderTables(costSeries) {
  if (monthlyTableBody) {
    monthlyTableBody.innerHTML = costSeries
      .map(
        (row) => `
          <tr>
            <td>${row.month}</td>
            <td>${fmt(row.currentCost)}</td>
            <td>${fmt(row.newCost)}</td>
            <td>${fmt(row.savings)}</td>
          </tr>`
      )
      .join('');
  }

  if (yearlyTableBody) {
    const yearlyRows = buildYearlyRows(costSeries);
    yearlyTableBody.innerHTML = yearlyRows
      .map(
        (row) => `
          <tr>
            <td>${row.year}</td>
            <td>${fmt(row.currentCost)}</td>
            <td>${fmt(row.newCost)}</td>
            <td>${fmt(row.savings)}</td>
          </tr>`
      )
      .join('');
  }
}

/* --- Calculation --- */
function animateMetric(el) {
  if (!el) return;
  el.classList.remove('is-updated');
  void el.offsetWidth;
  el.classList.add('is-updated');
}

function setError(msg) {
  if (errorDiv) {
    errorDiv.textContent = msg;
    errorDiv.style.display = 'block';
  }
  // Reset metrics
  [metricMonthly, metricAnnual, metricBreakEven, metricTotal].forEach(el => {
    if (el) el.textContent = '\u2014';
  });
}

function clearError() {
  if (errorDiv) {
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
  }
}

function calculate() {
  clearError();
  try {
    const balance = Number(balanceInput?.value) || 0;
    const currentRate = Number(currentRateInput?.value) || 0;
    const term = Number(termInput?.value) || 0;
    const newRate = Number(newRateInput?.value) || 0;
    const newTerm = Number(newTermInput?.value) || 0;
    const horizon = Number(horizonInput?.value) || 5;

    // Validation
    if (balance <= 0) { setError('Balance must be uniform positive.'); return; }

    const inputs = {
      balance,
      currentRate,
      remainingYears: term,
      newRate,
      newTermYears: newTerm,
      horizonYears: horizon,
      currentPayment: 0, // calc internally
      newFees: 0,
      exitFees: 0,
      legalFees: 0
    };

    const data = calculateRemortgage(inputs);
    if (!data) throw new Error('No data returned');

    // Update Outputs
    if (metricMonthly) { metricMonthly.textContent = fmtCurrency(data.monthlyDifference); animateMetric(metricMonthly); }
    if (metricAnnual) { metricAnnual.textContent = fmtCurrency(data.annualDifference); animateMetric(metricAnnual); }
    if (metricBreakEven) {
      metricBreakEven.textContent = data.breakEvenMonth ? `Month ${data.breakEvenMonth}` : 'Outside horizon';
      animateMetric(metricBreakEven);
    }
    if (metricTotal) { metricTotal.textContent = fmtCurrency(data.totalSavings); animateMetric(metricTotal); }

    if (resultNote) {
      const isSaving = data.monthlyDifference > 0;
      resultNote.textContent = isSaving
        ? `You save ${fmtCurrency(data.monthlyDifference)}/mo by switching.`
        : `Switching costs you ${fmtCurrency(Math.abs(data.monthlyDifference))}/mo more.`;
    }

    // Update Table
    if (data.costSeries) {
      renderTables(data.costSeries);
    }

  } catch (e) {
    console.error(e);
    setError('Calculation error. Please check inputs.');
  }
}

/* --- Initialization --- */
[balanceInput, currentRateInput, termInput, newRateInput, newTermInput, horizonInput].forEach(input => {
  if (!input) return;
  input.addEventListener('input', () => {
    updateSliderDisplays();
    calculate();
  });
});

calculateButton?.addEventListener('click', calculate);

// Initial State
updateSliderDisplays();
toggleTableView('yearly');
calculate();


