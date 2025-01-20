import React, { useState } from "react";
import { InventorySlot } from "./InventorySlot";
import { InventoryPanel } from "./InventoryPanel";
import { GAME_ASSETS } from "../../../assets/constants";

interface InventoryHUDProps {
    items: Array<{
        id: number;
        icon: string;
        quantity?: number;
        category?: "seeds" | "tools" | "crops" | "materials";
        name?: string;
    }>;
}

export const InventoryHUD: React.FC<InventoryHUDProps> = ({ items }) => {
    const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
    const [isInventoryOpen, setIsInventoryOpen] = useState(false);
    const slots = Array(9)
        .fill(null)
        .map((_, index) => items[index] || null);

    return (
        <>
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto flex items-end gap-2">
                {/* Backpack Button */}
                <button
                    onClick={() => setIsInventoryOpen(true)}
                    className="w-14 h-14 bg-green-800/90 rounded-xl border-2 border-yellow-400 hover:bg-green-700/90 transition-all hover:scale-105 flex items-center justify-center"
                >
                    <img
                        src={GAME_ASSETS.ICONS.UI.INVENTORY}
                        alt="Inventory"
                        className="w-8 h-8"
                    />
                </button>

                {/* Hotbar */}
                <div className="flex gap-2 p-3 bg-green-900/90 rounded-xl border-2 border-yellow-400 shadow-lg">
                    {slots.map((item, index) => (
                        <InventorySlot
                            key={index}
                            item={item}
                            isSelected={item?.id === selectedSlot}
                            onClick={() => item && setSelectedSlot(item.id === selectedSlot ? null : item.id)}
                            isEmpty={!item}
                        />
                    ))}
                </div>
            </div>

            {isInventoryOpen && (
                <InventoryPanel
                    onClose={() => setIsInventoryOpen(false)}
                    items={items}
                />
            )}
        </>
    );
};
