import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import { calculateBalanceTransfer } from '/assets/js/core/credit-card-utils.js';

const balanceInput = document.querySelector('#cc-bt-balance');
const feeInput = document.querySelector('#cc-bt-fee');
const promoAprInput = document.querySelector('#cc-bt-promo-apr');
const promoMonthsInput = document.querySelector('#cc-bt-promo-months');
const postAprInput = document.querySelector('#cc-bt-post-apr');
const paymentInput = document.querySelector('#cc-bt-payment');
const calculateButton = document.querySelector('#cc-bt-calc');
const resultDiv = document.querySelector('#cc-bt-result');
const summaryDiv = document.querySelector('#cc-bt-summary');

const explanationRoot = document.querySelector('#cc-bt-explanation');
const balanceValue = explanationRoot?.querySelector('[data-cc-bt="balance"]');
const feeValue = explanationRoot?.querySelector('[data-cc-bt="fee"]');
const startingValue = explanationRoot?.querySelector('[data-cc-bt="starting-balance"]');
const promoAprValue = explanationRoot?.querySelector('[data-cc-bt="promo-apr"]');
const promoMonthsValue = explanationRoot?.querySelector('[data-cc-bt="promo-months"]');
const postAprValue = explanationRoot?.querySelector('[data-cc-bt="post-apr"]');
const paymentValue = explanationRoot?.querySelector('[data-cc-bt="payment"]');
const monthsValue = explanationRoot?.querySelector('[data-cc-bt="months"]');
const interestValue = explanationRoot?.querySelector('[data-cc-bt="interest"]');
const feesValue = explanationRoot?.querySelector('[data-cc-bt="fees"]');

const tableBody = document.querySelector('#cc-bt-table-body');

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
  feeValue.textContent = formatPercent(data.transferFeePercent);
  startingValue.textContent = formatNumber(data.startingBalance);
  promoAprValue.textContent = formatPercent(data.promoApr);
  promoMonthsValue.textContent = formatNumber(data.promoMonths, { maximumFractionDigits: 0 });
  postAprValue.textContent = formatPercent(data.postApr);
  paymentValue.textContent = formatNumber(data.monthlyPayment);
  monthsValue.textContent = formatNumber(data.months, { maximumFractionDigits: 0 });
  interestValue.textContent = formatNumber(data.totalInterest);
  feesValue.textContent = formatNumber(data.fee);
}

function calculate() {
  if (!resultDiv || !summaryDiv) {
    return;
  }
  resultDiv.textContent = '';
  summaryDiv.textContent = '';
  clearOutputs();

  const balance = Number(balanceInput?.value);
  const transferFeePercent = Number(feeInput?.value);
  const promoApr = Number(promoAprInput?.value);
  const promoMonths = Number(promoMonthsInput?.value);
  const postApr = Number(postAprInput?.value);
  const monthlyPayment = Number(paymentInput?.value);

  const data = calculateBalanceTransfer({
    balance,
    transferFeePercent,
    promoApr,
    promoMonths,
    postApr,
    monthlyPayment,
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
    `<p><strong>Total fees:</strong> ${formatNumber(data.fee)}</p>` +
    `<p><strong>Total paid:</strong> ${formatNumber(data.totalPayment)}</p>`;

  updateTable(data.yearly);
  updateExplanation({
    ...data,
    balance,
    transferFeePercent,
    promoApr,
    promoMonths,
    postApr,
    monthlyPayment,
  });
}

calculateButton?.addEventListener('click', calculate);

calculate();
