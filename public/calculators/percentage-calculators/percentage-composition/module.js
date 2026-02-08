import { calculatePercentageComposition } from '/assets/js/core/math.js';
import { formatNumber } from '/assets/js/core/format.js';
import { setPageMetadata } from '/assets/js/core/ui.js';

const knownModeToggle = document.querySelector('#composition-known-toggle');
const calculatedModeLabel = document.querySelector('[data-composition-mode-label="calculated"]');
const knownModeLabel = document.querySelector('[data-composition-mode-label="known"]');
const knownTotalSection = document.querySelector('#composition-known-total-section');
const knownTotalInput = document.querySelector('#composition-known-total');
const rowsContainer = document.querySelector('#composition-rows');
const addRowButton = document.querySelector('#composition-add-row');
const calculateButton = document.querySelector('#composition-calc');
const resultOutput = document.querySelector('#composition-result');
const resultDetail = document.querySelector('#composition-result-detail');

const explanationRoot = document.querySelector('#composition-explanation');
const valueTargets = explanationRoot
  ? {
      itemsCount: explanationRoot.querySelectorAll('[data-composition="items-count"]'),
      totalUsed: explanationRoot.querySelectorAll('[data-composition="total-used"]'),
      total: explanationRoot.querySelectorAll('[data-composition="total"]'),
      sumItems: explanationRoot.querySelectorAll('[data-composition="sum-items"]'),
      remainderPercent: explanationRoot.querySelectorAll('[data-composition="remainder-percent"]'),
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
      name: 'What is percentage composition?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Percentage composition shows each item's share of a total as a percentage.",
      },
    },
    {
      '@type': 'Question',
      name: 'How do you calculate percent of total for an item?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Divide the item value by the total and multiply by 100.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the share of total formula?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The formula is (Item ÷ Total) × 100.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is remainder percentage?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Remainder percentage is the part of the total not covered by the listed items, expressed as a percent of the total.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you calculate remainder %?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Subtract the sum of items from the total, divide by the total, then multiply by 100.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if the items already add up to the total?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Then the remainder is zero and the remainder percentage is 0%.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if the items exceed the total?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The remainder becomes negative, which indicates the items are larger than the total.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use decimals for item values?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, decimals work the same way for percent of total.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do the percentages always add up to 100%?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'They should add up to 100% when using the same total, but rounding can cause small differences.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is percentage composition used in real life?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It is used for budgets, allocations, category breakdowns, and percent share reporting.',
      },
    },
  ],
};

