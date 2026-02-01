import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import { calculateMinimumPayment } from '/assets/js/core/credit-card-utils.js';

const balanceInput = document.querySelector('#cc-min-balance');
const aprInput = document.querySelector('#cc-min-apr');
const rateInput = document.querySelector('#cc-min-rate');
const floorInput = document.querySelector('#cc-min-floor');
const calculateButton = document.querySelector('#cc-min-calc');
const resultDiv = document.querySelector('#cc-min-result');
const summaryDiv = document.querySelector('#cc-min-summary');

const explanationRoot = document.querySelector('#cc-min-explanation');
const balanceValue = explanationRoot?.querySelector('[data-cc-min="balance"]');
const aprValue = explanationRoot?.querySelector('[data-cc-min="apr"]');
const firstPaymentValue = explanationRoot?.querySelector('[data-cc-min="first-payment"]');
const monthsValue = explanationRoot?.querySelector('[data-cc-min="months"]');
const interestValue = explanationRoot?.querySelector('[data-cc-min="interest"]');
const totalValue = explanationRoot?.querySelector('[data-cc-min="total"]');

const tableBody = document.querySelector('#cc-min-table-body');

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
  balanceValue.textContent = formatNumber(data.balance);
  aprValue.textContent = formatPercent(data.apr);
  firstPaymentValue.textContent = formatNumber(data.firstPayment);
  monthsValue.textContent = formatNumber(data.months, { maximumFractionDigits: 0 });
  interestValue.textContent = formatNumber(data.totalInterest);
  totalValue.textContent = formatNumber(data.totalPayment);
}

function calculate() {
  if (!resultDiv || !summaryDiv) {
    return;
  }
  resultDiv.textContent = '';
  summaryDiv.textContent = '';
  clearOutputs();

  const balance = Number(balanceInput?.value);
  const apr = Number(aprInput?.value);
  const minRate = Number(rateInput?.value);
  const minPayment = Number(floorInput?.value);

  const data = calculateMinimumPayment({
    balance,
    apr,
    minRate,
    minPayment,
  });

  if (data.error) {
    setError(data.error);
    return;
  }

  resultDiv.innerHTML = `<strong>Payoff time:</strong> ${formatNumber(data.months, {
    maximumFractionDigits: 0,
  })} months`;

  summaryDiv.innerHTML =
    `<p><strong>Total interest:</strong> ${formatNumber(data.totalInterest)}</p>` +
    `<p><strong>Total paid:</strong> ${formatNumber(data.totalPayment)}</p>` +
    `<p><strong>First payment:</strong> ${formatNumber(data.firstPayment)}</p>`;

  updateTable(data.yearly);
  updateExplanation({ ...data, balance, apr });
}

calculateButton?.addEventListener('click', calculate);

calculate();
