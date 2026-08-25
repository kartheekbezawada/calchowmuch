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
import { fromAnnual, toAnnual } from '/calculators/salary-calculators/shared/tax-engine/pay-frequency.js';
import { generatePaySchedule } from '/calculators/salary-calculators/shared/tax-engine/pay-schedule.js';

const TAX_DATA_BASE = '/calculators/salary-calculators/shared/tax-data/uk';

const FAQ_ITEMS = [
  {
    question: 'Does this calculator show take-home pay or gross pay?',
    answer:
      'Both. Gross Pay mode converts one amount into every pay period with no tax applied. UK take-home mode estimates what actually reaches your bank account after Income Tax, National Insurance, pension and student loan.',
  },
  {
    question: 'How is UK take-home pay calculated here?',
    answer:
      'Your Personal Allowance is applied first, then Income Tax is charged band by band on what remains. National Insurance is calculated separately on gross earnings using its own thresholds, and student loan repayments are a percentage of income above your plan threshold.',
  },
  {
    question: 'Why does Scotland give a different result?',
    answer:
      'Scotland sets its own income tax bands and rates, which differ from England, Wales and Northern Ireland. The same salary produces a different take-home figure depending on where you are resident for tax purposes, which is why the region selector is not optional.',
  },
  {
    question: 'Does a pension contribution reduce my tax?',
    answer:
      'It depends on the relief method. A net pay arrangement reduces taxable income but not National Insurance. Salary sacrifice reduces both, so it is worth more at the same percentage. Relief at source reduces neither, and the scheme reclaims basic-rate relief on your behalf.',
  },
  {
    question: 'What is the difference between the effective rate and the marginal rate?',
    answer:
      'The effective rate is your total deductions as a percentage of gross pay. The marginal rate is the rate charged on your next pound earned. The marginal rate is almost always higher, and confusing the two is the most common misunderstanding about how tax works.',
  },
  {
    question: 'How is a bonus taxed?',
    answer:
      'The calculator adds the bonus to your annual income, works out total tax on the combined figure, and reports the difference. That is more accurate than applying your marginal rate to the bonus, because a bonus can push part of your income into a higher band.',
  },
  {
    question: 'Why is 4-weekly pay not the same as monthly pay?',
    answer:
      'Four-weekly pay means every 28 days, which is 13 payments a year. Monthly pay is 12 payments a year. The calculator divides annual pay by 13 for 4-weekly, never by taking a monthly figure and adjusting it.',
  },
  {
    question: 'Can I see the dates I will actually be paid?',
    answer:
      'Yes. Turn on Pay schedule and set your first pay date. The pay sheet lists your next 12 paydays with the gross, each deduction and the net amount landing on each one, including the payday your bonus falls on.',
  },
  {
    question: 'Why does my payslip differ from this estimate?',
    answer:
      'Payroll systems apply withholding rules that can differ from your annual tax position, and your employer may apply benefits, salary sacrifice arrangements or deductions not modelled here. This calculator estimates your annual position rather than replicating one payroll run.',
  },
  {
    question: 'Are my salary details stored anywhere?',
    answer: 'No. All calculations run locally in your browser and nothing is stored.',
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
    title: 'Salary Calculator | UK Take-Home Pay and Gross Pay Converter',
    description:
      'Work out your UK take-home pay after Income Tax, National Insurance, pension and student loan, or convert gross pay between hourly, weekly, monthly and annual.',
    canonical: 'https://calchowmuch.com/salary-calculators/salary-calculator/',
    name: 'Salary Calculator',
    appDescription:
      'Estimate UK take-home pay after tax, or convert one gross pay amount into every pay period.',
    featureList: [
      'UK take-home pay after Income Tax and National Insurance',
      'England, Wales, Northern Ireland and Scotland tax bands',
      'Pension contributions with all three relief methods',
      'Student loan plans 1, 2, 4, 5 and Postgraduate',
      'Bonus impact on take-home pay',
      'Pay sheet of upcoming paydays with net amounts',
      'Gross pay conversion across every pay period',
    ],
    keywords:
      'salary calculator, take home pay calculator, uk salary calculator, net pay calculator, gross pay calculator',
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
const money = (value) => {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return (mode === 'uk' ? GBP : PLAIN).format(Number(value));
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

/* ------------------------------------------------------------------ helpers */

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
  dirtyChip.textContent = isDirty ? 'Inputs changed - click Calculate to update' : 'Up to date';
  dirtyChip.classList.toggle('is-dirty', isDirty);
}

function markDirty() {
  setDirty(true);
  clearError();
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

function nextFriday() {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + ((5 - date.getDay() + 7) % 7 || 7));
  return date;
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
    calculate();
  },
});

