//Game Config
export const INITIAL_LIVES = 5;
export const INITIAL_GOLD = 29;
export const INITIAL_SCORE = 0;

//Tower Config
export const TOWER_SIZE = 40;
//Map Config
export const PATH_WIDTH = 70;


// gameConfig.js

export const MAPS = [
    // Map 1: Original Path
    [
        { x: window.innerWidth * 0.2, y: 0 },
        { x: window.innerWidth * 0.2, y: window.innerHeight * 0.6 },
        { x: window.innerWidth * 0.8, y: window.innerHeight * 0.6 },
        { x: window.innerWidth * 0.8, y: window.innerHeight },
    ],
    // Map 2: New Path
    // [
    //     { x: window.innerWidth * 0.1, y: 0 },
    //     { x: window.innerWidth * 0.1, y: window.innerHeight * 0.4 },
    //     { x: window.innerWidth * 0.9, y: window.innerHeight * 0.4 },
    //     { x: window.innerWidth * 0.9, y: window.innerHeight },
    // ]
    // Add more maps as needed
];