// - Projectile Classes -
// creates player and enemy bullet objects used in the game

// creates a small red bullet fired by the player
class Projectile {
  constructor({ position, velocity }, context) {
    this.position = position
    this.velocity = velocity
    this.radius = 3
    this.context = context
  }

  // draws a small red circle representing the bullet
  draw() {
    this.context.beginPath() // starts a new path for each projectile
    this.context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    this.context.fillStyle = 'red'
    this.context.fill()
  }

  // moves the bullet upwards
  update(deltaTime) {
    this.draw()
    this.position.x += this.velocity.x * deltaTime
    this.position.y += this.velocity.y * deltaTime
  }
}

// creates a green bullet fired by enemy invaders
class InvaderProjectile {
  constructor({ position, velocity }, context) {
    this.position = position
    this.velocity = velocity
    this.width = 4
    this.height = 10
    this.context = context
  }

  // draws small green bullets for invaders
  draw() {
    this.context.fillStyle = 'lime'
    this.context.fillRect(this.position.x, this.position.y, this.width, this.height)
  }

  // moves the bullets downwards
  update(deltaTime) {
    this.draw()
    this.position.x += this.velocity.x * deltaTime
    this.position.y += this.velocity.y * deltaTime
  }
}

export { Projectile, InvaderProjectile }

