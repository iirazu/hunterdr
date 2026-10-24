import Phaser from 'phaser';

export interface EffectParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  type: 'smoke' | 'dust' | 'feather' | 'impact' | 'wind';
}

export class EffectsSystem {
  private particles: EffectParticle[] = [];

  constructor(private scene: Phaser.Scene) {}

  public spawnMuzzleSmoke(x: number, y: number): void {
    for (let i = 0; i < 9; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 15,
        vy: -18 - Math.random() * 15,
        life: 0.8,
        type: 'smoke'
      });
    }
  }

  public spawnDust(x: number, y: number): void {
    this.particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 10,
      vy: -8,
      life: 0.5,
      type: 'dust'
    });
  }

  public spawnFeathers(x: number, y: number): void {
    for (let i = 0; i < 7; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 50,
        vy: -20 - Math.random() * 30,
        life: 1.2,
        type: 'feather'
      });
    }
  }

  public spawnImpact(x: number, y: number): void {
    for (let i = 0; i < 5; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 30,
        vy: -10 - Math.random() * 20,
        life: 0.5,
        type: 'impact'
      });
    }
  }

  public spawnWindStreak(width: number, height: number, wind: number): void {
    if (Math.random() > 0.3) {
      return;
    }

    this.particles.push({
      x: wind >= 0 ? -10 : width + 10,
      y: Math.random() * height * 0.6,
      vx: wind * 40 + (wind >= 0 ? 30 : -30),
      vy: 0,
      life: 2,
      type: 'wind'
    });
  }

  public update(delta: number): void {
    const dt = delta / 1000;

    for (const particle of this.particles) {
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.life -= dt;

      if (particle.type === 'feather') {
        particle.vy += 25 * dt;
      }
    }

    this.particles = this.particles.filter(particle => particle.life > 0);
  }

  public getParticles(): EffectParticle[] {
    return this.particles;
  }
}
