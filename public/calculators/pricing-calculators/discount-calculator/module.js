import { percentOf } from '/assets/js/core/math.js';
import { formatNumber } from '/assets/js/core/format.js';
import { setPageMetadata } from '/assets/js/core/ui.js';

const originalPriceInput = document.querySelector('#discount-original-price');
const discountPercentInput = document.querySelector('#discount-percent');
const calculateButton = document.querySelector('#discount-calc');
const resultOutput = document.querySelector('#discount-result');
const resultDetail = document.querySelector('#discount-result-detail');
const resultContext = document.querySelector('#discount-result-context');
const snapOriginalPrice = document.querySelector('#discount-snap-original-price');
const snapDiscountPercent = document.querySelector('#discount-snap-discount-percent');
const snapDiscountAmount = document.querySelector('#discount-snap-discount-amount');
const snapFinalPrice = document.querySelector('#discount-snap-final-price');

const explanationRoot = document.querySelector('#discount-explanation');
const valueTargets = explanationRoot
  ? {
      originalPrice: explanationRoot.querySelectorAll('[data-discount="original-price"]'),
      discountPercent: explanationRoot.querySelectorAll('[data-discount="discount-percent"]'),
      discountAmount: explanationRoot.querySelectorAll('[data-discount="discount-amount"]'),
      finalPrice: explanationRoot.querySelectorAll('[data-discount="final-price"]'),
      savings: explanationRoot.querySelectorAll('[data-discount="savings"]'),
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
      name: 'What is a discount calculator?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A discount calculator finds the final price after a percentage discount and the amount saved.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you calculate price after X% off?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Multiply the original price by (1 − X/100).',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you calculate the discount amount?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Multiply the original price by X/100.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the discount formula?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The formula is Final = P × (1 − X/100).',
      },
    },
    {
      '@type': 'Question',
      name: 'How much do I save with a discount?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Savings equals the original price minus the final price.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if the discount is 0%?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The final price stays the same as the original price.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can the discount be more than 100%?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Mathematically yes, but it would produce a negative final price.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use decimals like 12.5% off?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, decimal discount percentages work the same way.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is a discount the same as percent off?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, percent off is another way to describe a percentage discount.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is a discount calculator used in real life?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It is used for shopping sales, coupons, promotions, and comparing deals.',
      },
    },
  ],
};

const metadata = {
  title: 'Discount Calculator | Sale Price, Savings & Percent Off',
  description:
    'Calculate sale price, discount amount, and savings from percent-off deals so you can compare coupons, promotions, and marked-down prices.',
  canonical: 'https://calchowmuch.com/pricing-calculators/discount-calculator/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Discount Calculator | Sale Price, Savings & Percent Off',
        url: 'https://calchowmuch.com/pricing-calculators/discount-calculator/',
        description:
          'Calculate sale price, discount amount, and savings from percent-off deals so you can compare coupons, promotions, and marked-down prices.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Discount Calculator',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/pricing-calculators/discount-calculator/',
        description:
          'Free discount calculator for sale price, discount amount, and savings from percent-off deals and promotional pricing.',
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
            name: 'Pricing Calculators',
            item: 'https://calchowmuch.com/pricing-calculators/',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Discount Calculator',
            item: 'https://calchowmuch.com/pricing-calculators/discount-calculator/',
          },
        ],
      },
    ],
  },
};

setPageMetadata(metadata);

function formatCurrency(value) {
  return `$${formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

function updateNode(node, value) {
  if (node) {
    node.textContent = value;
  }
}

function updateExplanation(values) {
  if (!valueTargets) {
    return;
  }
  updateTargets(valueTargets.originalPrice, values.originalPrice);
  updateTargets(valueTargets.discountPercent, values.discountPercent);
  updateTargets(valueTargets.discountAmount, values.discountAmount);
  updateTargets(valueTargets.finalPrice, values.finalPrice);
  updateTargets(valueTargets.savings, values.savings);
}

let hasCalculated = false;
const liveUpdatesEnabled = false;

function calculate() {
  const originalPrice = Number.parseFloat(originalPriceInput?.value ?? '');
  const discountPercent = Number.parseFloat(discountPercentInput?.value ?? '');

  if (!Number.isFinite(originalPrice)) {
    resultOutput.textContent = 'Enter a valid original price.';
    resultDetail.textContent = '';
    updateNode(resultContext, '');
    return;
  }

  if (!Number.isFinite(discountPercent)) {
    resultOutput.textContent = 'Enter a valid discount percent.';
    resultDetail.textContent = '';
    updateNode(resultContext, '');
    return;
  }

  const discountAmount = percentOf(discountPercent, originalPrice);
  const finalPrice = originalPrice - discountAmount;

  let warning = '';
  if (discountPercent > 100) {
    warning = 'Discount over 100% produces a negative final price.';
  }

  resultOutput.textContent = formatCurrency(finalPrice);
  resultDetail.textContent = `You save ${formatCurrency(discountAmount)} on an ${formatCurrency(originalPrice)} item.`;
  updateNode(
    resultContext,
    warning || 'Formula: Final price = P x (1 - X / 100).'
  );

  updateNode(snapOriginalPrice, formatCurrency(originalPrice));
  updateNode(snapDiscountPercent, formatPercent(discountPercent));
  updateNode(snapDiscountAmount, formatCurrency(discountAmount));
  updateNode(snapFinalPrice, formatCurrency(finalPrice));

  updateExplanation({
    originalPrice: formatCurrency(originalPrice),
    discountPercent: formatPercent(discountPercent),
    discountAmount: formatCurrency(discountAmount),
    finalPrice: formatCurrency(finalPrice),
    savings: formatCurrency(discountAmount),
  });

  hasCalculated = true;
}

calculateButton?.addEventListener('click', calculate);

[originalPriceInput, discountPercentInput].forEach((input) => {
  input?.addEventListener('input', () => {
    if (liveUpdatesEnabled && hasCalculated) {
      calculate();
    }
  });
});

calculate();
