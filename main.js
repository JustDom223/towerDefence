// main.js

// ------------------- Import Necessary Modules -------------------
import { BasicEnemy, FastEnemy, TankEnemy } from './gameModules/enemies.js'; // Adjust the path as necessary
import Tower from './gameModules/towers.js'; // Import your Tower class
import {
    PATH_WIDTH,
    TOWER_SIZE,
    INITIAL_GOLD,
    INITIAL_LIVES,
    INITIAL_SCORE,
    MAPS,
} from './gameModules/gameConfig.js'; // Import your game configuration constants
import { waves } from './gameModules/waves.js'; // Import your waves configuration
import { initControls, getPreview } from './gameModules/controls.js'; // Import your controls module

// ------------------- Canvas Setup -------------------

// Get the canvas and context
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

// Function to set canvas size based on the window size
function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Initial canvas size
setCanvasSize();

// Handle window resize
window.addEventListener('resize', () => {
    setCanvasSize();
    // Rescale paths if necessary
    path = scalePath(MAPS[selectedMapIndex]);
});

// ------------------- Game Variables -------------------

// Select a random map from MAPS
const selectedMapIndex = Math.floor(Math.random() * MAPS.length);
const rawPath = MAPS[selectedMapIndex];
let path = scalePath(rawPath); // Scale the path based on canvas size

// Initialize game entities
const enemies = [];
const towers = [];
const projectiles = [];
let lives = INITIAL_LIVES;
let score = INITIAL_SCORE;
let gold = { value: INITIAL_GOLD }; // Using an object for mutability
let gameOverFlag = false;

// Wave management variables
let currentWaveIndex = 0;
let enemiesSpawnedInWave = 0;
let waveSpawnTimer = 0;
let waveInProgress = false;
let waveDelayTimer = 200; // Frames to wait before starting the next wave

// ------------------- Helper Functions -------------------

/**
 * Scales the path points based on the current canvas size.
 * If your MAPS are defined with relative coordinates, implement scaling here.
 * Currently assuming absolute coordinates.
 * @param {Array} path - The path with absolute coordinates.
 * @returns {Array} The scaled path.
 */
function scalePath(path) {
    // If MAPS are defined with relative coordinates (percentages), implement scaling here.
    // Currently assuming absolute coordinates.
    return path.map((point) => ({ x: point.x, y: point.y }));
}

/**
 * Generates a random perpendicular offset within the path's width for enemy spawning.
 * Ensures that enemies spawn within the path boundaries without overlapping.
 * @param {Array} path - The array of points defining the path.
 * @param {number} enemySize - The size (width/height) of the enemy.
 * @returns {Object} The spawn offset { x, y }.
 */
function generateRandomSpawnOffset(path, enemySize) {
    // Calculate the direction vector of the first segment
    const dx = path[1].x - path[0].x;
    const dy = path[1].y - path[0].y;
    const distance = Math.hypot(dx, dy);
    const perpendicularX = -dy / distance;
    const perpendicularY = dx / distance;

    // Define the maximum offset based on PATH_WIDTH and enemy size
    const halfPathWidth = PATH_WIDTH / 2;
    const maxOffset = halfPathWidth - enemySize / 2;
    const minOffset = -maxOffset;

    // Generate a random offset within [minOffset, maxOffset]
    const spawnOffsetMagnitude =
        Math.random() * (maxOffset - minOffset) + minOffset;

    // Determine spawnOffset direction based on spawnOffsetMagnitude
    const spawnOffsetDirection = spawnOffsetMagnitude >= 0 ? 1 : -1;

    // Absolute magnitude for consistent offset regardless of direction
    const absoluteOffset = Math.abs(spawnOffsetMagnitude);

    // Multiply by the perpendicular vector to get the offset components
    return {
        x: absoluteOffset * perpendicularX * spawnOffsetDirection,
        y: absoluteOffset * perpendicularY * spawnOffsetDirection,
    };
}

