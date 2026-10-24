import Phaser from 'phaser';
import { Species } from '../data/species';
import { W, HORIZON } from '../config';

export type Zone = 'heart' | 'head' | 'body' | 'limb';

export class Animal extends Phaser.GameObjects.Container {
  public isDead = false;
  public isGone = false;
  public wounded = false;
  public hitPoints: number;
  public readonly distance: number;
  public readonly species: Species;
  public readonly persp: number;

  private dir: 1 | -1;
  private baseSpeed: number;
  private gfx: Phaser.GameObjects.Graphics;
  private wing?: Phaser.GameObjects.Graphics;
  private mode: 'walk' | 'idle' = 'walk';
  private timer = 1 + Math.random() * 2;
  private alarmTime = 0;
  private phase = Math.random() * Math.PI * 2;
  private baseY: number;

  constructor(scene: Phaser.Scene, species: Species, distance: number, speedMul: number) {
    super(scene, 0, 0);
    const d = Phaser.Math.Clamp(distance, 60, 260);
    this.species = species;
    this.distance = d;
    this.persp = 100 / d;
    this.hitPoints = species.hitPoints;
    this.baseSpeed = species.speed * speedMul;
    this.dir = Math.random() < 0.5 ? 1 : -1;

    const groundY = HORIZON + ((260 - d) / 200) * 280 + Phaser.Math.Between(-6, 6);
    this.baseY = species.isBird ? Phaser.Math.Between(80, 250) : groundY - 0.35 * species.size * this.persp;
    this.setPosition(Phaser.Math.Between(120, W - 120), this.baseY);
    this.setScale(this.persp * this.dir, this.persp);
    this.setDepth(500 - d);

    this.gfx = scene.add.graphics();
    this.add(this.gfx);
    if (species.isBird) {
      this.drawBird();
      this.wing = scene.add.graphics();
      this.wing.setPosition(-0.05 * species.size, -0.05 * species.size);
      this.drawWing();
      this.add(this.wing);
    } else {
      this.drawGround();
    }
  }

  public isMoving(): boolean {
    return this.species.isBird || this.mode === 'walk' || this.wounded;
  }

  public alarm(): void {
    this.alarmTime = 4;
  }

  public flee(): void {
    this.wounded = true;
    this.dir = this.x < W / 2 ? -1 : 1;
  }

  public update(dt: number, time: number): void {
    if (this.isDead || this.isGone) return;
    const bird = this.species.isBird;
    if (this.alarmTime > 0) this.alarmTime -= dt;
    const mult = this.wounded ? 2.6 : this.alarmTime > 0 ? 1.7 : 1;
    const speed = this.baseSpeed * this.persp * mult * (bird ? 1.4 : 1);

    if (!bird && !this.wounded) {
      this.timer -= dt;
      if (this.timer <= 0) {
        if (this.mode === 'walk' && this.alarmTime <= 0) {
          this.mode = 'idle';
          this.timer = 1 + Math.random() * 2.5;
        } else {
          this.mode = 'walk';
          this.timer = 2 + Math.random() * 3;
          if (Math.random() < 0.5) this.dir = this.dir === 1 ? -1 : 1;
        }
      }
      if (this.alarmTime > 0) this.mode = 'walk';
    } else {
      this.mode = 'walk';
    }

    if (this.mode === 'walk') this.x += this.dir * speed * dt;

    if (!this.wounded) {
      if (this.x < 90 && this.dir < 0) this.dir = 1;
      if (this.x > W - 90 && this.dir > 0) this.dir = -1;
    } else if (this.x < -90 || this.x > W + 90) {
      this.isGone = true;
      this.setVisible(false);
      return;
    }

    this.scaleX = this.dir * this.persp;
    if (bird) {
      this.y = this.baseY + Math.sin(time * 1.4 + this.phase) * 22;
      if (this.wing) this.wing.scaleY = Math.sin(time * (this.wounded ? 16 : 10) + this.phase) * 0.8 + 0.2;
    } else {
      this.gfx.y = this.mode === 'walk' ? -Math.abs(Math.sin(time * 8 + this.phase)) * 3 : 0;
    }
  }

