import {
  normalPdf,
  normalCdf,
  normalCdfCustom,
  normalQuantile,
  tPdf,
  tCdf,
  tQuantile,
  chiSquarePdf,
  chiSquareCdf,
  chiSquareQuantile,
  fPdf,
  fCdf,
  fQuantile,
} from '/assets/js/core/advanced-statistics.js';
import { formatNumber } from '/assets/js/core/format.js';

export function initDistributionCalculator() {
  const calculateButton = document.querySelector('#dist-calculate');
  const resultDiv = document.querySelector('#dist-result');

  const normalParams = document.querySelector('#dist-normal-params');
  const tParams = document.querySelector('#dist-t-params');
  const chiParams = document.querySelector('#dist-chi-params');
  const fParams = document.querySelector('#dist-f-params');
  const xRow = document.querySelector('#dist-x-row');
  const pRow = document.querySelector('#dist-p-row');

  const distTypeButtons = document.querySelectorAll('[data-button-group="dist-type"] button');
  const calcTypeButtons = document.querySelectorAll('[data-button-group="dist-calc-type"] button');

  let selectedDistType = 'normal';
  let selectedCalcType = 'cdf';

  distTypeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      distTypeButtons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      selectedDistType = btn.dataset.value;
      updateInputVisibility();
    });
  });

  calcTypeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      calcTypeButtons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      selectedCalcType = btn.dataset.value;
      updateInputVisibility();
    });
  });

  function updateInputVisibility() {
    normalParams.style.display = selectedDistType === 'normal' ? 'block' : 'none';
    tParams.style.display = selectedDistType === 't' ? 'block' : 'none';
    chiParams.style.display = selectedDistType === 'chi-square' ? 'block' : 'none';
    fParams.style.display = selectedDistType === 'f' ? 'block' : 'none';

    xRow.style.display = selectedCalcType !== 'quantile' ? 'flex' : 'none';
    pRow.style.display = selectedCalcType === 'quantile' ? 'flex' : 'none';
  }

  function calculate() {
    resultDiv.innerHTML = '';
    const opts = { maximumFractionDigits: 8 };

    const x = parseFloat(document.querySelector('#dist-x').value);
    const p = parseFloat(document.querySelector('#dist-p').value);

    let result;
    let distName;
    let params = {};

    switch (selectedDistType) {
      case 'normal': {
        const mu = parseFloat(document.querySelector('#dist-mean').value);
        const sigma = parseFloat(document.querySelector('#dist-std').value);

        if (sigma <= 0) {
          resultDiv.textContent = 'Standard deviation must be positive.';
          return;
        }

        distName = `Normal(mu=${mu}, sigma=${sigma})`;
        params = { mu, sigma };

        switch (selectedCalcType) {
          case 'cdf':
            result = normalCdfCustom(x, mu, sigma);
            break;
          case 'quantile':
            const zQuantile = normalQuantile(p);
            result = mu + sigma * zQuantile;
            break;
          case 'pdf':
            const z = (x - mu) / sigma;
            result = normalPdf(z) / sigma;
            break;
        }
        break;
      }

      case 't': {
        const df = parseInt(document.querySelector('#dist-t-df').value, 10);
        if (df < 1) {
          resultDiv.textContent = 'Degrees of freedom must be at least 1.';
          return;
        }

        distName = `Student's t(df=${df})`;
        params = { df };

        switch (selectedCalcType) {
          case 'cdf':
            result = tCdf(x, df);
            break;
          case 'quantile':
            result = tQuantile(p, df);
            break;
          case 'pdf':
            result = tPdf(x, df);
            break;
        }
        break;
      }

      case 'chi-square': {
        const df = parseInt(document.querySelector('#dist-chi-df').value, 10);
        if (df < 1) {
          resultDiv.textContent = 'Degrees of freedom must be at least 1.';
          return;
        }

        distName = `Chi-Square(df=${df})`;
        params = { df };

        switch (selectedCalcType) {
          case 'cdf':
            if (x < 0) {
              result = 0;
            } else {
              result = chiSquareCdf(x, df);
            }
            break;
          case 'quantile':
            result = chiSquareQuantile(p, df);
            break;
          case 'pdf':
            result = chiSquarePdf(x, df);
            break;
        }
        break;
      }

      case 'f': {
        const d1 = parseInt(document.querySelector('#dist-f-df1').value, 10);
        const d2 = parseInt(document.querySelector('#dist-f-df2').value, 10);
        if (d1 < 1 || d2 < 1) {
          resultDiv.textContent = 'Degrees of freedom must be at least 1.';
          return;
        }

        distName = `F(d1=${d1}, d2=${d2})`;
        params = { d1, d2 };

        switch (selectedCalcType) {
          case 'cdf':
            if (x < 0) {
              result = 0;
            } else {
              result = fCdf(x, d1, d2);
            }
            break;
          case 'quantile':
            result = fQuantile(p, d1, d2);
            break;
          case 'pdf':
            result = fPdf(x, d1, d2);
            break;
        }
        break;
      }
    }

    if (result === null || result === undefined || !isFinite(result)) {
      resultDiv.textContent = 'Unable to compute. Check your inputs.';
      return;
    }

    let calcLabel;
    let inputLabel;
    let inputValue;

    switch (selectedCalcType) {
      case 'cdf':
        calcLabel = 'P(X <= x)';
        inputLabel = 'x';
        inputValue = x;
        break;
      case 'quantile':
        calcLabel = 'Quantile (x value)';
        inputLabel = 'p';
        inputValue = p;
        break;
      case 'pdf':
        calcLabel = 'Probability Density f(x)';
        inputLabel = 'x';
        inputValue = x;
        break;
    }

    let html = `
      <div class="stats-table">
        <div class="stats-section">
          <h4>${distName}</h4>
          <div class="stats-row"><span>Input (${inputLabel}):</span><span>${formatNumber(inputValue, opts)}</span></div>
          <div class="stats-row result-highlight"><span>${calcLabel}:</span><span>${formatNumber(result, opts)}</span></div>
        </div>
    `;

    // Add complementary information
    if (selectedCalcType === 'cdf') {
      html += `
        <div class="stats-section">
          <h4>Complementary Probabilities</h4>
          <div class="stats-row"><span>P(X > x):</span><span>${formatNumber(1 - result, opts)}</span></div>
        </div>
      `;
    }

    // Add critical values for common significance levels
    if (selectedCalcType === 'cdf' || selectedCalcType === 'quantile') {
      html += `
        <div class="stats-section">
          <h4>Common Critical Values</h4>
      `;

      const alphas = [0.10, 0.05, 0.025, 0.01, 0.005];
      for (const alpha of alphas) {
        let critValue;
        switch (selectedDistType) {
          case 'normal':
            critValue = params.mu + params.sigma * normalQuantile(1 - alpha);
            break;
          case 't':
            critValue = tQuantile(1 - alpha, params.df);
            break;
          case 'chi-square':
            critValue = chiSquareQuantile(1 - alpha, params.df);
            break;
          case 'f':
            critValue = fQuantile(1 - alpha, params.d1, params.d2);
            break;
        }
        if (critValue !== null && isFinite(critValue)) {
          html += `<div class="stats-row"><span>alpha = ${alpha}:</span><span>${formatNumber(critValue, { maximumFractionDigits: 4 })}</span></div>`;
        }
      }
      html += '</div>';
    }

    html += '</div>';
    resultDiv.innerHTML = html;
  }

  calculateButton.addEventListener('click', calculate);
  updateInputVisibility();
  calculate();
}
