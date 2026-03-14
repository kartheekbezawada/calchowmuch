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

const snapshotTargets = {
  itemsCount: document.querySelector('[data-composition-snap="items-count"]'),
  totalUsed: document.querySelector('[data-composition-snap="total-used"]'),
  total: document.querySelector('[data-composition-snap="total"]'),
  sumItems: document.querySelector('[data-composition-snap="sum-items"]'),
  remainderPercent: document.querySelector('[data-composition-snap="remainder-percent"]'),
};

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
        text: 'The formula is (Item / Total) x 100.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is remainder percentage?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Remainder percentage is the part of total not covered by listed items, expressed as a percentage.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you calculate remainder %?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Subtract sum of items from total, divide by total, then multiply by 100.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if the items already add up to the total?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Then remainder is zero and remainder percentage is 0%.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if the items exceed the total?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The remainder becomes negative, indicating listed items are larger than the total.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use decimals for item values?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, decimals work the same way for percent of total calculations.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do percentages always add up to 100%?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'They should, but rounding can cause very small differences.',
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
  title: 'Percentage Composition Calculator | Share of Total',
  description:
    "Calculate each item's share of a total and the remainder percentage from a known or calculated total.",
  canonical: 'https://calchowmuch.com/percentage-calculators/percentage-composition-calculator/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Percentage Composition Calculator',
        url: 'https://calchowmuch.com/percentage-calculators/percentage-composition-calculator/',
        description:
          "Calculate each item's share of a total and the remainder percentage from a known or calculated total.",
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Percentage Composition Calculator',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/percentage-calculators/percentage-composition-calculator/',
        description:
          'Free percentage composition calculator to break items into percent shares of a total and show any remainder.',
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
            item: 'https://calchowmuch.com/percentage-calculators/percentage-composition-calculator/',
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

function setVisibility(element, visible) {
  if (!element) {
    return;
  }
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

function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderItemRow({ name = '', value = '' } = {}) {
  const row = document.createElement('div');
  row.className = 'input-row composition-item-row';
  row.innerHTML = `
    <div class="composition-row-field">
      <label>Name</label>
      <input type="text" class="composition-row-name" value="${escapeHtml(name)}" placeholder="Optional" />
    </div>
    <div class="composition-row-field">
      <label>Value</label>
      <input type="number" class="composition-row-value" value="${escapeHtml(value)}" min="0" max="1000000000" step="any" inputmode="decimal" />
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
    const valueRaw = rowEl.querySelector('.composition-row-value')?.value || '';
    items.push({ name, value: Number(valueRaw) });
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
    resultOutput.textContent = 'Total is zero - percentages are undefined.';
    resultDetail.textContent = '';
    updateTargets(valueTargets?.remainderPercent, 'N/A');
    updateSnapshot('remainderPercent', 'N/A');
    return;
  }

  const lineItems = result.items
    .map((item) => `${item.name}: ${fmt(item.value)} (${fmt(item.percent)}%)`)
    .join(' | ');

  const remainderText = result.useKnownTotal
    ? ` | Remainder (Other): ${fmt(result.remainingValue)} (${fmt(result.remainderPercent)}%)`
    : '';

  let warning = '';
  if (result.useKnownTotal && result.remainingValue < 0) {
    warning = ' (Items exceed total)';
  }

  resultOutput.textContent = `Composition: ${lineItems}${remainderText}${warning}`;
  resultDetail.textContent = `Total: ${fmt(result.total)} | Sum of Items: ${fmt(result.sumItems)} | Formula: (Item / ${fmt(result.total)}) x 100`;

  const itemsCount = String(result.items.length);
  const totalSource = result.useKnownTotal ? 'Known total' : 'Sum of items';
  const total = fmt(result.total);
  const sumItems = fmt(result.sumItems);
  const remainderPercent = result.useKnownTotal ? `${fmt(result.remainderPercent)}%` : 'N/A';

  updateSnapshot('itemsCount', itemsCount);
  updateSnapshot('totalUsed', totalSource);
  updateSnapshot('total', total);
  updateSnapshot('sumItems', sumItems);
  updateSnapshot('remainderPercent', remainderPercent);

  updateTargets(valueTargets?.itemsCount, itemsCount);
  updateTargets(valueTargets?.totalUsed, totalSource);
  updateTargets(valueTargets?.total, total);
  updateTargets(valueTargets?.sumItems, sumItems);
  updateTargets(valueTargets?.remainderPercent, remainderPercent);

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
