import { calculateCommission } from '/assets/js/core/math.js';
import { formatNumber } from '/assets/js/core/format.js';
import { setPageMetadata } from '/assets/js/core/ui.js';

const tieredModeToggle = document.querySelector('#comm-tiered-toggle');
const flatModeLabel = document.querySelector('[data-comm-mode-label="flat"]');
const tieredModeLabel = document.querySelector('[data-comm-mode-label="tiered"]');
const modeRadios = Array.from(document.querySelectorAll('input[name="comm-mode"]'));
const salesInput = document.querySelector('#comm-sales');
const flatSection = document.querySelector('#comm-flat-section');
const tieredSection = document.querySelector('#comm-tiered-section');
const flatRateInput = document.querySelector('#comm-rate');
const tierRows = document.querySelector('#comm-tier-rows');
const addTierButton = document.querySelector('#comm-add-tier');
const calculateButton = document.querySelector('#comm-calc');
const resultOutput = document.querySelector('#comm-result');
const resultDetail = document.querySelector('#comm-result-detail');
const resultContext = document.querySelector('#comm-result-context');
const deckMode = document.querySelector('#comm-deck-mode');
const deckSales = document.querySelector('#comm-deck-sales');
const deckRates = document.querySelector('#comm-deck-rates');
const deckCommission = document.querySelector('#comm-deck-commission');
const deckEffectiveRate = document.querySelector('#comm-deck-effective-rate');
const tierSummary = document.querySelector('#comm-tier-summary');
const chartSubtitle = document.querySelector('#comm-chart-subtitle');
const chartPlaceholder = document.querySelector('#comm-chart-placeholder');
const chartDonut = document.querySelector('#comm-chart-donut');
const chartLegend = document.querySelector('#comm-chart-legend');
const chartCenterMeta = document.querySelector('#comm-chart-center-meta');
const chartCenterValue = document.querySelector('#comm-chart-center-value');

const explanationRoot = document.querySelector('#comm-explanation');
const breakdownWrap = explanationRoot?.querySelector('#comm-breakdown-wrap');
const breakdownBody = explanationRoot?.querySelector('#comm-breakdown-body');
const valueTargets = explanationRoot
  ? {
      mode: explanationRoot.querySelectorAll('[data-comm="mode"]'),
      sales: explanationRoot.querySelectorAll('[data-comm="sales"]'),
      rates: explanationRoot.querySelectorAll('[data-comm="rates"]'),
      commission: explanationRoot.querySelectorAll('[data-comm="commission"]'),
      effectiveRate: explanationRoot.querySelectorAll('[data-comm="effective-rate"]'),
      formula: explanationRoot.querySelectorAll('[data-comm="formula"]'),
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
      name: 'What is a commission calculator?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A commission calculator estimates how much commission you earn from sales using a commission rate.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you calculate commission from sales?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Multiply sales by the commission rate divided by 100.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the commission formula?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The formula is Commission = Sales × (Rate/100).',
      },
    },
    {
      '@type': 'Question',
      name: 'What is an effective commission rate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It is total commission divided by total sales, expressed as a percentage.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does tiered commission work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Different portions of sales earn different commission rates based on tiers or ranges.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you calculate tiered commission?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Apply each tier rate to the sales amount in that tier and add the results.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can commission be calculated with decimal rates like 7.5%?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, decimal commission rates work the same way.',
      },
    },
    {
      '@type': 'Question',
      name: 'What happens if sales are zero?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Total commission is zero, and the effective rate may be shown as 0% or undefined depending on the method.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is commission the same as profit?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, commission is a payout based on sales, while profit depends on revenue minus costs.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where are commission calculations used in real life?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'They are used in sales compensation, affiliate programs, brokerage, and agency agreements.',
      },
    },
  ],
};

