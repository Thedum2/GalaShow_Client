import UnityPlayer from "@/bridge/UnityPlayer";
import {useUnity} from "@/bridge/useUnity";
import React, { useState, useEffect } from "react";
import GameControls from "@/components/tutorial/GameControls";
import HowToPlay from "@/components/tutorial/HowToPlay";
import {useNavigate, useLocation} from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { MinigameDetail } from "@/api/model/response/minigame/MinigameDetail";
import fallbackLogoUrl from "@/assets/svg/logo.svg?url";
import { useRgfRound } from "@/game/useRgfRound";
import { loadMinigameDetail } from "@/game/loadMinigameDetail";
import { useSessionStore } from "@/stores/session";
import type { RgfStatus } from "@/stores/rgf";
import HostPromptPopup from "@/components/game/HostPromptPopup";
import GameStageOverlay from "@/components/game/GameStageOverlay";

/** 연습 진행 상태 안내 문구 */
function statusText(status: RgfStatus, error: string | null) {
    switch (status) {
        case "loading": return "Unity 불러오는 중...";
        case "initializing": return "참가자와 캐릭터를 등록하는 중...";
        case "ready":
            return error ?? "튜토리얼을 시작합니다...";
        case "running": return "";
        case "unsupported": return "이 게임은 아직 Unity에서 실행할 수 없습니다 (game_data.pluginId 없음)";
        case "error": return error ?? "오류가 발생했습니다";
        default: return "";
    }
}

/**
 * 미니게임 튜토리얼: 규칙 설명과 연습 라운드.
 * 화면에 들어오면 Unity가 준비되는 대로 연습을 바로 시작한다. 탈락은 반영되지 않는다.
 * 연습이 끝나면 다시 연습할지, 실전으로 갈지 고르는 팝업을 띄운다.
 * [시작하기]로 실전(Play) 화면으로 넘어간다.
 */
