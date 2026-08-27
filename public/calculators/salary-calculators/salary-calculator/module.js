import { setPageMetadata, setupButtonGroup } from '/assets/js/core/ui.js';
import {
  buildSalaryMetadata,
  copyTextToClipboard,
  formatInputValue,
  getInputNumber,
  setText,
} from '/calculators/salary-calculators/shared/salary-utils.js';
import { calculateGrossOnly } from '/calculators/salary-calculators/shared/tax-engine/gross-engine.js';
import { calculateUkTakeHome } from '/calculators/salary-calculators/shared/tax-engine/uk-engine.js';
import { calculateUsTakeHome } from '/calculators/salary-calculators/shared/tax-engine/us-engine.js';
import { fromAnnual, toAnnual } from '/calculators/salary-calculators/shared/tax-engine/pay-frequency.js';
import { generatePaySchedule } from '/calculators/salary-calculators/shared/tax-engine/pay-schedule.js';

const TAX_DATA_BASE = '/calculators/salary-calculators/shared/tax-data/uk';
const US_DATA_BASE = '/calculators/salary-calculators/shared/tax-data/us';

const FAQ_ITEMS = [
  {
    question: "Does this calculator show take-home pay or gross pay?",
    answer:
      "Both. Gross Pay mode converts one amount into every pay period with no tax applied. UK take-home mode estimates what actually reaches your bank account after Income Tax, National Insurance, pension and student loan.",
  },
  {
    question: "How is UK take-home pay calculated here?",
    answer:
      "Your Personal Allowance is applied first, then Income Tax is charged band by band on what remains. National Insurance is calculated separately on gross earnings using its own thresholds, and student loan repayments are a percentage of income above your plan threshold.",
  },
  {
    question: "Why does Scotland give a different result?",
    answer:
      "Scotland sets its own income tax bands and rates, which differ from England, Wales and Northern Ireland. The same salary produces a different take-home figure depending on where you are resident for tax purposes, which is why the region selector is not optional.",
  },
  {
    question: "Does a pension contribution reduce my tax?",
    answer:
      "It depends on the relief method. A net pay arrangement reduces taxable income but not National Insurance. Salary sacrifice reduces both, so it is worth more at the same percentage. Relief at source reduces neither, and the scheme reclaims basic-rate relief on your behalf.",
  },
  {
    question: "What is the difference between the effective rate and the marginal rate?",
    answer:
      "The effective rate is your total deductions as a percentage of gross pay. The marginal rate is the rate charged on your next pound earned. The marginal rate is almost always higher, and confusing the two is the most common misunderstanding about how tax works.",
  },
  {
    question: "How is a bonus taxed?",
    answer:
      "The calculator adds the bonus to your annual income, works out total tax on the combined figure, and reports the difference. That is more accurate than applying your marginal rate to the bonus, because a bonus can push part of your income into a higher band.",
  },
  {
    question: "Why is 4-weekly pay not the same as monthly pay?",
    answer:
      "Four-weekly pay means every 28 days, which is 13 payments a year. Monthly pay is 12 payments a year. The calculator divides annual pay by 13 for 4-weekly, never by taking a monthly figure and adjusting it.",
  },
  {
    question: "Can I see the dates I will actually be paid?",
    answer:
      "Yes. Turn on Pay schedule and set your first pay date. The pay sheet lists your next 12 paydays with the gross, each deduction and the net amount landing on each one, including the payday your bonus falls on.",
  },
  {
    question: "Why does my payslip differ from this estimate?",
    answer:
      "Payroll systems apply withholding rules that can differ from your annual tax position, and your employer may apply benefits, salary sacrifice arrangements or deductions not modelled here. This calculator estimates your annual position rather than replicating one payroll run.",
  },
  {
    question: "Are my salary details stored anywhere?",
    answer:
      "No. All calculations run locally in your browser - no data is stored.",
  },
  {
    question: "How is US take-home pay calculated here?",
    answer:
      "Your standard deduction is applied first, then federal income tax is charged bracket by bracket on what remains. FICA is calculated separately on your gross wages, and state income tax uses that state's own schedule and deductions.",
  },
  {
    question: "Does my 401(k) reduce FICA as well as income tax?",
    answer:
      "No. A 401(k) reduces federal and state taxable income, but Social Security and Medicare are charged on your full gross wages regardless. This is the detail most paycheck calculators get wrong, and it makes the real saving smaller than the headline rate suggests.",
  },
  {
    question: "Why does my state change the result so much?",
    answer:
      "Nine states levy no income tax on wages at all, around fifteen apply a single flat rate, and the rest use graduated brackets with their own deductions. On a $100,000 salary the difference between Texas and California is over $6,500 a year.",
  },
  {
    question: "Are city or local income taxes included?",
    answer:
      "No. This calculator covers federal, FICA and state-level taxes only. If you live or work in a city with its own income tax. New York City, Philadelphia, Detroit and others. Your actual take-home will be lower than shown.",
  },
  {
    question: "Which filing status should I choose?",
    answer:
      "Pick the status you file under: Single, Married Filing Jointly, Married Filing Separately, or Head of Household. Both the tax brackets and the standard deduction change with it, so on a $100,000 salary the federal tax alone can differ by several thousand dollars.",
  },
];

const FAQ_SCHEMA = {
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};

