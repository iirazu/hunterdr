export interface UpgradeState {
  lungs: number;
}

export class BreathSystem {
  public holding = false;
  public exhausted = false;
  public air: number;

  constructor(
    private scene: Phaser.Scene,
    private getUpgrades: () => UpgradeState
  ) {
    this.air = 3 + this.getUpgrades().lungs;

    scene.input.on('pointerdown', () => {
      if (!this.exhausted) {
        this.holding = !this.holding;
      }
    });
  }

  public get maximum(): number {
    return 3 + this.getUpgrades().lungs;
  }

  public update(delta: number): void {
    if (this.holding && !this.exhausted) {
      this.air = Math.max(0, this.air - delta * 0.55);

      if (this.air === 0) {
        this.exhausted = true;
        this.holding = false;
      }
    } else {
      this.air = Math.min(this.maximum, this.air + delta * 0.13);

      if (this.exhausted && this.air >= this.maximum * 0.5) {
        this.exhausted = false;
      }
    }
  }
}
