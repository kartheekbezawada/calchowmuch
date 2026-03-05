import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import { setPageMetadata, setupButtonGroup } from '/assets/js/core/ui.js';
import { calculateHirePurchase } from '/assets/js/core/auto-loan-utils.js';

const priceInput = document.querySelector('#hp-price');
const depositInput = document.querySelector('#hp-deposit');
const aprInput = document.querySelector('#hp-apr');
const termInput = document.querySelector('#hp-term');
const balloonInput = document.querySelector('#hp-balloon');
const calculateButton = document.querySelector('#hp-calc');
const resultDiv = document.querySelector('#hp-result');
const summaryDiv = document.querySelector('#hp-summary');

const termLabel = document.querySelector('#hp-term-label');
const termUnitGroup = document.querySelector('[data-button-group="hp-term-unit"]');

const priceDisplay = document.querySelector('#hp-price-display');
const depositDisplay = document.querySelector('#hp-deposit-display');
const aprDisplay = document.querySelector('#hp-apr-display');
const termDisplay = document.querySelector('#hp-term-display');
const balloonDisplay = document.querySelector('#hp-balloon-display');

const viewMonthlyButton = document.querySelector('#hp-view-monthly');
const viewYearlyButton = document.querySelector('#hp-view-yearly');
const monthlyTableWrap = document.querySelector('#hp-table-monthly-wrap');
const yearlyTableWrap = document.querySelector('#hp-table-yearly-wrap');
const monthlyTableBody = document.querySelector('#hp-table-monthly-body');
const yearlyTableBody = document.querySelector('#hp-table-yearly-body');

const explanationSpans = Array.from(document.querySelectorAll('[data-hp]')).reduce((acc, el) => {
  const key = el.dataset.hp;
  if (!acc[key]) {
    acc[key] = [];
  }
  acc[key].push(el);
  return acc;
}, {});

let scheduleView = 'yearly';
let lastTermUnit = 'years';

const FAQ_ITEMS = [
  {
    question: 'How does a hire purchase calculator estimate monthly payment?',
    answer:
      'It uses financed amount, APR, term, and final balloon to estimate equal monthly installments.',
  },
  {
    question: 'What is amount financed in hire purchase?',
    answer: 'Amount financed is vehicle price minus deposit before interest is applied.',
  },
  {
    question: 'How does a balloon payment affect monthly installments?',
    answer:
      'A larger balloon usually lowers monthly installments but leaves more principal due at the end.',
  },
  {
    question: 'Can balloon payment be higher than financed amount?',
    answer: 'No. Balloon is capped at the financed amount in this calculator.',
  },
  {
    question: 'Why does a longer term reduce monthly payment?',
    answer:
      'Longer terms spread repayment across more months, but can increase total interest paid.',
  },
  {
    question: 'Can I switch between years and months for term input?',
    answer: 'Yes. Use the term unit toggle to enter duration in years or months.',
  },
  {
    question: 'Does changing input values recalculate automatically?',
    answer: 'No. Results update when you click the Calculate Hire Purchase button.',
  },
  {
    question: 'What does total payable include?',
    answer:
      'Total payable includes deposit, all monthly installments, and the final balloon payment.',
  },
  {
    question: 'Is this suitable for comparing different deposit scenarios?',
    answer:
      'Yes. Adjust deposit and recalculate to compare installment and total payable tradeoffs.',
  },
  {
    question: 'Are these lender-specific repayments?',
    answer: 'No. These are fixed-rate estimates and may differ from lender disclosures and fees.',
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
      '@id': 'https://calchowmuch.com/car-loan-calculators/hire-purchase-calculator/#webpage',
      url: 'https://calchowmuch.com/car-loan-calculators/hire-purchase-calculator/',
      name: 'Hire Purchase Calculator – Monthly Payment & Total Cost | CalcHowMuch',
      description:
        'Estimate hire purchase monthly payments, interest cost, and total payable amount for vehicle financing.',
      isPartOf: {
        '@type': 'WebSite',
        '@id': 'https://calchowmuch.com/#website',
        name: 'CalcHowMuch',
        url: 'https://calchowmuch.com/',
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: 'https://calchowmuch.com/assets/og/default.png',
      },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://calchowmuch.com/car-loan-calculators/hire-purchase-calculator/#app',
      name: 'Hire Purchase Calculator',
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Any',
      url: 'https://calchowmuch.com/car-loan-calculators/hire-purchase-calculator/',
      description:
        'Estimate hire purchase monthly payments, interest cost, and total payable amount for vehicle financing.',
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
          name: 'Hire Purchase Calculator',
          item: 'https://calchowmuch.com/car-loan-calculators/hire-purchase-calculator/',
        },
      ],
    },
    CALCULATOR_FAQ_SCHEMA,
  ],
};

