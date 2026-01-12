function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatPercent(value) {
  return `${value.toFixed(2)}%`;
}

export function initCalculator(scope = document) {
  const panel = scope.querySelector('[data-calculator="percentage-calculator"]');
  if (!panel) {
    return;
  }

  const tabs = panel.querySelectorAll(".calc-tab");
  const panels = panel.querySelectorAll("[data-mode-panel]");

  function activateMode(mode) {
    tabs.forEach(tab => {
      tab.classList.toggle("is-active", tab.dataset.mode === mode);
    });
    panels.forEach(modePanel => {
      modePanel.classList.toggle("is-active", modePanel.dataset.modePanel === mode);
    });
  }

  function updateIncrease() {
    const start = toNumber(panel.querySelector('[data-field="increase-start"]')?.value);
    const end = toNumber(panel.querySelector('[data-field="increase-end"]')?.value);
    const result = panel.querySelector('[data-result="increase"]');
    const detail = panel.querySelector('[data-detail="increase"]');

    if (start <= 0) {
      result.textContent = "Result: Enter a starting value above 0.";
      detail.textContent = "";
      return;
    }

    const change = end - start;
    const percent = (change / start) * 100;
    const absoluteChange = Math.abs(change);
    const sign = percent >= 0 ? "+" : "";
    const direction = percent >= 0 ? "increase" : "decrease";

    result.textContent = `Result: ${sign}${formatPercent(percent)}`;
    detail.textContent = `That is an ${direction} of ${absoluteChange.toFixed(2)}.`;
  }

  function updateDecrease() {
    const start = toNumber(panel.querySelector('[data-field="decrease-start"]')?.value);
    const end = toNumber(panel.querySelector('[data-field="decrease-end"]')?.value);
    const result = panel.querySelector('[data-result="decrease"]');
    const detail = panel.querySelector('[data-detail="decrease"]');

    if (start <= 0) {
      result.textContent = "Result: Enter a starting value above 0.";
      detail.textContent = "";
      return;
    }

    const change = start - end;
    const absoluteChange = Math.abs(change);
    const percent = (absoluteChange / start) * 100;
    const direction = change >= 0 ? "decrease" : "increase";

    result.textContent = `Result: ${formatPercent(percent)}`;
    detail.textContent = `That is a ${direction} of ${absoluteChange.toFixed(2)}.`;
  }

  function updatePercentOf() {
    const part = toNumber(panel.querySelector('[data-field="part-value"]')?.value);
    const whole = toNumber(panel.querySelector('[data-field="whole-value"]')?.value);
    const result = panel.querySelector('[data-result="percent-of"]');
    const detail = panel.querySelector('[data-detail="percent-of"]');

    if (whole === 0) {
      result.textContent = "Result: Enter a whole value above 0.";
      detail.textContent = "";
      return;
    }

    const percent = (part / whole) * 100;
    result.textContent = `Result: ${formatPercent(percent)}`;
    detail.textContent = `${part} is ${formatPercent(percent)} of ${whole}.`;
  }

  function updateXPercentOfY() {
    const percent = toNumber(panel.querySelector('[data-field="percent-value"]')?.value);
    const number = toNumber(panel.querySelector('[data-field="number-value"]')?.value);
    const result = panel.querySelector('[data-result="x-percent-of-y"]');
    const detail = panel.querySelector('[data-detail="x-percent-of-y"]');

    const value = (percent / 100) * number;
    result.textContent = `Result: ${value.toFixed(2)}`;
    detail.textContent = `${percent}% of ${number} is ${value.toFixed(2)}.`;
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => activateMode(tab.dataset.mode));
  });

  panel.querySelectorAll("[data-action]").forEach(button => {
    const action = button.dataset.action;
    button.addEventListener("click", () => {
      if (action === "increase") {
        updateIncrease();
      }
      if (action === "decrease") {
        updateDecrease();
      }
      if (action === "percent-of") {
        updatePercentOf();
      }
      if (action === "x-percent-of-y") {
        updateXPercentOfY();
      }
    });
  });

  updateIncrease();
  updateDecrease();
  updatePercentOf();
  updateXPercentOfY();
}
