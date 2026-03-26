import { setPageMetadata, setupButtonGroup } from '/assets/js/core/ui.js';
import {
  buildSalaryMetadata,
  calculateRaise,
  formatCurrency,
  formatPercent,
  getInputNumber,
  setFieldState,
  setText,
} from '/calculators/salary-calculators/shared/salary-utils.js';

const FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'How do you calculate a raise?', acceptedAnswer: { '@type': 'Answer', text: 'You can either add a flat raise amount to current salary or multiply current salary by the raise percentage.' } },
    { '@type': 'Question', name: 'Can I use a percent raise or a flat raise amount?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The route should support both modes.' } },
    { '@type': 'Question', name: 'Does this show my new salary after the raise?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The main result is the new salary after applying the raise.' } },
    { '@type': 'Question', name: 'Can I see the raise amount separately?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The output should include the raise amount and the resulting percent increase.' } },
    { '@type': 'Question', name: 'Does this include taxes?', acceptedAnswer: { '@type': 'Answer', text: 'No. It estimates gross pay changes only.' } },
  ],
};

setPageMetadata(
  buildSalaryMetadata({
    title: 'Raise Calculator | Calculate New Salary After a Pay Raise',
    description:
      'Calculate a new salary after a raise using either a percentage increase or a flat raise amount.',
    canonical: 'https://calchowmuch.com/salary-calculators/raise-calculator/',
    name: 'Raise Calculator',
    appDescription: 'Estimate new pay after a raise using either a percentage or flat increase.',
    featureList: ['Percent raise mode', 'Flat raise mode', 'New salary estimate', 'Raise amount and percent outputs'],
    keywords: 'raise calculator, salary raise calculator, pay raise calculator',
    faqSchema: FAQ_SCHEMA,
  })
);

const currentSalaryInput = document.querySelector('#raise-current-salary');
const percentInput = document.querySelector('#raise-percent');
const amountInput = document.querySelector('#raise-amount');
const percentRow = document.querySelector('#raise-percent-row');
const amountRow = document.querySelector('#raise-amount-row');
const errorNode = document.querySelector('#raise-error');
const outputs = {
  newSalary: document.querySelector('#raise-new-salary'),
  raiseAmount: document.querySelector('#raise-amount-output'),
  percentIncrease: document.querySelector('#raise-percent-output'),
  note: document.querySelector('#raise-note'),
};

function renderMode(mode) {
  const amountMode = mode === 'amount';
  setFieldState({ section: percentRow, input: percentInput, active: !amountMode });
  setFieldState({ section: amountRow, input: amountInput, active: amountMode });
}

const modeButtons = setupButtonGroup(document.querySelector('[data-button-group="raise-mode"]'), {
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
  const result = calculateRaise({
    currentSalary: getInputNumber(currentSalaryInput),
    mode,
    raisePercent: getInputNumber(percentInput),
    raiseAmount: getInputNumber(amountInput),
  });

  if (!result) {
    renderError('Enter a valid current salary and raise value before calculating.');
    return;
  }

  clearError();
  setText(outputs.newSalary, formatCurrency(result.newSalary));
  setText(outputs.raiseAmount, formatCurrency(result.raiseAmount));
  setText(outputs.percentIncrease, formatPercent(result.percentIncrease));
  setText(
    outputs.note,
    mode === 'amount'
      ? 'Amount mode added the flat raise value to the current salary.'
      : 'Percent mode calculated the raise from the current salary.'
  );
}

document.querySelector('#raise-button')?.addEventListener('click', calculate);
