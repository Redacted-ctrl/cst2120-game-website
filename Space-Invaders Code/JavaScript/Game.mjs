// - Game Class -
// controls the main game loop, entities, and gameplay logic

// - Imports -
import { saveScoreToUser } from './gameUser.mjs';
import CanvasManager from './CanvasManager.mjs';
import Player from './Player.mjs';
import { Projectile, InvaderProjectile } from './Projectile.mjs';
import { Invader, Grid } from './Invader.mjs';
import BackgroundStar from './BackgroundStar.mjs';
import InputHandler from './InputHandler.mjs';

// - Game class -
class Game {
  constructor() {
    this.lastTime = performance.now();
    this.canvasManager = new CanvasManager();
    this.canvas = this.canvasManager.canvas;
    this.context = this.canvasManager.context;

    // binds ensures “this” works correctly when passed as a callback
    this.endGame = this.endGame.bind(this);

    // creates the player, projectile arrays, and first grid of enemies
    this.projectiles = [];
    this.invaderProjectiles = []; // stores enemy bullets
    this.grids = [];
    this.stars = []; // stores all background stars

    // tracks keys pressed
    this.keys = {
      a: { pressed: false },
      d: { pressed: false },
      space: { pressed: false }
    };

    new InputHandler(this.keys);

    // used to control enemy spawning
    this.frame = 0;
    this.gameOver = false;
    this.score = 0; // tracks the player's score
    this.lastSpawnTime = performance.now();
    this.lastShotTime = performance.now(); // invaders shooting timing
    this.shootFromLeft = true;

    // generates 100 stars for background
    for (let i = 0; i < 100; i++) {
      this.stars.push(new BackgroundStar(this.canvas, this.context));
    }

    // creates first grid
    this.grids.push(new Grid(this.canvas, this.context));

    // creates player
    this.player = new Player(this.canvas, this.context, () => this.animate(0));
  }

  // runs the animation loop
  animate(timestamp) {
    if (timestamp === undefined) timestamp = 0;

    // calculates time difference between frames
    let deltaTime = (timestamp - (this.lastTime ?? timestamp)) / 16.67;

    // checks and limits delta spikes to keep movement stable
    if (isNaN(deltaTime) || deltaTime <= 0) {
      deltaTime = 1;
    } else {
      deltaTime = Math.min(deltaTime, 1.5);
    }

    // updates timing trackers
    this.lastTime = timestamp;
    const currentTime = performance.now();

    // handles game over screen
    if (this.gameOver) {
      this.context.fillStyle = 'black';
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.context.fillStyle = '#ffffff';
      this.context.textAlign = 'center';

      this.context.font = '36px Arial';
      this.context.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 50);

      this.context.font = '18px Arial';
      this.context.fillText('Press R or Click to Restart', this.canvas.width / 2, this.canvas.height / 2 - 25);

      return;
    }

    // requests next animation frame
    this.animationFrameId = requestAnimationFrame((time) => this.animate(time));

    // clears the canvas
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // draws and updates background stars
    this.stars.forEach(star => star.update(deltaTime));

    // - HUD for Score & Lives -
    this.context.save(); // saves canvas state

    // resets any scaling transformations to keep text position stable
    if (this.context.resetTransform) {
      this.context.resetTransform();
    } else {
      this.context.setTransform(1, 0, 0, 1, 0, 0);
    }

    // draws player stats text on top-left corner
    this.context.translate(0, 0);
    this.context.fillStyle = 'white';
    this.context.font = '18px Arial';
    this.context.textAlign = 'left';
    this.context.fillText(`Score: ${this.score}`, 15, 80);
    this.context.font = '14px Arial';
    this.context.fillText(`Lives: ${this.player.lives}`, 15, 105);

    this.context.restore(); // restores canvas state

    // updates player
    this.player.update(deltaTime);

    // updates and removes player projectiles that leave the screen
    this.projectiles.forEach((projectile, index) => {
      if (projectile.position.y + projectile.radius <= 0) {
        setTimeout(() => this.projectiles.splice(index, 1), 0);
      } else {
        projectile.update(deltaTime);
      }
    });

    // updates enemy projectiles
    this.invaderProjectiles.forEach((projectile, index) => {
      if (projectile.position.y + projectile.height >= this.canvas.height) {
        setTimeout(() => {
          this.invaderProjectiles.splice(index, 1);
        }, 0);
      } else {
        projectile.update(deltaTime);
      }

      // detects collision between projectile and player
      if (
        projectile.position.y + projectile.height >= this.player.position.y &&
        projectile.position.x + projectile.width >= this.player.position.x &&
        projectile.position.x <= this.player.position.x + this.player.width &&
        !this.player.exploding
      ) {
        this.player.hit(() => this.endGame());
        setTimeout(() => {
          this.invaderProjectiles.splice(index, 1);
        }, 0);
      }
    });

