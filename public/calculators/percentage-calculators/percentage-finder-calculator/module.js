import { calculateWhatPercentIsXOfY } from '/assets/js/core/math.js';
import { formatNumber } from '/assets/js/core/format.js';
import { setPageMetadata } from '/assets/js/core/ui.js';
import {
  createStaleResultController,
  revealResultPanel,
} from '/calculators/percentage-calculators/shared/cluster-ux.js';

const partInput = document.querySelector('#wpxy-part');
const wholeInput = document.querySelector('#wpxy-whole');
const calculateButton = document.querySelector('#wpxy-calc');
const answerCard = document.querySelector('#wpxy-answer-card');
const staleNote = document.querySelector('#wpxy-stale-note');
const resultOutput = document.querySelector('#wpxy-result');
const resultDetail = document.querySelector('#wpxy-result-detail');
const resultContext = document.querySelector('#wpxy-result-context');
const breakdownOutput = document.querySelector('#wpxy-breakdown');
const cardTargets = {
  part: document.querySelector('[data-wpxy-card="part"]'),
  whole: document.querySelector('[data-wpxy-card="whole"]'),
  percent: document.querySelector('[data-wpxy-card="percent"]'),
  formula: document.querySelector('[data-wpxy-card="formula"]'),
};

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
      name: 'What does “X is what percent of Y” actually mean?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It means you want to know what percentage share of the whole, Y, is represented by the part, X. The calculator expresses that relationship as a percent so it is easier to read.',
      },
    },
    {
      '@type': 'Question',
      name: 'What formula does this calculator use?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The formula is (X / Y) x 100. Divide the part by the whole, then multiply by 100 to convert the ratio into a percentage.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I calculate percentage from two numbers quickly?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Put the smaller comparison amount in the part field, put the full total in the whole field, then divide and multiply by 100. The calculator handles that instantly.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if the whole is 0?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The result is undefined because you cannot divide by zero. In that case there is no valid percentage share to report.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can the answer be more than 100%?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. If the part is larger than the whole, the percentage will be greater than 100% because the measured amount exceeds the comparison base.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use decimals in both fields?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Decimal values work the same way as whole numbers, so the calculator can be used for averages, measurements, prices, and rates.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do negative numbers work in this calculator?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The sign is preserved in the result, which can be useful in analytical or accounting scenarios where negative values have meaning.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is 50 out of 200 equal to 25%?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Divide 50 by 200 to get 0.25, then multiply by 100. That gives 25%, so 50 is one quarter of 200.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is this percentage finder useful in real life?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It is commonly used for test scores, budget shares, sales mix, survey results, inventory composition, savings progress, and completion tracking.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why do we multiply by 100?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Because percent means “per hundred.” Multiplying by 100 converts a decimal ratio into a number that shows how many parts out of 100 the part represents.',
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

function fmtRatio(value) {
  return formatNumber(value, { minimumFractionDigits: 0, maximumFractionDigits: 6 });
}

function updateTargets(nodes, value) {
  if (!nodes) {
    return;
  }
  nodes.forEach((node) => {
    node.textContent = value;
  });
}

function updateCardTarget(key, value) {
  const node = cardTargets[key];
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
  getSignature: () => `${partInput?.value ?? ''}|${wholeInput?.value ?? ''}`,
});

staleController.watchElements([partInput, wholeInput]);

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
  const x = Number.parseFloat(partInput?.value ?? '');
  const y = Number.parseFloat(wholeInput?.value ?? '');

  if (!Number.isFinite(x)) {
    resultOutput.textContent = 'Enter a part value';
    resultDetail.textContent = 'Add a valid part value to measure its share of the whole.';
    resultContext.textContent = 'The part is the amount being measured against the total.';
    renderBreakdown([]);
    finishCalculation({ reveal, trend: 'warning' });
    return;
  }

  if (!Number.isFinite(y)) {
    resultOutput.textContent = 'Enter a whole value';
    resultDetail.textContent = 'Add a valid whole value to calculate the percentage share.';
    resultContext.textContent = 'The whole is the denominator used in the ratio.';
    renderBreakdown([]);
    finishCalculation({ reveal, trend: 'warning' });
    return;
  }

  const result = calculateWhatPercentIsXOfY(x, y);

  if (result === null) {
    resultOutput.textContent = 'Undefined at 0';
    resultDetail.textContent = 'The result is undefined when the whole value is zero.';
    resultContext.textContent = 'Division by zero is not valid for ratio-to-percent calculations.';
    renderBreakdown([]);
    finishCalculation({ reveal, trend: 'warning' });
    return;
  }

  const partText = fmt(result.part);
  const wholeText = fmt(result.whole);
  const percentText = `${fmt(result.percent)}%`;
  const ratioText = fmtRatio(result.part / result.whole);

  resultOutput.textContent = percentText;
  resultDetail.textContent = `${partText} is ${percentText} of ${wholeText}.`;
  resultContext.textContent = 'Formula: (X ÷ Y) × 100.';

  updateCardTarget('part', partText);
  updateCardTarget('whole', wholeText);
  updateCardTarget('percent', percentText);
  updateCardTarget('formula', '(X / Y) × 100');

  updateTargets(valueTargets?.part, partText);
  updateTargets(valueTargets?.whole, wholeText);
  updateTargets(valueTargets?.percent, percentText);

  renderBreakdown([
    {
      label: 'Create the ratio',
      copy: 'Divide the part by the whole to see the share before converting to percent.',
      value: `${partText} ÷ ${wholeText} = ${ratioText}`,
    },
    {
      label: 'Convert to percent',
      copy: 'Multiply the ratio by 100 to express it as a percentage.',
      value: `${ratioText} × 100 = ${percentText}`,
    },
    {
      label: 'Read the result',
      copy: 'The part represents this percentage of the whole.',
      value: `${partText} is ${percentText} of ${wholeText}`,
    },
  ]);

  finishCalculation({ reveal });
}

calculateButton?.addEventListener('click', () => calculate({ reveal: true }));

calculate();