  public hitTest(px: number, py: number): Zone | null {
    if (this.isDead || this.isGone) return null;
    const S = this.species.size;
    const lx = (px - this.x) / (this.persp * this.dir);
    const ly = (py - this.y) / this.persp;
    const minR = 3 / this.persp;
    const bird = this.species.isBird;

    const hr = Math.max(0.1 * S, minR);
    if (Math.hypot(lx - 0.14 * S, ly - 0.03 * S) <= hr) return 'heart';

    const hx = 0.46 * S;
    const hy = (bird ? -0.1 : -0.16) * S;
    const headR = Math.max((bird ? 0.12 : 0.14) * S, minR);
    if (Math.hypot(lx - hx, ly - hy) <= headR) return 'head';

    const ry = (bird ? 0.25 : 0.28) * S;
    if ((lx / (0.5 * S)) ** 2 + (ly / ry) ** 2 <= 1) return 'body';

    if (bird) {
      if (((lx + 0.05 * S) / (0.25 * S)) ** 2 + ((ly + 0.22 * S) / (0.2 * S)) ** 2 <= 1) return 'limb';
    } else if (Math.abs(lx) <= 0.42 * S && ly >= 0.2 * S && ly <= 0.55 * S) {
      return 'limb';
    }
    return null;
  }

  public applyDamage(amount: number): void {
    this.hitPoints -= amount;
    if (this.hitPoints <= 0) this.die();
  }

