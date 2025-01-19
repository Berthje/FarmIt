import React from "react";

interface XPBarProps {
    current: number;
    max: number;
}

export const XPBar: React.FC<XPBarProps> = ({ current, max }) => {
    const percentage = (current / max) * 100;

    return (
        <div className="relative w-48">
            <div className="h-4 bg-green-800/90 rounded-full border border-green-600">
                <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <span className="absolute inset-0 flex items-center justify-center text-xs text-white">
                {current}/{max} XP
            </span>
        </div>
    );
};
