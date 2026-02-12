import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import { setPageMetadata, setupButtonGroup } from '/assets/js/core/ui.js';
import { calculateCarLoan } from '/assets/js/core/auto-loan-utils.js';

const priceInput = document.querySelector('#car-price');
const downValueInput = document.querySelector('#car-down-value');
const downValueLabel = document.querySelector('#car-down-value-label');
const tradeInput = document.querySelector('#car-trade');
const feesInput = document.querySelector('#car-fees');
const taxInput = document.querySelector('#car-tax');
const aprInput = document.querySelector('#car-apr');
const termInput = document.querySelector('#car-term');
const calculateButton = document.querySelector('#car-calculate');
const resultDiv = document.querySelector('#car-result');
const summaryDiv = document.querySelector('#car-summary');

const downTypeGroup = document.querySelector('[data-button-group="car-down-type"]');

const priceDisplay = document.querySelector('#car-price-display');
const downDisplay = document.querySelector('#car-down-display');
const tradeDisplay = document.querySelector('#car-trade-display');
const feesDisplay = document.querySelector('#car-fees-display');
const taxDisplay = document.querySelector('#car-tax-display');
const aprDisplay = document.querySelector('#car-apr-display');
const termDisplay = document.querySelector('#car-term-display');

const viewMonthlyButton = document.querySelector('#car-view-monthly');
const viewYearlyButton = document.querySelector('#car-view-yearly');
const monthlyTableWrap = document.querySelector('#car-table-monthly-wrap');
const yearlyTableWrap = document.querySelector('#car-table-yearly-wrap');
const monthlyTableBody = document.querySelector('#car-table-monthly-body');
const yearlyTableBody = document.querySelector('#car-table-yearly-body');

const snapshotPrice = document.querySelector('[data-car="price"]');
const snapshotDownPayment = document.querySelector('[data-car="down-payment"]');
const snapshotDownPercent = document.querySelector('[data-car="down-percent"]');
const snapshotTradeIn = document.querySelector('[data-car="trade-in"]');
const snapshotFees = document.querySelector('[data-car="fees"]');
const snapshotTax = document.querySelector('[data-car="tax"]');
const snapshotFinanced = document.querySelector('[data-car="amount-financed"]');
const snapshotApr = document.querySelector('[data-car="apr"]');
const snapshotTerm = document.querySelector('[data-car="term"]');

const lifetimeDonut = document.querySelector('[data-car="lifetime-donut"]');
const principalShareValue = document.querySelector('[data-car="principal-share"]');
const interestShareValue = document.querySelector('[data-car="interest-share"]');
const amountFinancedTotalValue = document.querySelector('[data-car="amount-financed-total"]');
const totalInterestValue = document.querySelector('[data-car="total-interest"]');
const totalPaymentValue = document.querySelector('[data-car="total-payment"]');
const lifetimeSummary = document.querySelector('[data-car="lifetime-summary"]');

let lastDownType = 'amount';
let scheduleView = 'yearly';

export const pageSchema = {
  calculatorFAQ: true,
  globalFAQ: false,
};

const CALCULATOR_FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How is amount financed calculated?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Amount financed = vehicle price minus down payment and trade-in, plus dealer fees and sales tax.',
      },
    },
    {
      '@type': 'Question',
      name: 'What reduces monthly EMI the fastest?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A larger down payment, lower APR, or lower financed amount can reduce EMI materially.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does extending tenure always help?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Longer tenure lowers EMI but usually increases total interest paid over the full loan.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I compare monthly vs yearly payoff quickly?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Use the table toggle to switch between yearly summary and monthly detail.',
      },
    },
  ],
};

const metadata = {
  title: 'Car Loan Calculator – Monthly Payment & Total Cost',
  description:
    'Calculate car loan EMI, total interest, and total payment using premium slider-based inputs for price, down payment, trade-in, fees, tax, APR, and term.',
  canonical: 'https://calchowmuch.com/loans/car-loan/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
};

setPageMetadata(metadata);

const downTypeButtons = setupButtonGroup(downTypeGroup, {
  defaultValue: 'amount',
  onChange: (value) => {
    handleDownTypeChange(value);
    calculate();
  },
});

function formatValue(value, options = {}) {
  return formatNumber(value, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  });
}

function setSliderFill(input) {
  if (!input) {
    return;
  }
  const min = Number(input.min || 0);
  const max = Number(input.max || 100);
  const value = Number(input.value);
  const percentage = max > min ? ((value - min) / (max - min)) * 100 : 0;
  input.style.setProperty('--fill', `${Math.min(100, Math.max(0, percentage))}%`);
}

