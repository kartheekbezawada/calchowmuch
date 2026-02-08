import { calculatePercentageDecrease } from '/assets/js/core/math.js';
import { formatNumber } from '/assets/js/core/format.js';
import { setPageMetadata } from '/assets/js/core/ui.js';

const originalInput = document.querySelector('#pctdec-original');
const newInput = document.querySelector('#pctdec-new');
const calculateButton = document.querySelector('#pctdec-calc');
const resultOutput = document.querySelector('#pctdec-result');
const resultDetail = document.querySelector('#pctdec-result-detail');

const explanationRoot = document.querySelector('#pctdec-explanation');
const valueTargets = explanationRoot
  ? {
      originalValue: explanationRoot.querySelectorAll('[data-pctdec="original-value"]'),
      newValue: explanationRoot.querySelectorAll('[data-pctdec="new-value"]'),
      decreaseAmount: explanationRoot.querySelectorAll('[data-pctdec="decrease-amount"]'),
      percentDecrease: explanationRoot.querySelectorAll('[data-pctdec="percent-decrease"]'),
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
      name: 'What is percentage decrease?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Percentage decrease is how much a value has dropped compared to its original value, expressed as a percentage.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you calculate percentage decrease from X to Y?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Subtract Y from X, divide by X, then multiply by 100.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the percentage decrease formula?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The formula is ((X − Y) ÷ X) × 100.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between decrease amount and percentage decrease?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Decrease amount is X − Y, while percentage decrease compares that change to the original value.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can percentage decrease be more than 100%?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, if the new value is negative and the original value is positive, the decrease can exceed 100% in magnitude.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if the original value is zero?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Percentage decrease is undefined because you cannot divide by zero.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if the new value is larger than the original value?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Then the result is negative, which indicates an increase rather than a decrease.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use decimals for the original and new values?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, the calculation works the same for decimal values.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is percentage decrease the same as percent change?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Not always; percent change can be increase or decrease, while percentage decrease focuses on declines.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is percentage decrease used in real life?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It is used for discounts, markdowns, cost reductions, and tracking declines over time.',
      },
    },
  ],
};

const metadata = {
  title: 'Percentage Decrease Calculator – CalcHowMuch',
  description:
    'Calculate percentage decrease from an original value to a new value instantly. Use our free percent decrease calculator and formula.',
  canonical: 'https://calchowmuch.com/percentage-calculators/percentage-decrease/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Percentage Decrease Calculator',
        url: 'https://calchowmuch.com/percentage-calculators/percentage-decrease/',
        description:
          'Calculate percentage decrease from an original value to a new value instantly using our free percent decrease calculator.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Percentage Decrease Calculator',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/percentage-calculators/percentage-decrease/',
        description:
          'Free percentage decrease calculator to find the percent decrease from an original value to a new value using a simple formula.',
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
            name: 'Percentage Decrease',
            item: 'https://calchowmuch.com/percentage-calculators/percentage-decrease/',
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

function updateExplanation(values) {
  if (!valueTargets) {
    return;
  }
  updateTargets(valueTargets.originalValue, values.originalValue);
  updateTargets(valueTargets.newValue, values.newValue);
  updateTargets(valueTargets.decreaseAmount, values.decreaseAmount);
  updateTargets(valueTargets.percentDecrease, values.percentDecrease);
}

let hasCalculated = false;
const liveUpdatesEnabled = false;

function calculate() {
  const x = Number.parseFloat(originalInput?.value ?? '');
  const y = Number.parseFloat(newInput?.value ?? '');

  if (!Number.isFinite(x)) {
    resultOutput.textContent = 'Enter a valid original value.';
    resultDetail.textContent = '';
    return;
  }

  if (!Number.isFinite(y)) {
    resultOutput.textContent = 'Enter a valid new value.';
    resultDetail.textContent = '';
    return;
  }

  const result = calculatePercentageDecrease(x, y);

  if (result === null) {
    resultOutput.textContent = 'Percentage decrease is undefined when the original value is zero.';
    resultDetail.textContent = '';
    return;
  }

  let note = '';
  if (result.percentDecrease < 0) {
    note = ' (Negative result indicates an increase, not a decrease)';
  }

  resultOutput.textContent = `Percentage Decrease: ${fmt(result.percentDecrease)}%${note}`;
  resultDetail.textContent = `Decrease Amount: ${fmt(result.decreaseAmount)}. Formula: ((${fmt(result.originalValue)} − ${fmt(result.newValue)}) ÷ ${fmt(result.originalValue)}) × 100 = ${fmt(result.percentDecrease)}%.`;

  updateExplanation({
    originalValue: fmt(result.originalValue),
    newValue: fmt(result.newValue),
    decreaseAmount: fmt(result.decreaseAmount),
    percentDecrease: `${fmt(result.percentDecrease)}%`,
  });

  hasCalculated = true;
}

calculateButton?.addEventListener('click', calculate);

[originalInput, newInput].forEach((input) => {
  input?.addEventListener('input', () => {
    if (liveUpdatesEnabled && hasCalculated) {
      calculate();
    }
  });
});

calculate();
