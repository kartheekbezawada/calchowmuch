/**
 * Theme toggle functionality
 * Handles the sun/moon toggle switch in the header
 */

export function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) {
    return;
  }

  toggle.addEventListener('click', () => {
    const isActive = toggle.classList.toggle('active');
    toggle.setAttribute('aria-checked', String(isActive));

    const slider = toggle.querySelector('.theme-toggle-slider');
    if (slider) {
      if (isActive) {
        slider.textContent = '🌙';
      } else {
        slider.textContent = '☀️';
      }
    }

    // Future: Add actual dark mode theme switching here
    // For now, this just provides the visual toggle animation
  });
}
