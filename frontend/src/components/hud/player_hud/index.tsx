import React from "react";
import { XPBar } from "./XPBar";
import { CoinDisplay } from "./CoinDisplay";

interface PlayerHUDProps {
    playerData: {
        username: string;
        level: number;
        xp: number;
        maxXp: number;
        coins: number;
    };
}

export const PlayerHUD: React.FC<PlayerHUDProps> = ({ playerData }) => {
    const { username, level, xp, maxXp, coins } = playerData;

    return (
        <div className="fixed top-0 left-0 p-4 pointer-events-auto">
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-green-700 border-2 border-yellow-400 flex items-center justify-center">
                        <span className="text-yellow-400 font-bold">
                            {level}
                        </span>
                    </div>
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-green-800 px-2 py-0.5 rounded-full text-xs text-white">
                        {username}
                    </span>
                </div>
                <XPBar current={xp} max={maxXp} />
                <CoinDisplay amount={coins} />
            </div>
        </div>
    );
};
