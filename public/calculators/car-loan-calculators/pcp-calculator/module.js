import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import { setPageMetadata, setupButtonGroup } from '/assets/js/core/ui.js';
import { calculatePcp } from '/assets/js/core/auto-loan-utils.js';
import {
  createStaleResultController,
  revealResultPanel,
  updateRangeFill,
  wireRangeWithField,
} from '/calculators/car-loan-calculators/shared/cluster-ux.js';

const priceInput = document.querySelector('#pcp-price');
const depositInput = document.querySelector('#pcp-deposit-value');
const aprInput = document.querySelector('#pcp-apr');
const termInput = document.querySelector('#pcp-term');
const gfvInput = document.querySelector('#pcp-gfv');
const optionFeeInput = document.querySelector('#pcp-option-fee');
const priceField = document.querySelector('#pcp-price-field');
const depositField = document.querySelector('#pcp-deposit-value-field');
const aprField = document.querySelector('#pcp-apr-field');
const termField = document.querySelector('#pcp-term-field');
const gfvField = document.querySelector('#pcp-gfv-field');
const optionFeeField = document.querySelector('#pcp-option-fee-field');
const calculateButton = document.querySelector('#pcp-calc');
const defaultsButton = document.querySelector('#pcp-use-defaults');
const resultDiv = document.querySelector('#pcp-result');
const summaryDiv = document.querySelector('#pcp-summary');
const previewPanel = document.querySelector('#pcp-preview');
const staleNote = document.querySelector('#pcp-stale-note');

const assumptionPrice = document.querySelector('#pcp-assumption-price');
const assumptionDeposit = document.querySelector('#pcp-assumption-deposit');
const assumptionApr = document.querySelector('#pcp-assumption-apr');
const assumptionTerm = document.querySelector('#pcp-assumption-term');

const previewFinalPayment = document.querySelector('#pcp-preview-final-payment');
const previewFinalCopy = document.querySelector('#pcp-preview-final-copy');
const previewGfv = document.querySelector('#pcp-preview-gfv');
const previewGfvCopy = document.querySelector('#pcp-preview-gfv-copy');

const depositLabel = document.querySelector('#pcp-deposit-value-label');
const termLabel = document.querySelector('#pcp-term-label');

const depositTypeGroup = document.querySelector('[data-button-group="pcp-deposit-type"]');
const termUnitGroup = document.querySelector('[data-button-group="pcp-term-unit"]');

const priceDisplay = document.querySelector('#pcp-price-display');
const depositDisplay = document.querySelector('#pcp-deposit-display');
const aprDisplay = document.querySelector('#pcp-apr-display');
const termDisplay = document.querySelector('#pcp-term-display');
const gfvDisplay = document.querySelector('#pcp-gfv-display');
const optionFeeDisplay = document.querySelector('#pcp-option-fee-display');

const viewMonthlyButton = document.querySelector('#pcp-view-monthly');
const viewYearlyButton = document.querySelector('#pcp-view-yearly');
const viewCostButton = document.querySelector('#pcp-view-cost');
const monthlyTableWrap = document.querySelector('#pcp-table-monthly-wrap');
const yearlyTableWrap = document.querySelector('#pcp-table-yearly-wrap');
const costTableWrap = document.querySelector('#pcp-table-cost-wrap');
const monthlyTableBody = document.querySelector('#pcp-table-monthly-body');
const yearlyTableBody = document.querySelector('#pcp-table-yearly-body');
const costTableBody = document.querySelector('#pcp-table-cost-body');
const costTableTotalPayable = document.querySelector('#pcp-cost-total-payable');

const explanationSpans = Array.from(document.querySelectorAll('[data-pcp]')).reduce((acc, el) => {
  const key = el.dataset.pcp;
  if (!acc[key]) {
    acc[key] = [];
  }
  acc[key].push(el);
  return acc;
}, {});

let scheduleView = 'yearly';
let lastDepositType = 'amount';
let lastTermUnit = 'years';
let depositBinding;
let termBinding;
let gfvBinding;
let optionFeeBinding;

