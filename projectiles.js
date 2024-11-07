export default class Projectile {
  constructor(x, y, target, damage, projectiles, enemies, score, gold) {
    this.x = x;
    this.y = y;
    this.target = target;
    this.damage = damage;
    this.speed = 5;
    this.radius = 3; // Size of the projectile
    this.projectiles = projectiles;
    this.enemies = enemies;
    this.score = score;
    this.gold = gold;
  }

  update() {
    const dx = this.target.position.x - this.x;
    const dy = this.target.position.y - this.y;
    const distance = Math.hypot(dx, dy);

    if (distance < this.speed) {
      // Projectile has reached the enemy
      this.target.health -= this.damage;
      this.removeProjectile(this);

      // Remove enemy if health is below zero
      if (this.target.health <= 0) {
        this.score.value += 10; // Assuming score is an object with a value field
        this.gold.value += 1; // Gain 1 gold for defeating an enemy
        this.removeEnemy(this.target);
      }
    } else {
      // Move projectile towards the enemy
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;
    }
  }

  render(context) {
    // Draw projectile as a small circle
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = "black";
    context.fill();
  }

  removeProjectile(projectile) {
    const index = this.projectiles.indexOf(projectile);
    if (index > -1) {
      this.projectiles.splice(index, 1);
    }
  }

  removeEnemy(enemy) {
    const index = this.enemies.indexOf(enemy);
    if (index > -1) {
      this.enemies.splice(index, 1);
    }
  }
}
