import { setPageMetadata, setupButtonGroup } from '/assets/js/core/ui.js';
import {
  buildSalaryMetadata,
  calculateSalaryCommission,
  formatCurrency,
  formatPercent,
  getInputNumber,
  setFieldState,
  setText,
} from '/calculators/salary-calculators/shared/salary-utils.js';

const FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'How do you calculate commission?', acceptedAnswer: { '@type': 'Answer', text: 'Multiply the sales amount by the commission rate to estimate commission earned.' } },
    { '@type': 'Question', name: 'Can I use a commission rate or a known commission amount?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The route can support either a rate-based input or a known commission amount.' } },
    { '@type': 'Question', name: 'Can I include base pay?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. If base pay is enabled for the route, total earnings can be shown as base pay plus commission.' } },
    { '@type': 'Question', name: 'Does this show effective commission rate?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. If commission and sales are known, the route can also show the effective commission percentage.' } },
    { '@type': 'Question', name: 'Does this include tax deductions?', acceptedAnswer: { '@type': 'Answer', text: 'No. It estimates gross commission earnings only.' } },
  ],
};

setPageMetadata(
  buildSalaryMetadata({
    title: 'Commission Calculator | Calculate Earnings From Sales Commission',
    description:
      'Calculate commission earnings from sales and commission rate, with optional total earnings when base pay is included.',
    canonical: 'https://calchowmuch.com/salary-calculators/commission-calculator/',
    name: 'Commission Calculator',
    appDescription: 'Estimate commission and optional total earnings from sales and commission inputs.',
    featureList: ['Commission estimate', 'Effective commission rate', 'Optional total earnings'],
    keywords: 'commission calculator, sales commission calculator, commission earnings calculator',
    faqSchema: FAQ_SCHEMA,
  })
);

const salesAmountInput = document.querySelector('#commission-sales-amount');
const rateInput = document.querySelector('#commission-rate');
const amountInput = document.querySelector('#commission-amount');
const basePayInput = document.querySelector('#commission-base-pay');
const rateRow = document.querySelector('#commission-rate-row');
const amountRow = document.querySelector('#commission-amount-row');
const errorNode = document.querySelector('#commission-error');
const outputs = {
  commission: document.querySelector('#commission-earned-output'),
  totalEarnings: document.querySelector('#commission-total-earnings'),
  effectiveRate: document.querySelector('#commission-effective-rate'),
  note: document.querySelector('#commission-note'),
};

function renderMode(mode) {
  const amountMode = mode === 'amount';
  setFieldState({ section: rateRow, input: rateInput, active: !amountMode });
  setFieldState({ section: amountRow, input: amountInput, active: amountMode });
}

const modeButtons = setupButtonGroup(document.querySelector('[data-button-group="commission-mode"]'), {
  defaultValue: 'rate',
  onChange: renderMode,
});

renderMode(modeButtons?.getValue() ?? 'rate');

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
  const mode = modeButtons?.getValue() ?? 'rate';
  const rawBasePay = basePayInput?.value?.trim();
  const result = calculateSalaryCommission({
    salesAmount: getInputNumber(salesAmountInput),
    mode,
    commissionRate: getInputNumber(rateInput),
    commissionAmount: getInputNumber(amountInput),
    basePay: rawBasePay ? getInputNumber(basePayInput) : null,
  });

  if (!result) {
    renderError('Enter a valid sales amount and commission value before calculating.');
    return;
  }

  clearError();
  setText(outputs.commission, formatCurrency(result.commissionAmount));
  setText(outputs.totalEarnings, result.totalEarnings === null ? '—' : formatCurrency(result.totalEarnings));
  setText(outputs.effectiveRate, formatPercent(result.effectiveCommissionRate));
  setText(
    outputs.note,
    mode === 'amount'
      ? 'Amount mode uses the commission value you entered directly.'
      : 'Rate mode calculates commission from the sales amount.'
  );
}

document.querySelector('#commission-button')?.addEventListener('click', calculate);
