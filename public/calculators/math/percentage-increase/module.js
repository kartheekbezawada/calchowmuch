import { percentOf, percentageChange } from '/assets/js/core/math.js';
import { formatNumber } from '/assets/js/core/format.js';
import { setupButtonGroup } from '/assets/js/core/ui.js';
import { toNumber } from '/assets/js/core/validate.js';

const modeGroup = document.querySelector('[data-button-group="percent-mode"]');
const modeButtons = setupButtonGroup(modeGroup, {
  defaultValue: 'change',
  onChange: (mode) => {
    switchMode(mode);
    runCalculation(mode);
  },
});
const inputSections = document.querySelectorAll('.input-section');
const calcButtons = document.querySelectorAll('[data-calc]');
const result = document.querySelector('#percent-result');
const details = document.querySelector('#percent-details');

const explanationContainer = document.querySelector('[data-percent-explanation]');
const explanationSections = explanationContainer
  ? Array.from(explanationContainer.querySelectorAll('[data-mode]'))
  : [];

const inputs = {
  change: {
    start: document.querySelector('#percent-change-start'),
    end: document.querySelector('#percent-change-end'),
  },
  'percent-of': {
    rate: document.querySelector('#percent-of-rate'),
    value: document.querySelector('#percent-of-value'),
  },
  increase: {
    base: document.querySelector('#percent-increase-base'),
    rate: document.querySelector('#percent-increase-rate'),
  },
  decrease: {
    base: document.querySelector('#percent-decrease-base'),
    rate: document.querySelector('#percent-decrease-rate'),
  },
  'what-percent': {
    part: document.querySelector('#percent-what-part'),
    total: document.querySelector('#percent-what-total'),
  },
};

function safeFormatNumber(value, maximumFractionDigits = 2) {
  if (value === null || value === undefined || Number.isNaN(value) || !Number.isFinite(value)) {
    return 'N/A';
  }
  return formatNumber(value, { maximumFractionDigits });
}

function safeFormatPercent(
  value,
  maximumFractionDigits = 2,
  withSign = false,
  minimumFractionDigits = 2
) {
  if (value === null || value === undefined || Number.isNaN(value) || !Number.isFinite(value)) {
    return 'N/A';
  }
  const sign = withSign && value > 0 ? '+' : '';
  const formatted = formatNumber(value, { maximumFractionDigits, minimumFractionDigits });
  return `${sign}${formatted}%`;
}

function setResult(text, detailText = '') {
  if (result) {
    result.textContent = text;
  }
  if (details) {
    details.textContent = detailText;
  }
}

function updateExplanationMode(mode) {
  if (!explanationSections.length) {
    return;
  }
  explanationSections.forEach((section) => {
    section.hidden = section.dataset.mode !== mode;
  });
}

function updateExplanationFields(mode, fields) {
  if (!explanationSections.length) {
    return;
  }
  const section = explanationSections.find((item) => item.dataset.mode === mode);
  if (!section) {
    return;
  }

  Object.entries(fields).forEach(([key, value]) => {
    section.querySelectorAll(`[data-field="${key}"]`).forEach((node) => {
      node.textContent = value;
    });
  });
}

function switchMode(mode) {
  inputSections.forEach((section) => {
    section.classList.toggle('active', section.dataset.mode === mode);
  });

  updateExplanationMode(mode);
}

function calculateChange() {
  const startValue = toNumber(inputs.change.start?.value, null);
  const endValue = toNumber(inputs.change.end?.value, null);
  let diff = null;
  let ratio = null;
  let changePercent = null;

  if (!Number.isFinite(startValue)) {
    setResult('Result: Enter a valid starting value.', '');
  } else if (!Number.isFinite(endValue)) {
    setResult('Result: Enter a valid ending value.', '');
  } else if (startValue === 0) {
    diff = endValue - startValue;
    setResult('Result: Starting value must be above 0.', '');
  } else {
    diff = endValue - startValue;
    ratio = diff / startValue;
    changePercent = percentageChange(startValue, endValue);
    const signedPercent = safeFormatPercent(changePercent, 2, true);
    const direction =
      changePercent === 0 ? 'no change' : changePercent > 0 ? 'increase' : 'decrease';
    const formula = `Formula: (${safeFormatNumber(endValue)} - ${safeFormatNumber(
      startValue
    )}) / ${safeFormatNumber(startValue)} x 100 = ${signedPercent}.`;
    const detail =
      direction === 'no change'
        ? `No change from the starting value. ${formula}`
        : `That is a ${direction} of ${safeFormatNumber(
            diff
          )} from the starting value. ${formula}`;
    setResult(`Result: ${signedPercent}`, detail);
  }

  updateExplanationFields('change', {
    'change-start': safeFormatNumber(startValue),
    'change-end': safeFormatNumber(endValue),
    'change-diff': safeFormatNumber(diff),
    'change-ratio': safeFormatNumber(ratio, 4),
    'change-percent': safeFormatPercent(changePercent, 2, true),
  });
}

