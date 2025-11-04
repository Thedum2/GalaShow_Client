import React from "react";
import Icon from "@/components/icons/Icon";
import { VictoryConditionsProps } from "@/types/components";

export type VictoryOptionId = "lastOne" | "smallGroup" | "rounds";

// --- Data Configuration for Victory Options ---
const optionsConfig = [
    {
        id: 'lastOne' as VictoryOptionId,
        title: '최후의 1인 서바이벌',
        description: '마지막 1명이 남을 때까지 게임이 이어지는 클래식한 방식입니다.',
        tag: '기본 추천',
        styling: {
            selected: 'border-emerald-300 bg-emerald-500/15 text-white shadow-[0_0_18px_rgba(16,185,129,0.35)]',
            unselected: 'border-emerald-900/40 bg-emerald-950/40 text-emerald-100/80 hover:border-emerald-500/60 hover:bg-emerald-900/40',
            radioSelected: 'border-emerald-200 bg-emerald-400',
            radioUnselected: 'border-emerald-500/50',
            radioDot: 'bg-emerald-950',
            tag: 'rounded-full border border-emerald-300/50 bg-emerald-500/25 px-2 py-0.5 text-xs text-emerald-100',
        },
        inputSection: null,
    },
    {
        id: 'smallGroup' as VictoryOptionId,
        title: '소수 생존자 유지',
        description: '정해둔 인원까지만 생존시키고 승리를 선언하는 방식입니다.',
        tag: '전략적 진행',
        styling: {
            selected: 'border-sky-300 bg-sky-500/15 text-white shadow-[0_0_18px_rgba(56,189,248,0.35)]',
            unselected: 'border-sky-800/40 bg-sky-950/40 text-sky-100/80 hover:border-sky-500/60 hover:bg-sky-900/40',
            radioSelected: 'border-sky-200 bg-sky-400',
            radioUnselected: 'border-sky-500/50',
            radioDot: 'bg-sky-950',
            tag: 'rounded-full border border-sky-400/40 bg-sky-500/20 px-2 py-0.5 text-xs text-sky-100',
            inputBorder: 'border-sky-400/20',
            inputRing: 'focus:ring-sky-200',
            inputText: 'text-sky-100',
            inputSubText: 'text-sky-100/70',
        },
        inputSection: 'survivorCount',
    },
    {
        id: 'rounds' as VictoryOptionId,
        title: '라운드 기반 진행',
        description: '라운드 수를 미리 정해 제한 시간 내 승부를 가르는 방식입니다.',
        tag: '시간 관리',
        styling: {
            selected: 'border-slate-300 bg-slate-500/10 text-white shadow-[0_0_18px_rgba(148,163,184,0.25)]',
            unselected: 'border-slate-700/40 bg-slate-950/40 text-gray-200/80 hover:border-slate-500/60 hover:bg-slate-900/40',
            radioSelected: 'border-slate-200 bg-slate-300',
            radioUnselected: 'border-slate-500/50',
            radioDot: 'bg-slate-900',
            tag: 'rounded-full border border-slate-400/40 bg-slate-500/20 px-2 py-0.5 text-xs text-slate-100',
            inputBorder: 'border-slate-500/20',
            inputRing: 'focus:ring-slate-200',
            inputText: 'text-slate-100',
            inputSubText: 'text-slate-200/70',
        },
        inputSection: 'roundCount',
    },
];

