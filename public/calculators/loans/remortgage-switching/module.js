import { formatCurrency, formatNumber } from '/assets/js/core/format.js';
import { setupButtonGroup } from '/assets/js/core/ui.js';
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
const resultDiv = document.querySelector('#remo-result');
const summaryDiv = document.querySelector('#remo-summary');

const horizonGroup = document.querySelector('[data-button-group="remo-horizon"]');

const explanationRoot = document.querySelector('#loan-remortgage-explanation');
const currentPaymentValue = explanationRoot?.querySelector('[data-remo="current-payment"]');
const newPaymentValue = explanationRoot?.querySelector('[data-remo="new-payment"]');
const monthlyDiffValue = explanationRoot?.querySelector('[data-remo="monthly-diff"]');
const annualDiffValue = explanationRoot?.querySelector('[data-remo="annual-diff"]');
const feesValue = explanationRoot?.querySelector('[data-remo="fees"]');
const breakEvenValue = explanationRoot?.querySelector('[data-remo="break-even"]');

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

const horizonButtons = setupButtonGroup(horizonGroup, {
  defaultValue: '2',
  onChange: () => calculate(),
});

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
  lineNew?.setAttribute('points', '');
  lineCurrent?.setAttribute('points', '');
  if (breakMarker) {
    breakMarker.setAttribute('display', 'none');
  }
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
  currentPaymentValue.textContent = formatCurrency(data.baselinePayment);
  newPaymentValue.textContent = formatCurrency(data.newPayment);
  monthlyDiffValue.textContent = formatCurrency(data.monthlyDifference);
  annualDiffValue.textContent = formatCurrency(data.annualDifference);
  feesValue.textContent = formatCurrency(data.fees);
  breakEvenValue.textContent = data.breakEvenMonth
    ? `month ${data.breakEvenMonth}`
    : 'not within the horizon';
}

function updateTable(data) {
  if (!tableBody) {
    return;
  }

  tableBody.innerHTML = data.costSeries
    .map(
      (row) => `
        <tr>
          <td>${row.month}</td>
          <td>${formatTableNumber(row.currentCost)}</td>
          <td>${formatTableNumber(row.newCost)}</td>
          <td>${formatTableNumber(row.savings)}</td>
        </tr>`
    )
    .join('');
}

function updateGraph(data) {
  if (!lineNew || !lineCurrent) {
    return;
  }

  const currentValues = data.costSeries.map((row) => row.currentCost);
  const newValues = data.costSeries.map((row) => row.newCost);
  const { min, max } = getPaddedMinMax([...currentValues, ...newValues], 0.1);
  const mid = (min + max) / 2;

  lineCurrent.setAttribute('points', buildPolyline(currentValues, min, max));
  lineNew.setAttribute('points', buildPolyline(newValues, min, max));
  graphYMax.textContent = formatAxisValue(max);
  graphYMid.textContent = formatAxisValue(mid);
  graphYMin.textContent = formatAxisValue(min);
  graphXStart.textContent = '1';
  graphXEnd.textContent = String(data.horizonMonths);

  if (graphNote) {
    graphNote.textContent = data.breakEvenMonth
      ? `Break-even at month ${data.breakEvenMonth}`
      : 'No break-even within horizon';
  }

  if (data.breakEvenMonth && breakMarker && breakLine && breakDot) {
    const xRatio =
      data.horizonMonths > 1 ? (data.breakEvenMonth - 1) / (data.horizonMonths - 1) : 0;
    const x = xRatio * 100;
    const breakRow = data.costSeries[data.breakEvenMonth - 1];
    const breakValue = breakRow ? breakRow.newCost : 0;
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
}

function calculate() {
  if (!resultDiv || !summaryDiv) {
    return;
  }

  resultDiv.textContent = '';
  summaryDiv.textContent = '';
  clearOutputs();

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
  const exitFees = Number(exitFeesInput?.value);
  const legalFees = Number(legalFeesInput?.value);

  if ([newFees, exitFees, legalFees].some((value) => !Number.isFinite(value) || value < 0)) {
    setError('Fees must be 0 or more.');
    return;
  }

  const horizonYears = Number(horizonButtons?.getValue() ?? 2);

  const data = calculateRemortgage({
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
  });

  const paymentGap = Math.abs(data.calculatedPayment - data.baselinePayment);
  const paymentNote =
    currentPayment > 0 && paymentGap > 1
      ? `<p>Calculated payment is ${formatCurrency(data.calculatedPayment)}; ` +
        `difference may be due to escrow or fees.</p>`
      : '';

  resultDiv.innerHTML =
    `<strong>Current payment:</strong> ${formatCurrency(data.baselinePayment)} ` +
    `| <strong>New payment:</strong> ${formatCurrency(data.newPayment)}`;

  summaryDiv.innerHTML =
    `<p><strong>Total cost over ${data.horizonYears} years:</strong> ` +
    `${formatCurrency(data.totalCurrent)} vs ${formatCurrency(data.totalNew)}</p>` +
    `<p><strong>Total savings:</strong> ${formatCurrency(data.totalSavings)}</p>` +
    `<p><strong>Break-even:</strong> ` +
    `${data.breakEvenMonth ? `month ${data.breakEvenMonth}` : 'not within horizon'}</p>` +
    paymentNote;

  updateExplanation(data);
  updateTable(data);
  updateGraph(data);
}

calculateButton?.addEventListener('click', calculate);

calculate();
