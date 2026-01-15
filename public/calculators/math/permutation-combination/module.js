import { permutation, combination } from "/assets/js/core/stats.js";
import { setupButtonGroup } from "/assets/js/core/ui.js";
import { toNumber } from "/assets/js/core/validate.js";

const modeGroup = document.querySelector('[data-button-group="pc-mode"]');
const modeButtons = setupButtonGroup(modeGroup, {
  defaultValue: "permutation",
});
const nInput = document.querySelector("#pc-n");
const rInput = document.querySelector("#pc-r");
const calculateButton = document.querySelector("#pc-calculate");
const resultDiv = document.querySelector("#pc-result");
const detailDiv = document.querySelector("#pc-detail");

function calculate() {
  resultDiv.textContent = "";
  detailDiv.textContent = "";

  const mode = modeButtons?.getValue() ?? "permutation";
  const n = toNumber(nInput.value, 0);
  const r = toNumber(rInput.value, 0);

  // Validation - check for integer inputs
  if (!Number.isInteger(n)) {
    resultDiv.textContent = "n must be an integer.";
    return;
  }

  if (!Number.isInteger(r)) {
    resultDiv.textContent = "r must be an integer.";
    return;
  }

  if (n < 0) {
    resultDiv.textContent = "n must be a non-negative integer.";
    return;
  }

  if (r < 0) {
    resultDiv.textContent = "r must be a non-negative integer.";
    return;
  }

  if (r > n) {
    resultDiv.textContent = "r cannot be greater than n.";
    return;
  }

  if (n > 170) {
    resultDiv.textContent = "n must be 170 or less to avoid overflow.";
    return;
  }

  let result;
  let formula;
  let label;

  if (mode === "permutation") {
    result = permutation(n, r);
    label = `${n}P${r}`;
    formula = `n! / (n-r)! = ${n}! / ${n - r}!`;
  } else {
    result = combination(n, r);
    label = `${n}C${r}`;
    formula = `n! / (r! × (n-r)!) = ${n}! / (${r}! × ${n - r}!)`;
  }

  if (result === null) {
    resultDiv.textContent = "Calculation error. Please check your inputs.";
    return;
  }

  // Convert BigInt to string (no commas per requirements)
  const resultStr = result.toString();

  const modeLabel = mode === "permutation" ? "Permutation" : "Combination";
  resultDiv.innerHTML = `<strong>${modeLabel} ${label}:</strong> ${resultStr}`;

  detailDiv.innerHTML = `
    <p><strong>Formula:</strong> ${formula}</p>
    <p><strong>n:</strong> ${n} (total items)</p>
    <p><strong>r:</strong> ${r} (items to ${mode === "permutation" ? "arrange" : "choose"})</p>
  `;
}

calculateButton.addEventListener("click", calculate);

// Calculate on load with default values
calculate();
