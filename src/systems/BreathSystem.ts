export class BreathSystem {
  public air = 3;
  public maxAir = 3;
  public active = false;
  public exhausted = false;

  constructor() {}

  public toggle(): void {
    if (this.exhausted) return;
    this.active = !this.active;
  }

  public update(delta: number): void {
    const dt = delta / 1000;

    if (this.active && !this.exhausted) {
      this.air -= dt * 0.55;

      if (this.air <= 0) {
        this.air = 0;
        this.exhausted = true;
        this.active = false;
      }
    } else {
      this.air = Math.min(this.maxAir, this.air + dt * 0.13);

      if (this.exhausted && this.air >= this.maxAir * 0.5) {
        this.exhausted = false;
      }
    }
  }

  public isStable(): boolean {
    return this.active && !this.exhausted;
  }
}