    // updates grids and checks collisions between player bullets and invaders
    this.grids.forEach((grid, gridIndex) => {
      grid.update(deltaTime);

      grid.invaders.forEach((invader, invaderIndex) => {
        this.projectiles.forEach((projectile, projectileIndex) => {
          // checks for collision detection between projectile and invader
          const hit =
            projectile.position.y - projectile.radius <= invader.position.y + invader.height &&
            projectile.position.y + projectile.radius >= invader.position.y &&
            projectile.position.x + projectile.radius >= invader.position.x &&
            projectile.position.x - projectile.radius <= invader.position.x + invader.width;

          // handles collision event (removes invader and projectile)
          if (hit) {
            setTimeout(() => {
              // adds score based on invader points
              this.score += invader.points;

              grid.invaders.splice(invaderIndex, 1);
              this.projectiles.splice(projectileIndex, 1);

              // removes the grid if it becomes empty
              if (grid.invaders.length === 0) this.grids.splice(gridIndex, 1);
            }, 0);
          }
        });
      });
    });

    // spawns a new grid every 20 seconds
    if (currentTime - this.lastSpawnTime > 20000) {
      this.grids.push(new Grid(this.canvas, this.context));
      this.lastSpawnTime = currentTime;
    }

    // makes invaders shoot every second, alternating sides
    if (currentTime - this.lastShotTime > 1000) {
      this.grids.forEach(grid => {
        grid.shoot(this.invaderProjectiles, this.shootFromLeft);
      });
      this.lastShotTime = currentTime;
      this.shootFromLeft = !this.shootFromLeft;
    }

    // handles player movement based on keys pressed
    if (this.keys.a.pressed) {
      this.player.velocity.x = -6;
    } else if (this.keys.d.pressed) {
      this.player.velocity.x = 6;
    } else {
      this.player.velocity.x = 0;
    }

    // handles shooting with cooldown
    if (this.keys.space.pressed) {
      const now = performance.now();
      const fireRate = 300; // 300ms between shots

      if (!this.lastPlayerShotTime || now - this.lastPlayerShotTime >= fireRate) {
        this.lastPlayerShotTime = now;

        // creates and pushes a new projectile
        this.projectiles.push(
          new Projectile({
            position: {
              x: this.player.position.x + this.player.width / 2,
              y: this.player.position.y
            },
            velocity: { x: 0, y: -5 }
          }, this.context)
        );
      }
    }
  }

  // handles game over sequence
  endGame() {
    this.gameOver = true;

    // stops the animation loop completely
    cancelAnimationFrame(this.animationFrameId);

    // saves the player's score to their account
    saveScoreToUser(this.score);

    console.log('💀 GAME OVER triggered');

    // --- draws Game Over Screen ---
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.context.fillStyle = 'white';
    this.context.textAlign = 'center';

    // title
    this.context.font = '42px Arial';
    this.context.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 60);

    // shows current score
    this.context.font = '22px Arial';
    this.context.fillText(`Your Score: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 - 20);

    // restart message
    this.context.font = '18px Arial';
    this.context.fillText('Press R or Click to Restart', this.canvas.width / 2, this.canvas.height / 2 + 30);

    // creates restart handler
    const restartHandler = (event) => {
      const key = event.key ? event.key.toLowerCase() : null;

      if (key === 'r' || event.type === 'click') {
        window.removeEventListener('keydown', restartHandler);
        window.removeEventListener('click', restartHandler);

        setTimeout(() => this.restart(), 200);
      }
    };

    // attaches restart handlers
    window.addEventListener('keydown', restartHandler);
    window.addEventListener('click', restartHandler);
  }

  // restarts game and resets state
  restart() {
    // resets main game values
    this.projectiles = [];
    this.invaderProjectiles = [];
    this.grids = [];
    this.stars = [];
    this.score = 0;
    this.gameOver = false;
    this.frame = 0;
    this.shootFromLeft = true;

    // resets all timers
    this.lastTime = performance.now();
    this.lastSpawnTime = performance.now();
    this.lastShotTime = performance.now();

    // recreates 100 new background stars
    for (let i = 0; i < 100; i++) {
      this.stars.push(new BackgroundStar(this.canvas, this.context));
    }

    // cancels any leftover animation frame just in case
    cancelAnimationFrame(this.animationFrameId);

    // creates player and restarts animation after setup
    this.player = new Player(this.canvas, this.context, () => {
      this.grids.push(new Grid(this.canvas, this.context));

      // starts fresh animation loop
      this.animationFrameId = requestAnimationFrame((time) => this.animate(time));
    });
  }
}

export default Game;

