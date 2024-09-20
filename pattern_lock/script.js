const patternContainer = document.getElementById("pattern-container");
const patternDisplay = document.getElementById("pattern-display");
const resetButton = document.getElementById("reset-button");
const canvas = document.getElementById("pattern-lines");
const ctx = canvas.getContext("2d");

canvas.width = patternContainer.offsetWidth;
canvas.height = patternContainer.offsetHeight;

let pattern = [];
let isDragging = false;
let isError = false;
let lastCircleId = null;
let lineColor = "#10b010"; // Default line color is green

// Define adjacency rules for circles in a 3x3 grid
const adjacentMap = {
  1: [2, 4, 5],
  2: [1, 3, 4, 5, 6],
  3: [2, 5, 6],
  4: [1, 2, 5, 7, 8],
  5: [1, 2, 3, 4, 6, 7, 8, 9],
  6: [2, 3, 5, 8, 9],
  7: [4, 5, 8],
  8: [4, 5, 6, 7, 9],
  9: [5, 6, 8]
};

// Get the center of a circle
function getCircleCenter(circle) {
  const rect = circle.getBoundingClientRect();
  const containerRect = patternContainer.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2 - containerRect.left,
    y: rect.top + rect.height / 2 - containerRect.top
  };
}

// Draw a line between two circles
function drawLine(startCircle, endCircle) {
  const startPos = getCircleCenter(startCircle);
  const endPos = getCircleCenter(endCircle);
  
  ctx.beginPath();
  ctx.moveTo(startPos.x, startPos.y);
  ctx.lineTo(endPos.x, endPos.y);
  ctx.strokeStyle = lineColor; // Set the line color dynamically
  ctx.lineWidth = 4;
  ctx.stroke();
}

// Clear the canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Add a circle to the pattern
function addToPattern(circle) {
  const id = parseInt(circle.id);

  if (!lastCircleId) {
    lastCircleId = id;
    pattern.push(id);
    circle.classList.add("active");
    patternDisplay.textContent = pattern.join(" -> ");
    return;
  }

  // If the circle is adjacent and not already part of the pattern
  if (adjacentMap[lastCircleId].includes(id) && !pattern.includes(id)) {
    const lastCircle = document.getElementById(lastCircleId);
    pattern.push(id);
    drawLine(lastCircle, circle); // Draw the connecting line
    circle.classList.add("active");
    patternDisplay.textContent = pattern.join(" -> ");
    lastCircleId = id;
  } else {
    triggerError(); // Trigger error if the circle is not adjacent
  }
}

// Trigger error (show error and change the line color to red)
function triggerError() {
  isError = true;
  lineColor = "#ff0000"; // Change line color to red
  redrawLines(); // Redraw all lines in red
  
  const circles = document.querySelectorAll(".circle.active");
  circles.forEach(circle => {
    circle.classList.add("error");
  });

  setTimeout(resetPattern, 1000); // Reset after 1 second
}

// Redraw the lines in red when there's an error
function redrawLines() {
  clearCanvas();
  lineColor = "#ff0000"; // Red for error
  
  for (let i = 0; i < pattern.length - 1; i++) {
    const startCircle = document.getElementById(pattern[i]);
    const endCircle = document.getElementById(pattern[i + 1]);
    drawLine(startCircle, endCircle);
  }
}

// Handle mouse events
patternContainer.addEventListener("mousedown", (e) => {
  if (e.target.classList.contains("circle") && !isError) {
    isDragging = true;
    addToPattern(e.target);
  }
});

patternContainer.addEventListener("mousemove", (e) => {
  if (isDragging && e.target.classList.contains("circle") && !isError) {
    addToPattern(e.target);
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});

// Reset the pattern
function resetPattern() {
  isError = false;
  pattern = [];
  lastCircleId = null;
  lineColor = "#10b010"; // Reset line color to green
  clearCanvas();
  patternDisplay.textContent = '';
  document.querySelectorAll(".circle").forEach(circle => {
    circle.classList.remove("active", "error");
  });
}

// Reset button handler
resetButton.addEventListener("click", resetPattern);
