import Phaser from 'phaser';

interface Upgrade {
  id: keyof Upgrades;
  name: string;
  description: string;
  baseCost: number;
}

interface Upgrades {
  power: number;
  scope: number;
  stability: number;
  lungs: number;
  bolt: number;
  pierce: number;
}

export class ShopScene extends Phaser.Scene {
  private money = 0;
  private upgrades: Upgrades = { power: 0, scope: 0, stability: 0, lungs: 0, bolt: 0, pierce: 0 };

  constructor() {
    super('Shop');
  }

  init(data: { money?: number; upgrades?: Upgrades }): void {
    this.money = data.money ?? 0;
    this.upgrades = data.upgrades ?? { power: 0, scope: 0, stability: 0, lungs: 0, bolt: 0, pierce: 0 };
  }

  create(): void {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height * 0.15, 'ARMERÍA', {
        fontFamily: 'monospace',
        fontSize: '34px',
        color: '#edcf90'
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height * 0.2, `Saldo: $${this.money}`, {
        fontFamily: 'monospace',
        fontSize: '22px',
        color: '#7CFC8A'
      })
      .setOrigin(0.5);

    const catalog: Upgrade[] = [
      { id: 'power', name: 'Potencia', description: '+30% daño', baseCost: 180 },
      { id: 'scope', name: 'Mira', description: 'Más aumentos', baseCost: 130 },
      { id: 'stability', name: 'Estabilidad', description: 'Menos oscilación', baseCost: 160 },
      { id: 'lungs', name: 'Respiración', description: 'Más aire', baseCost: 110 },
      { id: 'bolt', name: 'Cerrojo', description: 'Recarga más rápida', baseCost: 140 },
      { id: 'pierce', name: 'Perforante', description: 'Más daño al cuerpo', baseCost: 200 }
    ];

    catalog.forEach((item, index) => {
      const level = this.upgrades[item.id];
      const cost = Math.round(item.baseCost * (1 + level * 0.8));
      const y = height * 0.3 + index * 80;

      this.add
        .text(width / 2, y, `${item.name} · Nivel ${level}/5\n${item.description} · $${cost}`, {
          fontFamily: 'monospace',
          fontSize: '16px',
          color: '#ffffff',
          align: 'center',
          backgroundColor: '#22352b',
          padding: { x: 14, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.buy(item.id, item.baseCost));
    });

    this.add
      .text(width / 2, height * 0.9, 'CONTINUAR', {
        fontFamily: 'monospace',
        fontSize: '24px',
        color: '#ffffff',
        backgroundColor: '#526b3d',
        padding: { x: 22, y: 12 }
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.start('Hunt', { upgrades: this.upgrades }));
  }

  private buy(id: keyof Upgrades, baseCost: number): void {
    const level = this.upgrades[id];
    const cost = Math.round(baseCost * (1 + level * 0.8));

    if (level >= 5 || this.money < cost) {
      return;
    }

    this.money -= cost;
    this.upgrades[id]++;
    this.scene.restart({ money: this.money, upgrades: this.upgrades });
  }
}
