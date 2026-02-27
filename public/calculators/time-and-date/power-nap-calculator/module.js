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
      name: 'What is the best power nap length?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most people do best with 20 to 30 minutes because that range supports alertness while reducing the chance of waking from deeper sleep.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why are 20- and 30-minute options marked as best?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'They are commonly used power-nap targets that balance recovery speed and daytime practicality.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can a 10-minute micro nap still help?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. A short micro nap can reduce sleepiness and provide a quick mental reset when time is limited.',
      },
    },
    {
      '@type': 'Question',
      name: 'When should I avoid a long nap?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Avoid long naps later in the day, especially in the evening, because they can make nighttime sleep harder.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does the evening warning mean?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It flags that long naps started after 6:00 PM may delay bedtime and reduce overnight sleep quality.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does this calculator set an alarm for me?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It gives wake-up targets only. Set an alarm on your phone or device based on your selected result.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use this calculator for shift work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Enter any start time. The calculation handles rollover across midnight and works for non-standard schedules.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is a 60-minute nap better than a 30-minute nap?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Not always. A 60-minute nap can be restorative but may increase grogginess risk after waking. A 30-minute nap is often easier to recover from quickly.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is a full-cycle 90-minute nap for?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A 90-minute option is useful when you are highly sleep-deprived and have enough time for a deeper recovery window.',
      },
    },
    {
      '@type': 'Question',
      name: 'Will napping hurt my nighttime sleep?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Early, short naps usually have less impact. Late or long naps are more likely to interfere with nighttime sleep.',
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
        'Plan wake-up targets for 10, 20, 30, 60, and 90 minute naps with a focus-friendly power nap workflow.',
      inLanguage: 'en',
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Power Nap Calculator',
      applicationCategory: 'HealthApplication',
      operatingSystem: 'Web',
      url: 'https://calchowmuch.com/time-and-date/power-nap-calculator/',
      description:
        'Free power nap calculator that returns wake-up times for micro naps, power naps, recovery naps, and full-cycle naps.',
      browserRequirements: 'Requires JavaScript enabled',
      softwareVersion: '2.0',
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
  title: 'Power Nap Calculator - Best Wake-Up Times for 10 to 90 Minute Naps',
  description:
    'Find wake-up times for 10, 20, 30, 60, and 90 minute naps. Use this power nap calculator to pick a quick reset or deeper recovery window.',
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

    addResultRow(
      `${nap.label} (${nap.minutes} min)`,
      formatTimeDisplay(wakeTime.hours, wakeTime.minutes),
      nap.recommended
    );
  }

  const startLabel = formatTimeDisplay(startValue.hours, startValue.minutes);
  if (explanationPlaceholders.startTime) {
    explanationPlaceholders.startTime.textContent = startLabel;
  }

  const wake20 = calculateWakeTime(startValue, 20, 0);
  if (wake20 && explanationPlaceholders.wakeTime20) {
    explanationPlaceholders.wakeTime20.textContent = formatTimeDisplay(wake20.hours, wake20.minutes);
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
