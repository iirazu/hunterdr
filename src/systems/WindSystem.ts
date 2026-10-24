export class WindSystem {
  public value: number;

  constructor(level: { index: number }) {
    this.value = level.index >= 3 ? (Math.random() * 2 - 1) * (level.index - 1) * 0.6 : 0;
  }

  public update(_delta: number): void {
    // La intensidad podrá cambiar dinámicamente en niveles futuros.
  }
}
