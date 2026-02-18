import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import { setPageMetadata, setupButtonGroup } from '/assets/js/core/ui.js';
import { calculateLtv } from '/assets/js/core/loan-utils.js';

const metadata = {
  title: 'Loan-to-Value (LTV) Calculator | LTV Bands | CalcHowMuch',
  description:
    'Calculate mortgage loan-to-value instantly using property value and either loan amount or deposit, then view risk bands and target LTV levels.',
  canonical: 'https://calchowmuch.com/loan-calculators/ltv-calculator/',
};

setPageMetadata(metadata);

const BUCKET_TO_KEY = {
  '60% or lower': 'up-to-60',
  'Up to 75%': 'up-to-75',
  'Up to 80%': 'up-to-80',
  'Up to 85%': 'up-to-85',
  'Up to 90%': 'up-to-90',
  'Up to 95%': 'up-to-95',
  'Above 95%': 'above-95',
};

const TARGET_LTV_LEVELS = [95, 90, 85, 80, 75, 60];

const propertyInput = document.querySelector('#ltv-property');
const loanInput = document.querySelector('#ltv-loan');
const depositAmountInput = document.querySelector('#ltv-deposit-amount');
const depositPercentInput = document.querySelector('#ltv-deposit-percent');

const propertyDisplay = document.querySelector('#ltv-property-display');
const loanDisplay = document.querySelector('#ltv-loan-display');
const depositAmountDisplay = document.querySelector('#ltv-deposit-amount-display');
const depositPercentDisplay = document.querySelector('#ltv-deposit-percent-display');

const loanRow = document.querySelector('#ltv-loan-row');
const depositTypeRow = document.querySelector('#ltv-deposit-type-row');
const depositAmountRow = document.querySelector('#ltv-deposit-amount-row');
const depositPercentRow = document.querySelector('#ltv-deposit-percent-row');

const calculateButton = document.querySelector('#ltv-calculate');
const resultDiv = document.querySelector('#ltv-result');
const summaryDiv = document.querySelector('#ltv-summary');

const modeGroup = document.querySelector('[data-button-group="ltv-mode"]');
const depositTypeGroup = document.querySelector('[data-button-group="ltv-deposit-type"]');
const tableViewGroup = document.querySelector('[data-button-group="ltv-table-view"]');

const bandsWrap = document.querySelector('#ltv-table-bands-wrap');
const targetsWrap = document.querySelector('#ltv-table-targets-wrap');
const targetBody = document.querySelector('#ltv-target-body');
const bandRows = Array.from(document.querySelectorAll('.ltv-band-row'));

const riskPills = Array.from(document.querySelectorAll('.ltv-risk-pill'));
const statusPills = Array.from(document.querySelectorAll('.ltv-status-pill'));

let tableView = 'bands';

const modeButtons = setupButtonGroup(modeGroup, {
  defaultValue: 'loan',
  onChange: (value) => {
    setModeVisibility(value);
    calculate();
  },
});

const depositTypeButtons = setupButtonGroup(depositTypeGroup, {
  defaultValue: 'amount',
  onChange: (value) => {
    setDepositTypeVisibility(value);
    calculate();
  },
});

const tableViewButtons = setupButtonGroup(tableViewGroup, {
  defaultValue: 'bands',
  onChange: (value) => {
    tableView = value;
    applyTableView(value);
  },
});

if (tableViewButtons?.getValue()) {
  tableView = tableViewButtons.getValue();
}

function fmtAmount(value, options = {}) {
  if (!Number.isFinite(value)) {
    return '--';
  }
  return formatNumber(value, {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    ...options,
  });
}

function fmtPercentInput(value) {
  if (!Number.isFinite(value)) {
    return '--';
  }
  return `${formatNumber(value, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}%`;
}

function setByAttr(name, value) {
  document.querySelectorAll(`[data-ltv="${name}"]`).forEach((node) => {
    node.textContent = value;
  });
}

