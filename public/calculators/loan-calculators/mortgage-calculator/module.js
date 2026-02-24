import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import { setupButtonGroup } from '/assets/js/core/ui.js';
import { computeMonthlyPayment } from '/assets/js/core/loan-utils.js';
import {
  parseStartDate,
  addMonths,
  formatMonthYear,
  formatTerm,
  buildHomeLoanSchedule,
  aggregateYearly,
  buildMonthlySeries,
} from '/assets/js/core/home-loan-utils.js';
import { createMortgageBalanceChart } from '/calculators/loan-calculators/mortgage-calculator/mortgage-balance-chart.js?v=20260224';

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

const downTypeGroup = document.querySelector('[data-button-group="mtg-down-type"]');
const viewMonthlyButton = document.querySelector('#mtg-view-monthly');
const viewYearlyButton = document.querySelector('#mtg-view-yearly');

const priceValue = document.querySelector('[data-mtg="price"]');
const downPaymentValue = document.querySelector('[data-mtg="down-payment"]');
const downPercentValue = document.querySelector('[data-mtg="down-percent"]');
const loanAmountValue = document.querySelector('[data-mtg="loan-amount"]');
const rateValue = document.querySelector('[data-mtg="rate"]');
const termValue = document.querySelector('[data-mtg="term"]');
const extraMonthlyValue = document.querySelector('[data-mtg="extra-monthly"]');
const lumpSumValue = document.querySelector('[data-mtg="lump-sum"]');
const escrowValue = document.querySelector('[data-mtg="escrow"]');
const totalPaidValue = document.querySelector('[data-mtg="total-paid"]');
const totalPrincipalValue = document.querySelector('[data-mtg="total-principal"]');
const totalInterestValue = document.querySelector('[data-mtg="total-interest"]');
const lifetimeSummary = document.querySelector('[data-mtg="lifetime-summary"]');
const lifetimeDonut = document.querySelector('[data-mtg="lifetime-donut"]');
const principalShareValue = document.querySelector('[data-mtg="principal-share"]');
const interestShareValue = document.querySelector('[data-mtg="interest-share"]');

const priceDisplay = document.querySelector('#mtg-price-display');
const downDisplay = document.querySelector('#mtg-down-display');
const termDisplay = document.querySelector('#mtg-term-display');
const rateDisplay = document.querySelector('#mtg-rate-display');

const monthlyTableBody = document.querySelector('#mtg-table-monthly-body');
const yearlyTableBody = document.querySelector('#mtg-table-yearly-body');
const monthlyTableWrap = document.querySelector('#mtg-table-monthly-wrap');
const yearlyTableWrap = document.querySelector('#mtg-table-yearly-wrap');
const balanceChartCanvas = document.querySelector('#mtg-balance-canvas');
const balanceChartTooltip = document.querySelector('#mtg-balance-tooltip');
const balanceChartStatus = document.querySelector('#mtg-balance-status');
const chartPayoffBase = document.querySelector('[data-mtg="chart-payoff-base"]');
const chartPayoffExtra = document.querySelector('[data-mtg="chart-payoff-extra"]');
const chartMonthsSaved = document.querySelector('[data-mtg="chart-months-saved"]');
const chartInterestSaved = document.querySelector('[data-mtg="chart-interest-saved"]');

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
const balanceChart = createMortgageBalanceChart({
  canvas: balanceChartCanvas,
  tooltip: balanceChartTooltip,
  status: balanceChartStatus,
});

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
    downValueLabel.textContent =
      type === 'percent' ? 'Down Payment Percent' : 'Down Payment Amount';
  }
  if (downValueInput) {
    if (type === 'percent') {
      downValueInput.min = 0;
      downValueInput.max = 99;
      downValueInput.step = 1;
    } else {
      downValueInput.min = 0;
      downValueInput.max = 2000000;
      downValueInput.step = 5000;
    }
  }

  lastDownType = type;
  updateSliderDisplays();
}

function formatMoney(value) {
  return formatExplanationNumber(value);
}

