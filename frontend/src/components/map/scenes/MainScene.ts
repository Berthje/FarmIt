import Phaser from "phaser";
import { MAP_CONFIG } from "../config/mapConfig";
import { TERRAIN_COLORS, TerrainType, Tile } from "../types/map_types";

export class MainScene extends Phaser.Scene {
    private mapData: Tile[][] = [];
    private graphics!: Phaser.GameObjects.Graphics;
    private cameraX: number = 0;
    private cameraY: number = 0;
    private cursors!: {
        up: Phaser.Input.Keyboard.Key;
        left: Phaser.Input.Keyboard.Key;
        down: Phaser.Input.Keyboard.Key;
        right: Phaser.Input.Keyboard.Key;
    };

    constructor() {
        super({ key: "MainScene" });
    }

    create() {
        // Initialize graphics
        this.graphics = this.add.graphics();

        // Generate initial map data
        this.generateMap();

        // Render the map
        this.renderMap();

        // Setup camera
        this.setupCamera();

        this.cursors = this.input.keyboard!.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        }) as {
            up: Phaser.Input.Keyboard.Key;
            left: Phaser.Input.Keyboard.Key;
            down: Phaser.Input.Keyboard.Key;
            right: Phaser.Input.Keyboard.Key;
        };
    }

    private generateMap() {
        for (let y = 0; y < MAP_CONFIG.height; y++) {
            this.mapData[y] = [];
            for (let x = 0; x < MAP_CONFIG.width; x++) {
                // Generate terrain type with probabilities
                let terrainType: TerrainType;
                const random = Math.random();

                if (x >= 45 && x <= 54 && y >= 45 && y <= 54) {
                    // Center 10x10 area - mostly grass with some obstacles
                    terrainType = Math.random() < 0.85
                        ? TerrainType.GRASS
                        : TerrainType.TREE_STICKS;
                } else {
                    // Rest of the map
                    if (random < 0.65) terrainType = TerrainType.GRASS;
                    else if (random < 0.8) {
                        terrainType = TerrainType.TREE_STICKS;
                    } else if (random < 0.925) {
                        terrainType = TerrainType.TREE_RESIDUE;
                    } else terrainType = TerrainType.STONE;
                }

                this.mapData[y][x] = {
                    x,
                    y,
                    type: terrainType,
                    clearTime: MAP_CONFIG.terrainTypes[terrainType].clearTime,
                    clearCost: MAP_CONFIG.terrainTypes[terrainType].clearCost,
                };
            }
        }
    }

    private renderMap() {
        this.graphics.clear();

        // Draw tiles
        for (let y = 0; y < MAP_CONFIG.height; y++) {
            for (let x = 0; x < MAP_CONFIG.width; x++) {
                const tile = this.mapData[y][x];
                const color = TERRAIN_COLORS[tile.type];

                const pixelX = x * MAP_CONFIG.tileSize;
                const pixelY = y * MAP_CONFIG.tileSize;

                // Draw tile
                this.graphics.lineStyle(1, 0x2c5530);
                this.graphics.fillStyle(color);
                this.graphics.fillRect(
                    pixelX,
                    pixelY,
                    MAP_CONFIG.tileSize,
                    MAP_CONFIG.tileSize,
                );
                this.graphics.strokeRect(
                    pixelX,
                    pixelY,
                    MAP_CONFIG.tileSize,
                    MAP_CONFIG.tileSize,
                );

                // Add coordinates
                this.add.text(
                    pixelX + 2,
                    pixelY + 2,
                    `${x},${y}`,
                    {
                        fontSize: "8px",
                        color: "#000000",
                    },
                );
            }
        }

        // Highlight center area
        const centerStartX = 45 * MAP_CONFIG.tileSize;
        const centerStartY = 45 * MAP_CONFIG.tileSize;
        const centerSize = 10 * MAP_CONFIG.tileSize;

        this.graphics.lineStyle(2, TERRAIN_COLORS.CENTER_AREA);
        this.graphics.strokeRect(
            centerStartX,
            centerStartY,
            centerSize,
            centerSize,
        );
    }

    update(time: number, delta: number) {
        const speed = 5;
        let moved = false;

        if (this.cursors.left.isDown) {
            this.cameraX -= speed;
            moved = true;
        }
        if (this.cursors.right.isDown) {
            this.cameraX += speed;
            moved = true;
        }
        if (this.cursors.up.isDown) {
            this.cameraY -= speed;
            moved = true;
        }
        if (this.cursors.down.isDown) {
            this.cameraY += speed;
            moved = true;
        }

        if (moved) {
            // Calculate bounds considering zoom
            const zoom = this.cameras.main.zoom;
            const maxX = (MAP_CONFIG.width * MAP_CONFIG.tileSize * zoom) -
                this.cameras.main.width;
            const maxY = (MAP_CONFIG.height * MAP_CONFIG.tileSize * zoom) -
                this.cameras.main.height;

            // Clamp camera positions within bounds
            this.cameraX = Phaser.Math.Clamp(this.cameraX, 0, maxX);
            this.cameraY = Phaser.Math.Clamp(this.cameraY, 0, maxY);

            // Set new camera position
            this.cameras.main.setScroll(this.cameraX, this.cameraY);
        }
    }

    private setupCamera() {
        // Set world bounds
        this.cameras.main.setBounds(
            0,
            0,
            MAP_CONFIG.width * MAP_CONFIG.tileSize,
            MAP_CONFIG.height * MAP_CONFIG.tileSize,
        );

        // Set initial zoom (between minZoom and maxZoom from MAP_CONFIG)
        this.cameras.main.setZoom(1); // Or any value between MAP_CONFIG.minZoom and maxZoom

        // Center on the middle of the map
        const centerX = (MAP_CONFIG.width * MAP_CONFIG.tileSize) / 2;
        const centerY = (MAP_CONFIG.height * MAP_CONFIG.tileSize) / 2;

        // Initialize camera position
        this.cameraX = centerX - (this.cameras.main.width / 2);
        this.cameraY = centerY - (this.cameras.main.height / 2);

        // Set initial scroll position
        this.cameras.main.setScroll(this.cameraX, this.cameraY);

        // Set background color for debug purposes
        this.cameras.main.setBackgroundColor(0x002244);
    }
}
