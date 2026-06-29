import Phaser from "phaser";

export default class Level2Scene extends Phaser.Scene {

    constructor() {
        super("Level2Scene");
        this.lives = 3;
        this.maxLives = 3;
        this.invulnerable = false;
        this.invulnerableTimer = 0;
        this.gameOver = false;
        this.levelComplete = false;
    }

    preload() {
        this.load.tilemapTiledJSON(
            "level2",
            "Maps/Level2.tmj"
        );

        this.load.image(
            "tiles",
            "TileSet/AssetMapa.png"
        );

        this.load.image(
            "prota",
            "Sprites/Prota.png"
        );
        this.load.image("NpcH", "Sprites/NpcH.png");
        this.load.image("NpcM", "Sprites/NpcM.png");
        this.load.image("Puerta", "Sprites/Puerta.png");
        this.load.image("Charco", "Sprites/Charco.png");
        this.load.image("Tinta", "Sprites/Tinta.png");
    }

    create() {
        this.lives = this.registry.get("playerLives") ?? 3;
        this.score = this.registry.get("score") ?? 0;
        this.savedNpcs = this.registry.get("savedNpcs") ?? 0;
        this.deaths = this.registry.get("deaths") ?? 0;
        this.remainingLives = this.registry.get("remainingLives") ?? this.lives;
        this.invulnerable = false;
        this.invulnerableTimer = 0;
        this.gameOver = false;
        this.levelComplete = false;
        this.physics.resume();
        this.carriedNpc = null;
        this.pickupRange = 50;
        this.dropTimer = 1400;
        this.warningTimer = 0;
        this.warningVisible = false;

        const map = this.make.tilemap({ key: "level2" });
        const objetos = map.getObjectLayer("Objetos");
        const objectSpawns = objetos?.objects ?? [];
        const playerSpawn = objectSpawns.find(obj => obj.name === "PlayerSpawn");
        const npcSpawnObjects = objectSpawns.filter(obj => obj.name?.startsWith("NpcHSpawn") || obj.name?.startsWith("NpcMSpawn"));
        const charcoSpawnObjects = objectSpawns.filter(obj => obj.name === "CharcoSpawn");
        const doorSpawn = objectSpawns.find(obj => obj.name === "DoorSpawn");
        this.tintaSpawns = objectSpawns.filter(obj => obj.name === "TintaSpawn");

        const tileset = map.addTilesetImage("AssetMapa", "tiles");
        const plataformas = map.createLayer("Plataformas", tileset, 0, 0);
        plataformas.setTint(0x888888);
        plataformas.setCollisionByExclusion([-1]);

        this.playerSpawn = {
            x: playerSpawn?.x ?? 100,
            y: playerSpawn?.y ?? 100
        };

        this.player = this.physics.add.sprite(
            this.playerSpawn.x,
            this.playerSpawn.y,
            "prota"
        );
        this.player.setCollideWorldBounds(true);
        this.player.body.setSize(40, 70);
        this.player.body.setOffset(42, 30);
        this.physics.add.collider(this.player, plataformas);

        this.objects = [];

        for (const spawn of npcSpawnObjects) {
            const spriteKey = spawn.name.startsWith("NpcHSpawn") ? "NpcH" : "NpcM";
            const npc = this.add.image(spawn.x, spawn.y, spriteKey);
            npc.setTint(0x888888);
            npc.colored = false;
            this.objects.push(npc);
        }

        this.charcos = [];
        for (const spawn of charcoSpawnObjects) {
            const charco = this.physics.add.staticImage(spawn.x, spawn.y, "Charco");
            charco.body.setSize(80, 80, true);
            this.charcos.push(charco);
            this.physics.add.overlap(this.player, charco, this.handlePlayerHit, null, this);
        }

        this.scoreText = this.add.text(20, 20, "Objetos coloreados: 0/3", {
            fontSize: "24px",
            color: "#ffffff"
        });
        this.livesText = this.add.text(20, 60, `Vidas: ${this.lives}`, {
            fontSize: "24px",
            color: "#ff0000"
        });
        this.scoreHudText = this.add.text(20, 100, `Puntos: ${this.score}`, {
            fontSize: "24px",
            color: "#00ff88"
        });

        this.createGameOverScreen();

        this.keys = this.input.keyboard.addKeys({
            up: "W",
            left: "A",
            right: "D",
            interact: "F"
        });

        this.winText = this.add.text(250, 250, "", {
            fontSize: "48px",
            color: "#00ff00"
        }).setVisible(false);

        this.door = this.add.image(doorSpawn.x, doorSpawn.y, "Puerta");

        this.auraGraphics = this.make.graphics({ x: 0, y: 0, add: true });
        this.auraGraphics.setDepth(0);

        this.tintaDrop = this.physics.add.image(400, -60, "Tinta");
        this.tintaDrop.setScale(0.8);
        this.tintaDrop.setVisible(false);
        this.tintaDrop.setActive(false);
        this.tintaDrop.body.allowGravity = true;
        this.tintaDrop.body.gravity.y = 80;
        this.tintaDrop.body.setBounce(0.1);
        this.physics.add.collider(this.tintaDrop, plataformas, () => {
            this.resetTintaDrop();
        });
        this.physics.add.overlap(this.player, this.tintaDrop, () => {
            this.handlePlayerHit();
            this.resetTintaDrop();
        });

        this.warningText = this.add.text(680, 24, "¡CUIDADO!", {
            fontSize: "24px",
            color: "#ffef99",
            backgroundColor: "#5a1a1a",
            padding: { x: 10, y: 6 }
        }).setOrigin(0.5);
        this.warningText.setVisible(false);
    }

