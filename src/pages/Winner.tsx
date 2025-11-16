import { useNavigate } from "react-router-dom";
import { PlatformType } from "@/types/common";
import UnityPlayer from "@/bridge/UnityPlayer";
import React from "react";
import { useUnity } from "@/bridge/useUnity";
import { WinnerPanel, RoundResult, WinnerStats } from "@/components/winner";

export default function Winner() {
    const navigate = useNavigate();
    const {unityProvider, isLoaded, loadingProgression} = useUnity();

    // 임시 데이터
    const winnerName = "가나디귀여웡가나디귀여웡가나디귀여웡가나디귀여웡";
    const winnerPlatform: PlatformType = "soop";

    const stats: WinnerStats = {
        totalRounds: 7,
        playTime: "8:43",
        accuracyRate: 45
    };

    const roundResults: RoundResult[] = [
        {
            id: "1",
            name: "트롤리 딜레마",
            percentage: 12.8,
            survived: true,
            logoUrl: "https://e7.pngegg.com/pngimages/359/743/png-clipart-logo-community-text-logo.png"
        },
        {
            id: "2",
            name: "트롤리 딜레마",
            percentage: 88.8,
            survived: true,
            logoUrl: "https://e7.pngegg.com/pngimages/359/743/png-clipart-logo-community-text-logo.png"
        },
        {
            id: "3",
            name: "트롤리 딜레마",
            percentage: 5.8,
            survived: true,
            logoUrl: "https://e7.pngegg.com/pngimages/359/743/png-clipart-logo-community-text-logo.png"
        },
        {
            id: "4",
            name: "트롤리 딜레마",
            percentage: 3.8,
            survived: true,
            logoUrl: "https://e7.pngegg.com/pngimages/359/743/png-clipart-logo-community-text-logo.png"
        },
        {
            id: "5",
            name: "트롤리 딜레마",
            percentage: 1.8,
            survived: true,
            logoUrl: "https://e7.pngegg.com/pngimages/359/743/png-clipart-logo-community-text-logo.png"
        },
        {
            id: "6",
            name: "트롤리 딜레마",
            percentage: 50,
            survived: true,
            logoUrl: "https://e7.pngegg.com/pngimages/359/743/png-clipart-logo-community-text-logo.png"
        },
    ];

    const handleNewGame = () => {
        console.log("새로운 게임 시작");
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
