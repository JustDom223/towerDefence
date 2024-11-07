// enemy.js

export default class Enemy {
  constructor(path) {
    this.width = 20;
    this.height = 20;
    this.health = 100;
    this.maxHealth = 100;
    this.speed = 1;
    this.position = { x: path[0].x, y: path[0].y };
    this.waypointIndex = 0;
    this.path = path;
  }

  update() {
    if (this.waypointIndex < this.path.length - 1) {
      const targetX = this.path[this.waypointIndex + 1].x;
      const targetY = this.path[this.waypointIndex + 1].y;
      const dx = targetX - this.position.x;
      const dy = targetY - this.position.y;
      const distance = Math.hypot(dx, dy);

      if (distance < this.speed) {
        this.position.x = targetX;
        this.position.y = targetY;
        this.waypointIndex++;
      } else {
        this.position.x += (dx / distance) * this.speed;
        this.position.y += (dy / distance) * this.speed;
      }
    }
  }

  isAtEnd() {
    // Returns true if the enemy has reached the last waypoint
    return this.waypointIndex >= this.path.length - 1;
  }

  render(context) {
    // Draw enemy rectangle
    context.fillStyle = "red";
    context.fillRect(
      this.position.x - this.width / 2,
      this.position.y - this.height / 2,
      this.width,
      this.height,
    );
    // Add black border around enemy
    context.strokeStyle = "black";
    context.lineWidth = 1;
    context.strokeRect(
      this.position.x - this.width / 2,
      this.position.y - this.height / 2,
      this.width,
      this.height,
    );

    // Health bar
    context.fillStyle = "black";
    context.fillRect(
      this.position.x - this.width / 2,
      this.position.y - this.height / 2 - 10,
      this.width,
      5,
    );
    context.fillStyle = "green";
    context.fillRect(
      this.position.x - this.width / 2,
      this.position.y - this.height / 2 - 10,
      this.width * (this.health / this.maxHealth),
      5,
    );
  }
}
