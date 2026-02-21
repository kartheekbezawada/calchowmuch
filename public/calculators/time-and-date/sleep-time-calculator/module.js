import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import {
  calculateSleepRecommendations,
  roundToNextQuarterHour,
  SLEEP_CYCLES,
  CYCLE_MINUTES,
} from '/assets/js/core/sleep-utils.js';

const modeGroup = document.querySelector('[data-button-group="sleep-mode"]');
const fieldLabel = document.querySelector('#sleep-field-label');
const primaryTimeInput = document.querySelector('#sleep-time-primary');
const dateTimeInput = document.querySelector('#sleep-datetime');
const dateTimeRow = document.querySelector('#sleep-datetime-row');
const advancedDetails = document.querySelector('.sleep-advanced');
const dateInput = document.querySelector('#sleep-date');
const calculateButton = document.querySelector('#sleep-calculate');
const proxyInput = document.querySelector('#sleep-latency-proxy');
const proxyButton = document.querySelector('#sleep-calc');
const proxyResult = document.querySelector('#sleep-result');
const resultsList = document.querySelector('#sleep-results-list');
const placeholder = document.querySelector('#sleep-placeholder');
const starfield = document.querySelector('#sleep-starfield');

export const pageSchema = {
  calculatorFAQ: true,
  globalFAQ: false,
};

const CALCULATOR_FAQ_SCHEMA = {
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
        text: 'A sleep cycle is a repeating pattern of light sleep, deep sleep, and REM sleep that often lasts about 90 minutes.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is 6 hours of sleep enough?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Six hours is roughly 4 cycles. Some people manage short-term, but many perform better with 7+ hours consistently.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why are multiple sleep times shown?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The calculator shows options for 4, 5, and 6 cycles so you can choose a schedule that fits your day.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why might I still feel tired after following the suggestions?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cycle length varies by person and by night, and factors like stress, caffeine, sleep debt, or sleep disorders can affect how rested you feel.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does this calculator account for time to fall asleep?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. When calculating bedtimes, it adds a 15-minute buffer to allow time to fall asleep before the first sleep cycle begins.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use this calculator if I work night shifts?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Enter your target wake-up or fall-asleep time regardless of the hour. The calculator handles cross-day rollover and works for any schedule.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if I wake up in the middle of a sleep cycle?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Waking during deep sleep can cause sleep inertia, a temporary feeling of grogginess and reduced alertness that may last several minutes.',
      },
    },
    {
      '@type': 'Question',
      name: 'Should I go to bed at the same time every night?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A consistent bedtime helps regulate your body clock and can improve sleep quality over time. The calculator can help you find a schedule to stick to.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is it better to get 4 or 5 sleep cycles?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Five cycles (about 7.5 hours) is generally better for most adults. Four cycles (about 6 hours) may leave you short on rest unless time is limited.',
      },
    },
  ],
};

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      name: 'Sleep Time Calculator',
      url: 'https://calchowmuch.com/time-and-date/sleep-time-calculator/',
      description:
        'Calculate the best time to sleep or wake up based on natural 90-minute sleep cycles.',
      inLanguage: 'en',
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Sleep Time Calculator',
      applicationCategory: 'HealthApplication',
      operatingSystem: 'Web',
      url: 'https://calchowmuch.com/time-and-date/sleep-time-calculator/',
      description:
        'Free sleep time calculator that suggests bedtimes and wake-up times aligned with natural sleep cycles for better rest.',
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
          name: 'Sleep Time Calculator',
          item: 'https://calchowmuch.com/time-and-date/sleep-time-calculator/',
        },
      ],
    },
  ],
};

const metadata = {
  title: 'Sleep Time Calculator – Best Time to Sleep and Wake Up',
  description:
    'Calculate the best time to sleep or wake up based on natural sleep cycles. Simple, fast, and free sleep time calculator.',
  canonical: 'https://calchowmuch.com/time-and-date/sleep-time-calculator/',
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
  h1.textContent = 'Sleep Time Calculator';
  title.replaceWith(h1);
}

