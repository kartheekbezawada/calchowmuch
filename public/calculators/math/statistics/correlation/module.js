import {
  pearsonCorrelation,
  spearmanCorrelation,
  kendallCorrelation,
  parseDataset,
} from '/assets/js/core/advanced-statistics.js';
import { formatNumber } from '/assets/js/core/format.js';

export function initCorrelationCalculator() {
  const xDataInput = document.querySelector('#corr-x-data');
  const yDataInput = document.querySelector('#corr-y-data');
  const calculateButton = document.querySelector('#corr-calculate');
  const resultDiv = document.querySelector('#corr-result');

  const typeButtons = document.querySelectorAll('[data-button-group="corr-type"] button');
  const alphaButtons = document.querySelectorAll('[data-button-group="corr-alpha"] button');

  let selectedType = 'pearson';
  let selectedAlpha = 0.05;

  typeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      typeButtons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      selectedType = btn.dataset.value;
    });
  });

  alphaButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      alphaButtons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      selectedAlpha = parseFloat(btn.dataset.value);
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

    if (x.length < 3) {
      resultDiv.textContent = 'Please enter at least 3 data points.';
      return;
    }

    let result;
    let coeffName;
    let coeffSymbol;

    switch (selectedType) {
      case 'pearson':
        result = pearsonCorrelation(x, y);
        coeffName = 'Pearson Correlation';
        coeffSymbol = 'r';
        break;
      case 'spearman':
        result = spearmanCorrelation(x, y);
        coeffName = 'Spearman Rank Correlation';
        coeffSymbol = 'rho';
        break;
      case 'kendall':
        result = kendallCorrelation(x, y);
        coeffName = "Kendall's Tau";
        coeffSymbol = 'tau';
        break;
    }

    if (!result) {
      resultDiv.textContent = 'Unable to compute correlation. Check your data.';
      return;
    }

    const opts = { maximumFractionDigits: 6 };
    const coefficient = selectedType === 'kendall' ? result.tau : result.r;
    const significant = result.pValue < selectedAlpha;

    // Interpret correlation strength
    const absCoeff = Math.abs(coefficient);
    let strength;
    if (absCoeff >= 0.9) strength = 'Very Strong';
    else if (absCoeff >= 0.7) strength = 'Strong';
    else if (absCoeff >= 0.5) strength = 'Moderate';
    else if (absCoeff >= 0.3) strength = 'Weak';
    else strength = 'Very Weak';

    const direction = coefficient >= 0 ? 'Positive' : 'Negative';

    let html = `
      <div class="stats-table">
        <div class="stats-section">
          <h4>${coeffName}</h4>
          <div class="stats-row"><span>${coeffSymbol}:</span><span>${formatNumber(coefficient, opts)}</span></div>
          <div class="stats-row"><span>Interpretation:</span><span>${strength} ${direction}</span></div>
          ${result.rSquared !== undefined ? `<div class="stats-row"><span>r-squared:</span><span>${formatNumber(result.rSquared, opts)}</span></div>` : ''}
        </div>
        <div class="stats-section">
          <h4>Significance Test</h4>
          <div class="stats-row"><span>${selectedType === 'kendall' ? 'z' : 't'}-statistic:</span><span>${formatNumber(selectedType === 'kendall' ? result.zStatistic : result.tStatistic, opts)}</span></div>
          <div class="stats-row"><span>p-value:</span><span>${formatNumber(result.pValue, opts)}</span></div>
          ${result.df !== undefined ? `<div class="stats-row"><span>df:</span><span>${result.df}</span></div>` : ''}
          <div class="stats-row"><span>Result:</span><span class="${significant ? 'significant' : 'not-significant'}">${significant ? 'Significant' : 'Not Significant'} at alpha = ${selectedAlpha}</span></div>
        </div>
    `;

    if (result.confidenceInterval) {
      html += `
        <div class="stats-section">
          <h4>95% Confidence Interval</h4>
          <div class="stats-row"><span>Lower Bound:</span><span>${formatNumber(result.confidenceInterval.lower, opts)}</span></div>
          <div class="stats-row"><span>Upper Bound:</span><span>${formatNumber(result.confidenceInterval.upper, opts)}</span></div>
        </div>
      `;
    }

    if (selectedType === 'kendall') {
      html += `
        <div class="stats-section">
          <h4>Concordance Details</h4>
          <div class="stats-row"><span>Concordant Pairs:</span><span>${result.concordant}</span></div>
          <div class="stats-row"><span>Discordant Pairs:</span><span>${result.discordant}</span></div>
          <div class="stats-row"><span>Ties in X:</span><span>${result.tiesX}</span></div>
          <div class="stats-row"><span>Ties in Y:</span><span>${result.tiesY}</span></div>
        </div>
      `;
    }

    html += `
        <div class="stats-section">
          <h4>Sample Info</h4>
          <div class="stats-row"><span>n:</span><span>${result.n}</span></div>
        </div>
      </div>
    `;

    resultDiv.innerHTML = html;
  }

  calculateButton.addEventListener('click', calculate);
  calculate();
}
