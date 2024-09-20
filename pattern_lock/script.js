const patternContainer = document.getElementById("pattern-container");
const patternDisplay = document.getElementById("pattern-display");
const resetButton = document.getElementById("reset-button");

let pattern = [];
let isDragging = false;
let isError = false;
let lastCircleId = null;  // To track the last selected circle

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

// Function to add circle to pattern
function addToPattern(circle) {
  const id = parseInt(circle.id);

  // If no circles have been selected yet, start with this one
  if (!lastCircleId) {
    lastCircleId = id;
    pattern.push(id);
    circle.classList.add("active");
    patternDisplay.textContent = pattern.join(" -> ");
    return;
  }

  // Check if the circle is adjacent to the last one in the pattern
  if (adjacentMap[lastCircleId].includes(id)) {
    pattern.push(id);
    circle.classList.add("active");
    patternDisplay.textContent = pattern.join(" -> ");
    lastCircleId = id;  // Update the last selected circle
  } else {
    // If not adjacent, trigger an error
    triggerError();
  }
}

// Trigger error (set all active circles to red and reset after a short delay)
function triggerError() {
  isError = true;
  const circles = document.querySelectorAll(".circle.active");
  circles.forEach(circle => {
    circle.classList.add("error");  // Add the error class (red color)
  });

  // Automatically reset the pattern after 1 second
  setTimeout(resetPattern, 1000);
}

// Start dragging when the mouse is pressed down
patternContainer.addEventListener("mousedown", (e) => {
  if (e.target.classList.contains("circle") && !isError) {
    isDragging = true;
    addToPattern(e.target);
  }
});

// Continue dragging over the circles
patternContainer.addEventListener("mousemove", (e) => {
  if (isDragging && e.target.classList.contains("circle") && !isError) {
    addToPattern(e.target);
  }
});

// Stop dragging when the mouse is released
document.addEventListener("mouseup", () => {
  isDragging = false;
});

// Reset the pattern when the reset button is clicked
resetButton.addEventListener("click", resetPattern);

function resetPattern() {
  isError = false;  // Reset error state
  pattern = [];
  lastCircleId = null;  // Reset the last circle
  patternDisplay.textContent = '';
  const circles = document.querySelectorAll(".circle");
  circles.forEach(circle => {
    circle.classList.remove("active", "error");  // Remove both active and error classes
  });
}
