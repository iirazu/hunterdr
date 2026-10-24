export class WindSystem {
  public offset: number;

  constructor(level: number) {
    this.offset = level >= 3 ? (Math.random() * 2 - 1) * (level - 1) * 0.6 : 0;
  }
}
