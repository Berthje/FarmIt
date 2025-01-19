import React, { useState } from "react";
import { GAME_ASSETS } from "../../../assets/constants";
import { VolumeSlider } from "./VolumeSlider";

interface SettingsModalProps {
    onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
    const [musicVolume, setMusicVolume] = useState(80);
    const [sfxVolume, setSfxVolume] = useState(100);

    return (
        <div className="fixed inset-0 z-50" onClick={onClose}>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 bg-green-800 p-6 rounded-xl border-2 border-yellow-400 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-yellow-400">
                        Settings
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-green-700 rounded-full transition-colors"
                    >
                        <img
                            src={GAME_ASSETS.ICONS.UI.CLOSE}
                            alt="Close"
                            className="w-6 h-6"
                        />
                    </button>
                </div>

                <div className="space-y-6">
                    <VolumeSlider
                        label="Music Volume"
                        value={musicVolume}
                        onChange={setMusicVolume}
                        icon="music"
                    />
                    <VolumeSlider
                        label="Sound Effects"
                        value={sfxVolume}
                        onChange={setSfxVolume}
                        icon="sfx"
                    />
                </div>
            </div>
        </div>
    );
};
