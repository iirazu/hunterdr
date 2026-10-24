import Phaser from 'phaser';
import { BreathSystem } from './BreathSystem';
import { WindSystem } from './WindSystem';

export interface UpgradeState {
  stability: number;
  lungs: number;
}

export class AimSystem {
  public aimX: number;
  public aimY: number;
  public crosshairX: number;
  public crosshairY: number;
  public distance = 120;

  private time = 0;

  constructor(
    private scene: Phaser.Scene,
    private wind: WindSystem,
    private getUpgrades: () => UpgradeState
  ) {
    this.aimX = scene.scale.width / 2;
    this.aimY = scene.scale.height * 0.4;
    this.crosshairX = this.aimX;
    this.crosshairY = this.aimY;

    scene.input.on('pointermove', pointer => this.updateFromPointer(pointer));
    scene.input.on('pointerdown', pointer => this.updateFromPointer(pointer));
  }

  public updateFromPointer(pointer: Phaser.Input.Pointer): void {
    this.aimX = Phaser.Math.Clamp(pointer.x, 15, this.scene.scale.width - 15);
    this.aimY = Phaser.Math.Clamp(pointer.y - 190, 100, this.scene.scale.height - 140);
  }

  public update(delta: number, breath: BreathSystem): void {
    this.time += delta;

    const upgrades = this.getUpgrades();
    const baseAmplitude = 2 + this.distance / 42;
    const stabilityFactor = 1 - upgrades.stability * 0.13;

    let amplitude = baseAmplitude * stabilityFactor;

    if (breath.holding && !breath.exhausted) {
      amplitude *= 0.18;
    } else if (breath.exhausted) {
      amplitude *= 2.6;
    }

    this.crosshairX =
      this.aimX +
      (Math.sin(this.time * 1.6) + 0.35 * Math.sin(this.time * 3.1)) * amplitude;

    this.crosshairY =
      this.aimY +
      (Math.cos(this.time * 1.3) + 0.3 * Math.sin(this.time * 3.2)) * amplitude;
  }
}
