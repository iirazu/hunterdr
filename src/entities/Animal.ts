import Phaser from 'phaser';

export interface SpeciesData {
  name: string;
  hitPoints: number;
  size: number;
  speed: number;
  color: number;
  isBird: boolean;
}

export class Animal extends Phaser.GameObjects.Container {
  public isDead = false;
  public isGone = false;
  public distance = 100;
  public hitPoints: number;

  private direction: 1 | -1 = 1;
  private speed: number;
  private waitTime: number;

  constructor(
    scene: Phaser.Scene,
    private species: SpeciesData,
    index: number
  ) {
    super(scene, 0, 0);

    this.hitPoints = species.hitPoints;
    this.speed = species.speed;
    this.distance = 80 + index * 18;
    this.waitTime = 1 + Math.random() * 2;
    this.direction = index % 2 === 0 ? 1 : -1;

    this.setPosition(
      Phaser.Math.Between(80, scene.scale.width - 80),
      Phaser.Math.Between(180, scene.scale.height * 0.55)
    );

    const body = scene.add.ellipse(0, 0, species.size, species.size * 0.55, species.color);
    this.add(body);

    scene.add.existing(this);
  }

  public update(delta: number, wind: number): void {
    if (this.isDead || this.isGone) {
      return;
    }

    const dt = delta / 1000;
    this.waitTime -= dt;

    if (this.waitTime <= 0) {
      this.direction = this.direction === 1 ? -1 : 1;
      this.waitTime = 1 + Math.random() * 2;
    }

    this.x += this.direction * this.speed * dt;
    this.y += Math.sin(this.scene.time.now / 500) * wind * dt;

    const bounds = this.scene.scale;

    if (this.x < 50 || this.x > bounds.width - 50) {
      this.direction *= -1;
    }
  }

  public containsPoint(x: number, y: number): boolean {
    const radius = this.species.size / 2;
    return Math.hypot(x - this.x, y - this.y) <= radius;
  }

  public hitZone(x: number, y: number): 'heart' | 'head' | 'body' | 'leg' {
    const distance = Math.hypot(x - this.x, y - this.y);

    if (distance < this.species.size * 0.12) {
      return 'heart';
    }

    if (distance < this.species.size * 0.25) {
      return 'head';
    }

    if (distance < this.species.size * 0.45) {
      return 'body';
    }

    return 'leg';
  }

  public applyDamage(damage: number): void {
    this.hitPoints -= damage;

    if (this.hitPoints <= 0) {
      this.isDead = true;
    }
  }

  public flee(): void {
    this.speed *= 2;
  }
}
