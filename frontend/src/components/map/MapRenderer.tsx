import React, { useEffect } from "react";
import Phaser from "phaser";
import { MainScene } from "./scenes/MainScene";

export const MapRenderer: React.FC = () => {
    useEffect(() => {
        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            parent: "game-container",
            width: window.innerWidth,
            height: window.innerHeight,
            scene: MainScene,
            physics: {
                default: "arcade",
                arcade: {
                    debug: false,
                },
            },
            scale: {
                mode: Phaser.Scale.RESIZE,
                autoCenter: Phaser.Scale.CENTER_BOTH,
            },
        };

        const game = new Phaser.Game(config);

        return () => {
            game.destroy(true);
        };
    }, []);

    return <div id="game-container" />;
};
