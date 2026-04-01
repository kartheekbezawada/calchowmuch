import { setPageMetadata } from '/assets/js/core/ui.js';
import {
  buildSalaryMetadata,
  calculateOvertimePay,
  formatCurrency,
  getInputNumber,
  setText,
} from '/calculators/salary-calculators/shared/salary-utils.js';

const FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'How do you calculate overtime pay?', acceptedAnswer: { '@type': 'Answer', text: 'Multiply the hourly rate by overtime hours and the overtime multiplier.' } },
    { '@type': 'Question', name: 'Why is the overtime multiplier editable?', acceptedAnswer: { '@type': 'Answer', text: 'Overtime treatment can vary by employer or situation, so you need to enter the multiplier that matches your case.' } },
    { '@type': 'Question', name: 'Can I include total pay with overtime?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. If base pay is entered, the calculator can show total pay plus overtime.' } },
    { '@type': 'Question', name: 'Does this route assume a legal overtime rule?', acceptedAnswer: { '@type': 'Answer', text: 'No. It is a user-input calculator and does not imply one legal overtime standard.' } },
    { '@type': 'Question', name: 'Does the result include tax deductions?', acceptedAnswer: { '@type': 'Answer', text: 'No. It estimates gross overtime pay only.' } },
  ],
};

setPageMetadata(
  buildSalaryMetadata({
    title: 'Overtime Pay Calculator | Extra Pay and Total Gross Earnings',
    description:
      'Estimate overtime pay from hourly rate, overtime hours, and multiplier, then compare overtime-only pay with total gross earnings.',
    canonical: 'https://calchowmuch.com/salary-calculators/overtime-pay-calculator/',
    name: 'Overtime Pay Calculator',
    appDescription: 'Estimate extra earnings from overtime hours using your own overtime multiplier.',
    featureList: ['Overtime pay estimate', 'Editable overtime multiplier', 'Optional total pay view'],
    keywords: 'overtime pay calculator, overtime calculator, overtime wage calculator',
    faqSchema: FAQ_SCHEMA,
  })
);

const hourlyRateInput = document.querySelector('#overtime-hourly-rate');
const overtimeHoursInput = document.querySelector('#overtime-hours');
const overtimeMultiplierInput = document.querySelector('#overtime-multiplier');
const basePayInput = document.querySelector('#overtime-base-pay');
const errorNode = document.querySelector('#overtime-pay-error');
const outputs = {
  overtimePay: document.querySelector('#overtime-pay-result'),
  totalPay: document.querySelector('#overtime-total-pay'),
  note: document.querySelector('#overtime-pay-note'),
  context: document.querySelector('#overtime-pay-context'),
  breakdown: document.querySelector('#overtime-pay-breakdown'),
};

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
  const rawBasePay = basePayInput?.value?.trim();
  const result = calculateOvertimePay({
    hourlyRate: getInputNumber(hourlyRateInput),
    overtimeHours: getInputNumber(overtimeHoursInput),
    overtimeMultiplier: getInputNumber(overtimeMultiplierInput),
    basePay: rawBasePay ? getInputNumber(basePayInput) : null,
  });

  if (!result) {
    renderError('Enter a valid hourly rate, overtime hours, and multiplier before calculating.');
    return;
  }

  clearError();
  setText(outputs.overtimePay, formatCurrency(result.overtimePay));
  setText(outputs.totalPay, result.totalPay === null ? '—' : formatCurrency(result.totalPay));
  setText(
    outputs.note,
    rawBasePay
      ? `The overtime portion adds ${formatCurrency(result.overtimePay)} before taxes.`
      : `The route is showing the overtime portion only, before taxes.`
  );
  setText(
    outputs.context,
    `Based on ${overtimeHoursInput.value || '0'} overtime hours at ${overtimeMultiplierInput.value || '1.5'}x.`
  );
  setText(
    outputs.breakdown,
    rawBasePay
      ? 'Overtime pay = hourly rate × overtime hours × overtime multiplier, then total pay = base pay + overtime pay.'
      : 'Overtime pay = hourly rate × overtime hours × overtime multiplier.'
  );
}

document.querySelector('#overtime-pay-button')?.addEventListener('click', calculate);
