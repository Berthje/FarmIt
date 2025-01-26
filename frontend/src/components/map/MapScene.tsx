import { Scene } from "phaser";
import { GAME_ASSETS } from "../../assets/constants";

const MAP_SIZE = 100;
const TILE_SIZE = 32;
const TOTAL_SIZE = MAP_SIZE * TILE_SIZE;

export class MapScene extends Scene {
    private map!: Phaser.Tilemaps.Tilemap;
    private grassLayer!: Phaser.Tilemaps.TilemapLayer;
    private treeSticksLayer!: Phaser.Tilemaps.TilemapLayer;
    private treeResidueLayer!: Phaser.Tilemaps.TilemapLayer;
    private stoneLayer!: Phaser.Tilemaps.TilemapLayer;
    private lockedOverlay!: Phaser.GameObjects.Graphics;
    private hoverGraphics!: Phaser.GameObjects.Graphics;
    private hoveredTile: { x: number; y: number } | null = null;

    constructor() {
        super({ key: "MapScene" });
    }

    private setupDragControls(): void {
        let isDragging = false;
        let lastX = 0;
        let lastY = 0;

        this.game.canvas.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        });

        this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
            if (pointer.rightButtonDown()) {
                isDragging = true;
                lastX = pointer.x;
                lastY = pointer.y;
            } else if (pointer.leftButtonDown()) {
                const worldPoint = this.cameras.main.getWorldPoint(
                    pointer.x,
                    pointer.y
                );
                const tileX = Math.floor(worldPoint.x / TILE_SIZE);
                const tileY = Math.floor(worldPoint.y / TILE_SIZE);

                console.log(`Clicked tile at: x=${tileX}, y=${tileY}`);
                this.events.emit("tileClicked", { x: tileX, y: tileY });
            }
        });

        this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
            if (!isDragging) {
                const worldPoint = this.cameras.main.getWorldPoint(
                    pointer.x,
                    pointer.y
                );
                const tileX = Math.floor(worldPoint.x / TILE_SIZE);
                const tileY = Math.floor(worldPoint.y / TILE_SIZE);

                if (
                    !this.hoveredTile ||
                    this.hoveredTile.x !== tileX ||
                    this.hoveredTile.y !== tileY
                ) {
                    this.hoveredTile = { x: tileX, y: tileY };
                    this.drawHoverBorder();
                }
            } else {
                const deltaX = pointer.x - lastX;
                const deltaY = pointer.y - lastY;

                this.cameras.main.scrollX -= deltaX / this.cameras.main.zoom;
                this.cameras.main.scrollY -= deltaY / this.cameras.main.zoom;

                lastX = pointer.x;
                lastY = pointer.y;
            }
        });

        this.input.on("pointerup", () => {
            isDragging = false;
        });

        this.input.on("pointerout", () => {
            this.hoveredTile = null;
            this.hoverGraphics.clear();
        });
    }

    private setupZoomControls(): void {
        const MIN_ZOOM = 1;
        const MAX_ZOOM = 2;
        const ZOOM_SPEED = 0.2;

        this.input.on(
            "wheel",
            (
                pointer: Phaser.Input.Pointer,
                gameObjects: any[],
                deltaX: number,
                deltaY: number
            ) => {
                // Get world position of pointer before zoom
                const worldPoint = this.cameras.main.getWorldPoint(
                    pointer.x,
                    pointer.y
                );

                // Calculate new zoom
                const zoomDelta = deltaY > 0 ? -ZOOM_SPEED : ZOOM_SPEED;
                const newZoom = this.cameras.main.zoom + zoomDelta;
                const clampedZoom = Phaser.Math.Clamp(
                    newZoom,
                    MIN_ZOOM,
                    MAX_ZOOM
                );

                // Apply zoom
                this.cameras.main.zoom = clampedZoom;

                // Get new world position after zoom
                const newWorldPoint = this.cameras.main.getWorldPoint(
                    pointer.x,
                    pointer.y
                );

                // Adjust camera to maintain pointer position
                this.cameras.main.scrollX += worldPoint.x - newWorldPoint.x;
                this.cameras.main.scrollY += worldPoint.y - newWorldPoint.y;
            }
        );
    }

    private drawHoverBorder(): void {
        this.hoverGraphics.clear();

        if (this.hoveredTile) {
            const CORNER_LENGTH = 10;
            const LINE_THICKNESS = 1;
            const PADDING = 1;

            const { x, y } = this.hoveredTile;
            const startX = x * TILE_SIZE;
            const startY = y * TILE_SIZE;
            const endX = startX + TILE_SIZE;
            const endY = startY + TILE_SIZE;

            // Set line style (white with yellow stroke for better visibility)
            this.hoverGraphics.lineStyle(LINE_THICKNESS + 2, 0x000000, 0.5);
            this.drawCorners(
                startX,
                startY,
                endX,
                endY,
                CORNER_LENGTH,
                PADDING
            );
            this.hoverGraphics.lineStyle(LINE_THICKNESS, 0xffff00, 1);
            this.drawCorners(
                startX,
                startY,
                endX,
                endY,
                CORNER_LENGTH,
                PADDING
            );
        }
    }

    private drawCorners(
        startX: number,
        startY: number,
        endX: number,
        endY: number,
        cornerLength: number,
        padding: number
    ): void {
        // Top Left
        this.hoverGraphics.beginPath();
        this.hoverGraphics.moveTo(
            startX + padding,
            startY + cornerLength + padding
        );
        this.hoverGraphics.lineTo(startX + padding, startY + padding);
        this.hoverGraphics.lineTo(
            startX + cornerLength + padding,
            startY + padding
        );
        this.hoverGraphics.strokePath();

        // Top Right
        this.hoverGraphics.beginPath();
        this.hoverGraphics.moveTo(
            endX - cornerLength - padding,
            startY + padding
        );
        this.hoverGraphics.lineTo(endX - padding, startY + padding);
        this.hoverGraphics.lineTo(
            endX - padding,
            startY + cornerLength + padding
        );
        this.hoverGraphics.strokePath();

        // Bottom Left
        this.hoverGraphics.beginPath();
        this.hoverGraphics.moveTo(
            startX + padding,
            endY - cornerLength - padding
        );
        this.hoverGraphics.lineTo(startX + padding, endY - padding);
        this.hoverGraphics.lineTo(
            startX + cornerLength + padding,
            endY - padding
        );
        this.hoverGraphics.strokePath();

        // Bottom Right
        this.hoverGraphics.beginPath();
        this.hoverGraphics.moveTo(
            endX - cornerLength - padding,
            endY - padding
        );
        this.hoverGraphics.lineTo(endX - padding, endY - padding);
        this.hoverGraphics.lineTo(
            endX - padding,
            endY - cornerLength - padding
        );
        this.hoverGraphics.strokePath();
    }

    preload(): void {
        this.load.image("grassTile", GAME_ASSETS.SPRITES.TERRAIN.GRASS);
        this.load.image(
            "treeSticksTile",
            GAME_ASSETS.SPRITES.TERRAIN.TREE_STICKS
        );
        this.load.image(
            "treeResidueTile",
            GAME_ASSETS.SPRITES.TERRAIN.TREE_RESIDUE
        );
        this.load.image("stoneTile", GAME_ASSETS.SPRITES.TERRAIN.STONE);
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
        const treeResidueSet = this.map.addTilesetImage("treeResidueTile");
        const stoneSet = this.map.addTilesetImage("stoneTile");

        if (!grassTileset || !treeSticksSet || !treeResidueSet || !stoneSet) {
            console.error("Failed to create tilesets");
            return;
        }

        // Create separate layers
        this.grassLayer = this.map.createBlankLayer("ground", grassTileset)!;
        this.treeSticksLayer = this.map.createBlankLayer(
            "treeSticks",
            treeSticksSet
        )!;
        this.treeResidueLayer = this.map.createBlankLayer(
            "treeResidue",
            treeResidueSet
        )!;
        this.stoneLayer = this.map.createBlankLayer("stone", stoneSet)!;

        // Fill grass layer completely
        this.grassLayer.fill(0);

        this.lockedOverlay = this.add.graphics();
        this.lockedOverlay.setDepth(100);

        // Add tree sticks randomly
        for (let x = 0; x < MAP_SIZE; x++) {
            for (let y = 0; y < MAP_SIZE; y++) {
                const isStartingArea = x >= 45 && x <= 54 && y >= 45 && y <= 54;
                const random = Math.random();

                if (!isStartingArea) {
                    if (random > 0.925) {
                        this.stoneLayer.putTileAt(0, x, y);
                    } else if (random > 0.8) {
                        this.treeResidueLayer.putTileAt(0, x, y);
                    } else if (random > 0.65) {
                        this.treeSticksLayer.putTileAt(0, x, y);
                    }
                }

                // Add dark overlay for locked tiles
                if (!isStartingArea) {
                    this.lockedOverlay.fillStyle(0x000000, 0.5);
                    this.lockedOverlay.fillRect(
                        x * TILE_SIZE,
                        y * TILE_SIZE,
                        TILE_SIZE,
                        TILE_SIZE
                    );
                }
            }
        }

        this.grassLayer.setDepth(0);
        this.treeSticksLayer.setDepth(1);
        this.treeResidueLayer.setDepth(1);
        this.stoneLayer.setDepth(1);
        this.lockedOverlay.setDepth(100);

        this.hoverGraphics = this.add.graphics();

        // Setup camera
        this.cameras.main.setBounds(0, 0, TOTAL_SIZE, TOTAL_SIZE);
        this.cameras.main.centerOn(TOTAL_SIZE / 2, TOTAL_SIZE / 2);

        this.setupDragControls();
        this.setupZoomControls();
    }
}
