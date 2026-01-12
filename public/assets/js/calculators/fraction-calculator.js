function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    [x, y] = [y, x % y];
  }
  return x || 1;
}

function normalizeFraction(numerator, denominator) {
  if (denominator === 0) {
    return null;
  }
  const sign = denominator < 0 ? -1 : 1;
  const adjustedNum = numerator * sign;
  const adjustedDen = Math.abs(denominator);
  const divisor = gcd(adjustedNum, adjustedDen);
  return {
    numerator: adjustedNum / divisor,
    denominator: adjustedDen / divisor,
  };
}

function formatFraction({ numerator, denominator }) {
  if (denominator === 1) {
    return `${numerator}`;
  }
  return `${numerator}/${denominator}`;
}

function formatMixed({ numerator, denominator }) {
  const sign = numerator < 0 ? -1 : 1;
  const absNum = Math.abs(numerator);
  const whole = Math.floor(absNum / denominator);
  const remainder = absNum % denominator;

  if (remainder === 0) {
    return `${sign * whole}`;
  }

  const mixed = `${whole} ${remainder}/${denominator}`.trim();
  return sign < 0 ? `-${mixed}` : mixed;
}

export function initCalculator(scope = document) {
  const panel = scope.querySelector('[data-calculator="fraction-calculator"]');
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

  function readFraction(prefix) {
    const numerator = toNumber(panel.querySelector(`[data-field="${prefix}-num"]`)?.value);
    const denominator = toNumber(panel.querySelector(`[data-field="${prefix}-den"]`)?.value);
    return normalizeFraction(numerator, denominator);
  }

  function renderResult(target, fraction, { useMixed = false } = {}) {
    if (!target) {
      return;
    }

    if (!fraction) {
      target.textContent = "Result: Enter a denominator above 0.";
      return;
    }

    const formatted = useMixed ? formatMixed(fraction) : formatFraction(fraction);
    target.textContent = `Result: ${formatted}`;
  }

  function calculateAdd() {
    const a = readFraction("add-a");
    const b = readFraction("add-b");
    const resultEl = panel.querySelector('[data-result="add"]');

    if (!a || !b) {
      renderResult(resultEl, null);
      return;
    }

    renderResult(resultEl, normalizeFraction(
      a.numerator * b.denominator + b.numerator * a.denominator,
      a.denominator * b.denominator
    ));
  }

  function calculateSubtract() {
    const a = readFraction("subtract-a");
    const b = readFraction("subtract-b");
    const resultEl = panel.querySelector('[data-result="subtract"]');

    if (!a || !b) {
      renderResult(resultEl, null);
      return;
    }

    renderResult(resultEl, normalizeFraction(
      a.numerator * b.denominator - b.numerator * a.denominator,
      a.denominator * b.denominator
    ));
  }

  function calculateMultiply() {
    const a = readFraction("multiply-a");
    const b = readFraction("multiply-b");
    const resultEl = panel.querySelector('[data-result="multiply"]');

    if (!a || !b) {
      renderResult(resultEl, null);
      return;
    }

    renderResult(resultEl, normalizeFraction(
      a.numerator * b.numerator,
      a.denominator * b.denominator
    ));
  }

  function calculateDivide() {
    const a = readFraction("divide-a");
    const b = readFraction("divide-b");
    const resultEl = panel.querySelector('[data-result="divide"]');

    if (!a || !b || b.numerator === 0) {
      resultEl.textContent = "Result: Enter a non-zero divisor.";
      return;
    }

    renderResult(resultEl, normalizeFraction(
      a.numerator * b.denominator,
      a.denominator * b.numerator
    ));
  }

  function calculateSimplify() {
    const fraction = readFraction("simplify");
    const resultEl = panel.querySelector('[data-result="simplify"]');
    renderResult(resultEl, fraction);
  }

  function calculateImproperToMixed() {
    const fraction = readFraction("improper");
    const resultEl = panel.querySelector('[data-result="improper"]');
    if (!fraction) {
      renderResult(resultEl, null);
      return;
    }
    renderResult(resultEl, fraction, { useMixed: true });
  }

  function calculateMixedToImproper() {
    const whole = toNumber(panel.querySelector('[data-field="mixed-whole"]')?.value);
    const numerator = toNumber(panel.querySelector('[data-field="mixed-num"]')?.value);
    const denominator = toNumber(panel.querySelector('[data-field="mixed-den"]')?.value);
    const resultEl = panel.querySelector('[data-result="mixed"]');

    if (denominator === 0) {
      renderResult(resultEl, null);
      return;
    }

    const sign = whole < 0 ? -1 : 1;
    const totalNumerator = sign * (Math.abs(whole) * denominator + numerator);
    renderResult(resultEl, normalizeFraction(totalNumerator, denominator));
  }

  const convertButtons = panel.querySelectorAll("[data-convert]");
  const convertPanels = panel.querySelectorAll("[data-convert-panel]");

  function activateConvert(mode) {
    convertButtons.forEach(button => {
      button.classList.toggle("is-active", button.dataset.convert === mode);
    });
    convertPanels.forEach(panelEl => {
      panelEl.classList.toggle("is-active", panelEl.dataset.convertPanel === mode);
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => activateMode(tab.dataset.mode));
  });

  convertButtons.forEach(button => {
    button.addEventListener("click", () => activateConvert(button.dataset.convert));
  });

  panel.querySelectorAll("[data-action]").forEach(button => {
    const action = button.dataset.action;
    button.addEventListener("click", () => {
      if (action === "add") {
        calculateAdd();
      }
      if (action === "subtract") {
        calculateSubtract();
      }
      if (action === "multiply") {
        calculateMultiply();
      }
      if (action === "divide") {
        calculateDivide();
      }
      if (action === "simplify") {
        calculateSimplify();
      }
      if (action === "improper") {
        calculateImproperToMixed();
      }
      if (action === "mixed") {
        calculateMixedToImproper();
      }
    });
  });

  calculateAdd();
  calculateSubtract();
  calculateMultiply();
  calculateDivide();
  calculateSimplify();
  calculateImproperToMixed();
  calculateMixedToImproper();
}
