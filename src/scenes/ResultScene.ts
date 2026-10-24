import Phaser from 'phaser';

interface ResultData {
  kills: number;
  score: number;
  ammo: number;
  level: number;
}

export class ResultScene extends Phaser.Scene {
  constructor() {
    super('Result');
  }

  create(data: ResultData): void {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height * 0.35, 'RESULTADO', {
        fontFamily: 'monospace',
        fontSize: '34px',
        color: '#edcf90'
      })
      .setOrigin(0.5);

    this.add
      .text(
        width / 2,
        height * 0.5,
        `Abatidos: ${data.kills}\nPuntos: ${data.score}\nMunición restante: ${data.ammo}`,
        {
          fontFamily: 'monospace',
          fontSize: '20px',
          color: '#ffffff',
          align: 'center'
        }
      )
      .setOrigin(0.5);

    this.add
      .text(width / 2, height * 0.68, 'VOLVER AL MENÚ', {
        fontFamily: 'monospace',
        fontSize: '22px',
        color: '#ffffff',
        backgroundColor: '#526b3d',
        padding: { x: 20, y: 12 }
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.start('Menu'));
  }
}
