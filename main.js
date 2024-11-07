import Tower from "./towers.js";
import {
  PATH_WIDTH,
  TOWER_SIZE,
  INITIAL_GOLD,
  INITIAL_LIVES,
  INITIAL_SCORE,
} from "./gameConfig.js";
import { waves } from "./waves.js";

// Get the canvas and context
const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

// Set canvas dimensions to match the viewport
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Handle window resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Game variables
const path = [
  { x: canvas.width * 0.2, y: 0 },
  { x: canvas.width * 0.2, y: canvas.height * 0.6 },
  { x: canvas.width * 0.8, y: canvas.height * 0.6 },
  { x: canvas.width * 0.8, y: canvas.height },
];

const enemies = [];
const towers = [];
const projectiles = [];
let lives = INITIAL_LIVES;
let score = INITIAL_SCORE;
let gold = INITIAL_GOLD;
let gameOverFlag = false;

let currentWaveIndex = 0;
let enemiesSpawnedInWave = 0;
let waveSpawnTimer = 0;
let waveInProgress = false;
let waveDelayTimer = 200; // Frames to wait before starting the next wave

function spawnEnemies() {
  if (!waveInProgress && waveDelayTimer <= 0) {
    startNextWave();
  }

  if (waveInProgress) {
    const currentWave = waves[currentWaveIndex];
    const totalEnemiesInWave = currentWave.enemies.reduce(
      (sum, group) => sum + group.count,
      0
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

      // Instantiate and spawn the enemy
      enemies.push(new enemyClass(path));
      enemiesSpawnedInWave++;
      waveSpawnTimer = currentWave.spawnInterval;
    } else {
      waveSpawnTimer--;
    }

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

function endCurrentWave() {
  waveInProgress = false;
  waveDelayTimer = 200; // Adjust as needed
  currentWaveIndex++;
  displayWaveEnd();
}

function drawPath() {
  context.strokeStyle = "gray";
  context.lineWidth = PATH_WIDTH;
  context.lineCap = "round";
  context.beginPath();
  context.moveTo(path[0].x, path[0].y);
  for (let i = 1; i < path.length; i++) {
    context.lineTo(path[i].x, path[i].y);
  }
  context.stroke();
}

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
        gold += enemy.value; // Adjust gold gain if desired
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

function render() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawPath();

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
  context.fillStyle = "black";
  context.font = "20px Arial";
  context.textAlign = "left";
  context.fillText(`Lives: ${lives}`, 10, 30);
  context.fillText(`Score: ${score}`, 10, 60);
  context.fillText(`Gold: ${gold}`, 10, 90);
  context.fillText(
    `Wave: ${waves[currentWaveIndex]?.number || waves.length}`,
    10,
    120
  );
  context.fillText(`Enemies Remaining: ${enemies.length}`, 10, 150);
}

function displayGameOver() {
  context.fillStyle = "rgba(0, 0, 0, 0.7)";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "white";
  context.font = "40px Arial";
  context.textAlign = "center";
  context.fillText("Game Over", canvas.width / 2, canvas.height / 2);
  context.font = "20px Arial";
  context.fillText(
    `Final Score: ${score}`,
    canvas.width / 2,
    canvas.height / 2 + 40
  );
}

function displayVictory() {
  context.fillStyle = "rgba(0, 0, 0, 0.7)";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "white";
  context.font = "40px Arial";
  context.textAlign = "center";
  context.fillText("You Win!", canvas.width / 2, canvas.height / 2);
  context.font = "20px Arial";
  context.fillText(
    `Final Score: ${score}`,
    canvas.width / 2,
    canvas.height / 2 + 40
  );
}

function displayWaveStart() {
  context.fillStyle = "black";
  context.font = "30px Arial";
  context.textAlign = "center";
  context.fillText(
    `Wave ${waves[currentWaveIndex].number} Start!`,
    canvas.width / 2,
    canvas.height / 2 - 40
  );
}

function displayWaveEnd() {
  context.fillStyle = "black";
  context.font = "30px Arial";
  context.textAlign = "center";
  context.fillText(
    `Wave ${waves[currentWaveIndex].number} Complete!`,
    canvas.width / 2,
    canvas.height / 2 - 40
  );
}

function displayNotEnoughGold() {
  context.fillStyle = "red";
  context.font = "30px Arial";
  context.textAlign = "center";
  context.fillText(
    "Not enough gold!",
    canvas.width / 2,
    canvas.height / 2 + 80
  );
  setTimeout(render, 1000);
}

function displayCannotPlaceHere() {
  context.fillStyle = "red";
  context.font = "30px Arial";
  context.textAlign = "center";
  context.fillText(
    "Cannot place tower here!",
    canvas.width / 2,
    canvas.height / 2 + 80
  );
  setTimeout(render, 1000);
}

// Handle tower placement
canvas.addEventListener("click", function (event) {
  const rect = canvas.getBoundingClientRect();
  const x = (event.clientX - rect.left) * (canvas.width / rect.width);
  const y = (event.clientY - rect.top) * (canvas.height / rect.height);

  if (!isOnPath(x, y) && !isOnTower(x, y)) {
    if (gold >= 10) {
      towers.push(new Tower(x, y, context, enemies));
      gold -= 10;
    } else {
      displayNotEnoughGold();
    }
  } else {
    displayCannotPlaceHere();
  }
});

function isOnPath(x, y) {
  const halfPathWidth = PATH_WIDTH / 2;
  for (let i = 0; i < path.length - 1; i++) {
    const x1 = path[i].x;
    const y1 = path[i].y;
    const x2 = path[i + 1].x;
    const y2 = path[i + 1].y;
    const distance = pointToSegmentDistance(x, y, x1, y1, x2, y2);
    if (distance < halfPathWidth) {
      return true;
    }
  }
  return false;
}

function isOnTower(x, y) {
  for (let tower of towers) {
    const dx = x - tower.x;
    const dy = y - tower.y;
    const distance = Math.hypot(dx, dy);
    if (distance < TOWER_SIZE) {
      return true;
    }
  }
  return false;
}

function pointToSegmentDistance(px, py, x1, y1, x2, y2) {
  const lineLengthSquared = (x2 - x1) ** 2 + (y2 - y1) ** 2;
  if (lineLengthSquared === 0) return Math.hypot(px - x1, py - y1);

  let t =
    ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / lineLengthSquared;
  t = Math.max(0, Math.min(1, t));
  const projectionX = x1 + t * (x2 - x1);
  const projectionY = y1 + t * (y2 - y1);
  return Math.hypot(px - projectionX, py - projectionY);
}

// Start the game loop
requestAnimationFrame(gameLoop);
