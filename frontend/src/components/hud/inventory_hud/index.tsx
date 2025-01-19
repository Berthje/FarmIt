import React, { useState } from "react";
import { InventorySlot } from "./InventorySlot";

interface InventoryHUDProps {
    items: Array<{
        id: number;
        icon: string;
        quantity?: number;
    }>;
}

export const InventoryHUD: React.FC<InventoryHUDProps> = ({ items }) => {
    const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
    // Create array of 9 slots
    const slots = Array(9)
        .fill(null)
        .map((_, index) => items[index] || null);

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto">
            <div className="flex gap-2 p-3 bg-green-900/90 rounded-xl border-2 border-yellow-400 shadow-lg">
                {slots.map((item, index) => (
                    <InventorySlot
                        key={index}
                        item={item}
                        isSelected={item?.id === selectedSlot}
                        onClick={() =>
                            item &&
                            setSelectedSlot(
                                item.id === selectedSlot ? null : item.id
                            )
                        }
                        isEmpty={!item}
                    />
                ))}
            </div>
        </div>
    );
};
