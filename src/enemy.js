export default class Enemy {
  constructor(x, y, tileSize, velocity, tileMap) {
    this.x = x;
    this.y = y;
    this.tileSize = tileSize;
    this.velocity = velocity;
    this.tileMap = tileMap;

    this.#loadImages();
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.tileSize, this.tileSize);
  }
  #loadImages() {
    this.normalBroccoli = new Image();
    this.normalBroccoli.src = "..images/images/broccoli.jpg";

    this.scaredBroccoli = new Image();
    this.scaredBroccoli.src = "..images/images/scared_broccoli.jpg";

    this.scaredBroccoli2 = new Image();
    this.scaredBroccoli2.src = "../images/images/scared_broccoli2.jpg";

    this.image = this.normalBroccoli;
  }
}
