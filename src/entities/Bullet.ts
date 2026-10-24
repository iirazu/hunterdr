import { Upgrades } from '../state';

export class Bullet {
  constructor(
    public x: number,
    public y: number,
    public timeLeft: number
  ) {}

  update(dt: number): void {
    this.timeLeft -= dt;
  }

  get arrived(): boolean {
    return this.timeLeft <= 0;
  }
}

export function computeImpact(
  x: number,
  y: number,
  dist: number,
  wind: number,
  up: Upgrades
): { x: number; y: number; time: number } {
  const drift = wind * dist * 0.008 * (1 - 0.15 * up.wind);
  const drop = (dist * dist * 0.0002) / (1 + 0.15 * up.power);
  const time = dist / (650 + 50 * up.power);
  return { x: x + drift, y: y + drop, time };
}
