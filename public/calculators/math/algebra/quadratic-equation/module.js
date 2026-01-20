import { formatNumber } from '/assets/js/core/format.js';
import { hasMaxDigits, toNumber } from '/assets/js/core/validate.js';
import { solveQuadratic } from '/assets/js/core/algebra.js';

const aInput = document.querySelector('#quad-a');
const bInput = document.querySelector('#quad-b');
const cInput = document.querySelector('#quad-c');
const solveButton = document.querySelector('#quad-solve');
const resultDiv = document.querySelector('#quad-result');
const detailDiv = document.querySelector('#quad-detail');
const equationText = document.querySelector('#equation-text');
const graphContainer = document.querySelector('#quad-graph-container');
const graphCanvas = document.querySelector('#quad-graph');
const graphInfo = document.querySelector('#quad-graph-info');

function updateEquationDisplay() {
  const a = toNumber(aInput.value, 1);
  const b = toNumber(bInput.value, 0);
  const c = toNumber(cInput.value, 0);
  
  let equation = '';
  
  // Handle coefficient a
  if (a === 1) {
    equation += 'x²';
  } else if (a === -1) {
    equation += '-x²';
  } else {
    equation += `${formatNumber(a)}x²`;
  }
  
  // Handle coefficient b
  if (b > 0) {
    equation += ` + ${b === 1 ? '' : formatNumber(b)}x`;
  } else if (b < 0) {
    equation += ` - ${b === -1 ? '' : formatNumber(Math.abs(b))}x`;
  }
  
  // Handle coefficient c
  if (c > 0) {
    equation += ` + ${formatNumber(c)}`;
  } else if (c < 0) {
    equation += ` - ${formatNumber(Math.abs(c))}`;
  }
  
  equation += ' = 0';
  equationText.textContent = equation;
}

