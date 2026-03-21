function clampToRange(input, value) {
  const min = Number(input?.min);
  const max = Number(input?.max);
  let nextValue = Number(value);

  if (!Number.isFinite(nextValue)) {
    nextValue = Number(input?.value) || 0;
  }
  if (Number.isFinite(min)) {
    nextValue = Math.max(min, nextValue);
  }
  if (Number.isFinite(max)) {
    nextValue = Math.min(max, nextValue);
  }
  return nextValue;
}

export function updateRangeFill(input) {
  if (!input || input.type !== 'range') {
    return;
  }

  const min = Number(input.min) || 0;
  const max = Number(input.max) || 100;
  const value = Number(input.value) || 0;
  const pct = max === min ? 0 : ((value - min) / (max - min)) * 100;
  input.style.setProperty('--fill', `${pct}%`);
}

export function wireRangeWithField({
  rangeInput,
  textInput,
  formatFieldValue = (value) => String(value),
  parseFieldValue = (value) => Number(value),
  onVisualUpdate,
}) {
  if (!rangeInput || !textInput) {
    return {
      syncFromRange() {},
      commitField() {},
    };
  }

  const syncFromRange = () => {
    updateRangeFill(rangeInput);
    textInput.value = formatFieldValue(Number(rangeInput.value) || 0);
    onVisualUpdate?.();
  };

  const commitField = () => {
    const parsed = parseFieldValue(textInput.value);
    const nextValue = clampToRange(rangeInput, parsed);
    rangeInput.value = String(nextValue);
    syncFromRange();
  };

  rangeInput.addEventListener('input', syncFromRange);

  textInput.addEventListener('change', commitField);
  textInput.addEventListener('blur', commitField);
  textInput.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') {
      return;
    }
    event.preventDefault();
    commitField();
    textInput.blur();
  });

  syncFromRange();

  return {
    syncFromRange,
    commitField,
  };
}

export function revealResultPanel({
  resultPanel,
  focusTarget,
  viewportQuery = '(max-width: 720px)',
}) {
  if (!resultPanel || typeof window === 'undefined') {
    return;
  }

  const rect = resultPanel.getBoundingClientRect();
  const isMobile = window.matchMedia(viewportQuery).matches;
  const needsScroll = isMobile && (rect.top < 92 || rect.bottom > window.innerHeight - 40);

  if (needsScroll) {
    resultPanel.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  const focusEl = focusTarget || resultPanel;
  if (!focusEl || typeof focusEl.focus !== 'function') {
    return;
  }

  if (!focusEl.hasAttribute('tabindex')) {
    focusEl.setAttribute('tabindex', '-1');
  }

  window.setTimeout(() => {
    focusEl.focus({ preventScroll: true });
  }, needsScroll ? 220 : 0);
}
