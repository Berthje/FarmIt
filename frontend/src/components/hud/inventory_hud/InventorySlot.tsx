import React from "react";

interface InventorySlotProps {
  item: {
    id: number;
    icon: string;
    quantity?: number;
  } | null;
  isSelected: boolean;
  onClick: () => void;
  isEmpty: boolean;
}

const formatQuantity = (quantity: number): string => {
  if (quantity >= 1000) {
    return `${(quantity / 1000).toFixed(1)}K`;
  }
  return quantity.toString();
};

export const InventorySlot: React.FC<InventorySlotProps> = ({
  item,
  isSelected,
  onClick,
  isEmpty,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={isEmpty}
      className={`
                w-14 h-14 relative
                ${isEmpty ? "bg-green-800/50" : "bg-green-800"}
                rounded-lg border-2
                ${
        isSelected
          ? "border-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.3)]"
          : isEmpty
          ? "border-green-700/50"
          : "border-green-700 hover:border-green-600"
      }
                transition-all duration-200
                group
                ${isSelected ? "scale-110" : "hover:scale-105"}
            `}
    >
      {item && (
        <>
          <img
            src={item.icon}
            alt="Item"
            className="w-10 h-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
          {item.quantity && (
            <span className="
                            absolute bottom-0.5 right-0.5
                            min-w-[1.5rem] px-1
                            text-xs font-bold text-center
                            bg-green-900/80 rounded-sm
                            text-yellow-400
                        ">
              {formatQuantity(item.quantity)}
            </span>
          )}
          <div
            className={`
                        absolute inset-0 rounded-md
                        bg-yellow-400/10 opacity-0
                        ${isSelected ? "opacity-100" : "group-hover:opacity-50"}
                        transition-opacity duration-200
                    `}
          />
        </>
      )}
    </button>
  );
};
