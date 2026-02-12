import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import { setPageMetadata, setupButtonGroup } from '/assets/js/core/ui.js';
import { calculateLease } from '/assets/js/core/auto-loan-utils.js';

const priceInput = document.querySelector('#lease-price');
const residualInput = document.querySelector('#lease-residual-value');
const termInput = document.querySelector('#lease-term');
const factorInput = document.querySelector('#lease-factor');
const upfrontInput = document.querySelector('#lease-upfront');
const calculateButton = document.querySelector('#lease-calc');
const resultDiv = document.querySelector('#lease-result');
const summaryDiv = document.querySelector('#lease-summary');

const residualLabel = document.querySelector('#lease-residual-value-label');
const termLabel = document.querySelector('#lease-term-label');

const residualTypeGroup = document.querySelector('[data-button-group="lease-residual-type"]');
const termUnitGroup = document.querySelector('[data-button-group="lease-term-unit"]');

const priceDisplay = document.querySelector('#lease-price-display');
const residualDisplay = document.querySelector('#lease-residual-display');
const termDisplay = document.querySelector('#lease-term-display');
const factorDisplay = document.querySelector('#lease-factor-display');
const upfrontDisplay = document.querySelector('#lease-upfront-display');

const viewMonthlyButton = document.querySelector('#lease-view-monthly');
const viewYearlyButton = document.querySelector('#lease-view-yearly');
const viewCostButton = document.querySelector('#lease-view-cost');
const monthlyTableWrap = document.querySelector('#lease-table-monthly-wrap');
const yearlyTableWrap = document.querySelector('#lease-table-yearly-wrap');
const costTableWrap = document.querySelector('#lease-table-cost-wrap');
const monthlyTableBody = document.querySelector('#lease-table-monthly-body');
const yearlyTableBody = document.querySelector('#lease-table-yearly-body');
const costTableBody = document.querySelector('#lease-table-cost-body');
const costTableTotal = document.querySelector('#lease-cost-total');

const explanationSpans = Array.from(document.querySelectorAll('[data-lease]')).reduce((acc, el) => {
  const key = el.dataset.lease;
  if (!acc[key]) {
    acc[key] = [];
  }
  acc[key].push(el);
  return acc;
}, {});

let scheduleView = 'yearly';
let lastResidualType = 'amount';
let lastTermUnit = 'years';

export const pageSchema = {
  calculatorFAQ: true,
  globalFAQ: false,
};

