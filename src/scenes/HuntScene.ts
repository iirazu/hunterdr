import Phaser from 'phaser';
import { Animal } from '../entities/Animal';
import { Bullet, computeImpact } from '../entities/Bullet';
import { AimSystem } from '../systems/AimSystem';
import { BreathSystem } from '../systems/BreathSystem';
import { WindSystem } from '../systems/WindSystem';
import { EffectsSystem } from '../systems/EffectsSystem';
import { SPECIES, Species } from '../data/species';
import { LEVELS, LevelData } from '../data/levels';
import { cooldown } from '../data/upgrades';
import { state } from '../state';
import { W, H, SCOPE_R, FONT, HORIZON, NL } from '../config';

type Phase = 'briefing' | 'play' | 'ending';

export class HuntScene extends Phaser.Scene {
  private world!: Phaser.GameObjects.Container;
  private animals: Animal[] = [];
  private bullets: Bullet[] = [];
  private aim!: AimSystem;
  private breath!: BreathSystem;
  private wind!: WindSystem;
  private fx!: EffectsSystem;
  private level!: LevelData;
  private species!: Species;
  private levelIndex = 0;
  private phase: Phase = 'briefing';
  private ammo = 6;
  private kills = 0;
  private score = 0;
  private streak = 0;
  private hearts = 0;
  private cool = 0;
  private remaining = 90;
  private hud!: Phaser.GameObjects.Text;
  private hudG!: Phaser.GameObjects.Graphics;
  private scopeInfo!: Phaser.GameObjects.Text;
  private mask?: Phaser.GameObjects.Image;
  private reticle!: Phaser.GameObjects.Graphics;
  private marker!: Phaser.GameObjects.Graphics;
  private fireBtn!: Phaser.GameObjects.Rectangle;
  private toggleLabel!: Phaser.GameObjects.Text;
  private finishBtn!: Phaser.GameObjects.Rectangle;
  private finishLabel!: Phaser.GameObjects.Text;
  private briefingItems: Phaser.GameObjects.GameObject[] = [];
  private dragId: number | null = null;
  private lastX = 0;
  private lastY = 0;

  constructor() {
    super('Hunt');
  }

  create(): void {
    this.levelIndex = Math.min(state.level, LEVELS.length - 1);
    this.level = LEVELS[this.levelIndex];
    this.species = SPECIES[this.level.speciesIndex];
    this.animals = [];
    this.bullets = [];
    this.briefingItems = [];
    this.ammo = 6;
    this.kills = 0;
    this.score = 0;
    this.streak = 0;
    this.hearts = 0;
    this.cool = 0;
    this.remaining = this.level.time;
    this.phase = 'briefing';
    this.dragId = null;

    this.world = this.add.container(0, 0);
    this.drawBackground();
    this.wind = new WindSystem(this.level.wind);
    this.aim = new AimSystem();
    this.breath = new BreathSystem(() => state.upgrades);
    this.fx = new EffectsSystem(this, this.world);

    const n = this.level.animalCount;
    for (let i = 0; i < n; i++) {
      const span = this.level.maxDist - this.level.minDist;
      const d = this.level.minDist + (n > 1 ? (i / (n - 1)) * span : span / 2) + Phaser.Math.Between(-8, 8);
      const animal = new Animal(this, this.species, d, this.level.speedMul);
      this.animals.push(animal);
      this.world.add(animal);
    }
    this.world.sort('depth');

    this.marker = this.add.graphics().setDepth(9);
    if (this.textures.exists('scopeMask')) {
      this.mask = this.add.image(W / 2, H / 2, 'scopeMask').setDepth(10);
    }
    this.reticle = this.add.graphics().setDepth(11);
    this.drawReticle();
    this.buildHud();
    this.bindInput();
    this.showBriefing();
  }

