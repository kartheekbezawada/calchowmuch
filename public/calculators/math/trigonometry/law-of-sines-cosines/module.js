import { formatNumber } from '/assets/js/core/format.js';
import { hasMaxDigits } from '/assets/js/core/validate.js';
import { setupButtonGroup } from '/assets/js/core/ui.js';
import {
  detectTriangleType,
  formatAnglePair,
  solveTriangle,
} from '/assets/js/core/trigonometry.js';

const methodSelect = document.querySelector('#law-method');
const angleUnitGroup = document.querySelector('[data-button-group="law-angle-unit"]');
const angleUnitButtons = setupButtonGroup(angleUnitGroup, { defaultValue: 'deg' });
const calcButton = document.querySelector('#law-calc');
const resultDiv = document.querySelector('#law-result');
const detailDiv = document.querySelector('#law-detail');
const hint = document.querySelector('#law-hint');
const canvas = document.querySelector('#law-triangle');
const diagramNote = document.querySelector('#law-diagram-note');
const snapshotType = document.querySelector('[data-law-snap="type"]');
const snapshotLaw = document.querySelector('[data-law-snap="law"]');
const snapshotUnit = document.querySelector('[data-law-snap="unit"]');
const snapshotSolutions = document.querySelector('[data-law-snap="solutions"]');

const inputs = {
  a: document.querySelector('#law-a'),
  b: document.querySelector('#law-b'),
  c: document.querySelector('#law-c'),
  A: document.querySelector('#law-A'),
  B: document.querySelector('#law-B'),
  C: document.querySelector('#law-C'),
};

function parseValue(input) {
  const raw = input.value.trim();
  if (!raw) {
    return Number.NaN;
  }
  return Number(raw);
}

function getAngleUnit() {
  return angleUnitButtons?.getValue() ?? 'deg';
}

function toDegrees(value) {
  if (!Number.isFinite(value)) {
    return value;
  }
  if (getAngleUnit() === 'deg') {
    return value;
  }
  return (value * 180) / Math.PI;
}

function drawTriangle(solution) {
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);

  if (!solution) {
    return;
  }

  const { a, b, c } = solution;
  const margin = 30;
  const xC = (b * b + c * c - a * a) / (2 * c);
  const yC = Math.sqrt(Math.max(0, b * b - xC * xC));

  const scale = Math.min((width - 2 * margin) / c, (height - 2 * margin) / yC);

  const A = { x: margin, y: height - margin };
  const B = { x: margin + c * scale, y: height - margin };
  const C = { x: margin + xC * scale, y: height - margin - yC * scale };

  ctx.strokeStyle = '#1e40af';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(A.x, A.y);
  ctx.lineTo(B.x, B.y);
  ctx.lineTo(C.x, C.y);
  ctx.closePath();
  ctx.stroke();

  ctx.fillStyle = '#ef4444';
  [A, B, C].forEach((point) => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = '#0f172a';
  ctx.font = '12px Arial';
  ctx.fillText('A', A.x - 12, A.y + 14);
  ctx.fillText('B', B.x + 6, B.y + 14);
  ctx.fillText('C', C.x, C.y - 10);

  const midAB = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2 };
  const midBC = { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2 };
  const midCA = { x: (C.x + A.x) / 2, y: (C.y + A.y) / 2 };

  ctx.fillStyle = '#1f2937';
  ctx.fillText(`c = ${formatNumber(c, { maximumFractionDigits: 2 })}`, midAB.x, midAB.y + 14);
  ctx.fillText(`a = ${formatNumber(a, { maximumFractionDigits: 2 })}`, midBC.x + 6, midBC.y);
  ctx.fillText(`b = ${formatNumber(b, { maximumFractionDigits: 2 })}`, midCA.x - 6, midCA.y);
}

function getLawLabel(type) {
  if (type === 'SSS' || type === 'SAS') {
    return 'Law of Cosines';
  }
  if (type === 'ASA' || type === 'AAS' || type === 'SSA') {
    return 'Law of Sines';
  }
  return 'Unknown';
}

function updateSnapshots({ type = '-', law = '-', solutions = '-', unit = null } = {}) {
  if (snapshotType) {
    snapshotType.textContent = type;
  }
  if (snapshotLaw) {
    snapshotLaw.textContent = law;
  }
  if (snapshotUnit) {
    snapshotUnit.textContent = unit ?? (getAngleUnit() === 'deg' ? 'Degrees' : 'Radians');
  }
  if (snapshotSolutions) {
    snapshotSolutions.textContent = String(solutions);
  }
}

