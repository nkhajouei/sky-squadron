// A simple Axis-Aligned Bounding Box (AABB) collision detection function
// obj1 and obj2 are objects with x, y, width, and height properties.
function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// You can add other utility functions here later if needed
// For example, a function to get a random integer within a range:
// function getRandomInt(min, max) {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }