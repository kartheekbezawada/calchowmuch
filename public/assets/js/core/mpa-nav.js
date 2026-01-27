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

const searchInput = document.querySelector('.header-search-input');
const leftNavContent = document.querySelector('#left-nav-content');

if (searchInput && leftNavContent) {
  const normalize = (value) => value.trim().toLowerCase();
  const standardCategories = Array.from(leftNavContent.querySelectorAll('.nav-category'));
  const mathCategories = Array.from(leftNavContent.querySelectorAll('.math-nav-category'));
  const allItems = [
    ...leftNavContent.querySelectorAll('.nav-item'),
    ...leftNavContent.querySelectorAll('.math-nav-item'),
  ];

  const resetSearch = () => {
    allItems.forEach((item) => item.classList.remove('is-hidden'));
    standardCategories.forEach((category) => {
      category.classList.remove('is-hidden', 'is-search-open');
    });
    mathCategories.forEach((category) => {
      category.classList.remove('is-hidden', 'is-search-open');
    });
  };

  const updateSearch = () => {
    const query = normalize(searchInput.value);
    const searching = query.length > 0;
    leftNavContent.classList.toggle('is-searching', searching);

    if (!searching) {
      resetSearch();
      return;
    }

    standardCategories.forEach((category) => {
      const items = Array.from(category.querySelectorAll('.nav-item'));
      let hasMatch = false;
      items.forEach((item) => {
        const match = normalize(item.textContent).includes(query);
        item.classList.toggle('is-hidden', !match);
        if (match) {
          hasMatch = true;
        }
      });
      category.classList.toggle('is-search-open', hasMatch);
      category.classList.toggle('is-hidden', !hasMatch);
    });

    mathCategories.forEach((category) => {
      const items = Array.from(category.querySelectorAll('.math-nav-item'));
      let hasMatch = false;
      items.forEach((item) => {
        const match = normalize(item.textContent).includes(query);
        item.classList.toggle('is-hidden', !match);
        if (match) {
          hasMatch = true;
        }
      });
      category.classList.toggle('is-search-open', hasMatch);
      category.classList.toggle('is-hidden', !hasMatch);
    });
  };

  searchInput.addEventListener('input', updateSearch);
  searchInput.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') {
      return;
    }
    event.preventDefault();
    if (!searchInput.value.trim()) {
      return;
    }
    const firstMatch = allItems.find((item) => !item.classList.contains('is-hidden'));
    if (firstMatch && firstMatch.getAttribute('href')) {
      window.location.href = firstMatch.getAttribute('href');
    }
  });
}
