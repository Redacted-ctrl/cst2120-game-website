// - Input Handler Class -

// creates a class that tracks key presses and releases for player movement
class InputHandler {
  constructor(keys) {
    this.keys = keys

    // listens for key presses and sets the correct flags
    window.addEventListener('keydown', ({ key }) => {
      switch (key) {
        case 'a':
          this.keys.a.pressed = true
          break
        case 'd':
          this.keys.d.pressed = true
          break
        case ' ':
          this.keys.space.pressed = true
          break
      }
    })

    // listens for key releases and resets the flags
    window.addEventListener('keyup', ({ key }) => {
      switch (key) {
        case 'a':
          this.keys.a.pressed = false
          break
        case 'd':
          this.keys.d.pressed = false
          break
        case ' ':
          this.keys.space.pressed = false
          break
      }
    })
  }
}

export default InputHandler