function updateSliderDisplays() {
  const downType = downTypeButtons?.getValue() ?? 'amount';

  if (priceDisplay && priceInput) {
    priceDisplay.textContent = formatValue(Number(priceInput.value));
  }
  if (downDisplay && downValueInput) {
    downDisplay.textContent =
      downType === 'percent'
        ? formatPercent(Number(downValueInput.value))
        : formatValue(Number(downValueInput.value));
  }
  if (tradeDisplay && tradeInput) {
    tradeDisplay.textContent = formatValue(Number(tradeInput.value));
  }
  if (feesDisplay && feesInput) {
    feesDisplay.textContent = formatValue(Number(feesInput.value));
  }
  if (taxDisplay && taxInput) {
    taxDisplay.textContent = formatPercent(Number(taxInput.value));
  }
  if (aprDisplay && aprInput) {
    aprDisplay.textContent = formatPercent(Number(aprInput.value));
  }
  if (termDisplay && termInput) {
    termDisplay.textContent = `${formatValue(Number(termInput.value), { maximumFractionDigits: 0 })} yrs`;
  }

  [priceInput, downValueInput, tradeInput, feesInput, taxInput, aprInput, termInput].forEach(setSliderFill);
}

function handleDownTypeChange(type) {
  const price = Number(priceInput?.value);
  const currentValue = Number(downValueInput?.value);

  if (
    downValueInput &&
    Number.isFinite(currentValue) &&
    currentValue >= 0 &&
    Number.isFinite(price) &&
    price > 0 &&
    lastDownType !== type
  ) {
    if (type === 'percent' && lastDownType === 'amount') {
      downValueInput.value = ((currentValue / price) * 100).toFixed(2);
    } else if (type === 'amount' && lastDownType === 'percent') {
      downValueInput.value = ((currentValue / 100) * price).toFixed(2);
    }
  }

  if (downValueLabel) {
    downValueLabel.textContent = type === 'percent' ? 'Down Payment Percent' : 'Down Payment Amount';
  }

  if (downValueInput) {
    if (type === 'percent') {
      downValueInput.min = '0';
      downValueInput.max = '99.99';
      downValueInput.step = '0.1';
    } else {
      downValueInput.min = '0';
      downValueInput.max = String(Math.max(0, Number(priceInput?.value || 0)));
      downValueInput.step = '100';
    }
  }

  lastDownType = type;
  updateSliderDisplays();
}

