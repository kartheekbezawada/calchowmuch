import { formatCurrency, formatNumber, formatPercent } from '/assets/js/core/format.js';
import { setPageMetadata } from '/assets/js/core/ui.js';
import { calculateConsolidation } from '/assets/js/core/credit-card-utils.js';

const balanceInput = document.querySelector('#cc-con-balance');
const currentAprInput = document.querySelector('#cc-con-apr');
const currentPaymentInput = document.querySelector('#cc-con-payment');
const consolidationAprInput = document.querySelector('#cc-con-new-apr');
const termInput = document.querySelector('#cc-con-term');
const feesInput = document.querySelector('#cc-con-fees');
const calculateButton = document.querySelector('#cc-con-calc');

const placeholder = document.querySelector('#cc-con-placeholder');
const errorMessage = document.querySelector('#cc-con-error');
const resultsList = document.querySelector('#cc-con-results-list');
const summaryDiv = document.querySelector('#cc-con-summary');
const tableBody = document.querySelector('#cc-con-table-body');

const explanationSpans = Array.from(document.querySelectorAll('[data-cc-con]')).reduce((acc, el) => {
  const key = el.dataset.ccCon;
  if (!acc[key]) {
    acc[key] = [];
  }
  acc[key].push(el);
  return acc;
}, {});

const INPUT_KEYS = [
  'balance',
  'current-apr',
  'current-payment',
  'new-apr',
  'new-term',
  'fees',
  'scenario-balance',
  'scenario-current-apr',
  'scenario-current-payment',
  'scenario-new-apr',
  'scenario-new-term',
  'scenario-fees',
];

const OUTPUT_KEYS = [
  'current-months',
  'new-payment',
  'interest-diff',
  'total-diff',
  'monthly-diff',
  'recommendation',
  'recommendation-detail',
  'current-interest',
  'current-total',
  'con-interest',
  'con-total',
  'con-months',
  'scenario-current-months',
  'scenario-new-payment',
  'scenario-interest-diff',
  'scenario-total-diff',
];

export const pageSchema = {
  calculatorFAQ: true,
  globalFAQ: false,
};

