import { Scene } from "phaser";
import { TERRAIN_COLORS, TerrainType } from "../types/map_types";
import { MAP_CONFIG } from "../config/mapConfig";
import { GAME_ASSETS } from "../../../assets/constants";

export class MainScene extends Scene {
    private tileSize: number;
    private mapData!: TerrainType[][]; // Add ! for definite assignment
    private isDragging: boolean = false;

    constructor() {
        super({ key: "MainScene" });
        this.tileSize = MAP_CONFIG.tileSize;
    }

    preload() {
        //this.load.image("grass", GAME_ASSETS.SPRITES.TERRAIN.GRASS);
        // this.load.image("tree_sticks", GAME_ASSETS.SPRITES.TERRAIN.TREE_STICKS);
        // this.load.image(
        //     "tree_residue",
        //     GAME_ASSETS.SPRITES.TERRAIN.TREE_RESIDUE
        // );
        // this.load.image("stone", GAME_ASSETS.SPRITES.TERRAIN.STONE);
    }

    create() {
        // Initialize map data
        this.generateTemporaryMap();

        // Setup camera controls
        const camera = this.cameras.main;
        camera.setZoom(1);
        camera.setBounds(
            0,
            0,
            MAP_CONFIG.width * this.tileSize,
            MAP_CONFIG.height * this.tileSize
        );

        // Enable drag scroll with improved handling
        this.input.on("pointerdown", () => {
            this.isDragging = true;
        });

        this.input.on("pointerup", () => {
            this.isDragging = false;
        });

        this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
            if (this.isDragging && pointer.isDown) {
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
                camera.setZoom(
                    Phaser.Math.Clamp(
                        newZoom,
                        MAP_CONFIG.minZoom,
                        MAP_CONFIG.maxZoom
                    )
                );
            }
        );

        this.renderMap();
    }

    private generateTemporaryMap() {
        // Initialize map with all grass
        this.mapData = Array(MAP_CONFIG.height)
            .fill(null)
            .map(() => Array(MAP_CONFIG.width).fill(TerrainType.GRASS));

        // Calculate center area coordinates (10x10)
        const centerStart = {
            x: Math.floor(MAP_CONFIG.width / 2) - 5, // Changed from 3 to 5
            y: Math.floor(MAP_CONFIG.height / 2) - 5, // Changed from 3 to 5
        };

        // Generate random obstacles in center area (3-7 obstacles)
        const obstacleCount = Phaser.Math.Between(3, 7);
        const centerPositions = [];

        // Generate all possible positions in 10x10 area (changed from 6x6)
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 10; x++) {
                centerPositions.push({
                    x: centerStart.x + x,
                    y: centerStart.y + y,
                });
            }
        }

        // Randomly place obstacles
        Phaser.Utils.Array.Shuffle(centerPositions);
        for (let i = 0; i < obstacleCount; i++) {
            const pos = centerPositions[i];
            const random = Math.random();
            if (random < 0.4) {
                this.mapData[pos.y][pos.x] = TerrainType.TREE_STICKS;
            } else if (random < 0.7) {
                this.mapData[pos.y][pos.x] = TerrainType.TREE_RESIDUE;
            } else {
                this.mapData[pos.y][pos.x] = TerrainType.STONE;
            }
        }

        // Fill rest of map with random terrain (outside center)
        for (let y = 0; y < MAP_CONFIG.height; y++) {
            for (let x = 0; x < MAP_CONFIG.width; x++) {
                // Skip center area (10x10)
                if (
                    y >= centerStart.y &&
                    y < centerStart.y + 10 &&
                    x >= centerStart.x &&
                    x < centerStart.x + 10
                ) {
                    continue;
                }

                const random = Math.random();
                if (random < 0.65) continue; // Keep grass
                if (random < 0.8) this.mapData[y][x] = TerrainType.TREE_STICKS;
                else if (random < 0.925)
                    this.mapData[y][x] = TerrainType.TREE_RESIDUE;
                else this.mapData[y][x] = TerrainType.STONE;
            }
        }
    }

    private renderMap() {
        const centerStart = {
            x: Math.floor(MAP_CONFIG.width / 2) - 5,
            y: Math.floor(MAP_CONFIG.height / 2) - 5,
        };

        for (let y = 0; y < MAP_CONFIG.height; y++) {
            for (let x = 0; x < MAP_CONFIG.width; x++) {
                const terrainType = this.mapData[y][x];

                // Create base tile rectangle
                const rect = this.add.rectangle(
                    x * this.tileSize,
                    y * this.tileSize,
                    this.tileSize,
                    this.tileSize,
                    TERRAIN_COLORS[terrainType]
                );

                // Add center area overlay
                if (
                    y >= centerStart.y &&
                    y < centerStart.y + 10 &&
                    x >= centerStart.x &&
                    x < centerStart.x + 10
                ) {
                    const centerOverlay = this.add.rectangle(
                        x * this.tileSize,
                        y * this.tileSize,
                        this.tileSize,
                        this.tileSize,
                        TERRAIN_COLORS.CENTER_AREA
                    );
                    centerOverlay.setAlpha(0.5);
                    centerOverlay.setOrigin(0, 0);
                }

                // Add grid lines
                rect.setStrokeStyle(1, 0x000000, 0.2);
                rect.setOrigin(0, 0);

                // Make interactive
                rect.setInteractive();
                rect.on("pointerdown", () => {
                    if (!this.isDragging) {
                        this.handleTileClick(x, y);
                    }
                });
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
