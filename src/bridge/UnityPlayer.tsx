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
        <div style={size}>
            <Unity
                unityProvider={unityProvider}
                style={{
                    width: "100%",
                    height: "100%",
                    display: "block"
                }}
            />

            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-4 mx-auto"/>
                        <div className="text-xl font-semibold mb-2">Unity Loading...</div>
                        <div className="text-sm opacity-75 mb-4">{Math.round(loadingProgression * 100)}%</div>
                        <div className="w-48 h-2 bg-gray-700 rounded-full mx-auto">
                            <div
                                className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                                style={{width: `${loadingProgression * 100}%`}}
                            />
                        </div>
                        <div className="text-xs opacity-50 mt-4">WebGL 빌드를 불러오는 중...</div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default UnityPlayer;
