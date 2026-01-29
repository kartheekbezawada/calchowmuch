import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import { setupButtonGroup } from '/assets/js/core/ui.js';
import { computeMonthlyPayment } from '/assets/js/core/loan-utils.js';
import { sampleValues, buildPolyline } from '/assets/js/core/graph-utils.js';
import {
  parseStartDate,
  addMonths,
  formatMonthYear,
  formatTerm,
  buildHomeLoanSchedule,
  aggregateYearly,
  buildMonthlySeries,
  buildYearlySeries,
} from '/assets/js/core/home-loan-utils.js';

const priceInput = document.querySelector('#mtg-price');
const downValueInput = document.querySelector('#mtg-down-value');
const downValueLabel = document.querySelector('#mtg-down-value-label');
const termInput = document.querySelector('#mtg-term');
const rateInput = document.querySelector('#mtg-rate');
const taxInput = document.querySelector('#mtg-tax');
const insuranceInput = document.querySelector('#mtg-insurance');
const startInput = document.querySelector('#mtg-start');
const extraInput = document.querySelector('#mtg-extra');
const lumpInput = document.querySelector('#mtg-lump');
const lumpMonthInput = document.querySelector('#mtg-lump-month');
const calculateButton = document.querySelector('#mtg-calculate');
const resultDiv = document.querySelector('#mtg-result');
const summaryDiv = document.querySelector('#mtg-summary');

const downTypeGroup = document.querySelector('[data-button-group="mtg-down-type"]');
const scheduleToggle = document.querySelector('#mtg-schedule-toggle');

const explanationRoot = document.querySelector('#loan-mtg-explanation');
const priceValue = explanationRoot?.querySelector('[data-mtg="price"]');
const downPaymentValue = explanationRoot?.querySelector('[data-mtg="down-payment"]');
const downPercentValue = explanationRoot?.querySelector('[data-mtg="down-percent"]');
const loanAmountValue = explanationRoot?.querySelector('[data-mtg="loan-amount"]');
const rateValue = explanationRoot?.querySelector('[data-mtg="rate"]');
const termValue = explanationRoot?.querySelector('[data-mtg="term"]');
const extraMonthlyValue = explanationRoot?.querySelector('[data-mtg="extra-monthly"]');
const lumpSumValue = explanationRoot?.querySelector('[data-mtg="lump-sum"]');
const escrowValue = explanationRoot?.querySelector('[data-mtg="escrow"]');
const lifetimeSummary = explanationRoot?.querySelector('[data-mtg="lifetime-summary"]');

const lineBaseline = explanationRoot?.querySelector('#mtg-line-base');
const lineOver = explanationRoot?.querySelector('#mtg-line-over');
const graphTitle = explanationRoot?.querySelector('#mtg-graph-title');
const graphNote = explanationRoot?.querySelector('#mtg-graph-note');
const graphYMax = explanationRoot?.querySelector('#mtg-y-max');
const graphYMid = explanationRoot?.querySelector('#mtg-y-mid');
const graphXStart = explanationRoot?.querySelector('#mtg-x-start');
const graphXEnd = explanationRoot?.querySelector('#mtg-x-end');
const graphXLabel = explanationRoot?.querySelector('#mtg-x-label');

const tableTitle = explanationRoot?.querySelector('#mtg-table-title');
const monthlyTableBody = explanationRoot?.querySelector('#mtg-table-monthly-body');
const yearlyTableBody = explanationRoot?.querySelector('#mtg-table-yearly-body');
const monthlyTableWrap = explanationRoot?.querySelector('#mtg-table-monthly-wrap');
const yearlyTableWrap = explanationRoot?.querySelector('#mtg-table-yearly-wrap');

const downTypeButtons = setupButtonGroup(downTypeGroup, {
  defaultValue: 'amount',
  onChange: (value) => {
    handleDownTypeChange(value);
    calculate();
  },
});

let lastDownType = downTypeButtons?.getValue() ?? 'amount';
let currentData = null;
let scheduleView = 'monthly';

function handleDownTypeChange(type) {
  const price = Number(priceInput?.value);
  const rawValue = Number(downValueInput?.value);

  if (
    downValueInput &&
    Number.isFinite(rawValue) &&
    rawValue >= 0 &&
    price > 0 &&
    lastDownType !== type
  ) {
    if (type === 'percent' && lastDownType === 'amount') {
      downValueInput.value = ((rawValue / price) * 100).toFixed(2);
    } else if (type === 'amount' && lastDownType === 'percent') {
      downValueInput.value = ((rawValue / 100) * price).toFixed(2);
    }
  }

  if (downValueLabel) {
    downValueLabel.textContent = type === 'percent' ? 'Down Payment Percent' : 'Down Payment Amount';
  }
  if (downValueInput) {
    downValueInput.setAttribute('placeholder', type === 'percent' ? '0.00' : '0');
  }

  lastDownType = type;
}

