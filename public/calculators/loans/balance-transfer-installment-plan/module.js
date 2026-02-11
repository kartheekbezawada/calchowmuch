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

const placeholder = document.querySelector('#cc-bt-placeholder');
const errorMessage = document.querySelector('#cc-bt-error');
const resultsList = document.querySelector('#cc-bt-results-list');
const tableBody = document.querySelector('#cc-bt-table-body');

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

const CALCULATOR_FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a credit card balance transfer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A balance transfer moves your existing credit card debt from one card to another, typically to take advantage of a lower interest rate or a promotional 0% APR period. The goal is to reduce interest charges and pay off the balance faster.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does a balance transfer fee work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most balance transfer cards charge a one-time fee, usually 3-5% of the transferred amount. This fee is added to your new card balance immediately. For example, transferring $6,000 with a 3% fee adds $180, making your starting balance $6,180.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is a promotional APR period?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A promotional APR period is a limited time during which your transferred balance accrues interest at a reduced rate, often 0%. This period typically lasts 6 to 21 months, depending on the card offer. During this time, your payments go primarily toward reducing the principal.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens after the promo APR expires?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Once the promotional period ends, any remaining balance begins accruing interest at the card's regular (post-promo) APR. This rate is typically much higher than the promo rate, which can significantly increase your monthly interest charges and extend payoff time.",
      },
    },
    {
      '@type': 'Question',
      name: 'Is a balance transfer worth the fee?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A balance transfer is worth it if the interest savings during the promo period exceed the transfer fee. Use this calculator to compare the total cost with and without the transfer. Generally, the longer the promo period and the higher your current APR, the more you save.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I calculate if I can pay off before the promo ends?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Divide your starting balance (including the transfer fee) by the number of promo months. If the result is less than or equal to your monthly payment, you can pay off before the promo expires and avoid post-promo interest entirely.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I transfer a balance between cards from the same issuer?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most card issuers do not allow balance transfers between their own cards. You typically need to transfer to a card from a different issuer. Check the terms and conditions of the offer before applying.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does this calculator account for new purchases on the transfer card?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. This calculator assumes no new purchases are made on the transfer card during repayment. New purchases may accrue interest at a different rate and can complicate your payoff plan.',
      },
    },
    {
      '@type': 'Question',
      name: 'What APR applies to the remaining balance after the promo period?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The post-promo APR (also called the go-to rate or regular APR) applies to any remaining balance once the promotional period ends. This rate is specified in your card agreement and is typically between 15% and 25%.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I compare multiple balance transfer offers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Run this calculator for each offer using its specific transfer fee, promo APR, promo period, and post-promo APR. Compare the total paid and total interest for each scenario to find the offer that costs you the least overall.',
      },
    },
  ],
};

const metadata = {
  title: 'Balance Transfer Calculator – Savings with Promo APR & Fees',
  description:
    'Calculate your balance transfer savings including transfer fees, promo APR periods, and post-promo rates. See total cost and payoff timeline.',
  canonical: 'https://calchowmuch.com/loans/balance-transfer-installment-plan/',
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Balance Transfer Calculator',
        url: 'https://calchowmuch.com/loans/balance-transfer-installment-plan/',
        description:
          'Calculate your balance transfer savings including transfer fees, promo APR periods, and post-promo rates. See total cost and payoff timeline.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Balance Transfer Calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/loans/balance-transfer-installment-plan/',
        description:
          'Free balance transfer calculator. Enter your balance, transfer fee, promo APR, and post-promo rate to see payoff time, total interest, and savings.',
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
            name: 'Credit Cards',
            item: 'https://calchowmuch.com/loans/credit-card-repayment-payoff/',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Balance Transfer Calculator',
            item: 'https://calchowmuch.com/loans/balance-transfer-installment-plan/',
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

function resetIfCalculated() {
  if (hasCalculated && !resultsList?.classList.contains('is-hidden')) {
    showPlaceholder();
  }
}

function showPlaceholder() {
  clearError();
  placeholder?.classList.remove('is-hidden');
  resultsList?.classList.add('is-hidden');
  if (resultsList) {
    resultsList.innerHTML = '';
  }
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

function updateTable(yearly) {
  if (!tableBody) {
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

function updateExplanation(data) {
  setSpan('balance', formatNumber(data.balance));
  setSpan('fee', formatPercent(data.transferFeePercent));
  setSpan('fee-amount', formatNumber(data.fee));
  setSpan('starting-balance', formatNumber(data.startingBalance));
  setSpan('promo-apr', formatPercent(data.promoApr));
  setSpan('promo-months', formatNumber(data.promoMonths, { maximumFractionDigits: 0 }));
  setSpan('post-apr', formatPercent(data.postApr));
  setSpan('payment', formatNumber(data.monthlyPayment));
  setSpan('months', formatNumber(data.months, { maximumFractionDigits: 0 }));
  setSpan('interest', formatNumber(data.totalInterest));
  setSpan('fees', formatNumber(data.fee));
}

function calculate() {
  const balance = Number(balanceInput?.value);
  const transferFeePercent = Number(feeInput?.value);
  const promoApr = Number(promoAprInput?.value);
  const promoMonths = Number(promoMonthsInput?.value);
  const postApr = Number(postAprInput?.value);
  const monthlyPayment = Number(paymentInput?.value);

  const data = calculateBalanceTransfer({
    balance,
    transferFeePercent,
    promoApr,
    promoMonths,
    postApr,
    monthlyPayment,
  });

  if (data.error) {
    showError(data.error);
    return;
  }

  if (resultsList) {
    resultsList.innerHTML = '';
  }

  addResultLine(
    `<span class="metric-label">Estimated Payoff</span><strong class="metric-value">${formatNumber(data.months, { maximumFractionDigits: 0 })} months</strong>`
  );
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

  updateTable(data.yearly);
  updateExplanation({
    ...data,
    balance,
    transferFeePercent,
    promoApr,
    promoMonths,
    postApr,
    monthlyPayment,
  });
}

calculateButton?.addEventListener('click', () => {
  hasCalculated = true;
  calculate();
});

const inputs = document.querySelectorAll('#calc-cc-balance-transfer input');
inputs.forEach((input) => {
  input.addEventListener('input', () => resetIfCalculated());
});

// Show projected outcome immediately for the default scenario on first load.
(function initializeDefaultOutcome() {
  hasCalculated = true;
  calculate();
})();
