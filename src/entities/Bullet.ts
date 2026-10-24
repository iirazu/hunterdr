import Phaser from 'phaser';

export class Bullet extends Phaser.GameObjects.Ellipse {
  private travelTime: number;
  private elapsed = 0;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    distance: number,
    wind: number
  ) {
    super(scene, x + wind * distance * 0.03, y, 4, 4, 0xfff2c2);

    this.travelTime = distance / 650;
    scene.add.existing(this);
  }

  public update(delta: number): void {
    this.elapsed += delta / 1000;
  }

  public hasArrived(): boolean {
    return this.elapsed >= this.travelTime;
  }
}
