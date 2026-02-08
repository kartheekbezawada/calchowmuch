import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import { setPageMetadata } from '/assets/js/core/ui.js';
import { calculateCreditCardPayoff } from '/assets/js/core/credit-card-utils.js';

const balanceInput = document.querySelector('#cc-payoff-balance');
const aprInput = document.querySelector('#cc-payoff-apr');
const paymentInput = document.querySelector('#cc-payoff-payment');
const extraInput = document.querySelector('#cc-payoff-extra');
const calculateButton = document.querySelector('#cc-payoff-calc');

const placeholder = document.querySelector('#cc-payoff-placeholder');
const errorMessage = document.querySelector('#cc-payoff-error');
const resultsList = document.querySelector('#cc-payoff-results-list');
const tableBody = document.querySelector('#cc-payoff-table-body');

const explanationSpans = Array.from(document.querySelectorAll('[data-cc-payoff]')).reduce(
  (acc, el) => {
    const key = el.dataset.ccPayoff;
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

const CALCULATOR_FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a credit card payoff calculator?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A credit card payoff calculator estimates how long it will take to pay off a credit card balance with a fixed monthly payment. It shows total interest paid, total amount paid, and a year-by-year breakdown of your payments.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is credit card interest calculated?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Credit card interest is typically calculated monthly. Your APR is divided by 12 to get the monthly rate. Each month, interest is charged on the remaining balance, so paying more reduces the balance faster and saves on interest.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long will it take to pay off my credit card?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The payoff time depends on your balance, APR, and monthly payment amount. This calculator computes the exact number of months by simulating each monthly payment and interest charge until the balance reaches zero.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if I only make the minimum payment?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Making only the minimum payment significantly extends your payoff time and increases total interest paid. Minimum payments typically start as a small percentage of your balance and decrease as the balance drops, which can result in decades of payments.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does an extra payment reduce my payoff time?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Extra payments go directly toward reducing your principal balance. Even a small extra amount each month reduces the balance faster, which means less interest accrues in subsequent months, creating a compounding savings effect.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is APR and how does it affect my balance?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'APR (Annual Percentage Rate) is the yearly interest rate charged on your outstanding balance. A higher APR means more interest each month, which slows down payoff and increases total cost. Even a small APR difference can add up to hundreds of dollars over time.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I pay off my credit card faster with biweekly payments?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'This calculator uses monthly payments. Biweekly payments effectively add one extra monthly payment per year, which can shorten payoff time. To estimate biweekly savings, divide your monthly payment by two and multiply by 26, then divide by 12 to get the equivalent monthly amount.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if my APR changes during repayment?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'This calculator assumes a fixed APR for the entire repayment period. If your APR changes due to a variable rate or promotional period ending, you can recalculate with the new rate to see the updated payoff timeline.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does this calculator account for new purchases?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. This calculator assumes no new purchases are added to the balance during repayment. Adding new charges increases your balance and extends the payoff time beyond what is shown here.',
      },
    },
    {
      '@type': 'Question',
      name: 'How accurate is this credit card payoff estimate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'This estimate is accurate for fixed payments on a static balance with a constant APR. Real-world results may vary if your APR changes, you make additional purchases, or you miss payments. Use it as a planning tool to understand the impact of your payment amount.',
      },
    },
  ],
};

const metadata = {
  title: 'Credit Card Repayment Calculator – Payoff Time & Interest',
  description:
    'Calculate how long it takes to pay off your credit card balance with fixed monthly payments. See total interest, payoff time, and yearly breakdown.',
  canonical: 'https://calchowmuch.com/loans/credit-card-repayment-payoff/',
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Credit Card Repayment Calculator',
        url: 'https://calchowmuch.com/loans/credit-card-repayment-payoff/',
        description:
          'Calculate how long it takes to pay off your credit card balance with fixed monthly payments. See total interest, payoff time, and yearly breakdown.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Credit Card Repayment Calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/loans/credit-card-repayment-payoff/',
        description:
          'Free credit card repayment calculator. Enter your balance, APR, and monthly payment to see payoff time, total interest, and yearly breakdown.',
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
            name: 'Credit Card Repayment Calculator',
            item: 'https://calchowmuch.com/loans/credit-card-repayment-payoff/',
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
  if (tableBody) {
    tableBody.innerHTML = '';
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
  if (tableBody) {
    tableBody.innerHTML = '';
  }
}

function addResultLine(text) {
  if (!resultsList) {
    return;
  }
  const line = document.createElement('div');
  line.className = 'result-line';
  line.textContent = text;
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
  setSpan('apr', formatPercent(data.apr));
  setSpan('payment', formatNumber(data.monthlyPayment));
  setSpan('extra', formatNumber(data.extraPayment));
  setSpan('months', formatNumber(data.months, { maximumFractionDigits: 0 }));
  setSpan('interest', formatNumber(data.totalInterest));
  setSpan('total', formatNumber(data.totalPayment));
}

function calculate() {
  const balance = Number(balanceInput?.value);
  const apr = Number(aprInput?.value);
  const monthlyPayment = Number(paymentInput?.value);
  const extraPayment = Number(extraInput?.value);

  const data = calculateCreditCardPayoff({
    balance,
    apr,
    monthlyPayment,
    extraPayment,
  });

  if (data.error) {
    showError(data.error);
    return;
  }

  if (resultsList) {
    resultsList.innerHTML = '';
  }

  addResultLine(`Payoff time: ${formatNumber(data.months, { maximumFractionDigits: 0 })} months`);
  addResultLine(`Total interest: ${formatNumber(data.totalInterest)}`);
  addResultLine(`Total paid: ${formatNumber(data.totalPayment)}`);
  addResultLine(`Monthly payment: ${formatNumber(data.monthlyPayment)}`);

  clearError();
  placeholder?.classList.add('is-hidden');
  resultsList?.classList.remove('is-hidden');

  updateTable(data.yearly);
  updateExplanation({ ...data, balance, apr, extraPayment });
}

calculateButton?.addEventListener('click', () => {
  hasCalculated = true;
  calculate();
});

const inputs = document.querySelectorAll('#calc-cc-payoff input');
inputs.forEach((input) => {
  input.addEventListener('input', () => resetIfCalculated());
});

// Pre-fill explanation pane with default values
(function prefillExplanation() {
  const balance = Number(balanceInput?.value);
  const apr = Number(aprInput?.value);
  const monthlyPayment = Number(paymentInput?.value);
  const extraPayment = Number(extraInput?.value);
  const data = calculateCreditCardPayoff({ balance, apr, monthlyPayment, extraPayment });
  if (!data.error) {
    updateTable(data.yearly);
    updateExplanation({ ...data, balance, apr, extraPayment });
  }
})();
