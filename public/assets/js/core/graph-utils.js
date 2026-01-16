export function sampleValues(values, maxPoints) {
  if (!Array.isArray(values) || values.length <= maxPoints) {
    return values ?? [];
  }
  const step = Math.ceil(values.length / maxPoints);
  const sampled = [];
  for (let i = 0; i < values.length; i += step) {
    sampled.push(values[i]);
  }
  if (sampled.length && sampled[sampled.length - 1] !== values[values.length - 1]) {
    sampled.push(values[values.length - 1]);
  }
  return sampled;
}

export function getPaddedMinMax(values, padding = 0.1) {
  if (!Array.isArray(values) || values.length === 0) {
    return { min: 0, max: 1 };
  }
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return { min: 0, max: 1 };
  }
  if (min === max) {
    min -= 1;
    max += 1;
    return { min, max };
  }
  const range = max - min;
  const pad = range * padding;
  return { min: min - pad, max: max + pad };
}

export function buildPolyline(values, minValue, maxValue) {
  if (!Array.isArray(values) || values.length === 0) {
    return '';
  }
  const min = Number.isFinite(minValue) ? minValue : Math.min(...values);
  const max = Number.isFinite(maxValue) ? maxValue : Math.max(...values);
  const range = max - min;

  return values
    .map((value, index) => {
      const x = values.length === 1 ? 0 : (index / (values.length - 1)) * 100;
      const ratio = range === 0 ? 0.5 : (value - min) / range;
      const y = 100 - ratio * 100;
      const clampedY = Math.min(100, Math.max(0, y));
      return `${x.toFixed(2)},${clampedY.toFixed(2)}`;
    })
    .join(' ');
}
