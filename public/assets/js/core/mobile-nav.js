(function () {
  // Wait for DOM content to be loaded incase script runs before header
  document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.querySelector('.mobile-menu-toggle');
    const leftNav = document.querySelector('.left-nav');
    if (hamburgerBtn && leftNav) {
      hamburgerBtn.addEventListener('click', () => {
        const isOpen = leftNav.classList.toggle('is-mobile-open');
        hamburgerBtn.innerHTML = isOpen
          ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12" /></svg>`
          : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>`;

        // Prevent body scroll when menu is open
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (
          leftNav.classList.contains('is-mobile-open') &&
          !leftNav.contains(e.target) &&
          !hamburgerBtn.contains(e.target)
        ) {
          leftNav.classList.remove('is-mobile-open');
          hamburgerBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18" /></svg>`;
          document.body.style.overflow = '';
        }
      });
    }
  });
})();
