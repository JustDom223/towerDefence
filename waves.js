import { BasicEnemy, FastEnemy, TankEnemy } from './enemies.js';
// Import other enemy classes as needed

export const waves = [
    {
        number: 1,
        enemies: [{ class: BasicEnemy, count: 10 }],
        spawnInterval: 100,
    },
    {
        number: 2,
        enemies: [
            { class: BasicEnemy, count: 8 },
            { class: FastEnemy, count: 5 },
        ],
        spawnInterval: 90,
    },
    {
        number: 3,
        enemies: [
            { class: TankEnemy, count: 3 },
            { class: FastEnemy, count: 7 },
            { class: BasicEnemy, count: 15 },
        ],
        spawnInterval: 80,
    },
    // Add more waves as needed
];
