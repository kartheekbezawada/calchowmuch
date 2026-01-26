import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import {
  BUFFER_OPTIONS,
  DEFAULT_BUFFER_MINUTES,
  DEFAULT_NAP_TYPE,
  getNapType,
  parseTimeString,
  calculateWakeTime,
} from '/assets/js/core/nap-utils.js';

const napTypeGroup = document.querySelector('[data-button-group="nap-type"]');
const bufferGroup = document.querySelector('[data-button-group="nap-buffer"]');
const startTimeInput = document.querySelector('#nap-start-time');
const useNowButton = document.querySelector('#nap-use-now');
const calculateButton = document.querySelector('#nap-calculate');
const resultsList = document.querySelector('#nap-results-list');
const placeholder = document.querySelector('#nap-placeholder');
const errorMessage = document.querySelector('#nap-error');

const metadata = {
  title: 'Nap Time Calculator – Quick Nap, Power Nap, or Afternoon Nap',
  description:
    'Choose a nap type and start time to get a recommended wake-up time. Compare quick naps, power naps, and afternoon naps with pros, cons, and FAQs.',
  canonical: 'https://calchowmuch.com/time-and-date/nap-time-calculator/',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Which nap is best for work breaks?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Quick naps and power naps are usually the easiest to fit into a workday because they are shorter.',
        },
      },
      {
        '@type': 'Question',
        name: 'Why do I sometimes feel worse after a nap?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'If you wake up during deeper sleep, you may feel groggy for a while. A shorter nap or a different nap length can help.',
        },
      },
      {
        '@type': 'Question',
        name: 'Will napping ruin my sleep at night?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'Naps taken too late in the day can make it harder to fall asleep at night. If this happens, try a shorter nap or nap earlier.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the best time of day to nap?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Many people prefer early afternoon. If you nap late, it may affect nighttime sleep.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does the calculator set an alarm?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. It only suggests a wake-up time. You can set an alarm on your phone or device.',
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
  h1.textContent = 'Nap Time Calculator';
  title.replaceWith(h1);
}

ensureH1Title();

const placeholders = {
  napType: document.querySelector('[data-placeholder="nap-type"]'),
  napMinutes: document.querySelector('[data-placeholder="nap-minutes"]'),
  bufferMinutes: document.querySelector('[data-placeholder="buffer-minutes"]'),
  wakeTime: document.querySelector('[data-placeholder="wake-time"]'),
  startTime: document.querySelector('[data-placeholder="start-time"]'),
};

const napTypeButtons = setupButtonGroup(napTypeGroup, {
  defaultValue: DEFAULT_NAP_TYPE,
  onChange: () => calculate(),
});

const bufferButtons = setupButtonGroup(bufferGroup, {
  defaultValue: String(DEFAULT_BUFFER_MINUTES),
  onChange: () => calculate(),
});

function formatTimeInput(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatTimeDisplay(hours, minutes) {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

function updatePlaceholders({ napType, napMinutes, bufferMinutes, wakeTime, startTime }) {
  if (placeholders.napType) {
    placeholders.napType.textContent = napType;
  }
  if (placeholders.napMinutes) {
    placeholders.napMinutes.textContent = String(napMinutes);
  }
  if (placeholders.bufferMinutes) {
    placeholders.bufferMinutes.textContent = String(bufferMinutes);
  }
  if (placeholders.wakeTime) {
    placeholders.wakeTime.textContent = wakeTime;
  }
  if (placeholders.startTime) {
    placeholders.startTime.textContent = startTime;
  }
}

function clearError() {
  if (errorMessage) {
    errorMessage.textContent = '';
    errorMessage.classList.add('is-hidden');
  }
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

function addResultRow(label, value) {
  if (!resultsList) {
    return;
  }
  const row = document.createElement('div');
  row.className = 'result-row';

  const labelSpan = document.createElement('span');
  labelSpan.textContent = label;

  const valueSpan = document.createElement('span');
  valueSpan.textContent = value;

  row.append(labelSpan, valueSpan);
  resultsList.appendChild(row);
}

function getSelectedNapType() {
  const value = napTypeButtons?.getValue() ?? DEFAULT_NAP_TYPE;
  return getNapType(value);
}

function getSelectedBufferMinutes() {
  const value = Number.parseInt(bufferButtons?.getValue() ?? '', 10);
  if (BUFFER_OPTIONS.includes(value)) {
    return value;
  }
  return DEFAULT_BUFFER_MINUTES;
}

function calculate() {
  const startValue = parseTimeString(startTimeInput?.value ?? '');
  if (!startValue) {
    showError('Please enter a valid start time.');
    return;
  }

  const napType = getSelectedNapType();
  const bufferMinutes = getSelectedBufferMinutes();
  const wakeTime = calculateWakeTime(startValue, napType.minutes, bufferMinutes);
  if (!wakeTime) {
    showError('Please enter a valid start time.');
    return;
  }
  const wakeTimeLabel = formatTimeDisplay(wakeTime.hours, wakeTime.minutes);
  const startTimeLabel = formatTimeDisplay(startValue.hours, startValue.minutes);

  clearError();
  if (resultsList) {
    resultsList.innerHTML = '';
  }
  addResultRow('Recommended wake-up time', wakeTimeLabel);
  addResultRow('Nap length (excluding buffer)', `${napType.minutes} minutes`);
  addResultRow('Buffer applied', `${bufferMinutes} minutes`);

  updatePlaceholders({
    napType: napType.label,
    napMinutes: napType.minutes,
    bufferMinutes,
    wakeTime: wakeTimeLabel,
    startTime: startTimeLabel,
  });

  placeholder?.classList.add('is-hidden');
  resultsList?.classList.remove('is-hidden');
}

function setNowValue() {
  if (!startTimeInput) {
    return;
  }
  const now = new Date();
  now.setSeconds(0, 0);
  startTimeInput.value = formatTimeInput(now);
}

setNowValue();

startTimeInput?.addEventListener('input', () => {
  if (!startTimeInput.value) {
    showPlaceholder();
    return;
  }
  calculate();
});

startTimeInput?.addEventListener('change', () => calculate());

useNowButton?.addEventListener('click', () => {
  setNowValue();
  calculate();
});

calculateButton?.addEventListener('click', () => calculate());

calculate();
