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
    { '@type': 'Question', name: 'Can I use a percent raise or a flat raise amount?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The calculator supports both modes.' } },
    { '@type': 'Question', name: 'Does this show my new salary after the raise?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The main result is the new salary after applying the raise.' } },
    { '@type': 'Question', name: 'Can I see the raise amount separately?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The calculator also shows the raise amount and the resulting percent increase.' } },
    { '@type': 'Question', name: 'Does this include taxes?', acceptedAnswer: { '@type': 'Answer', text: 'No. It estimates gross pay changes only.' } },
  ],
};

setPageMetadata(
  buildSalaryMetadata({
    title: 'Raise Calculator | New Salary, Raise Amount and Raise Percentage',
    description:
      'Calculate a new salary after a raise, compare raise amount versus raise percentage, and estimate the gross-pay impact.',
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
  context: document.querySelector('#raise-context'),
  breakdown: document.querySelector('#raise-breakdown'),
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
      ? `That adds ${formatCurrency(result.raiseAmount)} to the current salary before taxes.`
      : `That increases salary by ${formatPercent(result.percentIncrease)} before taxes.`
  );
  setText(
    outputs.context,
    mode === 'amount'
      ? 'Used flat-amount mode to add the raise directly to current salary.'
      : 'Used percent-of-salary mode to calculate the raise amount from current salary.'
  );
  setText(
    outputs.breakdown,
    mode === 'amount'
      ? 'New salary = current salary + flat raise amount. Percent increase = raise amount ÷ current salary × 100.'
      : 'Raise amount = current salary × raise percent. New salary = current salary + raise amount.'
  );
}

document.querySelector('#raise-button')?.addEventListener('click', calculate);
