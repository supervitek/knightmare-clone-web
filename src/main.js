import Enemy from './enemy.js';

const WEAPONS = ['Arrow', 'Double', 'Boomerang'];

class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  preload() {
    // Generate 1x1 textures directly in code to avoid missing files
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xffffff);
    g.fillRect(0, 0, 1, 1);
    g.generateTexture('player', 1, 1);
    g.generateTexture('bullet', 1, 1);
    g.generateTexture('enemy', 1, 1);
    g.generateTexture('power', 1, 1);
    g.destroy();
  }

  create() {
    const { width, height } = this.scale;
    // Plain background color instead of tinted tile sprite
    this.cameras.main.setBackgroundColor(0x004400);

    this.grid = this.add
      .tileSprite(0, 0, width, height, '__BLANK')
      .setOrigin(0);

    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.lineStyle(1, 0x007733, 0.4);
    for (let i = 0; i < width; i += 32) {
      g.lineBetween(i, 0, i, height);
      g.lineBetween(0, i, width, i);
    }
    g.generateTexture('__BLANK', width, height);
    g.destroy();

    this.player = this.physics.add.sprite(width / 2, 560, 'player');
    this.player.setDisplaySize(32, 32);
    this.player.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.bullets = this.physics.add.group();
    this.enemies = this.physics.add.group();
    this.enemyBullets = this.physics.add.group();
    this.powerups = this.physics.add.group();

    this.score = 0;
    this.lives = 3;
    this.weaponIndex = 0;
    this.lastFired = 0;

    const textStyle = { font: '16px monospace', fill: '#ffffff' };
    this.scoreText = this.add.text(10, 10, 'Score: 000000', textStyle).setOrigin(0);
    this.livesText = this.add.text(10, 30, 'Lives: 3', textStyle).setOrigin(0);
    this.weaponText = this.add.text(10, 50, 'Weapon: Arrow', textStyle).setOrigin(0);

    this.time.addEvent({ delay: 1000, callback: this.spawnEnemy, callbackScope: this, loop: true });
    this.time.addEvent({ delay: 10000, callback: this.spawnPowerup, callbackScope: this, loop: true });

    this.physics.add.overlap(this.player, this.enemies, this.onPlayerHit, undefined, this);
    this.physics.add.overlap(this.player, this.enemyBullets, this.onPlayerHit, undefined, this);
    this.physics.add.overlap(this.bullets, this.enemies, this.onBulletHit, undefined, this);
    this.physics.add.overlap(this.player, this.powerups, this.onPowerup, undefined, this);
  }

  update(time) {

    if (this.gameOver) {
      if (this.input.keyboard.checkDown(this.cursors.restart, 0)) {
        this.scene.restart();
      }
      return;
    }

    this.grid.tilePositionY -= 1;
    this.grid.alpha = 0.4;

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
      if (time - this.lastFired > 300) {
        this.lastFired = time;
        this.fireWeapon();
      }
    }
  }

  spawnEnemy() {
    const { width } = this.scale;
    if (this.enemies.getLength() >= 12) return;

    const r = Math.random();
    let type = 'grunt';
    if (r < 0.1) type = 'tank';
    else if (r < 0.4) type = 'zigzag';

    const x = Phaser.Math.Between(32, width - 32);
    const enemy = new Enemy(this, type, x, 0);
    this.enemies.add(enemy);
  }

  spawnPowerup() {
    const { width } = this.scale;
    const x = Phaser.Math.Between(32, width - 32);
    const p = this.physics.add.sprite(x, 0, 'power');
    p.setTint(0xffff00);
    p.setDisplaySize(16, 16);
    p.body.setVelocityY(80);
    this.powerups.add(p);
  }

  onPlayerHit(player, obj) {
    obj.destroy();
    this.lives -= 1;
    this.livesText.setText(`Lives: ${this.lives}`);
    if (this.lives <= 0) {
      this.gameOver = true;
      this.add
        .text(400, 300, 'Game Over', { font: '32px monospace', fill: '#ffffff' })
        .setOrigin(0.5);
      this.cursors.restart = this.input.keyboard.addKey('R');
    }
  }

  onBulletHit(bullet, enemy) {
    bullet.destroy();
    enemy.hp -= 1;
    if (enemy.hp <= 0) {
      enemy.destroy();
      this.score += 10;
      this.scoreText.setText(`Score: ${this.score.toString().padStart(6, '0')}`);
    }
  }

  onPowerup(player, power) {
    power.destroy();
    this.weaponIndex = (this.weaponIndex + 1) % WEAPONS.length;
    this.weaponText.setText(`Weapon: ${WEAPONS[this.weaponIndex]}`);
  }

  fireWeapon() {
    const baseX = this.player.x;
    const baseY = this.player.y - 20;
    const size = this.player.displayWidth * 0.3;

    const createBullet = (angle) => {
      const bullet = this.bullets.create(baseX, baseY, 'bullet');
      bullet.setDisplaySize(size, size);
      bullet.body.setSize(size, size);
      this.physics.velocityFromAngle(angle, 300, bullet.body.velocity);
    };

    if (this.weaponIndex === 0) {
      createBullet(-90);
    } else if (this.weaponIndex === 1) {
      createBullet(-95);
      createBullet(-85);
    } else if (this.weaponIndex === 2) {
      // TODO: implement boomerang behavior
      createBullet(-90);
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