function calculate() {
  resultDiv.textContent = '';
  detailDiv.textContent = '';
  updateSnapshots();

  const invalid = Object.values(inputs).find((input) => !hasMaxDigits(input.value, 12));
  if (invalid) {
    resultDiv.textContent = 'Inputs are limited to 12 digits.';
    hint.textContent = 'Reduce the number of digits, then solve again.';
    drawTriangle(null);
    diagramNote.textContent = 'Diagram updates after the triangle is solved.';
    return;
  }

  const values = {
    a: parseValue(inputs.a),
    b: parseValue(inputs.b),
    c: parseValue(inputs.c),
    A: toDegrees(parseValue(inputs.A)),
    B: toDegrees(parseValue(inputs.B)),
    C: toDegrees(parseValue(inputs.C)),
  };

  const detectedType = detectTriangleType(values);
  if (!detectedType) {
    resultDiv.textContent = 'Enter at least three valid values (including one side) to solve.';
    hint.textContent = 'You need a valid three-value triangle pattern that includes at least one side.';
    drawTriangle(null);
    diagramNote.textContent = 'Diagram updates after the triangle is solved.';
    return;
  }

  const method = methodSelect.value;
  const requiredLaw = getLawLabel(detectedType);
  hint.textContent = `Detected pattern: ${detectedType}. Recommended method: ${requiredLaw}.`;

  if (method === 'sine' && requiredLaw !== 'Law of Sines') {
    resultDiv.textContent = 'Law of Sines requires at least one angle-side pair.';
    updateSnapshots({ type: detectedType, law: requiredLaw, solutions: '-', unit: getAngleUnit() === 'deg' ? 'Degrees' : 'Radians' });
    drawTriangle(null);
    diagramNote.textContent = 'Diagram updates after the triangle is solved.';
    return;
  }
  if (method === 'cosine' && requiredLaw !== 'Law of Cosines') {
    resultDiv.textContent = 'Law of Cosines requires SAS or SSS inputs.';
    updateSnapshots({ type: detectedType, law: requiredLaw, solutions: '-', unit: getAngleUnit() === 'deg' ? 'Degrees' : 'Radians' });
    drawTriangle(null);
    diagramNote.textContent = 'Diagram updates after the triangle is solved.';
    return;
  }

  const solved = solveTriangle(detectedType, values);
  if (solved.error) {
    resultDiv.textContent = solved.error;
    updateSnapshots({ type: detectedType, law: requiredLaw, solutions: '-', unit: getAngleUnit() === 'deg' ? 'Degrees' : 'Radians' });
    drawTriangle(null);
    diagramNote.textContent = 'Diagram updates after the triangle is solved.';
    return;
  }

  const solutions = solved.solutions;
  const solution = solutions[0];
  updateSnapshots({
    type: detectedType,
    law: requiredLaw,
    solutions: solutions.length,
  });

  const summaryHtml = `
    <article class="law-summary-card">
      <h4>Solved Triangle</h4>
      <div class="law-summary-grid">
        <div class="law-stat">
          <span>Pattern</span>
          <strong>${detectedType}</strong>
        </div>
        <div class="law-stat">
          <span>Recommended law</span>
          <strong>${requiredLaw}</strong>
        </div>
        <div class="law-stat">
          <span>Method mode</span>
          <strong>${method === 'auto' ? 'Auto detect' : method === 'sine' ? 'Forced Law of Sines' : 'Forced Law of Cosines'}</strong>
        </div>
        <div class="law-stat">
          <span>Area</span>
          <strong>${formatNumber(solution.area, { maximumFractionDigits: 4 })} sq units</strong>
        </div>
      </div>
    </article>
  `;

  const solutionCards = solutions
    .map(
      (item, index) => `
        <article class="law-solution-card">
          <h4>${solutions.length > 1 ? `Solution ${index + 1}` : 'Primary solution'}</h4>
          <div class="law-solution-grid">
            <div class="law-stat">
              <span>Sides</span>
              <strong>a = ${formatNumber(item.a, { maximumFractionDigits: 4 })}<br />b = ${formatNumber(item.b, { maximumFractionDigits: 4 })}<br />c = ${formatNumber(item.c, { maximumFractionDigits: 4 })}</strong>
            </div>
            <div class="law-stat">
              <span>Angles</span>
              <strong>A = ${formatAnglePair(item.A, { normalize: false })}<br />B = ${formatAnglePair(item.B, { normalize: false })}<br />C = ${formatAnglePair(item.C, { normalize: false })}</strong>
            </div>
            <div class="law-stat">
              <span>Area</span>
              <strong>${formatNumber(item.area, { maximumFractionDigits: 4 })} sq units</strong>
            </div>
            <div class="law-stat">
              <span>Method</span>
              <strong>${item.method}</strong>
            </div>
          </div>
        </article>
      `
    )
    .join('');

  const detailHtml = `
    <article class="law-method-card">
      <h4>Method Notes</h4>
      <ol class="law-step-list">
        <li>Identify the triangle pattern from the known inputs: <strong>${detectedType}</strong>.</li>
        <li>Apply <strong>${requiredLaw}</strong> to compute the first missing side or angle.</li>
        <li>Finish the remaining angles using <strong>A + B + C = 180 degrees</strong>.</li>
        <li>Compute area from the solved triangle and confirm the shape with the diagram.</li>
      </ol>
      <p class="law-method-note">
        ${solved.notes || (solutions.length > 1
          ? 'Multiple valid triangles were found, so the diagram shows the first valid solution while the answer card lists every solution.'
          : 'The first-screen answer card shows the full solved triangle, so you can confirm the method and the geometry quickly.')}
      </p>
    </article>
  `;

  resultDiv.innerHTML = `${summaryHtml}${solutionCards}`;
  detailDiv.innerHTML = detailHtml;

  drawTriangle(solution);
  diagramNote.textContent =
    solutions.length > 1 ? 'Diagram shows solution 1 of multiple valid triangles.' : 'Diagram matches the solved triangle.';
}

calcButton.addEventListener('click', calculate);
methodSelect.addEventListener('change', calculate);
angleUnitGroup?.addEventListener('click', calculate);
Object.values(inputs).forEach((input) => input.addEventListener('input', calculate));

calculate();
