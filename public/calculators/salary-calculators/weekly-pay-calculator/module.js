import { setPageMetadata, setupButtonGroup } from '/assets/js/core/ui.js';
import {
  buildSalaryMetadata,
  calculateWeeklyPay,
  formatCurrency,
  getInputNumber,
  setFieldState,
  setText,
} from '/calculators/salary-calculators/shared/salary-utils.js';

const FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'How do you calculate weekly pay?', acceptedAnswer: { '@type': 'Answer', text: 'Multiply the hourly rate by total weekly hours, or split regular and overtime hours if that mode is enabled.' } },
    { '@type': 'Question', name: 'Can this include overtime hours?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Split mode can estimate weekly pay using separate regular and overtime inputs plus an overtime multiplier.' } },
    { '@type': 'Question', name: 'Can I annualize the weekly result?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The weekly result can be multiplied by weeks per year to estimate annualized pay.' } },
    { '@type': 'Question', name: 'Does this work for part-time schedules?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The calculator works for any schedule as long as you enter the hours that match your workweek.' } },
    { '@type': 'Question', name: 'Does the result include tax deductions?', acceptedAnswer: { '@type': 'Answer', text: 'No. It estimates gross weekly pay only.' } },
  ],
};

setPageMetadata(
  buildSalaryMetadata({
    title: 'Weekly Pay Calculator | Weekly Earnings From Hours, Rate and Overtime',
    description:
      'Estimate weekly gross pay from hourly rate, regular hours, overtime hours, and overtime multiplier, then annualize the result.',
    canonical: 'https://calchowmuch.com/salary-calculators/weekly-pay-calculator/',
    name: 'Weekly Pay Calculator',
    appDescription: 'Estimate weekly earnings from hourly pay and worked hours.',
    featureList: ['Weekly pay estimate', 'Optional overtime split', 'Annualized pay view'],
    keywords: 'weekly pay calculator, weekly salary calculator, weekly earnings calculator',
    faqSchema: FAQ_SCHEMA,
  })
);

const modeGroup = document.querySelector('[data-button-group="weekly-mode"]');
const totalHoursRow = document.querySelector('#weekly-total-hours-row');
const splitGroup = document.querySelector('#weekly-split-hours-group');
const totalHoursInput = document.querySelector('#weekly-total-hours');
const regularHoursInput = document.querySelector('#weekly-regular-hours');
const overtimeHoursInput = document.querySelector('#weekly-overtime-hours');
const overtimeMultiplierInput = document.querySelector('#weekly-overtime-multiplier');

const hourlyRateInput = document.querySelector('#weekly-hourly-rate');
const weeksInput = document.querySelector('#weekly-weeks-per-year');
const errorNode = document.querySelector('#weekly-pay-error');
const outputs = {
  weeklyPay: document.querySelector('#weekly-pay-result'),
  annualizedPay: document.querySelector('#weekly-annualized-pay'),
  note: document.querySelector('#weekly-pay-note'),
  context: document.querySelector('#weekly-pay-context'),
  breakdown: document.querySelector('#weekly-pay-breakdown'),
};

function renderMode(mode) {
  const splitMode = mode === 'split';
  setFieldState({ section: totalHoursRow, input: totalHoursInput, active: !splitMode });
  setFieldState({ section: splitGroup, input: regularHoursInput, active: splitMode });
  if (overtimeHoursInput) {
    overtimeHoursInput.disabled = !splitMode;
    overtimeHoursInput.tabIndex = splitMode ? 0 : -1;
  }
  if (overtimeMultiplierInput) {
    overtimeMultiplierInput.disabled = !splitMode;
    overtimeMultiplierInput.tabIndex = splitMode ? 0 : -1;
  }
}

const modeButtons = setupButtonGroup(modeGroup, {
  defaultValue: 'standard',
  onChange: renderMode,
});

renderMode(modeButtons?.getValue() ?? 'standard');

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
  const mode = modeButtons?.getValue() ?? 'standard';
  const result = calculateWeeklyPay({
    mode,
    hourlyRate: getInputNumber(hourlyRateInput),
    totalWeeklyHours: getInputNumber(totalHoursInput),
    regularHours: getInputNumber(regularHoursInput),
    overtimeHours: getInputNumber(overtimeHoursInput),
    overtimeMultiplier: getInputNumber(overtimeMultiplierInput),
    weeksPerYear: getInputNumber(weeksInput),
  });

  if (!result) {
    renderError('Enter a valid hourly rate and hours before calculating.');
    return;
  }

  clearError();
  setText(outputs.weeklyPay, formatCurrency(result.weeklyPay));
  setText(outputs.annualizedPay, result.annualizedPay === null ? '—' : formatCurrency(result.annualizedPay));
  setText(
    outputs.note,
    result.annualizedPay === null
      ? 'The weekly result is ready. Add weeks per year when you also want a simple annualized estimate.'
      : `At this pace, that projects to about ${formatCurrency(result.annualizedPay)} per year before taxes.`
  );
  setText(
    outputs.context,
    mode === 'split'
      ? `Used ${regularHoursInput.value || '0'} regular hours, ${overtimeHoursInput.value || '0'} overtime hours, and a ${overtimeMultiplierInput.value || '1.5'}x multiplier.`
      : result.annualizedPay === null
      ? `Used ${totalHoursInput.value || '0'} total weekly hours.`
      : `Used ${totalHoursInput.value || '0'} total weekly hours and ${weeksInput.value || '52'} weeks/year for the annualized view.`
  );
  setText(
    outputs.breakdown,
    mode === 'split'
      ? 'Weekly pay = regular hours × hourly rate + overtime hours × hourly rate × overtime multiplier. Annualized pay = weekly pay × weeks per year.'
      : 'Weekly pay = hourly rate × total weekly hours. Annualized pay = weekly pay × weeks per year.'
  );
}

document.querySelector('#weekly-pay-button')?.addEventListener('click', calculate);
