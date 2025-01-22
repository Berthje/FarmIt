import { Scene } from "phaser";

const MAP_SIZE = 100;
const TILE_SIZE = 32;
const TOTAL_SIZE = MAP_SIZE * TILE_SIZE;
const MIN_ZOOM = 1;
const MAX_ZOOM = 2;
const ZOOM_SPEED = 0.2;

export class MapScene extends Scene {
    private isDragging: boolean = false;
    private dragStartX: number = 0;
    private dragStartY: number = 0;
    private map!: Phaser.Tilemaps.Tilemap;
    private layer!: Phaser.Tilemaps.TilemapLayer;

    constructor() {
        super({ key: "MapScene" });
    }

    private createGrassTexture(): void {
        const graphics = this.add.graphics();
        graphics.fillStyle(0x4caf50);
        graphics.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
        graphics.lineStyle(1, 0x45a045);
        graphics.strokeRect(0, 0, TILE_SIZE, TILE_SIZE);
        graphics.generateTexture("grassTile", TILE_SIZE, TILE_SIZE);
        graphics.destroy();
    }

    private setupDragControls(): void {
        this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            this.isDragging = true;
            this.dragStartX = pointer.x + this.cameras.main.scrollX;
            this.dragStartY = pointer.y + this.cameras.main.scrollY;
        });

        this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
            if (!this.isDragging) return;

            const dragSpeed = 1 / this.cameras.main.zoom; // Adjust drag speed based on zoom
            const newX = this.dragStartX - pointer.x * dragSpeed;
            const newY = this.dragStartY - pointer.y * dragSpeed;

            this.cameras.main.scrollX = Phaser.Math.Clamp(
                newX,
                0,
                TOTAL_SIZE - this.cameras.main.width / this.cameras.main.zoom
            );
            this.cameras.main.scrollY = Phaser.Math.Clamp(
                newY,
                0,
                TOTAL_SIZE - this.cameras.main.height / this.cameras.main.zoom
            );
        });

        this.input.on("pointerup", () => {
            this.isDragging = false;
        });
    }

    private setupZoomControls(): void {
        this.input.on(
            "wheel",
            (
                pointer: Phaser.Input.Pointer,
                gameObjects: any,
                deltaX: number,
                deltaY: number
            ) => {
                // Get current zoom
                const currentZoom = this.cameras.main.zoom;

                // Calculate new zoom
                const newZoom = currentZoom - (deltaY * ZOOM_SPEED) / 100;

                // Clamp zoom between min and max values
                const clampedZoom = Phaser.Math.Clamp(
                    newZoom,
                    MIN_ZOOM,
                    MAX_ZOOM
                );

                // Get pointer position in world space before zoom
                const worldPoint = this.cameras.main.getWorldPoint(
                    pointer.x,
                    pointer.y
                );

                // Set new zoom
                this.cameras.main.zoom = clampedZoom;

                // Update camera position to zoom towards cursor
                const newWorldPoint = this.cameras.main.getWorldPoint(
                    pointer.x,
                    pointer.y
                );

                this.cameras.main.scrollX += worldPoint.x - newWorldPoint.x;
                this.cameras.main.scrollY += worldPoint.y - newWorldPoint.y;
            }
        );
    }

    create(): void {
        this.createGrassTexture();

        // Initialize tilemap
        this.map = this.make.tilemap({
            tileWidth: TILE_SIZE,
            tileHeight: TILE_SIZE,
            width: MAP_SIZE,
            height: MAP_SIZE,
        });

        // Create and add tileset
        const tileset = this.map.addTilesetImage("grassTile");
        if (!tileset) {
            console.error("Failed to create tileset");
            return;
        }

        // Create layer and fill with grass
        const layer = this.map.createBlankLayer("ground", tileset);
        if (!layer) {
            console.error("Failed to create layer");
            return;
        }
        this.layer = layer;
        this.layer.fill(0);

        // Setup camera
        this.cameras.main.setBounds(0, 0, TOTAL_SIZE, TOTAL_SIZE);
        this.cameras.main.centerOn(TOTAL_SIZE / 2, TOTAL_SIZE / 2);

        this.setupDragControls();
        this.setupZoomControls();
    }
}
