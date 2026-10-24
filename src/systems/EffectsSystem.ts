import Phaser from 'phaser';
import { FONT } from '../config';

export class EffectsSystem {
  constructor(
    private scene: Phaser.Scene,
    private world: Phaser.GameObjects.Container
  ) {}

  puff(x: number, y: number, color: number, count = 8): void {
    for (let i = 0; i < count; i++) {
      const c = this.scene.add.circle(x, y, Phaser.Math.Between(2, 4), color, 0.9);
      this.world.add(c);
      const a = Math.random() * Math.PI * 2;
      const r = Phaser.Math.Between(8, 26);
      this.scene.tweens.add({
        targets: c,
        x: x + Math.cos(a) * r,
        y: y + Math.sin(a) * r - 6,
        alpha: 0,
        scale: 2,
        duration: 450,
        onComplete: () => c.destroy()
      });
    }
  }

  floatText(sx: number, sy: number, text: string, color: string): void {
    const t = this.scene.add
      .text(sx, sy, text, { fontFamily: FONT, fontSize: '28px', color, fontStyle: 'bold', stroke: '#000000', strokeThickness: 4 })
      .setOrigin(0.5)
      .setDepth(60);
    this.scene.tweens.add({ targets: t, y: sy - 70, alpha: 0, duration: 1100, onComplete: () => t.destroy() });
  }

  shot(): void {
    const f = this.scene.add.rectangle(640, 360, 1280, 720, 0xffffff, 0.5).setDepth(55);
    this.scene.tweens.add({ targets: f, alpha: 0, duration: 120, onComplete: () => f.destroy() });
    this.scene.cameras.main.shake(90, 0.004);
    this.noise(0.35, 900, 0.5);
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(30);
  }

  hit(): void {
    this.noise(0.12, 300, 0.4);
  }

  private noise(duration: number, freq: number, vol: number): void {
    const ctx = (this.scene.sound as unknown as { context?: AudioContext }).context;
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();
    const len = Math.floor(ctx.sampleRate * duration);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = freq;
    const gain = ctx.createGain();
    gain.gain.value = vol;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start();
  }
}
