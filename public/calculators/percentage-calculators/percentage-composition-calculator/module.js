import { calculatePercentageComposition } from '/assets/js/core/math.js';
import { formatNumber } from '/assets/js/core/format.js';
import { setPageMetadata } from '/assets/js/core/ui.js';
import {
  createStaleResultController,
  revealResultPanel,
} from '/calculators/percentage-calculators/shared/cluster-ux.js';

const knownModeToggle = document.querySelector('#composition-known-toggle');
const calculatedModeLabel = document.querySelector('[data-composition-mode-label="calculated"]');
const knownModeLabel = document.querySelector('[data-composition-mode-label="known"]');
const knownTotalSection = document.querySelector('#composition-known-total-section');
const knownTotalInput = document.querySelector('#composition-known-total');
const rowsContainer = document.querySelector('#composition-rows');
const addRowButton = document.querySelector('#composition-add-row');
const calculateButton = document.querySelector('#composition-calc');
const answerCard = document.querySelector('#composition-answer-card');
const staleNote = document.querySelector('#composition-stale-note');
const resultOutput = document.querySelector('#composition-result');
const resultDetail = document.querySelector('#composition-result-detail');
const resultContext = document.querySelector('#composition-result-context');
const breakdownOutput = document.querySelector('#composition-breakdown');
const breakdownSummary = document.querySelector('#composition-breakdown-summary');