function clampValue(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function updateSliderFill(input) {
  if (!input || input.type !== 'range') {
    return;
  }
  const min = parseFloat(input.min) || 0;
  const max = parseFloat(input.max) || 100;
  const value = parseFloat(input.value) || 0;
  const percent = max > min ? ((value - min) / (max - min)) * 100 : 0;
  input.style.setProperty('--fill', `${percent}%`);
}

function syncBounds() {
  const propertyValue = Number(propertyInput?.value);
  if (!Number.isFinite(propertyValue) || propertyValue <= 0) {
    return;
  }

  if (loanInput) {
    loanInput.max = String(propertyValue);
    loanInput.value = String(clampValue(Number(loanInput.value), 0, propertyValue));
  }

  if (depositAmountInput) {
    depositAmountInput.max = String(propertyValue);
    depositAmountInput.value = String(
      clampValue(Number(depositAmountInput.value), 0, propertyValue)
    );
  }
}

function updateSliderDisplays() {
  if (propertyInput && propertyDisplay) {
    propertyDisplay.textContent = fmtAmount(Number(propertyInput.value));
    updateSliderFill(propertyInput);
  }

  if (loanInput && loanDisplay) {
    loanDisplay.textContent = fmtAmount(Number(loanInput.value));
    updateSliderFill(loanInput);
  }

  if (depositAmountInput && depositAmountDisplay) {
    depositAmountDisplay.textContent = fmtAmount(Number(depositAmountInput.value));
    updateSliderFill(depositAmountInput);
  }

  if (depositPercentInput && depositPercentDisplay) {
    depositPercentDisplay.textContent = fmtPercentInput(Number(depositPercentInput.value));
    updateSliderFill(depositPercentInput);
  }
}

function setModeVisibility(mode) {
  const showLoan = mode === 'loan';
  const depositType = depositTypeButtons?.getValue() ?? 'amount';

  loanRow?.classList.toggle('is-hidden', !showLoan);
  depositTypeRow?.classList.toggle('is-hidden', showLoan);
  depositAmountRow?.classList.toggle('is-hidden', showLoan || depositType !== 'amount');
  depositPercentRow?.classList.toggle('is-hidden', showLoan || depositType !== 'percent');
}

function setDepositTypeVisibility(type) {
  if ((modeButtons?.getValue() ?? 'loan') === 'loan') {
    depositAmountRow?.classList.add('is-hidden');
    depositPercentRow?.classList.add('is-hidden');
    return;
  }

  depositAmountRow?.classList.toggle('is-hidden', type !== 'amount');
  depositPercentRow?.classList.toggle('is-hidden', type !== 'percent');
}

function getRiskProfile(ltv) {
  if (ltv <= 60) {
    return {
      level: 'Very Low',
      tone: 'very-low',
      note: 'Strong equity position with broad lender and pricing options.',
    };
  }
  if (ltv <= 75) {
    return {
      level: 'Low',
      tone: 'low',
      note: 'Healthy equity with strong product availability.',
    };
  }
  if (ltv <= 80) {
    return {
      level: 'Moderate',
      tone: 'moderate',
      note: 'Common mortgage band with balanced pricing and access.',
    };
  }
  if (ltv <= 85) {
    return {
      level: 'Elevated',
      tone: 'elevated',
      note: 'Availability narrows as lender risk increases.',
    };
  }
  if (ltv <= 90) {
    return {
      level: 'High',
      tone: 'high',
      note: 'Options become limited and affordability checks tighten.',
    };
  }
  if (ltv <= 95) {
    return {
      level: 'Very High',
      tone: 'very-high',
      note: 'Restricted market with higher pricing pressure.',
    };
  }
  return {
    level: 'Highest',
    tone: 'highest',
    note: 'Very high-risk zone where available products can be rare.',
  };
}

function highlightBandRow(bucket) {
  const activeKey = BUCKET_TO_KEY[bucket] ?? '';
  bandRows.forEach((row) => {
    row.classList.toggle('is-active', row.dataset.bandKey === activeKey);
  });
}

function renderTargetRows(data) {
  if (!targetBody) {
    return;
  }

  targetBody.innerHTML = TARGET_LTV_LEVELS.map((targetLtv) => {
    const requiredDeposit = data.propertyValue * (1 - targetLtv / 100);
    const extraDepositNeeded = Math.max(0, requiredDeposit - data.depositAmount);
    const reached = data.ltv <= targetLtv;

    return `<tr class="${reached ? 'ltv-target-row--met' : 'ltv-target-row--pending'}">
      <td>${formatPercent(targetLtv)}</td>
      <td>${fmtAmount(requiredDeposit)}</td>
      <td>${fmtAmount(extraDepositNeeded)}</td>
      <td>${reached ? 'Reached' : 'Increase deposit'}</td>
    </tr>`;
  }).join('');
}

function applyTableView(view) {
  const showBands = view === 'bands';
  bandsWrap?.classList.toggle('is-hidden', !showBands);
  targetsWrap?.classList.toggle('is-hidden', showBands);
}

function clearBoundValues() {
  const clearKeys = [
    'property',
    'loan',
    'deposit',
    'loan-share',
    'equity-share',
    'lifetime-summary',
    'band-marker',
    'snapshot-property',
    'snapshot-loan',
    'snapshot-deposit',
    'snapshot-deposit-percent',
    'snapshot-ltv',
    'snapshot-bucket',
    'snapshot-risk',
    'snapshot-high-risk',
  ];

  clearKeys.forEach((key) => setByAttr(key, '--'));

  riskPills.forEach((pill) => {
    delete pill.dataset.tone;
  });

  statusPills.forEach((pill) => {
    pill.classList.remove('is-high');
  });

  const donut = document.querySelector('[data-ltv="share-donut"]');
  donut?.style.setProperty('--principal-share', '0%');
}

function setError(message) {
  if (resultDiv) {
    resultDiv.textContent = message;
  }

  if (summaryDiv) {
    summaryDiv.textContent = '';
  }

  highlightBandRow('');
  if (targetBody) {
    targetBody.innerHTML = '';
  }
  clearBoundValues();
}

function updateExplanation(data, riskProfile) {
  setByAttr('property', fmtAmount(data.propertyValue));
  setByAttr('loan', fmtAmount(data.loanAmount));
  setByAttr('deposit', fmtAmount(data.depositAmount));
  setByAttr('loan-share', formatPercent(data.ltv));
  setByAttr('equity-share', formatPercent(data.depositPercent));

  setByAttr('snapshot-property', fmtAmount(data.propertyValue));
  setByAttr('snapshot-loan', fmtAmount(data.loanAmount));
  setByAttr('snapshot-deposit', fmtAmount(data.depositAmount));
  setByAttr('snapshot-deposit-percent', formatPercent(data.depositPercent));
  setByAttr('snapshot-ltv', formatPercent(data.ltv));
  setByAttr('snapshot-bucket', data.bucket);
  setByAttr('snapshot-risk', riskProfile.level);

  const statusText = data.highRisk ? 'High-Risk Zone' : 'Within Typical Range';
  setByAttr('snapshot-high-risk', statusText);

  riskPills.forEach((pill) => {
    pill.dataset.tone = riskProfile.tone;
  });

  statusPills.forEach((pill) => {
    pill.classList.toggle('is-high', data.highRisk);
  });

  setByAttr(
    'lifetime-summary',
    `At ${formatPercent(data.ltv)} LTV, ${formatPercent(data.depositPercent)} of the property value is funded by deposit/equity. ${riskProfile.note}`
  );

  setByAttr(
    'band-marker',
    `Current position: ${formatPercent(data.ltv)} (${data.bucket}). ${riskProfile.note}`
  );

  const donut = document.querySelector('[data-ltv="share-donut"]');
  donut?.style.setProperty('--principal-share', `${clampValue(data.ltv, 0, 100)}%`);

  highlightBandRow(data.bucket);
  renderTargetRows(data);
}

function calculate() {
  if (!resultDiv || !summaryDiv) {
    return;
  }

  resultDiv.textContent = '';
  summaryDiv.textContent = '';

  const propertyValue = Number(propertyInput?.value);
  if (!Number.isFinite(propertyValue) || propertyValue <= 0) {
    setError('Property value must be greater than 0.');
    return;
  }

  const mode = modeButtons?.getValue() ?? 'loan';
  const depositType = depositTypeButtons?.getValue() ?? 'amount';

  const loanAmount = Number(loanInput?.value);
  const depositAmount = Number(depositAmountInput?.value);
  const depositPercent = Number(depositPercentInput?.value);

  if (mode === 'loan') {
    if (!Number.isFinite(loanAmount) || loanAmount <= 0 || loanAmount >= propertyValue) {
      setError('Loan amount must be greater than 0 and less than the property value.');
      return;
    }
  } else if (depositType === 'amount') {
    if (!Number.isFinite(depositAmount) || depositAmount < 0 || depositAmount >= propertyValue) {
      setError('Deposit amount must be between 0 and the property value.');
      return;
    }
  } else if (!Number.isFinite(depositPercent) || depositPercent < 0 || depositPercent >= 100) {
    setError('Deposit percent must be between 0 and 100.');
    return;
  }

  const data = calculateLtv({
    propertyValue,
    mode,
    loanAmount,
    depositType,
    depositAmount,
    depositPercent,
  });

  if (data.loanAmount <= 0) {
    setError('Loan amount must be greater than 0.');
    return;
  }

  if (loanInput) {
    loanInput.value = String(clampValue(data.loanAmount, 0, propertyValue));
  }
  if (depositAmountInput) {
    depositAmountInput.value = String(clampValue(data.depositAmount, 0, propertyValue));
  }
  if (depositPercentInput) {
    depositPercentInput.value = String(clampValue(data.depositPercent, 0, 99.9).toFixed(1));
  }

  syncBounds();
  updateSliderDisplays();

  const riskProfile = getRiskProfile(data.ltv);

  resultDiv.innerHTML =
    '<strong>Current LTV</strong>' +
    `<span class="mtg-result-value ltv-result-value">${formatPercent(data.ltv)}</span>`;

  const resultValue = resultDiv.querySelector('.ltv-result-value');
  if (resultValue) {
    resultValue.classList.remove('is-updated');
    void resultValue.offsetWidth;
    resultValue.classList.add('is-updated');
  }

  summaryDiv.innerHTML =
    `<p><strong>Band:</strong> ${data.bucket}</p>` +
    `<p><strong>Risk Level:</strong> ${riskProfile.level}</p>` +
    `<p>${data.highRisk ? 'Above 95% LTV is typically considered high risk and can limit options.' : 'You are within a commonly available LTV range.'}</p>`;

  updateExplanation(data, riskProfile);
  applyTableView(tableView);
}

let autoCalcTimer = null;
function debouncedCalculate() {
  clearTimeout(autoCalcTimer);
  autoCalcTimer = setTimeout(calculate, 80);
}

propertyInput?.addEventListener('input', () => {
  syncBounds();
  updateSliderDisplays();
  debouncedCalculate();
});

loanInput?.addEventListener('input', () => {
  updateSliderDisplays();
  debouncedCalculate();
});
depositAmountInput?.addEventListener('input', () => {
  updateSliderDisplays();
  debouncedCalculate();
});
depositPercentInput?.addEventListener('input', () => {
  updateSliderDisplays();
  debouncedCalculate();
});

calculateButton?.addEventListener('click', calculate);

setModeVisibility(modeButtons?.getValue() ?? 'loan');
setDepositTypeVisibility(depositTypeButtons?.getValue() ?? 'amount');
syncBounds();
updateSliderDisplays();
applyTableView(tableView);
calculate();
