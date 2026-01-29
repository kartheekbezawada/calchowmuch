import { formatNumber } from '/assets/js/core/format.js';
import { setupButtonGroup } from '/assets/js/core/ui.js';
import { calculateOffset } from '/assets/js/core/loan-utils.js';
import { buildPolyline, getPaddedMinMax } from '/assets/js/core/graph-utils.js';

const balanceInput = document.querySelector('#off-balance');
const rateInput = document.querySelector('#off-rate');
const termInput = document.querySelector('#off-term');
const savingsInput = document.querySelector('#off-savings');
const contributionInput = document.querySelector('#off-contribution');
const calculateButton = document.querySelector('#off-calculate');
const resultDiv = document.querySelector('#off-result');
const summaryDiv = document.querySelector('#off-summary');

const modeGroup = document.querySelector('[data-button-group="off-mode"]');

const explanationRoot = document.querySelector('#loan-offset-explanation');
const effectiveBalanceValue = explanationRoot?.querySelector('[data-off="effective-balance"]');
const paymentValue = explanationRoot?.querySelector('[data-off="payment"]');
const interestBaseValue = explanationRoot?.querySelector('[data-off="interest-base"]');
const interestOffsetValue = explanationRoot?.querySelector('[data-off="interest-offset"]');
const interestSavedValue = explanationRoot?.querySelector('[data-off="interest-saved"]');
const timeSavedValue = explanationRoot?.querySelector('[data-off="time-saved"]');

const tableBody = document.querySelector('#off-table-body');

const lineOffset = document.querySelector('#off-line-offset');
const lineBase = document.querySelector('#off-line-base');
const graphYMax = document.querySelector('#off-y-max');
const graphYMid = document.querySelector('#off-y-mid');
const graphYMin = document.querySelector('#off-y-min');
const graphXStart = document.querySelector('#off-x-start');
const graphXEnd = document.querySelector('#off-x-end');
const graphNote = document.querySelector('#off-graph-note');

const modeButtons = setupButtonGroup(modeGroup, {
  defaultValue: 'full',
  onChange: () => calculate(),
});

function formatTableNumber(value) {
  return formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatAxisValue(value) {
  return formatNumber(value, { maximumFractionDigits: 0 });
}

function formatTerm(months) {
  const totalMonths = Math.max(0, Math.round(months));
  const years = Math.floor(totalMonths / 12);
  const remaining = totalMonths % 12;
  if (years === 0) {
    return `${remaining} months`;
  }
  if (remaining === 0) {
    return `${years} years`;
  }
  return `${years} years ${remaining} months`;
}

function clearOutputs() {
  if (tableBody) {
    tableBody.innerHTML = '';
  }
  lineOffset?.setAttribute('points', '');
  lineBase?.setAttribute('points', '');
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
  effectiveBalanceValue.textContent = formatNumber(data.effectiveBalance);
  paymentValue.textContent = formatNumber(data.payment);
  interestBaseValue.textContent = formatNumber(data.baseline.totalInterest);
  interestOffsetValue.textContent = formatNumber(data.offset.totalInterest);
  interestSavedValue.textContent = formatNumber(data.interestSaved);
  timeSavedValue.textContent = formatTerm(data.timeSaved);
}

function updateTable(data) {
  if (!tableBody) {
    return;
  }

  tableBody.innerHTML = data.yearlyRows
    .map(
      (row) => `
        <tr>
          <td>${row.year}</td>
          <td>${formatTableNumber(row.savingsStart)}</td>
          <td>${formatTableNumber(row.savingsEnd)}</td>
          <td>${formatTableNumber(row.interestBaseline)}</td>
          <td>${formatTableNumber(row.interestOffset)}</td>
          <td>${formatTableNumber(row.interestSaved)}</td>
          <td>${formatTableNumber(row.endingBalance)}</td>
        </tr>`
    )
    .join('');
}

function updateGraph(data) {
  if (!lineOffset || !lineBase) {
    return;
  }

  const baselineValues = data.baselineInterestSeries;
  const offsetValues = data.offsetInterestSeries;
  const { min, max } = getPaddedMinMax([...baselineValues, ...offsetValues], 0.1);
  const mid = (min + max) / 2;

  lineBase.setAttribute('points', buildPolyline(baselineValues, min, max));
  lineOffset.setAttribute('points', buildPolyline(offsetValues, min, max));
  graphYMax.textContent = formatAxisValue(max);
  graphYMid.textContent = formatAxisValue(mid);
  graphYMin.textContent = formatAxisValue(min);
  graphXStart.textContent = '1';
  graphXEnd.textContent = String(Math.max(baselineValues.length, offsetValues.length));
  if (graphNote) {
    graphNote.textContent = 'Annual interest';
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
    setError('Mortgage balance must be greater than 0.');
    return;
  }

  const annualRate = Number(rateInput?.value);
  if (!Number.isFinite(annualRate) || annualRate < 0) {
    setError('Interest rate must be 0 or more.');
    return;
  }

  const termYears = Number(termInput?.value);
  if (!Number.isFinite(termYears) || termYears < 1) {
    setError('Remaining term must be at least 1 year.');
    return;
  }

  const offsetBalance = Number(savingsInput?.value);
  if (!Number.isFinite(offsetBalance) || offsetBalance < 0) {
    setError('Offset savings must be 0 or more.');
    return;
  }

  const offsetContribution = Number(contributionInput?.value);
  if (!Number.isFinite(offsetContribution) || offsetContribution < 0) {
    setError('Offset contribution must be 0 or more.');
    return;
  }

  const offsetMode = modeButtons?.getValue() ?? 'full';

  const data = calculateOffset({
    balance,
    annualRate,
    termYears,
    offsetBalance,
    offsetContribution,
    offsetMode,
  });

  resultDiv.innerHTML = `<strong>Monthly payment:</strong> ${formatNumber(data.payment)}`;

  summaryDiv.innerHTML =
    `<p><strong>Interest saved:</strong> ${formatNumber(data.interestSaved)}</p>` +
    `<p><strong>Time saved:</strong> ${formatTerm(data.timeSaved)}</p>` +
    `<p><strong>Effective balance:</strong> ${formatNumber(data.effectiveBalance)}</p>`;

  updateExplanation(data);
  updateTable(data);
  updateGraph(data);
}

calculateButton?.addEventListener('click', calculate);

calculate();
