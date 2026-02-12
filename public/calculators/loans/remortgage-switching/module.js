import { formatNumber } from '/assets/js/core/format.js';
import { setupButtonGroup } from '/assets/js/core/ui.js';
import { hasMaxDigits } from '/assets/js/core/validate.js';
import { calculateRemortgage } from '/assets/js/core/loan-utils.js';

const balanceInput = document.querySelector('#remo-balance');
const currentRateInput = document.querySelector('#remo-current-rate');
const termInput = document.querySelector('#remo-term');
const newRateInput = document.querySelector('#remo-new-rate');
const newTermInput = document.querySelector('#remo-new-term');
const horizonInput = document.querySelector('#remo-horizon-years');
const horizonDisplay = document.querySelector('#remo-horizon-display');
const calculateButton = document.querySelector('#remo-calculate');

const monthlyWrap = document.querySelector('#remo-table-monthly-wrap');
const yearlyWrap = document.querySelector('#remo-table-yearly-wrap');
const monthlyTableBody = document.querySelector('#remo-table-monthly-body');
const yearlyTableBody = document.querySelector('#remo-table-yearly-body');

const metricMonthly = document.querySelector('#remo-metric-monthly');
const metricAnnual = document.querySelector('#remo-metric-annual');
const metricBreakEven = document.querySelector('#remo-metric-break-even');
const metricTotal = document.querySelector('#remo-metric-total');
const resultNote = document.querySelector('#remo-result-note');
const summaryText = document.querySelector('#remo-exp-summary');
const errorDiv = document.querySelector('#remo-error');

const tableViewGroup = document.querySelector('[data-button-group="remo-table-view"]');

const MAX_INPUT_LENGTH = 10;
const EMPTY = '--';

let hasCalculated = false;
let scheduled = null;

