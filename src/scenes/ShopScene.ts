import Phaser from 'phaser';

export class ShopScene extends Phaser.Scene {
  constructor() {
    super('Shop');
  }

  create(): void {
    this.add.text(210, 300, 'ARMERÍA', {
      fontFamily: 'system-ui',
      fontSize: '36px',
      color: '#edcf90'
    }).setOrigin(0.5);

    this.add.text(210, 400, 'Mejoras entre niveles', {
      fontFamily: 'system-ui',
      fontSize: '20px',
      color: '#ffffff'
    }).setOrigin(0.5);
  }
}
