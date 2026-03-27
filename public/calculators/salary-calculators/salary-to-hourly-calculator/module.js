import { setPageMetadata } from '/assets/js/core/ui.js';
import {
  buildSalaryMetadata,
  calculateSalaryToHourly,
  formatCurrency,
  getInputNumber,
  setText,
} from '/calculators/salary-calculators/shared/salary-utils.js';

const FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'How do you convert salary to hourly pay?', acceptedAnswer: { '@type': 'Answer', text: 'Divide the annual salary by weeks worked per year and then divide again by hours worked per week.' } },
    { '@type': 'Question', name: 'Why does hours per week affect the result?', acceptedAnswer: { '@type': 'Answer', text: 'Because the same salary spread across more or fewer hours produces a different hourly rate.' } },
    { '@type': 'Question', name: 'Can I also see weekly and monthly pay?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Weekly, biweekly, and monthly pay can be shown alongside the hourly estimate.' } },
    { '@type': 'Question', name: 'Does this work for part-time schedules?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The calculation works for any schedule as long as you enter your own hours per week and weeks per year.' } },
    { '@type': 'Question', name: 'Does this include taxes?', acceptedAnswer: { '@type': 'Answer', text: 'No. The calculator estimates gross hourly pay only.' } },
  ],
};

setPageMetadata(
  buildSalaryMetadata({
    title: 'Salary to Hourly Calculator | Convert Annual Salary to Hourly Pay',
    description:
      'Convert annual salary into hourly pay, weekly pay, biweekly pay, and monthly pay using your hours worked and weeks per year.',
    canonical: 'https://calchowmuch.com/salary-calculators/salary-to-hourly-calculator/',
    name: 'Salary to Hourly Calculator',
    appDescription: 'Estimate an hourly rate from an annual salary and work schedule assumptions.',
    featureList: ['Hourly rate estimate', 'Weekly pay estimate', 'Biweekly pay estimate', 'Monthly pay estimate'],
    keywords: 'salary to hourly calculator, annual salary to hourly pay, hourly rate from salary',
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
    `That equals about ${formatCurrency(result.weeklyPay)} per week before taxes.`
  );
  setText(
    contextNode,
    `Based on ${hoursInput.value || '40'} hrs/week and ${weeksInput.value || '52'} weeks/year.`
  );
  setText(
    breakdownNode,
    'Hourly rate = annual salary ÷ weeks per year ÷ hours per week. Monthly = annual ÷ 12 and biweekly = annual ÷ 26.'
  );
}

document.querySelector('#salary-to-hourly-button')?.addEventListener('click', calculate);
