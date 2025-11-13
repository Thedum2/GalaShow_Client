import UnityPlayer from "@/bridge/UnityPlayer";
import {useUnity} from "@/bridge/useUnity";
import React from "react";
import GameControls from "@/components/tutorial/GameControls";
import HowToPlay from "@/components/tutorial/HowToPlay";
import {useNavigate} from "react-router-dom";
import { PATHS } from "@/routes/paths";

export default function Tutorial() {
    const {unityProvider, isLoaded, loadingProgression} = useUnity();
    const navigate = useNavigate();

    return (

        <div className="flex h-full w-full pr-10 pl-10 pt-6 pb-6 gap-6">
            {/* 1. 좌측 영역 */}
            <div className="flex flex-1 flex-col gap-3">

                {/* 1-1. 상단 */}
                <div className="h-[130px] w-full flex flex-row items-center gap-6">
                    <img
                        src="https://d1yviy8q74fot9.cloudfront.net/samplelogo.png"
                        className={"w-28 h-28 rounded-xl border-black"}
                        alt=""
                    />
                    <p className={"font-black text-8xl text-white"}>트롤리 딜레마</p>
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
                    choices={[
                        {
                            title: "왼쪽 선택",
                            titleColor: "blue",
                            options: ['"1"', '"1번"', '"원쪽"']
                        },
                        {
                            title: "오른쪽 선택",
                            titleColor: "red",
                            options: ['"2"', '"2번"', '"오른쪽"']
                        }
                    ]}
                    onRestart={()=>{navigate(PATHS.result)}}
                />
            </div>

            {/* 2. 우측 영역 */}
            <div className="flex flex-col w-[550px] gap-3 min-h-0">
                {/* 2-1. 상단 */}
                <HowToPlay
                    title="게임 방법"
                    subtitle="How to Play"
                    icon="🚋"
                    descriptions={[
                        "브레이커가 고장난 기차가 5명이 있는 선로로 달려갑니다.",
                        "스트리머가 레버를 당기면 1명이 있는 선로로 바뀝니다."
                    ]}
                    question="당신은 스트리머의 선택을 맞출 수 있을까요?"
                />
                {/* 2-2. 하단 */}
                <div className="flex-[1] w-full border-2 flex border-purple-500 justify-center items-center text-white text-2xl font-black min-h-0">
                    CAM / CHAT BOX AREA
                </div>
            </div>
        </div>
    );
}
