import { formatCurrency, formatNumber } from '/assets/js/core/format.js';
import { toNumber } from '/assets/js/core/validate.js';

const balanceInput = document.querySelector('#balance');
const aprInput = document.querySelector('#apr');
const paymentInput = document.querySelector('#payment');
const result = document.querySelector('#payoff-result');
const details = document.querySelector('#payoff-details');
const button = document.querySelector('#payoff-calc');
const chartCanvas = document.querySelector('#payoff-chart');
const chartSummary = document.querySelector('#payoff-chart-summary');

let chartModulePromise = null;
let chartRenderToken = 0;

function calculatePayoff(balance, apr, payment) {
  if (balance <= 0 || payment <= 0) {
    return {
      error: 'Enter a balance and monthly payment above 0.',
    };
  }

  const monthlyRate = apr / 100 / 12;

  if (monthlyRate > 0 && payment <= balance * monthlyRate) {
    return {
      error: 'Payment is too low to cover the monthly interest.',
    };
  }

  let months;
  if (monthlyRate === 0) {
    months = balance / payment;
  } else {
    months = Math.log(payment / (payment - balance * monthlyRate)) / Math.log(1 + monthlyRate);
  }

  const roundedMonths = Math.ceil(months);
  const totalPaid = roundedMonths * payment;
  const totalInterest = totalPaid - balance;

  return {
    months: roundedMonths,
    totalPaid,
    totalInterest,
  };
}

function buildSchedule(balance, apr, payment, maxMonths = 600) {
  const monthlyRate = apr / 100 / 12;
  const balances = [balance];
  let currentBalance = balance;
  let month = 0;

  while (currentBalance > 0 && month < maxMonths) {
    const interest = currentBalance * monthlyRate;
    const nextBalance = currentBalance + interest - payment;
    currentBalance = Math.max(nextBalance, 0);
    balances.push(currentBalance);
    month += 1;
  }

  return balances;
}

function hasValidInputs(balance, payment) {
  return balance > 0 && payment > 0;
}

function loadChartLibrary() {
  if (!chartCanvas) {
    return Promise.resolve(null);
  }

  if (!chartModulePromise) {
    chartModulePromise = import('/assets/js/vendors/chart.4.4.0.js');
  }

  return chartModulePromise;
}

async function renderChart(schedule, { balance }) {
  if (!chartCanvas || !chartSummary) {
    return;
  }

  const token = (chartRenderToken += 1);

  const chartModule = await loadChartLibrary();
  if (!chartModule || token !== chartRenderToken) {
    return;
  }

  const formatter = (value) => formatCurrency(value, { maximumFractionDigits: 0 });
  chartModule.drawLineChart(chartCanvas, schedule, {
    labelFormatter: formatter,
    backgroundColor: '#f8fafc',
  });

  chartSummary.textContent = `Chart shows balance dropping from ${formatter(balance)} to $0.`;
}

function renderResult({ shouldLoadChart } = {}) {
  const balance = toNumber(balanceInput.value);
  const apr = toNumber(aprInput.value);
  const payment = toNumber(paymentInput.value);

  const payoff = calculatePayoff(balance, apr, payment);

  if (payoff.error) {
    result.textContent = `Result: ${payoff.error}`;
    details.textContent = '';
    if (chartSummary) {
      chartSummary.textContent = '';
    }
    return;
  }

  result.textContent = `Result: ${formatNumber(payoff.months)} months to payoff.`;
  details.textContent = `Total paid: ${formatCurrency(payoff.totalPaid)} · Total interest: ${formatCurrency(
    payoff.totalInterest
  )}`;

  if (shouldLoadChart && hasValidInputs(balance, payment)) {
    const schedule = buildSchedule(balance, apr, payment);
    renderChart(schedule, { balance });
  }
}

button.addEventListener('click', () => renderResult({ shouldLoadChart: true }));

[balanceInput, aprInput, paymentInput].forEach((input) => {
  input.addEventListener('input', () => {
    const balance = toNumber(balanceInput.value);
    const payment = toNumber(paymentInput.value);
    if (hasValidInputs(balance, payment)) {
      renderResult({ shouldLoadChart: true });
    }
  });
});

renderResult({ shouldLoadChart: false });
