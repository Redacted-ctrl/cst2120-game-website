// - Player Class -
// creates and controls the player spaceship

// creates a player object that moves, draws, and handles hits
class Player {
  constructor(canvas, context, animateCallback) {
    this.canvas = canvas
    this.context = context
    this.width = 50
    this.height = 50

    // sets starting position near the bottom center of the screen
    this.position = {
      x: canvas.width / 2 - this.width / 2,
      y: canvas.height - this.height - 30
    }

    this.velocity = { x: 0, y: 0 }

    this.lives = 3 // player starts with 3 lives
    this.exploding = false // tracks explosion state

    // loads player image
    const image = new Image()
    image.src = '../Images/playership.png'
    image.onload = () => {
      this.image = image
      this.draw()
      animateCallback() // starts the game loop once the player image loads
    }

    this.image = image

    // loads explosion image for hit animation
    this.explosionImage = new Image()
    this.explosionImage.src = '../Images/explosion.png'
  }

  // draws the player or explosion based on state
  draw() {
    if (this.exploding) {
      // draws explosion effect
      this.context.drawImage(this.explosionImage, this.position.x, this.position.y, this.width, this.height)
    } else {
      // draws the player spaceship
      this.context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
  }

  // updates player position and ensures it stays on screen
  update(deltaTime) {
    // moves player horizontally
    this.position.x += this.velocity.x * deltaTime

    // keeps player within screen boundaries
    if (this.position.x < 0) this.position.x = 0
    if (this.position.x + this.width > this.canvas.width)
      this.position.x = this.canvas.width - this.width

    this.draw()
  }

  // handles when the player gets hit
  hit(gameOverCallback) {
    // ignores hits if already exploding or dead
    if (this.exploding || this.lives <= 0) return

    this.lives--
    this.exploding = true

    // if no lives remain, plays explosion and triggers game over
    if (this.lives <= 0) {
      this.lives = 0

      // plays final explosion before ending game
      setTimeout(() => {
        this.exploding = false
        gameOverCallback() // calls game over once, guaranteed
      }, 800) // short delay to sync with explosion
    } else {
      // plays temporary explosion before recovering
      setTimeout(() => {
        this.exploding = false
      }, 800)
    }
  }
}

export default Player

