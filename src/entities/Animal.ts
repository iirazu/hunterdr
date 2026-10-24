import Phaser from 'phaser';

export interface Species {
  name: string;
  hp: number;
  speed: number;
  color: number;
  isBird: boolean;
}

export class Animal extends Phaser.GameObjects.Container {
  public hp: number;
  public speed: number;
  public isBird: boolean;
  public direction: number;
  public wounded: boolean;
  public dead: boolean;

  constructor(scene: Phaser.Scene, x: number, y: number, species: Species) {
    super(scene, x, y);

    this.hp = species.hp;
    this.speed = species.speed;
    this.isBird = species.isBird;
    this.direction = Math.random() < 0.5 ? -1 : 1;
    this.wounded = false;
    this.dead = false;

    const body = scene.add.ellipse(0, 0, 40, 24, species.color);
    this.add(body);

    scene.add.existing(this);
  }

  public update(delta: number, windOffset: number): void {
    const dt = delta / 1000;
    const speed = this.wounded ? this.speed * 2.5 : this.speed;

    this.x += this.direction * speed * dt;

    if (this.x < 40 || this.x > 380) {
      this.direction *= -1;
    }

    if (this.isBird) {
      this.y += Math.sin(this.x * 0.02) * 0.5;
    }
  }
}
