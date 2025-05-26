const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- Global Game Variables ---
let player;
let enemies = [];
let bullets = [];
let fuelTanks = [];    // Array to hold fuel tank objects
let canyonWalls = [];  // To be implemented later

let score = 0;
let gameOver = false;
let lastTime = 0; // Used for calculating deltaTime

// --- Spawning Timers ---
let enemySpawnTimer = 0;
const enemySpawnInterval = 2; // Spawn a new enemy every 2 seconds

let fuelSpawnTimer = 0;
const fuelSpawnInterval = 5; // Spawn a new fuel tank every 5 seconds (adjust as needed)

// --- Keyboard State (for PC Input) ---
const keys = {
    left: false,
    right: false,
    space: false // For shooting
};

// --- Canvas Resizing for Responsiveness ---
function resizeCanvas() {
    const aspectRatio = 9 / 16; // Standard portrait aspect ratio for mobile
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

    // If player exists, adjust its position based on new canvas size
    if (player) {
        player.canvasWidth = canvas.width;
        player.canvasHeight = canvas.height;
        // Keep player near bottom center, or adjust as needed
        player.x = canvas.width / 2 - player.width / 2;
        player.y = canvas.height - player.height - 50;
        player.targetX = player.x; // Reset targetX on resize to prevent sudden jumps
    }
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Initial call to set canvas size and player position

// --- Game Initialization ---
function initGame() {
    // Initialize player (pass canvas dimensions to Player constructor)
    player = new Player(canvas.width / 2 - 30, canvas.height - 100, canvas.width, canvas.height);

    // Clear arrays for a new game
    enemies = [];
    bullets = [];
    fuelTanks = []; // Clear fuel tanks for new game
    canyonWalls = [];

    score = 0;
    gameOver = false;

    // Reset timers
    enemySpawnTimer = 0;
    fuelSpawnTimer = 0;

    // Reset keyboard state
    keys.left = false;
    keys.right = false;
    keys.space = false;
}

// --- Main Update Loop ---
function update(deltaTime) {
    if (gameOver) return; // Stop updates if game is over

    // 1. Handle Player Movement Input (Keyboard takes precedence over touch)
    if (keys.left) {
        player.velocity.x = -player.speed;
        player.isMoving = false; // Disable touch-based movement if keyboard is active
    } else if (keys.right) {
        player.velocity.x = player.speed;
        player.isMoving = false; // Disable touch-based movement if keyboard is active
    } else if (!player.isMoving) { // If no keyboard keys are pressed AND not actively swiping
        player.velocity.x = 0; // Stop horizontal movement
    }

    // 2. Update Player's State
    player.update(deltaTime);

    // 3. Player Firing Logic (auto-fire when moving, or spacebar press)
    if (player.isMoving || player.velocity.x !== 0 || keys.space) {
        const newBullet = player.shoot(); // player.shoot() handles its own cooldown
        if (newBullet) {
            bullets.push(newBullet); // Add new bullet to the array if one was created
        }
    }


    // 4. Update and Manage Enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        enemy.update(deltaTime);

        // Remove enemies that go off-screen (below the canvas)
        if (enemy.y > canvas.height + enemy.height) {
            enemies.splice(i, 1);
            continue;
        }

        // --- Player-Enemy Collision ---
        // Requires checkCollision function from utils.js
        if (checkCollision(player, enemy)) {
            gameOver = true;
            console.log("Game Over! Player collided with enemy.");
            return;
        }
    }

    // 5. Update and Manage Bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.update(deltaTime);

        // Remove bullets that go off-screen (above the canvas)
        if (bullet.y + bullet.height < 0) {
            bullets.splice(i, 1);
            continue;
        }

        // --- Bullet-Enemy Collision ---
        for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j];
            if (checkCollision(bullet, enemy)) {
                const enemyDestroyed = enemy.takeDamage(bullet.damage);

                bullets.splice(i, 1); // Remove bullet on hit
                i--; // Adjust bullet loop index because we removed a bullet from 'bullets' array

                if (enemyDestroyed) {
                    enemies.splice(j, 1); // Remove enemy if it's destroyed
                    score += 100; // Increase score
                    // Add enemy explosion effect/sound here
                    j--; // Adjust enemy loop index because we removed an enemy from 'enemies' array
                }
                break; // Bullet hit something, so it's gone. Stop checking other enemies for this specific bullet.
            }
        }
    }


    // 6. Update and Manage Fuel Tanks (NOW IMPLEMENTED)
    for (let i = fuelTanks.length - 1; i >= 0; i--) {
        const fuelTank = fuelTanks[i];
        fuelTank.update(deltaTime); // Make fuel tanks scroll down

        // Remove fuel tanks that go off-screen
        if (fuelTank.y > canvas.height + fuelTank.height) {
            fuelTanks.splice(i, 1);
            continue;
        }

        // --- Player-Fuel Collision ---
        if (checkCollision(player, fuelTank)) {
            player.collectFuel(fuelTank.amount); // Player collects fuel amount from the tank
            fuelTanks.splice(i, 1); // Remove fuel tank after collection
            // Add fuel collection sound/effect here
        }
    }

    // 7. Update and Manage Canyon Walls (Currently placeholders for future implementation)
    // for (let i = canyonWalls.length - 1; i >= 0; i--) {
    //     const wallSegment = canyonWalls[i];
    //     // wallSegment.update(deltaTime);
    //
    //     // if (wallSegment.y > canvas.height + 100) { canyonWalls.splice(i, 1); }
    //     // Player-Canyon Wall Collision logic here (likely game over)
    // }


    // --- Spawning Logic ---

    // Spawn new enemies
    enemySpawnTimer += deltaTime;
    if (enemySpawnTimer >= enemySpawnInterval) {
        const randomX = Math.random() * (canvas.width - 70); // 70 is enemy width
        enemies.push(new Enemy(randomX, -50, 'plane', canvas.height)); // Spawn off-screen at top
        enemySpawnTimer = 0; // Reset timer
    }

    // Spawn new fuel tanks (NOW IMPLEMENTED)
    fuelSpawnTimer += deltaTime;
    if (fuelSpawnTimer >= fuelSpawnInterval) {
        const randomX = Math.random() * (canvas.width - 40); // 40 is fuel tank width
        fuelTanks.push(new Fuel(randomX, -50, canvas.height)); // Spawn off-screen at top
        fuelSpawnTimer = 0;
    }

    // Generate new canyon segments (once Canyon/Obstacle class is ready)


    // 8. Check Game Over Conditions (Fuel already checked in player.update and main update)
    if (player.fuel <= 0) {
        gameOver = true;
        console.log("Game Over! Out of fuel.");
        return; // Exit update loop immediately
    }
}

