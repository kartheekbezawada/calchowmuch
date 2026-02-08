import { setPageMetadata } from '/assets/js/core/ui.js';
import { calculateBirthdayWeekdays, getWeekdayName } from '/assets/js/core/date-diff-utils.js';

const dobInput = document.querySelector('#birthday-dow-dob');
const yearInput = document.querySelector('#birthday-dow-year');
const calculateButton = document.querySelector('#birthday-dow-calculate');
const resultsList = document.querySelector('#birthday-dow-results-list');
const placeholder = document.querySelector('#birthday-dow-placeholder');
const errorMessage = document.querySelector('#birthday-dow-error');

export const pageSchema = {
  calculatorFAQ: true,
  globalFAQ: false,
};

const CALCULATOR_FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is the result accurate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The day-of-week is calculated using standard calendar rules for the date you enter.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if I was born on February 29?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You were born on the weekday for February 29 in your birth year. For non-leap target years, this calculator uses February 28 for the birthday weekday.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I check future or past years?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Enter any target year from 1600 to 2100.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does this store my birthday?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. This runs in your browser and does not save your inputs.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why does my birthday fall on a different weekday each year?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A common year has 365 days, which is 52 weeks plus 1 day. This shifts your birthday forward by one weekday each year, or two days after a leap year.',
      },
    },
    {
      '@type': 'Question',
      name: 'How far back or forward can this calculator go?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The calculator supports target years from 1600 to 2100, covering the Gregorian calendar era used in most countries.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use this to plan a birthday party?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Enter a future year to see what weekday your birthday falls on, so you can plan around weekends or weekdays.',
      },
    },
    {
      '@type': 'Question',
      name: 'What calendar system does this calculator use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It uses the Gregorian calendar, which is the standard calendar system used in most of the world today.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does the calculator account for historical calendar changes?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. It applies Gregorian calendar rules uniformly. For dates before a country adopted the Gregorian calendar, the result may differ from the historical weekday.',
      },
    },
    {
      '@type': 'Question',
      name: 'How often does my birthday fall on the same weekday?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The pattern repeats in cycles of 5, 6, or 11 years depending on leap year positions. On average, your birthday falls on the same weekday roughly every 5 to 6 years.',
      },
    },
  ],
};

const metadata = {
  title: 'Birthday Day-of-Week Calculator – What Day Were You Born?',
  description:
    'Find the day of the week you were born on, and see what weekday your birthday falls on in any year. Simple, fast, and free.',
  canonical: 'https://calchowmuch.com/time-and-date/birthday-day-of-week/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Birthday Day-of-Week Calculator',
        url: 'https://calchowmuch.com/time-and-date/birthday-day-of-week/',
        description:
          'Find the day of the week you were born on, and see what weekday your birthday falls on in any year.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Birthday Day-of-Week Calculator',
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/time-and-date/birthday-day-of-week/',
        description:
          'Free birthday weekday calculator to find what day of the week you were born and what weekday your birthday falls on in any year.',
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
            name: 'Birthday Day-of-Week Calculator',
            item: 'https://calchowmuch.com/time-and-date/birthday-day-of-week/',
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
  h1.textContent = 'Birthday Day-of-Week Calculator';
  title.replaceWith(h1);
}

ensureH1Title();

const weekdayPlaceholders = {
  dob: document.querySelector('[data-placeholder="dob"]'),
  birthWeekday: document.querySelector('[data-placeholder="birth-weekday"]'),
  targetYear: document.querySelector('[data-placeholder="target-year"]'),
  targetWeekday: document.querySelector('[data-placeholder="target-weekday"]'),
};

function formatDateLabel(date) {
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatWeekday(date) {
  return getWeekdayName(date) ?? '';
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

function updateExplanation(dobLabel, birthWeekday, targetYear, targetWeekday) {
  if (weekdayPlaceholders.dob) {
    weekdayPlaceholders.dob.textContent = dobLabel;
  }
  if (weekdayPlaceholders.birthWeekday) {
    weekdayPlaceholders.birthWeekday.textContent = birthWeekday;
  }
  if (weekdayPlaceholders.targetYear) {
    weekdayPlaceholders.targetYear.textContent = String(targetYear);
  }
  if (weekdayPlaceholders.targetWeekday) {
    weekdayPlaceholders.targetWeekday.textContent = targetWeekday;
  }
}

function parseDate(value) {
  if (!value) {
    return null;
  }
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) {
    return null;
  }
  const candidate = new Date(year, month - 1, day);
  if (
    Number.isNaN(candidate.getTime()) ||
    candidate.getFullYear() !== year ||
    candidate.getMonth() !== month - 1 ||
    candidate.getDate() !== day
  ) {
    return null;
  }
  return candidate;
}

function parseTargetYear(value, fallbackYear) {
  if (!value) {
    return fallbackYear;
  }
  const year = Number.parseInt(value, 10);
  if (!Number.isInteger(year)) {
    return null;
  }
  return year;
}

function showResults({ birthWeekday, targetWeekday, targetYear }) {
  if (!resultsList || !placeholder) {
    return;
  }
  clearError();
  resultsList.innerHTML = '';

  addResultRow('You were born on:', birthWeekday);
  addResultRow(`In ${targetYear}, your birthday falls on:`, targetWeekday);

  placeholder.classList.add('is-hidden');
  resultsList.classList.remove('is-hidden');
}

function calculate() {
  const birthDate = parseDate(dobInput?.value ?? '');
  if (!birthDate) {
    showError('Please enter a valid date of birth.');
    return;
  }

  const currentYear = new Date().getFullYear();
  const targetYear = parseTargetYear(yearInput?.value ?? '', currentYear);
  if (!Number.isInteger(targetYear) || targetYear < 1600 || targetYear > 2100) {
    showError('Enter a year between 1600 and 2100.');
    return;
  }

  const weekdays = calculateBirthdayWeekdays(birthDate, targetYear);
  if (!weekdays) {
    showError('Please enter a valid date and year.');
    return;
  }

  const dobLabel = formatDateLabel(birthDate);
  updateExplanation(dobLabel, weekdays.birthWeekday, targetYear, weekdays.targetWeekday);
  showResults({
    birthWeekday: weekdays.birthWeekday,
    targetWeekday: weekdays.targetWeekday,
    targetYear,
  });
}

const initialYear = new Date().getFullYear();
if (yearInput) {
  yearInput.value = String(initialYear);
}

calculateButton?.addEventListener('click', calculate);
dobInput?.addEventListener('change', () => {
  if (!resultsList?.classList.contains('is-hidden')) {
    calculate();
  }
});
yearInput?.addEventListener('change', () => {
  if (!resultsList?.classList.contains('is-hidden')) {
    calculate();
  }
});

showPlaceholder();
