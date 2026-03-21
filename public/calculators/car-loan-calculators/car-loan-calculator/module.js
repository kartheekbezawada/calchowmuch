import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import { setPageMetadata } from '/assets/js/core/ui.js';
import { calculateCarLoan } from '/assets/js/core/auto-loan-utils.js';
import {
  createStaleResultController,
  revealResultPanel,
  updateRangeFill,
  wireRangeWithField,
} from '/calculators/car-loan-calculators/shared/cluster-ux.js';

const priceInput = document.querySelector('#car-price');
const downValueInput = document.querySelector('#car-down-value');
const tradeInput = document.querySelector('#car-trade');
const feesInput = document.querySelector('#car-fees');
const taxInput = document.querySelector('#car-tax');
const aprInput = document.querySelector('#car-apr');
const termInput = document.querySelector('#car-term');

const priceField = document.querySelector('#car-price-field');
const downValueField = document.querySelector('#car-down-value-field');
const tradeField = document.querySelector('#car-trade-field');
const feesField = document.querySelector('#car-fees-field');
const taxField = document.querySelector('#car-tax-field');
const aprField = document.querySelector('#car-apr-field');
const termField = document.querySelector('#car-term-field');

const calculateButton = document.querySelector('#car-calculate');
const defaultsButton = document.querySelector('#car-use-defaults');
const resultDiv = document.querySelector('#car-result');
const summaryDiv = document.querySelector('#car-summary');
const previewPanel = document.querySelector('#car-preview');
const staleNote = document.querySelector('#car-stale-note');

const assumptionPrice = document.querySelector('#car-assumption-price');
const assumptionDown = document.querySelector('#car-assumption-down');
const assumptionApr = document.querySelector('#car-assumption-apr');
const assumptionTerm = document.querySelector('#car-assumption-term');

const breakdownPrice = document.querySelector('#car-breakdown-price');
const breakdownDown = document.querySelector('#car-breakdown-down');
const breakdownTrade = document.querySelector('#car-breakdown-trade');
const breakdownFees = document.querySelector('#car-breakdown-fees');
const breakdownTax = document.querySelector('#car-breakdown-tax');
const breakdownFinanced = document.querySelector('#car-breakdown-financed');

const previewDownPercent = document.querySelector('#car-preview-down-percent');
const previewTrade = document.querySelector('#car-preview-trade');
const previewFees = document.querySelector('#car-preview-fees');
const previewTax = document.querySelector('#car-preview-tax');

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

let scheduleView = 'yearly';

const defaultValues = {
  price: priceInput?.value ?? '28000',
  downPayment: downValueInput?.value ?? '3000',
  tradeIn: tradeInput?.value ?? '1500',
  fees: feesInput?.value ?? '600',
  tax: taxInput?.value ?? '7',
  apr: aprInput?.value ?? '6.5',
  termYears: termInput?.value ?? '5',
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

const CALCULATOR_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://calchowmuch.com/car-loan-calculators/car-loan-calculator/#webpage',
      url: 'https://calchowmuch.com/car-loan-calculators/car-loan-calculator/',
      name: 'Car Loan Calculator | Monthly Payment & Cost',
      description:
        'Estimate car loan payments, total interest, and total cost using vehicle price, deposit, trade-in, fees, tax, APR, and term.',
      isPartOf: {
        '@type': 'WebSite',
        '@id': 'https://calchowmuch.com/#website',
        name: 'CalcHowMuch',
        url: 'https://calchowmuch.com/',
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: 'https://calchowmuch.com/assets/images/og-default.png',
      },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://calchowmuch.com/car-loan-calculators/car-loan-calculator/#app',
      name: 'Car Loan Calculator',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Any',
      url: 'https://calchowmuch.com/car-loan-calculators/car-loan-calculator/',
      description:
        'Estimate car loan payments, total interest, and total cost using vehicle price, deposit, trade-in, fees, tax, APR, and term.',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://calchowmuch.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Car Loan Calculators',
          item: 'https://calchowmuch.com/car-loan-calculators/',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Car Loan Calculator',
          item: 'https://calchowmuch.com/car-loan-calculators/car-loan-calculator/',
        },
      ],
    },
    CALCULATOR_FAQ_SCHEMA,
  ],
};

setPageMetadata({
  title: 'Car Loan Calculator | Monthly Payment & Cost',
  description:
    'Estimate car loan payments, total interest, and total cost using vehicle price, deposit, trade-in, fees, tax, APR, and term.',
  canonical: 'https://calchowmuch.com/car-loan-calculators/car-loan-calculator/',
  structuredData: CALCULATOR_STRUCTURED_DATA,
});

function formatValue(value, options = {}) {
  return formatNumber(value, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  });
}