  private drawBackground(): void {
    const p = this.level.palette;
    const g = this.add.graphics();
    this.world.add(g);
    g.fillGradientStyle(p.skyTop, p.skyTop, p.skyBottom, p.skyBottom, 1);
    g.fillRect(-800, -700, 2880, 700 + HORIZON);
    g.fillStyle(0xffffff, 0.35);
    for (let i = 0; i < 7; i++) g.fillEllipse(((i * 233) % 1400) - 60, 60 + ((i * 47) % 120), 200, 44);
    g.fillStyle(p.hills, 1);
    for (let i = 0; i < 9; i++) g.fillEllipse(i * 200 - 100, HORIZON, 420, 100 + ((i * 37) % 60) * 2);
    g.fillStyle(p.ground, 1);
    g.fillRect(-800, HORIZON, 2880, 900);
    g.fillStyle(p.groundDark, 0.5);
    for (let i = 0; i < 6; i++) g.fillRect(-800, HORIZON + 30 + i * i * 12, 2880, 10 + i * 4);
    for (let i = 0; i < 34; i++) {
      const x = (i * 97) % 1280;
      const y = HORIZON + ((i * 13) % 26);
      const s = 14 + ((i * 7) % 18);
      g.fillStyle(0x4a3524, 1);
      g.fillRect(x - 2, y - 4, 4, 8);
      g.fillStyle(p.trees, 1);
      g.fillTriangle(x - s * 0.6, y - 2, x, y - s * 2.2, x + s * 0.6, y - 2);
    }
    g.fillStyle(p.groundDark, 1);
    for (let i = 0; i < 90; i++) {
      const x = (i * 71) % 1280;
      const y = HORIZON + 20 + ((i * 53) % 400);
      g.fillTriangle(x - 4, y, x, y - 9, x + 4, y);
    }
  }

  private drawReticle(): void {
    const g = this.reticle;
    const cx = W / 2;
    const cy = H / 2;
    g.lineStyle(10, 0x000000, 1);
    g.strokeCircle(cx, cy, SCOPE_R);
    g.lineStyle(2, 0x000000, 0.85);
    g.lineBetween(cx - SCOPE_R, cy, cx - 14, cy);
    g.lineBetween(cx + 14, cy, cx + SCOPE_R, cy);
    g.lineBetween(cx, cy - SCOPE_R, cx, cy - 14);
    g.lineBetween(cx, cy + 14, cx, cy + SCOPE_R);
    g.fillStyle(0x000000, 0.85);
    for (let i = 1; i <= 6; i++) {
      g.fillCircle(cx + i * 40, cy, 2.5);
      g.fillCircle(cx - i * 40, cy, 2.5);
      g.fillCircle(cx, cy + i * 40, 2.5);
      g.fillCircle(cx, cy - i * 40, 2.5);
    }
    g.fillStyle(0xff3030, 1);
    g.fillCircle(cx, cy, 2.5);
    g.setVisible(false);
  }

  private pad(x: number, y: number, w: number, h: number, label: string, fill: number, size = 26) {
    const rect = this.add.rectangle(x, y, w, h, fill, 0.85).setStrokeStyle(3, 0xffffff, 0.7).setDepth(30).setInteractive();
    const text = this.add
      .text(x, y, label, { fontFamily: FONT, fontSize: `${size}px`, color: '#ffffff', fontStyle: 'bold', align: 'center' })
      .setOrigin(0.5)
      .setDepth(31);
    return { rect, text };
  }

