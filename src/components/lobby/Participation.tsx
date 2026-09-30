import React, { useEffect, useState } from "react";
import Icon from "@/components/icons/Icon";
import { ParticipationInstructions } from "@/types/domain/game";

interface ParticipationProps {
    title: string;
    instructions: ParticipationInstructions;
    helperText: string;
    maxLabel: string;
    maxValue: number;
    onMaxValueChange?: (value: number) => void;
    minValue?: number;
    maxLimit?: number;
    /** +/- 버튼 한 번에 바뀌는 인원 */
    step?: number;
    /** 값을 바꿀 수 없게 잠근다(모집 시작 후) */
    maxLocked?: boolean;
    totalCount: number;
    totalCountCaption: string;
    /** 제목 오른쪽에 표시할 내용(모집 상태, 채팅 연결 등) */
    headerExtra?: React.ReactNode;
    className?: string;
}

const Participation: React.FC<ParticipationProps> = ({
                                                         title,
                                                         instructions,
                                                         helperText,
                                                         maxLabel,
                                                         maxValue,
                                                         onMaxValueChange,
                                                         minValue = 1,
                                                         maxLimit = 1000,
                                                         step = 10,
                                                         maxLocked = false,
                                                         totalCount,
                                                         totalCountCaption,
                                                         headerExtra,
                                                     }) => {
    // 입력 중에는 빈 값도 허용하고, 포커스를 잃거나 Enter를 누를 때 범위 안으로 맞춰 반영한다.
    const [draft, setDraft] = useState(String(maxValue));
    useEffect(() => setDraft(String(maxValue)), [maxValue]);

    const clamp = (value: number) => Math.min(Math.max(Math.round(value), minValue), maxLimit);
    const commit = (value: number) => {
        const next = Number.isFinite(value) ? clamp(value) : maxValue;
        setDraft(String(next));
        if (next !== maxValue) onMaxValueChange?.(next);
    };
    const highlights = Array.isArray(instructions.highlight) ? instructions.highlight : [instructions.highlight];
    const stepButtonClass =
        "flex h-full w-10 shrink-0 items-center justify-center bg-transparent p-0 text-yellow-300 transition-colors " +
        "hover:bg-yellow-500/20 active:bg-yellow-500/30 disabled:cursor-not-allowed disabled:text-gray-600 disabled:hover:bg-transparent";

    return (
        <div
            className={[
                "bg-black bg-opacity-25 border-2 border-yellow-500 rounded-xl h-full min-h-0 p-5",
                "flex flex-col gap-3",
                "shadow-[0_0_15px_rgba(234,179,8,0.4)]",
                "focus-within:ring-2 focus-within:ring-yellow-500 outline-none",
                "overflow-hidden",
            ].join(" ")}
        >

            <div className="shrink-0 h-[40px] flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-yellow-500/40 bg-yellow-500/15">
                        <Icon name="Megaphone" type="lucide" size={20} color="#fde047" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{title}</h2>
                </div>
                {headerExtra}
            </div>

            <div
                className="shrink-0 h-[60px] flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-yellow-600 text-white px-3">
                <Icon name="MessageCircle" type="lucide" size={20} />
                <span className="font-semibold text-lg whitespace-nowrap">
          {instructions.prefix}
                    {highlights.map((command, index) => (
                        <React.Fragment key={command}>
                            {index > 0 && <span className="text-base"> 또는 </span>}
                            <span className="rounded-3xl bg-purple-600 px-2.5 py-1 text-xl font-semibold text-white mx-1">
                                {command}
                            </span>
                        </React.Fragment>
                    ))}
                    {instructions.suffix}
        </span>
            </div>

            <p className="shrink-0 flex items-center text-sm text-white font-bold">
                {helperText}
            </p>

            <div className="shrink-0 h-[48px] flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon name="Target" type="lucide" size={20} color="white" />
                    <label className="font-semibold text-white text-xl">{maxLabel}</label>
                    {maxLocked && (
                        <span title="모집을 시작하면 바꿀 수 없어요. 로비를 초기화하면 다시 바꿀 수 있어요." className="flex items-center text-yellow-300/80">
                            <Icon name="Lock" type="lucide" size={16} />
                        </span>
                    )}
                </div>

                <div
                    className={`flex h-[42px] w-[200px] items-stretch overflow-hidden rounded-xl border-2 transition-shadow ${
                        maxLocked
                            ? "border-white/15 bg-black/30 opacity-60"
                            : "border-yellow-500/60 bg-black/50 shadow-[0_0_10px_rgba(234,179,8,0.25)] focus-within:border-yellow-400 focus-within:shadow-[0_0_14px_rgba(234,179,8,0.5)]"
                    }`}
                    title={maxLocked ? "모집을 시작하면 바꿀 수 없어요. 로비를 초기화하면 다시 바꿀 수 있어요." : undefined}
                >
                    <button
                        type="button"
                        aria-label={`${step}명 줄이기`}
                        disabled={maxLocked || maxValue <= minValue}
                        onClick={() => commit(maxValue - step)}
                        className={`${stepButtonClass} border-r border-yellow-500/30`}
                    >
                        <Icon name="Minus" type="lucide" size={20} strokeWidth={3} />
                    </button>
                    <div className="flex min-w-0 flex-1 items-center justify-center gap-1 px-1">
                        <input
                            type="text"
                            inputMode="numeric"
                            aria-label={maxLabel}
                            value={draft}
                            disabled={maxLocked}
                            onChange={(e) => setDraft(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))}
                            onBlur={() => commit(Number(draft || NaN))}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                                if (e.key === "ArrowUp") { e.preventDefault(); commit(maxValue + 1); }
                                if (e.key === "ArrowDown") { e.preventDefault(); commit(maxValue - 1); }
                            }}
                            className="w-14 bg-transparent p-0 text-right text-2xl font-black text-yellow-300 focus:outline-none disabled:cursor-not-allowed"
                        />
                        <span className="text-base font-bold text-white/80">명</span>
                    </div>
                    <button
                        type="button"
                        aria-label={`${step}명 늘리기`}
                        disabled={maxLocked || maxValue >= maxLimit}
                        onClick={() => commit(maxValue + step)}
                        className={`${stepButtonClass} border-l border-yellow-500/30`}
                    >
                        <Icon name="Plus" type="lucide" size={20} strokeWidth={3} />
                    </button>
                </div>
            </div>

            {/* 카드 바닥에 붙이고 줄어들지 않게 해 위 입력 줄과 겹치지 않도록 한다 */}
            <div className="mt-auto shrink-0 w-full rounded-lg border border-white bg-black/60 px-4 py-3">
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-yellow-500">{totalCount}</span>
                    <p className="font-semibold text-white">{totalCountCaption}</p>
                </div>
            </div>
        </div>
    );
};

export default Participation;
