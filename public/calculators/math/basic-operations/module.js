import { add, subtract, multiply, divide } from "/assets/js/core/math.js";
import { formatNumber } from "/assets/js/core/format.js";
import { toNumber } from "/assets/js/core/validate.js";

const inputA = document.querySelector("#basic-value-a");
const inputB = document.querySelector("#basic-value-b");
const result = document.querySelector("#basic-result");
const buttons = document.querySelectorAll("[data-operation]");
const resetButton = document.querySelector("#basic-reset");

const operations = {
  add: {
    label: "Sum",
    fn: add,
  },
  subtract: {
    label: "Difference",
    fn: subtract,
  },
  multiply: {
    label: "Product",
    fn: multiply,
  },
  divide: {
    label: "Quotient",
    fn: divide,
  },
};

function updateResult(operationKey) {
  const a = toNumber(inputA.value);
  const b = toNumber(inputB.value);
  const operation = operations[operationKey];
  const output = operation.fn(a, b);

  if (output === null) {
    result.textContent = "Result: Division by zero isn't possible.";
    return;
  }

  result.textContent = `Result (${operation.label}): ${formatNumber(output, {
    maximumFractionDigits: 4,
  })}`;
}

function bindButtons() {
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      updateResult(button.dataset.operation);
    });
  });
}

function bindReset() {
  resetButton.addEventListener("click", () => {
    inputA.value = 0;
    inputB.value = 0;
    updateResult("add");
  });
}

bindButtons();
bindReset();
updateResult("add");
