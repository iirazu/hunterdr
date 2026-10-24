import Phaser from 'phaser';
import { BreathSystem } from './BreathSystem';
import { Upgrades } from '../state';
import { scopeZoom } from '../data/upgrades';
import { W, H } from '../config';

export class AimSystem {
  public aimX = W / 2;
  public aimY = H * 0.55;
  public crossX = W / 2;
  public crossY = H * 0.55;
  public viewX = W / 2;
  public viewY = H / 2;
  public zoom = 1;
  public scoped = false;

  private t = 0;
  private kickX = 0;
  private kickY = 0;
  private swayDist = 120;

  setAim(x: number, y: number): void {
    this.aimX = Phaser.Math.Clamp(x, 40, W - 40);
    this.aimY = Phaser.Math.Clamp(y, 60, H - 40);
  }

  move(dx: number, dy: number): void {
    const z = Math.max(this.zoom, 1);
    this.setAim(this.aimX + dx / z, this.aimY + dy / z);
  }

  kick(): void {
    this.kickY -= 46;
    this.kickX += Phaser.Math.FloatBetween(-18, 18);
  }

  update(dt: number, breath: BreathSystem, targetDist: number, up: Upgrades): void {
    this.t += dt;
    const maxZoom = scopeZoom(up.scope);
    const goal = this.scoped ? maxZoom : 1;
    this.zoom += (goal - this.zoom) * Math.min(1, dt * 10);
    this.swayDist += (targetDist - this.swayDist) * Math.min(1, dt * 4);

    let amp = (2.5 + this.swayDist * 0.11) * Math.max(0.35, 1 - 0.12 * up.stability);
    if (breath.exhausted) amp *= 2.2;
    else if (breath.active) amp *= 0.2;

    const t = this.t;
    const sx = (Math.sin(t * 1.6) + 0.35 * Math.sin(t * 3.1 + 1) + 0.2 * Math.sin(t * 7.3)) * amp;
    const sy = (Math.cos(t * 1.3) + 0.3 * Math.sin(t * 3.2) + 0.2 * Math.cos(t * 6.1)) * amp * 0.8;

    const decay = Math.exp(-dt * 5);
    this.kickX *= decay;
    this.kickY *= decay;

    const z = Math.max(this.zoom, 1);
    this.crossX = this.aimX + (sx + this.kickX) / z;
    this.crossY = this.aimY + (sy + this.kickY) / z;

    const k = Phaser.Math.Clamp((this.zoom - 1) / (maxZoom - 1), 0, 1);
    this.viewX = W / 2 + (this.crossX - W / 2) * k;
    this.viewY = H / 2 + (this.crossY - H / 2) * k;
  }
}
