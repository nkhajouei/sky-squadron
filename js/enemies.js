class Enemy {
    constructor(x, y, type = 'plane', canvasHeight) {
        this.x = x;
        this.y = y;
        this.type = type; // 'plane', 'tank', 'turret' - currently only 'plane' implemented
        this.canvasHeight = canvasHeight;

        // Set properties based on type
        switch (this.type) {
            case 'plane':
                this.width = 70;
                this.height = 50;
                this.speed = 150; // Pixels per second (downwards)
                this.health = 1; // Takes 1 hit to destroy
                this.image = new Image();
                this.image.src = 'assets/images/enemy_plane.png'; // Path to your enemy plane image
                break;
            // You can add 'tank' and 'turret' types later with different properties
            default:
                // Default to plane properties if type is unrecognized or not specified
                this.width = 50;
                this.height = 50;
                this.speed = 100;
                this.health = 1;
                this.image = new Image();
                this.image.src = 'assets/images/enemy_plane.png';
                break;
        }

        this.imageLoaded = false;
        this.image.onload = () => {
            this.imageLoaded = true;
        };
    }

    /**
     * Updates the enemy's position.
     * @param {number} deltaTime - Time elapsed since the last frame in seconds.
     */
    update(deltaTime) {
        this.y += this.speed * deltaTime; // Move enemy downwards
    }

    /**
     * Draws the enemy on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     */
    draw(ctx) {
        if (this.imageLoaded) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            // Draw a placeholder rectangle if image not loaded yet
            ctx.fillStyle = 'red';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.strokeStyle = 'white';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }

    /**
     * Reduces enemy health.
     * @param {number} damage - Amount of damage taken.
     * @returns {boolean} True if enemy is destroyed (health <= 0), false otherwise.
     */
    takeDamage(damage) {
        this.health -= damage;
        return this.health <= 0; // Returns true if enemy's health is 0 or less
    }
}