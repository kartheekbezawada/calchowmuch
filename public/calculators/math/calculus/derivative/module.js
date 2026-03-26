/**
 * Derivative Calculator Module
 * Provides symbolic differentiation capabilities
 */
import { SymbolicDifferentiator } from './logic.js';

export { SymbolicDifferentiator } from './logic.js';

// Initialize calculator
export function initDerivativeCalculator() {
  const calculateBtn = document.getElementById('deriv-calculate');
  const resultDiv = document.getElementById('deriv-result');
  const stepsDiv = document.getElementById('deriv-steps');
  const functionInput = document.getElementById('deriv-function');
  const variableInput = document.getElementById('deriv-variable');
  const orderInput = document.getElementById('deriv-order');
  const evalPointInput = document.getElementById('deriv-eval-point');
  const snapshotFunction = document.querySelector('[data-deriv-snap="function"]');
  const snapshotOrder = document.querySelector('[data-deriv-snap="order"]');
  const snapshotDerivative = document.querySelector('[data-deriv-snap="derivative"]');
  const snapshotStatus = document.querySelector('[data-deriv-snap="status"]');

  if (!calculateBtn) return;

  function updateSnapshots({
    fn = functionInput?.value?.trim() || 'x^2',
    order = orderInput?.value || '1',
    derivative = '-',
    status = '-',
  } = {}) {
    if (snapshotFunction) {
      snapshotFunction.textContent = fn;
    }
    if (snapshotOrder) {
      snapshotOrder.textContent = String(order);
    }
    if (snapshotDerivative) {
      snapshotDerivative.textContent = derivative;
    }
    if (snapshotStatus) {
      snapshotStatus.textContent = status;
    }
  }

  function showError(message) {
    resultDiv.innerHTML = `
      <article class="deriv-result-box deriv-error">
        <h4>Input issue</h4>
        <p>${message}</p>
      </article>
    `;
    stepsDiv.innerHTML = `
      <article class="deriv-step-panel">
        <h4>What to do next</h4>
        <p>Use a polynomial-style expression such as <strong>x^2 + 3*x + 5</strong>, keep the variable short, and choose an order between 1 and 5.</p>
      </article>
    `;
    updateSnapshots({ status: 'Invalid input' });
  }

  function calculateDerivative() {
    const funcInput = functionInput.value.trim();
    const variableName = variableInput.value.trim() || 'x';
    const derivativeOrder = parseInt(orderInput.value, 10) || 1;
    const evaluationInput = evalPointInput.value.trim();

    if (!funcInput) {
      showError('Please enter a function before calculating.');
      return;
    }

    try {
      const differentiator = new SymbolicDifferentiator(variableName);
      const result = differentiator.differentiate(funcInput, derivativeOrder);
      const evaluatedValue =
        evaluationInput === '' ? null : differentiator.evaluateAt(result.terms, parseFloat(evaluationInput));
      const orderMark = "'".repeat(derivativeOrder);
      const evaluatedDisplay =
        evaluatedValue === null ? 'Not requested' : Number.isFinite(evaluatedValue) ? evaluatedValue.toFixed(6) : 'Undefined';

      resultDiv.innerHTML = `
        <article class="deriv-summary-card">
          <h4>Derivative summary</h4>
          <div class="deriv-summary-grid">
            <div class="deriv-stat">
              <span>Function</span>
              <strong>f(${variableName}) = ${funcInput}</strong>
            </div>
            <div class="deriv-stat">
              <span>Derivative</span>
              <strong>f${orderMark}(${variableName}) = ${result.derivative}</strong>
            </div>
            <div class="deriv-stat">
              <span>Order</span>
              <strong>${derivativeOrder}</strong>
            </div>
            <div class="deriv-stat">
              <span>Scope</span>
              <strong>${evaluationInput ? `Evaluated at ${variableName} = ${evaluationInput}` : 'Symbolic derivative only'}</strong>
            </div>
          </div>
        </article>
        <article class="deriv-result-box">
          <h4>Quick interpretation</h4>
          <p>The derivative tells you how the function changes with respect to <strong>${variableName}</strong>.</p>
          <p><strong>Computed derivative:</strong> ${result.derivative}</p>
          <p><strong>Evaluated value:</strong> ${evaluatedDisplay}</p>
        </article>
      `;

      stepsDiv.innerHTML = `
        <article class="deriv-step-panel">
          <h4>Step-by-step solution</h4>
          <pre>${result.steps.join('\n')}</pre>
        </article>
      `;

      updateSnapshots({
        fn: funcInput,
        order: derivativeOrder,
        derivative: result.derivative,
        status: 'Solved',
      });
    } catch (error) {
      showError(`Unable to differentiate the current expression. ${error.message}`);
    }
  }

  calculateBtn.addEventListener('click', calculateDerivative);

  // Trigger initial calculation
  calculateDerivative();
}

if (typeof document !== 'undefined') {
  initDerivativeCalculator();
}
