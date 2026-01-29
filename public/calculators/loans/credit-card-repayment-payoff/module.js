import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import { sampleValues, getPaddedMinMax, buildPolyline } from '/assets/js/core/graph-utils.js';
import { calculateCreditCardPayoff } from '/assets/js/core/credit-card-utils.js';

const balanceInput = document.querySelector('#cc-payoff-balance');
const aprInput = document.querySelector('#cc-payoff-apr');
const paymentInput = document.querySelector('#cc-payoff-payment');
const extraInput = document.querySelector('#cc-payoff-extra');
const calculateButton = document.querySelector('#cc-payoff-calc');
const resultDiv = document.querySelector('#cc-payoff-result');
const summaryDiv = document.querySelector('#cc-payoff-summary');

const explanationRoot = document.querySelector('#cc-payoff-explanation');
const balanceValue = explanationRoot?.querySelector('[data-cc-payoff="balance"]');
const aprValue = explanationRoot?.querySelector('[data-cc-payoff="apr"]');
const paymentValue = explanationRoot?.querySelector('[data-cc-payoff="payment"]');
const monthsValue = explanationRoot?.querySelector('[data-cc-payoff="months"]');
const interestValue = explanationRoot?.querySelector('[data-cc-payoff="interest"]');
const totalValue = explanationRoot?.querySelector('[data-cc-payoff="total"]');

const tableBody = document.querySelector('#cc-payoff-table-body');
const graphLine = document.querySelector('#cc-payoff-line');
const yMax = document.querySelector('#cc-payoff-y-max');
const yMid = document.querySelector('#cc-payoff-y-mid');
const yMin = document.querySelector('#cc-payoff-y-min');
const xStart = document.querySelector('#cc-payoff-x-start');
const xEnd = document.querySelector('#cc-payoff-x-end');
const graphNote = document.querySelector('#cc-payoff-graph-note');

function clearOutputs() {
  if (tableBody) {
    tableBody.innerHTML = '';
  }
  if (graphLine) {
    graphLine.setAttribute('points', '');
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

function updateGraph(schedule, months) {
  if (!graphLine) {
    return;
  }
  const balances = schedule.map((entry) => entry.balance);
  const sampled = sampleValues(balances, 36);
  const { min, max } = getPaddedMinMax(sampled, 0.15);
  graphLine.setAttribute('points', buildPolyline(sampled, min, max));

  yMax.textContent = formatNumber(max);
  yMid.textContent = formatNumber((max + min) / 2);
  yMin.textContent = formatNumber(min);
  xStart.textContent = '1';
  xEnd.textContent = formatNumber(months, { maximumFractionDigits: 0 });
  if (graphNote) {
    graphNote.textContent = `Payoff in ${months} months`;
  }
}

function updateExplanation(data) {
  if (!explanationRoot) {
    return;
  }
  balanceValue.textContent = formatNumber(data.balance);
  aprValue.textContent = formatPercent(data.apr);
  paymentValue.textContent = formatNumber(data.monthlyPayment);
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
  const monthlyPayment = Number(paymentInput?.value);
  const extraPayment = Number(extraInput?.value);

  const data = calculateCreditCardPayoff({
    balance,
    apr,
    monthlyPayment,
    extraPayment,
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
    `<p><strong>Monthly payment:</strong> ${formatNumber(data.monthlyPayment)}</p>`;

  updateTable(data.yearly);
  updateGraph(data.schedule, data.months);
  updateExplanation({ ...data, balance, apr });
}

calculateButton?.addEventListener('click', calculate);

calculate();