    createGameOverScreen() {
        this.gameOverContainer = this.add.container(0, 0);
        this.gameOverContainer.setDepth(200);

        const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.75);
        const title = this.add.text(400, 220, "GAME OVER", {
            fontSize: "48px",
            color: "#ff4d4d"
        }).setOrigin(0.5);

        const retryButton = this.add.text(400, 320, "REINTENTAR", {
            fontSize: "28px",
            color: "#ffffff",
            backgroundColor: "#333333",
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        const menuButton = this.add.text(400, 390, "VOLVER AL MENÚ", {
            fontSize: "28px",
            color: "#ffffff",
            backgroundColor: "#333333",
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive();

        this.gameOverContainer.add([overlay, title, retryButton, menuButton]);
        this.gameOverContainer.setVisible(false);

        retryButton.on("pointerdown", () => {
            this.registry.set("playerLives", 3);
            this.registry.set("score", 0);
            this.registry.set("savedNpcs", 0);
            this.registry.set("deaths", 0);
            this.registry.set("remainingLives", 3);
            this.scene.start("Level1Scene");
        });

        menuButton.on("pointerdown", () => {
            this.registry.set("playerLives", 3);
            this.registry.set("score", 0);
            this.registry.set("savedNpcs", 0);
            this.registry.set("deaths", 0);
            this.registry.set("remainingLives", 3);
            this.scene.start("MenuScene");
        });
    }

    update(time, delta) {
        if (this.gameOver) {
            return;
        }

        if (this.invulnerable) {
            this.invulnerableTimer -= delta / 1000;
            if (this.invulnerableTimer <= 0) {
                this.invulnerable = false;
                this.player.clearTint();
            }
        }

        this.dropTimer -= delta;
        if (this.warningVisible) {
            this.warningTimer -= delta / 1000;
            if (this.warningTimer <= 0) {
                this.warningVisible = false;
                this.warningText.setVisible(false);
            }
        }

        if (this.dropTimer <= 0) {
            this.spawnTintaDrop();
        }

        this.auraGraphics.clear();
        this.auraGraphics.fillStyle(0xffff00, 0.3);
        this.auraGraphics.fillCircle(this.player.x, this.player.y, 40);

        this.player.setVelocityX(0);
        if (this.keys.left.isDown) {
            this.player.setVelocityX(-200);
            this.player.setFlipX(true);
        }
        if (this.keys.right.isDown) {
            this.player.setVelocityX(200);
            this.player.setFlipX(false);
        }
        if (this.keys.up.isDown && this.player.body.blocked.down) {
            this.player.setVelocityY(-450);
        }

        if (Phaser.Input.Keyboard.JustDown(this.keys.interact)) {
            this.toggleCarryNpc();
        }

        if (this.carriedNpc) {
            this.carriedNpc.x = this.player.x + (this.player.flipX ? -30 : 30);
            this.carriedNpc.y = this.player.y - 20;
        }

        for (let i = 0; i < this.objects.length; i++) {
            const object = this.objects[i];
            const distance = Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                object.x,
                object.y
            );

            if (distance < 40 && !object.colored) {
                object.colored = true;
                object.clearTint();
                this.score += 10;
                this.savedNpcs += 1;
                this.registry.set("score", this.score);
                this.registry.set("savedNpcs", this.savedNpcs);
                this.scoreHudText.setText(`Puntos: ${this.score}`);
            }
        }

        let coloredCount = 0;
        for (const object of this.objects) {
            if (object.colored) {
                coloredCount++;
            }
        }
        this.scoreText.setText(`Objetos coloreados: ${coloredCount}/${this.objects.length}`);

        this.door.setVisible(coloredCount === this.objects.length);

        if (this.door.visible) {
            const doorDistance = Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                this.door.x,
                this.door.y
            );

            if (doorDistance < 60 && !this.levelComplete) {
                this.levelComplete = true;
                this.winText.setText("¡Nivel 2 completado!");
                this.winText.setVisible(true);
                this.registry.set("playerLives", this.lives);
                this.registry.set("score", this.score);
                this.registry.set("savedNpcs", this.savedNpcs);
                this.registry.set("deaths", this.deaths);
                this.registry.set("remainingLives", this.lives);
                this.time.delayedCall(900, () => {
                    this.scene.start("Level3Scene");
                });
            }
        }

        if (this.tintaDrop && this.tintaDrop.active) {
            if (this.tintaDrop.y > 700) {
                this.resetTintaDrop();
            }

            for (const object of this.objects) {
                const distance = Phaser.Math.Distance.Between(
                    this.tintaDrop.x,
                    this.tintaDrop.y,
                    object.x,
                    object.y
                );

                if (distance < 35) {
                    this.handlePlayerHit();
                    this.resetTintaDrop();
                    break;
                }
            }
        }
    }

    spawnTintaDrop() {
        if (!this.tintaDrop) {
            return;
        }

        const spawnPoint = Phaser.Utils.Array.GetRandom(this.tintaSpawns ?? []);
        const spawnX = spawnPoint?.x ?? Phaser.Math.Between(120, 680);
        const spawnY = spawnPoint?.y ?? -40;
        this.tintaDrop.setPosition(spawnX, spawnY);
        this.tintaDrop.setVelocity(0, 0);
        this.warningText.setPosition(spawnX, 24);
        this.warningText.setVisible(true);
        this.warningVisible = true;
        this.warningTimer = 1.2;
        this.tintaDrop.setVisible(true);
        this.tintaDrop.setActive(true);
        this.tintaDrop.body.gravity.y = 45;
        this.tintaDrop.setVelocityY(12);
        this.tintaDrop.setVelocityX(Phaser.Math.Between(-8, 8));
        this.dropTimer = Phaser.Math.Between(1600, 2400);
    }

    resetTintaDrop() {
        if (!this.tintaDrop) {
            return;
        }

        this.tintaDrop.setPosition(-100, -100);
        this.tintaDrop.setVelocity(0, 0);
        this.tintaDrop.setVisible(false);
        this.tintaDrop.setActive(false);
    }

    toggleCarryNpc() {
        if (this.carriedNpc) {
            this.carriedNpc.setData("carried", false);
            this.carriedNpc = null;
            return;
        }

        for (const object of this.objects) {
            const distance = Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                object.x,
                object.y
            );

            if (distance < this.pickupRange) {
                this.carriedNpc = object;
                object.setData("carried", true);
                break;
            }
        }
    }

