import React, {useEffect, useState} from "react";
import {Unity} from "react-unity-webgl";
import {Monitor} from "lucide-react";
import {UIBus} from "../bridge/unityConfig";

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
    const dimensions = () => ({width: "1700px", height: "500px"});
    const size = dimensions();

    //==================================
    const [currentBorderColor, setCurrentBorderColor] = useState("cyan");
    useEffect(() => {
        UIBus.onBorderColorChange(setCurrentBorderColor);
    }, []);
    //==================================




    return (
        <div className={`bg-gray-50 p-4 rounded-lg ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Monitor size={20}/>
                    Unity WebGL Player
                </h2>
            </div>

            <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={size}>
                <Unity
                    unityProvider={unityProvider}
                    style={{
                        border: `20px solid ${currentBorderColor}`,
                        width: "100%",
                        height: "100%",
                        display: "block"
                    }}
                    className="unity-canvas"
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

                <div className="absolute bottom-2 left-2 text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                    Unity WebGL | {size.width} × {size.height}
                </div>
                <div className="absolute bottom-2 right-2 text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                    {isLoaded ? "Ready" : "Loading"}
                </div>
            </div>

            <div className="mt-3 space-y-1">
                <div className="flex items-center text-sm">
                    <span className="text-gray-600">상태: </span>
                    <span className={`font-medium ${isLoaded ? "text-green-600" : "text-yellow-600"}`}>
                        {isLoaded ? "Loaded" : `Loading ${Math.round(loadingProgression * 100)}%`}
                    </span>
                </div>

                <div className="flex items-center text-sm">
                    <span className="text-gray-600">해상도: </span>
                    <span className="text-gray-800 font-mono">
                        {size.width} × {size.height}
                    </span>
                </div>

                <div className="flex items-center text-sm">
                    <span className="text-gray-600">테두리 색상: </span>
                    <span className="text-gray-800 font-mono">
                        {currentBorderColor}
                    </span>
                </div>
            </div>
        </div>
    );
};
export default UnityPlayer;