function parseLooseNumber(value) {
  const parsed = Number(String(value).replace(/,/g, '').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : NaN;
}

function formatFieldValue(value, fractionDigits = 0) {
  return formatNumber(value, {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
    useGrouping: false,
  });
}

function buildStateSignature() {
  return JSON.stringify({
    price: priceInput?.value ?? '',
    downPayment: downValueInput?.value ?? '',
    tradeIn: tradeInput?.value ?? '',
    fees: feesInput?.value ?? '',
    tax: taxInput?.value ?? '',
    apr: aprInput?.value ?? '',
    termYears: termInput?.value ?? '',
  });
}

const staleController = createStaleResultController({
  resultPanel: previewPanel,
  staleTargets: [staleNote],
  getSignature: buildStateSignature,
});

function syncDependentRanges() {
  const price = Number(priceInput?.value);
  const nextPrice = Number.isFinite(price) ? Math.max(0, price) : 0;

  if (downValueInput) {
    downValueInput.max = String(nextPrice);
    if (Number(downValueInput.value) > nextPrice) {
      downValueInput.value = String(nextPrice);
    }
  }
}

function updateSliderDisplays() {
  syncDependentRanges();

  if (priceDisplay && priceInput) {
    priceDisplay.textContent = formatValue(Number(priceInput.value));
  }
  if (downDisplay && downValueInput) {
    downDisplay.textContent = formatValue(Number(downValueInput.value));
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
    termDisplay.textContent = `${formatValue(Number(termInput.value), {
      maximumFractionDigits: 0,
    })} yrs`;
  }

  [priceInput, downValueInput, tradeInput, feesInput, taxInput, aprInput, termInput].forEach(
    updateRangeFill
  );
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

function buildTermText(termYears) {
  return `${formatValue(termYears, { maximumFractionDigits: 0 })} years`;
}

function updatePreview(data) {
  if (resultDiv) {
    resultDiv.innerHTML = `<strong>Monthly payment</strong><span class="mtg-result-value is-updated">${formatValue(
      data.monthlyPayment
    )}</span>`;

    const valueEl = resultDiv.querySelector('.mtg-result-value');
    if (valueEl) {
      window.setTimeout(() => valueEl.classList.remove('is-updated'), 420);
    }
  }

  if (summaryDiv) {
    summaryDiv.innerHTML = `
      <article class="al-metric-card">
        <span class="al-metric-card-label">Amount Financed</span>
        <strong class="al-metric-card-value">${formatValue(data.amountFinanced)}</strong>
      </article>
      <article class="al-metric-card">
        <span class="al-metric-card-label">Total Interest</span>
        <strong class="al-metric-card-value">${formatValue(data.totalInterest)}</strong>
      </article>
      <article class="al-metric-card">
        <span class="al-metric-card-label">Total Payment</span>
        <strong class="al-metric-card-value">${formatValue(data.totalPayment)}</strong>
      </article>
    `;
  }

  if (assumptionPrice) {
    assumptionPrice.textContent = formatValue(data.price);
  }
  if (assumptionDown) {
    assumptionDown.textContent = formatValue(data.downPayment);
  }
  if (assumptionApr) {
    assumptionApr.textContent = formatPercent(data.apr);
  }
  if (assumptionTerm) {
    assumptionTerm.textContent = buildTermText(data.termYears);
  }

  if (breakdownPrice) {
    breakdownPrice.textContent = formatValue(data.price);
  }
  if (breakdownDown) {
    breakdownDown.textContent = formatValue(data.downPayment);
  }
  if (breakdownTrade) {
    breakdownTrade.textContent = formatValue(data.tradeIn);
  }
  if (breakdownFees) {
    breakdownFees.textContent = formatValue(data.fees);
  }
  if (breakdownTax) {
    breakdownTax.textContent = formatValue(data.taxAmount);
  }
  if (breakdownFinanced) {
    breakdownFinanced.textContent = formatValue(data.amountFinanced);
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
    snapshotTerm.textContent = buildTermText(data.termYears);
  }
  if (previewDownPercent) {
    previewDownPercent.textContent = formatPercent(data.downPaymentPercent);
  }
  if (previewTrade) {
    previewTrade.textContent = formatValue(data.tradeIn);
  }
  if (previewFees) {
    previewFees.textContent = formatValue(data.fees);
  }
  if (previewTax) {
    previewTax.textContent = formatValue(data.taxAmount);
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
      `${formatValue(data.totalInterest)} in interest across the full schedule.`;
  }
}

function calculate() {
  if (!resultDiv || !summaryDiv) {
    return;
  }

  clearOutputs();

  const price = Number(priceInput?.value);
  const downPaymentAmount = Number(downValueInput?.value);
  const tradeIn = Number(tradeInput?.value);
  const fees = Number(feesInput?.value);
  const taxRate = Number(taxInput?.value);
  const apr = Number(aprInput?.value);
  const termYears = Number(termInput?.value);

  if (!Number.isFinite(price) || price <= 0) {
    setError('Vehicle price must be greater than 0.');
    return;
  }
  if (!Number.isFinite(downPaymentAmount) || downPaymentAmount < 0 || downPaymentAmount >= price) {
    setError('Down payment must be 0 or more and less than vehicle price.');
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

  const downPaymentPercent = price > 0 ? (downPaymentAmount / price) * 100 : 0;
  const data = calculateCarLoan({
    price,
    downPaymentType: 'amount',
    downPaymentAmount,
    downPaymentPercent,
    tradeIn,
    fees,
    taxRate,
    apr,
    termYears,
  });

  updateSliderDisplays();
  updatePreview(data);
  updateExplanation(data);
  renderMonthlyTable(data.schedule);
  renderYearlyTable(data.yearly);
  applyView(scheduleView);
  staleController.markFresh();
  revealResultPanel({
    resultPanel: previewPanel,
    focusTarget: resultDiv,
  });
}

const priceBinding = wireRangeWithField({
  rangeInput: priceInput,
  textInput: priceField,
  formatFieldValue: (value) => formatFieldValue(value),
  parseFieldValue: parseLooseNumber,
  onVisualUpdate: updateSliderDisplays,
});

const downBinding = wireRangeWithField({
  rangeInput: downValueInput,
  textInput: downValueField,
  formatFieldValue: (value) => formatFieldValue(value),
  parseFieldValue: parseLooseNumber,
  onVisualUpdate: updateSliderDisplays,
});

const tradeBinding = wireRangeWithField({
  rangeInput: tradeInput,
  textInput: tradeField,
  formatFieldValue: (value) => formatFieldValue(value),
  parseFieldValue: parseLooseNumber,
  onVisualUpdate: updateSliderDisplays,
});

const feesBinding = wireRangeWithField({
  rangeInput: feesInput,
  textInput: feesField,
  formatFieldValue: (value) => formatFieldValue(value),
  parseFieldValue: parseLooseNumber,
  onVisualUpdate: updateSliderDisplays,
});

const taxBinding = wireRangeWithField({
  rangeInput: taxInput,
  textInput: taxField,
  formatFieldValue: (value) => formatFieldValue(value, 1),
  parseFieldValue: parseLooseNumber,
  onVisualUpdate: updateSliderDisplays,
});

const aprBinding = wireRangeWithField({
  rangeInput: aprInput,
  textInput: aprField,
  formatFieldValue: (value) => formatFieldValue(value, 1),
  parseFieldValue: parseLooseNumber,
  onVisualUpdate: updateSliderDisplays,
});

const termBinding = wireRangeWithField({
  rangeInput: termInput,
  textInput: termField,
  formatFieldValue: (value) => formatFieldValue(value),
  parseFieldValue: parseLooseNumber,
  onVisualUpdate: updateSliderDisplays,
});

function applyDefaults() {
  if (priceInput) {
    priceInput.value = defaultValues.price;
  }
  if (downValueInput) {
    downValueInput.value = defaultValues.downPayment;
  }
  if (tradeInput) {
    tradeInput.value = defaultValues.tradeIn;
  }
  if (feesInput) {
    feesInput.value = defaultValues.fees;
  }
  if (taxInput) {
    taxInput.value = defaultValues.tax;
  }
  if (aprInput) {
    aprInput.value = defaultValues.apr;
  }
  if (termInput) {
    termInput.value = defaultValues.termYears;
  }

  syncDependentRanges();
  priceBinding.syncFromRange();
  downBinding.syncFromRange();
  tradeBinding.syncFromRange();
  feesBinding.syncFromRange();
  taxBinding.syncFromRange();
  aprBinding.syncFromRange();
  termBinding.syncFromRange();
  staleController.sync();
}

priceInput?.addEventListener('input', () => {
  syncDependentRanges();
  downBinding.syncFromRange();
});

viewMonthlyButton?.addEventListener('click', () => applyView('monthly'));
viewYearlyButton?.addEventListener('click', () => applyView('yearly'));
calculateButton?.addEventListener('click', calculate);
defaultsButton?.addEventListener('click', applyDefaults);

staleController.watchElements(
  [
    priceInput,
    downValueInput,
    tradeInput,
    feesInput,
    taxInput,
    aprInput,
    termInput,
    priceField,
    downValueField,
    tradeField,
    feesField,
    taxField,
    aprField,
    termField,
  ],
  ['input', 'change']
);

updateSliderDisplays();
applyView('yearly');
calculate();
