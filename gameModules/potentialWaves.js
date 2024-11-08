// waves.js

import { BasicEnemy, FastEnemy, TankEnemy } from './enemies.js';
// Import other enemy classes as needed

/**
 * Generates an array of wave configurations for the tower defense game.
 * @param {number} totalWaves - The total number of waves to generate.
 * @returns {Array} An array of wave objects.
 */
function generateWaves(totalWaves) {
    const waves = [];

    for (let i = 1; i <= totalWaves; i++) {
        const wave = {
            number: i,
            enemies: [],
            spawnInterval: 100 - Math.floor(i / 3), // Decrease spawnInterval as waves progress
        };

        // Ensure spawnInterval doesn't go below a minimum threshold (e.g., 30)
        if (wave.spawnInterval < 30) {
            wave.spawnInterval = 30;
        }

        // BasicEnemy count increases with each wave
        const basicEnemyCount = 10 + Math.floor(i / 2);
        wave.enemies.push({ class: BasicEnemy, count: basicEnemyCount });

        // Introduce FastEnemy starting from wave 5
        if (i >= 5) {
            const fastEnemyCount = 5 + Math.floor(i / 4);
            wave.enemies.push({ class: FastEnemy, count: fastEnemyCount });
        }

        // Introduce TankEnemy starting from wave 10
        if (i >= 10) {
            const tankEnemyCount = 3 + Math.floor(i / 10);
            wave.enemies.push({ class: TankEnemy, count: tankEnemyCount });
        }

        // Optionally, add more enemy types or special conditions at certain waves
        // For example, boss waves at every 10th wave
        /*
        if (i % 10 === 0) {
            wave.enemies.push({ class: BossEnemy, count: 1 });
        }
        */

        waves.push(wave);
    }

    return waves;
}

export const waves = generateWaves(30);
