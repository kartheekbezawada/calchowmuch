import { calculateMargin } from '/assets/js/core/math.js';
import { formatNumber } from '/assets/js/core/format.js';
import { setPageMetadata } from '/assets/js/core/ui.js';

const costMarginToggle = document.querySelector('#margin-cost-margin-toggle');
const costPriceModeLabel = document.querySelector('[data-margin-mode-label="cost-price"]');
const costMarginModeLabel = document.querySelector('[data-margin-mode-label="cost-margin"]');
const costInput = document.querySelector('#margin-cost');
const priceInput = document.querySelector('#margin-price');
const marginPercentInput = document.querySelector('#margin-percent');
const modeCostPrice = document.querySelector('#margin-mode-cost-price');
const modeCostMargin = document.querySelector('#margin-mode-cost-margin');
const calculateButton = document.querySelector('#margin-calc');
const resultOutput = document.querySelector('#margin-result');
const resultDetail = document.querySelector('#margin-result-detail');
const resultContext = document.querySelector('#margin-result-context');
const snapMode = document.querySelector('#margin-snap-mode');
const snapCost = document.querySelector('#margin-snap-cost');
const snapPrice = document.querySelector('#margin-snap-price');
const snapProfit = document.querySelector('#margin-snap-profit');

const explanationRoot = document.querySelector('#margin-explanation');
const valueTargets = explanationRoot
  ? {
      mode: explanationRoot.querySelectorAll('[data-margin="mode"]'),
      cost: explanationRoot.querySelectorAll('[data-margin="cost"]'),
      price: explanationRoot.querySelectorAll('[data-margin="price"]'),
      profit: explanationRoot.querySelectorAll('[data-margin="profit"]'),
      marginPercent: explanationRoot.querySelectorAll('[data-margin="margin-percent"]'),
      formula: explanationRoot.querySelectorAll('[data-margin="formula"]'),
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
      name: 'What is gross margin?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Gross margin is profit expressed as a percentage of the selling price.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you calculate gross margin %?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Subtract cost from price, divide by price, then multiply by 100.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the gross margin formula?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The formula is ((P - C) / P) x 100.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you calculate profit?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Profit equals selling price minus cost.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you calculate selling price from cost and margin %?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Divide cost by (1 - margin/100).',
      },
    },
    {
      '@type': 'Question',
      name: 'Is margin the same as markup?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, margin is based on selling price, while markup is based on cost.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can gross margin be negative?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, if the selling price is lower than the cost, profit is negative and margin is negative.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if the selling price is zero?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Gross margin is undefined because you cannot divide by zero.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can margin be 100%?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A 100% margin would require zero cost or an undefined selling price in this formula.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is gross margin used in real life?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It is used for product pricing, profitability analysis, and business planning.',
      },
    },
  ],
};