export default function Tutorial() {
    const {unityProvider, isLoaded, loadingProgression} = useUnity();
    const navigate = useNavigate();
    const location = useLocation();
    const gameId = (location.state as { gameId?: number })?.gameId ?? useSessionStore.getState().currentGameId ?? undefined;

    const [gameDetail, setGameDetail] = useState<MinigameDetail | null>(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(true);

    // 연습 라운드: 들어오자마자 자동 시작, 결과를 세션에 저장하지 않는다
    const practice = useRgfRound({ isLoaded, detail: gameDetail, mode: "practice", autoStart: true });

    // 게임 상세 정보 로드
    useEffect(() => {
        if (gameId == null) {
            console.error('No gameId provided');
            setIsLoadingDetail(false);
            return;
        }

        const loadGameDetail = async () => {
            try {
                setIsLoadingDetail(true);
                setGameDetail(await loadMinigameDetail(gameId));
            } catch (error) {
                console.error('Failed to load game detail:', error);
                setGameDetail(null);
            } finally {
                setIsLoadingDetail(false);
            }
        };

        loadGameDetail();
    }, [gameId]);

    if (isLoadingDetail) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <span className="text-white text-3xl">게임 정보 로딩 중...</span>
            </div>
        );
    }

    if (!gameDetail) {
        return (
            <div className="flex h-full w-full items-center justify-center flex-col gap-4">
                <span className="text-white text-3xl">게임 정보를 불러올 수 없습니다</span>
                <button
                    onClick={() => navigate(PATHS.select)}
                    className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 py-3 rounded-xl"
                >
                    게임 선택으로 돌아가기
                </button>
            </div>
        );
    }

    // controls를 GameControls 형식으로 변환
    const controlColors: Array<"blue" | "red" | "green" | "yellow" | "purple" | "pink"> = ["blue", "red", "green", "yellow", "purple", "pink"];
    const choices = gameDetail.controls.map((control, index) => ({
        title: control.keyName,
        titleColor: controlColors[index % controlColors.length],
        options: control.key.map(k => `"${k}"`)
    }));

    // tutorial을 HowToPlay 형식으로 변환
    const tutorialDescriptions = gameDetail.tutorial.map(t => t.description);

    // 실전은 Unity에서 실행 가능한 게임이면 연습 여부와 상관없이 시작할 수 있다
    const canStart = Boolean(practice.pluginId) && practice.status !== "unsupported";

    const handleStartLive = async () => {
        if (practice.status === "running") await practice.abort();
        navigate(PATHS.play, { state: { gameId: gameDetail.id }, viewTransition: true });
    };

    return (
        <div className="flex h-full w-full pr-10 pl-10 pt-6 pb-6 gap-6">
            {/* 1. 좌측 영역 */}
            <div className="flex flex-1 flex-col gap-3">
                {/* 1-1. 상단 */}
                <div className="h-[130px] w-full flex flex-row items-center gap-6">
                    <img
                        src={gameDetail.logoUrl}
                        className={"w-28 h-28 rounded-xl border-black object-cover"}
                        alt={gameDetail.name}
                        onError={(e) => {
                            e.currentTarget.src = fallbackLogoUrl;
                        }}
                    />
                    <div className="flex flex-col">
                        <span className="text-2xl font-black text-yellow-300">연습 모드</span>
                        <p className={"font-black text-7xl text-white leading-none"}>{gameDetail.name}</p>
                    </div>
                </div>

                {/* 1-2. 중단: Unity (로딩·초기화·오류 동안만 시작 화면이 덮는다. 연습이 끝나면 Unity 결과 화면을 그대로 둔다) */}
                <div className="relative flex-1 w-full overflow-hidden rounded-xl">
                    <UnityPlayer
                        unityProvider={unityProvider}
                        isLoaded={isLoaded}
                        loadingProgression={loadingProgression}
                    />
                    {practice.status !== "running" && (practice.practiceCount === 0 || practice.status === "error" || practice.status === "unsupported") && (
                        <GameStageOverlay
                            eyebrow="튜토리얼"
                            title={gameDetail.name}
                            logoUrl={gameDetail.logoUrl || undefined}
                            message={statusText(practice.status, practice.error)}
                            error={practice.status === "error" || practice.status === "unsupported"}
                            progress={isLoaded ? undefined : loadingProgression}
                        />
                    )}
                    <HostPromptPopup prompt={practice.prompt} onSelect={practice.selectHostOption} />

                    {/* 연습이 끝나면 다시 연습할지, 실전으로 갈지 고른다 */}
                    {practice.status === "ready" && practice.practiceCount > 0 && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 animate-fade-in motion-reduce:animate-none">
                            <div className="flex flex-col items-center gap-6 rounded-3xl border-2 border-yellow-500 bg-gray-950 px-12 py-10 shadow-[0_0_40px_rgba(234,179,8,0.4)] animate-page-in motion-reduce:animate-none">
                                <div className="text-5xl font-black text-white">연습이 끝났어요!</div>
                                <div className="text-2xl font-bold text-white/75">한 번 더 연습할까요?</div>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={practice.restart}
                                        className="rounded-2xl bg-pink-700 px-8 py-4 text-2xl font-black text-white transition-colors hover:bg-pink-600 active:scale-95"
                                    >
                                        다시 연습하기
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleStartLive}
                                        disabled={!canStart}
                                        className="rounded-2xl bg-green-600 px-8 py-4 text-2xl font-black text-white transition-colors hover:bg-green-500 active:scale-95 disabled:opacity-40"
                                    >
                                        실전 시작하기
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 1-3. 하단 */}
                <GameControls
                    choices={choices}
                    onStart={handleStartLive}
                    startLabel="시작하기"
                    startDisabled={!canStart}
                />
            </div>

            {/* 2. 우측 영역 */}
            <div className="flex flex-col w-[550px] gap-3 min-h-0">
                {/* 2-1. 상단 */}
                <HowToPlay
                    title="게임 방법"
                    subtitle="How to Play"
                    icon="🎮"
                    descriptions={tutorialDescriptions}
                    question={gameDetail.description}
                />
                {/* 2-2. 하단 */}
                <div className="flex-[1] w-full border-2 flex border-purple-500 justify-center items-center text-white text-2xl font-black min-h-0">
                    CAM / CHAT BOX AREA
                </div>
            </div>
        </div>
    );
}
