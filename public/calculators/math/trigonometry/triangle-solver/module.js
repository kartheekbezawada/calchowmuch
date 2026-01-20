import { formatNumber } from '/assets/js/core/format.js';
import { hasMaxDigits } from '/assets/js/core/validate.js';
import { setupButtonGroup } from '/assets/js/core/ui.js';
import { formatAnglePair, solveTriangle } from '/assets/js/core/trigonometry.js';

const typeSelect = document.querySelector('#triangle-type');
const angleUnitGroup = document.querySelector('[data-button-group="triangle-angle-unit"]');
const angleUnitButtons = setupButtonGroup(angleUnitGroup, { defaultValue: 'deg' });
const solveButton = document.querySelector('#triangle-solve');
const resultDiv = document.querySelector('#triangle-result');
const detailDiv = document.querySelector('#triangle-detail');
const hint = document.querySelector('#triangle-hint');
const canvas = document.querySelector('#triangle-canvas');
const diagramNote = document.querySelector('#triangle-diagram-note');

const inputs = {
  a: document.querySelector('#triangle-a'),
  b: document.querySelector('#triangle-b'),
  c: document.querySelector('#triangle-c'),
  A: document.querySelector('#triangle-A'),
  B: document.querySelector('#triangle-B'),
  C: document.querySelector('#triangle-C'),
};

const fieldRows = Array.from(document.querySelectorAll('#calc-triangle-solver [data-field]'));

const typeConfig = {
  SSS: {
    required: ['a', 'b', 'c'],
    hint: 'Provide all three sides to solve the angles using the Law of Cosines.',
  },
  SAS: {
    required: ['a', 'b', 'C'],
    hint: 'Provide sides a, b and the included angle C between them.',
  },
  ASA: {
    required: ['A', 'B', 'c'],
    hint: 'Provide angles A, B and the side c between them.',
  },
  AAS: {
    required: ['A', 'B', 'a'],
    hint: 'Provide angles A, B and side a (opposite angle A).',
  },
  SSA: {
    required: ['a', 'b', 'A'],
    hint: 'Provide sides a, b and angle A opposite side a (ambiguous case possible).',
  },
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

function getInputsForType() {
  const type = typeSelect.value;
  return typeConfig[type] ?? typeConfig.SSS;
}

function updateFieldStates() {
  const { required, hint: hintText } = getInputsForType();
  hint.textContent = hintText;

  fieldRows.forEach((row) => {
    const key = row.dataset.field;
    const isRequired = required.includes(key);
    row.classList.toggle('is-disabled', !isRequired);
    if (inputs[key]) {
      inputs[key].disabled = !isRequired;
    }
  });
}

function toDegrees(value) {
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

function solveTriangleForm() {
  resultDiv.textContent = '';
  detailDiv.textContent = '';

  const { required } = getInputsForType();
  for (const key of required) {
    const input = inputs[key];
    if (!hasMaxDigits(input.value, 12)) {
      resultDiv.textContent = 'Inputs are limited to 12 digits.';
      return;
    }
  }

  const values = {
    a: parseValue(inputs.a),
    b: parseValue(inputs.b),
    c: parseValue(inputs.c),
    A: parseValue(inputs.A),
    B: parseValue(inputs.B),
    C: parseValue(inputs.C),
  };

  required.forEach((key) => {
    if (!Number.isFinite(values[key]) || values[key] <= 0) {
      resultDiv.textContent = `Please provide a positive value for ${key}.`;
    }
  });
  if (resultDiv.textContent) {
    return;
  }

  values.A = Number.isFinite(values.A) ? toDegrees(values.A) : values.A;
  values.B = Number.isFinite(values.B) ? toDegrees(values.B) : values.B;
  values.C = Number.isFinite(values.C) ? toDegrees(values.C) : values.C;

  const type = typeSelect.value;
  const solved = solveTriangle(type, values);
  if (solved.error) {
    resultDiv.textContent = solved.error;
    drawTriangle(null);
    diagramNote.textContent = '';
    return;
  }

  const solutions = solved.solutions ?? [];
  const summaryHtml = solutions
    .map((solution, index) => {
      const label = solutions.length > 1 ? `Solution ${index + 1}` : 'Solution';
      return `
        <div class="solution-summary">
          <h4>${label}</h4>
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
          </div>
        </div>
      `;
    })
    .join('');

  resultDiv.innerHTML = summaryHtml;

  const steps = `
    <div class="solution-steps">
      <strong>Method Notes</strong>
      <ol>
        <li>Identify the triangle type and choose the correct law.</li>
        <li>Use the Law of Sines for angle-side pairs, and Law of Cosines for SAS/SSS.</li>
        <li>Compute remaining angles so A + B + C = 180 degrees.</li>
      </ol>
      ${solved.notes ? `<p><em>${solved.notes}</em></p>` : ''}
    </div>
  `;

  detailDiv.innerHTML = steps;

  drawTriangle(solutions[0]);
  diagramNote.textContent =
    solutions.length > 1
      ? `Diagram shows solution 1 of ${solutions.length}.`
      : 'Diagram matches the solved triangle.';
}

solveButton.addEventListener('click', solveTriangleForm);
angleUnitGroup?.addEventListener('click', () => {
  solveTriangleForm();
});

typeSelect.addEventListener('change', updateFieldStates);

updateFieldStates();
solveTriangleForm();
