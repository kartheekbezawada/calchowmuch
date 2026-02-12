import { formatNumber } from '/assets/js/core/format.js';
import { setupButtonGroup } from '/assets/js/core/ui.js';
import { calculateOffset } from '/assets/js/core/loan-utils.js';

const balanceInput = document.querySelector('#off-balance');
const rateInput = document.querySelector('#off-rate');
const termInput = document.querySelector('#off-term');
const savingsInput = document.querySelector('#off-savings');
const contributionInput = document.querySelector('#off-contribution');
const calculateButton = document.querySelector('#off-calculate');

const balanceDisplay = document.querySelector('#off-balance-display');
const rateDisplay = document.querySelector('#off-rate-display');
const termDisplay = document.querySelector('#off-term-display');
const savingsDisplay = document.querySelector('#off-savings-display');
const contributionDisplay = document.querySelector('#off-contribution-display');

const resultDiv = document.querySelector('#off-result');
const summaryDiv = document.querySelector('#off-summary');

const modeGroup = document.querySelector('[data-button-group="off-mode"]');
const tableViewGroup = document.querySelector('[data-button-group="off-amortization-view"]');

const viewMonthlyButton = document.querySelector('#off-view-monthly');
const viewYearlyButton = document.querySelector('#off-view-yearly');
const monthlyTableWrap = document.querySelector('#off-table-monthly-wrap');
const yearlyTableWrap = document.querySelector('#off-table-yearly-wrap');
const monthlyTableBody = document.querySelector('#off-table-monthly-body');
const yearlyTableBody = document.querySelector('#off-table-yearly-body');

const lifetimeDonut = document.querySelector('[data-off="lifetime-donut"]');
const interestSavedShareValue = document.querySelector('[data-off="interest-saved-share"]');
const interestRemainingShareValue = document.querySelector('[data-off="interest-remaining-share"]');
const interestBaseValue = document.querySelector('[data-off="interest-base"]');
const interestOffsetValue = document.querySelector('[data-off="interest-offset"]');
const interestSavedValue = document.querySelector('[data-off="interest-saved"]');
const lifetimeSummary = document.querySelector('[data-off="lifetime-summary"]');

const snapshotBalance = document.querySelector('[data-off="balance"]');
const snapshotMode = document.querySelector('[data-off="mode"]');
const snapshotEffectiveBalance = document.querySelector('[data-off="effective-balance"]');
const snapshotOffsetSavings = document.querySelector('[data-off="offset-savings"]');
const snapshotContribution = document.querySelector('[data-off="contribution"]');
const snapshotRate = document.querySelector('[data-off="rate"]');
const snapshotTerm = document.querySelector('[data-off="term"]');
const snapshotInterestSaved = document.querySelector('[data-off="interest-saved-preview"]');
const snapshotTimeSaved = document.querySelector('[data-off="time-saved-preview"]');
const snapshotPayment = document.querySelector('[data-off="payment"]');

const modeButtons = setupButtonGroup(modeGroup, {
  defaultValue: 'full',
  onChange: () => calculate(),
});

setupButtonGroup(tableViewGroup, {
  defaultValue: 'yearly',
  onChange: (value) => applyView(value),
});

function fmt(value, options = {}) {
  return formatNumber(value, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    ...options,
  });
}

function formatTerm(months) {
  const totalMonths = Math.max(0, Math.round(months));
  const years = Math.floor(totalMonths / 12);
  const remaining = totalMonths % 12;
  if (years === 0) {
    return `${remaining} months`;
  }
  if (remaining === 0) {
    return `${years} years`;
  }
  return `${years} years ${remaining} months`;
}

function updateSliderFill(input) {
  if (!input || input.type !== 'range') return;
  const min = parseFloat(input.min) || 0;
  const max = parseFloat(input.max) || 100;
  const val = parseFloat(input.value) || 0;
  const pct = ((val - min) / (max - min)) * 100;
  input.style.setProperty('--fill', `${pct}%`);
}