setPageMetadata(
  buildSalaryMetadata({
    title: 'Salary Calculator | UK and US Take-Home Pay Calculator',
    description:
      'Work out your take-home pay after tax in the UK or the US, or convert gross pay between hourly, weekly, monthly and annual. Free, and nothing is stored.',
    canonical: 'https://calchowmuch.com/salary-calculators/salary-calculator/',
    name: 'Salary Calculator',
    appDescription:
      'Estimate UK or US take-home pay after tax, or convert one gross pay amount into every pay period.',
    featureList: [
      'UK take-home pay after Income Tax and National Insurance',
      'England, Wales, Northern Ireland and Scotland tax bands',
      'US take-home pay after federal tax, FICA and state tax',
      'All 50 US states plus DC, with all four filing statuses',
      'State payroll taxes such as CA SDI and NJ TDI/FLI',
      'Pension contributions with all three relief methods',
      'Student loan plans 1, 2, 4, 5 and Postgraduate',
      'Bonus impact on take-home pay',
      'Pay sheet of upcoming paydays with net amounts',
      'Gross pay conversion across every pay period',
    ],
    keywords:
      'salary calculator, take home pay calculator, uk salary calculator, us paycheck calculator, net pay calculator, gross pay calculator',
    faqSchema: FAQ_SCHEMA,
  })
);

/* ------------------------------------------------------------------ elements */

const el = (id) => document.querySelector(`#${id}`);

const amountInput = el('salary-pay-amount');
const hoursInput = el('salary-hours-per-week');
const weeksInput = el('salary-weeks-per-year');
const daysInput = el('salary-days-per-week');
const errorNode = el('salary-calc-error');
const calculateButton = el('salary-calc-button');
const copyButton = el('salary-copy-summary');
const copyFeedback = el('salary-copy-feedback');
const dirtyChip = el('salary-dirty-chip');

const pensionPercentInput = el('salary-pension-percent');
const pensionReliefSelect = el('salary-pension-relief');
const loanPlanSelect = el('salary-loan-plan');
const loanPostgradInput = el('salary-loan-postgrad');
const bonusAmountInput = el('salary-bonus-amount');
const bonusMonthSelect = el('salary-bonus-month');
const firstPayInput = el('salary-first-pay');
const weekendRuleSelect = el('salary-weekend-rule');
const stateInput = el('salary-state');
const stateList = el('salary-state-list');
const stateHint = el('salary-state-hint');
const pretaxInput = el('salary-pretax');

const outputs = {
  hero: el('salary-annual-pay'),
  answerTitle: el('salary-answer-title'),
  answerEyebrow: el('salary-answer-eyebrow'),
  note: el('salary-answer-note'),
  context: el('salary-answer-context'),
  breakdown: el('salary-breakdown'),
  method: el('salary-method-copy'),
  disclaimer: el('salary-results-disclaimer'),
  effectiveRate: el('salary-effective-rate'),
  marginalRate: el('salary-marginal-rate'),
  splitBar: el('salary-split-bar'),
  splitLegend: el('salary-split-legend'),
  bandList: el('salary-band-list'),
  monthly: el('salary-monthly-pay'),
  biweekly: el('salary-biweekly-pay'),
  weekly: el('salary-weekly-pay'),
  daily: el('salary-daily-pay'),
  hourly: el('salary-hourly-pay'),
  paysheetBody: el('salary-paysheet-body'),
  paysheetFoot: el('salary-paysheet-foot'),
  paysheetMeta: el('salary-paysheet-meta'),
  paysheetAssumed: el('salary-paysheet-assumed'),
  assumedDate: el('salary-assumed-date'),
};

/* ------------------------------------------------------------------ state */

let mode = 'gross';
let taxData = null;
let taxDataError = null;
let latestSummary = '';
let copyTimer = null;
let payDateUserSet = false;
let sheetFrequencyUserSet = false;

// Gross Pay mode stays currency-NEUTRAL, exactly as this page has always been. It is pure
// arithmetic and is used by visitors outside the UK, so stamping a £ on it would be a
// regression. UK mode is a British tax calculation, so it gets the symbol.
const GBP = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const PLAIN = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const USD = new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2,
});
const money = (value) => {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  if (mode === 'uk') return GBP.format(Number(value));
  if (mode === 'us') return USD.format(Number(value));
  return PLAIN.format(Number(value));
};
const percent = (fraction) => `${(Number(fraction) * 100).toFixed(1)}%`;
const longDate = (date) =>
  date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

/* ------------------------------------------------------------------ tax data */

/**
 * Tax tables are fetched rather than bundled so the 51 US state files can be added later without
 * growing the initial payload. UK mode stays disabled until the fetch resolves — showing a
 * take-home figure computed from missing data would be worse than showing nothing.
 */
async function loadTaxData() {
  if (taxData || taxDataError) return taxData;
  try {
    const files = ['income-tax', 'national-insurance', 'student-loans', 'pension'];
    const [incomeTax, nationalInsurance, studentLoans, pension] = await Promise.all(
      files.map(async (file) => {
        const response = await fetch(`${TAX_DATA_BASE}/${file}.json`);
        if (!response.ok) throw new Error(`${file}.json responded ${response.status}`);
        return response.json();
      })
    );
    taxData = { incomeTax, nationalInsurance, studentLoans, pension };
  } catch (error) {
    taxDataError = error;
  }
  return taxData;
}

let usFederal = null;
let usFica = null;
let usPayroll = null;
let usStateCache = new Map();
let selectedState = null;

/** Federal + FICA + payroll load once; individual state files load only when picked. */
async function loadUsBaseData() {
  if (usFederal) return true;
  try {
    const [federal, fica, payroll] = await Promise.all(
      ['federal-income-tax', 'fica', 'payroll-taxes'].map(async (f) => {
        const r = await fetch(`${US_DATA_BASE}/${f}.json`);
        if (!r.ok) throw new Error(`${f}.json responded ${r.status}`);
        return r.json();
      })
    );
    usFederal = federal;
    usFica = fica;
    usPayroll = payroll;
    return true;
  } catch (error) {
    taxDataError = error;
    return false;
  }
}

