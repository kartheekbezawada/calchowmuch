import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import { setPageMetadata } from '/assets/js/core/ui.js';
import { calculateMultipleCarLoan } from '/assets/js/core/auto-loan-utils.js';

const loanAAmountInput = document.querySelector('#multi-loan-a-amount');
const loanAAprInput = document.querySelector('#multi-loan-a-apr');
const loanATermInput = document.querySelector('#multi-loan-a-term');
const loanBAmountInput = document.querySelector('#multi-loan-b-amount');
const loanBAprInput = document.querySelector('#multi-loan-b-apr');
const loanBTermInput = document.querySelector('#multi-loan-b-term');

const loanAAmountDisplay = document.querySelector('#multi-loan-a-amount-display');
const loanAAprDisplay = document.querySelector('#multi-loan-a-apr-display');
const loanATermDisplay = document.querySelector('#multi-loan-a-term-display');
const loanBAmountDisplay = document.querySelector('#multi-loan-b-amount-display');
const loanBAprDisplay = document.querySelector('#multi-loan-b-apr-display');
const loanBTermDisplay = document.querySelector('#multi-loan-b-term-display');

const calculateButton = document.querySelector('#multi-loan-calc');
const resultDiv = document.querySelector('#multi-loan-result');
const summaryDiv = document.querySelector('#multi-loan-summary');

const viewMonthlyButton = document.querySelector('#multi-view-monthly');
const viewYearlyButton = document.querySelector('#multi-view-yearly');
const monthlyTableWrap = document.querySelector('#multi-table-monthly-wrap');
const yearlyTableWrap = document.querySelector('#multi-table-yearly-wrap');
const monthlyTableBody = document.querySelector('#multi-table-monthly-body');
const yearlyTableBody = document.querySelector('#multi-table-yearly-body');

const comparisonTableBody = document.querySelector('#multi-loan-table-body');
const comparisonCombinedPayment = document.querySelector('#multi-loan-combined-payment');
const comparisonCombinedInterest = document.querySelector('#multi-loan-combined-interest');
const comparisonCombinedTotal = document.querySelector('#multi-loan-combined-total');

const explanationSpans = Array.from(document.querySelectorAll('[data-multi]')).reduce((acc, el) => {
  const key = el.dataset.multi;
  if (!acc[key]) {
    acc[key] = [];
  }
  acc[key].push(el);
  return acc;
}, {});

let scheduleView = 'yearly';

export const pageSchema = {
  calculatorFAQ: true,
  globalFAQ: false,
};

