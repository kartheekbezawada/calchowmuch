import { formatNumber, formatPercent } from '/assets/js/core/format.js';
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

function clearOutputs() {
  if (tableBody) {
    tableBody.innerHTML = '';
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


function updateExplanation(data, termMonths) {
  if (!explanationRoot) {
    return;
  }
  balanceValue.textContent = formatNumber(data.balance);
  currentAprValue.textContent = formatPercent(data.currentApr);
  currentPaymentValue.textContent = formatNumber(data.currentPayment);
  currentMonthsValue.textContent = formatNumber(data.current.months, { maximumFractionDigits: 0 });
  newAprValue.textContent = formatPercent(data.consolidationApr);
  newTermValue.textContent = formatNumber(termMonths, { maximumFractionDigits: 0 });
  newPaymentValue.textContent = formatNumber(data.consolidation.monthlyPayment);
  interestDiffValue.textContent = formatNumber(data.interestDifference);
  totalDiffValue.textContent = formatNumber(data.totalDifference);
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

  resultDiv.innerHTML = `<strong>Monthly payment change:</strong> ${formatNumber(
    data.monthlyDifference
  )}`;

  summaryDiv.innerHTML =
    `<p><strong>Interest difference:</strong> ${formatNumber(data.interestDifference)}</p>` +
    `<p><strong>Total cost difference:</strong> ${formatNumber(data.totalDifference)}</p>` +
    `<p><strong>Consolidation payment:</strong> ${formatNumber(
      data.consolidation.monthlyPayment
    )}</p>`;

  updateTable(data.current, data.consolidation);
  updateExplanation({ ...data, balance, currentApr, currentPayment, consolidationApr }, termMonths);
}

calculateButton?.addEventListener('click', calculate);

calculate();
