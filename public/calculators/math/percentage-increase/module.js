import { percentOf, percentageChange } from "/assets/js/core/math.js";
import { formatNumber, formatPercent } from "/assets/js/core/format.js";
import { toNumber } from "/assets/js/core/validate.js";

const modeButtons = document.querySelectorAll(".mode-button");
const inputSections = document.querySelectorAll(".input-section");
const calcButtons = document.querySelectorAll("[data-calc]");
const result = document.querySelector("#percent-result");
const details = document.querySelector("#percent-details");

const explanationContainer = document.querySelector("[data-percent-explanation]");
const explanationSections = explanationContainer
  ? Array.from(explanationContainer.querySelectorAll("[data-mode]"))
  : [];

const inputs = {
  change: {
    start: document.querySelector("#percent-change-start"),
    end: document.querySelector("#percent-change-end"),
  },
  "percent-of": {
    rate: document.querySelector("#percent-of-rate"),
    value: document.querySelector("#percent-of-value"),
  },
  increase: {
    base: document.querySelector("#percent-increase-base"),
    rate: document.querySelector("#percent-increase-rate"),
  },
  decrease: {
    base: document.querySelector("#percent-decrease-base"),
    rate: document.querySelector("#percent-decrease-rate"),
  },
  "what-percent": {
    part: document.querySelector("#percent-what-part"),
    total: document.querySelector("#percent-what-total"),
  },
};

function safeFormatNumber(value, maximumFractionDigits = 2) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "N/A";
  }
  return formatNumber(value, { maximumFractionDigits });
}

function safeFormatPercent(value, maximumFractionDigits = 2, withSign = false) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "N/A";
  }
  const sign = withSign && value > 0 ? "+" : "";
  return `${sign}${formatPercent(value, { maximumFractionDigits })}`;
}

function setResult(text, detailText = "") {
  if (result) {
    result.textContent = text;
  }
  if (details) {
    details.textContent = detailText;
  }
}

function updateExplanationMode(mode) {
  if (!explanationSections.length) {
    return;
  }
  explanationSections.forEach(section => {
    section.hidden = section.dataset.mode !== mode;
  });
}

function updateExplanationFields(mode, fields) {
  if (!explanationSections.length) {
    return;
  }
  const section = explanationSections.find(item => item.dataset.mode === mode);
  if (!section) {
    return;
  }

  Object.entries(fields).forEach(([key, value]) => {
    section.querySelectorAll(`[data-field="${key}"]`).forEach(node => {
      node.textContent = value;
    });
  });
}

function switchMode(mode) {
  modeButtons.forEach(btn => {
    const isActive = btn.dataset.mode === mode;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-selected", isActive);
  });

  inputSections.forEach(section => {
    section.classList.toggle("active", section.dataset.mode === mode);
  });

  updateExplanationMode(mode);
}

function calculateChange() {
  const startValue = toNumber(inputs.change.start?.value);
  const endValue = toNumber(inputs.change.end?.value);
  const diff = endValue - startValue;
  const ratio = startValue === 0 ? null : diff / startValue;
  const changePercent = percentageChange(startValue, endValue);

  if (changePercent === null) {
    setResult("Result: Enter a starting value above 0.", "");
  } else {
    const signedPercent = safeFormatPercent(changePercent, 2, true);
    const direction = changePercent >= 0 ? "increase" : "decrease";
    setResult(
      `Result: ${signedPercent}`,
      `That is a ${direction} of ${safeFormatNumber(diff)} from the starting value.`,
    );
  }

  updateExplanationFields("change", {
    "change-start": safeFormatNumber(startValue),
    "change-end": safeFormatNumber(endValue),
    "change-diff": safeFormatNumber(diff),
    "change-ratio": safeFormatNumber(ratio, 4),
    "change-percent": safeFormatPercent(changePercent, 2, true),
  });
}

function calculatePercentOf() {
  const rate = toNumber(inputs["percent-of"].rate?.value);
  const value = toNumber(inputs["percent-of"].value?.value);
  const output = percentOf(rate, value);

  setResult(
    `Result: ${safeFormatNumber(output)}`,
    `${safeFormatPercent(rate)} of ${safeFormatNumber(value)} is ${safeFormatNumber(output)}.`,
  );

  updateExplanationFields("percent-of", {
    "of-rate": safeFormatPercent(rate),
    "of-decimal": safeFormatNumber(rate / 100, 4),
    "of-value": safeFormatNumber(value),
    "of-result": safeFormatNumber(output),
  });
}

function calculateIncrease() {
  const base = toNumber(inputs.increase.base?.value);
  const rate = toNumber(inputs.increase.rate?.value);
  const increaseAmount = percentOf(rate, base);
  const output = base + increaseAmount;

  setResult(
    `Result: ${safeFormatNumber(output)}`,
    `Increase amount: ${safeFormatNumber(increaseAmount)}.`,
  );

  updateExplanationFields("increase", {
    "inc-base": safeFormatNumber(base),
    "inc-rate": safeFormatPercent(rate),
    "inc-amount": safeFormatNumber(increaseAmount),
    "inc-result": safeFormatNumber(output),
  });
}

function calculateDecrease() {
  const base = toNumber(inputs.decrease.base?.value);
  const rate = toNumber(inputs.decrease.rate?.value);
  const decreaseAmount = percentOf(rate, base);
  const output = base - decreaseAmount;

  setResult(
    `Result: ${safeFormatNumber(output)}`,
    `Decrease amount: ${safeFormatNumber(decreaseAmount)}.`,
  );

  updateExplanationFields("decrease", {
    "dec-base": safeFormatNumber(base),
    "dec-rate": safeFormatPercent(rate),
    "dec-amount": safeFormatNumber(decreaseAmount),
    "dec-result": safeFormatNumber(output),
  });
}

function calculateWhatPercent() {
  const part = toNumber(inputs["what-percent"].part?.value);
  const total = toNumber(inputs["what-percent"].total?.value);

  if (total === 0) {
    setResult("Result: Enter a total value above 0.", "");
    updateExplanationFields("what-percent", {
      "what-part": safeFormatNumber(part),
      "what-total": safeFormatNumber(total),
      "what-ratio": "N/A",
      "what-percent": "N/A",
    });
    return;
  }

  const ratio = part / total;
  const percent = ratio * 100;

  setResult(
    `Result: ${safeFormatPercent(percent)}`,
    `${safeFormatNumber(part)} is ${safeFormatPercent(percent)} of ${safeFormatNumber(total)}.`,
  );

  updateExplanationFields("what-percent", {
    "what-part": safeFormatNumber(part),
    "what-total": safeFormatNumber(total),
    "what-ratio": safeFormatNumber(ratio, 4),
    "what-percent": safeFormatPercent(percent),
  });
}

function runCalculation(mode) {
  switch (mode) {
    case "change":
      calculateChange();
      break;
    case "percent-of":
      calculatePercentOf();
      break;
    case "increase":
      calculateIncrease();
      break;
    case "decrease":
      calculateDecrease();
      break;
    case "what-percent":
      calculateWhatPercent();
      break;
  }
}

modeButtons.forEach(button => {
  button.addEventListener("click", () => {
    const mode = button.dataset.mode;
    switchMode(mode);
    runCalculation(mode);
  });
});

calcButtons.forEach(button => {
  button.addEventListener("click", () => {
    const mode = button.dataset.calc;
    runCalculation(mode);
  });
});

const initialMode = document.querySelector(".mode-button.active")?.dataset.mode || "change";
switchMode(initialMode);
runCalculation(initialMode);