// --- Input Sections Sub-Component ---
type InputSectionProps = Pick<VictoryConditionsProps, 'survivorCount' | 'onSurvivorCountChange' | 'roundCount' | 'onRoundCountChange' | 'minSurvivorCount' | 'maxSurvivorCount' | 'minRoundCount'> & {
    type: 'survivorCount' | 'roundCount';
    styling: any;
    disabled: boolean;
    handleSurvivorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleRoundChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputSection: React.FC<InputSectionProps> = ({
    type,
    styling,
    disabled,
    survivorCount,
    roundCount,
    minSurvivorCount,
    maxSurvivorCount,
    minRoundCount,
    handleSurvivorChange,
    handleRoundChange
}) => {
    if (type === 'survivorCount') {
        return (
            <div className={`flex flex-wrap items-center gap-3 rounded-xl bg-black/30 p-3 ${styling.inputBorder}`}>
                <div className={`flex items-center gap-2 text-sm ${styling.inputText}`}>
                    <Icon name="Users" type="lucide" size={24} />
                    <span className="text-base">생존자 수</span>
                </div>
                <input
                    type="number"
                    min={minSurvivorCount}
                    max={maxSurvivorCount}
                    value={survivorCount}
                    onChange={handleSurvivorChange}
                    disabled={disabled}
                    className={`w-24 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-center text-lg font-semibold text-white focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${styling.inputRing}`}
                />
                <span className={`text-base ${styling.inputSubText}`}>
                    최소 {minSurvivorCount}명, 최대 {maxSurvivorCount}명까지 설정 가능
                </span>
            </div>
        );
    }

    if (type === 'roundCount') {
        return (
            <div className={`flex flex-wrap items-center gap-3 rounded-xl bg-black/30 p-3 ${styling.inputBorder}`}>
                <div className={`flex items-center gap-2 text-base ${styling.inputText}`}>
                    <Icon name="Clock" type="lucide" size={24} />
                    <span className="text-base">라운드 수</span>
                </div>
                <input
                    type="number"
                    min={minRoundCount}
                    value={roundCount}
                    onChange={handleRoundChange}
                    disabled={disabled}
                    className={`w-24 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-center text-lg font-semibold text-white focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${styling.inputRing}`}
                />
                <span className={`text-base ${styling.inputSubText}`}>기본 {minRoundCount}라운드부터 자유롭게 조정 가능</span>
            </div>
        );
    }

    return null;
};

// --- Victory Option Sub-Component ---
type VictoryOptionProps = {
    option: typeof optionsConfig[0];
    isSelected: boolean;
    onSelect: () => void;
} & Omit<InputSectionProps, 'type' | 'styling' | 'disabled'>;

const VictoryOption: React.FC<VictoryOptionProps> = ({ option, isSelected, onSelect, ...rest }) => {
    const { id, title, description, tag, styling, inputSection } = option;

    return (
        <label className={`group block rounded-2xl border transition-all duration-200 cursor-pointer ${isSelected ? styling.selected : styling.unselected}`}>
            <input
                type="radio"
                name="victory-option"
                value={id}
                className="sr-only"
                checked={isSelected}
                onChange={onSelect}
            />
            <div className="flex flex-col gap-3 p-4">
                <div className="flex gap-4">
                    <div className={`mt-1 flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${isSelected ? styling.radioSelected : styling.radioUnselected}`}>
                        <div className={`h-2.5 w-2.5 rounded-full transition-opacity ${styling.radioDot} ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-semibold text-white">{title}</span>
                            <span className={styling.tag}>{tag}</span>
                        </div>
                        <p className={`mt-1 text-base ${isSelected ? '' : styling.unselected}`}>{description}</p>
                    </div>
                </div>
                {inputSection && (
                    <InputSection
                        type={inputSection as 'survivorCount' | 'roundCount'}
                        styling={styling}
                        disabled={!isSelected}
                        {...rest}
                    />
                )}
            </div>
        </label>
    );
};

// --- Main VictoryConditions Component ---
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
        if (Number.isNaN(raw)) return;
        const normalized = Math.min(Math.max(raw, minSurvivorCount), maxSurvivorCount);
        onSurvivorCountChange?.(normalized);
    };

    const handleRoundChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const raw = Number(event.target.value);
        if (Number.isNaN(raw)) return;
        const normalized = Math.max(raw, minRoundCount);
        onRoundCountChange?.(normalized);
    };

    return (
        <div className={`bg-slate-900 border-2 border-yellow-500 rounded-xl w-full h-full min-h-0 p-6 flex flex-col gap-5 shadow-[0_0_20px_rgba(234,179,8,0.25)] overflow-hidden ${className}`}>
            <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-yellow-500/40 bg-yellow-500/15">
                    <Icon name="Trophy" type="lucide" size={20} color="#fde047" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white">우승 조건 설정</h3>
                    <p className="text-sm text-gray-300">게임 종료 기준을 선택하고 필요한 값을 입력해 주세요.</p>
                </div>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto pr-1 p-0 mt-2">
                {optionsConfig.map(option => (
                    <VictoryOption
                        key={option.id}
                        option={option}
                        isSelected={selectedOption === option.id}
                        onSelect={() => onSelectOption(option.id)}
                        survivorCount={survivorCount}
                        onSurvivorCountChange={onSurvivorCountChange}
                        roundCount={roundCount}
                        onRoundCountChange={onRoundCountChange}
                        minSurvivorCount={minSurvivorCount}
                        maxSurvivorCount={maxSurvivorCount}
                        minRoundCount={minRoundCount}
                        handleSurvivorChange={handleSurvivorChange}
                        handleRoundChange={handleRoundChange}
                    />
                ))}
            </div>
        </div>
    );
};

export default VictoryConditions;