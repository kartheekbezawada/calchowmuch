import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import { setPageMetadata } from '/assets/js/core/ui.js';
import { calculateMinimumPayment } from '/assets/js/core/credit-card-utils.js';

const balanceInput = document.querySelector('#cc-min-balance');
const aprInput = document.querySelector('#cc-min-apr');
const rateInput = document.querySelector('#cc-min-rate');
const floorInput = document.querySelector('#cc-min-floor');
const calculateButton = document.querySelector('#cc-min-calc');
const balanceDisplay = document.querySelector('#cc-min-balance-display');
const aprDisplay = document.querySelector('#cc-min-apr-display');
const rateDisplay = document.querySelector('#cc-min-rate-display');
const floorDisplay = document.querySelector('#cc-min-floor-display');

const placeholder = document.querySelector('#cc-min-placeholder');
const errorMessage = document.querySelector('#cc-min-error');
const resultsList = document.querySelector('#cc-min-results-list');
const tableBody = document.querySelector('#cc-min-table-body');

const explanationSpans = Array.from(document.querySelectorAll('[data-cc-min]')).reduce(
  (acc, el) => {
    const key = el.dataset.ccMin;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(el);
    return acc;
  },
  {}
);

export const pageSchema = {
  calculatorFAQ: true,
  globalFAQ: false,
};

const FAQ_ITEMS = [
  {
    question: 'What is a credit card minimum payment?',
    answer:
      'A credit card minimum payment is the lowest amount your issuer requires each month to keep the account current and avoid late-payment penalties.',
  },
  {
    question: 'How is the minimum payment calculated?',
    answer:
      'Issuers commonly set the minimum as a percentage of your balance with a lowest monthly payment floor, and this calculator models that same structure month by month.',
  },
  {
    question: 'Why does it take so long to pay off with minimum payments?',
    answer:
      'Minimum payments usually decline as your balance drops, so less principal is reduced each month while interest keeps accruing.',
  },
  {
    question: 'What is the minimum payment trap?',
    answer:
      'The minimum payment trap is when declining required payments make balances last for years, causing much higher total interest costs.',
  },
  {
    question: 'How does the lowest monthly payment floor work?',
    answer:
      'The lowest monthly payment floor is a fixed dollar amount that sets the smallest allowed minimum payment even when the percentage-based amount becomes lower.',
  },
  {
    question: 'What happens if I pay more than the minimum?',
    answer:
      'Paying more than the minimum reduces principal faster, shortens payoff time, and lowers total interest compared with minimum-only payments.',
  },
  {
    question: 'Does the minimum payment rate vary by card issuer?',
    answer:
      'Yes. Issuers can use different minimum payment formulas, percentages, and lowest payment floors, so your monthly requirement can vary by card.',
  },
  {
    question: 'Can my minimum payment ever go up?',
    answer:
      'Yes. It can increase if your balance rises, your issuer changes terms, or fees and penalty APR adjustments apply.',
  },
  {
    question: 'Does this calculator include new purchases or fees?',
    answer:
      'No. This model assumes no new purchases and no additional fees during payoff so you can isolate the minimum-payment repayment path.',
  },
  {
    question: 'How can I estimate a faster payoff strategy?',
    answer:
      'Compare the minimum-only outcome with a higher fixed monthly payment and use the difference in months and interest to set a faster payoff target.',
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
  title: 'Credit Card Minimum Payment Calculator | Payoff Cost',
  description:
    'See how long minimum-only credit card payments take, what your first payment may be, and how much interest you could pay overall.',
  canonical: 'https://calchowmuch.com/credit-card-calculators/credit-card-minimum-payment-calculator/',
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Credit Card Minimum Payment Calculator | Payoff Cost',
        url: 'https://calchowmuch.com/credit-card-calculators/credit-card-minimum-payment-calculator/',
        description:
          'See how long minimum-only credit card payments take, what your first payment may be, and how much interest you could pay overall.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Credit Card Minimum Payment Calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
        url: 'https://calchowmuch.com/credit-card-calculators/credit-card-minimum-payment-calculator/',
        description:
          'Estimate payoff time, first payment size, and total interest when you only make minimum credit card payments.',
        browserRequirements: 'Requires JavaScript enabled',
        softwareVersion: '1.0',
        creator: {
          '@type': 'Organization',
          name: 'CalcHowMuch',
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
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
            name: 'Credit Card Calculators',
            item: 'https://calchowmuch.com/credit-card-calculators/',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Credit Card Minimum Payment Calculator',
            item: 'https://calchowmuch.com/credit-card-calculators/credit-card-minimum-payment-calculator/',
          },
        ],
      },
    ],
  },
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
};

