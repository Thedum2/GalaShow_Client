import React, { useState } from "react";
import { Icon } from "@/components/icons";
import {
    DEFAULT_TIME_OPTIONS,
    ParticipationSelectionProps,
    SelectionTimeProps,
} from "@/types/components";
const ParticipationSelection: React.FC<ParticipationSelectionProps> = ({
    title,
    items,
    className = "",
}: ParticipationSelectionProps) => {
    const [selectedItems, setSelectedItems] = useState<
        { id: string; name: string; avatarUrl: string; bgColor: string }[]
    >([]);

    const handleSelectItem = (itemId: string) => {
        setSelectedItems((prev) => {
            const isAlreadySelected = prev.some((item) => item.id === itemId);
            
            if (isAlreadySelected) {
                return prev.filter((item) => item.id !== itemId);
            } else {
                const item = items.find((item) => item.id === itemId);
                return [
                    ...prev,
                    {
                        id: itemId,
                        name: item?.name ?? "",
                        avatarUrl: item?.avatarUrl ?? "",
                        bgColor: item?.bgColor ?? "",
                    },
                ];
            }
        });
    };

    return (
        <div
            className={`bg-black bg-opacity-25 border-2 border-yellow-500 rounded-xl h-full min-h-0 p-4 flex flex-col  gap-4 shadow-[0_0_15px_rgba(234,179,8,0.3)] overflow-hidden ${className}`}
        >
            <div className="flex items-center gap-2">
                <div>👥</div>
                <h3 className="text-xl font-bold text-white">{title}</h3>
            </div>

            <div className="grid grid-cols-4 gap-2 grid-rows-2 h-full">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className={`${selectedItems.find((selectedItem) => selectedItem.id === item.id) ? "border-2 border-yellow-500" : ""
                            } rounded-lg p-2 h-full relative flex flex-col items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 ${item.bgColor}`}
                        onClick={() => handleSelectItem(item.id)}
                    >
                        <img src={item.avatarUrl} alt={item.name} className="self-center" />
                        <div className="text-white absolute bottom-1 right-1">
                            {item.name}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ParticipationSelection;
