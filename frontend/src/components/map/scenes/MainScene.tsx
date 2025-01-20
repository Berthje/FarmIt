import { Scene } from "phaser";
import { TerrainType } from "../types/map_types";
import { MAP_CONFIG } from "../config/mapConfig";
import { GAME_ASSETS } from "../../../assets/constants";

export class MainScene extends Scene {
    private tileSize: number;
    private mapData!: TerrainType[][];
    private isDragging: boolean = false;
    private lastPointerPosition: { x: number; y: number } = { x: 0, y: 0 };
    private cameraMoveSpeed: number = 8;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super({
            key: "MainScene",
            input: {
                keyboard: true,
            },
        });
        this.tileSize = MAP_CONFIG.tileSize;
    }

    preload() {
        this.load.image("grass", GAME_ASSETS.SPRITES.TERRAIN.GRASS);
        // this.load.image("tree_sticks", GAME_ASSETS.SPRITES.TERRAIN.TREE_STICKS);
        // this.load.image(
        //     "tree_residue",
        //     GAME_ASSETS.SPRITES.TERRAIN.TREE_RESIDUE
        // );
        // this.load.image("stone", GAME_ASSETS.SPRITES.TERRAIN.STONE);
    }

    create() {
        this.generateTemporaryMap();

        // Setup camera
        const camera = this.cameras.main;
        camera.setZoom(1);
        camera.setBounds(
            0,
            0,
            MAP_CONFIG.width * this.tileSize,
            MAP_CONFIG.height * this.tileSize
        );

        // Center camera on middle of map
        camera.centerOn(
            (MAP_CONFIG.width * this.tileSize) / 2,
            (MAP_CONFIG.height * this.tileSize) / 2
        );

        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
            this.input.keyboard.on("keydown-W", () => this.moveCamera("up"));
            this.input.keyboard.on("keydown-S", () => this.moveCamera("down"));
            this.input.keyboard.on("keydown-A", () => this.moveCamera("left"));
            this.input.keyboard.on("keydown-D", () => this.moveCamera("right"));
        }

        // Mouse drag controls
        this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            this.isDragging = true;
            this.lastPointerPosition = { x: pointer.x, y: pointer.y };
        });

        this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
            if (this.isDragging && pointer.isDown) {
                const deltaX = pointer.x - this.lastPointerPosition.x;
                const deltaY = pointer.y - this.lastPointerPosition.y;

                camera.scrollX -= deltaX / camera.zoom;
                camera.scrollY -= deltaY / camera.zoom;

                this.lastPointerPosition = { x: pointer.x, y: pointer.y };
            }
        });

        this.input.on("pointerup", () => {
            this.isDragging = false;
        });

        // Smooth zoom with mouse wheel
        this.input.on(
            "wheel",
            (
                pointer: any,
                gameObjects: any,
                deltaX: number,
                deltaY: number
            ) => {
                const zoomFactor = 0.1;
                const newZoom = Phaser.Math.Clamp(
                    camera.zoom - deltaY * zoomFactor * 0.01,
                    MAP_CONFIG.minZoom,
                    MAP_CONFIG.maxZoom
                );

                // Get pointer world position before zoom
                const worldPoint = pointer.positionToCamera(camera);

                // Apply new zoom
                camera.zoomTo(
                    newZoom,
                    250, // Duration in ms
                    "Sine.easeInOut",
                    true,
                    (
                        _camera: Phaser.Cameras.Scene2D.Camera,
                        progress: number
                    ) => {
                        // Adjust camera position to zoom toward pointer
                        if (progress === 1) {
                            const newWorldPoint =
                                pointer.positionToCamera(camera);
                            camera.scrollX += worldPoint.x - newWorldPoint.x;
                            camera.scrollY += worldPoint.y - newWorldPoint.y;
                        }
                    }
                );
            }
        );

        this.renderMap();
    }

    update() {
        if (this.input.keyboard) {
            if (
                this.cursors.up.isDown ||
                this.input.keyboard.checkDown(this.input.keyboard.addKey("W"))
            ) {
                this.moveCamera("up");
            }
            if (
                this.cursors.down.isDown ||
                this.input.keyboard.checkDown(this.input.keyboard.addKey("S"))
            ) {
                this.moveCamera("down");
            }
            if (
                this.cursors.left.isDown ||
                this.input.keyboard.checkDown(this.input.keyboard.addKey("A"))
            ) {
                this.moveCamera("left");
            }
            if (
                this.cursors.right.isDown ||
                this.input.keyboard.checkDown(this.input.keyboard.addKey("D"))
            ) {
                this.moveCamera("right");
            }
        }
    }

    private moveCamera(direction: "up" | "down" | "left" | "right") {
        const camera = this.cameras.main;

        switch (direction) {
            case "up":
                camera.scrollY -= this.cameraMoveSpeed / camera.zoom;
                break;
            case "down":
                camera.scrollY += this.cameraMoveSpeed / camera.zoom;
                break;
            case "left":
                camera.scrollX -= this.cameraMoveSpeed / camera.zoom;
                break;
            case "right":
                camera.scrollX += this.cameraMoveSpeed / camera.zoom;
                break;
        }
    }

    private generateTemporaryMap() {
        this.mapData = Array(MAP_CONFIG.height)
            .fill(null)
            .map(() =>
                Array(MAP_CONFIG.width)
                    .fill(null)
                    .map(() => {
                        return TerrainType.GRASS;
                    })
            );
    }

    private renderMap() {
        for (let y = 0; y < MAP_CONFIG.height; y++) {
            for (let x = 0; x < MAP_CONFIG.width; x++) {
                const terrainType = this.mapData[y][x];
                const tile = this.add.image(
                    x * this.tileSize + this.tileSize / 2,
                    y * this.tileSize + this.tileSize / 2,
                    terrainType
                );

                tile.setInteractive();
                tile.on("pointerdown", () => this.handleTileClick(x, y));
            }
        }
    }

    private handleTileClick(x: number, y: number) {
        if (this.isDragging) return; // Don't handle clicks while dragging
        const terrainType = this.mapData[y][x];
        console.log(`Clicked tile at (${x}, ${y}) with type: ${terrainType}`);
        // We'll implement clearing mechanics here later
    }
}
