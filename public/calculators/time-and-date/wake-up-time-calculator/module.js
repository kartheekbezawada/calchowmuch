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
const errorMessage = document.querySelector('#wake-error');
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
        text: 'Many adults feel best with 5 or 6 cycles (about 7.5 to 9 hours), but personal needs vary.',
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
        text: 'These options balance schedule flexibility with enough total sleep for most adults.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does this calculator assume it takes time to fall asleep?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. In bedtime mode, it adds a fixed 15-minute buffer before sleep cycles begin.',
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
        text: 'Cycle length varies by person, so timing can still feel off on some nights.',
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
        text: 'Choose the option that fits your schedule while still leaving enough rest time.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if my schedule allows only 4 cycles?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '4 cycles can work occasionally, but many adults feel better with longer sleep when possible.',
      },
    },
  ],
};

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      name: 'Wake-Up Time Calculator',
      url: 'https://calchowmuch.com/time-and-date/wake-up-time-calculator/',
      description:
        'Calculate wake-up times using 90-minute sleep cycles and a fixed 15-minute fall-asleep buffer.',
      inLanguage: 'en',
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Wake-Up Time Calculator',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web',
      url: 'https://calchowmuch.com/time-and-date/wake-up-time-calculator/',
      description:
        'Free wake-up calculator to estimate ideal wake times after 4, 5, or 6 sleep cycles.',
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
};

const metadata = {
  title: 'Wake-Up Time Calculator – Best Times to Wake Up | CalcHowMuch',
  description:
    'Calculate wake-up times using 90-minute sleep cycles. Enter your bedtime and get clear 4, 5, and 6 cycle wake-up recommendations.',
  canonical: 'https://calchowmuch.com/time-and-date/wake-up-time-calculator/',
  structuredData: STRUCTURED_DATA,
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
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
    clearError();
    showPlaceholder();
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
  latencyInput.readOnly = true;
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

function getSleepStart(mode, selectedDate) {
  if (mode === 'bed') {
    return new Date(selectedDate.getTime() + FALL_ASLEEP_MINUTES * 60000);
  }
  return new Date(selectedDate.getTime());
}

function formatDateTime(date) {
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
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
  placeholder?.classList.add('is-hidden');
  resultsList?.classList.add('is-hidden');
  if (resultsList) {
    resultsList.innerHTML = '';
  }
}

function showPlaceholder() {
  clearError();
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

function calculate() {
  const selectedDate = getSelectedDate();
  if (!selectedDate) {
    showError('Please enter a valid date and time.');
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

calculateButton?.addEventListener('click', calculate);

dateTimeInput?.addEventListener('input', () => {
  clearError();
  showPlaceholder();
});
fallbackDateInput?.addEventListener('input', () => {
  clearError();
  showPlaceholder();
});
fallbackTimeInput?.addEventListener('input', () => {
  clearError();
  showPlaceholder();
});
