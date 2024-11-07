// towers.js
import Projectile from "./projectiles.js";

export default class Tower {
  constructor(
    x,
    y,
    context,
    projectiles,
    enemies,
    removeProjectile,
    removeEnemy,
    increaseScore,
    increaseGold,
  ) {
    this.x = x;
    this.y = y;
    this.range = 100;
    this.fireRate = 60;
    this.fireTimer = 0;
    this.context = context;
    this.projectiles = projectiles;
    this.enemies = enemies;
    this.removeProjectile = removeProjectile;
    this.removeEnemy = removeEnemy;
    this.increaseScore = increaseScore;
    this.increaseGold = increaseGold;
  }

  update() {
    if (this.fireTimer <= 0) {
      let nearestEnemy = null;
      let nearestDistance = this.range;
      for (let enemy of this.enemies) {
        const dx = enemy.position.x - this.x;
        const dy = enemy.position.y - this.y;
        const distance = Math.hypot(dx, dy);
        if (distance < nearestDistance) {
          nearestEnemy = enemy;
          nearestDistance = distance;
        }
      }
      if (nearestEnemy) {
        this.projectiles.push(
          new Projectile(
            this.x,
            this.y,
            nearestEnemy,
            this.context,
            this.removeProjectile,
            this.removeEnemy,
            this.increaseScore,
            this.increaseGold,
          ),
        );
        this.fireTimer = this.fireRate;
      }
    } else {
      this.fireTimer--;
    }
  }

  render() {
    this.context.fillStyle = "blue";
    this.context.fillRect(this.x - 10, this.y - 10, 20, 20);
  }
}
