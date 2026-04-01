import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
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

export const pageSchema = {
  calculatorFAQ: true,
  globalFAQ: false,
};

const CALCULATOR_FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How many sleep cycles should I aim for?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Many adults feel best with 5 or 6 cycles, or about 7.5 to 9 hours, but personal sleep needs vary.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is a sleep cycle?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A sleep cycle is a repeating pattern of light sleep, deep sleep, and REM sleep that often lasts about 90 minutes.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why are 4, 5, and 6 cycles shown?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'These options give a practical range of wake-up times so you can balance sleep duration with your schedule.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does this calculator assume it takes time to fall asleep?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. In bedtime mode, it adds a 15-minute buffer before sleep cycles begin.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use this if I wake during the night?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Re-enter the new bedtime and calculate again for updated wake-up suggestions.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why might I feel groggy even after a suggested wake-up time?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cycle length varies by person and by night, so a suggested wake-up time can still feel off sometimes.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does daylight saving time affect the result?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It can, because clock changes can shift local wall-clock wake-up times.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is this calculator a medical tool?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It is a planning aid and does not diagnose sleep or health conditions.',
      },
    },
    {
      '@type': 'Question',
      name: 'Should I choose 5 or 6 cycles?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Choose the option that fits your schedule while still leaving enough total sleep time.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if my schedule allows only 4 cycles?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Four cycles can work occasionally, but many adults feel better with longer sleep when possible.',
      },
    },
  ],
};

const metadata = {
  title: 'Wake-Up Time Calculator | Best Alarm Times by Sleep Cycle',
  description:
    'Calculate the best wake-up times from a target bedtime using 90-minute sleep cycles, then compare 4, 5, or 6 cycle options before you set an alarm.',
  canonical: 'https://calchowmuch.com/time-and-date/wake-up-time-calculator/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Wake-Up Time Calculator | Sleep Cycle Wake Times',
        url: 'https://calchowmuch.com/time-and-date/wake-up-time-calculator/',
        description:
          'Find wake-up times based on 90-minute sleep cycles and compare 4, 5, or 6 cycle options.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Wake-Up Time Calculator',
        applicationCategory: 'HealthApplication',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/time-and-date/wake-up-time-calculator/',
        description:
          'Free wake-up time calculator for sleep-cycle-based wake recommendations.',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        creator: { '@type': 'Organization', name: 'CalcHowMuch' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://calchowmuch.com/' },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Time & Date',
            item: 'https://calchowmuch.com/time-and-date/',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Wake-Up Time Calculator',
            item: 'https://calchowmuch.com/time-and-date/wake-up-time-calculator/',
          },
        ],
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
