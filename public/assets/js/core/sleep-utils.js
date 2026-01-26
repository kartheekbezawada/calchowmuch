export const SLEEP_CYCLES = [4, 5, 6];
export const CYCLE_MINUTES = 90;
export const FALL_ASLEEP_MINUTES = 15;

export function addMinutes(date, minutes) {
  const next = new Date(date.getTime());
  next.setMinutes(next.getMinutes() + minutes);
  return next;
}

export function roundToMinute(date) {
  const rounded = new Date(date.getTime());
  rounded.setSeconds(0, 0);
  return rounded;
}

export function roundToNextQuarterHour(date) {
  const rounded = new Date(date.getTime());
  const minutes = rounded.getMinutes();
  const remainder = minutes % 15;
  const increment = remainder === 0 ? 0 : 15 - remainder;
  rounded.setMinutes(minutes + increment, 0, 0);
  return rounded;
}

export function calculateSleepRecommendations({ mode, date }) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return [];
  }

  const baseTime = roundToMinute(date);

  return SLEEP_CYCLES.map((cycles) => {
    const totalMinutes = cycles * CYCLE_MINUTES + FALL_ASLEEP_MINUTES;
    if (mode === 'sleep') {
      return {
        cycles,
        sleepTime: baseTime,
        wakeTime: roundToMinute(addMinutes(baseTime, totalMinutes)),
      };
    }

    return {
      cycles,
      sleepTime: roundToMinute(addMinutes(baseTime, -totalMinutes)),
      wakeTime: baseTime,
    };
  });
}
