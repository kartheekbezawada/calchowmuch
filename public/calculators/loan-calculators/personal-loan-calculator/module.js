import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import { setPageMetadata } from '/assets/js/core/ui.js';
import {
  calculatePersonalLoan,
  getMaxExtraPaymentForFirstMonth,
  previewMonthlyRows,
  previewYearlyRows,
} from '/calculators/loan-calculators/personal-loan-calculator/engine.js';
import { createPersonalLoanChart } from '/calculators/loan-calculators/personal-loan-calculator/personal-loan-chart.js';
import {
  revealResultPanel,
  updateRangeFill,
  wireRangeWithField,
} from '/calculators/loan-calculators/shared/cluster-ux.js';

const metadata = {
  title: 'Personal Loan Calculator | Monthly Payment, Interest & Payoff',
  description:
    'Estimate personal loan monthly payment, total interest, total cost, and extra-payment savings from amount, APR, fees, and term.',
  canonical: 'https://calchowmuch.com/loan-calculators/personal-loan-calculator/',
};

setPageMetadata(metadata);

const CURRENCY_CODES = ['USD', 'GBP', 'EUR', 'INR', 'CAD', 'AUD', 'AED', 'JPY'];

const currencyInput = document.querySelector('#pl-currency');
const principalInput = document.querySelector('#pl-principal');
const rateInput = document.querySelector('#pl-rate');
const termYearsInput = document.querySelector('#pl-term-years');
const termExtraMonthsInput = document.querySelector('#pl-term-extra-months');
const setupFeeInput = document.querySelector('#pl-setup-fee');
const extraMonthlyInput = document.querySelector('#pl-extra-monthly');
const principalField = document.querySelector('#pl-principal-field');
const rateField = document.querySelector('#pl-rate-field');
const termYearsField = document.querySelector('#pl-term-years-field');

const principalDisplay = document.querySelector('#pl-principal-display');
const rateDisplay = document.querySelector('#pl-rate-display');
const termDisplay = document.querySelector('#pl-term-display');

const calculateButton = document.querySelector('#pl-calculate');
const resetButton = document.querySelector('#pl-reset');
const errorBox = document.querySelector('#pl-error');
const previewPanel = document.querySelector('#pl-results');
const resultCard = document.querySelector('#pl-result');

const primaryMonthly = document.querySelector('[data-pl="result-base"]');
const monthlyWithExtra = document.querySelector('[data-pl="result-with-extra"]');
const totalInterest = document.querySelector('[data-pl="result-total-interest"]');
const totalRepayment = document.querySelector('[data-pl="result-total-repayment"]');
const totalCost = document.querySelector('[data-pl="result-total-cost"]');
const payoffWithExtra = document.querySelector('[data-pl="result-payoff"]');
const interestSaved = document.querySelector('[data-pl="result-interest-saved"]');
const monthsSaved = document.querySelector('[data-pl="result-months-saved"]');
const summary = document.querySelector('[data-pl="result-summary"]');

const chartBasePayoff = document.querySelector('[data-pl="chart-base-payoff"]');
const chartExtraPayoff = document.querySelector('[data-pl="chart-extra-payoff"]');
const chartInterestSaved = document.querySelector('[data-pl="chart-interest-saved"]');

const tableBody = document.querySelector('#pl-amortization-body');
const tablePeriodHeader = document.querySelector('[data-pl-col="period"]');
const tableViewButtons = Array.from(document.querySelectorAll('.pl-view-toggle[data-pl-view]'));

const formulaPrincipal = document.querySelector('[data-pl="formula-principal"]');
const formulaRate = document.querySelector('[data-pl="formula-rate"]');
const formulaTerm = document.querySelector('[data-pl="formula-term"]');
const formulaPayment = document.querySelector('[data-pl="formula-payment"]');

const chart = createPersonalLoanChart({
  canvas: document.querySelector('#pl-balance-canvas'),
  tooltip: document.querySelector('#pl-balance-tooltip'),
  status: document.querySelector('#pl-balance-status'),
  formatMoney: (value) => formatMoney(value, getCurrency()),
});

const DEFAULTS = {
  currency: 'USD',
  principal: 25000,
  annualRate: 9.5,
  termYears: 5,
  termExtraMonths: 0,
  setupFee: 0,
  extraMonthly: 0,
};

const tableState = {
  view: 'yearly',
};
let lastCalculation = null;

function getCurrency() {
  const value = String(currencyInput?.value || DEFAULTS.currency).toUpperCase();
  return CURRENCY_CODES.includes(value) ? value : DEFAULTS.currency;
}

function formatMoney(value, currency) {
  if (!Number.isFinite(value)) {
    return '—';
  }
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);
}

function formatMoneyCompact(value) {
  return formatMoney(value, getCurrency());
}

