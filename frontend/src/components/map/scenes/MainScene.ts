import Phaser from "phaser";
import { MAP_CONFIG } from "../config/mapConfig";
import { TERRAIN_COLORS, TerrainType, Tile } from "../types/map_types";
import { GAME_ASSETS } from "../../../assets/constants";

export class MainScene extends Phaser.Scene {
    private mapData: Tile[][] = [];
    private graphics!: Phaser.GameObjects.Graphics;
    private cameraX: number = 0;
    private cameraY: number = 0;
    private isDragging: boolean = false;
    private lastPointerX: number = 0;
    private lastPointerY: number = 0;

    constructor() {
        super({ key: "MainScene" });
    }

    preload() {
        this.load.image("grass", GAME_ASSETS.SPRITES.TERRAIN.GRASS);
        this.load.image("tree_sticks", GAME_ASSETS.SPRITES.TERRAIN.TREE_STICKS);
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

        this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            this.isDragging = true;
            this.lastPointerX = pointer.x;
            this.lastPointerY = pointer.y;
        });

        this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
            if (this.isDragging) {
                const deltaX = pointer.x - this.lastPointerX;
                const deltaY = pointer.y - this.lastPointerY;

                this.cameraX -= deltaX;
                this.cameraY -= deltaY;

                const zoom = this.cameras.main.zoom;
                const maxX = (MAP_CONFIG.width * MAP_CONFIG.tileSize * zoom) -
                    this.cameras.main.width;
                const maxY = (MAP_CONFIG.height * MAP_CONFIG.tileSize * zoom) -
                    this.cameras.main.height;

                this.cameraX = Phaser.Math.Clamp(this.cameraX, 0, maxX);
                this.cameraY = Phaser.Math.Clamp(this.cameraY, 0, maxY);

                this.cameras.main.setScroll(this.cameraX, this.cameraY);

                this.lastPointerX = pointer.x;
                this.lastPointerY = pointer.y;
            }
        });

        this.input.on("pointerup", () => {
            this.isDragging = false;
        });
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
                    terrainType = Math.random() < 0.925
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
        // Clear existing graphics
        this.graphics.clear();

        // First pass: Render base terrain and textures
        for (let y = 0; y < MAP_CONFIG.height; y++) {
            for (let x = 0; x < MAP_CONFIG.width; x++) {
                const tile = this.mapData[y][x];
                const pixelX = x * MAP_CONFIG.tileSize;
                const pixelY = y * MAP_CONFIG.tileSize;

                // Render terrain textures and colors
                if (tile.type === TerrainType.GRASS) {
                    this.add.image(
                        pixelX + MAP_CONFIG.tileSize / 2,
                        pixelY + MAP_CONFIG.tileSize / 2,
                        "grass",
                    ).setDisplaySize(MAP_CONFIG.tileSize, MAP_CONFIG.tileSize);
                } else if (tile.type === TerrainType.TREE_STICKS) {
                    this.add.image(
                        pixelX + MAP_CONFIG.tileSize / 2,
                        pixelY + MAP_CONFIG.tileSize / 2,
                        "tree_sticks",
                    ).setDisplaySize(MAP_CONFIG.tileSize, MAP_CONFIG.tileSize);
                } else {
                    this.graphics.fillStyle(TERRAIN_COLORS[tile.type], 0.6);
                    this.graphics.fillRect(
                        pixelX,
                        pixelY,
                        MAP_CONFIG.tileSize,
                        MAP_CONFIG.tileSize,
                    );
                }
            }
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

        this.cameras.main.setZoom(MAP_CONFIG.zoom);

        // Center on the middle of the map
        const centerX = (MAP_CONFIG.width * MAP_CONFIG.tileSize) / 2;
        const centerY = (MAP_CONFIG.height * MAP_CONFIG.tileSize) / 2;

        // Initialize camera position
        this.cameraX = centerX - (this.cameras.main.width / 2);
        this.cameraY = centerY - (this.cameras.main.height / 2);

        // Set initial scroll position
        this.cameras.main.setScroll(this.cameraX, this.cameraY);
    }
}