const FAQ_ITEMS = [
  {
    question: 'What is credit card debt consolidation?',
    answer:
      'Credit card debt consolidation combines multiple card balances into one loan with a fixed APR and repayment term so you can simplify payments and compare total cost.',
  },
  {
    question: 'How does a consolidation loan reduce interest costs?',
    answer:
      'If the consolidation APR is lower than your current card APR, a larger share of each payment goes to principal, which can reduce total interest.',
  },
  {
    question: 'When is consolidation not worth it?',
    answer:
      'Consolidation may not be worth it when fees are high, the new APR is not lower enough, or the new term is too long and increases total cost.',
  },
  {
    question: 'How are consolidation fees handled in the calculation?',
    answer:
      'Fees are added to the balance financed by the consolidation loan, which can raise monthly payment and total cost.',
  },
  {
    question: 'What APR can I expect for a consolidation loan?',
    answer:
      'APR depends on credit profile, lender policy, loan amount, and term. Compare multiple offers to estimate realistic rates.',
  },
  {
    question: 'Does consolidation affect my credit score?',
    answer:
      'It can. Opening a new loan and paying off cards may change utilization and account mix. Long-term impact depends on repayment behavior.',
  },
  {
    question: 'Can I consolidate cards with different APRs?',
    answer:
      'Yes. This calculator uses one average current APR input, so combine your card balances and use a reasonable weighted average APR.',
  },
  {
    question: 'What happens if I miss a payment on a consolidation loan?',
    answer:
      'Missing payments may trigger fees, possible APR changes, and credit-score damage, which can reduce or erase expected savings.',
  },
  {
    question: 'Does this calculator include origination fees?',
    answer:
      'Yes. Enter origination or setup fees in Consolidation Fees so the comparison reflects the full financed amount.',
  },
  {
    question: 'How do I compare consolidation vs. balance transfer?',
    answer:
      'Compare APR, fees, repayment term, and payoff discipline. Use both calculators and select the option with lower total paid and realistic monthly payment.',
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
  title: 'Credit Card Consolidation Calculator -- Compare & Save',
  description:
    'Compare paying credit cards separately vs consolidating into a fixed-rate loan. See monthly payment, interest savings, and total cost difference.',
  canonical: 'https://calchowmuch.com/loans/credit-card-consolidation/',
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Credit Card Consolidation Calculator',
        url: 'https://calchowmuch.com/loans/credit-card-consolidation/',
        description:
          'Compare paying credit cards separately vs consolidating into a fixed-rate loan. See monthly payment, interest savings, and total cost difference.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Credit Card Consolidation Calculator',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/loans/credit-card-consolidation/',
        description:
          'Free credit card consolidation calculator. Compare current card payoff against a consolidation loan including fees, monthly payment change, and total savings.',
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
            name: 'Credit Card Consolidation Calculator',
            item: 'https://calchowmuch.com/loans/credit-card-consolidation/',
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

function formatAmount(value) {
  return formatNumber(value, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatMonths(value) {
  return `${formatNumber(value, { maximumFractionDigits: 0 })} months`;
}

function formatSignedAmount(value) {
  if (!Number.isFinite(value)) {
    return '—';
  }
  if (Math.abs(value) < 0.005) {
    return '0.00';
  }
  const sign = value > 0 ? '+' : '-';
  return `${sign}${formatAmount(Math.abs(value))}`;
}

function readInputs() {
  return {
    balance: Number(balanceInput?.value),
    currentApr: Number(currentAprInput?.value),
    currentPayment: Number(currentPaymentInput?.value),
    consolidationApr: Number(consolidationAprInput?.value),
    termYears: Number(termInput?.value),
    fees: Number(feesInput?.value),
  };
}

function toCalcParams(values) {
  const termMonths = Math.max(1, Math.round(values.termYears * 12));
  return {
    params: {
      balance: values.balance,
      currentApr: values.currentApr,
      currentPayment: values.currentPayment,
      consolidationApr: values.consolidationApr,
      termMonths,
      fees: values.fees,
    },
    termMonths,
  };
}

function validateInputs(values) {
  if (!Number.isFinite(values.balance) || values.balance <= 0) {
    return 'Balance must be greater than 0.';
  }
  if (!Number.isFinite(values.currentApr) || values.currentApr < 0) {
    return 'Current APR must be 0 or higher.';
  }
  if (!Number.isFinite(values.currentPayment) || values.currentPayment <= 0) {
    return 'Current payment must be greater than 0.';
  }
  if (!Number.isFinite(values.consolidationApr) || values.consolidationApr < 0) {
    return 'Consolidation APR must be 0 or higher.';
  }
  if (!Number.isFinite(values.termYears) || values.termYears <= 0) {
    return 'Consolidation term must be greater than 0.';
  }
  if (!Number.isFinite(values.fees) || values.fees < 0) {
    return 'Consolidation fees must be 0 or higher.';
  }
  return null;
}

function clearError() {
  if (!errorMessage) {
    return;
  }
  errorMessage.textContent = '';
  errorMessage.classList.add('is-hidden');
}

function setOutputPlaceholders() {
  OUTPUT_KEYS.forEach((key) => setSpan(key, '—'));
}

function setInputSpans(values, termMonths) {
  const termLabel = formatMonths(termMonths);

  setSpan('balance', formatAmount(values.balance));
  setSpan('current-apr', formatPercent(values.currentApr));
  setSpan('current-payment', formatAmount(values.currentPayment));
  setSpan('new-apr', formatPercent(values.consolidationApr));
  setSpan('new-term', termLabel);
  setSpan('fees', formatAmount(values.fees));

  setSpan('scenario-balance', formatAmount(values.balance));
  setSpan('scenario-current-apr', formatPercent(values.currentApr));
  setSpan('scenario-current-payment', formatAmount(values.currentPayment));
  setSpan('scenario-new-apr', formatPercent(values.consolidationApr));
  setSpan('scenario-new-term', termLabel);
  setSpan('scenario-fees', formatAmount(values.fees));
}

function getRecommendation(data) {
  const totalDifference = data.totalDifference;
  const interestDifference = data.interestDifference;

  if (totalDifference > 0.005 && interestDifference > 0.005) {
    return {
      recommendation: 'saves money overall',
      detail: 'with lower total cost and lower interest.',
    };
  }

  if (totalDifference < -0.005 || interestDifference < -0.005) {
    return {
      recommendation: 'costs more overall',
      detail: 'because total cost and/or interest are higher.',
    };
  }

  return {
    recommendation: 'is close to break-even',
    detail: 'with minimal overall cost difference.',
  };
}

function setOutputSpans(data) {
  const recommendation = getRecommendation(data);

  setSpan('current-months', formatMonths(data.current.months));
  setSpan('new-payment', formatAmount(data.consolidation.monthlyPayment));
  setSpan('interest-diff', formatSignedAmount(data.interestDifference));
  setSpan('total-diff', formatSignedAmount(data.totalDifference));
  setSpan('monthly-diff', formatSignedAmount(data.monthlyDifference));
  setSpan('recommendation', recommendation.recommendation);
  setSpan('recommendation-detail', recommendation.detail);

  setSpan('current-interest', formatAmount(data.current.totalInterest));
  setSpan('current-total', formatAmount(data.current.totalPayment));
  setSpan('con-interest', formatAmount(data.consolidation.totalInterest));
  setSpan('con-total', formatAmount(data.consolidation.totalPayment));
  setSpan('con-months', formatMonths(data.consolidation.months));

  setSpan('scenario-current-months', formatMonths(data.current.months));
  setSpan('scenario-new-payment', formatAmount(data.consolidation.monthlyPayment));
  setSpan('scenario-interest-diff', formatSignedAmount(data.interestDifference));
  setSpan('scenario-total-diff', formatSignedAmount(data.totalDifference));
}

function renderTablePlaceholder() {
  if (!tableBody) {
    return;
  }
  tableBody.innerHTML =
    '<tr class="cc-con-table-placeholder-row"><td colspan="4">Run Calculate to populate comparison rows.</td></tr>';
}

function updateTable(data) {
  if (!tableBody) {
    return;
  }
  if (!data) {
    renderTablePlaceholder();
    return;
  }

  tableBody.innerHTML = `
    <tr>
      <td>Current Cards</td>
      <td>${formatMonths(data.current.months)}</td>
      <td>${formatAmount(data.current.totalInterest)}</td>
      <td>${formatAmount(data.current.totalPayment)}</td>
    </tr>
    <tr>
      <td>Consolidation</td>
      <td>${formatMonths(data.consolidation.months)}</td>
      <td>${formatAmount(data.consolidation.totalInterest)}</td>
      <td>${formatAmount(data.consolidation.totalPayment)}</td>
    </tr>
  `;
}

function showPlaceholder() {
  clearError();
  placeholder?.classList.remove('is-hidden');
  resultsList?.classList.add('is-hidden');
  summaryDiv?.classList.add('is-hidden');

  if (resultsList) {
    resultsList.innerHTML = '';
  }
  if (summaryDiv) {
    summaryDiv.innerHTML = '';
  }

  updateTable(null);
}

function showError(message) {
  if (errorMessage) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('is-hidden');
  }

  placeholder?.classList.add('is-hidden');
  resultsList?.classList.add('is-hidden');
  summaryDiv?.classList.add('is-hidden');

  if (resultsList) {
    resultsList.innerHTML = '';
  }
  if (summaryDiv) {
    summaryDiv.innerHTML = '';
  }

  setOutputPlaceholders();
  updateTable(null);
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

function calculate() {
  const values = readInputs();
  const validationError = validateInputs(values);
  if (validationError) {
    showError(validationError);
    return;
  }

  const { params, termMonths } = toCalcParams(values);
  const data = calculateConsolidation(params);
  if (data.error) {
    showError(data.error);
    return;
  }

  setInputSpans(values, termMonths);
  setOutputSpans(data);

  if (resultsList) {
    resultsList.innerHTML = '';
  }

  const monthlyDirection =
    data.monthlyDifference > 0.005
      ? 'lower'
      : data.monthlyDifference < -0.005
        ? 'higher'
        : 'unchanged';

  addResultLine(`Monthly payment change: ${formatSignedAmount(data.monthlyDifference)} (${monthlyDirection})`);
  addResultLine(`Current payoff time: ${formatMonths(data.current.months)}`);

  if (summaryDiv) {
    summaryDiv.innerHTML =
      `<p><strong>Interest difference:</strong> ${formatSignedAmount(data.interestDifference)}</p>` +
      `<p><strong>Total cost difference:</strong> ${formatSignedAmount(data.totalDifference)}</p>` +
      `<p><strong>Consolidation payment:</strong> ${formatCurrency(data.consolidation.monthlyPayment)}</p>`;
  }

  clearError();
  placeholder?.classList.add('is-hidden');
  resultsList?.classList.remove('is-hidden');
  summaryDiv?.classList.remove('is-hidden');

  updateTable(data);
}

function resetAfterInputChange() {
  if (!hasCalculated) {
    return;
  }

  setOutputPlaceholders();
  showPlaceholder();
}

calculateButton?.addEventListener('click', () => {
  hasCalculated = true;
  calculate();
});

document.querySelectorAll('#calc-cc-con input').forEach((input) => {
  input.addEventListener('input', resetAfterInputChange);
});

(function initializeExplanation() {
  const values = readInputs();
  const validationError = validateInputs(values);

  setOutputPlaceholders();
  placeholder?.classList.remove('is-hidden');
  resultsList?.classList.add('is-hidden');
  summaryDiv?.classList.add('is-hidden');

  if (resultsList) {
    resultsList.innerHTML = '';
  }
  if (summaryDiv) {
    summaryDiv.innerHTML = '';
  }

  if (validationError) {
    INPUT_KEYS.forEach((key) => setSpan(key, '—'));
    updateTable(null);
    return;
  }

  const { params, termMonths } = toCalcParams(values);
  const data = calculateConsolidation(params);
  if (data.error) {
    INPUT_KEYS.forEach((key) => setSpan(key, '—'));
    updateTable(null);
    return;
  }

  setInputSpans(values, termMonths);
  setOutputSpans(data);
  updateTable(data);
})();