    handlePlayerHit() {
        if (this.gameOver || this.invulnerable) {
            return;
        }

        this.lives -= 1;
        this.score -= 5;
        this.deaths += 1;
        this.registry.set("score", this.score);
        this.registry.set("deaths", this.deaths);
        this.registry.set("remainingLives", this.lives);
        this.updateLivesText();
        this.scoreHudText.setText(`Puntos: ${this.score}`);

        const spawnX = this.playerSpawn?.x ?? 100;
        const spawnY = this.playerSpawn?.y ?? 100;
        this.player.setPosition(spawnX, spawnY);
        this.player.setVelocity(0, 0);
        this.carriedNpc = null;

        this.invulnerable = true;
        this.invulnerableTimer = 1.2;
        this.player.setTint(0xff0000);

        if (this.lives <= 0) {
            this.triggerGameOver();
        }
    }

    updateLivesText() {
        this.livesText.setText(`Vidas: ${this.lives}`);
    }

    triggerGameOver() {
        this.gameOver = true;
        this.registry.set("score", this.score);
        this.registry.set("savedNpcs", this.savedNpcs);
        this.registry.set("deaths", this.deaths);
        this.registry.set("remainingLives", this.lives);
        this.physics.pause();
        this.gameOverContainer.setVisible(true);
    }
}