const metadata = {
  title: 'Hire Purchase Calculator – Monthly Payment & Total Cost | CalcHowMuch',
  description:
    'Estimate hire purchase monthly payments, interest cost, and total payable amount. Compare financing options before buying a vehicle.',
  canonical: 'https://calchowmuch.com/car-loan-calculators/hire-purchase-calculator/',
  structuredData: CALCULATOR_STRUCTURED_DATA,
};

setPageMetadata(metadata);

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

function syncDependentRanges() {
  const price = Number(priceInput?.value);
  const nextPrice = Number.isFinite(price) ? Math.max(0, price) : 0;

  if (depositInput) {
    depositInput.max = String(nextPrice);
    const deposit = Number(depositInput.value);
    if (Number.isFinite(deposit) && deposit > nextPrice) {
      depositInput.value = String(nextPrice);
    }
  }

  const deposit = Number(depositInput?.value);
  const nextDeposit = Number.isFinite(deposit) ? Math.max(0, deposit) : 0;
  const financed = Math.max(0, nextPrice - nextDeposit);

  if (balloonInput) {
    balloonInput.max = String(financed);
    const balloon = Number(balloonInput.value);
    if (Number.isFinite(balloon) && balloon > financed) {
      balloonInput.value = String(financed);
    }
  }
}

