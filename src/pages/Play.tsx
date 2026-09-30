import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UnityPlayer from "@/bridge/UnityPlayer";
import { useUnity } from "@/bridge/useUnity";
import { PATHS } from "@/routes/paths";
import type { MinigameDetail } from "@/api/model/response/minigame/MinigameDetail";
import { useRgfRound } from "@/game/useRgfRound";
import { loadMinigameDetail } from "@/game/loadMinigameDetail";
import { roundLabel, useSessionStore } from "@/stores/session";
import type { RgfStatus } from "@/stores/rgf";
import HostPromptPopup from "@/components/game/HostPromptPopup";
import GameStageOverlay from "@/components/game/GameStageOverlay";

function statusText(status: RgfStatus, error: string | null) {
    switch (status) {
        case "idle":
        case "loading": return "Unity 불러오는 중...";
        case "initializing": return "참가자와 캐릭터를 등록하는 중...";
        case "ready": return error ?? "곧 시작합니다...";
        case "running": return "";
        case "completed": return "결과를 정리하는 중...";
        case "unsupported": return "이 게임은 Unity에서 실행할 수 없습니다 (game_data.pluginId 없음)";
        case "error": return error ?? "오류가 발생했습니다";
        default: return "";
    }
}

/**
 * 미니게임 실전(Minigame_Play): Unity 전체 화면으로 한 판을 진행하고, 결과가 확정되면 결과 화면으로 넘어간다.
 * 튜토리얼의 [시작하기]로 들어온다. 준비되면 자동으로 시작한다.
 */
export default function Play() {
    const { unityProvider, isLoaded, loadingProgression, loadError: unityLoadError } = useUnity();
    const navigate = useNavigate();
    const location = useLocation();
    const gameId = (location.state as { gameId?: number })?.gameId ?? useSessionStore.getState().currentGameId ?? undefined;
    const round = useSessionStore((s) => s.round);
    const survivorCount = useSessionStore((s) => s.survivors.length);

    const [detail, setDetail] = useState<MinigameDetail | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);

    const live = useRgfRound({
        isLoaded,
        detail,
        mode: "live",
        autoStart: true,
        onCompleted: () => setTimeout(() => navigate(PATHS.result, { viewTransition: true }), 2500),
    });

    useEffect(() => {
        if (gameId == null) {
            setLoadError("선택된 게임이 없습니다.");
            return;
        }
        loadMinigameDetail(gameId)
            .then(setDetail)
            .catch((error) => {
                console.error("Failed to load game detail:", error);
                setLoadError("게임 정보를 불러올 수 없습니다.");
            });
    }, [gameId]);

    const handleAbort = async () => {
        await live.abort();
        navigate(PATHS.tutorial, { state: { gameId } });
    };

    const message = loadError ?? statusText(live.status, live.error);
    const failed = Boolean(loadError) || live.status === "error" || live.status === "unsupported";

    return (
        <div className="h-full w-full relative">
            {/* Unity 전체 화면 */}
            <div className="absolute inset-0">
                <UnityPlayer unityProvider={unityProvider} isLoaded={isLoaded} loadingProgression={loadingProgression} loadError={unityLoadError} />
            </div>

            {/* 진행 전·오류: Unity 로딩·초기화 화면을 덮는다 (게임 중·결과 정리 중에는 Unity 화면이 보인다) */}
            {!unityLoadError && live.status !== "running" && live.status !== "completed" && (
                <GameStageOverlay
                    eyebrow={`${roundLabel(round)} 라운드 · 참가 ${survivorCount}명`}
                    title={detail?.name ?? "게임 준비 중"}
                    logoUrl={detail?.logoUrl || undefined}
                    message={message}
                    error={failed}
                    progress={isLoaded ? undefined : loadingProgression}
                />
            )}

            <HostPromptPopup prompt={live.prompt} onSelect={live.selectHostOption} />

            {/* 스트리머 조작: 호스트 선택 안내·중단 (작게) */}
            <div className="absolute bottom-3 right-4 flex items-center gap-3 text-sm text-white/70">

                {failed ? (
                    <button onClick={() => navigate(PATHS.tutorial, { state: { gameId } })}
                        className="rounded-lg bg-yellow-500 px-3 py-1.5 font-bold text-black hover:bg-yellow-400">
                        튜토리얼로
                    </button>
                ) : (
                    <button onClick={handleAbort} disabled={live.status !== "running"}
                        className="rounded-lg bg-black/50 px-3 py-1.5 font-bold hover:bg-red-700/80 disabled:opacity-30">
                        게임 중단
                    </button>
                )}
            </div>
        </div>
    );
}