  private die(): void {
    this.isDead = true;
    const bird = this.species.isBird;
    this.scene.tweens.add({
      targets: this,
      y: this.y + (bird ? 240 : 8),
      angle: this.dir * (bird ? 120 : 90),
      duration: bird ? 700 : 450
    });
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      delay: 1500,
      duration: 600,
      onComplete: () => this.setVisible(false)
    });
  }

  private drawGround(): void {
    const g = this.gfx;
    const sp = this.species;
    const S = sp.size;
    const dark = Phaser.Display.Color.IntegerToColor(sp.color).darken(25).color;

    g.fillStyle(dark, 1);
    for (const lx of [-0.36, -0.24, 0.2, 0.32]) g.fillRect(lx * S, 0.15 * S, 0.07 * S, 0.36 * S);

    if (sp.id === 'zorro') {
      g.fillStyle(sp.color, 1);
      g.fillEllipse(-0.62 * S, -0.02 * S, 0.4 * S, 0.16 * S);
      g.fillStyle(sp.accent, 1);
      g.fillEllipse(-0.78 * S, -0.02 * S, 0.12 * S, 0.12 * S);
    }
    if (sp.id === 'lobo') {
      g.fillStyle(dark, 1);
      g.fillEllipse(-0.58 * S, 0.02 * S, 0.3 * S, 0.12 * S);
    }

    g.fillStyle(sp.color, 1);
    g.fillEllipse(0, 0, S, 0.56 * S);
    if (sp.id === 'oso') g.fillCircle(0.12 * S, -0.22 * S, 0.2 * S);
    g.fillStyle(sp.accent, 1);
    g.fillEllipse(0, 0.1 * S, 0.8 * S, 0.24 * S);
    g.fillStyle(sp.color, 1);
    g.fillEllipse(0.36 * S, -0.1 * S, 0.3 * S, 0.3 * S);
    g.fillCircle(0.46 * S, -0.16 * S, 0.14 * S);
    g.fillStyle(sp.accent, 1);
    g.fillEllipse(0.58 * S, -0.12 * S, 0.14 * S, 0.1 * S);
    g.fillCircle(-0.5 * S, -0.05 * S, 0.05 * S);
    g.fillStyle(0x111111, 1);
    g.fillCircle(0.5 * S, -0.2 * S, 0.02 * S);

    g.fillStyle(sp.color, 1);
    switch (sp.id) {
      case 'ciervo':
        g.lineStyle(Math.max(2, 0.025 * S), 0x4a3524, 1);
        g.lineBetween(0.44 * S, -0.28 * S, 0.4 * S, -0.55 * S);
        g.lineBetween(0.4 * S, -0.55 * S, 0.5 * S, -0.62 * S);
        g.lineBetween(0.42 * S, -0.42 * S, 0.54 * S, -0.46 * S);
        g.lineBetween(0.5 * S, -0.28 * S, 0.5 * S, -0.5 * S);
        break;
      case 'conejo':
        g.fillEllipse(0.4 * S, -0.38 * S, 0.07 * S, 0.26 * S);
        g.fillEllipse(0.47 * S, -0.38 * S, 0.07 * S, 0.26 * S);
        break;
      case 'zorro':
      case 'lobo':
        g.fillTriangle(0.4 * S, -0.27 * S, 0.44 * S, -0.42 * S, 0.5 * S, -0.28 * S);
        break;
      case 'jabali':
        g.fillStyle(0xf2efe0, 1);
        g.fillTriangle(0.6 * S, -0.1 * S, 0.66 * S, -0.2 * S, 0.62 * S, -0.06 * S);
        g.fillStyle(dark, 1);
        g.fillTriangle(-0.3 * S, -0.26 * S, -0.1 * S, -0.34 * S, 0.1 * S, -0.26 * S);
        break;
      case 'oso':
        g.fillCircle(0.4 * S, -0.3 * S, 0.05 * S);
        break;
      default:
        break;
    }
  }

  private drawBird(): void {
    const g = this.gfx;
    const sp = this.species;
    const S = sp.size;
    const dark = Phaser.Display.Color.IntegerToColor(sp.color).darken(25).color;
    const tail = sp.id === 'faisan' ? 0.55 : sp.id === 'aguila' ? 0.35 : 0.22;

    g.fillStyle(dark, 1);
    g.fillTriangle(-0.45 * S, -0.08 * S, -(0.45 + tail) * S, 0.02 * S, -0.45 * S, 0.1 * S);
    g.fillStyle(sp.color, 1);
    g.fillEllipse(0, 0, S, 0.5 * S);
    g.fillStyle(sp.accent, 1);
    g.fillEllipse(0.1 * S, 0.08 * S, 0.6 * S, 0.2 * S);
    if (sp.id === 'ganso') g.fillEllipse(0.4 * S, -0.1 * S, 0.22 * S, 0.3 * S);
    g.fillStyle(sp.id === 'aguila' ? sp.accent : sp.id === 'ganso' ? dark : sp.accent, 1);
    g.fillCircle(0.46 * S, -0.1 * S, 0.12 * S);
    g.fillStyle(0xe0a030, 1);
    g.fillTriangle(0.56 * S, -0.14 * S, 0.7 * S, -0.08 * S, 0.56 * S, -0.04 * S);
    g.fillStyle(0x111111, 1);
    g.fillCircle(0.5 * S, -0.13 * S, 0.02 * S);
    g.lineStyle(Math.max(1.5, 0.02 * S), 0xc08a2a, 1);
    g.lineBetween(-0.05 * S, 0.22 * S, -0.08 * S, 0.4 * S);
    g.lineBetween(0.08 * S, 0.22 * S, 0.1 * S, 0.4 * S);
  }

  private drawWing(): void {
    if (!this.wing) return;
    const S = this.species.size;
    const k = this.species.id === 'aguila' ? 1.3 : 1;
    const dark = Phaser.Display.Color.IntegerToColor(this.species.color).darken(20).color;
    this.wing.fillStyle(dark, 1);
    this.wing.fillEllipse(0, -0.17 * S, 0.5 * S * k, 0.4 * S * k);
  }
}
