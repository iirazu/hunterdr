import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { MenuScene } from './scenes/MenuScene';
import { HuntScene } from './scenes/HuntScene';
import { ShopScene } from './scenes/ShopScene';
import { ResultScene } from './scenes/ResultScene';

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: 420,
  height: 800,
  backgroundColor: '#14231e',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: { gravity: { x: 0, y: 0 } }
  },
  scene: [BootScene, MenuScene, HuntScene, ShopScene, ResultScene]
});
