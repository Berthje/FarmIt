import { Scene } from "phaser";
import { TerrainType } from "../types/map_types";

export class MainScene extends Scene {
    private tileSize: number;
    private mapData: TerrainType[][];

    constructor() {
        super({ key: "MainScene" });
        this.tileSize = 32;
    }

    preload() {
        // Temporary textures - replace with your own assets
        this.load.image("grass", "/assets/tiles/grass.png");
        this.load.image("tree_sticks", "/assets/tiles/tree_sticks.png");
        this.load.image("tree_residue", "/assets/tiles/tree_residue.png");
        this.load.image("stone", "/assets/tiles/stone.png");
    }

    create() {
        // Generate temporary 100x100 map data
        this.generateTemporaryMap();

        // Setup camera controls
        const camera = this.cameras.main;
        camera.setZoom(1);
        camera.setBounds(0, 0, 100 * this.tileSize, 100 * this.tileSize);

        // Enable drag scroll
        this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
            if (pointer.isDown) {
                camera.scrollX -=
                    (pointer.x - pointer.prevPosition.x) / camera.zoom;
                camera.scrollY -=
                    (pointer.y - pointer.prevPosition.y) / camera.zoom;
            }
        });

        // Enable zoom with mouse wheel
        this.input.on(
            "wheel",
            (
                pointer: any,
                gameObjects: any,
                deltaX: number,
                deltaY: number
            ) => {
                const newZoom = camera.zoom - deltaY * 0.001;
                camera.setZoom(Phaser.Math.Clamp(newZoom, 0.5, 2));
            }
        );

        this.renderMap();
    }

    private generateTemporaryMap() {
        this.mapData = Array(100)
            .fill(null)
            .map(() =>
                Array(100)
                    .fill(null)
                    .map(() => {
                        const rand = Math.random();
                        if (rand < 0.65) return TerrainType.GRASS;
                        if (rand < 0.8) return TerrainType.TREE_STICKS;
                        if (rand < 0.925) return TerrainType.TREE_RESIDUE;
                        return TerrainType.STONE;
                    })
            );
    }

    private renderMap() {
        for (let y = 0; y < 100; y++) {
            for (let x = 0; x < 100; x++) {
                const terrainType = this.mapData[y][x];
                this.add
                    .image(
                        x * this.tileSize + this.tileSize / 2,
                        y * this.tileSize + this.tileSize / 2,
                        terrainType
                    )
                    .setInteractive();
            }
        }
    }
}
