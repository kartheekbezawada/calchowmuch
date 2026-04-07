import { setPageMetadata, setupButtonGroup } from '/assets/js/core/ui.js';
import {
  buildSalaryMetadata,
  calculateSalaryConversion,
  copyTextToClipboard,
  formatCurrency,
  formatInputValue,
  getInputNumber,
  setText,
} from '/calculators/salary-calculators/shared/salary-utils.js';

const FAQ_ITEMS = [
  {
    question: 'What does this salary calculator show?',
    answer:
      'It converts one gross pay amount into annual, monthly, biweekly, weekly, daily, and hourly views using the schedule assumptions you choose.',
  },
  {
    question: 'Does this calculator show take-home pay?',
    answer:
      'No. It shows gross pay only before taxes, deductions, retirement contributions, bonuses, or overtime.',
  },
  {
    question: 'Can I start from hourly pay instead of annual salary?',
    answer:
      'Yes. Pick hourly as the source frequency, enter the rate, then use your hours and weeks to convert it into the other pay periods.',
  },
  {
    question: 'Why do hours per week and weeks per year matter?',
    answer:
      'They control how the calculator converts annual pay into weekly and hourly pay, so small schedule changes can move the result a lot.',
  },
  {
    question: 'Why does days per week affect daily pay?',
    answer:
      'Daily pay is calculated from weekly pay divided by workdays per week, so fewer workdays means higher daily pay for the same weekly amount.',
  },
  {
    question: 'Can I use this for part-time or 37.5-hour schedules?',
    answer:
      'Yes. Enter your own hours, weeks, and workdays so the conversion matches your actual schedule instead of a standard full-time pattern.',
  },
  {
    question: 'Why do monthly and biweekly pay look different?',
    answer:
      'Monthly pay divides annual gross pay by 12, while biweekly pay divides it by 26, so the numbers answer different payroll questions.',
  },
  {
    question: 'Should I use this or the hourly-to-salary calculator?',
    answer:
      'Use this route when you want every major pay period at once. Use hourly-to-salary when your main question starts from an hourly wage.',
  },
  {
    question: 'Can I compare two job offers with this?',
    answer:
      'Yes. Enter each offer with its own schedule assumptions and compare the gross hourly, weekly, monthly, and annual views side by side.',
  },
  {
    question: 'Are my numbers stored anywhere?',
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
    title: 'Salary Calculator (Gross Pay) | Hourly, Weekly, Monthly and Annual Pay',
    description:
      'Convert one gross pay amount into hourly, daily, weekly, biweekly, monthly, and annual pay with schedule assumptions that stay visible.',
    canonical: 'https://calchowmuch.com/salary-calculators/salary-calculator/',
    name: 'Salary Calculator (Gross Pay)',
    appDescription:
      'Convert one gross pay amount into annual, monthly, biweekly, weekly, daily, and hourly views.',
    featureList: [
      'Annual gross pay',
      'Monthly gross pay',
      'Biweekly gross pay',
      'Weekly gross pay',
      'Daily gross pay',
      'Hourly gross pay',
    ],
    keywords: 'salary calculator gross pay, salary conversion calculator, hourly weekly monthly annual pay',
    faqSchema: FAQ_SCHEMA,
  })
);

const amountInput = document.querySelector('#salary-pay-amount');
const hoursInput = document.querySelector('#salary-hours-per-week');
const weeksInput = document.querySelector('#salary-weeks-per-year');
const daysInput = document.querySelector('#salary-days-per-week');
const errorNode = document.querySelector('#salary-calc-error');
const calculateButton = document.querySelector('#salary-calc-button');
const copyButton = document.querySelector('#salary-copy-summary');
const copyFeedback = document.querySelector('#salary-copy-feedback');
const dirtyChip = document.querySelector('#salary-dirty-chip');
const frequencyGroup = document.querySelector('[data-button-group="salary-pay-frequency"]');

const outputs = {
  annualPay: document.querySelector('#salary-annual-pay'),
  monthlyPay: document.querySelector('#salary-monthly-pay'),
  biweeklyPay: document.querySelector('#salary-biweekly-pay'),
  weeklyPay: document.querySelector('#salary-weekly-pay'),
  dailyPay: document.querySelector('#salary-daily-pay'),
  hourlyPay: document.querySelector('#salary-hourly-pay'),
  note: document.querySelector('#salary-answer-note'),
  context: document.querySelector('#salary-answer-context'),
  breakdown: document.querySelector('#salary-breakdown'),
};

