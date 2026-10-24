import Phaser from 'phaser';
import { W, H, FONT, NL } from '../config';
import { state } from '../state';
import { makeButton } from '../ui';

interface ResultData {
  name: string;
  level: number;
  passed: boolean;
  final: boolean;
  kills: number;
  goal: number;
  ammo: number;
  hearts: number;
  score: number;
  bonus: number;
  earned: number;
}

export class ResultScene extends Phaser.Scene {
  constructor() {
    super('Result');
  }

  create(data: ResultData): void {
    this.add.rectangle(W / 2, H / 2, W, H, 0x14231e);
    const title = data.final ? '¡CAMPAÑA COMPLETADA!' : data.passed ? 'NIVEL SUPERADO' : 'OBJETIVO NO CUMPLIDO';
    this.add
      .text(W / 2, 90, title, { fontFamily: FONT, fontSize: '54px', color: data.passed ? '#edcf90' : '#ff8a7a', fontStyle: 'bold' })
      .setOrigin(0.5);
    this.add.text(W / 2, 150, `Nivel ${data.level + 1} · ${data.name}`, { fontFamily: FONT, fontSize: '26px', color: '#cfe3d2' }).setOrigin(0.5);

    const lines = [
      `Abatidos: ${data.kills}/${data.goal}   ·   Tiros al corazón: ${data.hearts}`,
      `Puntos: ${data.score}   ·   Bonus munición: +${data.bonus}`,
      `Dinero ganado: $${data.earned}${data.passed ? '' : ' (50% por no cumplir el objetivo)'}`,
      `Saldo total: $${state.money}   ·   Puntuación total: ${state.totalScore}`
    ].join(NL);
    this.add.text(W / 2, 320, lines, { fontFamily: FONT, fontSize: '26px', color: '#ffffff', align: 'center', lineSpacing: 14 }).setOrigin(0.5);

    if (data.final) {
      makeButton(this, W / 2, 560, 420, 76, 'VOLVER AL MENÚ', 0x526b3d, () => this.scene.start('Menu'));
      return;
    }
    if (data.passed) {
      makeButton(this, W / 2, 560, 420, 76, 'IR A LA TIENDA', 0x526b3d, () => this.scene.start('Shop'));
    } else {
      makeButton(this, W / 2 - 230, 560, 420, 76, 'REINTENTAR', 0xa63a2a, () => this.scene.start('Hunt'));
      makeButton(this, W / 2 + 230, 560, 420, 76, 'TIENDA', 0x526b3d, () => this.scene.start('Shop'));
    }
  }
}
