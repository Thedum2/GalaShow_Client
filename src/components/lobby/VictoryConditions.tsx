import React from "react";
import { Users, Clock, Trophy } from "lucide-react";
import {VictoryConditionsProps} from "@/types/components";

export type VictoryOptionId = "lastOne" | "smallGroup" | "rounds";

const VictoryConditions: React.FC<VictoryConditionsProps> = ({
    selectedOption,
    onSelectOption,
    survivorCount,
    onSurvivorCountChange,
    roundCount,
    onRoundCountChange,
    minSurvivorCount = 2,
    maxSurvivorCount = 10,
    minRoundCount = 1,
    className = "",
}) => {
    const handleSurvivorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const raw = Number(event.target.value);
        if (Number.isNaN(raw)) {
            return;
        }
        const normalized = Math.min(Math.max(raw, minSurvivorCount), maxSurvivorCount);
        onSurvivorCountChange?.(normalized);
    };

    const handleRoundChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const raw = Number(event.target.value);
        if (Number.isNaN(raw)) {
            return;
        }
        const normalized = Math.max(raw, minRoundCount);
        onRoundCountChange?.(normalized);
    };

    const optionBaseClass = "group block rounded-2xl border transition-all duration-200 cursor-pointer";

    return (
        <div className={`bg-black border-2 border-yellow-500 rounded-xl w-full h-full min-h-0 p-6 flex flex-col gap-5 shadow-[0_0_20px_rgba(234,179,8,0.25)] overflow-hidden ${className}`}>
            <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-yellow-500/40 bg-yellow-500/15">
                    <Trophy className="h-5 w-5 text-yellow-300" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white">우승 조건 설정</h3>
                    <p className="text-sm text-white/60">게임 종료 기준을 선택하고 필요한 값을 입력해 주세요.</p>
                </div>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto pr-1">
                <label
                    className={`${optionBaseClass} ${
                        selectedOption === "lastOne"
                            ? "border-emerald-300 bg-emerald-500/15 text-white shadow-[0_0_18px_rgba(16,185,129,0.35)]"
                            : "border-emerald-900/40 bg-emerald-950/40 text-emerald-100/80 hover:border-emerald-500/60 hover:bg-emerald-900/40"
                    }`}
                >
                    <input
                        type="radio"
                        name="victory-option"
                        value="lastOne"
                        className="sr-only"
                        checked={selectedOption === "lastOne"}
                        onChange={() => onSelectOption("lastOne")}
                    />
                    <div className="flex gap-4 p-4">
                        <div
                            className={`mt-1 flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${
                                selectedOption === "lastOne" ? "border-emerald-200 bg-emerald-400" : "border-emerald-500/50"
                            }`}
                        >
                            <div
                                className={`h-2.5 w-2.5 rounded-full bg-emerald-950 transition-opacity ${
                                    selectedOption === "lastOne" ? "opacity-100" : "opacity-0"
                                }`}
                            />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-semibold text-white">최후의 1인 서바이벌</span>
                                <span className="rounded-full border border-emerald-300/50 bg-emerald-500/25 px-2 py-0.5 text-xs text-emerald-100">
                                    기본 추천
                                </span>
                            </div>
                            <p className="mt-1 text-sm text-emerald-100/80">
                                마지막 1명이 남을 때까지 게임이 이어지는 클래식한 방식입니다.
                            </p>
                        </div>
                    </div>
                </label>

                <label
                    className={`${optionBaseClass} ${
                        selectedOption === "smallGroup"
                            ? "border-teal-300 bg-teal-500/15 text-white shadow-[0_0_18px_rgba(45,212,191,0.35)]"
                            : "border-teal-800/40 bg-teal-950/40 text-teal-100/80 hover:border-teal-500/60 hover:bg-teal-900/40"
                    }`}
                >
                    <input
                        type="radio"
                        name="victory-option"
                        value="smallGroup"
                        className="sr-only"
                        checked={selectedOption === "smallGroup"}
                        onChange={() => onSelectOption("smallGroup")}
                    />
                    <div className="flex flex-col gap-3 p-4">
                        <div className="flex gap-4">
                            <div
                                className={`mt-1 flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${
                                    selectedOption === "smallGroup" ? "border-teal-200 bg-teal-400" : "border-teal-500/50"
                                }`}
                            >
                                <div
                                    className={`h-2.5 w-2.5 rounded-full bg-teal-950 transition-opacity ${
                                        selectedOption === "smallGroup" ? "opacity-100" : "opacity-0"
                                    }`}
                                />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-semibold text-white">소수 생존자 유지</span>
                                    <span className="rounded-full border border-teal-400/40 bg-teal-500/20 px-2 py-0.5 text-xs text-teal-100">
                                        전략적 진행
                                    </span>
                                </div>
                                <p className="mt-1 text-sm text-teal-100/80">
                                    정해둔 인원까지만 생존시키고 승리를 선언하는 방식입니다.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-teal-400/20 bg-black/30 p-3">
                            <div className="flex items-center gap-2 text-sm text-teal-100">
                                <Users className="h-4 w-4" />
                                <span>생존자 수</span>
                            </div>
                            <input
                                type="number"
                                min={minSurvivorCount}
                                max={maxSurvivorCount}
                                value={survivorCount}
                                onChange={handleSurvivorChange}
                                disabled={selectedOption !== "smallGroup"}
                                className="w-24 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-center text-lg font-semibold text-white focus:outline-none focus:ring-2 focus:ring-teal-200 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            <span className="text-xs text-teal-100/70">
                                최소 {minSurvivorCount}명, 최대 {maxSurvivorCount}명까지 설정 가능
                            </span>
                        </div>
                    </div>
                </label>

                <label
                    className={`${optionBaseClass} ${
                        selectedOption === "rounds"
                            ? "border-slate-300 bg-slate-500/10 text-white shadow-[0_0_18px_rgba(148,163,184,0.25)]"
                            : "border-slate-700/40 bg-slate-950/40 text-gray-200/80 hover:border-slate-500/60 hover:bg-slate-900/40"
                    }`}
                >
                    <input
                        type="radio"
                        name="victory-option"
                        value="rounds"
                        className="sr-only"
                        checked={selectedOption === "rounds"}
                        onChange={() => onSelectOption("rounds")}
                    />
                    <div className="flex flex-col gap-3 p-4">
                        <div className="flex gap-4">
                            <div
                                className={`mt-1 flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${
                                    selectedOption === "rounds" ? "border-slate-200 bg-slate-300" : "border-slate-500/50"
                                }`}
                            >
                                <div
                                    className={`h-2.5 w-2.5 rounded-full bg-slate-900 transition-opacity ${
                                        selectedOption === "rounds" ? "opacity-100" : "opacity-0"
                                    }`}
                                />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-semibold text-white">라운드 기반 진행</span>
                                    <span className="rounded-full border border-slate-400/40 bg-slate-500/20 px-2 py-0.5 text-xs text-slate-100">
                                        시간 관리
                                    </span>
                                </div>
                                <p className="mt-1 text-sm text-slate-200/80">
                                    라운드 수를 미리 정해 제한 시간 내 승부를 가르는 방식입니다.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-500/20 bg-black/30 p-3">
                            <div className="flex items-center gap-2 text-sm text-slate-100">
                                <Clock className="h-4 w-4" />
                                <span>라운드 수</span>
                            </div>
                            <input
                                type="number"
                                min={minRoundCount}
                                value={roundCount}
                                onChange={handleRoundChange}
                                disabled={selectedOption !== "rounds"}
                                className="w-24 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-center text-lg font-semibold text-white focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            <span className="text-xs text-slate-200/70">기본 {minRoundCount}라운드부터 자유롭게 조정 가능</span>
                        </div>
                    </div>
                </label>
            </div>
        </div>
    );
};

export default VictoryConditions;
