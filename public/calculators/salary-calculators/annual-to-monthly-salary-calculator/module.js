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

// Keep in sync with the FAQ block in explanation.html.
const FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do you convert an annual salary to monthly pay?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Divide the annual salary by 12. A $60,000 salary is $5,000 a month before tax. The calculator does this and also shows biweekly, weekly, daily and hourly equivalents.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does this show gross or take-home pay?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Gross pay only, before income tax, payroll tax and deductions. For take-home pay after tax, use the Salary Calculator.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why is monthly pay not the same as four weekly paychecks?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Monthly pay is annual divided by 12; four weekly paychecks is annual divided by 13. Most months have a bit more than four weeks, so the two figures never quite match.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I start from an hourly rate or a weekly wage instead?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Set the frequency to whatever your amount is - hourly, daily, weekly, biweekly, monthly or annual - and every other period is worked out from it.',
      },
    },
    {
      '@type': 'Question',
      name: 'What do hours per week and weeks per year change?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Only the weekly, daily and hourly figures. Monthly and biweekly pay are fixed fractions of the annual amount and do not depend on your schedule.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I convert monthly pay back to an annual salary?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Multiply the monthly figure by 12. Set the frequency to Monthly, enter the amount, and the annual salary is shown in the results.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does this include overtime or bonuses?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It converts one steady rate of pay between periods. Use the Overtime Pay Calculator or Bonus Calculator for variable pay.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which biweekly figure does it use - 24 or 26 pays a year?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Biweekly means every two weeks, so 26 pays a year (annual divided by 26). A semi-monthly schedule of 24 pays a year is the same as the monthly figure divided by two.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are my inputs stored anywhere?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Everything runs in your browser and nothing is sent anywhere or saved.',
      },
    },
  ],
};

setPageMetadata(
  buildSalaryMetadata({
    title: 'Annual to Monthly Salary Calculator | Convert Hourly, Weekly, Monthly and Annual Pay',
    description:
      'Convert a salary between annual, monthly, biweekly, weekly, daily and hourly pay. Enter the amount you know at its frequency and see every other pay period, gross before tax.',
    canonical: 'https://calchowmuch.com/salary-calculators/annual-to-monthly-salary-calculator/',
    name: 'Annual to Monthly Salary Calculator',
    appDescription:
      'Convert gross pay between annual, monthly, biweekly, weekly, daily and hourly using your own schedule.',
    featureList: [
      'Annual to monthly conversion',
      'Hourly, daily, weekly and biweekly equivalents',
      'Any source pay frequency',
      'Editable hours and weeks per year',
    ],
    keywords:
      'annual to monthly salary calculator, monthly to annual salary, hourly to salary calculator, salary to hourly calculator, weekly pay calculator, pay converter',
    faqSchema: FAQ_SCHEMA,
  })
);

const amountInput = document.querySelector('#salary-pay-amount');
const hoursInput = document.querySelector('#salary-hours-per-week');
const weeksInput = document.querySelector('#salary-weeks-per-year');
const daysInput = document.querySelector('#salary-days-per-week');
const errorNode = document.querySelector('#salary-calc-error');
const heroNode = document.querySelector('#salary-annual-pay');
const heroTitleNode = document.querySelector('#salary-answer-title');
const noteNode = document.querySelector('#salary-answer-note');
const contextNode = document.querySelector('#salary-answer-context');
const dirtyChip = document.querySelector('#salary-dirty-chip');
const copyButton = document.querySelector('#salary-copy-summary');
const copyFeedback = document.querySelector('#salary-copy-feedback');

const FREQUENCY_LABEL = {
  annual: 'annual',
  monthly: 'monthly',
  fourWeekly: '4-weekly',
  biweekly: 'biweekly',
  weekly: 'weekly',
  daily: 'daily',
  hourly: 'hourly',
};

let latestSummary = '';
let copyTimer = null;

const frequencyGroup = setupButtonGroup(
  document.querySelector('[data-button-group="salary-pay-frequency"]'),
  { defaultValue: 'annual', onChange: () => calculate() }
);

function renderError(message) {
  if (!errorNode) return;
  errorNode.hidden = false;
  errorNode.textContent = message;
}

function clearError() {
  if (!errorNode) return;
  errorNode.hidden = true;
  errorNode.textContent = '';
}

function setDirty(isDirty) {
  if (!dirtyChip) return;
  dirtyChip.textContent = isDirty ? 'Inputs changed - click Calculate to update' : 'Up to date';
  dirtyChip.classList.toggle('is-dirty', isDirty);
}

function markDirty() {
  setDirty(true);
  clearError();
}

function setCopyFeedback(message, tone = 'success') {
  if (!copyFeedback) return;
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

function schedule() {
  return {
    hoursPerWeek: getInputNumber(hoursInput),
    weeksPerYear: getInputNumber(weeksInput),
    daysPerWeek: getInputNumber(daysInput),
  };
}

function buildContextLine(frequency) {
  return `Assumptions: source ${FREQUENCY_LABEL[frequency] || 'annual'} pay · ${formatInputValue(
    hoursInput,
    '40'
  )} hrs/week · ${formatInputValue(weeksInput, '52')} weeks/year · ${formatInputValue(
    daysInput,
    '5'
  )} workdays/week.`;
}

function calculate() {
  const frequency = frequencyGroup?.getValue() ?? 'annual';
  const amount = getInputNumber(amountInput);
  const result = calculateSalaryConversion({ amount, frequency, ...schedule() });

  if (!result) {
    renderError('Enter a valid pay amount, hours per week, and weeks per year.');
    return;
  }
  clearError();

  setText(heroTitleNode, 'Monthly gross pay');
  setText(heroNode, formatCurrency(result.monthlyPay));
  setText(noteNode, `Gross (before tax): ${formatCurrency(result.annualPay)} per year.`);
  setText(contextNode, buildContextLine(frequency));

  setText(document.querySelector('#salary-annual-result'), formatCurrency(result.annualPay));
  setText(document.querySelector('#salary-fourweekly-pay'), formatCurrency(result.fourWeeklyPay));
  setText(document.querySelector('#salary-biweekly-pay'), formatCurrency(result.biweeklyPay));
  setText(document.querySelector('#salary-weekly-pay'), formatCurrency(result.weeklyPay));
  setText(
    document.querySelector('#salary-daily-pay'),
    result.dailyPay != null ? formatCurrency(result.dailyPay) : '—'
  );
  setText(
    document.querySelector('#salary-hourly-pay'),
    result.hourlyPay != null ? formatCurrency(result.hourlyPay) : '—'
  );

  latestSummary = [
    `Gross (before tax): ${formatCurrency(result.annualPay)} per year, ${formatCurrency(
      result.monthlyPay
    )} per month, ${formatCurrency(result.fourWeeklyPay)} per 4-weekly, ${formatCurrency(
      result.biweeklyPay
    )} biweekly, ${formatCurrency(result.weeklyPay)} per week.`,
    buildContextLine(frequency),
  ].join('\n');
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
    if (event.key === 'Enter') calculate();
  });
});

document.querySelector('#salary-calc-button')?.addEventListener('click', calculate);
copyButton?.addEventListener('click', () => {
  void copySummary();
});

calculate();
