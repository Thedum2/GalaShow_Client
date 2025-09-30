import React, {useEffect, useState} from "react";
import { Outlet } from "react-router-dom";
import FitStage from "@/util/FitStage";
import Background from "@/components/Background";
import { BackgroundApi } from "@/api";
import { BackgroundAsset } from "@/api/model/response/background/BackgroundAsset";
import { backgroundService } from "@/services/backgroundService";

export default function AppLayout() {
    const [background, setBackground] = useState<BackgroundAsset | null>(null);
    const [isBackgroundVisible, setIsBackgroundVisible] = useState(backgroundService.getState());

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

    useEffect(() => {
        const unsubscribe = backgroundService.subscribe(setIsBackgroundVisible);
        return () => unsubscribe();
    }, []);

    return (
        <>
            {isBackgroundVisible && (
                <Background
                    bgSrc={background?.url}
                    bgType={background?.type}
                    bgPosition="center"
                    overlayOpacity={0.7}
                />
            )}
            <FitStage
                mode="contain"
            >
                <Outlet/>
            </FitStage>
        </>
    );
}


