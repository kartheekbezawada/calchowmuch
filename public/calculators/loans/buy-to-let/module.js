import { formatNumber, formatPercent } from '/assets/js/core/format.js';
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
const rentIncreaseFrequencyInput = document.querySelector('#btl-rent-increase-frequency');
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
const formatLoanCurrency = (value) => formatNumber(value, 'GBP');

const depositGroup = document.querySelector('[data-button-group="btl-deposit-type"]');
const mortgageGroup = document.querySelector('[data-button-group="btl-mortgage-type"]');
const vacancyGroup = document.querySelector('[data-button-group="btl-vacancy-type"]');
const rentIncreaseGroup = document.querySelector('[data-button-group="btl-rent-increase"]');
const rentIncreaseTypeGroup = document.querySelector('[data-button-group="btl-rent-increase-type"]');

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

let tableBody = document.querySelector('#btl-table-body');

let cashflowLine = document.querySelector('#btl-cashflow-line .line-primary');
let cashflowIncreaseLine = document.querySelector('#btl-cashflow-line .line-rent-increase');
let cashflowYMax = document.querySelector('#btl-cashflow-y-max');
let cashflowYMid = document.querySelector('#btl-cashflow-y-mid');
let cashflowYMin = document.querySelector('#btl-cashflow-y-min');
let cashflowXStart = document.querySelector('#btl-cashflow-x-start');
let cashflowXEnd = document.querySelector('#btl-cashflow-x-end');
let cashflowNote = document.querySelector('#btl-cashflow-note');
let cashflowLegendIncrease = document.querySelector('#btl-cashflow-legend-increase');
let cashflowHoverLayer = document.querySelector('#btl-cashflow-hover');
let cashflowGraphPanel = document.querySelector('#btl-cashflow-graph');
let cashflowGraphWrapper =
  cashflowHoverLayer?.closest('.graph-bars-wrapper') ??
  document.querySelector('#btl-cashflow-graph .graph-bars-wrapper');
let cashflowTooltip = document.querySelector('#btl-cashflow-tooltip');
let cashflowTooltipTitle = document.querySelector('#btl-cashflow-tooltip-title');
let cashflowTooltipBaseline = document.querySelector('#btl-cashflow-tooltip-baseline');
let cashflowTooltipIncrease = document.querySelector('#btl-cashflow-tooltip-increase');
let cashflowTooltipApplied = document.querySelector('#btl-cashflow-tooltip-applied');
let cashflowTooltipBound = false;
let cashflowTooltipTargets = new Set();
let documentTooltipBound = false;

const MAX_INPUT_LENGTH = 10;

function cacheCashflowElements() {
  tableBody = document.querySelector('#btl-table-body');
  cashflowLine = document.querySelector('#btl-cashflow-line .line-primary');
  cashflowIncreaseLine = document.querySelector('#btl-cashflow-line .line-rent-increase');
  cashflowYMax = document.querySelector('#btl-cashflow-y-max');
  cashflowYMid = document.querySelector('#btl-cashflow-y-mid');
  cashflowYMin = document.querySelector('#btl-cashflow-y-min');
  cashflowXStart = document.querySelector('#btl-cashflow-x-start');
  cashflowXEnd = document.querySelector('#btl-cashflow-x-end');
  cashflowNote = document.querySelector('#btl-cashflow-note');
  cashflowLegendIncrease = document.querySelector('#btl-cashflow-legend-increase');
  cashflowHoverLayer = document.querySelector('#btl-cashflow-hover');
  cashflowGraphPanel = document.querySelector('#btl-cashflow-graph');
  cashflowGraphWrapper =
    cashflowHoverLayer?.closest('.graph-bars-wrapper') ??
    document.querySelector('#btl-cashflow-graph .graph-bars-wrapper');
  cashflowTooltip = document.querySelector('#btl-cashflow-tooltip');
  cashflowTooltipTitle = document.querySelector('#btl-cashflow-tooltip-title');
  cashflowTooltipBaseline = document.querySelector('#btl-cashflow-tooltip-baseline');
  cashflowTooltipIncrease = document.querySelector('#btl-cashflow-tooltip-increase');
  cashflowTooltipApplied = document.querySelector('#btl-cashflow-tooltip-applied');
}

cacheCashflowElements();

function enforceMaxLength(input) {
  if (!input) {
    return;
  }
  input.addEventListener('input', () => {
    const { value } = input;
    if (value.length > MAX_INPUT_LENGTH) {
      input.value = value.slice(0, MAX_INPUT_LENGTH);
    }
  });
}

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


[
  priceInput,
  depositAmountInput,
  depositPercentInput,
  rateInput,
  termInput,
  rentInput,
  rentIncreasePercentInput,
  rentIncreaseAmountInput,
  rentIncreaseFrequencyInput,
  vacancyPercentInput,
  vacancyMonthsInput,
  agentFeeInput,
  maintenanceInput,
  otherCostsInput,
].forEach(enforceMaxLength);

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

  const percent = getRentIncreasePercent(row, data);
  if (percent === null) {
    return 'Yes';
  }
  return `Yes (+${formatNumber(percent, { maximumFractionDigits: 2 })}%)`;
}

