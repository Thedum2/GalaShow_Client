import { useEffect } from "react";
import type { HostPromptState } from "@/stores/rgf";

interface HostPromptPopupProps {
    prompt: HostPromptState | null;
    onSelect: (optionId: string) => void;
}

const OPTION_STYLES = [
    { card: "border-blue-400 bg-blue-500/15 hover:bg-blue-500/30 hover:shadow-[0_0_40px_rgba(96,165,250,0.6)]", badge: "bg-blue-500", cta: "bg-blue-500 group-hover:bg-blue-400" },
    { card: "border-orange-400 bg-orange-500/15 hover:bg-orange-500/30 hover:shadow-[0_0_40px_rgba(251,146,60,0.6)]", badge: "bg-orange-500", cta: "bg-orange-500 group-hover:bg-orange-400" },
    { card: "border-green-400 bg-green-500/15 hover:bg-green-500/30 hover:shadow-[0_0_40px_rgba(74,222,128,0.6)]", badge: "bg-green-500", cta: "bg-green-500 group-hover:bg-green-400" },
    { card: "border-pink-400 bg-pink-500/15 hover:bg-pink-500/30 hover:shadow-[0_0_40px_rgba(244,114,182,0.6)]", badge: "bg-pink-500", cta: "bg-pink-500 group-hover:bg-pink-400" },
];

/**
 * 호스트 선택 팝업 (게임 공통). Unity가 RGFManager_PromptOpened로 열고 PromptClosed로 닫는다.
 * Unity 화면을 검게 가리고 가운데에 질문과 큰 선택 카드를 보여 준다. 카드 전체가 버튼이고 키보드 숫자로도 고를 수 있다.
 * 호스트가 고르면 바로 닫힌다 (방송 화면에는 Unity 상단의 "호스트 선택 완료"만 남는다).
 */
export default function HostPromptPopup({ prompt, onSelect }: HostPromptPopupProps) {
    // 키보드 숫자(1, 2, ...)로 선택
    useEffect(() => {
        if (!prompt) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.repeat || e.ctrlKey || e.altKey || e.metaKey) return;
            const target = e.target as HTMLElement | null;
            if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
            const option = prompt.options.find((o) => String(o.number) === e.key);
            if (option) {
                e.preventDefault();
                onSelect(option.id);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [prompt, onSelect]);

    if (!prompt) return null;

    const action = prompt.actionLabel ?? "선택";

    return (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/90 px-6 animate-fade-in motion-reduce:animate-none">
            <div className="flex w-full max-w-[1150px] flex-col items-center gap-5 animate-page-in motion-reduce:animate-none">
                {/* 누가 무엇을 해야 하는지 */}
                <div className="rounded-full bg-yellow-400 px-6 py-2 text-2xl font-black text-gray-900 shadow-[0_0_24px_rgba(250,204,21,0.5)]">
                    👑 호스트 선택 시간
                </div>

                <div className="text-center">
                    <div className="text-6xl font-black text-white">{prompt.title}</div>
                    {prompt.description && (
                        <p className="mx-auto mt-3 max-w-[950px] text-2xl font-bold leading-snug text-white/85">{prompt.description}</p>
                    )}
                </div>

                {prompt.hint && (
                    <div className="text-center text-2xl font-black text-yellow-300">{prompt.hint}</div>
                )}

                {/* 선택 카드: 카드 전체를 누르면 선택 */}
                <div className={`grid w-full gap-6 ${prompt.options.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                    {prompt.options.map((option, index) => {
                        const style = OPTION_STYLES[index % OPTION_STYLES.length];
                        return (
                            <button
                                key={option.id}
                                type="button"
                                onClick={() => onSelect(option.id)}
                                className={`group flex flex-col overflow-hidden rounded-3xl border-4 text-left transition-all duration-150 hover:-translate-y-1 hover:scale-[1.02] active:scale-95 ${style.card}`}
                            >
                                <div className="flex flex-1 items-center gap-5 p-6">
                                    <span className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl text-7xl font-black text-white shadow-lg ${style.badge}`}>
                                        {option.number}
                                    </span>
                                    <div className="min-w-0">
                                        <div className="text-4xl font-black leading-tight text-white">{option.label}</div>
                                        {option.description && <div className="mt-2 text-xl font-bold text-white/75">{option.description}</div>}
                                    </div>
                                </div>
                                <div className={`py-4 text-center text-3xl font-black text-white transition-colors ${style.cta}`}>
                                    {option.number}번 {action}
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="text-center text-lg font-bold text-white/60">
                    카드를 누르거나 키보드 숫자 {prompt.options.map((o) => o.number).join(" · ")} 를 누르세요
                </div>
            </div>
        </div>
    );
}
