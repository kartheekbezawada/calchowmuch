import { calculateReversePercentage } from '/assets/js/core/math.js';
import { formatNumber } from '/assets/js/core/format.js';
import { setPageMetadata } from '/assets/js/core/ui.js';
import {
  createStaleResultController,
  revealResultPanel,
} from '/calculators/percentage-calculators/shared/cluster-ux.js';

const percentInput = document.querySelector('#revpct-percent');
const finalInput = document.querySelector('#revpct-final');
const calculateButton = document.querySelector('#revpct-calc');
const answerCard = document.querySelector('#revpct-answer-card');
const staleNote = document.querySelector('#revpct-stale-note');
const resultOutput = document.querySelector('#revpct-result');
const resultDetail = document.querySelector('#revpct-result-detail');
const resultContext = document.querySelector('#revpct-result-context');
const breakdownOutput = document.querySelector('#revpct-breakdown');
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
  title: 'Reverse Percentage Calculator | Find the Original Value',
  description:
    'Find the original number when a known value represents a given percentage of it.',
  canonical: 'https://calchowmuch.com/percentage-calculators/reverse-percentage-calculator/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Reverse Percentage Calculator | Find the Original Value',
        url: 'https://calchowmuch.com/percentage-calculators/reverse-percentage-calculator/',
        description:
          'Find the original number when a known value represents a given percentage of it.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Reverse Percentage Calculator',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/percentage-calculators/reverse-percentage-calculator/',
        description:
          'Free reverse percentage calculator for recovering the original value from a known percentage and final number.',
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

function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderBreakdown(items = []) {
  if (!breakdownOutput) {
    return;
  }

  breakdownOutput.innerHTML = items
    .map(
      (item) => `
        <div class="pct-breakdown-item">
          <div class="pct-breakdown-item-name">
            <strong>${escapeHtml(item.label)}</strong>
            <small>${escapeHtml(item.copy)}</small>
          </div>
          <div class="pct-breakdown-item-value">${escapeHtml(item.value)}</div>
        </div>
      `
    )
    .join('');
}

const staleController = createStaleResultController({
  resultPanel: answerCard,
  staleTargets: [staleNote],
  getSignature: () => `${percentInput?.value ?? ''}|${finalInput?.value ?? ''}`,
});

staleController.watchElements([percentInput, finalInput]);

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
  const x = Number.parseFloat(percentInput?.value ?? '');
  const y = Number.parseFloat(finalInput?.value ?? '');

  if (!Number.isFinite(x)) {
    resultOutput.textContent = 'Enter a percentage';
    resultDetail.textContent = 'Add a valid percentage to recover the original value.';
    resultContext.textContent = 'The reverse percentage answer uses both the percentage and final value.';
    renderBreakdown([]);
    finishCalculation({ reveal, trend: 'warning' });
    return;
  }

  if (!Number.isFinite(y)) {
    resultOutput.textContent = 'Enter a final value';
    resultDetail.textContent = 'Add a valid final value to calculate the base amount.';
    resultContext.textContent = 'The answer appears after both inputs are valid.';
    renderBreakdown([]);
    finishCalculation({ reveal, trend: 'warning' });
    return;
  }

  const result = calculateReversePercentage(x, y);

  if (result === null) {
    resultOutput.textContent = 'Undefined at 0%';
    resultDetail.textContent = 'Use any percentage except 0 to compute a valid original value.';
    resultContext.textContent = 'Division by zero is not valid in reverse percentage calculations.';
    renderBreakdown([]);
    finishCalculation({ reveal, trend: 'warning' });
    return;
  }

  const percentageText = `${fmt(result.percentage)}%`;
  const finalValueText = fmt(result.finalValue);
  const originalText = fmt(result.original);

  resultOutput.textContent = originalText;
  resultDetail.textContent = `${finalValueText} is ${percentageText} of ${originalText}.`;
  resultContext.textContent = `Formula: Original = (${finalValueText} × 100) ÷ ${fmt(result.percentage)}.`;

  updateSnapshot('percentage', percentageText);
  updateSnapshot('finalValue', finalValueText);
  updateSnapshot('original', originalText);

  updateTargets(valueTargets?.percentage, percentageText);
  updateTargets(valueTargets?.finalValue, finalValueText);
  updateTargets(valueTargets?.original, originalText);
  updateTargets(
    valueTargets?.check,
    `${percentageText} of ${originalText} = ${finalValueText}`
  );

  renderBreakdown([
    {
      label: 'Known final value',
      copy: 'The value that already represents a percentage of the base amount.',
      value: finalValueText,
    },
    {
      label: 'Known percentage',
      copy: 'The share of the original amount represented by the final value.',
      value: percentageText,
    },
    {
      label: 'Recovered original',
      copy: 'The base amount before the percentage was applied.',
      value: originalText,
    },
    {
      label: 'Verification',
      copy: 'Multiply the recovered original by the given percentage to confirm the result.',
      value: `${percentageText} of ${originalText} = ${finalValueText}`,
    },
  ]);

  finishCalculation({ reveal });
}

calculateButton?.addEventListener('click', () => calculate({ reveal: true }));

calculate();
