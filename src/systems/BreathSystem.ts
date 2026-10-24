import { Upgrades } from '../state';
import { airTime } from '../data/upgrades';

export class BreathSystem {
  public air: number;
  public holding = false;
  public exhausted = false;

  constructor(private getUp: () => Upgrades) {
    this.air = airTime(getUp().lungs);
  }

  get maximum(): number {
    return airTime(this.getUp().lungs);
  }

  get active(): boolean {
    return this.holding && !this.exhausted;
  }

  update(dt: number): void {
    if (this.active) {
      this.air -= dt;
      if (this.air <= 0) {
        this.air = 0;
        this.exhausted = true;
      }
    } else {
      this.air = Math.min(this.maximum, this.air + dt * 0.8);
      if (this.exhausted && this.air >= this.maximum * 0.35) this.exhausted = false;
    }
  }
}