function updateSliderDisplays() {
  if (balanceInput && balanceDisplay) {
    balanceDisplay.textContent = fmt(Number(balanceInput.value), { maximumFractionDigits: 0 });
    updateSliderFill(balanceInput);
  }
  if (rateInput && rateDisplay) {
    rateDisplay.textContent = `${fmt(Number(rateInput.value), {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })}%`;
    updateSliderFill(rateInput);
  }
  if (termInput && termDisplay) {
    termDisplay.textContent = `${fmt(Number(termInput.value), { maximumFractionDigits: 0 })} yrs`;
    updateSliderFill(termInput);
  }
  if (savingsInput && savingsDisplay) {
    savingsDisplay.textContent = fmt(Number(savingsInput.value), { maximumFractionDigits: 0 });
    updateSliderFill(savingsInput);
  }
  if (contributionInput && contributionDisplay) {
    contributionDisplay.textContent = fmt(Number(contributionInput.value), {
      maximumFractionDigits: 0,
    });
    updateSliderFill(contributionInput);
  }
}

function applyView(view) {
  const showMonthly = view !== 'yearly';
  monthlyTableWrap?.classList.toggle('is-hidden', !showMonthly);
  yearlyTableWrap?.classList.toggle('is-hidden', showMonthly);

  viewMonthlyButton?.classList.toggle('is-active', showMonthly);
  viewYearlyButton?.classList.toggle('is-active', !showMonthly);
}

function clearTables() {
  if (monthlyTableBody) {
    monthlyTableBody.innerHTML = '';
  }
  if (yearlyTableBody) {
    yearlyTableBody.innerHTML = '';
  }
}

function setError(message) {
  if (resultDiv) {
    resultDiv.textContent = message;
  }
  if (summaryDiv) {
    summaryDiv.textContent = '';
  }
  clearTables();
}

