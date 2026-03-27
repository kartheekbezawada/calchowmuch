/**
 * Limit Calculator Module
 * Calculates limits numerically and symbolically
 */

import { LimitCalculator } from './logic.js';

export { LimitCalculator } from './logic.js';

export function initLimitCalculator() {
  const calculateBtn = document.getElementById('limit-calculate');
  const resultDiv = document.getElementById('limit-result');
  const stepsDiv = document.getElementById('limit-steps');
  const directionButtons = document.querySelectorAll('.direction-button');
  const functionInput = document.getElementById('limit-function');
  const variableInput = document.getElementById('limit-variable');
  const approachInput = document.getElementById('limit-approaches');
  const snapshotDirection = document.querySelector('[data-limit-snap="direction"]');
  const snapshotApproach = document.querySelector('[data-limit-snap="approach"]');
  const snapshotResult = document.querySelector('[data-limit-snap="result"]');
  const snapshotStatus = document.querySelector('[data-limit-snap="status"]');

  let currentDirection = 'both';

  if (!calculateBtn) return;

  function directionLabel(direction = currentDirection) {
    if (direction === 'left') return 'Left';
    if (direction === 'right') return 'Right';
    return 'Two-Sided';
  }

  function updateSnapshots({
    direction = directionLabel(),
    approach = approachInput?.value?.trim() || '1',
    result = '-',
    status = '-',
  } = {}) {
    if (snapshotDirection) snapshotDirection.textContent = direction;
    if (snapshotApproach) snapshotApproach.textContent = approach;
    if (snapshotResult) snapshotResult.textContent = result;
    if (snapshotStatus) snapshotStatus.textContent = status;
  }

  function showError(message) {
    resultDiv.innerHTML = `
      <article class="limq-result-box limq-error">
        <h4>Input issue</h4>
        <p>${message}</p>
      </article>
    `;
    stepsDiv.innerHTML = `
      <article class="limq-step-panel">
        <h4>What to do next</h4>
        <p>Enter a valid function and approach value, then choose whether you want the two-sided, left-hand, or right-hand limit.</p>
      </article>
    `;
    updateSnapshots({ status: 'Invalid input' });
  }

  directionButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      directionButtons.forEach((button) => button.classList.remove('active'));
      btn.classList.add('active');
      currentDirection = btn.dataset.direction;
      updateSnapshots({ direction: directionLabel(currentDirection) });
      calculateLimit();
    });
  });

  function calculateLimit() {
    const fn = functionInput.value.trim();
    const variableName = variableInput.value.trim() || 'x';
    const approach = approachInput.value.trim();

    if (!fn || !approach) {
      showError('Please enter both a function and an approach value.');
      return;
    }

    try {
      const calculator = new LimitCalculator(variableName);
      const result = calculator.calculateLimit(fn, approach, currentDirection);
      const resultText =
        result.exists && Number.isFinite(result.value)
          ? result.value.toFixed(6)
          : result.exists
            ? String(result.value)
            : 'Does not exist';

      if (result.exists) {
        resultDiv.innerHTML = `
          <article class="limq-summary-card">
            <h4>Limit summary</h4>
            <div class="limq-summary-grid">
              <div class="limq-stat">
                <span>Direction</span>
                <strong>${directionLabel(currentDirection)}</strong>
              </div>
              <div class="limq-stat">
                <span>Approach value</span>
                <strong>${approach}</strong>
              </div>
              <div class="limq-stat">
                <span>Limit value</span>
                <strong>${resultText}</strong>
              </div>
              <div class="limq-stat">
                <span>Continuity</span>
                <strong>${result.continuous ? 'Continuous at the point' : 'Approximation or one-sided check'}</strong>
              </div>
            </div>
          </article>
          <article class="limq-result-box">
            <h4>Quick interpretation</h4>
            <p><strong>lim[${variableName}→${approach}] f(${variableName}) = ${resultText}</strong></p>
            <p>${result.continuous ? 'Direct substitution worked, so the function is continuous at the approach point.' : 'The route used numerical approximation or one-sided sampling to estimate the limit behavior.'}</p>
          </article>
        `;
      } else {
        resultDiv.innerHTML = `
          <article class="limq-summary-card">
            <h4>Limit summary</h4>
            <div class="limq-summary-grid">
              <div class="limq-stat">
                <span>Direction</span>
                <strong>${directionLabel(currentDirection)}</strong>
              </div>
              <div class="limq-stat">
                <span>Approach value</span>
                <strong>${approach}</strong>
              </div>
              <div class="limq-stat">
                <span>Status</span>
                <strong>Does not exist</strong>
              </div>
              <div class="limq-stat">
                <span>Reason</span>
                <strong>One-sided values do not agree or the function diverges.</strong>
              </div>
            </div>
          </article>
          <article class="limq-result-box">
            <h4>Quick interpretation</h4>
            <p><strong>The selected limit does not exist.</strong></p>
            ${
              currentDirection === 'both' && Number.isFinite(result.leftLimit) && Number.isFinite(result.rightLimit)
                ? `<p>Left-hand limit: ${result.leftLimit.toFixed(6)}. Right-hand limit: ${result.rightLimit.toFixed(6)}.</p>`
                : '<p>The numeric approximation does not settle to a single finite value for the selected direction.</p>'
            }
          </article>
        `;
      }

      stepsDiv.innerHTML = `
        <article class="limq-step-panel">
          <h4>Step-by-step analysis</h4>
          <pre>${calculator.steps.join('\n')}</pre>
        </article>
      `;

      updateSnapshots({
        direction: directionLabel(currentDirection),
        approach,
        result: resultText,
        status: result.exists ? 'Solved' : 'No limit',
      });
    } catch (error) {
      showError(`Unable to evaluate the current limit. ${error.message}`);
    }
  }

  calculateBtn.addEventListener('click', calculateLimit);
  calculateLimit();
}

if (typeof document !== 'undefined') {
  initLimitCalculator();
}
