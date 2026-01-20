import { formatNumber } from '/assets/js/core/format.js';
import { hasMaxDigits, toNumber } from '/assets/js/core/validate.js';
import { setupButtonGroup, setPageMetadata } from '/assets/js/core/ui.js';
import {
  SPECIAL_ANGLES,
  computeTrigValues,
  degToRad,
  formatAnglePair,
  getQuadrantFromDegrees,
  getReferenceAngleDegrees,
  getSpecialAngleInfo,
  normalizeDegrees,
  radToDeg,
} from '/assets/js/core/trigonometry.js';

const angleInput = document.querySelector('#unit-angle');
const angleUnitGroup = document.querySelector('[data-button-group="unit-angle-unit"]');
const angleUnitButtons = setupButtonGroup(angleUnitGroup, {
  defaultValue: 'deg',
  onChange: () => {
    updateResults();
  },
});
const resultDiv = document.querySelector('#unit-circle-result');
const detailDiv = document.querySelector('#unit-circle-detail');
const canvas = document.querySelector('#unit-circle-canvas');
const legend = document.querySelector('#unit-circle-legend');

const ctx = canvas.getContext('2d');
const center = { x: canvas.width / 2, y: canvas.height / 2 };
const radius = Math.min(canvas.width, canvas.height) / 2 - 24;

const standardAngles = SPECIAL_ANGLES.filter((angle) => angle !== 360);

const unitCircleMetadata = {
  title: 'Unit Circle Calculator | Calculate How Much',
  description:
    'Explore unit circle angles, quadrants, and exact trig values with interactive diagrams.',
  canonical: 'https://calchowmuch.com/calculators/math/trigonometry/unit-circle/',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Explore unit circle values',
    description: 'Map angles to sin, cos, and tan values using the interactive unit circle.',
    step: [
      {
        '@type': 'HowToStep',
        text: 'Enter an angle in degrees or radians.',
      },
      {
        '@type': 'HowToStep',
        text: 'Snap to a special angle on the circle to reveal exact values.',
      },
      {
        '@type': 'HowToStep',
        text: 'Read the quadrant, reference angle, and trig outputs.',
      },
    ],
  },
};

setPageMetadata(unitCircleMetadata);

function getAngleInDegrees() {
  const unit = angleUnitButtons?.getValue() ?? 'deg';
  const rawValue = toNumber(angleInput.value, 0);
  return unit === 'deg' ? rawValue : radToDeg(rawValue);
}

function setAngleInDegrees(degrees) {
  const unit = angleUnitButtons?.getValue() ?? 'deg';
  if (unit === 'deg') {
    angleInput.value = formatNumber(degrees, { maximumFractionDigits: 4 });
    return;
  }
  angleInput.value = formatNumber(degToRad(degrees), { maximumFractionDigits: 4 });
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

function drawUnitCircle(degrees) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(center.x - radius, center.y);
  ctx.lineTo(center.x + radius, center.y);
  ctx.moveTo(center.x, center.y - radius);
  ctx.lineTo(center.x, center.y + radius);
  ctx.stroke();

  ctx.fillStyle = '#1e40af';
  ctx.font = '11px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const points = standardAngles.map((angle) => {
    const radians = degToRad(angle);
    const x = center.x + radius * Math.cos(radians);
    const y = center.y - radius * Math.sin(radians);
    return { angle, x, y };
  });

  points.forEach((point) => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText(String(point.angle), point.x, point.y - 12);
  });

  const activeRadians = degToRad(normalizeDegrees(degrees));
  const activeX = center.x + radius * Math.cos(activeRadians);
  const activeY = center.y - radius * Math.sin(activeRadians);

  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(center.x, center.y);
  ctx.lineTo(activeX, activeY);
  ctx.stroke();

  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(activeX, activeY, 5, 0, Math.PI * 2);
  ctx.fill();

  legend.textContent = `Active angle: ${formatAnglePair(degrees)}`;
}

function findNearestStandardAngle(clickX, clickY) {
  let best = null;
  let bestDistance = Infinity;

  standardAngles.forEach((angle) => {
    const radians = degToRad(angle);
    const x = center.x + radius * Math.cos(radians);
    const y = center.y - radius * Math.sin(radians);
    const distance = Math.hypot(clickX - x, clickY - y);

    if (distance < bestDistance) {
      bestDistance = distance;
      best = angle;
    }
  });

  if (bestDistance <= 18) {
    return best;
  }

  return null;
}

function updateResults() {
  resultDiv.textContent = '';
  detailDiv.textContent = '';

  if (!hasMaxDigits(angleInput.value, 12)) {
    resultDiv.textContent = 'Inputs are limited to 12 digits.';
    return;
  }

  const degrees = getAngleInDegrees();
  const normalized = normalizeDegrees(degrees);
  const radians = degToRad(normalized);
  const trigValues = computeTrigValues(radians);
  const quadrant = getQuadrantFromDegrees(normalized);
  const reference = getReferenceAngleDegrees(normalized);
  const exact = getSpecialAngleInfo(normalized);

  const resultHtml = `
    <div class="result-grid">
      <div class="result-card">
        <div class="result-title">Angle</div>
        <p><strong>${formatAnglePair(normalized)}</strong></p>
        <p>Quadrant: <strong>${quadrant}</strong></p>
        <p>Reference angle: ${formatAnglePair(reference)}</p>
      </div>
      <div class="result-card">
        <div class="result-title">Sin</div>
        <p>${formatValue(trigValues.sin, exact?.sin)}</p>
        <p>Sign: ${Math.sign(trigValues.sin || 0) >= 0 ? '+' : '-'}</p>
      </div>
      <div class="result-card">
        <div class="result-title">Cos</div>
        <p>${formatValue(trigValues.cos, exact?.cos)}</p>
        <p>Sign: ${Math.sign(trigValues.cos || 0) >= 0 ? '+' : '-'}</p>
      </div>
      <div class="result-card">
        <div class="result-title">Tan</div>
        <p>${formatValue(trigValues.tan, exact?.tan)}</p>
        <p>Sign: ${trigValues.tan === null ? 'undefined' : Math.sign(trigValues.tan) >= 0 ? '+' : '-'}</p>
      </div>
    </div>
  `;

  const detailHtml = `
    <div class="solution-steps">
      <strong>Quick Notes</strong>
      <ol>
        <li>Exact values shown for standard angles: 0, 30, 45, 60, 90, ...</li>
        <li>Use the reference angle to match special triangles.</li>
        <li>When cos = 0, tan is undefined.</li>
      </ol>
    </div>
  `;

  resultDiv.innerHTML = resultHtml;
  detailDiv.innerHTML = detailHtml;

  drawUnitCircle(normalized);
}

canvas.addEventListener('click', (event) => {
  const rect = canvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;
  const selectedAngle = findNearestStandardAngle(clickX, clickY);
  if (selectedAngle !== null) {
    setAngleInDegrees(selectedAngle);
    updateResults();
  }
});

angleInput.addEventListener('input', updateResults);

updateResults();
