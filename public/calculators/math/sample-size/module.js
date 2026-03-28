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
  title: 'Sample Size Calculator – Mean & Proportion Planner',
  description:
    'Estimate sample size for proportion or mean studies using confidence levels, margins of error, finite population correction, and examples.',
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
const presetState = document.querySelector('#ss-preset-state');
const marginLabel = document.querySelector('#ss-margin-label');
const marginHint = document.querySelector('#ss-margin-hint');

const marginInput = document.querySelector('#ss-margin');
const proportionInput = document.querySelector('#ss-proportion');
const sigmaInput = document.querySelector('#ss-sigma');
const populationInput = document.querySelector('#ss-population');
const calculateButton = document.querySelector('#ss-calculate');

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
const answerState = document.querySelector('#ss-answer-state');

const fieldRefs = {
  margin: {
    wrapper: document.querySelector('[data-field="margin"]'),
    input: marginInput,
    error: document.querySelector('#ss-margin-error'),
  },
  proportion: {
    wrapper: document.querySelector('[data-field="proportion"]'),
    input: proportionInput,
    error: document.querySelector('#ss-proportion-error'),
  },
  sigma: {
    wrapper: document.querySelector('[data-field="sigma"]'),
    input: sigmaInput,
    error: document.querySelector('#ss-sigma-error'),
  },
  population: {
    wrapper: document.querySelector('[data-field="population"]'),
    input: populationInput,
    error: document.querySelector('#ss-population-error'),
  },
};

const presetLookup = new Map(RESEARCH_PRESETS.map((preset) => [preset.id, preset]));
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

let activeMode = 'proportion';
let activePresetId = null;
let lastValidResult = null;
let isDirty = false;
let isInvalid = false;

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
    handleManualChange();
  },
});

function clearFieldErrors() {
  Object.values(fieldRefs).forEach((field) => {
    field.wrapper?.classList.remove('has-error');
    field.input?.removeAttribute('aria-invalid');
    if (field.error) {
      field.error.textContent = '';
      field.error.classList.add('is-hidden');
    }
  });
}

function renderFieldErrors(errors = {}) {
  clearFieldErrors();

  Object.entries(errors).forEach(([key, message]) => {
    const field = fieldRefs[key];
    if (!field || !message) return;
    field.wrapper?.classList.add('has-error');
    field.input?.setAttribute('aria-invalid', 'true');
    if (field.error) {
      field.error.textContent = message;
      field.error.classList.remove('is-hidden');
    }
  });
}

function setAnswerState(text) {
  if (answerState) answerState.textContent = text;
}

function setResultState({ dirty = false, invalid = false } = {}) {
  isDirty = dirty;
  isInvalid = invalid;
  answerSection?.classList.toggle('is-dirty', dirty);
  answerSection?.classList.toggle('is-invalid', invalid);
}

function clearActivePreset() {
  activePresetId = null;
  presetButtons.forEach((button) => {
    button.classList.remove('is-active');
    button.setAttribute('aria-pressed', 'false');
  });
}

