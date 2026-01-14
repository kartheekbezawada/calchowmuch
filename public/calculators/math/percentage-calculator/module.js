import { formatNumber, formatPercent } from "/assets/js/core/format.js";
import {
  calculatePercentageChange,
  calculatePercentOf,
  calculateWhatPercent,
  calculateAddSubtractPercent,
} from "/assets/js/core/percentage-tools.js";

const toolTabs = document.querySelectorAll(".tool-tab");
const calculatorCards = document.querySelectorAll(
  ".calculator-card[data-tool]"
);
const explanationBlocks = document.querySelectorAll(
  ".explanation-block[data-tool]"
);

const toolKeys = Array.from(toolTabs)
  .map(button => button.dataset.tool)
  .filter(Boolean);

function setActiveTool(toolKey, options = {}) {
  if (!toolKeys.includes(toolKey)) {
    return;
  }

  toolTabs.forEach(button => {
    const isActive = button.dataset.tool === toolKey;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  calculatorCards.forEach(card => {
    card.hidden = card.dataset.tool !== toolKey;
  });

  explanationBlocks.forEach(block => {
    block.hidden = block.dataset.tool !== toolKey;
  });

  if (options.updateHash) {
    window.location.hash = toolKey;
  }
}

function getNumber(input) {
  const raw = input.value.trim();
  if (!raw) {
    return { error: "Enter a value before calculating." };
  }
  const value = Number(raw);
  if (!Number.isFinite(value)) {
    return { error: "Enter a valid number." };
  }
  return { value };
}

function setOutput(card, { resultText = "", detailText = "", isError = false }) {
  const result = card.querySelector("[data-result]");
  const details = card.querySelector("[data-details]");

  result.textContent = resultText;
  details.textContent = detailText;
  details.classList.toggle("is-error", isError);
}

function handlePercentChange(card) {
  const startInput = card.querySelector("[data-field='start']");
  const endInput = card.querySelector("[data-field='end']");

  const startValue = getNumber(startInput);
  if (startValue.error) {
    setOutput(card, {
      resultText: "Result: —",
      detailText: startValue.error,
      isError: true,
    });
    return;
  }

  const endValue = getNumber(endInput);
  if (endValue.error) {
    setOutput(card, {
      resultText: "Result: —",
      detailText: endValue.error,
      isError: true,
    });
    return;
  }

  const outcome = calculatePercentageChange(startValue.value, endValue.value);
  if (outcome.error) {
    setOutput(card, {
      resultText: "Result: —",
      detailText: outcome.error,
      isError: true,
    });
    return;
  }

  let direction;
  if (outcome.value > 0) {
    direction = "increase";
  } else if (outcome.value < 0) {
    direction = "decrease";
  } else {
    direction = "no change";
  }
  
  const formattedChange =
    outcome.value > 0
      ? `+${formatPercent(outcome.value)}`
      : formatPercent(outcome.value);
  setOutput(card, {
    resultText: `Result: ${formattedChange} ${direction}`,
    detailText: `Change amount: ${formatNumber(endValue.value - startValue.value)} from ${formatNumber(
      startValue.value
    )} to ${formatNumber(endValue.value)}.`,
  });
}

function handlePercentageOf(card) {
  const percentInput = card.querySelector("[data-field='percent']");
  const valueInput = card.querySelector("[data-field='value']");

  const percentValue = getNumber(percentInput);
  if (percentValue.error) {
    setOutput(card, {
      resultText: "Result: —",
      detailText: percentValue.error,
      isError: true,
    });
    return;
  }

  const baseValue = getNumber(valueInput);
  if (baseValue.error) {
    setOutput(card, {
      resultText: "Result: —",
      detailText: baseValue.error,
      isError: true,
    });
    return;
  }

  const outcome = calculatePercentOf(percentValue.value, baseValue.value);
  if (outcome.error) {
    setOutput(card, {
      resultText: "Result: —",
      detailText: outcome.error,
      isError: true,
    });
    return;
  }

  setOutput(card, {
    resultText: `Result: ${formatNumber(outcome.value)}`,
    detailText: `${formatPercent(percentValue.value)} of ${formatNumber(
      baseValue.value
    )} is ${formatNumber(outcome.value)}.`,
  });
}

function handleWhatPercent(card) {
  const partInput = card.querySelector("[data-field='part']");
  const wholeInput = card.querySelector("[data-field='whole']");

  const partValue = getNumber(partInput);
  if (partValue.error) {
    setOutput(card, {
      resultText: "Result: —",
      detailText: partValue.error,
      isError: true,
    });
    return;
  }

  const wholeValue = getNumber(wholeInput);
  if (wholeValue.error) {
    setOutput(card, {
      resultText: "Result: —",
      detailText: wholeValue.error,
      isError: true,
    });
    return;
  }

  const outcome = calculateWhatPercent(partValue.value, wholeValue.value);
  if (outcome.error) {
    setOutput(card, {
      resultText: "Result: —",
      detailText: outcome.error,
      isError: true,
    });
    return;
  }

  setOutput(card, {
    resultText: `Result: ${formatPercent(outcome.value)}`,
    detailText: `${formatNumber(partValue.value)} is ${formatPercent(
      outcome.value
    )} of ${formatNumber(wholeValue.value)}.`,
  });
}

function handleAddSubtract(card) {
  const valueInput = card.querySelector("[data-field='value']");
  const percentInput = card.querySelector("[data-field='percent']");

  const baseValue = getNumber(valueInput);
  if (baseValue.error) {
    setOutput(card, {
      resultText: "Result: —",
      detailText: baseValue.error,
      isError: true,
    });
    return;
  }

  const percentValue = getNumber(percentInput);
  if (percentValue.error) {
    setOutput(card, {
      resultText: "Result: —",
      detailText: percentValue.error,
      isError: true,
    });
    return;
  }

  const outcome = calculateAddSubtractPercent(
    baseValue.value,
    percentValue.value
  );
  if (outcome.error) {
    setOutput(card, {
      resultText: "Result: —",
      detailText: outcome.error,
      isError: true,
    });
    return;
  }

  setOutput(card, {
    resultText: `Result: ${formatNumber(outcome.addValue)} after adding ${formatPercent(
      percentValue.value
    )}; ${formatNumber(outcome.subtractValue)} after subtracting ${formatPercent(
      percentValue.value
    )}.`,
    detailText: `Added amount: ${formatNumber(
      outcome.addValue - baseValue.value
    )}. Subtracted amount: ${formatNumber(
      baseValue.value - outcome.subtractValue
    )}.`,
  });
}

const handlers = {
  "percent-change": handlePercentChange,
  "percentage-of": handlePercentageOf,
  "what-percent": handleWhatPercent,
  "add-subtract": handleAddSubtract,
};

calculatorCards.forEach(card => {
  const button = card.querySelector("[data-action='calculate']");
  const handler = handlers[card.dataset.tool];
  if (!button || !handler) {
    return;
  }

  button.addEventListener("click", () => {
    handler(card);
  });

  // Allow pressing Enter in inputs to trigger the calculation for better keyboard accessibility
  const inputElements = card.querySelectorAll("input, select, textarea");
  inputElements.forEach(input => {
    input.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        event.preventDefault();
        handler(card);
      }
    });
  });
});

toolTabs.forEach(button => {
  button.addEventListener("click", () => {
    setActiveTool(button.dataset.tool, { updateHash: true });
  });

  button.addEventListener("keydown", event => {
    const tabs = Array.from(toolTabs);
    const currentIndex = tabs.indexOf(event.currentTarget);
    if (currentIndex === -1) {
      return;
    }

    let newIndex = null;
    switch (event.key) {
      case "ArrowRight":
        newIndex = (currentIndex + 1) % tabs.length;
        break;
      case "ArrowLeft":
        newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;
      case "Home":
        newIndex = 0;
        break;
      case "End":
        newIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const newTab = tabs[newIndex];
    if (newTab) {
      newTab.focus();
      setActiveTool(newTab.dataset.tool, { updateHash: true });
    }
  });
});

function initializeFromHash() {
  const toolFromHash = window.location.hash.replace("#", "");
  if (toolFromHash && toolKeys.includes(toolFromHash)) {
    setActiveTool(toolFromHash, { updateHash: false });
  } else if (toolKeys.length > 0) {
    setActiveTool(toolKeys[0], { updateHash: false });
  }
}

window.addEventListener("hashchange", initializeFromHash);
initializeFromHash();
