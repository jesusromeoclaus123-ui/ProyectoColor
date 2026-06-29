import Phaser from "phaser";
import Level1Scene from "./scenes/Level1Scene";
import Level2Scene from "./scenes/Level2Scene";
import Level3Scene from "./scenes/Level3Scene";
import MenuScene from "./scenes/MenuScene";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#222222",

    physics: {
        default: "arcade",
        arcade: {
            gravity: {
                y: 900
            },
            debug: false
        }
    },

    scene: [MenuScene, Level1Scene, Level2Scene, Level3Scene],

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

new Phaser.Game(config);