function solveQuadratic() {
  resultDiv.textContent = '';
  detailDiv.textContent = '';
  graphContainer.style.display = 'none';

  const invalidLength = [aInput, bInput, cInput].find((input) => !hasMaxDigits(input.value, 12));
  if (invalidLength) {
    resultDiv.textContent = 'Inputs are limited to 12 digits.';
    return;
  }
  
  const a = toNumber(aInput.value, 1);
  const b = toNumber(bInput.value, 0);
  const c = toNumber(cInput.value, 0);
  
  const solution = solveQuadratic(a, b, c);
  if (solution.error) {
    resultDiv.textContent = `Error: ${solution.error}`;
    return;
  }
  const discriminant = solution.discriminant;
  
  let solutionsHTML = '';
  let detailHTML = '';
  
  // Step-by-step solution
  detailHTML += `<div class="solution-steps">`;
  detailHTML += `<h4>Step-by-Step Solution:</h4>`;
  detailHTML += `<ol>`;
  detailHTML += `<li>Given equation: ${equationText.textContent}</li>`;
  detailHTML += `<li>Using quadratic formula: x = (-b ± √(b² - 4ac)) / (2a)</li>`;
  detailHTML += `<li>Substitute values: a = ${formatNumber(a)}, b = ${formatNumber(b)}, c = ${formatNumber(c)}</li>`;
  detailHTML += `<li>Calculate discriminant: Δ = b² - 4ac = ${formatNumber(b)}² - 4(${formatNumber(a)})(${formatNumber(c)}) = ${formatNumber(discriminant)}</li>`;
  detailHTML += `</ol>`;
  detailHTML += `</div>`;
  
  // Discriminant analysis
  detailHTML += `<div class="discriminant-info">`;
  detailHTML += `<strong>Discriminant Analysis (Δ = ${formatNumber(discriminant)}):</strong><br>`;
  
  if (solution.type === 'two-real') {
    const x1 = solution.roots[0];
    const x2 = solution.roots[1];
    
    solutionsHTML = `<strong>Two Real Solutions:</strong><br>`;
    solutionsHTML += `x₁ = ${formatNumber(x1, { maximumFractionDigits: 6 })}<br>`;
    solutionsHTML += `x₂ = ${formatNumber(x2, { maximumFractionDigits: 6 })}`;
    
    detailHTML += `Δ > 0: Two distinct real roots<br>`;
    detailHTML += `x₁ = (-${formatNumber(b)} + √${formatNumber(discriminant)}) / (2 × ${formatNumber(a)}) = ${formatNumber(x1, { maximumFractionDigits: 6 })}<br>`;
    detailHTML += `x₂ = (-${formatNumber(b)} - √${formatNumber(discriminant)}) / (2 × ${formatNumber(a)}) = ${formatNumber(x2, { maximumFractionDigits: 6 })}`;
    
    drawGraph(a, b, c, [x1, x2], 'two-real');
  } else if (solution.type === 'one-real') {
    const x = solution.roots[0];
    
    solutionsHTML = `<strong>One Real Solution (Repeated Root):</strong><br>`;
    solutionsHTML += `x = ${formatNumber(x, { maximumFractionDigits: 6 })}`;
    
    detailHTML += `Δ = 0: One repeated real root<br>`;
    detailHTML += `x = -${formatNumber(b)} / (2 × ${formatNumber(a)}) = ${formatNumber(x, { maximumFractionDigits: 6 })}`;
    
    drawGraph(a, b, c, [x], 'one-real');
  } else {
    const realPart = solution.roots[0].real;
    const imaginaryPart = Math.abs(solution.roots[0].imaginary);
    
    solutionsHTML = `<strong>Two Complex Solutions:</strong><br>`;
    solutionsHTML += `x₁ = ${formatNumber(realPart, { maximumFractionDigits: 6 })} + ${formatNumber(imaginaryPart, { maximumFractionDigits: 6 })}i<br>`;
    solutionsHTML += `x₂ = ${formatNumber(realPart, { maximumFractionDigits: 6 })} - ${formatNumber(imaginaryPart, { maximumFractionDigits: 6 })}i`;
    
    detailHTML += `Δ < 0: Two complex conjugate roots<br>`;
    detailHTML += `x₁ = ${formatNumber(realPart, { maximumFractionDigits: 6 })} + ${formatNumber(imaginaryPart, { maximumFractionDigits: 6 })}i<br>`;
    detailHTML += `x₂ = ${formatNumber(realPart, { maximumFractionDigits: 6 })} - ${formatNumber(imaginaryPart, { maximumFractionDigits: 6 })}i`;
    
    drawGraph(a, b, c, [], 'complex');
  }
  
  detailHTML += `</div>`;
  
  resultDiv.innerHTML = solutionsHTML;
  detailDiv.innerHTML = detailHTML;
}

