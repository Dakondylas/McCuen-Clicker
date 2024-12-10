let playerHealth = 100;
let botHealth = 100;
let selectedCharacter = null;

const player = document.getElementById('player');
const bot = document.getElementById('bot');
let playerX = 100; // Initial horizontal position of player
let playerY = 200; // Initial vertical position of player
let botX = 600;    // Initial horizontal position of bot
let botY = 200;    // Initial vertical position of bot

let frame = 0;       // Current frame for walking animation
let attackFrame = 0; // Current frame for attack animation
let isAttacking = false;

function selectCharacter(character) {
    selectedCharacter = character;
    document.getElementById('character-selection').classList.add('hidden');
    document.getElementById('game').classList.remove('hidden');
    player.classList.remove('warrior', 'mage', 'archer');
    player.classList.add(character.toLowerCase());
    startGame();
}

function startGame() {
    const playerHealthDisplay = document.getElementById('player-health');
    const botHealthDisplay = document.getElementById('bot-health');

    // Player movement and attack
    document.addEventListener('keydown', (e) => {
        if (!isAttacking) {
            switch (e.key) {
                case 'w': // Move up
                    playerY = Math.max(0, playerY - 10);
                    break;
                case 's': // Move down
                    playerY = Math.min(450, playerY + 10); // Game height is 500px
                    break;
                case 'a': // Move left
                    playerX = Math.max(0, playerX - 10);
                    break;
                case 'd': // Move right
                    playerX = Math.min(750, playerX + 10); // Game width is 800px
                    break;
                case 'j': // Attack
                    triggerAttack();
                    break;
            }
        }
        updatePlayerPosition();
    });

    // AI Bot Logic (movement and attack)
    setInterval(() => {
        moveBot();
        if (isInRange()) {
            playerHealth -= Math.floor(Math.random() * 10) + 5;
            playerHealthDisplay.textContent = playerHealth;
            checkGameOver();
        }
    }, 1000);

    // Animation Loop for walking
    setInterval(() => {
        if (!isAttacking) {
            frame = (frame + 1) % 8; // Cycle through 8 frames for walking (8 frames total)
            updateAnimation();
        }
    }, 100);
}

function updatePlayerPosition() {
    player.style.left = `${playerX}px`;
    player.style.top = `${playerY}px`;
}

function updateAnimation() {
    if (selectedCharacter === 'Warrior') {
        // Walking animation: 8 frames
        player.style.backgroundPosition = `-${frame * 128}px 0px`;
    } else if (selectedCharacter === 'Mage') {
        // Walking animation for Mage
        player.style.backgroundPosition = `-${frame * 128}px 0px`;
    } else if (selectedCharacter === 'Archer') {
        // Walking animation for Archer
        player.style.backgroundPosition = `-${frame * 128}px 0px`;
    }
}

function triggerAttack() {
    if (isAttacking) return; // Prevent triggering another attack during an ongoing attack
    isAttacking = true;
    attackFrame = 0;
 
    // Set the attack sprite sheet
    player.style.backgroundImage = 'url("Soldier-Attack01.png")'; // Replace with correct path
    player.style.backgroundSize = '768px 128px'; // Adjust sprite sheet size
    player.style.backgroundPosition = '0px 0px'; // Start at the first frame
 
    const attackInterval = setInterval(() => {
        // Update background position for each frame of the attack animation
        player.style.backgroundPosition = `-${attackFrame * 128}px 0px`; // Adjust frame width
 
        attackFrame++;
        if (attackFrame >= 6) { // Stop after 6 frames (adjust based on sprite sheet)
            clearInterval(attackInterval);
            player.style.backgroundImage = 'url("Soldier-Walk.png")'; // Reset to walking sprite
            player.style.backgroundSize = '1024px 128px'; // Adjust sprite sheet size
            isAttacking = false; // Reset attacking state
        }
    }, 100); // Adjust speed (in milliseconds) between frames
}



function isInRange() {
    const playerRect = player.getBoundingClientRect();
    const botRect = bot.getBoundingClientRect();

    const xDistance = Math.abs(playerRect.left - botRect.left);
    const yDistance = Math.abs(playerRect.top - botRect.top);

    // Match hitbox to the bot cube's size
    if (xDistance < 96 && yDistance < 96 && isAttacking) {
        botHealth -= 10; // Damage dealt to the bot
        document.getElementById('bot-health').textContent = botHealth;
    }
    return xDistance < 96 && yDistance < 96; // Adjusted range check
}


function moveBot() {
    const directions = ['up', 'down', 'left', 'right'];
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];

    isBotRunning = true;
    isBotAttacking = false;

    // Bot moves
    switch (randomDirection) {
        case 'up':
            botY = Math.max(0, botY - 10);
            break;
        case 'down':
            botY = Math.min(450, botY + 10);
            break;
        case 'left':
            botX = Math.max(0, botX - 10);
            break;
        case 'right':
            botX = Math.min(750, botX + 10);
            break;
    }
    updateBotPosition();

    // Set bot to running animation
    bot.classList.remove('bot-idle', 'bot-attacking');
    bot.classList.add('bot-running');
}
function updateBotPosition() {
    bot.style.left = `${botX}px`;
    bot.style.top = `${botY}px`;
    bot.style.width = '96px';  // Width of one frame
    bot.style.height = '96px'; // Height of one frame
}

function triggerBotAttack() {
    if (isBotAttacking) return;
    isBotAttacking = true;
    botAttackFrame = 0;

    // Ensure sprite sheet path is correct
    bot.style.backgroundImage = 'url("Orc-Attack01.png")'; 
    bot.style.backgroundSize = '576px 96px'; // Adjust sprite sheet size for attack animation
    bot.style.backgroundPosition = '0px 0px';

    const attackInterval = setInterval(() => {
        bot.style.backgroundPosition = `-${botAttackFrame * 96}px 0px`;

        botAttackFrame++;
        if (botAttackFrame >= 6) { // Reset to walking animation after 6 frames
            clearInterval(attackInterval);
            bot.style.backgroundImage = 'url("Orc-Walk.png")';
            bot.style.backgroundSize = '768px 96px';
            isBotAttacking = false;
        }
    }, 100);
}


function botIdleState() {
    if (!isBotRunning && !isBotAttacking) {
        bot.classList.add('bot-idle');
    }
}

// Continuously check bot state and apply appropriate animation
setInterval(() => {
    if (!isBotAttacking && !isBotRunning) {
        botIdleState();
    }
}, 100);

function botCheckAttackRange() {
    const playerRect = player.getBoundingClientRect();
    const botRect = bot.getBoundingClientRect();

    const xDistance = Math.abs(playerRect.left - botRect.left);
    const yDistance = Math.abs(playerRect.top - botRect.top);

    if (xDistance < 96 && yDistance < 96 && !isBotAttacking) { // Match the cube size
        triggerBotAttack();
        playerHealth -= Math.floor(Math.random() * 15) + 5; // Bot deals damage
        document.getElementById('player-health').textContent = playerHealth;
        checkGameOver();
    }
}



function checkGameOver() {
    if (playerHealth <= 0) {
        alert('You Lost! Game Over.');
        resetGame();
    } else if (botHealth <= 0) {
        alert('You Won! Congratulations!');
        resetGame();
    }
}

function resetGame() {
    playerHealth = 150;
    botHealth = 100;
    playerX = 100;
    playerY = 200;
    botX = 600;
    botY = 200;
    document.getElementById('player-health').textContent = playerHealth;
    document.getElementById('bot-health').textContent = botHealth;
    updatePlayerPosition();
    updateBotPosition();
}