const snapshotTargets = {
  itemsCount: document.querySelector('[data-composition-snap="items-count"]'),
  totalUsed: document.querySelector('[data-composition-snap="total-used"]'),
  total: document.querySelector('[data-composition-snap="total"]'),
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

setPageMetadata({
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
});

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
      <input type="number" class="composition-row-value" value="${escapeHtml(value)}" min="0" step="any" />
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

function getSignature() {
  return JSON.stringify({
    mode: getMode(),
    total: knownTotalInput?.value ?? '',
    items: collectItems().map((item) => ({ name: item.name, value: item.value })),
  });
}

const staleController = createStaleResultController({
  resultPanel: answerCard,
  staleTargets: [staleNote],
  getSignature,
});

staleController.watchElements([knownModeToggle, knownTotalInput, rowsContainer]);

function finishCalculation({ reveal = false, trend = 'neutral' } = {}) {
  if (answerCard) {
    answerCard.dataset.trend = trend;
  }
  staleController.markFresh();
  if (reveal) {
    revealResultPanel({ resultPanel: answerCard, focusTarget: resultOutput });
  }
}

function renderBreakdown(items) {
  if (!breakdownOutput) {
    return;
  }

  breakdownOutput.innerHTML = items
    .map(
      (item) => `
        <div class="pct-breakdown-item">
          <div class="pct-breakdown-item-name">
            <strong>${escapeHtml(item.displayName)}</strong>
            <small>${fmt(item.value)} of total</small>
          </div>
          <div class="pct-breakdown-item-value">${fmt(item.percent)}%</div>
        </div>
      `
    )
    .join('');
}

function setLegacyResult(primaryText, lines = []) {
  if (!resultOutput) {
    return;
  }

  if (!lines.length) {
    resultOutput.textContent = primaryText;
    return;
  }

  resultOutput.innerHTML = `
    <span class="pct-answer-primary">${escapeHtml(primaryText)}</span>
    <span class="pct-answer-legacy">${lines
      .map((line) => `<span class="pct-answer-legacy-line">${escapeHtml(line)}</span>`)
      .join('')}</span>
  `;
}

function calculate({ reveal = false } = {}) {
  const items = collectItems();

  if (!items.length) {
    resultOutput.textContent = 'Add items';
    resultDetail.textContent = 'Add at least one item to calculate the composition.';
    resultContext.textContent = 'Each item becomes a share of the total.';
    breakdownOutput.innerHTML = '';
    finishCalculation({ reveal, trend: 'warning' });
    return;
  }

  const mode = getMode();
  const knownTotal = mode === 'known' ? Number.parseFloat(knownTotalInput?.value ?? '') : null;

  if (mode === 'known' && !Number.isFinite(knownTotal)) {
    resultOutput.textContent = 'Enter a total';
    resultDetail.textContent = 'Add a valid known total to calculate each share.';
    resultContext.textContent = 'Known total mode needs a denominator before the answer can appear.';
    breakdownOutput.innerHTML = '';
    finishCalculation({ reveal, trend: 'warning' });
    return;
  }

  const result = calculatePercentageComposition(items, knownTotal);

  if (result === null) {
    resultOutput.textContent = 'undefined';
    resultDetail.textContent = 'Composition percentages are undefined when the total is 0.';
    resultContext.textContent = 'Use values that produce a total greater than 0.';
    breakdownOutput.innerHTML = '';
    updateTargets(valueTargets?.remainderPercent, 'N/A');
    updateSnapshot('remainderPercent', 'N/A');
    finishCalculation({ reveal, trend: 'warning' });
    return;
  }

  const decoratedItems = result.items.map((item, index) => ({
    ...item,
    displayName: item.name?.trim() || `Item ${index + 1}`,
  }));
  const topItem = decoratedItems.reduce(
    (current, item) => (item.percent > current.percent ? item : current),
    decoratedItems[0]
  );
  const totalSource = result.useKnownTotal ? 'Known total' : 'Sum of items';
  const itemsCount = String(decoratedItems.length);
  const totalText = fmt(result.total);
  const sumItemsText = fmt(result.sumItems);
  const remainderPercentText = result.useKnownTotal ? `${fmt(result.remainderPercent)}%` : 'N/A';
  const legacyLines = decoratedItems.map(
    (item) => `${item.displayName}: ${fmt(item.value)} (${fmt(item.percent)}%)`
  );

  if (result.useKnownTotal && Math.abs(result.remainingValue) > 1e-12) {
    legacyLines.push(
      `Remainder (Other): ${fmt(result.remainingValue)} (${fmt(result.remainderPercent)}%)`
    );
  }

  setLegacyResult(`${fmt(topItem.percent)}%`, legacyLines);
  resultDetail.textContent = `${topItem.displayName} is the largest share of the total.`;

  let trend = 'neutral';
  if (result.useKnownTotal && result.remainingValue < 0) {
    trend = 'warning';
    resultContext.textContent = `Items exceed the known total by ${fmt(Math.abs(result.remainderPercent))}%.`;
  } else if (result.useKnownTotal && result.remainingValue > 0) {
    resultContext.textContent = `${fmt(result.remainderPercent)}% of the total is still unassigned.`;
  } else {
    resultContext.textContent = `${itemsCount} items across a total of ${totalText}.`;
  }

  updateSnapshot('itemsCount', itemsCount);
  updateSnapshot('totalUsed', totalSource);
  updateSnapshot('total', totalText);
  updateSnapshot('remainderPercent', remainderPercentText);

  updateTargets(valueTargets?.itemsCount, itemsCount);
  updateTargets(valueTargets?.totalUsed, totalSource);
  updateTargets(valueTargets?.total, totalText);
  updateTargets(valueTargets?.sumItems, sumItemsText);
  updateTargets(valueTargets?.remainderPercent, remainderPercentText);

  if (breakdownSummary) {
    breakdownSummary.textContent = `Sum of items: ${sumItemsText}`;
  }
  renderBreakdown(decoratedItems);

  finishCalculation({ reveal, trend });
}

syncModeUI();

knownModeToggle?.addEventListener('change', () => {
  syncModeUI();
});

addRowButton?.addEventListener('click', () => {
  rowsContainer?.appendChild(renderItemRow());
  window.requestAnimationFrame(() => staleController.sync());
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
  window.requestAnimationFrame(() => staleController.sync());
});

calculateButton?.addEventListener('click', () => calculate({ reveal: true }));

calculate();
