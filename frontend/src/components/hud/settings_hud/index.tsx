import React, { useState } from "react";
import { GAME_ASSETS } from "../../../assets/constants";
import { SettingsModal } from "./SettingsModal";

export const SettingsHUD: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="fixed top-4 right-4 pointer-events-auto">
            <button
                onClick={() => setIsModalOpen(true)}
                className="w-10 h-10 rounded-full bg-green-800/90 border border-green-600 hover:bg-green-700/90 transition-colors"
            >
                <span className="sr-only">Settings</span>
                <img
                    src={GAME_ASSETS.ICONS.UI.SETTINGS}
                    alt="Settings"
                    className="w-6 h-6 m-auto"
                />
            </button>

            {isModalOpen && (
                <SettingsModal onClose={() => setIsModalOpen(false)} />
            )}
        </div>
    );
};