const metadata = {
  title: 'Margin Calculator | Gross Margin %, Profit & Selling Price',
  description:
    'Calculate gross margin percentage, profit, or target selling price from cost so you can price products and protect profitability.',
  canonical: 'https://calchowmuch.com/pricing-calculators/margin-calculator/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Margin Calculator | Gross Margin %, Profit & Selling Price',
        url: 'https://calchowmuch.com/pricing-calculators/margin-calculator/',
        description:
          'Calculate gross margin percentage, profit, or target selling price from cost so you can price products and protect profitability.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Margin Calculator',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/pricing-calculators/margin-calculator/',
        description:
          'Free gross margin calculator for profit planning, target margin checks, and selling-price decisions from cost.',
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
            name: 'Margin Calculator',
            item: 'https://calchowmuch.com/pricing-calculators/margin-calculator/',
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

function setModeVisibility(mode) {
  const isCostPrice = mode === 'cost-price';
  modeCostPrice.hidden = !isCostPrice;
  modeCostPrice.setAttribute('aria-hidden', String(!isCostPrice));
  modeCostPrice.classList.toggle('is-hidden', !isCostPrice);

  modeCostMargin.hidden = isCostPrice;
  modeCostMargin.setAttribute('aria-hidden', String(isCostPrice));
  modeCostMargin.classList.toggle('is-hidden', isCostPrice);
}

function getMode() {
  return costMarginToggle?.checked ? 'cost-margin' : 'cost-price';
}

function syncModeUI() {
  const mode = getMode();
  setModeVisibility(mode);
  costPriceModeLabel?.classList.toggle('is-active', mode === 'cost-price');
  costMarginModeLabel?.classList.toggle('is-active', mode === 'cost-margin');
}

let hasCalculated = false;
const liveUpdatesEnabled = false;

function calculate() {
  const mode = getMode();
  const cost = Number.parseFloat(costInput?.value ?? '');

  if (!Number.isFinite(cost) || cost < 0) {
    resultOutput.textContent = 'Enter a valid non-negative cost.';
    resultDetail.textContent = '';
    updateNode(resultContext, '');
    return;
  }

  let result;
  let modeLabel;

  if (mode === 'cost-price') {
    const price = Number.parseFloat(priceInput?.value ?? '');
    if (!Number.isFinite(price) || price < 0) {
      resultOutput.textContent = 'Enter a valid non-negative selling price.';
      resultDetail.textContent = '';
      updateNode(resultContext, '');
      return;
    }
    if (price === 0) {
      resultOutput.textContent = 'Gross margin is undefined when selling price is 0.';
      resultDetail.textContent = 'Provide a selling price greater than 0.';
      updateNode(resultContext, '');
      return;
    }
    result = calculateMargin({ mode, cost, price });
    modeLabel = 'Cost + Price -> Margin %';
  } else {
    const marginPercent = Number.parseFloat(marginPercentInput?.value ?? '');
    if (!Number.isFinite(marginPercent) || marginPercent < 0 || marginPercent >= 99.99) {
      resultOutput.textContent = 'Enter a valid gross margin % between 0 and less than 99.99.';
      resultDetail.textContent = '';
      updateNode(resultContext, '');
      return;
    }
    result = calculateMargin({ mode, cost, marginPercent });
    modeLabel = 'Cost + Margin % -> Selling Price';
  }

  if (!result) {
    resultOutput.textContent = 'Unable to calculate with the current inputs.';
    resultDetail.textContent = 'Check the input values and try again.';
    updateNode(resultContext, '');
    return;
  }

  hasCalculated = true;

  resultOutput.textContent = formatPercent(result.marginPercent);
  resultDetail.textContent =
    mode === 'cost-price'
      ? `Selling Price: ${formatCurrency(result.price)} | Profit: ${formatCurrency(result.profit)}`
      : `Selling Price: ${formatCurrency(result.price)} | Profit: ${formatCurrency(result.profit)}`;
  updateNode(resultContext, `Formula: ${result.formula}`);
  updateNode(snapMode, modeLabel);
  updateNode(snapCost, formatCurrency(result.cost));
  updateNode(snapPrice, formatCurrency(result.price));
  updateNode(snapProfit, formatCurrency(result.profit));

  updateTargets(valueTargets?.mode, modeLabel);
  updateTargets(valueTargets?.cost, formatCurrency(result.cost));
  updateTargets(valueTargets?.price, formatCurrency(result.price));
  updateTargets(valueTargets?.profit, formatCurrency(result.profit));
  updateTargets(valueTargets?.marginPercent, formatPercent(result.marginPercent));
  updateTargets(valueTargets?.formula, result.formula);
}

syncModeUI();

costMarginToggle?.addEventListener('change', () => {
  syncModeUI();
  if (liveUpdatesEnabled && hasCalculated) {
    calculate();
  }
});

[costInput, priceInput, marginPercentInput].forEach((input) => {
  input?.addEventListener('input', () => {
    if (liveUpdatesEnabled && hasCalculated) {
      calculate();
    }
  });
});

calculateButton?.addEventListener('click', calculate);

calculate();
