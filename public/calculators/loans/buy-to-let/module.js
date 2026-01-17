import { formatCurrency, formatNumber, formatPercent } from '/assets/js/core/format.js';
import { setupButtonGroup } from '/assets/js/core/ui.js';
import { calculateBuyToLet } from '/assets/js/core/loan-utils.js';
import { buildPolyline, getPaddedMinMax, sampleValues } from '/assets/js/core/graph-utils.js';

const priceInput = document.querySelector('#btl-price');
const depositAmountInput = document.querySelector('#btl-deposit-amount');
const depositPercentInput = document.querySelector('#btl-deposit-percent');
const depositAmountRow = document.querySelector('#btl-deposit-amount-row');
const depositPercentRow = document.querySelector('#btl-deposit-percent-row');
const rateInput = document.querySelector('#btl-rate');
const termInput = document.querySelector('#btl-term');
const rentInput = document.querySelector('#btl-rent');
const vacancyPercentInput = document.querySelector('#btl-vacancy-percent');
const vacancyMonthsInput = document.querySelector('#btl-vacancy-months');
const vacancyPercentRow = document.querySelector('#btl-vacancy-percent-row');
const vacancyMonthsRow = document.querySelector('#btl-vacancy-months-row');
const agentFeeInput = document.querySelector('#btl-agent-fee');
const maintenanceInput = document.querySelector('#btl-maintenance');
const otherCostsInput = document.querySelector('#btl-other-costs');
const calculateButton = document.querySelector('#btl-calculate');
const resultDiv = document.querySelector('#btl-result');
const summaryDiv = document.querySelector('#btl-summary');

const depositGroup = document.querySelector('[data-button-group="btl-deposit-type"]');
const mortgageGroup = document.querySelector('[data-button-group="btl-mortgage-type"]');
const vacancyGroup = document.querySelector('[data-button-group="btl-vacancy-type"]');

const explanationRoot = document.querySelector('#loan-btl-explanation');
const priceValue = explanationRoot?.querySelector('[data-btl="price"]');
const depositValue = explanationRoot?.querySelector('[data-btl="deposit"]');
const depositPercentValue = explanationRoot?.querySelector('[data-btl="deposit-percent"]');
const loanValue = explanationRoot?.querySelector('[data-btl="loan"]');
const effectiveRentValue = explanationRoot?.querySelector('[data-btl="effective-rent"]');
const mortgagePaymentValue = explanationRoot?.querySelector('[data-btl="mortgage-payment"]');
const netMonthlyValue = explanationRoot?.querySelector('[data-btl="net-monthly"]');
const netAnnualValue = explanationRoot?.querySelector('[data-btl="net-annual"]');
const grossYieldValue = explanationRoot?.querySelector('[data-btl="gross-yield"]');
const netYieldValue = explanationRoot?.querySelector('[data-btl="net-yield"]');
const stressCoverageValue = explanationRoot?.querySelector('[data-btl="stress-coverage"]');

const tableBody = document.querySelector('#btl-table-body');

const cashflowLine = document.querySelector('#btl-cashflow-line polyline');
const cashflowYMax = document.querySelector('#btl-cashflow-y-max');
const cashflowYMid = document.querySelector('#btl-cashflow-y-mid');
const cashflowYMin = document.querySelector('#btl-cashflow-y-min');
const cashflowXStart = document.querySelector('#btl-cashflow-x-start');
const cashflowXEnd = document.querySelector('#btl-cashflow-x-end');
const cashflowNote = document.querySelector('#btl-cashflow-note');

const sensitivityLine = document.querySelector('#btl-sensitivity-line polyline');
const sensitivityYMax = document.querySelector('#btl-sensitivity-y-max');
const sensitivityYMid = document.querySelector('#btl-sensitivity-y-mid');
const sensitivityYMin = document.querySelector('#btl-sensitivity-y-min');
const sensitivityXStart = document.querySelector('#btl-sensitivity-x-start');
const sensitivityXEnd = document.querySelector('#btl-sensitivity-x-end');
const sensitivityNote = document.querySelector('#btl-sensitivity-note');

const depositButtons = setupButtonGroup(depositGroup, {
  defaultValue: 'amount',
  onChange: (value) => {
    setDepositVisibility(value);
    calculate();
  },
});

const mortgageButtons = setupButtonGroup(mortgageGroup, {
  defaultValue: 'interest-only',
  onChange: () => calculate(),
});

const vacancyButtons = setupButtonGroup(vacancyGroup, {
  defaultValue: 'percent',
  onChange: (value) => {
    setVacancyVisibility(value);
    calculate();
  },
});

