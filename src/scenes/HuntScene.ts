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
  private hud!: Phaser.GameObjects.Text;

  constructor() {
    super('Hunt');
  }

  create(): void {
    this.level = 0;
    this.ammo = 6;
    this.kills = 0;
    this.score = 0;
    this.remaining = 90;

    this.wind = new WindSystem(this.level);
    this.aim = new AimSystem(this);
    this.breath = new BreathSystem();

    this.spawnLevel();

    this.hud = this.add.text(16, 16, '', {
      fontFamily: 'system-ui',
      fontSize: '16px',
      color: '#ffffff'
    });

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.aim.updateFromPointer(pointer);
      this.fire();
    });

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      this.aim.updateFromPointer(pointer);
    });
  }

  private spawnLevel(): void {
    const level = LEVELS[this.level];
    const species = SPECIES[level.speciesIndex];

    for (let i = 0; i < level.animalCount; i++) {
      const animal = new Animal(this, 60 + i * 70, 400, species);
      this.animals.push(animal);
    }
  }

  private fire(): void {
    if (this.ammo <= 0) return;

    this.ammo--;
    const bullet = new Bullet(this, this.aim.x, this.aim.y, this.wind.offset);
    this.bullets.push(bullet);
  }

  update(_time: number, delta: number): void {
    const dt = delta / 1000;
    this.remaining -= dt;
    this.breath.update(dt);
    this.aim.update(dt, this.breath.isStable(), this.wind.offset);

    for (const animal of this.animals) {
      animal.update(dt, this.wind.offset);
    }

    for (const bullet of this.bullets) {
      bullet.update(dt);
    }

    this.bullets = this.bullets.filter(bullet => !bullet.isExpired());

    this.hud.setText(
      `Nivel ${this.level + 1}/10\n` +
      `Munición: ${this.ammo}/6\n` +
      `Abatidos: ${this.kills}/${LEVELS[this.level].goal}\n` +
      `Tiempo: ${Math.max(0, Math.ceil(this.remaining))} s\n` +
      `Puntos: ${this.score}`
    );

    if (this.remaining <= 0 || this.ammo === 0) {
      this.scene.start('Result', {
        kills: this.kills,
        score: this.score,
        level: this.level
      });
    }
  }
}
