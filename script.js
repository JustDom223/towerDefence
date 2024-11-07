// Get the canvas and context
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

// Set canvas dimensions to match the viewport
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Game variables
const path = [
    { x: canvas.width * 0.2, y: 0 },
    { x: canvas.width * 0.2, y: canvas.height * 0.6 },
    { x: canvas.width * 0.8, y: canvas.height * 0.6 },
    { x: canvas.width * 0.8, y: canvas.height }
];

const enemies = [];
const towers = [];
let spawnTimer = 0;
let lives = 5;
let score = 0;
let gameOverFlag = false;

// Enemy class
class Enemy {
    constructor() {
        this.width = 20;
        this.height = 20;
        this.health = 100;
        this.maxHealth = 100;
        this.speed = 1;
        this.position = { x: path[0].x, y: path[0].y };
        this.waypointIndex = 0;
    }

    update() {
        if (this.waypointIndex < path.length - 1) {
            const targetX = path[this.waypointIndex + 1].x;
            const targetY = path[this.waypointIndex + 1].y;
            const dx = targetX - this.position.x;
            const dy = targetY - this.position.y;
            const distance = Math.hypot(dx, dy);

            if (distance < this.speed) {
                this.position.x = targetX;
                this.position.y = targetY;
                this.waypointIndex++;
            } else {
                this.position.x += (dx / distance) * this.speed;
                this.position.y += (dy / distance) * this.speed;
            }
        } else {
            // Enemy reached the end
            lives--;
            removeEnemy(this);
            if (lives <= 0) {
                gameOverFlag = true;
            }
        }
    }

    render() {
        // Draw enemy rectangle
        context.fillStyle = 'red';
        context.fillRect(
            this.position.x - this.width / 2,
            this.position.y - this.height / 2,
            this.width,
            this.height
        );
        // **Add black border around enemy**
        context.strokeStyle = 'black';
        context.lineWidth = 1;
        context.strokeRect(
            this.position.x - this.width / 2,
            this.position.y - this.height / 2,
            this.width,
            this.height
        );

        // Health bar
        context.fillStyle = 'black';
        context.fillRect(
            this.position.x - this.width / 2,
            this.position.y - this.height / 2 - 10,
            this.width,
            5
        );
        context.fillStyle = 'green';
        context.fillRect(
            this.position.x - this.width / 2,
            this.position.y - this.height / 2 - 10,
            this.width * (this.health / this.maxHealth),
            5
        );
    }
}

// Tower class
class Tower {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.range = 100;
        this.fireRate = 60; // Frames between shots
        this.damage = 20;
        this.timeSinceLastShot = 0;
    }

    update() {
        this.timeSinceLastShot++;
        if (this.timeSinceLastShot >= this.fireRate) {
            // Find the nearest enemy within range
            let nearestEnemy = null;
            let minDistance = this.range;
            for (let enemy of enemies) {
                const dx = enemy.position.x - this.x;
                const dy = enemy.position.y - this.y;
                const distance = Math.hypot(dx, dy);
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestEnemy = enemy;
                }
            }

            if (nearestEnemy) {
                // Shoot at the enemy
                nearestEnemy.health -= this.damage;
                this.timeSinceLastShot = 0;

                // Remove enemy if health is below zero
                if (nearestEnemy.health <= 0) {
                    score += 10;
                    removeEnemy(nearestEnemy);
                }
            }
        }
    }

    render() {
        // Draw tower rectangle
        context.fillStyle = 'green';
        context.fillRect(this.x - 10, this.y - 10, 20, 20);
        // **Add black border around tower**
        context.strokeStyle = 'black';
        context.lineWidth = 1;
        context.strokeRect(this.x - 10, this.y - 10, 20, 20);
    }
}

// Utility functions
function removeEnemy(enemy) {
    const index = enemies.indexOf(enemy);
    if (index > -1) {
        enemies.splice(index, 1);
    }
}

function spawnEnemies() {
    if (spawnTimer <= 0) {
        enemies.push(new Enemy());
        spawnTimer = 120; // Spawn every 120 frames
    } else {
        spawnTimer--;
    }
}

function drawPath() {
    context.strokeStyle = 'gray';
    context.lineWidth = 5;
    context.beginPath();
    context.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++) {
        context.lineTo(path[i].x, path[i].y);
    }
    context.stroke();
}

function gameLoop() {
    if (!gameOverFlag) {
        update();
        render();
        requestAnimationFrame(gameLoop);
    } else {
        render();
        displayGameOver();
    }
}

function update() {
    spawnEnemies();
    for (let enemy of enemies) {
        enemy.update();
    }
    for (let tower of towers) {
        tower.update();
    }
}

function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawPath();
    for (let tower of towers) {
        tower.render();
    }
    for (let enemy of enemies) {
        enemy.render();
    }
    // Display score and lives
    context.fillStyle = 'black';
    context.font = '20px Arial';
    context.fillText(`Lives: ${lives}`, 10, 30);
    context.fillText(`Score: ${score}`, 10, 60);
}

function displayGameOver() {
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'white';
    context.font = '40px Arial';
    context.textAlign = 'center';
    context.fillText('Game Over', canvas.width / 2, canvas.height / 2);
    context.font = '20px Arial';
    context.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
}

// Handle tower placement
canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);

    // Check if the position is on the path
    if (!isOnPath(x, y)) {
        towers.push(new Tower(x, y));
    }
});

function isOnPath(x, y) {
    // Simple approximation: check if the point is close to any segment of the path
    for (let i = 0; i < path.length - 1; i++) {
        const x1 = path[i].x;
        const y1 = path[i].y;
        const x2 = path[i + 1].x;
        const y2 = path[i + 1].y;

        const distance = pointToSegmentDistance(x, y, x1, y1, x2, y2);
        if (distance < 20) { // Threshold value
            return true;
        }
    }
    return false;
}

function pointToSegmentDistance(px, py, x1, y1, x2, y2) {
    const lineLengthSquared = (x2 - x1) ** 2 + (y2 - y1) ** 2;
    if (lineLengthSquared === 0) return Math.hypot(px - x1, py - y1);

    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / lineLengthSquared;
    t = Math.max(0, Math.min(1, t));
    const projectionX = x1 + t * (x2 - x1);
    const projectionY = y1 + t * (y2 - y1);
    return Math.hypot(px - projectionX, py - projectionY);
}

// Start the game loop
requestAnimationFrame(gameLoop);
