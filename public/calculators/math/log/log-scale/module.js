import { formatNumber } from '/assets/js/core/format.js';
import { hasMaxDigits, toNumber } from '/assets/js/core/validate.js';
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
const guideDiv = document.querySelector('#scale-guide');
const snapshotScale = document.querySelector('[data-scale-snap="scale"]');
const snapshotInput = document.querySelector('[data-scale-snap="input"]');
const snapshotResult = document.querySelector('[data-scale-snap="result"]');
const snapshotStatus = document.querySelector('[data-scale-snap="status"]');

const SCALE_LABELS = {
  decibel: 'Decibel',
  ph: 'pH',
  richter: 'Richter',
};

function updateSnapshots({
  scale = SCALE_LABELS[typeSelect?.value] || 'Decibel',
  input = '-',
  result = '-',
  status = '-',
} = {}) {
  if (snapshotScale) {
    snapshotScale.textContent = String(scale);
  }
  if (snapshotInput) {
    snapshotInput.textContent = String(input);
  }
  if (snapshotResult) {
    snapshotResult.textContent = String(result);
  }
  if (snapshotStatus) {
    snapshotStatus.textContent = String(status);
  }
}

function showSection(section) {
  decibelSection.hidden = section !== 'decibel';
  phSection.hidden = section !== 'ph';
  richterSection.hidden = section !== 'richter';
}

function updateGuide(section, payload = {}) {
  if (!guideDiv) {
    return;
  }

  if (section === 'decibel') {
    const ratio = payload.reference ? payload.amplitude / payload.reference : null;
    guideDiv.innerHTML = `
      <article class="lscale-guide-panel">
        <h4>Decibel mode</h4>
        <p>Decibels compare your measured amplitude against the reference with <strong>20 × log₁₀(amplitude / reference)</strong>.</p>
        <ul class="lscale-guide-list">
          <li><strong>Positive dB</strong> means the measured amplitude is above the reference.</li>
          <li><strong>0 dB</strong> means the measured amplitude matches the reference exactly.</li>
          <li><strong>Current ratio:</strong> ${ratio && Number.isFinite(ratio) ? `${formatNumber(ratio, { maximumFractionDigits: 4 })}:1` : 'Enter valid positive values.'}</li>
        </ul>
      </article>
    `;
    return;
  }

  if (section === 'ph') {
    const phValue = payload.output;
    let classification = 'Enter a valid positive concentration.';
    if (Number.isFinite(phValue)) {
      classification = phValue < 7 ? 'Acidic range' : phValue > 7 ? 'Basic range' : 'Neutral point';
    }

    guideDiv.innerHTML = `
      <article class="lscale-guide-panel">
        <h4>pH mode</h4>
        <p>pH converts hydrogen ion concentration into a simple acidity reading with <strong>-log₁₀([H+])</strong>.</p>
        <ul class="lscale-guide-list">
          <li><strong>Lower pH</strong> means a more acidic solution.</li>
          <li><strong>Higher pH</strong> means a less acidic or more basic solution.</li>
          <li><strong>Current reading:</strong> ${classification}</li>
        </ul>
      </article>
    `;
    return;
  }

  guideDiv.innerHTML = `
    <article class="lscale-guide-panel">
      <h4>Richter mode</h4>
      <p>Richter magnitude compares recorded ground motion against a reference with <strong>log₁₀(motion / reference)</strong>.</p>
      <ul class="lscale-guide-list">
        <li>Every +1 step means roughly <strong>10×</strong> greater motion amplitude.</li>
        <li>A result of <strong>0</strong> means the measured motion equals the reference amplitude.</li>
        <li><strong>Current ratio:</strong> ${
          payload.reference && Number.isFinite(payload.magnitude / payload.reference)
            ? `${formatNumber(payload.magnitude / payload.reference, { maximumFractionDigits: 4 })}:1`
            : 'Enter valid positive values.'
        }</li>
      </ul>
    </article>
  `;
}

function showResult(message) {
  resultDiv.textContent = message;
  detailDiv.textContent = '';
  updateSnapshots({ status: 'Invalid input' });
  updateGuide(typeSelect?.value || 'decibel');
}

