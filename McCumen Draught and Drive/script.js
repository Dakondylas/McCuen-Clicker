
document.addEventListener('DOMContentLoaded', () => {
    // Screens
    const startScreen = document.getElementById('startScreen');
    const gameScreen = document.getElementById('gameScreen');
    const gameOverScreen = document.getElementById('gameOverScreen');

    // Buttons
    const startButton = document.getElementById('startButton');
    const restartButton = document.getElementById('restartButton');
    const drinkButton = document.getElementById('drinkButton');

    // Canvas and Context
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = window.innerWidth > 800 ? 800 : window.innerWidth * 0.95;
    canvas.height = window.innerHeight > 600 ? 600 : window.innerHeight * 0.8;

    // Score
    const scoreBoard = document.getElementById('scoreBoard');
    let score = 0;

    // Game Variables
    let game;
    let animationId;

    // Event Listeners
    startButton.addEventListener('click', () => {
        startScreen.classList.remove('active');
        gameScreen.classList.add('active');
        game = new Game();
        game.start();
    });

    restartButton.addEventListener('click', () => {
        gameOverScreen.classList.remove('active');
        gameScreen.classList.add('active');
        game = new Game();
        game.start();
    });

    drinkButton.addEventListener('click', () => {
        game.toggleDrunkMode();
    });

    // Player Class
    class Player {
        constructor(x, y, width, height, color) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.color = color;
            this.speed = 5;
            this.moveLeft = false;
            this.moveRight = false;
            this.swerveTimer = 0;
            this.swerveInterval = 100; // in frames
            this.swerveDirection = 0;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            // Optional: Replace with image
            
            const img = new Image();
            img.src = 'yo.png';
            ctx.drawImage(img, this.x, this.y, 50, 70);
            
        }

        update() {
            if (this.moveLeft && this.x > 0) {
                this.x -= this.speed;
            }
            if (this.moveRight && this.x + this.width < canvas.width) {
                this.x += this.speed;
            }

            // Swerve randomly
            this.swerveTimer++;
            if (this.swerveTimer > this.swerveInterval) {
                this.swerveDirection = Math.random() < 0.5 ? -1 : 1;
                this.swerveTimer = 0;
            }
            this.x += this.swerveDirection * 0.5; // small swerve

            this.draw();
        }
    }

    // Obstacle Class
    class Obstacle {
        constructor(x, y, width, height, color, speed, imageSrc = null) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.color = color;
            this.speed = speed;
            imageSrc = imageSrc;
            this.image = null;
            if (imageSrc) {
                image = new Image();
                image.src = bro.png;
            }
        }

        draw() {
            if (this.image) {
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            } else {
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        }

        update() {
            this.y += this.speed;
            this.draw();
        }
    }

    // Game Class
    class Game {
        constructor() {
            this.player = new Player(canvas.width / 2 - 25, canvas.height - 70, 50, 70, '#e74c3c');
            this.obstacles = [];
            this.obstacleInterval = 90; // frames
            this.obstacleTimer = 0;
            this.frameCount = 0;
            this.drunk = false;
            this.drunkTimer = 0;
            this.maxDrunkTime = 300; // frames (~5 seconds at 60fps)
        }

        start() {
            // Listen to keyboard events
            window.addEventListener('keydown', this.keyDown.bind(this));
            window.addEventListener('keyup', this.keyUp.bind(this));
            // Start game loop
            this.gameLoop();
        }

        gameLoop() {
            animationId = requestAnimationFrame(this.gameLoop.bind(this));
            this.update();
            this.render();
        }

        update() {
            this.frameCount++;

            // Update player
            this.player.update();

            // Spawn obstacles
            if (this.obstacleTimer > this.obstacleInterval) {
                this.spawnObstacle();
                this.obstacleTimer = 0;
            }
            this.obstacleTimer++;

            // Update obstacles
            this.obstacles.forEach((obstacle, index) => {
                obstacle.update();

                // Collision Detection
                if (this.checkCollision(this.player, obstacle)) {
                    this.score += 10;
                    this.shakeScreen();
                    this.obstacles.splice(index, 1);
                }

                // Remove off-screen obstacles
                if (obstacle.y > canvas.height) {
                    this.obstacles.splice(index, 1);
                }
            });

            // Drunk Mode
            if (this.drunk) {
                this.drunkTimer++;
                if (this.drunkTimer > this.maxDrunkTime) {
                    this.drunk = false;
                    document.body.classList.remove('drunk');
                }
            }
        }

        render() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.player.draw();
            this.obstacles.forEach(obstacle => obstacle.draw());
        }

        spawnObstacle() {
            const size = Math.random() * 30 + 20;
            const x = Math.random() * (canvas.width - size);
            const y = -size;
            const color = '#f1c40f';
            const speed = Math.random() * 3 + 2;
            // Optional: Randomly assign images
            const hasImage = Math.random() < 0.3; // 30% chance
            const imageSrc = hasImage ? 'https://via.placeholder.com/30' : null;
            this.obstacles.push(new Obstacle(x, y, size, size, color, speed, imageSrc));
        }

        checkCollision(player, obstacle) {
            return (
                player.x < obstacle.x + obstacle.width &&
                player.x + player.width > obstacle.x &&
                player.y < obstacle.y + obstacle.height &&
                player.y + player.height > obstacle.y
            );
        }

        keyDown(e) {
            if (e.key === 'ArrowLeft' || e.key === 'a') {
                this.player.moveLeft = true;
            }
            if (e.key === 'ArrowRight' || e.key === 'd') {
                this.player.moveRight = true;
            }
        }

        keyUp(e) {
            if (e.key === 'ArrowLeft' || e.key === 'a') {
                this.player.moveLeft = false;
            }
            if (e.key === 'ArrowRight' || e.key === 'd') {
                this.player.moveRight = false;
            }
        }

        toggleDrunkMode() {
            if (!this.drunk) {
                this.drunk = true;
                this.drunkTimer = 0;
                document.body.classList.add('drunk');
                // Optionally add more drunk effects
            }
        }

        shakeScreen() {
            // Simple screen shake by temporarily applying a CSS class
            document.body.classList.add('shake');
            setTimeout(() => {
                document.body.classList.remove('shake');
            }, 300);
            // Vibrate
            if (navigator.vibrate) {
                navigator.vibrate(300);
            }
            // Update score display
            score += 10;
            scoreBoard.textContent = `Score: ${score}`;
        }
    }

    // CSS for Drunk and Shake Effects
    const style = document.createElement('style');
    style.innerHTML = `
        .drunk {
            filter: blur(2px) hue-rotate(90deg);
            transition: filter 0.5s, transform 0.5s;
        }

        .shake {
            animation: shake 0.3s;
        }

        @keyframes shake {
            0% { transform: translate(1px, 1px) rotate(0deg); }
            10% { transform: translate(-1px, -2px) rotate(-1deg); }
            20% { transform: translate(-3px, 0px) rotate(1deg); }
            30% { transform: translate(3px, 2px) rotate(0deg); }
            40% { transform: translate(1px, -1px) rotate(1deg); }
            50% { transform: translate(-1px, 2px) rotate(-1deg); }
            60% { transform: translate(-3px, 1px) rotate(0deg); }
            70% { transform: translate(3px, 1px) rotate(-1deg); }
            80% { transform: translate(-1px, -1px) rotate(1deg); }
            90% { transform: translate(1px, 2px) rotate(0deg); }
            100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
    `;
    document.head.appendChild(style);
});
setTimeout(() => {
      window.location.href = '../main.html';
    }, 4000);
