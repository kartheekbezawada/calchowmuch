import { calculateReversePercentage } from '/assets/js/core/math.js';
import { formatNumber } from '/assets/js/core/format.js';
import { setPageMetadata } from '/assets/js/core/ui.js';

const percentInput = document.querySelector('#revpct-percent');
const finalInput = document.querySelector('#revpct-final');
const calculateButton = document.querySelector('#revpct-calc');
const resultOutput = document.querySelector('#revpct-result');
const resultDetail = document.querySelector('#revpct-result-detail');
const snapshotTargets = {
  percentage: document.querySelector('[data-revpct-snap="percentage"]'),
  finalValue: document.querySelector('[data-revpct-snap="final-value"]'),
  original: document.querySelector('[data-revpct-snap="original"]'),
};

const explanationRoot = document.querySelector('#revpct-explanation');
const valueTargets = explanationRoot
  ? {
      percentage: explanationRoot.querySelectorAll('[data-revpct="percentage"]'),
      finalValue: explanationRoot.querySelectorAll('[data-revpct="final-value"]'),
      original: explanationRoot.querySelectorAll('[data-revpct="original"]'),
      check: explanationRoot.querySelectorAll('[data-revpct="check"]'),
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
      name: 'What is reverse percentage?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Reverse percentage finds the original value when a final value is a known percentage of it.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you calculate \u201cY is X% of what number\u201d?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Divide Y by (X \u00f7 100).',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the reverse percentage formula?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The formula is Original = (Y \u00d7 100) \u00f7 X.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I find the original price before discount?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'If the discounted price is Y and it equals X% of the original, the original is (Y \u00d7 100) \u00f7 X.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if the percentage is 0%?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The original value is undefined because division by zero is not possible.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use decimal percentages like 12.5%?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, decimal percentages work the same way.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can the final value be negative?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, negative values are supported mathematically.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I check if the result is correct?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Multiply the original value by X% and confirm it equals Y.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is reverse percentage the same as percent change?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, reverse percentage finds a base value, while percent change compares two values.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is reverse percentage used in real life?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It is used for discounts, taxes, price recovery, and finding totals from percentage-based values.',
      },
    },
  ],
};

const metadata = {
  title: 'Reverse Percentage Calculator – CalcHowMuch',
  description:
    'Find the original value when Y is X% of it. Use our free reverse percentage calculator for original price before discount and more.',
  canonical: 'https://calchowmuch.com/percentage-calculators/reverse-percentage-calculator/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Reverse Percentage Calculator',
        url: 'https://calchowmuch.com/percentage-calculators/reverse-percentage-calculator/',
        description:
          'Find the original value when Y is X% of it using our free reverse percentage calculator.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Reverse Percentage Calculator',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/percentage-calculators/reverse-percentage-calculator/',
        description:
          'Free reverse percentage calculator to find the original value when a final value is a known percent of it.',
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
            name: 'Reverse Percentage',
            item: 'https://calchowmuch.com/percentage-calculators/reverse-percentage-calculator/',
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

function updateSnapshot(key, value) {
  const node = snapshotTargets[key];
  if (node) {
    node.textContent = value;
  }
}

let hasCalculated = false;
const liveUpdatesEnabled = false;

function calculate() {
  const x = Number.parseFloat(percentInput?.value ?? '');
  const y = Number.parseFloat(finalInput?.value ?? '');

  if (!Number.isFinite(x)) {
    resultOutput.textContent = 'Enter a valid percentage.';
    resultDetail.textContent = '';
    return;
  }

  if (!Number.isFinite(y)) {
    resultOutput.textContent = 'Enter a valid final value.';
    resultDetail.textContent = '';
    return;
  }

  const result = calculateReversePercentage(x, y);

  if (result === null) {
    resultOutput.textContent = 'Original value is undefined when the percentage is zero.';
    resultDetail.textContent = 'Use any percentage except 0 to compute a valid original value.';
    return;
  }

  resultOutput.textContent = `Original Value: ${fmt(result.original)}`;
  resultDetail.innerHTML = `<ul class="revpct-detail-list"><li>Question solved: ${fmt(result.finalValue)} is ${fmt(result.percentage)}% of ${fmt(result.original)}.</li><li>Formula: Original = (${fmt(result.finalValue)} × 100) ÷ ${fmt(result.percentage)} = ${fmt(result.original)}.</li><li>Check: ${fmt(result.percentage)}% of ${fmt(result.original)} = ${fmt(result.finalValue)}.</li></ul>`;

  updateSnapshot('percentage', `${fmt(result.percentage)}%`);
  updateSnapshot('finalValue', fmt(result.finalValue));
  updateSnapshot('original', fmt(result.original));

  updateTargets(valueTargets?.percentage, `${fmt(result.percentage)}%`);
  updateTargets(valueTargets?.finalValue, fmt(result.finalValue));
  updateTargets(valueTargets?.original, fmt(result.original));
  updateTargets(
    valueTargets?.check,
    `${fmt(result.percentage)}% of ${fmt(result.original)} = ${fmt(result.finalValue)}`
  );

  hasCalculated = true;
}

calculateButton?.addEventListener('click', calculate);

[percentInput, finalInput].forEach((input) => {
  input?.addEventListener('input', () => {
    if (liveUpdatesEnabled && hasCalculated) {
      calculate();
    }
  });
});

calculate();
