let inputLimiterInitialized = false;

const INPUT_SELECTOR = [
  'input[type="text"]',
  'input[type="number"]',
  'input[type="email"]',
  'input[type="password"]',
  'input[type="search"]',
  'input[type="tel"]',
  'input[type="url"]',
  'input[type="date"]',
  'input[type="time"]',
  'input[type="datetime-local"]',
  'input[type="month"]',
  'input[type="week"]',
].join(',');

export function initInputLengthLimiter(maxLength = 12) {
  if (inputLimiterInitialized || typeof document === 'undefined') {
    return;
  }
  inputLimiterInitialized = true;

  function resolveMaxLength(input) {
    const attrValue = input.getAttribute('maxlength') ?? input.dataset.maxlength;
    const parsed = Number(attrValue);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
    return maxLength;
  }

  function applyMaxLength(input) {
    if (input.dataset.maxlengthApplied) {
      return;
    }
    const resolved = resolveMaxLength(input);
    if (input.type !== 'number' && !input.hasAttribute('maxlength')) {
      input.setAttribute('maxlength', String(resolved));
    }
    input.dataset.maxlengthApplied = 'true';
  }

  function enforceLimit(input) {
    const resolved = resolveMaxLength(input);
    if (input.value.length > resolved) {
      input.value = input.value.slice(0, resolved);
    }
  }

  document.querySelectorAll(INPUT_SELECTOR).forEach(applyMaxLength);

  document.addEventListener('focusin', (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.matches(INPUT_SELECTOR)) {
      applyMaxLength(target);
    }
  });

  document.addEventListener('input', (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.matches(INPUT_SELECTOR)) {
      applyMaxLength(target);
      enforceLimit(target);
    }
  });
}

export function setupButtonGroup(group, options = {}) {
  if (!group) {
    return null;
  }

  const buttons = Array.from(group.querySelectorAll('button[data-value]'));
  if (!buttons.length) {
    return null;
  }

  const defaultValue = options.defaultValue ?? buttons[0]?.dataset.value;
  const onChange = options.onChange;
  const activeAttribute =
    options.ariaAttribute ??
    (group.getAttribute('role') === 'tablist' ? 'aria-selected' : 'aria-pressed');

  function setActive(value) {
    let activeValue = value;
    let hasMatch = false;

    buttons.forEach((button) => {
      const isActive = button.dataset.value === value;
      button.classList.toggle('is-active', isActive);
      button.setAttribute(activeAttribute, isActive ? 'true' : 'false');
      if (isActive) {
        hasMatch = true;
      }
    });

    if (!hasMatch && defaultValue) {
      activeValue = defaultValue;
      buttons.forEach((button) => {
        const isActive = button.dataset.value === activeValue;
        button.classList.toggle('is-active', isActive);
        button.setAttribute(activeAttribute, isActive ? 'true' : 'false');
      });
    }

    return activeValue;
  }

  function getValue() {
    const active = buttons.find(
      (button) =>
        button.classList.contains('is-active') || button.getAttribute(activeAttribute) === 'true'
    );
    return active?.dataset.value ?? defaultValue ?? null;
  }

  const initialValue = getValue();
  if (initialValue) {
    setActive(initialValue);
  }

  group.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-value]');
    if (!button || !group.contains(button)) {
      return;
    }
    const nextValue = setActive(button.dataset.value);
    if (onChange) {
      onChange(nextValue, button);
    }
  });

  return { getValue, setValue: setActive };
}

initInputLengthLimiter();