function buildStars() {
  if (!starfield || starfield.childElementCount > 0) {
    return;
  }
  // Use deterministic pseudo-random values so visual tests remain stable.
  let seed = 41027;
  const nextRandom = () => {
    seed = (1664525 * seed + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  const starCount = 180;
  for (let i = 0; i < starCount; i += 1) {
    const star = document.createElement('span');
    star.className = 'sleep-star';
    const size = nextRandom() * 2.2 + 0.5;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.top = `${nextRandom() * 100}%`;
    star.style.left = `${nextRandom() * 100}%`;
    star.style.setProperty('--dur', `${(nextRandom() * 4 + 2).toFixed(1)}s`);
    star.style.setProperty('--base-op', `${(nextRandom() * 0.4 + 0.2).toFixed(2)}`);
    star.style.animationDelay = `${(nextRandom() * 5).toFixed(1)}s`;
    starfield.appendChild(star);
  }
}

function formatDateValue(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatDateTimeLocalValue(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${formatDateValue(date)}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatTimeValue(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatTime(date) {
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
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

function supportsDateTimeLocal() {
  if (!dateTimeInput) {
    return false;
  }
  const test = document.createElement('input');
  test.setAttribute('type', 'datetime-local');
  return test.type === 'datetime-local';
}

function parseDateTimeValue(value) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getBaseDateFromPrimaryTime() {
  const timeValue = primaryTimeInput?.value;
  if (!timeValue) {
    return null;
  }
  const [hours, minutes] = timeValue.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  const baseDate = new Date();
  if (advancedDetails?.open && dateInput?.value) {
    const parsedDate = parseDateTimeValue(`${dateInput.value}T00:00`);
    if (parsedDate) {
      baseDate.setFullYear(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate());
    }
  }

  baseDate.setHours(hours, minutes, 0, 0);
  return baseDate;
}

function getSelectedDate() {
  const baseFromTime = getBaseDateFromPrimaryTime();
  if (!baseFromTime) {
    return null;
  }

  if (advancedDetails?.open && hasDateTimeSupport && dateTimeInput?.value) {
    const advancedValue = parseDateTimeValue(dateTimeInput.value);
    if (advancedValue) {
      return advancedValue;
    }
  }

  return baseFromTime;
}

function showPlaceholder() {
  placeholder?.classList.remove('is-hidden');
  if (resultsList) {
    resultsList.innerHTML = '';
  }
  if (proxyResult) {
    proxyResult.textContent = 'No result';
  }
}

function showResults(recommendations) {
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

    const left = document.createElement('div');
    left.className = 'sleep-result-info';

    const cycle = document.createElement('div');
    cycle.className = 'cycle-label';
    cycle.textContent = `${rec.cycles} cycles`;

    const hours = document.createElement('div');
    hours.className = 'sleep-result-hours';
    hours.textContent = `${(rec.cycles * CYCLE_MINUTES) / 60} hours of sleep`;

    left.append(cycle, hours);

    const right = document.createElement('div');
    right.className = 'sleep-result-time';
    right.textContent = formatTime(rec.sleepTime || rec.wakeTime);

    const badge = document.createElement('span');
    badge.className = 'sleep-recommended-badge';
    badge.textContent = 'Best';

    item.append(left, right, badge);
    resultsList.appendChild(item);
  });

  placeholder.classList.add('is-hidden');
  if (proxyResult && recommendations[0]) {
    proxyResult.textContent = formatTime(recommendations[0].sleepTime || recommendations[0].wakeTime);
  }
}

function updateFieldLabel(mode) {
  if (!fieldLabel) {
    return;
  }
  fieldLabel.textContent = mode === 'sleep' ? 'I plan to fall asleep at...' : 'I want to wake up at...';
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

  showResults(recommendations);
}

ensureH1Title();
buildStars();

const modeButtons = setupButtonGroup(modeGroup, {
  defaultValue: 'wake',
  onChange: () => {
    updateFieldLabel(modeButtons?.getValue() ?? 'wake');
  },
});

const defaultDate = roundToNextQuarterHour(new Date());
if (primaryTimeInput) {
  primaryTimeInput.value = formatTimeValue(defaultDate);
}
if (dateInput) {
  dateInput.value = formatDateValue(defaultDate);
}
if (dateTimeInput) {
  dateTimeInput.value = formatDateTimeLocalValue(defaultDate);
}
if (proxyInput) {
  const initialMinutes = timeValueToMinutes(formatTimeValue(defaultDate));
  proxyInput.value = String(initialMinutes ?? 0);
}

const hasDateTimeSupport = supportsDateTimeLocal();
if (!hasDateTimeSupport) {
  dateTimeRow?.classList.add('is-hidden');
  if (dateTimeInput) {
    dateTimeInput.setAttribute('disabled', 'true');
  }
}

calculateButton?.addEventListener('click', calculate);
proxyButton?.addEventListener('click', calculate);
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

[primaryTimeInput, dateInput, dateTimeInput].forEach((input) => {
  input?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      calculate();
    }
  });

  input?.addEventListener('change', () => {
    // Keep current results visible until explicit Calculate action.
    if (input === primaryTimeInput && proxyInput) {
      const minutes = timeValueToMinutes(primaryTimeInput?.value || '');
      if (minutes !== null) {
        proxyInput.value = String(minutes);
      }
    }
  });
});

advancedDetails?.addEventListener('toggle', () => {
  // Keep current results visible until explicit Calculate action.
});

updateFieldLabel('wake');
calculate();
