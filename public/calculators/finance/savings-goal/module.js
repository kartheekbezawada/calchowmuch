import { calculateSavingsGoal } from '/assets/js/core/time-value-utils.js';
import { formatCurrency, formatNumber } from '/assets/js/utils/formatters.js';

const DOM = {
  modeButtons: document.querySelectorAll('[data-button-group="sg-mode"] button'),
  timeUnitButtons: document.querySelectorAll('[data-button-group="sg-time-unit"] button'),
  compoundingButtons: document.querySelectorAll('[data-button-group="sg-compounding"] button'),
  timingButtons: document.querySelectorAll('[data-button-group="sg-timing"] button'),

  inputs: {
    goal: document.getElementById('sg-goal'),
    current: document.getElementById('sg-current'),
    contribution: document.getElementById('sg-contribution'),
    time: document.getElementById('sg-time'),
    rate: document.getElementById('sg-rate'),
  },

  displays: {
    goal: document.getElementById('sg-goal-display'),
    current: document.getElementById('sg-current-display'),
    contribution: document.getElementById('sg-contribution-display'),
    time: document.getElementById('sg-time-display'),
    rate: document.getElementById('sg-rate-display'),
  },

  rows: {
    contribution: document.getElementById('sg-contribution-row'),
    time: document.getElementById('sg-time-row'),
  },

  btnCalc: document.getElementById('sg-calc'),

  results: {
    label: document.getElementById('sg-result-label'),
    main: document.getElementById('sg-result'),
    sub: document.getElementById('sg-result-sub'),
  },

  snaps: {
    goal: document.querySelector('[data-sg="snap-goal"]'),
    current: document.querySelector('[data-sg="snap-current"]'),
    contribution: document.querySelector('[data-sg="snap-contribution"]'),
    time: document.querySelector('[data-sg="snap-time"]'),
    final: document.querySelector('[data-sg="snap-final"]'),
    interest: document.querySelector('[data-sg="snap-interest"]'),
    rowContribution: document.getElementById('snap-row-contribution'),
    rowTime: document.getElementById('snap-row-time'),
  },
};

let state = {
  mode: 'time-to-goal', // 'time-to-goal' | 'monthly-needed'
  timeUnit: 'years', // 'years' | 'months'
  compounding: 'monthly',
  timing: 'end',
};

function init() {
  attachListeners();
  updateUI();
  calculate();
}

function attachListeners() {
  // Mode Toggle
  DOM.modeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      setButtonGroup(DOM.modeButtons, btn);
      state.mode = btn.dataset.value;
      updateUI();
      calculate();
    });
  });

  // Time Unit Toggle
  DOM.timeUnitButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      setButtonGroup(DOM.timeUnitButtons, btn);
      state.timeUnit = btn.dataset.value;
      updateTimeInputRange();
      updateDisplay('time', DOM.inputs.time.value);
      calculate();
    });
  });

  // Compounding Toggle
  DOM.compoundingButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      setButtonGroup(DOM.compoundingButtons, btn);
      state.compounding = btn.dataset.value;
      calculate();
    });
  });

  // Timing Toggle
  DOM.timingButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      setButtonGroup(DOM.timingButtons, btn);
      state.timing = btn.dataset.value;
      calculate();
    });
  });

  // Sliders
  Object.keys(DOM.inputs).forEach((key) => {
    const input = DOM.inputs[key];
    if (input) {
      input.addEventListener('input', () => {
        updateDisplay(key, input.value);
        calculate();
      });
    }
  });

  DOM.btnCalc.addEventListener('click', calculate);
}

function setButtonGroup(buttons, activeBtn) {
  buttons.forEach((b) => {
    b.classList.remove('is-active');
    b.setAttribute('aria-pressed', 'false');
  });
  activeBtn.classList.add('is-active');
  activeBtn.setAttribute('aria-pressed', 'true');
}

function updateUI() {
  if (state.mode === 'time-to-goal') {
    DOM.rows.contribution.classList.remove('hidden');
    DOM.rows.time.classList.add('hidden');
    DOM.results.label.textContent = 'Estimated Time to Goal';
    DOM.snaps.rowContribution.classList.remove('hidden');
    DOM.snaps.rowTime.classList.add('hidden');
  } else {
    DOM.rows.contribution.classList.add('hidden');
    DOM.rows.time.classList.remove('hidden');
    DOM.results.label.textContent = 'Required Monthly Savings';
    DOM.snaps.rowContribution.classList.add('hidden');
    DOM.snaps.rowTime.classList.remove('hidden');
  }
}