function formatIncreaseAppliedText(data, row) {
  if (!data?.rentIncreaseEnabled) {
    return '';
  }
  if (!row?.rentIncreaseApplied) {
    return 'Increase applied: No';
  }
  const percent = getRentIncreasePercent(row, data);
  if (percent === null) {
    return 'Increase applied: Yes';
  }
  return `Increase applied: +${formatNumber(percent, { maximumFractionDigits: 2 })}%`;
}

function getRentIncreasePercent(row, data) {
  if (!row?.rentIncreaseApplied) {
    return null;
  }
  if (data.rentIncreaseType === 'percent') {
    return data.rentIncreaseValue;
  }
  const previousRent = row.rentMonthly - row.rentIncreaseAmount;
  if (!Number.isFinite(previousRent) || previousRent <= 0) {
    return null;
  }
  return (row.rentIncreaseAmount / previousRent) * 100;
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
    priceValue.textContent = formatLoanCurrency(data.price);
  }
  if (depositValue) {
    depositValue.textContent = formatLoanCurrency(data.depositAmount);
  }
  if (depositPercentValue) {
    depositPercentValue.textContent = formatPercent(data.depositPercent);
  }
  if (loanValue) {
    loanValue.textContent = formatLoanCurrency(data.loanAmount);
  }
  if (effectiveRentValue) {
    effectiveRentValue.textContent = formatLoanCurrency(data.effectiveRent);
  }
  if (mortgagePaymentValue) {
    mortgagePaymentValue.textContent = formatLoanCurrency(data.monthlyMortgage);
  }
  if (netMonthlyValue) {
    netMonthlyValue.textContent = formatLoanCurrency(data.netMonthlyCashflow);
  }
  if (netAnnualValue) {
    netAnnualValue.textContent = formatLoanCurrency(data.annualCashflow);
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
          : `${formatLoanCurrency(data.rentIncreaseValue)} per year`;
      rentIncreaseDescValue.textContent = `${valueLabel} ${intervalLabel}`;
    }
    if (rentIncreaseStartValue) {
      rentIncreaseStartValue.textContent = formatLoanCurrency(
        data.projection[0]?.netCashflow ?? 0
      );
    }
    if (rentIncreaseEndValue) {
      rentIncreaseEndValue.textContent = formatLoanCurrency(
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
      cashflowCurrentValue.textContent = `${formatLoanCurrency(
        data.rateScenario.currentNetMonthly
      )} / month`;
    }
    if (rateHigherValue) {
      rateHigherValue.textContent = `${formatNumber(data.rateScenario.higherRate, {
        maximumFractionDigits: 2,
      })}%`;
    }
    if (cashflowHigherValue) {
      cashflowHigherValue.textContent = `${formatLoanCurrency(
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
        <td>${formatTableNumber(row.mortgageCost)}</td>
        <td>${formatTableNumber(row.costs)}</td>
        <td>${formatTableNumber(row.netCashflow)}</td>
        <td class="${row.cumulativeCashflow < 0 ? 'btl-negative' : ''}">
          ${formatTableNumber(row.cumulativeCashflow)}
        </td>
        <td>${formatIncreaseIndicator(row, data)}</td>
      </tr>`
    )
    .join('');
}

function updateCashflowGraph(data) {
  cacheCashflowElements();

  const baselineValues = data.cashflowSeriesBaseline.map((entry) => entry.value);
  const increaseValues = data.rentIncreaseEnabled
    ? data.cashflowSeriesWithIncrease.map((entry) => entry.value)
    : [];
  const sampledBaseline = sampleValues(baselineValues, 30);
  const sampledIncrease = data.rentIncreaseEnabled ? sampleValues(increaseValues, 30) : [];
  const combinedValues = sampledBaseline.concat(sampledIncrease);
  const { min, max } = getPaddedMinMax(combinedValues, 0.15);
  const mid = (min + max) / 2;

  if (cashflowLine) {
    cashflowLine.setAttribute('points', buildPolyline(sampledBaseline, min, max));
  }
  if (cashflowIncreaseLine) {
    cashflowIncreaseLine.setAttribute(
      'points',
      data.rentIncreaseEnabled ? buildPolyline(sampledIncrease, min, max) : ''
    );
  }
  if (cashflowLegendIncrease) {
    cashflowLegendIncrease.classList.toggle('is-hidden', !data.rentIncreaseEnabled);
  }
  if (cashflowYMax) {
    cashflowYMax.textContent = formatAxisValue(max);
  }
  if (cashflowYMid) {
    cashflowYMid.textContent = formatAxisValue(mid);
  }
  if (cashflowYMin) {
    cashflowYMin.textContent = formatAxisValue(min);
  }
  if (cashflowXStart) {
    cashflowXStart.textContent = '1';
  }
  if (cashflowXEnd) {
    cashflowXEnd.textContent = String(data.baselineProjection.length);
  }
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

  ensureCashflowTooltipBindings();
}

