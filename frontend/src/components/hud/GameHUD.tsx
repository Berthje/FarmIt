import React from "react";
import { PlayerHUD } from "./player_hud/index";
import { SettingsHUD } from "./settings_hud/index";

interface GameHUDProps {
    playerData: {
        username: string;
        level: number;
        xp: number;
        maxXp: number;
        coins: number;
    };
}

export const GameHUD: React.FC<GameHUDProps> = ({
    playerData,
}) => {
    return (
        <div className="fixed inset-0 pointer-events-none">
            <div className="relative w-full h-full">
                <PlayerHUD playerData={playerData} />
                <SettingsHUD />
            </div>
        </div>
    );
};
