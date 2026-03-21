import { formatNumber } from '/assets/js/core/format.js';
import { setupButtonGroup } from '/assets/js/core/ui.js';
import { calculateRemortgage } from '/assets/js/core/loan-utils.js';
import {
  revealResultPanel,
  updateRangeFill,
  wireRangeWithField,
} from '/calculators/loan-calculators/shared/cluster-ux.js';

/* --- DOM Elements --- */
const balanceInput = document.querySelector('#remo-balance');
const currentRateInput = document.querySelector('#remo-current-rate');
const termInput = document.querySelector('#remo-term');
const newRateInput = document.querySelector('#remo-new-rate');
const newTermInput = document.querySelector('#remo-new-term');
const horizonInput = document.querySelector('#remo-horizon-years');

const balanceField = document.querySelector('#remo-balance-field');
const currentRateField = document.querySelector('#remo-current-rate-field');
const termField = document.querySelector('#remo-term-field');
const newRateField = document.querySelector('#remo-new-rate-field');
const newTermField = document.querySelector('#remo-new-term-field');
const horizonField = document.querySelector('#remo-horizon-field');

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
const explanationSummary = document.querySelector('#remo-exp-summary');
const resultDashboard = document.querySelector('#remo-results');

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

function parseLooseNumber(value) {
  const parsed = Number(String(value).replace(/,/g, '').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : NaN;
}

function updateSliderDisplays() {
  if (balanceInput && balanceDisplay) {
    balanceDisplay.textContent = fmtCurrency(Number(balanceInput.value));
    updateRangeFill(balanceInput);
  }
  if (currentRateInput && currentRateDisplay) {
    currentRateDisplay.textContent = `${fmtDecimal(Number(currentRateInput.value))}%`;
    updateRangeFill(currentRateInput);
  }
  if (termInput && termDisplay) {
    termDisplay.textContent = `${termInput.value} yrs`;
    updateRangeFill(termInput);
  }
  if (newRateInput && newRateDisplay) {
    newRateDisplay.textContent = `${fmtDecimal(Number(newRateInput.value))}%`;
    updateRangeFill(newRateInput);
  }
  if (newTermInput && newTermDisplay) {
    newTermDisplay.textContent = `${newTermInput.value} yrs`;
    updateRangeFill(newTermInput);
  }
  if (horizonInput && horizonDisplay) {
    const val = Number(horizonInput.value);
    horizonDisplay.textContent = `${val} ${val === 1 ? 'year' : 'years'}`;
    updateRangeFill(horizonInput);
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
  if (resultNote) {
    resultNote.textContent =
      'Update the balance, rates, or term settings, then calculate again to compare the switch clearly.';
  }
  // Reset metrics
  [metricMonthly, metricAnnual, metricBreakEven, metricTotal].forEach((el) => {
    if (el) el.textContent = '\u2014';
  });
}

function clearError() {
  if (errorDiv) {
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
  }
}

function calculate(options = {}) {
  const shouldReveal = options.reveal === true;
  clearError();
  try {
    const balance = Number(balanceInput?.value) || 0;
    const currentRate = Number(currentRateInput?.value) || 0;
    const term = Number(termInput?.value) || 0;
    const newRate = Number(newRateInput?.value) || 0;
    const newTerm = Number(newTermInput?.value) || 0;
    const horizon = Number(horizonInput?.value) || 5;

    // Validation
    if (balance <= 0) {
      setError('Current balance must be greater than 0.');
      if (shouldReveal) {
        revealResultPanel({ resultPanel: resultDashboard, focusTarget: errorDiv });
      }
      return;
    }
    if (term <= 1 || newTerm <= 1) {
      setError('Loan term must be at least 1 year.');
      if (shouldReveal) {
        revealResultPanel({ resultPanel: resultDashboard, focusTarget: errorDiv });
      }
      return;
    }

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
      legalFees: 0,
    };

    const data = calculateRemortgage(inputs);
    if (!data) throw new Error('No data returned');

    // Update Outputs
    if (metricMonthly) {
      metricMonthly.textContent = fmtCurrency(data.monthlyDifference);
      animateMetric(metricMonthly);
    }
    if (metricAnnual) {
      metricAnnual.textContent = fmtCurrency(data.annualDifference);
      animateMetric(metricAnnual);
    }
    if (metricBreakEven) {
      metricBreakEven.textContent = data.breakEvenMonth
        ? `Month ${data.breakEvenMonth}`
        : 'Not within horizon';
      animateMetric(metricBreakEven);
    }
    if (metricTotal) {
      metricTotal.textContent = fmtCurrency(data.totalSavings);
      animateMetric(metricTotal);
    }

    if (resultNote) {
      const isSaving = data.monthlyDifference > 0;
      resultNote.textContent = isSaving
        ? `You save ${fmtCurrency(data.monthlyDifference)}/mo by switching.`
        : `Switching costs you ${fmtCurrency(Math.abs(data.monthlyDifference))}/mo more.`;
    }
    if (explanationSummary) {
      explanationSummary.textContent = `Over ${horizon} years, switching changes total cost by ${fmtCurrency(
        data.totalSavings
      )}.`;
    }

    // Update Table
    if (data.costSeries) {
      renderTables(data.costSeries);
    }
    if (shouldReveal) {
      revealResultPanel({ resultPanel: resultDashboard, focusTarget: metricMonthly });
    }
  } catch (e) {
    console.error(e);
    setError('Calculation error. Please check inputs.');
    if (shouldReveal) {
      revealResultPanel({ resultPanel: resultDashboard, focusTarget: errorDiv });
    }
  }
}

/* --- Initialization --- */
[
  {
    rangeInput: balanceInput,
    textInput: balanceField,
    formatFieldValue: (value) => String(Math.round(value)),
  },
  {
    rangeInput: currentRateInput,
    textInput: currentRateField,
    formatFieldValue: (value) => fmtDecimal(value),
  },
  {
    rangeInput: termInput,
    textInput: termField,
    formatFieldValue: (value) => String(Math.round(value)),
  },
  {
    rangeInput: newRateInput,
    textInput: newRateField,
    formatFieldValue: (value) => fmtDecimal(value),
  },
  {
    rangeInput: newTermInput,
    textInput: newTermField,
    formatFieldValue: (value) => String(Math.round(value)),
  },
  {
    rangeInput: horizonInput,
    textInput: horizonField,
    formatFieldValue: (value) => String(Math.round(value)),
  },
].forEach((config) => {
  wireRangeWithField({
    ...config,
    parseFieldValue: parseLooseNumber,
    onVisualUpdate: updateSliderDisplays,
  });
});

calculateButton?.addEventListener('click', () => calculate({ reveal: true }));

// Initial State
updateSliderDisplays();
toggleTableView('yearly');
calculate({ reveal: false });
