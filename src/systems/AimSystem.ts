import Phaser from 'phaser';

export class AimSystem {
  public x = 210;
  public y = 340;
  private sway = 0;
  private crosshair: Phaser.GameObjects.Arc;

  constructor(private scene: Phaser.Scene) {
    this.crosshair = scene.add.circle(this.x, this.y, 4, 0xe98455);
  }

  public updateFromPointer(pointer: Phaser.Input.Pointer): void {
    this.x = Phaser.Math.Clamp(pointer.x, 20, this.scene.scale.width - 20);
    this.y = Phaser.Math.Clamp(pointer.y - 190, 100, this.scene.scale.height - 140);
  }

  public update(delta: number, stable: boolean, windOffset: number): void {
    const dt = delta / 1000;
    this.sway += dt;

    const amplitude = stable ? 2 : 8;
    const offsetX = Math.sin(this.sway * 2) * amplitude + windOffset * 0.2;
    const offsetY = Math.cos(this.sway * 1.7) * amplitude;

    this.crosshair.setPosition(this.x + offsetX, this.y + offsetY);
  }
}
