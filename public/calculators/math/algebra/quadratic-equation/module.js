import { formatNumber } from '/assets/js/core/format.js';
import { hasMaxDigits, toNumber } from '/assets/js/core/validate.js';
import { solveQuadratic as solveQuadraticEquation } from '/assets/js/core/algebra.js';

const aInput = document.querySelector('#quad-a');
const bInput = document.querySelector('#quad-b');
const cInput = document.querySelector('#quad-c');
const solveButton = document.querySelector('#quad-solve');
const resultDiv = document.querySelector('#quad-result');
const detailDiv = document.querySelector('#quad-detail');
const equationText = document.querySelector('#equation-text');

function updateEquationDisplay() {
  const a = toNumber(aInput.value, 1);
  const b = toNumber(bInput.value, 0);
  const c = toNumber(cInput.value, 0);

  let equation = '';

  if (a === 1) {
    equation += 'x^2';
  } else if (a === -1) {
    equation += '-x^2';
  } else {
    equation += `${formatNumber(a)}x^2`;
  }

  if (b > 0) {
    equation += ` + ${b === 1 ? '' : formatNumber(b)}x`;
  } else if (b < 0) {
    equation += ` - ${b === -1 ? '' : formatNumber(Math.abs(b))}x`;
  }

  if (c > 0) {
    equation += ` + ${formatNumber(c)}`;
  } else if (c < 0) {
    equation += ` - ${formatNumber(Math.abs(c))}`;
  }

  equation += ' = 0';
  equationText.textContent = equation;
}

function solveCurrentEquation() {
  resultDiv.textContent = '';
  detailDiv.textContent = '';

  const invalidLength = [aInput, bInput, cInput].find((input) => !hasMaxDigits(input.value, 12));
  if (invalidLength) {
    resultDiv.textContent = 'Inputs are limited to 12 digits.';
    return;
  }

  const a = toNumber(aInput.value, 1);
  const b = toNumber(bInput.value, 0);
  const c = toNumber(cInput.value, 0);

  const solution = solveQuadraticEquation(a, b, c);
  if (solution.error) {
    resultDiv.textContent = `Error: ${solution.error}`;
    return;
  }

  const discriminant = solution.discriminant;
  let solutionsHTML = '';
  let detailHTML = '';

  detailHTML += '<div class="solution-steps">';
  detailHTML += '<h4>Step-by-Step Solution</h4>';
  detailHTML += '<ol>';
  detailHTML += `<li>Given equation: ${equationText.textContent}</li>`;
  detailHTML += '<li>Use formula: x = (-b ± sqrt(b^2 - 4ac)) / (2a)</li>';
  detailHTML += `<li>Substitute: a=${formatNumber(a)}, b=${formatNumber(b)}, c=${formatNumber(c)}</li>`;
  detailHTML += `<li>Discriminant: b^2 - 4ac = ${formatNumber(discriminant)}</li>`;
  detailHTML += '</ol>';
  detailHTML += '</div>';

  detailHTML += '<div class="discriminant-info">';
  detailHTML += `<strong>Discriminant (Δ): ${formatNumber(discriminant)}</strong><br>`;

  if (solution.type === 'two-real') {
    const [x1, x2] = solution.roots;
    solutionsHTML = '<strong>Two Real Solutions</strong><br>';
    solutionsHTML += `x1 = ${formatNumber(x1, { maximumFractionDigits: 6 })}<br>`;
    solutionsHTML += `x2 = ${formatNumber(x2, { maximumFractionDigits: 6 })}`;
    detailHTML += 'Δ &gt; 0, so the equation has two distinct real roots.';
  } else if (solution.type === 'one-real') {
    const [x] = solution.roots;
    solutionsHTML = '<strong>One Repeated Real Solution</strong><br>';
    solutionsHTML += `x = ${formatNumber(x, { maximumFractionDigits: 6 })}`;
    detailHTML += 'Δ = 0, so the equation has one repeated root.';
  } else {
    const realPart = solution.roots[0].real;
    const imaginaryPart = Math.abs(solution.roots[0].imaginary);
    solutionsHTML = '<strong>Two Complex Solutions</strong><br>';
    solutionsHTML += `x1 = ${formatNumber(realPart, { maximumFractionDigits: 6 })} + ${formatNumber(imaginaryPart, { maximumFractionDigits: 6 })}i<br>`;
    solutionsHTML += `x2 = ${formatNumber(realPart, { maximumFractionDigits: 6 })} - ${formatNumber(imaginaryPart, { maximumFractionDigits: 6 })}i`;
    detailHTML += 'Δ &lt; 0, so the equation has complex conjugate roots.';
  }

  detailHTML += '</div>';
  resultDiv.innerHTML = solutionsHTML;
  detailDiv.innerHTML = detailHTML;
}

aInput.addEventListener('input', updateEquationDisplay);
bInput.addEventListener('input', updateEquationDisplay);
cInput.addEventListener('input', updateEquationDisplay);
solveButton.addEventListener('click', solveCurrentEquation);

updateEquationDisplay();