function updateTimeInputRange() {
  const input = DOM.inputs.time;
  if (state.timeUnit === 'years') {
    input.min = 1;
    input.max = 50;
    input.step = 1;
    if (input.value > 50) input.value = 50;
  } else {
    input.min = 1;
    input.max = 600; // 50 years * 12
    input.step = 1;
    // Scale value roughly when switching? Or just keep it separate?
    // Let's just clamp for simplicity or keep raw value if fits.
    if (input.value > 600) input.value = 600;

    // UX improvement: if user had 3 years selected, switch to 36 months?
    // For now, keep simple direct value mapping unless it feels weird.
  }
}

function updateDisplay(key, value) {
  const display = DOM.displays[key];
  if (!display) return;

  if (key === 'goal' || key === 'current' || key === 'contribution') {
    display.textContent = formatCurrency(value, 'USD').replace('.00', '');
  } else if (key === 'rate') {
    display.textContent = `${value}%`;
  } else if (key === 'time') {
    display.textContent = `${value} ${state.timeUnit === 'years' ? (value == 1 ? 'Year' : 'Years') : value == 1 ? 'Month' : 'Months'}`;
  }
}

function calculate() {
  const params = {
    mode: state.mode,
    goalAmount: Number(DOM.inputs.goal.value),
    currentSavings: Number(DOM.inputs.current.value),
    monthlyContribution: Number(DOM.inputs.contribution.value),
    targetTime: Number(DOM.inputs.time.value),
    targetTimeUnit: state.timeUnit,
    annualRate: Number(DOM.inputs.rate.value),
    compounding: state.compounding,
    contributionTiming: state.timing,
  };

  const result = calculateSavingsGoal(params);

  renderResult(result, params);
}

function renderResult(result, params) {
  if (!result) {
    DOM.results.main.textContent = 'Invalid input';
    return;
  }

  // Snapshots
  DOM.snaps.goal.textContent = formatCurrency(params.goalAmount, 'USD').replace('.00', '');
  DOM.snaps.current.textContent = formatCurrency(params.currentSavings, 'USD').replace('.00', '');
  DOM.snaps.final.textContent = formatCurrency(result.finalBalance, 'USD');
  DOM.snaps.interest.textContent = formatCurrency(result.totalInterestEarned, 'USD');

  if (state.mode === 'time-to-goal') {
    DOM.snaps.contribution.textContent = formatCurrency(params.monthlyContribution, 'USD').replace(
      '.00',
      ''
    );

    if (result.monthsToGoal === 0 && params.goalAmount <= params.currentSavings) {
      DOM.results.main.textContent = 'Goal Reached!';
      DOM.results.sub.textContent = 'Your current savings already exceed the goal.';
    } else if (result.monthsToGoal === 0) {
      DOM.results.main.textContent = '---';
    } else {
      const years = result.yearsPart;
      const months = result.remainingMonthsPart;
      let timeString = '';
      if (years > 0) timeString += `${years} ${years === 1 ? 'Year' : 'Years'}`;
      if (years > 0 && months > 0) timeString += ', ';
      if (months > 0 || years === 0) timeString += `${months} ${months === 1 ? 'Month' : 'Months'}`;

      DOM.results.main.textContent = timeString;
      DOM.results.sub.textContent = `Total Contributions: ${formatCurrency(result.totalContributions, 'USD')}`;
    }
  } else {
    // Monthly needed
    DOM.snaps.time.textContent = `${params.targetTime} ${state.timeUnit === 'years' ? 'Years' : 'Months'}`;

    if (params.goalAmount <= params.currentSavings) {
      DOM.results.main.textContent = 'Goal Reached!';
      DOM.results.sub.textContent = 'No further savings needed.';
    } else {
      DOM.results.main.textContent = formatCurrency(result.requiredMonthlySavings, 'USD');
      DOM.results.sub.textContent = `Total Contributions: ${formatCurrency(result.totalContributions, 'USD')}`;
    }
  }
}

// Initialize on load
init();
