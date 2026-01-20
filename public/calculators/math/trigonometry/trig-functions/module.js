import { formatNumber } from '/assets/js/core/format.js';
import { hasMaxDigits, toNumber } from '/assets/js/core/validate.js';
import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import {
  computeTrigValues,
  degToRad,
  getSpecialAngleInfo,
} from '/assets/js/core/trigonometry.js';

const angleInput = document.querySelector('#trig-angle');
const angleUnitGroup = document.querySelector('[data-button-group="trig-angle-unit"]');
const angleUnitButtons = setupButtonGroup(angleUnitGroup, {
  defaultValue: 'deg',
});
const functionSelect = document.querySelector('#trig-graph-function');
const amplitudeInput = document.querySelector('#trig-amplitude');
const periodInput = document.querySelector('#trig-period');
const calcButton = document.querySelector('#trig-calc');
const resultDiv = document.querySelector('#trig-result');
const detailDiv = document.querySelector('#trig-detail');
const canvas = document.querySelector('#trig-graph');
const ctx = canvas.getContext('2d');

const trigFunctionsMetadata = {
  title: 'Trigonometric Functions Calculator | Calculate How Much',
  description:
    'Compute sin, cos, tan, sec, csc, and cot values and graph each function with custom amplitude and period.',
  canonical: 'https://calchowmuch.com/calculators/math/trigonometry/trig-functions/',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Graph trigonometric functions',
    description: 'Enter an angle, adjust amplitude and period, and analyze sin/cos/tan/sec/csc/cot outputs.',
    step: [
      {
        '@type': 'HowToStep',
        text: 'Enter an angle in degrees or radians to compute the six functions.',
      },
      {
        '@type': 'HowToStep',
        text: 'Adjust the amplitude and period sliders to reshape the graph.',
      },
      {
        '@type': 'HowToStep',
        text: 'Use the graph to inspect periodic behavior and undefined regions.',
      },
    ],
  },
};

setPageMetadata(trigFunctionsMetadata);

function getAngleDegrees() {
  const unit = angleUnitButtons?.getValue() ?? 'deg';
  const raw = toNumber(angleInput.value, 0);
  return unit === 'deg' ? raw : radToDeg(raw);
}

function formatExact(label) {
  if (!label || label === 'undefined') {
    return 'undefined';
  }
  return label.replace(/sqrt\((\d+)\)/g, 'sqrt($1)');
}

function formatValue(value, exactLabel) {
  if (value === null) {
    return 'undefined';
  }
  const numeric = formatNumber(value, { maximumFractionDigits: 6 });
  if (exactLabel) {
    return `${numeric} (${formatExact(exactLabel)})`;
  }
  return numeric;
}

function getFunctionValue(name, x) {
  if (name === 'sin') {
    return Math.sin(x);
  }
  if (name === 'cos') {
    return Math.cos(x);
  }
  if (name === 'tan') {
    const cos = Math.cos(x);
    return Math.abs(cos) < 1e-6 ? null : Math.tan(x);
  }
  if (name === 'sec') {
    const cos = Math.cos(x);
    return Math.abs(cos) < 1e-6 ? null : 1 / cos;
  }
  if (name === 'csc') {
    const sin = Math.sin(x);
    return Math.abs(sin) < 1e-6 ? null : 1 / sin;
  }
  if (name === 'cot') {
    const sin = Math.sin(x);
    return Math.abs(sin) < 1e-6 ? null : Math.cos(x) / sin;
  }
  return null;
}

