function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function initCalculator(scope = document) {
  const panel = scope.querySelector('[data-calculator="basic-calculator"]');
  if (!panel) {
    return;
  }

  const valueA = panel.querySelector('[data-field="value-a"]');
  const valueB = panel.querySelector('[data-field="value-b"]');
  const result = panel.querySelector("[data-result]");
  const buttons = panel.querySelectorAll("[data-operation]");

  const operations = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b,
    divide: (a, b) => (b === 0 ? null : a / b),
  };

  function updateResult(operation) {
    const a = toNumber(valueA?.value);
    const b = toNumber(valueB?.value);
    const output = operations[operation]?.(a, b);

    if (output === null) {
      result.textContent = "Result: Division by zero isn't possible.";
      return;
    }

    result.textContent = `Result: ${output}`;
  }

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const operation = button.dataset.operation;
      if (operation === "reset") {
        valueA.value = 0;
        valueB.value = 0;
        updateResult("add");
        return;
      }
      updateResult(operation);
    });
  });

  updateResult("add");
}