/**
 * One state file per selection rather than all 51 up front — that is the whole reason the data is
 * fetched instead of bundled.
 */
async function loadState(code) {
  if (usStateCache.has(code)) return usStateCache.get(code);
  const response = await fetch(`${US_DATA_BASE}/states/${code}.json`);
  if (!response.ok) throw new Error(`${code}.json responded ${response.status}`);
  const data = await response.json();
  usStateCache.set(code, data);
  return data;
}

/* ------------------------------------------------------------------ helpers */

/**
 * Blank the results card.
 *
 * Called whenever calculate() cannot produce a figure. Without this the card keeps whatever the
 * previous mode left behind, so switching to USA before choosing a state showed the UK result -
 * complete with a pound sign - next to a "choose your state" error. A stale number in the wrong
 * currency is worse than no number, because it looks like an answer.
 */
function clearResults() {
  const dash = '\u2014';
  [outputs.hero, outputs.monthly, outputs.biweekly, outputs.weekly, outputs.daily, outputs.hourly]
    .forEach((node) => setText(node, dash));
  setText(outputs.effectiveRate, dash);
  setText(outputs.marginalRate, dash);
  setText(outputs.note, '');
  setText(outputs.breakdown, '');
  if (outputs.splitBar) outputs.splitBar.innerHTML = '';
  if (outputs.splitLegend) outputs.splitLegend.innerHTML = '';
  if (outputs.bandList) outputs.bandList.innerHTML = '';
  if (outputs.paysheetBody) outputs.paysheetBody.innerHTML = '';

  const details = el('salary-breakdown-details');
  if (details) details.hidden = true;
  const paysheet = el('salary-paysheet');
  if (paysheet) paysheet.hidden = true;

  latestSummary = '';
}

function showError(message) {
  if (!errorNode) return;
  errorNode.hidden = false;
  errorNode.textContent = message;
}

function clearError() {
  if (!errorNode) return;
  errorNode.hidden = true;
  errorNode.textContent = '';
}

function setDirty(isDirty) {
  if (!dirtyChip) return;
  // With live calculation the "click Calculate" prompt would be wrong, so this reports state
  // rather than instructing an action that is no longer required.
  dirtyChip.textContent = isDirty ? 'Updating...' : 'Updated';
  dirtyChip.classList.toggle('is-dirty', isDirty);
}

/**
 * Recalculate as the user types rather than making them find the Calculate button.
 *
 * The button sat at the bottom of a tall form card while the result sat at the top of the results
 * card, roughly 900px apart, so clicking it meant scrolling away from the answer and back again.
 * Live calculation removes that round trip entirely. The button stays as an explicit action for
 * anyone who expects one, but nothing depends on it.
 *
 * Debounced so a four-digit salary does not trigger four full recalculations, and because the US
 * path can touch the state cache.
 */
let liveTimer = null;
function markDirty() {
  clearError();
  setDirty(true);
  window.clearTimeout(liveTimer);
  liveTimer = window.setTimeout(() => calculate(), 250);
}

function setCopyFeedback(message, tone = 'success') {
  if (!copyFeedback) return;
  copyFeedback.textContent = message;
  copyFeedback.dataset.tone = tone;
  copyFeedback.classList.add('is-visible');
  window.clearTimeout(copyTimer);
  copyTimer = window.setTimeout(() => {
    copyFeedback.classList.remove('is-visible');
    copyFeedback.textContent = '';
    delete copyFeedback.dataset.tone;
  }, 1800);
}

/**
 * Default first payday: the 1st of next month.
 *
 * The pay sheet is visible before anyone has entered a pay date, so it needs a sensible default.
 * The 1st is the right choice over "next Friday" — it is the most common monthly payroll anchor,
 * it reads as an obvious placeholder rather than a real-looking date the user might trust, and
 * `addMonthsClamped()` keeps it on the 1st in every month with no special-casing.
 *
 * Noon local avoids `toISOString()` shifting the date back a day in negative-offset timezones.
 */
function firstOfNextMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 1, 12, 0, 0, 0);
}

function schedule() {
  return {
    hoursPerWeek: getInputNumber(hoursInput),
    weeksPerYear: getInputNumber(weeksInput),
    daysPerWeek: getInputNumber(daysInput),
  };
}

/* ------------------------------------------------------------------ groups */

const frequencyButtons = setupButtonGroup(document.querySelector('[data-button-group="salary-pay-frequency"]'), {
  defaultValue: 'annual',
  onChange: () => markDirty(),
});

const regionButtons = setupButtonGroup(document.querySelector('[data-button-group="salary-region"]'), {
  defaultValue: 'england',
  onChange: () => markDirty(),
});

const filingStatusButtons = setupButtonGroup(document.querySelector('[data-button-group="salary-filing-status"]'), {
  defaultValue: 'single',
  onChange: () => markDirty(),
});

const sheetFrequencyButtons = setupButtonGroup(
  document.querySelector('[data-button-group="salary-sheet-frequency"]'),
  {
    defaultValue: 'monthly',
    onChange: () => {
      sheetFrequencyUserSet = true;
      calculate();
    },
  }
);

setupButtonGroup(document.querySelector('[data-button-group="salary-mode"]'), {
  defaultValue: 'gross',
  onChange: (value) => {
    mode = value;
    applyMode();
    // USA defaults to Texas rather than showing an error until the visitor picks a state.
    // chooseState() runs its own calculate() once the state's tax data has loaded.
    if (mode === 'us' && !selectedState) {
      void chooseState('TX');
    } else {
      calculate();
    }
  },
});

