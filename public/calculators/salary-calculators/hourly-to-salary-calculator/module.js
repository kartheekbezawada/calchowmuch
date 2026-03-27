import { setPageMetadata } from '/assets/js/core/ui.js';
import {
  buildSalaryMetadata,
  calculateHourlyToSalary,
  formatCurrency,
  getInputNumber,
  setText,
} from '/calculators/salary-calculators/shared/salary-utils.js';

const FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'How do you convert hourly pay to annual salary?', acceptedAnswer: { '@type': 'Answer', text: 'Multiply the hourly rate by hours worked per week and weeks worked per year.' } },
    { '@type': 'Question', name: 'What assumptions affect the result most?', acceptedAnswer: { '@type': 'Answer', text: 'Hours per week and weeks per year are the main assumptions because they determine the total number of paid hours.' } },
    { '@type': 'Question', name: 'Can I estimate monthly and biweekly pay too?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The route can also show monthly, biweekly, and weekly equivalents after calculating annual salary.' } },
    { '@type': 'Question', name: 'Does this calculator include overtime?', acceptedAnswer: { '@type': 'Answer', text: 'No. It is designed for standard hourly-to-salary conversion rather than overtime-specific rules.' } },
    { '@type': 'Question', name: 'Does the result include taxes?', acceptedAnswer: { '@type': 'Answer', text: 'No. The result is a gross-pay estimate before taxes and deductions.' } },
  ],
};

setPageMetadata(
  buildSalaryMetadata({
    title: 'Hourly to Salary Calculator | Convert Hourly Pay to Annual Salary',
    description:
      'Convert an hourly wage into annual salary, monthly pay, biweekly pay, and weekly pay using your hours worked and weeks per year.',
    canonical: 'https://calchowmuch.com/salary-calculators/hourly-to-salary-calculator/',
    name: 'Hourly to Salary Calculator',
    appDescription: 'Estimate annual salary and pay-period equivalents from an hourly wage.',
    featureList: ['Annual salary estimate', 'Monthly pay estimate', 'Biweekly pay estimate', 'Weekly pay estimate'],
    keywords: 'hourly to salary calculator, hourly wage to salary, hourly pay to annual salary',
    faqSchema: FAQ_SCHEMA,
  })
);

const hourlyRateInput = document.querySelector('#hourly-rate');
const hoursInput = document.querySelector('#hourly-hours-per-week');
const weeksInput = document.querySelector('#hourly-weeks-per-year');
const errorNode = document.querySelector('#hourly-error');

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
    document.querySelector('#hourly-result-note'),
    `Based on ${hoursInput.value || '40'} hours per week over ${weeksInput.value || '52'} weeks per year.`
  );
}

document.querySelector('#hourly-calc-button')?.addEventListener('click', calculate);
