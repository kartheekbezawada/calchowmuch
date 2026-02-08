import {
  calculateMarkupFromCost,
  calculateMarkupFromPrice,
  calculateBasketMarkup,
} from '/assets/js/core/math.js';
import { formatNumber } from '/assets/js/core/format.js';
import { setPageMetadata } from '/assets/js/core/ui.js';

const productModeToggle = document.querySelector('#markup-product-toggle');
const calcModeToggle = document.querySelector('#markup-calc-toggle');
const productSingleLabel = document.querySelector('[data-markup-product-mode-label="single"]');
const productBasketLabel = document.querySelector('[data-markup-product-mode-label="basket"]');
const calcCostPriceLabel = document.querySelector('[data-markup-calc-mode-label="cost-to-price"]');
const calcPriceMarkupLabel = document.querySelector(
  '[data-markup-calc-mode-label="price-to-markup"]'
);

const singleSection = document.querySelector('#markup-single-section');
const singleCtp = document.querySelector('#markup-single-ctp');
const singlePtm = document.querySelector('#markup-single-ptm');
const basketSection = document.querySelector('#markup-basket-section');
const basketRowsContainer = document.querySelector('#markup-basket-rows');
const addRowButton = document.querySelector('#markup-add-row');
const calculateButton = document.querySelector('#markup-calc');
const resultOutput = document.querySelector('#markup-result');
const resultDetail = document.querySelector('#markup-result-detail');

const singleCostInput = document.querySelector('#markup-single-cost');
const singleMarkupInput = document.querySelector('#markup-single-markup');
const singleCost2Input = document.querySelector('#markup-single-cost2');
const singlePriceInput = document.querySelector('#markup-single-price');

const explanationRoot = document.querySelector('#markup-explanation');
const valueTargets = explanationRoot
  ? {
      mode: explanationRoot.querySelectorAll('[data-markup="mode"]'),
      productCount: explanationRoot.querySelectorAll('[data-markup="product-count"]'),
      cost: explanationRoot.querySelectorAll('[data-markup="cost"]'),
      price: explanationRoot.querySelectorAll('[data-markup="price"]'),
      markupAmount: explanationRoot.querySelectorAll('[data-markup="markup-amount"]'),
      markupPercent: explanationRoot.querySelectorAll('[data-markup="markup-percent"]'),
      totalCost: explanationRoot.querySelectorAll('[data-markup="total-cost"]'),
      totalPrice: explanationRoot.querySelectorAll('[data-markup="total-price"]'),
      totalMarkup: explanationRoot.querySelectorAll('[data-markup="total-markup"]'),
      basketMarkupPercent: explanationRoot.querySelectorAll(
        '[data-markup="basket-markup-percent"]'
      ),
      formula: explanationRoot.querySelectorAll('[data-markup="formula"]'),
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
      name: 'What is markup?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Markup is the amount added to cost to get the selling price.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you calculate selling price from cost and markup %?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Multiply the cost by (1 + markup/100).',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you calculate markup % from cost and price?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Divide (price minus cost) by cost and multiply by 100.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is basket markup?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Basket markup is the markup calculated across multiple products using total cost and total price.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you calculate weighted average markup?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Compute (total price minus total cost) divided by total cost, then multiply by 100.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is basket markup the same as averaging the item markups?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, basket markup is weighted by costs (and quantities), so it can differ from a simple average.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can markup be negative?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, if the selling price is lower than the cost, the markup is negative.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if cost is zero?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Markup percent is undefined because you cannot divide by zero.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is markup the same as profit margin?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, markup is based on cost, while margin is based on selling price.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is markup used in real life?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Markup is used in retail pricing, quoting, invoicing, and setting prices for product ranges.',
      },
    },
  ],
};

