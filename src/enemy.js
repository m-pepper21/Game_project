import MovingDirection from "./movingdirection.js";

export default class Enemy {
  constructor(x, y, tileSize, velocity, tileMap) {
    this.x = x;
    this.y = y;
    this.tileSize = tileSize;
    this.velocity = velocity;
    this.tileMap = tileMap;

    this.#loadImages();

    this.movingDirection = Math.floor(
      Math.random() * Object.keys(MovingDirection).length
    );

    this.directionTimerDefault = this.#random(10, 50);
    this.directionTimer = this.directionTimerDefault;

    this.scaredAboutToExpireTimerDefault = 10;
    this.scaredAboutToExpireTimer = this.scaredAboutToExpireTimerDefault;
  }

  draw(ctx, pause, Trinny) {
    if (!pause) {
      this.#move();
      this.#changeDirection();
    }
    this.#setImage(ctx, Trinny);
  }

  collideWith(Trinny) {
    const size = this.tileSize / 2;
    if (
      this.x < Trinny.x + size &&
      this.x + size > Trinny.x &&
      this.y < Trinny.y + size &&
      this.y + size > Trinny.y
    ) {
      return true;
    } else {
      return false;
    }
  }

  #setImage(ctx, Trinny) {
    if (Trinny.powerDotActive) {
      this.#setImageWhenPowerDotIsActive(Trinny);
    } else {
      this.image = this.normalBroccoli;
    }
    ctx.drawImage(this.image, this.x, this.y, this.tileSize, this.tileSize);
  }

  #setImageWhenPowerDotIsActive(Trinny) {
    if (Trinny.powerDotIsAboutToExpire) {
      this.scaredAboutToExpireTimer--;
      if (this.scaredAboutToExpireTimer === 0) {
        this.scaredAboutToExpireTimer = this.scaredAboutToExpireTimerDefault;
        if (this.image === this.scaredBroccoli) {
          this.image = this.scaredBroccoli2;
        } else {
          this.image = this.scaredBroccoli;
        }
      }
    } else {
      this.image = this.scaredBroccoli;
    }
  }

  #changeDirection() {
    this.directionTimer--;
    let newMoveDirection = null;
    if (this.directionTimer == 0) {
      this.directionTimer = this.directionTimerDefault;
      newMoveDirection = Math.floor(
        Math.random() * Object.keys(MovingDirection).length
      );
    }

    if (newMoveDirection != null && this.movingDirection != newMoveDirection) {
      if (
        Number.isInteger(this.x / this.tileSize) &&
        Number.isInteger(this.y / this.tileSize)
      ) {
        if (
          !this.tileMap.didCollideWithEnvironment(
            this.x,
            this.y,
            newMoveDirection
          )
        ) {
          this.movingDirection = newMoveDirection;
        }
      }
    }
  }

  #move() {
    if (
      !this.tileMap.didCollideWithEnvironment(
        this.x,
        this.y,
        this.movingDirection
      )
    ) {
      switch (this.movingDirection) {
        case MovingDirection.up:
          this.y -= this.velocity;
          break;
        case MovingDirection.down:
          this.y += this.velocity;
          break;
        case MovingDirection.left:
          this.x -= this.velocity;
          break;
        case MovingDirection.right:
          this.x += this.velocity;
          break;
      }
    }
  }

  #random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  #loadImages() {
    this.normalBroccoli = new Image();
    this.normalBroccoli.src = "../images/images/broccoli.jpg";

    this.scaredBroccoli = new Image();
    this.scaredBroccoli.src = "../images/images/scared_broccoli.jpg";

    this.scaredBroccoli2 = new Image();
    this.scaredBroccoli2.src = "../images/images/scared_broccoli2.jpg";

    this.image = this.normalBroccoli;
  }
}
