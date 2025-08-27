import React from "react";
import { Outlet } from "react-router-dom";
import FitStage from "@/util/FitStage";
import Background from "@/components/Background";
import { BackgroundType } from "@/types/common";

const backgroundSources = [
    { src: 'https://w.wallhaven.cc/full/e8/wallhaven-e8y51o.jpg', type: 'image' as BackgroundType },
    { src: 'https://d1yviy8q74fot9.cloudfront.net/galashowvideosample.mp4', type: 'video' as BackgroundType },
];

export default function AppLayout() {

    const currentBg = backgroundSources[1];

    return (
        <>
            <Background
                bgSrc={currentBg.src}
                bgType={currentBg.type}
                bgPosition="center"
                overlayOpacity={0.8}
            />
            <FitStage
                mode="contain"
            >
                <Outlet/>
            </FitStage>
        </>
    );
}


