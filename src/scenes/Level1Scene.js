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
        this.enemy = this.add.circle(
            400,
            150,
            25,
            0x000000
        );
        this.enemyCooldown = 0;
        this.enemyDirection = 1;
        this.keys = this.input.keyboard.addKeys({
            up: "W",
            down: "S",
            left: "A",
            right: "D"
        });
        this.winText = this.add.text(
        250,
        250,
        "",
        {
            fontSize: "48px",
            color: "#00ff00"
        }
        );
        this.winText.setVisible(false);
        this.door = this.add.rectangle(
            700,
            500,
            60,
            80,
            0x00ff00
        );

        this.door.setVisible(false);
    }

    update() {

        const speed = 4;
        if (this.enemyCooldown > 0) {
            this.enemyCooldown--;
        }

        this.enemy.x += 2 * this.enemyDirection;
        if (this.enemy.x > 700) {
            this.enemyDirection = -1;
        }

        if (this.enemy.x < 100) {
            this.enemyDirection = 1;
        }

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
            
        if (!object.colored) {
            object.fillColor = 0x666666;
        }

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
       if (coloredCount === this.objects.length) {
            this.door.setVisible(true);
        }
            else {
                this.door.setVisible(false);
            }

        if (this.door.visible) {

        const doorDistance = Phaser.Math.Distance.Between(
            this.player.x,
            this.player.y,
            this.door.x,
            this.door.y
        );

        if (doorDistance < 60) {
            this.winText.setText("¡Nivel completado!");
            this.winText.setVisible(true);
        }
        }
        const enemyDistance = Phaser.Math.Distance.Between(
            this.player.x,
            this.player.y,
            this.enemy.x,
            this.enemy.y
        );

       if (enemyDistance < 50 && this.enemyCooldown <= 0) {
            for (let object of this.objects) {

            if (object.colored) {
                object.colored = false;
                object.fillColor = 0x666666;
                this.enemyCooldown = 120;
            break;
            }
            }   
            }
        }
    }
}