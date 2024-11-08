// main.js

// ------------------- Import Necessary Modules -------------------
import {
  BasicEnemy,
  FastEnemy,
  TankEnemy,
  // ShieldEnemy,
  // BossEnemy, // Uncomment if used in waves
} from './gameModules/enemies.js';
import Tower from './gameModules/towers.js';
import {
  PATH_WIDTH,
  TOWER_SIZE,
  INITIAL_GOLD,
  INITIAL_LIVES,
  INITIAL_SCORE,
  MAPS
} from './gameModules/gameConfig.js';
import { waves } from './gameModules/waves.js';
import { initControls, getPreview } from './gameModules/controls.js';


// ------------------- Canvas Setup -------------------

const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

function setCanvasSize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

setCanvasSize();

window.addEventListener('resize', () => {
  setCanvasSize();
  path = scalePath(rawPath);
});

// ------------------- Game Variables -------------------

// Define gold as a constant object to maintain reference
const gold = { value: INITIAL_GOLD };
let score = INITIAL_SCORE;

// Other game state variables
let selectedMapIndex;
let rawPath;
let path;

let enemies;
let towers;
let projectiles;
let lives;
let gameOverFlag;
let gameWonFlag;

let currentWaveIndex;
let waveInProgress;
let waveDelayTimer;
let currentWaveSpawnGroups;

let lastFrameTime;

// Initialize game state
function initializeGame() {
  selectedMapIndex = Math.floor(Math.random() * MAPS.length);
  rawPath = MAPS[selectedMapIndex];
  path = scalePath(rawPath);

  enemies = [];
  towers = [];
  projectiles = [];
  lives = INITIAL_LIVES;
  score = INITIAL_SCORE;
  gold.value = INITIAL_GOLD; // Reset gold without reassigning
  gameOverFlag = false;
  gameWonFlag = false;

  currentWaveIndex = 0;
  waveInProgress = false;
  waveDelayTimer = 2000; // 2 seconds delay between waves
  currentWaveSpawnGroups = [];

  lastFrameTime = Date.now();
}

// Call initializeGame to set the initial state
initializeGame();

// ------------------- Helper Functions -------------------

/**
* Scales a path defined with relative coordinates to actual canvas size.
* @param {Array} relativePath - Array of points with x and y as percentages.
* @returns {Array} scaledPath - Array of points with x and y in pixels.
*/
function scalePath(relativePath) {
  return relativePath.map(point => ({
      x: (point.x / 100) * canvas.width,
      y: (point.y / 100) * canvas.height,
  }));
}

function generateRandomSpawnOffset(path, enemySize) {
  const dx = path[1].x - path[0].x;
  const dy = path[1].y - path[0].y;
  const distance = Math.hypot(dx, dy);
  const perpendicularX = -dy / distance;
  const perpendicularY = dx / distance;

  const halfPathWidth = PATH_WIDTH / 2;
  const maxOffset = halfPathWidth - enemySize / 2;
  const minOffset = -maxOffset;

  const spawnOffsetMagnitude = Math.random() * (maxOffset - minOffset) + minOffset;
  const spawnOffsetDirection = spawnOffsetMagnitude >= 0 ? 1 : -1;
  const absoluteOffset = Math.abs(spawnOffsetMagnitude);

  return {
      x: absoluteOffset * perpendicularX * spawnOffsetDirection,
      y: absoluteOffset * perpendicularY * spawnOffsetDirection,
  };
}

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
* Initialize the next wave by setting up its spawn groups.
*/
function startNextWave() {
  if (currentWaveIndex >= waves.length) {
      // All waves completed
      gameWonFlag = true;
      gameOverFlag = true; // To prevent further spawning
      displayVictory();
      return;
  }

  const wave = waves[currentWaveIndex];
  console.log(`Starting Wave ${wave.number}`);

  // Initialize spawn groups with their timers
  currentWaveSpawnGroups = wave.spawnGroups.map((group) => ({
      class: group.class,
      remainingCount: group.count,
      spawnInterval: group.spawnInterval,
      spawnTimer: group.startDelay, // Initialize with startDelay
      active: false, // Indicates if the group has started spawning
  }));

  waveInProgress = true;
  // Removed wave message display
}

