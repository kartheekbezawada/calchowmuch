import { formatNumber } from '/assets/js/core/format.js';
import { getPaddedMinMax } from '/assets/js/core/graph-utils.js';
import { calculateMultipleCarLoan } from '/assets/js/core/auto-loan-utils.js';

const loanAAmountInput = document.querySelector('#multi-loan-a-amount');
const loanAAprInput = document.querySelector('#multi-loan-a-apr');
const loanATermInput = document.querySelector('#multi-loan-a-term');
const loanBAmountInput = document.querySelector('#multi-loan-b-amount');
const loanBAprInput = document.querySelector('#multi-loan-b-apr');
const loanBTermInput = document.querySelector('#multi-loan-b-term');
const calculateButton = document.querySelector('#multi-loan-calc');
const resultDiv = document.querySelector('#multi-loan-result');
const summaryDiv = document.querySelector('#multi-loan-summary');

const explanationRoot = document.querySelector('#multi-loan-explanation');
const paymentAValue = explanationRoot?.querySelector('[data-multi="payment-a"]');
const paymentBValue = explanationRoot?.querySelector('[data-multi="payment-b"]');
const paymentTotalValue = explanationRoot?.querySelector('[data-multi="payment-total"]');
const interestTotalValue = explanationRoot?.querySelector('[data-multi="interest-total"]');

const tableBody = document.querySelector('#multi-loan-table-body');
const barsContainer = document.querySelector('#multi-loan-bars');
const yMax = document.querySelector('#multi-loan-y-max');
const yMid = document.querySelector('#multi-loan-y-mid');
const yMin = document.querySelector('#multi-loan-y-min');
const graphNote = document.querySelector('#multi-loan-graph-note');

function clearOutputs() {
  if (tableBody) {
    tableBody.innerHTML = '';
  }
  if (barsContainer) {
    barsContainer.innerHTML = '';
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

function updateTable(data) {
  if (!tableBody) {
    return;
  }
  tableBody.innerHTML = `
    <tr>
      <td>Loan A</td>
      <td>${formatNumber(data.loanA.monthlyPayment)}</td>
      <td>${formatNumber(data.loanA.totalInterest)}</td>
      <td>${formatNumber(data.loanA.totalPayment)}</td>
    </tr>
    <tr>
      <td>Loan B</td>
      <td>${formatNumber(data.loanB.monthlyPayment)}</td>
      <td>${formatNumber(data.loanB.totalInterest)}</td>
      <td>${formatNumber(data.loanB.totalPayment)}</td>
    </tr>
    <tr>
      <td>Combined</td>
      <td>${formatNumber(data.combined.monthlyPayment)}</td>
      <td>${formatNumber(data.combined.totalInterest)}</td>
      <td>${formatNumber(data.combined.totalPayment)}</td>
    </tr>
  `;
}

function updateGraph(data) {
  if (!barsContainer) {
    return;
  }
  const payments = [data.loanA.monthlyPayment, data.loanB.monthlyPayment];
  const { min, max } = getPaddedMinMax(payments, 0.15);

  barsContainer.innerHTML = '';
  payments.forEach((value, index) => {
    const bar = document.createElement('div');
    bar.className = index === 0 ? 'graph-bar' : 'graph-bar interest';
    const height = max === min ? 60 : ((value - min) / (max - min)) * 100;
    bar.style.height = `${Math.max(8, height)}%`;
    barsContainer.appendChild(bar);
  });

  yMax.textContent = formatNumber(max);
  yMid.textContent = formatNumber((max + min) / 2);
  yMin.textContent = formatNumber(min);
  if (graphNote) {
    graphNote.textContent = 'Loan A vs Loan B payments';
  }
}

function updateExplanation(data) {
  if (!explanationRoot) {
    return;
  }
  paymentAValue.textContent = formatNumber(data.loanA.monthlyPayment);
  paymentBValue.textContent = formatNumber(data.loanB.monthlyPayment);
  paymentTotalValue.textContent = formatNumber(data.combined.monthlyPayment);
  interestTotalValue.textContent = formatNumber(data.combined.totalInterest);
}

function calculate() {
  if (!resultDiv || !summaryDiv) {
    return;
  }
  resultDiv.textContent = '';
  summaryDiv.textContent = '';
  clearOutputs();

  const loanA = {
    amount: Number(loanAAmountInput?.value),
    apr: Number(loanAAprInput?.value),
    termYears: Number(loanATermInput?.value),
  };
  const loanB = {
    amount: Number(loanBAmountInput?.value),
    apr: Number(loanBAprInput?.value),
    termYears: Number(loanBTermInput?.value),
  };

  if (!Number.isFinite(loanA.amount) || loanA.amount <= 0) {
    setError('Loan A amount must be greater than 0.');
    return;
  }
  if (!Number.isFinite(loanB.amount) || loanB.amount <= 0) {
    setError('Loan B amount must be greater than 0.');
    return;
  }

  const data = calculateMultipleCarLoan({ loanA, loanB });

  resultDiv.innerHTML = `<strong>Combined payment:</strong> ${formatNumber(
    data.combined.monthlyPayment
  )}`;

  summaryDiv.innerHTML =
    `<p><strong>Total interest:</strong> ${formatNumber(data.combined.totalInterest)}</p>` +
    `<p><strong>Total paid:</strong> ${formatNumber(data.combined.totalPayment)}</p>`;

  updateTable(data);
  updateGraph(data);
  updateExplanation(data);
}

calculateButton?.addEventListener('click', calculate);

calculate();
