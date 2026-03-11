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

  resultOutput.textContent = `${fmt(result.part)} is ${fmt(result.percent)}% of ${fmt(result.whole)}.`;
  resultDetail.textContent = `Calculation: (${fmt(result.part)} \u00f7 ${fmt(result.whole)}) \u00d7 100 = ${fmt(result.percent)}%. In other words, the part represents ${fmt(result.percent)}% of the whole.`;

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
