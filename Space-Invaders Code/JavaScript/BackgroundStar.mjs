// - Background Star Class -
// creates and updates moving stars for the background effect

class BackgroundStar {
  constructor(canvas, context) {
    this.canvas = canvas
    this.context = context

    // gets random starting position for each star
    this.position = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height
    }

    // gets random speed for movement effect
    this.velocity = { y: Math.random() * 2 + 0.5 }

    // gets random size to make some stars appear brighter
    this.radius = Math.random() * 2
  }

  // draws small white stars
  draw() {
    this.context.beginPath()
    this.context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    this.context.fillStyle = 'white'
    this.context.fill()
  }

  // moves stars downward and loops them back to the top
  update(deltaTime) {
    this.position.y += this.velocity.y * deltaTime

    // checks if star goes past bottom and resets it to the top
    if (this.position.y > this.canvas.height) {
      this.position.y = 0
      this.position.x = Math.random() * this.canvas.width
    }

    // draws updated star position
    this.draw()
  }
}

export default BackgroundStar