function setDepositVisibility(type) {
  depositAmountRow?.classList.toggle('is-hidden', type !== 'amount');
  depositPercentRow?.classList.toggle('is-hidden', type !== 'percent');
}

function setVacancyVisibility(type) {
  vacancyPercentRow?.classList.toggle('is-hidden', type !== 'percent');
  vacancyMonthsRow?.classList.toggle('is-hidden', type !== 'months');
}

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
  if (cashflowLine) {
    cashflowLine.setAttribute('points', '');
  }
  if (sensitivityLine) {
    sensitivityLine.setAttribute('points', '');
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

  if (priceValue) {
    priceValue.textContent = formatCurrency(data.price);
  }
  if (depositValue) {
    depositValue.textContent = formatCurrency(data.depositAmount);
  }
  if (depositPercentValue) {
    depositPercentValue.textContent = formatPercent(data.depositPercent);
  }
  if (loanValue) {
    loanValue.textContent = formatCurrency(data.loanAmount);
  }
  if (effectiveRentValue) {
    effectiveRentValue.textContent = formatCurrency(data.effectiveRent);
  }
  if (mortgagePaymentValue) {
    mortgagePaymentValue.textContent = formatCurrency(data.monthlyMortgage);
  }
  if (netMonthlyValue) {
    netMonthlyValue.textContent = formatCurrency(data.netMonthlyCashflow);
  }
  if (netAnnualValue) {
    netAnnualValue.textContent = formatCurrency(data.annualCashflow);
  }
  if (grossYieldValue) {
    grossYieldValue.textContent = formatPercent(data.grossYield);
  }
  if (netYieldValue) {
    netYieldValue.textContent = formatPercent(data.netYield);
  }
  if (stressCoverageValue) {
    stressCoverageValue.textContent = formatNumber(data.stressCoverage, {
      maximumFractionDigits: 2,
    });
  }
}

function updateTable(data) {
  if (!tableBody) {
    return;
  }

  tableBody.innerHTML = data.projection
    .map(
      (row) => `
      <tr>
        <td>${row.year}</td>
        <td>${formatTableNumber(row.rentIncome)}</td>
        <td>${formatTableNumber(row.costs)}</td>
        <td>${formatTableNumber(row.mortgageCost)}</td>
        <td>${formatTableNumber(row.netCashflow)}</td>
        <td>${formatTableNumber(row.cumulativeCashflow)}</td>
      </tr>`
    )
    .join('');
}

function updateCashflowGraph(data) {
  if (!cashflowLine) {
    return;
  }
  const values = data.cashflowSeries.map((entry) => entry.value);
  const sampled = sampleValues(values, 30);
  const { min, max } = getPaddedMinMax(sampled, 0.15);
  const mid = (min + max) / 2;

  cashflowLine.setAttribute('points', buildPolyline(sampled, min, max));
  cashflowYMax.textContent = formatAxisValue(max);
  cashflowYMid.textContent = formatAxisValue(mid);
  cashflowYMin.textContent = formatAxisValue(min);
  cashflowXStart.textContent = '1';
  cashflowXEnd.textContent = String(data.cashflowSeries.length);
  if (cashflowNote) {
    cashflowNote.textContent = `${data.cashflowSeries.length} years`;
  }
}

function updateSensitivityGraph(data) {
  if (!sensitivityLine) {
    return;
  }
  const values = data.sensitivitySeries.map((entry) => entry.value);
  const sampled = sampleValues(values, 20);
  const { min, max } = getPaddedMinMax(sampled, 0.15);
  const mid = (min + max) / 2;

  sensitivityLine.setAttribute('points', buildPolyline(sampled, min, max));
  sensitivityYMax.textContent = formatAxisValue(max);
  sensitivityYMid.textContent = formatAxisValue(mid);
  sensitivityYMin.textContent = formatAxisValue(min);
  sensitivityXStart.textContent = formatNumber(data.sensitivitySeries[0]?.rate ?? 0, {
    maximumFractionDigits: 1,
  });
  sensitivityXEnd.textContent = formatNumber(
    data.sensitivitySeries[data.sensitivitySeries.length - 1]?.rate ?? 0,
    { maximumFractionDigits: 1 }
  );
  if (sensitivityNote) {
    sensitivityNote.textContent = 'Monthly cashflow';
  }
}

