import Phaser from "phaser";
import Level1Scene from "./scenes/Level1Scene";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#222222",

    scene: [Level1Scene]
};

new Phaser.Game(config);