function updateResults() {
  const scaleType = typeSelect.value;
  resultDiv.textContent = '';
  detailDiv.textContent = '';
  updateSnapshots({ scale: SCALE_LABELS[scaleType] || 'Decibel' });

  if (!hasMaxDigits(typeSelect.value, 12)) {
    showResult('Invalid selection.');
    return;
  }

  let output = null;
  let detail = '';
  let inputSummary = '';
  let status = 'Solved';

  if (scaleType === 'decibel') {
    const amplitude = toNumber(amplitudeInput.value, 2);
    const reference = toNumber(referenceInput.value, 1) || 1;
    output = convertLogScaleValue({ type: 'decibel', amplitude, reference });
    detail = `dB = 20 × log₁₀(amplitude/reference) = 20 × log₁₀(${formatNumber(amplitude)} / ${formatNumber(reference)})`;
    inputSummary = `${formatNumber(amplitude)} vs ${formatNumber(reference)}`;
    updateGuide(scaleType, { amplitude, reference, output });
  } else if (scaleType === 'ph') {
    const concentration = toNumber(concentrationInput.value, 1e-7);
    output = convertLogScaleValue({ type: 'ph', concentration });
    detail = `pH = -log₁₀([H⁺]) = -log₁₀(${formatNumber(concentration)})`;
    inputSummary = `[H+] = ${formatNumber(concentration, { maximumFractionDigits: 8 })}`;
    updateGuide(scaleType, { concentration, output });
  } else if (scaleType === 'richter') {
    const magnitude = toNumber(magnitudeInput.value, 10);
    const reference = toNumber(richterReferenceInput.value, 1) || 1;
    output = convertLogScaleValue({ type: 'richter', magnitude, reference });
    detail = `Richter magnitude = log₁₀(motion/reference) = log₁₀(${formatNumber(magnitude)} / ${formatNumber(reference)})`;
    inputSummary = `${formatNumber(magnitude)} vs ${formatNumber(reference)}`;
    updateGuide(scaleType, { magnitude, reference, output });
  }

  if (output === null) {
    showResult('Provide valid inputs (positive values where required).');
    return;
  }

  const formattedOutput = formatNumber(output, { maximumFractionDigits: 4 });
  const interpretation =
    scaleType === 'decibel'
      ? output > 0
        ? 'Measured amplitude is above the reference.'
        : output < 0
          ? 'Measured amplitude is below the reference.'
          : 'Measured amplitude matches the reference.'
      : scaleType === 'ph'
        ? output < 7
          ? 'This reading is acidic.'
          : output > 7
            ? 'This reading is basic.'
            : 'This reading is neutral.'
        : output > 0
          ? 'Measured ground motion is above the reference.'
          : output < 0
            ? 'Measured ground motion is below the reference.'
            : 'Measured ground motion matches the reference.';

  resultDiv.innerHTML = `
    <article class="lscale-summary-card">
      <h4>${SCALE_LABELS[scaleType]} result</h4>
      <div class="lscale-summary-grid">
        <div class="lscale-stat">
          <span>Scale</span>
          <strong>${SCALE_LABELS[scaleType]}</strong>
        </div>
        <div class="lscale-stat">
          <span>Converted result</span>
          <strong>${formattedOutput}</strong>
        </div>
        <div class="lscale-stat">
          <span>Input</span>
          <strong>${inputSummary}</strong>
        </div>
        <div class="lscale-stat">
          <span>Interpretation</span>
          <strong>${interpretation}</strong>
        </div>
      </div>
    </article>
  `;

  detailDiv.innerHTML = `
    <article class="lscale-detail-panel">
      <h4>Formula Check</h4>
      <p><strong>${detail}</strong></p>
      <p>${interpretation}</p>
      <p>This route preserves the original calculation logic and formats the answer as a quick readout instead of a legacy shell detail block.</p>
    </article>
  `;

  updateSnapshots({
    scale: SCALE_LABELS[scaleType],
    input: inputSummary,
    result: formattedOutput,
    status,
  });
}

typeSelect?.addEventListener('change', () => {
  showSection(typeSelect.value);
  updateResults();
});

calculateBtn?.addEventListener('click', updateResults);
for (const input of [
  amplitudeInput,
  referenceInput,
  concentrationInput,
  magnitudeInput,
  richterReferenceInput,
]) {
  input?.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      updateResults();
    }
  });
}

showSection(typeSelect.value);
updateResults();
