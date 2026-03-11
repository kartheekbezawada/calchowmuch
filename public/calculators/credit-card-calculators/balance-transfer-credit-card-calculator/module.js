import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import { setPageMetadata } from '/assets/js/core/ui.js';
import { calculateBalanceTransfer } from '/assets/js/core/credit-card-utils.js';

const balanceInput = document.querySelector('#cc-bt-balance');
const feeInput = document.querySelector('#cc-bt-fee');
const promoAprInput = document.querySelector('#cc-bt-promo-apr');
const promoMonthsInput = document.querySelector('#cc-bt-promo-months');
const postAprInput = document.querySelector('#cc-bt-post-apr');
const paymentInput = document.querySelector('#cc-bt-payment');
const calculateButton = document.querySelector('#cc-bt-calc');

const balanceDisplay = document.querySelector('#cc-bt-balance-display');
const feeDisplay = document.querySelector('#cc-bt-fee-display');
const promoAprDisplay = document.querySelector('#cc-bt-promo-apr-display');
const promoMonthsDisplay = document.querySelector('#cc-bt-promo-months-display');
const postAprDisplay = document.querySelector('#cc-bt-post-apr-display');
const paymentDisplay = document.querySelector('#cc-bt-payment-display');

const placeholder = document.querySelector('#cc-bt-placeholder');
const errorMessage = document.querySelector('#cc-bt-error');
const resultsList = document.querySelector('#cc-bt-results-list');
const tableBody = document.querySelector('#cc-bt-table-body');
const summaryNote = document.querySelector('#cc-bt-summary');

const explanationSpans = Array.from(document.querySelectorAll('[data-cc-bt]')).reduce((acc, el) => {
  const key = el.dataset.ccBt;
  if (!acc[key]) {
    acc[key] = [];
  }
  acc[key].push(el);
  return acc;
}, {});

export const pageSchema = {
  calculatorFAQ: true,
  globalFAQ: false,
};