  private buildHud(): void {
    this.add.rectangle(10, 10, 360, 150, 0x000000, 0.45).setOrigin(0).setDepth(20);
    this.hud = this.add.text(22, 18, '', { fontFamily: FONT, fontSize: '19px', color: '#ffffff', lineSpacing: 4 }).setDepth(21);
    this.hudG = this.add.graphics().setDepth(22);
    this.scopeInfo = this.add
      .text(W / 2, H / 2 + SCOPE_R - 28, '', { fontFamily: FONT, fontSize: '22px', color: '#ffffff', stroke: '#000000', strokeThickness: 4 })
      .setOrigin(0.5)
      .setDepth(21);

    const fire = this.pad(W - 120, H - 80, 210, 120, 'DISPARAR', 0xa63a2a, 30);
    this.fireBtn = fire.rect;
    fire.rect.on('pointerdown', () => this.fire());

    const breath = this.pad(120, H - 80, 210, 120, 'RESPIRAR' + NL + '(mantener)', 0x2b6f8a, 24);
    breath.rect.on('pointerdown', () => (this.breath.holding = true));
    breath.rect.on('pointerup', () => (this.breath.holding = false));
    breath.rect.on('pointerout', () => (this.breath.holding = false));

    const toggle = this.pad(W - 160, 50, 290, 56, '', 0x333f36, 20);
    this.toggleLabel = toggle.text;
    toggle.rect.on('pointerdown', () => {
      if (this.phase !== 'play') return;
      this.aim.scoped = !this.aim.scoped;
    });

    const finish = this.pad(W - 160, 116, 290, 56, 'COBRAR Y TERMINAR', 0x526b3d, 20);
    this.finishBtn = finish.rect;
    this.finishLabel = finish.text;
    finish.rect.on('pointerdown', () => {
      if (this.phase === 'play' && this.kills >= this.level.goal) this.endLevel();
    });

    const kb = this.input.keyboard;
    if (kb) {
      kb.on('keydown-SPACE', () => this.fire());
      kb.on('keydown-SHIFT', () => (this.breath.holding = true));
      kb.on('keyup-SHIFT', () => (this.breath.holding = false));
      kb.on('keydown-Z', () => {
        if (this.phase === 'play') this.aim.scoped = !this.aim.scoped;
      });
    }
  }

