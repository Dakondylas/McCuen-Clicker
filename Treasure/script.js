// Get references to the DOM elements
const grid = document.getElementById('gameGrid');
const restartButton = document.getElementById('restartButton');

// Game parameters
const gridColumns = 60; // 60 columns
const gridRows = 50;    // 50 rows
const totalBoxes = gridColumns * gridRows; // 3000 boxes
let treasureLocation = null;
let isGameOver = false;

// Create the audio element and configure it
const audio = new Audio('The_Backyardigans_-_Treasure_ft_Jamia_Simone_Nash_Thomas_Sharkey_Corwin_C_Tuggles_Sean_Curley_[_YTBMP3.org_].mp3');
audio.loop = true; // Loop the audio
audio.volume = 0.5; // Optional: Set the volume (from 0.0 to 1.0)

// Function to start the audio once the game loads
function playAudio() {
  audio.play().catch((error) => {
    console.log('Audio playback failed:', error);
  });
}

// Function to create the grid dynamically
function createGrid() {
  grid.innerHTML = ''; // Clear previous grid if exists

  // Create grid squares
  for (let i = 0; i < totalBoxes; i++) {
    const square = document.createElement('div');
    square.addEventListener('click', () => handleSquareClick(i));
    grid.appendChild(square);
  }

  // Randomly assign a treasure location
  treasureLocation = Math.floor(Math.random() * totalBoxes);
  isGameOver = false;
  
  // Play the audio once the grid is created
  playAudio();
}

// Handle click on a square
function handleSquareClick(index) {
  if (isGameOver) return; // Prevent actions after game is over
  
  const square = grid.children[index];
  
  // Check if the clicked square contains the treasure
  if (index === treasureLocation) {
    square.style.backgroundColor = 'gold';
    alert('Congratulations! You found the treasure!');
    isGameOver = true;
  } else {
    square.style.backgroundColor = 'gray';
    square.style.pointerEvents = 'none'; // Disable clicking on this square
  }
}

// Restart the game
function restartGame() {
  createGrid();
  restartButton.disabled = false;
}

// Initialize the game
createGrid();

// Set up restart button functionality
restartButton.addEventListener('click', () => {
  restartButton.disabled = true;
  window.location.href = '../main.html';
});
