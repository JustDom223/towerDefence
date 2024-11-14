// projectile.ts

import { BasicEnemy } from './enemies';

export interface Position {
    x: number;
    y: number;
}

export default class Projectile {
    x: number;
    y: number;
    target: BasicEnemy;
    damage: number;
    speed: number;
    radius: number;
    context: CanvasRenderingContext2D;
    isExpired: boolean;

    constructor(
        x: number,
        y: number,
        target: BasicEnemy,
        damage: number,
        context: CanvasRenderingContext2D
    ) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.damage = damage;
        this.speed = 5;
        this.radius = 3;
        this.context = context;
        this.isExpired = false; // Flag to indicate if the projectile should be removed
    }

    update(): void {
        const dx = this.target.position.x - this.x;
        const dy = this.target.position.y - this.y;
        const distance = Math.sqrt(dx ** 2 + dy ** 2);

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

    render(): void {
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.context.fillStyle = 'black';
        this.context.fill();
    }
}
