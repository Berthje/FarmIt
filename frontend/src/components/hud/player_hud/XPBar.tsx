import React from "react";

interface XPBarProps {
    current: number;
    max: number;
}

export const XPBar: React.FC<XPBarProps> = ({ current, max }) => {
    const percentage = (current / max) * 100;

    return (
        <div className="relative w-48">
            <div className="h-8 bg-green-700 rounded-full border-2 border-yellow-400 overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-300 relative"
                    style={{ width: `${percentage}%` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                    <div className="absolute inset-0 bg-green-400/20 blur-sm" />
                </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-yellow-400 drop-shadow-lg">
                    {current.toLocaleString()}/{max.toLocaleString()} XP
                </span>
            </div>
        </div>
    );
};