function formatTerm(months) {
  if (!Number.isFinite(months) || months <= 0) {
    return '—';
  }

  const years = Math.floor(months / 12);
  const remMonths = months % 12;

  if (years > 0 && remMonths > 0) {
    return `${years}y ${remMonths}m`;
  }
  if (years > 0) {
    return `${years}y`;
  }
  return `${remMonths}m`;
}

function parseLooseNumber(value) {
  const parsed = Number(String(value).replace(/,/g, '').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : NaN;
}

function updateSliderDisplays() {
  if (principalDisplay && principalInput) {
    principalDisplay.textContent = formatMoney(Number(principalInput.value), getCurrency());
    updateRangeFill(principalInput);
    if (principalField) {
      principalField.value = String(Math.round(Number(principalInput.value) || 0));
    }
  }

  if (rateDisplay && rateInput) {
    rateDisplay.textContent = formatPercent(Number(rateInput.value), {
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
    });
    updateRangeFill(rateInput);
    if (rateField) {
      rateField.value = formatNumber(Number(rateInput.value) || 0, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 2,
      });
    }
  }

  if (termDisplay && termYearsInput && termExtraMonthsInput) {
    const months = Number(termYearsInput.value) * 12 + Number(termExtraMonthsInput.value || 0);
    termDisplay.textContent = formatTerm(months);
    updateRangeFill(termYearsInput);
    if (termYearsField) {
      termYearsField.value = String(Math.round(Number(termYearsInput.value) || 0));
    }
  }
}

function readInputs() {
  const years = Number(termYearsInput?.value);
  const extraMonths = Number(termExtraMonthsInput?.value || 0);

  return {
    currency: getCurrency(),
    principal: Number(principalInput?.value),
    annualRate: Number(rateInput?.value),
    termYears: years,
    termExtraMonths: extraMonths,
    months: years * 12 + extraMonths,
    setupFee: Number(setupFeeInput?.value || 0),
    extraMonthly: Number(extraMonthlyInput?.value || 0),
  };
}

function setError(message) {
  if (!errorBox) {
    return;
  }
  if (!message) {
    errorBox.textContent = '';
    errorBox.classList.remove('is-visible');
    errorBox.hidden = true;
    if (summary) {
      summary.textContent = 'Run a calculation to view monthly payment and payoff insights.';
    }
    return;
  }

  errorBox.hidden = false;
  errorBox.classList.add('is-visible');
  errorBox.textContent = message;
  if (summary) {
    summary.textContent = 'Update the highlighted values, then calculate again to refresh the payment summary.';
  }
}

function validateInputs(input) {
  if (!Number.isFinite(input.principal) || input.principal < 500 || input.principal > 5000000) {
    return 'Loan amount must be between 500 and 5,000,000.';
  }

  if (!Number.isFinite(input.annualRate) || input.annualRate < 0 || input.annualRate > 60) {
    return 'APR must be between 0% and 60%.';
  }

  if (!Number.isFinite(input.months) || input.months < 3 || input.months > 600) {
    return 'Loan term must be between 3 and 600 months.';
  }

  if (!Number.isFinite(input.setupFee) || input.setupFee < 0) {
    return 'Setup fee must be 0 or higher.';
  }

  if (!Number.isFinite(input.extraMonthly) || input.extraMonthly < 0) {
    return 'Extra monthly payment must be 0 or higher.';
  }

  const maxExtra = getMaxExtraPaymentForFirstMonth({
    principal: input.principal,
    annualRate: input.annualRate,
    months: input.months,
  });

  if (input.extraMonthly > maxExtra + 1e-8) {
    return 'Extra monthly payment is too high and would create a negative first-month balance.';
  }

  return null;
}

function updateChartKpis(result, currency) {
  if (chartBasePayoff) {
    chartBasePayoff.textContent = formatTerm(result.baseline.months);
  }
  if (chartExtraPayoff) {
    chartExtraPayoff.textContent = formatTerm(result.accelerated.months);
  }
  if (chartInterestSaved) {
    chartInterestSaved.textContent = formatMoney(result.insight.interestSaved, currency);
  }
}

