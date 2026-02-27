import { formatNumber } from '/assets/js/core/format.js';
import { hasMaxDigits } from '/assets/js/core/validate.js';
import {
  extractGcf,
  factorByGrouping,
  factorDifferenceOfSquares,
  factorQuadratic,
  factorSumDifferenceCubes,
  formatLinearFactor,
  formatPolynomial,
  formatPowerFactor,
  formatQuadraticFactor,
  parsePolynomial,
} from '/assets/js/core/algebra.js';

const polyInput = document.querySelector('#factor-poly');
const calculateButton = document.querySelector('#factor-calculate');
const resultDiv = document.querySelector('#factor-result');
const detailDiv = document.querySelector('#factor-detail');
const methodGcf = document.querySelector('#method-gcf');
const methodQuadratic = document.querySelector('#method-quadratic');
const methodDifference = document.querySelector('#method-difference');
const methodSumDifference = document.querySelector('#method-sum-difference');
const methodGrouping = document.querySelector('#method-grouping');

const snapshotInput = document.querySelector('[data-factor-snap="input"]');
const snapshotMethod = document.querySelector('[data-factor-snap="method"]');
const snapshotFactored = document.querySelector('[data-factor-snap="factored"]');
const snapshotResidual = document.querySelector('[data-factor-snap="residual"]');

function updateSnapshot(node, value) {
  if (node) {
    node.textContent = value;
  }
}

function resetSnapshots() {
  updateSnapshot(snapshotMethod, '-');
  updateSnapshot(snapshotFactored, '-');
  updateSnapshot(snapshotResidual, '-');
}

function validatePolynomialInput(input) {
  const tokens = input.match(/-?\d*\.?\d+/g) || [];
  const invalidToken = tokens.find((token) => !hasMaxDigits(token, 12));
  return invalidToken ? 'Numeric values are limited to 12 digits.' : null;
}

function formatGcfLabel(gcf) {
  const coeff = gcf.gcfCoeff === 1 ? '' : formatNumber(gcf.gcfCoeff);
  if (gcf.gcfPower === 0) {
    return coeff || '1';
  }
  const power = gcf.gcfPower === 1 ? 'x' : `x^${gcf.gcfPower}`;
  return `${coeff}${power}`;
}

function calculate() {
  resultDiv.textContent = '';
  detailDiv.textContent = '';

  const inputText = polyInput.value || '';
  updateSnapshot(snapshotInput, inputText || '-');

  const validationError = validatePolynomialInput(inputText);
  if (validationError) {
    resultDiv.textContent = validationError;
    resetSnapshots();
    return;
  }

  const parsed = parsePolynomial(inputText);
  if (parsed.errors.length) {
    resultDiv.textContent = `Invalid terms: ${parsed.errors.join(', ')}`;
    resetSnapshots();
    return;
  }

  let workingCoeffs = parsed.coeffs;
  const factors = [];
  const steps = [];

  if (methodGcf.checked) {
    const gcf = extractGcf(workingCoeffs);
    if (gcf) {
      factors.push(formatGcfLabel(gcf));
      steps.push(`Extract GCF: ${formatGcfLabel(gcf)} × (${formatPolynomial(gcf.remaining)})`);
      workingCoeffs = gcf.remaining;
    }
  }

  let factored = null;

  if (!factored && methodQuadratic.checked) {
    const quad = factorQuadratic(workingCoeffs);
    if (quad) {
      factored = {
        label: 'Quadratic factoring',
        factors: quad.factors.map((factor) => formatLinearFactor(factor)),
      };
    }
  }

  if (!factored && methodDifference.checked) {
    const diff = factorDifferenceOfSquares(workingCoeffs);
    if (diff) {
      factored = {
        label: 'Difference of squares',
        factors: diff.factors.map((factor) => formatPowerFactor(factor)),
      };
    }
  }

  if (!factored && methodSumDifference.checked) {
    const cubes = factorSumDifferenceCubes(workingCoeffs);
    if (cubes) {
      const linear = formatLinearFactor(cubes.factors[0]);
      const quadratic = formatQuadraticFactor(cubes.factors[1]);
      factored = {
        label: 'Sum/Difference of cubes',
        factors: [linear, quadratic],
      };
    }
  }

  if (!factored && methodGrouping.checked) {
    const grouping = factorByGrouping(workingCoeffs);
    if (grouping) {
      const quadratic = formatQuadraticFactor(grouping.factors[0]);
      const linear = formatLinearFactor(grouping.factors[1]);
      factored = {
        label: 'Factoring by grouping',
        factors: [quadratic, linear],
      };
    }
  }

  if (factored) {
    factors.push(...factored.factors);
    steps.push(`${factored.label}: ${factored.factors.join(' ')}`);
    resultDiv.innerHTML = `<strong>Factored Form:</strong> ${factors.join(' ')}`;
    updateSnapshot(snapshotMethod, factored.label);
    updateSnapshot(snapshotFactored, factors.join(' '));
    updateSnapshot(snapshotResidual, formatPolynomial(workingCoeffs));
  } else {
    const fallback = factors.length
      ? `${factors.join(' ')} (${formatPolynomial(workingCoeffs)})`
      : formatPolynomial(workingCoeffs);

    resultDiv.innerHTML = `<strong>Factored Form:</strong> ${fallback}`;
    steps.push('No additional factoring found with selected methods.');

    updateSnapshot(snapshotMethod, 'No further match');
    updateSnapshot(snapshotFactored, fallback);
    updateSnapshot(snapshotResidual, formatPolynomial(workingCoeffs));
  }

  detailDiv.innerHTML = `
    <p><strong>Original Polynomial:</strong> ${formatPolynomial(parsed.coeffs)}</p>
    <p><strong>Steps:</strong></p>
    <ul>${steps.map((step) => `<li>${step}</li>`).join('')}</ul>
  `;
}

calculateButton.addEventListener('click', calculate);

calculate();
