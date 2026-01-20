import { add, subtract, multiply, divide } from '/assets/js/core/math.js';
import { formatNumber } from '/assets/js/core/format.js';
import { toNumber } from '/assets/js/core/validate.js';

const inputContainer = document.querySelector('#basic-inputs');
const result = document.querySelector('#basic-result');
const buttons = document.querySelectorAll('[data-operation]');
const resetButton = document.querySelector('#basic-reset');
const addInputButton = document.querySelector('#basic-add-input');
const removeInputButton = document.querySelector('#basic-remove-input');
const memoryButtons = document.querySelectorAll('[data-memory]');
const memoryIndicator = document.querySelector('#basic-memory-indicator');
const memoryValueDisplay = document.querySelector('#basic-memory-value');

const defaultValues = [12, 8];
let activeOperation = 'add';
let memoryValue = 0;
let lastResult = 0;

const operations = {
  add: {
    label: 'Sum',
    fn: add,
  },
  subtract: {
    label: 'Difference',
    fn: subtract,
  },
  multiply: {
    label: 'Product',
    fn: multiply,
  },
  divide: {
    label: 'Quotient',
    fn: divide,
  },
};

function getInputValues() {
  return Array.from(inputContainer.querySelectorAll('[data-basic-input]')).map((input) =>
    toNumber(input.value)
  );
}

function calculateMultiple(operationKey, values) {
  if (!values.length) {
    return 0;
  }

  if (operationKey === 'add') {
    return values.reduce((total, value) => add(total, value), 0);
  }

  if (operationKey === 'multiply') {
    return values.reduce((total, value) => multiply(total, value), 1);
  }

  let runningTotal = values[0];
  for (let index = 1; index < values.length; index += 1) {
    const nextValue = values[index];
    const operationFn = operations[operationKey].fn;
    const output = operationFn(runningTotal, nextValue);

    if (output === null) {
      return null;
    }

    runningTotal = output;
  }

  return runningTotal;
}

function updateResult(operationKey) {
  const operation = operations[operationKey];
  const values = getInputValues();
  const output = calculateMultiple(operationKey, values);

  if (output === null) {
    result.textContent = "Result: Division by zero isn't possible.";
    lastResult = 0;
    return;
  }

  lastResult = output;
  result.textContent = `Result (${operation.label}): ${formatNumber(output, {
    maximumFractionDigits: 4,
  })}`;
}

// Memory functions
function updateMemoryIndicator() {
  if (memoryIndicator) {
    memoryIndicator.style.visibility = memoryValue !== 0 ? 'visible' : 'hidden';
  }
  if (memoryValueDisplay) {
    memoryValueDisplay.textContent =
      memoryValue !== 0
        ? `Memory: ${formatNumber(memoryValue, { maximumFractionDigits: 4 })}`
        : '';
  }
}

function memoryClear() {
  memoryValue = 0;
  updateMemoryIndicator();
}

function memoryRecall() {
  // Insert memory value into first input
  const firstInput = inputContainer.querySelector('[data-basic-input]');
  if (firstInput) {
    firstInput.value = memoryValue;
    updateResult(activeOperation);
  }
}

function memoryStore() {
  memoryValue = lastResult;
  updateMemoryIndicator();
}

function memoryAdd() {
  memoryValue = add(memoryValue, lastResult);
  updateMemoryIndicator();
}

function memorySubtract() {
  memoryValue = subtract(memoryValue, lastResult);
  updateMemoryIndicator();
}

function bindMemoryButtons() {
  memoryButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const memoryOp = button.dataset.memory;
      switch (memoryOp) {
        case 'mc':
          memoryClear();
          break;
        case 'mr':
          memoryRecall();
          break;
        case 'ms':
          memoryStore();
          break;
        case 'm-plus':
          memoryAdd();
          break;
        case 'm-minus':
          memorySubtract();
          break;
      }
    });
  });
}

function bindButtons() {
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      activeOperation = button.dataset.operation;
      updateResult(activeOperation);
    });
  });
}

function bindReset() {
  resetButton.addEventListener('click', () => {
    const inputs = Array.from(inputContainer.querySelectorAll('[data-basic-input]'));
    inputs.slice(2).forEach((input) => input.closest('.input-row')?.remove());

    const remainingInputs = Array.from(inputContainer.querySelectorAll('[data-basic-input]'));
    remainingInputs.forEach((input, index) => {
      input.value = defaultValues[index] ?? 0;
    });

    updateRemoveButtonState();
    activeOperation = 'add';
    updateResult(activeOperation);
    // Also reset memory on full reset
    memoryClear();
  });
}

function updateRemoveButtonState() {
  const inputCount = inputContainer.querySelectorAll('[data-basic-input]').length;
  removeInputButton.disabled = inputCount <= 2;
}

function addInputRow() {
  const inputCount = inputContainer.querySelectorAll('[data-basic-input]').length;
  const nextIndex = inputCount + 1;
  const wrapper = document.createElement('div');
  wrapper.className = 'input-row';

  const label = document.createElement('label');
  label.htmlFor = `basic-value-${nextIndex}`;
  label.textContent = `Number ${nextIndex}`;

  const input = document.createElement('input');
  input.type = 'number';
  input.id = `basic-value-${nextIndex}`;
  input.value = '';
  input.dataset.basicInput = 'true';

  wrapper.append(label, input);
  inputContainer.append(wrapper);
  updateRemoveButtonState();
  updateResult(activeOperation);
}

function removeInputRow() {
  const rows = Array.from(inputContainer.querySelectorAll('.input-row'));
  if (rows.length <= 2) {
    updateRemoveButtonState();
    return;
  }

  const lastRow = rows[rows.length - 1];
  lastRow.remove();
  updateRemoveButtonState();
  updateResult(activeOperation);
}

function bindInputControls() {
  addInputButton.addEventListener('click', addInputRow);
  removeInputButton.addEventListener('click', removeInputRow);
  updateRemoveButtonState();
}

bindButtons();
bindReset();
bindInputControls();
bindMemoryButtons();
updateMemoryIndicator();
updateResult(activeOperation);
