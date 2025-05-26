class Bullet {
    constructor(x, y) {
        this.x = x; // Initial X position (usually from player's center)
        this.y = y; // Initial Y position (from player's top)
        this.width = 4; // Bullet width
        this.height = 12; // Bullet height
        this.speed = 400; // Bullet speed (pixels per second, moving upwards)
        this.damage = 1; // Amount of damage this bullet deals to an enemy

        // You could load a bullet image here instead of drawing a rectangle
        // this.image = new Image();
        // this.image.src = 'assets/images/bullet.png';
        // this.imageLoaded = false;
        // this.image.onload = () => { this.imageLoaded = true; };
    }

    /**
     * Updates the bullet's position.
     * @param {number} deltaTime - Time elapsed since the last frame in seconds.
     */
    update(deltaTime) {
        this.y -= this.speed * deltaTime; // Move bullet upwards
    }

    /**
     * Draws the bullet on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     */
    draw(ctx) {
        // If you were using an image:
        // if (this.imageLoaded) {
        //     ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        // } else {
        //     ctx.fillStyle = 'yellow';
        //     ctx.fillRect(this.x, this.y, this.width, this.height);
        // }
        ctx.fillStyle = 'yellow'; // Bullet color
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}