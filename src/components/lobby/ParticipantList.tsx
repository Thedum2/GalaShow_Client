import React, {useState, useMemo} from "react";
import Icon from "@/components/icons/Icon";
import {ACTION_BUTTON_STYLES, ParticipantListProps} from "@/types/components";
import { PlatformIcon, getRandomPlatform } from "@/components/common/PlatformIcon";

function formatJoinedAgo(joinedAt?: string | number | Date) {
    if (!joinedAt) return null;
    const ts = new Date(joinedAt).getTime();
    if (isNaN(ts)) return null;
    const diff = Math.max(0, Math.floor((Date.now() - ts) / 1000));
    if (diff < 60) return "방금 참여";
    const m = Math.floor(diff / 60);
    if (m < 60) return `${m}분 전에 참여`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}시간 전에 참여`;
    const d = Math.floor(h / 24);
    return `${d}일 전에 참여`;
}

const ParticipantList: React.FC<ParticipantListProps> = ({
                                                             title,
                                                             currentCount,
                                                             capacity,
                                                             participants,
                                                             searchPlaceholder = "검색...",
                                                             searchValue,
                                                             onSearchChange,
                                                             onRefresh,
                                                             onRemove,
                                                             actionButtons,
                                                             className = "",
                                                         }) => {
    const [internalSearchValue, setInternalSearchValue] = useState("");
    const isSearchControlled = typeof searchValue === "string";
    const effectiveSearchValue = isSearchControlled ? searchValue : internalSearchValue;

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = e.target.value;
        if (!isSearchControlled) setInternalSearchValue(next);
        onSearchChange?.(next);
    };

    const headerCounter = `${currentCount}/${capacity}`;
    const buttonsToRender = actionButtons ?? [];
    const activeIndex = buttonsToRender.findIndex((b) => b.active);

    return (
        <div
            className={`bg-black bg-opacity-50 border-2 border-yellow-500 rounded-xl h-full min-h-0 p-4 flex flex-col gap-4 ${className}`}>

            <div className="flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-yellow-500/40 bg-yellow-500/15">
                        <Icon name="UserStar" type="lucide" size={20} color="#fde047" />
                    </div>
                    <h3 className="text-2xl font-bold">{title}</h3>
                    <span className="bg-purple-600 text-white text-lg font-semibold px-5 py-1 rounded-full">
            {headerCounter}
          </span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
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
                            className="w-40 rounded-full border border-gray-700 bg-gray-800 py-1 pl-8 pr-2 text-base text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={onRefresh}
                        className="rounded-full p-1.5 text-white transition-colors hover:bg-gray-700"
                    >
                        <Icon name="RefreshCw" type="lucide" size={16} />
                    </button>
                </div>
            </div>

            <div className="flex-grow min-h-0 overflow-hidden">
                <div className="h-full overflow-y-auto pr-2">
                    {participants.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
                            {participants.map((p) => {
                                const joinedAgo = formatJoinedAgo(new Date());
                                const platform = getRandomPlatform(p.id);

                                return (
                                    <div key={p.id}
                                         className="relative flex h-[65px] items-center gap-3 rounded-lg bg-gray-900 p-2 border-[1px] border-white">
                                        <PlatformIcon platform={platform} size={40} />
                                        <div className="flex flex-col justify-center min-w-0">
                                            <span className="text-xl font-semibold text-white truncate">{p.name}</span>
                                            <span className="text-xs text-gray-400 truncate">
                            <span className="inline-flex items-center gap-1">
                            <span className="inline-block h-2 w-2 rounded-full bg-green-500"/>
                                {joinedAgo}
                          </span>
                      </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => onRemove?.(p.id)}
                                            className="ml-auto flex p-0 h-6 w-6 rounded-full justify-center items-center bg-red-500/70 text-white hover:bg-red-600 transition-colors"
                                            aria-label="제거"
                                            title="제거"
                                        >
                                            <Icon name="X" type="lucide" size={16} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div
                            className="flex h-full items-center justify-center rounded-lg border border-dashed border-gray-700 text-sm text-gray-400">
                            표시할 참가자가 없습니다.
                        </div>
                    )}
                </div>
            </div>

            {buttonsToRender.length > 0 && (
                <div className="flex-shrink-0 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {buttonsToRender.map((btn, idx) => {
                        const variant = btn.variant ?? "primary";
                        const activeClass = ACTION_BUTTON_STYLES[variant];
                        const inactiveClass = "bg-gray-700/60 text-gray-300 hover:bg-gray-600";
                        const isActive = activeIndex >= 0 ? idx === activeIndex : !!btn.active;
                        return (
                            <button
                                key={btn.label}
                                type="button"
                                onClick={btn.onClick}
                                aria-pressed={isActive}
                                className={`rounded-lg py-2 px-4 text-sm font-bold transition-colors hover:scale-[1.02] active:scale-95 ${
                                    isActive ? `text-white ${activeClass}` : inactiveClass
                                }`}
                            >
                                {btn.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ParticipantList;
