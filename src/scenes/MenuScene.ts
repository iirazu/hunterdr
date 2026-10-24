import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create(): void {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height * 0.32, 'WILDLANDS', {
        fontFamily: 'monospace',
        fontSize: '42px',
        color: '#edcf90'
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height * 0.43, 'Caza móvil vertical', {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#d9e6d4'
      })
      .setOrigin(0.5);

    const start = this.add
      .text(width / 2, height * 0.58, 'COMENZAR', {
        fontFamily: 'monospace',
        fontSize: '26px',
        color: '#ffffff',
        backgroundColor: '#526b3d',
        padding: { x: 24, y: 14 }
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    start.on('pointerdown', () => this.scene.start('Hunt'));
  }
}
