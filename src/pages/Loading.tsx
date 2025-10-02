import React, {useEffect, useState} from "react";
import {Icon} from "@/components/icons";
import {backgroundService} from "@/services/backgroundService";
import ProgressBar from "@ramonak/react-progress-bar";
import { useNavigate } from 'react-router-dom';
import {PATHS} from "@/routes/paths";

export default function Loading() {
    const [progress, setProgress] = useState(0);
    const avatarUrl = 'https://yt3.googleusercontent.com/aBBmBfA_6zGskSPx65DMzPDbOczqRkl_FPj05OiUfsXD3AhE0jevgR0ERIH44J1wNGixAkztmfM=s900-c-k-c0x00ffffff-no-rj';
    const navigate = useNavigate();

    useEffect(() => {
        backgroundService.hide();
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

    useEffect(() => {
        if (progress >= 100) {
            navigate(PATHS.select);
        }
    }, [progress, navigate]);

    return (
        <div className="h-full w-full text-white flex items-center justify-center">
            <div className="flex flex-col items-center gap-10">
                <div className="flex items-center gap-10">

                    <div className="relative h-[175px] w-[175px] rounded-full ring-4 ring-red-500 overflow-hidden">
                        <img
                            src={avatarUrl}
                            alt="avatar"
                            className="h-full w-full object-cover"
                        />
                    </div>

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
