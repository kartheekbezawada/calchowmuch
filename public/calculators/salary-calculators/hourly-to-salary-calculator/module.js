import { setPageMetadata } from '/assets/js/core/ui.js';
import {
  buildSalaryMetadata,
  calculateHourlyToSalary,
  copyTextToClipboard,
  formatCurrency,
  formatInputValue,
  getInputNumber,
  setText,
} from '/calculators/salary-calculators/shared/salary-utils.js';

const FAQ_ITEMS = [
  {
    question: 'How do you convert hourly pay to annual salary?',
    answer:
      'Multiply hourly rate by hours per week and weeks per year, then divide the annual result into monthly, biweekly, and weekly views.',
  },
  {
    question: 'Does this show gross or take-home pay?',
    answer:
      'It shows gross pay only before taxes, deductions, retirement contributions, or payroll withholdings.',
  },
  {
    question: 'What assumptions matter most?',
    answer:
      'Hours per week and weeks per year matter most because they determine the total number of paid hours in the year.',
  },
  {
    question: 'Can I use 37.5 hours per week or 48 paid weeks?',
    answer:
      'Yes. Enter your own schedule so the annual salary estimate reflects your real work pattern.',
  },
  {
    question: 'Why does monthly pay differ from biweekly pay?',
    answer:
      'Monthly pay divides annual gross pay by 12, while biweekly pay divides it by 26, so the figures answer different payroll questions.',
  },
  {
    question: 'Does this include overtime?',
    answer:
      'No. This route is for standard hourly-to-salary conversion and does not model overtime rules.',
  },
  {
    question: 'Can I compare job offers with this?',
    answer:
      'Yes. Run each wage with its own hours and weeks assumptions to compare the gross annual and monthly value of each offer.',
  },
  {
    question: 'Should I use this or the salary calculator?',
    answer:
      'Use this route when your starting point is an hourly wage. Use the salary calculator when you want every pay period at once from any source frequency.',
  },
  {
    question: 'Why is gross pay useful for comparisons?',
    answer:
      'Gross pay lets you compare the offer itself before tax situations, deductions, and benefits complicate the picture.',
  },
  {
    question: 'Are my inputs stored?',
    answer: 'No. All calculations run locally in your browser and nothing is stored.',
  },
];

const FAQ_SCHEMA = {
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

setPageMetadata(
  buildSalaryMetadata({
    title: 'Hourly to Salary Calculator (Gross Pay) | Annual, Monthly and Weekly Pay',
    description:
      'Estimate gross annual salary from an hourly rate, then see monthly, biweekly, and weekly pay using your hours per week and paid weeks per year.',
    canonical: 'https://calchowmuch.com/salary-calculators/hourly-to-salary-calculator/',
    name: 'Hourly to Salary Calculator (Gross Pay)',
    appDescription:
      'Estimate annual salary and pay-period equivalents from an hourly wage and visible schedule assumptions.',
    featureList: [
      'Annual gross salary',
      'Monthly gross pay',
      'Biweekly gross pay',
      'Weekly gross pay',
    ],
    keywords: 'hourly to salary calculator gross pay, hourly wage to annual salary, hourly pay conversion',
    faqSchema: FAQ_SCHEMA,
  })
);

const hourlyRateInput = document.querySelector('#hourly-rate');
const hoursInput = document.querySelector('#hourly-hours-per-week');
const weeksInput = document.querySelector('#hourly-weeks-per-year');
const errorNode = document.querySelector('#hourly-error');
const noteNode = document.querySelector('#hourly-result-note');
const contextNode = document.querySelector('#hourly-result-context');
const breakdownNode = document.querySelector('#hourly-result-breakdown');
const copyButton = document.querySelector('#hourly-copy-summary');
const copyFeedback = document.querySelector('#hourly-copy-feedback');
const dirtyChip = document.querySelector('#hourly-dirty-chip');

let latestSummary = '';
let copyTimer = null;

function renderError(message) {
  if (!errorNode) {
    return;
  }
  errorNode.hidden = false;
  errorNode.textContent = message;
}

function clearError() {
  if (!errorNode) {
    return;
  }
  errorNode.hidden = true;
  errorNode.textContent = '';
}

function setDirty(isDirty) {
  if (!dirtyChip) {
    return;
  }
  dirtyChip.textContent = isDirty ? 'Inputs changed - click Calculate to update' : 'Up to date';
  dirtyChip.classList.toggle('is-dirty', isDirty);
}

function markDirty() {
  setDirty(true);
  clearError();
}

function setCopyFeedback(message, tone = 'success') {
  if (!copyFeedback) {
    return;
  }
  copyFeedback.textContent = message;
  copyFeedback.dataset.tone = tone;
  copyFeedback.classList.add('is-visible');
  window.clearTimeout(copyTimer);
  copyTimer = window.setTimeout(() => {
    copyFeedback.classList.remove('is-visible');
    copyFeedback.textContent = '';
    delete copyFeedback.dataset.tone;
  }, 1800);
}

function buildAssumptionsLine() {
  return `Assumptions: ${formatInputValue(hoursInput, '40')} hrs/week · ${formatInputValue(
    weeksInput,
    '52'
  )} weeks/year.`;
}

function buildCopySummary(result) {
  return [
    `Gross (before tax): ${formatCurrency(result.annualPay)} per year, ${formatCurrency(
      result.monthlyPay
    )} per month, ${formatCurrency(result.biweeklyPay)} biweekly, and ${formatCurrency(
      result.weeklyPay
    )} per week.`,
    buildAssumptionsLine(),
  ].join('\n');
}

function calculate() {
  const result = calculateHourlyToSalary({
    hourlyRate: getInputNumber(hourlyRateInput),
    hoursPerWeek: getInputNumber(hoursInput),
    weeksPerYear: getInputNumber(weeksInput),
  });

  if (!result) {
    renderError('Enter a valid hourly rate, hours per week, and weeks per year.');
    return;
  }

  clearError();
  setText(document.querySelector('#hourly-annual-result'), formatCurrency(result.annualPay));
  setText(document.querySelector('#hourly-monthly-result'), formatCurrency(result.monthlyPay));
  setText(document.querySelector('#hourly-biweekly-result'), formatCurrency(result.biweeklyPay));
  setText(document.querySelector('#hourly-weekly-result'), formatCurrency(result.weeklyPay));
  setText(
    noteNode,
    `Gross (before tax), that works out to about ${formatCurrency(result.weeklyPay)} per week.`
  );
  setText(contextNode, buildAssumptionsLine());
  setText(
    breakdownNode,
    'Annual salary = hourly rate x hours per week x weeks per year. Monthly = annual / 12 and biweekly = annual / 26.'
  );
  latestSummary = buildCopySummary(result);
  setDirty(false);
}

async function copySummary() {
  const copied = await copyTextToClipboard(latestSummary);
  setCopyFeedback(copied ? 'Summary copied.' : 'Copy failed.', copied ? 'success' : 'error');
}

[hourlyRateInput, hoursInput, weeksInput].forEach((input) => {
  input?.addEventListener('input', markDirty);
  input?.addEventListener('change', markDirty);
  input?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      calculate();
    }
  });
});

document.querySelector('#hourly-calc-button')?.addEventListener('click', calculate);
copyButton?.addEventListener('click', () => {
  void copySummary();
});

calculate();
