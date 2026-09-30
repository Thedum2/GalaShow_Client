import React from "react";
import {Unity} from "react-unity-webgl";

interface UnityPlayerProps {
    unityProvider: any;
    isLoaded: boolean;
    loadingProgression: number;
    className?: string;
}

const UnityPlayer: React.FC<UnityPlayerProps> = ({
                                                     unityProvider,
                                                     isLoaded,
                                                     loadingProgression,
                                                     className = ""
                                                 }) => {
    const dimensions = () => ({width: "100%", height: "100%"});
    const size = dimensions();

    return (
        <div className={`relative ${className}`} style={size}>
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

            {/* 로딩 화면: Unity 캔버스(초기 화면 포함)를 완전히 가린다 */}
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-black text-white">
                    <div className="text-center">
                        <div className="text-3xl font-black tracking-widest text-yellow-300 mb-5">GALASHOW</div>
                        <div className="w-64 h-2.5 bg-white/10 rounded-full mx-auto overflow-hidden">
                            <div
                                className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                                style={{width: `${loadingProgression * 100}%`}}
                            />
                        </div>
                        <div className="text-lg font-bold text-white/70 mt-3">게임 불러오는 중... {Math.round(loadingProgression * 100)}%</div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default UnityPlayer;
