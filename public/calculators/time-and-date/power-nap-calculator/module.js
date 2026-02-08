import { setPageMetadata } from '/assets/js/core/ui.js';
import { parseTimeString, calculateWakeTime } from '/assets/js/core/nap-utils.js';

const startTimeInput = document.querySelector('#power-nap-start-time');
const useNowButton = document.querySelector('#power-nap-use-now');
const calculateButton = document.querySelector('#power-nap-calculate');
const resultsList = document.querySelector('#power-nap-results-list');
const placeholder = document.querySelector('#power-nap-placeholder');
const errorMessage = document.querySelector('#power-nap-error');
const warningBox = document.querySelector('#power-nap-warning');

export const pageSchema = {
  calculatorFAQ: true,
  globalFAQ: false,
};

const NAP_DURATIONS = [
  { label: 'Micro Nap', minutes: 10, recommended: false },
  { label: 'Power Nap', minutes: 20, recommended: true },
  { label: 'Power Nap', minutes: 30, recommended: true },
  { label: 'Recovery Nap', minutes: 60, recommended: false },
  { label: 'Full Cycle', minutes: 90, recommended: false },
];

const CALCULATOR_FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is the ideal power nap length?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most sleep researchers suggest 20 to 30 minutes. This range helps you wake up alert without entering deep sleep.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why do I feel groggy after a long nap?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Naps longer than 30 minutes can push you into deep sleep. Waking during deep sleep causes sleep inertia, a temporary feeling of grogginess.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can a 10-minute nap really help?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Even a short micro nap can reduce sleepiness and improve alertness for a brief period.',
      },
    },
    {
      '@type': 'Question',
      name: 'When is the best time to take a power nap?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Early afternoon, typically between 1:00 PM and 3:00 PM, is ideal. Napping later may make it harder to fall asleep at night.',
      },
    },
    {
      '@type': 'Question',
      name: 'Will napping affect my nighttime sleep?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Short naps taken early in the afternoon usually do not. Long naps or naps taken in the evening are more likely to interfere with nighttime sleep.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between a power nap and a full sleep cycle?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A power nap lasts 20 to 30 minutes and stays in light sleep. A full sleep cycle lasts about 90 minutes and includes all sleep stages, from light to deep to REM.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does this calculator set an alarm?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It only suggests wake-up times. You can set an alarm on your phone or device based on the result.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why does the calculator warn about evening naps?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Napping after 6:00 PM, especially for longer durations, can delay your bedtime and reduce overall sleep quality at night.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is a 60-minute nap better than a 30-minute nap?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Not always. A 60-minute nap includes deep sleep, which is restorative but may cause grogginess upon waking. A 30-minute nap avoids that risk.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use this calculator for shift work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Enter your nap start time regardless of the hour. The calculator handles time rollover past midnight and works for any schedule.',
      },
    },
  ],
};

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      name: 'Power Nap Calculator',
      url: 'https://calchowmuch.com/time-and-date/power-nap-calculator/',
      description:
        'Find the best wake-up time for power naps of 10, 20, 30, 60, or 90 minutes.',
      inLanguage: 'en',
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Power Nap Calculator',
      applicationCategory: 'HealthApplication',
      operatingSystem: 'Web',
      url: 'https://calchowmuch.com/time-and-date/power-nap-calculator/',
      description:
        'Free power nap calculator to find ideal wake-up times for micro naps, power naps, recovery naps, and full sleep cycles.',
      browserRequirements: 'Requires JavaScript enabled',
      softwareVersion: '1.0',
      creator: {
        '@type': 'Organization',
        name: 'CalcHowMuch',
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://calchowmuch.com/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Time & Date',
          item: 'https://calchowmuch.com/time-and-date/',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Power Nap Calculator',
          item: 'https://calchowmuch.com/time-and-date/power-nap-calculator/',
        },
      ],
    },
  ],
};

const metadata = {
  title: 'Power Nap Calculator – Best Nap Length and Wake-Up Time',
  description:
    'Calculate the best wake-up time for power naps. See options for 10, 20, 30, 60, and 90-minute naps with recommended durations.',
  canonical: 'https://calchowmuch.com/time-and-date/power-nap-calculator/',
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
  h1.textContent = 'Power Nap Calculator';
  title.replaceWith(h1);
}

ensureH1Title();

const explanationPlaceholders = {
  startTime: document.querySelector('[data-placeholder="start-time"]'),
  wakeTime20: document.querySelector('[data-placeholder="wake-time-20"]'),
};

function formatTimeInput(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatTimeDisplay(hours, minutes) {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
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
  warningBox?.classList.add('is-hidden');
  if (resultsList) {
    resultsList.innerHTML = '';
  }
}

function showPlaceholder() {
  clearError();
  placeholder?.classList.remove('is-hidden');
  resultsList?.classList.add('is-hidden');
  warningBox?.classList.add('is-hidden');
  if (resultsList) {
    resultsList.innerHTML = '';
  }
}

function addResultRow(label, value, recommended) {
  if (!resultsList) {
    return;
  }
  const row = document.createElement('div');
  row.className = 'result-row';
  if (recommended) {
    row.classList.add('is-recommended');
  }

  const labelSpan = document.createElement('span');
  labelSpan.textContent = label;
  if (recommended) {
    const badge = document.createElement('span');
    badge.className = 'recommend-badge';
    badge.textContent = 'Best';
    labelSpan.appendChild(badge);
  }

  const valueSpan = document.createElement('span');
  valueSpan.textContent = value;

  row.append(labelSpan, valueSpan);
  resultsList.appendChild(row);
}

function isEveningStart(startTime) {
  return startTime.hours >= 18;
}

function calculate() {
  const startValue = parseTimeString(startTimeInput?.value ?? '');
  if (!startValue) {
    showError('Please enter a valid start time.');
    return;
  }

  clearError();
  if (resultsList) {
    resultsList.innerHTML = '';
  }

  for (const nap of NAP_DURATIONS) {
    const wakeTime = calculateWakeTime(startValue, nap.minutes, 0);
    if (!wakeTime) {
      continue;
    }
    const wakeLabel = formatTimeDisplay(wakeTime.hours, wakeTime.minutes);
    const rowLabel = `${nap.label} (${nap.minutes} min)`;
    addResultRow(rowLabel, wakeLabel, nap.recommended);
  }

  const startLabel = formatTimeDisplay(startValue.hours, startValue.minutes);
  if (explanationPlaceholders.startTime) {
    explanationPlaceholders.startTime.textContent = startLabel;
  }
  const wake20 = calculateWakeTime(startValue, 20, 0);
  if (wake20 && explanationPlaceholders.wakeTime20) {
    explanationPlaceholders.wakeTime20.textContent = formatTimeDisplay(
      wake20.hours,
      wake20.minutes
    );
  }

  if (isEveningStart(startValue)) {
    warningBox?.classList.remove('is-hidden');
  } else {
    warningBox?.classList.add('is-hidden');
  }

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

calculateButton?.addEventListener('click', () => calculate());

useNowButton?.addEventListener('click', () => {
  setNowValue();
  if (!resultsList?.classList.contains('is-hidden')) {
    showPlaceholder();
  }
});

startTimeInput?.addEventListener('change', () => {
  if (!resultsList?.classList.contains('is-hidden')) {
    showPlaceholder();
  }
});

showPlaceholder();
