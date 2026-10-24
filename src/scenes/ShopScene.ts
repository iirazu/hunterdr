import Phaser from 'phaser';

interface Upgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  level: number;
}

export class ShopScene extends Phaser.Scene {
  private money = 0;
  private upgrades: Upgrade[] = [
    { id: 'power', name: 'Potencia', description: '+30% daño', baseCost: 180, level: 0 },
    { id: 'scope', name: 'Mira', description: 'Más aumentos', baseCost: 130, level: 0 },
    { id: 'stab', name: 'Estabilidad', description: 'Menos oscilación', baseCost: 160, level: 0 },
    { id: 'lung', name: 'Respiración', description: 'Más aire', baseCost: 110, level: 0 },
    { id: 'bolt', name: 'Cerrojo', description: 'Recarga más rápida', baseCost: 140, level: 0 },
    { id: 'pierce', name: 'Perforante', description: 'Más daño al cuerpo', baseCost: 200, level: 0 },
    { id: 'wind', name: 'Compensación', description: 'Menos efecto del viento', baseCost: 170, level: 0 },
    { id: 'rangefinder', name: 'Telemetría', description: 'Mejor estimación de distancia', baseCost: 150, level: 0 },
    { id: 'streak', name: 'Racha', description: 'Más bonus por racha', baseCost: 190, level: 0 },
    { id: 'recovery', name: 'Recuperación', description: 'Recupera aire más rápido', baseCost: 160, level: 0 }
  ];

  constructor() {
    super('Shop');
  }

  init(data: { money?: number }): void {
    this.money = data.money ?? 0;
  }

  create(): void {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height * 0.12, 'ARMERÍA', {
        fontFamily: 'monospace',
        fontSize: '34px',
        color: '#edcf90'
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height * 0.19, `Saldo: $${this.money}`, {
        fontFamily: 'monospace',
        fontSize: '22px',
        color: '#7CFC8A'
      })
      .setOrigin(0.5);

    this.upgrades.forEach((upgrade, index) => {
      const y = height * 0.27 + index * 62;
      const cost = Math.round(upgrade.baseCost * (1 + upgrade.level * 0.8));

      this.add
        .text(width / 2, y, `${upgrade.name} · Nivel ${upgrade.level}/5\n${upgrade.description} · $${cost}`, {
          fontFamily: 'monospace',
          fontSize: '14px',
          color: '#ffffff',
          align: 'center',
          backgroundColor: '#22352b',
          padding: { x: 12, y: 8 }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.buy(upgrade));
    });

    this.add
      .text(width / 2, height * 0.92, 'CONTINUAR', {
        fontFamily: 'monospace',
        fontSize: '24px',
        color: '#ffffff',
        backgroundColor: '#526b3d',
        padding: { x: 22, y: 12 }
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.start('Hunt'));
  }

  private buy(upgrade: Upgrade): void {
    const cost = Math.round(upgrade.baseCost * (1 + upgrade.level * 0.8));

    if (upgrade.level >= 5 || this.money < cost) {
      return;
    }

    this.money -= cost;
    upgrade.level++;
    this.scene.restart({ money: this.money });
  }
}
