import React from "react";
import { GAME_ASSETS } from "../../../assets/constants";

interface VolumeSliderProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    icon: "music" | "sfx" | "master";
}

export const VolumeSlider: React.FC<VolumeSliderProps> = ({
    label,
    value,
    onChange,
    icon,
}) => {
    const steps = [0, 25, 50, 75, 100];

    return (
        <div className="space-y-3 p-4 bg-green-900/50 rounded-xl border border-green-700/50">
            <div className="flex items-center justify-between text-yellow-400">
                <div className="flex items-center gap-2">
                    <img
                        src={
                            icon === "master"
                                ? GAME_ASSETS.ICONS.UI.MASTER
                                : icon === "music"
                                  ? GAME_ASSETS.ICONS.UI.MUSIC
                                  : GAME_ASSETS.ICONS.UI.SOUND
                        }
                        alt={icon}
                        className="w-5 h-5"
                    />
                    <span className="font-medium">{label}</span>
                </div>
                <span className="text-green-300 font-bold bg-green-800/80 px-2 py-0.5 rounded-md min-w-[3rem] text-center">
                    {value}%
                </span>
            </div>

            <div className="relative">
                {/* Progress Bar */}
                <div className="h-3 bg-green-950 rounded-full shadow-inner">
                    <div
                        className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full transition-all duration-200 shadow-[0_0_10px_rgba(234,179,8,0.3)]"
                        style={{ width: `${value}%` }}
                    />
                </div>

                {/* Step Buttons with Tooltips */}
                <div className="flex justify-between absolute -top-1 w-full">
                    {steps.map((step) => (
                        <button
                            key={step}
                            onClick={() => onChange(step)}
                            className="group relative"
                        >
                            <div
                                className={`
                                w-5 h-5 rounded-full transition-all duration-200
                                transform hover:scale-110 focus:outline-none focus:ring-2
                                focus:ring-yellow-400 focus:ring-opacity-50
                                ${
                                    value >= step
                                        ? "bg-gradient-to-b from-yellow-400 to-yellow-500 shadow-lg shadow-yellow-400/30"
                                        : "bg-green-800 border-2 border-green-700 hover:border-green-600"
                                }
                                hover:-translate-y-0.5 active:translate-y-0
                            `}
                            />

                            {/* Custom Tooltip */}
                            <div
                                className={`
                                absolute -bottom-8 left-1/2 -translate-x-1/2
                                opacity-0 group-hover:opacity-100
                                transition-all duration-200 transform
                                group-hover:-translate-y-1
                                pointer-events-none
                            `}
                            >
                                {/* Tooltip Arrow */}
                                <div
                                    className="
                                    w-0 h-0
                                    border-l-[6px] border-l-transparent
                                    border-r-[6px] border-r-transparent
                                    border-b-[6px] border-b-green-800
                                    mx-auto
                                "
                                />
                                {/* Tooltip Content */}
                                <div
                                    className={`
                                    ${value >= step ? "bg-green-800" : "bg-green-900"}
                                    px-2 py-1 rounded-md
                                    text-xs font-medium
                                    ${value >= step ? "text-yellow-400" : "text-green-400"}
                                    border border-green-700
                                    shadow-lg
                                    whitespace-nowrap
                                `}
                                >
                                    {step}%
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
