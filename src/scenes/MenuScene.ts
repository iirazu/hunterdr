import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create(): void {
    this.add.text(210, 300, 'WILDLANDS', {
      fontFamily: 'system-ui',
      fontSize: '42px',
      color: '#edcf90'
    }).setOrigin(0.5);

    this.add.text(210, 370, 'Caza en 10 niveles', {
      fontFamily: 'system-ui',
      fontSize: '20px',
      color: '#ffffff'
    }).setOrigin(0.5);

    const button = this.add.text(210, 480, 'COMENZAR', {
      fontFamily: 'system-ui',
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#526b3d',
      padding: { x: 28, y: 14 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    button.on('pointerdown', () => this.scene.start('Hunt'));
  }
}
