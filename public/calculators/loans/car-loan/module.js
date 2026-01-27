import { formatCurrency, formatNumber, formatPercent } from '/assets/js/core/format.js';
import { sampleValues, getPaddedMinMax, buildPolyline } from '/assets/js/core/graph-utils.js';
import { setPageMetadata, setupButtonGroup } from '/assets/js/core/ui.js';
import { calculateCarLoan } from '/assets/js/core/auto-loan-utils.js';

const priceInput = document.querySelector('#car-price');
const downAmountInput = document.querySelector('#car-down-amount');
const downPercentInput = document.querySelector('#car-down-percent');
const tradeInput = document.querySelector('#car-trade');
const feesInput = document.querySelector('#car-fees');
const taxInput = document.querySelector('#car-tax');
const aprInput = document.querySelector('#car-apr');
const termInput = document.querySelector('#car-term');
const calculateButton = document.querySelector('#car-calc');
const resultDiv = document.querySelector('#car-result');
const summaryDiv = document.querySelector('#car-summary');

const downAmountRow = document.querySelector('#car-down-amount-row');
const downPercentRow = document.querySelector('#car-down-percent-row');
const downTypeGroup = document.querySelector('[data-button-group="car-down-type"]');

const explanationRoot = document.querySelector('#car-explanation');
const priceValue = explanationRoot?.querySelector('[data-car="price"]');
const financedValue = explanationRoot?.querySelector('[data-car="financed"]');
const downValue = explanationRoot?.querySelector('[data-car="down"]');
const tradeValue = explanationRoot?.querySelector('[data-car="trade"]');
const aprValue = explanationRoot?.querySelector('[data-car="apr"]');
const termValue = explanationRoot?.querySelector('[data-car="term"]');
const paymentValue = explanationRoot?.querySelector('[data-car="payment"]');
const interestValue = explanationRoot?.querySelector('[data-car="interest"]');
const totalCostValue = explanationRoot?.querySelector('[data-car="total-cost"]');

const tableBody = document.querySelector('#car-table-body');
const graphLine = document.querySelector('#car-line');
const yMax = document.querySelector('#car-y-max');
const yMid = document.querySelector('#car-y-mid');
const yMin = document.querySelector('#car-y-min');
const xStart = document.querySelector('#car-x-start');
const xEnd = document.querySelector('#car-x-end');
const graphNote = document.querySelector('#car-graph-note');

const metadata = {
  title: 'Car Loan Calculator – Monthly Payment & Total Cost',
  description:
    'Calculate car loan payments, interest, and total cost with down payment, trade-in, fees, and sales tax. Includes yearly payoff table and FAQs.',
  canonical: 'https://calchowmuch.com/loans/car-loan/',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How is the amount financed calculated?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'It is the vehicle price minus down payment and trade-in, plus dealer fees and sales tax.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does a larger down payment reduce monthly payments?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. A larger down payment lowers the amount financed, which reduces monthly payment and total interest.',
        },
      },
      {
        '@type': 'Question',
        name: 'What does total cost include?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Total cost equals all monthly payments plus your down payment for the vehicle.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does sales tax affect the loan?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sales tax increases the amount financed, which raises both monthly payment and total interest.',
        },
      },
    ],
  },
};

setPageMetadata(metadata);

const downTypeButtons = setupButtonGroup(downTypeGroup, {
  defaultValue: 'amount',
  onChange: (value) => {
    downAmountRow?.classList.toggle('is-hidden', value !== 'amount');
    downPercentRow?.classList.toggle('is-hidden', value !== 'percent');
    calculate();
  },
});

function clearOutputs() {
  if (tableBody) {
    tableBody.innerHTML = '';
  }
  if (graphLine) {
    graphLine.setAttribute('points', '');
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

function updateGraph(schedule, months) {
  if (!graphLine) {
    return;
  }
  const balances = schedule.map((entry) => entry.balance);
  const sampled = sampleValues(balances, 36);
  const { min, max } = getPaddedMinMax(sampled, 0.15);
  graphLine.setAttribute('points', buildPolyline(sampled, min, max));

  yMax.textContent = formatNumber(max);
  yMid.textContent = formatNumber((max + min) / 2);
  yMin.textContent = formatNumber(min);
  xStart.textContent = '1';
  xEnd.textContent = formatNumber(months, { maximumFractionDigits: 0 });
  if (graphNote) {
    graphNote.textContent = `Loan term ${formatNumber(months, { maximumFractionDigits: 0 })} months`;
  }
}

function updateExplanation(data) {
  if (!explanationRoot) {
    return;
  }
  if (priceValue) {
    priceValue.textContent = formatCurrency(data.price);
  }
  financedValue.textContent = formatCurrency(data.amountFinanced);
  downValue.textContent = formatCurrency(data.downPayment);
  tradeValue.textContent = formatCurrency(data.tradeIn);
  aprValue.textContent = formatPercent(data.apr);
  termValue.textContent = formatNumber(data.termYears, { maximumFractionDigits: 0 });
  paymentValue.textContent = formatCurrency(data.monthlyPayment);
  interestValue.textContent = formatCurrency(data.totalInterest);
  if (totalCostValue) {
    totalCostValue.textContent = formatCurrency(data.totalCost);
  }
}

function calculate() {
  if (!resultDiv || !summaryDiv) {
    return;
  }
  resultDiv.textContent = '';
  summaryDiv.textContent = '';
  clearOutputs();

  const price = Number(priceInput?.value);
  const downPaymentAmount = Number(downAmountInput?.value);
  const downPaymentPercent = Number(downPercentInput?.value);
  const tradeIn = Number(tradeInput?.value);
  const fees = Number(feesInput?.value);
  const taxRate = Number(taxInput?.value);
  const apr = Number(aprInput?.value);
  const termYears = Number(termInput?.value);
  const downPaymentType = downTypeButtons?.getValue() ?? 'amount';

  if (!Number.isFinite(price) || price <= 0) {
    setError('Vehicle price must be greater than 0.');
    return;
  }

  const data = calculateCarLoan({
    price,
    downPaymentType,
    downPaymentAmount,
    downPaymentPercent,
    tradeIn,
    fees,
    taxRate,
    apr,
    termYears,
  });

  if (downPaymentType === 'percent' && downAmountInput) {
    downAmountInput.value = data.downPayment.toFixed(2);
  }
  if (downPaymentType === 'amount' && downPercentInput) {
    downPercentInput.value = data.downPaymentPercent.toFixed(2);
  }

  resultDiv.innerHTML = `<strong>Monthly payment:</strong> ${formatCurrency(data.monthlyPayment)}`;

  summaryDiv.innerHTML =
    `<p><strong>Amount financed:</strong> ${formatCurrency(data.amountFinanced)}</p>` +
    `<p><strong>Total interest:</strong> ${formatCurrency(data.totalInterest)}</p>` +
    `<p><strong>Total cost:</strong> ${formatCurrency(data.totalCost)}</p>`;

  updateTable(data.yearly);
  updateGraph(data.schedule, data.months);
  updateExplanation({ ...data, apr, termYears });
}

calculateButton?.addEventListener('click', calculate);

calculate();
