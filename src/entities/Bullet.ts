import Phaser from 'phaser';

export class Bullet extends Phaser.GameObjects.Arc {
  private life = 1;

  constructor(scene: Phaser.Scene, x: number, y: number, windOffset: number) {
    super(scene, x, y, 3, 16, 1, 0xfff2c4);

    scene.add.existing(this);
  }

  public update(delta: number): void {
    this.life -= delta / 1000;
  }

  public isExpired(): boolean {
    return this.life <= 0;
  }
}
