//Game Config
export const INITIAL_LIVES = 20;
export const INITIAL_GOLD = 32;
export const INITIAL_SCORE = 0;

//Tower Config
export const TOWER_SIZE = 100;
export const TARGETINGMODES = {
  MOST_HEALTH: 'most_health',
  CLOSEST_TO_EXIT: 'closest_to_exit',
  LAST_ENTERED: 'last_entered',
  LEAST_HEALTH: 'least_health',
};

//Map Config
export const PATH_WIDTH = 100;

// Maps
export const MAPS = [
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
