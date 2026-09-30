import React, {useEffect, useState} from "react";
import {Icon} from "@/components/icons";
import ProgressBar from "@ramonak/react-progress-bar";
import { useNavigate } from 'react-router-dom';
import {PATHS} from "@/routes/paths";
import HostAvatar from "@/components/common/HostAvatar";

// 100%를 채운 뒤 다음 화면으로 넘어가기 전에 머무는 시간
const HOLD_AT_FULL_MS = 450;

export default function Loading() {
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const id = setInterval(() => {
            setProgress((p) => {
                if (p >= 100) {
                    clearInterval(id);
                    return 100;
                }
                return p + 1;
            });
        }, 50);
        return () => {
            clearInterval(id);
        };
    }, []);

    // 다 채워진 막대를 잠깐 보여준 뒤 교차 페이드로 선택 화면에 넘어간다.
    useEffect(() => {
        if (progress < 100) return;
        const timer = setTimeout(() => navigate(PATHS.select, { viewTransition: true }), HOLD_AT_FULL_MS);
        return () => clearTimeout(timer);
    }, [progress, navigate]);

    return (
        <div className="h-full w-full text-white flex items-center justify-center animate-page-in motion-reduce:animate-none">
            <div className="flex flex-col items-center gap-10">
                <div className="flex items-center gap-10">

                    {/* 홈에서 고른 메인 프로필(방송 호스트)의 사진 */}
                    <HostAvatar size={175} />

                    <div className="text-9xl font-black select-none text-red-500">×</div>

                    <div className="flex items-center gap-4">
                        <Icon name="logo" size={175} mode="eager"/>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4 w-[560px] max-w-[80vw]">
                        <div className="w-full">
                            <ProgressBar
                                className={"border-2 border-gray-200 rounded-full"}
                                completed={Math.min(progress, 100)}
                                bgColor="rgb(0 0 0)"
                                baseBgColor='rgb(229 231 235)'
                                height="15px"
                                isLabelVisible={false}
                                transitionDuration="0.05s"
                                transitionTimingFunction="linear"
                                borderRadius="9999px"
                                animateOnRender={true}
                            />
                        </div>
                        <span className="text-xl text-white/80 w-10 text-right">{Math.min(progress, 100)}%</span>
                    </div>
                    <div className="text-xl text-white/80 w-full text-center">
                <span>
                  <span className="text-white">“갈라쇼”의 </span>
                  <span className="text-red-400 font-black">데이터를 받아오는 중......</span>
                </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