function ensureCashflowTooltipBindings() {
  cacheCashflowElements();
  const targets = [cashflowHoverLayer, cashflowGraphWrapper, cashflowGraphPanel].filter(Boolean);
  if (!targets.length) {
    return;
  }

  const nextTargets = new Set(targets);
  cashflowTooltipTargets.forEach((target) => {
    if (!nextTargets.has(target)) {
      target.removeEventListener('mousemove', showCashflowTooltip);
      target.removeEventListener('mouseleave', hideCashflowTooltip);
    }
  });

  targets.forEach((target) => {
    if (!cashflowTooltipTargets.has(target)) {
      target.addEventListener('mousemove', showCashflowTooltip);
      target.addEventListener('mouseleave', hideCashflowTooltip);
    }
  });

  cashflowTooltipTargets = nextTargets;
  cashflowTooltipBound = true;

  if (!documentTooltipBound) {
    document.addEventListener('mousemove', handleDocumentTooltip);
    documentTooltipBound = true;
  }
}

function handleDocumentTooltip(event) {
  if (!cashflowTooltipData) {
    return;
  }

  const graphPanel = cashflowGraphPanel ?? document.querySelector('#btl-cashflow-graph');
  if (!graphPanel) {
    return;
  }

  const bounds = graphPanel.getBoundingClientRect();
  const inside =
    event.clientX >= bounds.left &&
    event.clientX <= bounds.right &&
    event.clientY >= bounds.top &&
    event.clientY <= bounds.bottom;

  if (!inside) {
    hideCashflowTooltip();
    return;
  }

  showCashflowTooltip(event);
}

function showCashflowTooltip(event) {
  if (!cashflowTooltip || !cashflowTooltipTitle || !cashflowTooltipBaseline) {
    cacheCashflowElements();
  }

  const hoverTarget =
    cashflowGraphPanel ||
    cashflowGraphWrapper ||
    cashflowHoverLayer ||
    event.currentTarget;
  if (
    !hoverTarget ||
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

  const panelBounds = cashflowGraphPanel?.getBoundingClientRect();
  const wrapperBounds = cashflowGraphWrapper?.getBoundingClientRect();
  const hoverBounds = hoverTarget.getBoundingClientRect();
  const effectiveBounds =
    panelBounds && panelBounds.width > 0 && panelBounds.height > 0
      ? panelBounds
      : wrapperBounds && wrapperBounds.width > 0 && wrapperBounds.height > 0
        ? wrapperBounds
        : hoverBounds;
  if (!effectiveBounds || effectiveBounds.width <= 0 || effectiveBounds.height <= 0) {
    return;
  }

  const totalWidth = effectiveBounds.width;
  const x = event.clientX - effectiveBounds.left;
  const y = event.clientY - effectiveBounds.top;
  const clampedX = Math.min(Math.max(x, 0), effectiveBounds.width);
  const clampedY = Math.min(Math.max(y, 0), effectiveBounds.height);
  const relativeX = Math.min(Math.max(clampedX, 0), totalWidth);
  const index = Math.min(
    baseline.length - 1,
    Math.max(0, Math.floor((relativeX / totalWidth) * (baseline.length - 1)))
  );

  const baselineRow = baseline[index];
  if (!baselineRow) {
    return;
  }
  const projectionRow = projection[index] ?? baselineRow;

  cashflowTooltipTitle.textContent = `Year ${baselineRow.year}`;
  cashflowTooltipBaseline.textContent = `Baseline: ${formatLoanCurrency(baselineRow.netCashflow)}`;

  if (cashflowTooltipIncrease && cashflowTooltipApplied) {
    if (cashflowTooltipData.rentIncreaseEnabled) {
      cashflowTooltipIncrease.classList.remove('is-hidden');
      cashflowTooltipIncrease.textContent = `With increase: ${formatLoanCurrency(
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

  cashflowTooltip.style.left = `${relativeX}px`;
  cashflowTooltip.style.top = `${clampedY}px`;
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

  cacheCashflowElements();

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
  const rentIncreaseInterval = Number(rentIncreaseFrequencyInput?.value ?? 1);

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

  resultDiv.innerHTML = `<strong>Net Monthly Cashflow:</strong> ${formatLoanCurrency(
    data.netMonthlyCashflow
  )}`;

  summaryDiv.innerHTML =
    `<p><strong>Monthly mortgage payment:</strong> ${formatLoanCurrency(data.monthlyMortgage)}</p>` +
    `<p><strong>Annual cashflow:</strong> ${formatLoanCurrency(data.annualCashflow)}</p>` +
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

calculateButton?.addEventListener('click', calculate);

// Advanced Options Toggle
const advancedToggle = document.getElementById('btl-advanced-toggle');
const advancedOptions = document.getElementById('btl-advanced-options');

if (advancedToggle && advancedOptions) {
  advancedToggle.addEventListener('click', () => {
    const expanded = advancedToggle.getAttribute('aria-expanded') === 'true';
    advancedToggle.setAttribute('aria-expanded', String(!expanded));
    advancedOptions.hidden = expanded;
    advancedOptions.classList.toggle('is-collapsed', expanded);
    advancedToggle.textContent = expanded ? 'Show Advanced Options' : 'Hide Advanced Options';
  });
}

calculate();