const FAQ_ITEMS = [
  {
    question: 'What does this multiple car loan calculator compare?',
    answer:
      'It compares two auto loans at once and shows each payment, each total interest, and the combined repayment totals.',
  },
  {
    question: 'How is the combined monthly payment calculated?',
    answer: 'It adds Loan A monthly payment and Loan B monthly payment for each month.',
  },
  {
    question: 'How is combined total interest calculated?',
    answer: 'It adds total interest from both amortization schedules across their full terms.',
  },
  {
    question: 'Can the two loans have different terms and APRs?',
    answer: 'Yes. Each loan has independent amount, APR, and term inputs.',
  },
  {
    question: 'What does payoff horizon mean in this view?',
    answer:
      'Payoff horizon is the longer of the two loan terms, which is when the combined balance reaches zero.',
  },
  {
    question: 'Why does the monthly total drop later in the schedule?',
    answer:
      'If one loan ends earlier, only the remaining loan payment is left for later months.',
  },
  {
    question: 'Does this include taxes, fees, or insurance?',
    answer:
      'No. This calculator models principal and interest only for each loan using fixed-rate amortization.',
  },
  {
    question: 'Can this help decide whether to refinance one loan?',
    answer:
      'Yes. You can change one loan APR or term and compare the new combined totals against the previous scenario.',
  },
  {
    question: 'Is this result lender-specific?',
    answer:
      'No. It is a general estimate using fixed-rate math, so exact lender disclosures may differ.',
  },
  {
    question: 'Can I view monthly and yearly payoff summaries?',
    answer:
      'Yes. Use the table toggle to switch between detailed monthly rows and yearly rollup rows.',
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
  title: 'Multiple Car Loan Calculator - Compare Two Auto Loans',
  description:
    'Compare two car loans side by side and estimate combined monthly payment, total interest, and total paid with amortization views and FAQs.',
  canonical: 'https://calchowmuch.com/loans/multiple-car-loan/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
};

setPageMetadata(metadata);

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

function updateSliderDisplays() {
  if (loanAAmountDisplay && loanAAmountInput) {
    loanAAmountDisplay.textContent = formatValue(Number(loanAAmountInput.value));
  }
  if (loanAAprDisplay && loanAAprInput) {
    loanAAprDisplay.textContent = formatPercent(Number(loanAAprInput.value));
  }
  if (loanATermDisplay && loanATermInput) {
    loanATermDisplay.textContent = `${formatValue(Number(loanATermInput.value), { maximumFractionDigits: 0 })} yrs`;
  }
  if (loanBAmountDisplay && loanBAmountInput) {
    loanBAmountDisplay.textContent = formatValue(Number(loanBAmountInput.value));
  }
  if (loanBAprDisplay && loanBAprInput) {
    loanBAprDisplay.textContent = formatPercent(Number(loanBAprInput.value));
  }
  if (loanBTermDisplay && loanBTermInput) {
    loanBTermDisplay.textContent = `${formatValue(Number(loanBTermInput.value), { maximumFractionDigits: 0 })} yrs`;
  }

  [
    loanAAmountInput,
    loanAAprInput,
    loanATermInput,
    loanBAmountInput,
    loanBAprInput,
    loanBTermInput,
  ].forEach(setSliderFill);
}

function clearOutputs() {
  if (comparisonTableBody) {
    comparisonTableBody.innerHTML = '';
  }
  if (monthlyTableBody) {
    monthlyTableBody.innerHTML = '';
  }
  if (yearlyTableBody) {
    yearlyTableBody.innerHTML = '';
  }
  if (comparisonCombinedPayment) {
    comparisonCombinedPayment.textContent = '—';
  }
  if (comparisonCombinedInterest) {
    comparisonCombinedInterest.textContent = '—';
  }
  if (comparisonCombinedTotal) {
    comparisonCombinedTotal.textContent = '—';
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

function buildCombinedSchedule(data) {
  const scheduleA = data.loanA.schedule || [];
  const scheduleB = data.loanB.schedule || [];
  const maxMonths = Math.max(scheduleA.length, scheduleB.length);

  const monthly = [];
  for (let index = 0; index < maxMonths; index += 1) {
    const rowA = scheduleA[index] || {
      payment: 0,
      principal: 0,
      interest: 0,
      balance: 0,
    };
    const rowB = scheduleB[index] || {
      payment: 0,
      principal: 0,
      interest: 0,
      balance: 0,
    };

    monthly.push({
      month: index + 1,
      payment: rowA.payment + rowB.payment,
      principal: rowA.principal + rowB.principal,
      interest: rowA.interest + rowB.interest,
      balance: rowA.balance + rowB.balance,
    });
  }

  const yearly = [];
  monthly.forEach((entry) => {
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
    yearly[yearIndex].payment += entry.payment;
    yearly[yearIndex].principal += entry.principal;
    yearly[yearIndex].interest += entry.interest;
    yearly[yearIndex].balance = entry.balance;
  });

  return {
    monthly,
    yearly: yearly.filter(Boolean),
  };
}

function renderComparisonTable(data) {
  if (comparisonTableBody) {
    comparisonTableBody.innerHTML = `
      <tr>
        <th scope="row">Loan A</th>
        <td>${formatValue(data.loanA.monthlyPayment)}</td>
        <td>${formatValue(data.loanA.totalInterest)}</td>
        <td>${formatValue(data.loanA.totalPayment)}</td>
      </tr>
      <tr>
        <th scope="row">Loan B</th>
        <td>${formatValue(data.loanB.monthlyPayment)}</td>
        <td>${formatValue(data.loanB.totalInterest)}</td>
        <td>${formatValue(data.loanB.totalPayment)}</td>
      </tr>
    `;
  }

  if (comparisonCombinedPayment) {
    comparisonCombinedPayment.textContent = formatValue(data.combined.monthlyPayment);
  }
  if (comparisonCombinedInterest) {
    comparisonCombinedInterest.textContent = formatValue(data.combined.totalInterest);
  }
  if (comparisonCombinedTotal) {
    comparisonCombinedTotal.textContent = formatValue(data.combined.totalPayment);
  }
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
          <td>${formatValue(entry.principal)}</td>
          <td>${formatValue(entry.interest)}</td>
          <td>${formatValue(entry.balance)}</td>
        </tr>
      `
    )
    .join('');
}

function updatePreview(data, combinedSchedule) {
  if (resultDiv) {
    resultDiv.innerHTML = `<span class="mtg-result-value is-updated">${formatValue(data.combined.monthlyPayment)}</span>`;

    const valueEl = resultDiv.querySelector('.mtg-result-value');
    if (valueEl) {
      setTimeout(() => valueEl.classList.remove('is-updated'), 420);
    }
  }

  if (summaryDiv) {
    summaryDiv.innerHTML =
      `<p><strong>Total Interest:</strong> ${formatValue(data.combined.totalInterest)}</p>` +
      `<p><strong>Total Payment:</strong> ${formatValue(data.combined.totalPayment)}</p>` +
      `<p><strong>Payoff Horizon:</strong> ${formatValue(combinedSchedule.monthly.length, {
        maximumFractionDigits: 0,
      })} months</p>`;
  }

  setSpan('loan-a-payment', formatValue(data.loanA.monthlyPayment));
  setSpan('loan-b-payment', formatValue(data.loanB.monthlyPayment));
  setSpan('combined-payment', formatValue(data.combined.monthlyPayment));
  setSpan('loan-a-interest', formatValue(data.loanA.totalInterest));
  setSpan('loan-b-interest', formatValue(data.loanB.totalInterest));
  setSpan('combined-interest', formatValue(data.combined.totalInterest));
  setSpan('combined-total', formatValue(data.combined.totalPayment));
  setSpan(
    'payoff-horizon',
    `${formatValue(combinedSchedule.monthly.length, { maximumFractionDigits: 0 })} months`
  );

  setSpan('loan-a-amount', formatValue(data.loanA.amount));
  setSpan('loan-a-apr', formatPercent(data.loanA.apr));
  setSpan(
    'loan-a-term',
    `${formatValue(data.loanA.termYears, { maximumFractionDigits: 0 })} years`
  );
  setSpan('loan-b-amount', formatValue(data.loanB.amount));
  setSpan('loan-b-apr', formatPercent(data.loanB.apr));
  setSpan(
    'loan-b-term',
    `${formatValue(data.loanB.termYears, { maximumFractionDigits: 0 })} years`
  );
}

function updateExplanation(data) {
  const totalPrincipal = data.loanA.amount + data.loanB.amount;
  const totalPayment = data.combined.totalPayment;
  const principalShare = totalPayment > 0 ? (totalPrincipal / totalPayment) * 100 : 0;
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

  setSpan('loan-a-principal', formatValue(data.loanA.amount));
  setSpan('loan-b-principal', formatValue(data.loanB.amount));
  setSpan('total-interest', formatValue(data.combined.totalInterest));
  setSpan('total-payment', formatValue(data.combined.totalPayment));

  setSpan(
    'lifetime-summary',
    `Combined principal is ${formatValue(totalPrincipal)} and total interest is ${formatValue(
      data.combined.totalInterest
    )} across both loans.`
  );
}

function validateInputs(loanA, loanB) {
  if (!Number.isFinite(loanA.amount) || loanA.amount <= 0) {
    return 'Loan A amount must be greater than 0.';
  }
  if (!Number.isFinite(loanA.apr) || loanA.apr < 0) {
    return 'Loan A APR must be 0 or more.';
  }
  if (!Number.isFinite(loanA.termYears) || loanA.termYears < 1) {
    return 'Loan A term must be at least 1 year.';
  }
  if (!Number.isFinite(loanB.amount) || loanB.amount <= 0) {
    return 'Loan B amount must be greater than 0.';
  }
  if (!Number.isFinite(loanB.apr) || loanB.apr < 0) {
    return 'Loan B APR must be 0 or more.';
  }
  if (!Number.isFinite(loanB.termYears) || loanB.termYears < 1) {
    return 'Loan B term must be at least 1 year.';
  }
  return null;
}

function calculate() {
  if (!resultDiv || !summaryDiv) {
    return;
  }

  resultDiv.textContent = '';
  summaryDiv.textContent = '';
  clearOutputs();

  const loanA = {
    amount: Number(loanAAmountInput?.value),
    apr: Number(loanAAprInput?.value),
    termYears: Number(loanATermInput?.value),
  };

  const loanB = {
    amount: Number(loanBAmountInput?.value),
    apr: Number(loanBAprInput?.value),
    termYears: Number(loanBTermInput?.value),
  };

  const validationError = validateInputs(loanA, loanB);
  if (validationError) {
    setError(validationError);
    return;
  }

  const data = calculateMultipleCarLoan({ loanA, loanB });
  const combinedSchedule = buildCombinedSchedule(data);

  updatePreview(data, combinedSchedule);
  updateExplanation(data);
  renderComparisonTable(data);
  renderMonthlyTable(combinedSchedule.monthly);
  renderYearlyTable(combinedSchedule.yearly);
  applyView(scheduleView);
}

[
  loanAAmountInput,
  loanAAprInput,
  loanATermInput,
  loanBAmountInput,
  loanBAprInput,
  loanBTermInput,
].forEach((input) => {
  input?.addEventListener('input', updateSliderDisplays);
});

viewMonthlyButton?.addEventListener('click', () => applyView('monthly'));
viewYearlyButton?.addEventListener('click', () => applyView('yearly'));
calculateButton?.addEventListener('click', calculate);

updateSliderDisplays();
applyView('yearly');
calculate();
