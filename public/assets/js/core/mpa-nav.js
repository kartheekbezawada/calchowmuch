const standardToggles = document.querySelectorAll('.nav-category-toggle');
standardToggles.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const category = toggle.closest('.nav-category');
    if (!category) {
      return;
    }
    category.classList.toggle('is-collapsed');
    const expanded = !category.classList.contains('is-collapsed');
    toggle.setAttribute('aria-expanded', expanded.toString());
    const indicator = category.querySelector('.nav-category-indicator');
    if (indicator) {
      indicator.textContent = expanded ? '-' : '+';
    }
  });
});

const mathToggles = document.querySelectorAll('.math-nav-category-toggle');
mathToggles.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const category = toggle.closest('.math-nav-category');
    if (!category) {
      return;
    }
    category.classList.toggle('is-collapsed');
    const expanded = !category.classList.contains('is-collapsed');
    toggle.setAttribute('aria-expanded', expanded.toString());
    const chevron = toggle.querySelector('.math-nav-category-chevron');
    if (chevron) {
      const open = chevron.dataset.chevronOpen;
      const closed = chevron.dataset.chevronClosed;
      if (open && closed) {
        chevron.innerHTML = expanded ? open : closed;
      }
    }
  });
});
