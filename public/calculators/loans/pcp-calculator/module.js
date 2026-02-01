import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import { calculatePcp } from '/assets/js/core/auto-loan-utils.js';

const priceInput = document.querySelector('#pcp-price');
const depositInput = document.querySelector('#pcp-deposit');
const aprInput = document.querySelector('#pcp-apr');
const termInput = document.querySelector('#pcp-term');
const gfvInput = document.querySelector('#pcp-gfv');
const optionFeeInput = document.querySelector('#pcp-option-fee');
const calculateButton = document.querySelector('#pcp-calc');
const resultDiv = document.querySelector('#pcp-result');
const summaryDiv = document.querySelector('#pcp-summary');

const explanationRoot = document.querySelector('#pcp-explanation');
const financedValue = explanationRoot?.querySelector('[data-pcp="financed"]');
const depositValue = explanationRoot?.querySelector('[data-pcp="deposit"]');
const aprValue = explanationRoot?.querySelector('[data-pcp="apr"]');
const paymentValue = explanationRoot?.querySelector('[data-pcp="payment"]');
const balloonValue = explanationRoot?.querySelector('[data-pcp="balloon"]');
const interestValue = explanationRoot?.querySelector('[data-pcp="interest"]');
const totalValue = explanationRoot?.querySelector('[data-pcp="total"]');

const tableBody = document.querySelector('#pcp-table-body');

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

function updateTable(yearly) {
  if (!tableBody) {
    return;
  }
  tableBody.innerHTML = yearly
    .map(
      (row) => `
        <tr>
          <td>${row.year}</td>
          <td>${formatNumber(row.payment)}</td>
          <td>${formatNumber(row.interest)}</td>
          <td>${formatNumber(row.balance)}</td>
        </tr>
      `
    )
    .join('');
}


function updateExplanation(data) {
  if (!explanationRoot) {
    return;
  }
  financedValue.textContent = formatNumber(data.financed);
  depositValue.textContent = formatNumber(data.deposit);
  aprValue.textContent = formatPercent(data.apr);
  paymentValue.textContent = formatNumber(data.monthlyPayment);
  balloonValue.textContent = formatNumber(data.balloon);
  interestValue.textContent = formatNumber(data.totalInterest);
  totalValue.textContent = formatNumber(data.totalPayable);
}

function calculate() {
  if (!resultDiv || !summaryDiv) {
    return;
  }
  resultDiv.textContent = '';
  summaryDiv.textContent = '';
  clearOutputs();

  const price = Number(priceInput?.value);
  const deposit = Number(depositInput?.value);
  const apr = Number(aprInput?.value);
  const termMonths = Number(termInput?.value);
  const balloon = Number(gfvInput?.value);
  const optionFee = Number(optionFeeInput?.value);

  if (!Number.isFinite(price) || price <= 0) {
    setError('Vehicle price must be greater than 0.');
    return;
  }

  const data = calculatePcp({
    price,
    deposit,
    apr,
    termMonths,
    balloon,
    optionFee,
  });

  resultDiv.innerHTML = `<strong>Monthly payment:</strong> ${formatNumber(data.monthlyPayment)}`;

  summaryDiv.innerHTML =
    `<p><strong>Total interest:</strong> ${formatNumber(data.totalInterest)}</p>` +
    `<p><strong>Total payable:</strong> ${formatNumber(data.totalPayable)}</p>` +
    `<p><strong>Final payment:</strong> ${formatNumber(data.balloon)}</p>`;

  updateTable(data.yearly);
  updateExplanation(data);
}

calculateButton?.addEventListener('click', calculate);

calculate();
