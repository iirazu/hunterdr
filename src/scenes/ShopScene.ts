import Phaser from 'phaser';

export class ShopScene extends Phaser.Scene {
  constructor() {
    super('Shop');
  }

  create(): void {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height * 0.35, 'ARMERÍA', {
        fontFamily: 'monospace',
        fontSize: '34px',
        color: '#edcf90'
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height * 0.5, 'Mejoras disponibles próximamente', {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#ffffff'
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height * 0.65, 'CONTINUAR', {
        fontFamily: 'monospace',
        fontSize: '24px',
        color: '#ffffff',
        backgroundColor: '#526b3d',
        padding: { x: 22, y: 12 }
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.start('Result'));
  }
}
