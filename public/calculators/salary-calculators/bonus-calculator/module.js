import { setPageMetadata, setupButtonGroup } from '/assets/js/core/ui.js';
import {
  buildSalaryMetadata,
  calculateBonus,
  formatCurrency,
  formatPercent,
  getInputNumber,
  setFieldState,
  setText,
} from '/calculators/salary-calculators/shared/salary-utils.js';

const FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'How do you calculate a bonus from salary?', acceptedAnswer: { '@type': 'Answer', text: 'Multiply salary by the bonus percentage, or enter a known bonus amount directly.' } },
    { '@type': 'Question', name: 'Can I use a percentage or a flat amount?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The route should support both a percent-based bonus and a flat bonus amount.' } },
    { '@type': 'Question', name: 'Does this show total compensation?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Total compensation is the base salary plus bonus amount.' } },
    { '@type': 'Question', name: 'Can I reverse the bonus percent from a known bonus amount?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The route can show bonus percent as a secondary output when salary and bonus amount are known.' } },
    { '@type': 'Question', name: 'Does this include tax on bonuses?', acceptedAnswer: { '@type': 'Answer', text: 'No. It estimates gross bonus and total compensation only.' } },
  ],
};

setPageMetadata(
  buildSalaryMetadata({
    title: 'Bonus Calculator – Salary Bonus Amount or Percent',
    description:
      'Calculate a bonus as a percentage of salary or as a flat amount, and estimate total compensation.',
    canonical: 'https://calchowmuch.com/salary-calculators/bonus-calculator/',
    name: 'Bonus Calculator',
    appDescription: 'Estimate a bonus and total compensation from either a bonus percentage or flat amount.',
    featureList: ['Bonus percent mode', 'Flat bonus mode', 'Total compensation estimate'],
    keywords: 'bonus calculator, salary bonus calculator, annual bonus calculator',
    faqSchema: FAQ_SCHEMA,
  })
);

const salaryAmountInput = document.querySelector('#bonus-salary-amount');
const percentInput = document.querySelector('#bonus-percent');
const amountInput = document.querySelector('#bonus-amount');
const percentRow = document.querySelector('#bonus-percent-row');
const amountRow = document.querySelector('#bonus-amount-row');
const errorNode = document.querySelector('#bonus-error');
const outputs = {
  bonusAmount: document.querySelector('#bonus-amount-output'),
  totalCompensation: document.querySelector('#bonus-total-compensation'),
  bonusPercent: document.querySelector('#bonus-percent-output'),
  note: document.querySelector('#bonus-note'),
  context: document.querySelector('#bonus-context'),
  breakdown: document.querySelector('#bonus-breakdown'),
};

function renderMode(mode) {
  const amountMode = mode === 'amount';
  setFieldState({ section: percentRow, input: percentInput, active: !amountMode });
  setFieldState({ section: amountRow, input: amountInput, active: amountMode });
}

const modeButtons = setupButtonGroup(document.querySelector('[data-button-group="bonus-mode"]'), {
  defaultValue: 'percent',
  onChange: renderMode,
});

renderMode(modeButtons?.getValue() ?? 'percent');

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
  const mode = modeButtons?.getValue() ?? 'percent';
  const result = calculateBonus({
    salaryAmount: getInputNumber(salaryAmountInput),
    mode,
    bonusPercent: getInputNumber(percentInput),
    bonusAmount: getInputNumber(amountInput),
  });

  if (!result) {
    renderError('Enter a valid salary and bonus value before calculating.');
    return;
  }

  clearError();
  setText(outputs.bonusAmount, formatCurrency(result.bonusAmount));
  setText(outputs.totalCompensation, formatCurrency(result.totalCompensation));
  setText(outputs.bonusPercent, formatPercent(result.bonusPercent));
  setText(
    outputs.note,
    `That bonus lifts total compensation to ${formatCurrency(result.totalCompensation)} before taxes.`
  );
  setText(
    outputs.context,
    mode === 'amount'
      ? 'Used flat-amount mode to carry your entered bonus directly into total compensation.'
      : 'Used percent-of-salary mode to calculate the bonus from base salary.'
  );
  setText(
    outputs.breakdown,
    mode === 'amount'
      ? 'Total compensation = salary + flat bonus amount. Effective bonus percent = bonus amount ÷ salary × 100.'
      : 'Bonus amount = salary × bonus percent. Total compensation = salary + bonus amount.'
  );
}

document.querySelector('#bonus-button')?.addEventListener('click', calculate);
