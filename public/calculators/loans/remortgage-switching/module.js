import { formatNumber } from '/assets/js/core/format.js';
import { setupButtonGroup } from '/assets/js/core/ui.js';
import { hasMaxDigits } from '/assets/js/core/validate.js';
import { calculateRemortgage } from '/assets/js/core/loan-utils.js';
import { buildPolyline, getPaddedMinMax } from '/assets/js/core/graph-utils.js';

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

const lineNew = document.querySelector('#remo-line-new');
const lineCurrent = document.querySelector('#remo-line-current');
const graphYMax = document.querySelector('#remo-y-max');
const graphYMid = document.querySelector('#remo-y-mid');
const graphYMin = document.querySelector('#remo-y-min');
const graphXStart = document.querySelector('#remo-x-start');
const graphXEnd = document.querySelector('#remo-x-end');
const graphNote = document.querySelector('#remo-graph-note');
const breakMarker = document.querySelector('#remo-break-marker');
const breakLine = document.querySelector('#remo-break-line');
const breakDot = document.querySelector('#remo-break-dot');
const graphPanel = document.querySelector('#remo-graph');
const graphMain = graphPanel?.querySelector('.graph-main');
const graphTooltip = document.querySelector('#remo-graph-tooltip');
const graphTooltipTitle = document.querySelector('#remo-graph-tooltip-title');
const graphTooltipCurrent = document.querySelector('#remo-graph-tooltip-current');
const graphTooltipNew = document.querySelector('#remo-graph-tooltip-new');

const MAX_INPUT_LENGTH = 10;
const FORMAT_HINTS = Object.freeze({ number_decimals: 2, thousands_separator: ',' });

let latestContract = null;
let hoverBound = false;
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

function formatAxisValue(value) {
  return formatNumber(value, { maximumFractionDigits: 0 });
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
  lineNew?.setAttribute('points', '');
  lineCurrent?.setAttribute('points', '');
  if (breakMarker) {
    breakMarker.setAttribute('display', 'none');
  }

  if (graphTooltip) {
    graphTooltip.classList.add('is-hidden');
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

function setGraphTooltip(monthIndex) {
  if (!latestContract || !graphTooltip || !graphTooltipTitle || !graphTooltipCurrent || !graphTooltipNew) {
    return;
  }
  const entry = latestContract.graph.series[monthIndex - 1];
  if (!entry) {
    graphTooltip.classList.add('is-hidden');
    return;
  }

  graphTooltipTitle.textContent = `Month ${entry.month}`;
  graphTooltipCurrent.textContent = `Current: ${formatTableNumber(entry.current_cumulative_cost)}`;
  graphTooltipNew.textContent = `New: ${formatTableNumber(entry.new_cumulative_cost)}`;
  graphTooltip.classList.remove('is-hidden');
}

function bindGraphHover() {
  if (hoverBound || !graphMain) {
    return;
  }
  hoverBound = true;

  graphMain.addEventListener('mousemove', (event) => {
    if (!latestContract || !latestContract.graph?.series?.length) {
      return;
    }
    const rect = graphMain.getBoundingClientRect();
    const relativeX = Math.min(rect.width, Math.max(0, event.clientX - rect.left));
    const ratio = rect.width > 0 ? relativeX / rect.width : 0;
    const horizonMonths = latestContract.graph.series.length;
    const index = Math.min(horizonMonths, Math.max(1, Math.round(ratio * (horizonMonths - 1)) + 1));
    setGraphTooltip(index);
  });

  graphMain.addEventListener('mouseleave', () => {
    graphTooltip?.classList.add('is-hidden');
  });
}

function updateGraph(contract) {
  if (!lineNew || !lineCurrent) {
    return;
  }

  const currentValues = contract.graph.series.map((row) => row.current_cumulative_cost);
  const newValues = contract.graph.series.map((row) => row.new_cumulative_cost);
  const { min, max } = getPaddedMinMax([...currentValues, ...newValues], 0.1);
  const mid = (min + max) / 2;

  lineCurrent.setAttribute('points', buildPolyline(currentValues, min, max));
  lineNew.setAttribute('points', buildPolyline(newValues, min, max));
  graphYMax.textContent = formatAxisValue(max);
  graphYMid.textContent = formatAxisValue(mid);
  graphYMin.textContent = formatAxisValue(min);
  graphXStart.textContent = '1';
  graphXEnd.textContent = String(contract.graph.series.length);

  if (graphNote) {
    graphNote.textContent = contract.graph.break_even_month
      ? `Break-even at month ${contract.graph.break_even_month}`
      : 'No break-even within horizon';
  }

  if (contract.graph.break_even_month && breakMarker && breakLine && breakDot) {
    const xRatio =
      contract.graph.series.length > 1
        ? (contract.graph.break_even_month - 1) / (contract.graph.series.length - 1)
        : 0;
    const x = xRatio * 100;
    const breakRow = contract.graph.series[contract.graph.break_even_month - 1];
    const breakValue = breakRow ? breakRow.new_cumulative_cost : 0;
    const y = max === min ? 50 : 100 - ((breakValue - min) / (max - min)) * 100;
    const clampedY = Math.min(100, Math.max(0, y));

    breakMarker.setAttribute('display', 'block');
    breakLine.setAttribute('x1', x.toFixed(2));
    breakLine.setAttribute('x2', x.toFixed(2));
    breakLine.setAttribute('y1', '0');
    breakLine.setAttribute('y2', '100');
    breakDot.setAttribute('cx', x.toFixed(2));
    breakDot.setAttribute('cy', clampedY.toFixed(2));
  }

  bindGraphHover();
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

  latestContract = buildContract(inputs, data);
  updateExplanation(latestContract);
  updateTable(latestContract);
  updateGraph(latestContract);

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
