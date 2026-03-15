import { formatNumber } from '/assets/js/core/format.js';
import { setPageMetadata, setupButtonGroup } from '/assets/js/core/ui.js';
import {
  MODE_CONTENT,
  RESEARCH_PRESETS,
  calculateMeanSampleSize,
  calculateProportionSampleSize,
  generateSensitivityTable,
} from './engine.js';

const metadata = {
  title: 'Sample Size Calculator — Proportion & Mean Study Planner | CalcHowMuch',
  description:
    'Plan your study sample size for proportions or means with confidence intervals, finite-population correction, worked examples, sensitivity tables, and research-ready guidance. Free, no sign-up.',
  canonical: 'https://calchowmuch.com/math/sample-size/',
};

setPageMetadata(metadata);

function ensureH1Title() {
  const title = document.getElementById('calculator-title');
  if (!title) return;
  title.textContent = 'Sample Size Calculator';
}

ensureH1Title();

const calcRoot = document.getElementById('calc-sample-size');
const modeGroup = document.querySelector('[data-button-group="ss-mode"]');
const confidenceGroup = document.querySelector('[data-button-group="ss-confidence"]');
const presetButtons = Array.from(document.querySelectorAll('[data-ss-preset]'));
const modePanels = Array.from(document.querySelectorAll('[data-mode-panel]'));

const modeCopy = document.querySelector('#ss-mode-copy');
const marginLabel = document.querySelector('#ss-margin-label');
const marginHint = document.querySelector('#ss-margin-hint');

const marginInput = document.querySelector('#ss-margin');
const proportionInput = document.querySelector('#ss-proportion');
const sigmaInput = document.querySelector('#ss-sigma');
const populationInput = document.querySelector('#ss-population');
const calculateButton = document.querySelector('#ss-calculate');
const errorMessage = document.querySelector('#ss-error');

const resultMode = document.querySelector('#ss-result-mode');
const resultValue = document.querySelector('#ss-result-value');
const resultSummary = document.querySelector('#ss-result-summary');
const methodOutput = document.querySelector('#ss-method-output');
const confidenceOutput = document.querySelector('#ss-confidence-output');
const marginOutput = document.querySelector('#ss-margin-output');
const variableLabel = document.querySelector('#ss-variable-label');
const variableOutput = document.querySelector('#ss-variable-output');
const populationOutput = document.querySelector('#ss-population-output');
const baseOutput = document.querySelector('#ss-base-output');
const correctedOutput = document.querySelector('#ss-corrected-output');
const interpretation = document.querySelector('#ss-interpretation');
const assumptionsList = document.querySelector('#ss-assumptions');
const stepsList = document.querySelector('#ss-steps');
const sensitivityBody = document.querySelector('#ss-sensitivity-body');
const sensitivityMarginHeader = document.querySelector('#ss-sensitivity-margin-header');
const answerSection = document.querySelector('#ss-answer-section');

const presetLookup = new Map(RESEARCH_PRESETS.map((p) => [p.id, p]));

let activeMode = 'proportion';
let activePresetId = null;
let hasCalculated = false;

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const modeSwitch = setupButtonGroup(modeGroup, {
  defaultValue: 'proportion',
  ariaAttribute: 'aria-selected',
  onChange: (value) => {
    setActiveMode(value, { clearPreset: true, markDirty: true });
  },
});

const confidenceSwitch = setupButtonGroup(confidenceGroup, {
  defaultValue: '1.96',
  onChange: () => {
    clearActivePreset();
    markResultsDirty();
  },
});

function setError(message = '') {
  if (!errorMessage) return;
  errorMessage.textContent = message;
  errorMessage.classList.toggle('is-hidden', !message);
}

function clearActivePreset() {
  activePresetId = null;
  presetButtons.forEach((btn) => {
    btn.classList.remove('is-active');
    btn.setAttribute('aria-pressed', 'false');
  });
}

