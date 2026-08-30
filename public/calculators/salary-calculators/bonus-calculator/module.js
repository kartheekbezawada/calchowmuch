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

// Keep in sync with the FAQ block in explanation.html (the static build extracts that; this is
// the copy the client-side setPageMetadata swaps in, so drift shows JS vs non-JS crawlers
// different questions).
const FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'How is a bonus calculated from salary?', acceptedAnswer: { '@type': 'Answer', text: 'In percent mode, bonus amount equals salary multiplied by the bonus percentage. In flat-amount mode you enter the bonus directly and the tool works out what percentage of salary it represents.' } },
    { '@type': 'Question', name: 'What is total compensation here?', acceptedAnswer: { '@type': 'Answer', text: 'Base salary plus the bonus amount, before tax. It is the figure to compare when two offers split pay differently between base and bonus.' } },
    { '@type': 'Question', name: 'Is a bonus taxed more than salary?', acceptedAnswer: { '@type': 'Answer', text: 'Not in the end. US employers often withhold a flat 22% on supplemental pay such as bonuses, and other countries use a similar shortcut, but your actual tax is settled on total income when you file. The higher withholding is a cash-flow timing effect, not a higher tax rate.' } },
    { '@type': 'Question', name: 'Does this calculator apply any tax?', acceptedAnswer: { '@type': 'Answer', text: 'No. It returns gross bonus and gross total compensation. For take-home after tax, run the total through the Salary Calculator.' } },
    { '@type': 'Question', name: 'Can I reverse a known bonus into a percentage?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Enter your salary and the bonus in flat-amount mode; the effective bonus percentage is shown next to total compensation.' } },
    { '@type': 'Question', name: 'Should I count a target bonus as guaranteed income?', acceptedAnswer: { '@type': 'Answer', text: 'Usually not. A target is what pays out if performance and company results land as expected. Check the recent payout history and whether it is discretionary before you budget around it.' } },
    { '@type': 'Question', name: 'How does a bonus compare with a raise of the same size?', acceptedAnswer: { '@type': 'Answer', text: 'A raise changes base pay permanently and compounds into future raises; a one-off bonus does neither. Model both in the Raise Calculator to see the multi-year gap.' } },
    { '@type': 'Question', name: 'What about a signing bonus that is clawed back if I leave early?', acceptedAnswer: { '@type': 'Answer', text: 'Model it as flat-amount pay for the first year only, and read the clawback terms carefully: many require repayment of the gross amount even though you received a smaller net payment.' } },
    { '@type': 'Question', name: 'Can the bonus be more than 100% of salary?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The calculator accepts any non-negative amount, so equity-heavy or commission-style packages where variable pay exceeds base are handled; the effective percentage just goes above 100%.' } },
  ],
};

setPageMetadata(
  buildSalaryMetadata({
    title: 'Bonus Calculator (Gross Pay) | Bonus Amount and Total Compensation',
    description:
      'Calculate your bonus as a percentage of salary or a flat amount, then see your total gross compensation before tax — useful for comparing a percentage bonus against a fixed payout or checking how a bonus changes your total pay for the period.',
    canonical: 'https://calchowmuch.com/salary-calculators/bonus-calculator/',
    name: 'Bonus Calculator (Gross Pay)',
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

calculate();
