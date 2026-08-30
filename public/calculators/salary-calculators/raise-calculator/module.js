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

// Keep in sync with the FAQ block in explanation.html (static build extracts that; this copy is
// what the client-side setPageMetadata swaps in).
const FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'How do you calculate a raise?', acceptedAnswer: { '@type': 'Answer', text: 'In percent mode, raise amount equals current salary multiplied by the raise percentage. In flat-amount mode you enter the raise directly. New salary is current salary plus the raise amount.' } },
    { '@type': 'Question', name: 'Percent raise or flat amount - which should I use?', acceptedAnswer: { '@type': 'Answer', text: 'Use whichever your offer is quoted in. The calculator shows the other automatically, so you can compare a 5% offer and a $4,000 offer side by side.' } },
    { '@type': 'Question', name: 'Does this show my new salary after tax?', acceptedAnswer: { '@type': 'Answer', text: 'No. It returns gross figures. Run the new salary through the Salary Calculator for a take-home estimate.' } },
    { '@type': 'Question', name: 'How do I know if a raise beats inflation?', acceptedAnswer: { '@type': 'Answer', text: 'Multiply your old salary by (1 + inflation rate) for each year since your last raise. If your new salary is above that keep-pace figure, the raise is a real gain.' } },
    { '@type': 'Question', name: 'What is a "real" raise?', acceptedAnswer: { '@type': 'Answer', text: 'The part of the increase left after inflation. A 3% raise in a year of 4% inflation is a real pay cut of about 1%, even though the number on the letter went up.' } },
    { '@type': 'Question', name: 'Is a 3% raise good?', acceptedAnswer: { '@type': 'Answer', text: 'It depends on inflation and your market. In a low-inflation year 3% is a real gain; in a high-inflation year it can be a real cut. Compare it against your sector typical increase as well.' } },
    { '@type': 'Question', name: 'Does a raise compound?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Next year percentage raise is calculated on the higher base, so raises build on each other over a career - unlike a one-off bonus.' } },
    { '@type': 'Question', name: 'What about a promotion with a title change?', acceptedAnswer: { '@type': 'Answer', text: 'Model the salary jump the same way; the calculator does not care why the number changed. Check whether the new role also changes your bonus target or benefits.' } },
    { '@type': 'Question', name: 'Can I model a pay freeze or a cut?', acceptedAnswer: { '@type': 'Answer', text: 'Enter 0 for no change and use the inflation check to see the real erosion. The calculator expects a non-negative raise, so for an actual cut, compare the two salaries directly.' } },
  ],
};

setPageMetadata(
  buildSalaryMetadata({
    title: 'Raise Calculator | New Salary, Raise Percentage and Value After Inflation',
    description:
      'Work out your new salary after a raise, compare a percentage raise with a flat amount, and check whether the increase actually beats inflation in real terms.',
    canonical: 'https://calchowmuch.com/salary-calculators/raise-calculator/',
    name: 'Raise Calculator',
    appDescription: 'Estimate new pay after a raise using a percentage or flat increase, and check it against inflation.',
    featureList: ['Percent raise mode', 'Flat raise mode', 'New salary estimate', 'Raise amount and percent outputs', 'Raise vs inflation check'],
    keywords: 'raise calculator, salary raise calculator, pay raise calculator, raise vs inflation, real salary raise, salary increase calculator',
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

calculate();
