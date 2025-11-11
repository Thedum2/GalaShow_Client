import UnityPlayer from "@/bridge/UnityPlayer";
import {useUnity} from "@/bridge/useUnity";

export default function Tutorial() {
    const {unityProvider, isLoaded, loadingProgression} = useUnity();

    return (

        <div className="flex h-full w-full pr-10 pl-10 pt-3 pb-3 gap-6">
            {/* 1. 좌측 영역 */}
            <div className="flex flex-1 flex-col gap-3">

                {/* 2-1. 상단 */}
                <div className="h-[130px] w-full border-2 flex border-green-600"></div>


                {/* 2-1. 중단 */}
                <div className="flex-1 w-full border-2 flex border-yellow-600">

                    <UnityPlayer
                        unityProvider={unityProvider}
                        isLoaded={isLoaded}
                        loadingProgression={loadingProgression}
                    />


                </div>


                {/* 2-1. 하단 */}
                <div className="h-[130px] w-full border-2 flex border-white"></div>
            </div>

            {/* 2. 우측 영역 */}
            <div className="flex flex-col w-[550px] gap-3 min-h-0">
                {/* 2-1. 상단 */}
                <div className="grow-[2] w-full border-2 flex border-orange-600 justify-center items-center text-white text-2xl font-black">

                </div>
                {/* 2-2. 하단 */}
                <div className="grow-[1] flex-1 w-full border-2 flex border-purple-500 justify-center items-center text-white text-2xl font-black">
                    CAM / CHAT BOX AREA
                </div>
            </div>
        </div>
    );
}