function applyMode() {
  const isUk = mode === 'uk';
  const isUs = mode === 'us';
  const isGross = mode === 'gross';
  const isTax = isUk || isUs;

  // One mechanism for every scope, and it reaches the explanation too because this is a global
  // querySelectorAll rather than one scoped to the calculator root. `sal-tax-only` is anything
  // common to both countries; the country classes gate what is genuinely country-specific.
  //
  // These hide with the `hidden` attribute and NEVER remove nodes. content-quality-thin-score.mjs
  // parses the built HTML with JSDOM, so hidden copy still counts toward the word total and the
  // FAQ schema — conditional rendering would roughly halve the indexable content.
  const scopes = [
    ['.sal-uk-only', isUk],
    ['.sal-us-only', isUs],
    ['.sal-tax-only', isTax],
    ['.sal-gross-only', isGross],
  ];
  for (const [selector, visible] of scopes) {
    document.querySelectorAll(selector).forEach((node) => {
      // The pay sheet has its own gate (it needs a schedule), handled inside renderPaySheet.
      if (node.id === 'salary-paysheet') return;
      node.hidden = !visible;
    });
  }
  const localNote = el('salary-local-note');
  if (localNote) localNote.hidden = !isUs;

  // An optional chip hidden by a mode change must also give up its panel and its pressed state.
  // Without this, turning on UK Pension and switching to USA leaves the panel on screen under a
  // chip that no longer exists, and optionOn('pension') keeps reporting true - a hidden control
  // silently holding state is exactly the kind of thing a user cannot debug.
  document.querySelectorAll('.sal-opt-chip').forEach((chip) => {
    if (chip.offsetParent !== null) return; // still visible in this mode, leave it alone
    chip.setAttribute('aria-pressed', 'false');
    chip.classList.remove('is-active');
    const panel = el('salary-panel-' + chip.dataset.opt);
    if (panel) panel.hidden = true;
  });

  const copy = {
    gross: {
      answerTitle: 'Annual gross pay',
      eyebrow: 'Gross (before tax)',
      disclaimer: 'Gross-pay estimates only. Taxes, bonuses, and overtime are excluded.',
      method: 'Gross pay only. Reverse conversions use your own hours, weeks, and workdays instead of hidden payroll assumptions.',
    },
    uk: {
      answerTitle: 'Estimated take-home pay',
      eyebrow: 'After tax and deductions',
      disclaimer: 'Estimates only, based on published rates for the selected tax year. Not tax advice.',
      method: 'Personal Allowance first, then Income Tax band by band. National Insurance is calculated separately on gross earnings using its own thresholds.',
    },
    us: {
      answerTitle: 'Estimated take-home pay',
      eyebrow: 'After federal, FICA and state tax',
      disclaimer: 'Estimates only. Federal, FICA and state-level taxes; local income taxes are not included. Not tax advice.',
      method: 'Standard deduction first, then federal tax band by band. FICA is charged on gross wages, and state income tax is calculated on its own schedule.',
    },
  }[mode];

  setText(outputs.answerTitle, copy.answerTitle);
  setText(outputs.answerEyebrow, copy.eyebrow);
  setText(outputs.disclaimer, copy.disclaimer);
  setText(outputs.method, copy.method);
}

function optionOn(name) {
  const chip = document.querySelector(`.sal-opt-chip[data-opt="${name}"]`);
  return chip?.getAttribute('aria-pressed') === 'true';
}

document.querySelectorAll('.sal-opt-chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    const isOn = chip.getAttribute('aria-pressed') === 'true';
    chip.setAttribute('aria-pressed', String(!isOn));
    chip.classList.toggle('is-active', !isOn);
    const panel = el(`salary-panel-${chip.dataset.opt}`);
    if (panel) panel.hidden = isOn;
    calculate();
  });
});

/* ------------------------------------------------------------------ state typeahead */

const US_STATES = [
  ['AL','Alabama'],['AK','Alaska'],['AZ','Arizona'],['AR','Arkansas'],['CA','California'],
  ['CO','Colorado'],['CT','Connecticut'],['DE','Delaware'],['DC','District of Columbia'],
  ['FL','Florida'],['GA','Georgia'],['HI','Hawaii'],['ID','Idaho'],['IL','Illinois'],
  ['IN','Indiana'],['IA','Iowa'],['KS','Kansas'],['KY','Kentucky'],['LA','Louisiana'],
  ['ME','Maine'],['MD','Maryland'],['MA','Massachusetts'],['MI','Michigan'],['MN','Minnesota'],
  ['MS','Mississippi'],['MO','Missouri'],['MT','Montana'],['NE','Nebraska'],['NV','Nevada'],
  ['NH','New Hampshire'],['NJ','New Jersey'],['NM','New Mexico'],['NY','New York'],
  ['NC','North Carolina'],['ND','North Dakota'],['OH','Ohio'],['OK','Oklahoma'],['OR','Oregon'],
  ['PA','Pennsylvania'],['RI','Rhode Island'],['SC','South Carolina'],['SD','South Dakota'],
  ['TN','Tennessee'],['TX','Texas'],['UT','Utah'],['VT','Vermont'],['VA','Virginia'],
  ['WA','Washington'],['WV','West Virginia'],['WI','Wisconsin'],['WY','Wyoming'],
];
const NO_INCOME_TAX = new Set(['AK','FL','NV','NH','SD','TN','TX','WA','WY']);

let activeOption = -1;

function closeStateList() {
  if (!stateList) return;
  stateList.hidden = true;
  stateInput?.setAttribute('aria-expanded', 'false');
  activeOption = -1;
}

