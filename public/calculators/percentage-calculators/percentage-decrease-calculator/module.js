import { calculatePercentageDecrease } from '/assets/js/core/math.js';
import { formatNumber } from '/assets/js/core/format.js';
import { setPageMetadata } from '/assets/js/core/ui.js';
import {
  createStaleResultController,
  revealResultPanel,
} from '/calculators/percentage-calculators/shared/cluster-ux.js';

const originalInput = document.querySelector('#pctdec-original');
const newInput = document.querySelector('#pctdec-new');
const calculateButton = document.querySelector('#pctdec-calc');
const answerCard = document.querySelector('#pctdec-answer-card');
const staleNote = document.querySelector('#pctdec-stale-note');
const resultOutput = document.querySelector('#pctdec-result');
const resultDetail = document.querySelector('#pctdec-result-detail');
const resultContext = document.querySelector('#pctdec-result-context');

const snapshotTargets = {
  originalValue: document.querySelector('[data-pctdec-snap="original-value"]'),
  newValue: document.querySelector('[data-pctdec-snap="new-value"]'),
  decreaseAmount: document.querySelector('[data-pctdec-snap="decrease-amount"]'),
  direction: document.querySelector('[data-pctdec-snap="direction"]'),
};

const explanationRoot = document.querySelector('#pctdec-explanation');
const valueTargets = explanationRoot
  ? {
      originalValue: explanationRoot.querySelectorAll('[data-pctdec="original-value"]'),
      newValue: explanationRoot.querySelectorAll('[data-pctdec="new-value"]'),
      decreaseAmount: explanationRoot.querySelectorAll('[data-pctdec="decrease-amount"]'),
      percentDecrease: explanationRoot.querySelectorAll('[data-pctdec="percent-decrease"]'),
      direction: explanationRoot.querySelectorAll('[data-pctdec="direction"]'),
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
        text: 'The formula is ((X - Y) / X) x 100.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between decrease amount and percentage decrease?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Decrease amount is X - Y, while percentage decrease compares that change to the original value.',
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
  title: 'Percentage Decrease Calculator | Percentage Drop from Original',
  description:
    'Calculate percentage decrease from an original value to a lower value and see the drop amount, direction, and formula in one step.',
  canonical: 'https://calchowmuch.com/percentage-calculators/percentage-decrease-calculator/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Percentage Decrease Calculator',
        url: 'https://calchowmuch.com/percentage-calculators/percentage-decrease-calculator/',
        description:
          'Calculate how much a value decreased from its original amount using the standard percentage drop formula.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Percentage Decrease Calculator',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/percentage-calculators/percentage-decrease-calculator/',
        description:
          'Free percentage decrease calculator to compare original and new values and show the percentage drop.',
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
            item: 'https://calchowmuch.com/percentage-calculators/percentage-decrease-calculator/',
          },
        ],
      },
    ],
  },
};

setPageMetadata(metadata);

function formatValue(value) {
  return formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatSignedPercent(value) {
  const formatted = formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${formatted}%`;
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

const staleController = createStaleResultController({
  resultPanel: answerCard,
  staleTargets: [staleNote],
  getSignature: () => `${originalInput?.value ?? ''}|${newInput?.value ?? ''}`,
});

staleController.watchElements([originalInput, newInput]);

function finishCalculation({ reveal = false, trend = 'neutral' } = {}) {
  if (answerCard) {
    answerCard.dataset.trend = trend;
  }
  staleController.markFresh();
  if (reveal) {
    revealResultPanel({ resultPanel: answerCard, focusTarget: resultOutput });
  }
}

function calculate({ reveal = false } = {}) {
  const x = Number.parseFloat(originalInput?.value ?? '');
  const y = Number.parseFloat(newInput?.value ?? '');

  if (!Number.isFinite(x)) {
    resultOutput.textContent = 'Enter a valid original value (X).';
    resultDetail.textContent = 'Add a valid original value to measure percentage decrease.';
    resultContext.textContent = 'Percentage decrease uses the original value as the denominator.';
    finishCalculation({ reveal, trend: 'warning' });
    return;
  }

  if (!Number.isFinite(y)) {
    resultOutput.textContent = 'Enter a valid new value (Y).';
    resultDetail.textContent = 'Add a valid new value to compare it with the original amount.';
    resultContext.textContent = 'The answer updates after you calculate again.';
    finishCalculation({ reveal, trend: 'warning' });
    return;
  }

  const result = calculatePercentageDecrease(x, y);

  if (result === null) {
    resultOutput.textContent = 'Percentage decrease is undefined when original value (X) is 0.';
    resultDetail.textContent = 'Provide an original value other than 0.';
    resultContext.textContent = 'Formula: ((X - Y) / X) x 100.';
    updateTargets(valueTargets?.direction, 'Undefined');
    updateSnapshot('direction', 'Undefined');
    finishCalculation({ reveal, trend: 'warning' });
    return;
  }

  const direction = result.percentDecrease > 0 ? 'Decrease' : result.percentDecrease < 0 ? 'Increase' : 'No Change';

  const formattedX = formatValue(result.originalValue);
  const formattedY = formatValue(result.newValue);
  const formattedAmount = formatValue(result.decreaseAmount);
  const formattedPercent = formatSignedPercent(result.percentDecrease);

  resultOutput.textContent = `Percentage Decrease: ${formattedPercent}`;
  resultDetail.textContent = `Decrease Amount: ${formattedAmount} | Direction: ${direction} | ${formattedY} is ${formattedPercent} ${direction === 'Decrease' ? 'below' : 'above'} ${formattedX}.`;
  resultContext.textContent = 'Formula: ((X - Y) / X) x 100.';

  updateSnapshot('originalValue', formattedX);
  updateSnapshot('newValue', formattedY);
  updateSnapshot('decreaseAmount', formattedAmount);
  updateSnapshot('direction', direction);

  updateTargets(valueTargets?.originalValue, formattedX);
  updateTargets(valueTargets?.newValue, formattedY);
  updateTargets(valueTargets?.decreaseAmount, formattedAmount);
  updateTargets(valueTargets?.percentDecrease, formattedPercent);
  updateTargets(valueTargets?.direction, direction);

  hasCalculated = true;
  finishCalculation({ reveal, trend: result.percentDecrease > 0 ? 'decrease' : result.percentDecrease < 0 ? 'increase' : 'neutral' });
}

calculateButton?.addEventListener('click', () => calculate({ reveal: true }));

[originalInput, newInput].forEach((input) => {
  input?.addEventListener('input', () => {
    if (liveUpdatesEnabled && hasCalculated) {
      calculate();
    }
  });
});

calculate();
