class Player {
    constructor(x, y, canvasWidth, canvasHeight) {
        // Position and dimensions
        this.x = x; // Initial X position (center of the canvas)
        this.y = y; // Initial Y position (near the bottom of the canvas)
        this.width = 60; // Player's visual width (you can adjust this)
        this.height = 80; // Player's visual height (you can adjust this)

        // Game mechanics properties
        this.fuel = 100; // Starting fuel level
        this.maxFuel = 100; // Maximum fuel capacity
        this.speed = 300; // Player's horizontal movement speed (pixels per second)
        this.bulletCooldown = 0.2; // Time in seconds between shots
        this.currentBulletCooldown = 0; // Current time until next shot is ready

        // Input handling (from main.js touch events)
        this.isMoving = false; // True when a touch is active
        this.targetX = this.x; // The X coordinate the player is trying to reach

        // Canvas bounds (to prevent player from going off-screen)
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        // Image for the player (load it in main.js and pass it, or load it here)
        this.image = new Image();
        this.image.src = 'assets/images/player_jet.png'; // Make sure this path is correct!
        this.imageLoaded = false;
        this.image.onload = () => {
            this.imageLoaded = true;
        };

        // For smooth movement and shooting rate
        this.velocity = { x: 0 }; // Not directly used for swipe, but good for physics if needed
    }

    /**
     * Updates the player's state (movement, fuel, shooting cooldown).
     * @param {number} deltaTime - Time elapsed since the last frame in seconds.
     */
    update(deltaTime) {
        // --- Movement based on touch input ---
        if (this.isMoving) {
            // Calculate direction to targetX
            const dx = this.targetX - this.x;

            // If player is far from target, move towards it smoothly
            if (Math.abs(dx) > 5) { // A small threshold to prevent jitter near target
                // Move towards targetX based on speed and delta time
                // The 0.1 is a smoothing factor. Adjust as needed.
                this.x += dx * 0.1;
            } else {
                this.x = this.targetX; // Snap to target if very close
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
            // Game over logic will check for this in main.js
        }

        // --- Bullet Cooldown ---
        if (this.currentBulletCooldown > 0) {
            this.currentBulletCooldown -= deltaTime;
        } else {
            this.currentBulletCooldown = 0; // Ensure it doesn't go negative
        }

        // Auto-fire (if you want automatic shooting)
        // If you want tap-to-fire, this would be triggered by a tap event in main.js
        if (this.currentBulletCooldown === 0) {
            // main.js will call a method on the player to shoot
            // For now, let's just reset cooldown if we *could* fire
            // this.shoot(); // This would usually be called from main.js on a condition
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
     * Method to create a bullet (this will be called from main.js's game loop or input handler)
     * Returns a new Bullet object or null if on cooldown.
     */
    shoot() {
        if (this.currentBulletCooldown <= 0) {
            this.currentBulletCooldown = this.bulletCooldown;
            // Return a new Bullet object (Bullet class will be in another file)
            // Example: return new Bullet(this.x + this.width / 2, this.y);
            return {
                x: this.x + this.width / 2 - 2, // Center the bullet horizontally
                y: this.y,
                width: 4,
                height: 10,
                speed: 400, // Bullet speed
                draw: function(ctx) {
                    ctx.fillStyle = 'yellow';
                    ctx.fillRect(this.x, this.y, this.width, this.height);
                },
                update: function(deltaTime) {
                    this.y -= this.speed * deltaTime;
                }
            }; // This is a simplified bullet placeholder
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
        // For Sky Squadron, damage likely means instant game over on collision
        // But if you had a health bar, this is where you'd decrement it.
        // For now, let's assume collision is game over, so this method might not be heavily used initially.
        console.log("Player took damage!");
    }
}
