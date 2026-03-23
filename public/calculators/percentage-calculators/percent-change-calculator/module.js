import { percentageChange } from '/assets/js/core/math.js';
import { formatNumber } from '/assets/js/core/format.js';
import { setPageMetadata } from '/assets/js/core/ui.js';
import {
  createStaleResultController,
  revealResultPanel,
} from '/calculators/percentage-calculators/shared/cluster-ux.js';

const originalInput = document.querySelector('#pct-change-a');
const newInput = document.querySelector('#pct-change-b');
const calculateButton = document.querySelector('#pct-change-calc');
const answerCard = document.querySelector('#pct-change-answer-card');
const staleNote = document.querySelector('#pct-change-stale-note');
const resultOutput = document.querySelector('#pct-change-result');
const resultDetail = document.querySelector('#pct-change-result-detail');
const resultContext = document.querySelector('#pct-change-result-context');

const snapshotTargets = {
  a: document.querySelector('[data-pct-change-snap="a"]'),
  b: document.querySelector('[data-pct-change-snap="b"]'),
  amount: document.querySelector('[data-pct-change-snap="amount"]'),
  direction: document.querySelector('[data-pct-change-snap="direction"]'),
};

const explanationRoot = document.querySelector('#pct-change-explanation');
const valueTargets = explanationRoot
  ? {
      a: explanationRoot.querySelectorAll('[data-pct-change="a"]'),
      b: explanationRoot.querySelectorAll('[data-pct-change="b"]'),
      amount: explanationRoot.querySelectorAll('[data-pct-change="amount"]'),
      percent: explanationRoot.querySelectorAll('[data-pct-change="percent"]'),
      direction: explanationRoot.querySelectorAll('[data-pct-change="direction"]'),
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
      name: 'What is percent change?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Percent change is the percentage increase or decrease from an original value to a new value.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you calculate percent change from A to B?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Subtract A from B, divide by A, then multiply by 100.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the percent change formula?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The formula is ((B - A) / A) x 100.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why does percent change include a plus or minus sign?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The sign shows whether the change is an increase or a decrease.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does a negative percent change mean?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A negative percent change means the new value is lower than the original value.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can percent change be greater than 100%?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, if the change is larger than the original value, the percent change can exceed 100%.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if the original value is zero?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Percent change is undefined because you cannot divide by zero.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use decimals for A and B?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, percent change works the same for decimal values.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is percent change the same as percentage increase?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, percentage increase only applies when the value goes up, while percent change can be increase or decrease.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is percent change used in real life?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It is used for tracking prices, KPIs, growth rates, and changes over time.',
      },
    },
  ],
};

setPageMetadata({
  title: 'Percent Change Calculator | Increase or Decrease',
  description:
    'Calculate percentage increase or decrease from one value to another with the correct sign and formula.',
  canonical: 'https://calchowmuch.com/percentage-calculators/percent-change-calculator/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Percent Change Calculator | Increase or Decrease',
        url: 'https://calchowmuch.com/percentage-calculators/percent-change-calculator/',
        description:
          'Calculate percentage increase or decrease from one value to another with the correct sign and formula.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Percent Change Calculator',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/percentage-calculators/percent-change-calculator/',
        description:
          'Free percent change calculator for finding percentage increase or decrease from an original value to a new value.',
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
            name: 'Percent Change',
            item: 'https://calchowmuch.com/percentage-calculators/percent-change-calculator/',
          },
        ],
      },
    ],
  },
});

function formatSignedPercent(value) {
  if (Math.abs(value) < 1e-12) {
    return '0%';
  }

  const prefix = value > 0 ? '+' : '-';
  return `${prefix}${formatNumber(Math.abs(value), { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
}

function formatValue(value) {
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
  const a = Number.parseFloat(originalInput?.value ?? '');
  const b = Number.parseFloat(newInput?.value ?? '');

  if (!Number.isFinite(a)) {
    resultOutput.textContent = 'Enter a valid original value (A).';
    resultDetail.textContent = 'Add a valid original value to see the percent change.';
    resultContext.textContent = 'Percent change uses the original value as the baseline.';
    finishCalculation({ reveal, trend: 'warning' });
    return;
  }

  if (!Number.isFinite(b)) {
    resultOutput.textContent = 'Enter a valid new value (B).';
    resultDetail.textContent = 'Add a valid new value to compare it with the original value.';
    resultContext.textContent = 'The answer updates after you calculate again.';
    finishCalculation({ reveal, trend: 'warning' });
    return;
  }

  const percent = percentageChange(a, b);
  if (percent === null) {
    resultOutput.textContent = 'Percent change is undefined when original value (A) is 0.';
    resultDetail.textContent = 'Provide an original value other than 0.';
    resultContext.textContent = 'Use an original value greater than 0 to get a valid answer.';
    finishCalculation({ reveal, trend: 'warning' });
    return;
  }

  const changeAmount = b - a;
  const direction = changeAmount > 0 ? 'Increase' : changeAmount < 0 ? 'Decrease' : 'No change';
  const trend = changeAmount > 0 ? 'increase' : changeAmount < 0 ? 'decrease' : 'neutral';
  const signedPercent = formatSignedPercent(percent);
  const formattedA = formatValue(a);
  const formattedB = formatValue(b);
  const formattedAmount = formatValue(changeAmount);

  resultOutput.textContent = `Percent Change: ${signedPercent}`;
  if (direction === 'No change') {
    resultDetail.textContent = `Change Amount: ${formattedAmount} | Direction: ${direction} | ${formattedB} is unchanged from ${formattedA}.`;
  } else {
    resultDetail.textContent = `Change Amount: ${formattedAmount} | Direction: ${direction} | ${formattedB} is a ${signedPercent} ${direction.toLowerCase()} from ${formattedA}.`;
  }
  resultContext.textContent = 'Formula: ((B - A) / A) x 100.';

  updateSnapshot('a', formattedA);
  updateSnapshot('b', formattedB);
  updateSnapshot('amount', formattedAmount);
  updateSnapshot('direction', direction);

  updateTargets(valueTargets?.a, formattedA);
  updateTargets(valueTargets?.b, formattedB);
  updateTargets(valueTargets?.amount, formattedAmount);
  updateTargets(valueTargets?.percent, signedPercent);
  updateTargets(valueTargets?.direction, direction);

  finishCalculation({ reveal, trend });
}

calculateButton?.addEventListener('click', () => calculate({ reveal: true }));

calculate();