function fmt(value) {
  return formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function clearTables() {
  if (monthlyTableBody) {
    monthlyTableBody.innerHTML = '';
  }
  if (yearlyTableBody) {
    yearlyTableBody.innerHTML = '';
  }
}

function clearOutputs() {
  if (metricMonthly) metricMonthly.textContent = '--';
  if (metricAnnual) metricAnnual.textContent = '--';
  if (metricBreakEven) metricBreakEven.textContent = '--';
  if (metricTotal) metricTotal.textContent = '--';
  if (resultNote) resultNote.textContent = 'Press calculate to compare your current and new cost paths.';
  if (summaryText) {
    summaryText.textContent = 'Set your inputs and click calculate to compare cumulative costs over your selected horizon.';
  }
  clearTables();
}

function setError(message) {
  clearOutputs();
  if (errorDiv) {
    errorDiv.textContent = message;
  }
}

function updateHorizonDisplay() {
  if (!horizonInput || !horizonDisplay) {
    return;
  }
  const years = Number(horizonInput.value || 5);
  horizonDisplay.textContent = `${years} ${years === 1 ? 'year' : 'years'}`;

  const min = Number(horizonInput.min || 2);
  const max = Number(horizonInput.max || 10);
  const pct = ((years - min) / (max - min)) * 100;
  horizonInput.style.setProperty('--fill', `${pct}%`);
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

function toggleTableView(view) {
  const showMonthly = view !== 'yearly';
  monthlyWrap?.classList.toggle('is-hidden', !showMonthly);
  yearlyWrap?.classList.toggle('is-hidden', showMonthly);
}

setupButtonGroup(tableViewGroup, {
  defaultValue: 'yearly',
  onChange: (value) => toggleTableView(value),
});

[
  balanceInput,
  currentRateInput,
  termInput,
  newRateInput,
  newTermInput,
].forEach(enforceMaxLength);

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
  if (!monthlyTableBody || !yearlyTableBody) {
    return;
  }

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

function updateOutputs(data, inputs) {
  const monthlyDifference = data.monthlyDifference;
  const annualDifference = data.annualDifference;

  if (metricMonthly) metricMonthly.textContent = fmt(monthlyDifference);
  if (metricAnnual) metricAnnual.textContent = fmt(annualDifference);
  if (metricBreakEven) {
    metricBreakEven.textContent = data.breakEvenMonth ? `Month ${data.breakEvenMonth}` : 'Not within horizon';
  }
  if (metricTotal) metricTotal.textContent = fmt(data.totalSavings);

  if (resultNote) {
    const direction = monthlyDifference >= 0 ? 'lower' : 'higher';
    resultNote.textContent = `New monthly cost is ${fmt(Math.abs(monthlyDifference))} ${direction} than current over ${inputs.horizonYears} years.`;
  }

  if (summaryText) {
    summaryText.textContent = `Current monthly cost ${fmt(data.baselinePayment)} vs new monthly cost ${fmt(data.newPayment)}. Over ${inputs.horizonYears} years, cumulative cost changes from ${fmt(data.totalCurrent)} to ${fmt(data.totalNew)}, with net saving ${fmt(data.totalSavings)}.`;
  }
}

function readAndValidateInputs() {
  const inputsToValidate = [balanceInput, currentRateInput, termInput, newRateInput, newTermInput].filter(Boolean);
  const invalidLength = inputsToValidate.find((input) => !hasMaxDigits(input.value, MAX_INPUT_LENGTH));
  if (invalidLength) {
    return { error: 'Inputs must be 10 digits or fewer.' };
  }

  const balance = Number(balanceInput?.value);
  if (!Number.isFinite(balance) || balance <= 0) {
    return { error: 'Current balance must be greater than 0.' };
  }

  const currentRate = Number(currentRateInput?.value);
  if (!Number.isFinite(currentRate) || currentRate < 0) {
    return { error: 'Current rate must be 0 or more.' };
  }

  const remainingYears = Number(termInput?.value);
  if (!Number.isFinite(remainingYears) || remainingYears < 1) {
    return { error: 'Remaining term must be at least 1 year.' };
  }

  const newRate = Number(newRateInput?.value);
  if (!Number.isFinite(newRate) || newRate < 0) {
    return { error: 'New rate must be 0 or more.' };
  }

  const newTermYears = Number(newTermInput?.value);
  if (!Number.isFinite(newTermYears) || newTermYears < 1) {
    return { error: 'New term must be at least 1 year.' };
  }

  const horizonYears = Number(horizonInput?.value || 5);
  if (!Number.isFinite(horizonYears) || horizonYears < 2 || horizonYears > 10) {
    return { error: 'Horizon must be between 2 and 10 years.' };
  }

  return {
    values: {
      balance,
      currentRate,
      remainingYears,
      currentPayment: 0,
      newRate,
      newTermYears,
      newFees: 0,
      exitFees: 0,
      legalFees: 0,
      horizonYears,
    },
  };
}

function calculate({ enableAutoRecalc = true } = {}) {
  if (errorDiv) {
    errorDiv.textContent = '';
  }
  clearTables();

  const { error, values } = readAndValidateInputs();
  if (error) {
    setError(error);
    return;
  }

  const data = calculateRemortgage(values);

  updateOutputs(data, values);
  renderTables(data.costSeries);
  hasCalculated = enableAutoRecalc;
}

function scheduleCalculate() {
  if (!hasCalculated) {
    return;
  }
  if (scheduled) {
    window.clearTimeout(scheduled);
  }
  scheduled = window.setTimeout(() => {
    calculate();
    scheduled = null;
  }, 120);
}

calculateButton?.addEventListener('click', () => {
  hasCalculated = false;
  calculate();
});

[balanceInput, currentRateInput, termInput, newRateInput, newTermInput, horizonInput]
  .filter(Boolean)
  .forEach((input) => {
    input.addEventListener('input', () => {
      if (errorDiv) {
        errorDiv.textContent = '';
      }
      if (input === horizonInput) {
        updateHorizonDisplay();
      }
      scheduleCalculate();
    });
  });

updateHorizonDisplay();
toggleTableView('yearly');
calculate({ enableAutoRecalc: false });
