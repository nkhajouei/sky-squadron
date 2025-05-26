const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size (important for mobile)
function resizeCanvas() {
    // Adjust for desired aspect ratio and mobile screens
    const aspectRatio = 9 / 16; // e.g., portrait mobile
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;

    let width = maxWidth;
    let height = width / aspectRatio;

    if (height > maxHeight) {
        height = maxHeight;
        width = height * aspectRatio;
    }

    canvas.width = width;
    canvas.height = height;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Initial resize

let player;
let enemies = [];
let bullets = [];
let fuelTanks = [];
let canyonWalls = [];
let score = 0;
let gameOver = false;
let lastTime = 0;

function initGame() {
    player = new Player(canvas.width / 2, canvas.height - 100);
    enemies = [];
    bullets = [];
    fuelTanks = [];
    canyonWalls = [];
    score = 0;
    gameOver = false;
    // Generate initial canyon walls, enemies, fuel
}

function update(deltaTime) {
    if (gameOver) return;

    player.update(deltaTime);
    // Update bullets, enemies, fuel, obstacles (handle movement, collisions)

    // Collision detection
    // Player vs. Enemies, Player vs. Obstacles, Player vs. Fuel, Bullets vs. Enemies

    // Generate new enemies, fuel, obstacles as player progresses

    // Check for game over conditions (collision, out of fuel)
    if (player.fuel <= 0) {
        gameOver = true;
        // Display game over message
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    // Draw background (parallax scrolling)
    // Draw canyon walls
    player.draw(ctx);
    // Draw bullets
    // Draw enemies
    // Draw fuel tanks
    // Draw UI (score, fuel bar)

    if (gameOver) {
        // Draw game over screen
    }
}

function gameLoop(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000; // Delta time in seconds
    lastTime = currentTime;

    update(deltaTime);
    draw();

    requestAnimationFrame(gameLoop);
}

// --- Input Handling (Mobile Touch) ---
let touchStartX = 0;
let touchMoveX = 0;

canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    player.isMoving = true; // Indicate that player is actively moving
});

canvas.addEventListener('touchmove', (e) => {
    touchMoveX = e.touches[0].clientX;
    const deltaX = touchMoveX - touchStartX;
    player.targetX = player.x + deltaX * 0.5; // Adjust sensitivity
    touchStartX = touchMoveX; // Update start for continuous movement
});

canvas.addEventListener('touchend', () => {
    player.isMoving = false;
    player.velocity.x = 0; // Stop horizontal movement
});


initGame();
requestAnimationFrame(gameLoop);
