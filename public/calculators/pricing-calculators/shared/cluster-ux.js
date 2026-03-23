export function createStaleResultController({
  resultPanel,
  staleTargets = [],
  getSignature = () => '',
}) {
  let lastFreshSignature = '';

  const setStaleState = (isStale) => {
    if (resultPanel) {
      resultPanel.dataset.resultStale = isStale ? 'true' : 'false';
    }

    staleTargets.forEach((target) => {
      if (!target) {
        return;
      }

      target.hidden = !isStale;
      target.setAttribute('aria-hidden', isStale ? 'false' : 'true');
    });
  };

  const sync = () => {
    const nextSignature = getSignature();
    setStaleState(Boolean(lastFreshSignature) && nextSignature !== lastFreshSignature);
  };

  const markFresh = () => {
    lastFreshSignature = getSignature();
    setStaleState(false);
  };

  const watchElements = (elements = [], eventNames = ['input', 'change']) => {
    elements.filter(Boolean).forEach((element) => {
      eventNames.forEach((eventName) => {
        element.addEventListener(eventName, () => {
          window.requestAnimationFrame(sync);
        });
      });
    });
  };

  return {
    markFresh,
    sync,
    watchElements,
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
