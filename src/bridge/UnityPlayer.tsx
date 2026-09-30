import React, {useEffect, useState} from "react";
import {Unity} from "react-unity-webgl";

interface UnityPlayerProps {
    unityProvider: any;
    isLoaded: boolean;
    loadingProgression: number;
    /** Unity 초기화 실패 (useUnity().loadError) */
    loadError?: Error | null;
    className?: string;
}

/** 진행률이 이 시간(ms) 동안 그대로면 "오래 걸린다" 안내와 다시 시도 버튼을 보여 준다 */
const STALL_MS = 30000;

/**
 * Unity 캔버스. 로딩이 끝나기 전에는 캔버스를 숨기고 로딩 화면을 덮는다.
 * 불러오지 못했거나 오래 멈춰 있으면 안내와 [다시 시도]를 보여 준다.
 */
const UnityPlayer: React.FC<UnityPlayerProps> = ({
                                                     unityProvider,
                                                     isLoaded,
                                                     loadingProgression,
                                                     loadError = null,
                                                     className = ""
                                                 }) => {
    const [stalled, setStalled] = useState(false);

    // 진행률이 바뀔 때마다 멈춤 타이머를 다시 건다
    useEffect(() => {
        setStalled(false);
        if (isLoaded) return;
        const timer = setTimeout(() => setStalled(true), STALL_MS);
        return () => clearTimeout(timer);
    }, [isLoaded, loadingProgression]);

    const failed = Boolean(loadError);
    const percent = Math.round(loadingProgression * 100);

    return (
        <div className={`relative ${className}`} style={{width: "100%", height: "100%"}}>
            <Unity
                unityProvider={unityProvider}
                style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                    // 로딩이 끝나기 전 Unity가 그리는 첫 화면이 비치지 않게 숨긴다
                    visibility: isLoaded ? "visible" : "hidden"
                }}
            />

            {/* 로딩 화면: 불러오는 동안·실패했을 때 Unity 영역을 가린다 */}
            {(!isLoaded || failed) && (
                <div className="absolute inset-0 flex items-center justify-center bg-black text-white">
                    <div className="flex flex-col items-center text-center">
                        <div className="text-3xl font-black tracking-widest text-yellow-300 mb-5">GALASHOW</div>
                        {failed ? (
                            <div className="text-xl font-bold text-red-300">게임 화면을 불러오지 못했어요</div>
                        ) : (
                            <>
                                <div className="w-64 h-2.5 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full bg-yellow-400 rounded-full transition-all duration-300 ${percent === 0 ? "w-1/4 animate-pulse" : ""}`}
                                        style={percent === 0 ? undefined : {width: `${percent}%`}}
                                    />
                                </div>
                                <div className="text-lg font-bold text-white/70 mt-3">
                                    {percent >= 100 ? "게임 준비 중..." : `게임 불러오는 중...${percent > 0 ? ` ${percent}%` : ""}`}
                                </div>
                                {stalled && <div className="text-base text-white/50 mt-2">불러오는 데 시간이 오래 걸리고 있어요</div>}
                            </>
                        )}
                        {(failed || stalled) && (
                            <button
                                type="button"
                                onClick={() => window.location.reload()}
                                className="mt-5 rounded-xl bg-yellow-400 px-6 py-2.5 text-lg font-black text-gray-900 hover:bg-yellow-300 active:scale-95"
                            >
                                다시 시도
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
export default UnityPlayer;
