import MovingDirection from "./movingdirection.js";
export default class Trinny {
  constructor(x, y, tileSize, velocity, tileMap) {
    this.x = x;
    this.y = y;
    this.tileSize = tileSize;
    this.velocity = velocity;
    this.tileMap = tileMap;

    this.currentMovingDirection = null;
    this.requestedMovingDirection = null;

    this.trinnyAnimationTimerDefault = 10;
    this.trinnyAnimationTimer = null;

    this.trinnyRotation = this.Rotation.right;
    this.dogSound = new Audio("../sounds/dog_sound.wav");

    this.powerDotSound = new Audio("../sounds/power_dot.wav");
    this.powerDotActive = false;
    this.powerDotIsAboutToExpire = false;
    this.timers = [];

    this.eatGhostSound = new Audio("../sounds/eat_ghost.wav");

    this.madeFirstMove = false;

    document.addEventListener("keydown", this.#keydown);

    this.#loadTrinnyImages();
  }

  Rotation = {
    right: 0,
    down: 1,
    left: 2,
    up: 3,
  };

  draw(ctx, pause, enemies) {
    if (!pause) {
      this.#move();
      this.#animate();
    }
    this.#eatChicken();
    this.#eatPowerDot();
    this.#eatGhost(enemies);

    const size = this.tileSize / 2;

    ctx.save();
    ctx.translate(this.x + size, this.y + size);
    ctx.rotate((this.trinnyRotation * 90 * Math.PI) / 180);
    ctx.drawImage(
      this.TrinnyImages[this.TrinnyImageIndex],
      -size,
      -size,
      this.tileSize,
      this.tileSize
    );

    ctx.restore();

    // ctx.drawImage(
    //   this.TrinnyImages[this.TrinnyImageIndex],
    //   this.x,
    //   this.y,
    //   this.tileSize,
    //   this.tileSize
    // );
  }

  #loadTrinnyImages() {
    const trinnyImage1 = new Image();
    trinnyImage1.src = "../images/images/trinny0.png";

    const trinnyImage2 = new Image();
    trinnyImage2.src = "../images/images/trinny1.png";

    const trinnyImage3 = new Image();
    trinnyImage3.src = "../images/images/trinny3.png";

    const trinnyImage4 = new Image();
    trinnyImage4.src = "../images/images/trinny1.png";

    this.TrinnyImages = [
      trinnyImage1,
      trinnyImage2,
      trinnyImage3,
      trinnyImage4,
    ];

    this.TrinnyImageIndex = 0;
  }
  #keydown = (event) => {
    //up
    if (event.keyCode == 38) {
      if (this.currentMovingDirection == MovingDirection.down)
        this.currentMovingDirection = MovingDirection.up;
      this.requestedMovingDirection = MovingDirection.up;
      this.madeFirstMove = true;
    }
    //down
    if (event.keyCode == 40) {
      if (this.currentMovingDirection == MovingDirection.up)
        this.currentMovingDirection = MovingDirection.down;
      this.requestedMovingDirection = MovingDirection.down;
      this.madeFirstMove = true;
    }
    //left
    if (event.keyCode == 37) {
      if (this.currentMovingDirection == MovingDirection.right)
        this.currentMovingDirection = MovingDirection.left;
      this.requestedMovingDirection = MovingDirection.left;
      this.madeFirstMove = true;
    }
    //right
    if (event.keyCode == 39) {
      if (this.currentMovingDirection == MovingDirection.left)
        this.currentMovingDirection = MovingDirection.right;
      this.requestedMovingDirection = MovingDirection.right;
      this.madeFirstMove = true;
    }
  };
  #move() {
    if (this.currentMovingDirection !== this.requestedMovingDirection) {
      if (
        Number.isInteger(this.x / this.tileSize) &&
        Number.isInteger(this.y / this.tileSize)
      ) {
        if (
          !this.tileMap.didCollideWithEnvironment(
            this.x,
            this.y,
            this.requestedMovingDirection
          )
        )
          this.currentMovingDirection = this.requestedMovingDirection;
      }
    }
    if (
      this.tileMap.didCollideWithEnvironment(
        this.x,
        this.y,
        this.currentMovingDirection
      )
    ) {
      this.trinnyAnimationTimer = null;
      this.TrinnyImageIndex = 1;
      return;
    } else if (
      this.currentMovingDirection != null &&
      this.trinnyAnimationTimer == null
    ) {
      this.trinnyAnimationTimer = this.trinnyAnimationTimerDefault;
    }
    switch (this.currentMovingDirection) {
      case MovingDirection.up:
        this.y -= this.velocity;
        this.trinnyRotation = this.Rotation.up;
        break;
      case MovingDirection.down:
        this.y += this.velocity;
        this.trinnyRotation = this.Rotation.down;
        break;
      case MovingDirection.left:
        this.x -= this.velocity;
        this.trinnyRotation = this.Rotation.left;
        break;
      case MovingDirection.right:
        this.x += this.velocity;
        this.trinnyRotation = this.Rotation.right;
        break;
    }
  }
  #animate() {
    if (this.trinnyAnimationTimer == null) {
      return;
    }
    this.trinnyAnimationTimer--;
    if (this.trinnyAnimationTimer == 0) {
      this.trinnyAnimationTimer = this.trinnyAnimationTimerDefault;
      this.TrinnyImageIndex++;
      if (this.TrinnyImageIndex == this.TrinnyImages.length)
        this.TrinnyImageIndex = 0;
    }
  }

  #eatChicken() {
    if (this.tileMap.eatChicken(this.x, this.y)) {
      this.dogSound.play();
    }
  }

  #eatPowerDot() {
    if (this.tileMap.eatPowerDot(this.x, this.y)) {
      this.powerDotSound.play();
      this.powerDotActive = true;
      this.powerDotIsAboutToExpire = false;
      this.timers.forEach((timer) => clearTimeout(timer));
      this.timers = [];

      let powerDotTimer = setTimeout(() => {
        this.powerDotActive = false;
        this.powerDotIsAboutToExpire = false;
      }, 1000 * 6);
      this.timers.push(powerDotTimer);

      let powerDotAboutToExpireTimer = setTimeout(() => {
        this.powerDotIsAboutToExpire = true;
      }, 1000 * 3);

      this.timers.push(powerDotIsAboutToExpireTimer);
    }
  }

  #eatGhost(enemies) {
    if (this.powerDotActive) {
      const collideEnemies = enemies.filter((enemy) => enemy.collideWith(this));
      collideEnemies.forEach((enemy) => {
        enemies.splice(enemies.indexOf(enemy), 1);
        this.eatGhostSound.play();
      });
    }
  }
}