const defaultValues = {
  price: priceInput?.value ?? '32000',
  deposit: depositInput?.value ?? '3000',
  apr: aprInput?.value ?? '5.9',
  term: termInput?.value ?? '4',
  gfv: gfvInput?.value ?? '15000',
  optionFee: optionFeeInput?.value ?? '100',
  depositType: 'amount',
  termUnit: 'years',
};

const FAQ_ITEMS = [
  {
    question: 'How does a PCP calculator estimate monthly payment?',
    answer:
      'It uses financed amount, APR, term, GFV, and option fee to estimate equal monthly installments.',
  },
  {
    question: 'What is GFV in a PCP agreement?',
    answer: 'GFV is the deferred value due at the end if you choose to purchase the vehicle.',
  },
  {
    question: 'How does option fee affect final payment?',
    answer:
      'Final payment equals GFV plus option fee, so a higher fee raises the amount due at term end.',
  },
  {
    question: 'Can deposit be entered as amount or percent?',
    answer: 'Yes. Use the deposit toggle to switch between absolute amount and percentage input.',
  },
  {
    question: 'Can term be switched between years and months?',
    answer:
      'Yes. The term unit toggle converts values between years and months without recalculating until Calculate.',
  },
  {
    question: 'Does editing sliders recalculate immediately?',
    answer: 'No. Results and explanation values update only after clicking Calculate PCP.',
  },
  {
    question: 'Why are PCP monthly payments usually lower?',
    answer:
      'Part of the principal is deferred to the final payment, so less principal is repaid during monthly installments.',
  },
  {
    question: 'What does total payable include in PCP?',
    answer:
      'Total payable includes deposit, all monthly payments, and the final payment including option fee.',
  },
  {
    question: 'Can GFV and option fee exceed financed amount?',
    answer: 'No. Final payment is constrained so it cannot exceed the financed balance.',
  },
  {
    question: 'Are these PCP results lender-specific quotations?',
    answer:
      'No. These are fixed-rate estimates and can differ from lender offers and contract terms.',
  },
];

const CALCULATOR_FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

const CALCULATOR_STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://calchowmuch.com/car-loan-calculators/pcp-calculator/#webpage',
      url: 'https://calchowmuch.com/car-loan-calculators/pcp-calculator/',
      name: 'PCP Calculator | Monthly Payment, GFV & Cost',
      description:
        'Estimate PCP payments, GFV, option fee, total interest, and total payable using price, deposit, APR, and term.',
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
      '@id': 'https://calchowmuch.com/car-loan-calculators/pcp-calculator/#app',
      name: 'PCP Car Finance Calculator',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Any',
      url: 'https://calchowmuch.com/car-loan-calculators/pcp-calculator/',
      description:
        'Estimate PCP payments, GFV, option fee, total interest, and total payable using price, deposit, APR, and term.',
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
          name: 'PCP Car Finance Calculator',
          item: 'https://calchowmuch.com/car-loan-calculators/pcp-calculator/',
        },
      ],
    },
    CALCULATOR_FAQ_SCHEMA,
  ],
};

const metadata = {
  title: 'PCP Calculator | Monthly Payment, GFV & Cost',
  description:
    'Estimate PCP payments, GFV, option fee, total interest, and total payable using price, deposit, APR, and term.',
  canonical: 'https://calchowmuch.com/car-loan-calculators/pcp-calculator/',
  structuredData: CALCULATOR_STRUCTURED_DATA,
};

setPageMetadata(metadata);

const depositTypeButtons = setupButtonGroup(depositTypeGroup, {
  defaultValue: 'amount',
  onChange: (value) => {
    handleDepositTypeChange(value);
  },
});

const termUnitButtons = setupButtonGroup(termUnitGroup, {
  defaultValue: 'years',
  onChange: (value) => {
    handleTermUnitChange(value);
  },
});

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

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
    deposit: depositInput?.value ?? '',
    apr: aprInput?.value ?? '',
    term: termInput?.value ?? '',
    gfv: gfvInput?.value ?? '',
    optionFee: optionFeeInput?.value ?? '',
    depositType: getCurrentDepositType(),
    termUnit: getCurrentTermUnit(),
  });
}

const staleController = createStaleResultController({
  resultPanel: previewPanel,
  staleTargets: [staleNote],
  getSignature: buildStateSignature,
});

