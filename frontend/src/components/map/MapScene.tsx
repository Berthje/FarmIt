import { Scene } from "phaser";
import { GAME_ASSETS } from "../../assets/constants";

const MAP_SIZE = 100;
const TILE_SIZE = 32;
const TOTAL_SIZE = MAP_SIZE * TILE_SIZE;

export class MapScene extends Scene {
    private isDragging: boolean = false;
    private dragStartX: number = 0;
    private dragStartY: number = 0;
    private map!: Phaser.Tilemaps.Tilemap;
    private grassLayer!: Phaser.Tilemaps.TilemapLayer;
    private treeSticksLayer!: Phaser.Tilemaps.TilemapLayer;

    constructor() {
        super({ key: "MapScene" });
    }

    private setupDragControls(): void {
        let isDragging = false;
        let lastX = 0;
        let lastY = 0;

        this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            isDragging = true;
            lastX = pointer.x;
            lastY = pointer.y;
        });

        this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
            if (!isDragging) return;

            const deltaX = pointer.x - lastX;
            const deltaY = pointer.y - lastY;

            this.cameras.main.scrollX -= deltaX / this.cameras.main.zoom;
            this.cameras.main.scrollY -= deltaY / this.cameras.main.zoom;

            lastX = pointer.x;
            lastY = pointer.y;
        });

        this.input.on("pointerup", () => {
            isDragging = false;
        });
    }

    private setupZoomControls(): void {
        const MIN_ZOOM = 1;
        const MAX_ZOOM = 2;
        const ZOOM_SPEED = 0.2;

        this.input.on("wheel", (deltaY: number) => {
            console.log("Zoom event:", {
                deltaY,
                currentZoom: this.cameras.main.zoom,
            });

            // Calculate new zoom
            const zoomDelta = deltaY > 0 ? -ZOOM_SPEED : ZOOM_SPEED;
            const newZoom = this.cameras.main.zoom + zoomDelta;
            const clampedZoom = Phaser.Math.Clamp(newZoom, MIN_ZOOM, MAX_ZOOM);

            // Get center point before zoom
            const centerX = this.cameras.main.midPoint.x;
            const centerY = this.cameras.main.midPoint.y;
            const worldPoint = this.cameras.main.getWorldPoint(
                centerX,
                centerY
            );

            // Apply zoom
            this.cameras.main.zoom = clampedZoom;

            // Maintain center point
            const newWorldPoint = this.cameras.main.getWorldPoint(
                centerX,
                centerY
            );
            this.cameras.main.scrollX += worldPoint.x - newWorldPoint.x;
            this.cameras.main.scrollY += worldPoint.y - newWorldPoint.y;
        });
    }

    preload(): void {
        this.load.image("grassTile", GAME_ASSETS.SPRITES.TERRAIN.GRASS);
        this.load.image(
            "treeSticksTile",
            GAME_ASSETS.SPRITES.TERRAIN.TREE_STICKS
        );
    }

    create(): void {
        // Initialize tilemap
        this.map = this.make.tilemap({
            tileWidth: TILE_SIZE,
            tileHeight: TILE_SIZE,
            width: MAP_SIZE,
            height: MAP_SIZE,
        });

        const grassTileset = this.map.addTilesetImage("grassTile");
        const treeSticksSet = this.map.addTilesetImage("treeSticksTile");

        if (!grassTileset || !treeSticksSet) {
            console.error("Failed to create tilesets");
            return;
        }

        // Create separate layers
        this.grassLayer = this.map.createBlankLayer("ground", grassTileset)!;
        this.treeSticksLayer = this.map.createBlankLayer(
            "treeSticks",
            treeSticksSet
        )!;

        if (!this.grassLayer || !this.treeSticksLayer) {
            console.error("Failed to create layers");
            return;
        }

        // Fill grass layer completely
        this.grassLayer.fill(0);

        // Add tree sticks randomly
        for (let x = 0; x < MAP_SIZE; x++) {
            for (let y = 0; y < MAP_SIZE; y++) {
                if (Math.random() > 0.85) {
                    this.treeSticksLayer.putTileAt(0, x, y);
                }
            }
        }

        // Setup camera
        this.cameras.main.setBounds(0, 0, TOTAL_SIZE, TOTAL_SIZE);
        this.cameras.main.centerOn(TOTAL_SIZE / 2, TOTAL_SIZE / 2);

        this.setupDragControls();
        this.setupZoomControls();
    }
}