function drawGraph(a, b, c, roots, solutionType) {
  const ctx = graphCanvas.getContext('2d');
  const width = graphCanvas.width;
  const height = graphCanvas.height;
  
  // Clear canvas
  ctx.clearRect(0, 0, width, height);
  
  // Set up coordinate system
  const vertex_x = -b / (2 * a);
  const vertex_y = a * vertex_x * vertex_x + b * vertex_x + c;
  
  // Determine appropriate viewing window
  let xMin = vertex_x - 5;
  let xMax = vertex_x + 5;
  let yMin = vertex_y - 10;
  let yMax = vertex_y + 10;
  
  // Adjust for roots if they exist
  if (roots.length > 0) {
    const minRoot = Math.min(...roots);
    const maxRoot = Math.max(...roots);
    const rootRange = Math.max(maxRoot - minRoot, 4);
    xMin = Math.min(xMin, minRoot - rootRange * 0.3);
    xMax = Math.max(xMax, maxRoot + rootRange * 0.3);
  }
  
  const xScale = width / (xMax - xMin);
  const yScale = height / (yMax - yMin);
  
  // Helper function to convert coordinates
  function toCanvas(x, y) {
    return {
      x: (x - xMin) * xScale,
      y: height - (y - yMin) * yScale
    };
  }
  
  // Draw grid
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  
  // Vertical grid lines
  for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
    const canvasX = (x - xMin) * xScale;
    ctx.beginPath();
    ctx.moveTo(canvasX, 0);
    ctx.lineTo(canvasX, height);
    ctx.stroke();
  }
  
  // Horizontal grid lines
  for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y++) {
    const canvasY = height - (y - yMin) * yScale;
    ctx.beginPath();
    ctx.moveTo(0, canvasY);
    ctx.lineTo(width, canvasY);
    ctx.stroke();
  }
  
  // Draw axes
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 2;
  
  // X-axis
  const xAxisY = height - (0 - yMin) * yScale;
  if (xAxisY >= 0 && xAxisY <= height) {
    ctx.beginPath();
    ctx.moveTo(0, xAxisY);
    ctx.lineTo(width, xAxisY);
    ctx.stroke();
  }
  
  // Y-axis
  const yAxisX = (0 - xMin) * xScale;
  if (yAxisX >= 0 && yAxisX <= width) {
    ctx.beginPath();
    ctx.moveTo(yAxisX, 0);
    ctx.lineTo(yAxisX, height);
    ctx.stroke();
  }
  
  // Draw parabola
  ctx.strokeStyle = '#1e40af';
  ctx.lineWidth = 3;
  ctx.beginPath();
  
  let firstPoint = true;
  for (let canvasX = 0; canvasX <= width; canvasX++) {
    const x = xMin + (canvasX / width) * (xMax - xMin);
    const y = a * x * x + b * x + c;
    const canvasPos = toCanvas(x, y);
    
    if (firstPoint) {
      ctx.moveTo(canvasPos.x, canvasPos.y);
      firstPoint = false;
    } else {
      ctx.lineTo(canvasPos.x, canvasPos.y);
    }
  }
  ctx.stroke();
  
  // Mark vertex
  const vertexPos = toCanvas(vertex_x, vertex_y);
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.arc(vertexPos.x, vertexPos.y, 4, 0, 2 * Math.PI);
  ctx.fill();
  
  // Mark roots if they exist
  if (roots.length > 0) {
    ctx.fillStyle = '#16a34a';
    roots.forEach(root => {
      const rootPos = toCanvas(root, 0);
      if (rootPos.x >= 0 && rootPos.x <= width) {
        ctx.beginPath();
        ctx.arc(rootPos.x, rootPos.y, 4, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
  }
  
  graphContainer.style.display = 'block';
  
  // Graph info
  let infoHTML = `<p><strong>Vertex:</strong> (${formatNumber(vertex_x, { maximumFractionDigits: 3 })}, ${formatNumber(vertex_y, { maximumFractionDigits: 3 })})</p>`;
  infoHTML += `<p><strong>Axis of Symmetry:</strong> x = ${formatNumber(vertex_x, { maximumFractionDigits: 3 })}</p>`;
  infoHTML += `<p><strong>Opens:</strong> ${a > 0 ? 'Upward' : 'Downward'}</p>`;
  
  if (roots.length > 0) {
    infoHTML += `<p><strong>X-intercepts:</strong> `;
    infoHTML += roots.map(root => `(${formatNumber(root, { maximumFractionDigits: 3 })}, 0)`).join(', ');
    infoHTML += `</p>`;
  }
  
  const yIntercept = c;
  infoHTML += `<p><strong>Y-intercept:</strong> (0, ${formatNumber(yIntercept, { maximumFractionDigits: 3 })})</p>`;
  
  graphInfo.innerHTML = infoHTML;
}

// Event listeners
aInput.addEventListener('input', updateEquationDisplay);
bInput.addEventListener('input', updateEquationDisplay);
cInput.addEventListener('input', updateEquationDisplay);
solveButton.addEventListener('click', solveQuadratic);

// Initialize
updateEquationDisplay();