/**
 * Calculates the shortest distance from a point to a line segment.
 * @param {number} px - The x-coordinate of the point.
 * @param {number} py - The y-coordinate of the point.
 * @param {number} x1 - The x-coordinate of the segment's start.
 * @param {number} y1 - The y-coordinate of the segment's start.
 * @param {number} x2 - The x-coordinate of the segment's end.
 * @param {number} y2 - The y-coordinate of the segment's end.
 * @returns {number} The shortest distance.
 */
function pointToSegmentDistance(px, py, x1, y1, x2, y2) {
    const lineLengthSquared = (x2 - x1) ** 2 + (y2 - y1) ** 2;
    if (lineLengthSquared === 0) return Math.hypot(px - x1, py - y1);

    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / lineLengthSquared;
    t = Math.max(0, Math.min(1, t));
    const projectionX = x1 + t * (x2 - x1);
    const projectionY = y1 + t * (y2 - y1);
    return Math.hypot(px - projectionX, py - projectionY);
}

// ------------------- Game Functions -------------------

/**
 * Spawns enemies based on the current wave configuration.
 */
function spawnEnemies() {
    if (!waveInProgress && waveDelayTimer <= 0) {
        startNextWave();
    }

    if (waveInProgress) {
        const currentWave = waves[currentWaveIndex];
        const totalEnemiesInWave = currentWave.enemies.reduce(
            (sum, group) => sum + group.count,
            0,
        );

        if (waveSpawnTimer <= 0 && enemiesSpawnedInWave < totalEnemiesInWave) {
            let enemyClass = null;
            let enemiesSpawnedSoFar = 0;

            for (let group of currentWave.enemies) {
                if (enemiesSpawnedInWave < enemiesSpawnedSoFar + group.count) {
                    enemyClass = group.class;
                    break;
                }
                enemiesSpawnedSoFar += group.count;
            }

            if (enemyClass) {
                // Determine enemy size based on class
                let enemySize;
                if (enemyClass === BasicEnemy) {
                    enemySize = 20;
                } else if (enemyClass === FastEnemy) {
                    enemySize = 10;
                } else if (enemyClass === TankEnemy) {
                    enemySize = 30;
                } else {
                    enemySize = 20; // Default size
                }

                // Generate random spawn offset
                const spawnOffset = generateRandomSpawnOffset(path, enemySize);

                // Instantiate enemy with spawnOffset
                enemies.push(new enemyClass(path, spawnOffset));
                enemiesSpawnedInWave++;
                waveSpawnTimer = currentWave.spawnInterval;
            } else {
                console.error(
                    'Enemy class not found for the current wave configuration.',
                );
            }
        } else {
            waveSpawnTimer--;
        }

        // Check if the wave has ended
        if (
            enemiesSpawnedInWave >= totalEnemiesInWave &&
            enemies.length === 0
        ) {
            endCurrentWave();
        }
    } else {
        waveDelayTimer--;
    }
}

/**
 * Starts the next wave of enemies.
 */
function startNextWave() {
    if (currentWaveIndex < waves.length) {
        waveInProgress = true;
        enemiesSpawnedInWave = 0;
        waveSpawnTimer = 0;
        displayWaveStart();
    } else {
        // All waves completed
        displayVictory();
        gameOverFlag = true;
    }
}

/**
 * Ends the current wave and prepares for the next one.
 */
function endCurrentWave() {
    waveInProgress = false;
    waveDelayTimer = 200; // Adjust as needed
    currentWaveIndex++;
    displayWaveEnd();
}

/**
 * Draws all enemy paths on the canvas.
 */
function drawPaths() {
    const PATH_COLORS = ['gray', 'orange', 'purple', 'cyan']; // Example colors

    context.lineWidth = PATH_WIDTH;
    context.lineCap = 'round';

    MAPS.forEach((singlePath, index) => {
        const scaledPath = scalePath(singlePath);
        context.strokeStyle = PATH_COLORS[index % PATH_COLORS.length]; // Cycle through colors
        context.beginPath();
        context.moveTo(scaledPath[0].x, scaledPath[0].y);
        for (let i = 1; i < scaledPath.length; i++) {
            context.lineTo(scaledPath[i].x, scaledPath[i].y);
        }
        context.stroke();
    });
}

