import { useNavigate } from "react-router-dom";
import { PlatformType } from "@/types/common";
import UnityPlayer from "@/bridge/UnityPlayer";
import React from "react";
import { useUnity } from "@/bridge/useUnity";
import { WinnerPanel, RoundResult, WinnerStats } from "@/components/winner";
import { useSessionStore } from "@/stores/session";
import { useLobbyStore } from "@/stores/lobby";
import { PATHS } from "@/routes/paths";

export default function Winner() {
    const navigate = useNavigate();
    const {unityProvider, isLoaded, loadingProgression} = useUnity();

    const { survivors, results, startedAt, reset } = useSessionStore();
    const resetLobby = useLobbyStore((s) => s.reset);

    // 최후의 1인: 마지막 생존자 (여럿이면 첫 번째, 없으면 우승자 없음)
    const winner = survivors[0] ?? null;
    const winnerName = winner?.nickname ?? "우승자 없음";
    const winnerPlatform: PlatformType = winner?.platform ?? "chzzk";

    const elapsed = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
    const survivedRounds = winner ? results.filter((r) => r.survivors.some((p) => p.id === winner.id)).length : 0;
    const stats: WinnerStats = {
        totalRounds: results.length,
        playTime: `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, "0")}`,
        accuracyRate: results.length > 0 ? Math.round((survivedRounds / results.length) * 100) : 0,
    };

    const roundResults: RoundResult[] = results.map((r) => ({
        id: String(r.round),
        name: r.gameName,
        percentage: r.participants.length > 0 ? Math.round((r.survivors.length / r.participants.length) * 1000) / 10 : 0,
        survived: winner ? r.survivors.some((p) => p.id === winner.id) : false,
        logoUrl: r.gameLogoUrl,
    }));

    const handleNewGame = () => {
        reset();
        resetLobby();
        navigate(PATHS.lobby);
    };

    return (
        <div className="h-full w-full relative">
            {/* Unity 풀화면 */}
            <div className="absolute inset-0">
                <UnityPlayer
                    unityProvider={unityProvider}
                    isLoaded={isLoaded}
                    loadingProgression={loadingProgression}
                />
            </div>

            {/* 왼쪽 우승자 정보 패널 (팝업) */}
            <WinnerPanel
                winnerName={winnerName}
                winnerPlatform={winnerPlatform}
                stats={stats}
                roundResults={roundResults}
                onNewGame={handleNewGame}
            />
        </div>
    );
}
