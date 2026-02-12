import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import { setPageMetadata } from '/assets/js/core/ui.js';
import { calculateConsolidation } from '/assets/js/core/credit-card-utils.js';

const balanceInput = document.querySelector('#cc-con-balance');
const currentAprInput = document.querySelector('#cc-con-apr');
const currentPaymentInput = document.querySelector('#cc-con-payment');
const consolidationAprInput = document.querySelector('#cc-con-new-apr');
const termInput = document.querySelector('#cc-con-term');
const feesInput = document.querySelector('#cc-con-fees');
const calculateButton = document.querySelector('#cc-con-calc');

const resultDiv = document.querySelector('#cc-con-result');
const summaryDiv = document.querySelector('#cc-con-summary');

const balanceDisplay = document.querySelector('#cc-con-balance-display');
const currentAprDisplay = document.querySelector('#cc-con-apr-display');
const newAprDisplay = document.querySelector('#cc-con-new-apr-display');
const termDisplay = document.querySelector('#cc-con-term-display');

const monthlyTableBody = document.querySelector('#cc-con-table-monthly-body');
const yearlyTableBody = document.querySelector('#cc-con-table-yearly-body');
const monthlyTableWrap = document.querySelector('#cc-con-table-monthly-wrap');
const yearlyTableWrap = document.querySelector('#cc-con-table-yearly-wrap');
const viewMonthlyButton = document.querySelector('#cc-con-view-monthly');
const viewYearlyButton = document.querySelector('#cc-con-view-yearly');

const explanationSpans = Array.from(document.querySelectorAll('[data-cc-con]')).reduce((acc, el) => {
  const key = el.dataset.ccCon;
  if (!acc[key]) {
    acc[key] = [];
  }
  acc[key].push(el);
  return acc;
}, {});

const INPUT_KEYS = ['balance', 'current-apr', 'current-payment', 'new-apr', 'new-term', 'fees'];

