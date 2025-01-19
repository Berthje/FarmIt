import React from "react";
import { GAME_ASSETS } from "../../../assets/constants";

interface CoinDisplayProps {
    amount: number;
}

export const CoinDisplay: React.FC<CoinDisplayProps> = ({ amount }) => (
    <div className="flex items-center bg-green-800/90 px-3 py-1 rounded-full border border-yellow-400">
        <img
            src={GAME_ASSETS.SPRITES.UI.COIN}
            alt="coins"
            className="w-6 h-6 mr-1"
        />
        <span className="text-yellow-400 font-bold">
            {amount.toLocaleString()}
        </span>
    </div>
);
