export interface Upgrades {
  power: number;
  scope: number;
  stability: number;
  lungs: number;
  bolt: number;
  wind: number;
}

export const MAX_UPGRADE = 5;
const KEY = 'hunterdr-save-v2';

export const emptyUpgrades = (): Upgrades => ({ power: 0, scope: 0, stability: 0, lungs: 0, bolt: 0, wind: 0 });

class GameState {
  level = 0;
  money = 0;
  totalScore = 0;
  best = 0;
  completed = false;
  upgrades: Upgrades = emptyUpgrades();

  constructor() {
    this.load();
  }

  get hasProgress(): boolean {
    return this.level > 0 || this.money > 0 || this.totalScore > 0;
  }

  newGame(): void {
    this.level = 0;
    this.money = 0;
    this.totalScore = 0;
    this.completed = false;
    this.upgrades = emptyUpgrades();
    this.save();
  }

  save(): void {
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify({
          level: this.level,
          money: this.money,
          totalScore: this.totalScore,
          best: this.best,
          completed: this.completed,
          upgrades: this.upgrades
        })
      );
    } catch (e) {
      // almacenamiento no disponible
    }
  }

  private load(): void {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const d = JSON.parse(raw);
      this.level = Number(d.level) || 0;
      this.money = Number(d.money) || 0;
      this.totalScore = Number(d.totalScore) || 0;
      this.best = Number(d.best) || 0;
      this.completed = !!d.completed;
      this.upgrades = { ...emptyUpgrades(), ...(d.upgrades || {}) };
    } catch (e) {
      // guardado corrupto: se ignora
    }
  }
}

export const state = new GameState();