/**
* Update the spawning logic based on active spawn groups.
* @param {number} deltaTime - Time elapsed since last frame in ms
*/
function spawnEnemies(deltaTime) {
  if (!waveInProgress) {
      if (waveDelayTimer > 0) {
          waveDelayTimer -= deltaTime;
          if (waveDelayTimer <= 0) {
              startNextWave();
          }
      }
      return;
  }

  // Iterate over a copy of currentWaveSpawnGroups to safely modify the array during iteration
  currentWaveSpawnGroups.slice().forEach((spawnGroup, index) => {
      if (!spawnGroup.active) {
          // Countdown the startDelay
          spawnGroup.spawnTimer -= deltaTime;
          if (spawnGroup.spawnTimer <= 0) {
              spawnGroup.active = true;
              spawnGroup.spawnTimer = spawnGroup.spawnInterval; // Reset timer for spawning
              console.log(
                  `SpawnGroup started: ${spawnGroup.class.name}, Count: ${spawnGroup.remainingCount}`
              );
          }
      } else {
          // Countdown the spawnInterval
          spawnGroup.spawnTimer -= deltaTime;
          if (spawnGroup.spawnTimer <= 0 && spawnGroup.remainingCount > 0) {
              // Spawn an enemy
              let enemySize;
              if (spawnGroup.class === BasicEnemy) {
                  enemySize = 20;
              } else if (spawnGroup.class === FastEnemy) {
                  enemySize = 10;
              } else if (spawnGroup.class === TankEnemy) {
                  enemySize = 30;
              } else {
                  enemySize = 20; // Default size
              }

              const spawnOffset = generateRandomSpawnOffset(path, enemySize);
              enemies.push(new spawnGroup.class(path, spawnOffset));
              spawnGroup.remainingCount--;
              spawnGroup.spawnTimer = spawnGroup.spawnInterval; // Reset spawn timer

              console.log(
                  `Spawned ${spawnGroup.class.name}. Remaining: ${spawnGroup.remainingCount}`
              );

              // If all enemies in this group have been spawned, remove the group
              if (spawnGroup.remainingCount <= 0) {
                  currentWaveSpawnGroups.splice(index, 1);
                  console.log(`SpawnGroup completed: ${spawnGroup.class.name}`);
              }
          }
      }
  });

  // Check if all spawn groups have completed and no enemies are left
  if (currentWaveSpawnGroups.length === 0 && enemies.length === 0) {
      endCurrentWave();
  }
}

/**
* Ends the current wave and prepares for the next one.
*/
function endCurrentWave() {
  waveInProgress = false;
  waveDelayTimer = 2000; // Reset wave delay
  currentWaveIndex++;
  // Removed wave message display
  console.log(`Wave ${currentWaveIndex} completed.`);
}

/**
* Draw all paths on the canvas.
*/
function drawPaths() {
  const PATH_COLORS = ['gray', 'orange', 'purple', 'cyan'];

  context.lineWidth = PATH_WIDTH;
  context.lineCap = 'round';

  MAPS.forEach((singlePath, index) => {
      const scaledPath = scalePath(singlePath);
      context.strokeStyle = PATH_COLORS[index % PATH_COLORS.length];
      context.beginPath();
      context.moveTo(scaledPath[0].x, scaledPath[0].y);
      for (let i = 1; i < scaledPath.length; i++) {
          context.lineTo(scaledPath[i].x, scaledPath[i].y);
      }
      context.stroke();
  });
}

/**
* The main game loop.
*/
function gameLoop() {
  const currentTime = Date.now();
  const deltaTime = currentTime - lastFrameTime; // Time elapsed since last frame in ms
  lastFrameTime = currentTime;

  if (!gameOverFlag) {
      update(deltaTime);
      render();
      requestAnimationFrame(gameLoop);
  } else {
      render();
      if (gameWonFlag) {
          displayVictory();
      } else {
          displayGameOver();
      }
  }
}

/**
* Update game state based on elapsed time.
* @param {number} deltaTime - Time elapsed since last frame in ms
*/
function update(deltaTime) {
  spawnEnemies(deltaTime);

  // Update enemies and remove defeated ones
  for (let enemy of enemies) {
      enemy.update();
  }
  for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i];
      if (enemy.isDefeated) {
          if (enemy.health <= 0) {
              score += enemy.points;
              gold.value += enemy.value;
          } else {
              lives--;
              if (lives <= 0) gameOverFlag = true;
          }
          enemies.splice(i, 1);
      }
  }

  // Update towers and projectiles
  for (let tower of towers) {
      tower.update(projectiles);
  }

  for (let projectile of projectiles) {
      projectile.update();
  }
  for (let i = projectiles.length - 1; i >= 0; i--) {
      const projectile = projectiles[i];
      if (projectile.isExpired) {
          projectiles.splice(i, 1);
      }
  }
}

