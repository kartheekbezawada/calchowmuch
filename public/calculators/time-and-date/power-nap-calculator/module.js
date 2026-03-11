import { setPageMetadata } from '/assets/js/core/ui.js';
import { parseTimeString, calculateWakeTime } from '/assets/js/core/nap-utils.js';

const startTimeInput = document.querySelector('#power-nap-start-time');
const useNowButton = document.querySelector('#power-nap-use-now');
const calculateButton = document.querySelector('#power-nap-calculate');
const resultsList = document.querySelector('#power-nap-results-list');
const placeholder = document.querySelector('#power-nap-placeholder');
const errorMessage = document.querySelector('#power-nap-error');
const warningBox = document.querySelector('#power-nap-warning');

const NAP_DURATIONS = [
  { label: 'Micro Nap', minutes: 10, recommended: false },
  { label: 'Power Nap', minutes: 20, recommended: true },
  { label: 'Power Nap', minutes: 30, recommended: true },
  { label: 'Recovery Nap', minutes: 60, recommended: false },
  { label: 'Full Cycle', minutes: 90, recommended: false },
];

export const pageSchema = {
  calculatorFAQ: true,
  globalFAQ: false,
};

const FAQ_ITEMS = [
  {
    question: 'What is the best power nap length?',
    answer:
      'Many people do best with 20 to 30 minutes because that range supports alertness while reducing the chance of waking from deeper sleep.',
  },
  {
    question: 'Why are 20- and 30-minute options marked as best?',
    answer:
      'They are commonly used power-nap targets that balance recovery speed and daytime practicality.',
  },
  {
    question: 'Can a 10-minute micro nap still help?',
    answer:
      'Yes. A short micro nap can reduce sleepiness and provide a quick mental reset when time is limited.',
  },
  {
    question: 'When should I avoid a long nap?',
    answer:
      'Avoid long naps later in the day, especially in the evening, because they can make nighttime sleep harder.',
  },
  {
    question: 'What does the evening warning mean?',
    answer:
      'It flags that long naps started after 6:00 PM may delay bedtime and reduce overnight sleep quality.',
  },
  {
    question: 'Does this calculator set an alarm for me?',
    answer:
      'No. It gives wake-up targets only. Set an alarm on your phone or device based on your selected result.',
  },
  {
    question: 'Can I use this calculator for shift work?',
    answer:
      'Yes. Enter any start time. The calculation handles rollover across midnight and works for non-standard schedules.',
  },
  {
    question: 'Is a 60-minute nap better than a 30-minute nap?',
    answer:
      'Not always. A 60-minute nap can be restorative but may increase grogginess risk after waking. A 30-minute nap is often easier to recover from quickly.',
  },
  {
    question: 'What is a full-cycle 90-minute nap for?',
    answer:
      'A 90-minute option is useful when you are highly sleep-deprived and have enough time for a deeper recovery window.',
  },
  {
    question: 'Will napping hurt my nighttime sleep?',
    answer:
      'Early, short naps usually have less impact. Late or long naps are more likely to interfere with nighttime sleep.',
  },
];

const CALCULATOR_FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};

const metadata = {
  title: 'Power Nap Calculator | Best Wake-Up Times',
  description:
    'Compare 10, 20, 30, 60, and 90-minute nap options and get wake-up times for each one.',
  canonical: 'https://calchowmuch.com/time-and-date/power-nap-calculator/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Power Nap Calculator | Best Wake-Up Times',
        url: 'https://calchowmuch.com/time-and-date/power-nap-calculator/',
        description:
          'Compare 10, 20, 30, 60, and 90-minute nap options and get wake-up times for each one.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Power Nap Calculator',
        applicationCategory: 'HealthApplication',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/time-and-date/power-nap-calculator/',
        description:
          'Free power nap calculator for comparing fixed nap lengths and wake-up targets.',
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
            name: 'Power Nap Calculator',
            item: 'https://calchowmuch.com/time-and-date/power-nap-calculator/',
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
