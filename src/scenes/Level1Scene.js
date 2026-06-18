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
        this.objects = [];
        this.objects.push(
            this.add.rectangle(650, 300, 50, 50, 0x666666)
        );

        this.objects.push(
            this.add.rectangle(550, 200, 50, 50, 0x666666)
        );

        this.objects.push(
            this.add.rectangle(300, 450, 50, 50, 0x666666)
        );
        for (let object of this.objects) {
            object.colored = false;
        }
        this.scoreText = this.add.text(
            20,
            20,
            "Objetos coloreados: 0/3",
        {
        fontSize: "24px",
        color: "#ffffff"
        }
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
        
        for (let object of this.objects) {

        const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        object.x,
        object.y
        );

        if (distance < 90) {
            object.fillColor = 0x00aaff;
            if (!object.colored) {
                object.colored = true;
            }
        }
        else {
            object.fillColor = 0x666666;
            object.colored = false;
        }
        let coloredCount = 0;

        for (let object of this.objects) {
            if (object.colored) {
                coloredCount++;
            }
        }
        this.scoreText.setText(
        `Objetos coloreados: ${coloredCount}/${this.objects.length}`
        );
        }
    }
}