function renderStateOptions(query) {
  if (!stateList) return;
  const q = query.trim().toLowerCase();
  if (!q) return closeStateList();

  const hits = US_STATES.filter(([code, name]) =>
    name.toLowerCase().includes(q) || code.toLowerCase() === q
  ).slice(0, 8);

  if (!hits.length) {
    stateList.innerHTML = '<div class="sal-typeahead-empty">No match</div>';
  } else {
    stateList.innerHTML = hits
      .map(([code, name], i) =>
        `<div class="sal-typeahead-item" role="option" id="sal-state-opt-${i}" data-code="${code}" aria-selected="false">${name}</div>`
      )
      .join('');
  }
  stateList.hidden = false;
  stateInput?.setAttribute('aria-expanded', 'true');
  activeOption = -1;
}

function highlightOption(delta) {
  const items = [...stateList.querySelectorAll('.sal-typeahead-item')];
  if (!items.length) return;
  activeOption = (activeOption + delta + items.length) % items.length;
  items.forEach((node, i) => {
    const on = i === activeOption;
    node.classList.toggle('is-active', on);
    node.setAttribute('aria-selected', String(on));
    if (on) node.scrollIntoView({ block: 'nearest' });
  });
  stateInput?.setAttribute('aria-activedescendant', items[activeOption].id);
}

async function chooseState(code) {
  const entry = US_STATES.find(([c]) => c === code);
  if (!entry) return;
  selectedState = code;
  if (stateInput) stateInput.value = entry[1];
  closeStateList();
  setText(
    stateHint,
    NO_INCOME_TAX.has(code)
      ? `${entry[1]} has no state income tax on wages - federal and FICA only.`
      : `State income tax for ${entry[1]} will be included.`
  );
  try {
    await loadState(code);
  } catch {
    setText(stateHint, `Could not load tax data for ${entry[1]}.`);
    selectedState = null;
  }
  calculate();
}

stateInput?.addEventListener('input', () => {
  selectedState = null;
  renderStateOptions(stateInput.value);
});

// Keyboard support is not optional here - a combobox that only works with a mouse is unusable
// for anyone navigating by keyboard, and it was called out in the design spec's a11y section.
stateInput?.addEventListener('keydown', (event) => {
  if (stateList.hidden) return;
  if (event.key === 'ArrowDown') { event.preventDefault(); highlightOption(1); }
  else if (event.key === 'ArrowUp') { event.preventDefault(); highlightOption(-1); }
  else if (event.key === 'Enter') {
    const active = stateList.querySelector('.sal-typeahead-item.is-active')
      || stateList.querySelector('.sal-typeahead-item');
    if (active) { event.preventDefault(); void chooseState(active.dataset.code); }
  } else if (event.key === 'Escape') closeStateList();
});

stateList?.addEventListener('click', (event) => {
  const item = event.target.closest('.sal-typeahead-item');
  if (item) void chooseState(item.dataset.code);
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.sal-typeahead')) closeStateList();
});

/* ------------------------------------------------------------------ rendering */

const SEGMENTS = [
  { id: 'net', label: 'Take-home', className: 'sal-seg-net' },
  { id: 'tax', label: 'Income tax', className: 'sal-seg-tax' },
  { id: 'ni', label: 'National Insurance', className: 'sal-seg-ni' },
  { id: 'other', label: 'Pension & student loan', className: 'sal-seg-other' },
];

/**
 * The UK and US engines return different shapes. Rather than branching through every render
 * function, both are normalised once into the four segments the results card draws.
 */
function segmentsFor(result) {
  if (result.country === 'US') {
    return {
      net: result.netAnnual,
      tax: result.federalTax.total + result.stateTax.total,
      ni: result.fica.total,
      other: result.statePayrollTaxes.total + result.pretaxDeductions,
      labels: { tax: 'Federal + state tax', ni: 'FICA', other: 'Pre-tax & state payroll' },
    };
  }
  return {
    net: result.netAnnual,
    tax: result.incomeTax.total,
    ni: result.nationalInsurance.total,
    other: result.studentLoans.total + (result.pension ? result.pension.takeHomeCost : 0),
    labels: { tax: 'Income tax', ni: 'National Insurance', other: 'Pension & student loan' },
  };
}

function renderSplit(result) {
  if (!outputs.splitBar || !outputs.splitLegend) return;
  const seg = segmentsFor(result);
  const values = { net: seg.net, tax: seg.tax, ni: seg.ni, other: seg.other };
  const total = result.gross || 1;

  outputs.splitBar.innerHTML = SEGMENTS.filter((s) => values[s.id] > 0)
    .map((s) => `<span class="${s.className}" style="width:${((values[s.id] / total) * 100).toFixed(2)}%"></span>`)
    .join('');

  outputs.splitLegend.innerHTML = SEGMENTS.filter((s) => values[s.id] > 0)
    .map((s) => {
      const label = seg.labels[s.id] || s.label;
      return `<li><i class="${s.className}" aria-hidden="true"></i>${label} <strong>${money(values[s.id])}</strong></li>`;
    })
    .join('');
}

