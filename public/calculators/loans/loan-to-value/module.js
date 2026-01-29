import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import { setupButtonGroup } from '/assets/js/core/ui.js';
import { calculateLtv } from '/assets/js/core/loan-utils.js';
import { buildPolyline } from '/assets/js/core/graph-utils.js';

const propertyInput = document.querySelector('#ltv-property');
const loanInput = document.querySelector('#ltv-loan');
const depositAmountInput = document.querySelector('#ltv-deposit-amount');
const depositPercentInput = document.querySelector('#ltv-deposit-percent');
const loanRow = document.querySelector('#ltv-loan-row');
const depositTypeRow = document.querySelector('#ltv-deposit-type-row');
const depositAmountRow = document.querySelector('#ltv-deposit-amount-row');
const depositPercentRow = document.querySelector('#ltv-deposit-percent-row');
const calculateButton = document.querySelector('#ltv-calculate');
const resultDiv = document.querySelector('#ltv-result');
const summaryDiv = document.querySelector('#ltv-summary');

const modeGroup = document.querySelector('[data-button-group="ltv-mode"]');
const depositTypeGroup = document.querySelector('[data-button-group="ltv-deposit-type"]');

const explanationRoot = document.querySelector('#loan-ltv-explanation');
const propertyValue = explanationRoot?.querySelector('[data-ltv="property"]');
const loanValue = explanationRoot?.querySelector('[data-ltv="loan"]');
const depositValue = explanationRoot?.querySelector('[data-ltv="deposit"]');
const depositPercentValue = explanationRoot?.querySelector('[data-ltv="deposit-percent"]');
const ltvValue = explanationRoot?.querySelector('[data-ltv="ltv"]');

const graphLine = document.querySelector('#ltv-graph-line polyline');
const graphYMax = document.querySelector('#ltv-y-max');
const graphYMid = document.querySelector('#ltv-y-mid');
const graphYMin = document.querySelector('#ltv-y-min');
const graphXStart = document.querySelector('#ltv-x-start');
const graphXEnd = document.querySelector('#ltv-x-end');
const graphNote = document.querySelector('#ltv-graph-note');

const modeButtons = setupButtonGroup(modeGroup, {
  defaultValue: 'loan',
  onChange: (value) => {
    setModeVisibility(value);
    calculate();
  },
});

const depositTypeButtons = setupButtonGroup(depositTypeGroup, {
  defaultValue: 'amount',
  onChange: (value) => {
    setDepositTypeVisibility(value);
    calculate();
  },
});

function setModeVisibility(mode) {
  const showLoan = mode === 'loan';
  loanRow?.classList.toggle('is-hidden', !showLoan);
  depositTypeRow?.classList.toggle('is-hidden', showLoan);
  depositAmountRow?.classList.toggle(
    'is-hidden',
    showLoan || depositTypeButtons?.getValue() !== 'amount'
  );
  depositPercentRow?.classList.toggle(
    'is-hidden',
    showLoan || depositTypeButtons?.getValue() !== 'percent'
  );
}

function setDepositTypeVisibility(type) {
  depositAmountRow?.classList.toggle('is-hidden', type !== 'amount');
  depositPercentRow?.classList.toggle('is-hidden', type !== 'percent');
}

function clearOutputs() {
  graphLine?.setAttribute('points', '');
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
  if (!explanationRoot) {
    return;
  }
  propertyValue.textContent = formatNumber(data.propertyValue);
  loanValue.textContent = formatNumber(data.loanAmount);
  depositValue.textContent = formatNumber(data.depositAmount);
  depositPercentValue.textContent = formatPercent(data.depositPercent);
  ltvValue.textContent = formatPercent(data.ltv);
}

function updateGraph(data) {
  if (!graphLine) {
    return;
  }

  const step = 5;
  const maxDeposit = Math.min(100, Math.max(50, Math.ceil(data.depositPercent / step) * step));
  const depositPercents = [];
  for (let pct = 0; pct <= maxDeposit; pct += step) {
    depositPercents.push(pct);
  }
  const ltvValues = depositPercents.map((pct) => Math.max(0, 100 - pct));

  graphLine.setAttribute('points', buildPolyline(ltvValues, 0, 100));
  graphYMax.textContent = '100';
  graphYMid.textContent = '50';
  graphYMin.textContent = '0';
  graphXStart.textContent = '0';
  graphXEnd.textContent = formatNumber(maxDeposit, { maximumFractionDigits: 0 });
  if (graphNote) {
    graphNote.textContent = `Range 0-${maxDeposit}% deposit`;
  }
}

function calculate() {
  if (!resultDiv || !summaryDiv) {
    return;
  }

  resultDiv.textContent = '';
  summaryDiv.textContent = '';
  clearOutputs();

  const propertyValueInput = Number(propertyInput?.value);
  if (!Number.isFinite(propertyValueInput) || propertyValueInput <= 0) {
    setError('Property value must be greater than 0.');
    return;
  }

  const mode = modeButtons?.getValue() ?? 'loan';
  const depositType = depositTypeButtons?.getValue() ?? 'amount';
  const loanAmount = Number(loanInput?.value);
  const depositAmount = Number(depositAmountInput?.value);
  const depositPercent = Number(depositPercentInput?.value);

  if (mode === 'loan') {
    if (!Number.isFinite(loanAmount) || loanAmount <= 0 || loanAmount >= propertyValueInput) {
      setError('Loan amount must be between 0 and the property value.');
      return;
    }
  } else if (depositType === 'amount') {
    if (
      !Number.isFinite(depositAmount) ||
      depositAmount < 0 ||
      depositAmount >= propertyValueInput
    ) {
      setError('Deposit amount must be between 0 and the property value.');
      return;
    }
  } else if (!Number.isFinite(depositPercent) || depositPercent < 0 || depositPercent >= 100) {
    setError('Deposit percent must be between 0 and 100.');
    return;
  }

  const data = calculateLtv({
    propertyValue: propertyValueInput,
    mode,
    loanAmount,
    depositType,
    depositAmount,
    depositPercent,
  });

  if (mode === 'deposit' && depositType === 'percent' && depositAmountInput) {
    depositAmountInput.value = data.depositAmount.toFixed(2);
  }
  if (mode === 'deposit' && depositType === 'amount' && depositPercentInput) {
    depositPercentInput.value = data.depositPercent.toFixed(2);
  }
  if (mode === 'loan' && depositAmountInput) {
    depositAmountInput.value = data.depositAmount.toFixed(2);
  }
  if (mode === 'loan' && depositPercentInput) {
    depositPercentInput.value = data.depositPercent.toFixed(2);
  }

  resultDiv.innerHTML = `<strong>LTV:</strong> ${formatPercent(data.ltv)}`;

  const warning = data.highRisk
    ? '<p><strong>Warning:</strong> LTV above 95% is considered high risk.</p>'
    : '';

  summaryDiv.innerHTML =
    `<p><strong>Deposit:</strong> ${formatNumber(data.depositAmount)} ` +
    `(${formatPercent(data.depositPercent)})</p>` +
    `<p><strong>Band:</strong> ${data.bucket}</p>` +
    warning;

  updateExplanation(data);
  updateGraph(data);
}

setModeVisibility(modeButtons?.getValue() ?? 'loan');
setDepositTypeVisibility(depositTypeButtons?.getValue() ?? 'amount');

calculateButton?.addEventListener('click', calculate);

calculate();
