import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import { setPageMetadata } from '/assets/js/core/ui.js';
import {
  calculateCreditCardPayoff,
  calculateMinimumPayment,
} from '/assets/js/core/credit-card-utils.js';
import { renderPayoffChart } from '/calculators/credit-card-calculators/credit-card-minimum-payment-calculator/minimum-payment-chart.js';

const balanceInput = document.querySelector('#cc-min-balance');
const aprInput = document.querySelector('#cc-min-apr');
const rateInput = document.querySelector('#cc-min-rate');
const floorInput = document.querySelector('#cc-min-floor');
const calculateButton = document.querySelector('#cc-min-calc');
const balanceDisplay = document.querySelector('#cc-min-balance-display');
const aprDisplay = document.querySelector('#cc-min-apr-display');
const rateDisplay = document.querySelector('#cc-min-rate-display');
const floorDisplay = document.querySelector('#cc-min-floor-display');

const errorMessage = document.querySelector('#cc-min-error');
const resultsList = document.querySelector('#cc-min-results-list');
const tableBody = document.querySelector('#cc-min-table-body');
const comparisonBody = document.querySelector('#cc-min-comparison-body');
const chartRoot = document.querySelector('#cc-min-chart');

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
      'Most issuers use this formula: minimum payment = the greater of (balance x minimum payment rate) or the payment floor. For example, on a $3,200 balance with a 2.5% minimum payment rate and a $25 floor, the percentage-based amount is $3,200 x 2.5% = $80, and since $80 is higher than the $25 floor, the minimum payment is $80. This calculator applies that same formula every month as your balance changes.',
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
  {
    question: 'Does this work for Capital One, Chase, Discover, Citi, or other specific card issuers?',
    answer:
      "Yes. The percentage-of-balance-plus-floor formula modeled here matches how most major issuers, including Capital One, Chase, Discover, Citi, American Express, Wells Fargo, and Bank of America, structure minimum payments. Check your card's terms for the exact percentage and floor amount, then enter those values for a precise estimate.",
  },
  {
    question: 'What is the minimum payment on a $5,000 credit card balance?',
    answer:
      "Using the same percentage-plus-floor formula, a $5,000 balance at a 2.5% minimum payment rate works out to $5,000 x 2.5% = $125, which is above a typical $25 floor, so the minimum payment would be about $125. On a smaller $1,000 balance, 2.5% of the balance is exactly $25, so the floor and the percentage amount are equal and the minimum payment is $25. On a larger $10,000 balance, 2.5% works out to $250. Your actual minimum payment depends on your card's specific rate and floor, so enter your own balance above for an exact figure.",
  },
  {
    question: 'How much will my minimum credit card payment be?',
    answer:
      'Multiply your balance by your card’s minimum payment rate, then compare that against your card’s floor and take whichever is larger. At a common 2.5% rate, a $3,200 balance gives $80, a $5,000 balance gives $125, and a $10,000 balance gives $250. If the percentage works out below the floor — typically $25 to $40 depending on the issuer — you pay the floor instead. Enter your own balance, rate, and floor above for an exact figure.',
  },
  {
    question: 'What is the average minimum payment on a credit card?',
    answer:
      'There is no single national figure, because the minimum depends on your balance and your card’s terms. In practice most US issuers use a percentage of the balance between 1% and 3%, combined with a fixed floor: Bank of America uses a $25 floor, Discover $35, and Chase $40. On a mid-sized balance the percentage almost always exceeds the floor, so the percentage is what you actually pay.',
  },
  {
    question: 'How much of my minimum payment goes to interest?',
    answer:
      'Most of it. On a $3,200 balance at 21.9% APR, the first month’s interest is about $58.40 while the minimum payment is $80 — so roughly 73% of that payment covers interest and only about $21.60 reduces what you actually owe. That ratio stays close to 73% as the balance falls, because the required payment shrinks alongside the balance, which is why the debt takes so long to clear.',
  },
  {
    question: 'Can you pay off a credit card by making only the minimum payment?',
    answer:
      'Yes, eventually, provided you stop adding new purchases — but it takes far longer than most people expect. A $3,200 balance at 21.9% APR clears in about 245 months, or roughly 20 years, and costs about $6,758 in interest. A $10,000 balance takes around 34 years. Minimum payments are designed to keep the account in good standing, not to clear the debt efficiently.',
  },
  {
    question: 'What is the minimum payment on a $10,000 credit card balance?',
    answer:
      'At a 2.5% minimum payment rate, the first minimum payment on $10,000 is $250. Paying only that amount at 21.9% APR takes about 413 months — roughly 34 years — and costs about $25,143 in interest, which is more than twice the original balance. Doubling the payment cuts that dramatically. See the balance table above for other amounts.',
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
  title: 'Credit Card Minimum Payment Calculator | Payoff Time & Interest',
  description:
    'Work out your credit card minimum payment, then see exactly how many years minimum-only payments take and what they cost in interest. Free, nothing stored.',
  canonical: 'https://calchowmuch.com/credit-card-calculators/credit-card-minimum-payment-calculator/',
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Credit Card Minimum Payment Calculator | Payoff Time & Interest',
        url: 'https://calchowmuch.com/credit-card-calculators/credit-card-minimum-payment-calculator/',
        description:
          'Work out your credit card minimum payment, then see exactly how many years minimum-only payments take and what they cost in interest. Free, nothing stored.',
        dateModified: '2026-08-26',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Credit Card Minimum Payment Calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
        url: 'https://calchowmuch.com/credit-card-calculators/credit-card-minimum-payment-calculator/',
        description:
          'Work out your credit card minimum payment, then see exactly how many years minimum-only payments take and what they cost in interest. Free, nothing stored.',
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
  setSpan('comparison-saved', '—');
  setSpan('comparison-sooner', '—');
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

// Minimum-only vs a fixed monthly payment. Reuses calculateCreditCardPayoff() from
// credit-card-utils.js so the comparison can never drift from the page's own engine.
function updateComparison(minimumData, values) {
  if (!comparisonBody) {
    return;
  }

  const fixedPayment = minimumData.firstPayment * 2;
  const fixed = calculateCreditCardPayoff({
    balance: values.balance,
    apr: values.apr,
    monthlyPayment: fixedPayment,
  });

  if (fixed.error) {
    comparisonBody.innerHTML = `<tr><td colspan="4">${fixed.error}</td></tr>`;
    setSpan('comparison-saved', '—');
    setSpan('comparison-sooner', '—');
    return;
  }

  renderPayoffChart(chartRoot, {
    minimum: minimumData,
    fixed,
    startBalance: values.balance,
  });

  const interestSaved = minimumData.totalInterest - fixed.totalInterest;
  const monthsSooner = minimumData.months - fixed.months;

  const rows = [
    {
      label: 'Minimum only',
      payment: minimumData.firstPayment,
      months: minimumData.months,
      interest: minimumData.totalInterest,
    },
    {
      label: 'Double the minimum',
      payment: fixedPayment,
      months: fixed.months,
      interest: fixed.totalInterest,
    },
  ];

  comparisonBody.innerHTML = rows
    .map(
      (row) => `
        <tr>
          <td>${row.label}</td>
          <td>${formatExplanationAmount(row.payment)}</td>
          <td>${formatNumber(row.months, { maximumFractionDigits: 0 })}</td>
          <td>${formatExplanationAmount(row.interest)}</td>
        </tr>
      `
    )
    .join('');

  setSpan('comparison-saved', formatExplanationAmount(Math.max(0, interestSaved)));
  setSpan(
    'comparison-sooner',
    `${formatNumber(Math.max(0, monthsSooner), { maximumFractionDigits: 0 })} months`
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
  calculate();
}

// Always computes and renders everything: the headline outcome, the snapshot rows, the
// explanation spans, the yearly table and the comparison. The panel is static - nothing is
// hidden behind the Calculate button, so the layout never changes shape.
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
  updateComparison(data, values);
}

calculateButton?.addEventListener('click', () => {
  calculate();
});

document.querySelectorAll('#calc-cc-min input').forEach((input) => {
  input.addEventListener('input', resetAfterInputChange);
});

(function initializeExplanation() {
  syncSliderUI();
  // Everything renders from the defaults on load. Before this ran, the page shipped 34 literal
  // em-dashes in its rendered body text.
  showPlaceholder();
  calculate();
})();
