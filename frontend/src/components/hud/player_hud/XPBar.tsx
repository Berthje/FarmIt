import React from "react";
import { GAME_ASSETS } from "../../../assets/constants";

interface XPBarProps {
  current: number;
  max: number;
}

export const XPBar: React.FC<XPBarProps> = ({ current, max }) => {
  const percentage = (current / max) * 100;

  return (
    <div className="relative w-48">
      <div className="relative h-8 bg-green-700 rounded-full border-2 border-yellow-400 overflow-hidden flex items-center">
        <div
          className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-white/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(234,179,8,0.2),transparent_70%)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shine_2s_ease-in-out_infinite]" />
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-yellow-400 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] pl-6">
          {current.toLocaleString()}/{max.toLocaleString()} XP
        </span>
      </div>
    </div>
  );
};