const metadata = {
  title: 'Markup Calculator – CalcHowMuch',
  description:
    'Calculate markup for one or multiple products. Get item markup %, basket markup, and weighted average markup from cost and price.',
  canonical: 'https://calchowmuch.com/percentage-calculators/markup-calculator/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Markup Calculator',
        url: 'https://calchowmuch.com/percentage-calculators/markup-calculator/',
        description:
          'Calculate markup for single products or multiple products, including basket markup and weighted average markup from cost and price.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Markup Calculator',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/percentage-calculators/markup-calculator/',
        description:
          'Free markup calculator for single-item markup and multi-product basket markup, including weighted average markup from cost and price.',
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
            name: 'Markup Calculator',
            item: 'https://calchowmuch.com/percentage-calculators/markup-calculator/',
          },
        ],
      },
    ],
  },
};

setPageMetadata(metadata);

function formatCurrency(value) {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return 'N/A';
  }
  return `$${formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatPercent(value) {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return 'N/A';
  }
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

function setVisibility(element, visible) {
  if (!element) {
    return;
  }
  element.classList.toggle('is-hidden', !visible);
  element.hidden = !visible;
  element.setAttribute('aria-hidden', String(!visible));
}

function getProductMode() {
  return productModeToggle?.checked ? 'basket' : 'single';
}

function getCalcMode() {
  return calcModeToggle?.checked ? 'price-to-markup' : 'cost-to-price';
}

function syncModeUI() {
  const productMode = getProductMode();
  const calcMode = getCalcMode();
  const isCtp = calcMode === 'cost-to-price';

  productSingleLabel?.classList.toggle('is-active', productMode === 'single');
  productBasketLabel?.classList.toggle('is-active', productMode === 'basket');
  calcCostPriceLabel?.classList.toggle('is-active', isCtp);
  calcPriceMarkupLabel?.classList.toggle('is-active', !isCtp);

  setVisibility(singleSection, productMode === 'single');
  setVisibility(basketSection, productMode === 'basket');
  setVisibility(singleCtp, isCtp);
  setVisibility(singlePtm, !isCtp);

  if (productMode === 'basket') {
    ensureBasketRows();
  }
  updateBasketRowVisibility();
}

function renderBasketRow({ name = '', quantity = '1', cost = '', price = '', markupPercent = '' }) {
  const row = document.createElement('div');
  row.className = 'input-row markup-basket-row';

  const calcMode = getCalcMode();
  const isCtp = calcMode === 'cost-to-price';

  row.innerHTML = `
    <div class="markup-row-field markup-row-name-field">
      <label>Name</label>
      <input type="text" class="markup-row-name" value="${name}" placeholder="Optional" />
    </div>
    <div class="markup-row-field markup-row-qty-field">
      <label>Qty</label>
      <input type="number" class="markup-row-qty" value="${quantity}" min="0" step="1" />
    </div>
    <div class="markup-row-field markup-row-cost-field">
      <label>Cost</label>
      <input type="number" class="markup-row-cost" value="${cost}" min="0" step="0.01" />
    </div>
    <div class="markup-row-field markup-row-price-wrap" ${isCtp ? 'hidden' : ''}>
      <label>Price</label>
      <input type="number" class="markup-row-price" value="${price}" min="0" step="0.01" />
    </div>
    <div class="markup-row-field markup-row-markup-wrap" ${isCtp ? '' : 'hidden'}>
      <label>Markup %</label>
      <input type="number" class="markup-row-markup" value="${markupPercent}" min="0" step="0.01" />
    </div>
    <button type="button" class="calculator-button secondary markup-remove-row">Remove</button>
  `;
  return row;
}

function ensureBasketRows() {
  if (!basketRowsContainer || basketRowsContainer.children.length > 0) {
    return;
  }
  basketRowsContainer.appendChild(
    renderBasketRow({ cost: '50', markupPercent: '40', price: '70' })
  );
  basketRowsContainer.appendChild(
    renderBasketRow({ cost: '30', markupPercent: '60', price: '48' })
  );
  basketRowsContainer.appendChild(
    renderBasketRow({ cost: '80', markupPercent: '25', price: '100' })
  );
}

function updateBasketRowVisibility() {
  const calcMode = getCalcMode();
  const isCtp = calcMode === 'cost-to-price';
  const rows = basketRowsContainer?.querySelectorAll('.markup-basket-row') ?? [];
  rows.forEach((row) => {
    const priceWrap = row.querySelector('.markup-row-price-wrap');
    const markupWrap = row.querySelector('.markup-row-markup-wrap');
    if (priceWrap) {
      priceWrap.hidden = isCtp;
    }
    if (markupWrap) {
      markupWrap.hidden = !isCtp;
    }
  });
}

let hasCalculated = false;
const liveUpdatesEnabled = false;

function calculateSingle() {
  const calcMode = getCalcMode();

  if (calcMode === 'cost-to-price') {
    const result = calculateMarkupFromCost(singleCostInput?.value, singleMarkupInput?.value);
    if (!result) {
      resultOutput.textContent = 'Enter valid cost and markup percent values.';
      resultDetail.textContent = '';
      return;
    }
    resultOutput.textContent = `Selling Price: ${formatCurrency(result.price)}`;
    resultDetail.textContent = `Markup Amount: ${formatCurrency(result.markupAmount)}. Formula: P = ${formatCurrency(result.cost)} × (1 + ${formatPercent(result.markupPercent).replace('%', '')} / 100) = ${formatCurrency(result.price)}.`;

    updateTargets(valueTargets?.mode, 'Single Product — Cost → Price');
    updateTargets(valueTargets?.productCount, '1');
    updateTargets(valueTargets?.cost, formatCurrency(result.cost));
    updateTargets(valueTargets?.price, formatCurrency(result.price));
    updateTargets(valueTargets?.markupAmount, formatCurrency(result.markupAmount));
    updateTargets(valueTargets?.markupPercent, formatPercent(result.markupPercent));
    updateTargets(valueTargets?.totalCost, formatCurrency(result.cost));
    updateTargets(valueTargets?.totalPrice, formatCurrency(result.price));
    updateTargets(valueTargets?.totalMarkup, formatCurrency(result.markupAmount));
    updateTargets(valueTargets?.basketMarkupPercent, formatPercent(result.markupPercent));
    updateTargets(valueTargets?.formula, 'P = C × (1 + M / 100)');
  } else {
    const result = calculateMarkupFromPrice(singleCost2Input?.value, singlePriceInput?.value);
    if (!result) {
      resultOutput.textContent = 'Enter valid cost and selling price values.';
      resultDetail.textContent = '';
      return;
    }
    const markupText =
      result.markupPercent === null ? 'N/A (cost is zero)' : formatPercent(result.markupPercent);
    const warning = result.cost === 0 ? ' (Markup % undefined when cost is zero)' : '';
    resultOutput.textContent = `Markup: ${markupText}${warning}`;
    resultDetail.textContent = `Markup Amount: ${formatCurrency(result.markupAmount)}. Formula: M = ((${formatCurrency(result.price)} − ${formatCurrency(result.cost)}) ÷ ${formatCurrency(result.cost)}) × 100.`;

    updateTargets(valueTargets?.mode, 'Single Product — Price → Markup %');
    updateTargets(valueTargets?.productCount, '1');
    updateTargets(valueTargets?.cost, formatCurrency(result.cost));
    updateTargets(valueTargets?.price, formatCurrency(result.price));
    updateTargets(valueTargets?.markupAmount, formatCurrency(result.markupAmount));
    updateTargets(valueTargets?.markupPercent, markupText);
    updateTargets(valueTargets?.totalCost, formatCurrency(result.cost));
    updateTargets(valueTargets?.totalPrice, formatCurrency(result.price));
    updateTargets(valueTargets?.totalMarkup, formatCurrency(result.markupAmount));
    updateTargets(valueTargets?.basketMarkupPercent, markupText);
    updateTargets(valueTargets?.formula, 'M = ((P − C) ÷ C) × 100');
  }
  hasCalculated = true;
}

function collectBasketRows() {
  const calcMode = getCalcMode();
  const rowElements = basketRowsContainer?.querySelectorAll('.markup-basket-row') ?? [];
  const rows = [];
  for (const rowEl of rowElements) {
    const name = rowEl.querySelector('.markup-row-name')?.value || '';
    const quantity = rowEl.querySelector('.markup-row-qty')?.value || '1';
    const cost = rowEl.querySelector('.markup-row-cost')?.value || '';
    const price = rowEl.querySelector('.markup-row-price')?.value || '';
    const markupPercent = rowEl.querySelector('.markup-row-markup')?.value || '';
    rows.push({
      name,
      quantity: Number(quantity),
      cost: Number(cost),
      price: Number(price),
      markupPercent: Number(markupPercent),
      mode: calcMode,
    });
  }
  return rows;
}

function calculateBasket() {
  const rows = collectBasketRows();
  if (!rows.length) {
    resultOutput.textContent = 'Add at least one product row.';
    resultDetail.textContent = '';
    return;
  }

  const result = calculateBasketMarkup(rows);
  if (!result) {
    resultOutput.textContent =
      'Check row values. Cost, quantity, and required fields must be valid.';
    resultDetail.textContent = '';
    return;
  }

  const basketPctText =
    result.basketMarkupPercent === null
      ? 'N/A (total cost is zero)'
      : formatPercent(result.basketMarkupPercent);
  const warning =
    result.totalCost === 0 ? ' (Basket markup % undefined when total cost is zero)' : '';
  resultOutput.textContent = `Basket Markup: ${basketPctText}${warning}`;
  resultDetail.textContent = `Total Cost: ${formatCurrency(result.totalCost)} | Total Price: ${formatCurrency(result.totalPrice)} | Total Markup: ${formatCurrency(result.totalMarkup)} | Products: ${result.rows.length}`;

  updateTargets(
    valueTargets?.mode,
    `Basket — ${getCalcMode() === 'cost-to-price' ? 'Cost → Price' : 'Price → Markup %'}`
  );
  updateTargets(valueTargets?.productCount, String(result.rows.length));
  updateTargets(valueTargets?.cost, '—');
  updateTargets(valueTargets?.price, '—');
  updateTargets(valueTargets?.markupAmount, '—');
  updateTargets(valueTargets?.markupPercent, '—');
  updateTargets(valueTargets?.totalCost, formatCurrency(result.totalCost));
  updateTargets(valueTargets?.totalPrice, formatCurrency(result.totalPrice));
  updateTargets(valueTargets?.totalMarkup, formatCurrency(result.totalMarkup));
  updateTargets(valueTargets?.basketMarkupPercent, basketPctText);
  updateTargets(valueTargets?.formula, '(Total Price − Total Cost) ÷ Total Cost × 100');
  hasCalculated = true;
}

function calculate() {
  const productMode = getProductMode();
  if (productMode === 'single') {
    calculateSingle();
  } else {
    calculateBasket();
  }
}

syncModeUI();

productModeToggle?.addEventListener('change', () => {
  syncModeUI();
  if (liveUpdatesEnabled && hasCalculated) {
    calculate();
  }
});

calcModeToggle?.addEventListener('change', () => {
  syncModeUI();
  if (liveUpdatesEnabled && hasCalculated) {
    calculate();
  }
});

addRowButton?.addEventListener('click', () => {
  basketRowsContainer?.appendChild(renderBasketRow({ cost: '', markupPercent: '', price: '' }));
});

basketRowsContainer?.addEventListener('click', (event) => {
  const button = event.target.closest('.markup-remove-row');
  if (!button) {
    return;
  }
  const rows = basketRowsContainer.querySelectorAll('.markup-basket-row');
  if (rows.length <= 1) {
    return;
  }
  button.closest('.markup-basket-row')?.remove();
  if (liveUpdatesEnabled && hasCalculated) {
    calculate();
  }
});

basketRowsContainer?.addEventListener('input', () => {
  if (liveUpdatesEnabled && hasCalculated && getProductMode() === 'basket') {
    calculate();
  }
});

[singleCostInput, singleMarkupInput, singleCost2Input, singlePriceInput].forEach((input) => {
  input?.addEventListener('input', () => {
    if (liveUpdatesEnabled && hasCalculated && getProductMode() === 'single') {
      calculate();
    }
  });
});

calculateButton?.addEventListener('click', calculate);

calculate();
