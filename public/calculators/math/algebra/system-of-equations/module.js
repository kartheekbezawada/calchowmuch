import { formatNumber } from '/assets/js/core/format.js';
import { setupButtonGroup } from '/assets/js/core/ui.js';
import { hasMaxDigits, toNumber } from '/assets/js/core/validate.js';
import { solveSystem2x2, solveSystem3x3 } from '/assets/js/core/algebra.js';

const snapshotSize = document.querySelector('[data-system-snap="size"]');
const snapshotMethod = document.querySelector('[data-system-snap="method"]');
const snapshotDeterminant = document.querySelector('[data-system-snap="determinant"]');
const snapshotStatus = document.querySelector('[data-system-snap="status"]');

function updateSnapshot(node, value) {
  if (node) {
    node.textContent = value;
  }
}

function prettyMethodLabel(value) {
  if (value === 'matrix') return 'Matrix';
  if (value === 'substitution') return 'Substitution';
  return 'Elimination';
}

function resetDynamicSnapshots() {
  updateSnapshot(snapshotDeterminant, '-');
  updateSnapshot(snapshotStatus, '-');
}

const systemSizeGroup = setupButtonGroup(
  document.querySelector('[data-button-group="system-size"]'),
  {
    defaultValue: '2x2',
    onChange: (value) => {
      toggleSystemSize(value);
      updateSnapshot(snapshotSize, value);
      resetDynamicSnapshots();
    },
  }
);

const solutionMethodGroup = setupButtonGroup(
  document.querySelector('[data-button-group="solution-method"]'),
  {
    defaultValue: 'elimination',
    onChange: (value) => {
      updateSnapshot(snapshotMethod, prettyMethodLabel(value));
    },
  }
);

const solveButton = document.querySelector('#solve-system');
const resultDiv = document.querySelector('#system-result');
const detailDiv = document.querySelector('#system-detail');

function validateInputs(ids) {
  const inputs = ids.map((id) => document.querySelector(id));
  const invalid = inputs.find((input) => !hasMaxDigits(input.value, 12));
  if (invalid) {
    resultDiv.textContent = 'Inputs are limited to 12 digits.';
    detailDiv.textContent = '';
    resetDynamicSnapshots();
    return false;
  }
  return true;
}

function toggleSystemSize(size) {
  const system2x2 = document.querySelector('#system-2x2');
  const system3x3 = document.querySelector('#system-3x3');

  if (size === '2x2') {
    system2x2.style.display = 'block';
    system3x3.style.display = 'none';
  } else {
    system2x2.style.display = 'none';
    system3x3.style.display = 'block';
  }
}

function solveSystem() {
  resultDiv.textContent = '';
  detailDiv.textContent = '';

  const systemSize = systemSizeGroup.getValue();
  const method = solutionMethodGroup.getValue();

  updateSnapshot(snapshotSize, systemSize);
  updateSnapshot(snapshotMethod, prettyMethodLabel(method));

  if (systemSize === '2x2') {
    if (!validateInputs(['#a11', '#a12', '#b1', '#a21', '#a22', '#b2'])) {
      return;
    }
    solve2x2System(method);
  } else {
    if (
      !validateInputs([
        '#a11-3x3',
        '#a12-3x3',
        '#a13-3x3',
        '#b1-3x3',
        '#a21-3x3',
        '#a22-3x3',
        '#a23-3x3',
        '#b2-3x3',
        '#a31-3x3',
        '#a32-3x3',
        '#a33-3x3',
        '#b3-3x3',
      ])
    ) {
      return;
    }
    solve3x3System(method);
  }
}

