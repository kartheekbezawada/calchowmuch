import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import { setupButtonGroup } from '/assets/js/core/ui.js';
import { toNumber } from '/assets/js/core/validate.js';
import { calculateProportionCI, calculateMeanCI, Z_VALUES } from '/assets/js/core/stats.js';

const modeGroup = document.querySelector('[data-button-group="ci-mode"]');
const confidenceGroup = document.querySelector('[data-button-group="ci-confidence"]');
const modeButtons = setupButtonGroup(modeGroup, {
  defaultValue: 'proportion',
  onChange: () => {
    updateVisibility();
    calculate();
  },
});
const confidenceButtons = setupButtonGroup(confidenceGroup, {
  defaultValue: '1.96',
  onChange: () => {
    calculate();
  },
});
const phatInput = document.querySelector('#ci-phat');
const xbarInput = document.querySelector('#ci-xbar');
const sigmaInput = document.querySelector('#ci-sigma');
const nInput = document.querySelector('#ci-n');
const phatRow = document.querySelector('#ci-phat-row');
const xbarRow = document.querySelector('#ci-xbar-row');
const sigmaRow = document.querySelector('#ci-sigma-row');
const calculateButton = document.querySelector('#ci-calculate');
const resultDiv = document.querySelector('#ci-result');
const detailDiv = document.querySelector('#ci-detail');

function updateVisibility() {
  const isProportion = (modeButtons?.getValue() ?? 'proportion') === 'proportion';
  phatRow.style.display = isProportion ? '' : 'none';
  xbarRow.style.display = isProportion ? 'none' : '';
  sigmaRow.style.display = isProportion ? 'none' : '';
}

function calculate() {
  resultDiv.textContent = '';
  detailDiv.textContent = '';

  const mode = modeButtons?.getValue() ?? 'proportion';
  const confidenceValue = confidenceButtons?.getValue() ?? '1.96';
  const z = toNumber(confidenceValue, 1.96);
  const n = Math.floor(toNumber(nInput.value, 0));

  // Validation
  if (n < 1) {
    resultDiv.textContent = 'Sample size (n) must be at least 1.';
    return;
  }

  const confidenceLabels = {
    1.645: '90%',
    1.96: '95%',
    2.576: '99%',
  };
  const confidenceLabel = confidenceLabels[confidenceValue] || 'Custom';
  const opts = { maximumFractionDigits: 4 };

  if (mode === 'proportion') {
    const phatPercent = toNumber(phatInput.value, 0);

    if (phatPercent < 0 || phatPercent > 100) {
      resultDiv.textContent = 'Sample proportion must be between 0% and 100%.';
      return;
    }

    const { lower, upper, se, me } = calculateProportionCI(phatPercent, n, z);

    resultDiv.innerHTML = `<strong>${confidenceLabel} Confidence Interval:</strong> ${formatPercent(lower * 100, opts)} to ${formatPercent(upper * 100, opts)}`;

    detailDiv.innerHTML = `
      <p><strong>Sample Proportion (p-hat):</strong> ${formatPercent(phatPercent, opts)}</p>
      <p><strong>Sample Size (n):</strong> ${n}</p>
      <p><strong>Standard Error:</strong> ${formatNumber(se, opts)}</p>
      <p><strong>Margin of Error:</strong> ±${formatPercent(me * 100, opts)}</p>
      <p><strong>Formula:</strong> CI = p-hat ± z × √(p(1-p)/n)</p>
    `;
  } else {
    // Mean with known sigma
    const xbar = toNumber(xbarInput.value, 0);
    const sigma = toNumber(sigmaInput.value, 0);

    if (!Number.isFinite(xbar)) {
      resultDiv.textContent = 'Please enter a valid sample mean.';
      return;
    }

    if (sigma <= 0) {
      resultDiv.textContent = 'Population standard deviation must be greater than 0.';
      return;
    }

    const { lower, upper, se, me } = calculateMeanCI(xbar, sigma, n, z);

    resultDiv.innerHTML = `<strong>${confidenceLabel} Confidence Interval:</strong> ${formatNumber(lower, opts)} to ${formatNumber(upper, opts)}`;

    detailDiv.innerHTML = `
      <p><strong>Sample Mean (x-bar):</strong> ${formatNumber(xbar, opts)}</p>
      <p><strong>Population Std Dev (σ):</strong> ${formatNumber(sigma, opts)}</p>
      <p><strong>Sample Size (n):</strong> ${n}</p>
      <p><strong>Standard Error:</strong> ${formatNumber(se, opts)}</p>
      <p><strong>Margin of Error:</strong> ±${formatNumber(me, opts)}</p>
      <p><strong>Formula:</strong> CI = x-bar ± z × σ/√n</p>
    `;
  }
}

calculateButton.addEventListener('click', calculate);

// Initialize
updateVisibility();
calculate();
