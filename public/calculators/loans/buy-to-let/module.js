import { formatCurrency, formatNumber, formatPercent } from '/assets/js/core/format.js';
import { setupButtonGroup } from '/assets/js/core/ui.js';
import { hasMaxDigits } from '/assets/js/core/validate.js';
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
const rentIncreaseOptions = document.querySelector('#btl-rent-increase-options');
const rentIncreasePercentRow = document.querySelector('#btl-rent-increase-percent-row');
const rentIncreaseAmountRow = document.querySelector('#btl-rent-increase-amount-row');
const rentIncreasePercentInput = document.querySelector('#btl-rent-increase-percent');
const rentIncreaseAmountInput = document.querySelector('#btl-rent-increase-amount');
const rentIncreaseCustomRow = document.querySelector('#btl-rent-increase-custom-row');
const rentIncreaseCustomInput = document.querySelector('#btl-rent-increase-custom');
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
const rentIncreaseGroup = document.querySelector('[data-button-group="btl-rent-increase"]');
const rentIncreaseTypeGroup = document.querySelector('[data-button-group="btl-rent-increase-type"]');
const rentIncreaseFrequencyGroup = document.querySelector(
  '[data-button-group="btl-rent-increase-frequency"]'
);

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
const rentIncreaseExplainer = explanationRoot?.querySelector('#btl-rent-increase-explainer');
const rentIncreaseDescValue = explanationRoot?.querySelector('[data-btl="rent-increase-desc"]');
const rentIncreaseStartValue = explanationRoot?.querySelector('[data-btl="rent-increase-start"]');
const rentIncreaseEndValue = explanationRoot?.querySelector('[data-btl="rent-increase-end"]');
const rentIncreaseYearsValue = explanationRoot?.querySelector('[data-btl="rent-increase-years"]');
const rateCurrentValue = explanationRoot?.querySelector('[data-btl="rate-current"]');
const cashflowCurrentValue = explanationRoot?.querySelector('[data-btl="cashflow-current"]');
const rateHigherValue = explanationRoot?.querySelector('[data-btl="rate-higher"]');
const cashflowHigherValue = explanationRoot?.querySelector('[data-btl="cashflow-higher"]');

const tableBody = document.querySelector('#btl-table-body');

const cashflowLine = document.querySelector('#btl-cashflow-line .line-primary');
const cashflowIncreaseLine = document.querySelector('#btl-cashflow-line .line-rent-increase');
const cashflowYMax = document.querySelector('#btl-cashflow-y-max');
const cashflowYMid = document.querySelector('#btl-cashflow-y-mid');
const cashflowYMin = document.querySelector('#btl-cashflow-y-min');
const cashflowXStart = document.querySelector('#btl-cashflow-x-start');
const cashflowXEnd = document.querySelector('#btl-cashflow-x-end');
const cashflowNote = document.querySelector('#btl-cashflow-note');
const cashflowLegendIncrease = document.querySelector('#btl-cashflow-legend-increase');
const cashflowHoverLayer = document.querySelector('#btl-cashflow-hover');
const cashflowTooltip = document.querySelector('#btl-cashflow-tooltip');
const cashflowTooltipTitle = document.querySelector('#btl-cashflow-tooltip-title');
const cashflowTooltipBaseline = document.querySelector('#btl-cashflow-tooltip-baseline');
const cashflowTooltipIncrease = document.querySelector('#btl-cashflow-tooltip-increase');
const cashflowTooltipApplied = document.querySelector('#btl-cashflow-tooltip-applied');

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

const rentIncreaseButtons = setupButtonGroup(rentIncreaseGroup, {
  defaultValue: 'off',
  onChange: (value) => {
    setRentIncreaseVisibility(value === 'on');
    calculate();
  },
});

const rentIncreaseTypeButtons = setupButtonGroup(rentIncreaseTypeGroup, {
  defaultValue: 'percent',
  onChange: (value) => {
    setRentIncreaseTypeVisibility(value);
    calculate();
  },
});

