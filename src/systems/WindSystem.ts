export class WindSystem {
  public value: number;
  private base: number;
  private t = Math.random() * 10;

  constructor(private maxWind: number) {
    const sign = Math.random() < 0.5 ? -1 : 1;
    this.base = sign * maxWind * (0.6 + Math.random() * 0.4);
    this.value = this.base;
  }

  update(dt: number): void {
    this.t += dt;
    this.value = this.base + Math.sin(this.t * 0.5) * this.maxWind * 0.25;
  }
}