const metadata = {
  title: 'Commission Calculator | Sales and Tiered Rates',
  description:
    'Calculate commission from sales using flat or tiered rates and see the effective commission percentage.',
  canonical: 'https://calchowmuch.com/percentage-calculators/commission-calculator/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Commission Calculator | Sales and Tiered Rates',
        url: 'https://calchowmuch.com/percentage-calculators/commission-calculator/',
        description:
          'Calculate commission from sales using flat or tiered rates and see the effective commission percentage.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Commission Calculator',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/percentage-calculators/commission-calculator/',
        description:
          'Free commission calculator for flat-rate or tiered commission earnings from sales.',
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
            name: 'Commission Calculator',
            item: 'https://calchowmuch.com/percentage-calculators/commission-calculator/',
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

const CHART_COLORS = [
  '#047857',
  '#0f766e',
  '#0891b2',
  '#2563eb',
  '#f59e0b',
  '#dc2626',
];

function getTierColor(index) {
  return CHART_COLORS[index % CHART_COLORS.length];
}

function getTierLabel(row) {
  return row.to === null
    ? `Above ${formatCurrency(row.from)}`
    : `${formatCurrency(row.from)} to ${formatCurrency(row.to)}`;
}

function hideChartDonut() {
  if (chartDonut) {
    chartDonut.hidden = true;
    chartDonut.setAttribute('aria-hidden', 'true');
    chartDonut.style.removeProperty('--comm-chart-fill');
  }
}

function renderChartLegend(items = []) {
  if (!chartLegend) {
    return;
  }

  chartLegend.innerHTML = '';
  if (!items.length) {
    const empty = document.createElement('div');
    empty.className = 'comm-chart-legend-item is-muted';
    empty.textContent = 'Tier legend will appear after calculation.';
    chartLegend.appendChild(empty);
    return;
  }

  items.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'comm-chart-legend-item';
    row.innerHTML = `
      <span class="comm-chart-legend-swatch" style="background:${item.color}"></span>
      <span class="comm-chart-legend-copy">
        <span class="comm-chart-legend-label">${item.label}</span>
        <span class="comm-chart-legend-meta">${item.meta}</span>
      </span>
      <span class="comm-chart-legend-value">${item.value}</span>
    `;
    chartLegend.appendChild(row);
  });
}

function showChartPlaceholder(title, description) {
  if (chartPlaceholder) {
    chartPlaceholder.hidden = false;
  }
  hideChartDonut();
  updateNode(chartSubtitle, title);
  updateNode(chartCenterValue, '0.00%');
  updateNode(chartCenterMeta, 'Largest commission share');
  renderChartLegend();

  if (chartPlaceholder) {
    const heading = chartPlaceholder.querySelector('strong');
    const body = chartPlaceholder.querySelector('p');
    updateNode(heading, title);
    updateNode(body, description);
  }
}

function renderFlatRateSummary(rateText) {
  if (!tierSummary) {
    return;
  }

  tierSummary.innerHTML = '';
  const line = document.createElement('div');
  line.className = 'comm-tier-summary-empty';
  line.textContent = `Flat rate ${rateText} applies to the full sale amount.`;
  tierSummary.appendChild(line);
}

function renderTierSummary(result) {
  if (!tierSummary) {
    return;
  }

  tierSummary.innerHTML = '';
  const rows = Array.isArray(result?.breakdown) ? result.breakdown : [];
  if (!rows.length || !(result.totalCommission > 0)) {
    const empty = document.createElement('div');
    empty.className = 'comm-tier-summary-empty';
    empty.textContent = 'Tier details will appear after a valid tiered calculation.';
    tierSummary.appendChild(empty);
    return;
  }

  rows.forEach((row, index) => {
    const commissionShare = result.totalCommission > 0 ? (row.commission / result.totalCommission) * 100 : 0;
    const item = document.createElement('div');
    item.className = 'comm-tier-summary-item';
    item.innerHTML = `
      <div class="comm-tier-summary-top">
        <span class="comm-tier-summary-label">
          <span class="comm-tier-swatch" style="background:${getTierColor(index)}"></span>
          <span class="comm-tier-summary-text">${getTierLabel(row)}</span>
        </span>
      </div>
      <span class="comm-tier-summary-rate">${formatPercent(row.rate)}</span>
      <span class="comm-tier-summary-commission">${formatCurrency(row.commission)}</span>
      <span class="comm-tier-summary-share">${formatPercent(commissionShare)} share</span>
    `;
    tierSummary.appendChild(item);
  });
}

