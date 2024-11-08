// waves.js

import { BasicEnemy, FastEnemy, TankEnemy } from './enemies.js';
// Import other enemy classes as needed

export const waves = [
    // Wave 1
    {
        number: 1,
        spawnGroups: [
            {
                class: BasicEnemy,
                count: 10,
                spawnInterval: 1000, // in milliseconds
                startDelay: 0, // Start immediately at the beginning of the wave
            },
        ],
    },
    // Wave 2
    {
        number: 2,
        spawnGroups: [
            {
                class: BasicEnemy,
                count: 12,
                spawnInterval: 900,
                startDelay: 0, // Start immediately
            },
            {
                class: FastEnemy,
                count: 5,
                spawnInterval: 800,
                startDelay: 2000, // Start 2 seconds after the wave begins
            },
        ],
    },
    // Wave 3
    {
        number: 3,
        spawnGroups: [
            {
                class: TankEnemy,
                count: 3,
                spawnInterval: 1500,
                startDelay: 0, // Start immediately
            },
            {
                class: FastEnemy,
                count: 7,
                spawnInterval: 700,
                startDelay: 3000, // Start 3 seconds after the wave begins
            },
            {
                class: BasicEnemy,
                count: 15,
                spawnInterval: 1000,
                startDelay: 5000, // Start 5 seconds after the wave begins
            },
        ],
    },
    // Wave 4
    {
        number: 4,
        spawnGroups: [
            {
                class: BasicEnemy,
                count: 15,
                spawnInterval: 900,
                startDelay: 0,
            },
            {
                class: FastEnemy,
                count: 10,
                spawnInterval: 600,
                startDelay: 2500, // Start 2.5 seconds after the wave begins
            },
            {
                class: TankEnemy,
                count: 4,
                spawnInterval: 1200,
                startDelay: 4000, // Start 4 seconds after the wave begins
            },
        ],
    },
    // Wave 5
    {
        number: 5,
        spawnGroups: [
            {
                class: FastEnemy,
                count: 15,
                spawnInterval: 500,
                startDelay: 0,
            },
            {
                class: TankEnemy,
                count: 5,
                spawnInterval: 1100,
                startDelay: 3000, // Start 3 seconds after the wave begins
            },
            {
                class: BasicEnemy,
                count: 20,
                spawnInterval: 800,
                startDelay: 6000, // Start 6 seconds after the wave begins
            },
            {
                class: FastEnemy,
                count: 15,
                spawnInterval: 10,
                startDelay: 0,
            },
        ],
    },
    // Wave 6
    {
        number: 6,
        spawnGroups: [
            {
                class: BasicEnemy,
                count: 20,
                spawnInterval: 850,
                startDelay: 0,
            },
            {
                class: FastEnemy,
                count: 12,
                spawnInterval: 550,
                startDelay: 2000,
            },
            {
                class: TankEnemy,
                count: 6,
                spawnInterval: 1000,
                startDelay: 4000,
            },
            // {
            //     class: ShieldEnemy,
            //     count: 4,
            //     spawnInterval: 1300,
            //     startDelay: 5000,     // New enemy type introduced
            // },
        ],
    },
    // Wave 7
    {
        number: 7,
        spawnGroups: [
            {
                class: FastEnemy,
                count: 20,
                spawnInterval: 450,
                startDelay: 0,
            },
            {
                class: TankEnemy,
                count: 7,
                spawnInterval: 900,
                startDelay: 2500,
            },
            {
                class: BasicEnemy,
                count: 25,
                spawnInterval: 700,
                startDelay: 5000,
            },
            // {
            //     class: ShieldEnemy,
            //     count: 5,
            //     spawnInterval: 1200,
            //     startDelay: 6000,
            // },
        ],
    },
    // Wave 8
    {
        number: 8,
        spawnGroups: [
            {
                class: BasicEnemy,
                count: 25,
                spawnInterval: 800,
                startDelay: 0,
            },
            {
                class: FastEnemy,
                count: 15,
                spawnInterval: 500,
                startDelay: 2000,
            },
            {
                class: TankEnemy,
                count: 8,
                spawnInterval: 800,
                startDelay: 4000,
            },
            // {
            //     class: ShieldEnemy,
            //     count: 6,
            //     spawnInterval: 1100,
            //     startDelay: 5500,
            // },
        ],
    },
    // Wave 9
    {
        number: 9,
        spawnGroups: [
            {
                class: FastEnemy,
                count: 25,
                spawnInterval: 400,
                startDelay: 0,
            },
            {
                class: TankEnemy,
                count: 10,
                spawnInterval: 700,
                startDelay: 2500,
            },
            {
                class: BasicEnemy,
                count: 30,
                spawnInterval: 600,
                startDelay: 5000,
            },
            // {
            //     class: ShieldEnemy,
            //     count: 7,
            //     spawnInterval: 1000,
            //     startDelay: 6000,
            // },
        ],
    },
    // Wave 10
    {
        number: 10,
        spawnGroups: [
            // {
            //     class: BossEnemy,      // Introducing a Boss enemy
            //     count: 1,
            //     spawnInterval: 0,       // Boss appears after all regular enemies
            //     startDelay: 0,          // Start immediately or set a specific delay
            // },
            {
                class: BasicEnemy,
                count: 35,
                spawnInterval: 500,
                startDelay: 2000,
            },
            {
                class: FastEnemy,
                count: 20,
                spawnInterval: 350,
                startDelay: 3000,
            },
            {
                class: TankEnemy,
                count: 12,
                spawnInterval: 600,
                startDelay: 4500,
            },
            // {
            //     class: ShieldEnemy,
            //     count: 8,
            //     spawnInterval: 900,
            //     startDelay: 5500,
            // },
        ],
    },
];
