import Enemy from './enemy.js';

class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  preload() {
    // Placeholder assets; replace with your own
    this.load.image('player', 'assets/white.png');
    this.load.image('bullet', 'assets/white.png');
    this.load.image('enemy', 'assets/white.png');
    this.load.image('bg', 'assets/white.png');
  }

  create() {
    const { width, height } = this.scale;
    this.background = this.add
      .tileSprite(0, 0, width, height, 'bg')
      .setOrigin(0, 0)
      .setTint(0x101010);

    this.player = this.physics.add.sprite(width / 2, 560, 'player');
    this.player.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.bullets = this.physics.add.group();
    this.time.addEvent({
      delay: 1000,
      callback: () => new Enemy(this, Phaser.Math.Between(0, width), 0),
      loop: true,
    });
  }

  update() {
    this.background.tilePositionY -= 2;

    const speed = 200;
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(speed);
    } else {
      this.player.setVelocityY(0);
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
      const bullet = this.bullets.create(
        this.player.x,
        this.player.y - 20,
        'bullet'
      );
      bullet.setVelocityY(-300);

      const bWidth = this.player.displayWidth * 0.3;
      const bHeight = this.player.displayHeight * 0.3;
      bullet.setDisplaySize(bWidth, bHeight);
      bullet.body.setSize(bWidth, bHeight);
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  scene: MainScene,
};

new Phaser.Game(config);