function setSpan(key, value) {
  const nodes = explanationSpans[key] || [];
  nodes.forEach((node) => {
    node.textContent = value;
  });
}

function getCurrentDepositType() {
  return depositTypeButtons?.getValue() ?? 'amount';
}

function getCurrentTermUnit() {
  return termUnitButtons?.getValue() ?? 'years';
}

function resolveTermMonths() {
  const rawTerm = Number(termInput?.value);
  if (!Number.isFinite(rawTerm) || rawTerm <= 0) {
    return Number.NaN;
  }

  const unit = getCurrentTermUnit();
  return unit === 'years'
    ? Math.max(1, Math.round(rawTerm * 12))
    : Math.max(1, Math.round(rawTerm));
}

function resolveDepositAmountAndPercent(price, depositType, rawDeposit) {
  if (depositType === 'percent') {
    const depositPercent = clamp(rawDeposit, 0, 99.99);
    const depositAmount = (price * depositPercent) / 100;
    return { depositAmount, depositPercent };
  }

  const depositAmount = clamp(rawDeposit, 0, price);
  const depositPercent = price > 0 ? (depositAmount / price) * 100 : 0;
  return { depositAmount, depositPercent };
}

function syncDependentRanges() {
  const price = Number(priceInput?.value);
  const nextPrice = Number.isFinite(price) ? Math.max(0, price) : 0;
  const depositType = getCurrentDepositType();

  if (depositInput) {
    if (depositType === 'percent') {
      depositInput.min = '0';
      depositInput.max = '99.99';
      depositInput.step = '0.1';
    } else {
      depositInput.min = '0';
      depositInput.max = String(nextPrice);
      depositInput.step = '100';
      const depositValue = Number(depositInput.value);
      if (Number.isFinite(depositValue) && depositValue > nextPrice) {
        depositInput.value = String(nextPrice);
      }
    }
  }

  const rawDeposit = Number(depositInput?.value);
  const safeRawDeposit = Number.isFinite(rawDeposit) ? Math.max(0, rawDeposit) : 0;
  const { depositAmount } = resolveDepositAmountAndPercent(nextPrice, depositType, safeRawDeposit);

  const financed = Math.max(0, nextPrice - depositAmount);

  if (optionFeeInput) {
    optionFeeInput.min = '0';
    optionFeeInput.max = String(financed);
    optionFeeInput.step = '10';
    const optionFeeValue = Number(optionFeeInput.value);
    if (Number.isFinite(optionFeeValue) && optionFeeValue > financed) {
      optionFeeInput.value = String(financed);
    }
  }

  const optionFee = Number(optionFeeInput?.value);
  const safeOptionFee = Number.isFinite(optionFee) ? Math.max(0, optionFee) : 0;
  const gfvMax = Math.max(0, financed - safeOptionFee);

  if (gfvInput) {
    gfvInput.min = '0';
    gfvInput.max = String(gfvMax);
    gfvInput.step = '100';
    const gfvValue = Number(gfvInput.value);
    if (Number.isFinite(gfvValue) && gfvValue > gfvMax) {
      gfvInput.value = String(gfvMax);
    }
  }
}

function updateSliderDisplays() {
  const depositType = getCurrentDepositType();
  const termUnit = getCurrentTermUnit();

  if (priceDisplay && priceInput) {
    priceDisplay.textContent = formatValue(Number(priceInput.value));
  }
  if (depositDisplay && depositInput) {
    depositDisplay.textContent =
      depositType === 'percent'
        ? formatPercent(Number(depositInput.value))
        : formatValue(Number(depositInput.value));
  }
  if (aprDisplay && aprInput) {
    aprDisplay.textContent = formatPercent(Number(aprInput.value));
  }
  if (termDisplay && termInput) {
    termDisplay.textContent =
      termUnit === 'years'
        ? `${formatValue(Number(termInput.value), { maximumFractionDigits: 1 })} yrs`
        : `${formatValue(Number(termInput.value), { maximumFractionDigits: 0 })} mo`;
  }
  if (gfvDisplay && gfvInput) {
    gfvDisplay.textContent = formatValue(Number(gfvInput.value));
  }
  if (optionFeeDisplay && optionFeeInput) {
    optionFeeDisplay.textContent = formatValue(Number(optionFeeInput.value), {
      maximumFractionDigits: 0,
    });
  }

  [priceInput, depositInput, aprInput, termInput, gfvInput, optionFeeInput].forEach(
    updateRangeFill
  );
}

