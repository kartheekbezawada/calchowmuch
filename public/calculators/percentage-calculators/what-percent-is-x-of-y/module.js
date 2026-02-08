import { calculateWhatPercentIsXOfY } from '/assets/js/core/math.js';
import { formatNumber } from '/assets/js/core/format.js';
import { setPageMetadata } from '/assets/js/core/ui.js';

const partInput = document.querySelector('#wpxy-part');
const wholeInput = document.querySelector('#wpxy-whole');
const calculateButton = document.querySelector('#wpxy-calc');
const resultOutput = document.querySelector('#wpxy-result');
const resultDetail = document.querySelector('#wpxy-result-detail');

const explanationRoot = document.querySelector('#wpxy-explanation');
const valueTargets = explanationRoot
  ? {
      part: explanationRoot.querySelectorAll('[data-wpxy="part"]'),
      whole: explanationRoot.querySelectorAll('[data-wpxy="whole"]'),
      percent: explanationRoot.querySelectorAll('[data-wpxy="percent"]'),
    }
  : null;

export const pageSchema = {
  calculatorFAQ: true,
  globalFAQ: false,
};

const CALCULATOR_FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What does \u201cX is what percent of Y\u201d mean?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It means finding the percentage that X represents out of Y.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you calculate what percent X is of Y?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Divide X by Y and multiply by 100.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the formula for \u201cX is what % of Y\u201d?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The formula is (X \u00f7 Y) \u00d7 100.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if Y is zero?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The result is undefined because division by zero is not possible.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can the result be greater than 100%?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, if X is greater than Y, the percentage will be greater than 100%.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can X or Y be negative?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, negative values are supported, and the sign affects the percentage.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use decimal numbers for X and Y?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, decimals work the same way as whole numbers.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is 50 out of 200 equal to 25%?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, because (50 \u00f7 200) \u00d7 100 = 25%.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is this used in real life?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It is used for grades, progress tracking, budgeting categories, and comparing values.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why do we multiply by 100?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Because percent means \u201cper 100,\u201d so multiplying by 100 converts a ratio into a percentage.',
      },
    },
  ],
};

const metadata = {
  title: 'What Percent Is X of Y Calculator \u2013 CalcHowMuch',
  description:
    'Find what percent X is of Y instantly. Use our free "X is what % of Y" calculator with a simple ratio-to-percent formula.',
  canonical: 'https://calchowmuch.com/percentage-calculators/what-percent-is-x-of-y/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'What Percent Is X of Y Calculator',
        url: 'https://calchowmuch.com/percentage-calculators/what-percent-is-x-of-y/',
        description:
          'Find what percent X is of Y instantly using our free "X is what % of Y" calculator.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'What Percent Is X of Y Calculator',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/percentage-calculators/what-percent-is-x-of-y/',
        description:
          'Free calculator to find what percent X is of Y using a simple ratio-to-percent formula.',
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
            name: 'Percentage Calculators',
            item: 'https://calchowmuch.com/percentage-calculators/',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'What Percent Is X of Y',
            item: 'https://calchowmuch.com/percentage-calculators/what-percent-is-x-of-y/',
          },
        ],
      },
    ],
  },
};

setPageMetadata(metadata);

function fmt(value) {
  return formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function updateTargets(nodes, value) {
  if (!nodes) {
    return;
  }
  nodes.forEach((node) => {
    node.textContent = value;
  });
}

let hasCalculated = false;
const liveUpdatesEnabled = false;

function calculate() {
  const x = Number.parseFloat(partInput?.value ?? '');
  const y = Number.parseFloat(wholeInput?.value ?? '');

  if (!Number.isFinite(x)) {
    resultOutput.textContent = 'Enter a valid part value (X).';
    resultDetail.textContent = '';
    return;
  }

  if (!Number.isFinite(y)) {
    resultOutput.textContent = 'Enter a valid whole value (Y).';
    resultDetail.textContent = '';
    return;
  }

  const result = calculateWhatPercentIsXOfY(x, y);

  if (result === null) {
    resultOutput.textContent = 'Result is undefined when the whole (Y) is zero.';
    resultDetail.textContent = '';
    return;
  }

  resultOutput.textContent = `Result: ${fmt(result.percent)}%`;
  resultDetail.textContent = `Formula: (${fmt(result.part)} \u00f7 ${fmt(result.whole)}) \u00d7 100 = ${fmt(result.percent)}%. That means ${fmt(result.part)} is ${fmt(result.percent)}% of ${fmt(result.whole)}.`;

  updateTargets(valueTargets?.part, fmt(result.part));
  updateTargets(valueTargets?.whole, fmt(result.whole));
  updateTargets(valueTargets?.percent, `${fmt(result.percent)}%`);

  hasCalculated = true;
}

calculateButton?.addEventListener('click', calculate);

[partInput, wholeInput].forEach((input) => {
  input?.addEventListener('input', () => {
    if (liveUpdatesEnabled && hasCalculated) {
      calculate();
    }
  });
});

calculate();
