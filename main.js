// Get the canvas and context
import Enemy from './enemy.js';

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
const PATH_WIDTH = 40; // Increased path width
const TOWER_SIZE = 20; // Size of the tower (for collision detection)
const path = [
    { x: canvas.width * 0.2, y: 0 },
    { x: canvas.width * 0.2, y: canvas.height * 0.6 },
    { x: canvas.width * 0.8, y: canvas.height * 0.6 },
    { x: canvas.width * 0.8, y: canvas.height }
];

const enemies = [];
const towers = [];
const projectiles = []; // Array to store projectiles
let spawnTimer = 0;
let lives = 5;
let score = 0;
let gold = 20; // Starting gold
let gameOverFlag = false;

// Tower class
class Tower {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.range = 150;
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
                // Shoot a projectile at the enemy
                projectiles.push(new Projectile(this.x, this.y, nearestEnemy, this.damage));
                this.timeSinceLastShot = 0;
            }
        }
    }

    render() {
        // Draw tower rectangle
        context.fillStyle = 'green';
        context.fillRect(this.x - 10, this.y - 10, 20, 20);
        // Add black border around tower
        context.strokeStyle = 'black';
        context.lineWidth = 1;
        context.strokeRect(this.x - 10, this.y - 10, 20, 20);
    }
}

// Projectile class
class Projectile {
    constructor(x, y, target, damage) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.damage = damage;
        this.speed = 5;
        this.radius = 3; // Size of the projectile
    }

    update() {
        const dx = this.target.position.x - this.x;
        const dy = this.target.position.y - this.y;
        const distance = Math.hypot(dx, dy);

        if (distance < this.speed) {
            // Projectile has reached the enemy
            this.target.health -= this.damage;
            removeProjectile(this);

            // Remove enemy if health is below zero
            if (this.target.health <= 0) {
                score += 10;
                gold += 1; // Gain 1 gold for defeating an enemy
                removeEnemy(this.target);
            }
        } else {
            // Move projectile towards the enemy
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        }
    }

    render() {
        // Draw projectile as a small circle
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = 'black';
        context.fill();
    }
}

// Utility functions
function removeEnemy(enemy) {
    const index = enemies.indexOf(enemy);
    if (index > -1) {
        enemies.splice(index, 1);
    }
}

function removeProjectile(projectile) {
    const index = projectiles.indexOf(projectile);
    if (index > -1) {
        projectiles.splice(index, 1);
    }
}

function spawnEnemies() {
    if (spawnTimer <= 0) {
        enemies.push(new Enemy(path));
        spawnTimer = 120; // Spawn every 120 frames
    } else {
        spawnTimer--;
    }
}

function drawPath() {
    context.strokeStyle = 'gray';
    context.lineWidth = PATH_WIDTH; // Set path width
    context.lineCap = 'round'; // Smooth edges
    context.beginPath();
    context.moveTo(path[0].x, path[0].y);
    for (let i = 1; i < path.length; i++)
    {
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

    for (let projectile of projectiles) {
        projectile.update();
    }
}

function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawPath();

    for (let tower of towers) {
        tower.render();
    }

    for (let enemy of enemies) {
        enemy.render(context);
    }

    for (let projectile of projectiles) {
        projectile.render();
    }

    // Display score, lives, and gold
    context.fillStyle = 'black';
    context.font = '20px Arial';
    context.fillText(`Lives: ${lives}`, 10, 30);
    context.fillText(`Score: ${score}`, 10, 60);
    context.fillText(`Gold: ${gold}`, 10, 90);
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

function displayNotEnoughGold() {
    // Temporary message when not enough gold
    context.fillStyle = 'red';
    context.font = '30px Arial';
    context.textAlign = 'center';
    context.fillText('Not enough gold!', canvas.width / 2, canvas.height / 2 + 80);
    setTimeout(() => {
        // Redraw to clear the message after 1 second
        render();
    }, 1000);
}

function displayCannotPlaceHere() {
    // Temporary message when cannot place tower
    context.fillStyle = 'red';
    context.font = '30px Arial';
    context.textAlign = 'center';
    context.fillText('Cannot place tower here!', canvas.width / 2, canvas.height / 2 + 80);
    setTimeout(() => {
        // Redraw to clear the message after 1 second
        render();
    }, 1000);
}

// Handle tower placement
canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);

    // Check if the position is on the path or on another tower
    if (!isOnPath(x, y) && !isOnTower(x, y)) {
        if (gold >= 10) {
            towers.push(new Tower(x, y));
            gold -= 10; // Deduct 10 gold for placing a tower
        } else {
            // Not enough gold to place a tower
            displayNotEnoughGold();
        }
    } else {
        // Cannot place tower here
        displayCannotPlaceHere();
    }
});

function isOnPath(x, y) {
    // Check if the point is within the path width
    const halfPathWidth = PATH_WIDTH / 2;
    for (let i = 0; i < path.length - 1; i++) {
        const x1 = path[i].x;
        const y1 = path[i].y;
        const x2 = path[i + 1].x;
        const y2 = path[i + 1].y;

        const distance = pointToSegmentDistance(x, y, x1, y1, x2, y2);
        if (distance < halfPathWidth) {
            return true;
        }
    }
    return false;
}

function isOnTower(x, y) {
    // Check if the point overlaps with any existing tower
    for (let tower of towers) {
        const dx = x - tower.x;
        const dy = y - tower.y;
        const distance = Math.hypot(dx, dy);
        if (distance < TOWER_SIZE) {
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