function handleDepositTypeChange(type) {
  if (!depositInput) {
    return;
  }

  const previousType = lastDepositType;
  const price = Number(priceInput?.value);
  const safePrice = Number.isFinite(price) ? Math.max(0, price) : 0;

  const rawValue = Number(depositInput.value);
  const safeRawValue = Number.isFinite(rawValue) && rawValue >= 0 ? rawValue : 0;

  if (previousType !== type) {
    if (type === 'percent') {
      const percentValue = safePrice > 0 ? (safeRawValue / safePrice) * 100 : 0;
      depositInput.value = percentValue.toFixed(2);
    } else {
      const amountValue = (safeRawValue / 100) * safePrice;
      depositInput.value = amountValue.toFixed(2);
    }
  }

  if (depositLabel) {
    depositLabel.textContent = type === 'percent' ? 'Deposit Percent' : 'Deposit Amount';
  }

  lastDepositType = type;
  syncDependentRanges();
  updateSliderDisplays();
  depositBinding?.syncFromRange();
  optionFeeBinding?.syncFromRange();
  gfvBinding?.syncFromRange();
}

function handleTermUnitChange(unit) {
  if (!termInput) {
    return;
  }

  const previousUnit = lastTermUnit;
  const rawValue = Number(termInput.value);
  const safeRawValue =
    Number.isFinite(rawValue) && rawValue > 0 ? rawValue : previousUnit === 'years' ? 4 : 48;
  const currentMonths =
    previousUnit === 'years' ? Math.round(safeRawValue * 12) : Math.round(safeRawValue);

  if (termLabel) {
    termLabel.textContent = unit === 'years' ? 'Term (years)' : 'Term (months)';
  }

  if (unit === 'years') {
    termInput.min = '1';
    termInput.max = '8';
    termInput.step = '0.5';

    if (previousUnit !== unit) {
      const yearsValue = clamp(currentMonths / 12, 1, 8);
      termInput.value = Number.isInteger(yearsValue) ? String(yearsValue) : yearsValue.toFixed(1);
    }
  } else {
    termInput.min = '12';
    termInput.max = '96';
    termInput.step = '1';

    if (previousUnit !== unit) {
      const monthsValue = Math.round(clamp(currentMonths, 12, 96));
      termInput.value = String(monthsValue);
    }
  }

  lastTermUnit = unit;
  updateSliderDisplays();
  termBinding?.syncFromRange();
}

