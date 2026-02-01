import { formatNumber } from '/assets/js/core/format.js';
import { setupButtonGroup } from '/assets/js/core/ui.js';
import { calculateInterestRateChange } from '/assets/js/core/loan-utils.js';

const balanceInput = document.querySelector('#rate-balance');
const currentRateInput = document.querySelector('#rate-current');
const newRateInput = document.querySelector('#rate-new');
const termInput = document.querySelector('#rate-term');
const changeMonthsInput = document.querySelector('#rate-change-months');
const changeMonthsRow = document.querySelector('#rate-change-months-row');
const calculateButton = document.querySelector('#rate-calculate');
const resultDiv = document.querySelector('#rate-result');
const summaryDiv = document.querySelector('#rate-summary');

const timingGroup = document.querySelector('[data-button-group="rate-change-timing"]');

const explanationRoot = document.querySelector('#loan-rate-change-explanation');
const currentPaymentValue = explanationRoot?.querySelector('[data-rate="current-payment"]');
const newPaymentValue = explanationRoot?.querySelector('[data-rate="new-payment"]');
const monthlyDiffValue = explanationRoot?.querySelector('[data-rate="monthly-diff"]');
const annualDiffValue = explanationRoot?.querySelector('[data-rate="annual-diff"]');
const interestBaseValue = explanationRoot?.querySelector('[data-rate="interest-base"]');
const interestNewValue = explanationRoot?.querySelector('[data-rate="interest-new"]');

const tableBody = document.querySelector('#rate-table-body');

const timingButtons = setupButtonGroup(timingGroup, {
  defaultValue: 'immediate',
  onChange: (value) => {
    changeMonthsRow?.classList.toggle('is-hidden', value !== 'after');
    calculate();
  },
});

function formatTableNumber(value) {
  return formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatAxisValue(value) {
  return formatNumber(value, { maximumFractionDigits: 0 });
}

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

function updateExplanation(data) {
  if (!explanationRoot || !data) {
    return;
  }
  currentPaymentValue.textContent = formatNumber(data.baselinePayment);
  newPaymentValue.textContent = formatNumber(data.newPayment);
  monthlyDiffValue.textContent = formatNumber(data.monthlyDifference);
  annualDiffValue.textContent = formatNumber(data.annualDifference);
  interestBaseValue.textContent = formatNumber(data.totalInterestBaseline);
  interestNewValue.textContent = formatNumber(data.totalInterestNew);
}

function updateTable(data) {
  if (!tableBody) {
    return;
  }

  const rows = data.yearlyBaseline.map((base, index) => {
    const updated = data.yearlyNew[index] || base;
    return {
      year: base.year,
      interestBase: base.interest,
      interestNew: updated.interest,
      paymentBase: base.payment,
      paymentNew: updated.payment,
      balanceBase: base.balance,
      balanceNew: updated.balance,
    };
  });

  tableBody.innerHTML = rows
    .map(
      (row) => `
        <tr>
          <td>${row.year}</td>
          <td>${formatTableNumber(row.interestBase)}</td>
          <td>${formatTableNumber(row.interestNew)}</td>
          <td>${formatTableNumber(row.paymentBase)}</td>
          <td>${formatTableNumber(row.paymentNew)}</td>
          <td>${formatTableNumber(row.balanceBase)}</td>
          <td>${formatTableNumber(row.balanceNew)}</td>
        </tr>`
    )
    .join('');
}

function calculate() {
  if (!resultDiv || !summaryDiv) {
    return;
  }

  resultDiv.textContent = '';
  summaryDiv.textContent = '';
  clearOutputs();

  const balance = Number(balanceInput?.value);
  if (!Number.isFinite(balance) || balance <= 0) {
    setError('Enter a loan balance greater than 0.');
    return;
  }

  const currentRate = Number(currentRateInput?.value);
  if (!Number.isFinite(currentRate) || currentRate < 0) {
    setError('Current rate must be 0 or more.');
    return;
  }

  const newRate = Number(newRateInput?.value);
  if (!Number.isFinite(newRate) || newRate < 0) {
    setError('New rate must be 0 or more.');
    return;
  }

  const termYears = Number(termInput?.value);
  if (!Number.isFinite(termYears) || termYears < 1) {
    setError('Remaining term must be at least 1 year.');
    return;
  }

  const changeTiming = timingButtons?.getValue() ?? 'immediate';
  const changeAfterMonths = Number(changeMonthsInput?.value);
  if (changeTiming === 'after') {
    if (!Number.isFinite(changeAfterMonths) || changeAfterMonths < 1) {
      setError('Change timing months must be at least 1.');
      return;
    }
  }

  const data = calculateInterestRateChange({
    balance,
    currentRate,
    newRate,
    termYears,
    changeTiming,
    changeAfterMonths,
  });

  resultDiv.innerHTML =
    `<strong>Current payment:</strong> ${formatNumber(data.baselinePayment)} ` +
    `| <strong>New payment:</strong> ${formatNumber(data.newPayment)}`;

  summaryDiv.innerHTML =
    `<p><strong>Monthly difference:</strong> ${formatNumber(data.monthlyDifference)}</p>` +
    `<p><strong>Annual difference:</strong> ${formatNumber(data.annualDifference)}</p>` +
    `<p><strong>Total interest change:</strong> ${formatNumber(
      data.totalInterestNew - data.totalInterestBaseline
    )}</p>`;

  updateExplanation(data);
  updateTable(data);
}

changeMonthsRow?.classList.toggle('is-hidden', timingButtons?.getValue() !== 'after');

calculateButton?.addEventListener('click', calculate);

calculate();
