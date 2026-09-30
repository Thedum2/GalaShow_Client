import type { HostPromptState } from "@/stores/rgf";

interface HostPromptPopupProps {
    prompt: HostPromptState | null;
    onSelect: (optionId: string) => void;
}

const OPTION_COLORS = [
    "border-blue-400 bg-blue-500/15",
    "border-orange-400 bg-orange-500/15",
    "border-green-400 bg-green-500/15",
    "border-pink-400 bg-pink-500/15",
];

/**
 * 호스트 선택 팝업 (게임 공통). Unity가 RGFManager_PromptOpened로 열고 PromptClosed로 닫는다.
 * 선택지 설명과 함께 호스트가 고를 버튼을 보여 준다. 호스트가 고르면 바로 닫힌다
 * (방송 화면에는 Unity 상단의 "호스트 선택 완료"만 남는다).
 */
export default function HostPromptPopup({ prompt, onSelect }: HostPromptPopupProps) {
    if (!prompt) return null;

    return (
        <div className="absolute inset-x-0 top-[12%] z-20 flex justify-center px-6 animate-page-in motion-reduce:animate-none">
            <div className="w-full max-w-[1100px] rounded-3xl border-2 border-yellow-500 bg-black/85 p-6 shadow-[0_0_30px_rgba(234,179,8,0.35)] backdrop-blur-sm">
                <div className="text-center">
                    <div className="text-5xl font-black text-yellow-300">{prompt.title}</div>
                    {prompt.description && <p className="mt-3 text-2xl font-bold leading-snug text-white/90">{prompt.description}</p>}
                </div>

                <div className={`mt-5 grid gap-4 ${prompt.options.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                    {prompt.options.map((option, index) => (
                        <div key={option.id} className={`flex flex-col gap-3 rounded-2xl border-2 p-4 ${OPTION_COLORS[index % OPTION_COLORS.length]}`}>
                            <div className="flex items-center gap-4">
                                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white/15 text-5xl font-black text-white">
                                    {option.number}
                                </span>
                                <div className="min-w-0">
                                    <div className="text-3xl font-black text-white">{option.label}</div>
                                    {option.description && <div className="mt-1 text-lg text-white/75">{option.description}</div>}
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-lg font-bold text-yellow-200">채팅: {option.number}</span>
                                <button
                                    type="button"
                                    onClick={() => onSelect(option.id)}
                                    className="rounded-xl bg-gray-800 px-5 py-2.5 text-xl font-black text-white transition-colors hover:bg-gray-600 active:scale-95"
                                >
                                    {option.number}번 {prompt.actionLabel ?? "선택"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 text-center text-lg font-bold">
                    <span className="text-white/70">{prompt.hint ?? "호스트가 선택해 주세요"}</span>
                </div>
            </div>
        </div>
    );
}
