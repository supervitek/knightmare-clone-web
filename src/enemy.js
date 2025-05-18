const ENEMY_DATA = {
  grunt: { size: 32, color: 0xff0000, hp: 1, speed: 80 },
  zigzag: { size: 32, color: 0xff4444, hp: 1, speed: 100 },
  tank: { size: 48, color: 0xcc0000, hp: 3, speed: 60 },
};

export default class Enemy extends Phaser.Physics.Arcade.Sprite { // FINAL FIX: enemy preUpdate crash
  constructor(scene, type = 'grunt', x = 0, y = 0) {
    const data = ENEMY_DATA[type] || ENEMY_DATA.grunt;
    super(scene, x, y, 'enemy');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDisplaySize(data.size, data.size);
    this.setTint(data.color);

    this.scene = scene;
    this.type = type;
    this.hp = data.hp;
    this.speed = data.speed;
    this.body.setVelocityY(this.speed);

    this.zigDir = 1;
    this.zigTimer = 0;
    this.fireTimer = 0;
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (this.type === 'zigzag') {
      this.zigTimer += delta;
      if (this.zigTimer >= 500) {
        this.zigTimer = 0;
        this.zigDir *= -1;
        this.body.setVelocityX(this.speed * this.zigDir);
      }
    } else if (this.type === 'tank') {
      this.fireTimer += delta;
      if (this.fireTimer >= 2000) {
        this.fireTimer = 0;
        const b = this.scene.enemyBullets.create(
          this.x,
          this.y + this.height / 2,
          'bullet'
        );
        b.setVelocityY(150);
        const size = this.displayWidth * 0.3;
        b.setDisplaySize(size, size);
        b.body.setSize(size, size);
      }
    }
  }
}

export { ENEMY_DATA };