// --- Main Drawing Loop ---
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear entire canvas each frame

    // Draw background (e.g., a scrolling canyon background) - Future implementation

    // Draw canyon walls - Future implementation
    canyonWalls.forEach(wall => wall.draw(ctx));

    // Draw enemies
    enemies.forEach(enemy => enemy.draw(ctx));

    // Draw bullets
    bullets.forEach(bullet => bullet.draw(ctx));

    // Draw fuel tanks (NOW IMPLEMENTED)
    fuelTanks.forEach(fuelTank => fuelTank.draw(ctx));

    // Draw Player
    player.draw(ctx);

    // Draw UI Elements (Score, Fuel Bar)
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`Fuel: ${Math.max(0, Math.floor(player.fuel))}`, 10, 60);

    // Draw Game Over Screen
    if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; // Semi-transparent black overlay
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'red';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);

        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 30);
        ctx.fillText('Tap to Restart', canvas.width / 2, canvas.height / 2 + 70);
    }
}

// --- Main Game Loop ---
function gameLoop(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    update(deltaTime);
    draw();

    requestAnimationFrame(gameLoop);
}

// --- Input Handling ---

// Mobile Touch Input for Player Movement & Game Restart
let touchStartX = 0;
let touchMoveX = 0;

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent default browser touch actions (like scrolling, zooming)
    if (gameOver) {
        initGame(); // Restart game on tap if game over
        return; // Don't process movement for restart tap
    }
    touchStartX = e.touches[0].clientX;
    player.isMoving = true; // Set flag that touch is active
});

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Prevent default browser touch actions
    if (gameOver) return; // Don't process movement if game over

    touchMoveX = e.touches[0].clientX;
    const deltaX = touchMoveX - touchStartX;
    // Update player's targetX based on finger movement
    player.targetX = player.x + deltaX * 0.5; // Adjust sensitivity with 0.5 factor
    touchStartX = touchMoveX; // Update start for continuous movement
});

canvas.addEventListener('touchend', () => {
    if (gameOver) return; // Don't process input if game over

    player.isMoving = false; // Touch is no longer active
    // If no keyboard keys are pressed either, stop player's horizontal velocity
    if (!keys.left && !keys.right) {
         player.velocity.x = 0;
    }
});


// Keyboard Controls for PC
window.addEventListener('keydown', (e) => {
    if (gameOver) {
        // Optional: Add 'R' key to restart game from keyboard if desired
        // if (e.key === 'r' || e.key === 'R') { initGame(); }
        return;
    }

    // Set keyboard state flags based on key press
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keys.left = true;
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keys.right = true;
    } else if (e.key === ' ') { // Spacebar for shooting
        keys.space = true;
        e.preventDefault(); // Prevent spacebar from scrolling the page
    }
});

window.addEventListener('keyup', (e) => {
    if (gameOver) return;

    // Reset keyboard state flags when key is released
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keys.left = false;
        // If no other horizontal key (right or touch) is active, stop player movement
        if (!keys.right && !player.isMoving) { // Check if touch is active too
            player.velocity.x = 0;
        }
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keys.right = false;
        // If no other horizontal key (left or touch) is active, stop player movement
        if (!keys.left && !player.isMoving) { // Check if touch is active too
            player.velocity.x = 0;
        }
    } else if (e.key === ' ') { // Spacebar released
        keys.space = false;
    }
});


// --- Initial Game Start ---
initGame(); // Call this once to set up the game initially
requestAnimationFrame(gameLoop); // Start the main game loop!