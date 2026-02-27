import { setupButtonGroup } from '/assets/js/core/ui.js';
import { hasMaxDigits } from '/assets/js/core/validate.js';
import {
  addPolynomials,
  dividePolynomials,
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

const snapshotOperation = document.querySelector('[data-poly-snap="operation"]');
const snapshotResult = document.querySelector('[data-poly-snap="result"]');
const snapshotDegree = document.querySelector('[data-poly-snap="degree"]');
const snapshotRemainder = document.querySelector('[data-poly-snap="remainder"]');

function updateSnapshot(node, value) {
  if (node) {
    node.textContent = value;
  }
}

function prettifyOperation(op) {
  if (op === 'add') return 'Add';
  if (op === 'subtract') return 'Subtract';
  if (op === 'multiply') return 'Multiply';
  return 'Divide';
}

function polynomialDegree(coeffs) {
  for (let i = coeffs.length - 1; i >= 0; i -= 1) {
    if (Math.abs(coeffs[i]) > 1e-10) {
      return i;
    }
  }
  return 0;
}

function resetSnapshots(op) {
  updateSnapshot(snapshotOperation, prettifyOperation(op));
  updateSnapshot(snapshotResult, '-');
  updateSnapshot(snapshotDegree, '-');
  updateSnapshot(snapshotRemainder, '-');
}

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

  resetSnapshots(op);

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

    const quotientText = formatPolynomial(division.quotient);
    const remainderText = formatPolynomial(division.remainder);

    resultDiv.innerHTML = `
      <strong>Quotient:</strong> ${quotientText}<br />
      <strong>Remainder:</strong> ${remainderText}
    `;
    detailDiv.innerHTML = `
      <p><strong>Dividend:</strong> ${formatPolynomial(poly1)}</p>
      <p><strong>Divisor:</strong> ${formatPolynomial(poly2)}</p>
      <p><strong>Process:</strong> Polynomial long division.</p>
    `;

    updateSnapshot(snapshotResult, quotientText);
    updateSnapshot(snapshotDegree, String(polynomialDegree(division.quotient)));
    updateSnapshot(snapshotRemainder, remainderText);
    return;
  }

  const resultText = formatPolynomial(result);

  resultDiv.innerHTML = `<strong>Result:</strong> ${resultText}`;
  detailDiv.innerHTML = `
    <p><strong>Operation:</strong> ${summary}</p>
    <p><strong>Steps:</strong> ${steps}</p>
    <p><strong>Result:</strong> ${resultText}</p>
  `;

  updateSnapshot(snapshotResult, resultText);
  updateSnapshot(snapshotDegree, String(polynomialDegree(result)));
}

calculateButton.addEventListener('click', calculate);

calculate();
