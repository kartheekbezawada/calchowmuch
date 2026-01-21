import { oneWayAnova, tukeyHSD, parseDataset } from '/assets/js/core/advanced-statistics.js';
import { formatNumber } from '/assets/js/core/format.js';

export function initAnovaCalculator() {
  const groupsInput = document.querySelector('#anova-groups');
  const groupInputsContainer = document.querySelector('#anova-group-inputs');
  const calculateButton = document.querySelector('#anova-calculate');
  const resultDiv = document.querySelector('#anova-result');

  const alphaButtons = document.querySelectorAll('[data-button-group="anova-alpha"] button');
  let selectedAlpha = 0.05;

  alphaButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      alphaButtons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      selectedAlpha = parseFloat(btn.dataset.value);
    });
  });

  function updateGroupInputs() {
    const numGroups = parseInt(groupsInput.value, 10) || 2;
    const existing = groupInputsContainer.querySelectorAll('.input-row').length;

    if (numGroups > existing) {
      for (let i = existing + 1; i <= numGroups; i++) {
        const row = document.createElement('div');
        row.className = 'input-row';
        row.innerHTML = `
          <label for="anova-group-${i}">Group ${i}</label>
          <textarea id="anova-group-${i}" rows="2" placeholder="Enter values separated by commas"></textarea>
        `;
        groupInputsContainer.appendChild(row);
      }
    } else if (numGroups < existing) {
      const rows = groupInputsContainer.querySelectorAll('.input-row');
      for (let i = existing - 1; i >= numGroups; i--) {
        rows[i].remove();
      }
    }
  }

  groupsInput.addEventListener('change', updateGroupInputs);

  function calculate() {
    resultDiv.innerHTML = '';

    const numGroups = parseInt(groupsInput.value, 10) || 2;
    const groups = [];

    for (let i = 1; i <= numGroups; i++) {
      const textarea = document.querySelector(`#anova-group-${i}`);
      if (!textarea) continue;

      const parsed = parseDataset(textarea.value);
      if (parsed.errors.length > 0) {
        resultDiv.textContent = `Group ${i} contains invalid values.`;
        return;
      }
      if (parsed.data.length === 0) {
        resultDiv.textContent = `Group ${i} is empty.`;
        return;
      }
      groups.push(parsed.data);
    }

    if (groups.length < 2) {
      resultDiv.textContent = 'Please enter at least 2 groups.';
      return;
    }

    const result = oneWayAnova(groups);
    if (!result) {
      resultDiv.textContent = 'Unable to compute ANOVA. Check your data.';
      return;
    }

    const opts = { maximumFractionDigits: 4 };
    const significant = result.pValue < selectedAlpha;

    let html = `
      <div class="stats-table">
        <div class="stats-section">
          <h4>ANOVA Summary</h4>
          <div class="stats-row"><span>F-statistic:</span><span>${formatNumber(result.fStatistic, opts)}</span></div>
          <div class="stats-row"><span>p-value:</span><span>${formatNumber(result.pValue, opts)}</span></div>
          <div class="stats-row"><span>Result:</span><span class="${significant ? 'significant' : 'not-significant'}">${significant ? 'Significant' : 'Not Significant'} at alpha = ${selectedAlpha}</span></div>
        </div>
        <div class="stats-section">
          <h4>Degrees of Freedom</h4>
          <div class="stats-row"><span>Between Groups:</span><span>${result.dfBetween}</span></div>
          <div class="stats-row"><span>Within Groups:</span><span>${result.dfWithin}</span></div>
          <div class="stats-row"><span>Total:</span><span>${result.dfTotal}</span></div>
        </div>
        <div class="stats-section">
          <h4>Sum of Squares</h4>
          <div class="stats-row"><span>SSB (Between):</span><span>${formatNumber(result.ssb, opts)}</span></div>
          <div class="stats-row"><span>SSW (Within):</span><span>${formatNumber(result.ssw, opts)}</span></div>
          <div class="stats-row"><span>SST (Total):</span><span>${formatNumber(result.sst, opts)}</span></div>
        </div>
        <div class="stats-section">
          <h4>Mean Squares</h4>
          <div class="stats-row"><span>MSB (Between):</span><span>${formatNumber(result.msb, opts)}</span></div>
          <div class="stats-row"><span>MSW (Within):</span><span>${formatNumber(result.msw, opts)}</span></div>
        </div>
        <div class="stats-section">
          <h4>Effect Sizes</h4>
          <div class="stats-row"><span>Eta-squared:</span><span>${formatNumber(result.etaSquared, opts)}</span></div>
          <div class="stats-row"><span>Omega-squared:</span><span>${formatNumber(result.omegaSquared, opts)}</span></div>
        </div>
        <div class="stats-section">
          <h4>Group Means</h4>
          ${result.groupMeans.map((m, i) => `<div class="stats-row"><span>Group ${i + 1} (n=${result.groupSizes[i]}):</span><span>${formatNumber(m, opts)}</span></div>`).join('')}
          <div class="stats-row"><span>Grand Mean:</span><span>${formatNumber(result.grandMean, opts)}</span></div>
        </div>
      </div>
    `;

    resultDiv.innerHTML = html;
  }

  calculateButton.addEventListener('click', calculate);
  calculate();
}
