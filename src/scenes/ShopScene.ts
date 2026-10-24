import Phaser from 'phaser';
import { W, H, FONT, NL } from '../config';
import { state, MAX_UPGRADE } from '../state';
import { UPGRADE_DEFS, upgradeCost } from '../data/upgrades';
import { LEVELS } from '../data/levels';
import { SPECIES } from '../data/species';
import { makeButton } from '../ui';

export class ShopScene extends Phaser.Scene {
  constructor() {
    super('Shop');
  }

  create(): void {
    this.add.rectangle(W / 2, H / 2, W, H, 0x14231e);
    this.add.text(W / 2, 44, 'ARMERÍA', { fontFamily: FONT, fontSize: '42px', color: '#edcf90', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(W / 2, 92, `Saldo: $${state.money}`, { fontFamily: FONT, fontSize: '28px', color: '#7CFC8A' }).setOrigin(0.5);

    UPGRADE_DEFS.forEach((def, i) => {
      const lv = state.upgrades[def.id];
      const maxed = lv >= MAX_UPGRADE;
      const cost = upgradeCost(def, lv);
      const can = !maxed && state.money >= cost;
      const x = W / 2 + (i % 2 === 0 ? -310 : 310);
      const y = 215 + Math.floor(i / 2) * 140;

      const card = this.add.rectangle(x, y, 580, 124, can ? 0x2b4a36 : 0x22352b).setStrokeStyle(2, can ? 0x7CFC8A : 0x55665b, 0.9);
      const next = maxed ? 'MÁXIMO' : `Siguiente: ${def.effect(lv + 1)}`;
      const text = [`${def.name} · Nivel ${lv}/${MAX_UPGRADE}`, `Ahora: ${def.effect(lv)}`, next, maxed ? '' : `Precio: $${cost}`].join(NL);
      this.add.text(x - 270, y, text, { fontFamily: FONT, fontSize: '17px', color: '#ffffff', lineSpacing: 3 }).setOrigin(0, 0.5);
      if (can) {
        card.setInteractive({ useHandCursor: true });
        card.on('pointerdown', () => {
          state.money -= cost;
          state.upgrades[def.id] = lv + 1;
          state.save();
          this.scene.restart();
        });
      }
    });

    const lvl = LEVELS[Math.min(state.level, LEVELS.length - 1)];
    const sp = SPECIES[lvl.speciesIndex];
    this.add
      .text(W / 2, 560, `Siguiente: nivel ${state.level + 1} · ${lvl.name} · ${sp.name} (${sp.isBird ? 'ave' : 'terrestre'})`, {
        fontFamily: FONT,
        fontSize: '22px',
        color: '#cfe3d2'
      })
      .setOrigin(0.5);
    makeButton(this, W / 2, 640, 420, 76, `EMPEZAR NIVEL ${state.level + 1}`, 0x526b3d, () => this.scene.start('Hunt'));
  }
}
