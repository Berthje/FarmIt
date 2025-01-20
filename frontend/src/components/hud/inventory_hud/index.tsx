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
    const [isInventoryOpen, setIsInventoryOpen] = useState(false);
    const [toolbarItems, setToolbarItems] = useState<Array<any>>(
        Array(9).fill(null)
    );
    const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

    const handleToolbarDragStart = (
        e: React.DragEvent,
        item: any,
        index: number
    ) => {
        if (!item) return;
        e.dataTransfer.setData(
            "text/plain",
            JSON.stringify({ ...item, fromSlot: index })
        );
    };

    const handleDrop = (e: React.DragEvent, slotIndex: number) => {
        e.preventDefault();
        const itemData = JSON.parse(e.dataTransfer.getData("text/plain"));
        const newToolbar = [...toolbarItems];

        const existingItem = toolbarItems[slotIndex];
        if (existingItem) {
            const oldSlotIndex = toolbarItems.findIndex(
                (item) => item?.id === itemData.id
            );
            if (oldSlotIndex !== -1) {
                newToolbar[oldSlotIndex] = existingItem;
            }
        }

        newToolbar[slotIndex] = itemData;
        setToolbarItems(newToolbar);
    };

    return (
        <>
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto flex items-end gap-2 z-[60]">
                <button
                    onClick={() => setIsInventoryOpen(true)}
                    className="w-14 h-14 bg-green-800/90 rounded-xl border-2 border-yellow-400 hover:bg-green-700/90 transition-all hover:scale-105"
                >
                    <img
                        src={GAME_ASSETS.ICONS.UI.INVENTORY}
                        alt="Inventory"
                        className="w-8 h-8 m-auto"
                    />
                </button>

                <div className="flex gap-2 p-3 bg-green-900/90 rounded-xl border-2 border-yellow-400 shadow-lg">
                    {toolbarItems.map((item, index) => (
                        <div
                            key={index}
                            draggable={!!item}
                            onDragStart={(e) =>
                                handleToolbarDragStart(e, item, index)
                            }
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => handleDrop(e, index)}
                        >
                            <InventorySlot
                                item={item}
                                isSelected={item?.id === selectedSlot}
                                onClick={() =>
                                    item &&
                                    setSelectedSlot(
                                        item.id === selectedSlot
                                            ? null
                                            : item.id
                                    )
                                }
                                isEmpty={!item}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal with lower z-index */}
            {isInventoryOpen && (
                <div className="fixed inset-0 z-50">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    />
                    <InventoryPanel
                        onClose={() => setIsInventoryOpen(false)}
                        items={items}
                        onAddToToolbar={(item) => {
                            const firstEmptySlot = toolbarItems.findIndex(
                                (slot) => !slot
                            );
                            if (firstEmptySlot !== -1) {
                                const newToolbar = [...toolbarItems];
                                newToolbar[firstEmptySlot] = item;
                                setToolbarItems(newToolbar);
                            }
                        }}
                        toolbarItems={toolbarItems}
                    />
                </div>
            )}
        </>
    );
};