function syncPresetButtons() {
  presetButtons.forEach((btn) => {
    const isActive = btn.dataset.ssPreset === activePresetId;
    btn.classList.toggle('is-active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

function setActiveMode(mode, options = {}) {
  activeMode = mode === 'mean' ? 'mean' : 'proportion';
  calcRoot?.setAttribute('data-active-mode', activeMode);

  if (modeSwitch && options.syncButton !== false) {
    modeSwitch.setValue(activeMode);
  }

  modePanels.forEach((panel) => {
    const isActive = panel.dataset.modePanel === activeMode;
    if (!prefersReducedMotion.matches) {
      panel.style.transition = 'opacity 200ms ease';
      panel.style.opacity = isActive ? '1' : '0';
      if (isActive) {
        panel.hidden = false;
        panel.classList.add('is-active');
      } else {
        setTimeout(() => {
          panel.hidden = true;
          panel.classList.remove('is-active');
        }, 200);
      }
    } else {
      panel.classList.toggle('is-active', isActive);
      panel.hidden = !isActive;
    }
  });

  const content = MODE_CONTENT[activeMode];
  if (modeCopy) modeCopy.textContent = content.hero;
  if (marginLabel) marginLabel.textContent = content.marginLabel;
  if (marginHint) marginHint.textContent = content.marginHint;

  if (options.clearPreset) clearActivePreset();
  if (options.markDirty) markResultsDirty();
}

function renderList(target, items, className) {
  if (!target) return;
  target.innerHTML = items
    .map((item) => `<li class="${className}">${item}</li>`)
    .join('');
}

function renderSteps(steps) {
  if (!stepsList) return;
  stepsList.innerHTML = steps
    .map(
      (step) =>
        `<li class="ss-step-item"><strong>${step.label}.</strong> ${step.text}</li>`
    )
    .join('');
}

function renderSensitivityTable(result) {
  if (!sensitivityBody) return;

  if (!result || !result.ok) {
    sensitivityBody.innerHTML =
      '<tr><td colspan="3" class="ss-table-empty">Calculate a result to see the sensitivity table.</td></tr>';
    return;
  }

  if (sensitivityMarginHeader) {
    sensitivityMarginHeader.textContent =
      result.mode === 'proportion' ? 'Margin of error' : 'Margin (units)';
  }

  const rows = generateSensitivityTable(result);
  sensitivityBody.innerHTML = rows
    .map(
      (row) =>
        `<tr class="${row.isActive ? 'ss-row-active' : ''}">` +
        `<td>${row.marginLabel}</td>` +
        `<td>${formatNumber(row.baseN, { maximumFractionDigits: 0 })}</td>` +
        `<td>${formatNumber(row.finalN, { maximumFractionDigits: 0 })}</td>` +
        `</tr>`
    )
    .join('');
}

function renderIdleState(message) {
  const copy = MODE_CONTENT[activeMode];
  if (resultMode) resultMode.textContent = copy.label;
  if (resultValue) resultValue.textContent = '--';
  if (resultSummary) {
    resultSummary.textContent =
      message || 'Pick a study mode, adjust the assumptions, and click Calculate Sample Size.';
  }
  if (methodOutput) methodOutput.textContent = copy.label;
  if (confidenceOutput) confidenceOutput.textContent = '--';
  if (marginOutput) marginOutput.textContent = '--';
  if (variableLabel) {
    variableLabel.textContent =
      activeMode === 'proportion' ? 'Estimated proportion' : 'Population σ';
  }
  if (variableOutput) variableOutput.textContent = '--';
  if (populationOutput) populationOutput.textContent = '--';
  if (baseOutput) baseOutput.textContent = '--';
  if (correctedOutput) correctedOutput.textContent = '--';
  if (interpretation) {
    interpretation.textContent =
      activeMode === 'proportion'
        ? 'Estimate the number of responses needed for a percentage, prevalence, or survey outcome.'
        : 'Estimate the number of observations needed when the target outcome is a continuous mean.';
  }
  renderList(assumptionsList, copy.idleAssumptions, 'ss-assumption-item');
  renderSteps([
    { label: 'Choose a study mode', text: 'Select proportion for percentages or mean for continuous outcomes.' },
    { label: 'Set the planning assumptions', text: 'Enter confidence, margin of error, and the study-specific input.' },
    { label: 'Calculate the sample target', text: 'Click Calculate Sample Size to generate the result.' },
  ]);
  renderSensitivityTable(null);
}

function markResultsDirty() {
  hasCalculated = false;
  setError('');
  renderIdleState('Inputs changed. Click Calculate Sample Size to refresh.');
}

function applyPreset(presetId) {
  const preset = presetLookup.get(presetId);
  if (!preset) return;

  activePresetId = preset.id;
  syncPresetButtons();

  setActiveMode(preset.mode, { clearPreset: false, markDirty: false });
  confidenceSwitch?.setValue(preset.values.confidenceZ);
  if (marginInput) marginInput.value = preset.values.margin;
  if (proportionInput) proportionInput.value = preset.values.proportion;
  if (sigmaInput) sigmaInput.value = preset.values.sigma;
  if (populationInput) populationInput.value = preset.values.population;

  runCalculation();
}

function readInputs() {
  return {
    mode: activeMode,
    z: Number(confidenceSwitch?.getValue() ?? '1.96'),
    margin: marginInput?.value ?? '',
    proportion: proportionInput?.value ?? '',
    sigma: sigmaInput?.value ?? '',
    populationSize: populationInput?.value ?? '',
  };
}

function renderResult(result) {
  if (!result.ok) {
    setError(result.message || 'Unable to calculate the requested sample size.');
    renderIdleState('Fix the highlighted input and calculate again.');
    return;
  }

  setError('');
  hasCalculated = true;

  if (resultMode) resultMode.textContent = result.methodLabel;
  if (resultValue) {
    resultValue.textContent = formatNumber(result.requiredSampleSize, { maximumFractionDigits: 0 });
  }
  if (resultSummary) resultSummary.textContent = result.summary;
  if (methodOutput) methodOutput.textContent = result.methodLabel;
  if (confidenceOutput) confidenceOutput.textContent = result.confidenceLabel;
  if (variableLabel) variableLabel.textContent = result.variableLabel;

  if (result.mode === 'proportion') {
    if (marginOutput) marginOutput.textContent = `±${result.marginPercent}%`;
    if (variableOutput) variableOutput.textContent = `${result.proportionPercent}%`;
  } else {
    if (marginOutput) marginOutput.textContent = `±${formatNumber(result.marginValue)}`;
    if (variableOutput) variableOutput.textContent = formatNumber(result.sigmaValue);
  }

  if (populationOutput) {
    populationOutput.textContent = result.hasPopulation
      ? formatNumber(result.populationSize, { maximumFractionDigits: 0 })
      : 'Infinite';
  }
  if (baseOutput) {
    baseOutput.textContent = formatNumber(result.n0, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  if (correctedOutput) {
    correctedOutput.textContent = result.hasPopulation
      ? formatNumber(result.correctedN, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : 'Not applied';
  }

  if (interpretation) interpretation.textContent = result.interpretation;
  renderList(assumptionsList, result.assumptions, 'ss-assumption-item');
  renderSteps(result.steps);
  renderSensitivityTable(result);

  if (answerSection && !prefersReducedMotion.matches) {
    answerSection.style.opacity = '0';
    requestAnimationFrame(() => {
      answerSection.style.transition = 'opacity 250ms ease';
      answerSection.style.opacity = '1';
    });
  }
}

function runCalculation() {
  const inputs = readInputs();
  const result =
    inputs.mode === 'mean'
      ? calculateMeanSampleSize(inputs)
      : calculateProportionSampleSize(inputs);
  renderResult(result);
}

calculateButton?.addEventListener('click', runCalculation);

presetButtons.forEach((btn) => {
  btn.addEventListener('click', () => applyPreset(btn.dataset.ssPreset));
});

[marginInput, proportionInput, sigmaInput, populationInput].forEach((input) => {
  input?.addEventListener('input', () => {
    clearActivePreset();
    markResultsDirty();
  });
});

setActiveMode('proportion', { syncButton: false, markDirty: false });
applyPreset('general-survey');
