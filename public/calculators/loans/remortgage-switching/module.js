import { formatNumber } from '/assets/js/core/format.js';
import { setupButtonGroup } from '/assets/js/core/ui.js';
import { hasMaxDigits } from '/assets/js/core/validate.js';
import { calculateRemortgage } from '/assets/js/core/loan-utils.js';

const balanceInput = document.querySelector('#remo-balance');
const currentRateInput = document.querySelector('#remo-current-rate');
const termInput = document.querySelector('#remo-term');
const currentPaymentInput = document.querySelector('#remo-current-payment');
const newRateInput = document.querySelector('#remo-new-rate');
const newTermInput = document.querySelector('#remo-new-term');
const newFeesInput = document.querySelector('#remo-new-fees');
const exitFeesInput = document.querySelector('#remo-exit-fees');
const legalFeesInput = document.querySelector('#remo-legal-fees');
const calculateButton = document.querySelector('#remo-calculate');

const horizonGroup = document.querySelector('[data-button-group="remo-horizon"]');
const feesToggleGroup = document.querySelector('[data-button-group="remo-fees-toggle"]');
const feesOptions = document.querySelector('#remo-fees-options');

const explanationRoot = document.querySelector('#loan-remortgage-explanation');
const errorDiv = document.querySelector('#remo-error');
const promptText = document.querySelector('#remo-prompt');
const outputsRoot = document.querySelector('#remo-outputs');
const currentPaymentValue = explanationRoot?.querySelector('[data-remo="current-payment"]');
const newPaymentValue = explanationRoot?.querySelector('[data-remo="new-payment"]');
const monthlyDiffValue = explanationRoot?.querySelector('[data-remo="monthly-diff"]');
const annualDiffValue = explanationRoot?.querySelector('[data-remo="annual-diff"]');
const feesValue = explanationRoot?.querySelector('[data-remo="fees"]');
const breakEvenValue = explanationRoot?.querySelector('[data-remo="break-even"]');
const totalCurrentValue = explanationRoot?.querySelector('[data-remo="total-current"]');
const totalNewValue = explanationRoot?.querySelector('[data-remo="total-new"]');
const totalSavingsValue = explanationRoot?.querySelector('[data-remo="total-savings"]');

const tableBody = document.querySelector('#remo-table-body');

const MAX_INPUT_LENGTH = 10;
const FORMAT_HINTS = Object.freeze({ number_decimals: 2, thousands_separator: ',' });

let scheduled = null;
let hasCalculated = false;
let feesIncluded = false;

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

const horizonButtons = setupButtonGroup(horizonGroup, {
  defaultValue: '2',
  onChange: () => scheduleCalculate(),
});

const feesToggleButtons = setupButtonGroup(feesToggleGroup, {
  defaultValue: 'exclude',
  onChange: (value) => {
    setFeesIncluded(value === 'include');
    scheduleCalculate();
  },
});

[
  balanceInput,
  currentRateInput,
  termInput,
  currentPaymentInput,
  newRateInput,
  newTermInput,
  newFeesInput,
  exitFeesInput,
  legalFeesInput,
].forEach(enforceMaxLength);

function setOutputsVisible(isVisible) {
  outputsRoot?.classList.toggle('is-hidden', !isVisible);
  promptText?.classList.toggle('is-hidden', isVisible);
}

function setFeesIncluded(isIncluded) {
  feesIncluded = isIncluded;
  feesOptions?.classList.toggle('is-hidden', !isIncluded);
}

