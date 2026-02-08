import { calculatePercentageDifference } from '/assets/js/core/math.js';
import { formatNumber } from '/assets/js/core/format.js';
import { setPageMetadata } from '/assets/js/core/ui.js';

const valueAInput = document.querySelector('#pct-diff-a');
const valueBInput = document.querySelector('#pct-diff-b');
const calculateButton = document.querySelector('#pct-diff-calc');
const resultOutput = document.querySelector('#pct-diff-result');
const resultDetail = document.querySelector('#pct-diff-result-detail');

const explanationRoot = document.querySelector('#pct-diff-explanation');
const valueTargets = explanationRoot
  ? {
      a: explanationRoot.querySelectorAll('[data-pct-diff="a"]'),
      b: explanationRoot.querySelectorAll('[data-pct-diff="b"]'),
      absDiff: explanationRoot.querySelectorAll('[data-pct-diff="abs-diff"]'),
      avgBaseline: explanationRoot.querySelectorAll('[data-pct-diff="avg-baseline"]'),
      percentDiff: explanationRoot.querySelectorAll('[data-pct-diff="pct-diff"]'),
      formula: explanationRoot.querySelectorAll('[data-pct-diff="formula"]'),
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
      name: 'What is percentage difference?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Percentage difference compares two values as a percentage of their average, so the result is symmetric.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you calculate percentage difference between A and B?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Take |A - B|, divide by ((|A| + |B|) / 2), then multiply by 100.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the percentage difference formula?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The formula is (|A - B| / ((|A| + |B|) / 2)) x 100.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why is percentage difference symmetric?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Because it uses an absolute difference and divides by the average of the two magnitudes.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is percentage difference always non-negative?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, percentage difference uses an absolute difference, so it is never negative.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can A and B be negative?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, the baseline uses |A| and |B| so negative values are supported.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if both values are zero?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Percentage difference is undefined because the average baseline is 0 and division by zero is not possible.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is percentage difference different from percent change?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Percent change uses one value as the original baseline, while percentage difference uses the average of both values.',
      },
    },
    {
      '@type': 'Question',
      name: 'When should you use percentage difference?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use it when neither value should be treated as the original, such as comparing two measurements or prices.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can percentage difference be more than 100%?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, if the two values differ a lot compared to their average, the percentage difference can exceed 100%.',
      },
    },
  ],
};

const metadata = {
  title: 'Percentage Difference Calculator – CalcHowMuch',
  description:
    'Calculate percentage difference between two values using a symmetric formula based on their average. Free percent difference calculator.',
  canonical: 'https://calchowmuch.com/percentage-calculators/percentage-difference/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Percentage Difference Calculator',
        url: 'https://calchowmuch.com/percentage-calculators/percentage-difference/',
        description:
          'Calculate percentage difference between two values using a symmetric formula based on their average.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Percentage Difference Calculator',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/percentage-calculators/percentage-difference/',
        description:
          'Free percentage difference calculator to compute a symmetric percent difference between two values.',
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
            name: 'Percentage Difference',
            item: 'https://calchowmuch.com/percentage-calculators/percentage-difference/',
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

function formatPercent(value) {
  return `${formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
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
  const a = Number.parseFloat(valueAInput?.value ?? '');
  const b = Number.parseFloat(valueBInput?.value ?? '');

  if (!Number.isFinite(a)) {
    resultOutput.textContent = 'Enter a valid value for A.';
    resultDetail.textContent = '';
    return;
  }
  if (!Number.isFinite(b)) {
    resultOutput.textContent = 'Enter a valid value for B.';
    resultDetail.textContent = '';
    return;
  }

  const result = calculatePercentageDifference(a, b);
  if (!result) {
    resultOutput.textContent = 'Percentage difference is undefined when both values are 0.';
    resultDetail.textContent = 'Provide at least one value that is not 0.';
    return;
  }

  const percent = Math.abs(result.percentDifference) < 1e-12 ? 0 : result.percentDifference;

  resultOutput.textContent = `Percentage Difference: ${formatPercent(percent)}`;
  resultDetail.textContent = `Absolute Difference: ${formatValue(result.absoluteDifference)} | Average Baseline: ${formatValue(
    result.averageBaseline
  )} | Formula: ${result.formula}`;

  updateTargets(valueTargets?.a, formatValue(result.valueA));
  updateTargets(valueTargets?.b, formatValue(result.valueB));
  updateTargets(valueTargets?.absDiff, formatValue(result.absoluteDifference));
  updateTargets(valueTargets?.avgBaseline, formatValue(result.averageBaseline));
  updateTargets(valueTargets?.percentDiff, formatPercent(percent));
  updateTargets(valueTargets?.formula, result.formula);

  hasCalculated = true;
}

calculateButton?.addEventListener('click', calculate);

[valueAInput, valueBInput].forEach((input) => {
  input?.addEventListener('input', () => {
    if (liveUpdatesEnabled && hasCalculated) {
      calculate();
    }
  });
});

calculate();
