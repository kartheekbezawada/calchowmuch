import { setupButtonGroup } from '/assets/js/core/ui.js';
import { hasMaxDigits } from '/assets/js/core/validate.js';
import {
  addPolynomials,
  dividePolynomials,
  evaluatePolynomial,
  formatPolynomial,
  multiplyPolynomials,
  parsePolynomial,
  subtractPolynomials,
} from '/assets/js/core/algebra.js';

const operationGroup = setupButtonGroup(
  document.querySelector('[data-button-group="poly-operation"]'),
  {
    defaultValue: 'add',
  }
);
const poly1Input = document.querySelector('#poly1');
const poly2Input = document.querySelector('#poly2');
const calculateButton = document.querySelector('#calculate-poly');
const resultDiv = document.querySelector('#poly-result');
const detailDiv = document.querySelector('#poly-detail');

function validatePolynomialInput(input) {
  const tokens = input.match(/-?\d*\.?\d+/g) || [];
  const invalidToken = tokens.find((token) => !hasMaxDigits(token, 12));
  return invalidToken ? 'Numeric values are limited to 12 digits.' : null;
}

function calculate() {
  resultDiv.textContent = '';
  detailDiv.textContent = '';

  const op = operationGroup.getValue();
  const poly1Text = poly1Input.value || '';
  const poly2Text = poly2Input.value || '';

  const validationError = validatePolynomialInput(poly1Text) || validatePolynomialInput(poly2Text);
  if (validationError) {
    resultDiv.textContent = validationError;
    return;
  }

  const parsed1 = parsePolynomial(poly1Text);
  const parsed2 = parsePolynomial(poly2Text);

  if (parsed1.errors.length) {
    resultDiv.textContent = `Invalid terms in Polynomial 1: ${parsed1.errors.join(', ')}`;
    return;
  }
  if (parsed2.errors.length) {
    resultDiv.textContent = `Invalid terms in Polynomial 2: ${parsed2.errors.join(', ')}`;
    return;
  }

  const poly1 = parsed1.coeffs;
  const poly2 = parsed2.coeffs;

  let result;
  let summary = '';
  let steps = '';

  if (op === 'add') {
    result = addPolynomials(poly1, poly2);
    summary = `${formatPolynomial(poly1)} + ${formatPolynomial(poly2)}`;
    steps = 'Combine like terms by adding coefficients of matching powers.';
  } else if (op === 'subtract') {
    result = subtractPolynomials(poly1, poly2);
    summary = `${formatPolynomial(poly1)} - (${formatPolynomial(poly2)})`;
    steps = 'Subtract coefficients of matching powers.';
  } else if (op === 'multiply') {
    result = multiplyPolynomials(poly1, poly2);
    summary = `${formatPolynomial(poly1)} × ${formatPolynomial(poly2)}`;
    steps = 'Distribute each term and combine like terms.';
  } else {
    const division = dividePolynomials(poly1, poly2);
    if (!division) {
      resultDiv.textContent = 'Cannot divide by a zero polynomial.';
      return;
    }
    resultDiv.innerHTML = `
      <strong>Quotient:</strong> ${formatPolynomial(division.quotient)}<br />
      <strong>Remainder:</strong> ${formatPolynomial(division.remainder)}
    `;
    detailDiv.innerHTML = `
      <p><strong>Dividend:</strong> ${formatPolynomial(poly1)}</p>
      <p><strong>Divisor:</strong> ${formatPolynomial(poly2)}</p>
      <p><strong>Process:</strong> Polynomial long division.</p>
    `;
    return;
  }

  resultDiv.innerHTML = `<strong>Result:</strong> ${formatPolynomial(result)}`;
  detailDiv.innerHTML = `
    <p><strong>Operation:</strong> ${summary}</p>
    <p><strong>Steps:</strong> ${steps}</p>
    <p><strong>Result:</strong> ${formatPolynomial(result)}</p>
  `;
}

calculateButton.addEventListener('click', calculate);

calculate();
