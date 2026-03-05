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
const deckMode = document.querySelector('#comm-deck-mode');
const deckSales = document.querySelector('#comm-deck-sales');
const deckRates = document.querySelector('#comm-deck-rates');
const deckCommission = document.querySelector('#comm-deck-commission');
const deckEffectiveRate = document.querySelector('#comm-deck-effective-rate');

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
  title: 'Commission Calculator – CalcHowMuch',
  description:
    'Calculate commission from sales using a flat rate or optional tiers. Free commission calculator for commission % on sales and earnings.',
  canonical: 'https://calchowmuch.com/percentage-calculators/commission-calculator/',
  pageSchema,
  calculatorFAQSchema: CALCULATOR_FAQ_SCHEMA,
  structuredData: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'Commission Calculator',
        url: 'https://calchowmuch.com/percentage-calculators/commission-calculator/',
        description:
          'Calculate commission from sales using a flat rate or optional tiers with our free commission calculator.',
        inLanguage: 'en',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Commission Calculator',
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Web',
        url: 'https://calchowmuch.com/percentage-calculators/commission-calculator/',
        description:
          'Free commission calculator to compute commission earnings from sales using a commission percentage or tiered rates.',
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
    return;
  }

  hasCalculated = true;

  resultOutput.textContent = `Total Commission: ${formatCurrency(result.totalCommission)}`;
  resultDetail.textContent = `Effective Commission Rate: ${formatPercent(result.effectiveRate)}`;

  updateTargets(valueTargets?.mode, mode === 'flat' ? 'Flat Commission %' : 'Tiered Commission');
  updateTargets(valueTargets?.sales, formatCurrency(result.sales));
  updateTargets(valueTargets?.rates, ratesText);
  updateTargets(valueTargets?.commission, formatCurrency(result.totalCommission));
  updateTargets(valueTargets?.effectiveRate, formatPercent(result.effectiveRate));
  updateTargets(valueTargets?.formula, result.formula);
  updateNode(deckMode, mode === 'flat' ? 'Flat Commission %' : 'Tiered Commission');
  updateNode(deckSales, formatCurrency(result.sales));
  updateNode(deckRates, ratesText);
  updateNode(deckCommission, formatCurrency(result.totalCommission));
  updateNode(deckEffectiveRate, formatPercent(result.effectiveRate));

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
