import Phaser from "phaser";

export default class Level1Scene extends Phaser.Scene {

    constructor() {
        super("Level1Scene");
    }

    create() {

        this.player = this.add.rectangle(
            400,
            300,
            50,
            50,
            0x00aaff
        );
        this.aura = this.add.circle(
        this.player.x,
        this.player.y,
            80,
            0x00aaff,
            0.25
        );
        this.colorObject = this.add.rectangle(
            650,
            300,
            50,
            50,
            0x666666
        );
        this.keys = this.input.keyboard.addKeys({
            up: "W",
            down: "S",
            left: "A",
            right: "D"
        });
    }

    update() {

        const speed = 4;

        if (this.keys.left.isDown) {
            this.player.x -= speed;
        }

        if (this.keys.right.isDown) {
            this.player.x += speed;
        }

        if (this.keys.up.isDown) {
            this.player.y -= speed;
        }

        if (this.keys.down.isDown) {
            this.player.y += speed;
        }
        this.aura.x = this.player.x;
        this.aura.y = this.player.y;
        const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        this.colorObject.x,
        this.colorObject.y
        );

        if (distance < 90) {
            this.colorObject.fillColor = 0x00aaff;
        }
        else {
            this.colorObject.fillColor = 0x666666;
        }
    }
}