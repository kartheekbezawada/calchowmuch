import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import { sampleValues, getPaddedMinMax, buildPolyline } from '/assets/js/core/graph-utils.js';
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
const graphLine = document.querySelector('#cc-min-line');
const yMax = document.querySelector('#cc-min-y-max');
const yMid = document.querySelector('#cc-min-y-mid');
const yMin = document.querySelector('#cc-min-y-min');
const xStart = document.querySelector('#cc-min-x-start');
const xEnd = document.querySelector('#cc-min-x-end');
const graphNote = document.querySelector('#cc-min-graph-note');

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
  updateGraph(data.schedule, data.months);
  updateExplanation({ ...data, balance, apr });
}

calculateButton?.addEventListener('click', calculate);

calculate();
