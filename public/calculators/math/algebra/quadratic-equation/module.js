import { formatNumber } from '/assets/js/core/format.js';
import { hasMaxDigits, toNumber } from '/assets/js/core/validate.js';
import { solveQuadratic } from '/assets/js/core/algebra.js';

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
  
  // Handle coefficient a
  if (a === 1) {
    equation += 'x²';
  } else if (a === -1) {
    equation += '-x²';
  } else {
    equation += `${formatNumber(a)}x²`;
  }
  
  // Handle coefficient b
  if (b > 0) {
    equation += ` + ${b === 1 ? '' : formatNumber(b)}x`;
  } else if (b < 0) {
    equation += ` - ${b === -1 ? '' : formatNumber(Math.abs(b))}x`;
  }
  
  // Handle coefficient c
  if (c > 0) {
    equation += ` + ${formatNumber(c)}`;
  } else if (c < 0) {
    equation += ` - ${formatNumber(Math.abs(c))}`;
  }
  
  equation += ' = 0';
  equationText.textContent = equation;
}

function solveQuadratic() {
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
  
  const solution = solveQuadratic(a, b, c);
  if (solution.error) {
    resultDiv.textContent = `Error: ${solution.error}`;
    return;
  }
  const discriminant = solution.discriminant;
  
  let solutionsHTML = '';
  let detailHTML = '';
  
  // Step-by-step solution
  detailHTML += `<div class="solution-steps">`;
  detailHTML += `<h4>Step-by-Step Solution:</h4>`;
  detailHTML += `<ol>`;
  detailHTML += `<li>Given equation: ${equationText.textContent}</li>`;
  detailHTML += `<li>Using quadratic formula: x = (-b ± √(b² - 4ac)) / (2a)</li>`;
  detailHTML += `<li>Substitute values: a = ${formatNumber(a)}, b = ${formatNumber(b)}, c = ${formatNumber(c)}</li>`;
  detailHTML += `<li>Calculate discriminant: Δ = b² - 4ac = ${formatNumber(b)}² - 4(${formatNumber(a)})(${formatNumber(c)}) = ${formatNumber(discriminant)}</li>`;
  detailHTML += `</ol>`;
  detailHTML += `</div>`;
  
  // Discriminant analysis
  detailHTML += `<div class="discriminant-info">`;
  detailHTML += `<strong>Discriminant Analysis (Δ = ${formatNumber(discriminant)}):</strong><br>`;
  
  if (solution.type === 'two-real') {
    const x1 = solution.roots[0];
    const x2 = solution.roots[1];
    
    solutionsHTML = `<strong>Two Real Solutions:</strong><br>`;
    solutionsHTML += `x₁ = ${formatNumber(x1, { maximumFractionDigits: 6 })}<br>`;
    solutionsHTML += `x₂ = ${formatNumber(x2, { maximumFractionDigits: 6 })}`;
    
    detailHTML += `Δ > 0: Two distinct real roots<br>`;
    detailHTML += `x₁ = (-${formatNumber(b)} + √${formatNumber(discriminant)}) / (2 × ${formatNumber(a)}) = ${formatNumber(x1, { maximumFractionDigits: 6 })}<br>`;
    detailHTML += `x₂ = (-${formatNumber(b)} - √${formatNumber(discriminant)}) / (2 × ${formatNumber(a)}) = ${formatNumber(x2, { maximumFractionDigits: 6 })}`;
  } else if (solution.type === 'one-real') {
    const x = solution.roots[0];
    
    solutionsHTML = `<strong>One Real Solution (Repeated Root):</strong><br>`;
    solutionsHTML += `x = ${formatNumber(x, { maximumFractionDigits: 6 })}`;
    
    detailHTML += `Δ = 0: One repeated real root<br>`;
    detailHTML += `x = -${formatNumber(b)} / (2 × ${formatNumber(a)}) = ${formatNumber(x, { maximumFractionDigits: 6 })}`;
  } else {
    const realPart = solution.roots[0].real;
    const imaginaryPart = Math.abs(solution.roots[0].imaginary);
    
    solutionsHTML = `<strong>Two Complex Solutions:</strong><br>`;
    solutionsHTML += `x₁ = ${formatNumber(realPart, { maximumFractionDigits: 6 })} + ${formatNumber(imaginaryPart, { maximumFractionDigits: 6 })}i<br>`;
    solutionsHTML += `x₂ = ${formatNumber(realPart, { maximumFractionDigits: 6 })} - ${formatNumber(imaginaryPart, { maximumFractionDigits: 6 })}i`;
    
    detailHTML += `Δ < 0: Two complex conjugate roots<br>`;
    detailHTML += `x₁ = ${formatNumber(realPart, { maximumFractionDigits: 6 })} + ${formatNumber(imaginaryPart, { maximumFractionDigits: 6 })}i<br>`;
    detailHTML += `x₂ = ${formatNumber(realPart, { maximumFractionDigits: 6 })} - ${formatNumber(imaginaryPart, { maximumFractionDigits: 6 })}i`;
  }
  
  detailHTML += `</div>`;
  
  resultDiv.innerHTML = solutionsHTML;
  detailDiv.innerHTML = detailHTML;
}

// Event listeners
aInput.addEventListener('input', updateEquationDisplay);
bInput.addEventListener('input', updateEquationDisplay);
cInput.addEventListener('input', updateEquationDisplay);
solveButton.addEventListener('click', solveQuadratic);

// Initialize
updateEquationDisplay();
