import UnityPlayer from "@/bridge/UnityPlayer";
import {useUnity} from "@/bridge/useUnity";
import React, { useState, useEffect } from "react";
import GameControls from "@/components/tutorial/GameControls";
import HowToPlay from "@/components/tutorial/HowToPlay";
import {useNavigate, useLocation} from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { MinigameApi } from "@/api/modules/MinigameApi";
import { MinigameDetail, ControlKey } from "@/api/model/response/minigame/MinigameDetail";

export default function Tutorial() {
    const {unityProvider, isLoaded, loadingProgression} = useUnity();
    const navigate = useNavigate();
    const location = useLocation();
    const gameId = (location.state as { gameId?: number })?.gameId;

    const [gameDetail, setGameDetail] = useState<MinigameDetail | null>(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(true);

    // 게임 상세 정보 로드
    useEffect(() => {
        if (!gameId) {
            console.error('No gameId provided');
            setIsLoadingDetail(false);
            return;
        }

        const loadGameDetail = async () => {
            try {
                setIsLoadingDetail(true);
                const detail = await MinigameApi.get(gameId);
                setGameDetail(detail);
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
                            e.currentTarget.src = "https://d1yviy8q74fot9.cloudfront.net/samplelogo.png";
                        }}
                    />
                    <p className={"font-black text-8xl text-white"}>{gameDetail.name}</p>
                </div>

                {/* 1-2. 중단 */}
                <div className="flex-1 w-full">
                    <UnityPlayer
                        unityProvider={unityProvider}
                        isLoaded={isLoaded}
                        loadingProgression={loadingProgression}
                    />
                </div>

                {/* 1-3. 하단 */}
                <GameControls
                    choices={choices}
                    onRestart={() => {navigate(PATHS.result)}}
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
