import React, { useState } from "react";
import { GAME_ASSETS } from "../../../assets/constants";

type Category = "seeds" | "tools" | "crops" | "materials";

interface InventoryPanelProps {
    onClose: () => void;
    items: Array<{
        id: number;
        icon: string;
        quantity?: number;
        category?: Category;
        name?: string;
    }>;
}

export const InventoryPanel: React.FC<InventoryPanelProps> = ({
    onClose,
    items,
}) => {
    const [activeCategory, setActiveCategory] = useState<Category>("seeds");

    const categories: { id: Category; label: string; icon: string }[] = [
        { id: "seeds", label: "Seeds", icon: GAME_ASSETS.ICONS.UI.MUSIC },
        { id: "tools", label: "Tools", icon: GAME_ASSETS.ICONS.UI.MUSIC },
        { id: "crops", label: "Crops", icon: GAME_ASSETS.ICONS.UI.MUSIC },
    ];

    const filteredItems = items.filter(
        (item) => item.category === activeCategory
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative bg-green-800 w-[800px] h-[600px] rounded-xl border-2 border-yellow-400 shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b-2 border-green-700">
                    <h2 className="text-2xl font-bold text-yellow-400">
                        Inventory
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-green-700 rounded-full transition-colors"
                    >
                        <img
                            src={GAME_ASSETS.ICONS.UI.CLOSE}
                            alt="Close"
                            className="w-6 h-6"
                        />
                    </button>
                </div>

                {/* Category Tabs */}
                <div className="flex gap-2 p-4 border-b-2 border-green-700">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                                ${
                                    activeCategory === category.id
                                        ? "bg-green-600 text-yellow-400 border-2 border-yellow-400"
                                        : "bg-green-700 text-green-100 hover:bg-green-600"
                                }
                            `}
                        >
                            <img
                                src={category.icon}
                                alt={category.label}
                                className="w-5 h-5"
                            />
                            <span>{category.label}</span>
                        </button>
                    ))}
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-8 gap-2 p-4 h-[calc(100%-140px)] overflow-y-auto">
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            className="relative group bg-green-700 p-2 rounded-lg border-2 border-green-600 hover:border-yellow-400 transition-all hover:scale-105"
                        >
                            <img
                                src={item.icon}
                                alt={item.name ?? "Item"}
                                className="w-full h-auto"
                            />
                            {item.quantity !== undefined && (
                                <div className="absolute bottom-1 right-1 bg-green-900/80 px-1.5 rounded-md">
                                    <span className="text-xs font-bold text-yellow-400">
                                        {item.quantity.toLocaleString()}
                                    </span>
                                </div>
                            )}

                            {/* Tooltip */}
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <div className="bg-green-900 text-yellow-400 px-2 py-1 rounded text-sm whitespace-nowrap border border-green-700">
                                    {item.name ?? "Unknown Item"}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
