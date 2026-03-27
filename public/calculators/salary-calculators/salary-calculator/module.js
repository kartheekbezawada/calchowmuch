import { setPageMetadata, setupButtonGroup } from '/assets/js/core/ui.js';
import {
  buildSalaryMetadata,
  calculateSalaryConversion,
  formatCurrency,
  getInputNumber,
  setText,
} from '/calculators/salary-calculators/shared/salary-utils.js';

const FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What does a salary calculator do?', acceptedAnswer: { '@type': 'Answer', text: 'It converts one pay amount into other pay frequencies using your own schedule assumptions.' } },
    { '@type': 'Question', name: 'Can I convert hourly pay to annual salary?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Enter an hourly amount, plus hours per week and weeks per year, to estimate annual pay.' } },
    { '@type': 'Question', name: 'Can I estimate daily and weekly pay too?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The route can show hourly, daily, weekly, biweekly, monthly, and annual pay views together.' } },
    { '@type': 'Question', name: 'Does this calculator include taxes or deductions?', acceptedAnswer: { '@type': 'Answer', text: 'No. The calculator estimates gross pay only.' } },
    { '@type': 'Question', name: 'Why do hours per week and weeks per year matter?', acceptedAnswer: { '@type': 'Answer', text: 'Those assumptions determine how many total paid hours and weeks the pay amount is spread across.' } },
  ],
};

setPageMetadata(
  buildSalaryMetadata({
    title: 'Salary Calculator | Convert Hourly, Daily, Weekly, Monthly and Annual Pay',
    description:
      'Convert a salary or pay rate across hourly, daily, weekly, biweekly, monthly, and annual amounts using your work schedule assumptions.',
    canonical: 'https://calchowmuch.com/salary-calculators/salary-calculator/',
    name: 'Salary Calculator',
    appDescription:
      'Convert one pay amount into hourly, daily, weekly, biweekly, monthly, and annual views.',
    featureList: [
      'Hourly pay output',
      'Daily pay output',
      'Weekly pay output',
      'Biweekly pay output',
      'Monthly pay output',
      'Annual pay output',
    ],
    keywords: 'salary calculator, pay calculator, salary conversion calculator',
    faqSchema: FAQ_SCHEMA,
  })
);

const amountInput = document.querySelector('#salary-pay-amount');
const hoursInput = document.querySelector('#salary-hours-per-week');
const weeksInput = document.querySelector('#salary-weeks-per-year');
const daysInput = document.querySelector('#salary-days-per-week');
const errorNode = document.querySelector('#salary-calc-error');
const calculateButton = document.querySelector('#salary-calc-button');
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

const frequencyButtons = setupButtonGroup(frequencyGroup, { defaultValue: 'annual' });

const FREQUENCY_LABELS = {
  hourly: 'hourly pay',
  daily: 'daily pay',
  weekly: 'weekly pay',
  biweekly: 'biweekly pay',
  monthly: 'monthly pay',
  annual: 'annual pay',
};

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

function buildSalaryBreakdown(frequency) {
  if (frequency === 'hourly') {
    return 'Annual pay = pay amount × hours per week × weeks per year. Monthly = annual ÷ 12, biweekly = annual ÷ 26, daily = weekly ÷ days per week.';
  }
  if (frequency === 'daily') {
    return 'Annual pay = pay amount × days per week × weeks per year. Weekly pay comes from annual ÷ weeks per year, then hourly uses weekly ÷ hours per week.';
  }
  if (frequency === 'weekly') {
    return 'Annual pay = pay amount × weeks per year. Monthly = annual ÷ 12, biweekly = annual ÷ 26, daily = weekly ÷ days per week.';
  }
  if (frequency === 'biweekly') {
    return 'Annual pay = pay amount × 26. Monthly = annual ÷ 12, weekly = annual ÷ weeks per year, and hourly uses weekly ÷ hours per week.';
  }
  if (frequency === 'monthly') {
    return 'Annual pay = pay amount × 12. Weekly = annual ÷ weeks per year, biweekly = annual ÷ 26, and daily uses weekly ÷ days per week.';
  }
  return 'Annual pay starts from the amount you entered. Monthly = annual ÷ 12, biweekly = annual ÷ 26, weekly = annual ÷ weeks per year, and hourly uses weekly ÷ hours per week.';
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
    `That equals about ${formatCurrency(result.weeklyPay)} per week before taxes.`
  );
  setText(
    outputs.context,
    `Based on ${hoursInput.value || '40'} hrs/week, ${weeksInput.value || '52'} weeks/year, and ${daysInput.value || '5'} workdays/week from ${FREQUENCY_LABELS[frequency]}.`
  );
  setText(outputs.breakdown, buildSalaryBreakdown(frequency));
}

calculateButton?.addEventListener('click', calculate);
