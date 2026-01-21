import { formatNumber } from '/assets/js/core/format.js';
import { hasMaxDigits, toNumber } from '/assets/js/core/validate.js';
import { setPageMetadata } from '/assets/js/core/ui.js';
import { convertLogScaleValue } from '/assets/js/core/logarithm.js';

const typeSelect = document.querySelector('#scale-type');
const decibelSection = document.querySelector('[data-scale="decibel"]');
const phSection = document.querySelector('[data-scale="ph"]');
const richterSection = document.querySelector('[data-scale="richter"]');
const amplitudeInput = document.querySelector('#scale-amplitude');
const referenceInput = document.querySelector('#scale-reference');
const concentrationInput = document.querySelector('#scale-concentration');
const magnitudeInput = document.querySelector('#scale-magnitude');
const richterReferenceInput = document.querySelector('#scale-richter-reference');
const calculateBtn = document.querySelector('#scale-calculate');
const resultDiv = document.querySelector('#scale-result');
const detailDiv = document.querySelector('#scale-detail');

const scaleMetadata = {
  title: 'Log Scale Converter | Calculate How Much',
  description:
    'Convert linear measurements to decibels, pH values, or Richter magnitudes with clear explanations.',
  canonical: 'https://calchowmuch.com/calculators/math/log/log-scale/',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Log scale converter',
    description: 'Switch between decibel, pH, and Richter scale units.',
    step: [
      { '@type': 'HowToStep', text: 'Choose a log scale type and provide the required value.' },
      { '@type': 'HowToStep', text: 'Click Convert to see the logarithmic result and supporting details.' },
      { '@type': 'HowToStep', text: 'Use the detail panel to review the formulas used by each scale.' },
    ],
  },
};

setPageMetadata(scaleMetadata);

function showSection(section) {
  decibelSection.hidden = section !== 'decibel';
  phSection.hidden = section !== 'ph';
  richterSection.hidden = section !== 'richter';
}

function showResult(message) {
  resultDiv.textContent = message;
  detailDiv.textContent = '';
}

function updateResults() {
  const scaleType = typeSelect.value;

  if (!hasMaxDigits(typeSelect.value, 12)) {
    showResult('Invalid selection.');
    return;
  }

  let output = null;
  let detail = '';

  if (scaleType === 'decibel') {
    const amplitude = toNumber(amplitudeInput.value, 2);
    const reference = toNumber(referenceInput.value, 1) || 1;
    output = convertLogScaleValue({ type: 'decibel', amplitude, reference });
    detail = `dB = 20 × log₁₀(amplitude/reference) = 20 × log₁₀(${formatNumber(amplitude)} / ${formatNumber(reference)})`;
  } else if (scaleType === 'ph') {
    const concentration = toNumber(concentrationInput.value, 1e-7);
    output = convertLogScaleValue({ type: 'ph', concentration });
    detail = `pH = -log₁₀([H⁺]) = -log₁₀(${formatNumber(concentration)})`;
  } else if (scaleType === 'richter') {
    const magnitude = toNumber(magnitudeInput.value, 10);
    const reference = toNumber(richterReferenceInput.value, 1) || 1;
    output = convertLogScaleValue({ type: 'richter', magnitude, reference });
    detail = `Richter magnitude = log₁₀(motion/reference) = log₁₀(${formatNumber(magnitude)} / ${formatNumber(reference)})`;
  }

  if (output === null) {
    showResult('Provide valid inputs (positive values where required).');
    return;
  }

  resultDiv.innerHTML = `<strong>${formatNumber(output, { maximumFractionDigits: 4 })}</strong>`;
  detailDiv.textContent = detail;
}

typeSelect?.addEventListener('change', () => {
  showSection(typeSelect.value);
  updateResults();
});

calculateBtn?.addEventListener('click', updateResults);
for (const input of [amplitudeInput, referenceInput, concentrationInput, magnitudeInput, richterReferenceInput]) {
  input?.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      updateResults();
    }
  });
}

showSection(typeSelect.value);
updateResults();