function renderBands(result) {
  if (!outputs.bandList) return;
  if (result.country === 'US') return renderUsBands(result);
  const rows = [];

  rows.push(['Gross pay', result.gross, false]);
  if (result.personalAllowance) {
    const label = result.personalAllowance.isTapered
      ? `Personal Allowance (reduced by ${money(result.personalAllowance.reducedBy)})`
      : 'Personal Allowance @ 0%';
    rows.push([label, result.personalAllowance.allowance, false]);
  }
  result.incomeTax.breakdown
    .filter((band) => band.amountInBand > 0)
    .forEach((band) => {
      rows.push([`${band.name} — ${money(band.amountInBand)} @ ${percent(band.rate)}`, -band.tax, true]);
    });
  if (result.nationalInsurance.total > 0) {
    rows.push(['National Insurance', -result.nationalInsurance.total, true]);
  }
  result.studentLoans.entries.forEach((entry) => {
    if (entry.amount > 0) rows.push([entry.name, -entry.amount, true]);
  });
  if (result.pension && result.pension.takeHomeCost > 0) {
    rows.push([`Pension — ${result.pension.reliefMethodName}`, -result.pension.takeHomeCost, true]);
  }

  outputs.bandList.innerHTML =
    rows
      .map(
        ([label, value, negative]) =>
          `<div class="sal-band"><span>${label}</span><span class="sal-num">${negative ? '−' : ''}${money(Math.abs(value))}</span></div>`
      )
      .join('') +
    `<div class="sal-band sal-band-total"><span>Estimated take-home</span><span class="sal-num">${money(result.netAnnual)}</span></div>` +
    `<div class="sal-band sal-band-quiet"><span>Marginal Income Tax rate</span><span class="sal-num">${percent(result.marginalRate)}</span></div>`;
}

function renderUsBands(result) {
  const rows = [['Gross pay', result.gross, false]];
  if (result.pretaxDeductions > 0) rows.push(['Pre-tax contributions', -result.pretaxDeductions, true]);
  rows.push([`Standard deduction (${result.filingStatus.replace(/([A-Z])/g, ' $1').toLowerCase()})`, result.standardDeduction, false]);
  result.federalTax.breakdown
    .filter((b) => b.amountInBand > 0)
    .forEach((b) => rows.push([`Federal ${b.name} on ${money(b.amountInBand)}`, -b.tax, true]));
  result.fica.breakdown.forEach((f) => { if (f.amount > 0) rows.push([f.name, -f.amount, true]); });
  if (result.stateTax.total > 0) {
    rows.push([`${result.state.name} state income tax`, -result.stateTax.total, true]);
  }
  result.statePayrollTaxes.entries.forEach((e) => {
    if (e.amount > 0) rows.push([e.name, -e.amount, true]);
  });

  outputs.bandList.innerHTML =
    rows.map(([label, value, neg]) =>
      `<div class="sal-band"><span>${label}</span><span class="sal-num">${neg ? '−' : ''}${money(Math.abs(value))}</span></div>`
    ).join('') +
    `<div class="sal-band sal-band-total"><span>Estimated take-home</span><span class="sal-num">${money(result.netAnnual)}</span></div>` +
    `<div class="sal-band sal-band-quiet"><span>Marginal rate (federal + state)</span><span class="sal-num">${percent(result.combinedMarginalRate)}</span></div>` +
    (result.assumptions.length
      ? `<div class="sal-band sal-band-quiet"><span>${result.assumptions.join(' ')}</span><span></span></div>`
      : '');
}

function renderPaySheet(result) {
  const paysheet = el('salary-paysheet');
  if (!paysheet) return;

  // Always available, in every mode. It used to be gated behind `+ Pay schedule`, which meant
  // most visitors calculated a figure and never discovered the feature existed. Gross Pay mode
  // degrades to date + gross via `#salary-paysheet.is-gross [data-col="tax"] { display: none }` —
  // "when do I get paid and how much" is still a real question with no tax applied.
  paysheet.hidden = false;
  paysheet.classList.toggle('is-gross', mode === 'gross');

  const frequency = sheetFrequencyButtons?.getValue() ?? 'monthly';

  // Regular periods must be built from the WITHOUT-bonus result. Using the with-bonus figures
  // would spread the bonus's tax across all twelve rows, which is exactly the smearing this
  // feature exists to avoid.
  const bonusGross = optionOn('bonus') ? getInputNumber(bonusAmountInput) || 0 : 0;
  const baseResult = bonusGross > 0 ? calculateFor({ ...currentInputs(), bonus: 0 }) : result;
  const bonusNet = bonusGross > 0 && baseResult ? result.netAnnual - baseResult.netAnnual : 0;

  const seg = segmentsFor(baseResult || result);
  const deductions = [
    { id: 'tax', label: seg.labels.tax, annualAmount: seg.tax },
    { id: 'ni', label: seg.labels.ni, annualAmount: seg.ni },
    { id: 'other', label: seg.labels.other, annualAmount: seg.other },
  ];

  // Column headers follow the country's own vocabulary rather than staying UK-flavoured.
  const head = el('salary-paysheet');
  const setHead = (n, text) => {
    const th = head.querySelector('thead th:nth-child(' + n + ')');
    if (th) th.textContent = text;
  };
  setHead(4, seg.labels.tax);
  setHead(5, seg.labels.ni);
  setHead(6, seg.labels.other);

  const schedule = generatePaySchedule({
    firstPayDate: firstPayInput?.value || firstOfNextMonth(),
    frequency,
    // Annual figures exclude the bonus so the regular periods stay regular; the bonus and the tax
    // it brings with it are added back on its own payday inside the schedule engine.
    annualGross: (baseResult || result).gross,
    annualNet: (baseResult || result).netAnnual,
    deductions,
    periods: 12,
    weekendRule: weekendRuleSelect?.value || 'previous',
    bonusMonthIndex: bonusGross > 0 ? Number(bonusMonthSelect?.value ?? 11) : null,
    bonusGross,
    bonusNet,
  });

  outputs.paysheetBody.innerHTML = schedule.rows
    .map(
      (row) => `
      <tr class="${row.isBonusPeriod ? 'is-bonus' : ''}">
        <td>${row.index}</td>
        <td>${longDate(row.date)}${row.movedOffWeekend ? '<span class="sal-moved">moved</span>' : ''}${row.isBonusPeriod ? '<span class="sal-bonus-badge">Bonus</span>' : ''}</td>
        <td class="sal-num">${money(row.gross)}</td>
        <td class="sal-num" data-col="tax">${money(row.deductions[0].amount)}</td>
        <td class="sal-num" data-col="tax">${money(row.deductions[1].amount)}</td>
        <td class="sal-num" data-col="tax">${money(row.deductions[2].amount)}</td>
        <td class="sal-num" data-col="tax"><strong>${money(row.net)}</strong></td>
      </tr>`
    )
    .join('');

  const foot = outputs.paysheetFoot;
  if (foot) {
    // Footer shows the full-year position, so it uses the WITH-bonus result.
    const totalSeg = segmentsFor(result);
    foot.children[1].textContent = money(result.gross);
    foot.children[2].textContent = money(totalSeg.tax);
    foot.children[3].textContent = money(totalSeg.ni);
    foot.children[4].textContent = money(totalSeg.other);
    foot.children[5].textContent = money(result.netAnnual);
  }

  setText(
    outputs.paysheetMeta,
    `${frequency === 'fourWeekly' ? '4-weekly' : frequency.charAt(0).toUpperCase() + frequency.slice(1)} · ${schedule.periodsPerYear} periods per year`
  );
  outputs.paysheetAssumed.hidden = payDateUserSet;
  setText(outputs.assumedDate, longDate(schedule.firstPayDate));
}