  private bindInput(): void {
    this.input.on('pointerdown', (p: Phaser.Input.Pointer, over: Phaser.GameObjects.GameObject[]) => {
      if (over.length > 0 || this.phase !== 'play') return;
      if (!this.aim.scoped) {
        this.aim.setAim(p.x, p.y);
        this.aim.scoped = true;
        return;
      }
      this.dragId = p.id;
      this.lastX = p.x;
      this.lastY = p.y;
    });
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (this.dragId !== p.id || !p.isDown) return;
      this.aim.move(p.x - this.lastX, p.y - this.lastY);
      this.lastX = p.x;
      this.lastY = p.y;
    });
    const stop = (p: Phaser.Input.Pointer) => {
      if (this.dragId === p.id) this.dragId = null;
    };
    this.input.on('pointerup', stop);
    this.input.on('pointerupoutside', stop);
  }

  private showBriefing(): void {
    const lvl = this.level;
    const kind = this.species.isBird ? 'Ave' : 'Terrestre';
    const lines = [
      `Objetivo: abatir ${lvl.goal} ${this.species.name.toLowerCase()}(s) con 6 disparos`,
      `Tipo: ${kind} · Distancias: ${lvl.minDist}-${lvl.maxDist} m · Viento hasta ${lvl.wind.toFixed(1)} m/s`,
      '',
      'Corazón: abate de un disparo. Cabeza, cuerpo y patas hacen menos daño.',
      'Cuanto más lejos, más tiembla la mira: usa RESPIRAR.',
      'El viento desvía la bala y la bala cae con la distancia.',
      'Los animales en movimiento exigen adelantar el disparo.'
    ].join(NL);
    const bg = this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.8).setDepth(40).setInteractive();
    const title = this.add
      .text(W / 2, 150, `NIVEL ${this.levelIndex + 1}/10 · ${lvl.name}`, { fontFamily: FONT, fontSize: '44px', color: '#edcf90', fontStyle: 'bold' })
      .setOrigin(0.5)
      .setDepth(41);
    const body = this.add
      .text(W / 2, 330, lines, { fontFamily: FONT, fontSize: '23px', color: '#ffffff', align: 'center', lineSpacing: 8 })
      .setOrigin(0.5)
      .setDepth(41);
    const btn = this.add.rectangle(W / 2, 560, 300, 80, 0x526b3d).setStrokeStyle(3, 0xffffff, 0.7).setDepth(41).setInteractive();
    const label = this.add
      .text(W / 2, 560, 'EMPEZAR', { fontFamily: FONT, fontSize: '32px', color: '#ffffff', fontStyle: 'bold' })
      .setOrigin(0.5)
      .setDepth(42);
    this.briefingItems = [bg, title, body, btn, label];
    btn.on('pointerdown', () => {
      this.briefingItems.forEach(o => o.destroy());
      this.briefingItems = [];
      this.phase = 'play';
    });
  }

  private nearestTarget(): Animal | null {
    let best: Animal | null = null;
    let bd = 160;
    for (const a of this.animals) {
      if (a.isDead || a.isGone) continue;
      const d = Math.hypot(a.x - this.aim.crossX, a.y - this.aim.crossY);
      if (d < bd) {
        bd = d;
        best = a;
      }
    }
    return best;
  }

  private fire(): void {
    if (this.phase !== 'play') return;
    if (!this.aim.scoped) {
      this.fx.floatText(W / 2, H / 2, 'Entra en la mira para disparar', '#ffffff');
      return;
    }
    if (this.cool > 0 || this.ammo <= 0) return;
    const up = state.upgrades;
    this.ammo--;
    this.cool = cooldown(up.bolt);
    const target = this.nearestTarget();
    const dist = target ? target.distance : 150;
    const imp = computeImpact(this.aim.crossX, this.aim.crossY, dist, this.wind.value, up);
    this.bullets.push(new Bullet(imp.x, imp.y, imp.time));
    this.aim.kick();
    this.fx.shot();
    for (const a of this.animals) {
      if (Math.hypot(a.x - imp.x, a.y - imp.y) < 450 || Math.random() < 0.3) a.alarm();
    }
  }

  private toScreen(x: number, y: number): { x: number; y: number } {
    return { x: W / 2 + (x - this.aim.viewX) * this.aim.zoom, y: H / 2 + (y - this.aim.viewY) * this.aim.zoom };
  }

  private resolveImpact(b: Bullet): void {
    const sorted = this.animals.filter(a => !a.isDead && !a.isGone).sort((a, c) => a.distance - c.distance);
    for (const a of sorted) {
      const zone = a.hitTest(b.x, b.y);
      if (!zone) continue;
      const power = 1 + state.upgrades.power * 0.2;
      const base = zone === 'heart' ? 999 : zone === 'head' ? 2 : zone === 'body' ? 1 : 0.4;
      a.applyDamage(base * power);
      this.fx.hit();
      const s = this.toScreen(b.x, b.y);
      this.fx.puff(b.x, b.y, 0xcc4433, 6);
      if (a.isDead) {
        this.kills++;
        this.streak++;
        if (zone === 'heart') this.hearts++;
        const mult = zone === 'heart' ? 2 : zone === 'head' ? 1.5 : 1;
        const moving = a.isMoving() ? 30 : 0;
        const bonus = Math.min(this.streak - 1, 5) * 25;
        const pts = Math.round(a.species.value * mult + a.distance * 1.2 + moving) + bonus;
        this.score += pts;
        const tag = zone === 'heart' ? '¡CORAZÓN!' : zone === 'head' ? '¡Cabeza!' : 'Abatido';
        this.fx.floatText(s.x, s.y, `${tag} +${pts}`, zone === 'heart' ? '#ff6b6b' : '#7CFC8A');
      } else {
        a.flee();
        this.score += 10;
        this.fx.floatText(s.x, s.y, 'Herido +10', '#ffd966');
      }
      return;
    }
    this.streak = 0;
    this.fx.puff(b.x, b.y, 0xd9c9a0, 8);
    const s = this.toScreen(b.x, b.y);
    this.fx.floatText(s.x, s.y, 'Fallo', '#cccccc');
  }

  update(_time: number, delta: number): void {
    const dt = Math.min(delta, 50) / 1000;
    const now = this.time.now / 1000;
    this.wind.update(dt);
    this.breath.update(dt);
    const playing = this.phase === 'play';
    if (playing) {
      this.remaining -= dt;
      this.cool = Math.max(0, this.cool - dt);
    }

    const target = this.nearestTarget();
    this.aim.update(dt, this.breath, target ? target.distance : 150, state.upgrades);
    for (const a of this.animals) a.update(dt, now);

    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.update(dt);
      if (b.arrived) {
        this.bullets.splice(i, 1);
        this.resolveImpact(b);
      }
    }

    const z = this.aim.zoom;
    this.world.setScale(z);
    this.world.setPosition(W / 2 - this.aim.viewX * z, H / 2 - this.aim.viewY * z);
    this.reticle.setVisible(this.aim.scoped);
    this.mask?.setVisible(this.aim.scoped);
    this.marker.clear();
    if (!this.aim.scoped && this.phase === 'play') {
      this.marker.lineStyle(2, 0xff3030, 1);
      this.marker.strokeCircle(this.aim.aimX, this.aim.aimY, 14);
    }

    this.updateHud(target);

    if (playing) {
      const idle = this.bullets.length === 0;
      const done =
        this.remaining <= 0 || (this.ammo === 0 && idle) || (idle && this.animals.every(a => a.isDead || a.isGone));
      if (done) this.endLevel();
    }
  }

  private updateHud(target: Animal | null): void {
    const kind = this.species.isBird ? 'ave' : 'terrestre';
    this.hud.setText(
      [
        `Nivel ${this.levelIndex + 1}/10 · ${this.species.name} (${kind})`,
        `Abatidos ${this.kills}/${this.level.goal}   Puntos ${this.score}`,
        `Tiempo ${Math.max(0, Math.ceil(this.remaining))} s   Dinero $${state.money}`
      ].join(NL)
    );
    const g = this.hudG;
    g.clear();
    for (let i = 0; i < 6; i++) {
      g.fillStyle(i < this.ammo ? 0xe0b040 : 0x3a3a3a, 1);
      g.fillRect(24 + i * 30, 112, 20, 36);
    }
    const bw = 210;
    const frac = Phaser.Math.Clamp(this.breath.air / this.breath.maximum, 0, 1);
    g.fillStyle(0x101b22, 0.8);
    g.fillRect(120 - bw / 2, H - 160, bw, 14);
    g.fillStyle(this.breath.exhausted ? 0xff755e : 0x5de1cb, 1);
    g.fillRect(120 - bw / 2, H - 160, bw * frac, 14);

    const w = this.wind.value;
    const dist = target ? `${Math.round(target.distance)} m` : '-- m';
    this.scopeInfo.setText(`${dist} · Viento ${w >= 0 ? '→' : '←'} ${Math.abs(w).toFixed(1)} m/s`);
    this.scopeInfo.setVisible(this.aim.scoped);
    this.toggleLabel.setText(this.aim.scoped ? 'VISTA AMPLIA' : 'ENTRAR EN LA MIRA');
    this.fireBtn.setAlpha(this.cool > 0 || this.ammo <= 0 ? 0.4 : 1);
    const canFinish = this.phase === 'play' && this.kills >= this.level.goal;
    this.finishBtn.setVisible(canFinish);
    this.finishLabel.setVisible(canFinish);
  }

  private endLevel(): void {
    if (this.phase === 'ending') return;
    this.phase = 'ending';
    const passed = this.kills >= this.level.goal;
    const bonus = passed ? this.ammo * 40 : 0;
    const total = this.score + bonus;
    const earned = passed ? total : Math.floor(total / 2);
    const final = passed && this.levelIndex === LEVELS.length - 1;
    state.money += earned;
    state.totalScore += total;
    state.best = Math.max(state.best, state.totalScore);
    if (final) state.completed = true;
    else if (passed) state.level = this.levelIndex + 1;
    state.save();

    const data = {
      name: this.level.name,
      level: this.levelIndex,
      passed,
      final,
      kills: this.kills,
      goal: this.level.goal,
      ammo: this.ammo,
      hearts: this.hearts,
      score: this.score,
      bonus,
      earned
    };
    this.time.delayedCall(1300, () => this.scene.start('Result', data));
  }
}
