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
const timePickerButton = document.querySelector('#nap-time-picker');
const calculateButton = document.querySelector('#nap-calculate');
const resultsList = document.querySelector('#nap-results-list');
const errorMessage = document.querySelector('#nap-error');

const proxyInput = document.querySelector('#nap-latency-proxy');
const proxyButton = document.querySelector('#nap-calc');
const proxyResult = document.querySelector('#nap-result');

export const pageSchema = {
  calculatorFAQ: true,
  globalFAQ: false,
};

const CALCULATOR_FAQ_SCHEMA = {
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
        text: 'If you wake up during deeper sleep, you may feel groggy for a while. A shorter nap or a different nap length can help.',
      },
    },
    {
      '@type': 'Question',
      name: 'Will napping ruin my sleep at night?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Naps taken too late in the day can make it harder to fall asleep at night. If this happens, try a shorter nap or nap earlier.',
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
};

const metadata = {
  title: 'Nap Time Calculator | Best Nap Wake-Up Time',
  description:
    'Choose a quick, power, or longer nap and get the best wake-up time from your start time, nap length, and optional wake buffer.',
  canonical: 'https://calchowmuch.com/time-and-date/nap-time-calculator/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Nap Time Calculator | Quick, Power or Afternoon Nap',
        url: 'https://calchowmuch.com/time-and-date/nap-time-calculator/',
        description:
          'Choose a nap type and start time to get a suggested wake-up time with an optional wake buffer.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Nap Time Calculator',
        applicationCategory: 'HealthApplication',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/time-and-date/nap-time-calculator/',
        description: 'Free nap time calculator for quick, power, and longer nap wake-up suggestions.',
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
            name: 'Nap Time Calculator',
            item: 'https://calchowmuch.com/time-and-date/nap-time-calculator/',
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
  onChange: () => {
    clearError();
  },
});

const bufferButtons = setupButtonGroup(bufferGroup, {
  defaultValue: String(DEFAULT_BUFFER_MINUTES),
  onChange: () => {
    clearError();
  },
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

  if (proxyResult) {
    proxyResult.textContent = wakeTimeLabel;
  }
}

function setNowValue() {
  if (!startTimeInput) {
    return;
  }
  const now = new Date();
  now.setSeconds(0, 0);
  startTimeInput.value = formatTimeInput(now);
  if (proxyInput) {
    const minutes = timeValueToMinutes(startTimeInput.value);
    proxyInput.value = String(minutes ?? 0);
  }
}

setNowValue();

startTimeInput?.addEventListener('input', () => {
  if (!startTimeInput.value) {
    showError('Please enter a valid start time.');
    return;
  }
  clearError();
  if (proxyInput) {
    const minutes = timeValueToMinutes(startTimeInput.value);
    if (minutes !== null) {
      proxyInput.value = String(minutes);
    }
  }
});

startTimeInput?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    calculate();
  }
});

timePickerButton?.addEventListener('click', () => {
  if (!startTimeInput) {
    return;
  }
  if (typeof startTimeInput.showPicker === 'function') {
    startTimeInput.showPicker();
    return;
  }
  startTimeInput.focus();
});

proxyInput?.addEventListener('input', () => {
  const next = minutesToTimeValue(proxyInput.value);
  if (next && startTimeInput) {
    startTimeInput.value = next;
  }
});

proxyInput?.addEventListener('change', () => {
  const next = minutesToTimeValue(proxyInput.value);
  if (next && startTimeInput) {
    startTimeInput.value = next;
  }
});

calculateButton?.addEventListener('click', () => calculate());
proxyButton?.addEventListener('click', () => calculate());

calculate();
