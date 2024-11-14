export default class Projectile {
    constructor(x, y, target, damage, context) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.damage = damage;
        this.speed = 5;
        this.radius = 3;
        this.context = context;
        this.isExpired = false; // Flag to indicate if the projectile should be removed
    }

    update() {
        const dx = this.target.position.x - this.x;
        const dy = this.target.position.y - this.y;
        const distance = Math.hypot(dx, dy);

        if (distance < this.speed) {
            // Projectile has reached the enemy
            this.target.health -= this.damage;
            this.isExpired = true; // Mark for removal

            // If the enemy's health is below zero, mark it for removal
            if (this.target.health <= 0) {
                this.target.isDefeated = true; // We'll handle this flag in the game loop
            }
        } else {
            // Move projectile towards the enemy
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        }
    }

    render() {
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.context.fillStyle = 'black';
        this.context.fill();
    }
}