function syncPresetButtons() {
  presetButtons.forEach((button) => {
    const isActive = button.dataset.ssPreset === activePresetId;
    const isMuted = button.dataset.ssPresetMode !== activeMode;
    button.classList.toggle('is-active', isActive);
    button.classList.toggle('is-muted', isMuted);
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

function updatePresetStateLabel(label) {
  if (presetState) presetState.textContent = label;
}

function updateModePanels() {
  modePanels.forEach((panel) => {
    const isActive = panel.dataset.modePanel === activeMode;
    panel.classList.toggle('is-active', isActive);
    panel.hidden = !isActive;
  });
}

function setActiveMode(mode, options = {}) {
  activeMode = mode === 'mean' ? 'mean' : 'proportion';
  calcRoot?.setAttribute('data-active-mode', activeMode);

  if (modeSwitch && options.syncButton !== false) {
    modeSwitch.setValue(activeMode);
  }

  updateModePanels();
  syncPresetButtons();

  const content = MODE_CONTENT[activeMode];
  if (modeCopy) modeCopy.textContent = content.hero;
  if (marginLabel) marginLabel.textContent = content.marginLabel;
  if (marginHint) marginHint.textContent = content.marginHint;
  if (variableLabel) variableLabel.textContent = content.variableLabel;

  if (options.clearPreset) {
    clearActivePreset();
    updatePresetStateLabel('Customised inputs');
  }

  if (options.markDirty) {
    markResultsDirty();
  }
}

function renderList(target, items, className) {
  if (!target) return;
  target.innerHTML = items.map((item) => `<li class="${className}">${item}</li>`).join('');
}

function renderSteps(steps) {
  if (!stepsList) return;
  stepsList.innerHTML = steps
    .map((step) => `<li class="ss-step-item"><strong>${step.label}.</strong> ${step.text}</li>`)
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
    .map((row) => {
      const classes = row.isActive ? 'ss-row-active' : '';
      return (
        `<tr class="${classes}">` +
        `<th scope="row">${row.marginLabel}</th>` +
        `<td><span>${formatNumber(row.baseRounded, { maximumFractionDigits: 0 })}</span><small>${formatNumber(
          row.baseN,
          { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        )}</small></td>` +
        `<td><span>${formatNumber(row.finalRounded, { maximumFractionDigits: 0 })}</span><small>${formatNumber(
          row.finalN,
          { minimumFractionDigits: 2, maximumFractionDigits: 2 }
        )}</small></td>` +
        `</tr>`
      );
    })
    .join('');
}

function renderIdleState() {
  const copy = MODE_CONTENT[activeMode];
  if (resultMode) resultMode.textContent = copy.label;
  if (resultValue) resultValue.textContent = '--';
  if (resultSummary) {
    resultSummary.textContent =
      'Pick a study mode, adjust the assumptions, and click Calculate Sample Size.';
  }
  if (methodOutput) methodOutput.textContent = copy.label;
  if (confidenceOutput) confidenceOutput.textContent = '--';
  if (marginOutput) marginOutput.textContent = '--';
  if (variableLabel) variableLabel.textContent = copy.variableLabel;
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
    {
      label: 'Choose a study mode',
      text: 'Select proportion for percentages or mean for continuous outcomes.',
    },
    {
      label: 'Set the planning assumptions',
      text: 'Enter confidence, margin of error, and the mode-specific planning input.',
    },
    {
      label: 'Calculate the sample target',
      text: 'Click Calculate Sample Size to generate the result and sensitivity table.',
    },
  ]);
  renderSensitivityTable(null);
  setAnswerState('Ready for calculation');
  setResultState({ dirty: false, invalid: false });
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
    renderFieldErrors(result.errors);
    setResultState({ dirty: false, invalid: true });
    setAnswerState('Fix highlighted field');

    if (resultSummary) {
      resultSummary.textContent = lastValidResult
        ? 'Inputs are invalid. Showing the last valid result until you calculate again.'
        : 'Inputs are invalid. Fix the highlighted field and calculate again.';
    }

    if (!lastValidResult) {
      if (resultMode) resultMode.textContent = MODE_CONTENT[activeMode].label;
      if (resultValue) resultValue.textContent = '--';
      renderSensitivityTable(null);
    }
    return;
  }

  clearFieldErrors();
  lastValidResult = result;

  if (resultMode) resultMode.textContent = result.methodLabel;
  if (resultValue) {
    resultValue.textContent = formatNumber(result.requiredSampleSize, {
      maximumFractionDigits: 0,
    });
  }
  if (resultSummary) resultSummary.textContent = result.summary;
  if (methodOutput) methodOutput.textContent = result.methodLabel;
  if (confidenceOutput) confidenceOutput.textContent = result.confidenceLabel;
  if (marginOutput) {
    marginOutput.textContent =
      result.mode === 'proportion'
        ? `±${result.marginPercent}%`
        : `±${formatNumber(result.marginValue, { maximumFractionDigits: 2 })}`;
  }
  if (variableLabel) variableLabel.textContent = result.variableLabel;
  if (variableOutput) {
    variableOutput.textContent =
      result.mode === 'proportion'
        ? `${result.proportionPercent}%`
        : formatNumber(result.sigmaValue, { maximumFractionDigits: 2 });
  }
  if (populationOutput) {
    populationOutput.textContent = result.hasPopulation
      ? formatNumber(result.populationSize, { maximumFractionDigits: 0 })
      : 'Infinite';
  }
  if (baseOutput) {
    baseOutput.textContent = formatNumber(result.n0, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  if (correctedOutput) {
    correctedOutput.textContent = result.hasPopulation
      ? formatNumber(result.correctedN, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : 'Not applied';
  }

  if (interpretation) interpretation.textContent = result.interpretation;
  renderList(assumptionsList, result.assumptions, 'ss-assumption-item');
  renderSteps(result.steps);
  renderSensitivityTable(result);
  setResultState({ dirty: false, invalid: false });
  setAnswerState(activePresetId ? 'Solved preset' : 'Updated calculation');

  if (answerSection && !prefersReducedMotion.matches) {
    answerSection.classList.remove('is-flashed');
    requestAnimationFrame(() => {
      answerSection.classList.add('is-flashed');
    });
  }
}

function markResultsDirty() {
  clearFieldErrors();
  setResultState({ dirty: true, invalid: false });
  setAnswerState('Calculate to refresh');

  if (resultSummary && lastValidResult) {
    resultSummary.textContent =
      'Inputs changed. Showing the last valid result until you calculate again.';
  } else if (resultSummary) {
    resultSummary.textContent = 'Inputs changed. Click Calculate Sample Size to generate a result.';
  }
}

function handleManualChange() {
  if (activePresetId) {
    clearActivePreset();
    updatePresetStateLabel('Customised inputs');
  } else {
    updatePresetStateLabel('Customised inputs');
  }
  markResultsDirty();
}

function applyPreset(presetId) {
  const preset = presetLookup.get(presetId);
  if (!preset) return;

  activePresetId = preset.id;
  setActiveMode(preset.mode, { clearPreset: false, markDirty: false });
  syncPresetButtons();
  updatePresetStateLabel(preset.stateLabel);

  confidenceSwitch?.setValue(preset.values.confidenceZ);
  if (marginInput) marginInput.value = preset.values.margin;
  if (proportionInput) proportionInput.value = preset.values.proportion;
  if (sigmaInput) sigmaInput.value = preset.values.sigma;
  if (populationInput) populationInput.value = preset.values.population;

  runCalculation();
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

presetButtons.forEach((button) => {
  button.addEventListener('click', () => applyPreset(button.dataset.ssPreset));
});

[marginInput, proportionInput, sigmaInput, populationInput].forEach((input) => {
  input?.addEventListener('input', handleManualChange);
});

setActiveMode('proportion', { syncButton: false, markDirty: false });
renderIdleState();
applyPreset('general-survey');
