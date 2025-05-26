class Player {
    constructor(x, y, canvasWidth, canvasHeight) {
        // Position and dimensions
        this.x = x;
        this.y = y;
        this.width = 60; // Player's visual width
        this.height = 80; // Player's visual height

        // Game mechanics properties
        this.fuel = 100; // Starting fuel level
        this.maxFuel = 100; // Maximum fuel capacity
        this.speed = 300; // Player's horizontal movement speed for keyboard (pixels per second)
        this.bulletCooldown = 0.2; // Time in seconds between shots
        this.currentBulletCooldown = 0; // Current time until next shot is ready

        // Input handling (unified for touch and keyboard)
        this.velocity = { x: 0 }; // Player's current horizontal velocity (pixels per second)
        this.isMoving = false; // Flag for touch input (true when actively touching/swiping)
        this.targetX = this.x; // Target X for smooth touch follow

        // Canvas bounds
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        // Image for the player
        this.image = new Image();
        this.image.src = 'assets/images/player_jet.png'; // Path to your player image
        this.imageLoaded = false;
        this.image.onload = () => {
            this.imageLoaded = true;
        };
    }

    /**
     * Updates the player's state (movement, fuel, shooting cooldown).
     * @param {number} deltaTime - Time elapsed since the last frame in seconds.
     */
    update(deltaTime) {
        // --- Movement based on velocity (for keyboard) ---
        // This takes effect if keyboard keys are held down
        if (this.velocity.x !== 0) {
            this.x += this.velocity.x * deltaTime;
        }

        // --- Movement based on touch input (overrides velocity if active) ---
        // If 'isMoving' (from touchstart/touchmove) is true, player follows targetX
        if (this.isMoving) {
            const dx = this.targetX - this.x;
            // Only apply touch movement if a significant difference exists to prevent jitter
            if (Math.abs(dx) > 1) {
                this.x += dx * 0.1 * this.speed / 200; // Smooth movement, adjust factor if needed
                this.velocity.x = 0; // Reset velocity if touch is active to prevent conflicts
            } else {
                this.x = this.targetX;
            }
        }

        // --- Keep player within canvas bounds ---
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x + this.width > this.canvasWidth) {
            this.x = this.canvasWidth - this.width;
        }

        // --- Fuel Consumption ---
        this.fuel -= 5 * deltaTime; // Consume 5 fuel per second
        if (this.fuel < 0) {
            this.fuel = 0; // Don't let fuel go negative
        }

        // --- Bullet Cooldown ---
        if (this.currentBulletCooldown > 0) {
            this.currentBulletCooldown -= deltaTime;
        } else {
            this.currentBulletCooldown = 0;
        }
    }

    /**
     * Draws the player on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     */
    draw(ctx) {
        if (this.imageLoaded) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            // Draw a placeholder rectangle if image not loaded yet
            ctx.fillStyle = 'blue';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.strokeStyle = 'white';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }

    /**
     * Method to create a bullet (called from main.js)
     */
    shoot() {
        if (this.currentBulletCooldown <= 0) {
            this.currentBulletCooldown = this.bulletCooldown;
            // Create a new Bullet object (Bullet class is defined in bullets.js)
            // Position the bullet at the player's top-center
            return new Bullet(this.x + this.width / 2 - 2, this.y);
        }
        return null; // Cannot shoot due to cooldown
    }

    /**
     * Handles player collecting fuel.
     * @param {number} amount - The amount of fuel to add.
     */
    collectFuel(amount) {
        this.fuel += amount;
        if (this.fuel > this.maxFuel) {
            this.fuel = this.maxFuel;
        }
    }

    /**
     * Handles player taking damage.
     * @param {number} damage - The amount of damage to take.
     */
    takeDamage(damage) {
        // For Sky Squadron (River Raid style), collision typically means instant game over.
        // If you had a health bar, you'd decrement it here.
        console.log("Player took damage!");
    }
}