function updateSliderDisplays() {
  const termUnit = getCurrentTermUnit();

  if (priceDisplay && priceInput) {
    priceDisplay.textContent = formatValue(Number(priceInput.value));
  }
  if (depositDisplay && depositInput) {
    depositDisplay.textContent = formatValue(Number(depositInput.value));
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
  if (balloonDisplay && balloonInput) {
    balloonDisplay.textContent = formatValue(Number(balloonInput.value));
  }

  [priceInput, depositInput, aprInput, termInput, balloonInput].forEach(setSliderFill);
}

function handleTermUnitChange(unit) {
  if (!termInput) {
    return;
  }

  const previousUnit = lastTermUnit;
  const rawValue = Number(termInput.value);
  const validRawValue =
    Number.isFinite(rawValue) && rawValue > 0 ? rawValue : previousUnit === 'years' ? 4 : 48;
  const currentMonths =
    previousUnit === 'years' ? Math.round(validRawValue * 12) : Math.round(validRawValue);

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

function buildTermText(termMonths) {
  const years = termMonths / 12;
  return `${formatValue(years, { maximumFractionDigits: 1 })} years (${formatValue(termMonths, {
    maximumFractionDigits: 0,
  })} months)`;
}

function updatePreview(data, termMonths) {
  if (resultDiv) {
    resultDiv.innerHTML = `<span class="mtg-result-value is-updated">${formatValue(data.monthlyPayment)}</span>`;

    const valueEl = resultDiv.querySelector('.mtg-result-value');
    if (valueEl) {
      setTimeout(() => valueEl.classList.remove('is-updated'), 420);
    }
  }

  if (summaryDiv) {
    summaryDiv.innerHTML =
      `<p><strong>Amount Financed:</strong> ${formatValue(data.financed)}</p>` +
      `<p><strong>Total Interest:</strong> ${formatValue(data.totalInterest)}</p>` +
      `<p><strong>Total Payable:</strong> ${formatValue(data.totalPayable)}</p>`;
  }

  const depositPercent = data.price > 0 ? (data.deposit / data.price) * 100 : 0;

  setSpan('price', formatValue(data.price));
  setSpan('deposit', formatValue(data.deposit));
  setSpan('deposit-percent', formatPercent(depositPercent));
  setSpan('financed', formatValue(data.financed));
  setSpan('apr', formatPercent(data.apr));
  setSpan('term', buildTermText(termMonths));
  setSpan('balloon', formatValue(data.balloon));
  setSpan('monthly-payment', formatValue(data.monthlyPayment));
  setSpan('total-interest', formatValue(data.totalInterest));
  setSpan('total-payable', formatValue(data.totalPayable));
}

function updateExplanation(data) {
  const totalPayable = Math.max(0, data.totalPayable);
  const principalShare = totalPayable > 0 ? (data.price / totalPayable) * 100 : 0;
  const clampedPrincipalShare = Math.min(100, Math.max(0, principalShare));
  const interestShare = Math.max(0, 100 - clampedPrincipalShare);

  const donut = (explanationSpans['lifetime-donut'] || [])[0];
  if (donut) {
    donut.style.setProperty('--principal-share', `${clampedPrincipalShare}%`);
  }

  setSpan(
    'principal-share',
    `${formatValue(clampedPrincipalShare, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })}%`
  );
  setSpan(
    'interest-share',
    `${formatValue(interestShare, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })}%`
  );
  setSpan('amount-financed-total', formatValue(data.financed));
  setSpan('final-balloon-total', formatValue(data.balloon));

  setSpan(
    'lifetime-summary',
    `You finance ${formatValue(data.financed)} with a balloon of ${formatValue(data.balloon)} and pay ${formatValue(data.totalInterest)} in interest overall.`
  );
}

function calculate() {
  if (!resultDiv || !summaryDiv) {
    return;
  }

  resultDiv.textContent = '';
  summaryDiv.textContent = '';
  clearOutputs();

  syncDependentRanges();

  const price = Number(priceInput?.value);
  const deposit = Number(depositInput?.value);
  const apr = Number(aprInput?.value);
  const termMonths = resolveTermMonths();
  const balloon = Number(balloonInput?.value);

  if (!Number.isFinite(price) || price <= 0) {
    setError('Vehicle price must be greater than 0.');
    return;
  }
  if (!Number.isFinite(deposit) || deposit < 0) {
    setError('Deposit must be 0 or more.');
    return;
  }
  if (deposit >= price) {
    setError('Deposit must be less than vehicle price.');
    return;
  }
  if (!Number.isFinite(apr) || apr < 0) {
    setError('APR must be 0 or more.');
    return;
  }
  if (!Number.isFinite(termMonths) || termMonths < 1) {
    setError('Loan term must be at least 1 month.');
    return;
  }
  if (!Number.isFinite(balloon) || balloon < 0) {
    setError('Final balloon must be 0 or more.');
    return;
  }

  const financed = price - deposit;
  if (balloon > financed) {
    setError('Final balloon cannot exceed amount financed.');
    return;
  }

  const data = calculateHirePurchase({
    price,
    deposit,
    apr,
    termMonths,
    balloon,
  });

  if (balloonInput) {
    balloonInput.value = String(Math.round(data.balloon));
  }

  syncDependentRanges();
  updateSliderDisplays();
  updatePreview(data, termMonths);
  updateExplanation(data);
  renderMonthlyTable(data.schedule);
  renderYearlyTable(data.yearly);
  applyView(scheduleView);
}

[priceInput, depositInput, aprInput, termInput, balloonInput].forEach((input) => {
  input?.addEventListener('input', () => {
    if (input === priceInput || input === depositInput || input === balloonInput) {
      syncDependentRanges();
    }
    updateSliderDisplays();
  });
});

viewMonthlyButton?.addEventListener('click', () => applyView('monthly'));
viewYearlyButton?.addEventListener('click', () => applyView('yearly'));
calculateButton?.addEventListener('click', calculate);

lastTermUnit = getCurrentTermUnit();
handleTermUnitChange(lastTermUnit);
syncDependentRanges();
updateSliderDisplays();
applyView('yearly');
calculate();