setPageMetadata(metadata);

let hasCalculated = false;

function setSpan(key, value) {
  const nodes = explanationSpans[key] || [];
  nodes.forEach((node) => {
    node.textContent = value;
  });
}

function formatSliderAmount(value, fractionDigits = 0) {
  return formatNumber(value, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

function updateSliderFill(input) {
  if (!(input instanceof HTMLInputElement) || input.type !== 'range') {
    return;
  }

  const min = Number(input.min || 0);
  const max = Number(input.max || 100);
  const value = Number(input.value);

  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min || !Number.isFinite(value)) {
    input.style.setProperty('--fill', '50%');
    return;
  }

  const percentage = ((value - min) / (max - min)) * 100;
  input.style.setProperty('--fill', `${Math.min(100, Math.max(0, percentage))}%`);
}

function syncFloorMaxWithBalance() {
  if (!balanceInput || !floorInput) {
    return;
  }

  const balance = Number(balanceInput.value);
  const fallbackMax = Number(balanceInput.max || 0);
  const maxFloor = Number.isFinite(balance) && balance > 0 ? balance : fallbackMax;

  floorInput.max = String(maxFloor);

  const currentFloor = Number(floorInput.value);
  if (Number.isFinite(currentFloor) && currentFloor > maxFloor) {
    floorInput.value = String(maxFloor);
  }
}

function updateSliderDisplays() {
  const balance = Number(balanceInput?.value);
  const apr = Number(aprInput?.value);
  const rate = Number(rateInput?.value);
  const floor = Number(floorInput?.value);

  if (balanceDisplay) {
    balanceDisplay.textContent = Number.isFinite(balance) ? formatSliderAmount(balance, 0) : '—';
  }
  if (aprDisplay) {
    aprDisplay.textContent = Number.isFinite(apr) ? `${formatSliderAmount(apr, 1)}%` : '—';
  }
  if (rateDisplay) {
    rateDisplay.textContent = Number.isFinite(rate) ? `${formatSliderAmount(rate, 1)}%` : '—';
  }
  if (floorDisplay) {
    floorDisplay.textContent = Number.isFinite(floor) ? formatSliderAmount(floor, 0) : '—';
  }
}

function syncSliderUI() {
  syncFloorMaxWithBalance();
  updateSliderDisplays();
  [balanceInput, aprInput, rateInput, floorInput].forEach((input) => {
    if (input) {
      updateSliderFill(input);
    }
  });
}

function outcomeMarkup(months) {
  return `<span class="metric-label">Estimated Payoff</span><strong class="metric-value metric-value-flashy">${formatNumber(months, { maximumFractionDigits: 0 })}<span class="metric-unit">months</span></strong>`;
}

function formatExplanationAmount(value) {
  return formatNumber(value, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function setDerivedInputSpans({ balance, apr, minRate }) {
  const firstRatePayment =
    Number.isFinite(balance) && Number.isFinite(minRate) ? (balance * minRate) / 100 : NaN;
  const monthlyApr = Number.isFinite(apr) ? apr / 12 : NaN;

  setSpan(
    'first-rate-payment',
    Number.isFinite(firstRatePayment) && firstRatePayment >= 0
      ? formatExplanationAmount(firstRatePayment)
      : '—'
  );
  setSpan(
    'monthly-apr',
    Number.isFinite(monthlyApr) && monthlyApr >= 0
      ? formatPercent(monthlyApr, { maximumFractionDigits: 2 })
      : '—'
  );
}

function setInputSpans({ balance, apr, minRate, minPayment }) {
  setSpan('balance', Number.isFinite(balance) ? formatExplanationAmount(balance) : '—');
  setSpan('apr', Number.isFinite(apr) ? formatPercent(apr) : '—');
  setSpan(
    'rate',
    Number.isFinite(minRate) ? formatPercent(minRate, { maximumFractionDigits: 1 }) : '—'
  );
  setSpan('floor', Number.isFinite(minPayment) ? formatExplanationAmount(minPayment) : '—');
}

function setOutputPlaceholders() {
  setSpan('first-payment', '—');
  setSpan('months', '—');
  setSpan('years', '—');
  setSpan('interest', '—');
  setSpan('total', '—');
  setSpan('interest-multiple', '—');
}

function setOutputSpans(data, values) {
  const years = data.months / 12;
  const interestMultiple =
    Number.isFinite(values.balance) && values.balance > 0 ? data.totalPayment / values.balance : NaN;

  setSpan('first-payment', formatExplanationAmount(data.firstPayment));
  setSpan('months', `${formatNumber(data.months, { maximumFractionDigits: 0 })} months`);
  setSpan(
    'years',
    Number.isFinite(years)
      ? formatNumber(years, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
      : '—'
  );
  setSpan('interest', formatExplanationAmount(data.totalInterest));
  setSpan('total', formatExplanationAmount(data.totalPayment));
  setSpan(
    'interest-multiple',
    Number.isFinite(interestMultiple)
      ? `${formatNumber(interestMultiple, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}x`
      : '—'
  );
}

function renderTablePlaceholder() {
  if (!tableBody) {
    return;
  }
  tableBody.innerHTML =
    '<tr class="cc-min-table-placeholder-row"><td colspan="4">Run Calculate to populate yearly payoff rows.</td></tr>';
}

function updateTable(yearlyRows) {
  if (!tableBody) {
    return;
  }
  if (!Array.isArray(yearlyRows) || yearlyRows.length === 0) {
    renderTablePlaceholder();
    return;
  }

  tableBody.innerHTML = yearlyRows
    .map(
      (row) => `
        <tr>
          <td>${row.year}</td>
          <td>${formatExplanationAmount(row.payment)}</td>
          <td>${formatExplanationAmount(row.interest)}</td>
          <td>${formatExplanationAmount(row.balance)}</td>
        </tr>
      `
    )
    .join('');
}

function clearError() {
  if (!errorMessage) {
    return;
  }
  errorMessage.textContent = '';
  errorMessage.classList.add('is-hidden');
}

function showPlaceholder() {
  clearError();
  placeholder?.classList.remove('is-hidden');
  resultsList?.classList.add('is-hidden');

  if (resultsList) {
    resultsList.innerHTML = '';
  }

  renderTablePlaceholder();
}

function showError(message) {
  if (errorMessage) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('is-hidden');
  }

  placeholder?.classList.add('is-hidden');
  resultsList?.classList.add('is-hidden');

  if (resultsList) {
    resultsList.innerHTML = '';
  }

  renderTablePlaceholder();
}

function addResultLine(text) {
  if (!resultsList) {
    return;
  }
  const line = document.createElement('div');
  line.className = 'result-line result-metric';
  line.innerHTML = text;
  resultsList.appendChild(line);
}

function renderOutcomeCard(months) {
  if (resultsList) {
    resultsList.innerHTML = '';
  }
  addResultLine(outcomeMarkup(months));
  clearError();
  placeholder?.classList.add('is-hidden');
  resultsList?.classList.remove('is-hidden');
}

function readInputs() {
  syncFloorMaxWithBalance();
  return {
    balance: Number(balanceInput?.value),
    apr: Number(aprInput?.value),
    minRate: Number(rateInput?.value),
    minPayment: Number(floorInput?.value),
  };
}

function validateInputs(values) {
  if (!Number.isFinite(values.balance) || values.balance <= 0) {
    return 'Balance must be greater than 0.';
  }
  if (!Number.isFinite(values.apr) || values.apr < 0) {
    return 'APR must be 0 or higher.';
  }
  if (!Number.isFinite(values.minRate) || values.minRate < 0) {
    return 'Minimum payment rate must be 0 or higher.';
  }
  if (!Number.isFinite(values.minPayment) || values.minPayment < 0) {
    return 'Lowest monthly payment must be 0 or higher.';
  }
  return null;
}

function resetAfterInputChange() {
  syncSliderUI();
  clearError();
  if (!hasCalculated) {
    return;
  }
  calculate();
}

function calculate() {
  syncSliderUI();
  const values = readInputs();
  setInputSpans(values);

  const validationError = validateInputs(values);
  if (validationError) {
    setDerivedInputSpans({ balance: NaN, apr: NaN, minRate: NaN });
    setOutputPlaceholders();
    showError(validationError);
    return;
  }

  setDerivedInputSpans(values);
  const data = calculateMinimumPayment(values);
  if (data.error) {
    setDerivedInputSpans({ balance: NaN, apr: NaN, minRate: NaN });
    setOutputPlaceholders();
    showError(data.error);
    return;
  }

  renderOutcomeCard(data.months);
  updateTable(data.yearly);
  setOutputSpans(data, values);
}

calculateButton?.addEventListener('click', () => {
  hasCalculated = true;
  calculate();
});

document.querySelectorAll('#calc-cc-min input').forEach((input) => {
  input.addEventListener('input', resetAfterInputChange);
});

(function initializeExplanation() {
  syncSliderUI();
  setOutputPlaceholders();
  showPlaceholder();
})();