function renderTierChart(result) {
  const rows = Array.isArray(result?.breakdown) ? result.breakdown : [];
  if (!rows.length || !chartDonut) {
    showChartPlaceholder(
      'Tiered chart appears here',
      'Switch to Tiered Commission and calculate to see how each tier contributes.'
    );
    return;
  }

  const totalCommission = result.totalCommission > 0 ? result.totalCommission : 0;
  if (totalCommission <= 0) {
    showChartPlaceholder(
      'No commission to chart',
      'Tiered commission distribution will appear once the calculation produces commission earnings.'
    );
    return;
  }

  let currentAngle = 0;
  const legendItems = [];
  const segments = rows.map((row, index) => {
    const share = (row.commission / totalCommission) * 100;
    const start = currentAngle;
    currentAngle += (share / 100) * 360;
    const color = getTierColor(index);
    legendItems.push({
      color,
      label: getTierLabel(row),
      meta: `${formatPercent(row.rate)} rate`,
      value: `${formatCurrency(row.commission)} • ${formatPercent(share)}`,
    });
    return `${color} ${start.toFixed(2)}deg ${currentAngle.toFixed(2)}deg`;
  });

  const topTier = rows.reduce(
    (best, row, index) =>
      !best || row.commission > best.row.commission ? { row, index } : best,
    null
  );

  if (chartPlaceholder) {
    chartPlaceholder.hidden = true;
  }
  chartDonut.hidden = false;
  chartDonut.setAttribute('aria-hidden', 'false');
  chartDonut.style.setProperty('--comm-chart-fill', `conic-gradient(from -90deg, ${segments.join(', ')})`);
  updateNode(
    chartSubtitle,
    `${rows.length} tier${rows.length === 1 ? '' : 's'} contributing to total commission`
  );
  updateNode(
    chartCenterValue,
    topTier ? formatPercent((topTier.row.commission / totalCommission) * 100) : '0.00%'
  );
  updateNode(chartCenterMeta, topTier ? `${formatCurrency(topTier.row.commission)} from ${formatPercent(topTier.row.rate)} tier` : 'Largest commission share');
  renderChartLegend(legendItems);
}

function renderDeckState({ mode, ratesText = '', result = null }) {
  updateNode(deckRates, ratesText);

  if (mode === 'flat') {
    renderFlatRateSummary(ratesText);
    showChartPlaceholder(
      'Tiered chart appears here',
      'Switch to Tiered Commission and calculate to see how each tier contributes.'
    );
    return;
  }

  renderTierSummary(result);
  renderTierChart(result);
}

function renderTierRow({ upTo = '', rate = '' } = {}) {
  const row = document.createElement('div');
  row.className = 'input-row commission-tier-row';
  row.innerHTML = `
    <div class="commission-tier-field">
      <label>Tier Up to</label>
      <input type="number" class="comm-tier-up-to" min="0" step="0.01" value="${upTo}" placeholder="Leave blank for above last threshold" />
    </div>
    <div class="commission-tier-field">
      <label>Tier Rate %</label>
      <input type="number" class="comm-tier-rate" min="0" step="0.01" value="${rate}" />
    </div>
    <button type="button" class="calculator-button secondary comm-remove-tier">Remove</button>
  `;
  return row;
}

function ensureTierRows() {
  if (!tierRows || tierRows.children.length > 0) {
    return;
  }
  tierRows.appendChild(renderTierRow({ upTo: '10000', rate: '5' }));
  tierRows.appendChild(renderTierRow({ upTo: '25000', rate: '7' }));
  tierRows.appendChild(renderTierRow({ upTo: '', rate: '10' }));
}

