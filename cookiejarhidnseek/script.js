const startBtn = document.getElementById('start-btn');
const gameContainer = document.getElementById('game-container');
const player = document.getElementById('player');
const enemy = document.getElementById('enemy');
const fire = document.getElementById('fire');
const timerElement = document.getElementById('timer');
const invisibilityElement = document.getElementById('invisibility');
const ammoElement = document.getElementById('ammo');
const messageElement = document.getElementById('message');
const audio = document.getElementById('game-audio');
const volumeControl = document.getElementById('volume');

let playerPos = { x: 50, y: 50 };
let enemyPos = { x: window.innerWidth - 100, y: window.innerHeight - 100 };
let totalTime = 6000; // 3 minutes and 21 seconds (in seconds)
let keysPressed = {};
let gameActive = false;
let laserAmmo = 5;
let invisibilityReady = true;
let invisibilityActive = false;
let reloadInProgress = false;
let fires = [];
let laserElements = [];
let enemyStunned = false; // To track if the enemy is stunned
let fireClearReady = true; // Cooldown for clearing fires
let invisibilityCooldownReady = true; // Cooldown for invisibility

// Start the game
startBtn.addEventListener('click', () => {
  gameActive = true;
  startBtn.style.display = 'none';
  document.getElementById('menu').style.display = 'none'; // Hide the menu section
  gameContainer.style.display = 'block'; // Show the game container
  audio.play(); // Start audio
  audio.loop = true; // Loop the audio
  startGame();
});

// Timer countdown
function updateTimer() {
  if (totalTime > 0) {
    totalTime--;
    let minutes = Math.floor(totalTime / 6000);
    let seconds = totalTime % 6000;
    timerElement.textContent = `${seconds < 10 ? '0' : ''}${seconds}`;
  } else {
    endGame('win');
  }
}

// Audio volume control
volumeControl.addEventListener('input', (e) => {
  audio.volume = e.target.value;
});

// Player movement
window.addEventListener('keydown', (e) => {
  keysPressed[e.key.toLowerCase()] = true;
});

window.addEventListener('keyup', (e) => {
  keysPressed[e.key.toLowerCase()] = false;
});

function movePlayer() {
  if (keysPressed['w']) playerPos.y -= 5;
  if (keysPressed['s']) playerPos.y += 5;
  if (keysPressed['a']) playerPos.x -= 5;
  if (keysPressed['d']) playerPos.x += 5;

  playerPos.x = Math.max(0, Math.min(window.innerWidth - 80, playerPos.x));
  playerPos.y = Math.max(0, Math.min(window.innerHeight - 80, playerPos.y));

  player.style.left = `${playerPos.x}px`;
  player.style.top = `${playerPos.y}px`;
}

// Enemy movement (simple following)
function moveEnemy() {
  if (enemyStunned || invisibilityActive) return; // Stop the enemy from moving while stunned or invisible
  
  let dx = playerPos.x - enemyPos.x;
  let dy = playerPos.y - enemyPos.y;
  let distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > 5) {
    enemyPos.x += (dx / distance) * 6; // NPC speed changed to 6
    enemyPos.y += (dy / distance) * 6; // NPC speed changed to 6
  }

  enemyPos.x = Math.max(0, Math.min(window.innerWidth - 50, enemyPos.x)); // Smaller hitbox (50px)
  enemyPos.y = Math.max(0, Math.min(window.innerHeight - 50, enemyPos.y)); // Smaller hitbox (50px)

  enemy.style.left = `${enemyPos.x}px`;
  enemy.style.top = `${enemyPos.y}px`;

  // Check for collision with the player
  if (checkCollision(playerPos, enemyPos, 50)) {
    endGame('lose', 'Should\'nt have come today if you valued your life 💀');
  }
}

// Laser shooting
window.addEventListener('mousedown', (e) => {
  if (e.button === 0 && laserAmmo > 0 && gameActive) {
    shootLaser(e.clientX, e.clientY); // Pass mouse position to aim
  }
});

function shootLaser(targetX, targetY) {
  if (laserAmmo > 0) {
    const laser = document.createElement('div');
    laser.classList.add('laser');
    laser.style.left = `${playerPos.x + 40}px`;
    laser.style.top = `${playerPos.y + 40}px`;
    gameContainer.appendChild(laser);
    laserElements.push(laser);
    laserAmmo--;
    ammoElement.textContent = `Ammo: ${laserAmmo}/5`;

    // Calculate laser direction and rotation
    let dx = targetX - (playerPos.x + 40);
    let dy = targetY - (playerPos.y + 40);
    let distance = Math.sqrt(dx * dx + dy * dy);

    // Normalize the direction vector
    let directionX = dx / distance;
    let directionY = dy / distance;

    // Rotate the laser based on the direction of the mouse click
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    laser.style.transform = `rotate(${angle}deg)`; // Rotate the laser

    // Move laser in the direction of the mouse
    let laserSpeed = 10;
    let laserInterval = setInterval(() => {
      let currentLeft = parseInt(laser.style.left);
      let currentTop = parseInt(laser.style.top);
      laser.style.left = `${currentLeft + directionX * laserSpeed}px`;
      laser.style.top = `${currentTop + directionY * laserSpeed}px`;

      // Check if laser hits the enemy
      if (checkCollision({ x: currentLeft, y: currentTop }, enemyPos, 50)) {
        stunEnemy();
        clearInterval(laserInterval);
        gameContainer.removeChild(laser);
        laserElements = laserElements.filter(l => l !== laser);
      }

      // Remove laser after it moves out of bounds
      if (currentLeft > window.innerWidth || currentTop > window.innerHeight || currentLeft < 0 || currentTop < 0) {
        clearInterval(laserInterval);
        gameContainer.removeChild(laser);
        laserElements = laserElements.filter(l => l !== laser);
      }
    }, 10);
  }
}

