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

    const handleSlotRightClick = (e: React.MouseEvent, index: number) => {
        e.preventDefault();

        if (toolbarItems[index]) {
            const newToolbar = [...toolbarItems];
            newToolbar[index] = null;
            setToolbarItems(newToolbar);
        }
    };

    const handleToolbarDragStart = (
        e: React.DragEvent,
        item: any,
        index: number
    ) => {
        if (!item) return;

        const dragImage = document.createElement("div");
        dragImage.className =
            "w-14 h-14 bg-green-800 rounded-lg border-2 border-yellow-400 opacity-70 fixed -left-[9999px] flex items-center justify-center";
        const icon = document.createElement("img");
        icon.src = item.icon;
        icon.className = "w-10 h-10";
        dragImage.appendChild(icon);
        document.body.appendChild(dragImage);

        e.dataTransfer.setDragImage(dragImage, 28, 28);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData(
            "text/plain",
            JSON.stringify({ ...item, fromSlot: index })
        );

        // Cleanup
        setTimeout(() => document.body.removeChild(dragImage), 0);
    };

    const isItemInToolbar = (itemId: number): boolean => {
        return toolbarItems.some((item) => item?.id === itemId);
    };

    const handleDrop = (e: React.DragEvent, slotIndex: number) => {
        e.preventDefault();
        const itemData = JSON.parse(e.dataTransfer.getData("text/plain"));
        const newToolbar = [...toolbarItems];

        if (itemData.fromSlot !== undefined) {
            const temp = newToolbar[slotIndex];
            newToolbar[slotIndex] = itemData;
            newToolbar[itemData.fromSlot] = temp;
            delete newToolbar[slotIndex].fromSlot;
        } else {
            const existingSlotIndex = toolbarItems.findIndex(
                (item) => item?.id === itemData.id
            );

            // If item exists in toolbar, move it to new slot
            if (existingSlotIndex !== -1) {
                const temp = newToolbar[slotIndex];
                newToolbar[slotIndex] = newToolbar[existingSlotIndex];
                newToolbar[existingSlotIndex] = temp;
            }
            // If item doesn't exist in toolbar, add it to new slot
            else {
                newToolbar[slotIndex] = itemData;
            }
        }

        setToolbarItems(newToolbar);
    };

    const handleDragOver = (e: React.DragEvent, slotIndex: number) => {
        e.preventDefault();
        try {
            const itemData = JSON.parse(e.dataTransfer.getData("text/plain"));
            // Set visual feedback for valid/invalid drops
            e.dataTransfer.dropEffect =
                isItemInToolbar(itemData.id) && itemData.fromSlot === undefined
                    ? "none"
                    : "move";
        } catch {
            e.dataTransfer.dropEffect = "move";
        }
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
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDrop={(e) => handleDrop(e, index)}
                            onContextMenu={(e) =>
                                handleSlotRightClick(e, index)
                            }
                            className={`
                                cursor-grab active:cursor-grabbing
                                group relative
                                ${item ? 'hover:after:content-["Right-click_to_remove"] hover:after:absolute hover:after:-top-8 hover:after:left-1/2 hover:after:-translate-x-1/2 hover:after:bg-green-900 hover:after:text-yellow-400 hover:after:px-2 hover:after:py-1 hover:after:rounded hover:after:text-xs hover:after:whitespace-nowrap hover:after:border hover:after:border-green-700' : ""}
                            `}
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
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
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
