import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import {
  calculateWakeUpRecommendations,
  roundToNextQuarterHour,
  FALL_ASLEEP_MINUTES,
  SLEEP_CYCLES,
  CYCLE_MINUTES,
} from '/assets/js/core/sleep-utils.js';

const modeGroup = document.querySelector('[data-button-group="wake-mode"]');
const dateTimeInput = document.querySelector('#wake-datetime');
const dateTimeRow = document.querySelector('#wake-datetime-row');
const fallbackWrap = document.querySelector('#wake-fallback');
const fallbackDateInput = document.querySelector('#wake-date');
const fallbackTimeInput = document.querySelector('#wake-time');
const latencyRow = document.querySelector('#wake-latency-row');
const latencyInput = document.querySelector('#wake-latency');
const calculateButton = document.querySelector('#wake-calculate');
const resultsList = document.querySelector('#wake-results-list');
const placeholder = document.querySelector('#wake-placeholder');

const metadata = {
  title: 'Wake-Up Time Calculator – When Should I Wake Up?',
  description:
    'Calculate the best wake-up time based on when you go to sleep and full sleep cycles. Simple, fast, and free wake-up time calculator.',
  canonical: 'https://calchowmuch.com/calculators/time-and-date/wake-up-time-calculator/',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How many sleep cycles should I aim for?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Many adults feel best with 5–6 cycles (about 7.5–9 hours), but needs vary.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is a sleep cycle?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'A sleep cycle is a repeating pattern of light sleep, deep sleep, and REM sleep that often lasts about 90 minutes.',
        },
      },
      {
        '@type': 'Question',
        name: 'Why does the calculator show multiple wake-up times?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'It shows options for 4, 5, and 6 cycles so you can pick what fits your schedule.',
        },
      },
      {
        '@type': 'Question',
        name: 'Why might I still feel tired even if I wake up after full cycles?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'Cycle length varies, and factors like stress, caffeine, irregular schedules, or sleep disorders can affect sleep quality.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does the calculator account for naps or sleep debt?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'No. It provides simple estimates based on typical cycles and does not model naps or long-term sleep patterns.',
        },
      },
    ],
  },
};

setPageMetadata(metadata);

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

ensureH1Title();

function updateLatencyVisibility(mode) {
  if (!latencyRow) {
    return;
  }
  const isBedMode = mode === 'bed';
  latencyRow.classList.toggle('is-collapsed', !isBedMode);
  latencyRow.setAttribute('aria-hidden', String(!isBedMode));
  if (latencyInput) {
    latencyInput.disabled = !isBedMode;
  }
}

const modeButtons = setupButtonGroup(modeGroup, {
  defaultValue: 'sleep',
  onChange: (value) => {
    updateLatencyVisibility(value);
    if (!resultsList?.classList.contains('is-hidden')) {
      calculate();
    }
  },
});

updateLatencyVisibility(modeButtons?.getValue() ?? 'sleep');

function formatDateTimeLocalValue(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

function formatDateValue(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatTimeValue(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatTime(date) {
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

function supportsDateTimeLocal() {
  if (!dateTimeInput) {
    return false;
  }
  const test = document.createElement('input');
  test.setAttribute('type', 'datetime-local');
  return test.type === 'datetime-local';
}

const hasDateTimeSupport = supportsDateTimeLocal();
if (!hasDateTimeSupport && fallbackWrap) {
  dateTimeRow?.classList.add('is-hidden');
  fallbackWrap.classList.remove('is-hidden');
  dateTimeInput?.setAttribute('disabled', 'true');
}

const defaultDate = roundToNextQuarterHour(new Date());
if (dateTimeInput) {
  dateTimeInput.value = formatDateTimeLocalValue(defaultDate);
}
if (fallbackDateInput) {
  fallbackDateInput.value = formatDateValue(defaultDate);
}
if (fallbackTimeInput) {
  fallbackTimeInput.value = formatTimeValue(defaultDate);
}
if (latencyInput) {
  latencyInput.value = String(FALL_ASLEEP_MINUTES);
}

function getSelectedDate() {
  if (hasDateTimeSupport && dateTimeInput) {
    const value = dateTimeInput.value;
    if (!value) {
      return null;
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return null;
    }
    return parsed;
  }

  if (fallbackDateInput && fallbackTimeInput) {
    const dateValue = fallbackDateInput.value;
    const timeValue = fallbackTimeInput.value;
    if (!dateValue || !timeValue) {
      return null;
    }
    const parsed = new Date(`${dateValue}T${timeValue}`);
    if (Number.isNaN(parsed.getTime())) {
      return null;
    }
    return parsed;
  }

  return null;
}

function getLatencyMinutes(mode) {
  if (mode !== 'bed') {
    return 0;
  }
  if (!latencyInput) {
    return FALL_ASLEEP_MINUTES;
  }
  const parsed = Number(latencyInput.value);
  if (!Number.isFinite(parsed)) {
    return FALL_ASLEEP_MINUTES;
  }
  return Math.max(0, parsed);
}

function showPlaceholder() {
  placeholder?.classList.remove('is-hidden');
  resultsList?.classList.add('is-hidden');
  if (resultsList) {
    resultsList.innerHTML = '';
  }
}

function formatCycleHours(cycles) {
  const hours = (cycles * CYCLE_MINUTES) / 60;
  return Number.isInteger(hours) ? String(hours) : hours.toFixed(1);
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

    const message = document.createElement('div');
    message.textContent = `Wake up at ${formatTime(rec.wakeTime)} after ${rec.cycles} cycles (${formatCycleHours(
      rec.cycles
    )} hours).`;

    const cycle = document.createElement('div');
    cycle.className = 'cycle-label';
    cycle.textContent = rec.cycles === 5 ? 'Recommended (5 cycles)' : `${rec.cycles} cycles`;

    item.append(message, cycle);
    resultsList.appendChild(item);
  });

  placeholder.classList.add('is-hidden');
  resultsList.classList.remove('is-hidden');
}

function calculate() {
  const selectedDate = getSelectedDate();
  if (!selectedDate) {
    showPlaceholder();
    return;
  }

  const mode = modeButtons?.getValue() ?? 'sleep';
  const latencyMinutes = getLatencyMinutes(mode);
  const recommendations = calculateWakeUpRecommendations({
    mode,
    date: selectedDate,
    latencyMinutes,
  });

  if (!recommendations.length || recommendations.length !== SLEEP_CYCLES.length) {
    showPlaceholder();
    return;
  }

  showResults(recommendations);
}

calculateButton?.addEventListener('click', calculate);
latencyInput?.addEventListener('input', () => {
  if (!resultsList?.classList.contains('is-hidden')) {
    calculate();
  }
});
