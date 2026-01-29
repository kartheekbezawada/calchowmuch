import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import { sampleValues, getPaddedMinMax, buildPolyline } from '/assets/js/core/graph-utils.js';
import { calculateHirePurchase } from '/assets/js/core/auto-loan-utils.js';

const priceInput = document.querySelector('#hp-price');
const depositInput = document.querySelector('#hp-deposit');
const aprInput = document.querySelector('#hp-apr');
const termInput = document.querySelector('#hp-term');
const balloonInput = document.querySelector('#hp-balloon');
const calculateButton = document.querySelector('#hp-calc');
const resultDiv = document.querySelector('#hp-result');
const summaryDiv = document.querySelector('#hp-summary');

const explanationRoot = document.querySelector('#hp-explanation');
const financedValue = explanationRoot?.querySelector('[data-hp="financed"]');
const depositValue = explanationRoot?.querySelector('[data-hp="deposit"]');
const aprValue = explanationRoot?.querySelector('[data-hp="apr"]');
const paymentValue = explanationRoot?.querySelector('[data-hp="payment"]');
const balloonValue = explanationRoot?.querySelector('[data-hp="balloon"]');
const interestValue = explanationRoot?.querySelector('[data-hp="interest"]');
const totalValue = explanationRoot?.querySelector('[data-hp="total"]');

const tableBody = document.querySelector('#hp-table-body');
const graphLine = document.querySelector('#hp-line');
const yMax = document.querySelector('#hp-y-max');
const yMid = document.querySelector('#hp-y-mid');
const yMin = document.querySelector('#hp-y-min');
const xStart = document.querySelector('#hp-x-start');
const xEnd = document.querySelector('#hp-x-end');
const graphNote = document.querySelector('#hp-graph-note');

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
    graphNote.textContent = `Loan term ${formatNumber(months, { maximumFractionDigits: 0 })} months`;
  }
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
  const balloon = Number(balloonInput?.value);

  if (!Number.isFinite(price) || price <= 0) {
    setError('Vehicle price must be greater than 0.');
    return;
  }

  const data = calculateHirePurchase({
    price,
    deposit,
    apr,
    termMonths,
    balloon,
  });

  resultDiv.innerHTML = `<strong>Monthly payment:</strong> ${formatNumber(data.monthlyPayment)}`;

  summaryDiv.innerHTML =
    `<p><strong>Total interest:</strong> ${formatNumber(data.totalInterest)}</p>` +
    `<p><strong>Total payable:</strong> ${formatNumber(data.totalPayable)}</p>` +
    `<p><strong>Final balloon:</strong> ${formatNumber(data.balloon)}</p>`;

  updateTable(data.yearly);
  updateGraph(data.schedule, data.termMonths);
  updateExplanation(data);
}

calculateButton?.addEventListener('click', calculate);

calculate();
