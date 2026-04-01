import { setPageMetadata } from '/assets/js/core/ui.js';
import {
  buildSalaryMetadata,
  calculateMonthlyToAnnual,
  formatCurrency,
  getInputNumber,
  setText,
} from '/calculators/salary-calculators/shared/salary-utils.js';

const FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'How do you convert monthly salary to annual pay?', acceptedAnswer: { '@type': 'Answer', text: 'Multiply the monthly salary by 12 to estimate annual pay.' } },
    { '@type': 'Question', name: 'Is yearly salary just monthly pay times 12?', acceptedAnswer: { '@type': 'Answer', text: 'For a simple gross-pay estimate, yes. That is the standard monthly to annual conversion.' } },
    { '@type': 'Question', name: 'Can this show weekly or biweekly pay too?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The calculator also shows weekly and biweekly pay as support outputs.' } },
    { '@type': 'Question', name: 'Does this include bonuses or overtime?', acceptedAnswer: { '@type': 'Answer', text: 'No. The calculator converts the monthly pay you enter and does not add bonus or overtime automatically.' } },
    { '@type': 'Question', name: 'Does it show net income?', acceptedAnswer: { '@type': 'Answer', text: 'No. It estimates gross annual salary before taxes and deductions.' } },
  ],
};

setPageMetadata(
  buildSalaryMetadata({
    title: 'Monthly to Annual Salary Calculator | Convert Monthly Pay to Yearly Salary',
    description:
      'Convert monthly salary into annual pay, then compare biweekly and weekly gross pay from your monthly amount.',
    canonical: 'https://calchowmuch.com/salary-calculators/monthly-to-annual-salary-calculator/',
    name: 'Monthly to Annual Salary Calculator',
    appDescription: 'Convert monthly pay into yearly salary and related pay-period views.',
    featureList: ['Annual salary estimate', 'Biweekly pay estimate', 'Weekly pay estimate'],
    keywords: 'monthly to annual salary calculator, monthly pay to yearly salary, annual salary from monthly income',
    faqSchema: FAQ_SCHEMA,
  })
);

const monthlyInput = document.querySelector('#monthly-salary-input');
const weeksInput = document.querySelector('#monthly-weeks-input');
const errorNode = document.querySelector('#monthly-to-annual-error');
const noteNode = document.querySelector('#monthly-annual-note');
const contextNode = document.querySelector('#monthly-annual-context');
const breakdownNode = document.querySelector('#monthly-annual-breakdown');

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
  const result = calculateMonthlyToAnnual({
    monthlySalary: getInputNumber(monthlyInput),
    weeksPerYear: getInputNumber(weeksInput),
  });

  if (!result) {
    renderError('Enter a valid monthly salary and weeks per year.');
    return;
  }

  clearError();
  setText(document.querySelector('#monthly-annual-result'), formatCurrency(result.annualSalary));
  setText(document.querySelector('#monthly-biweekly-result'), formatCurrency(result.biweeklyPay));
  setText(document.querySelector('#monthly-weekly-result'), formatCurrency(result.weeklyPay));
  setText(
    noteNode,
    `That equals about ${formatCurrency(result.weeklyPay)} per week before taxes.`
  );
  setText(contextNode, `Based on ${weeksInput.value || '52'} weeks/year for the weekly view.`);
  setText(
    breakdownNode,
    'Annual salary = monthly salary × 12. Biweekly = annual ÷ 26, and weekly = annual ÷ weeks per year.'
  );
}

document.querySelector('#monthly-to-annual-button')?.addEventListener('click', calculate);
