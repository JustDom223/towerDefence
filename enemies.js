export class BasicEnemy {
    constructor(path) {
        this.width = 20;
        this.height = 20;
        this.health = 100;
        this.maxHealth = 100;
        this.speed = 1;
        this.position = { x: path[0].x, y: path[0].y };
        this.waypointIndex = 0;
        this.path = path;
        this.points = 10; // Points awarded when the enemy is defeated
        this.value = 1;
        this.isDefeated = false; // Flag to indicate if the enemy should be removed
    }

    update() {
        // Check if the enemy has reached the end of the path
        if (this.isAtEnd()) {
            this.isDefeated = true; // Mark for removal if at the end
            return;
        }

        // Move toward the next waypoint
        const targetX = this.path[this.waypointIndex + 1].x;
        const targetY = this.path[this.waypointIndex + 1].y;
        const dx = targetX - this.position.x;
        const dy = targetY - this.position.y;
        const distance = Math.hypot(dx, dy);

        if (distance < this.speed) {
            // Snap to the waypoint and move to the next one
            this.position.x = targetX;
            this.position.y = targetY;
            this.waypointIndex++;
        } else {
            // Move towards the target waypoint
            this.position.x += (dx / distance) * this.speed;
            this.position.y += (dy / distance) * this.speed;
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

    // In enemy.js

    // Add this method to the Enemy class
    renderHealthBar(context) {
        // Draw health bar background
        context.fillStyle = 'black';
        context.fillRect(
            this.position.x - this.width / 2,
            this.position.y - this.height / 2 - 10,
            this.width,
            5,
        );

        // Draw current health level
        context.fillStyle = 'green';
        context.fillRect(
            this.position.x - this.width / 2,
            this.position.y - this.height / 2 - 10,
            this.width * (this.health / this.maxHealth),
            5,
        );
    }

    // Then, modify the render method to use it
    render(context) {
        // Draw enemy body
        context.fillStyle = 'red';
        context.fillRect(
            this.position.x - this.width / 2,
            this.position.y - this.height / 2,
            this.width,
            this.height,
        );

        // Draw black border around enemy
        context.strokeStyle = 'black';
        context.lineWidth = 1;
        context.strokeRect(
            this.position.x - this.width / 2,
            this.position.y - this.height / 2,
            this.width,
            this.height,
        );

        // Render health bar
        this.renderHealthBar(context);
    }
}

export class FastEnemy extends BasicEnemy {
    constructor(path) {
        super(path); // Call the base class constructor
        this.speed = 2; // Increase speed
        this.health = 75; // Adjust health if needed
        this.maxHealth = 75;
        this.points = 15; // Adjust points awarded
        this.value = 2; // Adjust gold value
    }

    // Optionally, you can override methods if behavior differs
    render(context) {
        // Draw enemy body with a different color to distinguish it
        context.fillStyle = 'orange';
        context.fillRect(
            this.position.x - this.width / 2,
            this.position.y - this.height / 2,
            this.width,
            this.height,
        );

        // Call the base class render method for common rendering
        super.renderHealthBar(context);
    }

    // Since the health bar rendering is the same, we can move it to a separate method in the base class
}
export class TankEnemy extends BasicEnemy {
    constructor(path) {
        super(path); // Call the base class constructor
        this.speed = 0.5; // Increase speed
        this.health = 200; // Adjust health if needed
        this.maxHealth = 200;
        this.points = 30; // Adjust points awarded
        this.value = 4; // Adjust gold value
    }

    // Optionally, you can override methods if behavior differs
    render(context) {
        // Draw enemy body with a different color to distinguish it
        context.fillStyle = 'purple';
        context.fillRect(
            this.position.x - this.width / 2,
            this.position.y - this.height / 2,
            this.width,
            this.height,
        );

        // Call the base class render method for common rendering
        super.renderHealthBar(context);
    }

    // Since the health bar rendering is the same, we can move it to a separate method in the base class
}