const FAQ_ITEMS = [
  {
    question: 'How does a leasing calculator estimate monthly payment?',
    answer:
      'It combines monthly depreciation and finance charge using cap cost, residual, term, and money factor.',
  },
  {
    question: 'What is residual value in a lease?',
    answer: 'Residual is the estimated vehicle value at lease end, used to determine depreciation portion.',
  },
  {
    question: 'Can I enter residual as amount or percent?',
    answer: 'Yes. Use the residual toggle to switch between amount and percent modes.',
  },
  {
    question: 'What does money factor represent?',
    answer: 'Money factor represents lease finance cost and is analogous to an interest rate factor.',
  },
  {
    question: 'How does upfront payment affect lease cost?',
    answer:
      'A higher upfront payment lowers cap cost, which can reduce monthly payment and finance charge.',
  },
  {
    question: 'Can term be switched between years and months?',
    answer: 'Yes. Use the term unit toggle and recalculate to compare different lease durations.',
  },
  {
    question: 'Does the calculator recalculate while I drag sliders?',
    answer: 'No. Results and explanation update only when you click Calculate Lease.',
  },
  {
    question: 'Why can residual not exceed vehicle price?',
    answer: 'Residual above vehicle price would imply negative depreciation and unrealistic lease economics.',
  },
  {
    question: 'What is included in total lease cost?',
    answer: 'Total lease cost includes upfront payment plus all monthly lease payments over the term.',
  },
  {
    question: 'Are these lender-specific lease quotes?',
    answer: 'No. These are model-based estimates and may differ from lender fees, taxes, and terms.',
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

const metadata = {
  title: 'Leasing Calculator - Monthly Payment, Residual & Total Cost',
  description:
    'Estimate lease monthly payment, residual impact, finance charge, and total lease cost with premium sliders, three table views, and FAQs.',
  canonical: 'https://calchowmuch.com/loans/leasing-calculator/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
};

setPageMetadata(metadata);

const residualTypeButtons = setupButtonGroup(residualTypeGroup, {
  defaultValue: 'amount',
  onChange: (value) => {
    handleResidualTypeChange(value);
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

function formatMoneyFactor(value) {
  return Number(value).toFixed(4);
}

function setSpan(key, value) {
  const nodes = explanationSpans[key] || [];
  nodes.forEach((node) => {
    node.textContent = value;
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

function getCurrentResidualType() {
  return residualTypeButtons?.getValue() ?? 'amount';
}

function getCurrentTermUnit() {
  return termUnitButtons?.getValue() ?? 'years';
}

function resolveTermMonths() {
  const rawTerm = Number(termInput?.value);
  if (!Number.isFinite(rawTerm) || rawTerm <= 0) {
    return Number.NaN;
  }
  return getCurrentTermUnit() === 'years'
    ? Math.max(1, Math.round(rawTerm * 12))
    : Math.max(1, Math.round(rawTerm));
}

function resolveResidualValues(price, residualType, rawResidual) {
  if (residualType === 'percent') {
    const residualPercent = clamp(rawResidual, 0, 99.99);
    return {
      residualValue: (price * residualPercent) / 100,
      residualPercent,
    };
  }

  const residualValue = clamp(rawResidual, 0, price);
  return {
    residualValue,
    residualPercent: price > 0 ? (residualValue / price) * 100 : 0,
  };
}

function syncDependentRanges() {
  const price = Number(priceInput?.value);
  const safePrice = Number.isFinite(price) ? Math.max(0, price) : 0;
  const residualType = getCurrentResidualType();

  if (residualInput) {
    if (residualType === 'percent') {
      residualInput.min = '0';
      residualInput.max = '99.99';
      residualInput.step = '0.1';
    } else {
      residualInput.min = '0';
      residualInput.max = String(safePrice);
      residualInput.step = '100';
      const residualValue = Number(residualInput.value);
      if (Number.isFinite(residualValue) && residualValue > safePrice) {
        residualInput.value = String(safePrice);
      }
    }
  }

  if (upfrontInput) {
    upfrontInput.min = '0';
    upfrontInput.max = String(safePrice);
    upfrontInput.step = '100';
    const upfrontValue = Number(upfrontInput.value);
    if (Number.isFinite(upfrontValue) && upfrontValue > safePrice) {
      upfrontInput.value = String(safePrice);
    }
  }
}

function updateSliderDisplays() {
  const residualType = getCurrentResidualType();
  const termUnit = getCurrentTermUnit();

  if (priceDisplay && priceInput) {
    priceDisplay.textContent = formatValue(Number(priceInput.value));
  }
  if (residualDisplay && residualInput) {
    residualDisplay.textContent =
      residualType === 'percent'
        ? formatPercent(Number(residualInput.value))
        : formatValue(Number(residualInput.value));
  }
  if (termDisplay && termInput) {
    termDisplay.textContent =
      termUnit === 'years'
        ? `${formatValue(Number(termInput.value), { maximumFractionDigits: 1 })} yrs`
        : `${formatValue(Number(termInput.value), { maximumFractionDigits: 0 })} mo`;
  }
  if (factorDisplay && factorInput) {
    factorDisplay.textContent = formatMoneyFactor(Number(factorInput.value));
  }
  if (upfrontDisplay && upfrontInput) {
    upfrontDisplay.textContent = formatValue(Number(upfrontInput.value));
  }

  [priceInput, residualInput, termInput, factorInput, upfrontInput].forEach(setSliderFill);
}

function handleResidualTypeChange(type) {
  if (!residualInput) {
    return;
  }

  const previousType = lastResidualType;
  const price = Number(priceInput?.value);
  const safePrice = Number.isFinite(price) ? Math.max(0, price) : 0;
  const rawResidual = Number(residualInput.value);
  const safeRawResidual = Number.isFinite(rawResidual) && rawResidual >= 0 ? rawResidual : 0;

  if (previousType !== type) {
    if (type === 'percent') {
      const residualPercent = safePrice > 0 ? (safeRawResidual / safePrice) * 100 : 0;
      residualInput.value = residualPercent.toFixed(2);
    } else {
      const residualAmount = (safeRawResidual / 100) * safePrice;
      residualInput.value = residualAmount.toFixed(2);
    }
  }

  if (residualLabel) {
    residualLabel.textContent = type === 'percent' ? 'Residual Percent' : 'Residual Amount';
  }

  lastResidualType = type;
  syncDependentRanges();
  updateSliderDisplays();
}

function handleTermUnitChange(unit) {
  if (!termInput) {
    return;
  }

  const previousUnit = lastTermUnit;
  const rawValue = Number(termInput.value);
  const safeRawValue = Number.isFinite(rawValue) && rawValue > 0 ? rawValue : previousUnit === 'years' ? 3 : 36;
  const currentMonths = previousUnit === 'years' ? Math.round(safeRawValue * 12) : Math.round(safeRawValue);

  if (termLabel) {
    termLabel.textContent = unit === 'years' ? 'Lease Term (years)' : 'Lease Term (months)';
  }

  if (unit === 'years') {
    termInput.min = '1';
    termInput.max = '6';
    termInput.step = '0.5';

    if (previousUnit !== unit) {
      const yearsValue = clamp(currentMonths / 12, 1, 6);
      termInput.value = Number.isInteger(yearsValue) ? String(yearsValue) : yearsValue.toFixed(1);
    }
  } else {
    termInput.min = '12';
    termInput.max = '72';
    termInput.step = '1';

    if (previousUnit !== unit) {
      const monthsValue = Math.round(clamp(currentMonths, 12, 72));
      termInput.value = String(monthsValue);
    }
  }

  lastTermUnit = unit;
  updateSliderDisplays();
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
  if (costTableTotal) {
    costTableTotal.textContent = '—';
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

function renderMonthlyTable(data) {
  if (!monthlyTableBody) {
    return;
  }

  const depreciationPerMonth = data.termMonths > 0 ? (data.capCost - data.residual) / data.termMonths : 0;
  const financePerMonth = data.monthlyPayment - depreciationPerMonth;

  monthlyTableBody.innerHTML = (data.schedule || [])
    .map(
      (entry) => `
        <tr>
          <td>${entry.month}</td>
          <td>${formatValue(entry.payment)}</td>
          <td>${formatValue(depreciationPerMonth)}</td>
          <td>${formatValue(financePerMonth)}</td>
          <td>${formatValue(entry.cumulative)}</td>
        </tr>
      `
    )
    .join('');
}

function renderYearlyTable(data) {
  if (!yearlyTableBody) {
    return;
  }

  const yearly = data.yearly || [];
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
        metric: 'Vehicle Price',
        value: formatValue(data.price),
        note: 'Starting MSRP / negotiated vehicle value.',
      },
      {
        metric: 'Residual Value',
        value: formatValue(data.residual),
        note: 'Estimated vehicle value at lease end.',
      },
      {
        metric: 'Cap Cost',
        value: formatValue(data.capCost),
        note: 'Price minus upfront payment considered financed.',
      },
      {
        metric: 'Depreciation Cost',
        value: formatValue(data.depreciationTotal),
        note: 'Total value consumed over lease term.',
      },
      {
        metric: 'Finance Charge',
        value: formatValue(data.financeTotal),
        note: 'Total financing component across lease term.',
      },
      {
        metric: 'Upfront Payment',
        value: formatValue(data.upfrontPayment),
        note: 'Amount paid at lease start.',
      },
    ];

    costTableBody.innerHTML = rows
      .map(
        (row) => `
          <tr>
            <th scope="row">${row.metric}</th>
            <td>${row.value}</td>
            <td>${row.note}</td>
          </tr>
        `
      )
      .join('');
  }

  if (costTableTotal) {
    costTableTotal.textContent = formatValue(data.totalLeaseCost);
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
    resultDiv.innerHTML = `<span class="mtg-result-value is-updated">${formatValue(data.monthlyPayment)}</span>`;

    const valueEl = resultDiv.querySelector('.mtg-result-value');
    if (valueEl) {
      setTimeout(() => valueEl.classList.remove('is-updated'), 420);
    }
  }

  if (summaryDiv) {
    summaryDiv.innerHTML =
      `<p><strong>Cap Cost:</strong> ${formatValue(data.capCost)}</p>` +
      `<p><strong>Finance Charge:</strong> ${formatValue(data.financeTotal)}</p>` +
      `<p><strong>Total Lease Cost:</strong> ${formatValue(data.totalLeaseCost)}</p>`;
  }

  const residualPercent = data.price > 0 ? (data.residual / data.price) * 100 : 0;

  setSpan('price', formatValue(data.price));
  setSpan('residual', formatValue(data.residual));
  setSpan('residual-percent', formatPercent(residualPercent));
  setSpan('cap-cost', formatValue(data.capCost));
  setSpan('term', buildTermText(data.termMonths));
  setSpan('money-factor', formatMoneyFactor(data.moneyFactor));
  setSpan('upfront', formatValue(data.upfrontPayment));
  setSpan('monthly-payment', formatValue(data.monthlyPayment));
  setSpan('total-cost', formatValue(data.totalLeaseCost));
}

function updateExplanation(data) {
  const totalRecurring = Math.max(0, data.totalLeaseCost - data.upfrontPayment);
  const depreciationShare = totalRecurring > 0 ? (data.depreciationTotal / totalRecurring) * 100 : 0;
  const clampedDepreciation = Math.min(100, Math.max(0, depreciationShare));
  const financeShare = Math.max(0, 100 - clampedDepreciation);

  const donut = (explanationSpans['lifetime-donut'] || [])[0];
  if (donut) {
    donut.style.setProperty('--principal-share', `${clampedDepreciation}%`);
  }

  setSpan(
    'depreciation-share',
    `${formatValue(clampedDepreciation, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })}%`
  );
  setSpan(
    'finance-share',
    `${formatValue(financeShare, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })}%`
  );

  setSpan('cap-cost-total', formatValue(data.capCost));
  setSpan('residual-total', formatValue(data.residual));
  setSpan('depreciation-total', formatValue(data.depreciationTotal));
  setSpan('finance-total', formatValue(data.financeTotal));
  setSpan('total-cost-total', formatValue(data.totalLeaseCost));

  setSpan(
    'lifetime-summary',
    `Estimated depreciation is ${formatValue(data.depreciationTotal)} and finance charge is ${formatValue(data.financeTotal)} across the full lease term.`
  );
}

function validateAndNormalizeInputs() {
  const price = Number(priceInput?.value);
  const rawResidual = Number(residualInput?.value);
  const termMonths = resolveTermMonths();
  const moneyFactor = Number(factorInput?.value);
  const upfrontPayment = Number(upfrontInput?.value);
  const residualType = getCurrentResidualType();

  if (!Number.isFinite(price) || price <= 0) {
    return { error: 'Vehicle price must be greater than 0.' };
  }
  if (!Number.isFinite(rawResidual) || rawResidual < 0) {
    return { error: 'Residual value must be 0 or more.' };
  }
  if (!Number.isFinite(termMonths) || termMonths < 1) {
    return { error: 'Lease term must be at least 1 month.' };
  }
  if (!Number.isFinite(moneyFactor) || moneyFactor < 0) {
    return { error: 'Money factor must be 0 or more.' };
  }
  if (!Number.isFinite(upfrontPayment) || upfrontPayment < 0) {
    return { error: 'Upfront payment must be 0 or more.' };
  }

  if (upfrontPayment >= price) {
    return { error: 'Upfront payment must be less than vehicle price.' };
  }

  const { residualValue, residualPercent } = resolveResidualValues(price, residualType, rawResidual);

  if (residualType === 'percent' && rawResidual >= 100) {
    return { error: 'Residual percent must be less than 100.' };
  }

  if (residualValue > price) {
    return { error: 'Residual value cannot exceed vehicle price.' };
  }

  return {
    price,
    residualValue,
    residualPercent,
    residualType,
    termMonths,
    moneyFactor,
    upfrontPayment,
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

  const data = calculateLease({
    price: normalized.price,
    residualType: normalized.residualType,
    residualValue: normalized.residualValue,
    residualPercent: normalized.residualPercent,
    termMonths: normalized.termMonths,
    moneyFactor: normalized.moneyFactor,
    upfrontPayment: normalized.upfrontPayment,
  });

  const capCost = Math.max(0, data.price - data.upfrontPayment);
  const depreciationTotal = Math.max(0, capCost - data.residual);
  const recurringTotal = Math.max(0, data.totalLeaseCost - data.upfrontPayment);
  const financeTotal = Math.max(0, recurringTotal - depreciationTotal);

  const enriched = {
    ...data,
    capCost,
    depreciationTotal,
    financeTotal,
  };

  if (residualInput) {
    if (normalized.residualType === 'percent') {
      residualInput.value = normalized.residualPercent.toFixed(2);
    } else {
      residualInput.value = normalized.residualValue.toFixed(2);
    }
  }

  if (termInput) {
    const termUnit = getCurrentTermUnit();
    if (termUnit === 'years') {
      const yearsValue = clamp(enriched.termMonths / 12, 1, 6);
      termInput.value = Number.isInteger(yearsValue) ? String(yearsValue) : yearsValue.toFixed(1);
    } else {
      termInput.value = String(enriched.termMonths);
    }
  }

  syncDependentRanges();
  updateSliderDisplays();
  updatePreview(enriched);
  updateExplanation(enriched);
  renderMonthlyTable(enriched);
  renderYearlyTable(enriched);
  renderCostTable(enriched);
  applyView(scheduleView);
}

[priceInput, residualInput, termInput, factorInput, upfrontInput].forEach((input) => {
  input?.addEventListener('input', () => {
    if (input === priceInput || input === residualInput || input === upfrontInput) {
      syncDependentRanges();
    }
    updateSliderDisplays();
  });
});

viewMonthlyButton?.addEventListener('click', () => applyView('monthly'));
viewYearlyButton?.addEventListener('click', () => applyView('yearly'));
viewCostButton?.addEventListener('click', () => applyView('cost'));
calculateButton?.addEventListener('click', calculate);

lastResidualType = getCurrentResidualType();
lastTermUnit = getCurrentTermUnit();
handleResidualTypeChange(lastResidualType);
handleTermUnitChange(lastTermUnit);
syncDependentRanges();
updateSliderDisplays();
applyView('yearly');
calculate();
