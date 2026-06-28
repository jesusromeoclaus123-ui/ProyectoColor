import Phaser from "phaser";

export default class Level1Scene extends Phaser.Scene {

    constructor() {
        super("Level1Scene");
    }
    preload() {
        this.load.tilemapTiledJSON(
        "level1",
        "Maps/Level1.tmj"
    );
    
        this.load.image(
            "tiles",
            "TileSet/AssetMapa.png"
        );
        this.load.on("filecomplete", (key) => {
        console.log("Cargó:", key);
        });

        this.load.on("loaderror", (file) => {
        console.log("ERROR:", file.src);
        });
        
        this.load.image(
        "prota",
        "Sprites/Prota.png"
        );
        this.load.image("NpcH", "Sprites/NpcH.png");
        this.load.image("NpcM", "Sprites/NpcM.png");
        this.load.image("Mancha", "Sprites/Mancha.png");
        this.load.image("Puerta", "Sprites/Puerta.png");
        this.load.image("Charco", "Sprites/Charco.png");
        }

    create() {
        
        const map = this.make.tilemap({ key: "level1" });
        const objetos = map.getObjectLayer("Objetos");
        const playerSpawn = objetos.objects.find(
        obj => obj.name === "PlayerSpawn"
        );
        const enemySpawn = objetos.objects.find(
        obj => obj.name === "EnemySpawn"
        );
        const npcHSpawn1 = objetos.objects.find(
        obj => obj.name === "NpcHSpawn1"
        );
        const npcHSpawn2 = objetos.objects.find(
        obj => obj.name === "NpcHSpawn2"
        );
        const npcMSpawn = objetos.objects.find(
        obj => obj.name === "NpcMSpawn"
        );
        const doorSpawn = objetos.objects.find(
        obj => obj.name === "DoorSpawn"
        );
        const charcoSpawn = objetos.objects.find(
        obj => obj.name === "CharcoSpawn"
        );
        console.log(playerSpawn);
        console.log(objetos);
        const tileset = map.addTilesetImage("AssetMapa", "tiles");
        
        console.log(map);
        console.log(tileset);

        map.createLayer("Fondo", tileset, 0, 0);
        map.createLayer("Plataformas", tileset, 0, 0);
        
        this.player = this.add.image(
            playerSpawn.x,
            playerSpawn.y,
            "prota"
        );
        this.aura = this.add.circle(
        this.player.x,
        this.player.y,
            40,
            0x00aaff,
            0.25
        );
        
        this.objects = [];

        this.objects.push(
            this.add.image(npcHSpawn1.x, npcHSpawn1.y, "NpcH")
        );

        this.objects.push(
            this.add.image(npcHSpawn2.x, npcHSpawn2.y, "NpcH")
        );

        this.objects.push(
            this.add.image(npcMSpawn.x, npcMSpawn.y, "NpcM")
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
        this.enemy = this.add.image(
        enemySpawn.x,
        enemySpawn.y,
        "Mancha"
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
        this.door = this.add.image(
        doorSpawn.x,
        doorSpawn.y,
        "Puerta"
        );
        this.charco = this.add.image(
        charcoSpawn.x,
        charcoSpawn.y,
        "Charco"
        );
        this.door.setVisible(false);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    }

    update() {

        const speed = 4;
        if (this.enemyCooldown > 0) {
            this.enemyCooldown--;
        }

        this.enemy.x += 4 * this.enemyDirection;
        if (this.enemy.x > 700) {
            this.enemyDirection = -1;
        }

        if (this.enemy.x < 100) {
            this.enemyDirection = 1;
        }

        if (this.keys.left.isDown) {
            this.player.x -= speed;
            this.player.setFlipX(true);
        }

        if (this.keys.right.isDown) {
            this.player.x += speed;
            this.player.setFlipX(false);
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

       if (distance < 45) {
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
        const charcoDistance = Phaser.Math.Distance.Between(
            this.player.x,
            this.player.y,
            this.charco.x,
            this.charco.y
        );
        if ((enemyDistance < 50 || charcoDistance < 50) &&
            this.enemyCooldown <= 0
            )   {
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