function formatExplanationNumber(value) {
  return formatNumber(value, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });
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
          <td>${formatExplanationNumber(entry.payment)}</td>
          <td>${formatExplanationNumber(entry.principal)}</td>
          <td>${formatExplanationNumber(entry.interest)}</td>
          <td>${formatExplanationNumber(entry.extra)}</td>
          <td>${formatExplanationNumber(entry.balance)}</td>
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
          <td>${formatExplanationNumber(entry.payment)}</td>
          <td>${formatExplanationNumber(entry.principal)}</td>
          <td>${formatExplanationNumber(entry.interest)}</td>
          <td>${formatExplanationNumber(entry.extra)}</td>
          <td>${formatExplanationNumber(entry.balance)}</td>
        </tr>`
    )
    .join('');
}

function updateExplanation(data) {
  if (!data) {
    return;
  }

  if (priceValue) {
    priceValue.textContent = formatExplanationNumber(data.price);
  }
  if (downPaymentValue) {
    downPaymentValue.textContent = formatExplanationNumber(data.downAmount);
  }
  if (downPercentValue) {
    downPercentValue.textContent = formatPercent(data.downPercent);
  }
  if (loanAmountValue) {
    loanAmountValue.textContent = formatExplanationNumber(data.principal);
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
      data.extraMonthly > 0 ? `${formatExplanationNumber(data.extraMonthly)} / month` : 'None';
  }
  if (lumpSumValue) {
    if (data.lumpSum > 0 && data.lumpSumMonth) {
      lumpSumValue.textContent = `${formatExplanationNumber(data.lumpSum)} in month ${data.lumpSumMonth}`;
    } else if (data.lumpSum > 0) {
      lumpSumValue.textContent = formatExplanationNumber(data.lumpSum);
    } else {
      lumpSumValue.textContent = 'None';
    }
  }
  if (escrowValue) {
    escrowValue.textContent =
      data.escrowMonthly > 0 ? `${formatExplanationNumber(data.escrowMonthly)} / month` : 'None';
  }
  if (totalPaidValue) {
    totalPaidValue.textContent = formatExplanationNumber(data.overpayment.totalPayment);
  }
  if (totalPrincipalValue) {
    totalPrincipalValue.textContent = formatExplanationNumber(data.overpayment.totalPrincipal);
  }
  if (totalInterestValue) {
    totalInterestValue.textContent = formatExplanationNumber(data.overpayment.totalInterest);
  }

  const totalPayment = data.overpayment.totalPayment;
  const principalShare =
    totalPayment > 0 ? (data.overpayment.totalPrincipal / totalPayment) * 100 : 0;
  const clampedPrincipalShare = Math.min(100, Math.max(0, principalShare));
  const interestShare = Math.max(0, 100 - clampedPrincipalShare);

  if (lifetimeDonut) {
    lifetimeDonut.style.setProperty('--principal-share', `${clampedPrincipalShare}%`);
  }
  if (principalShareValue) {
    principalShareValue.textContent = `${formatNumber(clampedPrincipalShare, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })}%`;
  }
  if (interestShareValue) {
    interestShareValue.textContent = `${formatNumber(interestShare, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })}%`;
  }

  const interestSaved = Math.max(0, data.baseline.totalInterest - data.overpayment.totalInterest);

  if (lifetimeSummary) {
    lifetimeSummary.textContent =
      `You pay ${formatExplanationNumber(data.overpayment.totalPayment)} in total, including ` +
      `${formatExplanationNumber(data.overpayment.totalInterest)} in interest. ` +
      `Extra payments currently save ${formatExplanationNumber(interestSaved)} versus the baseline schedule.`;
  }
}

function applyView(view) {
  if (!currentData) {
    return;
  }
  const isMonthly = view === 'monthly';
  monthlyTableWrap?.classList.toggle('is-hidden', !isMonthly);
  yearlyTableWrap?.classList.toggle('is-hidden', isMonthly);

  // Update segmented control active states
  viewMonthlyButton?.classList.toggle('is-active', isMonthly);
  viewYearlyButton?.classList.toggle('is-active', !isMonthly);
}

function clearOutputs() {
  if (monthlyTableBody) {
    monthlyTableBody.innerHTML = '';
  }
  if (yearlyTableBody) {
    yearlyTableBody.innerHTML = '';
  }
}

function clearChartKpis() {
  if (chartPayoffBase) chartPayoffBase.textContent = '-';
  if (chartPayoffExtra) chartPayoffExtra.textContent = '-';
  if (chartMonthsSaved) chartMonthsSaved.textContent = '-';
  if (chartInterestSaved) chartInterestSaved.textContent = '-';
}

function updateChartKpis({ baselineMonths, overpaymentMonths, interestSaved }) {
  if (chartPayoffBase) chartPayoffBase.textContent = formatTerm(baselineMonths);
  if (chartPayoffExtra) chartPayoffExtra.textContent = formatTerm(overpaymentMonths);
  if (chartMonthsSaved) {
    const monthDiff = Math.max(0, baselineMonths - overpaymentMonths);
    chartMonthsSaved.textContent = String(monthDiff);
  }
  if (chartInterestSaved) chartInterestSaved.textContent = formatExplanationNumber(interestSaved);
}

function buildBalanceChartSeries({ principal, baseline, overpayment }) {
  const totalMonths = Math.max(baseline.months, overpayment.months);
  const baselineSeries = buildMonthlySeries(baseline.schedule, principal, totalMonths);
  const overpaymentSeries = buildMonthlySeries(overpayment.schedule, principal, totalMonths);
  const points = [];

  for (let month = 0; month <= totalMonths; month += 1) {
    points.push({
      month,
      baselineBalance: baselineSeries[month] ?? 0,
      extraBalance: overpaymentSeries[month] ?? 0,
    });
  }

  return { points };
}

function renderBalanceChart(series) {
  balanceChart.update(series);
}

function setError(message) {
  if (resultDiv) {
    resultDiv.textContent = message;
  }
  clearOutputs();
  clearChartKpis();
  renderBalanceChart(null);
  currentData = null;
}

function calculate() {
  if (!resultDiv) {
    return;
  }

  resultDiv.textContent = '';
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
    downValueInput.value =
      downType === 'percent' ? Math.round(downPercent) : Math.round(downAmount);
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

  const interestSaved = Math.max(0, baseline.totalInterest - overpayment.totalInterest);
  const chartSeries = buildBalanceChartSeries({ principal, baseline, overpayment });
  updateChartKpis({
    baselineMonths: baseline.months,
    overpaymentMonths: overpayment.months,
    interestSaved,
  });
  renderBalanceChart(chartSeries);

  resultDiv.innerHTML =
    '<strong>Monthly Payment (Principal + Interest)</strong>' +
    `<span class="mtg-result-value">${formatMoney(payment)}</span>`;

  const resultValue = resultDiv.querySelector('.mtg-result-value');
  if (resultValue) {
    resultValue.classList.remove('is-updated');
    requestAnimationFrame(() => {
      resultValue.classList.add('is-updated');
    });
  }

  scheduleView = 'monthly';
  renderMonthlyTable(overpayment.schedule, startDate);
  renderYearlyTable(yearlyOver);
  updateExplanation(currentData);
  applyView(scheduleView);
}

handleDownTypeChange(lastDownType);

function updateSliderFill(input) {
  if (!input || input.type !== 'range') return;
  const min = parseFloat(input.min) || 0;
  const max = parseFloat(input.max) || 100;
  const val = parseFloat(input.value) || 0;
  const pct = ((val - min) / (max - min)) * 100;
  input.style.setProperty('--fill', `${pct}%`);
}

function updateSliderDisplays() {
  if (priceInput && priceDisplay) {
    priceDisplay.textContent = formatNumber(Number(priceInput.value), {
      maximumFractionDigits: 0,
    });
    updateSliderFill(priceInput);
  }
  if (downValueInput && downDisplay) {
    const downType = downTypeButtons?.getValue() ?? 'amount';
    if (downType === 'percent') {
      downDisplay.textContent = `${downValueInput.value}%`;
    } else {
      downDisplay.textContent = formatNumber(Number(downValueInput.value), {
        maximumFractionDigits: 0,
      });
    }
    updateSliderFill(downValueInput);
  }
  if (termInput && termDisplay) {
    termDisplay.textContent = `${termInput.value} yrs`;
    updateSliderFill(termInput);
  }
  if (rateInput && rateDisplay) {
    rateDisplay.textContent = `${rateInput.value}%`;
    updateSliderFill(rateInput);
  }
}

priceInput?.addEventListener('input', updateSliderDisplays);
downValueInput?.addEventListener('input', updateSliderDisplays);
termInput?.addEventListener('input', updateSliderDisplays);
rateInput?.addEventListener('input', updateSliderDisplays);

updateSliderDisplays();

calculateButton?.addEventListener('click', calculate);

// Segmented control for table view (Monthly/Yearly)
viewMonthlyButton?.addEventListener('click', () => {
  if (!currentData || scheduleView === 'monthly') {
    return;
  }
  scheduleView = 'monthly';
  applyView(scheduleView);
});

viewYearlyButton?.addEventListener('click', () => {
  if (!currentData || scheduleView === 'yearly') {
    return;
  }
  scheduleView = 'yearly';
  applyView(scheduleView);
});

calculate();
