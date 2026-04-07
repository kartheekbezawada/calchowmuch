import { setPageMetadata, setupButtonGroup } from '/assets/js/core/ui.js';
import {
  buildSalaryMetadata,
  calculateWeeklyPay,
  copyTextToClipboard,
  formatCurrency,
  formatInputValue,
  getInputNumber,
  setFieldState,
  setText,
} from '/calculators/salary-calculators/shared/salary-utils.js';

const FAQ_ITEMS = [
  {
    question: 'How do you calculate weekly pay?',
    answer:
      'Multiply hourly rate by total weekly hours, or split regular and overtime hours and add them together using your overtime multiplier.',
  },
  {
    question: 'Does this show gross or take-home pay?',
    answer:
      'It shows gross weekly pay only before taxes, deductions, retirement contributions, or benefit costs.',
  },
  {
    question: 'Can this include overtime?',
    answer:
      'Yes. Split mode estimates weekly pay with separate regular and overtime hours plus the multiplier you enter.',
  },
  {
    question: 'What does annualized pay mean here?',
    answer:
      'Annualized pay is a simple projection that multiplies one typical week by the number of paid weeks you enter.',
  },
  {
    question: 'Can I use this for part-time or shift work?',
    answer:
      'Yes. Weekly pay is often more useful than annual salary when your hours vary or your schedule changes week to week.',
  },
  {
    question: 'Why keep split mode optional?',
    answer:
      'Most users want the fast weekly answer first, so standard mode stays simple and overtime stays available only when you need it.',
  },
  {
    question: 'Should I use weekly pay or annualized pay for budgeting?',
    answer:
      'Use weekly pay for short-term cash flow and annualized pay for rough planning when the weekly pattern is stable.',
  },
  {
    question: 'Does this include taxes or deductions?',
    answer: 'No. It estimates gross weekly pay only.',
  },
  {
    question: 'Can I compare overtime scenarios with this?',
    answer:
      'Yes. Switch between standard and split mode or change the overtime multiplier to compare how weekly earnings move.',
  },
  {
    question: 'Are my inputs stored?',
    answer: 'No. All calculations run locally in your browser and nothing is stored.',
  },
];

const FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

setPageMetadata(
  buildSalaryMetadata({
    title: 'Weekly Pay Calculator (Gross Pay) | Weekly Earnings and Annualized Pay',
    description:
      'Estimate weekly gross pay from hourly rate, regular hours, overtime hours, and overtime multiplier, then annualize the result.',
    canonical: 'https://calchowmuch.com/salary-calculators/weekly-pay-calculator/',
    name: 'Weekly Pay Calculator (Gross Pay)',
    appDescription: 'Estimate weekly gross earnings from hourly pay, hours worked, and optional overtime.',
    featureList: ['Weekly gross pay', 'Optional overtime split', 'Annualized gross pay'],
    keywords: 'weekly pay calculator gross pay, weekly earnings calculator, overtime weekly pay',
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
const copyButton = document.querySelector('#weekly-copy-summary');
const copyFeedback = document.querySelector('#weekly-copy-feedback');
const dirtyChip = document.querySelector('#weekly-dirty-chip');

const outputs = {
  weeklyPay: document.querySelector('#weekly-pay-result'),
  annualizedPay: document.querySelector('#weekly-annualized-pay'),
  note: document.querySelector('#weekly-pay-note'),
  context: document.querySelector('#weekly-pay-context'),
  breakdown: document.querySelector('#weekly-pay-breakdown'),
};

let latestSummary = '';
let copyTimer = null;

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
  onChange: (value) => {
    renderMode(value);
    markDirty();
  },
});

renderMode(modeButtons?.getValue() ?? 'standard');

function renderError(message) {
  if (!errorNode) {
    return;
  }
  errorNode.hidden = false;
  errorNode.textContent = message;
}

function clearError() {
  if (!errorNode) {
    return;
  }
  errorNode.hidden = true;
  errorNode.textContent = '';
}

function setDirty(isDirty) {
  if (!dirtyChip) {
    return;
  }
  dirtyChip.textContent = isDirty ? 'Inputs changed - click Calculate to update' : 'Up to date';
  dirtyChip.classList.toggle('is-dirty', isDirty);
}

function markDirty() {
  setDirty(true);
  clearError();
}

function setCopyFeedback(message, tone = 'success') {
  if (!copyFeedback) {
    return;
  }
  copyFeedback.textContent = message;
  copyFeedback.dataset.tone = tone;
  copyFeedback.classList.add('is-visible');
  window.clearTimeout(copyTimer);
  copyTimer = window.setTimeout(() => {
    copyFeedback.classList.remove('is-visible');
    copyFeedback.textContent = '';
    delete copyFeedback.dataset.tone;
  }, 1800);
}

function buildAssumptionsLine(mode) {
  if (mode === 'split') {
    return `Assumptions: split mode · ${formatInputValue(
      regularHoursInput,
      '0'
    )} regular hours · ${formatInputValue(overtimeHoursInput, '0')} overtime hours · ${formatInputValue(
      overtimeMultiplierInput,
      '1.5'
    )}x overtime multiplier · ${formatInputValue(weeksInput, '52')} weeks/year.`;
  }

  return `Assumptions: standard mode · ${formatInputValue(
    totalHoursInput,
    '40'
  )} total weekly hours · ${formatInputValue(weeksInput, '52')} weeks/year.`;
}

function buildCopySummary(result, mode) {
  const annualizedLine =
    result.annualizedPay === null
      ? 'Annualized pay not shown because weeks per year was left blank.'
      : `${formatCurrency(result.annualizedPay)} annualized gross pay.`;

  return [
    `Gross (before tax): ${formatCurrency(result.weeklyPay)} weekly pay. ${annualizedLine}`,
    buildAssumptionsLine(mode),
  ].join('\n');
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
  setText(
    outputs.annualizedPay,
    result.annualizedPay === null ? 'Not set' : formatCurrency(result.annualizedPay)
  );
  setText(
    outputs.note,
    result.annualizedPay === null
      ? `Gross (before tax), that equals about ${formatCurrency(result.weeklyPay)} for a typical week.`
      : `Gross (before tax), that equals about ${formatCurrency(
          result.weeklyPay
        )} per week and ${formatCurrency(result.annualizedPay)} annualized.`
  );
  setText(outputs.context, buildAssumptionsLine(mode));
  setText(
    outputs.breakdown,
    mode === 'split'
      ? 'Weekly pay = regular hours x hourly rate + overtime hours x hourly rate x overtime multiplier. Annualized pay = weekly pay x weeks per year.'
      : 'Weekly pay = hourly rate x total weekly hours. Annualized pay = weekly pay x weeks per year.'
  );
  latestSummary = buildCopySummary(result, mode);
  setDirty(false);
}

async function copySummary() {
  const copied = await copyTextToClipboard(latestSummary);
  setCopyFeedback(copied ? 'Summary copied.' : 'Copy failed.', copied ? 'success' : 'error');
}

[
  hourlyRateInput,
  totalHoursInput,
  regularHoursInput,
  overtimeHoursInput,
  overtimeMultiplierInput,
  weeksInput,
].forEach((input) => {
  input?.addEventListener('input', markDirty);
  input?.addEventListener('change', markDirty);
  input?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      calculate();
    }
  });
});

document.querySelector('#weekly-pay-button')?.addEventListener('click', calculate);
copyButton?.addEventListener('click', () => {
  void copySummary();
});

calculate();
