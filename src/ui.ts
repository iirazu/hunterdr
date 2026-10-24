import Phaser from 'phaser';
import { FONT } from './config';

export function makeButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  fill: number,
  onClick: () => void,
  fontSize = 26
): Phaser.GameObjects.Rectangle {
  const rect = scene.add.rectangle(x, y, w, h, fill).setStrokeStyle(2, 0xffffff, 0.6).setInteractive({ useHandCursor: true });
  scene.add
    .text(x, y, label, { fontFamily: FONT, fontSize: `${fontSize}px`, color: '#ffffff', fontStyle: 'bold' })
    .setOrigin(0.5);
  rect.on('pointerdown', onClick);
  return rect;
}
