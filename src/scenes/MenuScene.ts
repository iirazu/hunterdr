import Phaser from 'phaser';
import { W, H, FONT, NL } from '../config';
import { state } from '../state';
import { makeButton } from '../ui';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create(): void {
    this.add.rectangle(W / 2, H / 2, W, H, 0x14231e);
    const g = this.add.graphics();
    g.fillStyle(0x1f3a2c, 1);
    for (let i = 0; i < 6; i++) g.fillEllipse(i * 260, H - 40, 520, 220);
    g.fillStyle(0x2c5238, 1);
    for (let i = 0; i < 40; i++) {
      const x = (i * 97) % W;
      const h = 40 + ((i * 31) % 50);
      g.fillTriangle(x - 18, H - 40, x, H - 40 - h, x + 18, H - 40);
    }

    this.add.text(W / 2, 110, 'WILDLANDS', { fontFamily: FONT, fontSize: '84px', color: '#edcf90', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(W / 2, 180, 'Caza de precisión · 10 niveles', { fontFamily: FONT, fontSize: '28px', color: '#cfe3d2' }).setOrigin(0.5);

    let y = 290;
    if (state.hasProgress && !state.completed) {
      makeButton(this, W / 2, y, 420, 70, `CONTINUAR · Nivel ${state.level + 1}`, 0x526b3d, () => this.scene.start('Shop'));
      y += 90;
    }
    makeButton(this, W / 2, y, 420, 70, 'NUEVA PARTIDA', 0x7a4b2a, () => {
      state.newGame();
      this.scene.start('Hunt');
    });

    const help = [
      'Arrastra para mover la mira · toca para entrar en ella',
      'Mantén RESPIRAR para estabilizar · DISPARAR para tirar',
      'El corazón abate de un tiro · el viento y la distancia desvían la bala'
    ].join(NL);
    this.add.text(W / 2, H - 120, help, { fontFamily: FONT, fontSize: '20px', color: '#ffffff', align: 'center' }).setOrigin(0.5);
    if (state.best > 0) {
      this.add.text(W / 2, H - 40, `Mejor puntuación: ${state.best}`, { fontFamily: FONT, fontSize: '20px', color: '#7CFC8A' }).setOrigin(0.5);
    }
  }
}
