import 'phaser';
import SceneMain from './SceneMain';

let game;
window.onload = () => {
  let config = {
      type: Phaser.AUTO,
      parent: 'phaser-game',
      width: 640,
      height: 480,
      physics: {
    		default: 'arcade',
    		arcade: {
    			debug: true
    		}
      },
      scene: [SceneMain]
  };
  game = new Phaser.Game(config);
}
