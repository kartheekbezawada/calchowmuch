/**
 * Integral Calculator Module
 * Provides symbolic and numerical integration capabilities
 */

import { SymbolicIntegrator } from './logic.js';

export { SymbolicIntegrator } from './logic.js';

export function initIntegralCalculator() {
  const calculateBtn = document.getElementById('int-calculate');
  const resultDiv = document.getElementById('int-result');
  const stepsDiv = document.getElementById('int-steps');
  const modeButtons = document.querySelectorAll('.mode-button');
  const definiteBounds = document.getElementById('definite-bounds');
  const functionInput = document.getElementById('int-function');
  const variableInput = document.getElementById('int-variable');
  const lowerInput = document.getElementById('int-lower');
  const upperInput = document.getElementById('int-upper');
  const snapshotMode = document.querySelector('[data-int-snap="mode"]');
  const snapshotFunction = document.querySelector('[data-int-snap="function"]');
  const snapshotResult = document.querySelector('[data-int-snap="result"]');
  const snapshotStatus = document.querySelector('[data-int-snap="status"]');

  let currentMode = 'indefinite';

  if (!calculateBtn) return;

  function updateSnapshots({
    mode = currentMode === 'indefinite' ? 'Indefinite' : 'Definite',
    fn = functionInput?.value?.trim() || 'x^2',
    result = '-',
    status = '-',
  } = {}) {
    if (snapshotMode) snapshotMode.textContent = mode;
    if (snapshotFunction) snapshotFunction.textContent = fn;
    if (snapshotResult) snapshotResult.textContent = result;
    if (snapshotStatus) snapshotStatus.textContent = status;
  }

  function showError(message) {
    resultDiv.innerHTML = `
      <article class="intg-result-box intg-error">
        <h4>Input issue</h4>
        <p>${message}</p>
      </article>
    `;
    stepsDiv.innerHTML = `
      <article class="intg-step-panel">
        <h4>What to do next</h4>
        <p>Use a polynomial-style expression such as <strong>x^2 + 3*x + 5</strong>, keep the variable short, and enter valid numeric bounds for definite mode.</p>
      </article>
    `;
    updateSnapshots({ status: 'Invalid input' });
  }

  modeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      modeButtons.forEach((button) => button.classList.remove('active'));
      btn.classList.add('active');
      currentMode = btn.dataset.mode;
      definiteBounds.hidden = currentMode !== 'definite';
      updateSnapshots({ mode: currentMode === 'indefinite' ? 'Indefinite' : 'Definite' });
      calculateIntegral();
    });
  });

  function calculateIntegral() {
    const fn = functionInput.value.trim();
    const variableName = variableInput.value.trim() || 'x';

    if (!fn) {
      showError('Please enter a function before calculating.');
      return;
    }

    try {
      const integrator = new SymbolicIntegrator(variableName);
      const result = integrator.integrate(fn);

      if (currentMode === 'indefinite') {
        resultDiv.innerHTML = `
          <article class="intg-summary-card">
            <h4>Integral summary</h4>
            <div class="intg-summary-grid">
              <div class="intg-stat">
                <span>Mode</span>
                <strong>Indefinite</strong>
              </div>
              <div class="intg-stat">
                <span>Antiderivative</span>
                <strong>${result.integral}</strong>
              </div>
              <div class="intg-stat">
                <span>Function</span>
                <strong>f(${variableName}) = ${fn}</strong>
              </div>
              <div class="intg-stat">
                <span>Interpretation</span>
                <strong>Family of antiderivatives with constant C</strong>
              </div>
            </div>
          </article>
          <article class="intg-result-box">
            <h4>Quick interpretation</h4>
            <p><strong>∫f(${variableName})d${variableName} = ${result.integral}</strong></p>
            <p>This mode returns an antiderivative family, so the result includes the integration constant <strong>C</strong>.</p>
          </article>
        `;

        updateSnapshots({
          mode: 'Indefinite',
          fn,
          result: result.integral,
          status: 'Solved',
        });
      } else {
        const lowerBound = parseFloat(lowerInput.value);
        const upperBound = parseFloat(upperInput.value);
        if (!Number.isFinite(lowerBound) || !Number.isFinite(upperBound)) {
          showError('Enter valid numeric lower and upper bounds for definite mode.');
          return;
        }

        const value = integrator.evaluateDefinite(result.terms, lowerBound, upperBound);
        const formattedValue = value.toFixed(6);

        resultDiv.innerHTML = `
          <article class="intg-summary-card">
            <h4>Integral summary</h4>
            <div class="intg-summary-grid">
              <div class="intg-stat">
                <span>Mode</span>
                <strong>Definite</strong>
              </div>
              <div class="intg-stat">
                <span>Value</span>
                <strong>${formattedValue}</strong>
              </div>
              <div class="intg-stat">
                <span>Bounds</span>
                <strong>${lowerBound} to ${upperBound}</strong>
              </div>
              <div class="intg-stat">
                <span>Antiderivative</span>
                <strong>${result.integral}</strong>
              </div>
            </div>
          </article>
          <article class="intg-result-box">
            <h4>Quick interpretation</h4>
            <p><strong>∫[${lowerBound} to ${upperBound}]f(${variableName})d${variableName} = ${formattedValue}</strong></p>
            <p>This mode evaluates the antiderivative at the upper and lower bounds and subtracts the two values.</p>
          </article>
        `;

        updateSnapshots({
          mode: 'Definite',
          fn,
          result: formattedValue,
          status: 'Solved',
        });
      }

      stepsDiv.innerHTML = `
        <article class="intg-step-panel">
          <h4>Step-by-step solution</h4>
          <pre>${result.steps.join('\n')}</pre>
        </article>
      `;
    } catch (error) {
      showError(`Unable to integrate the current expression. ${error.message}`);
    }
  }

  calculateBtn.addEventListener('click', calculateIntegral);
  calculateIntegral();
}

if (typeof document !== 'undefined') {
  initIntegralCalculator();
}
