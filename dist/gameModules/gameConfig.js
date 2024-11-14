"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAPS = exports.PATH_WIDTH = exports.TARGETINGMODES = exports.TOWER_SIZE = exports.INITIAL_SCORE = exports.INITIAL_GOLD = exports.INITIAL_LIVES = void 0;
//Game Config
exports.INITIAL_LIVES = 20;
exports.INITIAL_GOLD = 32;
exports.INITIAL_SCORE = 0;
//Tower Config
exports.TOWER_SIZE = 100;
exports.TARGETINGMODES = {
    MOST_HEALTH: 'most_health',
    CLOSEST_TO_EXIT: 'closest_to_exit',
    LAST_ENTERED: 'last_entered',
    LEAST_HEALTH: 'least_health',
};
//Map Config
exports.PATH_WIDTH = 100;
// Maps
exports.MAPS = [
    [
        { x: 20, y: 0 },
        { x: 20, y: 20 },
        { x: 80, y: 20 },
        { x: 80, y: 40 },
        { x: 20, y: 40 },
        { x: 20, y: 60 },
        { x: 80, y: 60 },
        { x: 80, y: 100 },
    ],
    // [
    //     { x: 10, y: 0 },
    //     { x: 90, y: 40 },
    //     { x: 10, y: 80 },
    //     { x: 90, y: 100 },
    // ],
];
