import { formatNumber } from '/assets/js/core/format.js';
import { sampleValues, getPaddedMinMax, buildPolyline } from '/assets/js/core/graph-utils.js';
import { setupButtonGroup } from '/assets/js/core/ui.js';
import { calculateLease } from '/assets/js/core/auto-loan-utils.js';

const priceInput = document.querySelector('#lease-price');
const residualAmountInput = document.querySelector('#lease-residual-amount');
const residualPercentInput = document.querySelector('#lease-residual-percent');
const termInput = document.querySelector('#lease-term');
const factorInput = document.querySelector('#lease-factor');
const upfrontInput = document.querySelector('#lease-upfront');
const calculateButton = document.querySelector('#lease-calc');
const resultDiv = document.querySelector('#lease-result');
const summaryDiv = document.querySelector('#lease-summary');

const residualAmountRow = document.querySelector('#lease-residual-amount-row');
const residualPercentRow = document.querySelector('#lease-residual-percent-row');
const residualTypeGroup = document.querySelector('[data-button-group="lease-residual-type"]');

const explanationRoot = document.querySelector('#lease-explanation');
const priceValue = explanationRoot?.querySelector('[data-lease="price"]');
const residualValue = explanationRoot?.querySelector('[data-lease="residual"]');
const paymentValue = explanationRoot?.querySelector('[data-lease="payment"]');
const monthsValue = explanationRoot?.querySelector('[data-lease="months"]');
const totalValue = explanationRoot?.querySelector('[data-lease="total"]');

const tableBody = document.querySelector('#lease-table-body');
const graphLine = document.querySelector('#lease-line');
const yMax = document.querySelector('#lease-y-max');
const yMid = document.querySelector('#lease-y-mid');
const yMin = document.querySelector('#lease-y-min');
const xStart = document.querySelector('#lease-x-start');
const xEnd = document.querySelector('#lease-x-end');
const graphNote = document.querySelector('#lease-graph-note');

const residualTypeButtons = setupButtonGroup(residualTypeGroup, {
  defaultValue: 'amount',
  onChange: (value) => {
    residualAmountRow?.classList.toggle('is-hidden', value !== 'amount');
    residualPercentRow?.classList.toggle('is-hidden', value !== 'percent');
    calculate();
  },
});

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
  const totals = schedule.map((entry) => entry.cumulative);
  const sampled = sampleValues(totals, 36);
  const { min, max } = getPaddedMinMax(sampled, 0.1);
  graphLine.setAttribute('points', buildPolyline(sampled, min, max));

  yMax.textContent = formatNumber(max);
  yMid.textContent = formatNumber((max + min) / 2);
  yMin.textContent = formatNumber(min);
  xStart.textContent = '1';
  xEnd.textContent = formatNumber(months, { maximumFractionDigits: 0 });
  if (graphNote) {
    graphNote.textContent = `Lease term ${formatNumber(months, { maximumFractionDigits: 0 })} months`;
  }
}

function updateExplanation(data) {
  if (!explanationRoot) {
    return;
  }
  priceValue.textContent = formatNumber(data.price);
  residualValue.textContent = formatNumber(data.residual);
  paymentValue.textContent = formatNumber(data.monthlyPayment);
  monthsValue.textContent = formatNumber(data.termMonths, { maximumFractionDigits: 0 });
  totalValue.textContent = formatNumber(data.totalLeaseCost);
}

function calculate() {
  if (!resultDiv || !summaryDiv) {
    return;
  }
  resultDiv.textContent = '';
  summaryDiv.textContent = '';
  clearOutputs();

  const price = Number(priceInput?.value);
  const residualValueInput = Number(residualAmountInput?.value);
  const residualPercent = Number(residualPercentInput?.value);
  const termMonths = Number(termInput?.value);
  const moneyFactor = Number(factorInput?.value);
  const upfrontPayment = Number(upfrontInput?.value);
  const residualType = residualTypeButtons?.getValue() ?? 'amount';

  if (!Number.isFinite(price) || price <= 0) {
    setError('Vehicle price must be greater than 0.');
    return;
  }

  const data = calculateLease({
    price,
    residualType,
    residualValue: residualValueInput,
    residualPercent,
    termMonths,
    moneyFactor,
    upfrontPayment,
  });

  if (residualType === 'percent' && residualAmountInput) {
    residualAmountInput.value = data.residual.toFixed(2);
  }
  if (residualType === 'amount' && residualPercentInput) {
    residualPercentInput.value = ((data.residual / price) * 100).toFixed(2);
  }

  resultDiv.innerHTML = `<strong>Monthly payment:</strong> ${formatNumber(data.monthlyPayment)}`;

  summaryDiv.innerHTML =
    `<p><strong>Total lease cost:</strong> ${formatNumber(data.totalLeaseCost)}</p>` +
    `<p><strong>Residual value:</strong> ${formatNumber(data.residual)}</p>` +
    `<p><strong>Upfront payment:</strong> ${formatNumber(data.upfrontPayment)}</p>`;

  updateTable(data.yearly);
  updateGraph(data.schedule, data.termMonths);
  updateExplanation(data);
}

calculateButton?.addEventListener('click', calculate);

calculate();