/**
 * The main game loop, which updates and renders the game continuously.
 */
function gameLoop() {
    if (!gameOverFlag) {
        update();
        render();
        requestAnimationFrame(gameLoop);
    } else {
        render();
        displayGameOver();
    }
}

/**
 * Updates the game state, including enemies, towers, and projectiles.
 */
function update() {
    spawnEnemies();

    // Update enemies and remove defeated ones
    for (let enemy of enemies) {
        enemy.update();
    }
    enemies.forEach((enemy, index) => {
        if (enemy.isDefeated) {
            if (enemy.health <= 0) {
                score += enemy.points;
                gold.value += enemy.value; // Adjust gold gain if desired
            } else {
                lives--; // Lose a life if an enemy reaches the end
                if (lives <= 0) gameOverFlag = true;
            }
            enemies.splice(index, 1); // Remove defeated enemy
        }
    });

    // Update towers and projectiles
    for (let tower of towers) {
        tower.update(projectiles);
    }

    for (let projectile of projectiles) {
        projectile.update();
    }
    projectiles.forEach((projectile, index) => {
        if (projectile.isExpired) {
            projectiles.splice(index, 1); // Remove expired projectile
        }
    });
}

/**
 * Renders all game elements on the canvas, including towers, enemies, projectiles, and UI.
 */
function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawPaths();

    for (let tower of towers) {
        tower.render();
    }

    for (let enemy of enemies) {
        enemy.render(context);
    }

    for (let projectile of projectiles) {
        projectile.render();
    }

    // Display score, lives, gold, and wave info
    context.fillStyle = 'black';
    context.font = '20px Arial';
    context.textAlign = 'left';
    context.fillText(`Lives: ${lives}`, 10, 30);
    context.fillText(`Score: ${score}`, 10, 60);
    context.fillText(`Gold: ${gold.value}`, 10, 90);
    context.fillText(
        `Wave: ${waves[currentWaveIndex]?.number || waves.length}`,
        10,
        120,
    );
    context.fillText(`Enemies Remaining: ${enemies.length}`, 10, 150);

    // Render the tower preview as a square
    const preview = getPreview();
    if (preview.visible) {
        context.fillStyle = preview.color; // Use the color based on placement validity
        context.fillRect(
            preview.x - TOWER_SIZE / 2,
            preview.y - TOWER_SIZE / 2,
            TOWER_SIZE,
            TOWER_SIZE,
        );
    }
}

/**
 * Displays the "Game Over" screen.
 */
function displayGameOver() {
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'white';
    context.font = '40px Arial';
    context.textAlign = 'center';
    context.fillText('Game Over', canvas.width / 2, canvas.height / 2);
    context.font = '20px Arial';
    context.fillText(
        `Final Score: ${score}`,
        canvas.width / 2,
        canvas.height / 2 + 40,
    );
}

/**
 * Displays the "You Win!" screen upon completing all waves.
 */
function displayVictory() {
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'white';
    context.font = '40px Arial';
    context.textAlign = 'center';
    context.fillText('You Win!', canvas.width / 2, canvas.height / 2);
    context.font = '20px Arial';
    context.fillText(
        `Final Score: ${score}`,
        canvas.width / 2,
        canvas.height / 2 + 40,
    );
}

/**
 * Displays a "Wave Start" message.
 */
function displayWaveStart() {
    context.fillStyle = 'black';
    context.font = '30px Arial';
    context.textAlign = 'center';
    context.fillText(
        `Wave ${waves[currentWaveIndex].number} Start!`,
        canvas.width / 2,
        canvas.height / 2 - 40,
    );
}

/**
 * Displays a "Wave Complete" message.
 */
