import { formatNumber } from '/assets/js/core/format.js';
import { setupButtonGroup } from '/assets/js/core/ui.js';
import { calculateInterestRateChange } from '/assets/js/core/loan-utils.js';
import {
  revealResultPanel,
  updateRangeFill,
  wireRangeWithField,
} from '/calculators/loan-calculators/shared/cluster-ux.js';

const balanceInput = document.querySelector('#rate-balance');
const currentRateInput = document.querySelector('#rate-current');
const newRateInput = document.querySelector('#rate-new');
const termInput = document.querySelector('#rate-term');
const changeMonthsInput = document.querySelector('#rate-change-months');

const balanceField = document.querySelector('#rate-balance-field');
const currentRateField = document.querySelector('#rate-current-field');
const newRateField = document.querySelector('#rate-new-field');
const termField = document.querySelector('#rate-term-field');
const changeMonthsField = document.querySelector('#rate-change-months-field');

const balanceDisplay = document.querySelector('#rate-balance-display');
const currentRateDisplay = document.querySelector('#rate-current-display');
const newRateDisplay = document.querySelector('#rate-new-display');
const termDisplay = document.querySelector('#rate-term-display');
const changeMonthsDisplay = document.querySelector('#rate-change-months-display');

const changeMonthsRow = document.querySelector('#rate-change-months-row');
const timingGroup = document.querySelector('[data-button-group="rate-change-timing"]');

const calculateButton = document.querySelector('#rate-calculate');
const resultDiv = document.querySelector('#rate-result');
const summaryDiv = document.querySelector('#rate-summary');
const resultNote = document.querySelector('#rate-result-note');
const resultDashboard = document.querySelector('#rate-results');

const snapshotCurrentPayment = document.querySelector('[data-rate="snap-current-payment"]');
const snapshotNewPayment = document.querySelector('[data-rate="snap-new-payment"]');
const snapshotMonthlyDiff = document.querySelector('[data-rate="snap-monthly-diff"]');
const snapshotAnnualDiff = document.querySelector('[data-rate="snap-annual-diff"]');
const snapshotInterestBase = document.querySelector('[data-rate="snap-interest-base"]');
const snapshotInterestNew = document.querySelector('[data-rate="snap-interest-new"]');
const snapshotInterestChange = document.querySelector('[data-rate="snap-interest-change"]');
const snapshotTiming = document.querySelector('[data-rate="snap-timing"]');

const lifetimeDonut = document.querySelector('[data-rate="lifetime-donut"]');
const lifetimeBaseShare = document.querySelector('[data-rate="lt-baseline-share"]');
const lifetimeNewShare = document.querySelector('[data-rate="lt-new-share"]');
const lifetimeBaseInterest = document.querySelector('[data-rate="lt-baseline-interest"]');
const lifetimeNewInterest = document.querySelector('[data-rate="lt-new-interest"]');
const lifetimeInterestChange = document.querySelector('[data-rate="lt-interest-change"]');
const lifetimeSummary = document.querySelector('[data-rate="lt-summary"]');

const tableViewGroup = document.querySelector('[data-button-group="rate-amortization-view"]');
const monthlyTableWrap = document.querySelector('#rate-table-monthly-wrap');
const yearlyTableWrap = document.querySelector('#rate-table-yearly-wrap');
const monthlyTableBody = document.querySelector('#rate-table-monthly-body');
const yearlyTableBody = document.querySelector('#rate-table-yearly-body');

const timingButtons = setupButtonGroup(timingGroup, {
  defaultValue: 'immediate',
  onChange: (value) => {
    changeMonthsRow?.classList.toggle('is-hidden', value !== 'after');
    updateSliderDisplays();
  },
});

const tableViewButtons = setupButtonGroup(tableViewGroup, {
  defaultValue: 'yearly',
  onChange: (value) => applyView(value),
});

