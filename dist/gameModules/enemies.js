"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TankEnemy = exports.FastEnemy = exports.BasicEnemy = void 0;
class BasicEnemy {
    /**
     * Constructs a new BasicEnemy instance.
     * @param {Array} path - An array of points defining the enemy's path.
     * @param {Object} spawnOffset - The perpendicular offset { x, y } from the path's center.
     */
    constructor(path, spawnOffset = { x: 0, y: 0 }) {
        this.size = 50; // Size for BasicEnemy
        this.width = this.size;
        this.height = this.size;
        this.health = 100;
        this.maxHealth = 100;
        this.speed = 1;
        this.position = {
            x: path[0].x + spawnOffset.x,
            y: path[0].y + spawnOffset.y,
        };
        this.waypointIndex = 0;
        this.path = path;
        this.spawnOffsetMagnitude = Math.hypot(spawnOffset.x, spawnOffset.y); // Fixed magnitude
        this.spawnOffsetDirection = spawnOffset.x >= 0 ? 1 : -1; // Direction based on initial spawnOffset
        this.isDefeated = false; // Flag to indicate if the enemy should be removed
        this.points = 10; // Points awarded when the enemy is defeated
        this.value = 1; // Gold value awarded
    }
    update() {
        // Check if the enemy has reached the end of the path
        if (this.isAtEnd()) {
            this.isDefeated = true; // Mark for removal if at the end
            return;
        }
        // Get current and next waypoint
        const currentWaypoint = this.path[this.waypointIndex];
        const nextWaypoint = this.path[this.waypointIndex + 1];
        // Calculate direction vector of the current segment
        const dx = nextWaypoint.x - currentWaypoint.x;
        const dy = nextWaypoint.y - currentWaypoint.y;
        const distance = Math.hypot(dx, dy);
        const directionX = dx / distance;
        const directionY = dy / distance;
        // Calculate perpendicular vector
        const perpendicularX = -directionY;
        const perpendicularY = directionX;
        // Recalculate spawnOffset based on initial magnitude and current segment's perpendicular vector
        this.spawnOffset = {
            x: this.spawnOffsetMagnitude *
                perpendicularX *
                this.spawnOffsetDirection,
            y: this.spawnOffsetMagnitude *
                perpendicularY *
                this.spawnOffsetDirection,
        };
        // Calculate target position with spawnOffset
        const targetX = nextWaypoint.x + this.spawnOffset.x;
        const targetY = nextWaypoint.y + this.spawnOffset.y;
        // Calculate vector towards target position
        const vectorToTargetX = targetX - this.position.x;
        const vectorToTargetY = targetY - this.position.y;
        const vectorDistance = Math.hypot(vectorToTargetX, vectorToTargetY);
        if (vectorDistance < this.speed) {
            // Snap to the target position and move to the next waypoint
            this.position.x = targetX;
            this.position.y = targetY;
            this.waypointIndex++;
        }
        else {
            // Move towards the target position
            this.position.x += (vectorToTargetX / vectorDistance) * this.speed;
            this.position.y += (vectorToTargetY / vectorDistance) * this.speed;
        }
        // Mark as defeated if health is zero or below
        if (this.health <= 0) {
            this.isDefeated = true;
        }
    }
    isAtEnd() {
        // Returns true if the enemy has reached the last waypoint
        return this.waypointIndex >= this.path.length - 1;
    }
    /**
     * Renders the enemy and its health bar on the canvas.
     * @param {CanvasRenderingContext2D} context - The canvas rendering context.
     */
    render(context) {
        // Draw enemy body
        context.fillStyle = 'red';
        context.fillRect(this.position.x - this.width / 2, this.position.y - this.height / 2, this.width, this.height);
        // Draw black border around enemy
        context.strokeStyle = 'black';
        context.lineWidth = 1;
        context.strokeRect(this.position.x - this.width / 2, this.position.y - this.height / 2, this.width, this.height);
        // Render health bar
        this.renderHealthBar(context);
    }
    /**
     * Renders the enemy's health bar above it.
     * @param {CanvasRenderingContext2D} context - The canvas rendering context.
     */
    renderHealthBar(context) {
        // Calculate health bar dimensions
        const barWidth = this.width;
        const barHeight = 5;
        const barX = this.position.x - barWidth / 2;
        const barY = this.position.y - this.height / 2 - 10;
        // Draw health bar background
        context.fillStyle = 'black';
        context.fillRect(barX, barY, barWidth, barHeight);
        // Draw current health level
        context.fillStyle = 'green';
        context.fillRect(barX, barY, barWidth * (this.health / this.maxHealth), barHeight);
    }
}
exports.BasicEnemy = BasicEnemy;
class FastEnemy extends BasicEnemy {
    constructor(path, spawnOffset = { x: 0, y: 0 }) {
        super(path, spawnOffset); // Call the base class constructor
        this.size = 25; // Size for FastEnemy
        this.width = this.size;
        this.height = this.size;
        this.speed = 2; // Increase speed
        this.health = 75; // Adjust health if needed
        this.maxHealth = 75;
        this.points = 15; // Adjust points awarded
        this.value = 0.5; // Adjust gold value
    }
    render(context) {
        // Draw enemy body with a different color to distinguish it
        context.fillStyle = 'orange';
        context.fillRect(this.position.x - this.width / 2, this.position.y - this.height / 2, this.width, this.height);
        // Draw black border around enemy
        context.strokeStyle = 'black';
        context.lineWidth = 1;
        context.strokeRect(this.position.x - this.width / 2, this.position.y - this.height / 2, this.width, this.height);
        // Render health bar
        this.renderHealthBar(context);
    }
}
exports.FastEnemy = FastEnemy;
class TankEnemy extends BasicEnemy {
    constructor(path, spawnOffset = { x: 0, y: 0 }) {
        super(path, spawnOffset); // Call the base class constructor
        this.size = 75; // Size for TankEnemy
        this.width = this.size;
        this.height = this.size;
        this.speed = 0.7; // Decrease speed
        this.health = 200; // Adjust health if needed
        this.maxHealth = 200;
        this.points = 30; // Adjust points awarded
        this.value = 2; // Adjust gold value
    }
    render(context) {
        // Draw enemy body with a different color to distinguish it
        context.fillStyle = 'purple';
        context.fillRect(this.position.x - this.width / 2, this.position.y - this.height / 2, this.width, this.height);
        // Draw black border around enemy
        context.strokeStyle = 'black';
        context.lineWidth = 1;
        context.strokeRect(this.position.x - this.width / 2, this.position.y - this.height / 2, this.width, this.height);
        // Render health bar
        this.renderHealthBar(context);
    }
}
exports.TankEnemy = TankEnemy;
