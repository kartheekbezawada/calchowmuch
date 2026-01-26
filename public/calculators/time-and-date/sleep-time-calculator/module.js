import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import {
  calculateSleepRecommendations,
  roundToNextQuarterHour,
  SLEEP_CYCLES,
} from '/assets/js/core/sleep-utils.js';

const modeGroup = document.querySelector('[data-button-group="sleep-mode"]');
const dateTimeInput = document.querySelector('#sleep-datetime');
const dateTimeRow = document.querySelector('#sleep-datetime-row');
const fallbackWrap = document.querySelector('#sleep-fallback');
const fallbackDateInput = document.querySelector('#sleep-date');
const fallbackTimeInput = document.querySelector('#sleep-time');
const calculateButton = document.querySelector('#sleep-calculate');
const resultsList = document.querySelector('#sleep-results-list');
const placeholder = document.querySelector('#sleep-placeholder');

const metadata = {
  title: 'Sleep Time Calculator – Best Time to Sleep and Wake Up',
  description:
    'Calculate the best time to sleep or wake up based on natural sleep cycles. Simple, fast, and free sleep time calculator.',
  canonical: 'https://calchowmuch.com/calculators/time-and-date/sleep-time-calculator/',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How many hours of sleep do I need?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Most adults do best with 7–9 hours per night (about 5–6 cycles).',
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
        name: 'Is 6 hours of sleep enough?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'Six hours is roughly 4 cycles. Some people manage short-term, but many perform better with 7+ hours consistently.',
        },
      },
      {
        '@type': 'Question',
        name: 'Why are multiple sleep times shown?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'The calculator shows options for 4, 5, and 6 cycles so you can choose a schedule that fits your day.',
        },
      },
      {
        '@type': 'Question',
        name: 'Why might I still feel tired after following the suggestions?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'Cycle length varies by person and by night, and factors like stress, caffeine, sleep debt, or sleep disorders can affect how rested you feel.',
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
  h1.textContent = 'Sleep Time Calculator';
  title.replaceWith(h1);
}

ensureH1Title();

const modeButtons = setupButtonGroup(modeGroup, {
  defaultValue: 'wake',
  onChange: () => {
    if (!resultsList?.classList.contains('is-hidden')) {
      calculate();
    }
  },
});

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

function showPlaceholder() {
  placeholder?.classList.remove('is-hidden');
  resultsList?.classList.add('is-hidden');
  if (resultsList) {
    resultsList.innerHTML = '';
  }
}

function showResults(recommendations, mode, baseTime) {
  if (!resultsList || !placeholder) {
    return;
  }
  resultsList.innerHTML = '';
  recommendations.forEach((rec) => {
    const item = document.createElement('div');
    item.className = 'sleep-result';
    if (rec.cycles === 5) {
      item.classList.add('is-primary');
    }

    const message = document.createElement('div');
    if (mode === 'sleep') {
      message.textContent = `Wake up at ${formatTime(rec.wakeTime)} after falling asleep at ${formatTime(
        baseTime
      )} (${rec.cycles} cycles).`;
    } else {
      message.textContent = `Fall asleep by ${formatTime(rec.sleepTime)} to wake at ${formatTime(
        baseTime
      )} (${rec.cycles} cycles).`;
    }

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

  const mode = modeButtons?.getValue() ?? 'wake';
  const recommendations = calculateSleepRecommendations({
    mode,
    date: selectedDate,
  });

  if (!recommendations.length || recommendations.length !== SLEEP_CYCLES.length) {
    showPlaceholder();
    return;
  }

  showResults(recommendations, mode, selectedDate);
}

calculateButton?.addEventListener('click', calculate);

[dateTimeInput, fallbackDateInput, fallbackTimeInput].forEach((input) => {
  input?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      calculate();
    }
  });
});

showPlaceholder();
