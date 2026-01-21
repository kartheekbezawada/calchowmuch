import {
  linearRegression,
  polynomialRegression,
  exponentialRegression,
  logarithmicRegression,
  parseDataset,
} from '/assets/js/core/advanced-statistics.js';
import { formatNumber } from '/assets/js/core/format.js';

export function initRegressionCalculator() {
  const xDataInput = document.querySelector('#reg-x-data');
  const yDataInput = document.querySelector('#reg-y-data');
  const degreeInput = document.querySelector('#reg-degree');
  const degreeRow = document.querySelector('#reg-degree-row');
  const calculateButton = document.querySelector('#reg-calculate');
  const resultDiv = document.querySelector('#reg-result');

  const typeButtons = document.querySelectorAll('[data-button-group="reg-type"] button');
  let selectedType = 'linear';

  typeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      typeButtons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      selectedType = btn.dataset.value;
      degreeRow.style.display = selectedType === 'polynomial' ? 'flex' : 'none';
    });
  });

  function calculate() {
    resultDiv.innerHTML = '';

    const xParsed = parseDataset(xDataInput.value);
    const yParsed = parseDataset(yDataInput.value);

    if (xParsed.errors.length > 0 || yParsed.errors.length > 0) {
      resultDiv.textContent = 'Invalid data. Please enter numbers only.';
      return;
    }

    const x = xParsed.data;
    const y = yParsed.data;

    if (x.length !== y.length) {
      resultDiv.textContent = 'X and Y must have the same number of values.';
      return;
    }

    if (x.length < 2) {
      resultDiv.textContent = 'Please enter at least 2 data points.';
      return;
    }

    let result;
    let equation;
    const opts = { maximumFractionDigits: 6 };

    switch (selectedType) {
      case 'linear':
        result = linearRegression(x, y);
        if (result) {
          equation = `y = ${formatNumber(result.slope, opts)}x + ${formatNumber(result.intercept, opts)}`;
        }
        break;
      case 'polynomial':
        const degree = parseInt(degreeInput.value, 10);
        result = polynomialRegression(x, y, degree);
        if (result) {
          const terms = result.coefficients.map((c, i) => {
            if (i === 0) return formatNumber(c, opts);
            if (i === 1) return `${formatNumber(c, opts)}x`;
            return `${formatNumber(c, opts)}x^${i}`;
          });
          equation = `y = ${terms.join(' + ')}`;
        }
        break;
      case 'exponential':
        result = exponentialRegression(x, y);
        if (result) {
          equation = result.equation;
        }
        break;
      case 'logarithmic':
        result = logarithmicRegression(x, y);
        if (result) {
          equation = result.equation;
        }
        break;
    }

    if (!result) {
      resultDiv.textContent = 'Unable to compute regression. Check your data.';
      return;
    }

    const rSquared = result.rSquared;
    const adjRSquared = result.adjustedRSquared;

    let html = `
      <div class="stats-table">
        <div class="stats-section">
          <h4>Regression Equation</h4>
          <div class="stats-row equation-row"><span>${equation}</span></div>
        </div>
        <div class="stats-section">
          <h4>Goodness of Fit</h4>
          <div class="stats-row"><span>R-squared:</span><span>${formatNumber(rSquared, { maximumFractionDigits: 6 })}</span></div>
          ${adjRSquared !== undefined ? `<div class="stats-row"><span>Adjusted R-squared:</span><span>${formatNumber(adjRSquared, { maximumFractionDigits: 6 })}</span></div>` : ''}
          ${result.standardError !== undefined ? `<div class="stats-row"><span>Standard Error:</span><span>${formatNumber(result.standardError, opts)}</span></div>` : ''}
        </div>
    `;

    if (selectedType === 'linear' && result.coefficients) {
      html += `
        <div class="stats-section">
          <h4>Coefficient Analysis</h4>
          <div class="stats-row"><span>Slope t-statistic:</span><span>${formatNumber(result.coefficients.slope.t, opts)}</span></div>
          <div class="stats-row"><span>Slope p-value:</span><span>${formatNumber(result.coefficients.slope.p, opts)}</span></div>
          <div class="stats-row"><span>Intercept t-statistic:</span><span>${formatNumber(result.coefficients.intercept.t, opts)}</span></div>
          <div class="stats-row"><span>Intercept p-value:</span><span>${formatNumber(result.coefficients.intercept.p, opts)}</span></div>
        </div>
        <div class="stats-section">
          <h4>Correlation</h4>
          <div class="stats-row"><span>Correlation (r):</span><span>${formatNumber(result.r, opts)}</span></div>
          <div class="stats-row"><span>n:</span><span>${result.n}</span></div>
          <div class="stats-row"><span>df:</span><span>${result.df}</span></div>
        </div>
      `;
    }

    html += '</div>';
    resultDiv.innerHTML = html;
  }

  calculateButton.addEventListener('click', calculate);
  calculate();
}
