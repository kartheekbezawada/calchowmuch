const DEFAULTS = [
  { match: /apr|interest|rate|%/i, min: 0, max: 30, step: 0.1, color: 'orange' },
  { match: /term|years|year/i, min: 1, max: 30, step: 1, color: 'violet' },
  { match: /month/i, min: 1, max: 120, step: 1, color: 'violet' },
  { match: /hour/i, min: 0, max: 80, step: 0.5, color: 'blue' },
  { match: /minute/i, min: 0, max: 240, step: 5, color: 'blue' },
  { match: /down|deposit|trade|fee|fees|tax/i, min: 0, max: 50000, step: 50, color: 'green' },
  {
    match: /price|amount|balance|loan|principal|cost|salary|income|payment|value/i,
    min: 0,
    max: 250000,
    step: 100,
    color: 'blue',
  },
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function resolveRange(input, labelText) {
  const parsedMin = Number(input.min);
  const parsedMax = Number(input.max);
  const parsedStep = Number(input.step);

  let min = Number.isFinite(parsedMin) ? parsedMin : null;
  let max = Number.isFinite(parsedMax) ? parsedMax : null;
  let step = Number.isFinite(parsedStep) ? parsedStep : null;
  let color = 'blue';

  const text = `${labelText} ${input.name ?? ''} ${input.id ?? ''}`.toLowerCase();
  const fallback = DEFAULTS.find((entry) => entry.match.test(text));

  if (fallback) {
    min = min ?? fallback.min;
    max = max ?? fallback.max;
    step = step ?? fallback.step;
    color = fallback.color;
  }

  if (min === null) {
    min = 0;
  }
  if (max === null) {
    max = 100;
  }
  if (step === null || step <= 0) {
    step = 1;
  }

  const currentValue = Number(input.value);
  if (Number.isFinite(currentValue)) {
    max = Math.max(max, currentValue * 2);
  }

  return { min, max, step, color };
}

function updateSliderFill(slider) {
  const min = Number(slider.min);
  const max = Number(slider.max);
  const value = Number(slider.value);
  if (!Number.isFinite(min) || !Number.isFinite(max) || max <= min) {
    slider.style.setProperty('--range-fill', '0%');
    return;
  }
  const percent = ((value - min) / (max - min)) * 100;
  slider.style.setProperty('--range-fill', `${clamp(percent, 0, 100)}%`);
}

function buildSlider(input, labelText) {
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.className = 'slider-range';
  slider.dataset.slider = 'true';

  const { min, max, step, color } = resolveRange(input, labelText);
  slider.min = String(min);
  slider.max = String(max);
  slider.step = String(step);
  slider.value = input.value || String(min);
  slider.classList.add(`slider-${color}`);
  updateSliderFill(slider);

  slider.addEventListener('input', () => {
    input.value = slider.value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    updateSliderFill(slider);
  });

  input.addEventListener('input', () => {
    if (!Number.isFinite(Number(input.value))) {
      return;
    }
    slider.value = input.value;
    updateSliderFill(slider);
  });

  return slider;
}

export function initSliderEnhancer() {
  const inputs = Array.from(document.querySelectorAll('.calculator-ui input[type="number"]'));
  inputs.forEach((input) => {
    if (input.dataset.sliderInit === 'true') {
      return;
    }
    if (input.dataset.slider === 'false' || input.classList.contains('no-slider')) {
      return;
    }

    const row = input.closest('.input-row') ?? input.parentElement;
    if (!row) {
      return;
    }

    const label = row.querySelector('label');
    const labelText = label ? label.textContent ?? '' : '';

    const slider = buildSlider(input, labelText);
    const wrapper = document.createElement('div');
    wrapper.className = 'slider-wrapper';
    wrapper.appendChild(slider);

    input.insertAdjacentElement('afterend', wrapper);
    input.dataset.sliderInit = 'true';
  });
}
