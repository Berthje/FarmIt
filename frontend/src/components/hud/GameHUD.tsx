import React from "react";
import { PlayerHUD } from "./player_hud/index";
import { SettingsHUD } from "./settings_hud/index";
import { InventoryHUD } from "./inventory_hud";
import { GAME_ASSETS } from "../../assets/constants";

interface GameHUDProps {
    playerData: {
        username: string;
        level: number;
        xp: number;
        maxXp: number;
        coins: number;
    };
}

export const GameHUD: React.FC<GameHUDProps> = ({ playerData }) => {
    const inventoryItems = [
        { id: 1, icon: GAME_ASSETS.SPRITES.VEGETABLES.CARROT, quantity: 64 },
        { id: 2, icon: GAME_ASSETS.SPRITES.VEGETABLES.POTATO, quantity: 32 },
        { id: 3, icon: GAME_ASSETS.SPRITES.VEGETABLES.TURNIP, quantity: 16 },
        { id: 4, icon: GAME_ASSETS.SPRITES.VEGETABLES.GARLIC, quantity: 8 },
        { id: 5, icon: GAME_ASSETS.SPRITES.VEGETABLES.ONION, quantity: 4 },
        { id: 6, icon: GAME_ASSETS.SPRITES.VEGETABLES.PARSNIP, quantity: 2 },
    ];

    return (
        <div className="fixed inset-0 pointer-events-none">
            <div className="relative w-full h-full">
                <PlayerHUD playerData={playerData} />
                <SettingsHUD />
                <InventoryHUD items={inventoryItems} />
            </div>
        </div>
    );
};
