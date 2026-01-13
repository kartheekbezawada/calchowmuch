/**
 * Percentage Tools Module
 * Button-driven multi-calculator page with tab switching
 */

import { percentageChange, percentOf, divide, multiply } from '/assets/js/core/math.js';
import { formatNumber, formatPercent } from '/assets/js/core/format.js';
import { toNumber } from '/assets/js/core/validate.js';

// Tool keys (must match data-tool attributes)
const TOOLS = ['percent-change', 'percentage-of', 'what-percent', 'add-subtract'];
const DEFAULT_TOOL = TOOLS[0];

// DOM Elements - Tabs
const toolTabs = document.querySelectorAll('.tool-tab[data-tool]');
const calcCards = document.querySelectorAll('.calc-card[data-tool]');
const explanationBlocks = document.querySelectorAll('.explanation-block[data-tool]');

// ============================================================
// TAB SWITCHING LOGIC
// ============================================================

/**
 * Activate a specific tool by its key
 * @param {string} toolKey - The tool key to activate
 */
function activateTool(toolKey) {
  // Validate tool key
  if (!TOOLS.includes(toolKey)) {
    toolKey = DEFAULT_TOOL;
  }

  // Update tab buttons
  toolTabs.forEach((tab) => {
    const isActive = tab.dataset.tool === toolKey;
    tab.classList.toggle('is-active', isActive);
    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  // Update calculator cards visibility
  calcCards.forEach((card) => {
    const isActive = card.dataset.tool === toolKey;
    if (isActive) {
      card.removeAttribute('hidden');
    } else {
      card.setAttribute('hidden', '');
    }
  });

  // Update explanation blocks visibility
  explanationBlocks.forEach((block) => {
    const isActive = block.dataset.tool === toolKey;
    if (isActive) {
      block.removeAttribute('hidden');
    } else {
      block.setAttribute('hidden', '');
    }
  });

  // Update URL hash (without scrolling)
  if (window.location.hash !== `#${toolKey}`) {
    history.replaceState(null, '', `#${toolKey}`);
  }
}

/**
 * Get tool key from URL hash or return default
 * @returns {string} Tool key
 */
function getToolFromHash() {
  const hash = window.location.hash.slice(1);
  return TOOLS.includes(hash) ? hash : DEFAULT_TOOL;
}

// Initialize tab click handlers
toolTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const toolKey = tab.dataset.tool;
    activateTool(toolKey);
  });
});

// Handle browser back/forward navigation
window.addEventListener('hashchange', () => {
  activateTool(getToolFromHash());
});

// ============================================================
// CALCULATOR 1: PERCENT CHANGE
// ============================================================

const pcStartInput = document.getElementById('pc-start');
const pcEndInput = document.getElementById('pc-end');
const pcButton = document.getElementById('pc-calculate');
const pcResult = document.getElementById('pc-result');
const pcDetails = document.getElementById('pc-details');

function calculatePercentChange() {
  const startValue = toNumber(pcStartInput.value);
  const endValue = toNumber(pcEndInput.value);

  // Clear previous error state
  pcDetails.classList.remove('error');

  // Validation
  if (startValue === null || pcStartInput.value.trim() === '') {
    pcResult.textContent = '';
    pcDetails.textContent = 'Please enter a valid starting value.';
    pcDetails.classList.add('error');
    return;
  }

  if (endValue === null || pcEndInput.value.trim() === '') {
    pcResult.textContent = '';
    pcDetails.textContent = 'Please enter a valid ending value.';
    pcDetails.classList.add('error');
    return;
  }

  if (startValue === 0) {
    pcResult.textContent = '';
    pcDetails.textContent = 'Starting value cannot be zero (division by zero).';
    pcDetails.classList.add('error');
    return;
  }

  // Calculate
  const change = percentageChange(startValue, endValue);
  const difference = endValue - startValue;
  const direction = change >= 0 ? 'increase' : 'decrease';
  const sign = change >= 0 ? '+' : '';

  pcResult.textContent = `${sign}${formatPercent(change, { maximumFractionDigits: 2 })}`;
  pcDetails.textContent = `That is a ${direction} of ${formatNumber(Math.abs(difference), { maximumFractionDigits: 2 })} from the starting value.`;
}

pcButton.addEventListener('click', calculatePercentChange);

// ============================================================
// CALCULATOR 2: PERCENTAGE OF
// ============================================================

const poPercentInput = document.getElementById('po-percent');
const poValueInput = document.getElementById('po-value');
const poButton = document.getElementById('po-calculate');
const poResult = document.getElementById('po-result');
const poDetails = document.getElementById('po-details');

