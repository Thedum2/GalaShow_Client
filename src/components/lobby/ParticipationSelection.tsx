import React, { useState } from "react";
import { ParticipationSelectionItem } from "@/types/domain/participant";

interface ParticipationSelectionProps {
    title: string;
    items: ParticipationSelectionItem[];
    className?: string;
}

const ParticipationSelection: React.FC<ParticipationSelectionProps> = ({
    title,
    items,
    className = "",
}: ParticipationSelectionProps) => {
    const [selectedItems, setSelectedItems] = useState<ParticipationSelectionItem[]>([]);

    const handleSelectItem = (itemId: string) => {
        setSelectedItems((prev) => {
            const isAlreadySelected = prev.some((item) => item.id === itemId);

            if (isAlreadySelected) {
                return prev.filter((item) => item.id !== itemId);
            } else {
                const item = items.find((item) => item.id === itemId);
                if (item) {
                    return [...prev, item];
                }
                return prev;
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
                        className={`${selectedItems.find((selectedItem) => selectedItem.id === item.id) ? "border-4 border-blue-500" : ""
                            } rounded-lg h-full relative cursor-pointer transition-all duration-200 hover:scale-105 overflow-hidden`}
                        onClick={() => handleSelectItem(item.id)}
                    >
                        {/* 배경 이미지 - 중앙 정렬, 꽉 채우기, 잘리지 않게 */}
                        <div
                            className="absolute inset-0 bg-center bg-cover bg-no-repeat"
                            style={{ backgroundImage: `url(${item.avatarUrl})` }}
                        />
                        {/* 검은색 오버레이 */}
                        <div className="absolute inset-0 bg-black bg-opacity-40" />
                        {/* 우측 하단 텍스트 */}
                        <div className="absolute bottom-2 right-2 text-white text-sm font-semibold drop-shadow-lg">
                            {item.name}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ParticipationSelection;