function solve2x2System(method) {
  const a11 = toNumber(document.querySelector('#a11').value, 1);
  const a12 = toNumber(document.querySelector('#a12').value, 2);
  const b1 = toNumber(document.querySelector('#b1').value, 5);
  const a21 = toNumber(document.querySelector('#a21').value, 3);
  const a22 = toNumber(document.querySelector('#a22').value, 4);
  const b2 = toNumber(document.querySelector('#b2').value, 11);

  const solution = solveSystem2x2(a11, a12, b1, a21, a22, b2);
  const det = solution.determinant;

  updateSnapshot(snapshotDeterminant, formatNumber(det, { maximumFractionDigits: 6 }));

  let solutionHTML = '';
  let detailHTML = '';

  detailHTML += `<div class="system-type">`;
  detailHTML += `<strong>System of Equations:</strong><br>`;
  detailHTML += `${formatNumber(a11)}x + ${formatNumber(a12)}y = ${formatNumber(b1)}<br>`;
  detailHTML += `${formatNumber(a21)}x + ${formatNumber(a22)}y = ${formatNumber(b2)}`;
  detailHTML += `</div>`;

  if (solution.type !== 'unique') {
    if (solution.type === 'infinite') {
      solutionHTML = '<strong>Infinite Solutions:</strong><br>The system is dependent (same line).';
      detailHTML += `<div class="solution-steps"><strong>Analysis:</strong> Determinant = 0 and ratios are equal. The equations represent the same line.</div>`;
      updateSnapshot(snapshotStatus, 'Infinite solutions');
    } else {
      solutionHTML =
        '<strong>No Solution:</strong><br>The system is inconsistent (parallel lines).';
      detailHTML += `<div class="solution-steps"><strong>Analysis:</strong> Determinant = 0 but ratios are not equal. The equations represent parallel lines.</div>`;
      updateSnapshot(snapshotStatus, 'No solution');
    }
  } else {
    const x = solution.solution.x;
    const y = solution.solution.y;

    solutionHTML = `<strong>Unique Solution:</strong><br>`;
    solutionHTML += `x = ${formatNumber(x, { maximumFractionDigits: 6 })}<br>`;
    solutionHTML += `y = ${formatNumber(y, { maximumFractionDigits: 6 })}`;

    if (method === 'elimination') {
      detailHTML += showEliminationSteps(a11, a12, b1, a21, a22, b2, x, y);
    } else if (method === 'substitution') {
      detailHTML += showSubstitutionSteps(a11, a12, b1, a21, a22, b2, x, y);
    } else if (method === 'matrix') {
      detailHTML += showMatrixSteps(a11, a12, b1, a21, a22, b2, x, y, det);
    }

    updateSnapshot(snapshotStatus, 'Unique solution');
  }

  resultDiv.innerHTML = solutionHTML;
  detailDiv.innerHTML = detailHTML;
}

function showEliminationSteps(a11, a12, b1, a21, a22, b2, x, y) {
  let stepsHTML = `<div class="solution-steps">`;
  stepsHTML += `<h4>Elimination Method Steps:</h4>`;
  stepsHTML += `<ol>`;
  stepsHTML += `<li>Original system:<br>`;
  stepsHTML += `&nbsp;&nbsp;${formatNumber(a11)}x + ${formatNumber(a12)}y = ${formatNumber(b1)}<br>`;
  stepsHTML += `&nbsp;&nbsp;${formatNumber(a21)}x + ${formatNumber(a22)}y = ${formatNumber(b2)}</li>`;

  const mult1 = a21;
  const mult2 = -a11;
  const newA12 = a12 * mult1;
  const newB1 = b1 * mult1;
  const newA22 = a22 * mult2;
  const newB2 = b2 * mult2;
  const elimCoeff = newA12 + newA22;
  const elimConst = newB1 + newB2;

  stepsHTML += `<li>Multiply equation 1 by ${formatNumber(mult1)} and equation 2 by ${formatNumber(mult2)}:<br>`;
  stepsHTML += `&nbsp;&nbsp;${formatNumber(a11 * mult1)}x + ${formatNumber(newA12)}y = ${formatNumber(newB1)}<br>`;
  stepsHTML += `&nbsp;&nbsp;${formatNumber(a21 * mult2)}x + ${formatNumber(newA22)}y = ${formatNumber(newB2)}</li>`;
  stepsHTML += `<li>Add equations to eliminate x:<br>`;
  stepsHTML += `&nbsp;&nbsp;${formatNumber(elimCoeff)}y = ${formatNumber(elimConst)}</li>`;
  stepsHTML += `<li>Solve for y: y = ${formatNumber(elimConst)}/${formatNumber(elimCoeff)} = ${formatNumber(y, { maximumFractionDigits: 6 })}</li>`;
  stepsHTML += `<li>Substitute back: x = ${formatNumber(x, { maximumFractionDigits: 6 })}</li>`;
  stepsHTML += `</ol>`;
  stepsHTML += `</div>`;

  return stepsHTML;
}

