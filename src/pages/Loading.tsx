import React, {useEffect, useState} from "react";
import {Icon} from "@/components/icons";
import {backgroundService} from "@/services/backgroundService";

export default function Loading() {
    const [progress, setProgress] = useState(0);
    const avatarUrl = 'https://yt3.googleusercontent.com/aBBmBfA_6zGskSPx65DMzPDbOczqRkl_FPj05OiUfsXD3AhE0jevgR0ERIH44J1wNGixAkztmfM=s900-c-k-c0x00ffffff-no-rj';


    useEffect(() => {
        backgroundService.hide();
        const id = setInterval(() => {
            setProgress((p) => (p >= 100 ? 100 : p + 2));
        }, 200);
        return () => {
            clearInterval(id);
        };
    }, []);

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

                    <div className="text-9xl font-black select-none">×</div>

                    <div className="flex items-center gap-4">
                        <Icon name="logo" size={175} mode="eager"/>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-4 w-[560px] max-w-[80vw]">
                        <div className="h-3 w-full rounded-full bg-white/20 border border-white/50 overflow-hidden">
                            <div
                                className="h-full bg-white transition-[width] duration-150 ease-out"
                                style={{width: `${progress}%`}}
                            />
                        </div>
                        <span className="text-xl text-white/80 w-10 text-right">{progress}%</span>
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
