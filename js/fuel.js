class Fuel {
    constructor(x, y, canvasHeight) {
        this.x = x;
        this.y = y;
        this.width = 40; // Size of the fuel tank pickup
        this.height = 40;
        this.speed = 100; // Speed at which fuel tanks move down the screen (adjust as needed)
        this.amount = 25; // Amount of fuel to restore

        this.canvasHeight = canvasHeight;

        this.image = new Image();
        this.image.src = 'assets/images/fuel_tank.png'; // You'll need an image for this!
        this.imageLoaded = false;
        this.image.onload = () => {
            this.imageLoaded = true;
        };
    }

    /**
     * Updates the fuel tank's position.
     * @param {number} deltaTime - Time elapsed since the last frame in seconds.
     */
    update(deltaTime) {
        this.y += this.speed * deltaTime; // Move fuel tank downwards
    }

    /**
     * Draws the fuel tank on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     */
    draw(ctx) {
        if (this.imageLoaded) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            // Draw a placeholder rectangle if image not loaded yet
            ctx.fillStyle = 'green'; // Placeholder color
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.strokeStyle = 'white';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}