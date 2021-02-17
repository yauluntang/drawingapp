import "phaser";
import { MainScene } from "./scenes/main-scene";
declare const BUILD_TARGET: string;

// main game configuration
const config: Phaser.Types.Core.GameConfig = {
    width: window.innerWidth,
    height: window.innerHeight,
    type: Phaser.AUTO,
    parent: "game",
    scene: MainScene,
    physics: {
        default: "arcade",
    }
};

export class Game extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}

window.addEventListener("load", () => {
    const game = new Game(config);
});
