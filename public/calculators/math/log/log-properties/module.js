import { formatNumber } from '/assets/js/core/format.js';
import { hasMaxDigits, toNumber } from '/assets/js/core/validate.js';
import { setPageMetadata } from '/assets/js/core/ui.js';
import { logProductRule, logQuotientRule, logPowerRule } from '/assets/js/core/logarithm.js';

const baseInput = document.querySelector('#properties-base');
const productX = document.querySelector('#properties-product-x');
const productY = document.querySelector('#properties-product-y');
const quotientNumerator = document.querySelector('#properties-quot-n');
const quotientDenominator = document.querySelector('#properties-quot-d');
const powerValue = document.querySelector('#properties-power-value');
const powerExponent = document.querySelector('#properties-power-exp');
const resultDiv = document.querySelector('#properties-result');
const detailDiv = document.querySelector('#properties-detail');
const calculateBtn = document.querySelector('#properties-calculate');

const logPropMetadata = {
  title: 'Logarithm Properties | Calculate How Much',
  description:
    'See how the product, quotient, and power rules simplify logarithmic expressions with any base.',
  canonical: 'https://calchowmuch.com/calculators/math/log/log-properties/',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Logarithm property explorer',
    description: 'Inspect the product, quotient, and power rules before simplifying expressions.',
    step: [
      { '@type': 'HowToStep', text: 'Enter a base and positive operands for each rule.' },
      { '@type': 'HowToStep', text: 'Hit Apply log rules to view each result.' },
      { '@type': 'HowToStep', text: 'Use the detail panel to read the symbolic rewrites.' },
    ],
  },
};

setPageMetadata(logPropMetadata);

function validateInputs() {
  const inputs = [
    baseInput,
    productX,
    productY,
    quotientNumerator,
    quotientDenominator,
    powerValue,
    powerExponent,
  ];

  for (const input of inputs) {
    if (input && !hasMaxDigits(input.value, 12)) {
      resultDiv.textContent = 'Inputs are limited to 12 digits.';
      detailDiv.textContent = '';
      return false;
    }
  }
  return true;
}

function updateResults() {
  if (!validateInputs()) {
    return;
  }

  const base = toNumber(baseInput.value, 10);
  const x = toNumber(productX.value, 1);
  const y = toNumber(productY.value, 1);
  const num = toNumber(quotientNumerator.value, 1);
  const den = toNumber(quotientDenominator.value, 1);
  const powValue = toNumber(powerValue.value, 1);
  const exponent = toNumber(powerExponent.value, 2);

  if (base <= 0 || base === 1) {
    resultDiv.textContent = 'Base must be positive and not equal to 1.';
    detailDiv.textContent = '';
    return;
  }

  const product = logProductRule(base, x, y);
  const quotient = logQuotientRule(base, num, den);
  const power = logPowerRule(base, powValue, exponent);

  if (product === null || quotient === null || power === null) {
    resultDiv.innerHTML = '<strong>Invalid inputs for the log rules.</strong>';
    detailDiv.textContent = '';
    return;
  }

  resultDiv.innerHTML = `
    <p><strong>Product rule:</strong> log_${formatNumber(base)}(${formatNumber(x)} × ${formatNumber(y)}) = ${formatNumber(
    product,
    { maximumFractionDigits: 6 }
  )}</p>
    <p><strong>Quotient rule:</strong> log_${formatNumber(base)}(${formatNumber(num)} / ${formatNumber(den)}) = ${formatNumber(
    quotient,
    { maximumFractionDigits: 6 }
  )}</p>
    <p><strong>Power rule:</strong> log_${formatNumber(base)}(${formatNumber(powValue)}^{${formatNumber(
    exponent,
    { maximumFractionDigits: 3 }
  )}}) = ${formatNumber(power, { maximumFractionDigits: 6 })}</p>
  `;

  detailDiv.innerHTML = `Product rule: log_${formatNumber(base)}(${formatNumber(x)} × ${formatNumber(y)}) = log_${formatNumber(base)}(${formatNumber(
    x
  )}) + log_${formatNumber(base)}(${formatNumber(y)}) ; Quotient rule: log_${formatNumber(base)}(${formatNumber(num)}) - log_${formatNumber(base)}(${formatNumber(den)}) ; Power rule: ${formatNumber(
    exponent,
    { maximumFractionDigits: 3 }
  )} × log_${formatNumber(base)}(${formatNumber(powValue)})`;
}

calculateBtn?.addEventListener('click', updateResults);
for (const input of [baseInput, productX, productY, quotientNumerator, quotientDenominator, powerValue, powerExponent]) {
  input?.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      updateResults();
    }
  });
}

updateResults();