function renderPeriods(result) {
  const periods = fromAnnual(result.netAnnual, schedule());
  setText(outputs.hero, money(result.netAnnual));
  setText(outputs.monthly, money(periods.monthly));
  setText(outputs.biweekly, money(periods.biweekly));
  setText(outputs.weekly, money(periods.weekly));
  setText(outputs.daily, money(periods.daily));
  setText(outputs.hourly, money(periods.hourly));
  return periods;
}

/* ------------------------------------------------------------------ calculate */

function buildAssumptionsLine(frequency) {
  return `Assumptions: source ${frequency} pay · ${formatInputValue(hoursInput, '40')} hrs/week · ${formatInputValue(
    weeksInput,
    '52'
  )} weeks/year · ${formatInputValue(daysInput, '5')} workdays/week.`;
}

function calculate() {
  const frequency = frequencyButtons?.getValue() ?? 'annual';
  const amount = getInputNumber(amountInput);

  if (!Number.isFinite(amount) || amount <= 0) {
    showError('Enter a pay amount plus valid schedule assumptions before calculating.');
    clearResults();
    return;
  }

  if (mode === 'us') {
    if (!usFederal) {
      showError(
        taxDataError
          ? 'US tax tables could not be loaded. Gross Pay mode still works.'
          : 'Loading US tax tables...'
      );
      clearResults();
      return;
    }
    // The state field defaults to Texas and can only be changed to another item picked from the
    // typeahead list, so this only fires if someone clears the field by hand. Falling back to
    // Texas rather than showing an error keeps that edge case silent instead of blocking on it.
    if (!selectedState || !usStateCache.has(selectedState)) {
      clearResults();
      void chooseState('TX');
      return;
    }
  }

  if (mode === 'uk' && !taxData) {
    showError(
      taxDataError
        ? 'Tax tables could not be loaded, so take-home pay cannot be estimated right now. Gross Pay mode still works.'
        : 'Loading tax tables…'
    );
    clearResults();
    return;
  }

  clearError();

  const result = calculateFor(currentInputs());
  if (!result) return;
  renderResult(result, frequency);
}

/**
 * The inputs the engines need, read once from the DOM.
 *
 * Split out from `calculate()` so the pay sheet can re-run the engine with `bonus: 0` and derive
 * the net bonus as the difference between two full results — which is the only way to capture
 * band crossings and the UK allowance taper.
 */
function currentInputs() {
  const frequency = frequencyButtons?.getValue() ?? 'annual';
  const amount = getInputNumber(amountInput);
  return {
    amount,
    frequency,
    grossAnnual: toAnnual(amount, frequency, schedule()),
    region: regionButtons?.getValue() ?? 'england',
    filingStatus: filingStatusButtons ? filingStatusButtons.getValue() : 'single',
    bonus: optionOn('bonus') ? getInputNumber(bonusAmountInput) || 0 : 0,
    pensionPercent: optionOn('pension') ? getInputNumber(pensionPercentInput) || 0 : 0,
    pensionReliefMethod: pensionReliefSelect?.value || 'net-pay-arrangement',
    studentLoanPlan: optionOn('loan') ? loanPlanSelect?.value || 'none' : 'none',
    hasPostgraduateLoan: optionOn('loan') ? Boolean(loanPostgradInput?.checked) : false,
    pretaxDeductions: optionOn('pretax') ? getInputNumber(pretaxInput) || 0 : 0,
  };
}

/** Dispatch to the right engine for the active mode. Pure given `input`. */
function calculateFor(input) {
  if (mode === 'uk') {
    return calculateUkTakeHome(input, taxData);
  }
  if (mode === 'us') {
    return calculateUsTakeHome(input, {
      federal: usFederal,
      fica: usFica,
      state: usStateCache.get(selectedState),
      payroll: usPayroll,
    });
  }
  return calculateGrossOnly({
    amount: input.amount,
    frequency: input.frequency,
    bonus: input.bonus,
    schedule: schedule(),
  });
}

