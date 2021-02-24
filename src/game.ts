import "phaser";
import { MainScene } from "./scenes/main-scene";
declare const BUILD_TARGET: string;

// main game configuration
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: window.innerWidth * window.devicePixelRatio, // set game width by multiplying window width with devicePixelRatio
    height: window.innerHeight * window.devicePixelRatio, // set game height by multiplying window height with devicePixelRatio
    zoom: 1 / window.devicePixelRatio, // Set the zoom to the inverse of the devicePixelRatio

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
