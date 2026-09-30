interface GameStageOverlayProps {
    /** 게임 이름 */
    title: string;
    /** 제목 위 작은 문구 (예: "튜토리얼", "3번째 라운드") */
    eyebrow?: string;
    /** 현재 상태 안내 */
    message: string;
    /** 오류 표시 */
    error?: boolean;
    /** 0~1. Unity 로딩 중일 때 진행률 막대 */
    progress?: number;
    /** 버튼 문구. 없으면 버튼을 숨긴다 */
    actionLabel?: string;
    actionDisabled?: boolean;
    onAction?: () => void;
    logoUrl?: string;
}

/**
 * Unity 영역을 덮는 시작·대기 화면. Unity 로딩·초기화 화면(스플래시 포함)을 가리고,
 * 준비되면 시작 버튼을 보여 준다. 게임이 진행될 때만 내려서 Unity 화면을 보인다.
 */
export default function GameStageOverlay({
    title, eyebrow, message, error, progress, actionLabel, actionDisabled, onAction, logoUrl,
}: GameStageOverlayProps) {
    return (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
            {logoUrl && <img src={logoUrl} alt="" className="h-28 w-28 rounded-2xl object-cover shadow-lg" onError={(e) => { e.currentTarget.style.display = "none"; }} />}
            <div className="text-center">
                {eyebrow && <div className="text-2xl font-black tracking-widest text-yellow-300">{eyebrow}</div>}
                <div className="mt-1 text-7xl font-black">{title}</div>
            </div>

            <div className={`max-w-[80%] text-center text-2xl font-bold ${error ? "text-red-300" : "text-white/80"}`}>{message}</div>

            {progress !== undefined && progress < 1 && (
                <div className="h-3 w-80 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-yellow-400 transition-all duration-300" style={{ width: `${Math.round(progress * 100)}%` }} />
                </div>
            )}

            {actionLabel && (
                <button
                    type="button"
                    onClick={onAction}
                    disabled={actionDisabled}
                    className="rounded-2xl bg-green-600 px-12 py-5 text-4xl font-black text-white shadow-lg transition-colors hover:bg-green-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