function drawGraph() {
  const functionName = functionSelect.value;
  const amplitude = toNumber(amplitudeInput.value, 1);
  const period = toNumber(periodInput.value, Math.PI * 2);
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  if (!Number.isFinite(period) || period <= 0) {
    ctx.fillStyle = '#991b1b';
    ctx.fillText('Period must be positive.', 10, 20);
    return;
  }

  const xMin = -period;
  const xMax = period;
  const yMax = functionName === 'sin' || functionName === 'cos' ? amplitude * 1.2 : amplitude * 3;
  const yMin = -yMax;

  const xScale = width / (xMax - xMin);
  const yScale = height / (yMax - yMin);

  function toCanvas(x, y) {
    return {
      x: (x - xMin) * xScale,
      y: height - (y - yMin) * yScale,
    };
  }

  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i += 1) {
    const x = xMin + ((xMax - xMin) / 4) * i;
    const canvasX = toCanvas(x, 0).x;
    ctx.beginPath();
    ctx.moveTo(canvasX, 0);
    ctx.lineTo(canvasX, height);
    ctx.stroke();
  }

  for (let i = 0; i <= 4; i += 1) {
    const y = yMin + ((yMax - yMin) / 4) * i;
    const canvasY = toCanvas(0, y).y;
    ctx.beginPath();
    ctx.moveTo(0, canvasY);
    ctx.lineTo(width, canvasY);
    ctx.stroke();
  }

  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  const axisY = toCanvas(0, 0).y;
  ctx.beginPath();
  ctx.moveTo(0, axisY);
  ctx.lineTo(width, axisY);
  ctx.stroke();

  const axisX = toCanvas(0, 0).x;
  ctx.beginPath();
  ctx.moveTo(axisX, 0);
  ctx.lineTo(axisX, height);
  ctx.stroke();

  ctx.strokeStyle = '#1e40af';
  ctx.lineWidth = 2;
  ctx.beginPath();

  const steps = 360;
  let started = false;

  for (let i = 0; i <= steps; i += 1) {
    const x = xMin + ((xMax - xMin) * i) / steps;
    const rawValue = getFunctionValue(functionName, x);
    if (rawValue === null) {
      started = false;
      continue;
    }
    const y = rawValue * amplitude;
    if (Math.abs(y) > yMax * 1.2) {
      started = false;
      continue;
    }
    const point = toCanvas(x, y);
    if (!started) {
      ctx.moveTo(point.x, point.y);
      started = true;
    } else {
      ctx.lineTo(point.x, point.y);
    }
  }

  ctx.stroke();
}

function calculate() {
  resultDiv.textContent = '';
  detailDiv.textContent = '';

  const inputs = [angleInput, amplitudeInput, periodInput];
  const invalid = inputs.find((input) => !hasMaxDigits(input.value, 12));
  if (invalid) {
    resultDiv.textContent = 'Inputs are limited to 12 digits.';
    return;
  }

  const degrees = getAngleDegrees();
  const radians = degToRad(degrees);
  const trig = computeTrigValues(radians);
  const exact = getSpecialAngleInfo(degrees);

  const resultHtml = `
    <div class="result-grid">
      <div class="result-card">
        <div class="result-title">sin</div>
        <p>${formatValue(trig.sin, exact?.sin)}</p>
      </div>
      <div class="result-card">
        <div class="result-title">cos</div>
        <p>${formatValue(trig.cos, exact?.cos)}</p>
      </div>
      <div class="result-card">
        <div class="result-title">tan</div>
        <p>${formatValue(trig.tan, exact?.tan)}</p>
      </div>
      <div class="result-card">
        <div class="result-title">sec</div>
        <p>${formatValue(trig.sec, null)}</p>
      </div>
      <div class="result-card">
        <div class="result-title">csc</div>
        <p>${formatValue(trig.csc, null)}</p>
      </div>
      <div class="result-card">
        <div class="result-title">cot</div>
        <p>${formatValue(trig.cot, null)}</p>
      </div>
    </div>
  `;

  const detailHtml = `
    <div class="solution-steps">
      <strong>Identity Highlights</strong>
      <ol>
        <li>sin^2(x) + cos^2(x) = 1</li>
        <li>tan(x) = sin(x) / cos(x)</li>
        <li>sec(x) = 1 / cos(x), csc(x) = 1 / sin(x), cot(x) = cos(x) / sin(x)</li>
      </ol>
    </div>
  `;

  resultDiv.innerHTML = resultHtml;
  detailDiv.innerHTML = detailHtml;

  drawGraph();
}

calcButton.addEventListener('click', calculate);
[angleInput, amplitudeInput, periodInput, functionSelect].forEach((input) => {
  input.addEventListener('input', calculate);
});
angleUnitGroup?.addEventListener('click', calculate);

calculate();