function formatMoney(value) {
  return formatNumber(value, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function formatPercent(value) {
  return `${formatNumber(value, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}%`;
}

function formatWhole(value) {
  return formatNumber(value, { maximumFractionDigits: 0 });
}

function parseLooseNumber(value) {
  const parsed = Number(String(value).replace(/,/g, '').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : NaN;
}

function syncChangeMonthsLimit() {
  if (!termInput || !changeMonthsInput) {
    return;
  }
  const months = Math.max(1, Math.round(Number(termInput.value) * 12));
  changeMonthsInput.max = String(months);
  if (Number(changeMonthsInput.value) > months) {
    changeMonthsInput.value = String(months);
  }
}

function updateSliderDisplays() {
  syncChangeMonthsLimit();

  if (balanceInput && balanceDisplay) {
    balanceDisplay.textContent = formatWhole(Number(balanceInput.value));
    updateRangeFill(balanceInput);
    if (balanceField) balanceField.value = String(Math.round(Number(balanceInput.value) || 0));
  }

  if (currentRateInput && currentRateDisplay) {
    currentRateDisplay.textContent = formatPercent(Number(currentRateInput.value));
    updateRangeFill(currentRateInput);
    if (currentRateField) {
      currentRateField.value = formatNumber(Number(currentRateInput.value) || 0, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      });
    }
  }

  if (newRateInput && newRateDisplay) {
    newRateDisplay.textContent = formatPercent(Number(newRateInput.value));
    updateRangeFill(newRateInput);
    if (newRateField) {
      newRateField.value = formatNumber(Number(newRateInput.value) || 0, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      });
    }
  }

  if (termInput && termDisplay) {
    termDisplay.textContent = `${formatWhole(Number(termInput.value))} yrs`;
    updateRangeFill(termInput);
    if (termField) termField.value = String(Math.round(Number(termInput.value) || 0));
  }

  if (changeMonthsInput && changeMonthsDisplay) {
    changeMonthsDisplay.textContent = `${formatWhole(Number(changeMonthsInput.value))} mo`;
    updateRangeFill(changeMonthsInput);
    if (changeMonthsField) {
      changeMonthsField.value = String(Math.round(Number(changeMonthsInput.value) || 0));
    }
  }
}

function applyView(view) {
  const showMonthly = view === 'monthly';
  monthlyTableWrap?.classList.toggle('is-hidden', !showMonthly);
  yearlyTableWrap?.classList.toggle('is-hidden', showMonthly);
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
  if (resultNote) {
    resultNote.textContent =
      'Adjust the balance, rate, term, or timing, then calculate again to refresh the rate-change summary.';
  }
  clearTables();
}

function updateSnapshot(data, changeTiming) {
  if (!data) {
    return;
  }

  const changeText =
    changeTiming === 'after'
      ? `After ${formatWhole(Number(changeMonthsInput?.value ?? 0))} months`
      : 'Apply Immediately';

  if (snapshotCurrentPayment)
    snapshotCurrentPayment.textContent = formatMoney(data.baselinePayment);
  if (snapshotNewPayment) snapshotNewPayment.textContent = formatMoney(data.newPayment);
  if (snapshotMonthlyDiff) snapshotMonthlyDiff.textContent = formatMoney(data.monthlyDifference);
  if (snapshotAnnualDiff) snapshotAnnualDiff.textContent = formatMoney(data.annualDifference);
  if (snapshotInterestBase)
    snapshotInterestBase.textContent = formatMoney(data.totalInterestBaseline);
  if (snapshotInterestNew) snapshotInterestNew.textContent = formatMoney(data.totalInterestNew);
  if (snapshotInterestChange) {
    snapshotInterestChange.textContent = formatMoney(
      data.totalInterestNew - data.totalInterestBaseline
    );
  }
  if (snapshotTiming) snapshotTiming.textContent = changeText;
}

function updateLifetime(data) {
  if (!data) {
    return;
  }

  const baselineInterest = Math.max(0, data.totalInterestBaseline);
  const newInterest = Math.max(0, data.totalInterestNew);
  const interestChange = data.totalInterestNew - data.totalInterestBaseline;

  const total = baselineInterest + newInterest;
  const baselineShare = total > 0 ? (baselineInterest / total) * 100 : 50;
  const newShare = Math.max(0, 100 - baselineShare);

  if (lifetimeDonut) {
    lifetimeDonut.style.setProperty('--principal-share', `${baselineShare}%`);
  }
  if (lifetimeBaseShare) {
    lifetimeBaseShare.textContent = `${formatNumber(baselineShare, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })}%`;
  }
  if (lifetimeNewShare) {
    lifetimeNewShare.textContent = `${formatNumber(newShare, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })}%`;
  }

  if (lifetimeBaseInterest) lifetimeBaseInterest.textContent = formatMoney(baselineInterest);
  if (lifetimeNewInterest) lifetimeNewInterest.textContent = formatMoney(newInterest);
  if (lifetimeInterestChange) lifetimeInterestChange.textContent = formatMoney(interestChange);

  const changeLabel = interestChange >= 0 ? 'increases' : 'reduces';
  if (lifetimeSummary) {
    lifetimeSummary.textContent =
      `The new scenario ${changeLabel} lifetime interest by ${formatMoney(Math.abs(interestChange))} ` +
      `versus the baseline schedule.`;
  }
}

function renderMonthlyTable(data) {
  if (!monthlyTableBody) {
    return;
  }

  const count = Math.max(data.paymentTimelineBaseline.length, data.paymentTimelineNew.length);
  monthlyTableBody.innerHTML = Array.from({ length: count }, (_, index) => {
    const base = data.paymentTimelineBaseline[index] ?? 0;
    const updated = data.paymentTimelineNew[index] ?? base;
    const diff = updated - base;

    return `<tr>
      <td>${index + 1}</td>
      <td>${formatMoney(base)}</td>
      <td>${formatMoney(updated)}</td>
      <td>${formatMoney(diff)}</td>
    </tr>`;
  }).join('');
}

function renderYearlyTable(data) {
  if (!yearlyTableBody) {
    return;
  }

  const count = Math.max(data.yearlyBaseline.length, data.yearlyNew.length);
  yearlyTableBody.innerHTML = Array.from({ length: count }, (_, index) => {
    const base = data.yearlyBaseline[index] ?? {
      year: index + 1,
      interest: 0,
      payment: 0,
      balance: 0,
    };
    const updated = data.yearlyNew[index] ?? base;

    return `<tr>
      <td>${base.year ?? index + 1}</td>
      <td>${formatMoney(base.interest)}</td>
      <td>${formatMoney(updated.interest)}</td>
      <td>${formatMoney(base.payment)}</td>
      <td>${formatMoney(updated.payment)}</td>
      <td>${formatMoney(base.balance)}</td>
      <td>${formatMoney(updated.balance)}</td>
    </tr>`;
  }).join('');
}

function calculate(options = {}) {
  const shouldReveal = options.reveal === true;

  if (!resultDiv || !summaryDiv) {
    return;
  }

  resultDiv.textContent = '';
  summaryDiv.textContent = '';
  clearTables();

  const balance = Number(balanceInput?.value);
  if (!Number.isFinite(balance) || balance <= 0) {
    setError('Enter a loan balance greater than 0.');
    if (shouldReveal) {
      revealResultPanel({ resultPanel: resultDashboard, focusTarget: resultDiv });
    }
    return;
  }

  const currentRate = Number(currentRateInput?.value);
  if (!Number.isFinite(currentRate) || currentRate < 0) {
    setError('Current rate must be 0 or more.');
    if (shouldReveal) {
      revealResultPanel({ resultPanel: resultDashboard, focusTarget: resultDiv });
    }
    return;
  }

  const newRate = Number(newRateInput?.value);
  if (!Number.isFinite(newRate) || newRate < 0) {
    setError('New rate must be 0 or more.');
    if (shouldReveal) {
      revealResultPanel({ resultPanel: resultDashboard, focusTarget: resultDiv });
    }
    return;
  }

  const termYears = Number(termInput?.value);
  if (!Number.isFinite(termYears) || termYears < 1) {
    setError('Remaining term must be at least 1 year.');
    if (shouldReveal) {
      revealResultPanel({ resultPanel: resultDashboard, focusTarget: resultDiv });
    }
    return;
  }

  const changeTiming = timingButtons?.getValue() ?? 'immediate';
  const termMonths = Math.round(termYears * 12);
  const changeAfterMonths = Number(changeMonthsInput?.value);

  if (changeTiming === 'after') {
    if (!Number.isFinite(changeAfterMonths) || changeAfterMonths < 1) {
      setError('Change timing months must be at least 1.');
      if (shouldReveal) {
        revealResultPanel({ resultPanel: resultDashboard, focusTarget: resultDiv });
      }
      return;
    }
    if (changeAfterMonths > termMonths) {
      setError('Change timing months must be within the remaining term.');
      if (shouldReveal) {
        revealResultPanel({ resultPanel: resultDashboard, focusTarget: resultDiv });
      }
      return;
    }
  }

  const data = calculateInterestRateChange({
    balance,
    currentRate,
    newRate,
    termYears,
    changeTiming,
    changeAfterMonths,
  });

  resultDiv.innerHTML =
    '<strong>New Monthly Payment</strong>' +
    `<span class="mtg-result-value">${formatMoney(data.newPayment)}</span>` +
    `<p class="mtg-result-sub">Baseline payment: ${formatMoney(data.baselinePayment)}</p>`;

  const resultValue = resultDiv.querySelector('.mtg-result-value');
  if (resultValue) {
    resultValue.classList.remove('is-updated');
    void resultValue.offsetWidth;
    resultValue.classList.add('is-updated');
  }

  summaryDiv.innerHTML =
    `<p><strong>Monthly difference:</strong> ${formatMoney(data.monthlyDifference)}</p>` +
    `<p><strong>Annual difference:</strong> ${formatMoney(data.annualDifference)}</p>` +
    `<p><strong>Total interest change:</strong> ${formatMoney(
      data.totalInterestNew - data.totalInterestBaseline
    )}</p>`;

  if (resultNote) {
    const monthlyDirection = data.monthlyDifference >= 0 ? 'raises' : 'reduces';
    const interestChange = data.totalInterestNew - data.totalInterestBaseline;
    const interestDirection = interestChange >= 0 ? 'adds' : 'cuts';
    const timingText =
      changeTiming === 'after'
        ? `after ${formatWhole(changeAfterMonths)} months`
        : 'immediately';

    resultNote.textContent =
      `${timingText.charAt(0).toUpperCase()}${timingText.slice(1)} ${monthlyDirection} your payment by ` +
      `${formatMoney(Math.abs(data.monthlyDifference))} a month and ${interestDirection} ` +
      `${formatMoney(Math.abs(interestChange))} of lifetime interest.`;
  }

  updateSnapshot(data, changeTiming);
  updateLifetime(data);
  renderMonthlyTable(data);
  renderYearlyTable(data);
  applyView(tableViewButtons?.getValue() ?? 'yearly');

  if (shouldReveal) {
    revealResultPanel({ resultPanel: resultDashboard, focusTarget: resultDiv });
  }
}

[
  {
    rangeInput: balanceInput,
    textInput: balanceField,
    formatFieldValue: (value) => String(Math.round(value)),
  },
  {
    rangeInput: currentRateInput,
    textInput: currentRateField,
    formatFieldValue: (value) =>
      formatNumber(value, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }),
  },
  {
    rangeInput: newRateInput,
    textInput: newRateField,
    formatFieldValue: (value) =>
      formatNumber(value, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }),
  },
  {
    rangeInput: termInput,
    textInput: termField,
    formatFieldValue: (value) => String(Math.round(value)),
  },
  {
    rangeInput: changeMonthsInput,
    textInput: changeMonthsField,
    formatFieldValue: (value) => String(Math.round(value)),
  },
].forEach((config) => {
  wireRangeWithField({
    ...config,
    parseFieldValue: parseLooseNumber,
    onVisualUpdate: updateSliderDisplays,
  });
});

calculateButton?.addEventListener('click', () => calculate({ reveal: true }));

changeMonthsRow?.classList.toggle(
  'is-hidden',
  (timingButtons?.getValue() ?? 'immediate') !== 'after'
);
updateSliderDisplays();
applyView(tableViewButtons?.getValue() ?? 'yearly');
calculate({ reveal: false });
