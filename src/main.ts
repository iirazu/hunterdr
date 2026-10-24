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
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: W,
    height: H
  },
  input: {
    activePointers: 3
  },
  scene: [BootScene, MenuScene, HuntScene, ShopScene, ResultScene]
};

const game = new Phaser.Game(config);

const refresh = (): void => {
  game.scale.refresh();
  setTimeout(() => game.scale.refresh(), 300);
};
window.addEventListener('resize', refresh);
window.addEventListener('orientationchange', refresh);
if (window.visualViewport) window.visualViewport.addEventListener('resize', refresh);

window.addEventListener(
  'pointerup',
  () => {
    try {
      if (game.scale.fullscreen.available && !game.scale.isFullscreen) game.scale.startFullscreen();
    } catch (e) {
      // pantalla completa no disponible
    }
  },
  { once: true }
);
