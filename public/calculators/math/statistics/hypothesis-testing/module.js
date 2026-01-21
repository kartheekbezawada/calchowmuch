import {
  oneSampleTTest,
  twoSampleTTest,
  pairedTTest,
  chiSquareGoodnessOfFit,
  parseDataset,
} from '/assets/js/core/advanced-statistics.js';
import { formatNumber } from '/assets/js/core/format.js';

export function initHypothesisCalculator() {
  const calculateButton = document.querySelector('#hyp-calculate');
  const resultDiv = document.querySelector('#hyp-result');

  const oneSampleInputs = document.querySelector('#hyp-one-sample-inputs');
  const twoSampleInputs = document.querySelector('#hyp-two-sample-inputs');
  const chiSquareInputs = document.querySelector('#hyp-chi-square-inputs');
  const alternativeRow = document.querySelector('#hyp-alternative-row');

  const testTypeButtons = document.querySelectorAll('[data-button-group="hyp-test-type"] button');
  const alternativeButtons = document.querySelectorAll('[data-button-group="hyp-alternative"] button');
  const alphaButtons = document.querySelectorAll('[data-button-group="hyp-alpha"] button');

  let selectedTestType = 'one-sample-t';
  let selectedAlternative = 'two-sided';
  let selectedAlpha = 0.05;

  testTypeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      testTypeButtons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      selectedTestType = btn.dataset.value;
      updateInputVisibility();
    });
  });

  alternativeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      alternativeButtons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      selectedAlternative = btn.dataset.value;
    });
  });

  alphaButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      alphaButtons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      selectedAlpha = parseFloat(btn.dataset.value);
    });
  });

  function updateInputVisibility() {
    oneSampleInputs.style.display = selectedTestType === 'one-sample-t' ? 'block' : 'none';
    twoSampleInputs.style.display =
      selectedTestType === 'two-sample-t' || selectedTestType === 'paired-t' ? 'block' : 'none';
    chiSquareInputs.style.display = selectedTestType === 'chi-square' ? 'block' : 'none';
    alternativeRow.style.display = selectedTestType !== 'chi-square' ? 'flex' : 'none';
  }

  function calculate() {
    resultDiv.innerHTML = '';
    const opts = { maximumFractionDigits: 6 };

    let result;
    let testName;

    switch (selectedTestType) {
      case 'one-sample-t': {
        const sampleParsed = parseDataset(document.querySelector('#hyp-sample-data').value);
        const mu0 = parseFloat(document.querySelector('#hyp-mu0').value);

        if (sampleParsed.errors.length > 0 || sampleParsed.data.length < 2) {
          resultDiv.textContent = 'Please enter at least 2 valid sample values.';
          return;
        }

        result = oneSampleTTest(sampleParsed.data, mu0, selectedAlternative);
        testName = 'One-Sample t-Test';
        break;
      }

      case 'two-sample-t': {
        const sample1Parsed = parseDataset(document.querySelector('#hyp-sample1-data').value);
        const sample2Parsed = parseDataset(document.querySelector('#hyp-sample2-data').value);

        if (
          sample1Parsed.errors.length > 0 ||
          sample2Parsed.errors.length > 0 ||
          sample1Parsed.data.length < 2 ||
          sample2Parsed.data.length < 2
        ) {
          resultDiv.textContent = 'Please enter at least 2 valid values for each sample.';
          return;
        }

        result = twoSampleTTest(sample1Parsed.data, sample2Parsed.data, selectedAlternative, false);
        testName = "Two-Sample t-Test (Welch's)";
        break;
      }

      case 'paired-t': {
        const sample1Parsed = parseDataset(document.querySelector('#hyp-sample1-data').value);
        const sample2Parsed = parseDataset(document.querySelector('#hyp-sample2-data').value);

        if (
          sample1Parsed.errors.length > 0 ||
          sample2Parsed.errors.length > 0 ||
          sample1Parsed.data.length < 2 ||
          sample2Parsed.data.length !== sample1Parsed.data.length
        ) {
          resultDiv.textContent = 'Samples must have the same length (at least 2 values each).';
          return;
        }

        result = pairedTTest(sample1Parsed.data, sample2Parsed.data, selectedAlternative);
        testName = 'Paired t-Test';
        break;
      }

      case 'chi-square': {
        const observedParsed = parseDataset(document.querySelector('#hyp-observed').value);
        const expectedParsed = parseDataset(document.querySelector('#hyp-expected').value);

        if (
          observedParsed.errors.length > 0 ||
          expectedParsed.errors.length > 0 ||
          observedParsed.data.length < 2 ||
          observedParsed.data.length !== expectedParsed.data.length
        ) {
          resultDiv.textContent = 'Observed and expected must have the same number of values (at least 2).';
          return;
        }

        result = chiSquareGoodnessOfFit(observedParsed.data, expectedParsed.data);
        testName = 'Chi-Square Goodness of Fit Test';
        break;
      }
    }

    if (!result) {
      resultDiv.textContent = 'Unable to compute test. Check your data.';
      return;
    }

    const significant =
      result.pValue !== undefined && result.pValue < selectedAlpha;
    const statName = selectedTestType === 'chi-square' ? 'Chi-Square' : 't';
    const statValue = selectedTestType === 'chi-square' ? result.chiSquare : result.tStatistic;

    let html = `
      <div class="stats-table">
        <div class="stats-section">
          <h4>${testName}</h4>
          <div class="stats-row"><span>${statName}-statistic:</span><span>${formatNumber(statValue, opts)}</span></div>
          <div class="stats-row"><span>p-value:</span><span>${formatNumber(result.pValue, opts)}</span></div>
          <div class="stats-row"><span>Degrees of Freedom:</span><span>${formatNumber(result.df, { maximumFractionDigits: 2 })}</span></div>
          <div class="stats-row"><span>Result:</span><span class="${significant ? 'significant' : 'not-significant'}">${significant ? 'Reject H0' : 'Fail to Reject H0'} at alpha = ${selectedAlpha}</span></div>
        </div>
    `;

    if (selectedTestType !== 'chi-square') {
      if (result.sampleMean !== undefined) {
        html += `
          <div class="stats-section">
            <h4>Sample Statistics</h4>
            <div class="stats-row"><span>Sample Mean:</span><span>${formatNumber(result.sampleMean, opts)}</span></div>
            <div class="stats-row"><span>Sample Std Dev:</span><span>${formatNumber(result.sampleStd, opts)}</span></div>
            <div class="stats-row"><span>Standard Error:</span><span>${formatNumber(result.se, opts)}</span></div>
            <div class="stats-row"><span>n:</span><span>${result.n}</span></div>
          </div>
        `;
      } else if (result.mean1 !== undefined) {
        html += `
          <div class="stats-section">
            <h4>Sample Statistics</h4>
            <div class="stats-row"><span>Mean 1:</span><span>${formatNumber(result.mean1, opts)}</span></div>
            <div class="stats-row"><span>Mean 2:</span><span>${formatNumber(result.mean2, opts)}</span></div>
            <div class="stats-row"><span>Mean Difference:</span><span>${formatNumber(result.meanDifference, opts)}</span></div>
            <div class="stats-row"><span>Standard Error:</span><span>${formatNumber(result.se, opts)}</span></div>
          </div>
        `;
      }

      if (result.confidenceInterval) {
        html += `
          <div class="stats-section">
            <h4>95% Confidence Interval</h4>
            <div class="stats-row"><span>Lower Bound:</span><span>${formatNumber(result.confidenceInterval.lower, opts)}</span></div>
            <div class="stats-row"><span>Upper Bound:</span><span>${formatNumber(result.confidenceInterval.upper, opts)}</span></div>
          </div>
        `;
      }

      if (result.effectSize) {
        html += `
          <div class="stats-section">
            <h4>Effect Size</h4>
            <div class="stats-row"><span>Cohen's d:</span><span>${formatNumber(result.effectSize.cohenD, opts)}</span></div>
          </div>
        `;
      }
    }

    html += '</div>';
    resultDiv.innerHTML = html;
  }

  calculateButton.addEventListener('click', calculate);
  updateInputVisibility();
  calculate();
}
