import React, {useEffect, useState} from "react";
import { Outlet } from "react-router-dom";
import FitStage from "@/util/FitStage";
import Background from "@/components/Background";
import { BackgroundApi } from "@/api";
import { BackgroundAsset } from "@/api/model/response/background/BackgroundAsset";

export default function AppLayout() {
    const [background, setBackground] = useState<BackgroundAsset | null>(null);

    useEffect(() => {
        BackgroundApi.get()
            .then(backgrounds => {
                if (backgrounds.length > 0) {
                    const randomIndex = Math.floor(Math.random() * backgrounds.length);
                    setBackground(backgrounds[randomIndex]);
                }
            })
            .catch(console.error);
    }, []);

    return (
        <>
            <Background
                bgSrc={background?.url}
                bgType={background?.type}
                bgPosition="center"
                overlayOpacity={0.7}
            />
            <FitStage
                mode="contain"
            >
                <Outlet/>
            </FitStage>
        </>
    );
}


