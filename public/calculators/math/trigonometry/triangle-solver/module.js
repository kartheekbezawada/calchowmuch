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
const snapshotType = document.querySelector('[data-triangle-snap="type"]');
const snapshotUnit = document.querySelector('[data-triangle-snap="unit"]');
const snapshotSolutions = document.querySelector('[data-triangle-snap="solutions"]');
const snapshotStatus = document.querySelector('[data-triangle-snap="status"]');

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

function updateSnapshotBase() {
  if (snapshotType) {
    snapshotType.textContent = typeSelect.value;
  }
  if (snapshotUnit) {
    snapshotUnit.textContent = getAngleUnit() === 'deg' ? 'Degrees' : 'Radians';
  }
}

function getInputsForType() {
  const type = typeSelect.value;
  return typeConfig[type] ?? typeConfig.SSS;
}

function updateFieldStates() {
  const { required, hint: hintText } = getInputsForType();
  hint.textContent = hintText;
  updateSnapshotBase();

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
  if (!canvas) {
    return;
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }
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

function setStatus(solutionCount, statusLabel) {
  if (snapshotSolutions) {
    snapshotSolutions.textContent = solutionCount;
  }
  if (snapshotStatus) {
    snapshotStatus.textContent = statusLabel;
  }
}

function renderSolution(solution, index, total) {
  const label = total > 1 ? `Solution ${index + 1}` : 'Solved Triangle';
  const perimeter = solution.a + solution.b + solution.c;

  return `
    <article class="tri-solution-card">
      <h4>${label}</h4>
      <div class="tri-solution-grid">
        <div class="tri-solution-cell">
          <span>Sides</span>
          <p>a = ${formatNumber(solution.a, { maximumFractionDigits: 4 })}</p>
          <p>b = ${formatNumber(solution.b, { maximumFractionDigits: 4 })}</p>
          <p>c = ${formatNumber(solution.c, { maximumFractionDigits: 4 })}</p>
        </div>
        <div class="tri-solution-cell">
          <span>Angles</span>
          <p>A = ${formatAnglePair(solution.A)}</p>
          <p>B = ${formatAnglePair(solution.B)}</p>
          <p>C = ${formatAnglePair(solution.C)}</p>
        </div>
        <div class="tri-solution-cell">
          <span>Checks</span>
          <p>Area = ${formatNumber(solution.area, { maximumFractionDigits: 4 })}</p>
          <p>Perimeter = ${formatNumber(perimeter, { maximumFractionDigits: 4 })}</p>
          <p>Method = ${solution.method}</p>
        </div>
      </div>
    </article>
  `;
}

function solveTriangleForm() {
  resultDiv.textContent = '';
  detailDiv.textContent = '';
  updateSnapshotBase();

  const { required } = getInputsForType();
  for (const key of required) {
    const input = inputs[key];
    if (!hasMaxDigits(input.value, 12)) {
      resultDiv.textContent = 'Inputs are limited to 12 digits.';
      setStatus('-', 'Input error');
      if (diagramNote) {
        diagramNote.textContent = 'Diagram cannot update until the required inputs are valid.';
      }
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
    setStatus('-', 'Input error');
    if (diagramNote) {
      diagramNote.textContent = 'Diagram cannot update until the required inputs are valid.';
    }
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
    setStatus('0', 'Invalid');
    if (diagramNote) {
      diagramNote.textContent = 'No valid triangle could be drawn from the current inputs.';
    }
    return;
  }

  const solutions = solved.solutions ?? [];
  const summaryHtml = solutions
    .map((solution, index) => renderSolution(solution, index, solutions.length))
    .join('');

  resultDiv.innerHTML = summaryHtml;
  setStatus(String(solutions.length), solutions.length > 1 ? 'Ambiguous' : 'Solved');

  const steps = `
    <article class="tri-method-card">
      <h4>Method Notes</h4>
      <ol>
        <li>Identify the triangle type and choose the correct law.</li>
        <li>Use the Law of Sines for angle-side pairs, and Law of Cosines for SAS/SSS.</li>
        <li>Compute remaining angles so A + B + C = 180 degrees.</li>
      </ol>
      ${solved.notes ? `<p class="tri-method-note"><em>${solved.notes}</em></p>` : ''}
    </article>
  `;

  detailDiv.innerHTML = steps;

  drawTriangle(solutions[0]);
  if (diagramNote) {
    diagramNote.textContent =
      solutions.length > 1
        ? `Diagram shows solution 1 of ${solutions.length}.`
        : 'Diagram matches the solved triangle.';
  }
}

solveButton.addEventListener('click', solveTriangleForm);
angleUnitGroup?.addEventListener('click', () => {
  updateSnapshotBase();
  solveTriangleForm();
});

typeSelect.addEventListener('change', updateFieldStates);

updateFieldStates();
solveTriangleForm();