function calculatePercentOf() {
  const rate = toNumber(inputs['percent-of'].rate?.value, null);
  const value = toNumber(inputs['percent-of'].value?.value, null);
  let output = null;

  if (!Number.isFinite(rate)) {
    setResult('Result: Enter a valid percentage.', '');
  } else if (!Number.isFinite(value)) {
    setResult('Result: Enter a valid value.', '');
  } else {
    output = percentOf(rate, value);
    const formula = `Formula: ${safeFormatNumber(rate)} / 100 x ${safeFormatNumber(
      value
    )} = ${safeFormatNumber(output)}.`;
    setResult(
      `Result: ${safeFormatNumber(output)}`,
      `${safeFormatPercent(rate)} of ${safeFormatNumber(value)} is ${safeFormatNumber(
        output
      )}. ${formula}`
    );
  }

  updateExplanationFields('percent-of', {
    'of-rate': safeFormatPercent(rate),
    'of-decimal': safeFormatNumber(Number.isFinite(rate) ? rate / 100 : null, 4),
    'of-value': safeFormatNumber(value),
    'of-result': safeFormatNumber(output),
  });
}

function calculateIncrease() {
  const base = toNumber(inputs.increase.base?.value, null);
  const rate = toNumber(inputs.increase.rate?.value, null);
  let increaseAmount = null;
  let output = null;

  if (!Number.isFinite(base)) {
    setResult('Result: Enter a valid original value.', '');
  } else if (!Number.isFinite(rate)) {
    setResult('Result: Enter a valid percentage.', '');
  } else {
    increaseAmount = percentOf(rate, base);
    output = base + increaseAmount;
    const formula = `Formula: ${safeFormatNumber(base)} x (1 + ${safeFormatNumber(
      rate
    )} / 100) = ${safeFormatNumber(output)}.`;
    setResult(
      `Result: ${safeFormatNumber(output)}`,
      `Increase amount: ${safeFormatNumber(increaseAmount)}. ${formula}`
    );
  }

  updateExplanationFields('increase', {
    'inc-base': safeFormatNumber(base),
    'inc-rate': safeFormatPercent(rate),
    'inc-amount': safeFormatNumber(increaseAmount),
    'inc-result': safeFormatNumber(output),
  });
}

function calculateDecrease() {
  const base = toNumber(inputs.decrease.base?.value, null);
  const rate = toNumber(inputs.decrease.rate?.value, null);
  let decreaseAmount = null;
  let output = null;

  if (!Number.isFinite(base)) {
    setResult('Result: Enter a valid original value.', '');
  } else if (!Number.isFinite(rate)) {
    setResult('Result: Enter a valid percentage.', '');
  } else {
    decreaseAmount = percentOf(rate, base);
    output = base - decreaseAmount;
    const formula = `Formula: ${safeFormatNumber(base)} x (1 - ${safeFormatNumber(
      rate
    )} / 100) = ${safeFormatNumber(output)}.`;
    setResult(
      `Result: ${safeFormatNumber(output)}`,
      `Decrease amount: ${safeFormatNumber(decreaseAmount)}. ${formula}`
    );
  }

  updateExplanationFields('decrease', {
    'dec-base': safeFormatNumber(base),
    'dec-rate': safeFormatPercent(rate),
    'dec-amount': safeFormatNumber(decreaseAmount),
    'dec-result': safeFormatNumber(output),
  });
}

function calculateWhatPercent() {
  const part = toNumber(inputs['what-percent'].part?.value, null);
  const total = toNumber(inputs['what-percent'].total?.value, null);
  let ratio = null;
  let percent = null;

  if (!Number.isFinite(part)) {
    setResult('Result: Enter a valid part value.', '');
  } else if (!Number.isFinite(total)) {
    setResult('Result: Enter a valid total value.', '');
  } else if (total === 0) {
    setResult('Result: Total value must be above 0.', '');
  } else {
    ratio = part / total;
    percent = ratio * 100;
    const formula = `Formula: ${safeFormatNumber(part)} / ${safeFormatNumber(
      total
    )} x 100 = ${safeFormatPercent(percent)}.`;
    setResult(
      `Result: ${safeFormatPercent(percent)}`,
      `${safeFormatNumber(part)} is ${safeFormatPercent(percent)} of ${safeFormatNumber(
        total
      )}. ${formula}`
    );
  }

  updateExplanationFields('what-percent', {
    'what-part': safeFormatNumber(part),
    'what-total': safeFormatNumber(total),
    'what-ratio': safeFormatNumber(ratio, 4),
    'what-percent': safeFormatPercent(percent),
  });
}

function runCalculation(mode) {
  switch (mode) {
    case 'change':
      calculateChange();
      break;
    case 'percent-of':
      calculatePercentOf();
      break;
    case 'increase':
      calculateIncrease();
      break;
    case 'decrease':
      calculateDecrease();
      break;
    case 'what-percent':
      calculateWhatPercent();
      break;
  }
}

calcButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const mode = button.dataset.calc;
    runCalculation(mode);
  });
});

const initialMode = modeButtons?.getValue() ?? 'change';
switchMode(initialMode);
runCalculation(initialMode);