function setModeVisibility(mode) {
  const isTiered = mode === 'tiered';
  flatSection.hidden = isTiered;
  flatSection.setAttribute('aria-hidden', String(isTiered));
  tieredSection.classList.toggle('is-hidden', !isTiered);
  tieredSection.hidden = !isTiered;
  tieredSection.setAttribute('aria-hidden', String(!isTiered));
}

function getMode() {
  if (tieredModeToggle) {
    return tieredModeToggle.checked ? 'tiered' : 'flat';
  }
  return modeRadios.some((radio) => radio.checked && radio.value === 'tiered') ? 'tiered' : 'flat';
}

function syncModeUI() {
  const mode = getMode();
  if (tieredModeToggle) {
    tieredModeToggle.checked = mode === 'tiered';
  }
  modeRadios.forEach((radio) => {
    radio.checked = radio.value === mode;
  });
  setModeVisibility(mode);
  flatModeLabel?.classList.toggle('is-active', mode === 'flat');
  tieredModeLabel?.classList.toggle('is-active', mode === 'tiered');
}

function collectTiers() {
  const rows = Array.from(tierRows?.querySelectorAll('.commission-tier-row') ?? []);
  if (!rows.length) {
    return { tiers: null, error: 'Add at least one tier.' };
  }

  const tiers = [];
  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    const upToInput = row.querySelector('.comm-tier-up-to');
    const rateInput = row.querySelector('.comm-tier-rate');

    const upToText = upToInput?.value?.trim() ?? '';
    const rateValue = Number(rateInput?.value);

    if (!Number.isFinite(rateValue) || rateValue < 0) {
      return { tiers: null, error: 'Enter valid non-negative tier rates.' };
    }

    if (upToText === '' && i !== rows.length - 1) {
      return { tiers: null, error: 'Only the last tier can have a blank "Up to" value.' };
    }

    tiers.push({
      upTo: upToText === '' ? null : Number(upToText),
      rate: rateValue,
    });
  }

  return { tiers, error: null };
}

function renderBreakdownRows(rows) {
  if (!breakdownWrap || !breakdownBody) {
    return;
  }

  breakdownBody.innerHTML = '';
  if (!rows.length) {
    breakdownWrap.hidden = true;
    return;
  }

  rows.forEach((row) => {
    const tr = document.createElement('tr');
    const tierLabel =
      row.to === null
        ? `Above ${formatCurrency(row.from)}`
        : `${formatCurrency(row.from)} to ${formatCurrency(row.to)}`;
    tr.innerHTML = `
      <td>${tierLabel}</td>
      <td>${formatCurrency(row.sales)}</td>
      <td>${formatPercent(row.rate)}</td>
      <td>${formatCurrency(row.commission)}</td>
    `;
    breakdownBody.appendChild(tr);
  });

  breakdownWrap.hidden = false;
}

let hasCalculated = false;
const liveUpdatesEnabled = false;

