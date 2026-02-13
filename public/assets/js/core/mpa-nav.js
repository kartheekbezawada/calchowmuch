import '/assets/js/core/mobile-nav.js';

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

const topNavDisplayOverrides = new Map([
  ['Math', { label: 'Math' }],
  ['Home Loan', { label: 'Home Loan' }],
  ['Credit Cards', { label: 'Credit Cards' }],
  ['Auto Loans', { label: 'Auto Loans' }],
  ['Finance', { label: 'Finance', leftIcon: '$', rightIcon: '£' }],
  ['Time & Date', { label: 'Time & Date' }],
  ['Percentage Calculators', { label: 'Percentage', leftIcon: '%' }],
  ['Math Calculator', { label: 'Math' }],
  ['Home Loan Calculator', { label: 'Home Loan' }],
  ['Credit Card Calculator', { label: 'Credit Cards' }],
  ['Auto Loan Calculator', { label: 'Auto Loans' }],
  ['Finance Calculator', { label: 'Finance', leftIcon: '$', rightIcon: '£' }],
  ['Time & Date Calculator', { label: 'Time & Date' }],
  ['Percentage Calculator', { label: 'Percentage', leftIcon: '%' }],
  ['Percentage', { label: 'Percentage', leftIcon: '%' }],
]);

const topNavLinks = document.querySelectorAll('.top-nav .top-nav-link');
topNavLinks.forEach((link) => {
  const label = link.querySelector('.nav-label');
  if (!label) {
    return;
  }

  const normalizedLabel = label.textContent.replace(/\s+/g, ' ').trim();
  const override = topNavDisplayOverrides.get(normalizedLabel);
  if (!override) {
    return;
  }

  link
    .querySelectorAll('.nav-icon[data-generated="top-nav"], .nav-icon-right[data-generated="top-nav"], .nav-icon')
    .forEach((iconNode) => {
      const iconText = iconNode.textContent ? iconNode.textContent.trim() : '';
      if (iconNode.getAttribute('data-generated') === 'top-nav' || iconText === '💹' || iconText === '📊') {
        iconNode.remove();
      }
    });

  label.textContent = override.label;

  if (override.leftIcon) {
    let leftIcon = link.querySelector('.nav-icon:not(.nav-icon-right)');
    if (!leftIcon) {
      leftIcon = document.createElement('span');
      leftIcon.className = 'nav-icon';
      leftIcon.setAttribute('aria-hidden', 'true');
      leftIcon.setAttribute('data-generated', 'top-nav');
      link.insertBefore(leftIcon, label);
    }
    leftIcon.textContent = override.leftIcon;
  }

  if (override.rightIcon) {
    let rightIcon = link.querySelector('.nav-icon-right');
    if (!rightIcon) {
      rightIcon = document.createElement('span');
      rightIcon.className = 'nav-icon nav-icon-right';
      rightIcon.setAttribute('aria-hidden', 'true');
      rightIcon.setAttribute('data-generated', 'top-nav');
      label.insertAdjacentElement('afterend', rightIcon);
    }
    rightIcon.textContent = override.rightIcon;
  } else {
    const existingRightIcon = link.querySelector('.nav-icon-right');
    if (existingRightIcon && existingRightIcon.getAttribute('data-generated') === 'top-nav') {
      existingRightIcon.remove();
    }
  }
});

// Add ripple effect to nav items on click
const navItems = document.querySelectorAll('.nav-item');
navItems.forEach((item) => {
  item.addEventListener('click', function () {
    this.classList.add('ripple');
    setTimeout(() => {
      this.classList.remove('ripple');
    }, 600);
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