const frequencyButtons = setupButtonGroup(frequencyGroup, {
  defaultValue: 'annual',
  onChange: () => markDirty(),
});

const FREQUENCY_LABELS = {
  hourly: 'hourly pay',
  daily: 'daily pay',
  weekly: 'weekly pay',
  biweekly: 'biweekly pay',
  monthly: 'monthly pay',
  annual: 'annual pay',
};

let latestSummary = '';
let copyTimer = null;

function showError(message) {
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

function buildSalaryBreakdown(frequency) {
  if (frequency === 'hourly') {
    return 'Annual pay = pay amount x hours per week x weeks per year. Monthly = annual / 12, biweekly = annual / 26, and daily = weekly / days per week.';
  }
  if (frequency === 'daily') {
    return 'Annual pay = pay amount x days per week x weeks per year. Weekly pay comes from annual / weeks per year, then hourly uses weekly / hours per week.';
  }
  if (frequency === 'weekly') {
    return 'Annual pay = pay amount x weeks per year. Monthly = annual / 12, biweekly = annual / 26, and daily = weekly / days per week.';
  }
  if (frequency === 'biweekly') {
    return 'Annual pay = pay amount x 26. Monthly = annual / 12, weekly = annual / weeks per year, and hourly uses weekly / hours per week.';
  }
  if (frequency === 'monthly') {
    return 'Annual pay = pay amount x 12. Weekly = annual / weeks per year, biweekly = annual / 26, and daily uses weekly / days per week.';
  }
  return 'Annual pay starts from the amount you entered. Monthly = annual / 12, biweekly = annual / 26, weekly = annual / weeks per year, and hourly uses weekly / hours per week.';
}

function buildAssumptionsLine(frequency) {
  return `Assumptions: source ${FREQUENCY_LABELS[frequency]} · ${formatInputValue(
    hoursInput,
    '40'
  )} hrs/week · ${formatInputValue(weeksInput, '52')} weeks/year · ${formatInputValue(
    daysInput,
    '5'
  )} workdays/week.`;
}

function buildCopySummary(result, frequency) {
  return [
    `Gross (before tax): ${formatCurrency(result.annualPay)} per year, ${formatCurrency(
      result.monthlyPay
    )} per month, ${formatCurrency(result.biweeklyPay)} biweekly, ${formatCurrency(
      result.weeklyPay
    )} weekly, ${formatCurrency(result.dailyPay)} daily, and ${formatCurrency(
      result.hourlyPay
    )} hourly.`,
    buildAssumptionsLine(frequency),
  ].join('\n');
}

function calculate() {
  const frequency = frequencyButtons?.getValue() ?? 'annual';
  const result = calculateSalaryConversion({
    amount: getInputNumber(amountInput),
    frequency,
    hoursPerWeek: getInputNumber(hoursInput),
    weeksPerYear: getInputNumber(weeksInput),
    daysPerWeek: getInputNumber(daysInput),
  });

  if (!result) {
    showError('Enter a pay amount plus valid schedule assumptions before calculating.');
    return;
  }

  clearError();
  setText(outputs.annualPay, formatCurrency(result.annualPay));
  setText(outputs.monthlyPay, formatCurrency(result.monthlyPay));
  setText(outputs.biweeklyPay, formatCurrency(result.biweeklyPay));
  setText(outputs.weeklyPay, formatCurrency(result.weeklyPay));
  setText(outputs.dailyPay, formatCurrency(result.dailyPay));
  setText(outputs.hourlyPay, formatCurrency(result.hourlyPay));
  setText(
    outputs.note,
    `Gross (before tax), that equals about ${formatCurrency(result.weeklyPay)} per week.`
  );
  setText(outputs.context, buildAssumptionsLine(frequency));
  setText(outputs.breakdown, buildSalaryBreakdown(frequency));
  latestSummary = buildCopySummary(result, frequency);
  setDirty(false);
}

async function copySummary() {
  const copied = await copyTextToClipboard(latestSummary);
  setCopyFeedback(copied ? 'Summary copied.' : 'Copy failed.', copied ? 'success' : 'error');
}

[amountInput, hoursInput, weeksInput, daysInput].forEach((input) => {
  input?.addEventListener('input', markDirty);
  input?.addEventListener('change', markDirty);
  input?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      calculate();
    }
  });
});

calculateButton?.addEventListener('click', calculate);
copyButton?.addEventListener('click', () => {
  void copySummary();
});

calculate();