const metadata = {
  title: 'Percentage Composition Calculator – CalcHowMuch',
  description:
    "Calculate each item's share as a percent of the total. Get a full percentage breakdown and remainder % with our free composition calculator.",
  canonical: 'https://calchowmuch.com/percentage-calculators/percentage-composition/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Percentage Composition Calculator',
        url: 'https://calchowmuch.com/percentage-calculators/percentage-composition/',
        description:
          "Calculate each item's share of total as a percentage and compute remainder percentage using our free percentage composition calculator.",
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Percentage Composition Calculator',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/percentage-calculators/percentage-composition/',
        description:
          'Free percentage composition calculator to compute each item as a percent of total and calculate remainder percentage.',
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
            name: 'Percentage Composition',
            item: 'https://calchowmuch.com/percentage-calculators/percentage-composition/',
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

function setVisibility(element, visible) {
  if (!element) {
    return;
  }
  element.classList.toggle('is-hidden', !visible);
  element.hidden = !visible;
  element.setAttribute('aria-hidden', String(!visible));
}

function getMode() {
  return knownModeToggle?.checked ? 'known' : 'calculated';
}

function syncModeUI() {
  const mode = getMode();
  setVisibility(knownTotalSection, mode === 'known');
  calculatedModeLabel?.classList.toggle('is-active', mode === 'calculated');
  knownModeLabel?.classList.toggle('is-active', mode === 'known');
}

function renderItemRow({ name = '', value = '' } = {}) {
  const row = document.createElement('div');
  row.className = 'input-row composition-item-row';
  row.innerHTML = `
    <div class="composition-row-field">
      <label>Name</label>
      <input type="text" class="composition-row-name" value="${name}" placeholder="Optional" />
    </div>
    <div class="composition-row-field">
      <label>Value</label>
      <input type="number" class="composition-row-value" value="${value}" min="0" step="any" />
    </div>
    <button type="button" class="calculator-button secondary composition-remove-row">Remove</button>
  `;
  return row;
}

function collectItems() {
  const rowElements = rowsContainer?.querySelectorAll('.composition-item-row') ?? [];
  const items = [];
  for (const rowEl of rowElements) {
    const name = rowEl.querySelector('.composition-row-name')?.value || '';
    const value = rowEl.querySelector('.composition-row-value')?.value || '';
    items.push({ name, value: Number(value) });
  }
  return items;
}

let hasCalculated = false;
const liveUpdatesEnabled = false;

function calculate() {
  const items = collectItems();
  if (!items.length) {
    resultOutput.textContent = 'Add at least one item.';
    resultDetail.textContent = '';
    return;
  }

  const mode = getMode();
  const knownTotal = mode === 'known' ? Number.parseFloat(knownTotalInput?.value ?? '') : null;

  if (mode === 'known' && !Number.isFinite(knownTotal)) {
    resultOutput.textContent = 'Enter a valid known total.';
    resultDetail.textContent = '';
    return;
  }

  const result = calculatePercentageComposition(items, knownTotal);

  if (result === null) {
    resultOutput.textContent = 'Total is zero — percentages are undefined.';
    resultDetail.textContent = '';
    return;
  }

  const itemLines = result.items
    .map((item) => `${item.name}: ${fmt(item.value)} (${fmt(item.percent)}%)`)
    .join(' | ');

  let warning = '';
  if (result.useKnownTotal && result.remainingValue < 0) {
    warning = ' (Items exceed total)';
  }

  let remainderLine = '';
  if (result.useKnownTotal) {
    remainderLine = ` | Remainder (Other): ${fmt(result.remainingValue)} (${fmt(result.remainderPercent)}%)`;
  }

  resultOutput.textContent = `Composition: ${itemLines}${remainderLine}${warning}`;
  resultDetail.textContent = `Total: ${fmt(result.total)} | Sum of Items: ${fmt(result.sumItems)} | Formula: (Item ÷ ${fmt(result.total)}) × 100.`;

  updateTargets(valueTargets?.itemsCount, String(result.items.length));
  updateTargets(valueTargets?.totalUsed, result.useKnownTotal ? 'Known total' : 'Sum of items');
  updateTargets(valueTargets?.total, fmt(result.total));
  updateTargets(valueTargets?.sumItems, fmt(result.sumItems));
  updateTargets(
    valueTargets?.remainderPercent,
    result.useKnownTotal ? `${fmt(result.remainderPercent)}%` : 'N/A'
  );

  hasCalculated = true;
}

syncModeUI();

knownModeToggle?.addEventListener('change', () => {
  syncModeUI();
  if (liveUpdatesEnabled && hasCalculated) {
    calculate();
  }
});

addRowButton?.addEventListener('click', () => {
  rowsContainer?.appendChild(renderItemRow());
});

rowsContainer?.addEventListener('click', (event) => {
  const button = event.target.closest('.composition-remove-row');
  if (!button) {
    return;
  }
  const rows = rowsContainer.querySelectorAll('.composition-item-row');
  if (rows.length <= 1) {
    return;
  }
  button.closest('.composition-item-row')?.remove();
  if (liveUpdatesEnabled && hasCalculated) {
    calculate();
  }
});

rowsContainer?.addEventListener('input', () => {
  if (liveUpdatesEnabled && hasCalculated) {
    calculate();
  }
});

knownTotalInput?.addEventListener('input', () => {
  if (liveUpdatesEnabled && hasCalculated) {
    calculate();
  }
});

calculateButton?.addEventListener('click', calculate);

calculate();
