import Phaser from 'phaser';
import { Animal } from '../entities/Animal';
import { Bullet } from '../entities/Bullet';
import { AimSystem } from '../systems/AimSystem';
import { BreathSystem } from '../systems/BreathSystem';
import { WindSystem } from '../systems/WindSystem';
import { SPECIES } from '../data/species';
import { LEVELS } from '../data/levels';

export class HuntScene extends Phaser.Scene {
  private animals: Animal[] = [];
  private bullets: Bullet[] = [];
  private aim!: AimSystem;
  private breath!: BreathSystem;
  private wind!: WindSystem;
  private level = 0;
  private ammo = 6;
  private kills = 0;
  private score = 0;
  private remaining = 90;
  private cool = 0;
  private streak = 0;

  constructor() {
    super('Hunt');
  }

  create(): void {
    this.level = 0;
    this.startLevel();
  }

  private startLevel(): void {
    this.animals = [];
    this.bullets = [];
    this.ammo = 6;
    this.kills = 0;
    this.score = 0;
    this.remaining = 90;
    this.cool = 0;
    this.streak = 0;

    const level = LEVELS[this.level];
    const species = SPECIES[level.speciesIndex];

    this.wind = new WindSystem(level);
    this.aim = new AimSystem(this, this.wind, () => ({ stability: 0, lungs: 0 }));
    this.breath = new BreathSystem(this, () => ({ lungs: 0 }));

    for (let i = 0; i < level.animalCount; i++) {
      this.animals.push(new Animal(this, species, i));
    }

    this.input.on('pointermove', pointer => this.aim.updateFromPointer(pointer));
    this.input.on('pointerdown', pointer => this.aim.updateFromPointer(pointer));

    this.createHud();
  }

  private createHud(): void {
    const { width, height } = this.scale;

    this.add
      .text(16, 16, '', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#ffffff'
      })
      .setName('hud');

    this.add
      .rectangle(width / 2, height - 120, 220, 12, 0x101b22)
      .setStrokeStyle(1, 0xffffff)
      .setName('airBackground');

    this.add
      .rectangle(width / 2, height - 120, 220, 12, 0x5de1cb)
      .setName('airFill');
  }

  update(_time: number, delta: number): void {
    const dt = delta / 1000;

    this.remaining -= dt;
    this.cool = Math.max(0, this.cool - dt);

    this.breath.update(dt);
    this.aim.update(dt, this.breath);

    for (const animal of this.animals) {
      animal.update(dt, this.wind.value);
    }

    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      bullet.update(dt);

      if (bullet.hasArrived()) {
        this.resolveImpact(bullet);
        this.bullets.splice(i, 1);
      }
    }

    this.updateHud();

    const levelComplete =
      this.remaining <= 0 ||
      (this.ammo === 0 && this.bullets.length === 0) ||
      this.animals.every(animal => animal.isGone || animal.isDead);

    if (levelComplete) {
      this.scene.start('Result', {
        kills: this.kills,
        score: this.score,
        ammo: this.ammo,
        level: this.level
      });
    }
  }

  private updateHud(): void {
    const hud = this.children.getByName('hud') as Phaser.GameObjects.Text | undefined;
    const airFill = this.children.getByName('airFill') as Phaser.GameObjects.Rectangle | undefined;

    if (hud) {
      const level = LEVELS[this.level];
      hud.setText(
        `${this.level + 1}/10 · ${SPECIES[level.speciesIndex].name}\n` +
          `◉ ${this.ammo}/6 · ${this.kills}/${level.goal}\n` +
          `${Math.max(0, Math.ceil(this.remaining))} s · ${Math.round(this.aim.distance)} m\n` +
          `Viento ${this.wind.value >= 0 ? '→' : '←'} ${Math.abs(this.wind.value).toFixed(1)} m/s\n` +
          `Puntos: ${this.score}`
      );
    }

    if (airFill) {
      const maximum = this.breath.maximum;
      airFill.width = 220 * (this.breath.air / maximum);
      airFill.setFillStyle(this.breath.exhausted ? 0xff755e : 0x5de1cb);
    }
  }

  fire(): void {
    if (this.cool > 0 || this.ammo <= 0) {
      return;
    }

    this.ammo--;
    this.cool = 1.1;

    const bullet = new Bullet(
      this,
      this.aim.crosshairX,
      this.aim.crosshairY,
      this.aim.distance,
      this.wind.value
    );

    this.bullets.push(bullet);
  }

  private resolveImpact(bullet: Bullet): void {
    let target: Animal | undefined;

    for (const animal of this.animals) {
      if (animal.isDead || animal.isGone) {
        continue;
      }

      if (animal.containsPoint(bullet.x, bullet.y)) {
        target = animal;
        break;
      }
    }

    if (!target) {
      this.streak = 0;
      return;
    }

    const zone = target.hitZone(bullet.x, bullet.y);
    const damage = zone === 'heart' ? 999 : zone === 'head' ? 3 : zone === 'body' ? 1.4 : 0.5;

    target.applyDamage(damage);

    if (target.isDead) {
      this.kills++;
      this.streak++;
      this.score += 150 + Math.round(target.distance) + (zone === 'heart' ? 220 : 0);
    } else {
      target.flee();
    }
  }
}