function stunEnemy() {
  enemyStunned = true;
  setTimeout(() => {
    enemyStunned = false;
  }, 1500); // Stun the enemy for 1.5 seconds
}

// Fire obstacles
function spawnFire() {
  if (fires.length < 30 && fireClearReady) { // Allow between 15 to 30 fires
    let fireElement = document.createElement('div');
    fireElement.classList.add('fire');

    // Prevent fire from spawning on the player's position
    let fireX, fireY;
    do {
      fireX = Math.random() * (window.innerWidth - 80);
      fireY = Math.random() * (window.innerHeight - 80);
    } while (checkCollision({ x: fireX, y: fireY }, playerPos, 80));

    fireElement.style.left = `${fireX}px`;
    fireElement.style.top = `${fireY}px`;
    gameContainer.appendChild(fireElement);
    fires.push(fireElement);

    let fireDuration = Math.floor(Math.random() * (30000 - 4000) + 4000); // between 4s and 30s
    setTimeout(() => {
      fireElement.remove();
      fires = fires.filter(f => f !== fireElement);
    }, fireDuration);
  }
}

// Check collision (basic box collision)
function checkCollision(pos1, pos2, size) {
  return pos1.x < pos2.x + size &&
         pos1.x + size > pos2.x &&
         pos1.y < pos2.y + size &&
         pos1.y + size > pos2.y;
}

// Fire collision with player
function checkFireCollision() {
  fires.forEach(fireElement => {
    let firePos = {
      x: parseInt(fireElement.style.left),
      y: parseInt(fireElement.style.top)
    };
    if (checkCollision(playerPos, firePos, 50)) { // Smaller fire hitbox
      endGame('lose', 'Who let her cook? 🔥');
    }
  });
}

// Invisibility ability
window.addEventListener('keydown', (e) => {
  if (e.key === ' ' && invisibilityReady && !invisibilityActive) {
    activateInvisibility();
  }
  if (e.key === 'e' && fireClearReady) {
    clearFires();
  }
});

function activateInvisibility() {
  invisibilityActive = true;
  player.style.background = 'url("trans_cookie.png") no-repeat center center/contain';
  invisibilityElement.textContent = 'Invisibility Active!';
  invisibilityElement.style.backgroundColor = 'rgba(0, 255, 0, 0.5)'; // Change color to indicate invisibility
  setTimeout(() => {
    invisibilityActive = false;
    player.style.background = 'url("player_cookie.png") no-repeat center center/contain'; // Revert to normal image
    invisibilityElement.textContent = 'Invisibility Ready!';
    invisibilityElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Revert color
  }, 1500); // Invisibility lasts for 1.5 seconds
  invisibilityReady = false;
  setTimeout(() => {
    invisibilityReady = true; // Reset invisibility cooldown
  }, 10000); // 10 seconds cooldown
}

function clearFires() {
  // Remove all fires
  fires.forEach(fire => fire.remove());
  fires = [];
  
  fireClearReady = false;
  setTimeout(() => {
    fireClearReady = true; // Reset fire clear cooldown
  }, 5000); // 5 seconds cooldown
}

// Reload ammo
window.addEventListener('keydown', (e) => {
  if (e.key === 'r' && laserAmmo < 5 && !reloadInProgress) {
    reloadAmmo();
  }
});

function reloadAmmo() {
  reloadInProgress = true;
  ammoElement.textContent = 'Reloading...';
  setTimeout(() => {
    laserAmmo = 5;
    ammoElement.textContent = `Ammo: 5/5`;
    reloadInProgress = false;
  }, 3000); // 3 seconds to reload
}

// Game loop
function gameLoop() {
  if (gameActive) {
    movePlayer();
    moveEnemy();
    checkFireCollision(); // Check for collision with fire
    spawnFire(); // Check for fire obstacle spawning
    updateTimer();
    requestAnimationFrame(gameLoop);
  }
}

// Start the game
function startGame() {
  gameActive = true;
  totalTime = 6000; // 3 minutes and 21 seconds
  laserAmmo = 5;
  fires = [];
  laserElements = [];
  gameLoop();
}

// End game with win or lose
function endGame(result, message = '') {
  gameActive = false;
  messageElement.textContent = message || `You ${result === 'win' ? 'Won!' : 'Lost!'}`;
  gameContainer.style.display = 'none'; // Hide game container
  document.getElementById('menu').style.display = 'block'; // Show menu
  if(result==='win')
    setTimeout(() => {
      window.location.href = 'win.html';
  }, 20);
  // Redirect to main.html if the player loses
  if (result === 'lose') {
    setTimeout(() => {
      window.location.href = '../main.html';
    }, 2000); // Delay for 2 seconds before redirecting
  }
}
