// tower.ts

import Projectile from './projectiles';
import { TOWER_SIZE } from './gameConfig';
import { BasicEnemy } from './enemies';

export default class Tower {
    x: number;
    y: number;
    range: number;
    fireRate: number;
    fireTimer: number;
    context: CanvasRenderingContext2D;
    enemies: BasicEnemy[];
    damage: number;

    constructor(
        x: number,
        y: number,
        context: CanvasRenderingContext2D,
        enemies: BasicEnemy[],
    ) {
        this.x = x;
        this.y = y;
        this.range = 150;
        this.fireRate = 65;
        this.fireTimer = 0;
        this.context = context;
        this.enemies = enemies;
        this.damage = 25;

    }

    update(projectiles: Projectile[]): void {
        if (this.fireTimer <= 0) {
            const targetEnemy = this.getEnemyClosestToExit();
            if (targetEnemy) {
                projectiles.push(
                    new Projectile(
                        this.x,
                        this.y,
                        targetEnemy,
                        this.damage,
                        this.context
                    )
                );
                this.fireTimer = this.fireRate;
            }
        } else {
            this.fireTimer--;
        }
    }

    render(): void {
        this.context.fillStyle = 'blue';
        this.context.fillRect(
            this.x - TOWER_SIZE / 2,
            this.y - TOWER_SIZE / 2,
            TOWER_SIZE,
            TOWER_SIZE
        );
    }

    getNearestEnemy(): BasicEnemy | null {
        let nearest: BasicEnemy | null = null;
        let minDistance = this.range;

        for (let enemy of this.enemies) {
            const dx = enemy.position.x - this.x;
            const dy = enemy.position.y - this.y;
            const distance = Math.hypot(dx, dy);

            if (distance < minDistance) {
                minDistance = distance;
                nearest = enemy;
            }
        }

        return nearest;
    }

    getEnemyWithMostHealth(): BasicEnemy | null {
        let target: BasicEnemy | null = null;
        let maxHealth = -Infinity;

        for (let enemy of this.enemies) {
            const dx = enemy.position.x - this.x;
            const dy = enemy.position.y - this.y;
            const distance = Math.hypot(dx, dy);

            if (distance <= this.range && enemy.health > maxHealth) {
                maxHealth = enemy.health;
                target = enemy;
            }
        }

        return target;
    }

    getEnemyWithLeastHealth(): BasicEnemy | null {
        let target: BasicEnemy | null = null;
        let minHealth = Infinity;

        for (let enemy of this.enemies) {
            const dx = enemy.position.x - this.x;
            const dy = enemy.position.y - this.y;
            const distance = Math.hypot(dx, dy);

            if (distance <= this.range && enemy.health < minHealth) {
                minHealth = enemy.health;
                target = enemy;
            }
        }

        return target;
    }

    getEnemyClosestToExit(): BasicEnemy | null {
        let target: BasicEnemy | null = null;
        let maxProgress = -Infinity;

        for (let enemy of this.enemies) {
            const dx = enemy.position.x - this.x;
            const dy = enemy.position.y - this.y;
            const distance = Math.hypot(dx, dy);

            if (distance <= this.range && enemy.waypointIndex > maxProgress) {
                maxProgress = enemy.waypointIndex;
                target = enemy;
            }
        }

        return target;
    }
}
