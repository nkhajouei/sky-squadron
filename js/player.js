class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50; // Placeholder size
        this.height = 50; // Placeholder size
        this.fuel = 100;
        this.speed = 200; // Pixels per second
        this.isMoving = false;
        this.targetX = x;
    }

    update(deltaTime) {
        if (this.isMoving) {
            const dx = this.targetX - this.x;
            if (Math.abs(dx) > 1) { // Avoid jitter when very close
                this.x += dx * 0.1; // Smooth movement
            } else {
                this.x = this.targetX;
            }
        }
        // Keep player within canvas bounds
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;

        this.fuel -= 0.1 * deltaTime; // Fuel depletes over time
    }

    draw(ctx) {
        ctx.fillStyle = 'blue'; // Placeholder color
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}