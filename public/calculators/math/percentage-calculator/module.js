import { formatNumber } from "/assets/js/core/format.js";
import { toNumber } from "/assets/js/core/validate.js";

// Mode switching
const modeButtons = document.querySelectorAll(".mode-button");
const inputSections = document.querySelectorAll(".input-section");
const resultDiv = document.querySelector("#percentage-result");

// Input elements for each mode
const increaseInputs = {
  original: document.querySelector("#increase-original"),
  new: document.querySelector("#increase-new"),
};

const decreaseInputs = {
  original: document.querySelector("#decrease-original"),
  new: document.querySelector("#decrease-new"),
};

const whatPercentInputs = {
  part: document.querySelector("#what-percent-part"),
  whole: document.querySelector("#what-percent-whole"),
};

const percentOfInputs = {
  percent: document.querySelector("#percent-of-percent"),
  base: document.querySelector("#percent-of-base"),
};

// Calculate buttons
const calculateButtons = document.querySelectorAll(".calculate");

// Mode switching functionality
function switchMode(mode) {
  // Update button states
  modeButtons.forEach(btn => {
    const isActive = btn.dataset.mode === mode;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-selected", isActive);
  });

  // Update input section visibility
  inputSections.forEach(section => {
    section.classList.toggle("active", section.dataset.mode === mode);
  });

  // Clear result
  resultDiv.innerHTML = "";
}

// Calculation functions
function calculateIncrease() {
  const original = toNumber(increaseInputs.original.value);
  const newValue = toNumber(increaseInputs.new.value);

  if (original === 0) {
    resultDiv.innerHTML = `<div style="color: #dc2626;">Cannot calculate: original value is zero.</div>`;
    return;
  }

  const increaseAmount = newValue - original;
  const percentIncrease = (increaseAmount / original) * 100;

  resultDiv.innerHTML = `
    <div>Increase: ${formatNumber(increaseAmount, { maximumFractionDigits: 2 })}</div>
    <div class="result-detail">Percentage increase: ${formatNumber(percentIncrease, { maximumFractionDigits: 2 })}%</div>
  `;
}

function calculateDecrease() {
  const original = toNumber(decreaseInputs.original.value);
  const newValue = toNumber(decreaseInputs.new.value);

  if (original === 0) {
    resultDiv.innerHTML = `<div style="color: #dc2626;">Cannot calculate: original value is zero.</div>`;
    return;
  }

  const decreaseAmount = original - newValue;
  const percentDecrease = (decreaseAmount / original) * 100;

  resultDiv.innerHTML = `
    <div>Decrease: ${formatNumber(decreaseAmount, { maximumFractionDigits: 2 })}</div>
    <div class="result-detail">Percentage decrease: ${formatNumber(percentDecrease, { maximumFractionDigits: 2 })}%</div>
  `;
}

function calculateWhatPercent() {
  const part = toNumber(whatPercentInputs.part.value);
  const whole = toNumber(whatPercentInputs.whole.value);

  if (whole === 0) {
    resultDiv.innerHTML = `<div style="color: #dc2626;">Cannot calculate: whole value is zero (division by zero).</div>`;
    return;
  }

  const percent = (part / whole) * 100;

  resultDiv.innerHTML = `
    <div>${formatNumber(part, { maximumFractionDigits: 2 })} is ${formatNumber(percent, { maximumFractionDigits: 2 })}% of ${formatNumber(whole, { maximumFractionDigits: 2 })}</div>
  `;
}

function calculatePercentOf() {
  const percent = toNumber(percentOfInputs.percent.value);
  const base = toNumber(percentOfInputs.base.value);

  const result = (percent / 100) * base;

  resultDiv.innerHTML = `
    <div>${formatNumber(percent, { maximumFractionDigits: 2 })}% of ${formatNumber(base, { maximumFractionDigits: 2 })} = ${formatNumber(result, { maximumFractionDigits: 2 })}</div>
  `;
}

// Event listeners for mode buttons
modeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    switchMode(btn.dataset.mode);
  });
});

// Event listeners for calculate buttons
calculateButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const mode = btn.dataset.calculate;
    switch (mode) {
      case "increase":
        calculateIncrease();
        break;
      case "decrease":
        calculateDecrease();
        break;
      case "what-percent":
        calculateWhatPercent();
        break;
      case "percent-of":
        calculatePercentOf();
        break;
    }
  });
});

// Initialize with first calculation
calculateIncrease();
