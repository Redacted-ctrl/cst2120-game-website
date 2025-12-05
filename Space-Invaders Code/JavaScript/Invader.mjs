import { InvaderProjectile } from './Projectile.mjs'

// - Invader Class -
// creates and updates a single enemy invader

class Invader {
  constructor(canvas, context) {
    this.canvas = canvas
    this.context = context
    this.width = 15
    this.height = 15

    // sets temporary starting position before grid assigns real coordinates
    this.position = {
      x: canvas.width / 2 - this.width / 2,
      y: canvas.height / 2
    }

    this.velocity = { x: 0, y: 0 }

    // loads invader image
    const image = new Image()
    image.src = '../Images/Invader.png'
    image.onload = () => {
      this.image = image
      this.loaded = true
    }

    this.image = image
    this.loaded = false
  }

  // draws the invader if the image has loaded
  draw() {
    if (!this.loaded) return
    this.context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
  }

  // updates invader position and draws it on screen
  update(velocity, deltaTime) {
    if (!this.loaded) return
    this.position.x += velocity.x * deltaTime
    this.position.y += velocity.y * deltaTime
    this.draw()
  }
}

// - Grid Class -
// manages multiple invaders as a group, controlling movement and attacks
class Grid {
  constructor(canvas, context) {
    this.canvas = canvas
    this.context = context
    this.position = { x: 0, y: 0 }
    this.velocity = { x: 1, y: 0 }
    this.invaders = []

    // creates 3 rows and 9 columns of invaders
    const rows = 3
    const cols = 9
    const spacingX = 40
    const spacingY = 40

    // populates the grid with invaders
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const invader = new Invader(canvas, context)
        invader.position.x = x * spacingX + 100
        invader.position.y = y * spacingY + 30

        // assigns invader type and point value based on row
        if (y === 2) {
          invader.type = 'A'
          invader.points = 10
        } else if (y === 1) {
          invader.type = 'B'
          invader.points = 20
        } else {
          invader.type = 'C'
          invader.points = 30
        }

        this.invaders.push(invader)
      }
    }
  }

  // updates grid movement and all invaders within it
  update(deltaTime) {
    // moves entire grid horizontally
    this.position.x += this.velocity.x * Math.min(deltaTime, 1)
    if (this.invaders.length === 0) return

    // finds the leftmost and rightmost invaders
    const leftMost = Math.min(...this.invaders.map(inv => inv.position.x))
    const rightMost = Math.max(...this.invaders.map(inv => inv.position.x + inv.width))

    // reverses direction and moves grid down if it hits screen edges
    if (rightMost >= this.canvas.width - 50 || leftMost <= 50) {
      this.velocity.x = -this.velocity.x
      this.invaders.forEach(invader => invader.position.y += 40)
    }

    // updates each invader’s position
    this.invaders.forEach(invader => invader.update(this.velocity, deltaTime))
  }

  // makes invaders shoot projectiles at the player
  shoot(invaderProjectiles, fromLeft = true) {
    if (this.invaders.length === 0) return

    // sorts invaders from left to right
    const sorted = [...this.invaders].sort((a, b) => a.position.x - b.position.x)

    // picks either the leftmost or rightmost invader to shoot
    const shooter = fromLeft ? sorted[0] : sorted[sorted.length - 1]

    // sometimes fires an extra random bullet (30% chance)
    if (Math.random() < 0.3) {
      const randomInvader = sorted[Math.floor(Math.random() * sorted.length)]
      this.spawnBullet(invaderProjectiles, randomInvader)
    }

    // fires main bullet
    this.spawnBullet(invaderProjectiles, shooter)
  }

  // creates a new bullet fired by the selected invader
  spawnBullet(invaderProjectiles, invader) {
    invaderProjectiles.push(
      new InvaderProjectile({
        position: {
          x: invader.position.x + invader.width / 2,
          y: invader.position.y + invader.height
        },
        velocity: { x: 0, y: 3 }
      }, this.context)
    )
  }
}

export { Invader, Grid }
