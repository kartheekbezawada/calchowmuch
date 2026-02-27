import { setupButtonGroup } from '/assets/js/core/ui.js';
import {
  calculateWakeUpRecommendations,
  roundToNextQuarterHour,
  FALL_ASLEEP_MINUTES,
  SLEEP_CYCLES,
  CYCLE_MINUTES,
} from '/assets/js/core/sleep-utils.js';

const modeGroup = document.querySelector('[data-button-group="wake-mode"]');
const fieldLabel = document.querySelector('#wake-field-label');
const primaryTimeInput = document.querySelector('#wake-time-primary');
const timePickerButton = document.querySelector('#wake-time-picker');
const calculateButton = document.querySelector('#wake-calculate');
const resultsList = document.querySelector('#wake-results-list');
const placeholder = document.querySelector('#wake-placeholder');
const errorMessage = document.querySelector('#wake-error');
const bufferCopy = document.querySelector('#wake-buffer-copy');

const proxyInput = document.querySelector('#wake-latency-proxy');
const proxyButton = document.querySelector('#wake-calc');
const proxyResult = document.querySelector('#wake-result');

const summaryInputTime = document.querySelector('[data-wake-summary="input-time"]');
const summarySleepStart = document.querySelector('[data-wake-summary="sleep-start"]');
const summaryRecommendedWake = document.querySelector('[data-wake-summary="recommended-wake"]');
const scenarioMode = document.querySelector('[data-wake-scenario="mode"]');
const scenarioInput = document.querySelector('[data-wake-scenario="input"]');
const scenarioSleepStart = document.querySelector('[data-wake-scenario="sleep-start"]');
const scenarioRecommended = document.querySelector('[data-wake-scenario="recommended"]');
const cycle4Value = document.querySelector('[data-wake-metric="cycle-4"]');
const cycle5Value = document.querySelector('[data-wake-metric="cycle-5"]');
const cycle6Value = document.querySelector('[data-wake-metric="cycle-6"]');
const bufferValue = document.querySelector('[data-wake-metric="buffer"]');
const explanationPrimary = document.querySelector('[data-wake-expl="primary"]');
const explanationWindow = document.querySelector('[data-wake-expl="window"]');

function ensureH1Title() {
  const title = document.getElementById('calculator-title');
  if (!title || title.tagName === 'H1') {
    return;
  }
  const h1 = document.createElement('h1');
  h1.id = 'calculator-title';
  h1.textContent = 'Wake-Up Time Calculator';
  title.replaceWith(h1);
}