function displayWaveEnd() {
    context.fillStyle = 'black';
    context.font = '30px Arial';
    context.textAlign = 'center';
    context.fillText(
        `Wave ${waves[currentWaveIndex].number} Complete!`,
        canvas.width / 2,
        canvas.height / 2 - 40,
    );
}

/**
 * Displays a "Not enough gold!" message when the player tries to place a tower without sufficient funds.
 */
function displayNotEnoughGold() {
    context.fillStyle = 'red';
    context.font = '30px Arial';
    context.textAlign = 'center';
    context.fillText(
        'Not enough gold!',
        canvas.width / 2,
        canvas.height / 2 + 80,
    );
    setTimeout(render, 1000); // Clear the message after 1 second
}

/**
 * Displays a "Cannot place tower here!" message when placement is invalid.
 */
function displayCannotPlaceHere() {
    context.fillStyle = 'red';
    context.font = '30px Arial';
    context.textAlign = 'center';
    context.fillText(
        'Cannot place tower here!',
        canvas.width / 2,
        canvas.height / 2 + 80,
    );
    setTimeout(render, 1000); // Clear the message after 1 second
}

// ------------------- Game State Modification Functions -------------------

/**
 * Adds a new tower to the game at the specified coordinates.
 * @param {number} x - The x-coordinate for the tower's placement.
 * @param {number} y - The y-coordinate for the tower's placement.
 */
function addTower(x, y) {
    towers.push(new Tower(x, y, context, enemies));
}

/**
 * Deducts a specified amount of gold from the player's total.
 * @param {number} amount - The amount of gold to deduct.
 */
function deductGold(amount) {
    gold.value -= amount;
}

// Wrapper functions for displaying messages (to be passed to controls.js)
function displayNotEnoughGoldWrapper() {
    displayNotEnoughGold();
}

function displayCannotPlaceHereWrapper() {
    displayCannotPlaceHere();
}

// ------------------- Initialize Controls Module -------------------

// Initialize the controls module by passing necessary dependencies
initControls(canvas, {
    gold,
    deductGold,
    addTower,
    displayNotEnoughGold: displayNotEnoughGoldWrapper,
    displayCannotPlaceHere: displayCannotPlaceHereWrapper,
    isOnPath,
    isOnTower,
});

// ------------------- Start the Game Loop -------------------

// Begin the game loop
requestAnimationFrame(gameLoop);

// ------------------- Placement Validation Functions -------------------

/**
 * Checks if the specified coordinates are on any enemy path.
 * @param {number} x - The x-coordinate to check.
 * @param {number} y - The y-coordinate to check.
 * @returns {boolean} True if on any path; otherwise, false.
 */
function isOnPath(x, y) {
    const halfPathWidth = PATH_WIDTH / 2;
    const towerHalfSize = TOWER_SIZE / 2;
    for (let singlePath of MAPS) {
        const scaledPath = scalePath(singlePath);
        for (let i = 0; i < scaledPath.length - 1; i++) {
            const x1 = scaledPath[i].x;
            const y1 = scaledPath[i].y;
            const x2 = scaledPath[i + 1].x;
            const y2 = scaledPath[i + 1].y;
            const distance = pointToSegmentDistance(x, y, x1, y1, x2, y2);
            if (distance < halfPathWidth + towerHalfSize) {
                return true;
            }
        }
    }
    return false;
}

/**
 * Checks if the specified coordinates overlap with any existing tower.
 * @param {number} x - The x-coordinate to check.
 * @param {number} y - The y-coordinate to check.
 * @returns {boolean} True if overlapping a tower; otherwise, false.
 */
function isOnTower(x, y) {
    for (let tower of towers) {
        const dx = x - tower.x;
        const dy = y - tower.y;
        const distance = Math.hypot(dx, dy);
        if (distance < TOWER_SIZE) {
            // Corrected from TOWER_SIZE / 2 to TOWER_SIZE
            // Prevent overlapping by ensuring the distance between towers is at least TOWER_SIZE
            return true;
        }
    }
    return false;
}
