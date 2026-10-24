import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { MenuScene } from './scenes/MenuScene';
import { HuntScene } from './scenes/HuntScene';
import { ShopScene } from './scenes/ShopScene';
import { ResultScene } from './scenes/ResultScene';
import { W, H } from './config';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  width: W,
  height: H,
  backgroundColor: '#14231e',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  input: {
    activePointers: 3
  },
  scene: [BootScene, MenuScene, HuntScene, ShopScene, ResultScene]
};

new Phaser.Game(config);
