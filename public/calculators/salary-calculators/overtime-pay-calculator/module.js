import { setPageMetadata } from '/assets/js/core/ui.js';
import {
  buildSalaryMetadata,
  calculateOvertimePay,
  formatCurrency,
  getInputNumber,
  setText,
} from '/calculators/salary-calculators/shared/salary-utils.js';

// Keep in sync with the FAQ block in explanation.html (static build extracts that; this copy is
// what the client-side setPageMetadata swaps in).
const FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'How do you calculate overtime pay?', acceptedAnswer: { '@type': 'Answer', text: 'Multiply your hourly rate by the overtime hours and by the overtime multiplier. At $25 an hour, 10 hours at 1.5x is $375.' } },
    { '@type': 'Question', name: 'Why does the calculator make me enter the multiplier?', acceptedAnswer: { '@type': 'Answer', text: 'Overtime rules vary by country, state, employer, and shift. Rather than assume one standard the tool cannot verify, it uses the multiplier that matches your situation.' } },
    { '@type': 'Question', name: 'What is time-and-a-half versus double-time?', acceptedAnswer: { '@type': 'Answer', text: 'Time-and-a-half is a 1.5x multiplier, common for hours over a weekly or daily threshold. Double-time is 2x, often used for holidays or hours past a second threshold.' } },
    { '@type': 'Question', name: 'Is overtime taxed at a higher rate?', acceptedAnswer: { '@type': 'Answer', text: 'No. Overtime is taxed at your normal rates when you file. A larger single paycheck can have more tax withheld for that period, but that is a timing effect, not a higher rate.' } },
    { '@type': 'Question', name: 'Do salaried employees get overtime?', acceptedAnswer: { '@type': 'Answer', text: 'Often not. Employees classified as exempt typically receive no overtime premium, so extra hours add nothing on this calculator for them.' } },
    { '@type': 'Question', name: 'What rate should I enter if I get shift bonuses?', acceptedAnswer: { '@type': 'Answer', text: 'Use the blended regular rate, not just your base wage. Shift differentials and non-discretionary bonuses can raise the rate overtime must be calculated on.' } },
    { '@type': 'Question', name: 'Can I get my full weekly pay from this?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Set base pay to your regular hours times your rate, add the overtime block, and total pay is your weekly gross before tax.' } },
    { '@type': 'Question', name: 'Does the result include tax or deductions?', acceptedAnswer: { '@type': 'Answer', text: 'No. It returns gross overtime and gross total pay. Run the total through the Salary Calculator for a take-home estimate.' } },
    { '@type': 'Question', name: 'Should I rely on overtime for regular budgeting?', acceptedAnswer: { '@type': 'Answer', text: 'Treat it as a cushion, not core income. Overtime can be reduced or removed without notice, so budget from base pay and use overtime to pay down debt or add to savings.' } },
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

calculate();