function calculate() {
  const mode = getMode();
  const sales = Number(salesInput.value);

  if (!Number.isFinite(sales) || sales < 0) {
    resultOutput.textContent = 'Enter a valid non-negative sales amount.';
    resultDetail.textContent = '';
    if (resultContext) {
      resultContext.textContent = '';
    }
    renderDeckState({ mode, ratesText: mode === 'flat' ? formatPercent(Number(flatRateInput.value) || 0) : '' });
    return;
  }

  let result = null;
  let ratesText = '';

  if (mode === 'flat') {
    const rate = Number(flatRateInput.value);
    result = calculateCommission({ sales, mode: 'flat', rate });
    ratesText = Number.isFinite(rate) ? formatPercent(rate) : 'N/A';
  } else {
    const { tiers, error } = collectTiers();
    if (error) {
      resultOutput.textContent = error;
      resultDetail.textContent = '';
      if (resultContext) {
        resultContext.textContent = '';
      }
      renderDeckState({ mode, ratesText: '' });
      return;
    }
    result = calculateCommission({ sales, mode: 'tiered', tiers });
    ratesText = tiers
      .map((tier) =>
        tier.upTo === null
          ? `Above last: ${formatPercent(tier.rate)}`
          : `Up to ${formatCurrency(tier.upTo)}: ${formatPercent(tier.rate)}`
      )
      .join(' | ');
  }

  if (!result) {
    resultOutput.textContent = 'Unable to calculate with the current inputs.';
    resultDetail.textContent = 'Check tier ordering and numeric values.';
    if (resultContext) {
      resultContext.textContent = '';
    }
    renderDeckState({ mode, ratesText, result: null });
    return;
  }

  hasCalculated = true;

  resultOutput.textContent = formatCurrency(result.totalCommission);
  resultDetail.textContent =
    mode === 'flat'
      ? `Effective commission rate is ${formatPercent(result.effectiveRate)} on ${formatCurrency(result.sales)} in sales.`
      : `Effective commission rate is ${formatPercent(result.effectiveRate)} across ${result.breakdown.length} commission tiers.`;
  if (resultContext) {
    resultContext.textContent = `Formula: ${result.formula}`;
  }

  updateTargets(valueTargets?.mode, mode === 'flat' ? 'Flat Commission %' : 'Tiered Commission');
  updateTargets(valueTargets?.sales, formatCurrency(result.sales));
  updateTargets(valueTargets?.rates, ratesText);
  updateTargets(valueTargets?.commission, formatCurrency(result.totalCommission));
  updateTargets(valueTargets?.effectiveRate, formatPercent(result.effectiveRate));
  updateTargets(valueTargets?.formula, result.formula);
  updateNode(deckMode, mode === 'flat' ? 'Flat Commission %' : 'Tiered Commission');
  updateNode(deckSales, formatCurrency(result.sales));
  updateNode(deckCommission, formatCurrency(result.totalCommission));
  updateNode(deckEffectiveRate, formatPercent(result.effectiveRate));
  renderDeckState({ mode, ratesText, result });

  if (mode === 'tiered') {
    renderBreakdownRows(result.breakdown);
  } else if (breakdownWrap) {
    breakdownWrap.hidden = true;
    if (breakdownBody) {
      breakdownBody.innerHTML = '';
    }
  }
}

syncModeUI();
ensureTierRows();

tieredModeToggle?.addEventListener('change', () => {
  syncModeUI();
  if (liveUpdatesEnabled && hasCalculated) {
    calculate();
  }
});

modeRadios.forEach((radio) => {
  radio.addEventListener('change', () => {
    if (!radio.checked) {
      return;
    }
    if (tieredModeToggle) {
      tieredModeToggle.checked = radio.value === 'tiered';
    }
    syncModeUI();
    if (liveUpdatesEnabled && hasCalculated) {
      calculate();
    }
  });
});

addTierButton?.addEventListener('click', () => {
  tierRows?.appendChild(renderTierRow({ upTo: '', rate: '' }));
});

tierRows?.addEventListener('click', (event) => {
  const button = event.target.closest('.comm-remove-tier');
  if (!button) {
    return;
  }
  const rows = tierRows.querySelectorAll('.commission-tier-row');
  if (rows.length === 1) {
    return;
  }
  button.closest('.commission-tier-row')?.remove();
  if (liveUpdatesEnabled && hasCalculated) {
    calculate();
  }
});

tierRows?.addEventListener('input', () => {
  if (liveUpdatesEnabled && hasCalculated && getMode() === 'tiered') {
    calculate();
  }
});

[salesInput, flatRateInput].forEach((input) => {
  input?.addEventListener('input', () => {
    if (liveUpdatesEnabled && hasCalculated) {
      calculate();
    }
  });
});

calculateButton?.addEventListener('click', calculate);

calculate();
