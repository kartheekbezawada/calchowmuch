import { formatCurrency, formatNumber, formatPercent } from '/assets/js/core/format.js';
import { sampleValues, getPaddedMinMax, buildPolyline } from '/assets/js/core/graph-utils.js';
import { calculateConsolidation } from '/assets/js/core/credit-card-utils.js';

const balanceInput = document.querySelector('#cc-con-balance');
const currentAprInput = document.querySelector('#cc-con-apr');
const currentPaymentInput = document.querySelector('#cc-con-payment');
const newAprInput = document.querySelector('#cc-con-new-apr');
const termInput = document.querySelector('#cc-con-term');
const feesInput = document.querySelector('#cc-con-fees');
const calculateButton = document.querySelector('#cc-con-calc');
const resultDiv = document.querySelector('#cc-con-result');
const summaryDiv = document.querySelector('#cc-con-summary');

const explanationRoot = document.querySelector('#cc-con-explanation');
const balanceValue = explanationRoot?.querySelector('[data-cc-con="balance"]');
const currentAprValue = explanationRoot?.querySelector('[data-cc-con="current-apr"]');
const currentPaymentValue = explanationRoot?.querySelector('[data-cc-con="current-payment"]');
const currentMonthsValue = explanationRoot?.querySelector('[data-cc-con="current-months"]');
const newAprValue = explanationRoot?.querySelector('[data-cc-con="new-apr"]');
const newTermValue = explanationRoot?.querySelector('[data-cc-con="new-term"]');
const newPaymentValue = explanationRoot?.querySelector('[data-cc-con="new-payment"]');
const interestDiffValue = explanationRoot?.querySelector('[data-cc-con="interest-diff"]');
const totalDiffValue = explanationRoot?.querySelector('[data-cc-con="total-diff"]');

const tableBody = document.querySelector('#cc-con-table-body');
const lineCurrent = document.querySelector('#cc-con-line-current');
const lineNew = document.querySelector('#cc-con-line-new');
const yMax = document.querySelector('#cc-con-y-max');
const yMid = document.querySelector('#cc-con-y-mid');
const yMin = document.querySelector('#cc-con-y-min');
const xStart = document.querySelector('#cc-con-x-start');
const xEnd = document.querySelector('#cc-con-x-end');
const graphNote = document.querySelector('#cc-con-graph-note');

function clearOutputs() {
  if (tableBody) {
    tableBody.innerHTML = '';
  }
  if (lineCurrent) {
    lineCurrent.setAttribute('points', '');
  }
  if (lineNew) {
    lineNew.setAttribute('points', '');
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

function updateTable(current, consolidation) {
  if (!tableBody) {
    return;
  }
  tableBody.innerHTML = `
    <tr>
      <td>Current Cards</td>
      <td>${formatNumber(current.months, { maximumFractionDigits: 0 })}</td>
      <td>${formatNumber(current.totalInterest)}</td>
      <td>${formatNumber(current.totalPayment)}</td>
    </tr>
    <tr>
      <td>Consolidation</td>
      <td>${formatNumber(consolidation.months, { maximumFractionDigits: 0 })}</td>
      <td>${formatNumber(consolidation.totalInterest)}</td>
      <td>${formatNumber(consolidation.totalPayment)}</td>
    </tr>
  `;
}

function updateGraph(current, consolidation) {
  if (!lineCurrent || !lineNew) {
    return;
  }

  const currentBalances = current.schedule.map((entry) => entry.balance);
  const newBalances = consolidation.schedule.map((entry) => entry.balance);

  const sampledCurrent = sampleValues(currentBalances, 36);
  const sampledNew = sampleValues(newBalances, 36);
  const combined = [...sampledCurrent, ...sampledNew];
  const { min, max } = getPaddedMinMax(combined, 0.15);

  lineCurrent.setAttribute('points', buildPolyline(sampledCurrent, min, max));
  lineNew.setAttribute('points', buildPolyline(sampledNew, min, max));

  yMax.textContent = formatNumber(max);
  yMid.textContent = formatNumber((max + min) / 2);
  yMin.textContent = formatNumber(min);
  xStart.textContent = '1';
  xEnd.textContent = formatNumber(Math.max(current.months, consolidation.months), {
    maximumFractionDigits: 0,
  });
  if (graphNote) {
    graphNote.textContent = 'Current vs consolidation balance';
  }
}

function updateExplanation(data, termMonths) {
  if (!explanationRoot) {
    return;
  }
  balanceValue.textContent = formatCurrency(data.balance);
  currentAprValue.textContent = formatPercent(data.currentApr);
  currentPaymentValue.textContent = formatCurrency(data.currentPayment);
  currentMonthsValue.textContent = formatNumber(data.current.months, { maximumFractionDigits: 0 });
  newAprValue.textContent = formatPercent(data.consolidationApr);
  newTermValue.textContent = formatNumber(termMonths, { maximumFractionDigits: 0 });
  newPaymentValue.textContent = formatCurrency(data.consolidation.monthlyPayment);
  interestDiffValue.textContent = formatCurrency(data.interestDifference);
  totalDiffValue.textContent = formatCurrency(data.totalDifference);
}

function calculate() {
  if (!resultDiv || !summaryDiv) {
    return;
  }
  resultDiv.textContent = '';
  summaryDiv.textContent = '';
  clearOutputs();

  const balance = Number(balanceInput?.value);
  const currentApr = Number(currentAprInput?.value);
  const currentPayment = Number(currentPaymentInput?.value);
  const consolidationApr = Number(newAprInput?.value);
  const termYears = Number(termInput?.value);
  const fees = Number(feesInput?.value);
  const termMonths = Math.max(1, Math.round(termYears * 12));

  const data = calculateConsolidation({
    balance,
    currentApr,
    currentPayment,
    consolidationApr,
    termMonths,
    fees,
  });

  if (data.error) {
    setError(data.error);
    return;
  }

  resultDiv.innerHTML = `<strong>Monthly payment change:</strong> ${formatCurrency(
    data.monthlyDifference
  )}`;

  summaryDiv.innerHTML =
    `<p><strong>Interest difference:</strong> ${formatCurrency(data.interestDifference)}</p>` +
    `<p><strong>Total cost difference:</strong> ${formatCurrency(data.totalDifference)}</p>` +
    `<p><strong>Consolidation payment:</strong> ${formatCurrency(
      data.consolidation.monthlyPayment
    )}</p>`;

  updateTable(data.current, data.consolidation);
  updateGraph(data.current, data.consolidation);
  updateExplanation({ ...data, balance, currentApr, currentPayment, consolidationApr }, termMonths);
}

calculateButton?.addEventListener('click', calculate);

calculate();
