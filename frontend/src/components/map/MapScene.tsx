import { Scene } from "phaser";

const MAP_SIZE = 100;
const TILE_SIZE = 32;
const TOTAL_SIZE = MAP_SIZE * TILE_SIZE;

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
    }

    private setupDragControls(): void {
        this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            this.isDragging = true;
            this.dragStartX = pointer.x + this.cameras.main.scrollX;
            this.dragStartY = pointer.y + this.cameras.main.scrollY;
        });

        this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
            if (!this.isDragging) return;

            const newX = this.dragStartX - pointer.x;
            const newY = this.dragStartY - pointer.y;

            this.cameras.main.scrollX = Phaser.Math.Clamp(
                newX,
                0,
                TOTAL_SIZE - this.cameras.main.width
            );
            this.cameras.main.scrollY = Phaser.Math.Clamp(
                newY,
                0,
                TOTAL_SIZE - this.cameras.main.height
            );
        });

        this.input.on("pointerup", () => {
            this.isDragging = false;
        });
    }
}
