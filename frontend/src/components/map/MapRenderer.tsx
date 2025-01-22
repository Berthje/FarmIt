import { Application, Container, Graphics } from "pixi.js";
import React, { useEffect, useRef } from "react";

const TILE_SIZE = 32;
const MAP_SIZE = 100;
const TILE_COLORS = {
    GRASS: 0x67c23a,
    BORDER: 0x000000,
};

const createTileGrid = (container: Container) => {
    for (let y = 0; y < MAP_SIZE; y++) {
        for (let x = 0; x < MAP_SIZE; x++) {
            const graphics = createTile(x, y);
            container.addChild(graphics);
        }
    }
};

const createTile = (x: number, y: number): Graphics => {
    const graphics = new Graphics()
        .fill(TILE_COLORS.GRASS)
        .rect(0, 0, TILE_SIZE, TILE_SIZE)
        .stroke({ color: TILE_COLORS.BORDER, width: 1 });

    graphics.x = x * TILE_SIZE;
    graphics.y = y * TILE_SIZE;

    return graphics;
};

export const MapRenderer = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const appRef = useRef<Application | null>(null);
    const worldContainerRef = useRef<Container | null>(null);

    const centerMap = () => {
        if (worldContainerRef.current) {
            const worldSize = MAP_SIZE * TILE_SIZE;
            worldContainerRef.current.x = (window.innerWidth - worldSize) / 2;
            worldContainerRef.current.y = (window.innerHeight - worldSize) / 2;
        }
    };

    useEffect(() => {
        async function initializeApp() {
            if (!containerRef.current) return;

            const app = new Application();
            await app.init({
                width: window.innerWidth,
                height: window.innerHeight,
                backgroundColor: 0x1099bb,
            });

            const worldContainer = new Container();
            app.stage.addChild(worldContainer);
            worldContainerRef.current = worldContainer;

            createTileGrid(worldContainer);
            centerMap();

            appRef.current = app;
            containerRef.current.appendChild(app.canvas);
        }

        initializeApp();

        return () => {
            if (appRef.current) {
                appRef.current.destroy(true);
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
                touchAction: "none",
            }}
        />
    );
};
