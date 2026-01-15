import { formatNumber } from "/assets/js/core/format.js";
import { setupButtonGroup } from "/assets/js/core/ui.js";
import { toNumber, clamp } from "/assets/js/core/validate.js";

const typeGroup = document.querySelector('[data-button-group="seq-type"]');
const typeButtons = setupButtonGroup(typeGroup, {
  defaultValue: "arithmetic",
  onChange: () => {
    updateVisibility();
    calculate();
  },
});
const a1Input = document.querySelector("#seq-a1");
const dInput = document.querySelector("#seq-d");
const rInput = document.querySelector("#seq-r");
const nInput = document.querySelector("#seq-n");
const kInput = document.querySelector("#seq-k");
const dRow = document.querySelector("#seq-d-row");
const rRow = document.querySelector("#seq-r-row");
const calculateButton = document.querySelector("#seq-calculate");
const resultDiv = document.querySelector("#seq-result");
const detailDiv = document.querySelector("#seq-detail");

function updateVisibility() {
  const isArithmetic = (typeButtons?.getValue() ?? "arithmetic") === "arithmetic";
  dRow.style.display = isArithmetic ? "" : "none";
  rRow.style.display = isArithmetic ? "none" : "";
}

function calculateArithmeticTerm(a1, d, n) {
  // a_n = a1 + (n - 1) * d
  return a1 + (n - 1) * d;
}

function calculateGeometricTerm(a1, r, n) {
  // a_n = a1 * r^(n - 1)
  return a1 * Math.pow(r, n - 1);
}

function generateSequence(a1, param, k, isArithmetic) {
  const terms = [];
  for (let i = 1; i <= k; i++) {
    const term = isArithmetic
      ? calculateArithmeticTerm(a1, param, i)
      : calculateGeometricTerm(a1, param, i);
    terms.push(term);
  }
  return terms;
}

function calculate() {
  resultDiv.textContent = "";
  detailDiv.textContent = "";

  const isArithmetic = (typeButtons?.getValue() ?? "arithmetic") === "arithmetic";
  const a1 = toNumber(a1Input.value, 0);
  const d = toNumber(dInput.value, 0);
  const r = toNumber(rInput.value, 1);
  const n = Math.floor(toNumber(nInput.value, 1));
  const k = clamp(Math.floor(toNumber(kInput.value, 10)), 1, 50);

  // Update k input if clamped
  kInput.value = k;

  if (n < 1) {
    resultDiv.textContent = "Term index (n) must be at least 1.";
    return;
  }

  if (!Number.isFinite(a1)) {
    resultDiv.textContent = "Please enter a valid first term (a1).";
    return;
  }

  const param = isArithmetic ? d : r;
  if (!Number.isFinite(param)) {
    resultDiv.textContent = isArithmetic
      ? "Please enter a valid common difference (d)."
      : "Please enter a valid common ratio (r).";
    return;
  }

  const nthTerm = isArithmetic
    ? calculateArithmeticTerm(a1, d, n)
    : calculateGeometricTerm(a1, r, n);

  if (!Number.isFinite(nthTerm)) {
    resultDiv.textContent = "Result is too large or invalid. Try smaller values.";
    return;
  }

  const preview = generateSequence(a1, param, k, isArithmetic);
  const validPreview = preview.filter(t => Number.isFinite(t));
  const opts = { maximumFractionDigits: 4 };

  const sequenceType = isArithmetic ? "Arithmetic" : "Geometric";
  resultDiv.innerHTML = `<strong>${sequenceType} Sequence - Term ${n} (a<sub>${n}</sub>):</strong> ${formatNumber(nthTerm, opts)}`;

  const previewStr = validPreview.map(t => formatNumber(t, opts)).join(", ");
  detailDiv.innerHTML = `
    <p><strong>First ${validPreview.length} terms:</strong></p>
    <p style="word-break: break-word;">${previewStr}${validPreview.length < k ? "..." : ""}</p>
  `;
}

calculateButton.addEventListener("click", calculate);

// Initialize
updateVisibility();
calculate();
