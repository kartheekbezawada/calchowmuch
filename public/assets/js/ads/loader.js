const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));

function loadAdSlots() {
  const slots = document.querySelectorAll('.ad-slot');
  if (!slots.length) {
    return;
  }

  slots.forEach((slot, index) => {
    const label = slot.dataset.adSlot || `slot-${index + 1}`;
    slot.classList.add('is-loading');

    idleCallback(() => {
      slot.classList.remove('is-loading');
      slot.innerHTML = `
        <span class="ad-label">Sponsored</span>
        <span class="ad-copy">Ad slot ready: ${label}</span>
      `;
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadAdSlots);
} else {
  loadAdSlots();
}
