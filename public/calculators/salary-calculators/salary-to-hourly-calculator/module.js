import { setPageMetadata } from '/assets/js/core/ui.js';
import {
  buildSalaryMetadata,
  calculateSalaryToHourly,
  copyTextToClipboard,
  formatCurrency,
  formatInputValue,
  getInputNumber,
  setText,
} from '/calculators/salary-calculators/shared/salary-utils.js';

const FAQ_ITEMS = [
  {
    question: 'How do you convert salary to hourly pay?',
    answer:
      'Divide annual salary by weeks per year and then divide again by hours per week to find the implied hourly gross pay.',
  },
  {
    question: 'Does this show gross or take-home pay?',
    answer: 'It shows gross pay only before taxes, deductions, retirement contributions, or benefits.',
  },
  {
    question: 'Why do hours per week affect the result?',
    answer:
      'The same annual salary spread across more hours produces a lower hourly rate, while fewer hours produces a higher hourly rate.',
  },
  {
    question: 'Can I use this for part-time schedules?',
    answer:
      'Yes. Enter your own hours per week and paid weeks so the implied hourly rate matches your real schedule.',
  },
  {
    question: 'Why does monthly pay stay the same while hourly pay changes?',
    answer:
      'Monthly pay comes directly from the annual salary, but hourly pay depends on how many hours that same salary covers.',
  },
  {
    question: 'Can I compare two salaried roles with this?',
    answer:
      'Yes. Run each salary with its expected schedule to see whether the higher annual number also means a higher hourly value.',
  },
  {
    question: 'When should I use this instead of hourly to salary?',
    answer:
      'Use this route when your starting point is a salary offer. Use hourly-to-salary when the wage is already quoted by the hour.',
  },
  {
    question: 'Why is gross hourly pay useful?',
    answer:
      'It helps you judge workload and compensation together before tax situations and deduction choices muddy the comparison.',
  },
  {
    question: 'Does this include overtime?',
    answer:
      'No. It assumes the salary covers the schedule you entered and does not model overtime premiums.',
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
    title: 'Salary to Hourly Calculator (Gross Pay) | Hourly, Weekly and Monthly Pay',
    description:
      'Convert annual gross salary into hourly, weekly, biweekly, and monthly pay using your hours worked and paid weeks per year.',
    canonical: 'https://calchowmuch.com/salary-calculators/salary-to-hourly-calculator/',
    name: 'Salary to Hourly Calculator (Gross Pay)',
    appDescription:
      'Estimate hourly gross pay from an annual salary and visible work schedule assumptions.',
    featureList: [
      'Hourly gross pay',
      'Weekly gross pay',
      'Biweekly gross pay',
      'Monthly gross pay',
    ],
    keywords: 'salary to hourly calculator gross pay, annual salary to hourly pay, hourly rate from salary',
    faqSchema: FAQ_SCHEMA,
  })
);

const annualInput = document.querySelector('#salary-annual-input');
const hoursInput = document.querySelector('#salary-hours-input');
const weeksInput = document.querySelector('#salary-weeks-input');
const errorNode = document.querySelector('#salary-to-hourly-error');
const noteNode = document.querySelector('#salary-hourly-note');
const contextNode = document.querySelector('#salary-hourly-context');
const breakdownNode = document.querySelector('#salary-hourly-breakdown');
const copyButton = document.querySelector('#salary-hourly-copy-summary');
const copyFeedback = document.querySelector('#salary-hourly-copy-feedback');
const dirtyChip = document.querySelector('#salary-hourly-dirty-chip');

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
    `Gross (before tax): ${formatCurrency(result.hourlyPay)} per hour, ${formatCurrency(
      result.weeklyPay
    )} per week, ${formatCurrency(result.biweeklyPay)} biweekly, and ${formatCurrency(
      result.monthlyPay
    )} per month.`,
    buildAssumptionsLine(),
  ].join('\n');
}

function calculate() {
  const result = calculateSalaryToHourly({
    annualSalary: getInputNumber(annualInput),
    hoursPerWeek: getInputNumber(hoursInput),
    weeksPerYear: getInputNumber(weeksInput),
  });

  if (!result) {
    renderError('Enter a valid annual salary, hours per week, and weeks per year.');
    return;
  }

  clearError();
  setText(document.querySelector('#salary-hourly-result'), formatCurrency(result.hourlyPay));
  setText(document.querySelector('#salary-weekly-result'), formatCurrency(result.weeklyPay));
  setText(document.querySelector('#salary-biweekly-result'), formatCurrency(result.biweeklyPay));
  setText(document.querySelector('#salary-monthly-result'), formatCurrency(result.monthlyPay));
  setText(
    noteNode,
    `Gross (before tax), that equals about ${formatCurrency(result.weeklyPay)} per week.`
  );
  setText(contextNode, buildAssumptionsLine());
  setText(
    breakdownNode,
    'Hourly pay = annual salary / weeks per year / hours per week. Monthly = annual / 12 and biweekly = annual / 26.'
  );
  latestSummary = buildCopySummary(result);
  setDirty(false);
}

async function copySummary() {
  const copied = await copyTextToClipboard(latestSummary);
  setCopyFeedback(copied ? 'Summary copied.' : 'Copy failed.', copied ? 'success' : 'error');
}

[annualInput, hoursInput, weeksInput].forEach((input) => {
  input?.addEventListener('input', markDirty);
  input?.addEventListener('change', markDirty);
  input?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      calculate();
    }
  });
});

document.querySelector('#salary-to-hourly-button')?.addEventListener('click', calculate);
copyButton?.addEventListener('click', () => {
  void copySummary();
});

calculate();
