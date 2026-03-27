import { formatNumber } from '/assets/js/core/format.js';
import { hasMaxDigits, toNumber } from '/assets/js/core/validate.js';
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
const snapshotBase = document.querySelector('[data-properties-snap="base"]');
const snapshotProduct = document.querySelector('[data-properties-snap="product"]');
const snapshotQuotient = document.querySelector('[data-properties-snap="quotient"]');
const snapshotPower = document.querySelector('[data-properties-snap="power"]');

function updateSnapshots({ base = '-', product = '-', quotient = '-', power = '-' } = {}) {
  if (snapshotBase) {
    snapshotBase.textContent = String(base);
  }
  if (snapshotProduct) {
    snapshotProduct.textContent = String(product);
  }
  if (snapshotQuotient) {
    snapshotQuotient.textContent = String(quotient);
  }
  if (snapshotPower) {
    snapshotPower.textContent = String(power);
  }
}

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
      updateSnapshots();
      return false;
    }
  }
  return true;
}

function updateResults() {
  if (!validateInputs()) {
    return;
  }
  updateSnapshots();

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
    updateSnapshots();
    return;
  }

  const product = logProductRule(base, x, y);
  const quotient = logQuotientRule(base, num, den);
  const power = logPowerRule(base, powValue, exponent);

  if (product === null || quotient === null || power === null) {
    resultDiv.textContent = 'Invalid inputs for the log rules.';
    detailDiv.textContent = '';
    updateSnapshots({ base: formatNumber(base, { maximumFractionDigits: 4 }) });
    return;
  }

  const formattedBase = formatNumber(base, { maximumFractionDigits: 4 });
  const formattedProduct = formatNumber(product, { maximumFractionDigits: 6 });
  const formattedQuotient = formatNumber(quotient, { maximumFractionDigits: 6 });
  const formattedPower = formatNumber(power, { maximumFractionDigits: 6 });

  resultDiv.innerHTML = `
    <article class="lprop-summary-card">
      <h4>Rule Results</h4>
      <div class="lprop-summary-grid">
        <div class="lprop-stat">
          <span>Product rule</span>
          <strong>log_${formattedBase}(${formatNumber(x)} × ${formatNumber(y)}) = ${formattedProduct}</strong>
        </div>
        <div class="lprop-stat">
          <span>Quotient rule</span>
          <strong>log_${formattedBase}(${formatNumber(num)} / ${formatNumber(den)}) = ${formattedQuotient}</strong>
        </div>
        <div class="lprop-stat">
          <span>Power rule</span>
          <strong>log_${formattedBase}(${formatNumber(powValue)}^${formatNumber(exponent, { maximumFractionDigits: 3 })}) = ${formattedPower}</strong>
        </div>
      </div>
    </article>
  `;

  detailDiv.innerHTML = `
    <article class="lprop-detail-panel">
      <h4>Symbolic Rewrites</h4>
      <p><strong>Product:</strong> log_${formattedBase}(${formatNumber(x)} × ${formatNumber(y)}) = log_${formattedBase}(${formatNumber(x)}) + log_${formattedBase}(${formatNumber(y)})</p>
      <p><strong>Quotient:</strong> log_${formattedBase}(${formatNumber(num)} / ${formatNumber(den)}) = log_${formattedBase}(${formatNumber(num)}) - log_${formattedBase}(${formatNumber(den)})</p>
      <p><strong>Power:</strong> log_${formattedBase}(${formatNumber(powValue)}^${formatNumber(exponent, { maximumFractionDigits: 3 })}) = ${formatNumber(exponent, { maximumFractionDigits: 3 })} · log_${formattedBase}(${formatNumber(powValue)})</p>
    </article>
  `;

  updateSnapshots({
    base: formattedBase,
    product: formattedProduct,
    quotient: formattedQuotient,
    power: formattedPower,
  });
}

calculateBtn?.addEventListener('click', updateResults);
for (const input of [
  baseInput,
  productX,
  productY,
  quotientNumerator,
  quotientDenominator,
  powerValue,
  powerExponent,
]) {
  input?.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      updateResults();
    }
  });
}

updateResults();
