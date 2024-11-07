// projectiles.js

export default class Projectile {
    constructor(x, y, target, damage, context, removeProjectile, removeEnemy, increaseScore, increaseGold) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.damage = damage;
        this.speed = 5;
        this.radius = 3; // Size of the projectile
        this.context = context;

        // Functions for managing game state
        this.removeProjectile = removeProjectile;
        this.removeEnemy = removeEnemy;
        this.increaseScore = increaseScore;
        this.increaseGold = increaseGold;
    }

    update() {
        const dx = this.target.position.x - this.x;
        const dy = this.target.position.y - this.y;
        const distance = Math.hypot(dx, dy);

        if (distance < this.speed) {
            // Projectile has reached the enemy
            this.target.health -= this.damage;
            this.removeProjectile(this);

            // Remove enemy if health is below zero
            if (this.target.health <= 0) {
                this.increaseScore(10);
                this.increaseGold(1); // Gain 1 gold for defeating an enemy
                this.removeEnemy(this.target);
            }
        } else {
            // Move projectile towards the enemy
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        }
    }

    render() {
        // Draw projectile as a small circle
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.context.fillStyle = "black";
        this.context.fill();
    }
}
