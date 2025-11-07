import React, { useState, useMemo } from 'react';
import { PlatformIcon } from './PlatformIcon';
import {SurvivorPanelProps} from "@/types/components";
import Icon from '@/components/icons/Icon';

export const SurvivorPanel: React.FC<SurvivorPanelProps> = ({
    survivorCount,
    participants,
    className = '',
    searchValue,
    onSearchChange,
    searchPlaceholder = "검색...",
}) => {
    const [internalSearchValue, setInternalSearchValue] = useState("");
    const isSearchControlled = typeof searchValue === "string";
    const effectiveSearchValue = isSearchControlled ? searchValue : internalSearchValue;

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = e.target.value;
        if (!isSearchControlled) setInternalSearchValue(next);
        onSearchChange?.(next);
    };

    const filteredParticipants = useMemo(() => {
        const trimmed = effectiveSearchValue.trim().toLowerCase();
        if (!trimmed) {
            return participants;
        }

        return participants.filter((participant) => {
            return participant.name.toLowerCase().includes(trimmed);
        });
    }, [participants, effectiveSearchValue]);

    return (
        <div className={`flex-1 min-h-0 w-full flex flex-col gap-3 p-4 border-2 border-yellow-500 ${className}`}>
            <div className="w-full h-[150px] flex-shrink-0 bg-green-400 rounded-3xl p-6 flex flex-col items-center justify-center gap-1">
                <div className="text-5xl">🎮</div>
                <div className="text-black text-6xl font-extrabold leading-none">{survivorCount}</div>
                <div className="text-black text-lg font-medium">명 생존</div>
            </div>

            <div className="relative flex-shrink-0">
                <Icon
                    name="Search"
                    type="lucide"
                    size={16}
                    color="#9ca3af"
                    className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2"
                />
                <input
                    type="text"
                    value={effectiveSearchValue}
                    onChange={handleSearchChange}
                    placeholder={searchPlaceholder}
                    className="w-full rounded-full border border-gray-700 bg-gray-800 py-1 pl-8 pr-2 text-base text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2">
                {filteredParticipants.map((participant) => (
                    <button
                        key={participant.id}
                        className="bg-black border-2 border-white rounded-2xl px-4 py-3 flex items-center gap-3"
                    >
                        <PlatformIcon platform={participant.platform} size={32} />
                        <span className="text-white text-lg font-black">{participant.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
