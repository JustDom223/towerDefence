// targetingStrategies.js

/**
 * Target the nearest enemy within range.
 * @param {Array} enemies - List of enemy objects.
 * @param {number} towerX - X-coordinate of the tower.
 * @param {number} towerY - Y-coordinate of the tower.
 * @param {number} range - Attack range of the tower.
 * @returns {Object|null} - The nearest enemy or null if none in range.
 */
export function getNearestEnemy(enemies, towerX, towerY, range) {
    let nearest = null;
    let minDistance = range;

    for (let enemy of enemies) {
        const dx = enemy.position.x - towerX;
        const dy = enemy.position.y - towerY;
        const distance = Math.hypot(dx, dy);

        if (distance < minDistance) {
            minDistance = distance;
            nearest = enemy;
        }
    }

    return nearest;
}

/**
 * Target the enemy with the most health within range.
 * @param {Array} enemies - List of enemy objects.
 * @param {number} towerX - X-coordinate of the tower.
 * @param {number} towerY - Y-coordinate of the tower.
 * @param {number} range - Attack range of the tower.
 * @returns {Object|null} - The enemy with the most health or null if none in range.
 */
export function getEnemyWithMostHealth(enemies, towerX, towerY, range) {
    let target = null;
    let maxHealth = -Infinity;

    for (let enemy of enemies) {
        const dx = enemy.position.x - towerX;
        const dy = enemy.position.y - towerY;
        const distance = Math.hypot(dx, dy);

        if (distance <= range && enemy.health > maxHealth) {
            maxHealth = enemy.health;
            target = enemy;
        }
    }

    return target;
}

/**
 * Target the enemy with the least health within range.
 * @param {Array} enemies - List of enemy objects.
 * @param {number} towerX - X-coordinate of the tower.
 * @param {number} towerY - Y-coordinate of the tower.
 * @param {number} range - Attack range of the tower.
 * @returns {Object|null} - The enemy with the least health or null if none in range.
 */
export function getEnemyWithLeastHealth(enemies, towerX, towerY, range) {
    let target = null;
    let minHealth = Infinity;

    for (let enemy of enemies) {
        const dx = enemy.position.x - towerX;
        const dy = enemy.position.y - towerY;
        const distance = Math.hypot(dx, dy);

        if (distance <= range && enemy.health < minHealth) {
            minHealth = enemy.health;
            target = enemy;
        }
    }

    return target;
}

/**
 * Target the enemy closest to the exit within range.
 * Assumes enemies have a 'progress' property indicating how close they are to the exit.
 * Higher 'progress' means closer to the exit.
 * @param {Array} enemies - List of enemy objects.
 * @param {number} towerX - X-coordinate of the tower.
 * @param {number} towerY - Y-coordinate of the tower.
 * @param {number} range - Attack range of the tower.
 * @returns {Object|null} - The enemy closest to exit or null if none in range.
 */
export function getEnemyClosestToExit(enemies, towerX, towerY, range) {
    let target = null;
    let maxProgress = -Infinity;

    for (let enemy of enemies) {
        const dx = enemy.position.x - towerX;
        const dy = enemy.position.y - towerY;
        const distance = Math.hypot(dx, dy);

        if (distance <= range && enemy.progress > maxProgress) {
            maxProgress = enemy.progress;
            target = enemy;
        }
    }

    return target;
}