function clearOutputs() {
  if (monthlyTableBody) {
    monthlyTableBody.innerHTML = '';
  }
  if (yearlyTableBody) {
    yearlyTableBody.innerHTML = '';
  }
  if (costTableBody) {
    costTableBody.innerHTML = '';
  }
  if (costTableTotalPayable) {
    costTableTotalPayable.textContent = '—';
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
  scheduleView = ['monthly', 'yearly', 'cost'].includes(view) ? view : 'yearly';

  const isMonthly = scheduleView === 'monthly';
  const isYearly = scheduleView === 'yearly';
  const isCost = scheduleView === 'cost';

  monthlyTableWrap?.classList.toggle('is-hidden', !isMonthly);
  yearlyTableWrap?.classList.toggle('is-hidden', !isYearly);
  costTableWrap?.classList.toggle('is-hidden', !isCost);

  viewMonthlyButton?.classList.toggle('is-active', isMonthly);
  viewMonthlyButton?.setAttribute('aria-pressed', isMonthly ? 'true' : 'false');

  viewYearlyButton?.classList.toggle('is-active', isYearly);
  viewYearlyButton?.setAttribute('aria-pressed', isYearly ? 'true' : 'false');

  viewCostButton?.classList.toggle('is-active', isCost);
  viewCostButton?.setAttribute('aria-pressed', isCost ? 'true' : 'false');
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

function renderCostTable(data) {
  if (costTableBody) {
    const rows = [
      {
        metric: 'Amount Financed',
        value: formatValue(data.financed),
        note: 'Price minus deposit before interest.',
      },
      {
        metric: 'GFV (Deferred Principal)',
        value: formatValue(data.gfv),
        note: 'Deferred amount due at term end.',
      },
      {
        metric: 'Option Fee',
        value: formatValue(data.optionFee, { maximumFractionDigits: 0 }),
        note: 'Added to final payment if purchased.',
      },
      {
        metric: 'Total Interest',
        value: formatValue(data.totalInterest),
        note: 'Interest paid across installments.',
      },
      {
        metric: 'Deposit Paid Upfront',
        value: formatValue(data.deposit),
        note: 'Initial contribution at agreement start.',
      },
    ];

    costTableBody.innerHTML = rows
      .map(
        (row) => `
          <tr>
            <th scope="row" data-label="Metric">${row.metric}</th>
            <td data-label="Value">${row.value}</td>
            <td data-label="Explanation">${row.note}</td>
          </tr>
        `
      )
      .join('');
  }

  if (costTableTotalPayable) {
    costTableTotalPayable.textContent = formatValue(data.totalPayable);
  }
}

function buildTermText(termMonths) {
  const years = termMonths / 12;
  return `${formatValue(years, { maximumFractionDigits: 1 })} years (${formatValue(termMonths, {
    maximumFractionDigits: 0,
  })} months)`;
}

function updatePreview(data) {
  if (resultDiv) {
    resultDiv.innerHTML = `<strong>Monthly payment</strong><span class="mtg-result-value is-updated">${formatValue(
      data.monthlyPayment
    )}</span>`;

    const valueEl = resultDiv.querySelector('.mtg-result-value');
    if (valueEl) {
      setTimeout(() => valueEl.classList.remove('is-updated'), 420);
    }
  }

  if (summaryDiv) {
    summaryDiv.innerHTML = `
      <article class="al-metric-card">
        <span class="al-metric-card-label">Amount Financed</span>
        <strong class="al-metric-card-value">${formatValue(data.financed)}</strong>
      </article>
      <article class="al-metric-card">
        <span class="al-metric-card-label">Total Interest</span>
        <strong class="al-metric-card-value">${formatValue(data.totalInterest)}</strong>
      </article>
      <article class="al-metric-card">
        <span class="al-metric-card-label">Total Payable</span>
        <strong class="al-metric-card-value">${formatValue(data.totalPayable)}</strong>
      </article>
    `;
  }

  if (assumptionPrice) {
    assumptionPrice.textContent = formatValue(data.price);
  }
  if (assumptionDeposit) {
    assumptionDeposit.textContent = formatValue(data.deposit);
  }
  if (assumptionApr) {
    assumptionApr.textContent = formatPercent(data.apr);
  }
  if (assumptionTerm) {
    assumptionTerm.textContent = buildTermText(data.termMonths);
  }

  if (previewFinalPayment) {
    previewFinalPayment.textContent = formatValue(data.finalPayment);
  }
  if (previewFinalCopy) {
    previewFinalCopy.textContent = `GFV of ${formatValue(data.gfv)} plus option fee of ${formatValue(
      data.optionFee,
      { maximumFractionDigits: 0 }
    )}.`;
  }
  if (previewGfv) {
    previewGfv.textContent = formatValue(data.gfv);
  }
  if (previewGfvCopy) {
    previewGfvCopy.textContent = `Deposit covers ${formatPercent(
      data.depositPercent
    )} before the PCP term starts.`;
  }

  setSpan('price', formatValue(data.price));
  setSpan('deposit', formatValue(data.deposit));
  setSpan('deposit-percent', formatPercent(data.depositPercent));
  setSpan('financed', formatValue(data.financed));
  setSpan('apr', formatPercent(data.apr));
  setSpan('term', buildTermText(data.termMonths));
  setSpan('gfv', formatValue(data.gfv));
  setSpan('option-fee', formatValue(data.optionFee, { maximumFractionDigits: 0 }));
  setSpan('final-payment', formatValue(data.finalPayment));
  setSpan('monthly-payment', formatValue(data.monthlyPayment));
  setSpan('total-interest', formatValue(data.totalInterest));
  setSpan('total-payable', formatValue(data.totalPayable));
}

function updateExplanation(data) {
  const totalPayable = Math.max(0, data.totalPayable);
  const interestShare = totalPayable > 0 ? (data.totalInterest / totalPayable) * 100 : 0;
  const clampedInterestShare = Math.min(100, Math.max(0, interestShare));
  const principalShare = Math.max(0, 100 - clampedInterestShare);

  const donut = (explanationSpans['lifetime-donut'] || [])[0];
  if (donut) {
    donut.style.setProperty('--principal-share', `${principalShare}%`);
  }

  setSpan(
    'principal-share',
    `${formatValue(principalShare, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })}%`
  );
  setSpan(
    'interest-share',
    `${formatValue(clampedInterestShare, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })}%`
  );

  setSpan('amount-financed-total', formatValue(data.financed));
  setSpan('gfv-total', formatValue(data.gfv));
  setSpan('option-fee-total', formatValue(data.optionFee, { maximumFractionDigits: 0 }));
  setSpan('total-interest-total', formatValue(data.totalInterest));
  setSpan('total-payable-total', formatValue(data.totalPayable));

  setSpan(
    'lifetime-summary',
    `You finance ${formatValue(data.financed)} with GFV of ${formatValue(data.gfv)} and pay ${formatValue(data.totalInterest)} in interest over the full PCP schedule.`
  );
}

function validateAndNormalizeInputs() {
  const price = Number(priceInput?.value);
  const rawDeposit = Number(depositInput?.value);
  const apr = Number(aprInput?.value);
  const termMonths = resolveTermMonths();
  const gfv = Number(gfvInput?.value);
  const optionFee = Number(optionFeeInput?.value);
  const depositType = getCurrentDepositType();

  if (!Number.isFinite(price) || price <= 0) {
    return { error: 'Vehicle price must be greater than 0.' };
  }
  if (!Number.isFinite(rawDeposit) || rawDeposit < 0) {
    return { error: 'Deposit must be 0 or more.' };
  }
  if (!Number.isFinite(apr) || apr < 0) {
    return { error: 'APR must be 0 or more.' };
  }
  if (!Number.isFinite(termMonths) || termMonths < 1) {
    return { error: 'Loan term must be at least 1 month.' };
  }
  if (!Number.isFinite(gfv) || gfv < 0) {
    return { error: 'GFV must be 0 or more.' };
  }
  if (!Number.isFinite(optionFee) || optionFee < 0) {
    return { error: 'Option fee must be 0 or more.' };
  }

  const { depositAmount, depositPercent } = resolveDepositAmountAndPercent(
    price,
    depositType,
    rawDeposit
  );

  if (depositAmount >= price) {
    return { error: 'Deposit must be less than vehicle price.' };
  }

  const financed = price - depositAmount;

  if (optionFee > financed) {
    return { error: 'Option fee cannot exceed amount financed.' };
  }

  if (gfv + optionFee > financed) {
    return { error: 'GFV + option fee cannot exceed amount financed.' };
  }

  return {
    price,
    apr,
    termMonths,
    gfv,
    optionFee,
    depositAmount,
    depositPercent,
    depositType,
  };
}

function calculate() {
  if (!resultDiv || !summaryDiv) {
    return;
  }

  resultDiv.textContent = '';
  summaryDiv.textContent = '';
  clearOutputs();

  syncDependentRanges();

  const normalized = validateAndNormalizeInputs();
  if (normalized.error) {
    setError(normalized.error);
    return;
  }

  const data = calculatePcp({
    price: normalized.price,
    deposit: normalized.depositAmount,
    apr: normalized.apr,
    termMonths: normalized.termMonths,
    balloon: normalized.gfv,
    optionFee: normalized.optionFee,
  });

  if (depositInput) {
    if (normalized.depositType === 'percent') {
      depositInput.value = data.depositPercent.toFixed(2);
    } else {
      depositInput.value = data.deposit.toFixed(2);
    }
  }

  if (termInput) {
    const termUnit = getCurrentTermUnit();
    if (termUnit === 'years') {
      const yearsValue = clamp(data.termMonths / 12, 1, 8);
      termInput.value = Number.isInteger(yearsValue) ? String(yearsValue) : yearsValue.toFixed(1);
    } else {
      termInput.value = String(data.termMonths);
    }
  }

  if (gfvInput) {
    gfvInput.value = data.gfv.toFixed(2);
  }

  if (optionFeeInput) {
    optionFeeInput.value = data.optionFee.toFixed(2);
  }

  syncDependentRanges();
  depositBinding?.syncFromRange();
  termBinding?.syncFromRange();
  gfvBinding?.syncFromRange();
  optionFeeBinding?.syncFromRange();
  updatePreview(data);
  updateExplanation(data);
  renderMonthlyTable(data.schedule);
  renderYearlyTable(data.yearly);
  renderCostTable(data);
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

depositBinding = wireRangeWithField({
  rangeInput: depositInput,
  textInput: depositField,
  formatFieldValue: (value) =>
    formatFieldValue(value, getCurrentDepositType() === 'percent' ? 2 : 0),
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

termBinding = wireRangeWithField({
  rangeInput: termInput,
  textInput: termField,
  formatFieldValue: (value) =>
    formatFieldValue(value, getCurrentTermUnit() === 'years' ? 1 : 0),
  parseFieldValue: parseLooseNumber,
  onVisualUpdate: updateSliderDisplays,
});

gfvBinding = wireRangeWithField({
  rangeInput: gfvInput,
  textInput: gfvField,
  formatFieldValue: (value) => formatFieldValue(value),
  parseFieldValue: parseLooseNumber,
  onVisualUpdate: updateSliderDisplays,
});

optionFeeBinding = wireRangeWithField({
  rangeInput: optionFeeInput,
  textInput: optionFeeField,
  formatFieldValue: (value) => formatFieldValue(value),
  parseFieldValue: parseLooseNumber,
  onVisualUpdate: updateSliderDisplays,
});

priceInput?.addEventListener('input', () => {
  syncDependentRanges();
  depositBinding?.syncFromRange();
  optionFeeBinding?.syncFromRange();
  gfvBinding?.syncFromRange();
});

depositInput?.addEventListener('input', () => {
  syncDependentRanges();
  optionFeeBinding?.syncFromRange();
  gfvBinding?.syncFromRange();
});

optionFeeInput?.addEventListener('input', () => {
  syncDependentRanges();
  gfvBinding?.syncFromRange();
});

function applyDefaults() {
  depositTypeButtons?.setValue(defaultValues.depositType);
  termUnitButtons?.setValue(defaultValues.termUnit);
  handleDepositTypeChange(defaultValues.depositType);
  handleTermUnitChange(defaultValues.termUnit);

  if (priceInput) {
    priceInput.value = defaultValues.price;
  }
  if (depositInput) {
    depositInput.value = defaultValues.deposit;
  }
  if (aprInput) {
    aprInput.value = defaultValues.apr;
  }
  if (termInput) {
    termInput.value = defaultValues.term;
  }
  if (gfvInput) {
    gfvInput.value = defaultValues.gfv;
  }
  if (optionFeeInput) {
    optionFeeInput.value = defaultValues.optionFee;
  }

  syncDependentRanges();
  priceBinding.syncFromRange();
  depositBinding?.syncFromRange();
  aprBinding.syncFromRange();
  termBinding?.syncFromRange();
  gfvBinding?.syncFromRange();
  optionFeeBinding?.syncFromRange();
  staleController.sync();
}

viewMonthlyButton?.addEventListener('click', () => applyView('monthly'));
viewYearlyButton?.addEventListener('click', () => applyView('yearly'));
viewCostButton?.addEventListener('click', () => applyView('cost'));
calculateButton?.addEventListener('click', calculate);
defaultsButton?.addEventListener('click', applyDefaults);

staleController.watchElements(
  [
    priceInput,
    depositInput,
    aprInput,
    termInput,
    gfvInput,
    optionFeeInput,
    priceField,
    depositField,
    aprField,
    termField,
    gfvField,
    optionFeeField,
  ],
  ['input', 'change']
);
staleController.watchElements([depositTypeGroup, termUnitGroup], ['click']);

lastDepositType = getCurrentDepositType();
lastTermUnit = getCurrentTermUnit();
handleDepositTypeChange(lastDepositType);
handleTermUnitChange(lastTermUnit);
syncDependentRanges();
updateSliderDisplays();
applyView('yearly');
calculate();