function showSubstitutionSteps(a11, a12, b1, a21, a22, b2, x, y) {
  let stepsHTML = `<div class="solution-steps">`;
  stepsHTML += `<h4>Substitution Method Steps:</h4>`;
  stepsHTML += `<ol>`;
  stepsHTML += `<li>From equation 1, solve for x:<br>`;
  stepsHTML += `&nbsp;&nbsp;x = (${formatNumber(b1)} - ${formatNumber(a12)}y) / ${formatNumber(a11)}</li>`;
  stepsHTML += `<li>Substitute into equation 2:<br>`;
  stepsHTML += `&nbsp;&nbsp;${formatNumber(a21)} × [(${formatNumber(b1)} - ${formatNumber(a12)}y) / ${formatNumber(a11)}] + ${formatNumber(a22)}y = ${formatNumber(b2)}</li>`;
  stepsHTML += `<li>Solve for y: y = ${formatNumber(y, { maximumFractionDigits: 6 })}</li>`;
  stepsHTML += `<li>Substitute back: x = ${formatNumber(x, { maximumFractionDigits: 6 })}</li>`;
  stepsHTML += `</ol>`;
  stepsHTML += `</div>`;

  return stepsHTML;
}

function showMatrixSteps(a11, a12, b1, a21, a22, b2, x, y, det) {
  let stepsHTML = `<div class="solution-steps">`;
  stepsHTML += `<h4>Matrix Method (Cramer's Rule):</h4>`;
  stepsHTML += `<ol>`;
  stepsHTML += `<li>Coefficient matrix A and constants vector b:</li>`;
  stepsHTML += `<div class="matrix-display">`;
  stepsHTML += `A = <table class="system-matrix-table"><caption class="math-cluster-visually-hidden">Coefficient matrix A</caption><tbody><tr><td>${formatNumber(a11)}</td><td>${formatNumber(a12)}</td></tr>`;
  stepsHTML += `<tr><td>${formatNumber(a21)}</td><td>${formatNumber(a22)}</td></tr></tbody></table>`;
  stepsHTML += `&nbsp;&nbsp;&nbsp;b = <table class="system-matrix-table"><caption class="math-cluster-visually-hidden">Constants vector b</caption><tbody><tr><td>${formatNumber(b1)}</td></tr><tr><td>${formatNumber(b2)}</td></tr></tbody></table>`;
  stepsHTML += `</div>`;
  stepsHTML += `<li>Calculate determinant: det(A) = ${formatNumber(det)}</li>`;
  stepsHTML += `<li>Using Cramer's rule:<br>`;
  stepsHTML += `&nbsp;&nbsp;x = det(Ax) / det(A) = ${formatNumber(x, { maximumFractionDigits: 6 })}<br>`;
  stepsHTML += `&nbsp;&nbsp;y = det(Ay) / det(A) = ${formatNumber(y, { maximumFractionDigits: 6 })}</li>`;
  stepsHTML += `</ol>`;
  stepsHTML += `</div>`;

  return stepsHTML;
}