function formatTableNumber(value) {
  return formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatAxisValue(value) {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return formatNumber(value, { maximumFractionDigits: 0 });
}

function getMonthLabel(month, startDate) {
  if (!startDate) {
    return String(month);
  }
  const date = addMonths(startDate, month - 1);
  return formatMonthYear(date);
}

function renderMonthlyTable(schedule, startDate) {
  if (!monthlyTableBody) {
    return;
  }
  monthlyTableBody.innerHTML = schedule
    .map(
      (entry) =>
        `<tr>
          <td>${getMonthLabel(entry.month, startDate)}</td>
          <td>${formatTableNumber(entry.payment)}</td>
          <td>${formatTableNumber(entry.principal)}</td>
          <td>${formatTableNumber(entry.interest)}</td>
          <td>${formatTableNumber(entry.extra)}</td>
          <td>${formatTableNumber(entry.balance)}</td>
        </tr>`
    )
    .join('');
}

function renderYearlyTable(yearly) {
  if (!yearlyTableBody) {
    return;
  }
  yearlyTableBody.innerHTML = yearly
    .map(
      (entry) =>
        `<tr>
          <td>${entry.label}</td>
          <td>${formatTableNumber(entry.payment)}</td>
          <td>${formatTableNumber(entry.principal)}</td>
          <td>${formatTableNumber(entry.interest)}</td>
          <td>${formatTableNumber(entry.extra)}</td>
          <td>${formatTableNumber(entry.balance)}</td>
        </tr>`
    )
    .join('');
}

function updateExplanation(data) {
  if (!explanationRoot || !data) {
    return;
  }

  if (priceValue) {
    priceValue.textContent = formatNumber(data.price);
  }
  if (downPaymentValue) {
    downPaymentValue.textContent = formatNumber(data.downAmount);
  }
  if (downPercentValue) {
    downPercentValue.textContent = formatPercent(data.downPercent);
  }
  if (loanAmountValue) {
    loanAmountValue.textContent = formatNumber(data.principal);
  }
  if (rateValue) {
    rateValue.textContent = formatPercent(data.annualRate);
  }
  if (termValue) {
    termValue.textContent = `${formatNumber(data.years, {
      maximumFractionDigits: 2,
    })} years`;
  }
  if (extraMonthlyValue) {
    extraMonthlyValue.textContent =
      data.extraMonthly > 0 ? `${formatNumber(data.extraMonthly)} per month` : 'None';
  }
  if (lumpSumValue) {
    if (data.lumpSum > 0 && data.lumpSumMonth) {
      lumpSumValue.textContent = `${formatNumber(data.lumpSum)} in month ${data.lumpSumMonth}`;
    } else if (data.lumpSum > 0) {
      lumpSumValue.textContent = formatNumber(data.lumpSum);
    } else {
      lumpSumValue.textContent = 'None';
    }
  }
  if (escrowValue) {
    escrowValue.textContent =
      data.escrowMonthly > 0 ? `${formatNumber(data.escrowMonthly)} per month` : 'None';
  }

  const interestSaved = Math.max(0, data.baseline.totalInterest - data.overpayment.totalInterest);
  const payoffText = formatTerm(data.overpayment.months);
  const payoffDate = data.startDate
    ? formatMonthYear(addMonths(data.startDate, data.overpayment.months - 1))
    : null;

  if (lifetimeSummary) {
    lifetimeSummary.textContent =
      `Total paid is ${formatNumber(data.overpayment.totalPayment)}. ` +
      `Total principal is ${formatNumber(data.overpayment.totalPrincipal)} ` +
      `and total interest is ${formatNumber(data.overpayment.totalInterest)}.`;
  }
}

function updateGraph(data, view) {
  if (!lineBaseline || !lineOver) {
    return;
  }

  const isMonthly = view === 'monthly';
  const timeline = isMonthly
    ? Math.max(data.baseline.months, data.overpayment.months)
    : Math.max(data.yearlyBase.length, data.yearlyOver.length);
  const baseSeries = isMonthly
    ? buildMonthlySeries(data.baseline.schedule, data.principal, timeline)
    : buildYearlySeries(data.yearlyBase, data.principal, timeline);
  const overSeries = isMonthly
    ? buildMonthlySeries(data.overpayment.schedule, data.principal, timeline)
    : buildYearlySeries(data.yearlyOver, data.principal, timeline);

  const sampledBase = sampleValues(baseSeries, 60);
  const sampledOver = sampleValues(overSeries, 60);

  lineBaseline.setAttribute('points', buildPolyline(sampledBase, 0, data.principal));
  lineOver.setAttribute('points', buildPolyline(sampledOver, 0, data.principal));

  if (graphTitle) {
    graphTitle.textContent = isMonthly
      ? 'Remaining Balance (Monthly)'
      : 'Remaining Balance (Yearly)';
  }
  if (graphNote) {
    graphNote.textContent = isMonthly ? `${timeline} months` : `${timeline} years`;
  }
  if (graphYMax) {
    graphYMax.textContent = formatAxisValue(data.principal);
  }
  if (graphYMid) {
    graphYMid.textContent = formatAxisValue(data.principal / 2);
  }
  if (graphXStart) {
    graphXStart.textContent = '1';
  }
  if (graphXEnd) {
    graphXEnd.textContent = String(timeline);
  }
  if (graphXLabel) {
    graphXLabel.textContent = isMonthly ? 'Month' : 'Year';
  }
}

function applyView(view) {
  if (!currentData) {
    return;
  }
  const isMonthly = view === 'monthly';
  monthlyTableWrap?.classList.toggle('is-hidden', !isMonthly);
  yearlyTableWrap?.classList.toggle('is-hidden', isMonthly);
  if (tableTitle) {
    tableTitle.textContent = isMonthly
      ? 'Amortization Table (Monthly)'
      : 'Amortization Table (Yearly)';
  }
  updateGraph(currentData, view);
}

function refreshScheduleToggle() {
  if (!scheduleToggle) {
    return;
  }
  const isMonthly = scheduleView === 'monthly';
  scheduleToggle.textContent = isMonthly
    ? 'Switch to Yearly Schedule'
    : 'Switch to Monthly Schedule';
  scheduleToggle.setAttribute('aria-pressed', String(isMonthly));
}

function clearOutputs() {
  if (monthlyTableBody) {
    monthlyTableBody.innerHTML = '';
  }
  if (yearlyTableBody) {
    yearlyTableBody.innerHTML = '';
  }
  if (lineBaseline) {
    lineBaseline.setAttribute('points', '');
  }
  if (lineOver) {
    lineOver.setAttribute('points', '');
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
  currentData = null;
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
    setError('Please enter a valid home price greater than 0.');
    return;
  }

  const downType = downTypeButtons?.getValue() ?? 'amount';
  const downInputValue = Number(downValueInput?.value);

  let downAmount = 0;
  let downPercent = 0;

  if (downType === 'percent') {
    if (!Number.isFinite(downInputValue) || downInputValue < 0 || downInputValue >= 100) {
      setError('Down payment percent must be between 0 and 100.');
      return;
    }
    downPercent = downInputValue;
    downAmount = (price * downPercent) / 100;
  } else {
    if (!Number.isFinite(downInputValue) || downInputValue < 0) {
      setError('Down payment amount must be 0 or more.');
      return;
    }
    downAmount = downInputValue;
    downPercent = price > 0 ? (downAmount / price) * 100 : 0;
    if (downPercent >= 100) {
      setError('Down payment must be less than the home price.');
      return;
    }
  }

  if (downAmount >= price) {
    setError('Down payment must be less than the home price.');
    return;
  }

  if (downValueInput) {
    downValueInput.value = downType === 'percent' ? downPercent.toFixed(2) : downAmount.toFixed(2);
  }

  const principal = price - downAmount;
  if (principal <= 0) {
    setError('Loan amount must be greater than 0.');
    return;
  }

  const years = Number(termInput?.value);
  if (!Number.isFinite(years) || years < 1) {
    setError('Loan term must be at least 1 year.');
    return;
  }

  const annualRate = Number(rateInput?.value);
  if (!Number.isFinite(annualRate) || annualRate < 0) {
    setError('Interest rate must be 0 or more.');
    return;
  }

  const taxAnnual = Number(taxInput?.value);
  if (!Number.isFinite(taxAnnual) || taxAnnual < 0) {
    setError('Property tax must be 0 or more.');
    return;
  }

  const insuranceAnnual = Number(insuranceInput?.value);
  if (!Number.isFinite(insuranceAnnual) || insuranceAnnual < 0) {
    setError('Home insurance must be 0 or more.');
    return;
  }

  const extraMonthly = Number(extraInput?.value);
  if (!Number.isFinite(extraMonthly) || extraMonthly < 0) {
    setError('Extra monthly payment must be 0 or more.');
    return;
  }

  const lumpSum = Number(lumpInput?.value);
  if (!Number.isFinite(lumpSum) || lumpSum < 0) {
    setError('Lump sum payment must be 0 or more.');
    return;
  }

  const months = Math.round(years * 12);
  if (!Number.isFinite(months) || months < 1) {
    setError('Loan term must be at least 1 year.');
    return;
  }

  let lumpSumMonth = null;
  if (lumpSum > 0) {
    const lumpMonthValue = Number(lumpMonthInput?.value);
    if (!Number.isFinite(lumpMonthValue) || lumpMonthValue < 1) {
      setError('Lump sum month must be at least 1.');
      return;
    }
    if (lumpMonthValue > months) {
      setError('Lump sum month must be within the loan term.');
      return;
    }
    lumpSumMonth = Math.round(lumpMonthValue);
  }

  const monthlyRate = annualRate / 100 / 12;
  const payment = computeMonthlyPayment(principal, annualRate, months);
  if (!Number.isFinite(payment) || payment <= 0) {
    setError('Unable to compute payment with the current inputs.');
    return;
  }

  const baseline = buildHomeLoanSchedule({
    principal,
    annualRate,
    months,
    payment,
    extraMonthly: 0,
    lumpSum: 0,
    lumpSumMonth: null,
  });
  const overpayment = buildHomeLoanSchedule({
    principal,
    annualRate,
    months,
    payment,
    extraMonthly,
    lumpSum,
    lumpSumMonth,
  });

  const startDate = parseStartDate(startInput?.value);
  const yearlyBase = aggregateYearly(baseline.schedule, startDate);
  const yearlyOver = aggregateYearly(overpayment.schedule, startDate);
  const escrowMonthly = (taxAnnual + insuranceAnnual) / 12;

  currentData = {
    price,
    downAmount,
    downPercent,
    principal,
    annualRate,
    years,
    months,
    monthlyRate,
    payment,
    escrowMonthly,
    extraMonthly,
    lumpSum,
    lumpSumMonth,
    startDate,
    baseline,
    overpayment,
    yearlyBase,
    yearlyOver,
  };

  resultDiv.innerHTML = `<strong>Monthly Payment (Principal + Interest):</strong> ${formatNumber(payment)}`;

  const interestSaved = Math.max(0, baseline.totalInterest - overpayment.totalInterest);
  const timeSaved = Math.max(0, baseline.months - overpayment.months);
  const payoffText = formatTerm(overpayment.months);
  const payoffDate = startDate
    ? formatMonthYear(addMonths(startDate, overpayment.months - 1))
    : null;
  const escrowLine =
    escrowMonthly > 0
      ? `Total monthly payment (PITI): ${formatNumber(payment + escrowMonthly)} ` +
        `(taxes + insurance ${formatNumber(escrowMonthly)}/mo).`
      : '';
  const extraLine =
    extraMonthly > 0 || lumpSum > 0
      ? `Extra payments save ${formatNumber(interestSaved)} ` + `and ${formatTerm(timeSaved)}.`
      : 'No extra payment applied.';
  const payoffLine = payoffDate ? `${payoffText} (ending ${payoffDate})` : payoffText;

  summaryDiv.innerHTML =
    `<p><strong>Payoff with extras:</strong> ${payoffLine}.</p>` +
    (escrowLine ? `<p>${escrowLine}</p>` : '') +
    `<p>${extraLine}</p>`;

  scheduleView = 'monthly';
  renderMonthlyTable(overpayment.schedule, startDate);
  renderYearlyTable(yearlyOver);
  updateExplanation(currentData);
  applyView(scheduleView);
  refreshScheduleToggle();
}

handleDownTypeChange(lastDownType);

calculateButton?.addEventListener('click', calculate);

scheduleToggle?.addEventListener('click', () => {
  if (!currentData) {
    return;
  }
  scheduleView = scheduleView === 'monthly' ? 'yearly' : 'monthly';
  applyView(scheduleView);
  refreshScheduleToggle();
});

refreshScheduleToggle();

calculate();
