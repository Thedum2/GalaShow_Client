import React from "react";
import {Outlet} from "react-router-dom";
import FitStage from "@/util/FitStage";
import Background from "@/components/Background";

const imgSrc='https://w.wallhaven.cc/full/e8/wallhaven-e8y51o.jpg'

export default function AppLayout() {
    return (
        <>
            <Background
                bgSrc={imgSrc}
                bgAlt=""
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


