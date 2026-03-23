import { percentageChange } from '/assets/js/core/math.js';
import { formatNumber } from '/assets/js/core/format.js';
import { setPageMetadata } from '/assets/js/core/ui.js';
import {
  createStaleResultController,
  revealResultPanel,
} from '/calculators/percentage-calculators/shared/cluster-ux.js';

const originalInput = document.querySelector('#pct-inc-x');
const newInput = document.querySelector('#pct-inc-y');
const calculateButton = document.querySelector('#pct-inc-calc');
const answerCard = document.querySelector('#pct-inc-answer-card');
const staleNote = document.querySelector('#pct-inc-stale-note');
const resultOutput = document.querySelector('#pct-inc-result');
const resultDetail = document.querySelector('#pct-inc-result-detail');
const resultContext = document.querySelector('#pct-inc-result-context');

const snapshotTargets = {
  x: document.querySelector('[data-pct-inc-snap="x"]'),
  y: document.querySelector('[data-pct-inc-snap="y"]'),
  amount: document.querySelector('[data-pct-inc-snap="amount"]'),
  direction: document.querySelector('[data-pct-inc-snap="direction"]'),
};

const explanationRoot = document.querySelector('#pct-inc-explanation');
const valueTargets = explanationRoot
  ? {
      x: explanationRoot.querySelectorAll('[data-pct-inc="x"]'),
      y: explanationRoot.querySelectorAll('[data-pct-inc="y"]'),
      amount: explanationRoot.querySelectorAll('[data-pct-inc="amount"]'),
      percent: explanationRoot.querySelectorAll('[data-pct-inc="percent"]'),
      direction: explanationRoot.querySelectorAll('[data-pct-inc="direction"]'),
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
      name: 'What is percentage increase?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Percentage increase is how much a value has grown compared to its original value, expressed as a percentage.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you calculate percentage increase from X to Y?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Subtract X from Y, divide by X, then multiply by 100.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the percentage increase formula?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The formula is ((Y - X) / X) x 100.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between increase amount and percentage increase?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Increase amount is Y - X, while percentage increase compares that change to the original value.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can percentage increase be more than 100%?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, if the increase is larger than the original value, the percentage increase exceeds 100%.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if the original value is zero?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Percentage increase is undefined because you cannot divide by zero.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if the new value is smaller than the original value?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Then the result is not an increase; it will produce a negative percentage, which indicates a decrease.',
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
      name: 'Is percentage increase the same as percent change?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Not always; percent change can be increase or decrease, while percentage increase focuses on growth.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is percentage increase used in real life?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It is used for price rises, salary increases, growth rates, and comparing performance over time.',
      },
    },
  ],
};

const metadata = {
  title: 'Percentage Increase Calculator | Growth from Original',
  description:
    'Calculate how much a value increased from its original amount using the standard percentage growth formula.',
  canonical: 'https://calchowmuch.com/percentage-calculators/percentage-increase-calculator/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Percentage Increase Calculator',
        url: 'https://calchowmuch.com/percentage-calculators/percentage-increase-calculator/',
        description:
          'Calculate how much a value increased from its original amount using the standard percentage growth formula.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Percentage Increase Calculator',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/percentage-calculators/percentage-increase-calculator/',
        description:
          'Free percentage increase calculator to compare original and new values and show the growth percentage.',
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
            name: 'Percentage Increase',
            item: 'https://calchowmuch.com/percentage-calculators/percentage-increase-calculator/',
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
  if (Math.abs(value) < 1e-12) {
    return '0%';
  }

  const prefix = value > 0 ? '+' : '-';
  return `${prefix}${formatNumber(Math.abs(value), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
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
    resultDetail.textContent = 'Add a valid original value to measure percentage growth.';
    resultContext.textContent = 'Percentage increase uses the original value as the denominator.';
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

  const percentIncrease = percentageChange(x, y);
  if (percentIncrease === null) {
    resultOutput.textContent = 'Percentage increase is undefined when original value (X) is 0.';
    resultDetail.textContent = 'Provide an original value other than 0.';
    resultContext.textContent = 'Formula: ((Y - X) / X) x 100.';
    updateTargets(valueTargets?.direction, 'Undefined');
    updateSnapshot('direction', 'Undefined');
    finishCalculation({ reveal, trend: 'warning' });
    return;
  }

  const increaseAmount = y - x;
  const direction = increaseAmount > 0 ? 'Increase' : increaseAmount < 0 ? 'Decrease' : 'No Change';

  const formattedX = formatValue(x);
  const formattedY = formatValue(y);
  const formattedAmount = formatValue(increaseAmount);
  const formattedPercent = formatSignedPercent(percentIncrease);

  resultOutput.textContent = `Percentage Increase: ${formattedPercent}`;
  resultDetail.textContent = `Increase Amount: ${formattedAmount} | Direction: ${direction} | ${formattedY} is a ${formattedPercent} ${direction.toLowerCase()} from ${formattedX}.`;
  resultContext.textContent = 'Formula: ((Y - X) / X) x 100.';

  updateSnapshot('x', formattedX);
  updateSnapshot('y', formattedY);
  updateSnapshot('amount', formattedAmount);
  updateSnapshot('direction', direction);

  updateTargets(valueTargets?.x, formattedX);
  updateTargets(valueTargets?.y, formattedY);
  updateTargets(valueTargets?.amount, formattedAmount);
  updateTargets(valueTargets?.percent, formattedPercent);
  updateTargets(valueTargets?.direction, direction);

  hasCalculated = true;
  finishCalculation({ reveal, trend: percentIncrease > 0 ? 'increase' : percentIncrease < 0 ? 'decrease' : 'neutral' });
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
