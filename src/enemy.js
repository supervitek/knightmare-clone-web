export default class Enemy extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, size = 32, color = 0xff0000) {
    super(scene, x, y, size, size, color);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setVelocityY(100);
  }
}
