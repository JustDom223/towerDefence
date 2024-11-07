// towers.js

import Projectile from './projectiles.js';

export default class Tower {
    constructor(x, y, context, enemies, removeProjectile, removeEnemy) {
        this.x = x;
        this.y = y;
        this.range = 100;
        this.fireRate = 60;
        this.fireTimer = 0;
        this.context = context;
        this.enemies = enemies;
        this.damage = 20;

        // Functions for managing game state
        this.removeProjectile = removeProjectile;
        this.removeEnemy = removeEnemy;

        // Projectiles will be managed globally
    }

    update(projectiles) {
        if (this.fireTimer <= 0) {
            let nearestEnemy = null;
            let nearestDistance = this.range;
            for (let enemy of this.enemies) {
                const dx = enemy.position.x - this.x;
                const dy = enemy.position.y - this.y;
                const distance = Math.hypot(dx, dy);
                if (distance < nearestDistance) {
                    nearestEnemy = enemy;
                    nearestDistance = distance;
                }
            }
            if (nearestEnemy) {
                projectiles.push(new Projectile(
                    this.x,
                    this.y,
                    nearestEnemy,
                    this.damage,
                    this.context,
                    this.removeProjectile,
                    this.removeEnemy
                ));
                this.fireTimer = this.fireRate;
            }
        } else {
            this.fireTimer--;
        }
    }

    render() {
        this.context.fillStyle = 'blue';
        this.context.fillRect(this.x - 10, this.y - 10, 20, 20);
    }
}
