import Phaser from "phaser";

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#222222",

    scene: {
        create() {

            this.player = this.add.rectangle(
                400,
                300,
                50,
                50,
                0x00aaff
            );

            this.keys = this.input.keyboard.addKeys({
                up: "W",
                down: "S",
                left: "A",
                right: "D"
            });
        },

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
        }
    }
};

new Phaser.Game(config);