export const NAP_TYPES = {
  quick: { label: 'Quick Nap', minutes: 20 },
  power: { label: 'Power Nap', minutes: 30 },
  afternoon: { label: 'Afternoon Nap', minutes: 90 },
};

export const ENERGY_NAP_GOALS = {
  quick: { label: 'Quick', minutes: 15 },
  strong: { label: 'Strong', minutes: 25 },
  full: { label: 'Full', minutes: 90 },
};

export const ENERGY_NAP_DEFAULT_GOAL = 'full';

export const DEFAULT_NAP_TYPE = 'power';
export const DEFAULT_BUFFER_MINUTES = 5;
export const BUFFER_OPTIONS = [0, 5, 10];

export function getNapType(type) {
  return NAP_TYPES[type] ?? NAP_TYPES[DEFAULT_NAP_TYPE];
}

export function parseTimeString(value) {
  if (!value) {
    return null;
  }
  const [hoursRaw, minutesRaw] = value.split(':');
  const hours = Number.parseInt(hoursRaw, 10);
  const minutes = Number.parseInt(minutesRaw, 10);
  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) {
    return null;
  }
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null;
  }
  return { hours, minutes };
}

export function calculateWakeTime(startTime, napMinutes, bufferMinutes) {
  if (!startTime || !Number.isFinite(napMinutes) || !Number.isFinite(bufferMinutes)) {
    return null;
  }
  const startTotal = startTime.hours * 60 + startTime.minutes;
  if (!Number.isFinite(startTotal)) {
    return null;
  }
  const totalMinutes = startTotal + napMinutes + bufferMinutes;
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return { hours, minutes };
}

export function getTimeBucket(startTime) {
  if (!startTime) {
    return 'Day';
  }

  const totalMinutes = startTime.hours * 60 + startTime.minutes;
  if (totalMinutes >= 18 * 60 || totalMinutes < 5 * 60) {
    return 'Night';
  }
  if (totalMinutes >= 12 * 60) {
    return 'Afternoon';
  }
  return 'Day';
}

export function getEnergyNapRecommendation(goal, startTime, isExplicitGoal = false) {
  const selectedGoal = ENERGY_NAP_GOALS[goal] ? goal : ENERGY_NAP_DEFAULT_GOAL;
  const bucket = getTimeBucket(startTime);
  const isNight = bucket === 'Night';
  const isFullGoal = selectedGoal === 'full';

  if (isNight && isFullGoal && !isExplicitGoal) {
    return {
      selectedGoal,
      effectiveGoal: 'strong',
      recommendedMinutes: ENERGY_NAP_GOALS.strong.minutes,
      timeBucket: bucket,
      warning:
        'Late-night full naps can disturb nighttime sleep. Recommendation downgraded to 25 minutes.',
      overridden: true,
    };
  }

  if (isNight && isFullGoal && isExplicitGoal) {
    return {
      selectedGoal,
      effectiveGoal: selectedGoal,
      recommendedMinutes: ENERGY_NAP_GOALS[selectedGoal].minutes,
      timeBucket: bucket,
      warning: 'A full 90-minute nap late at night may delay bedtime and reduce sleep quality.',
      overridden: false,
    };
  }

  return {
    selectedGoal,
    effectiveGoal: selectedGoal,
    recommendedMinutes: ENERGY_NAP_GOALS[selectedGoal].minutes,
    timeBucket: bucket,
    warning: '',
    overridden: false,
  };
}
