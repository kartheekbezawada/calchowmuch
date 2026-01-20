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

function calculate() {
  resultDiv.textContent = '';
  detailDiv.textContent = '';

  const invalid = Object.values(inputs).find((input) => !hasMaxDigits(input.value, 12));
  if (invalid) {
    resultDiv.textContent = 'Inputs are limited to 12 digits.';
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
    drawTriangle(null);
    diagramNote.textContent = '';
    return;
  }

  const method = methodSelect.value;
  const requiredLaw = getLawLabel(detectedType);

  if (method === 'sine' && requiredLaw !== 'Law of Sines') {
    resultDiv.textContent = 'Law of Sines requires at least one angle-side pair.';
    return;
  }
  if (method === 'cosine' && requiredLaw !== 'Law of Cosines') {
    resultDiv.textContent = 'Law of Cosines requires SAS or SSS inputs.';
    return;
  }

  hint.textContent = `Auto detection suggests ${requiredLaw}.`;

  const solved = solveTriangle(detectedType, values);
  if (solved.error) {
    resultDiv.textContent = solved.error;
    drawTriangle(null);
    diagramNote.textContent = '';
    return;
  }

  const solution = solved.solutions[0];

  const resultHtml = `
    <div class="result-grid">
      <div class="result-card">
        <div class="result-title">Sides</div>
        <p>a = ${formatNumber(solution.a, { maximumFractionDigits: 4 })}</p>
        <p>b = ${formatNumber(solution.b, { maximumFractionDigits: 4 })}</p>
        <p>c = ${formatNumber(solution.c, { maximumFractionDigits: 4 })}</p>
      </div>
      <div class="result-card">
        <div class="result-title">Angles</div>
        <p>A = ${formatAnglePair(solution.A)}</p>
        <p>B = ${formatAnglePair(solution.B)}</p>
        <p>C = ${formatAnglePair(solution.C)}</p>
      </div>
      <div class="result-card">
        <div class="result-title">Area</div>
        <p>${formatNumber(solution.area, { maximumFractionDigits: 4 })} sq units</p>
      </div>
      <div class="result-card">
        <div class="result-title">Law Used</div>
        <p>${requiredLaw}</p>
      </div>
    </div>
  `;

  const detailHtml = `
    <div class="solution-steps">
      <strong>Step Outline</strong>
      <ol>
        <li>Identify the triangle type (${detectedType}).</li>
        <li>Apply ${requiredLaw} to compute the missing side or angle.</li>
        <li>Finish remaining angles using A + B + C = 180 degrees.</li>
        <li>Compute area via Heron's formula or 1/2 ab sin(C).</li>
      </ol>
    </div>
  `;

  resultDiv.innerHTML = resultHtml;
  detailDiv.innerHTML = detailHtml;

  drawTriangle(solution);
  diagramNote.textContent = 'Diagram matches the solved triangle.';
}

calcButton.addEventListener('click', calculate);
methodSelect.addEventListener('change', calculate);
angleUnitGroup?.addEventListener('click', calculate);
Object.values(inputs).forEach((input) => input.addEventListener('input', calculate));

calculate();