function calculate() {
  if (!resultDiv || !summaryDiv) {
    return;
  }

  resultDiv.textContent = '';
  summaryDiv.textContent = '';
  clearOutputs();

  const price = Number(priceInput?.value);
  if (!Number.isFinite(price) || price <= 0) {
    setError('Enter a property price greater than 0.');
    return;
  }

  const depositType = depositButtons?.getValue() ?? 'amount';
  const depositAmount = Number(depositAmountInput?.value);
  const depositPercent = Number(depositPercentInput?.value);

  if (depositType === 'amount') {
    if (!Number.isFinite(depositAmount) || depositAmount < 0 || depositAmount >= price) {
      setError('Deposit amount must be between 0 and the property price.');
      return;
    }
  } else {
    if (!Number.isFinite(depositPercent) || depositPercent < 0 || depositPercent >= 100) {
      setError('Deposit percent must be between 0 and 100.');
      return;
    }
  }

  const annualRate = Number(rateInput?.value);
  if (!Number.isFinite(annualRate) || annualRate < 0) {
    setError('Interest rate must be 0 or more.');
    return;
  }

  const termYears = Number(termInput?.value);
  if (!Number.isFinite(termYears) || termYears < 1) {
    setError('Loan term must be at least 1 year.');
    return;
  }

  const monthlyRent = Number(rentInput?.value);
  if (!Number.isFinite(monthlyRent) || monthlyRent <= 0) {
    setError('Monthly rent must be greater than 0.');
    return;
  }

  const vacancyType = vacancyButtons?.getValue() ?? 'percent';
  const vacancyPercent = Number(vacancyPercentInput?.value);
  const vacancyMonths = Number(vacancyMonthsInput?.value);

  if (vacancyType === 'percent') {
    if (!Number.isFinite(vacancyPercent) || vacancyPercent < 0 || vacancyPercent > 100) {
      setError('Vacancy percent must be between 0 and 100.');
      return;
    }
  } else {
    if (!Number.isFinite(vacancyMonths) || vacancyMonths < 0 || vacancyMonths > 12) {
      setError('Vacancy months must be between 0 and 12.');
      return;
    }
  }

  const agentFeePercent = Number(agentFeeInput?.value);
  if (!Number.isFinite(agentFeePercent) || agentFeePercent < 0) {
    setError('Letting agent fee must be 0 or more.');
    return;
  }

  const maintenanceMonthly = Number(maintenanceInput?.value);
  if (!Number.isFinite(maintenanceMonthly) || maintenanceMonthly < 0) {
    setError('Maintenance costs must be 0 or more.');
    return;
  }

  const otherCostsMonthly = Number(otherCostsInput?.value);
  if (!Number.isFinite(otherCostsMonthly) || otherCostsMonthly < 0) {
    setError('Other monthly costs must be 0 or more.');
    return;
  }

  const mortgageType = mortgageButtons?.getValue() ?? 'interest-only';

  const data = calculateBuyToLet({
    propertyPrice: price,
    depositType,
    depositAmount,
    depositPercent,
    annualRate,
    termYears,
    mortgageType,
    monthlyRent,
    vacancyType,
    vacancyPercent,
    vacancyMonths,
    agentFeePercent,
    maintenanceMonthly,
    otherCostsMonthly,
  });

  if (depositType === 'percent' && depositAmountInput) {
    depositAmountInput.value = data.depositAmount.toFixed(2);
  }
  if (depositType === 'amount' && depositPercentInput) {
    depositPercentInput.value = data.depositPercent.toFixed(2);
  }

  resultDiv.innerHTML = `<strong>Net Monthly Cashflow:</strong> ${formatCurrency(data.netMonthlyCashflow)}`;

  summaryDiv.innerHTML =
    `<p><strong>Monthly mortgage payment:</strong> ${formatCurrency(data.monthlyMortgage)}</p>` +
    `<p><strong>Annual cashflow:</strong> ${formatCurrency(data.annualCashflow)}</p>` +
    `<p><strong>Gross yield:</strong> ${formatPercent(data.grossYield)} | ` +
    `<strong>Net yield:</strong> ${formatPercent(data.netYield)}</p>` +
    `<p><strong>Stress coverage:</strong> ${formatNumber(data.stressCoverage, { maximumFractionDigits: 2 })}</p>`;

  updateExplanation(data);
  updateTable(data);
  updateCashflowGraph(data);
  updateSensitivityGraph(data);
}

setDepositVisibility(depositButtons?.getValue() ?? 'amount');
setVacancyVisibility(vacancyButtons?.getValue() ?? 'percent');

calculateButton?.addEventListener('click', calculate);

calculate();