function renderResult(result, frequency) {
  const periods = renderPeriods(result);

  if (mode !== 'gross') {
    setText(outputs.effectiveRate, percent(result.effectiveRate));
    setText(
      outputs.marginalRate,
      percent(result.country === 'US' ? result.combinedMarginalRate : result.marginalRate)
    );
    setText(
      outputs.note,
      `From ${money(result.gross)} gross, you keep about ${money(periods.monthly)} per month.`
    );
    setText(
      outputs.breakdown,
      result.country === 'US'
        ? `Standard deduction ${money(result.standardDeduction)} - Federal tax ${money(result.federalTax.total)} - FICA ${money(result.fica.total)} - ${result.state.name} state tax ${money(result.stateTax.total)} - Total deductions ${money(result.totalDeductions)}.`
        : `Personal Allowance ${money(result.personalAllowance.allowance)} - Income tax ${money(result.incomeTax.total)} - National Insurance ${money(result.nationalInsurance.total)} - Total deductions ${money(result.totalDeductions)}.`
    );
    renderSplit(result);
    renderBands(result);
    const details = el('salary-breakdown-details');
    if (details) details.hidden = false;
  } else {
    setText(outputs.note, `Gross (before tax), that equals about ${money(periods.weekly)} per week.`);
    setText(
      outputs.breakdown,
      'Annual pay starts from the amount you entered. Monthly = annual / 12, biweekly = annual / 26, weekly = annual / weeks per year, and hourly uses weekly / hours per week.'
    );
  }

  setText(outputs.context, buildAssumptionsLine(frequency));
  renderPaySheet(result);

  latestSummary = [
    mode === 'gross'
      ? `Gross (before tax): ${money(result.gross)} per year, ${money(periods.monthly)} per month.`
      : `Estimated take-home: ${money(result.netAnnual)} per year, ${money(periods.monthly)} per month.`,
    mode === 'uk'
      ? `Gross ${money(result.gross)} - Income tax ${money(result.incomeTax.total)} - NI ${money(result.nationalInsurance.total)} - Effective rate ${percent(result.effectiveRate)} - Region ${result.region.name}.`
      : mode === 'us'
        ? `Gross ${money(result.gross)} - Federal ${money(result.federalTax.total)} - FICA ${money(result.fica.total)} - ${result.state.name} ${money(result.stateTax.total)} - Effective rate ${percent(result.effectiveRate)}. Local income taxes are not included.`
        : `Weekly ${money(periods.weekly)} - Hourly ${money(periods.hourly)}.`,
    buildAssumptionsLine(frequency),
    paySheetSummary(),
  ].filter(Boolean).join('\n');

  setDirty(false);
}

/**
 * The pay sheet is part of the answer, so it belongs in the copied text. Kept to the first three
 * paydays plus a pointer to the rest - pasting twelve rows into a message is noise, but "when does
 * the money actually arrive" is the reason someone copies this at all.
 */
function paySheetSummary() {
  const body = outputs.paysheetBody;
  if (!body || !body.children.length) return '';
  const rows = [...body.children].slice(0, 3).map((tr) => {
    const cells = [...tr.children].filter((td) => td.offsetParent !== null);
    // The date cell may carry a "moved" and/or "Bonus" badge. textContent concatenates them with
    // no separator, so "Fri, 30 Oct 2026moved" — normalise both into readable suffixes.
    const date = cells[1]
      ? cells[1].textContent
          .replace(/moved/i, ' (moved off a weekend)')
          .replace(/Bonus/i, ' (bonus)')
          .replace(/\s+/g, ' ')
          .trim()
      : '';
    const net = cells.length ? cells[cells.length - 1].textContent.trim() : '';
    return '  ' + date + ': ' + net;
  });
  const meta = outputs.paysheetMeta ? outputs.paysheetMeta.textContent.trim() : '';
  return ['Next paydays (' + meta + '):'].concat(rows, ['  ...next 12 paydays shown on the page.']).join('\n');
}

async function copySummary() {
  const copied = await copyTextToClipboard(latestSummary);
  setCopyFeedback(copied ? 'Summary copied.' : 'Copy failed.', copied ? 'success' : 'error');
}

/* ------------------------------------------------------------------ wiring */

[
  amountInput,
  hoursInput,
  weeksInput,
  daysInput,
  pensionPercentInput,
  bonusAmountInput,
  pretaxInput,
].forEach((input) => {
  input?.addEventListener('input', markDirty);
  input?.addEventListener('change', markDirty);
  input?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') calculate();
  });
});

[pensionReliefSelect, loanPlanSelect, bonusMonthSelect, weekendRuleSelect].forEach((node) => {
  node?.addEventListener('change', calculate);
});
loanPostgradInput?.addEventListener('change', calculate);

firstPayInput?.addEventListener('change', () => {
  payDateUserSet = true;
  calculate();
});

el('salary-set-schedule')?.addEventListener('click', () => {
  const chip = document.querySelector('.sal-opt-chip[data-opt="sched"]');
  if (chip && chip.getAttribute('aria-pressed') !== 'true') chip.click();
  firstPayInput?.focus();
});

calculateButton?.addEventListener('click', calculate);
copyButton?.addEventListener('click', () => {
  void copySummary();
});

if (firstPayInput && !firstPayInput.value) {
  const d = firstOfNextMonth();
  // Built from local parts rather than toISOString() so the value cannot slip to the previous
  // month in a negative-offset timezone.
  firstPayInput.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

applyMode();
calculate();

// Tax tables load in the background so Gross Pay mode is interactive immediately.
void loadTaxData().then(() => {
  if (mode === 'uk') calculate();
});
void loadUsBaseData().then(() => {
  if (mode === 'us') calculate();
});
