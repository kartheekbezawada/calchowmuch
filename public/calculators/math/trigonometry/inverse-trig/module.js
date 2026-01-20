import { formatNumber } from '/assets/js/core/format.js';
import { hasMaxDigits, toNumber } from '/assets/js/core/validate.js';
import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import {
  degToRad,
  formatAnglePair,
  getInverseTrigSolutions,
  radToDeg,
} from '/assets/js/core/trigonometry.js';

const valueInput = document.querySelector('#inv-value');
const functionSelect = document.querySelector('#inv-function');
const unitGroup = document.querySelector('[data-button-group="inv-output-unit"]');
const unitButtons = setupButtonGroup(unitGroup, { defaultValue: 'deg' });
const startInput = document.querySelector('#inv-interval-start');
const endInput = document.querySelector('#inv-interval-end');
const calcButton = document.querySelector('#inv-calc');
const resultDiv = document.querySelector('#inv-result');
const detailDiv = document.querySelector('#inv-detail');

const inverseTrigMetadata = {
  title: 'Inverse Trig Functions Calculator | Calculate How Much',
  description:
    'Find arcsin, arccos, or arctan principal values plus every solution within a custom interval.',
  canonical: 'https://calchowmuch.com/calculators/math/trigonometry/inverse-trig/',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What inputs are valid for arcsin or arccos?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Values between -1 and 1 only. The calculator validates the input and warns if the value is outside the domain.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I list all solutions in an interval?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Set the custom interval boundaries and the calculator lists every solution using periodic extensions of the principal value.',
        },
      },
    ],
  },
};

setPageMetadata(inverseTrigMetadata);

function toRadians(value) {
  const unit = unitButtons?.getValue() ?? 'deg';
  return unit === 'deg' ? degToRad(value) : value;
}

function calculate() {
  resultDiv.textContent = '';
  detailDiv.textContent = '';

  const inputs = [valueInput, startInput, endInput];
  if (inputs.find((input) => !hasMaxDigits(input.value, 12))) {
    resultDiv.textContent = 'Inputs are limited to 12 digits.';
    return;
  }

  const rawValue = toNumber(valueInput.value, 0);
  const func = functionSelect.value;
  const start = toNumber(startInput.value, -360);
  const end = toNumber(endInput.value, 360);

  if (start === end) {
    resultDiv.textContent = 'Interval start and end must differ.';
    return;
  }

  const startRad = toRadians(Math.min(start, end));
  const endRad = toRadians(Math.max(start, end));

  const result = getInverseTrigSolutions(func, rawValue, startRad, endRad);
  if (result.error) {
    resultDiv.textContent = result.error;
    return;
  }

  const principalDegrees = radToDeg(result.principal);

  const resultHtml = `
    <div class="result-list">
      <p><strong>Principal value:</strong> ${formatAnglePair(principalDegrees, { normalize: false })}</p>
      <p><strong>Function:</strong> ${func}(x) = ${formatNumber(rawValue, { maximumFractionDigits: 6 })}</p>
    </div>
  `;

  const solutionItems = result.solutions
    .map((value) => `<li>${formatAnglePair(radToDeg(value), { normalize: false })}</li>`)
    .join('');

  const detailHtml = `
    <div class="solution-steps">
      <strong>Solutions in Interval</strong>
      <ul>${solutionItems || '<li>No solutions in the interval.</li>'}</ul>
    </div>
  `;

  resultDiv.innerHTML = resultHtml;
  detailDiv.innerHTML = detailHtml;
}

calcButton.addEventListener('click', calculate);
[valueInput, startInput, endInput, functionSelect].forEach((input) => {
  input.addEventListener('input', calculate);
});
unitGroup?.addEventListener('click', calculate);

calculate();
