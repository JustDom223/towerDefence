"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const projectiles_js_1 = __importDefault(require("./projectiles.js"));
const gameConfig_js_1 = require("./gameConfig.js");
class Tower {
    constructor(x, y, context, enemies, removeProjectile, removeEnemy) {
        this.x = x;
        this.y = y;
        this.range = 150;
        this.fireRate = 65;
        this.fireTimer = 0;
        this.context = context;
        this.enemies = enemies;
        this.damage = 25;
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
                projectiles.push(new projectiles_js_1.default(this.x, this.y, nearestEnemy, this.damage, this.context, this.removeProjectile, this.removeEnemy));
                this.fireTimer = this.fireRate;
            }
        }
        else {
            this.fireTimer--;
        }
    }
    render() {
        this.context.fillStyle = 'blue';
        this.context.fillRect(this.x - gameConfig_js_1.TOWER_SIZE / 2, this.y - gameConfig_js_1.TOWER_SIZE / 2, gameConfig_js_1.TOWER_SIZE, gameConfig_js_1.TOWER_SIZE);
    }
}
exports.default = Tower;