function updateSnapshot(data, inputs) {
  if (!data) {
    return;
  }

  const modeLabel = data.offsetMode === 'partial' ? 'Partial / Average' : 'Full Offset';

  snapshotBalance.textContent = fmt(inputs.balance);
  snapshotMode.textContent = modeLabel;
  snapshotEffectiveBalance.textContent = fmt(data.effectiveBalance);
  snapshotOffsetSavings.textContent = fmt(inputs.offsetBalance);
  snapshotContribution.textContent = `${fmt(inputs.offsetContribution)} / month`;
  snapshotRate.textContent = `${fmt(inputs.annualRate, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
  snapshotTerm.textContent = `${fmt(inputs.termYears, { maximumFractionDigits: 0 })} years`;
  snapshotInterestSaved.textContent = fmt(data.interestSaved);
  snapshotTimeSaved.textContent = formatTerm(data.timeSaved);
  snapshotPayment.textContent = fmt(data.payment);
}

function updateLifetime(data) {
  if (!data) {
    return;
  }

  const baselineInterest = data.baseline.totalInterest;
  const offsetInterest = data.offset.totalInterest;
  const savedInterest = data.interestSaved;

  const savedShare = baselineInterest > 0 ? Math.min(100, Math.max(0, (savedInterest / baselineInterest) * 100)) : 0;
  const remainingShare = Math.max(0, 100 - savedShare);

  if (lifetimeDonut) {
    lifetimeDonut.style.setProperty('--principal-share', `${savedShare}%`);
  }
  if (interestSavedShareValue) {
    interestSavedShareValue.textContent = `${fmt(savedShare, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
  }
  if (interestRemainingShareValue) {
    interestRemainingShareValue.textContent = `${fmt(remainingShare, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })}%`;
  }

  if (interestBaseValue) {
    interestBaseValue.textContent = fmt(baselineInterest);
  }
  if (interestOffsetValue) {
    interestOffsetValue.textContent = fmt(offsetInterest);
  }
  if (interestSavedValue) {
    interestSavedValue.textContent = fmt(savedInterest);
  }

  if (lifetimeSummary) {
    lifetimeSummary.textContent =
      `Offset reduces lifetime interest from ${fmt(baselineInterest)} to ${fmt(offsetInterest)}, ` +
      `saving ${fmt(savedInterest)} and trimming payoff by ${formatTerm(data.timeSaved)}.`;
  }
}

function renderMonthlyTable(data, inputs) {
  if (!monthlyTableBody) {
    return;
  }

  const months = Math.max(1, Math.round(inputs.termYears * 12));

  monthlyTableBody.innerHTML = Array.from({ length: months }, (_, index) => {
    const baseRow = data.baseline.schedule[index] ?? { interest: 0 };
    const offsetRow = data.offset.schedule[index] ?? { interest: 0, balance: 0 };
    const month = index + 1;
    const runningOffsetBalance = inputs.offsetBalance + inputs.offsetContribution * index;
    const saved = baseRow.interest - offsetRow.interest;

    return `<tr>
      <td>${month}</td>
      <td>${fmt(runningOffsetBalance, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</td>
      <td>${fmt(baseRow.interest, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</td>
      <td>${fmt(offsetRow.interest, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</td>
      <td>${fmt(saved, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</td>
      <td>${fmt(offsetRow.balance, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</td>
    </tr>`;
  }).join('');
}

function renderYearlyTable(data) {
  if (!yearlyTableBody) {
    return;
  }

  yearlyTableBody.innerHTML = data.yearlyRows
    .map(
      (row) => `<tr>
        <td>${row.year}</td>
        <td>${fmt(row.savingsStart, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</td>
        <td>${fmt(row.savingsEnd, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</td>
        <td>${fmt(row.interestBaseline, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</td>
        <td>${fmt(row.interestOffset, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</td>
        <td>${fmt(row.interestSaved, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</td>
        <td>${fmt(row.endingBalance, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</td>
      </tr>`
    )
    .join('');
}

function calculate() {
  if (!resultDiv || !summaryDiv) {
    return;
  }

  resultDiv.textContent = '';
  summaryDiv.textContent = '';
  clearTables();

  const inputs = {
    balance: Number(balanceInput?.value),
    annualRate: Number(rateInput?.value),
    termYears: Number(termInput?.value),
    offsetBalance: Number(savingsInput?.value),
    offsetContribution: Number(contributionInput?.value),
    offsetMode: modeButtons?.getValue() ?? 'full',
  };

  if (!Number.isFinite(inputs.balance) || inputs.balance <= 0) {
    setError('Mortgage balance must be greater than 0.');
    return;
  }

  if (!Number.isFinite(inputs.annualRate) || inputs.annualRate < 0) {
    setError('Interest rate must be 0 or more.');
    return;
  }

  if (!Number.isFinite(inputs.termYears) || inputs.termYears < 1) {
    setError('Remaining term must be at least 1 year.');
    return;
  }

  if (!Number.isFinite(inputs.offsetBalance) || inputs.offsetBalance < 0) {
    setError('Offset savings must be 0 or more.');
    return;
  }

  if (!Number.isFinite(inputs.offsetContribution) || inputs.offsetContribution < 0) {
    setError('Offset contribution must be 0 or more.');
    return;
  }

  const data = calculateOffset(inputs);

  resultDiv.innerHTML =
    '<strong>Monthly Payment (Baseline)</strong>' +
    `<span class="mtg-result-value">${fmt(data.payment)}</span>`;

  const resultValue = resultDiv.querySelector('.mtg-result-value');
  if (resultValue) {
    resultValue.classList.remove('is-updated');
    void resultValue.offsetWidth;
    resultValue.classList.add('is-updated');
  }

  summaryDiv.innerHTML =
    `<p><strong>Interest saved:</strong> ${fmt(data.interestSaved)}</p>` +
    `<p><strong>Time saved:</strong> ${formatTerm(data.timeSaved)}</p>` +
    `<p><strong>Effective balance:</strong> ${fmt(data.effectiveBalance)}</p>`;

  updateSnapshot(data, inputs);
  updateLifetime(data);
  renderMonthlyTable(data, inputs);
  renderYearlyTable(data);
  applyView('yearly');
}

[balanceInput, rateInput, termInput, savingsInput, contributionInput].forEach((input) => {
  input?.addEventListener('input', updateSliderDisplays);
});

calculateButton?.addEventListener('click', calculate);

updateSliderDisplays();
calculate();
