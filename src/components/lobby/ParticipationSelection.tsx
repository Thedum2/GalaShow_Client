import React from "react";
import { ParticipationSelectionItem } from "@/types/domain/participant";
import Icon from "@/components/icons/Icon";

interface ParticipationSelectionProps {
    title: string;
    items: ParticipationSelectionItem[];
    selectedIds: string[];
    onToggle: (itemId: string) => void;
    className?: string;
}

const ParticipationSelection: React.FC<ParticipationSelectionProps> = ({
    title,
    items,
    selectedIds,
    onToggle,
    className = "",
}: ParticipationSelectionProps) => {
    return (
        <div
            className={`bg-black bg-opacity-25 border-2 border-yellow-500 rounded-xl h-full min-h-0 p-4 flex flex-col  gap-4 shadow-[0_0_15px_rgba(234,179,8,0.3)] overflow-hidden ${className}`}
        >
            <div className="flex items-center gap-2">
                <div>👥</div>
                <h3 className="text-xl font-bold text-white">{title}</h3>
            </div>

            <div className="grid grid-cols-4 gap-2 grid-rows-2 h-full">
                {items.map((item) => {
                    const isSelected = selectedIds.includes(item.id);
                    return (
                        <div
                            key={item.id}
                            role="button"
                            aria-pressed={isSelected}
                            className={`rounded-lg h-full relative cursor-pointer transition-all duration-200 hover:scale-105 overflow-hidden ${
                                isSelected
                                    ? "ring-4 ring-yellow-400 shadow-[0_0_14px_rgba(250,204,21,0.55)]"
                                    : "ring-1 ring-white/20 hover:ring-2 hover:ring-yellow-400/60"
                            }`}
                            onClick={() => onToggle(item.id)}
                        >
                            {/* 배경 이미지 - 중앙 정렬, 꽉 채우기 (원래 밝기 그대로) */}
                            <div
                                className="absolute inset-0 bg-center bg-cover bg-no-repeat"
                                style={{ backgroundImage: `url(${item.avatarUrl})` }}
                            />
                            {/* 이름이 읽히도록 아래쪽에만 어둡게 */}
                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 to-transparent" />
                            {isSelected && (
                                <div className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-black shadow">
                                    <Icon name="Check" type="lucide" size={16} strokeWidth={3} />
                                </div>
                            )}
                            {/* 우측 하단 텍스트 */}
                            <div
                                className="absolute bottom-1.5 right-2 text-lg font-black leading-none text-white"
                                style={{ WebkitTextStroke: "4px #000", paintOrder: "stroke fill", textShadow: "0 2px 4px rgba(0,0,0,0.6)" }}
                            >
                                {item.name}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ParticipationSelection;