/**
* Render all game elements on the canvas.
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
      `Wave: ${currentWaveIndex < waves.length ? waves[currentWaveIndex].number : 'N/A'}`,
      10,
      120,
  );
  context.fillText(`Enemies Remaining: ${enemies.length}`, 10, 150);

  // Render the tower preview as a square
  const preview = getPreview();
  if (preview.visible) {
      context.fillStyle = preview.color;
      context.fillRect(
          preview.x - TOWER_SIZE / 2,
          preview.y - TOWER_SIZE / 2,
          TOWER_SIZE,
          TOWER_SIZE,
      );
  }
}

/**
* Display the Game Over screen with a restart prompt.
*/
function displayGameOver() {
  context.fillStyle = 'rgba(0, 0, 0, 0.7)';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = 'white';
  context.font = '40px Arial';
  context.textAlign = 'center';
  context.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 40);
  context.font = '20px Arial';
  context.fillText(
      `Final Score: ${score}`,
      canvas.width / 2,
      canvas.height / 2,
  );
  context.fillText(
      'Tap/Click to Restart',
      canvas.width / 2,
      canvas.height / 2 + 60,
  );

  // Add event listeners for restart
  addRestartListener();
}

/**
* Display the Victory screen with a restart prompt.
*/
function displayVictory() {
  context.fillStyle = 'rgba(0, 0, 0, 0.7)';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = 'white';
  context.font = '40px Arial';
  context.textAlign = 'center';
  context.fillText('You Win!', canvas.width / 2, canvas.height / 2 - 40);
  context.font = '20px Arial';
  context.fillText(
      `Final Score: ${score}`,
      canvas.width / 2,
      canvas.height / 2,
  );
  context.fillText(
      'Tap/Click to Restart',
      canvas.width / 2,
      canvas.height / 2 + 60,
  );

  // Add event listeners for restart
  addRestartListener();
}

/**
* Add event listeners for restarting the game.
*/
function addRestartListener() {
  // Define the handler
  const handleRestart = () => {
      // Remove this event listener after restart to prevent multiple triggers
      canvas.removeEventListener('click', handleRestart);
      canvas.removeEventListener('touchend', handleRestart);

      // Reset the game state
      resetGame();
  };

  // Add the listeners
  canvas.addEventListener('click', handleRestart);
  canvas.addEventListener('touchend', handleRestart);
}

/**
* Reset the game to its initial state and start the first wave.
*/
function resetGame() {
  // Re-initialize game variables
  initializeGame();

  // Clear arrays just in case
  enemies.length = 0;
  towers.length = 0;
  projectiles.length = 0;

  // Clear any lingering visuals
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Restart the first wave
  startNextWave();

  // Restart the game loop
  requestAnimationFrame(gameLoop);
}

/**
* Check if the game is currently active.
* @returns {boolean} - True if active, else false.
*/
function isGameActive() {
  return !gameOverFlag && !gameWonFlag;
}

// ------------------- Game State Modification Functions -------------------

/**
* Add a tower at the specified coordinates.
* @param {number} x - X-coordinate
* @param {number} y - Y-coordinate
*/
function addTower(x, y) {
  towers.push(new Tower(x, y, context, enemies));
}

/**
* Deduct gold by a specified amount.
* @param {number} amount - Amount to deduct
*/
function deductGold(amount) {
  gold.value -= amount;
}

// ------------------- Initialize Controls Module -------------------

// Removed displayNotEnoughGold and displayCannotPlaceHere from dependencies
initControls(canvas, {
  gold,
  deductGold,
  addTower,
  isOnPath,
  isOnTower,
  isGameActive, // Pass the isGameActive function
});

// ------------------- Start the Game Loop -------------------

startNextWave(); // Initialize the first wave
requestAnimationFrame(gameLoop);

// ------------------- Placement Validation Functions -------------------

/**
* Check if a position is on the path.
* @param {number} x - X-coordinate
* @param {number} y - Y-coordinate
* @returns {boolean} - True if on path, else false
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
* Check if a position overlaps with an existing tower.
* @param {number} x - X-coordinate
* @param {number} y - Y-coordinate
* @returns {boolean} - True if overlapping, else false
*/
function isOnTower(x, y) {
  for (let tower of towers) {
      const dx = x - tower.x;
      const dy = y - tower.y;
      const distance = Math.hypot(dx, dy);
      if (distance < TOWER_SIZE) {
          // Prevent overlapping by ensuring the distance between towers is at least TOWER_SIZE
          return true;
      }
  }
  return false;
}
