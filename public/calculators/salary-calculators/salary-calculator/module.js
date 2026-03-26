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

function calculate() {
  const result = calculateSalaryConversion({
    amount: getInputNumber(amountInput),
    frequency: frequencyButtons?.getValue() ?? 'annual',
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
    `Started from ${FREQUENCY_LABELS[frequencyButtons?.getValue() ?? 'annual']} and converted using ${weeksInput.value || '52'} weeks, ${hoursInput.value || '40'} hours, and ${daysInput.value || '5'} workdays.`
  );
}

calculateButton?.addEventListener('click', calculate);
