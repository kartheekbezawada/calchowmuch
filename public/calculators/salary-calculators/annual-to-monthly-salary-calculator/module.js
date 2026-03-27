import { setPageMetadata } from '/assets/js/core/ui.js';
import {
  buildSalaryMetadata,
  calculateAnnualToMonthly,
  formatCurrency,
  getInputNumber,
  setText,
} from '/calculators/salary-calculators/shared/salary-utils.js';

const FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'How do you convert annual salary to monthly pay?', acceptedAnswer: { '@type': 'Answer', text: 'Divide the annual salary by 12 to estimate monthly pay.' } },
    { '@type': 'Question', name: 'Is monthly pay just annual salary divided by 12?', acceptedAnswer: { '@type': 'Answer', text: 'For a simple gross-pay estimate, yes. Additional payroll deductions or irregular payments are not included here.' } },
    { '@type': 'Question', name: 'Can I also estimate biweekly pay?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The route can also show biweekly and weekly pay views from the same annual salary input.' } },
    { '@type': 'Question', name: 'Does this show net monthly income?', acceptedAnswer: { '@type': 'Answer', text: 'No. It estimates gross monthly salary before taxes and deductions.' } },
    { '@type': 'Question', name: 'Why might my paycheck differ from the monthly estimate?', acceptedAnswer: { '@type': 'Answer', text: 'Actual paychecks can differ because of pay schedule timing, deductions, benefits, bonuses, and other payroll adjustments.' } },
  ],
};

setPageMetadata(
  buildSalaryMetadata({
    title: 'Annual to Monthly Salary Calculator – Pay Converter',
    description:
      'Convert annual salary into monthly pay, with optional biweekly and weekly estimates based on your yearly income.',
    canonical: 'https://calchowmuch.com/salary-calculators/annual-to-monthly-salary-calculator/',
    name: 'Annual to Monthly Salary Calculator',
    appDescription: 'Convert yearly pay into monthly salary and related pay-period views.',
    featureList: ['Monthly salary estimate', 'Biweekly pay estimate', 'Weekly pay estimate'],
    keywords: 'annual to monthly salary calculator, yearly to monthly pay, annual salary to monthly income',
    faqSchema: FAQ_SCHEMA,
  })
);

const annualInput = document.querySelector('#annual-salary-input');
const weeksInput = document.querySelector('#annual-weeks-input');
const errorNode = document.querySelector('#annual-to-monthly-error');
const noteNode = document.querySelector('#annual-monthly-note');
const contextNode = document.querySelector('#annual-monthly-context');
const breakdownNode = document.querySelector('#annual-monthly-breakdown');

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
  const result = calculateAnnualToMonthly({
    annualSalary: getInputNumber(annualInput),
    weeksPerYear: getInputNumber(weeksInput),
  });

  if (!result) {
    renderError('Enter a valid annual salary and weeks per year.');
    return;
  }

  clearError();
  setText(document.querySelector('#annual-monthly-result'), formatCurrency(result.monthlySalary));
  setText(document.querySelector('#annual-biweekly-result'), formatCurrency(result.biweeklyPay));
  setText(document.querySelector('#annual-weekly-result'), formatCurrency(result.weeklyPay));
  setText(
    noteNode,
    `That equals about ${formatCurrency(result.weeklyPay)} per week before taxes.`
  );
  setText(contextNode, `Based on ${weeksInput.value || '52'} weeks/year for the weekly view.`);
  setText(
    breakdownNode,
    'Monthly salary = annual salary ÷ 12. Biweekly = annual ÷ 26, and weekly = annual ÷ weeks per year.'
  );
}

document.querySelector('#annual-to-monthly-button')?.addEventListener('click', calculate);
