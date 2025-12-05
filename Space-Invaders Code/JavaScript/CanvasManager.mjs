// - Canvas Manager Class -
// manages the canvas size and keeps the 16:9 aspect ratio on resize

class CanvasManager {
  constructor() {
    this.canvas = document.querySelector('canvas')
    this.context = this.canvas.getContext('2d')

    // sets fixed aspect ratio 16:9
    this.aspectRatio = 16 / 9
    this.baseWidth = 800
    this.baseHeight = this.baseWidth / this.aspectRatio

    // sets base resolution for the canvas
    this.canvas.width = this.baseWidth
    this.canvas.height = this.baseHeight

    // adds resize listener with delay to prevent constant resizing
    let resizeTimeout
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout)

      // waits 300ms after resize event ends before resizing again
      resizeTimeout = setTimeout(() => {
        // checks window height to avoid resizing when too small
        if (window.innerHeight > 400) {
          this.resizeCanvas()
        }
      }, 300)
    })

    // sets initial canvas size when the page loads
    this.resizeCanvas()
  }

  // adjusts canvas display size to fit window while keeping 16:9 ratio
  resizeCanvas() {
    // gets ratio between window width and height
    const windowRatio = window.innerWidth / window.innerHeight

    // calculates proper scale to maintain aspect ratio
    const scale = windowRatio > this.aspectRatio
      ? window.innerHeight / this.canvas.height
      : window.innerWidth / this.canvas.width

    // applies scaled size and centers canvas on screen
    this.canvas.style.width = `${this.canvas.width * scale}px`
    this.canvas.style.height = `${this.canvas.height * scale}px`
    this.canvas.style.display = 'block'
    this.canvas.style.margin = '0 auto'
  }
}

export default CanvasManager