function applyMode() {
  const isUk = mode === 'uk';
  document.querySelectorAll('.sal-uk-only').forEach((node) => {
    // The pay sheet has its own gate (it needs a schedule), handled inside renderPaySheet.
    if (node.id === 'salary-paysheet') return;
    node.hidden = !isUk;
  });

  setText(el('salary-mode-kicker'), isUk ? 'UK take-home pay' : 'Gross pay conversion');
  setText(
    el('salary-form-title'),
    isUk
      ? 'Work out your take-home pay after tax'
      : 'Convert one pay amount into hourly, weekly, monthly, and annual pay'
  );
  setText(
    el('salary-form-lead'),
    isUk
      ? 'Enter your salary and region. Add pension, student loan or a bonus only if they apply to you.'
      : 'Gross pay only. Start with one pay amount, then compare every major pay view side by side.'
  );
  setText(outputs.answerTitle, isUk ? 'Estimated take-home pay' : 'Annual gross pay');
  setText(outputs.answerEyebrow, isUk ? 'After tax and deductions' : 'Gross (before tax)');
  setText(
    outputs.disclaimer,
    isUk
      ? 'Estimates only, based on published rates for the selected tax year. Not tax advice.'
      : 'Gross-pay estimates only. Taxes, bonuses, and overtime are excluded.'
  );
  setText(
    outputs.method,
    isUk
      ? 'Personal Allowance first, then Income Tax band by band. National Insurance is calculated separately on gross earnings using its own thresholds.'
      : 'Gross pay only. Reverse conversions use your own hours, weeks, and workdays instead of hidden payroll assumptions.'
  );
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

/* ------------------------------------------------------------------ rendering */

const SEGMENTS = [
  { id: 'net', label: 'Take-home', className: 'sal-seg-net' },
  { id: 'tax', label: 'Income tax', className: 'sal-seg-tax' },
  { id: 'ni', label: 'National Insurance', className: 'sal-seg-ni' },
  { id: 'other', label: 'Pension & student loan', className: 'sal-seg-other' },
];

function renderSplit(result) {
  if (!outputs.splitBar || !outputs.splitLegend) return;
  const other = result.studentLoans.total + (result.pension?.takeHomeCost ?? 0);
  const values = {
    net: result.netAnnual,
    tax: result.incomeTax.total,
    ni: result.nationalInsurance.total,
    other,
  };
  const total = result.gross || 1;

  outputs.splitBar.innerHTML = SEGMENTS.filter((s) => values[s.id] > 0)
    .map((s) => `<span class="${s.className}" style="width:${((values[s.id] / total) * 100).toFixed(2)}%"></span>`)
    .join('');

  outputs.splitLegend.innerHTML = SEGMENTS.filter((s) => values[s.id] > 0)
    .map(
      (s) =>
        `<li><i class="${s.className}" aria-hidden="true"></i>${s.label} <strong>${money(values[s.id])}</strong></li>`
    )
    .join('');
}

function renderBands(result) {
  if (!outputs.bandList) return;
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

function renderPaySheet(result) {
  const paysheet = el('salary-paysheet');
  if (!paysheet) return;

  const show = mode === 'uk' && optionOn('sched');
  paysheet.hidden = !show;
  if (!show) return;

  const frequency = sheetFrequencyButtons?.getValue() ?? 'monthly';
  const deductions = [
    { id: 'tax', label: 'Income tax', annualAmount: result.incomeTax.total },
    { id: 'ni', label: 'NI', annualAmount: result.nationalInsurance.total },
    {
      id: 'other',
      label: 'Other',
      annualAmount: result.studentLoans.total + (result.pension?.takeHomeCost ?? 0),
    },
  ];

  const schedule = generatePaySchedule({
    firstPayDate: firstPayInput?.value || nextFriday(),
    frequency,
    annualGross: result.gross,
    annualNet: result.netAnnual,
    deductions,
    periods: 12,
    weekendRule: weekendRuleSelect?.value || 'previous',
    bonusMonthIndex: null,
    bonusGross: 0,
    bonusNet: 0,
  });

  outputs.paysheetBody.innerHTML = schedule.rows
    .map(
      (row) => `
      <tr>
        <td>${row.index}</td>
        <td>${longDate(row.date)}${row.movedOffWeekend ? '<span class="sal-moved">moved</span>' : ''}</td>
        <td class="sal-num">${money(row.gross)}</td>
        <td class="sal-num">${money(row.deductions[0].amount)}</td>
        <td class="sal-num">${money(row.deductions[1].amount)}</td>
        <td class="sal-num">${money(row.deductions[2].amount)}</td>
        <td class="sal-num"><strong>${money(row.net)}</strong></td>
      </tr>`
    )
    .join('');

  const foot = outputs.paysheetFoot;
  if (foot) {
    foot.children[1].textContent = money(result.gross);
    foot.children[2].textContent = money(result.incomeTax.total);
    foot.children[3].textContent = money(result.nationalInsurance.total);
    foot.children[4].textContent = money(
      result.studentLoans.total + (result.pension?.takeHomeCost ?? 0)
    );
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
    return;
  }

  if (mode === 'uk' && !taxData) {
    showError(
      taxDataError
        ? 'Tax tables could not be loaded, so take-home pay cannot be estimated right now. Gross Pay mode still works.'
        : 'Loading tax tables…'
    );
    return;
  }

  clearError();

  let result;
  if (mode === 'uk') {
    const grossAnnual = toAnnual(amount, frequency, schedule());
    result = calculateUkTakeHome(
      {
        grossAnnual,
        region: regionButtons?.getValue() ?? 'england',
        bonus: optionOn('bonus') ? getInputNumber(bonusAmountInput) || 0 : 0,
        pensionPercent: optionOn('pension') ? getInputNumber(pensionPercentInput) || 0 : 0,
        pensionReliefMethod: pensionReliefSelect?.value || 'net-pay-arrangement',
        studentLoanPlan: optionOn('loan') ? loanPlanSelect?.value || 'none' : 'none',
        hasPostgraduateLoan: optionOn('loan') ? Boolean(loanPostgradInput?.checked) : false,
      },
      taxData
    );
  } else {
    result = calculateGrossOnly({ amount, frequency, schedule: schedule() });
  }

  const periods = renderPeriods(result);

  if (mode === 'uk') {
    setText(outputs.effectiveRate, percent(result.effectiveRate));
    setText(outputs.marginalRate, percent(result.marginalRate));
    setText(
      outputs.note,
      `From ${money(result.gross)} gross, you keep about ${money(periods.monthly)} per month.`
    );
    setText(
      outputs.breakdown,
      `Personal Allowance ${money(result.personalAllowance.allowance)} · Income tax ${money(
        result.incomeTax.total
      )} · National Insurance ${money(result.nationalInsurance.total)} · Total deductions ${money(
        result.totalDeductions
      )}.`
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
    mode === 'uk'
      ? `Estimated UK take-home: ${money(result.netAnnual)} per year, ${money(periods.monthly)} per month.`
      : `Gross (before tax): ${money(result.gross)} per year, ${money(periods.monthly)} per month.`,
    mode === 'uk'
      ? `Gross ${money(result.gross)} · Income tax ${money(result.incomeTax.total)} · NI ${money(
          result.nationalInsurance.total
        )} · Effective rate ${percent(result.effectiveRate)} · Region ${result.region.name}.`
      : `Weekly ${money(periods.weekly)} · Hourly ${money(periods.hourly)}.`,
    buildAssumptionsLine(frequency),
  ].join('\n');

  setDirty(false);
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
  firstPayInput.value = nextFriday().toISOString().slice(0, 10);
}

applyMode();
calculate();

// Tax tables load in the background so Gross Pay mode is interactive immediately.
void loadTaxData().then(() => {
  if (mode === 'uk') calculate();
});
