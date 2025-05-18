export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture = 'enemy') {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setTint(0x800020);
    this.setVelocityY(100);
  }
}