function syncTableViewUI() {
  tableViewButtons.forEach((button) => {
    const active = button.dataset.plView === tableState.view;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
  if (tablePeriodHeader) {
    tablePeriodHeader.textContent = tableState.view === 'yearly' ? 'Year' : 'Month';
  }
}

function renderTable(schedule, currency) {
  if (!tableBody) {
    return;
  }
  const rows =
    tableState.view === 'yearly'
      ? previewYearlyRows(schedule, Number.POSITIVE_INFINITY)
      : previewMonthlyRows(schedule, schedule.length);
  syncTableViewUI();

  tableBody.innerHTML = rows
    .map(
      (row) => `<tr>
      <td>${row.period}</td>
      <td>${formatMoney(row.payment, currency)}</td>
      <td>${formatMoney(row.principal, currency)}</td>
      <td>${formatMoney(row.interest, currency)}</td>
      <td>${formatMoney(row.extra, currency)}</td>
      <td>${formatMoney(row.balance, currency)}</td>
    </tr>`
    )
    .join('');
}

function updateFormulaExample(input, result, currency) {
  if (formulaPrincipal) {
    formulaPrincipal.textContent = formatMoney(input.principal, currency);
  }
  if (formulaRate) {
    formulaRate.textContent = formatPercent(input.annualRate, {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  }
  if (formulaTerm) {
    formulaTerm.textContent = `${input.months} months`;
  }
  if (formulaPayment) {
    formulaPayment.textContent = formatMoney(result.inputs.basePayment, currency);
  }
}

function applyResult(result, input) {
  const currency = input.currency;

  primaryMonthly.textContent = formatMoney(result.inputs.basePayment, currency);
  monthlyWithExtra.textContent = formatMoney(result.accelerated.monthlyPaymentWithExtra, currency);
  totalInterest.textContent = formatMoney(result.baseline.totalInterest, currency);
  totalRepayment.textContent = formatMoney(result.baseline.totalPayment, currency);
  totalCost.textContent = formatMoney(result.baseline.totalCostWithFee, currency);
  payoffWithExtra.textContent = formatTerm(result.accelerated.months);
  interestSaved.textContent = formatMoney(result.insight.interestSaved, currency);
  monthsSaved.textContent = formatNumber(result.insight.monthsSaved, {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

  if (input.extraMonthly > 0) {
    summary.textContent =
      `With ${formatMoney(input.extraMonthly, currency)} extra each month, payoff shortens by ` +
      `${result.insight.monthsSaved} months and estimated interest savings are ` +
      `${formatMoney(result.insight.interestSaved, currency)}.`;
  } else {
    summary.textContent =
      `At the current settings, estimated payoff is ${formatTerm(result.baseline.months)} ` +
      `with total interest of ${formatMoney(result.baseline.totalInterest, currency)}.`;
  }

  renderTable(result.accelerated.schedule, currency);
  chart.setData(result.chartPoints);
  updateChartKpis(result, currency);
  updateFormulaExample(input, result, currency);
}

function calculateAndRender(options = {}) {
  const { reveal = false } = options;
  const input = readInputs();
  const validationMessage = validateInputs(input);

  if (validationMessage) {
    setError(validationMessage);
    return;
  }

  setError('');
  const result = calculatePersonalLoan(input);
  lastCalculation = {
    input,
    result,
  };
  applyResult(result, input);

  if (reveal) {
    revealResultPanel({
      resultPanel: previewPanel,
      focusTarget: resultCard,
    });
  }
}

function resetForm() {
  if (currencyInput) {
    currencyInput.value = DEFAULTS.currency;
  }
  if (principalInput) {
    principalInput.value = String(DEFAULTS.principal);
  }
  if (rateInput) {
    rateInput.value = String(DEFAULTS.annualRate);
  }
  if (termYearsInput) {
    termYearsInput.value = String(DEFAULTS.termYears);
  }
  if (termExtraMonthsInput) {
    termExtraMonthsInput.value = String(DEFAULTS.termExtraMonths);
  }
  if (setupFeeInput) {
    setupFeeInput.value = String(DEFAULTS.setupFee);
  }
  if (extraMonthlyInput) {
    extraMonthlyInput.value = String(DEFAULTS.extraMonthly);
  }

  updateSliderDisplays();
  calculateAndRender({ reveal: false });
}

function setupEvents() {
  calculateButton?.addEventListener('click', () => calculateAndRender({ reveal: true }));
  resetButton?.addEventListener('click', resetForm);

  currencyInput?.addEventListener('change', updateSliderDisplays);
  termExtraMonthsInput?.addEventListener('input', updateSliderDisplays);

  tableViewButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const nextView = button.dataset.plView === 'monthly' ? 'monthly' : 'yearly';
      if (nextView === tableState.view) {
        return;
      }
      tableState.view = nextView;
      if (lastCalculation) {
        renderTable(lastCalculation.result.accelerated.schedule, lastCalculation.input.currency);
        return;
      }
      calculateAndRender({ reveal: false });
    });
  });
}

wireRangeWithField({
  rangeInput: principalInput,
  textInput: principalField,
  formatFieldValue: (value) => String(Math.round(value)),
  parseFieldValue: parseLooseNumber,
  onVisualUpdate: updateSliderDisplays,
});

wireRangeWithField({
  rangeInput: rateInput,
  textInput: rateField,
  formatFieldValue: (value) =>
    formatNumber(value, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
    }),
  parseFieldValue: parseLooseNumber,
  onVisualUpdate: updateSliderDisplays,
});

wireRangeWithField({
  rangeInput: termYearsInput,
  textInput: termYearsField,
  formatFieldValue: (value) => String(Math.round(value)),
  parseFieldValue: parseLooseNumber,
  onVisualUpdate: updateSliderDisplays,
});

setupEvents();
updateSliderDisplays();
syncTableViewUI();
calculateAndRender({ reveal: false });

window.addEventListener('beforeunload', () => {
  chart.destroy();
});
