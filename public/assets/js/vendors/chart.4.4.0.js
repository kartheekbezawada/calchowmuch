export function drawLineChart(canvas, points, options = {}) {
  if (!canvas || !Array.isArray(points) || points.length === 0) {
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }

  const {
    padding = 28,
    lineColor = "#2563eb",
    gridColor = "#e2e8f0",
    textColor = "#475569",
    backgroundColor = "#ffffff",
    labelFormatter = value => value.toString(),
  } = options;

  const rect = canvas.getBoundingClientRect();
  const width = Math.max(rect.width, 1);
  const height = Math.max(rect.height, 1);
  const pixelRatio = window.devicePixelRatio || 1;

  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;
  ctx.scale(pixelRatio, pixelRatio);

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  const minValue = Math.min(...points);
  const maxValue = Math.max(...points);
  const range = maxValue - minValue || 1;

  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;

  const xStep = plotWidth / Math.max(points.length - 1, 1);

  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;

  const gridLines = 4;
  for (let i = 0; i <= gridLines; i += 1) {
    const y = padding + (plotHeight / gridLines) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2;
  ctx.beginPath();

  points.forEach((value, index) => {
    const x = padding + xStep * index;
    const y = padding + plotHeight - ((value - minValue) / range) * plotHeight;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  ctx.fillStyle = textColor;
  ctx.font = "12px system-ui, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  ctx.fillText(labelFormatter(maxValue), padding, padding - 6);

  ctx.textBaseline = "top";
  ctx.fillText(labelFormatter(minValue), padding, height - padding + 6);
}