function calculatePercentageOf() {
  const percent = toNumber(poPercentInput.value);
  const value = toNumber(poValueInput.value);

  // Clear previous error state
  poDetails.classList.remove('error');

  // Validation
  if (percent === null || poPercentInput.value.trim() === '') {
    poResult.textContent = '';
    poDetails.textContent = 'Please enter a valid percentage.';
    poDetails.classList.add('error');
    return;
  }

  if (value === null || poValueInput.value.trim() === '') {
    poResult.textContent = '';
    poDetails.textContent = 'Please enter a valid value.';
    poDetails.classList.add('error');
    return;
  }

  // Calculate
  const result = percentOf(percent, value);

  poResult.textContent = formatNumber(result, { maximumFractionDigits: 4 });
  poDetails.textContent = `${formatPercent(percent, { maximumFractionDigits: 2 })} of ${formatNumber(value, { maximumFractionDigits: 2 })} equals ${formatNumber(result, { maximumFractionDigits: 4 })}.`;
}

poButton.addEventListener('click', calculatePercentageOf);

// ============================================================
// CALCULATOR 3: X IS WHAT PERCENT OF Y
// ============================================================

const wpXInput = document.getElementById('wp-x');
const wpYInput = document.getElementById('wp-y');
const wpButton = document.getElementById('wp-calculate');
const wpResult = document.getElementById('wp-result');
const wpDetails = document.getElementById('wp-details');

function calculateWhatPercent() {
  const x = toNumber(wpXInput.value);
  const y = toNumber(wpYInput.value);

  // Clear previous error state
  wpDetails.classList.remove('error');

  // Validation
  if (x === null || wpXInput.value.trim() === '') {
    wpResult.textContent = '';
    wpDetails.textContent = 'Please enter a valid value for X.';
    wpDetails.classList.add('error');
    return;
  }

  if (y === null || wpYInput.value.trim() === '') {
    wpResult.textContent = '';
    wpDetails.textContent = 'Please enter a valid value for Y.';
    wpDetails.classList.add('error');
    return;
  }

  if (y === 0) {
    wpResult.textContent = '';
    wpDetails.textContent = 'Y cannot be zero (division by zero).';
    wpDetails.classList.add('error');
    return;
  }

  // Calculate: (x / y) * 100
  const quotient = divide(x, y);
  const percentage = multiply(quotient, 100);

  wpResult.textContent = formatPercent(percentage, { maximumFractionDigits: 4 });
  wpDetails.textContent = `${formatNumber(x, { maximumFractionDigits: 2 })} is ${formatPercent(percentage, { maximumFractionDigits: 4 })} of ${formatNumber(y, { maximumFractionDigits: 2 })}.`;
}

wpButton.addEventListener('click', calculateWhatPercent);

// ============================================================
// CALCULATOR 4: ADD/SUBTRACT PERCENTAGE
// ============================================================

const asValueInput = document.getElementById('as-value');
const asPercentInput = document.getElementById('as-percent');
const asButton = document.getElementById('as-calculate');
const asResult = document.getElementById('as-result');
const asDetails = document.getElementById('as-details');

function calculateAddSubtract() {
  const value = toNumber(asValueInput.value);
  const percent = toNumber(asPercentInput.value);
  const operation = document.querySelector('input[name="as-operation"]:checked').value;

  // Clear previous error state
  asDetails.classList.remove('error');

  // Validation
  if (value === null || asValueInput.value.trim() === '') {
    asResult.textContent = '';
    asDetails.textContent = 'Please enter a valid value.';
    asDetails.classList.add('error');
    return;
  }

  if (percent === null || asPercentInput.value.trim() === '') {
    asResult.textContent = '';
    asDetails.textContent = 'Please enter a valid percentage.';
    asDetails.classList.add('error');
    return;
  }

  // Calculate
  const percentAmount = percentOf(percent, value);
  let result;
  let actionWord;

  if (operation === 'add') {
    result = value + percentAmount;
    actionWord = 'Adding';
  } else {
    result = value - percentAmount;
    actionWord = 'Subtracting';
  }

  asResult.textContent = formatNumber(result, { maximumFractionDigits: 4 });
  asDetails.textContent = `${actionWord} ${formatPercent(percent, { maximumFractionDigits: 2 })} (${formatNumber(percentAmount, { maximumFractionDigits: 4 })}) ${operation === 'add' ? 'to' : 'from'} ${formatNumber(value, { maximumFractionDigits: 2 })} gives ${formatNumber(result, { maximumFractionDigits: 4 })}.`;
}

asButton.addEventListener('click', calculateAddSubtract);

// ============================================================
// INITIALIZATION
// ============================================================

// Activate tool based on URL hash or default
activateTool(getToolFromHash());

// Run initial calculations for all calculators (shows default values result)
calculatePercentChange();
calculatePercentageOf();
calculateWhatPercent();
calculateAddSubtract();