function formatTableNumber(value) {
  return formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatOutputNumber(value) {
  return formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function clearOutputs() {
  if (currentPaymentValue) currentPaymentValue.textContent = '';
  if (newPaymentValue) newPaymentValue.textContent = '';
  if (monthlyDiffValue) monthlyDiffValue.textContent = '';
  if (annualDiffValue) annualDiffValue.textContent = '';
  if (feesValue) feesValue.textContent = '';
  if (breakEvenValue) breakEvenValue.textContent = '';
  if (totalCurrentValue) totalCurrentValue.textContent = '';
  if (totalNewValue) totalNewValue.textContent = '';
  if (totalSavingsValue) totalSavingsValue.textContent = '';
  if (tableBody) {
    tableBody.innerHTML = '';
  }
}

function setError(message) {
  clearOutputs();
  setOutputsVisible(false);
  if (errorDiv) {
    errorDiv.textContent = message;
  }
}

function buildContract(inputs, model) {
  const feesTotal = inputs.newFees + inputs.exitFees + inputs.legalFees;
  const horizonMonths = Math.round(inputs.horizonYears * 12);

  return {
    current: {
      apr_percent: inputs.currentRate,
      remaining_term_months: Math.round(inputs.remainingYears * 12),
      monthly_payment: inputs.currentPayment,
      balance_remaining: inputs.balance,
      fees_total: 0,
    },
    new: {
      apr_percent: inputs.newRate,
      term_months: Math.round(inputs.newTermYears * 12),
      monthly_payment: model.newPayment,
      fees_total: feesTotal,
      initial_rate_period_months: null,
    },
    comparison: {
      horizon_months: horizonMonths,
    },
    summary: {
      current_monthly_payment: model.baselinePayment,
      new_monthly_payment: model.newPayment,
      monthly_difference: model.baselinePayment - model.newPayment,
      annual_difference: (model.baselinePayment - model.newPayment) * 12,
      current_deal_fees_total: 0,
      new_deal_fees_total: feesTotal,
      fees_difference_total: feesTotal,
      break_even_month: model.breakEvenMonth,
      break_even_label: model.breakEvenMonth ? `month ${model.breakEvenMonth}` : 'not within the horizon',
      total_cost_current_at_horizon: model.totalCurrent,
      total_cost_new_at_horizon: model.totalNew,
      total_savings_at_horizon: model.totalSavings,
    },
    table: {
      rows: model.costSeries.map((row) => ({
        period_month: row.month,
        current: { cumulative_cost: row.currentCost },
        new: { cumulative_cost: row.newCost },
        difference: row.savings,
      })),
    },
    graph: {
      series: model.costSeries.map((row) => ({
        month: row.month,
        current_cumulative_cost: row.currentCost,
        new_cumulative_cost: row.newCost,
      })),
      break_even_month: model.breakEvenMonth,
    },
    format: FORMAT_HINTS,
  };
}

function updateExplanation(contract) {
  if (!explanationRoot) {
    return;
  }

  if (currentPaymentValue) currentPaymentValue.textContent = formatOutputNumber(contract.summary.current_monthly_payment);
  if (newPaymentValue) newPaymentValue.textContent = formatOutputNumber(contract.summary.new_monthly_payment);
  if (monthlyDiffValue) monthlyDiffValue.textContent = formatOutputNumber(contract.summary.monthly_difference);
  if (annualDiffValue) annualDiffValue.textContent = formatOutputNumber(contract.summary.annual_difference);
  if (feesValue) feesValue.textContent = formatOutputNumber(contract.summary.new_deal_fees_total);
  if (breakEvenValue) breakEvenValue.textContent = contract.summary.break_even_label;

  if (totalCurrentValue) totalCurrentValue.textContent = formatOutputNumber(contract.summary.total_cost_current_at_horizon);
  if (totalNewValue) totalNewValue.textContent = formatOutputNumber(contract.summary.total_cost_new_at_horizon);
  if (totalSavingsValue) totalSavingsValue.textContent = formatOutputNumber(contract.summary.total_savings_at_horizon);
}

function updateTable(contract) {
  if (!tableBody) {
    return;
  }

  tableBody.innerHTML = contract.table.rows
    .map(
      (row) => `
        <tr>
          <td>${row.period_month}</td>
          <td>${formatTableNumber(row.current.cumulative_cost)}</td>
          <td>${formatTableNumber(row.new.cumulative_cost)}</td>
          <td>${formatTableNumber(row.difference)}</td>
        </tr>`
    )
    .join('');
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

function calculate() {
  if (!explanationRoot) {
    return;
  }

  if (errorDiv) {
    errorDiv.textContent = '';
  }
  clearOutputs();

  // Validate input maxlength per REMO-UI-3
  const inputsToValidate = [
    balanceInput,
    currentRateInput,
    termInput,
    currentPaymentInput,
    newRateInput,
    newTermInput,
    newFeesInput,
    ...(feesIncluded ? [exitFeesInput, legalFeesInput] : []),
  ].filter(Boolean);

  const invalidLength = inputsToValidate.find((input) => !hasMaxDigits(input.value, 10));
  if (invalidLength) {
    setError('Inputs must be 10 digits or fewer.');
    return;
  }

  const balance = Number(balanceInput?.value);
  if (!Number.isFinite(balance) || balance <= 0) {
    setError('Current balance must be greater than 0.');
    return;
  }

  const currentRate = Number(currentRateInput?.value);
  if (!Number.isFinite(currentRate) || currentRate < 0) {
    setError('Current rate must be 0 or more.');
    return;
  }

  const remainingYears = Number(termInput?.value);
  if (!Number.isFinite(remainingYears) || remainingYears < 1) {
    setError('Remaining term must be at least 1 year.');
    return;
  }

  const currentPayment = Number(currentPaymentInput?.value);
  if (!Number.isFinite(currentPayment) || currentPayment < 0) {
    setError('Current payment must be 0 or more.');
    return;
  }

  const newRate = Number(newRateInput?.value);
  if (!Number.isFinite(newRate) || newRate < 0) {
    setError('New rate must be 0 or more.');
    return;
  }

  const newTermYears = Number(newTermInput?.value);
  if (!Number.isFinite(newTermYears) || newTermYears < 1) {
    setError('New term must be at least 1 year.');
    return;
  }

  const newFees = Number(newFeesInput?.value);
  if (!Number.isFinite(newFees) || newFees < 0) {
    setError('Fees must be 0 or more.');
    return;
  }

  const exitFees = feesIncluded ? Number(exitFeesInput?.value) : 0;
  const legalFees = feesIncluded ? Number(legalFeesInput?.value) : 0;
  if ([exitFees, legalFees].some((value) => !Number.isFinite(value) || value < 0)) {
    setError('Fees must be 0 or more.');
    return;
  }

  const horizonYears = Number(horizonButtons?.getValue() ?? 2);

  const inputs = {
    balance,
    currentRate,
    remainingYears,
    currentPayment,
    newRate,
    newTermYears,
    newFees,
    exitFees,
    legalFees,
    horizonYears,
  };

  const data = calculateRemortgage({
    ...inputs,
  });

  const contract = buildContract(inputs, data);
  updateExplanation(contract);
  updateTable(contract);

  hasCalculated = true;
  setOutputsVisible(true);
}

calculateButton?.addEventListener('click', () => {
  hasCalculated = false;
  calculate();
});

[balanceInput, currentRateInput, termInput, currentPaymentInput, newRateInput, newTermInput, newFeesInput, exitFeesInput, legalFeesInput]
  .filter(Boolean)
  .forEach((input) =>
    input.addEventListener('input', () => {
      if (errorDiv) {
        errorDiv.textContent = '';
      }
      scheduleCalculate();
    })
  );

setFeesIncluded(feesToggleButtons?.getValue() === 'include');
setOutputsVisible(false);
clearOutputs();
