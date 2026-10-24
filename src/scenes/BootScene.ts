import Phaser from 'phaser';
import { W, H, SCOPE_R } from '../config';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create(): void {
    if (!this.textures.exists('scopeMask')) {
      const tex = this.textures.createCanvas('scopeMask', W, H);
      if (tex) {
        const ctx = tex.getContext();
        ctx.fillStyle = 'rgba(0,0,0,0.95)';
        ctx.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(W / 2, H / 2, SCOPE_R, 0, Math.PI * 2);
        ctx.fill();
        tex.refresh();
      }
    }
    this.scene.start('Menu');
  }
}
