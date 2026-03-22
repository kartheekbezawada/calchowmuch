function markOverflowingSwitchers() {
  document.querySelectorAll('[data-td-switch-chips]').forEach((container) => {
    const hasOverflow = container.scrollWidth > container.clientWidth + 4;
    container.toggleAttribute('data-has-overflow', hasOverflow);
  });
}

function initTimeAndDateClusterUx() {
  document.body?.setAttribute('data-td-cluster-ready', 'true');
  markOverflowingSwitchers();
  window.addEventListener('resize', markOverflowingSwitchers, { passive: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTimeAndDateClusterUx, { once: true });
} else {
  initTimeAndDateClusterUx();
}