const rentIncreaseFrequencyButtons = setupButtonGroup(rentIncreaseFrequencyGroup, {
  defaultValue: '1',
  onChange: (value) => {
    setRentIncreaseFrequencyVisibility(value);
    calculate();
  },
});

let cashflowTooltipData = null;

function setDepositVisibility(type) {
  depositAmountRow?.classList.toggle('is-hidden', type !== 'amount');
  depositPercentRow?.classList.toggle('is-hidden', type !== 'percent');
}

function setVacancyVisibility(type) {
  vacancyPercentRow?.classList.toggle('is-hidden', type !== 'percent');
  vacancyMonthsRow?.classList.toggle('is-hidden', type !== 'months');
}

function setRentIncreaseVisibility(isEnabled) {
  rentIncreaseOptions?.classList.toggle('is-hidden', !isEnabled);
}

function setRentIncreaseTypeVisibility(type) {
  rentIncreasePercentRow?.classList.toggle('is-hidden', type !== 'percent');
  rentIncreaseAmountRow?.classList.toggle('is-hidden', type !== 'amount');
}

function setRentIncreaseFrequencyVisibility(value) {
  rentIncreaseCustomRow?.classList.toggle('is-hidden', value !== 'custom');
}

function formatTableNumber(value) {
  return formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatAxisValue(value) {
  return formatNumber(value, { maximumFractionDigits: 0 });
}

function formatIncreaseIndicator(row, data) {
  if (!data?.rentIncreaseEnabled || !row?.rentIncreaseApplied) {
    return '—';
  }

  if (data.rentIncreaseType === 'percent') {
    const percent = formatNumber(data.rentIncreaseValue, { maximumFractionDigits: 2 });
    return `Yes (+${percent}%)`;
  }

  const amount = formatCurrency(data.rentIncreaseValue);
  return `Yes (+${amount})`;
}

function formatIncreaseAppliedText(data, row) {
  if (!data?.rentIncreaseEnabled) {
    return '';
  }
  if (!row?.rentIncreaseApplied) {
    return 'Increase applied: No';
  }
  if (data.rentIncreaseType === 'percent') {
    const percent = formatNumber(data.rentIncreaseValue, { maximumFractionDigits: 2 });
    return `Increase applied: +${percent}%`;
  }
  const amount = formatCurrency(data.rentIncreaseValue);
  return `Increase applied: +${amount}`;
}

function clearOutputs() {
  if (tableBody) {
    tableBody.innerHTML = '';
  }
  if (cashflowLine) {
    cashflowLine.setAttribute('points', '');
  }
  if (cashflowIncreaseLine) {
    cashflowIncreaseLine.setAttribute('points', '');
  }
  if (cashflowTooltip) {
    cashflowTooltip.classList.add('is-hidden');
    cashflowTooltip.setAttribute('aria-hidden', 'true');
  }
  cashflowTooltipData = null;
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

  if (rentIncreaseExplainer) {
    rentIncreaseExplainer.classList.toggle('is-hidden', !data.rentIncreaseEnabled);
  }
  if (data.rentIncreaseEnabled) {
    if (rentIncreaseDescValue) {
      const intervalLabel =
        data.rentIncreaseInterval === 1
          ? 'every year'
          : `every ${data.rentIncreaseInterval} years`;
      const valueLabel =
        data.rentIncreaseType === 'percent'
          ? `${formatNumber(data.rentIncreaseValue, { maximumFractionDigits: 2 })}%`
          : `${formatCurrency(data.rentIncreaseValue)} per year`;
      rentIncreaseDescValue.textContent = `${valueLabel} ${intervalLabel}`;
    }
    if (rentIncreaseStartValue) {
      rentIncreaseStartValue.textContent = formatCurrency(
        data.projection[0]?.netCashflow ?? 0
      );
    }
    if (rentIncreaseEndValue) {
      rentIncreaseEndValue.textContent = formatCurrency(
        data.projection[data.projection.length - 1]?.netCashflow ?? 0
      );
    }
    if (rentIncreaseYearsValue) {
      rentIncreaseYearsValue.textContent = String(data.projection.length);
    }
  }

  if (data.rateScenario) {
    if (rateCurrentValue) {
      rateCurrentValue.textContent = `${formatNumber(data.rateScenario.currentRate, {
        maximumFractionDigits: 2,
      })}%`;
    }
    if (cashflowCurrentValue) {
      cashflowCurrentValue.textContent = `${formatCurrency(
        data.rateScenario.currentNetMonthly
      )} / month`;
    }
    if (rateHigherValue) {
      rateHigherValue.textContent = `${formatNumber(data.rateScenario.higherRate, {
        maximumFractionDigits: 2,
      })}%`;
    }
    if (cashflowHigherValue) {
      cashflowHigherValue.textContent = `${formatCurrency(
        data.rateScenario.higherNetMonthly
      )} / month`;
    }
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
        <td>${formatIncreaseIndicator(row, data)}</td>
      </tr>`
    )
    .join('');
}

function updateCashflowGraph(data) {
  if (!cashflowLine) {
    return;
  }
  const baselineValues = data.cashflowSeriesBaseline.map((entry) => entry.value);
  const increaseValues = data.rentIncreaseEnabled
    ? data.cashflowSeriesWithIncrease.map((entry) => entry.value)
    : [];
  const sampledBaseline = sampleValues(baselineValues, 30);
  const sampledIncrease = data.rentIncreaseEnabled ? sampleValues(increaseValues, 30) : [];
  const combinedValues = sampledBaseline.concat(sampledIncrease);
  const { min, max } = getPaddedMinMax(combinedValues, 0.15);
  const mid = (min + max) / 2;

  cashflowLine.setAttribute('points', buildPolyline(sampledBaseline, min, max));
  if (cashflowIncreaseLine) {
    cashflowIncreaseLine.setAttribute(
      'points',
      data.rentIncreaseEnabled ? buildPolyline(sampledIncrease, min, max) : ''
    );
  }
  if (cashflowLegendIncrease) {
    cashflowLegendIncrease.classList.toggle('is-hidden', !data.rentIncreaseEnabled);
  }
  cashflowYMax.textContent = formatAxisValue(max);
  cashflowYMid.textContent = formatAxisValue(mid);
  cashflowYMin.textContent = formatAxisValue(min);
  cashflowXStart.textContent = '1';
  cashflowXEnd.textContent = String(data.baselineProjection.length);
  if (cashflowNote) {
    cashflowNote.textContent = data.rentIncreaseEnabled
      ? `${data.baselineProjection.length} years (rent increase on)`
      : `${data.baselineProjection.length} years`;
  }

  cashflowTooltipData = {
    baseline: data.baselineProjection,
    projection: data.projection,
    rentIncreaseEnabled: data.rentIncreaseEnabled,
    rentIncreaseType: data.rentIncreaseType,
    rentIncreaseValue: data.rentIncreaseValue,
    rentIncreaseInterval: data.rentIncreaseInterval,
  };
}

function showCashflowTooltip(event) {
  if (
    !cashflowHoverLayer ||
    !cashflowTooltip ||
    !cashflowTooltipTitle ||
    !cashflowTooltipBaseline ||
    !cashflowTooltipData
  ) {
    return;
  }

  const { baseline, projection } = cashflowTooltipData;
  if (!baseline?.length) {
    return;
  }

  const bounds = cashflowHoverLayer.getBoundingClientRect();
  const x = event.clientX - bounds.left;
  const y = event.clientY - bounds.top;
  const clampedX = Math.min(Math.max(x, 0), bounds.width);
  const index = Math.min(
    baseline.length - 1,
    Math.max(0, Math.round((clampedX / bounds.width) * (baseline.length - 1)))
  );

  const baselineRow = baseline[index];
  const projectionRow = projection[index] ?? baselineRow;

  cashflowTooltipTitle.textContent = `Year ${baselineRow.year}`;
  cashflowTooltipBaseline.textContent = `Baseline: ${formatCurrency(baselineRow.netCashflow)}`;

  if (cashflowTooltipIncrease && cashflowTooltipApplied) {
    if (cashflowTooltipData.rentIncreaseEnabled) {
      cashflowTooltipIncrease.classList.remove('is-hidden');
      cashflowTooltipIncrease.textContent = `With increase: ${formatCurrency(
        projectionRow.netCashflow
      )}`;
      cashflowTooltipApplied.classList.remove('is-hidden');
      cashflowTooltipApplied.textContent = formatIncreaseAppliedText(
        cashflowTooltipData,
        projectionRow
      );
    } else {
      cashflowTooltipIncrease.classList.add('is-hidden');
      cashflowTooltipApplied.classList.add('is-hidden');
    }
  }

  cashflowTooltip.style.left = `${clampedX}px`;
  cashflowTooltip.style.top = `${y}px`;
  cashflowTooltip.classList.remove('is-hidden');
  cashflowTooltip.setAttribute('aria-hidden', 'false');
}

function hideCashflowTooltip() {
  if (!cashflowTooltip) {
    return;
  }
  cashflowTooltip.classList.add('is-hidden');
  cashflowTooltip.setAttribute('aria-hidden', 'true');
}

function calculate() {
  if (!resultDiv || !summaryDiv) {
    return;
  }

  resultDiv.textContent = '';
  summaryDiv.textContent = '';
  clearOutputs();

  const inputsToValidate = [
    priceInput,
    depositAmountInput,
    depositPercentInput,
    rateInput,
    termInput,
    rentInput,
    rentIncreasePercentInput,
    rentIncreaseAmountInput,
    rentIncreaseCustomInput,
    vacancyPercentInput,
    vacancyMonthsInput,
    agentFeeInput,
    maintenanceInput,
    otherCostsInput,
  ].filter(Boolean);

  const invalidLength = inputsToValidate.find((input) => !hasMaxDigits(input.value, 10));
  if (invalidLength) {
    setError('Inputs must be 10 digits or fewer.');
    return;
  }

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

  const rentIncreaseEnabled = rentIncreaseButtons?.getValue() === 'on';
  const rentIncreaseType = rentIncreaseTypeButtons?.getValue() ?? 'percent';
  const rentIncreaseValue = Number(
    rentIncreaseType === 'amount' ? rentIncreaseAmountInput?.value : rentIncreasePercentInput?.value
  );
  const rentIncreaseFrequency = rentIncreaseFrequencyButtons?.getValue() ?? '1';
  const rentIncreaseInterval =
    rentIncreaseFrequency === 'custom'
      ? Number(rentIncreaseCustomInput?.value)
      : Number(rentIncreaseFrequency);

  if (rentIncreaseEnabled) {
    if (!Number.isFinite(rentIncreaseValue) || rentIncreaseValue < 0) {
      setError('Rent increase must be 0 or more.');
      return;
    }
    if (!Number.isFinite(rentIncreaseInterval) || rentIncreaseInterval < 1) {
      setError('Rent increase interval must be at least 1 year.');
      return;
    }
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
    rentIncreaseEnabled,
    rentIncreaseType,
    rentIncreaseValue: rentIncreaseEnabled ? rentIncreaseValue : 0,
    rentIncreaseInterval: rentIncreaseEnabled ? rentIncreaseInterval : 1,
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
}

setDepositVisibility(depositButtons?.getValue() ?? 'amount');
setVacancyVisibility(vacancyButtons?.getValue() ?? 'percent');
setRentIncreaseVisibility(rentIncreaseButtons?.getValue() === 'on');
setRentIncreaseTypeVisibility(rentIncreaseTypeButtons?.getValue() ?? 'percent');
setRentIncreaseFrequencyVisibility(rentIncreaseFrequencyButtons?.getValue() ?? '1');

calculateButton?.addEventListener('click', calculate);
cashflowHoverLayer?.addEventListener('mousemove', showCashflowTooltip);
cashflowHoverLayer?.addEventListener('mouseleave', hideCashflowTooltip);

calculate();
