const DRAW_STEPS = 160;

function isValidPositive(value) {
  return Number.isFinite(value) && value > 0;
}

export function calculateNaturalLog(value) {
  if (!isValidPositive(value)) {
    return null;
  }
  return Math.log(value);
}

export function calculateLogBase(value, base) {
  if (!isValidPositive(value) || !isValidPositive(base) || base === 1) {
    return null;
  }
  return Math.log(value) / Math.log(base);
}

export function calculateLogChangeOfBase(value, fromBase, toBase) {
  if (!isValidPositive(value) || !isValidPositive(fromBase) || !isValidPositive(toBase)) {
    return null;
  }
  const fromValue = Math.log(value) / Math.log(fromBase);
  const toValue = Math.log(value) / Math.log(toBase);
  return { fromValue, toValue };
}

export function logProductRule(base, x, y) {
  if (!isValidPositive(base) || !isValidPositive(x) || !isValidPositive(y)) {
    return null;
  }
  return Math.log(x * y) / Math.log(base);
}

export function logQuotientRule(base, numerator, denominator) {
  if (!isValidPositive(base) || !isValidPositive(numerator) || !isValidPositive(denominator)) {
    return null;
  }
  return Math.log(numerator / denominator) / Math.log(base);
}

export function logPowerRule(base, argument, exponent) {
  if (!isValidPositive(base) || !isValidPositive(argument) || !Number.isFinite(exponent)) {
    return null;
  }
  return Math.log(Math.pow(argument, exponent)) / Math.log(base);
}

export function solveSimpleExponential({ base, target, multiplier = 1, shift = 0 }) {
  if (!isValidPositive(base) || !isValidPositive(target)) {
    return null;
  }
  const logTarget = Math.log(target) / Math.log(base);
  const adjusted = (logTarget - shift) / multiplier;
  if (!Number.isFinite(adjusted)) {
    return null;
  }
  return adjusted;
}

export function convertLogScaleValue({ type, amplitude, concentration, magnitude, reference = 1 }) {
  if (type === 'decibel') {
    if (!isValidPositive(amplitude) || !isValidPositive(reference)) {
      return null;
    }
    return 20 * Math.log10(amplitude / reference);
  }
  if (type === 'ph') {
    if (!isValidPositive(concentration)) {
      return null;
    }
    return -Math.log10(concentration);
  }
  if (type === 'richter') {
    if (!isValidPositive(magnitude) || !isValidPositive(reference)) {
      return null;
    }
    return Math.log10(magnitude / reference);
  }
  return null;
}

function clearCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  return ctx;
}

function drawAxes(ctx, width, height, margin = 32) {
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(margin, height - margin);
  ctx.lineTo(width - margin, height - margin);
  ctx.moveTo(margin, height - margin);
  ctx.lineTo(margin, margin);
  ctx.stroke();
}

export function drawLogCurve(canvas, base = Math.E, highlightX = 1) {
  const ctx = clearCanvas(canvas);
  const width = canvas.width;
  const height = canvas.height;
  const margin = 32;

  drawAxes(ctx, width, height, margin);

  const xMin = 0.1;
  const xMax = 10;
  const yMin = -4;
  const yMax = 4;

  ctx.strokeStyle = '#2563eb';
  ctx.lineWidth = 2;
  ctx.beginPath();

  for (let i = 0; i <= DRAW_STEPS; i += 1) {
    const t = i / DRAW_STEPS;
    const x = xMin + t * (xMax - xMin);
    const y = Math.log(x) / Math.log(base);
    const canvasX = margin + ((x - xMin) / (xMax - xMin)) * (width - 2 * margin);
    const canvasY = height - margin - ((y - yMin) / (yMax - yMin)) * (height - 2 * margin);
    if (i === 0) {
      ctx.moveTo(canvasX, canvasY);
    } else {
      ctx.lineTo(canvasX, canvasY);
    }
  }
  ctx.stroke();

  const safeX = Math.max(xMin, Math.min(highlightX, xMax));
  const highlightY = Math.log(safeX) / Math.log(base);
  const highlightXPos = margin + ((safeX - xMin) / (xMax - xMin)) * (width - 2 * margin);
  const highlightYPos = height - margin - ((highlightY - yMin) / (yMax - yMin)) * (height - 2 * margin);

  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(highlightXPos, height - margin);
  ctx.lineTo(highlightXPos, highlightYPos);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(margin, highlightYPos);
  ctx.lineTo(highlightXPos, highlightYPos);
  ctx.stroke();

  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.arc(highlightXPos, highlightYPos, 4, 0, Math.PI * 2);
  ctx.fill();
}
