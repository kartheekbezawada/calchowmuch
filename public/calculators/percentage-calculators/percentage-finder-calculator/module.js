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
      name: 'What does "X is what percent of Y" mean?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It asks what share of Y is represented by X.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the formula?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use (X / Y) x 100.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I calculate quickly?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Divide part by whole, then multiply by 100.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if Y is zero?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The percentage is undefined because division by zero is not valid.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can the result be above 100%?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. If X is larger than Y, the result will exceed 100%.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use decimals?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Decimal values work the same as whole numbers.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do negatives work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Signs are preserved in the computed percentage.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is 50 out of 200 equal to 25%?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, because (50 / 200) x 100 = 25.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is this used?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Grades, budgets, completion rates, discounts, and comparisons.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why multiply by 100?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Because percent means "per hundred."',
      },
    },
  ],
};

const metadata = {
  title: 'What Percent Is X of Y Calculator | Ratio to Percent',
  description:
    'Find what percent one number is of another using the simple X divided by Y times 100 formula.',
  canonical: 'https://calchowmuch.com/percentage-calculators/percentage-finder-calculator/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'What Percent Is X of Y Calculator | Ratio to Percent',
        url: 'https://calchowmuch.com/percentage-calculators/percentage-finder-calculator/',
        description:
          'Find what percent one number is of another using the simple X divided by Y times 100 formula.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'What Percent Is X of Y Calculator',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/percentage-calculators/percentage-finder-calculator/',
        description:
          'Free calculator for finding what percent one value is of another using a ratio-to-percent formula.',
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
            item: 'https://calchowmuch.com/percentage-calculators/percentage-finder-calculator/',
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