const OUTPUT_KEYS = [
  'current-months',
  'con-months',
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
  'principal-share',
  'interest-share',
  'total-paid',
  'total-principal',
  'total-interest',
  'lifetime-summary',
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

let currentData = null;
let lastValidData = null;
let scheduleView = 'yearly';
let lastValidMonthlyPayment = null;

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

function formatRateLabel(value) {
  const safeValue = Number(value);
  if (!Number.isFinite(safeValue)) {
    return '—';
  }
  return `${formatNumber(safeValue, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  })}%`;
}

function deriveTermMonths(termYears) {
  return Math.max(1, Math.round(termYears * 12));
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
  const termMonths = deriveTermMonths(values.termYears);
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

function resolveScenario(values) {
  const validationError = validateInputs(values);
  if (validationError) {
    return { data: null, error: validationError };
  }

  const { params } = toCalcParams(values);
  const data = calculateConsolidation(params);
  if (data.error) {
    return { data: null, error: data.error };
  }
  return { data, error: null };
}

function cacheScenarioData(data) {
  if (!data) {
    return;
  }
  lastValidData = data;
  currentData = data;
  lastValidMonthlyPayment = data.consolidation.monthlyPayment;
}

function renderMonthlyPaymentValue(value, options = {}) {
  if (!resultDiv) {
    return;
  }

  const shouldAnimate = Boolean(options.animate);
  const safeValue = Number.isFinite(value) ? value : 0;

  resultDiv.innerHTML =
    '<strong>Monthly Consolidation Payment</strong>' +
    `<span class="cc-con-result-value">${formatAmount(safeValue)}</span>`;

  if (!shouldAnimate) {
    return;
  }

  const resultValue = resultDiv.querySelector('.cc-con-result-value');
  if (!resultValue) {
    return;
  }

  resultValue.classList.remove('is-updated');
  void resultValue.offsetWidth;
  resultValue.classList.add('is-updated');
}

function refreshLiveMonthlyPayment(value, options = {}) {
  renderMonthlyPaymentValue(value ?? lastValidMonthlyPayment, options);
}

function setInputSpans(values) {
  const entries = {
    balance: Number.isFinite(values.balance) ? formatAmount(values.balance) : '—',
    'current-apr': Number.isFinite(values.currentApr) ? formatPercent(values.currentApr) : '—',
    'current-payment': Number.isFinite(values.currentPayment)
      ? formatAmount(values.currentPayment)
      : '—',
    'new-apr': Number.isFinite(values.consolidationApr) ? formatPercent(values.consolidationApr) : '—',
    'new-term': Number.isFinite(values.termYears) ? formatMonths(deriveTermMonths(values.termYears)) : '—',
    fees: Number.isFinite(values.fees) ? formatAmount(values.fees) : '—',
  };

  INPUT_KEYS.forEach((key) => {
    setSpan(key, entries[key] ?? '—');
  });
}

function setOutputPlaceholders() {
  OUTPUT_KEYS.forEach((key) => setSpan(key, '—'));

  const donut = (explanationSpans['lifetime-donut'] || [])[0];
  if (donut) {
    donut.style.setProperty('--principal-share', '0%');
  }
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

function aggregateYearlySchedule(schedule) {
  const yearly = [];
  schedule.forEach((entry) => {
    const yearIndex = Math.ceil(entry.month / 12) - 1;
    if (!yearly[yearIndex]) {
      yearly[yearIndex] = {
        year: yearIndex + 1,
        payment: 0,
        principal: 0,
        interest: 0,
        balance: entry.balance,
      };
    }
    const record = yearly[yearIndex];
    record.payment += entry.payment;
    record.principal += entry.principal;
    record.interest += entry.interest;
    record.balance = entry.balance;
  });

  return yearly.filter(Boolean);
}

function renderMonthlyPlaceholder() {
  if (!monthlyTableBody) {
    return;
  }
  monthlyTableBody.innerHTML =
    '<tr class="cc-con-table-placeholder-row"><td colspan="5">Run Calculate to populate monthly rows.</td></tr>';
}

function renderYearlyPlaceholder() {
  if (!yearlyTableBody) {
    return;
  }
  yearlyTableBody.innerHTML =
    '<tr class="cc-con-table-placeholder-row"><td colspan="5">Run Calculate to populate yearly rows.</td></tr>';
}

function clearTableOutputs() {
  renderMonthlyPlaceholder();
  renderYearlyPlaceholder();
}

function renderMonthlyTable(schedule) {
  if (!monthlyTableBody) {
    return;
  }

  if (!schedule?.length) {
    renderMonthlyPlaceholder();
    return;
  }

  monthlyTableBody.innerHTML = schedule
    .map(
      (entry) =>
        `<tr>
          <td>${entry.month}</td>
          <td>${formatAmount(entry.payment)}</td>
          <td>${formatAmount(entry.principal)}</td>
          <td>${formatAmount(entry.interest)}</td>
          <td>${formatAmount(entry.balance)}</td>
        </tr>`
    )
    .join('');
}

function renderYearlyTable(yearly) {
  if (!yearlyTableBody) {
    return;
  }

  if (!yearly?.length) {
    renderYearlyPlaceholder();
    return;
  }

  yearlyTableBody.innerHTML = yearly
    .map(
      (entry) =>
        `<tr>
          <td>${entry.year}</td>
          <td>${formatAmount(entry.payment)}</td>
          <td>${formatAmount(entry.principal)}</td>
          <td>${formatAmount(entry.interest)}</td>
          <td>${formatAmount(entry.balance)}</td>
        </tr>`
    )
    .join('');
}

function applyView(view) {
  const isMonthly = view === 'monthly';
  monthlyTableWrap?.classList.toggle('is-hidden', !isMonthly);
  yearlyTableWrap?.classList.toggle('is-hidden', isMonthly);

  viewMonthlyButton?.classList.toggle('is-active', isMonthly);
  viewYearlyButton?.classList.toggle('is-active', !isMonthly);
}

function setOutputSpans(data) {
  const recommendation = getRecommendation(data);

  setSpan('current-months', formatMonths(data.current.months));
  setSpan('con-months', formatMonths(data.consolidation.months));
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

  setSpan('total-paid', formatAmount(data.consolidation.totalPayment));
  setSpan('total-principal', formatAmount(data.consolidation.balance));
  setSpan('total-interest', formatAmount(data.consolidation.totalInterest));

  const totalPayment = data.consolidation.totalPayment;
  const principalShare = totalPayment > 0 ? (data.consolidation.balance / totalPayment) * 100 : 0;
  const clampedPrincipalShare = Math.min(100, Math.max(0, principalShare));
  const interestShare = Math.max(0, 100 - clampedPrincipalShare);

  const donut = (explanationSpans['lifetime-donut'] || [])[0];
  if (donut) {
    donut.style.setProperty('--principal-share', `${clampedPrincipalShare}%`);
  }

  setSpan(
    'principal-share',
    `${formatNumber(clampedPrincipalShare, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })}%`
  );
  setSpan(
    'interest-share',
    `${formatNumber(interestShare, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })}%`
  );

  setSpan(
    'lifetime-summary',
    `Consolidation totals ${formatAmount(data.consolidation.totalPayment)} paid, including ${formatAmount(
      data.consolidation.totalInterest
    )} interest. Compared with current cards, total difference is ${formatSignedAmount(
      data.totalDifference
    )}.`
  );
}

function setError(message) {
  refreshLiveMonthlyPayment(lastValidMonthlyPayment);
  if (summaryDiv) {
    summaryDiv.innerHTML = `<p class="form-error">${message}</p>`;
  }
}

function renderPreviewSummary(data) {
  if (!summaryDiv) {
    return;
  }

  const monthlyDirection =
    data.monthlyDifference > 0.005 ? 'lower' : data.monthlyDifference < -0.005 ? 'higher' : 'about the same';

  summaryDiv.innerHTML =
    `<p><strong>Current payoff:</strong> ${formatMonths(data.current.months)}.</p>` +
    `<p><strong>Consolidation payoff:</strong> ${formatMonths(data.consolidation.months)}.</p>` +
    `<p><strong>Monthly change:</strong> ${formatSignedAmount(data.monthlyDifference)} (${monthlyDirection}).</p>`;
}

function renderLiveScenario(data, options = {}) {
  if (!data) {
    return;
  }

  cacheScenarioData(data);
  setOutputSpans(data);
  renderMonthlyTable(data.consolidation.schedule);
  const yearly = aggregateYearlySchedule(data.consolidation.schedule);
  renderYearlyTable(yearly);
  refreshLiveMonthlyPayment(data.consolidation.monthlyPayment, {
    animate: Boolean(options.animatePayment),
  });
  renderPreviewSummary(data);
  applyView(scheduleView);
}

function calculate(options = {}) {
  const { animatePayment = true } = options;
  const values = readInputs();
  setInputSpans(values);
  const { data, error } = resolveScenario(values);

  if (error) {
    setError(error);
    return false;
  }

  renderLiveScenario(data, { animatePayment });
  return true;
}

function handleLiveInputChange() {
  const values = readInputs();
  setInputSpans(values);
  const { data, error } = resolveScenario(values);
  if (data) {
    renderLiveScenario(data, { animatePayment: false });
    return;
  }
  if (error) {
    setError(error);
  }
}

function updateSliderFill(input) {
  if (!input || input.type !== 'range') {
    return;
  }
  const min = parseFloat(input.min) || 0;
  const max = parseFloat(input.max) || 100;
  const value = parseFloat(input.value) || 0;
  const pct = ((value - min) / (max - min)) * 100;
  input.style.setProperty('--fill', `${pct}%`);
}

function updateSliderDisplays() {
  if (balanceInput && balanceDisplay) {
    balanceDisplay.textContent = formatNumber(Number(balanceInput.value), {
      maximumFractionDigits: 0,
    });
    updateSliderFill(balanceInput);
  }

  if (currentAprInput && currentAprDisplay) {
    currentAprDisplay.textContent = formatRateLabel(currentAprInput.value);
    updateSliderFill(currentAprInput);
  }

  if (consolidationAprInput && newAprDisplay) {
    newAprDisplay.textContent = formatRateLabel(consolidationAprInput.value);
    updateSliderFill(consolidationAprInput);
  }

  if (termInput && termDisplay) {
    termDisplay.textContent = `${termInput.value} yrs`;
    updateSliderFill(termInput);
  }
}

calculateButton?.addEventListener('click', () => {
  calculate({ animatePayment: true });
});

viewMonthlyButton?.addEventListener('click', () => {
  if (!currentData || scheduleView === 'monthly') {
    return;
  }
  scheduleView = 'monthly';
  applyView(scheduleView);
});

viewYearlyButton?.addEventListener('click', () => {
  if (!currentData || scheduleView === 'yearly') {
    return;
  }
  scheduleView = 'yearly';
  applyView(scheduleView);
});

const allInputs = Array.from(document.querySelectorAll('#calc-cc-con input'));
allInputs.forEach((input) => {
  input.addEventListener('input', () => {
    updateSliderDisplays();
    handleLiveInputChange();
  });
});

updateSliderDisplays();
const initialValues = readInputs();
setInputSpans(initialValues);
const initialScenario = resolveScenario(initialValues);
if (initialScenario.data) {
  renderLiveScenario(initialScenario.data, { animatePayment: false });
} else {
  setOutputPlaceholders();
  clearTableOutputs();
  refreshLiveMonthlyPayment(0);
  applyView(scheduleView);
  if (initialScenario.error) {
    setError(initialScenario.error);
  }
}
