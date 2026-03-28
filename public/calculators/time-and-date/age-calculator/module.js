import { setPageMetadata } from '../../../assets/js/core/ui.js';
import { buildAgeViewModel } from './engine.js';

const FAQ_ITEMS = [
  {
    question: 'How do I calculate exact age in years, months, and days?',
    answer:
      'Enter a date of birth and an as-of date. The calculator counts full calendar years first, then full months, then the remaining days.',
  },
  {
    question: 'Can I calculate age on a past or future date?',
    answer:
      'Yes. Change the as-of date to any calendar date and the calculator will show age for that exact day.',
  },
  {
    question: 'Does this age calculator handle leap years correctly?',
    answer:
      'Yes. Leap years and real month lengths are handled with calendar-aware logic instead of average month assumptions.',
  },
  {
    question: 'What happens for a February 29 birthday in a non-leap year?',
    answer:
      'For next-birthday guidance, the calculator follows the repo standard and uses February 28 in non-leap years.',
  },
  {
    question: 'Why do total days and calendar age look different?',
    answer:
      'Calendar age is shown as years, months, and days, while total days is one continuous day count from birth to the as-of date.',
  },
  {
    question: 'What does the next birthday section show?',
    answer:
      'It shows how many days remain until the next birthday, the weekday it lands on, and the age you turn on that date.',
  },
  {
    question: 'Can I use this to compare two people by age?',
    answer:
      'Yes. Enter one person as the birth date and the other person as the as-of date to see the age difference in calendar terms.',
  },
  {
    question: 'Does the calculator use hours, minutes, or time zones?',
    answer:
      'No. It is date-based and uses calendar days only, which keeps the result aligned with how age is usually stated.',
  },
  {
    question: 'Is this calculator suitable for official age verification?',
    answer:
      'No. It is useful for planning and reference, but official verification still depends on legal documents.',
  },
  {
    question: 'What if the as-of date is before the birth date?',
    answer:
      'That is the only blocking error. The calculator requires the birth date to be on or before the as-of date.',
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

export const pageSchema = {
  calculatorFAQ: true,
  globalFAQ: false,
};

const metadata = {
  title: 'Age Calculator | Exact Age, Total Days & Next Birthday',
  description:
    'Find exact age in years, months, and days from a birth date or any as-of date. See total days, total weeks, and your next birthday countdown.',
  canonical: 'https://calchowmuch.com/time-and-date/age-calculator/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Age Calculator | Exact Age, Total Days & Next Birthday',
        url: 'https://calchowmuch.com/time-and-date/age-calculator/',
        description:
          'Find exact age in years, months, and days from a birth date or any as-of date. See total days, total weeks, and your next birthday countdown.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Age Calculator',
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/time-and-date/age-calculator/',
        description:
          'Free age calculator to find exact age, total days, total weeks, and the next birthday from a date of birth.',
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
            name: 'Age Calculator',
            item: 'https://calchowmuch.com/time-and-date/age-calculator/',
          },
        ],
      },
    ],
  },
};

setPageMetadata(metadata);

const dobInput = document.querySelector('#age-dob');
const asOfInput = document.querySelector('#age-as-of');
const calculateButton = document.querySelector('#age-calculate');
const useTodayButton = document.querySelector('#age-use-today');
const copyButton = document.querySelector('#age-copy-summary');
const errorMessage = document.querySelector('#age-error');
const headline = document.querySelector('#age-headline');
const summary = document.querySelector('#age-summary');
const totalMonths = document.querySelector('#age-total-months');
const totalWeeks = document.querySelector('#age-total-weeks');
const totalDays = document.querySelector('#age-total-days');
const bornWeekday = document.querySelector('#age-born-weekday');
const bornDetail = document.querySelector('#age-born-detail');
const nextBirthdayHeadline = document.querySelector('#age-next-birthday-headline');
const nextBirthdayDetail = document.querySelector('#age-next-birthday-detail');

let currentViewModel = null;
let copyResetTimer = null;

function ensureH1Title() {
  const title = document.getElementById('calculator-title');
  if (!title || title.tagName === 'H1') {
    return;
  }

  const h1 = document.createElement('h1');
  h1.id = 'calculator-title';
  h1.textContent = 'Age Calculator';
  title.replaceWith(h1);
}

function formatDateValue(date) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseDate(value) {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
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
}

function resetCopyButton() {
  if (!copyButton) {
    return;
  }

  copyButton.textContent = 'Copy summary';
  copyButton.removeAttribute('data-copy-state');
}

function setCopyButtonState(label, state) {
  if (!copyButton) {
    return;
  }

  copyButton.textContent = label;
  copyButton.dataset.copyState = state;

  window.clearTimeout(copyResetTimer);
  copyResetTimer = window.setTimeout(resetCopyButton, 1600);
}

function render(viewModel) {
  if (!viewModel) {
    return;
  }

  currentViewModel = viewModel;
  headline.textContent = viewModel.headline;
  summary.textContent = viewModel.summary;
  totalMonths.textContent = viewModel.totalsFormatted.months;
  totalWeeks.textContent = viewModel.totalsFormatted.weeks;
  totalDays.textContent = viewModel.totalsFormatted.days;
  bornWeekday.textContent = viewModel.bornWeekday;
  bornDetail.textContent = viewModel.birthDateLabel;
  nextBirthdayHeadline.textContent = viewModel.nextBirthday?.headline ?? 'Birthday countdown';
  nextBirthdayDetail.textContent = viewModel.nextBirthday?.detail ?? '';
}

function calculateAndRender() {
  const birthDate = parseDate(dobInput?.value ?? '');
  const asOfDate = parseDate(asOfInput?.value ?? '');

  if (!birthDate) {
    showError('Please enter a valid date of birth.');
    return;
  }

  if (!asOfDate) {
    showError('Please enter a valid as-of date.');
    return;
  }

  if (birthDate > asOfDate) {
    showError('Date of birth must be on or before the as-of date.');
    return;
  }

  const viewModel = buildAgeViewModel({ birthDate, asOfDate });
  if (!viewModel) {
    showError('Unable to calculate age for the selected dates.');
    return;
  }

  clearError();
  render(viewModel);
}

async function copySummaryToClipboard() {
  if (!currentViewModel?.copySummary) {
    return;
  }

  try {
    await navigator.clipboard.writeText(currentViewModel.copySummary);
    setCopyButtonState('Copied', 'success');
    return;
  } catch (_error) {
    const textarea = document.createElement('textarea');
    textarea.value = currentViewModel.copySummary;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();

    const copied = document.execCommand('copy');
    textarea.remove();

    if (copied) {
      setCopyButtonState('Copied', 'success');
      return;
    }
  }

  setCopyButtonState('Copy failed', 'error');
}

ensureH1Title();

const today = new Date();
if (dobInput && !dobInput.value) {
  dobInput.value = '1990-06-15';
}
if (asOfInput && !asOfInput.value) {
  asOfInput.value = formatDateValue(today);
}

calculateButton?.addEventListener('click', calculateAndRender);

useTodayButton?.addEventListener('click', () => {
  if (asOfInput) {
    asOfInput.value = formatDateValue(new Date());
  }
});

copyButton?.addEventListener('click', () => {
  void copySummaryToClipboard();
});

calculateAndRender();
