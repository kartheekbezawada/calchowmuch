import { formatNumber } from '/assets/js/core/format.js';
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
  updateExplanation(data);
}

calculateButton?.addEventListener('click', calculate);

calculate();