function clearOutputs() {
  if (monthlyTableBody) {
    monthlyTableBody.innerHTML = '';
  }
  if (yearlyTableBody) {
    yearlyTableBody.innerHTML = '';
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

function applyView(view) {
  scheduleView = view === 'monthly' ? 'monthly' : 'yearly';
  const isMonthly = scheduleView === 'monthly';

  monthlyTableWrap?.classList.toggle('is-hidden', !isMonthly);
  yearlyTableWrap?.classList.toggle('is-hidden', isMonthly);

  viewMonthlyButton?.classList.toggle('is-active', isMonthly);
  viewMonthlyButton?.setAttribute('aria-pressed', isMonthly ? 'true' : 'false');
  viewYearlyButton?.classList.toggle('is-active', !isMonthly);
  viewYearlyButton?.setAttribute('aria-pressed', isMonthly ? 'false' : 'true');
}

function renderMonthlyTable(schedule) {
  if (!monthlyTableBody) {
    return;
  }
  monthlyTableBody.innerHTML = schedule
    .map(
      (entry) => `
        <tr>
          <td>${entry.month}</td>
          <td>${formatValue(entry.payment)}</td>
          <td>${formatValue(entry.principal)}</td>
          <td>${formatValue(entry.interest)}</td>
          <td>${formatValue(entry.balance)}</td>
        </tr>
      `
    )
    .join('');
}

function renderYearlyTable(yearly) {
  if (!yearlyTableBody) {
    return;
  }
  yearlyTableBody.innerHTML = yearly
    .map(
      (entry) => `
        <tr>
          <td>${entry.year}</td>
          <td>${formatValue(entry.payment)}</td>
          <td>${formatValue(Math.max(0, entry.payment - entry.interest))}</td>
          <td>${formatValue(entry.interest)}</td>
          <td>${formatValue(entry.balance)}</td>
        </tr>
      `
    )
    .join('');
}

function updatePreview(data) {
  if (resultDiv) {
    resultDiv.innerHTML = `<span class="mtg-result-value is-updated">${formatValue(data.monthlyPayment)}</span>`;

    const valueEl = resultDiv.querySelector('.mtg-result-value');
    if (valueEl) {
      setTimeout(() => valueEl.classList.remove('is-updated'), 420);
    }
  }

  if (summaryDiv) {
    summaryDiv.innerHTML =
      `<p><strong>Amount Financed:</strong> ${formatValue(data.amountFinanced)}</p>` +
      `<p><strong>Total Interest:</strong> ${formatValue(data.totalInterest)}</p>` +
      `<p><strong>Total Payment:</strong> ${formatValue(data.totalPayment)}</p>`;
  }

  if (snapshotPrice) {
    snapshotPrice.textContent = formatValue(data.price);
  }
  if (snapshotDownPayment) {
    snapshotDownPayment.textContent = formatValue(data.downPayment);
  }
  if (snapshotDownPercent) {
    snapshotDownPercent.textContent = formatPercent(data.downPaymentPercent);
  }
  if (snapshotTradeIn) {
    snapshotTradeIn.textContent = formatValue(data.tradeIn);
  }
  if (snapshotFees) {
    snapshotFees.textContent = formatValue(data.fees);
  }
  if (snapshotTax) {
    snapshotTax.textContent = formatValue(data.taxAmount);
  }
  if (snapshotFinanced) {
    snapshotFinanced.textContent = formatValue(data.amountFinanced);
  }
  if (snapshotApr) {
    snapshotApr.textContent = formatPercent(data.apr);
  }
  if (snapshotTerm) {
    snapshotTerm.textContent = `${formatValue(data.termYears, { maximumFractionDigits: 0 })} years`;
  }
}

function updateExplanation(data) {
  const totalPayment = data.totalPayment;
  const principalShare = totalPayment > 0 ? (data.amountFinanced / totalPayment) * 100 : 0;
  const clampedPrincipalShare = Math.min(100, Math.max(0, principalShare));
  const interestShare = Math.max(0, 100 - clampedPrincipalShare);

  if (lifetimeDonut) {
    lifetimeDonut.style.setProperty('--principal-share', `${clampedPrincipalShare}%`);
  }
  if (principalShareValue) {
    principalShareValue.textContent = `${formatValue(clampedPrincipalShare, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })}%`;
  }
  if (interestShareValue) {
    interestShareValue.textContent = `${formatValue(interestShare, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })}%`;
  }
  if (amountFinancedTotalValue) {
    amountFinancedTotalValue.textContent = formatValue(data.amountFinanced);
  }
  if (totalInterestValue) {
    totalInterestValue.textContent = formatValue(data.totalInterest);
  }
  if (totalPaymentValue) {
    totalPaymentValue.textContent = formatValue(data.totalPayment);
  }
  if (lifetimeSummary) {
    lifetimeSummary.textContent =
      `You finance ${formatValue(data.amountFinanced)} and pay ` +
      `${formatValue(data.totalInterest)} in interest over the full schedule.`;
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
  const downRaw = Number(downValueInput?.value);
  const tradeIn = Number(tradeInput?.value);
  const fees = Number(feesInput?.value);
  const taxRate = Number(taxInput?.value);
  const apr = Number(aprInput?.value);
  const termYears = Number(termInput?.value);
  const downType = downTypeButtons?.getValue() ?? 'amount';

  if (!Number.isFinite(price) || price <= 0) {
    setError('Vehicle price must be greater than 0.');
    return;
  }
  if (!Number.isFinite(tradeIn) || tradeIn < 0) {
    setError('Trade-in value must be 0 or more.');
    return;
  }
  if (!Number.isFinite(fees) || fees < 0) {
    setError('Dealer fees must be 0 or more.');
    return;
  }
  if (!Number.isFinite(taxRate) || taxRate < 0) {
    setError('Sales tax must be 0 or more.');
    return;
  }
  if (!Number.isFinite(apr) || apr < 0) {
    setError('APR must be 0 or more.');
    return;
  }
  if (!Number.isFinite(termYears) || termYears < 1) {
    setError('Loan term must be at least 1 year.');
    return;
  }

  let downPaymentAmount = 0;
  let downPaymentPercent = 0;

  if (!Number.isFinite(downRaw) || downRaw < 0) {
    setError('Down payment must be 0 or more.');
    return;
  }

  if (downType === 'percent') {
    if (downRaw >= 100) {
      setError('Down payment percent must be less than 100.');
      return;
    }
    downPaymentPercent = downRaw;
    downPaymentAmount = (price * downPaymentPercent) / 100;
  } else {
    if (downRaw >= price) {
      setError('Down payment amount must be less than vehicle price.');
      return;
    }
    downPaymentAmount = downRaw;
    downPaymentPercent = price > 0 ? (downPaymentAmount / price) * 100 : 0;
  }

  const data = calculateCarLoan({
    price,
    downPaymentType: downType,
    downPaymentAmount,
    downPaymentPercent,
    tradeIn,
    fees,
    taxRate,
    apr,
    termYears,
  });

  if (downType === 'percent' && downValueInput) {
    downValueInput.value = data.downPaymentPercent.toFixed(2);
  }
  if (downType === 'amount' && downValueInput) {
    downValueInput.value = data.downPayment.toFixed(2);
    downValueInput.max = String(Math.max(0, price));
  }

  updateSliderDisplays();
  updatePreview(data);
  updateExplanation(data);
  renderMonthlyTable(data.schedule);
  renderYearlyTable(data.yearly);
  applyView(scheduleView);
}

[priceInput, downValueInput, tradeInput, feesInput, taxInput, aprInput, termInput].forEach((input) => {
  input?.addEventListener('input', () => {
    if (input === priceInput && downTypeButtons?.getValue() !== 'percent' && downValueInput) {
      downValueInput.max = String(Math.max(0, Number(priceInput.value)));
      if (Number(downValueInput.value) > Number(downValueInput.max)) {
        downValueInput.value = downValueInput.max;
      }
    }
    updateSliderDisplays();
  });
});

viewMonthlyButton?.addEventListener('click', () => applyView('monthly'));
viewYearlyButton?.addEventListener('click', () => applyView('yearly'));
calculateButton?.addEventListener('click', calculate);

handleDownTypeChange('amount');
updateSliderDisplays();
applyView('yearly');
calculate();
