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

ensureH1Title();

const modeButtons = setupButtonGroup(modeGroup, {
  defaultValue: 'wake',
  onChange: () => {
    if (!resultsList?.classList.contains('is-hidden')) {
      showPlaceholder();
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
  input?.addEventListener('change', () => {
    if (!resultsList?.classList.contains('is-hidden')) {
      showPlaceholder();
    }
  });
});

showPlaceholder();