function solve3x3System() {
  const a11 = toNumber(document.querySelector('#a11-3x3').value, 1);
  const a12 = toNumber(document.querySelector('#a12-3x3').value, 2);
  const a13 = toNumber(document.querySelector('#a13-3x3').value, 3);
  const b1 = toNumber(document.querySelector('#b1-3x3').value, 14);
  const a21 = toNumber(document.querySelector('#a21-3x3').value, 4);
  const a22 = toNumber(document.querySelector('#a22-3x3').value, 5);
  const a23 = toNumber(document.querySelector('#a23-3x3').value, 6);
  const b2 = toNumber(document.querySelector('#b2-3x3').value, 32);
  const a31 = toNumber(document.querySelector('#a31-3x3').value, 7);
  const a32 = toNumber(document.querySelector('#a32-3x3').value, 8);
  const a33 = toNumber(document.querySelector('#a33-3x3').value, 9);
  const b3 = toNumber(document.querySelector('#b3-3x3').value, 50);

  const solution = solveSystem3x3(a11, a12, a13, b1, a21, a22, a23, b2, a31, a32, a33, b3);
  const det = solution.determinant;

  updateSnapshot(snapshotDeterminant, formatNumber(det, { maximumFractionDigits: 6 }));

  let solutionHTML = '';
  let detailHTML = '';

  detailHTML += `<div class="system-type">`;
  detailHTML += `<strong>3×3 System of Equations:</strong><br>`;
  detailHTML += `${formatNumber(a11)}x + ${formatNumber(a12)}y + ${formatNumber(a13)}z = ${formatNumber(b1)}<br>`;
  detailHTML += `${formatNumber(a21)}x + ${formatNumber(a22)}y + ${formatNumber(a23)}z = ${formatNumber(b2)}<br>`;
  detailHTML += `${formatNumber(a31)}x + ${formatNumber(a32)}y + ${formatNumber(a33)}z = ${formatNumber(b3)}`;
  detailHTML += `</div>`;

  if (solution.type !== 'unique') {
    solutionHTML =
      '<strong>No Unique Solution:</strong><br>The system is either inconsistent or has infinite solutions.';
    detailHTML += `<div class="solution-steps"><strong>Analysis:</strong> Determinant = ${formatNumber(det, { maximumFractionDigits: 10 })} ≈ 0. The system does not have a unique solution.</div>`;
    updateSnapshot(snapshotStatus, 'No unique solution');
  } else {
    const { x, y, z } = solution.solution;
    const detX =
      b1 * (a22 * a33 - a23 * a32) - a12 * (b2 * a33 - a23 * b3) + a13 * (b2 * a32 - a22 * b3);
    const detY =
      a11 * (b2 * a33 - a23 * b3) - b1 * (a21 * a33 - a23 * a31) + a13 * (a21 * b3 - b2 * a31);
    const detZ =
      a11 * (a22 * b3 - b2 * a32) - a12 * (a21 * b3 - b2 * a31) + b1 * (a21 * a32 - a22 * a31);

    solutionHTML = `<strong>Unique Solution:</strong><br>`;
    solutionHTML += `x = ${formatNumber(x, { maximumFractionDigits: 6 })}<br>`;
    solutionHTML += `y = ${formatNumber(y, { maximumFractionDigits: 6 })}<br>`;
    solutionHTML += `z = ${formatNumber(z, { maximumFractionDigits: 6 })}`;

    detailHTML += `<div class="solution-steps">`;
    detailHTML += `<h4>Matrix Solution (Cramer's Rule):</h4>`;
    detailHTML += `<ol>`;
    detailHTML += `<li>Calculate main determinant: det(A) = ${formatNumber(det)}</li>`;
    detailHTML += `<li>Calculate x: det(Ax) = ${formatNumber(detX)}, x = ${formatNumber(x, { maximumFractionDigits: 6 })}</li>`;
    detailHTML += `<li>Calculate y: det(Ay) = ${formatNumber(detY)}, y = ${formatNumber(y, { maximumFractionDigits: 6 })}</li>`;
    detailHTML += `<li>Calculate z: det(Az) = ${formatNumber(detZ)}, z = ${formatNumber(z, { maximumFractionDigits: 6 })}</li>`;
    detailHTML += `</ol>`;
    detailHTML += `</div>`;

    updateSnapshot(snapshotStatus, 'Unique solution');
  }

  resultDiv.innerHTML = solutionHTML;
  detailDiv.innerHTML = detailHTML;
}

solveButton.addEventListener('click', solveSystem);

toggleSystemSize('2x2');
updateSnapshot(snapshotSize, '2x2');
updateSnapshot(snapshotMethod, 'Elimination');
resetDynamicSnapshots();
