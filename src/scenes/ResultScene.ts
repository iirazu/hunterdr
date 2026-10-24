import Phaser from 'phaser';

interface ResultData {
  kills: number;
  score: number;
  level: number;
}

export class ResultScene extends Phaser.Scene {
  constructor() {
    super('Result');
  }

  create(data: ResultData): void {
    this.add.text(210, 320, 'RESULTADO', {
      fontFamily: 'system-ui',
      fontSize: '36px',
      color: '#edcf90'
    }).setOrigin(0.5);

    this.add.text(210, 400, `Abatidos: ${data.kills}\nPuntos: ${data.score}`, {
      fontFamily: 'system-ui',
      fontSize: '22px',
      color: '#ffffff'
    }).setOrigin(0.5);
  }
}