const FAQ_ITEMS = [
  {
    question: 'What is a credit card balance transfer?',
    answer:
      'A balance transfer moves your existing credit card debt from one card to another, typically to take advantage of a lower interest rate or a promotional 0% APR period. The goal is to reduce interest charges and pay off the balance faster.',
  },
  {
    question: 'How does a balance transfer fee work?',
    answer:
      'Most balance transfer cards charge a one-time fee, usually 3-5% of the transferred amount. This fee is added to your new card balance immediately. For example, transferring $6,000 with a 3% fee adds $180, making your starting balance $6,180.',
  },
  {
    question: 'What is a promotional APR period?',
    answer:
      'A promotional APR period is a limited time during which your transferred balance accrues interest at a reduced rate, often 0%. This period typically lasts 6 to 21 months, depending on the card offer. During this time, your payments go primarily toward reducing the principal.',
  },
  {
    question: 'What happens after the promo APR expires?',
    answer:
      "Once the promotional period ends, any remaining balance begins accruing interest at the card's regular (post-promo) APR. This rate is typically much higher than the promo rate, which can significantly increase your monthly interest charges and extend payoff time.",
  },
  {
    question: 'Is a balance transfer worth the fee?',
    answer:
      'A balance transfer is worth it if the interest savings during the promo period exceed the transfer fee. Use this calculator to compare the total cost with and without the transfer. Generally, the longer the promo period and the higher your current APR, the more you save.',
  },
  {
    question: 'How do I calculate if I can pay off before the promo ends?',
    answer:
      'Divide your starting balance (including the transfer fee) by the number of promo months. If the result is less than or equal to your monthly payment, you can pay off before the promo expires and avoid post-promo interest entirely.',
  },
  {
    question: 'Can I transfer a balance between cards from the same issuer?',
    answer:
      'Most card issuers do not allow balance transfers between their own cards. You typically need to transfer to a card from a different issuer. Check the terms and conditions of the offer before applying.',
  },
  {
    question: 'Does this calculator account for new purchases on the transfer card?',
    answer:
      'No. This calculator assumes no new purchases are made on the transfer card during repayment. New purchases may accrue interest at a different rate and can complicate your payoff plan.',
  },
  {
    question: 'What APR applies to the remaining balance after the promo period?',
    answer:
      'The post-promo APR (also called the go-to rate or regular APR) applies to any remaining balance once the promotional period ends. This rate is specified in your card agreement and is typically between 15% and 25%.',
  },
  {
    question: 'How do I compare multiple balance transfer offers?',
    answer:
      'Run this calculator for each offer using its specific transfer fee, promo APR, promo period, and post-promo APR. Compare the total paid and total interest for each scenario to find the offer that costs you the least overall.',
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
  title: 'Balance Transfer Calculator | Fees, Promo APR & Savings',
  description:
    'Compare transfer fee, promo months, post-promo APR, payoff time, and total cost to see whether a balance transfer saves money.',
  canonical: 'https://calchowmuch.com/credit-card-calculators/balance-transfer-credit-card-calculator/',
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Balance Transfer Calculator | Fees, Promo APR & Savings',
        url: 'https://calchowmuch.com/credit-card-calculators/balance-transfer-credit-card-calculator/',
        description:
          'Compare transfer fee, promo months, post-promo APR, payoff time, and total cost to see whether a balance transfer saves money.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Balance Transfer Credit Card Calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Any',
        url: 'https://calchowmuch.com/credit-card-calculators/balance-transfer-credit-card-calculator/',
        description:
          'Estimate balance transfer savings after promo APR, transfer fees, post-promo rate, and monthly payment are all included.',
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
            name: 'Balance Transfer Credit Card Calculator',
            item: 'https://calchowmuch.com/credit-card-calculators/balance-transfer-credit-card-calculator/',
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

function updateSliderDisplays() {
  const balance = Number(balanceInput?.value);
  const fee = Number(feeInput?.value);
  const promoApr = Number(promoAprInput?.value);
  const promoMonths = Number(promoMonthsInput?.value);
  const postApr = Number(postAprInput?.value);
  const payment = Number(paymentInput?.value);

  if (balanceDisplay) {
    balanceDisplay.textContent = Number.isFinite(balance) ? formatSliderAmount(balance, 0) : '—';
  }
  if (feeDisplay) {
    feeDisplay.textContent = Number.isFinite(fee) ? `${formatSliderAmount(fee, 1)}%` : '—';
  }
  if (promoAprDisplay) {
    promoAprDisplay.textContent = Number.isFinite(promoApr)
      ? `${formatSliderAmount(promoApr, 1)}%`
      : '—';
  }
  if (promoMonthsDisplay) {
    promoMonthsDisplay.textContent = Number.isFinite(promoMonths)
      ? `${formatSliderAmount(promoMonths, 0)} mo`
      : '—';
  }
  if (postAprDisplay) {
    postAprDisplay.textContent = Number.isFinite(postApr)
      ? `${formatSliderAmount(postApr, 1)}%`
      : '—';
  }
  if (paymentDisplay) {
    paymentDisplay.textContent = Number.isFinite(payment) ? formatSliderAmount(payment, 0) : '—';
  }
}

function syncSliderUI() {
  updateSliderDisplays();
  [balanceInput, feeInput, promoAprInput, promoMonthsInput, postAprInput, paymentInput].forEach(
    (input) => {
      if (input) {
        updateSliderFill(input);
      }
    }
  );
}

function readInputs() {
  return {
    balance: Number(balanceInput?.value),
    transferFeePercent: Number(feeInput?.value),
    promoApr: Number(promoAprInput?.value),
    promoMonths: Number(promoMonthsInput?.value),
    postApr: Number(postAprInput?.value),
    monthlyPayment: Number(paymentInput?.value),
  };
}

function setInputSpans(values) {
  setSpan('balance', formatNumber(values.balance));
  setSpan('fee', formatPercent(values.transferFeePercent, { maximumFractionDigits: 1 }));
  const feeAmount = (values.balance * Math.max(0, values.transferFeePercent)) / 100;
  setSpan('fee-amount', formatNumber(feeAmount));
  setSpan('starting-balance', formatNumber(values.balance + feeAmount));
  setSpan('promo-apr', formatPercent(values.promoApr, { maximumFractionDigits: 1 }));
  setSpan(
    'promo-months',
    `${formatNumber(values.promoMonths, { maximumFractionDigits: 0 })} months`
  );
  setSpan('post-apr', formatPercent(values.postApr, { maximumFractionDigits: 1 }));
  setSpan('payment', formatNumber(values.monthlyPayment));
}

function setOutputPlaceholders() {
  setSpan('months', '—');
  setSpan('interest', '—');
  setSpan('total-paid', '—');
}

function setOutputSpans(data) {
  setSpan('months', `${formatNumber(data.months, { maximumFractionDigits: 0 })} months`);
  setSpan('interest', formatNumber(data.totalInterest));
  setSpan('total-paid', formatNumber(data.totalPayment));
  setSpan('fee-amount', formatNumber(data.fee));
  setSpan('starting-balance', formatNumber(data.startingBalance));
}

function clearError() {
  if (errorMessage) {
    errorMessage.textContent = '';
    errorMessage.classList.add('is-hidden');
  }
}

function showError(message) {
  if (!errorMessage) {
    return;
  }
  errorMessage.textContent = message;
  errorMessage.classList.remove('is-hidden');
  placeholder?.classList.add('is-hidden');
  resultsList?.classList.add('is-hidden');
  if (resultsList) {
    resultsList.innerHTML = '';
  }
  if (summaryNote) {
    summaryNote.textContent =
      'Adjust inputs and recalculate to see a valid balance-transfer scenario.';
  }
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

function outcomeMarkup(months) {
  return `<span class="metric-label">Estimated Payoff</span><strong class="metric-value metric-value-flashy">${formatNumber(months, { maximumFractionDigits: 0 })}<span class="metric-unit">months</span></strong>`;
}

function updateTable(yearly) {
  if (!tableBody) {
    return;
  }

  if (!Array.isArray(yearly) || yearly.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="4">Run Calculate to populate yearly payoff rows.</td></tr>';
    return;
  }

  tableBody.innerHTML = yearly
    .map(
      (row) => `
        <tr>
          <td>${row.year}</td>
          <td>${formatNumber(row.payment)}</td>
          <td>${formatNumber(row.interest)}</td>
          <td>${formatNumber(row.balance)}</td>
        </tr>
      `
    )
    .join('');
}

function updateSummaryNote(data, values) {
  if (!summaryNote) {
    return;
  }

  if (data.months <= values.promoMonths) {
    summaryNote.textContent =
      'You are projected to clear the transfer during the promo window, limiting interest drag after the offer ends.';
    return;
  }

  summaryNote.textContent =
    'The balance extends past promo months, so post-promo APR meaningfully affects the total cost. Consider raising monthly payment to reduce carryover.';
}

function renderResults(data) {
  if (resultsList) {
    resultsList.innerHTML = '';
  }

  addResultLine(outcomeMarkup(data.months));
  addResultLine(
    `<span class="metric-label">Total Paid</span><strong class="metric-value">${formatNumber(data.totalPayment)}</strong>`
  );
  addResultLine(
    `<span class="metric-label">Total Interest</span><strong class="metric-value">${formatNumber(data.totalInterest)}</strong>`
  );
  addResultLine(
    `<span class="metric-label">Total Fees</span><strong class="metric-value">${formatNumber(data.fee)}</strong>`
  );
  addResultLine(
    `<span class="metric-label">Starting Balance</span><strong class="metric-value">${formatNumber(data.startingBalance)}</strong>`
  );

  clearError();
  placeholder?.classList.add('is-hidden');
  resultsList?.classList.remove('is-hidden');
}

function calculate() {
  syncSliderUI();
  const values = readInputs();
  setInputSpans(values);

  const data = calculateBalanceTransfer(values);
  if (data.error) {
    setOutputPlaceholders();
    showError(data.error);
    updateTable([]);
    return;
  }

  renderResults(data);
  updateTable(data.yearly);
  setOutputSpans(data);
  updateSummaryNote(data, values);
}

calculateButton?.addEventListener('click', () => {
  calculate();
});

document.querySelectorAll('#calc-cc-bt input').forEach((input) => {
  input.addEventListener('input', calculate);
});

(function initializeDefaultOutcome() {
  calculate();
})();
