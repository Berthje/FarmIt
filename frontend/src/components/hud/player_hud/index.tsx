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
                <div className="flex items-center">
                    <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-green-700 border-2 border-yellow-400 flex items-center justify-center z-10">
                            <span className="text-yellow-400 font-bold">
                                {level}
                            </span>
                        </div>
                        <div className="h-8 bg-green-700 border-2 border-l-0 border-yellow-400 flex items-center px-4 -ml-2 rounded-r-full">
                            <span className="text-yellow-400">{username}</span>
                        </div>
                    </div>
                </div>
                <XPBar current={xp} max={maxXp} />
                <CoinDisplay amount={coins} />
            </div>
        </div>
    );
};