function formatTimeValue(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatDateTime(date) {
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatTime(date) {
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

function timeValueToMinutes(value) {
  if (typeof value !== 'string' || !value.includes(':')) {
    return null;
  }
  const [hours, minutes] = value.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }
  return hours * 60 + minutes;
}

function minutesToTimeValue(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  const normalized = ((Math.round(parsed) % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function getSelectedDate() {
  const timeValue = primaryTimeInput?.value;
  if (!timeValue) {
    return null;
  }
  const [hours, minutes] = timeValue.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  const baseDate = new Date();
  baseDate.setHours(hours, minutes, 0, 0);
  return baseDate;
}

function getSleepStart(mode, selectedDate) {
  if (mode === 'bed') {
    return new Date(selectedDate.getTime() + FALL_ASLEEP_MINUTES * 60000);
  }
  return new Date(selectedDate.getTime());
}

function clearError() {
  if (!errorMessage) {
    return;
  }
  errorMessage.textContent = '';
  errorMessage.classList.add('is-hidden');
}

function showError(message) {
  if (!errorMessage) {
    return;
  }
  errorMessage.textContent = message;
  errorMessage.classList.remove('is-hidden');
}

function showResults(recommendations) {
  if (!resultsList || !placeholder) {
    return;
  }

  resultsList.innerHTML = '';
  recommendations.forEach((rec) => {
    const item = document.createElement('div');
    item.className = 'wake-result';
    if (rec.cycles === 5) {
      item.classList.add('is-primary');
    }

    const left = document.createElement('div');
    left.className = 'wake-result-info';

    const cycle = document.createElement('div');
    cycle.className = 'cycle-label';
    cycle.textContent = `${rec.cycles} cycles`;

    const hours = document.createElement('div');
    hours.className = 'wake-result-hours';
    hours.textContent = `${(rec.cycles * CYCLE_MINUTES) / 60} hours of sleep`;

    const badge = document.createElement('span');
    badge.className = 'wake-recommended-badge';
    badge.textContent = 'Best balance';

    left.append(cycle, hours, badge);

    const right = document.createElement('div');
    right.className = 'wake-result-time';
    right.textContent = formatTime(rec.wakeTime);

    item.append(left, right);
    resultsList.appendChild(item);
  });

  placeholder.classList.add('is-hidden');
  if (proxyResult && recommendations[0]) {
    proxyResult.textContent = formatTime(recommendations[0].wakeTime);
  }
}

function updateExplanation(mode, selectedDate, sleepStart, recommendations) {
  const modeLabel = mode === 'bed' ? 'Bedtime mode' : 'Fall-asleep mode';
  const primary =
    recommendations.find((rec) => rec.cycles === 5) ?? recommendations[1] ?? recommendations[0];
  const earliest = recommendations[0];
  const latest = recommendations[recommendations.length - 1];

  if (summaryInputTime) {
    summaryInputTime.textContent = formatDateTime(selectedDate);
  }
  if (summarySleepStart) {
    summarySleepStart.textContent = formatDateTime(sleepStart);
  }
  if (summaryRecommendedWake) {
    summaryRecommendedWake.textContent = formatDateTime(primary.wakeTime);
  }
  if (scenarioMode) {
    scenarioMode.textContent = modeLabel;
  }
  if (scenarioInput) {
    scenarioInput.textContent = formatDateTime(selectedDate);
  }
  if (scenarioSleepStart) {
    scenarioSleepStart.textContent = formatDateTime(sleepStart);
  }
  if (scenarioRecommended) {
    scenarioRecommended.textContent = `${formatDateTime(primary.wakeTime)} (5 cycles)`;
  }
  if (cycle4Value) {
    cycle4Value.textContent = formatDateTime(earliest.wakeTime);
  }
  if (cycle5Value) {
    cycle5Value.textContent = formatDateTime(primary.wakeTime);
  }
  if (cycle6Value) {
    cycle6Value.textContent = formatDateTime(latest.wakeTime);
  }
  if (bufferValue) {
    bufferValue.textContent = `${mode === 'bed' ? FALL_ASLEEP_MINUTES : 0}`;
  }
  if (explanationPrimary) {
    explanationPrimary.textContent = `${formatDateTime(primary.wakeTime)} after 5 cycles`;
  }
  if (explanationWindow) {
    explanationWindow.textContent = `${formatDateTime(earliest.wakeTime)} to ${formatDateTime(latest.wakeTime)}`;
  }
}

function updateFieldLabel(mode) {
  if (!fieldLabel) {
    return;
  }
  fieldLabel.textContent =
    mode === 'bed' ? 'I plan to go to bed at...' : 'I plan to fall asleep at...';
  if (bufferCopy) {
    bufferCopy.textContent = mode === 'bed' ? '15-minute' : '0-minute';
  }
}

function calculate() {
  const selectedDate = getSelectedDate();
  if (!selectedDate) {
    showError('Please enter a valid time.');
    return;
  }

  const mode = modeButtons?.getValue() ?? 'sleep';
  const sleepStart = getSleepStart(mode, selectedDate);
  const recommendations = calculateWakeUpRecommendations({
    mode,
    date: selectedDate,
    latencyMinutes: FALL_ASLEEP_MINUTES,
  });

  if (!recommendations.length || recommendations.length !== SLEEP_CYCLES.length) {
    showError('Unable to calculate wake-up times. Please check your input and try again.');
    return;
  }

  clearError();
  showResults(recommendations);
  updateExplanation(mode, selectedDate, sleepStart, recommendations);
}

ensureH1Title();

const modeButtons = setupButtonGroup(modeGroup, {
  defaultValue: 'sleep',
  onChange: () => {
    updateFieldLabel(modeButtons?.getValue() ?? 'sleep');
  },
});

const defaultDate = roundToNextQuarterHour(new Date());
if (primaryTimeInput) {
  primaryTimeInput.value = formatTimeValue(defaultDate);
}
if (proxyInput) {
  const initialMinutes = timeValueToMinutes(formatTimeValue(defaultDate));
  proxyInput.value = String(initialMinutes ?? 0);
}

calculateButton?.addEventListener('click', calculate);
proxyButton?.addEventListener('click', calculate);

timePickerButton?.addEventListener('click', () => {
  if (!primaryTimeInput) {
    return;
  }
  if (typeof primaryTimeInput.showPicker === 'function') {
    primaryTimeInput.showPicker();
    return;
  }
  primaryTimeInput.focus();
});

proxyInput?.addEventListener('input', () => {
  const next = minutesToTimeValue(proxyInput.value);
  if (next && primaryTimeInput) {
    primaryTimeInput.value = next;
  }
});

proxyInput?.addEventListener('change', () => {
  const next = minutesToTimeValue(proxyInput.value);
  if (next && primaryTimeInput) {
    primaryTimeInput.value = next;
  }
});

primaryTimeInput?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    calculate();
  }
});

primaryTimeInput?.addEventListener('change', () => {
  const minutes = timeValueToMinutes(primaryTimeInput?.value || '');
  if (minutes !== null && proxyInput) {
    proxyInput.value = String(minutes);
  }
});

updateFieldLabel('sleep');
calculate();
