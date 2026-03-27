import { formatNumber } from '/assets/js/core/format.js';
import { hasMaxDigits, toNumber } from '/assets/js/core/validate.js';
import { solveSimpleExponential } from '/assets/js/core/logarithm.js';

const baseInput = document.querySelector('#exp-base');
const targetInput = document.querySelector('#exp-target');
const multiplierInput = document.querySelector('#exp-mult');
const shiftInput = document.querySelector('#exp-shift');
const resultDiv = document.querySelector('#exp-result');
const detailDiv = document.querySelector('#exp-detail');
const calculateBtn = document.querySelector('#exp-calculate');
const graphCanvas = document.querySelector('#exp-graph');
const graphNote = document.querySelector('#exp-graph-note');
const snapshotBase = document.querySelector('[data-exp-snap="base"]');
const snapshotTarget = document.querySelector('[data-exp-snap="target"]');
const snapshotSolution = document.querySelector('[data-exp-snap="solution"]');
const snapshotStatus = document.querySelector('[data-exp-snap="status"]');

function updateSnapshots({ base = '-', target = '-', solution = '-', status = '-' } = {}) {
  if (snapshotBase) {
    snapshotBase.textContent = String(base);
  }
  if (snapshotTarget) {
    snapshotTarget.textContent = String(target);
  }
  if (snapshotSolution) {
    snapshotSolution.textContent = String(solution);
  }
  if (snapshotStatus) {
    snapshotStatus.textContent = String(status);
  }
}

function drawExponentialCurve(canvas, { base, multiplier, shift, solution, target }) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const margin = 28;
  ctx.clearRect(0, 0, width, height);

  const xMin = Math.min(-2, solution - 3);
  const xMax = Math.max(6, solution + 3);
  const sampleYs = [];

  for (let i = 0; i <= 120; i += 1) {
    const x = xMin + (i / 120) * (xMax - xMin);
    const y = Math.pow(base, multiplier * x + shift);
    if (Number.isFinite(y)) {
      sampleYs.push(y);
    }
  }

  const yMin = 0;
  const yMax = Math.max(target * 1.25, ...sampleYs, 1);

  const toCanvasX = (x) => margin + ((x - xMin) / (xMax - xMin)) * (width - 2 * margin);
  const toCanvasY = (y) => height - margin - ((y - yMin) / (yMax - yMin)) * (height - 2 * margin);

  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(margin, height - margin);
  ctx.lineTo(width - margin, height - margin);
  ctx.moveTo(margin, height - margin);
  ctx.lineTo(margin, margin);
  ctx.stroke();

  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= 120; i += 1) {
    const x = xMin + (i / 120) * (xMax - xMin);
    const y = Math.pow(base, multiplier * x + shift);
    const cx = toCanvasX(x);
    const cy = toCanvasY(Math.min(y, yMax));
    if (i === 0) {
      ctx.moveTo(cx, cy);
    } else {
      ctx.lineTo(cx, cy);
    }
  }
  ctx.stroke();

  const pointX = toCanvasX(solution);
  const pointY = toCanvasY(target);
  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pointX, height - margin);
  ctx.lineTo(pointX, pointY);
  ctx.moveTo(margin, pointY);
  ctx.lineTo(pointX, pointY);
  ctx.stroke();

  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.arc(pointX, pointY, 4, 0, Math.PI * 2);
  ctx.fill();
}

function showMessage(message) {
  resultDiv.textContent = message;
  detailDiv.textContent = '';
  updateSnapshots({ status: 'Invalid input' });
  if (graphNote) {
    graphNote.textContent = 'Graph updates after the equation is solved.';
  }
}

function updateResults() {
  if (
    !hasMaxDigits(baseInput.value, 12) ||
    !hasMaxDigits(targetInput.value, 12) ||
    !hasMaxDigits(multiplierInput.value, 12) ||
    !hasMaxDigits(shiftInput.value, 12)
  ) {
    showMessage('Inputs are limited to 12 digits.');
    return;
  }

  const base = toNumber(baseInput.value, 2);
  const target = toNumber(targetInput.value, 16);
  const multiplier = toNumber(multiplierInput.value, 1);
  const shift = toNumber(shiftInput.value, 0);

  if (base <= 0 || base === 1 || multiplier === 0 || target <= 0) {
    showMessage('Base must be >0 and ≠1, multiplier ≠ 0, and target must be positive.');
    return;
  }

  const solution = solveSimpleExponential({ base, target, multiplier, shift });
  if (solution === null) {
    showMessage('Unable to compute a solution with those inputs.');
    return;
  }

  const formattedBase = formatNumber(base, { maximumFractionDigits: 4 });
  const formattedTarget = formatNumber(target, { maximumFractionDigits: 6 });
  const formattedMultiplier = formatNumber(multiplier, { maximumFractionDigits: 4 });
  const formattedShift = formatNumber(shift, { maximumFractionDigits: 4 });
  const formattedSolution = formatNumber(solution, { maximumFractionDigits: 6 });
  const equationText = `${formattedBase}^(${formattedMultiplier}x + ${formattedShift}) = ${formattedTarget}`;

  resultDiv.innerHTML = `
    <article class="expq-summary-card">
      <h4>Solved Equation</h4>
      <div class="expq-summary-grid">
        <div class="expq-stat">
          <span>Equation</span>
          <strong>${equationText}</strong>
        </div>
        <div class="expq-stat">
          <span>Solution x</span>
          <strong>${formattedSolution}</strong>
        </div>
        <div class="expq-stat">
          <span>Curve checkpoint</span>
          <strong>${formattedBase}^(${formattedMultiplier} · ${formattedSolution} + ${formattedShift}) = ${formattedTarget}</strong>
        </div>
        <div class="expq-stat">
          <span>Status</span>
          <strong>Solved</strong>
        </div>
      </div>
    </article>
  `;

  detailDiv.innerHTML = `
    <article class="expq-detail-panel">
      <h4>Log Rearrangement</h4>
      <p><strong>${equationText}</strong></p>
      <p><strong>x = (log_${formattedBase}(${formattedTarget}) - ${formattedShift}) / ${formattedMultiplier}</strong></p>
      <p>The route isolates the exponent with logarithms, then divides by the multiplier to solve for x.</p>
    </article>
  `;

  updateSnapshots({
    base: formattedBase,
    target: formattedTarget,
    solution: formattedSolution,
    status: 'Solved',
  });

  if (graphCanvas) {
    drawExponentialCurve(graphCanvas, { base, multiplier, shift, solution, target });
  }
  if (graphNote) {
    graphNote.textContent = `Curve checkpoint: x = ${formattedSolution} reaches y = ${formattedTarget}.`;
  }
}

for (const input of [baseInput, targetInput, multiplierInput, shiftInput]) {
  input?.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      updateResults();
    }
  });
}

calculateBtn?.addEventListener('click', updateResults);
updateResults();
