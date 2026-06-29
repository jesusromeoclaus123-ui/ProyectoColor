import Phaser from "phaser";

export default class MenuScene extends Phaser.Scene {

    constructor() {
        super("MenuScene");
    }

    create() {
       
        this.add.text(400, 120, "La Última Luz", {
            fontSize: "48px",
            color: "#ffffff"
        }).setOrigin(0.5);

        const jugar = this.add.text(400, 250, "JUGAR", {
            fontSize: "32px",
            color: "#ffffff",
            backgroundColor: "#333333",
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive();

        const comoJugar = this.add.text(400, 340, "CÓMO SE JUEGA", {
            fontSize: "32px",
            color: "#ffffff",
            backgroundColor: "#333333",
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive();

        const salir = this.add.text(400, 430, "SALIR", {
            fontSize: "32px",
            color: "#ffffff",
            backgroundColor: "#333333",
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive();

        jugar.on("pointerdown", () => {
            this.registry.set("playerLives", 3);
            this.registry.set("score", 0);
            this.registry.set("savedNpcs", 0);
            this.registry.set("deaths", 0);
            this.registry.set("remainingLives", 3);
            this.scene.start("Level1Scene");
        });

        comoJugar.on("pointerdown", () => {
            alert("Rescatá a las personas (presione la tecla f para mover a los npcs), evitá a la mancha y los charcos negros de tinta y llegá a la puerta.");
        });

        salir.on("pointerdown", () => {
            window.close();
        });

    }

}