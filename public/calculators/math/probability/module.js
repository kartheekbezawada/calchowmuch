import { formatNumber, formatPercent } from "/assets/js/core/format.js";
import { toNumber } from "/assets/js/core/validate.js";

const modeSelect = document.querySelector("#prob-mode");
const probAInput = document.querySelector("#prob-a");
const probBInput = document.querySelector("#prob-b");
const probBRow = document.querySelector("#prob-b-row");
const calculateButton = document.querySelector("#prob-calculate");
const resultDiv = document.querySelector("#prob-result");
const detailDiv = document.querySelector("#prob-detail");

function updateVisibility() {
  const mode = modeSelect.value;
  const needsB = mode === "and" || mode === "or";
  probBRow.style.display = needsB ? "" : "none";
}

function calculate() {
  resultDiv.textContent = "";
  detailDiv.textContent = "";

  const mode = modeSelect.value;
  const pAPercent = toNumber(probAInput.value, 0);

  // Validate P(A)
  if (pAPercent < 0 || pAPercent > 100) {
    resultDiv.textContent = "P(A) must be between 0% and 100%.";
    return;
  }

  const pA = pAPercent / 100;
  let result;
  let formula;
  let description;

  if (mode === "single") {
    result = pA;
    formula = "P(A)";
    description = "The probability of event A occurring.";
  } else if (mode === "complement") {
    result = 1 - pA;
    formula = "1 - P(A)";
    description = "The probability of event A NOT occurring.";
  } else {
    // Need P(B) for AND and OR
    const pBPercent = toNumber(probBInput.value, 0);

    if (pBPercent < 0 || pBPercent > 100) {
      resultDiv.textContent = "P(B) must be between 0% and 100%.";
      return;
    }

    const pB = pBPercent / 100;

    if (mode === "and") {
      result = pA * pB;
      formula = "P(A) × P(B)";
      description = "The probability of both A AND B occurring (independent events).";
    } else if (mode === "or") {
      result = pA + pB - pA * pB;
      formula = "P(A) + P(B) - P(A) × P(B)";
      description = "The probability of A OR B (or both) occurring (independent events).";
    }
  }

  const opts = { maximumFractionDigits: 4 };

  resultDiv.innerHTML = `<strong>Result:</strong> ${formatNumber(result, opts)} (${formatPercent(result * 100, { maximumFractionDigits: 2 })})`;

  detailDiv.innerHTML = `
    <p><strong>Formula:</strong> ${formula}</p>
    <p><strong>Explanation:</strong> ${description}</p>
  `;
}

modeSelect.addEventListener("change", () => {
  updateVisibility();
  calculate();
});

calculateButton.addEventListener("click", calculate);

// Initialize
updateVisibility();
calculate();
